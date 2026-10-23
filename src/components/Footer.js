/**
 * Footer.js
 * Sayfa altlığı
 */

export function renderFooter() {
  return `
    <footer class="site-footer" role="contentinfo">
      <div class="container">
        <div class="footer-inner">
          <div class="footer-brand">
            <img src="/assets/logo-light.png" class="app-logo app-logo-light footer-logo-img" alt="Günden Güne logosu" />
            <img src="/assets/logo-dark.png" class="app-logo app-logo-dark footer-logo-img" alt="Günden Güne logosu" />
            <span>Günden Güne</span>
          </div>

          <p class="footer-disclaimer">
            Bu site profesyonel psikolojik, tıbbi veya finansal danışmanlık yerine geçmez. 
            Amacımız, kendi hızında ve baskısız bir şekilde küçük farkındalık adımları atmana eşlik etmektir.
          </p>

          <p class="footer-copy">
            Günden Güne &copy; 2026. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  `;
}
