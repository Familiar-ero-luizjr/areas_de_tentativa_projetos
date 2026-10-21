import type { ReactNode } from "react";
export type WebhookSimulatorProps = {
  title?: string;
  value?: string | number;
  children?: ReactNode;
};

export default function WebhookSimulator({ title = "WebhookSimulator", value, children }: WebhookSimulatorProps) {
  return (
    <section className="ui-card" data-component="WebhookSimulator">
      <strong>{title}</strong>
      {value !== undefined && <span className="ui-value">{value}</span>}
      <div className="ui-content">{children ?? "Componente de controle WebhookSimulator."}</div>
    </section>
  );
}
