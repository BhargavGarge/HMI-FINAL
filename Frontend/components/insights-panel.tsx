"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Brain,
  Target,
} from "lucide-react";

interface Indicator {
  indicator_id: string;
  name: string;
  unit: string;
}

interface InsightsPanelProps {
  indicator: Indicator;
  data: any[];
  chartType: string;
}

export function InsightsPanel({
  indicator,
  data,
  chartType,
}: InsightsPanelProps) {
  // Calculate insights from data
  const values = data.map((d) => d.value);
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);
  const avgValue = values.reduce((sum, val) => sum + val, 0) / values.length;
  const variance =
    values.reduce((sum, val) => sum + Math.pow(val - avgValue, 2), 0) /
    values.length;
  const stdDev = Math.sqrt(variance);

  const topPerformer = data.find((d) => d.value === maxValue);
  const lowPerformer = data.find((d) => d.value === minValue);

  const dataQuality = Math.min(
    100,
    Math.max(60, 100 - (stdDev / avgValue) * 100)
  );
  const trendDirection = values[values.length - 1] > values[0] ? "up" : "down";

  const insights = [
    {
      title: "Highest Performance",
      value: `${topPerformer?.country}: ${maxValue.toFixed(1)}${
        indicator.unit
      }`,
      type: "success",
      icon: TrendingUp,
    },
    {
      title: "Needs Attention",
      value: `${lowPerformer?.country}: ${minValue.toFixed(1)}${
        indicator.unit
      }`,
      type: "warning",
      icon: AlertCircle,
    },
    {
      title: "Average Performance",
      value: `${avgValue.toFixed(1)}${indicator.unit}`,
      type: "info",
      icon: Target,
    },
    {
      title: "Data Reliability",
      value: `${dataQuality.toFixed(0)}% Confidence`,
      type: dataQuality > 80 ? "success" : "warning",
      icon: CheckCircle,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Key Insights */}
      <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Brain className="h-5 w-5 text-purple-600" />
            Key Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {insights.map((insight, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  insight.type === "success"
                    ? "bg-green-100 text-green-600"
                    : insight.type === "warning"
                    ? "bg-yellow-100 text-yellow-600"
                    : "bg-blue-100 text-blue-600"
                }`}
              >
                <insight.icon className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm text-gray-800">
                  {insight.title}
                </p>
                <p className="text-xs text-gray-600 mt-1">{insight.value}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Statistical Summary */}
      <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg">Statistical Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Range Spread</span>
              <span className="font-semibold">
                {(maxValue - minValue).toFixed(1)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Standard Deviation</span>
              <span className="font-semibold">{stdDev.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Data Points</span>
              <span className="font-semibold">{data.length}</span>
            </div>
          </div>

          <div className="pt-3 border-t">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Data Quality Score</span>
              <span className="text-sm font-bold">
                {dataQuality.toFixed(0)}%
              </span>
            </div>
            <Progress value={dataQuality} className="h-2" />
            <p className="text-xs text-gray-500 mt-1">
              Based on consistency and distribution patterns
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Research Context */}
      <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg">Research Context</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-blue-800 mb-1">
                Visualization Type
              </p>
              <p className="text-xs text-blue-600">
                {chartType.charAt(0).toUpperCase() + chartType.slice(1)} chart
                selected for{" "}
                {chartType === "bar"
                  ? "comparative analysis"
                  : chartType === "line"
                  ? "trend analysis"
                  : chartType === "pie"
                  ? "distribution analysis"
                  : "pattern analysis"}
              </p>
            </div>

            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-sm font-medium text-green-800 mb-1">
                Academic Application
              </p>
              <p className="text-xs text-green-600">
                This indicator is commonly used in economic research for policy
                analysis and comparative studies across different regions and
                time periods.
              </p>
            </div>

            <div className="p-3 bg-purple-50 rounded-lg">
              <p className="text-sm font-medium text-purple-800 mb-1">
                Interpretation Guide
              </p>
              <p className="text-xs text-purple-600">
                Higher values generally indicate{" "}
                {indicator.unit.includes("%")
                  ? "better performance"
                  : "increased activity"}{" "}
                in this metric. Consider regional context when analyzing
                results.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
