import type { ReactNode } from "react";
export type LawyerMarkersProps = {
  title?: string;
  value?: string | number;
  children?: ReactNode;
};

export default function LawyerMarkers({ title = "LawyerMarkers", value, children }: LawyerMarkersProps) {
  return (
    <section className="ui-card" data-component="LawyerMarkers">
      <strong>{title}</strong>
      {value !== undefined && <span className="ui-value">{value}</span>}
      <div className="ui-content">{children ?? "Componente de controle LawyerMarkers."}</div>
    </section>
  );
}
