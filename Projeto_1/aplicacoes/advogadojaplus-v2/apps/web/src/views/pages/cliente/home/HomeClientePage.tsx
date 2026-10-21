"use client";

import { Bell, ClipboardList, House, Menu, Star, UserRound, UsersRound } from "lucide-react";
import { PageSection } from "./HomeClientePage.styles";
import { useHomeClientePage } from "./HomeClientePage.hooks";

export default function HomeClientePage() {
  const { router, ready, logout, notify, home, error, area, setArea, menu, setMenu, visible } = useHomeClientePage();

  return (
    <PageSection>
      <header className="homeHeader">
        <button className="homeMenu" onClick={() => setMenu(value => !value)} aria-label="Abrir menu"><Menu size={22} /></button>
        <div className="homeBrand"><img src="/reference/brand_symbol.svg" alt="" /><b>AdvogadoJá</b></div>
        <button className="notif" onClick={() => router.push("/em-construcao")} aria-label="Notificações"><Bell size={22} /><span>3</span></button>
      </header>

      {menu && (
        <nav className="drawer" aria-label="Menu da cliente">
          <strong>Menu da cliente</strong>
          {["Meu perfil", "Solicitações", "Contatos liberados", "Notificações", "Configurações", "Suporte"].map(item => (
            <button key={item} onClick={() => router.push("/em-construcao")}>{item} ›</button>
          ))}
          <button onClick={async () => {
            try { await logout(); router.push("/login"); }
            catch (cause) { notify((cause as Error).message); }
          }}>Sair</button>
        </nav>
      )}

      <main className="homeContent">
        <span className="eyebrow">{home?.greeting.toUpperCase() || (ready ? "CARREGANDO HOME…" : "VALIDANDO SESSÃO…")}</span>
        <h1>Encontre um profissional</h1>
        <p className="lead">Veja profissionais próximos no raio padrão ou refine o resultado pelos filtros.</p>

        <section className="filterCard">
          <h2>Filtrar profissionais</h2>
          <p>O Início já mostra os profissionais dentro do raio padrão. Use os filtros para refinar.</p>
          <div className="filterChoice">
            <span>Tipo de atendimento</span>
            <button className="selected">Todos</button>
            <button onClick={() => router.push("/em-construcao")}>Contato prioritário</button>
            <button onClick={() => router.push("/em-construcao")}>Consultoria</button>
          </div>
          <label className="field"><span>Área de atuação</span>
            <select value={area} onChange={event => setArea(event.target.value)}>
              {["Todas as áreas", "Criminal", "Cível", "Trabalhista", "Consumidor", "Família", "Previdenciário", "Direito Intelectual", "Tributário", "Trânsito", "Imobiliário", "Bancário", "Empresarial", "Não sei informar"].map(value => <option key={value}>{value}</option>)}
            </select>
          </label>
          <div className="filterActions">
            <button className="primaryBtn" onClick={() => setArea(area)}>Aplicar filtro</button>
            <button className="textLink" onClick={() => setArea("Todas as áreas")}>Limpar filtros</button>
          </div>
        </section>

        {error && <p role="alert">{error}</p>}
        <div className="resultsHead"><h2>Profissionais próximos</h2><span>{visible.length} encontrados</span></div>
        <div className="professionalList">
          {visible.map(professional => (
            <article className="professional" key={professional.id}>
              <div className="avatar">{professional.name.split(" ").map(part => part[0]).join("")}</div>
              <div className="professionalCopy">
                <strong>{professional.name}</strong>
                <p>{professional.area} · {professional.city}</p>
                <small><Star size={13} fill="currentColor" /> {professional.rating.toFixed(1)}</small>
              </div>
              <button onClick={() => router.push("/em-construcao")}>Ver perfil ›</button>
            </article>
          ))}
          {!visible.length && !error && <p>Nenhum profissional encontrado para este filtro.</p>}
        </div>
      </main>

      <footer className="bottomNav">
        <button className="active" onClick={() => router.push("/cliente/inicio")}><House size={21} /><span>Início</span></button>
        <button onClick={() => router.push("/em-construcao")}><ClipboardList size={21} /><span>Solicitações</span></button>
        <button onClick={() => router.push("/em-construcao")}><UsersRound size={21} /><span>Contatos</span></button>
        <button onClick={() => router.push("/em-construcao")}><UserRound size={21} /><span>Perfil</span></button>
      </footer>
    </PageSection>
  );
}
