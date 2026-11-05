# Zorunlu Hesap & Otomatik Bulut Senkronizasyonu Uygulama Planı

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Kullanıcının ilerlemesinin kaybolmasını önlemek için onboarding sonunda hesap oluşturmayı zorunlu kılmak, manuel "buluta yedekle" seçeneklerini kaldırıp tüm ilerlemeyi hesaba arka planda otomatik senkronize etmek.

**Architecture:** 
1. Onboarding'in son adımına (plan oluşturma sonrasına) hesap bağlama / giriş adımı entegre edilir; oturum açılmadan `#today` ekranına geçiş engellenir.
2. `src/main.js` içindeki `resolveRoute` koruması güncellenir: `onboardingCompleted` olsa bile oturum açılmamışsa `#today` ve `#progress` rotaları giriş/hesap adımına yönlendirir.
3. Ayarlar ekranındaki manuel "Şimdi senkronize et" butonları kaldırılarak sadece temiz bir hesap durumu (e-posta ve Oturumu Kapat) bırakılır.
4. `storage.updateState` ile tetiklenen arka plan fısıltısı (`syncLocalStateToCloud`) her aksiyonda (görev tamamlama, not alma, erteleme) otomatik çalışır.

**Tech Stack:** Vanilla ES2025, Supabase JS Client (PKCE Magic Link & Session), Node.js built-in `node --test`.

---

## Global Constraints

- Sıfır ek kütüphane bağımlılığı (mevcut `@supabase/supabase-js` kullanılır).
- Tasarım dili: Kağıt/obsidyen renk paleti, sakin ton, sıfır agresif/panik yaratan uyarı.
- Tüm testler `node --test` ile yeşil kalmalı ve `npm run build` hatasız tamamlanmalı.

---

## Tasks

### Task 1: Router & Storage Seviyesinde Hesap Zorunluluğu Koruması
**Files:**
- Modify: `src/main.js`
- Test: `tests/settings-and-routing.test.js`

- [ ] **Step 1: Yazılacak testleri hazırla ve başarısız olduğunu gör (RED)**
  - Oturumu olmayan (auth.isAuthenticated = false veya session yok) kullanıcının `#today` veya `#progress` çağırdığında `#onboarding`'e veya `#auth` adımına yönlendirildiğini test et.
- [ ] **Step 2: `resolveRoute` mantığını güncelle**
  - `isOnboarded && isAuthenticated` şartını ara; giriş yapılmamışsa giriş ekranına yönlendir.
- [ ] **Step 3: Testleri çalıştır ve doğrula (GREEN)**
- [ ] **Step 4: Commit**

### Task 2: Onboarding Sonuna Hesap Oluşturma / Giriş Adımı Eklenmesi
**Files:**
- Modify: `src/components/Onboarding.js`
- Modify: `src/styles/onboarding.css`
- Test: `tests/plan-engine.test.js` veya `tests/onboarding-auth.test.js`

- [ ] **Step 1: Plan hazır ekranına e-posta ile Magic Link / Hesap oluşturma kartı ekle**
  - "Planın hazır! İlerlemenin kaydedilmesi ve her gün kaldığın yerden devam edebilmen için hesabını oluşturalım."
  - E-posta girişi ve "Giriş bağlantısı gönder" butonu.
- [ ] **Step 2: Oturum açıldığında (`authchange`) otomatik olarak `#today` ekranına geçişi sağla**
- [ ] **Step 3: Testleri yaz ve doğrula (GREEN)**
- [ ] **Step 4: Commit**

### Task 3: Ayarlar Ekranını Temizleme & Tam Otomatik Arka Plan Senkronizasyonu
**Files:**
- Modify: `src/components/Settings.js`
- Modify: `src/utils/supabase.js`
- Test: `tests/supabase.test.js`

- [ ] **Step 1: Ayarlar'daki manuel "Şimdi senkronize et" butonunu kaldır**
  - Yalnızca "Bağlı hesap: e-posta" ve "Oturumu kapat" bırak.
- [ ] **Step 2: Oturum açıkken tüm `storage.updateState` işlemlerinin otomatik arka planda fısıldadığını testle doğrula**
- [ ] **Step 3: Tüm test paketini (`npm test`) ve `npm run build`'i çalıştırıp doğrula**
- [ ] **Step 4: Commit**

