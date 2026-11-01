/**
 * Footer.js
 * Sayfa altlığı
 */

import { BrandMark } from './Icons.js';

export function renderFooter() {
  return `
    <footer class="site-footer" role="contentinfo">
      <div class="container">
        <div class="footer-inner">
          <div class="footer-left">
            <div class="footer-brand">
              ${BrandMark({ size: 18 })}
              <span>Günden Güne</span>
            </div>
            <p class="footer-disclaimer">
              Bu uygulama profesyonel psikolojik, tıbbi veya finansal danışmanlık yerine geçmez. Amacımız kendi hızında küçük farkındalık adımları atmana eşlik etmektir.
            </p>
          </div>

          <p class="footer-copy">
            Günden Güne © 2026
          </p>
        </div>
      </div>
    </footer>
  `;
}
