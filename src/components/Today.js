/**
 * Today.js
 * 4.3 Ana Ekran (Bugünün Görevi) Bileşeni
 */

import tasksData from '../data/tasks.json';
import questionsData from '../data/questions.json';
import { storage } from '../utils/storage.js';
import { StageIcons, CheckIcon, ClockIcon, DifficultyLeaves, ArrowRightIcon } from './Icons.js';

export class TodayController {
  constructor(containerEl) {
    this.container = containerEl;
    this.state = storage.getState();
    this.currentDay = this.state.journey.currentDay || 1;
    this.showAlternative = false;
    this.reflectionText = '';
  }

  render() {
    this.state = storage.getState();
    this.currentDay = this.state.journey.currentDay || 1;

    const task = this.getTodayTask();
    const stageInfo = storage.getStageInfo(this.currentDay);
    const greeting = storage.getGreeting();
    const areaObj = questionsData.alanlar.find(a => a.id === this.state.profile.selectedAreaId);
    const areaTitle = areaObj ? areaObj.baslik : 'Gelişim yolculuğu';
    const progressPercent = Math.round((this.currentDay / 30) * 100);
    const progressScale = this.currentDay / 30;
    const inactivity = storage.checkInactivity();
    const isActionTakenToday = storage.isTodayActionCompleted();
    const todayStatus = this.state.journey.dayStatusMap[this.currentDay];

    this.container.innerHTML = `
      <main class="today-page fade-in" id="main-content">
        <div class="container-narrow">

          <!-- Üst Bağlam Başlığı (Selamlama sakin meta satırında, bağlam başlıkta) -->
          <div class="today-header-block">
            <span class="today-greeting-meta">${greeting} · ${areaTitle}</span>
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

          <!-- 3+ Gün Ara Karşılama Mesajı -->
          ${inactivity.hasInactivity && !isActionTakenToday ? `
            <div class="inactivity-welcome-box" role="status">
              <div>
                <strong>Kaldığın yerden devam edebilirsin</strong>
                <p>
                  Araya birkaç gün girmiş olması planı bozmaz. Adımlar takvime değil senin ritmine göre ilerliyor.
                </p>
              </div>
            </div>
          ` : ''}

          <!-- Ana İçerik: Görev Kartı veya Tamamlandı/Erteleme Görünümü -->
          ${isActionTakenToday
            ? this.renderActionTakenView(todayStatus, stageInfo)
            : this.renderTaskCardView(task, stageInfo)}

          <!-- Geliştirici & Test İçin Ertesi Güne Geçiş Simülasyonu -->
          <div class="sim-controls-bar">
            <button type="button" class="btn btn-ghost" id="btn-advance-day">
              <span>Ertesi güne geç (simülasyon)</span>
              ${ArrowRightIcon({ size: 14 })}
            </button>
          </div>

        </div>
      </main>
    `;

    this.attachEvents(task);
  }

  renderTaskCardView(task, stageInfo) {
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
    const effectiveDifficulty = Math.max(1, Math.min(5, task.zorluk + modifier));
    const userMaxMinutes = this.state.profile.dailyTimePreference || 10;
    const isExceedingTime = task.sure_dk > userMaxMinutes;
    const stageIconFn = StageIcons[stageInfo.key] || StageIcons.tohum;

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
              <span>~${task.sure_dk} dk</span>
            </span>
            ${DifficultyLeaves({ level: effectiveDifficulty })}
          </div>
        </div>

        <h2 class="task-title">${task.baslik}</h2>
        <p class="task-why-text">${task.neden}</p>

        ${isExceedingTime ? `
          <div class="calm-notice" style="margin-top: 0; margin-bottom: 24px;">
            <span>Bu görev günlük süre tercihini (~${userMaxMinutes} dk) aşabilir. Dilersen alttaki daha hafif seçeneği uygulayabilirsin.</span>
          </div>
        ` : ''}

        <div class="task-steps-section">
          <h3 class="task-steps-heading">Adımlar</h3>
          <ol class="task-steps-list">
            ${task.adimlar.map((adim, i) => `
              <li class="task-step-item">
                <span class="task-step-num" aria-hidden="true">${i + 1}</span>
                <span>${adim}</span>
              </li>
            `).join('')}
          </ol>
        </div>

        ${task.alternatif ? `
          <div class="task-alternative-box">
            <div class="task-alternative-title">Daha hafif seçenek</div>
            <p>${task.alternatif}</p>
          </div>
        ` : ''}

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

    return `
      <article class="task-card completed-state-card fade-in">
        <div class="completed-status-header">
          <div class="completed-mark ${isCompleted ? '' : 'is-postponed'}" aria-hidden="true">
            ${isCompleted ? stageIconFn({ size: 20 }) : ClockIcon({ size: 20 })}
          </div>

          <h2 class="completed-title">
            ${isCompleted ? 'Bugünlük bu kadar' : 'Yarın kaldığın yerden devam edersin'}
          </h2>

          <p class="completed-subtitle">
            ${isCompleted
              ? 'Küçük ama gerçek bir adım attın. Bugün başka bir görev açılmayacak, zihnini dinlendirebilirsin.'
              : 'Planın bozulmadı ve seri cezası yok. Yarın aynı adımla sakin bir şekilde devam edebilirsin.'}
          </p>
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
                Geri bildirimin kaydedildi, sonraki günlerin temposuna yansıtılacak.
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

  getTodayTask() {
    const list = tasksData.gorevler || [];
    const area = this.state.profile.selectedAreaId || 'finans';
    return list.find(g => g.alan === area && g.gun === this.currentDay) || list.find(g => g.alan === 'finans' && g.gun === this.currentDay) || list[0];
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

    const feedbackBtns = this.container.querySelectorAll('.feedback-pill-btn');
    feedbackBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const fb = btn.getAttribute('data-feedback');
        storage.completeTask({ feedback: fb });
        feedbackBtns.forEach(b => b.classList.remove('is-selected'));
        btn.classList.add('is-selected');

        const feedbackBox = btn.closest('.feedback-box');
        if (feedbackBox) {
          let savedMsg = feedbackBox.querySelector('.feedback-saved-msg');
          if (!savedMsg) {
            savedMsg = document.createElement('p');
            savedMsg.className = 'feedback-saved-msg';
            feedbackBox.appendChild(savedMsg);
          }
          savedMsg.textContent = 'Geri bildirimin kaydedildi, sonraki günlerin temposuna yansıtılacak.';
        }
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
        setTimeout(() => {
          if (saveNoteBtn) saveNoteBtn.textContent = 'Kaydet';
        }, 1500);
      });
    }

    const advanceBtn = this.container.querySelector('#btn-advance-day');
    if (advanceBtn) {
      advanceBtn.addEventListener('click', () => {
        storage.advanceToNextDay();
        this.render();
      });
    }
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
