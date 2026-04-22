"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { authService } from "@/modules/auth/services/auth.service";

export function PublicNavbar() {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setIsLoggedIn(authService.isAuthenticated());
  }, []);

  if (pathname.startsWith("/dashboard")) {
    return null;
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/50 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-bold text-brand-turquoise">
          NavajaGT
        </Link>

        {!isMounted ? (
          <div className="h-10 w-32 animate-pulse rounded-full bg-slate-200" />
        ) : !isLoggedIn ? (
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-full px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Entrar
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-brand-turquoise px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Registro
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="rounded-full bg-brand-turquoise px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Ir a mi Panel
            </Link>
            <button
              type="button"
              onClick={() => {
                authService.logout();
                window.location.href = "/";
              }}
              className="rounded-full px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
