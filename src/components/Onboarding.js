/**
 * Onboarding.js
 * 4.2 Onboarding (Soru Akışı) Bileşeni
 */

import questionsData from '../data/questions.json';
import { storage } from '../utils/storage.js';
import { LeafIcon, ArrowRightIcon, ArrowLeftIcon, CheckIcon, DomainIcons } from './Icons.js';

export class OnboardingController {
  constructor(containerEl, onComplete) {
    this.container = containerEl;
    this.onComplete = onComplete;
    
    // Geçici akış durumu
    const saved = storage.getState();
    this.formData = {
      name: saved.profile.name || '',
      selectedAreaId: saved.profile.selectedAreaId || 'finans',
      areaAnswers: { ...(saved.profile.answers || {}) },
      dailyTime: saved.profile.dailyTimePreference || 10,
      timeOfDay: saved.profile.timeOfDayPreference || 'sabah',
      readiness: saved.profile.readinessScore || 3,
    };

    // Ekran basamakları tanımları
    this.stepIndex = 0;
    this.steps = this.buildSteps();
    this.isGeneratingPlan = false;
    this.isPlanReady = false;
    this.calmNoticeMessage = null;
  }

  buildSteps() {
    const steps = [
      { id: 'name', type: 'name', title: 'Sana nasıl hitap edelim?' },
      { id: 'domain', type: 'domain', title: 'Hangi alanda kendini geliştirmek istiyorsun?' },
    ];

    // Finans soruları (veya seçilen alan soruları)
    const areaQuestions = questionsData.alanaOzelSorular[this.formData.selectedAreaId] || [];
    areaQuestions.forEach((q, idx) => {
      steps.push({
        id: `area_${idx}`,
        type: 'area_question',
        questionData: q,
        qIndex: idx + 1,
        totalQ: areaQuestions.length
      });
    });

    // Genel sorular
    questionsData.genelSorular.forEach((gq) => {
      steps.push({
        id: gq.id,
        type: 'general_question',
        questionData: gq
      });
    });

    return steps;
  }

