import type { ReactNode } from "react";
export type PaymentSimulatorProps = {
  title?: string;
  value?: string | number;
  children?: ReactNode;
};

export default function PaymentSimulator({ title = "PaymentSimulator", value, children }: PaymentSimulatorProps) {
  return (
    <section className="ui-card" data-component="PaymentSimulator">
      <strong>{title}</strong>
      {value !== undefined && <span className="ui-value">{value}</span>}
      <div className="ui-content">{children ?? "Componente de controle PaymentSimulator."}</div>
    </section>
  );
}
