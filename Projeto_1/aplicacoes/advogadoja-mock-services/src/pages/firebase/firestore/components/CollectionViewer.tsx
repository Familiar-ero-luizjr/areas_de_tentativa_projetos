import type { ReactNode } from "react";
export type CollectionViewerProps = {
  title?: string;
  value?: string | number;
  children?: ReactNode;
};

export default function CollectionViewer({ title = "CollectionViewer", value, children }: CollectionViewerProps) {
  return (
    <section className="ui-card" data-component="CollectionViewer">
      <strong>{title}</strong>
      {value !== undefined && <span className="ui-value">{value}</span>}
      <div className="ui-content">{children ?? "Componente de controle CollectionViewer."}</div>
    </section>
  );
}
