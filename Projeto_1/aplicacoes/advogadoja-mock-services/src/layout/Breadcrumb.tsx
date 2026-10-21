export default function Breadcrumb({ path }: { path: string[] }) {
  return <nav className="breadcrumb">{path.join(" / ")}</nav>;
}
