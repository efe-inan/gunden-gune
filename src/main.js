/**
 * main.js
 * "Günden Güne" Uygulama Giriş Noktası
 */

import './styles/main.css';
import { storage } from './utils/storage.js';
import { renderHeader } from './components/Header.js';
import { renderFooter } from './components/Footer.js';
import { renderLanding } from './components/Landing.js';
import { OnboardingController } from './components/Onboarding.js';
import { TodayController } from './components/Today.js';
import { ProgressController } from './components/Progress.js';
import { SettingsController } from './components/Settings.js';
import { CompletionController } from './components/Completion.js';
import { SunIcon, MoonIcon } from './components/Icons.js';

class App {
  constructor() {
    this.appEl = document.getElementById('app');
    this.currentController = null;
    this.init();
  }

  init() {
    window.addEventListener('hashchange', () => this.handleRouting());
    this.handleRouting();
    this.bindEvents();
  }

  handleRouting() {
    const rawHash = window.location.hash || '#landing';
    const cleanHash = rawHash.split('?')[0];

    this.currentController = null;

    if (cleanHash === '#onboarding') {
      this.appEl.innerHTML = `
        ${renderHeader()}
        <div id="router-view-container"></div>
        ${renderFooter()}
      `;
      const viewContainer = document.getElementById('router-view-container');
      this.currentController = new OnboardingController(viewContainer);
      this.currentController.render();
      window.scrollTo(0, 0);

    } else if (cleanHash === '#today') {
      // 30 gün tamamlanmış mı kontrolü (PROJE.md 4.6)
      const state = storage.getState();
      if (state.journey.currentDay >= 30 && state.journey.completedDays.includes(30)) {
        window.location.hash = '#completed';
        return;
      }

      this.appEl.innerHTML = `
        ${renderHeader()}
        <div id="router-view-container"></div>
        ${renderFooter()}
      `;
      const viewContainer = document.getElementById('router-view-container');
      this.currentController = new TodayController(viewContainer);
      this.currentController.render();
      window.scrollTo(0, 0);

    } else if (cleanHash === '#progress') {
      this.appEl.innerHTML = `
        ${renderHeader()}
        <div id="router-view-container"></div>
        ${renderFooter()}
      `;
      const viewContainer = document.getElementById('router-view-container');
      this.currentController = new ProgressController(viewContainer);
      this.currentController.render();
      window.scrollTo(0, 0);

    } else if (cleanHash === '#settings') {
      this.appEl.innerHTML = `
        ${renderHeader()}
        <div id="router-view-container"></div>
        ${renderFooter()}
      `;
      const viewContainer = document.getElementById('router-view-container');
      this.currentController = new SettingsController(viewContainer);
      this.currentController.render();
      window.scrollTo(0, 0);

    } else if (cleanHash === '#completed') {
      this.appEl.innerHTML = `
        ${renderHeader()}
        <div id="router-view-container"></div>
        ${renderFooter()}
      `;
      const viewContainer = document.getElementById('router-view-container');
      this.currentController = new CompletionController(viewContainer);
      this.currentController.render();
      window.scrollTo(0, 0);

    } else {
      // Varsayılan: Landing
      this.appEl.innerHTML = `
        ${renderHeader()}
        ${renderLanding()}
        ${renderFooter()}
      `;

      if (rawHash === '#nasil-calisir') {
        setTimeout(() => {
          const el = document.getElementById('nasil-calisir');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 50);
      }
    }
  }

  bindEvents() {
    // Tema geçiş butonu (Header)
    document.addEventListener('click', (e) => {
      const themeToggle = e.target.closest('#btn-theme-toggle');
      if (themeToggle) {
        const currentResolved = storage.getResolvedTheme();
        const nextTheme = currentResolved === 'dark' ? 'light' : 'dark';
        storage.setTheme(nextTheme);
        return;
      }

      const anchor = e.target.closest('a[href="#nasil-calisir"]');
      if (anchor) {
        const landingEl = document.getElementById('nasil-calisir');
        if (landingEl) {
          e.preventDefault();
          landingEl.scrollIntoView({ behavior: 'smooth' });
          history.pushState(null, '', '#nasil-calisir');
        } else {
          window.location.hash = '#nasil-calisir';
        }
      }
    });

    // Tema değiştiğinde header ikonunu ve aria-label'ı güncelle
    window.addEventListener('themechange', (e) => {
      const isDark = e.detail.resolved === 'dark';
      const btn = document.getElementById('btn-theme-toggle');
      if (btn) {
        btn.innerHTML = isDark ? SunIcon({ size: 19 }) : MoonIcon({ size: 19 });
        btn.setAttribute('aria-label', isDark ? 'Açık temaya geç' : 'Koyu temaya geç');
        btn.setAttribute('title', isDark ? 'Açık temaya geç' : 'Koyu temaya geç');
      }
    });
  }
}

new App();
