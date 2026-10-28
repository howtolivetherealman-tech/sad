// High-craft bespoke SVG Data URI illustrations for Sacred Yantras, Puja Samagri, and Ayurvedic Herbs

function toSvgDataUri(svgString: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString.trim())}`;
}

export const SVG_ASSETS = {
  brandLogo: toSvgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
      <defs>
        <radialGradient id="logoBg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#991B1B"/>
          <stop offset="100%" stop-color="#450A0A"/>
        </radialGradient>
        <linearGradient id="logoGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FEF08A"/>
          <stop offset="50%" stop-color="#F59E0B"/>
          <stop offset="100%" stop-color="#B45309"/>
        </linearGradient>
      </defs>
      <circle cx="60" cy="60" r="56" fill="url(#logoBg)" stroke="url(#logoGold)" stroke-width="4"/>
      <circle cx="60" cy="60" r="46" fill="none" stroke="url(#logoGold)" stroke-width="1.5" stroke-dasharray="4 3"/>
      <polygon points="60,20 94,78 26,78" fill="none" stroke="url(#logoGold)" stroke-width="3"/>
      <polygon points="60,100 94,42 26,42" fill="none" stroke="url(#logoGold)" stroke-width="3"/>
      <circle cx="60" cy="60" r="10" fill="url(#logoGold)"/>
    </svg>
  `),
  sriYantra: toSvgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
      <defs>
        <radialGradient id="bgSri" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stop-color="#3B1D0F"/>
          <stop offset="60%" stop-color="#1E0E07"/>
          <stop offset="100%" stop-color="#110704"/>
        </radialGradient>
        <linearGradient id="copperGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FDE68A"/>
          <stop offset="50%" stop-color="#D97706"/>
          <stop offset="100%" stop-color="#92400E"/>
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(#bgSri)"/>
      <rect x="40" y="40" width="720" height="520" fill="none" stroke="url(#copperGold)" stroke-width="2" opacity="0.4"/>
      <g transform="translate(400, 300)">
        <!-- Bhupura Outer Square -->
        <rect x="-210" y="-210" width="420" height="420" fill="none" stroke="url(#copperGold)" stroke-width="3"/>
        <rect x="-195" y="-195" width="390" height="390" fill="none" stroke="url(#copperGold)" stroke-width="1.5"/>
        <!-- Concentric Lotus Rings -->
        <circle r="175" fill="none" stroke="url(#copperGold)" stroke-width="2.5"/>
        <circle r="145" fill="none" stroke="url(#copperGold)" stroke-width="2"/>
        <circle r="118" fill="none" stroke="url(#copperGold)" stroke-width="1.5"/>
        <!-- Interlocking Sacred Triangles -->
        <polygon points="0,-112 -98,65 98,65" fill="none" stroke="url(#copperGold)" stroke-width="2.5"/>
        <polygon points="0,112 -98,-65 98,-65" fill="none" stroke="url(#copperGold)" stroke-width="2.5"/>
        <polygon points="0,-84 -74,48 74,48" fill="none" stroke="url(#copperGold)" stroke-width="2"/>
        <polygon points="0,84 -74,-48 74,-48" fill="none" stroke="url(#copperGold)" stroke-width="2"/>
        <polygon points="0,-54 -48,32 48,32" fill="none" stroke="url(#copperGold)" stroke-width="1.8"/>
        <polygon points="0,54 -48,-32 48,-32" fill="none" stroke="url(#copperGold)" stroke-width="1.8"/>
        <!-- Central Bindu -->
        <circle r="7" fill="#FDE68A"/>
        <circle r="14" fill="none" stroke="#FDE68A" stroke-width="1.2"/>
      </g>
      <text x="400" y="542" text-anchor="middle" fill="#FDE68A" font-family="serif" font-size="18" letter-spacing="4" opacity="0.85">SRI MAHA MERU YANTRA</text>
    </svg>
  `),

  vashikaranYantra: toSvgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
      <defs>
        <radialGradient id="bgVashi" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stop-color="#451A1C"/>
          <stop offset="65%" stop-color="#230B0D"/>
          <stop offset="100%" stop-color="#120506"/>
        </radialGradient>
        <linearGradient id="brass" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FEF08A"/>
          <stop offset="50%" stop-color="#EAB308"/>
          <stop offset="100%" stop-color="#A16207"/>
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(#bgVashi)"/>
      <g transform="translate(400, 290)">
        <rect x="-190" y="-190" width="380" height="380" rx="8" fill="#2A0F12" stroke="url(#brass)" stroke-width="4"/>
        <rect x="-174" y="-174" width="348" height="348" fill="none" stroke="url(#brass)" stroke-width="1.5"/>
        <circle r="145" fill="none" stroke="url(#brass)" stroke-width="2"/>
        <!-- 8-petal lotus geometry -->
        <polygon points="0,-135 95,-95 135,0 95,95 0,135 -95,95 -135,0 -95,-95" fill="none" stroke="url(#brass)" stroke-width="1.8"/>
        <polygon points="0,-95 82,47 -82,47" fill="none" stroke="url(#brass)" stroke-width="2.5"/>
        <polygon points="0,95 82,-47 -82,-47" fill="none" stroke="url(#brass)" stroke-width="2.5"/>
        <circle r="34" fill="#451A1C" stroke="url(#brass)" stroke-width="2"/>
        <circle r="8" fill="#FEF08A"/>
      </g>
      <text x="400" y="540" text-anchor="middle" fill="#FEF08A" font-family="serif" font-size="18" letter-spacing="4" opacity="0.85">SARVAJANA AKARSHANA VASHIKARAN YANTRA</text>
    </svg>
  `),

  kuberaLakshmiYantra: toSvgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
      <defs>
        <radialGradient id="bgKubera" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stop-color="#3E270B"/>
          <stop offset="70%" stop-color="#1C1104"/>
          <stop offset="100%" stop-color="#0E0802"/>
        </radialGradient>
        <linearGradient id="goldLeaf" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FDE047"/>
          <stop offset="50%" stop-color="#CA8A04"/>
          <stop offset="100%" stop-color="#854D0E"/>
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(#bgKubera)"/>
      <g transform="translate(400, 285)">
        <rect x="-180" y="-180" width="360" height="360" fill="#271705" stroke="url(#goldLeaf)" stroke-width="4"/>
        <!-- 3x3 Kubera Magic Square Grid -->
        <line x1="-60" y1="-180" x2="-60" y2="180" stroke="url(#goldLeaf)" stroke-width="2.5"/>
        <line x1="60" y1="-180" x2="60" y2="180" stroke="url(#goldLeaf)" stroke-width="2.5"/>
        <line x1="-180" y1="-60" x2="180" y2="-60" stroke="url(#goldLeaf)" stroke-width="2.5"/>
        <line x1="-180" y1="60" x2="180" y2="60" stroke="url(#goldLeaf)" stroke-width="2.5"/>
        <!-- Sacred Kubera Numbers (20 to 28, sum 72) -->
        <g fill="#FDE047" font-family="serif" font-size="38" font-weight="bold" text-anchor="middle" dominant-baseline="central">
          <text x="-120" y="-120">27</text>
          <text x="0" y="-120">20</text>
          <text x="120" y="-120">25</text>
          <text x="-120" y="0">22</text>
          <text x="0" y="0">24</text>
          <text x="120" y="0">26</text>
          <text x="-120" y="120">23</text>
          <text x="0" y="120">28</text>
          <text x="120" y="120">21</text>
        </g>
      </g>
      <text x="400" y="540" text-anchor="middle" fill="#FDE047" font-family="serif" font-size="18" letter-spacing="4" opacity="0.85">SRI ASHTA LAKSHMI KUBERA YANTRA</text>
    </svg>
  `),

  bagalamukhiYantra: toSvgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
      <defs>
        <radialGradient id="bgBagala" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stop-color="#3F2E05"/>
          <stop offset="70%" stop-color="#1F1602"/>
          <stop offset="100%" stop-color="#110C01"/>
        </radialGradient>
        <linearGradient id="turmericGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FEF08A"/>
          <stop offset="50%" stop-color="#EAB308"/>
          <stop offset="100%" stop-color="#A16207"/>
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(#bgBagala)"/>
      <g transform="translate(400, 290)">
        <rect x="-195" y="-195" width="390" height="390" fill="none" stroke="url(#turmericGold)" stroke-width="3.5"/>
        <circle r="165" fill="none" stroke="url(#turmericGold)" stroke-width="2"/>
        <circle r="125" fill="none" stroke="url(#turmericGold)" stroke-width="2"/>
        <polygon points="0,-120 -104,60 104,60" fill="none" stroke="url(#turmericGold)" stroke-width="3"/>
        <polygon points="0,120 -104,-60 104,-60" fill="none" stroke="url(#turmericGold)" stroke-width="3"/>
        <polygon points="0,-65 -56,32 56,32" fill="none" stroke="url(#turmericGold)" stroke-width="2"/>
        <circle r="9" fill="#FEF08A"/>
      </g>
      <text x="400" y="540" text-anchor="middle" fill="#FEF08A" font-family="serif" font-size="18" letter-spacing="4" opacity="0.85">SRI BAGALAMUKHI SHATRU STAMBHANA YANTRA</text>
    </svg>
  `),

  pujaSamagriKit: toSvgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
      <defs>
        <radialGradient id="bgPuja" cx="50%" cy="50%" r="75%">
          <stop offset="0%" stop-color="#3A1D12"/>
          <stop offset="70%" stop-color="#1E0E08"/>
          <stop offset="100%" stop-color="#110704"/>
        </radialGradient>
        <linearGradient id="kalashGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FDE68A"/>
          <stop offset="50%" stop-color="#D97706"/>
          <stop offset="100%" stop-color="#78350F"/>
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(#bgPuja)"/>
      <g transform="translate(400, 310)">
        <!-- Brass Plate -->
        <ellipse cx="0" cy="120" rx="220" ry="38" fill="#451A03" stroke="url(#kalashGold)" stroke-width="3"/>
        <!-- Sacred Kalash Vessel -->
        <path d="M-75,100 C-95,30 -85,-20 -45,-50 L45,-50 C85,-20 95,30 75,100 Z" fill="url(#kalashGold)"/>
        <rect x="-52" y="-68" width="104" height="18" rx="6" fill="#FDE68A"/>
        <!-- Coconut & Mango Leaves -->
        <path d="M-40,-68 C-90,-110 -110,-70 -55,-50 Z" fill="#15803D"/>
        <path d="M40,-68 C90,-110 110,-70 55,-50 Z" fill="#15803D"/>
        <ellipse cx="0" cy="-105" rx="42" ry="50" fill="#78350F" stroke="#FDE68A" stroke-width="2"/>
        <!-- Swastika Symbol on Kalash -->
        <path d="M-20,10 L20,10 M0,-10 L0,30 M0,-10 L20,-10 M20,10 L20,30 M0,30 L-20,30 M-20,10 L-20,-10" stroke="#7F1D1D" stroke-width="5" fill="none" stroke-linecap="round"/>
        <!-- Rudraksha Mala Beads -->
        <circle cx="-135" cy="110" r="14" fill="#5C2D16" stroke="#D97706" stroke-width="1.5"/>
        <circle cx="-105" cy="120" r="14" fill="#5C2D16" stroke="#D97706" stroke-width="1.5"/>
        <circle cx="135" cy="110" r="14" fill="#5C2D16" stroke="#D97706" stroke-width="1.5"/>
        <circle cx="105" cy="120" r="14" fill="#5C2D16" stroke="#D97706" stroke-width="1.5"/>
      </g>
      <text x="400" y="542" text-anchor="middle" fill="#FDE68A" font-family="serif" font-size="18" letter-spacing="4" opacity="0.85">COMPLETE TANTRIC &amp; VEDIC PUJA SAMAGRI</text>
    </svg>
  `),

  herbalVitalityKit: toSvgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
      <defs>
        <radialGradient id="bgHerb" cx="50%" cy="50%" r="75%">
          <stop offset="0%" stop-color="#1A2E1A"/>
          <stop offset="70%" stop-color="#0D190D"/>
          <stop offset="100%" stop-color="#060D06"/>
        </radialGradient>
        <linearGradient id="herbGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FDE68A"/>
          <stop offset="50%" stop-color="#D97706"/>
          <stop offset="100%" stop-color="#92400E"/>
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(#bgHerb)"/>
      <g transform="translate(400, 300)">
        <circle r="170" fill="none" stroke="url(#herbGold)" stroke-width="2" opacity="0.5"/>
        <!-- Stone Kalvam (Mortar & Pestle) -->
        <path d="M-110,20 C-110,110 110,110 110,20 L130,-10 L-130,-10 Z" fill="#292524" stroke="url(#herbGold)" stroke-width="3"/>
        <!-- Pestle -->
        <path d="M20,-15 L75,-125 C85,-140 110,-125 98,-105 L50,-10 Z" fill="#44403C" stroke="url(#herbGold)" stroke-width="2"/>
        <!-- Botanical Leaves -->
        <path d="M-80,-20 C-120,-90 -40,-130 -15,-30 Z" fill="#15803D" stroke="#86EFAC" stroke-width="1.5"/>
        <path d="M-30,-25 C-50,-110 30,-135 20,-30 Z" fill="#166534" stroke="#86EFAC" stroke-width="1.5"/>
      </g>
      <text x="400" y="542" text-anchor="middle" fill="#FDE68A" font-family="serif" font-size="18" letter-spacing="4" opacity="0.85">SADGURU NATU VAIDYAM HERBAL FORMULATIONS</text>
    </svg>
  `),
};
