export default function EN() {
  const CONTRACT = "0xA20212290866C8A804a89218c8572F28C507b401";
  const STAKING  = "0x6CB5CBEc7F0c5870781eA467244Ed31e2Ea3c702";

  return (
    <div className="space-y-16">
      {/* HERO */}
      <section className="relative py-16 md:py-24 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#ffffff10,transparent_60%)]" />
        <div className="relative">
          <h2 className="text-4xl md:text-5xl font-semibold">NOOR — The Light of Transparency in Crypto</h2>
          <p className="mt-4 text-white/70 max-w-2xl mx-auto">
            NUR rewards participation, clarity and trust. No mining — only light.
          </p>
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <a
              className="px-4 py-2 rounded-lg bg-gold text-black font-medium"
              href={`https://bscscan.com/address/${CONTRACT
