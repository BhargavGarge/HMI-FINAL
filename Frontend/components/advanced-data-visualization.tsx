// "use client";

// import { useState } from "react";
// import { motion } from "framer-motion";
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardContent,
//   CardFooter,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import {
//   BarChart,
//   LineChart,
//   PieChart,
//   TrendingUp,
//   Zap,
//   Users,
//   ArrowRight,
//   ChevronRight,
//   ChevronLeft,
//   Lightbulb,
// } from "lucide-react";
// import { domains } from "./domains";
// import {
//   Bar,
//   BarChart as RechartsBarChart,
//   Line,
//   LineChart as RechartsLineChart,
//   Pie,
//   PieChart as RechartsPieChart,
//   Cell,
//   ResponsiveContainer,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
// } from "recharts";

// // Color mappings for domains
// const domainColors = {
//   macroeconomics: "blue",
//   Energy: "indigo",
//   "gender-equality": "purple",
// };

// const colorClasses = {
//   blue: {
//     bg50: "bg-blue-50",
//     bg100: "bg-blue-100",
//     text600: "text-blue-600",
//     text700: "text-blue-700",
//     text900: "text-blue-900",
//     border500: "border-blue-500",
//     bg500: "bg-blue-500",
//   },
//   indigo: {
//     bg50: "bg-indigo-50",
//     bg100: "bg-indigo-100",
//     text600: "text-indigo-600",
//     text700: "text-indigo-700",
//     text900: "text-indigo-900",
//     border500: "border-indigo-500",
//     bg500: "bg-indigo-500",
//   },
//   purple: {
//     bg50: "bg-purple-50",
//     bg100: "bg-purple-100",
//     text600: "text-purple-600",
//     text700: "text-purple-700",
//     text900: "text-purple-900",
//     border500: "border-purple-500",
//     bg500: "bg-purple-500",
//   },
// };

// // Domain-specific data extractors
// const domainDataExtractors = {
//   macroeconomics: (story: any) => {
//     const data = [];
//     // Extract GDP growth data
//     const gdpMatches = story.sections
//       .map((s: any) => s.content.match(/(\d+\.?\d*)% GDP/g))
//       .filter(Boolean);
//     if (gdpMatches.length) {
//       data.push({
//         name: "GDP Growth",
//         value: parseFloat(gdpMatches[0][0]),
//       });
//     }

//     // Extract inflation data
//     const inflationMatches = story.sections
//       .map((s: any) => s.content.match(/(\d+\.?\d*)% inflation/g))
//       .filter(Boolean);
//     if (inflationMatches.length) {
//       data.push({
//         name: "Inflation",
//         value: parseFloat(inflationMatches[0][0]),
//       });
//     }

//     // Extract export data
//     const exportMatches = story.sections
//       .map((s: any) => s.content.match(/exports (declined|dropped|fell) by (\d+\.?\d*)%/g))
//       .filter(Boolean);
//     if (exportMatches.length) {
//       data.push({
//         name: "Export Decline",
//         value: parseFloat(exportMatches[0][2]),
//       });
//     }

//     return data.length ? data : null;
//   },
//   Energy: (story: any) => {
//     const data = [];
//     // Extract renewable energy data
//     const renewableMatches = story.sections
//       .map((s: any) => s.content.match(/(\d+\.?\d*)% renewable/g))
//       .filter(Boolean);
//     if (renewableMatches.length) {
//       data.push({
//         name: "Renewable Energy",
//         value: parseFloat(renewableMatches[0][0]),
//       });
//     }

//     // Extract cost reduction data
//     const costMatches = story.sections
//       .map((s: any) => s.content.match(/(\d+\.?\d*)% drop/g))
//       .filter(Boolean);
//     if (costMatches.length) {
//       data.push({
//         name: "Cost Reduction",
//         value: parseFloat(costMatches[0][0]),
//       });
//     }

//     return data.length ? data : null;
//   },
//   "gender-equality": (story: any) => {
//     const data = [];
//     // Extract gender gap data
//     const gapMatches = story.sections
//       .map((s: any) => s.content.match(/(\d+\.?\d*)% gender gap/g))
//       .filter(Boolean);
//     if (gapMatches.length) {
//       data.push({
//         name: "Gender Gap",
//         value: parseFloat(gapMatches[0][0]),
//       });
//     }