  render() {
    if (this.isGeneratingPlan) {
      this.renderGeneratingView();
      return;
    }

    if (this.isPlanReady) {
      this.renderPlanReadyView();
      return;
    }

    const currentStep = this.steps[this.stepIndex];
    const totalSteps = this.steps.length;
    const progressPercent = Math.round(((this.stepIndex + 1) / totalSteps) * 100);

    let stepBodyHtml = '';

    switch (currentStep.type) {
      case 'name':
        stepBodyHtml = this.renderNameStep();
        break;
      case 'domain':
        stepBodyHtml = this.renderDomainStep();
        break;
      case 'area_question':
        stepBodyHtml = this.renderAreaQuestionStep(currentStep.questionData, currentStep.qIndex, currentStep.totalQ);
        break;
      case 'general_question':
        stepBodyHtml = this.renderGeneralQuestionStep(currentStep.questionData);
        break;
    }

    // Check if onboarding container shell is already mounted
    const existingShell = this.container.querySelector('#onboarding-main');

    if (!existingShell) {
      this.container.innerHTML = `
        <main class="onboarding-page fade-in" id="onboarding-main">
          <div class="container-narrow">
            
            <!-- Üst İlerleme Çubuğu -->
            <div class="onboarding-progress-wrapper" aria-label="İlerleme Durumu">
              <div class="onboarding-progress-meta">
                <span id="onboarding-step-counter">Adım ${this.stepIndex + 1} / ${totalSteps}</span>
                <span id="onboarding-step-percent">%${progressPercent}</span>
              </div>
              <div class="onboarding-progress-bar" role="progressbar" aria-valuenow="${progressPercent}" aria-valuemin="0" aria-valuemax="100">
                <div class="onboarding-progress-fill" id="onboarding-progress-fill" style="width: ${progressPercent}%;"></div>
              </div>
            </div>

            <!-- Ortadaki Büyük Kart -->
            <div class="onboarding-card">
              <div id="onboarding-step-body" class="onboarding-step-body">
                ${stepBodyHtml}
              </div>

              <div id="onboarding-notice-wrapper">
                ${this.calmNoticeMessage ? this.renderNoticeHtml(this.calmNoticeMessage) : ''}
              </div>

              <!-- Alt Gezinme Butonları -->
              <div class="onboarding-nav">
                <button type="button" class="btn btn-secondary" id="btn-onboarding-prev">
                  ${ArrowLeftIcon()}
                  <span id="btn-onboarding-prev-text">${this.stepIndex === 0 ? 'Ana Sayfa' : 'Geri'}</span>
                </button>

                <button type="button" class="btn btn-primary" id="btn-onboarding-next">
                  <span id="btn-onboarding-next-text">${this.stepIndex === totalSteps - 1 ? 'Planımı Oluştur' : 'Devam'}</span>
                  ${ArrowRightIcon()}
                </button>
              </div>
            </div>

          </div>
        </main>
      `;

      // Kalıcı gezinti butonları dinleyicileri
      const prevBtn = this.container.querySelector('#btn-onboarding-prev');
      if (prevBtn) {
        prevBtn.addEventListener('click', () => this.handlePrev());
      }
      const nextBtn = this.container.querySelector('#btn-onboarding-next');
      if (nextBtn) {
        nextBtn.addEventListener('click', () => this.handleNext());
      }
    } else {
      // Kabuk zaten mevcut: DOM'u yok etmeden yerinde güncelle (titreme veya kaybolma olmaz)
      const counterEl = existingShell.querySelector('#onboarding-step-counter');
      const percentEl = existingShell.querySelector('#onboarding-step-percent');
      const fillEl = existingShell.querySelector('#onboarding-progress-fill');
      const progressBar = existingShell.querySelector('.onboarding-progress-bar');
      const stepBodyEl = existingShell.querySelector('#onboarding-step-body');
      const noticeWrapper = existingShell.querySelector('#onboarding-notice-wrapper');
      const prevText = existingShell.querySelector('#btn-onboarding-prev-text');
      const nextText = existingShell.querySelector('#btn-onboarding-next-text');

      if (counterEl) counterEl.textContent = `Adım ${this.stepIndex + 1} / ${totalSteps}`;
      if (percentEl) percentEl.textContent = `%${progressPercent}`;
      if (fillEl) fillEl.style.width = `${progressPercent}%`;
      if (progressBar) progressBar.setAttribute('aria-valuenow', progressPercent);
      if (stepBodyEl) stepBodyEl.innerHTML = stepBodyHtml;
      if (noticeWrapper) {
        noticeWrapper.innerHTML = this.calmNoticeMessage ? this.renderNoticeHtml(this.calmNoticeMessage) : '';
      }
      if (prevText) prevText.textContent = this.stepIndex === 0 ? 'Ana Sayfa' : 'Geri';
      if (nextText) nextText.textContent = this.stepIndex === totalSteps - 1 ? 'Planımı Oluştur' : 'Devam';
    }

    this.attachStepEvents();
  }

  showNotice(msg) {
    this.calmNoticeMessage = msg;
    const wrapper = this.container.querySelector('#onboarding-notice-wrapper');
    if (wrapper) {
      wrapper.innerHTML = this.renderNoticeHtml(msg);
    }
  }

  clearNotice() {
    this.calmNoticeMessage = null;
    const wrapper = this.container.querySelector('#onboarding-notice-wrapper');
    if (wrapper) {
      wrapper.innerHTML = '';
    }
  }

  renderNoticeHtml(msg) {
    return `
      <div class="calm-notice" role="alert">
        ${LeafIcon({ size: 18 })}
        <span>${this.escapeHtml(msg)}</span>
      </div>
    `;
  }

  /* ---------------- Adım Şablonları ---------------- */

  renderNameStep() {
    return `
      <div class="question-header">
        <span class="badge question-tag">Başlangıç</span>
        <h1 class="question-title">Sana nasıl hitap edelim?</h1>
        <p class="question-desc">
          Bize sadece sana seslenmemizi istediğin ismi söyleyebilirsin. Dilersen boş da bırakabilirsin.
        </p>
      </div>

      <div class="input-group">
        <label for="user-name-input" class="sr-only">İsminiz</label>
        <input 
          type="text" 
          id="user-name-input" 
          class="text-input" 
          placeholder="İsmin ya da tercih ettiğin bir hitap..." 
          value="${this.escapeHtml(this.formData.name)}"
          maxlength="40"
          autocomplete="given-name"
        />
        <span class="input-hint">İsteğe bağlıdır. İstediğin zaman değiştirebilirsin.</span>
      </div>
    `;
  }

