# Günden Güne — Kalan İşler Uygulama Planı

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Tamamlanan `unslop` arayüz yenilemesinin üzerine, `PROJE.md` ve `README.md` içindeki eksik işlevsel kuralları (otomatik gün devri, cevap/hazırlık/süre tabanlı kişiselleştirme, 3+ gün ara aksiyonları, doğru rozet ve haftalık özet mantığı, rota korumaları, JSON yedek içe aktarma, SVG favicon, varlık temizliği ve otomatik test paketi) eksiksiz tamamlamak.

**Architecture:** Tüm kalıcı durum ve zaman geçişleri tek sorumluluk katmanı olan `src/utils/storage.js` üzerinden yürütülür; görev sıralama, aşama sınırları ve süre sınırı uyarlamaları saf (pure) fonksiyonlardan oluşan yeni `src/utils/planEngine.js` modülüne ayrılır. Görünüm katmanı (`Today.js`, `Onboarding.js`, `Progress.js`, `Settings.js`, `main.js`) bu iki modülün deterministik çıktılarını tüketir ve harici paket eklemeden Node 24 yerleşik `node:test` altyapısıyla doğrulanır.

**Tech Stack:** Vite 8, Vanilla ES6+ Modules, CSS Custom Properties, LocalStorage, Node.js 24 (`node:test` + `node:assert/strict`).

**Spec:** `PROJE.md` (Bölüm 2, 3, 4.2–4.6, 5, 6, 7, 9) ve `README.md`

## Global Constraints

- Tamamen tarayıcı tabanlı, backend yok; tüm `localStorage` okuma/yazma işlemleri yalnızca `src/utils/storage.js` üzerinden yapılır (`STORAGE_KEY = 'gunden_gune_app_state_v1'`).
- Harici çalışma zamanı veya ağır test kütüphanesi eklenmez; Node 24 yerleşik `node --test` ve standart ES modülleri (`with { type: 'json' }`) kullanılır.
- Site dili Türkçe, "sen" dili, sakin/yargısız ton; tümce düzeni (sentence case), sıfır emoji ve `unslop` tasarım sistemi kuralları (`variables.css` sıcak kağıt/obsidyen nötrleri, `4px` boşluk ölçeği, `1.5` ikon çizgi kalınlığı, `tabular-nums`, tek `--ease-out` eğrisi) korunur.
- Günlük yalnızca 1 görev açılır; kullanıcı normal modda aynı gün ileriye atlayamaz, kaçırılan veya ertelenen günlerde seri cezası uygulanmaz ve sayaç takvim bazlı değil görev bazlı ilerler.
- Seçilen günlük süreyi (`5 / 10 / 15 / 20 dk`) aşan görev ham haliyle dayatılmaz; hafif `alternatif` birincil eylem olarak sunulur.

## Review Focus

1. **Gece yarısı UTC kayması (`00:00–02:59` Türkiye saati, `UTC+3`):** `toISOString().split('T')[0]` UTC günü döndürdüğü için gece 00:30'da tamamlanan görevin bir önceki güne yazılıp sabah kilitlenmesi → tüm gün anahtarları yerel takvim tarihinden (`getLocalDateKey`) üretilmeli (Task 1 testi).
2. **Alan değiştirme veya yeniden başlatmada eski `taskOrder` kalıntısı:** Kullanıcı `Finans`tan `Uyku`ya geçtiğinde `journey.taskOrder` sıfırlanıp yeniden üretilmezse yanlış alanın görevleri görünür → `changeArea` ve `restartJourney` yeni alanın 30 günlük dizisini üretmeli (Task 2 testi).
3. **30. gün tamamlandığı anda son yansıma notunun kaybolması:** Gün 30 tamamlanır tamamlanmaz anında `#completed` ekranına yönlendirme yapılırsa kullanıcı 30. gün geri bildirimini ve notunu kaydedemez → aynı gün `#today` tamamlandı kartında kalıp *"30. gün özetine geç"* bağlantısı sunmalı, ertesi takvim gününde otomatik `#completed` açılmalı (Task 3 testi).
4. **Ertelenen günü tamamlama ve `zor_gune_ragmen` rozeti doğruluğu:** Rozet 5. günde otomatik açılmamalı (`totalCompleted >= 5` kaldırılmalı); yalnızca `zorlandim` geri bildirimi verilen veya `postponed` edilen bir günün ardından görev tamamlandığında açılmalı (Task 4 testi).
5. **Bozuk veya zararlı JSON yedek dosyası yükleme (`importDataJSON`):** Geçersiz JSON, tanımsız alan kimliği, `currentDay: 999` veya HTML/script içeren metinler mevcut `localStorage` verisini bozmamalı; şema doğrulaması başarısızsa mevcut durum korunup sakin uyarı dönülmeli (Task 5 testi).

---

### Ön Hazırlık: Mevcut `unslop` Arayüz Değişikliklerini Temiz Başlangıç Noktası Olarak Kaydetme

- [ ] **Step 1: Çalışma ağacındaki tamamlanmış `unslop` UI yenilemesini tek bir temel commit olarak kaydet**

