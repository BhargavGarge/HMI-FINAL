"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Info,
  TrendingUp,
  BarChart3,
  AlertTriangle,
  Target,
} from "lucide-react";
import type { Story } from "@/types/story";

interface ChartConfig {
  title: string;
  subtitle: string;
  type: string;
  data: any[];
  insights: string[];
  domain?: string;
  story?: string;
}

// Chart generators based on actual story data
const generateChartFromStoryData = (
  chartId: string,
  story: Story,
  domain?: string
): ChartConfig | null => {
  if (!story.data) return null;

  const storyData = story.data;

  // Chart ID to data mapping
  const chartMappings = {
    // GDP and Growth Charts
    "gdp-growth-comparison": () => {
      if (storyData.growth) {
        const data = [
          {
            label: "Germany 2023",
            value: storyData.growth.gdp_growth_2023_percent || 0,
            color: "#EF4444",
          },
          {
            label: "Germany Forecast 2024",
            value: storyData.growth.gdp_growth_forecast_2024_percent || 0,
            color: "#DC2626",
          },
          {
            label: `Historical Average (${
              storyData.growth.historical_period || "2010s"
            })`,
            value: storyData.growth.historical_average_2010s_percent || 0,
            color: "#3B82F6",
          },
        ];

        return {
          title: "GDP Growth Comparison (%)",
          subtitle: "Germany's declining growth trajectory",
          type: "bar",
          data,
          insights: [
            `Germany's 2023 growth was only ${storyData.growth.gdp_growth_2023_percent}%`,
            `2024 forecast even lower at ${storyData.growth.gdp_growth_forecast_2024_percent}%`,
            `Far below historical average of ${storyData.growth.historical_average_2010s_percent}%`,
          ],
        };
      }
      return null;
    },

    "inflation-trends": () => {
      if (storyData.inflation) {
        const data = [
          {
            year: "2022",
            inflation: storyData.inflation.cpi_peak_percent || 0,
          },
          {
            year: "2024",
            inflation: storyData.inflation.cpi_forecast_2024_percent || 0,
          },
          {
            year: "ECB Target",
            inflation: storyData.inflation.ecb_target_percent || 0,
          },
        ];

        return {
          title: "Inflation Trajectory",
          subtitle: "From crisis peak to current levels",
          type: "line",
          data,
          insights: [
            `Inflation peaked at ${storyData.inflation.cpi_peak_percent}% in ${storyData.inflation.cpi_peak_year}`,
            `2024 forecast: ${storyData.inflation.cpi_forecast_2024_percent}%`,
            `Still above ECB target of ${storyData.inflation.ecb_target_percent}%`,
          ],
        };
      }
      return null;
    },

    "investment-decline": () => {
      if (storyData.investment) {
        const data = [
          {
            label: "Business Investment",
            value:
              storyData.investment.business_investment_decline_percent || 0,
            color: "#EF4444",
          },
          {
            label: "Construction Output",
            value:
              storyData.investment.construction_output_decline_percent || 0,
            color: "#DC2626",
          },
          {
            label: "Public Investment (% GDP)",
            value: storyData.investment.public_investment_gdp_percent || 0,
            color: "#3B82F6",
          },
        ];

        return {
          title: "Investment Performance",
          subtitle: "Declining private investment, low public investment",
          type: "horizontal-bar",
          data,
          insights: [
            `Business investment declined ${Math.abs(
              storyData.investment.business_investment_decline_percent || 0
            )}%`,
            `Construction output fell ${Math.abs(
              storyData.investment.construction_output_decline_percent || 0
            )}%`,
            `Public investment only ${storyData.investment.public_investment_gdp_percent}% of GDP`,
          ],
        };
      }
      return null;
    },

    "energy-impact": () => {
      if (storyData.energy_costs) {
        const data = [
          { label: "2021", cost: 100, color: "#10B981" },
          {
            label: "2023",
            cost:
              100 +
              (storyData.energy_costs.industrial_energy_cost_increase_percent ||
                0),
            color: "#EF4444",
          },
        ];

        return {
          title: "Industrial Energy Cost Impact",
          subtitle: `${
            storyData.energy_costs.increase_period || "2021-2023"
          } cost surge`,
          type: "bar",
          data,
          insights: [
            `Energy costs rose ${storyData.energy_costs.industrial_energy_cost_increase_percent}%`,
            "Major impact on manufacturing competitiveness",
            "Energy-intensive sectors particularly affected",
          ],
        };
      }
      return null;
    },

    "trade-performance": () => {
      if (storyData.trade) {
        const data = [
          {
            label: "Exports as % of GDP",
            value: storyData.trade.exports_gdp_percent || 0,
            color: "#3B82F6",
          },
          {
            label: "China Trade (€B)",
            value: storyData.trade.china_bilateral_trade_billion_euros || 0,
            color: "#EF4444",
          },
          {
            label: "China Exports Decline %",
            value: storyData.trade.exports_to_china_decline_percent || 0,
            color: "#DC2626",
          },
        ];

        return {
          title: "Trade Dependency & Performance",
          subtitle: "High exposure to declining China trade",
          type: "mixed",
          data,
          insights: [
            `Exports represent ${storyData.trade.exports_gdp_percent}% of GDP`,
            `China trade worth €${storyData.trade.china_bilateral_trade_billion_euros}B`,
            `China exports declined ${Math.abs(
              storyData.trade.exports_to_china_decline_percent || 0
            )}%`,
          ],
        };
      }
      return null;
    },

    "productivity-comparison": () => {
      if (storyData.productivity) {
        const data = [
          {
            label: "Germany",
            value: storyData.productivity.germany_annual_growth_2010_2019 || 0,
            color: "#EF4444",
          },
          {
            label: "United States",
            value: storyData.productivity.us_annual_growth_2010_2019 || 0,
            color: "#3B82F6",
          },
          {
            label: "South Korea",
            value:
              storyData.productivity.south_korea_annual_growth_2010_2019 || 0,
            color: "#10B981",
          },
        ];

        return {
          title: "Productivity Growth Comparison",
          subtitle: `Annual growth rates ${
            storyData.productivity.measurement_period || "2010-2019"
          }`,
          type: "bar",
          data,
          insights: [
            `Germany: ${storyData.productivity.germany_annual_growth_2010_2019}% annually`,
            `US outperformed at ${storyData.productivity.us_annual_growth_2010_2019}%`,
            `South Korea leads at ${storyData.productivity.south_korea_annual_growth_2010_2019}%`,
          ],
        };
      }
      return null;
    },

    "demographic-challenge": () => {
      if (storyData.demographics) {
        const data = [
          {
            label: "Working Age",
            value: 100 - storyData.demographics.population_over_65_percent || 0,
            color: "#3B82F6",
          },
          {
            label: "Over 65",
            value: storyData.demographics.population_over_65_percent || 0,
            color: "#EF4444",
          },
        ];

        return {
          title: "Demographic Structure",
          subtitle: `Median age: ${storyData.demographics.median_age_years} years`,
          type: "pie",
          data,
          insights: [
            `${storyData.demographics.population_over_65_percent}% of population over 65`,
            `Median age: ${storyData.demographics.median_age_years} years`,
            `Annual worker shortfall: ${storyData.demographics.annual_worker_shortfall?.toLocaleString()}`,
          ],
        };
      }
      return null;
    },

    "consumer-sentiment": () => {
      if (storyData.consumer_sentiment) {
        const data = [
          { year: "Historical Average", sentiment: 0, color: "#6B7280" },
          {
            year: storyData.consumer_sentiment.measurement_date || "Current",
            sentiment: storyData.consumer_sentiment.gfk_index || 0,
            color: "#EF4444",
          },
        ];

        return {
          title: "Consumer Sentiment Crisis",
          subtitle:
            storyData.consumer_sentiment.context || "Current consumer mood",
          type: "bar",
          data,
          insights: [
            `GfK Index: ${storyData.consumer_sentiment.gfk_index}`,
            storyData.consumer_sentiment.context ||
              "Deeply pessimistic outlook",
            "Consumers reluctant to spend",
          ],
        };
      }
      return null;
    },

    "innovation-spending": () => {
      if (storyData.innovation) {
        const data = [
          {
            label: "Germany",
            value:
              storyData.innovation.germany_rd_gdp_percent ||
              storyData.innovation.rd_spending_gdp_percent ||
              0,
            color: "#EF4444",
          },
          {
            label: "South Korea",
            value: storyData.innovation.south_korea_rd_gdp_percent || 0,
            color: "#10B981",
          },
          {
            label: "United States",
            value: storyData.innovation.us_rd_gdp_percent || 0,
            color: "#3B82F6",
          },
        ];

        return {
          title: "R&D Spending Comparison",
          subtitle: "Investment in innovation (% of GDP)",
          type: "bar",
          data,
          insights: [
            `Germany spends ${
              storyData.innovation.germany_rd_gdp_percent ||
              storyData.innovation.rd_spending_gdp_percent
            }% of GDP on R&D`,
            "Lags behind South Korea's innovation investment",
            "Need for higher tech spending intensity",
          ],
        };
      }
      return null;
    },

    "export-performance": () => {
      if (storyData.export_performance || storyData.exports) {
        const exportData = storyData.export_performance || storyData.exports;
        const data = [
          {
            year: "Previous Period",
            exports: 100,
            color: "#3B82F6",
          },
          {
            year: exportData.measurement_period || "Current",
            exports: 100 + (exportData.export_volumes_decline_percent || 0),
            color: "#EF4444",
          },
        ];

        return {
          title: "Export Volume Performance",
          subtitle: "Declining export competitiveness",
          type: "line",
          data,
          insights: [
            `Export volumes declined ${Math.abs(
              exportData.export_volumes_decline_percent || 0
            )}%`,
            "Reflects weakening global demand",
            "Structural competitiveness issues emerging",
          ],
        };
      }
      return null;
    },

    "industrial-production": () => {
      if (storyData.industrial_production) {
        const data = [
          {
            label: "Previous Year",
            value: 100,
            color: "#3B82F6",
          },
          {
            label:
              storyData.industrial_production.measurement_period || "Current",
            value: 100 + (storyData.industrial_production.decline_percent || 0),
            color: "#EF4444",
          },
        ];

        return {
          title: "Industrial Production Decline",
          subtitle: "Manufacturing sector under pressure",
          type: "bar",
          data,
          insights: [
            `Production declined ${Math.abs(
              storyData.industrial_production.decline_percent || 0
            )}%`,
            "Export-driven sectors most affected",
            "Reflects broader economic weakness",
          ],
        };
      }
      return null;
    },
  };

  // Try to find matching chart generator
  const generator = chartMappings[chartId as keyof typeof chartMappings];
  if (generator) {
    return generator();
  }

  // Fallback: try to generate chart from any available data
  return generateFallbackChart(chartId, storyData, story);
};

