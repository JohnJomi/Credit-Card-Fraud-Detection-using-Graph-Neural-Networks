import { useEffect, useState } from 'react'
import { getStats, type Stats } from '../api'
import ArchitectureDiagram from '../components/ArchitectureDiagram'
import ButtonLink from '../components/ButtonLink'
import MetricCard from '../components/MetricCard'
import MiniGraph from '../components/MiniGraph'
import Navbar from '../components/Navbar'
import Reveal from '../components/Reveal'
import SectionHeader from '../components/SectionHeader'

const pipeline = [
  { label: 'Kaggle Dataset', detail: 'Raw credit-card transactions with anonymized features.' },
  { label: 'Preprocessing', detail: 'Clean, scale features, and separate fraud labels.' },
  { label: 'Graph Construction', detail: 'Connect similar transactions with a KNN graph.' },
  { label: 'GNN Training', detail: 'Train a 2-layer GCN with weighted loss for imbalance.' },
  { label: 'Model', detail: 'A saved, versioned checkpoint ready for inference.' },
  { label: 'FastAPI', detail: 'Serves predictions and graph data over REST.' },
  { label: 'Dashboard', detail: 'Explore the graph and inspect live predictions.' },
]

const explore = [
  {
    title: 'Explore the Graph',
    body: 'See transactions as nodes and their relationships as edges.',
  },
  {
    title: 'Inspect Predictions',
    body: "Select a transaction and inspect its fraud prediction and confidence.",
  },
  {
    title: 'Understand the Neighborhood',
    body: "See the neighboring transactions that form the selected node's graph context.",
  },
]

