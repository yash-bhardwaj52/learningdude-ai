
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const skills = [
  "HTML & CSS",
  "JavaScript",
  "React",
  "TypeScript",
  "Python",
  "SQL",
  "Java / C++",
  "Git & GitHub",
  "Node.js & APIs",
  "Databases",
  "Statistics",
  "Machine Learning",
  "Excel / Sheets",
  "Figma / UI Design",
  "Cloud & DevOps",
];

const interests = [
  "Building websites and interfaces",
  "Backend logic and APIs",
  "Data analysis and patterns",
  "AI and automation",
  "Designing user experiences",
  "Cloud and infrastructure",
  "Building complete products",
  "Math and research",
];

const careers = [
  {
    id: "frontend",
    title: "Frontend Developer",
    description: "Build websites and interactive user interfaces.",
    skills: ["HTML & CSS", "JavaScript", "React", "TypeScript", "Git & GitHub", "Figma / UI Design"],
    interests: ["Building websites and interfaces", "Designing user experiences", "Building complete products"],
  },
  {
    id: "backend",
    title: "Backend Developer",
    description: "Build APIs, server logic and database systems.",
    skills: ["Node.js & APIs", "SQL", "Databases", "Python", "Java / C++", "Git & GitHub"],
    interests: ["Backend logic and APIs", "Cloud and infrastructure", "Building complete products"],
  },
  {
    id: "fullstack",
    title: "Full Stack Developer",
    description: "Develop complete applications from frontend to backend.",
    skills: ["HTML & CSS", "JavaScript", "React", "Node.js & APIs", "SQL", "Databases", "TypeScript"],
    interests: ["Building complete products", "Building websites and interfaces", "Backend logic and APIs"],
  },
  {
    id: "aiml",
    title: "AI/ML Engineer",
    description: "Build intelligent applications using data and machine learning.",
    skills: ["Python", "Machine Learning", "Statistics", "SQL"],
    interests: ["AI and automation", "Math and research", "Data analysis and patterns"],
  },
  {
    id: "data",
    title: "Data Analyst",
    description: "Turn data into useful insights and decisions.",
    skills: ["SQL", "Excel / Sheets", "Python", "Statistics"],
    interests: ["Data analysis and patterns", "Math and research"],
  },
  {
    id: "datascientist",
    title: "Data Scientist",
    description: "Use statistics and machine learning to understand data.",
    skills: ["Python", "Statistics", "Machine Learning", "SQL"],
    interests: ["Data analysis and patterns", "Math and research", "AI and automation"],
  },
  {
    id: "uiux",
    title: "UI/UX Designer",
    description: "Design useful, accessible and attractive digital experiences.",
    skills: ["Figma / UI Design", "HTML & CSS"],
    interests: ["Designing user experiences", "Building websites and interfaces"],
  },
  {
    id: "devops",
    title: "Cloud / DevOps Engineer",
    description: "Automate deployments and keep applications reliable.",
    skills: ["Cloud & DevOps", "Git & GitHub", "Python"],
    interests: ["Cloud and infrastructure", "Backend logic and APIs"],
  },
];

type Answers = {
  education: string;
  experience: string;
  skills: string[];
  interests: string[];
  preferred: string;
  hours: string;
  goal: string;
};

type Result = {
  answers: Answers;
  ranking: { id: string; title: string; description: string; match: number }[];
  strengths: string[];
  gaps: string[];
  completedAt: string;
};

const initialAnswers: Answers = {
  education: "",
  experience: "",
  skills: [],
  interests: [],
  preferred: "",
  hours: "",
  goal: "",
};

function calculateResults(answers: Answers): Result {
  const ranking = careers
    .map((career) => {
      const skillScore = answers.skills.filter((s) => career.skills.includes(s)).length;
      const interestScore = answers.interests.filter((i) => career.interests.includes(i)).length;
      const preferenceBonus = answers.preferred === career.id ? 2 : 0;
      const total = skillScore * 2 + interestScore * 3 + preferenceBonus;
      const maximum = Math.max(1, career.skills.length * 2 + 9 + 2);
      const match = Math.min(99, Math.round((total / maximum) * 100));

      return {
        id: career.id,
        title: career.title,
        description: career.description,
        match,
        total,
      };
    })
    .sort((a, b) => b.total - a.total)
    .map(({ total: _total, ...career }) => career);

  const bestCareer = careers.find((c) => c.id === ranking[0].id)!;

  const strengths = answers.skills.filter((skill) =>
    bestCareer.skills.includes(skill),
  );

  const gaps = bestCareer.skills.filter(
    (skill) => !answers.skills.includes(skill),
  );

  return {
    answers,
    ranking,
    strengths,
    gaps,
    completedAt: new Date().toISOString(),
  };
}

