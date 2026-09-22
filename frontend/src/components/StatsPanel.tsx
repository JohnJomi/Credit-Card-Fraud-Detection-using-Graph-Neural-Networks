import type { Stats } from '../api'

function Tile({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg bg-gray-800 px-4 py-3 min-w-[110px]">
      <span className="text-xl font-semibold text-gray-100">{value}</span>
      <span className="text-xs text-gray-400 mt-1">{label}</span>
    </div>
  )
}

export default function StatsPanel({ stats }: { stats: Stats | null }) {
  if (!stats) {
    return <div className="text-gray-400 text-sm">Loading stats…</div>
  }

  return (
    <div className="flex flex-wrap gap-3">
      <Tile label="Transactions" value={stats.nodes.toLocaleString()} />
      <Tile label="Fraud" value={stats.fraud_transactions.toLocaleString()} />
      <Tile label="Fraud Rate" value={`${(stats.fraud_rate * 100).toFixed(2)}%`} />
      <Tile label="Precision" value={stats.precision.toFixed(2)} />
      <Tile label="Recall" value={stats.recall.toFixed(2)} />
      <Tile label="F1 Score" value={stats.f1.toFixed(2)} />
      <Tile label="ROC-AUC" value={stats.roc_auc.toFixed(2)} />
    </div>
  )
}
