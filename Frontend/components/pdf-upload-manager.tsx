"use client";
import { useState, useRef } from "react";
import type React from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Upload,
  Trash2,
  Check,
  AlertCircle,
  FileUp,
  Search,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

type UploadedPdf = {
  id: string;
  name: string;
  size: number;
  uploadDate: Date;
  category: string;
  indicators: string[];
  url: string;
  selected: boolean;
};

export function PdfUploadManager({
  onPdfSelect,
}: {
  onPdfSelect: (pdfs: UploadedPdf[]) => void;
}) {
  const [uploadedPdfs, setUploadedPdfs] = useState<UploadedPdf[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock categories for PDFs
  const categories = [
    { id: "macroeconomy", name: "Macroeconomy" },
    { id: "energy", name: "Energy & Infrastructure" },
    { id: "labour", name: "Labour Market" },
    { id: "gender", name: "Gender Equality" },
    { id: "health", name: "Health System" },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 100);

    // Process each file
    Array.from(e.target.files).forEach((file) => {
      // Simulate file upload and processing
      setTimeout(() => {
        // Generate random indicators based on file name
        const indicators = generateRandomIndicators(file.name);

        // Determine category based on file name or content
        const category = determineCategory(file.name, indicators);

        const newPdf: UploadedPdf = {
          id: `pdf-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: file.name,
          size: file.size,
          uploadDate: new Date(),
          category,
          indicators,
          url: URL.createObjectURL(file),
          selected: false,
        };

        setUploadedPdfs((prev) => [...prev, newPdf]);
        setUploading(false);
        setUploadProgress(100);

        // Reset progress after a delay
        setTimeout(() => {
          setUploadProgress(0);
        }, 1000);
      }, 2000);
    });

    // Clear the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const generateRandomIndicators = (fileName: string): string[] => {
    // In a real app, this would analyze the PDF content
    // For now, we'll use the filename to determine indicators

    const indicators = [];

    if (
      fileName.toLowerCase().includes("macro") ||
      fileName.toLowerCase().includes("econ")
    ) {
      indicators.push("GDP Growth", "Inflation", "Public Investment");
    }

    if (
      fileName.toLowerCase().includes("energy") ||
      fileName.toLowerCase().includes("infra")
    ) {
      indicators.push(
        "Renewable Energy",
        "Grid Infrastructure",
        "Energy Prices"
      );
    }

    if (
      fileName.toLowerCase().includes("labour") ||
      fileName.toLowerCase().includes("employ")
    ) {
      indicators.push("Unemployment Rate", "Wage Growth", "Job Creation");
    }

    if (
      fileName.toLowerCase().includes("gender") ||
      fileName.toLowerCase().includes("equal")
    ) {
      indicators.push(
        "Gender Pay Gap",
        "Workforce Participation",
        "Leadership Positions"
      );
    }

    // Add some default indicators if none were matched
    if (indicators.length === 0) {
      indicators.push(
        "Economic Growth",
        "Public Policy",
        "Regional Development"
      );
    }

    return indicators;
  };

  const determineCategory = (
    fileName: string,
    indicators: string[]
  ): string => {
    // Determine category based on filename or indicators
    if (
      fileName.toLowerCase().includes("macro") ||
      fileName.toLowerCase().includes("econ")
    ) {
      return "macroeconomy";
    }

    if (
      fileName.toLowerCase().includes("energy") ||
      fileName.toLowerCase().includes("infra")
    ) {
      return "energy";
    }

    if (
      fileName.toLowerCase().includes("labour") ||
      fileName.toLowerCase().includes("employ")
    ) {
      return "labour";
    }

    if (
      fileName.toLowerCase().includes("gender") ||
      fileName.toLowerCase().includes("equal")
    ) {
      return "gender";
    }

    if (
      fileName.toLowerCase().includes("health") ||
      fileName.toLowerCase().includes("care")
    ) {
      return "health";
    }

    // Default category based on indicators
    if (indicators.includes("GDP Growth") || indicators.includes("Inflation")) {
      return "macroeconomy";
    }

    return "macroeconomy"; // Default category
  };

  const togglePdfSelection = (id: string) => {
    setUploadedPdfs((prev) =>
      prev.map((pdf) =>
        pdf.id === id ? { ...pdf, selected: !pdf.selected } : pdf
      )
    );
  };

  const deletePdf = (id: string) => {
    setUploadedPdfs((prev) => prev.filter((pdf) => pdf.id !== id));
  };

  const handleGenerateStory = () => {
    const selectedPdfs = uploadedPdfs.filter((pdf) => pdf.selected);
    if (selectedPdfs.length > 0) {
      onPdfSelect(selectedPdfs);
    }
  };

  const filteredPdfs = uploadedPdfs.filter((pdf) => {
    const matchesSearch =
      pdf.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pdf.indicators.some((ind) =>
        ind.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesCategory =
      selectedCategory === "all" || pdf.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const selectedCount = uploadedPdfs.filter((pdf) => pdf.selected).length;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <FileText className="h-5 w-5 mr-2 text-blue-600" />
            PDF Document Manager
          </div>
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload PDFs
          </Button>
          <Input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
            accept=".pdf"
            multiple
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        {uploading && (
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-1">
              <span>Uploading document...</span>
              <span>{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="h-2" />
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search PDFs by name or indicators..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div>
            <Tabs
              defaultValue="all"
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                {categories.map((category) => (
                  <TabsTrigger key={category.id} value={category.id}>
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>

        {uploadedPdfs.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <FileUp className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No PDFs uploaded yet
            </h3>
            <p className="text-gray-500 mb-4">
              Upload PDFs to analyze and generate cross-indicator stories
            </p>
            <Button onClick={() => fileInputRef.current?.click()}>
              <Upload className="h-4 w-4 mr-2" />
              Upload PDFs
            </Button>
          </div>
        ) : filteredPdfs.length === 0 ? (
          <div className="text-center py-8 border rounded-lg">
            <AlertCircle className="h-8 w-8 mx-auto text-gray-400 mb-2" />
            <p className="text-gray-500">No PDFs match your search criteria</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPdfs.map((pdf) => (
              <div
                key={pdf.id}
                className={`flex items-center p-4 border rounded-lg ${
                  pdf.selected ? "bg-blue-50 border-blue-200" : ""
                }`}
              >
                <div className="mr-4">
                  <Checkbox
                    checked={pdf.selected}
                    onCheckedChange={() => togglePdfSelection(pdf.id)}
                    id={`pdf-${pdf.id}`}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-blue-600" />
                    <Label
                      htmlFor={`pdf-${pdf.id}`}
                      className="font-medium cursor-pointer"
                    >
                      {pdf.name}
                    </Label>
                  </div>
                  <div className="mt-1 text-sm text-gray-500">
                    {(pdf.size / 1024 / 1024).toFixed(2)} MB • Uploaded{" "}
                    {pdf.uploadDate.toLocaleDateString()}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {pdf.indicators.map((indicator, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {indicator}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="ml-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deletePdf(pdf.id)}
                    className="text-gray-500 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-gray-500">
          {selectedCount} of {uploadedPdfs.length} PDFs selected
        </div>
        <Button
          onClick={handleGenerateStory}
          disabled={selectedCount === 0}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Check className="h-4 w-4 mr-2" />
          Use Selected PDFs ({selectedCount})
        </Button>
      </CardFooter>
    </Card>
  );
}
