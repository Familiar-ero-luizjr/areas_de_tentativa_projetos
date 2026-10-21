const meta = {
  cliente: { label: "Cliente · Maria", icon: "👤" },
  advogado: { label: "Advogado · João", icon: "⚖️" },
  estudante: { label: "Estudante · Ana", icon: "🎓" },
  administrador: { label: "Administrador", icon: "🛡️" },
};
const $ = (id) => document.getElementById(id),
  state = {
    profile: "cliente",
    data: null,
    current: "splash",
    history: [],
    selections: {},
    cache: {},
  };
const esc = (s) =>
  String(s ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
function rootId() {
  const f = state.data.flow;
  return f.splash ? "splash" : Object.keys(f)[0];
}
function node() {
  return state.data?.flow[state.current];
}
function routeOf(n) {
  return (
    n?.routes?.find((r) => r.id === state.selections[state.current]) ||
    n?.routes?.[0]
  );
}
function effectiveNext(n) {
  return n?.routes?.length ? routeOf(n)?.next : n?.next;
}
function go(id, record = true) {
  if (!state.data.flow[id]) return;
  if (record) state.history.push(state.current);
  state.current = id;
  render();
}
function reset() {
  state.current = rootId();
  state.history = [];
  state.selections = {};
  render();
}
function render() {
  const n = node();
  if (!n) return;
  $("profileLabel").textContent = meta[state.profile].label;
  $("currentTitle").textContent = n.title || state.current;
  $("currentMeta").textContent = n.screen
    ? `Tela: ${n.screen}`
    : `Estado da jornada · ${state.current}`;
  $("note").textContent = n.note || "";
  $("back").disabled = !state.history.length;
  $("next").disabled = !effectiveNext(n) || !state.data.flow[effectiveNext(n)];
  $("next").textContent = effectiveNext(n) ? "Avançar →" : "Fim deste caminho";
  $("choices").innerHTML = (n.routes || [])
    .map(
      (r, i) =>
        `<button class="choice ${routeOf(n) === r ? "selected" : ""}" data-route="${esc(r.id)}"><span>${esc(r.label)}</span><small>${esc(r.detail || "")}</small></button>`,
    )
    .join("");
  $("nodes").innerHTML = Object.entries(state.data.flow)
    .filter(
      ([id, x]) =>
        !$("search").value ||
        `${id} ${x.title} ${x.screen || ""}`
          .toLowerCase()
          .includes($("search").value.toLowerCase()),
    )
    .map(
      ([id, x]) =>
        `<button class="node ${id === state.current ? "current" : ""}" data-node="${esc(id)}"><span class="dot"></span>${esc(x.title || id)}${x.state ? " · estado" : ""}</button>`,
    )
    .join("");
  $("preview").replaceChildren();
  if (n.screen && state.data.screens[n.screen]) {
    const sc = state.data.screens[n.screen];
    const frame = document.createElement("iframe");
    frame.className = "frame";
    frame.title = "Prévia visual de " + (sc.name || n.title);
    frame.setAttribute("sandbox", "");
    const css = `html,body{margin:0!important;min-width:0!important;width:100%!important;min-height:100%!important;background:#eef2f6!important}body{overflow:auto!important}.screen-runtime,.prototype-screen{display:block!important;min-height:100dvh!important;width:100%!important;max-width:none!important}button,a,input,select,textarea{pointer-events:none!important}.prototype-drawer,.drawer-backdrop,.open-index,.sheet{display:none!important}`;
    frame.srcdoc = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>${state.data.css}\n${sc.css || ""}\n${css}</style></head><body>${sc.html}</body></html>`;
    $("preview").append(frame);
  } else {
    $("preview").innerHTML =
      `<div class="placeholder"><h3>${esc(n.title || "Etapa sem tela própria")}</h3><p>${esc(n.note || "Esta etapa é representada como estado ou ação na jornada original.")}</p><small>${n.screen ? "Prévia não encontrada na biblioteca atual." : "Estado do fluxo: não há tela separada definida."}</small></div>`;
  }
}
async function setProfile(key) {
  if (!meta[key]) return;
  state.profile = key;
  state.data = null;
  $("currentTitle").textContent = "Carregando jornada…";
  $("profiles").innerHTML = Object.entries(meta)
    .map(
      ([k, v]) =>
        `<button class="profile ${k === key ? "active" : ""}" data-profile="${k}">${v.icon} ${v.label}</button>`,
    )
    .join("");
  $("preview").innerHTML = '<div class="loading">Carregando jornada…</div>';
  try {
    if (!state.cache[key]) {
      const r = await fetch(`${key}.json`);
      if (!r.ok) throw Error("HTTP " + r.status);
      state.cache[key] = await r.json();
      if (!state.cache[key].flow || !state.cache[key].screens)
        throw Error("Dados da jornada incompletos");
    }
    state.data = state.cache[key];
    reset();
    const url = new URL(location.href);
    url.searchParams.set("jornada", key);
    history.replaceState({}, "", url);
  } catch (e) {
    $("preview").innerHTML =
      `<div class="placeholder error">Não foi possível carregar os dados da jornada.<p>Abra o laboratório com um servidor HTTP local (veja o README). Detalhes: ${esc(e.message)}</p></div>`;
    $("currentTitle").textContent = "Falha ao carregar";
    $("profiles").innerHTML = Object.entries(meta)
      .map(
        ([k, v]) =>
          `<button class="profile ${k === key ? "active" : ""}" data-profile="${k}">${v.icon} ${v.label}</button>`,
      )
      .join("");
  }
}
$("profiles").addEventListener("click", (e) => {
  const b = e.target.closest("[data-profile]");
  if (b) setProfile(b.dataset.profile);
});
$("nodes").addEventListener("click", (e) => {
  const b = e.target.closest("[data-node]");
  if (b) go(b.dataset.node);
});
$("choices").addEventListener("click", (e) => {
  const b = e.target.closest("[data-route]");
  if (b) {
    state.selections[state.current] = b.dataset.route;
    render();
  }
});
$("back").addEventListener("click", () => {
  if (state.history.length) {
    state.current = state.history.pop();
    render();
  }
});
$("next").addEventListener("click", () => {
  const to = effectiveNext(node());
  if (to) go(to);
});
$("restart").addEventListener("click", reset);
$("search").addEventListener("input", () => {
  if (state.data) render();
});
setProfile(new URL(location.href).searchParams.get("jornada") || "cliente");
window.addEventListener("error", (e) => {
  const title = document.getElementById("currentTitle");
  if (title && title.textContent.includes("Carregando")) {
    title.textContent = "Erro no protótipo";
    document.getElementById("preview").innerHTML =
      '<div class="placeholder error">Erro de execução: ' +
      esc(e.message) +
      "</div>";
  }
});
