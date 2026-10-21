import type { ReactNode } from "react";
export type MapsSettingsProps = {
  title?: string;
  value?: string | number;
  children?: ReactNode;
};

export default function MapsSettings({ title = "MapsSettings", value, children }: MapsSettingsProps) {
  return (
    <section className="ui-card" data-component="MapsSettings">
      <strong>{title}</strong>
      {value !== undefined && <span className="ui-value">{value}</span>}
      <div className="ui-content">{children ?? "Componente de controle MapsSettings."}</div>
    </section>
  );
}
