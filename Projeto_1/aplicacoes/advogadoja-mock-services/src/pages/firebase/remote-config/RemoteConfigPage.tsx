export default function RemoteConfigPage() {
  return (
    <section className="page-shell">
      <header className="page-heading">
        <p className="eyebrow">AdvogadoJá+ · Mock Services</p>
        <h1>Remote Config</h1>
        <p>Flags e parâmetros ajustáveis no simulador.</p>
      </header>
      <div className="panel">
        <h2>Estado do módulo</h2>
        <ul>
        <li>Fetch/activate local.</li>
        <li>Valores editáveis em runtime.</li>
        </ul>
      </div>
    </section>
  );
}
