// pages/merchant.js
import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";

const NUR_CONTRACT = "0xA20212290866C8A804a89218c8572F28C507b401"; // NOORTokenV2
const BSC_CHAIN_ID_DEC = 56;
const BSC_CHAIN_ID_HEX = "0x38";

function MerchantInner() {
  // Merchant form
  const [merchantName, setMerchantName] = useState("");
  const [invoiceId, setInvoiceId] = useState("");
  const [customer, setCustomer] = useState("");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  // QR mode
  const [qrMode, setQrMode] = useState("link"); // "link" | "universal" | "eip681"

  // baseUrl for share links
  const [baseUrl, setBaseUrl] = useState("");
  const canvasRef = useRef(null);

  const short = (a) => (!a ? "—" : `${a.slice(0, 6)}…${a.slice(-4)}`);

  // hydrate + URL prefill (?to=&amount=&inv=&m=)
  useEffect(() => {
    if (typeof window === "undefined") return;
    setBaseUrl(window.location.origin);
    const p = new URLSearchParams(window.location.search || "");
    const to = p.get("to");
    const amt = p.get("amount");
    const inv = p.get("inv");
    const m = p.get("m");
    const desc = p.get("desc");
    const cust = p.get("cust");

    if (to && /^0x[0-9a-fA-F]{40}$/.test(to)) setRecipient(to);
    if (amt && !isNaN(Number(amt))) setAmount(amt);
    if (inv) setInvoiceId(inv.slice(0, 60));
    if (m) setMerchantName(m.slice(0, 60));
    if (desc) setDescription(desc.slice(0, 140));
    if (cust) setCustomer(cust.slice(0, 60));
  }, []);

  // toWei (18 decimals) without deps
  const toWei = (numString) => {
    if (!numString || isNaN(Number(numString))) return "0";
    const [intPart, fracPart = ""] = String(numString).split(".");
    const frac = (fracPart + "000000000000000000").slice(0, 18);
    const joined = (intPart || "0") + frac;
    return joined.replace(/^0+(?=\d)/, "") || "0";
  };

  // EIP-681 payload
  const eip681 = useMemo(() => {
    const to = (recipient || "").trim();
    if (!to || to.length !== 42 || !to.startsWith("0x")) return "";
    const wei = toWei(amount || "0");
    // Note: certains wallets ignorent "chain_id". C’est un plus, pas essentiel.
    return `ethereum:${NUR_CONTRACT}/transfer?address=${to}&uint256=${wei}&chain_id=${BSC_CHAIN_ID_DEC}`;
  }, [recipient, amount]);

  // Universal payload (address + META hint)
  const universalPayload = useMemo(() => {
    const meta = {
      chainId: BSC_CHAIN_ID_DEC,
      recipient: (recipient || "").trim(),
      hint: { token: NUR_CONTRACT, amountNUR: amount || "", invoiceId, merchantName, description, customer }
    };
    const addr = (recipient || "").trim();
    return (addr ? addr : "NOOR") + "\nMETA:" + JSON.stringify(meta);
  }, [recipient, amount, invoiceId, merchantName, description, customer]);

  // Link to /pay prefilled (recommended UX)
  const payLink = useMemo(() => {
    if (!baseUrl) return "";
    const u = new URL(baseUrl + "/pay");
    const to = (recipient || "").trim();
    const amt = (amount || "").trim();
    if (to) u.searchParams.set("to", to);
    if (amt) u.searchParams.set("amount", amt);
    if (invoiceId) u.searchParams.set("inv", invoiceId);
    if (merchantName) u.searchParams.set("m", merchantName);
    if (description) u.searchParams.set("desc", description);
    if (customer) u.searchParams.set("cust", customer);
    u.hash = "open";
    return u.toString();
  }, [baseUrl, recipient, amount, invoiceId, merchantName, description, customer]);

  // Current QR content
  const qrContent = useMemo(() => {
    if (qrMode === "eip681") return eip681 || "NOOR";
    if (qrMode === "universal") return universalPayload || "NOOR";
    return payLink || "NOOR";
  }, [qrMode, eip681, universalPayload, payLink]);

  // Render QR (client-only)
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!canvasRef.current) return;
      try {
        const QR = await import("qrcode");
        if (!mounted) return;
        await QR.toCanvas(canvasRef.current, qrContent, { errorCorrectionLevel: "M", margin: 2, scale: 6 });
      } catch { /* ignore */ }
    })();
    return () => { mounted = false; };
  }, [qrContent]);

  const copy = async (txt) => { try { await navigator.clipboard.writeText(txt); alert("Copié !"); } catch {} };

  // Helper: add BSC to wallet (for merchants testing)
  const addBscToWallet = async () => {
    if (typeof window === "undefined" || !window.ethereum) { alert("Wallet non détecté (MetaMask/Rabby)."); return; }
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
    } catch { alert("Impossible d'ajouter BSC au wallet."); }
  };

  return (
    <div className="space-y-10">
      {/* HERO */}
      <section className="text-center">
        <h2 className="text-4xl md:text-5xl font-semibold">Merchant — Accept NOOR (NUR)</h2>
        <p className="mt-3 text-white/70 max-w-2xl mx-auto">
          Génère un QR de paiement NOOR. Le client scanne → arrive sur <span className="text-gold font-medium">/pay</span> pré-rempli
          (ou utilise un QR universel compatible 100% wallets).
        </p>
        <div className="mt-6">
          <button onClick={addBscToWallet} className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10">
            Ajouter BSC au wallet
          </button>
        </div>
      </section>

      {/* FORM + QR */}
      <section className="grid gap-6 md:grid-cols-2">
        {/* FORM */}
        <div className="p-5 rounded-xl border border-white/10">
          <h3 className="text-xl font-semibold">1) Détails de la facture</h3>
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm text-white/60 mb-1">Nom du marchand</label>
              <input value={merchantName} onChange={(e) => setMerchantName(e.target.value)} placeholder="NOOR Store" maxLength={60}
                className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-1">N° facture / référence</label>
              <input value={invoiceId} onChange={(e) => setInvoiceId(e.target.value)} placeholder="INV-2025-0001" maxLength={60}
                className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-1">Client (optionnel)</label>
              <input value={customer} onChange={(e) => setCustomer(e.target.value)} placeholder="Nom du client" maxLength={60}
                className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 focus:outline-none" />
            </div>
            <div className="pt-2 border-t border-white/10" />
            <div>
              <label className="block text-sm text-white/60 mb-1">Adresse destinataire (wallet BSC du marchand)</label>
              <input value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="0x..." className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 focus:outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-white/60 mb-1">Montant (NUR)</label>
                <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Ex: 25" inputMode="decimal"
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-1">Description (optionnel)</label>
                <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Produit/Service" maxLength={140}
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 focus:outline-none" />
              </div>
            </div>

            <div className="text-sm text-white/50">
              Contrat NUR :{" "}
              <a className="underline" href={`https://bscscan.com/address/${NUR_CONTRACT}`} target="_blank" rel="noreferrer">
                {short(NUR_CONTRACT)}
              </a>
            </div>
          </div>
        </div>

        {/* QR + ACTIONS */}
        <div className="p-5 rounded-xl border border-white/10">
          <h3 className="text-xl font-semibold">2) QR de paiement</h3>

          {/* Switch QR */}
          <div className="mt-3 inline-flex rounded-lg border border-white/10 overflow-hidden">
            <button onClick={() => setQrMode("link")} className={`px-3 py-2 text-sm ${qrMode === "link" ? "bg-white/10" : "hover:bg-white/5"}`}>QR Lien (HTTPS)</button>
            <button onClick={() => setQrMode("universal")} className={`px-3 py-2 text-sm ${qrMode === "universal" ? "bg-white/10" : "hover:bg-white/5"}`}>QR Universel (adresse)</button>
            <button onClick={() => setQrMode("eip681")} className={`px-3 py-2 text-sm ${qrMode === "eip681" ? "bg-white/10" : "hover:bg-white/5"}`}>QR Avancé (EIP-681)</button>
          </div>

          <div className="mt-4 flex flex-col items-center gap-4">
            <canvas ref={canvasRef} className="rounded-lg border border-white/10 bg-white p-2" />
            <div className="text-center text-sm text-white/60">
              {qrMode === "link" && "Scanne avec l’appareil photo : ouvre /pay pré-remplie (to/amount…)"}
              {qrMode === "universal" && "Scanne dans n’importe quel wallet : envoi vers l’adresse (choisir NUR + saisir le montant)."}
              {qrMode === "eip681" && "Wallets compatibles uniquement : prépare un transfer() du token NUR (BSC #56)."}
            </div>
          </div>

          {/* Recap + actions */}
          <div className="mt-6 space-y-2 text-sm">
            <Row k="Marchand" v={merchantName || "—"} />
            <Row k="Facture" v={invoiceId || "—"} />
            <Row k="Client" v={customer || "—"} />
            <Row k="Réseau" v="BNB Smart Chain (56)" />
            <Row k="Token (hint)" v={short(NUR_CONTRACT)} link={`https://bscscan.com/address/${NUR_CONTRACT}`} />
            <Row k="Destinataire" v={short(recipient || "—")} />
            <Row k="Montant (NUR)" v={amount || "—"} />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <button onClick={() => copy(payLink)} className="px-3 py-2 rounded-lg border border-white/10 hover:bg-white/10 text-sm" disabled={!payLink}>
              Copier lien /pay
            </button>
            <button onClick={() => copy(eip681)} className="px-3 py-2 rounded-lg border border-white/10 hover:bg-white/10 text-sm" disabled={!eip681}>
              Copier lien EIP-681
            </button>
          </div>

          {/* Placeholder facture PDF — sera branché en 4C-3 */}
          <div className="mt-4">
            <button disabled className="w-full px-4 py-2 rounded-lg border border-white/10 text-white/40 cursor-not-allowed">
              Générer facture PDF (4C-3)
            </button>
            <p className="mt-2 text-xs text-white/40">
              À venir à l’étape 4C-3 : PDF local (marchand, client, items, montant, date, hash Tx).
            </p>
          </div>
        </div>
      </section>

      {/* NOTES */}
      <section className="border-t border-white/10 pt-8">
        <h3 className="text-xl font-semibold mb-2">Comment utiliser</h3>
        <ul className="list-disc ml-5 space-y-2 text-white/75">
          <li>Remplis **Marchand**, **Facture**, **Adresse** et **Montant**.</li>
          <li>Choisis **QR Lien (HTTPS)** pour un flux simple (ouvre la page /pay pré-remplie).</li>
          <li>Pour MetaMask directement : **QR Universel (adresse)** (montant saisi par le client).</li>
          <li>**EIP-681** : support partiel selon wallets.</li>
        </ul>
      </section>
    </div>
  );
}

// Désactiver SSR
function Merchant() { return <MerchantInner />; }
export default dynamic(() => Promise.resolve(Merchant), { ssr: false });

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
