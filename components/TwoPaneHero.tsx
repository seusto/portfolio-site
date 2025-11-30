export default function TwoPaneHero() {
  return (
    <section
      className="
        min-h-[100dvh]
        bg-[url('/site_bckgrnd_webp.webp')]  /* percorso da /public */
        bg-cover bg-center bg-no-repeat
      "
    >
      {/* overlay per leggere meglio il testo (facoltativo) */}
      <div className="min-h-[100dvh] bg-black/20">
        <div className="mx-auto grid min-h-[100dvh] max-w-7xl grid-cols-1 md:grid-cols-2">
          <div className="flex items-center">
            <div className="w-full px-6 py-16 md:px-10 lg:px-14">
              <h1 className="text-4xl font-bold md:text-6xl lg:text-7xl orange-text">
                Seusto
              </h1>
              <p className="mt-4 text-white/90">Ora scelgo il sottotitolo…</p>
            </div>
          </div>
          <div className="min-h-[50vh] md:border-l" />
        </div>
      </div>
    </section>
  );
}
