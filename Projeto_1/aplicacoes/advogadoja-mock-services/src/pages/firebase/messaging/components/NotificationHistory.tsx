import type { ReactNode } from "react";
export type NotificationHistoryProps = {
  title?: string;
  value?: string | number;
  children?: ReactNode;
};

export default function NotificationHistory({ title = "NotificationHistory", value, children }: NotificationHistoryProps) {
  return (
    <section className="ui-card" data-component="NotificationHistory">
      <strong>{title}</strong>
      {value !== undefined && <span className="ui-value">{value}</span>}
      <div className="ui-content">{children ?? "Componente de controle NotificationHistory."}</div>
    </section>
  );
}
