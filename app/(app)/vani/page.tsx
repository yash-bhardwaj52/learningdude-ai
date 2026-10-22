
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type Suggestion = {
  icon: string;
  title: string;
  prompt: string;
};

const SUGGESTIONS: Suggestion[] = [
  {
    icon: "🎯",
    title: "Find my career path",
    prompt: "Help me choose the right career path.",
  },
  {
    icon: "🗺️",
    title: "Build my roadmap",
    prompt: "Create a step-by-step learning roadmap for a beginner.",
  },
  {
    icon: "💼",
    title: "Find an internship",
    prompt: "Help me prepare for entry-level jobs and internships.",
  },
  {
    icon: "📝",
    title: "Improve my resume",
    prompt: "Help me improve my resume for software developer jobs.",
  },
];

const API_ENDPOINT = "/api/career-assistant";
const MAX_CONTEXT_MESSAGES = 12;
const CHAT_STORAGE_KEY = "learningdude-vani-chat";

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function Robot({ small = false }: { small?: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={`relative flex shrink-0 items-center justify-center rounded-3xl border border-violet-300/40 bg-gradient-to-br from-violet-400 via-indigo-600 to-purple-950 shadow-[0_0_30px_rgba(139,92,246,0.4)] ${
        small ? "h-11 w-11" : "h-24 w-24"
      }`}
    >
      <div className="absolute inset-[13%] rounded-2xl border border-white/20 bg-slate-950/90" />

      <div className="relative flex gap-3">
        <span
          className={`rounded-full bg-cyan-300 shadow-[0_0_12px_#67e8f9] ${
            small ? "h-2 w-2" : "h-3 w-3"
          }`}
        />
        <span
          className={`rounded-full bg-cyan-300 shadow-[0_0_12px_#67e8f9] ${
            small ? "h-2 w-2" : "h-3 w-3"
          }`}
        />
      </div>

      <span
        className={`absolute bottom-[22%] rounded-full bg-violet-300 ${
          small ? "h-[2px] w-3" : "h-[3px] w-7"
        }`}
      />

      <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-emerald-400 ring-4 ring-[#080b18]" />
    </div>
  );
}

function isMessageArray(value: unknown): value is Message[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        item !== null &&
        typeof item === "object" &&
        typeof item.id === "string" &&
        (item.role === "user" || item.role === "assistant") &&
        typeof item.content === "string"
    )
  );
}

