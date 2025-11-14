
'use client';

import { motion } from "framer-motion";
import { useState } from "react";
import { getWeddingData } from "@/lib/data";

type GiftOption = {
  bank: string;
  accountNumber: string;
  accountName: string;
  description?: string;
};

export default function GiftSection() {
  const data = getWeddingData();
  const giftOptions: GiftOption[] = data.gift.accounts;
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = async (accountNumber: string, index: number) => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(accountNumber);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = accountNumber;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }

      setCopiedIndex(index);
      window.setTimeout(() => setCopiedIndex(null), 2000);
    } catch (error) {
      console.error("Failed to copy account number:", error);
    }
  };

  return (
    <section
      id="gift"
      className="relative flex flex-col items-center justify-center bg-[#f5f0ea] px-6 py-24 sm:px-10 sm:py-28"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-white/70 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-white/70 to-transparent" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative flex max-w-3xl flex-col items-center gap-4 text-center"
      >
        <span className="font-display text-xs uppercase tracking-[0.45em] text-[#a7723a] sm:text-sm">
          {data.gift.title}
        </span>
        <h2 className="font-script text-4xl text-[#8b0000] sm:text-5xl">
          {data.gift.heading}
        </h2>
        <p className="text-sm leading-relaxed text-[#7c6651] sm:text-base">
          {data.gift.description}
        </p>
      </motion.div>

      <div className="relative mt-12 grid w-full max-w-4xl gap-6 sm:mt-16 sm:grid-cols-2">
        {giftOptions.map((gift, index) => (
          <motion.article
            key={gift.accountNumber}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: index * 0.15, ease: "easeOut" }}
            className="relative overflow-hidden rounded-3xl border border-[#eadacc] bg-white/80 p-8 shadow-[0_18px_40px_-25px_rgba(111,54,38,0.35)] backdrop-blur"
          >
            <div className="absolute inset-x-10 top-0 h-20 rounded-b-full bg-[#f3e7da]/70 blur-3xl" />
            <div className="relative flex h-full flex-col gap-4 text-center">
              <span className="font-display text-xs uppercase tracking-[0.4em] text-[#a7723a]">
                {gift.bank}
              </span>
              <p className="text-2xl font-semibold tracking-[0.08em] text-[#5d4a3a] sm:text-3xl">
                {gift.accountNumber}
              </p>
              <p className="text-sm uppercase tracking-[0.28em] text-[#b18f7d] sm:text-base">
                a.n {gift.accountName}
              </p>
              {gift.description ? (
                <p className="text-sm leading-relaxed text-[#7c6651] sm:text-base">
                  {gift.description}
                </p>
              ) : null}

              <button
                type="button"
                onClick={() => handleCopy(gift.accountNumber, index)}
                className="mx-auto inline-flex items-center gap-2 rounded-full bg-[#8b0000] px-8 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white shadow-md shadow-[#8b0000]/30 transition-transform hover:-translate-y-1 hover:bg-[#700000] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8b0000]"
              >
                {copiedIndex === index ? data.gift.copiedButtonText : data.gift.copyButtonText}
              </button>
            </div>
          </motion.article>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
        className="relative mt-16 max-w-3xl text-center"
      >
        <p className="text-sm leading-relaxed text-[#7c6651] sm:text-base">
          Untuk kado fisik dapat dikirimkan ke alamat rumah mempelai pria di {data.gift.physicalGift.address} {data.gift.physicalGift.note}
        </p>
      </motion.div>
    </section>
  );
}


