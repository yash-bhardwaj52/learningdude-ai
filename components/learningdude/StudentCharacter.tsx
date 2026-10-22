/* Confused student (centre x = 330). Drawn in the 900×640 scene space. */
export function StudentCharacter() {
  return (
    <g>
      <g className="ld-bob">
        {/* hood behind head */}
        <ellipse cx="330" cy="472" rx="86" ry="46" fill="#0e2250" />
        {/* arms typing (hands peek out beside the laptop) */}
        <path d="M222 534C226 556 240 574 262 584" stroke="#1a3a78" strokeWidth="30" strokeLinecap="round" fill="none" />
        <path d="M438 534C434 556 420 574 398 584" stroke="#1a3a78" strokeWidth="30" strokeLinecap="round" fill="none" />
        <circle cx="264" cy="586" r="13" fill="#f1c5a0" />
        <circle cx="396" cy="586" r="13" fill="#f1c5a0" />
        {/* torso */}
        <path d="M205 612C205 540 245 484 330 484C415 484 455 540 455 612Z" fill="url(#ld-hoodieS)" stroke="#0a1a3a" strokeWidth="3" />
        <path d="M222 534C226 556 240 574 262 584" stroke="#1f4590" strokeWidth="26" strokeLinecap="round" fill="none" />
        <path d="M438 534C434 556 420 574 398 584" stroke="#1f4590" strokeWidth="26" strokeLinecap="round" fill="none" />
        {/* neck + collar */}
        <rect x="314" y="456" width="32" height="38" rx="10" fill="#dca983" />
        <ellipse cx="330" cy="490" rx="52" ry="15" fill="#10285a" stroke="#0a1a3a" strokeWidth="2" />

        {/* head */}
        <g className="ld-head-student">
          <ellipse cx="273" cy="414" rx="9" ry="13" fill="#e9b88f" />
          <ellipse cx="387" cy="414" rx="9" ry="13" fill="#e9b88f" />
          <ellipse cx="330" cy="408" rx="57" ry="60" fill="url(#ld-skinS)" />
          {/* hair */}
          <path d="M268 404C258 352 296 334 332 338C372 334 402 356 392 404C384 378 366 370 346 372C336 358 312 358 300 376C282 380 272 392 268 404Z" fill="#2a1b17" />
          <path d="M300 352c10-8 26-10 40-6" stroke="#4a3029" strokeWidth="3" strokeLinecap="round" fill="none" />
          {/* eyes */}
          <g className="ld-eye">
            <ellipse cx="306" cy="412" rx="11.500" ry="13.500" fill="#fff" />
            <circle cx="308" cy="416" r="6" fill="#1b1330" />
            <circle cx="310" cy="413" r="2" fill="#fff" />
          </g>
          <g className="ld-eye">
            <ellipse cx="354" cy="412" rx="11.500" ry="13.500" fill="#fff" />
            <circle cx="352" cy="416" r="6" fill="#1b1330" />
            <circle cx="354" cy="413" r="2" fill="#fff" />
          </g>
          {/* worried brows: inner ends raised */}
          <path d="M290 393Q304 384 322 379" stroke="#2a1b17" strokeWidth="4.500" strokeLinecap="round" fill="none" />
          <path d="M338 379Q356 384 370 393" stroke="#2a1b17" strokeWidth="4.500" strokeLinecap="round" fill="none" />
          {/* nose, mouth, cheeks */}
          <path d="M330 422q-4 8 2 10" stroke="#c99470" strokeWidth="2.500" strokeLinecap="round" fill="none" />
          <path d="M312 446q6-8 12 0t12 0" stroke="#7a3b2e" strokeWidth="3.500" strokeLinecap="round" fill="none" />
          <ellipse cx="290" cy="434" rx="9" ry="5" fill="#ff8f8f" opacity="0.35" />
          <ellipse cx="370" cy="434" rx="9" ry="5" fill="#ff8f8f" opacity="0.35" />
          {/* tear */}
          <g transform="translate(294 428)">
            <g className="ld-tear">
              <path d="M0 0C-4 6-5 10 0 12C5 10 4 6 0 0Z" fill="#7dd3fc" />
            </g>
          </g>
        </g>
      </g>

      {/* floating question marks */}
      <text className="ld-q" x="238" y="356" fontSize="34" fontWeight="800" fill="#fbbf24" style={{ ["--d" as string]: "0s" }}>?</text>
      <text className="ld-q" x="408" y="344" fontSize="40" fontWeight="800" fill="#22d3ee" style={{ ["--d" as string]: "0.8s" }}>?</text>
      <text className="ld-q" x="362" y="308" fontSize="26" fontWeight="800" fill="#a78bfa" style={{ ["--d" as string]: "1.6s" }}>?</text>

      {/* laptop lid (back faces us) */}
      <rect x="250" y="510" width="160" height="82" rx="10" fill="#14213f" stroke="#2f4a80" strokeWidth="2.500" />
      <rect x="250" y="510" width="160" height="5" rx="2.500" fill="#22d3ee" opacity="0.7" />
      <circle cx="330" cy="552" r="26" fill="#22d3ee" opacity="0.12" />
      <path d="M312 546l18-9 18 9-18 9z" fill="none" stroke="#67e8f9" strokeWidth="2.500" strokeLinejoin="round" />
      <path d="M319 551v8c6 5 16 5 22 0v-8" fill="none" stroke="#67e8f9" strokeWidth="2.500" strokeLinecap="round" />
    </g>
  );
}

/* Drawn after the desk so it sits on top of it. */
export function StudentLaptopBase() {
  return (
    <g>
      <ellipse cx="330" cy="606" rx="140" ry="9" fill="#22d3ee" opacity="0.18" />
      <path d="M232 592H428L442 604H218Z" fill="#1d2f56" stroke="#35548f" strokeWidth="2" strokeLinejoin="round" />
      <rect x="306" y="596" width="48" height="4" rx="2" fill="#0d1a35" />
    </g>
  );
}