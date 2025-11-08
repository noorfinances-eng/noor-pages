// pages/pay.js
import { useEffect, useMemo, useRef, useState } from "react";
import QRCode from "qrcode";

const NUR_CONTRACT = "0xA20212290866C8A804a89218c8572F28C507b401"; // NOORTokenV2
const BSC_CHAIN_ID_DEC = 56;

export default function Pay() {
  // Champs du formulaire "Request NOOR"
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState(""); // en NUR (décimaux humains)
  const [note, setNote] = useState("");

  // Canvas pour le QR
  const canvasRef = useRef(null);

  // Conversion utils
  const toWei = (numString) => {
    // 18 décimales
    if (!numString || isNaN(Number(numString))) return "0";
    // évite la perte de précision avec des entrées simples
    const [intPart, fracPart = ""] = numString.split(".");
    const frac = (fracPart + "000000000000000000").slice(0, 18); // pad à 18
    return `${intPart || "0"}${frac}`.replace(/^0+(?=\d)/, "") || "0";
  };

  // Construire une payload EIP-681 lisible par les wallets compatibles
  // format: ethereum:<token>/transfer?address=<recipient>&uint256=<amountWei>&chain_id=56
  const eip681 = useMemo(() => {
    const amtWei = toWei(amount);
    const addr = (recipient || "").trim();
    if (!addr) return "";
    return `ethereum:${NUR_CONTRACT}/transfer?address=${addr}&uint256=${amtWei}&chain_id=${BSC_CHAIN_ID_DEC}`;
  }, [recipient, amount]);

  // Contenu encodé dans le QR (combo pratique : EIP681 + meta)
  const qrPayload = useMemo(() => {
    // Petit JSON pour bag de secours si le wallet ne parse pas EIP-681
    const meta = {
      token: NUR_CONTRACT,
      chainId: BSC_CHAIN_ID_DEC,
      recipient: (recipient || "").trim(),
      amount: amount || "0",
      amountWei: toWei(amount || "0"),
      note: (note || "").slice(0, 140)
    };
    // On concatène EIP681 + JSON pour maximiser compatibilité lecteurs
    return `EIP681:${eip681}\nMETA:${JSON.stringify(meta)}`;
  }, [eip681, recipient, amount, note]);

  // Dessiner le QR à chaque changement
  useEffect(() => {
    if (!canvasRef.current) return;
    (async () => {
      try {
        await QRCode.toCanvas(canvasRef.current, qrPayload || "NOOR", {
          errorCorrectionLevel: "M",
          margin: 2,
          scale: 6
        });
      } catch {
        // ignore rendu si erreur
      }
    })();
  }, [qrPayload]);

  // Aide : ajouter BSC à MetaMask
  const addBscToWallet = async () => {
    if (!window.ethereum) {
      alert("Wallet non détecté (MetaMask, Rabby, etc.).");
      return;
    }
    try {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [{
          chainId: "0x38", // 56 en hex
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
    } catch (e) {
      console.error(e);
      alert("Impossible d'ajouter BSC au wallet.");
    }
  };

  const copy = async (txt) => {
    try {
      await navigator.clipboard.writeText(txt);
      alert("Copié !");
    } catch {}
  };

  return (
    <div className="space-y-10">
      {/* HERO */}
      <section className="text-center">
        <h2 className="text-4xl md:text-5xl font-semibold">Pay with NOOR</h2>
        <p className="mt-3 text-white/70 max-w-2xl mx-auto">
          Génère un QR pour recevoir des <span className="text-gold font-medium">NUR</span> (BSC • ERC-20).
          Le QR encode une requête <span className="font-mono">transfer()</span> vers le contrat officiel.
        </p>
        <div className="mt-6">
          <button onClick={addBscToWallet} className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10">
            Ajouter BSC à MetaMask
          </button>
        </div>
      </section>

      {/* FORM */}
      <section className="grid gap-6 md:grid-cols-2">
        <div className="p-5 rounded-xl border border-white/10">
          <h3 className="text-xl font-semibold">1) Paramètres de la demande</h3>
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm text-white/60 mb-1">Adresse destinataire (ton wallet BSC)</label>
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
              <label className="block text-sm text-white/60 mb-1">Note (optionnel, locale)</label>
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Référence interne (ex: facture #123)"
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

        <div className="p-5 rounded-xl border border-white/10">
          <h3 className="text-xl font-semibold">2) QR de paiement</h3>
          <div className="mt-4 flex flex-col items-center gap-4">
            <canvas ref={canvasRef} className="rounded-lg border border-white/10 bg-white p-2" />
            <div className="text-center text-sm text-white/60">
              Scanne avec un wallet compatible pour préparer le transfert ERC-20.
            </div>
          </div>
          <div className="mt-6 space-y-2 text-sm">
            <Row k="Réseau" v="BNB Smart Chain (56)" />
            <Row k="Token" v={short(NUR_CONTRACT)} link={`https://bscscan.com/address/${NUR_CONTRACT}`} />
            <Row k="Destinataire" v={short(recipient || "—")} />
            <Row k="Montant (NUR)" v={amount || "—"} />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <button onClick={() => copy(recipient)} className="px-3 py-2 rounded-lg border border-white/10 hover:bg-white/10 text-sm">
              Copier l’adresse
            </button>
            <button onClick={() => copy(eip681)} className="px-3 py-2 rounded-lg border border-white/10 hover:bg-white/10 text-sm">
              Copier le lien EIP-681
            </button>
          </div>
        </div>
      </section>

      {/* AIDE */}
      <section className="border-t border-white/10 pt-8">
        <h3 className="text-xl font-semibold mb-2">Comment ça marche ?</h3>
        <ol className="list-decimal ml-5 space-y-2 text-white/75">
          <li>Entre **ton adresse BSC** (destinataire) et le **montant NUR**.</li>
          <li>Le QR encode une requête <span className="font-mono">transfer()</span> vers le **contrat NUR officiel**.</li>
          <li>Ton payeur scanne → son wallet prépare un transfert ERC-20 (réseau **BSC #56**).</li>
          <li>Tu peux aussi **copier le lien EIP-681** et l’envoyer par message.</li>
        </ol>
        <p className="mt-3 text-white/60 text-sm">
          Astuce : ajoute d’abord BSC à ton wallet (bouton en haut) si ce n’est pas déjà fait.
        </p>
      </section>
    </div>
  );
}

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
function short(a){ if(!a) return "—"; return `${a.slice(0,6)}…${a.slice(-4)}`; }
