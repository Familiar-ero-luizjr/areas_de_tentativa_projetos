"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { useJourney } from "@/context/JourneyContext";
import { useFeedback } from "@/context/FeedbackContext";
import { onboardingService } from "@/services/onboarding.service";
import { PageSection } from "./LocalizacaoPage.styles";

export default function LocalizacaoPage() {
  const router = useRouter();
  const { values, setValue } = useJourney();
  const { notify } = useFeedback();
  const [busy, setBusy] = useState(false);

  const next = async () => {
    setBusy(true);
    try {
      await onboardingService.update({ location: values.cidadeBusca || undefined });
      router.push("/cliente/onboarding/preferencias-contato");
    } catch (cause) {
      notify((cause as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return <AppShell title="Profissionais na sua região"><PageSection>
    <div className="clientMap" role="img" aria-label="Mapa ilustrativo com profissionais na região" />
    <label className="field"><span>Cidade (opcional)</span><input value={values.cidadeBusca || ""} onChange={event => setValue("cidadeBusca", event.target.value)} placeholder="Informe a cidade manualmente" /></label>
    <div className="actions"><button className="primaryBtn" disabled={busy} onClick={() => void next()}>{busy ? "Salvando…" : "Continuar"}</button></div>
    <p className="hint">Nesta versão mock não coletamos localização precisa.</p>
  </PageSection></AppShell>;
}
