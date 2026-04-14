'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronDown } from 'lucide-react'
import CyclePill from '@/components/layout/CyclePill'
import { useCycle } from '@/lib/CycleContext'

import KanbanCard from '../../../components/kanbanCard'
import { matchScoreColor } from '@/lib/matchScore'
import { DndContext, DragEndEvent, useDroppable } from '@dnd-kit/core'
import AddJobModal from '@/components/AddJobModal'

type View = 'table' | 'kanban'
type Status = 'SAVED' | 'APPLIED' | 'PHONE_SCREEN' | 'INTERVIEW' | 'OFFER' | 'REJECTED'

interface Application {
    id: string
    company: string
    role: string
    status: Status
    matchScore: number | null
    location: string | null
    remote: boolean
    dateApplied: Date | null
    followUpDate: Date | null
    deadline: Date | null
}


const statusLabels: Record<Status, string> = {
    SAVED: 'Saved',
    APPLIED: 'Applied',
    PHONE_SCREEN: 'Screening',
    INTERVIEW: 'Interview',
    OFFER: 'Offer',
    REJECTED: 'Rejected',
}

const statusColors: Record<Status, { bg: string; text: string }> = {
    SAVED: { bg: '#232323', text: '#8d8d9a' },
    APPLIED: { bg: '#1a2d42', text: '#5ba3d9' },
    PHONE_SCREEN: { bg: '#152820', text: '#4aad8a' },
    INTERVIEW: { bg: '#1e1d3d', text: '#8b85e8' },
    OFFER: { bg: '#162208', text: '#6ab52b' },
    REJECTED: { bg: '#2d1515', text: '#e06060' },
}

const KANBAN_COLUMNS: { status: Status; label: string }[] = [
    { status: 'PHONE_SCREEN', label: 'Screening' },
    { status: 'INTERVIEW', label: 'Interview' },
    { status: 'OFFER', label: 'Offer' },
    { status: 'REJECTED', label: 'Rejected' },
]

function KanbanColumn({ status, label, children }: {
    status: Status
    label: string
    children: React.ReactNode
}) {
    const { setNodeRef, isOver } = useDroppable({ id: status })
    const cards = React.Children.count(children)
    return (
        <div
            ref={setNodeRef}
            className={`bg-secondary border rounded-xl p-3 flex flex-col gap-2 transition-colors ${isOver ? 'border-muted-foreground' : 'border-border'}`}
        >
            <div className="flex items-center justify-between mb-1">
                <span className="text-[12px] font-medium text-primary">{label}</span>
                <span className="text-[11px] text-muted-foreground">{cards}</span>
            </div>
            {children}
        </div>
    )
}

function Badge({ status }: { status: Status }) {
    const { bg, text } = statusColors[status]
    return (
        <span style={{ background: bg, color: text, fontSize: 10, fontWeight: 500, padding: '2px 7px', borderRadius: 99, whiteSpace: 'nowrap' }}>
            {statusLabels[status]}
        </span>
    )
}

const COL = '2fr 2fr 1fr 1fr 1.5fr 1fr'

export default function ApplicationsPage() {
    const { selectedCycleId } = useCycle()
    const [view, setView] = useState<View>('table')
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [applications, setApplications] = useState<Application[]>([])
    const [showModal, setShowModal] = useState(false)
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number; appId: string } | null>(null)
    const router = useRouter()

    const fetchApplications = useCallback(async () => {
        const url = selectedCycleId
            ? `/api/applications?cycleId=${selectedCycleId}`
            : '/api/applications'
        try {
            const res = await fetch(url)
            const data = await res.json()
            setApplications((data.data ?? []).map((a: Application & { dateApplied: string | null, followUpDate: string | null, deadline: string | null }) => ({
                ...a,
                dateApplied: a.dateApplied ? new Date(a.dateApplied) : null,
                followUpDate: a.followUpDate ? new Date(a.followUpDate) : null,
                deadline: a.deadline ? new Date(a.deadline) : null,
            })))
        } catch {
            // keep existing state
        }
    }, [selectedCycleId])

    useEffect(() => {
        fetchApplications()
    }, [fetchApplications])

async function handleReject(appId: string) {
    setApplications(prev => prev.map(app => app.id === appId ? { ...app, status: 'REJECTED' } : app))
    setContextMenu(null)
    await fetch(`/api/applications/${appId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'REJECTED' }),
    })
}

async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const newStatus = over.id as Status
    setApplications(prev => prev.map(app =>
        app.id === active.id ? { ...app, status: newStatus } : app
    ))
    await fetch(`/api/applications/${active.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
    })
}

const filtered = applications.filter(a => {
    const matchesSearch = search === '' ||
        a.company.toLowerCase().includes(search.toLowerCase()) ||
        a.role.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === '' || a.status === statusFilter
    return matchesSearch && matchesStatus
})

