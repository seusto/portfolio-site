export default function WatercolorHero() {
  return (
    <section className="jpn-ink-wash relative flex min-h-[100dvh] items-center justify-center">
      {/* testo centrale opzionale */}
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-6xl">
          Benvenuto nel mio portfolio
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-balance text-lg text-gray-700">
          Integration &amp; Full-Stack Developer — WSO2, Java/Node, Next.js.
        </p>
      </div>
      {/* bordo carta */}
      <div className="pointer-events-none absolute inset-0 rounded-[2rem] ring-1 ring-black/10 md:m-6" />
    </section>
  );
}
