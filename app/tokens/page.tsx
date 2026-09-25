const brand = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;
const neutral = [0, 25, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;

// Full class names so Tailwind can see them at build time.
const brandBg: Record<(typeof brand)[number], string> = {
  50: "bg-brand-50", 100: "bg-brand-100", 200: "bg-brand-200", 300: "bg-brand-300",
  400: "bg-brand-400", 500: "bg-brand-500", 600: "bg-brand-600", 700: "bg-brand-700",
  800: "bg-brand-800", 900: "bg-brand-900", 950: "bg-brand-950",
};
const neutralBg: Record<(typeof neutral)[number], string> = {
  0: "bg-neutral-0", 25: "bg-neutral-25", 50: "bg-neutral-50", 100: "bg-neutral-100",
  200: "bg-neutral-200", 300: "bg-neutral-300", 400: "bg-neutral-400", 500: "bg-neutral-500",
  600: "bg-neutral-600", 700: "bg-neutral-700", 800: "bg-neutral-800", 900: "bg-neutral-900",
  950: "bg-neutral-950",
};

function Scale<T extends number>({ title, steps, bg }: { title: string; steps: readonly T[]; bg: Record<T, string> }) {
  return (
    <section>
      <h2 className="mb-3 text-sm font-medium text-muted">{title}</h2>
      <ul className="grid grid-cols-4 gap-2 sm:grid-cols-7 lg:grid-cols-13">
        {steps.map((s) => (
          <li key={s}>
            <div className={`${bg[s]} h-16 rounded-lg border border-line`} />
            <p className="mt-1 text-xs text-muted">{s}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-10 px-4 py-16 sm:px-6">
      <header>
        <p className="text-sm text-muted">Luxe &amp; Allure Events · design tokens</p>
        <h1 className="mt-2 font-display text-5xl font-medium text-brand-900">Luxury events, engineered.</h1>
        <p className="mt-3 max-w-xl text-muted">
          Staging scaffold. Palette derived from the logo in OKLCH; page background is SaaS white.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="#" className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
            Build your event
          </a>
          <a href="#" className="rounded-full border border-line bg-surface px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-brand-300">
            Book a consultation
          </a>
        </div>
      </header>
      <Scale title="Brand (maroon, hue 24.9)" steps={brand} bg={brandBg} />
      <Scale title="Neutral (SaaS white → charcoal)" steps={neutral} bg={neutralBg} />
      <section className="rounded-2xl bg-ink p-8 text-ink-foreground">
        <h2 className="font-display text-3xl">Dark section</h2>
        <p className="mt-2 text-brand-200">Ink background for trust bars and footers.</p>
      </section>
    </main>
  );
}
