import type { ReactNode } from "react";
export type FileViewerProps = {
  title?: string;
  value?: string | number;
  children?: ReactNode;
};

export default function FileViewer({ title = "FileViewer", value, children }: FileViewerProps) {
  return (
    <section className="ui-card" data-component="FileViewer">
      <strong>{title}</strong>
      {value !== undefined && <span className="ui-value">{value}</span>}
      <div className="ui-content">{children ?? "Componente de controle FileViewer."}</div>
    </section>
  );
}
