import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type AttendanceInput = 'hadir' | 'tidak_hadir';
type ChannelInput = 'website' | 'whatsapp' | 'manual';

const attendanceToPrisma: Record<AttendanceInput, 'HADIR' | 'TIDAK_HADIR'> = {
  hadir: 'HADIR',
  tidak_hadir: 'TIDAK_HADIR',
};

const attendanceFromPrisma: Record<'HADIR' | 'TIDAK_HADIR', AttendanceInput> = {
  HADIR: 'hadir',
  TIDAK_HADIR: 'tidak_hadir',
};

const channelToPrisma: Record<ChannelInput, 'WEBSITE' | 'WHATSAPP' | 'MANUAL'> = {
  website: 'WEBSITE',
  whatsapp: 'WHATSAPP',
  manual: 'MANUAL',
};

const channelFromPrisma: Record<'WEBSITE' | 'WHATSAPP' | 'MANUAL', ChannelInput> = {
  WEBSITE: 'website',
  WHATSAPP: 'whatsapp',
  MANUAL: 'manual',
};

type RSVPResource = {
  id: string;
  name: string;
  message: string;
  attendance: AttendanceInput;
  guestCount: number;
  channel: ChannelInput;
  createdAt: string;
  updatedAt: string;
};

function toResource(input: {
  id: string;
  name: string;
  message: string;
  attendance: 'HADIR' | 'TIDAK_HADIR';
  guestCount: number;
  channel: 'WEBSITE' | 'WHATSAPP' | 'MANUAL';
  createdAt: Date;
  updatedAt: Date;
}): RSVPResource {
  return {
    id: input.id,
    name: input.name,
    message: input.message,
    attendance: attendanceFromPrisma[input.attendance],
    guestCount: input.guestCount,
    channel: channelFromPrisma[input.channel],
    createdAt: input.createdAt.toISOString(),
    updatedAt: input.updatedAt.toISOString(),
  };
}

export async function GET(request: Request) {
  try {
    // Check if DATABASE_URL is configured
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL is not configured');
      return NextResponse.json(
        { error: 'Database configuration error.' },
        { status: 500 },
      );
    }

    const url = new URL(request.url);
    const statusParam = url.searchParams.get('attendance');

    const filters: {
      attendance?: 'HADIR' | 'TIDAK_HADIR';
    } = {};

    if (statusParam === 'hadir' || statusParam === 'tidak_hadir') {
      filters.attendance = attendanceToPrisma[statusParam];
    }

    const items = await prisma.rsvp.findMany({
      where: filters,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      data: items.map(toResource),
    });
  } catch (error) {
    console.error('Failed to fetch RSVPs', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    console.error('Error details:', { errorMessage, errorStack });
    
    // Check for common Prisma errors
    if (errorMessage.includes('P1001') || errorMessage.includes('Can\'t reach database')) {
      return NextResponse.json(
        { error: 'Database connection error. Please check your database configuration.' },
        { status: 500 },
      );
    }
    
    return NextResponse.json(
      { error: 'Gagal memuat data RSVP.', details: process.env.NODE_ENV === 'development' ? errorMessage : undefined },
      { status: 500 },
    );
  }
}

type PostPayload = {
  name?: unknown;
  message?: unknown;
  attendance?: unknown;
  guestCount?: unknown;
  channel?: unknown;
};

function parsePostPayload(body: PostPayload) {
  const errors: string[] = [];

  const name =
    typeof body.name === 'string' ? body.name.trim() : undefined;
  if (!name || name.length < 3) {
    errors.push('Nama wajib diisi minimal 3 karakter.');
  }

  const message =
    typeof body.message === 'string' ? body.message.trim() : '';

  const attendance =
    body.attendance === 'hadir' || body.attendance === 'tidak_hadir'
      ? body.attendance
      : undefined;
  if (!attendance) {
    errors.push('Status kehadiran tidak valid.');
  }

  const guestCount =
    typeof body.guestCount === 'number' && Number.isFinite(body.guestCount)
      ? Math.max(0, Math.round(body.guestCount))
      : 0;

  const channel =
    body.channel === 'website' ||
    body.channel === 'whatsapp' ||
    body.channel === 'manual'
      ? body.channel
      : 'website';

  type ParsedValues = {
    name: string;
    message: string;
    attendance: AttendanceInput;
    guestCount: number;
    channel: ChannelInput;
  };

  const values =
    errors.length === 0
      ? ({
          name: name!,
          message: message,
          attendance: attendance!,
          guestCount,
          channel,
        } satisfies ParsedValues)
      : null;

  return {
    errors,
    values,
  } as const;
}

export async function POST(request: Request) {
  try {
    // Check if DATABASE_URL is configured
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL is not configured');
      return NextResponse.json(
        { error: 'Database configuration error.' },
        { status: 500 },
      );
    }

    let body: PostPayload;
    try {
      body = (await request.json()) as PostPayload;
    } catch {
      return NextResponse.json(
        { error: 'Payload tidak valid.' },
        { status: 400 },
      );
    }

    const result = parsePostPayload(body);
    if (!result.values) {
      return NextResponse.json(
        { error: result.errors.join(' ') },
        { status: 422 },
      );
    }

    const record = await prisma.rsvp.create({
      data: {
        name: result.values.name,
        message: result.values.message,
        attendance: attendanceToPrisma[result.values.attendance],
        guestCount: result.values.guestCount,
        channel: channelToPrisma[result.values.channel],
      },
    });

    return NextResponse.json(
      { data: toResource(record) },
      { status: 201 },
    );
  } catch (error) {
    console.error('Failed to create RSVP', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    console.error('Error details:', { errorMessage, errorStack });
    
    // Check for common Prisma errors
    if (errorMessage.includes('P1001') || errorMessage.includes('Can\'t reach database')) {
      return NextResponse.json(
        { error: 'Database connection error. Please check your database configuration.' },
        { status: 500 },
      );
    }
    
    return NextResponse.json(
      { error: 'Gagal menyimpan data RSVP.', details: process.env.NODE_ENV === 'development' ? errorMessage : undefined },
      { status: 500 },
    );
  }
}

