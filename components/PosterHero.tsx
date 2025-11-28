export default function PosterHero() {
  return (
    <section className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden">
      {/* sfondo tipografico */}
      <div aria-hidden className="bg-giant-text">
        {Array.from({ length: 9 }).map((_, i) => (
          <span key={i} className="select-none">COMBO</span>
        ))}
      </div>

      {/* contenuto centrale */}
      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <div className="inline-flex -rotate-6 items-center justify-center rounded-md bg-white px-3 py-1 text-2xl font-black text-brand-blue drop-shadow">
          #1
        </div>

        <h1 className="text-poster mt-4 text-5xl font-black tracking-tight text-brand-orange md:text-7xl">
          COLOR COMBO
        </h1>

        <p className="mt-4 text-lg text-white/85">
          Integration &amp; Full-Stack Developer — WSO2 • Java/Node • Next.js
        </p>

        {/* chip con HEX, come nel post */}
        <div className="mx-auto mt-6 flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded-full bg-brand-orange" />
            <span>Hex <code className="font-semibold">#e5532c</code></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded-full bg-brand-blue" />
            <span>Hex <code className="font-semibold">#1600cf</code></span>
          </div>
        </div>
      </div>
    </section>
  );
}
