import type { ReactNode } from "react";
export type ScenarioListProps = {
  title?: string;
  value?: string | number;
  children?: ReactNode;
};

export default function ScenarioList({ title = "ScenarioList", value, children }: ScenarioListProps) {
  return (
    <section className="ui-card" data-component="ScenarioList">
      <strong>{title}</strong>
      {value !== undefined && <span className="ui-value">{value}</span>}
      <div className="ui-content">{children ?? "Componente de controle ScenarioList."}</div>
    </section>
  );
}