Run:
```bash
git status --short
git add index.html src/
git commit -m "refactor(ui): apply 9-pass unslop design system across all views"
```
Expected: `git status --short` çıktısı boş (temiz çalışma ağacı).

---

### Task 1: Test Altyapısı, Yerel Tarih Yardımcısı ve Otomatik Gün Devri (`storage.js`)

**Files:**
- Modify: `package.json`
- Modify: `src/components/Today.js:6-7`
- Modify: `src/components/Onboarding.js:6`
- Modify: `src/components/Progress.js:6`
- Modify: `src/components/Settings.js:6`
- Modify: `src/components/Completion.js:6`
- Modify: `src/utils/storage.js`
- Create: `tests/helpers/browserMock.js`
- Create: `tests/storage-rollover.test.js`

**Interfaces:**
- Consumes: `localStorage` (`STORAGE_KEY = 'gunden_gune_app_state_v1'`)
- Produces:
  - `getLocalDateKey(date?: Date) -> string` (`YYYY-MM-DD`, yerel saat dilimi)
  - `storage.syncDailyRollover(now?: Date) -> object` (ertesi takvim gününde: `status === 'completed'` ve `currentDay < 30` ise `currentDay + 1` + `todayActionTaken = false`; `status === 'postponed'` ise `currentDay` sabit + `todayActionTaken = false`)
  - `storage.checkInactivity(now?: Date) -> { hasInactivity: boolean, daysInactive: number }`
  - `storage.completeTask({ feedback?: string | null, reflectionNote?: string }, now?: Date) -> object`
  - `storage.postponeTask(now?: Date) -> object`

- [ ] **Step 1: `package.json` test betiğini ve JSON import özniteliklerini (`with { type: 'json' }`) ekle**

`package.json` içindeki `"scripts"` nesnesine `"test": "node --test tests/*.test.js"` ekle. `Today.js`, `Onboarding.js`, `Progress.js`, `Settings.js` ve `Completion.js` içindeki `tasks.json` / `questions.json` import satırlarına `with { type: 'json' }` ekle (hem Node 24 hem Vite 8 doğal olarak destekler).

- [ ] **Step 2: Tarayıcı taklidi (`browserMock.js`) ve başarısız olan gün devri testlerini yaz**

Create `tests/helpers/browserMock.js` (`installBrowserMock()` fonksiyonu `globalThis.localStorage`, `globalThis.window`, `globalThis.document`, `CustomEvent` sağlar ve her test öncesi sıfırlar).

Create `tests/storage-rollover.test.js`:
```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { installBrowserMock } from './helpers/browserMock.js';
import { storage, getLocalDateKey } from '../src/utils/storage.js';

test('getLocalDateKey uses local calendar date instead of UTC (00:30 local time edge case)', () => {
  const localMidnightPlus30 = new Date(2026, 10, 2, 0, 30, 0); // 2 Kas 2026 00:30 yerel
  assert.equal(getLocalDateKey(localMidnightPlus30), '2026-11-02');
});

test('syncDailyRollover advances currentDay on next calendar day when today was completed', () => {
  installBrowserMock();
  storage.resetAll();
  const day1 = new Date(2026, 10, 2, 9, 0, 0);
  storage.completeTask({ feedback: 'tam_kivaminda' }, day1);
  assert.equal(storage.getState().journey.currentDay, 1);
  assert.equal(storage.isTodayActionCompleted(day1), true);

  const day2 = new Date(2026, 10, 3, 9, 0, 0);
  const rolled = storage.syncDailyRollover(day2);
  assert.equal(rolled.journey.currentDay, 2);
  assert.equal(rolled.journey.todayActionTaken, false);
  assert.equal(storage.isTodayActionCompleted(day2), false);
});

test('syncDailyRollover keeps currentDay unchanged on next calendar day when today was postponed', () => {
  installBrowserMock();
  storage.resetAll();
  const day1 = new Date(2026, 10, 2, 21, 0, 0);
  storage.postponeTask(day1);

  const day2 = new Date(2026, 10, 3, 8, 30, 0);
  const rolled = storage.syncDailyRollover(day2);
  assert.equal(rolled.journey.currentDay, 1);
  assert.equal(rolled.journey.todayActionTaken, false);
});

test('checkInactivity reports hasInactivity=true after 3+ calendar days and handles invalid dates safely', () => {
  installBrowserMock();
  storage.resetAll();
  storage.completeTask({}, new Date(2026, 10, 1, 10, 0, 0));
  const res = storage.checkInactivity(new Date(2026, 10, 4, 10, 0, 0));
  assert.equal(res.hasInactivity, true);
  assert.equal(res.daysInactive, 3);

  storage.updateState(s => ({ ...s, journey: { ...s.journey, lastActionDate: 'bozuk-tarih' } }));
  assert.deepEqual(storage.checkInactivity(new Date(2026, 10, 4, 10, 0, 0)), { hasInactivity: false, daysInactive: 0 });
});
```

- [ ] **Step 3: Testi çalıştır ve beklenen hatayı doğrula**

