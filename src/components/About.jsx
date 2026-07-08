"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { UtensilsCrossed } from "lucide-react";

export default function About() {
  return (
    <section id="tentang" className="bg-white py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-5 sm:px-8 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-[2rem] shadow-soft"
        >
          <Image
            src="/makanan.jpg"
            alt="Sajian Nasi Goreng Jaya Bintang"
            fill
            sizes="(max-width: 768px) 90vw, 400px"
            className="object-cover"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gold-600">
            <UtensilsCrossed size={14} />
            Tentang Kami
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold text-maroon-900 sm:text-4xl">
            Nasi Goreng Jaya Bintang
          </h2>
          <p className="mt-5 leading-relaxed text-maroon-800/80">
            Nasi Goreng Jaya Bintang adalah warung nasi goreng dan mie goreng
            yang berlokasi di Sumberbaru, Jember. Kami menyajikan berbagai
            varian nasi goreng dan mie goreng, mulai dari yang klasik hingga
            dengan topping istimewa seperti udang, cumi, dan sayuran segar.
          </p>
          <p className="mt-4 leading-relaxed text-maroon-800/80">
            Setiap porsi dimasak dengan racikan bumbu sendiri untuk
            menghadirkan cita rasa yang konsisten dan mengenyangkan, cocok
            untuk makan di tempat maupun dipesan untuk dibawa pulang.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
