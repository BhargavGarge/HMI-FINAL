//fetching data from the dividend
// "use client";

// import { useEffect, useState } from "react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   CartesianGrid,
//   BarChart,
//   Bar,
//   Legend,
// } from "recharts";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   ArrowLeft,
//   Clock,
//   User,
//   TrendingUp,
//   BarChart3,
//   Activity,
//   History,
//   Calendar,
//   Zap,
// } from "lucide-react";
// import type { Story } from "@/story-card-data/card-data";

// interface IndicatorChart {
//   indicator_id: string;
//   name: string;
//   unit: string;
//   line_data: any[];
//   bar_data: any[];
//   timeline_data: {
//     past: any[];
//     present: any[];
//     future: any[];
//   };
// }

// interface TimelineData {
//   past: any[];
//   present: any[];
//   future: any[];
// }

// const CHART_COLORS = [
//   "#3B82F6",
//   "#EF4444",
//   "#10B981",
//   "#F59E0B",
//   "#8B5CF6",
//   "#EC4899",
//   "#06B6D4",
//   "#84CC16",
//   "#F97316",
//   "#6366F1",
// ];

// export function StoryDetailView({
//   story,
//   onBack,
// }: {
//   story: Story;
//   onBack: () => void;
// }) {
//   const [indicators, setIndicators] = useState<IndicatorChart[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function fetchIndicators() {
//       try {
//         const res = await fetch(
//           `http://127.0.0.1:5000/api/story-data/${story.id}`
//         );
//         const data = await res.json();

//         if (data.status !== "success" || !Array.isArray(data.indicators)) {
//           console.error("❌ Unexpected story data:", data);
//           setLoading(false);
//           return;
//         }

//         // For climate dividend story, fetch scenario data instead of time series
//         if (story.id === "climate-dividend") {
//           const scenarioRes = await fetch(
//             `http://127.0.0.1:5000/api/scenario-series?document_id=dwr-24-43`
//           );
//           const scenarioData = await scenarioRes.json();

//           if (scenarioData.status === "success") {
//             const processedIndicators = processScenarioData(
//               scenarioData.scenario_series
//             );
//             setIndicators(processedIndicators);
//           }
//         } else {
//           // Original time series logic for other stories
//           const promises = data.indicators.map(async (indicator: any) => {
//             const chartRes = await fetch(
//               `http://127.0.0.1:5000/api/time-series/${indicator.indicator_id}`
//             );
//             const chartData = await chartRes.json();

//             const timelineData = processTimelineData(
//               chartData.data?.line_data || [],
//               indicator.name
//             );

//             return {
//               indicator_id: indicator.indicator_id,
//               name: indicator.name,
//               unit: indicator.unit,
//               line_data: chartData.data?.line_data || [],
//               bar_data: chartData.data?.bar_data || [],
//               timeline_data: timelineData,
//             };
//           });

//           const allCharts = await Promise.all(promises);
//           setIndicators(allCharts);
//         }

//         setLoading(false);
//       } catch (err) {
//         console.error("Failed to load story data:", err);
//         setLoading(false);
//       }
//     }

//     fetchIndicators();
//   }, [story.id]);

//   // Classify years according to backend logic
//   function classifyYear(year: number): "past" | "present" | "future" {
//     if (year < 2023) {
//       return "past";
//     } else if (year >= 2023 && year <= 2024) {
//       return "present";
//     } else if (year >= 2025) {
//       return "future";
//     }
//     return "past"; // fallback
//   }

//   // Generate random data for missing periods
//   function generateRandomData(
//     period: "past" | "present" | "future",
//     indicatorName: string,
//     existingData: any[]
//   ): any[] {
//     const countries = ["Germany", "France", "Italy", "Spain", "Netherlands"];
//     const randomData: any[] = [];

//     // Determine year range based on period
//     let yearRange: number[] = [];
//     switch (period) {
//       case "past":
//         yearRange = [2018, 2019, 2020, 2021, 2022];
//         break;
//       case "present":
//         yearRange = [2023, 2024];
//         break;
//       case "future":
//         yearRange = [2025, 2026, 2027];
//         break;
//     }

//     // Generate base values based on indicator type
//     const getBaseValue = () => {
//       const name = indicatorName.toLowerCase();
//       if (name.includes("gdp") || name.includes("economic")) {
//         return Math.random() * 50000 + 20000; // 20k-70k range
//       } else if (name.includes("unemployment") || name.includes("rate")) {
//         return Math.random() * 15 + 2; // 2-17% range
//       } else if (name.includes("population") || name.includes("demographic")) {
//         return Math.random() * 10000000 + 5000000; // 5M-15M range
//       } else if (name.includes("inflation") || name.includes("price")) {
//         return Math.random() * 8 + 1; // 1-9% range
//       } else {
//         return Math.random() * 1000 + 100; // Generic 100-1100 range
//       }
//     };

//     yearRange.forEach((year) => {
//       const yearData: any = { year };

//       // Add 2-4 random countries with data
//       const numCountries = Math.floor(Math.random() * 3) + 2;
//       const selectedCountries = countries
//         .sort(() => 0.5 - Math.random())
//         .slice(0, numCountries);

//       selectedCountries.forEach((country) => {
//         const baseValue = getBaseValue();
//         // Add some variation (+/- 20%)
//         const variation = (Math.random() - 0.5) * 0.4;
//         yearData[country] = Math.round(baseValue * (1 + variation) * 100) / 100;
//       });

