 'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Copy,
  Link2,
  MessageCircle,
  RefreshCcw,
  Search,
  Share2,
  Trash2,
  Users,
  XCircle,
} from 'lucide-react';

type AttendanceStatus = 'hadir' | 'tidak_hadir';
type ChannelSource = 'website' | 'whatsapp' | 'manual';

type RSVPEntry = {
  id: string;
  name: string;
  attendance: AttendanceStatus;
  guestCount: number;
  message: string;
  channel: ChannelSource;
  createdAt: string;
  updatedAt: string;
};

type SummaryCard = {
  key: string;
  label: string;
  value: string;
  hint: string;
  icon: LucideIcon;
};

type InvitationTemplateKey = 'formal' | 'muslim' | 'custom';

type InvitationTemplate = {
  key: Extract<InvitationTemplateKey, 'formal' | 'muslim'>;
  label: string;
  description: string;
  content: string;
};

type StoredGuest = {
  id: string;
  name: string;
  slug: string;
  createdAt: number;
};

type GeneratedGuest = StoredGuest & {
  inviteLink: string;
  personalizedText: string;
};

const defaultFormalTemplate = [
  'Yth. [nama],',
  '',
  'Dengan hormat, kami mengundang Bapak/Ibu/Saudara/i untuk hadir pada acara pernikahan kami.',
  '',
  'Silakan akses undangan digital berikut untuk detail acara dan konfirmasi kehadiran:',
  '[link-undangan]',
  '',
  'Atas kehadiran dan doa restu Bapak/Ibu/Saudara/i kami ucapkan terima kasih.',
].join('\n');

const defaultMuslimTemplate = [
  'Assalamualaikum Warahmatullahi Wabarakatuh,',
  '',
  'Dengan memohon rahmat dan ridha Allah SWT, kami bermaksud mengundang [nama] untuk hadir memberikan doa restu pada acara pernikahan kami.',
  '',
  'Detail acara dan konfirmasi kehadiran dapat dilihat melalui tautan berikut:',
  '[link-undangan]',
  '',
  'Atas perhatian dan kehadirannya, kami ucapkan Jazakumullahu Khairan.',
  'Wassalamualaikum Warahmatullahi Wabarakatuh.',
].join('\n');

const invitationTemplates: readonly InvitationTemplate[] = [
  {
    key: 'formal',
    label: 'Template Formal',
    description: 'Sapaan resmi dan profesional.',
    content: defaultFormalTemplate,
  },
  {
    key: 'muslim',
    label: 'Template Muslim',
    description: 'Sapaan islami dengan doa.',
    content: defaultMuslimTemplate,
  },
] as const;

const LOCAL_STORAGE_KEY = 'dashboard-invite-tool-state';

const channelLabels: Record<ChannelSource, string> = {
  website: 'Website',
  whatsapp: 'WhatsApp',
  manual: 'Input Admin',
};

const dateTimeFormatter = new Intl.DateTimeFormat('id-ID', {
  day: 'numeric',
  month: 'long',
  hour: '2-digit',
  minute: '2-digit',
});

const dayFormatter = new Intl.DateTimeFormat('id-ID', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
});

const longDayFormatter = new Intl.DateTimeFormat('id-ID', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
});

type TimelineEntry = ReturnType<typeof buildTimeline>[number];
type CalculatedMetrics = ReturnType<typeof calculateMetrics>;

