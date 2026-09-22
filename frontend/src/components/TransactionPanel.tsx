import type { Transaction } from '../api'
import PredictionCard from './PredictionCard'

export default function TransactionPanel({ transaction }: { transaction: Transaction | null }) {
  if (!transaction) {
    return (
      <div className="text-gray-500 text-sm p-4 rounded-lg bg-gray-900 border border-gray-800">
        Select a node in the graph to inspect a transaction.
      </div>
    )
  }

  return (
    <div className="rounded-lg bg-gray-900 border border-gray-800 p-4 space-y-4">
      <div>
        <div className="text-xs text-gray-400">Transaction</div>
        <div className="text-lg font-semibold text-gray-100">#{transaction.id}</div>
      </div>

      <div>
        <div className="text-xs text-gray-400">Amount</div>
        <div className="text-gray-100">${transaction.amount.toFixed(2)}</div>
      </div>

      <PredictionCard transaction={transaction} />

      <div>
        <div className="text-xs text-gray-400 mb-1">
          Connected transactions: {transaction.neighbors.length}
        </div>
        <div className="flex flex-wrap gap-1">
          {transaction.neighbors.map((n) => (
            <span
              key={n}
              className="text-xs bg-gray-800 text-yellow-400 rounded px-2 py-0.5 border border-yellow-700/50"
            >
              #{n}
            </span>
          ))}
        </div>
      </div>

      <details className="text-xs text-gray-400">
        <summary className="cursor-pointer text-gray-300">Feature vector</summary>
        <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1">
          {Object.entries(transaction.features).map(([k, v]) => (
            <div key={k} className="flex justify-between">
              <span>{k}</span>
              <span className="text-gray-300">{v.toFixed(3)}</span>
            </div>
          ))}
        </div>
      </details>
    </div>
  )
}
