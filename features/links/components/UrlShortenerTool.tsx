"use client";

import { FormEvent, useState, useRef } from "react";
import { Link, Loader2, QrCode, Copy, Check, ExternalLink, Settings2, RefreshCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/shared/components/ui/GlassCard";
import { apiFetch } from "@/shared/lib/api";

export function UrlShortenerTool() {
  const [url, setUrl] = useState("");
  const [alias, setAlias] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successAlias, setSuccessAlias] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const resultInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessAlias(null);

    try {
      const response: any = await apiFetch('/api/core/links/create/', {
        method: 'POST',
        body: JSON.stringify({ 
          urlOriginal: url, 
          tipo: 'STANDARD',
          alias: alias || null
        })
      });
      
      setSuccessAlias(response.alias);
    } catch (err: any) {
      if (err.status === 400 || err.status === 409) {
        setError("El alias ya está en uso o es inválido");
      } else {
        setError(err.message || "Ocurrió un error inesperado");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setUrl("");
    setAlias("");
    setSuccessAlias(null);
    setError(null);
    setCopied(false);
  };

  const handleInputClick = () => {
    if (resultInputRef.current) {
      resultInputRef.current.select();
    }
  };

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || (typeof window !== 'undefined' ? window.location.origin : '');
  const shortUrl = successAlias ? `${appUrl}/${successAlias}` : '';

  const copyToClipboard = () => {
    if (shortUrl) {
      navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="mx-auto w-full max-w-xl rounded-[2.5rem] bg-white border border-slate-200 p-6 sm:p-10 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)]">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-2xl font-[950] text-slate-900 tracking-tight">Acortador Rápido</h3>
        {successAlias && (
          <button 
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-brand-turquoise transition-colors"
          >
            <RefreshCcw size={14} />
            Reiniciar
          </button>
        )}
      </div>
      <p className="text-sm font-medium text-slate-500 mb-8">Genera links rastreables y seguros en milisegundos.</p>

      {!successAlias ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative flex items-center">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5">
              <Link className="h-4 w-4 text-slate-400" />
            </div>
            <input
              id="shortener-url"
              type="url"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="Pega tu enlace largo aquí..."
              className="h-16 w-full rounded-2xl bg-slate-50 border border-transparent pl-12 pr-4 text-base text-slate-900 outline-none transition-all focus:bg-white focus:border-brand-turquoise/30 focus:ring-4 focus:ring-brand-turquoise/5 placeholder:text-slate-400 font-medium"
              required
            />
          </div>

          <button 
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex w-fit items-center gap-2 px-1 text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors"
          >
            <Settings2 size={14} />
            {showAdvanced ? "Opciones avanzadas" : "Personalizar enlace"}
          </button>

          <AnimatePresence>
            {showAdvanced && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="relative flex items-center pt-1 pb-2">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5 pt-1">
                    <span className="text-sm font-bold text-slate-400 italic">@</span>
                  </div>
                  <input
                    id="shortener-alias"
                    type="text"
                    value={alias}
                    onChange={(event) => setAlias(event.target.value)}
                    placeholder="Alias personalizado (opcional)"
                    className="h-16 w-full rounded-2xl bg-slate-50 border border-transparent pl-12 pr-4 text-base text-slate-900 outline-none transition-all focus:bg-white focus:border-brand-turquoise/30 focus:ring-4 focus:ring-brand-turquoise/5 placeholder:text-slate-400 font-medium"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={loading}
            className="group relative flex h-16 w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-brand-turquoise px-8 text-base font-black text-white transition-all hover:opacity-95 active:scale-95 disabled:cursor-not-allowed disabled:opacity-70 shadow-lg shadow-brand-turquoise/20"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Procesando</span>
              </>
            ) : (
              <>
                <QrCode className="h-5 w-5 transition-transform group-hover:rotate-12" />
                <span>Acortar ahora</span>
              </>
            )}
          </button>
        </form>
      ) : (
        <div className="animate-in fade-in zoom-in duration-500">
          <div className="p-8 bg-emerald-50/50 border border-emerald-100 rounded-[2rem]">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">¡Link generado exitosamente!</p>
              <a 
                href={shortUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-emerald-600 hover:text-emerald-700 transition-colors flex items-center gap-1.5 text-xs font-black"
              >
                Probar enlace <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <div className="flex items-center gap-3">
              <input
                ref={resultInputRef}
                type="text"
                readOnly
                value={shortUrl}
                onClick={handleInputClick}
                className="flex-1 bg-white border border-emerald-100 outline-none text-sm font-black text-slate-900 px-5 py-4 rounded-xl shadow-sm cursor-pointer"
              />
              <button
                onClick={copyToClipboard}
                className="p-4 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20 active:scale-90 transition-transform"
              >
                {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
              </button>
            </div>
            
            <div className="mt-8 pt-8 border-t border-emerald-100 flex flex-col items-center">
              <p className="text-xs font-bold text-slate-400 mb-4 tracking-wide uppercase">¿Necesitas acortar algo más?</p>
              <button 
                onClick={handleReset}
                className="flex items-center gap-2 px-8 py-3.5 bg-white border border-slate-200 rounded-full text-sm font-black text-slate-700 hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
              >
                <RefreshCcw size={16} />
                Acortar otro enlace
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm animate-in fade-in slide-in-from-top-2 font-bold text-center">
          {error}
        </div>
      )}
    </div>
  );
}
