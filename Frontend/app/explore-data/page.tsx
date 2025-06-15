// "use client";

// import { useState, useEffect } from "react";
// import {
//   Download,
//   LineChartIcon,
//   BarChartIcon,
//   PieChartIcon,
//   TrendingUp,
//   Database,
//   Info,
//   AlertCircle,
//   Sparkles,
//   Activity,
//   Target,
//   Lightbulb,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Slider } from "@/components/ui/slider";
// import { Badge } from "@/components/ui/badge";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { DataChart } from "@/components/data-chart";
// import { DataTable } from "@/components/data-table";
// import {
//   Sidebar,
//   SidebarContent,
//   SidebarGroup,
//   SidebarGroupContent,
//   SidebarGroupLabel,
//   SidebarHeader,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
//   SidebarProvider,
// } from "@/components/ui/sidebar";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
// import { Progress } from "@/components/ui/progress";
// import { generateChartSummary, getChartInsights } from "@/utils/chart-analyzer";

// interface Indicator {
//   id: number;
//   name: string;
//   unit: string;
//   category: string;
//   tags: string[] | string;
// }

// interface VisualEntity {
//   id: number;
//   document_id: number;
//   fig_number: string;
//   type: string;
//   title: string;
//   description: string;
//   tags: string[] | string;
//   document_title: string;
//   doc_id: string;
//   domain: string;
//   document_year: number;
//   observation_count?: number;
// }

// interface DashboardSummary {
//   total_indicators: { count: number };
//   total_documents: { count: number };
//   total_visual_entities: { count: number };
//   total_observations: { count: number };
//   latest_year: { year: number };
//   domains: Array<{ domain: string; count: number }>;
//   categories: Array<{ category: string; count: number }>;
// }

// const API_BASE_URL = "http://127.0.0.1:5000";

// export default function ExplorePage() {
//   const [selectedIndicator, setSelectedIndicator] = useState<Indicator | null>(
//     null
//   );
//   const [viewMode, setViewMode] = useState<"chart" | "table">("chart");
//   const [chartType, setChartType] = useState<
//     "line" | "bar" | "pie" | "area" | "radial"
//   >("bar");
//   const [effectiveChartType, setEffectiveChartType] = useState(chartType);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [data, setData] = useState<any>(null);
//   const [indicators, setIndicators] = useState<Indicator[]>([]);
//   const [relatedVisuals, setRelatedVisuals] = useState<VisualEntity[]>([]);
//   const [dashboardSummary, setDashboardSummary] =
//     useState<DashboardSummary | null>(null);
//   const [timeRange, setTimeRange] = useState<[number, number]>([2020, 2024]);
//   const [selectedCategory, setSelectedCategory] = useState<string>("all");
//   const [activeTab, setActiveTab] = useState("overview");
//   const [loadingProgress, setLoadingProgress] = useState(0);

//   // Data transformation functions
//   const transformDataForChart = (type: string, rawData: any) => {
//     if (!rawData) return [];

//     console.log(`Transforming data for ${type} chart`, rawData); // Debug log

//     switch (type) {
//       case "line":
//       case "area":
//         if (rawData.line_data && rawData.line_data.length > 0) {
//           const lineData = Object.entries(rawData.line_data[0]).map(
//             ([country, value]) => ({
//               country,
//               value,
//               year: rawData.years?.[0] || 2024,
//             })
//           );
//           console.log("Transformed line data:", lineData); // Debug log
//           return lineData;
//         }
//         return [];

//       case "bar":
//         if (rawData.bar_data) {
//           // Check if the data is in the expected nested format or direct format
//           const hasNestedData = rawData.bar_data.some(
//             (item: any) => item.data && Array.isArray(item.data)
//           );

//           const barData = hasNestedData
//             ? rawData.bar_data.flatMap(
//                 (item: any) =>
//                   item.data?.map((d: any) => ({
//                     country: item.country,
//                     value: d.value,
//                     year: d.year || rawData.years?.[0] || 2024,
//                   })) || []
//               )
//             : rawData.bar_data.map((item: any) => ({
//                 country: item.country,
//                 value: item.value || 0,
//                 year: rawData.years?.[0] || 2024,
//               }));

//           console.log("Transformed bar data:", barData); // Debug log
//           return barData;
//         }
//         return [];

//       case "pie":
//       case "radial":
//         // First check if we have pre-formatted pie_data
//         if (rawData.pie_data && rawData.pie_data.length > 0) {
//           console.log("Using pre-formatted pie data:", rawData.pie_data); // Debug log
//           return rawData.pie_data;
//         }

//         // Fallback to transforming bar_data if no pie_data exists
//         if (rawData.bar_data) {
//           const pieData = rawData.bar_data
//             .map((item: any) => {
//               // Try multiple ways to get the value
//               let value = 0;

//               if (typeof item.value === "number") {
//                 value = item.value;
//               } else if (
//                 item.data &&
//                 Array.isArray(item.data) &&
//                 item.data.length > 0
//               ) {
//                 value = item.data[0]?.value || 0;
//               } else if (item.data && typeof item.data === "number") {
//                 value = item.data;
//               }

//               return {
//                 name: item.country || item.name || "Unknown",
//                 value: value,
//               };
//             })
//             .filter((item) => item.value > 0); // Filter out zero values for cleaner pie charts

//           console.log("Transformed pie data from bar_data:", pieData); // Debug log
//           return pieData;
//         }
//         return [];

//       default:
//         return [];
//     }
//   };

//   const isChartTypeValid = (type: string, rawData: any) => {
//     if (!rawData) return false;

//     const isValid = (() => {
//       switch (type) {
//         case "line":
//         case "area":
//           return rawData.line_data && rawData.line_data.length > 0;
//         case "bar":
//           return rawData.bar_data && rawData.bar_data.length > 0;
//         case "pie":
//         case "radial":
//           // Check if we have pre-formatted pie_data first
//           if (rawData.pie_data && rawData.pie_data.length > 0) {
//             return true;
//           }

//           // Fallback to checking bar_data
//           if (!rawData.bar_data || rawData.bar_data.length === 0) return false;

//           // Check if we have at least some valid numeric values
//           const hasValidValues = rawData.bar_data.some((item: any) => {
//             const value = item.value || item.data?.[0]?.value || item.data;
//             return typeof value === "number" && value > 0;
//           });

//           return hasValidValues;
//         default:
//           return false;
//       }
//     })();

//     console.log(`Is ${type} chart valid?`, isValid); // Debug log
//     return isValid;
//   };

//   // Fetch initial data
//   useEffect(() => {
//     const fetchInitialData = async () => {
//       try {
//         setIsLoading(true);
//         setLoadingProgress(10);

//         console.log("Checking API health..."); // Debug log
//         const healthResponse = await fetch(`${API_BASE_URL}/api/health`);
//         if (!healthResponse.ok) throw new Error("API not available");
//         setLoadingProgress(30);

