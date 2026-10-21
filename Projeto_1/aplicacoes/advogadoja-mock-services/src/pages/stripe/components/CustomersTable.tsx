import type { ReactNode } from "react";
export type CustomersTableProps = {
  title?: string;
  value?: string | number;
  children?: ReactNode;
};

export default function CustomersTable({ title = "CustomersTable", value, children }: CustomersTableProps) {
  return (
    <section className="ui-card" data-component="CustomersTable">
      <strong>{title}</strong>
      {value !== undefined && <span className="ui-value">{value}</span>}
      <div className="ui-content">{children ?? "Componente de controle CustomersTable."}</div>
    </section>
  );
}
