// pages/pay-wc.js
import { useEffect, useMemo, useRef, useState } from "react";
import QRCode from "qrcode";
import EthereumProvider from "@walletconnect/ethereum-provider";

const CHAIN_ID_DEC = 56; // BNB Smart Chain Mainnet
const CHAIN_ID_HEX = "0x38";
const NUR_TOKEN = "0xA20212290866C8A804a89218c8572F28C507b401"; // NOORTokenV2
const WC_PROJECT_ID = "17bdc8741d9f3f18ea7efc59063adb46"; // ✅ Ton vrai projectId WalletConnect

function toUnits(amountStr, decimals = 18) {
  const clean = (amountStr || "").trim().replace(",", ".");
  if (!clean || isNaN(Number(clean))) return 0n;
  const [i, fraw = ""] = clean.split(".");
  const f = (fraw + "0".repeat(decimals)).slice(0, decimals);
  const s = `${i || "0"}${f}`;
  return BigInt(s.replace(/^0+/, "") || "0");
}
function pad32(x) { return x.padStart(64, "0"); }
function strip0x(x) { return x?.startsWith("0x") ? x.slice(2) : x; }
function isHexAddress(a) { return /^0x[a-fA-F0-9]{40}$/.test(a || ""); }
function short(a) { return !a || a.length < 12 ? (a || "") : `${a.slice(0, 6)}…${a.slice(-4)}`; }

function encodeErc20Transfer(toAddress, amountUnits) {
  const selector = "0xa9059cbb"; // keccak256("transfer(address,uint256)")
  const addr = strip0x(toAddress).toLowerCase();
  const amt = amountUnits.toString(16);
  return selector + pad32(addr) + pad32(amt);
}

