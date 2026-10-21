import type { ReactNode } from "react";
export type ResetEnvironmentProps = {
  title?: string;
  value?: string | number;
  children?: ReactNode;
};

export default function ResetEnvironment({ title = "ResetEnvironment", value, children }: ResetEnvironmentProps) {
  return (
    <section className="ui-card" data-component="ResetEnvironment">
      <strong>{title}</strong>
      {value !== undefined && <span className="ui-value">{value}</span>}
      <div className="ui-content">{children ?? "Componente de controle ResetEnvironment."}</div>
    </section>
  );
}
