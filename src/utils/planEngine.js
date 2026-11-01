/**
 * planEngine.js
 * Kişiselleştirilmiş görev dizilimi, uyarlanabilir aşama sınırları ve süre sınırı motoru (PROJE.md Bölüm 5 & 6)
 */

const BEGINNER_ANSWER_FLAGS = {
  finans_1: 'hic',
  odak_2: 'az',
  wellness_1: 'hic',
  mukemmeliyetcilik_1: 'erteleme',
  disiplin_3: 'sik_kirilma',
  ozguven_3: 'cok_zor',
  uyku_1: 'duzensiz',
};

const ANSWER_TAG_MAP = {
  finans: {
    finans_4: {
      plan: ['planlama', 'butce', 'sabit-gider', 'duzen'],
      harcama: ['durtu-yonetimi', 'harcama-kontrolu', 'market', 'sifir-harcama'],
      disiplin: ['aliskanlik', 'takip', 'duzen', 'rutin'],
      bilgi: ['bilgi', 'ogrenme', 'butce', 'abonelik'],
    },
    finans_5: {
      farkindalik: ['farkindalik', 'takip', 'nakit-akisi'],
      birikim: ['birikim', 'guvenlik-agi', 'tasarruf', 'hedef'],
      harcama_kontrolu: ['durtu-yonetimi', 'harcama-kontrolu', 'tasarruf'],
      huzur: ['oz-sefkat', 'duygu-yonetimi', 'sadelik'],
    },
  },
  odak: {
    odak_1: {
      bildirim: ['bildirim-yonetimi', 'dijital-detoks', 'dijital-duzen', 'rahatsiz-etmeyin'],
      coklu_is: ['tek-is', 'odak-bloku', 'durtu-kontrolu'],
      ic_ses: ['zihin-bosaltma', 'zihinsel-dinginlik', 'nefes'],
      cevre: ['ortam-duzeni', 'ortam-tasarimi', 'cevre-tasarimi', 'sadelik'],
    },
    odak_5: {
      derinlesme: ['derinlesme', 'odak-bloku', 'pomodoro', 'derin-is'],
      ekran_azaltma: ['dijital-detoks', 'bildirim-yonetimi', 'dijital-hijyen', 'fiziksel-mesafe'],
      huzur: ['zihin-bosaltma', 'gercek-mola', 'zihinsel-dinginlik', 'ferahlik'],
      bitirme: ['tek-is', 'onceliklendirme', 'odak-kasi'],
    },
  },
  wellness: {
    wellness_2: {
      'telaşlı': ['yavaslama', 'nefes', 'nefes-calismasi', 'sakinlesme'],
      'dalgalı': ['simdiki-an', 'duyusal-farkindalik', 'denge'],
      yorgun: ['gevseme', 'dinlenme', 'derin-gevseme', 'oz-sefkat'],
    },
    wellness_5: {
      yavaslama: ['yavaslama', 'nefes', 'sessizlik', 'sakinlesme'],
      beden: ['beden-farkindaligi', 'beden-taramasi', 'gevseme', 'yuz-gevsemesi'],
      sukran: ['minnettarlik', 'sukran', 'iyi-niyet'],
      aliskanlik: ['rituel', 'sabah-meditasyonu', 'aksam-ritueli'],
    },
  },
  iliskiler: {
    iliskiler_1: {
      cevap: ['dinleme', 'duraklama', 'aktif-dinleme'],
      'dalgın': ['tam-varlik', 'aktif-dinleme', 'kaliteli-zaman'],
    },
    iliskiler_2: {
      cok: ['sinirlar', 'sinir-koyma', 'hayir-diyebilmek'],
      bazen: ['sinirlar', 'net-iletisim'],
    },
    iliskiler_5: {
      dinleme: ['dinleme', 'aktif-dinleme', 'merak', 'empati'],
      sinir: ['sinirlar', 'sinir-koyma', 'hayir-diyebilmek', 'sinir-koruma'],
      net_iletisim: ['ben-dili', 'net-iletisim', 'acik-iletisim', 'kirginlik'],
      yakinlik: ['takdir', 'somut-tesekkur', 'bag-kurma', 'samimiyet'],
    },
  },
  mukemmeliyetcilik: {
    mukemmeliyetcilik_1: {
      erteleme: ['taslak', 'baslangic', 'cesaret', 'ertelemeyi-kirma'],
      bitirememe: ['zaman-kutusu', 'bitirme', '80-20-kurali', 'teslimat'],
      kontrol: ['kontrolu-birakma', 'esneklik', 'vazgecme'],
      huzursuzluk: ['oz-sefqat', 'ic-ses', 'nezaket', 'oz-kabul'],
    },
    mukemmeliyetcilik_5: {
      bitirme: ['bitirme', 'yeterince-iyi', 'zaman-kutusu', 'teslimat'],
      oz_sefqat: ['oz-sefqat', 'ic-ses', 'nezaket', 'affedicilik'],
      kusur_barisi: ['kasitli-kusur', 'esneklik', 'kabul'],
      rahat_baslama: ['taslak', 'baslangic', 'hiz', 'akis'],
    },
  },
  disiplin: {
    disiplin_1: {
      buyuk_isler: ['gorev-parcalama', 'mikro-adim', '2-dakika-kurali'],
      sikici_isler: ['aliskanlik-baglama', 'odul-sistemi', 'zaman-kutusu'],
      mukemmeliyetcilik: ['kolay-baslangic', 'oz-sefqat', '2-dakika-kurali'],
      yorgunluk: ['ortam-tasarimi', 'surtunme', 'aksam-hazirligi'],
    },
    disiplin_5: {
      kolay_baslama: ['2-dakika-kurali', 'baslama', 'kolay-baslangic', 'surtunmesiz-baslangic'],
      parcalama: ['gorev-parcalama', 'mikro-adim', 'netlik'],
      soz_tutma: ['soz-tutma', 'guven-bankasi', 'oz-guven', 'sureklilik'],
      sakin_ritim: ['rutin', 'mikro-aliskanlik', 'sakin-disiplin'],
    },
  },
  ozguven: {
    ozguven_1: {
      kiyaslama: ['kiyaslamama', 'dijital-hijyen', 'kendi-yolun'],
      hata_yapma: ['nazik-dil', 'oz-sefqat', 'ic-ses'],
      topluluk_onunde: ['konfor-alani', 'sosyal-cesaret', 'beden-dili', 'durus'],
      sahtekarlik: ['somut-kanit', 'kucuk-zaferler', 'imposter-panzehiri', 'sahiplenme'],
    },
    ozguven_5: {
      guclu_yonler: ['guclu-yonler', 'somut-kanit', 'kucuk-zaferler', 'kayit'],
      nazik_dil: ['nazik-dil', 'oz-sefqat', 'ic-ses', 'ic-destek'],
      konfor_alani: ['konfor-alani', 'sosyal-cesaret', 'tercih-ifadesi'],
      oz_onay: ['oz-deger', 'ic-onay', 'kosulsuz-deger', 'iltifat-kabulu'],
    },
  },
  uyku: {
    uyku_1: {
      duzensiz: ['uyku-penceresi', 'ritim', 'sabah-ritueli'],
      ekran_gecikmesi: ['dijital-detoks', 'ekran-kapama', 'dijital-sinir'],
      esnek_vardiya: ['oda-ortami', 'karanlik', 'aksam-ritueli'],
      zihin_dolu: ['zihin-bosaltma', 'kaygi-yonetimi', 'beden-gevsemesi'],
    },
    uyku_4: {
      gec_saat: ['kafein-farkindaligi', 'kafein-siniri', 'beslenme-ritmi'],
    },
    uyku_5: {
      aksam_sabah_ritueli: ['aksam-ritueli', 'sabah-ritueli', 'gece-gecisi'],
      dijital_detoks: ['dijital-detoks', 'ekran-kapama', 'ekransiz-sabah', 'dijital-sinir'],
      ortam_iyilestirme: ['oda-ortami', 'isik-kontrolu', 'havalandirma', 'oda-duzeni'],
      zinde_enerji: ['gun-isigi', 'hidrasyon', 'kafein-farkindaligi', 'sabah-hareketi'],
    },
  },
};

