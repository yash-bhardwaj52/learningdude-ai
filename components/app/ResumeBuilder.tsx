
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type ResumeForm = {
  name: string;
  role: string;
  email: string;
  phone: string;
  location: string;
  github: string;
  linkedin: string;
  summary: string;
  skills: string;
  education: string;
  projects: string;
};

const initialForm: ResumeForm = {
  name: "",
  role: "Software Developer",
  email: "",
  phone: "",
  location: "",
  github: "",
  linkedin: "",
  summary: "",
  skills: "HTML, CSS, JavaScript, React, Git, GitHub",
  education: "Bachelor of Computer Applications (BCA)",
  projects: "",
};

const inputClass =
  "mt-1 w-full rounded-xl border border-white/10 bg-[#080F1E] px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-300";

export default function ResumeBuilder() {
  const [form, setForm] = useState<ResumeForm>(initialForm);
  const [formLoaded, setFormLoaded] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("learningdude-resume");

      if (saved) {
        const parsed: unknown = JSON.parse(saved);

        if (
          parsed &&
          typeof parsed === "object" &&
          !Array.isArray(parsed)
        ) {
          const data = parsed as Partial<ResumeForm>;

          setForm((previous) => {
            const restored = { ...previous };

            for (const key of Object.keys(previous) as (keyof ResumeForm)[]) {
              if (typeof data[key] === "string") {
                restored[key] = data[key] as string;
              }
            }

            return restored;
          });
        }
      }
    } catch {
      // Keep the default form if saved data is invalid.
    } finally {
      setFormLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!formLoaded) return;

    try {
      localStorage.setItem("learningdude-resume", JSON.stringify(form));
      setSavedMessage("Your details are saved in this browser.");
    } catch {
      setSavedMessage("Unable to save. Check your browser storage.");
    }
  }, [form, formLoaded]);

  function update(field: keyof ResumeForm, value: string) {
    setForm((previous) => ({ ...previous, [field]: value }));
  }

  function clearForm() {
    const confirmed = window.confirm(
      "Clear all resume details? This cannot be undone."
    );

    if (!confirmed) return;

    setForm(initialForm);

    try {
      localStorage.removeItem("learningdude-resume");
      setSavedMessage("Resume details cleared.");
    } catch {
      setSavedMessage("Form cleared, but saved browser data could not be removed.");
    }
  }

  const projects = form.projects
    .split("\n")
    .map((project) => project.trim())
    .filter(Boolean);

  return (
    <main className="min-h-screen bg-[#070B18] px-4 py-6 text-white sm:px-7 lg:px-9">
      <style jsx global>{`
        @page {
          size: A4;
          margin: 12mm;
        }

        @media print {
          body {
            background: white !important;
            color: black !important;
          }

          body * {
            visibility: hidden !important;
          }

          #resume-print,
          #resume-print * {
            visibility: visible !important;
          }

          #resume-print {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            min-height: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            border-radius: 0 !important;
            background: white !important;
            color: black !important;
            box-shadow: none !important;
          }

          #resume-print h1,
          #resume-print h2,
          #resume-print h3,
          #resume-print p,
          #resume-print li,
          #resume-print span {
            color: black !important;
          }

          .resume-no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="mx-auto max-w-6xl">
        <Link
          href="/dashboard"
          className="resume-no-print text-sm text-cyan-300"
        >
          ← Back to dashboard
        </Link>

        <div className="resume-no-print mt-5">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">
            Career tools
          </p>

          <h1 className="mt-2 text-3xl font-black">Resume Builder</h1>

          <p className="mt-2 text-sm text-slate-400">
            Fill in your real details and preview your resume instantly.
          </p>

          <p
            aria-live="polite"
            className="mt-2 text-xs text-emerald-300"
          >
            {formLoaded ? savedMessage : "Loading saved resume..."}
          </p>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="resume-no-print rounded-2xl border border-white/10 bg-[#0D1425] p-5">
            <h2 className="mb-5 text-lg font-bold">Your information</h2>

            <div className="space-y-4">
              <label className="block text-sm text-slate-300">
                Full name *
                <input
                  required
                  autoComplete="name"
                  className={inputClass}
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="Your full name"
                />
              </label>

              <label className="block text-sm text-slate-300">
                Target role
                <input
                  className={inputClass}
                  value={form.role}
                  onChange={(e) => update("role", e.target.value)}
                  placeholder="Software Developer"
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm text-slate-300">
                  Email
                  <input
                    type="email"
                    autoComplete="email"
                    className={inputClass}
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    placeholder="you@example.com"
                  />
                </label>

                <label className="block text-sm text-slate-300">
                  Phone
                  <input
                    type="tel"
                    autoComplete="tel"
                    className={inputClass}
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    placeholder="Phone number"
                  />
                </label>
              </div>

              <label className="block text-sm text-slate-300">
                City / Location
                <input
                  autoComplete="address-level2"
                  className={inputClass}
                  value={form.location}
                  onChange={(e) => update("location", e.target.value)}
                  placeholder="City, India"
                />
              </label>

              <label className="block text-sm text-slate-300">
                GitHub URL
                <input
                  type="url"
                  className={inputClass}
                  value={form.github}
                  onChange={(e) => update("github", e.target.value)}
                  placeholder="https://github.com/yourusername"
                />
              </label>

              <label className="block text-sm text-slate-300">
                LinkedIn URL
                <input
                  type="url"
                  className={inputClass}
                  value={form.linkedin}
                  onChange={(e) => update("linkedin", e.target.value)}
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </label>

              <label className="block text-sm text-slate-300">
                Professional summary
                <textarea
                  className={inputClass}
                  rows={4}
                  value={form.summary}
                  onChange={(e) => update("summary", e.target.value)}
                  placeholder="Write a short, honest professional introduction."
                />
              </label>

              <label className="block text-sm text-slate-300">
                Skills (comma separated)
                <textarea
                  className={inputClass}
                  rows={3}
                  value={form.skills}
                  onChange={(e) => update("skills", e.target.value)}
                  placeholder="JavaScript, React, Git..."
                />
              </label>

              <label className="block text-sm text-slate-300">
                Education
                <textarea
                  className={inputClass}
                  rows={3}
                  value={form.education}
                  onChange={(e) => update("education", e.target.value)}
                  placeholder="Degree, college, graduation year..."
                />
              </label>

              <label className="block text-sm text-slate-300">
                Projects (one project per line)
                <textarea
                  className={inputClass}
                  rows={5}
                  value={form.projects}
                  onChange={(e) => update("projects", e.target.value)}
                  placeholder={
                    "LearningDude AI — Career guidance platform using Next.js and TypeScript.\nWeather App — Weather information using an API."
                  }
                />
              </label>

              <button
                type="button"
                onClick={() => {
                  if (!form.name.trim()) {
                    window.alert("Please enter your full name first.");
                    return;
                  }

                  window.print();
                }}
                disabled={!formLoaded || !form.name.trim()}
                className="w-full rounded-xl bg-cyan-300 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Print / Save Resume as PDF
              </button>

              <button
                type="button"
                onClick={clearForm}
                disabled={!formLoaded}
                className="w-full rounded-xl border border-red-400/20 px-4 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-400/10 disabled:opacity-40"
              >
                Clear Resume Details
              </button>

              <p className="text-xs leading-5 text-slate-500">
                Your details are saved in this browser, not sent to a server.
                To download a PDF, choose “Save as PDF” in the print dialog.
              </p>
            </div>
          </section>

          <section
            id="resume-print"
            className="min-h-[700px] rounded-2xl border border-white/10 bg-white p-6 text-slate-900 shadow-xl sm:p-10"
          >
            <header className="border-b-2 border-slate-800 pb-5">
              <h1 className="break-words text-3xl font-black tracking-tight">
                {form.name || "Your Name"}
              </h1>

              <p className="mt-1 text-lg font-semibold text-slate-700">
                {form.role || "Target Role"}
              </p>

              <p className="mt-3 break-words text-xs leading-6 text-slate-600">
                {[
                  form.email,
                  form.phone,
                  form.location,
                  form.github,
                  form.linkedin,
                ]
                  .filter(Boolean)
                  .join(" | ") ||
                  "Email · Phone · Location · GitHub · LinkedIn"}
              </p>
            </header>

            <section className="mt-6">
              <h2 className="border-b border-slate-300 pb-2 text-sm font-extrabold uppercase tracking-widest">
                Professional Summary
              </h2>

              <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">
                {form.summary ||
                  "Add a concise summary of your background, strengths and career goals."}
              </p>
            </section>

            <section className="mt-6">
              <h2 className="border-b border-slate-300 pb-2 text-sm font-extrabold uppercase tracking-widest">
                Technical Skills
              </h2>

              <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">
                {form.skills || "Add your relevant skills"}
              </p>
            </section>

            <section className="mt-6">
              <h2 className="border-b border-slate-300 pb-2 text-sm font-extrabold uppercase tracking-widest">
                Projects
              </h2>

              {projects.length > 0 ? (
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-700">
                  {projects.map((project, index) => (
                    <li key={`${index}-${project}`} className="break-words">
                      {project}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-slate-500">
                  Add your projects and explain your contribution.
                </p>
              )}
            </section>

            <section className="mt-6">
              <h2 className="border-b border-slate-300 pb-2 text-sm font-extrabold uppercase tracking-widest">
                Education
              </h2>

              <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">
                {form.education || "Add your education details"}
              </p>
            </section>
          </section>
        </div>
      </div>
    </main>
  );
}
