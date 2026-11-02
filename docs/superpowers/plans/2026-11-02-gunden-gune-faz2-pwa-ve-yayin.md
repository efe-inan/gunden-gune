# Günden Güne — Faz 2: Karşılama Deneyimi, Çevrimdışı PWA, Takvim Hatırlatıcısı ve Yayın Cilası Uygulama Planı

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Canlıdaki v1 çekirdeğinin üzerine; takvim günü tabanlı ara hesabını ve kayıtlı kullanıcı karşılama akışını iyileştirmek, uygulamayı telefona/masaüstüne kurulabilir çevrimdışı PWA haline getirmek, sunucusuz `.ics` takvim hatırlatıcısı eklemek ve sosyal paylaşım meta etiketleri, güvenlik başlıkları ile GitHub Actions CI hattını tamamlamak.

**Architecture:** Mevcut sıfır harici çalışma zamanı bağımlılığı korunur. PWA kurulum/Service Worker yönetimi `src/utils/pwa.js`, RFC 5545 takvim hatırlatıcısı üretimi ise saf `src/utils/reminder.js` modülüne ayrılır; tüm kalıcı veri erişimi `src/utils/storage.js` katmanında kalır. Üretim yapılandırması `public/manifest.webmanifest`, `public/sw.js`, `vercel.json` ve `.github/workflows/ci.yml` üzerinden tamamlanarak Node 24 yerleşik `node --test` paketiyle doğrulanır. *(Not: İsteğe bağlı bulut senkronizasyonu / Supabase kullanıcı hesabı harici servis ve anahtar gerektirdiği için bağımsız Faz 3 olarak ayrı tutulmuştur.)*

**Tech Stack:** Vite, Vanilla ES2025 Modules, CSS Custom Properties, Service Worker & Web App Manifest API, RFC 5545 iCalendar (`.ics`), Vercel Headers, GitHub Actions, Node.js 24 (`node:test` + `node:assert/strict`).

**Spec:** `PROJE.md` (Bölüm 2, 3, 4.1, 4.5, 6) ve `README.md` (Yol Haritası)

## Global Constraints

- Harici çalışma zamanı veya test paketi eklenmez; yalnızca tarayıcı standartları ve Node 24 yerleşik `node --test` kullanılır.
- Tüm `localStorage` okuma/yazma işlemleri `src/utils/storage.js` üzerinden yürütülür (`STORAGE_KEY = 'gunden_gune_app_state_v1'`).
- Türkçe, samimi ve sakin `"sen"` dili, tümce düzeni (sentence case), sıfır emoji ve `variables.css` sıcak kağıt (`#F7F4EE` / `#2C4C3B`) ve sıcak obsidyen (`#161513` / `#6CA07E`) tasarım belirteçleri korunur.
- Service Worker yalnızca üretim ortamında (`import.meta.env?.PROD`) otomatik kaydedilir; yerel `npm run dev` sırasında Vite HMR önbelleğe alınmaz.
- Bildirim izni dayatması (Web Push popup) yapılmaz; kullanıcının seçtiği zaman dilimi (`sabah` / `ogle` / `aksam`) standart `.ics` takvim dosyası olarak kendi isteğiyle indirilir.

## Review Focus

