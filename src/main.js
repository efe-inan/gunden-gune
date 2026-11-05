/**
 * main.js
 * "Günden Güne" Uygulama Giriş Noktası ve Yönlendirme Korumaları
 */

import { storage } from './utils/storage.js';
import { initPwaInstallListener, registerServiceWorker } from './utils/pwa.js';
import { initCloudSync } from './utils/supabase.js';
import { renderHeader } from './components/Header.js';
import { renderFooter } from './components/Footer.js';
import { renderLanding } from './components/Landing.js';
import { OnboardingController } from './components/Onboarding.js';
import { TodayController } from './components/Today.js';
import { ProgressController } from './components/Progress.js';
import { SettingsController } from './components/Settings.js';
import { CompletionController } from './components/Completion.js';
import { SunIcon, MoonIcon } from './components/Icons.js';

/**
 * Ham URL hash değerini ve kullanıcı durumunu değerlendirerek güvenli hedef rotayı çözer.
 */
export function resolveRoute(rawHash, state) {
  const cleanHash = (rawHash || '').split('?')[0];
  const isOnboarded = Boolean(state?.profile?.onboardingCompleted);
  const isAuthenticated = Boolean(state?.auth?.isAuthenticated);
  const completedDays = state?.journey?.completedDays || [];
  const isDay30Completed = completedDays.includes(30);
  const isGraduatedAfterRollover =
    (state?.journey?.currentDay || 1) >= 30 &&
    isDay30Completed &&
    !state?.journey?.todayActionTaken;

  if (!cleanHash || cleanHash === '#' || cleanHash === '#landing') {
    return '#landing';
  }

  if (cleanHash === '#nasil-calisir' || cleanHash === '#onboarding' || cleanHash === '#settings') {
    return cleanHash;
  }

  // İlerlemenin kaydedilmesi için hesap açma zorunludur: Onboarding tamamlanmamışsa
  // veya oturum açılmamışsa #today, #progress ve #completed sayfalarına izin verilmez.
  if (cleanHash === '#today' || cleanHash === '#progress' || cleanHash === '#completed') {
    if (!isOnboarded || !isAuthenticated) return '#onboarding';
  }

  if (cleanHash === '#today' && isGraduatedAfterRollover) {
    return '#completed';
  }

  if (cleanHash === '#completed' && !isDay30Completed) {
    return '#today';
  }

  if (['#today', '#progress', '#completed'].includes(cleanHash)) {
    return cleanHash;
  }

  return '#landing';
}

export class App {
  constructor() {
    this.appEl = document.getElementById('app');
    this.currentController = null;
    if (this.appEl) {
      this.init();
    }
  }

  init() {
    initPwaInstallListener(window);
    if (Boolean(import.meta.env?.PROD) && typeof navigator !== 'undefined') {
      registerServiceWorker(navigator, '/sw.js');
    }
    initCloudSync({
      storage,
      onAuthChange: (user) => {
        window.dispatchEvent(new CustomEvent('authchange', { detail: { user } }));
      },
      onCloudApplied: () => this.handleRouting(),
    });
    window.addEventListener('hashchange', () => this.handleRouting());
    this.handleRouting();
    this.bindEvents();
  }

  handleRouting() {
    if (this.currentController && typeof this.currentController.destroy === 'function') {
      this.currentController.destroy();
    }
    this.currentController = null;

    const state = storage.syncDailyRollover();
    const rawHash = window.location.hash || '';
    const cleanRaw = rawHash.split('?')[0];
    const querySuffix = rawHash.includes('?') ? `?${rawHash.split('?')[1]}` : '';
    const targetRoute = resolveRoute(rawHash, state);

    if (cleanRaw && targetRoute !== cleanRaw) {
      window.location.hash = `${targetRoute}${querySuffix}`;
      return;
    }

    if (targetRoute === '#onboarding') {
      this.appEl.innerHTML = `
        ${renderHeader()}
        <div id="router-view-container"></div>
        ${renderFooter()}
      `;
      const viewContainer = document.getElementById('router-view-container');
      this.currentController = new OnboardingController(viewContainer);
      this.currentController.render();
      window.scrollTo(0, 0);

    } else if (targetRoute === '#today') {
      this.appEl.innerHTML = `
        ${renderHeader()}
        <div id="router-view-container"></div>
        ${renderFooter()}
      `;
      const viewContainer = document.getElementById('router-view-container');
      this.currentController = new TodayController(viewContainer);
      this.currentController.render();
      window.scrollTo(0, 0);

    } else if (targetRoute === '#progress') {
      this.appEl.innerHTML = `
        ${renderHeader()}
        <div id="router-view-container"></div>
        ${renderFooter()}
      `;
      const viewContainer = document.getElementById('router-view-container');
      this.currentController = new ProgressController(viewContainer);
      this.currentController.render();
      window.scrollTo(0, 0);

    } else if (targetRoute === '#settings') {
      this.appEl.innerHTML = `
        ${renderHeader()}
        <div id="router-view-container"></div>
        ${renderFooter()}
      `;
      const viewContainer = document.getElementById('router-view-container');
      this.currentController = new SettingsController(viewContainer);
      this.currentController.render();
      window.scrollTo(0, 0);

    } else if (targetRoute === '#completed') {
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
      // Varsayılan: Landing (#landing veya #nasil-calisir)
      this.appEl.innerHTML = `
        ${renderHeader()}
        ${renderLanding()}
        ${renderFooter()}
      `;

      if (targetRoute === '#nasil-calisir') {
        setTimeout(() => {
          const el = document.getElementById('nasil-calisir');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 50);
      }
    }
  }

  bindEvents() {
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

    window.addEventListener('themechange', (e) => {
      const isDark = e.detail.resolved === 'dark';
      const btn = document.getElementById('btn-theme-toggle');
      if (btn) {
        btn.innerHTML = isDark ? SunIcon({ size: 16 }) : MoonIcon({ size: 16 });
        btn.setAttribute('aria-label', isDark ? 'Açık temaya geç' : 'Koyu temaya geç');
        btn.setAttribute('title', isDark ? 'Açık temaya geç' : 'Koyu temaya geç');
      }
    });
  }
}

if (typeof document !== 'undefined' && document.getElementById('app')) {
  new App();
}
