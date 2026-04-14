'use client'

import { useState } from 'react'
import { X, ChevronDown, Check } from 'lucide-react'
import { useCycle } from '@/lib/CycleContext'

type Status = 'SAVED' | 'APPLIED' | 'PHONE_SCREEN' | 'INTERVIEW' | 'OFFER' | 'REJECTED'

const STATUS_OPTIONS: { value: Status; label: string }[] = [
  { value: 'SAVED',        label: 'Saved' },
  { value: 'APPLIED',      label: 'Applied' },
  { value: 'PHONE_SCREEN', label: 'Screening' },
  { value: 'INTERVIEW',    label: 'Interview' },
  { value: 'OFFER',        label: 'Offer' },
  { value: 'REJECTED',     label: 'Rejected' },
]

const TABS = [
  { id: 'url',         label: 'Paste URL' },
  { id: 'description', label: 'Paste Description' },
  { id: 'manual',      label: 'Manual' },
] as const

type Tab = typeof TABS[number]['id']

interface AddJobModalProps {
  onClose: () => void
  onAdd: () => void
}

const inputClass = 'w-full bg-secondary border border-border rounded-lg px-3 py-1.5 text-[12px] text-primary placeholder:text-muted-foreground outline-none'
const labelClass = 'block text-[11px] text-muted-foreground mb-1'

