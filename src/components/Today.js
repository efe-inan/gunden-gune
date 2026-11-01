/**
 * Today.js
 * 4.3 Ana Ekran (Bugünün Görevi) Bileşeni
 */

import tasksData from '../data/tasks.json' with { type: 'json' };
import questionsData from '../data/questions.json' with { type: 'json' };
import { storage } from '../utils/storage.js';
import { resolveTodayTask } from '../utils/planEngine.js';
import { StageIcons, CheckIcon, ClockIcon, DifficultyLeaves, ArrowRightIcon } from './Icons.js';

export class TodayController {
  constructor(containerEl) {
    this.container = containerEl;
    this.state = storage.getState();
    this.currentDay = this.state.journey.currentDay || 1;
    this.forceFullSteps = false;
    this.reflectionText = '';
  }

  isSimulationEnabled() {
    const href = typeof window !== 'undefined' && window.location ? window.location.href : '';
    const devFlag =
      typeof localStorage !== 'undefined' ? localStorage.getItem('gunden_gune_dev_sim') : null;
    return href.includes('sim=1') || devFlag === '1';
  }

  getFeedbackCopy(feedback) {
    if (feedback === 'zorlandim') {
      return 'Zor olması normal. Bir adım geri gidip sonraki günleri senin için daha hafif tutacağız.';
    }
    if (feedback === 'cok_kolay') {
      return 'Geri bildirimin kaydedildi. Süre sınırını aşmadan adımları dengeli biçimde ilerleteceğiz.';
    }
    return 'Geri bildirimin kaydedildi, sonraki günlerin temposuna yansıtılacak.';
  }

  render() {
    this.state = storage.syncDailyRollover();
    this.currentDay = this.state.journey.currentDay || 1;

    const resolved = resolveTodayTask(tasksData.gorevler, this.state);
    const stageInfo = storage.getStageInfo(this.currentDay, this.state);
    const greeting = storage.getGreeting();
    const areaObj = questionsData.alanlar.find(a => a.id === this.state.profile.selectedAreaId);
    const areaTitle = areaObj ? areaObj.baslik : 'Gelişim yolculuğu';
    const progressPercent = Math.round((this.currentDay / 30) * 100);
    const progressScale = this.currentDay / 30;
    const inactivity = storage.checkInactivity();
    const isActionTakenToday = storage.isTodayActionCompleted();
    const todayStatus = this.state.journey.dayStatusMap[this.currentDay];
    const showSimBar = this.isSimulationEnabled();

    this.container.innerHTML = `
      <main class="today-page fade-in" id="main-content">
        <div class="container-narrow">

          <!-- Üst Bağlam Başlığı (Selamlama sakin meta satırında, bağlam başlıkta) -->
          <div class="today-header-block">
            <span class="today-greeting-meta">${this.escapeHtml(greeting)} · ${this.escapeHtml(areaTitle)}</span>
            <div class="today-title-row">
              <h1 class="today-context-title">
                Gün ${this.currentDay} <span class="today-day-fraction">/ 30</span>
              </h1>
              <span class="char-counter">%${progressPercent} tamamlandı</span>
            </div>

            <div class="today-progress-bar" role="progressbar" aria-label="30 günlük yolculuk ilerlemesi" aria-valuenow="${progressPercent}" aria-valuemin="0" aria-valuemax="100">
              <div class="today-progress-fill" style="transform: scaleX(${progressScale});"></div>
            </div>
          </div>

          <!-- 3+ Gün Ara Karşılama Mesajı ve Kolaylaştırma Seçenekleri (PROJE.md Bölüm 6) -->
          ${inactivity.hasInactivity && !isActionTakenToday ? `
            <div class="inactivity-welcome-box" role="status">
              <div class="inactivity-body">
                <strong>Hoş geldin, kaldığın yerden devam edelim</strong>
                <p>
                  Araya birkaç gün girmiş olması planı bozmaz. İstersen bir önceki görevi tekrar edebilir veya tempoyu biraz hafifletebilirsin.
                </p>
                <div class="inactivity-actions">
                  ${this.currentDay > 1 ? `
                    <button type="button" class="btn btn-secondary btn-sm" id="btn-repeat-prev-day">
                      <span>Bir önceki görevi tekrar et</span>
                    </button>
                  ` : ''}
                  <button type="button" class="btn btn-ghost btn-sm" id="btn-ease-plan">
                    <span>Daha hafif devam et</span>
                  </button>
                </div>
              </div>
            </div>
          ` : ''}

          <!-- Ana İçerik: Görev Kartı veya Tamamlandı/Erteleme Görünümü -->
          ${isActionTakenToday
            ? this.renderActionTakenView(todayStatus, stageInfo)
            : this.renderTaskCardView(resolved, stageInfo)}

          ${showSimBar ? `
            <div class="sim-controls-bar">
              <button type="button" class="btn btn-ghost" id="btn-advance-day">
                <span>Ertesi güne geç (simülasyon)</span>
                ${ArrowRightIcon({ size: 14 })}
              </button>
            </div>
          ` : ''}

        </div>
      </main>
    `;

    this.attachEvents();
  }

