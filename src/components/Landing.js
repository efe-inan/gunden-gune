/**
 * Landing.js
 * Karşılama (Landing) Sayfası Bileşeni
 */

import { ArrowRightIcon, CheckIcon, ClockIcon, DifficultyLeaves, StageIcons } from './Icons.js';

export function renderLanding() {
  return `
    <main class="landing-page fade-in" id="main-content">
      <!-- Hero Bölümü: Sol metin + Sağ gerçek ürün önizlemesi -->
      <section class="hero-section" aria-labelledby="hero-heading">
        <div class="container">
          <div class="hero-grid">
            <div class="hero-content">
              <h1 id="hero-heading" class="hero-title">
                Her gün tek bir küçük adım, baskısız ve kalıcı değişim
              </h1>

              <p class="hero-subtitle">
                Finans, odaklanma, uyku veya ilişkiler arasından tek bir alan seç. Zincir kırma cezası olmadan 30 gün boyunca ritmine uyan günlük mini adımlarla ilerle.
              </p>

              <div class="hero-actions">
                <a href="#onboarding" class="btn btn-primary btn-lg" id="btn-start-onboarding">
                  <span>Yolculuğa başla</span>
                  ${ArrowRightIcon({ size: 16 })}
                </a>
                <a href="#nasil-calisir" class="hero-secondary-link">
                  Nasıl çalışır?
                </a>
              </div>

              <div class="hero-meta-bar" aria-label="Temel yaklaşımımız">
                <span>Günde 2–10 dakika</span>
                <span class="meta-dot" aria-hidden="true"></span>
                <span>Seri kırma cezası yok</span>
                <span class="meta-dot" aria-hidden="true"></span>
                <span>30 günlük 4 aşama</span>
              </div>
            </div>

            <!-- Sağ: Gerçek Ürün Önizlemesi (Moment #1) -->
            <div class="hero-preview-frame" aria-label="Günlük görev ekranı önizlemesi">
              <div class="hero-preview-card">
                <div class="preview-top-row">
                  <span class="preview-context">
                    <span class="preview-context-icon">${StageIcons.tohum({ size: 16 })}</span>
                    <span>Gün 6 / 30 · Para ve finans</span>
                  </span>
                  <span class="preview-meta-right">
                    <span style="display: inline-flex; align-items: center; gap: 4px;">
                      ${ClockIcon({ size: 14 })}
                      <span>~3 dk</span>
                    </span>
                    ${DifficultyLeaves({ level: 2 })}
                  </span>
                </div>

                <h2 class="preview-task-title">
                  Satın almadan önce 10 saniye duraklama kuralı
                </h2>
                <p class="preview-task-why">
                  Dürtü ile eylem arasına konan ufacık bir boşluk, ani harcama pişmanlığını azaltır.
                </p>

                <div class="preview-steps">
                  <div class="preview-step-row is-done">
                    <span class="preview-step-index">${CheckIcon({ size: 12 })}</span>
                    <span>Markette veya ekranda ödeme yapmadan hemen önce dur</span>
                  </div>
                  <div class="preview-step-row is-done">
                    <span class="preview-step-index">${CheckIcon({ size: 12 })}</span>
                    <span>İçinden 10'a kadar sayıp şu an ihtiyacın olup olmadığını sor</span>
                  </div>
                  <div class="preview-step-row">
                    <span class="preview-step-index">3</span>
                    <span>Cevabın evet olsa bile bu bilinçli duraklamayı fark et</span>
                  </div>
                </div>
              </div>

              <div class="preview-footer-bar">
                <div class="preview-week-strip" aria-hidden="true">
                  <span class="preview-day-cell is-done">${CheckIcon({ size: 12 })}</span>
                  <span class="preview-day-cell is-done">${CheckIcon({ size: 12 })}</span>
                  <span class="preview-day-cell is-rest">3</span>
                  <span class="preview-day-cell is-done">${CheckIcon({ size: 12 })}</span>
                  <span class="preview-day-cell is-done">${CheckIcon({ size: 12 })}</span>
                  <span class="preview-day-cell is-today">6</span>
                  <span class="preview-day-cell">7</span>
                </div>
                <span class="preview-strip-caption">Tohum aşaması · Ertelenen gün bozulmaz</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Nasıl Çalışır? Bölümü: Asimetrik Editöryal Akış -->
      <section class="how-it-works-section" id="nasil-calisir" aria-labelledby="how-it-works-heading">
        <div class="container">
          <div class="how-layout">
            <div class="how-intro">
              <span class="section-kicker">Nasıl ilerliyoruz</span>
              <h2 id="how-it-works-heading" class="section-title">Zorlamadan ilerleyen üç aşamalı ritim</h2>
              <p class="section-desc">
                Büyük hedeflerin altında ezilmek yerine, günlük akışına direnç yaratmadan karışan somut adımlarla başlıyoruz.
              </p>
            </div>

            <div class="editorial-steps-list">
              <article class="editorial-step">
                <div class="step-marker-col" aria-hidden="true">
                  <span class="step-numeral">1</span>
                  <span class="step-stage-icon">${StageIcons.tohum({ size: 18 })}</span>
                </div>
                <div>
                  <span class="step-stage-label">Başlangıç</span>
                  <h3 class="editorial-step-title">Alanını ve bugünkü ritmini seç</h3>
                  <p class="editorial-step-text">
                    Sekiz odak alanından birini seçip birkaç kısa soruyu yanıtla. Hazır olma düzeyine ve ayırabileceğin süreye göre başlangıç tempon belirlenir.
                  </p>
                </div>
              </article>

              <article class="editorial-step">
                <div class="step-marker-col" aria-hidden="true">
                  <span class="step-numeral">2</span>
                  <span class="step-stage-icon">${StageIcons.filiz({ size: 18 })}</span>
                </div>
                <div>
                  <span class="step-stage-label">Günlük adım</span>
                  <h3 class="editorial-step-title">Her gün yalnızca tek bir somut görev al</h3>
                  <p class="editorial-step-text">
                    İlk hafta 1–3 dakikalık farkındalık adımlarıyla geçer. Aynı gün ikinci bir görev açılmaz; yorulduğun günlerde tek tıkla erteleyebilirsin.
                  </p>
                </div>
              </article>

              <article class="editorial-step">
                <div class="step-marker-col" aria-hidden="true">
                  <span class="step-numeral">3</span>
                  <span class="step-stage-icon">${StageIcons.yaprak({ size: 18 })}</span>
                </div>
                <div>
                  <span class="step-stage-label">Kök salma</span>
                  <h3 class="editorial-step-title">Tohumdan yaprağa kendi hızında derinleş</h3>
                  <p class="editorial-step-text">
                    Verdiğin geri bildirimlere göre görev zorluğu yumuşar veya artar. Kaçırılan günler kırmızıyla işaretlenmez; kaldığın yerden devam edersin.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      <!-- Felsefemiz Bölümü -->
      <section class="philosophy-section" aria-label="Yaklaşımımız">
        <div class="container">
          <div class="philosophy-block">
            <span class="section-kicker">Yaklaşımımız</span>
            <blockquote class="philosophy-manifesto-quote">
              Kalıcı değişimler ani sıçramalarla değil, her gün sessizce tekrarlanan küçük ve gerçek adımlarla kök salar
            </blockquote>
            <p class="philosophy-manifesto-note">
              Yarış yok, seri kırma korkusu yok. Yalnızca bugünün küçük adımına odaklan.
            </p>
          </div>
        </div>
      </section>
    </main>
  `;
}
