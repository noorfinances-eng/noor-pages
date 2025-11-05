export default function Home() {
  return (
    <div className="text-center">
      <h2 className="text-3xl font-semibold mb-4">NOOR — baseline OK</h2>
      <p className="text-white/70 mb-6">
        Si tu vois cette page, le déploiement fonctionne.  
        Accède à ta langue :
      </p>
      <div className="flex justify-center gap-4">
        <a href="/en" className="px-4 py-2 rounded-lg border border-gold text-gold hover:bg-gold hover:text-black">EN</a>
        <a href="/de" className="px-4 py-2 rounded-lg border border-gold text-gold hover:bg-gold hover:text-black">DE</a>
        <a href="/fr" className="px-4 py-2 rounded-lg border border-gold text-gold hover:bg-gold hover:text-black">FR</a>
      </div>
    </div>
  );
}
