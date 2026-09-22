import type { Transaction } from '../api'

export default function PredictionCard({ transaction }: { transaction: Transaction }) {
  const isFraud = transaction.prediction === 'fraud'

  return (
    <div
      className={`rounded-lg p-4 border ${
        isFraud ? 'bg-red-950/40 border-red-700' : 'bg-blue-950/40 border-blue-700'
      }`}
    >
      <div className="text-xs text-gray-400 uppercase tracking-wide">Prediction</div>
      <div className={`text-2xl font-bold ${isFraud ? 'text-red-400' : 'text-blue-400'}`}>
        {isFraud ? 'FRAUD' : 'NORMAL'}
      </div>
      <div className="text-sm text-gray-300 mt-1">
        Confidence: {(transaction.confidence * 100).toFixed(1)}%
      </div>
    </div>
  )
}
