import type { ReactNode } from "react";
export type DocumentEditorProps = {
  title?: string;
  value?: string | number;
  children?: ReactNode;
};

export default function DocumentEditor({ title = "DocumentEditor", value, children }: DocumentEditorProps) {
  return (
    <section className="ui-card" data-component="DocumentEditor">
      <strong>{title}</strong>
      {value !== undefined && <span className="ui-value">{value}</span>}
      <div className="ui-content">{children ?? "Componente de controle DocumentEditor."}</div>
    </section>
  );
}
