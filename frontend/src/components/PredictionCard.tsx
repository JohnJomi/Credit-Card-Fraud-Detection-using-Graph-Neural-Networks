import { useEffect, useState } from 'react'
import type { Transaction } from '../api'

export default function PredictionCard({ transaction }: { transaction: Transaction }) {
  const isFraud = transaction.prediction === 'fraud'
  const [barWidth, setBarWidth] = useState(0)

  useEffect(() => {
    setBarWidth(0)
    const frame = requestAnimationFrame(() => setBarWidth(transaction.confidence * 100))
    return () => cancelAnimationFrame(frame)
  }, [transaction.id, transaction.confidence])

  return (
    <div
      className={`rounded-card p-5 border ${
        isFraud ? 'bg-fraud-soft border-fraud-border' : 'bg-normal-soft border-normal-border'
      }`}
    >
      <div className="text-xs text-ink-dim uppercase tracking-wide">Prediction</div>
      <div
        className={`text-2xl font-semibold flex items-center gap-2 mt-1 ${
          isFraud ? 'text-fraud' : 'text-normal'
        }`}
      >
        <span aria-hidden="true">{isFraud ? '⚠' : '✓'}</span>
        {isFraud ? 'FRAUD' : 'NORMAL'}
      </div>

      <div className="text-sm text-ink-dim mt-3">
        Confidence: {(transaction.confidence * 100).toFixed(1)}%
      </div>
      <div className="h-1.5 rounded-full bg-black/[0.07] mt-2 overflow-hidden">
        <div
          className={`h-full rounded-full transition-[width] duration-700 ease-out ${
            isFraud ? 'bg-fraud' : 'bg-normal'
          }`}
          style={{ width: `${barWidth}%` }}
        />
      </div>
    </div>
  )
}
