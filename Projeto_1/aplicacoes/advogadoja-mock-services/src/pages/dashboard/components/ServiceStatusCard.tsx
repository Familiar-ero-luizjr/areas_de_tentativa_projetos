import type { ReactNode } from "react";
export type ServiceStatusCardProps = {
  title?: string;
  value?: string | number;
  children?: ReactNode;
};

export default function ServiceStatusCard({ title = "ServiceStatusCard", value, children }: ServiceStatusCardProps) {
  return (
    <section className="ui-card" data-component="ServiceStatusCard">
      <strong>{title}</strong>
      {value !== undefined && <span className="ui-value">{value}</span>}
      <div className="ui-content">{children ?? "Componente de controle ServiceStatusCard."}</div>
    </section>
  );
}
