// pages/pay.js
import { useEffect, useState } from "react";
import QRCode from "qrcode";

const DEST = "0x2538398B396bd16370aFBDaF42D09e637a86C3AC"; // Adresse de réception (projet NOOR)
const NUR_TOKEN = "0xA20212290866C8A804a89218c8572F28C507b401"; // Contrat NOOR (NUR) sur BSC
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

export default function PaySimple() {
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
    navigator.clipboard?.writeText(txt).then(() => alert("Copié !"));
  }

  async function addBSC() {
    if (!window?.ethereum) return alert("Ouvre cette page dans MetaMask (mobile) ou installe MetaMask.");
    try {
      await window.ethereum.request({ method: "wallet_switchEthereumChain", params: [{ chainId: CHAIN_ID_HEX }] });
      alert("Réseau BNB Smart Chain activé.");
    } catch {
      await window.ethereum.request({ method: "wallet_addEthereumChain", params: [BSC_PARAMS] });
      alert("Réseau BNB Smart Chain ajouté.");
    }
  }

  async function addNUR() {
    if (!window?.ethereum) return alert("Ouvre cette page dans MetaMask (mobile) ou installe MetaMask.");
    try {
      const ok = await window.ethereum.request({
        method: "wallet_watchAsset",
        params: { type: "ERC20", options: { address: NUR_TOKEN, symbol: "NUR", decimals: 18 } },
      });
      if (ok) alert("Token NUR ajouté à ton wallet.");
    } catch {
      alert("Impossible d’ajouter NUR. Tu peux le faire manuellement avec l’adresse du contrat.");
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-3xl font-semibold mb-1">Pay — NOOR (Version Lite)</h1>
      <p className="text-white/60 mb-6">
        Scanne le QR ci-dessous avec ton wallet. **Tu choisis le montant et la crypto (BNB, NUR, etc.) directement dans l’app.**
      </p>

      {/* Bloc adresse + QR */}
      <div className="p-4 rounded-xl border border-white/10">
        <div className="text-sm text-white/60 mb-2">Adresse de réception</div>
        <div className="flex items-center gap-3">
          <input
            className="w-full rounded-xl bg-black/40 border border-white/10 px-3 py-2"
            value={address}
            onChange={(e) => setAddress(e.target.value.trim())}
            placeholder="0x…"
          />
          <button
            onClick={() => copy(address)}
            className="px-3 py-2 rounded-lg border border-white/15 hover:bg-white/10"
          >
            Copier
          </button>
        </div>

        <div className="mt-4 flex flex-col items-center">
          {qr ? (
            <>
              <img src={qr} alt="QR address" className="w-56 h-56 rounded-lg border border-white/10" />
              <p className="text-xs text-white/40 mt-2">
                Ouvre ton wallet (MetaMask, Trust, Rabby…) → **Scanner** → choisis l’actif et le montant.
              </p>
            </>
          ) : (
            <div className="text-sm text-white/60">Entre une adresse valide (0x…)</div>
          )}
        </div>
      </div>

      {/* Aides rapides */}
      <div className="mt-6 grid gap-4">
        <div className="p-4 rounded-xl border border-white/10">
          <div className="font-semibold">💡 Se connecter au réseau BNB (chainId 56)</div>
          <p className="text-sm text-white/70 mt-1">
            Si ton wallet n’est pas sur BNB Smart Chain, clique ici pour l’ajouter automatiquement.
          </p>
          <div className="mt-3 flex flex-wrap gap-3">
            <button onClick={addBSC} className="px-4 py-2 rounded-lg border border-white/15 hover:bg-white/10">
              Ajouter / basculer vers BSC (56)
            </button>
            <a
              href="https://bscscan.com"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-lg border border-white/15 hover:bg-white/10"
            >
              Ouvrir BscScan
            </a>
          </div>
          <ul className="mt-3 text-xs text-white/50 list-disc pl-5 space-y-1">
            <li>Le réseau doit afficher **BNB Smart Chain (Mainnet)** dans le wallet.</li>
            <li>Tu dois avoir un peu de **BNB** pour les frais (ex. 0.002).</li>
          </ul>
        </div>

        <div className="p-4 rounded-xl border border-white/10">
          <div className="font-semibold">🪙 Ajouter le token NUR</div>
          <p className="text-sm text-white/70 mt-1">
            Pour voir et envoyer tes NUR facilement, ajoute le contrat dans ton wallet.
          </p>
          <div className="mt-3 flex flex-wrap gap-3">
            <button onClick={addNUR} className="px-4 py-2 rounded-lg border border-white/15 hover:bg-white/10">
              Ajouter NUR automatiquement
            </button>
            <button onClick={() => copy(NUR_TOKEN)} className="px-4 py-2 rounded-lg border border-white/15 hover:bg-white/10">
              Copier l’adresse NUR
            </button>
          </div>
          <ul className="mt-3 text-xs text-white/50 list-disc pl-5 space-y-1">
            <li>Adresse NUR : <span className="font-mono">{short(NUR_TOKEN)}</span> (18 décimales)</li>
            <li>Réseau : **BNB Smart Chain (56)**</li>
          </ul>
        </div>
      </div>

      {/* Conseils simples */}
      <div className="mt-6 p-4 rounded-xl border border-white/10">
        <div className="font-semibold mb-1">Conseils d’usage</div>
        <ul className="text-sm text-white/70 list-disc pl-5 space-y-1">
          <li>Le QR contient **uniquement l’adresse**. Tu choisis **l’actif (BNB/NUR/etc.)** et le **montant** dans ton wallet.</li>
          <li>Pour envoyer des **NUR**, ajoute d’abord le token dans ton wallet.</li>
          <li>Si ton wallet affiche “réseau introuvable”, utilise le bouton **Ajouter / basculer vers BSC (56)**.</li>
        </ul>
      </div>
    </div>
  );
}
