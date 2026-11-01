/**
 * Onboarding.js
 * 4.2 Onboarding (Soru Akışı) Bileşeni
 */

import questionsData from '../data/questions.json' with { type: 'json' };
import { storage } from '../utils/storage.js';
import { BrandMark, StageIcons, ArrowRightIcon, ArrowLeftIcon, CheckIcon, DomainIcons } from './Icons.js';

export class OnboardingController {
  constructor(containerEl, onComplete) {
    this.container = containerEl;
    this.onComplete = onComplete;

    const saved = storage.getState();
    this.formData = {
      name: saved.profile.name || '',
      selectedAreaId: saved.profile.selectedAreaId || 'finans',
      areaAnswers: { ...(saved.profile.answers || {}) },
      dailyTime: saved.profile.dailyTimePreference || 10,
      timeOfDay: saved.profile.timeOfDayPreference || 'sabah',
      readiness: saved.profile.readinessScore || 3,
    };

    this.stepIndex = 0;
    this.steps = this.buildSteps();
    this.isGeneratingPlan = false;
    this.isPlanReady = false;
    this.calmNoticeMessage = null;
  }

  buildSteps() {
    const steps = [
      { id: 'name', type: 'name', title: 'Sana nasıl hitap edelim?' },
      { id: 'domain', type: 'domain', title: 'Hangi alanda ilerlemek istiyorsun?' },
    ];

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
    const progressScale = (this.stepIndex + 1) / totalSteps;

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

    const existingShell = this.container.querySelector('#onboarding-main');

    if (!existingShell) {
      this.container.innerHTML = `
        <main class="onboarding-page fade-in" id="onboarding-main">
          <div class="container-narrow">
            <div class="onboarding-progress-wrapper" aria-label="İlerleme durumu">
              <div class="onboarding-progress-meta">
                <span id="onboarding-step-counter">Adım ${this.stepIndex + 1} / ${totalSteps}</span>
                <span id="onboarding-step-percent">%${progressPercent}</span>
              </div>
              <div class="onboarding-progress-bar" role="progressbar" aria-valuenow="${progressPercent}" aria-valuemin="0" aria-valuemax="100">
                <div class="onboarding-progress-fill" id="onboarding-progress-fill" style="transform: scaleX(${progressScale});"></div>
              </div>
            </div>

            <div class="onboarding-card">
              <div id="onboarding-step-body" class="onboarding-step-body">
                ${stepBodyHtml}
              </div>

              <div id="onboarding-notice-wrapper">
                ${this.calmNoticeMessage ? this.renderNoticeHtml(this.calmNoticeMessage) : ''}
              </div>

              <div class="onboarding-nav">
                <button type="button" class="btn btn-secondary" id="btn-onboarding-prev">
                  ${ArrowLeftIcon({ size: 16 })}
                  <span id="btn-onboarding-prev-text">${this.stepIndex === 0 ? 'Ana sayfa' : 'Geri'}</span>
                </button>

                <button type="button" class="btn btn-primary" id="btn-onboarding-next">
                  <span id="btn-onboarding-next-text">${this.stepIndex === totalSteps - 1 ? 'Planımı oluştur' : 'Devam'}</span>
                  ${ArrowRightIcon({ size: 16 })}
                </button>
              </div>
            </div>
          </div>
        </main>
      `;

      const prevBtn = this.container.querySelector('#btn-onboarding-prev');
      if (prevBtn) {
        prevBtn.addEventListener('click', () => this.handlePrev());
      }
      const nextBtn = this.container.querySelector('#btn-onboarding-next');
      if (nextBtn) {
        nextBtn.addEventListener('click', () => this.handleNext());
      }
    } else {
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
      if (fillEl) fillEl.style.transform = `scaleX(${progressScale})`;
      if (progressBar) progressBar.setAttribute('aria-valuenow', progressPercent);
      if (stepBodyEl) stepBodyEl.innerHTML = stepBodyHtml;
      if (noticeWrapper) {
        noticeWrapper.innerHTML = this.calmNoticeMessage ? this.renderNoticeHtml(this.calmNoticeMessage) : '';
      }
      if (prevText) prevText.textContent = this.stepIndex === 0 ? 'Ana sayfa' : 'Geri';
      if (nextText) nextText.textContent = this.stepIndex === totalSteps - 1 ? 'Planımı oluştur' : 'Devam';
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
        <span>${this.escapeHtml(msg)}</span>
      </div>
    `;
  }

  /* ---------------- Adım Şablonları ---------------- */

  renderNameStep() {
    return `
      <div class="question-header">
        <span class="question-kicker">Başlangıç</span>
        <h1 class="question-title">Sana nasıl hitap edelim?</h1>
        <p class="question-desc">
          Günlük karşılamada kullanacağımız ismi yazabilir veya boş bırakabilirsin.
        </p>
      </div>

      <div class="input-group">
        <label for="user-name-input" class="sr-only">İsminiz</label>
        <input
          type="text"
          id="user-name-input"
          class="text-input"
          placeholder="Adın veya hitap tercihin"
          value="${this.escapeHtml(this.formData.name)}"
          maxlength="40"
          autocomplete="given-name"
        />
        <span class="input-hint">İsteğe bağlıdır, daha sonra ayarlardan değiştirilebilir</span>
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
            ${iconFn({ size: 18 })}
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
              ${CheckIcon({ size: 12 })}
            </div>
          ` : ''}
        </div>
      `;
    }).join('');

