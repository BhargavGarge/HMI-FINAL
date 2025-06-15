// This is the existing file, ensure it matches the one you have.
// If it was provided in a previous message and is correct, no changes needed here.
// Using the version from attachment: fantastic-data-visualization-MbwHuV6OpDex1PDbpTrID4lLI8BasG.tsx
"use client";

import { useMemo, useState, useEffect } from "react"; // Added useEffect
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  TrendingUp,
  Info,
  Target,
  Zap,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Sparkles,
  Layers,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  ReferenceLine,
} from "recharts";
import type { Story, StoryData } from "@/types/story"; // Assuming StoryData is also in types/story.ts

// Enhanced color palette for different domains
const DOMAIN_COLORS: Record<
  string,
  { primary: string; secondary: string; accent: string; gradient: string[] }
> = {
  macroeconomics: {
    primary: "#3B82F6", // blue-500
    secondary: "#1E40AF", // blue-800
    accent: "#60A5FA", // blue-400
    gradient: ["#3B82F6", "#2563EB", "#1D4ED8", "#1E40AF"],
  },
  Energy: {
    // Ensure exact match with domainId in domains.ts
    primary: "#A855F7", // purple-500 (example, as indigo was used in domain.ts but not fully defined here)
    secondary: "#7E22CE", // purple-700
    accent: "#C084FC", // purple-400
    gradient: ["#A855F7", "#9333EA", "#7E22CE", "#6B21A8"],
  },
  "gender-equality": {
    primary: "#EC4899", // pink-500 (example, as purple was used in domain.ts)
    secondary: "#BE185D", // pink-700
    accent: "#F472B6", // pink-400
    gradient: ["#EC4899", "#DB2777", "#BE185D", "#9D174D"],
  },
  default: {
    // Fallback colors
    primary: "#6B7280", // gray-500
    secondary: "#374151", // gray-700
    accent: "#9CA3AF", // gray-400
    gradient: ["#6B7280", "#4B5563", "#374151", "#1F2937"],
  },
};

interface DataVisualization {
  id: string;
  title: string;
  description: string;
  chartType: "line" | "bar" | "area" | "pie" | "composed" | "scatter";
  data: any[];
  insights: string[];
  category: string;
  priority: number;
  domainId: string; // Keep domainId for context
  dataKeys?: string[]; // Optional: specify keys to use for generic charts
}

