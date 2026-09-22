/** Minimal Fruchterman-Reingold force-directed layout — no graph-layout
 * dependency required for a few hundred nodes run once per graph fetch. */
export interface LayoutNode {
  id: number
}

export interface LayoutEdge {
  source: number
  target: number
}

export function computeForceLayout(
  nodes: LayoutNode[],
  edges: LayoutEdge[],
  width: number,
  height: number,
  iterations = 200,
): Map<number, { x: number; y: number }> {
  const area = width * height
  const k = Math.sqrt(area / Math.max(1, nodes.length))

  const pos = new Map<number, { x: number; y: number }>()
  const disp = new Map<number, { x: number; y: number }>()

  nodes.forEach((n) => {
    pos.set(n.id, {
      x: Math.random() * width,
      y: Math.random() * height,
    })
  })

  let temperature = width / 10

  for (let iter = 0; iter < iterations; iter++) {
    nodes.forEach((n) => disp.set(n.id, { x: 0, y: 0 }))

    // Repulsion between all pairs
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i]
      const pa = pos.get(a.id)!
      const da = disp.get(a.id)!

      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j]
        const pb = pos.get(b.id)!
        const db = disp.get(b.id)!

        let dx = pa.x - pb.x
        let dy = pa.y - pb.y
        let dist = Math.sqrt(dx * dx + dy * dy) || 0.01
        const force = (k * k) / dist

        dx = (dx / dist) * force
        dy = (dy / dist) * force

        da.x += dx
        da.y += dy
        db.x -= dx
        db.y -= dy
      }
    }

    // Attraction along edges
    edges.forEach((e) => {
      const pa = pos.get(e.source)
      const pb = pos.get(e.target)
      const da = disp.get(e.source)
      const db = disp.get(e.target)
      if (!pa || !pb || !da || !db) return

      let dx = pa.x - pb.x
      let dy = pa.y - pb.y
      const dist = Math.sqrt(dx * dx + dy * dy) || 0.01
      const force = (dist * dist) / k

      dx = (dx / dist) * force
      dy = (dy / dist) * force

      da.x -= dx
      da.y -= dy
      db.x += dx
      db.y += dy
    })

    // Apply displacement, capped by temperature, and keep in bounds
    nodes.forEach((n) => {
      const p = pos.get(n.id)!
      const d = disp.get(n.id)!
      const dist = Math.sqrt(d.x * d.x + d.y * d.y) || 0.01
      const capped = Math.min(dist, temperature)

      p.x += (d.x / dist) * capped
      p.y += (d.y / dist) * capped
      p.x = Math.min(width, Math.max(0, p.x))
      p.y = Math.min(height, Math.max(0, p.y))
    })

    temperature *= 0.96
  }

  return pos
}
