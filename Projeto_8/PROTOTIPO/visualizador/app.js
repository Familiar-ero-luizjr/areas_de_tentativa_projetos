import {carregarManifest,montarLaboratorio,criarDocumento} from '../conector/montador.js';
const $=id=>document.getElementById(id);
let manifest=null,atual=null,geracao=0;
async function abrir(chave,force=false){
 const tick=++geracao;atual=chave;
 document.querySelectorAll('[data-lab]').forEach(b=>b.classList.toggle('active',b.dataset.lab===chave));
 $('sidebar').classList.remove('open');$('loading').hidden=false;$('loading').classList.remove('error');$('loading').textContent='Carregando telas e componentes do laboratório…';
 $('frame').removeAttribute('srcdoc');
 try{
  const dados=await montarLaboratorio(chave,manifest,force);if(tick!==geracao)return;
  const motor=await fetch(new URL('../'+dados.config.motor,import.meta.url),{cache:'default'});
  if(!motor.ok||Number(motor.headers.get('content-length'))===0||(await motor.text()).trim().length===0)throw Error('Motor JavaScript ausente: '+dados.config.motor+'. É necessário restaurar o motor original.');
  if(tick!==geracao)return;
  $('title').textContent=dados.config.titulo;
  $('summary').textContent=`${dados.config.totalTelas} telas · ${dados.config.totalComponentes} componentes · modelo por JSON`;
  $('frame').srcdoc=criarDocumento(dados);
  $('frame').onload=()=>{if(tick===geracao)$('loading').hidden=true};
  history.replaceState(null,'','#'+chave);
 }catch(e){if(tick!==geracao)return;$('loading').hidden=false;$('loading').classList.add('error');$('loading').textContent='Erro: '+e.message+' — execute em servidor HTTP local, não em file://.';console.error(e)}
}
$('mobile').onclick=()=>$('sidebar').classList.toggle('open');
$('reload').onclick=()=>{if(atual)abrir(atual,true)};
document.querySelectorAll('[data-lab]').forEach(b=>b.onclick=()=>abrir(b.dataset.lab));
try{manifest=await carregarManifest();await abrir(manifest.laboratorios[location.hash.slice(1)]?location.hash.slice(1):'cliente_v3')}
catch(e){$('loading').textContent='Não foi possível carregar dados/manifest.json. '+e.message}
