import type { ReactNode } from "react";
export type StripeSettingsProps = {
  title?: string;
  value?: string | number;
  children?: ReactNode;
};

export default function StripeSettings({ title = "StripeSettings", value, children }: StripeSettingsProps) {
  return (
    <section className="ui-card" data-component="StripeSettings">
      <strong>{title}</strong>
      {value !== undefined && <span className="ui-value">{value}</span>}
      <div className="ui-content">{children ?? "Componente de controle StripeSettings."}</div>
    </section>
  );
}
