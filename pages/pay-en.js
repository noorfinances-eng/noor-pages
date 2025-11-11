// pages/pay-en.js
import { useEffect, useState } from "react";
import QRCode from "qrcode";

const DEST = "0x2538398B396bd16370aFBDaF42D09e637a86C3AC"; // NOOR receive address
const NUR_TOKEN = "0xA20212290866C8A804a89218c8572F28C507b401"; // NOOR (NUR) on BSC
const CHAIN_ID_HEX = "0x38"; // 56

const BSC_PARAMS = {
  chainId: CHAIN_ID_HEX,
  chainName: "BNB Smart Chain",
  nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
  rpcUrls: ["https://bsc-dataseed.binance.org", "https://bsc-dataseed1.binance.org"],
  blockExplorerUrls: ["https://bscscan.com"],
};

function short(a) {
  if (!a || a.length < 12) return a || "";
  return `${a.slice(0, 6)}…${a.slice(-4)}`;
}

export default function PaySimpleEN() {
  const [address, setAddress] = useState(DEST);
  const [qr, setQr] = useState("");

  useEffect(() => {
    async function gen() {
      try {
        if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
          setQr("");
          return;
        }
        const dataUrl = await QRCode.toDataURL(address, { margin: 1, scale: 6 });
        setQr(dataUrl);
      } catch {
        setQr("");
      }
    }
    gen();
  }, [address]);

  function copy(txt) {
    navigator.clipboard?.writeText(txt).then(() => alert("Copied!"));
  }

  async function addBSC() {
    if (!window?.ethereum) return alert("Open this page in MetaMask (mobile) or install MetaMask.");
    try {
      await window.ethereum.request({ method: "wallet_switchEthereumChain", params: [{ chainId: CHAIN_ID_HEX }] });
      alert("BNB Smart Chain activated.");
    } catch {
      await window.ethereum.request({ method: "wallet_addEthereumChain", params: [BSC_PARAMS] });
      alert("BNB Smart Chain added.");
    }
  }

  async function addNUR() {
    if (!window?.ethereum) return alert("Open this page in MetaMask (mobile) or install MetaMask.");
    try {
      const ok = await window.ethereum.request({
        method: "wallet_watchAsset",
        params: { type: "ERC20", options: { address: NUR_TOKEN, symbol: "NUR", decimals: 18 } },
      });
      if (ok) alert("NUR token added to your wallet.");
    } catch {
      alert("Unable to add NUR automatically. You can add it manually.");
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-3xl font-semibold mb-1">Pay — NOOR (Lite Version)</h1>
      <p className="text-white/60 mb-6">
        Scan the QR code below with your wallet. <b>You choose the asset (BNB, NUR, etc.) and the amount directly in your app.</b>
      </p>

      {/* QR + Address */}
      <div className="p-4 rounded-xl border border-white/10">
        <div className="text-sm text-white/60 mb-2">Receiving address</div>
        <div className="flex items-center gap-3">
          <input
            className="w-full rounded-xl bg-black/40 border border-white/10 px-3 py-2"
            value={address}
            onChange={(e) => setAddress(e.target.value.trim())}
            placeholder="0x…"
          />
          <button onClick={() => copy(address)} className="px-3 py-2 rounded-lg border border-white/15 hover:bg-white/10">
            Copy
          </button>
        </div>

        <div className="mt-4 flex flex-col items-center">
          {qr ? (
            <>
              <img src={qr} alt="QR address" className="w-56 h-56 rounded-lg border border-white/10" />
              <p className="text-xs text-white/40 mt-2">
                Open your wallet (MetaMask, Trust, Rabby…) → <b>Scanner</b> → choose asset & amount.
              </p>
            </>
          ) : (
            <div className="text-sm text-white/60">Enter a valid address (0x…)</div>
          )}
        </div>
      </div>

      {/* Help */}
      <div className="mt-6 grid gap-4">
        <div className="p-4 rounded-xl border border-white/10">
          <div className="font-semibold">💡 Connect to BNB Smart Chain (chainId 56)</div>
          <p className="text-sm text-white/70 mt-1">
            If your wallet isn’t on BNB Smart Chain, click here to add or switch automatically.
          </p>
          <div className="mt-3 flex flex-wrap gap-3">
            <button onClick={addBSC} className="px-4 py-2 rounded-lg border border-white/15 hover:bg-white/10">
              Add / switch to BSC (56)
            </button>
            <a href="https://bscscan.com" target="_blank" rel="noreferrer" className="px-4 py-2 rounded-lg border border-white/15 hover:bg-white/10">
              Open BscScan
            </a>
          </div>
          <ul className="mt-3 text-xs text-white/50 list-disc pl-5 space-y-1">
            <li>Network must show <b>BNB Smart Chain (Mainnet)</b>.</li>
            <li>You need a little <b>BNB</b> for fees (e.g., 0.002).</li>
          </ul>
        </div>

        <div className="p-4 rounded-xl border border-white/10">
          <div className="font-semibold">🪙 Add NUR token</div>
          <p className="text-sm text-white/70 mt-1">To view and send NUR easily, add the token contract to your wallet.</p>
          <div className="mt-3 flex flex-wrap gap-3">
            <button onClick={addNUR} className="px-4 py-2 rounded-lg border border-white/15 hover:bg-white/10">
              Add NUR automatically
            </button>
            <button onClick={() => copy(NUR_TOKEN)} className="px-4 py-2 rounded-lg border border-white/15 hover:bg-white/10">
              Copy NUR address
            </button>
          </div>
          <ul className="mt-3 text-xs text-white/50 list-disc pl-5 space-y-1">
            <li>NUR address: <span className="font-mono">{short(NUR_TOKEN)}</span> (18 decimals)</li>
            <li>Network: <b>BNB Smart Chain (56)</b></li>
          </ul>
        </div>
      </div>

      {/* Tips */}
      <div className="mt-6 p-4 rounded-xl border border-white/10">
        <div className="font-semibold mb-1">Usage tips</div>
        <ul className="text-sm text-white/70 list-disc pl-5 space-y-1">
          <li>The QR contains <b>only the address</b>. Choose <b>asset</b> and <b>amount</b> inside your wallet.</li>
          <li>For <b>NUR</b> transfers, add the token first.</li>
          <li>If you see “network not found”, use <b>Add / switch to BSC (56)</b>.</li>
        </ul>
      </div>
    </div>
  );
}
