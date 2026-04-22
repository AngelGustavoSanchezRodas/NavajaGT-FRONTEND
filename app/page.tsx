import { BackgroundGlow } from "@/shared/components/ui/BackgroundGlow";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden px-4">
      <BackgroundGlow color="turquoise" className="-left-24 -top-20 h-80 w-80" />
      <BackgroundGlow color="magenta" className="-right-24 top-1/3 h-96 w-96" />
      <BackgroundGlow color="mustard" className="-left-20 bottom-0 h-72 w-72" />

      <section className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center pt-32 text-center">
        <h1 className="text-5xl font-semibold text-slate-900">
          Crea, comparte y gestiona enlaces con una experiencia más limpia.
        </h1>
        <p className="mt-6 text-slate-600">
          Pega tu URL y genera al instante un enlace corto y código QR. Sin
          registros obligatorios.
        </p>
        <div id="tool-container" className="mt-12 w-full"></div>
      </section>
    </main>
  );
}
