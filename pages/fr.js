export default function FR() {
  const CONTRACT = "0xA20212290866C8A804a89218c8572F28C507b401";
  const STAKING  = "0x6CB5CBEc7F0c5870781eA467244Ed31e2Ea3c702";
  return (
    <main style={{maxWidth: 900, margin: "40px auto", padding: 16}}>
      <h1>NOOR — La lumière de la transparence crypto</h1>
      <p>NUR récompense la participation, la clarté et la confiance. Pas de minage — seulement la lumière.</p>
      <p>
        <a href={`https://bscscan.com/address/${CONTRACT}`} target="_blank">Voir sur BscScan</a> ·{" "}
        <a href={`https://bscscan.com/address/${STAKING}`} target="_blank">Accéder au Staking</a>
      </p>
    </main>
  );
}