/**
 * Hazırlık puanı, başlangıç yanıtları ve uyarlanabilir zorluk değiştiricisine göre
 * 4 gelişim aşamasının gün sınırlarını hesaplar (PROJE.md Bölüm 6).
 */
export function computeStageBounds(profile = {}, journey = {}) {
  const readiness = Number(profile.readinessScore ?? 3);
  const modifier = Number(journey.adaptiveDifficultyModifier ?? 0);
  const answers = profile.answers || {};

  const hasBeginnerFlag = Object.entries(BEGINNER_ANSWER_FLAGS).some(
    ([qKey, beginnerVal]) => answers[qKey] === beginnerVal
  );

  if (readiness <= 2 || modifier < 0 || hasBeginnerFlag) {
    return {
      tohumEnd: 10,
      filizEnd: 17,
      govdeEnd: 24,
    };
  }

  return {
    tohumEnd: 7,
    filizEnd: 15,
    govdeEnd: 23,
  };
}

/**
 * Kullanıcının alana özel cevaplarından önceliklendirilecek görev etiketlerini çıkarır.
 */
export function extractPreferredTags(areaId, answers = {}) {
  const areaRules = ANSWER_TAG_MAP[areaId] || {};
  const tagSet = new Set();

  for (const [questionId, valueMap] of Object.entries(areaRules)) {
    const chosen = answers?.[questionId];
    if (chosen && valueMap[chosen]) {
      for (const tag of valueMap[chosen]) {
        tagSet.add(tag);
      }
    }
  }

  return [...tagSet];
}

