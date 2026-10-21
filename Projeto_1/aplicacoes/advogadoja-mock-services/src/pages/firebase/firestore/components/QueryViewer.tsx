import type { ReactNode } from "react";
export type QueryViewerProps = {
  title?: string;
  value?: string | number;
  children?: ReactNode;
};

export default function QueryViewer({ title = "QueryViewer", value, children }: QueryViewerProps) {
  return (
    <section className="ui-card" data-component="QueryViewer">
      <strong>{title}</strong>
      {value !== undefined && <span className="ui-value">{value}</span>}
      <div className="ui-content">{children ?? "Componente de controle QueryViewer."}</div>
    </section>
  );
}
