
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Task = {
  id: string;
  title: string;
  detail: string;
};

const plans: Record<string, { title: string; description: string; weeks: { title: string; tasks: Task[] }[] }> = {
  frontend: {
    title: "Frontend Developer",
    description: "Build modern, responsive websites and interactive user interfaces.",
    weeks: [
      { title: "Week 1 · Web foundations", tasks: [
        { id: "html", title: "Revise HTML5", detail: "Semantic tags, forms and accessibility basics." },
        { id: "css", title: "Practice CSS layouts", detail: "Flexbox, Grid, responsive design and media queries." },
        { id: "git", title: "Learn Git and GitHub basics", detail: "Create a repository and push your code." },
      ]},
      { title: "Week 2 · JavaScript", tasks: [
        { id: "js", title: "Learn JavaScript fundamentals", detail: "Variables, functions, arrays, objects and loops." },
        { id: "dom", title: "Practice DOM and events", detail: "Build a small interactive webpage." },
        { id: "api", title: "Fetch data from an API", detail: "Show loading, success and error states." },
      ]},
      { title: "Week 3 · React", tasks: [
        { id: "react", title: "Learn React fundamentals", detail: "Components, props, state and hooks." },
        { id: "forms", title: "Build a form with validation", detail: "Handle user input and error messages." },
        { id: "project", title: "Build a React project", detail: "Create a polished, responsive app." },
      ]},
      { title: "Week 4 · Portfolio and applications", tasks: [
        { id: "deploy", title: "Deploy your project", detail: "Publish it and test the live link." },
        { id: "resume", title: "Prepare your resume and portfolio", detail: "Add project links and truthful skills." },
        { id: "apply", title: "Apply to suitable internships", detail: "Track applications and practice interviews." },
      ]},
    ],
  },
  software: {
    title: "Software Developer",
    description: "Strengthen programming, problem-solving and software-building skills.",
    weeks: [
      { title: "Week 1 · Programming", tasks: [
        { id: "prog", title: "Revise one programming language", detail: "Choose Java, Python or JavaScript." },
        { id: "oop", title: "Practice OOP concepts", detail: "Classes, objects, inheritance and encapsulation." },
        { id: "git", title: "Use Git and GitHub", detail: "Push a small practice project." },
      ]},
      { title: "Week 2 · Problem solving", tasks: [
        { id: "arrays", title: "Practice arrays and strings", detail: "Solve beginner problems and explain your approach." },
        { id: "search", title: "Learn searching and sorting", detail: "Understand time complexity basics." },
        { id: "daily", title: "Solve one coding problem daily", detail: "Record the approach and mistakes." },
      ]},
      { title: "Week 3 · Build", tasks: [
        { id: "design", title: "Learn basic software design", detail: "Break a feature into smaller functions." },
        { id: "build", title: "Build a complete project", detail: "Include validation and error handling." },
        { id: "readme", title: "Write a useful README", detail: "Explain features, setup and screenshots." },
      ]},
      { title: "Week 4 · Career prep", tasks: [
        { id: "review", title: "Review your code", detail: "Fix bugs and improve naming." },
        { id: "cv", title: "Prepare resume and project links", detail: "Highlight real work and skills." },
        { id: "apply", title: "Apply and practice interviews", detail: "Review programming and project questions." },
      ]},
    ],
  },
  data: {
    title: "Data Analyst",
    description: "Build practical skills in spreadsheets, SQL, Python and data storytelling.",
    weeks: [
      { title: "Week 1 · Data basics", tasks: [
        { id: "excel", title: "Practice spreadsheets", detail: "Formulas, sorting, filtering and pivot tables." },
        { id: "clean", title: "Clean a small dataset", detail: "Handle missing values and duplicates." },
        { id: "charts", title: "Create clear charts", detail: "Choose charts that answer a question." },
      ]},
      { title: "Week 2 · SQL and Python", tasks: [
        { id: "sql", title: "Learn SQL basics", detail: "SELECT, WHERE, GROUP BY and JOIN." },
        { id: "python", title: "Practice Python basics", detail: "Lists, dictionaries, functions and files." },
        { id: "pandas", title: "Explore a dataset with pandas", detail: "Filter, group and summarize data." },
      ]},
      { title: "Week 3 · Projects", tasks: [
        { id: "analysis", title: "Complete an exploratory analysis", detail: "Find patterns and write conclusions." },
        { id: "dashboard", title: "Create a dashboard", detail: "Use a charting tool or spreadsheet." },
        { id: "publish", title: "Publish your project", detail: "Add dataset source and clear explanations." },
      ]},
      { title: "Week 4 · Career prep", tasks: [
        { id: "portfolio", title: "Organize your portfolio", detail: "Show the question, process and findings." },
        { id: "sqlpractice", title: "Practice SQL interview questions", detail: "Explain your queries clearly." },
        { id: "apply", title: "Apply to entry-level roles", detail: "Track applications and keep learning." },
      ]},
    ],
  },
  ai: {
    title: "AI / Machine Learning",
    description: "Start with Python and data foundations before building simple ML projects.",
    weeks: [
      { title: "Week 1 · Python", tasks: [
        { id: "python", title: "Learn Python fundamentals", detail: "Variables, loops, functions and collections." },
        { id: "notebook", title: "Practice in a notebook", detail: "Run code cells and document your work." },
        { id: "math", title: "Revise basic statistics", detail: "Mean, median, probability and graphs." },
      ]},
      { title: "Week 2 · Data handling", tasks: [
        { id: "numpy", title: "Learn NumPy basics", detail: "Arrays and simple numerical operations." },
        { id: "pandas", title: "Learn pandas", detail: "Load, inspect and clean datasets." },
        { id: "visual", title: "Visualize a dataset", detail: "Use charts to understand patterns." },
      ]},
      { title: "Week 3 · Machine learning", tasks: [
        { id: "ml", title: "Understand ML fundamentals", detail: "Features, labels, training and testing." },
        { id: "model", title: "Train a beginner model", detail: "Use scikit-learn on a small dataset." },
        { id: "evaluate", title: "Evaluate model results", detail: "Understand metrics and limitations." },
      ]},
      { title: "Week 4 · Project", tasks: [
        { id: "project", title: "Build a small ML project", detail: "Explain the dataset and goal." },
        { id: "readme", title: "Document your project", detail: "Add results, setup and limitations." },
        { id: "next", title: "Plan your next learning step", detail: "Choose a topic based on your gaps." },
      ]},
    ],
  },
  beginner: {
    title: "Tech Foundations",
    description: "Explore programming and web basics, then choose a direction that fits you.",
    weeks: [
      { title: "Week 1 · Explore", tasks: [
        { id: "computer", title: "Understand web and software basics", detail: "Learn how websites and apps work." },
        { id: "html", title: "Try basic HTML and CSS", detail: "Create a simple personal webpage." },
        { id: "career", title: "Explore tech career paths", detail: "Compare frontend, software, data and AI." },
      ]},
      { title: "Week 2 · Programming", tasks: [
        { id: "language", title: "Choose one beginner language", detail: "Try JavaScript, Python or Java." },
        { id: "logic", title: "Practice basic logic", detail: "Use variables, conditions and loops." },
        { id: "git", title: "Create a GitHub account or repository", detail: "Save your first practice code." },
      ]},
      { title: "Week 3 · Build", tasks: [
        { id: "mini", title: "Build a small project", detail: "Make a page, calculator or simple app." },
        { id: "debug", title: "Practice fixing errors", detail: "Read messages and test small changes." },
        { id: "reflect", title: "Review what you enjoyed", detail: "Note your strengths and interests." },
      ]},
      { title: "Week 4 · Choose a direction", tasks: [
        { id: "choose", title: "Select a career path to explore", detail: "Choose based on interest and practice." },
        { id: "plan", title: "Set your next learning goals", detail: "Choose achievable weekly tasks." },
        { id: "project", title: "Share your work", detail: "Write a short project explanation." },
      ]},
    ],
  },
};

