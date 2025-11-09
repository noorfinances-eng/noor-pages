// pages/merchant.js
import { useState } from "react";
import QRCode from "qrcode";

const TOKEN_ADDRESS = "0xA20212290866C8A804a89218c8572F28C507b401"; // NOORTokenV2
const CHAIN_ID_HEX = "0x38"; // 56

export default function MerchantLite() {
  const [amount, setAmount] = useState("");
  const [label, setLabel] = useState("");
  const [qr, setQr] = useState("");
  const [loading, setLoading] = useState(false);
  const wallet = "0x2538398B396bd16370aFBDaF42D09e637a86C3AC"; // réception

  async function addBSC() {
    try {
      if (!window.ethereum) throw new Error("Aucun wallet détecté.");
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [{
          chainId: CHAIN_ID_HEX,
          chainName: "BNB Smart Chain",
          nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
          rpcUrls: ["https://bsc-dataseed.binance.org/"],
          blockExplorerUrls: ["https://bscscan.com"],
        }],
      });
    } catch (e) { alert(e.message || e); }
  }

  async function addNUR() {
    try {
      if (!window.ethereum) throw new Error("Aucun wallet détecté.");
      await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: { address: TOKEN_ADDRESS, symbol: "NUR", decimals: 18 },
        },
      });
    } catch (e) { alert(e.message || e); }
  }

  const generateQr = async () => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) return;
    setLoading(true);
    const text = label ? encodeURIComponent(label) : "NOOR Payment";
    const url = `ethereum:${wallet}?chain_id=56&value=${amount}&label=${text}`;
    const dataUrl = await QRCode.toDataURL(url);
    setQr(dataUrl);
    setLoading(false);
  };

  return (
    <div className="text-center space-y-10 relative">
      <h2 className="text-4xl font-semibold">🏪 Recevoir un paiement NOOR</h2>
      <p className="text-white/70 max-w-lg mx-auto">
        Créez un QR à partager : vos clients scannent avec leur wallet et paient en secondes.
      </p>

      <div className="flex items-center justify-center gap-3">
        <button onClick={addBSC} className="btn-gold">➕ Add BSC (56)</button>
        <button onClick={addNUR} className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10">➕ Add NUR</button>
      </div>

      <div className="flex flex-col items-center gap-3">
        <input
          type="text"
          placeholder="Description (optionnel)"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="px-4 py-2 rounded-lg text-black w-64 text-center"
        />
        <input
          type="number"
          placeholder="Montant (NUR)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="px-4 py-2 rounded-lg text-black w-60 text-center"
        />
        <button
          onClick={generateQr}
          disabled={loading}
          className="px-6 py-2 rounded-lg bg-gold text-black font-semibold hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Création..." : "Générer QR"}
        </button>
      </div>

      {qr && (
        <div className="mt-8">
          <p className="text-white/70 mb-3">QR de paiement :</p>
          <img src={qr} alt="NOOR Merchant QR" className="mx-auto w-48 h-48" />
          <p className="text-xs text-white/50 mt-2">
            Montant : {amount} NUR — Réseau : BSC (56)
          </p>
        </div>
      )}

      {/* Bulle d’aide latérale */}
      <div className="fixed right-4 bottom-20 bg-white/10 border border-white/20 backdrop-blur-md px-5 py-3 rounded-2xl text-sm text-white/80 w-64 shadow-lg">
        <p>
          🛈 <strong>Comment encaisser ?</strong><br />
          1️⃣ Saisissez le montant.<br />
          2️⃣ Cliquez “Générer QR”.<br />
          3️⃣ Montrez le QR au client.
        </p>
      </div>
    </div>
  );
}
