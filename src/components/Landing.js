/**
 * Landing.js
 * Karşılama (Landing) Sayfası Bileşeni
 */

import { ArrowRightIcon } from './Icons.js';

export function renderLanding() {
  return `
    <main class="landing-page fade-in" id="main-content">
      <!-- Hero Bölümü -->
      <section class="hero-section" aria-labelledby="hero-heading">
        <div class="container">
          <div class="hero-grid">
            
            <!-- Sol: Metin ve Eylemler -->
            <div class="hero-content">
              <span class="editorial-eyebrow">KİŞİSEL GELİŞİM REHBERİ</span>

              <h1 id="hero-heading" class="hero-title">
                Küçük adımlar,<br />kalıcı bir dönüşüm.
              </h1>

              <p class="hero-subtitle">
                Bize birkaç soru cevapla; baskı, ceza ve suçluluk hissi olmadan, kendi doğal ritminde ilerlemen için sana özel günlük tek bir mini adım hazırlayalım.
              </p>

              <div class="hero-actions">
                <a href="#onboarding" class="btn btn-primary hero-start-btn" id="btn-start-onboarding">
                  <span>Yolculuğa Başla</span>
                  ${ArrowRightIcon()}
                </a>
              </div>

              <!-- Sade, Zarif Tipografik Bilgi Şeridi (Emoji veya hap badge yok) -->
              <div class="hero-meta-bar" aria-label="Temel Yaklaşımımız">
                <span class="meta-item">Günde 2–5 dakika</span>
                <span class="meta-dot" aria-hidden="true">•</span>
                <span class="meta-item">Sıfır baskı ve suçluluk</span>
                <span class="meta-dot" aria-hidden="true">•</span>
                <span class="meta-item">30 günlük kademeli yol</span>
              </div>
            </div>

            <!-- Sağ: Dingin Sanat Fotoğrafı (Rozetsiz, sade ve çerçeveli) -->
            <div class="hero-visual-wrapper">
              <div class="hero-image-card">
                <img 
                  src="/assets/hero-wellness.jpg" 
                  alt="Doğal sabah ışığı, seramik fincan ve botanik yapraklar" 
                  class="hero-artwork-img"
                  loading="eager"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      <!-- Nasıl Çalışır? Bölümü (Editöryal 3 Aşamalı Akış) -->
      <section class="how-it-works-section" id="nasil-calisir" aria-labelledby="how-it-works-heading">
        <div class="container">
          <div class="section-header">
            <span class="editorial-eyebrow">YÖNTEMİMİZ</span>
            <h2 id="how-it-works-heading" class="section-title">Yavaşlığın ve sürekliliğin gücü.</h2>
            <p class="section-desc">Büyük sıçramalar yerine, günlük hayatına direnç yaratmadan karışan mikro alışkanlıklarla ilerliyoruz.</p>
          </div>

          <div class="editorial-steps-row">
            <!-- 1. Aşama -->
            <article class="editorial-step">
              <div class="editorial-step-meta">
                <span class="step-numeral">01</span>
                <span class="step-stage-name">BAŞLANGIÇ</span>
              </div>
              <h3 class="editorial-step-title">Alanını ve ritmini belirle</h3>
              <p class="editorial-step-text">
                Finans, odaklanma, ilişkiler ya da dinginlik... Hangi alanda tıkanmış hissediyorsan, bugünkü hazır olma seviyene göre sana özel bir plan hazırlanır.
              </p>
            </article>

            <!-- 2. Aşama -->
            <article class="editorial-step">
              <div class="editorial-step-meta">
                <span class="step-numeral">02</span>
                <span class="step-stage-name">GÜNLÜK RİTİM</span>
              </div>
              <h3 class="editorial-step-title">Günde sadece tek bir mini adım</h3>
              <p class="editorial-step-text">
                İlk günlerde sadece 1–3 dakikalık, asla direnç yaratmayan adımlar. Fazlası yok; zihnini yormadan günün akışına sessizce eklenir.
              </p>
            </article>

            <!-- 3. Aşama -->
            <article class="editorial-step">
              <div class="editorial-step-meta">
                <span class="step-numeral">03</span>
                <span class="step-stage-name">KÖK SALMA</span>
              </div>
              <h3 class="editorial-step-title">Doğal ve kalıcı olgunlaşma</h3>
              <p class="editorial-step-text">
                Görevler sen ilerledikçe yavaşça derinleşir. Zincir kırma korkusu veya ceza yok; ritmine göre uyarlanan doğal ve kalıcı bir gelişim.
              </p>
            </article>
          </div>
        </div>
      </section>

      <!-- Felsefemiz Bölümü (Zarif Tipografik Manifesto) -->
      <section class="philosophy-section" aria-label="Felsefemiz">
        <div class="container">
          <div class="philosophy-manifesto-card">
            <div class="philosophy-quote-mark" aria-hidden="true">“</div>
            <blockquote class="philosophy-manifesto-quote">
              Büyük değişimler devasa sıçramalarla değil; her gün sessizce atılan en küçük adımlarla kök salar.
            </blockquote>
            <p class="philosophy-manifesto-note">
              Acele etme, yarışma. Sadece bugünün küçük adımına odaklan.
            </p>
          </div>
        </div>
      </section>
    </main>
  `;
}
