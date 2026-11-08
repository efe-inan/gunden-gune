/**
 * supabase.js
 * Supabase İstemcisi ve Bulut Senkronizasyon Katmanı
 *
 * - Kullanıcı oturum açmamışsa (varsayılan) uygulama %100 yerel (localStorage) çalışır.
 * - Kullanıcı oturum açtığında:
 *    1. Yerel ve bulut yolculukları karşılaştırılır (decideSyncDirection) ve ilerlemesi
 *       fazla olan taraf diğerine yazılır.
 *    2. Oturum açık olduğu sürece yerel değişiklikler kısa bir gecikmeyle buluta gönderilir.
 *
 * Not: Uygulama sayfa geçişleri için URL hash'ini (#today, #settings) kullandığından,
 * giriş dönüşünde token'ları hash yerine sorgu parametresinde (?code=...) taşıyan
 * PKCE akışı kullanılır.
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env?.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env?.VITE_SUPABASE_ANON_KEY || '';
const PUSH_DEBOUNCE_MS = 1500;

export const isSupabaseConfigured = Boolean(
  SUPABASE_URL &&
  SUPABASE_ANON_KEY &&
  !SUPABASE_URL.includes('your-project-id')
);

export const supabase = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        flowType: 'implicit',
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

/**
 * E-posta ile şifresiz Magic Link gönderir
 * @param {string} email
 * @param {string} [redirectHash='#today']
 * @param {object} [metadata={}] Kullanıcı metadatasına eklenecek geçici durum (ör. tamamlanmış onboarding)
 */
export async function signInWithEmail(email, redirectHash = '#today', metadata = {}) {
  if (!supabase) {
    return { error: new Error('Bulut servisi henüz yapılandırılmamış.') };
  }
  if (metadata?.pending_state?.profile?.onboardingCompleted && typeof supabase.rpc === 'function') {
    try {
      await supabase.rpc('stash_pending_onboarding', {
        p_email: email,
        p_state: metadata.pending_state,
      });
    } catch {
      // RPC mevcut değilse veya ağ hatası olursa oturum açma akışını kesme
    }
  }
  const cleanHash = redirectHash.startsWith('#') ? redirectHash : `#${redirectHash}`;
  const redirectTo = typeof window !== 'undefined' ? `${window.location.origin}/${cleanHash}` : undefined;
  return await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: redirectTo,
      data: metadata,
    },
  });
}

/**
 * Oturumu kapatır
 */
export async function signOut() {
  if (!supabase) return { error: null };
  return await supabase.auth.signOut();
}

/**
 * URL içinde bulunan #access_token, ?token_hash veya ?code parametrelerini çözerek oturumu kurar.
 */
async function resolveSessionFromUrl() {
  if (!supabase || typeof window === 'undefined') return null;

  try {
    const rawHash = window.location.hash || '';
    if (rawHash.includes('access_token=')) {
      const tokenPart = rawHash.slice(rawHash.indexOf('access_token='));
      const hashParams = new URLSearchParams(tokenPart);
      const access_token = hashParams.get('access_token');
      const refresh_token = hashParams.get('refresh_token');
      if (access_token && refresh_token) {
        const { data } = await supabase.auth.setSession({ access_token, refresh_token });
        if (data?.session) return data.session;
      }
    }

    const searchParams = new URLSearchParams(window.location.search || '');
    const token_hash = searchParams.get('token_hash');
    const type = searchParams.get('type');
    if (token_hash && type && typeof supabase.auth.verifyOtp === 'function') {
      const { data } = await supabase.auth.verifyOtp({ token_hash, type });
      if (data?.session) return data.session;
    }

    const code = searchParams.get('code');
    if (code && typeof supabase.auth.exchangeCodeForSession === 'function') {
      const { data } = await supabase.auth.exchangeCodeForSession(code);
      if (data?.session) return data.session;
    }
  } catch {
    // detectSessionInUrl zaten işlemiş olabilir; getSession() ile devam et
  }

  const sessionPromise = supabase.auth.getSession();
  const timeoutPromise = new Promise(resolve => setTimeout(() => resolve({ data: { session: null } }), 4500));
  const { data } = await Promise.race([sessionPromise, timeoutPromise]);
  return data?.session || null;
}

/**
 * Doğrulanmış kullanıcı için yerel durum ile bulut tablosunu (veya bekleyen onboarding kaydını) uzlaştırır.
 */
async function reconcileUserState(user, storage, onCloudApplied) {
  if (!user || !storage) return;

  const setAuthenticatedFlag = () => {
    storage.updateState(currentState => ({
      ...currentState,
      auth: {
        isAuthenticated: true,
        user: { id: user.id, email: user.email },
      },
    }));
  };

  setAuthenticatedFlag();

  let cloudRow = await fetchCloudState(user);

  if (!cloudRow?.state?.profile?.onboardingCompleted && typeof supabase?.rpc === 'function') {
    try {
      const { data: claimedState } = await supabase.rpc('claim_pending_onboarding');
      if (claimedState?.profile?.onboardingCompleted) {
        cloudRow = { state: claimedState, updated_at: new Date().toISOString() };
      }
    } catch {
      // RPC hatası olursa normal akışla devam et
    }
  }

  const currentState = storage.getState();
  const direction = decideSyncDirection(currentState, cloudRow);

  if (direction === 'pull') {
    const result = storage.importDataJSON(JSON.stringify(cloudRow.state));
    setAuthenticatedFlag();
    if (result?.ok && typeof onCloudApplied === 'function') {
      onCloudApplied();
    }
  } else if (direction === 'push') {
    setAuthenticatedFlag();
    await syncLocalStateToCloud(storage.getState(), user);
    if (typeof onCloudApplied === 'function') {
      onCloudApplied();
    }
  } else if (direction === 'none') {
    const pending = user?.user_metadata?.pending_state;
    if (pending?.profile?.onboardingCompleted) {
      const result = storage.importDataJSON(JSON.stringify(pending));
      setAuthenticatedFlag();
      if (result?.ok) {
        await syncLocalStateToCloud(storage.getState(), user);
        if (typeof onCloudApplied === 'function') {
          onCloudApplied();
        }
      }
    }
  }
}

