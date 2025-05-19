import './info-grid.css'

export function InfoGrid({items}: {items: {label: string; value?: React.ReactNode}[]}) {
  return (
    <div className="info-grid">
      {items.map(item => (
        <div className="info-grid__card" key={item.label}>
          <div className="info-grid__label">{item.label}</div>
          <div className="info-grid__value">
            {item.value || <span className="info-grid__value-muted">N/A</span>}
          </div>
        </div>
      ))}
    </div>
  )
}
