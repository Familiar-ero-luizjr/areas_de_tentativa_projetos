import type { ReactNode } from "react";
export type DocumentViewerProps = {
  title?: string;
  value?: string | number;
  children?: ReactNode;
};

export default function DocumentViewer({ title = "DocumentViewer", value, children }: DocumentViewerProps) {
  return (
    <section className="ui-card" data-component="DocumentViewer">
      <strong>{title}</strong>
      {value !== undefined && <span className="ui-value">{value}</span>}
      <div className="ui-content">{children ?? "Componente de controle DocumentViewer."}</div>
    </section>
  );
}
