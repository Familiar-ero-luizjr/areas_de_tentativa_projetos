import type { ReactNode } from "react";
export type OfflineControlProps = {
  title?: string;
  value?: string | number;
  children?: ReactNode;
};

export default function OfflineControl({ title = "OfflineControl", value, children }: OfflineControlProps) {
  return (
    <section className="ui-card" data-component="OfflineControl">
      <strong>{title}</strong>
      {value !== undefined && <span className="ui-value">{value}</span>}
      <div className="ui-content">{children ?? "Componente de controle OfflineControl."}</div>
    </section>
  );
}
