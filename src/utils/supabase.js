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
        flowType: 'pkce',
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

/**
 * E-posta ile şifresiz Magic Link gönderir
 */
export async function signInWithEmail(email) {
  if (!supabase) {
    return { error: new Error('Bulut servisi henüz yapılandırılmamış.') };
  }
  const redirectTo = typeof window !== 'undefined' ? `${window.location.origin}/#settings` : undefined;
  return await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: redirectTo,
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
export async function fetchCloudState() {
  if (!supabase) return null;
  const user = await getCurrentUser();
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
export async function syncLocalStateToCloud(localState) {
  if (!supabase || !localState) return false;
  const user = await getCurrentUser();
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
    const cloudRow = await fetchCloudState();
    const direction = decideSyncDirection(storage.getState(), cloudRow);
    if (direction === 'pull') {
      const result = storage.importDataJSON(JSON.stringify(cloudRow.state));
      if (result?.ok && typeof onCloudApplied === 'function') {
        onCloudApplied();
      }
    } else if (direction === 'push') {
      await syncLocalStateToCloud(storage.getState());
    }
  };

  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    const user = session?.user || null;
    const previousUserId = currentUserId;
    currentUserId = user?.id || null;

    if (typeof onAuthChange === 'function') {
      onAuthChange(user);
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