//     // Extract care work data
//     const careMatches = story.sections
//       .map((s: any) => s.content.match(/(\d+\.?\d*)% of care work/g))
//       .filter(Boolean);
//     if (careMatches.length) {
//       data.push({
//         name: "Care Work",
//         value: parseFloat(careMatches[0][0]),
//       });
//     }

//     return data.length ? data : null;
//   },
// };

// // Time series data generator for trends
// const generateTimeSeriesData = (story: any) => {
//   const years = [2020, 2021, 2022, 2023, 2024];
//   return years.map((year) => {
//     const yearContent = story.sections.find((s: any) =>
//       s.content.includes(year.toString())
//     );
//     const valueMatch = yearContent?.content.match(/(\d+\.?\d*)%/);
//     return {
//       year,
//       value: valueMatch ? parseFloat(valueMatch[1]) : Math.random() * 10 + 5,
//     };
//   });
// };

// export function DomainStoriesWithVisualizations() {
//   const [selectedDomain, setSelectedDomain] = useState(domains[0]);
//   const [selectedStory, setSelectedStory] = useState(domains[0].stories[0]);
//   const colors =
//     colorClasses[
//       domainColors[selectedDomain.id as keyof typeof domainColors] as keyof typeof colorClasses
//     ] || colorClasses.blue;

//   // Get extracted data for the current story
//   const storyData = domainDataExtractors[selectedDomain.id as keyof typeof domainDataExtractors](selectedStory);
//   const timeSeriesData = generateTimeSeriesData(selectedStory);

//   // Color palette for charts
//   const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
//       <div className="container mx-auto px-4 py-8">
//         {/* Domain Selection */}
//         <div className="mb-8">
//           <h2 className="text-2xl font-bold mb-4">Explore Economic Stories</h2>
//           <div className="flex flex-wrap gap-4">
//             {domains.map((domain) => (
//               <motion.div
//                 key={domain.id}
//                 whileHover={{ scale: 1.03 }}
//                 whileTap={{ scale: 0.98 }}
//               >
//                 <Card
//                   className={`w-64 cursor-pointer transition-all ${
//                     selectedDomain.id === domain.id
//                       ? `${colorClasses[domainColors[domain.id as keyof typeof domainColors] as keyof typeof colorClasses].border500} border-2 shadow-lg`
//                       : "hover:shadow-md"
//                   }`}
//                   onClick={() => {
//                     setSelectedDomain(domain);
//                     setSelectedStory(domain.stories[0]);
//                   }}
//                 >
//                   <CardHeader>
//                     <div className="flex items-center gap-3">
//                       <div
//                         className={`p-3 rounded-lg ${
//                           colorClasses[domainColors[domain.id as keyof typeof domainColors] as keyof typeof colorClasses].bg500
//                         } text-white`}
//                       >
//                         {domain.id === "macroeconomics" && <TrendingUp />}
//                         {domain.id === "Energy" && <Zap />}
//                         {domain.id === "gender-equality" && <Users />}
//                       </div>
//                       <CardTitle>{domain.name}</CardTitle>
//                     </div>
//                   </CardHeader>
//                   <CardContent>
//                     <p className="text-sm text-gray-600 line-clamp-2">
//                       {domain.description}
//                     </p>
//                   </CardContent>
//                   <CardFooter className="flex justify-between text-sm">
//                     <Badge variant="outline">
//                       {domain.totalStories} stories
//                     </Badge>
//                     <Badge variant="outline">
//                       {domain.totalReadTime} min read
//                     </Badge>
//                   </CardFooter>
//                 </Card>
//               </motion.div>
//             ))}
//           </div>
//         </div>

