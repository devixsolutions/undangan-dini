
'use client';

import { useEffect, useMemo, useState } from 'react';

type TimeLeft = {
  total: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const EVENT_TITLE = 'Akad & Resepsi Kusyanto & Dini';
const EVENT_LOCATION = 'Gedung Serbaguna Kec. Moga, Pemalang, Jawa Tengah';
const EVENT_DATE = new Date('2025-02-20T08:00:00+07:00');
const EVENT_DURATION_HOURS = 3;

function calculateTimeLeft(targetDate: Date): TimeLeft {
  const total = Math.max(0, targetDate.getTime() - Date.now());

  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((total / (1000 * 60)) % 60);
  const seconds = Math.floor((total / 1000) % 60);

  return { total, days, hours, minutes, seconds };
}

function pad(value: number) {
  return value.toString().padStart(2, '0');
}

function formatICSDate(date: Date) {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

export default function DateSection() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() =>
    calculateTimeLeft(EVENT_DATE),
  );

  useEffect(() => {
    if (timeLeft.total === 0) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setTimeLeft(calculateTimeLeft(EVENT_DATE));
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [timeLeft.total]);

  const eventDateDisplay = useMemo(() => {
    const formatter = new Intl.DateTimeFormat('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
    });

    return formatter.format(EVENT_DATE);
  }, []);

  const handleSaveTheDate = () => {
    const eventEnd = new Date(
      EVENT_DATE.getTime() + EVENT_DURATION_HOURS * 60 * 60 * 1000,
    );

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Undangan Digital//Save The Date//ID',
      'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      `UID:${EVENT_DATE.getTime()}@undangan.digital`,
      `DTSTAMP:${formatICSDate(new Date())}`,
      `DTSTART:${formatICSDate(EVENT_DATE)}`,
      `DTEND:${formatICSDate(eventEnd)}`,
      `SUMMARY:${EVENT_TITLE}`,
      `LOCATION:${EVENT_LOCATION}`,
      'DESCRIPTION:Kami akan sangat senang jika Anda dapat hadir dan memberi doa restu.',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], {
      type: 'text/calendar;charset=utf-8',
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'save-the-date.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 0);
  };

  return (
    <section className="relative flex flex-col items-center justify-center bg-[#f5f3f0] px-6 py-16 text-center sm:px-10 lg:px-20">
      <div className="max-w-4xl">
        <span className="font-display text-xs uppercase tracking-[0.4em] text-[#a7723a] sm:text-sm">
          Save The Date
        </span>
        <h2 className="mt-4 font-script text-4xl text-[#8b0000] sm:text-5xl">
          Hitung Mundur Menuju Hari Bahagia
        </h2>
        <p className="mt-3 text-sm text-[#7c6651] sm:text-base">
          {eventDateDisplay}
        </p>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: 'Hari', value: pad(timeLeft.days) },
            { label: 'Jam', value: pad(timeLeft.hours) },
            { label: 'Menit', value: pad(timeLeft.minutes) },
            { label: 'Detik', value: pad(timeLeft.seconds) },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-3xl bg-white/80 p-6 shadow-[0_10px_30px_rgba(139,0,0,0.08)] backdrop-blur"
            >
              <div className="font-display text-4xl text-[#8b0000] sm:text-5xl">
                {item.value}
              </div>
              <div className="mt-2 text-xs uppercase tracking-[0.3em] text-[#a7723a]">
                {item.label}
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={handleSaveTheDate}
          className="mx-auto mt-10 inline-flex items-center gap-2 rounded-full bg-[#8b0000] px-10 py-3 text-sm font-semibold uppercase tracking-widest text-white shadow-lg shadow-[#8b0000]/30 transition-transform hover:-translate-y-1 hover:bg-[#700000] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8b0000] sm:text-base"
        >
          Simpan Tanggalnya
        </button>
      </div>
    </section>
  );
}


