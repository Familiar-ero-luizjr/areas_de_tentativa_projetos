import type { ReactNode } from "react";
export type EnvironmentCardProps = {
  title?: string;
  value?: string | number;
  children?: ReactNode;
};

export default function EnvironmentCard({ title = "EnvironmentCard", value, children }: EnvironmentCardProps) {
  return (
    <section className="ui-card" data-component="EnvironmentCard">
      <strong>{title}</strong>
      {value !== undefined && <span className="ui-value">{value}</span>}
      <div className="ui-content">{children ?? "Componente de controle EnvironmentCard."}</div>
    </section>
  );
}
