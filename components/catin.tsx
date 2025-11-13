'use client';

import { motion } from "framer-motion";

type Person = {
  role: "Mempelai Pria" | "Mempelai Wanita";
  fullName: string;
  parentPrefix: "Putra dari" | "Putri dari";
  parents: string[];
  nickname?: string;
};

const brideAndGroom: Person[] = [
  {
    role: "Mempelai Pria",
    nickname: "Kusyanto",
    fullName: "Kusyanto, S.Pd.",
    parentPrefix: "Putra dari",
    parents: ["Bapak Sutarto", "Ibu Sri Wahyuni"],
  },
  {
    role: "Mempelai Wanita",
    nickname: "Dini",
    fullName: "Dini Jumartini, S.E.",
    parentPrefix: "Putri dari",
    parents: ["Bapak Suwarno", "Ibu Siti Qomariyah"],
  },
];

export default function CatinSection() {
  return (
    <section
      id="mempelai"
      className="relative flex min-h-screen flex-col items-center justify-center bg-[#f9f6f1]/95 px-6 py-24 sm:px-10 sm:py-28"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 0.22, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="hidden h-36 w-full max-w-md rounded-full border border-[#8b0000]/15 bg-white/40 blur-3xl sm:block"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center gap-4 text-center"
      >
        <span className="font-display text-xs uppercase tracking-[0.45em] text-[#a7723a] sm:text-sm">
          Mempelai
        </span>
        <h2 className="font-script text-4xl text-[#8b0000] sm:text-5xl">
          Catin Kami
        </h2>
        <p className="max-w-2xl text-sm leading-relaxed text-[#7c6651] sm:text-base">
          Dengan ridho Allah SWT serta doa restu dari orang tua dan sahabat semua,
          kami mempersembahkan seuntai kisah yang akan kami lanjutkan menuju
          pernikahan.
        </p>
      </motion.div>

      <div className="mt-12 grid w-full max-w-5xl gap-8 sm:mt-16 sm:grid-cols-2">
        {brideAndGroom.map((person, index) => (
          <motion.article
            key={person.role}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: index * 0.2, ease: "easeOut" }}
            className="relative overflow-hidden rounded-3xl border border-[#e7d7c8] bg-white/70 p-8 shadow-[0_18px_40px_-25px_rgba(111,54,38,0.35)] backdrop-blur"
          >
            <div className="absolute inset-x-10 top-0 h-24 rounded-b-full bg-[#f3e7da]/60 blur-2xl sm:inset-x-14" />
            <div className="relative flex h-full flex-col items-center gap-4 text-center">
              <span className="rounded-full bg-[#f7ece1] px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#a7723a]">
                {person.role}
              </span>

              {person.nickname ? (
                <p className="font-script text-4xl text-[#8b0000] sm:text-[42px]">
                  {person.nickname}
                </p>
              ) : null}

              <h3 className="text-xl font-semibold uppercase tracking-[0.08em] text-[#5d4a3a] sm:text-2xl">
                {person.fullName}
              </h3>

              <div className="mt-2 space-y-1 text-sm text-[#7c6651] sm:text-base">
                <p className="font-medium uppercase tracking-[0.2em] text-[#b18f7d]/80">
                  {person.parentPrefix}
                </p>
                {person.parents.map((parent) => (
                  <p key={parent} className="font-medium text-[#5d4a3a]">
                    {parent}
                  </p>
                ))}
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}


