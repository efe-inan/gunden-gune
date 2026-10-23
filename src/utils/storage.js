/**
 * storage.js
 * "Günden Güne" Veri & Depolama Servis Katmanı
 */

const STORAGE_KEY = 'gunden_gune_app_state_v1';

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
    const name = state.profile.name ? ` ${state.profile.name}` : '';
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      return `Günaydın,${name}`;
    } else if (hour >= 12 && hour < 18) {
      return `İyi günler,${name}`;
    } else {
      return `İyi akşamlar,${name}`;
    }
  }

  /**
   * Günün aşamasını hesaplar
   */
  getStageInfo(day) {
    if (day <= 7) {
      return {
        key: 'tohum',
        title: 'Tohum',
        desc: 'Farkındalık ve çok küçük başlangıç adımları (1–3 dk)',
        isLightDay: day === 7
      };
    } else if (day <= 15) {
      return {
        key: 'filiz',
        title: 'Filiz',
        desc: 'Küçük tekrarlayan davranışlar ve alan düzeni (5–7 dk)',
        isLightDay: day === 14
      };
    } else if (day <= 23) {
      return {
        key: 'govde',
        title: 'Gövde',
        desc: 'Gerçek hayatta uygulama ve hafif direnç eşiği (7–12 dk)',
        isLightDay: day === 21
      };
    } else {
      return {
        key: 'yaprak',
        title: 'Yaprak',
        desc: 'Kalıcı entegrasyon ve bağımsız uygulama (10–15 dk)',
        isLightDay: false
      };
    }
  }

  /**
   * 3 veya daha fazla gün ara verilip verilmediğini kontrol eder
   */
  checkInactivity() {
    const state = this.getState();
    if (!state.journey.lastActionDate) return { hasInactivity: false, daysInactive: 0 };

    const last = new Date(state.journey.lastActionDate);
    const now = new Date();
    const diffMs = now - last;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    return {
      hasInactivity: diffDays >= 3,
      daysInactive: diffDays
    };
  }

  /**
   * Bugün bir işlem yapılıp yapılmadığını kontrol eder
   */
  isTodayActionCompleted() {
    const state = this.getState();
    const todayStr = new Date().toISOString().split('T')[0];
    return state.journey.todayActionDate === todayStr && state.journey.todayActionTaken;
  }

  /**
   * Görevi tamamla
   */
  completeTask({ feedback = null, reflectionNote = '' } = {}) {
    const todayStr = new Date().toISOString().split('T')[0];
    const nowIso = new Date().toISOString();

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
  postponeTask() {
    const todayStr = new Date().toISOString().split('T')[0];
    const nowIso = new Date().toISOString();

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
    const hasZorlandimOrPostponedSuccess = Object.values(dayStatusMap).some(d => d.feedback === 'zorlandim') ||
      Object.keys(dayStatusMap).some(dayStr => {
        const d = parseInt(dayStr, 10);
        return dayStatusMap[d]?.status === 'completed' && dayStatusMap[d - 1]?.status === 'postponed';
      });

    const badges = [
      {
        id: 'ilk_adim',
        title: 'İlk Adım',
        desc: 'Yolculuğa başladın ve ilk görevini tamamladın.',
        isUnlocked: totalCompleted >= 1,
        icon: 'sprout'
      },
      {
        id: '3_gun',
        title: '3 Gün',
        desc: '3 gün boyunca kendine vakit ayırdın.',
        isUnlocked: totalCompleted >= 3,
        icon: 'flame'
      },
      {
        id: 'ilk_hafta',
        title: 'İlk Hafta',
        desc: 'Tohum aşamasının ilk 7 gününü geride bıraktın.',
        isUnlocked: totalCompleted >= 7,
        icon: 'calendar'
      },
      {
        id: 'zor_gune_ragmen',
        title: 'Zor Güne Rağmen',
        desc: 'Zorlandığın ya da ertelediğin bir günün ardından yeniden adım attın.',
        isUnlocked: hasZorlandimOrPostponedSuccess || totalCompleted >= 5,
        icon: 'shield'
      },
      {
        id: '15_gun',
        title: '15. Gün',
        desc: 'Yolculuğun yarısını huzurla tamamladın.',
        isUnlocked: totalCompleted >= 15,
        icon: 'mountain'
      },
      {
        id: 'yolculugun_sonu',
        title: 'Yolculuğun Sonu',
        desc: '30 günlük tohumdan yaprağa dönüşümü başardın.',
        isUnlocked: totalCompleted >= 30,
        icon: 'award'
      }
    ];

    // Haftalık Özet (Hafta 1: 1-7, Hafta 2: 8-14, Hafta 3: 15-21, Hafta 4: 22-28, Hafta 5: 29-30)
    const currentWeekNum = Math.ceil(state.journey.currentDay / 7);
    const weekStartDay = (currentWeekNum - 1) * 7 + 1;
    const weekEndDay = Math.min(currentWeekNum * 7, 30);
    
    let weekCompletedCount = 0;
    for (let d = weekStartDay; d <= weekEndDay; d++) {
      if (completedDays.includes(d)) weekCompletedCount++;
    }

    return {
      totalCompleted,
      currentStreak,
      maxStreak,
      badges,
      weeklySummary: {
        weekNum: currentWeekNum,
        weekCompletedCount,
        weekTotalDays: weekEndDay - weekStartDay + 1,
        message: weekCompletedCount > 0 
          ? `Bu hafta ${weekCompletedCount} görevi tamamladın. Kendini zorlamadan attığın her adım zihninde yeni bir yer açıyor.` 
          : `Bu hafta henüz yeni başlıyor. Küçük bir adımla başlamak her zaman yeterli.`
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
          todayActionDate: null
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

      return {
        ...state,
        profile: {
          ...state.profile,
          selectedAreaId: newAreaId || state.profile.selectedAreaId
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
          todayActionDate: null
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
