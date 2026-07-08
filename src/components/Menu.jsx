"use client";

import { motion } from "framer-motion";
import { Info } from "lucide-react";
import {
  menuMieGoreng,
  menuMinuman,
  menuNasiGoreng,
  promoNote,
} from "@/data/restaurant";
import MenuCard from "./MenuCard";

const groups = [
  { title: "Menu Nasi Goreng", items: menuNasiGoreng },
  { title: "Menu Mie Goreng", items: menuMieGoreng },
  { title: "Menu Minuman", items: menuMinuman },
];

export default function Menu() {
  return (
    <section id="menu" className="bg-cream-50 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="text-xs font-bold uppercase tracking-widest text-gold-600">
            Menu Kami
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold text-maroon-900 sm:text-4xl">
            Nasi Goreng &amp; Mie Goreng
          </h2>
          <p className="mt-3 text-maroon-800/70">
            Solusi untuk lapar mu, pilih menu favoritmu dan pesan langsung
            lewat WhatsApp.
          </p>
        </motion.div>

        <div className="mt-14 space-y-14">
          {groups.map((group) => (
            <div key={group.title}>
              <h3 className="mb-6 font-display text-xl font-bold text-maroon-800">
                {group.title}
              </h3>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {group.items.map((item, i) => (
                  <MenuCard key={item.name} item={item} index={i} />
                ))}
              </div>
            </div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="mt-12 flex items-start gap-3 rounded-2xl bg-gold-500/10 p-5 text-sm text-maroon-900"
        >
          <Info size={18} className="mt-0.5 shrink-0 text-gold-600" />
          <p>{promoNote}</p>
        </motion.div>
      </div>
    </section>
  );
}
