import type { ReactNode } from "react";
export type ServiceFailureControlProps = {
  title?: string;
  value?: string | number;
  children?: ReactNode;
};

export default function ServiceFailureControl({ title = "ServiceFailureControl", value, children }: ServiceFailureControlProps) {
  return (
    <section className="ui-card" data-component="ServiceFailureControl">
      <strong>{title}</strong>
      {value !== undefined && <span className="ui-value">{value}</span>}
      <div className="ui-content">{children ?? "Componente de controle ServiceFailureControl."}</div>
    </section>
  );
}
