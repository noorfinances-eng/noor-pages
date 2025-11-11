// pages/pay.js
import { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";

const CHAIN_ID = 56; // BNB Smart Chain Mainnet
const CHAIN_ID_HEX = "0x38";

// ↓ Adresse NUR (token) et une adresse de test par défaut (remplace si tu veux)
const NUR_TOKEN = "0xA20212290866C8A804a89218c8572F28C507b401";
const DEFAULT_TO = "0x2538398B396bd16370aFBDaF42D09e637a86C3AC"; // exemple: Owner

// BSC Mainnet params pour MetaMask
const BSC_PARAMS = {
  chainId: CHAIN_ID_HEX,
  chainName: "BNB Smart Chain",
  nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
  rpcUrls: ["https://bsc-dataseed1.binance.org", "https://bsc-dataseed.binance.org"],
  blockExplorerUrls: ["https://bscscan.com"],
};

// parse montant décimal (string) -> BigInt en 18 décimales (wei-like)
function toUnits(amountStr, decimals = 18) {
  const clean = (amountStr || "").trim().replace(",", "."); // support virgule
  if (!clean || isNaN(Number(clean))) return 0n;
  const [intPart, fracPartRaw = ""] = clean.split(".");
  const fracPart = (fracPartRaw + "0".repeat(decimals)).slice(0, decimals);
  const s = `${intPart || "0"}${fracPart}`;
  return BigInt(s.replace(/^0+/, "") || "0");
}

// build lien EIP-681
// - natif BNB:  ethereum:<to>@56?value=<wei>
// - token ERC-20: ethereum:<to>@56/transfer?address=<token>&uint256=<amount>
function buildEip681({ to, chainId, mode, amount, token }) {
  const amt = toUnits(amount, 18).toString();
  const base = `ethereum:${to}@${chainId}`;
  if (mode === "BNB") {
    return `${base}?value=${amt}`;
  }
  // NUR (ERC-20)
  return `${base}/transfer?address=${token}&uint256=${amt}`;
}

export default function PayLite() {
  const [to, setTo] = useState(DEFAULT_TO);
  const [amount, setAmount] = useState(""); // ex: "1.5"
  const [mode, setMode] = useState("NUR"); // "NUR" ou "BNB"
  const [token, setToken] = useState(NUR_TOKEN);
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [deepLink, setDeepLink] = useState("");

  const link = useMemo(
    () => buildEip681({ to, chainId: CHAIN_ID, mode, amount, token }),
    [to, amount, mode, token]
  );

  useEffect(() => {
    setDeepLink(link);
    QRCode.toDataURL(link, { margin: 1, scale: 6 })
      .then(setQrDataUrl)
      .catch(() => setQrDataUrl(""));
  }, [link]);

  async function addNetwork() {
    if (!window.ethereum) return alert("Aucun wallet détecté (MetaMask/Rabby).");
    try {
      // d’abord switch si déjà connu, sinon add
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: CHAIN_ID_HEX }],
      });
    } catch (e) {
      // code 4902 = réseau non ajouté
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [BSC_PARAMS],
      });
    }
    alert("Réseau BNB Smart Chain prêt.");
  }

  async function addNurToken() {
    if (!window.ethereum) return alert("Aucun wallet détecté.");
    try {
      const wasAdded = await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: token,
            symbol: "NUR",
            decimals: 18,
          },
        },
      });
      if (wasAdded) alert("NUR ajouté à votre wallet.");
    } catch {
      alert("Impossible d’ajouter le token NUR.");
    }
  }

  function openInWallet() {
    // Sur mobile, MetaMask intercepte; sur desktop ça peut ouvrir l’app si associée
    window.location.href = deepLink;
  }

  async function copy(text) {
    try {
      await navigator.clipboard.writeText(text);
      alert("Copié !");
    } catch {}
  }

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6">Pay (Lite) — EIP-681</h1>

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
              placeholder={mode === "BNB" ? "ex: 0.02" : "ex: 10"}
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
            <p className="text-xs text-white/40 mt-1">
              Par défaut : {shortAddr(NUR_TOKEN)} — BSC Mainnet.
            </p>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <button onClick={addNetwork} className="px-3 py-2 rounded-lg border border-white/15 hover:bg-white/10">
            Ajouter / basculer vers BSC (56)
          </button>
          {mode === "NUR" && (
            <button onClick={addNurToken} className="px-3 py-2 rounded-lg border border-white/15 hover:bg-white/10">
              Ajouter le token NUR
            </button>
          )}
          <button onClick={() => copy(to)} className="px-3 py-2 rounded-lg border border-white/15 hover:bg-white/10">
            Copier l’adresse
          </button>
        </div>

        <div className="p-4 rounded-xl border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-sm text-white/50">Lien EIP-681 généré</div>
              <div className="text-xs break-all text-white/70">{deepLink}</div>
            </div>
            <button onClick={() => copy(deepLink)} className="px-3 py-1.5 rounded-lg border border-white/15 hover:bg-white/10">
              Copier le lien
            </button>
          </div>

          {qrDataUrl ? (
            <div className="flex flex-col items-center">
              <img
                src={qrDataUrl}
                alt="QR EIP-681"
                className="w-56 h-56 rounded-lg border border-white/10"
              />
              <button
                onClick={openInWallet}
                className="mt-3 px-4 py-2 rounded-lg bg-gold text-black font-medium"
              >
                Ouvrir dans le wallet
              </button>
              <p className="text-xs text-white/40 mt-2">
                MetaMask Mobile : Menu → Scanner un QR.
              </p>
            </div>
          ) : (
            <div className="text-sm text-white/60">
              Entrez une adresse et un montant pour générer le QR.
            </div>
          )}
        </div>

        <Tips />
      </div>
    </div>
  );
}

function shortAddr(a) {
  if (!a || a.length < 10) return a || "";
  return `${a.slice(0, 6)}…${a.slice(-4)}`;
}

function Tips() {
  return (
    <div className="mt-6 text-sm text-white/70 space-y-2">
      <div className="font-semibold">Conseils :</div>
      <ul className="list-disc pl-5 space-y-1">
        <li>Si MetaMask affiche “réseau 56 introuvable”, clique d’abord “Ajouter / basculer vers BSC (56)”.</li>
        <li>Pour NUR, assure-toi d’avoir ajouté le token au wallet (“Ajouter le token NUR”).</li>
        <li>Le QR suit la norme <span className="text-white">EIP-681</span> (universel). Sur desktop, certains wallets préfèrent cliquer “Ouvrir dans le wallet”.</li>
        <li>Montant : décimales supportées (ex: 1.25). Conversion automatique en 18 décimales.</li>
      </ul>
    </div>
  );
}
