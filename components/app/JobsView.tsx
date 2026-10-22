
"use client";

import { useEffect, useMemo, useState } from "react";

type ApplicationStatus =
  | "Interested"
  | "Applied"
  | "Interview"
  | "Offer"
  | "Rejected";

type Job = {
  id: string;
  role: string;
  company: string;
  location: string;
  type: string;
  status: ApplicationStatus;
  link: string;
  notes: string;
  createdAt: number;
};

const STORAGE_KEY = "learningdude-jobs";

const emptyForm = {
  role: "",
  company: "",
  location: "",
  type: "Internship",
  status: "Interested" as ApplicationStatus,
  link: "",
  notes: "",
};

const statuses: ApplicationStatus[] = [
  "Interested",
  "Applied",
  "Interview",
  "Offer",
  "Rejected",
];

export default function JobsView() {
  const [jobs, setJobs] = useState<Job[]>([]);
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
        if (Array.isArray(parsed)) setJobs(parsed as Job[]);
      }
    } catch {
      console.error("Could not load saved job applications.");
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
    }
  }, [jobs, loaded]);

  const counts = useMemo(
    () => ({
      total: jobs.length,
      applied: jobs.filter((j) => j.status === "Applied").length,
      interviews: jobs.filter((j) => j.status === "Interview").length,
      offers: jobs.filter((j) => j.status === "Offer").length,
    }),
    [jobs]
  );

  const filteredJobs = useMemo(() => {
    const term = search.trim().toLowerCase();

    return jobs.filter((job) => {
      const matchesSearch =
        job.role.toLowerCase().includes(term) ||
        job.company.toLowerCase().includes(term) ||
        job.location.toLowerCase().includes(term);

      return matchesSearch && (filter === "All" || job.status === filter);
    });
  }, [jobs, search, filter]);

  function openAddForm() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function openEditForm(job: Job) {
    setEditingId(job.id);
    setForm({
      role: job.role,
      company: job.company,
      location: job.location,
      type: job.type,
      status: job.status,
      link: job.link,
      notes: job.notes,
    });
    setShowForm(true);
  }

  function saveJob() {
    if (!form.role.trim() || !form.company.trim()) {
      alert("Please enter both job role and company name.");
      return;
    }

    if (editingId) {
      setJobs((previous) =>
        previous.map((job) =>
          job.id === editingId
            ? { ...job, ...form, role: form.role.trim(), company: form.company.trim() }
            : job
        )
      );
    } else {
      const newJob: Job = {
        ...form,
        role: form.role.trim(),
        company: form.company.trim(),
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        createdAt: Date.now(),
      };
      setJobs((previous) => [newJob, ...previous]);
    }

    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  }

  function deleteJob(id: string) {
    if (window.confirm("Delete this job application?")) {
      setJobs((previous) => previous.filter((job) => job.id !== id));
    }
  }

  function changeStatus(id: string, status: ApplicationStatus) {
    setJobs((previous) =>
      previous.map((job) => (job.id === id ? { ...job, status } : job))
    );
  }

  const inputClass =
    "mt-2 w-full rounded-xl border border-white/10 bg-[#0B1020] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-violet-400";

  function statusClass(status: ApplicationStatus) {
    const styles: Record<ApplicationStatus, string> = {
      Interested: "bg-amber-400/10 text-amber-300",
      Applied: "bg-blue-400/10 text-blue-300",
      Interview: "bg-violet-400/10 text-violet-300",
      Offer: "bg-emerald-400/10 text-emerald-300",
      Rejected: "bg-rose-400/10 text-rose-300",
    };
    return styles[status];
  }

  return (
    <main className="min-h-screen bg-[#070B18] px-4 py-8 text-white sm:px-8 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-medium text-violet-300">
              CAREER TRACKER
            </p>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Jobs & Internships
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">
              Organize opportunities and track your applications from the first
              shortlist to the final offer.
            </p>
          </div>

          <button
            onClick={openAddForm}
            className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold hover:bg-violet-500"
          >
            + Add Opportunity
          </button>
        </div>

        <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            { label: "Saved Opportunities", value: counts.total },
            { label: "Applications Sent", value: counts.applied },
            { label: "Interviews", value: counts.interviews },
            { label: "Offers", value: counts.offers },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5"
            >
              <p className="text-sm text-slate-400">{item.label}</p>
              <p className="mt-4 text-3xl font-bold">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="mb-6 rounded-xl border border-blue-400/20 bg-blue-400/[0.06] p-4 text-sm leading-6 text-slate-300">
          <strong className="text-blue-300">Prototype notice:</strong>{" "}
          Opportunities added here are managed by you. This page does not fetch
          or verify live vacancies automatically.
        </div>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search role, company or location..."
            className={inputClass.replace("mt-2 ", "")}
          />

          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            className={`${inputClass.replace("mt-2 ", "")} sm:max-w-56`}
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
          <section className="mb-8 rounded-2xl border border-violet-400/20 bg-[#101629] p-5 sm:p-7">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {editingId ? "Edit Opportunity" : "Add Opportunity"}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-sm text-slate-400 hover:text-white"
              >
                Cancel
              </button>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="text-sm text-slate-300">
                Job Role *
                <input
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  placeholder="Frontend Developer Intern"
                  className={inputClass}
                  maxLength={120}
                />
              </label>

              <label className="text-sm text-slate-300">
                Company *
                <input
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  placeholder="Company name"
                  className={inputClass}
                  maxLength={120}
                />
              </label>

              <label className="text-sm text-slate-300">
                Location / Work Mode
                <input
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="Remote, India"
                  className={inputClass}
                  maxLength={120}
                />
              </label>

              <label className="text-sm text-slate-300">
                Opportunity Type
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className={inputClass}
                >
                  <option>Internship</option>
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Contract</option>
                  <option>Apprenticeship</option>
                </select>
              </label>

              <label className="text-sm text-slate-300">
                Application Status
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm({ ...form, status: e.target.value as ApplicationStatus })
                  }
                  className={inputClass}
                >
                  {statuses.map((status) => (
                    <option key={status}>{status}</option>
                  ))}
                </select>
              </label>

              <label className="text-sm text-slate-300">
                Application / Job URL
                <input
                  type="url"
                  value={form.link}
                  onChange={(e) => setForm({ ...form, link: e.target.value })}
                  placeholder="https://..."
                  className={inputClass}
                />
              </label>

              <label className="text-sm text-slate-300 sm:col-span-2">
                Notes
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Deadline, recruiter details, interview notes..."
                  className={`${inputClass} min-h-24 resize-y`}
                  maxLength={1000}
                />
              </label>
            </div>

            <button
              onClick={saveJob}
              className="mt-6 rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold hover:bg-violet-500"
            >
              {editingId ? "Save Changes" : "Save Opportunity"}
            </button>
          </section>
        )}

        {!loaded ? (
          <p className="py-12 text-center text-slate-400">Loading...</p>
        ) : filteredJobs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 px-6 py-16 text-center">
            <div className="text-4xl">⌕</div>
            <h2 className="mt-4 text-xl font-semibold">
              {jobs.length === 0 ? "Start tracking your job search" : "No results found"}
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400">
              {jobs.length === 0
                ? "Add opportunities you find on verified company career pages or trusted job platforms."
                : "Try changing the search term or status filter."}
            </p>
            {jobs.length === 0 && (
              <button
                onClick={openAddForm}
                className="mt-6 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold hover:bg-violet-500"
              >
                + Add First Opportunity
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredJobs.map((job) => (
              <article
                key={job.id}
                className="flex flex-col rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/15 text-xl text-violet-300">
                    ↗
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs ${statusClass(job.status)}`}>
                    {job.status}
                  </span>
                </div>

                <h2 className="break-words text-lg font-semibold">{job.role}</h2>
                <p className="mt-1 break-words text-sm text-violet-300">{job.company}</p>
                <p className="mt-3 text-sm text-slate-400">
                  {job.location || "Location not specified"} · {job.type}
                </p>

                {job.notes && (
                  <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-6 text-slate-400">
                    {job.notes}
                  </p>
                )}

                <div className="mt-auto border-t border-white/[0.08] pt-4 mt-5">
                  <label className="text-xs text-slate-400">
                    Update status
                    <select
                      value={job.status}
                      onChange={(e) =>
                        changeStatus(job.id, e.target.value as ApplicationStatus)
                      }
                      className={`${inputClass} mt-2`}
                    >
                      {statuses.map((status) => (
                        <option key={status}>{status}</option>
                      ))}
                    </select>
                  </label>

                  <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
                    {job.link && (
                      <a
                        href={job.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-violet-300 hover:text-violet-200"
                      >
                        Open Job ↗
                      </a>
                    )}
                    <button
                      onClick={() => openEditForm(job)}
                      className="text-slate-400 hover:text-white"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteJob(job.id)}
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
          Applications are saved locally in this browser, not synced to an account.
        </p>
      </div>
    </main>
  );
}
