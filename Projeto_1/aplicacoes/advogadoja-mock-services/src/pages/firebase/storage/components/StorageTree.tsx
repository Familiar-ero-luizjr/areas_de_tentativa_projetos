import type { ReactNode } from "react";
export type StorageTreeProps = {
  title?: string;
  value?: string | number;
  children?: ReactNode;
};

export default function StorageTree({ title = "StorageTree", value, children }: StorageTreeProps) {
  return (
    <section className="ui-card" data-component="StorageTree">
      <strong>{title}</strong>
      {value !== undefined && <span className="ui-value">{value}</span>}
      <div className="ui-content">{children ?? "Componente de controle StorageTree."}</div>
    </section>
  );
}