1. **Gece geç saat işleminin takvim günü bazında ara hesabı (`23:50` Pazartesi → `08:10` Perşembe):** Saat bazlı `72` saat farkı beklemek yerine yerel takvim günleri (`2026-11-02` → `2026-11-05` = `3` takvim günü) üzerinden `hasInactivity: true, daysInactive: 3` dönmeli ve yaz/kış saati geçişlerinden etkilenmemeli (Task 1 testi).
2. **Aktif yolculuğu olan kullanıcının `#landing` ekranında yanlışlıkla tanışmayı sıfırlaması:** `onboardingCompleted === true` olan kullanıcı ana sayfaya geldiğinde birincil CTA `#onboarding` yerine `#today` (*"Kaldığın yerden devam et · Gün X / 30"*, mezuniyette `#completed`) olmalı; ikincil bağlantı olarak `#onboarding` (*"Yeni yolculuk başlat"*) sunulmalı (Task 1 testi).
3. **Service Worker önbelleğinin yeni dağıtımı kilitlemesi veya desteklenmeyen ortamda çökmesi:** Navigasyon isteklerinde `network-first` (çevrimdışıysa `/index.html`), statik varlıklarda yalnızca aynı köken `GET` önbelleklemesi kullanılmalı; `navigator.serviceWorker` olmayan ortamlarda (`node --test`, eski tarayıcı) `registerServiceWorker()` hata fırlatmadan `{ registered: false }` dönmeli (Task 2 testi).
4. **Takvim hatırlatıcısında (`.ics`) `fark_etmez` tercihi ve RFC 5545 özel karakter/CRLF uyumu:** `timeOfDayPreference === 'fark_etmez'` iken `buildReminderICS` `null` dönmeli ve Ayarlar'da indirme butonu `disabled` olmalı; metinlerdeki `,`, `;`, `\`, `\n` karakterleri kaçışlanmalı ve satırlar `\r\n` ile birleştirilmeli (Task 3 testi).
5. **Vercel üzerinde `/sw.js` dosyasının tarayıcı tarafından uzun süreli önbelleklenmesi:** `vercel.json` içinde `/sw.js` ve `/manifest.webmanifest` için `Cache-Control: public, max-age=0, must-revalidate` başlığı zorunlu tanımlanmalı (Task 4 testi).

---

### Task 1: Yerel Takvim Günü Tabanlı Ara Hesabı ve Kayıtlı Kullanıcı Karşılama Akışı

**Files:**
- Modify: `src/utils/storage.js:365-390`
- Modify: `src/components/Landing.js:1-42`
- Create: `tests/landing-and-inactivity.test.js`

**Interfaces:**
- Consumes: `getLocalDateKey(date)` (`src/utils/storage.js`)
- Produces:
  - `getCalendarDayDiff(fromDate: Date | string, toDate: Date | string) -> number` (`src/utils/storage.js` — yerel `getFullYear()`, `getMonth()`, `getDate()` bileşenlerini `Date.UTC(y, m, d)` üzerinden tam gün farkına çevirir)
  - `storage.checkInactivity(now?: Date) -> { hasInactivity: boolean, daysInactive: number }`
  - `renderLanding(stateOverride?: object) -> string` (`src/components/Landing.js`)

- [ ] **Step 1: Başarısız olan takvim günü ara hesabı ve dinamik Landing CTA testlerini yaz**

Create `tests/landing-and-inactivity.test.js`:
```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { installBrowserMock } from './helpers/browserMock.js';
import { storage, getCalendarDayDiff } from '../src/utils/storage.js';
import { renderLanding } from '../src/components/Landing.js';

test('checkInactivity counts local calendar days so Monday 23:50 to Thursday 08:10 triggers 3-day welcome', () => {
  installBrowserMock();
  storage.resetAll();

  const monLate = new Date(2026, 10, 2, 23, 50, 0); // Pazartesi 23:50
  const thuMorning = new Date(2026, 10, 5, 8, 10, 0); // Perşembe 08:10 (56s 20dk, ama 3 takvim günü)

  assert.equal(getCalendarDayDiff(monLate, thuMorning), 3);
  storage.completeTask({ feedback: 'tam_kivaminda' }, monLate);

  const res = storage.checkInactivity(thuMorning);
  assert.equal(res.daysInactive, 3);
  assert.equal(res.hasInactivity, true);
});

test('renderLanding adapts primary CTA for fresh, active, and graduated users', () => {
  installBrowserMock();
  storage.resetAll();

  const freshHtml = renderLanding();
  assert.match(freshHtml, /href="#onboarding"/);
  assert.match(freshHtml, /Yolculuğa başla/);

  const activeHtml = renderLanding({
    profile: { onboardingCompleted: true },
    journey: { currentDay: 4, completedDays: [1, 2, 3] },
  });
  assert.match(activeHtml, /id="btn-continue-journey"/);
  assert.match(activeHtml, /href="#today"/);
  assert.match(activeHtml, /Kaldığın yerden devam et · Gün 4 \/ 30/);
  assert.match(activeHtml, /Yeni yolculuk başlat/);

  const graduatedHtml = renderLanding({
    profile: { onboardingCompleted: true },
    journey: { currentDay: 30, completedDays: [30] },
  });
  assert.match(graduatedHtml, /href="#completed"/);
  assert.match(graduatedHtml, /Mezuniyet özetini gör/);
});
```

- [ ] **Step 2: Testi çalıştır ve başarısız olduğunu doğrula**

