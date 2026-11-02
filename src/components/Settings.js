/**
 * Settings.js
 * 4.5 Ayarlar / Profil Sayfası Bileşeni
 */

import questionsData from '../data/questions.json' with { type: 'json' };
import { storage, getLocalDateKey } from '../utils/storage.js';
import { canInstallPwa, promptPwaInstall } from '../utils/pwa.js';
import { buildReminderICS, TIME_SLOTS } from '../utils/reminder.js';
import {
  isSupabaseConfigured,
  signInWithEmail,
  signOut,
  getCurrentUser,
  fetchCloudState,
  syncLocalStateToCloud,
} from '../utils/supabase.js';
import { DomainIcons, SunIcon, MoonIcon, SystemIcon } from './Icons.js';

const TIME_OF_DAY_OPTIONS = [
  { id: 'sabah', label: 'Sabah' },
  { id: 'ogle', label: 'Öğle' },
  { id: 'aksam', label: 'Akşam' },
  { id: 'fark_etmez', label: 'Fark etmez' },
];

export class SettingsController {
  constructor(containerEl) {
    this.container = containerEl;
    this.state = storage.getState();
    this.pendingAreaChange = null;
    this.showDeleteModal = false;
    this.calmNotice = null;
    this.currentUser = null;
    this.boundThemeChange = null;
    this.boundPwaInstallable = null;
    this.boundEscape = null;
    this.initCurrentUser();
  }

  async initCurrentUser() {
    try {
      this.currentUser = await getCurrentUser();
      const accountBox = this.container.querySelector('#sync-heading');
      if (accountBox && this.currentUser) {
        this.render();
      }
    } catch {
      this.currentUser = null;
    }
  }

  destroy() {
    if (this.boundThemeChange && typeof window !== 'undefined') {
      window.removeEventListener('themechange', this.boundThemeChange);
      this.boundThemeChange = null;
    }
    if (this.boundPwaInstallable && typeof window !== 'undefined') {
      window.removeEventListener('pwainstallable', this.boundPwaInstallable);
      this.boundPwaInstallable = null;
    }
    if (this.boundEscape && typeof window !== 'undefined') {
      window.removeEventListener('keydown', this.boundEscape);
      this.boundEscape = null;
    }
  }

