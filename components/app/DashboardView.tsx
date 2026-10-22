
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";


type AssessmentData = {
  ranking?: {
    id: string;
    title: string;
    match: number;
  }[];
  strengths?: string[];
  gaps?: string[];
  completedAt?: string;
};

const careerInfo: Record<
  string,
  { title: string; subtitle: string; skills: string[]; roadmap: string[] }
> = {
  frontend: {
    title: "Frontend Developer",
    subtitle: "Build modern, responsive websites and web applications.",
    skills: ["HTML & CSS", "JavaScript", "React.js", "TypeScript", "Git & GitHub"],
    roadmap: [
      "Master HTML and CSS",
      "Learn JavaScript fundamentals",
      "Build projects using React",
      "Learn TypeScript and APIs",
      "Create a portfolio and apply for jobs",
    ],
  },
  software: {
    title: "Software Developer",
    subtitle: "Build a strong foundation in programming and software development.",
    skills: ["Programming", "Data Structures", "OOP", "Git & GitHub", "Problem Solving"],
    roadmap: [
      "Choose a programming language",
      "Learn OOP and core concepts",
      "Practice data structures and algorithms",
      "Build real-world projects",
      "Prepare for technical interviews",
    ],
  },
  data: {
    title: "Data Analyst",
    subtitle: "Turn data into insights and useful business decisions.",
    skills: ["Excel", "SQL", "Python", "Power BI", "Statistics"],
    roadmap: [
      "Learn spreadsheets and data basics",
      "Practice SQL queries",
      "Learn Python for data analysis",
      "Build dashboards and projects",
      "Create a portfolio and apply",
    ],
  },
  ai: {
    title: "AI / Machine Learning",
    subtitle: "Explore artificial intelligence through programming and practical projects.",
    skills: ["Python", "Mathematics", "NumPy & Pandas", "Machine Learning", "AI Projects"],
    roadmap: [
      "Learn Python fundamentals",
      "Understand basic mathematics and statistics",
      "Practice data analysis",
      "Learn machine learning fundamentals",
      "Build and showcase AI projects",
    ],
  },
  beginner: {
    title: "Technology Explorer",
    subtitle: "Explore technology and discover a career that fits your interests.",
    skills: ["Computer Basics", "HTML & CSS", "Programming Basics", "Problem Solving", "Git"],
    roadmap: [
      "Explore different technology careers",
      "Learn basic programming",
      "Try a small web development project",
      "Choose a career direction",
      "Follow a focused learning roadmap",
    ],
  },
};


const courses = [
  {
    title: "HTML & CSS Essentials",
    category: "Web Development",
    level: "Beginner",
    icon: "🎨",
    description: "Learn to create and style responsive web pages.",
    url: "https://www.freecodecamp.org/learn/2022/responsive-web-design/",
  },
  {
    title: "JavaScript Fundamentals",
    category: "Programming",
    level: "Beginner",
    icon: "⚡",
    description: "Understand variables, functions, arrays and DOM basics.",
    url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting",
  },
  {
    title: "React.js for Beginners",
    category: "Frontend Development",
    level: "Beginner",
    icon: "⚛️",
    description: "Build interactive interfaces with reusable components.",
    url: "https://react.dev/learn",
  },
  {
    title: "Git & GitHub",
    category: "Developer Tools",
    level: "Beginner",
    icon: "🐙",
    description: "Learn version control and manage your coding projects.",
    url: "https://skills.github.com/",
  },
  {
    title: "Java Programming",
    category: "Programming",
    level: "Beginner",
    icon: "☕",
    description: "Learn Java syntax, OOP and core programming concepts.",
    url: "https://dev.java/learn/",
  },
];



const opportunities = [
  {
    title: "Frontend Developer Intern",
    company: "Wellfound · Offset",
    type: "Remote",
    skills: "React · JavaScript · TypeScript",
    url: "https://wellfound.com/jobs/4859116-frontend-developer-intern-remote",
  },
  {
    title: "Frontend Developer Intern",
    company: "Wellfound · WhatBytes",
    type: "Remote",
    skills: "React · Next.js · Tailwind CSS",
    url: "https://wellfound.com/jobs/3029813-front-end-developer-intern-remote",
  },
  {
    title: "Frontend Internship Search",
    company: "LinkedIn Jobs",
    type: "Internship",
    skills: "HTML · CSS · JavaScript · React",
    url: "https://in.linkedin.com/jobs/front-end-developer-internship-jobs",
  },
];


function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-5">
      <p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
        {eyebrow}
      </p>
      <h2 className="text-xl font-bold text-white sm:text-2xl">{title}</h2>
      {description && (
        <p className="mt-1 text-sm text-slate-400">{description}</p>
      )}
    </div>
  );
}

