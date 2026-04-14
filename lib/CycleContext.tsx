'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'

export interface CoopCycle {
  id: string
  term: string
  year: number
  _count?: { applications: number }
}

interface CycleContextValue {
  cycles: CoopCycle[]
  selectedCycleId: string | null        // ephemeral view selection
  setSelectedCycleId: (id: string) => void
  activeCycleId: string | null          // persisted to DB
  setActiveCycle: (id: string) => Promise<void>
  refreshCycles: () => Promise<void>
  selectedCycle: CoopCycle | undefined
}

const CycleContext = createContext<CycleContextValue>({
  cycles: [],
  selectedCycleId: null,
  setSelectedCycleId: () => {},
  activeCycleId: null,
  setActiveCycle: async () => {},
  refreshCycles: async () => {},
  selectedCycle: undefined,
})

export function CycleProvider({ children }: { children: React.ReactNode }) {
  const [cycles, setCycles] = useState<CoopCycle[]>([])
  const [selectedCycleId, setSelectedCycleId] = useState<string | null>(null)
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)

  const refreshCycles = useCallback(async () => {
    try {
      const r = await fetch('/api/cycles')
      const data = await r.json()
      const fetched: CoopCycle[] = data.data ?? []
      const dbActive: string | null = data.activeCycleId ?? fetched[0]?.id ?? null
      setCycles(fetched)
      setActiveCycleId(dbActive)
      // Keep current selection if still valid, otherwise fall back to active
      setSelectedCycleId(prev =>
        prev && fetched.find(c => c.id === prev) ? prev : dbActive
      )
    } catch {
      // silently fail — keep existing state
    }
  }, [])

  useEffect(() => {
    refreshCycles()
  }, [refreshCycles])

  async function setActiveCycle(id: string) {
    setActiveCycleId(id)
    setSelectedCycleId(id)
    await fetch('/api/user', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ activeCycleId: id }),
    })
  }

  const selectedCycle = cycles.find(c => c.id === selectedCycleId)

  return (
    <CycleContext.Provider value={{
      cycles,
      selectedCycleId,
      setSelectedCycleId,
      activeCycleId,
      setActiveCycle,
      refreshCycles,
      selectedCycle,
    }}>
      {children}
    </CycleContext.Provider>
  )
}

export function useCycle() {
  return useContext(CycleContext)
}
