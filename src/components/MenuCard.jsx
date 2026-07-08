"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { waLinkWithMessage } from "@/data/restaurant";

export default function MenuCard({ item, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.45, delay: (index % 3) * 0.08 }}
      whileHover={{ y: -6 }}
      className="group flex flex-col justify-between rounded-2xl border border-maroon-950/5 bg-white p-5 shadow-card transition-shadow hover:shadow-soft"
    >
      <div>
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg font-bold text-maroon-900">
            {item.name}
          </h3>
          {item.price && (
            <span className="whitespace-nowrap rounded-full bg-gold-500/15 px-3 py-1 text-sm font-extrabold text-gold-600">
              {item.price}
            </span>
          )}
        </div>
        {item.desc && (
          <p className="mt-2 text-sm leading-relaxed text-maroon-800/70">
            {item.desc}
          </p>
        )}
      </div>

      <a
        href={waLinkWithMessage(`Halo, saya mau pesan ${item.name}`)}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 flex items-center justify-center gap-2 rounded-full bg-maroon-900 px-4 py-2.5 text-sm font-bold text-cream-50 transition-colors group-hover:bg-gold-500 group-hover:text-maroon-950"
      >
        <MessageCircle size={15} />
        Pesan Sekarang
      </a>
    </motion.div>
  );
}
