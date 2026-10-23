# Günden Güne 🌱

> **Baskısız, sürdürülebilir ve mikro adımlarla kişisel gelişim.**  
> Yapay motivasyon sloganları ve ceza odaklı seri sistemleri yerine; her gün 2 ila 15 dakikalık odaklı adımlarla kalıcı alışkanlıklar inşa eden modern web uygulaması.

[![Vite](https://img.shields.io/badge/Build-Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![JavaScript](https://img.shields.io/badge/ES6%2B-Vanilla%20JS-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![CSS3](https://img.shields.io/badge/CSS3-Custom%20Tokens-1572B6?logo=css3&logoColor=white)](https://www.w3.org/Style/CSS/)
[![Privacy](https://img.shields.io/badge/Data-Local--First-24342B)](#-veri-mimarisi-ve-gizlilik)
[![Accessibility](https://img.shields.io/badge/a11y-Klavye%20%26%20Ekran%20Okuyucu-success)](#-erişilebilirlik-ve-tasarım-dili)

---

## 🎯 Projenin Felsefesi

Klasik alışkanlık takip ve kişisel gelişim uygulamalarının büyük çoğunluğu agresif bildirimler, katı zincir kırma (streak) kuralları ve gerçekçi olmayan hedefler üzerine kuruludur. Bir gün kaçırıldığında kullanıcı suçluluk hisseder ve genellikle uygulamayı tamamen terk eder.

**Günden Güne** bu döngüyü kırmak için tasarlandı:

- **Cezasız Ritim:** Kaçırılan günler kırmızıyla cezalandırılmaz; kullanıcı *"Sorun değil, kaldığın yerden devam ediyoruz"* anlayışıyla karşılanır.
- **Mikro Eylemler:** Görevler ilk günlerde 1–3 dakikalık mini farkındalıklarla başlar; kullanıcıyı yormadan direnç eşiğini düşürür.
- **Kişiselleştirilmiş Yol:** Kullanıcı 8 temel gelişim alanından birini seçer, hedeflerine ve mevcut durumuna göre özel olarak hazırlanan 30 günlük akışa dahil olur.
- **Hafif Günler & Alternatifler:** Her 7 günde bir dinlenme/yansıma günü bulunur; ayrıca enerjinin düşük olduğu günler için her görevin hafif bir alternatifi sunulur.

---

## 🧭 Temel Özellikler

### 1. 8 Odak Alanı & 240 Özgün Görev

Uygulama, alanında uzman yaklaşımlarla hazırlanmış 8 farklı kategori ve her kategori için 30 günlük aşamalı görev kataloğu içerir:

- 💰 **Para ve Finans Yönetimi:** Bütçe farkındalığı, harcama tetikleyicileri ve birikim alışkanlıkları.
- 🎯 **Dikkat ve Odaklanma:** Dijital detoks, tek işe odaklanma (monotasking) ve derin çalışma rutinleri.
- 🧘 **Zihinsel Dinginlik & Wellness:** Beden taraması, nefes egzersizleri ve stresle başa çıkma.
- 🤝 **Daha İyi İlişkiler Kurma:** Aktif dinleme, sınır çekme ve empati pratikleri.
- 💎 **Mükemmeliyetçiliği Yenme:** "Yeterince iyi" kavramı, hata toleransı ve kontrolü bırakma.
- ⏳ **Erteleme ve Disiplin:** 2 dakika kuralı, direnç analizi ve momentum yaratma.
- 🌿 **Özgüven ve Kendine Değer:** İç sesi terbiye etme, başarı günlüğü ve kendini sabote etmeyi durdurma.
- 🌙 **Sağlıklı Uyku ve Günlük Rutin:** Akşam rüzgârı (wind-down), ekran mesafesi ve sirkadiyen ritim.

### 2. Aşamalı İlerleme Metodolojisi (Tohumdan Yaprağa)

- **Tohum (1–7. Günler):** 1–3 dakika. Gözlem ve dirençsiz ilk adımlar.
- **Filiz (8–15. Günler):** 5–7 dakika. Tekrarlayan davranışlar ve çevre düzeni.
- **Gövde (16–23. Günler):** 7–12 dakika. Gerçek hayatta pratik ve direnç aşma.
- **Yaprak (24–30. Günler):** 8–15 dakika. Kalıcı entegrasyon, kişisel manifesto ve mezuniyet.

### 3. Akıllı ve Uyarlanabilir Mekanikler

- **Dinamik Zorluk Dengeleme:** Kullanıcı üst üste *"Çok kolay"* veya *"Zorlandım"* dediğinde sonraki adımların seviyesi algoritma tarafından otomatik olarak dengelenir.
- **Geri Dönüş Şefkati:** 3 günden uzun süre uygulamaya girilmediğinde suçlayıcı değil, güven veren sıcak bir karşılama ekranı açılır.
- **Rozetler ve Yol Haritası:** Kullanıcının geçmişini, tamamladığı görevleri ve yazdığı yansıma notlarını kronolojik olarak izleyebileceği interaktif ilerleme sayfası.
- **Koyu Mod & Sistem Entegrasyonu:** `#1A211C` derin orman tonlarında tasarlanmış, açılışta yanıp sönme (FOUT) yapmayan akıcı karanlık tema.

---

## 🏗️ Mimari ve Teknoloji Yığını

Proje; harici kütüphane şişkinliği (dependency bloat) içermeyen, tarayıcı API'larını maksimum verimle kullanan **hafif ve modüler bir mimariyle** inşa edilmiştir:

- **Çalışma Zamanı & Derleyici:** [Vite](https://vitejs.dev/) (sıfır yapılandırmalı hızlı HMR ve optimize edilmiş üretim derlemesi).
- **Mantık Katmanı:** Modern Vanilla ES6+ modülleri (Bileşen tabanlı UI ayrımı).
- **Yönlendirme (Routing):** Hash-based router (`#landing`, `#onboarding`, `#today`, `#progress`, `#settings`, `#completed`).
- **Tasarım Sistemi:** Harici CSS framework'ü kullanılmadan, tamamen projeye özel CSS Değişkenleri (Design Tokens) ile örülmüş modüler CSS yapısı.
- **Durum & Depolama Yönetimi:** Tek bir servis katmanı üzerinden (`storage.js`) yönetilen reaktif yerel veri modeli.

---

## 📂 Dizin Yapısı

```text
gunden-gune/
├── public/                      # Statik varlıklar, marka görselleri ve faviconlar
│   ├── favicon-32.png
│   ├── favicon-180.png
│   ├── favicon-512.png
│   └── assets/                  # Tema uyumlu logo dosyaları (light / dark)
├── src/
│   ├── components/              # Sayfa ve arayüz bileşenleri
│   │   ├── Header.js            # Üst navigasyon, tema geçişi ve logo
│   │   ├── Footer.js            # Alt bilgi ve marka alanı
│   │   ├── Icons.js             # Saf SVG ikon kütüphanesi
│   │   ├── Landing.js           # Karşılama ve ürün tanıtım görünümü
│   │   ├── Onboarding.js        # Kişiselleştirme ve anket akışı
│   │   ├── Today.js             # Günün görevi ve geri bildirim etkileşimi
│   │   ├── Progress.js          # 30 günlük ilerleme haritası, rozetler ve notlar
│   │   ├── Settings.js          # Tercihler, tema ayarı ve veri yönetimi
│   │   └── Completion.js        # 30. gün mezuniyet ve başarı ekranı
│   ├── data/
│   │   ├── questions.json       # Onboarding soruları ve değerlendirme ölçekleri
│   │   └── tasks.json           # 8 alan × 30 gün = 240 adet mikro görev veri seti
│   ├── styles/                  # CSS Design System modülleri
│   │   ├── variables.css        # Renk paleti, tipografi ölçekleri ve aralıklar
│   │   ├── base.css             # Tipografi, sıfırlama ve responsive kapsayıcılar
│   │   ├── components.css       # Butonlar, kartlar, modal ve rozet stilleri
│   │   ├── landing.css          # Tanıtım sayfası grid ve animasyonları
│   │   ├── onboarding.css       # Soru kartları ve ölçek butonları
│   │   ├── today.css            # Günlük kart ve geri bildirim alanı
│   │   ├── progress.css         # Yol haritası ve rozet ızgarası
│   │   ├── settings.css         # Form elemanları ve dışa aktarma modalları
│   │   └── main.css             # Tüm stil modüllerini toplayan orkestrasyon dosyası
│   ├── utils/
│   │   └── storage.js           # Veri modeli, hesaplamalar ve LocalStorage servisi
│   └── main.js                  # Uygulama başlangıcı ve Router yönetimi
├── index.html                   # HTML5 giriş şablonu ve font bağlantıları
├── package.json                 # Bağımlılıklar ve derleme betikleri
└── README.md                    # Proje dokümantasyonu
```

---

## 🔒 Veri Mimarisi ve Gizlilik

- **Tamamen İstemci Taraflı (Local-First):** Kullanıcının yanıtları, hedefleri ve yansıma notları yalnızca kendi cihazında (`localStorage`) saklanır. Uygulama herhangi bir sunucuya veri göndermez; analitik veya izleme kodu içermez.
- **Harici Kaynaklar:** Tek harici bağımlılık, yazı tiplerinin (Fraunces, Inter) Google Fonts üzerinden yüklenmesidir. Bu istek sırasında ziyaretçinin IP adresi Google'a iletilir; tam izolasyon gerekiyorsa fontlar `public/` altına alınarak yerelden sunulabilir.
- **Veri Sahipliği:** Ayarlar sayfasından tüm kullanıcı geçmişi tek tıklamayla okunabilir `JSON` formatında dışa aktarılabilir (`Backup/Export`) veya kalıcı olarak silinebilir.
- **Backend'e Hazır Soyutlama:** Veri erişimi doğrudan `localStorage` çağrıları yapmak yerine [`src/utils/storage.js`](src/utils/storage.js) servis katmanı üzerinden yürütülür. İleride PostgreSQL / Supabase veya Firebase entegrasyonu eklenmek istendiğinde yalnızca bu katmanın `async API` çağrılarına dönüştürülmesi yeterlidir.

---

## ♿ Erişilebilirlik ve Tasarım Dili

- **Sakin Renk Paleti:** Doğal adaçayı yeşili, taş beji ve sıcak toprak tonlarıyla oluşturulan arayüz, yüksek okunabilirlik hedeflenerek tasarlanmıştır (hedef: WCAG 2.1 AA kontrast oranları).
- **Erişilebilir Navigasyon:** Tüm buton ve interaktif kartlar tam klavye erişimine (`Tab`, `Enter`, `Space`) sahiptir; modallar `Escape` ile kapatılabilir. Sayfa başında ekran okuyucular için atlama bağlantısı (`skip-link`) yer alır.
- **Duyarlı (Responsive) Düzen:** 360px mobil ekranlardan 1440px+ geniş masaüstü monitörlere kadar kusursuz yerleşim ve akıcı tipografi (`clamp`).
- **Düşük Hareket Desteği:** `prefers-reduced-motion` kuralı uygulanarak hareket hassasiyeti olan kullanıcılar için geçişler otomatik olarak sadeleştirilir.

---

## 🚀 Hızlı Başlangıç

### Gereksinimler

- Node.js (v18.0 veya üzeri)
- npm (v9.0 veya üzeri)

### Kurulum

```bash
# 1. Depoyu klonlayın
git clone https://github.com/efe-inan/gunden-gune.git

# 2. Proje dizinine girin
cd gunden-gune

# 3. Bağımlılıkları yükleyin
npm install

# 4. Geliştirme sunucusunu başlatın
npm run dev
```

Tarayıcınızda `http://localhost:5173` adresine giderek uygulamayı inceleyebilirsiniz.

### Üretim Derlemesi

```bash
# Optimize edilmiş üretim dosyalarını oluşturur (dist/ klasörü altına)
npm run build

# Üretim derlemesini yerel olarak test eder
npm run preview
```

---

## 🗺️ Yol Haritası (Roadmap)

- [x] 8 gelişim alanı ve 240 günlük mikro görev veri seti
- [x] Adaptif zorluk ve cezasız ara verme mekanikleri
- [x] Koyu / Açık tema ve sistem tercihi algılama
- [x] Yerel veri yedekleme ve içe/dışa aktarım arayüzü
- [ ] PWA (Progressive Web App) ve çevrimdışı çalışma desteği (Service Worker)
- [ ] İsteğe bağlı bulut senkronizasyonu ve kullanıcı hesabı katmanı (Supabase / Auth)
- [ ] Günlük hatırlatıcılar için Web Push bildirimleri

---

## 📄 Lisans

Bu proje özel olarak geliştirilmektedir. Tüm hakları saklıdır.