export default function AddJobModal({ onClose, onAdd }: AddJobModalProps) {
  const { selectedCycleId } = useCycle()
  const [activeTab, setActiveTab] = useState<Tab>('url')
  const [status, setStatus] = useState<Status>('SAVED')
  const [saving, setSaving] = useState(false)
  const [parsing, setParsing] = useState(false)

  async function handleParse() {
    if (!pasteDescription.trim()) return
    setParsing(true)
    try {
      const res = await fetch('/api/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription: pasteDescription }),
      })
      if (!res.ok) return
      const { data } = await res.json()
      if (data.company) setCompany(data.company)
      if (data.role) setRole(data.role)
      if (data.location) setLocation(data.location)
      if (data.salary) setSalary(data.salary)
      setJobDescription(pasteDescription)
      setActiveTab('manual')
    } finally {
      setParsing(false)
    }
  }

  async function handleSave() {
    if (!company.trim() || !role.trim()) return
    setSaving(true)
    try {
      const isRemote = location.trim().toLowerCase() === 'remote'
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company: company.trim(),
          role: role.trim(),
          status,
          cycleId: selectedCycleId,
          location: isRemote ? null : location.trim() || null,
          remote: isRemote,
          salary: salary.trim() || null,
          jobUrl: jobUrl.trim() || null,
          jobDescription: jobDescription.trim() || null,
          deadline: deadline || null,
          dateApplied: status !== 'SAVED' ? dateApplied || null : null,
        }),
      })
      if (res.ok) {
        onAdd()
        onClose()
      }
    } finally {
      setSaving(false)
    }
  }

  // Paste URL tab
  const [pasteUrl, setPasteUrl] = useState('')

  // Paste Description tab
  const [pasteDescription, setPasteDescription] = useState('')

  // Manual tab
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [location, setLocation] = useState('')
  const [salary, setSalary] = useState('')
  const [jobUrl, setJobUrl] = useState('')
  const [deadline, setDeadline] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [dateApplied, setDateApplied] = useState(() => new Date().toISOString().split('T')[0])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-background border border-border rounded-xl w-[520px] max-h-[90vh] overflow-y-auto shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-border">
          <span className="text-[13px] font-medium text-primary">Add job</span>
          <button onClick={onClose} className="text-muted-foreground hover:text-primary transition-colors cursor-pointer border-0 bg-transparent p-0">
            <X size={15} />
          </button>
        </div>

        <div className="px-5 py-4 flex flex-col gap-4">
          {/* Tab strip */}
          <div className="flex items-center bg-secondary border border-border rounded-lg p-0.5 self-start">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`text-[11px] px-2.5 py-1 rounded-md cursor-pointer border-0 transition-colors ${
                  activeTab === tab.id
                    ? 'bg-background text-primary'
                    : 'bg-transparent text-muted-foreground hover:text-primary'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Paste URL tab */}
          {activeTab === 'url' && (
            <div className="flex flex-col gap-3">
              <div>
                <label className={labelClass}>Job URL</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={pasteUrl}
                    onChange={e => setPasteUrl(e.target.value)}
                    placeholder="https://jobs.example.com/..."
                    className={inputClass}
                  />
                  <button className="shrink-0 text-[11px] px-3 py-1.5 rounded-lg bg-secondary border border-border text-muted-foreground hover:text-primary cursor-pointer transition-colors">
                    Scrape
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Paste Description tab */}
          {activeTab === 'description' && (
            <div className="flex flex-col gap-3">
              <div>
                <label className={labelClass}>Job description</label>
                <textarea
                  value={pasteDescription}
                  onChange={e => setPasteDescription(e.target.value)}
                  placeholder="Paste the full job description here..."
                  rows={8}
                  className={`${inputClass} resize-none`}
                />
              </div>
              <button
                onClick={handleParse}
                disabled={parsing || !pasteDescription.trim()}
                className="self-start inline-flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-lg bg-secondary border border-border text-muted-foreground hover:text-primary cursor-pointer transition-colors disabled:opacity-50"
              >
                <Check size={12} />
                {parsing ? 'Parsing…' : 'Parse with AI'}
              </button>
            </div>
          )}

          {/* Manual tab */}
          {activeTab === 'manual' && (
            <div className="flex flex-col gap-3">
              <div>
                <label className={labelClass}>Company <span className="text-[#534AB7]">*</span></label>
                <input type="text" value={company} onChange={e => setCompany(e.target.value)} placeholder="e.g. Shopify" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Role <span className="text-[#534AB7]">*</span></label>
                <input type="text" value={role} onChange={e => setRole(e.target.value)} placeholder="e.g. Software Engineer Intern" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Location <span className="text-[#534AB7]">*</span></label>
                <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Toronto, ON or Remote" className={inputClass} />
              </div>
              {status !== 'SAVED' && (
                <div>
                  <label className={labelClass}>Date applied</label>
                  <input type="date" value={dateApplied} onChange={e => setDateApplied(e.target.value)} className={`${inputClass} [color-scheme:dark]`} />
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Salary <span className="text-tertiary">(optional)</span></label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[12px] text-muted-foreground">$</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={salary}
                      onChange={e => {
                        const val = e.target.value
                        if (val === '' || (/^\d+(\.\d{0,2})?$/.test(val) && Number(val) >= 0)) setSalary(val)
                      }}
                      placeholder="52000"
                      className={`${inputClass} pl-6`}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Deadline <span className="text-tertiary">(optional)</span></label>
                  <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} className={`${inputClass} [color-scheme:dark]`} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Job URL <span className="text-tertiary">(optional)</span></label>
                <input type="url" value={jobUrl} onChange={e => setJobUrl(e.target.value)} placeholder="https://..." className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Job description <span className="text-tertiary">(optional)</span></label>
                <textarea value={jobDescription} onChange={e => setJobDescription(e.target.value)} placeholder="Paste the job description..." rows={5} className={`${inputClass} resize-none`} />
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center gap-3 pt-4 border-t border-border">
            <div className="relative flex-1">
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
            <div className="flex gap-2 ml-auto">
              <button
                onClick={onClose}
                className="text-[11px] px-3 py-1.5 rounded-lg bg-transparent border border-border text-muted-foreground cursor-pointer hover:text-primary transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || activeTab !== 'manual' || !company.trim() || !role.trim()}
                className="text-[11px] px-3 py-1.5 rounded-lg bg-[#534AB7] text-white border-0 cursor-pointer disabled:opacity-50"
              >
                {saving ? 'Saving…' : 'Save application'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
