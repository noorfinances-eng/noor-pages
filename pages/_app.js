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

        {/* Favicon */}
        <link rel="icon" href="/favicon.svg?v=1" type="image/svg+xml" />
        <link rel="alternate icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="mask-icon" href="/favicon.svg?v=1" color="#D4AF37" />
        <meta name="theme-color" content="#0A0A0A" />

        {/* Open Graph (partage) */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="NOOR — Proof of Light" />
        <meta
          property="og:description"
          content="Swiss transparent token for ethical payments — Utility + Payment on BNB Smart Chain. Non-custodial, no fiat."
        />
        <meta property="og:image" content="/og-noor.svg?v=1" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="NOOR — Proof of Light" />
        <meta
          name="twitter:description"
          content="Swiss ethical Utility + Payment token. Transparency first."
        />
        <meta name="twitter:image" content="/og-noor.svg?v=1" />
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

      {/* CONTENU */}
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
