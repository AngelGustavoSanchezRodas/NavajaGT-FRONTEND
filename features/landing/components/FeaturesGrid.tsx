import { 
  Link,
  Image as ImageIcon,
  Wifi,
  Zap,
  Globe,
  ShieldCheck
} from "lucide-react";
import { GlassCard } from "@/shared/components/ui/GlassCard";
import { cn } from "@/shared/lib/utils";

const TOOLS = [
  {
    title: "Acortador Inteligente",
    description: "Crea enlaces cortos, personalizados y rastreables en milisegundos con analíticas en tiempo real.",
    icon: Link,
    color: "text-brand-turquoise",
    bgColor: "bg-brand-turquoise/10",
  },
  {
    title: "Biolink Builder",
    description: "Diseña tu propia página de aterrizaje personalizada para tus redes sociales con un diseño premium.",
    icon: ImageIcon,
    color: "text-brand-magenta",
    bgColor: "bg-brand-magenta/10",
  },
  {
    title: "Generador QR Wi-Fi",
    description: "Comparte tu conexión de red de forma segura mediante códigos QR listos para escanear.",
    icon: Wifi,
    color: "text-brand-turquoise",
    bgColor: "bg-brand-turquoise/10",
  }
];

export function FeaturesGrid() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {TOOLS.map((tool, index) => (
          <GlassCard 
            key={index} 
            className="group flex h-full flex-col p-6 transition-all hover:-translate-y-1 hover:shadow-xl cursor-pointer border-slate-100/50"
          >
            <div className={cn(
              "mb-5 flex h-12 w-12 items-center justify-center rounded-2xl transition-transform group-hover:scale-110",
              tool.bgColor,
              tool.color
            )}>
              <tool.icon className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-slate-900">{tool.title}</h3>
            <p className="text-sm leading-relaxed text-slate-500">
              {tool.description}
            </p>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
