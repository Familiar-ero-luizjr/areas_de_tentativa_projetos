import type { ReactNode } from "react";
export type FunctionResponseProps = {
  title?: string;
  value?: string | number;
  children?: ReactNode;
};

export default function FunctionResponse({ title = "FunctionResponse", value, children }: FunctionResponseProps) {
  return (
    <section className="ui-card" data-component="FunctionResponse">
      <strong>{title}</strong>
      {value !== undefined && <span className="ui-value">{value}</span>}
      <div className="ui-content">{children ?? "Componente de controle FunctionResponse."}</div>
    </section>
  );
}
