'use client'

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
  notes: string | null
  activities: Activity[]
  createdAt: Date
  updatedAt: Date
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockApplications: Application[] = [
  {
    id: 'app_1',
    userId: 'user_1',
    cycleId: 'cycle_1',
    company: 'Shopify',
    role: 'Software Engineer Intern',
    jobUrl: 'https://jobs.lever.co/shopify/abc123',
    status: 'INTERVIEW',
    matchScore: 82,
    matchedSkills: ['React', 'TypeScript', 'REST APIs', 'PostgreSQL', 'Next.js'],
    missingSkills: ['Go', 'Kubernetes', 'gRPC'],
    salary: '$52,000',
    location: 'Ottawa, ON',
    remote: false,
    dateApplied: new Date('2026-03-28'),
    deadline: new Date('2026-04-30'),
    followUpDate: new Date('2026-04-09'),
    reminderSent: false,
    jobDescription: null,
    notes: 'Round 1 was two pointer problems, felt good.',
    activities: [
      {
        id: 'act_1',
        applicationId: 'app_1',
        type: 'STATUS_CHANGE',
        description: 'Status changed to Interview',
        createdAt: new Date('2026-04-05'),
      },
      {
        id: 'act_2',
        applicationId: 'app_1',
        type: 'NOTE_ADDED',
        description: 'Round 1 technical was LeetCode mediums...',
        createdAt: new Date('2026-04-05'),
      },
    ],
    createdAt: new Date('2026-03-28'),
    updatedAt: new Date('2026-04-05'),
  },
  {
    id: 'app_2',
    userId: 'user_1',
    cycleId: 'cycle_1',
    company: 'Wealthsimple',
    role: 'Backend Developer Co-op',
    jobUrl: null,
    status: 'PHONE_SCREEN',
    matchScore: 76,
    matchedSkills: ['Node.js', 'PostgreSQL', 'REST APIs'],
    missingSkills: ['Ruby', 'Redis'],
    salary: '$48,000',
    location: 'Toronto, ON',
    remote: false,
    dateApplied: new Date('2026-03-25'),
    deadline: null,
    followUpDate: new Date('2026-04-11'),
    reminderSent: false,
    jobDescription: null,
    notes: null,
    activities: [
      {
        id: 'act_3',
        applicationId: 'app_2',
        type: 'STATUS_CHANGE',
        description: 'Status changed to Phone screen',
        createdAt: new Date('2026-04-03'),
      },
    ],
    createdAt: new Date('2026-03-25'),
    updatedAt: new Date('2026-04-03'),
  },
  {
    id: 'app_3',
    userId: 'user_1',
    cycleId: 'cycle_1',
    company: 'TD Bank',
    role: 'Developer Intern',
    jobUrl: 'https://td.wd3.myworkdayjobs.com/abc',
    status: 'OFFER',
    matchScore: 68,
    matchedSkills: ['Java', 'SQL', 'REST APIs'],
    missingSkills: ['Spring Boot'],
    salary: '$45,000',
    location: 'Toronto, ON',
    remote: false,
    dateApplied: new Date('2026-03-20'),
    deadline: new Date('2026-04-15'),
    followUpDate: null,
    reminderSent: false,
    jobDescription: null,
    notes: null,
    activities: [
      {
        id: 'act_4',
        applicationId: 'app_3',
        type: 'STATUS_CHANGE',
        description: 'Status changed to Offer',
        createdAt: new Date('2026-04-02'),
      },
    ],
    createdAt: new Date('2026-03-20'),
    updatedAt: new Date('2026-04-02'),
  },
  {
    id: 'app_4',
    userId: 'user_1',
    cycleId: 'cycle_1',
    company: 'Koho',
    role: 'Full Stack Co-op',
    jobUrl: null,
    status: 'INTERVIEW',
    matchScore: 79,
    matchedSkills: ['React', 'Node.js', 'PostgreSQL'],
    missingSkills: ['React Native'],
    salary: null,
    location: 'Remote',
    remote: true,
    dateApplied: new Date('2026-03-18'),
    deadline: null,
    followUpDate: new Date('2026-04-14'),
    reminderSent: false,
    jobDescription: null,
    notes: null,
    activities: [
      {
        id: 'act_5',
        applicationId: 'app_4',
        type: 'STATUS_CHANGE',
        description: 'Status changed to Interview',
        createdAt: new Date('2026-04-04'),
      },
      {
        id: 'act_6',
        applicationId: 'app_4',
        type: 'NOTE_ADDED',
        description: 'Koho — note added',
        createdAt: new Date('2026-04-06'),
      },
    ],
    createdAt: new Date('2026-03-18'),
    updatedAt: new Date('2026-04-04'),
  },
  {
    id: 'app_5',
    userId: 'user_1',
    cycleId: 'cycle_1',
    company: 'Relay',
    role: 'Frontend Engineer Intern',
    jobUrl: null,
    status: 'PHONE_SCREEN',
    matchScore: 71,
    matchedSkills: ['React', 'TypeScript'],
    missingSkills: ['Vue', 'GraphQL'],
    salary: null,
    location: 'Toronto, ON',
    remote: false,
    dateApplied: new Date('2026-03-12'),
    deadline: null,
    followUpDate: new Date('2026-04-16'),
    reminderSent: false,
    jobDescription: null,
    notes: null,
    activities: [
      {
        id: 'act_7',
        applicationId: 'app_5',
        type: 'STATUS_CHANGE',
        description: 'Status changed to Phone screen',
        createdAt: new Date('2026-04-01'),
      },
    ],
    createdAt: new Date('2026-03-12'),
    updatedAt: new Date('2026-04-01'),
  },
  {
    id: 'app_6',
    userId: 'user_1',
    cycleId: 'cycle_1',
    company: 'Google',
    role: 'SWE Intern',
    jobUrl: null,
    status: 'REJECTED',
    matchScore: 55,
    matchedSkills: ['Python', 'SQL'],
    missingSkills: ['C++', 'Distributed Systems'],
    salary: null,
    location: 'Waterloo, ON',
    remote: false,
    dateApplied: new Date('2026-03-15'),
    deadline: null,
    followUpDate: null,
    reminderSent: false,
    jobDescription: null,
    notes: null,
    activities: [
      {
        id: 'act_8',
        applicationId: 'app_6',
        type: 'STATUS_CHANGE',
        description: 'Status changed to Rejected',
        createdAt: new Date('2026-04-03'),
      },
    ],
    createdAt: new Date('2026-03-15'),
    updatedAt: new Date('2026-04-03'),
  },
  {
    id: 'app_7',
    userId: 'user_1',
    cycleId: 'cycle_1',
    company: 'Stripe',
    role: 'Backend Co-op',
    jobUrl: null,
    status: 'REJECTED',
    matchScore: 61,
    matchedSkills: ['Node.js', 'REST APIs'],
    missingSkills: ['Ruby', 'Go'],
    salary: null,
    location: 'Remote',
    remote: true,
    dateApplied: new Date('2026-03-10'),
    deadline: null,
    followUpDate: null,
    reminderSent: false,
    jobDescription: null,
    notes: null,
    activities: [
      {
        id: 'act_9',
        applicationId: 'app_7',
        type: 'STATUS_CHANGE',
        description: 'Status changed to Rejected',
        createdAt: new Date('2026-03-30'),
      },
    ],
    createdAt: new Date('2026-03-10'),
    updatedAt: new Date('2026-03-30'),
  },
  {
    id: 'app_8',
    userId: 'user_1',
    cycleId: 'cycle_1',
    company: 'D2L',
    role: 'Software Dev Co-op',
    jobUrl: null,
    status: 'APPLIED',
    matchScore: 73,
    matchedSkills: ['React', 'TypeScript', 'REST APIs'],
    missingSkills: ['Angular'],
    salary: null,
    location: 'Kitchener, ON',
    remote: false,
    dateApplied: new Date('2026-03-08'),
    deadline: null,
    followUpDate: null,
    reminderSent: false,
    jobDescription: null,
    notes: null,
    activities: [],
    createdAt: new Date('2026-03-08'),
    updatedAt: new Date('2026-03-08'),
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

const KANBAN_STATUSES: Status[] = ['PHONE_SCREEN', 'INTERVIEW', 'OFFER']

const statusColors: Record<Status, { bg: string; text: string }> = {
  SAVED:        { bg: '#F1EFE8', text: '#5F5E5A' },
  APPLIED:      { bg: '#E6F1FB', text: '#185FA5' },
  PHONE_SCREEN: { bg: '#E1F5EE', text: '#085041' },
  INTERVIEW:    { bg: '#EEEDFE', text: '#3C3489' },
  OFFER:        { bg: '#EAF3DE', text: '#27500A' },
  REJECTED:     { bg: '#FCEBEB', text: '#A32D2D' },
}

const statusLabels: Record<Status, string> = {
  SAVED:        'Saved',
  APPLIED:      'Applied',
  PHONE_SCREEN: 'Phone screen',
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
    <span style={{
      background: bg,
      color: text,
      fontSize: 10,
      fontWeight: 500,
      padding: '2px 7px',
      borderRadius: 99,
      whiteSpace: 'nowrap',
    }}>
      {statusLabels[status]}
    </span>
  )
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div style={{
      background: 'var(--color-secondary)',
      borderRadius: 8,
      padding: '12px 14px',
    }}>
      <div style={{ fontSize: 11, color: 'var(--color-muted-foreground)', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 500, color: 'var(--color-primary)' }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: 'var(--color-tertiary)', marginTop: 2 }}>{sub}</div>}
    </div>
  )
}

