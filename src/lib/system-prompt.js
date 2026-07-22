import restaurantInfo from "@/data/restaurant-info.json";
import menu from "@/data/menu.json";
import systemPromptData from "@/data/system-prompt.json";

export function buildSystemPrompt() {
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
