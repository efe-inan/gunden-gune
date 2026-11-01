/**
 * Progress.js
 * 4.4 İlerleme Sayfası Bileşeni
 */

import questionsData from '../data/questions.json' with { type: 'json' };
import { storage } from '../utils/storage.js';
import { StageIcons, CheckIcon, BadgeIcons } from './Icons.js';

export class ProgressController {
  constructor(containerEl) {
    this.container = containerEl;
    this.state = storage.getState();
  }

  render() {
    this.state = storage.syncDailyRollover();
    const stats = storage.getProgressStats();
    const currentDay = this.state.journey.currentDay;
    const completedDays = this.state.journey.completedDays || [];
    const dayStatusMap = this.state.journey.dayStatusMap || {};
    const bounds = stats.stageBounds || { tohumEnd: 7, filizEnd: 15, govdeEnd: 23 };
    const areaObj = questionsData.alanlar.find(a => a.id === this.state.profile.selectedAreaId);
    const areaTitle = areaObj ? areaObj.baslik : 'Gelişim yolculuğu';
    const remainingDays = Math.max(0, 30 - stats.totalCompleted);

    this.container.innerHTML = `
      <main class="progress-page fade-in" id="main-content">
        <div class="container">

          <div class="page-header">
            <span class="page-meta-kicker">${areaTitle} · Gün ${currentDay} / 30</span>
            <h1 class="page-title">İlerleme ve notlar</h1>
            <p class="page-subtitle">
              Önemli olan kesintisiz bir zincir değil, kendi hızında tamamladığın toplam gün sayısıdır.
            </p>
          </div>

          <!-- Üst İstatistikler: Yalnızca tablosal rakamlar ve net karşılaştırma -->
          <div class="stats-grid">
            <div class="stat-card stat-card-featured">
              <span class="stat-label">Tamamlanan gün</span>
              <div class="stat-value">
                ${stats.totalCompleted}<span class="stat-unit">/ 30 gün</span>
              </div>
              <p class="stat-subtext">${remainingDays > 0 ? `Yolculukta ${remainingDays} adım daha var` : '30 günlük döngü tamamlandı'}</p>
            </div>

            <div class="stat-card">
              <span class="stat-label">Mevcut ritim</span>
              <div class="stat-value">
                ${stats.currentStreak}<span class="stat-unit">ardışık gün</span>
              </div>
              <p class="stat-subtext">Son günlerdeki kesintisiz akışın</p>
            </div>

            <div class="stat-card">
              <span class="stat-label">En uzun akış</span>
              <div class="stat-value">
                ${stats.maxStreak}<span class="stat-unit">gün</span>
              </div>
              <p class="stat-subtext">Şimdiye kadarki en uzun devamlılığın</p>
            </div>
          </div>

          <!-- Ana Odak Bölümü: 2/3 Yolculuk Haritası + 1/3 Haftalık Özet & Aşamalar -->
          <div class="progress-main-split">
            <section class="journey-map-section" aria-labelledby="journey-map-heading">
              <div class="journey-map-header">
                <h2 id="journey-map-heading" class="section-block-title">30 günlük yolculuk</h2>

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

              <div class="journey-grid" role="list" aria-label="30 günlük yolculuk adımları">
                ${this.renderJourneyNodes(currentDay, completedDays, dayStatusMap, bounds)}
              </div>
            </section>

            <div class="progress-side-stack">
              <section class="weekly-summary-section" aria-label="Haftalık özet">
                <h3 class="weekly-summary-title">${stats.weeklySummary.weekNum}. hafta özeti</h3>
                <p class="weekly-summary-text">${stats.weeklySummary.message}</p>
              </section>

              <section class="stages-overview-card" aria-label="Gelişim aşamaları">
                <div class="stage-row-item ${currentDay <= bounds.tohumEnd ? 'is-active-stage' : ''}">
                  <span class="stage-row-icon">${StageIcons.tohum({ size: 16 })}</span>
                  <div class="stage-row-content">
                    <div class="stage-row-top">
                      <span class="stage-row-title">Tohum</span>
                      <span class="stage-row-days">Gün 1–${bounds.tohumEnd}</span>
                    </div>
                    <p class="stage-row-desc">1–3 dk · Farkındalık ve ilk adım</p>
                  </div>
                </div>

                <div class="stage-row-item ${currentDay > bounds.tohumEnd && currentDay <= bounds.filizEnd ? 'is-active-stage' : ''}">
                  <span class="stage-row-icon">${StageIcons.filiz({ size: 16 })}</span>
                  <div class="stage-row-content">
                    <div class="stage-row-top">
                      <span class="stage-row-title">Filiz</span>
                      <span class="stage-row-days">Gün ${bounds.tohumEnd + 1}–${bounds.filizEnd}</span>
                    </div>
                    <p class="stage-row-desc">5–7 dk · Günlük küçük tekrarlar</p>
                  </div>
                </div>

                <div class="stage-row-item ${currentDay > bounds.filizEnd && currentDay <= bounds.govdeEnd ? 'is-active-stage' : ''}">
                  <span class="stage-row-icon">${StageIcons.govde({ size: 16 })}</span>
                  <div class="stage-row-content">
                    <div class="stage-row-top">
                      <span class="stage-row-title">Gövde</span>
                      <span class="stage-row-days">Gün ${bounds.filizEnd + 1}–${bounds.govdeEnd}</span>
                    </div>
                    <p class="stage-row-desc">7–12 dk · Gerçek hayatta uygulama</p>
                  </div>
                </div>

                <div class="stage-row-item ${currentDay > bounds.govdeEnd ? 'is-active-stage' : ''}">
                  <span class="stage-row-icon">${StageIcons.yaprak({ size: 16 })}</span>
                  <div class="stage-row-content">
                    <div class="stage-row-top">
                      <span class="stage-row-title">Yaprak</span>
                      <span class="stage-row-days">Gün ${bounds.govdeEnd + 1}–30</span>
                    </div>
                    <p class="stage-row-desc">10–15 dk · Kalıcı alışkanlık</p>
                  </div>
                </div>
              </section>
            </div>
          </div>

          <!-- Alt İki Sütun: Yansıma Notları & Kilometre Taşları -->
          <div class="progress-bottom-split">
            <section class="notes-section" aria-labelledby="notes-heading">
              <div class="section-title-row">
                <h2 id="notes-heading" class="section-block-title">Yansıma notları</h2>
              </div>
              <div class="notes-list">
                ${this.renderNotes(stats.reflectionNotes)}
              </div>
            </section>

            <section class="badges-section" aria-labelledby="badges-heading">
              <div class="section-title-row">
                <h2 id="badges-heading" class="section-block-title">Kilometre taşları</h2>
              </div>
              <div class="badges-list">
                ${this.renderBadges(stats.badges)}
              </div>
            </section>
          </div>

          ${stats.archivedJourneys && stats.archivedJourneys.length > 0 ? `
            <section class="archived-journeys-section" aria-labelledby="archived-heading">
              <div class="section-title-row">
                <h2 id="archived-heading" class="section-block-title">Geçmiş yolculuklar</h2>
              </div>
              <div class="archived-journeys-list">
                ${this.renderArchivedJourneys(stats.archivedJourneys)}
              </div>
            </section>
          ` : ''}

        </div>
      </main>
    `;
  }

