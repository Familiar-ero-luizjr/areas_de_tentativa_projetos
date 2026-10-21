import type { ReactNode } from "react";
export type ScenarioStateProps = {
  title?: string;
  value?: string | number;
  children?: ReactNode;
};

export default function ScenarioState({ title = "ScenarioState", value, children }: ScenarioStateProps) {
  return (
    <section className="ui-card" data-component="ScenarioState">
      <strong>{title}</strong>
      {value !== undefined && <span className="ui-value">{value}</span>}
      <div className="ui-content">{children ?? "Componente de controle ScenarioState."}</div>
    </section>
  );
}
