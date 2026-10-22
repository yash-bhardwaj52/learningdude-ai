
"use client";

import { useEffect, useMemo, useState } from "react";

type Skill = {
  id: string;
  name: string;
  category: string;
  level: string;
  status: "Not Started" | "Learning" | "Completed";
};

const INITIAL_SKILLS: Skill[] = [
  { id: "html", name: "HTML", category: "Frontend", level: "Beginner", status: "Completed" },
  { id: "css", name: "CSS", category: "Frontend", level: "Beginner", status: "Completed" },
  { id: "js", name: "JavaScript", category: "Frontend", level: "Beginner", status: "Learning" },
  { id: "react", name: "React.js", category: "Frontend", level: "Beginner", status: "Not Started" },
  { id: "next", name: "Next.js", category: "Frontend", level: "Beginner", status: "Not Started" },
  { id: "typescript", name: "TypeScript", category: "Frontend", level: "Beginner", status: "Not Started" },
  { id: "java", name: "Java", category: "Programming", level: "Beginner", status: "Learning" },
  { id: "dsa", name: "Data Structures & Algorithms", category: "Programming", level: "Beginner", status: "Not Started" },
  { id: "oop", name: "Object-Oriented Programming", category: "Programming", level: "Beginner", status: "Not Started" },
  { id: "git", name: "Git & GitHub", category: "Tools", level: "Beginner", status: "Learning" },
  { id: "api", name: "REST APIs", category: "Tools", level: "Beginner", status: "Not Started" },
  { id: "responsive", name: "Responsive Design", category: "Frontend", level: "Beginner", status: "Learning" },
];

const STORAGE_KEY = "learningdude-skills";

const statuses: Skill["status"][] = [
  "Not Started",
  "Learning",
  "Completed",
];

const statusStyles: Record<Skill["status"], string> = {
  "Not Started": "border-white/10 bg-white/5 text-slate-400",
  Learning: "border-amber-400/20 bg-amber-400/10 text-amber-300",
  Completed: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
};

