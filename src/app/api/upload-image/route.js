import { NextResponse } from "next/server";

const NEOXR_BASE = "https://api.neoxr.eu/api";
const NEOXR_KEY = process.env.NEOXR_API_KEY || "2taQ2a";
const TELEGRAPH_UPLOAD = "https://telegra.ph/upload";

// Upload gambar ke Telegra.ph, kembalikan URL publik
async function uploadToTelegraph(buffer, mimeType) {
  const blob = new Blob([buffer], { type: mimeType });
  const formData = new FormData();
  formData.append("file", blob, "image.jpg");

  const res = await fetch(TELEGRAPH_UPLOAD, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`Telegra.ph upload gagal: ${res.status}`);
  }

  const json = await res.json();
  // Response Telegra.ph: [{ src: "/file/xxx.jpg" }]
  const src = json?.[0]?.src;
  if (!src) throw new Error("Telegra.ph tidak mengembalikan URL gambar");

  return `https://telegra.ph${src}`;
}

// Analisis gambar via Neoxr Gemini Vision dengan dynamic query
async function analyzeImage(imageUrl, query) {
  const params = new URLSearchParams({
    image: imageUrl,
    query,
    lang: "id",
    apikey: NEOXR_KEY,
  });

  const res = await fetch(`${NEOXR_BASE}/gemini-vision?${params.toString()}`);

  if (!res.ok) {
    throw new Error(`Neoxr API error: ${res.status}`);
  }

  const json = await res.json();

  if (!json?.status || !json?.data?.result) {
    throw new Error("Neoxr tidak mengembalikan hasil analisis");
  }

  return json.data.result;
}

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("image");
    const userQuery = formData.get("query") || "Deskripsikan gambar ini secara detail dalam bahasa Indonesia.";

    if (!file || typeof file === "string") {
      return NextResponse.json(
        { error: "Tidak ada gambar yang dikirim." },
        { status: 400 }
      );
    }

    // Validasi tipe file
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Format gambar tidak didukung. Gunakan JPG, PNG, WEBP, atau GIF." },
        { status: 400 }
      );
    }

    // Validasi ukuran file (maks 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Ukuran gambar terlalu besar. Maksimal 5MB." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Step 1: Upload ke Telegra.ph
    const imageUrl = await uploadToTelegraph(buffer, file.type);

    // Step 2: Analisis gambar dengan Neoxr Gemini Vision
    // Dynamic query: disesuaikan konteks customer service warung
    const visionQuery = `Kamu adalah asisten customer service untuk warung nasi goreng. 
Deskripsikan gambar ini secara detail dalam bahasa Indonesia: 
- Jika ini makanan/minuman: sebutkan jenis makanan, tampilan, bahan yang terlihat, dan kondisinya
- Jika ini menu/struk/harga: baca dan tuliskan semua teks yang terlihat
- Jika ini foto tempat/lokasi: deskripsikan situasi dan kondisinya
- Untuk gambar lainnya: deskripsikan secara umum apa yang terlihat
Pertanyaan dari pengguna: "${userQuery}"`;

    const visionResult = await analyzeImage(imageUrl, visionQuery);

    return NextResponse.json({
      imageUrl,
      visionResult,
    });
  } catch (err) {
    console.error("Upload/Vision error:", err.message);

    // Pesan error yang user-friendly
    if (err.message.includes("Telegra.ph")) {
      return NextResponse.json(
        { error: "Gagal upload gambar, coba lagi ya Kak." },
        { status: 502 }
      );
    }
    if (err.message.includes("Neoxr")) {
      return NextResponse.json(
        { error: "Gagal menganalisis gambar, coba lagi ya Kak." },
        { status: 502 }
      );
    }

    return NextResponse.json(
      { error: "Terjadi kesalahan, coba lagi ya Kak." },
      { status: 500 }
    );
  }
}
