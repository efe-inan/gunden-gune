/**
 * Progress.js
 * 4.4 İlerleme Sayfası Bileşeni
 */

import { storage } from '../utils/storage.js';
import { LeafIcon, CheckIcon, BadgeIcons, PenIcon } from './Icons.js';

export class ProgressController {
  constructor(containerEl) {
    this.container = containerEl;
    this.state = storage.getState();
  }

  render() {
    this.state = storage.getState();
    const stats = storage.getProgressStats();
    const currentDay = this.state.journey.currentDay;
    const completedDays = this.state.journey.completedDays || [];
    const dayStatusMap = this.state.journey.dayStatusMap || {};

    this.container.innerHTML = `
      <main class="progress-page fade-in" id="main-content">
        <div class="container">
          
          <!-- Başlık -->
          <div class="progress-header">
            <span class="badge" style="margin-bottom: 0.65rem;">Gelişim Yolculuğu</span>
            <h1 class="progress-title">İlerlemen ve Adımların</h1>
            <p class="progress-subtitle">
              Burada yarış yok, suçluluk yok. Önemli olan kendine gösterdiğin şefkat ve attığın her küçük adım.
            </p>
          </div>

          <!-- İstatistik Kartları (Ana vurgu: Toplam Tamamlanan Gün) -->
          <div class="stats-grid">
            <!-- Vurgulu: Toplam Tamamlanan -->
            <div class="stat-card stat-card-featured">
              <span class="stat-label">Toplam Tamamlanan Gün</span>
              <div class="stat-value">${stats.totalCompleted} <span style="font-size: 1.5rem; font-weight: 400; opacity: 0.7;">/ 30</span></div>
              <p class="stat-subtext">Kalıcı değişimin en somut göstergesi.</p>
            </div>

            <!-- Mevcut Seri -->
            <div class="stat-card">
              <span class="stat-label">Mevcut Ritim</span>
              <div class="stat-value">${stats.currentStreak} <span style="font-size: 1.25rem; font-weight: 400; color: var(--text-subtle);">gün</span></div>
              <p class="stat-subtext">Kesintisiz devam eden gün sayın.</p>
            </div>

            <!-- En Uzun Seri -->
            <div class="stat-card">
              <span class="stat-label">En Uzun Akış</span>
              <div class="stat-value">${stats.maxStreak} <span style="font-size: 1.25rem; font-weight: 400; color: var(--text-subtle);">gün</span></div>
              <p class="stat-subtext">Seri bir baskı değil, yapabileceğinin kanıtıdır.</p>
            </div>
          </div>

          <!-- 4 Gelişim Aşaması Görsel Kartları -->
          <section class="stages-overview-section" aria-label="Gelişim Aşamaları">
            <div class="stages-grid">
              <div class="stage-mini-card ${currentDay <= 7 ? 'is-active-stage' : ''}">
                <img src="/assets/step-seed.jpg" alt="Tohum Aşaması" class="stage-mini-img" />
                <div class="stage-mini-content">
                  <span class="stage-mini-tag">Aşama 1 (Gün 1–7)</span>
                  <h3 class="stage-mini-title">Tohum</h3>
                  <p class="stage-mini-desc">1–3 dk • Farkındalık & ilk alışkanlık</p>
                </div>
              </div>

              <div class="stage-mini-card ${currentDay > 7 && currentDay <= 15 ? 'is-active-stage' : ''}">
                <img src="/assets/step-habit.jpg" alt="Filiz Aşaması" class="stage-mini-img" />
                <div class="stage-mini-content">
                  <span class="stage-mini-tag">Aşama 2 (Gün 8–15)</span>
                  <h3 class="stage-mini-title">Filiz</h3>
                  <p class="stage-mini-desc">5–7 dk • Günlük küçük ritimler</p>
                </div>
              </div>

              <div class="stage-mini-card ${currentDay > 15 && currentDay <= 23 ? 'is-active-stage' : ''}">
                <img src="/assets/step-growth.jpg" alt="Gövde Aşaması" class="stage-mini-img" />
                <div class="stage-mini-content">
                  <span class="stage-mini-tag">Aşama 3 (Gün 16–23)</span>
                  <h3 class="stage-mini-title">Gövde</h3>
                  <p class="stage-mini-desc">7–12 dk • Gerçek hayatta uygulama</p>
                </div>
              </div>

              <div class="stage-mini-card ${currentDay > 23 ? 'is-active-stage' : ''}">
                <img src="/assets/hero-wellness.jpg" alt="Yaprak Aşaması" class="stage-mini-img" />
                <div class="stage-mini-content">
                  <span class="stage-mini-tag">Aşama 4 (Gün 24–30)</span>
                  <h3 class="stage-mini-title">Yaprak</h3>
                  <p class="stage-mini-desc">10–15 dk • Kalıcı entegrasyon</p>
                </div>
              </div>
            </div>
          </section>

          <!-- 30 Günlük Yolculuk Haritası -->
          <section class="journey-map-section" aria-labelledby="journey-map-heading">
            <div class="journey-map-header">
              <h2 id="journey-map-heading" class="journey-map-title">30 Günlük Yolculuk Haritası</h2>
              
              <div class="journey-legend">
                <div class="legend-item">
                  <span class="legend-dot completed"></span>
                  <span>Tamamlandı</span>
                </div>
                <div class="legend-item">
                  <span class="legend-dot current"></span>
                  <span>Bugün</span>
                </div>
                <div class="legend-item">
                  <span class="legend-dot postponed"></span>
                  <span>Ertelendi</span>
                </div>
                <div class="legend-item">
                  <span class="legend-dot future"></span>
                  <span>Gelecek</span>
                </div>
              </div>
            </div>

            <div class="journey-grid" role="list" aria-label="30 Günlük Yolculuk Haritası Adımları">
              ${this.renderJourneyNodes(currentDay, completedDays, dayStatusMap)}
            </div>
          </section>

          <!-- Haftalık Özet Kartı -->
          <section class="weekly-summary-section" aria-label="Haftalık Özet">
            <div class="weekly-icon-box" aria-hidden="true">
              ${LeafIcon({ size: 26 })}
            </div>
            <div class="weekly-summary-body">
              <h3 class="weekly-summary-title">Hafta ${stats.weeklySummary.weekNum} Özeti</h3>
              <p class="weekly-summary-text">${stats.weeklySummary.message}</p>
            </div>
          </section>

          <!-- Rozetler Bölümü (Toprak rengi tonunda sade ikonlar) -->
          <section class="badges-section" aria-labelledby="badges-heading">
            <div class="section-title-row">
              <h2 id="badges-heading" class="journey-map-title">Kazanılan Rozetler</h2>
            </div>

            <div class="badges-grid">
              ${this.renderBadges(stats.badges)}
            </div>
          </section>

          <!-- Geçmiş Yansıma Notlarım Listesi -->
          <section class="notes-section" aria-labelledby="notes-heading">
            <div class="section-title-row">
              <h2 id="notes-heading" class="journey-map-title">Yansıma Notlarım</h2>
            </div>

            <div class="notes-list">
              ${this.renderNotes(stats.reflectionNotes)}
            </div>
          </section>

        </div>
      </main>
    `;
  }

