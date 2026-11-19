
      "use strict";
      // Dados originais fornecidos pelo usuário. Sem dependências, CDN ou requisições.
      let DEFAULT_CATALOG;
      let LEGACY_REFERENCE;
      const STORE_KEY = "advogadoja.motorv2.visualv1.splash-inicial.2026-11";
      const BACKUP_KEY = STORE_KEY + ".backup";
      const TYPE_ICONS = { sequencial: "↳", condicional: "◆", navegacao: "➜" };
      const esc = (v) =>
        String(v ?? "").replace(
          /[&<>"']/g,
          (ch) =>
            ({
              "&": "&amp;",
              "<": "&lt;",
              ">": "&gt;",
              '"': "&quot;",
              "'": "&#39;",
            })[ch],
        );
      const copy = (v) => JSON.parse(JSON.stringify(v));
      const id = () =>
        "cx-" +
        (typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : Date.now().toString(36) +
            "-" +
            Math.random().toString(36).slice(2));
      const $ = (s) => document.querySelector(s);
      const by = (s) => document.getElementById(s);
      let doc = null,
        history = [],
        future = [],
        selected = null,
        active = null,
        trace = [],
        previewState = "enabled",
        tabState = {},
        notifyTimer = null,
        dirty = false,
        sourceLabel = "catálogo atual";
      // O contrato persistido permanece catalogo.telas / catalogo.componentes.
      // Cada tela guarda suas próprias saídas em navegação; entradas são calculadas.
      // A estrutura 'doc.fluxo' existe SOMENTE em memória para compatibilidade do editor.
      function starterScreen(ref) {
        const e = LEGACY_REFERENCE.catalog?.entries?.find((x) => x.key === ref);
        if (!e) return null;
        return {
          identidade: {
            id: e.key,
            tipo: "tela",
            nome: e.name,
            nomeExibicao: e.name,
            descricao:
              "Referência inicial recuperada do Fluxo V1; HTML/CSS não incluídos neste catálogo.",
          },
          classificacao: {
            localizacao: { caminho: e.folder || "" },
            escopo: { perfilRef: e.feature || "auth" },
            jornadas: [],
          },
          compatibilidade: {
            origem: "referencia-v1",
            flutterRoute: e.flutterRoute || null,
          },
        };
      }
      function seedStarter(d) {
        // Uma única tela inicial: Splash. O catálogo completo continua disponível para adicionar outras telas.
        const screens = d.catalogo.telas;
        const key = "auth.inicializacao.splash";
        if (!screens[key])
          screens[key] = starterScreen(key) || {
            identidade: {
              id: key,
              tipo: "tela",
              nome: "Splash",
              nomeExibicao: "Splash",
            },
            classificacao: {
              localizacao: { caminho: "telas/auth/inicializacao/splash" },
              escopo: { perfilRef: "auth" },
              jornadas: [],
            },
          };
        screens[key].navegacao = { ordem: 1, inicial: true, saidas: [] };
      }
      function initialSplashOnly() {
        const d = copy(DEFAULT_CATALOG);
        // As telas V1 ficam disponíveis no seletor, mas nenhuma recebe conexão automática.
        for (const e of LEGACY_REFERENCE.catalog?.entries || []) {
          if (!d.catalogo.telas[e.key])
            d.catalogo.telas[e.key] = starterScreen(e.key);
        }
        for (const screen of Object.values(d.catalogo.telas))
          delete screen.navegacao;
        seedStarter(d);
        return d;
      }
      function freshFromCatalog(o = DEFAULT_CATALOG) {
        const d = copy(o);
        if (!d.catalogo?.telas || !d.catalogo?.componentes)
          throw Error("JSON sem catálogo de telas/componentes");
        seedStarter(d);
        return d;
      }
      function extractLegacyGraph(proj) {
        const entries = proj.catalog?.entries || [];
        const telas = {};
        for (const e of entries) {
          telas[e.key] = {
            identidade: {
              id: e.key,
              tipo: "tela",
              nome: e.name || e.key,
              nomeExibicao: e.name || e.key,
            },
            classificacao: {
              localizacao: { caminho: e.folder || "" },
              escopo: { perfilRef: e.feature || "" },
              jornadas: [],
            },
            compatibilidade: {
              presentationStates: e.presentationStates || [],
              previewUrl: e.previewUrl || null,
              flutterRoute: e.flutterRoute || null,
            },
          };
        }
        const d = {
          schema: "advogadojaplus.flow",
          schemaVersion: "1.0.0",
          catalogo: {
            schema: "advogadoja.catalogo-v02-autocontido",
            schemaVersion: "0.2.0",
            telas,
            componentes: {},
          },
          savedAt: new Date().toISOString(),
        };
        const order = [],
          connections = [],
          pending = [];
        const mark = (key) => {
          if (key && !order.includes(key)) order.push(key);
          if (key && !telas[key])
            telas[key] = {
              identidade: { id: key, tipo: "tela", nome: key },
              classificacao: { jornadas: [] },
            };
        };
        const link = (from, to, event, kind, label, grupo = null) => {
          if (!from || !to || from === to) return;
          const key = [from, to, event, kind, label].join("|");
          if (connections.some((c) => c._key === key)) return;
          const c = {
            id: id(),
            de: from,
            saida: event || "concluiu",
            para: to,
            tipo: kind || "sequencial",
            rotulo: label || "",
            quando: null,
            navegacao: "empilhar",
            _key: key,
          };
          if (kind === "condicional") {
            c.pendenteCondicao = true;
            pending.push({ de: from, para: to, rotulo: label });
          }
          if (!to) c.pendenteDestino = true;
          if (grupo) c.grupo = grupo;
          connections.push(c);
        };
        function walkSeq(seq, inputs, depth = 0) {
          if (depth > 60 || !seq || !Array.isArray(seq.items)) return inputs;
          let tails = inputs;
          for (const node of seq.items) {
            if (node.type === "screen" && node.entityRef) {
              const ref = node.entityRef;
              mark(ref);
              tails.forEach((t) =>
                link(t.ref, ref, t.saida, t.tipo, t.label, t.grupo),
              );
              tails = [{ ref }];
            } else if (node.type === "branch") {
              const isCond = node.branchType === "condition",
                next = [];
              for (const p of node.paths || []) {
                const prefix = tails.map((t) => ({
                  ...t,
                  saida: isCond ? "concluiu" : p.label || "selecionar",
                  tipo: isCond ? "condicional" : "navegacao",
                  label: p.label || "Caminho",
                  grupo: isCond
                    ? t.grupo || (t.tipo === "navegacao" ? t.saida : null)
                    : t.grupo,
                }));
                if (p.sequence?.items?.length)
                  next.push(...walkSeq(p.sequence, prefix, depth + 1));
                else {
                  // Preserva uma opção de navegação presente no legado mesmo sem tela de destino.
                  if (/esqueceu a senha/i.test(p.label || ""))
                    prefix.forEach((t) =>
                      link(t.ref, null, t.saida, t.tipo, t.label, t.grupo),
                    );
                  next.push(...tails);
                }
              }
              if (next.length) tails = next;
            } else if (node.type === "flow" && node.entityRef)
              mark(node.entityRef);
          }
          return tails;
        }
        walkSeq(proj.domain?.flow?.graph?.root, []);
        // O fluxo V1 contém referências repetidas, que convergem para uma tela única no motor novo.
        connections.forEach((c) => delete c._key);
        d.fluxo = {
          schemaVersion: 2,
          inicio: order[0] || null,
          telasUsadas: order,
          conexoes: connections,
          variaveis: {
            professionalAccess: "enabled",
            onboardingConcluido: true,
            primeiroAcesso: false,
          },
          configuracao: {
            politicaRetorno: "historico",
            bifurcacao: "automatica",
          },
          migracao: {
            origem: "advogadoja-flow-projection",
            conexoesSemRegra: pending.length,
          },
        };
        return d;
      }
      function normalize(input) {
        let d;
        if (input?.catalogo?.telas) {
          d = copy(input);
          d.catalogo.componentes = d.catalogo.componentes || {};
        } else if (
          input?.format === "advogadoja-flow-projection" ||
          input?.domain?.flow?.graph
        ) {
          d = extractLegacyGraph(input);
        } else
          throw Error(
            "Formato inválido. É necessário catalogo.telas e catalogo.componentes ou a referência V1.",
          );
        let legacy =
          d.fluxo && Array.isArray(d.fluxo.conexoes) ? copy(d.fluxo) : null;
        const entries = Object.entries(d.catalogo.telas),
          hasNav = entries.some(
            ([, v]) => v.navegacao && typeof v.navegacao === "object",
          );
        if (!legacy && !hasNav) seedStarter(d);
        const views = Object.entries(d.catalogo.telas)
          .filter(([, t]) => t.navegacao && typeof t.navegacao === "object")
          .sort(
            (a, b) =>
              (a[1].navegacao.ordem ?? 1e6) - (b[1].navegacao.ordem ?? 1e6),
          );
        const f = legacy || {
          schemaVersion: 2,
          inicio: null,
          telasUsadas: views.map(([k]) => k),
          conexoes: views.flatMap(([key, t]) =>
            (t.navegacao.saidas || []).map((c) => ({ ...c, de: key })),
          ),
          variaveis: {
            professionalAccess: "enabled",
            onboardingConcluido: true,
            primeiroAcesso: false,
          },
          configuracao: {
            politicaRetorno: "historico",
            bifurcacao: "automatica",
          },
        };
        if (!legacy)
          f.inicio =
            views.find(([, t]) => t.navegacao.inicial)?.[0] ||
            views[0]?.[0] ||
            null;
        f.schemaVersion = 2;
        f.telasUsadas = Array.isArray(f.telasUsadas) ? f.telasUsadas : [];
        f.conexoes = Array.isArray(f.conexoes) ? f.conexoes : [];
        f.variaveis =
          f.variaveis && typeof f.variaveis === "object"
            ? f.variaveis
            : {
                professionalAccess: "enabled",
                onboardingConcluido: true,
                primeiroAcesso: false,
              };
        f.configuracao = f.configuracao || {
          politicaRetorno: "historico",
          bifurcacao: "automatica",
        };
        for (const c of f.conexoes) {
          if (!c.id) c.id = id();
          if (!c.tipo) c.tipo = c.quando ? "condicional" : "sequencial";
          if (!c.saida) c.saida = "concluiu";
          if (!c.navegacao) c.navegacao = "empilhar";
          if (!f.telasUsadas.includes(c.de)) f.telasUsadas.push(c.de);
          if (c.para && !f.telasUsadas.includes(c.para))
            f.telasUsadas.push(c.para);
        }
        f.telasUsadas = [...new Set(f.telasUsadas)];
        f.inicio = f.inicio || f.telasUsadas[0] || null;
        // Dados de navegação internos são reconstruídos do catálogo sem exportar uma seção 'fluxo'.
        d.fluxo = f;
        return d;
      }
      function portableDoc(src) {
        const d = copy(src),
          f = src.fluxo;
        delete d.fluxo;
        for (const t of Object.values(d.catalogo.telas)) delete t.navegacao;
        f.telasUsadas.forEach((key, i) => {
          const t = d.catalogo.telas[key];
          if (!t) return;
          t.navegacao = {
            ordem: i + 1,
            inicial: key === f.inicio,
            saidas: f.conexoes
              .filter((c) => c.de === key)
              .map(({ de, ...c }) => c),
          };
        });
        d.savedAt = new Date().toISOString();
        return d;
      }
      function persist() {
        try {
          localStorage.setItem(STORE_KEY, JSON.stringify(portableDoc(doc)));
          by("saveStatus").textContent = "Salvo localmente";
          dirty = false;
        } catch (e) {
          by("saveStatus").textContent = "Não salvo · exporte";
          console.warn(e);
        }
      }
      function setDoc(next, label, store = true) {
        doc = normalize(next);
        sourceLabel = label;
        selected = null;
        active = null;
        trace = [];
        history = [];
        future = [];
        tabState = {};
        if (store) persist();
        draw();
      }
      function edit(callback) {
        history.push(copy(doc));
        if (history.length > 40) history.shift();
        future.length = 0;
        callback(doc.fluxo, doc);
        doc.savedAt = new Date().toISOString();
        dirty = true;
        persist();
        draw();
      }
      function undo() {
        if (!history.length) return;
        future.push(copy(doc));
        doc = history.pop();
        persist();
        draw();
      }
      function redo() {
        if (!future.length) return;
        history.push(copy(doc));
        doc = future.pop();
        persist();
        draw();
      }
      function nameOf(key) {
        return !key
          ? "Destino a definir"
          : doc.catalogo.telas[key]?.identidade?.nomeExibicao ||
              doc.catalogo.telas[key]?.identidade?.nome ||
              key;
      }
      function descOf(key) {
        const entry = LEGACY_REFERENCE.catalog?.entries?.find(
          (e) => e.key === key,
        );
        if (entry)
          return (
            (entry.featureLabel || "Tela") +
            (entry.sectionLabel ? " · " + entry.sectionLabel : "")
          );
        const s = doc.catalogo.telas[key],
          c = s?.classificacao || {};
        return (
          (c.escopo?.perfilRef || "Tela") +
          (c.jornadas?.[0]?.subjornadas?.[0]?.nome
            ? " · " + c.jornadas[0].subjornadas[0].nome
            : "")
        );
      }
      function outgoing(k) {
        return doc.fluxo.conexoes.filter((c) => c.de === k);
      }
      function incoming(k) {
        return doc.fluxo.conexoes.filter((c) => c.para === k);
      }
      function isBranch(k) {
        return outgoing(k).length > 1;
      }
      function branchKind(arr) {
        return arr.some((c) => c.tipo === "condicional")
          ? "Condição"
          : "Navegação";
      }
      function whenStr(c) {
        if (c.pendenteCondicao) return "⚠ Condição não definida";
        if (!c.quando)
          return c.tipo === "condicional"
            ? "⚠ Condição não definida"
            : "Sem condição";
        const w = c.quando;
        return (
          w.variavel +
          " " +
          (w.operador || "==") +
          " " +
          JSON.stringify(w.valor)
        );
      }
      function conditionMatch(c) {
        if (!c.para) return null;
        if (!c.quando) return c.tipo === "condicional" ? null : true;
        const w = c.quando,
          a = doc.fluxo.variaveis[w.variavel];
        if (a === undefined) return null;
        switch (w.operador) {
          case "!=":
            return a !== w.valor;
          case ">":
            return Number(a) > Number(w.valor);
          case "<":
            return Number(a) < Number(w.valor);
          case ">=":
            return Number(a) >= Number(w.valor);
          case "<=":
            return Number(a) <= Number(w.valor);
          case "==":
          default:
            return a === w.valor;
        }
      }
      function validation() {
        const errors = [],
          warnings = [],
          f = doc.fluxo,
          t = doc.catalogo.telas;
        if (f.inicio && !t[f.inicio])
          errors.push(`A tela inicial ${f.inicio} não existe no catálogo.`);
        const ids = new Set();
        for (const c of f.conexoes) {
          if (ids.has(c.id)) errors.push(`Conexão com ID duplicado: ${c.id}`);
          ids.add(c.id);
          if (!t[c.de]) errors.push(`Origem ausente: ${c.de}`);
          if (!c.para)
            warnings.push(`Destino pendente na saída ${c.saida} de ${c.de}.`);
          else if (!t[c.para]) errors.push(`Destino ausente: ${c.para}`);
          if (c.tipo === "condicional" && !c.quando)
            warnings.push(`Condição pendente: ${c.de} → ${c.para}`);
          if (c.quando && !(c.quando.variavel in f.variaveis))
            warnings.push(`Variável sem valor: ${c.quando.variavel}`);
        }
        for (const k of f.telasUsadas) {
          if (!t[k])
            warnings.push(`Tela no fluxo não encontrada no catálogo: ${k}`);
        }
        for (const key of new Set(f.conexoes.map((c) => c.de))) {
          const same = outgoing(key).filter((c) => c.tipo === "condicional");
          if (same.length > 1) {
            const trueCount = same.filter(
              (c) => conditionMatch(c) === true,
            ).length;
            if (trueCount > 1)
              warnings.push(
                `Mais de uma condição verdadeira na saída de ${key}.`,
              );
          }
        }
        return { errors, warnings };
      }
      function showNotice(message) {
        by("notice").textContent = message;
        by("notice").classList.add("show");
        clearTimeout(notifyTimer);
        notifyTimer = setTimeout(
          () => by("notice").classList.remove("show"),
          4100,
        );
      }
      function dividerHtml(
        from,
        to = null,
        { disconnected = false, position = null } = {},
      ) {
        const idx =
          position === null
            ? doc.fluxo.telasUsadas.indexOf(from) + 1
            : position;
        return `<div class="insert-divider ${disconnected ? "is-disconnected" : ""}" aria-label="Ponto de conexão"><span class="insert-divider__line"></span><div class="insert-divider__actions"><button type="button" data-action="add-at" data-index="${idx}">+ Tela</button>${from ? `<button type="button" data-action="connect" data-key="${esc(from)}">+ Bifurcação</button>` : ""}</div></div>`;
      }
      function cardHtml(key, index) {
        const obj = doc.catalogo.telas[key];
        const start = index === 0;
        return `<div class="flow-sequence__slot sequence-slot" data-card="${esc(key)}"><div class="sortable-node" draggable="true" data-drag="${esc(key)}"><article class="flow-card ${active === key ? "flow-card--active" : ""} ${selected === key ? "flow-card--selected" : ""}"><button class="drag-handle" aria-label="Arrastar tela" title="Arrastar tela">⋮⋮</button><div class="flow-card__body" data-action="inspect" data-key="${esc(key)}" role="button" tabindex="0" title="Abrir campos, entradas, saídas e componentes"><div class="flow-card__meta"><span class="kind-badge kind-badge--screen">TELA</span><span class="meta-segment">${esc(descOf(key))}</span><span class="definition-badge">Mapa: A DEFINIR</span></div><strong>${esc(nameOf(key))}</strong><small>${esc(key)}</small></div><div class="flow-card__actions"><button data-action="move-up" data-key="${esc(key)}" ${index === 0 ? "disabled" : ""} title="Subir na organização visual">↑</button><button data-action="move-down" data-key="${esc(key)}" ${index === doc.fluxo.telasUsadas.length - 1 ? "disabled" : ""} title="Descer na organização visual">↓</button><button data-action="preview" data-key="${esc(key)}">Visual</button><button class="danger" data-action="remove-screen" data-key="${esc(key)}">Remover</button></div></article></div></div>`;
      }
      function groupEdges(key) {
        const edges = outgoing(key),
          groups = [];
        for (const c of edges) {
          const label = c.grupo || c.rotulo || c.saida || "Caminho";
          const groupKey = c.grupo || "id-" + c.id;
          let g = groups.find((x) => x.key === groupKey);
          if (!g) {
            g = {
              key: groupKey,
              label: c.grupo || c.rotulo || c.saida || "Caminho",
              edges: [],
            };
            groups.push(g);
          }
          g.edges.push(c);
        }
        return groups;
      }
      function branchBox(
        key,
        edges,
        seen,
        stack,
        depth = 0,
        { nested = false } = {},
      ) {
        if (!edges.length) return "";
        let groups = [];
        for (const c of edges) {
          const gkey = c.grupo || "id-" + c.id;
          let g = groups.find((x) => x.key === gkey);
          if (!g) {
            g = {
              key: gkey,
              label: c.grupo || c.rotulo || c.saida || "Caminho",
              edges: [],
            };
            groups.push(g);
          }
          g.edges.push(c);
        }
        const mode = edges.some((c) => c.tipo === "condicional")
          ? "condition"
          : "navigation";
        const isLogin = key === "auth.sessao.entrar",
          title = isLogin
            ? "Fluxo de login"
            : nested
              ? "Destino após autenticação"
              : mode === "condition"
                ? "Bifurcação condicional"
                : "Opções de navegação";
        const preferred = tabState[key];
        let group =
          groups.find(
            (g) =>
              g.key === preferred || g.edges.some((c) => c.id === preferred),
          ) || groups[0];
        tabState[key] = group.key;
        let tabs = groups
          .map(
            (g) =>
              `<button class="${g.key === group.key ? "is-active" : ""}" data-action="switch-tab" data-key="${esc(key)}" data-id="${esc(g.key)}">${esc(g.label)} <small>${g.edges.length}</small></button>`,
          )
          .join("");
        let contents = "";
        if (group.edges.length === 1) {
          const c = group.edges[0];
          contents = !c.para
            ? `<div class="empty-sequence"><span>Esta saída ainda não possui tela de destino.</span><div><button data-action="edit-edge" data-id="${esc(c.id)}">Definir destino</button></div></div>`
            : flowPath(c.para, seen, stack, depth + 1);
        } else {
          // O login V1 agrupava "Entrar" e exibia uma segunda bifurcação pelos estados de autenticação.
          const nestKey = key + "#" + group.key;
          const virtualEdges = group.edges.map((c) => ({ ...c, grupo: null }));
          contents = branchBox(nestKey, virtualEdges, seen, stack, depth + 1, {
            nested: true,
          });
        }
        return `<section class="branch-card" data-branch="${esc(key)}"><div class="branch-card__header"><button class="drag-handle drag-handle--branch" title="Bifurcação derivada das saídas; reorganize a tela de origem">⋮⋮</button><div class="branch-card__titleblock"><span class="kind-badge kind-badge--branch">BIFURCAÇÃO</span><strong>${esc(title)}</strong></div><div class="branch-card__actions"><button data-action="tools" title="Verificar condições">↑</button><button data-action="tools" title="Verificar condições">↓</button><button data-action="edit-branch" data-key="${esc(nested ? edges[0].de : key)}">Editar</button><button class="danger" data-action="remove-branch" data-key="${esc(nested ? edges[0].de : key)}">Remover</button></div></div><div class="branch-tabs">${tabs}</div><div class="branch-card__content"><div class="flow-sequence flow-sequence--nested">${dividerHtml(edges[0].de || key, null, { disconnected: false })}${contents}</div></div></section>`;
      }
      function flowPath(key, seen, stack, depth = 0) {
        if (!key)
          return `<div class="empty-sequence">Aguardando definição da tela de destino.</div>`;
        if (depth > 65)
          return '<div class="reference-note">Limite de encadeamento atingido. Verifique ciclos e caminhos compartilhados.</div>';
        if (stack.has(key))
          return `<div class="reference-note">↶ Retorno para <strong>${esc(nameOf(key))}</strong> · ${esc(key)} <button data-action="inspect" data-key="${esc(key)}">Ver referência</button></div>`;
        if (seen.has(key))
          return `<div class="reference-note">↪ Conexão com tela reutilizada: <strong>${esc(nameOf(key))}</strong> · ${esc(key)} <button data-action="inspect" data-key="${esc(key)}">Ver referência</button></div>`;
        seen.add(key);
        const nextStack = new Set(stack);
        nextStack.add(key);
        const i = doc.fluxo.telasUsadas.indexOf(key),
          edges = outgoing(key);
        let out = cardHtml(key, i);
        if (!edges.length) {
          out += dividerHtml(key, null, { disconnected: true });
          return out;
        }
        if (edges.length === 1) {
          const c = edges[0];
          out += dividerHtml(key, c.para);
          out += c.para
            ? flowPath(c.para, seen, nextStack, depth + 1)
            : `<div class="empty-sequence"><span>Saída ${esc(c.saida)} · destino pendente</span><div><button data-action="edit-edge" data-id="${esc(c.id)}">Definir destino</button></div></div>`;
        } else {
          out += dividerHtml(key);
          out += branchBox(key, edges, seen, nextStack, depth + 1);
        }
        return out;
      }
      function draw() {
        if (!doc) return;
        const f = doc.fluxo,
          t = f.telasUsadas,
          check = validation();
        // status de armazenamento é controlado pelo persist() V3, sem sucesso presumido
        by("docSource").textContent =
          sourceLabel === "trabalho local" ? "trabalho local" : sourceLabel;
        by("projectName").textContent = "Advogado Já · Fluxo do catálogo V3";
        by("undoBtn").disabled = !history.length;
        by("redoBtn").disabled = !future.length;
        if (!t.length) {
          by("graph").innerHTML =
            `<div class="empty-sequence" style="min-height:92px">Solte um bloco aqui ou adicione o primeiro item.<div><button data-action="add-at" data-index="0">+ Tela</button></div></div>`;
        } else {
          const seen = new Set(),
            start = f.inicio && t.includes(f.inicio) ? f.inicio : t[0];
          let tree = flowPath(start, seen, new Set());
          const reachable = new Set(),
            queue = [start];
          while (queue.length) {
            const k = queue.shift();
            if (!k || reachable.has(k)) continue;
            reachable.add(k);
            for (const edge of outgoing(k))
              if (edge.para) queue.push(edge.para);
          }
          const independent = t.filter((k) => !reachable.has(k));
          if (independent.length) {
            tree += `<div class="independent-title"><strong>Outras telas e caminhos do catálogo (${independent.length})</strong><button data-action="tools">Verificar ligações</button></div>`;
            for (const key of independent)
              if (!seen.has(key))
                tree +=
                  '<div class="independent-path">' +
                  flowPath(key, seen, new Set()) +
                  "</div>";
          }
          by("graph").innerHTML = tree;
        }
        renderDetail();
      }
      function renderDetail() {
        const panel = by("detail");
        if (!selected || !doc.catalogo.telas[selected]) {
          if (!selected) panel.classList.remove("open");
          return;
        }
        panel.classList.add("open");
        by("detailTitle").textContent = nameOf(selected);
        const item = doc.catalogo.telas[selected],
          compose = item.estrutura?.html?.composicao || {},
          css = item.estrutura?.css || {},
          parts = Object.entries(compose).map(
            ([slot, def]) => `${slot} → ${def.componenteRef || "?"}`,
          );
        const inc = incoming(selected),
          out = outgoing(selected);
        const journey = (item.classificacao?.jornadas || [])
          .map(
            (j) =>
              j.nome +
              " " +
              (j.subjornadas || []).map((s) => s.nome).join(", "),
          )
          .join("; ");
        by("detailBody").innerHTML =
          `<div class="kv"><span>ID canônico</span><span>${esc(selected)}</span></div><div class="kv"><span>Tipo</span><span>${esc(item.identidade?.tipo || "tela")}</span></div><div class="kv"><span>Localização</span><span>${esc(item.classificacao?.localizacao?.caminho || "não informada")}</span></div><div class="kv"><span>Jornadas</span><span>${esc(journey || "não informadas")}</span></div><div class="kv"><span>Rota / legado</span><span>${esc(item.compatibilidade?.flutterRoute || "não definida")}</span></div><h3>Entradas (${inc.length})</h3>${inc.map((c) => `<div class="relation"><strong>${esc(nameOf(c.de))}</strong><small>${esc(c.de)} · ${esc(c.saida || "concluiu")}</small><div class="mini-row"><button data-action="inspect" data-key="${esc(c.de)}">Ver origem</button></div></div>`).join("") || "<p>Nenhuma conexão de entrada.</p>"}<h3>Saídas (${out.length})</h3>${out.map((c) => `<div class="relation"><strong>${esc(nameOf(c.para))}</strong><small>${esc(c.tipo)} · ${esc(whenStr(c))}</small><div class="mini-row"><button data-action="edit-edge" data-id="${esc(c.id)}">Editar</button><button data-action="inspect" data-key="${esc(c.para)}">Ver destino</button></div></div>`).join("") || "<p>Nenhuma conexão de saída.</p>"}<button class="form-btn main" data-action="connect" data-key="${esc(selected)}">+ Criar conexão</button><div class="mini-row"><button data-action="tools">Ferramentas e simulação</button></div><h3>Composição (${parts.length})</h3>${parts.length ? `<ul>${parts.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>` : "<p>Sem composição disponível para esta tela.</p>"}<h3>Estilos</h3><p>${Object.keys(css.tokens || {}).length} tokens e ${Object.keys(css.regras || {}).length} regras nesta tela. Componentes mantidos em <code>catalogo.componentes</code>.</p><button class="form-btn" data-action="preview" data-key="${esc(selected)}">Visualizar composição</button>`;
      }
      function closeDetail() {
        selected = null;
        by("detail").classList.remove("open");
        draw();
      }
      function openModal(title, body, footer, { wide = false } = {}) {
        by("modalTitle").textContent = title;
        by("modalBody").innerHTML = body;
        by("modalFooter").innerHTML =
          footer || '<button data-action="modal-close">Fechar</button>';
        by("modal").classList.toggle("wide", wide);
        by("modalRoot").classList.add("open");
        by("modalClose").focus();
      }
      function closeModal() {
        by("modalRoot").classList.remove("open");
        by("modalBody").innerHTML = "";
      }
      function addScreen(position = null) {
        const keys = Object.keys(doc.catalogo.telas);
        if (!keys.length) {
          showNotice(
            "O catálogo não contém telas. Importe primeiro um catálogo.",
          );
          return;
        }
        openModal(
          "Adicionar tela ao fluxo",
          `<p class="dialog-note">A tela é reutilizada por ID. Adicioná-la ao fluxo não cria automaticamente uma conexão. Use “Conectar” para isso.</p><div class="field"><label for="pickSearch">Buscar tela no catálogo</label><input id="pickSearch" placeholder="Nome, chave ou caminho" autocomplete="off"></div><div id="pickResults" class="list-items"></div>`,
          `<button data-action="modal-close">Fechar</button>`,
          { wide: true },
        );
        const list = () => {
          const q = by("pickSearch").value.toLowerCase();
          by("pickResults").innerHTML =
            keys
              .filter((k) => (nameOf(k) + " " + k).toLowerCase().includes(q))
              .slice(0, 130)
              .map(
                (k) =>
                  `<button class="pick-item" data-action="pick-screen" data-key="${esc(k)}" data-index="${position === null ? "-1" : position}"><div><strong>${esc(nameOf(k))}</strong><small>${esc(k)}</small></div><span class="chip">${doc.fluxo.telasUsadas.includes(k) ? "No fluxo" : "Adicionar"}</span></button>`,
              )
              .join("") || "<p>Nenhum resultado.</p>";
        };
        by("pickSearch").addEventListener("input", list);
        list();
        by("pickSearch").focus();
      }
      function parseValue(s) {
        if (s === "true") return true;
        if (s === "false") return false;
        if (s === "null") return null;
        if (/^[-+]?\d+(?:\.\d+)?$/.test(s)) return Number(s);
        return s;
      }
      function makeConnect(key, edgeId = null) {
        const prev = edgeId
          ? doc.fluxo.conexoes.find((c) => c.id === edgeId)
          : null;
        const first =
          key || prev?.de || doc.fluxo.inicio || doc.fluxo.telasUsadas[0];
        if (!first) return showNotice("Adicione uma tela antes de conectar.");
        const options = Object.keys(doc.catalogo.telas)
          .map(
            (k) =>
              `<option value="${esc(k)}" ${(prev?.para || "") === k ? "selected" : ""}>${esc(nameOf(k))} · ${esc(k)}</option>`,
          )
          .join("");
        const fields = `<p class="dialog-note">O motor gera o cartão de bifurcação automaticamente quando houver várias saídas da mesma tela. O ID da tela é a referência compartilhada.</p><div class="field"><label>Origem</label><input disabled value="${esc(first)}"></div><div class="field"><label>Destino (tela de chegada)</label><select id="edgeDest">${options}</select></div><div class="field-row"><div class="field"><label>Evento / porta de saída</label><input id="edgeEvent" value="${esc(prev?.saida || "concluiu")}" placeholder="concluiu, menu.inicio, clicou..." required></div><div class="field"><label>Tipo de conexão</label><select id="edgeType"><option value="sequencial">Sequencial (direta)</option><option value="condicional">Condicional</option><option value="navegacao">Navegação por ação</option></select></div></div><div id="conditionFields"><div class="field-row"><div class="field"><label>Variável de condição</label><input id="edgeVar" placeholder="onboardingConcluido" value="${esc(prev?.quando?.variavel || "")}"></div><div class="field"><label>Comparação</label><select id="edgeOperator"><option value="==">igual a (==)</option><option value="!=">diferente de (!=)</option><option value=">">maior que (&gt;)</option><option value="<">menor que (&lt;)</option><option value=">=">maior ou igual (&gt;=)</option><option value="<=">menor ou igual (&lt;=)</option></select></div></div><div class="field"><label>Valor esperado</label><input id="edgeValue" placeholder="true, false, enabled..." value="${esc(prev?.quando?.valor === undefined ? "true" : String(prev.quando.valor))}"><small class="hint">true / false / números são interpretados como valores tipados. Texto permanece texto.</small></div></div><div class="field-row"><div class="field"><label>Rótulo no fluxo</label><input id="edgeLabel" value="${esc(prev?.rotulo || "")}"></div><div class="field"><label>Histórico ao navegar</label><select id="edgeNavigate"><option value="empilhar">Empilhar no histórico</option><option value="substituirHistorico">Substituir histórico (ex.: concluir onboarding)</option><option value="voltar">Voltar</option></select></div></div>`;
        openModal(
          (prev ? "Editar" : "Criar") + " conexão",
          fields,
          `<button data-action="modal-close">Cancelar</button><button class="main" id="saveEdge">${prev ? "Salvar alterações" : "Criar conexão"}</button>`,
        );
        by("edgeType").value = prev?.tipo || "sequencial";
        by("edgeOperator").value = prev?.quando?.operador || "==";
        by("edgeNavigate").value = prev?.navegacao || "empilhar";
        const vis = () =>
          by("conditionFields").classList.toggle(
            "hidden",
            by("edgeType").value !== "condicional",
          );
        by("edgeType").addEventListener("change", vis);
        vis();
        by("saveEdge").addEventListener("click", () => {
          const to = by("edgeDest").value,
            kind = by("edgeType").value,
            ev = by("edgeEvent").value.trim() || "concluiu",
            variable = by("edgeVar").value.trim();
          if (!to) return showNotice("Selecione um destino.");
          if (kind === "condicional" && !variable)
            return showNotice("Informe a variável da condição.");
          const when =
            kind === "condicional"
              ? {
                  variavel: variable,
                  operador: by("edgeOperator").value,
                  valor: parseValue(by("edgeValue").value.trim()),
                }
              : null;
          const item = {
            id: prev?.id || id(),
            de: first,
            saida: ev,
            para: to,
            tipo: kind,
            quando: when,
            rotulo: by("edgeLabel").value.trim(),
            navegacao: by("edgeNavigate").value,
            referenciasOriginais: prev?.referenciasOriginais || [],
          };
          edit((f) => {
            if (prev) {
              const index = f.conexoes.findIndex((c) => c.id === prev.id);
              if (index >= 0) f.conexoes[index] = item;
            } else f.conexoes.push(item);
            if (!f.telasUsadas.includes(first)) f.telasUsadas.push(first);
            if (!f.telasUsadas.includes(to)) f.telasUsadas.push(to);
          });
          closeModal();
          showNotice("Conexão salva; a visualização foi recalculada.");
        });
      }
      function varsDialog() {
        const f = doc.fluxo;
        const rows = Object.entries(f.variaveis)
          .map(
            ([k, v]) =>
              `<div class="var-item"><input aria-label="Nome" class="varName" value="${esc(k)}" spellcheck="false"><select class="varType"><option value="string" ${typeof v === "string" ? "selected" : ""}>Texto</option><option value="boolean" ${typeof v === "boolean" ? "selected" : ""}>Booleano</option><option value="number" ${typeof v === "number" ? "selected" : ""}>Número</option></select><input aria-label="Valor" class="varValue" value="${esc(String(v))}"><button data-action="var-remove" type="button" title="Remover variável">×</button></div>`,
          )
          .join("");
        openModal(
          "Variáveis do fluxo",
          `<p class="dialog-note">Simule as condições sem alterar o HTML/CSS das telas. Ao mudar um valor, todas as conexões que usam a variável são reavaliadas.</p><div id="varRows" class="vars-grid">${rows}</div><div class="mini-row" style="margin-top:14px"><button data-action="var-add">+ Variável</button></div>`,
          `<button data-action="modal-close">Cancelar</button><button id="saveVars" class="main">Aplicar variáveis</button>`,
        );
        by("saveVars").addEventListener("click", () => {
          const vars = {};
          for (const row of by("varRows").querySelectorAll(".var-item")) {
            const k = row.querySelector(".varName").value.trim(),
              type = row.querySelector(".varType").value,
              raw = row.querySelector(".varValue").value;
            if (!k) continue;
            vars[k] =
              type === "boolean"
                ? raw === "true"
                : type === "number"
                  ? Number(raw)
                  : raw;
          }
          edit((f) => {
            f.variaveis = vars;
          });
          closeModal();
          showNotice("Variáveis aplicadas; condições recalculadas.");
        });
      }
      function addVar() {
        by("varRows").insertAdjacentHTML(
          "beforeend",
          `<div class="var-item"><input class="varName" aria-label="Nome" placeholder="novaVariavel"><select class="varType"><option value="boolean">Booleano</option><option value="string">Texto</option><option value="number">Número</option></select><input class="varValue" aria-label="Valor" value="false"><button data-action="var-remove" title="Remover">×</button></div>`,
        );
      }
      function selectScreen(k) {
        selected = k;
        draw();
      }
      function doMove(k, delta) {
        const i = doc.fluxo.telasUsadas.indexOf(k);
        const j = i + delta;
        if (i < 0 || j < 0 || j >= doc.fluxo.telasUsadas.length) return;
        edit((f) => {
          [f.telasUsadas[i], f.telasUsadas[j]] = [
            f.telasUsadas[j],
            f.telasUsadas[i],
          ];
        });
      }
      function removeScreen(k) {
        const amount = incoming(k).length + outgoing(k).length;
        if (
          !confirm(
            `Remover ${nameOf(k)} desta visualização? ${amount} conexão(ões) envolvendo a tela também serão removidas. O catálogo permanece intacto.`,
          )
        )
          return;
        edit((f) => {
          f.telasUsadas = f.telasUsadas.filter((q) => q !== k);
          f.conexoes = f.conexoes.filter((c) => c.de !== k && c.para !== k);
          if (f.inicio === k) f.inicio = f.telasUsadas[0] || null;
        });
        if (selected === k) selected = null;
      }
      function deleteConnection(cid) {
        const c = doc.fluxo.conexoes.find((e) => e.id === cid);
        if (!c) return;
        if (
          !confirm(
            `Desconectar ${nameOf(c.de)} → ${nameOf(c.para)}? A tela de destino continuará no catálogo e no fluxo.`,
          )
        )
          return;
        edit((f) => {
          f.conexoes = f.conexoes.filter((x) => x.id !== cid);
        });
        showNotice("Conexão removida.");
      }
      function simulateStart() {
        active = doc.fluxo.inicio || doc.fluxo.telasUsadas[0] || null;
        trace = active ? [active] : [];
        draw();
        if (active) showNotice(`Simulação iniciada em ${nameOf(active)}.`);
        else showNotice("Defina uma tela inicial.");
      }
      function simulateEdge(cid) {
        const c = doc.fluxo.conexoes.find((x) => x.id === cid);
        if (!c) return;
        if (active !== c.de) {
          active = c.de;
          trace = [c.de];
        }
        const ok = conditionMatch(c);
        if (ok !== true) {
          showNotice(
            ok === null
              ? "Conexão pendente: defina a condição/variável."
              : "Condição falsa para o estado simulado.",
          );
          return;
        }
        if (trace.length >= 55) {
          showNotice(
            "Limite de passos atingido. Verifique se há um ciclo de navegação.",
          );
          return;
        }
        active = c.para;
        trace.push(active);
        draw();
        showNotice(`${nameOf(c.de)} → ${nameOf(c.para)}`);
      }
      function simulateNext() {
        if (!active) return simulateStart();
        const all = outgoing(active),
          automatic = all.filter(
            (c) => c.saida === "concluiu" || c.saida === "auto",
          );
        const candidates = automatic.length ? automatic : all;
        if (!candidates.length)
          return showNotice("Fim do caminho: a tela não possui saídas.");
        const matches = candidates.filter((c) => conditionMatch(c) === true);
        if (matches.length > 1)
          return showNotice(
            "Bifurcação ambígua: mais de uma saída válida. Escolha manualmente um caminho.",
          );
        if (matches.length === 1) {
          simulateEdge(matches[0].id);
          return;
        }
        if (candidates.some((c) => conditionMatch(c) === null))
          return showNotice(
            "Existem condições pendentes; defina as variáveis antes de continuar.",
          );
        showNotice(
          "Nenhuma condição verdadeira. Ajuste as variáveis ou selecione uma saída.",
        );
      }
      function clearSim() {
        active = null;
        trace = [];
        draw();
      }
      function showValidation() {
        const r = validation();
        openModal(
          "Validação do fluxo",
          `<p class="dialog-note">Verificação estrutural da edição atual. Uma bifurcação não precisa ser cadastrada: ela é derivada das saídas.</p><h3>${r.errors.length} erros</h3>${r.errors.length ? "<ul>" + r.errors.map((s) => `<li class="error-text">${esc(s)}</li>`).join("") + "</ul>" : "<p>Nenhum erro estrutural encontrado.</p>"}<h3>${r.warnings.length} avisos</h3>${r.warnings.length ? "<ul>" + r.warnings.map((s) => `<li class="warning-text">${esc(s)}</li>`).join("") + "</ul>" : "<p>Nenhum aviso.</p>"}<h3>Simulação</h3><p>Início: <strong>${esc(nameOf(doc.fluxo.inicio))}</strong>. Ponto atual: <strong>${esc(active ? nameOf(active) : "não iniciada")}</strong>. ${trace.length} passos.</p>`,
          `<button data-action="modal-close">Fechar</button>`,
          { wide: false },
        );
      }
      function download(name, s) {
        const blob = new Blob([s], { type: "application/json;charset=utf-8" });
        const url = URL.createObjectURL(blob),
          a = document.createElement("a");
        a.href = url;
        a.download = name;
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 3500);
      }
      function exportDoc() {
        const out = portableDoc(doc);
        download(
          "advogadoja-fluxo-projecao.json",
          JSON.stringify(out, null, 2),
        );
        showNotice(
          "JSON exportado: navegação distribuída por tela, sem seção fluxo na raiz.",
        );
      }
      let importMode = "replace";
      async function importFile(file) {
        if (!file) return;
        try {
          const data = JSON.parse(await file.text());
          if (importMode === "catalog-refresh") {
            updateCatalogOnly(data);
            return;
          }
          const converted = normalize(data);
          if (
            !confirm(
              `Importar ${file.name}? Isso substitui a edição atual neste navegador. O catálogo e as conexões anteriores só ficam disponíveis se você os exportou.`,
            )
          )
            return;
          try {
            localStorage.setItem(BACKUP_KEY, JSON.stringify(portableDoc(doc)));
          } catch {}
          setDoc(
            converted,
            data.format ? "projeção V1 convertida" : "JSON importado",
          );
          showNotice(
            `Catálogo reconstruído: ${doc.fluxo.telasUsadas.length} telas, ${doc.fluxo.conexoes.length} conexões. ${doc.__editorProjection?.duplicatasVisuaisAgrupadas || 0} referências repetidas agrupadas.`,
          );
        } catch (e) {
          console.error(e);
          showNotice("Importação rejeitada: " + e.message);
        } finally {
          by("fileInput").value = "";
          importMode = "replace";
        }
      }
      function staticPreview(key, state) {
        const s = doc.catalogo.telas[key];
        if (!s) return "<!doctype html><p>Tela não encontrada no catálogo.</p>";
        const nodes = s.estrutura?.html?.composicao,
          components = doc.catalogo.componentes;
        if (!nodes || !Object.keys(nodes).length)
          return `<!doctype html><html lang="pt-BR"><meta charset="utf-8"><style>body{font:14px system-ui;padding:28px;color:#345;background:#f4f7fb}</style><h2>${esc(nameOf(key))}</h2><p>Este catálogo fornece a identidade da tela, mas não traz estrutura HTML/CSS para a prévia.</p><code>${esc(key)}</code></html>`;
        const tmp = document.implementation.createHTMLDocument("preview");
        const allRefs = {};
        const css = [];
        const rules = s.estrutura?.css?.regras || {},
          tokens = s.estrutura?.css?.tokens || {};
        css.push(
          ":root{" +
            Object.entries(tokens)
              .map(([k, v]) => `${k}:${v}`)
              .join(";") +
            "}",
        );
        css.push(...Object.values(rules).filter((x) => typeof x === "string"));
        function mkComp(ref) {
          const comp = components[ref];
          if (!comp) {
            const el = tmp.createElement("div");
            el.textContent = "Componente não encontrado: " + ref;
            el.style.color = "#b22";
            return { root: el, refs: {} };
          }
          const html = comp.estrutura?.html || {},
            elements = html.elementos || {},
            local = {},
            svgTags = new Set([
              "svg",
              "path",
              "circle",
              "rect",
              "g",
              "line",
              "polyline",
              "polygon",
              "ellipse",
              "text",
              "defs",
              "linearGradient",
              "stop",
            ]);
          css.push(
            ...Object.values(comp.estrutura?.css?.regras || {}).filter(
              (x) => typeof x === "string",
            ),
          );
          for (const [eid, d] of Object.entries(elements)) {
            const el = svgTags.has(d.tag)
              ? tmp.createElementNS("http://www.w3.org/2000/svg", d.tag)
              : tmp.createElement(d.tag || "div");
            for (const [attr, value] of Object.entries(d.atributos || {})) {
              if (/^on/i.test(attr) || attr === "srcdoc") continue;
              try {
                el.setAttribute(attr, String(value));
              } catch {}
            }
            if (d.texto) el.textContent = d.texto;
            local[eid] = el;
          }
          const sorted = Object.keys(elements).sort(
            (a, b) => (elements[a].ordem || 0) - (elements[b].ordem || 0),
          );
          const roots = [];
          for (const eid of sorted) {
            const d = elements[eid],
              el = local[eid];
            if (d.paiRef && local[d.paiRef]) local[d.paiRef].appendChild(el);
            else roots.push(el);
          }
          let root =
            local[html.raizRef] || roots[0] || tmp.createElement("div");
          for (const e of roots) {
            if (e !== root) root.appendChild(e);
          }
          Object.assign(allRefs, local);
          return { root, refs: local };
        }
        const sorted = Object.entries(nodes).sort(
          (a, b) => (a[1].ordem || 0) - (b[1].ordem || 0),
        );
        let root = null;
        for (const [alias, spec] of sorted) {
          const comp = mkComp(spec.componenteRef);
          if (!root) {
            root = comp.root;
          } else {
            const parent = allRefs[spec.paiRef] || root;
            parent.appendChild(comp.root);
          }
          allRefs[alias] = comp.root;
        }
        if (!root) return "<p>Sem componentes.</p>";
        const app = root.matches?.(".app") ? root : root.querySelector(".app");
        if (app) app.setAttribute("data-professional-access", state);
        if (state === "restricted") {
          const hero = tmp.querySelector(".home-access-card");
          if (hero) hero.hidden = false;
        }
        const htmlCSS = css.join("\n");
        const safeCSS = htmlCSS.replace(/<\/style/gi, "<\\/style");
        const safeHTML = root.outerHTML;
        return (
          '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>' +
          safeCSS +
          "</style></head><body>" +
          safeHTML +
          `<script>document.addEventListener('click',function(e){const b=e.target.closest('button');if(!b)return;const a=b.dataset.action||'';if(a==='drawer.open'){const x=document.querySelector('.prototype-drawer');if(x){x.classList.add('open');x.setAttribute('aria-hidden','false')}}else if(a==='drawer.close'){const x=document.querySelector('.prototype-drawer');if(x){x.classList.remove('open');x.setAttribute('aria-hidden','true')}}else if(a==='online.toggle'){b.classList.toggle('is-offline');const s=b.querySelector('.online-copy strong');if(s)s.textContent=b.classList.contains('is-offline')?'Offline':'Online';}else if(a==='route.close'){document.querySelector('.route-modal')?.classList.remove('open');}else if(b.classList.contains('request-card')){const m=document.querySelector('.route-modal');if(m){m.classList.add('open');m.setAttribute('aria-hidden','false');}}});<\/script>` +
          "</body></html>"
        );
      }
      function preview(key) {
        selected = key;
        previewState =
          doc.fluxo.variaveis.professionalAccess === "restricted"
            ? "restricted"
            : "enabled";
        const render = () => {
          const frame = by("previewIframe");
          if (frame) frame.srcdoc = staticPreview(key, previewState);
        };
        openModal(
          "Visualização · " + nameOf(key),
          `<div class="inline-actions" style="justify-content:space-between;margin:0 0 10px"><div><button class="form-btn" id="stateEnabled">OAB validada</button><button class="form-btn" id="stateRestricted">OAB pendente</button></div><small class="muted">Prévia composta exclusivamente dos JSONs do catálogo</small></div><iframe id="previewIframe" title="Prévia da tela" class="preview-frame" sandbox="allow-scripts allow-forms"></iframe>`,
          `<button data-action="modal-close">Fechar</button>`,
          { wide: true },
        );
        by("stateEnabled").addEventListener("click", () => {
          previewState = "enabled";
          render();
        });
        by("stateRestricted").addEventListener("click", () => {
          previewState = "restricted";
          render();
        });
        render();
      }
      function toolsDialog() {
        const r = validation(),
          f = doc.fluxo;
        openModal(
          "Ferramentas do motor",
          `<p class="dialog-note">O editor conserva a visualização da V1. As conexões são salvas em <code>catalogo.telas[id].navegacao</code>, nunca numa seção <code>fluxo</code> na raiz.</p><div class="kv"><span>Telas usadas</span><span>${f.telasUsadas.length} / ${Object.keys(doc.catalogo.telas).length} no catálogo</span></div><div class="kv"><span>Conexões</span><span>${f.conexoes.length}</span></div><div class="kv"><span>Bifurcações</span><span>${f.telasUsadas.filter((k) => outgoing(k).length > 1).length}</span></div><div class="kv"><span>Pendências</span><span>${r.errors.length + r.warnings.length}</span></div><div class="inline-actions" style="margin:20px 0"><button class="form-btn" id="openVarsTool">Variáveis</button><button class="form-btn" id="openValidationTool">Validar</button><button class="form-btn" id="startSimulationTool">Iniciar simulação</button><button class="form-btn" id="nextSimulationTool">Próxima saída</button><button class="form-btn" id="clearSimulationTool">Limpar caminho</button></div><p>Para definir saídas, clique no corpo de uma tela e escolha <strong>+ Criar conexão</strong>. As bifurcações surgem automaticamente.</p>`,
          `<button data-action="modal-close">Fechar</button>`,
        );
        const attach = (id, fn) => {
          by(id).onclick = () => {
            closeModal();
            fn();
          };
        };
        attach("openVarsTool", varsDialog);
        attach("openValidationTool", showValidation);
        attach("startSimulationTool", simulateStart);
        attach("nextSimulationTool", simulateNext);
        attach("clearSimulationTool", clearSim);
      }
      function openBranchEditor(key) {
        const edges = outgoing(key);
        openModal(
          "Editar bifurcação · " + nameOf(key),
          `<p class="dialog-note">Esta bifurcação é calculada pelas saídas da tela, não é um nó separado. Edite uma saída ou adicione outra.</p><div class="list-items">${edges.map((c) => `<div class="relation"><strong>${esc(c.rotulo || c.saida)} → ${esc(nameOf(c.para))}</strong><small>${esc(c.id)} · ${esc(whenStr(c))}</small><div class="mini-row"><button data-action="edit-edge" data-id="${esc(c.id)}">Editar</button><button data-action="delete-edge" data-id="${esc(c.id)}">Desconectar</button></div></div>`).join("")}</div><div class="mini-row"><button data-action="connect" data-key="${esc(key)}">+ Adicionar saída</button><button data-action="inspect" data-key="${esc(key)}">Campos da tela</button></div>`,
          `<button data-action="modal-close">Fechar</button>`,
        );
      }
      function removeBranch(key) {
        const edges = outgoing(key);
        if (!edges.length) return;
        if (
          !confirm(
            `Remover todas as ${edges.length} saídas de ${nameOf(key)}? As telas serão preservadas no catálogo.`,
          )
        )
          return;
        edit((f) => {
          f.conexoes = f.conexoes.filter((c) => c.de !== key);
        });
        showNotice("Bifurcação removida. As telas permanecem disponíveis.");
      }
      function initialFromReference() {
        const d = extractLegacyGraph(LEGACY_REFERENCE),
          original = copy(DEFAULT_CATALOG);
        // Mantém componentes da biblioteca atual; as telas de referência ausentes são só identidades.
        for (const [key, entry] of Object.entries(d.catalogo.telas))
          if (!original.catalogo.telas[key])
            original.catalogo.telas[key] = entry;
        original.fluxo = d.fluxo;
        // Garantir a referência inicial canônica mesmo que a projeção V1 esteja incompleta.
        original.fluxo.inicio = "auth.inicializacao.splash";
        return original;
      }
      function restoreBackup() {
        try {
          const data = localStorage.getItem(BACKUP_KEY);
          if (!data)
            return showNotice("Não há uma cópia anterior para restaurar.");
          if (
            !confirm(
              "Restaurar a cópia anterior? As edições atuais serão substituídas.",
            )
          )
            return;
          setDoc(JSON.parse(data), "cópia de segurança restaurada");
          showNotice("Cópia anterior restaurada.");
        } catch (e) {
          showNotice("Não foi possível restaurar: " + e.message);
        }
      }
      function updateCatalogOnly(input) {
        if (!input?.catalogo?.telas || !input?.catalogo?.componentes)
          throw Error(
            "Informe um JSON com catalogo.telas e catalogo.componentes.",
          );
        const old = portableDoc(doc),
          next = copy(input);
        next.catalogo.telas = { ...old.catalogo.telas, ...next.catalogo.telas };
        // Preserva as conexões existentes, associando-as às novas definições de tela por ID.
        for (const [key, t] of Object.entries(old.catalogo.telas))
          if (t.navegacao && next.catalogo.telas[key])
            next.catalogo.telas[key].navegacao = copy(t.navegacao);
        next.catalogo.componentes = {
          ...old.catalogo.componentes,
          ...next.catalogo.componentes,
        };
        localStorage.setItem(BACKUP_KEY, JSON.stringify(old));
        setDoc(next, "catálogo atualizado");
        showNotice("Catálogo atualizado sem remover as conexões por ID.");
      }
      function actionRun(action, button) {
        const key = button.dataset.key,
          idx = Number(button.dataset.index),
          eid = button.dataset.id;
        switch (action) {
          case "modal-close":
            closeModal();
            break;
          case "inspect":
            selectScreen(key);
            break;
          case "preview":
            preview(key);
            break;
          case "connect":
            makeConnect(key);
            break;
          case "edit-edge":
            makeConnect(null, eid);
            break;
          case "delete-edge":
            deleteConnection(eid);
            break;
          case "remove-screen":
            removeScreen(key);
            break;
          case "move-up":
            doMove(key, -1);
            break;
          case "move-down":
            doMove(key, 1);
            break;
          case "simulate-edge":
            simulateEdge(eid);
            break;
          case "switch-tab":
            tabState[key] = eid;
            draw();
            break;
          case "edit-branch":
            openBranchEditor(key);
            break;
          case "remove-branch":
            removeBranch(key);
            break;
          case "tools":
            toolsDialog();
            break;
          case "add-at":
            addScreen(idx);
            break;
          case "pick-screen": {
            const i = doc.fluxo.telasUsadas.indexOf(key);
            if (i >= 0) {
              closeModal();
              selectScreen(key);
              showNotice("Tela já está no fluxo; use a referência existente.");
              return;
            }
            edit((f) => {
              if (idx < 0) f.telasUsadas.push(key);
              else f.telasUsadas.splice(idx, 0, key);
              if (!f.inicio) f.inicio = key;
            });
            closeModal();
            break;
          }
          case "var-add":
            addVar();
            break;
          case "var-remove":
            button.closest(".var-item")?.remove();
            break;
        }
      }
      function bind() {
        document.body.addEventListener("click", (e) => {
          const button = e.target.closest("[data-action]");
          if (button) {
            actionRun(button.dataset.action, button);
            return;
          }
        });
        document.body.addEventListener("keydown", (e) => {
          if (
            (e.key === "Enter" || e.key === " ") &&
            e.target.matches(".flow-card__body")
          ) {
            e.preventDefault();
            selectScreen(e.target.dataset.key);
          }
        });
        by("modalClose").onclick = closeModal;
        by("closeDetail").onclick = closeDetail;
        by("modalRoot").addEventListener("click", (e) => {
          if (e.target === by("modalRoot")) closeModal();
        });
        window.addEventListener("keydown", (e) => {
          if (e.key === "Escape") {
            closeModal();
            closeDetail();
          }
          if (
            (e.ctrlKey || e.metaKey) &&
            !e.shiftKey &&
            e.key.toLowerCase() === "z" &&
            !["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)
          ) {
            e.preventDefault();
            undo();
          }
        });
        by("undoBtn").onclick = undo;
        by("redoBtn").onclick = redo;
        by("toolsBtn").onclick = toolsDialog;
        by("emptyBtn").onclick = () => {
          if (
            !confirm(
              "Criar fluxo vazio? As telas e componentes continuarão no catálogo; Restaurar base recupera o documento inicial.",
            )
          )
            return;
          try {
            localStorage.setItem(BACKUP_KEY, JSON.stringify(portableDoc(doc)));
          } catch {}
          edit((f) => {
            f.inicio = null;
            f.telasUsadas = [];
            f.conexoes = [];
          });
        };
        by("exportBtn").onclick = exportDoc;
        by("importBtn").onclick = () => {
          importMode = "replace";
          by("fileInput").click();
        };
        by("fileInput").onchange = (e) => importFile(e.target.files[0]);
        by("generateBtn").onclick = () => {
          if (
            !confirm(
              "Recriar todas as conexões do catálogo completo do Fluxo? Alterações não exportadas serão substituídas.",
            )
          )
            return;
          try {
            localStorage.setItem(BACKUP_KEY, JSON.stringify(portableDoc(doc)));
          } catch {}
          setDoc(initialFromReference(), "Catálogo do Fluxo reconstruído");
          showNotice(
            "Fluxo reconstruído com as relações declaradas no próprio documento.json.",
          );
        };
        by("createBtn").onclick = () => addScreen(-1);
        by("updateBtn").onclick = () => {
          importMode = "catalog-refresh";
          by("fileInput").click();
        };
        by("restoreBtn").onclick = restoreBackup;
        by("homeBtn").onclick = (e) => {
          e.preventDefault();
          showNotice(
            "O módulo é autocontido: a página inicial do construtor não está incluída.",
          );
        };
        let dragged = null;
        by("graph").addEventListener("dragstart", (e) => {
          const card = e.target.closest("[data-drag]");
          if (card) {
            dragged = card.dataset.drag;
            e.dataTransfer.effectAllowed = "move";
            e.dataTransfer.setData("text/plain", dragged);
          }
        });
        by("graph").addEventListener("dragover", (e) => {
          if (e.target.closest("[data-card]")) e.preventDefault();
        });
        by("graph").addEventListener("drop", (e) => {
          const card = e.target.closest("[data-card]");
          if (!card || !dragged) return;
          e.preventDefault();
          const to = card.dataset.card,
            from = dragged;
          dragged = null;
          const i = doc.fluxo.telasUsadas.indexOf(from),
            j = doc.fluxo.telasUsadas.indexOf(to);
          if (i < 0 || j < 0 || i === j) return;
          edit((f) => {
            const [node] = f.telasUsadas.splice(i, 1);
            f.telasUsadas.splice(j, 0, node);
          });
          showNotice(
            "Organização visual atualizada. Conexões por ID preservadas.",
          );
        });
      }
      function initialize() {
        bind();
        let stored = null;
        try {
          stored = localStorage.getItem(STORE_KEY);
        } catch {}
        if (stored) {
          try {
            setDoc(JSON.parse(stored), "trabalho local", false);
            by("saveStatus").textContent = "Salvo localmente";
            return;
          } catch (e) {
            console.warn(e);
          }
        }
        setDoc(initialSplashOnly(), "Splash inicial");
      }
      // IMPLEMENTAÇÃO V3: o grafo é uma projeção transitória calculada do catálogo.
      // Nenhuma chave 'fluxo' é gravada na raiz. A apresentação editorial utiliza apresentacao.root.
      let V3_BASE;
      let V3_ALIASES;
      const V3_SNAPSHOT_KEY = "advogadoja.flow.v3.snapshot.2026-11";
      const V3_STORE = "advogadoja.flow.v3.autocontido";
      function v3Canonical(key) {
        return V3_ALIASES[key] || key;
      }
      function v3UICondition(w) {
        if (!w || typeof w !== "object") return null;
        return {
          variavel: w.variavel || w.campo || "",
          operador:
            {
              igual: "==",
              diferente: "!=",
              maior: ">",
              menor: "<",
              maior_igual: ">=",
              menor_igual: "<=",
            }[w.operador] ||
            w.operador ||
            "==",
          valor: w.valor,
        };
      }
      function v3ExportCondition(w) {
        if (!w) return null;
        return {
          campo: w.variavel || w.campo || "",
          operador:
            {
              "==": "igual",
              "!=": "diferente",
              ">": "maior",
              "<": "menor",
              ">=": "maior_igual",
              "<=": "menor_igual",
            }[w.operador] ||
            w.operador ||
            "igual",
          valor: w.valor,
        };
      }
      function v3EmptyNavigation() {
        return {
          rotaPrincipal: null,
          rotasLegadas: [],
          parametrosRota: [],
          participacoes: [],
          entradas: [],
          saidas: [],
          bifurcacoes: [],
          caminhosLineares: [],
          referenciasEditoriaisExternas: [],
          ocorrenciasEditoriais: [],
          apresentacoesBifurcacoes: [],
        };
      }
      function v3ReferenceScreen(key, old) {
        const name =
          old?.identidade?.nomeExibicao || old?.identidade?.nome || key;
        return {
          schema: "advogadoja.tela",
          schemaVersion: "0.2.0",
          identidade: {
            id: key,
            tipo: "tela",
            namespace: key.split(".")[0],
            chave: key.split(".").pop(),
            nome: name,
            nomeExibicao: name,
            descricao: old?.identidade?.descricao || null,
            versao: null,
            aliasesLegados: [],
            referenciasExternas: [],
          },
          classificacao: {
            dominio: "atendimento_juridico",
            moduloRef: key.split(".")[0],
            submoduloRef: null,
            secao: null,
            categoria: "tela",
            escopo: key.split(".")[0],
            reutilizavel: false,
            publicoAlvo: [],
            tags: ["referencia_sem_visual"],
            classificacaoLegada: old?.classificacao || {},
          },
          navegacao: v3EmptyNavigation(),
          estados: {
            estadoInicialRef: null,
            estadoFallbackRef: null,
            criterioSelecao: "nao_declarado",
            itens: [],
          },
          acoes: { itens: [] },
          dados: {
            campos: [],
            fontes: [],
            operacoes: [],
            vinculos: [],
            persistencia: [],
          },
          componentes: {
            instancias: [],
            definicoesEmbutidas: {},
            variantesLegadas: [],
          },
          estrutura: {
            raiz: { id: key + ".raiz", tipo: "template_html", html: "" },
            montagem: {
              id: key + ".montagem",
              modo: "sem_html",
              slots: [],
              slotsPadrao: [],
            },
            variantesLegadas: [],
          },
          estilos: {
            temaRef: null,
            tokensLocais: {},
            fontesCss: [],
            regras: [],
            cssBase: "",
            variantesLegadas: [],
          },
          variantes: { itens: [] },
          interacoes: { itens: [] },
          mocks: {},
          localizacao: {},
          proveniencia: {
            sistemaOrigem: "importacao_referencia_v1",
            status: "referencia_sem_contrato_visual",
          },
        };
      }
      function v3FromV1(input) {
        let src = input;
        if (!src.catalogo?.telas && src.domain?.flow?.graph)
          src = extractLegacyGraph(src);
        if (!src.catalogo?.telas) throw Error("Arquivo sem catalogo.telas.");
        const d = copy(V3_BASE);
        const mapped = [];
        for (const [oldkey, item] of Object.entries(src.catalogo.telas)) {
          const key = v3Canonical(oldkey);
          mapped.push(key);
          const t =
            d.catalogo.telas[key] ||
            (d.catalogo.telas[key] = v3ReferenceScreen(key, item));
          const aliases =
            t.identidade.aliasesLegados || (t.identidade.aliasesLegados = []);
          if (key !== oldkey && !aliases.includes(oldkey)) aliases.push(oldkey);
          const route = item.compatibilidade?.flutterRoute;
          if (route) {
            let r = t.navegacao.rotasLegadas || (t.navegacao.rotasLegadas = []);
            if (!r.includes(route)) r.push(route);
          }
          if (item.estrutura?.html)
            t.proveniencia = {
              ...(t.proveniencia || {}),
              estruturaV1Original: copy(item.estrutura),
            };
          if (item.navegacao)
            t.proveniencia = {
              ...(t.proveniencia || {}),
              navegacaoImportadaV1: copy(item.navegacao),
            };
          // Conexões efetivamente declaradas na projeção V1 são convertidas, sem criar condições inexistentes.
          for (const oldEdge of item.navegacao?.saidas || []) {
            const dest = v3Canonical(oldEdge.para || oldEdge.destinoRef || "");
            if (!dest) continue;
            const nav = t.navegacao || (t.navegacao = v3EmptyNavigation());
            const edgeId = oldEdge.id || id(),
              cond = v3ExportCondition(oldEdge.quando),
              exists = nav.saidas?.some((e) => e.id === edgeId);
            if (!exists)
              nav.saidas.push({
                id: edgeId,
                acaoRef: "editor.navegacao",
                tipo: cond ? "rota" : "direto",
                rotulo: oldEdge.rotulo || oldEdge.saida || "Continuar",
                destinoTipo: "tela",
                destinoRef: dest,
                origemTelaRef: key,
                quando: cond,
                eventoOrigem: oldEdge.saida || "concluiu",
                origem: "conversao_editor_v1",
                navegacaoEditor: oldEdge.navegacao || "empilhar",
              });
          }
        }
        for (const [key, obj] of Object.entries(src.catalogo.componentes || {}))
          if (!d.catalogo.componentes[key])
            d.catalogo.componentes[key] = {
              schema: "advogadoja.componente",
              schemaVersion: "0.2.0",
              identidade: obj.identidade || { id: key, tipo: "componente" },
              estrutura: {
                base: {},
                variantes: [],
                arvoreLegada: obj.estrutura?.html || {},
              },
              estilos: {
                base: {
                  css: Object.values(obj.estrutura?.css?.regras || {}).join(
                    "\n",
                  ),
                },
                variantes: [],
              },
              interface: { props: {}, eventos: [] },
              classificacao: obj.classificacao || {},
              origem: "importacao_v1",
            };
        const legacy = src.fluxo;
        const used =
          legacy?.telasUsadas?.map(v3Canonical) ||
          Object.entries(src.catalogo.telas)
            .filter(
              ([, t]) =>
                t.navegacao?.inicial || t.navegacao?.ordem !== undefined,
            )
            .sort(
              (a, b) =>
                (a[1].navegacao.ordem || 999) - (b[1].navegacao.ordem || 999),
            )
            .map(([key]) => v3Canonical(key));
        const order = [...new Set(used.length ? used : ["app.splash"])];
        d.apresentacao.conexoesRefs = (src.fluxo?.conexoes || []).map(
          (c) => c.id,
        );
        if (!d.apresentacao.conexoesRefs.length)
          d.apresentacao.conexoesRefs = Object.values(src.catalogo.telas)
            .flatMap((x) => x.navegacao?.saidas || [])
            .map((c) => c.id)
            .filter(Boolean);
        d.apresentacao.root = {
          id: "sequence-fluxo-principal",
          type: "sequence",
          items: order.map((key, i) => ({
            id: "screen-editor-" + (i + 1),
            type: "screen",
            screenKey: key,
            telaRef: key,
            variant: "default",
            nomeEditor: d.catalogo.telas[key]?.identidade?.nomeExibicao || key,
            origem: "editor_fluxo_importacao",
          })),
        };
        d.apresentacao.transformacao = {
          fonte: "projecao_v1_importada",
          politica: "contrato_v3; aliases legados; nenhuma condicao inferida",
        };
        return d;
      }
      // Catálogo como autoridade: nunca filtrar as telas pelo ponto de partida (nem pela Splash).
      // O motor apenas projeta todas as relacoes de catalogo.telas[*].navegacao.saidas.
      function initialSplashOnly() {
        return copy(V3_BASE);
      } // Alias legado, sem filtro de inicializacao.
      function freshFromCatalog(o = V3_BASE) {
        return normalize(o);
      }
      function normalize(input) {
        let d;
        if (
          input?.schema === "advogadoja.flow-v3-autocontido" &&
          input?.catalogo?.telas
        )
          d = copy(input);
        else if (input?.catalogo?.telas || input?.domain?.flow?.graph)
          d = v3FromV1(input);
        else throw Error("O arquivo precisa conter catalogo.telas.");
        const telas = d.catalogo?.telas || {};
        // A importação de um V3 antigo recebe os contratos visuais já convertidos
        // sem apagar sua navegação, estados ou identidade.
        for(const [key,tela] of Object.entries(telas)){
          if(!tela.visualizacaoJornadas && V3_BASE?.catalogo?.telas?.[key]?.visualizacaoJornadas)
            tela.visualizacaoJornadas=copy(V3_BASE.catalogo.telas[key].visualizacaoJornadas);
        }
        if(!d.catalogo.componentesJornadas && V3_BASE?.catalogo?.componentesJornadas)
          d.catalogo.componentesJornadas=V3_BASE.catalogo.componentesJornadas;
        const aliases = { ...V3_ALIASES, ...(d.apresentacao?.aliasMap || {}) };
        const canon = (key) => {
          if (!key) return "";
          const mapped = aliases[key] || key;
          return telas[mapped] ? mapped : telas[key] ? key : mapped;
        };
        const allKeys = Object.keys(telas),
          conexoes = [],
          grouped = new Map(),
          loaded = new Set();
        let ignored = 0,
          unresolved = 0,
          collapsed = 0;
        // Nenhum filtro por apresentacao.root, caminho, jornada ou tela inicial.
        for (const originKey of allKeys) {
          const source = canon(originKey);
          for (const rel of telas[originKey]?.navegacao?.saidas || []) {
            if (rel.destinoTipo && rel.destinoTipo !== "tela") {
              ignored++;
              continue;
            }
            const dest = canon(
              rel.destinoRef || rel.para || rel.destinoTelaRef,
            );
            if (!dest || !telas[dest]) {
              unresolved++;
              continue;
            }
            const when = v3UICondition(rel.quando),
              conditionKey = when
                ? JSON.stringify([when.variavel, when.operador, when.valor])
                : "-";
            const signature = JSON.stringify([source, dest, conditionKey]);
            const relationId =
              rel.id ||
              "relation.editor." + source + "." + dest + "." + conexoes.length;
            loaded.add(relationId);
            let edge = grouped.get(signature);
            if (edge) {
              edge.referenciasOriginais.push(relationId);
              collapsed++;
              continue;
            }
            edge = {
              id: relationId,
              de: source,
              para: dest,
              saida: rel.eventoOrigem || rel.rotaAliasLegada || "concluiu",
              tipo: when ? "condicional" : "sequencial",
              rotulo: rel.rotulo || rel.eventoOrigem || "",
              quando: when,
              navegacao: rel.navegacaoEditor || "empilhar",
              referenciasOriginais: [relationId],
            };
            grouped.set(signature, edge);
            conexoes.push(edge);
          }
        }
        // A escolha da primeira tela é INFERIDA DO CATÁLOGO, não do seu nome ou da árvore editorial.
        const inbound = new Map(allKeys.map((k) => [k, 0]));
        for (const edge of conexoes)
          inbound.set(edge.para, (inbound.get(edge.para) || 0) + 1);
        const manifesto = d.catalogo?.manifest?.jornadas || [];
        const rank = new Map();
        let idx = 0;
        for (const j of [...manifesto].sort(
          (x, y) => (x.ordem ?? 999) - (y.ordem ?? 999),
        ))
          for (const sj of [...(j.subjornadas || [])].sort(
            (x, y) => (x.ordem ?? 999) - (y.ordem ?? 999),
          ))
            for (const key of sj.telasRefs || []) {
              const k = canon(key);
              if (telas[k] && !rank.has(k)) rank.set(k, idx++);
            }
        const priority = (k) => {
          const n = telas[k]?.navegacao || {};
          const parts = n.participacoes || [];
          const initializer = parts.some(
            (x) => x.papel === "inicio" || x.contexto?.modo === "inicio",
          );
          const firstStage = parts.some(
            (x) =>
              x.jornadaRef === "app" &&
              x.subjornadaRef === "app.inicializacao" &&
              x.ordem === 1,
          );
          return [
            n.inicial === true
              ? 0
              : firstStage
                ? 1
                : initializer
                  ? 2
                  : inbound.get(k) === 0
                    ? 3
                    : 4,
            rank.get(k) ?? 999999,
            k,
          ];
        };
        const cmp = (a, b) => {
          const x = priority(a),
            y = priority(b);
          for (let i = 0; i < x.length; i++) {
            if (x[i] < y[i]) return -1;
            if (x[i] > y[i]) return 1;
          }
          return 0;
        };
        const ordered = [...allKeys].sort(cmp);
        const entry = ordered[0] || null;
        // Expor todos os elementos do catálogo, inclusive núcleos independentes.
        const outMap = new Map();
        for (const c of conexoes) {
          if (!outMap.has(c.de)) outMap.set(c.de, []);
          outMap.get(c.de).push(c.para);
        }
        const telasUsadas = [],
          visited = new Set();
        function walk(root) {
          const queue = [root];
          for (let i = 0; i < queue.length; i++) {
            const key = queue[i];
            if (!telas[key] || visited.has(key)) continue;
            visited.add(key);
            telasUsadas.push(key);
            for (const next of outMap.get(key) || [])
              if (!visited.has(next)) queue.push(next);
          }
        }
        if (entry) walk(entry);
        for (const key of ordered) walk(key);
        const f = {
          schemaVersion: 3,
          inicio: entry,
          telasUsadas,
          conexoes,
          variaveis: {
            professionalAccess: "enabled",
            onboardingConcluido: true,
            primeiroAcesso: false,
          },
          configuracao: {
            politicaRetorno: "historico",
            bifurcacao: "automatica",
          },
        };
        d.fluxo = f;
        d.__editorLoadedIds = [...loaded];
        d.__editorDirty = false;
        d.__editorProjection = {
          origem: "catalogo.telas",
          automatico: true,
          duplicatasVisuaisAgrupadas: collapsed,
          saidasInternas: ignored,
          saidasPendentes: unresolved,
          telas: telasUsadas.length,
          conexoes: conexoes.length,
          semEntrada: [...allKeys].filter((k) => !inbound.get(k)).length,
        };
        delete d.__editorStartupOnly;
        return d;
      }
      function portableDoc(src) {
        const d = copy(src),
          f = src.fluxo;
        delete d.fluxo;
        delete d.__editorLoadedIds;
        delete d.__editorDirty;
        delete d.__editorProjection;
        delete d.__editorStartupOnly;
        if (!d.apresentacao)
          d.apresentacao = {
            schema: "advogadoja.flow-apresentacao",
            schemaVersion: "3.1.0",
          };
        if (!src.__editorDirty) {
          d.savedAt = new Date().toISOString();
          return d;
        }
        d.apresentacao.modoProjecao = "editorial";
        d.apresentacao.root = {
          id: d.apresentacao.root?.id || "sequence-fluxo-principal",
          type: "sequence",
          items: f.telasUsadas.map((key, i) => ({
            id: "screen-editor-" + (i + 1),
            type: "screen",
            screenKey: key,
            telaRef: key,
            variant: "default",
            nomeEditor: d.catalogo.telas[key]?.identidade?.nomeExibicao || key,
            origem: "editor_fluxo_v3",
          })),
        };
        const idsInUI = new Set(
          f.conexoes.flatMap((c) =>
            c.referenciasOriginais?.length ? c.referenciasOriginais : [c.id],
          ),
        );
        d.apresentacao.conexoesRefs = [...idsInUI];
        const formerlyLoaded = new Set(src.__editorLoadedIds || []);
        for (const [key, t] of Object.entries(d.catalogo.telas)) {
          if (!t.navegacao) continue;
          const nav = t.navegacao;
          nav.saidas = (nav.saidas || []).filter(
            (r) => !formerlyLoaded.has(r.id) || idsInUI.has(r.id),
          );
          nav.entradas = (nav.entradas || []).filter(
            (r) =>
              !formerlyLoaded.has(r.relacaoRef) || idsInUI.has(r.relacaoRef),
          );
        }
        for (const c of f.conexoes) {
          const origin = d.catalogo.telas[c.de],
            target = d.catalogo.telas[c.para];
          if (!origin || !target) continue;
          const nav =
            origin.navegacao || (origin.navegacao = v3EmptyNavigation());
          nav.saidas = nav.saidas || [];
          const refs = c.referenciasOriginais?.length
            ? c.referenciasOriginais
            : [c.id];
          for (const rid of refs) {
            let rel = nav.saidas.find((r) => r.id === rid);
            if (!rel) {
              rel = {
                id: rid,
                acaoRef: "editor.navegacao",
                origemTelaRef: c.de,
                origem: "editor_flow_v3",
              };
              nav.saidas.push(rel);
            }
            // Conservar metadados e condicoes originais se o caminho nao foi editado.
            const old = src.catalogo.telas[c.de]?.navegacao?.saidas?.find(
              (r) => r.id === rid,
            );
            const unchanged =
              old &&
              (old.destinoRef || "") === c.para &&
              JSON.stringify(v3UICondition(old.quando)) ===
                JSON.stringify(c.quando || null) &&
              (old.rotulo || "") === (c.rotulo || "") &&
              (old.eventoOrigem || old.rotaAliasLegada || "concluiu") ===
                (c.saida || "concluiu");
            if (unchanged) continue;
            rel.tipo = c.tipo === "condicional" ? "rota" : "direto";
            rel.eventoOrigem = c.saida || "concluiu";
            rel.rotulo = c.rotulo || c.saida || "Continuar";
            rel.destinoTipo = "tela";
            rel.destinoRef = c.para;
            rel.origemTelaRef = c.de;
            rel.quando = v3ExportCondition(c.quando);
            rel.navegacaoEditor = c.navegacao || "empilhar";
          }
        }
        // Bifurcacoes existentes no V3 sao preservadas. Novas conexoes do editor
        // passam a ser renderizadas automaticamente; nao criar branch extra redundante.
        d.savedAt = new Date().toISOString();
        return d;
      }
      // Catálogo grande: persista via IndexedDB; não afirme 'salvo' se o navegador bloquear.
      function persist() {
        dirty = false;
        by("saveStatus").textContent = "Salvando…";
        try {
          const snapshot = {
            screens: doc.fluxo.telasUsadas,
            edges: doc.fluxo.conexoes,
          };
          localStorage.setItem(V3_SNAPSHOT_KEY, JSON.stringify(snapshot));
        } catch (e) {
          console.warn("Snapshot local indisponível", e);
        }
        try {
          if (!window.indexedDB) throw Error("IndexedDB não disponível");
          const request = indexedDB.open(V3_STORE, 1);
          request.onupgradeneeded = () => {
            if (!request.result.objectStoreNames.contains("projetos"))
              request.result.createObjectStore("projetos");
          };
          request.onerror = () => {
            by("saveStatus").textContent = "Exporte para salvar";
          };
          request.onsuccess = () => {
            try {
              const db = request.result;
              const tx = db.transaction("projetos", "readwrite");
              tx.objectStore("projetos").put(portableDoc(doc), "principal");
              tx.oncomplete = () => {
                by("saveStatus").textContent = "Salvo localmente";
                db.close();
              };
              tx.onerror = () => {
                by("saveStatus").textContent = "Exporte para salvar";
                db.close();
              };
            } catch (e) {
              by("saveStatus").textContent = "Exporte para salvar";
            }
          };
        } catch (e) {
          by("saveStatus").textContent = "Exporte para salvar";
        }
      }
      function edit(callback) {
        history.push(copy(doc.fluxo));
        if (history.length > 40) history.shift();
        future.length = 0;
        callback(doc.fluxo, doc);
        doc.__editorDirty = true;
        doc.savedAt = new Date().toISOString();
        dirty = true;
        persist();
        draw();
      }
      function undo() {
        if (!history.length) return;
        future.push(copy(doc.fluxo));
        doc.fluxo = history.pop();
        doc.__editorDirty = true;
        persist();
        draw();
      }
      function redo() {
        if (!future.length) return;
        history.push(copy(doc.fluxo));
        doc.fluxo = future.pop();
        doc.__editorDirty = true;
        persist();
        draw();
      }
      function restoreLocalV3(done) {
        try {
          if (!window.indexedDB) return done(null);
          const req = indexedDB.open(V3_STORE, 1);
          req.onupgradeneeded = () => {
            if (!req.result.objectStoreNames.contains("projetos"))
              req.result.createObjectStore("projetos");
          };
          req.onerror = () => done(null);
          req.onsuccess = () => {
            const db = req.result,
              tx = db.transaction("projetos", "readonly"),
              r = tx.objectStore("projetos").get("principal");
            r.onsuccess = () => {
              const data = r.result;
              db.close();
              done(data || null);
            };
            r.onerror = () => {
              db.close();
              done(null);
            };
          };
        } catch (e) {
          done(null);
        }
      }
      function initialize() {
        bind();
        setDoc(freshFromCatalog(), "Catálogo V3", false);
        by("saveStatus").textContent = "Pronto · exporte para salvar";
        restoreLocalV3((stored) => {
          try {
            if (stored?.schema === "advogadoja.flow-v3-autocontido") {
              setDoc(stored, "trabalho local", false);
              by("saveStatus").textContent = "Trabalho local restaurado";
            }
          } catch (e) {
            console.warn("Não foi possível restaurar V3", e);
          }
        });
      }
      function initialFromReference() {
        return freshFromCatalog();
      }
      function updateCatalogOnly(input) {
        const fresh =
            input?.schema === "advogadoja.flow-v3-autocontido"
              ? copy(input)
              : v3FromV1(input),
          old = portableDoc(doc);
        const next = copy(fresh);
        for (const [k, t] of Object.entries(old.catalogo.telas)) {
          if (!next.catalogo.telas[k]) next.catalogo.telas[k] = t;
          else if (t.navegacao)
            next.catalogo.telas[k].navegacao = copy(t.navegacao);
        }
        next.catalogo.componentes = {
          ...old.catalogo.componentes,
          ...next.catalogo.componentes,
        };
        next.apresentacao.root = copy(old.apresentacao.root);
        try {
          localStorage.setItem(
            BACKUP_KEY,
            JSON.stringify({
              schema: old.schema,
              apresentacao: old.apresentacao,
            }),
          );
        } catch {}
        setDoc(next, "base V3 atualizada");
        showNotice(
          "Base transformada; navegação V3 e edição visual preservadas.",
        );
      }
      function whenStr(c) {
        if (c.pendenteCondicao) return "⚠ Condição não definida";
        if (!c.quando)
          return c.tipo === "condicional"
            ? "⚠ Condição não definida"
            : "Sem condição";
        const w = c.quando;
        return (
          (w.variavel || w.campo || "?") +
          " " +
          (w.operador || "==") +
          " " +
          JSON.stringify(w.valor)
        );
      }
      function v3Text(value) {
        return typeof value === "string"
          ? value
          : JSON.stringify(value, null, 2);
      }
      function renderDetail() {
        const panel = by("detail");
        if (!selected || !doc.catalogo.telas[selected]) {
          if (!selected) panel.classList.remove("open");
          return;
        }
        panel.classList.add("open");
        by("detailTitle").textContent = nameOf(selected);
        const t = doc.catalogo.telas[selected],
          nav = t.navegacao || {},
          inbound = incoming(selected),
          outbound = outgoing(selected);
        const participacoes = nav.participacoes || [],
          refs = t.componentes?.instancias?.map((x) => x.componenteRef) || [];
        const aliases = t.identidade?.aliasesLegados || [];
        const rows = [
          ["ID canônico", selected],
          ["Contrato", t.schema || "não informado"],
          [
            "Jornadas",
            participacoes
              .map(
                (x) =>
                  x.jornadaRef +
                  (x.subjornadaRef ? " · " + x.subjornadaRef : ""),
              )
              .join("; ") || "a definir",
          ],
          ["Rota legada", (nav.rotasLegadas || []).join(", ") || "—"],
          ["Aliases V1", aliases.join(", ") || "—"],
          ["Componentes", refs.join(", ") || "Nenhum"],
          [
            "Conexões nesta apresentação",
            inbound.length + " entradas · " + outbound.length + " saídas",
          ],
          [
            "Relações no catálogo V3",
            (nav.entradas || []).length +
              " entradas · " +
              (nav.saidas || []).length +
              " saídas",
          ],
        ];
        by("detailBody").innerHTML =
          rows
            .map(
              ([key, val]) =>
                `<div class="kv"><span>${esc(key)}</span><span>${esc(val)}</span></div>`,
            )
            .join("") +
          `<h3>Saídas do contrato V3</h3>` +
          (nav.saidas || [])
            .slice(0, 30)
            .map(
              (e) =>
                `<div class="relation"><strong>${esc(e.rotulo || e.eventoOrigem || e.id)} → ${esc(e.destinoRef || e.destinoNoRef || "pendente")}</strong><small>${esc(e.id)} · ${esc(e.quando ? JSON.stringify(e.quando) : "Sem condição")}</small></div>`,
            )
            .join("") +
          `<h3>Editor</h3><div class="mini-row"><button data-action="preview" data-key="${esc(selected)}">Visual</button><button data-action="connect" data-key="${esc(selected)}">+ Conectar</button></div>`;
      }
      function staticPreview(key, state) {
        const t = doc.catalogo.telas[key];
        if (!t) return "<p>Não encontrado</p>";
        if (t.estrutura?.html?.composicao) {
          return '<!doctype html><html lang="pt-BR"><meta charset="utf-8"><body><p>Visual V1 legada nesta tela. Para a prévia V3, use a estrutura raiz.</p></body></html>';
        }
        const rootHtml = t.estrutura?.raiz?.html || "";
        if (!rootHtml)
          return `<!doctype html><html lang="pt-BR"><meta charset="utf-8"><style>body{background:#eef2f6;color:#10233f;font:14px system-ui;padding:22px}</style><h2>${esc(nameOf(key))}</h2><p>Esta tela ainda não tem HTML na biblioteca V3.</p><code>${esc(key)}</code></html>`;
        const tmp = document.implementation.createHTMLDocument("preview");
        const container = tmp.createElement("div");
        container.innerHTML = rootHtml;
        let rules = (t.estilos?.regras || [])
          .map((x) => x.css || "")
          .filter(Boolean);
        if (t.estilos?.cssBase) rules.unshift(t.estilos.cssBase);
        const components = t.componentes?.instancias || [],
          defs = t.componentes?.definicoesEmbutidas || {};
        for (const inst of components.sort(
          (a, b) => (a.ordem || 0) - (b.ordem || 0),
        )) {
          const comp =
            defs[inst.componenteRef]?.componente ||
            defs[inst.componenteRef] ||
            doc.catalogo.componentes[inst.componenteRef];
          if (!comp) continue;
          const base = comp.estrutura?.base || {},
            variants = comp.estrutura?.variantes || [];
          let html = base.html || base.template || "";
          const variant = variants.find((x) => x.id === inst.varianteRef);
          if (variant?.html) html = variant.html;
          if (!html) continue;
          for (const [prop, value] of Object.entries(inst.props || {}))
            html = html.split("{{" + prop + "}}").join(String(value ?? ""));
          let node = Array.from(container.querySelectorAll("[data-slot]")).find(
            (x) => x.getAttribute("data-slot") === inst.slot,
          );
          if (node) {
            node.insertAdjacentHTML("beforeend", html);
          }
          if (comp.estilos?.base?.css) rules.push(comp.estilos.base.css);
        }
        const tokens = t.estilos?.tokensLocais || {};
        const css =
          ":root{--primary:#10233f;--page:#eef2f6;--surface:#fff;--line:#dbe3ee;--text:#172033;--muted:#667085;" +
          Object.entries(tokens)
            .map(([k, v]) => k + ":" + v)
            .join(";") +
          '}body{margin:0;min-height:100vh;background:var(--page);font-family:Inter,"Segoe UI",sans-serif;color:var(--text)}*{box-sizing:border-box}' +
          rules.join("\n");
        const stateStyle =
          state === "restricted"
            ? '[data-professional-access="enabled"]{display:none}'
            : "";
        return (
          '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>' +
          css.replace(/<\/style/gi, "<\\/style") +
          "\n" +
          stateStyle +
          "</style></head><body>" +
          container.innerHTML +
          "</body></html>"
        );
      }
      function preview(key) {
        selected = key;
        previewState =
          doc.fluxo.variaveis.professionalAccess === "restricted"
            ? "restricted"
            : "enabled";
        openModal(
          "Visualização · " + nameOf(key),
          `<div class="inline-actions" style="justify-content:space-between;margin:0 0 10px"><div><button class="form-btn" id="stateEnabled">Padrão / habilitada</button><button class="form-btn" id="stateRestricted">Restrita</button></div><small class="muted">Prévia da estrutura e componentes V3</small></div><iframe id="previewIframe" title="Prévia da tela" class="preview-frame" sandbox="allow-forms"></iframe>`,
          `<button data-action="modal-close">Fechar</button>`,
          { wide: true },
        );
        const render = () => {
          const frame = by("previewIframe");
          if (frame) frame.srcdoc = staticPreview(key, previewState);
        };
        by("stateEnabled").onclick = () => {
          previewState = "enabled";
          render();
        };
        by("stateRestricted").onclick = () => {
          previewState = "restricted";
          render();
        };
        render();
      }
      function toolsDialog() {
        const r = validation(),
          f = doc.fluxo;
        openModal(
          "Ferramentas do Fluxo",
          `<p class="dialog-note">As telas e os componentes são preservados integralmente de Jornadas. As conexões estão em <code>telas[id].navegacao.saidas</code> e as bifurcações são inferidas.</p><div class="kv"><span>Telas no catálogo</span><span>${Object.keys(doc.catalogo.telas).length}</span></div><div class="kv"><span>Componentes</span><span>${Object.keys(doc.catalogo.componentes).length}</span></div><div class="kv"><span>Telas exibidas</span><span>${f.telasUsadas.length}</span></div><div class="kv"><span>Conexões visuais</span><span>${f.conexoes.length}</span></div><div class="kv"><span>Problemas</span><span>${r.errors.length + r.warnings.length}</span></div><div class="inline-actions" style="margin:20px 0"><button class="form-btn" id="openVarsTool">Variáveis</button><button class="form-btn" id="openValidationTool">Validar</button><button class="form-btn" id="startSimulationTool">Iniciar simulação</button><button class="form-btn" id="nextSimulationTool">Próxima saída</button><button class="form-btn" id="clearSimulationTool">Limpar</button></div>`,
          `<button data-action="modal-close">Fechar</button>`,
        );
        const attach = (id, fn) => {
          by(id).onclick = () => {
            closeModal();
            fn();
          };
        };
        attach("openVarsTool", varsDialog);
        attach("openValidationTool", showValidation);
        attach("startSimulationTool", simulateStart);
        attach("nextSimulationTool", simulateNext);
        attach("clearSimulationTool", clearSim);
      }
      function exportDoc() {
        const out = portableDoc(doc);
        download(
          "advogadoja-fluxo-projecao.json",
          JSON.stringify(out, null, 2),
        );
        showNotice(
          "Contrato V3 exportado. Navegação por tela; apresentação editorial na chave apresentacao.",
        );
      }
      // Validação adicional: a importação deve preservar o modelo V3 e não converter uma vez mais.


      // MOTOR CANÔNICO DE JORNADAS — definição visual lida DIRETO do documento.json.
      // Não há visualizacaoJornadas no catálogo V3 nem conversão de elementos CSS/HTML.
      let JORNADAS_SOURCE=null;
      const AJ_JORNADAS_RUNTIME="'use strict';\n(function(){\n  const info=JSON.parse(document.getElementById('view-data').textContent);\n  const mount=document.getElementById('app-root');\n  const warning=document.getElementById('warnings');\n  const notification=document.getElementById('navigation-tip');\n  const composition=info.estrutura?.html?.composicao||{};\n  const definitions=info.definicoes||{};\n  const instances=info.instancias||{};\n  const warnings=[];\n  const perInstance=new Map();\n  const allElements=new Map();\n  const instanceRoots=new Map();\n  const stateByInstance=new Map();\n  const voids=new Set(['input','img','hr','br','meta','link','area','source','wbr']);\n  const deny=new Set(['script','iframe','object','embed','meta','link','base','form','style']);\n  const svgTags=new Set(['svg','g','path','circle','rect','line','ellipse','polyline','polygon','text','tspan','defs','clipPath','mask','linearGradient','radialGradient','stop','use','symbol']);\n  const $=s=>document.querySelector(s);\n  function showMessage(s){notification.hidden=false;notification.textContent=s;clearTimeout(window.__notice);window.__notice=setTimeout(()=>notification.hidden=true,3400)}\n  function createTree(def,inst){\n    const html=def?.estrutura?.html||{}, entries=Object.entries(html.elementos||{});\n    const children=new Map(), byKey=new Map(entries), registry=new Map();\n    for(const [id,data] of entries){const parent=data?.paiRef;if(parent&&byKey.has(parent)&&parent!==id){if(!children.has(parent))children.set(parent,[]);children.get(parent).push([id,data]);}}\n    for(const list of children.values())list.sort((a,b)=>(Number(a[1].ordem)||0)-(Number(b[1].ordem)||0));\n    const recursing=new Set();\n    function build(id,svg=false){\n      if(recursing.has(id))throw Error('Ciclo em elemento '+id+' / '+inst);\n      recursing.add(id);\n      const data=byKey.get(id)||{},tag=String(data.tag||'div');let el;\n      if(tag==='#text')el=document.createTextNode(String(data.texto??''));\n      else if(!/^[a-z][\\w:-]*$/i.test(tag)||deny.has(tag.toLowerCase()))el=document.createTextNode('');\n      else{\n        const isSvg=svg||svgTags.has(tag);el=isSvg?document.createElementNS('http://www.w3.org/2000/svg',tag):document.createElement(tag);\n        const attrs=data.atributos||{};\n        const pairs=Array.isArray(attrs)?attrs.map(a=>[a.nome,a.valor]):Object.entries(attrs);\n        for(const [k,value] of pairs){\n          const key=String(k),v=String(value??'');\n          if(!/^[a-z_:][\\w:.-]*$/i.test(key)||/^on/i.test(key)||['srcdoc','is'].includes(key.toLowerCase()))continue;\n          if(['href','src','xlink:href','action','formaction'].includes(key.toLowerCase())&&/^(javascript|data:text\\/html):/i.test(v.trim()))continue;\n          try{el.setAttribute(key,v)}catch(e){}\n        }\n        if(typeof data.texto==='string'&&data.texto)el.appendChild(document.createTextNode(data.texto));\n        if(!voids.has(tag.toLowerCase()))for(const [child] of children.get(id)||[])el.appendChild(build(child,isSvg));\n      }\n      if(el.nodeType===1)el.__instanceOrder=Number(data.ordem)||0;\n      registry.set(id,el);\n      if(!allElements.has(id))allElements.set(id,el);\n      recursing.delete(id);return el;\n    }\n    const rootRef=html.raizRef;\n    const top=entries.filter(([id,d])=>!d.paiRef||!byKey.has(d.paiRef)||id===d.paiRef);\n    top.sort((a,b)=>(a[0]===rootRef?-1:b[0]===rootRef?1:(Number(a[1].ordem)||0)-(Number(b[1].ordem)||0)));\n    const nodes=top.map(([id])=>build(id));\n    if(!nodes.length)warnings.push('Sem elementos: '+inst+' / '+(def?.identidade?.id||'?'));\n    perInstance.set(inst,registry);\n    instanceRoots.set(inst,nodes);\n    return nodes;\n  }\n  function baseStates(inst){const axes=definitions[instances[inst]]?.estrutura?.estadosVisuais||{};const selected=composition[inst]?.estadoVisual||{};const result={};\n    for(const [axis,details] of Object.entries(axes)){const choice=selected[axis]??details.inicial; if(details.opcoes?.[choice])result[axis]=choice;else warnings.push('Estado desconhecido em '+inst+': '+axis+'/'+choice);}\n    return result;\n  }\n  function applyStates(inst){const def=definitions[instances[inst]];const axes=def?.estrutura?.estadosVisuais||{};const elements=perInstance.get(inst)||new Map();const options=stateByInstance.get(inst)||{};\n    const affected=new Set();for(const axis of Object.values(axes))for(const option of Object.values(axis.opcoes||{}))for(const ref of Object.keys(option.elementos||{}))affected.add(ref);\n    for(const ref of affected){const el=elements.get(ref);if(!el||el.nodeType!==1)continue;if(!el.__visualBase){el.__visualBase={attrs:Array.from(el.attributes).map(a=>[a.name,a.value]),text:el.textContent}};\n      const base=el.__visualBase;for(const a of Array.from(el.attributes))el.removeAttribute(a.name);for(const [k,v] of base.attrs)el.setAttribute(k,v);if(!el.childElementCount)el.textContent=base.text;\n    }\n    for(const [axis,details] of Object.entries(axes)){\n      const selection=options[axis]??details.inicial;const option=details.opcoes?.[selection];if(!option)continue;\n      for(const [ref,mod] of Object.entries(option.elementos||{})){\n        const el=elements.get(ref);if(!el||el.nodeType!==1){warnings.push('Estado '+axis+' não encontra elemento '+ref);continue;}\n        if(mod.classesAdicionar)for(const n of mod.classesAdicionar)el.classList.add(n);\n        if(mod.classesRemover)for(const n of mod.classesRemover)el.classList.remove(n);\n        for(const [k,v] of Object.entries(mod.atributos||{})){if(/^on/i.test(k))continue;if(v==null)el.removeAttribute(k);else el.setAttribute(k,String(v));}\n        if(mod.texto!==undefined)el.textContent=String(mod.texto);\n        if(mod.visivel!==undefined)el.hidden=!mod.visivel;\n      }\n    }\n  }\n  function setVisualState(inst,axis,value){const config=definitions[instances[inst]]?.estrutura?.estadosVisuais?.[axis];if(!config?.opcoes?.[value])return false;\n    stateByInstance.set(inst,{...(stateByInstance.get(inst)||{}),[axis]:value});applyStates(inst);return true;}\n  try{\n    const allStyles=[`:root{${Object.entries(info.estrutura?.css?.tokens||{}).map(([k,v])=>k+':'+v+';').join('')}}`,...Object.values(info.estrutura?.css?.regras||{})];\n    const items=Object.entries(instances).map(([inst,ref],i)=>({inst,ref,index:i,order:Number(composition[inst]?.ordem)||0}));\n    for(const item of items){const def=definitions[item.ref];if(!def){warnings.push('Definição ausente: '+item.ref);continue;}\n      allStyles.push(...Object.values(def.estrutura?.css?.regras||{}));createTree(def,item.inst);stateByInstance.set(item.inst,baseStates(item.inst));}\n    const css=document.createElement('style');css.textContent=allStyles.join('\\n').replace(/:host\\b/g,':root');document.head.append(css);\n    const inserted=new Set(),first=info.estrutura?.html?.raizRef||items[0]?.inst;\n    function place(item){if(inserted.has(item.inst))return true;\n      let parent=mount;\n      if(item.inst!==first){const parentRef=composition[item.inst]?.paiRef;\n        if(parentRef){let target=allElements.get(parentRef);if(!target){\n            const parentInst=items.find(x=>x.inst===parentRef);\n            if(parentInst&&!inserted.has(parentInst.inst))place(parentInst);\n            target=allElements.get(parentRef)||instanceRoots.get(parentRef)?.[0];}\n          if(target)parent=target;else warnings.push('Pai não encontrado: '+parentRef+' / '+item.inst);\n        }\n      }\n      for(const el of instanceRoots.get(item.inst)||[]){el.__instanceOrder=item.order;const before=Array.from(parent.childNodes).find(x=>(x.__instanceOrder??-Infinity)>item.order);parent.insertBefore(el,before||null);}\n      inserted.add(item.inst);return true;}\n    items.sort((a,b)=>a.inst===first?-1:b.inst===first?1:a.order-b.order||a.index-b.index);\n    for(const item of items)place(item);\n    for(const item of items)applyStates(item.inst);\n    if(!mount.childNodes.length)throw Error('Nenhum componente renderizável');\n  }catch(err){warnings.push('Falha na montagem: '+err.message);mount.textContent='A estrutura não pôde ser montada. Verifique os contratos JSON.';}\n  const declared=info.navegacao?.destinosDeclarados||[];\n  function currentDrawer(){return Object.keys(instances).find(k=>k.includes('drawer')||definitions[instances[k]]?.classificacao?.categoria==='menu');}\n  function closeDrawer(){const inst=currentDrawer();if(inst&&setVisualState(inst,'painel','fechado'))return;\n    document.querySelectorAll('.prototype-drawer,.drawer,[data-overlay-root]').forEach(el=>{el.classList.remove('open','is-open');el.setAttribute('aria-hidden','true');});}\n  function openDrawer(){const inst=currentDrawer();if(inst&&setVisualState(inst,'painel','aberto'))return;\n    const el=$('.prototype-drawer')||$('[data-overlay-root]')||$('.drawer');if(el){el.classList.add('open');el.setAttribute('aria-hidden','false');}}\n  document.addEventListener('click',ev=>{\n    const el=ev.target.closest?.('button,a,[data-action],[data-goto]');if(!el)return;\n    const action=el.getAttribute('data-action')||'';\n    if(action==='drawer.open'||el.matches('.app-menu-button,[aria-label=\"Abrir menu\"]')){ev.preventDefault();openDrawer();return;}\n    if(action==='drawer.close'||el.matches('.drawer-backdrop,[aria-label=\"Fechar menu\"]')){ev.preventDefault();closeDrawer();return;}\n    if(el.matches('.aj-menu__switch[role=\"switch\"]')){ev.preventDefault();const inst=currentDrawer();if(inst){const v=stateByInstance.get(inst)?.disponibilidade||'online';setVisualState(inst,'disponibilidade',v==='online'?'offline':'online');}return;}\n    let elementId=null,instanceId=null;\n    for(const [inst,reg] of perInstance){for(const [ref,node] of reg){if(node===el){elementId=ref;instanceId=inst;break;}}if(instanceId)break;}\n    const destination=declared.find(d=>d.instanciaRef===instanceId&&d.elementoRef===elementId)?.destinoRef\n      ||declared.find(d=>!d.instanciaRef&&d.elementoRef===elementId)?.destinoRef\n      ||el.getAttribute('data-goto')||el.getAttribute('href');\n    if(destination&&destination!=='#'){ev.preventDefault();window.parent.postMessage({type:'advogadoja.flow.visual.navigate',destination:destination,action:action,instance:instanceId,element:elementId},'*');return;}\n    if(action&&action!=='drawer.open'&&action!=='drawer.close'){ev.preventDefault();window.parent.postMessage({type:'advogadoja.flow.visual.action',action:action,instance:instanceId,element:elementId},'*');return;}\n    if(el.hasAttribute('data-demo-action')){ev.preventDefault();showMessage('Ação demonstrativa: '+el.getAttribute('data-demo-action'));return;}\n    if(el.matches('button,a'))ev.preventDefault();\n  });\n  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeDrawer()});\n  window.addEventListener('message',e=>{if(e.source!==window.parent||e.data?.type!=='advogadoja.visualState')return;setVisualState(e.data.instance,e.data.axis,e.data.value)});\n  if(warnings.length){warning.textContent=Array.from(new Set(warnings)).join(' · ');warning.hidden=false;}\n  window.__advogadojaPreview={setVisualState,instances,stateByInstance};\n})();\n\nwindow.addEventListener('message',e=>{if(e.data?.type==='aj.v4.access'){const el=document.querySelector('.app');if(el)el.dataset.professionalAccess=e.data.value}});\n";
      const AJ_VISUAL_INVERSE = {'auth.inicializacao.splash':'app.splash','auth.inicializacao.boas_vindas':'app.boas_vindas','auth.sessao.entrar':'auth.entrar','cliente.home.inicio':'cliente.home','admin.home.dashboard':'admin.dashboard','advogado.atendimentos.lista':'advogado.atendimentos_advogado'};
      // Ponte entre identificadores canônicos V3 e identificadores reais de Jornadas.
      // Apenas referências comprovadas no documento.json original, sem recriação de telas.
      const JORNADAS_TELA_ALIAS = {
        'admin.administrador_detalhe':'admin.governanca.administrador_detalhe',
        'admin.administradores':'admin.governanca.administradores',
        'admin.assinatura_detalhe':'admin.assinatura.detalhe',
        'admin.assinaturas':'admin.assinatura.lista',
        'admin.configuracoes':'admin.configuracao.geral',
        'admin.dashboard':'admin.home.dashboard',
        'admin.denuncia_detalhe':'admin.moderacao.denuncia_detalhe',
        'admin.denuncias':'admin.moderacao.denuncias',
        'admin.log_detalhe':'admin.auditoria.log_detalhe',
        'admin.logs':'admin.auditoria.logs',
        'admin.oab':'admin.oab.fila',
        'admin.oab_detalhe':'admin.oab.detalhe',
        'admin.perfil_detalhe':'admin.usuarios.perfil_detalhe',
        'admin.perfis':'admin.usuarios.perfis',
        'admin.seletor_perfil':'admin.acesso.seletor_perfil',
        'advogado.atendimentos_advogado':'advogado.atendimentos.lista',
        'advogado.dados_oab':'advogado.oab.dados',
        'advogado.disponibilidade':'advogado.disponibilidade.painel',
        'advogado.perfil_profissional':'advogado.perfil.visualizacao',
        'advogado.validacao_profissional':'advogado.validacao.status',
        'cliente.home':'cliente.home.inicio',
        'cliente.home_cliente':'cliente.home.inicio',
        'cliente.perfil_cliente':'cliente.perfil.visualizacao',
        'estudante.home_estudante':'estudante.home.inicio'
      };
      function jornadasRef(key){
        const known=JORNADAS_SOURCE?.telas||{};
        if(known[key])return key;
        if(known[JORNADAS_TELA_ALIAS[key]])return JORNADAS_TELA_ALIAS[key];
        const canonical=doc?.catalogo?.telas?.[key]||V3_BASE?.catalogo?.telas?.[key];
        for(const alias of canonical?.identidade?.aliasesLegados||[])if(known[alias])return alias;
        if(V3_BASE?.apresentacao?.aliasMap){for(const [oldId,newId] of Object.entries(V3_BASE.apresentacao.aliasMap))if(newId===key&&known[oldId])return oldId;}
        return null;
      }
      function createJornadasFrame(key,state){
        const visualId=jornadasRef(key),t=visualId?JORNADAS_SOURCE.telas[visualId]:null;
        if(!t?.estrutura?.html?.composicao){
          return '<!doctype html><html lang="pt-BR"><meta charset="utf-8"><body style="font:14px system-ui;padding:24px;color:#344054"><h2>Contrato visual não encontrado em Jornadas</h2><p>O catálogo V3 possui a referência, mas Jornadas não possui uma tela correspondente com estrutura.html.composicao.</p><code>'+esc(key)+'</code></body></html>';
        }
        const refs={...(t.componentes?.instanciasRefs||{})};
        for(const [inst,spec] of Object.entries(t.estrutura.html.composicao))if(spec?.componenteRef)refs[inst]=spec.componenteRef;
        const definitions={};const originalDefinitions=JORNADAS_SOURCE.componentes||{};
        for(const ref of new Set(Object.values(refs)))if(originalDefinitions[ref])definitions[ref]=originalDefinitions[ref];
        const info={identidade:t.identidade,classificacao:t.classificacao,estrutura:t.estrutura,
          definicoes:definitions,instancias:refs,navegacao:{destinosDeclarados:t.navegacao?.destinosDeclarados||[]}};
        const data=JSON.stringify(info).replace(/</g,'\\u003c').replace(/>/g,'\\u003e').replace(/&/g,'\\u0026');
        const css='html,body{margin:0;min-height:100%;}*{box-sizing:border-box}#app-root{min-height:100dvh}#warnings{position:fixed;top:4px;right:4px;max-width:80%;background:#fff1c9;color:#79551f;padding:5px;font:10px Arial;z-index:99999}#navigation-tip{position:fixed;bottom:8px;left:50%;transform:translateX(-50%);background:#10233f;color:white;border-radius:6px;padding:8px;font:11px Arial;z-index:999999}';
        return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data: blob: https:; style-src 'unsafe-inline'; script-src 'unsafe-inline'; font-src data: https:"><style>${css}</style></head><body><div id="app-root"></div><div id="warnings" hidden></div><div id="navigation-tip" hidden></div><script type="application/json" id="view-data">${data}</script><script>${AJ_JORNADAS_RUNTIME.replace(/<\/script/gi,'<\\/script')}</script></body></html>`;
      }
      function staticPreview(key,state){return createJornadasFrame(key,state)}
      let ajPreviewCurrent=null,ajPreviewHistory=[],ajVisualDevice='mobile';
      function preview(key){
        selected=key;ajPreviewCurrent=key;ajPreviewHistory=[];
        previewState=doc.fluxo.variaveis.professionalAccess==='restricted'?'restricted':'enabled';
        openModal('Visualização · '+nameOf(key),
          '<div class="inline-actions" style="justify-content:space-between;margin:0 0 10px;gap:8px;flex-wrap:wrap"><div><button class="form-btn" id="mobileVisual">Mobile</button><button class="form-btn" id="desktopVisual">Desktop</button><button class="form-btn" id="stateEnabled">Habilitada</button><button class="form-btn" id="stateRestricted">Restrita</button><button class="form-btn" id="backVisual">Voltar</button></div><small class="muted" id="visualSource">Fluxo: telas e componentes completos do próprio documento.json</small></div><div id="ajDeviceContainer" style="display:flex;justify-content:center;background:#e9eef5;border:1px solid #d5e0eb;border-radius:12px;overflow:auto;padding:12px"><iframe id="previewIframe" title="Prévia da tela" class="preview-frame" sandbox="allow-scripts allow-forms" style="width:390px;max-width:100%;height:690px;flex:none;background:white;border:1px solid #dbe2eb;border-radius:10px"></iframe></div>',
          '<button data-action="modal-close">Fechar</button>',{wide:true});
        const render=()=>{
          const frame=by('previewIframe');if(!frame)return;
          frame.style.width=ajVisualDevice==='mobile'?'390px':'100%';frame.style.height=ajVisualDevice==='mobile'?'690px':'min(75vh,820px)';
          frame.srcdoc=createJornadasFrame(ajPreviewCurrent,previewState);
          by('modalTitle').textContent='Visualização · '+nameOf(ajPreviewCurrent);
          frame.onload=()=>{try{frame.contentWindow.postMessage({type:'aj.v4.access',value:previewState},'*')}catch(e){}};
          by('backVisual').disabled=!ajPreviewHistory.length;
        };
        by('backVisual').onclick=()=>{if(!ajPreviewHistory.length)return;ajPreviewCurrent=ajPreviewHistory.pop();render()};
        by('mobileVisual').onclick=()=>{ajVisualDevice='mobile';render()};
        by('desktopVisual').onclick=()=>{ajVisualDevice='desktop';render()};
        by('stateEnabled').onclick=()=>{previewState='enabled';render()};
        by('stateRestricted').onclick=()=>{previewState='restricted';render()};
        window.__ajPreviewNavigate=(target)=>{ajPreviewHistory.push(ajPreviewCurrent);ajPreviewCurrent=target;render()};render();
      }

// CONTRATO PROGRESSIVO: esta etapa recebe o documento de Jornadas integralmente.
// O motor do Fluxo NÃO consulta outro módulo: recebe seu próprio documento.json,
// conserva identidade/classificacao/estrutura/componentes e acrescenta navegacao em telas[id].
const AJ_NATIVE_STORE='advogadoja-fluxo-v4-progressivo-2026-11';
function nativeRelationKey(origin,dest,w){return JSON.stringify([origin,dest,w?JSON.stringify([w.variavel,w.operador,w.valor]):'']);}
function ajNativeUiCondition(w){if(!w||typeof w!=='object')return null;return {variavel:w.variavel||w.campo||'',operador:({'igual':'==','diferente':'!=','maior':'>','menor':'<','maior_igual':'>=','menor_igual':'<='}[w.operador]||w.operador||'=='),valor:w.valor};}
function ajNativeWriteCondition(w){if(!w)return null;return {campo:w.variavel,operador:({'==':'igual','!=':'diferente','>':'maior','<':'menor','>=':'maior_igual','<=':'menor_igual'}[w.operador]||w.operador||'igual'),valor:w.valor};}
function ajNativeEmptyNavigation(){return {entradas:[],saidas:[],bifurcacoes:[],condicoes:[],referencias:[]};}
function normalize(input){
 if(input?.catalogo?.telas&&input?.fluxo)return input; // estrutura interna do editor; nunca exportada
 if(input?.catalogo?.telas&&!input?.telas){
  // Compatibilidade: conversão de arquivos V3 antigos sem substituir os contratos visuais atuais.
  const copyNative=copy(JORNADAS_SOURCE), sources=Object.entries(input.catalogo.telas);
  const aliases={};for(const [key,t] of Object.entries(copyNative.telas)){
    aliases[key]=key;for(const a of t.navegacao?.origensV3||[])aliases[a]=key;
    for(const a of t.identidade?.aliasesLegados||[])aliases[a]=key;
  }
  for(const [legacyId,legacy] of sources){
   const target=aliases[legacyId];
   if(!target)continue;
   const nav=copyNative.telas[target].navegacao||ajNativeEmptyNavigation();
   for(const r of legacy.navegacao?.saidas||[])if(!nav.saidas.some(x=>x.id===r.id)){
    const entry=copy(r);
    for(const field of ['destinoRef','origemTelaRef','telaRef'])if(entry[field]&&aliases[entry[field]])entry[field]=aliases[entry[field]];
    nav.saidas.push(entry);
   }
   copyNative.telas[target].navegacao=nav;
  }
  input=copyNative;
 }
 if(!input?.telas||!input?.componentes)throw Error('Este motor utiliza documento.json com tipo, versao, telas e componentes.');
 const native=copy(input),used=Object.keys(native.telas),links=[],grouped=new Map(),allIds=[];
 let collapsed=0,internal=0,pendentes=0;
 for(const [key,screen] of Object.entries(native.telas)){
  for(const relation of screen.navegacao?.saidas||[]){
   if(relation.destinoTipo&&relation.destinoTipo!=='tela'){internal++;continue;}
   const dest=relation.destinoRef||relation.para;
   if(!dest||!native.telas[dest]){pendentes++;continue;}
   const cond=ajNativeUiCondition(relation.quando);
   const signature=nativeRelationKey(key,dest,cond);
   const rid=relation.id||'link.'+key+'.'+dest+'.'+allIds.length;
   allIds.push(rid);
   const existing=grouped.get(signature);
   if(existing){existing.referenciasOriginais.push(rid);collapsed++;continue;}
   const entry={id:rid,de:key,para:dest,saida:relation.eventoOrigem||relation.acaoRef||'concluiu',tipo:cond?'condicional':'sequencial',rotulo:relation.rotulo||'',quando:cond,navegacao:relation.navegacaoEditor||'empilhar',referenciasOriginais:[rid]};
   grouped.set(signature,entry);links.push(entry);
  }
 }
 // Escolha inicial pelos metadados internos do catálogo; não pelo nome da Splash.
 const indegree={};for(const k of used)indegree[k]=0;
 for(const e of links)indegree[e.para]=(indegree[e.para]||0)+1;
 const weight=k=>{
  const nav=native.telas[k].navegacao||{};
  const parts=nav.participacoes||[];
  const start=parts.some(p=>p.contexto?.modo==='inicio'&&p.ordem===1);
  const early=parts.some(p=>p.jornadaRef==='app'&&p.subjornadaRef==='app.inicializacao'&&p.ordem===1);
  return [nav.inicial===true?0:early?1:start?2:indegree[k]===0?3:4,parts.find(x=>x.jornadaRef==='app')?.ordem??9999,k];
 };
 const ordered=used.sort((a,b)=>{const A=weight(a),B=weight(b);for(let i=0;i<A.length;i++){if(A[i]<B[i])return -1;if(A[i]>B[i])return 1;}return 0;});
 const inicio=ordered[0]||null,queue=[],orderedUsed=[],visited=new Set();
 const byOrigin=new Map();for(const e of links){if(!byOrigin.has(e.de))byOrigin.set(e.de,[]);byOrigin.get(e.de).push(e.para);}
 function walk(k){queue.push(k);for(let i=0;i<queue.length;i++){const next=queue[i];if(!native.telas[next]||visited.has(next))continue;visited.add(next);orderedUsed.push(next);for(const x of byOrigin.get(next)||[])if(!visited.has(x))queue.push(x);}queue.length=0;}
 if(inicio)walk(inicio);for(const key of ordered)if(!visited.has(key))walk(key);
 const f={schemaVersion:4,inicio,telasUsadas:orderedUsed,conexoes:links,variaveis:{professionalAccess:'enabled',onboardingConcluido:true,primeiroAcesso:false,'sessao.perfil':'cliente'},configuracao:{politicaRetorno:'historico',bifurcacao:'automatica'}};
 const snapshots={};for(const e of links)snapshots[e.id]=JSON.stringify({de:e.de,para:e.para,saida:e.saida,tipo:e.tipo,rotulo:e.rotulo,quando:e.quando,navegacao:e.navegacao});
 return {tipo:native.tipo,versao:native.versao,catalogo:{telas:native.telas,componentes:native.componentes},fluxo:f,__initialEdgeState:snapshots,__editorLoadedIds:allIds,__editorProjection:{origem:'telas[id].navegacao.saidas',telas:orderedUsed.length,conexoes:links.length,agrupadas:collapsed,saidasInternas:internal,pendencias:pendentes},__editorDirty:false};
}
function portableDoc(src){
 const output={tipo:src.tipo||'colecao_telas',versao:src.versao??1,telas:copy(src.catalogo.telas),componentes:copy(src.catalogo.componentes)};
 const links=src.fluxo.conexoes,byId=new Set(links.flatMap(l=>l.referenciasOriginais?.length?l.referenciasOriginais:[l.id]));
 const had=new Set(src.__editorLoadedIds||[]);
 for(const screen of Object.values(output.telas)){
  if(!screen.navegacao)continue;
  screen.navegacao.saidas=(screen.navegacao.saidas||[]).filter(rel=>!had.has(rel.id)||byId.has(rel.id));
  screen.navegacao.entradas=(screen.navegacao.entradas||[]).filter(rel=>!had.has(rel.relacaoRef)||byId.has(rel.relacaoRef));
 }
 for(const e of links){const target=output.telas[e.de];if(!target||!output.telas[e.para])continue;
  const state=JSON.stringify({de:e.de,para:e.para,saida:e.saida,tipo:e.tipo,rotulo:e.rotulo,quando:e.quando,navegacao:e.navegacao});
  if(src.__initialEdgeState?.[e.id]===state)continue; // preservar dados V3 originais sem perda em refs agrupadas
  const nav=target.navegacao||(target.navegacao=ajNativeEmptyNavigation());
  nav.saidas=nav.saidas||[];
  const refs=e.referenciasOriginais?.length?e.referenciasOriginais:[e.id];
  for(const rid of refs){let rel=nav.saidas.find(x=>x.id===rid);
   const original=src.catalogo.telas[e.de]?.navegacao?.saidas?.find(x=>x.id===rid);
   const unchanged=original&&original.destinoRef===e.para&&JSON.stringify(ajNativeUiCondition(original.quando))===JSON.stringify(e.quando||null)&&
     (original.rotulo||'')===(e.rotulo||'')&&(original.eventoOrigem||original.acaoRef||'concluiu')===(e.saida||'concluiu');
   if(unchanged)continue;
   if(!rel){rel={id:rid,acaoRef:'editor.navegacao',origem:'editor_fluxo_v4'};nav.saidas.push(rel)}
   rel.destinoTipo='tela';rel.destinoRef=e.para;rel.origemTelaRef=e.de;rel.eventoOrigem=e.saida;rel.rotulo=e.rotulo;
   rel.quando=ajNativeWriteCondition(e.quando);rel.navegacaoEditor=e.navegacao;
  }
 }
 return output;
}
function initialFromReference(){return copy(JORNADAS_SOURCE)}
function freshFromCatalog(){return initialFromReference()}
function initialSplashOnly(){return initialFromReference()}
function initialize(){
 bind();setDoc(initialFromReference(),'Catálogo completo do Fluxo',false);
 by('saveStatus').textContent='Catálogo carregado';
 restoreLocalV4(stored=>{if(stored?.telas&&stored?.componentes){try{setDoc(stored,'trabalho local restaurado',false);by('saveStatus').textContent='Trabalho local restaurado';}catch(e){console.warn(e)}}});
}
function restoreLocalV4(callback){try{if(!window.indexedDB)return callback(null);
 const r=indexedDB.open(AJ_NATIVE_STORE,1);r.onupgradeneeded=()=>{if(!r.result.objectStoreNames.contains('documentos'))r.result.createObjectStore('documentos')};
 r.onerror=()=>callback(null);r.onsuccess=()=>{const db=r.result,tx=db.transaction('documentos','readonly'),req=tx.objectStore('documentos').get('principal');
  req.onsuccess=()=>{const data=req.result;db.close();callback(data||null)};req.onerror=()=>{db.close();callback(null)};
 };
 }catch(e){callback(null)}}
function persist(){dirty=false;by('saveStatus').textContent='Salvando…';
 try{if(!window.indexedDB)throw Error('IndexedDB indisponível');const r=indexedDB.open(AJ_NATIVE_STORE,1);
  r.onupgradeneeded=()=>{if(!r.result.objectStoreNames.contains('documentos'))r.result.createObjectStore('documentos')};
  r.onerror=()=>{by('saveStatus').textContent='Exporte para salvar'};
  r.onsuccess=()=>{try{const db=r.result,tx=db.transaction('documentos','readwrite');tx.objectStore('documentos').put(portableDoc(doc),'principal');
   tx.oncomplete=()=>{by('saveStatus').textContent='Salvo localmente';db.close()};tx.onerror=()=>{by('saveStatus').textContent='Exporte para salvar';db.close()};
  }catch(e){by('saveStatus').textContent='Exporte para salvar'}};
 }catch(e){by('saveStatus').textContent='Exporte para salvar';console.warn(e)}}
function renderDetail(){
 const panel=by('detail');if(!selected||!doc.catalogo.telas[selected]){if(!selected)panel.classList.remove('open');return;}
 panel.classList.add('open');by('detailTitle').textContent=nameOf(selected);
 const screen=doc.catalogo.telas[selected],nav=screen.navegacao||{},comp=screen.estrutura?.html?.composicao||{};
 const rows=[['ID de Jornadas/Fluxo',selected],['Nome',screen.identidade?.nomeExibicao],['Jornadas',(screen.classificacao?.jornadas||[]).map(j=>j.nome).join(', ')],['Componentes na tela',Object.keys(comp).length],['Entradas',incoming(selected).length],['Saídas visuais',outgoing(selected).length],['Relações originais',(nav.saidas||[]).length],['Saídas internas',(nav.saidas||[]).filter(x=>x.destinoTipo&&x.destinoTipo!=='tela').length]];
 by('detailBody').innerHTML=rows.map(([k,v])=>`<div class="kv"><span>${esc(k)}</span><span>${esc(v??'—')}</span></div>`).join('')+
 `<h3>Composição visual original</h3>`+(Object.keys(comp).length?'<ul>'+Object.entries(comp).map(([slot,x])=>'<li>'+esc(slot)+' → '+esc(x.componenteRef||'')+'</li>').join('')+'</ul>':'<p>Sem composição definida.</p>')+
 '<h3>Saídas</h3>'+(nav.saidas||[]).map(r=>'<div class="relation"><strong>'+esc(r.rotulo||r.acaoRef||r.id)+' → '+esc(r.destinoRef||'?')+'</strong><small>'+esc(r.destinoTipo||'tela')+' · '+esc(r.quando?JSON.stringify(r.quando):'Sem condição')+'</small></div>').join('')+
 `<div class="mini-row"><button data-action="preview" data-key="${esc(selected)}">Visual</button><button data-action="connect" data-key="${esc(selected)}">+ Nova conexão</button></div>`;
}
function createJornadasFrame(key,state){
 // Mesmo HTML/CSS/componentes do renderer de Jornadas, lendo SOMENTE doc do Fluxo.
 const t=doc?.catalogo?.telas?.[key];if(!t?.estrutura?.html?.composicao)return '<!doctype html><html lang="pt-BR"><meta charset="utf-8"><body>Não existe composição visual para '+esc(key)+'</body></html>';
 const refs={...(t.componentes?.instanciasRefs||{})};for(const [inst,spec] of Object.entries(t.estrutura.html.composicao))if(spec?.componenteRef)refs[inst]=spec.componenteRef;
 const definitions={};for(const ref of new Set(Object.values(refs)))if(doc.catalogo.componentes[ref])definitions[ref]=doc.catalogo.componentes[ref];
 // Os eventos visuais são interpretados pela navegação da própria tela, sem acesso a Jornadas.
 const info={identidade:t.identidade,classificacao:t.classificacao,estrutura:t.estrutura,definicoes:definitions,instancias:refs,navegacao:{destinosDeclarados:t.navegacao?.destinosDeclarados||[]}};
 const data=JSON.stringify(info).replace(/</g,'\\u003c').replace(/>/g,'\\u003e').replace(/&/g,'\\u0026');
 const css='html,body{margin:0;min-height:100%;}*{box-sizing:border-box}#app-root{min-height:100dvh}#warnings{position:fixed;top:4px;right:4px;max-width:80%;background:#fff1c9;color:#79551f;padding:5px;font:10px Arial;z-index:99999}#navigation-tip{position:fixed;bottom:8px;left:50%;transform:translateX(-50%);background:#10233f;color:white;border-radius:6px;padding:8px;font:11px Arial;z-index:999999}';
 return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data: blob: https:; style-src 'unsafe-inline'; script-src 'unsafe-inline'; font-src data: https:"><style>${css}</style></head><body><div id="app-root"></div><div id="warnings" hidden></div><div id="navigation-tip" hidden></div><script type="application/json" id="view-data">${data}</script><script>${AJ_JORNADAS_RUNTIME.replace(/<\/script/gi,'<\\/script')}</script></body></html>`;
}
function staticPreview(key,state){return createJornadasFrame(key,state)}
function exportDoc(){const out=portableDoc(doc);download('documento_fluxo.json',JSON.stringify(out,null,2));showNotice('Exportado em quatro chaves: tipo, versao, telas e componentes.');}
function updateCatalogOnly(input){
 const latest=normalize(input),old=portableDoc(doc),incomingT=latest.catalogo.telas,incomingC=latest.catalogo.componentes;
 const merged={tipo:latest.tipo||old.tipo,versao:latest.versao??old.versao,telas:{...old.telas,...incomingT},componentes:{...old.componentes,...incomingC}};
 for(const [k,t] of Object.entries(old.telas))if(merged.telas[k]&&t.navegacao)merged.telas[k].navegacao=copy(t.navegacao);
 setDoc(merged,'base atualizada');showNotice('Telas e componentes atualizados; conexões existentes preservadas por ID.');
}
function restoreBackup(){if(!confirm('Restaurar o documento.json original do módulo Fluxo? Alterações não exportadas serão substituídas.'))return;setDoc(initialFromReference(),'Base original restaurada');showNotice('Catálogo e conexões originais restaurados do JSON do próprio módulo.');}
function ajNavigateFromFrame(event){
 const frame=by('previewIframe');if(!frame||event.source!==frame.contentWindow)return;
 const action=String(event.data?.action||'');const origin=ajPreviewCurrent;
 if(event.data.type==='advogadoja.flow.visual.navigate'){
  const target=event.data.destination;
  if(doc.catalogo.telas[target]){window.__ajPreviewNavigate?.(target);return;}
 }
 if(event.data.type==='advogadoja.flow.visual.action'||event.data.type==='advogadoja.flow.visual.navigate'){
  const matches=outgoing(origin).filter(c=>{
   if(!action)return false;
   const raw=doc.catalogo.telas[origin]?.navegacao?.saidas?.find(x=>x.id===c.id);
   return c.saida===action||raw?.acaoRef===action||raw?.eventoOrigem===action;
  });
  const yes=matches.filter(c=>conditionMatch(c)===true);
  if(yes.length===1){window.__ajPreviewNavigate?.(yes[0].para);return;}
  if(yes.length>1){showNotice('Mais de um destino válido para '+action+'. Defina a condição ou escolha no fluxo.');return;}
  showNotice('Ação '+action+' sem destino único conectado nesta tela.');
 }
}
window.addEventListener('message',event=>{if(['advogadoja.flow.visual.action','advogadoja.flow.visual.navigate'].includes(event.data?.type))ajNavigateFromFrame(event)});

function loadOwnDocument(){
 const embedded=document.getElementById('fluxo-initial-data');
 if(embedded){try{loadNative(JSON.parse(embedded.textContent));}catch(err){showBootError(err)};return;}
 fetch('./data/documento.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('documento.json HTTP '+r.status);return r.json()}).then(loadNative).catch(showBootError);
}
function loadNative(native){
 if(!native?.telas||!native?.componentes)throw Error('O documento do Fluxo precisa de telas e componentes.');
 JORNADAS_SOURCE=copy(native);LEGACY_REFERENCE={catalog:{entries:[]}};
 DEFAULT_CATALOG={catalogo:{telas:native.telas,componentes:native.componentes}};
 V3_BASE={catalogo:{telas:native.telas,componentes:native.componentes},apresentacao:{aliasMap:{}}};V3_ALIASES={};
 initialize();
}
function showBootError(err){console.error(err);const status=document.getElementById('saveStatus');if(status)status.textContent='Erro ao carregar: '+err.message;}
loadOwnDocument();
