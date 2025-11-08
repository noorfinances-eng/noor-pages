// pages/pay.js
import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";

const NUR_CONTRACT = "0xA20212290866C8A804a89218c8572F28C507b401"; // NOORTokenV2
const BSC_CHAIN_ID_DEC = 56;
const BSC_CHAIN_ID_HEX = "0x38";

function PayInner() {
  // Base URL + formulaire
  const [baseUrl, setBaseUrl] = useState("");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  // Type de QR
  const [qrMode, setQrMode] = useState("link"); // "link" | "universal" | "eip681"

  // Canvas QR
  const canvasRef = useRef(null);

  const short = (a) => (!a ? "—" : `${a.slice(0, 6)}…${a.slice(-4)}`);

  // Client only + préremplissage depuis ?to=&amount=
  useEffect(() => {
    if (typeof window === "undefined") return;
    setBaseUrl(window.location.origin);
    const params = new URLSearchParams(window.location.search || "");
    const to = params.get("to");
    const amt = params.get("amount");
    if (to && /^0x[0-9a-fA-F]{40}$/.test(to)) setRecipient(to);
    if (amt && !isNaN(Number(amt))) setAmount(amt);
  }, []);

  // toWei simple (18 décimales) sans ethers
  const toWei = (numString) => {
    if (!numString || isNaN(Number(numString))) return "0";
    const [intPart, fracPart = ""] = String(numString).split(".");
    const frac = (fracPart + "000000000000000000").slice(0, 18);
    const joined = (intPart || "0") + frac;
    return joined.replace(/^0+(?=\d)/, "") || "0";
  };

  // EIP-681 (wallets compatibles uniquement)
  const eip681 = useMemo(() => {
    const to = (recipient || "").trim();
    if (!to || to.length !== 42 || !to.startsWith("0x")) return "";
    const wei = toWei(amount || "0");
    return `ethereum:${NUR_CONTRACT}/transfer?address=${to}&uint256=${wei}&chain_id=${BSC_CHAIN_ID_DEC}`;
  }, [recipient, amount]);

  // QR universel (adresse seule)
  const universalPayload = useMemo(() => {
    const meta = {
      chainId: BSC_CHAIN_ID_DEC,
      recipient: (recipient || "").trim(),
      hint: { token: NUR_CONTRACT, amountNUR: amount || "" }
    };
    const addr = (recipient || "").trim();
    return (addr ? addr : "NOOR") + "\nMETA:" + JSON.stringify(meta);
  }, [recipient, amount]);

  // Lien partageable HTTPS → ouvre /pay prérempli
  const shareLink = useMemo(() => {
    // ⚠️ IMPORTANT : pas de new URL tant que baseUrl n'est pas prêt côté client
    if (!baseUrl) return "";
    const to = (recipient || "").trim();
    const amt = (amount || "").trim();
    const u = new URL(baseUrl + "/pay");
    if (to) u.searchParams.set("to", to);
    if (amt) u.searchParams.set("amount", amt);
    u.hash = "open";
    return u.toString();
  }, [baseUrl, recipient, amount]);

  // Contenu du QR selon mode
  const qrContent = useMemo(() => {
    if (qrMode === "eip681") return eip681 || "NOOR";
    if (qrMode === "universal") return universalPayload || "NOOR";
    return shareLink || "NOOR"; // "link" par défaut ; avant hydratation, c'est "NOOR"
  }, [qrMode, eip681, universalPayload, shareLink]);

  // Dessin du QR (client-only import de "qrcode")
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!canvasRef.current) return;
      try {
        const QR = await import("qrcode");
        if (!mounted) return;
        await QR.toCanvas(canvasRef.current, qrContent, {
          errorCorrectionLevel: "M",
          margin: 2,
          scale: 6
        });
      } catch {
        // ignore
      }
    })();
    return () => { mounted = false; };
  }, [qrContent]);

  // Aide: ajouter BSC dans MetaMask/Rabby
  const addBscToWallet = async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      alert("Wallet non détecté (MetaMask/Rabby).");
      return;
    }
    try {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [{
          chainId: BSC_CHAIN_ID_HEX,
          chainName: "BNB Smart Chain",
          nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
          rpcUrls: [
            "https://bsc-dataseed.binance.org",
            "https://bsc-dataseed1.binance.org",
            "https://bsc-dataseed2.binance.org",
            "https://bsc-dataseed3.binance.org",
            "https://bsc-dataseed4.binance.org"
          ],
          blockExplorerUrls: ["https://bscscan.com"]
        }]
      });
    } catch {
      alert("Impossible d'ajouter BSC au wallet.");
    }
  };

  const copy = async (txt) => {
    try { await navigator.clipboard.writeText(txt); alert("Copié !"); } catch {}
  };

  return (
    <div className="space-y-10">
      {/* HERO */}
      <section className="text-center">
        <h2 className="text-4xl md:text-5xl font-semibold">Pay with NOOR</h2>
        <p className="mt-3 text-white/70 max-w-2xl mx-auto">
          3 QR au choix : <span className="text-gold font-medium">Lien (HTTPS)</span> → ouvre cette page pré-remplie ;
          <span className="text-gold font-medium"> Universel (adresse)</span> → marche dans tous les wallets ;
          <span className="text-gold font-medium"> Avancé (EIP-681)</span> → pour wallets compatibles.
        </p>
        <div className="mt-6">
          <button onClick={addBscToWallet} className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10">
            Ajouter BSC au wallet
          </button>
        </div>
      </section>

      {/* FORM + QR */}
      <section className="grid gap-6 md:grid-cols-2">
        {/* Formulaire */}
        <div className="p-5 rounded-xl border border-white/10">
          <h3 className="text-xl font-semibold">1) Paramètres</h3>
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm text-white/60 mb-1">Adresse destinataire (wallet BSC)</label>
              <input
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="0x..."
                className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-1">Montant (en NUR)</label>
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Ex: 25"
                inputMode="decimal"
                className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-1">Note (optionnel)</label>
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Référence interne (max 140)"
                maxLength={140}
                className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 focus:outline-none"
              />
            </div>
            <div className="text-sm text-white/50">
              Contrat NUR :{" "}
              <a className="underline" href={`https://bscscan.com/address/${NUR_CONTRACT}`} target="_blank" rel="noreferrer">
                {short(NUR_CONTRACT)}
              </a>
            </div>
          </div>
        </div>

        {/* QR + Actions */}
        <div className="p-5 rounded-xl border border-white/10">
          <h3 className="text-xl font-semibold">2) QR</h3>

          {/* Switch QR */}
          <div className="mt-3 inline-flex rounded-lg border border-white/10 overflow-hidden">
            <button
              onClick={() => setQrMode("link")}
              className={`px-3 py-2 text-sm ${qrMode === "link" ? "bg-white/10" : "hover:bg-white/5"}`}
            >
              QR Lien (HTTPS)
            </button>
            <button
              onClick={() => setQrMode("universal")}
              className={`px-3 py-2 text-sm ${qrMode === "universal" ? "bg-white/10" : "hover:bg-white/5"}`}
            >
              QR Universel (adresse)
            </button>
            <button
              onClick={() => setQrMode("eip681")}
              className={`px-3 py-2 text-sm ${qrMode === "eip681" ? "bg-white/10" : "hover:bg-white/5"}`}
            >
              QR Avancé (EIP-681)
            </button>
          </div>

          <div className="mt-4 flex flex-col items-center gap-4">
            <canvas ref={canvasRef} className="rounded-lg border border-white/10 bg-white p-2" />
            <div className="text-center text-sm text-white/60">
              {qrMode === "link" && "Scanne avec l’appareil photo : ouvre cette même page /pay avec to/amount pré-remplis."}
              {qrMode === "universal" && "Scanne dans n’importe quel wallet : écran d’envoi vers l’adresse (choisir NUR + saisir le montant)."}
              {qrMode === "eip681" && "Wallets compatibles uniquement : prépare un transfer() du token NUR (BSC #56)."}
            </div>
          </div>

          <div className="mt-6 space-y-2 text-sm">
            <Row k="Réseau" v="BNB Smart Chain (56)" />
            <Row k="Token (hint)" v={short(NUR_CONTRACT)} link={`https://bscscan.com/address/${NUR_CONTRACT}`} />
            <Row k="Destinataire" v={short(recipient || "—")} />
            <Row k="Montant (NUR)" v={amount || "—"} />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <button onClick={() => copy(shareLink)} className="px-3 py-2 rounded-lg border border-white/10 hover:bg-white/10 text-sm" disabled={!shareLink}>
              Copier le lien (HTTPS)
            </button>
            <button onClick={() => copy(eip681)} className="px-3 py-2 rounded-lg border border-white/10 hover:bg-white/10 text-sm" disabled={!eip681}>
              Copier lien EIP-681
            </button>
          </div>
        </div>
      </section>

      {/* AIDE */}
      <section className="border-t border-white/10 pt-8">
        <h3 className="text-xl font-semibold mb-2">Conseils</h3>
        <ul className="list-disc ml-5 space-y-2 text-white/75">
          <li><strong>QR Lien (HTTPS)</strong> = le plus universel (ouvre la page /pay pré-remplie).</li>
          <li><strong>QR Universel (adresse)</strong> = compatible 100% wallets, mais montant non pré-rempli.</li>
          <li><strong>QR Avancé (EIP-681)</strong> = support partiel selon les wallets.</li>
          <li>Ajoute d’abord le réseau <strong>BSC</strong> à ton wallet si besoin (bouton en haut).</li>
        </ul>
      </section>
    </div>
  );
}

// Désactive le SSR pour cette page (évite les erreurs "new URL", "window", etc.)
function Pay() { return <PayInner />; }
export default dynamic(() => Promise.resolve(Pay), { ssr: false });

function Row({ k, v, link }) {
  const body = <span className="font-mono">{v}</span>;
  return (
    <div className="flex justify-between gap-4">
      <span className="text-white/50">{k}</span>
      {link ? (
        <a href={link} target="_blank" rel="noreferrer" className="underline">
          {body}
        </a>
      ) : body}
    </div>
  );
}