Run: `npm test`
Expected: FAIL (`getLocalDateKey` ve `syncDailyRollover` henüz tanımlı değil).

- [ ] **Step 4: `getLocalDateKey` ve `syncDailyRollover` mantığını `src/utils/storage.js` içinde uygula**

`src/utils/storage.js` içinde:
- `export function getLocalDateKey(date = new Date())` ile `YYYY-MM-DD` üret; tüm `toISOString().split('T')[0]` çağrılarını bununla değiştir.
- `isTodayActionCompleted(now = new Date())`, `completeTask(opts, now = new Date())`, `postponeTask(now = new Date())` ve `checkInactivity(now = new Date())` imzalarına opsiyonel `now` parametresi ekle (`NaN` tarih kontrolü dahil).
- `syncDailyRollover(now = new Date())`: `journey.todayActionTaken` doğruysa ve `journey.todayActionDate !== getLocalDateKey(now)` ise, `dayStatusMap[currentDay]?.status === 'completed'` olduğunda `currentDay = Math.min(currentDay + 1, 30)` ve `stage = this.getStageInfo(nextDay, state).key` yap; `'postponed'` olduğunda `currentDay`'i koru; her iki durumda `todayActionTaken: false, todayActionDate: null` olarak kaydet.

- [ ] **Step 5: Testleri ve üretim derlemesini çalıştır**

Run: `npm test && npm run build`
Expected: Tüm testler PASS ve `vite build` hatasız tamamlanır.

- [ ] **Step 6: Commit oluştur**

```bash
git add package.json src/ tests/
git commit -m "feat(storage): add local date rollover sync and node:test suite"
```

---

### Task 2: Kişiselleştirme ve Uyarlanabilir Plan Motoru (`planEngine.js`)

**Files:**
- Create: `src/utils/planEngine.js`
- Modify: `src/utils/storage.js`
- Create: `tests/plan-engine.test.js`

**Interfaces:**
- Consumes: `src/data/tasks.json` (`gorevler` dizisi), `state.profile`, `state.journey`
- Produces:
  - `computeStageBounds(profile, journey) -> { tohumEnd: number, filizEnd: number, govdeEnd: number }`
    - `readinessScore <= 2` veya `(journey?.adaptiveDifficultyModifier || 0) < 0` veya başlangıç seviyesi yanıtı (`finans_1 === 'hic'`, `odak_2 === 'az'`, `wellness_1 === 'hic'`, `mukemmeliyetcilik_1 === 'erteleme'`, `disiplin_3 === 'sik_kirilma'`, `ozguven_3 === 'cok_zor'`, `uyku_1 === 'duzensiz'`) ise `{ tohumEnd: 10, filizEnd: 17, govdeEnd: 24 }`, aksi halde `{ tohumEnd: 7, filizEnd: 15, govdeEnd: 23 }`.
  - `extractPreferredTags(areaId: string, answers: Record<string, string>) -> string[]`
    - 8 alanın `questions.json` cevap değerlerini `tasks.json` içindeki gerçek `etiketler` listesine eşler (ör. `finans_4: 'bilgi' -> ['bilgi', 'ogrenme', 'butce']`, `finans_4: 'disiplin' -> ['aliskanlik', 'takip', 'duzen']`, `finans_4: 'harcama' -> ['durtu-yonetimi', 'harcama-kontrolu']`, `odak_1: 'bildirim' -> ['bildirim-yonetimi', 'dijital-detoks', 'dijital-duzen']`, vb. tüm 8 alan için deterministik tablo).
  - `buildTaskSequence(allTasks: Array<object>, { areaId: string, answers?: object, readinessScore?: number }) -> string[]`
    - Seçili alana ait 30 görevin `id` dizisini döner. Hafif günler (`gun` `7, 14, 21`) ve mezuniyet günü (`gun` `30`) sabit indekslerinde (`6, 13, 20, 29`) kalır; `Tohum` (`1..6`) ve `Filiz` (`8..13`) pencerelerindeki görevler `extractPreferredTags` eşleşme sayısına göre azalan, `readinessScore <= 2` ise `sure_dk` ve `zorluk` artan, eşitlikte orijinal `gun` artan sırada dizilir.
  - `resolveTodayTask(allTasks: Array<object>, state: object) -> { task: object | null, isAlternativePrimary: boolean, effectiveMinutes: number, effectiveDifficulty: number }`
  - `storage.repeatPreviousDay(now?: Date) -> object` (`currentDay > 1` ise `currentDay - 1` görevini yeniden aktif hale getirir, `inactivityDismissedDate` işaretler)
  - `storage.easeDifficulty(now?: Date) -> object` (`adaptiveDifficultyModifier = -1` yapar ve `inactivityDismissedDate` işaretler)

- [ ] **Step 1: `tests/plan-engine.test.js` içinde başarısız olan kişiselleştirme testlerini yaz**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import tasksData from '../src/data/tasks.json' with { type: 'json' };
import { installBrowserMock } from './helpers/browserMock.js';
import { storage } from '../src/utils/storage.js';
import {
  computeStageBounds,
  extractPreferredTags,
  buildTaskSequence,
  resolveTodayTask,
} from '../src/utils/planEngine.js';

