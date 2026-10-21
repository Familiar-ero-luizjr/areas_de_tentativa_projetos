import type { ReactNode } from "react";
export type CheckoutSimulatorProps = {
  title?: string;
  value?: string | number;
  children?: ReactNode;
};

export default function CheckoutSimulator({ title = "CheckoutSimulator", value, children }: CheckoutSimulatorProps) {
  return (
    <section className="ui-card" data-component="CheckoutSimulator">
      <strong>{title}</strong>
      {value !== undefined && <span className="ui-value">{value}</span>}
      <div className="ui-content">{children ?? "Componente de controle CheckoutSimulator."}</div>
    </section>
  );
}