Run: `npm test`
Expected: FAIL (`getCalendarDayDiff` dışa aktarılmamış ve `renderLanding` aktif kullanıcıda hâlâ `#onboarding` döndürüyor).

- [ ] **Step 3: `getCalendarDayDiff`, güncellenmiş `checkInactivity` ve dinamik `renderLanding` uygulamasını yaz**

- `src/utils/storage.js`: `export function getCalendarDayDiff(fromDate, toDate)` ekle; her iki tarihi `Date` nesnesine çevirip geçersizse `0`, geçerliyse `Math.max(0, Math.round((Date.UTC(to.getFullYear(), to.getMonth(), to.getDate()) - Date.UTC(from.getFullYear(), from.getMonth(), from.getDate())) / 86400000))` döndür. `checkInactivity` içinde `diffDays = getCalendarDayDiff(last, refNow)` kullan.
- `src/components/Landing.js`: `storage` modülünü içe aktar; `export function renderLanding(stateOverride = null)` içinde `const state = stateOverride || storage.getState()` oku.
  - `!state?.profile?.onboardingCompleted`: mevcut `#btn-start-onboarding` (`href="#onboarding"`, *"Yolculuğa başla"*) ve `#nasil-calisir` (*"Nasıl çalışır?"*) korunur.
  - Mezuniyet (`currentDay >= 30 && completedDays.includes(30)`): birincil buton `id="btn-continue-journey"` `href="#completed"` (*"Mezuniyet özetini gör"*), ikincil bağlantı `href="#onboarding"` (*"Yeni yolculuk başlat"*).
  - Aktif yolculuk: birincil buton `id="btn-continue-journey"` `href="#today"` (`Kaldığın yerden devam et · Gün ${currentDay} / 30`), ikincil bağlantı `href="#onboarding"` (*"Yeni yolculuk başlat"*). `currentDay` değerini `Math.max(1, Math.min(30, Number(state?.journey?.currentDay) || 1))` ile sınırla.

- [ ] **Step 4: Tüm testleri çalıştır ve geçtiğini doğrula**

Run: `npm test`
Expected: PASS (tüm mevcut testler + 2 yeni test yeşil).

- [ ] **Step 5: Commit oluştur**

```bash
git add src/utils/storage.js src/components/Landing.js tests/landing-and-inactivity.test.js
git commit -m "feat(landing,storage): use calendar-day inactivity diff and resume CTA for returning users"
```

---

### Task 2: Kurulabilir Çevrimdışı PWA Altyapısı (`manifest.webmanifest`, `sw.js`, `pwa.js`)

**Files:**
- Create: `public/manifest.webmanifest`
- Create: `public/sw.js`
- Create: `src/utils/pwa.js`
- Modify: `src/main.js:6-16,67-72`
- Modify: `src/components/Settings.js:8-38,155-162,380-420`
- Create: `tests/pwa.test.js`

**Interfaces:**
- Consumes: `window`, `navigator.serviceWorker`, `beforeinstallprompt` olayı
- Produces:
  - `initPwaInstallListener(win?: Window) -> () => void` (`src/utils/pwa.js`)
  - `canInstallPwa() -> boolean` (`src/utils/pwa.js`)
  - `promptPwaInstall() -> Promise<{ outcome: 'accepted' | 'dismissed' | 'unavailable' }>` (`src/utils/pwa.js`)
  - `registerServiceWorker(nav?: Navigator, swUrl?: string) -> Promise<{ registered: boolean }>` (`src/utils/pwa.js`)
  - `resetPwaStateForTests() -> void` (`src/utils/pwa.js`)

- [ ] **Step 1: Başarısız olan PWA birim, kurulum istemi ve Service Worker bütünlük testlerini yaz**

