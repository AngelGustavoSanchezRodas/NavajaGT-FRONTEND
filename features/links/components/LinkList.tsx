"use client";

import React, { useEffect, useState } from 'react';
import { 
  Link as LinkIcon, 
  ExternalLink, 
  Copy, 
  Check, 
  MoreVertical, 
  BarChart3, 
  Calendar,
  Globe,
  Trash2,
  Edit2
} from 'lucide-react';
import { toast } from 'sonner';
import { apiFetch } from '@/shared/lib/api';
import { EnlaceResponse } from '@/types/biolink';
import { EmptyState } from '@/shared/components/ui/EmptyState';
import { GlassCard } from '@/shared/components/ui/GlassCard';
import { cn } from '@/shared/lib/utils';
import { useCopyToClipboard } from '@/shared/hooks/useCopyToClipboard';
import { useRouter } from 'next/navigation';

export function LinkList() {
  const [links, setLinks] = useState<EnlaceResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const { copy, copied } = useCopyToClipboard();
  const [activeId, setActiveId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const data = await apiFetch<EnlaceResponse[]>('/api/management/links/list/');
        setLinks(data);
      } catch (err: unknown) {
        const error = err as { status?: number; message?: string };
        
        if (error.status === 401) {
          router.push('/login');
        } else if (error.status === 400) {
          toast.error(error.message || 'Solicitud incorrecta');
        } else {
          toast.error('Error al cargar enlaces');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLinks();
  }, []);

  const handleCopy = (alias: string, id: string) => {
    const appUrl = window.location.origin;
    const url = `${appUrl}/${alias}`;
    setActiveId(id);
    copy(url);
    setTimeout(() => setActiveId(null), 2000);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <GlassCard key={i} className="h-56 animate-pulse bg-gray-200/20 border-slate-200/50 rounded-[2.5rem]" />
        ))}
      </div>
    );
  }

  if (links.length === 0) {
    return (
      <EmptyState
        icon={LinkIcon}
        title="No tienes enlaces todavía"
        description="Empieza creando un enlace corto o un Biolink para ver tus estadísticas aquí."
        actionLabel="Crear mi primer enlace"
        onAction={() => window.location.href = '/dashboard'}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {links.map((link) => (
        <GlassCard 
          key={link.id} 
          className="group p-6 rounded-[2.5rem] border border-slate-200/60 hover:border-brand-turquoise/30 transition-all duration-300 flex flex-col gap-4"
        >
          <div className="flex items-start justify-between">
            <div className={cn(
              "p-3 rounded-2xl",
              link.tipo === 'BIOLINK' ? "bg-brand-magenta/10 text-brand-magenta" : "bg-brand-turquoise/10 text-brand-turquoise"
            )}>
              {link.tipo === 'BIOLINK' ? <Globe size={20} /> : <LinkIcon size={20} />}
            </div>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => handleCopy(link.alias, link.id)}
                className="p-2 text-slate-400 hover:text-brand-turquoise transition-colors rounded-lg hover:bg-slate-50"
              >
                {activeId === link.id && copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
              <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors rounded-lg hover:bg-slate-50">
                <MoreVertical size={16} />
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <h4 className="font-black text-slate-900 text-lg tracking-tight truncate pr-4 max-w-full">
              {link.tipo === 'BIOLINK' ? `/${link.alias}` : link.alias}
            </h4>
            <p className="text-xs font-medium text-slate-400 truncate max-w-[200px] sm:max-w-xs">
              {link.urlOriginal || 'Perfil Biolink'}
            </p>
          </div>

          <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-slate-500 font-bold text-xs">
                <BarChart3 size={14} className="text-slate-400" />
                {link.clicks} <span className="font-medium text-slate-400">clics</span>
              </div>
            </div>
            <a 
              href={`/${link.alias}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 bg-slate-50 text-slate-400 hover:text-brand-turquoise rounded-xl transition-all hover:bg-brand-turquoise/5"
            >
              <ExternalLink size={14} />
            </a>
          </div>
        </GlassCard>
      ))}
    </div>
  );
}
