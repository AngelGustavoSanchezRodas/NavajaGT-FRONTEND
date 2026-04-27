"use client";

import React, { useState, useEffect } from 'react';
import { FeaturesGrid } from "@/features/landing/components/FeaturesGrid";
import { BenefitsSection } from "@/features/landing/components/BenefitsSection";
import { UrlShortenerTool } from "@/features/links/components/UrlShortenerTool";
import BiolinkBuilder from '@/features/dashboard/components/BiolinkBuilder';
import { ContactQrTool } from '@/features/tools/components/ContactQrTool';

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <main className="relative min-h-screen bg-slate-50">
      <div className="relative z-10">
        {/* Hero Section: Centered Layout */}
        <section className="mx-auto flex w-full max-w-6xl flex-col items-center px-4 pt-12 pb-12 md:pt-16 text-center">
          <h1 className="mb-5 text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl leading-tight">
            Herramientas para tus enlaces y QRs
          </h1>

          <p className="mb-8 max-w-2xl text-lg text-slate-600 md:text-xl">
            Acorta URLs, crea biolinks y genera QR en un solo lugar.
          </p>
          
          <div className="w-full max-w-3xl mx-auto mt-6 relative z-20 shadow-2xl rounded-3xl">
            {isMounted && <UrlShortenerTool />}
          </div>
        </section>

        {/* Features Grid */}
        <section className="pb-32 pt-16">
          <div className="mb-20 text-center px-4">
            <h2 className="text-4xl font-black tracking-tighter text-slate-900 md:text-5xl">Herramientas Profesionales</h2>
            <p className="mt-6 text-xl font-medium text-slate-500 max-w-2xl mx-auto">Tecnología de vanguardia para escalar tu impacto digital al siguiente nivel.</p>
          </div>
          <FeaturesGrid />
        </section>

        {/* Benefits Section */}
        <BenefitsSection />
      </div>
    </main>
  );
}