export default function Landing() {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    getStats().then(setStats).catch(() => setStats(null))
  }, [])

  return (
    <div className="min-h-screen bg-bg text-ink">
      <Navbar />

      {/* HERO */}
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-24 grid md:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col gap-6">
          <h1 className="text-4xl md:text-5xl font-semibold leading-tight text-ink">
            See fraud differently.
          </h1>
          <p className="text-ink-dim text-lg leading-relaxed max-w-md">
            FraudGraph uses a Graph Neural Network to detect suspicious credit-card
            transactions by learning not only from each transaction, but from the
            transactions around it.
          </p>
          <div className="flex flex-wrap gap-4">
            <ButtonLink to="/dashboard">Explore the Dashboard</ButtonLink>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center rounded-md px-5 py-2.5 text-sm font-medium text-ink-dim border border-border hover:text-ink hover:border-accent-border transition-colors"
            >
              How It Works
            </a>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="rounded-xl border border-border bg-surface p-6">
            <MiniGraph className="w-full max-w-sm" />
            <div className="flex items-center gap-4 mt-2 text-xs text-ink-faint justify-center">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-accent" /> Normal
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-fraud" /> Fraud
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-selected" /> Selected
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* THE PROBLEM */}
      <section id="how-it-works" className="mx-auto max-w-6xl px-6 py-20 border-t border-border-soft">
        <Reveal>
          <SectionHeader
            eyebrow="The Problem"
            heading="Fraud isn't always an isolated transaction."
            body="A traditional fraud detector can look at the amount, time, location, and other features of a transaction. But suspicious behavior can become more meaningful when we consider related transactions."
          />
        </Reveal>

        <div className="grid md:grid-cols-2 gap-6 mt-12">
          <Reveal className="rounded-xl border border-border bg-surface p-6">
            <div className="text-xs font-semibold uppercase tracking-widest text-ink-faint mb-4">
              Traditional ML
            </div>
            <div className="flex flex-col items-center gap-2 font-mono text-sm text-ink-dim">
              <span>Transaction A</span>
              <span aria-hidden="true">↓</span>
              <span className="rounded border border-border px-3 py-1">Model</span>
              <span aria-hidden="true">↓</span>
              <span className="text-ink">Normal / Fraud</span>
            </div>
          </Reveal>

          <Reveal className="rounded-xl border border-accent-border bg-surface p-6">
            <div className="text-xs font-semibold uppercase tracking-widest text-accent mb-4">
              Graph Neural Network
            </div>
            <div className="flex flex-col items-center gap-2 font-mono text-sm text-ink-dim">
              <span>Transaction A</span>
              <span aria-hidden="true">↓ neighbors ↓</span>
              <span>B · C · D</span>
              <span aria-hidden="true">↓</span>
              <span className="rounded border border-accent-border px-3 py-1 text-ink">GNN</span>
              <span aria-hidden="true">↓</span>
              <span className="text-ink">Fraud / Normal</span>
            </div>
          </Reveal>
        </div>

        <Reveal className="mt-8 text-center text-ink-dim max-w-2xl mx-auto">
          Instead of treating every transaction as an isolated row, a GNN can incorporate
          information from neighboring transactions.
        </Reveal>
      </section>

      {/* TABLE TO GRAPH */}
      <section className="mx-auto max-w-6xl px-6 py-20 border-t border-border-soft">
        <Reveal>
          <SectionHeader
            eyebrow="Data Representation"
            heading="Turning transactions into a graph"
            body="Our Kaggle dataset begins as tabular transaction data. We transform it into a graph that a GNN can understand."
          />
        </Reveal>

        <div className="grid md:grid-cols-2 gap-6 mt-12 items-center">
          <Reveal className="rounded-xl border border-border bg-surface p-6 font-mono text-sm text-ink-dim">
            <div className="text-ink font-semibold mb-3">Transaction row</div>
            <div className="flex flex-col gap-1">
              <span>Amount</span>
              <span>Time</span>
              <span>Features (V1…V10)</span>
              <span>Label</span>
            </div>
          </Reveal>

          <Reveal className="rounded-xl border border-accent-border bg-surface p-6 font-mono text-sm text-ink-dim">
            <div className="text-ink font-semibold mb-3">Graph neighborhood</div>
            <div className="flex flex-col gap-1">
              <span className="text-ink">● Transaction</span>
              <span className="pl-4">├── ● Similar transaction</span>
              <span className="pl-4">├── ● Similar transaction</span>
              <span className="pl-4">└── ● Similar transaction</span>
            </div>
          </Reveal>
        </div>

        <Reveal className="mt-8 flex flex-col gap-2 text-center text-ink-dim max-w-2xl mx-auto">
          <p>Each transaction becomes a node.</p>
          <p>
            Transactions with similar characteristics are connected using a
            K-nearest-neighbor graph.
          </p>
          <p>These connections allow the model to propagate information between related transactions.</p>
        </Reveal>
      </section>

      {/* WHAT IS A GNN */}
      <section className="mx-auto max-w-6xl px-6 py-20 border-t border-border-soft">
        <Reveal>
          <SectionHeader eyebrow="Concept" heading="So, what actually happens inside the GNN?" />
        </Reveal>

        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <Reveal className="rounded-xl border border-border bg-surface p-6 flex flex-col gap-4">
            <span className="text-xs text-ink-faint font-mono">Step 1</span>
            <h3 className="font-medium text-ink">Start with the transaction</h3>
            <div className="font-mono text-xs text-ink-dim flex flex-col gap-1">
              <span>Amount</span>
              <span>Time</span>
              <span>V1, V2, …</span>
            </div>
          </Reveal>

          <Reveal className="rounded-xl border border-border bg-surface p-6 flex flex-col gap-4">
            <span className="text-xs text-ink-faint font-mono">Step 2</span>
            <h3 className="font-medium text-ink">Listen to its neighbors</h3>
            <div className="font-mono text-xs text-ink-dim text-center leading-6">
              Neighbor
              <br />
              ↓<br />
              Neighbor → ● ← Neighbor
              <br />
              ↓<br />
              Neighbor
            </div>
            <p className="text-xs text-ink-dim">
              The GNN aggregates information from connected transactions.
            </p>
          </Reveal>

          <Reveal className="rounded-xl border border-border bg-surface p-6 flex flex-col gap-4">
            <span className="text-xs text-ink-faint font-mono">Step 3</span>
            <h3 className="font-medium text-ink">Make a prediction</h3>
            <div className="font-mono text-xs text-ink-dim flex flex-col items-center gap-1">
              <span>Aggregated representation</span>
              <span>↓</span>
              <span>GNN</span>
              <span>↓</span>
              <span className="rounded border border-accent-border px-2 py-1 text-ink">
                Normal / Fraud
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* MESSAGE PASSING */}
      <section className="mx-auto max-w-6xl px-6 py-20 border-t border-border-soft">
        <Reveal>
          <SectionHeader
            eyebrow="The Core Idea"
            heading="Message passing, made simple."
            body="Every node starts with its own features. During a GNN layer, it receives information from its neighbors and combines that information with what it already knows."
          />
        </Reveal>

        <Reveal className="mt-12 rounded-xl border border-border bg-surface p-8 flex flex-col items-center gap-6 font-mono text-sm text-ink-dim">
          <span>A ─ B ─ C</span>
          <span aria-hidden="true">↓</span>
          <span>A ← B → C</span>
          <span aria-hidden="true">↓</span>
          <span className="text-center">
            A + B
            <br />↓<br />
            <span className="text-ink">Updated A</span>
          </span>
        </Reveal>

        <Reveal className="mt-8 text-center text-ink-dim max-w-2xl mx-auto">
          With multiple GNN layers, information can travel across multiple hops of the graph.
        </Reveal>
      </section>

      {/* ARCHITECTURE */}
      <section id="architecture" className="mx-auto max-w-6xl px-6 py-20 border-t border-border-soft">
        <Reveal>
          <SectionHeader
            eyebrow="Model"
            heading="Under the hood"
            body="We use a two-layer Graph Convolutional Network (GCN) followed by a classification layer."
          />
        </Reveal>

        <Reveal className="mt-12 flex justify-center">
          <ArchitectureDiagram />
        </Reveal>

        <Reveal className="mt-10 max-w-xl mx-auto">
          <details className="rounded-lg border border-border bg-surface px-4 py-3">
            <summary className="cursor-pointer text-sm text-ink font-medium">
              Technical details
            </summary>
            <ul className="mt-3 text-sm text-ink-dim list-disc list-inside space-y-1">
              <li>PyTorch</li>
              <li>Graph convolution via sparse-normalized adjacency (GCN-style)</li>
              <li>Node classification</li>
              <li>KNN graph construction</li>
              <li>Train / validation / test split</li>
            </ul>
          </details>
        </Reveal>
      </section>

      {/* PIPELINE */}
      <section className="mx-auto max-w-6xl px-6 py-20 border-t border-border-soft">
        <Reveal>
          <SectionHeader eyebrow="End to End" heading="From Kaggle dataset to prediction" />
        </Reveal>

        <Reveal className="mt-12 flex flex-wrap justify-center gap-4">
          {pipeline.map((step, i) => (
            <div key={step.label} className="flex items-center gap-4">
              <div className="w-36 rounded-lg border border-border bg-surface p-3 text-center">
                <div className="text-sm font-medium text-ink">{step.label}</div>
                <div className="text-xs text-ink-faint mt-1">{step.detail}</div>
              </div>
              {i < pipeline.length - 1 && (
                <span className="text-ink-faint" aria-hidden="true">
                  →
                </span>
              )}
            </div>
          ))}
        </Reveal>
      </section>

      {/* EXPLORE */}
      <section className="mx-auto max-w-6xl px-6 py-20 border-t border-border-soft">
        <Reveal>
          <SectionHeader eyebrow="Try It" heading="Explore the model" />
        </Reveal>

        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {explore.map((card) => (
            <Reveal key={card.title}>
              <a
                href="/dashboard"
                className="block h-full rounded-xl border border-border bg-surface p-6 hover:border-accent-border transition-colors"
              >
                <h3 className="font-medium text-ink mb-2">{card.title}</h3>
                <p className="text-sm text-ink-dim">{card.body}</p>
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      {/* METRICS */}
      <section className="mx-auto max-w-6xl px-6 py-20 border-t border-border-soft">
        <Reveal>
          <SectionHeader eyebrow="Evaluation" heading="Model metrics" />
        </Reveal>

        {stats ? (
          <Reveal className="mt-10 flex flex-wrap justify-center gap-4">
            <MetricCard label="Transactions" value={stats.nodes} />
            <MetricCard label="Fraudulent" value={stats.fraud_transactions} />
            <MetricCard label="Fraud Rate" value={stats.fraud_rate} format="percent" />
            <MetricCard label="Precision" value={stats.precision} format="decimal" emphasis />
            <MetricCard label="Recall" value={stats.recall} format="decimal" emphasis />
            <MetricCard label="F1 Score" value={stats.f1} format="decimal" emphasis />
            <MetricCard label="ROC-AUC" value={stats.roc_auc} format="decimal" emphasis />
          </Reveal>
        ) : (
          <p className="text-center text-ink-faint mt-10 text-sm">
            Metrics unavailable — start the backend API to see live evaluation results.
          </p>
        )}

        <p className="text-center text-xs text-ink-faint mt-6">
          Metrics shown are from the current evaluation run.
        </p>
      </section>

      {/* FINAL CTA */}
      <section className="mx-auto max-w-6xl px-6 py-24 border-t border-border-soft text-center">
        <Reveal className="flex flex-col items-center gap-4">
          <h2 className="text-3xl font-semibold text-ink">Ready to see the graph?</h2>
          <p className="text-ink-dim max-w-md">
            Explore how a Graph Neural Network identifies suspicious transactions through
            relationships in the data.
          </p>
          <ButtonLink to="/dashboard" className="mt-2">
            Open FraudGraph
          </ButtonLink>
        </Reveal>
      </section>

      <footer className="border-t border-border-soft">
        <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col md:flex-row justify-between gap-6 text-sm text-ink-faint">
          <div>
            <div className="text-ink font-medium mb-1">FraudGraph</div>
            <p>An educational GNN-based credit card fraud detection system.</p>
          </div>
          <div className="flex gap-6">
            <a href="#how-it-works" className="hover:text-ink transition-colors">
              How It Works
            </a>
            <a href="/dashboard" className="hover:text-ink transition-colors">
              Dashboard
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-ink transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
