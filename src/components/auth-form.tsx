"use client";

import { useState } from "react";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submitLabel = mode === "login" ? "Sign in" : "Create account";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setStatus(null);
    const formData = new FormData(event.currentTarget);

    const res = await fetch(`/api/auth/${mode}`, {
      method: "POST",
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password")
      }),
      headers: { "Content-Type": "application/json" }
    });

    const data = await res.json();
    setLoading(false);
    setStatus(data.message ?? (res.ok ? "Success" : "Something went wrong"));
  }

  return (
    <form onSubmit={handleSubmit} className="gradient-border rounded-xl bg-panel p-6 space-y-4">
      <div>
        <h2 className="text-2xl font-semibold">{submitLabel}</h2>
        <p className="text-slate-400 text-sm">
          {mode === "login" ? "Welcome back to Dittopdf." : "Start processing your PDFs instantly."}
        </p>
      </div>
      <div className="space-y-3">
        <input
          name="email"
          type="email"
          placeholder="Email address"
          required
          className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          minLength={8}
          className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-accent text-slate-900 font-medium py-2 disabled:opacity-60"
      >
        {loading ? "Processing..." : submitLabel}
      </button>
      {status && <p className="text-sm text-slate-300">{status}</p>}
    </form>
  );
}
