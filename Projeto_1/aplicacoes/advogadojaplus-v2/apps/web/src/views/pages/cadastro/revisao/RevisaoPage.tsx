'use client';
import {AppShell} from '@/components/layout/AppShell';
import {PageSection} from './RevisaoPage.styles';
import {useRevisaoPage} from './RevisaoPage.hooks';
export default function RevisaoPage(){
 const {router,values,busy,submit}=useRevisaoPage();
 return <AppShell title="Revise seus dados"><PageSection><p className="lead">Confira os dados antes de criar a conta.</p><div className="reviewPanel">{[['Conta','tipoConta'],['Nome','nome'],['Usuário','usuario'],['CPF','cpf'],['E-mail','email'],['Telefone','telefone'],['Endereço','logradouro'],['Cidade','cidade']].map(([label,key])=><div className="reviewLine" key={key}><span>{label}</span><strong>{values[key]||'—'}</strong></div>)}</div><div className="actions"><button className="secondaryBtn" onClick={()=>router.push('/cadastro/identificacao')}>Editar dados</button><button className="primaryBtn" disabled={busy} onClick={()=>void submit()}>{busy?'Criando conta…':'Criar conta →'}</button></div></PageSection></AppShell>;
}
