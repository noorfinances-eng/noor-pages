// pages/en.js
export default function EN() {
  const CONTRACT = "0xA20212290866C8A804a89218c8572F28C507b401";
  const STAKING  = "0x4eBAbfb635A865EEA2a5304E1444B125aE223f70"; // V3

  return (
    <div className="space-y-16">
      {/* HERO */}
      <section className="relative py-16 md:py-24 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#ffffff10,transparent_60%)]" />
        <div className="relative">
          <h2 className="text-4xl md:text-5xl font-semibold">NOOR — The Light of Transparency in Crypto</h2>
          <p className="mt-4 text-white/70 max-w-2xl mx-auto">
            NUR rewards participation, clarity, and trust. No mining — only light.
          </p>
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <a
              className="px-4 py-2 rounded-lg bg-gold text-black font-medium"
              href={`https://bscscan.com/address/${CONTRACT}`}
              target="_blank"
              rel="noreferrer"
            >
              View on BscScan
            </a>
            <a
              className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10"
              href={`https://bscscan.com/address/${STAKING}`}
              target="_blank"
              rel="noreferrer"
            >
              Access Staking
            </a>
            <p className="basis-full text-xs text-white/40 mt-2">
              Legacy V2 → 0x6CB5CBEc7F0c5870781eA467244Ed31e2Ea3c702
            </p>
          </div>
        </div>
      </section>

      {/* PROOF OF LIGHT */}
      <section id="concept" className="border-t border-white/10 pt-12">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl md:text-3xl font-semibold">Proof of Light</h3>
          <p className="mt-3 text-white/75">
            Unlike traditional mining, NOOR rewards transparency and positive actions.
            Earn NUR through staking and community missions.
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
            <InfoLink label="Staking" value={STAKING} href={`https://bscscan.com/address/${STAKING}`} />
          </div>
        </div>
      </section>

      {/* ROADMAP */}
      <section id="roadmap" className="border-t border-white/10 pt-12">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl md:text-3xl font-semibold text-center">Roadmap</h3>
          <ul className="mt-6 space-y-3 text-white/85">
            <li>✓ Token deployed & verified on BSC</li>
            <li>✓ Staking V3 live (10% / 30 days)</li>
            <li>→ Official website (this one)</li>
            <li>→ Payments (/pay) & Merchant Kit (/merchant)</li>
            <li>→ Liquidity on PancakeSwap (NUR/BNB then NUR/USDT)</li>
            <li>→ Whitepaper & GitHub docs</li>
            <li>→ Community & listings</li>
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

      {/* LEGAL NOTICE */}
      <section id="legal" className="border-t border-white/10 pt-12 text-sm text-white/70">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <h3 className="text-xl font-semibold text-white">Legal Notice</h3>
          <p>
            The NOOR (NUR) project is an internal utility and payment token operating on the
            BNB Smart Chain. It does not constitute a financial security, an investment product,
            or a public offering under Swiss law.
          </p>
          <p>
            No yield, dividend, or return is promised or guaranteed. Users always retain full
            ownership of their tokens and are solely responsible for their own transactions.
          </p>
          <p>
            NOOR does not provide custody services and never holds any third-party funds.
            No direct conversion into fiat currencies (CHF/EUR/USD) is offered; any conversions
            must go through regulated partner PSPs (e.g., Mt Pelerin, NOWPayments).
          </p>
          <p>
            The official website and contracts are provided for informational and experimental
            purposes only. Using the NUR token implies full acceptance of these conditions.
          </p>
          <p className="text-white/50 mt-4">
            Official contact: <a href="mailto:noorfinances@gmail.com" className="underline">noorfinances@gmail.com</a>
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
