export default function VerticalNameHero() {
  return (
    <section className="relative min-h-[100dvh] overflow-hidden bg-brand-blue bg-blue-soft text-white">
      <div className="bg-noise absolute inset-0" aria-hidden />

      {/* forme inclinate a destra (placeholder stile poster) */}
      <div
        aria-hidden
        className="absolute right-[-18%] top-[-8%] h-[130vh] w-[58vw] rotate-[-12deg] rounded-[3rem] bg-white/10"
      />
      <div
        aria-hidden
        className="absolute right-[5%] top-[10%] h-[70vh] w-[26vw] rotate-[-12deg] rounded-[2rem] bg-white/16"
      />

      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-[auto,1fr] gap-8 px-6 pt-24 md:pt-28">
        {/* Nome verticale gigante */}
        <div className="hidden md:flex items-end">
          <div className="vertical-rl text-[15rem] leading-none font-black tracking-tight">
            SERGIO
          </div>
        </div>

        {/* Testo principale + CTA */}
        <div className="flex min-h-[70vh] items-center">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.25em] text-white/60">
              Integration &amp; Full-Stack Developer
            </p>
            <h1 className="mt-3 text-4xl md:text-6xl font-bold leading-tight">
              Progetto API pulite e webapp performanti.
            </h1>
            <p className="mt-4 text-white/80 md:text-lg">
              WSO2 • Java/Node • Next.js. Integrazioni stabili, deployment snelli.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#contact"
                className="inline-flex items-center rounded-lg bg-brand-orange px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-black/20 transition hover:translate-y-[-1px] hover:shadow-lg"
              >
                Contattami
              </a>
              <a
                href="/projects"
                className="inline-flex items-center rounded-lg border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white/90 backdrop-blur transition hover:bg-white/10"
              >
                Progetti
              </a>
            </div>

            <div className="mt-6 flex flex-wrap gap-2 text-xs text-white/65">
              {["WSO2","SOAP↔REST","SFTP","Java","Node/Express","Next.js"].map(t => (
                <span key={t} className="rounded-full border border-white/15 px-2 py-1">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
