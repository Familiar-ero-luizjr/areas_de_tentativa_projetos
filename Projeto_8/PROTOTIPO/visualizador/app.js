import {carregarManifest,montarLaboratorio,criarDocumento} from '../conector/montador.js';
const $=id=>document.getElementById(id);
let manifest=null,atual=null,geracao=0,timeout=null;
const showError=message=>{$('loading').hidden=false;$('loading').classList.add('error');$('loading').textContent=message};
window.addEventListener('message',event=>{
 if(event.origin!==location.origin||event.source!==$('frame').contentWindow)return;
 const data=event.data;
 if(!data||data.type!=='advogadoja-lab-status'||data.token!==geracao)return;
 clearTimeout(timeout);timeout=null;
 if(data.ok)$('loading').hidden=true;
 else showError('Falha ao executar o motor: '+(data.error||'erro desconhecido'));
});
async function abrir(chave,force=false){
 const tick=++geracao;atual=chave;clearTimeout(timeout);
 document.querySelectorAll('[data-lab]').forEach(b=>b.classList.toggle('active',b.dataset.lab===chave));
 $('sidebar').classList.remove('open');
 $('loading').hidden=false;$('loading').classList.remove('error');
 $('loading').textContent='Carregando telas e componentes do laboratório…';
 $('frame').removeAttribute('srcdoc');
 try{
  const dados=await montarLaboratorio(chave,manifest,force);
  if(tick!==geracao)return;
  $('title').textContent=dados.config.titulo;
  $('summary').textContent=`${dados.config.totalTelas} telas · ${dados.config.totalComponentes} componentes · modelo por JSON`;
  $('loading').textContent='Inicializando motor interativo…';
  timeout=setTimeout(()=>{if(tick===geracao)showError('O laboratório não confirmou a inicialização. Confira o console e a rede do navegador.')},20000);
  $('frame').srcdoc=criarDocumento(dados,tick);
  history.replaceState(null,'','#'+chave);
 }catch(e){if(tick!==geracao)return;clearTimeout(timeout);showError('Erro: '+e.message+(location.protocol==='file:'?' — execute em servidor HTTP local.':''));console.error(e)}
}
$('mobile').onclick=()=>$('sidebar').classList.toggle('open');
$('reload').onclick=()=>{if(atual)abrir(atual,true)};
document.querySelectorAll('[data-lab]').forEach(b=>b.onclick=()=>abrir(b.dataset.lab));
try{manifest=await carregarManifest();await abrir(manifest.laboratorios[location.hash.slice(1)]?location.hash.slice(1):'cliente_v3')}
catch(e){showError('Não foi possível carregar dados/manifest.json. '+e.message)}
