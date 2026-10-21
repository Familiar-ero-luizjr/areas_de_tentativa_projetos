import type { ReactNode } from "react";
export type SubscriptionsTableProps = {
  title?: string;
  value?: string | number;
  children?: ReactNode;
};

export default function SubscriptionsTable({ title = "SubscriptionsTable", value, children }: SubscriptionsTableProps) {
  return (
    <section className="ui-card" data-component="SubscriptionsTable">
      <strong>{title}</strong>
      {value !== undefined && <span className="ui-value">{value}</span>}
      <div className="ui-content">{children ?? "Componente de controle SubscriptionsTable."}</div>
    </section>
  );
}
