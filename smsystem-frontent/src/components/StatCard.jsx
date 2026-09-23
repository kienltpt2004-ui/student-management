export default function StatCard({icon: Icon, label, value, hint, tone='blue'}) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${tone}`}><Icon size={20}/></div>
      <div className="stat-copy">
        <span>{label}</span>
        <strong>{value}</strong>
        {hint && <small>{hint}</small>}
      </div>
    </div>
  )
}