//         console.log("Fetching indicators and dashboard summary..."); // Debug log
//         const [indicatorsResponse, summaryResponse] = await Promise.all([
//           fetch(`${API_BASE_URL}/api/indicators`),
//           fetch(`${API_BASE_URL}/api/dashboard-summary`),
//         ]);
//         setLoadingProgress(60);

//         if (!indicatorsResponse.ok || !summaryResponse.ok) {
//           throw new Error("Failed to fetch initial data");
//         }

//         const indicatorsResult = await indicatorsResponse.json();
//         const summaryResult = await summaryResponse.json();
//         setLoadingProgress(80);

//         console.log("Indicators API response:", indicatorsResult); // Debug log
//         console.log("Dashboard summary API response:", summaryResult); // Debug log

//         if (indicatorsResult.status === "success") {
//           setIndicators(indicatorsResult.data);
//           console.log("Loaded indicators:", indicatorsResult.data); // Debug log
//           if (indicatorsResult.data.length > 0) {
//             console.log(
//               "Setting first indicator as selected:",
//               indicatorsResult.data[0]
//             ); // Debug log
//             setSelectedIndicator(indicatorsResult.data[0]);
//           }
//         }

//         if (summaryResult.status === "success") {
//           setDashboardSummary(summaryResult.data);
//         }
//         setLoadingProgress(100);
//       } catch (err) {
//         console.error("Initial data fetch error:", err); // Debug log
//         setError(err instanceof Error ? err.message : "Failed to load data");
//       } finally {
//         setIsLoading(false);
//         setLoadingProgress(0);
//       }
//     };

//     fetchInitialData();
//   }, []);

//   // Update effective chart type when data or chart type changes
//   useEffect(() => {
//     if (!data) return;

//     console.log("Checking chart type validity..."); // Debug log
//     console.log("Current chart type:", chartType); // Debug log
//     console.log("Current data:", data); // Debug log

//     // If current chart type isn't valid, find the first valid one
//     if (!isChartTypeValid(chartType, data)) {
//       console.log(`Chart type ${chartType} is not valid for current data`); // Debug log
//       const validTypes = ["bar", "line", "area", "pie", "radial"].filter(
//         (type) => isChartTypeValid(type, data)
//       );
//       console.log("Valid chart types:", validTypes); // Debug log
//       if (validTypes.length > 0) {
//         console.log(`Setting effective chart type to ${validTypes[0]}`); // Debug log
//         setEffectiveChartType(validTypes[0] as typeof chartType);
//       }
//     } else {
//       console.log(`Chart type ${chartType} is valid`); // Debug log
//       setEffectiveChartType(chartType);
//     }
//   }, [data, chartType]);

//   // Fetch visualization data when indicator or time range changes
//   useEffect(() => {
//     const fetchVisualizationData = async () => {
//       if (!selectedIndicator) return;

//       try {
//         setIsLoading(true);
//         setError(null);
//         setLoadingProgress(20);

//         console.log(
//           `Fetching data for indicator ${selectedIndicator.id}: ${selectedIndicator.name}`
//         ); // Debug log

//         // Fetch time series data and related visualizations in parallel
//         const [timeSeriesResponse, visualsResponse] = await Promise.all([
//           fetch(`${API_BASE_URL}/api/time-series/${selectedIndicator.id}`),
//           fetch(
//             `${API_BASE_URL}/api/related-visualizations/${selectedIndicator.id}`
//           ),
//         ]);
//         setLoadingProgress(60);

//         const timeSeriesResult = await timeSeriesResponse.json();
//         const visualsResult = await visualsResponse.json();
//         setLoadingProgress(80);

//         console.log("Time series API response:", timeSeriesResult); // Debug log
//         console.log("Visuals API response:", visualsResult); // Debug log

//         if (!timeSeriesResponse.ok) {
//           throw new Error(
//             timeSeriesResult.message ||
//               `HTTP ${timeSeriesResponse.status}: Failed to fetch time series data`
//           );
//         }

//         if (timeSeriesResult.status === "success") {
//           console.log("Setting time series data:", timeSeriesResult.data); // Debug log
//           console.log(
//             "Raw bar_data structure:",
//             timeSeriesResult.data.bar_data?.[0]
//           ); // Add this line to inspect structure
//           setData(timeSeriesResult.data);
//         }

//         if (visualsResponse.ok && visualsResult.status === "success") {
//           console.log("Setting related visuals:", visualsResult.data); // Debug log
//           setRelatedVisuals(visualsResult.data);
//         }
//         setLoadingProgress(100);
//       } catch (err) {
//         console.error("Visualization data fetch error:", err); // Debug log
//         setError(
//           err instanceof Error
//             ? err.message
//             : "Failed to load visualization data"
//         );
//       } finally {
//         setIsLoading(false);
//         setLoadingProgress(0);
//       }
//     };

//     fetchVisualizationData();
//   }, [selectedIndicator, timeRange]);

//   const filteredIndicators =
//     selectedCategory === "all"
//       ? indicators
//       : indicators.filter((ind) => ind.category === selectedCategory);

//   console.log("Filtered indicators:", filteredIndicators); // Debug log

//   const handleTimeRangeChange = (values: number[]) => {
//     console.log("Time range changed to:", values); // Debug log
//     setTimeRange([values[0], values[1]]);
//   };

//   const handleChartTypeChange = (type: typeof chartType) => {
//     console.log("Chart type changed to:", type); // Debug log
//     setChartType(type);
//   };

//   const categories = dashboardSummary?.categories || [];
//   const uniqueCategories = [
//     "all",
//     ...new Set(categories.map((c) => c.category)),
//   ];

//   const formatTags = (tags: string | string[]): string[] => {
//     if (typeof tags === "string") {
//       try {
//         if (tags.startsWith("[") && tags.endsWith("]")) {
//           return eval(tags);
//         }
//         return [tags];
//       } catch (e) {
//         return [tags];
//       }
//     }
//     return Array.isArray(tags) ? tags : [tags];
//   };

//   const getDataQualityScore = () => {
//     if (!data || !data.raw_data) return 0;
//     const totalPossible = data.years?.length * data.countries?.length || 0;
//     const actualData = data.raw_data.length;
//     const score =
//       totalPossible > 0
//         ? Math.min(100, Math.round((actualData / totalPossible) * 100))
//         : 0;
//     console.log("Data quality score:", score); // Debug log
//     return score;
//   };

//   // Generate chart summary and insights
//   const chartData = transformDataForChart(effectiveChartType, data);
//   const chartSummary =
//     selectedIndicator && data
//       ? generateChartSummary(
//           effectiveChartType,
//           chartData,
//           selectedIndicator,
//           data
//         )
//       : "";
//   const chartInsights =
//     selectedIndicator && data
//       ? getChartInsights(effectiveChartType, chartData, selectedIndicator)
//       : [];

