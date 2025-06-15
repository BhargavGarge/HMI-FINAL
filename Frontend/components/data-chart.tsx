"use client";

import { useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
  RadialBarChart,
  RadialBar,
} from "recharts";

interface DataChartProps {
  type: "line" | "bar" | "pie" | "area" | "radial";
  data: any[];
  title?: string;
  height?: number;
}

// Enhanced color palette for stunning visuals
const COLORS = [
  "#3B82F6", // blue-500
  "#10B981", // emerald-500
  "#8B5CF6", // violet-500
  "#F59E0B", // amber-500
  "#EF4444", // red-500
  "#06B6D4", // cyan-500
  "#6366F1", // indigo-500
  "#EC4899", // pink-500
  "#84CC16", // lime-500
  "#F97316", // orange-500
  "#14B8A6", // teal-500
  "#A855F7", // purple-500
];

// Gradient definitions for enhanced visuals
const GRADIENTS = [
  { id: "gradient1", colors: ["#3B82F6", "#1D4ED8"] },
  { id: "gradient2", colors: ["#10B981", "#059669"] },
  { id: "gradient3", colors: ["#8B5CF6", "#7C3AED"] },
  { id: "gradient4", colors: ["#F59E0B", "#D97706"] },
  { id: "gradient5", colors: ["#EF4444", "#DC2626"] },
];