//       randomData.push(yearData);
//     });

//     return randomData;
//   }

//   // Process data into Past, Present, Future categories with proper classification
//   function processTimelineData(
//     lineData: any[],
//     indicatorName: string
//   ): TimelineData {
//     const past: any[] = [];
//     const present: any[] = [];
//     const future: any[] = [];

//     // Classify existing data
//     lineData.forEach((item) => {
//       const year = Number.parseInt(item.year);
//       const classification = classifyYear(year);

//       switch (classification) {
//         case "past":
//           past.push(item);
//           break;
//         case "present":
//           present.push(item);
//           break;
//         case "future":
//           future.push(item);
//           break;
//       }
//     });

//     // Generate random data for empty periods
//     const result = {
//       past:
//         past.length > 0
//           ? past
//           : generateRandomData("past", indicatorName, lineData),
//       present:
//         present.length > 0
//           ? present
//           : generateRandomData("present", indicatorName, lineData),
//       future:
//         future.length > 0
//           ? future
//           : generateRandomData("future", indicatorName, lineData),
//     };

//     return result;
//   }

//   // Process scenario data for climate dividend story
//   function processScenarioData(scenarioSeries: any): IndicatorChart[] {
//     const indicatorGroups: { [key: string]: any[] } = {};

//     // Group data by indicator type
//     Object.entries(scenarioSeries).forEach(([period, data]: [string, any]) => {
//       if (Array.isArray(data)) {
//         data.forEach((item: any) => {
//           const baseIndicator = item.indicator_name.replace(/_by_decile$/, "");
//           if (!indicatorGroups[baseIndicator]) {
//             indicatorGroups[baseIndicator] = [];
//           }
//           indicatorGroups[baseIndicator].push({
//             ...item,
//             period,
//             decile: indicatorGroups[baseIndicator].length + 1,
//           });
//         });
//       }
//     });

//     return Object.entries(indicatorGroups).map(([indicatorName, items]) => {
//       // Create decile-based visualization data
//       const decileData: any[] = [];
//       const maxDecile = Math.max(...items.map((item) => item.decile));

//       for (let decile = 1; decile <= maxDecile; decile++) {
//         const decileItem: any = { decile: `Decile ${decile}` };

//         items
//           .filter((item) => item.decile === decile)
//           .forEach((item) => {
//             const scenarioName =
//               item.period === "past"
//                 ? "Without Dividend"
//                 : item.period === "present"
//                 ? "With Full Dividend"
//                 : "With Reduced Dividend";
//             decileItem[scenarioName] = Number.parseFloat(item.value) || 0;
//           });

//         if (Object.keys(decileItem).length > 1) {
//           decileData.push(decileItem);
//         }
//       }

//       return {
//         indicator_id: `scenario_${indicatorName}`,
//         name: formatScenarioIndicatorName(indicatorName),
//         unit: items[0]?.unit || "%",
//         line_data: decileData,
//         bar_data: decileData,
//         timeline_data: {
//           past: decileData.map((d) => ({
//             decile: d.decile,
//             value: d["Without Dividend"] || 0,
//           })),
//           present: decileData.map((d) => ({
//             decile: d.decile,
//             value: d["With Full Dividend"] || 0,
//           })),
//           future: decileData.map((d) => ({
//             decile: d.decile,
//             value: d["With Reduced Dividend"] || 0,
//           })),
//         },
//       };
//     });
//   }

//   function formatScenarioIndicatorName(name: string): string {
//     return name
//       .replace(/_/g, " ")
//       .replace(/\b\w/g, (char) => char.toUpperCase())
//       .replace(/Climate Dividend/, "Climate Dividend")
//       .replace(/Total Balance/, "Net Financial Impact")
//       .replace(/Super E10/, "Gasoline (E10)")
//       .replace(/Natural Gas/, "Natural Gas")
//       .replace(/Heating Oil/, "Heating Oil");
//   }

//   function formatIndicatorLabel(rawName: string): string {
//     const [raw, unit] = rawName.includes(" (")
//       ? rawName.split(" (")
//       : [rawName, ""];

//     const readable = raw
//       .replace(/^\d+_?/, "")
//       .replace(/_/g, " ")
//       .replace(/(\d{4})_(\d{4})/g, "$1–$2")
//       .replace(/_(\d{4})_/g, " $1 ")
//       .replace(/\b(eu|gdp|usd|euro?)\b/gi, (match) => match.toUpperCase())
//       .replace(/\b\w/g, (char) => char.toUpperCase())
//       .replace(/\s+/g, " ")
//       .trim();

//     const cleanUnit = unit.replace(/\)$/, "").trim();
//     return cleanUnit ? `${readable} (${cleanUnit})` : readable;
//   }

//   const CustomTooltip = ({ active, payload, label }: any) => {
//     if (active && payload && payload.length) {
//       return (
//         <div className="bg-white p-4 border border-slate-200 rounded-lg shadow-lg">
//           <p className="font-semibold text-slate-900 mb-2">{`${label}`}</p>
//           {payload.map((entry: any, index: number) => (
//             <p key={index} className="text-sm" style={{ color: entry.color }}>
//               {`${entry.dataKey}: ${entry.value}`}
//             </p>
//           ))}
//         </div>
//       );
//     }
//     return null;
//   };

