'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import CyclePill from '@/components/layout/CyclePill'
import { useCycle } from '@/lib/CycleContext'

// ─── Types (mirror Prisma schema exactly) ────────────────────────────────────

type Status = 'SAVED' | 'APPLIED' | 'PHONE_SCREEN' | 'INTERVIEW' | 'OFFER' | 'REJECTED'
type ActivityType = 'STATUS_CHANGE' | 'NOTE_ADDED' | 'REMINDER_SET'

interface Activity {
  id: string
  applicationId: string
  type: ActivityType
  description: string
  createdAt: Date
}

interface Application {
  id: string
  userId: string
  cycleId: string | null
  company: string
  role: string
  jobUrl: string | null
  status: Status
  matchScore: number | null
  matchedSkills: string[]
  missingSkills: string[]
  salary: string | null
  location: string | null
  remote: boolean
  dateApplied: Date | null
  deadline: Date | null
  followUpDate: Date | null
  reminderSent: boolean
  jobDescription: string | null
  activities: Activity[]
  createdAt: Date
  updatedAt: Date
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const KANBAN_STATUSES: Status[] = ['PHONE_SCREEN', 'INTERVIEW', 'OFFER']

const statusColors: Record<Status, { bg: string; text: string }> = {
  SAVED:        { bg: '#232323', text: '#8d8d9a' },
  APPLIED:      { bg: '#1a2d42', text: '#5ba3d9' },
  PHONE_SCREEN: { bg: '#152820', text: '#4aad8a' },
  INTERVIEW:    { bg: '#1e1d3d', text: '#8b85e8' },
  OFFER:        { bg: '#162208', text: '#6ab52b' },
  REJECTED:     { bg: '#2d1515', text: '#e06060' },
}

const statusLabels: Record<Status, string> = {
  SAVED:        'Saved',
  APPLIED:      'Applied',
  PHONE_SCREEN: 'Screening',
  INTERVIEW:    'Interview',
  OFFER:        'Offer',
  REJECTED:     'Rejected',
}

const activityDotColors: Record<ActivityType, string> = {
  STATUS_CHANGE: '#7F77DD',
  NOTE_ADDED:    '#888780',
  REMINDER_SET:  '#EF9F27',
}

function formatDate(date: Date | null): string {
  if (!date) return '—'
  return date.toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' })
}

function timeAgo(date: Date): string {
  const diff = Date.now() - date.getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  return `${days} days ago`
}

function getNextDate(app: Application): Date | null {
  return app.followUpDate ?? app.deadline ?? null
}

// ─── Computed Stats ───────────────────────────────────────────────────────────

function computeStats(apps: Application[]) {
  const total = apps.length
  const responded = apps.filter(a =>
    ['PHONE_SCREEN', 'INTERVIEW', 'OFFER', 'REJECTED'].includes(a.status)
  ).length
  const responseRate = total > 0 ? Math.round((responded / total) * 100) : 0
  const active = apps.filter(a => KANBAN_STATUSES.includes(a.status)).length
  const offers = apps.filter(a => a.status === 'OFFER').length
  return { total, responseRate, active, offers }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Badge({ status }: { status: Status }) {
  const { bg, text } = statusColors[status]
  return (
    <span style={{ background: bg, color: text, fontSize: 10, fontWeight: 500, padding: '2px 7px', borderRadius: 99, whiteSpace: 'nowrap' }}>
      {statusLabels[status]}
    </span>
  )
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-secondary rounded-lg px-3.5 py-3">
      <div className="text-[11px] text-muted-foreground mb-1">{label}</div>
      <div className="text-[20px] font-medium text-primary">{value}</div>
      {sub && <div className="text-[11px] text-tertiary mt-0.5">{sub}</div>}
    </div>
  )
}

// ─── Dashboard Page ───────────────────────────────────────────────────────────

export default function DashboardPage() {
  const router = useRouter()
  const { selectedCycleId } = useCycle()
  const [applications, setApplications] = useState<Application[]>([])

  const fetchApplications = useCallback(async () => {
    const url = selectedCycleId
      ? `/api/applications?cycleId=${selectedCycleId}`
      : '/api/applications'
    try {
      const res = await fetch(url)
      const data = await res.json()
      setApplications((data.data ?? []).map((a: Application & { dateApplied: string | null, deadline: string | null, followUpDate: string | null, createdAt: string, updatedAt: string, activities: (Activity & { createdAt: string })[] }) => ({
        ...a,
        dateApplied: a.dateApplied ? new Date(a.dateApplied) : null,
        deadline: a.deadline ? new Date(a.deadline) : null,
        followUpDate: a.followUpDate ? new Date(a.followUpDate) : null,
        createdAt: new Date(a.createdAt),
        updatedAt: new Date(a.updatedAt),
        activities: a.activities.map(act => ({ ...act, createdAt: new Date(act.createdAt) })),
      })))
    } catch {}
  }, [selectedCycleId])

  useEffect(() => {
    fetchApplications()
  }, [fetchApplications])

  const stats = computeStats(applications)

  const activePipeline = applications
    .filter((a: Application) => KANBAN_STATUSES.includes(a.status))
    .sort((a: Application, b: Application) => {
      const aDate = getNextDate(a)
      const bDate = getNextDate(b)
      if (!aDate && !bDate) return 0
      if (!aDate) return 1
      if (!bDate) return -1
      return aDate.getTime() - bDate.getTime()
    })

  const recentActivity = applications
    .flatMap((a: Application) => a.activities.map((act: Activity) => ({ ...act, company: a.company })))
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 10)

