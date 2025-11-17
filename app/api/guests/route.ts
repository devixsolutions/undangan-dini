import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type GuestResource = {
  id: string;
  name: string;
  inviteLink: string;
  createdAt: string;
  updatedAt: string;
};

function toResource(guest: {
  id: string;
  name: string;
  inviteLink: string;
  createdAt: Date;
  updatedAt: Date;
}): GuestResource {
  return {
    id: guest.id,
    name: guest.name,
    inviteLink: guest.inviteLink,
    createdAt: guest.createdAt.toISOString(),
    updatedAt: guest.updatedAt.toISOString(),
  };
}

export async function GET(request: Request) {
  try {
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL is not configured');
      return NextResponse.json(
        { error: 'Database configuration error.' },
        { status: 500 },
      );
    }

    const url = new URL(request.url);
    const nameQuery = url.searchParams.get('name');

    const items = await prisma.guest.findMany({
      where: nameQuery
        ? {
            name: {
              equals: nameQuery,
              mode: 'insensitive',
            },
          }
        : undefined,
      orderBy: {
        createdAt: 'desc',
      },
      take: nameQuery ? 1 : undefined,
    });

    return NextResponse.json({
      data: items.map(toResource),
    });
  } catch (error) {
    console.error('Failed to fetch guests', error);
    return NextResponse.json(
      { error: 'Gagal memuat data tamu.' },
      { status: 500 },
    );
  }
}

type PostPayload = {
  name?: unknown;
  inviteLink?: unknown;
};

function parsePostPayload(body: PostPayload) {
  const errors: string[] = [];

  const name =
    typeof body.name === 'string' ? body.name.trim() : undefined;
  if (!name || name.length < 2) {
    errors.push('Nama tamu wajib diisi minimal 2 karakter.');
  }

  const inviteLink =
    typeof body.inviteLink === 'string' ? body.inviteLink.trim() : undefined;
  if (!inviteLink) {
    errors.push('Link undangan wajib diisi.');
  }

  const values =
    errors.length === 0 ? { name: name!, inviteLink: inviteLink! } : null;

  return { errors, values } as const;
}

export async function POST(request: Request) {
  try {
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

    const created = await prisma.guest.create({
      data: {
        name: result.values.name,
        inviteLink: result.values.inviteLink,
      },
    });

    return NextResponse.json(
      { data: toResource(created) },
      { status: 201 },
    );
  } catch (error) {
    console.error('Failed to create guest', error);
    return NextResponse.json(
      { error: 'Gagal menyimpan data tamu.' },
      { status: 500 },
    );
  }
}

