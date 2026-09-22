import { useMemo, useRef, useState } from 'react'
import ReactFlow, {
  Background,
  Controls,
  type Edge,
  type Node,
  type ReactFlowInstance,
} from 'reactflow'
import 'reactflow/dist/style.css'
import type { GraphData } from '../api'
import { computeForceLayout } from '../lib/forceLayout'

interface Props {
  graph: GraphData | null
  selectedId: number | null
  neighborIds: number[]
  onSelect: (id: number) => void
}

type Filter = 'all' | 'normal' | 'fraud'

const LAYOUT_WIDTH = 900
const LAYOUT_HEIGHT = 620

export default function GraphView({ graph, selectedId, neighborIds, onSelect }: Props) {
  const [filter, setFilter] = useState<Filter>('all')
  const instanceRef = useRef<ReactFlowInstance | null>(null)

  const layout = useMemo(() => {
    if (!graph) return new Map<number, { x: number; y: number }>()
    return computeForceLayout(graph.nodes, graph.edges, LAYOUT_WIDTH, LAYOUT_HEIGHT)
  }, [graph])

  const neighborSet = useMemo(() => new Set(neighborIds), [neighborIds])

  const { nodes, edges } = useMemo(() => {
    if (!graph) return { nodes: [] as Node[], edges: [] as Edge[] }

    const visibleIds = new Set(
      graph.nodes
        .filter((n) => filter === 'all' || n.prediction === filter)
        .map((n) => n.id),
    )

    const hasSelection = selectedId !== null

    const nodes: Node[] = graph.nodes
      .filter((n) => visibleIds.has(n.id))
      .map((n) => {
        const isSelected = n.id === selectedId
        const isNeighbor = neighborSet.has(n.id)
        const isDimmed = hasSelection && !isSelected && !isNeighbor
        const baseColor = n.prediction === 'fraud' ? '#ef4444' : '#3b82f6'
        const showLabel = isSelected || isNeighbor

        return {
          id: String(n.id),
          position: layout.get(n.id) ?? { x: 0, y: 0 },
          data: { label: showLabel ? `#${n.id}` : '' },
          style: {
            width: isSelected ? 16 : isNeighbor ? 11 : 7,
            height: isSelected ? 16 : isNeighbor ? 11 : 7,
            borderRadius: '50%',
            background: baseColor,
            opacity: isDimmed ? 0.25 : 1,
            border: isSelected
              ? '3px solid #f59e0b'
              : isNeighbor
                ? '2px solid #f59e0b'
                : '1px solid rgba(255,255,255,0.15)',
            fontSize: 10,
            color: '#94a3b8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          },
        }
      })

    const edges: Edge[] = graph.edges
      .filter((e) => visibleIds.has(e.source) && visibleIds.has(e.target))
      .map((e) => {
        const touchesSelection =
          hasSelection && (e.source === selectedId || e.target === selectedId)
        return {
          id: `${e.source}-${e.target}`,
          source: String(e.source),
          target: String(e.target),
          style: {
            stroke: touchesSelection ? '#f59e0b' : 'rgba(148,163,184,0.12)',
            strokeWidth: touchesSelection ? 1.5 : 1,
          },
        }
      })

    return { nodes, edges }
  }, [graph, layout, filter, selectedId, neighborSet])

  if (!graph) {
    return (
      <div className="flex items-center justify-center h-[520px] rounded-lg border border-border bg-surface text-ink-faint text-sm">
        Loading graph…
      </div>
    )
  }

  const handleReset = () => instanceRef.current?.fitView({ padding: 0.15 })

  const handleZoomToSelected = () => {
    if (selectedId === null) return
    const node = instanceRef.current
      ?.getNodes()
      .find((n) => n.id === String(selectedId))
    if (node) {
      instanceRef.current?.setCenter(node.position.x, node.position.y, { zoom: 2, duration: 400 })
    }
  }

  return (
    <div className="rounded-lg border border-border bg-surface">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-border-soft">
        <div
          role="group"
          aria-label="Filter transactions by prediction"
          className="flex gap-1 rounded-md border border-border p-0.5"
        >
          {(['all', 'normal', 'fraud'] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
              className={`px-3 py-1 text-xs rounded capitalize transition-colors ${
                filter === f ? 'bg-accent text-white' : 'text-ink-dim hover:text-ink'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleReset}
            className="text-xs px-3 py-1.5 rounded-md border border-border text-ink-dim hover:text-ink hover:border-accent-border transition-colors"
          >
            Reset View
          </button>
          <button
            onClick={handleZoomToSelected}
            disabled={selectedId === null}
            className="text-xs px-3 py-1.5 rounded-md border border-border text-ink-dim hover:text-ink hover:border-accent-border transition-colors disabled:opacity-40 disabled:pointer-events-none"
          >
            Zoom to Selected
          </button>
        </div>
      </div>

      <div className="w-full h-[520px]">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodeClick={(_, node) => onSelect(Number(node.id))}
          onInit={(instance) => (instanceRef.current = instance)}
          fitView
          nodesDraggable={false}
          nodesConnectable={false}
          proOptions={{ hideAttribution: true }}
        >
          <Background color="#111a2b" gap={24} />
          <Controls showInteractive={false} />
        </ReactFlow>
      </div>
    </div>
  )
}
