'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { useCycle, CoopCycle } from '@/lib/CycleContext'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TERMS = ['Fall', 'Winter', 'Spring']
const CURRENT_YEAR = new Date().getFullYear()

// ─── Mock Data (non-cycle) ────────────────────────────────────────────────────

const mockUser = {
  name: 'Justin Chen',
  email: 'j.chen@uwaterloo.ca',
}

// ─── Sub-components ───────────────────────────────────────────────────────────

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

function SettingRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-border">
      <span className="text-[13px] text-primary">{label}</span>
      {children}
    </div>
  )
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <div
      onClick={() => onChange(!on)}
      className={`w-8 h-[18px] rounded-full relative cursor-pointer transition-colors duration-200 shrink-0 ${
        on ? 'bg-[#534AB7]' : 'bg-secondary border border-border'
      }`}
    >
      <div className={`absolute top-0.5 w-3.5 h-3.5 rounded-full transition-[left] duration-200 ${
        on ? 'left-3.5 bg-white' : 'left-0.5 bg-muted-foreground'
      }`} />
    </div>
  )
}

function GhostButton({ children, onClick, danger, disabled }: {
  children: React.ReactNode
  onClick?: () => void
  danger?: boolean
  disabled?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`text-[11px] px-3 py-1.5 rounded-lg bg-transparent cursor-pointer border disabled:opacity-50 ${
        danger
          ? 'border-[#6b2a2a] text-[#d46b6b]'
          : 'border-border text-muted-foreground'
      }`}
    >
      {children}
    </button>
  )
}

