import type { ReactNode } from "react";
export type PlansTableProps = {
  title?: string;
  value?: string | number;
  children?: ReactNode;
};

export default function PlansTable({ title = "PlansTable", value, children }: PlansTableProps) {
  return (
    <section className="ui-card" data-component="PlansTable">
      <strong>{title}</strong>
      {value !== undefined && <span className="ui-value">{value}</span>}
      <div className="ui-content">{children ?? "Componente de controle PlansTable."}</div>
    </section>
  );
}
