import type { ReactNode } from "react";
export type ReverseGeocodeSimulatorProps = {
  title?: string;
  value?: string | number;
  children?: ReactNode;
};

export default function ReverseGeocodeSimulator({ title = "ReverseGeocodeSimulator", value, children }: ReverseGeocodeSimulatorProps) {
  return (
    <section className="ui-card" data-component="ReverseGeocodeSimulator">
      <strong>{title}</strong>
      {value !== undefined && <span className="ui-value">{value}</span>}
      <div className="ui-content">{children ?? "Componente de controle ReverseGeocodeSimulator."}</div>
    </section>
  );
}