/**
 * Seçili alan için 30 günlük kişiselleştirilmiş görev ID dizisini üretir.
 * Hafif günler (7, 14, 21) ve mezuniyet günü (30) sabit kalır; ilk iki haftadaki
 * adımlar kullanıcının etiket önceliklerine ve hazır olma düzeyine göre sıralanır.
 */
export function buildTaskSequence(allTasks = [], { areaId = 'finans', answers = {}, readinessScore = 3 } = {}) {
  const areaTasks = allTasks
    .filter(t => t.alan === areaId)
    .sort((a, b) => a.gun - b.gun);

  if (areaTasks.length === 0) return [];

  const preferredTags = new Set(extractPreferredTags(areaId, answers));
  const gentleStart = Number(readinessScore) <= 2;

  const scoreTask = (task) => {
    const tags = Array.isArray(task.etiketler) ? task.etiketler : [];
    let tagMatches = 0;
    for (const t of tags) {
      if (preferredTags.has(t)) tagMatches += 1;
    }
    return tagMatches;
  };

  const sortWindow = (slice) =>
    [...slice].sort((a, b) => {
      const matchDiff = scoreTask(b) - scoreTask(a);
      if (matchDiff !== 0) return matchDiff;
      if (gentleStart) {
        if (a.zorluk !== b.zorluk) return a.zorluk - b.zorluk;
        if (a.sure_dk !== b.sure_dk) return a.sure_dk - b.sure_dk;
      }
      return a.gun - b.gun;
    });

  if (areaTasks.length < 30) {
    return areaTasks.map(t => t.id);
  }

  const byDay = new Map(areaTasks.map(t => [t.gun, t]));

  const w1 = sortWindow([1, 2, 3, 4, 5, 6].map(d => byDay.get(d)));
  const day7 = byDay.get(7);
  const w2 = sortWindow([8, 9, 10, 11, 12, 13].map(d => byDay.get(d)));
  const day14 = byDay.get(14);
  const w3 = [15, 16, 17, 18, 19, 20].map(d => byDay.get(d));
  const day21 = byDay.get(21);
  const w4 = [22, 23, 24, 25, 26, 27, 28, 29].map(d => byDay.get(d));
  const day30 = byDay.get(30);

  return [...w1, day7, ...w2, day14, ...w3, day21, ...w4, day30]
    .filter(Boolean)
    .map(t => t.id);
}

/**
 * Bugünün görevini, süre sınırına göre birincil alternatif modunu ve etkin zorluğu çözer.
 */
export function resolveTodayTask(allTasks = [], state = {}) {
  const areaId = state?.profile?.selectedAreaId || 'finans';
  const currentDay = Math.max(1, Math.min(30, Number(state?.journey?.currentDay || 1)));
  const modifier = Number(state?.journey?.adaptiveDifficultyModifier || 0);
  const maxMinutes = Number(state?.profile?.dailyTimePreference || 10);
  const taskOrder = Array.isArray(state?.journey?.taskOrder) ? state.journey.taskOrder : null;

  let task = null;

  if (taskOrder && taskOrder[currentDay - 1]) {
    const targetId = taskOrder[currentDay - 1];
    task = allTasks.find(t => t.id === targetId && t.alan === areaId) || null;
  }

  if (!task) {
    task =
      allTasks.find(t => t.alan === areaId && t.gun === currentDay) ||
      allTasks.find(t => t.alan === 'finans' && t.gun === currentDay) ||
      allTasks[0] ||
      null;
  }

  if (!task) {
    return {
      task: null,
      isAlternativePrimary: false,
      effectiveMinutes: maxMinutes,
      effectiveDifficulty: 1,
    };
  }

  const effectiveDifficulty = Math.max(1, Math.min(5, Number(task.zorluk || 1) + modifier));
  const exceedsDailyTime = Number(task.sure_dk || 0) > maxMinutes;
  const softenedByModifier = modifier < 0 && Number(task.zorluk || 1) >= 3;
  const isAlternativePrimary = Boolean(task.alternatif) && (exceedsDailyTime || softenedByModifier);
  const effectiveMinutes = isAlternativePrimary
    ? Math.min(Number(task.sure_dk || maxMinutes), maxMinutes)
    : Number(task.sure_dk || maxMinutes);

  return {
    task,
    isAlternativePrimary,
    effectiveMinutes,
    effectiveDifficulty,
  };
}

