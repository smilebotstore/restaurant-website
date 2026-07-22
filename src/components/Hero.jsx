"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { MessageCircle, ChevronDown, Flame } from "lucide-react";
import { restaurant, waLinkWithMessage } from "@/data/restaurant";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden bg-maroon-950 pt-28 pb-16"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-maroon-700/40 blur-3xl" />
        <div className="absolute -bottom-24 right-0 h-96 w-96 rounded-full bg-gold-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-5 sm:px-8 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-gold-500/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-gold-400">
            <Flame size={14} />
            Solusi Untuk Lapar Mu
          </span>

          <h1 className="mt-5 font-display text-4xl font-bold leading-[1.1] text-cream-50 sm:text-5xl lg:text-6xl">
            Nasi Goreng
            <br />
            <span className="text-gold-400">Jaya Bintang</span>
          </h1>

          <p className="mt-5 max-w-md text-base leading-relaxed text-cream-50/80 sm:text-lg">
            Nasi goreng dan mie goreng dengan racikan bumbu autentik, disajikan
            hangat setiap hari untuk menemani lapar Anda kapan saja.
          </p>

          <p className="mt-3 max-w-md text-sm text-cream-50/60">
            Berlokasi di Sumberbaru, Jember — siap melayani pesanan Anda
            langsung lewat WhatsApp.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href={waLinkWithMessage("Halo, saya ingin pesan nasi goreng")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full bg-gold-500 px-7 py-3.5 text-sm font-bold text-maroon-950 shadow-soft transition-transform hover:scale-105 hover:bg-gold-400 active:scale-95"
            >
              <MessageCircle size={18} />
              Pesan Sekarang
            </a>
            <a
              href="#menu"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector("#menu")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="flex items-center gap-2 rounded-full border-2 border-cream-50/25 px-7 py-3.5 text-sm font-bold text-cream-50 transition-colors hover:border-gold-400 hover:text-gold-400"
            >
              Lihat Menu
              <ChevronDown size={18} />
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
          className="relative mx-auto w-full max-w-sm md:max-w-none"
        >
          <motion.div
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            className="relative aspect-square overflow-hidden rounded-[2rem] shadow-soft ring-4 ring-cream-50/10"
          >
            <Image
              src="/makanan.jpg"
              alt="Nasi Goreng Jaya Bintang"
              fill
              priority
              sizes="(max-width: 768px) 90vw, 480px"
              className="object-cover"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="absolute -left-2 bottom-6 rounded-2xl bg-cream-50 px-5 py-3 shadow-soft sm:-left-8"
          >
            <p className="font-display text-2xl font-extrabold text-maroon-900">8K+</p>
            <p className="text-xs font-semibold text-maroon-700/70">Mulai dari</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
