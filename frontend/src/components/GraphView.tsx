import { useMemo } from 'react'
import ReactFlow, {
  Background,
  Controls,
  type Edge,
  type Node,
} from 'reactflow'
import 'reactflow/dist/style.css'
import type { GraphData } from '../api'

interface Props {
  graph: GraphData | null
  selectedId: number | null
  neighborIds: number[]
  onSelect: (id: number) => void
}

function layoutNodes(graph: GraphData): Map<number, { x: number; y: number }> {
  const positions = new Map<number, { x: number; y: number }>()
  const n = graph.nodes.length
  const cols = Math.ceil(Math.sqrt(n))
  const spacing = 60

  graph.nodes.forEach((node, i) => {
    const row = Math.floor(i / cols)
    const col = i % cols
    positions.set(node.id, { x: col * spacing, y: row * spacing })
  })
  return positions
}

export default function GraphView({ graph, selectedId, neighborIds, onSelect }: Props) {
  const { nodes, edges } = useMemo(() => {
    if (!graph) return { nodes: [] as Node[], edges: [] as Edge[] }

    const positions = layoutNodes(graph)
    const neighborSet = new Set(neighborIds)

    const nodes: Node[] = graph.nodes.map((n) => {
      const isSelected = n.id === selectedId
      const isNeighbor = neighborSet.has(n.id)
      const baseColor = n.prediction === 'fraud' ? '#ef4444' : '#3b82f6'

      return {
        id: String(n.id),
        position: positions.get(n.id) ?? { x: 0, y: 0 },
        data: { label: '' },
        style: {
          width: isSelected ? 18 : 10,
          height: isSelected ? 18 : 10,
          borderRadius: '50%',
          background: baseColor,
          border: isSelected
            ? '3px solid #facc15'
            : isNeighbor
              ? '2px solid #facc15'
              : '1px solid rgba(255,255,255,0.2)',
          fontSize: 0,
        },
      }
    })

    const edges: Edge[] = graph.edges.map((e) => ({
      id: `${e.source}-${e.target}`,
      source: String(e.source),
      target: String(e.target),
      style: { stroke: 'rgba(255,255,255,0.08)' },
    }))

    return { nodes, edges }
  }, [graph, selectedId, neighborIds])

  if (!graph) {
    return <div className="text-gray-400 text-sm">Loading graph…</div>
  }

  return (
    <div className="w-full h-[520px] rounded-lg bg-gray-900 border border-gray-800">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodeClick={(_, node) => onSelect(Number(node.id))}
        fitView
        nodesDraggable={false}
        nodesConnectable={false}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#1f2937" gap={20} />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  )
}
