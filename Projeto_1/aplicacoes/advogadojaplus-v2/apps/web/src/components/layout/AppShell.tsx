"use client";

import { usePathname, useRouter } from "next/navigation";

type RouteVisual = { eyebrow?: string; description?: string; step?: number };

const routeVisuals: Record<string, RouteVisual> = {
  "/login": { description: "Acesse sua jornada na plataforma." },
  "/cadastro/tipo-conta": { eyebrow: "Criar conta", description: "O cadastro de dados pessoais é o mesmo para todos. Esta escolha define o onboarding que vem depois.", step: 1 },
  "/cadastro/identificacao": { eyebrow: "Dados pessoais", description: "Este bloco é comum para Cliente e Advogado.", step: 2 },
  "/cadastro/contato": { eyebrow: "Dados pessoais", description: "Informações privadas usadas para identificação e comunicação da conta.", step: 3 },
  "/cadastro/endereco": { eyebrow: "Dados pessoais", description: "Endereço residencial associado à conta.", step: 4 },
  "/cadastro/seguranca": { eyebrow: "Criar conta", description: "Defina a senha vinculada à sua conta.", step: 5 },
  "/cadastro/consentimentos": { eyebrow: "Criar conta", description: "Leia e aceite os documentos legais antes de continuar.", step: 6 },
  "/cadastro/revisao": { eyebrow: "Criar conta", description: "Confira os dados antes de criar a conta.", step: 7 },
  "/cadastro/concluido": { eyebrow: "Cadastro concluído", description: "Dados pessoais concluídos. Agora começa o onboarding específico do cliente." },
  "/cliente/onboarding/localizacao": { eyebrow: "Onboarding do Cliente", description: "Usamos a localização para organizar a busca por cidade, raio e modalidade. Você também pode informar a cidade manualmente." },
  "/cliente/onboarding/preferencias-contato": { eyebrow: "Onboarding do Cliente", description: "Essas preferências orientam o contato depois que um profissional aceitar a solicitação." },
  "/cliente/onboarding/concluido": { eyebrow: "Onboarding do Cliente", description: "Sua jornada está pronta. Agora você pode explorar a Home." },
};

export function AppShell({ title, children, showBack = false }: { title: string; children: React.ReactNode; showBack?: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const visual = routeVisuals[pathname] ?? {};
  const variant = pathname === "/login" ? "login" : pathname.startsWith("/cadastro/") ? "registration" : "onboarding";
  const success = pathname.endsWith("/concluido");

  return (
    <div className={`appViewport appViewport--${variant}${success ? " appViewport--success" : ""}`}>
      <header className="appTop">
        <div className="brand"><img src="/reference/brand_symbol.svg" alt="" /><span>AdvogadoJá{variant === "onboarding" ? "+" : ""}</span></div>
        {showBack && <button className="topBack" onClick={() => router.back()} aria-label="Voltar">←</button>}
      </header>
      <main className="content">
        {variant === "login" && <div className="loginMark"><img src="/reference/brand_symbol.svg" alt="" /></div>}
        {success && <div className="successMark" aria-hidden="true">✓</div>}
        <div className="pageHeader">
          {visual.eyebrow && <p className="eyebrow">{visual.eyebrow}</p>}
          <h1>{title}</h1>
          {visual.description && <p className="pageDescription">{visual.description}</p>}
        </div>
        {visual.step && <div className="progress" role="progressbar" aria-label={`Etapa ${visual.step} de 7`} aria-valuenow={visual.step} aria-valuemin={1} aria-valuemax={7}><span style={{ width: `${(visual.step / 7) * 100}%` }} /></div>}
        {children}
      </main>
    </div>
  );
}
