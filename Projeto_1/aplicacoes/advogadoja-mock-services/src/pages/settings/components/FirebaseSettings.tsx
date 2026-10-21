import type { ReactNode } from "react";
export type FirebaseSettingsProps = {
  title?: string;
  value?: string | number;
  children?: ReactNode;
};

export default function FirebaseSettings({ title = "FirebaseSettings", value, children }: FirebaseSettingsProps) {
  return (
    <section className="ui-card" data-component="FirebaseSettings">
      <strong>{title}</strong>
      {value !== undefined && <span className="ui-value">{value}</span>}
      <div className="ui-content">{children ?? "Componente de controle FirebaseSettings."}</div>
    </section>
  );
}
