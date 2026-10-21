"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { useJourney } from "@/context/JourneyContext";
import { useFeedback } from "@/context/FeedbackContext";
import { onboardingService } from "@/services/onboarding.service";
import { PageSection } from "./PreferenciasContatoPage.styles";

export default function PreferenciasContatoPage() {
  const router = useRouter();
  const { values, setValue } = useJourney();
  const { notify } = useFeedback();
  const [busy, setBusy] = useState(false);

  const next = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!values.canal?.trim()) { notify("Informe o canal de contato."); return; }
    setBusy(true);
    try {
      await onboardingService.update({ contactPreference: values.canal, contactTime: values.horario });
      router.push("/cliente/onboarding/concluido");
    } catch (cause) {
      notify((cause as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return <AppShell title="Como prefere ser contatada?"><PageSection>
    <form onSubmit={next}>
      <div className="clientChipRow" role="group" aria-label="Canal de contato">
        {["WhatsApp", "Ligação", "E-mail"].map(channel => <button key={channel} type="button" className={"clientChip" + (values.canal === channel ? " active" : "")} aria-pressed={values.canal === channel} onClick={() => setValue("canal", channel)}>{channel}</button>)}
      </div>
      <label className="field"><span>Melhor horário</span><select value={values.horario || ""} onChange={event => setValue("horario", event.target.value)} required><option value="">Selecionar</option>{["Manhã", "Tarde", "Noite"].map(value => <option key={value}>{value}</option>)}</select></label>
      <div className="formNote"><strong>Privacidade</strong><span>Os dados de contato só são compartilhados após o profissional aceitar a solicitação.</span></div>
      <div className="actions"><button className="secondaryBtn" type="button" onClick={() => router.push("/cliente/onboarding/localizacao")}>Voltar</button><button className="primaryBtn" type="submit" disabled={busy}>{busy ? "Salvando…" : "Salvar preferências"}</button></div>
    </form>
  </PageSection></AppShell>;
}
