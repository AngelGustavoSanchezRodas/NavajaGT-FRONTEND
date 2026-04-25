"use client";

import React, { useState, ChangeEvent } from 'react';
import { MetadataBiolink, EnlaceItem } from '@/types/biolink';
import { DEFAULT_BIOLINK_TEMPLATE } from '@/shared/constants/biolink-templates';
import { apiFetch } from '@/shared/lib/api';
import { Save, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const BiolinkBuilder: React.FC = () => {
  const [metadata, setMetadata] = useState<MetadataBiolink>(DEFAULT_BIOLINK_TEMPLATE);
  const [aliasPersonalizado, setAliasPersonalizado] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

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
    setIsSaving(true);
    setStatus(null);
    try {
      await apiFetch('/api/v1/core/enlaces', {
        method: 'POST',
        body: JSON.stringify({
          aliasPersonalizado: aliasPersonalizado || null,
          tipo: 'BIOLINK',
          metadata: metadata
        })
      });
      setStatus({ type: 'success', message: '¡Biolink guardado con éxito!' });
      setTimeout(() => setStatus(null), 5000);
    } catch (error: any) {
      setStatus({ type: 'error', message: error.message || 'Error al guardar el Biolink' });
    } finally {
      setIsSaving(false);
    }
  };

  const isDark = metadata.tema === 'DARK';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 max-w-7xl mx-auto min-h-screen bg-zinc-50/50">
      {/* Columna Izquierda: Formulario */}
      <section className="space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-zinc-200">
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
                  className="flex-1 px-4 py-2 border border-zinc-300 rounded-r-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  placeholder="mi-marca"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Título</label>
              <input
                type="text"
                name="titulo"
                value={metadata.titulo}
                onChange={handleProfileChange}
                className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
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
                className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                placeholder="Cuéntales sobre ti..."
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Avatar URL</label>
              <input
                type="text"
                name="avatarUrl"
                value={metadata.avatarUrl}
                onChange={handleProfileChange}
                className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Tema</label>
              <select
                name="tema"
                value={metadata.tema}
                onChange={handleProfileChange}
                className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all appearance-none bg-white"
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

        {status && (
          <div className={`p-4 rounded-xl flex items-center space-x-3 animate-in fade-in slide-in-from-top-2 ${
            status.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'
          }`}>
            {status.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span className="text-sm font-medium">{status.message}</span>
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full flex items-center justify-center space-x-2 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-indigo-200"
        >
          {isSaving ? (
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
      </section>

      {/* Columna Derecha: Preview */}
      <section className="flex items-start justify-center pt-10">
        <div className="sticky top-10">
          <div className="text-center mb-6">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-widest">
              Live Preview
            </span>
          </div>
          
          <div className="w-[320px] h-[640px] rounded-[3rem] border-8 border-slate-900 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.2)] bg-white relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-2xl z-20"></div>
            
            <div className={`h-full overflow-y-auto pt-12 pb-8 px-6 transition-colors duration-300 ${
              isDark ? 'bg-zinc-950 text-white' : 'bg-zinc-50 text-zinc-900'
            }`}>
              <div className="flex flex-col items-center text-center space-y-4">
                {metadata.avatarUrl && (
                  <img
                    src={metadata.avatarUrl}
                    alt="Preview Avatar"
                    className="w-20 h-20 rounded-full object-cover border-2 shadow-md"
                    style={{ borderColor: metadata.colorPrincipal }}
                  />
                )}
                <div className="space-y-1">
                  <h4 className="font-bold text-lg leading-tight">{metadata.titulo || 'Tu Título'}</h4>
                  <p className={`text-xs opacity-70 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                    {metadata.descripcion || 'Añade una descripción'}
                  </p>
                </div>
              </div>

              <div className="mt-8 space-y-3">
                {metadata.enlaces.map((link) => (
                  <div
                    key={link.id}
                    className={`w-full py-3 px-4 rounded-xl text-center text-xs font-semibold shadow-sm border transition-all ${
                      isDark 
                        ? 'bg-zinc-900 border-zinc-800 text-white' 
                        : 'bg-white border-zinc-200 text-zinc-900'
                    }`}
                    style={{ borderLeft: `4px solid ${metadata.colorPrincipal}` }}
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
    </div>
  );
};

export default BiolinkBuilder;