  renderTaskCardView(resolved, stageInfo) {
    const { task, isAlternativePrimary, effectiveMinutes, effectiveDifficulty } = resolved;

    if (!task) {
      const area = questionsData.alanlar.find(a => a.id === this.state.profile.selectedAreaId);
      const areaTitle = area ? area.baslik : 'gelişim';
      return `
        <div class="task-card">
          <h2>30 günlük yolculuğu tamamladın</h2>
          <p style="margin-top: 8px;">${areaTitle} alanındaki tüm günlük adımları geride bıraktın.</p>
        </div>
      `;
    }

    const modifier = this.state.journey.adaptiveDifficultyModifier || 0;
    const stageIconFn = StageIcons[stageInfo.key] || StageIcons.tohum;
    const showAlternativeAsMain = isAlternativePrimary && !this.forceFullSteps;
    const displayedMinutes = showAlternativeAsMain ? effectiveMinutes : task.sure_dk;

    return `
      <article class="task-card">
        <div class="task-card-top-bar">
          <div class="task-stage-group">
            <span class="task-stage-label">
              <span class="task-stage-icon">${stageIconFn({ size: 18 })}</span>
              <span>${stageInfo.title} aşaması</span>
            </span>
            ${stageInfo.isLightDay ? `<span class="badge badge-earth">Hafif gün</span>` : ''}
            ${modifier > 0 ? `<span class="badge" title="Geri bildirimlerine göre bir kademe artırıldı">+1 zorluk</span>` : ''}
            ${modifier < 0 ? `<span class="badge" title="Geri bildirimlerine göre yumuşatıldı">-1 zorluk</span>` : ''}
          </div>

          <div class="task-meta-right">
            <span class="task-time-meta" title="Tahmini süre">
              ${ClockIcon({ size: 14 })}
              <span>~${displayedMinutes} dk</span>
            </span>
            ${DifficultyLeaves({ level: effectiveDifficulty })}
          </div>
        </div>

        <h2 class="task-title">${task.baslik}</h2>
        <p class="task-why-text">${task.neden}</p>

        ${showAlternativeAsMain ? `
          <div class="task-primary-alternative">
            <div class="task-alternative-header">
              <span class="task-alternative-title">Bugünkü sürene uyarlanmış adım</span>
              <button type="button" class="btn btn-ghost btn-sm" id="btn-toggle-full-steps">
                <span>Tam adımları göster</span>
              </button>
            </div>
            <p class="task-primary-alternative-text">${task.alternatif}</p>
          </div>
        ` : `
          <div class="task-steps-section">
            <div class="task-steps-header-row">
              <h3 class="task-steps-heading">Adımlar</h3>
              ${isAlternativePrimary ? `
                <button type="button" class="btn btn-ghost btn-sm" id="btn-toggle-full-steps">
                  <span>Hafif seçeneğe dön</span>
                </button>
              ` : ''}
            </div>
            <ol class="task-steps-list">
              ${task.adimlar.map((adim, i) => `
                <li class="task-step-item">
                  <span class="task-step-num" aria-hidden="true">${i + 1}</span>
                  <span>${adim}</span>
                </li>
              `).join('')}
            </ol>
          </div>

          ${task.alternatif && !isAlternativePrimary ? `
            <div class="task-alternative-box">
              <div class="task-alternative-title">Daha hafif seçenek</div>
              <p>${task.alternatif}</p>
            </div>
          ` : ''}
        `}

        <div class="task-actions">
          <button type="button" class="btn btn-secondary" id="btn-postpone-task">
            <span>Bugün olmadı</span>
          </button>

          <button type="button" class="btn btn-primary" id="btn-complete-task">
            ${CheckIcon({ size: 16 })}
            <span>Tamamladım</span>
          </button>
        </div>
      </article>
    `;
  }

