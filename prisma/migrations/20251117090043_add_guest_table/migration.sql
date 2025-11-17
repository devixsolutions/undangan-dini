-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('HADIR', 'TIDAK_HADIR');

-- CreateEnum
CREATE TYPE "RSVPChannel" AS ENUM ('WEBSITE', 'WHATSAPP', 'MANUAL');

-- CreateTable
CREATE TABLE "rsvps" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "attendance" "AttendanceStatus" NOT NULL,
    "channel" "RSVPChannel" NOT NULL DEFAULT 'WEBSITE',
    "guestCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rsvps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guests" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "inviteLink" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "guests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "rsvps_created_at_idx" ON "rsvps"("createdAt");

-- CreateIndex
CREATE INDEX "rsvps_attendance_idx" ON "rsvps"("attendance");

-- CreateIndex
CREATE INDEX "guests_name_idx" ON "guests"("name");