test('computeStageBounds extends Tohum to day 10 when readinessScore <= 2 or modifier < 0', () => {
  assert.deepEqual(computeStageBounds({ readinessScore: 2, answers: {} }, { adaptiveDifficultyModifier: 0 }), {
    tohumEnd: 10,
    filizEnd: 17,
    govdeEnd: 24,
  });
  assert.deepEqual(computeStageBounds({ readinessScore: 4, answers: {} }, { adaptiveDifficultyModifier: 0 }), {
    tohumEnd: 7,
    filizEnd: 15,
    govdeEnd: 23,
  });
});

test('buildTaskSequence keeps light days (7,14,21) and day 30 anchored while prioritizing answer tags', () => {
  const seq = buildTaskSequence(tasksData.gorevler, {
    areaId: 'finans',
    answers: { finans_4: 'harcama', finans_5: 'harcama_kontrolu' },
    readinessScore: 3,
  });
  assert.equal(seq.length, 30);
  assert.equal(new Set(seq).size, 30);
  assert.equal(seq[6], 'finans-g07');
  assert.equal(seq[13], 'finans-g14');
  assert.equal(seq[20], 'finans-g21');
  assert.equal(seq[29], 'finans-g30');
  assert.ok(extractPreferredTags('finans', { finans_4: 'harcama' }).includes('durtu-yonetimi'));
});

test('resolveTodayTask promotes alternative and caps minutes when task exceeds dailyTimePreference', () => {
  const longFinansTask = tasksData.gorevler.find(t => t.alan === 'finans' && t.sure_dk > 5);
  const state = {
    profile: { selectedAreaId: 'finans', dailyTimePreference: 5, readinessScore: 3, answers: {} },
    journey: { currentDay: longFinansTask.gun, adaptiveDifficultyModifier: 0, taskOrder: null },
  };
  const resolved = resolveTodayTask(tasksData.gorevler, state);
  assert.equal(resolved.task.id, longFinansTask.id);
  assert.equal(resolved.isAlternativePrimary, true);
  assert.ok(resolved.effectiveMinutes <= 5);
});

test('changeArea and restartJourney regenerate taskOrder for the target area (no stale area task IDs)', () => {
  installBrowserMock();
  storage.resetAll();
  storage.updateState(s => ({
    ...s,
    journey: { ...s.journey, taskOrder: buildTaskSequence(tasksData.gorevler, { areaId: 'finans' }) },
  }));
  const updated = storage.changeArea({ newAreaId: 'uyku', action: 'archive' });
  assert.equal(updated.journey.taskOrder.length, 30);
  assert.ok(updated.journey.taskOrder.every(id => id.startsWith('uyku-')));
});
```

- [ ] **Step 2: Testleri çalıştır ve başarısız olduğunu doğrula**

Run: `npm test`
Expected: FAIL (`ERR_MODULE_NOT_FOUND` for `src/utils/planEngine.js`).

- [ ] **Step 3: `src/utils/planEngine.js` modülünü oluştur ve `src/utils/storage.js` ile entegre et**

- `src/utils/planEngine.js` içinde `computeStageBounds`, `extractPreferredTags` (8 alanın soru anahtarları için açık eşleme tablosu), `buildTaskSequence` ve `resolveTodayTask` fonksiyonlarını yaz.
- `src/utils/storage.js` içinde:
  - `DEFAULT_STATE.journey` içine `taskOrder: null`, `inactivityDismissedDate: null` ekle.
  - `getStageInfo(day, stateOverride = null)` metodunu `computeStageBounds` kullanacak şekilde güncelle (`bounds` bilgisini de döndürsün; `isLightDay` yine `7, 14, 21` günlerinde `true` kalsın).
  - `changeArea` ve `restartJourney` içinde yeni `selectedAreaId` için `buildTaskSequence` çağırarak `journey.taskOrder` üret.
  - `repeatPreviousDay(now = new Date())` ve `easeDifficulty(now = new Date())` metodlarını ekle; `checkInactivity(now)` içinde `inactivityDismissedDate === getLocalDateKey(now)` ise `hasInactivity: false` döndür.

- [ ] **Step 4: Testleri çalıştır**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Commit oluştur**

```bash
git add src/utils/planEngine.js src/utils/storage.js tests/plan-engine.test.js
git commit -m "feat(plan): add personalized task sequencing, stage bounds, and time-cap engine"
```

---

### Task 3: Onboarding ve Bugün Ekranı (`Today.js`) Uyarlanabilir UX Akışları

**Files:**
- Modify: `src/components/Onboarding.js:589-620`
- Modify: `src/components/Today.js`
- Modify: `src/styles/today.css`
- Create: `tests/today-flow.test.js`

**Interfaces:**
- Consumes: `resolveTodayTask`, `buildTaskSequence` (`src/utils/planEngine.js`), `storage.syncDailyRollover`, `storage.repeatPreviousDay`, `storage.easeDifficulty` (`src/utils/storage.js`)
- Produces:
  - `OnboardingController.completeAndSavePlan()` -> `journey.taskOrder` ve `stage` alanlarını `buildTaskSequence` + `getStageInfo` ile kaydeder
  - `TodayController` DOM kimlikleri:
    - `#btn-repeat-prev-day` (3+ gün ara kutusunda, `currentDay > 1` iken)
    - `#btn-ease-plan` (3+ gün ara kutusunda zorluğu `-1` kademesine çeken buton)
    - `#btn-toggle-full-steps` (`isAlternativePrimary === true` olduğunda tam adımları açıp kapatan ikincil düğme)
    - `#btn-go-graduation` (`currentDay === 30` tamamlandığında tamamlandı kartında görünen `#completed` bağlantısı)
    - `#btn-advance-day` yalnızca URL'de `?sim=1` (veya `#today?sim=1`) olduğunda ya da `localStorage.getItem('gunden_gune_dev_sim') === '1'` olduğunda render edilir

