import type { ReactNode } from "react";
export type UserEditorProps = {
  title?: string;
  value?: string | number;
  children?: ReactNode;
};

export default function UserEditor({ title = "UserEditor", value, children }: UserEditorProps) {
  return (
    <section className="ui-card" data-component="UserEditor">
      <strong>{title}</strong>
      {value !== undefined && <span className="ui-value">{value}</span>}
      <div className="ui-content">{children ?? "Componente de controle UserEditor."}</div>
    </section>
  );
}
