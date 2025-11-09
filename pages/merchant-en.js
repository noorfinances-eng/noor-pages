// pages/merchant-en.js
import { useState } from "react";
import QRCode from "qrcode";

export default function MerchantLiteEN() {
  const [amount, setAmount] = useState("");
  const [label, setLabel] = useState("");
  const [qr, setQr] = useState("");
  const [loading, setLoading] = useState(false);
  const wallet = "0x2538398B396bd16370aFBDaF42D09e637a86C3AC"; // receive wallet

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
      <h2 className="text-4xl font-semibold">🏪 Receive a NOOR payment</h2>
      <p className="text-white/70 max-w-lg mx-auto">
        Create a QR to share: customers scan with their wallet and pay in seconds.
      </p>

      <div className="flex flex-col items-center gap-3">
        <input
          type="text"
          placeholder="Description (optional)"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="px-4 py-2 rounded-lg text-black w-64 text-center"
        />
        <input
          type="number"
          placeholder="Amount (NUR)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="px-4 py-2 rounded-lg text-black w-60 text-center"
        />
        <button
          onClick={generateQr}
          disabled={loading}
          className="px-6 py-2 rounded-lg bg-gold text-black font-semibold hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Generate QR"}
        </button>
      </div>

      {qr && (
        <div className="mt-8">
          <p className="text-white/70 mb-3">Payment QR:</p>
          <img src={qr} alt="NOOR Merchant QR" className="mx-auto w-48 h-48" />
          <p className="text-xs text-white/50 mt-2">
            Amount: {amount} NUR — Network: BSC (56)
          </p>
        </div>
      )}

      {/* Help bubble (side) */}
      <div className="fixed right-4 bottom-20 bg-white/10 border border-white/20 backdrop-blur-md px-5 py-3 rounded-2xl text-sm text-white/80 w-64 shadow-lg">
        <p>
          🛈 <strong>How to get paid?</strong><br />
          1️⃣ Enter the amount.<br />
          2️⃣ Click “Generate QR”.<br />
          3️⃣ Show the QR to your client.
        </p>
      </div>
    </div>
  );
}
