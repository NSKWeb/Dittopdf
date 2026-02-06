"use client";

import { useState } from "react";

export function ToolUploadForm({ tool }: { tool: string }) {
  const [status, setStatus] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setStatus(null);
    setDownloadUrl(null);
    setProgress(10);

    const formData = new FormData(event.currentTarget);
    setProgress(30);

    try {
      const res = await fetch(`/api/tools/${tool}`, {
        method: "POST",
        body: formData
      });

      setProgress(70);
      const data = await res.json();

      if (res.ok) {
        setStatus({ type: "success", message: data.message ?? "Processing complete." });
        if (data.downloadUrl) {
          setDownloadUrl(data.downloadUrl);
        }
      } else {
        setStatus({ type: "error", message: data.message ?? "Processing failed." });
      }
    } catch (error) {
      setStatus({ type: "error", message: "Network error. Please try again." });
    } finally {
      setLoading(false);
      setProgress(100);
    }
  }

  const getStatusColor = () => {
    switch (status?.type) {
      case "success":
        return "text-green-400";
      case "error":
        return "text-red-400";
      default:
        return "text-slate-300";
    }
  };

  return (
    <form onSubmit={handleSubmit} className="gradient-border rounded-xl bg-panel p-6 space-y-4">
      <div>
        <label className="block text-sm text-slate-300 font-medium">Upload files</label>
        <input
          name="files"
          type="file"
          multiple
          required
          accept="application/pdf,image/png,image/jpeg"
          className="mt-2 w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-accent/20 file:text-accent file:cursor-pointer hover:file:bg-accent/30 transition"
        />
        <p className="text-xs text-slate-500 mt-1">Max file size: 25MB. Supported: PDF, PNG, JPG</p>
      </div>
      <div>
        <label className="block text-sm text-slate-300 font-medium">Optional instructions</label>
        <textarea
          name="instructions"
          rows={3}
          className="mt-2 w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm focus:border-accent focus:outline-none transition"
          placeholder="e.g. rotate pages 2-4 by 90 degrees"
        />
        <p className="text-xs text-slate-500 mt-1">For specific page operations, use format: page=start-end (e.g., page=1-5)</p>
      </div>
      {loading && progress > 0 && (
        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
          <div
            className="bg-accent h-2 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-accent text-slate-900 font-medium py-2.5 disabled:opacity-60 hover:opacity-90 transition flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
            Processing...
          </>
        ) : (
          "Run tool"
        )}
      </button>
      {status && <p className={`text-sm ${getStatusColor()}`}>{status.message}</p>}
      {downloadUrl && (
        <a
          href={downloadUrl}
          className="block w-full text-center text-sm text-accent bg-accent/10 rounded-md py-2.5 hover:bg-accent/20 transition font-medium"
          target="_blank"
          rel="noreferrer"
        >
          Download processed file →
        </a>
      )}
    </form>
  );
}