//   if (error) {
//     console.error("Error state rendered:", error); // Debug log
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <Card className="w-full max-w-md">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <AlertCircle className="h-5 w-5 text-red-500" />
//               Error Loading Data
//             </CardTitle>
//             <CardDescription>{error}</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <Button onClick={() => window.location.reload()}>Try Again</Button>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   console.log("Current state:", {
//     // Debug log
//     selectedIndicator,
//     viewMode,
//     chartType,
//     effectiveChartType,
//     isLoading,
//     data,
//     relatedVisuals,
//     dashboardSummary,
//     timeRange,
//     selectedCategory,
//     activeTab,
//     loadingProgress,
//   });

//   return (
//     <SidebarProvider>
//       <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
//         <Sidebar className="border-r border-slate-200 backdrop-blur-sm bg-white/95">
//           <SidebarHeader className="border-b px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
//             <div className="flex items-center gap-2">
//               <Sparkles className="h-5 w-5" />
//               <h2 className="text-lg font-semibold">Data Explorer</h2>
//             </div>
//             {dashboardSummary && (
//               <div className="grid grid-cols-2 gap-2 mt-3">
//                 <div className="text-center p-2 bg-white/20 rounded-lg backdrop-blur-sm">
//                   <div className="text-2xl font-bold">
//                     {dashboardSummary.total_indicators.count}
//                   </div>
//                   <div className="text-xs opacity-90">Indicators</div>
//                 </div>
//                 <div className="text-center p-2 bg-white/20 rounded-lg backdrop-blur-sm">
//                   <div className="text-2xl font-bold">
//                     {dashboardSummary.total_observations.count}
//                   </div>
//                   <div className="text-xs opacity-90">Data Points</div>
//                 </div>
//               </div>
//             )}
//           </SidebarHeader>

//           <SidebarContent className="bg-white/95 backdrop-blur-sm">
//             {loadingProgress > 0 && (
//               <div className="px-6 py-2">
//                 <Progress value={loadingProgress} className="h-2" />
//                 <p className="text-xs text-muted-foreground mt-1">
//                   Loading data...
//                 </p>
//               </div>
//             )}

//             <SidebarGroup>
//               <SidebarGroupLabel>Category Filter</SidebarGroupLabel>
//               <SidebarGroupContent>
//                 <Select
//                   value={selectedCategory}
//                   onValueChange={(value) => {
//                     console.log("Category changed to:", value); // Debug log
//                     setSelectedCategory(value);
//                   }}
//                 >
//                   <SelectTrigger className="w-full">
//                     <SelectValue placeholder="Select category" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {uniqueCategories.map((category) => (
//                       <SelectItem key={category} value={category}>
//                         {category === "all" ? "All Categories" : category}
//                         {category !== "all" && (
//                           <Badge variant="secondary" className="ml-2">
//                             {categories.find((c) => c.category === category)
//                               ?.count || 0}
//                           </Badge>
//                         )}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </SidebarGroupContent>
//             </SidebarGroup>

//             <SidebarGroup>
//               <SidebarGroupLabel>
//                 Indicators ({filteredIndicators.length})
//               </SidebarGroupLabel>
//               <SidebarGroupContent>
//                 <SidebarMenu>
//                   {filteredIndicators.length > 0 ? (
//                     filteredIndicators.map((indicator) => (
//                       <SidebarMenuItem key={indicator.id}>
//                         <SidebarMenuButton
//                           isActive={selectedIndicator?.id === indicator.id}
//                           onClick={() => {
//                             console.log("Indicator selected:", indicator); // Debug log
//                             setSelectedIndicator(indicator);
//                           }}
//                           className="flex flex-col items-start gap-2 p-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200"
//                         >
//                           <div className="font-medium text-sm">
//                             {indicator.name}
//                           </div>
//                           <div className="flex gap-1 flex-wrap">
//                             <Badge variant="secondary" className="text-xs">
//                               {indicator.category}
//                             </Badge>
//                             {indicator.unit && (
//                               <Badge variant="outline" className="text-xs">
//                                 {indicator.unit}
//                               </Badge>
//                             )}
//                           </div>
//                         </SidebarMenuButton>
//                       </SidebarMenuItem>
//                     ))
//                   ) : (
//                     <div className="space-y-2 px-4">
//                       <Skeleton className="h-16 w-full" />
//                       <Skeleton className="h-16 w-full" />
//                       <Skeleton className="h-16 w-full" />
//                     </div>
//                   )}
//                 </SidebarMenu>
//               </SidebarGroupContent>
//             </SidebarGroup>

//             <SidebarGroup>
//               <SidebarGroupLabel>Time Range</SidebarGroupLabel>
//               <SidebarGroupContent className="px-4">
//                 <div className="mb-4">
//                   <p className="text-sm text-muted-foreground mb-2">
//                     {timeRange[0]} - {timeRange[1]}
//                   </p>
//                   <Slider
//                     value={timeRange}
//                     min={2010}
//                     max={2024}
//                     step={1}
//                     onValueChange={handleTimeRangeChange}
//                   />
//                 </div>
//               </SidebarGroupContent>
//             </SidebarGroup>

//             <SidebarGroup>
//               <SidebarGroupLabel>Visualization</SidebarGroupLabel>
//               <SidebarGroupContent>
//                 <div className="grid grid-cols-2 gap-2 px-4 mb-2">
//                   <Button
//                     variant={viewMode === "chart" ? "default" : "outline"}
//                     size="sm"
//                     onClick={() => {
//                       console.log("View mode changed to chart"); // Debug log
//                       setViewMode("chart");
//                     }}
//                   >
//                     Chart
//                   </Button>
//                   <Button
//                     variant={viewMode === "table" ? "default" : "outline"}
//                     size="sm"
//                     onClick={() => {
//                       console.log("View mode changed to table"); // Debug log
//                       setViewMode("table");
//                     }}
//                   >
//                     Table
//                   </Button>
//                 </div>

//                 {viewMode === "chart" && (
//                   <div className="grid grid-cols-3 gap-2 px-4 mt-2">
//                     <TooltipProvider>
//                       <Tooltip>
//                         <TooltipTrigger asChild>
//                           <Button
//                             variant={
//                               chartType === "line" ? "default" : "outline"
//                             }
//                             size="sm"
//                             onClick={() => handleChartTypeChange("line")}
//                             disabled={!isChartTypeValid("line", data)}
//                           >
//                             <LineChartIcon className="h-4 w-4" />
//                           </Button>
//                         </TooltipTrigger>
//                         <TooltipContent>
//                           {!isChartTypeValid("line", data)
//                             ? "Not enough time-series data for line chart"
//                             : "Switch to line chart"}
//                         </TooltipContent>
//                       </Tooltip>
//                     </TooltipProvider>

