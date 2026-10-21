import type { ReactNode } from "react";
export type CurrentUserCardProps = {
  title?: string;
  value?: string | number;
  children?: ReactNode;
};

export default function CurrentUserCard({ title = "CurrentUserCard", value, children }: CurrentUserCardProps) {
  return (
    <section className="ui-card" data-component="CurrentUserCard">
      <strong>{title}</strong>
      {value !== undefined && <span className="ui-value">{value}</span>}
      <div className="ui-content">{children ?? "Componente de controle CurrentUserCard."}</div>
    </section>
  );
}