// Fallback chart generator for unmatched chart IDs
const generateFallbackChart = (
  chartId: string,
  storyData: any,
  story: Story
): ChartConfig => {
  // Find the first available data category
  const dataKeys = Object.keys(storyData);
  if (dataKeys.length === 0) {
    return {
      title: "Data Visualization",
      subtitle: "No data available",
      type: "placeholder",
      data: [],
      insights: ["No data available for visualization"],
    };
  }

  // Use the first data category
  const firstCategory = storyData[dataKeys[0]];
  const data = Object.entries(firstCategory)
    .filter(([key, value]) => typeof value === "number")
    .slice(0, 5) // Limit to 5 items
    .map(([key, value], index) => ({
      label: key.replace(/_/g, " ").replace(/percent/g, "%"),
      value: value as number,
      color: ["#3B82F6", "#EF4444", "#10B981", "#F59E0B", "#8B5CF6"][index],
    }));

  return {
    title: `${
      dataKeys[0].charAt(0).toUpperCase() + dataKeys[0].slice(1)
    } Analysis`,
    subtitle: `Data from ${story.title}`,
    type: "bar",
    data,
    insights: [
      `Analysis based on ${dataKeys[0]} data`,
      "Multiple metrics showing current state",
      "Data reflects story narrative",
    ],
  };
};

