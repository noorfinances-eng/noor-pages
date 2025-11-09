// pages/en.js
export default function EN() {
  const CONTRACT = "0xA20212290866C8A804a89218c8572F28C507b401";
  const STAKING  = "0x4eBAbfb635A865EEA2a5304E1444B125aE223f70"; // V3

  return (
    <div className="space-y-16">
      {/* HERO */}
      <section className="relative text-center py-18 md:py-24 fade-in">
        <div className="relative z-10 max-w-5xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-semibold">NOOR — The Light of Transparency</h2>
          <p className="mt-4 text-white/70 max-w-2xl mx-auto">
            A Swiss Utility + Payment token on BNB Smart Chain. No custody. No promised yield.
            Only clarity, participation, and Proof of Light.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <a className="btn-gold" href={`https://bscscan.com/address/${CONTRACT}`} target="_blank" rel="noreferrer">
              View Contract (BscScan)
            </a>
            <a className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10 transition"
               href={`https://bscscan.com/address/${STAKING}`} target="_blank" rel="noreferrer">
              Access Staking V3
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
              Unlike traditional mining, NOOR rewards transparency and positive actions:
              education, open documentation, merchant adoption, and community missions.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <a href="#tokenomics" className="btn-gold">Tokenomics</a>
              <a href="#roadmap" className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10 transition">Roadmap</a>
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
            <Info label="Network" value="BNB Smart Chain (56)" />
            <Info label="Standard" value="BEP-20 (ERC-20 compatible)" />
            <Info label="Symbol" value="NUR" />
            <Info label="Total Supply" value="299,792,458 NUR (fixed)" />
            <InfoLink label="Contract" value={CONTRACT} href={`https://bscscan.com/address/${CONTRACT}`} />
            <InfoLink label="Staking V3" value={STAKING} href={`https://bscscan.com/address/${STAKING}`} />
          </div>
        </div>
      </section>

      {/* ROADMAP */}
      <section id="roadmap" className="border-t border-white/10 pt-12">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-2xl md:text-3xl font-semibold text-center">Roadmap</h3>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="card">
              <h4 className="text-xl font-semibold">Done ✅</h4>
              <ul className="mt-3 space-y-2 text-white/80">
                <li>• Token V2 deployed (BSC, fixed supply)</li>
                <li>• Staking V3 live & verified (10% / 30 days)</li>
                <li>• Multilingual site (FR/EN/DE)</li>
                <li>• Legal Light PDF (FR/EN) published</li>
                <li>• Legal & Compliance pages online</li>
                <li>• /pay QR (EIP-681) functional</li>
              </ul>
            </div>
            <div className="card">
              <h4 className="text-xl font-semibold">Next 🔜</h4>
              <ul className="mt-3 space-y-2 text-white/80">
                <li>• Merchant flow polish (WalletConnect UX)</li>
                <li>• Initial liquidity on PancakeSwap (NUR/BNB)</li>
                <li>• Lock LP (6–12 months) for trust</li>
                <li>• BscScan visuals (logo/desc)</li>
                <li>• Community updates</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* DOCS */}
      <section id="docs" className="border-t border-white/10 pt-12">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h3 className="text-2xl md:text-3xl font-semibold">Docs & Tools</h3>
          <div className="mt-4 flex flex-wrap gap-3 justify-center">
            <a className="btn-gold" href="/pay">Pay with NOOR</a>
            <a className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10" href="/merchant">Merchant Kit</a>
            <a className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10" href="/compliance-en">Compliance</a>
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
