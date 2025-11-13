'use client';

import { motion } from "framer-motion";

export default function Greetings() {
  const groom = "Kusyanto";
  const bride = "Dini Jumartini";
  const weddingDate = "Sabtu, 12 April 2025";
  const location = "Gedung Graha Saba Buana — Surakarta";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
      <motion.span
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        className="font-display text-xs uppercase tracking-[0.45em] text-[#a7723a] sm:text-sm"
      >
        Wedding Invitation
      </motion.span>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.35, ease: "easeOut" }}
        className="flex flex-col items-center gap-3"
      >
        <h1 className="font-script text-5xl leading-tight text-[#8b0000] drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)] sm:text-6xl">
          {groom}
        </h1>
        <span className="text-3xl text-[#8b0000] sm:text-4xl">&amp;</span>
        <h2 className="font-script text-5xl leading-tight text-[#8b0000] drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)] sm:text-6xl">
          {bride}
        </h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.55, ease: "easeOut" }}
        className="flex flex-col items-center gap-1 text-[#7c6651]"
      >
        <p className="text-base font-medium uppercase tracking-[0.3em] sm:text-lg">
          {weddingDate}
        </p>
        {location ? (
          <p className="text-sm uppercase tracking-[0.25em] text-[#a7723a]/80 sm:text-base">
            {location}
          </p>
        ) : null}
      </motion.div>
    </div>
  );
}

