// pages/index.js
export default function Home() {
  return (
    <div className="relative">
      {/* HERO */}
      <section className="relative text-center py-20 md:py-28 fade-in">
        {/* halo et beams déjà gérés par globals.css */}
        <div className="relative z-10 max-w-5xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-semibold leading-tight">
            NOOR — <span className="text-white/90">The Light of Transparency</span>
          </h1>
          <p className="mt-5 text-white/70 text-lg md:text-xl max-w-3xl mx-auto">
            A Swiss Utility + Payment token on BNB Smart Chain. No custody. No promised yield.
            Just clarity, participation, and Proof of Light.
          </p>

          {/* CTA */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <a href="/en" className="btn-gold">Discover (EN)</a>
            <a href="/fr" className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10 transition">Découvrir (FR)</a>
            <a href="/de" className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10 transition">Entdecken (DE)</a>
          </div>

          {/* Secondary actions */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-sm">
            <a href="/docs/NOOR_Legal_Light_2025_FINAL.pdf" target="_blank" rel="noreferrer"
               className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10 transition">
              📄 Legal Light (PDF)
            </a>
            <a href="/compliance" className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10 transition">
              Compliance
            </a>
            <a href="/pay" className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10 transition">
              Pay with NOOR
            </a>
            <a href="/merchant" className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10 transition">
              Merchant Kit
            </a>
          </div>
        </div>
      </section>

      {/* HIGHLIGHTS */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 py-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card
            title="Utility + Payment"
            text="Internal payments (NUR↔NUR), symbolic staking (10% / 30 days), and community missions focused on transparency."
          />
          <Card
            title="Swiss Legal Light"
            text="No custody, no direct fiat conversion, no yield promise. Compliance summary published and verifiable."
          />
          <Card
            title="Transparent On-Chain"
            text={
              <>
                NOORToken V2:&nbsp;
                <a className="underline hover:text-white"
                   href="https://bscscan.com/address/0xA20212290866C8A804a89218c8572F28C507b401"
                   target="_blank" rel="noreferrer">
                  0xA2021…b401
                </a>
                <br />
                Staking V3:&nbsp;
                <a className="underline hover:text-white"
                   href="https://bscscan.com/address/0x4eBAbfb635A865EEA2a5304E1444B125aE223f70"
                   target="_blank" rel="noreferrer">
                  0x4eBAb…3f70
                </a>
              </>
            }
          />
        </div>
      </section>

      {/* PROOF OF LIGHT */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 pt-10">
        <div className="card text-center">
          <h2 className="text-3xl md:text-4xl font-semibold">Proof of Light</h2>
          <p className="mt-4 text-white/75 max-w-3xl mx-auto">
            Unlike traditional mining, NOOR rewards transparency and positive contributions:
            education, open documentation, and merchant adoption. The goal is a usable,
            ethical token where participation “mines” value for the community.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a href="/en#tokenomics" className="btn-gold">Tokenomics</a>
            <a href="/en#roadmap" className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10 transition">
              Roadmap
            </a>
          </div>
        </div>
      </section>

      {/* ROADMAP SNAPSHOT */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 pt-12 pb-4">
        <h3 className="text-2xl md:text-3xl font-semibold text-center">Roadmap Snapshot</h3>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="card">
            <h4 className="text-xl font-semibold">Done ✅</h4>
            <ul className="mt-3 space-y-2 text-white/80">
              <li>• Token V2 deployed (BSC, fixed supply)</li>
              <li>• Staking V3 live (pausable, verified)</li>
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
              <li>• Community updates (concise)</li>
            </ul>
          </div>
        </div>
      </section>

      {/* LANG LINKS */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 py-12 text-center">
        <p className="text-white/60">Choose your language</p>
        <div className="mt-3 flex flex-wrap justify-center gap-3">
          <a href="/en" className="btn-gold">English</a>
          <a href="/fr" className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10 transition">Français</a>
          <a href="/de" className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10 transition">Deutsch</a>
        </div>
      </section>
    </div>
  );
}

/* ——— UI helpers ——— */
function Card({ title, text }) {
  return (
    <div className="card">
      <h4 className="text-xl font-semibold">{title}</h4>
      <p className="mt-2 text-white/75">{text}</p>
    </div>
  );
}
