import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { EnlaceResponse } from '@/types/biolink';
import { siteConfig } from '@/shared/config/site';

interface Props {
  params: { alias: string };
}

async function getBiolinkData(alias: string): Promise<EnlaceResponse | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/public/enlaces/${alias}`, {
      cache: 'no-store',
    });

    if (!res.ok) return null;

    const data: EnlaceResponse = await res.json();

    if (data.tipo !== 'BIOLINK') return null;

    return data;
  } catch (error) {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await getBiolinkData(params.alias);

  if (!data) return {};

  const { titulo, descripcion, avatarUrl } = data.metadata;

  return {
    title: titulo,
    description: descripcion,
    openGraph: {
      title: titulo,
      description: descripcion,
      images: [avatarUrl],
    },
    twitter: {
      card: 'summary_large_image',
      title: titulo,
      description: descripcion,
      images: [avatarUrl],
    },
  };
}

export default async function BioPage({ params }: Props) {
  const data = await getBiolinkData(params.alias);

  if (!data) {
    notFound();
  }

  const { titulo, descripcion, avatarUrl, tema, colorPrincipal, enlaces } = data.metadata;

  const isDark = tema === 'DARK';

  return (
    <main 
      className={`min-h-screen w-full flex flex-col items-center py-12 px-4 transition-colors duration-300 ${
        isDark ? 'bg-zinc-950 text-white' : 'bg-zinc-50 text-zinc-900'
      }`}
    >
      <div className="max-w-md w-full flex flex-col items-center text-center space-y-6">
        {/* Profile Header */}
        <div className="flex flex-col items-center space-y-4">
          {avatarUrl && (
            <img
              src={avatarUrl}
              alt={titulo}
              className="w-24 h-24 rounded-full object-cover border-2 shadow-xl"
              style={{ borderColor: colorPrincipal }}
            />
          )}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">{titulo}</h1>
            <p className={`text-sm opacity-80 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              {descripcion}
            </p>
          </div>
        </div>

        {/* Links List */}
        <div className="w-full flex flex-col space-y-4 pt-4">
          {enlaces
            .filter((link) => link.activo)
            .map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative w-full py-4 px-6 rounded-xl font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] border shadow-sm flex items-center justify-center ${
                  isDark 
                    ? 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-white' 
                    : 'bg-white border-zinc-200 hover:bg-zinc-50 text-zinc-900'
                }`}
                style={{ 
                  borderLeft: `4px solid ${colorPrincipal}`
                }}
              >
                <span className="truncate">{link.titulo}</span>
              </a>
            ))}
        </div>

        {/* Footer / Branding */}
        <footer className="pt-12 pb-6 opacity-40 text-xs font-medium uppercase tracking-widest">
          Potenciado por {siteConfig.name}
        </footer>
      </div>
    </main>
  );
}