//   const TimelineSection = ({
//     title,
//     data,
//     icon: Icon,
//     color,
//     bgColor,
//     description,
//     isGenerated = false,
//   }: {
//     title: string;
//     data: any[];
//     icon: any;
//     color: string;
//     bgColor: string;
//     description: string;
//     isGenerated?: boolean;
//   }) => (
//     <div className="space-y-4">
//       <div
//         className={`${bgColor} rounded-lg p-4 border-l-4`}
//         style={{ borderLeftColor: color }}
//       >
//         <div className="flex items-center gap-3 mb-2">
//           <Icon className="w-5 h-5" style={{ color }} />
//           <h4 className="text-lg font-semibold text-slate-900">{title}</h4>
//         </div>
//         <p className="text-sm text-slate-600">{description}</p>
//       </div>

//       <div className="h-[300px] bg-white rounded-lg p-4 border">
//         <ResponsiveContainer width="100%" height="100%">
//           <BarChart
//             data={data}
//             margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
//           >
//             <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
//             <XAxis
//               dataKey="decile"
//               stroke="#64748b"
//               fontSize={12}
//               tickLine={false}
//               axisLine={false}
//               angle={-45}
//               textAnchor="end"
//               height={60}
//             />
//             <YAxis
//               stroke="#64748b"
//               fontSize={12}
//               tickLine={false}
//               axisLine={false}
//             />
//             <Tooltip content={<CustomTooltip />} />
//             <Bar dataKey="value" fill={color} radius={[2, 2, 0, 0]} />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">
//       {/* Header */}
//       <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-slate-200 z-10">
//         <div className="container mx-auto px-4 py-4">
//           <Button
//             variant="ghost"
//             onClick={onBack}
//             className="flex items-center gap-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
//           >
//             <ArrowLeft className="w-4 h-4" />
//             Back to Stories
//           </Button>
//         </div>
//       </div>

//       {/* Content */}
//       <div className="container mx-auto px-4 py-8 max-w-6xl">
//         {/* Title Section */}
//         <div className="mb-12">
//           <div className="flex items-center gap-2 mb-6">
//             <Badge
//               variant="secondary"
//               className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 border-0 font-medium"
//             >
//               {story.category}
//             </Badge>
//             <div className="flex items-center text-sm text-slate-500 gap-4">
//               <div className="flex items-center gap-1">
//                 <Clock className="w-3 h-3" />
//                 <span>{story.readTime}</span>
//               </div>
//               <div className="flex items-center gap-1">
//                 <User className="w-3 h-3" />
//                 <span>{story.author}</span>
//               </div>
//             </div>
//           </div>

//           <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
//             {story.title}
//           </h1>

//           <h2 className="text-xl md:text-2xl text-slate-600 mb-8 font-medium leading-relaxed">
//             {story.subtitle}
//           </h2>
//         </div>

//         {/* Introduction */}
//         <div className="mb-12">
//           <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50">
//             <CardContent className="p-8">
//               <div className="flex items-start gap-4">
//                 <div className="p-3 bg-blue-100 rounded-full">
//                   <Activity className="w-6 h-6 text-blue-600" />
//                 </div>
//                 <div>
//                   <h3 className="text-lg font-semibold text-slate-900 mb-3">
//                     Executive Summary
//                   </h3>
//                   <p className="text-lg text-slate-700 leading-relaxed">
//                     {story.intro}
//                   </p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Timeline Analysis */}
//         <div className="mt-16">
//           <div className="text-center mb-12">
//             <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
//               <TrendingUp className="w-4 h-4" />
//               Timeline Analysis
//             </div>
//             <h3 className="text-3xl font-bold text-slate-900 mb-4">
//               Past • Present • Future
//             </h3>
//             <p className="text-slate-600 text-lg">
//               Explore data across different time periods (Past: &lt;2023,
//               Present: 2023-2024, Future: ≥2025)
//             </p>
//           </div>

