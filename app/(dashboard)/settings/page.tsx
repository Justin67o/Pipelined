'use client'

import { useState } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface CoopCycle {
  id: string
  userId: string
  term: string
  year: number
  createdAt: Date
  _count?: { applications: number }
}

interface User {
  id: string
  email: string
  name: string
  resumeText: string | null
  createdAt: Date
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockUser: User = {
  id: 'user_1',
  email: 'j.chen@uwaterloo.ca',
  name: 'Justin Chen',
  resumeText: 'Experienced software developer with skills in React, TypeScript, Next.js, PostgreSQL...',
  createdAt: new Date('2026-01-01'),
}

const mockCycles: CoopCycle[] = [
  {
    id: 'cycle_1',
    userId: 'user_1',
    term: 'Fall',
    year: 2026,
    createdAt: new Date('2026-01-01'),
    _count: { applications: 142 },
  },
  {
    id: 'cycle_2',
    userId: 'user_1',
    term: 'Winter',
    year: 2026,
    createdAt: new Date('2025-09-01'),
    _count: { applications: 83 },
  },
]

const mockActiveCycleId = 'cycle_1'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TERMS = ['Fall', 'Winter', 'Spring']
const CURRENT_YEAR = 2026

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: 'var(--color-background)',
      border: '0.5px solid var(--color-border)',
      borderRadius: 12,
      padding: 16,
    }}>
      <div style={{
        fontSize: 11,
        fontWeight: 500,
        color: 'var(--color-muted-foreground)',
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        marginBottom: 14,
      }}>
        {title}
      </div>
      {children}
    </div>
  )
}

function SettingRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '10px 0',
      borderBottom: '0.5px solid var(--color-border)',
    }}>
      <span style={{ fontSize: 13, color: 'var(--color-primary)' }}>{label}</span>
      {children}
    </div>
  )
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <div
      onClick={() => onChange(!on)}
      style={{
        width: 32,
        height: 18,
        borderRadius: 99,
        background: on ? '#534AB7' : 'var(--color-secondary)',
        border: on ? 'none' : '0.5px solid var(--color-border)',
        position: 'relative',
        cursor: 'pointer',
        transition: 'background 0.2s',
        flexShrink: 0,
      }}
    >
      <div style={{
        position: 'absolute',
        top: 2,
        left: on ? 14 : 2,
        width: 14,
        height: 14,
        borderRadius: '50%',
        background: on ? '#fff' : 'var(--color-muted-foreground)',
        transition: 'left 0.2s',
      }} />
    </div>
  )
}

function GhostButton({ children, onClick, danger }: {
  children: React.ReactNode
  onClick?: () => void
  danger?: boolean
}) {
  return (
    <button
      onClick={onClick}
      style={{
        fontSize: 11,
        padding: '5px 12px',
        borderRadius: 8,
        background: 'transparent',
        border: `0.5px solid ${danger ? '#6b2a2a' : 'var(--color-border)'}`,
        color: danger ? '#d46b6b' : 'var(--color-muted-foreground)',
        cursor: 'pointer',
      }}
    >
      {children}
    </button>
  )
}

