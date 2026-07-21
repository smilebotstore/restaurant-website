"use client";

import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { ChefHat, User } from "lucide-react";

export default function ChatMessage({ role, content }) {
  const isUser = role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`flex items-start gap-2 ${isUser ? "flex-row-reverse" : ""}`}
    >
      <div
        className={`mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
          isUser ? "bg-gold-500 text-maroon-950" : "bg-cream-50/10 text-gold-400"
        }`}
      >
        {isUser ? <User size={14} /> : <ChefHat size={14} />}
      </div>

      <div
        className={`min-w-0 max-w-[75%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed shadow-card ${
          isUser
            ? "rounded-tr-md bg-gold-500 text-maroon-950"
            : "rounded-tl-md border border-cream-50/10 bg-maroon-900 text-cream-50"
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap break-words">{content}</p>
        ) : (
          <div className="break-words">
            <ReactMarkdown
              components={{
                p: ({ children }) => (
                  <p className="mb-2 last:mb-0">{children}</p>
                ),
                strong: ({ children }) => (
                  <strong className="font-bold text-gold-400">{children}</strong>
                ),
                em: ({ children }) => (
                  <em className="text-cream-50/70">{children}</em>
                ),
                ul: ({ children }) => (
                  <ul className="mb-2 ml-3.5 list-disc space-y-0.5 last:mb-0">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="mb-2 ml-3.5 list-decimal space-y-0.5 last:mb-0">
                    {children}
                  </ol>
                ),
                li: ({ children }) => <li>{children}</li>,
                a: ({ children, href }) => (
                  <a href={href} target="_blank" rel="noopener noreferrer" className="font-semibold text-gold-400 underline">
                    {children}
                  </a>
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </motion.div>
  );
}