//                     <TooltipProvider>
//                       <Tooltip>
//                         <TooltipTrigger asChild>
//                           <Button
//                             variant={
//                               chartType === "bar" ? "default" : "outline"
//                             }
//                             size="sm"
//                             onClick={() => handleChartTypeChange("bar")}
//                             disabled={!isChartTypeValid("bar", data)}
//                           >
//                             <BarChartIcon className="h-4 w-4" />
//                           </Button>
//                         </TooltipTrigger>
//                         <TooltipContent>
//                           {!isChartTypeValid("bar", data)
//                             ? "No bar chart data available"
//                             : "Switch to bar chart"}
//                         </TooltipContent>
//                       </Tooltip>
//                     </TooltipProvider>

//                     <TooltipProvider>
//                       <Tooltip>
//                         <TooltipTrigger asChild>
//                           <Button
//                             variant={
//                               chartType === "pie" ? "default" : "outline"
//                             }
//                             size="sm"
//                             onClick={() => handleChartTypeChange("pie")}
//                             disabled={!isChartTypeValid("pie", data)}
//                           >
//                             <PieChartIcon className="h-4 w-4" />
//                           </Button>
//                         </TooltipTrigger>
//                         <TooltipContent>
//                           {!isChartTypeValid("pie", data)
//                             ? "Not enough categories for pie chart"
//                             : "Switch to pie chart"}
//                         </TooltipContent>
//                       </Tooltip>
//                     </TooltipProvider>

//                     <TooltipProvider>
//                       <Tooltip>
//                         <TooltipTrigger asChild>
//                           <Button
//                             variant={
//                               chartType === "area" ? "default" : "outline"
//                             }
//                             size="sm"
//                             onClick={() => handleChartTypeChange("area")}
//                             disabled={!isChartTypeValid("area", data)}
//                           >
//                             <Activity className="h-4 w-4" />
//                           </Button>
//                         </TooltipTrigger>
//                         <TooltipContent>
//                           {!isChartTypeValid("area", data)
//                             ? "Not enough time-series data for area chart"
//                             : "Switch to area chart"}
//                         </TooltipContent>
//                       </Tooltip>
//                     </TooltipProvider>

//                     <TooltipProvider>
//                       <Tooltip>
//                         <TooltipTrigger asChild>
//                           <Button
//                             variant={
//                               chartType === "radial" ? "default" : "outline"
//                             }
//                             size="sm"
//                             onClick={() => handleChartTypeChange("radial")}
//                             disabled={!isChartTypeValid("radial", data)}
//                           >
//                             <Target className="h-4 w-4" />
//                           </Button>
//                         </TooltipTrigger>
//                         <TooltipContent>
//                           {!isChartTypeValid("radial", data)
//                             ? "Not enough categories for radial chart"
//                             : "Switch to radial chart"}
//                         </TooltipContent>
//                       </Tooltip>
//                     </TooltipProvider>
//                   </div>
//                 )}
//               </SidebarGroupContent>
//             </SidebarGroup>
//           </SidebarContent>
//         </Sidebar>

//         <div className="flex-1 p-6">
//           <div className="mb-6 flex items-center justify-between">
//             <div>
//               <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
//                 Data Explorer
//               </h1>
//               <p className="text-muted-foreground mt-2">
//                 Interactive visualization of research indicators and
//                 observations with intelligent chart analysis
//               </p>
//             </div>

//             <div className="flex items-center gap-4">
//               <Button
//                 variant="outline"
//                 disabled={isLoading || !data}
//                 className="shadow-lg"
//                 onClick={() => console.log("Export data clicked")} // Debug log
//               >
//                 <Download className="h-4 w-4 mr-2" />
//                 Export Data
//               </Button>
//             </div>
//           </div>

//           {isLoading ? (
//             <div className="space-y-4">
//               <Skeleton className="h-8 w-[300px]" />
//               <Skeleton className="h-4 w-[200px]" />
//               <Skeleton className="h-[500px] w-full rounded-lg" />
//             </div>
//           ) : selectedIndicator ? (
//             <div className="space-y-6">
//               <Tabs
//                 value={activeTab}
//                 onValueChange={(value) => {
//                   console.log("Tab changed to:", value); // Debug log
//                   setActiveTab(value);
//                 }}
//               >
//                 <TabsList className="mb-4 bg-white/80 backdrop-blur-sm shadow-lg">
//                   <TabsTrigger value="overview">Overview</TabsTrigger>
//                   <TabsTrigger value="data">Raw Data</TabsTrigger>
//                 </TabsList>

//                 <TabsContent value="overview">
//                   <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//                     <div className="lg:col-span-3">
//                       <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
//                         <CardHeader className="bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50">
//                           <div className="flex justify-between items-start">
//                             <div>
//                               <CardTitle className="flex items-center gap-2">
//                                 <TrendingUp className="h-5 w-5 text-blue-600" />
//                                 {data?.title || selectedIndicator.name}
//                               </CardTitle>
//                               <CardDescription className="mt-2">
//                                 {data?.description ||
//                                   `${selectedIndicator.category} indicator`}
//                                 {data?.unit && ` • Unit: ${data.unit}`}
//                               </CardDescription>
//                             </div>
//                             <TooltipProvider>
//                               <Tooltip>
//                                 <TooltipTrigger asChild>
//                                   <Button variant="ghost" size="icon">
//                                     <Info className="h-4 w-4" />
//                                   </Button>
//                                 </TooltipTrigger>
//                                 <TooltipContent>
//                                   <div className="max-w-xs">
//                                     <p className="font-medium">
//                                       Indicator Details
//                                     </p>
//                                     <p className="text-sm mt-1">
//                                       Category: {selectedIndicator.category}
//                                     </p>
//                                     <p className="text-sm">
//                                       Unit: {selectedIndicator.unit || "N/A"}
//                                     </p>
//                                     {selectedIndicator.tags && (
//                                       <div className="mt-1">
//                                         <p className="text-sm font-medium">
//                                           Tags:
//                                         </p>
//                                         <div className="flex flex-wrap gap-1 mt-1">
//                                           {formatTags(
//                                             selectedIndicator.tags
//                                           ).map((tag, i) => (
//                                             <Badge
//                                               key={i}
//                                               variant="outline"
//                                               className="text-xs"
//                                             >
//                                               {tag}
//                                             </Badge>
//                                           ))}
//                                         </div>
//                                       </div>
//                                     )}
//                                   </div>
//                                 </TooltipContent>
//                               </Tooltip>
//                             </TooltipProvider>
//                           </div>
//                         </CardHeader>
//                         <CardContent className="p-6">
//                           {viewMode === "chart" &&
//                           isChartTypeValid(effectiveChartType, data) ? (
//                             <>
//                               <div className="mb-4">
//                                 <p className="text-sm text-muted-foreground">
//                                   Displaying {effectiveChartType} chart with{" "}
//                                   {
//                                     transformDataForChart(
//                                       effectiveChartType,
//                                       data
//                                     ).length
//                                   }{" "}
//                                   data points
//                                 </p>
//                               </div>

