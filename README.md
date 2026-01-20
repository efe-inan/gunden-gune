# 21 Günlük Kişisel Gelişim Platformu

21 günlük dönüşüm programı içeren kapsamlı, full-stack bir kişisel gelişim platformu.

## Teknoloji Yığını (Tech Stack)

### Frontend (Önyüz)
- **Next.js 14+**: App Router mimarisi ile
- **TypeScript**: Tip güvenliği için
- **Tailwind CSS**: Modern stillendirme için
- **Framer Motion**: Akıcı animasyonlar için
- **Firebase Auth**: Kullanıcı kimlik doğrulama için
- **Recharts**: Veri görselleştirme (grafikler) için
- **Lucide React**: İkon seti

### Backend (Arka Yüz - Opsiyonel)
- **Express.js**: REST API (Şu an frontend mock data ile çalışabiliyor)
- **TypeScript**: Tip güvenliği için
- **MongoDB**: Veritabanı (Opsiyonel, Firebase'e geçiliyor)
- **JWT**: Token tabanlı kimlik doğrulama

## Proje Yapısı

```
/
├── /frontend (Next.js uygulaması)
│   ├── /app          # Sayfalar ve route'lar
│   ├── /components   # Yeniden kullanılabilir bileşenler
│   ├── /lib          # Yardımcı kütüphaneler (Firebase vb.)
│   ├── /hooks        # Özel React hook'ları
│   └── /public       # Statik dosyalar
├── /backend (Express API - Şu an pasif)
└── README.md
```

## Kurulum ve Çalıştırma

### Ön Hazırlıklar

- Node.js 18+ yüklü olmalı
- Git yüklü olmalı
- Bir Firebase projesi oluşturulmuş olmalı (Authentication aktif edilmeli)

### 1. Projeyi Kopyalayın
```bash
git clone <repository-url>
cd sdk-deneme
```

### 2. Bağımlılıkları Yükleyin (Frontend)
```bash
cd frontend
npm install
```

### 3. Çevre Değişkenlerini Ayarlayın
`frontend` klasörü içinde `.env.local` dosyası oluşturun ve Firebase bilgilerinizi girin:

```env
NEXT_PUBLIC_APP_NAME=21-Day Personal Development
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
# ... diğer Firebase anahtarları
```

### 4. Geliştirme Modunda Çalıştırın (Localhost)
```bash
npm run dev
```
Tarayıcıda [http://localhost:3000](http://localhost:3000) adresine gidin.

## Dağıtım (Deployment)

### Vercel ile Dağıtım (Önerilen)

Bu proje Vercel ile tam uyumludur.

1. Projeyi GitHub'a gönderin.
2. Vercel'de yeni proje oluşturun ve bu repoyu seçin.
3. **Root Directory** ayarını `frontend` olarak seçin.
4. `.env.local` içindeki değişkenleri Vercel Environment Variables kısmına ekleyin.
5. Deploy butonuna basın!

Detaylı bilgi için `frontend/VERCEL_DEPLOY.md` dosyasına bakabilirsiniz.

## Özellikler

### Kullanıcı Özellikleri
- ✅ Kayıt ve Giriş (Firebase & Email/Şifre)
- ✅ Onboarding (Tanıtım) akışı ve ilgi alanı seçimi
- ✅ Kişiselleştirilmiş 21 günlük program takibi
- ✅ İlerleme grafikleri ve istatistikler
- ✅ Blog okuma ve detay sayfası
- ✅ Profil yönetimi (Karanlık/Aydınlık mod)

## Lisans

MIT License
