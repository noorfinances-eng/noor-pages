// pages/_app.js
import { useEffect } from "react";
import { useRouter } from "next/router";
import "../styles/globals.css";

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const pathsNoBeam = [
      "/legal", "/legal-en", "/legal-de",
      "/compliance", "/compliance-en", "/compliance-de",
      "/pay", "/merchant"
    ];
    const shouldDisableBeam =
      pathsNoBeam.includes(router.pathname) ||
      // sécurité: si tu crées des sous-routes plus tard (ex: /legal/fr)
      pathsNoBeam.some(p => router.pathname.startsWith(p + "/"));

    if (shouldDisableBeam) {
      document.body.classList.add("no-beam");
    } else {
      document.body.classList.remove("no-beam");
    }
    // nettoyage si on change de page
    return () => document.body.classList.remove("no-beam");
  }, [router.pathname]);

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
          Contact : <a href="mailto:noorfinances@gmail.com" className="underline hover:text-white">noorfinances@gmail.com</a>
          <span className="text-white/40"> (prochainement info@noortoken.com)</span>
        </p>
      </footer>
    </div>
  );
}
