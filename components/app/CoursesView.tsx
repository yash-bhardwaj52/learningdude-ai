
"use client";

import { useEffect, useMemo, useState } from "react";

type Course = {
  id: string;
  title: string;
  category: string;
  level: string;
  duration: string;
  description: string;
  platform: string;
  url: string;
};

const courses: Course[] = [
  {
    id: "html-css",
    title: "HTML & CSS Fundamentals",
    category: "Frontend",
    level: "Beginner",
    duration: "Start here",
    description: "Learn page structure, layouts, responsive design and styling.",
    platform: "MDN Web Docs",
    url: "https://developer.mozilla.org/en-US/docs/Learn_web_development",
  },
  {
    id: "javascript",
    title: "JavaScript Essentials",
    category: "Frontend",
    level: "Beginner",
    duration: "Self-paced",
    description: "Build a strong foundation in variables, functions, arrays and DOM.",
    platform: "freeCodeCamp",
    url: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures-v8/",
  },
  {
    id: "react",
    title: "Learn React",
    category: "Frontend",
    level: "Intermediate",
    duration: "Self-paced",
    description: "Understand components, props, state, hooks and reusable UI.",
    platform: "React Official",
    url: "https://react.dev/learn",
  },
  {
    id: "typescript",
    title: "TypeScript for Beginners",
    category: "Frontend",
    level: "Intermediate",
    duration: "Self-paced",
    description: "Add types to JavaScript and write safer application code.",
    platform: "TypeScript Official",
    url: "https://www.typescriptlang.org/docs/",
  },
  {
    id: "java",
    title: "Java Programming",
    category: "Programming",
    level: "Beginner",
    duration: "Self-paced",
    description: "Practice Java syntax, OOP, classes, objects and core concepts.",
    platform: "MOOC.fi",
    url: "https://java-programming.mooc.fi/",
  },
  {
    id: "dsa",
    title: "Data Structures & Algorithms",
    category: "Programming",
    level: "Beginner",
    duration: "Practice regularly",
    description: "Learn problem-solving, arrays, searching, sorting and complexity.",
    platform: "GeeksforGeeks",
    url: "https://www.geeksforgeeks.org/data-structures/",
  },
  {
    id: "python",
    title: "Python Tutorial",
    category: "Data Science",
    level: "Beginner",
    duration: "Self-paced",
    description: "Learn Python basics and build a foundation for data analysis.",
    platform: "Python Official",
    url: "https://docs.python.org/3/tutorial/",
  },
  {
    id: "sql",
    title: "SQL Fundamentals",
    category: "Data Science",
    level: "Beginner",
    duration: "Self-paced",
    description: "Practice queries, filtering, joins and working with databases.",
    platform: "SQLBolt",
    url: "https://sqlbolt.com/",
  },
  {
    id: "ml",
    title: "Machine Learning Crash Course",
    category: "AI & ML",
    level: "Beginner",
    duration: "Self-paced",
    description: "Explore core machine learning concepts and practical exercises.",
    platform: "Google",
    url: "https://developers.google.com/machine-learning/crash-course",
  },
  {
    id: "git",
    title: "Git & GitHub Basics",
    category: "Tools",
    level: "Beginner",
    duration: "Self-paced",
    description: "Learn version control, commits, branches and collaboration.",
    platform: "GitHub Skills",
    url: "https://skills.github.com/",
  },
];

const categories = [
  "All",
  "Frontend",
  "Programming",
  "Data Science",
  "AI & ML",
  "Tools",
];

const STORAGE_KEY = "learningdude-course-progress";

