"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { UrlShortenerTool } from "@/features/links/components/UrlShortenerTool";
import BiolinkBuilder from "@/features/dashboard/components/BiolinkBuilder";
import { ContactQrTool } from "@/features/tools/components/ContactQrTool";
import { BackgroundGlow } from "@/shared/components/ui/BackgroundGlow";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ToolPage() {
  const params = useParams();
  const toolId = params.toolId as string;
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const renderTool = () => {
    switch (toolId) {
      case "acortador":
        return <UrlShortenerTool />;
      case "biolink":
        return <BiolinkBuilder />;
      case "qr-wifi":
        return <ContactQrTool />;
      default:
        return (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-slate-900">Herramienta no encontrada</h2>
            <Link href="/" className="mt-4 inline-block text-brand-turquoise font-bold hover:underline">
              Volver al inicio
            </Link>
          </div>
        );
    }
  };

  const getTitle = () => {
    switch (toolId) {
      case "acortador": return "Acortador de Enlaces";
      case "biolink": return "Biolink Builder";
      case "qr-wifi": return "Generador QR Wi-Fi";
      default: return "Herramienta";
    }
  };

  return (
    <main className="relative min-h-screen bg-slate-50 pt-20 pb-20">
      <BackgroundGlow color="turquoise" className="left-[-10%] top-[-5%] h-[40rem] w-[40rem] opacity-20" />
      
      <div className="relative z-10 mx-auto max-w-4xl px-4">
        <Link 
          href="/" 
          className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition-colors hover:text-slate-900"
        >
          <ArrowLeft size={16} />
          Volver a NavajaGT
        </Link>

        <header className="mb-12 text-center">
          <h1 className="text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
            {getTitle()}
          </h1>
          <p className="mt-4 text-lg font-medium text-slate-500">
            Potente, rápido y profesional. Todo lo que necesitas en una sola herramienta.
          </p>
        </header>

        <div className="w-full shadow-2xl rounded-3xl overflow-hidden bg-white/40 backdrop-blur-xl border border-white/60">
          {isMounted && renderTool()}
        </div>
      </div>
    </main>
  );
}
