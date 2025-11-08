// pages/pay.js
import { useEffect, useMemo, useRef, useState } from "react";
import QRCode from "qrcode";
import { BrowserProvider, Contract, formatUnits, parseUnits } from "ethers";

const NUR_CONTRACT = "0xA20212290866C8A804a89218c8572F28C507b401"; // NOORTokenV2
const BSC_CHAIN_ID_DEC = 56;
const BSC_CHAIN_ID_HEX = "0x38";

// ABI minimale ERC-20
const ERC20_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function transfer(address to, uint256 amount) returns (bool)"
];

export default function Pay() {
  // ---- Base URL (pour générer un lien partageable)
  const [baseUrl, setBaseUrl] = useState("");

  // ---- Formulaire
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState(""); // en NUR
  const [note, setNote] = useState("");

  // ---- Wallet
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

  // ---- Choix du type de QR
  const [qrMode, setQrMode] = useState("link"); // "link" | "universal" | "eip681"

  // ---- Canvas QR
  const canvasRef = useRef(null);

  // Utils
  const short = (a) => (!a ? "—" : `${a.slice(0, 6)}…${a.slice(-4)}`);

  // Récupère baseUrl + pré-remplit depuis l’URL (?to= & amount=) quand on arrive via QR lien
  useEffect(() => {
    if (typeof window === "undefined") return;
    setBaseUrl(window.location.origin);

    const params = new URLSearchParams(window.location.search || "");
    const to = params.get("to");
    const amt = params.get("amount");
    if (to && /^0x[0-9a-fA-F]{40}$/.test(to)) setRecipient(to);
    if (amt && !isNaN(Number(amt))) setAmount(amt);

    // Si le lien contient #open, on peut à terme proposer d’ouvrir le wallet
    // (on n’autosoumet PAS une transaction pour éviter toute surprise)
  }, []);

  // EIP-681 (certains wallets seulement)
  const eip681 = useMemo(() => {
    try {
      if (!recipient || !recipient.startsWith("0x") || recipient.length !== 42) return "";
      const wei = parseUnits((amount || "0"), 18).toString();
      return `ethereum:${NUR_CONTRACT}/transfer?address=${recipient.trim()}&uint256=${wei}&chain_id=${BSC_CHAIN_ID_DEC}`;
    } catch {
      return "";
    }
  }, [recipient, amount]);

  // Payload “universel” (adresse seule) — compatible tous wallets
  const universalPayload = useMemo(() => {
    const meta = {
      chainId: BSC_CHAIN_ID_DEC,
      recipient: (recipient || "").trim(),
      hint: { token: NUR_CONTRACT, amountNUR: amount || "" }
    };
    return `${(recipient || "").trim()}\nMETA:${JSON.stringify(meta)}`;
  }, [recipient, amount]);

  // Lien partageable (HTTPS) → le plus “universel”
  const shareLink = useMemo(() => {
    const to = (recipient || "").trim();
    const amt = (amount || "").trim();
    const u = new URL((baseUrl || "") + "/pay");
    if (to) u.searchParams.set("to", to);
    if (amt) u.searchParams.set("amount", amt);
    u.hash = "open";
    return u.toString();
  }, [baseUrl, recipient, amount]);

  // Contenu QR selon le mode
  const qrContent = useMemo(() => {
    if (qrMode === "eip681") return eip681 || "NOOR";
    if (qrMode === "universal") return universalPayload || "NOOR";
    return shareLink || "NOOR"; // mode "link" par défaut
  }, [qrMode, eip681, universalPayload, shareLink]);

  // Dessin du QR
  useEffect(() => {
    if (!canvasRef.current) return;
    (async () => {
      try {
        await QRCode.toCanvas(canvasRef.current, qrContent, {
          errorCorrectionLevel: "M",
          margin: 2,
          scale: 6
        });
      } catch {}
    })();
  }, [qrContent]);

  // ---------- Wallet helpers
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

  const connectInjected = async () => {
    setErrMsg("");
    try {
      if (!window.ethereum) { setErrMsg("Aucun wallet détecté (MetaMask/Rabby)."); return; }
      await ensureBsc(window.ethereum);

      const provider = new BrowserProvider(window.ethereum);
      const [address] = await window.ethereum.request({ method: "eth_requestAccounts" });

      const bnbWei = await provider.getBalance(address);
      const bnbBal = Number(formatUnits(bnbWei, 18)).toFixed(6);

      const nur = new Contract(NUR_CONTRACT, ERC20_ABI, provider);
      const [dec, sym, balRaw] = await Promise.all([
        nur.decimals(), nur.symbol(), nur.balanceOf(address)
      ]);
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
    if (!window.ethereum) { alert("Wallet non détecté"); return; }
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
    if (!window.ethereum) { alert("Wallet non détecté"); return; }
    try {
      await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: NUR_CONTRACT,
            symbol: wallet.nurSymbol || "NUR",
            decimals: wallet.nurDecimals || 18
          }
        }
      });
    } catch {}
  };

  // ---------- Envoi direct (transfer ERC-20)
  const sendNur = async () => {
    setErrMsg("");
    setTxStatus("");
    try {
      if (!window.ethereum) { setErrMsg("Wallet non détecté."); return; }
      const to = (recipient || "").trim();
      if (!to || !to.startsWith("0x") || to.length !== 42) { setErrMsg("Adresse destinataire invalide."); return; }
      if (!amount || Number(amount) <= 0) { setErrMsg("Montant invalide."); return; }

      await ensureBsc(window.ethereum);
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const nur = new Contract(NUR_CONTRACT, ERC20_ABI, signer);

      const value = parseUnits(amount, wallet.nurDecimals || 18);
      const tx = await nur.transfer(to, value);
      setTxStatus("Transaction envoyée… en attente de confirmation.");
      const receipt = await tx.wait();
      if (receipt?.status === 1) {
        setTxStatus("✅ Transfert confirmé !");
        const balRaw = await nur.balanceOf(wallet.address);
        setWallet((w) => ({ ...w, nurBalance: formatUnits(balRaw, w.nurDecimals || 18) }));
      } else {
        setTxStatus("⚠️ Transaction non confirmée.");
      }
    } catch (e) {
      setErrMsg(e?.shortMessage || e?.message || "Erreur lors de l'envoi.");
    }
  };

  const copy = async (txt) => { try { await navigator.clipboard.writeText(txt); alert("Copié !"); } catch {} };

  return (
    <div className="space-y-10">
      {/* HERO */}
      <section className="text-center">
        <h2 className="text-4xl md:text-5xl font-semibold">Pay with NOOR</h2>
        <p className="mt-3 text-white/70 max-w-2xl mx-auto">
          Choisis un QR : <span className="text-gold font-medium">Lien partageable (HTTPS)</span> = ouvre cette page pré-remplie, <span className="text-gold font-medium">Universel (adresse)</span> = marche dans tous les wallets, <span className="text-gold font-medium">Avancé (EIP-681)</span> = pour wallets compatibles.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <button onClick={addBscToWallet} className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10">
            Ajouter BSC au wallet
          </button>
          <button onClick={connectInjected} className="px-4 py-2 rounded-lg bg-gold text-black font-medium">
            Connecter le wallet
          </button>
        </div>
        {errMsg ? <p className="mt-3 text-red-400 text-sm">{errMsg}</p> : null}
        {wallet.connected ? (
          <div className="mt-4 text-sm text-white/70">
            <div>Connecté : <span className="font-mono">{short(wallet.address)}</span> • Réseau : {wallet.chainId}</div>
            <div>Solde : <span className="font-mono">{wallet.nurBalance ?? "—"} {wallet.nurSymbol}</span> • <span className="font-mono">{wallet.bnbBalance ?? "—"} BNB</span></div>
            <button onClick={addNURToWallet} className="mt-2 px-3 py-1 rounded border border-white/15 hover:bg-white/10 text-xs">
              Ajouter NUR au wallet
            </button>
          </div>
        ) : null}
      </section>

      {/* FORM + QR + SEND */}
      <section className="grid gap-6 md:grid-cols-2">
        {/* Formulaire */}
        <div className="p-5 rounded-xl border border-white/10">
          <h3 className="text-xl font-semibold">1) Paramètres</h3>
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm text-white/60 mb-1">Adresse destinataire (wallet BSC)</label>
              <input
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="0x..."
                className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-1">Montant (en NUR)</label>
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Ex: 25"
                inputMode="decimal"
                className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-1">Note (optionnel)</label>
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Référence interne (max 140)"
                maxLength={140}
                className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 focus:outline-none"
              />
            </div>
            <div className="text-sm text-white/50">
              Contrat NUR :{" "}
              <a className="underline" href={`https://bscscan.com/address/${NUR_CONTRACT}`} target="_blank" rel="noreferrer">
                {short(NUR_CONTRACT)}
              </a>
            </div>
          </div>
        </div>

        {/* QR + Actions */}
        <div className="p-5 rounded-xl border border-white/10">
          <h3 className="text-xl font-semibold">2) QR ou envoi direct</h3>

          {/* Switch QR */}
          <div className="mt-3 inline-flex rounded-lg border border-white/10 overflow-hidden">
            <button
              onClick={() => setQrMode("link")}
              className={`px-3 py-2 text-sm ${qrMode === "link" ? "bg-white/10" : "hover:bg-white/5"}`}
            >
              QR Lien (HTTPS)
            </button>
            <button
              onClick={() => setQrMode("universal")}
              className={`px-3 py-2 text-sm ${qrMode === "universal" ? "bg-white/10" : "hover:bg-white/5"}`}
            >
              QR Universel (adresse)
            </button>
            <button
              onClick={() => setQrMode("eip681")}
              className={`px-3 py-2 text-sm ${qrMode === "eip681" ? "bg-white/10" : "hover:bg-white/5"}`}
            >
              QR Avancé (EIP-681)
            </button>
          </div>

          <div className="mt-4 flex flex-col items-center gap-4">
            <canvas ref={canvasRef} className="rounded-lg border border-white/10 bg-white p-2" />
            <div className="text-center text-sm text-white/60">
              {qrMode === "link" && "Scanne avec l’appareil photo : ça ouvre cette page pré-remplie (to/amount). Connecte ton wallet et envoie."}
              {qrMode === "universal" && "Scanne dans n’importe quel wallet : il ouvrira l’écran d’envoi vers l’adresse. Choisis NUR et saisis le montant."}
              {qrMode === "eip681" && "Pour wallets compatibles EIP-681 : prépare directement un transfer() du token NUR sur BSC #56."}
            </div>
          </div>

          <div className="mt-6 space-y-2 text-sm">
            <Row k="Réseau" v="BNB Smart Chain (56)" />
            <Row k="Token (hint)" v={short(NUR_CONTRACT)} link={`https://bscscan.com/address/${NUR_CONTRACT}`} />
            <Row k="Destinataire" v={short(recipient || "—")} />
            <Row k="Montant (NUR)" v={amount || "—"} />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <button onClick={() => copy(shareLink)} className="px-3 py-2 rounded-lg border border-white/10 hover:bg-white/10 text-sm">
              Copier le lien (HTTPS)
            </button>
            <button onClick={() => copy(eip681)} className="px-3 py-2 rounded-lg border border-white/10 hover:bg-white/10 text-sm" disabled={!eip681}>
              Copier lien EIP-681
            </button>
          </div>

          <div className="mt-4">
            <button
              onClick={sendNur}
              className="w-full px-4 py-2 rounded-lg bg-gold text-black font-medium disabled:opacity-50"
              disabled={!wallet.connected}
            >
              Envoyer maintenant (transfer)
            </button>
            {txStatus ? <p className="mt-2 text-green-400 text-sm">{txStatus}</p> : null}
            {errMsg && !txStatus ? <p className="mt-2 text-red-400 text-sm">{errMsg}</p> : null}
          </div>
        </div>
      </section>

      {/* AIDE */}
      <section className="border-t border-white/10 pt-8">
        <h3 className="text-xl font-semibold mb-2">Astuces d’usage</h3>
        <ul className="list-disc ml-5 space-y-2 text-white/75">
          <li><strong>QR Lien (HTTPS)</strong> est le plus universel : toutes les caméras l’ouvrent, ta page se pré-remplit, puis l’utilisateur envoie.</li>
          <li><strong>QR Universel (adresse)</strong> marche dans 100% des wallets, mais le montant n’est pas pré-rempli.</li>
          <li><strong>QR Avancé (EIP-681)</strong> marche dans certains wallets uniquement.</li>
        </ul>
      </section>
    </div>
  );
}

function Row({ k, v, link }) {
  const body = <span className="font-mono">{v}</span>;
  return (
    <div className="flex justify-between gap-4">
      <span className="text-white/50">{k}</span>
      {link ? (
        <a href={link} target="_blank" rel="noreferrer" className="underline">
          {body}
        </a>
      ) : body}
    </div>
  );
}
