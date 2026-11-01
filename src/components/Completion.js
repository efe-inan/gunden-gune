/**
 * Completion.js
 * 4.6 Yolculuk Bitişi (30. Gün Sonrası) Ekranı
 */

import questionsData from '../data/questions.json';
import { storage } from '../utils/storage.js';
import { StageIcons, ArrowRightIcon } from './Icons.js';

export class CompletionController {
  constructor(containerEl) {
    this.container = containerEl;
    this.state = storage.getState();
  }

  render() {
    this.state = storage.getState();
    const stats = storage.getProgressStats();
    const rawName = this.state.profile.name ? this.state.profile.name.trim() : '';
    const name = rawName ? `, ${this.escapeHtml(rawName)}` : '';
    const currentArea = questionsData.alanlar.find(a => a.id === this.state.profile.selectedAreaId);
    const areaTitle = currentArea ? currentArea.baslik : 'Kişisel gelişim';
    const unlockedCount = stats.badges.filter(b => b.isUnlocked).length;

    this.container.innerHTML = `
      <main class="completion-page fade-in" id="main-content">
        <div class="container-narrow">

          <div class="completion-card">
            <div class="completion-mark" aria-hidden="true">
              ${StageIcons.yaprak({ size: 22 })}
            </div>

            <span class="page-meta-kicker">${areaTitle} · Tohumdan yaprağa</span>

            <h1 class="completion-title">
              30 günü tamamladın${name}
            </h1>

            <p class="completion-subtitle">
              Bu küçük adımlar artık sende bir alışkanlık. Ani sıçramalarla değil, her gün ayırdığın birkaç dakikayla kalıcı bir ritim kurdun.
            </p>

            <div class="completion-summary-row">
              <div>
                <span class="completion-stat-val">30</span>
                <span class="completion-stat-lbl">Tamamlanan gün</span>
              </div>
              <div>
                <span class="completion-stat-val">${stats.reflectionNotes.length}</span>
                <span class="completion-stat-lbl">Yansıma notu</span>
              </div>
              <div>
                <span class="completion-stat-val">${unlockedCount}</span>
                <span class="completion-stat-lbl">Kilometre taşı</span>
              </div>
            </div>

            <div class="completion-options-grid" role="group" aria-label="Sonraki adım tercihleri">
              <div class="completion-option-card" id="opt-restart-advanced" role="button" tabindex="0">
                <div>
                  <h2 class="completion-option-title">Aynı alanda ileri seviye yolculuğa başla</h2>
                  <p class="completion-option-desc">
                    ${areaTitle} alanında edindiğin temeli +1 zorluk eşiğiyle pekiştir.
                  </p>
                </div>
                <span class="completion-option-cta">
                  <span>Yeniden başla</span>
                  ${ArrowRightIcon({ size: 16 })}
                </span>
              </div>

              <div class="completion-option-card" id="opt-choose-new-area" role="button" tabindex="0">
                <div>
                  <h2 class="completion-option-title">Yeni bir alan seç</h2>
                  <p class="completion-option-desc">
                    Mevcut yolculuğunu arşivle ve odaklanmak için başka bir çalışma alanı seç.
                  </p>
                </div>
                <span class="completion-option-cta">
                  <span>Alanları gör</span>
                  ${ArrowRightIcon({ size: 16 })}
                </span>
              </div>

              <div class="completion-option-card" id="opt-take-a-break" role="button" tabindex="0">
                <div>
                  <h2 class="completion-option-title">Bir süre ara ver</h2>
                  <p class="completion-option-desc">
                    Öğrendiklerini günlük akışına bırak; notlarına dilediğin an göz atabilirsin.
                  </p>
                </div>
                <span class="completion-option-cta" style="color: var(--text-secondary);">
                  <span>İlerlememe git</span>
                  ${ArrowRightIcon({ size: 16 })}
                </span>
              </div>
            </div>

          </div>

        </div>
      </main>
    `;

    this.attachEvents();
  }

  attachEvents() {
    const optAdvanced = this.container.querySelector('#opt-restart-advanced');
    const optNewArea = this.container.querySelector('#opt-choose-new-area');
    const optBreak = this.container.querySelector('#opt-take-a-break');

    const handleAdvanced = () => {
      storage.restartJourney({ isAdvanced: true });
      window.location.hash = '#today';
    };

    const handleNewArea = () => {
      window.location.hash = '#settings';
    };

    const handleBreak = () => {
      window.location.hash = '#progress';
    };

    if (optAdvanced) {
      optAdvanced.addEventListener('click', handleAdvanced);
      optAdvanced.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleAdvanced();
        }
      });
    }

    if (optNewArea) {
      optNewArea.addEventListener('click', handleNewArea);
      optNewArea.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleNewArea();
        }
      });
    }

    if (optBreak) {
      optBreak.addEventListener('click', handleBreak);
      optBreak.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleBreak();
        }
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
