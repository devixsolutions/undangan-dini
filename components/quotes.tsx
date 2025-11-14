'use client';

import { motion } from "framer-motion";
import Image from "next/image";
import { getWeddingData } from "@/lib/data";

export default function QuotesSection() {
  const data = getWeddingData();
  return (
    <section
      id="kutipan"
      className="relative flex min-h-[420px] items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0">
        <Image
          src="/assets/scrapbg.jpg"
          alt="Background"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.68),transparent)]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 mx-auto flex max-w-3xl flex-col gap-6 px-8 py-20 text-center sm:px-12"
      >
        <div className="space-y-2">
          <span className="font-display text-xs uppercase tracking-[0.46em] text-[#a7723a] sm:text-sm">
            Kutipan Ayat
          </span>
          <p className="text-sm uppercase tracking-[0.28em] text-[#8b0000]/80 sm:text-base">
            {data.quotes.surah}
          </p>
        </div>

        <blockquote className="rounded-3xl border border-[#e5d4c3] bg-white/80 p-10 text-[#5d4a3a] shadow-[0_20px_40px_-30px_rgba(111,54,38,0.4)] backdrop-blur">
          <p className="text-base leading-relaxed sm:text-lg">
            {data.quotes.verse}
          </p>
        </blockquote>

        <footer className="text-xs uppercase tracking-[0.42em] text-[#a7723a]/70 sm:text-sm">
          {data.quotes.footer}
        </footer>
      </motion.div>
    </section>
  );
}


