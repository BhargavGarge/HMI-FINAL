"use client";

import { useState, useEffect } from "react";
import {
  Download,
  LineChartIcon,
  BarChartIcon,
  PieChartIcon,
  TrendingUp,
  Database,
  Info,
  AlertCircle,
  Sparkles,
  Activity,
  Target,
  Circle,
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
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { DataChart } from "@/components/data-chart";
import { DataTable } from "@/components/data-table";
import { generateChartSummary, getChartInsights } from "@/utils/chart-analyzer";
import { initGeminiAPI, generateChartDescription } from "@/utils/gemini-helper";
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

export default function ExplorePage() {
  const [selectedIndicator, setSelectedIndicator] = useState<Indicator | null>(
    null
  );
  const [viewMode, setViewMode] = useState<"chart" | "table">("chart");
  const [chartType, setChartType] = useState<
    "line" | "bar" | "pie" | "area" | "radial" | "scatter" | "donut"
  >("bar");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [indicators, setIndicators] = useState<Indicator[]>([]);
  const [visualEntities, setVisualEntities] = useState<VisualEntity[]>([]);
  const [dashboardSummary, setDashboardSummary] =
    useState<DashboardSummary | null>(null);
  const [timeRange, setTimeRange] = useState<[number, number]>([2020, 2024]);
  const [selectedDomain, setSelectedDomain] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("overview");
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [chartSummary, setChartSummary] = useState<string>("");
  const [chartInsights, setChartInsights] = useState<string[]>([]);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  // Mock chart data for demonstration
  const generateMockChartData = (indicator: Indicator, chartType = "bar") => {
    const countries = ["USA", "Germany", "Japan", "UK", "France", "Canada"];
    const years = [2020, 2021, 2022, 2023, 2024];

    if (chartType === "radial") {
      // Generate data more suitable for radial charts with meaningful ranges
      return countries.map((country, index) => ({
        country,
        value: Math.floor(Math.random() * 80) + 20, // Values between 20-100
        year: years[Math.floor(Math.random() * years.length)],
        percentage: Math.floor(Math.random() * 80) + 20, // For radial display
        category: `Category ${index + 1}`,
      }));
    }

    return countries.map((country) => ({
      country,
      value: Math.floor(Math.random() * 100) + 10,
      year: years[Math.floor(Math.random() * years.length)],
    }));
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
            // Clean and transform the indicator names
            const cleanedIndicators = indicatorsResult.data.map(
              (indicator: Indicator) => ({
                ...indicator,
                // Apply regex transformations to the name
                name: indicator.name
                  .replace(/^\d_/, "") // Remove prefix (1_, 2_, etc.)
                  .replace(/_/g, " ") // Replace underscores with spaces
                  .replace(/\s+\d+$/, "") // Remove trailing numbers (_1, _2)
                  .replace(/\bdata\b/gi, "") // Remove redundant "data" (case-insensitive)
                  .trim() // Trim whitespace
                  .replace(/\b\w/g, (char) => char.toUpperCase()), // Capitalize words
              })
            );

            setIndicators(cleanedIndicators);
            setSelectedIndicator(cleanedIndicators[0]); // Set first cleaned indicator as selected
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
        setError("Failed to load data from API");
      } finally {
        setIsLoading(false);
        setLoadingProgress(0);
      }
    };

    fetchInitialData();
  }, []);
  useEffect(() => {
    if (selectedIndicator && chartType) {
      generateChartAnalysis();
    }
  }, [selectedIndicator, chartType, timeRange]);
  const filteredIndicators =
    selectedDomain === "all"
      ? indicators
      : indicators.filter((ind) => {
          // Check if indicator name contains domain keywords
          const domainKeywords = selectedDomain.toLowerCase().split(/[&\s]+/);
          const indicatorName = ind.name.toLowerCase();

          // Return true if any domain keyword is found in the indicator name
          return domainKeywords.some(
            (keyword) => keyword.length > 2 && indicatorName.includes(keyword)
          );
        });

  console.log("Selected domain:", selectedDomain);
  console.log("Total indicators:", indicators.length);
  console.log("Filtered indicators:", filteredIndicators.length);

  const handleTimeRangeChange = (values: number[]) => {
    setTimeRange([values[0], values[1]]);
  };

  const handleChartTypeChange = (type: typeof chartType) => {
    setChartType(type);
  };

  const domains = dashboardSummary?.domains || [];
  const uniqueDomains = ["all", ...domains.map((d) => d.domain)];

  const getDataQualityScore = () => {
    return Math.floor(Math.random() * 30) + 70; // Mock score between 70-100
  };
  const generateChartAnalysis = async () => {
    if (!selectedIndicator) return;

    setIsGeneratingDescription(true);

    try {
      // First generate the basic summary
      const summary = generateChartSummary(
        chartType,
        generateMockChartData(selectedIndicator, chartType),
        {
          name: selectedIndicator.name,
          category: selectedIndicator.name.split(/[:\-]/)[0] || "General",
          unit: selectedIndicator.unit,
        },
        {
          countries: ["USA", "Germany", "Japan", "UK", "France", "Canada"],
          years: [2020, 2021, 2022, 2023, 2024],
        }
      );
      setChartSummary(summary);

      // Then get insights
      const insights = getChartInsights(
        chartType,
        generateMockChartData(selectedIndicator, chartType),
        {
          name: selectedIndicator.name,
          category: selectedIndicator.name.split(/[:\-]/)[0] || "General",
          unit: selectedIndicator.unit,
        }
      );
      setChartInsights(insights);

      // Finally generate AI-enhanced description
      const aiDescription = await generateChartDescription(
        chartType,
        generateMockChartData(selectedIndicator, chartType),
        {
          name: selectedIndicator.name,
          category: selectedIndicator.name.split(/[:\-]/)[0] || "General",
          unit: selectedIndicator.unit,
        },
        {
          countries: ["USA", "Germany", "Japan", "UK", "France", "Canada"],
          years: [2020, 2021, 2022, 2023, 2024],
        }
      );

      if (aiDescription) {
        setChartSummary(aiDescription);
      }
    } catch (error) {
      console.error("Error generating chart analysis:", error);
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Error Loading Data
            </CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Sidebar className="border-r border-slate-200 backdrop-blur-sm bg-white/95">
          <SidebarHeader className="border-b px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              <h2 className="text-lg font-semibold">Data Explorer</h2>
            </div>
            {dashboardSummary && (
              <div className="grid grid-cols-2 gap-2 mt-3">
                <div className="text-center p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <div className="text-2xl font-bold">
                    {dashboardSummary.total_indicators.count}
                  </div>
                  <div className="text-xs opacity-90">Indicators</div>
                </div>
                <div className="text-center p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <div className="text-2xl font-bold">
                    {dashboardSummary.total_observations.count}
                  </div>
                  <div className="text-xs opacity-90">Data Points</div>
                </div>
              </div>
            )}
          </SidebarHeader>

          <SidebarContent className="bg-white/95 backdrop-blur-sm">
            {loadingProgress > 0 && (
              <div className="px-6 py-2">
                <Progress value={loadingProgress} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  Loading data...
                </p>
              </div>
            )}

            <SidebarGroup>
              <SidebarGroupLabel>Domain Filter</SidebarGroupLabel>
              <SidebarGroupContent>
                <Select
                  value={selectedDomain}
                  onValueChange={setSelectedDomain}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select domain" />
                  </SelectTrigger>
                  <SelectContent>
                    {uniqueDomains.map((domain) => (
                      <SelectItem key={domain} value={domain}>
                        {domain === "all" ? "All Domains" : domain}
                        {domain !== "all" && (
                          <Badge variant="secondary" className="ml-2">
                            {domains.find((d) => d.domain === domain)?.count ||
                              0}
                          </Badge>
                        )}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>
                Indicators ({filteredIndicators.length})
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="max-h-96 overflow-y-auto">
                  <SidebarMenu>
                    {filteredIndicators.length > 0 ? (
                      filteredIndicators.slice(0, 50).map((indicator) => (
                        <SidebarMenuItem key={indicator.indicator_id}>
                          <SidebarMenuButton
                            isActive={
                              selectedIndicator?.indicator_id ===
                              indicator.indicator_id
                            }
                            onClick={() => setSelectedIndicator(indicator)}
                            className="flex flex-col items-start gap-2 p-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 min-h-[80px] text-left"
                          >
                            <div className="font-medium text-sm leading-tight line-clamp-3 w-full">
                              {indicator.name}
                            </div>
                            <div className="flex gap-1 flex-wrap w-full">
                              <Badge
                                variant="outline"
                                className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                              >
                                {indicator.unit}
                              </Badge>
                              <Badge
                                variant="secondary"
                                className="text-xs bg-gray-100 text-gray-600"
                              >
                                {indicator.indicator_id}
                              </Badge>
                            </div>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))
                    ) : (
                      <div className="space-y-2 px-4">
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-20 w-full" />
                      </div>
                    )}
                  </SidebarMenu>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Time Range</SidebarGroupLabel>
              <SidebarGroupContent className="px-4">
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    {timeRange[0]} - {timeRange[1]}
                  </p>
                  <Slider
                    value={timeRange}
                    min={2010}
                    max={2024}
                    step={1}
                    onValueChange={handleTimeRangeChange}
                  />
                </div>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Visualization</SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="grid grid-cols-2 gap-2 px-4 mb-2">
                  <Button
                    variant={viewMode === "chart" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("chart")}
                  >
                    Chart
                  </Button>
                  <Button
                    variant={viewMode === "table" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("table")}
                  >
                    Table
                  </Button>
                </div>

                {viewMode === "chart" && (
                  <div className="grid grid-cols-3 gap-2 px-4 mt-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant={
                              chartType === "line" ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => handleChartTypeChange("line")}
                          >
                            <LineChartIcon className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Line Chart</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant={
                              chartType === "bar" ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => handleChartTypeChange("bar")}
                          >
                            <BarChartIcon className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Bar Chart</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant={
                              chartType === "pie" ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => handleChartTypeChange("pie")}
                          >
                            <PieChartIcon className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Pie Chart</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant={
                              chartType === "area" ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => handleChartTypeChange("area")}
                          >
                            <Activity className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Area Chart</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant={
                              chartType === "radial" ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => handleChartTypeChange("radial")}
                          >
                            <Target className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Radial Chart</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant={
                              chartType === "donut" ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => handleChartTypeChange("donut")}
                          >
                            <Circle className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Donut Chart</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                )}
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <div className="flex-1 p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Data Explorer
              </h1>
              <p className="text-muted-foreground mt-2">
                Interactive visualization dashboard with comprehensive data
                analysis
              </p>
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                disabled={isLoading}
                className="shadow-lg"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-[300px]" />
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-[500px] w-full rounded-lg" />
            </div>
          ) : selectedIndicator ? (
            <div className="space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4 bg-white/80 backdrop-blur-sm shadow-lg">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="data">Raw Data</TabsTrigger>
                  <TabsTrigger value="visuals">Visual Entities</TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-3">
                      <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
                        <CardHeader className="bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-blue-600" />
                                {selectedIndicator.name}
                              </CardTitle>
                              <CardDescription className="mt-2">
                                Unit: {selectedIndicator.unit}
                              </CardDescription>
                            </div>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <Info className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <div className="max-w-xs">
                                    <p className="font-medium">
                                      Indicator Details
                                    </p>
                                    <p className="text-sm mt-1">
                                      ID: {selectedIndicator.indicator_id}
                                    </p>
                                    <p className="text-sm">
                                      Unit: {selectedIndicator.unit}
                                    </p>
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </CardHeader>
                        <CardContent className="p-6">
                          {viewMode === "chart" ? (
                            <>
                              <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
                                <div className="flex items-start gap-3">
                                  <Sparkles className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                  <div className="flex-1">
                                    <h4 className="font-medium text-sm text-blue-900 mb-2">
                                      Chart Analysis
                                    </h4>
                                    {isGeneratingDescription ? (
                                      <div className="space-y-2">
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-3/4" />
                                        <Skeleton className="h-4 w-5/6" />
                                      </div>
                                    ) : (
                                      <>
                                        <p className="text-sm text-gray-700 leading-relaxed">
                                          {chartSummary ||
                                            "Generating analysis..."}
                                        </p>
                                        {chartInsights.length > 0 && (
                                          <div className="mt-3 space-y-1">
                                            {chartInsights.map(
                                              (insight, index) => (
                                                <div
                                                  key={index}
                                                  className="flex items-start gap-2 text-xs text-blue-800"
                                                >
                                                  <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />
                                                  <span>{insight}</span>
                                                </div>
                                              )
                                            )}
                                          </div>
                                        )}
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <DataChart
                                type={chartType}
                                data={generateMockChartData(
                                  selectedIndicator,
                                  chartType
                                )}
                                title={selectedIndicator.name}
                                subtitle={`${timeRange[0]}-${timeRange[1]}`}
                                height={500}
                                unit={selectedIndicator.unit}
                              />
                            </>
                          ) : (
                            <DataTable
                              data={generateMockChartData(
                                selectedIndicator
                              ).map((item, index) => ({
                                ID: index + 1,
                                Country: item.country,
                                Value: item.value,
                                Year: item.year,
                                Unit: selectedIndicator.unit,
                              }))}
                            />
                          )}
                        </CardContent>
                      </Card>
                    </div>

                    <div className="space-y-4">
                      <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">
                            Data Coverage
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="text-center p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">
                              {indicators.length}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Total Indicators
                            </div>
                          </div>
                          <div className="text-center p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">
                              {visualEntities.length}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Visual Entities
                            </div>
                          </div>
                          <div className="text-center p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                            <div className="text-2xl font-bold text-purple-600">
                              {dashboardSummary?.total_observations.count || 0}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Observations
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">
                            Data Quality
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Completeness</span>
                              <span>{getDataQualityScore()}%</span>
                            </div>
                            <Progress
                              value={getDataQualityScore()}
                              className="h-3"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="data">
                  <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle>Indicators Data</CardTitle>
                      <CardDescription>
                        Complete list of available indicators
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <DataTable
                        data={indicators
                          .slice(0, 100)
                          .map((indicator, index) => ({
                            Index: index + 1,
                            ID: indicator.indicator_id,
                            Name: indicator.name,
                            Unit: indicator.unit,
                          }))}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="visuals">
                  <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle>Visual Entities</CardTitle>
                      <CardDescription>
                        Available visual entities and figures
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <DataTable
                        data={visualEntities
                          .slice(0, 100)
                          .map((visual, index) => ({
                            Index: index + 1,
                            "Document ID": visual.document_id,
                            "Document Title": visual.document_title,
                            "Visual ID": visual.visual_id,
                            Type: visual.type,
                          }))}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            <Alert className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
              <Database className="h-4 w-4" />
              <AlertDescription>
                Select an indicator from the sidebar to start exploring the
                data.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </SidebarProvider>
  );
}
