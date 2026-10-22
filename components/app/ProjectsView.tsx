
"use client";

import { useEffect, useMemo, useState } from "react";

type ProjectStatus = "Idea" | "In Progress" | "Completed";

type Project = {
  id: string;
  name: string;
  description: string;
  techStack: string;
  status: ProjectStatus;
  github: string;
  demo: string;
  createdAt: number;
};

const STORAGE_KEY = "learningdude-projects";

const emptyForm = {
  name: "",
  description: "",
  techStack: "",
  status: "Idea" as ProjectStatus,
  github: "",
  demo: "",
};

export default function ProjectsView() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (Array.isArray(parsed)) setProjects(parsed as Project[]);
      }
    } catch {
      console.error("Could not load saved projects.");
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    }
  }, [projects, loaded]);

  const counts = useMemo(
    () => ({
      total: projects.length,
      idea: projects.filter((p) => p.status === "Idea").length,
      progress: projects.filter((p) => p.status === "In Progress").length,
      completed: projects.filter((p) => p.status === "Completed").length,
    }),
    [projects]
  );

  const filteredProjects = useMemo(() => {
    const term = search.trim().toLowerCase();

    return projects.filter((project) => {
      const matchesSearch =
        project.name.toLowerCase().includes(term) ||
        project.description.toLowerCase().includes(term) ||
        project.techStack.toLowerCase().includes(term);

      const matchesStatus = filter === "All" || project.status === filter;

      return matchesSearch && matchesStatus;
    });
  }, [projects, search, filter]);

  function openAddForm() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function openEditForm(project: Project) {
    setEditingId(project.id);
    setForm({
      name: project.name,
      description: project.description,
      techStack: project.techStack,
      status: project.status,
      github: project.github,
      demo: project.demo,
    });
    setShowForm(true);
  }

  function saveProject() {
    if (!form.name.trim()) {
      alert("Please enter a project name.");
      return;
    }

    if (editingId) {
      setProjects((previous) =>
        previous.map((project) =>
          project.id === editingId
            ? { ...project, ...form, name: form.name.trim() }
            : project
        )
      );
    } else {
      const newProject: Project = {
        ...form,
        name: form.name.trim(),
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        createdAt: Date.now(),
      };
      setProjects((previous) => [newProject, ...previous]);
    }

    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  }

  function deleteProject(id: string) {
    if (!window.confirm("Are you sure you want to delete this project?")) {
      return;
    }
    setProjects((previous) => previous.filter((project) => project.id !== id));
  }

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-[#0B1020] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-violet-400";

  const statuses: ProjectStatus[] = ["Idea", "In Progress", "Completed"];

  function statusStyle(status: ProjectStatus) {
    if (status === "Completed") {
      return "border-emerald-400/20 bg-emerald-400/10 text-emerald-300";
    }
    if (status === "In Progress") {
      return "border-blue-400/20 bg-blue-400/10 text-blue-300";
    }
    return "border-amber-400/20 bg-amber-400/10 text-amber-300";
  }

  return (
    <main className="min-h-screen bg-[#070B18] px-4 py-8 text-white sm:px-8 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-medium text-violet-300">
              YOUR WORKSPACE
            </p>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              My Projects
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">
              Organize your ideas, track development progress, and keep your
              project links in one place.
            </p>
          </div>

          <button
            onClick={openAddForm}
            className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold transition hover:bg-violet-500"
          >
            + Add Project
          </button>
        </div>

        <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            { label: "Total Projects", value: counts.total, icon: "▣" },
            { label: "Ideas", value: counts.idea, icon: "✦" },
            { label: "In Progress", value: counts.progress, icon: "↗" },
            { label: "Completed", value: counts.completed, icon: "✓" },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm text-slate-400">{item.label}</span>
                <span className="text-lg text-violet-300">{item.icon}</span>
              </div>
              <p className="text-3xl font-bold">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search projects or technologies..."
            className={inputClass}
          />

          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            className={`${inputClass} sm:max-w-52`}
          >
            <option value="All">All statuses</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {showForm && (
          <div className="mb-8 rounded-2xl border border-violet-400/20 bg-[#101629] p-5 sm:p-7">
            <div className="mb-6 flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold">
                {editingId ? "Edit Project" : "Create a Project"}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="rounded-lg px-3 py-2 text-sm text-slate-400 hover:bg-white/5 hover:text-white"
              >
                Cancel
              </button>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="text-sm text-slate-300">
                Project Name *
                <input
                  value={form.name}
                  onChange={(event) =>
                    setForm({ ...form, name: event.target.value })
                  }
                  placeholder="e.g. Weather App"
                  className={`${inputClass} mt-2`}
                  maxLength={100}
                />
              </label>

              <label className="text-sm text-slate-300">
                Technologies
                <input
                  value={form.techStack}
                  onChange={(event) =>
                    setForm({ ...form, techStack: event.target.value })
                  }
                  placeholder="React, TypeScript, Tailwind"
                  className={`${inputClass} mt-2`}
                  maxLength={200}
                />
              </label>

              <label className="text-sm text-slate-300">
                Status
                <select
                  value={form.status}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      status: event.target.value as ProjectStatus,
                    })
                  }
                  className={`${inputClass} mt-2`}
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-sm text-slate-300">
                GitHub Repository URL
                <input
                  value={form.github}
                  onChange={(event) =>
                    setForm({ ...form, github: event.target.value })
                  }
                  placeholder="https://github.com/..."
                  className={`${inputClass} mt-2`}
                  type="url"
                />
              </label>

              <label className="text-sm text-slate-300 sm:col-span-2">
                Live Demo URL
                <input
                  value={form.demo}
                  onChange={(event) =>
                    setForm({ ...form, demo: event.target.value })
                  }
                  placeholder="https://your-project.vercel.app"
                  className={`${inputClass} mt-2`}
                  type="url"
                />
              </label>

              <label className="text-sm text-slate-300 sm:col-span-2">
                Project Description
                <textarea
                  value={form.description}
                  onChange={(event) =>
                    setForm({ ...form, description: event.target.value })
                  }
                  placeholder="What does your project do?"
                  className={`${inputClass} mt-2 min-h-24 resize-y`}
                  maxLength={1000}
                />
              </label>
            </div>

            <button
              onClick={saveProject}
              className="mt-6 rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold hover:bg-violet-500"
            >
              {editingId ? "Save Changes" : "Save Project"}
            </button>
          </div>
        )}

        {!loaded ? (
          <p className="py-12 text-center text-slate-400">
            Loading your projects...
          </p>
        ) : filteredProjects.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 px-6 py-16 text-center">
            <div className="mb-4 text-4xl">▣</div>
            <h2 className="text-xl font-semibold">
              {projects.length === 0
                ? "Your project space is ready"
                : "No matching projects"}
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400">
              {projects.length === 0
                ? "Add your first project and start tracking its progress."
                : "Try another search term or change the status filter."}
            </p>
            {projects.length === 0 && (
              <button
                onClick={openAddForm}
                className="mt-6 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold hover:bg-violet-500"
              >
                + Add Your First Project
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredProjects.map((project) => (
              <article
                key={project.id}
                className="flex flex-col rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 transition hover:border-violet-400/30"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 text-xl text-violet-300">
                    ▣
                  </div>
                  <span
                    className={`rounded-full border px-3 py-1 text-xs ${statusStyle(project.status)}`}
                  >
                    {project.status}
                  </span>
                </div>

                <h2 className="break-words text-lg font-semibold">
                  {project.name}
                </h2>
                <p className="mt-2 min-h-12 whitespace-pre-wrap break-words text-sm leading-6 text-slate-400">
                  {project.description || "No description added yet."}
                </p>

                {project.techStack && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.techStack
                      .split(",")
                      .map((tech) => tech.trim())
                      .filter(Boolean)
                      .map((tech) => (
                        <span
                          key={tech}
                          className="rounded-lg bg-white/[0.06] px-2.5 py-1 text-xs text-slate-300"
                        >
                          {tech}
                        </span>
                      ))}
                  </div>
                )}

                <div className="mt-auto flex flex-wrap gap-4 border-t border-white/[0.08] pt-5 mt-5 text-sm">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noreferrer"
                      className="text-violet-300 hover:text-violet-200"
                    >
                      GitHub ↗
                    </a>
                  )}
                  {project.demo && (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noreferrer"
                      className="text-violet-300 hover:text-violet-200"
                    >
                      Live Demo ↗
                    </a>
                  )}
                  {!project.github && !project.demo && (
                    <span className="text-xs text-slate-500">
                      No links added
                    </span>
                  )}

                  <div className="ml-auto flex gap-3">
                    <button
                      onClick={() => openEditForm(project)}
                      className="text-slate-400 hover:text-white"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteProject(project.id)}
                      className="text-rose-300 hover:text-rose-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        <p className="mt-8 text-center text-xs text-slate-500">
          Your projects are saved in this browser on this device.
        </p>
      </div>
    </main>
  );
}
