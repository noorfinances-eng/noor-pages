// pages/pay.js
import { useState } from "react";
import QRCode from "qrcode";

export default function PayLite() {
  const [amount, setAmount] = useState("");
  const [qr, setQr] = useState("");
  const [loading, setLoading] = useState(false);
  const receiver = "0x2538398B396bd16370aFBDaF42D09e637a86C3AC"; // adresse fondatrice

  const generateQr = async () => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) return;
    setLoading(true);
    const url = `ethereum:${receiver}?chain_id=56&value=${amount}`;
    const dataUrl = await QRCode.toDataURL(url);
    setQr(dataUrl);
    setLoading(false);
  };

  return (
    <div className="text-center space-y-10">
      <h2 className="text-4xl font-semibold">💡 Payer avec NOOR (NUR)</h2>
      <p className="text-white/70 max-w-lg mx-auto">
        Entrez un montant en NUR, cliquez sur <strong>Générer QR</strong>, puis scannez avec MetaMask.
      </p>

      <div className="flex flex-col items-center gap-4">
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
          <p className="text-white/70 mb-3">Scannez ce code avec MetaMask :</p>
          <img src={qr} alt="QR NOOR" className="mx-auto w-48 h-48" />
          <p className="text-xs text-white/50 mt-2">
            Adresse : {receiver.slice(0, 6)}...{receiver.slice(-4)} — Réseau : BSC (56)
          </p>
        </div>
      )}
    </div>
  );
}
