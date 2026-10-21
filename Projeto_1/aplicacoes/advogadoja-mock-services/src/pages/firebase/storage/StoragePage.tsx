export default function StoragePage() {
  return (
    <section className="page-shell">
      <header className="page-heading">
        <p className="eyebrow">AdvogadoJá+ · Mock Services</p>
        <h1>Firebase Storage</h1>
        <p>Simulação de upload e metadados.</p>
      </header>
      <div className="panel">
        <h2>Estado do módulo</h2>
        <ul>
        <li>Arquivos ficam somente em memória.</li>
        <li>URLs retornadas são fictícias.</li>
        </ul>
      </div>
    </section>
  );
}
