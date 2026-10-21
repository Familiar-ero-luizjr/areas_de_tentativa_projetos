import type { ReactNode } from "react";
export type TokenViewerProps = {
  title?: string;
  value?: string | number;
  children?: ReactNode;
};

export default function TokenViewer({ title = "TokenViewer", value, children }: TokenViewerProps) {
  return (
    <section className="ui-card" data-component="TokenViewer">
      <strong>{title}</strong>
      {value !== undefined && <span className="ui-value">{value}</span>}
      <div className="ui-content">{children ?? "Componente de controle TokenViewer."}</div>
    </section>
  );
}
