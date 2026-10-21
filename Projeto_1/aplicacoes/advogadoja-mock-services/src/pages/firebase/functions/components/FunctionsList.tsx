import type { ReactNode } from "react";
export type FunctionsListProps = {
  title?: string;
  value?: string | number;
  children?: ReactNode;
};

export default function FunctionsList({ title = "FunctionsList", value, children }: FunctionsListProps) {
  return (
    <section className="ui-card" data-component="FunctionsList">
      <strong>{title}</strong>
      {value !== undefined && <span className="ui-value">{value}</span>}
      <div className="ui-content">{children ?? "Componente de controle FunctionsList."}</div>
    </section>
  );
}
