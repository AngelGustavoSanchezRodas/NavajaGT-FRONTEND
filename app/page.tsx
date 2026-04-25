import { BackgroundGlow } from "@/shared/components/ui/BackgroundGlow";
import { FeaturesGrid } from "@/features/landing/components/FeaturesGrid";
import { BenefitsSection } from "@/features/landing/components/BenefitsSection";
import { ContactSection } from "@/features/landing/components/ContactSection";
import { UrlShortenerTool } from "@/features/links/components/UrlShortenerTool";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Background Glows */}
      <BackgroundGlow
        color="turquoise"
        className="left-[-10%] top-[-5%] h-[30rem] w-[30rem]"
      />
      <BackgroundGlow
        color="magenta"
        className="right-[-10%] top-[10%] h-[20rem] w-[20rem]"
      />
      <BackgroundGlow
        color="mustard"
        className="bottom-[20%] left-[10%] h-[25rem] w-[25rem]"
      />

      <div className="relative z-10">
        {/* Hero Section: Centered Layout (Search-First) */}
        <section className="mx-auto flex w-full max-w-4xl flex-col items-center pt-24 pb-12 px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-turquoise/10 text-brand-turquoise font-bold text-xs uppercase tracking-wider mb-8 border border-brand-turquoise/20">
            <span className="flex h-2 w-2 rounded-full bg-brand-turquoise animate-pulse" />
            Nueva Versión: NavajaGT 2.0
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
            NavajaGT: Tu <span className="text-brand-turquoise">Navaja Suiza</span> Digital
          </h1>
          
          <p className="text-lg text-slate-600 mb-10 max-w-2xl leading-relaxed">
            La plataforma definitiva para la gestión de enlaces y presencia digital. 
            Crea biolinks premium, acorta URLs con analíticas y genera QRs seguros en un solo lugar.
          </p>
          
          <div className="w-full mb-12">
            <UrlShortenerTool />
          </div>

          {/* Category Badges (Inspired by IAEstudio) */}
          <div className="flex flex-wrap justify-center gap-3">
            {['Enlaces', 'Biolinks', 'Seguridad QR', 'Analítica'].map((cat) => (
              <span 
                key={cat}
                className="px-6 py-2 rounded-full bg-white border border-slate-100 text-slate-600 text-sm font-bold shadow-sm hover:border-brand-turquoise/30 hover:text-brand-turquoise transition-all cursor-default"
              >
                {cat}
              </span>
            ))}
          </div>
        </section>

        {/* Features Grid */}
        <section className="pb-16 pt-8">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-bold text-slate-900">Herramientas Profesionales</h2>
            <p className="mt-2 text-sm text-slate-500">Todo lo que necesitas para potenciar tu presencia digital en un solo clic.</p>
          </div>
          <FeaturesGrid />
        </section>

        {/* Benefits Section */}
        <BenefitsSection />

        {/* Contact/Premium Section */}
        <ContactSection />
      </div>
    </main>
  );
}
