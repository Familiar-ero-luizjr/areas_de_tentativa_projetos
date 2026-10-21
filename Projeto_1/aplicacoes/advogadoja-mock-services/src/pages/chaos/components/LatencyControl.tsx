import type { ReactNode } from "react";
export type LatencyControlProps = {
  title?: string;
  value?: string | number;
  children?: ReactNode;
};

export default function LatencyControl({ title = "LatencyControl", value, children }: LatencyControlProps) {
  return (
    <section className="ui-card" data-component="LatencyControl">
      <strong>{title}</strong>
      {value !== undefined && <span className="ui-value">{value}</span>}
      <div className="ui-content">{children ?? "Componente de controle LatencyControl."}</div>
    </section>
  );
}
