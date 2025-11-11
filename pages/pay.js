// pages/pay.js
import { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";

const CHAIN_ID_DEC = 56;              // BNB Smart Chain (Mainnet)
const CHAIN_ID_HEX = "0x38";
const NUR_TOKEN = "0xA20212290866C8A804a89218c8572F28C507b401"; // NOORTokenV2

const BSC_PARAMS = {
  chainId: CHAIN_ID_HEX,
  chainName: "BNB Smart Chain",
  nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
  rpcUrls: ["https://bsc-dataseed1.binance.org", "https://bsc-dataseed.binance.org"],
  blockExplorerUrls: ["https://bscscan.com"],
};

// utils
function toUnits(amountStr, decimals = 18) {
  const clean = (amountStr || "").trim().replace(",", ".");
  if (!clean || isNaN(Number(clean))) return 0n;
  const [i, fraw = ""] = clean.split(".");
  const f = (fraw + "0".repeat(decimals)).slice(0, decimals);
  const s = `${i || "0"}${f}`;
  return BigInt(s.replace(/^0+/, "") || "0");
}
function pad32(hexNo0x) { return hexNo0x.padStart(64, "0"); }
function strip0x(x) { return x?.startsWith("0x") ? x.slice(2) : x; }
function isHexAddress(addr) { return /^0x[a-fA-F0-9]{40}$/.test(addr || ""); }
function short(a){ return !a || a.length<12 ? (a||"") : `${a.slice(0,6)}…${a.slice(-4)}`; }

// EIP-681 BNB formats (certains wallets préfèrent A, d'autres B)
function eip681_BNB_A(to, amount) {
  const wei = toUnits(amount, 18).toString(); // décimal wei
  return `ethereum:${to}@${CHAIN_ID_DEC}?value=${wei}`;
}
function eip681_BNB_B(to, amount) {
  const wei = toUnits(amount, 18).toString(); // décimal wei
  return `ethereum:${to}?value=${wei}&chainId=${CHAIN_ID_DEC}`;
}
function bnbAddressOnly(to) {
  return to; // fallback: adresse seule (montant à saisir dans MetaMask)
}

// ERC-20 transfer(address,uint256)
function encodeErc20Transfer(toAddress, amountUnits) {
  const selector = "0xa9059cbb"; // keccak256("transfer(address,uint256)")
  const addr = strip0x(toAddress).toLowerCase();
  const amt = amountUnits.toString(16);
  return selector + pad32(addr) + pad32(amt);
}

export default function PayLite() {
  const [to, setTo] = useState("0x2538398B396bd16370aFBDaF42D09e637a86C3AC"); // destinataire (Owner par défaut)
  const [amount, setAmount] = useState(""); // ex: "0.01" pour BNB ou "10" pour NUR
  const [mode, setMode] = useState("NUR"); // "NUR" | "BNB"
  const [token, setToken] = useState(NUR_TOKEN);

  // QR images
  const [qrA, setQrA] = useState("");
  const [qrB, setQrB] = useState("");
  const [qrC, setQrC] = useState("");

  // Links
  const linkA = useMemo(() => (isHexAddress(to) && amount ? eip681_BNB_A(to, amount) : ""), [to, amount]);
  const linkB = useMemo(() => (isHexAddress(to) && amount ? eip681_BNB_B(to, amount) : ""), [to, amount]);
  const linkC = useMemo(() => (isHexAddress(to) ? bnbAddressOnly(to) : ""), [to]);

  // MetaMask deeplink (montant pas toujours pris en charge)
  const metamaskDeeplink = useMemo(() => {
    if (!isHexAddress(to)) return "";
    // base: ouvre l'écran d'envoi vers l'adresse
    return `https://metamask.app.link/send/${to}`;
  }, [to]);

  useEffect(() => {
    // Génère les 3 QR pour BNB quand nécessaire
    if (mode !== "BNB") { setQrA(""); setQrB(""); setQrC(""); return; }

    async function genQR(text, setter) {
      if (!text) { setter(""); return; }
      try { setter(await QRCode.toDataURL(text, { margin: 1, scale: 6 })); }
      catch { setter(""); }
    }
    genQR(linkA, setQrA);
    genQR(linkB, setQrB);
    genQR(linkC, setQrC);
  }, [mode, linkA, linkB, linkC]);

  // wallet state
  const [account, setAccount] = useState(null);

  async function ensureEthereum() {
    if (!window?.ethereum) { alert("Aucun wallet détecté. Ouvre cette page dans MetaMask (mobile) ou installe MetaMask."); throw new Error("no-ethereum"); }
    return window.ethereum;
  }
  async function connectWallet() {
    try {
      const eth = await ensureEthereum();
      const accs = await eth.request({ method: "eth_requestAccounts" });
      setAccount(accs?.[0] || null);
    } catch (e) { console.error(e); }
  }
  async function switchOrAddBSC() {
    const eth = await ensureEthereum();
    try {
      await eth.request({ method: "wallet_switchEthereumChain", params: [{ chainId: CHAIN_ID_HEX }] });
    } catch {
      await eth.request({ method: "wallet_addEthereumChain", params: [BSC_PARAMS] });
    }
    alert("Réseau BNB Smart Chain prêt.");
  }
  async function addNurToken() {
    try {
      const eth = await ensureEthereum();
      const wasAdded = await eth.request({
        method: "wallet_watchAsset",
        params: { type: "ERC20", options: { address: token, symbol: "NUR", decimals: 18 } },
      });
      if (wasAdded) alert("Token NUR ajouté au wallet.");
    } catch { alert("Impossible d’ajouter NUR. Vérifie l’adresse du token."); }
  }

  async function sendNur() {
    try {
      if (!isHexAddress(to)) return alert("Adresse destinataire invalide.");
      if (!isHexAddress(token)) return alert("Adresse du token invalide.");
      if (!amount || Number(amount) <= 0) return alert("Montant invalide.");

      const eth = await ensureEthereum();
      const accs = await eth.request({ method: "eth_requestAccounts" });
      const from = accs?.[0];
      if (!from) return alert("Connexion wallet requise.");

      try {
        await eth.request({ method: "wallet_switchEthereumChain", params: [{ chainId: CHAIN_ID_HEX }] });
      } catch {
        await eth.request({ method: "wallet_addEthereumChain", params: [BSC_PARAMS] });
      }

      const units = toUnits(amount, 18);
      const data = encodeErc20Transfer(to, units);

      const txHash = await eth.request({
        method: "eth_sendTransaction",
        params: [{ from, to: token, data, value: "0x0" }],
      });

      alert(`Transaction envoyée.\nHash: ${txHash}\n\nOuvre BscScan pour vérifier.`);
    } catch (e) {
      console.error(e);
      alert("Échec de l’envoi NUR. Vérifie réseau, token, solde NUR et frais BNB.");
    }
  }

  function copy(txt){ navigator.clipboard?.writeText(txt).then(()=>alert("Copié !")); }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-semibold mb-1">Pay (Lite) — NOOR</h1>
      <p className="text-white/60 mb-6">
        • <b>BNB</b> : 3 QR compatibles + deeplink MetaMask.&nbsp;
        • <b>NUR</b> : bouton <i>Envoyer NUR</i> (appel direct du wallet).
      </p>

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
          <input className="w-full rounded-xl bg-black/40 border border-white/10 px-3 py-2"
                 value={to} onChange={(e)=>setTo(e.target.value.trim())} placeholder="0x…"/>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-white/70 mb-1">Montant</label>
            <input className="w-full rounded-xl bg-black/40 border border-white/10 px-3 py-2"
                   value={amount} onChange={(e)=>setAmount(e.target.value)}
                   placeholder={mode==="BNB" ? "ex: 0.01" : "ex: 10"} />
          </div>
          <div>
            <label className="block text-sm text-white/70 mb-1">Actif</label>
            <select className="w-full rounded-xl bg-black/40 border border-white/10 px-3 py-2"
                    value={mode} onChange={(e)=>setMode(e.target.value)}>
              <option value="NUR">NUR (ERC-20)</option>
              <option value="BNB">BNB (natif)</option>
            </select>
          </div>
        </div>

        {mode === "NUR" && (
          <div>
            <label className="block text-sm text-white/70 mb-1">Adresse du token (NUR)</label>
            <input className="w-full rounded-xl bg-black/40 border border-white/10 px-3 py-2"
                   value={token} onChange={(e)=>setToken(e.target.value.trim())} placeholder="0x… (NUR)" />
            <div className="flex gap-3 mt-2">
              <button onClick={addNurToken} className="px-3 py-2 rounded-lg border border-white/15 hover:bg-white/10">
                Ajouter le token NUR
              </button>
              <button onClick={()=>copy(token)} className="px-3 py-2 rounded-lg border border-white/15 hover:bg-white/10">
                Copier adresse NUR
              </button>
            </div>
            <p className="text-xs text-white/40 mt-2">
              Par défaut : {short(NUR_TOKEN)} — BSC Mainnet (18 décimales).
            </p>
          </div>
        )}
      </div>

      {/* Zone actions */}
      {mode === "BNB" ? (
        <div className="mt-6 grid md:grid-cols-2 gap-6">
          <div className="p-4 rounded-xl border border-white/10">
            <div className="font-semibold mb-2">BNB — QR Format A (EIP-681 @56)</div>
            <div className="text-xs break-all text-white/60 mb-2">{linkA || "—"}</div>
            {qrA ? <img src={qrA} alt="QR BNB A" className="w-56 h-56 rounded-lg border border-white/10 mx-auto"/> :
              <div className="text-sm text-white/60">Saisis adresse + montant</div>}
          </div>

          <div className="p-4 rounded-xl border border-white/10">
            <div className="font-semibold mb-2">BNB — QR Format B (EIP-681 chainId=56)</div>
            <div className="text-xs break-all text-white/60 mb-2">{linkB || "—"}</div>
            {qrB ? <img src={qrB} alt="QR BNB B" className="w-56 h-56 rounded-lg border border-white/10 mx-auto"/> :
              <div className="text-sm text-white/60">Saisis adresse + montant</div>}
          </div>

          <div className="p-4 rounded-xl border border-white/10 md:col-span-2">
            <div className="font-semibold mb-2">BNB — QR Format C (Adresse seule)</div>
            <div className="text-xs break-all text-white/60 mb-2">{linkC || "—"}</div>
            {qrC ? <img src={qrC} alt="QR BNB C" className="w-56 h-56 rounded-lg border border-white/10 mx-auto"/> :
              <div className="text-sm text-white/60">Saisis une adresse</div>}
            <p className="text-xs text-white/40 mt-2">
              Ce format ouvre l’écran d’envoi dans MetaMask; saisis le montant manuellement.
            </p>
            {metamaskDeeplink && (
              <button onClick={()=>window.location.href = metamaskDeeplink}
                      className="mt-3 px-4 py-2 rounded-lg bg-gold text-black font-medium">
                Ouvrir dans MetaMask (deeplink)
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-6 p-4 rounded-xl border border-white/10">
          <div className="text-sm text-white/60 mb-3">
            Le QR pour tokens ERC-20 n’est pas universel sur MetaMask Mobile.
            Utilise le bouton ci-dessous pour envoyer des NUR via ton wallet.
          </div>
          <button onClick={sendNur} className="px-4 py-2 rounded-lg bg-gold text-black font-medium">
            Envoyer NUR (Wallet)
          </button>
          <p className="text-xs text-white/40 mt-2">
            Astuce : assure-toi d’avoir un peu de BNB pour les frais réseau sur le compte émetteur.
          </p>
        </div>
      )}

      {/* Conseils */}
      <div className="mt-6 text-sm text-white/70 space-y-2">
        <div className="font-semibold">Conseils :</div>
        <ul className="list-disc pl-5 space-y-1">
          <li>Dans MetaMask mobile, utilise toujours le **Scanner interne** (pas l’appareil photo du téléphone).</li>
          <li>Si “réseau 56 introuvable” → clique “Ajouter / basculer vers BSC (56)” ci-dessus.</li>
          <li>Si le QR A ne marche pas, essaie le QR B, puis le QR C (adresse seule).</li>
          <li>Deeplink MetaMask : utile surtout sur mobile (ouvre l’écran d’envoi vers l’adresse).</li>
        </ul>
      </div>
    </div>
  );
}
