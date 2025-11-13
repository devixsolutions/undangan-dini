
import Image from "next/image";

const BACKGROUND_GRADIENT =
  "bg-linear-to-b from-[#fdf6f0] via-[#f5e7dc] to-[#f9f0e7]";
const TEXT_PRIMARY = "text-[#5d4636]";
const TEXT_EMPHASIS = "text-[#8b0000]";

export default function Footer() {
  return (
    <footer
      className={`relative px-6 py-20 sm:px-10 ${BACKGROUND_GRADIENT} ${TEXT_PRIMARY}`}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-linear-to-b from-white/60 to-transparent" />
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-8 text-center">
        <h2 className={`font-script text-4xl sm:text-5xl ${TEXT_EMPHASIS}`}>
          Terima Kasih
        </h2>
        <p className="max-w-xl text-sm leading-relaxed text-[#7c6651] sm:text-base">
          Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i
          berkenan hadir serta memberikan doa restu untuk keberkahan pernikahan kami.
        </p>
        <p className="max-w-xl text-sm leading-relaxed text-[#7c6651] sm:text-base">
          Atas doa dan restunya, kami ucapkan terima kasih.
        </p>
        <div
          className={`mt-2 font-script text-4xl text-[#8b0000] sm:text-5xl`}
        >
          Kusyanto &amp; Dini
        </div>

        <div className="mt-6 flex flex-col items-center gap-2 text-xs uppercase tracking-[0.35em] text-[#b18f7d] sm:text-sm">
          <span>Digital Invitation by Devix</span>
          <a
            href="https://devixsolution.tech"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center justify-center transition hover:opacity-100"
          >
            <Image
              src="/assets/devix.svg"
              alt="Devix Digital Invitation"
              width={120}
              height={36}
              className="opacity-80 transition group-hover:opacity-100"
            />
          </a>
        </div>

        <div className="mt-6 flex items-center gap-6">
          <SocialLink
            href="https://www.instagram.com"
            ariaLabel="Instagram"
            icon={
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <path d="M17.5 6.5h.01" />
              </svg>
            }
          />
          <SocialLink
            href="https://wa.me/6281234567890"
            ariaLabel="WhatsApp"
            icon={
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path d="M20.52 3.48A11.78 11.78 0 0 0 12.02 0h-.04C5.33.02 0 5.37 0 12.06a11.9 11.9 0 0 0 1.61 6L0 24l6.09-1.59a12.03 12.03 0 0 0 5.93 1.56h.05c6.68-.02 12.02-5.37 12.02-12.06 0-3.22-1.25-6.24-3.57-8.43Zm-8.5 18.75h-.04a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.61.94.96-3.52-.24-.36a9.85 9.85 0 0 1-1.55-5.35c0-5.45 4.42-9.88 9.84-9.9h.04c2.63 0 5.11 1.02 6.97 2.86a9.88 9.88 0 0 1 2.89 7.02c-.01 5.45-4.43 9.88-9.86 9.9Zm5.44-7.37c-.3-.15-1.79-.88-2.06-.98-.28-.1-.48-.15-.67.15-.2.3-.77.98-.94 1.18-.17.2-.35.22-.65.07-.3-.15-1.27-.46-2.42-1.46-.9-.8-1.52-1.79-1.7-2.09-.18-.3-.02-.46.13-.61.13-.13.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.48-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1-1.04 2.44s1.07 2.83 1.22 3.02c.15.2 2.1 3.21 5.06 4.5.7.3 1.24.47 1.66.6.7.22 1.33.19 1.84.12.56-.08 1.79-.73 2.04-1.43.25-.7.25-1.3.17-1.43-.07-.13-.27-.2-.57-.35Z" />
              </svg>
            }
          />
          <SocialLink
            href="mailto:halo@devixsolution.tech"
            ariaLabel="Email"
            icon={
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 6-10 7L2 6" />
              </svg>
            }
          />
        </div>

        <p className="mt-10 text-[11px] uppercase tracking-[0.35em] text-[#bfa591]">
          &copy; {new Date().getFullYear()} Kusyanto &amp; Dini Wedding
        </p>
      </div>
    </footer>
  );
}

type SocialLinkProps = {
  href: string;
  ariaLabel: string;
  icon: React.ReactNode;
};

function SocialLink({ href, ariaLabel, icon }: SocialLinkProps) {
  return (
    <a
      href={href}
      aria-label={ariaLabel}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-[#8b0000] shadow-sm transition hover:-translate-y-1 hover:bg-white hover:text-[#700000]"
    >
      {icon}
    </a>
  );
}



