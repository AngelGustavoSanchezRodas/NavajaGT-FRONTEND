"use client";

import React, { useState, useEffect } from 'react';
import { BackgroundGlow } from "@/shared/components/ui/BackgroundGlow";
import { FeaturesGrid } from "@/features/landing/components/FeaturesGrid";
import { BenefitsSection } from "@/features/landing/components/BenefitsSection";
import { UrlShortenerTool } from "@/features/links/components/UrlShortenerTool";
import BiolinkBuilder from '@/features/dashboard/components/BiolinkBuilder';
import { ContactQrTool } from '@/features/tools/components/ContactQrTool';

export default function Home() {
  const [activeTool, setActiveTool] = useState("shortener");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const renderActiveTool = () => {
    switch (activeTool) {
      case 'biolink':
        return <BiolinkBuilder />;
      case 'qr':
        return <ContactQrTool />;
      default:
        return <UrlShortenerTool />;
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50/30">
      {/* Background Glows */}
      <BackgroundGlow color="turquoise" className="left-[-10%] top-[-5%] h-[40rem] w-[40rem] opacity-30" />
      <BackgroundGlow color="magenta" className="right-[-10%] top-[10%] h-[30rem] w-[30rem] opacity-20" />
      <BackgroundGlow color="mustard" className="bottom-[20%] left-[10%] h-[35rem] w-[35rem] opacity-10" />

      <div className="relative z-10">
        {/* Hero Section: Centered Layout */}
        <section className="mx-auto flex w-full max-w-6xl flex-col items-center px-4 pt-32 pb-24 text-center md:pt-44">
          <div className="mb-12 inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white/80 px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.25em] text-slate-500 shadow-sm backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-brand-turquoise shadow-[0_0_10px_rgba(20,184,166,0.6)] animate-pulse" />
            Ecosistema Digital 2.0
          </div>
          
          <h1 className="mb-8 max-w-5xl text-6xl font-[1000] tracking-[-0.05em] text-slate-900 md:text-8xl lg:text-9xl leading-[0.9]">
            Potencia tu <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-brand-turquoise via-emerald-500 to-brand-turquoise bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient">Presencia</span>
          </h1>
          
          <p className="mb-16 max-w-3xl text-xl font-medium leading-relaxed text-slate-500/80 md:text-2xl lg:text-3xl">
            La plataforma definitiva para biolinks premium y acortadores inteligentes.
          </p>
          
          <div className="flex w-full items-center justify-center px-4">
            {!isMounted ? (
               <div className="h-[450px] w-full max-w-4xl animate-pulse rounded-[3rem] bg-white/50 backdrop-blur-sm border border-white" />
            ) : renderActiveTool()}
          </div>

          <div className="mt-20 flex flex-wrap justify-center gap-5">
            {['Enlaces', 'Biolinks', 'Seguridad QR', 'Analítica'].map((cat) => (
              <span 
                key={cat}
                className="rounded-full bg-white px-8 py-3.5 text-sm font-extrabold text-slate-600 shadow-sm ring-1 ring-slate-100 transition-all hover:scale-105 hover:text-brand-turquoise hover:shadow-xl cursor-default"
              >
                {cat}
              </span>
            ))}
          </div>
        </section>

        {/* Features Grid */}
        <section className="pb-32 pt-16">
          <div className="mb-20 text-center px-4">
            <h2 className="text-4xl font-black tracking-tighter text-slate-900 md:text-5xl">Herramientas Profesionales</h2>
            <p className="mt-6 text-xl font-medium text-slate-500 max-w-2xl mx-auto">Tecnología de vanguardia para escalar tu impacto digital al siguiente nivel.</p>
          </div>
          <FeaturesGrid onSelectTool={setActiveTool} />
        </section>

        {/* Benefits Section */}
        <BenefitsSection />
      </div>
    </main>
  );
}
