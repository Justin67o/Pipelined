import Link from "next/link"
import { ArrowRight, LayoutGrid, FileText, Sparkles } from "lucide-react"

const PREVIEW_APPS = [
  { company: "Shopify", role: "Software Engineer Intern", status: "INTERVIEW", match: 82, location: "Ottawa, ON" },
  { company: "Wealthsimple", role: "Backend Developer Co-op", status: "PHONE_SCREEN", match: 76, location: "Toronto, ON" },
  { company: "TD Bank", role: "Developer Intern", status: "OFFER", match: 68, location: "Toronto, ON" },
  { company: "Koho", role: "Full Stack Co-op", status: "INTERVIEW", match: 79, location: "Remote" },
  { company: "D2L", role: "Software Dev Co-op", status: "APPLIED", match: 73, location: "Kitchener, ON" },
]

const STATUS_STYLES: Record<string, { background: string; color: string }> = {
  APPLIED:      { background: "#1a2d42", color: "#5ba3d9" },
  PHONE_SCREEN: { background: "#152820", color: "#4aad8a" },
  INTERVIEW:    { background: "#1e1d3d", color: "#8b85e8" },
  OFFER:        { background: "#162208", color: "#6ab52b" },
  REJECTED:     { background: "#2d1515", color: "#e06060" },
}

const STATUS_LABELS: Record<string, string> = {
  APPLIED: "Applied",
  PHONE_SCREEN: "Screening",
  INTERVIEW: "Interview",
  OFFER: "Offer",
  REJECTED: "Rejected",
}

