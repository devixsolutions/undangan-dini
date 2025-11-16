
import Image from "next/image";
import { getWeddingData } from "@/lib/data";

const BACKGROUND_GRADIENT =
  "bg-linear-to-b from-[#fdf6f0] via-[#f5e7dc] to-[#f9f0e7]";
const TEXT_PRIMARY = "text-[#5d4636]";
const TEXT_EMPHASIS = "text-[#8b0000]";

export default function Footer() {
  const data = getWeddingData();
  return (
    <footer
      className={`relative px-6 py-20 sm:px-10 ${BACKGROUND_GRADIENT} ${TEXT_PRIMARY}`}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-linear-to-b from-white/60 to-transparent" />
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-8 text-center">
        <h2 className={`font-script text-4xl sm:text-5xl ${TEXT_EMPHASIS}`}>
          {data.footer.heading}
        </h2>
        {data.footer.messages.map((message, index) => (
          <p key={index} className="max-w-xl text-sm leading-relaxed text-[#7c6651] sm:text-base">
            {message}
          </p>
        ))}
        <div
          className={`mt-2 font-script text-4xl text-[#8b0000] sm:text-5xl`}
        >
          {data.wedding.coupleName}
        </div>

        <div className="mt-6 flex flex-col items-center gap-2 text-xs uppercase tracking-[0.35em] text-[#b18f7d] sm:text-sm">
          <span>{data.footer.credits.text}</span>
          <a
            href={data.footer.credits.website}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center justify-center transition hover:opacity-100"
          >
            <Image
              src={data.footer.credits.logo}
              alt="Devix Digital Invitation"
              width={120}
              height={36}
              className="opacity-80 transition group-hover:opacity-100"
            />
          </a>
        </div>

        <p className="mb-10 text-[11px] uppercase tracking-[0.35em] text-[#bfa591]">
          &copy; {new Date().getFullYear()} {data.footer.copyright}
        </p>
      </div>
    </footer>
  );
}


