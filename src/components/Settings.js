/**
 * Settings.js
 * 4.5 Ayarlar / Profil Sayfası Bileşeni
 */

import questionsData from '../data/questions.json';
import { storage } from '../utils/storage.js';
import { LeafIcon, ArrowRightIcon, DomainIcons, SunIcon, MoonIcon, SystemIcon } from './Icons.js';

export class SettingsController {
  constructor(containerEl) {
    this.container = containerEl;
    this.state = storage.getState();
    this.pendingAreaChange = null; // { newAreaId, areaTitle }
    this.showDeleteModal = false;
    this.calmNotice = null;
  }

  render() {
    this.state = storage.getState();
    const profile = this.state.profile;
    const currentArea = questionsData.alanlar.find(a => a.id === profile.selectedAreaId) || questionsData.alanlar[0];
    const currentTheme = storage.getThemePreference();

    this.container.innerHTML = `
      <main class="settings-page fade-in" id="main-content">
        <div class="container-narrow">
          
          <!-- Başlık -->
          <div class="settings-header">
            <span class="badge" style="margin-bottom: 0.65rem;">Profil & Tercihler</span>
            <h1 class="settings-title">Ayarlar</h1>
            <p class="settings-subtitle">
              Sana sesleniş biçimimizi, günlük süreni ya da gelişim alanını dilediğin an güncelleyebilirsin.
            </p>
          </div>

          ${this.calmNotice ? `
            <div class="calm-notice" style="margin-bottom: 1.5rem;" role="alert">
              ${LeafIcon({ size: 18 })}
              <span>${this.calmNotice}</span>
            </div>
          ` : ''}

          <div class="settings-sections-list">
            
            <!-- 1. Kişisel Tercihler Kartı -->
            <section class="settings-card" aria-labelledby="pref-heading">
              <div class="settings-card-header">
                ${LeafIcon({ size: 22 })}
                <h2 id="pref-heading" class="settings-card-title">Kişisel Bilgiler ve Süre</h2>
              </div>

              <!-- İsim -->
              <div class="form-row">
                <label for="settings-name-input" class="form-label">Sana nasıl hitap edelim?</label>
                <input 
                  type="text" 
                  id="settings-name-input" 
                  class="text-input" 
                  value="${this.escapeHtml(profile.name)}" 
                  placeholder="İsmin ya da hitap şeklin..."
                  maxlength="40"
                />
                <span class="form-desc">Başlıklarda ve günlük karşılamalarda kullanılır.</span>
              </div>

              <!-- Günlük Süre Tercihi -->
              <div class="form-row">
                <label class="form-label">Günlük Süre Tercihi</label>
                <div class="time-options-grid" role="group" aria-label="Günlük süre seçimi">
                  ${[5, 10, 15, 20].map(mins => `
                    <button 
                      type="button" 
                      class="time-option-label ${profile.dailyTimePreference === mins ? 'is-selected' : ''}" 
                      data-mins="${mins}"
                    >
                      ${mins} dakika
                    </button>
                  `).join('')}
                </div>
                <span class="form-desc">Bu süreyi aşan görevlerde alternatif hafif versiyonlar öne çıkarılır.</span>
              </div>

              <div style="display: flex; justify-content: flex-end; margin-top: 1.5rem;">
                <button type="button" class="btn btn-primary" id="btn-save-profile">
                  <span>Değişiklikleri Kaydet</span>
                </button>
              </div>
            </section>

            <!-- 2. Görünüm ve Tema Kartı -->
            <section class="settings-card" aria-labelledby="theme-heading">
              <div class="settings-card-header">
                ${SunIcon({ size: 22 })}
                <h2 id="theme-heading" class="settings-card-title">Görünüm ve Tema</h2>
              </div>

              <div class="form-row" style="margin-bottom: 0;">
                <label class="form-label">Tema Tercihi</label>
                <div class="theme-options-grid" role="group" aria-label="Tema seçimi">
                  <button 
                    type="button" 
                    class="theme-option-btn ${currentTheme === 'light' ? 'is-selected' : ''}" 
                    data-theme-choice="light"
                  >
                    ${SunIcon({ size: 18 })}
                    <span>Açık</span>
                  </button>
                  <button 
                    type="button" 
                    class="theme-option-btn ${currentTheme === 'dark' ? 'is-selected' : ''}" 
                    data-theme-choice="dark"
                  >
                    ${MoonIcon({ size: 18 })}
                    <span>Koyu</span>
                  </button>
                  <button 
                    type="button" 
                    class="theme-option-btn ${currentTheme === 'system' ? 'is-selected' : ''}" 
                    data-theme-choice="system"
                  >
                    ${SystemIcon({ size: 18 })}
                    <span>Sistem</span>
                  </button>
                </div>
                <span class="form-desc">Sistem seçildiğinde cihazının açık/koyu mod tercihine otomatik uyum sağlar.</span>
              </div>
            </section>

            <!-- 3. Alan Değiştirme Kartı -->
            <section class="settings-card" aria-labelledby="area-heading">
              <div class="settings-card-header">
                ${LeafIcon({ size: 22 })}
                <h2 id="area-heading" class="settings-card-title">Gelişim Alanı</h2>
              </div>

              <p style="font-size: var(--text-sm); color: var(--text-muted); margin-bottom: 1.25rem;">
                Şu anki aktif alanın: <strong>${currentArea.baslik}</strong>. Alan değiştirdiğinde mevcut yolculuğunu arşivleyebilir veya sıfırlayabilirsin.
              </p>

              <div class="domains-grid" style="grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));">
                ${questionsData.alanlar.map(d => {
                  const isCurrent = d.id === profile.selectedAreaId;
                  const isLocked = !d.aktif;
                  const iconFn = DomainIcons[d.ikon] || DomainIcons.wallet;

                  return `
                    <div 
                      class="domain-choice-card ${isCurrent ? 'is-selected' : ''} ${isLocked ? 'is-disabled' : ''}"
                      data-change-domain="${d.id}"
                      data-domain-id="${d.id}"
                      data-is-active="${d.aktif}"
                      data-domain-title="${d.baslik}"
                      role="button"
                      tabindex="0"
                    >
                      <div class="domain-icon-box" aria-hidden="true">
                        ${iconFn({ size: 22 })}
                      </div>
                      <div class="domain-card-body">
                        <div class="domain-card-title-row">
                          <span class="domain-card-title" style="font-size: 1rem;">${d.baslik}</span>
                          ${isCurrent ? `<span class="badge" style="font-size: 10px;">Aktif</span>` : ''}
                          ${isLocked ? `<span class="badge badge-earth" style="font-size: 10px;">Yakında</span>` : ''}
                        </div>
                        <p class="domain-card-desc" style="font-size: 0.8rem;">${d.aciklama}</p>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </section>

            <!-- 4. Yakında: Hesap Oluştur Pasif Bilgi Kartı (PROJE.md 4.5) -->
            <section class="auth-placeholder-card" aria-label="Bulut Hesabı Bilgilendirmesi">
              <div class="auth-placeholder-icon" aria-hidden="true">
                ${LeafIcon({ size: 22 })}
              </div>
              <div>
                <strong style="color: var(--yesil-900); font-size: 1.05rem; display: block; margin-bottom: 0.2rem;">
                  Yakında: Hesap oluştur ve ilerlemeni her cihazda sakla
                </strong>
                <p style="font-size: var(--text-xs); line-height: 1.5;">
                  Şu anda tüm verilerin güvenle tarayıcında saklanmaktadır. İleride hesabını bağlayarak telefon ve bilgisayarın arasında senkronize edebileceksin.
                </p>
              </div>
            </section>

            <!-- 5. Veri Yönetimi & Dışa Aktarma -->
            <section class="settings-card" aria-labelledby="data-heading">
              <div class="settings-card-header">
                ${LeafIcon({ size: 22 })}
                <h2 id="data-heading" class="settings-card-title">Veri Yönetimi ve Gizlilik</h2>
              </div>

              <p style="font-size: var(--text-sm); color: var(--text-muted); line-height: 1.6; margin-bottom: 1.25rem;">
                Verilerin tamamen sana aittir. Dilediğin an tüm yolculuk geçmişini ve yansıma notlarını JSON dosyası olarak indirebilir veya silebilirsin.
              </p>

              <div class="danger-actions-row">
                <button type="button" class="btn btn-secondary" id="btn-export-json">
                  <span>Verilerimi dışa aktar (JSON)</span>
                </button>

                <button type="button" class="btn-danger-soft" id="btn-open-delete-modal">
                  <span>Tüm verilerimi sil</span>
                </button>
              </div>
            </section>

            <!-- 5. Destek Kaynakları Notu (PROJE.md Bölüm 7) -->
            <section class="support-note-box" aria-label="Destek Kaynakları Notu">
              <div class="support-note-title">Destek Kaynakları & Sorumluluk Reddi</div>
              <p>
                Günden Güne'deki görevler profesyonel psikolojik, tıbbi veya finansal danışmanlık yerine geçmez. 
                Amacımız sadece günlük hayatında küçük ve sakin farkındalıklar kazanmandır. 
                Ruhsal, bedensel veya mali olarak derin bir sıkıntı yaşadığında lütfen alanında uzman bir profesyonele veya resmi destek hatlarına başvurmaktan çekinme.
              </p>
            </section>

          </div>

        </div>

        <!-- Alan Değiştirme Onay Modalı -->
        ${this.pendingAreaChange ? this.renderAreaModal() : ''}

        <!-- Veri Silme Onay Modalı -->
        ${this.showDeleteModal ? this.renderDeleteModal() : ''}

      </main>
    `;

    this.attachEvents();
  }

  renderAreaModal() {
    return `
      <div class="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-area-title">
        <div class="modal-dialog">
          <h2 id="modal-area-title" class="modal-title">Gelişim Alanını Değiştir</h2>
          <p class="modal-desc">
            Yeni alan olarak <strong>${this.pendingAreaChange.areaTitle}</strong> seçildi. Mevcut finans yolculuğundaki ilerlemen ve notların ne olsun?
          </p>
          <div class="modal-actions">
            <button type="button" class="btn btn-primary" id="btn-confirm-archive">
              <span>İlerlememi Arşivle (Önerilen)</span>
            </button>
            <button type="button" class="btn btn-secondary" id="btn-confirm-reset">
              <span>Tamamen Sıfırla</span>
            </button>
            <button type="button" class="btn btn-ghost" id="btn-cancel-modal">
              Vazgeç
            </button>
          </div>
        </div>
      </div>
    `;
  }

  renderDeleteModal() {
    return `
      <div class="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-delete-title">
        <div class="modal-dialog">
          <h2 id="modal-delete-title" class="modal-title" style="color: var(--uyari-yumusak);">Tüm Verilerini Sil</h2>
          <p class="modal-desc">
            Bu cihazdaki tüm yolculuk geçmişin, yansıma notların ve ayarların silinecektir. Bu işlem geri alınamaz. Devam etmek istiyor musun?
          </p>
          <div class="modal-actions">
            <button type="button" class="btn btn-primary" id="btn-confirm-delete" style="background-color: var(--uyari-yumusak);">
              Evet, Tümünü Sil
            </button>
            <button type="button" class="btn btn-secondary" id="btn-cancel-delete">
              Vazgeç
            </button>
          </div>
        </div>
      </div>
    `;
  }

  attachEvents() {
    // Süre seçimi butonları
    const timeBtns = this.container.querySelectorAll('.time-option-label');
    let selectedTime = this.state.profile.dailyTimePreference;

    timeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        timeBtns.forEach(b => b.classList.remove('is-selected'));
        btn.classList.add('is-selected');
        selectedTime = parseInt(btn.getAttribute('data-mins'), 10);
      });
    });

    // Tema seçimi butonları (Açık / Koyu / Sistem)
    const themeBtns = this.container.querySelectorAll('[data-theme-choice]');
    themeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const choice = btn.dataset.themeChoice;
        storage.setTheme(choice);
        themeBtns.forEach(b => b.classList.remove('is-selected'));
        btn.classList.add('is-selected');
      });
    });

    // Tema dışarıdan (Header'dan) değiştiğinde buton seçimini senkronize et
    window.addEventListener('themechange', () => {
      const activePref = storage.getThemePreference();
      const currentThemeBtns = this.container.querySelectorAll('[data-theme-choice]');
      currentThemeBtns.forEach(b => {
        if (b.dataset.themeChoice === activePref) {
          b.classList.add('is-selected');
        } else {
          b.classList.remove('is-selected');
        }
      });
    });

    // Profil kaydet butonu
    const saveProfileBtn = this.container.querySelector('#btn-save-profile');
    const nameInput = this.container.querySelector('#settings-name-input');

    if (saveProfileBtn && nameInput) {
      saveProfileBtn.addEventListener('click', () => {
        storage.updateProfileSettings({
          name: nameInput.value,
          dailyTimePreference: selectedTime
        });
        saveProfileBtn.innerHTML = `<span>Kaydedildi ✓</span>`;
        setTimeout(() => {
          if (saveProfileBtn) saveProfileBtn.innerHTML = `<span>Değişiklikleri Kaydet</span>`;
        }, 1500);
      });
    }

    // Alan seçimi tıklamaları ve klavye gezintisi
    const domainCards = this.container.querySelectorAll('[data-change-domain]');
    domainCards.forEach(card => {
      const selectDomain = () => {
        const domainId = card.getAttribute('data-change-domain');
        const isActive = card.getAttribute('data-is-active') === 'true';
        const domainTitle = card.getAttribute('data-domain-title');

        if (domainId === this.state.profile.selectedAreaId) {
          return;
        }

        if (!isActive) {
          this.calmNotice = "Bu alan sakin adımlarla hazırlanıyor. Şimdilik diğer aktif alanları deneyimleyebilirsin.";
          this.render();
          return;
        }

        // Alanı değiştirme modalını aç
        this.calmNotice = null;
        this.pendingAreaChange = { newAreaId: domainId, areaTitle: domainTitle };
        this.render();
      };

      card.addEventListener('click', selectDomain);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          selectDomain();
        }
      });
    });

    // Modal Escape tuşu desteği
    if (this.pendingAreaChange || this.showDeleteModal) {
      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          if (this.pendingAreaChange) {
            this.pendingAreaChange = null;
            this.render();
          } else if (this.showDeleteModal) {
            this.showDeleteModal = false;
            this.render();
          }
          window.removeEventListener('keydown', handleEscape);
        }
      };
      window.addEventListener('keydown', handleEscape);
    }

    // Alan modalı onayları
    const btnArchive = this.container.querySelector('#btn-confirm-archive');
    const btnReset = this.container.querySelector('#btn-confirm-reset');
    const btnCancelModal = this.container.querySelector('#btn-cancel-modal');

    if (btnArchive) {
      btnArchive.addEventListener('click', () => {
        storage.changeArea({ newAreaId: this.pendingAreaChange.newAreaId, action: 'archive' });
        this.pendingAreaChange = null;
        window.location.hash = '#today';
      });
    }

    if (btnReset) {
      btnReset.addEventListener('click', () => {
        storage.changeArea({ newAreaId: this.pendingAreaChange.newAreaId, action: 'reset' });
        this.pendingAreaChange = null;
        window.location.hash = '#today';
      });
    }

    if (btnCancelModal) {
      btnCancelModal.addEventListener('click', () => {
        this.pendingAreaChange = null;
        this.render();
      });
    }

    // JSON Dışa Aktarma
    const exportBtn = this.container.querySelector('#btn-export-json');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        this.downloadExportJSON();
      });
    }

    // Silme modalı açma
    const openDeleteBtn = this.container.querySelector('#btn-open-delete-modal');
    if (openDeleteBtn) {
      openDeleteBtn.addEventListener('click', () => {
        this.showDeleteModal = true;
        this.render();
      });
    }

    // Silme onayları
    const confirmDeleteBtn = this.container.querySelector('#btn-confirm-delete');
    const cancelDeleteBtn = this.container.querySelector('#btn-cancel-delete');

    if (confirmDeleteBtn) {
      confirmDeleteBtn.addEventListener('click', () => {
        storage.resetAll();
        window.location.hash = '#landing';
        window.location.reload();
      });
    }

    if (cancelDeleteBtn) {
      cancelDeleteBtn.addEventListener('click', () => {
        this.showDeleteModal = false;
        this.render();
      });
    }
  }

  downloadExportJSON() {
    const dataStr = storage.exportDataJSON();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `gunden-gune-verilerim-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}
