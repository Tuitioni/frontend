export function HeroIllustration({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 520 500"
      role="img"
      aria-label="Online tutoring: a lesson screen surrounded by subjects, connected to verified tutors"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="hi-screen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6F63E8" />
          <stop offset="1" stopColor="#4A3FC7" />
        </linearGradient>
        <linearGradient id="hi-cap" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F9C34E" />
          <stop offset="1" stopColor="#E1900F" />
        </linearGradient>
      </defs>

      {/* Orbiting connection paths */}
      <g strokeLinecap="round">
        <path
          d="M110 250 C110 120 400 110 420 250"
          stroke="#8B80EF"
          strokeWidth="2"
          strokeDasharray="2 10"
          opacity="0.7"
        />
        <path
          d="M120 300 C160 430 380 430 410 300"
          stroke="#F5A524"
          strokeWidth="2"
          strokeDasharray="2 10"
          opacity="0.8"
        />
        <ellipse
          cx="265"
          cy="275"
          rx="205"
          ry="150"
          stroke="#6F63E8"
          strokeWidth="1.5"
          opacity="0.25"
        />
      </g>

      {/* Subject nodes */}
      {[
        { x: 96, y: 168, r: 26, fill: '#EAE8FD', label: '∑', color: '#4A3FC7' },
        { x: 265, y: 96, r: 24, fill: '#FDECC8', label: 'x²', color: '#B9760B' },
        { x: 436, y: 172, r: 26, fill: '#EAE8FD', label: 'π', color: '#4A3FC7' },
        { x: 452, y: 300, r: 22, fill: '#FDECC8', label: 'ABC', color: '#B9760B' },
        { x: 84, y: 300, r: 22, fill: '#EAE8FD', label: '{ }', color: '#4A3FC7' },
      ].map((n) => (
        <g key={n.label}>
          <circle cx={n.x} cy={n.y} r={n.r} fill={n.fill} />
          <text
            x={n.x}
            y={n.y + 5}
            textAnchor="middle"
            fontFamily="var(--font-display), sans-serif"
            fontWeight="800"
            fontSize={n.label.length > 2 ? 12 : 16}
            fill={n.color}
          >
            {n.label}
          </text>
        </g>
      ))}

      {/* Books stack */}
      <g transform="translate(150 380)">
        <rect x="0" y="18" width="70" height="12" rx="3" fill="#6F63E8" />
        <rect x="6" y="6" width="70" height="12" rx="3" fill="#8B80EF" />
        <rect x="2" y="-6" width="70" height="12" rx="3" fill="#F5A524" />
      </g>

      {/* Central laptop */}
      <g transform="translate(150 190)">
        {/* screen */}
        <rect
          x="0"
          y="0"
          width="220"
          height="140"
          rx="12"
          className="fill-card stroke-border"
          strokeWidth="2"
        />
        <rect x="12" y="12" width="196" height="104" rx="7" fill="url(#hi-screen)" />
        {/* lesson: whiteboard lines + formula */}
        <rect x="26" y="26" width="120" height="76" rx="6" fill="#ffffff" opacity="0.92" />
        <text
          x="36"
          y="52"
          fontFamily="var(--font-mono), monospace"
          fontSize="12"
          fontWeight="700"
          fill="#4A3FC7"
        >
          a² + b² = c²
        </text>
        <line
          x1="36"
          y1="66"
          x2="132"
          y2="66"
          stroke="#ABA4F6"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <line
          x1="36"
          y1="78"
          x2="118"
          y2="78"
          stroke="#CBC7FB"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <line
          x1="36"
          y1="90"
          x2="126"
          y2="90"
          stroke="#CBC7FB"
          strokeWidth="3"
          strokeLinecap="round"
        />
        {/* tutor video tile (abstract, no figure) */}
        <rect x="158" y="26" width="36" height="30" rx="5" fill="#ffffff" opacity="0.92" />
        <circle cx="176" cy="38" r="6" fill="#F5A524" />
        <rect x="166" y="46" width="20" height="6" rx="3" fill="#F9C34E" />
        {/* play control */}
        <circle cx="176" cy="82" r="12" fill="#ffffff" opacity="0.92" />
        <path d="M172 76 L183 82 L172 88 Z" fill="#4A3FC7" />
        {/* base */}
        <rect x="-14" y="140" width="248" height="12" rx="6" className="fill-border" />
      </g>

      {/* Graduation cap */}
      <g transform="translate(398 96) rotate(12)">
        <path d="M0 12 L34 0 L68 12 L34 24 Z" fill="url(#hi-cap)" />
        <path d="M14 18 L14 32 C14 40 54 40 54 32 L54 18" fill="#E1900F" />
        <line
          x1="68"
          y1="12"
          x2="68"
          y2="30"
          stroke="#B9760B"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="68" cy="32" r="3.5" fill="#F5A524" />
      </g>

      {/* Verified-tutor mini card, top-left */}
      <g transform="translate(28 74)">
        <rect
          width="150"
          height="52"
          rx="12"
          className="fill-card stroke-border"
          strokeWidth="1.5"
        />
        <circle cx="26" cy="26" r="14" fill="#6F63E8" />
        <text
          x="26"
          y="31"
          textAnchor="middle"
          fontFamily="var(--font-display),sans-serif"
          fontWeight="800"
          fontSize="12"
          fill="#ffffff"
        >
          RA
        </text>
        <rect
          x="48"
          y="14"
          width="70"
          height="8"
          rx="4"
          className="fill-muted-foreground"
          opacity="0.7"
        />
        <rect x="48" y="28" width="50" height="7" rx="3.5" className="fill-border" />
        <circle cx="132" cy="18" r="9" fill="#5A4FE4" />
        <path
          d="M128 18 l3 3 l5 -6"
          stroke="#fff"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      {/* Verified-tutor mini card, bottom-right */}
      <g transform="translate(338 372)">
        <rect
          width="150"
          height="52"
          rx="12"
          className="fill-card stroke-border"
          strokeWidth="1.5"
        />
        <circle cx="26" cy="26" r="14" fill="#F5A524" />
        <text
          x="26"
          y="31"
          textAnchor="middle"
          fontFamily="var(--font-display),sans-serif"
          fontWeight="800"
          fontSize="12"
          fill="#3A2A05"
        >
          KT
        </text>
        <rect
          x="48"
          y="14"
          width="66"
          height="8"
          rx="4"
          className="fill-muted-foreground"
          opacity="0.7"
        />
        <rect x="48" y="28" width="46" height="7" rx="3.5" className="fill-border" />
        <circle cx="132" cy="18" r="9" fill="#5A4FE4" />
        <path
          d="M128 18 l3 3 l5 -6"
          stroke="#fff"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}
