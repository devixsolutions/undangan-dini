
'use client';

import { motion } from "framer-motion";

const EVENT_DAY = "Kamis";
const EVENT_DATE = "20 Februari 2025";
const EVENT_LOCATION = "Gedung Serbaguna Kecamatan Moga, Pemalang, Jawa Tengah";
const GOOGLE_MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Gedung+Serbaguna+Kecamatan+Moga+Pemalang";

const schedule = [
  {
    title: "Akad Nikah",
    time: "08.00 - 09.00 WIB",
    description:
      "Prosesi sakral pernikahan dengan keluarga inti dan saksi.",
  },
  {
    title: "Resepsi Pernikahan",
    time: "10.00 - 13.00 WIB",
    description:
      "Silaturahmi sekaligus ungkapan rasa syukur bersama kerabat dan sahabat.",
  },
];

export default function AcaraSection() {
  return (
    <section
      id="acara"
      className="relative flex flex-col items-center justify-center bg-[#f8f4ee] px-6 py-24 sm:px-10 sm:py-28"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 0.25, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="hidden h-32 w-full max-w-lg rounded-full border border-[#8b0000]/10 bg-white/60 blur-3xl sm:block"
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
          Rangkaian Acara
        </span>
        <h2 className="font-script text-4xl text-[#8b0000] sm:text-5xl">
          Hari Bahagia Kami
        </h2>
        <p className="text-sm text-[#7c6651] sm:text-base">
          {EVENT_DAY}, {EVENT_DATE}
        </p>
      </motion.div>

      <div className="mt-12 grid w-full max-w-4xl gap-6 sm:mt-16">
        {schedule.map((item, index) => (
          <motion.article
            key={item.title}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.7, delay: index * 0.15, ease: "easeOut" }}
            className="relative overflow-hidden rounded-3xl border border-[#eadacc] bg-white/75 p-8 shadow-[0_18px_40px_-25px_rgba(111,54,38,0.35)] backdrop-blur"
          >
            <div className="absolute inset-x-10 top-0 h-20 rounded-b-full bg-[#f3e7da]/70 blur-3xl sm:inset-x-16" />
            <div className="relative flex flex-col gap-2 text-center sm:text-left">
              <h3 className="font-display text-xs uppercase tracking-[0.35em] text-[#a7723a] sm:text-sm">
                {item.title}
              </h3>
              <p className="font-script text-3xl text-[#8b0000] sm:text-4xl">
                {item.time}
              </p>
              <p className="text-sm leading-relaxed text-[#7c6651] sm:text-base">
                {item.description}
              </p>
            </div>
          </motion.article>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        className="mt-14 flex max-w-3xl flex-col items-center text-center"
      >
        <p className="text-sm leading-relaxed text-[#7c6651] sm:text-base">
          {EVENT_LOCATION}
        </p>
        <a
          href={GOOGLE_MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#8b0000] px-10 py-3 text-sm font-semibold uppercase tracking-widest text-white shadow-lg shadow-[#8b0000]/30 transition-transform hover:-translate-y-1 hover:bg-[#700000] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8b0000] sm:text-base"
        >
          Buka Google Maps
        </a>
      </motion.div>
    </section>
  );
}