export default function SkillsView() {
  const [skills, setSkills] = useState<Skill[]>(INITIAL_SKILLS);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        const parsed: unknown = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          const savedSkills = parsed as Partial<Skill>[];

          setSkills(
            INITIAL_SKILLS.map((initial) => {
              const match = savedSkills.find((skill) => skill.id === initial.id);

              if (
                match &&
                statuses.includes(match.status as Skill["status"])
              ) {
                return { ...initial, status: match.status as Skill["status"] };
              }

              return initial;
            })
          );
        }
      }
    } catch {
      console.warn("Could not load saved skills.");
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(skills));
    }
  }, [skills, loaded]);

  const completed = skills.filter((skill) => skill.status === "Completed").length;
  const learning = skills.filter((skill) => skill.status === "Learning").length;
  const notStarted = skills.filter((skill) => skill.status === "Not Started").length;
  const progress = Math.round((completed / skills.length) * 100);

  const filteredSkills = useMemo(() => {
    return skills.filter((skill) => {
      const matchesFilter = filter === "All" || skill.status === filter;
      const matchesSearch =
        skill.name.toLowerCase().includes(search.toLowerCase()) ||
        skill.category.toLowerCase().includes(search.toLowerCase());

      return matchesFilter && matchesSearch;
    });
  }, [skills, filter, search]);

  function updateStatus(id: string, status: Skill["status"]) {
    setSkills((current) =>
      current.map((skill) =>
        skill.id === id ? { ...skill, status } : skill
      )
    );
  }

  function resetProgress() {
    if (window.confirm("Reset all skill statuses? This cannot be undone.")) {
      setSkills(INITIAL_SKILLS);
    }
  }

  return (
    <main className="min-h-screen bg-[#070B18] px-4 py-7 text-white sm:px-7 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-sm font-medium text-violet-400">
              YOUR PERSONAL DEVELOPMENT
            </p>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              My Skills<span className="text-violet-400">.</span>
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
              Track what you know, what you are learning, and what you want to
              master next.
            </p>
          </div>

          <button
            onClick={resetProgress}
            className="self-start rounded-lg border border-white/10 px-4 py-2.5 text-sm text-slate-300 transition hover:border-red-400/40 hover:text-red-300 sm:self-auto"
          >
            Reset progress
          </button>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-[#101629] p-5">
            <p className="text-sm text-slate-400">Total skills</p>
            <p className="mt-3 text-3xl font-bold">{skills.length}</p>
            <p className="mt-2 text-xs text-slate-500">In your skill library</p>
          </div>

          <div className="rounded-2xl border border-emerald-400/15 bg-[#101629] p-5">
            <p className="text-sm text-slate-400">Completed</p>
            <p className="mt-3 text-3xl font-bold text-emerald-300">{completed}</p>
            <p className="mt-2 text-xs text-slate-500">Skills you have mastered</p>
          </div>

          <div className="rounded-2xl border border-amber-400/15 bg-[#101629] p-5">
            <p className="text-sm text-slate-400">In progress</p>
            <p className="mt-3 text-3xl font-bold text-amber-300">{learning}</p>
            <p className="mt-2 text-xs text-slate-500">Skills you are practicing</p>
          </div>

          <div className="rounded-2xl border border-violet-400/15 bg-[#101629] p-5">
            <p className="text-sm text-slate-400">Completion rate</p>
            <p className="mt-3 text-3xl font-bold text-violet-300">{progress}%</p>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-violet-500 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-[#101629] p-5 sm:p-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-semibold">Your skill checklist</h2>
              <p className="mt-1 text-sm text-slate-400">
                Update a skill&apos;s status as you progress.
              </p>
            </div>

            <span className="text-sm text-slate-400">
              {notStarted} skills not started
            </span>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search skills..."
              aria-label="Search skills"
              className="w-full rounded-xl border border-white/10 bg-[#070B18] px-4 py-3 text-sm outline-none placeholder:text-slate-500 focus:border-violet-500"
            />

            <select
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              aria-label="Filter skills by status"
              className="w-full rounded-xl border border-white/10 bg-[#070B18] px-4 py-3 text-sm text-slate-300 outline-none focus:border-violet-500"
            >
              <option value="All">All statuses</option>
              <option value="Not Started">Not started</option>
              <option value="Learning">Learning</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="mt-5 space-y-3">
            {filteredSkills.map((skill) => (
              <div
                key={skill.id}
                className="flex flex-col justify-between gap-4 rounded-xl border border-white/10 bg-[#0B1020] p-4 sm:flex-row sm:items-center"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 text-sm font-bold text-violet-300">
                    {skill.name.slice(0, 2).toUpperCase()}
                  </div>

                  <div>
                    <h3 className="font-medium">{skill.name}</h3>
                    <p className="mt-1 text-xs text-slate-500">
                      {skill.category} · {skill.level}
                    </p>
                    <span
                      className={`mt-2 inline-block rounded-full border px-2.5 py-1 text-xs ${statusStyles[skill.status]}`}
                    >
                      {skill.status}
                    </span>
                  </div>
                </div>

                <label className="flex flex-col gap-1.5 text-xs text-slate-500 sm:min-w-40">
                  Update status
                  <select
                    value={skill.status}
                    onChange={(event) =>
                      updateStatus(skill.id, event.target.value as Skill["status"])
                    }
                    aria-label={`Update ${skill.name} status`}
                    className="rounded-lg border border-white/10 bg-[#101629] px-3 py-2.5 text-sm text-white outline-none focus:border-violet-500"
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            ))}

            {filteredSkills.length === 0 && (
              <div className="py-10 text-center">
                <p className="font-medium">No skills found</p>
                <p className="mt-2 text-sm text-slate-500">
                  Try a different search or status filter.
                </p>
                <button
                  onClick={() => {
                    setSearch("");
                    setFilter("All");
                  }}
                  className="mt-4 text-sm text-violet-300 hover:text-violet-200"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </section>

        <p className="text-xs leading-5 text-slate-500">
          Progress is saved in this browser using local storage. The initial
          statuses are sample starting values; adjust them to reflect your
          actual skills.
        </p>
      </div>
    </main>
  );
}
