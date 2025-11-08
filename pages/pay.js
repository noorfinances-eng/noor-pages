// pages/pay.js
import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";

const NUR_CONTRACT = "0xA20212290866C8A804a89218c8572F28C507b401"; // NOORTokenV2
const BSC_CHAIN_ID_DEC = 56;
const BSC_CHAIN_ID_HEX = "0x38";

function PayInner() {
  // Base URL + formulaire
  const [baseUrl, setBaseUrl] = useState("");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState(""); // NUR (décimales humaines)
  const [note, setNote] = useState("");

  // Wallet state
  const [wallet, setWallet] = useState({
    connected: false,
    address: "",
    chainId: null,
    nurSymbol: "NUR",
    nurDecimals: 18,
    nurBalance: null,
    bnbBalance: null
  });
  const [txStatus, setTxStatus] = useState("");
  const [errMsg, setErrMsg] = useState("");

  // Type de QR
  const [qrMode, setQrMode] = useState("link"); // "link" | "universal" | "eip681"

  // Canvas QR
  const canvasRef = useRef(null);

  const short = (a) => (!a ? "—" : `${a.slice(0, 6)}…${a.slice(-4)}`);

  // Client only + préremplissage depuis ?to=&amount=
  useEffect(() => {
    if (typeof window === "undefined") return;
    setBaseUrl(window.location.origin);
    const params = new URLSearchParams(window.location.search || "");
    const to = params.get("to");
    const amt = params.get("amount");
    if (to && /^0x[0-9a-fA-F]{40}$/.test(to)) setRecipient(to);
    if (amt && !isNaN(Number(amt))) setAmount(amt);
  }, []);

  // toWei (18 décimales) sans dépendance
  const toWei = (numString) => {
    if (!numString || isNaN(Number(numString))) return "0";
    const [intPart, fracPart = ""] = String(numString).split(".");
    const frac = (fracPart + "000000000000000000").slice(0, 18);
    const joined = (intPart || "0") + frac;
    return joined.replace(/^0+(?=\d)/, "") || "0";
  };

  // EIP-681 (wallets compatibles)
  const eip681 = useMemo(() => {
    const to = (recipient || "").trim();
    if (!to || to.length !== 42 || !to.startsWith("0x")) return "";
    const wei = toWei(amount || "0");
    return `ethereum:${NUR_CONTRACT}/transfer?address=${to}&uint256=${wei}&chain_id=${BSC_CHAIN_ID_DEC}`;
  }, [recipient, amount]);

  // QR universel (adresse seule)
  const universalPayload = useMemo(() => {
    const meta = { chainId: BSC_CHAIN_ID_DEC, recipient: (recipient || "").trim(), hint: { token: NUR_CONTRACT, amountNUR: amount || "" } };
    const addr = (recipient || "").trim();
    return (addr ? addr : "NOOR") + "\nMETA:" + JSON.stringify(meta);
  }, [recipient, amount]);

  // Lien partageable → ouvre /pay pré-remplie
  const shareLink = useMemo(() => {
    if (!baseUrl) return "";
    const to = (recipient || "").trim();
    const amt = (amount || "").trim();
    const u = new URL(baseUrl + "/pay");
    if (to) u.searchParams.set("to", to);
    if (amt) u.searchParams.set("amount", amt);
    u.hash = "open";
    return u.toString();
  }, [baseUrl, recipient, amount]);

  // Contenu QR selon mode
  const qrContent = useMemo(() => {
    if (qrMode === "eip681") return eip681 || "NOOR";
    if (qrMode === "universal") return universalPayload || "NOOR";
    return shareLink || "NOOR"; // "link" par défaut ; avant hydratation, c'est "NOOR"
  }, [qrMode, eip681, universalPayload, shareLink]);

  // Dessin du QR (client-only import de "qrcode")
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!canvasRef.current) return;
      try {
        const QR = await import("qrcode");
        if (!mounted) return;
        await QR.toCanvas(canvasRef.current, qrContent, { errorCorrectionLevel: "M", margin: 2, scale: 6 });
      } catch {/* ignore */}
    })();
    return () => { mounted = false; };
  }, [qrContent]);

  // Helpers wallet
  const ensureBsc = async (eth) => {
    const cid = await eth.request({ method: "eth_chainId" });
    if (cid !== BSC_CHAIN_ID_HEX) {
      await eth.request({
        method: "wallet_addEthereumChain",
        params: [{
          chainId: BSC_CHAIN_ID_HEX,
          chainName: "BNB Smart Chain",
          nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
          rpcUrls: [
            "https://bsc-dataseed.binance.org",
            "https://bsc-dataseed1.binance.org",
            "https://bsc-dataseed2.binance.org",
            "https://bsc-dataseed3.binance.org",
            "https://bsc-dataseed4.binance.org"
          ],
          blockExplorerUrls: ["https://bscscan.com"]
        }]
      });
    }
  };

  // Connecter le wallet (import dynamique d’ethers pour lire les soldes)
  const connectInjected = async () => {
    setErrMsg("");
    try {
      if (typeof window === "undefined" || !window.ethereum) {
        setErrMsg("Aucun wallet détecté (MetaMask/Rabby).");
        return;
      }
      await ensureBsc(window.ethereum);

      // Import dynamique d'ethers côté client
      const { BrowserProvider, formatUnits, Contract } = await import("ethers");

      const provider = new BrowserProvider(window.ethereum);
      const [address] = await window.ethereum.request({ method: "eth_requestAccounts" });

      // Soldes
      const bnbWei = await provider.getBalance(address);
      const bnbBal = Number(formatUnits(bnbWei, 18)).toFixed(6);

      const ERC20_ABI = [
        "function balanceOf(address) view returns (uint256)",
        "function decimals() view returns (uint8)",
        "function symbol() view returns (string)"
      ];
      const nur = new Contract(NUR_CONTRACT, ERC20_ABI, provider);
      const [dec, sym, balRaw] = await Promise.all([ nur.decimals(), nur.symbol(), nur.balanceOf(address) ]);
      const nurBal = formatUnits(balRaw, dec);

      const chainIdHex = await window.ethereum.request({ method: "eth_chainId" });
      setWallet({
        connected: true,
        address,
        chainId: parseInt(chainIdHex, 16),
        nurSymbol: sym || "NUR",
        nurDecimals: dec || 18,
        nurBalance: nurBal,
        bnbBalance: bnbBal
      });

      window.ethereum.on?.("accountsChanged", () => location.reload());
      window.ethereum.on?.("chainChanged", () => location.reload());
    } catch (e) {
      setErrMsg("Connexion refusée ou erreur wallet.");
    }
  };

  const addBscToWallet = async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      alert("Wallet non détecté (MetaMask/Rabby).");
      return;
    }
    try {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [{
          chainId: BSC_CHAIN_ID_HEX,
          chainName: "BNB Smart Chain",
          nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
          rpcUrls: [
            "https://bsc-dataseed.binance.org",
            "https://bsc-dataseed1.binance.org",
            "https://bsc-dataseed2.binance.org",
            "https://bsc-dataseed3.binance.org",
            "https://bsc-dataseed4.binance.org"
          ],
          blockExplorerUrls: ["https://bscscan.com"]
        }]
      });
    } catch {
      alert("Impossible d'ajouter BSC au wallet.");
    }
  };

  const addNURToWallet = async () => {
    if (typeof window === "undefined" || !window.ethereum) { alert("Wallet non détecté"); return; }
    try {
      await window.ethereum.request({
        method: "wallet_watchAsset",
        params: { type: "ERC20", options: { address: NUR_CONTRACT, symbol: wallet.nurSymbol || "NUR", decimals: wallet.nurDecimals || 18 } }
      });
    } catch {/* ignore */}
  };

  // Envoi direct (transfer ERC-20) — import dynamique d’ethers
  const sendNur = async () => {
    setErrMsg(""); setTxStatus("");
    try {
      if (typeof window === "undefined" || !window.ethereum) { setErrMsg("Wallet non détecté."); return; }
      const to = (recipient || "").trim();
      if (!to || !to.startsWith("0x") || to.length !== 42) { setErrMsg("Adresse destinataire invalide."); return; }
      if (!amount || Number(amount) <= 0) { setErrMsg("Montant invalide."); return; }

      await ensureBsc(window.ethereum);

      const { BrowserProvider, Contract, parseUnits } = await import("ethers");
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const ERC20_ABI = ["function transfer(address to, uint256 amount) returns (bool)"];
      const nur = new Contract(NUR_CONTRACT, ERC20_ABI, signer);

      const value = parseUnits(amount, wallet.nurDecimals || 18);
      const tx = await nur.transfer(to, value);
      setTxStatus("Transaction envoyée… en attente de confirmation.");
      const receipt = await tx.wait();
      if (receipt?.status === 1) {
        setTxStatus("✅ Transfert confirmé !");
      } else {
        setTxStatus("⚠️ Transaction non confirmée.");
      }
    } catch (e) {
      setErrMsg(e?.shortMessage || e?.message || "Erreur lors de l'envoi.");
    }
  };

  const copy = async (txt) => {
    try { await navigator.clipboard.writeText(txt); alert("Copié !"); } catch {/* ignore */}
  };

  return (
    <div className="space-y-10">
      {/* HERO */}
      <section className="text-center">
        <h2 className="text-4xl md:text-5xl font-semibold">Pay with NOOR</h2>
        <p className="mt-3 text-white/70 max-w-2xl mx-auto">
          QR : <span className="text-gold font-medium">Lien (HTTPS)</span> • <span className="text-gold font-medium">Universel (adresse)</span> • <span className="text-gold font-medium">Avancé (EIP-681)</span>. Ou <span className="text-gold font-medium">envoi direct</span> via wallet connecté.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <button onClick={addBscToWallet} className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10">Ajouter BSC au wallet</button>
          <button onClick={connectInjected} className="px-4 py-2 rounded-lg bg-gold text-black font-medium">Connecter le wallet</button>
          {wallet.connected ? (
            <button onClick={addNURToWallet} className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10">
              Ajouter NUR au wallet
            </button>
          ) : null}
        </div>
        {wallet.connected ? (
          <div className="mt-3 text-sm text-white/70">
            <div>Connecté : <span className="font-mono">{short(wallet.address)}</span> • Réseau : {wallet.chainId}</div>
          </div>
        ) : null}
        {errMsg ? <p className="mt-3 text-red-400 text-sm">{errMsg}</p> : null}
      </section>

      {/* FORM + QR + SEND */}
      <section className="grid gap-6 md:grid-cols-2">
        {/* Formulaire */}
        <div className="p-5 rounded-xl border border-white/10">
          <h3 className="text-xl font-semibold">1) Paramètres</h3>
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm text-white/60 mb-1">Adresse destinataire (wallet BSC)</label>
              <input value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="0x..." className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-1">Montant (en NUR)</label>
              <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Ex: 25" inputMode="decimal" className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-1">Note (optionnel)</label>
              <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Référence interne (max 140)" maxLength={140} className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 focus:outline-none" />
            </div>
            <div className="text-sm text-white/50">
              Contrat NUR :{" "}
              <a className="underline" href={`https://bscscan.com/address/${NUR_CONTRACT}`} target="_blank" rel="noreferrer">{short(NUR_CONTRACT)}</a>
            </div>
          </div>
        </div>

        {/* QR + Actions */}
        <div className="p-5 rounded-xl border border-white/10">
          <h3 className="text-xl font-semibold">2) QR ou envoi direct</h3>

          {/* Switch QR */}
          <div className="mt-3 inline-flex rounded-lg border border-white/10 overflow-hidden">
            <button onClick={() => setQrMode("link")} className={`px-3 py-2 text-sm ${qrMode === "link" ? "bg-white/10" : "hover:bg-white/5"}`}>QR Lien (HTTPS)</button>
            <button onClick={() => setQrMode("universal")} className={`px-3 py-2 text-sm ${qrMode === "universal" ? "bg-white/10" : "hover:bg-white/5"}`}>QR Universel (adresse)</button>
            <button onClick={() => setQrMode("eip681")} className={`px-3 py-2 text-sm ${qrMode === "eip681" ? "bg-white/10" : "hover:bg-white/5"}`}>QR Avancé (EIP-681)</button>
          </div>

          <div className="mt-4 flex flex-col items-center gap-4">
            <canvas ref={canvasRef} className="rounded-lg border border-white/10 bg-white p-2" />
            <div className="text-center text-sm text-white/60">
              {qrMode === "link" && "Scanne avec l’appareil photo : ouvre cette page /pay pré-remplie (to/amount)."}
              {qrMode === "universal" && "Scanne dans n’importe quel wallet : écran d’envoi vers l’adresse (choisir NUR + saisir le montant)."}
              {qrMode === "eip681" && "Wallets compatibles uniquement : prépare un transfer() du token NUR (BSC #56)."}
            </div>
          </div>

          <div className="mt-6 space-y-2 text-sm">
            <Row k="Réseau" v="BNB Smart Chain (56)" />
            <Row k="Token (hint)" v={short(NUR_CONTRACT)} link={`https://bscscan.com/address/${NUR_CONTRACT}`} />
            <Row k="Destinataire" v={short(recipient || "—")} />
            <Row k="Montant (NUR)" v={amount || "—"} />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <button onClick={() => copy(shareLink)} className="px-3 py-2 rounded-lg border border-white/10 hover:bg-white/10 text-sm" disabled={!shareLink}>Copier le lien (HTTPS)</button>
            <button onClick={() => copy(eip681)} className="px-3 py-2 rounded-lg border border-white/10 hover:bg-white/10 text-sm" disabled={!eip681}>Copier lien EIP-681</button>
          </div>

          <div className="mt-4">
            <button onClick={sendNur} className="w-full px-4 py-2 rounded-lg bg-gold text-black font-medium disabled:opacity-50" disabled={!wallet.connected}>
              Envoyer maintenant (transfer)
            </button>
            {txStatus ? <p className="mt-2 text-green-400 text-sm">{txStatus}</p> : null}
            {errMsg && !txStatus ? <p className="mt-2 text-red-400 text-sm">{errMsg}</p> : null}
          </div>
        </div>
      </section>

      {/* AIDE */}
      <section className="border-t border-white/10 pt-8">
        <h3 className="text-xl font-semibold mb-2">Conseils</h3>
        <ul className="list-disc ml-5 space-y-2 text-white/75">
          <li><strong>QR Lien (HTTPS)</strong> = le plus universel (ouvre /pay pré-remplie).</li>
          <li><strong>QR Universel (adresse)</strong> = compatible 100% wallets (montant non pré-rempli).</li>
          <li><strong>QR Avancé (EIP-681)</strong> = support partiel selon les wallets.</li>
          <li>Pour l’envoi direct : connecte le wallet, assure-toi d’être sur <strong>BSC</strong> et d’avoir un peu de <strong>BNB</strong> (gas).</li>
        </ul>
      </section>
    </div>
  );
}

// Désactive le SSR pour cette page
function Pay() { return <PayInner />; }
export default dynamic(() => Promise.resolve(Pay), { ssr: false });

function Row({ k, v, link }) {
  const body = <span className="font-mono">{v}</span>;
  return (
    <div className="flex justify-between gap-4">
      <span className="text-white/50">{k}</span>
      {link ? (
        <a href={link} target="_blank" rel="noreferrer" className="underline">{body}</a>
      ) : body}
    </div>
  );
}
