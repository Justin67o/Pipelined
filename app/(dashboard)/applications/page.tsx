'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronDown } from 'lucide-react'
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

const mockApplications: Application[] = [
    { id: 'app_1', company: 'Shopify', role: 'Software Engineer Intern', status: 'INTERVIEW', matchScore: 82, location: 'Ottawa, ON', remote: false, dateApplied: new Date('2026-03-28'), followUpDate: new Date('2026-04-09'), deadline: new Date('2026-04-30') },
    { id: 'app_2', company: 'Wealthsimple', role: 'Backend Developer Co-op', status: 'PHONE_SCREEN', matchScore: 76, location: 'Toronto, ON', remote: false, dateApplied: new Date('2026-03-25'), followUpDate: new Date('2026-04-11'), deadline: null },
    { id: 'app_3', company: 'TD Bank', role: 'Developer Intern', status: 'OFFER', matchScore: 68, location: 'Toronto, ON', remote: false, dateApplied: new Date('2026-03-20'), followUpDate: null, deadline: new Date('2026-04-15') },
    { id: 'app_4', company: 'Koho', role: 'Full Stack Co-op', status: 'INTERVIEW', matchScore: 79, location: null, remote: true, dateApplied: new Date('2026-03-18'), followUpDate: new Date('2026-04-14'), deadline: null },
    { id: 'app_5', company: 'Relay', role: 'Frontend Engineer Intern', status: 'PHONE_SCREEN', matchScore: 71, location: 'Toronto, ON', remote: false, dateApplied: new Date('2026-03-12'), followUpDate: new Date('2026-04-16'), deadline: null },
    { id: 'app_6', company: 'Google', role: 'SWE Intern', status: 'REJECTED', matchScore: 55, location: 'Waterloo, ON', remote: false, dateApplied: new Date('2026-03-15'), followUpDate: null, deadline: null },
    { id: 'app_7', company: 'Stripe', role: 'Backend Co-op', status: 'REJECTED', matchScore: 61, location: null, remote: true, dateApplied: new Date('2026-03-10'), followUpDate: null, deadline: null },
    { id: 'app_8', company: 'D2L', role: 'Software Dev Co-op', status: 'APPLIED', matchScore: 73, location: 'Kitchener, ON', remote: false, dateApplied: new Date('2026-03-08'), followUpDate: null, deadline: null },
    { id: 'app_9', company: 'Vidyard', role: 'Dev Co-op', status: 'APPLIED', matchScore: 69, location: 'Kitchener, ON', remote: false, dateApplied: new Date('2026-03-05'), followUpDate: null, deadline: null },
    { id: 'app_10', company: 'Faire', role: 'Software Engineer Co-op', status: 'SAVED', matchScore: null, location: 'Remote', remote: true, dateApplied: null, followUpDate: null, deadline: null },
    { id: 'app_11', company: 'Miovision', role: 'Backend Developer Intern', status: 'APPLIED', matchScore: 74, location: 'Waterloo, ON', remote: false, dateApplied: new Date('2026-03-22'), followUpDate: null, deadline: null },
    { id: 'app_12', company: 'OpenText', role: 'Software Dev Co-op', status: 'APPLIED', matchScore: 66, location: 'Waterloo, ON', remote: false, dateApplied: new Date('2026-03-19'), followUpDate: null, deadline: null },
]

const statusLabels: Record<Status, string> = {
    SAVED: 'Saved',
    APPLIED: 'Applied',
    PHONE_SCREEN: 'Phone screen',
    INTERVIEW: 'Interview',
    OFFER: 'Offer',
    REJECTED: 'Rejected',
}

const statusColors: Record<Status, { bg: string; text: string }> = {
    SAVED: { bg: '#F1EFE8', text: '#5F5E5A' },
    APPLIED: { bg: '#E6F1FB', text: '#185FA5' },
    PHONE_SCREEN: { bg: '#E1F5EE', text: '#085041' },
    INTERVIEW: { bg: '#EEEDFE', text: '#3C3489' },
    OFFER: { bg: '#EAF3DE', text: '#27500A' },
    REJECTED: { bg: '#FCEBEB', text: '#A32D2D' },
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
    const [view, setView] = useState<View>('table')
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [applications, setApplications] = useState(mockApplications)
    const [showModal, setShowModal] = useState(false)
    const router = useRouter()

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event
        if (!over || active.id === over.id) return
        setApplications(prev => prev.map(app =>
            app.id === active.id ? { ...app, status: over.id as Status } : app
        ))
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
                    <span className="text-[11px] bg-secondary border border-border rounded-full px-2.5 py-0.5 text-muted-foreground cursor-pointer">
                        Fall 2026 ▾
                    </span>
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
                                const cards = applications.filter(a => a.status === status)
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
        {showModal && <AddJobModal onClose={() => setShowModal(false)} />}
        </>
    )
}
