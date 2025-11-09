// pages/fr.js
export default function FR() {
  const CONTRACT = "0xA20212290866C8A804a89218c8572F28C507b401";
  const STAKING  = "0x4eBAbfb635A865EEA2a5304E1444B125aE223f70"; // V3

  return (
    <div className="space-y-16">
      {/* HERO */}
      <section className="relative py-16 md:py-24 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#ffffff10,transparent_60%)]" />
        <div className="relative">
          <h2 className="text-4xl md:text-5xl font-semibold">NOOR — La lumière de la transparence crypto</h2>
          <p className="mt-4 text-white/70 max-w-2xl mx-auto">
            NUR récompense la participation, la clarté et la confiance. Pas de minage — seulement la lumière.
          </p>
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <a className="px-4 py-2 rounded-lg bg-gold text-black font-medium" href={`https://bscscan.com/address/${CONTRACT}`} target="_blank" rel="noreferrer">
              Voir sur BscScan
            </a>
            <a className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10" href={`https://bscscan.com/address/${STAKING}`} target="_blank" rel="noreferrer">
              Accéder au Staking
            </a>
            <p className="basis-full text-xs text-white/40 mt-2">
              Legacy V2 → 0x6CB5CBEc7F0c5870781eA467244Ed31e2Ea3c702
            </p>
          </div>
        </div>
      </section>

      {/* PROOF OF LIGHT */}
      <section id="concept" className="border-top border-white/10 pt-12">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl md:text-3xl font-semibold">Proof of Light</h3>
          <p className="mt-3 text-white/75">
            Contrairement au minage classique, NOOR récompense la transparence et les actions positives.
            Gagnez des NUR via le staking et des missions communautaires.
          </p>
        </div>
      </section>

      {/* TOKENOMICS */}
      <section id="tokenomics" className="border-t border-white/10 pt-12">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl md:text-3xl font-semibold text-center">Tokenomics</h3>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Info label="Réseau" value="BNB Smart Chain (56)" />
            <Info label="Standard" value="BEP-20 (compatible ERC-20)" />
            <Info label="Symbole" value="NUR" />
            <Info label="Quantité totale" value="299 792 458 NUR (fixe)" />
            <InfoLink label="Contrat" value={CONTRACT} href={`https://bscscan.com/address/${CONTRACT}`} />
            <InfoLink label="Staking" value={STAKING} href={`https://bscscan.com/address/${STAKING}`} />
          </div>
        </div>
      </section>

      {/* ROADMAP */}
      <section id="roadmap" className="border-t border-white/10 pt-12">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl md:text-3xl font-semibold text-center">Feuille de route</h3>
          <ul className="mt-6 space-y-3 text-white/85">
            <li>✓ Token déployé & vérifié sur BSC</li>
            <li>✓ Staking V3 en ligne (10% / 30 jours)</li>
            <li>→ Site officiel (celui-ci)</li>
            <li>→ Paiements (/pay) & Merchant Kit (/merchant)</li>
            <li>→ Liquidité PancakeSwap (NUR/BNB puis NUR/USDT)</li>
            <li>→ Whitepaper & docs GitHub</li>
            <li>→ Communauté & listings</li>
          </ul>
        </div>
      </section>

      {/* DOCS */}
      <section id="docs" className="border-t border-white/10 pt-12">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl md:text-3xl font-semibold">Docs & Whitepaper</h3>
          <div className="mt-4 flex gap-3 justify-center">
            <a className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10" href="/pay">
              Pay with NOOR
            </a>
            <a className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10" href="/merchant">
              Merchant Kit
            </a>
            <a className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10" href="/docs/NOOR_Legal_Light_2025_FINAL.pdf" target="_blank" rel="noreferrer">
              📄 Legal Light (PDF)
            </a>
            <a className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10" href="https://github.com" target="_blank" rel="noreferrer">
              GitHub
            </a>
          </div>
        </div>
      </section>

      {/* MENTIONS LÉGALES */}
      <section id="legal" className="border-t border-white/10 pt-12 text-sm text-white/70">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <h3 className="text-xl font-semibold text-white">Mentions légales</h3>
          <p>
            Le projet NOOR (NUR) est un jeton utilitaire et de paiement interne fonctionnant sur la
            BNB Smart Chain. Il ne constitue ni un titre financier, ni un produit d’investissement
            collectif, ni une offre au public au sens du droit suisse.
          </p>
          <p>
            Aucun rendement, dividende ou intérêt n’est promis ou garanti. Les utilisateurs conservent
            toujours la pleine propriété de leurs tokens et assument la responsabilité de leurs
            transactions.
          </p>
          <p>
            NOOR n’offre pas de services de garde (custody) et ne détient aucun fonds d’autrui.
            Aucune conversion directe en monnaies fiduciaires (CHF/EUR/USD) n’est proposée ;
            les conversions éventuelles passent uniquement par des prestataires partenaires
            agréés (p. ex. Mt Pelerin, NOWPayments).
          </p>
          <p>
            Le site officiel et les contrats sont fournis à titre informatif et expérimental.
            Toute utilisation du token NUR implique l’acceptation de ces conditions.
          </p>
          <p className="text-white/50 mt-4">
            Contact officiel : <a href="mailto:noorfinances@gmail.com" className="underline">noorfinances@gmail.com</a>
          </p>
        </div>
      </section>
    </div>
  );
}

function short(a){ return `${a.slice(0,6)}…${a.slice(-4)}`; }
function Box({children}){ return <div className="p-4 rounded-xl border border-white/10 hover:border-white/20">{children}</div>; }
function Info({label, value}) {
  return <Box><div className="text-xs uppercase tracking-wide text-white/50">{label}</div><div className="mt-1 text-lg">{value}</div></Box>;
}
function InfoLink({label, value, href}) {
  return (
    <a className="block" href={href} target="_blank" rel="noreferrer">
      <Box>
        <div className="text-xs uppercase tracking-wide text-white/50">{label}</div>
        <div className="mt-1 text-lg">{short(value)}</div>
      </Box>
    </a>
  );
}
