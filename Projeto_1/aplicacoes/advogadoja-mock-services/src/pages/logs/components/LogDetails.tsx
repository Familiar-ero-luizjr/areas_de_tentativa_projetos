import type { ReactNode } from "react";
export type LogDetailsProps = {
  title?: string;
  value?: string | number;
  children?: ReactNode;
};

export default function LogDetails({ title = "LogDetails", value, children }: LogDetailsProps) {
  return (
    <section className="ui-card" data-component="LogDetails">
      <strong>{title}</strong>
      {value !== undefined && <span className="ui-value">{value}</span>}
      <div className="ui-content">{children ?? "Componente de controle LogDetails."}</div>
    </section>
  );
}
