"use client";

import { useMemo } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Observation {
  id: string;
  visual_entity_id: string;
  indicator_id: number;
  country: string;
  year: number;
  value: number;
  notes: string;
  indicator_name?: string;
  unit?: string;
}

interface Indicator {
  id: number;
  name: string;
  unit: string;
  category: string;
  tags: string;
}

interface EnhancedDataVisualizerProps {
  observations: Observation[];
  indicators: Indicator[];
  chartType: "line" | "bar" | "pie" | "scatter";
  viewMode: "single" | "compare" | "correlation";
}

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7300",
  "#00ff00",
  "#ff00ff",
  "#00ffff",
  "#ff0000",
  "#0000ff",
  "#ffff00",
];

export function EnhancedDataVisualizer({
  observations,
  indicators,
  chartType,
  viewMode,
}: EnhancedDataVisualizerProps) {
  const chartData = useMemo(() => {
    if (!observations.length || !indicators.length) return [];

    switch (chartType) {
      case "line":
        // Group by year and indicator
        const lineData = observations.reduce((acc: any, obs) => {
          const year = obs.year;
          const indicator = indicators.find(
            (ind) => ind.id === obs.indicator_id
          );

          if (!indicator) return acc;

          const existingYear = acc.find((item: any) => item.year === year);
          if (existingYear) {
            existingYear[indicator.name] = obs.value;
          } else {
            acc.push({
              year,
              [indicator.name]: obs.value,
            });
          }
          return acc;
        }, []);

        return lineData.sort((a: any, b: any) => a.year - b.year);

      case "bar":
        // Group by country or category
        const barData = observations.reduce((acc: any, obs) => {
          const indicator = indicators.find(
            (ind) => ind.id === obs.indicator_id
          );
          if (!indicator) return acc;

          const key = obs.country || indicator.category;
          const existing = acc.find((item: any) => item.name === key);

          if (existing) {
            existing.value += obs.value;
            existing.count += 1;
          } else {
            acc.push({
              name: key,
              value: obs.value,
              count: 1,
              indicator: indicator.name,
            });
          }
          return acc;
        }, []);

        // Calculate averages
        return barData.map((item: any) => ({
          ...item,
          value: item.value / item.count,
        }));

      case "pie":
        // Group by indicator
        const pieData = indicators
          .map((indicator) => {
            const indicatorObs = observations.filter(
              (obs) => obs.indicator_id === indicator.id
            );
            const totalValue = indicatorObs.reduce(
              (sum, obs) => sum + obs.value,
              0
            );
            const avgValue =
              indicatorObs.length > 0 ? totalValue / indicatorObs.length : 0;

            return {
              name: indicator.name,
              value: Math.abs(avgValue), // Use absolute value for pie chart
              count: indicatorObs.length,
            };
          })
          .filter((item) => item.value > 0);

        return pieData;

      case "scatter":
        if (indicators.length < 2) return [];

        const [indicator1, indicator2] = indicators;
        const scatterData: any[] = [];

        // Group observations by year and country
        const grouped = observations.reduce((acc: any, obs) => {
          const key = `${obs.year}-${obs.country}`;
          if (!acc[key]) {
            acc[key] = { year: obs.year, country: obs.country };
          }

          const indicator = indicators.find(
            (ind) => ind.id === obs.indicator_id
          );
          if (indicator) {
            acc[key][indicator.name] = obs.value;
          }
          return acc;
        }, {});

        // Create scatter points where both indicators have values
        Object.values(grouped).forEach((point: any) => {
          if (
            point[indicator1.name] !== undefined &&
            point[indicator2.name] !== undefined
          ) {
            scatterData.push({
              x: point[indicator1.name],
              y: point[indicator2.name],
              year: point.year,
              country: point.country,
            });
          }
        });

        return scatterData;

      default:
        return [];
    }
  }, [observations, indicators, chartType]);

  const renderChart = () => {
    if (!chartData.length) {
      return (
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          No data available for the selected filters
        </div>
      );
    }

    switch (chartType) {
      case "line":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />
              {indicators.map((indicator, index) => (
                <Line
                  key={indicator.id}
                  type="monotone"
                  dataKey={indicator.name}
                  stroke={COLORS[index % COLORS.length]}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );

      case "bar":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill={COLORS[0]} />
            </BarChart>
          </ResponsiveContainer>
        );

      case "pie":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map(
                  (
                    entry: { name: string; value: number; count: number },
                    index: number
                  ) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  )
                )}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );

      case "scatter":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                type="number"
                dataKey="x"
                name={indicators[0]?.name}
                unit={indicators[0]?.unit}
              />
              <YAxis
                type="number"
                dataKey="y"
                name={indicators[1]?.name}
                unit={indicators[1]?.unit}
              />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-2 border rounded shadow">
                        <p>{`${indicators[0]?.name}: ${data.x}`}</p>
                        <p>{`${indicators[1]?.name}: ${data.y}`}</p>
                        <p>{`Year: ${data.year}`}</p>
                        <p>{`Country: ${data.country}`}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter dataKey="y" fill={COLORS[0]} />
            </ScatterChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  const getChartTitle = () => {
    if (indicators.length === 0) return "No Data";

    switch (chartType) {
      case "line":
        return `Trend Analysis: ${indicators
          .map((ind) => ind.name)
          .join(", ")}`;
      case "bar":
        return `Comparative Analysis: ${indicators
          .map((ind) => ind.name)
          .join(", ")}`;
      case "pie":
        return `Distribution Analysis: ${indicators
          .map((ind) => ind.name)
          .join(", ")}`;
      case "scatter":
        return `Correlation Analysis: ${indicators[0]?.name} vs ${indicators[1]?.name}`;
      default:
        return "Data Visualization";
    }
  };

  const getChartDescription = () => {
    const dataPoints = observations.length;
    const timeSpan =
      observations.length > 0
        ? `${Math.min(...observations.map((obs) => obs.year))} - ${Math.max(
            ...observations.map((obs) => obs.year)
          )}`
        : "No data";

    return `${dataPoints} data points spanning ${timeSpan}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{getChartTitle()}</CardTitle>
        <p className="text-sm text-muted-foreground">{getChartDescription()}</p>
      </CardHeader>
      <CardContent>{renderChart()}</CardContent>
    </Card>
  );
}
