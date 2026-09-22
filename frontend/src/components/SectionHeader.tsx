interface Props {
  eyebrow?: string
  heading: string
  body?: string
  align?: 'left' | 'center'
}

export default function SectionHeader({ eyebrow, heading, body, align = 'center' }: Props) {
  const alignClass = align === 'center' ? 'items-center text-center mx-auto' : 'items-start text-left'

  return (
    <div className={`flex flex-col gap-3 max-w-2xl ${alignClass}`}>
      {eyebrow && (
        <span className="text-xs font-semibold uppercase tracking-widest text-ink-faint">
          {eyebrow}
        </span>
      )}
      <h2 className="text-2xl md:text-3xl font-semibold text-ink tracking-tight">{heading}</h2>
      {body && <p className="text-ink-dim leading-relaxed">{body}</p>}
    </div>
  )
}
