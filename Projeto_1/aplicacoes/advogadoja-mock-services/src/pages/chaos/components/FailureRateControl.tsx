import type { ReactNode } from "react";
export type FailureRateControlProps = {
  title?: string;
  value?: string | number;
  children?: ReactNode;
};

export default function FailureRateControl({ title = "FailureRateControl", value, children }: FailureRateControlProps) {
  return (
    <section className="ui-card" data-component="FailureRateControl">
      <strong>{title}</strong>
      {value !== undefined && <span className="ui-value">{value}</span>}
      <div className="ui-content">{children ?? "Componente de controle FailureRateControl."}</div>
    </section>
  );
}
