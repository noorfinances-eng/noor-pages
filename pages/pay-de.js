// pages/pay-de.js
import { useEffect, useState } from "react";
import QRCode from "qrcode";

const DEST = "0x2538398B396bd16370aFBDaF42D09e637a86C3AC"; // Empfangsadresse (NOOR)
const NUR_TOKEN = "0xA20212290866C8A804a89218c8572F28C507b401"; // NOOR (NUR) auf BSC
const CHAIN_ID_HEX = "0x38"; // 56

const BSC_PARAMS = {
  chainId: CHAIN_ID_HEX,
  chainName: "BNB Smart Chain",
  nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
  rpcUrls: ["https://bsc-dataseed.binance.org"],
  blockExplorerUrls: ["https://bscscan.com"],
};

function short(a) {
  if (!a || a.length < 12) return a || "";
  return `${a.slice(0, 6)}…${a.slice(-4)}`;
}

export default function PaySimpleDE() {
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
    navigator.clipboard?.writeText(txt).then(() => alert("Kopiert!"));
  }

  async function addBSC() {
    if (!window?.ethereum) return alert("Öffne diese Seite in MetaMask (mobil) oder installiere MetaMask.");
    try {
      await window.ethereum.request({ method: "wallet_switchEthereumChain", params: [{ chainId: CHAIN_ID_HEX }] });
      alert("BNB Smart Chain aktiviert.");
    } catch {
      await window.ethereum.request({ method: "wallet_addEthereumChain", params: [BSC_PARAMS] });
      alert("BNB Smart Chain hinzugefügt.");
    }
  }

  async function addNUR() {
    if (!window?.ethereum) return alert("Öffne diese Seite in MetaMask (mobil) oder installiere MetaMask.");
    try {
      const ok = await window.ethereum.request({
        method: "wallet_watchAsset",
        params: { type: "ERC20", options: { address: NUR_TOKEN, symbol: "NUR", decimals: 18 } },
      });
      if (ok) alert("NUR-Token wurde in die Wallet hinzugefügt.");
    } catch {
      alert("NUR konnte nicht automatisch hinzugefügt werden.");
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-3xl font-semibold mb-1">Pay — NOOR (Lite-Version)</h1>
      <p className="text-white/60 mb-6">
        Scanne den QR-Code unten mit deiner Wallet. <b>Du wählst den Asset (BNB, NUR usw.) und den Betrag direkt in der App.</b>
      </p>

      <div className="p-4 rounded-xl border border-white/10">
        <div className="text-sm text-white/60 mb-2">Empfangsadresse</div>
        <div className="flex items-center gap-3">
          <input
            className="w-full rounded-xl bg-black/40 border border-white/10 px-3 py-2"
            value={address}
            onChange={(e) => setAddress(e.target.value.trim())}
            placeholder="0x…"
          />
          <button onClick={() => copy(address)} className="px-3 py-2 rounded-lg border border-white/15 hover:bg-white/10">
            Kopieren
          </button>
        </div>

        <div className="mt-4 flex flex-col items-center">
          {qr ? (
            <>
              <img src={qr} alt="QR-Adresse" className="w-56 h-56 rounded-lg border border-white/10" />
              <p className="text-xs text-white/40 mt-2">
                Öffne deine Wallet (MetaMask, Trust, Rabby…) → <b>Scanner</b> → Asset & Betrag wählen.
              </p>
            </>
          ) : (
            <div className="text-sm text-white/60">Gib eine gültige Adresse ein (0x…)</div>
          )}
        </div>
      </div>

      {/* Hilfe */}
      <div className="mt-6 grid gap-4">
        <div className="p-4 rounded-xl border border-white/10">
          <div className="font-semibold">💡 Verbindung zum BNB-Netzwerk (chainId 56)</div>
          <p className="text-sm text-white/70 mt-1">
            Wenn deine Wallet nicht auf BNB Smart Chain ist, klicke hier zum automatischen Hinzufügen/Umschalten.
          </p>
          <div className="mt-3 flex flex-wrap gap-3">
            <button onClick={addBSC} className="px-4 py-2 rounded-lg border border-white/15 hover:bg-white/10">
              BSC (56) hinzufügen / wechseln
            </button>
            <a href="https://bscscan.com" target="_blank" rel="noreferrer" className="px-4 py-2 rounded-lg border border-white/15 hover:bg-white/10">
              BscScan öffnen
            </a>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-white/10">
          <div className="font-semibold">🪙 NUR-Token hinzufügen</div>
          <p className="text-sm text-white/70 mt-1">Um NUR einfach zu sehen und zu senden, füge den Vertrag zu deiner Wallet hinzu.</p>
          <div className="mt-3 flex flex-wrap gap-3">
            <button onClick={addNUR} className="px-4 py-2 rounded-lg border border-white/15 hover:bg-white/10">
              NUR automatisch hinzufügen
            </button>
            <button onClick={() => copy(NUR_TOKEN)} className="px-4 py-2 rounded-lg border border-white/15 hover:bg-white/10">
              NUR-Adresse kopieren
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
