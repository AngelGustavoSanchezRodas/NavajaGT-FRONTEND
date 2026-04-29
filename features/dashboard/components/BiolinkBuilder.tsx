"use client";

import React, { useState, ChangeEvent } from 'react';
import { MetadataBiolink, EnlaceItem, BiolinkFlatData } from '@/types/biolink';
import { DEFAULT_BIOLINK_TEMPLATE } from '@/shared/constants/biolink-templates';
import { apiFetch } from '@/shared/lib/api';
import Image from 'next/image';
import { Save, Loader2, CheckCircle, AlertCircle, Copy, Check, ExternalLink, Eye, Smartphone, X } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/shared/contexts/AuthContext';
import { ProUpgradeModal } from '@/shared/components/ui/ProUpgradeModal';
import { useCopyToClipboard } from '@/shared/hooks/useCopyToClipboard';
import { cn } from "@/shared/lib/utils";

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

const BiolinkBuilder: React.FC = () => {
  const [metadata, setMetadata] = useState<BiolinkFlatData>(DEFAULT_BIOLINK_TEMPLATE);
  const [aliasPersonalizado, setAliasPersonalizado] = useState('');
  const [view, setView] = useState<'editing' | 'saving' | 'success' | 'upgrade'>('editing');
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);
  const [aliasError, setAliasError] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [modalMessage, setModalMessage] = useState<string | undefined>();
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const { copy, copied } = useCopyToClipboard();
  
  const { plan } = useAuth();
  
  const debouncedMetadata = useDebounce(metadata, 300);

  const handleProfileChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setMetadata((prev) => ({ ...prev, [name]: value }));
  };

  const handleLinkChange = (index: number, field: keyof EnlaceItem, value: string | boolean) => {
    const newEnlaces = [...metadata.enlaces];
    newEnlaces[index] = { ...newEnlaces[index], [field]: value };
    setMetadata((prev) => ({ ...prev, enlaces: newEnlaces }));
  };

  const addLink = () => {
    const newLink: EnlaceItem = {
      id: Math.random().toString(36).substr(2, 9),
      titulo: '',
      url: '',
      activo: true,
    };
    setMetadata((prev) => ({ ...prev, enlaces: [...prev.enlaces, newLink] }));
  };

  const removeLink = (index: number) => {
    setMetadata((prev) => ({
      ...prev,
      enlaces: prev.enlaces.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    setView('saving');
    setGlobalError(null);
    setAliasError(false);

    const payloadMetadata = {
      perfil: {
        titulo: metadata.titulo,
        descripcion: metadata.descripcion,
        avatarUrl: metadata.avatarUrl,
        tema: metadata.tema,
        colorPrincipal: metadata.colorPrincipal
      },
      enlaces: metadata.enlaces,
      redesSociales: metadata.redesSociales
    };

    try {
      const respuesta = await apiFetch<{ alias: string }>('/api/core/links/create/', {
        method: 'POST',
        body: JSON.stringify({
          aliasPersonalizado: aliasPersonalizado || null,
          tipo: 'BIOLINK',
          metadata: payloadMetadata
        })
      });
      setPublishedUrl(respuesta.alias || aliasPersonalizado);
      setView('success');
      toast.success("¡Tu Biolink se ha guardado correctamente!");
    } catch (error: unknown) {
      const apiError = error as { status?: number; message?: string };
      if (apiError.status === 402 || apiError.status === 403) {
        setModalMessage(apiError.message || "Tu plan actual no permite realizar esta acción");
        setView('upgrade');
      } else if (apiError.status === 409) {
        setAliasError(true);
        setView('editing');
      } else if (apiError.status === 400) {
        setGlobalError(apiError.message || 'Datos incorrectos');
        setView('editing');
        toast.error(apiError.message || 'Datos incorrectos al guardar el Biolink');
      } else {
        setGlobalError(apiError.message || 'Error al guardar el Biolink');
        setView('editing');
        toast.error(apiError.message || 'No se pudo guardar el Biolink');
      }
    }
  };

  const handleCopy = () => {
    if (publishedUrl) {
      const url = `${window.location.origin}/bio/${publishedUrl}`;
      copy(url);
    }
  };

  const isDarkPreview = debouncedMetadata.tema === 'DARK';

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-8 p-4 sm:p-6 max-w-7xl mx-auto min-h-screen bg-zinc-50/50">
      {/* Columna Izquierda: Formulario o Éxito */}
      <section className="space-y-8">
        {view === 'success' && publishedUrl ? (
          <div className="bg-emerald-50/80 p-10 rounded-[2.5rem] shadow-sm border border-emerald-100 flex flex-col items-center justify-center text-center space-y-6 h-full min-h-[400px]">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-10 h-10 text-emerald-600" />
            </div>
            <h2 className="text-3xl font-black text-emerald-900 tracking-tight">¡Tu Biolink está en vivo!</h2>
            <p className="text-emerald-700 font-medium">Copia tu enlace y compártelo con el mundo.</p>
            
            <div className="w-full max-w-md bg-white p-2 rounded-2xl flex flex-col sm:flex-row items-stretch sm:items-center shadow-sm border border-emerald-100 gap-2 sm:gap-0">
              <input
                type="text"
                readOnly
                value={typeof window !== 'undefined' ? `${window.location.origin}/bio/${publishedUrl}` : ''}
                className="flex-1 bg-transparent border-none outline-none text-sm font-black text-slate-900 px-4 py-2 cursor-text"
                onClick={(e) => (e.target as HTMLInputElement).select()}
              />
              <button
                onClick={handleCopy}
                className="flex items-center justify-center gap-2 px-6 py-3 sm:rounded-l-none bg-emerald-600 text-white rounded-xl sm:rounded-r-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20 active:scale-95 font-bold text-sm min-w-[120px]"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copiado' : 'Copiar Enlace'}
              </button>
            </div>
            
            <div className="flex items-center gap-4 mt-6">
              <a
                href={`/bio/${publishedUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-bold bg-white text-emerald-700 border border-emerald-200 px-5 py-2.5 rounded-xl hover:bg-emerald-50 transition-colors shadow-sm"
              >
                <ExternalLink className="w-4 h-4" />
                Ver en vivo
              </a>
              <button
                onClick={() => {
                  setPublishedUrl(null);
                  setView('editing');
                }}
                className="text-sm font-bold text-emerald-600 hover:text-emerald-800 underline underline-offset-4"
              >
                Editar de nuevo
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-zinc-200">
            <header className="border-b border-zinc-100 pb-4">
              <h2 className="text-xl font-bold text-zinc-900">Configuración del Perfil</h2>
              <p className="text-sm text-zinc-500">Personaliza la apariencia y contenido de tu Biolink</p>
            </header>

            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Alias Personalizado</label>
                  <div className="flex items-center">
                    <span className="bg-zinc-100 border border-r-0 border-zinc-300 px-3 py-2 rounded-l-lg text-zinc-500 text-sm">navaja.gt/</span>
                    <input
                      type="text"
                      value={aliasPersonalizado}
                      onChange={(e) => setAliasPersonalizado(e.target.value)}
                      className={`flex-1 px-4 py-3 border ${aliasError ? 'border-red-500' : 'border-zinc-300'} rounded-r-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-base`}
                      placeholder="mi-marca"
                    />
                  </div>
                  {aliasError && <p className="text-xs text-red-500 font-semibold mt-1">Este alias ya está en uso. Intenta con otro.</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Título</label>
                  <input
                    type="text"
                    name="titulo"
                    value={metadata.titulo}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-3 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-base"
                    placeholder="Ej. Juan Pérez"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Descripción</label>
                  <textarea
                    name="descripcion"
                    value={metadata.descripcion}
                    onChange={handleProfileChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-base"
                    placeholder="Cuéntales sobre ti..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Avatar URL</label>
                  <input
                    type="text"
                    name="avatarUrl"
                    value={metadata.avatarUrl}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-3 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-base"
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Tema</label>
                  <select
                    name="tema"
                    value={metadata.tema}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-3 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all appearance-none bg-white text-base"
                  >
                    <option value="LIGHT">Claro</option>
                    <option value="DARK">Oscuro</option>
                  </select>
                </div>
              </div>
            </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
            <h3 className="font-bold text-zinc-900">Enlaces</h3>
            <button
              onClick={addLink}
              className="px-4 py-2 bg-zinc-100 text-zinc-700 rounded-lg text-sm font-semibold hover:bg-zinc-200 transition-colors"
            >
              + Agregar Enlace
            </button>
          </div>

          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {metadata.enlaces.map((link, index) => (
              <div key={link.id} className="p-4 bg-zinc-50 rounded-xl border border-zinc-200 space-y-3 relative group">
                <button
                  onClick={() => removeLink(index)}
                  className="absolute top-2 right-2 text-zinc-400 hover:text-red-500 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={link.titulo}
                    onChange={(e) => handleLinkChange(index, 'titulo', e.target.value)}
                    className="w-full px-3 py-1.5 border border-zinc-300 rounded text-sm outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="Título del enlace"
                  />
                  <input
                    type="text"
                    value={link.url}
                    onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                    className="w-full px-3 py-1.5 border border-zinc-300 rounded text-sm outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="https://..."
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

            {globalError && (
              <div className="p-4 rounded-xl flex items-center space-x-3 animate-in fade-in slide-in-from-top-2 bg-red-50 text-red-700 border border-red-200 shadow-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-bold">{globalError}</span>
              </div>
            )}

            <button
              onClick={handleSave}
              disabled={view === 'saving'}
              className="w-full flex items-center justify-center space-x-2 py-4 bg-brand-turquoise text-white rounded-xl font-bold hover:opacity-90 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-brand-turquoise/20"
            >
              {view === 'saving' ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Guardar Biolink</span>
                </>
              )}
            </button>
          </div>
        )}
      </section>

      {/* Columna Derecha: Preview */}
      <section className={cn(
        "lg:flex flex-col items-center justify-start pt-10",
        showMobilePreview ? "flex fixed inset-0 z-50 bg-white lg:relative lg:bg-transparent lg:z-auto" : "hidden"
      )}>
        <button 
          onClick={() => setShowMobilePreview(false)}
          className="lg:hidden absolute top-4 right-4 p-2 bg-slate-100 rounded-full text-slate-600 shadow-lg active:scale-95 transition-transform"
        >
          <X size={24} />
        </button>
        
        <div className="sticky top-10 flex flex-col items-center">
          <div className="text-center mb-6 hidden lg:block">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-brand-turquoise/10 text-brand-turquoise text-xs font-bold uppercase tracking-widest">
              Live Preview
            </span>
          </div>
          
          <div className="w-[320px] h-[640px] rounded-[3rem] border-8 border-slate-900 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.2)] bg-white relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-2xl z-20"></div>
            
            <div className={`h-full overflow-y-auto pt-12 pb-8 px-6 transition-colors duration-300 ${
              isDarkPreview ? 'bg-zinc-950 text-white' : 'bg-zinc-50 text-zinc-900'
            }`}>
              <div className="flex flex-col items-center text-center space-y-4">
                {debouncedMetadata.avatarUrl && (
                  <Image
                    src={debouncedMetadata.avatarUrl}
                    alt="Preview Avatar"
                    width={80}
                    height={80}
                    className="rounded-full object-cover border-2 shadow-md"
                    style={{ borderColor: debouncedMetadata.colorPrincipal }}
                    unoptimized
                  />
                )}
                <div className="space-y-1">
                  <h4 className="font-bold text-lg leading-tight">{debouncedMetadata.titulo || 'Tu Título'}</h4>
                  <p className={`text-xs opacity-70 ${isDarkPreview ? 'text-zinc-400' : 'text-zinc-600'}`}>
                    {debouncedMetadata.descripcion || 'Añade una descripción'}
                  </p>
                </div>
              </div>

              <div className="mt-8 space-y-3">
                {debouncedMetadata.enlaces.map((link) => (
                  <div
                    key={link.id}
                    className={`w-full py-3 px-4 rounded-xl text-center text-xs font-semibold shadow-sm border transition-all ${
                      isDarkPreview 
                        ? 'bg-zinc-900 border-zinc-800 text-white' 
                        : 'bg-white border-zinc-200 text-zinc-900'
                    }`}
                    style={{ borderLeft: `4px solid ${debouncedMetadata.colorPrincipal}` }}
                  >
                    {link.titulo || 'Enlace sin título'}
                  </div>
                ))}
              </div>

              <footer className="mt-10 text-center opacity-30 text-[10px] font-bold uppercase tracking-tighter">
                NavajaGT Biolink
              </footer>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Action Button for Mobile Preview */}
      <button
        onClick={() => setShowMobilePreview(true)}
        className="lg:hidden fixed bottom-6 right-6 flex items-center gap-2 bg-brand-turquoise text-white px-6 py-3 rounded-full font-black shadow-2xl shadow-brand-turquoise/40 z-40 animate-bounce"
      >
        <Smartphone size={20} />
        Ver Preview
      </button>

      <ProUpgradeModal 
        isOpen={view === 'upgrade'} 
        onClose={() => setView('editing')} 
        message={modalMessage} 
      />
    </div>
  );
};

export default BiolinkBuilder;
