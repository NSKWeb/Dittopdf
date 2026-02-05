import { ToolUploadForm } from "@/components/tool-upload-form";
import { tools } from "@/lib/tools";

export default function ToolPage({ params }: { params: { tool: string } }) {
  const tool = tools.find((item) => item.slug === params.tool);

  if (!tool) {
    return (
      <section className="px-6 py-12 max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold">Tool not found</h2>
        <p className="text-slate-400 mt-2">Select a valid PDF tool from the homepage.</p>
      </section>
    );
  }

  return (
    <section className="px-6 py-12 max-w-4xl mx-auto">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-semibold">{tool.name}</h2>
          <p className="text-slate-400">{tool.description}</p>
        </div>
        <ToolUploadForm tool={tool.slug} />
      </div>
    </section>
  );
}
