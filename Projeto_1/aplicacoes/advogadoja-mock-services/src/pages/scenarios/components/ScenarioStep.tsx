import type { ReactNode } from "react";
export type ScenarioStepProps = {
  title?: string;
  value?: string | number;
  children?: ReactNode;
};

export default function ScenarioStep({ title = "ScenarioStep", value, children }: ScenarioStepProps) {
  return (
    <section className="ui-card" data-component="ScenarioStep">
      <strong>{title}</strong>
      {value !== undefined && <span className="ui-value">{value}</span>}
      <div className="ui-content">{children ?? "Componente de controle ScenarioStep."}</div>
    </section>
  );
}
