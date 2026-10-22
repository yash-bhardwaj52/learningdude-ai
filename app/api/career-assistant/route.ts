
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!Array.isArray(body.messages)) {
      return NextResponse.json(
        { error: "Messages must be an array." },
        { status: 400 }
      );
    }

    const messages = body.messages
      .filter(
        (message: { role?: string; content?: string }) =>
          ["user", "assistant"].includes(message.role ?? "") &&
          typeof message.content === "string"
      )
      .map((message: { role: string; content: string }) => ({
        role: message.role,
        content: message.content,
      }));

    if (!messages.length || messages[messages.length - 1].role !== "user") {
      return NextResponse.json(
        { error: "Please send a user message." },
        { status: 400 }
      );
    }

    const response = await fetch("http://localhost:11434/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gemma4:e2b",
        stream: false,
        messages: [
          {
            role: "system",
            content:
              "You are Vani, the friendly AI career assistant for LearningDude AI. Help students with career choices, roadmaps, coding, projects, resumes, internships and interviews. Answer general questions too. Use simple Hinglish by default, unless the user requests another language. Give clear, practical, honest answers. Never claim you performed an action you did not perform.",
          },
          ...messages,
        ],
      }),
    });

    if (!response.ok) {
      const details = await response.text();
      console.error("Ollama error:", details);

      return NextResponse.json(
        { error: "Vani AI is temporarily unavailable. Please try again." },
        { status: 502 }
      );
    }

    const data = await response.json();
    const reply = data.message?.content;

    if (typeof reply !== "string" || !reply.trim()) {
      return NextResponse.json(
        { error: "Vani returned an empty response. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({ reply: reply.trim() });
  } catch (error) {
    console.error("Career assistant error:", error);

    return NextResponse.json(
      {
        error:
          "Vani se connection nahi ho pa raha. Check karein ki Ollama running hai.",
      },
      { status: 500 }
    );
  }
}