//                               {chartSummary && (
//                                 <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
//                                   <div className="flex items-start gap-3">
//                                     <Sparkles className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
//                                     <div className="flex-1">
//                                       <h4 className="font-medium text-sm text-blue-900 mb-2">
//                                         Chart Analysis
//                                       </h4>
//                                       <p className="text-sm text-gray-700 leading-relaxed mb-3">
//                                         {chartSummary}
//                                       </p>

//                                       {chartInsights.length > 0 && (
//                                         <div className="space-y-2">
//                                           <div className="flex items-center gap-2">
//                                             <Lightbulb className="h-4 w-4 text-amber-600" />
//                                             <span className="text-xs font-medium text-amber-800">
//                                               Key Insights
//                                             </span>
//                                           </div>
//                                           {chartInsights.map(
//                                             (insight, index) => (
//                                               <div
//                                                 key={index}
//                                                 className="flex items-start gap-2"
//                                               >
//                                                 <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
//                                                 <p className="text-xs text-amber-700">
//                                                   {insight}
//                                                 </p>
//                                               </div>
//                                             )
//                                           )}
//                                         </div>
//                                       )}
//                                     </div>
//                                   </div>
//                                 </div>
//                               )}

//                               <DataChart
//                                 type={effectiveChartType}
//                                 data={transformDataForChart(
//                                   effectiveChartType,
//                                   data
//                                 )}
//                                 title={`${selectedIndicator.name}`}
//                                 subtitle={
//                                   data?.years?.length > 1
//                                     ? `${timeRange[0]}-${timeRange[1]}`
//                                     : `Year: ${data?.years?.[0] || 2024}`
//                                 }
//                                 height={500}
//                                 unit={selectedIndicator.unit}
//                               />
//                             </>
//                           ) : viewMode === "chart" ? (
//                             <div className="flex items-center justify-center h-96">
//                               <Alert>
//                                 <AlertDescription>
//                                   {!data
//                                     ? "Loading data..."
//                                     : `Data not suitable for ${effectiveChartType} chart. Try a different type.`}
//                                 </AlertDescription>
//                               </Alert>
//                             </div>
//                           ) : viewMode === "table" && data?.raw_data ? (
//                             <DataTable
//                               data={data.raw_data.map((item: any) => ({
//                                 Year: item.year,
//                                 Country: item.country || "All",
//                                 Value: item.value,
//                                 Unit: item.unit || "-",
//                                 Notes: item.notes || "-",
//                               }))}
//                             />
//                           ) : (
//                             <div className="flex items-center justify-center h-96">
//                               <Alert>
//                                 <AlertDescription>
//                                   No data available for table view.
//                                 </AlertDescription>
//                               </Alert>
//                             </div>
//                           )}
//                         </CardContent>
//                       </Card>
//                     </div>

//                     <div className="space-y-4">
//                       {data?.countries && data.countries.length > 0 && (
//                         <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
//                           <CardHeader className="pb-3">
//                             <CardTitle className="text-lg">
//                               Data Coverage
//                             </CardTitle>
//                           </CardHeader>
//                           <CardContent className="space-y-4">
//                             <div className="text-center p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
//                               <div className="text-2xl font-bold text-blue-600">
//                                 {data.countries.length}
//                               </div>
//                               <div className="text-sm text-muted-foreground">
//                                 Countries
//                               </div>
//                             </div>
//                             <div className="text-center p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
//                               <div className="text-2xl font-bold text-green-600">
//                                 {data.years?.length || 0}
//                               </div>
//                               <div className="text-sm text-muted-foreground">
//                                 Years
//                               </div>
//                             </div>
//                             <div className="text-center p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
//                               <div className="text-2xl font-bold text-purple-600">
//                                 {data.raw_data?.length || 0}
//                               </div>
//                               <div className="text-sm text-muted-foreground">
//                                 Observations
//                               </div>
//                             </div>
//                             <div className="text-center p-3 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg">
//                               <div className="text-2xl font-bold text-orange-600">
//                                 {data.years?.length
//                                   ? Math.max(...data.years)
//                                   : "N/A"}
//                               </div>
//                               <div className="text-sm text-muted-foreground">
//                                 Latest Year
//                               </div>
//                             </div>
//                           </CardContent>
//                         </Card>
//                       )}

//                       <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
//                         <CardHeader className="pb-3">
//                           <CardTitle className="text-lg">
//                             Data Quality
//                           </CardTitle>
//                         </CardHeader>
//                         <CardContent>
//                           <div className="space-y-2">
//                             <div className="flex justify-between text-sm">
//                               <span>Completeness</span>
//                               <span>{getDataQualityScore()}%</span>
//                             </div>
//                             <Progress
//                               value={getDataQualityScore()}
//                               className="h-3"
//                             />
//                             {data?.skipped_values &&
//                               data.skipped_values.length > 0 && (
//                                 <div className="mt-2">
//                                   <p className="text-xs text-muted-foreground">
//                                     Filtered out {data.skipped_values.length}{" "}
//                                     non-numeric values
//                                   </p>
//                                 </div>
//                               )}
//                           </div>
//                         </CardContent>
//                       </Card>
//                     </div>
//                   </div>
//                 </TabsContent>

//                 <TabsContent value="data">
//                   <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
//                     <CardHeader>
//                       <CardTitle>Raw Data</CardTitle>
//                       <CardDescription>
//                         Complete dataset for {selectedIndicator.name}
//                       </CardDescription>
//                     </CardHeader>
//                     <CardContent>
//                       {data?.raw_data ? (
//                         <DataTable
//                           data={data.raw_data.map((item: any) => ({
//                             ID: item.id,
//                             Year: item.year,
//                             Country: item.country || "All",
//                             Value: item.value,
//                             Unit: item.unit || "-",
//                             "Visual Entity": item.visual_title || "-",
//                             Document: item.document_title || "-",
//                             Notes: item.notes || "-",
//                           }))}
//                         />
//                       ) : (
//                         <div className="text-center py-8">
//                           <p>No data available</p>
//                         </div>
//                       )}
//                     </CardContent>
//                   </Card>
//                 </TabsContent>
//               </Tabs>
//             </div>
//           ) : (
//             <Alert className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
//               <Database className="h-4 w-4" />
//               <AlertDescription>
//                 Select an indicator from the sidebar to start exploring the
//                 data.
//               </AlertDescription>
//             </Alert>
//           )}
//         </div>
//       </div>
//     </SidebarProvider>
//   );
// }

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
  Lightbulb,
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
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataChart } from "@/components/data-chart";
import { DataTable } from "@/components/data-table";
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
import { generateChartSummary, getChartInsights } from "@/utils/chart-analyzer";
import { KohonenMapViewer } from "@/components/kohonen-map-viewer";

interface Indicator {
  id: number;
  name: string;
  unit: string;
  category: string;
  tags: string[] | string;
}

