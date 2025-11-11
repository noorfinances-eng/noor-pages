// pages/pay.js
import { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";

const CHAIN_ID_DEC = 56;              // BNB Smart Chain (Mainnet)
const CHAIN_ID_HEX = "0x38";
const NUR_TOKEN = "0xA20212290866C8A804a89218c8572F28C507b401"; // NOORTokenV2

// Paramètres réseau pour ajout/switch automatique
const BSC_PARAMS = {
  chainId: CHAIN_ID_HEX,
  chainName: "BNB Smart Chain",
  nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
  rpcUrls: ["https://bsc-dataseed1.binance.org", "https://bsc-dataseed.binance.org"],
  blockExplorerUrls: ["https://bscscan.com"],
};

// Utilitaires
function toUnits(amountStr, decimals = 18) {
  const clean = (amountStr || "").trim().replace(",", ".");
  if (!clean || isNaN(Number(clean))) return 0n;
  const [i, fraw = ""] = clean.split(".");
  const f = (fraw + "0".repeat(decimals)).slice(0, decimals);
  const s = `${i || "0"}${f}`;
  return BigInt(s.replace(/^0+/, "") || "0");
}
function pad32(hexNo0x) {
  return hexNo0x.padStart(64, "0");
}
function strip0x(x) {
  return x.startsWith("0x") ? x.slice(2) : x;
}
function isHexAddress(addr) {
  return /^0x[a-fA-F0-9]{40}$/.test(addr || "");
}
function short(a) {
  if (!a || a.length < 12) return a || "";
  return `${a.slice(0, 6)}…${a.slice(-4)}`;
}

// EIP-681 pour BNB (natif) UNIQUEMENT — MetaMask Mobile gère mieux le natif
function buildEip681BNB({ to, chainId, amount }) {
  const wei = toUnits(amount, 18).toString();
  return `ethereum:${to}@${chainId}?value=${wei}`;
}

// Encodage manuel du call ERC-20 transfer(address,uint256)
// selector = keccak256("transfer(address,uint256)") = 0xa9059cbb
function encodeErc20Transfer(toAddress, amountUnits) {
  const selector = "0xa9059cbb";
  const addr = strip0x(toAddress).toLowerCase();
  const amt = amountUnits.toString(16);
  const data =
    selector +
    pad32(addr) +
    pad32(strip0x("0x" + amt));
  return data;
}

export default function PayLite() {
  // Entrées
  const [to, setTo] = useState("0x2538398B396bd16370aFBDaF42D09e637a86C3AC"); // destinataire par défaut (Owner)
  const [amount, setAmount] = useState(""); // ex: "1.5"
  const [mode, setMode] = useState("NUR"); // "NUR" | "BNB"
  const [token, setToken] = useState(NUR_TOKEN);

  // QR (pour BNB)
  const [qrDataUrl, setQrDataUrl] = useState("");
  const eip681 = useMemo(() => {
    if (!isHexAddress(to) || !amount || Number(amount) <= 0) return "";
    if (mode === "BNB") return buildEip681BNB({ to, chainId: CHAIN_ID_DEC, amount });
    return ""; // pas de QR pour NUR (limitation MetaMask Mobile)
  }, [to, amount, mode]);

  useEffect(() => {
    if (!eip681) {
      setQrDataUrl("");
      return;
    }
    QRCode.toDataURL(eip681, { margin: 1, scale: 6 })
      .then(setQrDataUrl)
      .catch(() => setQrDataUrl(""));
  }, [eip681]);

  // État wallet
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);

  async function ensureEthereum() {
    if (!window?.ethereum) {
      alert("Aucun wallet détecté. Ouvre cette page dans MetaMask (mobile) ou installe MetaMask.");
      throw new Error("no-ethereum");
    }
    return window.ethereum;
  }

  async function connectWallet() {
    try {
      const eth = await ensureEthereum();
      const accs = await eth.request({ method: "eth_requestAccounts" });
      setAccount(accs?.[0] || null);
      const cid = await eth.request({ method: "eth_chainId" });
      setChainId(cid);
    } catch (e) {
      console.error(e);
    }
  }

  async function switchOrAddBSC() {
    const eth = await ensureEthereum();
    try {
      await eth.request({ method: "wallet_switchEthereumChain", params: [{ chainId: CHAIN_ID_HEX }] });
    } catch (e) {
      // 4902 = réseau inconnu → on l'ajoute
      await eth.request({ method: "wallet_addEthereumChain", params: [BSC_PARAMS] });
    }
    setChainId(CHAIN_ID_HEX);
    alert("Réseau BNB Smart Chain prêt.");
  }

  async function addNurToken() {
    try {
      const eth = await ensureEthereum();
      const wasAdded = await eth.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: { address: token, symbol: "NUR", decimals: 18 },
        },
      });
      if (wasAdded) alert("Token NUR ajouté au wallet.");
    } catch (e) {
      console.error(e);
      alert("Impossible d’ajouter NUR. Vérifie l’adresse du token.");
    }
  }

  // Envoi NUR via eth_sendTransaction (appel direct au contrat ERC-20)
  async function sendNur() {
    try {
      if (!isHexAddress(to)) return alert("Adresse destinataire invalide.");
      if (!isHexAddress(token)) return alert("Adresse du token invalide.");
      if (!amount || Number(amount) <= 0) return alert("Montant invalide.");

      const eth = await ensureEthereum();
      // 1) Connexion
      const accs = await eth.request({ method: "eth_requestAccounts" });
      const from = accs?.[0];
      if (!from) return alert("Connexion wallet requise.");

      // 2) Réseau
      try {
        await eth.request({ method: "wallet_switchEthereumChain", params: [{ chainId: CHAIN_ID_HEX }] });
      } catch {
        await eth.request({ method: "wallet_addEthereumChain", params: [BSC_PARAMS] });
      }

      // 3) Encoder l'appel transfer(address,uint256)
      const units = toUnits(amount, 18); // 18 décimales
      const data = encodeErc20Transfer(to, units);

      // 4) Envoyer la tx
      const txHash = await eth.request({
        method: "eth_sendTransaction",
        params: [
          {
            from,
            to: token,       // appel du contrat NUR
            data,            // data encodée
            value: "0x0",
          },
        ],
      });

      alert(`Transaction envoyée.\nHash: ${txHash}\n\nOuvre BscScan pour vérifier.`);
    } catch (e) {
      console.error(e);
      alert("Échec de l’envoi NUR. Vérifie réseau, token, solde NUR et frais BNB.");
    }
  }

  function copy(txt) {
    navigator.clipboard?.writeText(txt).then(() => {
      alert("Copié !");
    });
  }

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-3xl font-semibold mb-1">Pay (Lite) — NOOR</h1>
      <p className="text-white/60 mb-6">
        • <b>BNB</b> : QR universel (EIP-681).&nbsp;
        • <b>NUR</b> : bouton <i>Envoyer NUR</i> (appel direct du wallet).
      </p>

      {/* Connexion / Réseau */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button onClick={connectWallet} className="px-3 py-2 rounded-lg border border-white/15 hover:bg-white/10">
          {account ? `Connecté : ${short(account)}` : "Connecter le wallet"}
        </button>
        <button onClick={switchOrAddBSC} className="px-3 py-2 rounded-lg border border-white/15 hover:bg-white/10">
          Ajouter / basculer vers BSC (56)
        </button>
        <button onClick={() => copy("https://bscscan.com")} className="px-3 py-2 rounded-lg border border-white/15 hover:bg-white/10">
          BscScan
        </button>
      </div>

      {/* Formulaire */}
      <div className="grid gap-4">
        <div>
          <label className="block text-sm text-white/70 mb-1">Destinataire (adresse)</label>
          <input
            className="w-full rounded-xl bg-black/40 border border-white/10 px-3 py-2"
            value={to}
            onChange={(e) => setTo(e.target.value.trim())}
            placeholder="0x…"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-white/70 mb-1">Montant</label>
            <input
              className="w-full rounded-xl bg-black/40 border border-white/10 px-3 py-2"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={mode === "BNB" ? "ex: 0.01" : "ex: 10"}
            />
          </div>
          <div>
            <label className="block text-sm text-white/70 mb-1">Actif</label>
            <select
              className="w-full rounded-xl bg-black/40 border border-white/10 px-3 py-2"
              value={mode}
              onChange={(e) => setMode(e.target.value)}
            >
              <option value="NUR">NUR (ERC-20)</option>
              <option value="BNB">BNB (natif)</option>
            </select>
          </div>
        </div>

        {mode === "NUR" && (
          <div>
            <label className="block text-sm text-white/70 mb-1">Adresse du token (NUR)</label>
            <input
              className="w-full rounded-xl bg-black/40 border border-white/10 px-3 py-2"
              value={token}
              onChange={(e) => setToken(e.target.value.trim())}
              placeholder="0x… (NUR)"
            />
            <div className="flex gap-3 mt-2">
              <button onClick={addNurToken} className="px-3 py-2 rounded-lg border border-white/15 hover:bg-white/10">
                Ajouter le token NUR
              </button>
              <button onClick={() => copy(token)} className="px-3 py-2 rounded-lg border border-white/15 hover:bg-white/10">
                Copier adresse NUR
              </button>
            </div>
            <p className="text-xs text-white/40 mt-2">
              Par défaut : {short(NUR_TOKEN)} — BSC Mainnet (18 décimales).
            </p>
          </div>
        )}
      </div>

      {/* Zone QR / Actions */}
      <div className="mt-6 p-4 rounded-xl border border-white/10">
        {mode === "BNB" ? (
          <>
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-sm text-white/50">Lien EIP-681 (BNB)</div>
                <div className="text-xs break-all text-white/70">{eip681 || "—"}</div>
              </div>
              <button onClick={() => eip681 && copy(eip681)} className="px-3 py-1.5 rounded-lg border border-white/15 hover:bg-white/10">
                Copier
              </button>
            </div>
            {qrDataUrl ? (
              <div className="flex flex-col items-center">
                <img src={qrDataUrl} alt="QR BNB EIP-681" className="w-56 h-56 rounded-lg border border-white/10" />
                <p className="text-xs text-white/40 mt-2">MetaMask Mobile : Menu → Scanner un QR.</p>
              </div>
            ) : (
              <div className="text-sm text-white/60">Saisis une adresse et un montant pour générer le QR BNB.</div>
            )}
          </>
        ) : (
          <>
            <div className="text-sm text-white/60 mb-2">
              Le QR pour tokens ERC-20 n’est pas pris en charge universellement par MetaMask Mobile.
              Utilise le bouton ci-dessous pour envoyer des NUR via ton wallet.
            </div>
            <button
              onClick={sendNur}
              className="px-4 py-2 rounded-lg bg-gold text-black font-medium"
            >
              Envoyer NUR (Wallet)
            </button>
            <p className="text-xs text-white/40 mt-2">
              Astuce : assure-toi d’avoir un peu de BNB pour les frais réseau sur le compte émetteur.
            </p>
          </>
        )}
      </div>

      {/* Conseils */}
      <div className="mt-6 text-sm text-white/70 space-y-2">
        <div className="font-semibold">Conseils :</div>
        <ul className="list-disc pl-5 space-y-1">
          <li>Si MetaMask affiche “réseau 56 introuvable”, clique d’abord “Ajouter / basculer vers BSC (56)”.</li>
          <li>Pour voir ton solde NUR sur mobile, importe le token avec l’adresse du contrat.</li>
          <li>BNB via QR : universel. NUR via bouton : appel direct du contrat (plus fiable sur mobile/desktop).</li>
        </ul>
      </div>
    </div>
  );
}
