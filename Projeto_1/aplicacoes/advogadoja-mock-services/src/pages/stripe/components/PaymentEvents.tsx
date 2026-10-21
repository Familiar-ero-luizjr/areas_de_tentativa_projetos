import type { ReactNode } from "react";
export type PaymentEventsProps = {
  title?: string;
  value?: string | number;
  children?: ReactNode;
};

export default function PaymentEvents({ title = "PaymentEvents", value, children }: PaymentEventsProps) {
  return (
    <section className="ui-card" data-component="PaymentEvents">
      <strong>{title}</strong>
      {value !== undefined && <span className="ui-value">{value}</span>}
      <div className="ui-content">{children ?? "Componente de controle PaymentEvents."}</div>
    </section>
  );
}
