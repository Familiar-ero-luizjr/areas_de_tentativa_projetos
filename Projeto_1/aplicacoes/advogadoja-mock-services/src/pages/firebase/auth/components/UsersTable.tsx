import type { ReactNode } from "react";
export type UsersTableProps = {
  title?: string;
  value?: string | number;
  children?: ReactNode;
};

export default function UsersTable({ title = "UsersTable", value, children }: UsersTableProps) {
  return (
    <section className="ui-card" data-component="UsersTable">
      <strong>{title}</strong>
      {value !== undefined && <span className="ui-value">{value}</span>}
      <div className="ui-content">{children ?? "Componente de controle UsersTable."}</div>
    </section>
  );
}