  render() {
    this.destroy();
    this.state = storage.getState();
    const profile = this.state.profile;
    const currentArea = questionsData.alanlar.find(a => a.id === profile.selectedAreaId) || questionsData.alanlar[0];
    const currentTheme = storage.getThemePreference();
    const currentTimeOfDay = profile.timeOfDayPreference || 'sabah';

    this.container.innerHTML = `
      <main class="settings-page fade-in" id="main-content">
        <div class="container-narrow">

          <div class="page-header">
            <span class="page-meta-kicker">Tercihler</span>
            <h1 class="page-title">Ayarlar</h1>
            <p class="page-subtitle">
              Hitap biçimini, günlük ayırdığın süreyi ve çalışma alanını dilediğin zaman değiştirebilirsin.
            </p>
          </div>

          <output
            id="settings-calm-notice"
            class="calm-notice"
            style="margin-top: 0; margin-bottom: 20px; ${this.calmNotice ? '' : 'display: none;'}"
            role="status"
            aria-live="polite"
          ><span>${this.escapeHtml(this.calmNotice || '')}</span></output>

          <div class="settings-sections-list">

            <!-- 1. Hitap ve Günlük Ritim -->
            <section class="settings-card" aria-labelledby="pref-heading">
              <div class="settings-card-header">
                <h2 id="pref-heading" class="settings-card-title">Hitap ve günlük ritim</h2>
              </div>

              <div class="form-row">
                <label for="settings-name-input" class="form-label">Sana nasıl hitap edelim?</label>
                <input
                  type="text"
                  id="settings-name-input"
                  class="text-input"
                  value="${this.escapeHtml(profile.name)}"
                  placeholder="Adın veya hitap tercihin"
                  maxlength="40"
                />
                <span class="form-desc">Günlük görev ekranının üst bilgisinde yer alır</span>
              </div>

              <div class="form-row">
                <label class="form-label">Günlük süre tercihi</label>
                <div class="time-options-grid" role="group" aria-label="Günlük süre seçimi">
                  ${[5, 10, 15, 20].map(mins => `
                    <button
                      type="button"
                      class="time-option-label ${profile.dailyTimePreference === mins ? 'is-selected' : ''}"
                      data-mins="${mins}"
                    >
                      ${mins} dk
                    </button>
                  `).join('')}
                </div>
                <span class="form-desc">Bu süreyi aşan görevlerde daha hafif seçenek birincil olarak gösterilir</span>
              </div>

              <div class="form-row">
                <label class="form-label">Tercih ettiğin zaman dilimi</label>
                <div class="time-options-grid" role="group" aria-label="Günün zaman dilimi seçimi">
                  ${TIME_OF_DAY_OPTIONS.map(opt => `
                    <button
                      type="button"
                      class="daytime-option-btn ${currentTimeOfDay === opt.id ? 'is-selected' : ''}"
                      data-daytime="${opt.id}"
                    >
                      ${opt.label}
                    </button>
                  `).join('')}
                </div>
                <div style="margin-top: 12px; display: flex; flex-wrap: wrap; align-items: center; gap: 12px;">
                  <button
                    type="button"
                    class="btn btn-secondary btn-sm"
                    id="btn-download-ics"
                    ${currentTimeOfDay === 'fark_etmez' ? 'disabled' : ''}
                  >
                    <span>Takvimime hatırlatıcı ekle (.ics)</span>
                  </button>
                  <span class="form-desc" id="ics-helper-desc" style="margin-top: 0;">
                    ${currentTimeOfDay === 'fark_etmez'
                      ? 'Hatırlatıcı indirmek için sabah, öğle veya akşam seçebilirsin'
                      : `Seçili saat (${TIME_SLOTS[currentTimeOfDay]?.label || '09:00'}) için telefon veya bilgisayar takvimine eklenir`}
                  </span>
                </div>
              </div>

              <div style="display: flex; justify-content: flex-end; margin-top: 20px;">
                <button type="button" class="btn btn-primary" id="btn-save-profile">
                  <span>Değişiklikleri kaydet</span>
                </button>
              </div>
            </section>

            <!-- 2. Görünüm ve Tema -->
            <section class="settings-card" aria-labelledby="theme-heading">
              <div class="settings-card-header">
                <h2 id="theme-heading" class="settings-card-title">Görünüm</h2>
              </div>

              <div class="form-row">
                <label class="form-label">Tema tercihi</label>
                <div class="theme-options-grid" role="group" aria-label="Tema seçimi">
                  <button
                    type="button"
                    class="theme-option-btn ${currentTheme === 'light' ? 'is-selected' : ''}"
                    data-theme-choice="light"
                  >
                    ${SunIcon({ size: 16 })}
                    <span>Açık</span>
                  </button>
                  <button
                    type="button"
                    class="theme-option-btn ${currentTheme === 'dark' ? 'is-selected' : ''}"
                    data-theme-choice="dark"
                  >
                    ${MoonIcon({ size: 16 })}
                    <span>Koyu</span>
                  </button>
                  <button
                    type="button"
                    class="theme-option-btn ${currentTheme === 'system' ? 'is-selected' : ''}"
                    data-theme-choice="system"
                  >
                    ${SystemIcon({ size: 16 })}
                    <span>Sistem</span>
                  </button>
                </div>
                <span class="form-desc">Sistem seçeneği cihazının açık veya koyu görünüm ayarını izler</span>
              </div>

              ${canInstallPwa() ? `
                <div class="form-row" style="margin-top: 16px;">
                  <label class="form-label">Uygulama kısayolu</label>
                  <div>
                    <button type="button" class="btn btn-secondary btn-sm" id="btn-install-pwa">
                      <span>Uygulamayı ana ekrana ekle</span>
                    </button>
                  </div>
                  <span class="form-desc">Tam ekran ve çevrimdışı erişim için cihazına kısayol olarak kurabilirsin</span>
                </div>
              ` : ''}
            </section>

            <!-- 3. Çalışılan Alan -->
            <section class="settings-card" aria-labelledby="area-heading">
              <div class="settings-card-header">
                <h2 id="area-heading" class="settings-card-title">Çalışılan alan</h2>
              </div>

              <p style="font-size: var(--text-sm); color: var(--text-secondary); margin-bottom: 16px;">
                Aktif alanın: <strong style="color: var(--text-primary); font-weight: 500;">${currentArea.baslik}</strong>. Alan değiştirdiğinde mevcut yolculuğunu arşivleyebilir veya sıfırlayabilirsin.
              </p>

              <div class="domains-grid" style="margin-top: 0;">
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
                        ${iconFn({ size: 18 })}
                      </div>
                      <div class="domain-card-body">
                        <div class="domain-card-title-row">
                          <span class="domain-card-title">${d.baslik}</span>
                          ${isCurrent ? `<span class="badge badge-accent">Aktif</span>` : ''}
                          ${isLocked ? `<span class="badge badge-earth">Yakında</span>` : ''}
                        </div>
                        <p class="domain-card-desc">${d.aciklama}</p>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </section>

            <!-- 4. Senkronizasyon ve Bulut Yedekleme -->
            <section class="settings-card" aria-labelledby="sync-heading">
              <div class="settings-card-header">
                <h2 id="sync-heading" class="settings-card-title">Cihazlar arası eşitleme</h2>
              </div>

              ${this.currentUser ? `
                <div class="sync-account-box">
                  <p class="sync-status-active">
                    <strong>✓ Bulut eşitleme aktif:</strong> ${this.escapeHtml(this.currentUser.email || '')}
                  </p>
                  <p class="form-desc" style="margin-top: 6px;">
                    Yolculuk ilerlemen ve yansıma notların bu cihaza ve bulut hesabına eş zamanlı kaydedilir.
                  </p>
                  <div style="margin-top: 14px; display: flex; gap: 10px; flex-wrap: wrap;">
                    <button type="button" class="btn btn-secondary btn-sm" id="btn-manual-sync">
                      <span>Şimdi senkronize et</span>
                    </button>
                    <button type="button" class="btn btn-ghost btn-sm" id="btn-sign-out">
                      <span>Oturumu kapat</span>
                    </button>
                  </div>
                </div>
              ` : `
                <p style="font-size: var(--text-sm); color: var(--text-secondary); line-height: 1.6; margin-bottom: 16px;">
                  Günden Güne üyelik olmadan tamamen yerel çalışır. Dilersen e-postanla tek tıkla şifresiz giriş yapıp ilerlemeni telefon ve bilgisayarın arasında taşıyabilirsin.
                </p>

                <div class="sync-login-row" style="display: flex; gap: 8px; flex-wrap: wrap; max-width: 480px;">
                  <input
                    type="email"
                    id="sync-email-input"
                    class="text-input"
                    placeholder="ornek@eposta.com"
                    style="flex: 1; min-width: 220px;"
                  />
                  <button type="button" class="btn btn-secondary" id="btn-magic-link">
                    <span>Giriş bağlantısı gönder</span>
                  </button>
                </div>
                <span class="form-desc" style="margin-top: 8px;">
                  Şifre gerekmez; gelen e-postadaki bağlantıya tıklayarak anında oturum açabilirsin.
                </span>
              `}
            </section>

            <!-- 5. Veriler ve Gizlilik -->
            <section class="settings-card" aria-labelledby="data-heading">
              <div class="settings-card-header">
                <h2 id="data-heading" class="settings-card-title">Veriler ve gizlilik</h2>
              </div>

              <p style="font-size: var(--text-sm); color: var(--text-secondary); line-height: 1.6; margin-bottom: 16px;">
                Yolculuk geçmişini ve yansıma notlarını dilediğin an JSON dosyası olarak indirebilir, daha önce aldığın bir yedeği geri yükleyebilir veya bu cihazdan tamamen kaldırabilirsin.
              </p>

              <input type="file" id="input-import-json" accept=".json,application/json" hidden />

              <div class="danger-actions-row">
                <button type="button" class="btn btn-secondary" id="btn-export-json">
                  <span>Verilerimi dışa aktar (JSON)</span>
                </button>

                <button type="button" class="btn btn-secondary" id="btn-import-json">
                  <span>Yedekten geri yükle (JSON)</span>
                </button>

                <button type="button" class="btn-danger-soft" id="btn-open-delete-modal">
                  <span>Tüm verilerimi sil</span>
                </button>
              </div>
            </section>

            <!-- 6. Destek Kaynakları Notu -->
            <section class="support-note-box" aria-label="Destek kaynakları notu">
              <div class="support-note-title">Destek kaynakları ve sorumluluk notu</div>
              <p>
                Günden Güne'deki günlük adımlar profesyonel psikolojik, tıbbi veya finansal danışmanlık yerine geçmez. Ruhsal, bedensel veya mali açıdan zorlayıcı bir dönemden geçiyorsan alanında uzman bir profesyonele başvurmanı öneririz.
              </p>
            </section>

          </div>
        </div>

        ${this.pendingAreaChange ? this.renderAreaModal() : ''}
        ${this.showDeleteModal ? this.renderDeleteModal() : ''}
      </main>
    `;

    this.attachEvents();
  }

