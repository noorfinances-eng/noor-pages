// pages/fr.js
export default function FR() {
  const CONTRACT = "0xA20212290866C8A804a89218c8572F28C507b401";
  const STAKING  = "0x4eBAbfb635A865EEA2a5304E1444B125aE223f70"; // V3

  return (
    <div className="space-y-16">
      {/* HERO */}
      <section className="relative text-center py-18 md:py-24 fade-in">
        <div className="relative z-10 max-w-5xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-semibold">NOOR — La lumière de la transparence</h2>
          <p className="mt-4 text-white/70 max-w-2xl mx-auto">
            Jeton utilitaire et de paiement suisse sur BNB Smart Chain. Pas de garde. Pas de rendement promis.
            Seulement la clarté, la participation et le Proof of Light.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <a className="btn-gold" href={`https://bscscan.com/address/${CONTRACT}`} target="_blank" rel="noreferrer">
              Voir le contrat (BscScan)
            </a>
            <a className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10 transition"
               href={`https://bscscan.com/address/${STAKING}`} target="_blank" rel="noreferrer">
              Accéder au Staking V3
            </a>
            <p className="basis-full text-xs text-white/40 mt-2">
              Legacy V2 → 0x6CB5CBEc7F0c5870781eA467244Ed31e2Ea3c702
            </p>
          </div>
        </div>
      </section>

      {/* PROOF OF LIGHT */}
      <section id="concept" className="border-t border-white/10 pt-12">
        <div className="max-w-5xl mx-auto px-4">
          <div className="card text-center">
            <h3 className="text-2xl md:text-3xl font-semibold">Proof of Light</h3>
            <p className="mt-3 text-white/75">
              Contrairement au minage classique, NOOR récompense la transparence et les actions positives :
              éducation, documentation ouverte, adoption marchande et missions communautaires.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <a href="#tokenomics" className="btn-gold">Tokenomics</a>
              <a href="#roadmap" className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10 transition">Feuille de route</a>
              <a href="/docs/NOOR_Legal_Light_2025_FINAL.pdf" target="_blank" rel="noreferrer"
                 className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10 transition">📄 Legal Light (PDF)</a>
            </div>
          </div>
        </div>
      </section>

      {/* TOKENOMICS */}
      <section id="tokenomics" className="border-t border-white/10 pt-12">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-2xl md:text-3xl font-semibold text-center">Tokenomics</h3>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Info label="Réseau" value="BNB Smart Chain (56)" />
            <Info label="Standard" value="BEP-20 (compatible ERC-20)" />
            <Info label="Symbole" value="NUR" />
            <Info label="Quantité totale" value="299 792 458 NUR (fixe)" />
            <InfoLink label="Contrat" value={CONTRACT} href={`https://bscscan.com/address/${CONTRACT}`} />
            <InfoLink label="Staking V3" value={STAKING} href={`https://bscscan.com/address/${STAKING}`} />
          </div>
        </div>
      </section>

      {/* ROADMAP */}
      <section id="roadmap" className="border-t border-white/10 pt-12">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-2xl md:text-3xl font-semibold text-center">Feuille de route</h3>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="card">
              <h4 className="text-xl font-semibold">Fait ✅</h4>
              <ul className="mt-3 space-y-2 text-white/80">
                <li>• Token V2 déployé (BSC, supply fixe)</li>
                <li>• Staking V3 en ligne & vérifié (10 % / 30 jours)</li>
                <li>• Site multilingue (FR/EN/DE)</li>
                <li>• Legal Light PDF (FR/EN) publié</li>
                <li>• Pages Légal & Conformité</li>
                <li>• /pay QR (EIP-681) fonctionnel</li>
              </ul>
            </div>
            <div className="card">
              <h4 className="text-xl font-semibold">À venir 🔜</h4>
              <ul className="mt-3 space-y-2 text-white/80">
                <li>• Finition Merchant (UX WalletConnect)</li>
                <li>• Liquidité initiale PancakeSwap (NUR/BNB)</li>
                <li>• Lock LP (6–12 mois) pour la confiance</li>
                <li>• Visuels BscScan (logo/desc)</li>
                <li>• Communications</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* DOCS */}
      <section id="docs" className="border-t border-white/10 pt-12">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h3 className="text-2xl md:text-3xl font-semibold">Docs & Outils</h3>
          <div className="mt-4 flex flex-wrap gap-3 justify-center">
            <a className="btn-gold" href="/pay">Payer avec NOOR</a>
            <a className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10" href="/merchant">Merchant Kit</a>
            <a className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10" href="/compliance">Conformité</a>
            <a className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10"
               href="/docs/NOOR_Legal_Light_2025_FINAL.pdf" target="_blank" rel="noreferrer">📄 Legal Light (PDF)</a>
          </div>
        </div>
      </section>
    </div>
  );
}

function short(a){ return `${a.slice(0,6)}…${a.slice(-4)}`; }
function Card({children}){ return <div className="card">{children}</div>; }
function Info({label, value}) {
  return (
    <div className="card">
      <div className="text-xs uppercase tracking-wide text-white/50">{label}</div>
      <div className="mt-1 text-lg">{value}</div>
    </div>
  );
}
function InfoLink({label, value, href}) {
  return (
    <a className="block" href={href} target="_blank" rel="noreferrer">
      <div className="card">
        <div className="text-xs uppercase tracking-wide text-white/50">{label}</div>
        <div className="mt-1 text-lg">{short(value)}</div>
      </div>
    </a>
  );
}
