import type { ReactNode } from "react";
export type CurrentLocationProps = {
  title?: string;
  value?: string | number;
  children?: ReactNode;
};

export default function CurrentLocation({ title = "CurrentLocation", value, children }: CurrentLocationProps) {
  return (
    <section className="ui-card" data-component="CurrentLocation">
      <strong>{title}</strong>
      {value !== undefined && <span className="ui-value">{value}</span>}
      <div className="ui-content">{children ?? "Componente de controle CurrentLocation."}</div>
    </section>
  );
}
