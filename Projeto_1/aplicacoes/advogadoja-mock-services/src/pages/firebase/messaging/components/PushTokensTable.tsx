import type { ReactNode } from "react";
export type PushTokensTableProps = {
  title?: string;
  value?: string | number;
  children?: ReactNode;
};

export default function PushTokensTable({ title = "PushTokensTable", value, children }: PushTokensTableProps) {
  return (
    <section className="ui-card" data-component="PushTokensTable">
      <strong>{title}</strong>
      {value !== undefined && <span className="ui-value">{value}</span>}
      <div className="ui-content">{children ?? "Componente de controle PushTokensTable."}</div>
    </section>
  );
}
