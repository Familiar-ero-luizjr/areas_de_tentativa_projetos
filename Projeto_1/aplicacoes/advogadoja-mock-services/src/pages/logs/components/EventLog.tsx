import type { ReactNode } from "react";
export type EventLogProps = {
  title?: string;
  value?: string | number;
  children?: ReactNode;
};

export default function EventLog({ title = "EventLog", value, children }: EventLogProps) {
  return (
    <section className="ui-card" data-component="EventLog">
      <strong>{title}</strong>
      {value !== undefined && <span className="ui-value">{value}</span>}
      <div className="ui-content">{children ?? "Componente de controle EventLog."}</div>
    </section>
  );
}
