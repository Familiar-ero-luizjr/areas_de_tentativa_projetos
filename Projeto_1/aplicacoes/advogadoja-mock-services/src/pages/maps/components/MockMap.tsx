import type { ReactNode } from "react";
export type MockMapProps = {
  title?: string;
  value?: string | number;
  children?: ReactNode;
};

export default function MockMap({ title = "MockMap", value, children }: MockMapProps) {
  return (
    <section className="ui-card" data-component="MockMap">
      <strong>{title}</strong>
      {value !== undefined && <span className="ui-value">{value}</span>}
      <div className="ui-content">{children ?? "Componente de controle MockMap."}</div>
    </section>
  );
}
