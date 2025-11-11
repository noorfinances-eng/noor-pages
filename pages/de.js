export default function DE() {
  const CONTRACT = "0xA20212290866C8A804a89218c8572F28C507b401";
  const STAKING  = "0x4eBAbfb635A865EEA2a5304E1444B125aE223f70"; // V3

  return (
    <div className="space-y-16">
      {/* HERO */}
      <section className="relative py-16 md:py-24 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#ffffff10,transparent_60%)]" />
        <div className="relative">
          <h2 className="text-4xl md:text-5xl font-semibold">NOOR — Das Licht des Werts</h2>
          <p className="mt-4 text-white/70 max-w-2xl mx-auto">
            Man mined keine Macht — man mined Klarheit. NUR belohnt Teilnahme, Transparenz und Vertrauen.
          </p>
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <a className="px-4 py-2 rounded-lg bg-gold text-black font-medium" href={`https://bscscan.com/address/${CONTRACT}`} target="_blank" rel="noreferrer">
              Auf BscScan ansehen
            </a>
            <a className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10" href={`https://bscscan.com/address/${STAKING}`} target="_blank" rel="noreferrer">
              Staking öffnen (V3)
            </a>
            <a className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10" href="/pay-de">
              Jetzt zahlen (NOOR)
            </a>
          </div>
        </div>
      </section>

      {/* PROOF OF LIGHT */}
      <section id="concept" className="border-t border-white/10 pt-12">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl md:text-3xl font-semibold">Proof of Light</h3>
          <p className="mt-3 text-white/75">
            Anders als klassisches Mining belohnt NOOR Transparenz und positive Beiträge.
            Verdienen Sie NUR über Staking und Community-Missionen.
          </p>
        </div>
      </section>

      {/* TOKENOMICS */}
      <section id="tokenomics" className="border-t border-white/10 pt-12">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl md:text-3xl font-semibold text-center">Tokenomics</h3>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Info label="Netzwerk" value="BNB Smart Chain (56)" />
            <Info label="Standard" value="BEP-20 (ERC-20 kompatibel)" />
            <Info label="Symbol" value="NUR" />
            <Info label="Gesamtmenge" value="299.792.458 NUR (fix)" />
            <InfoLink label="Vertrag" value={CONTRACT} href={`https://bscscan.com/address/${CONTRACT}`} />
            <InfoLink label="Staking" value={STAKING} href={`https://bscscan.com/address/${STAKING}`} />
          </div>
        </div>
      </section>

      {/* ROADMAP */}
      <section id="roadmap" className="border-t border-white/10 pt-12">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl md:text-3xl font-semibold text-center">Fahrplan</h3>
          <ul className="mt-6 space-y-3 text-white/85">
            <li>✓ Token bereitgestellt & auf BSC verifiziert</li>
            <li>✓ Staking live (10% / 30 Tage)</li>
            <li>→ Offizielle Website (diese)</li>
            <li>→ Liquidität auf PancakeSwap (NUR/BNB, dann NUR/USDT)</li>
            <li>→ Whitepaper & GitHub-Dokumente</li>
            <li>→ Community & Listings</li>
          </ul>
        </div>
      </section>

      {/* DOCS */}
      <section id="docs" className="border-t border-white/10 pt-12">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl md:text-3xl font-semibold">Dokumente & Whitepaper</h3>
          <div className="mt-4 flex gap-3 justify-center">
            <a className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10" href="/docs/whitepaper.pdf">
              Whitepaper (bald)
            </a>
            <a className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10" href="https://github.com" target="_blank" rel="noreferrer">
              GitHub
            </a>
          </div>
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
