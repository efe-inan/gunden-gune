/**
 * supabase.js
 * Supabase İstemcisi ve Bulut Senkronizasyon Katmanı
 * 
 * - Kullanıcı oturum açmamışsa (varsayılan) uygulama %100 yerel (localStorage) çalışır.
 * - Kullanıcı oturum açtığında:
 *    1. Yerel veriler ile bulut verileri zaman damgasına göre (updated_at) birleştirilir.
 *    2. Oturum açık olduğu sürece yerel değişiklikler arka planda bulut tablosuna (user_journeys) senkronize edilir.
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env?.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env?.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  SUPABASE_URL &&
  SUPABASE_ANON_KEY &&
  !SUPABASE_URL.includes('your-project-id')
);

export const supabase = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
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
