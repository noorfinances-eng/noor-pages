export default function DE() {
  const CONTRACT = "0xA20212290866C8A804a89218c8572F28C507b401";
  const STAKING  = "0x6CB5CBEc7F0c5870781eA467244Ed31e2Ea3c702";
  return (
    <div className="space-y-8 text-center">
      <h2 className="text-4xl font-semibold">NOOR — Das Licht der Krypto-Transparenz</h2>
      <p className="text-white/70 max-w-2xl mx-auto">
        NUR belohnt Teilnahme, Klarheit und Vertrauen.  
        Kein Mining — nur Licht.
      </p>
      <div className="flex justify-center gap-4">
        <a href={`https://bscscan.com/address/${CONTRACT}`} target="_blank"
           className="px-4 py-2 rounded-lg bg-gold text-black font-medium">Auf BscScan ansehen</a>
        <a href={`https://bscscan.com/address/${STAKING}`} target="_blank"
           className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10">Staking öffnen</a>
      </div>
    </div>
  );
}
