"use client";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BookOpen,
  TrendingUp,
  Target,
  FileText,
  Download,
  BarChart3,
} from "lucide-react";
import { PdfUploadManager } from "./pdf-upload-manager";
import {
  LineChart as RechartsLineChart,
  Line,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

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

type StoryTemplate = {
  id: string;
  title: string;
  description: string;
  visualizationType: string;
  minPdfs: number;
};

type GeneratedStory = {
  title: string;
  summary: string;
  sections: {
    title: string;
    content: string;
    visualization_type?: string;
  }[];
  insights: string[];
  policy_implications: string[];
};

export function PdfStoryGenerator() {
  const [selectedPdfs, setSelectedPdfs] = useState<UploadedPdf[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [generatedStory, setGeneratedStory] = useState<GeneratedStory | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("upload");

  const storyTemplates: StoryTemplate[] = [
    {
      id: "correlation",
      title: "Correlation Analysis",
      description:
        "Explore statistical relationships between indicators from different documents",
      visualizationType: "scatter",
      minPdfs: 1,
    },
    {
      id: "trend_comparison",
      title: "Trend Comparison",
      description: "Compare trends across time from multiple data sources",
      visualizationType: "line",
      minPdfs: 1,
    },
    {
      id: "distribution_analysis",
      title: "Distribution Analysis",
      description:
        "Analyze how values are distributed across categories from different sources",
      visualizationType: "pie",
      minPdfs: 1,
    },
    {
      id: "impact_assessment",
      title: "Impact Assessment",
      description:
        "Evaluate the impact of one indicator on another across documents",
      visualizationType: "bar",
      minPdfs: 1,
    },
  ];

  const handlePdfSelect = (pdfs: UploadedPdf[]) => {
    setSelectedPdfs(pdfs);
    setActiveTab("configure");
  };

  const generateStory = async () => {
    if (!selectedTemplate || selectedPdfs.length === 0) return;

    setLoading(true);

    try {
      // Call your integrated Flask API
      const response = await fetch(
        "http://127.0.0.1:5000/api/pdf/generate_story",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            pdf_ids: selectedPdfs.map((pdf) => pdf.id),
            template_id: selectedTemplate,
          }),
        }
      );

      if (response.ok) {
        const story = await response.json();
        setGeneratedStory(story);
        setActiveTab("story");
      } else {
        // Fallback to mock data for development
        const mockStory = generateMockStory();
        setGeneratedStory(mockStory);
        setActiveTab("story");
      }
    } catch (error) {
      console.error("Error generating story:", error);
      // Fallback to mock data
      const mockStory = generateMockStory();
      setGeneratedStory(mockStory);
      setActiveTab("story");
    } finally {
      setLoading(false);
    }
  };

  const generateMockStory = () => {
    const template = storyTemplates.find((t) => t.id === selectedTemplate);
    const allIndicators = selectedPdfs.flatMap((pdf) => pdf.indicators);
    const uniqueIndicators = [...new Set(allIndicators)];

    return {
      title: `Analysis of ${uniqueIndicators.slice(0, 2).join(" and ")} from ${
        selectedPdfs.length
      } Documents`,
      summary: `Cross-document analysis of ${uniqueIndicators
        .slice(0, 2)
        .join(" and ")} based on ${selectedPdfs.map((p) => p.name).join(", ")}`,
      sections: [
        {
          title: "Data Analysis",
          content: `Analysis of ${uniqueIndicators
            .slice(0, 2)
            .join(
              " and "
            )} across selected documents reveals significant patterns.`,
          visualization_type: template?.visualizationType,
        },
      ],
      insights: [
        `Key relationships found between ${uniqueIndicators
          .slice(0, 2)
          .join(" and ")}`,
      ],
      policy_implications: [
        `Policy recommendations based on ${selectedPdfs.length} document analysis`,
      ],
    };
  };

  const renderVisualizationPlaceholder = (type: string) => {
    if (!selectedPdfs.length) return null;

    // Extract unique indicators from selected PDFs
    const allIndicators = selectedPdfs.flatMap((pdf) => pdf.indicators);
    const uniqueIndicators = [...new Set(allIndicators)];
    const indicator1 = uniqueIndicators[0] || "Indicator 1";
    const indicator2 = uniqueIndicators[1] || "Indicator 2";

    // Generate data based on PDF names and indicators
    const generateDynamicData = () => {
      const pdfNames = selectedPdfs.map((pdf) =>
        pdf.name.replace(".pdf", "").substring(0, 10)
      );

      switch (type) {
        case "scatter":
          return selectedPdfs.flatMap((pdf, pdfIndex) =>
            Array.from({ length: 5 }, (_, i) => ({
              x: Math.random() * 100 + pdfIndex * 10,
              y: Math.random() * 100 + pdfIndex * 15,
              name: `${pdf.name.substring(0, 8)} - Point ${i + 1}`,
              pdf: pdf.name,
            }))
          );

        case "line":
          const months = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ];
          return months.map((month, i) => {
            const dataPoint: any = { month };
            selectedPdfs.forEach((pdf, pdfIndex) => {
              dataPoint[pdf.name.substring(0, 10)] =
                Math.random() * 50 +
                25 +
                pdfIndex * 10 +
                Math.sin(i * 0.5) * 10;
              // Clean the PDF name to be a valid object key
              const pdfKey = pdf.name
                .substring(0, 10)
                .replace(/[^a-zA-Z0-9]/g, "_");
              // Generate trend data with some variation
              const baseValue = 30 + pdfIndex * 15;
              const seasonalVariation = Math.sin((i * Math.PI) / 6) * 10;
              const randomVariation = (Math.random() - 0.5) * 8;
              dataPoint[pdfKey] = Math.max(
                0,
                baseValue + seasonalVariation + randomVariation + i * 2
              );
            });
            return dataPoint;
          });

        case "pie":
          return selectedPdfs.map((pdf, index) => ({
            name: pdf.name.replace(".pdf", "").substring(0, 15),
            value: Math.random() * 30 + 10,
            fill: `hsl(${(index * 360) / selectedPdfs.length}, 70%, 50%)`,
          }));

        case "bar":
          return uniqueIndicators.slice(0, 6).map((indicator, i) => {
            const dataPoint: any = { category: indicator.substring(0, 12) };
            selectedPdfs.forEach((pdf, pdfIndex) => {
              dataPoint[pdf.name.substring(0, 10)] =
                Math.random() * 80 + 20 + pdfIndex * 5;
            });
            return dataPoint;
          });

        default:
          return [];
      }
    };

    const data = generateDynamicData();
    const colors = [
      "#8884d8",
      "#82ca9d",
      "#ffc658",
      "#ff7300",
      "#00ff00",
      "#ff00ff",
    ];

    switch (type) {
      case "scatter":
        return (
          <div className="w-full h-80">
            <h4 className="text-sm font-medium mb-2 text-center">
              Correlation: {indicator1} vs {indicator2}
            </h4>
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="x" name={indicator1} />
                <YAxis dataKey="y" name={indicator2} />
                <Tooltip
                  formatter={(value, name) => [
                    typeof value === "number" ? value.toFixed(2) : value,
                    name,
                  ]}
                  labelFormatter={(label) => `Data Point: ${label}`}
                />
                {selectedPdfs.map((pdf, index) => (
                  <Scatter
                    key={pdf.id}
                    dataKey="y"
                    data={data.filter((d) => d.pdf === pdf.name)}
                    fill={colors[index % colors.length]}
                    name={pdf.name.substring(0, 10)}
                  />
                ))}
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        );

      case "line":
        return (
          <div className="w-full h-80">
            <h4 className="text-sm font-medium mb-2 text-center">
              Trend Comparison:{" "}
              {selectedPdfs.map((p) => p.name.substring(0, 10)).join(" vs ")}
            </h4>
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                {selectedPdfs.map((pdf, index) => {
                  const pdfKey = pdf.name
                    .substring(0, 10)
                    .replace(/[^a-zA-Z0-9]/g, "_");
                  return (
                    <Line
                      key={pdf.id}
                      type="monotone"
                      dataKey={pdfKey}
                      stroke={colors[index % colors.length]}
                      strokeWidth={2}
                      name={pdf.name.replace(".pdf", "")}
                      connectNulls={false}
                    />
                  );
                })}
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>
        );

      case "pie":
        return (
          <div className="w-full h-80">
            <h4 className="text-sm font-medium mb-2 text-center">
              Distribution Across {selectedPdfs.length} Documents
            </h4>
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [
                    `${Number(value).toFixed(1)}%`,
                    "Percentage",
                  ]}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        );

      case "bar":
        return (
          <div className="w-full h-80">
            <h4 className="text-sm font-medium mb-2 text-center">
              Comparative Analysis: {uniqueIndicators.slice(0, 2).join(" vs ")}
            </h4>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                {selectedPdfs.map((pdf, index) => (
                  <Bar
                    key={pdf.id}
                    dataKey={pdf.name.substring(0, 10)}
                    fill={colors[index % colors.length]}
                    name={pdf.name.replace(".pdf", "")}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 mx-auto text-gray-400 mb-2" />
              <p className="text-gray-500">Visualization not available</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upload">1. Upload PDFs</TabsTrigger>
          <TabsTrigger value="configure" disabled={selectedPdfs.length === 0}>
            2. Configure Story
          </TabsTrigger>
          <TabsTrigger value="story" disabled={!generatedStory}>
            3. Generated Story
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="mt-6">
          <PdfUploadManager onPdfSelect={handlePdfSelect} />
        </TabsContent>

        <TabsContent value="configure" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
                Configure Cross-Document Story
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">
                  Selected Documents ({selectedPdfs.length})
                </h3>
                <div className="space-y-2">
                  {selectedPdfs.map((pdf) => (
                    <div
                      key={pdf.id}
                      className="flex items-center p-3 bg-blue-50 rounded-lg"
                    >
                      <FileText className="h-5 w-5 mr-2 text-blue-600" />
                      <div>
                        <p className="font-medium">{pdf.name}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {pdf.indicators.map((indicator, i) => (
                            <Badge
                              key={i}
                              variant="outline"
                              className="text-xs"
                            >
                              {indicator}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">
                  Select Story Template
                </h3>
                <Select
                  value={selectedTemplate}
                  onValueChange={setSelectedTemplate}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a story template" />
                  </SelectTrigger>
                  <SelectContent>
                    {storyTemplates
                      .filter(
                        (template) => template.minPdfs <= selectedPdfs.length
                      )
                      .map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.title}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>

                {selectedTemplate && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-1">
                      {
                        storyTemplates.find((t) => t.id === selectedTemplate)
                          ?.title
                      }
                    </h4>
                    <p className="text-sm text-gray-600">
                      {
                        storyTemplates.find((t) => t.id === selectedTemplate)
                          ?.description
                      }
                    </p>
                  </div>
                )}
              </div>

              <Button
                onClick={generateStory}
                disabled={!selectedTemplate || loading}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {loading
                  ? "Generating Story..."
                  : "Generate Cross-Document Story"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="story" className="mt-6">
          {generatedStory && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl mb-2">
                      {generatedStory.title}
                    </CardTitle>
                    <p className="text-gray-600">{generatedStory.summary}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export Story
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="narrative" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="narrative">Narrative</TabsTrigger>
                    <TabsTrigger value="insights">Insights</TabsTrigger>
                    <TabsTrigger value="policy">
                      Policy Implications
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="narrative" className="mt-6 space-y-8">
                    {generatedStory.sections.map((section, index) => (
                      <div key={index}>
                        <h3 className="text-xl font-semibold mb-4">
                          {section.title}
                        </h3>
                        <div className="prose prose-gray max-w-none mb-6">
                          {section.content
                            .split("\n\n")
                            .map((paragraph, pIndex) => (
                              <p key={pIndex} className="mb-4">
                                {paragraph}
                              </p>
                            ))}
                        </div>
                        {section.visualization_type && (
                          <div className="mt-6">
                            {renderVisualizationPlaceholder(
                              section.visualization_type
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="insights" className="mt-6">
                    <div className="grid gap-4">
                      {generatedStory.insights.map((insight, index) => (
                        <div
                          key={index}
                          className="flex items-start p-4 bg-blue-50 rounded-lg"
                        >
                          <TrendingUp className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                          <p className="text-gray-700">{insight}</p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="policy" className="mt-6">
                    <div className="grid gap-4">
                      {generatedStory.policy_implications.map(
                        (implication, index) => (
                          <div
                            key={index}
                            className="flex items-start p-4 bg-green-50 rounded-lg"
                          >
                            <Target className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                            <p className="text-gray-700">{implication}</p>
                          </div>
                        )
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-sm text-gray-500">
                  Based on {selectedPdfs.length} documents with{" "}
                  {selectedPdfs.flatMap((pdf) => pdf.indicators).length} total
                  indicators
                </div>
                <Button
                  onClick={() => setActiveTab("upload")}
                  variant="outline"
                >
                  Start New Analysis
                </Button>
              </CardFooter>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
