// pages/_app.js
import "../styles/globals.css";

export default function MyApp({ Component, pageProps }) {
  return (
    <div className="min-h-screen bg-night text-white font-sans">
      <header className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-5 flex justify-between items-center">
          <h1 className="text-2xl font-semibold">
            NOOR <span className="text-gold">/ NUR</span>
          </h1>
          <nav className="flex gap-5 text-sm text-white/80">
            <a href="/">Home</a>
            <a href="/en">EN</a>
            <a href="/de">DE</a>
            <a href="/fr">FR</a>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10">
        <Component {...pageProps} />
      </main>

      {/* 🟡 Footer mis à jour avec email professionnel */}
      <footer className="mt-10 border-t border-white/10 py-6 text-center text-sm text-white/60">
        <div className="flex justify-center gap-6 mb-3">
          <a href="/legal" className="hover:text-yellow-300 transition-colors">
            Legal
          </a>
          <a href="/compliance" className="hover:text-yellow-300 transition-colors">
            Compliance
          </a>
          <a href="/merchant" className="hover:text-yellow-300 transition-colors">
            Merchant
          </a>
          <a href="/docs" className="hover:text-yellow-300 transition-colors">
            Docs
          </a>
        </div>
        <p>
          Contact:{" "}
          <a
            href="mailto:info@noortoken.com"
            className="text-yellow-300 hover:text-yellow-200 underline underline-offset-2"
          >
            info@noortoken.com
          </a>
        </p>
        <p className="mt-3 text-xs text-neutral-600">
          © 2025 NOOR Project — Proof of Light
        </p>
      </footer>
    </div>
  );
}
