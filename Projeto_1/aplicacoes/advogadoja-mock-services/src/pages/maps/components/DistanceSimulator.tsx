import type { ReactNode } from "react";
export type DistanceSimulatorProps = {
  title?: string;
  value?: string | number;
  children?: ReactNode;
};

export default function DistanceSimulator({ title = "DistanceSimulator", value, children }: DistanceSimulatorProps) {
  return (
    <section className="ui-card" data-component="DistanceSimulator">
      <strong>{title}</strong>
      {value !== undefined && <span className="ui-value">{value}</span>}
      <div className="ui-content">{children ?? "Componente de controle DistanceSimulator."}</div>
    </section>
  );
}
