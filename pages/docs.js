// pages/docs.js — version simple comme avant (Next.js Pages Router, Tailwind, thème noir/or)

export default function Docs() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-5xl px-6 py-12">
        {/* En-tête */}
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">NOOR — Documentation</h1>
        <p className="mt-3 text-sm md:text-base text-neutral-300">
          Transparence d'abord. Documents officiels publiés du projet NOOR (NUR).
        </p>

        {/* Cartes */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LP Proof 2025 (Public) */}
          <article className="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-6">
            <span className="inline-flex items-center rounded-full border border-yellow-500/50 px-2.5 py-0.5 text-[10px] uppercase tracking-wide text-yellow-400">Public</span>
            <h2 className="mt-3 text-xl font-semibold">LP Proof 2025 (Public)</h2>
            <p className="mt-2 text-sm text-neutral-300">
              Résumé public de la préparation à la liquidité (Proof of Light). Aucune donnée personnelle.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <a
                href="/docs/NOOR_LP_Proof_2025_Public_v2.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-yellow-500/10 px-4 py-2 text-sm font-medium text-yellow-300 ring-1 ring-inset ring-yellow-500/40 hover:bg-yellow-500/20"
              >
                Ouvrir le PDF
              </a>
              <a
                href="/docs/NOOR_LP_Proof_2025_Public_v2.pdf"
                download
                className="inline-flex items-center gap-2 rounded-xl border border-neutral-700 px-4 py-2 text-sm text-neutral-200 hover:bg-neutral-900"
              >
                Télécharger
              </a>
            </div>
          </article>

          {/* Legal Light 2025 */}
          <article className="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-6">
            <span className="inline-flex items-center rounded-full border border-yellow-500/50 px-2.5 py-0.5 text-[10px] uppercase tracking-wide text-yellow-400">Officiel</span>
            <h2 className="mt-3 text-xl font-semibold">Legal Light 2025 (FR/EN)</h2>
            <p className="mt-2 text-sm text-neutral-300">
              Cadre suisse Utility + Payment token. Aucune conversion fiat interne.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <a
                href="/docs/NOOR_Legal_Light_2025_FINAL.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-yellow-500/10 px-4 py-2 text-sm font-medium text-yellow-300 ring-1 ring-inset ring-yellow-500/40 hover:bg-yellow-500/20"
              >
                Ouvrir le PDF
              </a>
              <a
                href="/docs/NOOR_Legal_Light_2025_FINAL.pdf"
                download
                className="inline-flex items-center gap-2 rounded-xl border border-neutral-700 px-4 py-2 text-sm text-neutral-200 hover:bg-neutral-900"
              >
                Télécharger
              </a>
            </div>
          </article>
        </div>

        {/* Note */}
        <p className="mt-10 text-xs text-neutral-400">
          Cette page ne publie aucune donnée personnelle. Pour toute question, écrivez à
          {" "}
          <a href="mailto:noorfinances@gmail.com" className="text-yellow-300 hover:text-yellow-200 underline underline-offset-2">noorfinances@gmail.com</a>.
        </p>
      </div>
    </main>
  );
}
