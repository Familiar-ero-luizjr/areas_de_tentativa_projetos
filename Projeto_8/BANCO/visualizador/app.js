
      (async () => {
        const KEY = "advogadoja.v6.prototipo.rascunho.";
        const EMBEDDED_CATALOGO = window.__BANCO_CATALOGO__;
        async function carregarCatalogo() {
          const telas = { ...EMBEDDED_CATALOGO.telas },
            componentes = { ...EMBEDDED_CATALOGO.componentes };
          for (const tipo of ["telas", "componentes"])
            for (const ref of EMBEDDED_CATALOGO.indice[tipo] || []) {
              const raw = (tipo === "telas" ? telas : componentes)[ref.id];
              if (!raw) continue;
              const overlay = localStorage.getItem(KEY + ref.id),
                obj = overlay ? JSON.parse(overlay) : raw;
              if (obj.identidade?.id !== ref.id)
                throw Error("Identidade divergente de índice: " + ref.id);
              (tipo === "telas" ? telas : componentes)[ref.id] = obj;
            }
          return {
            indice: EMBEDDED_CATALOGO.indice,
            telas,
            componentes,
            origem: EMBEDDED_CATALOGO.origem,
          };
        }
        async function salvarRegistro(tipo, id, registro) {
          if (!["telas", "componentes"].includes(tipo))
            throw Error("Tipo inválido");
          if (registro?.identidade?.id !== id)
            throw Error("O ID do registro não pode ser alterado ao salvar.");
          const dados = await carregarCatalogo();
          if (!dados.indice[tipo].some((x) => x.id === id))
            throw Error("Registro fora do índice ativo.");
          localStorage.setItem(KEY + id, JSON.stringify(registro));
          return {
            modo: "navegador",
            mensagem: "Salvo apenas neste navegador.",
          };
        }
        function limparRascunho(id) {
          localStorage.removeItem(KEY + id);
        }
        function baixar(nome, conteudo, mime = "application/json") {
          const b = new Blob([conteudo], { type: mime + ";charset=utf-8" });
          baixarBlob(nome, b);
        }
        function baixarBlob(nome, blob) {
          const u = URL.createObjectURL(blob),
            a = document.createElement("a");
          a.href = u;
          a.download = nome;
          document.body.append(a);
          a.click();
          a.remove();
          setTimeout(() => URL.revokeObjectURL(u), 1200);
        }
        const stringify = (obj) => JSON.stringify(obj, null, 2) + "\n";
        function montarPacote(catalogo, ids) {
          const telas = {},
            componentes = {},
            idsComps = new Set();
          for (const id of ids) {
            const t = catalogo.telas[id];
            if (!t) continue;
            telas[id] = t;
            for (const inst of t.componentes?.instancias || [])
              idsComps.add(inst.ref);
          }
          for (const id of idsComps) {
            const c = catalogo.componentes[id];
            if (c) componentes[id] = c;
          }
          return {
            schema: "advogadoja.intercambio.v6-provisorio",
            fonte: "catalogo-ativo-v6",
            escopo: {
              telas: Object.keys(telas),
              componentes: Object.keys(componentes),
            },
            telas,
            componentes,
            observacao:
              "Pacote editável, não fonte mestre; revisão por ID antes de aplicar.",
          };
        }

        // Contrato de projeção local. Não infere PK, FK, tabelas nem cardinalidades ausentes.
        const arr = (v) => (Array.isArray(v) ? v : []);
        const objects = (v) =>
          v && typeof v === "object" && !Array.isArray(v) ? v : {};
        function projetar(catalogo) {
          const entidades = new Map(),
            relacoes = new Map(),
            operacoes = [],
            fontes = [],
            telas = {},
            avisos = [];
          for (const [telaId, tela] of Object.entries(catalogo.telas || {})) {
            const dados = objects(tela.dados),
              persist = dados.persistencia;
            const declaration = Array.isArray(persist)
              ? { entidades: persist }
              : objects(persist);
            const names = [];
            for (const raw of arr(declaration.entidades)) {
              if (!raw || typeof raw !== "object") continue;
              const id = String(raw.id || raw.entidadeId || "").trim();
              if (!id) {
                avisos.push({ tela: telaId, tipo: "entidade-sem-id" });
                continue;
              }
              names.push(id);
              const campos = arr(raw.campos)
                .map((f) => (typeof f === "string" ? { id: f } : objects(f)))
                .filter((f) => f.id);
              if (!entidades.has(id))
                entidades.set(id, {
                  id,
                  nome: raw.nome || id,
                  dominio: raw.dominio || "nao_declarado",
                  campos: [],
                  telas: [],
                  origens: [],
                });
              const ent = entidades.get(id);
              if (!ent.telas.includes(telaId)) ent.telas.push(telaId);
              ent.origens.push(telaId);
              for (const field of campos) {
                const prev = ent.campos.find((x) => x.id === field.id);
                if (!prev) ent.campos.push({ ...field });
                else if (JSON.stringify(prev) !== JSON.stringify(field))
                  avisos.push({
                    tela: telaId,
                    tipo: "campo-divergente",
                    entidade: id,
                    campo: field.id,
                  });
              }
              if (ent.dominio !== (raw.dominio || "nao_declarado"))
                avisos.push({
                  tela: telaId,
                  tipo: "dominio-divergente",
                  entidade: id,
                });
            }
            for (const raw of arr(declaration.relacoes)) {
              if (!raw || typeof raw !== "object") continue;
              const origem = raw.origem || raw.de || raw.entidadeOrigem;
              const destino = raw.destino || raw.para || raw.entidadeDestino;
              const id =
                raw.id ||
                [origem, destino, raw.campo || raw.chave || ""].join("::");
              if (origem && destino)
                relacoes.set(id, {
                  id,
                  origem,
                  destino,
                  cardinalidade: raw.cardinalidade || null,
                  campo: raw.campo || raw.chave || null,
                  tela: telaId,
                });
              else
                avisos.push({ tela: telaId, tipo: "relacao-incompleta", id });
            }
            for (const o of arr(dados.operacoes))
              operacoes.push({ ...objects(o), tela: telaId });
            for (const f of arr(dados.fontes))
              fontes.push({ ...objects(f), tela: telaId });
            telas[telaId] = {
              nome: tela.identidade?.nome || telaId,
              entidades: names,
            };
          }
          const tabelaList = [...entidades.values()],
            relList = [...relacoes.values()];
          for (const r of relList)
            if (!entidades.has(r.origem) || !entidades.has(r.destino))
              avisos.push({ tipo: "referencia-ausente", relacao: r.id });
          if (!tabelaList.length)
            avisos.push({
              tipo: "sem-modelagem",
              mensagem:
                "As telas ativas não declaram entidades detalhadas. Nenhuma tabela foi criada por inferência.",
            });
          return {
            origem: "catalogo/indice.json",
            modo: "canonico",
            telas,
            entidades: tabelaList,
            relacoes: relList,
            operacoes,
            fontes,
            avisos,
            sql: null,
          };
        }
        const agrupadas = (proj) =>
          Object.groupBy
            ? Object.groupBy(proj.entidades, (e) => e.dominio)
            : proj.entidades.reduce(
                (a, e) => ((a[e.dominio] ??= []).push(e), a),
                {},
              );

        const $ = (id) => document.getElementById(id),
          esc = (x) =>
            String(x ?? "").replace(
              /[&<>"']/g,
              (c) =>
                ({
                  "&": "&amp;",
                  "<": "&lt;",
                  ">": "&gt;",
                  '"': "&quot;",
                  "'": "&#39;",
                })[c],
            );
        let data = null,
          view = "overview",
          zoom = 1,
          query = "",
          focus = null;
        const tabs = {
          overview: "Visão geral",
          diagram: "Diagrama DER / UML",
          relations: "Relacionamentos",
          screens: "Telas → Entidades",
          catalog: "Dicionário de tabelas",
          sql: "SQL declarado",
          motor: "Motor / JSON",
        };
        const empty = (title, why) =>
          '<div class="empty-contract"><h2>' +
          esc(title) +
          "</h2><p>" +
          esc(why) +
          "</p><p><strong>Sem preenchimento automático:</strong> defina os campos em <code>dados.persistencia</code> dos contratos de tela.</p></div>";
        const box = (title, content) =>
          '<div class="surface"><div class="diagram-toolbar"><strong>' +
          esc(title) +
          '</strong></div><div class="bank-body">' +
          content +
          "</div></div>";
        const filterRows = (a) =>
          a.filter((x) =>
            JSON.stringify(x).toLowerCase().includes(query.toLowerCase()),
          );
        function openDetail(id) {
          const e = data.entidades.find((x) => x.id === id);
          if (!e) return;
          focus = id;
          $("inspectTitle").textContent = id;
          $("inspectBody").innerHTML =
            "<p>" +
            esc(e.nome) +
            "</p><p><strong>Domínio:</strong> " +
            esc(e.dominio) +
            "</p><h3>Campos declarados</h3>" +
            (e.campos.length
              ? e.campos
                  .map(
                    (f) =>
                      '<div class="inspect-row"><span>' +
                      esc(f.id) +
                      "</span><small>" +
                      esc(f.tipo || "sem tipo") +
                      "</small></div>",
                  )
                  .join("")
              : "<p>Campos não declarados.</p>") +
            "<h3>Relacionamentos</h3>" +
            (data.relacoes
              .filter((r) => r.origem === id || r.destino === id)
              .map(
                (r) =>
                  "<p>" +
                  esc(r.origem) +
                  " → " +
                  esc(r.destino) +
                  " · " +
                  esc(r.cardinalidade || "cardinalidade não definida") +
                  "</p>",
              )
              .join("") || "<p>Sem relações declaradas.</p>") +
            "<h3>Telas consumidoras</h3><p>" +
            esc(e.telas.join(", ") || "—") +
            "</p>";
          $("inspector").classList.add("open");
        }
        function diagram() {
          const e = data.entidades,
            rels = data.relacoes;
          if (!e.length)
            return empty(
              "Diagrama ainda sem entidades",
              "O catálogo ativo não fornece tabelas ou relacionamentos suficientes para montar o grafo.",
            );
          const w = 900,
            h = Math.max(330, Math.ceil(e.length / 3) * 240),
            width = 280;
          const pos = {};
          let cards = e
            .map((ent, i) => {
              const x = 30 + (i % 3) * 295,
                y = 28 + Math.floor(i / 3) * 225;
              pos[ent.id] = { x, y };
              return (
                '<button type="button" class="bank-node" data-entity="' +
                esc(ent.id) +
                '" style="left:' +
                x +
                "px;top:" +
                y +
                "px;width:" +
                width +
                'px"><strong>' +
                esc(ent.id) +
                "</strong><small>" +
                esc(ent.dominio) +
                "</small><div>" +
                ent.campos
                  .slice(0, 6)
                  .map(
                    (f) =>
                      "<p>" +
                      esc(f.id) +
                      " <small>" +
                      esc(f.tipo || "") +
                      "</small></p>",
                  )
                  .join("") +
                "</div></button>"
              );
            })
            .join("");
          const paths = rels
            .map((r) => {
              const a = pos[r.origem],
                b = pos[r.destino];
              if (!a || !b) return "";
              const ax = a.x + width / 2,
                ay = a.y + 80,
                bx = b.x + width / 2,
                by = b.y + 80;
              return (
                '<path d="M' +
                ax +
                " " +
                ay +
                " L" +
                bx +
                " " +
                by +
                '" stroke="#6483ab" stroke-width="2" fill="none"/>'
              );
            })
            .join("");
          return (
            '<div class="surface"><div class="diagram-toolbar"><strong>Diagrama relacional dos contratos</strong><div class="toolbar"><button class="btn" data-zoom="out">−</button><span>' +
            Math.round(zoom * 100) +
            '%</span><button class="btn" data-zoom="in">+</button><button class="btn" data-zoom="reset">100%</button></div></div><div class="bank-graph-scroll" tabindex="0" aria-label="Diagrama com rolagem"><div class="bank-graph-spacer" style="width:' +
            w * zoom +
            "px;height:" +
            h * zoom +
            'px"><div class="bank-graph-board" style="width:' +
            w +
            "px;height:" +
            h +
            "px;transform:scale(" +
            zoom +
            ')"><svg width="' +
            w +
            '" height="' +
            h +
            '" aria-hidden="true">' +
            paths +
            "</svg>" +
            cards +
            "</div></div></div></div>"
          );
        }
        function render() {
          if (!data) return;
          $("breadcrumb").textContent = tabs[view];
          document.querySelectorAll("[data-view]").forEach((b) => {
            const on = b.dataset.view === view;
            b.classList.toggle("active", on);
            if (on) b.setAttribute("aria-current", "page");
            else b.removeAttribute("aria-current");
          });
          let html =
            '<div class="view-header"><div><div class="eyebrow">Projeção do catálogo · sem mock</div><h1>' +
            esc(tabs[view]) +
            "</h1><p>Visualização derivada apenas das declarações das telas ativas. Sem dados legados ou inventados.</p></div></div>";
          if (view === "overview") {
            const groups = agrupadas(data);
            html +=
              '<div class="metrics"><div class="metric"><b>' +
              data.entidades.length +
              '</b><span>Entidades</span></div><div class="metric"><b>' +
              data.relacoes.length +
              '</b><span>Relações</span></div><div class="metric"><b>' +
              Object.keys(data.telas).length +
              '</b><span>Telas ativas</span></div><div class="metric"><b>' +
              data.avisos.length +
              "</b><span>Diagnósticos</span></div></div>";
            html += data.entidades.length
              ? box(
                  "Domínios",
                  Object.keys(groups)
                    .map(
                      (g) =>
                        '<button class="btn" data-domain="' +
                        esc(g) +
                        '">' +
                        esc(g) +
                        " · " +
                        groups[g].length +
                        "</button>",
                    )
                    .join(" "),
                )
              : empty(
                  "Nenhuma entidade homologada",
                  "Os cinco JSONs de tela ativos ainda não declaram entidades de persistência.",
                );
            html += box(
              "Avisos do motor",
              "<ul>" +
                data.avisos
                  .map(
                    (x) =>
                      "<li>" +
                      esc(
                        x.mensagem ||
                          [x.tipo, x.tela || "", x.entidade || ""].join(" · "),
                      ) +
                      "</li>",
                  )
                  .join("") +
                "</ul>",
            );
          }
          if (view === "diagram") html += diagram();
          if (view === "relations")
            html += data.relacoes.length
              ? box(
                  "Relações declaradas",
                  data.relacoes
                    .map(
                      (r) =>
                        '<button class="relation-item" data-entity="' +
                        esc(r.origem) +
                        '"><strong>' +
                        esc(r.origem) +
                        " → " +
                        esc(r.destino) +
                        "</strong><small>" +
                        esc(r.cardinalidade || "não declarada") +
                        " · " +
                        esc(r.campo || "campo não declarado") +
                        "</small></button>",
                    )
                    .join(""),
                )
              : empty(
                  "Sem relacionamentos declarados",
                  "Relações devem ser declaradas nas telas antes de aparecerem aqui.",
                );
          if (view === "catalog") {
            html +=
              '<div class="filter-bar"><label for="bankSearch">Pesquisar campos e entidades</label><input class="search" id="bankSearch" type="search" value="' +
              esc(query) +
              '" placeholder="Buscar..."></div>';
            html += data.entidades.length
              ? box(
                  "Tabelas",
                  filterRows(data.entidades)
                    .map(
                      (e) =>
                        '<button class="catalog-item" data-entity="' +
                        esc(e.id) +
                        '"><strong>' +
                        esc(e.id) +
                        "</strong><p>" +
                        esc(e.nome) +
                        "</p><small>" +
                        e.campos.length +
                        " campos · " +
                        e.telas.length +
                        " telas</small></button>",
                    )
                    .join("") || "<p>Nenhum resultado.</p>",
                )
              : empty(
                  "Sem tabelas no catálogo ativo",
                  "Não há esquema para listar nesta etapa.",
                );
          }
          if (view === "screens")
            html += box(
              "Rastreabilidade",
              '<div class="table-scroll"><table class="data-table"><thead><tr><th>Tela</th><th>Entidades declaradas</th></tr></thead><tbody>' +
                Object.entries(data.telas)
                  .map(
                    ([id, t]) =>
                      "<tr><td>" +
                      esc(t.nome) +
                      "<br><small>" +
                      esc(id) +
                      "</small></td><td>" +
                      esc(t.entidades.join(", ") || "Nenhuma") +
                      "</td></tr>",
                  )
                  .join("") +
                "</tbody></table></div>",
            );
          if (view === "sql")
            html += empty(
              "SQL não disponível",
              "Nenhum SQL foi declarado nos contratos. O motor não deve gerar DDL arbitrário a partir de campos ausentes.",
            );
          if (view === "motor")
            html += box(
              "Projeção e diagnósticos",
              '<pre class="code-area" tabindex="0">' +
                esc(JSON.stringify(data, null, 2)) +
                "</pre>",
            );
          $("viewContent").innerHTML = html;
          $("viewContent")
            .querySelectorAll("[data-entity]")
            .forEach((b) => (b.onclick = () => openDetail(b.dataset.entity)));
          $("viewContent")
            .querySelectorAll("[data-zoom]")
            .forEach(
              (b) =>
                (b.onclick = () => {
                  zoom =
                    b.dataset.zoom === "in"
                      ? Math.min(1.5, zoom + 0.15)
                      : b.dataset.zoom === "out"
                        ? Math.max(0.35, zoom - 0.15)
                        : 1;
                  render();
                }),
            );
          $("viewContent")
            .querySelectorAll("[data-domain]")
            .forEach(
              (b) =>
                (b.onclick = () => {
                  view = "catalog";
                  query = b.dataset.domain;
                  render();
                }),
            );
          const search = $("bankSearch");
          if (search) {
            search.focus();
            search.setSelectionRange(search.value.length, search.value.length);
            search.oninput = (e) => {
              query = e.target.value;
              render();
            };
          }
        }
        document.querySelectorAll("[data-view]").forEach(
          (b) =>
            (b.onclick = () => {
              view = b.dataset.view;
              query = "";
              render();
              $("sidebar").classList.remove("open");
              $("backdrop").classList.remove("open");
            }),
        );
        $("mobileToggle").onclick = () => {
          $("sidebar").classList.toggle("open");
          $("backdrop").classList.toggle("open");
        };
        $("backdrop").onclick = () => {
          $("sidebar").classList.remove("open");
          $("backdrop").classList.remove("open");
        };
        $("closeInspector").onclick = () => {
          $("inspector").classList.remove("open");
          focus = null;
        };
        $("exportProjection").onclick = () =>
          data && baixar("banco_projecao_catalogo_v6.json", stringify(data));
        document.addEventListener("keydown", (e) => {
          if (e.key === "Escape") {
            $("inspector").classList.remove("open");
            $("sidebar").classList.remove("open");
            $("backdrop").classList.remove("open");
          }
        });
        try {
          data = projetar(await carregarCatalogo());
          render();
        } catch (err) {
          $("viewContent").innerHTML = empty(
            "Erro ao ler o catálogo",
            err.message + " — sirva o Workspace por HTTP (python iniciar.py).",
          );
        }
      })().catch((err) => {
        console.error(err);
        const el = document.getElementById("viewContent");
        if (el)
          el.innerHTML = `<div class="empty-contract"><h2>Erro no Banco</h2><p>${String(err?.message || err)}</p></div>`;
      });
    


      document.addEventListener("pointerdown", (e) => {
        const m = document.querySelector(".workspace-menu");
        if (m?.open && !m.contains(e.target)) m.open = false;
      });
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape")
          document.querySelector(".workspace-menu")?.removeAttribute("open");
      });
    


      document.querySelectorAll(".workspace-menu a").forEach((a) => {
        if (a.getAttribute("aria-current") === "page") return;
        a.addEventListener("click", (e) => {
          const href = a.getAttribute("href") || "";
          if (!href.startsWith("#") && !/^\.\.?\/(?:JORNADAS|PROTOTIPO)\/index\.html$/.test(href) && href !== "./index.html") {
            e.preventDefault();
            const vc = document.getElementById("viewContent"),
              old = document.getElementById("standaloneMenuNotice");
            old?.remove();
            const n = document.createElement("div");
            n.id = "standaloneMenuNotice";
            n.className = "warning";
            n.textContent =
              "Este HTML autocontido inclui somente o módulo Banco. Os demais módulos do Workspace não estão embutidos neste arquivo.";
            vc?.prepend(n);
            document.querySelector(".workspace-menu")?.removeAttribute("open");
          }
        });
      });
    
