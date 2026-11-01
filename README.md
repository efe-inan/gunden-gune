# Günden Güne

> **Küçük adımlar, gerçek değişim.**  
> Yapay motivasyon sloganları ve ceza odaklı seri (streak) mekanikleri yerine; her gün 2 ila 15 dakikalık odaklı mikro eylemlerle kalıcı alışkanlıklar inşa eden yerel öncelikli (local-first) web uygulaması.

---

## Projenin Felsefesi

Klasik alışkanlık takip uygulamalarının büyük çoğunluğu agresif bildirimler, zincir kırma korkusu ve gerçekçi olmayan hedefler üzerine kuruludur. Bir gün kaçırıldığında kullanıcı suçluluk hisseder ve süreci tamamen bırakır.

**Günden Güne** bu döngüyü kırmak için tasarlandı:

- **Cezasız ritim:** Kaçırılan günler kırmızıyla işaretlenmez; ara verildiğinde *"Sorun değil, kaldığın yerden devam ediyoruz"* yaklaşımıyla karşılanır.
- **Mikro eylemler:** Görevler ilk günlerde 1–3 dakikalık gözlem ve farkındalık adımlarıyla başlar; direnç eşiğini düşük tutar.
- **Kişiselleştirilmiş 30 günlük akış:** Seçilen gelişim alanına, hazırbulunuşluk düzeyine, günlük süre tercihine ve alan sorularına verilen yanıtlara göre 30 günlük görev sırası ve aşama eşikleri dinamik oluşturulur.
- **Hafif günler ve enerji dostu alternatifler:** Her haftanın sonunda (`7`, `14` ve `21`. günler) dinlenme/yansıma günü yer alır; ayrıca enerjinin veya vaktin kısıtlı olduğu günler için her görevin kısa bir alternatifi bulunur.

---

## Temel Özellikler

### 1. Sekiz Gelişim Alanı ve 240 Özgün Görev

Her biri 30 günlük aşamalı görev kataloğuna sahip sekiz odak alanı bulunur:

- **Para ve Finans Yönetimi (`finans`):** Bütçe farkındalığı, harcama tetikleyicileri ve birikim alışkanlıkları.
- **Dikkat ve Odaklanma (`odak`):** Dijital sınırlar, tek işe odaklanma ve derin çalışma pratikleri.
- **Zihinsel Dinginlik ve Wellness (`wellness`):** Beden taraması, nefes düzenleme ve stresle başa çıkma.
- **Daha İyi İlişkiler Kurma (`iliskiler`):** Aktif dinleme, sağlıklı sınır koyma ve açık iletişim.
- **Mükemmeliyetçiliği Yenme (`mukemmeliyetcilik`):** "Yeterince iyi" standardı, hata toleransı ve tamamlama kası.
- **Erteleme ve Disiplin (`disiplin`):** İki dakika kuralı, sürtünme azaltma ve başlama eşiği.
- **Özgüven ve Kendine Değer (`ozguven`):** İç eleştirmeni fark etme, kanıt toplama ve öz şefkat.
- **Sağlıklı Uyku ve Günlük Rutin (`uyku`):** Akşam yavaşlama ritüeli, ekran mesafesi ve uyku hijyeni.

### 2. Aşamalı İlerleme Metodolojisi (Tohumdan Yaprağa)

Hazırbulunuşluk puanına (`readinessScore`) göre aşama sınırları otomatik uyarlanır (varsayılan sınırlar):

- **Tohum (1–7. günler):** 1–3 dakika. Gözlem ve dirençsiz ilk adımlar.
- **Filiz (8–15. günler):** 5–7 dakika. Küçük tekrarlar ve çevre düzenlemesi.
- **Gövde (16–23. günler):** 7–12 dakika. Gerçek hayatta pratik ve direnç aşma.
- **Yaprak (24–30. günler):** 8–15 dakika. Kalıcı entegrasyon, kişisel manifesto ve mezuniyet.

### 3. Uyarlanabilir Mekanikler

- **Kişiselleştirilmiş görev ve süre uyumu (`planEngine.js`):** Günlük süre tercihi (`5`, `10`, `15`, `20` dk) veya adaptif zorluk düşüşü görev süresinin altındaysa daha hafif alternatif otomatik öne çıkarılır; tam adımlar tek tıkla açılabilir.
- **Dinamik zorluk dengeleme:** Üst üste 2 kez *"Çok kolay"* veya *"Zorlandım"* geri bildirimi verildiğinde zorluk çarpanı (`-1`, `0`, `+1`) otomatik dengelenir.
- **Şefkatli geri dönüş kurtarma:** 3+ gün ara verildiğinde önceki günü tekrarlama veya plan temposunu yumuşatma seçenekleri sunulur.
- **Yerel gece yarısı senkronizasyonu:** UTC kaymasından etkilenmeyen yerel `YYYY-MM-DD` tarih anahtarıyla yeni güne geçiş otomatik algılanır.

