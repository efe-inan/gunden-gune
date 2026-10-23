/**
 * Header.js
 * Üst gezinme çubuğu
 */

import { SunIcon, MoonIcon } from './Icons.js';
import { storage } from '../utils/storage.js';

export function renderHeader() {
  const state = storage.getState();
  const isOnboardingDone = state.profile.onboardingCompleted;
  const currentHash = window.location.hash || '#landing';
  const resolvedTheme = storage.getResolvedTheme();
  const isDark = resolvedTheme === 'dark';

  return `
    <header class="site-header" role="banner">
      <div class="container">
        <div class="header-inner">
          <a href="#landing" class="brand-logo" aria-label="Günden Güne Ana Sayfa">
            <img src="/assets/logo-light.png" class="app-logo app-logo-light header-logo-img" alt="Günden Güne logosu" />
            <img src="/assets/logo-dark.png" class="app-logo app-logo-dark header-logo-img" alt="Günden Güne logosu" />
            <span>Günden Güne</span>
          </a>
          
          <div class="header-actions">
            <nav aria-label="Ana gezinme" style="display: flex; gap: 0.35rem; align-items: center; flex-wrap: wrap;">
              ${isOnboardingDone ? `
                <a href="#today" class="nav-link ${currentHash === '#today' ? 'is-active' : ''}" id="nav-today">Bugün</a>
                <a href="#progress" class="nav-link ${currentHash === '#progress' ? 'is-active' : ''}" id="nav-progress">İlerleme</a>
                <a href="#settings" class="nav-link ${currentHash === '#settings' ? 'is-active' : ''}" id="nav-settings">Ayarlar</a>
              ` : ''}
              <a href="#nasil-calisir" class="nav-link" id="nav-how-it-works">Nasıl çalışır?</a>
            </nav>

            <button 
              type="button" 
              class="theme-toggle-btn" 
              id="btn-theme-toggle" 
              aria-label="${isDark ? 'Açık temaya geç' : 'Koyu temaya geç'}"
              title="${isDark ? 'Açık temaya geç' : 'Koyu temaya geç'}"
            >
              ${isDark ? SunIcon({ size: 19 }) : MoonIcon({ size: 19 })}
            </button>
          </div>
        </div>
      </div>
    </header>
  `;
}
