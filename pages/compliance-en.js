// pages/compliance-en.js
export default function ComplianceEN() {
  return (
    <div className="max-w-4xl mx-auto py-16 px-4 text-white/85 space-y-10">
      <h1 className="text-4xl font-semibold text-center text-white mb-6">
        Compliance — NOOR (NUR)
      </h1>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-gold">FINMA Light Summary</h2>
        <ul className="list-disc list-inside space-y-2">
          <li><strong>Type:</strong> Internal Utility + Payment token (BNB Smart Chain, ChainID 56).</li>
          <li><strong>No yield:</strong> no interest/dividends promised.</li>
          <li><strong>No custody:</strong> users keep full control of their keys/funds.</li>
          <li><strong>No direct fiat conversion:</strong> any future conversions via regulated PSP partners (e.g., Mt Pelerin, NOWPayments).</li>
          <li><strong>No public investment offer:</strong> no ICO/IDO.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-gold">Proof of Light (utility)</h2>
        <ul className="list-disc list-inside space-y-2">
          <li><strong>Internal payments:</strong> NUR ↔ NUR exchanges (merchants/affiliates).</li>
          <li><strong>Staking V3 (symbolic):</strong> 10% / 30 days, no financial gain promise.</li>
          <li><strong>Positive actions:</strong> community missions, transparency, education.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-gold">Transparency</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>NOORToken V2: <code>0xA20212290866C8A804a89218c8572F28C507b401</code></li>
          <li>NOORStaking V3: <code>0x4eBAbfb635A865EEA2a5304E1444B125aE223f70</code></li>
          <li>Founder (owner): <code>0x2538398B396bd16370aFBDaF42D09e637a86C3AC</code></li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-gold">Useful links</h2>
        <div className="flex flex-wrap gap-3">
          <a className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10" href="/docs/NOOR_Legal_Light_2025_FINAL.pdf" target="_blank" rel="noreferrer">📄 Legal Light (PDF)</a>
          <a className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10" href="/pay">Pay with NOOR</a>
          <a className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10" href="/merchant">Merchant Kit</a>
        </div>
      </section>

      <p className="text-sm text-center text-white/50 mt-12">© 2025 NOOR Project — Proof of Light — Switzerland</p>
    </div>
  );
}
