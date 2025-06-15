"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";

interface VisualizationData {
  title: string;
  description: string;
  type: "line" | "bar" | "area" | "pie";
  data: any[];
  config: any;
  insight?: string;
  trend?: "up" | "down" | "stable";
}

interface FantasticDataVisualizationProps {
  domainId: string;
  storyId: string;
  sectionIndex: number;
}

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
];

function createVisualizationsFromSectionData(
  domainId: string,
  storyId: string,
  sectionIndex: number
): VisualizationData[] {
  // Import domains data
  const { domains } = require("@/data/domains");

  const domain = domains.find((d: any) => d.id === domainId);
  if (!domain) return [];

  const story = domain.stories.find((s: any) => s.id === storyId);
  if (!story || !story.data) return [];

  const sectionKey = `section_${sectionIndex}`;
  const sectionData = story.data[sectionKey];

  if (!sectionData) return [];

  const visualizations: VisualizationData[] = [];

  // Generate visualizations based on section data
  Object.entries(sectionData).forEach(([key, data]: [string, any]) => {
    if (typeof data === "object" && data !== null) {
      // Determine chart type based on data structure and content
      let chartType: "line" | "bar" | "area" | "pie" = "bar";
      let chartData: any[] = [];
      let config: any = {};

      // Check if data has time-series indicators
      const hasTimeData = Object.keys(data).some(
        (k) =>
          k.toLowerCase().includes("year") ||
          k.toLowerCase().includes("date") ||
          k.toLowerCase().includes("period") ||
          k.toLowerCase().includes("quarter")
      );

      // Check if data has percentage or share indicators
      const hasPercentageData = Object.keys(data).some(
        (k) =>
          k.toLowerCase().includes("percent") ||
          k.toLowerCase().includes("share") ||
          k.toLowerCase().includes("rate")
      );

      if (hasTimeData) {
        chartType =
          key.toLowerCase().includes("growth") ||
          key.toLowerCase().includes("trend")
            ? "line"
            : "area";

        // Find the time dimension
        const timeKey = Object.keys(data).find(
          (k) =>
            k.toLowerCase().includes("year") ||
            k.toLowerCase().includes("date") ||
            k.toLowerCase().includes("period") ||
            k.toLowerCase().includes("quarter")
        );

        if (timeKey) {
          const timeValues = data[timeKey];
          const otherKeys = Object.keys(data).filter((k) => k !== timeKey);

          chartData = timeValues.map((time: any, index: number) => {
            const point: any = { [timeKey]: time };
            otherKeys.forEach((k) => {
              if (Array.isArray(data[k]) && data[k][index] !== undefined) {
                point[k] = data[k][index];
              }
            });
            return point;
          });

          config = otherKeys.reduce((acc, k, idx) => {
            acc[k] = {
              label: k
                .replace(/_/g, " ")
                .replace(/\b\w/g, (l: string) => l.toUpperCase()),
              color: `hsl(var(--chart-${(idx % 5) + 1}))`,
            };
            return acc;
          }, {} as any);
        }
      } else if (hasPercentageData && Object.keys(data).length <= 4) {
        chartType = "pie";

        // Find category and value keys
        const categoryKey = Object.keys(data).find(
          (k) =>
            !k.toLowerCase().includes("percent") &&
            !k.toLowerCase().includes("share") &&
            !k.toLowerCase().includes("value")
        );
        const valueKey = Object.keys(data).find(
          (k) =>
            k.toLowerCase().includes("percent") ||
            k.toLowerCase().includes("share") ||
            k.toLowerCase().includes("value")
        );

        if (
          categoryKey &&
          valueKey &&
          Array.isArray(data[categoryKey]) &&
          Array.isArray(data[valueKey])
        ) {
          chartData = data[categoryKey].map((cat: any, index: number) => ({
            name: cat,
            value: data[valueKey][index] || 0,
          }));
        }
      } else {
        // Default to bar chart
        chartType = "bar";

        // Find the category dimension (usually first non-numeric array)
        const categoryKey = Object.keys(data).find((k) => {
          const values = data[k];
          return (
            Array.isArray(values) &&
            values.some((v: any) => typeof v === "string")
          );
        });

        if (categoryKey) {
          const categories = data[categoryKey];
          const otherKeys = Object.keys(data).filter((k) => k !== categoryKey);

          chartData = categories.map((cat: any, index: number) => {
            const point: any = { [categoryKey]: cat };
            otherKeys.forEach((k) => {
              if (Array.isArray(data[k]) && data[k][index] !== undefined) {
                point[k] = data[k][index];
              }
            });
            return point;
          });

          config = otherKeys.reduce((acc, k, idx) => {
            acc[k] = {
              label: k
                .replace(/_/g, " ")
                .replace(/\b\w/g, (l: string) => l.toUpperCase()),
              color: `hsl(var(--chart-${(idx % 5) + 1}))`,
            };
            return acc;
          }, {} as any);
        }
      }

      if (chartData.length > 0) {
        // Generate insights based on data patterns
        let insight = "";
        let trend: "up" | "down" | "stable" = "stable";

        if (chartType === "line" || chartType === "area") {
          const numericKeys = Object.keys(config);
          if (numericKeys.length > 0) {
            const firstKey = numericKeys[0];
            const values = chartData
              .map((d) => d[firstKey])
              .filter((v) => typeof v === "number");
            if (values.length >= 2) {
              const firstVal = values[0];
              const lastVal = values[values.length - 1];
              if (lastVal > firstVal * 1.1) {
                trend = "up";
                insight = `${
                  config[firstKey].label
                } shows an upward trend with ${(
                  ((lastVal - firstVal) / firstVal) *
                  100
                ).toFixed(1)}% growth.`;
              } else if (lastVal < firstVal * 0.9) {
                trend = "down";
                insight = `${
                  config[firstKey].label
                } shows a declining trend with ${(
                  ((firstVal - lastVal) / firstVal) *
                  100
                ).toFixed(1)}% decrease.`;
              } else {
                insight = `${config[firstKey].label} remains relatively stable over the period.`;
              }
            }
          }
        }

        visualizations.push({
          title: key
            .replace(/_/g, " ")
            .replace(/\b\w/g, (l: string) => l.toUpperCase()),
          description: `Analysis of ${key.replace(
            /_/g,
            " "
          )} data for this section`,
          type: chartType,
          data: chartData,
          config,
          insight,
          trend,
        });
      }
    }
  });

  return visualizations;
}

