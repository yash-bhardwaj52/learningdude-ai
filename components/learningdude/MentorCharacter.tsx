/* LearningDude AI guide (centre x = 730). */
export function MentorCharacter() {
  return (
    <g>
      <g className="ld-bob ld-bob--m">
        {/* hood behind head */}
        <ellipse cx="730" cy="472" rx="88" ry="46" fill="#0e2250" />
        {/* tablet arm (behind the desk edge) */}
        <path d="M818 540C846 566 840 592 806 598" stroke="#173a80" strokeWidth="30" strokeLinecap="round" fill="none" />
        <g transform="rotate(8 818 580)">
          <rect x="780" y="528" width="78" height="102" rx="9" fill="#0b182f" stroke="#38bdf8" strokeWidth="2.500" />
          <rect x="787" y="536" width="64" height="84" rx="4" fill="url(#ld-tablet)" />
          <rect x="794" y="592" width="8" height="20" rx="2" fill="#67e8f9" />
          <rect x="808" y="580" width="8" height="32" rx="2" fill="#a5f3fc" />
          <rect x="822" y="566" width="8" height="46" rx="2" fill="#22d3ee" />
          <path d="M794 552h30M794 562h18" stroke="#bae6fd" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
        </g>
        <circle cx="788" cy="588" r="13" fill="#b87b50" />

        {/* torso */}
        <path d="M600 612C600 540 650 486 730 486C810 486 860 540 860 612Z" fill="url(#ld-hoodieM)" stroke="#0a1a3a" strokeWidth="3" />
        <rect x="314" y="0" width="0" height="0" fill="none" />
        <rect x="714" y="456" width="32" height="38" rx="10" fill="#a96f46" />
        <ellipse cx="730" cy="490" rx="54" ry="15" fill="#10285a" stroke="#0a1a3a" strokeWidth="2" />
        <path d="M716 500l-4 50M744 500l4 50" stroke="#dbeafe" strokeWidth="3" strokeLinecap="round" />
        <circle cx="712" cy="552" r="3.500" fill="#22d3ee" />
        <circle cx="748" cy="552" r="3.500" fill="#22d3ee" />

        {/* head */}
        <g className="ld-head-mentor">
          <ellipse cx="673" cy="412" rx="9" ry="13" fill="#b87b50" />
          <ellipse cx="787" cy="412" rx="9" ry="13" fill="#b87b50" />
          <ellipse cx="730" cy="408" rx="57" ry="60" fill="url(#ld-skinM)" />
          {/* hair */}
          <path d="M672 402C662 346 700 330 738 334C780 332 802 356 790 402C782 378 766 368 746 370C732 352 704 352 690 372C678 376 674 388 672 402Z" fill="#141a2b" />
          <path d="M700 346c14-10 34-12 50-6" stroke="#2c3652" strokeWidth="3.500" strokeLinecap="round" fill="none" />
          {/* eyes */}
          <g className="ld-eye ld-eye--m">
            <ellipse cx="710" cy="409" rx="8" ry="9" fill="#fff" />
            <circle cx="708" cy="410" r="4.500" fill="#1b1330" />
            <circle cx="709.500" cy="408" r="1.500" fill="#fff" />
          </g>
          <g className="ld-eye ld-eye--m">
            <ellipse cx="750" cy="409" rx="8" ry="9" fill="#fff" />
            <circle cx="748" cy="410" r="4.500" fill="#1b1330" />
            <circle cx="749.500" cy="408" r="1.500" fill="#fff" />
          </g>
          {/* glasses */}
          <rect x="694" y="393" width="32" height="28" rx="10" fill="#bae6fd" opacity="0.16" />
          <rect x="734" y="393" width="32" height="28" rx="10" fill="#bae6fd" opacity="0.16" />
          <rect x="694" y="393" width="32" height="28" rx="10" fill="none" stroke="#0b1220" strokeWidth="4" />
          <rect x="734" y="393" width="32" height="28" rx="10" fill="none" stroke="#0b1220" strokeWidth="4" />
          <path d="M726 404q4-4 8 0M694 403L676 400M766 403L784 400" stroke="#0b1220" strokeWidth="3.500" strokeLinecap="round" fill="none" />
          <path d="M699 398q6-3 12-2" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.9" />
          <path d="M739 398q6-3 12-2" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.9" />
          {/* cheerful brows, nose, smile, cheeks */}
          <path d="M696 384Q710 375 724 381M736 381Q750 375 764 384" stroke="#141a2b" strokeWidth="4.500" strokeLinecap="round" fill="none" />
          <path d="M730 420q-4 8 2 10" stroke="#8d5a37" strokeWidth="2.500" strokeLinecap="round" fill="none" />
          <path d="M706 436Q730 466 754 436Z" fill="#fff" stroke="#7a2e2e" strokeWidth="3" strokeLinejoin="round" />
          <ellipse cx="692" cy="434" rx="9" ry="5" fill="#ff9a8a" opacity="0.3" />
          <ellipse cx="768" cy="434" rx="9" ry="5" fill="#ff9a8a" opacity="0.3" />
        </g>

        {/* gesturing arm, pointing toward the student */}
        <g className="ld-arm">
          <path d="M650 538C612 572 574 562 550 524" stroke="#173a80" strokeWidth="32" strokeLinecap="round" fill="none" />
          <path d="M650 538C626 556 606 562 588 558" stroke="#2a56b0" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.6" />
          <g className="ld-hand">
            <ellipse cx="540" cy="514" rx="15" ry="13" fill="#b87b50" />
            <rect x="512" y="505" width="26" height="7" rx="3.500" fill="#b87b50" />
            <rect x="510" y="514" width="28" height="7" rx="3.500" fill="#b87b50" />
            <rect x="514" y="523" width="24" height="7" rx="3.500" fill="#b87b50" />
            <ellipse cx="548" cy="500" rx="9" ry="6" fill="#b87b50" transform="rotate(-30 548 500)" />
          </g>
        </g>
      </g>
    </g>
  );
}