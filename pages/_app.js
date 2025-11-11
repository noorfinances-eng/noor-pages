// pages/_app.js
import "../styles/globals.css";

export default function MyApp({ Component, pageProps }) {
  return (
    <div className="min-h-screen bg-night text-white font-sans">
      <header className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-semibold">
            NOOR <span className="text-gold">/ NUR</span>
          </h1>

          <nav className="flex flex-wrap items-center gap-5 text-sm text-white/80">
            {/* Lang pages */}
            <a href="/">Home</a>
            <a href="/en">EN</a>
            <a href="/de">DE</a>
            <a href="/fr">FR</a>

            <span className="opacity-30">|</span>

            {/* Pay pages */}
            <a href="/pay" className="hover:text-gold">Pay (FR)</a>
            <a href="/pay-en" className="hover:text-gold">Pay (EN)</a>
            <a href="/pay-de" className="hover:text-gold">Pay (DE)</a>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10">
        <Component {...pageProps} />
      </main>

      <footer className="mt-10 border-t border-white/10 py-6 text-center text-sm text-white/60">
        © 2025 NOOR Project — Proof of Light
        <div className="mt-2 text-xs">
          Legal: <a href="/legal-fr" className="underline hover:text-gold">FR</a> · <a href="/legal-en" className="underline hover:text-gold">EN</a> · <a href="/legal-de" className="underline hover:text-gold">DE</a>
          <span className="mx-2">|</span>
          Compliance: <a href="/compliance-fr" className="underline hover:text-gold">FR</a> · <a href="/compliance-en" className="underline hover:text-gold">EN</a> · <a href="/compliance-de" className="underline hover:text-gold">DE</a>
          <span className="mx-2">|</span>
          Contact : <a href="mailto:noorfinances@gmail.com" className="underline hover:text-gold">noorfinances@gmail.com</a> (prochainement info@noortoken.com)
        </div>
      </footer>
    </div>
  );
}
