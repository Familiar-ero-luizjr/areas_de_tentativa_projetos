"use client";

import { useRouter } from "next/navigation";

export default function BoasVindasPage() {
  const router = useRouter();

  return (
    <main className="welcome">
      <div className="welcomeLayout">
        <div className="welcomeImage">
          <img src="/reference/welcome_professionals.png" alt="Profissionais da advocacia" />
        </div>
        <div className="welcomeCopy">
          <p className="eyebrow">AdvogadoJá+</p>
          <h1>Olá! Bem-vindo ao AdvogadoJá+</h1>
          <p>Conectamos pessoas e profissionais da advocacia de forma simples e segura.</p>
          <div className="grow" />
          <button className="primaryBtn" onClick={() => router.push("/login")}>Continuar</button>
        </div>
      </div>
    </main>
  );
}
