// pages/_app.js
import { useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import "../styles/globals.css";

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    // Pages où l’on NE veut PAS d’halos ni de faisceaux
    const noBeamPaths = [
      "/legal", "/legal-en", "/legal-de",
      "/compliance", "/compliance-en", "/compliance-de",
      "/pay", "/merchant"
    ];

    const pathname = router.pathname;

    const shouldDisableBeams =
      noBeamPaths.includes(pathname) ||
      noBeamPaths.some(p => pathname === p || pathname.startsWith(p + "/"));

    if (shouldDisableBeams) {
      document.body.classList.add("no-beam");
    } else {
      document.body.classList.remove("no-beam");
    }

    return () => {
      document.body.classList.remove("no-beam");
    };
  }, [router.pathname]);

  return (
    <>
      <Head>
        <title>NOOR / NUR — Proof of Light</title>
        <meta
          name="description"
          content="NOOR (NUR) — Swiss Utility + Payment Token on BNB Smart Chain. Proof of Light: transparency, trust, participation."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-night text-white font-sans">
        {/* HEADER */}
        <header className="border-b border-white/10">
          <div className="max-w-6xl mx-auto px-4 py-5 flex justify-between items-center">
            <h1 className="text-2xl font-semibold tracking-wide">
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

        {/* MAIN */}
        <main className="max-w-6xl mx-auto px-4 py-10">
          <Component {...pageProps} />
        </main>

        {/* FOOTER */}
        <footer className="mt-10 border-t border-white/10 py-6 text-center text-sm text-white/60 space-y-2">
          <p>© 2025 NOOR Project — Proof of Light</p>

          <div className="flex justify-center gap-4">
            <span className="text-white/50">Legal:</span>
            <a href="/legal" className="underline hover:text-white">FR</a>
            <a href="/legal-en" className="underline hover:text-white">EN</a>
            <a href="/legal-de" className="underline hover:text-white">DE</a>
          </div>

          <div className="flex justify-center gap-4">
            <span className="text-white/50">Compliance:</span>
            <a href="/compliance" className="underline hover:text-white">FR</a>
            <a href="/compliance-en" className="underline hover:text-white">EN</a>
            <a href="/compliance-de" className="underline hover:text-white">DE</a>
          </div>

          <p>
            Contact :
            <a href="mailto:noorfinances@gmail.com" className="underline hover:text-white ml-1">
              noorfinances@gmail.com
            </a>
            <span className="text-white/40"> (prochainement info@noortoken.com)</span>
          </p>
        </footer>
      </div>
    </>
  );
}
