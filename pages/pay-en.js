// pages/pay-en.js
import { useState } from "react";
import QRCode from "qrcode";

const TOKEN_ADDRESS = "0xA20212290866C8A804a89218c8572F28C507b401";
const CHAIN_ID_HEX = "0x38";

export default function PayLiteEN() {
  const [amount, setAmount] = useState("");
  const [qr, setQr] = useState("");
  const [loading, setLoading] = useState(false);
  const receiver = "0x2538398B396bd16370aFBDaF42D09e637a86C3AC";

  async function addBSC() {
    try {
      if (!window.ethereum) throw new Error("No wallet detected.");
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
      if (!window.ethereum) throw new Error("No wallet detected.");
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
    const url = `ethereum:${receiver}?chain_id=56&value=${amount}`;
    const dataUrl = await QRCode.toDataURL(url);
    setQr(dataUrl);
    setLoading(false);
  };

  return (
    <div className="text-center space-y-10 relative">
      <h2 className="text-4xl font-semibold">💡 Pay with NOOR (NUR)</h2>
      <p className="text-white/70 max-w-lg mx-auto">
        Enter an amount in NUR, click <strong>Generate QR</strong>, then scan with MetaMask.
      </p>

      <div className="flex items-center justify-center gap-3">
        <button onClick={addBSC} className="btn-gold">➕ Add BSC (56)</button>
        <button onClick={addNUR} className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10">➕ Add NUR</button>
      </div>

      <div className="flex flex-col items-center gap-4">
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
          <p className="text-white/70 mb-3">Scan this code with MetaMask:</p>
          <img src={qr} alt="NOOR QR" className="mx-auto w-48 h-48" />
          <p className="text-xs text-white/50 mt-2">
            Address: {receiver.slice(0, 6)}...{receiver.slice(-4)} — Network: BSC (56)
          </p>
        </div>
      )}

      {/* Help bubble (side) */}
      <div className="fixed right-4 bottom-20 bg-white/10 border border-white/20 backdrop-blur-md px-5 py-3 rounded-2xl text-sm text-white/80 w-64 shadow-lg">
        <p>
          🛈 <strong>How to pay?</strong><br />
          1️⃣ Open MetaMask (BSC).<br />
          2️⃣ Scan the QR.<br />
          3️⃣ Confirm the transfer.
        </p>
      </div>
    </div>
  );
}