- [ ] **Step 1: `tests/today-flow.test.js` içinde DOM/akış testlerini yaz**

Minimal bir DOM kapsayıcısı veya bileşen HTML çıktısı üzerinde şu 4 senaryoyu doğrulayan testleri yaz:
1. `dailyTimePreference = 5` ve görev `sure_dk > 5` iken `TodayController` hafif `alternatif` metnini birincil kutu olarak ve `#btn-toggle-full-steps` düğmesini render eder; süre rozetinde `~5 dk` (veya daha düşük değer) görünür.
2. `3+` gün ara verildiğinde ve `currentDay = 4` iken `#btn-repeat-prev-day` ve `#btn-ease-plan` render edilir; `repeatPreviousDay()` çağrıldığında `currentDay` `3` olur ve ara kutusu kapanır.
3. Üst üste 2 kez `'zorlandim'` geri bildirimi verildiğinde destekleyici mesaj (*"Zor olması normal. Sonraki adımları senin için biraz daha hafiflettik."*) görünür.
4. `currentDay = 30` tamamlandığında aynı gün içinde `TodayController` yansıma notu alanını korur ve `#btn-go-graduation` (`href="#completed"`) bağlantısını gösterir; varsayılan modda `#btn-advance-day` görünmezken `?sim=1` ile görünür.

- [ ] **Step 2: Testi çalıştır ve başarısız olduğunu doğrula**

Run: `npm test`
Expected: FAIL.

- [ ] **Step 3: `Onboarding.js`, `Today.js` ve `today.css` güncellemelerini uygula**

- `Onboarding.js`: `tasksData` import et; `completeAndSavePlan()` içinde `taskOrder = buildTaskSequence(tasksData.gorevler, { areaId: this.formData.selectedAreaId, answers: this.formData.areaAnswers, readinessScore: this.formData.readiness })` üretip `journey.taskOrder` olarak kaydet.
- `Today.js`:
  - `render()` başında `storage.syncDailyRollover()` çağır.
  - `getTodayTask()` yerine `resolveTodayTask(tasksData.gorevler, this.state)` kullan (`this.forceFullSteps` yerel bayrağı ile `#btn-toggle-full-steps` geçişini destekle).
  - 3+ gün ara kutusuna *"Hoş geldin, kaldığın yerden devam edelim. İstersen bir önceki görevi tekrar edebilirsin."* metnini ve aksiyon butonlarını (`#btn-repeat-prev-day`, `#btn-ease-plan`) ekle.
  - Geri bildirim mesajını `feedback === 'zorlandim'` durumunda destekleyici metinle özelleştir.
  - Gün 30 tamamlandığında `renderActionTakenView` içinde `#btn-go-graduation` bağlantısını göster.
  - `#btn-advance-day` simülasyon çubuğunu `window.location.href.includes('sim=1') || localStorage.getItem('gunden_gune_dev_sim') === '1'` koşuluna bağla.
- `today.css`: `.inactivity-actions` ve `.task-primary-alternative` için `4px` ızgarasına ve mevcut yüzey değişkenlerine (`--bg-subtle`, `--border-hairline`) uygun sade stiller ekle.

- [ ] **Step 4: Testleri ve derlemeyi çalıştır**

Run: `npm test && npm run build`
Expected: PASS.

- [ ] **Step 5: Commit oluştur**

```bash
git add src/components/Onboarding.js src/components/Today.js src/styles/today.css tests/today-flow.test.js
git commit -m "feat(today): wire adaptive task view, inactivity recovery actions, and day-30 graduation CTA"
```

---

### Task 4: Doğru Rozet Koşulları, Dinamik Haftalık Özet ve Arşivlenen Yolculuklar (`storage.js`, `Progress.js`)

**Files:**
- Modify: `src/utils/storage.js:335-445`
- Modify: `src/components/Progress.js`
- Modify: `src/styles/progress.css`
- Create: `tests/progress-stats.test.js`

