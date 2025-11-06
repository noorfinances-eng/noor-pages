import Head from "next/head";
import "../styles/globals.css";

export default function MyApp({ Component, pageProps }) {
  return (
    <div className="min-h-screen bg-night text-white font-sans">
      {/* META GLOBALE */}
      <Head>
        <title>NOOR — Proof of Light</title>
        <meta
          name="description"
          content="NOOR (NUR) — Swiss ethical token built on BNB Smart Chain. Proof of Light: transparency, ethics and clarity in crypto."
        />
        <link rel="icon" href="/favicon.svg" />
        <meta name="theme-color" content="#0A0A0A" />
      </Head>

      {/* HEADER */}
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

      {/* CONTENU PRINCIPAL */}
      <main className="max-w-6xl mx-auto px-4 py-10">
        <Component {...pageProps} />
      </main>

      {/* FOOTER */}
      <footer className="mt-10 border-t border-white/10 py-6 text-center text-sm text-white/60">
        © 2025 NOOR Project — Proof of Light<br />
        <span className="text-white/40">noorfinances@gmail.com</span><br />
        <span className="text-white/40">
          Swiss non-custodial token — no fiat — no promised returns.
        </span>
      </footer>
    </div>
  );
}
