import { NextResponse } from "next/server";

const NEOXR_BASE = "https://api.neoxr.eu/api";
const NEOXR_API_KEY = process.env.NEOXR_API_KEY || "2taQ2a";
const TELEGRAPH_UPLOAD_URL = "https://telegra.ph/upload";

const DEFAULT_QUERY =
  "Jelaskan gambar ini secara singkat dan jelas dalam Bahasa Indonesia.";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB

export async function POST(req) {
  try {
    if (!NEOXR_API_KEY) {
      return NextResponse.json(
        {
          error:
            "NEOXR_API_KEY belum diatur di server. Tambahkan environment variable NEOXR_API_KEY terlebih dahulu.",
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

    // Upload ke Telegraph dulu supaya dapat URL publik yang bisa diakses API vision
    const telegraphForm = new FormData();
    telegraphForm.append("file", file, file.name || "image.jpg");

    const telegraphRes = await fetch(TELEGRAPH_UPLOAD_URL, {
      method: "POST",
      body: telegraphForm,
    });

    if (!telegraphRes.ok) {
      console.error("Telegraph upload error:", telegraphRes.status);
      return NextResponse.json(
        { error: "Gagal mengunggah gambar, coba lagi ya." },
        { status: 502 }
      );
    }

    const telegraphData = await telegraphRes.json();
    const path = Array.isArray(telegraphData) ? telegraphData[0]?.src : null;

    if (!path) {
      console.error("Telegraph upload unexpected response:", telegraphData);
      return NextResponse.json(
        { error: "Gagal mengunggah gambar, coba lagi ya." },
        { status: 502 }
      );
    }

    const imageUrl = `https://telegra.ph${path}`;

    const visionUrl = `${NEOXR_BASE}/gemini-vision?${new URLSearchParams({
      image: imageUrl,
      query,
      lang: "id",
      apikey: NEOXR_API_KEY,
    })}`;

    const visionRes = await fetch(visionUrl);

    if (!visionRes.ok) {
      const errText = await visionRes.text();
      console.error("Neoxr gemini-vision error:", visionRes.status, errText);
      return NextResponse.json(
        { error: "Jaya Bintang AI gagal menganalisis gambar, coba lagi ya." },
        { status: 502 }
      );
    }

    const visionData = await visionRes.json();
    const result = visionData?.data?.result;

    if (!visionData?.status || !result) {
      console.error("Neoxr gemini-vision unexpected response:", visionData);
      return NextResponse.json(
        { error: "Jaya Bintang AI gagal menganalisis gambar, coba lagi ya." },
        { status: 502 }
      );
    }

    return NextResponse.json({ reply: result, imageUrl });
  } catch (err) {
    console.error("Vision API error:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan di server. Coba lagi sebentar lagi ya." },
      { status: 500 }
    );
  }
}
