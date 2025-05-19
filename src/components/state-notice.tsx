export function StateNotice({
  error,
  fetchedAt,
  loading,
  refreshing,
}: {
  error?: string
  fetchedAt?: number
  loading: boolean
  refreshing: boolean
}) {
  if (loading) {
    return <div className="notice-card">Loading Jira data...</div>
  }

  if (!error && !refreshing && !fetchedAt) return null

  return (
    <div className="notice-card">
      {error ? <p>{error}</p> : null}
      {fetchedAt ? (
        <p className="muted">Last synced {new Date(fetchedAt).toLocaleString()}</p>
      ) : null}
    </div>
  )
}
