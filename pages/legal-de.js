// pages/legal-de.js
export default function LegalDE() {
  return (
    <div className="max-w-4xl mx-auto py-16 px-4 text-white/80 space-y-10">
      <h1 className="text-4xl font-semibold text-center text-white mb-6">
        Rechtlicher Hinweis — NOOR (NUR)
      </h1>

      <section>
        <h2 className="text-2xl font-semibold text-gold mb-3">1. Projektidentität</h2>
        <p>
          Das Projekt <strong>NOOR (NUR)</strong> ist ein interner Utility- und Zahlungstoken,
          der auf der <strong>BNB Smart Chain (BSC)</strong> basiert.
          Es wird in der Schweiz von dem Gründer betreut und entwickelt:
        </p>
        <p className="mt-2 text-white">
          <strong>Walid Barhoumi</strong><br />
          E-Mail: <a href="mailto:noorfinances@gmail.com" className="underline">noorfinances@gmail.com</a><br />
          (bald: <code>info@noortoken.com</code>)
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gold mb-3">2. Token-Natur</h2>
        <p>
          Der <strong>NUR</strong>-Token ist als <strong>Utility + Payment Token</strong> gemäß
          den <strong>FINMA-Richtlinien 2019</strong> klassifiziert.
          Er stellt kein Wertpapier, kein Anlageprodukt und kein öffentliches Angebot
          nach Schweizer Recht dar.
        </p>
        <p className="mt-2">
          Benutzer behalten jederzeit die volle Kontrolle über ihre Tokens.
          Es wird keine Rendite oder kein ROI versprochen; das Staking V3 (10 % / 30 Tage)
          ist symbolisch und intern.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gold mb-3">3. Umtausch und Partner</h2>
        <p>
          NOOR führt keine direkten Fiat-Umrechnungen (CHF / EUR / USD) durch.
          Mögliche Wechselvorgänge erfolgen ausschließlich über regulierte Partner
          wie <strong>Mt Pelerin</strong> oder <strong>NOWPayments</strong>.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gold mb-3">4. Haftung</h2>
        <p>
          NOOR bietet keinen Verwahrungsdienst an und hält keine Gelder von Nutzern.
          Das Projekt dient ausschließlich Bildungs- und Experimentationszwecken.
          Benutzer sind selbst verantwortlich für die Sicherheit ihrer privaten Schlüssel,
          Wallets und Transaktionen.
        </p>
        <p className="mt-2">
          NOOR haftet nicht für Wertverluste, technische Fehler oder regulatorische Änderungen.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gold mb-3">5. Transparenz</h2>
        <p>
          Alle offiziellen Smart Contracts und Adressen sind öffentlich auf BscScan einsehbar:
        </p>
        <ul className="mt-2 list-disc list-inside text-white/90">
          <li>NOORToken V2: 0xA20212290866C8A804a89218c8572F28C507b401</li>
          <li>NOORStaking V3: 0x4eBAbfb635A865EEA2a5304E1444B125aE223f70</li>
          <li>Gründer: 0x2538398B396bd16370aFBDaF42D09e637a86C3AC</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gold mb-3">6. Kontakt</h2>
        <p>
          Für rechtliche oder technische Fragen:<br />
          <a href="mailto:noorfinances@gmail.com" className="underline">noorfinances@gmail.com</a><br />
          (bald: <code>info@noortoken.com</code>)
        </p>
      </section>

      <p className="text-sm text-center text-white/50 mt-12">
        © 2025 NOOR Project — Proof of Light — Schweiz
      </p>
    </div>
  );
}
