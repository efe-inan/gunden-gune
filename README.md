# Günden Güne

> **Küçük adımlar, gerçek değişim.**  
> Yapay motivasyon sloganları ve ceza odaklı seri (streak) sistemleri yerine; her gün 2 ila 15 dakikalık odaklı mikro eylemlerle kalıcı alışkanlıklar inşa eden yerel öncelikli (local-first) web uygulaması.

[![Vite](https://img.shields.io/badge/Build-Vite%208-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![JavaScript](https://img.shields.io/badge/ES2025-Vanilla%20JS-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![CSS3](https://img.shields.io/badge/CSS3-Design%20Tokens-2C4C3B?logo=css3&logoColor=white)](#tasarım-sistemi-ve-erişilebilirlik)
[![Tests](https://img.shields.io/badge/Tests-30%20Passing%20(node%3Atest)-2C4C3B)](#doğrulama-ve-test-senaryoları)
[![Privacy](https://img.shields.io/badge/Data-Local--First-1C1A18)](#veri-mimarisi-güvenlik-ve-gizlilik)

---

## Projenin Felsefesi

Klasik alışkanlık takip ve kişisel gelişim uygulamalarının büyük çoğunluğu agresif bildirimler, katı zincir kırma kuralları ve gerçekçi olmayan hedefler üzerine kuruludur. Bir gün kaçırıldığında kullanıcı suçluluk hisseder ve genellikle süreci tamamen terk eder.

**Günden Güne** bu döngüyü kırmak için tasarlandı:

- **Cezasız ritim:** Kaçırılan veya *"Bugün olmadı"* diyerek ertelenen günler kırmızıyla işaretlenmez ve aktif seriyi sıfırlamaz; kullanıcı *"Sorun değil, kaldığın yerden devam ediyoruz"* yaklaşımıyla karşılanır.
- **Mikro eylemler:** Görevler ilk günlerde 1–3 dakikalık gözlem ve farkındalık adımlarıyla başlar; başlama direncini en alt seviyede tutar.
- **Kişiselleştirilmiş 30 günlük akış:** Seçilen gelişim alanına, hazırbulunuşluk puanına, günlük süre tercihine ve alana özel sorulara verilen yanıtlara göre 30 günlük görev sırası (`taskOrder`) ve aşama eşikleri dinamik olarak üretilir.
- **Hafif günler ve enerji dostu alternatifler:** Her haftanın sonunda (`7`, `14` ve `21`. günler) dinlenme ve yansıma günü yer alır; ayrıca enerjinin veya vaktin kısıtlı olduğu günler için her görevin daha kısa bir alternatifi sunulur.

---

## Temel Özellikler

### 1. Sekiz Gelişim Alanı ve 240 Özgün Görev

Her biri 30 günlük aşamalı görev kataloğuna, neden açıklamasına, uygulanabilir adımlara ve düşük enerjili gün alternatifine sahip sekiz odak alanı bulunur:

- **Para ve Finans Yönetimi (`finans`):** Bütçe farkındalığı, harcama tetikleyicileri ve birikim alışkanlıkları.
- **Dikkat ve Odaklanma (`odak`):** Dijital sınırlar, tek işe odaklanma (monotasking) ve derin çalışma rutinleri.
- **Zihinsel Dinginlik ve Wellness (`wellness`):** Beden taraması, nefes düzenleme ve stresle başa çıkma.
- **Daha İyi İlişkiler Kurma (`iliskiler`):** Aktif dinleme, sağlıklı sınır koyma ve açık iletişim.
- **Mükemmeliyetçiliği Yenme (`mukemmeliyetcilik`):** "Yeterince iyi" standardı, hata toleransı ve tamamlama kası.
- **Erteleme ve Disiplin (`disiplin`):** İki dakika kuralı, sürtünme azaltma ve başlama eşiği.
- **Özgüven ve Kendine Değer (`ozguven`):** İç eleştirmeni fark etme, kanıt toplama ve öz şefkat.
- **Sağlıklı Uyku ve Günlük Rutin (`uyku`):** Akşam yavaşlama ritüeli, ekran mesafesi ve uyku hijyeni.

### 2. Aşamalı İlerleme Metodolojisi (Tohumdan Yaprağa)

Hazırbulunuşluk puanına (`readinessScore`) ve adaptif zorluk durumuna göre aşama sınırları otomatik uyarlanır (varsayılan sınırlar):

- **Tohum (1–7. günler):** 1–3 dakika. Gözlem ve dirençsiz ilk adımlar *(düşük hazırbulunuşlukta 10. güne kadar uzar)*.
- **Filiz (8–15. günler):** 5–7 dakika. Küçük tekrarlar ve çevre düzenlemesi.
- **Gövde (16–23. günler):** 7–12 dakika. Gerçek hayatta pratik ve direnç aşma.
- **Yaprak (24–30. günler):** 8–15 dakika. Kalıcı entegrasyon, kişisel manifesto ve mezuniyet.

### 3. Uyarlanabilir ve Akıllı Mekanikler

- **Kişiselleştirilmiş görev ve süre uyumu (`planEngine.js`):** Günlük süre tercihi (`5`, `10`, `15`, `20` dk) veya adaptif zorluk düşüşü görev süresinin altındaysa hafif alternatif otomatik olarak birincil kart şeklinde sunulur; tam adımlar tek tıkla açılabilir.
- **İdempotent dinamik zorluk dengeleme:** Ardışık iki farklı günde *"Çok kolay"* veya *"Zorlandım"* geri bildirimi verildiğinde zorluk çarpanı (`-1`, `0`, `+1`) otomatik dengelenir; aynı gün içindeki mükerrer tıklamalar veya fikir değişiklikleri sayacı bozmaz.
- **Şefkatli geri dönüş kurtarma:** 3+ gün ara verildiğinde kullanıcı mevcut günden devam edebilir, bir önceki görevi tekrarlayabilir (`repeatPreviousDay`) veya plan temposunu hafifletebilir (`easeDifficulty`).
- **Yerel gece yarısı senkronizasyonu:** Gece yarısı UTC kaymasından (`UTC+3`) etkilenmeyen yerel `YYYY-MM-DD` tarih anahtarıyla (`getLocalDateKey`) yeni güne geçiş otomatik algılanır; tamamlanan günlerde sayaç ilerlerken ertelenen günlerde aynı görev korunur.
- **Gerçek ilerleme rozetleri ve yolculuk arşivi:** Zorlanılan veya ertelenen bir günün ardından yola devam edildiğinde açılan *Zor güne rağmen* rozeti dahil 6 anlamlı kilometre taşı, geri bildirim duyarlı haftalık özet ve alan değişimlerinde korunan geçmiş yolculuk arşivi (`archivedJourneys`) sunulur.

---

## Mimari ve Teknoloji Yığını

Harici çalışma zamanı veya test kütüphanesi şişkinliği olmadan; tarayıcı ve Node.js standartlarını doğrudan kullanan modüler bir mimariyle geliştirilmiştir:

- **Derleyici ve Geliştirme Sunucusu:** [Vite 8](https://vitejs.dev/)
- **Uygulama Katmanı:** Vanilla ES2025 modülleri (`with { type: 'json' }` yerleşik JSON modülleri ve yaşam döngüsü/dinleyici temizliğine sahip bileşen sınıfları)
- **Yönlendirme (Routing):** Durum duyarlı rota koruyucularına (`resolveRoute`) sahip hash tabanlı SPA yönlendiricisi (`#landing`, `#onboarding`, `#today`, `#progress`, `#settings`, `#completed`)
- **Plan ve Durum Katmanı:** Saf (pure) algoritmik planlama motoru (`src/utils/planEngine.js`) ve tekil veri/depolama servisi (`src/utils/storage.js`)
- **Test Altyapısı:** Sıfır harici bağımlılıklı Node.js yerleşik test koşucusu (`node --test` + `node:assert/strict`) ve hafif DOM/LocalStorage simülasyonu (`tests/helpers/browserMock.js`)

### Dizin Yapısı

```text
gunden-gune/
├── docs/                        # Uygulama ve geliştirme planları
├── public/
│   ├── favicon.svg              # Tema duyarlı (light/dark) saf SVG yaprak ikonu
│   ├── favicon-32.png           # PNG favicon yedekleri
│   ├── favicon-180.png
│   └── favicon-512.png
├── src/
│   ├── components/
│   │   ├── Header.js            # Üst gezinme çubuğu, tema geçişi ve odak göstergesi
│   │   ├── Footer.js            # Alt bilgi alanı
│   │   ├── Icons.js             # 1.5px çizgi kalınlığında saf SVG ikon seti
│   │   ├── Landing.js           # Karşılama ve ürün tanıtım görünümü
│   │   ├── Onboarding.js        # Kişiselleştirme akışı ve 30 günlük plan üretimi
│   │   ├── Today.js             # Günün görevi, alternatif görünüm ve geri bildirim akışı
│   │   ├── Progress.js          # Aşama haritası, rozetler, yansıma notları ve arşiv
│   │   ├── Settings.js          # Tercihler, alan değişimi ve JSON içe/dışa aktarım
│   │   └── Completion.js        # 30. gün mezuniyet özeti ve yeni yolculuk başlatma
│   ├── data/
│   │   ├── questions.json       # Genel ve alana özel tanışma soruları
│   │   └── tasks.json           # 8 alan × 30 gün = 240 mikro görev veri seti
│   ├── styles/
│   │   ├── variables.css        # Renk paleti (#F7F4EE / #161513), 4px grid ve tipografi
│   │   ├── base.css             # Sıfırlama, tipografi ve duyarlı kapsayıcılar
│   │   ├── components.css       # Butonlar, kartlar, etiketler ve erişilebilirlik odakları
│   │   ├── landing.css          # Tanıtım sayfası yerleşimi
│   │   ├── onboarding.css       # Tanışma adımları ve seçim kartları
│   │   ├── today.css            # Günlük görev kartı, geri dönüş kutusu ve aksiyonlar
│   │   ├── progress.css         # İlerleme özeti, rozetler ve arşivlenmiş yolculuklar
│   │   ├── settings.css         # Ayar satırları ve onay pencereleri
│   │   └── main.css             # Stil modüllerini birleştiren giriş dosyası
│   ├── utils/
│   │   ├── planEngine.js        # Aşama sınırları, etiket eşleştirme ve görev çözümleyici
│   │   └── storage.js           # Tekil veri katmanı, rozet/istatistik ve LocalStorage yönetimi
│   └── main.js                  # Uygulama kabuğu, rota koruyucuları (resolveRoute) ve yaşam döngüsü
├── tests/                       # 30 birim ve entegrasyon testi (node:test)
│   ├── helpers/browserMock.js
│   ├── data-integrity.test.js
│   ├── plan-engine.test.js
│   ├── progress-stats.test.js
│   ├── settings-and-routing.test.js
│   ├── storage-rollover.test.js
│   └── today-flow.test.js
├── index.html                   # HTML5 giriş şablonu ve FOUT önleyici tema betiği
├── package.json                 # Geliştirme, test ve üretim betikleri
└── PROJE.md                     # Ürün ve tasarım spesifikasyonu
```

---

## Veri Mimarisi, Güvenlik ve Gizlilik

- **Tamamen istemci taraflı (Local-First):** Kullanıcının yanıtları, hedefleri ve yansıma notları yalnızca kendi cihazında (`localStorage`) saklanır. Uygulama herhangi bir sunucuya veri göndermez; analitik veya izleme kodu içermez.
- **Harici kaynaklar:** Tek ağ isteği yazı tiplerinin (`Fraunces` ve `Inter`) Google Fonts üzerinden yüklenmesidir; tam çevrimdışı/izole kurulum gerektiğinde font dosyaları `public/` dizinine alınarak yerelden sunulabilir.
- **Şema doğrulamalı veri sahipliği ve XSS koruması:** Ayarlar ekranından tüm geçmiş okunabilir `.json` formatında dışa aktarılabilir (`exportDataJSON`), şema ve tip doğrulamasından geçirilerek güvenle geri yüklenebilir (`importDataJSON`) veya çift aşamalı onayla kalıcı olarak silinebilir. Kullanıcı girdileri ve içe aktarılan metinler DOM'a basılmadan önce HTML kaçış süzgecinden (`escapeHtml`) geçirilir.
- **Backend'e hazır soyutlama:** Veri erişimi doğrudan bileşenlerden `localStorage` çağırmak yerine yalnızca `src/utils/storage.js` üzerinden yürütülür.

---

## Tasarım Sistemi ve Erişilebilirlik

- **Editoryal sıcak kağıt ve obsidyen paleti:** Açık temada sıcak ham kağıt (`#F7F4EE` zemin, `#FDFBF7` kart yüzeyi, `#2C4C3B` botanik vurgu), koyu temada sıcak obsidyen (`#161513` zemin, `#1C1A18` yüzey, `#6CA07E` adaçayı vurgu) kullanılır; açılışta tema yanıp sönmesini (FOUT) önleyen senkron betik mevcuttur.
- **Tipografi, ikonografi ve ritim:** Başlıklarda `Fraunces`, gövde ve arayüz metinlerinde `Inter` kullanılır. Sayaçlarda `tabular-nums`, tüm boşluklarda `4px` tabanlı ölçek, ikonlarda tek tip `1.5px` çizgi kalınlığı ve geçişlerde tek bir yumuşatma eğrisi (`--ease-out`) uygulanır.
- **Tam klavye ve ekran okuyucu uyumu:** `skip-link`, görünür `:focus-visible` halkaları, `aria-live` durum bildirimleri, `Escape` ile kapanan onay pencereleri, `360px`–`1440px+` duyarlı yerleşim ve `prefers-reduced-motion` desteği yerleşiktir.

---

## Hızlı Başlangıç

### Gereksinimler

- Node.js `v22+` (`with { type: 'json' }` ES modül içe aktarımları ve yerleşik `node --test` için; `v24` önerilir)
- npm `v10+`

### Kurulum ve Çalıştırma

```bash
# 1. Depoyu klonla ve dizine gir
git clone https://github.com/efe-inan/gunden-gune.git
cd gunden-gune

# 2. Bağımlılıkları yükle
npm install

# 3. Geliştirme sunucusunu başlat (http://localhost:5173)
npm run dev

# 4. Otomatik birim ve entegrasyon testlerini çalıştır (30 test)
npm test

# 5. Optimize edilmiş üretim derlemesini oluştur (dist/)
npm run build

# 6. Üretim derlemesini yerel olarak önizle
npm run preview
```

> **Geliştirici İpucu:** Günlük görev ekranında ertesi güne geçiş simülasyon butonunu görmek için tarayıcıda `http://localhost:5173/?sim=1#today` adresini açabilirsin.

---

## İleride Kayıt ve Veritabanı (Auth / Backend) Eklemek

Uygulamada hiçbir arayüz bileşeni `localStorage` API'sine doğrudan erişmez (`index.html` içindeki ilk boyama FOUT tema betiği hariç). Kullanıcı hesabı (Supabase Auth, Firebase Auth veya özel JWT) ve bulut veritabanı ekleneceği zaman bileşen kodları korunur; yalnızca aşağıdaki noktalar güncellenir:

| Dosya | Değişecek Metod / Bölüm | Dönüşüm Özeti |
| :--- | :--- | :--- |
| `src/utils/storage.js` | `DEFAULT_STATE.auth`, `getState()`, `saveState()`, `updateState()` | Yerel önbellek (`localStorage`) + uzak veritabanı (`users`, `journeys`, `day_logs`) okuma/yazma senkronizasyonu eklenir; oturum bilgisi `state.auth` altında tutulur. |
| `src/utils/storage.js` | `completeTask()`, `postponeTask()`, `changeArea()`, `restartJourney()` | İşlem sonunda iyimser güncelleme (optimistic UI) korunarak arka planda ilgili API uç noktasına (`POST /api/journey/action` vb.) kayıt gönderilir. |
| `src/utils/storage.js` | `exportDataJSON()`, `importDataJSON()`, `clearAllData()` | Yedek içe aktarma ve hesap/veri sıfırlama işlemleri uzak tablodaki kullanıcı kayıtlarını da kapsayacak şekilde genişletilir. |
| `src/main.js` | `resolveRoute()` ve `init()` | İlk açılışta aktif oturum kontrolü (`await authService.restoreSession()`) yapılır; isteğe bağlı `#login` / `#register` rotaları eklenir. |
| `src/components/Settings.js` | Hesap bölümü | Mevcut veri yönetimi kartının üstüne giriş yapma, çıkış yapma ve cihazlar arası senkronizasyon durumu satırı eklenir. |

---

## Doğrulama ve Test Senaryoları

Yeni bir sürüm çıkmadan önce hem otomatik test paketiyle (`npm test`) hem de tarayıcıda aşağıdaki temel senaryolar doğrulanmalıdır:

1. **Yeni kullanıcı akışı:** İlk açılışta `#landing` görünür; *"Başla"* ile 4 adımlı `#onboarding` tamamlandığında yanıtlarla uyumlu 30 günlük görev sırası (`taskOrder`) oluşur ve `#today` ekranına yönlendirilir.
2. **Görevi tamamlama ve mezuniyet:** Görev tamamlandığında tek soruluk geri bildirim (*"Çok kolay / Tam kıvamında / Zorlandım"*) ve isteğe bağlı yansıma notu kaydedilir; aynı gün ikinci görev açılmaz. 30. gün tamamlandığında not yazma alanı açık kalır ve `#completed` mezuniyet ekranına geçiş butonu sunulur.
3. **"Bugün olmadı" (erteleme) akışı:** Erteleme seçildiğinde suçlayıcı mesaj gösterilmez, aktif seri (`currentStreak`) sıfırlanmaz ve ertesi takvim gününde aynı görev korunur.
4. **3+ gün ara verme ve geri dönüş:** Son işlemden 3 veya daha fazla gün geçtiğinde `#today` ekranında şefkatli karşılama kartı açılır; kullanıcı mevcut günden devam edebilir, önceki günü tekrarlayabilir veya plan zorluğunu yumuşatabilir.
5. **Alan değiştirme:** `#settings` üzerinden gelişim alanı değiştirildiğinde mevcut yolculuk `archivedJourneys` listesine arşivlenir ve yeni alan için 1. günden temiz bir 30 günlük plan başlatılır.
6. **Veri dışa/içe aktarma ve silme:** `#settings` ekranından tüm veriler `.json` olarak indirilebilir, şema doğrulamasından geçerek geri yüklenebilir (`importDataJSON`) veya çift aşamalı onayla tamamen sıfırlanabilir.
7. **Mobil ve klavye görünümü:** `360px` mobil genişlikten masaüstüne kadar taşma olmadan çalışır; tüm etkileşimli öğeler `Tab`, `Enter`, `Space` ve `Escape` ile yönetilebilir.

---

## Yol Haritası (Roadmap)

- [x] 8 gelişim alanı ve 240 günlük mikro görev veri seti
- [x] Editoryal sıcak kağıt / obsidyen tasarım sistemi ve saf SVG ikon/favicon altyapısı
- [x] Yanıt, hazırbulunuşluk ve günlük süre tercihine duyarlı kişiselleştirme motoru (`planEngine.js`)
- [x] Yerel gece yarısı gün devri, cezasız erteleme ve 3+ gün ara kurtarma mekanikleri
- [x] Şema doğrulamalı JSON yedek içe/dışa aktarım ve 30 otomatik birim/entegrasyon testi
- [ ] PWA (Progressive Web App) ve Service Worker ile tam çevrimdışı çalışma desteği
- [ ] İsteğe bağlı bulut senkronizasyonu ve kullanıcı hesabı katmanı (Supabase / Auth)
- [ ] Seçilen saat dilimine (`timeOfDayPreference`) bağlı isteğe bağlı hatırlatıcı bildirimler

---

## Lisans

Bu proje özel olarak geliştirilmektedir. Tüm hakları saklıdır.
