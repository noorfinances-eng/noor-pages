// pages/merchant.js
import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import AcceptNoor from "../components/AcceptNoor";

const NUR_CONTRACT = "0xA20212290866C8A804a89218c8572F28C507b401";
const BSC_CHAIN_ID_DEC = 56;
const BSC_CHAIN_ID_HEX = "0x38";

function MerchantInner() {
  const [merchantName, setMerchantName] = useState("");
  const [invoiceId, setInvoiceId] = useState("");
  const [customer, setCustomer] = useState("");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [txHash, setTxHash] = useState(""); // NEW

  const [qrMode, setQrMode] = useState("link"); // "link" | "universal" | "eip681"
  const [baseUrl, setBaseUrl] = useState("");
  const canvasRef = useRef(null);

  const short = (a) => (!a ? "—" : `${a.slice(0, 6)}…${a.slice(-4)}`);

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
    const hash = p.get("tx");
    if (to && /^0x[0-9a-fA-F]{40}$/.test(to)) setRecipient(to);
    if (amt && !isNaN(Number(amt))) setAmount(amt);
    if (inv) setInvoiceId(inv.slice(0, 60));
    if (m) setMerchantName(m.slice(0, 60));
    if (desc) setDescription(desc.slice(0, 140));
    if (cust) setCustomer(cust.slice(0, 60));
    if (hash) setTxHash(hash);
  }, []);

  const toWei = (numString) => {
    if (!numString || isNaN(Number(numString))) return "0";
    const [intPart, fracPart = ""] = String(numString).split(".");
    const frac = (fracPart + "000000000000000000").slice(0, 18);
    const joined = (intPart || "0") + frac;
    return joined.replace(/^0+(?=\d)/, "") || "0";
  };

  const eip681 = useMemo(() => {
    const to = (recipient || "").trim();
    if (!to || to.length !== 42 || !to.startsWith("0x")) return "";
    const wei = toWei(amount || "0");
    return `ethereum:${NUR_CONTRACT}/transfer?address=${to}&uint256=${wei}&chain_id=${BSC_CHAIN_ID_DEC}`;
  }, [recipient, amount]);

  const universalPayload = useMemo(() => {
    const meta = { chainId: BSC_CHAIN_ID_DEC, recipient: (recipient || "").trim(), hint: { token: NUR_CONTRACT, amountNUR: amount || "", invoiceId, merchantName, description, customer } };
    const addr = (recipient || "").trim();
    return (addr ? addr : "NOOR") + "\nMETA:" + JSON.stringify(meta);
  }, [recipient, amount, invoiceId, merchantName, description, customer]);

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
    if (txHash) u.searchParams.set("tx", txHash);
    u.hash = "open";
    return u.toString();
  }, [baseUrl, recipient, amount, invoiceId, merchantName, description, customer, txHash]);

  const qrContent = useMemo(() => {
    if (qrMode === "eip681") return eip681 || "NOOR";
    if (qrMode === "universal") return universalPayload || "NOOR";
    return payLink || "NOOR";
  }, [qrMode, eip681, universalPayload, payLink]);

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

  // ---------- SNIPPET À COPIER (props injectées) ----------
  const widgetSnippet = useMemo(() => {
    const props = {
      to: (recipient || "").trim(),
      amount: (amount || "").trim(),
      label: (merchantName ? `Pay ${merchantName} in NOOR` : "Pay with NOOR"),
      note: description ? `${invoiceId ? invoiceId + " — " : ""}${description}` : (invoiceId || ""),
      lang: "en",
      mode: "link",
      compact: true
    };
    const propStr = Object.entries(props)
      .filter(([,v]) => v !== "" && v !== null && v !== undefined)
      .map(([k,v]) => {
        if (typeof v === "boolean") return `${k}={${v}}`;
        return `${k}="${String(v).replace(/"/g, '&quot;')}"`;
      })
      .join(" ");
    return [
      `import AcceptNoor from "../components/AcceptNoor";`,
      ``,
      `<AcceptNoor ${propStr} />`
    ].join("\n");
  }, [recipient, amount, merchantName, description, invoiceId]);

  // ----------- GÉNÉRATION PDF (util client-only) -----------
  const handleGeneratePDF = async () => {
    try {
      const { generateInvoicePDF } = await import("../utils/invoice");
      await generateInvoicePDF({
        merchantName,
        invoiceId: invoiceId || "INV-0001",
        customer,
        recipient: (recipient || "").trim(),
        amount: (amount || "").trim(),
        description,
        tokenSymbol: "NUR",
        networkName: "BNB Smart Chain (56)",
        contractAddress: NUR_CONTRACT,
        txHash: (txHash || "").trim(),
        siteOrigin: baseUrl || ""
      });
    } catch (e) {
      alert("Erreur lors de la génération PDF.");
    }
  };

  return (
    <div className="space-y-10">
      {/* HERO */}
      <section className="text-center">
        <h2 className="text-4xl md:text-5xl font-semibold">Merchant — Accept NOOR (NUR)</h2>
        <p className="mt-3 text-white/70 max-w-2xl mx-auto">
          Génère un QR de paiement, un widget « Accept NOOR » et une facture PDF locale.
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
              <input value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="0x..."
                className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 focus:outline-none" />
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

            <div>
              <label className="block text-sm text-white/60 mb-1">Tx hash (optionnel, après paiement)</label>
              <input value={txHash} onChange={(e) => setTxHash(e.target.value)} placeholder="0x..."
                className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 focus:outline-none" />
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

          <div className="mt-6 space-y-2 text-sm">
            <Row k="Marchand" v={merchantName || "—"} />
            <Row k="Facture" v={invoiceId || "—"} />
            <Row k="Client" v={customer || "—"} />
            <Row k="Réseau" v="BNB Smart Chain (56)" />
            <Row k="Token (hint)" v={short(NUR_CONTRACT)} link={`https://bscscan.com/address/${NUR_CONTRACT}`} />
            <Row k="Destinataire" v={short(recipient || "—")} />
            <Row k="Montant (NUR)" v={amount || "—"} />
            <Row k="Tx hash" v={txHash || "—"} />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <button onClick={() => copy(payLink)} className="px-3 py-2 rounded-lg border border-white/10 hover:bg-white/10 text-sm" disabled={!payLink}>
              Copier lien /pay
            </button>
            <button onClick={() => copy(eip681)} className="px-3 py-2 rounded-lg border border-white/10 hover:bg-white/10 text-sm" disabled={!eip681}>
              Copier lien EIP-681
            </button>
          </div>

          <div className="mt-4">
            <button
              onClick={handleGeneratePDF}
              className="w-full px-4 py-2 rounded-lg bg-gold text-black font-medium disabled:opacity-50"
              disabled={!invoiceId || !recipient || !amount}
            >
              Générer facture PDF
            </button>
            <p className="mt-2 text-xs text-white/50">
              Remplis au minimum : <strong>Invoice #</strong>, <strong>Adresse</strong>, <strong>Montant</strong>.  
              Ajoute le <strong>Tx hash</strong> après paiement pour l’inclure dans la facture.
            </p>
          </div>
        </div>
      </section>

      {/* WIDGET PREVIEW + SNIPPET */}
      <section className="border-t border-white/10 pt-8">
        <h3 className="text-xl font-semibold mb-2">3) Widget « Accept NOOR » (à intégrer sur ton site)</h3>
        <p className="text-white/70 mb-4">Aperçu ci-dessous (compact). Le snippet est généré depuis les champs ci-dessus.</p>

        <div className="max-w-md">
          <AcceptNoor
            to={(recipient || "").trim()}
            amount={(amount || "").trim()}
            label={merchantName ? `Pay ${merchantName} in NOOR` : "Pay with NOOR"}
            note={description ? `${invoiceId ? invoiceId + " — " : ""}${description}` : (invoiceId || "")}
            lang="en"
            mode="link"
            compact
          />
        </div>

        <SnippetBlock widgetSnippet={widgetSnippet} />
      </section>

      {/* NOTES */}
      <section className="border-t border-white/10 pt-8">
        <h3 className="text-xl font-semibold mb-2">Conseils</h3>
        <ul className="list-disc ml-5 space-y-2 text-white/75">
          <li>Tu peux générer la facture PDF <em>avant</em> le paiement (sans tx hash) ou <em>après</em> (avec tx hash + lien BscScan).</li>
          <li>Le PDF est créé localement (zéro backend), et téléchargé dans le navigateur.</li>
          <li>Le widget et les QR n’exposent jamais de clés privées.</li>
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
        <a href={link} target="_blank" rel="noreferrer" className="underline">{body}</a>
      ) : body}
    </div>
  );
}

function SnippetBlock({ widgetSnippet }) {
  const copy = async (txt) => { try { await navigator.clipboard.writeText(txt); alert("Copié !"); } catch {} };
  return (
    <div className="mt-6">
      <h4 className="font-semibold mb-2">Snippet à coller (React/Next)</h4>
      <pre className="whitespace-pre-wrap text-xs bg-black/40 border border-white/10 rounded-lg p-3">
{widgetSnippet}
      </pre>
      <button onClick={() => copy(widgetSnippet)} className="mt-2 px-3 py-2 rounded-lg border border-white/10 hover:bg-white/10 text-sm">
        Copier le snippet
      </button>
    </div>
  );
}
