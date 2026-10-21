import type { MouseEvent, ReactNode } from "react";
export default function Modal({ open, children, onClose }: { open: boolean; children: ReactNode; onClose: () => void }) {
  if (!open) return null;
  return <div className="modal-bg" onClick={onClose}><div className="modal" onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}>{children}</div></div>;
}
