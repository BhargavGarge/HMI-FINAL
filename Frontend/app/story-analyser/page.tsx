"use client";
import { PdfStoryGenerator } from "@/components/pdf-story-generator";

export default function PdfAnalysisPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">
          PDF Cross-Indicator Analysis
        </h1>
        <p className="text-gray-600 mb-8">
          Upload PDFs, analyze relationships between indicators, and generate
          comprehensive data stories
        </p>

        <PdfStoryGenerator />
      </div>
    </div>
  );
}
