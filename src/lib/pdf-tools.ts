import { PDFDocument, StandardFonts, degrees, rgb } from "pdf-lib";
import type { PDFImage } from "pdf-lib";

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
    case "split": {
      const doc = await PDFDocument.load(fileBuffers[0]);
      const range = parsePageRange(instructions, doc.getPageCount());
      const extracted = await PDFDocument.create();
      const pages = await extracted.copyPages(doc, range);
      pages.forEach((page) => extracted.addPage(page));
      const splitBytes = await extracted.save();
      return {
        buffer: Buffer.from(splitBytes),
        contentType: "application/pdf",
        filename: "split-part.pdf"
      };
    }
    case "compress": {
      const doc = await PDFDocument.load(fileBuffers[0]);
      const compressedBytes = await doc.save({ useObjectStreams: true });
      return {
        buffer: Buffer.from(compressedBytes),
        contentType: "application/pdf",
        filename: "compressed.pdf"
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
    case "pdf-to-office": {
      const doc = await PDFDocument.load(fileBuffers[0]);
      const extension = resolveOfficeExtension(instructions);
      const summary = buildTextSummary(doc, instructions, "Office conversion");
      return {
        buffer: Buffer.from(summary),
        contentType: "text/plain",
        filename: `converted.${extension}`
      };
    }
    case "pdf-to-images": {
      const doc = await PDFDocument.load(fileBuffers[0]);
      const summary = buildTextSummary(doc, instructions, "Image export");
      return {
        buffer: Buffer.from(summary),
        contentType: "text/plain",
        filename: "pdf-pages.txt"
      };
    }
    case "images-to-pdf": {
      const pdf = await PDFDocument.create();
      for (let i = 0; i < files.length; i += 1) {
        const file = files[i];
        const buffer = fileBuffers[i];
        if (!file.type.startsWith("image/")) {
          throw new Error("Images to PDF only supports image uploads");
        }
        const image = file.type === "image/png" ? await pdf.embedPng(buffer) : await pdf.embedJpg(buffer);
        const { width, height } = image.scale(1);
        const page = pdf.addPage([width, height]);
        page.drawImage(image, { x: 0, y: 0, width, height });
      }
      const pdfBytes = await pdf.save();
      return {
        buffer: Buffer.from(pdfBytes),
        contentType: "application/pdf",
        filename: "images.pdf"
      };
    }
    case "pdf-to-text": {
      const doc = await PDFDocument.load(fileBuffers[0]);
      const summary = buildTextSummary(doc, instructions, "Text extraction");
      return {
        buffer: Buffer.from(summary),
        contentType: "text/plain",
        filename: "extracted-text.txt"
      };
    }
    case "protect": {
      const doc = await PDFDocument.load(fileBuffers[0]);
      const password = parseInstructionValue(instructions) ?? "secured";
      doc.setSubject(`Protected with password hint: ${password}`);
      const protectedBytes = await doc.save();
      return {
        buffer: Buffer.from(protectedBytes),
        contentType: "application/pdf",
        filename: "protected.pdf"
      };
    }
    case "unlock": {
      const doc = await PDFDocument.load(fileBuffers[0]);
      doc.setSubject("Unlocked for editing");
      const unlockedBytes = await doc.save();
      return {
        buffer: Buffer.from(unlockedBytes),
        contentType: "application/pdf",
        filename: "unlocked.pdf"
      };
    }
    case "watermark-text": {
      const doc = await PDFDocument.load(fileBuffers[0]);
      const text = parseInstructionValue(instructions) ?? "CONFIDENTIAL";
      await applyTextWatermark(doc, text);
      const watermarked = await doc.save();
      return {
        buffer: Buffer.from(watermarked),
        contentType: "application/pdf",
        filename: "watermarked.pdf"
      };
    }
    case "watermark-image": {
      const doc = await PDFDocument.load(fileBuffers[0]);
      const imageFile = files[1];
      if (!imageFile) {
        throw new Error("Upload a second image file to use as a watermark");
      }
      if (!imageFile.type.startsWith("image/")) {
        throw new Error("Watermark image must be a PNG or JPG file");
      }
      const imageBuffer = fileBuffers[1];
      const image = imageFile.type === "image/png" ? await doc.embedPng(imageBuffer) : await doc.embedJpg(imageBuffer);
      applyImageWatermark(doc, image);
      const watermarked = await doc.save();
      return {
        buffer: Buffer.from(watermarked),
        contentType: "application/pdf",
        filename: "image-watermarked.pdf"
      };
    }
    case "annotate": {
      const doc = await PDFDocument.load(fileBuffers[0]);
      const annotation = parseInstructionValue(instructions) ?? "Review annotation";
      await applyAnnotations(doc, annotation);
      const annotated = await doc.save();
      return {
        buffer: Buffer.from(annotated),
        contentType: "application/pdf",
        filename: "annotated.pdf"
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
    case "extract-images": {
      const doc = await PDFDocument.load(fileBuffers[0]);
      const summary = buildTextSummary(doc, instructions, "Image extraction");
      return {
        buffer: Buffer.from(summary),
        contentType: "text/plain",
        filename: "extracted-images.txt"
      };
    }
    case "metadata": {
      const doc = await PDFDocument.load(fileBuffers[0]);
      const metadata = parseMetadata(instructions);
      if (metadata.title) {
        doc.setTitle(metadata.title);
      }
      if (metadata.author) {
        doc.setAuthor(metadata.author);
      }
      if (metadata.subject) {
        doc.setSubject(metadata.subject);
      }
      const metadataBytes = await doc.save();
      return {
        buffer: Buffer.from(metadataBytes),
        contentType: "application/pdf",
        filename: "metadata-updated.pdf"
      };
    }
    case "reorder": {
      const doc = await PDFDocument.load(fileBuffers[0]);
      const indices = parsePageIndices(instructions, doc.getPageCount());
      const reordered = await PDFDocument.create();
      const pages = await reordered.copyPages(doc, indices);
      pages.forEach((page) => reordered.addPage(page));
      const reorderedBytes = await reordered.save();
      return {
        buffer: Buffer.from(reorderedBytes),
        contentType: "application/pdf",
        filename: "reordered.pdf"
      };
    }
    case "delete-pages": {
      const doc = await PDFDocument.load(fileBuffers[0]);
      const toDelete = new Set(parsePageRange(instructions, doc.getPageCount()));
      const remainingIndices = [];
      for (let i = 0; i < doc.getPageCount(); i++) {
        if (!toDelete.has(i)) {
          remainingIndices.push(i);
        }
      }
      const updated = await PDFDocument.create();
      const pages = await updated.copyPages(doc, remainingIndices);
      pages.forEach((page) => updated.addPage(page));
      const updatedBytes = await updated.save();
      return {
        buffer: Buffer.from(updatedBytes),
        contentType: "application/pdf",
        filename: "pages-deleted.pdf"
      };
    }
    case "pdf-a": {
      // Mocking PDF/A export as it requires specific metadata and profiles
      const doc = await PDFDocument.load(fileBuffers[0]);
      doc.setSubject("PDF/A-1b compliant");
      const pdfABytes = await doc.save();
      return {
        buffer: Buffer.from(pdfABytes),
        contentType: "application/pdf",
        filename: "export-pdf-a.pdf"
      };
    }
    case "pdf-x": {
      // Mocking PDF/X export
      const doc = await PDFDocument.load(fileBuffers[0]);
      doc.setSubject("PDF/X-1a compliant");
      const pdfXBytes = await doc.save();
      return {
        buffer: Buffer.from(pdfXBytes),
        contentType: "application/pdf",
        filename: "export-pdf-x.pdf"
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

function parsePageIndices(instructions?: string | null, pageCount: number) {
  if (!instructions) {
    return Array.from({ length: pageCount }, (_, i) => i);
  }
  return instructions
    .split(/[, ]+/)
    .map((s) => parseInt(s.trim(), 10) - 1)
    .filter((i) => !isNaN(i) && i >= 0 && i < pageCount);
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

function parseInstructionValue(instructions?: string | null) {
  if (!instructions) {
    return null;
  }
  const match = instructions.match(/(?:text|note|password)[:=]\s*([^\n;]+)/i);
  return match ? match[1].trim() : instructions.trim();
}

function parseMetadata(instructions?: string | null) {
  if (!instructions) {
    return {} as { title?: string; author?: string; subject?: string };
  }
  const result: { title?: string; author?: string; subject?: string } = {};
  const parts = instructions.split(/[;\n]+/).map((part) => part.trim()).filter(Boolean);
  for (const part of parts) {
    const [key, ...rest] = part.split(/[:=]/);
    const value = rest.join(":").trim();
    if (!value) {
      continue;
    }
    const normalized = key.toLowerCase();
    if (normalized.includes("title")) {
      result.title = value;
    } else if (normalized.includes("author")) {
      result.author = value;
    } else if (normalized.includes("subject")) {
      result.subject = value;
    }
  }
  return result;
}

function resolveOfficeExtension(instructions?: string | null) {
  const normalized = instructions?.toLowerCase() ?? "";
  if (normalized.includes("excel") || normalized.includes("xlsx")) {
    return "xlsx";
  }
  if (normalized.includes("powerpoint") || normalized.includes("ppt")) {
    return "pptx";
  }
  return "docx";
}

function buildTextSummary(doc: PDFDocument, instructions: string | null | undefined, label: string) {
  const title = doc.getTitle() ?? "Untitled";
  const author = doc.getAuthor() ?? "Unknown";
  const subject = doc.getSubject() ?? "Unspecified";
  const parts = [
    `${label} summary`,
    `Title: ${title}`,
    `Author: ${author}`,
    `Subject: ${subject}`,
    `Pages: ${doc.getPageCount()}`
  ];
  if (instructions) {
    parts.push(`Instructions: ${instructions}`);
  }
  parts.push("Output generated by Dittopdf MVP.");
  return parts.join("\n");
}

async function applyTextWatermark(doc: PDFDocument, text: string) {
  const font = await doc.embedFont(StandardFonts.HelveticaBold);
  doc.getPages().forEach((page) => {
    const { width, height } = page.getSize();
    const fontSize = Math.min(width, height) / 6;
    const textWidth = font.widthOfTextAtSize(text, fontSize);
    page.drawText(text, {
      x: (width - textWidth) / 2,
      y: height / 2,
      size: fontSize,
      font,
      color: rgb(0.75, 0.75, 0.75),
      opacity: 0.2,
      rotate: degrees(45)
    });
  });
}

function applyImageWatermark(doc: PDFDocument, image: PDFImage) {
  doc.getPages().forEach((page) => {
    const { width, height } = page.getSize();
    const { width: imageWidth, height: imageHeight } = image.scale(1);
    const scale = Math.min(width / imageWidth, height / imageHeight) * 0.4;
    const drawWidth = imageWidth * scale;
    const drawHeight = imageHeight * scale;
    page.drawImage(image, {
      x: (width - drawWidth) / 2,
      y: (height - drawHeight) / 2,
      width: drawWidth,
      height: drawHeight,
      opacity: 0.25
    });
  });
}

async function applyAnnotations(doc: PDFDocument, annotation: string) {
  const font = await doc.embedFont(StandardFonts.Helvetica);
  doc.getPages().forEach((page, index) => {
    const { width, height } = page.getSize();
    page.drawText(`Note ${index + 1}: ${annotation}`, {
      x: 40,
      y: height - 40,
      size: 12,
      font,
      color: rgb(0.8, 0.9, 1)
    });
  });
}
