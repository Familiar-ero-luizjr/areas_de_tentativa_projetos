import { NavLink } from "react-router-dom";
const items = [
  ["/", "Dashboard"],
  ["/firebase", "Firebase"],
  ["/stripe", "Stripe"],
  ["/maps", "Maps"],
  ["/scenarios", "Cenários"],
  ["/chaos", "Modo caos"],
  ["/logs", "Logs"],
  ["/settings", "Configurações"],
] as const;

export default function Sidebar() {
  return (
    <aside className="sidebar">
      {items.map(([to, label]) => (
        <NavLink key={to} to={to} end={to === "/"}>{label}</NavLink>
      ))}
    </aside>
  );
}
