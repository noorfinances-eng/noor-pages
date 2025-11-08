// components/AcceptNoor.js
import { useEffect, useMemo, useRef, useState } from "react";

const NUR_CONTRACT = "0xA20212290866C8A804a89218c8572F28C507b401";
const BSC_CHAIN_ID_DEC = 56;

export default function AcceptNoor({
  to,                 // adresse BSC du marchand (obligatoire)
  amount = "",        // montant en NUR (optionnel)
  label = "Pay with NOOR", // texte du bouton
  note = "",          // note courte (optionnel, ex: "Invoice #123")
  lang = "en",        // "en" | "fr" | "de"
  mode = "link",      // "link" | "universal" | "eip681"
  compact = false     // true = style compact
}) {
  const [baseUrl, setBaseUrl] = useState("");
  const canvasRef = useRef(null);

  const t = (k) => {
    const dict = {
      en: {
        title: "Accept NOOR",
        hint: "Scan to pay in NUR",
        btn: label || "Pay with NOOR",
      },
      fr: {
        title: "Accepter NOOR",
        hint: "Scannez pour payer en NUR",
        btn: label || "Payer avec NOOR",
      },
      de: {
        title: "NOOR akzeptieren",
        hint: "Zum Bezahlen in NUR scannen",
        btn: label || "Mit NOOR zahlen",
      }
    };
    return (dict[lang] || dict.en)[k];
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    setBaseUrl(window.location.origin);
  }, []);

  // simple 18-decimals toWei sans lib
  const toWei = (numString) => {
    if (!numString || isNaN(Number(numString))) return "0";
    const [intPart, fracPart = ""] = String(numString).split(".");
    const frac = (fracPart + "000000000000000000").slice(0, 18);
    const joined = (intPart || "0") + frac;
    return joined.replace(/^0+(?=\d)/, "") || "0";
  };

  const payLink = useMemo(() => {
    if (!baseUrl) return "";
    const u = new URL(baseUrl + "/pay");
    if (to) u.searchParams.set("to", to.trim());
    if (amount) u.searchParams.set("amount", String(amount).trim());
    if (note) u.searchParams.set("desc", note.slice(0, 140));
    u.hash = "open";
    return u.toString();
  }, [baseUrl, to, amount, note]);

  const eip681 = useMemo(() => {
    if (!to || !to.startsWith("0x") || to.length !== 42) return "";
    const wei = toWei(amount || "0");
    return `ethereum:${NUR_CONTRACT}/transfer?address=${to.trim()}&uint256=${wei}&chain_id=${BSC_CHAIN_ID_DEC}`;
  }, [to, amount]);

  const universalPayload = useMemo(() => {
    const meta = { chainId: BSC_CHAIN_ID_DEC, recipient: (to || "").trim(), hint: { token: NUR_CONTRACT, amountNUR: amount || "", note } };
    const addr = (to || "").trim();
    return (addr ? addr : "NOOR") + "\nMETA:" + JSON.stringify(meta);
  }, [to, amount, note]);

  const qrContent = useMemo(() => {
    if (mode === "eip681") return eip681 || "NOOR";
    if (mode === "universal") return universalPayload || "NOOR";
    return payLink || "NOOR";
  }, [mode, eip681, universalPayload, payLink]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!canvasRef.current) return;
      try {
        const QR = await import("qrcode");
        if (!mounted) return;
        await QR.toCanvas(canvasRef.current, qrContent, { errorCorrectionLevel: "M", margin: 1, scale: compact ? 4 : 6 });
      } catch {/* ignore */}
    })();
    return () => { mounted = false; };
  }, [qrContent, compact]);

  const short = (a) => (!a ? "—" : `${a.slice(0, 6)}…${a.slice(-4)}`);

  return (
    <div className={`rounded-xl border border-white/10 ${compact ? "p-3" : "p-5"} text-white`}>
      {!compact && <h4 className="text-lg font-semibold mb-2">{t("title")}</h4>}
      <div className={`flex ${compact ? "flex-col items-center gap-2" : "items-center gap-4"}`}>
        <canvas ref={canvasRef} className="rounded-lg border border-white/10 bg-white p-2" />
        <div className={`${compact ? "text-center" : ""}`}>
          <div className="text-white/60 text-sm">{t("hint")}</div>
          <div className="mt-2 text-sm">
            <div>To: <span className="font-mono">{short(to)}</span></div>
            <div>Amount: <span className="font-mono">{amount || "—"} NUR</span></div>
          </div>
          <a href={payLink || "#"} className="inline-block mt-3 px-3 py-2 rounded-lg bg-gold text-black font-medium disabled:opacity-50"
             onClick={(e) => { if (!payLink) e.preventDefault(); }}>
            {t("btn")}
          </a>
        </div>
      </div>
    </div>
  );
}