interface VisualEntity {
  id: number;
  document_id: number;
  fig_number: string;
  type: string;
  title: string;
  description: string;
  tags: string[] | string;
  document_title: string;
  doc_id: string;
  domain: string;
  document_year: number;
  observation_count?: number;
}

interface DashboardSummary {
  total_indicators: { count: number };
  total_documents: { count: number };
  total_visual_entities: { count: number };
  total_observations: { count: number };
  latest_year: { year: number };
  domains: Array<{ domain: string; count: number }>;
  categories: Array<{ category: string; count: number }>;
}

const API_BASE_URL = "http://127.0.0.1:5000";

export default function ExplorePage() {
  const [selectedIndicator, setSelectedIndicator] = useState<Indicator | null>(
    null
  );
  const [viewMode, setViewMode] = useState<"chart" | "table">("chart");
  const [chartType, setChartType] = useState<
    "line" | "bar" | "pie" | "area" | "radial"
  >("bar");
  const [effectiveChartType, setEffectiveChartType] = useState(chartType);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);
  const [indicators, setIndicators] = useState<Indicator[]>([]);
  const [relatedVisuals, setRelatedVisuals] = useState<VisualEntity[]>([]);
  const [dashboardSummary, setDashboardSummary] =
    useState<DashboardSummary | null>(null);
  const [timeRange, setTimeRange] = useState<[number, number]>([2020, 2024]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("overview");
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Data transformation functions
  const transformDataForChart = (type: string, rawData: any) => {
    if (!rawData) return [];

    console.log(`Transforming data for ${type} chart`, rawData); // Debug log

    switch (type) {
      case "line":
      case "area":
        if (rawData.line_data && rawData.line_data.length > 0) {
          const lineData = Object.entries(rawData.line_data[0]).map(
            ([country, value]) => ({
              country,
              value,
              year: rawData.years?.[0] || 2024,
            })
          );
          console.log("Transformed line data:", lineData); // Debug log
          return lineData;
        }
        return [];

      case "bar":
        if (rawData.bar_data) {
          // Check if the data is in the expected nested format or direct format
          const hasNestedData = rawData.bar_data.some(
            (item: any) => item.data && Array.isArray(item.data)
          );

          const barData = hasNestedData
            ? rawData.bar_data.flatMap(
                (item: any) =>
                  item.data?.map((d: any) => ({
                    country: item.country,
                    value: d.value,
                    year: d.year || rawData.years?.[0] || 2024,
                  })) || []
              )
            : rawData.bar_data.map((item: any) => ({
                country: item.country,
                value: item.value || 0,
                year: rawData.years?.[0] || 2024,
              }));

          console.log("Transformed bar data:", barData); // Debug log
          return barData;
        }
        return [];

      case "pie":
      case "radial":
        // First check if we have pre-formatted pie_data
        if (rawData.pie_data && rawData.pie_data.length > 0) {
          console.log("Using pre-formatted pie data:", rawData.pie_data); // Debug log
          return rawData.pie_data;
        }

        // Fallback to transforming bar_data if no pie_data exists
        if (rawData.bar_data) {
          const pieData = rawData.bar_data
            .map((item: any) => {
              // Try multiple ways to get the value
              let value = 0;

              if (typeof item.value === "number") {
                value = item.value;
              } else if (
                item.data &&
                Array.isArray(item.data) &&
                item.data.length > 0
              ) {
                value = item.data[0]?.value || 0;
              } else if (item.data && typeof item.data === "number") {
                value = item.data;
              }

              return {
                name: item.country || item.name || "Unknown",
                value: value,
              };
            })
            .filter((item) => item.value > 0); // Filter out zero values for cleaner pie charts

          console.log("Transformed pie data from bar_data:", pieData); // Debug log
          return pieData;
        }
        return [];

      default:
        return [];
    }
  };

  const isChartTypeValid = (type: string, rawData: any) => {
    if (!rawData) return false;

    const isValid = (() => {
      switch (type) {
        case "line":
        case "area":
          return rawData.line_data && rawData.line_data.length > 0;
        case "bar":
          return rawData.bar_data && rawData.bar_data.length > 0;
        case "pie":
        case "radial":
          // Check if we have pre-formatted pie_data first
          if (rawData.pie_data && rawData.pie_data.length > 0) {
            return true;
          }

          // Fallback to checking bar_data
          if (!rawData.bar_data || rawData.bar_data.length === 0) return false;

          // Check if we have at least some valid numeric values
          const hasValidValues = rawData.bar_data.some((item: any) => {
            const value = item.value || item.data?.[0]?.value || item.data;
            return typeof value === "number" && value > 0;
          });

          return hasValidValues;
        default:
          return false;
      }
    })();

    console.log(`Is ${type} chart valid?`, isValid); // Debug log
    return isValid;
  };

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        setLoadingProgress(10);

        console.log("Checking API health..."); // Debug log
        const healthResponse = await fetch(`${API_BASE_URL}/api/health`);
        if (!healthResponse.ok) throw new Error("API not available");
        setLoadingProgress(30);

        console.log("Fetching indicators and dashboard summary..."); // Debug log
        const [indicatorsResponse, summaryResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/api/indicators`),
          fetch(`${API_BASE_URL}/api/dashboard-summary`),
        ]);
        setLoadingProgress(60);

        if (!indicatorsResponse.ok || !summaryResponse.ok) {
          throw new Error("Failed to fetch initial data");
        }

        const indicatorsResult = await indicatorsResponse.json();
        const summaryResult = await summaryResponse.json();
        setLoadingProgress(80);

        console.log("Indicators API response:", indicatorsResult); // Debug log
        console.log("Dashboard summary API response:", summaryResult); // Debug log

        if (indicatorsResult.status === "success") {
          setIndicators(indicatorsResult.data);
          console.log("Loaded indicators:", indicatorsResult.data); // Debug log
          if (indicatorsResult.data.length > 0) {
            console.log(
              "Setting first indicator as selected:",
              indicatorsResult.data[0]
            ); // Debug log
            setSelectedIndicator(indicatorsResult.data[0]);
          }
        }

        if (summaryResult.status === "success") {
          setDashboardSummary(summaryResult.data);
        }
        setLoadingProgress(100);
      } catch (err) {
        console.error("Initial data fetch error:", err); // Debug log
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setIsLoading(false);
        setLoadingProgress(0);
      }
    };

    fetchInitialData();
  }, []);

  // Update effective chart type when data or chart type changes
  useEffect(() => {
    if (!data) return;

    console.log("Checking chart type validity..."); // Debug log
    console.log("Current chart type:", chartType); // Debug log
    console.log("Current data:", data); // Debug log

    // If current chart type isn't valid, find the first valid one
    if (!isChartTypeValid(chartType, data)) {
      console.log(`Chart type ${chartType} is not valid for current data`); // Debug log
      const validTypes = ["bar", "line", "area", "pie", "radial"].filter(
        (type) => isChartTypeValid(type, data)
      );
      console.log("Valid chart types:", validTypes); // Debug log
      if (validTypes.length > 0) {
        console.log(`Setting effective chart type to ${validTypes[0]}`); // Debug log
        setEffectiveChartType(validTypes[0] as typeof chartType);
      }
    } else {
      console.log(`Chart type ${chartType} is valid`); // Debug log
      setEffectiveChartType(chartType);
    }
  }, [data, chartType]);

  // Fetch visualization data when indicator or time range changes
  useEffect(() => {
    const fetchVisualizationData = async () => {
      if (!selectedIndicator) return;

      try {
        setIsLoading(true);
        setError(null);
        setLoadingProgress(20);

        console.log(
          `Fetching data for indicator ${selectedIndicator.id}: ${selectedIndicator.name}`
        ); // Debug log

        // Fetch time series data and related visualizations in parallel
        const [timeSeriesResponse, visualsResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/api/time-series/${selectedIndicator.id}`),
          fetch(
            `${API_BASE_URL}/api/related-visualizations/${selectedIndicator.id}`
          ),
        ]);
        setLoadingProgress(60);

        const timeSeriesResult = await timeSeriesResponse.json();
        const visualsResult = await visualsResponse.json();
        setLoadingProgress(80);

        console.log("Time series API response:", timeSeriesResult); // Debug log
        console.log("Visuals API response:", visualsResult); // Debug log

        if (!timeSeriesResponse.ok) {
          throw new Error(
            timeSeriesResult.message ||
              `HTTP ${timeSeriesResponse.status}: Failed to fetch time series data`
          );
        }

        if (timeSeriesResult.status === "success") {
          console.log("Setting time series data:", timeSeriesResult.data); // Debug log
          console.log(
            "Raw bar_data structure:",
            timeSeriesResult.data.bar_data?.[0]
          ); // Add this line to inspect structure
          setData(timeSeriesResult.data);
        }

        if (visualsResponse.ok && visualsResult.status === "success") {
          console.log("Setting related visuals:", visualsResult.data); // Debug log
          setRelatedVisuals(visualsResult.data);
        }
        setLoadingProgress(100);
      } catch (err) {
        console.error("Visualization data fetch error:", err); // Debug log
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load visualization data"
        );
      } finally {
        setIsLoading(false);
        setLoadingProgress(0);
      }
    };

    fetchVisualizationData();
  }, [selectedIndicator, timeRange]);

  const filteredIndicators =
    selectedCategory === "all"
      ? indicators
      : indicators.filter((ind) => ind.category === selectedCategory);

  console.log("Filtered indicators:", filteredIndicators); // Debug log

  const handleTimeRangeChange = (values: number[]) => {
    console.log("Time range changed to:", values); // Debug log
    setTimeRange([values[0], values[1]]);
  };

  const handleChartTypeChange = (type: typeof chartType) => {
    console.log("Chart type changed to:", type); // Debug log
    setChartType(type);
  };

  const categories = dashboardSummary?.categories || [];
  const uniqueCategories = [
    "all",
    ...new Set(categories.map((c) => c.category)),
  ];

  const formatTags = (tags: string | string[]): string[] => {
    if (typeof tags === "string") {
      try {
        if (tags.startsWith("[") && tags.endsWith("]")) {
          return eval(tags);
        }
        return [tags];
      } catch (e) {
        return [tags];
      }
    }
    return Array.isArray(tags) ? tags : [tags];
  };

  const getDataQualityScore = () => {
    if (!data || !data.raw_data) return 0;
    const totalPossible = data.years?.length * data.countries?.length || 0;
    const actualData = data.raw_data.length;
    const score =
      totalPossible > 0
        ? Math.min(100, Math.round((actualData / totalPossible) * 100))
        : 0;
    console.log("Data quality score:", score); // Debug log
    return score;
  };

  // Generate chart summary and insights
  const chartData = transformDataForChart(effectiveChartType, data);
  const chartSummary =
    selectedIndicator && data
      ? generateChartSummary(
          effectiveChartType,
          chartData,
          selectedIndicator,
          data
        )
      : "";
  const chartInsights =
    selectedIndicator && data
      ? getChartInsights(effectiveChartType, chartData, selectedIndicator)
      : [];

  if (error) {
    console.error("Error state rendered:", error); // Debug log
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

  console.log("Current state:", {
    // Debug log
    selectedIndicator,
    viewMode,
    chartType,
    effectiveChartType,
    isLoading,
    data,
    relatedVisuals,
    dashboardSummary,
    timeRange,
    selectedCategory,
    activeTab,
    loadingProgress,
  });

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
              <SidebarGroupLabel>Category Filter</SidebarGroupLabel>
              <SidebarGroupContent>
                <Select
                  value={selectedCategory}
                  onValueChange={(value) => {
                    console.log("Category changed to:", value); // Debug log
                    setSelectedCategory(value);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {uniqueCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category === "all" ? "All Categories" : category}
                        {category !== "all" && (
                          <Badge variant="secondary" className="ml-2">
                            {categories.find((c) => c.category === category)
                              ?.count || 0}
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
                <SidebarMenu>
                  {filteredIndicators.length > 0 ? (
                    filteredIndicators.map((indicator) => (
                      <SidebarMenuItem key={indicator.id}>
                        <SidebarMenuButton
                          isActive={selectedIndicator?.id === indicator.id}
                          onClick={() => {
                            console.log("Indicator selected:", indicator); // Debug log
                            setSelectedIndicator(indicator);
                          }}
                          className="flex flex-col items-start gap-2 p-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200"
                        >
                          <div className="font-medium text-sm">
                            {indicator.name}
                          </div>
                          <div className="flex gap-1 flex-wrap">
                            <Badge variant="secondary" className="text-xs">
                              {indicator.category}
                            </Badge>
                            {indicator.unit && (
                              <Badge variant="outline" className="text-xs">
                                {indicator.unit}
                              </Badge>
                            )}
                          </div>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))
                  ) : (
                    <div className="space-y-2 px-4">
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-16 w-full" />
                    </div>
                  )}
                </SidebarMenu>
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
                    onClick={() => {
                      console.log("View mode changed to chart"); // Debug log
                      setViewMode("chart");
                    }}
                  >
                    Chart
                  </Button>
                  <Button
                    variant={viewMode === "table" ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      console.log("View mode changed to table"); // Debug log
                      setViewMode("table");
                    }}
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
                            disabled={!isChartTypeValid("line", data)}
                          >
                            <LineChartIcon className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {!isChartTypeValid("line", data)
                            ? "Not enough time-series data for line chart"
                            : "Switch to line chart"}
                        </TooltipContent>
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
                            disabled={!isChartTypeValid("bar", data)}
                          >
                            <BarChartIcon className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {!isChartTypeValid("bar", data)
                            ? "No bar chart data available"
                            : "Switch to bar chart"}
                        </TooltipContent>
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
                            disabled={!isChartTypeValid("pie", data)}
                          >
                            <PieChartIcon className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {!isChartTypeValid("pie", data)
                            ? "Not enough categories for pie chart"
                            : "Switch to pie chart"}
                        </TooltipContent>
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
                            disabled={!isChartTypeValid("area", data)}
                          >
                            <Activity className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {!isChartTypeValid("area", data)
                            ? "Not enough time-series data for area chart"
                            : "Switch to area chart"}
                        </TooltipContent>
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
                            disabled={!isChartTypeValid("radial", data)}
                          >
                            <Target className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {!isChartTypeValid("radial", data)
                            ? "Not enough categories for radial chart"
                            : "Switch to radial chart"}
                        </TooltipContent>
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
                Interactive visualization with Kohonen Self-Organizing Maps and
                intelligent chart analysis
              </p>
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                disabled={isLoading || !data}
                className="shadow-lg"
                onClick={() => console.log("Export data clicked")}
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
              <Tabs
                value={activeTab}
                onValueChange={(value) => {
                  console.log("Tab changed to:", value);
                  setActiveTab(value);
                }}
              >
                <TabsList className="mb-4 bg-white/80 backdrop-blur-sm shadow-lg">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="data">Raw Data</TabsTrigger>
                  <TabsTrigger value="kohonen">
                    <Brain className="h-4 w-4 mr-2" />
                    Kohonen Maps
                  </TabsTrigger>
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
                                {data?.title || selectedIndicator.name}
                              </CardTitle>
                              <CardDescription className="mt-2">
                                {data?.description ||
                                  `${selectedIndicator.category} indicator`}
                                {data?.unit && ` • Unit: ${data.unit}`}
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
                                      Category: {selectedIndicator.category}
                                    </p>
                                    <p className="text-sm">
                                      Unit: {selectedIndicator.unit || "N/A"}
                                    </p>
                                    {selectedIndicator.tags && (
                                      <div className="mt-1">
                                        <p className="text-sm font-medium">
                                          Tags:
                                        </p>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                          {formatTags(
                                            selectedIndicator.tags
                                          ).map((tag, i) => (
                                            <Badge
                                              key={i}
                                              variant="outline"
                                              className="text-xs"
                                            >
                                              {tag}
                                            </Badge>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </CardHeader>
                        <CardContent className="p-6">
                          {viewMode === "chart" &&
                          isChartTypeValid(effectiveChartType, data) ? (
                            <>
                              <div className="mb-4">
                                <p className="text-sm text-muted-foreground">
                                  Displaying {effectiveChartType} chart with{" "}
                                  {
                                    transformDataForChart(
                                      effectiveChartType,
                                      data
                                    ).length
                                  }{" "}
                                  data points
                                </p>
                              </div>

                              {chartSummary && (
                                <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
                                  <div className="flex items-start gap-3">
                                    <Sparkles className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                    <div className="flex-1">
                                      <h4 className="font-medium text-sm text-blue-900 mb-2">
                                        Chart Analysis
                                      </h4>
                                      <p className="text-sm text-gray-700 leading-relaxed mb-3">
                                        {chartSummary}
                                      </p>

                                      {chartInsights.length > 0 && (
                                        <div className="space-y-2">
                                          <div className="flex items-center gap-2">
                                            <Lightbulb className="h-4 w-4 text-amber-600" />
                                            <span className="text-xs font-medium text-amber-800">
                                              Key Insights
                                            </span>
                                          </div>
                                          {chartInsights.map(
                                            (insight, index) => (
                                              <div
                                                key={index}
                                                className="flex items-start gap-2"
                                              >
                                                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                                                <p className="text-xs text-amber-700">
                                                  {insight}
                                                </p>
                                              </div>
                                            )
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )}

                              <DataChart
                                type={effectiveChartType}
                                data={transformDataForChart(
                                  effectiveChartType,
                                  data
                                )}
                                title={`${selectedIndicator.name}`}
                                subtitle={
                                  data?.years?.length > 1
                                    ? `${timeRange[0]}-${timeRange[1]}`
                                    : `Year: ${data?.years?.[0] || 2024}`
                                }
                                height={500}
                                unit={selectedIndicator.unit}
                              />
                            </>
                          ) : viewMode === "chart" ? (
                            <div className="flex items-center justify-center h-96">
                              <Alert>
                                <AlertDescription>
                                  {!data
                                    ? "Loading data..."
                                    : `Data not suitable for ${effectiveChartType} chart. Try a different type.`}
                                </AlertDescription>
                              </Alert>
                            </div>
                          ) : viewMode === "table" && data?.raw_data ? (
                            <DataTable
                              data={data.raw_data.map((item: any) => ({
                                Year: item.year,
                                Country: item.country || "All",
                                Value: item.value,
                                Unit: item.unit || "-",
                                Notes: item.notes || "-",
                              }))}
                            />
                          ) : (
                            <div className="flex items-center justify-center h-96">
                              <Alert>
                                <AlertDescription>
                                  No data available for table view.
                                </AlertDescription>
                              </Alert>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>

                    <div className="space-y-4">
                      {data?.countries && data.countries.length > 0 && (
                        <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-lg">
                              Data Coverage
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="text-center p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                              <div className="text-2xl font-bold text-blue-600">
                                {data.countries.length}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Countries
                              </div>
                            </div>
                            <div className="text-center p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                              <div className="text-2xl font-bold text-green-600">
                                {data.years?.length || 0}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Years
                              </div>
                            </div>
                            <div className="text-center p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                              <div className="text-2xl font-bold text-purple-600">
                                {data.raw_data?.length || 0}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Observations
                              </div>
                            </div>
                            <div className="text-center p-3 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg">
                              <div className="text-2xl font-bold text-orange-600">
                                {data.years?.length
                                  ? Math.max(...data.years)
                                  : "N/A"}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Latest Year
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}

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
                            {data?.skipped_values &&
                              data.skipped_values.length > 0 && (
                                <div className="mt-2">
                                  <p className="text-xs text-muted-foreground">
                                    Filtered out {data.skipped_values.length}{" "}
                                    non-numeric values
                                  </p>
                                </div>
                              )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="data">
                  <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle>Raw Data</CardTitle>
                      <CardDescription>
                        Complete dataset for {selectedIndicator.name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {data?.raw_data ? (
                        <DataTable
                          data={data.raw_data.map((item: any) => ({
                            ID: item.id,
                            Year: item.year,
                            Country: item.country || "All",
                            Value: item.value,
                            Unit: item.unit || "-",
                            "Visual Entity": item.visual_title || "-",
                            Document: item.document_title || "-",
                            Notes: item.notes || "-",
                          }))}
                        />
                      ) : (
                        <div className="text-center py-8">
                          <p>No data available</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="kohonen">
                  <KohonenMapViewer className="w-full" />
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
