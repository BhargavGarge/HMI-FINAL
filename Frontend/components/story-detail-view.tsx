"use client";

import { CardDescription } from "@/components/ui/card";

import type React from "react";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Clock,
  User,
  TrendingUp,
  Activity,
  History,
  Calendar,
  Zap,
} from "lucide-react";
import type { Story } from "@/story-card-data/card-data";
import { DynamicChart } from "@/components/dynamic-chart";

interface ProcessedChartData {
  id: string;
  title: string;
  description: string;
  chartType: string;
  timePeriod: string;
  data: Array<Record<string, any>>;
  xAxisKey: string;
  yAxisKeys: string[];
}

export function StoryDetailView({
  story,
  onBack,
}: {
  story: Story;
  onBack: () => void;
}) {
  const [chartData, setChartData] = useState<ProcessedChartData[]>([]);

  useEffect(() => {
    if (story.visual_data) {
      const processedData = processChartData(story);
      setChartData(processedData);
    }
  }, [story]);

  const processChartData = (story: Story): ProcessedChartData[] => {
    if (!story.visual_data) return [];

    return story.visual_data.map((dataset, index) => {
      const data = dataset.data_sample;
      const keys = data.length > 0 ? Object.keys(data[0]) : [];

      // Determine x-axis key (usually time-based)
      const xAxisKey =
        keys.find(
          (key) =>
            key.toLowerCase().includes("quarter") ||
            key.toLowerCase().includes("period") ||
            key.toLowerCase().includes("year") ||
            key.toLowerCase().includes("decile") ||
            key.toLowerCase().includes("income")
        ) || keys[0];

      // Determine y-axis keys (numeric values, excluding x-axis)
      const yAxisKeys = keys.filter(
        (key) =>
          key !== xAxisKey &&
          data.some((row) => typeof row[key] === "number" && row[key] !== null)
      );

      return {
        id: `chart-${index}`,
        title: generateChartTitle(dataset.source_file),
        description: dataset.description,
        chartType: dataset.chart_type || inferChartType(data, yAxisKeys),
        timePeriod: dataset.time_period || "present",
        data,
        xAxisKey,
        yAxisKeys,
      };
    });
  };

  const generateChartTitle = (sourceFile: string): string => {
    return sourceFile
      .replace(/^fig_\d*_?/, "")
      .replace(/_data\.csv$/, "")
      .replace(/_/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const inferChartType = (data: any[], yAxisKeys: string[]): string => {
    if (yAxisKeys.length === 1) {
      return "bar";
    } else if (yAxisKeys.length > 1) {
      return "line";
    }
    return "bar";
  };

  const getChartsByTimePeriod = (period: string) => {
    return chartData.filter((chart) => chart.timePeriod === period);
  };

  const getSectionByTimePeriod = (period: string) => {
    const periodMap: Record<string, string> = {
      past: "I. The Past",
      present: "II. The Present",
      future: "III. The Future",
    };

    return story.sections.find((section) =>
      section.heading.includes(periodMap[period])
    );
  };

  const renderTimePeriodContent = (
    period: string,
    title: string,
    icon: React.ReactNode
  ) => {
    const charts = getChartsByTimePeriod(period);
    const section = getSectionByTimePeriod(period);

    return (
      <div className="space-y-6">
        {section && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {icon}
                {section.heading}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{section.content}</p>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {charts.map((chart) => (
            <Card key={chart.id}>
              <CardHeader>
                <CardTitle className="text-lg">{chart.title}</CardTitle>
                <CardDescription>{chart.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <DynamicChart chartData={chart} />
              </CardContent>
            </Card>
          ))}
        </div>

        {charts.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">
                No data available for this time period
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">
      {/* Header */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-slate-200 z-10">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={onBack}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Stories
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Title Section */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Badge
              variant="secondary"
              className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 border-0 font-medium"
            >
              {story.category}
            </Badge>
            <div className="flex items-center text-sm text-slate-500 gap-4">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{story.readTime}</span>
              </div>
              <div className="flex items-center gap-1">
                <User className="w-3 h-3" />
                <span>{story.author}</span>
              </div>
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
            {story.title}
          </h1>

          <h2 className="text-xl md:text-2xl text-slate-600 mb-8 font-medium leading-relaxed">
            {story.subtitle}
          </h2>
        </div>

        {/* Introduction */}
        <div className="mb-12">
          <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Activity className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">
                    Executive Summary
                  </h3>
                  <p className="text-lg text-slate-700 leading-relaxed">
                    {story.intro}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Timeline Analysis */}
        {story.visual_data && (
          <div className="mt-16">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <TrendingUp className="w-4 h-4" />
                Timeline Analysis
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-4">
                Past • Present • Future
              </h3>
              <p className="text-slate-600 text-lg">
                Explore data across different time periods to understand the
                complete story
              </p>
            </div>

            <Tabs defaultValue="past" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="past" className="flex items-center gap-2">
                  <History className="w-4 h-4" />
                  The Past
                </TabsTrigger>
                <TabsTrigger
                  value="present"
                  className="flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  The Present
                </TabsTrigger>
                <TabsTrigger value="future" className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  The Future
                </TabsTrigger>
              </TabsList>

              <TabsContent value="past">
                {renderTimePeriodContent(
                  "past",
                  "The Past",
                  <History className="w-5 h-5" />
                )}
              </TabsContent>

              <TabsContent value="present">
                {renderTimePeriodContent(
                  "present",
                  "The Present",
                  <Calendar className="w-5 h-5" />
                )}
              </TabsContent>

              <TabsContent value="future">
                {renderTimePeriodContent(
                  "future",
                  "The Future",
                  <Zap className="w-5 h-5" />
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-500">
              Published by {story.author} •{" "}
              {new Date(story.publishDate).toLocaleDateString()}
            </div>
            <Button
              onClick={onBack}
              variant="outline"
              className="hover:bg-slate-100 bg-transparent"
            >
              Back to Stories
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
