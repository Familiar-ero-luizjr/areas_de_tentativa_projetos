import type { ReactNode } from "react";
export type FunctionRequestProps = {
  title?: string;
  value?: string | number;
  children?: ReactNode;
};

export default function FunctionRequest({ title = "FunctionRequest", value, children }: FunctionRequestProps) {
  return (
    <section className="ui-card" data-component="FunctionRequest">
      <strong>{title}</strong>
      {value !== undefined && <span className="ui-value">{value}</span>}
      <div className="ui-content">{children ?? "Componente de controle FunctionRequest."}</div>
    </section>
  );
}
