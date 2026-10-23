/**
 * Today.js
 * 4.3 Ana Ekran (Bugünün Görevi) Bileşeni
 */

import tasksData from '../data/tasks.json';
import questionsData from '../data/questions.json';
import { storage } from '../utils/storage.js';
import { LeafIcon, CheckIcon, ClockIcon, PenIcon, DifficultyLeaves, ArrowRightIcon } from './Icons.js';

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
    const progressPercent = Math.round((this.currentDay / 30) * 100);
    const inactivity = storage.checkInactivity();
    const isActionTakenToday = storage.isTodayActionCompleted();
    const todayStatus = this.state.journey.dayStatusMap[this.currentDay];

    this.container.innerHTML = `
      <main class="today-page fade-in" id="main-content">
        <div class="container-narrow">
          
          <!-- Üst Karşılama ve İlerleme Göstergesi -->
          <div class="today-header-block">
            <h1 class="today-greeting">${greeting}</h1>
            
            <div class="today-meta-row">
              <span class="day-badge">Gün ${this.currentDay} / 30</span>
              <span class="badge ${stageInfo.isLightDay ? 'badge-earth' : ''}">
                ${stageInfo.title} Aşaması ${stageInfo.isLightDay ? '• Hafif Gün' : ''}
              </span>
            </div>

            <div class="today-progress-wrapper" aria-label="30 Günlük Yolculuk İlerlemesi">
              <div class="today-progress-bar" role="progressbar" aria-valuenow="${progressPercent}" aria-valuemin="0" aria-valuemax="100">
                <div class="today-progress-fill" style="width: ${progressPercent}%;"></div>
              </div>
            </div>
          </div>

          <!-- 3+ Gün Ara Karşılama Mesajı (PROJE.md Bölüm 6) -->
          ${inactivity.hasInactivity && !isActionTakenToday ? `
            <div class="inactivity-welcome-box" role="status">
              <div class="inactivity-icon" aria-hidden="true">
                ${LeafIcon({ size: 24 })}
              </div>
              <div>
                <strong>Hoş geldin, kaldığın yerden devam edelim.</strong>
                <p style="margin-top: 0.25rem;">
                  Araya birkaç gün girmiş olması hiç sorun değil. Adımlar takvime değil senin ritmine göre ilerliyor.
                  ${this.currentDay > 1 ? `İstersen bir önceki görevi tekrar edebilirsin.` : ''}
                </p>
              </div>
            </div>
          ` : ''}

          <!-- Ana İçerik: Ya Görev Kartı ya da Tamamlandı/Erteleme Ekranı -->
          ${isActionTakenToday ? this.renderActionTakenView(todayStatus, task) : this.renderTaskCardView(task, stageInfo)}

          <!-- Geliştirici & Test İçin Ertesi Güne Geçiş Simülasyonu -->
          <div class="sim-controls-bar">
            <button type="button" class="btn btn-ghost" id="btn-advance-day" style="font-size: 0.875rem; opacity: 0.8;">
              <span>Ertesi güne geç (Simülasyon)</span>
              ${ArrowRightIcon({ size: 14 })}
            </button>
          </div>

        </div>
      </main>
    `;

    this.attachEvents(task);
  }

  /**
   * Bugünün görev kartını render eder
   */
  renderTaskCardView(task, stageInfo) {
    if (!task) {
      const area = questionsData.alanlar.find(a => a.id === this.state.profile.selectedAreaId);
      const areaTitle = area ? area.baslik : 'gelişim';
      return `
        <div class="task-card" style="text-align: center;">
          <h2>Tüm yolculuk tamamlandı!</h2>
          <p style="margin: 1rem 0;">30 günlük ${areaTitle} yolculuğunu başarıyla bitirdin.</p>
        </div>
      `;
    }

    const modifier = this.state.journey.adaptiveDifficultyModifier || 0;
    const effectiveDifficulty = Math.max(1, Math.min(5, task.zorluk + modifier));
    const userMaxMinutes = this.state.profile.dailyTimePreference || 10;
    const isExceedingTime = task.sure_dk > userMaxMinutes;

    const stageImages = {
      tohum: { img: '/assets/step-seed.jpg', alt: 'Tohum aşaması' },
      filiz: { img: '/assets/step-habit.jpg', alt: 'Filiz aşaması' },
      govde: { img: '/assets/step-growth.jpg', alt: 'Gövde aşaması' },
      yaprak: { img: '/assets/step-growth.jpg', alt: 'Yaprak aşaması' }
    };
    const currentMedia = stageImages[stageInfo.stage] || stageImages.tohum;

    return `
      <article class="task-card">
        <!-- Kart Üst Çubuğu ve Aşama Görseli -->
        <div class="task-card-top-bar">
          <div class="task-card-header-media">
            <img src="${currentMedia.img}" alt="${currentMedia.alt}" class="task-stage-thumb-img" />
            <div class="task-stage-badge-group">
              <span class="badge">${stageInfo.title} Aşaması</span>
              ${stageInfo.isLightDay ? `<span class="badge badge-earth">Hafif Gün • Dinlenme & Yansıma</span>` : ''}
              ${modifier > 0 ? `<span class="badge" title="Zorluk seviyenize göre hafifçe yukarı ayarlandı">+1 Zorluk</span>` : ''}
              ${modifier < 0 ? `<span class="badge" title="Destekleyici olarak daha hafif seviyede">-1 Zorluk</span>` : ''}
            </div>
          </div>

          <div class="task-meta-right">
            <span class="task-time-pill" title="Tahmini Süre">
              ${ClockIcon({ size: 14 })}
              <span>~${task.sure_dk} dk</span>
            </span>
            ${DifficultyLeaves({ level: effectiveDifficulty })}
          </div>
        </div>

        <!-- Başlık ve Neden -->
        <h2 class="task-title">${task.baslik}</h2>

        <div class="task-why-box">
          <span class="task-why-label">Neden bu görev?</span>
          <span>${task.neden}</span>
        </div>

        <!-- Süre Sınırı Uyarısı -->
        ${isExceedingTime ? `
          <div class="calm-notice" style="margin-bottom: 1.5rem;">
            ${LeafIcon({ size: 18 })}
            <span>Bu görev tercih ettiğin günlük süreden (~${userMaxMinutes} dk) biraz uzun sürebilir. Dilersen aşağıdaki alternatif versiyonu yapabilirsin.</span>
          </div>
        ` : ''}

        <!-- Adımlar -->
        <div class="task-steps-section">
          <h3 class="task-steps-heading">Nasıl yapılır?</h3>
          <ol class="task-steps-list">
            ${task.adimlar.map((adim, i) => `
              <li class="task-step-item">
                <span class="task-step-num" aria-hidden="true">${i + 1}</span>
                <span>${adim}</span>
              </li>
            `).join('')}
          </ol>
        </div>

        <!-- Kolay Alternatif Versiyon -->
        ${task.alternatif ? `
          <div class="task-alternative-box">
            <div class="task-alternative-title">
              ${LeafIcon({ size: 15 })}
              <span>Alternatif (Daha Hafif Seçenek)</span>
            </div>
            <p>${task.alternatif}</p>
          </div>
        ` : ''}

        <!-- Aksiyon Butonları -->
        <div class="task-actions">
          <button type="button" class="btn btn-secondary" id="btn-postpone-task">
            <span>Bugün olmadı</span>
          </button>

          <button type="button" class="btn btn-primary" id="btn-complete-task">
            ${CheckIcon()}
            <span>Tamamladım</span>
          </button>
        </div>
      </article>
    `;
  }

  /**
   * Bugün işlem yapılmışsa (tamamlandı ya da ertelendi) gösterilecek sakin onay ekranı
   */
  renderActionTakenView(todayStatus, task) {
    const isCompleted = todayStatus?.status === 'completed';
    const currentFeedback = todayStatus?.feedback;
    const existingNote = todayStatus?.note || '';

    return `
      <article class="task-card completed-state-card fade-in">
        <div class="completed-banner-frame">
          <img 
            src="/assets/wellness-banner.jpg" 
            alt="Dingin meditasyon ve doğa manzarası" 
            class="completed-banner-img" 
          />
        </div>

        <div class="completed-content-inner">
          <div class="completed-leaf-icon-box" aria-hidden="true">
            ${LeafIcon({ size: 36 })}
          </div>

          <h2 class="completed-title">
            ${isCompleted ? 'Bugünlük bu kadar.' : 'Sorun değil. Yarın, kaldığın yerden.'}
          </h2>
          
          <p class="completed-subtitle">
            ${isCompleted 
              ? 'Küçük ama gerçek bir adım attın. Fazlasına gerek yok; zihnini dinlendir.' 
              : 'Planın bozulmadı, ceza yok. Kendine nazik ol ve yarın aynı adımla devam et.'}
          </p>

          <!-- Geri Bildirim Sorusu (PROJE.md 4.3 & Bölüm 6) -->
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
                <p class="feedback-saved-msg" style="font-size: var(--text-xs); color: var(--accent); margin-top: 0.75rem;">
                  Geri bildirimin kaydedildi, yarınki ritmine yansıtılacak.
                </p>
              ` : ''}
            </div>
          ` : ''}

          <!-- Yansıma Notu (PROJE.md 4.3) -->
          <div class="reflection-box">
            <label for="reflection-input" class="reflection-label">
              <span>${PenIcon({ size: 16 })} Bugün ne fark ettin? (Yansıma Notu)</span>
              <span class="char-counter" id="char-counter">0 / 280</span>
            </label>
            <textarea 
              id="reflection-input" 
              class="reflection-textarea" 
              placeholder="Kısa bir his ya da farkındalık... (isteğe bağlı)" 
              maxlength="280"
            >${existingNote}</textarea>
            
            <div class="reflection-footer">
              <span style="font-size: var(--text-xs); color: var(--text-subtle);">Notların İlerleme sayfasında saklanır.</span>
              <button type="button" class="btn btn-secondary btn-sm" id="btn-save-reflection" style="padding: 0.4rem 1rem; font-size: 0.9rem;">
                Kaydet
              </button>
            </div>
          </div>
        </div>
      </article>
    `;
  }

  /**
   * Bugünün görevini tasks.json içinden bulur
   */
  getTodayTask() {
    const list = tasksData.gorevler || [];
    const area = this.state.profile.selectedAreaId || 'finans';
    return list.find(g => g.alan === area && g.gun === this.currentDay) || list.find(g => g.alan === 'finans' && g.gun === this.currentDay) || list[0];
  }

  /**
   * Olay dinleyicilerini bağlar
   */
  attachEvents(task) {
    // "Tamamladım" butonu
    const completeBtn = this.container.querySelector('#btn-complete-task');
    if (completeBtn) {
      completeBtn.addEventListener('click', () => {
        storage.completeTask();
        this.render();
      });
    }

    // "Bugün olmadı" butonu
    const postponeBtn = this.container.querySelector('#btn-postpone-task');
    if (postponeBtn) {
      postponeBtn.addEventListener('click', () => {
        storage.postponeTask();
        this.render();
      });
    }

    // Geri bildirim butonları (sayfa titremesini önlemek için yerinde güncelleme)
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
            savedMsg.style.cssText = 'font-size: var(--text-xs); color: var(--accent); margin-top: 0.75rem;';
            feedbackBox.appendChild(savedMsg);
          }
          savedMsg.textContent = 'Geri bildirimin kaydedildi, yarınki ritmine yansıtılacak.';
        }
      });
    });

    // Yansıma notu karakter sayacı ve kaydetme
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
        saveNoteBtn.textContent = 'Kaydedildi ✓';
        setTimeout(() => {
          if (saveNoteBtn) saveNoteBtn.textContent = 'Kaydet';
        }, 1500);
      });
    }

    // Simülasyon: Ertesi Güne Geç
    const advanceBtn = this.container.querySelector('#btn-advance-day');
    if (advanceBtn) {
      advanceBtn.addEventListener('click', () => {
        storage.advanceToNextDay();
        this.render();
      });
    }
  }
}