export default function CoursesView() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [completed, setCompleted] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setCompleted(
            parsed.filter((item): item is string => typeof item === "string")
          );
        }
      }
    } catch {
      console.warn("Could not load course progress.");
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(completed));
    }
  }, [completed, loaded]);

  const filteredCourses = useMemo(() => {
    const query = search.trim().toLowerCase();

    return courses.filter((course) => {
      const matchesCategory =
        category === "All" || course.category === category;

      const matchesSearch =
        !query ||
        `${course.title} ${course.description} ${course.platform} ${course.category}`
          .toLowerCase()
          .includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [search, category]);

  const toggleCompleted = (id: string) => {
    setCompleted((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id]
    );
  };

  const progress = Math.round((completed.length / courses.length) * 100);

  return (
    <main className="min-h-screen bg-[#070B18] px-4 py-7 text-white sm:px-7 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <header>
          <p className="mb-2 text-sm font-medium text-violet-400">
            YOUR LEARNING SPACE
          </p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Explore Courses<span className="text-violet-400">.</span>
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
            Discover useful learning resources, build real skills and track your
            progress one course at a time.
          </p>
        </header>

        <section className="rounded-2xl border border-white/10 bg-gradient-to-r from-violet-600/20 to-blue-600/10 p-5 sm:p-7">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm text-slate-300">Your learning progress</p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-4xl font-bold">{completed.length}</span>
                <span className="text-slate-400">of {courses.length} courses completed</span>
              </div>
            </div>
            <div className="w-full sm:max-w-xs">
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-slate-300">Overall progress</span>
                <span className="font-semibold text-violet-300">{progress}%</span>
              </div>
              <div
                className="h-2.5 overflow-hidden rounded-full bg-white/10"
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Course completion progress"
              >
                <div
                  className="h-full rounded-full bg-violet-500 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-500">
              ⌕
            </span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search courses, skills or platforms..."
              aria-label="Search courses"
              className="w-full rounded-xl border border-white/10 bg-[#101629] py-3.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-violet-500"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm transition ${
                  category === item
                    ? "border-violet-500 bg-violet-500/20 text-violet-200"
                    : "border-white/10 bg-[#101629] text-slate-400 hover:border-white/25 hover:text-white"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Learning library</h2>
            <span className="text-sm text-slate-500">
              {filteredCourses.length} resources
            </span>
          </div>

          {filteredCourses.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-[#101629] px-5 py-12 text-center">
              <p className="text-lg font-semibold">No courses found</p>
              <p className="mt-2 text-sm text-slate-400">
                Try another search or select a different category.
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setCategory("All");
                }}
                className="mt-4 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium hover:bg-violet-500"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredCourses.map((course) => {
                const isCompleted = completed.includes(course.id);

                return (
                  <article
                    key={course.id}
                    className="flex flex-col rounded-2xl border border-white/10 bg-[#101629] p-5 transition hover:-translate-y-0.5 hover:border-violet-500/40"
                  >
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <span className="rounded-lg bg-violet-500/15 px-3 py-1.5 text-xs font-medium text-violet-300">
                        {course.category}
                      </span>
                      {isCompleted && (
                        <span className="text-xs font-medium text-emerald-400">
                          ✓ Completed
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-semibold leading-snug">
                      {course.title}
                    </h3>
                    <p className="mt-3 flex-1 text-sm leading-6 text-slate-400">
                      {course.description}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2 text-xs text-slate-400">
                      <span className="rounded-md bg-white/5 px-2.5 py-1.5">
                        {course.level}
                      </span>
                      <span className="rounded-md bg-white/5 px-2.5 py-1.5">
                        {course.platform}
                      </span>
                    </div>

                    <div className="mt-5 flex items-center gap-3 border-t border-white/10 pt-4">
                      <a
                        href={course.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 rounded-lg bg-violet-600 px-3 py-2.5 text-center text-sm font-medium transition hover:bg-violet-500"
                      >
                        Start learning ↗
                      </a>
                      <button
                        onClick={() => toggleCompleted(course.id)}
                        aria-pressed={isCompleted}
                        className={`rounded-lg border px-3 py-2.5 text-sm transition ${
                          isCompleted
                            ? "border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10"
                            : "border-white/10 text-slate-300 hover:bg-white/5"
                        }`}
                      >
                        {isCompleted ? "Undo" : "Mark done"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <p className="text-xs leading-5 text-slate-500">
          Learning resources link to external websites. Course availability and
          completion on LearningDude are tracked separately. Your progress is
          saved in this browser on this device.
        </p>
      </div>
    </main>
  );
}
