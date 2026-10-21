import type { ReactNode } from "react";
export type UploadSimulatorProps = {
  title?: string;
  value?: string | number;
  children?: ReactNode;
};

export default function UploadSimulator({ title = "UploadSimulator", value, children }: UploadSimulatorProps) {
  return (
    <section className="ui-card" data-component="UploadSimulator">
      <strong>{title}</strong>
      {value !== undefined && <span className="ui-value">{value}</span>}
      <div className="ui-content">{children ?? "Componente de controle UploadSimulator."}</div>
    </section>
  );
}
