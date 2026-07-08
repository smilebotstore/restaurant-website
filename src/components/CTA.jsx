"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { waLinkWithMessage } from "@/data/restaurant";

export default function CTA() {
  return (
    <section className="relative overflow-hidden bg-maroon-950 py-20 sm:py-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-0 h-64 w-64 rounded-full bg-gold-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-maroon-700/40 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6 }}
        className="relative mx-auto max-w-3xl px-5 text-center sm:px-8"
      >
        <h2 className="font-display text-3xl font-bold text-cream-50 sm:text-4xl md:text-5xl">
          Lapar? Pesan Sekarang!
        </h2>
        <p className="mx-auto mt-4 max-w-md text-cream-50/75">
          Nasi goreng dan mie goreng hangat siap dipesan kapan saja lewat
          WhatsApp.
        </p>

        <motion.a
          href={waLinkWithMessage("Halo, saya ingin pesan nasi goreng")}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.96 }}
          className="mt-8 inline-flex items-center gap-3 rounded-full bg-gold-500 px-9 py-4 text-base font-bold text-maroon-950 shadow-soft transition-colors hover:bg-gold-400"
        >
          <MessageCircle size={20} />
          Pesan via WhatsApp
        </motion.a>
      </motion.div>
    </section>
  );
}