export default function RoadmapView() {
  const [career, setCareer] = useState("beginner");
  const [completed, setCompleted] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedAssessment = localStorage.getItem("learningdude-assessment");
      if (savedAssessment) {
        const parsed = JSON.parse(savedAssessment);
        if (typeof parsed.career === "string" && plans[parsed.career]) {
          setCareer(parsed.career);
        }
      }

      const savedTasks = localStorage.getItem("learningdude-roadmap-progress");
      if (savedTasks) {
        const parsedTasks = JSON.parse(savedTasks);
        if (Array.isArray(parsedTasks)) {
          setCompleted(parsedTasks.filter((item) => typeof item === "string"));
        }
      }
    } catch {
      // Start with the default roadmap if stored data is invalid.
    }
    setLoaded(true);
  }, []);

  function toggleTask(id: string) {
    setCompleted((previous) => {
      const next = previous.includes(id)
        ? previous.filter((task) => task !== id)
        : [...previous, id];

      try {
        localStorage.setItem("learningdude-roadmap-progress", JSON.stringify(next));
      } catch {
        // Progress remains available in this page until it is closed.
      }
      return next;
    });
  }

  const plan = plans[career] ?? plans.beginner;
  const allTasks = plan.weeks.flatMap((week) => week.tasks);
  const doneCount = allTasks.filter((task) => completed.includes(task.id)).length;
  const percent = Math.round((doneCount / allTasks.length) * 100);

  if (!loaded) {
    return <main className="min-h-screen bg-[#070B18] p-8 text-slate-300">Loading your roadmap...</main>;
  }

  return (
    <main className="min-h-screen bg-[#070B18] px-4 py-6 text-white sm:px-7 lg:px-9">
      <div className="mx-auto max-w-5xl">
        <Link href="/dashboard" className="text-sm text-cyan-300 hover:text-cyan-200">
          ← Back to dashboard
        </Link>

        <div className="mt-6 rounded-3xl border border-white/10 bg-gradient-to-br from-[#111C32] to-[#0B1222] p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">Your learning plan</p>
          <h1 className="mt-3 text-3xl font-black sm:text-4xl">{plan.title} Roadmap</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">{plan.description}</p>

          <div className="mt-7 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm text-slate-400">Overall progress</p>
              <p className="mt-1 text-3xl font-bold">{percent}%</p>
            </div>
            <p className="text-right text-xs text-slate-400">{doneCount} of {allTasks.length} tasks completed</p>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-blue-500 transition-all" style={{ width: `${percent}%` }} />
          </div>
          {career === "beginner" && (
            <p className="mt-4 text-xs text-slate-500">
              Complete Career Assessment to personalize your roadmap.
            </p>
          )}
        </div>

        <div className="mt-7 space-y-5">
          {plan.weeks.map((week, index) => {
            const weekDone = week.tasks.filter((task) => completed.includes(task.id)).length;
            return (
              <section key={week.title} className="rounded-2xl border border-white/10 bg-[#0D1425] p-5 sm:p-6">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-cyan-300">Phase {index + 1}</p>
                    <h2 className="mt-1 text-lg font-bold">{week.title}</h2>
                  </div>
                  <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-400">
                    {weekDone}/{week.tasks.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {week.tasks.map((task) => {
                    const checked = completed.includes(task.id);
                    return (
                      <label key={task.id} className={`flex cursor-pointer gap-3 rounded-xl border p-4 transition ${checked ? "border-cyan-300/20 bg-cyan-300/5" : "border-white/5 bg-white/[0.02] hover:bg-white/[0.04]"}`}>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleTask(task.id)}
                          className="mt-1 h-4 w-4 accent-cyan-300"
                        />
                        <span className="min-w-0 flex-1">
                          <span className={`block text-sm font-semibold ${checked ? "text-cyan-100" : "text-slate-200"}`}>
                            {task.title}
                          </span>
                          <span className="mt-1 block text-xs leading-5 text-slate-400">{task.detail}</span>
                        </span>
                        {checked && <span className="text-sm text-cyan-300">✓</span>}
                      </label>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>

        <div className="mt-7 rounded-2xl border border-white/10 bg-[#0D1425] p-5">
          <h2 className="font-bold">Keep your momentum</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Focus on consistency, build projects as you learn, and only mark a task complete after you have practised it.
          </p>
          <Link href="/assessment" className="mt-4 inline-flex rounded-xl bg-cyan-300 px-4 py-2.5 text-sm font-bold text-slate-950 hover:bg-cyan-200">
            Review career assessment
          </Link>
        </div>
      </div>
    </main>
  );
}