function MatchScore({ score }: { score: number }) {
  const color = score >= 75 ? "#4aad8a" : score >= 60 ? "#e8c85a" : "#e06060"
  return <span style={{ color, fontSize: 11, fontWeight: 600 }}>{score}%</span>
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-primary">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-6 border-b border-border bg-background/85 backdrop-blur-sm">
        <span className="text-[15px] font-semibold tracking-tight text-white">Pipelined</span>
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="text-[13px] text-muted-foreground hover:text-primary transition-colors px-3 py-1.5"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="text-[13px] px-3.5 py-1.5 rounded-lg bg-[#534AB7] text-white font-medium hover:bg-[#6258c4] transition-colors"
          >
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative flex flex-col items-center pt-14 overflow-hidden" style={{ minHeight: "100vh", justifyContent: "center", padding: "100px 24px 64px" }}>
        {/* Purple glow */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: "38%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 800,
            height: 450,
            borderRadius: "50%",
            background: "#534AB7",
            opacity: 0.055,
            filter: "blur(130px)",
          }}
        />

        <div className="relative z-10 flex flex-col items-center gap-6 text-center" style={{ maxWidth: 720 }}>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 border border-border bg-secondary rounded-full px-3.5 py-1 text-[12px] text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-[#534AB7] inline-block" />
            Built for students &amp; co-op seekers
          </div>

          {/* Headline */}
          <h1
            className="text-white font-bold"
            style={{ fontSize: "clamp(36px, 6vw, 58px)", letterSpacing: "-0.04em", lineHeight: 1.05, margin: 0 }}
          >
            Your internship search,
            <br />
            <span style={{ color: "#7f77dd" }}>finally organized.</span>
          </h1>

          {/* Subtext */}
          <p className="text-muted-foreground" style={{ fontSize: 17, lineHeight: 1.7, maxWidth: 520, margin: 0 }}>
            Track applications, visualize your pipeline, and get AI-powered match scores — all in one place.
          </p>

          {/* CTAs */}
          <div className="flex items-center gap-3 mt-1">
            <Link
              href="/register"
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#534AB7] text-white text-[14px] font-medium hover:bg-[#6258c4] transition-colors"
            >
              Get started free <ArrowRight size={14} />
            </Link>
            <Link
              href="/login"
              className="px-5 py-2.5 rounded-lg border border-border text-muted-foreground text-[14px] hover:text-primary hover:border-[#3f3f45] transition-colors"
            >
              Sign in
            </Link>
          </div>
        </div>

        {/* App preview mockup */}
        <div
          className="relative mt-14 w-full rounded-xl border border-border overflow-hidden"
          style={{ maxWidth: 900, boxShadow: "0 32px 80px rgba(0,0,0,0.55)" }}
        >
          {/* Window chrome */}
          <div className="h-9 bg-secondary border-b border-border flex items-center px-3 gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#3a3a3e]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#3a3a3e]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#3a3a3e]" />
            <span className="mx-auto text-[11px] text-tertiary">Pipelined — Applications</span>
          </div>

          {/* Topbar */}
          <div className="h-10 bg-background border-b border-border flex items-center justify-between px-4">
            <span className="text-[12px] font-medium text-primary">Applications</span>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full border border-border bg-secondary text-muted-foreground">
              Fall 2026
            </span>
          </div>

          {/* Table header */}
          <div
            className="bg-background border-b border-border"
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 2fr 1fr 1fr 1.5fr",
              padding: "8px 16px",
              fontSize: 10,
              fontWeight: 600,
              color: "#52525f",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            <span>Company</span>
            <span>Role</span>
            <span>Status</span>
            <span>Match</span>
            <span>Location</span>
          </div>

          {/* Table rows */}
          {PREVIEW_APPS.map((app, i) => (
            <div
              key={app.company}
              className="bg-background"
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 2fr 1fr 1fr 1.5fr",
                alignItems: "center",
                padding: "9px 16px",
                borderBottom: i < PREVIEW_APPS.length - 1 ? "1px solid #1e1e21" : "none",
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 500, color: "#e4e4e7" }}>{app.company}</span>
              <span style={{ fontSize: 11, color: "#8d8d9a" }}>{app.role}</span>
              <span>
                <span style={{ ...STATUS_STYLES[app.status], fontSize: 10, fontWeight: 500, padding: "2px 7px", borderRadius: 99 }}>
                  {STATUS_LABELS[app.status]}
                </span>
              </span>
              <MatchScore score={app.match} />
              <span style={{ fontSize: 11, color: "#8d8d9a" }}>{app.location}</span>
            </div>
          ))}

          {/* Fade overlay */}
          <div
            className="absolute bottom-0 left-0 right-0 pointer-events-none"
            style={{ height: 80, background: "linear-gradient(to bottom, transparent, #101012)" }}
          />
        </div>
      </section>

      {/* Features */}
      <section className="px-6 pb-24" style={{ maxWidth: 900, margin: "0 auto" }}>
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              icon: FileText,
              title: "Track every application",
              desc: "Log companies, roles, and statuses with deadlines and follow-up dates — nothing slips through the cracks.",
            },
            {
              icon: LayoutGrid,
              title: "Kanban pipeline",
              desc: "Drag and drop applications through screening, interview, and offer stages to see your pipeline at a glance.",
            },
            {
              icon: Sparkles,
              title: "AI match scores",
              desc: "Paste a job description and instantly see how your skills line up — know where you stand before you apply.",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="border border-border rounded-xl p-5 bg-secondary">
              <div className="w-8 h-8 rounded-lg bg-[#27272b] flex items-center justify-center mb-4">
                <Icon size={15} color="#7f77dd" />
              </div>
              <h3 className="text-[14px] font-semibold text-white mb-1.5">{title}</h3>
              <p className="text-[13px] text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA strip */}
      <section className="px-6 pb-24 flex flex-col items-center text-center gap-5">
        <h2 className="text-white font-semibold" style={{ fontSize: 28, letterSpacing: "-0.03em" }}>
          Ready to get organized?
        </h2>
        <Link
          href="/register"
          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-[#534AB7] text-white text-[14px] font-medium hover:bg-[#6258c4] transition-colors"
        >
          Create your free account <ArrowRight size={14} />
        </Link>
      </section>
    </div>
  )
}