**Interfaces:**
- Consumes: `computeStageBounds` (`src/utils/planEngine.js`), `state.journey.dayStatusMap`, `state.archivedJourneys`
- Produces:
  - `storage.getProgressStats() -> { totalCompleted, currentStreak, maxStreak, badges, weeklySummary, reflectionNotes, stageBounds, archivedJourneys }`
  - `zor_gune_ragmen` rozeti: `totalCompleted >= 5` sahte koşulu kaldırılır; yalnızca (a) `dayStatusMap[d]?.status === 'completed'` olan bir `d` gününden önce `dPrev < d` gününde `feedback === 'zorlandim'` veya `status === 'postponed'` varsa, ya da (b) daha önce `postponedAt` kaydı olan bir gün sonradan `completed` durumuna geçmişse açılır (`postponeTask` içindeki `postponedAt` alanı `completeTask` sırasında korunur: `wasPostponed: Boolean(prevStatus.postponedAt || prevStatus.wasPostponed)`).

- [ ] **Step 1: `tests/progress-stats.test.js` içinde rozet ve haftalık özet testlerini yaz**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { installBrowserMock } from './helpers/browserMock.js';
import { storage } from '../src/utils/storage.js';

test('zor_gune_ragmen does NOT unlock after 5 easy days without struggle or postpone', () => {
  installBrowserMock();
  storage.resetAll();
  for (let d = 0; d < 5; d++) {
    const date = new Date(2026, 10, 1 + d, 10, 0, 0);
    storage.syncDailyRollover(date);
    storage.completeTask({ feedback: 'tam_kivaminda' }, date);
  }
  const badge = storage.getProgressStats().badges.find(b => b.id === 'zor_gune_ragmen');
  assert.equal(badge.isUnlocked, false);
});

test('zor_gune_ragmen unlocks when a postponed day is completed the next calendar day', () => {
  installBrowserMock();
  storage.resetAll();
  const d1 = new Date(2026, 10, 1, 20, 0, 0);
  storage.postponeTask(d1);

  const d2 = new Date(2026, 10, 2, 10, 0, 0);
  storage.syncDailyRollover(d2);
  assert.equal(storage.getState().journey.currentDay, 1);
  storage.completeTask({ feedback: 'tam_kivaminda' }, d2);

  const badge = storage.getProgressStats().badges.find(b => b.id === 'zor_gune_ragmen');
  assert.equal(badge.isUnlocked, true);
});

