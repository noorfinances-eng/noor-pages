// pages/pay.js
import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";

const NUR_CONTRACT = "0xA20212290866C8A804a89218c8572F28C507b401"; // NOORTokenV2
const BSC_CHAIN_ID_DEC = 56;
const BSC_CHAIN_ID_HEX = "0x38";

function PayInner() {
  const [baseUrl, setBaseUrl] = useState("");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

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

  const [qrMode, setQrMode] = useState("link"); // "link" | "universal" | "eip681"
  const canvasRef = useRef(null);

  const short = (a) => (!a ? "—" : `${a.slice(0, 6)}…${a.slice(-4)}`);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setBaseUrl(window.location.origin);
    const params = new URLSearchParams(window.location.search || "");
    const to = params.get("to");
    const amt = params.get("amount");
    if (to && /^0x[0-9a-fA-F]{40}$/.test(to)) setRecipient(to);
    if (amt && !isNaN(Number(amt))) setAmount(amt);
  }, []);

  const toWei = (numString) => {
    if (!numString || isNaN(Number(numString))) return "0";
    const [i, f = ""] = String(numString).split(".");
    const frac = (f + "000000000000000000").slice(0, 18);
    const joined = (i || "0") + frac;
    return joined.replace(/^0+(?=\d)/, "") || "0";
  };

  const eip681 = useMemo(() => {
    const to = (recipient || "").trim();
    if (!to || to.length !== 42 || !to.startsWith("0x")) return "";
    const wei = toWei(amount || "0");
    return `ethereum:${NUR_CONTRACT}/transfer?address=${to}&uint256=${wei}&chain_id=${BSC_CHAIN_ID_DEC}`;
  }, [recipient, amount]);

  // ✅ Adresse pure (compat max wallets)
  const universalPayload = useMemo(() => {
    const addr = (recipient || "").trim();
    return addr || "0x0000000000000000000000000000000000000000";
  }, [recipient]);

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

  const qrContent = useMemo(() => {
    if (qrMode === "eip681") return eip681 || "NOOR";
    if (qrMode === "universal") return universalPayload;
    return shareLink || "NOOR";
  }, [qrMode, eip681, universalPayload, shareLink]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!canvasRef.current) return;
      try {
        const QR = await import("qrcode");
        if (!mounted) return;
        await QR.toCanvas(canvasRef.current, qrContent, { errorCorrectionLevel: "M", margin: 2, scale: 6 });
      } catch {}
    })();
    return () => { mounted = false; };
  }, [qrContent]);

  const getInjectedEthereum = () => {
    if (typeof window === "undefined") return null;
    const eth = window.ethereum;
    if (!eth) return null;
    if (eth.providers?.length) {
      const mm = eth.providers.find((p) => p.isMetaMask);
      if (mm) return mm;
      const rabby = eth.providers.find((p) => p.isRabby);
      if (rabby) return rabby;
      return eth.providers[0];
    }
    return eth;
  };

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

  const openInMetaMaskMobile = () => {
    if (typeof window === "undefined") return;
    const u = new URL(window.location.href);
    const mm = `metamask://dapp/${window.location.host}${u.pathname}${u.search}`;
    window.location.href = mm;
  };

  const connectInjected = async () => {
    setErrMsg("");
    try {
      const eth = getInjectedEthereum();
      if (!eth) {
        setErrMsg("Aucun wallet détecté (MetaMask/Rabby). Sur mobile, ouvre cette page dans l’app MetaMask (bouton ci-dessous).");
        return;
      }
      await ensureBsc(eth);

      const { BrowserProvider, formatUnits, Contract } = await import("ethers");
      const provider = new BrowserProvider(eth);
      const [address] = await eth.request({ method: "eth_requestAccounts" });

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

      const chainIdHex = await eth.request({ method: "eth_chainId" });
      setWallet({
        connected: true,
        address,
        chainId: parseInt(chainIdHex, 16),
        nurSymbol: sym || "NUR",
        nurDecimals: dec || 18,
        nurBalance: nurBal,
        bnbBalance: bnbBal
      });

      eth.on?.("accountsChanged", () => location.reload());
      eth.on?.("chainChanged", () => location.reload());
    } catch {
      setErrMsg("Connexion refusée ou erreur wallet.");
    }
  };

  const addNURToWallet = async () => {
    const eth = getInjectedEthereum();
    if (!eth) { alert("Wallet non détecté."); return; }
    try {
      await eth.request({
        method: "wallet_watchAsset",
        params: { type: "ERC20", options: { address: NUR_CONTRACT, symbol: wallet.nurSymbol || "NUR", decimals: wallet.nurDecimals || 18 } }
      });
    } catch {}
  };

  const sendNur = async () => {
    setErrMsg(""); setTxStatus("");
    try {
      const eth = getInjectedEthereum();
      if (!eth) { setErrMsg("Wallet non détecté."); return; }
      const to = (recipient || "").trim();
      if (!to || !to.startsWith("0x") || to.length !== 42) { setErrMsg("Adresse destinataire invalide."); return; }
      if (!amount || Number(amount) <= 0) { setErrMsg("Montant invalide."); return; }

      await ensureBsc(eth);

      const { BrowserProvider, Contract, parseUnits } = await import("ethers");
      const provider = new BrowserProvider(eth);
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

  const copy = async (txt) => { try { await navigator.clipboard.writeText(txt); alert("Copié !"); } catch {} };

  return (
    <div className="space-y-10">
      <section className="text-center">
        <h2 className="text-4xl md:text-5xl font-semibold">Pay with NOOR</h2>
        <p className="mt-3 text-white/70 max-w-2xl mx-auto">
          QR : <span className="text-gold font-medium">Lien (HTTPS)</span> • <span className="text-gold font-medium">Adresse pure (wallets)</span> • <span className="text-gold font-medium">EIP-681 (avancé)</span>. Ou <span className="text-gold font-medium">envoi direct</span> via wallet connecté.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3 flex-wrap">
          <button onClick={connectInjected} className="px-4 py-2 rounded-lg bg-gold text-black font-medium">Connecter le wallet</button>
          <button onClick={addNURToWallet} className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10" disabled={!wallet.connected}>
            Ajouter NUR au wallet
          </button>
          <button onClick={openInMetaMaskMobile} className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10">
            Ouvrir dans MetaMask (mobile)
          </button>
        </div>
        {wallet.connected ? (
          <div className="mt-3 text-sm text-white/70">
            <div>Connecté : <span className="font-mono">{short(wallet.address)}</span> • Réseau : {wallet.chainId}</div>
            <div>Solde ~ {wallet.nurBalance ?? "—"} NUR • {wallet.bnbBalance ?? "—"} BNB</div>
          </div>
        ) : (
          errMsg ? <p className="mt-3 text-red-400 text-sm">{errMsg}</p> : null
        )}
        {!wallet.connected && (
          <p className="text-xs text-white/50 mt-2">
            Astuce : sur mobile, scanne le <strong>QR Adresse pure</strong> avec le scanner MetaMask, ou utilise le bouton MetaMask (mobile).
          </p>
        )}
      </section>

      <section className="grid gap-6 md:grid-cols-2">
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

        <div className="p-5 rounded-xl border border-white/10">
          <h3 className="text-xl font-semibold">2) QR ou envoi direct</h3>
          <div className="mt-3 inline-flex rounded-lg border border-white/10 overflow-hidden">
            <button onClick={() => setQrMode("link")} className={`px-3 py-2 text-sm ${qrMode === "link" ? "bg-white/10" : "hover:bg-white/5"}`}>QR Lien (HTTPS)</button>
            <button onClick={() => setQrMode("universal")} className={`px-3 py-2 text-sm ${qrMode === "universal" ? "bg-white/10" : "hover:bg-white/5"}`}>QR Adresse pure</button>
            <button onClick={() => setQrMode("eip681")} className={`px-3 py-2 text-sm ${qrMode === "eip681" ? "bg-white/10" : "hover:bg-white/5"}`}>QR Avancé (EIP-681)</button>
          </div>

          <div className="mt-4 flex flex-col items-center gap-4">
            <canvas ref={canvasRef} className="rounded-lg border border-white/10 bg-white p-2" />
            <div className="text-center text-sm text-white/60">
              {qrMode === "link" && "Scanne avec l’appareil photo natif : ouvre /pay pré-remplie (navigateur)."}
              {qrMode === "universal" && "Scanne avec le QR scanner du wallet (MetaMask/Rabby) : adresse destinataire uniquement."}
              {qrMode === "eip681" && "Wallets compatibles : prépare un transfer() du token NUR (BSC #56) avec montant."}
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
    </div>
  );
}

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
