import type { Transaction } from '../api'

export default function PredictionCard({ transaction }: { transaction: Transaction }) {
  const isFraud = transaction.prediction === 'fraud'

  return (
    <div
      className={`rounded-lg p-4 border ${
        isFraud ? 'bg-fraud-soft border-fraud-border' : 'bg-accent-soft border-accent-border'
      }`}
    >
      <div className="text-xs text-ink-dim uppercase tracking-wide">Prediction</div>
      <div
        className={`text-2xl font-bold flex items-center gap-2 ${
          isFraud ? 'text-fraud' : 'text-accent'
        }`}
      >
        <span aria-hidden="true">{isFraud ? '⚠' : '✓'}</span>
        {isFraud ? 'FRAUD' : 'NORMAL'}
      </div>
      <div className="text-sm text-ink-dim mt-1">
        Confidence: {(transaction.confidence * 100).toFixed(1)}%
      </div>
    </div>
  )
}
