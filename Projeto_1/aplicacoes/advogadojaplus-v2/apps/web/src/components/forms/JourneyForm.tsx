"use client";

import { useJourney } from "@/context/JourneyContext";
import { useRouter } from "next/navigation";
import { useFeedback } from "@/context/FeedbackContext";

export type Field = { name: string; label: string; type?: string; options?: string[] | null; placeholder?: string; required?: boolean };

export function JourneyForm({ fields, next, back, nextLabel = "Continuar", note }: {
  fields: Field[];
  next: string;
  back?: string;
  nextLabel?: string;
  note?: React.ReactNode;
}) {
  const { values, setValue } = useJourney();
  const router = useRouter();
  const { notify } = useFeedback();

  return <form onSubmit={event => {
    event.preventDefault();
    for (const field of fields) {
      if (field.required && !values[field.name]?.trim()) {
        notify(`Preencha ${field.label.toLowerCase()}.`);
        return;
      }
    }
    if (fields.some(field => field.name === "confirmarSenha") && values.senha !== values.confirmarSenha) {
      notify("As senhas precisam ser iguais.");
      return;
    }
    router.push(next);
  }}>
    <div className="fieldList">{fields.map(field => <label key={field.name} className="field">
      <span>{field.label}{field.required ? " *" : ""}</span>
      {field.options ? <select value={values[field.name] || ""} onChange={event => setValue(field.name, event.target.value)}>
        <option value="">Selecionar</option>
        {field.options.map(option => <option key={option}>{option}</option>)}
      </select> : <input type={field.type || "text"} placeholder={field.placeholder || ""} value={values[field.name] || ""} onChange={event => setValue(field.name, event.target.value)} />}
    </label>)}</div>
    {note}
    <div className="actions">
      {back && <button type="button" className="secondaryBtn" onClick={() => router.push(back)}>Voltar</button>}
      <button className="primaryBtn" type="submit">{nextLabel}</button>
    </div>
  </form>;
}
