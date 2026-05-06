"use client";

import React from 'react';
import { 
  X, 
  CheckCircle2, 
  TrendingUp, 
  Eye, 
  Zap, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { GlassCard } from './GlassCard';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/shared/lib/utils';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadUpsellModal: React.FC<Props> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg z-10"
          >
            <GlassCard className="p-8 sm:p-10 border-white/40 shadow-2xl overflow-hidden rounded-[2.5rem]">
              {/* Background Decoration */}
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-turquoise/10 blur-3xl" />
              <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-brand-magenta/5 blur-3xl" />
              
              <button 
                onClick={onClose}
                className="absolute right-6 top-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
              >
                <X size={20} />
              </button>

              <div className="relative z-10">
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-emerald-100 text-emerald-600 rounded-3xl shadow-inner">
                    <CheckCircle2 size={40} />
                  </div>
                </div>

                <div className="text-center space-y-3 mb-10">
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
                    ¡Tu QR está listo y descargado! 🚀
                  </h2>
                  <p className="text-slate-500 font-medium">
                    Has dado el primer paso, ahora dale superpoderes a tus enlaces.
                  </p>
                </div>

                <div className="space-y-5 mb-10">
                  <div className="flex items-start gap-4 p-4 bg-white/50 rounded-2xl border border-white/60">
                    <div className="mt-1 p-2 bg-brand-turquoise/10 text-brand-turquoise rounded-xl">
                      <TrendingUp size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Estadísticas de uso</h4>
                      <p className="text-xs text-slate-500">Regístrate para ver métricas detalladas en tiempo real.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-white/50 rounded-2xl border border-white/60">
                    <div className="mt-1 p-2 bg-brand-magenta/10 text-brand-magenta rounded-xl">
                      <Eye size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Rastreo de escaneos</h4>
                      <p className="text-xs text-slate-500">Mira cuántas personas y desde dónde escanean tu código.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-white/50 rounded-2xl border border-white/60">
                    <div className="mt-1 p-2 bg-brand-mustard/10 text-brand-mustard rounded-xl">
                      <Zap size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">QRs Dinámicos</h4>
                      <p className="text-xs text-slate-500">Cambia el destino de tu QR sin tener que imprimirlo de nuevo.</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button className="group w-full py-5 bg-slate-900 text-white rounded-[1.5rem] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl shadow-slate-900/10 active:scale-[0.98]">
                    Crear Cuenta Gratis
                    <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                  </button>
                  <button className="w-full py-5 bg-white text-brand-turquoise rounded-[1.5rem] font-black uppercase tracking-widest flex items-center justify-center gap-2 border-2 border-brand-turquoise/20 hover:bg-slate-50 transition-all active:scale-[0.98]">
                    <Sparkles size={20} />
                    Ver Planes Premium
                  </button>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
