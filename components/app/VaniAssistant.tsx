
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

function VaniRobot({ small = false }: { small?: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={`relative flex shrink-0 items-center justify-center rounded-full ${
        small ? "h-10 w-10" : "h-[66px] w-[66px]"
      }`}
      style={{
        background:
          "radial-gradient(circle at 30% 20%, #A78BFA, #6D28D9 55%, #312E81)",
        boxShadow: "0 0 28px rgba(139,92,246,0.4)",
      }}
    >
      <div
        className={`relative flex items-center justify-center rounded-[35%] border border-white/60 bg-gradient-to-br from-slate-100 via-violet-100 to-slate-300 ${
          small ? "h-7 w-7" : "h-11 w-11"
        }`}
        style={{ boxShadow: "inset 0 -4px 8px #A5B4FC" }}
      >
        <div className="absolute -top-1 h-2 w-4 rounded-full bg-cyan-200" />

        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-700 shadow-[0_0_5px_#67E8F9]" />
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-700 shadow-[0_0_5px_#67E8F9]" />
        </div>

        <div className="absolute bottom-1 h-1 w-3 rounded-full bg-violet-400" />
      </div>

      <span className="absolute -right-0.5 top-1 h-3 w-3 rounded-full border-2 border-[#17132D] bg-emerald-400" />
    </div>
  );
}

export default function VaniAssistant() {
  const router = useRouter();
  const [welcomeVisible, setWelcomeVisible] = useState(true);

  function openVani() {
    router.push("/vani");
  }

  return (
    <div className="pointer-events-none fixed bottom-5 right-4 z-[100] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {welcomeVisible && (
        <div className="pointer-events-auto relative mb-1 max-w-[240px] rounded-2xl border border-violet-300/20 bg-[#17132D] px-4 py-3 pr-7 text-sm text-white shadow-xl shadow-violet-950/30">
          <button
            type="button"
            onClick={() => setWelcomeVisible(false)}
            aria-label="Dismiss welcome message"
            className="absolute right-2 top-1 text-slate-400 hover:text-white"
          >
            ×
          </button>

          <p className="font-semibold text-violet-200">
            Hey, I&apos;m Vani! ✨
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-300">
            Need help with learning or your career? I&apos;m right here.
          </p>

          <span className="absolute -bottom-1.5 right-7 h-3 w-3 rotate-45 border-b border-r border-violet-300/20 bg-[#17132D]" />
        </div>
      )}

      <button
        type="button"
        onClick={openVani}
        aria-label="Open Vani AI career assistant"
        title="Chat with Vani"
        className="pointer-events-auto group relative cursor-pointer rounded-full outline-none transition-transform duration-300 hover:scale-105 focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-4 focus-visible:ring-offset-[#070B18]"
      >
        <span className="pointer-events-none absolute inset-0 animate-ping rounded-full bg-violet-500/20" />

        <div className="relative rounded-full border border-violet-200/30 bg-[#17132D] p-1.5 shadow-xl shadow-violet-950/50">
          <VaniRobot />
        </div>

        <span className="pointer-events-none absolute -bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/10 bg-[#17132D] px-2.5 py-0.5 text-[10px] font-semibold tracking-wide text-violet-200">
          VANI AI
        </span>
      </button>
    </div>
  );
}
