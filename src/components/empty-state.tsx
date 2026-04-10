/** Muted card wrapper for empty lists or missing data messages. */
export function EmptyState({children}: {children: React.ReactNode}) {
  return <div className="empty-card">{children}</div>
}
