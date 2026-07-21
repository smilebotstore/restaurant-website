"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ChefHat,
  Send,
  UtensilsCrossed,
  Bike,
  MapPin,
  Sparkles,
} from "lucide-react";
import ChatMessage from "@/components/chat/ChatMessage";
import SuggestionCard from "@/components/chat/SuggestionCard";
import { restaurant } from "@/data/restaurant";

const suggestions = [
  {
    icon: UtensilsCrossed,
    iconBg: "bg-gold-500/15 text-gold-400",
    label: "Lihat Menu Lengkap",
    prompt: "Apa saja menu yang tersedia beserta harganya?",
  },
  {
    icon: Bike,
    iconBg: "bg-cream-50/10 text-cream-50/80",
    label: "Cara Pesan",
    prompt: "Bagaimana cara memesan di Jaya Bintang?",
  },
  {
    icon: MapPin,
    iconBg: "bg-gold-500/15 text-gold-400",
    label: "Lokasi & Jam Buka",
    prompt: "Dimana lokasi warung dan jam berapa buka?",
  },
  {
    icon: Sparkles,
    iconBg: "bg-cream-50/10 text-cream-50/80",
    label: "Promo Hari Ini",
    prompt: "Ada promo apa hari ini?",
  },
];

export default function CustomerServicePage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(text) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const nextMessages = [...messages, { role: "user", content: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(
          data?.error || "Jaya Bintang AI sedang bermasalah, coba lagi ya."
        );
        setLoading(false);
        return;
      }

      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch (err) {
      setErrorMsg("Koneksi bermasalah. Periksa internet kamu lalu coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    sendMessage(input);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  const hasMessages = messages.length > 0;

  return (
    <div className="relative flex h-dvh flex-col overflow-hidden bg-maroon-950">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-maroon-700/30 blur-3xl" />
        <div className="absolute -bottom-24 right-0 h-96 w-96 rounded-full bg-gold-500/10 blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative flex shrink-0 items-center justify-between border-b border-cream-50/10 bg-maroon-950/95 px-4 py-3.5 backdrop-blur sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-semibold text-cream-50/80 transition-colors hover:text-gold-400"
        >
          <ArrowLeft size={18} />
          Halaman Utama
        </Link>

        <div className="flex items-center gap-2.5">
          <div className="text-right">
            <p className="font-display text-sm font-bold leading-tight text-cream-50 sm:text-base">
              Jaya Bintang AI
            </p>
            <p className="flex items-center justify-end gap-1.5 text-[11px] text-cream-50/50">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              Customer Service
            </p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-500/15 text-gold-400">
            <ChefHat size={17} />
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="relative flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        {!hasMessages ? (
          <div className="mx-auto flex h-full max-w-lg flex-col items-center justify-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gold-500/15 text-gold-400 shadow-soft">
              <ChefHat size={28} />
            </div>
            <h1 className="mt-5 font-display text-2xl font-bold text-cream-50 sm:text-3xl">
              Selamat Datang di Jaya Bintang AI
            </h1>
            <p className="mt-2.5 max-w-sm text-sm leading-relaxed text-cream-50/60">
              Tanya apa saja soal menu, harga, promo, atau cara pesan di Nasi
              Goreng Jaya Bintang. Belum tahu mau tanya apa?
            </p>

            <div className="mt-8 grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
              {suggestions.map((s) => (
                <SuggestionCard
                  key={s.label}
                  icon={s.icon}
                  iconBg={s.iconBg}
                  label={s.label}
                  onClick={() => sendMessage(s.prompt)}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="mx-auto flex max-w-2xl flex-col gap-5">
            {messages.map((m, i) => (
              <ChatMessage key={i} role={m.role} content={m.content} />
            ))}

            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-end gap-2.5"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cream-50/10 text-gold-400">
                  <ChefHat size={15} />
                </div>
                <div className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-cream-50/10 bg-maroon-900 px-4 py-3 shadow-card">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="h-1.5 w-1.5 rounded-full bg-cream-50/40"
                      animate={{ y: [0, -4, 0] }}
                      transition={{
                        duration: 0.9,
                        repeat: Infinity,
                        delay: i * 0.15,
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {errorMsg && (
              <div className="mx-auto max-w-md rounded-xl bg-red-500/10 px-4 py-2.5 text-center text-xs font-medium text-red-400">
                {errorMsg}
              </div>
            )}

            <div ref={scrollRef} />
          </div>
        )}
      </div>

      {/* Input bar */}
      <div className="relative shrink-0 border-t border-cream-50/10 bg-maroon-950 px-4 py-3.5 sm:px-6">
        <form
          onSubmit={handleSubmit}
          className="mx-auto flex max-w-2xl items-end gap-2 rounded-2xl border-2 border-cream-50/10 bg-maroon-900 px-3 py-2 transition-colors focus-within:border-gold-400"
        >
          <textarea
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Tanya soal menu, harga, atau cara pesan..."
            className="max-h-28 flex-1 resize-none bg-transparent px-2 py-2 text-sm text-cream-50 placeholder:text-cream-50/35 focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            aria-label="Kirim pesan"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-500 text-maroon-950 transition-transform hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100"
          >
            <Send size={15} />
          </button>
        </form>
        <p className="mx-auto mt-2.5 max-w-2xl text-center text-[11px] leading-relaxed text-cream-50/40">
          Jaya Bintang AI dapat memberikan info yang kurang akurat. Untuk
          pemesanan pasti, hubungi{" "}
          <a href={restaurant.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-gold-400 hover:underline"
          >
            WhatsApp kami
          </a>
          .
        </p>
      </div>
    </div>
  );
}
