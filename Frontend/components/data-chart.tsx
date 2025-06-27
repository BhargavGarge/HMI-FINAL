"use client";

import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  Area,
  AreaChart,
  Scatter,
  ScatterChart,
  RadialBar,
  RadialBarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface DataChartProps {
  type: "line" | "bar" | "pie" | "area" | "radial" | "scatter" | "donut";
  data: any[];
  title: string;
  subtitle?: string;
  height?: number;
  unit?: string;
}

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
  "#FFC658",
  "#FF7C7C",
  "#8DD1E1",
  "#D084D0",
  "#87D068",
  "#FFA07A",
];

const GRADIENT_COLORS = [
  { start: "#667eea", end: "#764ba2" },
  { start: "#f093fb", end: "#f5576c" },
  { start: "#4facfe", end: "#00f2fe" },
  { start: "#43e97b", end: "#38f9d7" },
  { start: "#fa709a", end: "#fee140" },
  { start: "#a8edea", end: "#fed6e3" },
];

export function DataChart({
  type,
  data,
  title,
  subtitle,
  height = 400,
  unit,
}: DataChartProps) {
  const chartConfig = {
    value: {
      label: "Value",
      color: "hsl(var(--chart-1))",
    },
  };

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-2 border-dashed">
        <div className="text-center">
          <div className="text-4xl mb-2">📊</div>
          <div>No data available for visualization</div>
        </div>
      </div>
    );
  }

  // Transform data for radial chart
  const radialData = data.map((item, index) => ({
    ...item,
    fill: COLORS[index % COLORS.length],
    angle: (item.value / Math.max(...data.map((d) => d.value))) * 360,
  }));

  const renderChart = () => {
    switch (type) {
      case "bar":
        return (
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <defs>
              {GRADIENT_COLORS.map((gradient, index) => (
                <linearGradient
                  key={index}
                  id={`barGradient${index}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={gradient.start}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={gradient.end}
                    stopOpacity={0.6}
                  />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
            <XAxis
              dataKey="country"
              angle={-45}
              textAnchor="end"
              height={80}
              fontSize={12}
              stroke="#6b7280"
            />
            <YAxis stroke="#6b7280" fontSize={12} />
            <ChartTooltip
              content={<ChartTooltipContent />}
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
              }}
            />
            <Bar
              dataKey="value"
              fill="url(#barGradient0)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        );

      case "line":
        return (
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <defs>
              <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#667eea" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#764ba2" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
            <XAxis
              dataKey="country"
              angle={-45}
              textAnchor="end"
              height={80}
              fontSize={12}
              stroke="#6b7280"
            />
            <YAxis stroke="#6b7280" fontSize={12} />
            <ChartTooltip
              content={<ChartTooltipContent />}
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#667eea"
              strokeWidth={3}
              dot={{ fill: "#667eea", strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, fill: "#764ba2" }}
            />
          </LineChart>
        );

      case "area":
        return (
          <AreaChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4facfe" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#00f2fe" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
            <XAxis
              dataKey="country"
              angle={-45}
              textAnchor="end"
              height={80}
              fontSize={12}
              stroke="#6b7280"
            />
            <YAxis stroke="#6b7280" fontSize={12} />
            <ChartTooltip
              content={<ChartTooltipContent />}
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#4facfe"
              strokeWidth={2}
              fill="url(#areaGradient)"
            />
          </AreaChart>
        );

      case "pie":
        return (
          <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(1)}%`
              }
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
              nameKey="country"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  stroke="#fff"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <ChartTooltip
              content={<ChartTooltipContent />}
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
              }}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
          </PieChart>
        );

      case "donut":
        return (
          <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(1)}%`
              }
              outerRadius={120}
              innerRadius={60}
              fill="#8884d8"
              dataKey="value"
              nameKey="country"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  stroke="#fff"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <ChartTooltip
              content={<ChartTooltipContent />}
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
              }}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
          </PieChart>
        );

      case "radial":
        // Transform data for better radial visualization
        const maxValue = Math.max(...data.map((d) => d.value));
        const enhancedRadialData = data.map((item, index) => ({
          name: item.country,
          value: item.value,
          percentage: Math.round((item.value / maxValue) * 100),
          fill: COLORS[index % COLORS.length],
          // Create angle based on percentage for better visualization
          startAngle: index * (360 / data.length),
          endAngle: (index + 1) * (360 / data.length),
        }));

        return (
          <div className="w-full">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Radial Chart - Now takes more space */}
              <div className="xl:col-span-2 flex justify-center items-center">
                <RadialBarChart
                  cx="50%"
                  cy="50%"
                  innerRadius="25%"
                  outerRadius="85%"
                  data={enhancedRadialData}
                  margin={{ top: 40, right: 40, left: 40, bottom: 40 }}
                  width={500}
                  height={500}
                >
                  <RadialBar
                    dataKey="percentage"
                    cornerRadius={12}
                    fill="#8884d8"
                    label={{
                      position: "insideStart",
                      fill: "#fff",
                      fontSize: 14,
                      fontWeight: "bold",
                    }}
                  >
                    {enhancedRadialData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </RadialBar>
                  <ChartTooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-4 border rounded-lg shadow-xl border-gray-200">
                            <p className="font-bold text-lg text-gray-800">
                              {data.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              Value:{" "}
                              <span className="font-semibold">
                                {data.value}
                              </span>
                            </p>
                            <p className="text-sm text-gray-600">
                              Percentage:{" "}
                              <span className="font-semibold">
                                {data.percentage}%
                              </span>
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend
                    iconSize={16}
                    layout="vertical"
                    verticalAlign="middle"
                    align="right"
                    wrapperStyle={{
                      paddingLeft: "30px",
                      fontSize: "14px",
                    }}
                  />
                </RadialBarChart>
              </div>

              {/* Data Summary Cards - Now takes less space but still comprehensive */}
              <div className="xl:col-span-1 space-y-3">
                <h4 className="font-bold text-lg text-gray-800 mb-4">
                  Data Breakdown
                </h4>
                <div className="max-h-80 overflow-y-auto space-y-2">
                  {enhancedRadialData.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-5 h-5 rounded-full border-2 border-white shadow-sm"
                          style={{ backgroundColor: item.fill }}
                        />
                        <span className="font-medium text-sm">{item.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg text-gray-800">
                          {item.value}
                        </div>
                        <div className="text-xs text-gray-500">
                          {item.percentage}% of max
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Summary Statistics */}
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
                  <h5 className="font-bold text-sm text-gray-700 mb-3">
                    Summary Statistics
                  </h5>
                  <div className="grid grid-cols-1 gap-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total:</span>
                      <span className="font-bold text-gray-800">
                        {data
                          .reduce((sum, item) => sum + item.value, 0)
                          .toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Average:</span>
                      <span className="font-bold text-gray-800">
                        {Math.round(
                          data.reduce((sum, item) => sum + item.value, 0) /
                            data.length
                        ).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Maximum:</span>
                      <span className="font-bold text-gray-800">
                        {Math.max(...data.map((d) => d.value)).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Minimum:</span>
                      <span className="font-bold text-gray-800">
                        {Math.min(...data.map((d) => d.value)).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "scatter":
        return (
          <ScatterChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
            <XAxis
              dataKey="country"
              angle={-45}
              textAnchor="end"
              height={80}
              fontSize={12}
              stroke="#6b7280"
            />
            <YAxis stroke="#6b7280" fontSize={12} />
            <ChartTooltip
              content={<ChartTooltipContent />}
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
              }}
            />
            <Scatter dataKey="value" fill="#667eea">
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Scatter>
          </ScatterChart>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 rounded-lg border">
        <h3 className="text-xl font-bold text-gray-800 mb-1">{title}</h3>
        {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
        <div className="flex items-center gap-2 mt-2">
          <div className="px-2 py-1 bg-white rounded-full text-xs font-medium text-gray-700 border">
            {type.charAt(0).toUpperCase() + type.slice(1)} Chart
          </div>
          {unit && (
            <div className="px-2 py-1 bg-blue-100 rounded-full text-xs font-medium text-blue-700">
              Unit: {unit}
            </div>
          )}
          <div className="px-2 py-1 bg-green-100 rounded-full text-xs font-medium text-green-700">
            {data.length} data points
          </div>
          {type === "radial" && (
            <div className="px-2 py-1 bg-purple-100 rounded-full text-xs font-medium text-purple-700">
              Comparative Analysis
            </div>
          )}
        </div>
      </div>
      <ChartContainer
        config={chartConfig}
        className="w-full"
        style={{ height }}
      >
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
