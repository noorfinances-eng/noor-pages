// pages/compliance.js
export default function ComplianceFR() {
  return (
    <div className="max-w-4xl mx-auto py-16 px-4 text-white/85 space-y-10">
      <h1 className="text-4xl font-semibold text-center text-white mb-6">
        Conformité — NOOR (NUR)
      </h1>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-gold">Résumé FINMA Light</h2>
        <ul className="list-disc list-inside space-y-2">
          <li><strong>Type :</strong> Utility + Payment token interne (BNB Smart Chain, ChainID 56).</li>
          <li><strong>Pas de rendement :</strong> aucun intérêt/dividende promis.</li>
          <li><strong>Pas de custody :</strong> les utilisateurs gardent leurs clés/fonds.</li>
          <li><strong>Pas de conversion fiat directe :</strong> conversions éventuelles via PSP partenaires (ex. Mt Pelerin, NOWPayments).</li>
          <li><strong>Pas d’offre publique d’investissement :</strong> pas d’ICO/IDO.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-gold">Proof of Light (utilité)</h2>
        <ul className="list-disc list-inside space-y-2">
          <li><strong>Paiements internes :</strong> échanges NUR ↔ NUR (marchands/partenaires).</li>
          <li><strong>Staking V3 (symbolique) :</strong> 10% / 30 jours, sans promesse de gain financier.</li>
          <li><strong>Actions positives :</strong> missions communautaires, transparence, éducation.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-gold">Transparence</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>NOORToken V2 : <code>0xA20212290866C8A804a89218c8572F28C507b401</code></li>
          <li>NOORStaking V3 : <code>0x4eBAbfb635A865EEA2a5304E1444B125aE223f70</code></li>
          <li>Fondateur (owner) : <code>0x2538398B396bd16370aFBDaF42D09e637a86C3AC</code></li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-gold">Liens utiles</h2>
        <div className="flex flex-wrap gap-3">
          <a className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10" href="/docs/NOOR_Legal_Light_2025_FINAL.pdf" target="_blank" rel="noreferrer">📄 Legal Light (PDF)</a>
          <a className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10" href="/pay">Pay with NOOR</a>
          <a className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10" href="/merchant">Merchant Kit</a>
        </div>
      </section>

      <p className="text-sm text-center text-white/50 mt-12">© 2025 NOOR Project — Proof of Light — Suisse</p>
    </div>
  );
}
