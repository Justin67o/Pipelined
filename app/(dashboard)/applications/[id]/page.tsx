'use client'

import { useState } from 'react'
import { ChevronDown, ExternalLink } from 'lucide-react'
import { matchScoreColor } from '@/lib/matchScore'

type Status = 'SAVED' | 'APPLIED' | 'PHONE_SCREEN' | 'INTERVIEW' | 'OFFER' | 'REJECTED'
type ActivityType = 'STATUS_CHANGE' | 'NOTE_ADDED' | 'REMINDER_SET'

interface Activity {
  id: string
  type: ActivityType
  description: string
  createdAt: Date
}

interface Application {
  id: string
  company: string
  role: string
  status: Status
  matchScore: number | null
  matchedSkills: string[]
  missingSkills: string[]
  salary: string | null
  location: string | null
  remote: boolean
  jobUrl: string | null
  dateApplied: Date | null
  deadline: Date | null
  followUpDate: Date | null
  jobDescription: string | null
  notes: string | null
  cycleId: string | null
  activities: Activity[]
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockApplication: Application = {
  id: 'app_1',
  company: 'Shopify',
  role: 'Software Engineer Intern',
  status: 'INTERVIEW',
  matchScore: 82,
  matchedSkills: ['React', 'TypeScript', 'REST APIs', 'PostgreSQL', 'Next.js'],
  missingSkills: ['Go', 'Kubernetes', 'gRPC'],
  salary: '$52,000',
  location: 'Ottawa, ON',
  remote: false,
  jobUrl: 'https://jobs.lever.co/shopify/abc123',
  dateApplied: new Date('2026-03-28'),
  deadline: new Date('2026-04-30'),
  followUpDate: new Date('2026-04-09'),
  jobDescription: `We are looking for a Software Engineer Intern to join our team at Shopify. You will work on building and scaling commerce infrastructure used by millions of merchants worldwide.\n\nResponsibilities:\n- Build and maintain features across Shopify's core platform\n- Collaborate with senior engineers on architecture decisions\n- Write clean, well-tested code in a fast-paced environment\n\nRequirements:\n- Currently enrolled in a Computer Science or related program\n- Strong understanding of data structures and algorithms\n- Experience with React, TypeScript, or similar technologies`,
  notes: 'Round 1 was two pointer problems, felt good.',
  cycleId: 'cycle_1',
  activities: [
    { id: 'act_1', type: 'STATUS_CHANGE', description: 'Status changed to Interview', createdAt: new Date('2026-04-05') },
    { id: 'act_2', type: 'NOTE_ADDED',    description: 'Note added: Round 1 technical was LeetCode mediums', createdAt: new Date('2026-04-05') },
    { id: 'act_3', type: 'STATUS_CHANGE', description: 'Status changed to Applied', createdAt: new Date('2026-03-28') },
  ],
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_OPTIONS: { value: Status; label: string }[] = [
  { value: 'SAVED',        label: 'Saved' },
  { value: 'APPLIED',      label: 'Applied' },
  { value: 'PHONE_SCREEN', label: 'Screening' },
  { value: 'INTERVIEW',    label: 'Interview' },
  { value: 'OFFER',        label: 'Offer' },
  { value: 'REJECTED',     label: 'Rejected' },
]

const activityDotColors: Record<ActivityType, string> = {
  STATUS_CHANGE: '#7F77DD',
  NOTE_ADDED:    '#888780',
  REMINDER_SET:  '#EF9F27',
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(date: Date | null) {
  if (!date) return '—'
  return date.toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' })
}

function timeAgo(date: Date) {
  const diff = Date.now() - date.getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  return `${days} days ago`
}

// ─── Match Score Circle ───────────────────────────────────────────────────────

function MatchCircle({ score }: { score: number | null }) {
  const { color } = score !== null
    ? { color: matchScoreColor(score).color }
    : { color: 'var(--color-tertiary)' }

  const radius = 28
  const circumference = 2 * Math.PI * radius
  const progress = score !== null ? (score / 100) * circumference : 0

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="72" height="72" viewBox="0 0 72 72">
        <circle cx="36" cy="36" r={radius} fill="none" stroke="var(--color-secondary)" strokeWidth="5" />
        <circle
          cx="36" cy="36" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          transform="rotate(-90 36 36)"
        />
        <text x="36" y="40" textAnchor="middle" fontSize="14" fontWeight="600" fill={color}>
          {score !== null ? `${score}` : '—'}
        </text>
      </svg>
      <span className="text-[10px] text-muted-foreground">Match score</span>
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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ApplicationDetailPage() {
  const app = mockApplication
  const [status, setStatus] = useState<Status>(app.status)
  const [notes, setNotes] = useState(app.notes ?? '')

  return (
    <div className="flex flex-col h-full">

      {/* Topbar */}
      <div className="h-11 border-b border-border flex items-center px-4 bg-background shrink-0 gap-2">
        <span className="text-[13px] text-muted-foreground cursor-pointer hover:text-primary transition-colors">Applications</span>
        <span className="text-[13px] text-muted-foreground">/</span>
        <span className="text-[13px] font-medium text-primary">{app.company}</span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full grid" style={{ gridTemplateColumns: 'minmax(0, 1.6fr) minmax(0, 1fr)' }}>

          {/* Left column: Overview + Job Description */}
          <div className="overflow-y-auto p-4 flex flex-col gap-3 border-r border-border">

            {/* Overview */}
            <SectionCard title="Overview">
              <div className="flex items-start gap-4">
                <MatchCircle score={app.matchScore} />
                <div className="flex flex-col gap-0.5 flex-1">
                  <span className="text-[16px] font-semibold text-primary">{app.company}</span>
                  <span className="text-[13px] text-muted-foreground">{app.role}</span>
                  <span className="text-[12px] text-tertiary mt-0.5">
                    {app.remote ? 'Remote' : (app.location ?? '—')}
                    {app.salary && ` · ${app.salary}`}
                  </span>
                  {app.jobUrl && (
                    <a
                      href={app.jobUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-[#6b63d4] hover:underline mt-1 w-fit"
                    >
                      View job posting <ExternalLink size={11} />
                    </a>
                  )}
                </div>
              </div>

              {/* Skills */}
              <div className="mt-4 flex flex-col gap-3">
                {app.matchedSkills.length > 0 && (
                  <div>
                    <div className="text-[11px] text-muted-foreground mb-1.5">Matched skills</div>
                    <div className="flex flex-wrap gap-1.5">
                      {app.matchedSkills.map(skill => (
                        <span key={skill} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#142108] text-[#74b34e]">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {app.missingSkills.length > 0 && (
                  <div>
                    <div className="text-[11px] text-muted-foreground mb-1.5">Missing skills</div>
                    <div className="flex flex-wrap gap-1.5">
                      {app.missingSkills.map(skill => (
                        <span key={skill} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#2c1010] text-[#d46b6b]">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </SectionCard>

            {/* Job Description */}
            {app.jobDescription && (
              <SectionCard title="Job description">
                <p className="text-[12px] text-muted-foreground leading-relaxed whitespace-pre-line">
                  {app.jobDescription}
                </p>
              </SectionCard>
            )}
          </div>

          {/* Right column: Details + Activity + Notes */}
          <div className="overflow-y-auto p-4 flex flex-col gap-3">

            {/* Details */}
            <SectionCard title="Details">
              <div className="flex flex-col gap-1">
                <div className="relative mb-2">
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value as Status)}
                    className="w-full bg-secondary border border-border rounded-lg px-3 py-1.5 text-[12px] text-primary appearance-none cursor-pointer pr-7 outline-none"
                  >
                    {STATUS_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground" size={13} />
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-[12px] text-muted-foreground">Date applied</span>
                  <span className="text-[12px] text-primary">{formatDate(app.dateApplied)}</span>
                </div>
                {app.deadline && (
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-[12px] text-muted-foreground">Deadline</span>
                    <span className="text-[12px] text-[#d46b6b]">{formatDate(app.deadline)}</span>
                  </div>
                )}
                {app.followUpDate && (
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-[12px] text-muted-foreground">Follow-up</span>
                    <span className="text-[12px] text-[#c49a3c]">{formatDate(app.followUpDate)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center py-2">
                  <span className="text-[12px] text-muted-foreground">Co-op cycle</span>
                  <span className="text-[12px] text-primary">{app.cycleId ? 'Fall 2026' : '—'}</span>
                </div>
              </div>
            </SectionCard>

            {/* Activity Timeline */}
            <SectionCard title="Activity timeline">
              {app.activities.length === 0 ? (
                <div className="text-[12px] text-tertiary text-center py-4">No activity yet</div>
              ) : (
                <div className="flex flex-col">
                  {app.activities.map(act => (
                    <div key={act.id} className="flex items-start gap-3 py-2.5 border-b border-border last:border-0">
                      <div style={{ width: 7, height: 7, borderRadius: '50%', background: activityDotColors[act.type], marginTop: 4, flexShrink: 0 }} />
                      <div className="flex-1">
                        <div className="text-[12px] text-primary">{act.description}</div>
                        <div className="text-[10px] text-tertiary mt-0.5">{timeAgo(act.createdAt)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>

            {/* Notes */}
            <SectionCard title="Notes">
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Add notes about this application..."
                rows={4}
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-[12px] text-primary placeholder:text-muted-foreground outline-none resize-none"
              />
              <div className="flex justify-end mt-2">
                <button className="text-[11px] px-3 py-1.5 rounded-lg bg-[#534AB7] text-white border-0 cursor-pointer">
                  Save note
                </button>
              </div>
            </SectionCard>

          </div>
        </div>
      </div>
    </div>
  )
}