export default function PayWalletConnect() {
  const [to, setTo] = useState("0x2538398B396bd16370aFBDaF42D09e637a86C3AC"); // destinataire (Owner)
  const [amount, setAmount] = useState("");
  const [mode, setMode] = useState("NUR"); // "NUR" | "BNB"
  const [token, setToken] = useState(NUR_TOKEN);

  const providerRef = useRef(null);
  const [wcUri, setWcUri] = useState("");
  const [wcQr, setWcQr] = useState("");
  const [connectedAccount, setConnectedAccount] = useState(null);
  const [sessionReady, setSessionReady] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!wcUri) { setWcQr(""); return; }
    QRCode.toDataURL(wcUri, { margin: 1, scale: 6 })
      .then(setWcQr)
      .catch(() => setWcQr(""));
  }, [wcUri]);

  async function initProvider() {
    if (providerRef.current) return providerRef.current;

    const provider = await EthereumProvider.init({
      projectId: WC_PROJECT_ID,
      metadata: {
        name: "NOOR Pay (WC)",
        description: "Pay with WalletConnect",
        url: "https://noor.vercel.app",
        icons: ["https://walletconnect.com/walletconnect-logo.png"],
      },
      showQrModal: false,
      chains: [CHAIN_ID_DEC],
      optionalChains: [CHAIN_ID_DEC],
      methods: ["eth_sendTransaction", "eth_signTransaction", "eth_signTypedData", "personal_sign"],
      events: ["chainChanged", "accountsChanged", "disconnect"],
      rpcMap: { [CHAIN_ID_DEC]: "https://bsc-dataseed.binance.org" },
    });

    provider.on("display_uri", (uri) => setWcUri(uri));
    provider.on("accountsChanged", (accounts) => setConnectedAccount(accounts?.[0] || null));
    provider.on("disconnect", () => {
      setConnectedAccount(null);
      setSessionReady(false);
      setWcUri("");
      setWcQr("");
      providerRef.current = null;
    });

    providerRef.current = provider;
    return provider;
  }

  async function connect() {
    try {
      const provider = await initProvider();
      setBusy(true);
      await provider.connect();
      const accounts = await provider.request({ method: "eth_accounts" });
      setConnectedAccount(accounts?.[0] || null);
      setSessionReady(true);
    } catch (e) {
      console.error(e);
      alert("Connexion WalletConnect annulée ou échouée.");
    } finally {
      setBusy(false);
    }
  }

  async function sendBNB() {
    try {
      if (!sessionReady) return alert("Connecte d’abord un wallet via le QR.");
      if (!isHexAddress(to)) return alert("Adresse destinataire invalide.");
      if (!amount || Number(amount) <= 0) return alert("Montant invalide.");

      const provider = providerRef.current;
      const from = connectedAccount;
      const valueHex = "0x" + toUnits(amount, 18).toString(16);

      const txHash = await provider.request({
        method: "eth_sendTransaction",
        params: [{ from, to, value: valueHex }],
      });
      alert(`BNB envoyé.\nTX: ${txHash}`);
    } catch (e) {
      console.error(e);
      alert("Échec envoi BNB (réseau ou solde).");
    }
  }

  async function sendNUR() {
    try {
      if (!sessionReady) return alert("Connecte d’abord un wallet via le QR.");
      if (!isHexAddress(to)) return alert("Adresse destinataire invalide.");
      if (!isHexAddress(token)) return alert("Adresse du token invalide.");
      if (!amount || Number(amount) <= 0) return alert("Montant invalide.");

      const provider = providerRef.current;
      const from = connectedAccount;
      const data = encodeErc20Transfer(to, toUnits(amount, 18));

      const txHash = await provider.request({
        method: "eth_sendTransaction",
        params: [{ from, to: token, data, value: "0x0" }],
      });
      alert(`NUR envoyé.\nTX: ${txHash}`);
    } catch (e) {
      console.error(e);
      alert("Échec envoi NUR (vérifie le réseau et le solde).");
    }
  }

  function resetSession() {
    try { providerRef.current?.disconnect(); } catch {}
    setConnectedAccount(null);
    setSessionReady(false);
    setWcUri("");
    setWcQr("");
    providerRef.current = null;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-semibold mb-2">Pay (WalletConnect QR JSON)</h1>
      <p className="text-white/60 mb-6">
        Scanne le QR ci-dessous avec MetaMask, Trust, Rabby… sur BNB Smart Chain (56).
      </p>

      <div className="p-4 rounded-xl border border-white/10 mb-6">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <button
            onClick={sessionReady ? resetSession : connect}
            disabled={busy}
            className="px-4 py-2 rounded-lg border border-white/15 hover:bg-white/10"
          >
            {sessionReady ? "🔌 Déconnecter" : busy ? "Connexion…" : "🔗 Connecter (WalletConnect)"}
          </button>
          {connectedAccount && (
            <div className="text-sm text-white/70">Connecté : <span className="font-mono">{short(connectedAccount)}</span></div>
          )}
        </div>

        {!sessionReady && wcQr ? (
          <div className="flex flex-col items-center">
            <img src={wcQr} alt="WalletConnect QR" className="w-56 h-56 rounded-lg border border-white/10" />
            <p className="text-xs text-white/40 mt-2">Scanne avec ton wallet pour te connecter.</p>
          </div>
        ) : !sessionReady ? (
          <div className="text-sm text-white/60">Clique “Connecter” pour générer le QR WalletConnect universel.</div>
        ) : (
          <div className="text-sm text-white/60">Session WalletConnect active — tu peux envoyer BNB ou NUR ci-dessous.</div>
        )}
      </div>

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
            <p className="text-xs text-white/40 mt-1">Par défaut : {short(NUR_TOKEN)} — 18 décimales.</p>
          </div>
        )}
      </div>

      <div className="mt-6 grid md:grid-cols-2 gap-4">
        <button
          onClick={sendBNB}
          className="px-4 py-3 rounded-lg border border-white/15 hover:bg-white/10"
          disabled={!sessionReady}
        >
          Envoyer BNB (WalletConnect)
        </button>
        <button
          onClick={sendNUR}
          className="px-4 py-3 rounded-lg bg-gold text-black font-medium"
          disabled={!sessionReady}
        >
          Envoyer NUR (WalletConnect)
        </button>
      </div>

      <div className="mt-6 text-sm text-white/70 space-y-2">
        <div className="font-semibold">Conseils :</div>
        <ul className="list-disc pl-5 space-y-1">
          <li>Scanne avec ton wallet (MetaMask, Trust, Rabby…).</li>
          <li>Compatible BNB Smart Chain (chainId 56).</li>
          <li>Assure-toi d’avoir un peu de BNB pour les frais réseau.</li>
        </ul>
      </div>
    </div>
  );
}