export default function DashboardView() {
  const [career, setCareer] = useState("beginner");
  const [name, setName] = useState("Learner");

  const [completedSkills, setCompletedSkills] = useState<string[]>([]);
  const [progressLoaded, setProgressLoaded] = useState(false);

  const [assessmentFound, setAssessmentFound] = useState(false);

  useEffect(() => {
    try {
      const savedAssessment = localStorage.getItem("learningdude-assessment");

      if (savedAssessment) {
        const parsed = JSON.parse(savedAssessment) as AssessmentData;


        const recommendedCareer = parsed.ranking?.[0];

        if (recommendedCareer && careerInfo[recommendedCareer.id]) {
          setCareer(recommendedCareer.id);
          setAssessmentFound(true);
        }

      }

      const savedName =
        localStorage.getItem("learningdude-name") ||
        localStorage.getItem("user-name");

      if (savedName) {
        setName(savedName);
      }
    } catch {
      // Show the default dashboard if saved data is unavailable.
    }

  }, []);

  useEffect(() => {
    try {
      const savedSkills = localStorage.getItem("learningdude-completed-skills");

      if (savedSkills) {
        const parsed: unknown = JSON.parse(savedSkills);

        if (
          Array.isArray(parsed) &&
          parsed.every((skill) => typeof skill === "string")
        ) {
          setCompletedSkills(parsed);
        }
      }
    } catch {
      // Ignore invalid saved progress.
    } finally {
      setProgressLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!progressLoaded) return;

    localStorage.setItem(
      "learningdude-completed-skills",
      JSON.stringify(completedSkills)
    );
  }, [completedSkills, progressLoaded]);


  const selectedCareer = careerInfo[career] ?? careerInfo.beginner;
  const progress = Math.round(
    (completedSkills.length / selectedCareer.skills.length) * 100
  );

  function toggleSkill(skill: string) {
    setCompletedSkills((previous) =>
      previous.includes(skill)
        ? previous.filter((item) => item !== skill)
        : [...previous, skill]
    );
  }

  return (
    <main className="min-h-screen bg-[#070B18] px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Welcome header */}
        <header className="flex flex-col justify-between gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded-lg bg-cyan-400/10 px-3 py-1 text-xs font-bold text-cyan-300">
                LEARNINGDUDE AI
              </span>
              <span className="text-xs text-slate-500">LEARNING DASHBOARD</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Welcome back, {name}! <span aria-hidden="true">👋</span>
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Your career journey starts with one small step today.
            </p>
          </div>

          <Link
            href="/assessment"
            className="inline-flex w-fit items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-5 py-3 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-400/20"
          >
            {assessmentFound ? "Review Assessment ↗" : "Take Career Assessment →"}
          </Link>
        </header>

        {/* Career overview */}
        <section className="relative overflow-hidden rounded-3xl border border-cyan-300/20 bg-gradient-to-br from-[#102747] via-[#101a35] to-[#111126] p-6 sm:p-8">
          <div className="pointer-events-none absolute -right-10 -top-16 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="relative grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-center">
            <div>
              <p className="text-sm font-medium text-cyan-300">
                YOUR CAREER DIRECTION
              </p>
              <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
                {selectedCareer.title}
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
                {selectedCareer.subtitle}
              </p>
              {!assessmentFound && (
                <p className="mt-3 text-xs text-amber-200/90">
                  Complete your career assessment to personalize your
                  recommendations.
                </p>
              )}
              <a
                href="#roadmap"
                className="mt-6 inline-flex rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
              >
                Explore My Roadmap →
              </a>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-slate-400">Learning progress</p>
                  <p className="mt-1 text-3xl font-bold">{progress}%</p>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/10 text-2xl">
                  🚀
                </div>
              </div>
              <div
                className="mt-5 h-2 overflow-hidden rounded-full bg-white/10"
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Skill checklist progress"
              >
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-3 text-xs text-slate-400">
                {completedSkills.length} of {selectedCareer.skills.length}{" "}
                recommended skills checked off
              </p>
            </div>
          </div>
        </section>

        {/* Quick stats */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { icon: "🧭", label: "Career Roadmap", value: "Personalized", note: "Your next steps" },
            { icon: "📚", label: "Learning Resources", value: "3 starter courses", note: "Explore below" },
            { icon: "💼", label: "Career Opportunities", value: "3 examples", note: "Sample listings" },
            { icon: "📄", label: "Resume Builder", value: "Coming next", note: "Build your profile" },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-white/10 bg-[#0D1426] p-5 transition hover:border-cyan-400/30"
            >
              <div className="flex items-start justify-between">
                <p className="text-sm text-slate-400">{item.label}</p>
                <span className="text-xl">{item.icon}</span>
              </div>
              <p className="mt-4 text-lg font-bold text-white">{item.value}</p>
              <p className="mt-1 text-xs text-slate-500">{item.note}</p>
            </div>
          ))}
        </section>

        {/* Roadmap */}
        <section id="roadmap" className="scroll-mt-6">
          <SectionHeading
            eyebrow="Your next steps"
            title="Career Learning Roadmap"
            description="Follow these steps in order. Mark a step complete as you progress."
          />
          <div className="rounded-2xl border border-white/10 bg-[#0D1426] p-5 sm:p-7">
            <div className="space-y-5">
              {selectedCareer.roadmap.map((step, index) => (
                <div key={step} className="flex items-start gap-4">
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${index < completedSkills.length
                        ? "bg-cyan-400 text-slate-950"
                        : "border border-white/10 bg-white/5 text-slate-300"
                      }`}
                  >
                    {index < completedSkills.length ? "✓" : index + 1}
                  </div>
                  <div className="flex-1 border-b border-white/5 pb-5">
                    <p className="font-semibold text-slate-100">{step}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      Step {index + 1} · Learn at your own pace
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Skills */}
        <section id="skills" className="scroll-mt-6">
          <SectionHeading
            eyebrow="Skill development"
            title="Your Skills Checklist"
            description="Tick a skill when you feel comfortable with it. Your progress updates automatically."
          />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {selectedCareer.skills.map((skill) => {
              const checked = completedSkills.includes(skill);

              return (
                <label
                  key={skill}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${checked
                      ? "border-cyan-400/40 bg-cyan-400/10"
                      : "border-white/10 bg-[#0D1426] hover:border-white/20"
                    }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleSkill(skill)}
                    className="h-4 w-4 accent-cyan-400"
                  />
                  <span className="flex-1 text-sm font-medium">{skill}</span>
                  {checked && (
                    <span className="text-xs font-semibold text-cyan-300">
                      Done
                    </span>
                  )}
                </label>
              );
            })}
          </div>
        </section>

        {/* Courses */}
        <section id="courses" className="scroll-mt-6">
          <SectionHeading
            eyebrow="Keep learning"
            title="Recommended Starter Courses"
            description="These are starter recommendations. Course links and lesson tracking can be connected next."
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

            {courses.map((course) => (
              <article
                key={course.title}
                className="rounded-2xl border border-white/10 bg-[#0D1426] p-5 transition hover:-translate-y-1 hover:border-cyan-400/30"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400/20 to-blue-500/20 text-2xl">
                  {course.icon}
                </div>

                <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-cyan-300">
                  {course.category}
                </p>

                <h3 className="mt-2 text-lg font-bold">{course.title}</h3>

                <p className="mt-2 min-h-10 text-sm leading-6 text-slate-400">
                  {course.description}
                </p>

                <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                  <span className="text-xs text-slate-400">{course.level}</span>
                  <span className="text-xs text-slate-500">Free resource</span>
                </div>

                <a
                  href={course.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
                >
                  Start Learning ↗
                </a>
              </article>
            ))}

          </div>
        </section>

        {/* Projects */}
        <section id="projects" className="scroll-mt-6">
          <SectionHeading
            eyebrow="Learn by building"
            title="Projects to Practice"
            description="Practical projects help you apply skills and build a portfolio."
          />
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { icon: "🌦️", title: "Weather App", detail: "Fetch and display weather data from an API." },
              { icon: "📝", title: "Personal Portfolio", detail: "Showcase your skills, projects and contact details." },
              { icon: "📊", title: "Learning Tracker", detail: "Track lessons, completed skills and weekly goals." },
            ].map((project, index) => (
              <div
                key={project.title}
                className="rounded-2xl border border-white/10 bg-[#0D1426] p-5"
              >
                <span className="text-2xl">{project.icon}</span>
                <p className="mt-4 text-xs text-cyan-300">PROJECT {index + 1}</p>
                <h3 className="mt-1 font-bold">{project.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {project.detail}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Jobs */}
        <section id="jobs" className="scroll-mt-6">
          <SectionHeading
            eyebrow="Career opportunities"
            title="Jobs & Internships"
            description="Example roles and skill requirements. These are not live or verified vacancies."
          />
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0D1426]">

            {opportunities.map((job, index) => (
              <div
                key={`${job.title}-${index}`}
                className={`flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between ${index !== opportunities.length - 1
                    ? "border-b border-white/10"
                    : ""
                  }`}
              >
                <div>
                  <h3 className="font-bold">{job.title}</h3>

                  <p className="mt-1 text-sm text-slate-400">
                    {job.company}
                  </p>

                  <p className="mt-2 text-xs text-slate-500">
                    Skills: {job.skills}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <span className="w-fit rounded-lg border border-cyan-400/20 bg-cyan-400/10 px-3 py-2 text-xs font-semibold text-cyan-200">
                    {job.type}
                  </span>

                  <a
                    href={job.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    Explore & Apply ↗
                  </a>
                </div>
              </div>
            ))}
          </div>

        </section>

        {/* Resume */}
        <section id="resume" className="scroll-mt-6">
          <div className="flex flex-col gap-5 rounded-2xl border border-violet-400/20 bg-gradient-to-r from-violet-500/10 to-blue-500/10 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-300">
                Resume studio
              </p>
              <h2 className="mt-2 text-2xl font-bold">Your next opportunity starts with your resume.</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                The Resume Builder will help you organize your education, skills,
                projects and experience into a professional resume.
              </p>
            </div>
            <span className="w-fit shrink-0 rounded-xl border border-violet-300/20 bg-violet-300/10 px-4 py-3 text-sm font-semibold text-violet-200">
              Coming next
            </span>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 py-6 text-center text-xs text-slate-500">
          LearningDude AI · Build your skills. Create your future.
        </footer>
      </div>
    </main>
  );
}
