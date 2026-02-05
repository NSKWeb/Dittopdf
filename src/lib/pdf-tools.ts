import { PDFDocument, degrees } from "pdf-lib";

export type ProcessedResult = {
  buffer: Buffer;
  contentType: string;
  filename: string;
};

export async function processPdfTool({
  tool,
  files,
  instructions
}: {
  tool: string;
  files: File[];
  instructions?: string | null;
}): Promise<ProcessedResult> {
  const primaryFile = files[0];
  if (!primaryFile) {
    throw new Error("No files uploaded");
  }

  const fileBuffers = await Promise.all(files.map(async (file) => Buffer.from(await file.arrayBuffer())));

  switch (tool) {
    case "merge": {
      const merged = await PDFDocument.create();
      for (const buffer of fileBuffers) {
        const doc = await PDFDocument.load(buffer);
        const pages = await merged.copyPages(doc, doc.getPageIndices());
        pages.forEach((page) => merged.addPage(page));
      }
      const mergedBytes = await merged.save();
      return {
        buffer: Buffer.from(mergedBytes),
        contentType: "application/pdf",
        filename: "merged.pdf"
      };
    }
    case "rotate": {
      const doc = await PDFDocument.load(fileBuffers[0]);
      const angle = parseRotateAngle(instructions);
      doc.getPages().forEach((page) => {
        const current = page.getRotation().angle;
        page.setRotation(degrees(current + angle));
      });
      const rotatedBytes = await doc.save();
      return {
        buffer: Buffer.from(rotatedBytes),
        contentType: "application/pdf",
        filename: "rotated.pdf"
      };
    }
    case "extract-pages": {
      const doc = await PDFDocument.load(fileBuffers[0]);
      const extracted = await PDFDocument.create();
      const indices = parsePageRange(instructions, doc.getPageCount());
      const pages = await extracted.copyPages(doc, indices);
      pages.forEach((page) => extracted.addPage(page));
      const extractedBytes = await extracted.save();
      return {
        buffer: Buffer.from(extractedBytes),
        contentType: "application/pdf",
        filename: "extracted-pages.pdf"
      };
    }
    case "split": {
      const doc = await PDFDocument.load(fileBuffers[0]);
      const firstPage = await PDFDocument.create();
      const [page] = await firstPage.copyPages(doc, [0]);
      firstPage.addPage(page);
      const splitBytes = await firstPage.save();
      return {
        buffer: Buffer.from(splitBytes),
        contentType: "application/pdf",
        filename: "split-part-1.pdf"
      };
    }
    default: {
      return {
        buffer: fileBuffers[0],
        contentType: primaryFile.type || "application/pdf",
        filename: `${tool}-output-${primaryFile.name}`
      };
    }
  }
}

function parseRotateAngle(instructions?: string | null) {
  const match = instructions?.match(/(90|180|270)/);
  return match ? Number(match[0]) : 90;
}

function parsePageRange(instructions?: string | null, pageCount: number) {
  if (!instructions) {
    return [0];
  }

  const match = instructions.match(/(\d+)(?:-(\d+))?/);
  if (!match) {
    return [0];
  }
  const start = Math.max(1, Number(match[1]));
  const end = Math.min(pageCount, Number(match[2] ?? match[1]));
  const indices = [];
  for (let i = start; i <= end; i += 1) {
    indices.push(i - 1);
  }
  return indices.length ? indices : [0];
}
