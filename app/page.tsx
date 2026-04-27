"use client";

import React, { useState, useEffect } from 'react';
import { FeaturesGrid } from "@/features/landing/components/FeaturesGrid";
import { BenefitsSection } from "@/features/landing/components/BenefitsSection";
import { UrlShortenerTool } from "@/features/links/components/UrlShortenerTool";

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <main className="relative min-h-screen bg-slate-50">
      <div className="relative z-10">
        {/* Hero Section: Centered Layout */}
        <section className="mx-auto flex w-full max-w-6xl flex-col items-center px-4 pt-24 pb-16 md:pt-32 text-center">
          <h1 className="mb-6 text-4xl font-[1000] tracking-tighter text-slate-900 md:text-6xl lg:text-7xl leading-[1.1] max-w-4xl">
            Herramientas digitales <br className="hidden md:block" /> para el mundo moderno
          </h1>

          <p className="mb-10 max-w-2xl text-lg font-medium text-slate-500 md:text-xl lg:text-2xl leading-relaxed">
            Acorta URLs, crea biolinks y genera QR profesionales <br className="hidden md:block" /> en una sola plataforma de alto rendimiento.
          </p>
          
          <div className="w-full max-w-4xl mx-auto mt-4 relative z-20">
            <div className="absolute inset-x-0 -top-20 -bottom-20 bg-gradient-to-b from-brand-turquoise/10 via-brand-turquoise/5 to-transparent blur-[100px] -z-10 opacity-60" />
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