  renderJourneyNodes(currentDay, completedDays, dayStatusMap, bounds) {
    let nodesHtml = '';

    for (let day = 1; day <= 30; day++) {
      const isCompleted = completedDays.includes(day);
      const isCurrent = day === currentDay;
      const isPostponed = dayStatusMap[day]?.status === 'postponed';

      let statusClass = 'is-future';
      let titleLabel = `Gün ${day} (gelecek)`;

      if (isCompleted) {
        statusClass = 'is-completed';
        titleLabel = `Gün ${day} (tamamlandı)`;
      } else if (isCurrent) {
        statusClass = 'is-current';
        titleLabel = `Gün ${day} (bugün)`;
      } else if (isPostponed) {
        statusClass = 'is-postponed';
        titleLabel = `Gün ${day} (ertelendi)`;
      }

      let stageChar = 'T';
      if (day > bounds.tohumEnd && day <= bounds.filizEnd) stageChar = 'F';
      else if (day > bounds.filizEnd && day <= bounds.govdeEnd) stageChar = 'G';
      else if (day > bounds.govdeEnd) stageChar = 'Y';

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

  renderBadges(badges) {
    return badges.map(b => {
      const iconFn = BadgeIcons[b.icon] || BadgeIcons.sprout;

      return `
        <article class="badge-card ${b.isUnlocked ? 'is-unlocked' : 'is-locked'}">
          <div class="badge-icon-box" aria-hidden="true">
            ${iconFn({ size: 18 })}
          </div>
          <div class="badge-info-body">
            <h3 class="badge-card-title">${b.title}</h3>
            <p class="badge-card-desc">${b.desc}</p>
          </div>
          <span class="badge-status-meta">${b.isUnlocked ? 'Kazanıldı' : 'Kilitli'}</span>
        </article>
      `;
    }).join('');
  }

  renderNotes(notes) {
    if (!notes || notes.length === 0) {
      return `
        <div class="empty-notes-card">
          <p class="empty-notes-title">Henüz kayıtlı bir yansıma notun yok</p>
          <p class="empty-notes-desc">Günlük görevini tamamladıktan sonra birkaç cümlelik gözlemini not düşebilirsin.</p>
        </div>
      `;
    }

    const sortedNotes = [...notes].reverse();

    return sortedNotes.map(n => {
      const dateStr = n.date ? new Date(n.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' }) : '';

      return `
        <article class="note-card">
          <div class="note-card-header">
            <span class="note-day-badge">Gün ${n.day}</span>
            <span>${dateStr}</span>
          </div>
          <p class="note-card-text">${this.escapeHtml(n.text)}</p>
        </article>
      `;
    }).join('');
  }

  renderArchivedJourneys(archived) {
    return [...archived].reverse().map(item => {
      const areaObj = questionsData.alanlar.find(a => a.id === item.areaId);
      const areaTitle = areaObj ? areaObj.baslik : item.areaId;
      const rawDate = item.completedAt || item.archivedAt;
      const dateStr = rawDate
        ? new Date(rawDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
        : '';
      const count = Number(item.completedDaysCount || 0);

      return `
        <article class="archived-journey-card">
          <div>
            <h3 class="badge-card-title">${this.escapeHtml(areaTitle)}</h3>
            <p class="badge-card-desc">${count} / 30 gün tamamlandı${item.isCompleted30 ? ' · Mezuniyet' : ''}</p>
          </div>
          <span class="badge-status-meta">${dateStr}</span>
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
