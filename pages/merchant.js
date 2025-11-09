// pages/merchant.js
import { useState } from "react";
import QRCode from "qrcode";

export default function MerchantLite() {
  const [amount, setAmount] = useState("");
  const [label, setLabel] = useState("");
  const [qr, setQr] = useState("");
  const [loading, setLoading] = useState(false);
  const wallet = "0x2538398B396bd16370aFBDaF42D09e637a86C3AC"; // ton wallet de réception

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
    <div className="text-center space-y-10">
      <h2 className="text-4xl font-semibold">🏪 Recevoir un paiement NOOR</h2>
      <p className="text-white/70 max-w-lg mx-auto">
        Créez un QR à partager : vos clients pourront payer en scannant avec leur wallet.
      </p>

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
          <p className="text-white/70 mb-3">QR de paiement généré :</p>
          <img src={qr} alt="QR NOOR Merchant" className="mx-auto w-48 h-48" />
          <p className="text-xs text-white/50 mt-2">
            Montant : {amount} NUR — Réseau : BSC (56)
          </p>
        </div>
      )}

      {/* Bandeau d’aide */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-white/10 border border-white/20 backdrop-blur-md px-6 py-3 rounded-2xl text-sm text-white/80 max-w-md">
        <p>
          🛈 <strong>Comment encaisser ?</strong><br />
          1️⃣ Saisissez le montant.<br />
          2️⃣ Cliquez “Générer QR”.<br />
          3️⃣ Montrez le QR au client : il scanne et paie.
        </p>
      </div>
    </div>
  );
}
