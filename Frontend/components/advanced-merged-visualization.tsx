"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Info,
  TrendingUp,
  BarChart3,
  AlertTriangle,
  Target,
  Globe,
  Users,
  Zap,
  Building,
  Brain,
  ArrowUp,
  ArrowDown,
  Minus,
} from "lucide-react";
import type { Story } from "@/types/story";

interface ChartConfig {
  title: string;
  subtitle: string;
  type: string;
  data: any[];
  insights: string[];
  category: string;
  domain?: string;
  story?: string;
}

// Advanced chart generators for merged data structure
const generateAdvancedChart = (
  chartId: string,
  story: Story,
  domain?: string
): ChartConfig | null => {
  if (!story.data) return null;

  const storyData = story.data;

  // Advanced chart mappings for merged data structure
  const chartMappings = {
    // GDP Growth Trajectory with Timeline
    "gdp-growth-trajectory": () => {
      if (
        storyData.growth_trajectory ||
        storyData.historical_performance_decline
      ) {
        const trajectoryData =
          storyData.growth_trajectory ||
          storyData.historical_performance_decline;
        const data = trajectoryData.map((item: any, index: number) => ({
          period: item.period || item.year?.toString(),
          value:
            item.average_gdp_growth_percent ||
            item.gdp_growth_percent ||
            item.gdp_growth_forecast_percent ||
            item.gdp_growth_projection_percent,
          status: item.status || item.description || item.trend,
          color:
            (item.average_gdp_growth_percent || item.gdp_growth_percent || 0) >
            1
              ? "#10B981"
              : (item.average_gdp_growth_percent ||
                  item.gdp_growth_percent ||
                  0) > 0.5
              ? "#F59E0B"
              : "#EF4444",
          isHistorical: item.period?.includes("2010") || false,
          isForecast: item.source?.includes("projection") || item.year === 2024,
        }));

        interface GdpGrowthTrajectoryItem {
          period: string;
          value: number;
          status?: string;
          color: string;
          isHistorical?: boolean;
          isForecast?: boolean;
        }

        interface GdpGrowthTrajectoryChartConfig extends ChartConfig {
          data: GdpGrowthTrajectoryItem[];
        }

        return {
          title: "Germany's GDP Growth Trajectory",
          subtitle: "From economic powerhouse to structural stagnation",
          type: "advanced-timeline",
          category: "growth",
          data: data as GdpGrowthTrajectoryItem[],
          insights: [
            `Historical 2010s average: ${
              (data as GdpGrowthTrajectoryItem[]).find((d) => d.isHistorical)
                ?.value
            }%`,
            `2023 actual growth: ${
              (data as GdpGrowthTrajectoryItem[]).find(
                (d) => d.period === "2023"
              )?.value
            }%`,
            `2024 forecast: ${
              (data as GdpGrowthTrajectoryItem[]).find((d) => d.isForecast)
                ?.value
            }%`,
            "Structural slowdown indicates deeper economic challenges",
            "Growth model reaching expiration date",
          ],
        } as GdpGrowthTrajectoryChartConfig;
      }
      return null;
    },

    // Productivity International Comparison
    "productivity-international": () => {
      if (storyData.productivity_comparison) {
        const data = storyData.productivity_comparison.map(
          (item: any, index: number) => ({
            country: item.country,
            value: item.annual_growth_percent,
            period: item.period,
            color:
              item.country === "Germany"
                ? "#EF4444"
                : item.country === "South Korea"
                ? "#10B981"
                : "#3B82F6",
            rank:
              item.country === "South Korea"
                ? 1
                : item.country === "United States"
                ? 2
                : 3,
            gap:
              item.country === "Germany" ? 0 : item.annual_growth_percent - 0.8,
          })
        );

        interface ProductivityComparisonItem {
          country: string;
          value: number;
          period: string;
          color: string;
          rank: number;
          gap: number;
        }

        interface ProductivityComparisonChartConfig extends ChartConfig {
          data: ProductivityComparisonItem[];
        }

        const chartConfig: ProductivityComparisonChartConfig = {
          title: "International Productivity Comparison",
          subtitle: `Annual productivity growth ${
            (data[0] as ProductivityComparisonItem)?.period
          }`,
          type: "competitive-analysis",
          category: "productivity",
          data: data as ProductivityComparisonItem[],
          insights: [
            `Germany lags significantly at ${
              (data as ProductivityComparisonItem[]).find(
                (d) => d.country === "Germany"
              )?.value
            }%`,
            `South Korea leads at ${
              (data as ProductivityComparisonItem[]).find(
                (d) => d.country === "South Korea"
              )?.value
            }% - 2.5x Germany`,
            `US outperforms at ${
              (data as ProductivityComparisonItem[]).find(
                (d) => d.country === "United States"
              )?.value
            }% - 50% higher`,
            "Productivity gap indicates structural competitiveness crisis",
            "Germany needs urgent productivity reforms",
          ],
        };

        return chartConfig;
      }
      return null;
    },

    // Trade Dependency Evolution
    "trade-dependency-evolution": () => {
      if (storyData.trade_dependency_timeline) {
        const data = storyData.trade_dependency_timeline.map(
          (item: any, index: number) => ({
            year: item.year,
            value:
              item.exports_gdp_percent ||
              item.china_bilateral_trade_billion_euros ||
              Math.abs(item.china_exports_change_percent || 0),
            metric: item.exports_gdp_percent
              ? "Exports % GDP"
              : item.china_bilateral_trade_billion_euros
              ? "China Trade (€B)"
              : "China Export Decline %",
            status: item.status || item.trend || item.rank,
            color:
              item.china_exports_change_percent < 0 ? "#EF4444" : "#3B82F6",
            isDecline: item.china_exports_change_percent < 0,
            significance: item.rank || item.status,
          })
        );

        return {
          title: "Germany's Trade Dependency Evolution",
          subtitle: "From export champion to China vulnerability",
          type: "dependency-timeline",
          category: "trade",
          data,
          insights: [
            "2019: Exports 47.4% of GDP - among highest in OECD",
            "2022: China became largest partner with €245B trade",
            "2023: China exports declined 10.2% - structural shift",
            "High trade dependency creates geopolitical vulnerability",
            "Export-led model facing obsolescence",
          ],
        };
      }
      return null;
    },

    // Investment Collapse Analysis
    "investment-collapse-analysis": () => {
      if (
        storyData.investment_collapse ||
        storyData.investment_confidence_collapse
      ) {
        const investmentData =
          storyData.investment_collapse ||
          storyData.investment_confidence_collapse;
        const data = investmentData.map((item: any, index: number) => ({
          category: item.metric || item.sector || `${item.year} Fixed Capital`,
          value:
            item.change_percent ||
            item.output_decline_percent ||
            item.gross_fixed_capital_formation_percent,
          period: item.period || item.year,
          causes: item.causes || [],
          color:
            (item.change_percent || item.output_decline_percent || 0) < 0
              ? "#EF4444"
              : "#3B82F6",
          isNegative:
            (item.change_percent || item.output_decline_percent || 0) < 0,
          severity: Math.abs(
            item.change_percent || item.output_decline_percent || 0
          ),
        }));

        return {
          title: "Investment Collapse Analysis",
          subtitle: "Private investment confidence evaporates",
          type: "investment-breakdown",
          category: "investment",
          data,
          insights: [
            "Business investment declined 1.8% YoY in Q1 2024",
            "Construction output fell 7.4% - sector in deep slump",
            "Caused by interest rate hikes, uncertainty, expensive materials",
            "Fixed capital formation dropped 1.5 percentage points",
            "Reflects deeper concerns about Germany's competitiveness",
          ],
        };
      }
      return null;
    },

    // Demographic Pressure Matrix
    "demographic-pressure-matrix": () => {
      if (storyData.demographic_pressure) {
        const data = storyData.demographic_pressure.map(
          (item: any, index: number) => ({
            metric: item.metric,
            value: item.value || item.percentage,
            unit: item.unit || "percent",
            status: item.status,
            since: item.since_year,
            source: item.source,
            color: ["#3B82F6", "#EF4444", "#F59E0B", "#8B5CF6"][index],
            severity:
              item.metric === "Annual Worker Shortfall" ? "critical" : "high",
            trend: item.status === "shrinking" ? "declining" : "stable",
          })
        );

        interface DemographicPressureItem {
          metric: string;
          value: number;
          unit: string;
          status?: string;
          since?: number;
          source?: string;
          color: string;
          severity: string;
          trend: string;
        }

        interface DemographicPressureChartConfig extends ChartConfig {
          data: DemographicPressureItem[];
        }

        const chartConfig: DemographicPressureChartConfig = {
          title: "Demographic Pressure Matrix",
          subtitle: "Aging population constrains economic potential",
          type: "demographic-matrix",
          category: "demographics",
          data: data as DemographicPressureItem[],
          insights: [
            `Median age: ${
              (data as DemographicPressureItem[]).find(
                (d) => d.metric === "Median Age"
              )?.value
            } years - among EU highest`,
            `${
              (data as DemographicPressureItem[]).find(
                (d) => d.metric === "Population Over 65"
              )?.value
            }% over 65 - rapid aging`,
            "Workforce shrinking since 2010 - structural challenge",
            `${(data as DemographicPressureItem[])
              .find((d) => d.metric === "Annual Worker Shortfall")
              ?.value?.toLocaleString()} worker shortfall annually`,
            "Demographics becoming economic growth constraint",
          ],
        };

        return chartConfig;
      }
      return null;
    },

    // Corporate China Exposure Risk
    "corporate-china-risk": () => {
      if (storyData.corporate_china_exposure) {
        const data = storyData.corporate_china_exposure
          .filter((item: any) => item.company)
          .map((item: any, index: number) => ({
            company: item.company,
            exposure: item.china_revenue_percent,
            risk: item.risk_level,
            year: item.year,
            color: ["#1F2937", "#3B82F6", "#EF4444"][index],
            riskLevel: item.china_revenue_percent > 30 ? "high" : "medium",
            sector: item.company === "BASF" ? "Chemicals" : "Automotive",
          }));

        return {
          title: "Corporate China Exposure Risk",
          subtitle: "German giants vulnerable to geopolitical shifts",
          type: "risk-exposure",
          category: "risk",
          data,
          insights: [
            "Volkswagen, BMW, BASF each 35% revenue from China",
            "Overexposure risk mounting amid tensions",
            "Germany's 2023 China Strategy calls for de-risking",
            "Companies uncertain how to reduce dependency",
            "Geopolitical decoupling threatens business models",
          ],
        };
      }
      return null;
    },

    // Innovation Gap Analysis
    "innovation-gap-analysis": () => {
      if (storyData.innovation_gap) {
        const data = storyData.innovation_gap
          .filter((item: any) => item.country)
          .map((item: any, index: number) => ({
            country: item.country,
            rdSpending: item.rd_gdp_percent,
            gap: item.rd_gdp_percent - 3.1, // Gap vs Germany
            color:
              item.country === "Germany"
                ? "#EF4444"
                : item.country === "South Korea"
                ? "#10B981"
                : "#3B82F6",
            rank:
              item.country === "South Korea"
                ? 1
                : item.country === "United States"
                ? 2
                : 3,
            performance: item.country === "Germany" ? "lagging" : "leading",
          }));

        interface InnovationGapItem {
          country: string;
          rdSpending: number;
          gap: number;
          color: string;
          rank: number;
          performance: string;
        }

        interface InnovationGapChartConfig extends ChartConfig {
          data: InnovationGapItem[];
        }

        const chartConfig: InnovationGapChartConfig = {
          title: "R&D Investment Gap Analysis",
          subtitle: "Germany falling behind in innovation race",
          type: "innovation-gap",
          category: "innovation",
          data: data as InnovationGapItem[],
          insights: [
            `Germany: ${
              (data as InnovationGapItem[]).find((d) => d.country === "Germany")
                ?.rdSpending
            }% of GDP - insufficient`,
            `South Korea leads: ${
              (data as InnovationGapItem[]).find(
                (d) => d.country === "South Korea"
              )?.rdSpending
            }% - 58% higher`,
            `US invests: ${
              (data as InnovationGapItem[]).find(
                (d) => d.country === "United States"
              )?.rdSpending
            }% - 13% higher`,
            "Lagging in AI, clean tech, digital infrastructure",
            "Innovation gap threatens future competitiveness",
          ],
        };

        return chartConfig;
      }
      return null;
    },

    // Energy Shock Impact
    "energy-shock-impact": () => {
      if (
        storyData.energy_shock_impact ||
        storyData.structural_vulnerabilities
      ) {
        const energyData =
          storyData.energy_shock_impact || storyData.structural_vulnerabilities;
        const impactItem = Array.isArray(energyData)
          ? energyData[0]
          : energyData;

        const data = [
          {
            period: "Pre-2021",
            cost: 100,
            status: "baseline",
            color: "#10B981",
          },
          {
            period: impactItem.period || "2021-2023",
            cost:
              100 +
              (impactItem.industrial_energy_cost_increase_percent ||
                impactItem.energy_price_increase_percent ||
                0),
            status: "shock",
            color: "#EF4444",
            increase:
              impactItem.industrial_energy_cost_increase_percent ||
              impactItem.energy_price_increase_percent ||
              0,
          },
        ];

        return {
          title: "Energy Shock Impact Analysis",
          subtitle: "Ukraine war devastates German industrial competitiveness",
          type: "energy-shock",
          category: "energy",
          data,
          insights: [
            `Industrial energy costs rose ${data[1].increase}% since 2021`,
            "Ukraine war triggered devastating cost shock",
            "Manufacturing and exports severely impacted",
            "Energy-intensive sectors particularly vulnerable",
            "Structural competitiveness challenge for German industry",
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

  return null;
};

// Advanced chart rendering with sophisticated visualizations
const renderAdvancedChart = (config: ChartConfig) => {
  const { type, data } = config;

  switch (type) {
    case "advanced-timeline":
      return (
        <div className="space-y-8">
          <div className="relative">
            <div className="absolute left-12 top-0 bottom-0 w-1 bg-gradient-to-b from-green-400 via-yellow-400 to-red-400 rounded-full"></div>
            <div className="space-y-8">
              {data.map((item: any, index: number) => (
                <motion.div
                  key={index}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.4 }}
                  className="relative flex items-center gap-8"
                >
                  <div
                    className="w-24 h-24 rounded-full flex flex-col items-center justify-center text-white font-bold text-sm z-10 shadow-lg"
                    style={{ backgroundColor: item.color }}
                  >
                    <div className="text-lg">{item.value}%</div>
                    <div className="text-xs opacity-90">{item.period}</div>
                  </div>
                  <div className="flex-1 bg-white p-6 rounded-xl shadow-lg border">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-bold text-lg">{item.period}</h4>
                        <p className="text-gray-600 text-sm">{item.status}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.value > 1 ? (
                          <ArrowUp className="h-5 w-5 text-green-500" />
                        ) : item.value > 0.5 ? (
                          <Minus className="h-5 w-5 text-yellow-500" />
                        ) : (
                          <ArrowDown className="h-5 w-5 text-red-500" />
                        )}
                        <div
                          className="text-2xl font-bold"
                          style={{ color: item.color }}
                        >
                          {item.value}%
                        </div>
                      </div>
                    </div>
                    {item.isForecast && (
                      <Badge
                        variant="outline"
                        className="bg-orange-50 text-orange-700"
                      >
                        Forecast
                      </Badge>
                    )}
                    {item.isHistorical && (
                      <Badge
                        variant="outline"
                        className="bg-blue-50 text-blue-700"
                      >
                        Historical Average
                      </Badge>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      );

    case "competitive-analysis":
      return (
        <div className="space-y-6">
          {data
            .sort((a, b) => b.value - a.value)
            .map((item: any, index: number) => (
              <motion.div
                key={index}
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "100%", opacity: 1 }}
                transition={{ delay: index * 0.3, duration: 1 }}
                className="space-y-4"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      #{item.rank}
                    </div>
                    <div>
                      <span className="font-bold text-lg">{item.country}</span>
                      <div className="text-sm text-gray-500">{item.period}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className="text-3xl font-bold"
                      style={{ color: item.color }}
                    >
                      {item.value}%
                    </div>
                    {item.gap !== 0 && (
                      <div
                        className={`text-sm ${
                          item.gap > 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {item.gap > 0 ? "+" : ""}
                        {item.gap.toFixed(1)}% vs Germany
                      </div>
                    )}
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-8">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(item.value * 40, 100)}%` }}
                    transition={{ delay: index * 0.3 + 0.5, duration: 1.2 }}
                    className="h-8 rounded-full flex items-center justify-end pr-4"
                    style={{ backgroundColor: item.color }}
                  >
                    <span className="text-white text-sm font-bold">
                      {item.value}%
                    </span>
                  </motion.div>
                </div>
              </motion.div>
            ))}
        </div>
      );

    case "dependency-timeline":
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.map((item: any, index: number) => (
              <motion.div
                key={index}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.2 }}
                className={`p-6 rounded-xl border-2 ${
                  item.isDecline
                    ? "border-red-200 bg-red-50"
                    : "border-blue-200 bg-blue-50"
                }`}
              >
                <div className="text-center">
                  <div
                    className="text-4xl font-bold mb-2"
                    style={{ color: item.color }}
                  >
                    {item.year}
                  </div>
                  <div
                    className="text-2xl font-bold mb-2"
                    style={{ color: item.color }}
                  >
                    {item.value}
                    {item.metric.includes("%")
                      ? "%"
                      : item.metric.includes("€B")
                      ? "B"
                      : ""}
                  </div>
                  <div className="text-sm font-semibold text-gray-700 mb-2">
                    {item.metric}
                  </div>
                  <div className="text-xs text-gray-600">
                    {item.significance}
                  </div>
                  {item.isDecline && (
                    <Badge variant="destructive" className="mt-2">
                      Declining
                    </Badge>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      );

    case "demographic-matrix":
      return (
        <div className="grid grid-cols-2 gap-6">
          {data.map((item: any, index: number) => (
            <motion.div
              key={index}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.2 }}
              className="text-center p-8 bg-gradient-to-br from-gray-50 to-white rounded-xl border-2 shadow-lg"
              style={{ borderColor: item.color + "40" }}
            >
              <div
                className="text-5xl font-bold mb-3"
                style={{ color: item.color }}
              >
                {typeof item.value === "number"
                  ? item.value.toLocaleString()
                  : item.value}
                {item.unit === "percent" ? "%" : ""}
              </div>
              <div className="text-lg font-bold text-gray-800 mb-2">
                {item.metric}
              </div>
              {item.status && (
                <div className="text-sm text-gray-600 mb-2">
                  {item.status} {item.since && `since ${item.since}`}
                </div>
              )}
              {item.source && (
                <div className="text-xs text-gray-500">
                  Source: {item.source}
                </div>
              )}
              <Badge
                variant="outline"
                className={`mt-3 ${
                  item.severity === "critical"
                    ? "border-red-500 text-red-700"
                    : "border-orange-500 text-orange-700"
                }`}
              >
                {item.severity === "critical" ? "Critical" : "High Impact"}
              </Badge>
            </motion.div>
          ))}
        </div>
      );

    case "risk-exposure":
      return (
        <div className="space-y-6">
          {data.map((item: any, index: number) => (
            <motion.div
              key={index}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.2 }}
              className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-white rounded-xl border-2 border-red-200 shadow-lg"
            >
              <div className="flex items-center gap-6">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl"
                  style={{ backgroundColor: item.color }}
                >
                  {item.company.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-xl">{item.company}</div>
                  <div className="text-sm text-gray-600">
                    {item.sector} • German Corporation
                  </div>
                  <Badge variant="destructive" className="mt-1">
                    High Risk
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-red-600">
                  {item.exposure}%
                </div>
                <div className="text-sm text-gray-600">China Revenue</div>
                <div className="text-xs text-red-600 mt-1">
                  Overexposure Risk
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      );

    case "energy-shock":
      return (
        <div className="space-y-8">
          <div className="relative">
            <div className="flex justify-between items-end h-64">
              {data.map((item: any, index: number) => (
                <motion.div
                  key={index}
                  initial={{ height: 0 }}
                  animate={{ height: `${(item.cost / 134) * 100}%` }}
                  transition={{ delay: index * 0.5, duration: 1 }}
                  className="flex-1 mx-4 rounded-t-lg flex flex-col justify-end items-center relative"
                  style={{ backgroundColor: item.color }}
                >
                  <div className="text-white font-bold text-lg mb-4">
                    {item.cost}
                  </div>
                  <div className="absolute -bottom-12 text-center w-full">
                    <div className="font-bold">{item.period}</div>
                    <div className="text-sm text-gray-600">{item.status}</div>
                  </div>
                  {item.increase && (
                    <div className="absolute -top-8 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                      +{item.increase}%
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
          <div className="text-center p-6 bg-red-50 rounded-xl border-2 border-red-200">
            <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <div className="text-lg font-bold text-red-800">
              Industrial Energy Cost Shock: +{data[1]?.increase}%
            </div>
            <div className="text-sm text-red-600 mt-2">
              Ukraine war triggered devastating competitiveness crisis
            </div>
          </div>
        </div>
      );

    default:
      return (
        <div className="text-center py-12 text-gray-500">
          <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <p>Advanced visualization for {type} coming soon...</p>
        </div>
      );
  }
};

interface AdvancedMergedVisualizationProps {
  story: Story;
  domain?: string;
}

export default function AdvancedMergedVisualization({
  story,
  domain,
}: AdvancedMergedVisualizationProps) {
  const [selectedChart, setSelectedChart] = useState<string>(
    "gdp-growth-trajectory"
  );
  const [activeTab, setActiveTab] = useState<string>("analysis");

  // Available chart types based on merged data structure
  const availableCharts = [
    {
      id: "gdp-growth-trajectory",
      name: "GDP Growth",
      icon: TrendingUp,
      category: "growth",
    },
    {
      id: "productivity-international",
      name: "Productivity Gap",
      icon: BarChart3,
      category: "productivity",
    },
    {
      id: "trade-dependency-evolution",
      name: "Trade Dependency",
      icon: Globe,
      category: "trade",
    },
    {
      id: "investment-collapse-analysis",
      name: "Investment Crisis",
      icon: Building,
      category: "investment",
    },
    {
      id: "demographic-pressure-matrix",
      name: "Demographics",
      icon: Users,
      category: "demographics",
    },
    {
      id: "corporate-china-risk",
      name: "China Risk",
      icon: AlertTriangle,
      category: "risk",
    },
    {
      id: "innovation-gap-analysis",
      name: "Innovation Gap",
      icon: Brain,
      category: "innovation",
    },
    {
      id: "energy-shock-impact",
      name: "Energy Shock",
      icon: Zap,
      category: "energy",
    },
  ];

  const currentChart = generateAdvancedChart(selectedChart, story, domain);

  if (!story.data) {
    return (
      <Card className="w-full">
        <CardContent className="p-8 text-center">
          <Info className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500">
            No visualization data available for this story.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full space-y-6">
      <Card className="w-full">
        <CardHeader className="pb-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-bold">
                {story.title}
              </CardTitle>
              <p className="text-gray-600 mt-2">{story.subtitle}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {story.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
              <TabsTrigger value="data">Raw Data</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
            </TabsList>

            <TabsContent value="analysis" className="space-y-6">
              {/* Chart Selection */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
                {availableCharts.map((chart) => {
                  const Icon = chart.icon;
                  const isAvailable =
                    generateAdvancedChart(chart.id, story, domain) !== null;
                  return (
                    <Button
                      key={chart.id}
                      variant={
                        selectedChart === chart.id ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => setSelectedChart(chart.id)}
                      disabled={!isAvailable}
                      className="flex flex-col items-center gap-2 h-auto py-3"
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-xs">{chart.name}</span>
                    </Button>
                  );
                })}
              </div>

              {/* Chart Display */}
              <AnimatePresence mode="wait">
                {currentChart && (
                  <motion.div
                    key={selectedChart}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card className="p-6">
                      <div className="mb-6">
                        <h3 className="text-2xl font-bold mb-2">
                          {currentChart.title}
                        </h3>
                        <p className="text-gray-600">{currentChart.subtitle}</p>
                      </div>
                      {renderAdvancedChart(currentChart)}
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Insights Panel */}
              {currentChart && (
                <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                  <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <Target className="h-5 w-5 text-blue-600" />
                    Key Insights
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentChart.insights.map((insight, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-3 p-3 bg-white rounded-lg shadow-sm"
                      >
                        <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                          {index + 1}
                        </div>
                        <p className="text-sm text-gray-700">{insight}</p>
                      </motion.div>
                    ))}
                  </div>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="data" className="space-y-4">
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4">Raw Data Structure</h3>
                <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm">
                  {JSON.stringify(story.data, null, 2)}
                </pre>
              </Card>
            </TabsContent>

            <TabsContent value="insights" className="space-y-4">
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4">Story Thesis</h3>
                <p className="text-gray-700 leading-relaxed">{story.thesis}</p>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4">Cross-Story Patterns</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <h4 className="font-bold text-red-800 mb-2">
                      Structural Challenges
                    </h4>
                    <ul className="text-sm text-red-700 space-y-1">
                      <li>• GDP growth collapsed from 1.5% to 0.2%</li>
                      <li>• Productivity lagging international peers</li>
                      <li>• Investment confidence evaporating</li>
                      <li>• Energy costs up 34% since 2021</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <h4 className="font-bold text-orange-800 mb-2">
                      Geopolitical Risks
                    </h4>
                    <ul className="text-sm text-orange-700 space-y-1">
                      <li>• China exports declined 10.2% in 2023</li>
                      <li>• Major corporations 35% exposed to China</li>
                      <li>• Trade dependency model obsolete</li>
                      <li>• Supply chain fragmentation accelerating</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
