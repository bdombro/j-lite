export function PageSection({
  title,
  actions,
  children,
}: {
  actions?: React.ReactNode
  children: React.ReactNode
  title: string
}) {
  return (
    <section className="page-section">
      <div className="section-header">
        <h2>{title}</h2>
        <div>{actions}</div>
      </div>
      {children}
    </section>
  )
}