  renderDomainStep() {
    const domains = questionsData.alanlar;

    const cardsHtml = domains.map(d => {
      const isSelected = this.formData.selectedAreaId === d.id;
      const isLocked = !d.aktif;
      const iconFn = DomainIcons[d.ikon] || DomainIcons.wallet;

      return `
        <div 
          class="domain-choice-card ${isSelected ? 'is-selected' : ''} ${isLocked ? 'is-disabled' : ''}" 
          data-domain-id="${d.id}"
          data-is-active="${d.aktif}"
          role="button"
          tabindex="0"
          aria-pressed="${isSelected}"
        >
          <div class="domain-icon-box" aria-hidden="true">
            ${iconFn({ size: 24 })}
          </div>
          <div class="domain-card-body">
            <div class="domain-card-title-row">
              <span class="domain-card-title">${d.baslik}</span>
              ${isLocked ? `<span class="badge badge-earth">Yakında</span>` : ''}
            </div>
            <p class="domain-card-desc">${d.aciklama}</p>
          </div>
          ${isSelected ? `
            <div class="domain-check-circle" aria-hidden="true">
              ${CheckIcon({ size: 14 })}
            </div>
          ` : ''}
        </div>
      `;
    }).join('');

    return `
      <div class="question-header">
        <span class="badge question-tag">Gelişim Alanı</span>
        <h2 class="question-title">Hangi alanda kendini geliştirmek istiyorsun?</h2>
        <p class="question-desc">
          Önümüzdeki 30 gün boyunca tek bir alanda, sindirerek ve yorulmadan küçük adımlar atacağız.
        </p>
      </div>

      <div class="domains-grid" role="group" aria-label="Gelişim Alanları">
        ${cardsHtml}
      </div>
    `;
  }

  renderAreaQuestionStep(q, currentNum, totalNum) {
    const selectedVal = this.formData.areaAnswers[q.id];

    const optionsHtml = q.secenekler.map(opt => {
      const isSelected = selectedVal === opt.deger;
      return `
        <button 
          type="button" 
          class="option-btn ${isSelected ? 'is-selected' : ''}" 
          data-option-value="${opt.deger}"
          aria-pressed="${isSelected}"
        >
          <span>${opt.metin}</span>
          <span class="option-check-circle" aria-hidden="true">
            ${CheckIcon({ size: 14 })}
          </span>
        </button>
      `;
    }).join('');

    const areaObj = questionsData.alanlar.find(a => a.id === this.formData.selectedAreaId);
    const areaTitle = areaObj ? areaObj.baslik : 'Gelişim Alanı';

    return `
      <div class="question-header">
        <span class="badge question-tag">${areaTitle} • Soru ${currentNum} / ${totalNum}</span>
        <h2 class="question-title">${q.soru}</h2>
        ${q.aciklama ? `<p class="question-desc">${q.aciklama}</p>` : ''}
      </div>

      <div class="options-list" role="group" aria-label="${q.soru}">
        ${optionsHtml}
      </div>
    `;
  }

  renderGeneralQuestionStep(gq) {
    if (gq.tip === 'olcek') {
      const currentScore = this.formData.readiness;
      const buttonsHtml = [1, 2, 3, 4, 5].map(val => {
        const isSelected = currentScore === val;
        return `
          <button 
            type="button" 
            class="scale-btn ${isSelected ? 'is-selected' : ''}" 
            data-scale-value="${val}"
            aria-pressed="${isSelected}"
          >
            ${val}
          </button>
        `;
      }).join('');

      return `
        <div class="question-header">
          <span class="badge question-tag">Genel Hazırlık</span>
          <h2 class="question-title">${gq.soru}</h2>
          <p class="question-desc">${gq.aciklama}</p>
        </div>

        <div class="scale-wrapper">
          <div class="scale-buttons" role="group" aria-label="1 ile 5 arasında hazır olma puanı">
            ${buttonsHtml}
          </div>
          <div class="scale-labels" aria-hidden="true">
            <span>← ${gq.minEtiket}</span>
            <span>${gq.maxEtiket} →</span>
          </div>
        </div>
      `;
    }

    // Seçenekli genel soru (günlük süre / saat tercihi)
    let selectedVal = gq.id === 'gunluk_sure' ? this.formData.dailyTime : this.formData.timeOfDay;

    const optionsHtml = gq.secenekler.map(opt => {
      const isSelected = selectedVal === opt.deger;
      return `
        <button 
          type="button" 
          class="option-btn ${isSelected ? 'is-selected' : ''}" 
          data-option-value="${opt.deger}"
          aria-pressed="${isSelected}"
        >
          <span>${opt.metin}</span>
          <span class="option-check-circle" aria-hidden="true">
            ${CheckIcon({ size: 14 })}
          </span>
        </button>
      `;
    }).join('');

    return `
      <div class="question-header">
        <span class="badge question-tag">Günlük Ritim</span>
        <h2 class="question-title">${gq.soru}</h2>
        ${gq.aciklama ? `<p class="question-desc">${gq.aciklama}</p>` : ''}
      </div>

      <div class="options-list" role="group" aria-label="${gq.soru}">
        ${optionsHtml}
      </div>
    `;
  }

