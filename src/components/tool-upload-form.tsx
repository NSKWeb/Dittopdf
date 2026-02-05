"use client";

import { useState } from "react";

export function ToolUploadForm({ tool }: { tool: string }) {
  const [status, setStatus] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setStatus(null);
    setDownloadUrl(null);

    const formData = new FormData(event.currentTarget);
    const res = await fetch(`/api/tools/${tool}`, {
      method: "POST",
      body: formData
    });

    const data = await res.json();
    setLoading(false);
    setStatus(data.message ?? (res.ok ? "Processing complete." : "Processing failed."));
    if (data.downloadUrl) {
      setDownloadUrl(data.downloadUrl);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="gradient-border rounded-xl bg-panel p-6 space-y-4">
      <div>
        <label className="block text-sm text-slate-300">Upload files</label>
        <input
          name="files"
          type="file"
          multiple
          required
          accept="application/pdf,image/png,image/jpeg"
          className="mt-2 w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-sm text-slate-300">Optional instructions</label>
        <textarea
          name="instructions"
          rows={3}
          className="mt-2 w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm"
          placeholder="e.g. rotate pages 2-4 by 90 degrees"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-accent text-slate-900 font-medium py-2 disabled:opacity-60"
      >
        {loading ? "Processing..." : "Run tool"}
      </button>
      {status && <p className="text-sm text-slate-300">{status}</p>}
      {downloadUrl && (
        <a
          href={downloadUrl}
          className="text-sm text-accent underline"
          target="_blank"
          rel="noreferrer"
        >
          Download processed file
        </a>
      )}
    </form>
  );
}