//         {/* Story Content */}
//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
//           {/* Stories List */}
//           <div className="lg:col-span-1">
//             <Card className="sticky top-4">
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <BarChart className="h-5 w-5" />
//                   {selectedDomain.name} Stories
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-2">
//                 {selectedDomain.stories.map((story) => (
//                   <motion.div
//                     key={story.id}
//                     whileHover={{ scale: 1.01 }}
//                     whileTap={{ scale: 0.99 }}
//                   >
//                     <Card
//                       className={`cursor-pointer transition-all mb-2 ${
//                         selectedStory.id === story.id
//                           ? `${colorClasses[domainColors[selectedDomain.id as keyof typeof domainColors] as keyof typeof colorClasses].bg50} ${colorClasses[domainColors[selectedDomain.id as keyof typeof domainColors] as keyof typeof colorClasses].border500} border-l-4`
//                           : "hover:bg-gray-50"
//                       }`}
//                       onClick={() => setSelectedStory(story)}
//                     >
//                       <CardHeader className="pb-2">
//                         <CardTitle className="text-lg">
//                           {story.title}
//                         </CardTitle>
//                       </CardHeader>
//                       <CardContent className="pb-4">
//                         <p className="text-sm text-gray-600 line-clamp-2">
//                           {story.subtitle}
//                         </p>
//                         <div className="flex flex-wrap gap-1 mt-2">
//                           {story.tags.slice(0, 3).map((tag) => (
//                             <Badge
//                               key={tag}
//                               variant="outline"
//                               className="text-xs"
//                             >
//                               {tag}
//                             </Badge>
//                           ))}
//                         </div>
//                       </CardContent>
//                     </Card>
//                   </motion.div>
//                 ))}
//               </CardContent>
//             </Card>
//           </div>

//           {/* Story Visualization */}
//           <div className="lg:col-span-3 space-y-6">
//             {/* Story Header */}
//             <Card className="bg-gradient-to-r from-white to-gray-50">
//               <CardHeader>
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <h1 className="text-2xl font-bold">
//                       {selectedStory.title}
//                     </h1>
//                     <p className="text-lg text-gray-600">
//                       {selectedStory.subtitle}
//                     </p>
//                   </div>
//                   <div className="flex gap-2">
//                     <Badge variant="outline">
//                       {selectedStory.readTime} min read
//                     </Badge>
//                     <Badge variant="outline">
//                       {selectedStory.difficulty}
//                     </Badge>
//                   </div>
//                 </div>
//               </CardHeader>
//             </Card>

//             {/* Thesis */}
//             <Card>
//               <CardHeader
//                 className={`${colorClasses[domainColors[selectedDomain.id as keyof typeof domainColors] as keyof typeof colorClasses].bg50} pb-4`}
//               >
//                 <CardTitle className="flex items-center gap-2">
//                   <Lightbulb className="h-5 w-5" />
//                   Central Thesis
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p className="text-gray-700 leading-relaxed">
//                   {selectedStory.thesis}
//                 </p>
//               </CardContent>
//             </Card>

//             {/* Data Visualization Section */}
//             {storyData && (
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <LineChart className="h-5 w-5" />
//                     Data Insights
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-8">
//                   {/* Bar Chart */}
//                   <div>
//                     <h3 className="font-medium mb-4 flex items-center gap-2">
//                       <BarChart className="h-4 w-4" />
//                       Key Metrics Comparison
//                     </h3>
//                     <div className="h-64">
//                       <ResponsiveContainer width="100%" height="100%">
//                         <RechartsBarChart data={storyData}>
//                           <CartesianGrid strokeDasharray="3 3" />
//                           <XAxis dataKey="name" />
//                           <YAxis />
//                           <Tooltip />
//                           <Legend />
//                           <Bar
//                             dataKey="value"
//                             fill={colorClasses[domainColors[selectedDomain.id as keyof typeof domainColors] as keyof typeof colorClasses].bg500}
//                             name="Percentage"
//                           />
//                         </RechartsBarChart>
//                       </ResponsiveContainer>
//                     </div>
//                   </div>

//                   {/* Line Chart */}
//                   <div>
//                     <h3 className="font-medium mb-4 flex items-center gap-2">
//                       <LineChart className="h-4 w-4" />
//                       Trend Over Time
//                     </h3>
//                     <div className="h-64">
//                       <ResponsiveContainer width="100%" height="100%">
//                         <RechartsLineChart data={timeSeriesData}>
//                           <CartesianGrid strokeDasharray="3 3" />
//                           <XAxis dataKey="year" />
//                           <YAxis />
//                           <Tooltip />
//                           <Legend />
//                           <Line
//                             type="monotone"
//                             dataKey="value"
//                             stroke={colorClasses[domainColors[selectedDomain.id as keyof typeof domainColors] as keyof typeof colorClasses].bg500}
//                             name="Value"
//                             strokeWidth={2}
//                           />
//                         </RechartsLineChart>
//                       </ResponsiveContainer>
//                     </div>
//                   </div>