export default function DashboardPage() {
  const [entries, setEntries] = useState<RSVPEntry[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | AttendanceStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shareLink, setShareLink] = useState('');
  const [rawGuestNames, setRawGuestNames] = useState('');
  const [introText, setIntroText] = useState(defaultFormalTemplate);
  const [selectedTemplateKey, setSelectedTemplateKey] =
    useState<InvitationTemplateKey>('formal');
  const [storedGuests, setStoredGuests] = useState<StoredGuest[]>([]);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const feedbackTimeoutRef = useRef<number | null>(null);
  const [activeSection, setActiveSection] = useState<'monitor' | 'generator'>('monitor');

  const loadData = useCallback(async (mode: 'initial' | 'refresh' = 'initial') => {
    if (mode === 'initial') {
      setIsLoading(true);
    } else {
      setIsRefreshing(true);
    }
    setError(null);

    try {
      const response = await fetch('/api/rsvp', {
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error('Gagal memuat data RSVP.');
      }

      const payload = (await response.json()) as { data: RSVPEntry[] };
      setEntries(payload.data);
    } catch (err) {
      console.error('Failed to fetch RSVP data', err);
      setError('Tidak dapat memuat data RSVP saat ini.');
    } finally {
      if (mode === 'initial') {
        setIsLoading(false);
      } else {
        setIsRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    void loadData('initial');
  }, [loadData]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setShareLink(`${window.location.origin}`);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      const storedValue = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!storedValue) {
        return;
      }

      const parsed = JSON.parse(storedValue) as {
        rawGuestNames?: unknown;
        introText?: unknown;
        guests?: unknown;
      };

      if (typeof parsed.rawGuestNames === 'string') {
        setRawGuestNames(parsed.rawGuestNames);
      }

      if (typeof parsed.introText === 'string') {
        setIntroText(parsed.introText);
        setSelectedTemplateKey(detectTemplateKey(parsed.introText));
      }

      if (Array.isArray(parsed.guests)) {
        const restoredGuests = parsed.guests
          .map((item) => {
            if (
              item &&
              typeof item === 'object' &&
              typeof (item as { id?: unknown }).id === 'string' &&
              typeof (item as { name?: unknown }).name === 'string' &&
              typeof (item as { slug?: unknown }).slug === 'string'
            ) {
              return {
                id: (item as { id: string }).id,
                name: (item as { name: string }).name,
                slug: (item as { slug: string }).slug,
                createdAt:
                  typeof (item as { createdAt?: unknown }).createdAt === 'number'
                    ? (item as { createdAt: number }).createdAt
                    : Date.now(),
              };
            }
            return null;
          })
          .filter((guest): guest is StoredGuest => guest !== null);

        if (restoredGuests.length > 0) {
          setStoredGuests(restoredGuests);
        }
      }
    } catch (err) {
      console.error('Failed to restore invite tool data', err);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const payload = JSON.stringify({
      rawGuestNames,
      introText,
      guests: storedGuests,
    });

    window.localStorage.setItem(LOCAL_STORAGE_KEY, payload);
  }, [rawGuestNames, introText, storedGuests]);

  useEffect(() => {
    return () => {
      if (feedbackTimeoutRef.current !== null) {
        window.clearTimeout(feedbackTimeoutRef.current);
      }
    };
  }, []);

  const metrics = useMemo<CalculatedMetrics>(
    () => calculateMetrics(entries),
    [entries],
  );

  const timeline = useMemo<TimelineEntry[]>(
    () => buildTimeline(entries),
    [entries],
  );

  const generatedGuests = useMemo<GeneratedGuest[]>(
    () =>
      storedGuests.map((guest) => {
        const inviteLink = shareLink
          ? `${shareLink}/?to=${encodeURIComponent(guest.slug)}`
          : '';
        return {
          ...guest,
          inviteLink,
          personalizedText: buildPersonalizedText(
            introText,
            guest.name,
            inviteLink,
          ),
        };
      }),
    [storedGuests, introText, shareLink],
  );

  const hasGeneratedGuests = generatedGuests.length > 0;

  const showStatus = useCallback((message: string) => {
    if (typeof window === 'undefined') {
      return;
    }

    if (feedbackTimeoutRef.current !== null) {
      window.clearTimeout(feedbackTimeoutRef.current);
    }

    setStatusMessage(message);
    feedbackTimeoutRef.current = window.setTimeout(() => {
      setStatusMessage(null);
      feedbackTimeoutRef.current = null;
    }, 4000);
  }, []);

  const handleIntroTextChange = useCallback(
    (value: string) => {
      setIntroText(value);

      if (selectedTemplateKey === 'custom') {
        return;
      }

      const template = invitationTemplates.find(
        (item) => item.key === selectedTemplateKey,
      );

      if (!template || template.content !== value) {
        setSelectedTemplateKey('custom');
      }
    },
    [selectedTemplateKey],
  );

  const handleApplyTemplate = useCallback(
    (template: InvitationTemplate) => {
      setIntroText(template.content);
      setSelectedTemplateKey(template.key);
      showStatus(`Template ${template.label} diterapkan.`);
    },
    [showStatus],
  );

  const handleGenerateGuestList = useCallback(() => {
    const names = parseGuestNames(rawGuestNames);

    if (names.length === 0) {
      showStatus('Masukkan minimal satu nama tamu terlebih dahulu.');
      return;
    }

    const slugSet = new Set<string>();
    const guests = names.map((name, index) => {
      const baseSlug = slugify(name);
      const uniqueSlug = ensureUniqueSlug(
        baseSlug || `tamu-${index + 1}`,
        slugSet,
      );
      slugSet.add(uniqueSlug);

      return {
        id: generateGuestId(index),
        name,
        slug: uniqueSlug,
        createdAt: Date.now() + index,
      };
    });

    setStoredGuests(guests);
    setRawGuestNames(names.join('\n'));
    showStatus('Daftar tamu berhasil dibuat.');
  }, [rawGuestNames, showStatus]);

  const handleSendWhatsApp = useCallback(
    (guest: GeneratedGuest) => {
      if (!guest.personalizedText) {
        showStatus('Teks undangan belum siap.');
        return;
      }

      const encodedText = encodeURIComponent(guest.personalizedText);
      const whatsappUrl = `https://wa.me/?text=${encodedText}`;
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      showStatus(`Pesan untuk ${guest.name} siap dikirim via WhatsApp.`);
    },
    [showStatus],
  );

  const handleCopyLink = useCallback(
    async (guest: GeneratedGuest) => {
      if (!guest.inviteLink) {
        showStatus(
          'Link undangan belum siap. Pastikan halaman ini dibuka melalui domain undangan.',
        );
        return;
      }

      if (!navigator.clipboard) {
        showStatus('Fitur salin tidak tersedia di browser ini.');
        return;
      }

      try {
        await navigator.clipboard.writeText(guest.inviteLink);
        showStatus(`Link undangan untuk ${guest.name} disalin.`);
      } catch (err) {
        console.error('Failed to copy invite link', err);
        showStatus('Gagal menyalin link undangan.');
      }
    },
    [showStatus],
  );

  const handleCopyText = useCallback(
    async (guest: GeneratedGuest) => {
      if (!guest.personalizedText) {
        showStatus('Teks undangan belum siap.');
        return;
      }

      if (!navigator.clipboard) {
        showStatus('Fitur salin tidak tersedia di browser ini.');
        return;
      }

      try {
        await navigator.clipboard.writeText(guest.personalizedText);
        showStatus(`Teks undangan untuk ${guest.name} disalin.`);
      } catch (err) {
        console.error('Failed to copy invite text', err);
        showStatus('Gagal menyalin teks undangan.');
      }
    },
    [showStatus],
  );

  const handleRemoveGuest = useCallback(
    (guest: GeneratedGuest) => {
      setStoredGuests((prev) => prev.filter((item) => item.id !== guest.id));
      showStatus(`${guest.name} dihapus dari daftar tamu.`);
    },
    [showStatus],
  );

  const shareMessage = useMemo(() => {
    if (!shareLink) {
      return '';
    }

    const coupleNames = 'Kusyanto & Dini Jumartini';
    const eventDate = 'Sabtu, 12 April 2025';
    const eventLocation = 'Gedung Graha Saba Buana — Surakarta';

    return [
      'Assalamualaikum Warahmatullahi Wabarakatuh.',
      'Dengan penuh rasa syukur, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dalam acara pernikahan kami.',
      coupleNames,
      eventDate,
      eventLocation,
      '',
      'Silakan buka undangan digital lengkap serta konfirmasi kehadiran melalui tautan berikut:',
      `${shareLink}/`,
    ].join('\n');
  }, [shareLink]);

  const handleShareToWhatsApp = useCallback(() => {
    if (!shareMessage) {
      return;
    }

    const encodedText = encodeURIComponent(shareMessage);
    const whatsappUrl = `https://wa.me/?text=${encodedText}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  }, [shareMessage]);

  const filteredEntries = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return entries.filter((entry) => {
      const matchesStatus =
        statusFilter === 'all' || entry.attendance === statusFilter;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        entry.name.toLowerCase().includes(normalizedQuery) ||
        entry.message.toLowerCase().includes(normalizedQuery);

      return matchesStatus && matchesQuery;
    });
  }, [entries, searchQuery, statusFilter]);

  const summaryCards = useMemo<SummaryCard[]>(
    () => [
      {
        key: 'total',
        label: 'Total RSVP',
        value: metrics.total.toString(),
        hint: `${metrics.totalGuests} tamu tercatat`,
        icon: Users,
      },
      {
        key: 'hadir',
        label: 'InsyaAllah Hadir',
        value: metrics.hadir.toString(),
        hint: `${metrics.attendanceRate}% dari total`,
        icon: CheckCircle2,
      },
      {
        key: 'tidak_hadir',
        label: 'Belum Bisa Hadir',
        value: metrics.tidakHadir.toString(),
        hint: `${metrics.tidakHadirRate}% dari total`,
        icon: XCircle,
      },
      {
        key: 'avg_guests',
        label: 'Rata-rata Tamu Hadir',
        value: metrics.avgConfirmedGuests.toFixed(1),
        hint: 'Orang per RSVP hadir',
        icon: CalendarDays,
      },
    ],
    [metrics],
  );

  const handleRefresh = () => {
    void loadData('refresh');
  };

  return (
    <div className="min-h-screen bg-[#f9f6f1] px-6 py-10 sm:px-10 lg:px-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <header className="space-y-4">
          <span className="text-xs font-semibold uppercase tracking-[0.45em] text-[#a7723a]">
            Dashboard
          </span>
          <div className="space-y-2">
            <h1 className="font-script text-4xl text-[#8b0000] sm:text-5xl">
              Monitoring RSVP
            </h1>
            <p className="max-w-3xl text-sm leading-relaxed text-[#7c6651] sm:text-base">
              Pantau perkembangan konfirmasi kehadiran secara ringkas. Gunakan
              dashboard ini untuk mengecek total RSVP, tren kehadiran, dan
              ucapan terbaru dari para tamu undangan.
            </p>
          </div>

          {metrics.latestSubmission ? (
            <div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-[#eadacc] bg-white/80 px-4 py-2 text-xs font-medium text-[#a7723a] sm:text-sm">
              <Clock className="h-4 w-4" />
              <span>
                Pembaruan terakhir dari{' '}
                <strong className="font-semibold">
                  {metrics.latestSubmission.name}
                </strong>{' '}
                • {formatDateTime(metrics.latestSubmission.createdAt)}
              </span>
            </div>
          ) : null}

          {error ? (
            <p className="inline-flex items-center rounded-full border border-[#d19393] bg-[#faddd9]/80 px-4 py-2 text-xs font-medium text-[#8b0000] sm:text-sm">
              {error}
            </p>
          ) : null}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            {(['monitor', 'generator'] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setActiveSection(option)}
                className={`w-full rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] transition sm:w-auto sm:text-sm ${
                  activeSection === option
                    ? 'bg-[#8b0000] text-white shadow'
                    : 'border border-[#eadacc] bg-white/80 text-[#a7723a] hover:border-[#8b0000] hover:text-[#8b0000]'
                }`}
              >
                {option === 'monitor' ? 'Monitoring RSVP' : 'Generate Pesan'}
              </button>
            ))}
          </div>
        </header>

        {activeSection === 'generator' ? (
          <section className="space-y-6 rounded-3xl border border-[#eadacc] bg-white/85 p-6 shadow-[0_18px_40px_-25px_rgba(111,54,38,0.35)] backdrop-blur">

          {statusMessage ? (
            <div className="rounded-2xl border border-[#ccecd9] bg-[#e9f7ef] px-4 py-3 text-xs font-medium text-[#1c7c43] sm:text-sm">
              {statusMessage}
            </div>
          ) : null}

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-3">
              <label
                htmlFor="guest-names"
                className="text-xs font-semibold uppercase tracking-[0.35em] text-[#a7723a] sm:text-sm"
              >
                Nama Tamu
              </label>
              <textarea
                id="guest-names"
                value={rawGuestNames}
                onChange={(event) => setRawGuestNames(event.target.value)}
                rows={8}
                placeholder="Contoh: Budi, Siti, Andi"
                className="w-full resize-y rounded-3xl border border-[#eadacc] bg-white/90 px-5 py-4 text-sm text-[#5d4a3a] outline-none transition focus:border-[#8b0000] focus:ring-2 focus:ring-[#8b0000]/20"
              />
              <p className="text-xs text-[#a7723a]">
                Tekan Enter atau gunakan tanda koma untuk memisahkan nama tamu.
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label
                  htmlFor="intro-text"
                  className="text-xs font-semibold uppercase tracking-[0.35em] text-[#a7723a] sm:text-sm"
                >
                  Teks Pengantar
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  {invitationTemplates.map((template) => (
                    <button
                      key={template.key}
                      type="button"
                      onClick={() => handleApplyTemplate(template)}
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] transition sm:text-xs ${
                        selectedTemplateKey === template.key
                          ? 'bg-[#8b0000] text-white shadow'
                          : 'border border-[#eadacc] bg-white/80 text-[#a7723a] hover:border-[#8b0000] hover:text-[#8b0000]'
                      }`}
                    >
                      {template.label}
                    </button>
                  ))}
                  <span
                    className={`rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] sm:text-xs ${
                      selectedTemplateKey === 'custom'
                        ? 'border-[#8b0000] text-[#8b0000]'
                        : 'border-transparent text-[#c9ad8f]'
                    }`}
                  >
                    Custom
                  </span>
                </div>
              </div>
              <textarea
                id="intro-text"
                value={introText}
                onChange={(event) => handleIntroTextChange(event.target.value)}
                rows={8}
                placeholder="Tuliskan teks pengantar undangan..."
                className="w-full resize-y rounded-3xl border border-[#eadacc] bg-white/90 px-5 py-4 text-sm text-[#5d4a3a] outline-none transition focus:border-[#8b0000] focus:ring-2 focus:ring-[#8b0000]/20"
              />
              <p className="text-xs text-[#a7723a]">
                Gunakan kode [nama] dan [link-undangan] agar pesan otomatis menyesuaikan
                tamu.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleGenerateGuestList}
              className="inline-flex items-center gap-2 rounded-full border border-[#8b0000] bg-[#8b0000] px-5 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              Buat Daftar Nama Tamu
            </button>
            {hasGeneratedGuests ? (
              <span className="text-xs text-[#a7723a] sm:text-sm">
                Total tamu:{" "}
                <strong className="font-semibold text-[#5d4a3a]">
                  {generatedGuests.length}
                </strong>
              </span>
            ) : null}
          </div>

          {hasGeneratedGuests ? (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-[#a7723a] sm:text-base">
                Daftar Tamu
              </h3>
              <div className="space-y-3 sm:hidden">
                {generatedGuests.map((guest) => (
                  <div
                    key={guest.id}
                    className="space-y-3 rounded-3xl border border-[#eadacc] bg-white/90 p-4 shadow-[0_10px_28px_-22px_rgba(111,54,38,0.45)]"
                  >
                    <div>
                      <p className="text-sm font-semibold text-[#5d4a3a]">
                        {guest.name}
                      </p>
                      <p className="mt-1 break-all text-xs text-[#7c6651]">
                        {guest.inviteLink
                          ? guest.inviteLink
                          : 'Link undangan akan muncul setelah alamat situs terdeteksi.'}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleSendWhatsApp(guest)}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-[#ccecd9] bg-[#e9f7ef] px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#1c7c43] transition hover:-translate-y-0.5 hover:border-[#25d366] hover:text-[#13652f]"
                      >
                        <MessageCircle className="h-4 w-4" />
                        Kirim
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          void handleCopyLink(guest);
                        }}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-[#eadacc] bg-white/90 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#5d4a3a] transition hover:-translate-y-0.5 hover:border-[#8b0000] hover:text-[#8b0000]"
                      >
                        <Link2 className="h-4 w-4" />
                        Tautan
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          void handleCopyText(guest);
                        }}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-[#eadacc] bg-white/90 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#5d4a3a] transition hover:-translate-y-0.5 hover:border-[#8b0000] hover:text-[#8b0000]"
                      >
                        <Copy className="h-4 w-4" />
                        Teks
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveGuest(guest)}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-[#f0c6c6] bg-[#faddd9] px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#8b0000] transition hover:-translate-y-0.5 hover:border-[#8b0000] hover:bg-[#f8cfc9]"
                      >
                        <Trash2 className="h-4 w-4" />
                        Hapus
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="hidden overflow-hidden rounded-3xl border border-[#eadacc] bg-white/90 shadow-[0_10px_28px_-22px_rgba(111,54,38,0.45)] sm:block">
                <div className="max-w-full overflow-x-auto">
                <table className="min-w-full divide-y divide-[#eadacc]/80">
                  <thead className="bg-[#f9f6f1] text-xs uppercase tracking-[0.25em] text-[#a7723a]">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left sm:px-6">
                        Nama Tamu
                      </th>
                      <th scope="col" className="px-4 py-3 text-left sm:px-6">
                        Link Undangan
                      </th>
                      <th scope="col" className="px-4 py-3 text-right sm:px-6">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#eadacc]/60 text-sm text-[#5d4a3a]">
                    {generatedGuests.map((guest) => (
                      <tr key={guest.id} className="bg-white/70">
                        <td className="whitespace-nowrap px-4 py-4 font-semibold sm:px-6">
                          {guest.name}
                        </td>
                        <td className="px-4 py-4 sm:px-6">
                          {guest.inviteLink ? (
                            <span className="break-all text-sm text-[#7c6651]">
                              {guest.inviteLink}
                            </span>
                          ) : (
                            <span className="text-xs text-[#a7723a]">
                              Link undangan akan muncul setelah alamat situs terdeteksi.
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-4 sm:px-6">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleSendWhatsApp(guest)}
                              className="inline-flex items-center gap-2 rounded-full border border-[#ccecd9] bg-[#e9f7ef] px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#1c7c43] transition hover:-translate-y-0.5 hover:border-[#25d366] hover:text-[#13652f]"
                            >
                              <MessageCircle className="h-4 w-4" />
                              Kirim
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                void handleCopyLink(guest);
                              }}
                              className="inline-flex items-center gap-2 rounded-full border border-[#eadacc] bg-white/90 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#5d4a3a] transition hover:-translate-y-0.5 hover:border-[#8b0000] hover:text-[#8b0000]"
                            >
                              <Link2 className="h-4 w-4" />
                              Tautan
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                void handleCopyText(guest);
                              }}
                              className="inline-flex items-center gap-2 rounded-full border border-[#eadacc] bg-white/90 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#5d4a3a] transition hover:-translate-y-0.5 hover:border-[#8b0000] hover:text-[#8b0000]"
                            >
                              <Copy className="h-4 w-4" />
                              Teks
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveGuest(guest)}
                              className="inline-flex items-center gap-2 rounded-full border border-[#f0c6c6] bg-[#faddd9] px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#8b0000] transition hover:-translate-y-0.5 hover:border-[#8b0000] hover:bg-[#f8cfc9]"
                            >
                              <Trash2 className="h-4 w-4" />
                              Hapus
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
                
              </div>
              <div className="space-y-3">
            <h2 className="text-base font-semibold text-[#5d4a3a] sm:text-lg">
              Kirim Undangan Otomatis
            </h2>
            <p className="text-sm text-[#7c6651]">
              Masukkan daftar tamu, pilih teks pengantar, dan sistem akan menyiapkan
              undangan personal yang siap dibagikan ke WhatsApp.
            </p>
            <ol className="list-decimal space-y-2 pl-5 text-sm text-[#7c6651]">
              <li>
                Masukkan daftar nama tamu undangan pada kolom 'Nama Tamu'. Setiap nama
                tamu bisa dipisahkan dengan menekan Enter (baris baru) atau menggunakan
                tanda koma (,). Contoh: Budi, Siti, Andi atau satu nama per baris.
              </li>
              <li>
                Masukkan teks pengantar undangan sesuai kebutuhan Anda pada kolom 'Teks
                Pengantar'. Anda juga bisa memilih dan menggunakan template yang sudah
                disediakan agar lebih praktis.
              </li>
              <li>
                Untuk membuat undangan lebih personal, gunakan kode [nama] di dalam
                teks pengantar. Kode ini akan otomatis diganti dengan nama tamu saat
                undangan dikirim.
              </li>
              <li>
                Untuk menyisipkan link undangan khusus untuk setiap tamu, gunakan kode
                [link-undangan] di dalam teks pengantar. Kode ini akan otomatis diganti
                dengan link undangan yang unik untuk setiap tamu.
              </li>
              <li>
                Setelah mengisi nama tamu dan teks pengantar, klik tombol 'Buat Daftar
                Nama Tamu'. Sistem akan membuatkan daftar tamu beserta link undangan
                unik untuk masing-masing tamu.
              </li>
              <li>
                Untuk mengirim undangan ke WhatsApp, klik tombol 'Kirim' (ikon
                WhatsApp) di samping nama tamu. Pesan undangan akan otomatis terbuka di
                WhatsApp siap untuk dikirim ke tamu tersebut.
              </li>
              <li>
                Untuk menyalin link undangan khusus tamu, klik tombol 'Tautan'. Anda
                bisa membagikan link ini secara manual ke tamu.
              </li>
              <li>
                Untuk menyalin teks undangan yang sudah dipersonalisasi, klik tombol
                'Teks'. Anda bisa menempelkan teks ini di aplikasi chat lain atau
                email.
              </li>
              <li>
                Jika ingin menghapus tamu dari daftar, klik tombol 'Hapus' (ikon tempat
                sampah) di samping nama tamu yang ingin dihapus.
              </li>
              <li>
                Semua data yang Anda masukkan akan otomatis tersimpan di browser. Jika
                halaman direfresh, data tidak akan hilang. Namun, jika ingin memulai
                dari awal, hapus semua tamu dari daftar.
              </li>
            </ol>
          </div>
  
            </div>
            
          ) : null}
          </section>
        ) : (
          <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {summaryCards.map((card) => (
              <article
                key={card.key}
                className="flex flex-col gap-3 rounded-3xl border border-[#eadacc] bg-white/80 p-6 shadow-[0_18px_40px_-25px_rgba(111,54,38,0.35)] backdrop-blur transition hover:-translate-y-1 hover:shadow-[0_20px_45px_-24px_rgba(111,54,38,0.45)]"
              >
                <card.icon className="h-9 w-9 text-[#8b0000]" />
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-[#a7723a]">
                    {card.label}
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-[#5d4a3a]">
                    {card.value}
                  </p>
                  <p className="mt-1 text-sm text-[#7c6651]">{card.hint}</p>
                </div>
              </article>
            ))}
          </section>

          <section className="grid gap-6 lg:grid-cols-[1.8fr_1fr]">
            <div className="flex flex-col gap-6 rounded-3xl border border-[#eadacc] bg-white/80 p-6 shadow-[0_18px_40px_-25px_rgba(111,54,38,0.35)] backdrop-blur">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative w-full sm:max-w-xs">
                  <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a7723a]" />
                  <input
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Cari nama atau ucapan..."
                    className="w-full rounded-full border border-[#eadacc] bg-white/90 py-3 pl-11 pr-4 text-sm text-[#5d4a3a] outline-none transition focus:border-[#8b0000] focus:ring-2 focus:ring-[#8b0000]/20"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-2 rounded-full bg-[#f3e7da] p-1">
                    {(['all', 'hadir', 'tidak_hadir'] as const).map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setStatusFilter(option)}
                        className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] transition sm:text-sm ${
                          statusFilter === option
                            ? 'bg-[#8b0000] text-white shadow'
                            : 'text-[#a7723a]'
                        }`}
                      >
                        {option === 'all'
                          ? 'Semua'
                          : option === 'hadir'
                            ? 'Hadir'
                            : 'Belum Hadir'}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="inline-flex items-center gap-2 rounded-full border border-[#eadacc] bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#8b0000] transition hover:-translate-y-0.5 hover:border-[#8b0000] hover:text-[#8b0000] disabled:cursor-not-allowed disabled:text-[#c8a1a1]"
                  >
                    <RefreshCcw
                      className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`}
                    />
                    Segarkan
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#a7723a] sm:text-sm">
                  <span>
                    Menampilkan{' '}
                    <strong className="font-semibold text-[#5d4a3a]">
                      {filteredEntries.length}
                    </strong>{' '}
                    dari{' '}
                    <strong className="font-semibold text-[#5d4a3a]">
                      {entries.length}
                    </strong>{' '}
                    RSVP tercatat
                  </span>
                  {isLoading ? (
                    <span>Memuat data...</span>
                  ) : null}
                </div>

                {isLoading ? (
                  <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-[#eadacc] bg-white/80 px-8 py-16 text-center text-sm text-[#7c6651]">
                    <Clock className="h-8 w-8 text-[#a7723a]" />
                    <p>Sedang memuat data RSVP. Mohon tunggu sejenak.</p>
                  </div>
                ) : filteredEntries.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-[#eadacc] bg-white/80 px-8 py-16 text-center text-sm text-[#7c6651]">
                    <XCircle className="h-8 w-8 text-[#a7723a]" />
                    <p>
                      Belum ada data RSVP yang sesuai dengan filter atau kata kunci
                      yang dicari.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredEntries.map((entry) => (
                      <article
                        key={entry.id}
                        className="space-y-4 rounded-3xl border border-[#eadacc] bg-white/90 p-5 shadow-[0_10px_28px_-22px_rgba(111,54,38,0.65)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-26px_rgba(111,54,38,0.6)]"
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <h3 className="text-base font-semibold text-[#5d4a3a] sm:text-lg">
                              {entry.name}
                            </h3>
                            <p className="text-xs uppercase tracking-[0.35em] text-[#a7723a]">
                              {channelLabels[entry.channel]}
                            </p>
                          </div>
                          <span
                            className={`inline-flex items-center justify-center rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] ${
                              entry.attendance === 'hadir'
                                ? 'bg-[#8b0000]/15 text-[#8b0000]'
                                : 'bg-[#eadacc] text-[#7c6651]'
                            }`}
                          >
                            {entry.attendance === 'hadir'
                              ? 'InsyaAllah Hadir'
                              : 'Belum Bisa Hadir'}
                          </span>
                        </div>

                        <p className="text-sm leading-relaxed text-[#7c6651] sm:text-base">
                          “{entry.message}”
                        </p>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-[#a7723a] sm:text-sm">
                          <span className="inline-flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            {formatDateTime(entry.createdAt)}
                          </span>
                          <span className="inline-flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            {entry.guestCount > 0
                              ? `${entry.guestCount} orang`
                              : 'Tanpa rombongan'}
                          </span>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <aside className="flex flex-col gap-6">
              <div className="space-y-5 rounded-3xl border border-[#eadacc] bg-white/80 p-6 shadow-[0_18px_40px_-25px_rgba(111,54,38,0.35)] backdrop-blur">
                <div>
                  <h2 className="text-base font-semibold text-[#5d4a3a] sm:text-lg">
                    Tren Kehadiran Minggu Ini
                  </h2>
                  <p className="text-sm text-[#7c6651]">
                    Persentase hadir vs belum hadir berdasarkan tanggal RSVP.
                  </p>
                </div>

                <div className="space-y-5">
                  {timeline.length === 0 ? (
                    <p className="rounded-2xl border border-dashed border-[#eadacc] bg-white/70 px-4 py-6 text-center text-sm text-[#7c6651]">
                      Belum ada data untuk ditampilkan.
                    </p>
                  ) : (
                    timeline.map((day) => (
                      <div key={day.isoDate} className="space-y-3">
                        <div className="flex items-center justify-between text-xs text-[#7c6651] sm:text-sm">
                          <span className="font-medium text-[#5d4a3a]">
                            {day.label}
                          </span>
                          <span>{day.total} RSVP</span>
                        </div>
                        <div className="h-3 w-full overflow-hidden rounded-full bg-[#eadacc]">
                          <div
                            className="h-full rounded-full bg-[#8b0000]/80"
                            style={{ width: `${day.hadirRatio}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-xs text-[#a7723a]">
                          <span>{day.hadir} hadir</span>
                          <span>{day.tidakHadir} belum bisa hadir</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="space-y-4 rounded-3xl border border-[#eadacc] bg-white/80 p-6 shadow-[0_18px_40px_-25px_rgba(111,54,38,0.35)] backdrop-blur">
                <h2 className="text-base font-semibold text-[#5d4a3a] sm:text-lg">
                  Highlight Acara
                </h2>
                <ul className="space-y-3 text-sm text-[#7c6651]">
                  <li>
                    <span className="font-semibold text-[#5d4a3a]">Hari tersibuk:</span>{' '}
                    {metrics.busiestDayLabel ?? 'Belum ada data'}
                  </li>
                  <li>
                    <span className="font-semibold text-[#5d4a3a]">Estimasi tamu hadir:</span>{' '}
                    {metrics.totalGuests} orang
                  </li>
                  <li>
                    <span className="font-semibold text-[#5d4a3a]">Tamu terbaru:</span>{' '}
                    {metrics.latestSubmission
                      ? `${metrics.latestSubmission.name} • ${formatDateTime(metrics.latestSubmission.createdAt)}`
                      : 'Belum ada RSVP masuk'}
                  </li>
                </ul>
              </div>
            </aside>
          </section>
        </>
        )}
      </div>
    </div>
  );
}

function parseGuestNames(input: string) {
  return input
    .split(/[\n,]+/u)
    .map((value) => value.trim())
    .filter((value) => value.length > 0);
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function ensureUniqueSlug(base: string, used: Set<string>) {
  let slug = base;
  let counter = 2;

  while (used.has(slug)) {
    slug = `${base}-${counter}`;
    counter += 1;
  }

  return slug;
}

function generateGuestId(index: number) {
  const cryptoApi = typeof globalThis !== 'undefined' ? globalThis.crypto : undefined;

  if (cryptoApi && typeof cryptoApi.randomUUID === 'function') {
    return cryptoApi.randomUUID();
  }

  return `guest-${Date.now()}-${index + 1}`;
}

function buildPersonalizedText(template: string, name: string, link: string) {
  const safeName = name.trim() || 'Tamu Undangan';
  const safeLink = link.trim();
  const hasNamePlaceholder = /\[nama\]/iu.test(template);
  const hasLinkPlaceholder = /\[link-undangan\]/iu.test(template);

  let result = template || '';

  result = result.replace(/\[nama\]/giu, safeName);
  const linkReplacement = safeLink || 'Link undangan akan menyusul.';
  result = result.replace(/\[link-undangan\]/giu, linkReplacement);

  if (!hasNamePlaceholder) {
    result = [`Yth. ${safeName},`, '', result].join('\n');
  }

  if (!hasLinkPlaceholder) {
    const linkLine = safeLink
      ? `Link undangan: ${safeLink}`
      : 'Link undangan akan menyusul.';
    result = `${result}\n\n${linkLine}`;
  }

  return result.trim();
}

function detectTemplateKey(content: string): InvitationTemplateKey {
  const matchedTemplate = invitationTemplates.find(
    (template) => template.content === content,
  );

  if (matchedTemplate) {
    return matchedTemplate.key;
  }

  return 'custom';
}

function calculateMetrics(data: RSVPEntry[]) {
  const total = data.length;
  const hadir = data.filter((entry) => entry.attendance === 'hadir').length;
  const tidakHadir = total - hadir;
  const totalGuests = data.reduce((sum, entry) => sum + entry.guestCount, 0);
  const confirmedGuestTotal = data
    .filter((entry) => entry.attendance === 'hadir')
    .reduce((sum, entry) => sum + entry.guestCount, 0);

  const attendanceRate = total > 0 ? Math.round((hadir / total) * 100) : 0;
  const tidakHadirRate = total > 0 ? Math.round((tidakHadir / total) * 100) : 0;

  let busiestDayLabel: string | null = null;
  let busiestDayTotal = 0;
  const perDay = new Map<string, { total: number }>();

  data.forEach((entry) => {
    const date = new Date(entry.createdAt);
    const dateKey = Number.isNaN(date.getTime())
      ? ''
      : date.toISOString().slice(0, 10);

    if (!dateKey) {
      return;
    }

    const current = perDay.get(dateKey);
    if (current) {
      current.total += 1;
    } else {
      perDay.set(dateKey, { total: 1 });
    }
  });

  perDay.forEach((value, key) => {
    if (value.total > busiestDayTotal) {
      busiestDayTotal = value.total;
      busiestDayLabel = longDayFormatter.format(new Date(`${key}T00:00:00`));
    }
  });

  return {
    total,
    hadir,
    tidakHadir,
    attendanceRate,
    tidakHadirRate,
    totalGuests,
    avgConfirmedGuests: hadir > 0 ? confirmedGuestTotal / hadir : 0,
    latestSubmission: data[0] ?? null,
    busiestDayLabel,
  };
}

function buildTimeline(data: RSVPEntry[]) {
  const perDay = new Map<string, { hadir: number; tidakHadir: number }>();

  data.forEach((entry) => {
    const date = new Date(entry.createdAt);
    const dateKey = Number.isNaN(date.getTime())
      ? ''
      : date.toISOString().slice(0, 10);

    if (!dateKey) {
      return;
    }

    const current = perDay.get(dateKey);
    if (current) {
      if (entry.attendance === 'hadir') {
        current.hadir += 1;
      } else {
        current.tidakHadir += 1;
      }
    } else {
      perDay.set(dateKey, {
        hadir: entry.attendance === 'hadir' ? 1 : 0,
        tidakHadir: entry.attendance === 'tidak_hadir' ? 1 : 0,
      });
    }
  });

  return Array.from(perDay.entries())
    .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
    .map(([isoDate, counts]) => {
      const total = counts.hadir + counts.tidakHadir;
      return {
        isoDate,
        label: dayFormatter.format(new Date(`${isoDate}T00:00:00`)),
        total,
        hadir: counts.hadir,
        tidakHadir: counts.tidakHadir,
        hadirRatio: total > 0 ? Math.round((counts.hadir / total) * 100) : 0,
      };
    });
}

function formatDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '-';
  }
  return dateTimeFormatter.format(date);
}
