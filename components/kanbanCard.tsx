'use client'

import { matchScoreColor } from '@/lib/matchScore'
import { useDraggable } from '@dnd-kit/core'

interface KanbanCardProps {
  id: string
  company: string
  role: string
  matchScore: number | null
  followUpDate: Date | null
  deadline: Date | null
}

export default function KanbanCard({ id, company, role, matchScore, followUpDate, deadline }: KanbanCardProps) {
  const dateToShow = followUpDate ?? deadline
  const dateColor = followUpDate ? '#c49a3c' : '#d46b6b'
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id })

  const style = transform ? { transform: `translate(${transform.x}px, ${transform.y}px)` } : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="bg-secondary border border-border rounded-lg p-3 flex flex-col gap-2 cursor-grab hover:border-muted-foreground transition-colors"
    >
      <div className="flex flex-col gap-0.5">
        <span className="text-[13px] font-medium text-primary">{company}</span>
        <span className="text-[11px] text-muted-foreground">{role}</span>
      </div>
      <div className="flex items-center justify-between">
        {matchScore !== null ? (
          <span style={matchScoreColor(matchScore)} className="text-[10px] font-medium px-1.5 py-0.5 rounded">
            {matchScore}% match
          </span>
        ) : (
          <span />
        )}
        {dateToShow && (
          <span className="text-[10px]" style={{ color: dateColor }}>
            {dateToShow.toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })}
          </span>
        )}
      </div>
    </div>
  )
}