// ─── Settings Page ────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const [followUpReminders, setFollowUpReminders] = useState(true)
  const [deadlineAlerts, setDeadlineAlerts] = useState(false)
  const [activeCycleId, setActiveCycleId] = useState(mockActiveCycleId)
  const [cycles, setCycles] = useState(mockCycles)
  const [showNewCycleForm, setShowNewCycleForm] = useState(false)
  const [newTerm, setNewTerm] = useState('Fall')
  const [newYear, setNewYear] = useState(CURRENT_YEAR)
  const [resumeFileName, setResumeFileName] = useState('resume_fall2026.pdf')
  const [resumeUploaded, setResumeUploaded] = useState(true)

  function handleAddCycle() {
    const exists = cycles.find(c => c.term === newTerm && c.year === newYear)
    if (exists) return
    const newCycle: CoopCycle = {
      id: `cycle_${Date.now()}`,
      userId: 'user_1',
      term: newTerm,
      year: newYear,
      createdAt: new Date(),
      _count: { applications: 0 },
    }
    setCycles(prev => [newCycle, ...prev])
    setActiveCycleId(newCycle.id)
    setShowNewCycleForm(false)
  }

  function handleResumeUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setResumeFileName(file.name)
    setResumeUploaded(true)
    // When wiring up: POST file to /api/resume, parse PDF, store resumeText on User
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* Topbar */}
      <div style={{
        height: 44,
        borderBottom: '0.5px solid var(--color-border)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        background: 'var(--color-background)',
        flexShrink: 0,
      }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-primary)' }}>Settings</span>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
        <div style={{ maxWidth: 480, display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Profile */}
          <SectionCard title="Profile">
            <SettingRow label="Name">
              <span style={{ fontSize: 12, color: 'var(--color-muted-foreground)' }}>{mockUser.name}</span>
            </SettingRow>
            <SettingRow label="Email">
              <span style={{ fontSize: 12, color: 'var(--color-muted-foreground)' }}>{mockUser.email}</span>
            </SettingRow>
            <div style={{ paddingTop: 10, display: 'flex', justifyContent: 'flex-end' }}>
              <GhostButton>Edit profile</GhostButton>
            </div>
          </SectionCard>

          {/* Resume */}
          <SectionCard title="Resume">
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 0',
              borderBottom: '0.5px solid var(--color-border)',
            }}>
              <div>
                <div style={{ fontSize: 13, color: 'var(--color-primary)' }}>
                  {resumeUploaded ? resumeFileName : 'No resume uploaded'}
                </div>
                {resumeUploaded && (
                  <div style={{ fontSize: 11, color: 'var(--color-muted-foreground)', marginTop: 2 }}>
                    Uploaded {new Date().toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                )}
              </div>
              <label style={{ cursor: 'pointer' }}>
                <input
                  type="file"
                  accept=".pdf"
                  style={{ display: 'none' }}
                  onChange={handleResumeUpload}
                />
                <GhostButton>{resumeUploaded ? 'Replace' : 'Upload'}</GhostButton>
              </label>
            </div>
            <div style={{
              marginTop: 10,
              padding: '8px 10px',
              background: 'var(--color-secondary)',
              borderRadius: 8,
              fontSize: 11,
              color: 'var(--color-muted-foreground)',
            }}>
              {resumeUploaded
                ? 'Resume text is parsed and stored for ML match scoring on every application.'
                : 'Upload your resume PDF to enable ML match scoring when you add jobs.'}
            </div>
          </SectionCard>

          {/* Co-op Cycles */}
          <SectionCard title="Co-op cycles">
            {cycles.map(cycle => (
              <div
                key={cycle.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 0',
                  borderBottom: '0.5px solid var(--color-border)',
                }}
              >
                <div>
                  <div style={{ fontSize: 13, color: 'var(--color-primary)' }}>
                    {cycle.term} {cycle.year}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--color-muted-foreground)', marginTop: 2 }}>
                    {cycle._count?.applications ?? 0} applications
                    {cycle.id === activeCycleId && ' · Active'}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  {cycle.id === activeCycleId ? (
                    <span style={{
                      fontSize: 10,
                      fontWeight: 500,
                      padding: '2px 7px',
                      borderRadius: 99,
                      background: '#142108',
                      color: '#74b34e',
                    }}>
                      Active
                    </span>
                  ) : (
                    <GhostButton onClick={() => setActiveCycleId(cycle.id)}>
                      Set active
                    </GhostButton>
                  )}
                </div>
              </div>
            ))}

            {showNewCycleForm ? (
              <div style={{ paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  <select
                    value={newTerm}
                    onChange={e => setNewTerm(e.target.value)}
                    style={{
                      flex: 1,
                      fontSize: 12,
                      padding: '6px 8px',
                      borderRadius: 8,
                      border: '0.5px solid var(--color-border)',
                      background: 'var(--color-secondary)',
                      color: 'var(--color-primary)',
                      outline: 'none',
                    }}
                  >
                    {TERMS.map(t => <option key={t}>{t}</option>)}
                  </select>
                  <select
                    value={newYear}
                    onChange={e => setNewYear(Number(e.target.value))}
                    style={{
                      flex: 1,
                      fontSize: 12,
                      padding: '6px 8px',
                      borderRadius: 8,
                      border: '0.5px solid var(--color-border)',
                      background: 'var(--color-secondary)',
                      color: 'var(--color-primary)',
                      outline: 'none',
                    }}
                  >
                    {[CURRENT_YEAR, CURRENT_YEAR + 1, CURRENT_YEAR + 2].map(y => (
                      <option key={y}>{y}</option>
                    ))}
                  </select>
                </div>
                <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                  <GhostButton onClick={() => setShowNewCycleForm(false)}>Cancel</GhostButton>
                  <button
                    onClick={handleAddCycle}
                    style={{
                      fontSize: 11,
                      padding: '5px 12px',
                      borderRadius: 8,
                      background: '#534AB7',
                      color: '#fff',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    Create cycle
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ paddingTop: 10 }}>
                <button
                  onClick={() => setShowNewCycleForm(true)}
                  style={{
                    width: '100%',
                    fontSize: 12,
                    padding: '7px',
                    borderRadius: 8,
                    background: 'transparent',
                    border: '0.5px solid var(--color-border)',
                    color: 'var(--color-muted-foreground)',
                    cursor: 'pointer',
                  }}
                >
                  + New cycle
                </button>
              </div>
            )}
          </SectionCard>

          {/* Email Reminders */}
          <SectionCard title="Email reminders">
            <SettingRow label="Follow-up reminders">
              <Toggle on={followUpReminders} onChange={setFollowUpReminders} />
            </SettingRow>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 0',
            }}>
              <span style={{ fontSize: 13, color: 'var(--color-primary)' }}>Deadline alerts</span>
              <Toggle on={deadlineAlerts} onChange={setDeadlineAlerts} />
            </div>
          </SectionCard>

          {/* Danger Zone */}
          <SectionCard title="Account">
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 0',
            }}>
              <div>
                <div style={{ fontSize: 13, color: 'var(--color-primary)' }}>Sign out</div>
                <div style={{ fontSize: 11, color: 'var(--color-muted-foreground)', marginTop: 2 }}>
                  Sign out of your account
                </div>
              </div>
              <GhostButton>Sign out</GhostButton>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 0',
            }}>
              <div>
                <div style={{ fontSize: 13, color: '#d46b6b' }}>Delete account</div>
                <div style={{ fontSize: 11, color: 'var(--color-muted-foreground)', marginTop: 2 }}>
                  Permanently delete all your data
                </div>
              </div>
              <GhostButton danger>Delete account</GhostButton>
            </div>
          </SectionCard>

        </div>
      </div>
    </div>
  )
}