  /* ---------------- Adım 5: Plan Oluşturma ve Tamamlama ---------------- */

  renderGeneratingView() {
    this.container.innerHTML = `
      <main class="onboarding-page fade-in" id="main-content">
        <div class="container-narrow">
          <div class="onboarding-card plan-generating-view">
            <div class="plan-loader-brand" aria-label="Günden Güne">
              <div class="plan-logo-loader">
                <img src="/assets/logo-light.png" class="app-logo app-logo-light plan-loader-img" alt="Günden Güne logosu" />
                <img src="/assets/logo-dark.png" class="app-logo app-logo-dark plan-loader-img" alt="Günden Güne logosu" />
              </div>
              <span class="loader-brand-title">Günden Güne</span>
            </div>
            <h2 class="question-title" style="margin-bottom: 0.75rem;">
              Cevaplarına göre sana özel bir yol hazırlıyoruz…
            </h2>
            <p class="question-desc" style="max-width: 460px; margin: 0 auto;">
              Günün ritmine ve hazır olma durumuna en uygun başlangıç tohumlarını ekiyoruz.
            </p>
          </div>
        </div>
      </main>
    `;
  }

  renderPlanReadyView() {
    const namePart = this.formData.name.trim() ? `, ${this.formData.name.trim()}` : '';

    this.container.innerHTML = `
      <main class="onboarding-page fade-in" id="main-content">
        <div class="container-narrow">
          <div class="onboarding-card plan-ready-card">
            
            <span class="plan-summary-badge">
              ${LeafIcon({ size: 18 })}
              <span>30 Günlük Kişisel Yolculuk • Tohum Aşaması</span>
            </span>

            <h1 class="plan-ready-title">
              Planın hazır${namePart}.<br />Küçük başlıyoruz.
            </h1>

            <p class="plan-ready-text">
              Günde yaklaşık ${this.formData.dailyTime} dakika ayırarak, hiçbir zorlama ve suçluluk olmadan 
              kendine kalıcı bir farkındalık kazandıracaksın.
            </p>

            <a href="#today" class="btn btn-primary hero-start-btn" id="btn-go-to-first-task">
              <span>İlk görevime git</span>
              ${ArrowRightIcon()}
            </a>

          </div>
        </div>
      </main>
    `;
  }

  /* ---------------- Olay Yönetimi ---------------- */

