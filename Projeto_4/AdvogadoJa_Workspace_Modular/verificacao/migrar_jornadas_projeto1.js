#!/usr/bin/env node
'use strict';

/*
 * Migra as jornadas visuais do Projeto_1 para o catálogo modular.
 *
 * Uso:
 *   node verificacao/migrar_jornadas_projeto1.js --inspect
 *   node verificacao/migrar_jornadas_projeto1.js --apply
 *
 * O script não altera o Projeto_1. No --apply ele atualiza somente as telas
 * já existentes (exceto advogado.home_advogado) e cria componentes canônicos
 * de árvore de elementos. O motor continua usando exclusivamente
 * estrutura.arvore + componentes.instancias, como a Home Profissional.
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const crypto = require('crypto');

const workspace = path.resolve(__dirname, '..');
const sourceRoot = 'C:/DEV/area_advogado/areas_de_tentativa_projetos/Projeto_1/jornadas';
const apply = process.argv.includes('--apply');
const journeyFiles = [
  ['administrador', 'administrador.html'],
  ['advogado', 'advogado_joao.html'],
  ['cliente', 'cliente_maria.html'],
  ['estudante', 'estudante_ana.html'],
];
const skipScreenId = 'advogado.home_advogado';
/* IDs de tela estáveis do catálogo que foram nomeados de forma mais curta no Projeto_1. */
const sourceScreenAliases = {
  'admin.assinaturas.assinaturas': 'admin.assinaturas',
  'admin.dashboard.dashboard': 'admin.dashboard',
  'admin.denuncias.denuncias': 'admin.denuncias',
  'admin.logs.logs_operacionais': 'admin.logs',
  'admin.oab.validacao_oab': 'admin.oab',
  'admin.perfis.moderacao_perfis': 'admin.perfis',
};

function readJson(file) { return JSON.parse(fs.readFileSync(file, 'utf8')); }
function writeJson(file, value) { fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', 'utf8'); }
function allFiles(root) {
  const result = [];
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    const item = path.join(root, entry.name);
    if (entry.isDirectory()) result.push(...allFiles(item));
    else if (entry.name.endsWith('.json')) result.push(item);
  }
  return result;
}
function writeStaticManifest() {
  const catalogRoot = path.join(workspace, 'catalogo');
  const files = allFiles(catalogRoot).map(file => path.relative(workspace, file).split(path.sep).join('/')).sort();
  const content = '/*\n * Índice de caminhos para uso em servidor estático. Não contém cópias dos\n * registros: cada entrada continua sendo lida do JSON canônico em catalogo/.\n * Gerado por verificacao/migrar_jornadas_projeto1.js.\n */\n' +
    'globalThis.ADVOGADOJA_CATALOGO_ARQUIVOS = Object.freeze([\n' +
    files.map(file => "  '" + file + "',").join('\n') + '\n]);\n';
  fs.writeFileSync(path.join(workspace, 'app', 'catalogo-arquivos.js'), content, 'utf8');
  return files.length;
}
function slug(value) {
  return String(value).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '').slice(0, 70) || 'acao';
}
function hash(value) { return crypto.createHash('sha256').update(value).digest('hex').slice(0, 12); }