Create `tests/pwa.test.js`:
```js
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { installBrowserMock, createContainer } from './helpers/browserMock.js';
import { storage } from '../src/utils/storage.js';
import {
  initPwaInstallListener,
  canInstallPwa,
  promptPwaInstall,
  registerServiceWorker,
  resetPwaStateForTests,
} from '../src/utils/pwa.js';
import { SettingsController } from '../src/components/Settings.js';

test('registerServiceWorker safely returns { registered: false } when serviceWorker is unsupported or throws', async () => {
  assert.deepEqual(await registerServiceWorker({}), { registered: false });
  const failingNav = {
    serviceWorker: {
      register: async () => {
        throw new Error('SW blocked');
      },
    },
  };
  assert.deepEqual(await registerServiceWorker(failingNav, '/sw.js'), { registered: false });

  let registeredUrl = null;
  const okNav = {
    serviceWorker: {
      register: async (url) => {
        registeredUrl = url;
        return { scope: '/' };
      },
    },
  };
  assert.deepEqual(await registerServiceWorker(okNav, '/sw.js'), { registered: true });
  assert.equal(registeredUrl, '/sw.js');
});

test('beforeinstallprompt enables #btn-install-pwa in SettingsController and clears after accepted prompt', async () => {
  const { window: win } = installBrowserMock();
  storage.resetAll();
  resetPwaStateForTests();
  const cleanup = initPwaInstallListener(win);

  assert.equal(canInstallPwa(), false);

  let promptCalled = false;
  const fakeEvent = new CustomEvent('beforeinstallprompt');
  fakeEvent.preventDefault = () => {};
  fakeEvent.prompt = async () => {
    promptCalled = true;
  };
  fakeEvent.userChoice = Promise.resolve({ outcome: 'accepted' });
  win.dispatchEvent(fakeEvent);

  assert.equal(canInstallPwa(), true);

  const container = createContainer();
  const ctrl = new SettingsController(container);
  ctrl.render();
  assert.ok(container.querySelector('#btn-install-pwa'), 'Expected #btn-install-pwa when installable');

  const res = await promptPwaInstall();
  assert.equal(promptCalled, true);
  assert.equal(res.outcome, 'accepted');
  assert.equal(canInstallPwa(), false);

  ctrl.destroy();
  cleanup();
});

test('manifest.webmanifest and sw.js exist with valid offline navigation fallback rules', () => {
  const root = process.cwd();
  const manifestRaw = fs.readFileSync(path.join(root, 'public', 'manifest.webmanifest'), 'utf8');
  const manifest = JSON.parse(manifestRaw);

  assert.equal(manifest.name, 'Günden Güne');
  assert.equal(manifest.display, 'standalone');
  assert.equal(manifest.start_url, '/#today');
  assert.ok(Array.isArray(manifest.icons) && manifest.icons.length >= 3);

  const swCode = fs.readFileSync(path.join(root, 'public', 'sw.js'), 'utf8');
  assert.match(swCode, /gunden-gune-shell-v1/);
  assert.match(swCode, /request\.mode === 'navigate'/);
  assert.match(swCode, /caches\.keys\(\)/);
});
```

- [ ] **Step 2: Testi çalıştır ve başarısız olduğunu doğrula**

Run: `npm test`
Expected: FAIL (`ERR_MODULE_NOT_FOUND` — `src/utils/pwa.js` henüz yok).

- [ ] **Step 3: `manifest.webmanifest`, `sw.js`, `pwa.js` oluştur ve `main.js` / `Settings.js` bağlantılarını kur**

- `public/manifest.webmanifest`: `name: "Günden Güne"`, `short_name: "Günden Güne"`, `description`, `lang: "tr"`, `start_url: "/#today"`, `scope: "/"`, `display: "standalone"`, `background_color: "#F7F4EE"`, `theme_color: "#2C4C3B"`, `icons`: `/favicon.svg` (`any`), `/favicon-180.png` (`180x180`, `image/png`), `/favicon-512.png` (`512x512`, `image/png`, `any maskable`).
- `public/sw.js`:
  - `CACHE_NAME = 'gunden-gune-shell-v1'`, `APP_SHELL = ['/', '/index.html', '/manifest.webmanifest', '/favicon.svg', '/favicon-32.png', '/favicon-180.png']`.
  - `install`: `caches.open(CACHE_NAME).then(c => c.addAll(APP_SHELL))` + `self.skipWaiting()`.
  - `activate`: `caches.keys()` içinde `key !== CACHE_NAME` olanları sil + `self.clients.claim()`.
  - `fetch`: `request.method !== 'GET'` veya `new URL(request.url).origin !== self.location.origin` ise dokunma (`return`). `request.mode === 'navigate'` ise ağ öncelikli (`fetch(request)` başarılıysa önbellekte `/index.html` güncelle, hata verirse `caches.match('/index.html')`). Diğer aynı köken statik varlıklarda `stale-while-revalidate` uygula.
