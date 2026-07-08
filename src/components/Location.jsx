"use client";

import { motion } from "framer-motion";
import { MapPin, MessageCircle, Navigation } from "lucide-react";
import { restaurant } from "@/data/restaurant";

export default function Location() {
  return (
    <section id="lokasi" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="text-xs font-bold uppercase tracking-widest text-gold-600">
            Lokasi
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold text-maroon-900 sm:text-4xl">
            Kunjungi Warung Kami
          </h2>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.55 }}
            className="flex flex-col justify-between rounded-2xl bg-maroon-950 p-8 text-cream-50 shadow-soft"
          >
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-500/15 text-gold-400">
                <MapPin size={22} />
              </div>
              <h3 className="mt-5 font-display text-xl font-bold">Alamat</h3>
              <p className="mt-3 leading-relaxed text-cream-50/80">
                {restaurant.address}
              </p>

              <h3 className="mt-6 font-display text-xl font-bold">WhatsApp</h3>
              <p className="mt-2 leading-relaxed text-cream-50/80">
                {restaurant.whatsappNumber}
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={restaurant.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-full bg-gold-500 px-6 py-3 text-sm font-bold text-maroon-950 transition-transform hover:scale-105 hover:bg-gold-400 active:scale-95"
              >
                <Navigation size={16} />
                Buka Google Maps
              </a>
              <a
                href={restaurant.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-full border-2 border-cream-50/25 px-6 py-3 text-sm font-bold text-cream-50 transition-colors hover:border-gold-400 hover:text-gold-400"
              >
                <MessageCircle size={16} />
                Hubungi Kami
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.55 }}
            className="overflow-hidden rounded-2xl shadow-soft"
          >
            <iframe
              title="Lokasi Nasi Goreng Jaya Bintang"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(
                restaurant.address
              )}&output=embed`}
              className="h-full min-h-[320px] w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