/* Finds an object literal assigned to a top-level JavaScript constant. */
function extractObject(source, name) {
  const marker = new RegExp('\\bconst\\s+' + name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*=');
  const found = marker.exec(source);
  if (!found) return null;
  const start = source.indexOf('{', found.index + found[0].length);
  if (start < 0) return null;
  let quote = null, escaped = false, depth = 0, lineComment = false, blockComment = false;
  for (let i = start; i < source.length; i += 1) {
    const char = source[i], next = source[i + 1];
    if (lineComment) { if (char === '\n') lineComment = false; continue; }
    if (blockComment) { if (char === '*' && next === '/') { blockComment = false; i += 1; } continue; }
    if (quote) {
      if (escaped) { escaped = false; continue; }
      if (char === '\\') { escaped = true; continue; }
      if (char === quote) quote = null;
      continue;
    }
    if (char === '/' && next === '/') { lineComment = true; i += 1; continue; }
    if (char === '/' && next === '*') { blockComment = true; i += 1; continue; }
    if (char === '"' || char === '\'' || char === '`') { quote = char; continue; }
    if (char === '{') depth += 1;
    if (char === '}') {
      depth -= 1;
      if (depth === 0) {
        const literal = source.slice(start, i + 1);
        try { return JSON.parse(literal); }
        catch (_) { return vm.runInNewContext('(' + literal + ')', Object.create(null), { timeout: 1000 }); }
      }
    }
  }
  throw new Error('Objeto não terminado: ' + name);
}
function extractString(source, name) {
  const marker = new RegExp('\\bconst\\s+' + name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*=\\s*');
  const found = marker.exec(source);
  if (!found) return null;
  const quote = source[found.index + found[0].length];
  if (quote !== '"' && quote !== '\'' && quote !== '`') return null;
  let escaped = false;
  for (let i = found.index + found[0].length + 1; i < source.length; i += 1) {
    const char = source[i];
    if (escaped) { escaped = false; continue; }
    if (char === '\\') { escaped = true; continue; }
    if (char === quote) {
      const literal = source.slice(found.index + found[0].length, i + 1);
      return quote === '"' ? JSON.parse(literal) : vm.runInNewContext(literal, Object.create(null), { timeout: 1000 });
    }
  }
  throw new Error('String não terminada: ' + name);
}
function extractConstantNames(source) {
  return [...source.matchAll(/\bconst\s+([A-Z][A-Z0-9_]*)\s*=/g)].map(match => match[1]);
}
function decodeText(text) {
  return String(text).replace(/&(#x[0-9a-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);/gi, (_, code) => {
    const lower = code.toLowerCase();
    if (lower === 'amp') return '&'; if (lower === 'lt') return '<'; if (lower === 'gt') return '>';
    if (lower === 'quot') return '"'; if (lower === 'apos') return '\''; if (lower === 'nbsp') return ' ';
    const number = lower.startsWith('#x') ? parseInt(lower.slice(2), 16) : parseInt(lower.slice(1), 10);
    return Number.isFinite(number) ? String.fromCodePoint(number) : _;
  });
}
const allowedTags = new Set('a article aside b blockquote br button caption code dd details div dl dt em fieldset figcaption figure footer form h1 h2 h3 h4 h5 h6 header hr i img input label legend li main nav ol option p path picture pre section select small source span strong summary svg table tbody td textarea tfoot th thead time tr u ul video'.split(' '));
const voidTags = new Set('area base br col embed hr img input link meta param source track wbr'.split(' '));
function parseAttributes(fragment) {
  const attrs = {};
  const regex = /([^\s=/>]+)(?:\s*=\s*("[^"]*"|'[^']*'|[^\s"'=<>`]+))?/g;
  let match;
  while ((match = regex.exec(fragment))) {
    const name = match[1].toLowerCase();
    if (!name || name === '/' || name.startsWith('on') || name === 'style') continue;
    let value = match[2] == null ? '' : match[2];
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith('\'') && value.endsWith('\''))) value = value.slice(1, -1);
    attrs[name] = decodeText(value);
  }
  return attrs;
}
/* Converts imported markup to the same element-tree contract used by components. */
function htmlToTree(html, componentId) {
  const roots = [], stack = [{ children: roots }];
  const tokens = String(html || '').match(/<!--[\s\S]*?-->|<[^>]*>|[^<]+/g) || [];
  let sequence = 0, ignored = 0;
  for (const token of tokens) {
    if (token.startsWith('<!--') || /^<!doctype/i.test(token)) continue;
    if (token.startsWith('</')) {
      const tag = token.slice(2, -1).trim().toLowerCase();
      for (let index = stack.length - 1; index > 0; index -= 1) {
        if (stack[index].tag === tag) { stack.length = index; break; }
      }
      continue;
    }
    if (token.startsWith('<')) {
      const match = /^<\s*([a-zA-Z][\w:-]*)\b([\s\S]*?)(\/?)>$/.exec(token);
      if (!match) continue;
      const tag = match[1].toLowerCase();
      if (!allowedTags.has(tag) || ['script', 'style', 'iframe', 'object', 'embed', 'base', 'meta', 'link'].includes(tag)) { ignored += 1; continue; }
      const node = { id: componentId + '::' + (sequence += 1), tag, atributos: parseAttributes(match[2]), filhos: [] };
      stack[stack.length - 1].children.push(node);
      if (!voidTags.has(tag) && match[3] !== '/') stack.push({ tag, children: node.filhos });
      continue;
    }
    const text = decodeText(token).replace(/\s+/g, ' ');
    if (text.trim()) stack[stack.length - 1].children.push(text);
  }
  return { tree: roots, ignored };
}
function findNextScreen(flow, nodeId, seen = new Set()) {
  if (!nodeId || seen.has(nodeId)) return { screen: null, state: null };
  seen.add(nodeId);
  const node = flow[nodeId];
  if (!node) return { screen: null, state: nodeId };
  if (node.screen) return { screen: node.screen, state: node.state ? nodeId : null };
  if (node.next) return findNextScreen(flow, node.next, seen);
  return { screen: null, state: nodeId };
}
function extractJourney(sourceId, fileName) {
  const absolute = path.join(sourceRoot, fileName);
  const source = fs.readFileSync(absolute, 'utf8');
  const names = extractConstantNames(source);
  const rawScreens = Object.assign(
    {},
    extractObject(source, 'SCREENS') || {},
    extractObject(source, 'EXTRA_SCREENS') || {},
    extractObject(source, 'ADMIN_SCREENS') || {},
    extractObject(source, 'STUDENT_SCREENS') || {},
  );
  const screens = Object.fromEntries(Object.entries(rawScreens).map(([id, definition]) => [id, typeof definition === 'string' ? { name: id, html: definition, css: '' } : definition]));
  const flow = extractObject(source, 'FLOW_NODES') || {};
  const globalCss = extractString(source, 'GLOBAL_RUNTIME_CSS');
  return { sourceId, fileName, names, screens, flow, globalCss: typeof globalCss === 'string' ? globalCss : '' };
}
function screenActions(sourceId, flow, sourceScreenId, catalogScreenId, sourceToCatalogId) {
  const result = [];
  for (const [nodeId, node] of Object.entries(flow)) {
    if (node.screen !== sourceScreenId) continue;
    const candidates = [];
    if (node.next) candidates.push({ id: 'continuar', label: node.nextLabel || 'Prosseguir', next: node.next });
    for (const route of Array.isArray(node.routes) ? node.routes : []) candidates.push({ id: route.id || route.label || 'rota', label: route.label || 'Escolher opção', next: route.next, detail: route.detail });
    for (const item of candidates) {
      const resolved = findNextScreen(flow, item.next);
      const action = {
        id: 'j1-' + slug(sourceId) + '-' + slug(nodeId) + '-' + slug(item.id),
        tipo: 'navegacao_jornada',
        evento: Array.isArray(node.routes) && node.routes.length ? 'selecionar_rota' : 'prosseguir',
        rotulo: item.label,
        aplicaA: sourceJourneyRule(sourceId),
        origemJornada: { arquivo: sourceId, no: nodeId, destinoNo: item.next, observacao: item.detail || node.note || '' },
      };
      const destination = resolved.screen && (sourceToCatalogId.get(resolved.screen) || resolved.screen);
      if (destination && destination !== catalogScreenId) action.destino = destination;
      else action.efeito = { tipo: 'estado_jornada', estado: item.next, observacao: item.detail || node.note || 'Estado ou término da jornada.' };
      result.push(action);
    }
  }
  return result;
}
function sourceJourneyRule(sourceId) {
  return { jornadas: [sourceId], estados: ['*'] };
}

function main() {
  const sourceJourneys = journeyFiles.map(([id, file]) => extractJourney(id, file));
  const inspectScreen = process.argv.find(argument => argument.startsWith('--screen='));
  if (inspectScreen) {
    const screenId = inspectScreen.slice('--screen='.length);
    console.log(JSON.stringify(sourceJourneys.map(journey => ({ jornada: journey.sourceId, definicao: journey.screens[screenId] || null })), null, 2));
    return;
  }
  const screens = allFiles(path.join(workspace, 'catalogo', 'telas')).map(file => ({ file, value: readJson(file) }));
  const knownIds = new Set(screens.map(record => record.value.identidade.id));
  const sourceToCatalogId = new Map();
  for (const id of knownIds) sourceToCatalogId.set(sourceScreenAliases[id] || id, id);
  const byScreen = new Map();
  for (const journey of sourceJourneys) {
    for (const [id, definition] of Object.entries(journey.screens)) {
      if (!definition || typeof definition !== 'object' || !definition.html) continue;
      const entries = byScreen.get(id) || [];
      entries.push({ journey, definition });
      byScreen.set(id, entries);
    }
  }
  const sourceKeyFor = id => sourceScreenAliases[id] || id;
  const candidates = screens.filter(record => record.value.identidade.id !== skipScreenId && byScreen.has(sourceKeyFor(record.value.identidade.id)));
  const absent = [...byScreen.keys()].filter(id => !sourceToCatalogId.has(id)).sort();
  const unmapped = screens.filter(record => record.value.identidade.id !== skipScreenId && !byScreen.has(sourceKeyFor(record.value.identidade.id))).map(record => record.value.identidade.id).sort();
  const report = {
    geradoEm: new Date().toISOString(),
    fonte: 'Projeto_1/jornadas',
    modo: apply ? 'apply' : 'inspect',
    jornadas: sourceJourneys.map(journey => ({ arquivo: journey.fileName, constantes: journey.names, telas: Object.keys(journey.screens).length, nosFluxo: Object.keys(journey.flow).length, cssGlobal: journey.globalCss.length })),
    catalogo: { telasExistentes: screens.length, preservada: skipScreenId, telasMigraveis: candidates.length, semFonteNasJornadas: unmapped, fonteSemTelaNoCatalogo: absent },
    avisos: [],
  };
  if (!apply) {
    console.log(JSON.stringify(report, null, 2));
    return;
  }
  if (!candidates.length) throw new Error('Nenhuma tela do catálogo foi encontrada nas jornadas. Migração interrompida.');

  const componentRoot = path.join(workspace, 'catalogo', 'componentes', 'importados', 'projeto1');
  const writtenComponents = [];
  const componentOrigins = {};
  function writeImportedComponent(file, component) {
    if(component.proveniencia){componentOrigins[component.identidade.id]=component.proveniencia;delete component.proveniencia;}
    writeJson(file,component);
  }
  const cssByJourney = new Map();
  for (const journey of sourceJourneys) {
    if (!journey.globalCss) { report.avisos.push('CSS global ausente em ' + journey.fileName); continue; }
    const componentId = 'style.jornadas.projeto1.' + journey.sourceId + '.v01';
    const component = {
      schema: 'advogadoja.componente.reutilizavel.v2-proposta',
      identidade: { id: componentId, nome: 'Estilos base da jornada ' + journey.sourceId, tipo: 'componente', versao: '1.0.0' },
      estrutura: { formato: 'arvore_elementos', arvore: [], id: 'html_' + componentId },
      estilos: { css: journey.globalCss, id: 'css_' + componentId },
      interface: { propriedadesAceitas: [], eventosEmitidos: [], regraBinding: 'Componente de estilos base; o motor aplica seu CSS ao montar a instância da tela.' },
      classificacao: { escopo: 'global', jornadas: [journey.sourceId], localizacaoArvore: { secao: 'Componentes', segmentos: ['importados', 'projeto1', 'estilos'], chave: slug(journey.sourceId) } },
      proveniencia: { tipo: 'importacao_jornada', arquivo: 'Projeto_1/jornadas/' + journey.fileName, constante: 'GLOBAL_RUNTIME_CSS' },
    };
    const target = path.join(componentRoot, 'estilos', journey.sourceId + '.json');
    fs.mkdirSync(path.dirname(target), { recursive: true }); writeImportedComponent(target, component);
    writtenComponents.push(componentId); cssByJourney.set(journey.sourceId, componentId);
  }

  for (const record of candidates) {
    const screen = record.value, id = screen.identidade.id, sourceKey = sourceKeyFor(id), variants = byScreen.get(sourceKey);
    const instances = [], components = [], groups = [];
    const journeysForScreen = new Set();
    for (const variant of variants) {
      const { journey, definition } = variant;
      const componentId = 'cmp.' + id.replace(/[^a-zA-Z0-9.]+/g, '_') + '.j1_' + journey.sourceId + '.v01';
      const parsed = htmlToTree(definition.html, componentId);
      if (!parsed.tree.length) { report.avisos.push('Sem árvore HTML: ' + id + ' (' + journey.sourceId + ')'); continue; }
      const component = {
        schema: 'advogadoja.componente.reutilizavel.v2-proposta',
        identidade: { id: componentId, nome: (definition.name || definition.title || screen.identidade.nome || id) + ' · jornada ' + journey.sourceId, tipo: 'componente', versao: '1.0.0' },
        estrutura: { formato: 'arvore_elementos', arvore: parsed.tree, id: 'html_' + componentId },
        estilos: { css: definition.css || '', id: 'css_' + componentId },
        interface: { propriedadesAceitas: [], eventosEmitidos: ['interacao_simulada'], regraBinding: 'Interações são interpretadas pelo motor de prévia a partir de atributos data-*; o componente não consulta arquivos externos.' },
        classificacao: { escopo: journey.sourceId, jornadas: [journey.sourceId], localizacaoArvore: { secao: 'Componentes', segmentos: ['importados', 'projeto1', ...id.split('.')], chave: 'j1_' + journey.sourceId } },
        proveniencia: { tipo: 'importacao_jornada', arquivo: 'Projeto_1/jornadas/' + journey.fileName, constante: 'SCREENS/EXTRA_SCREENS', chaveFonte: id, checksumHtml: hash(definition.html), elementosIgnorados: parsed.ignored },
      };
      const target = path.join(componentRoot, ...id.split('.'), 'j1_' + journey.sourceId + '.json');
      fs.mkdirSync(path.dirname(target), { recursive: true }); writeImportedComponent(target, component);
      writtenComponents.push(componentId); components.push(componentId); journeysForScreen.add(journey.sourceId);
      const rule = sourceJourneyRule(journey.sourceId);
      const styleId = cssByJourney.get(journey.sourceId);
      if (styleId) instances.push({ id: 'estilos_base_' + journey.sourceId, ref: styleId, slot: 'styles', ordem: 0, props: {}, aplicaA: rule });
      instances.push({ id: 'conteudo_' + journey.sourceId, ref: componentId, slot: 'main', ordem: 10, props: {}, aplicaA: rule });
      groups.push({ id: 'estilos_' + journey.sourceId, slot: 'styles', ordem: 0, instancias: styleId ? ['estilos_base_' + journey.sourceId] : [], aplicaA: rule });
      groups.push({ id: 'conteudo_' + journey.sourceId, slot: 'main', ordem: 10, instancias: ['conteudo_' + journey.sourceId], aplicaA: rule });
    }
    const allActions = variants.flatMap(variant => screenActions(variant.journey.sourceId, variant.journey.flow, sourceKey, id, sourceToCatalogId));
    const actionByKey = new Map();
    for (const action of allActions) actionByKey.set(action.id, action);
    screen.componentes = {
      instancias: instances,
      contratoInstanciacao: {
        resolver: 'ref por ID no catalogo',
        props: 'props literais ou referências resolvidas pelo motor; componentes não carregam arquivos diretamente',
        filtragem: 'aplicaA de grupo e instância por jornada e estado',
        semCopiaHTMLCSSNaTela: true,
        montagem: 'CSS da tela + CSS dos componentes selecionados; HTML base + árvores dos componentes selecionados',
      },
    };
    screen.estrutura = {
      base: {
        id: 'html_base_' + id.replace(/[^a-zA-Z0-9]+/g, '_'),
        html: '<div class="prototype-screen" data-screen-id="' + id + '"><div data-slot="styles"></div><main data-slot="main"></main></div>',
        raiz: 'prototype-screen',
        layout: { larguraConteudo: '100%', slots: ['styles', 'main'], resolucao: 'cada grupo de estrutura insere instâncias no slot data-slot correspondente' },
        aplicaA: { jornadas: [...journeysForScreen], estados: ['*'] },
      },
      grupos: groups,
    };
    const existingGroups = Array.isArray(screen.acoes?.grupos) ? screen.acoes.grupos.filter(group => group.id !== 'navegacao_jornadas_projeto1') : [];
    existingGroups.push({ id: 'navegacao_jornadas_projeto1', origem: 'Projeto_1/jornadas', aplicaA: { jornadas: [...journeysForScreen], estados: ['*'] }, acoes: [...actionByKey.values()] });
    screen.acoes = { grupos: existingGroups };
    report.historicoPorTela ??= {};
    report.historicoPorTela[id] = {
      versao: '1.0.0',
      fonte: variants.map(variant => ({ arquivo: 'Projeto_1/jornadas/' + variant.journey.fileName, chaveTela: sourceKey, checksumHtml: hash(variant.definition.html) })),
      contrato: 'componentes reutilizáveis em árvore + instâncias da tela; sem caminho especial no motor',
      preservado: { homeProfissional: false, flowEditor: 'inalterado — é apenas a organização editorial; as ações acima representam a navegação operacional da jornada.' },
    };
    writeJson(record.file, screen);
  }
  const componentHistoryFile = path.join(workspace, 'verificacao', 'historico_componentes_importados.json');
  const componentHistory=fs.existsSync(componentHistoryFile)?readJson(componentHistoryFile):{descricao:'Proveniência técnica externa aos contratos',porComponente:{}};
  componentHistory.porComponente={...(componentHistory.porComponente||{}),...componentOrigins};
  writeJson(componentHistoryFile,componentHistory);
  const historyFile = path.join(workspace, 'verificacao', 'historico_migracao_projeto1.json');
  const history = fs.existsSync(historyFile) ? readJson(historyFile) : {descricao:'Proveniência técnica, externa aos registros de tela',porTela:{}};
  history.porTela = {...(history.porTela||{}),...(report.historicoPorTela||{})};
  writeJson(historyFile,history); delete report.historicoPorTela;
  report.resultado = { telasAtualizadas: candidates.length, componentesCriados: writtenComponents.length, arquivosNoManifestoEstatico: writeStaticManifest(), componentes: writtenComponents };
  const reportFile = path.join(workspace, 'verificacao', 'relatorio_migracao_jornadas_projeto1.json');
  writeJson(reportFile, report);
  console.log(JSON.stringify(report, null, 2));
}

main();
