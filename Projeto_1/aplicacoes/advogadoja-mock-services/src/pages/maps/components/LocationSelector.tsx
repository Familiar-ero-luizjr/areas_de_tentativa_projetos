import type { ReactNode } from "react";
export type LocationSelectorProps = {
  title?: string;
  value?: string | number;
  children?: ReactNode;
};

export default function LocationSelector({ title = "LocationSelector", value, children }: LocationSelectorProps) {
  return (
    <section className="ui-card" data-component="LocationSelector">
      <strong>{title}</strong>
      {value !== undefined && <span className="ui-value">{value}</span>}
      <div className="ui-content">{children ?? "Componente de controle LocationSelector."}</div>
    </section>
  );
}
