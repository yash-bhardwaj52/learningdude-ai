import { CareerPills, OrbitLines } from "./CareerOrbit";
import { MentorCharacter } from "./MentorCharacter";
import { StudentCharacter, StudentLaptopBase } from "./StudentCharacter";

const STARS: Array<[number, number, number, number]> = [
  [60, 90, 2, 0], [150, 60, 1.5, 0.6], [620, 70, 2, 1.1], [700, 130, 1.5, 0.3], [840, 90, 2, 1.7],
  [860, 240, 1.5, 0.9], [30, 200, 1.5, 1.4], [800, 500, 2, 0.5], [120, 480, 1.5, 2.1], [580, 520, 1.5, 1.2],
];

function Desk() {
  return (
    <g>
      <rect x="90" y="600" width="790" height="60" rx="16" fill="url(#ld-desk)" />
      <rect x="110" y="600" width="750" height="2.500" rx="1.250" fill="#22d3ee" opacity="0.45" />
    </g>
  );
}

export default function HeroScene() {
  return (
    <div className="ld-scene">
      <div className="ld-canvas">
        <svg className="ld-svg" viewBox="0 0 900 640" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">
          <defs>
            <radialGradient id="ld-glow">
              <stop offset="0" stopColor="#2563eb" stopOpacity="0.32" />
              <stop offset="1" stopColor="#2563eb" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="ld-glow2">
              <stop offset="0" stopColor="#22d3ee" stopOpacity="0.2" />
              <stop offset="1" stopColor="#22d3ee" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="ld-orbit" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#22d3ee" />
              <stop offset="1" stopColor="#6366f1" />
            </linearGradient>
            <linearGradient id="ld-hoodieS" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#24498f" />
              <stop offset="1" stopColor="#12285a" />
            </linearGradient>
            <linearGradient id="ld-hoodieM" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#1f4ba3" />
              <stop offset="1" stopColor="#10265a" />
            </linearGradient>
            <linearGradient id="ld-skinS" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#f6cfae" />
              <stop offset="1" stopColor="#e9b88f" />
            </linearGradient>
            <linearGradient id="ld-skinM" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#c98f63" />
              <stop offset="1" stopColor="#b57a4f" />
            </linearGradient>
            <linearGradient id="ld-tablet" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#0e3a73" />
              <stop offset="1" stopColor="#0b6aa8" />
            </linearGradient>
            <linearGradient id="ld-desk" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#14336a" />
              <stop offset="1" stopColor="#0a1a3a" stopOpacity="0" />
            </linearGradient>
          </defs>

          <circle cx="330" cy="390" r="320" fill="url(#ld-glow)" />
          <circle cx="730" cy="430" r="220" fill="url(#ld-glow2)" />
          {STARS.map(([x, y, r, d]) => (
            <circle key={`${x}-${y}`} className="ld-star" cx={x} cy={y} r={r} fill="#93c5fd" style={{ ["--d" as string]: `${d}s` }} />
          ))}

          <OrbitLines />
          <MentorCharacter />
          <StudentCharacter />
          <Desk />
          <StudentLaptopBase />
        </svg>

        <div className="ld-bubble ld-bubble--brand">
          <strong>LearningDude AI</strong>
          <span>Your Career Guide</span>
        </div>
        <div className="ld-bubble ld-bubble--hint">{"Don't worry! Let's find your path."}</div>
      </div>

      <CareerPills />
    </div>
  );
}