interface DataDrivenVisualizationProps {
  chartId: string;
  story: Story;
  domain?: string;
  className?: string;
}

export function DataDrivenVisualization({
  chartId,
  story,
  domain,
  className = "",
}: DataDrivenVisualizationProps) {
  const [showInsights, setShowInsights] = useState(false);

  const chartConfig = generateChartFromStoryData(chartId, story, domain);

  if (!chartConfig) {
    return (
      <div
        className={`p-6 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 ${className}`}
      >
        <div className="text-center text-gray-500">
          <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <div className="text-sm font-medium mb-2">No Data Available</div>
          <div className="text-xs">Chart ID: {chartId}</div>
          <div className="text-xs">Story: {story.title}</div>
        </div>
      </div>
    );
  }

  const renderChart = () => {
    const { type, data } = chartConfig;

    if (type === "placeholder") {
      return (
        <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600">No data available</p>
            <p className="text-sm text-gray-500">Check story data structure</p>
          </div>
        </div>
      );
    }

    switch (type) {
      case "bar":
        return (
          <div className="space-y-4">
            {data.map((item: any, index: number) => (
              <motion.div
                key={index}
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "100%", opacity: 1 }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                className="space-y-2"
              >
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{item.label}</span>
                  <span
                    className={`font-bold ${
                      item.value >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {item.value > 0 && item.value < 10 ? "+" : ""}
                    {item.value}
                    {item.label.includes("%") || item.label.includes("percent")
                      ? "%"
                      : ""}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${Math.min(Math.abs(item.value) * 3, 100)}%`,
                    }}
                    transition={{ delay: index * 0.2 + 0.3, duration: 0.8 }}
                    className="h-4 rounded-full flex items-center justify-end pr-2"
                    style={{ backgroundColor: item.color }}
                  >
                    {Math.abs(item.value) > 5 && (
                      <span className="text-white text-xs font-bold">
                        {item.value}
                        {item.label.includes("%") ? "%" : ""}
                      </span>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        );

      case "horizontal-bar":
        return (
          <div className="space-y-4">
            {data.map((item: any, index: number) => (
              <motion.div
                key={index}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.15 }}
                className="flex items-center space-x-4"
              >
                <div className="w-32 text-sm font-medium text-right">
                  {item.label}
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-8 relative">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${Math.min(Math.abs(item.value) * 4, 100)}%`,
                    }}
                    transition={{ delay: index * 0.15 + 0.3, duration: 0.8 }}
                    className="h-8 rounded-full flex items-center justify-end pr-3"
                    style={{ backgroundColor: item.color }}
                  >
                    <span className="text-white text-sm font-bold">
                      {item.value > 0 ? "+" : ""}
                      {item.value}
                      {item.label.includes("%") || item.label.includes("GDP")
                        ? "%"
                        : ""}
                    </span>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        );

      case "pie":
        const total = data.reduce(
          (sum: number, item: any) => sum + Math.abs(item.value),
          0
        );
        let currentAngle = 0;

        return (
          <div className="flex items-center justify-center">
            <div className="relative">
              <svg width="300" height="300" className="transform -rotate-90">
                {data.map((item: any, index: number) => {
                  const percentage = (Math.abs(item.value) / total) * 100;
                  const angle = (Math.abs(item.value) / total) * 360;
                  const startAngle = currentAngle;
                  currentAngle += angle;

                  const x1 = 150 + 120 * Math.cos((startAngle * Math.PI) / 180);
                  const y1 = 150 + 120 * Math.sin((startAngle * Math.PI) / 180);
                  const x2 =
                    150 +
                    120 * Math.cos(((startAngle + angle) * Math.PI) / 180);
                  const y2 =
                    150 +
                    120 * Math.sin(((startAngle + angle) * Math.PI) / 180);

                  const largeArcFlag = angle > 180 ? 1 : 0;

                  return (
                    <motion.path
                      key={index}
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ delay: index * 0.2, duration: 0.8 }}
                      d={`M 150 150 L ${x1} ${y1} A 120 120 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                      fill={item.color}
                      stroke="white"
                      strokeWidth="2"
                    />
                  );
                })}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-2xl font-bold text-gray-900">
                  {total.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
            </div>
            <div className="ml-8 space-y-2">
              {data.map((item: any, index: number) => (
                <motion.div
                  key={index}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-3"
                >
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-medium">{item.label}</span>
                  <span className="text-sm text-gray-600">{item.value}%</span>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case "line":
        const maxValue = Math.max(
          ...data.map((d: any) =>
            Math.abs(d.exports || d.sentiment || d.value || 0)
          )
        );
        const minValue = Math.min(
          ...data.map((d: any) => d.exports || d.sentiment || d.value || 0)
        );
        const range = maxValue - minValue || 1;

        return (
          <div className="relative">
            <svg width="100%" height="300" className="overflow-visible">
              {/* Grid lines */}
              {[0, 25, 50, 75, 100].map((y) => (
                <line
                  key={y}
                  x1="0"
                  y1={y * 2.4}
                  x2="100%"
                  y2={y * 2.4}
                  stroke="#E5E7EB"
                  strokeWidth="1"
                />
              ))}

              {/* Data line */}
              <motion.polyline
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.5 }}
                points={data
                  .map((d: any, i: number) => {
                    const x = (i / (data.length - 1)) * 100;
                    const value = d.exports || d.sentiment || d.value || 0;
                    const y = ((maxValue - value) / range) * 240;
                    return `${x},${y}`;
                  })
                  .join(" ")}
                fill="none"
                stroke="#3B82F6"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Data points */}
              {data.map((d: any, i: number) => {
                const x = (i / (data.length - 1)) * 100;
                const value = d.exports || d.sentiment || d.value || 0;
                const y = ((maxValue - value) / range) * 240;
                return (
                  <motion.circle
                    key={i}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: i * 0.2, duration: 0.3 }}
                    cx={`${x}%`}
                    cy={y}
                    r="6"
                    fill="#3B82F6"
                    stroke="white"
                    strokeWidth="2"
                  />
                );
              })}
            </svg>

            {/* X-axis labels */}
            <div className="flex justify-between mt-2 text-xs text-gray-600">
              {data.map((d: any, i: number) => (
                <span key={i}>{d.year}</span>
              ))}
            </div>
          </div>
        );

      case "mixed":
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.map((item: any, index: number) => (
              <motion.div
                key={index}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.2 }}
                className="text-center p-6 bg-gray-50 rounded-xl"
              >
                <div
                  className="text-3xl font-bold mb-2"
                  style={{ color: item.color }}
                >
                  {item.value}
                  {item.label.includes("%")
                    ? "%"
                    : item.label.includes("€B")
                    ? "B"
                    : ""}
                </div>
                <div className="text-sm font-medium text-gray-700">
                  {item.label}
                </div>
              </motion.div>
            ))}
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">Data-driven visualization</p>
              <p className="text-sm text-gray-500">{chartConfig.title}</p>
            </div>
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      <Card className="bg-gradient-to-br from-white to-gray-50 border-0 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                {chartConfig.title}
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                {chartConfig.subtitle}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                  Real Data
                </span>
                {domain && (
                  <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                    {domain.charAt(0).toUpperCase() + domain.slice(1)}
                  </span>
                )}
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowInsights(!showInsights)}
              className="text-xs"
            >
              <Info className="h-3 w-3 mr-1" />
              Insights
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <AnimatePresence>
            {showInsights && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500"
              >
                <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Data Insights
                </h4>
                <ul className="space-y-2">
                  {chartConfig.insights.map((insight, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-2 text-blue-800 text-sm"
                    >
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <span>{insight}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            {renderChart()}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
