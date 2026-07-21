"use client";

import { motion } from "framer-motion";
import { ChefHat, User } from "lucide-react";

export default function ChatMessage({ role, content }) {
  const isUser = role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`flex items-end gap-2.5 ${isUser ? "flex-row-reverse" : ""}`}
    >
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
          isUser ? "bg-gold-500 text-maroon-950" : "bg-cream-50/10 text-gold-400"
        }`}
      >
        {isUser ? <User size={15} /> : <ChefHat size={15} />}
      </div>

      <div
        className={`max-w-[78%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-card sm:max-w-[65%] ${
          isUser
            ? "rounded-br-md bg-gold-500 text-maroon-950"
            : "rounded-bl-md border border-cream-50/10 bg-maroon-900 text-cream-50"
        }`}
      >
        {content}
      </div>
    </motion.div>
  );
}
