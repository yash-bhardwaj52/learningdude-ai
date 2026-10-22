export default function BrandLogo({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" role="img" aria-label="LearningDude AI logo">
      <defs>
        <linearGradient id="ld-logo-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#22d3ee" />
          <stop offset="1" stopColor="#2563eb" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="13" fill="url(#ld-logo-bg)" />
      {/* student: shoulders + head + graduation cap */}
      <path d="M12 33c0-6.5 5.2-9.5 12-9.5S36 26.500 36 33z" fill="#fff" />
      <circle cx="24" cy="19" r="6.5" fill="#fff" />
      <path d="M15.500 14.500 24 10l8.500 4.500L24 19z" fill="#0b1730" stroke="#fff" strokeWidth="1.200" strokeLinejoin="round" />
      <path d="M32.500 14.500v5" stroke="#fff" strokeWidth="1.200" strokeLinecap="round" />
      {/* laptop */}
      <rect x="14" y="31" width="20" height="9" rx="2" fill="#0b1730" stroke="#fff" strokeWidth="1.500" />
      <circle cx="24" cy="35.500" r="1.600" fill="#22d3ee" />
      <path d="M11 41h26" stroke="#fff" strokeWidth="1.800" strokeLinecap="round" />
    </svg>
  );
}