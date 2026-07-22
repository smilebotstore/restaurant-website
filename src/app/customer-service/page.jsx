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
  ImagePlus,
  X,
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

const MEMORY_KEY = "jb-ai-memory";
const MEMORY_LIMIT = 16; // ~8 pertukaran pesan lama yang tetap diingat AI
const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB

function loadMemory() {
  try {
    const raw = window.localStorage.getItem(MEMORY_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveMemory(memory) {
  try {
    window.localStorage.setItem(
      MEMORY_KEY,
      JSON.stringify(memory.slice(-MEMORY_LIMIT))
    );
  } catch {
    // localStorage tidak tersedia (mis. private mode) — abaikan, memori tidak fatal.
  }
}

export default function CustomerServicePage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [attachedImage, setAttachedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const bodyRef = useRef(null);
  const fileInputRef = useRef(null);
  // Memori percakapan lintas-sesi: dikirim ke AI supaya dia tetap "ingat" user,
  // tapi TIDAK ditaruh di state `messages` sehingga tidak ikut tampil di UI
  // ketika user keluar-masuk halaman ini lagi.
  const memoryRef = useRef([]);

  useEffect(() => {
    memoryRef.current = loadMemory();
  }, []);

  // Lepas object URL preview gambar saat komponen unmount supaya tidak bocor memori.
  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  // Kunci scroll halaman (html/body) selama di halaman ini supaya scroll-into-view
  // di bawah tidak pernah "bocor" ke document dan membuat layout terasa mentok/stuck.
  useEffect(() => {
    const { style } = document.body;
    const prevOverflow = style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      style.overflow = prevOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
    };
  }, []);

  useEffect(() => {
    // Scroll hanya di dalam container chat itu sendiri (bukan scrollIntoView,
    // yang bisa ikut menggeser scroll ancestor/document di beberapa browser mobile).
    const el = bodyRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
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
        body: JSON.stringify({
          messages: nextMessages,
          memory: memoryRef.current,
        }),
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

      const updatedMemory = [
        ...memoryRef.current,
        { role: "user", content: trimmed },
        { role: "assistant", content: data.reply },
      ];
      memoryRef.current = updatedMemory;
      saveMemory(updatedMemory);
    } catch (err) {
      setErrorMsg("Koneksi bermasalah. Periksa internet kamu lalu coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  async function sendImageMessage(text, file) {
    if (loading) return;
    const trimmed = text.trim();

    const localImageUrl = URL.createObjectURL(file);
    const nextMessages = [
      ...messages,
      { role: "user", content: trimmed, image: localImageUrl },
    ];
    setMessages(nextMessages);
    setInput("");
    removeAttachedImage();
    setErrorMsg("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);
      if (trimmed) formData.append("query", trimmed);

      const res = await fetch("/api/vision", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(
          data?.error || "Gagal menganalisis gambar, coba lagi ya."
        );
        setLoading(false);
        return;
      }

      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);

      const updatedMemory = [
        ...memoryRef.current,
        { role: "user", content: trimmed || "[mengirim gambar]" },
        { role: "assistant", content: data.reply },
      ];
      memoryRef.current = updatedMemory;
      saveMemory(updatedMemory);
    } catch (err) {
      setErrorMsg("Koneksi bermasalah. Periksa internet kamu lalu coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  function handleImageSelect(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMsg("File yang dipilih harus berupa gambar.");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setErrorMsg("Ukuran gambar maksimal 5MB.");
      return;
    }

    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setErrorMsg("");
    setAttachedImage(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function removeAttachedImage() {
    setAttachedImage(null);
    setImagePreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return "";
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (attachedImage) {
      sendImageMessage(input, attachedImage);
    } else {
      sendMessage(input);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (attachedImage) {
        sendImageMessage(input, attachedImage);
      } else {
        sendMessage(input);
      }
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
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative flex shrink-0 items-center justify-between border-b border-cream-50/10 bg-maroon-950/95 px-4 py-3.5 backdrop-blur sm:px-6"
      >
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
      </motion.header>

      {/* Body */}
      <div
        ref={bodyRef}
        className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6 sm:py-6"
      >
        {!hasMessages ? (
          <div className="mx-auto flex min-h-full max-w-lg flex-col items-center justify-center py-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
              className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-500/15 text-gold-400 sm:h-16 sm:w-16 sm:rounded-2xl"
            >
              <ChefHat size={22} className="sm:hidden" />
              <ChefHat size={28} className="hidden sm:block" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
              className="mt-4 font-display text-xl font-bold text-cream-50 sm:mt-5 sm:text-3xl"
            >
              Selamat Datang di Jaya Bintang AI
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
              className="mt-2 max-w-sm text-xs leading-relaxed text-cream-50/60 sm:text-sm"
            >
              Tanya apa saja soal menu, harga, promo, atau cara pesan di Nasi
              Goreng Jaya Bintang. Belum tahu mau tanya apa?
            </motion.p>

            <div className="mt-5 grid w-full grid-cols-1 gap-2.5 sm:mt-8 sm:grid-cols-2 sm:gap-3">
              {suggestions.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.45,
                    ease: "easeOut",
                    delay: 0.4 + i * 0.08,
                  }}
                >
                  <SuggestionCard
                    icon={s.icon}
                    iconBg={s.iconBg}
                    label={s.label}
                    onClick={() => sendMessage(s.prompt)}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mx-auto flex min-h-full max-w-2xl flex-col gap-4">
            <div className="mt-auto" />
            {messages.map((m, i) => (
              <ChatMessage key={i} role={m.role} content={m.content} image={m.image} />
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

          </div>
        )}
      </div>

      {/* Input bar */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 }}
        className="relative shrink-0 border-t border-cream-50/10 bg-maroon-950 px-3 pb-3 pt-2.5 sm:px-6 sm:py-3"
      >
        <form
          onSubmit={handleSubmit}
          className="mx-auto flex max-w-2xl flex-col gap-2 rounded-xl border-2 border-cream-50/10 bg-maroon-900 px-2.5 py-1.5 transition-colors focus-within:border-gold-400"
        >
          {imagePreview && (
            <div className="relative w-fit">
              <img
                src={imagePreview}
                alt="Pratinjau gambar"
                className="h-16 w-16 rounded-lg object-cover"
              />
              <button
                type="button"
                onClick={removeAttachedImage}
                aria-label="Hapus gambar"
                className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-maroon-950 text-cream-50 shadow-card"
              >
                <X size={11} />
              </button>
            </div>
          )}

          <div className="flex items-end gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                attachedImage
                  ? "Tambahkan pertanyaan soal gambar (opsional)..."
                  : "Tanya soal menu, harga, atau cara pesan..."
              }
              className="max-h-28 flex-1 resize-none bg-transparent px-1.5 py-2 text-[13px] text-cream-50 placeholder:text-cream-50/35 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              aria-label="Unggah gambar"
              className={`mb-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors disabled:opacity-40 ${
                attachedImage
                  ? "bg-gold-500/20 text-gold-400"
                  : "bg-cream-50/10 text-cream-50/70 hover:text-gold-400"
              }`}
            >
              <ImagePlus size={15} />
            </button>
            <button
              type="submit"
              disabled={loading || (!input.trim() && !attachedImage)}
              aria-label="Kirim pesan"
              className="mb-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold-500 text-maroon-950 transition-transform hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100"
            >
              <Send size={14} />
            </button>
          </div>
        </form>
        <p className="mx-auto mt-1.5 max-w-2xl text-center text-[10px] leading-snug text-cream-50/35">
          Jaya Bintang AI dapat memberikan info yang kurang akurat. Untuk pemesanan pasti, hubungi{" "}
          <a href={restaurant.whatsappUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-gold-400 hover:underline">WhatsApp kami</a>.
        </p>
      </motion.div>
    </div>
  );
}
