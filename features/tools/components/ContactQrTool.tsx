"use client";

import React, { useState, useEffect } from 'react';
import { GlassCard } from '@/shared/components/ui/GlassCard';
import { 
  QrCode, 
  Link as LinkIcon, 
  Phone, 
  Mail, 
  ArrowRight, 
  Loader2, 
  Download, 
  MessageSquare,
  Palette,
  CheckCircle2,
  Upload,
  Lock,
  Grid3X3,
  Image as ImageIcon
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { toast } from 'sonner';
import Cookies from 'js-cookie';
import { useAuth } from '@/shared/contexts/AuthContext';
import { ProUpgradeModal } from '@/shared/components/ui/ProUpgradeModal';
import { DownloadUpsellModal } from '@/shared/components/ui/DownloadUpsellModal';

type QrType = 'LINK' | 'WHATSAPP' | 'TELEFONO' | 'EMAIL';

export const ContactQrTool: React.FC = () => {
  const { plan } = useAuth();
  const [type, setType] = useState<QrType>('LINK');
  const [formData, setFormData] = useState({
    url: '',
    whatsappPhone: '',
    whatsappMessage: '',
    tel: '',
    emailAddress: '',
    emailSubject: ''
  });
  
  const [foregroundColor, setForegroundColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isProModalOpen, setIsProModalOpen] = useState(false);
  const [isUpsellModalOpen, setIsUpsellModalOpen] = useState(false);
  const [selectedPattern, setSelectedPattern] = useState('squares');
  const [logo, setLogo] = useState<File | null>(null);

  const PRESET_COLORS = [
    '#000000', '#00E5FF', '#FF0055', '#FFD500', 
    '#6366F1', '#10B981', '#F59E0B', '#EF4444'
  ];

  const tipoMapa: Record<string, string> = {
    'LINK': 'URL',
    'TELEFONO': 'PHONE',
    'WHATSAPP': 'WHATSAPP',
    'EMAIL': 'EMAIL'
  };

  const formatHex = (hex: string) => {
    if (!hex.startsWith('#')) hex = '#' + hex;
    if (hex.length === 4) {
      return '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
    }
    return hex.padEnd(7, '0').slice(0, 7);
  };

  // Limpieza de URLs de objeto para evitar fugas de memoria
  useEffect(() => {
    return () => {
      if (qrUrl) URL.revokeObjectURL(qrUrl);
    };
  }, [qrUrl]);

  const handleProInterceptor = (e: React.MouseEvent | React.FocusEvent) => {
    // Solo informamos, no bloqueamos la generación en esta fase PLG
    if (plan === 'FREE') {
      // Opcional: mostrar un toast sutil o dejar que fluya hasta la descarga
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (plan === 'FREE') {
        setIsProModalOpen(true);
        return;
      }
      setLogo(file);
    }
  };

  const handleGenerateQr = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    if (qrUrl) {
      URL.revokeObjectURL(qrUrl);
      setQrUrl(null);
    }

    try {
      const tipoBackend = tipoMapa[type] || 'URL';
      let payloadData: Record<string, string> = {};
      
      switch (type) {
        case 'LINK':
          let sanitizedUrl = formData.url.trim();
          if (!/^https?:\/\//i.test(sanitizedUrl)) {
            sanitizedUrl = `https://${sanitizedUrl}`;
          }
          payloadData = { url: sanitizedUrl };
          break;
        case 'TELEFONO':
          payloadData = { numero: formData.tel };
          break;
        case 'WHATSAPP':
          payloadData = { 
            numero: formData.whatsappPhone, 
            mensaje: formData.whatsappMessage || '' 
          };
          break;
        case 'EMAIL':
          payloadData = { 
            correo: formData.emailAddress, 
            asunto: formData.emailSubject || '' 
          };
          break;
      }

      const requestBody = {
        tipo: tipoBackend,
        payload: payloadData,
        colorFondo: formatHex(backgroundColor),
        colorFrente: formatHex(foregroundColor)
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/tools/qr/generate`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get('token') || ''}`
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        if (response.status === 403) {
          setIsProModalOpen(true);
          return;
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error: ${response.status}`);
      }

      const blob = await response.blob();
      setQrUrl(URL.createObjectURL(blob));
      toast.success("¡Código QR generado con éxito!");
    } catch (error: any) {
      toast.error(error.message || "Error al generar el código QR");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!qrUrl) return;
    
    // 1. Ejecutar descarga normal
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = `NavajaGT_QR_${type}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // 2. Trigger de Conversión (Upsell)
    setTimeout(() => {
      setIsUpsellModalOpen(true);
    }, 500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <GlassCard className="p-8 max-w-2xl mx-auto rounded-[2.5rem] border-white/60 shadow-xl overflow-hidden relative">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-turquoise/5 blur-3xl" />
        
        <div className="relative z-10 flex items-center gap-4 mb-8">
          <div className="p-3 bg-brand-turquoise/10 text-brand-turquoise rounded-2xl shadow-inner">
            <QrCode className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Generador QR Dinámico</h2>
            <p className="text-sm text-slate-500 font-medium">Crea, personaliza y descarga QRs de alta calidad.</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="relative z-10 flex p-1.5 bg-slate-100 rounded-[1.5rem] mb-10 overflow-x-auto no-scrollbar">
          {(['LINK', 'WHATSAPP', 'TELEFONO', 'EMAIL'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => { setType(t); setQrUrl(null); }}
              className={cn(
                "flex-1 min-w-[100px] py-3.5 px-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300",
                type === t 
                  ? "bg-white text-brand-turquoise shadow-md scale-[1.02]" 
                  : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
              )}
            >
              {t === 'TELEFONO' ? 'TELÉFONO' : t}
            </button>
          ))}
        </div>

        <form onSubmit={handleGenerateQr} className="relative z-10 space-y-10">
          {/* Dynamic Form Fields */}
          <div className="space-y-6">
            {type === 'LINK' && (
              <div className="space-y-3 animate-in slide-in-from-left-2 duration-300">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Dirección URL Destino</label>
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-turquoise transition-colors"><LinkIcon size={20} /></div>
                  <input 
                    type="url" 
                    required 
                    value={formData.url} 
                    onChange={(e) => setFormData({...formData, url: e.target.value})} 
                    placeholder="https://tu-sitio.com" 
                    className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-transparent focus:border-brand-turquoise/20 focus:bg-white rounded-[1.5rem] outline-none transition-all text-slate-900 font-bold text-lg shadow-sm" 
                  />
                </div>
              </div>
            )}

            {type === 'WHATSAPP' && (
              <div className="space-y-6 animate-in slide-in-from-left-2 duration-300">
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Número de WhatsApp (con código)</label>
                  <div className="relative group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-turquoise transition-colors"><Phone size={20} /></div>
                    <input 
                      type="tel" 
                      required 
                      value={formData.whatsappPhone} 
                      onChange={(e) => setFormData({...formData, whatsappPhone: e.target.value})} 
                      placeholder="+34 600 000 000" 
                      className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-transparent focus:border-brand-turquoise/20 focus:bg-white rounded-[1.5rem] outline-none transition-all text-slate-900 font-bold text-lg shadow-sm" 
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Mensaje Predeterminado</label>
                  <div className="relative group">
                    <div className="absolute left-5 top-6 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-turquoise transition-colors"><MessageSquare size={20} /></div>
                    <textarea 
                      rows={4} 
                      value={formData.whatsappMessage} 
                      onChange={(e) => setFormData({...formData, whatsappMessage: e.target.value})} 
                      placeholder="Hola, me gustaría más información..." 
                      className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-transparent focus:border-brand-turquoise/20 focus:bg-white rounded-[1.5rem] outline-none transition-all text-slate-900 font-bold text-base shadow-sm resize-none" 
                    />
                  </div>
                </div>
              </div>
            )}

            {type === 'EMAIL' && (
              <div className="space-y-6 animate-in slide-in-from-left-2 duration-300">
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Correo Electrónico Destino</label>
                  <div className="relative group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-turquoise transition-colors"><Mail size={20} /></div>
                    <input 
                      type="email" 
                      required 
                      value={formData.emailAddress} 
                      onChange={(e) => setFormData({...formData, emailAddress: e.target.value})} 
                      placeholder="hola@empresa.com" 
                      className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-transparent focus:border-brand-turquoise/20 focus:bg-white rounded-[1.5rem] outline-none transition-all text-slate-900 font-bold text-lg shadow-sm" 
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Asunto del Correo</label>
                  <input 
                    type="text" 
                    value={formData.emailSubject} 
                    onChange={(e) => setFormData({...formData, emailSubject: e.target.value})} 
                    placeholder="Consulta desde NavajaGT" 
                    className="w-full px-6 py-5 bg-slate-50 border-2 border-transparent focus:border-brand-turquoise/20 focus:bg-white rounded-[1.5rem] outline-none transition-all text-slate-900 font-bold text-lg shadow-sm" 
                  />
                </div>
              </div>
            )}

            {type === 'TELEFONO' && (
              <div className="space-y-3 animate-in slide-in-from-left-2 duration-300">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Número de Teléfono</label>
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-turquoise transition-colors"><Phone size={20} /></div>
                  <input 
                    type="tel" 
                    required 
                    value={formData.tel} 
                    onChange={(e) => setFormData({...formData, tel: e.target.value})} 
                    placeholder="+34 600 000 000" 
                    className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-transparent focus:border-brand-turquoise/20 focus:bg-white rounded-[1.5rem] outline-none transition-all text-slate-900 font-bold text-lg shadow-sm" 
                  />
                </div>
              </div>
            )}
          </div>

          {/* Pro Personalization Redesigned */}
          <div className="pt-8 border-t border-slate-100 space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Palette className="text-brand-turquoise" size={20} />
                <h4 className="text-sm font-black uppercase tracking-wider text-slate-900">Personalización Pro</h4>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Color Selection */}
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Colores del QR</label>
                  <div className="flex flex-wrap gap-2">
                    {PRESET_COLORS.map(color => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setForegroundColor(color)}
                        className={cn(
                          "w-8 h-8 rounded-full border-2 transition-all",
                          foregroundColor === color ? "border-brand-turquoise scale-110 shadow-lg" : "border-transparent"
                        )}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                    <div className="relative w-8 h-8 rounded-full border-2 border-slate-200 overflow-hidden">
                      <input 
                        type="color" 
                        value={foregroundColor}
                        onChange={(e) => setForegroundColor(e.target.value)}
                        className="absolute inset-0 scale-150 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Fondo</label>
                  <div className="flex flex-wrap gap-2">
                    {['#FFFFFF', '#F8FAFC', '#F1F5F9', '#000000'].map(color => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setBackgroundColor(color)}
                        className={cn(
                          "w-8 h-8 rounded-full border-2 transition-all",
                          backgroundColor === color ? "border-brand-turquoise scale-110 shadow-lg" : "border-transparent"
                        )}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Pattern Selection */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
                  <Grid3X3 size={14} /> Patrón de Datos
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['squares', 'dots', 'rounded'].map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setSelectedPattern(p)}
                      className={cn(
                        "h-12 rounded-xl border-2 flex items-center justify-center transition-all",
                        selectedPattern === p ? "border-brand-turquoise bg-brand-turquoise/5 text-brand-turquoise" : "border-slate-100 text-slate-400 hover:border-slate-200"
                      )}
                    >
                      <span className="text-[10px] font-bold uppercase tracking-tighter">{p === 'squares' ? 'Cuadros' : p === 'dots' ? 'Puntos' : 'Smooth'}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Logo Dropzone */}
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
                <ImageIcon size={14} /> Logotipo al Centro
              </label>
              <div className="relative group">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className={cn(
                  "w-full py-8 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-2 transition-all",
                  plan === 'FREE' ? "border-slate-100 bg-slate-50/50" : "border-slate-200 group-hover:border-brand-turquoise/50 group-hover:bg-brand-turquoise/5"
                )}>
                  {logo ? (
                    <div className="flex items-center gap-3 bg-white p-2 rounded-xl shadow-sm">
                      <div className="w-10 h-10 bg-slate-100 rounded-lg overflow-hidden">
                        <img src={URL.createObjectURL(logo)} alt="Logo preview" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-xs font-bold text-slate-700">{logo.name}</span>
                    </div>
                  ) : (
                    <>
                      <div className="relative">
                        <Upload className="w-6 h-6 text-slate-400" />
                        {plan === 'FREE' && (
                          <div className="absolute -top-1 -right-1 bg-brand-mustard text-white p-0.5 rounded-full ring-2 ring-white">
                            <Lock size={8} />
                          </div>
                        )}
                      </div>
                      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Suelta tu imagen o haz clic</p>
                      {plan === 'FREE' && <p className="text-[9px] font-medium text-brand-mustard uppercase tracking-tighter">Función Premium</p>}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group w-full py-5 bg-slate-900 text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl shadow-slate-900/10 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={24} /> : "Generar QR"}
            {!loading && <ArrowRight className="group-hover:translate-x-1 transition-transform" size={24} />}
          </button>
        </form>

        {qrUrl && (
          <div className="mt-16 flex flex-col items-center animate-in fade-in zoom-in-95 duration-1000">
            <div className="group relative overflow-hidden rounded-[2rem] border-4 border-white shadow-2xl mb-10">
              <img src={qrUrl} alt="QR Code Result" className="w-64 h-64 object-contain" />
              
              {/* Overlay de Hover */}
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                <button 
                  onClick={handleDownload}
                  className="flex items-center gap-2 bg-brand-turquoise text-white px-6 py-3 rounded-full font-bold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 hover:scale-105"
                >
                  <Download className="w-5 h-5" />
                  Descargar QR
                </button>
              </div>
            </div>
            
            <div className="flex flex-col items-center gap-4 w-full">
              <p className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-emerald-600">
                <CheckCircle2 size={16} /> ¡QR Generado con éxito!
              </p>
            </div>
          </div>
        )}
      </GlassCard>

      <ProUpgradeModal 
        isOpen={isProModalOpen} 
        onClose={() => setIsProModalOpen(false)} 
        message="Esta función avanzada requiere una cuenta Premium para ser procesada en el resultado final." 
      />

      <DownloadUpsellModal 
        isOpen={isUpsellModalOpen}
        onClose={() => setIsUpsellModalOpen(false)}
      />
    </div>
  );
};