// ─── Dashboard Page ───────────────────────────────────────────────────────────

export default function DashboardPage() {
  const stats = computeStats(mockApplications)

  const activePipeline = mockApplications
    .filter(a => KANBAN_STATUSES.includes(a.status))
    .sort((a, b) => {
      const aDate = getNextDate(a)
      const bDate = getNextDate(b)
      if (!aDate && !bDate) return 0
      if (!aDate) return 1
      if (!bDate) return -1
      return aDate.getTime() - bDate.getTime()
    })

  const recentActivity = mockApplications
    .flatMap(a => a.activities.map(act => ({ ...act, company: a.company })))
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 10)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* Topbar */}
      <div style={{
        height: 44,
        borderBottom: '0.5px solid var(--color-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        background: 'var(--color-background)',
        flexShrink: 0,
      }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-primary)' }}>Dashboard</span>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{
            fontSize: 11,
            background: 'var(--color-secondary)',
            border: '0.5px solid var(--color-border)',
            borderRadius: 99,
            padding: '3px 10px',
            color: 'var(--color-muted-foreground)',
            cursor: 'pointer',
          }}>
            Fall 2026 ▾
          </span>
          <button style={{
            fontSize: 12,
            padding: '5px 12px',
            borderRadius: 8,
            background: '#534AB7',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
          }}>
            + Add job
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 8 }}>
          <StatCard label="Total applications" value={String(stats.total)} sub="this cycle" />
          <StatCard label="Response rate" value={`${stats.responseRate}%`} sub={`${stats.total} applied`} />
          <StatCard label="Active on kanban" value={String(stats.active)} sub="live opportunities" />
          <StatCard label="Offers" value={String(stats.offers)} sub={stats.offers > 0 ? 'pending decision' : 'none yet'} />
        </div>

        {/* Two column grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: 12 }}>

          {/* Active Pipeline */}
          <div style={{
            background: 'var(--color-background)',
            border: '0.5px solid var(--color-border)',
            borderRadius: 12,
            padding: 14,
          }}>
            <div style={{
              fontSize: 11,
              fontWeight: 500,
              color: 'var(--color-muted-foreground)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              marginBottom: 10,
            }}>
              Active pipeline
            </div>

            {activePipeline.length === 0 && (
              <div style={{ fontSize: 12, color: 'var(--color-tertiary)', textAlign: 'center', padding: '20px 0' }}>
                No active applications yet
              </div>
            )}

            {activePipeline.map(app => {
              const nextDate = getNextDate(app)
              return (
                <div key={app.id} style={{
                  background: 'var(--color-background)',
                  border: '0.5px solid var(--color-border)',
                  borderRadius: 8,
                  padding: '10px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 6,
                  cursor: 'pointer',
                }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--color-primary)' }}>{app.company}</div>
                    <div style={{ fontSize: 11, color: 'var(--color-muted-foreground)' }}>{app.role}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <Badge status={app.status} />
                    {nextDate && (
                      <div style={{ fontSize: 10, color: 'var(--color-tertiary)', marginTop: 3 }}>
                        {formatDate(nextDate)}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Recent Activity */}
          <div style={{
            background: 'var(--color-background)',
            border: '0.5px solid var(--color-border)',
            borderRadius: 12,
            padding: 14,
          }}>
            <div style={{
              fontSize: 11,
              fontWeight: 500,
              color: 'var(--color-muted-foreground)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              marginBottom: 10,
            }}>
              Recent activity
            </div>

            {recentActivity.length === 0 && (
              <div style={{ fontSize: 12, color: 'var(--color-tertiary)', textAlign: 'center', padding: '20px 0' }}>
                No activity yet
              </div>
            )}

            {recentActivity.map(act => (
              <div key={act.id} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 8,
                padding: '7px 0',
                borderBottom: '0.5px solid var(--color-border)',
              }}>
                <div style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: activityDotColors[act.type],
                  marginTop: 4,
                  flexShrink: 0,
                }} />
                <div>
                  <div style={{ fontSize: 12, color: 'var(--color-primary)' }}>
                    {act.company} — {act.description}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--color-tertiary)' }}>
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