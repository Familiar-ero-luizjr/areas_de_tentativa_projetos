import type { ReactNode } from "react";
export type ConfigEditorProps = {
  title?: string;
  value?: string | number;
  children?: ReactNode;
};

export default function ConfigEditor({ title = "ConfigEditor", value, children }: ConfigEditorProps) {
  return (
    <section className="ui-card" data-component="ConfigEditor">
      <strong>{title}</strong>
      {value !== undefined && <span className="ui-value">{value}</span>}
      <div className="ui-content">{children ?? "Componente de controle ConfigEditor."}</div>
    </section>
  );
}