export function DataChart({ type, data, title, height = 400 }: DataChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Resize observer to handle responsive charts
    if (chartRef.current) {
      const resizeObserver = new ResizeObserver(() => {
        window.dispatchEvent(new Event("resize"));
      });
      resizeObserver.observe(chartRef.current);
      return () => {
        if (chartRef.current) {
          resizeObserver.unobserve(chartRef.current);
        }
      };
    }
  }, []);

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-[400px]">
          <div className="text-center">
            <div className="text-6xl mb-4">📊</div>
            <p className="text-muted-foreground">
              No data available for visualization
            </p>
            <Badge variant="outline" className="mt-2">
              Try selecting a different time range or indicator
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{`${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {`${entry.dataKey}: ${
                typeof entry.value === "number"
                  ? entry.value.toFixed(2)
                  : entry.value
              }`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Custom label for pie charts
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    if (percent < 0.05) return null; // Don't show labels for slices less than 5%

    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize="12"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const renderLineChart = () => {
    // Extract all keys except 'year' to use as lines
    const keys = Object.keys(data[0]).filter((key) => key !== "year");

    return (
      <ResponsiveContainer width="100%" height={height}>
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
        >
          <defs>
            {GRADIENTS.map((gradient, index) => (
              <linearGradient
                key={gradient.id}
                id={gradient.id}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor={gradient.colors[0]}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={gradient.colors[1]}
                  stopOpacity={0.1}
                />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
          <XAxis
            dataKey="year"
            tick={{ fill: "#6b7280", fontSize: 12 }}
            tickLine={{ stroke: "#9ca3af" }}
            axisLine={{ stroke: "#d1d5db" }}
          />
          <YAxis
            tick={{ fill: "#6b7280", fontSize: 12 }}
            tickLine={{ stroke: "#9ca3af" }}
            axisLine={{ stroke: "#d1d5db" }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ paddingTop: "20px" }} />
          {keys.map((key, index) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={COLORS[index % COLORS.length]}
              strokeWidth={3}
              dot={{ r: 5, strokeWidth: 2, fill: "#fff" }}
              activeDot={{ r: 7, strokeWidth: 2 }}
              connectNulls={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    );
  };

  const renderAreaChart = () => {
    const keys = Object.keys(data[0]).filter((key) => key !== "year");

    return (
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
        >
          <defs>
            {GRADIENTS.map((gradient, index) => (
              <linearGradient
                key={gradient.id}
                id={gradient.id}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor={gradient.colors[0]}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={gradient.colors[1]}
                  stopOpacity={0.1}
                />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
          <XAxis
            dataKey="year"
            tick={{ fill: "#6b7280", fontSize: 12 }}
            tickLine={{ stroke: "#9ca3af" }}
            axisLine={{ stroke: "#d1d5db" }}
          />
          <YAxis
            tick={{ fill: "#6b7280", fontSize: 12 }}
            tickLine={{ stroke: "#9ca3af" }}
            axisLine={{ stroke: "#d1d5db" }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ paddingTop: "20px" }} />
          {keys.map((key, index) => (
            <Area
              key={key}
              type="monotone"
              dataKey={key}
              stackId="1"
              stroke={COLORS[index % COLORS.length]}
              fill={`url(#${GRADIENTS[index % GRADIENTS.length].id})`}
              strokeWidth={2}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    );
  };

  const renderBarChart = () => {
    // Check if data has country/name field for bar charts
    const hasCountryData = data.length > 0 && (data[0].country || data[0].name);

    if (hasCountryData) {
      return (
        <ResponsiveContainer width="100%" height={height}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <defs>
              {GRADIENTS.map((gradient, index) => (
                <linearGradient
                  key={gradient.id}
                  id={gradient.id}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={gradient.colors[0]}
                    stopOpacity={0.9}
                  />
                  <stop
                    offset="95%"
                    stopColor={gradient.colors[1]}
                    stopOpacity={0.6}
                  />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e5e7eb"
              opacity={0.5}
            />
            <XAxis
              dataKey={data[0].country ? "country" : "name"}
              tick={{ fill: "#6b7280", fontSize: 11 }}
              tickLine={{ stroke: "#9ca3af" }}
              axisLine={{ stroke: "#d1d5db" }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis
              tick={{ fill: "#6b7280", fontSize: 12 }}
              tickLine={{ stroke: "#9ca3af" }}
              axisLine={{ stroke: "#d1d5db" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" fill="url(#gradient1)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      );
    }

    // Default bar chart for other data formats
    const keys = Object.keys(data[0]).filter((key) => key !== "year");

    return (
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
        >
          <defs>
            {GRADIENTS.map((gradient, index) => (
              <linearGradient
                key={gradient.id}
                id={gradient.id}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor={gradient.colors[0]}
                  stopOpacity={0.9}
                />
                <stop
                  offset="95%"
                  stopColor={gradient.colors[1]}
                  stopOpacity={0.6}
                />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
          <XAxis
            dataKey="year"
            tick={{ fill: "#6b7280", fontSize: 12 }}
            tickLine={{ stroke: "#9ca3af" }}
            axisLine={{ stroke: "#d1d5db" }}
          />
          <YAxis
            tick={{ fill: "#6b7280", fontSize: 12 }}
            tickLine={{ stroke: "#9ca3af" }}
            axisLine={{ stroke: "#d1d5db" }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ paddingTop: "20px" }} />
          {keys.map((key, index) => (
            <Bar
              key={key}
              dataKey={key}
              fill={`url(#${GRADIENTS[index % GRADIENTS.length].id})`}
              radius={[2, 2, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    );
  };

  const renderPieChart = () => {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={Math.min(height * 0.35, 150)}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                    <p className="font-semibold text-gray-900">{data.name}</p>
                    <p className="text-sm text-gray-600">
                      Value:{" "}
                      {typeof data.value === "number"
                        ? data.value.toFixed(2)
                        : data.value}
                    </p>
                    {/* <p className="text-sm text-gray-600">
                      Percentage: {((data.value / data.total) * 100).toFixed(1)}
                      %
                    </p> */}
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend
            wrapperStyle={{ paddingTop: "20px" }}
            formatter={(value, entry) => (
              <span style={{ color: entry.color, fontWeight: 500 }}>
                {value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  const renderRadialChart = () => {
    const radialData = data.slice(0, 8).map((item, index) => ({
      ...item,
      fill: COLORS[index % COLORS.length],
    }));

    return (
      <ResponsiveContainer width="100%" height={height}>
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="20%"
          outerRadius="90%"
          data={radialData}
        >
          <RadialBar dataKey="value" cornerRadius={10} fill="#8884d8" />
          <Legend
            iconSize={18}
            wrapperStyle={{ paddingTop: "20px" }}
            formatter={(value, entry) => (
              <span style={{ color: entry.color, fontWeight: 500 }}>
                {value}
              </span>
            )}
          />
          <Tooltip content={<CustomTooltip />} />
        </RadialBarChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div ref={chartRef} className="w-full">
      {title && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
      )}
      {type === "line" && renderLineChart()}
      {type === "area" && renderAreaChart()}
      {type === "bar" && renderBarChart()}
      {type === "pie" && renderPieChart()}
      {type === "radial" && renderRadialChart()}
    </div>
  );
}
