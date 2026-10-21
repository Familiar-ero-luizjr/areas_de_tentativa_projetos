import type { ReactNode } from "react";
export type ScenarioCardProps = {
  title?: string;
  value?: string | number;
  children?: ReactNode;
};

export default function ScenarioCard({ title = "ScenarioCard", value, children }: ScenarioCardProps) {
  return (
    <section className="ui-card" data-component="ScenarioCard">
      <strong>{title}</strong>
      {value !== undefined && <span className="ui-value">{value}</span>}
      <div className="ui-content">{children ?? "Componente de controle ScenarioCard."}</div>
    </section>
  );
}
