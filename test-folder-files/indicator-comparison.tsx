"use client";

import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

interface IndicatorComparisonProps {
  observations: Observation[];
  indicators: Indicator[];
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

export function IndicatorComparison({
  observations,
  indicators,
}: IndicatorComparisonProps) {
  const analysisData = useMemo(() => {
    if (!observations.length || indicators.length < 2) return null;

    // Calculate correlations between indicators
    const correlations: { [key: string]: number } = {};
    const statistics: { [key: string]: any } = {};

    indicators.forEach((indicator) => {
      const indicatorObs = observations.filter(
        (obs) => obs.indicator_id === indicator.id
      );
      const values = indicatorObs.map((obs) => obs.value);

      statistics[indicator.name] = {
        count: values.length,
        mean:
          values.length > 0
            ? values.reduce((a, b) => a + b, 0) / values.length
            : 0,
        min: values.length > 0 ? Math.min(...values) : 0,
        max: values.length > 0 ? Math.max(...values) : 0,
        std:
          values.length > 1
            ? Math.sqrt(
                values.reduce(
                  (acc, val) =>
                    acc +
                    Math.pow(val - statistics[indicator.name]?.mean || 0, 2),
                  0
                ) / values.length
              )
            : 0,
      };
    });

    // Calculate correlation matrix
    for (let i = 0; i < indicators.length; i++) {
      for (let j = i + 1; j < indicators.length; j++) {
        const ind1 = indicators[i];
        const ind2 = indicators[j];

        const obs1 = observations.filter((obs) => obs.indicator_id === ind1.id);
        const obs2 = observations.filter((obs) => obs.indicator_id === ind2.id);

        // Find common years/countries for correlation
        const commonPoints: { x: number; y: number }[] = [];

        obs1.forEach((o1) => {
          const matching = obs2.find(
            (o2) => o2.year === o1.year && o2.country === o1.country
          );
          if (matching) {
            commonPoints.push({ x: o1.value, y: matching.value });
          }
        });

        if (commonPoints.length > 1) {
          const correlation = calculateCorrelation(commonPoints);
          correlations[`${ind1.name} vs ${ind2.name}`] = correlation;
        }
      }
    }

    // Time series comparison data
    const timeSeriesData = observations.reduce((acc: any, obs) => {
      const indicator = indicators.find((ind) => ind.id === obs.indicator_id);
      if (!indicator) return acc;

      const existing = acc.find((item: any) => item.year === obs.year);
      if (existing) {
        existing[indicator.name] = (existing[indicator.name] || 0) + obs.value;
        existing[`${indicator.name}_count`] =
          (existing[`${indicator.name}_count`] || 0) + 1;
      } else {
        acc.push({
          year: obs.year,
          [indicator.name]: obs.value,
          [`${indicator.name}_count`]: 1,
        });
      }
      return acc;
    }, []);

    // Calculate averages for time series
    timeSeriesData.forEach((item: any) => {
      indicators.forEach((indicator) => {
        if (item[`${indicator.name}_count`] > 0) {
          item[indicator.name] =
            item[indicator.name] / item[`${indicator.name}_count`];
        }
        delete item[`${indicator.name}_count`];
      });
    });

    timeSeriesData.sort((a: any, b: any) => a.year - b.year);

    return {
      correlations,
      statistics,
      timeSeriesData,
    };
  }, [observations, indicators]);

  const calculateCorrelation = (points: { x: number; y: number }[]) => {
    const n = points.length;
    if (n < 2) return 0;

    const sumX = points.reduce((sum, p) => sum + p.x, 0);
    const sumY = points.reduce((sum, p) => sum + p.y, 0);
    const sumXY = points.reduce((sum, p) => sum + p.x * p.y, 0);
    const sumX2 = points.reduce((sum, p) => sum + p.x * p.x, 0);
    const sumY2 = points.reduce((sum, p) => sum + p.y * p.y, 0);

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt(
      (n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY)
    );

    return denominator === 0 ? 0 : numerator / denominator;
  };

  if (!analysisData || indicators.length < 2) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Multi-Indicator Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Please select at least 2 indicators to perform comparison analysis.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Time Series Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Time Series Comparison</CardTitle>
          <p className="text-sm text-muted-foreground">
            Compare trends across selected indicators over time
          </p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={analysisData.timeSeriesData}>
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
        </CardContent>
      </Card>

      {/* Statistical Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Statistical Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {indicators.map((indicator, index) => {
              const stats = analysisData.statistics[indicator.name];
              return (
                <div key={indicator.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{indicator.name}</h4>
                    <Badge variant="outline">{indicator.category}</Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Count:</span>
                      <span className="ml-2 font-medium">{stats.count}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Mean:</span>
                      <span className="ml-2 font-medium">
                        {stats.mean.toFixed(2)}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Range:</span>
                      <span className="ml-2 font-medium">
                        {stats.min.toFixed(2)} - {stats.max.toFixed(2)}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Std Dev:</span>
                      <span className="ml-2 font-medium">
                        {stats.std.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Correlation Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Correlation Analysis</CardTitle>
          <p className="text-sm text-muted-foreground">
            Statistical relationships between indicators
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(analysisData.correlations).map(
              ([pair, correlation]) => (
                <div
                  key={pair}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded"
                >
                  <span className="font-medium">{pair}</span>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        Math.abs(correlation) > 0.7
                          ? "default"
                          : Math.abs(correlation) > 0.3
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {correlation.toFixed(3)}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {Math.abs(correlation) > 0.7
                        ? "Strong"
                        : Math.abs(correlation) > 0.3
                        ? "Moderate"
                        : "Weak"}
                    </span>
                  </div>
                </div>
              )
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
