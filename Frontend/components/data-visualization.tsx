"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingDown, Database } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  Line,
  ComposedChart,
} from "recharts";
import type { Story } from "@/types/story";

interface DataVisualizationProps {
  story: Story;
  currentSection: number;
  domainColor: string;
}

const COLORS = {
  blue: ["#3B82F6", "#60A5FA", "#93C5FD", "#DBEAFE"],
  green: ["#10B981", "#34D399", "#6EE7B7", "#D1FAE5"],
  purple: ["#8B5CF6", "#A78BFA", "#C4B5FD", "#EDE9FE"],
  yellow: ["#F59E0B", "#FBBF24", "#FCD34D", "#FEF3C7"],
  indigo: ["#6366F1", "#818CF8", "#A5B4FC", "#E0E7FF"],
};

const PIE_COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#06B6D4",
];

export function DataVisualization({
  story,
  currentSection,
  domainColor,
}: DataVisualizationProps) {
  // Add proper null checking
  if (!story.data) return null;

  const colors = COLORS[domainColor as keyof typeof COLORS] || COLORS.blue;
  const section = story.sections[currentSection];

  // Add safety checks for section
  if (!section) return null;

  const heading = section.heading.toLowerCase();
  const content = section.content.toLowerCase();

  // Helper function to get specific story data
  const getStorySpecificData = () => {
    // For "The Inflation-Growth Trap" story
    if (story.id === "inflation-growth-trap") {
      if (currentSection === 0 && story.data?.growth) {
        // GDP Growth comparison for first section
        return {
          type: "gdp-growth",
          data: [
            {
              period: "2010s Average",
              value: story.data.growth.historical_average_2010s_percent,
              type: "Historical",
            },
            {
              period: "2023",
              value: story.data.growth.gdp_growth_2023_percent,
              type: "Current",
            },
            {
              period: "2024 Forecast",
              value: story.data.growth.gdp_growth_forecast_2024_percent,
              type: "Forecast",
            },
          ],
          title: "Germany's GDP Growth Collapse",
          description: `GDP growth fell from ${story.data.growth.historical_average_2010s_percent}% average in 2010s to just ${story.data.growth.gdp_growth_2023_percent}% in 2023`,
        };
      }

      if (currentSection === 1 && story.data?.inflation) {
        // Inflation timeline for second section
        return {
          type: "inflation-timeline",
          data: [
            { year: "2021", value: 3.2, phase: "Rising" },
            {
              year: "2022",
              value: story.data.inflation.cpi_peak_percent,
              phase: "Peak Crisis",
            },
            { year: "2023", value: 5.9, phase: "Declining" },
            {
              year: "2024",
              value: story.data.inflation.cpi_forecast_2024_percent,
              phase: "Normalizing",
            },
          ],
          title: "Inflation Crisis Timeline",
          description: `Inflation peaked at ${story.data.inflation.cpi_peak_percent}% in ${story.data.inflation.cpi_peak_year}, far above ECB target of ${story.data.inflation.ecb_target_percent}%`,
        };
      }

      if (currentSection === 2 && story.data?.investment) {
        // Investment collapse for third section
        return {
          type: "investment-decline",
          data: [
            {
              category: "Business Investment",
              value: story.data.investment.business_investment_decline_percent,
              period: "Q1 2024 YoY",
            },
            {
              category: "Construction Output",
              value: story.data.investment.construction_output_decline_percent,
              period: "YoY",
            },
            {
              category: "Public Investment",
              value: story.data.investment.public_investment_gdp_percent,
              period: "% of GDP",
            },
          ],
          title: "Investment Collapse Across Sectors",
          description: `Business investment fell ${Math.abs(
            story.data.investment.business_investment_decline_percent
          )}% while construction declined ${Math.abs(
            story.data.investment.construction_output_decline_percent
          )}%`,
        };
      }

      if (currentSection === 3 && story.data?.consumer_sentiment) {
        // Consumer sentiment for fourth section
        return {
          type: "consumer-sentiment",
          data: [
            {
              metric: "Consumer Sentiment",
              current: story.data.consumer_sentiment.gfk_index,
              historical: -10,
              target: 0,
            },
            {
              metric: "Real Wages",
              current: -2.5,
              historical: 1.2,
              target: 2.0,
            },
          ],
          title: "Consumer Confidence Crisis",
          description: `GfK Consumer Sentiment at ${story.data.consumer_sentiment.gfk_index}, ${story.data.consumer_sentiment.context}`,
        };
      }
    }

    // For "Global Decoupling" story
    if (story.id === "global-decoupling") {
      if (currentSection === 0 && story.data?.trade) {
        return {
          type: "trade-dependency",
          data: [
            {
              year: "2019",
              exports_gdp: story.data.trade.exports_gdp_percent,
              china_trade: 180,
            },
            {
              year: "2022",
              exports_gdp: 46.8,
              china_trade: story.data.trade.china_bilateral_trade_billion_euros,
            },
            { year: "2023", exports_gdp: 45.2, china_trade: 220 },
          ],
          title: "Germany's Trade Dependency",
          description: `Exports account for ${story.data.trade.exports_gdp_percent}% of GDP, with China trade at €${story.data.trade.china_bilateral_trade_billion_euros}B in ${story.data.trade.china_trade_year}`,
        };
      }

      if (currentSection === 2 && story.data?.export_performance) {
        return {
          type: "export-decline",
          data: [
            {
              region: "Overall Exports",
              change:
                story.data.export_performance.export_volumes_decline_percent,
              period: "Q1 2024",
            },
            {
              region: "China",
              change: story.data.trade.exports_to_china_decline_percent,
              period: "2023",
            },
            {
              region: "East Asia Orders",
              change:
                story.data.industrial_production
                  .export_orders_east_asia_decline_percent,
              period: "2024",
            },
          ],
          title: "Export Performance Collapse",
          description: `Export volumes fell ${Math.abs(
            story.data.export_performance.export_volumes_decline_percent
          )}% overall, with China down ${Math.abs(
            story.data.trade.exports_to_china_decline_percent
          )}%`,
        };
      }
    }

    // For "Silent Slowdown" story
    if (story.id === "silent-slowdown") {
      if (currentSection === 0 && story.data?.productivity) {
        return {
          type: "productivity-comparison",
          data: [
            {
              country: "Germany",
              growth: story.data.productivity.germany_annual_growth_2010_2019,
              status: "Lagging",
            },
            {
              country: "United States",
              growth: story.data.productivity.us_annual_growth_2010_2019,
              status: "Competitive",
            },
            {
              country: "South Korea",
              growth:
                story.data.productivity.south_korea_annual_growth_2010_2019,
              status: "Leading",
            },
          ],
          title: "Productivity Growth Gap (2010-2019)",
          description: `Germany's ${story.data.productivity.germany_annual_growth_2010_2019}% productivity growth lags behind US (${story.data.productivity.us_annual_growth_2010_2019}%) and South Korea (${story.data.productivity.south_korea_annual_growth_2010_2019}%)`,
        };
      }

      if (currentSection === 2 && story.data?.demographics) {
        return {
          type: "demographic-challenge",
          data: [
            {
              category: "Median Age",
              value: story.data.demographics.median_age_years,
              benchmark: 42,
              unit: "years",
            },
            {
              category: "Over 65 Population",
              value: story.data.demographics.population_over_65_percent,
              benchmark: 18,
              unit: "%",
            },
            {
              category: "Worker Shortfall",
              value: story.data.demographics.annual_worker_shortfall / 1000,
              benchmark: 200,
              unit: "thousands",
            },
          ],
          title: "Demographic Pressure Points",
          description: `Median age of ${
            story.data.demographics.median_age_years
          } years with ${
            story.data.demographics.population_over_65_percent
          }% over 65, creating annual shortfall of ${story.data.demographics.annual_worker_shortfall.toLocaleString()} workers`,
        };
      }
    }

    // For "Growth Engine" story
    if (story.id === "growth-engine") {
      if (currentSection === 1 && story.data?.exports) {
        return {
          type: "export-weakness",
          data: [
            {
              metric: "Export Volumes",
              change: story.data.exports.export_volumes_decline_percent,
              period: "Q1 2024",
            },
            {
              metric: "China Exports",
              change: story.data.exports.exports_to_china_decline_percent,
              period: "2024 YoY",
            },
            {
              metric: "Industrial Production",
              change: story.data.industrial_production.decline_percent,
              period: "Q1 2024",
            },
          ],
          title: "Export Engine Breakdown",
          description: `Export volumes declined ${Math.abs(
            story.data.exports.export_volumes_decline_percent
          )}% with China exports down ${Math.abs(
            story.data.exports.exports_to_china_decline_percent
          )}%`,
        };
      }
    }

    return null;
  };

  const chartData = getStorySpecificData();

  if (!chartData) {
    // Fallback: show key metrics from story data
    const keyMetrics = [];
    if (story.data?.growth) {
      keyMetrics.push({
        indicator: "GDP Growth 2023",
        value: story.data.growth.gdp_growth_2023_percent || 0.2,
        target: story.data.growth.historical_average_2010s_percent || 1.5,
        status: "Below Historical Average",
      });
    }
    if (story.data?.inflation) {
      keyMetrics.push({
        indicator: "Inflation Forecast 2024",
        value: story.data.inflation.cpi_forecast_2024_percent || 2.4,
        target: story.data.inflation.ecb_target_percent || 2.0,
        status: "Above ECB Target",
      });
    }
    if (story.data?.investment) {
      keyMetrics.push({
        indicator: "Public Investment",
        value: story.data.investment.public_investment_gdp_percent || 2.4,
        target: 3.0,
        status: "Below Recommended",
      });
    }

    if (keyMetrics.length === 0) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center gap-2 text-gray-700 mb-4">
          <Database className="h-6 w-6 text-blue-600" />
          <span className="font-bold text-lg">Key Economic Indicators</span>
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            Section {currentSection + 1} Data
          </Badge>
        </div>
        <Card className="bg-gradient-to-br from-white to-gray-50 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              Current Economic Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {keyMetrics.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <div className="font-medium text-gray-900">
                      {item.indicator}
                    </div>
                    <div className="text-sm text-gray-600">{item.status}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      {item.value}%
                    </div>
                    <div className="text-sm text-gray-500">
                      Target: {item.target}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Render specific chart based on data type
  const renderChart = () => {
    switch (chartData.type) {
      case "gdp-growth":
        return (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis
                label={{
                  value: "GDP Growth (%)",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip
                formatter={(value: number) => [`${value}%`, "GDP Growth"]}
              />
              <Bar dataKey="value" fill={colors[0]} />
            </BarChart>
          </ResponsiveContainer>
        );

      case "inflation-timeline":
        return (
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={chartData.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis
                label={{
                  value: "Inflation (%)",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip
                formatter={(value: number) => [`${value}%`, "CPI Inflation"]}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#F59E0B"
                fill="#FEF3C7"
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      case "investment-decline":
        return (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData.data} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="category" type="category" width={120} />
              <Tooltip
                formatter={(value: number) => [
                  `${value}${Math.abs(value) < 10 ? "%" : "% of GDP"}`,
                  "Value",
                ]}
              />
              <Bar dataKey="value" fill={colors[0]} />
            </BarChart>
          </ResponsiveContainer>
        );

      case "trade-dependency":
        return (
          <ResponsiveContainer width="100%" height={350}>
            <ComposedChart data={chartData.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis
                yAxisId="left"
                label={{
                  value: "Exports % GDP",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                label={{
                  value: "China Trade (€B)",
                  angle: 90,
                  position: "insideRight",
                }}
              />
              <Tooltip />
              <Bar
                yAxisId="left"
                dataKey="exports_gdp"
                fill={colors[0]}
                name="Exports % GDP"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="china_trade"
                stroke="#EF4444"
                strokeWidth={3}
                name="China Trade €B"
              />
            </ComposedChart>
          </ResponsiveContainer>
        );

      case "export-decline":
        return (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="region" />
              <YAxis
                label={{
                  value: "Change (%)",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip
                formatter={(value: number) => [`${value}%`, "Export Change"]}
              />
              <Bar dataKey="change" fill="#EF4444" />
            </BarChart>
          </ResponsiveContainer>
        );

      case "productivity-comparison":
        return (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="country" />
              <YAxis
                label={{
                  value: "Annual Growth (%)",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip
                formatter={(value: number) => [
                  `${value}%`,
                  "Productivity Growth",
                ]}
              />
              <Bar dataKey="growth" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        );

      case "demographic-challenge":
        return (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip
                formatter={(value: number, name: string, props: any) => [
                  `${value} ${props.payload.unit}`,
                  "Current Value",
                ]}
              />
              <Bar dataKey="value" fill="#F59E0B" name="Current" />
              <Bar dataKey="benchmark" fill={colors[2]} name="Benchmark" />
            </BarChart>
          </ResponsiveContainer>
        );

      case "export-weakness":
        return (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="metric" />
              <YAxis
                label={{
                  value: "Change (%)",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip formatter={(value: number) => [`${value}%`, "Change"]} />
              <Bar dataKey="change" fill="#EF4444" />
            </BarChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-2 text-gray-700 mb-4">
        <BarChart3 className="h-6 w-6 text-blue-600" />
        <span className="font-bold text-lg">Data-Driven Visualization</span>
        <Badge
          variant="outline"
          className="bg-green-50 text-green-700 border-green-200"
        >
          Section {currentSection + 1} Data
        </Badge>
      </div>
      <Card className="bg-gradient-to-br from-white to-gray-50 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-red-500" />
            {chartData.title}
            <Badge variant="outline" className="bg-red-50 text-red-700">
              Real Data
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderChart()}
          <div className="mt-4 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
            {chartData.description}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
