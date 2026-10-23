
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      console.error("GROQ_API_KEY is missing");
      return NextResponse.json(
        { error: "Vani AI is not configured on the server." },
        { status: 500 }
      );
    }

    const body = await request.json();

    if (!Array.isArray(body.messages)) {
      return NextResponse.json(
        { error: "Invalid chat messages." },
        { status: 400 }
      );
    }

    const messages = body.messages
      .filter(
        (m: { role?: string; content?: string }) =>
          ["user", "assistant"].includes(m.role ?? "") &&
          typeof m.content === "string"
      )
      .map((m: { role: string; content: string }) => ({
        role: m.role,
        content: m.content,
      }));

    if (!messages.length) {
      return NextResponse.json(
        { error: "Please enter a message." },
        { status: 400 }
      );
    }

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-20b",
          messages: [
            {
              role: "system",
              content:
                "You are Vani, the friendly AI career assistant for LearningDude AI. Help students with career choices, roadmaps, coding, projects, resumes, internships and interviews. Answer general questions too. Use simple Hinglish by default unless the user requests another language. Give clear, practical, honest answers. Never claim you performed an action you did not perform.",
            },
            ...messages,
          ],
        }),
      }
    );

    if (!response.ok) {
      const details = await response.text();
      console.error("Groq provider error:", {
        status: response.status,
        details,
      });

      return NextResponse.json(
        { error: "Vani could not reply. Please try again." },
        { status: 502 }
      );
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content;

    if (typeof reply !== "string" || !reply.trim()) {
      return NextResponse.json(
        { error: "Vani returned an empty response." },
        { status: 502 }
      );
    }

    return NextResponse.json({ reply: reply.trim() });
  } catch (error) {
    console.error("Vani API error:", error);
    return NextResponse.json(
      { error: "Vani is temporarily unavailable." },
      { status: 500 }
    );
  }
}
