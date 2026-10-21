import type { ReactNode } from "react";
export type EnvironmentSettingsProps = {
  title?: string;
  value?: string | number;
  children?: ReactNode;
};

export default function EnvironmentSettings({ title = "EnvironmentSettings", value, children }: EnvironmentSettingsProps) {
  return (
    <section className="ui-card" data-component="EnvironmentSettings">
      <strong>{title}</strong>
      {value !== undefined && <span className="ui-value">{value}</span>}
      <div className="ui-content">{children ?? "Componente de controle EnvironmentSettings."}</div>
    </section>
  );
}
