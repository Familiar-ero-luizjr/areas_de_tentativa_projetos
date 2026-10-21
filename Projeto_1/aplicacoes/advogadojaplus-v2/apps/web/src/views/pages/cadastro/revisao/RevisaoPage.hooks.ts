import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {useJourney} from '@/context/JourneyContext';
import {useSession} from '@/context/SessionContext';
import {useFeedback} from '@/context/FeedbackContext';
/** Envia a revisão de cadastro para a API; mantém a camada visual sem regra de negócio. */
export function useRevisaoPage(){
 const router=useRouter();const{values}=useJourney();const{register}=useSession();const{notify}=useFeedback();const[busy,setBusy]=useState(false);
 const submit=async()=>{
  if(values.tipoConta==='advogado'){router.push('/em-construcao');return;}
  if(values.aceite!=='sim'){notify('É necessário aceitar os termos.');return;}
  if(!values.senha||values.senha!==values.confirmarSenha){notify('Verifique a senha e sua confirmação.');return;}
  if(values.senha.length<10){notify('A senha deve ter ao menos 10 caracteres.');return;}
  const name=[values.nome,values.sobrenome].filter(Boolean).join(' ').trim();
  if(!name||!values.email){notify('Nome e e-mail são obrigatórios.');return;}
  setBusy(true);
  try{
   await register({role:'cliente',name,email:values.email,password:values.senha,phone:values.telefone,username:values.usuario,cpf:values.cpf,birthDate:values.nascimento,gender:values.genero,
     address:{street:values.logradouro||'',number:values.numero||'',district:values.bairro||'',city:values.cidade||'',state:values.uf||'',postalCode:values.cep||''},
     consents:[{document:'termos-uso',version:'prototipo-v7'},{document:'politica-privacidade',version:'prototipo-v7'}]});
   router.push('/cadastro/concluido');
  }catch(err){notify((err as Error).message);}finally{setBusy(false);}
 };
 return {router,values,busy,submit};
}
