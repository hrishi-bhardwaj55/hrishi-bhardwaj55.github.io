import './versions.css';
export default function VersionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="portfolio-versions">{children}</div>;
}