export default function FantasticDataVisualization({
  domainId,
  storyId,
  sectionIndex,
}: FantasticDataVisualizationProps) {
  const visualizations = createVisualizationsFromSectionData(
    domainId,
    storyId,
    sectionIndex
  );

  if (visualizations.length === 0) {
    return (
      <div className="w-full p-6 text-center text-muted-foreground">
        <Activity className="mx-auto h-12 w-12 mb-4 opacity-50" />
        <p>No visualization data available for this section.</p>
      </div>
    );
  }

  const renderChart = (viz: VisualizationData) => {
    const chartHeight = 300;

    switch (viz.type) {
      case "line":
        return (
          <ChartContainer
            config={viz.config}
            className={`h-[${chartHeight}px]`}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={viz.data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={Object.keys(viz.data[0] || {})[0]} />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                {Object.keys(viz.config).map((key) => (
                  <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={viz.config[key].color}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        );

      case "area":
        return (
          <ChartContainer
            config={viz.config}
            className={`h-[${chartHeight}px]`}
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={viz.data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={Object.keys(viz.data[0] || {})[0]} />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                {Object.keys(viz.config).map((key) => (
                  <Area
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stackId="1"
                    stroke={viz.config[key].color}
                    fill={viz.config[key].color}
                    fillOpacity={0.6}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        );

      case "pie":
        return (
          <ChartContainer
            config={viz.config}
            className={`h-[${chartHeight}px]`}
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={viz.data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {viz.data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        );

      default: // bar
        return (
          <ChartContainer
            config={viz.config}
            className={`h-[${chartHeight}px]`}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={viz.data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={Object.keys(viz.data[0] || {})[0]} />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                {Object.keys(viz.config).map((key) => (
                  <Bar
                    key={key}
                    dataKey={key}
                    fill={viz.config[key].color}
                    radius={[2, 2, 0, 0]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        );
    }
  };

  const getTrendIcon = (trend?: "up" | "down" | "stable") => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Activity className="h-4 w-4 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {visualizations.map((viz, index) => (
        <Card key={index} className="w-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  {getTrendIcon(viz.trend)}
                  {viz.title}
                </CardTitle>
                <CardDescription>{viz.description}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {renderChart(viz)}
            {viz.insight && (
              <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Key Insight:</strong> {viz.insight}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
