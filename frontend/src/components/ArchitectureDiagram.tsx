const layers = [
  { label: 'Input Features', detail: null },
  { label: 'GCNConv', detail: '32 hidden units' },
  { label: 'ReLU', detail: null },
  { label: 'GCNConv', detail: '16 hidden units' },
  { label: 'ReLU', detail: null },
  { label: 'Linear', detail: null },
  { label: 'Normal / Fraud', detail: null },
]

export default function ArchitectureDiagram({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-0">
      {layers.map((layer, i) => (
        <div key={layer.label} className="flex flex-col items-center">
          <div
            className={`rounded-md border px-4 py-2 text-center ${
              layer.label === 'Normal / Fraud'
                ? 'border-accent-border bg-accent-soft'
                : 'border-border bg-surface-2'
            } ${compact ? 'text-xs' : 'text-sm'}`}
          >
            <div className="font-medium text-ink">{layer.label}</div>
            {layer.detail && <div className="text-ink-faint text-xs">{layer.detail}</div>}
          </div>
          {i < layers.length - 1 && <div className="h-5 w-px bg-border" aria-hidden="true" />}
        </div>
      ))}
    </div>
  )
}
