"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu as MenuIcon, X, MessageCircle, Bot } from "lucide-react";
import { restaurant } from "@/data/restaurant";

const links = [
  { label: "Home", href: "#home" },
  { label: "Menu", href: "#menu" },
  { label: "Tentang", href: "#tentang" },
  { label: "Lokasi", href: "#lokasi" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        setScrolled(window.scrollY > 24);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[padding] duration-300 ${
        scrolled ? "py-4" : "py-6"
      }`}
    >
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 -z-10 bg-cream-50/90 shadow-card backdrop-blur-md transition-opacity duration-300 will-change-[opacity] ${
          scrolled ? "opacity-100" : "opacity-0"
        }`}
      />
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 sm:px-8">
        
          href="#home"
          onClick={(e) => handleNavClick(e, "#home")}
          className={`font-script text-2xl tracking-wide sm:text-3xl ${
            scrolled ? "text-maroon-900" : "text-gold-400"
          }`}
        >
          Nasgor Jaya Bintang
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className={`text-sm font-semibold transition-colors ${
                scrolled
                  ? "text-maroon-800 hover:text-gold-600"
                  : "text-cream-50/90 hover:text-gold-400"
              }`}
            >
              {link.label}
            </a>
          ))}
          <Link
            href="/customer-service"
            aria-label="Buka Jaya Bintang AI"
            className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${
              scrolled
                ? "border-maroon-900/15 text-maroon-900 hover:border-gold-500 hover:text-gold-600"
                : "border-cream-50/25 text-cream-50 hover:border-gold-400 hover:text-gold-400"
            }`}
          >
            <Bot size={18} />
          </Link>

          
            href={restaurant.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full bg-gold-500 px-5 py-2.5 text-sm font-bold text-maroon-950 shadow-card transition-transform hover:scale-105 hover:bg-gold-400 active:scale-95"
          >
            <MessageCircle size={16} />
            Pesan Sekarang
          </a>
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <Link
            href="/customer-service"
            aria-label="Buka Jaya Bintang AI"
            className={scrolled ? "text-maroon-900" : "text-cream-50"}
          >
            <Bot size={24} />
          </Link>

          <button
            type="button"
            aria-label="Buka menu navigasi"
            onClick={() => setOpen((v) => !v)}
            className={scrolled ? "text-maroon-900" : "text-cream-50"}
          >
            {open ? <X size={26} /> : <MenuIcon size={26} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="absolute inset-x-0 top-full bg-cream-50 shadow-card md:hidden"
          >
            <div className="flex flex-col gap-1 px-5 py-4">
              {links.map((link) => (
                
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="rounded-lg px-3 py-3 text-sm font-semibold text-maroon-900 hover:bg-maroon-950/5"
                >
                  {link.label}
                </a>
              ))}
              
                href={restaurant.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 flex items-center justify-center gap-2 rounded-full bg-gold-500 px-5 py-3 text-sm font-bold text-maroon-950"
              >
                <MessageCircle size={16} />
                Pesan Sekarang
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
            }
