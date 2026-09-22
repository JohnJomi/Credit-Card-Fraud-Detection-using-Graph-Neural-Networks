import { useEffect, useState } from 'react'

interface Props {
  label: string
  value: number
  format?: 'int' | 'percent' | 'decimal'
  emphasis?: boolean
  tone?: 'fraud'
}

function formatValue(value: number, format: Props['format']): string {
  if (format === 'percent') return `${(value * 100).toFixed(2)}%`
  if (format === 'decimal') return value.toFixed(2)
  return Math.round(value).toLocaleString()
}

/** Animates from 0 to the target value on mount (count-up), respecting reduced motion. */
function useCountUp(target: number, durationMs = 700) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      setValue(target)
      return
    }

    let frame: number
    const start = performance.now()

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / durationMs)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(target * eased)
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target, durationMs])

  return value
}

export default function MetricCard({
  label,
  value,
  format = 'int',
  emphasis = false,
  tone,
}: Props) {
  const animated = useCountUp(value)

  const toneClass =
    tone === 'fraud'
      ? 'border-fraud-border bg-fraud-soft'
      : emphasis
        ? 'border-accent-border bg-accent-soft'
        : 'border-border bg-surface'

  return (
    <div
      className={`flex flex-col gap-1.5 rounded-card border px-5 py-4 min-w-[104px] shadow-card ${toneClass}`}
    >
      <span className="text-lg font-semibold text-ink tabular-nums">
        {formatValue(animated, format)}
      </span>
      <span className="text-xs text-ink-dim">{label}</span>
    </div>
  )
}
