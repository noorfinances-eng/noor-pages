// pages/de.js
export default function DE() {
  const CONTRACT = "0xA20212290866C8A804a89218c8572F28C507b401";
  const STAKING  = "0x4eBAbfb635A865EEA2a5304E1444B125aE223f70"; // V3

  return (
    <div className="space-y-16">
      {/* HERO */}
      <section className="relative py-16 md:py-24 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#ffffff10,transparent_60%)]" />
        <div className="relative">
          <h2 className="text-4xl md:text-5xl font-semibold">NOOR — Das Licht der Krypto-Transparenz</h2>
          <p className="mt-4 text-white/70 max-w-2xl mx-auto">
            NUR belohnt Teilnahme, Klarheit und Vertrauen. Kein Mining — nur Licht.
          </p>
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <a
              className="px-4 py-2 rounded-lg bg-gold text-black font-medium"
              href={`https://bscscan.com/address/${CONTRACT}`}
              target="_blank"
              rel="noreferrer"
            >
              Auf BscScan ansehen
            </a>
            <a
              className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10"
              href={`https://bscscan.com/address/${STAKING}`}
              target="_blank"
              rel="noreferrer"
            >
              Staking öffnen
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
            Anders als beim klassischen Mining belohnt NOOR Transparenz und positive Beiträge.
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
            <li>✓ Staking V3 live (10 % / 30 Tage)</li>
            <li>→ Offizielle Website (diese Seite)</li>
            <li>→ Zahlungen (/pay) & Merchant Kit (/merchant)</li>
            <li>→ Liquidität auf PancakeSwap (NUR/BNB, danach NUR/USDT)</li>
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

      {/* RECHTLICHER HINWEIS */}
      <section id="legal" className="border-t border-white/10 pt-12 text-sm text-white/70">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <h3 className="text-xl font-semibold text-white">Rechtlicher Hinweis</h3>
          <p>
            Das NOOR-Projekt (NUR) ist ein interner Utility- und Zahlungstoken auf der
            BNB Smart Chain. Es stellt weder ein Finanzinstrument noch ein Anlageprodukt
            oder ein öffentliches Angebot im Sinne des Schweizer Rechts dar.
          </p>
          <p>
            Es werden keine Renditen, Dividenden oder Erträge versprochen oder garantiert.
            Nutzer behalten jederzeit das volle Eigentum an ihren Tokens und sind für ihre
            Transaktionen selbst verantwortlich.
          </p>
          <p>
            NOOR erbringt keine Verwahrleistungen (keine Custody) und hält keine Drittmittel.
            Es wird keine direkte Umwandlung in Fiat-Währungen (CHF/EUR/USD) angeboten;
            allfällige Konversionen erfolgen ausschliesslich über regulierte Partner-PSPs
            (z.&nbsp;B. Mt Pelerin, NOWPayments).
          </p>
          <p>
            Die offizielle Website und die Smart Contracts dienen ausschliesslich Informations-
            und Experimentierzwecken. Die Nutzung des NUR-Tokens impliziert die Anerkennung
            dieser Bedingungen.
          </p>
          <p className="text-white/50 mt-4">
            Offizieller Kontakt:&nbsp;
            <a href="mailto:noorfinances@gmail.com" className="underline">noorfinances@gmail.com</a>
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