    return `
      <div class="question-header">
        <span class="question-kicker">Çalışma alanı</span>
        <h2 class="question-title">Hangi alanda kendini geliştirmek istiyorsun?</h2>
        <p class="question-desc">
          Önümüzdeki 30 gün boyunca tek bir alanda, dağılmadan küçük adımlar atacağız.
        </p>
      </div>

      <div class="domains-grid" role="group" aria-label="Gelişim alanları">
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
            ${CheckIcon({ size: 12 })}
          </span>
        </button>
      `;
    }).join('');

    const areaObj = questionsData.alanlar.find(a => a.id === this.formData.selectedAreaId);
    const areaTitle = areaObj ? areaObj.baslik : 'Gelişim alanı';

    return `
      <div class="question-header">
        <span class="question-kicker">${areaTitle} · Soru ${currentNum} / ${totalNum}</span>
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
          <span class="question-kicker">Hazır olma düzeyi</span>
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

    const selectedVal = gq.id === 'gunluk_sure' ? this.formData.dailyTime : this.formData.timeOfDay;

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
            ${CheckIcon({ size: 12 })}
          </span>
        </button>
      `;
    }).join('');

    return `
      <div class="question-header">
        <span class="question-kicker">Günlük ritim</span>
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
          <div class="onboarding-card">
            <div class="plan-generating-view">
              <div class="plan-loader-row">
                ${BrandMark({ size: 22 })}
                <span style="font-size: var(--text-sm); font-weight: 500;">Planın hazırlanıyor</span>
              </div>
              <h2 class="question-title">
                Cevaplarına göre 30 günlük akışın oluşturuluyor
              </h2>
              <p class="question-desc">
                Seçtiğin süreye ve başlangıç tempona uygun ilk adımlar sıralanıyor.
              </p>
            </div>
          </div>
        </div>
      </main>
    `;
  }

  renderPlanReadyView() {
    const namePart = this.formData.name.trim() ? `, ${this.escapeHtml(this.formData.name.trim())}` : '';
    const areaObj = questionsData.alanlar.find(a => a.id === this.formData.selectedAreaId);
    const areaTitle = areaObj ? areaObj.baslik : 'Kişisel gelişim';

    this.container.innerHTML = `
      <main class="onboarding-page fade-in" id="main-content">
        <div class="container-narrow">
          <div class="onboarding-card">
            <div class="plan-ready-card">
              <span class="plan-ready-kicker">
                ${StageIcons.tohum({ size: 16 })}
                <span>${areaTitle} · Tohum aşaması</span>
              </span>

              <h1 class="plan-ready-title">
                Planın hazır${namePart}, küçük bir adımla başlıyoruz
              </h1>

              <p class="plan-ready-text">
                Günde yaklaşık ${this.formData.dailyTime} dakika ayırarak, seri kırma baskısı olmadan her gün tek bir somut adımla ilerleyeceksin.
              </p>

              <a href="#today" class="btn btn-primary btn-lg" id="btn-go-to-first-task">
                <span>İlk görevime git</span>
                ${ArrowRightIcon({ size: 16 })}
              </a>
            </div>
          </div>
        </div>
      </main>
    `;
  }

  /* ---------------- Olay Yönetimi ---------------- */

  attachStepEvents() {
    const currentStep = this.steps[this.stepIndex];

    if (currentStep.type === 'name') {
      const nameInput = this.container.querySelector('#user-name-input');
      if (nameInput) {
        nameInput.addEventListener('input', (e) => {
          this.formData.name = e.target.value;
        });
      }
      return;
    }

    if (currentStep.type === 'domain') {
      const domainCards = this.container.querySelectorAll('.domain-choice-card');
      domainCards.forEach(card => {
        const selectDomain = () => {
          const domainId = card.getAttribute('data-domain-id');
          const isActive = card.getAttribute('data-is-active') === 'true';

          if (!isActive) {
            this.showNotice('Bu alan henüz hazırlanıyor. Şimdilik diğer aktif alanlardan birini seçebilirsin.');
            return;
          }

          this.clearNotice();
          this.formData.selectedAreaId = domainId;
          this.steps = this.buildSteps();

          domainCards.forEach(c => {
            c.classList.remove('is-selected');
            c.setAttribute('aria-pressed', 'false');
            const check = c.querySelector('.domain-check-circle');
            if (check) check.remove();
          });

          card.classList.add('is-selected');
          card.setAttribute('aria-pressed', 'true');
          if (!card.querySelector('.domain-check-circle')) {
            const checkEl = document.createElement('div');
            checkEl.className = 'domain-check-circle';
            checkEl.setAttribute('aria-hidden', 'true');
            checkEl.innerHTML = CheckIcon({ size: 12 });
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
    const headerSafeZone = 80;

    if (rect.top < headerSafeZone || rect.top > 180) {
      const targetY = window.pageYOffset + rect.top - headerSafeZone;
      window.scrollTo({ top: Math.max(0, targetY), behavior: 'smooth' });
    }
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

    if (currentStep.type === 'domain' && !this.formData.selectedAreaId) {
      this.showNotice('Devam etmek için bir çalışma alanı seç.');
      return;
    }

    if (currentStep.type === 'area_question') {
      const answered = this.formData.areaAnswers[currentStep.questionData.id];
      if (!answered) {
        this.showNotice('Devam etmek için seçeneklerden birini işaretle.');
        return;
      }
    }

    if (this.stepIndex < this.steps.length - 1) {
      this.stepIndex++;
      this.render();
      this.keepCardInComfortableView();
    } else {
      this.completeAndSavePlan();
    }
  }

  completeAndSavePlan() {
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

    this.isGeneratingPlan = true;
    this.render();

    setTimeout(() => {
      this.isGeneratingPlan = false;
      this.isPlanReady = true;
      this.render();
      if (this.onComplete) this.onComplete();
    }, 1400);
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
