import restaurantInfo from "@/data/restaurant-info.json";
import menu from "@/data/menu.json";
import systemPromptData from "@/data/system-prompt.json";

// Node/Vercel runtime seringkali cuma punya data ICU "small" yang tidak
// lengkap untuk locale id-ID, jadi Intl.DateTimeFormat("id-ID", ...) bisa
// menghasilkan nama hari/bulan yang salah/campur bahasa lain (misalnya
// "Khamis" alih-alih "Kamis"). Untuk keandalan, ambil bagian tanggal dalam
// bahasa Inggris (locale data-nya selalu lengkap di semua runtime) lalu
// petakan manual ke bahasa Indonesia.
const WEEKDAY_ID = {
  Sunday: "Minggu",
  Monday: "Senin",
  Tuesday: "Selasa",
  Wednesday: "Rabu",
  Thursday: "Kamis",
  Friday: "Jumat",
  Saturday: "Sabtu",
};
const WEEKDAY_ORDER = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const MONTH_ID = {
  January: "Januari",
  February: "Februari",
  March: "Maret",
  April: "April",
  May: "Mei",
  June: "Juni",
  July: "Juli",
  August: "Agustus",
  September: "September",
  October: "Oktober",
  November: "November",
  December: "Desember",
};

function getCurrentDateTimeInfo() {
  const now = new Date();
  const tz = "Asia/Jakarta";

  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
    .formatToParts(now)
    .reduce((acc, p) => ({ ...acc, [p.type]: p.value }), {});

  const weekdayEn = parts.weekday;
  const weekdayId = WEEKDAY_ID[weekdayEn];
  const monthId = MONTH_ID[parts.month];
  const hour = parseInt(parts.hour, 10);

  const dayDate = `${weekdayId}, ${parts.day} ${monthId} ${parts.year}`;
  const time = `${parts.hour}:${parts.minute}`;

  // Konvensi budaya Indonesia: pergantian "malam" mengikuti maghrib, bukan
  // tengah malam. Jadi malam Kamis mulai ~18:00 Kamis sampai subuh Jumat, dan
  // itu tetap disebut "malam Jumat" (bukan "malam Kamis"). Hitung nama malam
  // yang benar berdasarkan jam saat ini supaya AI tidak salah sebut malam
  // Jumat/malam Sabtu dsb.
  const idx = WEEKDAY_ORDER.indexOf(weekdayEn);
  let malamLabel = null;
  if (hour >= 18) {
    malamLabel = WEEKDAY_ID[WEEKDAY_ORDER[(idx + 1) % 7]];
  } else if (hour < 4) {
    malamLabel = weekdayId;
  }

  let timeOfDay = "malam";
  if (hour >= 4 && hour < 11) timeOfDay = "pagi";
  else if (hour >= 11 && hour < 15) timeOfDay = "siang";
  else if (hour >= 15 && hour < 18) timeOfDay = "sore";

  const malamNote = malamLabel
    ? ` Sesuai kebiasaan penyebutan orang Indonesia (pergantian "malam" mengikuti waktu maghrib, bukan tengah malam), waktu sekarang disebut "malam ${malamLabel}".`
    : "";

  return `${dayDate}, pukul ${time} WIB (sekarang waktu ${timeOfDay} hari ${weekdayId}).${malamNote}`;
}

export function buildSystemPrompt() {
  return `${systemPromptData.persona}

WAKTU SAAT INI: ${getCurrentDateTimeInfo()}
Cara pakai info waktu ini:
- Kalau user tanya hal terkait waktu (sekarang hari/tanggal/jam berapa, "malam ini malam apa", "besok hari apa", "berarti weekend ya", promo hari Jum'at masih berlaku atau tidak, dsb), JAWAB PENUH dan natural pakai kalimat lengkap — sebutkan nama hari, tanggal, dan jam dengan jelas, jangan disingkat atau dipotong asal-asalan (contoh: "Sekarang hari Kamis, 23 Juli 2026, pukul 20:15 WIB ya Kak — jadi ini malam Jumat.").
- Kalau user tanya soal "malam Jumat"/"malam Sabtu"/dsb, ikuti kebiasaan Indonesia: pergantian sebutan "malam" itu mengikuti maghrib (bukan tengah malam jam 00:00), jadi malam Kamis setelah maghrib itu sebenarnya sudah disebut "malam Jumat", dst. Info malam yang benar untuk waktu sekarang sudah dihitungkan di atas, pakai itu, jangan hitung ulang sendiri dan jangan sampai keliru.
- Kalau relevan, boleh pakai info waktu ini untuk hal lain juga (menyapa sesuai waktu "selamat pagi/siang/sore/malam", promo Jum'at, dsb).
- Kalau pertanyaan user tidak berhubungan dengan waktu sama sekali, tidak perlu menyebutkan info waktu ini.

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