  renderActionTakenView(todayStatus, stageInfo) {
    const isCompleted = todayStatus?.status === 'completed';
    const currentFeedback = todayStatus?.feedback;
    const existingNote = todayStatus?.note || '';
    const stageIconFn = StageIcons[stageInfo.key] || StageIcons.tohum;
    const isGraduationDay = isCompleted && this.currentDay >= 30;

    return `
      <article class="task-card completed-state-card fade-in">
        <div class="completed-status-header">
          <div class="completed-mark ${isCompleted ? '' : 'is-postponed'}" aria-hidden="true">
            ${isCompleted ? stageIconFn({ size: 20 }) : ClockIcon({ size: 20 })}
          </div>

          <h2 class="completed-title">
            ${isGraduationDay
              ? '30. günü tamamladın'
              : (isCompleted ? 'Bugünlük bu kadar' : 'Yarın kaldığın yerden devam edersin')}
          </h2>

          <p class="completed-subtitle">
            ${isCompleted
              ? 'Küçük ama gerçek bir adım attın. Bugün başka bir görev açılmayacak, zihnini dinlendirebilirsin.'
              : 'Planın bozulmadı ve seri cezası yok. Yarın aynı adımla sakin bir şekilde devam edebilirsin.'}
          </p>

          ${isGraduationDay ? `
            <div style="margin-top: 16px;">
              <a href="#completed" class="btn btn-primary" id="btn-go-graduation">
                <span>30. gün özetine geç</span>
                ${ArrowRightIcon({ size: 16 })}
              </a>
            </div>
          ` : ''}
        </div>

        ${isCompleted ? `
          <div class="feedback-box">
            <p class="feedback-question-title">Bugünkü görev nasıldı?</p>
            <div class="feedback-buttons-row" role="group" aria-label="Görevin zorluk derecesi">
              <button
                type="button"
                class="feedback-pill-btn ${currentFeedback === 'cok_kolay' ? 'is-selected' : ''}"
                data-feedback="cok_kolay"
              >
                Çok kolaydı
              </button>
              <button
                type="button"
                class="feedback-pill-btn ${currentFeedback === 'tam_kivaminda' ? 'is-selected' : ''}"
                data-feedback="tam_kivaminda"
              >
                Tam kıvamında
              </button>
              <button
                type="button"
                class="feedback-pill-btn ${currentFeedback === 'zorlandim' ? 'is-selected' : ''}"
                data-feedback="zorlandim"
              >
                Zorlandım
              </button>
            </div>
            ${currentFeedback ? `
              <p class="feedback-saved-msg">
                ${this.getFeedbackCopy(currentFeedback)}
              </p>
            ` : ''}
          </div>
        ` : ''}

        <div class="reflection-box">
          <label for="reflection-input" class="reflection-label">
            <span>Yansıma notu</span>
            <span class="char-counter" id="char-counter">0 / 280</span>
          </label>
          <textarea
            id="reflection-input"
            class="reflection-textarea"
            placeholder="Bugün ne dikkatini çekti?"
            maxlength="280"
          >${this.escapeHtml(existingNote)}</textarea>

          <div class="reflection-footer">
            <span class="char-counter">Notların İlerleme sayfasında saklanır</span>
            <button type="button" class="btn btn-secondary btn-sm" id="btn-save-reflection">
              Kaydet
            </button>
          </div>
        </div>
      </article>
    `;
  }

  attachEvents() {
    const completeBtn = this.container.querySelector('#btn-complete-task');
    if (completeBtn) {
      completeBtn.addEventListener('click', () => {
        storage.completeTask();
        this.render();
      });
    }

    const postponeBtn = this.container.querySelector('#btn-postpone-task');
    if (postponeBtn) {
      postponeBtn.addEventListener('click', () => {
        storage.postponeTask();
        this.render();
      });
    }

    const toggleStepsBtn = this.container.querySelector('#btn-toggle-full-steps');
    if (toggleStepsBtn) {
      toggleStepsBtn.addEventListener('click', () => {
        this.forceFullSteps = !this.forceFullSteps;
        this.render();
      });
    }

    const repeatPrevBtn = this.container.querySelector('#btn-repeat-prev-day');
    if (repeatPrevBtn) {
      repeatPrevBtn.addEventListener('click', () => {
        this.forceFullSteps = false;
        storage.repeatPreviousDay();
        this.render();
      });
    }

    const easePlanBtn = this.container.querySelector('#btn-ease-plan');
    if (easePlanBtn) {
      easePlanBtn.addEventListener('click', () => {
        this.forceFullSteps = false;
        storage.easeDifficulty();
        this.render();
      });
    }

    const feedbackBtns = this.container.querySelectorAll('.feedback-pill-btn');
    feedbackBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const fb = btn.getAttribute('data-feedback');
        storage.completeTask({ feedback: fb });
        this.render();
      });
    });

    const reflectionInput = this.container.querySelector('#reflection-input');
    const counterEl = this.container.querySelector('#char-counter');
    const saveNoteBtn = this.container.querySelector('#btn-save-reflection');

    if (reflectionInput && counterEl) {
      counterEl.textContent = `${reflectionInput.value.length} / 280`;
      reflectionInput.addEventListener('input', () => {
        counterEl.textContent = `${reflectionInput.value.length} / 280`;
      });
    }

    if (saveNoteBtn && reflectionInput) {
      saveNoteBtn.addEventListener('click', () => {
        const text = reflectionInput.value.trim();
        storage.completeTask({ reflectionNote: text });
        saveNoteBtn.textContent = 'Kaydedildi';
        const timer = setTimeout(() => {
          if (saveNoteBtn) saveNoteBtn.textContent = 'Kaydet';
        }, 1500);
        timer.unref?.();
      });
    }

    const advanceBtn = this.container.querySelector('#btn-advance-day');
    if (advanceBtn) {
      advanceBtn.addEventListener('click', () => {
        this.forceFullSteps = false;
        storage.advanceToNextDay();
        this.render();
      });
    }
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
