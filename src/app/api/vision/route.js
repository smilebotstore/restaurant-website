import { NextResponse } from "next/server";
import { buildSystemPrompt } from "@/lib/system-prompt";

// Pakai provider & key yang sama dengan /api/chat supaya konsisten dan gratis
// selama masih di batas free tier Groq.
const GROQ_VISION_MODEL = process.env.GROQ_VISION_MODEL || "qwen/qwen3.6-27b";
const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";

const DEFAULT_QUERY =
  "Jelaskan gambar ini secara singkat dan jelas dalam Bahasa Indonesia.";

// Ditempel di akhir system prompt utama (yang sama dipakai /api/chat) supaya
// analisa gambar tetap "dalam karakter" sebagai customer service warung —
// bukan lepas jadi asisten AI serbaguna yang bebas ngomong apa saja soal
// gambar tanpa nyambung ke menu/konteks warung.
const VISION_INSTRUCTIONS = `
KONTEKS TAMBAHAN UNTUK PESAN INI: Pengguna melampirkan sebuah gambar bersama pesannya.
- Tanggapi gambar dan teks pengguna sebagai satu kesatuan percakapan, tetap dalam karaktermu sebagai Jaya Bintang AI.
- Kalau relevan, kaitkan responsmu dengan rekomendasi menu dari DATA MENU di atas — JANGAN PERNAH menyebut makanan/minuman yang tidak ada di DATA MENU.
- Kalau isi gambar atau curhatan pengguna di luar topik warung (misalnya gambar tidak nyambung sama sekali dan tidak ada celah wajar untuk mengarah ke rekomendasi menu), tetap deskripsikan gambarnya singkat, lalu ingatkan sopan bahwa kamu cuma bisa bantu soal Nasi Goreng Jaya Bintang.
- Tetap ikuti ATURAN WAJIB di atas: jawaban singkat dan padat, jangan mengarang menu/harga di luar data.`;

const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB

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

    const formData = await req.formData();
    const file = formData.get("image");
    const query = formData.get("query")?.toString().trim() || DEFAULT_QUERY;

    if (!file || typeof file === "string") {
      return NextResponse.json(
        { error: "Gambar tidak ditemukan." },
        { status: 400 }
      );
    }

    if (!file.type?.startsWith("image/")) {
      return NextResponse.json(
        { error: "File yang diunggah harus berupa gambar." },
        { status: 400 }
      );
    }

    if (file.size > MAX_IMAGE_BYTES) {
      return NextResponse.json(
        { error: "Ukuran gambar maksimal 5MB." },
        { status: 400 }
      );
    }

    // Kirim gambar langsung sebagai data URI base64 ke Groq — tidak perlu
    // hosting gambar publik dulu (beda dari Neoxr yang butuh URL publik).
    const base64 = Buffer.from(await file.arrayBuffer()).toString("base64");
    const dataUri = `data:${file.type};base64,${base64}`;

    const payload = {
      model: GROQ_VISION_MODEL,
      messages: [
        { role: "system", content: buildSystemPrompt() + VISION_INSTRUCTIONS },
        {
          role: "user",
          content: [
            { type: "text", text: query },
            { type: "image_url", image_url: { url: dataUri } },
          ],
        },
      ],
      temperature: 0.4,
      max_tokens: 600,
      // Qwen3.6 punya thinking mode yang bisa menghabiskan token budget untuk
      // reasoning internal (muncul sebagai blok <think>) sebelum sempat kasih
      // jawaban final — matikan supaya jawaban langsung final & tidak kepotong.
      reasoning_effort: "none",
      reasoning_format: "hidden",
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
      console.error("Groq vision API error:", groqRes.status, errText);
      return NextResponse.json(
        { error: "Jaya Bintang AI gagal menganalisis gambar, coba lagi ya." },
        { status: 502 }
      );
    }

    const data = await groqRes.json();
    const reply = data?.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      console.error("Groq vision unexpected response:", data);
      return NextResponse.json(
        { error: "Jaya Bintang AI gagal menganalisis gambar, coba lagi ya." },
        { status: 502 }
      );
    }

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Vision API error:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan di server. Coba lagi sebentar lagi ya." },
      { status: 500 }
    );
  }
}
