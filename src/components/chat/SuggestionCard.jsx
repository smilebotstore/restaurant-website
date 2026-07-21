"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";

export default function SuggestionCard({ icon: Icon, iconBg, label, onClick }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
      className="flex items-center justify-between gap-2.5 rounded-xl border border-cream-50/10 bg-maroon-900 px-3 py-3 text-left shadow-card transition-colors hover:border-gold-400 sm:rounded-2xl sm:px-4 sm:py-3.5"
    >
      <span className="flex items-center gap-2.5">
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg sm:h-9 sm:w-9 sm:rounded-xl ${iconBg}`}
        >
          <Icon size={15} />
        </span>
        <span className="text-[13px] font-semibold text-cream-50 sm:text-sm">{label}</span>
      </span>
      <Plus size={14} className="shrink-0 text-cream-50/25" />
    </motion.button>
  );
}
