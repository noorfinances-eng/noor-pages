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
            <a href="/pay">Pay</a>
            <a href="/merchant">Merchant</a>
          </nav>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-10">
        <Component {...pageProps} />
      </main>
      <footer className="mt-10 border-t border-white/10 py-6 text-center text-sm text-white/60 space-y-1">
  <p>© 2025 NOOR Project — Proof of Light</p>
  <div className="flex justify-center gap-4 text-white/60 text-sm">
    <a href="/legal" className="underline hover:text-white transition">FR</a>
    <a href="/legal-en" className="underline hover:text-white transition">EN</a>
    <a href="/legal-de" className="underline hover:text-white transition">DE</a>
  </div>
  <p>
    Contact : <a href="mailto:noorfinances@gmail.com" className="underline hover:text-white">noorfinances@gmail.com</a> 
    <span className="text-white/40"> (prochainement info@noortoken.com)</span>
  </p>
</footer>
    </div>
  );
}