/**
 * İlk sayfa yüklemesinde auth oturumunu doğrular ve gerekirse bulut eşitlemesini tamamlar.
 * Magic link veya PKCE dönüşü (?code=... / #access_token=...) olduğunda yönlendirme korumaları
 * çalışmadan önce çağrılarak oturumun ve yolculuk verisinin hazır olmasını garanti eder.
 */
export async function handleInitialAuth(storage) {
  if (!supabase || !storage || typeof window === 'undefined') return null;

  try {
    const session = await resolveSessionFromUrl();
    if (session?.user) {
      await reconcileUserState(session.user, storage);
      return session.user;
    }
  } catch (err) {
    console.warn('handleInitialAuth sırasında beklenmeyen hata:', err);
  }
  return null;
}

/**
 * Mevcut kullanıcı oturumunu döner
 */
export async function getCurrentUser() {
  if (!supabase) return null;
  const { data: { user } } = await supabase.auth.getUser();
  return user || null;
}

/**
 * Buluttaki yolculuk durumunu çeker
 */
export async function fetchCloudState(knownUser = null) {
  if (!supabase) return null;
  const user = knownUser || (await getCurrentUser());
  if (!user) return null;

  const { data, error } = await supabase
    .from('user_journeys')
    .select('state, updated_at')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error || !data) {
    return null;
  }
  return data;
}

/**
 * Yerel durumu buluta kaydeder (Upsert)
 */
export async function syncLocalStateToCloud(localState, knownUser = null) {
  if (!supabase || !localState) return false;
  const user = knownUser || (await getCurrentUser());
  if (!user) return false;

  const { error } = await supabase
    .from('user_journeys')
    .upsert({
      user_id: user.id,
      state: localState,
    }, { onConflict: 'user_id' });

  return !error;
}

function progressOf(state) {
  const onboarded = Boolean(state?.profile?.onboardingCompleted);
  const completed = Array.isArray(state?.journey?.completedDays) ? state.journey.completedDays.length : 0;
  const lastActionTime = Date.parse(state?.journey?.lastActionDate || '') || 0;
  return { onboarded, completed, lastActionTime };
}

/**
 * Oturum açıldığında hangi yönde eşitleme yapılacağına karar verir.
 * @returns {'push'|'pull'|'none'} push: yereli buluta yaz, pull: bulutu yerele al
 */
export function decideSyncDirection(localState, cloudRow) {
  const local = progressOf(localState);
  const cloud = progressOf(cloudRow?.state);

  if (!cloud.onboarded) {
    return local.onboarded ? 'push' : 'none';
  }
  if (!local.onboarded) {
    return 'pull';
  }
  if (cloud.completed !== local.completed) {
    return cloud.completed > local.completed ? 'pull' : 'push';
  }
  return cloud.lastActionTime > local.lastActionTime ? 'pull' : 'push';
}

/**
 * Oturum değişikliklerini dinleyip yerel durum ile bulutu eşitler.
 * @param {object} deps
 * @param {object} deps.storage StorageService örneği
 * @param {(user: object|null) => void} [deps.onAuthChange] Oturum değiştiğinde çağrılır
 * @param {() => void} [deps.onCloudApplied] Buluttaki yolculuk yerele yazıldığında çağrılır
 */
export function initCloudSync({ storage, onAuthChange, onCloudApplied } = {}) {
  if (!supabase || !storage || typeof window === 'undefined') {
    return () => {};
  }

  let currentUserId = null;
  let pushTimer = null;

  const reconcile = async () => {
    const user = await getCurrentUser();
    if (!user) return;
    await reconcileUserState(user, storage, onCloudApplied);
  };

  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    const user = session?.user || null;
    const previousUserId = currentUserId;
    currentUserId = user?.id || null;

    if (typeof onAuthChange === 'function') {
      onAuthChange(user);
    }

    if (user) {
      storage.updateState(currentState => ({
        ...currentState,
        auth: {
          isAuthenticated: true,
          user: { id: user.id, email: user.email },
        },
      }));
    } else {
      storage.updateState(currentState => ({
        ...currentState,
        auth: {
          isAuthenticated: false,
          user: null,
        },
      }));
    }

    // Supabase, callback içinde başka auth çağrısı yapılmasını önermediği için işi bir sonraki tura bırakıyoruz.
    if (currentUserId && currentUserId !== previousUserId) {
      setTimeout(() => {
        reconcile().catch(() => {});
      }, 0);
    }
  });

  const onStateUpdated = () => {
    if (!currentUserId) return;
    clearTimeout(pushTimer);
    pushTimer = setTimeout(() => {
      syncLocalStateToCloud(storage.getState()).catch(() => {});
    }, PUSH_DEBOUNCE_MS);
  };
  window.addEventListener('appstateupdated', onStateUpdated);

  return () => {
    clearTimeout(pushTimer);
    window.removeEventListener('appstateupdated', onStateUpdated);
    data?.subscription?.unsubscribe();
  };
}
