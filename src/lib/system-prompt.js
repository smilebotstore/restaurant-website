import restaurantInfo from "@/data/restaurant-info.json";
import menu from "@/data/menu.json";
import systemPromptData from "@/data/system-prompt.json";

function getCurrentDateTimeInfo() {
  const now = new Date();
  const tz = "Asia/Jakarta";

  const dayDate = new Intl.DateTimeFormat("id-ID", {
    timeZone: tz,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(now);

  const time = new Intl.DateTimeFormat("id-ID", {
    timeZone: tz,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(now);

  return `${dayDate}, pukul ${time} WIB`;
}

export function buildSystemPrompt() {
  return `${systemPromptData.persona}

WAKTU SAAT INI: ${getCurrentDateTimeInfo()}
(Gunakan info ini kalau relevan, misal user tanya "sekarang hari apa/tanggal berapa/jam berapa", atau untuk menyapa sesuai waktu seperti "selamat pagi/siang/sore/malam". Jangan sebutkan waktu ini kalau tidak relevan dengan pertanyaan user.)

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
