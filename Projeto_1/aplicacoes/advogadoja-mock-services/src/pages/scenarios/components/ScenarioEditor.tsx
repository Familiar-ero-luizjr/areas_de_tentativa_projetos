import type { ReactNode } from "react";
export type ScenarioEditorProps = {
  title?: string;
  value?: string | number;
  children?: ReactNode;
};

export default function ScenarioEditor({ title = "ScenarioEditor", value, children }: ScenarioEditorProps) {
  return (
    <section className="ui-card" data-component="ScenarioEditor">
      <strong>{title}</strong>
      {value !== undefined && <span className="ui-value">{value}</span>}
      <div className="ui-content">{children ?? "Componente de controle ScenarioEditor."}</div>
    </section>
  );
}