export default function VaniPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [error, setError] = useState("");

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Restore recent conversation from this browser.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CHAT_STORAGE_KEY);

      if (saved) {
        const parsed: unknown = JSON.parse(saved);

        if (isMessageArray(parsed)) {
          setMessages(parsed.slice(-MAX_CONTEXT_MESSAGES));
        }
      }
    } catch {
      console.error("Unable to restore Vani chat history.");
    } finally {
      setHistoryLoaded(true);
    }

    inputRef.current?.focus();
  }, []);

  // Save chat after history has loaded to avoid overwriting saved messages.
  useEffect(() => {
    if (!historyLoaded) return;

    try {
      localStorage.setItem(
        CHAT_STORAGE_KEY,
        JSON.stringify(messages)
      );
    } catch {
      console.error("Unable to save Vani chat history.");
    }
  }, [messages, historyLoaded]);

  // Scroll to the latest message.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, loading]);

  async function sendMessage(text?: string) {
    const content = (text ?? input).trim();

    if (!content || loading || !historyLoaded) return;

    const userMessage: Message = {
      id: createId(),
      role: "user",
      content,
    };

    const conversation = [...messages, userMessage].slice(
      -MAX_CONTEXT_MESSAGES
    );

    setMessages(conversation);
    setInput("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: conversation.map(({ role, content }) => ({
            role,
            content,
          })),
        }),
      });

      const contentType = response.headers.get("content-type") ?? "";

      if (!contentType.includes("application/json")) {
        throw new Error(
          `The server returned HTTP ${response.status}. Please check the API route.`
        );
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof data.error === "string"
            ? data.error
            : `Request failed (${response.status}).`
        );
      }

      if (typeof data.reply !== "string" || !data.reply.trim()) {
        throw new Error("Vani returned an empty response. Please try again.");
      }

      setMessages((current) =>
        [
          ...current,
          {
            id: createId(),
            role: "assistant" as const,
            content: data.reply.trim(),
          },
        ].slice(-MAX_CONTEXT_MESSAGES)
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.";

      setError(errorMessage);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  function startNewChat() {
    if (loading) return;

    setMessages([]);
    setInput("");
    setError("");

    try {
      localStorage.removeItem(CHAT_STORAGE_KEY);
    } catch {
      console.error("Unable to clear saved Vani chat.");
    }

    inputRef.current?.focus();
  }

  return (
    <main className="min-h-screen bg-[#080b18] text-white">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 sm:px-8">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 py-5">
          <Link href="/dashboard" className="flex items-center gap-3">
            <Robot small />
            <div>
              <p className="font-bold">LearningDude AI</p>
              <p className="text-xs text-slate-400">
                Your career companion
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={loading || !historyLoaded}
              onClick={startNewChat}
              className="rounded-full border border-violet-400/30 px-3 py-2 text-sm text-violet-200 transition hover:bg-violet-500/10 disabled:opacity-50 sm:px-4"
            >
              + New Chat
            </button>

            <Link
              href="/dashboard"
              className="rounded-full border border-white/15 px-3 py-2 text-sm text-slate-300 transition hover:bg-white/10 sm:px-4"
            >
              ← Dashboard
            </Link>
          </div>
        </header>

        <section className="flex flex-1 flex-col items-center justify-center py-10">
          {!historyLoaded ? (
            <p className="text-sm text-slate-400">
              Loading your conversation...
            </p>
          ) : messages.length === 0 ? (
            <div className="w-full max-w-3xl text-center">
              <div className="mb-7 flex justify-center">
                <Robot />
              </div>

              <p className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-4 py-2 text-xs text-violet-200">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                YOUR AI CAREER COMPANION
              </p>

              <h1 className="mt-5 text-4xl font-bold sm:text-6xl">
                Hey, I&apos;m{" "}
                <span className="bg-gradient-to-r from-violet-300 via-purple-400 to-cyan-300 bg-clip-text text-transparent">
                  Vani.
                </span>
              </h1>

              <p className="mx-auto mt-5 max-w-xl leading-7 text-slate-400 sm:text-lg">
                Let&apos;s discover your strengths, build your skills and
                take your next career step together.
              </p>

              <div className="mt-10 grid gap-3 text-left sm:grid-cols-2">
                {SUGGESTIONS.map((item) => (
                  <button
                    key={item.title}
                    type="button"
                    disabled={loading}
                    onClick={() => void sendMessage(item.prompt)}
                    className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 transition hover:border-violet-400/50 hover:bg-violet-500/[0.08] disabled:opacity-50"
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <p className="mt-3 font-semibold">{item.title}</p>
                    <p className="mt-1 text-sm text-slate-400">
                      Start a conversation with Vani
                    </p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="w-full max-w-3xl space-y-6 py-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.role === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  {message.role === "assistant" && <Robot small />}

                  <div
                    className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-7 sm:text-base ${
                      message.role === "user"
                        ? "rounded-br-sm bg-violet-600"
                        : "rounded-bl-sm border border-white/10 bg-white/[0.05] text-slate-200"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div
                  role="status"
                  aria-live="polite"
                  className="flex items-center gap-3 text-sm text-slate-400"
                >
                  <Robot small />
                  <span className="animate-pulse">
                    Vani is thinking...
                  </span>
                </div>
              )}

              <div ref={bottomRef} />
            </div>
          )}
        </section>

        <div className="sticky bottom-0 bg-[#080b18] pb-5 pt-3">
          {error && (
            <div
              role="alert"
              className="mx-auto mb-3 flex max-w-3xl items-center justify-between gap-3 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200"
            >
              <p>{error}</p>
              <button
                type="button"
                onClick={() => void sendMessage(messages[messages.length - 1]?.role === "user" ? messages[messages.length - 1].content : undefined)}
                disabled={loading || messages[messages.length - 1]?.role !== "user"}
                className="shrink-0 rounded-lg border border-red-300/20 px-3 py-1.5 hover:bg-red-500/10 disabled:opacity-50"
              >
                Retry
              </button>
            </div>
          )}

          <form
            onSubmit={(event) => {
              event.preventDefault();
              void sendMessage();
            }}
            className="mx-auto flex w-full max-w-3xl items-center gap-2 rounded-2xl border border-white/15 bg-[#11162a] p-2 focus-within:border-violet-400/60"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask Vani about your career..."
              aria-label="Message Vani"
              disabled={loading || !historyLoaded}
              className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-white outline-none placeholder:text-slate-500 disabled:opacity-60 sm:text-base"
            />

            <button
              type="submit"
              disabled={loading || !historyLoaded || !input.trim()}
              className="shrink-0 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading ? "Sending..." : "Send ↑"}
            </button>
          </form>

          <p className="mt-3 text-center text-xs text-slate-600">
            AI can make mistakes. Verify important career information.
          </p>
        </div>
      </div>
    </main>
  );
}