- `src/utils/pwa.js`: modül içi `deferredPrompt = null` durumuyla `initPwaInstallListener`, `canInstallPwa`, `promptPwaInstall`, `registerServiceWorker`, `resetPwaStateForTests` fonksiyonlarını uygula; tüm `try/catch` korumalarıyla desteklenmeyen ortamda hata fırlatma.
- `src/main.js`: `App.init()` içinde `initPwaInstallListener(window)` çağır; yalnızca `Boolean(import.meta.env?.PROD)` doğruysa `registerServiceWorker(navigator, '/sw.js')` çağır.
- `src/components/Settings.js`: Görünüm kartının altına `canInstallPwa()` doğru olduğunda `#btn-install-pwa` (*"Uygulamayı ana ekrana ekle"*) satırı ekle; `pwainstallable` pencere olayını dinle ve `destroy()` içinde temizle.

- [ ] **Step 4: Tüm testleri çalıştır ve geçtiğini doğrula**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Commit oluştur**

```bash
git add public/manifest.webmanifest public/sw.js src/utils/pwa.js src/main.js src/components/Settings.js tests/pwa.test.js
git commit -m "feat(pwa): add web manifest, offline service worker, and install prompt control"
```

---

### Task 3: Sunucusuz Takvim Hatırlatıcısı (`.ics` Dışa Aktarma — `reminder.js` & `Settings.js`)

**Files:**
- Create: `src/utils/reminder.js`
- Modify: `src/components/Settings.js:102-122,390-440`
- Modify: `tests/helpers/browserMock.js:155-165`
- Create: `tests/reminder-ics.test.js`

**Interfaces:**
- Consumes: `profile.timeOfDayPreference` (`'sabah' | 'ogle' | 'aksam' | 'fark_etmez'`), `journey.currentDay`
- Produces:
  - `TIME_SLOTS`: `{ sabah: { hour: 9, minute: 0, label: '09:00' }, ogle: { hour: 13, minute: 0, label: '13:00' }, aksam: { hour: 20, minute: 30, label: '20:30' } }`
  - `escapeIcsText(str: string) -> string` (`src/utils/reminder.js`)
  - `buildReminderICS({ areaTitle?: string, timeOfDayPreference: string, remainingDays?: number }, startDate?: Date) -> string | null` (`src/utils/reminder.js`)

- [ ] **Step 1: Başarısız olan RFC 5545 `.ics` üretimi ve Ayarlar entegrasyon testlerini yaz**

Create `tests/reminder-ics.test.js`:
```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { installBrowserMock, createContainer } from './helpers/browserMock.js';
import { storage } from '../src/utils/storage.js';
import { buildReminderICS, escapeIcsText } from '../src/utils/reminder.js';
import { SettingsController } from '../src/components/Settings.js';

test('buildReminderICS returns null for fark_etmez and valid CRLF RFC 5545 calendar for sabah/ogle/aksam', () => {
  assert.equal(buildReminderICS({ areaTitle: 'Finans', timeOfDayPreference: 'fark_etmez' }), null);

  const start = new Date(2026, 10, 3, 7, 0, 0); // 3 Kas 2026 07:00
  const ics = buildReminderICS(
    { areaTitle: 'Para, Finans; Not\nSatır', timeOfDayPreference: 'aksam', remainingDays: 24 },
    start
  );

  assert.ok(ics.includes('\r\n'), 'Must use CRLF line endings');
  assert.match(ics, /BEGIN:VCALENDAR/);
  assert.match(ics, /DTSTART:20261103T203000/);
  assert.match(ics, /DTEND:20261103T204000/);
  assert.match(ics, /RRULE:FREQ=DAILY;COUNT=24/);
  assert.match(ics, /TRIGGER:-PT10M/);
  assert.equal(escapeIcsText('a,b;c\\d\ne'), 'a\\,b\\;c\\\\d\\ne');
});

test('SettingsController disables #btn-download-ics when fark_etmez is selected and enables it otherwise', () => {
  installBrowserMock();
  storage.resetAll();
  storage.updateProfileSettings({ timeOfDayPreference: 'fark_etmez' });

  const container = createContainer();
  const ctrl = new SettingsController(container);
  ctrl.render();

  const btnDisabled = container.querySelector('#btn-download-ics');
  assert.ok(btnDisabled, 'Expected #btn-download-ics in Settings');
  assert.equal(btnDisabled.hasAttribute('disabled'), true);

  storage.updateProfileSettings({ timeOfDayPreference: 'sabah' });
  ctrl.render();
  const btnEnabled = container.querySelector('#btn-download-ics');
  assert.equal(btnEnabled.hasAttribute('disabled'), false);
  ctrl.destroy();
});
```