test('weeklySummary reflects zorlandim feedback compassionately when present in current week', () => {
  installBrowserMock();
  storage.resetAll();
  const d1 = new Date(2026, 10, 1, 10, 0, 0);
  storage.completeTask({ feedback: 'zorlandim' }, d1);
  const summary = storage.getProgressStats().weeklySummary;
  assert.equal(summary.weekCompletedCount, 1);
  assert.match(summary.message, /zorlan/i);
});
```

- [ ] **Step 2: Testi çalıştır ve başarısız olduğunu doğrula**

Run: `npm test`
Expected: FAIL (`zor_gune_ragmen` 5 kolay günde yanlışlıkla `true` döner).

- [ ] **Step 3: `storage.js` ve `Progress.js` güncellemelerini uygula**

- `storage.js`:
  - `completeTask` içinde `wasPostponed: Boolean(prevStatus.postponedAt || prevStatus.wasPostponed)` alanını `dayStatusMap[currentDay]` içinde sakla.
  - `getProgressStats()` içinde `zor_gune_ragmen` koşulunu gerçek toparlanma kanıtına bağla (`wasPostponed && status === 'completed'` veya `dPrev < d` için `zorlandim`/`postponed` sonrası `d` gününün `completed` olması).
  - `weeklySummary.message` metnini o haftaki `zorlandim` / `postponed` / `cok_kolay` sayılarına göre şefkatli ve somut üret.
  - `stageBounds` ve `archivedJourneys` alanlarını `getProgressStats()` çıktısına ekle.
- `Progress.js` & `progress.css`:
  - `render()` başında `storage.syncDailyRollover()` çağır.
  - 4 aşama kartındaki gün aralıklarını (`Gün 1–7` / `Gün 1–10` vb.) ve yolculuk ızgarasındaki `T / F / G / Y` harflerini `stats.stageBounds` üzerinden dinamik hesapla.
  - `stats.archivedJourneys.length > 0` olduğunda sayfa altında sade bir *"Geçmiş yolculuklar"* kart listesi göster (alan başlığı, tamamlanan gün sayısı, tarih).

- [ ] **Step 4: Testleri ve derlemeyi çalıştır**

Run: `npm test && npm run build`
Expected: PASS.

- [ ] **Step 5: Commit oluştur**

```bash
git add src/utils/storage.js src/components/Progress.js src/styles/progress.css tests/progress-stats.test.js
git commit -m "fix(progress): enforce accurate badge criteria, dynamic weekly summary, and archived journeys view"
```

---

### Task 5: Rota Korumaları, Şema Doğrulamalı JSON İçe Aktarma ve Listener Temizliği (`main.js`, `Settings.js`)

**Files:**
- Modify: `src/utils/storage.js`
- Modify: `src/main.js`
- Modify: `src/components/Settings.js`
- Modify: `src/styles/settings.css`
- Create: `tests/settings-and-routing.test.js`

**Interfaces:**
- Consumes: `questionsData.alanlar` (geçerli alan kimlikleri doğrulaması için)
- Produces:
  - `storage.importDataJSON(rawJson: string) -> { ok: boolean, error?: string, state?: object }`
  - `storage.updateProfileSettings({ name?: string, dailyTimePreference?: number, timeOfDayPreference?: string }) -> object`
  - `resolveRoute(rawHash: string, state: object) -> string` (`src/main.js` içinde saf yönlendirme çözücü: `""` + `onboardingCompleted` → `'#today'` veya Gün 30 bitmiş ve devretmişse `'#completed'`; `onboardingCompleted === false` iken `'#today' | '#progress' | '#completed'` → `'#onboarding'`; Gün 30 tamamlanmadan `'#completed'` → `'#today'`)
  - `SettingsController.destroy() -> void` (`window.removeEventListener('themechange', ...)` ve `keydown` dinleyicilerini temizler)

- [ ] **Step 1: `tests/settings-and-routing.test.js` içinde şema doğrulama ve rota testlerini yaz**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { installBrowserMock } from './helpers/browserMock.js';
import { storage } from '../src/utils/storage.js';
import { resolveRoute } from '../src/main.js';

test('importDataJSON rejects malformed or out-of-range payloads without corrupting existing state', () => {
  installBrowserMock();
  storage.resetAll();
  storage.updateProfileSettings({ name: 'Efe', dailyTimePreference: 10 });

  const badJson = storage.importDataJSON('{bozuk');
  assert.equal(badJson.ok, false);
  assert.equal(storage.getState().profile.name, 'Efe');

  const badArea = storage.importDataJSON(JSON.stringify({
    profile: { selectedAreaId: 'kripto-kumar', onboardingCompleted: true },
    journey: { currentDay: 999 },
  }));
  assert.equal(badArea.ok, false);
  assert.equal(storage.getState().profile.name, 'Efe');
});

test('importDataJSON accepts valid exported backup, clamps strings safely, and restores journey', () => {
  installBrowserMock();
  storage.resetAll();
  storage.updateProfileSettings({ name: 'Deniz', dailyTimePreference: 15, timeOfDayPreference: 'aksam' });
  storage.completeTask({ feedback: 'tam_kivaminda', reflectionNote: 'İlk gün notu' });
  const backup = storage.exportDataJSON();

  storage.resetAll();
  const res = storage.importDataJSON(backup);
  assert.equal(res.ok, true);
  assert.equal(storage.getState().profile.name, 'Deniz');
  assert.equal(storage.getState().profile.timeOfDayPreference, 'aksam');
  assert.equal(storage.getState().journey.completedDays.includes(1), true);
});

test('resolveRoute guards uninitialized users from #today/#progress and sends returning users on empty hash to #today', () => {
  const freshState = { profile: { onboardingCompleted: false }, journey: { currentDay: 1, completedDays: [], todayActionTaken: false } };
  assert.equal(resolveRoute('#today', freshState), '#onboarding');
  assert.equal(resolveRoute('#progress', freshState), '#onboarding');
  assert.equal(resolveRoute('', freshState), '#landing');

  const activeState = { profile: { onboardingCompleted: true }, journey: { currentDay: 4, completedDays: [1, 2, 3], todayActionTaken: false } };
  assert.equal(resolveRoute('', activeState), '#today');
  assert.equal(resolveRoute('#landing', activeState), '#landing');
  assert.equal(resolveRoute('#completed', activeState), '#today');
});
```

- [ ] **Step 2: Testi çalıştır ve başarısız olduğunu doğrula**

Run: `npm test`
Expected: FAIL (`importDataJSON` ve `resolveRoute` henüz tanımlı değil).

- [ ] **Step 3: `storage.importDataJSON`, `resolveRoute` ve `Settings.js` yedek yükleme arayüzünü uygula**

- `src/utils/storage.js`:
  - `importDataJSON(rawJson)`: JSON parse, nesne kontrolü, geçerli `selectedAreaId` (`['finans','odak','wellness','iliskiler','mukemmeliyetcilik','disiplin','ozguven','uyku']`), `currentDay` (`1..30` tam sayı), `dailyTimePreference` (`[5,10,15,20]`), `completedDays` (`1..30` dizisi), `name` (`<= 40` karakter) ve `reflectionNotes` (`<= 280` karakter) doğrulamalarını yap; geçerliyse `DEFAULT_STATE` ile birleştirip kaydet ve temayı uygula; geçersizse mevcut durumu değiştirmeden `{ ok: false, error: '...' }` döndür.
  - `updateProfileSettings` içine `timeOfDayPreference` (`['sabah','ogle','aksam','fark_etmez']`) desteğini ekle.
