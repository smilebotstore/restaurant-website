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
      className="flex items-center justify-between gap-3 rounded-2xl border border-cream-50/10 bg-maroon-900 px-4 py-3.5 text-left shadow-card transition-colors hover:border-gold-400"
    >
      <span className="flex items-center gap-3">
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${iconBg}`}
        >
          <Icon size={17} />
        </span>
        <span className="text-sm font-semibold text-cream-50">{label}</span>
      </span>
      <Plus size={16} className="shrink-0 text-cream-50/25" />
    </motion.button>
  );
}
