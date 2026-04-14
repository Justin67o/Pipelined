"use client"

import Link from "next/link"
import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense } from "react"

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const registered = searchParams.get("registered")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const form = new FormData(e.currentTarget)

    const result = await signIn("credentials", {
      email: form.get("email"),
      password: form.get("password"),
      redirect: false,
    })

    if (result?.error) {
      setError("Invalid email or password")
      setLoading(false)
      return
    }

    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full" style={{ maxWidth: 360 }}>
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="text-[16px] font-semibold tracking-tight text-white hover:opacity-80 transition-opacity">
            Pipelined
          </Link>
          <p className="text-[13px] text-muted-foreground mt-1.5">Sign in to your account</p>
        </div>

        {registered && (
          <div className="border border-[#27272b] rounded-lg px-4 py-3 mb-4 text-[12px]" style={{ background: "#162208", color: "#6ab52b" }}>
            Account created — sign in to get started.
          </div>
        )}

        {/* Form card */}
        <div className="border border-border rounded-xl p-6 bg-secondary">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
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
                placeholder="••••••••"
                required
                autoComplete="current-password"
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
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>

        <p className="text-center text-[12px] text-tertiary mt-5">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-muted-foreground hover:text-primary transition-colors">
            Get started
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
