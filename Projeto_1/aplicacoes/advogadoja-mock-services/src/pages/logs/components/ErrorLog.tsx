import type { ReactNode } from "react";
export type ErrorLogProps = {
  title?: string;
  value?: string | number;
  children?: ReactNode;
};

export default function ErrorLog({ title = "ErrorLog", value, children }: ErrorLogProps) {
  return (
    <section className="ui-card" data-component="ErrorLog">
      <strong>{title}</strong>
      {value !== undefined && <span className="ui-value">{value}</span>}
      <div className="ui-content">{children ?? "Componente de controle ErrorLog."}</div>
    </section>
  );
}
