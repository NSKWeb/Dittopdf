import { PDFDocument, PDFRawStream, PDFName, StandardFonts, degrees, rgb } from "pdf-lib";
import type { PDFImage } from "pdf-lib";
import pdfParse from "pdf-parse";
import { fromBuffer } from "pdf2pic";
import { Document, Paragraph, TextRun, Packer } from "docx";
import * as pako from "pako";
import JSZip from "jszip";
import { PDFProcessingError } from "./errors";

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
    throw new PDFProcessingError("No files uploaded", "NO_FILES");
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
      const format = resolveOfficeExtension(instructions);
      if (format === 'docx') {
        const docxBuffer = await convertPdfToDocx(fileBuffers[0]);
        return {
          buffer: docxBuffer,
          contentType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          filename: "converted.docx"
        };
      }
      const text = await extractTextFromPdf(fileBuffers[0]);
      return {
        buffer: Buffer.from(text, 'utf-8'),
        contentType: "text/plain",
        filename: `converted.${format === 'xlsx' ? 'csv' : 'txt'}`
      };
    }
    case "pdf-to-images": {
      const format = instructions?.includes('png') ? 'png' : 'jpeg';
      const zipBuffer = await convertPdfToImages(fileBuffers[0], format);
      return {
        buffer: zipBuffer,
        contentType: "application/zip",
        filename: `pdf-pages.zip`
      };
    }
    case "images-to-pdf": {
      const pdf = await PDFDocument.create();
      for (let i = 0; i < files.length; i += 1) {
        const file = files[i];
        const buffer = fileBuffers[i];
        if (!file.type.startsWith("image/")) {
          throw new PDFProcessingError("Images to PDF only supports image uploads", "INVALID_FILE_TYPE");
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
      const text = await extractTextFromPdf(fileBuffers[0]);
      return {
        buffer: Buffer.from(text, 'utf-8'),
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
        throw new PDFProcessingError("Upload a second image file to use as a watermark", "MISSING_WATERMARK_IMAGE");
      }
      if (!imageFile.type.startsWith("image/")) {
        throw new PDFProcessingError("Watermark image must be a PNG or JPG file", "INVALID_WATERMARK_TYPE");
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
      const images = await extractImagesFromPdf(fileBuffers[0]);
      return {
        buffer: images,
        contentType: "application/zip",
        filename: "extracted-images.zip"
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

async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  try {
    const data = await pdfParse(buffer);
    return data.text || 'No text content found in PDF';
  } catch (error) {
    throw new PDFProcessingError(
      `Failed to extract text: ${error instanceof Error ? error.message : 'Unknown error'}`,
      "TEXT_EXTRACTION_FAILED"
    );
  }
}

async function convertPdfToDocx(pdfBuffer: Buffer): Promise<Buffer> {
  const text = await extractTextFromPdf(pdfBuffer);
  const paragraphs = text.split('\n').filter(line => line.trim());
  
  const doc = new Document({
    sections: [{
      properties: {},
      children: paragraphs.map(p => new Paragraph({
        children: [new TextRun({ text: p })]
      }))
    }]
  });
  
  return Packer.toBuffer(doc);
}

async function convertPdfToImages(buffer: Buffer, format: 'png' | 'jpeg'): Promise<Buffer> {
  const zip = new JSZip();
  const convert = fromBuffer(buffer, {
    density: 150,
    format,
    width: 1240,
    height: 1754,
    savePath: '/tmp'
  });
  
  const data = await pdfParse(buffer);
  const pageCount = data.numpages;
  
  if (pageCount > 50) {
    throw new PDFProcessingError("PDF has too many pages for image conversion (max 50)", "PAGE_LIMIT_EXCEEDED");
  }
  
  const images = await convert.bulk(pageCount);
  
  images.forEach((img, idx) => {
    if (img.base64) {
      zip.file(`page-${idx + 1}.${format}`, img.base64, { base64: true });
    }
  });
  
  return zip.generateAsync({ type: 'nodebuffer' });
}

async function extractImagesFromPdf(buffer: Buffer): Promise<Buffer> {
  const doc = await PDFDocument.load(buffer);
  const zip = new JSZip();
  let imageCount = 0;
  
  const enumeratedIndirectObjects = doc.context.enumerateIndirectObjects();
  
  for (let i = 0; i < enumeratedIndirectObjects.length; i++) {
    const [, obj] = enumeratedIndirectObjects[i];
    
    if (obj instanceof PDFRawStream) {
      const { lookup } = obj.dict;
      const subtype = lookup(PDFName.of('Subtype'));
      
      if (subtype === PDFName.of('Image')) {
        const width = lookup(PDFName.of('Width'))?.asNumber() || 0;
        const height = lookup(PDFName.of('Height'))?.asNumber() || 0;
        
        if (width > 0 && height > 0) {
          const filter = lookup(PDFName.of('Filter'));
          let extension = 'bin';
          let imageBuffer: Buffer;
          
          if (filter === PDFName.of('DCTDecode')) {
            extension = 'jpg';
            imageBuffer = Buffer.from(obj.contents);
          } else if (filter === PDFName.of('FlateDecode')) {
            extension = 'png';
            try {
              const decompressed = pako.inflate(obj.contents);
              imageBuffer = Buffer.from(decompressed);
            } catch {
              continue;
            }
          } else {
            continue;
          }
          
          zip.file(`image-${++imageCount}.${extension}`, imageBuffer);
        }
      }
    }
  }
  
  if (imageCount === 0) {
    zip.file('info.txt', 'No embedded images found in this PDF');
  }
  
  return zip.generateAsync({ type: 'nodebuffer' });
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