// Transform domain data into visualizations
const createVisualizationsFromDomainData = (
  domainData: StoryData | undefined, // Changed from story: Story
  domainId: string
): DataVisualization[] => {
  if (!domainData) {
    console.log("No domainData provided for domain:", domainId);
    return [];
  }

  const visualizations: DataVisualization[] = [];
  console.log(
    "Creating visualizations for domain:",
    domainId,
    "with data:",
    domainData
  );

  // Macroeconomics visualizations
  if (
    domainId === "macroeconomics" &&
    domainData.growth &&
    domainData.inflation &&
    domainData.consumer_sentiment &&
    domainData.investment
  ) {
    if (domainData.growth?.Years) {
      const growthData = domainData.growth.Years.map(
        (year: number, index: number) => ({
          year: year.toString(),
          Germany: domainData.growth.Germany[index] || 0,
          France: domainData.growth.France[index] || 0,
          Eurozone: domainData.growth.Eurozone[index] || 0,
        })
      );
      visualizations.push({
        id: "gdp-growth-comparison",
        title: "GDP Growth Comparison",
        description:
          "Germany vs European peers - economic performance divergence",
        chartType: "line",
        data: growthData,
        insights: [
          "Germany's growth significantly lags behind France and Eurozone average.",
          "2023-2024 shows structural weakness in German economy.",
          "Recovery trajectory appears weaker than European peers.",
        ],
        category: "Economic Performance",
        priority: 10,
        domainId,
        dataKeys: ["Germany", "France", "Eurozone"],
      });
    }

    if (domainData.inflation?.Years) {
      const inflationData = domainData.inflation.Years.map(
        (year: number, index: number) => ({
          year: year.toString(),
          "CPI Inflation": domainData.inflation.Germany_CPI[index] || 0,
          "Core Inflation": domainData.inflation.Core_Inflation[index] || 0,
          "Energy Inflation": domainData.inflation.Energy_Inflation[index] || 0,
        })
      );
      visualizations.push({
        id: "inflation-trends",
        title: "Multi-Component Inflation Analysis",
        description: "Breaking down Germany's inflation by core components",
        chartType: "composed",
        data: inflationData,
        insights: [
          "Energy inflation drove the 2022 spike to over 22%.",
          "Core inflation remains persistently elevated above 2%.",
          "Energy deflation in 2024 masks underlying price pressures.",
        ],
        category: "Price Dynamics",
        priority: 9,
        domainId,
        dataKeys: ["CPI Inflation", "Core Inflation", "Energy Inflation"],
      });
    }

    if (domainData.consumer_sentiment?.Month) {
      const sentimentData = domainData.consumer_sentiment.Month.map(
        (month: string, index: number) => ({
          month: month.slice(-2) + "/" + month.slice(2, 4), // Format as MM/YY
          "GfK Index": domainData.consumer_sentiment.GfK_Index[index] || 0,
          "Retail Spending":
            domainData.consumer_sentiment.Retail_Spending_Index[index] || 0,
        })
      );
      visualizations.push({
        id: "consumer-sentiment",
        title: "Consumer Confidence Crisis",
        description: "Tracking household sentiment and spending behavior",
        chartType: "area",
        data: sentimentData,
        insights: [
          "Consumer sentiment hit worst levels in two decades.",
          "Retail spending index shows persistent weakness.",
          "Psychological scars from inflation crisis remain deep.",
        ],
        category: "Consumer Behavior",
        priority: 8,
        domainId,
        dataKeys: ["GfK Index", "Retail Spending"],
      });
    }

    if (domainData.investment?.Year) {
      const investmentData = domainData.investment.Year.map(
        (year: number, index: number) => ({
          year: year.toString(),
          "Private Investment YoY":
            domainData.investment.Private_Investment_YoY[index] || 0,
          benchmark: 0,
        })
      );
      visualizations.push({
        id: "investment-decline",
        title: "Private Investment Collapse",
        description: "Business confidence and capital formation trends",
        chartType: "bar",
        data: investmentData,
        insights: [
          "Private investment turned negative in 2023-2024.",
          "Business confidence severely impacted by uncertainty.",
          "Capital formation weakness threatens long-term growth.",
        ],
        category: "Investment Climate",
        priority: 7,
        domainId,
        dataKeys: ["Private Investment YoY"],
      });
    }
  }

  // Energy domain visualizations
  if (
    domainId === "Energy" &&
    domainData.renewables_expansion &&
    domainData.energy_mix
  ) {
    if (domainData.renewables_expansion?.Year) {
      const renewablesData = domainData.renewables_expansion.Year.map(
        (year: number, index: number) => ({
          year: year.toString(),
          "Target TWh": domainData.renewables_expansion.Target_TWh[index] || 0,
          progress:
            ((domainData.renewables_expansion.Target_TWh[index] - 260) /
              (600 - 260)) *
            100,
        })
      );
      visualizations.push({
        id: "renewables-expansion",
        title: "Germany's Renewable Energy Trajectory",
        description:
          "Path to 80% renewables by 2030 - ambitious but achievable",
        chartType: "area",
        data: renewablesData,
        insights: [
          "Germany needs to more than double renewable output by 2030.",
          "Current trajectory shows accelerating deployment.",
          "600 TWh target represents fundamental energy system transformation.",
        ],
        category: "Energy Transition",
        priority: 10,
        domainId,
        dataKeys: ["Target TWh"],
      });
    }

    if (domainData.energy_mix?.Source) {
      const energyMixData = domainData.energy_mix.Source.map(
        (source: string, index: number) => ({
          name: source,
          value: domainData.energy_mix.Percent_Share[index] || 0,
        })
      );
      visualizations.push({
        id: "energy-mix-2030",
        title: "2030 Energy Mix Vision",
        description: "Renewable energy composition for climate targets",
        chartType: "pie",
        data: energyMixData,
        insights: [
          "Solar and wind will dominate with 77% combined share.",
          "Offshore wind expansion critical for energy security.",
          "Diversified renewable portfolio reduces weather dependency.",
        ],
        category: "Energy Portfolio",
        priority: 9,
        domainId,
      });
    }
  }

  // Gender Equality domain visualizations
  if (
    domainId === "gender-equality" &&
    domainData.gender_care_gap &&
    domainData.household_types
  ) {
    if (domainData.gender_care_gap?.Year) {
      const careGapData = domainData.gender_care_gap.Year.map(
        (year: number, index: number) => ({
          year: year.toString(),
          "Women Hours":
            domainData.gender_care_gap.Women_Unpaid_Hours[index] || 0,
          "Men Hours": domainData.gender_care_gap.Men_Unpaid_Hours[index] || 0,
          "Gap %": domainData.gender_care_gap.Gap_Percent[index] || 0,
        })
      );
      visualizations.push({
        id: "gender-care-gap",
        title: "The Persistent Care Gap",
        description: "Unpaid care work inequality between genders over time",
        chartType: "composed",
        data: careGapData,
        insights: [
          "Pandemic significantly widened the gender care gap.",
          "Women provide 2.4x more unpaid care work than men.",
          "Gap remains stubbornly high despite policy interventions.",
        ],
        category: "Care Inequality",
        priority: 10,
        domainId,
        dataKeys: ["Women Hours", "Men Hours"],
      });
    }

    if (domainData.household_types?.Type) {
      const householdData = domainData.household_types.Type.map(
        (type: string, index: number) => ({
          name: type, // For tooltip label
          "Share 2023": domainData.household_types.Share_2023[index] || 0, // X-axis
          "Extra Burden":
            domainData.household_types.Extra_Burden_Percent[index] || 0, // Y-axis
        })
      );
      visualizations.push({
        id: "household-burden",
        title: "Household Care Burden Distribution",
        description:
          "How different family structures experience care inequality",
        chartType: "scatter",
        data: householdData,
        insights: [
          "Single mothers face 33% extra care burden.",
          "Traditional households show lower reported burden but hidden inequality.",
          "Dual-earner families struggle with work-care balance.",
        ],
        category: "Family Structures",
        priority: 8,
        domainId,
        // For scatter, XAxis dataKey is "Share 2023", YAxis dataKey is "Extra Burden"
      });
    }
  }

  console.log(
    "Total visualizations created for domain",
    domainId,
    ":",
    visualizations.length
  );
  return visualizations.sort((a, b) => b.priority - a.priority);
};

