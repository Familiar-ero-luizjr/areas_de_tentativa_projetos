import type { ReactNode } from "react";
export type FunctionRunnerProps = {
  title?: string;
  value?: string | number;
  children?: ReactNode;
};

export default function FunctionRunner({ title = "FunctionRunner", value, children }: FunctionRunnerProps) {
  return (
    <section className="ui-card" data-component="FunctionRunner">
      <strong>{title}</strong>
      {value !== undefined && <span className="ui-value">{value}</span>}
      <div className="ui-content">{children ?? "Componente de controle FunctionRunner."}</div>
    </section>
  );
}