//                   {/* Pie Chart */}
//                   {storyData.length > 1 && (
//                     <div>
//                       <h3 className="font-medium mb-4 flex items-center gap-2">
//                         <PieChart className="h-4 w-4" />
//                         Distribution
//                       </h3>
//                       <div className="h-64">
//                         <ResponsiveContainer width="100%" height="100%">
//                           <RechartsPieChart>
//                             <Pie
//                               data={storyData}
//                               cx="50%"
//                               cy="50%"
//                               labelLine={false}
//                               outerRadius={80}
//                               fill="#8884d8"
//                               dataKey="value"
//                               nameKey="name"
//                               label={({ name, percent }) =>
//                                 `${name}: ${(percent * 100).toFixed(0)}%`
//                               }
//                             >
//                               {storyData.map((entry, index) => (
//                                 <Cell
//                                   key={`cell-${index}`}
//                                   fill={COLORS[index % COLORS.length]}
//                                 />
//                               ))}
//                             </Pie>
//                             <Tooltip />
//                           </RechartsPieChart>
//                         </ResponsiveContainer>
//                       </div>
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>
//             )}

//             {/* Story Sections */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <TrendingUp className="h-5 w-5" />
//                   Story Breakdown
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-6">
//                 {selectedStory.sections.map((section, index) => (
//                   <motion.div
//                     key={index}
//                     initial={{ opacity: 0, y: 10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: index * 0.1 }}
//                   >
//                     <div
//                       className={`border-l-4 pl-4 py-2 ${colorClasses[domainColors[selectedDomain.id as keyof typeof domainColors] as keyof typeof colorClasses].border500}`}
//                     >
//                       <h3 className="font-bold text-lg mb-2">
//                         {section.heading}
//                       </h3>
//                       <p className="text-gray-700">
//                         {section.content.split("\n")[0]}
//                       </p>
//                       {/* Mini visualization for section if it contains data */}
//                       {section.content.match(/(\d+\.?\d*)%/) && (
//                         <div className="mt-2">
//                           <div className="text-sm text-gray-500 mb-1">
//                             Data in this section:
//                           </div>
//                           <div className="w-full bg-gray-200 rounded-full h-2">
//                             <div
//                               className={`${colorClasses[domainColors[selectedDomain.id as keyof typeof domainColors] as keyof typeof colorClasses].bg500} h-2 rounded-full`}
//                               style={{
//                                 width: `${Math.min(
//                                   100,
//                                   parseFloat(section.content.match(/(\d+\.?\d*)%/)?.[1] || 0
//                                 )}%`,
//                               }}
//                             ></div>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   </motion.div>
//                 ))}
//               </CardContent>
//             </Card>

//             {/* Navigation */}
//             <div className="flex justify-between">
//               <Button
//                 variant="outline"
//                 onClick={() => {
//                   const currentIndex = selectedDomain.stories.findIndex(
//                     (s) => s.id === selectedStory.id
//                   );
//                   if (currentIndex > 0) {
//                     setSelectedStory(selectedDomain.stories[currentIndex - 1]);
//                   }
//                 }}
//                 disabled={
//                   selectedDomain.stories.findIndex(
//                     (s) => s.id === selectedStory.id
//                   ) === 0
//                 }
//               >
//                 <ChevronLeft className="h-4 w-4 mr-1" />
//                 Previous Story
//               </Button>
//               <Button
//                 variant="outline"
//                 onClick={() => {
//                   const currentIndex = selectedDomain.stories.findIndex(
//                     (s) => s.id === selectedStory.id
//                   );
//                   if (currentIndex < selectedDomain.stories.length - 1) {
//                     setSelectedStory(selectedDomain.stories[currentIndex + 1]);
//                   }
//                 }}
//                 disabled={
//                   selectedDomain.stories.findIndex(
//                     (s) => s.id === selectedStory.id
//                   ) === selectedDomain.stories.length - 1
//                 }
//               >
//                 Next Story
//                 <ChevronRight className="h-4 w-4 ml-1" />
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