---

## Mimari ve Dizin Yapısı

Harici çalışma zamanı veya test kütüphanesi bağımlılığı olmadan; Vite, Vanilla ES2025 modülleri, özel CSS tasarım değişkenleri ve Node.js yerleşik test koşucusu (`node --test`) ile geliştirilmiştir.

```text
gunden-gune/
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
├── tests/                       # Node.js yerleşik test paketi (node:test + browserMock)
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

## Tasarım Sistemi ve Erişilebilirlik

- **Sıcak kağıt ve doğal mürekkep paleti:** Açık temada sıcak ham kağıt (`#F7F4EE` zemin, `#FDFBF7` kart yüzeyi, `#2C4C3B` botanik vurgu), koyu temada sıcak obsidyen (`#161513` zemin, `#1C1A18` yüzey, `#6CA07E` adaçayı vurgu) kullanılır.
- **Tipografi ve ritim:** Başlıklarda `Fraunces`, arayüz ve gövde metinlerinde `Inter` kullanılır; sayaç ve istatistiklerde `tabular-nums`, tüm boşluklarda `4px` tabanlı ölçek ve tek bir yumuşatma eğrisi (`--ease-out`) uygulanır.
- **Klavye ve ekran okuyucu uyumu:** `skip-link`, görünür `:focus-visible` halkaları, `aria-live` durum bildirimleri, `Escape` ile kapanan onay kutuları ve `prefers-reduced-motion` desteği yerleşiktir.

---

## Hızlı Başlangıç

### Gereksinimler

- Node.js `v22+` (`with { type: 'json' }` ES modül içe aktarımları ve yerleşik `node --test` için; `v24` önerilir)
- npm `v10+`

### Kurulum ve Çalıştırma

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat (http://localhost:5173)
npm run dev

# Birim ve entegrasyon testlerini çalıştır
npm test

# Üretim derlemesini oluştur (dist/)
npm run build

# Üretim derlemesini yerel olarak önizle
npm run preview
```

> **Geliştirici İpucu:** Günlük görev ekranında ertesi güne geçiş simülasyon butonunu görmek için tarayıcıda `http://localhost:5173/?sim=1#today` adresini açabilirsin.

---

## İleride Kayıt ve Veritabanı (Auth / Backend) Eklemek

Uygulamada hiçbir bileşen `localStorage` API'sine doğrudan erişmez (`index.html` içindeki ilk boyama FOUT tema betiği hariç). Kullanıcı hesabı (Supabase Auth, Firebase Auth veya özel JWT) ve bulut veritabanı ekleneceği zaman bileşen kodları korunur; yalnızca aşağıdaki noktalar güncellenir:

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
3. **"Bugün olmadı" (erteleme) akışı:** Erteleme seçildiğinde suçlayıcı mesaj gösterilmez, gün durumu `postponed` olarak işlenir ve ilerleme sıfırlanmaz.
4. **3+ gün ara verme ve geri dönüş:** Son işlemden 3 veya daha fazla gün geçtiğinde `#today` ekranında şefkatli karşılama kartı açılır; kullanıcı mevcut günden devam edebilir, önceki günü tekrarlayabilir veya plan zorluğunu yumuşatabilir.
5. **Alan değiştirme:** `#settings` üzerinden gelişim alanı değiştirildiğinde mevcut yolculuk `archivedJourneys` listesine arşivlenir ve yeni alan için 1. günden temiz bir 30 günlük plan başlatılır.
6. **Veri dışa/içe aktarma ve silme:** `#settings` ekranından tüm veriler `.json` olarak indirilebilir, şema doğrulamasından geçerek geri yüklenebilir (`importDataJSON`) veya çift aşamalı onayla tamamen sıfırlanabilir.
7. **Mobil ve klavye görünümü:** `360px` mobil genişlikten masaüstüne kadar taşma olmadan çalışır; tüm etkileşimli öğeler `Tab`, `Enter`, `Space` ve `Escape` ile yönetilebilir.

---

## Lisans

Bu proje özel olarak geliştirilmektedir. Tüm hakları saklıdır.
