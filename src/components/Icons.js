/**
 * Icons.js
 * Sade, ince çizgili ve currentColor ile renklenebilen inline SVG ikonları
 */

export const LeafIcon = ({ className = '', size = 24 } = {}) => `
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="${size}" 
    height="${size}" 
    viewBox="0 0 32 32" 
    fill="none" 
    class="${className}"
    aria-hidden="true"
  >
    <path 
      d="M7 25C7 25 6 16 13 9C19 3 26 5 26 5C26 5 27 15 19 22C13 27 7 25 7 25Z" 
      fill="currentColor" 
      opacity="0.9"
    />
    <path 
      d="M7 25C11 21 16 16 22 10" 
      stroke="var(--bg-primary, #FAF8F5)" 
      stroke-width="1.8" 
      stroke-linecap="round" 
    />
  </svg>
`;

export const SunIcon = ({ className = '', size = 20 } = {}) => `
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="${size}" 
    height="${size}" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    stroke-width="1.75" 
    stroke-linecap="round" 
    stroke-linejoin="round"
    class="${className}"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="5"></circle>
    <line x1="12" y1="1" x2="12" y2="3"></line>
    <line x1="12" y1="21" x2="12" y2="23"></line>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
    <line x1="1" y1="12" x2="3" y2="12"></line>
    <line x1="21" y1="12" x2="23" y2="12"></line>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
  </svg>
`;

export const MoonIcon = ({ className = '', size = 20 } = {}) => `
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="${size}" 
    height="${size}" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    stroke-width="1.75" 
    stroke-linecap="round" 
    stroke-linejoin="round"
    class="${className}"
    aria-hidden="true"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
  </svg>
`;

export const SystemIcon = ({ className = '', size = 20 } = {}) => `
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="${size}" 
    height="${size}" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    stroke-width="1.75" 
    stroke-linecap="round" 
    stroke-linejoin="round"
    class="${className}"
    aria-hidden="true"
  >
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
    <line x1="8" y1="21" x2="16" y2="21"></line>
    <line x1="12" y1="17" x2="12" y2="21"></line>
  </svg>
`;

export const ArrowRightIcon = ({ className = '', size = 18 } = {}) => `
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="${size}" 
    height="${size}" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    stroke-width="2" 
    stroke-linecap="round" 
    stroke-linejoin="round"
    class="${className}"
    aria-hidden="true"
  >
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
`;

export const ArrowLeftIcon = ({ className = '', size = 18 } = {}) => `
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="${size}" 
    height="${size}" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    stroke-width="2" 
    stroke-linecap="round" 
    stroke-linejoin="round"
    class="${className}"
    aria-hidden="true"
  >
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
`;

export const CheckIcon = ({ className = '', size = 18 } = {}) => `
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="${size}" 
    height="${size}" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    stroke-width="2.5" 
    stroke-linecap="round" 
    stroke-linejoin="round"
    class="${className}"
    aria-hidden="true"
  >
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
`;

export const ClockIcon = ({ className = '', size = 16 } = {}) => `
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="${size}" 
    height="${size}" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    stroke-width="2" 
    stroke-linecap="round" 
    stroke-linejoin="round"
    class="${className}"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
`;

export const PenIcon = ({ className = '', size = 16 } = {}) => `
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="${size}" 
    height="${size}" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    stroke-width="1.8" 
    stroke-linecap="round" 
    stroke-linejoin="round"
    class="${className}"
    aria-hidden="true"
  >
    <path d="M12 20h9"></path>
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
  </svg>
`;

/**
 * 5 yapraklı zorluk göstergesi (PROJE.md 4.3)
 */
export const DifficultyLeaves = ({ level = 1, max = 5 } = {}) => {
  let leavesHtml = '';
  for (let i = 1; i <= max; i++) {
    const isFilled = i <= level;
    leavesHtml += `
      <span class="difficulty-leaf ${isFilled ? 'is-active' : 'is-muted'}" title="Zorluk Seviyesi: ${level}/${max}">
        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="${isFilled ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
          <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
        </svg>
      </span>
    `;
  }
  return `<span class="difficulty-leaves-wrapper" aria-label="Zorluk seviyesi ${level} / ${max}">${leavesHtml}</span>`;
};

// 8 Alan İkonları (stroke 1.5 - PROJE.md)
export const DomainIcons = {
  wallet: ({ size = 26 } = {}) => `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/></svg>
  `,
  focus: ({ size = 26 } = {}) => `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
  `,
  lotus: ({ size = 26 } = {}) => `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21c-4-4-7-8-7-12a7 7 0 0 1 14 0c0 4-3 8-7 12z"/><path d="M12 13a4 4 0 0 0 4-4"/><path d="M12 13a4 4 0 0 1-4-4"/></svg>
  `,
  users: ({ size = 26 } = {}) => `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  `,
  feather: ({ size = 26 } = {}) => `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/><line x1="16" y1="8" x2="2" y2="22"/><line x1="17.5" y1="15" x2="9" y2="15"/></svg>
  `,
  zap: ({ size = 26 } = {}) => `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
  `,
  shield: ({ size = 26 } = {}) => `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
  `,
  moon: ({ size = 26 } = {}) => `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
  `
};

// Rozet İkonları (PROJE.md 4.4 - Toprak tonunda sade ikonlar)
export const BadgeIcons = {
  sprout: ({ size = 24 } = {}) => `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/></svg>
  `,
  flame: ({ size = 24 } = {}) => `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>
  `,
  calendar: ({ size = 24 } = {}) => `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="m9 16 2 2 4-4"/></svg>
  `,
  shield: ({ size = 24 } = {}) => `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 11 12 14 22 4"/></svg>
  `,
  mountain: ({ size = 24 } = {}) => `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="m8 3 4 8 5-5 5 15H2L8 3z"/></svg>
  `,
  award: ({ size = 24 } = {}) => `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
  `
};
