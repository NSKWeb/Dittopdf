import { AdSlot } from "@/components/ad-slot";

const tools = [
  { name: "Merge PDFs", slug: "merge" },
  { name: "Split PDF", slug: "split" },
  { name: "Compress PDF", slug: "compress" },
  { name: "Rotate PDF", slug: "rotate" },
  { name: "PDF to Word/Excel/PowerPoint", slug: "pdf-to-office" },
  { name: "PDF to JPG/PNG", slug: "pdf-to-images" },
  { name: "Images to PDF", slug: "images-to-pdf" },
  { name: "PDF to Text", slug: "pdf-to-text" },
  { name: "Password Protect PDF", slug: "protect" },
  { name: "Remove PDF Password", slug: "unlock" },
  { name: "Text Watermark", slug: "watermark-text" },
  { name: "Image Watermark", slug: "watermark-image" },
  { name: "Text Annotations", slug: "annotate" },
  { name: "Extract Pages", slug: "extract-pages" },
  { name: "Extract Images", slug: "extract-images" },
  { name: "Edit Metadata", slug: "metadata" }
];

export default function HomePage() {
  return (
    <section className="px-6 py-12 max-w-6xl mx-auto">
      <div className="grid gap-8 lg:grid-cols-[1fr_260px]">
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold">All-in-one PDF suite for modern teams</h1>
            <p className="text-slate-300 max-w-2xl">
              Convert, compress, protect, and manage your documents in one secure workspace. Dittopdf Phase 1
              MVP includes 16 production-ready tools, cloud storage, and detailed analytics.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {tools.map((tool) => (
              <a
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="gradient-border rounded-xl p-5 bg-panel hover:border-accent transition"
              >
                <div className="text-lg font-medium">{tool.name}</div>
                <p className="text-xs text-slate-400 mt-2">Start processing files →</p>
              </a>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <AdSlot position="sidebar" />
          <div className="gradient-border rounded-xl p-5 bg-panel text-xs text-slate-400">
            <div className="text-[10px] uppercase tracking-[0.3em] text-slate-500">Usage limits</div>
            <p className="mt-3">Free users can process up to 5 files per day. Upgrade to Pro for unlimited use.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
