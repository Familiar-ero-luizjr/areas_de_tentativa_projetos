import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/context/SessionContext';
import { useFeedback } from '@/context/FeedbackContext';
/** Comportamento próprio do login: envio à API, feedback e navegação. */
export function useLoginPage() {
  const router = useRouter();
  const { login } = useSession();
  const { notify } = useFeedback();
  const [email, setEmail] = useState('maria@exemplo.com');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true);
    try { await login(email, password); router.push('/cliente/inicio'); }
    catch (err) { notify((err as Error).message); }
    finally { setBusy(false); }
  }
  return { router, email, setEmail, password, setPassword, busy, submit };
}
