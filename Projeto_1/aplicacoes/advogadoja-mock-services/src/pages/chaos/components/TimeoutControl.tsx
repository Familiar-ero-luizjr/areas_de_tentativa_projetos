import type { ReactNode } from "react";
export type TimeoutControlProps = {
  title?: string;
  value?: string | number;
  children?: ReactNode;
};

export default function TimeoutControl({ title = "TimeoutControl", value, children }: TimeoutControlProps) {
  return (
    <section className="ui-card" data-component="TimeoutControl">
      <strong>{title}</strong>
      {value !== undefined && <span className="ui-value">{value}</span>}
      <div className="ui-content">{children ?? "Componente de controle TimeoutControl."}</div>
    </section>
  );
}
