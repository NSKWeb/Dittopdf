import { getUserDashboard } from "@/lib/dashboard";

export default async function DashboardPage() {
  const dashboard = await getUserDashboard();

  return (
    <section className="px-6 py-12 max-w-5xl mx-auto">
      <div className="grid gap-6">
        <div>
          <h2 className="text-3xl font-semibold">Your dashboard</h2>
          <p className="text-slate-400">Track usage, downloads, and plan limits.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {dashboard.stats.map((stat) => (
            <div key={stat.label} className="gradient-border rounded-xl p-5 bg-panel">
              <div className="text-sm text-slate-400">{stat.label}</div>
              <div className="text-2xl font-semibold mt-2">{stat.value}</div>
              <div className="text-xs text-slate-500 mt-1">{stat.helper}</div>
            </div>
          ))}
        </div>
        <div className="gradient-border rounded-xl p-6 bg-panel">
          <h3 className="text-lg font-medium mb-3">Recent files</h3>
          <div className="space-y-3">
            {dashboard.recentFiles.map((file) => (
              <div key={file.id} className="flex items-center justify-between text-sm">
                <div>
                  <div className="font-medium">{file.filename}</div>
                  <div className="text-xs text-slate-500">{file.toolUsed}</div>
                </div>
                <div className="text-xs text-slate-400">{file.status}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