function DeleteCycleModal({ cycle, onConfirm, onCancel, loading }: {
  cycle: CoopCycle
  onConfirm: () => void
  onCancel: () => void
  loading: boolean
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-background border border-border rounded-xl p-5 w-[320px] flex flex-col gap-4">
        <div>
          <div className="text-[13px] font-medium text-primary mb-1">
            Delete {cycle.term} {cycle.year}?
          </div>
          <div className="text-[11px] text-muted-foreground leading-relaxed">
            This will permanently delete this cycle
            {(cycle._count?.applications ?? 0) > 0
              ? ` and its ${cycle._count!.applications} application${cycle._count!.applications === 1 ? '' : 's'}`
              : ''}
            . This cannot be undone.
          </div>
        </div>
        <div className="flex gap-1.5 justify-end">
          <GhostButton onClick={onCancel}>Cancel</GhostButton>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="text-[11px] px-3 py-1.5 rounded-lg bg-[#3d1010] text-[#d46b6b] border border-[#6b2a2a] cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Deleting…' : 'Delete cycle'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Settings Page ────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const { cycles, activeCycleId, setActiveCycle, refreshCycles } = useCycle()

  const [followUpReminders, setFollowUpReminders] = useState(true)
  const [deadlineAlerts, setDeadlineAlerts] = useState(false)
  const [showNewCycleForm, setShowNewCycleForm] = useState(false)
  const [newTerm, setNewTerm] = useState('Fall')
  const [newYear, setNewYear] = useState(CURRENT_YEAR)
  const [resumeFileName, setResumeFileName] = useState('resume_fall2026.pdf')
  const [resumeUploaded, setResumeUploaded] = useState(true)
  const [cycleToDelete, setCycleToDelete] = useState<CoopCycle | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [adding, setAdding] = useState(false)

  async function handleAddCycle() {
    const exists = cycles.find(c => c.term === newTerm && c.year === newYear)
    if (exists) return
    setAdding(true)
    try {
      const res = await fetch('/api/cycles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ term: newTerm, year: newYear }),
      })
      if (res.ok) {
        await refreshCycles()
        setShowNewCycleForm(false)
      }
    } finally {
      setAdding(false)
    }
  }

  async function handleDeleteCycle() {
    if (!cycleToDelete) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/cycles/${cycleToDelete.id}`, { method: 'DELETE' })
      if (res.ok) await refreshCycles()
    } finally {
      setDeleting(false)
      setCycleToDelete(null)
    }
  }

  function handleResumeUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setResumeFileName(file.name)
    setResumeUploaded(true)
  }

  return (
    <div className="flex flex-col h-full">
      {cycleToDelete && (
        <DeleteCycleModal
          cycle={cycleToDelete}
          onConfirm={handleDeleteCycle}
          onCancel={() => setCycleToDelete(null)}
          loading={deleting}
        />
      )}

      {/* Topbar */}
      <div className="h-11 border-b border-border flex items-center px-4 bg-background shrink-0">
        <span className="text-[13px] font-medium text-primary">Settings</span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-[640px] mx-auto w-full flex flex-col gap-3.5">

          {/* Profile */}
          <SectionCard title="Profile">
            <SettingRow label="Name">
              <span className="text-[12px] text-muted-foreground">{mockUser.name}</span>
            </SettingRow>
            <SettingRow label="Email">
              <span className="text-[12px] text-muted-foreground">{mockUser.email}</span>
            </SettingRow>
            <div className="pt-2.5 flex justify-end">
              <GhostButton>Edit profile</GhostButton>
            </div>
          </SectionCard>

          {/* Resume */}
          <SectionCard title="Resume">
            <div className="flex items-center justify-between py-2.5 border-b border-border">
              <div>
                <div className="text-[13px] text-primary">
                  {resumeUploaded ? resumeFileName : 'No resume uploaded'}
                </div>
                {resumeUploaded && (
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    Uploaded {new Date().toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                )}
              </div>
              <label className="cursor-pointer">
                <input type="file" accept=".pdf" className="hidden" onChange={handleResumeUpload} />
                <GhostButton>{resumeUploaded ? 'Replace' : 'Upload'}</GhostButton>
              </label>
            </div>
            <div className="mt-2.5 px-2.5 py-2 bg-secondary rounded-lg text-[11px] text-muted-foreground">
              {resumeUploaded
                ? 'Resume text is parsed and stored for ML match scoring on every application.'
                : 'Upload your resume PDF to enable ML match scoring when you add jobs.'}
            </div>
          </SectionCard>

          {/* Co-op Cycles */}
          <SectionCard title="Co-op cycles">
            {cycles.map(cycle => (
              <div key={cycle.id} className="flex items-center justify-between py-2.5 border-b border-border">
                <div>
                  <div className="text-[13px] text-primary">{cycle.term} {cycle.year}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    {cycle._count?.applications ?? 0} applications
                    {cycle.id === activeCycleId && ' · Active'}
                  </div>
                </div>
                <div className="flex gap-1.5 items-center">
                  {cycle.id === activeCycleId ? (
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-[#142108] text-[#74b34e]">
                      Active
                    </span>
                  ) : (
                    <GhostButton onClick={() => setActiveCycle(cycle.id)}>
                      Set active
                    </GhostButton>
                  )}
                  <button
                    onClick={() => setCycleToDelete(cycle)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-[#d46b6b] hover:bg-[#3d1010] transition-colors cursor-pointer"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}

            {showNewCycleForm ? (
              <div className="pt-3 flex flex-col gap-2">
                <div className="flex gap-2">
                  <select
                    value={newTerm}
                    onChange={e => setNewTerm(e.target.value)}
                    className="flex-1 text-[12px] px-2 py-1.5 rounded-lg border border-border bg-secondary text-primary outline-none"
                  >
                    {TERMS.map(t => <option key={t}>{t}</option>)}
                  </select>
                  <select
                    value={newYear}
                    onChange={e => setNewYear(Number(e.target.value))}
                    className="flex-1 text-[12px] px-2 py-1.5 rounded-lg border border-border bg-secondary text-primary outline-none"
                  >
                    {[CURRENT_YEAR, CURRENT_YEAR + 1, CURRENT_YEAR + 2].map(y => (
                      <option key={y}>{y}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-1.5 justify-end">
                  <GhostButton onClick={() => setShowNewCycleForm(false)}>Cancel</GhostButton>
                  <button
                    onClick={handleAddCycle}
                    disabled={adding}
                    className="text-[11px] px-3 py-1.5 rounded-lg bg-[#534AB7] text-white border-0 cursor-pointer disabled:opacity-50"
                  >
                    {adding ? 'Creating…' : 'Create cycle'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="pt-2.5">
                <button
                  onClick={() => setShowNewCycleForm(true)}
                  className="w-full text-[12px] py-1.5 rounded-lg bg-transparent border border-border text-muted-foreground cursor-pointer"
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
            <div className="flex items-center justify-between py-2.5">
              <span className="text-[13px] text-primary">Deadline alerts</span>
              <Toggle on={deadlineAlerts} onChange={setDeadlineAlerts} />
            </div>
          </SectionCard>

          {/* Account */}
          <SectionCard title="Account">
            <div className="flex items-center justify-between py-2.5">
              <div>
                <div className="text-[13px] text-primary">Sign out</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">Sign out of your account</div>
              </div>
              <GhostButton>Sign out</GhostButton>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <div>
                <div className="text-[13px] text-[#d46b6b]">Delete account</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">Permanently delete all your data</div>
              </div>
              <GhostButton danger>Delete account</GhostButton>
            </div>
          </SectionCard>

        </div>
      </div>
    </div>
  )
}
