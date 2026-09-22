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
  const [hoveredId, setHoveredId] = useState<number | null>(null)
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
        const isHovered = n.id === hoveredId
        const isDimmed = hasSelection && !isSelected && !isNeighbor
        const baseColor = n.prediction === 'fraud' ? '#B0503F' : '#4C7A5E'
        const haloColor =
          n.prediction === 'fraud' ? 'rgba(176,80,63,0.2)' : 'rgba(76,122,94,0.2)'
        const showLabel = isSelected || isNeighbor || isHovered
        const baseSize = isSelected ? 16 : isNeighbor ? 11 : 7
        const size = isHovered ? baseSize * 1.12 : baseSize

        return {
          id: String(n.id),
          position: layout.get(n.id) ?? { x: 0, y: 0 },
          data: { label: showLabel ? `#${n.id}` : '' },
          // NOTE: do not set `transform` here — ReactFlow positions nodes via
          // its own inline `transform: translate(...)` on this same element,
          // and a transform in `style` overwrites (rather than composes with)
          // that positioning transform, scattering every node's placement.
          style: {
            width: size,
            height: size,
            borderRadius: '50%',
            background: baseColor,
            opacity: isDimmed ? 0.3 : 1,
            border: isSelected
              ? '3px solid #A8763E'
              : isNeighbor
                ? '2px solid #A8763E'
                : '1px solid rgba(0,0,0,0.08)',
            filter: `drop-shadow(0 2px 5px ${haloColor})`,
            transition: 'width 140ms ease-out, height 140ms ease-out, opacity 200ms ease-out',
            fontSize: 10,
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          },
        }
      })

    const edges: Edge[] = graph.edges
      .filter((e) => visibleIds.has(e.source) && visibleIds.has(e.target))
      .map((e) => {
        const touchesSelection =
          hasSelection && (e.source === selectedId || e.target === selectedId)
        const touchesHover =
          hoveredId !== null && (e.source === hoveredId || e.target === hoveredId)
        return {
          id: `${e.source}-${e.target}`,
          source: String(e.source),
          target: String(e.target),
          style: {
            stroke: touchesSelection || touchesHover ? '#A8763E' : 'rgba(0,0,0,0.08)',
            strokeWidth: touchesSelection || touchesHover ? 1.5 : 1,
            transition: 'stroke 140ms ease-out',
          },
        }
      })

    return { nodes, edges }
  }, [graph, layout, filter, selectedId, neighborSet, hoveredId])

  if (!graph) {
    return (
      <div className="flex items-center justify-center h-[520px] rounded-large border border-border bg-surface text-ink-faint text-sm shadow-card">
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
    <div className="rounded-large border border-border bg-surface shadow-card overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-border-soft">
        <div
          role="group"
          aria-label="Filter transactions by prediction"
          className="flex gap-1 rounded-full border border-border p-1"
        >
          {(['all', 'normal', 'fraud'] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
              className={`px-3 py-1 text-xs rounded-full capitalize transition-colors duration-200 ${
                filter === f ? 'bg-dark text-white' : 'text-ink-dim hover:text-ink'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleReset}
            className="text-xs px-3 py-1.5 rounded-full border border-border bg-white/65 text-ink-dim hover:text-ink hover:bg-white hover:border-border-hover transition-colors duration-200"
          >
            Reset View
          </button>
          <button
            onClick={handleZoomToSelected}
            disabled={selectedId === null}
            className="text-xs px-3 py-1.5 rounded-full border border-border bg-white/65 text-ink-dim hover:text-ink hover:bg-white hover:border-border-hover transition-colors duration-200 disabled:opacity-40 disabled:pointer-events-none"
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
          onNodeMouseEnter={(_, node) => setHoveredId(Number(node.id))}
          onNodeMouseLeave={() => setHoveredId(null)}
          onInit={(instance) => (instanceRef.current = instance)}
          fitView
          nodesDraggable={false}
          nodesConnectable={false}
          proOptions={{ hideAttribution: true }}
        >
          <Background color="#e4e5e3" gap={24} />
          <Controls showInteractive={false} />
        </ReactFlow>
      </div>
    </div>
  )
}
