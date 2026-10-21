import type { ReactNode } from "react";
export type SessionPanelProps = {
  title?: string;
  value?: string | number;
  children?: ReactNode;
};

export default function SessionPanel({ title = "SessionPanel", value, children }: SessionPanelProps) {
  return (
    <section className="ui-card" data-component="SessionPanel">
      <strong>{title}</strong>
      {value !== undefined && <span className="ui-value">{value}</span>}
      <div className="ui-content">{children ?? "Componente de controle SessionPanel."}</div>
    </section>
  );
}