  attachStepEvents() {
    const currentStep = this.steps[this.stepIndex];

    // 1. İsim adımı
    if (currentStep.type === 'name') {
      const nameInput = this.container.querySelector('#user-name-input');
      if (nameInput) {
        nameInput.addEventListener('input', (e) => {
          this.formData.name = e.target.value;
        });
      }
      return;
    }

    // 2. Alan seçimi adımı
    if (currentStep.type === 'domain') {
      const domainCards = this.container.querySelectorAll('.domain-choice-card');
      domainCards.forEach(card => {
        const selectDomain = () => {
          const domainId = card.getAttribute('data-domain-id');
          const isActive = card.getAttribute('data-is-active') === 'true';

          if (!isActive) {
            this.showNotice("Bu alan sakin adımlarla hazırlanıyor. Şimdilik diğer aktif alanları deneyimleyebilirsin.");
            return;
          }

          this.clearNotice();
          this.formData.selectedAreaId = domainId;
          this.steps = this.buildSteps();

          // Kart seçim durumunu yerinde güncelle
          domainCards.forEach(c => {
            c.classList.remove('is-selected');
            c.setAttribute('aria-pressed', 'false');
            const check = c.querySelector('.domain-check-circle') || c.querySelector('.option-check-circle');
            if (check) check.remove();
          });

          card.classList.add('is-selected');
          card.setAttribute('aria-pressed', 'true');
          if (!card.querySelector('.domain-check-circle')) {
            const checkEl = document.createElement('div');
            checkEl.className = 'domain-check-circle';
            checkEl.setAttribute('aria-hidden', 'true');
            checkEl.innerHTML = CheckIcon({ size: 14 });
            card.appendChild(checkEl);
          }
        };

        card.addEventListener('click', selectDomain);
        card.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            selectDomain();
          }
        });
      });
      return;
    }

    // 3. Soru seçenekleri (Alana özel soru ve çoktan seçmeli genel sorular)
    const optionBtns = this.container.querySelectorAll('.option-btn');
    if (optionBtns.length > 0) {
      optionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const val = btn.getAttribute('data-option-value');
          if (currentStep.type === 'area_question') {
            this.formData.areaAnswers[currentStep.questionData.id] = val;
          } else if (currentStep.type === 'general_question') {
            if (currentStep.id === 'gunluk_sure') {
              this.formData.dailyTime = parseInt(val, 10);
            } else if (currentStep.id === 'gunun_saati') {
              this.formData.timeOfDay = val;
            }
          }

          // Seçim durumunu DOM'da anında ve yerinde güncelle (sayfa/soru titremeden, kaybolup gelmeden)
          optionBtns.forEach(b => {
            b.classList.remove('is-selected');
            b.setAttribute('aria-pressed', 'false');
          });
          btn.classList.add('is-selected');
          btn.setAttribute('aria-pressed', 'true');

          this.clearNotice();
        });
      });
    }

    // 4. Ölçek butonları (1-5 puan)
    const scaleBtns = this.container.querySelectorAll('.scale-btn');
    if (scaleBtns.length > 0) {
      scaleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const val = parseInt(btn.getAttribute('data-scale-value'), 10);
          this.formData.readiness = val;

          scaleBtns.forEach(b => {
            b.classList.remove('is-selected');
            b.setAttribute('aria-pressed', 'false');
          });
          btn.classList.add('is-selected');
          btn.setAttribute('aria-pressed', 'true');

          this.clearNotice();
        });
      });
    }
  }

  keepCardInComfortableView() {
    const card = this.container.querySelector('.onboarding-card');
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const headerSafeZone = 80; // yapışkan başlığın altı için güvenli alan

    // Sayfa yukarı zıplamaz: Sadece kartın üstü başlığın arkasında kalmışsa veya çok aşağı kaymışsa nazikçe hizala
    if (rect.top < headerSafeZone || rect.top > 180) {
      const targetY = window.pageYOffset + rect.top - headerSafeZone;
      window.scrollTo({ top: Math.max(0, targetY), behavior: 'smooth' });
    }
    // Kart zaten rahatça okunabilir durumdaysa sayfayı hiç kaydırma
  }

  handlePrev() {
    this.clearNotice();
    if (this.stepIndex === 0) {
      window.location.hash = '#landing';
    } else {
      this.stepIndex--;
      this.render();
      this.keepCardInComfortableView();
    }
  }

  handleNext() {
    this.clearNotice();
    const currentStep = this.steps[this.stepIndex];

    // Doğrulama kontrolleri
    if (currentStep.type === 'domain' && !this.formData.selectedAreaId) {
      this.showNotice("Lütfen devam etmek için bir gelişim alanı seç.");
      return;
    }

    if (currentStep.type === 'area_question') {
      const answered = this.formData.areaAnswers[currentStep.questionData.id];
      if (!answered) {
        this.showNotice("Devam etmek için seçeneklerden birini işaretleyebilirsin.");
        return;
      }
    }

    if (this.stepIndex < this.steps.length - 1) {
      this.stepIndex++;
      this.render();
      this.keepCardInComfortableView();
    } else {
      // Son adım tamamlandı: Planı kaydet ve 2 saniyelik yükleme animasyonunu başlat
      this.completeAndSavePlan();
    }
  }

  completeAndSavePlan() {
    // storage.js üzerinden kalıcı kaydetme
    storage.updateState(currentState => ({
      ...currentState,
      profile: {
        ...currentState.profile,
        name: this.formData.name.trim(),
        selectedAreaId: this.formData.selectedAreaId,
        dailyTimePreference: this.formData.dailyTime,
        timeOfDayPreference: this.formData.timeOfDay,
        readinessScore: this.formData.readiness,
        answers: this.formData.areaAnswers,
        onboardingCompleted: true,
        startedAt: new Date().toISOString(),
      },
      journey: {
        ...currentState.journey,
        currentDay: 1,
        stage: 'tohum',
        adaptiveDifficultyModifier: this.formData.readiness <= 2 ? -1 : 0
      }
    }));

    // 2 saniyelik sakin yükleme animasyonu (PROJE.md Adım 5)
    this.isGeneratingPlan = true;
    this.render();

    setTimeout(() => {
      this.isGeneratingPlan = false;
      this.isPlanReady = true;
      this.render();
      if (this.onComplete) this.onComplete();
    }, 2000);
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

