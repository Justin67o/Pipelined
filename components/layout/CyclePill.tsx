'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useCycle } from '@/lib/CycleContext'

export default function CyclePill() {
  const { cycles, selectedCycleId, setSelectedCycleId, selectedCycle } = useCycle()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(p => !p)}
        className="flex items-center gap-1 text-[11px] bg-secondary border border-border rounded-full px-2.5 py-0.5 text-muted-foreground cursor-pointer hover:text-primary transition-colors"
      >
        {selectedCycle ? `${selectedCycle.term} ${selectedCycle.year}` : 'Select cycle'}
        <ChevronDown size={11} />
      </button>
      {open && cycles.length > 0 && (
        <div className="absolute right-0 top-full mt-1 z-20 bg-background border border-border rounded-xl py-1 min-w-[140px]">
          {cycles.map(cycle => (
            <button
              key={cycle.id}
              onClick={() => { setSelectedCycleId(cycle.id); setOpen(false) }}
              className={`w-full text-left px-3 py-1.5 text-[12px] cursor-pointer hover:bg-secondary transition-colors ${
                cycle.id === selectedCycleId ? 'text-primary font-medium' : 'text-muted-foreground'
              }`}
            >
              {cycle.term} {cycle.year}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
