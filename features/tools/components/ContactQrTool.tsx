"use client";

import React, { useState } from 'react';
import { GlassCard } from '@/shared/components/ui/GlassCard';
import { QrCode, Link as LinkIcon, Phone, Mail, ArrowRight, Loader2, Download } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { toast } from 'sonner';
import { apiFetch } from '@/shared/lib/api';

type QrType = 'url' | 'tel' | 'email';

export const ContactQrTool: React.FC = () => {
  const [type, setType] = useState<QrType>('url');
  const [value, setValue] = useState('');
  const [qrUrl, setQrUrl] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  // Clean up object URLs to prevent memory leaks
  React.useEffect(() => {
    return () => {
      if (qrUrl) URL.revokeObjectURL(qrUrl);
    };
  }, [qrUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!value) return;

    setLoading(true);
    if (qrUrl) {
      URL.revokeObjectURL(qrUrl);
      setQrUrl(null);
    }

    let finalValue = value;
    if (type === 'tel') finalValue = `tel:${value}`;
    if (type === 'email') finalValue = `mailto:${value}`;

    try {
      const encodedValue = encodeURIComponent(finalValue);
      const blob = await apiFetch<Blob>(`/api/v1/tools/qr?url=${encodedValue}&width=300&height=300`, {
        responseType: 'blob'
      });
      
      const objectUrl = URL.createObjectURL(blob);
      setQrUrl(objectUrl);
      toast.success("¡Código QR generado con éxito!");
    } catch (err: unknown) {
      const error = err as { status?: number; message?: string };
      if (error.status === 400) {
        toast.error(error.message || "Datos incorrectos para generar el QR");
      } else {
        toast.error("Error al generar el código QR");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <GlassCard className="p-8 max-w-2xl mx-auto rounded-[2.5rem]">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-brand-turquoise/10 text-brand-turquoise rounded-2xl">
          <QrCode className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Generador QR Pro</h2>
          <p className="text-sm text-slate-500 font-medium">Crea códigos QR para enlaces, llamadas o correos.</p>
        </div>
      </div>

      <div className="flex p-1 bg-slate-100 rounded-2xl mb-8">
        {(['url', 'tel', 'email'] as const).map((t) => (
          <button
            key={t}
            onClick={() => { setType(t); setValue(''); setQrUrl(null); }}
            className={cn(
              "flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
              type === t ? "bg-white text-brand-turquoise shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
            {type === 'url' ? 'Dirección URL' : type === 'tel' ? 'Número de Teléfono' : 'Correo Electrónico'}
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              {type === 'url' && <LinkIcon size={18} />}
              {type === 'tel' && <Phone size={18} />}
              {type === 'email' && <Mail size={18} />}
            </div>
            <input
              type={type === 'email' ? 'email' : 'text'}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={type === 'url' ? 'https://ejemplo.com' : type === 'tel' ? '+34 600 000 000' : 'hola@ejemplo.com'}
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-brand-turquoise/20 focus:bg-white rounded-2xl outline-none transition-all text-slate-900 font-medium text-base"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-brand-turquoise text-white rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-brand-turquoise/90 transition-all shadow-lg shadow-brand-turquoise/20 disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : "Generar Código QR"}
          {!loading && <ArrowRight size={18} />}
        </button>
      </form>

      {qrUrl && (
        <div className="mt-12 flex flex-col items-center animate-in fade-in zoom-in-95 duration-500">
          <div className="p-4 bg-white rounded-[2rem] border-2 border-slate-100 shadow-xl relative group">
            <img src={qrUrl} alt="QR Code" className="w-48 h-48" />
            
            <a 
              href={qrUrl} 
              download={`navajagt-qr-${type}.png`}
              className="absolute inset-0 bg-slate-900/40 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm"
            >
              <div className="bg-white text-slate-900 px-4 py-2 rounded-xl font-bold flex items-center gap-2 text-sm shadow-xl transform translate-y-2 group-hover:translate-y-0 transition-transform">
                <Download size={16} /> Descargar
              </div>
            </a>
          </div>
          <p className="mt-4 text-xs font-black uppercase tracking-widest text-slate-400">Escanea o haz hover para descargar</p>
        </div>
      )}
    </GlassCard>
  );
};
