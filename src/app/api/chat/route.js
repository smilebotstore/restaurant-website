import { NextResponse } from "next/server";
import restaurantInfo from "@/data/restaurant-info.json";
import menu from "@/data/menu.json";
import systemPromptData from "@/data/system-prompt.json";

// Model Groq yang dipakai. Bisa diganti lewat env var GROQ_MODEL kalau perlu.
const GROQ_MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-120b";
const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";

// Deteksi cepat permintaan seputar kode/pemrograman, ditolak sebelum sampai ke AI.
// Ini lapisan pengaman tambahan di luar system prompt, supaya tidak bisa
// "dijailbreak" lewat trik kata-kata di pesan pengguna.
const CODE_REQUEST_PATTERN =
  /\b(buatkan|buatin|bikinkan|bikinin|tuliskan|tulis|generate|bikin|buat)\s+\w*\s*(kode|code|script|program|fungsi|function|aplikasi|website|web|situs|bot|coding)\b|\b(javascript|typescript|python|php|nodejs|node\.js|react|next\.js|golang|java|c\+\+|c#|html|css|sql query|regex)\b|```|\bconsole\.log\b|\bprint\(|\bdef\s+\w+\(|\bfunction\s*\(|<html|\bimport\s+\w+\s+from\b/i;

function isCodeRequest(text) {
  return CODE_REQUEST_PATTERN.test(text);
}

function buildSystemPrompt() {
  return `${systemPromptData.persona}

TUJUAN KAMU:
${systemPromptData.goals.map((g) => `- ${g}`).join("\n")}

ATURAN WAJIB:
${systemPromptData.rules.map((r) => `- ${r}`).join("\n")}

TOPIK YANG WAJIB DITOLAK (RESTRICTED — tanpa terkecuali):
${systemPromptData.restrictedTopics.map((t) => `- ${t}`).join("\n")}

Contoh jawaban saat menolak topik restricted: "${systemPromptData.restrictedReplyExample}"

=== DATA WARUNG (sumber kebenaran, jangan mengarang di luar ini) ===
${JSON.stringify(restaurantInfo, null, 2)}

=== DATA MENU (sumber kebenaran, jangan mengarang di luar ini) ===
${JSON.stringify(menu, null, 2)}

Contoh gaya sapaan pembuka: "${systemPromptData.greetingExample}"`;
}

export async function POST(req) {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "GROQ_API_KEY belum diatur di server. Tambahkan environment variable GROQ_API_KEY terlebih dahulu.",
        },
        { status: 500 }
      );
    }

    const body = await req.json();
    const clientMessages = Array.isArray(body?.messages) ? body.messages : [];

    // Batasi jumlah riwayat pesan yang dikirim supaya request tetap ringan & aman
    const trimmedHistory = clientMessages
      .filter(
        (m) =>
          m &&
          (m.role === "user" || m.role === "assistant") &&
          typeof m.content === "string"
      )
      .slice(-20);

    if (trimmedHistory.length === 0) {
      return NextResponse.json(
        { error: "Pesan tidak boleh kosong." },
        { status: 400 }
      );
    }

    const lastUserMessage = [...trimmedHistory]
      .reverse()
      .find((m) => m.role === "user");

    if (lastUserMessage && isCodeRequest(lastUserMessage.content)) {
      return NextResponse.json({
        reply: systemPromptData.restrictedReplyExample,
      });
    }

    const payload = {
      model: GROQ_MODEL,
      messages: [
        { role: "system", content: buildSystemPrompt() },
        ...trimmedHistory,
      ],
      temperature: 0.6,
      max_tokens: 600,
    };

    const groqRes = await fetch(GROQ_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!groqRes.ok) {
      const errText = await groqRes.text();
      console.error("Groq API error:", groqRes.status, errText);
      return NextResponse.json(
        { error: "Jaya Bintang AI sedang bermasalah, coba lagi sebentar lagi ya." },
        { status: 502 }
      );
    }

    const data = await groqRes.json();
    const reply =
      data?.choices?.[0]?.message?.content?.trim() ||
      "Maaf, aku belum bisa menjawab itu sekarang. Coba tanya lagi ya.";

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan di server. Coba lagi sebentar lagi ya." },
      { status: 500 }
    );
  }
}
