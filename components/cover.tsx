'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from "next/image";
import { motion } from "framer-motion";
import { useInvitation } from "@/components/invitation-context";

const LOCAL_STORAGE_KEY = 'dashboard-invite-tool-state';

type StoredGuest = {
  id: string;
  name: string;
  slug: string;
  createdAt: number;
};

function getGuestNameFromSlug(slug: string): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const storedValue = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!storedValue) {
      return null;
    }

    const parsed = JSON.parse(storedValue) as {
      guests?: unknown;
    };

    if (Array.isArray(parsed.guests)) {
      const guest = parsed.guests.find(
        (item) =>
          item &&
          typeof item === 'object' &&
          typeof (item as { slug?: unknown }).slug === 'string' &&
          (item as { slug: string }).slug === slug,
      ) as StoredGuest | undefined;

      if (guest && typeof guest.name === 'string') {
        return guest.name;
      }
    }
  } catch (err) {
    console.error('Failed to get guest name from slug', err);
  }

  return null;
}

function formatSlugToName(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export default function Cover() {
  const { isOpen, openInvitation } = useInvitation();
  const searchParams = useSearchParams();
  const [guestName, setGuestName] = useState<string | null>(null);

  useEffect(() => {
    const slug = searchParams.get('to');
    if (!slug) {
      setGuestName(null);
      return;
    }

    const decodedSlug = decodeURIComponent(slug);
    const nameFromStorage = getGuestNameFromSlug(decodedSlug);
    
    if (nameFromStorage) {
      setGuestName(nameFromStorage);
    } else {
      setGuestName(formatSlugToName(decodedSlug));
    }
  }, [searchParams]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      

      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Ornamental Top Overlay */}
        <div className="pointer-events-none relative w-full">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative h-24 w-full sm:h-28 lg:h-32"
          >
            <Image
              src="/assets/ornamen-atas.jpg"
              alt="Ornamen atas"
              fill
              className="object-cover object-top"
              priority
            />
          </motion.div>
        </div>

        {/* Main Content */}
        <main className="relative flex flex-1 flex-col items-center justify-center px-6 pb-40 pt-10 sm:px-12 sm:pt-20 sm:pb-48">
          {/* Gunungan pattern */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.18 }}
            transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
            className="pointer-events-none absolute inset-0 flex justify-end pr-6 sm:pr-20"
          >
            <svg viewBox="0 0 200 300" className="h-full max-h-[60vh] w-auto">
              <path
                d="M100 0 L200 100 L180 150 L200 200 L100 300 L0 200 L20 150 L0 100 Z"
                fill="#8b4513"
                opacity="0.3"
              />
              <path
                d="M100 50 L150 100 L140 130 L150 160 L100 250 L50 160 L60 130 L50 100 Z"
                fill="#654321"
                opacity="0.25"
              />
            </svg>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
            className="relative z-10 flex flex-col items-center gap-4 text-center"
          >
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35, ease: "easeOut" }}
              className="font-display text-xs uppercase tracking-[0.45em] text-[#a7723a] sm:text-sm"
            >
              Wedding Invitation
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45, ease: "easeOut" }}
              className="font-script text-5xl leading-tight text-[#8b0000] drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)] sm:text-6xl"
            >
              Kusyanto
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
              className="text-3xl text-[#8b0000] sm:text-4xl"
            >
              &amp;
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.75, ease: "easeOut" }}
              className="font-script text-5xl leading-tight text-[#8b0000] drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)] sm:text-6xl"
            >
              Dini Jumartini
            </motion.h2>

            {guestName ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.85, ease: "easeOut" }}
                className="max-w-xl space-y-2"
              >
                <p className="text-base font-medium text-[#8b0000] sm:text-lg">
                  Kepada Yth. {guestName}
                </p>
                <p className="text-base text-[#7c6651] sm:text-lg">
                  Dengan segala kerendahan hati, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan memberikan doa restu pada hari bahagia kami.
                </p>
              </motion.div>
            ) : (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.9, ease: "easeOut" }}
                className="max-w-xl text-base text-[#7c6651] sm:text-lg"
              >
                Dengan segala kerendahan hati, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan memberikan doa restu pada hari bahagia kami.
              </motion.p>
            )}

            <motion.button
              type="button"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.05, ease: "easeOut" }}
            className="mt-4 rounded-full bg-[#8b0000] px-10 py-3 text-sm font-semibold uppercase tracking-widest text-white shadow-lg shadow-[#8b0000]/30 transition-transform hover:-translate-y-1 hover:bg-[#700000] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8b0000] disabled:cursor-not-allowed disabled:bg-[#a34747] disabled:shadow-none"
            onClick={openInvitation}
            disabled={isOpen}
            >
              Buka Undangan
            </motion.button>
          </motion.div>

          {/* Floral Arrangement Bottom */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1, ease: "easeOut" }}
            className="pointer-events-none absolute inset-x-0 bottom-0 flex w-full justify-center"
          >
            <div className="relative w-full max-w-none px-0 sm:px-8">
              <div className="absolute inset-x-12 bottom-0 h-16 bg-linear-to-t from-[#f5f3f0]/85 to-transparent" />
              <div className="relative mx-auto w-full max-w-6xl overflow-visible">
                <div className="relative h-48 sm:h-60 lg:h-72">
                  <Image
                    src="/assets/bunga-1.svg"
                    alt="Ornamen bunga"
                    fill
                    className="object-cover object-bottom"
                    priority
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
