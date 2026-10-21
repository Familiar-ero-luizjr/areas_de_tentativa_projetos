"use client";

import { AppShell } from "@/components/layout/AppShell";
import { JourneyForm } from "@/components/forms/JourneyForm";
import { PageSection } from "./ContatoPage.styles";

export default function ContatoPage() {
  return <AppShell title="Contato"><PageSection>
    <JourneyForm
      fields={[
        { name: "email", label: "E-mail", type: "email", required: true },
        { name: "telefone", label: "Telefone com DDI", type: "tel" },
      ]}
      next="/cadastro/endereco"
      back="/cadastro/identificacao"
      note={<div className="formNote"><strong>Privacidade</strong><span>Telefone e e-mail não são exibidos publicamente por padrão.</span></div>}
    />
  </PageSection></AppShell>;
}
