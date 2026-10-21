import type { ReactNode } from "react";
export type NotificationComposerProps = {
  title?: string;
  value?: string | number;
  children?: ReactNode;
};

export default function NotificationComposer({ title = "NotificationComposer", value, children }: NotificationComposerProps) {
  return (
    <section className="ui-card" data-component="NotificationComposer">
      <strong>{title}</strong>
      {value !== undefined && <span className="ui-value">{value}</span>}
      <div className="ui-content">{children ?? "Componente de controle NotificationComposer."}</div>
    </section>
  );
}
