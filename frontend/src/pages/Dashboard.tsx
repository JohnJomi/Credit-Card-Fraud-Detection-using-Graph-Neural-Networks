import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getGraph, getStats, getTransaction, type GraphData, type Stats, type Transaction } from '../api'
import ArchitectureDiagram from '../components/ArchitectureDiagram'
import GraphView from '../components/GraphView'
import MetricCard from '../components/MetricCard'
import TransactionInspector from '../components/TransactionInspector'
import { useAuth } from '../lib/auth'

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [graph, setGraph] = useState<GraphData | null>(null)
  const [selected, setSelected] = useState<Transaction | null>(null)
  const { email, signOut } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    getStats().then(setStats).catch(console.error)
    getGraph().then(setGraph).catch(console.error)
  }, [])

  const handleSelect = (id: number) => {
    getTransaction(id).then(setSelected).catch(console.error)
  }

  const handleSignOut = () => {
    signOut()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-bg text-ink">
      <header className="sticky top-0 z-50 border-b border-border-soft bg-bg/90 backdrop-blur">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-sm font-semibold tracking-wide text-ink">
              FraudGraph
            </Link>
            <nav aria-label="Dashboard" className="hidden md:flex gap-6 text-sm text-ink-dim">
              <span className="text-ink">Dashboard</span>
              <a href="#architecture" className="hover:text-ink transition-colors">
                Model
              </a>
              <a href="#graph" className="hover:text-ink transition-colors">
                Graph
              </a>
              <Link to="/" className="hover:text-ink transition-colors">
                About
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-ink-dim hidden sm:inline">{email ?? 'Demo'}</span>
            <button onClick={handleSignOut} className="text-ink-dim hover:text-ink transition-colors">
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8 flex flex-col gap-8">
        <div>
          <h1 className="text-2xl font-semibold text-ink">Fraud Detection Dashboard</h1>
          <p className="text-ink-dim mt-1 max-w-2xl">
            Explore how the GNN classifies transactions using graph structure and
            neighboring transaction information.
          </p>
        </div>

        {/* METRICS */}
        <section className="flex flex-col gap-4">
          <div>
            <div className="text-xs uppercase tracking-widest text-ink-faint mb-2">Dataset</div>
            <div className="flex flex-wrap gap-3">
              <MetricCard label="Transactions" value={stats?.nodes ?? 0} />
              <MetricCard label="Fraudulent" value={stats?.fraud_transactions ?? 0} />
              <MetricCard label="Fraud Rate" value={stats?.fraud_rate ?? 0} format="percent" />
            </div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-ink-faint mb-2">Model</div>
            <div className="flex flex-wrap gap-3">
              <MetricCard label="Precision" value={stats?.precision ?? 0} format="decimal" emphasis />
              <MetricCard label="Recall" value={stats?.recall ?? 0} format="decimal" emphasis />
              <MetricCard label="F1" value={stats?.f1 ?? 0} format="decimal" emphasis />
              <MetricCard label="ROC-AUC" value={stats?.roc_auc ?? 0} format="decimal" emphasis />
            </div>
          </div>
        </section>

        {/* GRAPH + INSPECTOR */}
        <section id="graph" className="grid lg:grid-cols-[65%_35%] gap-6 items-start">
          <div>
            <div className="mb-3">
              <h2 className="text-lg font-medium text-ink">Transaction Graph</h2>
              <p className="text-sm text-ink-dim">
                Select a node to inspect its prediction and neighborhood.
              </p>
            </div>
            <GraphView
              graph={graph}
              selectedId={selected?.id ?? null}
              neighborIds={selected?.neighbors ?? []}
              onSelect={handleSelect}
            />
            <p className="text-xs text-ink-faint mt-2">
              Blue = Normal · Red = Fraud · Amber ring = selected transaction and its
              neighbors
            </p>
          </div>

          <TransactionInspector transaction={selected} />
        </section>

        {/* EXPLANATION */}
        <section className="rounded-lg border border-border bg-surface p-6">
          <h2 className="text-lg font-medium text-ink mb-2">
            Why did the GNN make this prediction?
          </h2>
          <p className="text-sm text-ink-dim max-w-2xl">
            This prediction was generated using the selected transaction's features
            together with information aggregated from its graph neighbors.
          </p>

          <div className="mt-6 flex flex-col items-center gap-2 font-mono text-sm text-ink-dim">
            <span>{selected ? `Selected Transaction #${selected.id}` : 'Selected Transaction'}</span>
            <span aria-hidden="true">+</span>
            {selected && selected.neighbors.length > 0 ? (
              <span>{selected.neighbors.map((n) => `#${n}`).join('  ')}</span>
            ) : (
              <span>Neighbor 1 · Neighbor 2 · Neighbor 3 · Neighbor 4</span>
            )}
            <span aria-hidden="true">↓</span>
            <span className="rounded border border-accent-border px-3 py-1 text-ink">
              Graph Convolution
            </span>
            <span aria-hidden="true">↓</span>
            {selected ? (
              <span className={selected.prediction === 'fraud' ? 'text-fraud' : 'text-accent'}>
                {selected.prediction.toUpperCase()}
              </span>
            ) : (
              <span className="text-ink-faint">Prediction</span>
            )}
          </div>
        </section>

        {/* ARCHITECTURE + PERFORMANCE + DATASET INFO */}
        <section id="architecture" className="grid md:grid-cols-3 gap-6">
          <details className="rounded-lg border border-border bg-surface p-5" open>
            <summary className="cursor-pointer text-sm font-medium text-ink">
              Model Architecture
            </summary>
            <div className="mt-4 flex justify-center">
              <ArchitectureDiagram compact />
            </div>
            <p className="text-xs text-ink-faint mt-4 text-center">
              2-layer Graph Convolutional Network
            </p>
          </details>

          <div className="rounded-lg border border-border bg-surface p-5">
            <h3 className="text-sm font-medium text-ink mb-4">Model Performance</h3>
            <div className="grid grid-cols-2 gap-3">
              <MetricCard label="Precision" value={stats?.precision ?? 0} format="decimal" />
              <MetricCard label="Recall" value={stats?.recall ?? 0} format="decimal" />
              <MetricCard label="F1" value={stats?.f1 ?? 0} format="decimal" />
              <MetricCard label="ROC-AUC" value={stats?.roc_auc ?? 0} format="decimal" />
            </div>
          </div>

          <div className="rounded-lg border border-border bg-surface p-5">
            <h3 className="text-sm font-medium text-ink mb-4">Dataset Information</h3>
            <dl className="text-sm flex flex-col gap-3">
              <div>
                <dt className="text-ink-faint text-xs">Dataset</dt>
                <dd className="text-ink-dim">Kaggle Credit Card Transactions</dd>
              </div>
              <div>
                <dt className="text-ink-faint text-xs">Graph</dt>
                <dd className="text-ink-dim">K-nearest-neighbor similarity graph</dd>
              </div>
              <div>
                <dt className="text-ink-faint text-xs">Task</dt>
                <dd className="text-ink-dim">Node classification</dd>
              </div>
              <div>
                <dt className="text-ink-faint text-xs">Classes</dt>
                <dd className="text-ink-dim">Normal / Fraud</dd>
              </div>
              <div>
                <dt className="text-ink-faint text-xs">Framework</dt>
                <dd className="text-ink-dim">PyTorch (graph convolution)</dd>
              </div>
            </dl>
          </div>
        </section>
      </main>
    </div>
  )
}
