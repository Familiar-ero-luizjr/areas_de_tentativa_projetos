import type { ReactNode } from "react";
export type RequestLogProps = {
  title?: string;
  value?: string | number;
  children?: ReactNode;
};

export default function RequestLog({ title = "RequestLog", value, children }: RequestLogProps) {
  return (
    <section className="ui-card" data-component="RequestLog">
      <strong>{title}</strong>
      {value !== undefined && <span className="ui-value">{value}</span>}
      <div className="ui-content">{children ?? "Componente de controle RequestLog."}</div>
    </section>
  );
}