- [ ] **Step 2: Testi çalıştır ve başarısız olduğunu doğrula**

Run: `npm test`
Expected: FAIL (`ERR_MODULE_NOT_FOUND` — `src/utils/reminder.js` henüz yok).

- [ ] **Step 3: `src/utils/reminder.js` modülünü ve `Settings.js` içindeki `#btn-download-ics` aksiyonunu uygula**

- `src/utils/reminder.js`:
  - `TIME_SLOTS` sabitini tanımla (`sabah` 09:00, `ogle` 13:00, `aksam` 20:30).
  - `escapeIcsText(str)`: string değilse `''`, değilse `\`, `;`, `,` ve `\r?\n` karakterlerini RFC 5545 standardına göre kaçışla.
  - `buildReminderICS({ areaTitle = 'Gelişim yolculuğu', timeOfDayPreference, remainingDays = 30 }, startDate = new Date())`: `slot = TIME_SLOTS[timeOfDayPreference]` yoksa `null` döndür. Eğer `startDate` üzerindeki hedef saat geçmişse başlangıç gününü ertesi güne al; yerel `YYYYMMDDTHHMMSS` biçiminde 10 dakikalık `VEVENT`, `RRULE:FREQ=DAILY;COUNT=${clamp(1..30)}`, `URL:https://gunden-gune.vercel.app/#today` ve `-PT10M` `VALARM` içeren satırları `\r\n` ile birleştirerek döndür.
- `src/components/Settings.js`:
  - Zaman dilimi seçicisinin hemen altına `.ics` hatırlatıcı satırı ve `id="btn-download-ics"` (`btn btn-secondary btn-sm`) ekle. Seçili zaman dilimi butonları (`data-daytime`) tıklandığında butonun `disabled` özniteliğini (`setAttribute('disabled', '')` / `removeAttribute('disabled')`) ve açıklama metnini anlık güncelle; tıklandığında `text/calendar;charset=utf-8` Blob ile `gunden-gune-hatirlatici.ics` dosyasını indir ve `calmNotice` ile kullanıcıya bilgi ver.
- `tests/helpers/browserMock.js`: `createContainer()` içindeki sanal elemente `hasAttribute(name)` (`attrs.has(name)`) ve `removeAttribute(name)` (`attrs.delete(name)`) metodlarını ekle.

- [ ] **Step 4: Tüm testleri çalıştır ve geçtiğini doğrula**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Commit oluştur**

```bash
git add src/utils/reminder.js src/components/Settings.js tests/helpers/browserMock.js tests/reminder-ics.test.js
git commit -m "feat(reminder): add RFC 5545 .ics calendar reminder export for preferred time of day"
```

---

### Task 4: Sosyal Paylaşım Kartı (OG / Meta), `vercel.json` Güvenlik Başlıkları, `robots.txt` ve GitHub Actions CI

**Files:**
- Modify: `index.html:6-20`
- Create: `public/robots.txt`
- Create: `public/sitemap.xml`
- Create: `vercel.json`
- Create: `.github/workflows/ci.yml`
- Modify: `README.md`
- Create: `tests/production-meta.test.js`

**Interfaces:**
- Consumes: `/manifest.webmanifest`, `/sw.js`, `/favicon-512.png`, `npm test`, `npm run build`
- Produces: Tam sosyal medya/SEO meta etiketli `index.html`, önbellek ve güvenlik başlıklı `vercel.json`, arama motoru dosyaları (`robots.txt`, `sitemap.xml`) ve otomatik GitHub Actions CI hattı.

- [ ] **Step 1: Başarısız olan üretim meta etiketleri, `vercel.json` ve CI doğrulama testini yaz**

