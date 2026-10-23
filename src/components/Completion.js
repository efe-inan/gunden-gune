/**
 * Completion.js
 * 4.6 Yolculuk Bitişi (30. Gün Sonrası) Ekranı
 */

import questionsData from '../data/questions.json';
import { storage } from '../utils/storage.js';
import { LeafIcon, ArrowRightIcon } from './Icons.js';

export class CompletionController {
  constructor(containerEl) {
    this.container = containerEl;
    this.state = storage.getState();
  }

  render() {
    this.state = storage.getState();
    const stats = storage.getProgressStats();
    const name = this.state.profile.name ? `, ${this.state.profile.name}` : '';
    const currentArea = questionsData.alanlar.find(a => a.id === this.state.profile.selectedAreaId);
    const areaTitle = currentArea ? currentArea.baslik : 'Kişisel gelişim';

    this.container.innerHTML = `
      <main class="completion-page fade-in" id="main-content">
        <div class="container-narrow">
          
          <div class="completion-card">
            <div class="completion-leaf-wrapper" aria-hidden="true">
              ${LeafIcon({ size: 48 })}
            </div>

            <span class="badge" style="margin-bottom: 1rem;">Tohumdan Yaprağa • 30 Gün Tamamlandı</span>

            <h1 class="completion-title">
              Tebrikler${name}.<br />
              30 günü tamamladın.
            </h1>

            <p class="completion-subtitle">
              Bu küçük adımlar artık sende bir alışkanlık. Büyük sıçramalarla değil, her gün attığın ufacık adımlarla gerçek bir dönüşüm gerçekleştirdin.
            </p>

            <!-- Kısa Yolculuk Özeti -->
            <div style="display: flex; justify-content: center; gap: 2rem; margin: 2rem 0; flex-wrap: wrap;">
              <div>
                <span style="font-family: var(--font-serif); font-size: 2rem; color: var(--yesil-700); font-weight: 600; display: block;">30</span>
                <span style="font-size: var(--text-xs); color: var(--text-muted);">Tamamlanan Gün</span>
              </div>
              <div>
                <span style="font-family: var(--font-serif); font-size: 2rem; color: var(--yesil-700); font-weight: 600; display: block;">${stats.reflectionNotes.length}</span>
                <span style="font-size: var(--text-xs); color: var(--text-muted);">Yansıma Notu</span>
              </div>
              <div>
                <span style="font-family: var(--font-serif); font-size: 2rem; color: var(--toprak); font-weight: 600; display: block;">6</span>
                <span style="font-size: var(--text-xs); color: var(--text-muted);">Kazanılan Rozet</span>
              </div>
            </div>

            <!-- Seçenekler (PROJE.md 4.6) -->
            <div class="completion-options-grid" role="group" aria-label="Sonraki Adım Tercihleri">
              
              <!-- Seçenek 1: İleri Seviye Yolculuk -->
              <div class="completion-option-card" id="opt-restart-advanced" role="button" tabindex="0">
                <div>
                  <h2 class="completion-option-title">Aynı alanda ileri seviye yolculuğa başla</h2>
                  <p class="completion-option-desc">
                    ${areaTitle} alanında edindiğin temeli daha derin uygulamalar ve +1 zorluk eşiğiyle pekiştir.
                  </p>
                </div>
                <div style="color: var(--yesil-700); display: flex; align-items: center; gap: 0.35rem; font-weight: 500; font-size: 0.95rem;">
                  <span>Yeniden Başla</span>
                  ${ArrowRightIcon({ size: 16 })}
                </div>
              </div>

              <!-- Seçenek 2: Yeni Bir Alan Seç -->
              <div class="completion-option-card" id="opt-choose-new-area" role="button" tabindex="0">
                <div>
                  <h2 class="completion-option-title">Yeni bir alan seç</h2>
                  <p class="completion-option-desc">
                    Mevcut yolculuğunu arşivle ve zihnini dinlendirmek veya odaklanmak için başka bir alan keşfet.
                  </p>
                </div>
                <div style="color: var(--yesil-700); display: flex; align-items: center; gap: 0.35rem; font-weight: 500; font-size: 0.95rem;">
                  <span>Alanları Gör</span>
                  ${ArrowRightIcon({ size: 16 })}
                </div>
              </div>

              <!-- Seçenek 3: Bir Süre Ara Ver -->
              <div class="completion-option-card" id="opt-take-a-break" role="button" tabindex="0">
                <div>
                  <h2 class="completion-option-title">Bir süre ara ver</h2>
                  <p class="completion-option-desc">
                    Öğrendiklerini hayatın doğal akışına bırak. Dilediğin an notlarını incelemek için geri dönebilirsin.
                  </p>
                </div>
                <div style="color: var(--text-muted); display: flex; align-items: center; gap: 0.35rem; font-weight: 500; font-size: 0.95rem;">
                  <span>İlerlememe Git</span>
                  ${ArrowRightIcon({ size: 16 })}
                </div>
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
}
