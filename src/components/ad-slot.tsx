export function AdSlot({ position }: { position: "header" | "sidebar" | "footer" }) {
  return (
    <div className="gradient-border rounded-xl bg-panel/60 px-4 py-3 text-xs text-slate-400">
      <div className="text-[10px] uppercase tracking-[0.3em] text-slate-500">AdSense {position}</div>
      <div className="mt-2">Reserved for Google AdSense placement.</div>
    </div>
  );
}
