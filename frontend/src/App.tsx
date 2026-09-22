import { useEffect, useState } from 'react'
import { getGraph, getStats, getTransaction, type GraphData, type Stats, type Transaction } from './api'
import GraphView from './components/GraphView'
import StatsPanel from './components/StatsPanel'
import TransactionPanel from './components/TransactionPanel'

export default function App() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [graph, setGraph] = useState<GraphData | null>(null)
  const [selected, setSelected] = useState<Transaction | null>(null)

  useEffect(() => {
    getStats().then(setStats).catch(console.error)
    getGraph().then(setGraph).catch(console.error)
  }, [])

  const handleSelect = (id: number) => {
    getTransaction(id).then(setSelected).catch(console.error)
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Fraud GNN Dashboard</h1>
        <p className="text-sm text-gray-400 mt-1">
          Credit card transactions modeled as a graph — a Graph Convolutional Network
          classifies each node using its own features and its neighbors' features.
        </p>
      </header>

      <section className="mb-6">
        <StatsPanel stats={stats} />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <GraphView
            graph={graph}
            selectedId={selected?.id ?? null}
            neighborIds={selected?.neighbors ?? []}
            onSelect={handleSelect}
          />
          <p className="text-xs text-gray-500 mt-2">
            Blue = normal · Red = fraud · Yellow ring = selected transaction and its neighbors
          </p>
        </div>
        <div>
          <TransactionPanel transaction={selected} />
        </div>
      </section>
    </div>
  )
}
