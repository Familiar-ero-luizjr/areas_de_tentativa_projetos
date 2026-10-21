import type { ReactNode } from "react";
export type RequestCounterCardProps = {
  title?: string;
  value?: string | number;
  children?: ReactNode;
};

export default function RequestCounterCard({ title = "RequestCounterCard", value, children }: RequestCounterCardProps) {
  return (
    <section className="ui-card" data-component="RequestCounterCard">
      <strong>{title}</strong>
      {value !== undefined && <span className="ui-value">{value}</span>}
      <div className="ui-content">{children ?? "Componente de controle RequestCounterCard."}</div>
    </section>
  );
}