Create `tests/production-meta.test.js`:
```js
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

test('index.html includes web manifest, theme-color, canonical, and Open Graph / Twitter tags', () => {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  assert.match(html, /rel="manifest"\s+href="\/manifest\.webmanifest"/);
  assert.match(html, /rel="canonical"\s+href="https:\/\/gunden-gune\.vercel\.app\/"/);
  assert.match(html, /name="theme-color"[^>]+#F7F4EE/);
  assert.match(html, /name="theme-color"[^>]+#161513/);
  assert.match(html, /property="og:title"/);
  assert.match(html, /property="og:description"/);
  assert.match(html, /property="og:image"\s+content="https:\/\/gunden-gune\.vercel\.app\/favicon-512\.png"/);
  assert.match(html, /name="twitter:card"\s+content="summary"/);
});

test('vercel.json, robots.txt, sitemap.xml, and GitHub Actions CI workflow are properly configured', () => {
  const vercelRaw = fs.readFileSync(path.join(root, 'vercel.json'), 'utf8');
  const vercelCfg = JSON.parse(vercelRaw);
  assert.ok(Array.isArray(vercelCfg.headers) && vercelCfg.headers.length >= 2);

  const swRule = vercelCfg.headers.find(h => h.source === '/sw.js');
  assert.ok(swRule, 'Expected explicit /sw.js header rule in vercel.json');
  const swCache = swRule.headers.find(h => h.key.toLowerCase() === 'cache-control');
  assert.match(swCache.value, /max-age=0/);

  assert.equal(fs.existsSync(path.join(root, 'public', 'robots.txt')), true);
  assert.equal(fs.existsSync(path.join(root, 'public', 'sitemap.xml')), true);

  const ciYaml = fs.readFileSync(path.join(root, '.github', 'workflows', 'ci.yml'), 'utf8');
  assert.match(ciYaml, /npm test/);
  assert.match(ciYaml, /npm run build/);
});
```

- [ ] **Step 2: Testi çalıştır ve başarısız olduğunu doğrula**

Run: `npm test`
Expected: FAIL (`index.html` içinde `rel="manifest"` yok ve `vercel.json` mevcut değil).

- [ ] **Step 3: `index.html`, `vercel.json`, `robots.txt`, `sitemap.xml`, `.github/workflows/ci.yml` ve `README.md` dosyalarını oluştur/güncelle**

- `index.html`: `<link rel="manifest" href="/manifest.webmanifest" />`, `<link rel="canonical" href="https://gunden-gune.vercel.app/" />`, açık/koyu `theme-color` meta etiketleri (`#F7F4EE` ve `#161513`), `og:type`, `og:locale` (`tr_TR`), `og:site_name`, `og:title`, `og:description`, `og:url`, `og:image` (`https://gunden-gune.vercel.app/favicon-512.png`) ve `twitter:card` (`summary`), `twitter:title`, `twitter:description`, `twitter:image` etiketlerini ekle.
- `public/robots.txt`: `User-agent: *`, `Allow: /`, `Sitemap: https://gunden-gune.vercel.app/sitemap.xml`.
- `public/sitemap.xml`: `https://gunden-gune.vercel.app/` kök URL'sini içeren standart XML site haritası.
- `vercel.json`:
  - `/(.*)` için `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`.
  - `/sw.js` ve `/manifest.webmanifest` için `Cache-Control: public, max-age=0, must-revalidate`.
- `.github/workflows/ci.yml`: `main` dalına `push` ve `pull_request` tetikleyicileriyle Node `24` üzerinde `npm ci`, `npm test` ve `npm run build` çalıştıran iş akışı.
- `README.md`: Yol haritasındaki PWA ve hatırlatıcı maddelerini tamamlandı (`[x]`) olarak güncelle; dizin ağacına `pwa.js`, `reminder.js`, `manifest.webmanifest`, `sw.js` ve `vercel.json` dosyalarını ekle.

- [ ] **Step 4: Tüm test paketini ve üretim derlemesini çalıştır**

Run: `npm test && npm run build`
Expected: Tüm 10 test dosyası PASS; `dist/manifest.webmanifest`, `dist/sw.js`, `dist/robots.txt`, `dist/sitemap.xml` oluşur ve derleme sıfır hatayla biter.

- [ ] **Step 5: Commit oluştur**

```bash
git add index.html public/robots.txt public/sitemap.xml vercel.json .github/workflows/ci.yml README.md tests/production-meta.test.js
git commit -m "chore(release): add SEO/OG metadata, Vercel security headers, sitemap, and GitHub Actions CI"
```