  /**
   * 30 günlük harita düğümlerini render eder
   */
  renderJourneyNodes(currentDay, completedDays, dayStatusMap) {
    let nodesHtml = '';

    for (let day = 1; day <= 30; day++) {
      const isCompleted = completedDays.includes(day);
      const isCurrent = day === currentDay;
      const isPostponed = dayStatusMap[day]?.status === 'postponed';
      const isFuture = day > currentDay && !isCompleted;

      let statusClass = 'is-future';
      let titleLabel = `Gün ${day} (Gelecek)`;

      if (isCompleted) {
        statusClass = 'is-completed';
        titleLabel = `Gün ${day} (Tamamlandı)`;
      } else if (isCurrent) {
        statusClass = 'is-current';
        titleLabel = `Gün ${day} (Bugün)`;
      } else if (isPostponed) {
        statusClass = 'is-postponed';
        titleLabel = `Gün ${day} (Ertelendi)`;
      }

      // Aşama harfi (T: Tohum, F: Filiz, G: Gövde, Y: Yaprak)
      let stageChar = 'T';
      if (day > 7 && day <= 15) stageChar = 'F';
      else if (day > 15 && day <= 23) stageChar = 'G';
      else if (day > 23) stageChar = 'Y';

      nodesHtml += `
        <div 
          class="journey-day-node ${statusClass}" 
          title="${titleLabel}"
          role="listitem"
          aria-label="${titleLabel}"
        >
          <span>${isCompleted ? CheckIcon({ size: 14 }) : day}</span>
          <span class="day-stage-marker" aria-hidden="true">${stageChar}</span>
        </div>
      `;
    }

    return nodesHtml;
  }

  /**
   * Rozet kartlarını render eder
   */
  renderBadges(badges) {
    return badges.map(b => {
      const iconFn = BadgeIcons[b.icon] || BadgeIcons.sprout;

      return `
        <article class="badge-card ${b.isUnlocked ? 'is-unlocked' : 'is-locked'}">
          <div class="badge-icon-box" aria-hidden="true">
            ${iconFn({ size: 24 })}
          </div>
          <div class="badge-info-body">
            <h3 class="badge-card-title">${b.title}</h3>
            <p class="badge-card-desc">${b.desc}</p>
          </div>
          ${b.isUnlocked ? `
            <span class="badge badge-earth" style="align-self: flex-start; font-size: 11px;">Kazanıldı</span>
          ` : `
            <span class="badge" style="align-self: flex-start; font-size: 11px; background: transparent; color: var(--text-subtle); border-color: var(--border-subtle);">Kilitli</span>
          `}
        </article>
      `;
    }).join('');
  }

  /**
   * Yansıma notlarını render eder
   */
  renderNotes(notes) {
    if (!notes || notes.length === 0) {
      return `
        <div class="empty-notes-card">
          <div style="margin-bottom: 0.5rem; color: var(--yesil-700);">
            ${PenIcon({ size: 22 })}
          </div>
          <p style="font-size: 1.05rem; font-weight: 500; margin-bottom: 0.25rem;">Henüz bir yansıma notu yazmadın.</p>
          <p style="font-size: var(--text-sm);">Günün görevini tamamladıktan sonra aklına gelen küçük farkındalıkları oraya not alabilirsin.</p>
        </div>
      `;
    }

    // Notları tersten (en yeniden en eskiye) sırala
    const sortedNotes = [...notes].reverse();

    return sortedNotes.map(n => {
      const dateStr = n.date ? new Date(n.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' }) : '';

      return `
        <article class="note-card">
          <div class="note-card-header">
            <span class="note-day-badge">Gün ${n.day} Yansıması</span>
            <span>${dateStr}</span>
          </div>
          <p class="note-card-text">${this.escapeHtml(n.text)}</p>
        </article>
      `;
    }).join('');
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