const renderFantasticChart = (viz: DataVisualization) => {
  const domainColors = DOMAIN_COLORS[viz.domainId] || DOMAIN_COLORS.default;
  const primaryColor = domainColors.primary;
  const secondaryColor = domainColors.secondary;
  const accentColor = domainColors.accent;
  const gradientColors = domainColors.gradient;

  if (!viz.data || viz.data.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">
            No data available for this chart
          </p>
          <p className="text-sm">Please check the data source.</p>
        </div>
      </div>
    );
  }

  const commonTooltipProps = {
    contentStyle: {
      backgroundColor: "white",
      border: `1px solid ${primaryColor}`,
      borderRadius: "8px",
      boxShadow: "0 4px 12px -1px rgba(0, 0, 0, 0.1)",
      padding: "8px 12px",
    },
    labelStyle: {
      fontWeight: "bold",
      color: primaryColor,
      marginBottom: "4px",
    },
    itemStyle: { fontSize: "12px" },
  };

  const xAxisKey = viz.data[0]?.year
    ? "year"
    : viz.data[0]?.month
    ? "month"
    : "name";

  switch (viz.chartType) {
    case "line":
      return (
        <ResponsiveContainer width="100%" height={320}>
          <LineChart
            data={viz.data}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey={xAxisKey}
              stroke="#6B7280"
              fontSize={11}
              tickLine={false}
            />
            <YAxis
              stroke="#6B7280"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip {...commonTooltipProps} />
            {viz.dataKeys?.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={gradientColors[index % gradientColors.length]}
                strokeWidth={index === 0 ? 3 : 2}
                dot={{ r: index === 0 ? 4 : 3, strokeWidth: 1 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      );
    case "area":
      const areaDataKey =
        viz.dataKeys?.[0] ||
        Object.keys(viz.data[0] || {}).find(
          (k) => typeof viz.data[0][k] === "number" && k !== xAxisKey
        );
      return (
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart
            data={viz.data}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
          >
            <defs>
              <linearGradient
                id={`gradient-${viz.id}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor={primaryColor} stopOpacity={0.7} />
                <stop offset="95%" stopColor={primaryColor} stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey={xAxisKey}
              stroke="#6B7280"
              fontSize={11}
              tickLine={false}
            />
            <YAxis
              stroke="#6B7280"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip {...commonTooltipProps} />
            {areaDataKey && (
              <Area
                type="monotone"
                dataKey={areaDataKey}
                stroke={primaryColor}
                fill={`url(#gradient-${viz.id})`}
                strokeWidth={2}
              />
            )}
            {viz.dataKeys?.[1] && (
              <Area
                type="monotone"
                dataKey={viz.dataKeys[1]}
                stroke={secondaryColor}
                fillOpacity={0.2}
                fill={secondaryColor}
                strokeWidth={2}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      );
    case "bar":
      const barDataKey =
        viz.dataKeys?.[0] ||
        Object.keys(viz.data[0] || {}).find(
          (k) =>
            typeof viz.data[0][k] === "number" &&
            k !== xAxisKey &&
            k !== "benchmark"
        );
      return (
        <ResponsiveContainer width="100%" height={320}>
          <BarChart
            data={viz.data}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey={xAxisKey}
              stroke="#6B7280"
              fontSize={11}
              tickLine={false}
            />
            <YAxis
              stroke="#6B7280"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip {...commonTooltipProps} />
            {viz.data.some((d) => d.benchmark !== undefined) && (
              <ReferenceLine y={0} stroke="#6B7280" strokeDasharray="2 2" />
            )}
            {barDataKey && (
              <Bar
                dataKey={barDataKey}
                fill={primaryColor}
                radius={[3, 3, 0, 0]}
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      );
    case "pie":
      return (
        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie
              data={viz.data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
              outerRadius={100}
              dataKey="value"
              stroke="#fff"
              strokeWidth={2}
            >
              {viz.data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={gradientColors[index % gradientColors.length]}
                />
              ))}
            </Pie>
            <Tooltip {...commonTooltipProps} />
          </PieChart>
        </ResponsiveContainer>
      );
    case "composed":
      return (
        <ResponsiveContainer width="100%" height={320}>
          <ComposedChart
            data={viz.data}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey={xAxisKey}
              stroke="#6B7280"
              fontSize={11}
              tickLine={false}
            />
            <YAxis
              stroke="#6B7280"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip {...commonTooltipProps} />
            {viz.dataKeys?.includes("CPI Inflation") && (
              <Bar
                dataKey="CPI Inflation"
                fill={primaryColor}
                radius={[2, 2, 0, 0]}
                barSize={20}
              />
            )}
            {viz.dataKeys?.includes("Core Inflation") && (
              <Line
                type="monotone"
                dataKey="Core Inflation"
                stroke={secondaryColor}
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            )}
            {viz.dataKeys?.includes("Energy Inflation") && (
              <Line
                type="monotone"
                dataKey="Energy Inflation"
                stroke={accentColor}
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            )}

            {viz.dataKeys?.includes("Women Hours") && (
              <Area
                type="monotone"
                dataKey="Women Hours"
                fill={primaryColor}
                fillOpacity={0.3}
                stroke={primaryColor}
                strokeWidth={2}
              />
            )}
            {viz.dataKeys?.includes("Men Hours") && (
              <Line
                type="monotone"
                dataKey="Men Hours"
                stroke={secondaryColor}
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      );
    case "scatter":
      return (
        <ResponsiveContainer width="100%" height={320}>
          <ScatterChart
            data={viz.data}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              type="number"
              dataKey="Share 2023"
              name="Household Share (%)"
              stroke="#6B7280"
              fontSize={11}
              tickLine={false}
            />
            <YAxis
              type="number"
              dataKey="Extra Burden"
              name="Extra Care Burden (%)"
              stroke="#6B7280"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              cursor={{ strokeDasharray: "3 3" }}
              {...commonTooltipProps}
              formatter={(value: any, name: string, props: any) => [
                `${props.payload.name}: ${value}%`,
                name === "Share 2023" ? "Household Share" : "Extra Care Burden",
              ]}
            />
            <Scatter
              name="Household Types"
              dataKey="Extra Burden"
              fill={primaryColor}
            />
          </ScatterChart>
        </ResponsiveContainer>
      );
    default:
      return <p>Unsupported chart type: {viz.chartType}</p>;
  }
};

const getTrendIndicator = (insights: string[]) => {
  const text = insights.join(" ").toLowerCase();
  if (
    text.includes("decline") ||
    text.includes("negative") ||
    text.includes("crisis") ||
    text.includes("collapse") ||
    text.includes("lags") ||
    text.includes("weakness")
  ) {
    return { icon: ArrowDownRight, color: "text-red-500", bg: "bg-red-50" };
  }
  if (
    text.includes("growth") ||
    text.includes("expansion") ||
    text.includes("increase") ||
    text.includes("rising") ||
    text.includes("accelerating") ||
    text.includes("boom")
  ) {
    return { icon: ArrowUpRight, color: "text-green-500", bg: "bg-green-50" };
  }
  return { icon: Minus, color: "text-yellow-500", bg: "bg-yellow-50" };
};

const getDomainIcon = (domainId: string) => {
  switch (domainId) {
    case "macroeconomics":
      return TrendingUp;
    case "Energy":
      return Zap;
    case "gender-equality":
      return Users;
    default:
      return Layers;
  }
};

interface FantasticDataVisualizationProps {
  story: Story;
  sectionIndex: number;
  domain?: string;
  domainData?: StoryData;
  className?: string;
}

export function FantasticDataVisualization({
  story,
  sectionIndex,
  domain: domainId = "default", // Use 'default' if domainId is undefined
  domainData,
  className = "",
}: FantasticDataVisualizationProps) {
  const allVisualizationsForDomain = useMemo(() => {
    console.log(
      "Memo: Creating visualizations for domainId:",
      domainId,
      "with domainData:",
      domainData
    );
    return createVisualizationsFromDomainData(domainData, domainId);
  }, [domainData, domainId]);

  const [selectedVizId, setSelectedVizId] = useState<string>("");
  const [showInsights, setShowInsights] = useState(true);

  useEffect(() => {
    // Reset selectedVizId if the available visualizations change and the current one is no longer valid
    if (
      allVisualizationsForDomain.length > 0 &&
      !allVisualizationsForDomain.find((v) => v.id === selectedVizId)
    ) {
      setSelectedVizId(allVisualizationsForDomain[0].id);
    } else if (allVisualizationsForDomain.length === 0) {
      setSelectedVizId("");
    }
  }, [allVisualizationsForDomain, selectedVizId]);

  const relevantVisualizations = useMemo(() => {
    if (allVisualizationsForDomain.length === 0) return [];
    if (!story.sections[sectionIndex])
      return allVisualizationsForDomain.slice(0, 3);

    const section = story.sections[sectionIndex];
    const sectionText = (section.heading + " " + section.content).toLowerCase();

    const scoredVisualizations = allVisualizationsForDomain.map((viz) => {
      let score = viz.priority * 0.1; // Base score from priority
      const titleWords = viz.title.toLowerCase().split(/\s+/);
      const categoryWords = viz.category.toLowerCase().split(/\s+/);
      const descriptionWords = viz.description.toLowerCase().split(/\s+/);
      [...titleWords, ...categoryWords, ...descriptionWords].forEach((word) => {
        if (word.length > 3 && sectionText.includes(word)) {
          score += 1;
        }
      });
      viz.insights.forEach((insight) => {
        if (sectionText.includes(insight.toLowerCase().substring(0, 30)))
          score += 0.5; // Partial match for insights
      });
      return { ...viz, score };
    });

    scoredVisualizations.sort((a, b) => b.score - a.score);

    return scoredVisualizations.slice(0, 3);
  }, [allVisualizationsForDomain, sectionIndex, story.sections]);

  useEffect(() => {
    if (
      relevantVisualizations.length > 0 &&
      !relevantVisualizations.find((v) => v.id === selectedVizId)
    ) {
      setSelectedVizId(relevantVisualizations[0].id);
    } else if (
      relevantVisualizations.length === 0 &&
      allVisualizationsForDomain.length > 0
    ) {
      setSelectedVizId(allVisualizationsForDomain[0].id); // Fallback to first overall if no relevant
    }
  }, [relevantVisualizations, selectedVizId, allVisualizationsForDomain]);

  const currentViz =
    allVisualizationsForDomain.find((v) => v.id === selectedVizId) ||
    relevantVisualizations[0] ||
    allVisualizationsForDomain[0];

  if (!domainData || allVisualizationsForDomain.length === 0) {
    return (
      <Alert
        className={`${className} bg-yellow-50 border-yellow-300 text-yellow-700`}
      >
        <Info className="h-4 w-4" />
        <AlertDescription>
          <p className="font-semibold">No Visualizations Available</p>
          <p className="text-sm">
            There is no data processed for visualizations in the '{domainId}'
            domain.
          </p>
          <div className="text-xs mt-2">
            <strong>Data provided:</strong>{" "}
            {domainData
              ? `Keys: ${Object.keys(domainData).join(", ")}`
              : "None"}
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  if (!currentViz) {
    return (
      <Alert className={`${className} bg-red-50 border-red-300 text-red-700`}>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <p className="font-semibold">Visualization Error</p>
          <p className="text-sm">
            Could not load the selected visualization. Please try another.
          </p>
          <div className="text-xs mt-2">
            <strong>Available:</strong> {allVisualizationsForDomain.length},{" "}
            <strong>Selected ID:</strong> {selectedVizId}
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  const DomainIcon = getDomainIcon(domainId);
  const trend = getTrendIndicator(currentViz.insights);
  const TrendIcon = trend.icon;
  const vizDomainColors =
    DOMAIN_COLORS[currentViz.domainId] || DOMAIN_COLORS.default;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      <Card className="bg-white border-gray-200 shadow-lg overflow-hidden rounded-xl">
        <CardHeader
          className={`bg-gradient-to-r from-${vizDomainColors.primary}/10 via-white to-${vizDomainColors.accent}/10 border-b border-gray-200 p-6`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className={`p-3 bg-gradient-to-br from-${vizDomainColors.primary} to-${vizDomainColors.accent} rounded-lg shadow-md`}
              >
                <DomainIcon className="h-7 w-7 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  {currentViz.title}
                  <div className={`p-1.5 rounded-md ${trend.bg}`}>
                    <TrendIcon className={`h-4 w-4 ${trend.color}`} />
                  </div>
                </CardTitle>
                <p className="text-gray-500 text-sm mt-0.5">
                  {currentViz.description}
                </p>
                <div className="mt-2.5 flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={`bg-${vizDomainColors.primary}/10 text-${vizDomainColors.primary} border-${vizDomainColors.primary}/30 text-xs px-2.5 py-0.5`}
                  >
                    <Sparkles className="h-3 w-3 mr-1.5" />
                    {currentViz.category}
                  </Badge>
                  <Badge variant="outline" className="text-xs px-2.5 py-0.5">
                    {currentViz.chartType.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowInsights(!showInsights)}
              className="text-gray-600 hover:bg-gray-100"
            >
              <Info className="h-4 w-4 mr-1.5" />
              {showInsights ? "Hide" : "Show"} Insights
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {relevantVisualizations.length > 1 && (
            <Tabs
              value={selectedVizId}
              onValueChange={setSelectedVizId}
              className="mb-6"
            >
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 h-auto sm:h-10 bg-gray-100 p-1 rounded-lg">
                {relevantVisualizations.map((viz) => (
                  <TabsTrigger
                    key={viz.id}
                    value={viz.id}
                    className={`text-xs sm:text-sm font-medium data-[state=active]:bg-${vizDomainColors.primary} data-[state=active]:text-white data-[state=active]:shadow-md rounded-md px-3 py-1.5 sm:py-2 transition-all`}
                  >
                    {viz.category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          )}

          <AnimatePresence>
            {showInsights && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: "auto", marginBottom: "24px" }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.3 }}
                className={`p-5 bg-gradient-to-r from-${vizDomainColors.primary}/5 to-${vizDomainColors.accent}/5 rounded-lg border-l-4 border-${vizDomainColors.primary} shadow-sm`}
              >
                <h4
                  className={`font-semibold text-${vizDomainColors.primary} mb-3 flex items-center gap-2 text-md`}
                >
                  <Target className="h-4 w-4" />
                  Key Insights & Analysis
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {currentViz.insights.map((insight, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.2 }}
                      className="flex items-start gap-2.5 p-3 bg-white rounded-md shadow-xs border border-gray-200"
                    >
                      <div
                        className={`w-2 h-2 bg-${vizDomainColors.primary} rounded-full mt-1.5 flex-shrink-0`}
                      />
                      <span className="text-gray-700 text-xs font-medium leading-snug">
                        {insight}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            key={currentViz.id} // Ensure chart re-renders on viz change
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-lg p-1 sm:p-2 shadow-inner border border-gray-100 min-h-[320px]"
          >
            {renderFantasticChart(currentViz)}
          </motion.div>

          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-xs">
            {[
              {
                label: "Data Points",
                value: currentViz.data?.length || 0,
                color: vizDomainColors.primary,
              },
              {
                label: "Category",
                value: currentViz.category,
                color: vizDomainColors.secondary,
              },
              {
                label: "Chart Type",
                value: currentViz.chartType.toUpperCase(),
                color: vizDomainColors.accent,
              },
              {
                label: "Priority",
                value: `#${currentViz.priority}`,
                color: DOMAIN_COLORS.default.primary,
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className={`bg-gradient-to-br from-${stat.color}/10 to-white rounded-lg p-3 text-center shadow-xs border border-${stat.color}/20`}
              >
                <div
                  className={`text-xl font-semibold`}
                  style={{ color: stat.color }}
                >
                  {stat.value}
                </div>
                <div className={`text-gray-500 font-medium mt-0.5`}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
