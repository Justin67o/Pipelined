"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const router = useRouter()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const form = new FormData(e.currentTarget)
    const name = form.get("name") as string
    const email = form.get("email") as string
    const password = form.get("password") as string

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error ?? "Something went wrong")
      setLoading(false)
      return
    }

    router.push("/login?registered=1")
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full" style={{ maxWidth: 360 }}>
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="text-[16px] font-semibold tracking-tight text-white hover:opacity-80 transition-opacity">
            Pipelined
          </Link>
          <p className="text-[13px] text-muted-foreground mt-1.5">Create your account</p>
        </div>

        {/* Form card */}
        <div className="border border-border rounded-xl p-6 bg-secondary">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] text-muted-foreground font-medium" htmlFor="name">
                Full name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Alex Chen"
                required
                autoComplete="name"
                className="w-full bg-background border border-border rounded-lg px-3.5 py-2.5 text-[13px] text-primary placeholder:text-tertiary outline-none focus:border-[#534AB7] transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] text-muted-foreground font-medium" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@university.ca"
                required
                autoComplete="email"
                className="w-full bg-background border border-border rounded-lg px-3.5 py-2.5 text-[13px] text-primary placeholder:text-tertiary outline-none focus:border-[#534AB7] transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] text-muted-foreground font-medium" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Min. 8 characters"
                required
                minLength={8}
                autoComplete="new-password"
                className="w-full bg-background border border-border rounded-lg px-3.5 py-2.5 text-[13px] text-primary placeholder:text-tertiary outline-none focus:border-[#534AB7] transition-colors"
              />
            </div>

            {error && (
              <p className="text-[12px]" style={{ color: "#e06060" }}>{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-[#534AB7] text-white text-[13px] font-medium hover:bg-[#6258c4] transition-colors disabled:opacity-50 mt-1 cursor-pointer border-0"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>
        </div>

        <p className="text-center text-[12px] text-tertiary mt-5">
          Already have an account?{" "}
          <Link href="/login" className="text-muted-foreground hover:text-primary transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
