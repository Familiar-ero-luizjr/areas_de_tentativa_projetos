import type { ReactNode } from "react";
export type GeocodeSimulatorProps = {
  title?: string;
  value?: string | number;
  children?: ReactNode;
};

export default function GeocodeSimulator({ title = "GeocodeSimulator", value, children }: GeocodeSimulatorProps) {
  return (
    <section className="ui-card" data-component="GeocodeSimulator">
      <strong>{title}</strong>
      {value !== undefined && <span className="ui-value">{value}</span>}
      <div className="ui-content">{children ?? "Componente de controle GeocodeSimulator."}</div>
    </section>
  );
}
