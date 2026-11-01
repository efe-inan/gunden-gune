/**
 * Header.js
 * Sakin üst gezinme çubuğu (64px yükseklik, tek renk düz SVG logo)
 */

import { BrandMark, SunIcon, MoonIcon } from './Icons.js';
import { storage } from '../utils/storage.js';

export function renderHeader() {
  const state = storage.getState();
  const isOnboardingDone = state.profile.onboardingCompleted;
  const currentHash = (window.location.hash || '#landing').split('?')[0];
  const resolvedTheme = storage.getResolvedTheme();
  const isDark = resolvedTheme === 'dark';

  return `
    <header class="site-header" role="banner">
      <div class="container">
        <div class="header-inner">
          <a href="#landing" class="brand-logo" aria-label="Günden Güne ana sayfa">
            ${BrandMark({ size: 20 })}
            <span>Günden Güne</span>
          </a>

          <div class="header-actions">
            <nav class="header-nav" aria-label="Ana gezinme">
              ${isOnboardingDone ? `
                <a href="#today" class="nav-link ${currentHash === '#today' ? 'is-active' : ''}" id="nav-today">Bugün</a>
                <a href="#progress" class="nav-link ${currentHash === '#progress' ? 'is-active' : ''}" id="nav-progress">İlerleme</a>
                <a href="#settings" class="nav-link ${currentHash === '#settings' ? 'is-active' : ''}" id="nav-settings">Ayarlar</a>
              ` : `
                <a href="#nasil-calisir" class="nav-link" id="nav-how-it-works">Nasıl çalışır?</a>
              `}
            </nav>

            ${!isOnboardingDone && currentHash !== '#onboarding' ? `
              <a href="#onboarding" class="btn btn-primary btn-sm">Başla</a>
            ` : ''}

            <button
              type="button"
              class="theme-toggle-btn"
              id="btn-theme-toggle"
              aria-label="${isDark ? 'Açık temaya geç' : 'Koyu temaya geç'}"
              title="${isDark ? 'Açık temaya geç' : 'Koyu temaya geç'}"
            >
              ${isDark ? SunIcon({ size: 16 }) : MoonIcon({ size: 16 })}
            </button>
          </div>
        </div>
      </div>
    </header>
  `;
}