return (
    <>
        <div className="flex flex-col h-full">

            {/* Topbar */}
            <div className="h-11 border-b border-border flex items-center justify-between px-4 bg-background shrink-0">
                <div className="flex items-center gap-2">
                    <span className="text-[13px] font-medium text-primary">Applications</span>
                    <div className="flex items-center bg-secondary border border-border rounded-lg p-0.5">
                        {(['table', 'kanban'] as View[]).map(v => (
                            <button
                                key={v}
                                onClick={() => setView(v)}
                                className={`text-[11px] px-2.5 py-1 rounded-md cursor-pointer border-0 capitalize transition-colors ${view === v ? 'bg-background text-primary' : 'bg-transparent text-muted-foreground hover:text-primary'}`}
                            >
                                {v}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex gap-2 items-center">
                    <CyclePill />
                    <button onClick={() => setShowModal(true)} className="text-[12px] px-3 py-1.5 rounded-lg bg-[#534AB7] text-white cursor-pointer border-0">
                        + Add job
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">

                {view === 'table' && (
                    <>
                        {/* Filters */}
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="bg-secondary border border-border rounded-lg px-3 py-1.5 text-[12px] text-primary placeholder:text-muted-foreground outline-none w-64"
                                placeholder="Search applications..."
                            />
                            <div className="relative">
                                <select
                                    value={statusFilter}
                                    onChange={e => setStatusFilter(e.target.value)}
                                    className="bg-secondary border border-border rounded-lg px-3 py-1.5 text-[12px] text-primary appearance-none cursor-pointer pr-7 outline-none"
                                >
                                    <option value="">All statuses</option>
                                    <option value="SAVED">Saved</option>
                                    <option value="APPLIED">Applied</option>
                                    <option value="PHONE_SCREEN">Screening</option>
                                    <option value="INTERVIEW">Interview</option>
                                    <option value="OFFER">Offer</option>
                                    <option value="REJECTED">Rejected</option>
                                </select>
                                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground" size={13} />
                            </div>
                        </div>

                        {/* Table */}
                        <div className="bg-background border border-border rounded-xl overflow-hidden">
                            <div className="grid text-[11px] font-medium text-muted-foreground uppercase tracking-[0.04em] px-4 py-2.5 border-b border-border" style={{ gridTemplateColumns: COL }}>
                                <span>Company</span>
                                <span>Role</span>
                                <span>Status</span>
                                <span>Match</span>
                                <span>Location</span>
                                <span>Applied</span>
                            </div>
                            {filtered.length === 0 ? (
                                <div className="text-[12px] text-muted-foreground text-center py-10">No applications found</div>
                            ) : (
                                filtered.map((app, i) => (
                                    <div
                                        key={app.id}
                                        onClick={() => router.push(`/applications/${app.id}`)}
                                        onContextMenu={e => { e.preventDefault(); setContextMenu({ x: e.clientX, y: e.clientY, appId: app.id }) }}
                                        className={`grid items-center px-4 py-2.5 cursor-pointer hover:bg-secondary transition-colors ${i < filtered.length - 1 ? 'border-b border-border' : ''}`}
                                        style={{ gridTemplateColumns: COL }}
                                    >
                                        <span className="text-[13px] font-medium text-primary truncate">{app.company}</span>
                                        <span className="text-[12px] text-muted-foreground truncate pr-4">{app.role}</span>
                                        <span><Badge status={app.status} /></span>
                                        <span>
                                            {app.matchScore !== null ? (
                                                <span style={matchScoreColor(app.matchScore)} className="text-[10px] font-medium px-1.5 py-0.5 rounded">
                                                    {app.matchScore}%
                                                </span>
                                            ) : (
                                                <span className="text-[12px] text-muted-foreground">—</span>
                                            )}
                                        </span>
                                        <span className="text-[12px] text-muted-foreground truncate">
                                            {app.remote ? 'Remote' : (app.location ?? '—')}
                                        </span>
                                        <span className="text-[12px] text-muted-foreground">
                                            {app.dateApplied
                                                ? app.dateApplied.toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })
                                                : '—'}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </>
                )}

                {view === 'kanban' && (
                    <DndContext onDragEnd={handleDragEnd}>
                        <div className="grid grid-cols-4 gap-3 h-full">
                            {KANBAN_COLUMNS.map(({ status, label }) => {
                                const cards = status === 'REJECTED' ? [] : applications.filter(a => a.status === status)
                                return (
                                    <KanbanColumn key={status} status={status} label={label}>
                                        {cards.map(app => (
                                            <KanbanCard
                                                key={app.id}
                                                id={app.id}
                                                company={app.company}
                                                role={app.role}
                                                matchScore={app.matchScore}
                                                followUpDate={app.followUpDate}
                                                deadline={app.deadline}
                                            />
                                        ))}
                                    </KanbanColumn>
                                )
                            })}
                        </div>
                    </DndContext>
                )}

            </div>
        </div>
        {showModal && <AddJobModal onClose={() => setShowModal(false)} onAdd={fetchApplications} />}
        {contextMenu && (
            <>
                <div className="fixed inset-0 z-40" onClick={() => setContextMenu(null)} />
                <div
                    className="fixed z-50 bg-background border border-border rounded-lg shadow-xl py-1 min-w-[160px]"
                    style={{ top: contextMenu.y, left: contextMenu.x }}
                >
                    <button
                        onClick={() => handleReject(contextMenu.appId)}
                        className="w-full text-left px-3 py-1.5 text-[12px] text-[#e06060] hover:bg-secondary transition-colors cursor-pointer border-0 bg-transparent"
                    >
                        Mark as rejected
                    </button>
                </div>
            </>
        )}
    </>
)
}
