import type { ReactNode } from "react";
export type ConfigTableProps = {
  title?: string;
  value?: string | number;
  children?: ReactNode;
};

export default function ConfigTable({ title = "ConfigTable", value, children }: ConfigTableProps) {
  return (
    <section className="ui-card" data-component="ConfigTable">
      <strong>{title}</strong>
      {value !== undefined && <span className="ui-value">{value}</span>}
      <div className="ui-content">{children ?? "Componente de controle ConfigTable."}</div>
    </section>
  );
}
