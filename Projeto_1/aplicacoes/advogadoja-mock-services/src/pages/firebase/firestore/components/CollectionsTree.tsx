import type { ReactNode } from "react";
export type CollectionsTreeProps = {
  title?: string;
  value?: string | number;
  children?: ReactNode;
};

export default function CollectionsTree({ title = "CollectionsTree", value, children }: CollectionsTreeProps) {
  return (
    <section className="ui-card" data-component="CollectionsTree">
      <strong>{title}</strong>
      {value !== undefined && <span className="ui-value">{value}</span>}
      <div className="ui-content">{children ?? "Componente de controle CollectionsTree."}</div>
    </section>
  );
}
