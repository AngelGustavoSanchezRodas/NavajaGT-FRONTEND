"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, LayoutDashboard, Settings, LogOut, ChevronDown, Sparkles } from "lucide-react";
import { siteConfig } from "@/shared/config/site";
import { cn } from "@/shared/lib/utils";
import { useAuth } from "@/shared/contexts/AuthContext";

export function PublicNavbar() {
  const pathname = usePathname();
  const { isAuthenticated, logout } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Cerrar dropdown al cambiar de ruta
  useEffect(() => {
    setIsDropdownOpen(false);
  }, [pathname]);

  if (pathname.startsWith("/dashboard")) {
    return null;
  }

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  const dropdownItems = [
    { label: "Mi Workspace", icon: LayoutDashboard, href: "/dashboard" },
    { label: "Configuración", icon: Settings, href: "/dashboard/settings" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/40 bg-white/80 backdrop-blur-md transition-all duration-300">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-black text-xl tracking-tight text-slate-900 hover:opacity-80 transition-opacity">
          NavajaGT
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          <AnimatePresence mode="wait">
            {isMounted && isAuthenticated ? (
              <motion.div 
                key="auth-ui"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3"
              >
                <Link 
                  href="/dashboard"
                  className="hidden sm:flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-slate-800 hover:shadow-xl hover:shadow-slate-200 active:scale-95"
                >
                  <LayoutDashboard size={18} />
                  <span>Ir a mi Workspace</span>
                </Link>

                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={cn(
                      "group flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all active:scale-95 overflow-hidden",
                      isDropdownOpen 
                        ? "border-brand-turquoise ring-4 ring-brand-turquoise/10" 
                        : "border-slate-100 hover:border-brand-turquoise/30 hover:bg-slate-50"
                    )}
                  >
                    <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-600 transition-colors group-hover:text-brand-turquoise">
                      <User size={20} />
                    </div>
                  </button>

                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 12, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 12, scale: 0.95 }}
                        className="absolute right-0 mt-3 w-64 overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-2 shadow-2xl ring-1 ring-black/5"
                      >
                        <div className="px-4 py-3 mb-2 border-b border-slate-50">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Panel de Usuario</p>
                        </div>
                        
                        {dropdownItems.map((item) => (
                          <Link
                            key={item.label}
                            href={item.href}
                            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-600 transition-all hover:bg-slate-50 hover:text-brand-turquoise"
                          >
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-400 transition-colors group-hover:bg-brand-turquoise/10 group-hover:text-brand-turquoise">
                              <item.icon size={18} />
                            </div>
                            {item.label}
                          </Link>
                        ))}
                        
                        <div className="my-2 border-t border-slate-100" />
                        
                        <button
                          onClick={handleLogout}
                          className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-red-500 transition-all hover:bg-red-50"
                        >
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-400 transition-colors group-hover:bg-red-100 group-hover:text-red-600">
                            <LogOut size={18} />
                          </div>
                          Cerrar Sesión
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ) : (
              <motion.nav
                key="guest-ui"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-3"
                aria-label="Navegación principal"
              >
                <Link
                  href="/login"
                  className="rounded-full px-5 py-2.5 text-sm font-bold text-slate-600 transition-all hover:bg-slate-50 hover:text-brand-turquoise active:scale-95"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  href="/register"
                  className="group relative flex items-center gap-2 overflow-hidden rounded-full bg-brand-turquoise px-6 py-2.5 text-sm font-bold text-white transition-all hover:shadow-[0_8px_30px_rgb(45,212,191,0.3)] hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
                >
                  <span className="relative z-10">Registrarse gratis</span>
                </Link>
              </motion.nav>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
