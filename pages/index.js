export default function Home() {
  return (
    <main style={{maxWidth: 800, margin: "40px auto", padding: 16}}>
      <h1>NOOR — baseline OK</h1>
      <p>Si tu vois cette page, le déploiement fonctionne. Va sur /en, /de ou /fr.</p>
      <ul>
        <li><a href="/en">/en</a></li>
        <li><a href="/de">/de</a></li>
        <li><a href="/fr">/fr</a></li>
      </ul>
    </main>
  );
}
