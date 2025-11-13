'use client';

import { useEffect, useRef, useState } from "react";
import { Music, Pause } from "lucide-react";
import { useInvitation } from "@/components/invitation-context";

const MUSIC_SOURCE ="/music/bgmusci.mp3";

export default function MusicToggle() {
  const { isOpen } = useInvitation();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setIsPlaying(false);
      setIsReady(false);
      setError(null);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      return;
    }

    const audio = new Audio(MUSIC_SOURCE);
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = 0.6;

    const handleCanPlay = () => {
      setIsReady(true);
    };

    const handleError = () => {
      setError("Gagal memuat musik.");
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("error", handleError);
    audio.addEventListener("ended", handleEnded);

    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("ended", handleEnded);
      audioRef.current = null;
    };
  }, [isOpen]);

  const togglePlayback = async () => {
    const audio = audioRef.current;
    if (!isOpen || !audio || !isReady) {
      return;
    }

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    try {
      await audio.play();
      setIsPlaying(true);
      setError(null);
    } catch (err) {
      console.error("Failed to play audio:", err);
      setError("Pemutaran musik diblokir. Silakan coba lagi.");
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed right-6 bottom-32 sm:bottom-36 md:bottom-40 z-60 flex flex-col items-end gap-2">
      <button
        type="button"
        onClick={togglePlayback}
        disabled={!isReady}
        aria-pressed={isPlaying}
        className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#8b0000] text-white shadow-lg shadow-[#8b0000]/30 transition hover:-translate-y-1 hover:bg-[#700000] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8b0000] disabled:cursor-not-allowed disabled:bg-[#c28b8b]"
      >
        {isPlaying ? <Pause size={22} strokeWidth={1.8} /> : <Music size={22} strokeWidth={1.8} />}
        <span className="sr-only">{isPlaying ? "Hentikan musik" : "Putar musik"}</span>
      </button>
      {error ? (
        <p className="rounded-2xl bg-white/90 px-3 py-2 text-xs text-[#8b0000] shadow-md">
          {error}
        </p>
      ) : null}
    </div>
  );
}


