'use client';

import React, { Suspense } from "react";
import Image from "next/image";
import Greetings from "@/components/greetings";
import { useInvitation } from "@/components/invitation-context";
import Cover from "@/components/cover";
import CatinSection from "@/components/catin";
import QuotesSection from "@/components/quotes";
import DateSection from "@/components/date";
import AcaraSection from "@/components/acara";
import GiftSection from "@/components/gift";
import RSVPSection from "@/components/rsvp";
import Footer from "@/components/footer";

const Page = () => {
  const { isOpen } = useInvitation();

  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/assets/bg1.jpg"
          alt="Background"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        {!isOpen && (
          <Suspense fallback={<div className="min-h-screen" />}>
            <Cover />
          </Suspense>
        )}
        {isOpen && (
          <>
            <section className="flex justify-center bg-[#f9f6f1]/90">
              <Greetings />
            </section>
            <QuotesSection />
            <CatinSection />
            <DateSection />
            <AcaraSection />
            <GiftSection />
            <RSVPSection />
            <Footer />
          </>
        )}
      </div>
    </main>
  );
};

export default Page;