interface NodeSpec {
  id: string
  x: number
  y: number
  kind: 'normal' | 'fraud' | 'selected'
}

const nodes: NodeSpec[] = [
  { id: 'a', x: 40, y: 140, kind: 'normal' },
  { id: 'b', x: 110, y: 80, kind: 'normal' },
  { id: 'c', x: 110, y: 190, kind: 'normal' },
  { id: 'd', x: 190, y: 60, kind: 'selected' },
  { id: 'e', x: 190, y: 140, kind: 'fraud' },
  { id: 'f', x: 190, y: 210, kind: 'normal' },
  { id: 'g', x: 270, y: 100, kind: 'normal' },
  { id: 'h', x: 270, y: 175, kind: 'fraud' },
]

const edges: [string, string][] = [
  ['a', 'b'],
  ['a', 'c'],
  ['b', 'd'],
  ['b', 'e'],
  ['c', 'e'],
  ['c', 'f'],
  ['d', 'g'],
  ['e', 'g'],
  ['e', 'h'],
  ['f', 'h'],
]

const colors: Record<NodeSpec['kind'], string> = {
  normal: '#3E6C93',
  fraud: '#B0503F',
  selected: '#1F5F50',
}

/** Static illustrative transaction graph used in marketing surfaces (hero, sign-in). Not backed by live data. */
export default function MiniGraph({ className = '' }: { className?: string }) {
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]))

  return (
    <svg
      viewBox="0 0 320 260"
      className={className}
      role="img"
      aria-label="Illustration of transaction nodes connected in a graph, with one fraudulent and one selected node highlighted"
    >
      <g stroke="rgba(0,0,0,0.1)" strokeWidth={1.5}>
        {edges.map(([from, to]) => {
          const a = byId[from]
          const b = byId[to]
          return <line key={`${from}-${to}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} />
        })}
      </g>
      <g>
        {nodes.map((n) => (
          <circle
            key={n.id}
            cx={n.x}
            cy={n.y}
            r={n.kind === 'selected' ? 9 : 7}
            fill={colors[n.kind]}
            className={n.kind === 'fraud' ? 'node-pulse' : ''}
            stroke={n.kind === 'selected' ? '#1F5F50' : 'transparent'}
            strokeWidth={n.kind === 'selected' ? 3 : 0}
            strokeOpacity={0.5}
          />
        ))}
      </g>
    </svg>
  )
}