//           {loading ? (
//             <div className="space-y-8">
//               {[1, 2, 3].map((i) => (
//                 <Card key={i} className="border-0 shadow-lg">
//                   <CardHeader>
//                     <Skeleton className="h-6 w-3/4" />
//                   </CardHeader>
//                   <CardContent>
//                     <Skeleton className="h-[400px] w-full" />
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           ) : indicators.length > 0 ? (
//             <div className="space-y-12">
//               {indicators.map((ind, index) => {
//                 // Check which periods have original vs generated data
//                 const originalPastData = ind.line_data.filter(
//                   (item) => classifyYear(Number.parseInt(item.year)) === "past"
//                 );
//                 const originalPresentData = ind.line_data.filter(
//                   (item) =>
//                     classifyYear(Number.parseInt(item.year)) === "present"
//                 );
//                 const originalFutureData = ind.line_data.filter(
//                   (item) =>
//                     classifyYear(Number.parseInt(item.year)) === "future"
//                 );

//                 return (
//                   <Card
//                     key={ind.indicator_id}
//                     className="border-0 shadow-lg bg-white/90 backdrop-blur-sm overflow-hidden"
//                   >
//                     <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b">
//                       <div className="flex items-center gap-3">
//                         <div className="p-2 bg-blue-100 rounded-lg">
//                           <BarChart3 className="w-5 h-5 text-blue-600" />
//                         </div>
//                         <CardTitle className="text-xl text-slate-900">
//                           {formatIndicatorLabel(`${ind.name} (${ind.unit})`)}
//                         </CardTitle>
//                       </div>
//                     </CardHeader>

//                     <CardContent className="p-8">
//                       <Tabs defaultValue="timeline" className="w-full">
//                         <TabsList className="grid w-full grid-cols-2">
//                           <TabsTrigger value="timeline">
//                             Timeline View
//                           </TabsTrigger>
//                           <TabsTrigger value="traditional">
//                             Traditional View
//                           </TabsTrigger>
//                         </TabsList>

//                         <TabsContent
//                           value="timeline"
//                           className="space-y-8 mt-6"
//                         >
//                           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//                             <TimelineSection
//                               title="Without Climate Dividend"
//                               data={ind.timeline_data.past}
//                               icon={History}
//                               color="#EF4444"
//                               bgColor="bg-red-50"
//                               description="Financial burden on households without any climate dividend compensation"
//                             />

//                             <TimelineSection
//                               title="With Full Climate Dividend"
//                               data={ind.timeline_data.present}
//                               icon={Calendar}
//                               color="#10B981"
//                               bgColor="bg-green-50"
//                               description="Net financial impact when full climate dividend is provided to households"
//                             />

//                             <TimelineSection
//                               title="With Reduced Climate Dividend"
//                               data={ind.timeline_data.future}
//                               icon={Zap}
//                               color="#F59E0B"
//                               bgColor="bg-yellow-50"
//                               description="Financial impact with partial climate dividend (50% of full amount)"
//                             />
//                           </div>
//                         </TabsContent>

//                         <TabsContent value="traditional" className="mt-6">
//                           {ind.line_data.length > 0 && (
//                             <div className="mb-8">
//                               <h4 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
//                                 <TrendingUp className="w-4 h-4 text-blue-600" />
//                                 Complete Time Series
//                               </h4>
//                               <div className="h-[400px] bg-gradient-to-br from-slate-50 to-blue-50 rounded-lg p-4">
//                                 <ResponsiveContainer width="100%" height="100%">
//                                   <LineChart
//                                     data={ind.line_data}
//                                     margin={{
//                                       top: 20,
//                                       right: 30,
//                                       left: 20,
//                                       bottom: 20,
//                                     }}
//                                   >
//                                     <CartesianGrid
//                                       strokeDasharray="3 3"
//                                       stroke="#e2e8f0"
//                                     />
//                                     <XAxis
//                                       dataKey="year"
//                                       stroke="#64748b"
//                                       fontSize={12}
//                                       tickLine={false}
//                                       axisLine={false}
//                                     />
//                                     <YAxis
//                                       stroke="#64748b"
//                                       fontSize={12}
//                                       tickLine={false}
//                                       axisLine={false}
//                                     />
//                                     <Tooltip content={<CustomTooltip />} />
//                                     <Legend />
//                                     {Object.keys(ind.line_data[0] || {})
//                                       .filter((key) => key !== "year")
//                                       .map((country, idx) => (
//                                         <Line
//                                           key={country}
//                                           type="monotone"
//                                           dataKey={country}
//                                           stroke={
//                                             CHART_COLORS[
//                                               idx % CHART_COLORS.length
//                                             ]
//                                           }
//                                           strokeWidth={3}
//                                           dot={{
//                                             fill: CHART_COLORS[
//                                               idx % CHART_COLORS.length
//                                             ],
//                                             strokeWidth: 2,
//                                             r: 4,
//                                           }}
//                                           activeDot={{
//                                             r: 6,
//                                             stroke:
//                                               CHART_COLORS[
//                                                 idx % CHART_COLORS.length
//                                               ],
//                                             strokeWidth: 2,
//                                           }}
//                                         />
//                                       ))}
//                                   </LineChart>
//                                 </ResponsiveContainer>
//                               </div>
//                             </div>
//                           )}

//                           {ind.bar_data.length > 0 && (
//                             <div>
//                               <h4 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
//                                 <BarChart3 className="w-4 h-4 text-green-600" />
//                                 Comparative Analysis
//                               </h4>
//                               <div className="h-[400px] bg-gradient-to-br from-slate-50 to-green-50 rounded-lg p-4">
//                                 <ResponsiveContainer width="100%" height="100%">
//                                   <BarChart
//                                     data={ind.bar_data}
//                                     margin={{
//                                       top: 20,
//                                       right: 30,
//                                       left: 20,
//                                       bottom: 20,
//                                     }}
//                                   >
//                                     <CartesianGrid
//                                       strokeDasharray="3 3"
//                                       stroke="#e2e8f0"
//                                     />
//                                     <XAxis
//                                       dataKey="country"
//                                       stroke="#64748b"
//                                       fontSize={12}
//                                       tickLine={false}
//                                       axisLine={false}
//                                     />
//                                     <YAxis
//                                       stroke="#64748b"
//                                       fontSize={12}
//                                       tickLine={false}
//                                       axisLine={false}
//                                     />
//                                     <Tooltip content={<CustomTooltip />} />
//                                     <Legend />
//                                     <Bar
//                                       dataKey="value"
//                                       fill="url(#barGradient)"
//                                       radius={[4, 4, 0, 0]}
//                                     />
//                                     <defs>
//                                       <linearGradient
//                                         id="barGradient"
//                                         x1="0"
//                                         y1="0"
//                                         x2="0"
//                                         y2="1"
//                                       >
//                                         <stop offset="0%" stopColor="#10B981" />
//                                         <stop
//                                           offset="100%"
//                                           stopColor="#059669"
//                                         />
//                                       </linearGradient>
//                                     </defs>
//                                   </BarChart>
//                                 </ResponsiveContainer>
//                               </div>
//                             </div>
//                           )}
//                         </TabsContent>
//                       </Tabs>
//                     </CardContent>
//                   </Card>
//                 );
//               })}
//             </div>
//           ) : (
//             <Card className="border-0 shadow-lg">
//               <CardContent className="p-12 text-center">
//                 <BarChart3 className="w-16 h-16 text-slate-400 mx-auto mb-4" />
//                 <p className="text-slate-600 text-lg">
//                   No indicator data available for this story
//                 </p>
//               </CardContent>
//             </Card>
//           )}
//         </div>

//         {/* Footer */}
//         <div className="mt-16 pt-8 border-t border-slate-200">
//           <div className="flex items-center justify-between">
//             <div className="text-sm text-slate-500">
//               Published by {story.author} •{" "}
//               {new Date(story.publishDate).toLocaleDateString()}
//             </div>
//             <Button
//               onClick={onBack}
//               variant="outline"
//               className="hover:bg-slate-100 bg-transparent"
//             >
//               Back to Stories
//             </Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
//fethcing data fromm energy scenario api
// "use client";

// import { useEffect, useState } from "react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   CartesianGrid,
//   BarChart,
//   Bar,
//   Legend,
// } from "recharts";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   ArrowLeft,
//   Clock,
//   User,
//   TrendingUp,
//   BarChart3,
//   Activity,
//   History,
//   Calendar,
//   Zap,
//   Info,
// } from "lucide-react";
// import type { Story } from "@/story-card-data/card-data";

// interface IndicatorChart {
//   indicator_id: string;
//   name: string;
//   unit: string;
//   line_data: any[];
//   bar_data: any[];
//   timeline_data: {
//     past: any[];
//     present: any[];
//     future: any[];
//   };
// }

// interface TimelineData {
//   past: any[];
//   present: any[];
//   future: any[];
// }

// const CHART_COLORS = [
//   "#3B82F6",
//   "#EF4444",
//   "#10B981",
//   "#F59E0B",
//   "#8B5CF6",
//   "#EC4899",
//   "#06B6D4",
//   "#84CC16",
//   "#F97316",
//   "#6366F1",
// ];

// export function StoryDetailView({
//   story,
//   onBack,
// }: {
//   story: Story;
//   onBack: () => void;
// }) {
//   const [indicators, setIndicators] = useState<IndicatorChart[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function fetchIndicators() {
//       try {
//         const res = await fetch(
//           `http://127.0.0.1:5000/api/story-data/${story.id}`
//         );
//         const data = await res.json();

//         if (data.status !== "success" || !Array.isArray(data.indicators)) {
//           console.error("❌ Unexpected story data:", data);
//           setLoading(false);
//           return;
//         }

//         const promises = data.indicators.map(async (indicator: any) => {
//           const chartRes = await fetch(
//             `http://127.0.0.1:5000/api/time-series/${indicator.indicator_id}`
//           );
//           const chartData = await chartRes.json();

//           // Process timeline data with proper classification
//           const timelineData = processTimelineData(
//             chartData.data?.line_data || [],
//             indicator.name
//           );

//           return {
//             indicator_id: indicator.indicator_id,
//             name: indicator.name,
//             unit: indicator.unit,
//             line_data: chartData.data?.line_data || [],
//             bar_data: chartData.data?.bar_data || [],
//             timeline_data: timelineData,
//           };
//         });

//         const allCharts = await Promise.all(promises);
//         setIndicators(allCharts);
//         setLoading(false);
//       } catch (err) {
//         console.error("Failed to load story data:", err);
//         setLoading(false);
//       }
//     }

//     fetchIndicators();
//   }, [story.id]);

//   // Classify years according to backend logic
//   function classifyYear(year: number): "past" | "present" | "future" {
//     if (year < 2023) {
//       return "past";
//     } else if (year >= 2023 && year <= 2024) {
//       return "present";
//     } else if (year >= 2025) {
//       return "future";
//     }
//     return "past"; // fallback
//   }

//   // Generate random data for missing periods
//   function generateRandomData(
//     period: "past" | "present" | "future",
//     indicatorName: string,
//     existingData: any[]
//   ): any[] {
//     const countries = ["Germany", "France", "Italy", "Spain", "Netherlands"];
//     const randomData: any[] = [];

//     // Determine year range based on period
//     let yearRange: number[] = [];
//     switch (period) {
//       case "past":
//         yearRange = [2018, 2019, 2020, 2021, 2022];
//         break;
//       case "present":
//         yearRange = [2023, 2024];
//         break;
//       case "future":
//         yearRange = [2025, 2026, 2027];
//         break;
//     }

//     // Generate base values based on indicator type
//     const getBaseValue = () => {
//       const name = indicatorName.toLowerCase();
//       if (name.includes("gdp") || name.includes("economic")) {
//         return Math.random() * 50000 + 20000; // 20k-70k range
//       } else if (name.includes("unemployment") || name.includes("rate")) {
//         return Math.random() * 15 + 2; // 2-17% range
//       } else if (name.includes("population") || name.includes("demographic")) {
//         return Math.random() * 10000000 + 5000000; // 5M-15M range
//       } else if (name.includes("inflation") || name.includes("price")) {
//         return Math.random() * 8 + 1; // 1-9% range
//       } else {
//         return Math.random() * 1000 + 100; // Generic 100-1100 range
//       }
//     };

//     yearRange.forEach((year) => {
//       const yearData: any = { year };

//       // Add 2-4 random countries with data
//       const numCountries = Math.floor(Math.random() * 3) + 2;
//       const selectedCountries = countries
//         .sort(() => 0.5 - Math.random())
//         .slice(0, numCountries);

//       selectedCountries.forEach((country) => {
//         const baseValue = getBaseValue();
//         // Add some variation (+/- 20%)
//         const variation = (Math.random() - 0.5) * 0.4;
//         yearData[country] = Math.round(baseValue * (1 + variation) * 100) / 100;
//       });

//       randomData.push(yearData);
//     });

//     return randomData;
//   }

//   // Process data into Past, Present, Future categories with proper classification
//   function processTimelineData(
//     lineData: any[],
//     indicatorName: string
//   ): TimelineData {
//     const past: any[] = [];
//     const present: any[] = [];
//     const future: any[] = [];

//     // Classify existing data
//     lineData.forEach((item) => {
//       const year = Number.parseInt(item.year);
//       const classification = classifyYear(year);

//       switch (classification) {
//         case "past":
//           past.push(item);
//           break;
//         case "present":
//           present.push(item);
//           break;
//         case "future":
//           future.push(item);
//           break;
//       }
//     });

//     // Generate random data for empty periods
//     const result = {
//       past:
//         past.length > 0
//           ? past
//           : generateRandomData("past", indicatorName, lineData),
//       present:
//         present.length > 0
//           ? present
//           : generateRandomData("present", indicatorName, lineData),
//       future:
//         future.length > 0
//           ? future
//           : generateRandomData("future", indicatorName, lineData),
//     };

//     return result;
//   }

//   function formatIndicatorLabel(rawName: string): string {
//     const [raw, unit] = rawName.includes(" (")
//       ? rawName.split(" (")
//       : [rawName, ""];

//     const readable = raw
//       .replace(/^\d+_?/, "")
//       .replace(/_/g, " ")
//       .replace(/(\d{4})_(\d{4})/g, "$1–$2")
//       .replace(/_(\d{4})_/g, " $1 ")
//       .replace(/\b(eu|gdp|usd|euro?)\b/gi, (match) => match.toUpperCase())
//       .replace(/\b\w/g, (char) => char.toUpperCase())
//       .replace(/\s+/g, " ")
//       .trim();

//     const cleanUnit = unit.replace(/\)$/, "").trim();
//     return cleanUnit ? `${readable} (${cleanUnit})` : readable;
//   }

//   const CustomTooltip = ({ active, payload, label }: any) => {
//     if (active && payload && payload.length) {
//       return (
//         <div className="bg-white p-4 border border-slate-200 rounded-lg shadow-lg">
//           <p className="font-semibold text-slate-900 mb-2">{`${label}`}</p>
//           {payload.map((entry: any, index: number) => (
//             <p key={index} className="text-sm" style={{ color: entry.color }}>
//               {`${entry.dataKey}: ${entry.value}`}
//             </p>
//           ))}
//         </div>
//       );
//     }
//     return null;
//   };

//   const TimelineSection = ({
//     title,
//     data,
//     icon: Icon,
//     color,
//     bgColor,
//     description,
//     isGenerated = false,
//   }: {
//     title: string;
//     data: any[];
//     icon: any;
//     color: string;
//     bgColor: string;
//     description: string;
//     isGenerated?: boolean;
//   }) => (
//     <div className="space-y-4">
//       <div
//         className={`${bgColor} rounded-lg p-4 border-l-4`}
//         style={{ borderLeftColor: color }}
//       >
//         <div className="flex items-center gap-3 mb-2">
//           <Icon className="w-5 h-5" style={{ color }} />
//           <h4 className="text-lg font-semibold text-slate-900">{title}</h4>
//         </div>
//         <p className="text-sm text-slate-600">{description}</p>
//       </div>

//       <div className="h-[300px] bg-white rounded-lg p-4 border">
//         <ResponsiveContainer width="100%" height="100%">
//           <LineChart
//             data={data}
//             margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
//           >
//             <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
//             <XAxis
//               dataKey="year"
//               stroke="#64748b"
//               fontSize={12}
//               tickLine={false}
//               axisLine={false}
//             />
//             <YAxis
//               stroke="#64748b"
//               fontSize={12}
//               tickLine={false}
//               axisLine={false}
//             />
//             <Tooltip content={<CustomTooltip />} />
//             <Legend />
//             {data.length > 0 &&
//               Object.keys(data[0])
//                 .filter((key) => key !== "year")
//                 .map((country, idx) => (
//                   <Line
//                     key={country}
//                     type="monotone"
//                     dataKey={country}
//                     stroke={color}
//                     strokeWidth={isGenerated ? 2 : 3}
//                     strokeDasharray={isGenerated ? "5,5" : "0"}
//                     dot={{
//                       fill: color,
//                       strokeWidth: 2,
//                       r: isGenerated ? 3 : 4,
//                       opacity: isGenerated ? 0.7 : 1,
//                     }}
//                     activeDot={{
//                       r: isGenerated ? 5 : 6,
//                       stroke: color,
//                       strokeWidth: 2,
//                       opacity: isGenerated ? 0.8 : 1,
//                     }}
//                   />
//                 ))}
//           </LineChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">
//       {/* Header */}
//       <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-slate-200 z-10">
//         <div className="container mx-auto px-4 py-4">
//           <Button
//             variant="ghost"
//             onClick={onBack}
//             className="flex items-center gap-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
//           >
//             <ArrowLeft className="w-4 h-4" />
//             Back to Stories
//           </Button>
//         </div>
//       </div>

//       {/* Content */}
//       <div className="container mx-auto px-4 py-8 max-w-6xl">
//         {/* Title Section */}
//         <div className="mb-12">
//           <div className="flex items-center gap-2 mb-6">
//             <Badge
//               variant="secondary"
//               className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 border-0 font-medium"
//             >
//               {story.category}
//             </Badge>
//             <div className="flex items-center text-sm text-slate-500 gap-4">
//               <div className="flex items-center gap-1">
//                 <Clock className="w-3 h-3" />
//                 <span>{story.readTime}</span>
//               </div>
//               <div className="flex items-center gap-1">
//                 <User className="w-3 h-3" />
//                 <span>{story.author}</span>
//               </div>
//             </div>
//           </div>

//           <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
//             {story.title}
//           </h1>

//           <h2 className="text-xl md:text-2xl text-slate-600 mb-8 font-medium leading-relaxed">
//             {story.subtitle}
//           </h2>
//         </div>

//         {/* Introduction */}
//         <div className="mb-12">
//           <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50">
//             <CardContent className="p-8">
//               <div className="flex items-start gap-4">
//                 <div className="p-3 bg-blue-100 rounded-full">
//                   <Activity className="w-6 h-6 text-blue-600" />
//                 </div>
//                 <div>
//                   <h3 className="text-lg font-semibold text-slate-900 mb-3">
//                     Executive Summary
//                   </h3>
//                   <p className="text-lg text-slate-700 leading-relaxed">
//                     {story.intro}
//                   </p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Timeline Analysis */}
//         <div className="mt-16">
//           <div className="text-center mb-12">
//             <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
//               <TrendingUp className="w-4 h-4" />
//               Timeline Analysis
//             </div>
//             <h3 className="text-3xl font-bold text-slate-900 mb-4">
//               Past • Present • Future
//             </h3>
//             <p className="text-slate-600 text-lg">
//               Explore data across different time periods (Past: &lt;2023,
//               Present: 2023-2024, Future: ≥2025)
//             </p>
//           </div>

//           {loading ? (
//             <div className="space-y-8">
//               {[1, 2, 3].map((i) => (
//                 <Card key={i} className="border-0 shadow-lg">
//                   <CardHeader>
//                     <Skeleton className="h-6 w-3/4" />
//                   </CardHeader>
//                   <CardContent>
//                     <Skeleton className="h-[400px] w-full" />
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           ) : indicators.length > 0 ? (
//             <div className="space-y-12">
//               {indicators.map((ind, index) => {
//                 // Check which periods have original vs generated data
//                 const originalPastData = ind.line_data.filter(
//                   (item) => classifyYear(Number.parseInt(item.year)) === "past"
//                 );
//                 const originalPresentData = ind.line_data.filter(
//                   (item) =>
//                     classifyYear(Number.parseInt(item.year)) === "present"
//                 );
//                 const originalFutureData = ind.line_data.filter(
//                   (item) =>
//                     classifyYear(Number.parseInt(item.year)) === "future"
//                 );

//                 return (
//                   <Card
//                     key={ind.indicator_id}
//                     className="border-0 shadow-lg bg-white/90 backdrop-blur-sm overflow-hidden"
//                   >
//                     <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b">
//                       <div className="flex items-center gap-3">
//                         <div className="p-2 bg-blue-100 rounded-lg">
//                           <BarChart3 className="w-5 h-5 text-blue-600" />
//                         </div>
//                         <CardTitle className="text-xl text-slate-900">
//                           {formatIndicatorLabel(`${ind.name} (${ind.unit})`)}
//                         </CardTitle>
//                       </div>
//                     </CardHeader>

//                     <CardContent className="p-8">
//                       <Tabs defaultValue="timeline" className="w-full">
//                         <TabsList className="grid w-full grid-cols-2">
//                           <TabsTrigger value="timeline">
//                             Timeline View
//                           </TabsTrigger>
//                           <TabsTrigger value="traditional">
//                             Traditional View
//                           </TabsTrigger>
//                         </TabsList>

//                         <TabsContent
//                           value="timeline"
//                           className="space-y-8 mt-6"
//                         >
//                           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//                             <TimelineSection
//                               title="Past Trends"
//                               data={ind.timeline_data.past}
//                               icon={History}
//                               color="#8B5CF6"
//                               bgColor="bg-purple-50"
//                               description="Historical data showing long-term patterns and baseline trends"
//                               isGenerated={originalPastData.length === 0}
//                             />

//                             <TimelineSection
//                               title="Present State"
//                               data={ind.timeline_data.present}
//                               icon={Calendar}
//                               color="#3B82F6"
//                               bgColor="bg-blue-50"
//                               description="Recent developments and current situation analysis"
//                               isGenerated={originalPresentData.length === 0}
//                             />

//                             <TimelineSection
//                               title="Future Outlook"
//                               data={ind.timeline_data.future}
//                               icon={Zap}
//                               color="#10B981"
//                               bgColor="bg-green-50"
//                               description="Projected trends and anticipated developments"
//                               isGenerated={originalFutureData.length === 0}
//                             />
//                           </div>
//                         </TabsContent>

//                         <TabsContent value="traditional" className="mt-6">
//                           {ind.line_data.length > 0 && (
//                             <div className="mb-8">
//                               <h4 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
//                                 <TrendingUp className="w-4 h-4 text-blue-600" />
//                                 Complete Time Series
//                               </h4>
//                               <div className="h-[400px] bg-gradient-to-br from-slate-50 to-blue-50 rounded-lg p-4">
//                                 <ResponsiveContainer width="100%" height="100%">
//                                   <LineChart
//                                     data={ind.line_data}
//                                     margin={{
//                                       top: 20,
//                                       right: 30,
//                                       left: 20,
//                                       bottom: 20,
//                                     }}
//                                   >
//                                     <CartesianGrid
//                                       strokeDasharray="3 3"
//                                       stroke="#e2e8f0"
//                                     />
//                                     <XAxis
//                                       dataKey="year"
//                                       stroke="#64748b"
//                                       fontSize={12}
//                                       tickLine={false}
//                                       axisLine={false}
//                                     />
//                                     <YAxis
//                                       stroke="#64748b"
//                                       fontSize={12}
//                                       tickLine={false}
//                                       axisLine={false}
//                                     />
//                                     <Tooltip content={<CustomTooltip />} />
//                                     <Legend />
//                                     {Object.keys(ind.line_data[0] || {})
//                                       .filter((key) => key !== "year")
//                                       .map((country, idx) => (
//                                         <Line
//                                           key={country}
//                                           type="monotone"
//                                           dataKey={country}
//                                           stroke={
//                                             CHART_COLORS[
//                                               idx % CHART_COLORS.length
//                                             ]
//                                           }
//                                           strokeWidth={3}
//                                           dot={{
//                                             fill: CHART_COLORS[
//                                               idx % CHART_COLORS.length
//                                             ],
//                                             strokeWidth: 2,
//                                             r: 4,
//                                           }}
//                                           activeDot={{
//                                             r: 6,
//                                             stroke:
//                                               CHART_COLORS[
//                                                 idx % CHART_COLORS.length
//                                               ],
//                                             strokeWidth: 2,
//                                           }}
//                                         />
//                                       ))}
//                                   </LineChart>
//                                 </ResponsiveContainer>
//                               </div>
//                             </div>
//                           )}

//                           {ind.bar_data.length > 0 && (
//                             <div>
//                               <h4 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
//                                 <BarChart3 className="w-4 h-4 text-green-600" />
//                                 Comparative Analysis
//                               </h4>
//                               <div className="h-[400px] bg-gradient-to-br from-slate-50 to-green-50 rounded-lg p-4">
//                                 <ResponsiveContainer width="100%" height="100%">
//                                   <BarChart
//                                     data={ind.bar_data}
//                                     margin={{
//                                       top: 20,
//                                       right: 30,
//                                       left: 20,
//                                       bottom: 20,
//                                     }}
//                                   >
//                                     <CartesianGrid
//                                       strokeDasharray="3 3"
//                                       stroke="#e2e8f0"
//                                     />
//                                     <XAxis
//                                       dataKey="country"
//                                       stroke="#64748b"
//                                       fontSize={12}
//                                       tickLine={false}
//                                       axisLine={false}
//                                     />
//                                     <YAxis
//                                       stroke="#64748b"
//                                       fontSize={12}
//                                       tickLine={false}
//                                       axisLine={false}
//                                     />
//                                     <Tooltip content={<CustomTooltip />} />
//                                     <Legend />
//                                     <Bar
//                                       dataKey="value"
//                                       fill="url(#barGradient)"
//                                       radius={[4, 4, 0, 0]}
//                                     />
//                                     <defs>
//                                       <linearGradient
//                                         id="barGradient"
//                                         x1="0"
//                                         y1="0"
//                                         x2="0"
//                                         y2="1"
//                                       >
//                                         <stop offset="0%" stopColor="#10B981" />
//                                         <stop
//                                           offset="100%"
//                                           stopColor="#059669"
//                                         />
//                                       </linearGradient>
//                                     </defs>
//                                   </BarChart>
//                                 </ResponsiveContainer>
//                               </div>
//                             </div>
//                           )}
//                         </TabsContent>
//                       </Tabs>
//                     </CardContent>
//                   </Card>
//                 );
//               })}
//             </div>
//           ) : (
//             <Card className="border-0 shadow-lg">
//               <CardContent className="p-12 text-center">
//                 <BarChart3 className="w-16 h-16 text-slate-400 mx-auto mb-4" />
//                 <p className="text-slate-600 text-lg">
//                   No indicator data available for this story
//                 </p>
//               </CardContent>
//             </Card>
//           )}
//         </div>

//         {/* Footer */}
//         <div className="mt-16 pt-8 border-t border-slate-200">
//           <div className="flex items-center justify-between">
//             <div className="text-sm text-slate-500">
//               Published by {story.author} •{" "}
//               {new Date(story.publishDate).toLocaleDateString()}
//             </div>
//             <Button
//               onClick={onBack}
//               variant="outline"
//               className="hover:bg-slate-100 bg-transparent"
//             >
//               Back to Stories
//             </Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
