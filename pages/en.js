import Head from "next/head";

export default function EN() {
  const CONTRACT = "0xA20212290866C8A804a89218c8572F28C507b401";
  const STAKING  = "0x4eBAbfb635A865EEA2a5304E1444B125aE223f70";
  const STAKING_LEGACY = "0x6CB5CBEc7F0c5870781eA467244Ed31e2Ea3c702";

  return (
    <>
      <Head>
        <title>NOOR (NUR) — The Light of Transparency in Crypto</title>
        <meta
          name="description"
          content="NOOR (NUR) is a Swiss ethical Utility + Payment token on BNB Smart Chain. Proof of Light: transparency, non-custodial, no fiat, no promised returns."
        />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="NOOR — Proof of Light" />
        <meta
          property="og:description"
          content="Swiss transparent token for ethical payments — Utility + Payment on BNB Smart Chain. Non-custodial, no fiat."
        />
        <meta property="og:image" content="/og-noor.svg?v=1" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="/en" />
      </Head>

      <div className="space-y-16">
        {/* HERO */}
        <section className="relative py-16 md:py-24 text-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#ffffff10,transparent_60%)]" />
          <div className="relative">
            <h2 className="text-4xl md:text-5xl font-semibold">
              NOOR — The Light of Transparency in Crypto
            </h2>
            <p className="mt-4 text-white/70 max-w-2xl mx-auto">
              NUR rewards participation, clarity and trust. No mining — only light.
            </p>
            <div className="mt-8 flex flex-wrap gap-4 justify-center">
              <a
                className="px-4 py-2 rounded-lg bg-gold text-black font-medium"
                href={`https://bscscan.com/address/${CONTRACT}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View NOOR token contract on BscScan"
              >
                View on BscScan
              </a>
              <a
                className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10"
                href={`https://bscscan.com/address/${STAKING}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open NOOR staking contract (V3) on BscScan"
              >
                Access Staking (V3)
              </a>
            </div>
            <p className="text-xs text-white/40 mt-2">
              Legacy V2 → {short(STAKING_LEGACY)}
            </p>
          </div>
        </section>

        {/* PROOF OF LIGHT */}
        <section id="proof" className="border-t border-white/10 pt-12">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <h3 className="text-2xl md:text-3xl font-semibold text-gold">Proof of Light</h3>
            <p className="text-white/80 leading-relaxed">
              <strong>Proof of Light</strong> is a philosophy before being a technology.
              NOOR rewards transparent actions, trust and clarity.
              No mining, no blind speculation — only conscious participation.
            </p>
            <p className="text-white/70">
              Every NUR holder embodies light — ethics, sharing and transparency.
              Rewards are symbolic, tied to engagement rather than mere possession.
            </p>
          </div>
        </section>

        {/* TOKENOMICS */}
        <section id="tokenomics" className="border-t border-white/10 pt-12">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-semibold text-center">Tokenomics</h3>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Info label="Network" value="BNB Smart Chain (56)" />
              <Info label="Standard" value="BEP-20 (ERC-20 compatible)" />
              <Info label="Symbol" value="NUR" />
              <Info label="Total Supply" value="299,792,458 NUR (fixed)" />
              <InfoLink label="Contract" value={CONTRACT} href={`https://bscscan.com/address/${CONTRACT}`} />
              <InfoLink label="Staking (V3)" value={STAKING} href={`https://bscscan.com/address/${STAKING}`} />
            </div>
          </div>
        </section>

        {/* ROADMAP */}
        <section id="roadmap" className="border-t border-white/10 pt-12">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-semibold text-center">Roadmap</h3>
            <ul className="mt-6 space-y-3 text-white/85">
              <li>✓ Token deployed & verified on BSC</li>
              <li>✓ Staking live (10% / 30 days)</li>
              <li>→ Official website (this)</li>
              <li>→ Liquidity on PancakeSwap (NUR/BNB then NUR/USDT)</li>
              <li>→ Whitepaper & GitHub docs</li>
              <li>→ Community & listings</li>
            </ul>
          </div>
        </section>

        {/* LEGAL LIGHT */}
        <section id="legal" className="border-t border-white/10 pt-12">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <h3 className="text-2xl md:text-3xl font-semibold text-gold">Legal Light</h3>
            <p className="text-white/75">
              NOOR (NUR) is a Swiss <strong>Utility & Payment Token</strong>.
              It is not a security and does not represent any promise of returns.
            </p>
            <p className="text-white/60">
              No fiat is accepted, and no custody of third-party funds is performed.
              All payments are crypto-to-crypto directly between users.
            </p>
            <p className="text-white/50 text-sm italic">
              In line with Swiss guidance, NOOR remains a non-custodial, purely utilitarian project.
            </p>
          </div>
        </section>

        {/* DOCS */}
        <section id="docs" className="border-t border-white/10 pt-12">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-semibold">Docs & Whitepaper</h3>
            <div className="mt-4 flex gap-3 justify-center">
              <a
                className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10"
                href="/docs/whitepaper.pdf"
                aria-label="Open NOOR whitepaper (coming soon)"
              >
                Whitepaper (soon)
              </a>
              <a
                className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10"
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open NOOR GitHub"
              >
                GitHub
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

/* Helpers & UI */
function short(a){ return `${a.slice(0,6)}…${a.slice(-4)}`; }
function Box({children}){ return <div className="p-4 rounded-xl border border-white/10 hover:border-white/20">{children}</div>; }
function Info({label, value}) {
  return (
    <Box>
      <div className="text-xs uppercase tracking-wide text-white/50">{label}</div>
      <div className="mt-1 text-lg">{value}</div>
    </Box>
  );
}
function InfoLink({label, value, href}) {
  return (
    <a className="block" href={href} target="_blank" rel="noopener noreferrer">
      <Box>
        <div className="text-xs uppercase tracking-wide text-white/50">{label}</div>
        <div className="mt-1 text-lg">{short(value)}</div>
      </Box>
    </a>
  );
}
