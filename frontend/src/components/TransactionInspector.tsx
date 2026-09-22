import type { Transaction } from '../api'
import PredictionCard from './PredictionCard'

export default function TransactionInspector({ transaction }: { transaction: Transaction | null }) {
  if (!transaction) {
    return (
      <div className="rounded-lg bg-surface border border-border p-6 flex flex-col gap-1">
        <h3 className="text-sm font-medium text-ink">Select a transaction</h3>
        <p className="text-sm text-ink-dim">
          Click any node in the graph to inspect its features, prediction, and graph
          neighborhood.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-lg bg-surface border border-border p-5 flex flex-col gap-5 reveal">
      <div>
        <div className="text-xs text-ink-dim">Transaction</div>
        <div className="text-lg font-semibold text-ink">#{transaction.id}</div>
      </div>

      <div>
        <div className="text-xs text-ink-dim">Amount</div>
        <div className="text-ink">${transaction.amount.toFixed(2)}</div>
      </div>

      <PredictionCard transaction={transaction} />

      <div>
        <div className="text-xs text-ink-dim mb-2">
          {transaction.neighbors.length} connected transaction
          {transaction.neighbors.length === 1 ? '' : 's'}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {transaction.neighbors.map((n) => (
            <span
              key={n}
              className="text-xs bg-selected-soft text-selected rounded px-2 py-0.5 border border-selected-border"
            >
              #{n}
            </span>
          ))}
        </div>
      </div>

      <details className="text-xs text-ink-dim">
        <summary className="cursor-pointer text-ink-dim hover:text-ink">
          Transaction features
        </summary>
        <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1">
          {Object.entries(transaction.features).map(([k, v]) => (
            <div key={k} className="flex justify-between">
              <span>{k}</span>
              <span className="text-ink-dim">{v.toFixed(3)}</span>
            </div>
          ))}
        </div>
      </details>
    </div>
  )
}
