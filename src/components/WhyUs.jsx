"use client";

import { motion } from "framer-motion";
import { Leaf, Wallet, ChefHat, Smile } from "lucide-react";

const reasons = [
  {
    icon: Leaf,
    title: "Bahan Berkualitas",
    desc: "Bahan segar dan pilihan diolah setiap hari untuk menjaga cita rasa terbaik.",
  },
  {
    icon: Wallet,
    title: "Harga Terjangkau",
    desc: "Menu lengkap dengan harga bersahabat, mulai dari 8K saja.",
  },
  {
    icon: ChefHat,
    title: "Rasa Lezat",
    desc: "Racikan bumbu khas yang konsisten di setiap porsi nasi goreng dan mie goreng.",
  },
  {
    icon: Smile,
    title: "Pelayanan Ramah",
    desc: "Melayani pesanan dengan cepat dan ramah, langsung melalui WhatsApp.",
  },
];

export default function WhyUs() {
  return (
    <section className="bg-cream-50 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="text-xs font-bold uppercase tracking-widest text-gold-600">
            Kenapa Memilih Kami
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold text-maroon-900 sm:text-4xl">
            Alasan Untuk Mampir
          </h2>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((reason, i) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
              whileHover={{ y: -8 }}
              className="flex flex-col items-start gap-4 rounded-2xl bg-white p-6 shadow-card transition-shadow hover:shadow-soft"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-maroon-900 text-gold-400">
                <reason.icon size={22} />
              </div>
              <h3 className="font-display text-lg font-bold text-maroon-900">
                {reason.title}
              </h3>
              <p className="text-sm leading-relaxed text-maroon-800/70">
                {reason.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