export default function AssessmentPage() {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Answers>(initialAnswers);
  const [result, setResult] = useState<Result | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("learningdude-assessment");
      if (saved) {
        const parsed = JSON.parse(saved) as Result;
        if (parsed.answers && parsed.ranking?.length) {
          setResult(parsed);
        }
      }
    } catch {
      // Ignore invalid saved data.
    }
    setLoaded(true);
  }, []);

  function update<K extends keyof Answers>(key: K, value: Answers[K]) {
    setAnswers((previous) => ({ ...previous, [key]: value }));
  }

  function toggleItem(
    key: "skills" | "interests",
    value: string,
    maximum: number,
  ) {
    const current = answers[key];

    if (current.includes(value)) {
      update(key, current.filter((item) => item !== value));
    } else if (current.length < maximum) {
      update(key, [...current, value]);
    }
  }

  function finishAssessment() {
    const calculated = calculateResults(answers);
    localStorage.setItem("learningdude-assessment", JSON.stringify(calculated));
    setResult(calculated);
  }

  function startAgain() {
    setAnswers(initialAnswers);
    setResult(null);
    setStep(1);
  }

  if (!loaded) {
    return (
      <main className="min-h-screen bg-slate-950 p-8 text-slate-200">
        Loading your assessment...
      </main>
    );
  }

  const selectedResult = result?.ranking[0];

  return (
    <main className="min-h-screen bg-[#040a18] px-4 py-8 text-slate-100 sm:px-8">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8 flex items-center justify-between gap-4">
          <Link href="/" className="text-sm text-cyan-300 hover:text-cyan-200">
            ← LearningDude AI
          </Link>

          {result && (
            <button
              onClick={startAgain}
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm hover:border-cyan-400"
            >
              Retake assessment
            </button>
          )}
        </header>

        {!result ? (
          <>
            <div className="mb-8">
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
                Career discovery
              </p>
              <h1 className="text-3xl font-bold sm:text-4xl">
                Find your tech career path
              </h1>
              <p className="mt-3 max-w-2xl text-slate-400">
                Tell us about your current skills, interests and goals. We will
                suggest career paths you can explore.
              </p>
            </div>

            <div className="mb-8">
              <div className="mb-2 flex justify-between text-sm text-slate-400">
                <span>Step {step} of 4</span>
                <span>{step * 25}% complete</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all"
                  style={{ width: `${step * 25}%` }}
                />
              </div>
            </div>

            <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 sm:p-8">
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold">Your background</h2>
                    <p className="mt-1 text-sm text-slate-400">
                      Start with your education and current experience.
                    </p>
                  </div>

                  <Field label="Education">
                    <select
                      value={answers.education}
                      onChange={(e) => update("education", e.target.value)}
                      className="assessment-input"
                    >
                      <option value="">Select education</option>
                      <option>High school</option>
                      <option>Diploma</option>
                      <option>Undergraduate in progress</option>
                      <option>BCA / BSc / BTech graduate</option>
                      <option>Postgraduate</option>
                      <option>Self-taught / other</option>
                    </select>
                  </Field>

                  <Field label="Your current experience">
                    <div className="grid gap-3 sm:grid-cols-3">
                      {[
                        ["beginner", "Beginner", "Starting from scratch"],
                        ["practice", "Some practice", "A few small projects"],
                        ["experienced", "Experienced", "Internship or larger projects"],
                      ].map(([value, title, description]) => (
                        <Choice
                          key={value}
                          active={answers.experience === value}
                          onClick={() => update("experience", value)}
                          title={title}
                          description={description}
                        />
                      ))}
                    </div>
                  </Field>

                  <Field label="Your main goal">
                    <select
                      value={answers.goal}
                      onChange={(e) => update("goal", e.target.value)}
                      className="assessment-input"
                    >
                      <option value="">Select your goal</option>
                      <option>Get my first tech job</option>
                      <option>Get an internship</option>
                      <option>Build projects and a portfolio</option>
                      <option>Switch to a different tech career</option>
                      <option>Learn new skills</option>
                    </select>
                  </Field>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-xl font-bold">Your current skills</h2>
                    <p className="mt-1 text-sm text-slate-400">
                      Choose up to 10 skills you have some knowledge of. It is
                      okay to select just one or two.
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {skills.map((skill) => (
                      <Choice
                        key={skill}
                        active={answers.skills.includes(skill)}
                        onClick={() => toggleItem("skills", skill, 10)}
                        title={skill}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-slate-400">
                    Selected: {answers.skills.length}/10
                  </p>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-xl font-bold">What interests you?</h2>
                    <p className="mt-1 text-sm text-slate-400">
                      Select up to 3 areas you would enjoy working in.
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {interests.map((interest) => (
                      <Choice
                        key={interest}
                        active={answers.interests.includes(interest)}
                        onClick={() => toggleItem("interests", interest, 3)}
                        title={interest}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-slate-400">
                    Selected: {answers.interests.length}/3
                  </p>

                  <Field label="Is there a career you already prefer?">
                    <select
                      value={answers.preferred}
                      onChange={(e) => update("preferred", e.target.value)}
                      className="assessment-input"
                    >
                      <option value="">No preference yet</option>
                      {careers.map((career) => (
                        <option key={career.id} value={career.id}>
                          {career.title}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold">Your learning plan</h2>
                    <p className="mt-1 text-sm text-slate-400">
                      Let us know how much time you can spend learning.
                    </p>
                  </div>

                  <Field label="Daily study time">
                    <div className="grid gap-3 sm:grid-cols-2">
                      {[
                        "Under 30 minutes",
                        "30–60 minutes",
                        "1–2 hours",
                        "2+ hours",
                      ].map((hours) => (
                        <Choice
                          key={hours}
                          active={answers.hours === hours}
                          onClick={() => update("hours", hours)}
                          title={hours}
                        />
                      ))}
                    </div>
                  </Field>

                  <div className="rounded-xl border border-cyan-900 bg-cyan-950/30 p-4 text-sm text-cyan-100">
                    Your recommendation will be based on the skills and
                    interests you selected. You can retake the assessment
                    whenever you want.
                  </div>
                </div>
              )}

              <div className="mt-8 flex items-center justify-between border-t border-slate-800 pt-5">
                <button
                  type="button"
                  onClick={() => setStep((s) => Math.max(1, s - 1))}
                  disabled={step === 1}
                  className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold hover:border-slate-500 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  Back
                </button>

                {step < 4 ? (
                  <button
                    type="button"
                    onClick={() => setStep((s) => Math.min(4, s + 1))}
                    disabled={
                      (step === 1 &&
                        (!answers.education ||
                          !answers.experience ||
                          !answers.goal)) ||
                      (step === 2 && answers.skills.length === 0) ||
                      (step === 3 && answers.interests.length === 0)
                    }
                    className="rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-6 py-3 text-sm font-bold text-slate-950 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Continue →
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={finishAssessment}
                    disabled={!answers.hours}
                    className="rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-6 py-3 text-sm font-bold text-slate-950 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Get my results
                  </button>
                )}
              </div>
            </section>
          </>
        ) : (
          <div className="space-y-6">
            <section className="rounded-2xl border border-cyan-800/60 bg-gradient-to-br from-cyan-950/60 to-slate-900 p-6 sm:p-9">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
                Your career assessment
              </p>
              <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
                Your next step starts here.
              </h1>
              <p className="mt-3 text-slate-300">
                Based on your answers, this is the career path to explore first.
              </p>

              <div className="mt-6 rounded-xl border border-white/10 bg-slate-950/50 p-5">
                <p className="text-sm text-cyan-200">Top recommendation</p>
                <h2 className="mt-2 text-2xl font-bold">
                  {selectedResult?.title}
                </h2>
                <p className="mt-2 text-slate-300">
                  {selectedResult?.description}
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full bg-cyan-400"
                      style={{ width: `${selectedResult?.match ?? 0}%` }}
                    />
                  </div>
                  <strong className="text-cyan-300">
                    {selectedResult?.match}% match
                  </strong>
                </div>
              </div>
              <p className="mt-4 text-xs text-slate-400">
                This is a rule-based estimate, not a guarantee of career
                suitability or job success.
              </p>
            </section>

            <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 sm:p-7">
              <h2 className="text-xl font-bold">Your career matches</h2>
              <div className="mt-5 space-y-5">
                {result.ranking.map((career, index) => (
                  <div key={career.id}>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <span className="font-medium">
                        {index + 1}. {career.title}
                      </span>
                      <span className="text-sm font-bold text-cyan-300">
                        {career.match}%
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
                        style={{ width: `${career.match}%` }}
                      />
                    </div>
                    <p className="mt-1 text-sm text-slate-400">
                      {career.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <div className="grid gap-5 sm:grid-cols-2">
              <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
                <h2 className="text-lg font-bold">Your strengths</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {result.strengths.length ? (
                    result.strengths.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-emerald-800 bg-emerald-950/60 px-3 py-1.5 text-sm text-emerald-200"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-slate-400">
                      You can start with beginner-friendly lessons and build
                      your first skills.
                    </p>
                  )}
                </div>
              </section>

              <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
                <h2 className="text-lg font-bold">Skills to explore next</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {result.gaps.slice(0, 5).length ? (
                    result.gaps.slice(0, 5).map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-amber-800 bg-amber-950/50 px-3 py-1.5 text-sm text-amber-200"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-slate-400">
                      Keep practising your current skills with real projects.
                    </p>
                  )}
                </div>
              </section>
            </div>

            <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 sm:p-7">
              <h2 className="text-xl font-bold">Your next steps</h2>
              <ol className="mt-5 space-y-4">
                <li className="flex gap-3">
                  <StepNumber n={1} />
                  <div>
                    <strong>Learn the fundamentals</strong>
                    <p className="mt-1 text-sm text-slate-400">
                      Focus on one core skill before jumping between multiple
                      technologies.
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <StepNumber n={2} />
                  <div>
                    <strong>Build a small project</strong>
                    <p className="mt-1 text-sm text-slate-400">
                      Apply what you learn in a practical project and publish
                      it on GitHub.
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <StepNumber n={3} />
                  <div>
                    <strong>Follow a consistent routine</strong>
                    <p className="mt-1 text-sm text-slate-400">
                      Your available study time: {result.answers.hours} per day.
                      Set a realistic weekly target.
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <StepNumber n={4} />
                  <div>
                    <strong>Work towards your goal</strong>
                    <p className="mt-1 text-sm text-slate-400">
                      {result.answers.goal}. Track your progress and improve
                      your portfolio as you learn.
                    </p>
                  </div>
                </li>
              </ol>
            </section>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={startAgain}
                className="rounded-xl border border-slate-700 px-5 py-3 font-semibold hover:border-cyan-400"
              >
                Retake assessment
              </button>
              <Link
                href="/"
                className="rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-3 font-bold text-slate-950"
              >
                Back to login
              </Link>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        .assessment-input {
          width: 100%;
          border: 1px solid #334155;
          border-radius: 12px;
          background: #080f20;
          color: #f1f5f9;
          padding: 12px 14px;
          outline: none;
        }
        .assessment-input:focus {
          border-color: #22d3ee;
          box-shadow: 0 0 0 2px rgb(34 211 238 / 15%);
        }
      `}</style>
    </main>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-slate-200">
        {label}
      </label>
      {children}
    </div>
  );
}

function Choice({
  active,
  onClick,
  title,
  description,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  description?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-xl border p-4 text-left transition ${
        active
          ? "border-cyan-400 bg-cyan-950/50"
          : "border-slate-700 bg-slate-950/50 hover:border-slate-500"
      }`}
    >
      <span className="flex items-center gap-2 font-semibold">
        <span
          className={`grid h-5 w-5 shrink-0 place-items-center rounded-md border text-xs ${
            active
              ? "border-cyan-400 bg-cyan-400 text-slate-950"
              : "border-slate-600"
          }`}
        >
          {active ? "✓" : ""}
        </span>
        {title}
      </span>
      {description && (
        <span className="mt-2 block pl-7 text-sm text-slate-400">
          {description}
        </span>
      )}
    </button>
  );
}

function StepNumber({ n }: { n: number }) {
  return (
    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-cyan-950 font-bold text-cyan-300">
      {n}
    </span>
  );
}