  return (
    <div className="flex flex-col h-full">

      {/* Topbar */}
      <div className="h-11 border-b border-border flex items-center justify-between px-4 bg-background shrink-0">
        <span className="text-[13px] font-medium text-primary">Dashboard</span>
        <CyclePill />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3.5">

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-2">
          <StatCard label="Total applications" value={String(stats.total)} sub="this cycle" />
          <StatCard label="Response rate" value={`${stats.responseRate}%`} sub={`${stats.total} applied`} />
          <StatCard label="Active on kanban" value={String(stats.active)} sub="live opportunities" />
          <StatCard label="Offers" value={String(stats.offers)} sub={stats.offers > 0 ? 'pending decision' : 'none yet'} />
        </div>

        {/* Two column grid */}
        <div className="grid gap-3" style={{ gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)' }}>

          {/* Active Pipeline */}
          <div className="bg-background border border-border rounded-xl p-3.5">
            <div className="text-[11px] font-medium text-muted-foreground uppercase tracking-[0.04em] mb-2.5">
              Active pipeline
            </div>

            {activePipeline.length === 0 && (
              <div className="text-[12px] text-tertiary text-center py-5">
                No active applications yet
              </div>
            )}

            {activePipeline.map(app => {
              const nextDate = getNextDate(app)
              return (
                <div key={app.id} onClick={() => router.push(`/applications/${app.id}`)} className="bg-background border border-border rounded-lg px-3 py-2.5 flex items-center justify-between mb-1.5 cursor-pointer">
                  <div>
                    <div className="text-[12px] font-medium text-primary">{app.company}</div>
                    <div className="text-[11px] text-muted-foreground">{app.role}</div>
                  </div>
                  <div className="text-right">
                    <Badge status={app.status} />
                    {nextDate && (
                      <div className="text-[10px] text-tertiary mt-0.5">
                        {formatDate(nextDate)}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Recent Activity */}
          <div className="bg-background border border-border rounded-xl p-3.5">
            <div className="text-[11px] font-medium text-muted-foreground uppercase tracking-[0.04em] mb-2.5">
              Recent activity
            </div>

            {recentActivity.length === 0 && (
              <div className="text-[12px] text-tertiary text-center py-5">
                No activity yet
              </div>
            )}

            {recentActivity.map(act => (
              <div key={act.id} className="flex items-start gap-2 py-1.5 border-b border-border">
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: activityDotColors[act.type], marginTop: 4, flexShrink: 0 }} />
                <div>
                  <div className="text-[12px] text-primary">
                    {act.company} — {act.description}
                  </div>
                  <div className="text-[10px] text-tertiary">
                    {timeAgo(act.createdAt)}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}