  renderAreaModal() {
    return `
      <div class="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-area-title">
        <div class="modal-dialog">
          <h2 id="modal-area-title" class="modal-title">Çalışma alanını değiştir</h2>
          <p class="modal-desc">
            Yeni alan olarak <strong style="color: var(--text-primary); font-weight: 500;">${this.pendingAreaChange.areaTitle}</strong> seçildi. Mevcut yolculuğundaki ilerlemen ve notların ne olsun?
          </p>
          <div class="modal-actions">
            <button type="button" class="btn btn-ghost" id="btn-cancel-modal">
              Vazgeç
            </button>
            <button type="button" class="btn btn-secondary" id="btn-confirm-reset">
              <span>Tamamen sıfırla</span>
            </button>
            <button type="button" class="btn btn-primary" id="btn-confirm-archive">
              <span>Arşivle ve geç</span>
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
          <h2 id="modal-delete-title" class="modal-title">Tüm verilerini sil</h2>
          <p class="modal-desc">
            Bu tarayıcıdaki yolculuk geçmişin, yansıma notların ve tercihlerin kalıcı olarak silinecek. Devam etmek istiyor musun?
          </p>
          <div class="modal-actions">
            <button type="button" class="btn btn-secondary" id="btn-cancel-delete">
              Vazgeç
            </button>
            <button type="button" class="btn-danger-soft" id="btn-confirm-delete">
              Evet, tümünü sil
            </button>
          </div>
        </div>
      </div>
    `;
  }

