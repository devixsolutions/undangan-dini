
'use client';

import { motion } from "framer-motion";
import { useMemo, useState } from "react";

type FormState = {
  name: string;
  message: string;
  attendance: "" | "hadir" | "tidak_hadir";
};

type Submission = FormState & {
  id: string;
  createdAt: string;
};

const attendanceOptions = [
  { value: "hadir", label: "InsyaAllah Hadir" },
  { value: "tidak_hadir", label: "Belum Bisa Hadir" },
];

export default function RSVPSection() {
  const [formState, setFormState] = useState<FormState>({
    name: "",
    message: "",
    attendance: "",
  });
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const isValid = useMemo(() => {
    const trimmedName = formState.name.trim();
    const trimmedMessage = formState.message.trim();
    return (
      trimmedName.length >= 3 &&
      trimmedMessage.length >= 5 &&
      formState.attendance !== ""
    );
  }, [formState]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleAttendanceChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setFormState((prev) => ({ ...prev, attendance: event.target.value as "hadir" | "tidak_hadir" }));
  };

  const resetForm = () => {
    setFormState({
      name: "",
      message: "",
      attendance: "",
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isValid || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      await new Promise((resolve) => window.setTimeout(resolve, 600));

      const submission: Submission = {
        ...formState,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };

      setSubmissions((prev) => [submission, ...prev].slice(0, 6));
      setFeedback("Terima kasih! RSVP Anda sudah kami terima.");
      resetForm();
    } catch (error) {
      console.error("Failed to submit RSVP:", error);
      setFeedback("Maaf, terjadi kendala. Silakan coba kembali.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="rsvp"
      className="relative flex flex-col items-center justify-center bg-[#f9f6f1] px-6 py-24 sm:px-10 sm:py-28"
    >
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
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
          RSVP
        </span>
        <h2 className="font-script text-4xl text-[#8b0000] sm:text-5xl">
          Konfirmasi Kehadiran
        </h2>
        <p className="max-w-2xl text-sm leading-relaxed text-[#7c6651] sm:text-base">
          Sampaikan rencana kehadiran, ucapan, dan doa restu Anda kepada kami.
          RSVP ini membantu kami menyiapkan hari bahagia dengan lebih baik.
        </p>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        onSubmit={handleSubmit}
        className="mt-12 w-full max-w-3xl space-y-6 rounded-3xl border border-[#eadacc] bg-white/80 p-8 shadow-[0_18px_40px_-25px_rgba(111,54,38,0.35)] backdrop-blur sm:mt-16 sm:p-10"
      >
        <div className="grid gap-6 sm:grid-cols-2">
          <label className="flex flex-col gap-2 text-left">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#a7723a]">
              Nama Lengkap
            </span>
            <input
              type="text"
              name="name"
              value={formState.name}
              onChange={handleChange}
              placeholder="Tuliskan nama Anda"
              autoComplete="name"
              className="rounded-2xl border border-[#eadacc] bg-white/90 px-4 py-3 text-sm text-[#5d4a3a] outline-none transition focus:border-[#8b0000] focus:ring-2 focus:ring-[#8b0000]/20 sm:text-base"
              required
            />
          </label>

          <fieldset className="flex flex-col gap-3">
            <legend className="text-xs font-semibold uppercase tracking-[0.3em] text-[#a7723a]">
              Konfirmasi Kehadiran
            </legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {attendanceOptions.map((option) => (
                <label
                  key={option.value}
                  className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm sm:text-base ${
                    formState.attendance === option.value
                      ? "border-[#8b0000] bg-[#8b0000]/10 text-[#5d4a3a]"
                      : "border-[#eadacc] bg-white/90 text-[#7c6651]"
                  }`}
                >
                  <input
                    type="radio"
                    name="attendance"
                    value={option.value}
                    checked={formState.attendance === option.value}
                    onChange={handleAttendanceChange}
                    className="h-4 w-4 accent-[#8b0000]"
                    required
                  />
                  <span className="font-medium">{option.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        <label className="flex flex-col gap-2 text-left">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#a7723a]">
            Ucapan &amp; Doa
          </span>
          <textarea
            name="message"
            value={formState.message}
            onChange={handleChange}
            placeholder="Tulis ucapan dan doa terbaik untuk kedua mempelai di sini"
            rows={4}
            className="rounded-2xl border border-[#eadacc] bg-white/90 px-4 py-3 text-sm text-[#5d4a3a] outline-none transition focus:border-[#8b0000] focus:ring-2 focus:ring-[#8b0000]/20 sm:text-base"
            required
          />
        </label>

        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
          <p className="text-xs text-[#7c6651] sm:text-sm">
            Mohon klik tombol kirim setelah mengisi data. Terima kasih telah
            meluangkan waktu untuk berbagi doa dan konfirmasi kehadiran Anda.
          </p>
          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#8b0000] px-8 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-white shadow-lg shadow-[#8b0000]/30 transition-transform hover:-translate-y-1 hover:bg-[#700000] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8b0000] disabled:cursor-not-allowed disabled:bg-[#b57a7a] disabled:shadow-none sm:text-base"
          >
            {isSubmitting ? "Mengirim..." : "Kirim RSVP"}
          </button>
        </div>

        {feedback ? (
          <p className="rounded-2xl bg-[#f3e7da]/80 px-4 py-3 text-center text-sm font-medium text-[#7c6651] sm:text-base">
            {feedback}
          </p>
        ) : null}
      </motion.form>

      {submissions.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          className="mt-14 w-full max-w-3xl space-y-4 rounded-3xl border border-[#eadacc] bg-white/70 p-8 shadow-[0_18px_40px_-25px_rgba(111,54,38,0.35)] backdrop-blur sm:mt-16"
        >
          <h3 className="text-center font-display text-xs uppercase tracking-[0.35em] text-[#a7723a] sm:text-sm">
            Ucapan Terbaru
          </h3>
          <div className="space-y-4">
            {submissions.map((item) => (
              <article
                key={item.id}
                className="rounded-2xl border border-[#eadacc] bg-white/80 p-4 text-left text-[#5d4a3a]"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs uppercase tracking-[0.25em] text-[#a7723a] sm:text-sm">
                  <span>{item.name}</span>
                  <span>
                    {item.attendance === "hadir"
                      ? "InsyaAllah Hadir"
                      : "Belum Bisa Hadir"}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-[#7c6651] sm:text-base">
                  {item.message}
                </p>
              </article>
            ))}
          </div>
        </motion.div>
      ) : null}
    </section>
  );
}


