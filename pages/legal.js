// pages/legal.js
export default function Legal() {
  return (
    <div className="max-w-4xl mx-auto py-16 px-4 text-white/80 space-y-10">
      <h1 className="text-4xl font-semibold text-center text-white mb-6">
        Mentions légales — NOOR (NUR)
      </h1>

      <section>
        <h2 className="text-2xl font-semibold text-gold mb-3">1. Identité du projet</h2>
        <p>
          Le projet <strong>NOOR (NUR)</strong> est un jeton utilitaire et de paiement interne
          fonctionnant sur la <strong>BNB Smart Chain (BSC)</strong>.
          Il est développé et supervisé depuis la Suisse par le fondateur&nbsp;:
        </p>
        <p className="mt-2 text-white">
          <strong>Walid Barhoumi</strong><br />
          E-mail : <a href="mailto:noorfinances@gmail.com" className="underline">noorfinances@gmail.com</a><br />
          (prochainement : <code>info@noortoken.com</code>)
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gold mb-3">2. Nature du token</h2>
        <p>
          Le jeton <strong>NUR</strong> est classé comme <strong>Utility + Payment Token</strong>
          selon les lignes directrices de la FINMA (2019).
          Il ne constitue ni un titre financier, ni un produit d’investissement collectif,
          ni une offre publique au sens du droit suisse.
        </p>
        <p className="mt-2">
          Les utilisateurs conservent à tout moment la garde et la propriété de leurs tokens.
          Aucune promesse de rendement n’est formulée ; le staking V3 (10 % / 30 jours)
          a une finalité symbolique et interne.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gold mb-3">3. Conversions et partenaires</h2>
        <p>
          NOOR n’effectue aucune conversion directe en monnaies fiduciaires (CHF / EUR / USD).
          Les conversions éventuelles passent uniquement par des prestataires partenaires
          régulés tels que <strong>Mt Pelerin</strong> ou <strong>NOWPayments</strong>.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gold mb-3">4. Responsabilité</h2>
        <p>
          NOOR n’offre aucun service de garde (custody) et ne détient aucun fonds d’autrui.
          Le projet est fourni à titre expérimental et informatif.
          L’utilisateur demeure responsable de la conservation de ses clés privées,
          de la sécurité de son portefeuille et de ses transactions.
        </p>
        <p className="mt-2">
          NOOR ne peut être tenu responsable d’une perte de valeur du token,
          d’un bug technique, ni d’une modification du cadre réglementaire.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gold mb-3">5. Transparence</h2>
        <p>
          Tous les contrats et adresses officielles sont publiés et vérifiables sur BscScan :
        </p>
        <ul className="mt-2 list-disc list-inside text-white/90">
          <li>NOORToken V2 : 0xA20212290866C8A804a89218c8572F28C507b401</li>
          <li>NOORStaking V3 : 0x4eBAbfb635A865EEA2a5304E1444B125aE223f70</li>
          <li>Fondateur : 0x2538398B396bd16370aFBDaF42D09e637a86C3AC</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gold mb-3">6. Contact</h2>
        <p>
          Pour toute question légale ou technique :<br />
          <a href="mailto:noorfinances@gmail.com" className="underline">noorfinances@gmail.com</a><br />
          (bientôt : <code>info@noortoken.com</code>)
        </p>
      </section>

      <p className="text-sm text-center text-white/50 mt-12">
        © 2025 NOOR Project — Proof of Light — Suisse
      </p>
    </div>
  );
}