  attachEvents() {
    const timeBtns = this.container.querySelectorAll('.time-option-label');
    let selectedTime = this.state.profile.dailyTimePreference;

    timeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        timeBtns.forEach(b => b.classList.remove('is-selected'));
        btn.classList.add('is-selected');
        selectedTime = parseInt(btn.getAttribute('data-mins'), 10);
      });
    });

    const daytimeBtns = this.container.querySelectorAll('.daytime-option-btn');
    const downloadIcsBtn = this.container.querySelector('#btn-download-ics');
    const icsHelperEl = this.container.querySelector('#ics-helper-desc');
    let selectedDaytime = this.state.profile.timeOfDayPreference || 'sabah';

    daytimeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        daytimeBtns.forEach(b => b.classList.remove('is-selected'));
        btn.classList.add('is-selected');
        selectedDaytime = btn.getAttribute('data-daytime');

        if (downloadIcsBtn) {
          if (selectedDaytime === 'fark_etmez') {
            downloadIcsBtn.setAttribute('disabled', '');
          } else {
            downloadIcsBtn.removeAttribute('disabled');
          }
        }
        if (icsHelperEl) {
          icsHelperEl.textContent =
            selectedDaytime === 'fark_etmez'
              ? 'Hatırlatıcı indirmek için sabah, öğle veya akşam seçebilirsin'
              : `Seçili saat (${TIME_SLOTS[selectedDaytime]?.label || '09:00'}) için telefon veya bilgisayar takvimine eklenir`;
        }
      });
    });

    if (downloadIcsBtn) {
      downloadIcsBtn.addEventListener('click', () => {
        if (selectedDaytime === 'fark_etmez') {
          return;
        }
        storage.updateProfileSettings({ timeOfDayPreference: selectedDaytime });
        this.state = storage.getState();
        const activeArea =
          questionsData.alanlar.find(a => a.id === this.state.profile.selectedAreaId) || questionsData.alanlar[0];
        this.downloadReminderICS(selectedDaytime, activeArea.baslik);
      });
    }

    const themeBtns = this.container.querySelectorAll('[data-theme-choice]');
    themeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const choice = btn.dataset.themeChoice;
        storage.setTheme(choice);
        themeBtns.forEach(b => b.classList.remove('is-selected'));
        btn.classList.add('is-selected');
      });
    });

    this.boundThemeChange = () => {
      const activePref = storage.getThemePreference();
      const currentThemeBtns = this.container.querySelectorAll('[data-theme-choice]');
      currentThemeBtns.forEach(b => {
        if (b.dataset.themeChoice === activePref) {
          b.classList.add('is-selected');
        } else {
          b.classList.remove('is-selected');
        }
      });
    };
    window.addEventListener('themechange', this.boundThemeChange);

    this.boundPwaInstallable = () => {
      this.render();
    };
    window.addEventListener('pwainstallable', this.boundPwaInstallable);

    const installPwaBtn = this.container.querySelector('#btn-install-pwa');
    if (installPwaBtn) {
      installPwaBtn.addEventListener('click', async () => {
        const res = await promptPwaInstall();
        if (res.outcome === 'accepted') {
          this.calmNotice = 'Uygulama ana ekranına eklendi.';
        }
        this.render();
      });
    }

    const saveProfileBtn = this.container.querySelector('#btn-save-profile');
    const nameInput = this.container.querySelector('#settings-name-input');

    if (saveProfileBtn && nameInput) {
      saveProfileBtn.addEventListener('click', () => {
        storage.updateProfileSettings({
          name: nameInput.value,
          dailyTimePreference: selectedTime,
          timeOfDayPreference: selectedDaytime,
        });
        saveProfileBtn.innerHTML = `<span>Kaydedildi</span>`;
        const timer = setTimeout(() => {
          if (saveProfileBtn) saveProfileBtn.innerHTML = `<span>Değişiklikleri kaydet</span>`;
        }, 1500);
        timer.unref?.();
      });
    }

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
          this.calmNotice = 'Bu alan henüz hazırlanıyor. Şimdilik diğer aktif alanlardan birini seçebilirsin.';
          this.render();
          return;
        }

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

    if (this.pendingAreaChange || this.showDeleteModal) {
      this.boundEscape = (e) => {
        if (e.key === 'Escape') {
          if (this.pendingAreaChange) {
            this.pendingAreaChange = null;
            this.render();
          } else if (this.showDeleteModal) {
            this.showDeleteModal = false;
            this.render();
          }
        }
      };
      window.addEventListener('keydown', this.boundEscape);
    }

    const magicLinkBtn = this.container.querySelector('#btn-magic-link');
    const syncEmailInput = this.container.querySelector('#sync-email-input');

    if (magicLinkBtn && syncEmailInput) {
      magicLinkBtn.addEventListener('click', async () => {
        const email = syncEmailInput.value?.trim();
        if (!email || !email.includes('@')) {
          this.showCalmNotice('Lütfen geçerli bir e-posta adresi gir.');
          return;
        }

        magicLinkBtn.setAttribute('disabled', '');
        magicLinkBtn.innerHTML = '<span>Gönderiliyor...</span>';

        const { error } = await signInWithEmail(email);
        magicLinkBtn.removeAttribute('disabled');
        magicLinkBtn.innerHTML = '<span>Giriş bağlantısı gönder</span>';

        if (error) {
          this.showCalmNotice(error.message || 'Giriş bağlantısı gönderilemedi.');
        } else {
          this.showCalmNotice('Giriş bağlantısı e-postana gönderildi! Gelen kutundaki bağlantıya tıklayarak oturum açabilirsin.');
          syncEmailInput.value = '';
        }
      });
    }

    const manualSyncBtn = this.container.querySelector('#btn-manual-sync');
    if (manualSyncBtn) {
      manualSyncBtn.addEventListener('click', async () => {
        manualSyncBtn.innerHTML = '<span>Eşitleniyor...</span>';
        const ok = await syncLocalStateToCloud(storage.getState());
        manualSyncBtn.innerHTML = ok ? '<span>✓ Eşitlendi</span>' : '<span>Eşitleme başarısız</span>';
        const timer = setTimeout(() => {
          if (manualSyncBtn) manualSyncBtn.innerHTML = '<span>Şimdi senkronize et</span>';
        }, 2000);
        timer.unref?.();
      });
    }

    const signOutBtn = this.container.querySelector('#btn-sign-out');
    if (signOutBtn) {
      signOutBtn.addEventListener('click', async () => {
        await signOut();
        this.currentUser = null;
        this.showCalmNotice('Oturum kapatıldı. Verilerin bu cihazda yerel olarak saklanmaya devam ediyor.');
        this.render();
      });
    }

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

    const exportBtn = this.container.querySelector('#btn-export-json');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        this.downloadExportJSON();
      });
    }

    const importBtn = this.container.querySelector('#btn-import-json');
    const importInput = this.container.querySelector('#input-import-json');

    if (importBtn && importInput) {
      importBtn.addEventListener('click', () => {
        importInput.click();
      });

      importInput.addEventListener('change', async (e) => {
        const file = e.target?.files?.[0];
        if (!file) return;
        try {
          const rawText = await file.text();
          const result = storage.importDataJSON(rawText);
          this.calmNotice = result.ok
            ? 'Yedek dosyan başarıyla geri yüklendi.'
            : (result.error || 'Yedek dosyası yüklenemedi.');
          importInput.value = '';
          this.render();
        } catch {
          this.calmNotice = 'Dosya okunurken bir sorun oluştu.';
          this.render();
        }
      });
    }

    const openDeleteBtn = this.container.querySelector('#btn-open-delete-modal');
    if (openDeleteBtn) {
      openDeleteBtn.addEventListener('click', () => {
        this.showDeleteModal = true;
        this.render();
      });
    }

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

  downloadReminderICS(daytime, areaTitle) {
    const remainingDays = Math.max(1, 31 - (this.state.journey.currentDay || 1));
    const icsContent = buildReminderICS({
      areaTitle,
      timeOfDayPreference: daytime,
      remainingDays,
    });
    if (!icsContent) {
      return;
    }

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'gunden-gune-hatirlatici.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    this.showCalmNotice('Takvim hatırlatıcısı indirildi. Dosyayı açarak takvimine ekleyebilirsin.');
  }

  showCalmNotice(message) {
    this.calmNotice = message;
    const noticeEl = this.container.querySelector('#settings-calm-notice');
    if (noticeEl) {
      noticeEl.style.display = message ? '' : 'none';
      noticeEl.textContent = message || '';
      noticeEl.innerHTML = `<span>${this.escapeHtml(message || '')}</span>`;
    }
  }

  downloadExportJSON() {
    const dataStr = storage.exportDataJSON();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `gunden-gune-verilerim-${getLocalDateKey()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  escapeHtml(str) {
    if (typeof str !== 'string' || !str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}
