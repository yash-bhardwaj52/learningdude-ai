import type { CSSProperties, ReactElement } from "react";

type IconKey = "ai" | "web" | "code" | "shield" | "chart" | "cloud" | "design" | "loop";

type Career = { label: string; icon: IconKey; color: string; x: number; y: number };

/* x/y are centres in the 900×640 scene space; they sit on the two orbit arcs drawn in OrbitLines. */
export const CAREERS: Career[] = [
  { label: "DevOps", icon: "loop", color: "#fb923c", x: 88, y: 304 },
  { label: "Cloud Computing", icon: "cloud", color: "#38bdf8", x: 150, y: 199 },
  { label: "Software Engineering", icon: "code", color: "#60a5fa", x: 253, y: 139 },
  { label: "Web Development", icon: "web", color: "#22d3ee", x: 447, y: 155 },
  { label: "UI / UX Design", icon: "design", color: "#f472b6", x: 521, y: 211 },
  { label: "Cybersecurity", icon: "shield", color: "#34d399", x: 570, y: 296 },
  { label: "AI / ML", icon: "ai", color: "#a78bfa", x: 250, y: 262 },
  { label: "Data Science", icon: "chart", color: "#fbbf24", x: 410, y: 262 },
];

const ICONS: Record<IconKey, ReactElement> = {
  ai: (
    <>
      <rect x="6" y="6" width="12" height="12" rx="2" />
      <rect x="9.500" y="9.500" width="5" height="5" rx="1" />
      <path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" />
    </>
  ),
  web: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" />
    </>
  ),
  code: <path d="M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16" />,
  shield: (
    <>
      <path d="M12 3l8 3v6c0 5-3.500 8-8 9-4.500-1-8-4-8-9V6z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
  chart: <path d="M4 20h16M7 20v-7M12 20V5M17 20v-10" />,
  cloud: <path d="M7 18a4 4 0 0 1-.5-7.970A6 6 0 0 1 18 9.500 4.500 4.500 0 0 1 17.500 18z" />,
  design: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 9h18M9 9v11" />
    </>
  ),
  loop: <path d="M18.180 8c5.100 0 5.100 8 0 8-5.100 0-7.130-8-12.740-8-4.590 0-4.590 8 0 8 5.610 0 7.640-8 12.740-8z" />,
};

function Icon({ name }: { name: IconKey }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICONS[name]}
    </svg>
  );
}

export function CareerPills() {
  return (
    <ul className="ld-pills" aria-label="Tech career options">
      {CAREERS.map((c, i) => (
        <li
          key={c.label}
          className="ld-pill-wrap"
          style={{ left: `${(c.x / 900) * 100}%`, top: `${(c.y / 640) * 100}%` }}
        >
          <div className="ld-pill" style={{ "--accent": c.color, "--delay": `${i * 0.45}s` } as CSSProperties}>
            <span className="ld-pill-icon">
              <Icon name={c.icon} />
            </span>
            {c.label}
          </div>
        </li>
      ))}
    </ul>
  );
}

/* SVG layer: curved orbit arcs + glowing nodes travelling along them. */
export function OrbitLines() {
  return (
    <g className="ld-orbit">
      <path className="ld-orbit-line" d="M80 360 A250 232 0 0 1 580 360" fill="none" stroke="url(#ld-orbit)" strokeWidth="1.600" strokeDasharray="6 8" opacity="0.7" />
      <path className="ld-orbit-line" d="M190 360 A140 120 0 0 1 470 360" fill="none" stroke="url(#ld-orbit)" strokeWidth="1.400" strokeDasharray="4 8" opacity="0.55" />
      <g className="ld-node ld-node--outer">
        <circle r="11" fill="#22d3ee" opacity="0.22" />
        <circle r="4.500" fill="#67e8f9" />
      </g>
      <g className="ld-node ld-node--inner">
        <circle r="9" fill="#60a5fa" opacity="0.25" />
        <circle r="3.500" fill="#93c5fd" />
      </g>
    </g>
  );
}