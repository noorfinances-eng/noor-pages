export default function EN() {
  const CONTRACT = "0xA20212290866C8A804a89218c8572F28C507b401";
  const STAKING  = "0x6CB5CBEc7F0c5870781eA467244Ed31e2Ea3c702";
  return (
    <main style={{maxWidth: 900, margin: "40px auto", padding: 16}}>
      <h1>NOOR — The Light of Transparency in Crypto</h1>
      <p>NUR rewards participation, clarity and trust. No mining — only light.</p>
      <p>
        <a href={`https://bscscan.com/address/${CONTRACT}`} target="_blank">View on BscScan</a> ·{" "}
        <a href={`https://bscscan.com/address/${STAKING}`} target="_blank">Access Staking</a>
      </p>
    </main>
  );
}
