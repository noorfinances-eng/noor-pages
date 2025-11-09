// pages/legal-en.js
export default function LegalEN() {
  return (
    <div className="max-w-4xl mx-auto py-16 px-4 text-white/80 space-y-10">
      <h1 className="text-4xl font-semibold text-center text-white mb-6">
        Legal Notice — NOOR (NUR)
      </h1>

      <section>
        <h2 className="text-2xl font-semibold text-gold mb-3">1. Project Identity</h2>
        <p>
          The <strong>NOOR (NUR)</strong> project is an internal utility and payment token
          operating on the <strong>BNB Smart Chain (BSC)</strong>.
          It is developed and supervised in Switzerland by the founder:
        </p>
        <p className="mt-2 text-white">
          <strong>Walid Barhoumi</strong><br />
          E-mail: <a href="mailto:noorfinances@gmail.com" className="underline">noorfinances@gmail.com</a><br />
          (soon: <code>info@noortoken.com</code>)
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gold mb-3">2. Token Nature</h2>
        <p>
          The <strong>NUR</strong> token is classified as a <strong>Utility + Payment Token</strong>
          under the <strong>FINMA 2019 guidelines</strong>.
          It is not a security, not an investment product, and not a public offering
          under Swiss law.
        </p>
        <p className="mt-2">
          Users always maintain full custody of their tokens.
          No yield or ROI is promised; the NOOR Staking V3 (10% / 30 days)
          is symbolic and internal.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gold mb-3">3. Conversions and Partners</h2>
        <p>
          NOOR performs no direct fiat (CHF / EUR / USD) conversions.
          Any exchange operations are handled through regulated partners
          such as <strong>Mt Pelerin</strong> or <strong>NOWPayments</strong>.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gold mb-3">4. Liability</h2>
        <p>
          NOOR offers no custody services and holds no user funds.
          The project is provided for educational and experimental purposes.
          Users are fully responsible for safeguarding their private keys,
          wallet security, and transactions.
        </p>
        <p className="mt-2">
          NOOR cannot be held responsible for token value fluctuations,
          technical issues, or regulatory changes.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gold mb-3">5. Transparency</h2>
        <p>
          All official smart contracts and addresses are public on BscScan:
        </p>
        <ul className="mt-2 list-disc list-inside text-white/90">
          <li>NOORToken V2: 0xA20212290866C8A804a89218c8572F28C507b401</li>
          <li>NOORStaking V3: 0x4eBAbfb635A865EEA2a5304E1444B125aE223f70</li>
          <li>Founder: 0x2538398B396bd16370aFBDaF42D09e637a86C3AC</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gold mb-3">6. Contact</h2>
        <p>
          For legal or technical questions:<br />
          <a href="mailto:noorfinances@gmail.com" className="underline">noorfinances@gmail.com</a><br />
          (soon: <code>info@noortoken.com</code>)
        </p>
      </section>

      <p className="text-sm text-center text-white/50 mt-12">
        © 2025 NOOR Project — Proof of Light — Switzerland
      </p>
    </div>
  );
}
