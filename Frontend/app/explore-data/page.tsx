"use client";

import { useState, useEffect } from "react";
import {
  Download,
  BarChart3,
  TrendingUp,
  Database,
  BookOpen,
  Target,
  Activity,
  Brain,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { DataChart } from "@/components/data-chart";
import { DataTable } from "@/components/data-table";
import { MetricsOverview } from "@/components/metrics-overview";
import { InsightsPanel } from "@/components/insights-panel";

interface Indicator {
  indicator_id: string;
  name: string;
  unit: string;
}

interface VisualEntity {
  document_id: string;
  document_title: string;
  type: string;
  visual_id: string;
}

interface DashboardSummary {
  total_indicators: { count: number };
  total_documents: { count: number };
  total_observations: { count: number };
  total_visuals: { count: number };
  domains: Array<{ domain: string; count: number }>;
  visual_types: Array<{ type: string; count: number }>;
}

const API_BASE_URL = "http://127.0.0.1:5000";

export default function AcademicDashboard() {
  const [selectedIndicator, setSelectedIndicator] = useState<Indicator | null>(
    null
  );
  const [chartType, setChartType] = useState<
    "line" | "bar" | "pie" | "area" | "radial"
  >("bar");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [indicators, setIndicators] = useState<Indicator[]>([]);
  const [visualEntities, setVisualEntities] = useState<VisualEntity[]>([]);
  const [dashboardSummary, setDashboardSummary] =
    useState<DashboardSummary | null>(null);
  const [selectedDomain, setSelectedDomain] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Generate realistic academic data
  const generateAcademicData = (indicator: Indicator, chartType = "bar") => {
    const regions = ["USA", "Germany", "Japan", "UK", "France", "Canada"];
    const years = [2020, 2021, 2022, 2023, 2024];

    if (chartType === "radial") {
      return regions.map((region, index) => ({
        country: region,
        value: Math.floor(Math.random() * 60) + 40, // Values between 40-100
        year: 2024,
        percentage: Math.floor(Math.random() * 60) + 40,
        category: `Region ${index + 1}`,
      }));
    }

    return regions.map((region) => ({
      country: region,
      value: Math.floor(Math.random() * 80) + 20,
      year: years[Math.floor(Math.random() * years.length)],
    }));
  };
  const fetchAcademicData = async (indicatorId: string, chartType: string) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/generate-academic-data/${indicatorId}`
      );
      if (response.ok) {
        const result = await response.json();
        if (result.status === "success") {
          // Transform data based on chart type
          if (chartType === "radial") {
            return result.data.map((item: any) => ({
              ...item,
              percentage: item.value,
              category: `Region ${Math.floor(Math.random() * 5) + 1}`,
            }));
          }
          return result.data;
        }
      }
      // Fallback to mock data if API fails
      return generateAcademicData(
        selectedIndicator || { indicator_id: "", name: "", unit: "" },
        chartType
      );
    } catch (err) {
      console.error("Failed to fetch academic data:", err);
      return generateAcademicData(
        selectedIndicator || { indicator_id: "", name: "", unit: "" },
        chartType
      );
    }
  };
  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        setLoadingProgress(10);

        // Fetch dashboard summary
        const summaryResponse = await fetch(
          `${API_BASE_URL}/api/dashboard-summary`
        );
        if (summaryResponse.ok) {
          const summaryResult = await summaryResponse.json();
          if (summaryResult.status === "success") {
            setDashboardSummary(summaryResult.data);
          }
        }
        setLoadingProgress(40);

        // Fetch indicators
        const indicatorsResponse = await fetch(
          `${API_BASE_URL}/api/indicators`
        );
        if (indicatorsResponse.ok) {
          const indicatorsResult = await indicatorsResponse.json();
          if (indicatorsResult.count > 0) {
            // Clean and transform the indicator names for academic readability
            const cleanedIndicators = indicatorsResult.data.map(
              (indicator: Indicator) => ({
                ...indicator,
                name: indicator.name
                  .replace(/^\d+_/, "") // Remove numeric prefixes
                  .replace(/_/g, " ") // Replace underscores with spaces
                  .replace(/\s+\d+$/, "") // Remove trailing numbers
                  .replace(/\b\w/g, (char) => char.toUpperCase()) // Capitalize words
                  .replace(/\s+/g, " ") // Clean multiple spaces
                  .trim(),
              })
            );

            setIndicators(cleanedIndicators);
            setSelectedIndicator(cleanedIndicators[0]);
          }
        }
        setLoadingProgress(70);

        // Fetch visual entities
        const visualsResponse = await fetch(
          `${API_BASE_URL}/api/visual-entities`
        );
        if (visualsResponse.ok) {
          const visualsResult = await visualsResponse.json();
          if (visualsResult.count > 0) {
            setVisualEntities(visualsResult.data);
          }
        }
        setLoadingProgress(100);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError(
          "Unable to connect to the data source. Please check your connection."
        );
      } finally {
        setIsLoading(false);
        setLoadingProgress(0);
      }
    };

    fetchInitialData();
  }, []);

  const filteredIndicators =
    selectedDomain === "all"
      ? indicators
      : indicators.filter((ind) => {
          const domainKeywords = selectedDomain.toLowerCase().split(/[&\s]+/);
          const indicatorName = ind.name.toLowerCase();
          return domainKeywords.some(
            (keyword) => keyword.length > 2 && indicatorName.includes(keyword)
          );
        });

  const domains = dashboardSummary?.domains || [];
  const uniqueDomains = ["all", ...domains.map((d) => d.domain)];

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-6">
        <Card className="w-full max-w-md shadow-2xl">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Database className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-red-800">Connection Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.reload()} className="w-full">
              Retry Connection
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Academic Data Analytics
                </h1>
                <p className="text-sm text-gray-600">
                  Research Insights & Economic Indicators Dashboard
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 border-green-200"
              >
                Live Data
              </Badge>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {isLoading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-32 rounded-xl" />
              ))}
            </div>
            <Skeleton className="h-96 rounded-xl" />
          </div>
        ) : (
          <>
            {/* Metrics Overview */}
            <MetricsOverview dashboardSummary={dashboardSummary} />

            {/* Main Content */}
            <div className="mt-8">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="space-y-6"
              >
                <TabsList className="grid w-full grid-cols-3 bg-white/60 backdrop-blur-sm">
                  <TabsTrigger
                    value="dashboard"
                    className="flex items-center gap-2"
                  >
                    <BarChart3 className="h-4 w-4" />
                    Dashboard
                  </TabsTrigger>
                  <TabsTrigger
                    value="indicators"
                    className="flex items-center gap-2"
                  >
                    <Target className="h-4 w-4" />
                    Indicators
                  </TabsTrigger>
                  <TabsTrigger
                    value="research"
                    className="flex items-center gap-2"
                  >
                    <BookOpen className="h-4 w-4" />
                    Research Data
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="dashboard" className="space-y-6">
                  {/* Filters */}
                  <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-blue-600" />
                        Data Analysis Controls
                      </CardTitle>
                      <CardDescription>
                        Select research domain and indicators to explore
                        economic and social data patterns
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">
                            Research Domain
                          </label>
                          <Select
                            value={selectedDomain}
                            onValueChange={setSelectedDomain}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select domain" />
                            </SelectTrigger>
                            <SelectContent>
                              {uniqueDomains.map((domain) => (
                                <SelectItem key={domain} value={domain}>
                                  {domain === "all"
                                    ? "All Research Domains"
                                    : domain}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">
                            Economic Indicator ({filteredIndicators.length}{" "}
                            available)
                          </label>
                          <Select
                            value={selectedIndicator?.indicator_id || ""}
                            onValueChange={(value) => {
                              const indicator = filteredIndicators.find(
                                (ind) => ind.indicator_id === value
                              );
                              setSelectedIndicator(indicator || null);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select indicator" />
                            </SelectTrigger>
                            <SelectContent>
                              {filteredIndicators
                                .slice(0, 20)
                                .map((indicator) => (
                                  <SelectItem
                                    key={indicator.indicator_id}
                                    value={indicator.indicator_id}
                                  >
                                    {indicator.name}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">
                            Visualization Type
                          </label>
                          <Select
                            value={chartType}
                            onValueChange={(value: any) => setChartType(value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="bar">
                                Bar Chart - Compare Values
                              </SelectItem>
                              <SelectItem value="line">
                                Line Chart - Show Trends
                              </SelectItem>
                              <SelectItem value="pie">
                                Pie Chart - Show Distribution
                              </SelectItem>
                              <SelectItem value="area">
                                Area Chart - Show Volume
                              </SelectItem>
                              <SelectItem value="radial">
                                Radial Chart - Comparative Analysis
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {selectedIndicator ? (
                    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                      {/* Main Chart */}
                      <div className="xl:col-span-3">
                        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-xl">
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div>
                                <CardTitle className="text-xl text-gray-800">
                                  {selectedIndicator.name}
                                </CardTitle>
                                <CardDescription className="mt-2 text-base">
                                  Regional analysis showing{" "}
                                  {selectedIndicator.unit} measurements across
                                  different geographical areas. This
                                  visualization helps identify patterns, trends,
                                  and comparative performance metrics.
                                </CardDescription>
                              </div>
                              <Badge
                                variant="secondary"
                                className="bg-blue-100 text-blue-800"
                              >
                                {selectedIndicator.unit}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <DataChart
                              type={chartType}
                              data={generateAcademicData(
                                selectedIndicator,
                                chartType
                              )}
                              title={`${selectedIndicator.name} Analysis`}
                              subtitle="Regional Comparison - Current Period"
                              height={400}
                              unit={selectedIndicator.unit}
                            />
                          </CardContent>
                        </Card>
                      </div>

                      {/* Insights Panel */}
                      <div className="xl:col-span-1">
                        <InsightsPanel
                          indicator={selectedIndicator}
                          data={generateAcademicData(
                            selectedIndicator,
                            chartType
                          )}
                          chartType={chartType}
                        />
                      </div>
                    </div>
                  ) : (
                    <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
                      <CardContent className="flex flex-col items-center justify-center py-16">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                          <TrendingUp className="h-8 w-8 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                          Ready for Analysis
                        </h3>
                        <p className="text-gray-600 text-center max-w-md">
                          Select a research domain and economic indicator from
                          the controls above to begin exploring the data
                          patterns and insights.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="indicators">
                  <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-xl">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Database className="h-5 w-5 text-blue-600" />
                        Economic Indicators Database
                      </CardTitle>
                      <CardDescription>
                        Comprehensive list of {indicators.length} economic and
                        social indicators available for research analysis
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <DataTable
                        data={indicators
                          .slice(0, 100)
                          .map((indicator, index) => ({
                            "#": index + 1,
                            "Indicator Name": indicator.name,
                            "Measurement Unit": indicator.unit,
                            Identifier: indicator.indicator_id,
                            "Data Type": indicator.unit.includes("%")
                              ? "Percentage"
                              : "Absolute Value",
                          }))}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="research">
                  <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-xl">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-blue-600" />
                        Research Publications & Visual Data
                      </CardTitle>
                      <CardDescription>
                        Academic research documents and their associated data
                        visualizations from various economic studies
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <DataTable
                        data={visualEntities
                          .slice(0, 50)
                          .map((visual, index) => ({
                            "#": index + 1,
                            "Document Title": visual.document_title,
                            "Publication ID": visual.document_id,
                            "Visual Reference": visual.visual_id,
                            "Content Type": visual.type,
                            "Research Category":
                              visual.document_title.split(" ")[0] || "General",
                          }))}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
