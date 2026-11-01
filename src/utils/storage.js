/**
 * storage.js
 * "Günden Güne" Veri & Depolama Servis Katmanı
 */

import tasksData from '../data/tasks.json' with { type: 'json' };
import { computeStageBounds, buildTaskSequence } from './planEngine.js';

const STORAGE_KEY = 'gunden_gune_app_state_v1';

/**
 * Yerel saat dilimine göre YYYY-MM-DD takvim anahtarı üretir (gece yarısı UTC kaymasını önler).
 */
export function getLocalDateKey(date = new Date()) {
  const d = date instanceof Date ? date : new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const DEFAULT_STATE = {
  auth: {
    isAuthenticated: false,
    user: null,
  },
  profile: {
    name: '',
    selectedAreaId: 'finans',
    dailyTimePreference: 10, // 5, 10, 15, 20 dk
    timeOfDayPreference: 'sabah',
    readinessScore: 3,
    answers: {},
    onboardingCompleted: false,
    startedAt: null,
  },
  journey: {
    currentDay: 1, // 1 - 30
    stage: 'tohum', // tohum (1-7), filiz (8-15), govde (16-23), yaprak (24-30)
    adaptiveDifficultyModifier: 0, // -1, 0, +1
    completedDays: [], // [1, 2, ...]
    dayStatusMap: {}, // { "1": { status: 'completed'|'postponed', completedAt: '...', feedback: '...', note: '...' } }
    consecutiveFeedback: {
      type: null, // 'cok_kolay' | 'zorlandim' | 'tam_kivaminda'
      count: 0
    },
    reflectionNotes: [], // [ { day: 1, text: '...', date: '...' } ]
    badges: ['ilk_adim'],
    lastActionDate: null, // ISO string
    todayActionTaken: false, // O gün işlem yapıldı mı (aynı gün 2. görev engeli)
    todayActionDate: null, // YYYY-MM-DD
    taskOrder: null, // Kişiselleştirilmiş 30 günlük görev ID dizisi
    inactivityDismissedDate: null, // 3+ gün ara karşılama kutusunun o gün için kapatıldığı tarih
  },
  archivedJourneys: [], // Geçmiş tamamlanan veya arşivlenen yolculuklar
  settings: {
    reducedMotion: false,
    theme: 'system', // 'system' | 'light' | 'dark'
  }
};

class StorageService {
  constructor() {
    if (typeof window !== 'undefined' && window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (this.getThemePreference() === 'system') {
          this.applyTheme('system', true);
          window.dispatchEvent(new CustomEvent('themechange', {
            detail: { theme: 'system', resolved: this.getResolvedTheme() }
          }));
        }
      });
    }
  }
  getState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return this.initDefaultState();
      }
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_STATE,
        ...parsed,
        profile: { ...DEFAULT_STATE.profile, ...(parsed.profile || {}) },
        journey: { ...DEFAULT_STATE.journey, ...(parsed.journey || {}) },
        settings: { ...DEFAULT_STATE.settings, ...(parsed.settings || {}) },
        auth: { ...DEFAULT_STATE.auth, ...(parsed.auth || {}) }
      };
    } catch (err) {
      console.warn('[StorageService] Veri okunamadı:', err);
      return this.initDefaultState();
    }
  }

  saveState(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      return true;
    } catch (err) {
      console.error('[StorageService] Veri kaydedilemedi:', err);
      return false;
    }
  }

  updateState(updater) {
    const currentState = this.getState();
    const updated = typeof updater === 'function' ? updater(currentState) : { ...currentState, ...updater };
    this.saveState(updated);
    return updated;
  }

  initDefaultState() {
    this.saveState(DEFAULT_STATE);
    return JSON.parse(JSON.stringify(DEFAULT_STATE));
  }

  resetAll() {
    localStorage.removeItem(STORAGE_KEY);
    return this.initDefaultState();
  }

  exportDataJSON() {
    return JSON.stringify(this.getState(), null, 2);
  }

  // --- Yardımcı Mantık Fonksiyonları (PROJE.md 4.3 & 5-6) ---

  /**
   * Günün saatine göre nazik selamlama
   */
  getGreeting() {
    const state = this.getState();
    const trimmed = state.profile.name ? state.profile.name.trim() : '';
    const suffix = trimmed ? `, ${trimmed}` : '';
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      return `Günaydın${suffix}`;
    } else if (hour >= 12 && hour < 18) {
      return `İyi günler${suffix}`;
    } else {
      return `İyi akşamlar${suffix}`;
    }
  }

  /**
   * Günün aşamasını hesaplar (hazırlık ve zorluk durumuna duyarlı sınırlar ile)
   */
  getStageInfo(day, stateOverride = null) {
    const activeState = stateOverride || this.getState();
    const bounds = computeStageBounds(activeState?.profile, activeState?.journey);
    const isLightDay = day === 7 || day === 14 || day === 21;

    if (day <= bounds.tohumEnd) {
      return {
        key: 'tohum',
        title: 'Tohum',
        desc: 'Farkındalık ve çok küçük başlangıç adımları (1–3 dk)',
        isLightDay,
        bounds
      };
    } else if (day <= bounds.filizEnd) {
      return {
        key: 'filiz',
        title: 'Filiz',
        desc: 'Küçük tekrarlayan davranışlar ve alan düzeni (5–7 dk)',
        isLightDay,
        bounds
      };
    } else if (day <= bounds.govdeEnd) {
      return {
        key: 'govde',
        title: 'Gövde',
        desc: 'Gerçek hayatta uygulama ve hafif direnç eşiği (7–12 dk)',
        isLightDay,
        bounds
      };
    } else {
      return {
        key: 'yaprak',
        title: 'Yaprak',
        desc: 'Kalıcı entegrasyon ve bağımsız uygulama (10–15 dk)',
        isLightDay,
        bounds
      };
    }
  }

  /**
   * 3 veya daha fazla gün ara verilip verilmediğini kontrol eder
   */
  checkInactivity(now = new Date()) {
    const state = this.getState();
    if (!state.journey.lastActionDate) return { hasInactivity: false, daysInactive: 0 };

    const refNow = now instanceof Date ? now : new Date(now);
    const last = new Date(state.journey.lastActionDate);
    if (Number.isNaN(last.getTime()) || Number.isNaN(refNow.getTime())) {
      return { hasInactivity: false, daysInactive: 0 };
    }

    if (state.journey.inactivityDismissedDate === getLocalDateKey(refNow)) {
      return { hasInactivity: false, daysInactive: 0 };
    }

    const diffMs = Math.max(0, refNow - last);
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    return {
      hasInactivity: diffDays >= 3,
      daysInactive: diffDays
    };
  }

  /**
   * 3+ gün ara sonrası bir önceki görevi tekrar etmek için sayacı bir adım geri çeker (PROJE.md Bölüm 6)
   */
  repeatPreviousDay(now = new Date()) {
    const todayStr = getLocalDateKey(now);
    return this.updateState(state => {
      const prevDay = Math.max(1, (state.journey.currentDay || 1) - 1);
      const stageInfo = this.getStageInfo(prevDay, state);
      return {
        ...state,
        journey: {
          ...state.journey,
          currentDay: prevDay,
          stage: stageInfo.key,
          todayActionTaken: false,
          todayActionDate: null,
          inactivityDismissedDate: todayStr
        }
      };
    });
  }

  /**
   * 3+ gün ara sonrası zorluk eşiğini bir kademe yumuşatır (PROJE.md Bölüm 6)
   */
  easeDifficulty(now = new Date()) {
    const todayStr = getLocalDateKey(now);
    return this.updateState(state => {
      const nextJourney = {
        ...state.journey,
        adaptiveDifficultyModifier: -1,
        inactivityDismissedDate: todayStr
      };
      const stageInfo = this.getStageInfo(state.journey.currentDay || 1, {
        ...state,
        journey: nextJourney
      });
      return {
        ...state,
        journey: {
          ...nextJourney,
          stage: stageInfo.key
        }
      };
    });
  }

  /**
   * Yeni bir yerel takvim gününe girildiğinde günlük görev sayacını senkronize eder.
   * Tamamlanan günlerde bir sonraki güne geçer; ertelenen günlerde aynı günde kalır.
   */
  syncDailyRollover(now = new Date()) {
    const todayStr = getLocalDateKey(now);
    const state = this.getState();

    if (!state.journey.todayActionTaken || !state.journey.todayActionDate) {
      return state;
    }

    if (state.journey.todayActionDate === todayStr) {
      return state;
    }

    return this.updateState(current => {
      const currentDay = current.journey.currentDay || 1;
      const statusEntry = current.journey.dayStatusMap?.[currentDay];
      const wasCompleted =
        statusEntry?.status === 'completed' ||
        (current.journey.completedDays || []).includes(currentDay);

      const nextDay = wasCompleted && currentDay < 30 ? currentDay + 1 : currentDay;
      const stageInfo = this.getStageInfo(nextDay, current);

      return {
        ...current,
        journey: {
          ...current.journey,
          currentDay: nextDay,
          stage: stageInfo.key,
          todayActionTaken: false,
          todayActionDate: null
        }
      };
    });
  }

  /**
   * Bugün bir işlem yapılıp yapılmadığını kontrol eder
   */
  isTodayActionCompleted(now = new Date()) {
    const state = this.getState();
    const todayStr = getLocalDateKey(now);
    return state.journey.todayActionDate === todayStr && Boolean(state.journey.todayActionTaken);
  }

  /**
   * Görevi tamamla
   */
  completeTask({ feedback = null, reflectionNote = '' } = {}, now = new Date()) {
    const refNow = now instanceof Date ? now : new Date(now);
    const todayStr = getLocalDateKey(refNow);
    const nowIso = refNow.toISOString();

    return this.updateState(state => {
      const currentDay = state.journey.currentDay;
      const completedDays = [...state.journey.completedDays];
      if (!completedDays.includes(currentDay)) {
        completedDays.push(currentDay);
      }

      // Uyarlanabilir zorluk hesabı (PROJE.md Bölüm 6)
      let modifier = state.journey.adaptiveDifficultyModifier || 0;
      let consecutive = { ...(state.journey.consecutiveFeedback || { type: null, count: 0 }) };

      if (feedback === 'cok_kolay') {
        if (consecutive.type === 'cok_kolay') {
          consecutive.count += 1;
          if (consecutive.count >= 2) {
            modifier = Math.min(modifier + 1, 1);
            consecutive = { type: null, count: 0 };
          }
        } else {
          consecutive = { type: 'cok_kolay', count: 1 };
        }
      } else if (feedback === 'zorlandim') {
        if (consecutive.type === 'zorlandim') {
          consecutive.count += 1;
          if (consecutive.count >= 2) {
            modifier = Math.max(modifier - 1, -1);
            consecutive = { type: null, count: 0 };
          }
        } else {
          consecutive = { type: 'zorlandim', count: 1 };
        }
      } else if (feedback === 'tam_kivaminda') {
        consecutive = { type: 'tam_kivaminda', count: 0 };
      }

      // Yansıma notu (aynı gün için güncelle veya yeni ekle)
      const notes = [...state.journey.reflectionNotes];
      if (reflectionNote && reflectionNote.trim()) {
        const noteIdx = notes.findIndex(n => n.day === currentDay);
        if (noteIdx >= 0) {
          notes[noteIdx] = {
            day: currentDay,
            text: reflectionNote.trim(),
            date: nowIso
          };
        } else {
          notes.push({
            day: currentDay,
            text: reflectionNote.trim(),
            date: nowIso
          });
        }
      }

      const prevStatus = state.journey.dayStatusMap[currentDay] || {};
      const dayStatusMap = {
        ...state.journey.dayStatusMap,
        [currentDay]: {
          status: 'completed',
          completedAt: prevStatus.completedAt || nowIso,
          wasPostponed: Boolean(prevStatus.postponedAt || prevStatus.wasPostponed),
          feedback: feedback !== null ? feedback : (prevStatus.feedback || null),
          note: reflectionNote ? reflectionNote.trim() : (prevStatus.note || null)
        }
      };

      return {
        ...state,
        journey: {
          ...state.journey,
          completedDays,
          dayStatusMap,
          adaptiveDifficultyModifier: modifier,
          consecutiveFeedback: consecutive,
          reflectionNotes: notes,
          lastActionDate: nowIso,
          todayActionTaken: true,
          todayActionDate: todayStr
        }
      };
    });
  }

  /**
   * "Bugün olmadı" butonu: erteleme (suçluluksuz)
   */
  postponeTask(now = new Date()) {
    const refNow = now instanceof Date ? now : new Date(now);
    const todayStr = getLocalDateKey(refNow);
    const nowIso = refNow.toISOString();

    return this.updateState(state => {
      const currentDay = state.journey.currentDay;
      const dayStatusMap = {
        ...state.journey.dayStatusMap,
        [currentDay]: {
          status: 'postponed',
          postponedAt: nowIso
        }
      };

      return {
        ...state,
        journey: {
          ...state.journey,
          dayStatusMap,
          lastActionDate: nowIso,
          todayActionTaken: true,
          todayActionDate: todayStr
        }
      };
    });
  }

  /**
   * Bir sonraki güne manuel geçiş (test veya ertesi gün simülasyonu için)
   */
  advanceToNextDay() {
    return this.updateState(state => {
      const nextDay = Math.min(state.journey.currentDay + 1, 30);
      const stageInfo = this.getStageInfo(nextDay);
      return {
        ...state,
        journey: {
          ...state.journey,
          currentDay: nextDay,
          stage: stageInfo.key,
          todayActionTaken: false,
          todayActionDate: null
        }
      };
    });
  }

  /**
   * İlerleme istatistikleri, rozetler ve haftalık özeti hesaplar (PROJE.md 4.4)
   */
  getProgressStats() {
    const state = this.getState();
    const completedDays = state.journey.completedDays || [];
    const dayStatusMap = state.journey.dayStatusMap || {};
    const totalCompleted = completedDays.length;

    // Seri hesabı (ardışık tamamlanan günler)
    let currentStreak = 0;
    let maxStreak = 0;
    let tempStreak = 0;

    for (let day = 1; day <= 30; day++) {
      if (completedDays.includes(day)) {
        tempStreak++;
        if (tempStreak > maxStreak) maxStreak = tempStreak;
      } else {
        tempStreak = 0;
      }
    }

    // Mevcut aktif seri
    for (let day = state.journey.currentDay; day >= 1; day--) {
      if (completedDays.includes(day)) {
        currentStreak++;
      } else if (day === state.journey.currentDay && !state.journey.todayActionTaken) {
        // Bugün henüz yapılmadıysa dünden saymaya devam et
        continue;
      } else {
        break;
      }
    }

    // Rozet değerlendirmesi (PROJE.md 4.4: İlk Adım, 3 Gün, İlk Hafta, Zor Güne Rağmen, 15. Gün, Yolculuğun Sonu)
    const statusDays = Object.keys(dayStatusMap)
      .map(d => parseInt(d, 10))
      .filter(d => !Number.isNaN(d))
      .sort((a, b) => a - b);

    const recoveredSamePostponedDay = statusDays.some(
      d => dayStatusMap[d]?.status === 'completed' && dayStatusMap[d]?.wasPostponed
    );

    const recoveredOnLaterDay = statusDays.some(d => {
      const entry = dayStatusMap[d];
      const wasHardOrPostponed = entry?.feedback === 'zorlandim' || entry?.status === 'postponed' || entry?.wasPostponed;
      if (!wasHardOrPostponed) return false;
      return completedDays.some(laterDay => laterDay > d);
    });

    const hasZorlandimOrPostponedSuccess = recoveredSamePostponedDay || recoveredOnLaterDay;
    const stageBounds = computeStageBounds(state.profile, state.journey);

    const badges = [
      {
        id: 'ilk_adim',
        title: 'İlk adım',
        desc: 'Yolculuğa başladın ve ilk görevini tamamladın',
        isUnlocked: totalCompleted >= 1,
        icon: 'sprout'
      },
      {
        id: '3_gun',
        title: '3 gün',
        desc: '3 gün boyunca kendine vakit ayırdın',
        isUnlocked: totalCompleted >= 3,
        icon: 'flame'
      },
      {
        id: 'ilk_hafta',
        title: 'İlk hafta',
        desc: 'Tohum aşamasının ilk 7 gününü geride bıraktın',
        isUnlocked: totalCompleted >= 7,
        icon: 'calendar'
      },
      {
        id: 'zor_gune_ragmen',
        title: 'Zor güne rağmen',
        desc: 'Zorlandığın ya da ertelediğin bir günün ardından yeniden adım attın',
        isUnlocked: hasZorlandimOrPostponedSuccess,
        icon: 'shield'
      },
      {
        id: '15_gun',
        title: '15. gün',
        desc: 'Yolculuğun yarısını kendi hızında tamamladın',
        isUnlocked: totalCompleted >= 15,
        icon: 'mountain'
      },
      {
        id: 'yolculugun_sonu',
        title: 'Yolculuğun sonu',
        desc: '30 günlük tohumdan yaprağa dönüşümü tamamladın',
        isUnlocked: totalCompleted >= 30,
        icon: 'award'
      }
    ];

    // Haftalık Özet (Hafta 1: 1-7, Hafta 2: 8-14, Hafta 3: 15-21, Hafta 4: 22-28, Hafta 5: 29-30)
    const currentWeekNum = Math.ceil(state.journey.currentDay / 7);
    const weekStartDay = (currentWeekNum - 1) * 7 + 1;
    const weekEndDay = Math.min(currentWeekNum * 7, 30);

    let weekCompletedCount = 0;
    let weekStruggledCount = 0;
    let weekPostponedCount = 0;
    let weekEasyCount = 0;

    for (let d = weekStartDay; d <= weekEndDay; d++) {
      if (completedDays.includes(d)) weekCompletedCount++;
      const st = dayStatusMap[d];
      if (st?.feedback === 'zorlandim') weekStruggledCount++;
      if (st?.feedback === 'cok_kolay') weekEasyCount++;
      if (st?.status === 'postponed' || st?.wasPostponed) weekPostponedCount++;
    }

    let weeklyMessage = 'Bu hafta henüz yeni başlıyor. Küçük bir adımla başlamak her zaman yeterli.';
    if (weekCompletedCount > 0 && weekStruggledCount > 0) {
      weeklyMessage = `Bu hafta ${weekCompletedCount} görevi tamamladın. Zorlandığın ${weekStruggledCount} adıma rağmen vazgeçmeyip ritmini korudun.`;
    } else if (weekCompletedCount > 0 && weekPostponedCount > 0) {
      weeklyMessage = `Bu hafta ${weekCompletedCount} görevi tamamladın. Ara verdiğin günün ardından sakin bir şekilde akışa döndün.`;
    } else if (weekCompletedCount > 0 && weekEasyCount >= 2) {
      weeklyMessage = `Bu hafta ${weekCompletedCount} görevi rahatlıkla tamamladın. Adımlar artık doğal ritminin bir parçası oluyor.`;
    } else if (weekCompletedCount > 0) {
      weeklyMessage = `Bu hafta ${weekCompletedCount} görevi tamamladın. Kendini zorlamadan attığın her adım zihninde yeni bir yer açıyor.`;
    } else if (weekPostponedCount > 0) {
      weeklyMessage = 'Bu hafta kendine nefes alanı bıraktın. Hazır olduğunda kaldığın yerden tek bir küçük adımla devam edebilirsin.';
    }

    return {
      totalCompleted,
      currentStreak,
      maxStreak,
      badges,
      stageBounds,
      archivedJourneys: state.archivedJourneys || [],
      weeklySummary: {
        weekNum: currentWeekNum,
        weekCompletedCount,
        weekTotalDays: weekEndDay - weekStartDay + 1,
        message: weeklyMessage
      },
      reflectionNotes: state.journey.reflectionNotes || []
    };
  }

  /**
   * Profil ayarlarını günceller (PROJE.md 4.5)
   */
  updateProfileSettings({ name, dailyTimePreference }) {
    return this.updateState(state => ({
      ...state,
      profile: {
        ...state.profile,
        name: typeof name === 'string' ? name.trim() : state.profile.name,
        dailyTimePreference: dailyTimePreference ? parseInt(dailyTimePreference, 10) : state.profile.dailyTimePreference
      }
    }));
  }

  /**
   * Alan değiştirme: mevcut ilerlemeyi arşivler veya sıfırlar (PROJE.md 4.5)
   */
  changeArea({ newAreaId, action = 'archive' }) {
    return this.updateState(state => {
      const archived = [...(state.archivedJourneys || [])];

      if (action === 'archive') {
        archived.push({
          areaId: state.profile.selectedAreaId,
          completedDaysCount: state.journey.completedDays.length,
          completedDays: state.journey.completedDays,
          reflectionNotes: state.journey.reflectionNotes,
          archivedAt: new Date().toISOString()
        });
      }

      const nextTaskOrder = buildTaskSequence(tasksData.gorevler, {
        areaId: newAreaId,
        answers: state.profile.answers || {},
        readinessScore: state.profile.readinessScore || 3
      });

      return {
        ...state,
        profile: {
          ...state.profile,
          selectedAreaId: newAreaId
        },
        archivedJourneys: archived,
        journey: {
          currentDay: 1,
          stage: 'tohum',
          adaptiveDifficultyModifier: 0,
          completedDays: [],
          dayStatusMap: {},
          consecutiveFeedback: { type: null, count: 0 },
          reflectionNotes: [],
          badges: ['ilk_adim'],
          lastActionDate: null,
          todayActionTaken: false,
          todayActionDate: null,
          taskOrder: nextTaskOrder,
          inactivityDismissedDate: null
        }
      };
    });
  }

  /**
   * 30 gün bitişi sonrası yeniden başlama / ileri seviye (PROJE.md 4.6)
   */
  restartJourney({ isAdvanced = false, newAreaId = null } = {}) {
    return this.updateState(state => {
      const archived = [...(state.archivedJourneys || [])];
      archived.push({
        areaId: state.profile.selectedAreaId,
        completedDaysCount: state.journey.completedDays.length,
        completedAt: new Date().toISOString(),
        isCompleted30: true
      });

      const targetAreaId = newAreaId || state.profile.selectedAreaId;
      const nextTaskOrder = buildTaskSequence(tasksData.gorevler, {
        areaId: targetAreaId,
        answers: state.profile.answers || {},
        readinessScore: isAdvanced ? 5 : (state.profile.readinessScore || 3)
      });

      return {
        ...state,
        profile: {
          ...state.profile,
          selectedAreaId: targetAreaId
        },
        archivedJourneys: archived,
        journey: {
          currentDay: 1,
          stage: 'tohum',
          adaptiveDifficultyModifier: isAdvanced ? 1 : 0,
          completedDays: [],
          dayStatusMap: {},
          consecutiveFeedback: { type: null, count: 0 },
          reflectionNotes: [],
          badges: ['ilk_adim'],
          lastActionDate: null,
          todayActionTaken: false,
          todayActionDate: null,
          taskOrder: nextTaskOrder,
          inactivityDismissedDate: null
        }
      };
    });
  }

  /**
   * Kullanıcının tema tercihini döner ('system' | 'light' | 'dark')
   */
  getThemePreference() {
    const state = this.getState();
    return state.settings?.theme || 'system';
  }

  /**
   * Sistemin aktif renk şemasını kontrol ederek çözümlenmiş temayı döner ('light' | 'dark')
   */
  getResolvedTheme() {
    const pref = this.getThemePreference();
    if (pref === 'system') {
      return (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
    }
    return pref === 'dark' ? 'dark' : 'light';
  }

  /**
   * HTML kök öğesine tema niteliğini uygular ve isteğe bağlı 200ms yumuşak geçiş tetikler
   */
  applyTheme(themeChoice = null, smooth = false) {
    if (typeof document === 'undefined') return 'light';
    const pref = themeChoice || this.getThemePreference();
    let resolved = pref;
    if (pref === 'system') {
      resolved = (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
    }

    if (smooth) {
      document.documentElement.classList.add('theme-transition');
      setTimeout(() => {
        document.documentElement.classList.remove('theme-transition');
      }, 220);
    }

    document.documentElement.setAttribute('data-theme', resolved);
    return resolved;
  }

  /**
   * Tema tercihini kaydeder ve uygular ('system' | 'light' | 'dark')
   */
  setTheme(theme) {
    if (!['system', 'light', 'dark'].includes(theme)) {
      theme = 'system';
    }

    this.updateState(state => ({
      ...state,
      settings: {
        ...state.settings,
        theme
      }
    }));

    const resolved = this.applyTheme(theme, true);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('themechange', {
        detail: { theme, resolved }
      }));
    }
    return resolved;
  }
}

export const storage = new StorageService();
export default storage;
