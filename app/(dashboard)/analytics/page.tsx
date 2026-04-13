'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts'

// ─── Types ────────────────────────────────────────────────────────────────────

type Status = 'SAVED' | 'APPLIED' | 'PHONE_SCREEN' | 'INTERVIEW' | 'OFFER' | 'REJECTED'

interface Application {
  id: string
  company: string
  role: string
  status: Status
  matchScore: number | null
  dateApplied: Date | null
  createdAt: Date
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockApplications: Application[] = [
  { id: 'app_1',  company: 'Shopify',      role: 'Software Engineer Intern',  status: 'INTERVIEW',    matchScore: 82,   dateApplied: new Date('2026-03-28'), createdAt: new Date('2026-03-28') },
  { id: 'app_2',  company: 'Wealthsimple', role: 'Backend Developer Co-op',   status: 'PHONE_SCREEN', matchScore: 76,   dateApplied: new Date('2026-03-25'), createdAt: new Date('2026-03-25') },
  { id: 'app_3',  company: 'TD Bank',      role: 'Developer Intern',          status: 'OFFER',        matchScore: 68,   dateApplied: new Date('2026-03-20'), createdAt: new Date('2026-03-20') },
  { id: 'app_4',  company: 'Koho',         role: 'Full Stack Co-op',          status: 'INTERVIEW',    matchScore: 79,   dateApplied: new Date('2026-03-18'), createdAt: new Date('2026-03-18') },
  { id: 'app_5',  company: 'Relay',        role: 'Frontend Engineer Intern',  status: 'PHONE_SCREEN', matchScore: 71,   dateApplied: new Date('2026-03-12'), createdAt: new Date('2026-03-12') },
  { id: 'app_6',  company: 'Google',       role: 'SWE Intern',                status: 'REJECTED',     matchScore: 55,   dateApplied: new Date('2026-03-15'), createdAt: new Date('2026-03-15') },
  { id: 'app_7',  company: 'Stripe',       role: 'Backend Co-op',             status: 'REJECTED',     matchScore: 61,   dateApplied: new Date('2026-03-10'), createdAt: new Date('2026-03-10') },
  { id: 'app_8',  company: 'D2L',          role: 'Software Dev Co-op',        status: 'APPLIED',      matchScore: 73,   dateApplied: new Date('2026-03-08'), createdAt: new Date('2026-03-08') },
  { id: 'app_9',  company: 'Vidyard',      role: 'Dev Co-op',                 status: 'APPLIED',      matchScore: 69,   dateApplied: new Date('2026-03-05'), createdAt: new Date('2026-03-05') },
  { id: 'app_10', company: 'Faire',        role: 'Software Engineer Co-op',   status: 'SAVED',        matchScore: null, dateApplied: null,                   createdAt: new Date('2026-03-01') },
  { id: 'app_11', company: 'Miovision',    role: 'Backend Developer Intern',  status: 'APPLIED',      matchScore: 74,   dateApplied: new Date('2026-03-22'), createdAt: new Date('2026-03-22') },
  { id: 'app_12', company: 'OpenText',     role: 'Software Dev Co-op',        status: 'APPLIED',      matchScore: 66,   dateApplied: new Date('2026-03-19'), createdAt: new Date('2026-03-19') },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_ORDER: Status[] = ['SAVED', 'APPLIED', 'PHONE_SCREEN', 'INTERVIEW', 'OFFER']

const statusLabels: Record<Status, string> = {
  SAVED:        'Saved',
  APPLIED:      'Applied',
  PHONE_SCREEN: 'Phone screen',
  INTERVIEW:    'Interview',
  OFFER:        'Offer',
  REJECTED:     'Rejected',
}

const funnelColors: Record<string, string> = {
  Saved:          '#18202e',
  Applied:        '#1d1840',
  'Phone screen': '#0d2318',
  Interview:      '#1d1840',
  Offer:          '#142108',
}

const funnelTextColors: Record<string, string> = {
  Saved:          '#6d9ed5',
  Applied:        '#8b80df',
  'Phone screen': '#50a07a',
  Interview:      '#8b80df',
  Offer:          '#74b34e',
}

function computeFunnel(apps: Application[]) {
  return STATUS_ORDER.map(status => ({
    name: statusLabels[status],
    count: apps.filter(a => a.status === status).length,
  }))
}

function computeResponseRate(apps: Application[]) {
  const applied = apps.filter(a => a.dateApplied)
  if (applied.length === 0) return []

  const byWeek: Record<string, { applied: number; responded: number }> = {}

  applied.forEach(app => {
    const d = app.dateApplied!
    const week = `Week ${Math.ceil(d.getDate() / 7)} Mar`
    if (!byWeek[week]) byWeek[week] = { applied: 0, responded: 0 }
    byWeek[week].applied++
    if (['PHONE_SCREEN', 'INTERVIEW', 'OFFER', 'REJECTED'].includes(app.status)) {
      byWeek[week].responded++
    }
  })

  return Object.entries(byWeek).map(([week, { applied, responded }]) => ({
    week,
    rate: Math.round((responded / applied) * 100),
  }))
}

function computeStats(apps: Application[]) {
  const total = apps.length
  const applied = apps.filter(a => a.dateApplied).length
  const responded = apps.filter(a =>
    ['PHONE_SCREEN', 'INTERVIEW', 'OFFER', 'REJECTED'].includes(a.status)
  ).length
  const responseRate = applied > 0 ? Math.round((responded / applied) * 100) : 0
  const scores = apps.map(a => a.matchScore).filter(Boolean) as number[]
  const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0
  return { total, responseRate, avgScore }
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-secondary rounded-lg px-3.5 py-3">
      <div className="text-[11px] text-muted-foreground mb-1">{label}</div>
      <div className="text-[20px] font-medium text-primary">{value}</div>
    </div>
  )
}

// ─── Section Card ─────────────────────────────────────────────────────────────

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-background border border-border rounded-xl p-4">
      <div className="text-[11px] font-medium text-muted-foreground uppercase tracking-[0.04em] mb-3.5">
        {title}
      </div>
      {children}
    </div>
  )
}

