
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const menu = [
    { label: "Dashboard", icon: "▦", href: "/dashboard", section: "" },
    { label: "Career Assessment", icon: "◎", href: "/assessment", section: "" },
    { label: "My Roadmap", icon: "⌁", href: "/roadmap", section: "" },
    { label: "Courses", icon: "▤", href: "/courses", section: "" }, 
    { label: "My Skills", icon: "✳", href: "/skills", section: "" },
    { label: "Projects", icon: "▣", href: "/projects", section: "" },
    { label: "Jobs & Internships", icon: "▧", href: "/jobs", section: "" },
    { label: "Resume Builder", icon: "▱", href: "/resume", section: "" },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    function isActive(href: string, section: string) {
        if (section) return false;
        return pathname === href;
    }

    return (
        <>
            <button
                type="button"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={mobileOpen}
                className="fixed left-4 top-4 z-[60] flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-[#10182A] text-xl text-white shadow-lg lg:hidden"
            >
                {mobileOpen ? "×" : "☰"}
            </button>

            {mobileOpen && (
                <button
                    type="button"
                    aria-label="Close navigation"
                    onClick={() => setMobileOpen(false)}
                    className="fixed inset-0 z-40 bg-black/60 lg:hidden"
                />
            )}

            <aside
                className={`fixed inset-y-0 left-0 z-50 flex w-[270px] flex-col border-r border-white/10 bg-[#0A1020] text-white transition-transform duration-200 lg:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <Link
                    href="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 border-b border-white/10 px-5 py-6"
                >
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-300 to-blue-600 text-xl font-black text-slate-950">
                        L
                    </span>
                    <span>
                        <span className="block text-base font-extrabold tracking-tight">
                            LearningDude <span className="text-cyan-300">AI</span>
                        </span>
                        <span className="mt-1 block text-xs text-slate-500">
                            Your personal career guide
                        </span>
                    </span>
                </Link>

                <div className="px-4 pt-6">
                    <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                        Workspace
                    </p>

                    <nav aria-label="Main navigation" className="space-y-1">
                        {menu.map((item) => {
                            const active = isActive(item.href, item.section);

                            return (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    onClick={() => setMobileOpen(false)}
                                    aria-current={active ? "page" : undefined}
                                    className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${active
                                            ? "border border-cyan-300/15 bg-cyan-300/10 text-cyan-200"
                                            : "border border-transparent text-slate-400 hover:bg-white/5 hover:text-white"
                                        }`}
                                >
                                    <span
                                        className={`flex h-8 w-8 items-center justify-center rounded-lg text-lg ${active
                                                ? "bg-cyan-300/10 text-cyan-200"
                                                : "text-slate-400 group-hover:text-cyan-200"
                                            }`}
                                        aria-hidden="true"
                                    >
                                        {item.icon}
                                    </span>
                                    <span className="flex-1">{item.label}</span>
                                    {active && (
                                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="mt-auto p-4">
                    <div className="rounded-2xl border border-cyan-300/15 bg-gradient-to-br from-cyan-300/10 to-blue-500/10 p-4">
                        <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-300/10 text-lg">
                            ✨
                        </div>
                        <p className="text-sm font-semibold text-white">Keep moving forward</p>
                        <p className="mt-1 text-xs leading-5 text-slate-400">
                            Small steps every day build a stronger future.
                        </p>
                        <Link
                            href="/dashboard#roadmap"
                            onClick={() => setMobileOpen(false)}
                            className="mt-3 inline-flex text-xs font-bold text-cyan-300 hover:text-cyan-200"
                        >
                            View your roadmap →
                        </Link>
                    </div>

                    <div className="mt-4 flex items-center gap-3 border-t border-white/10 px-2 pt-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-700 text-sm font-bold text-white">
                            LD
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-slate-200">
                                My Learning Space
                            </p>
                            <p className="text-xs text-slate-500">Career development</p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