- `src/main.js`:
  - `export function resolveRoute(rawHash, state)` saf fonksiyonunu çıkar; yalnızca `typeof document !== 'undefined' && document.getElementById('app')` mevcutken `new App()` başlat (böylece `node:test` altında yan etkisiz import edilir).
  - `handleRouting()` başında `if (this.currentController?.destroy) this.currentController.destroy();` ve `storage.syncDailyRollover()` çağır; `resolveRoute` yönlendirme sonucu mevcut hash'ten farklıysa `window.location.hash` güncelle.
- `src/components/Settings.js` & `src/styles/settings.css`:
  - Günün saati tercihi (`Sabah / Öğle / Akşam / Fark etmez`) seçim grubunu "Hitap ve günlük süre" kartına ekle.
  - "Veriler ve gizlilik" kartına `#btn-import-json` (*"Yedekten geri yükle (JSON)"*) ve gizli `<input type="file" id="input-import-json" accept=".json,application/json" hidden />` ekle; başarı/hata durumunu `calmNotice` ile bildir.
  - `themechange` ve `Escape` dinleyicilerini sınıf referanslarıyla saklayıp `destroy()` metodunda kaldır.

- [ ] **Step 4: Testleri ve derlemeyi çalıştır**

Run: `npm test && npm run build`
Expected: PASS.

- [ ] **Step 5: Commit oluştur**

```bash
git add src/utils/storage.js src/main.js src/components/Settings.js src/styles/settings.css tests/settings-and-routing.test.js
git commit -m "feat(settings,router): add validated JSON import, route guards, and listener cleanup"
```

---

### Task 6: SVG Favicon, Kullanılmayan Görsel Temizliği, Veri Bütünlüğü Testi ve `README.md` Güncellemesi

**Files:**
- Create: `public/favicon.svg`
- Delete: `public/logo-dark.png`, `public/logo-light.png`, `public/assets/hero-wellness.jpg`, `public/assets/logo-dark.png`, `public/assets/logo-light.png`, `public/assets/step-growth.jpg`, `public/assets/step-habit.jpg`, `public/assets/step-seed.jpg`, `public/assets/wellness-banner.jpg`
- Modify: `index.html:11-15`
- Modify: `README.md`
- Create: `tests/data-integrity.test.js`

**Interfaces:**
- Consumes: `src/data/questions.json`, `src/data/tasks.json`, `public/favicon.svg`, `index.html`
- Produces: Temiz `dist/` çıktısı (~4.6 MB ölü görselden arındırılmış), tema duyarlı `/favicon.svg` ve `PROJE.md` Bölüm 9.4–9.5 ile birebir örtüşen dokümantasyon.

- [ ] **Step 1: `tests/data-integrity.test.js` veri ve varlık bütünlüğü testini yaz**

8 alan × 30 görev = 240 görevin tamamının şema alanlarını (`id`, `alan`, `gun`, `asama`, `zorluk`, `sure_dk`, `baslik`, `neden`, `adimlar`, `alternatif`, `etiketler`), her alanda `7, 14, 21` hafif günlerinin varlığını, `public/favicon.svg` dosyasının varlığını, `index.html` içinde `/favicon.svg` bağlantısını ve `public/assets` ölü görsellerinin silindiğini doğrulayan testi yaz.

- [ ] **Step 2: Testi çalıştır ve başarısız olduğunu doğrula**

Run: `npm test`
Expected: FAIL (`public/favicon.svg` henüz yok ve `public/assets` hâlâ duruyor).

- [ ] **Step 3: `public/favicon.svg` oluştur, kullanılmayan 4.6 MB görselleri sil ve `index.html` ile `README.md` dosyalarını güncelle**

- `public/favicon.svg`: `BrandMark` yaprak geometrisini (`viewBox="0 0 24 24"`, `stroke-width="1.75"`, açık temada `#2C4C3B`, `@media (prefers-color-scheme: dark)` altında `#6CA07E`) içeren saf SVG oluştur.
- `index.html`: PNG ikonların üstüne `<link rel="icon" type="image/svg+xml" href="/favicon.svg" />` ekle.
- `public/logo-dark.png`, `public/logo-light.png` ve `public/assets/` klasörünü sil (`favicon-32.png`, `favicon-180.png`, `favicon-512.png` yedek olarak kalır).
- `README.md`: Emoji başlıkları sadeleştir; yeni dizin yapısını (`planEngine.js`, `favicon.svg`, `tests/`), güncel tasarım değişkenlerini (`#F7F4EE` / `#161513`), `npm test` komutunu, **kayıt/veritabanı eklerken `storage.js` içinde değişecek metodların net tablosunu** (`PROJE.md` 9.4) ve **doğrulama senaryoları listesini** (`PROJE.md` 9.5) belgele.

- [ ] **Step 4: Tüm test paketini ve üretim derlemesini çalıştır**

Run: `npm test && npm run build`
Expected: Tüm 6 test dosyası PASS; `dist/` klasöründe `/assets/*.jpg` kopyaları bulunmaz, `dist/favicon.svg` mevcuttur.

- [ ] **Step 5: Commit oluştur**

```bash
git add -A
git commit -m "chore(assets,docs): add SVG leaf favicon, prune unused 4.6MB images, and update README"
```