// ─── Analytics Page ───────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const stats = computeStats(mockApplications)
  const funnelData = computeFunnel(mockApplications)
  const responseRateData = computeResponseRate(mockApplications)
  const maxCount = Math.max(...funnelData.map(d => d.count))

  return (
    <div className="flex flex-col h-full">

      {/* Topbar */}
      <div className="h-11 border-b border-border flex items-center justify-between px-4 bg-background shrink-0">
        <span className="text-[13px] font-medium text-primary">Analytics</span>
        <span className="text-[11px] bg-secondary border border-border rounded-full px-2.5 py-0.5 text-muted-foreground cursor-pointer">
          Fall 2026 ▾
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3.5">

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2">
          <StatCard label="Total applications" value={String(stats.total)} />
          <StatCard label="Response rate" value={`${stats.responseRate}%`} />
          <StatCard label="Avg. match score" value={String(stats.avgScore)} />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-2 gap-3">

          {/* Funnel */}
          <SectionCard title="Application funnel">
            {funnelData.map(({ name, count }) => {
              const pct = maxCount > 0 ? Math.round((count / maxCount) * 100) : 0
              return (
                <div key={name} className="mb-2.5">
                  <div className="flex justify-between text-[11px] text-muted-foreground mb-1">
                    <span>{name}</span>
                    <span>{count}</span>
                  </div>
                  <div style={{
                    width: `${Math.max(pct, 6)}%`,
                    background: funnelColors[name] ?? '#18202e',
                    borderRadius: 6,
                    height: 26,
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 10px',
                    fontSize: 11,
                    fontWeight: 500,
                    color: funnelTextColors[name] ?? '#6d9ed5',
                    minWidth: 36,
                  }}>
                    {count > 0 ? `${pct}%` : '—'}
                  </div>
                </div>
              )
            })}
          </SectionCard>

          {/* Response Rate Over Time */}
          <SectionCard title="Response rate over time">
            {responseRateData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={responseRateData} margin={{ top: 4, right: 8, bottom: 4, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis
                    dataKey="week"
                    tick={{ fontSize: 10, fill: 'var(--color-muted-foreground)' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: 'var(--color-muted-foreground)' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={v => `${v}%`}
                  />
                  <Tooltip
                    formatter={(v) => [`${v}%`, 'Response rate']}
                    contentStyle={{
                      fontSize: 11,
                      background: 'var(--color-background)',
                      border: '0.5px solid var(--color-border)',
                      borderRadius: 8,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="rate"
                    stroke="#534AB7"
                    strokeWidth={1.5}
                    dot={{ r: 3, fill: '#534AB7' }}
                    activeDot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-[12px] text-tertiary text-center py-10">
                Not enough data yet
              </div>
            )}
          </SectionCard>

        </div>

        {/* Match Score Distribution */}
        <SectionCard title="Match score distribution">
          <ResponsiveContainer width="100%" height={180}>
            <BarChart
              data={[
                { range: '0–20',   count: mockApplications.filter(a => a.matchScore !== null && a.matchScore <= 20).length },
                { range: '21–40',  count: mockApplications.filter(a => a.matchScore !== null && a.matchScore > 20 && a.matchScore <= 40).length },
                { range: '41–60',  count: mockApplications.filter(a => a.matchScore !== null && a.matchScore > 40 && a.matchScore <= 60).length },
                { range: '61–80',  count: mockApplications.filter(a => a.matchScore !== null && a.matchScore > 60 && a.matchScore <= 80).length },
                { range: '81–100', count: mockApplications.filter(a => a.matchScore !== null && a.matchScore > 80).length },
              ]}
              margin={{ top: 4, right: 8, bottom: 4, left: -20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis
                dataKey="range"
                tick={{ fontSize: 10, fill: 'var(--color-muted-foreground)' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: 'var(--color-muted-foreground)' }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip
                formatter={(v) => [v, 'Applications']}
                contentStyle={{
                  fontSize: 11,
                  background: 'var(--color-background)',
                  border: '0.5px solid var(--color-border)',
                  borderRadius: 8,
                }}
              />
              <Bar dataKey="count" fill="#534AB7" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>

      </div>
    </div>
  )
}
