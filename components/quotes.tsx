'use client';

import { motion } from "framer-motion";

const verseTranslation =
  "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sungguh, pada yang demikian itu benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir.";

export default function QuotesSection() {
  return (
    <section
      id="kutipan"
      className="relative flex min-h-[420px] items-center justify-center bg-[#f1e8de]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.68),transparent)]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative mx-auto flex max-w-3xl flex-col gap-6 px-8 py-20 text-center sm:px-12"
      >
        <div className="space-y-2">
          <span className="font-display text-xs uppercase tracking-[0.46em] text-[#a7723a] sm:text-sm">
            Kutipan Ayat
          </span>
          <p className="text-sm uppercase tracking-[0.28em] text-[#8b0000]/80 sm:text-base">
            QS. Ar-Rum Ayat 21
          </p>
        </div>

        <blockquote className="rounded-3xl border border-[#e5d4c3] bg-white/80 p-10 text-[#5d4a3a] shadow-[0_20px_40px_-30px_rgba(111,54,38,0.4)] backdrop-blur">
          <p className="text-base leading-relaxed sm:text-lg">
            {verseTranslation}
          </p>
        </blockquote>

        <footer className="text-xs uppercase tracking-[0.42em] text-[#a7723a]/70 sm:text-sm">
          Quran Surah Ar-Rum
        </footer>
      </motion.div>
    </section>
  );
}


