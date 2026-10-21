import type { ReactNode } from "react";
export type ScenarioRunnerProps = {
  title?: string;
  value?: string | number;
  children?: ReactNode;
};

export default function ScenarioRunner({ title = "ScenarioRunner", value, children }: ScenarioRunnerProps) {
  return (
    <section className="ui-card" data-component="ScenarioRunner">
      <strong>{title}</strong>
      {value !== undefined && <span className="ui-value">{value}</span>}
      <div className="ui-content">{children ?? "Componente de controle ScenarioRunner."}</div>
    </section>
  );
}
