"use client";

import { CardDescription } from "@/components/ui/card";

import React from "react";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  User,
  TrendingUp,
  Activity,
  History,
  Calendar,
  Zap,
  Users,
  Building2,
  Home,
  Briefcase,
  Shield,
  Globe,
  Factory,
  Lightbulb,
  AlertTriangle,
  TrendingDown,
  Euro,
  GraduationCap,
  Heart,
  Leaf,
  Baby,
} from "lucide-react";
import type { Story } from "@/story-card-data/card-data";
import { DynamicChart } from "./dynamic-chart";

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

// Stories that should skip timeline analysis and show all charts directly
const DIRECT_VISUALIZATION_STORIES = [
  "unequal-burdens-gender-gaps",
  "germany-satisfaction-gap",
  "germany-education-paradox",
  "germany-trust-deficit",
  "germany-subsidy-mirage",
  "germany-misinformation-democracy",
  "disconnected-in-the-countryside",
  "story-10-electric-freight",
  "jobless-but-not-hopeless",
];

export function StoryDetailView({
  story,
  onBack,
}: {
  story: Story;
  onBack: () => void;
}) {
  const [chartData, setChartData] = useState<ProcessedChartData[]>([]);

  useEffect(() => {
    const processedData = processAllChartData(story);
    setChartData(processedData);
  }, [story]);

  const processAllChartData = (story: Story): ProcessedChartData[] => {
    const allCharts: ProcessedChartData[] = [];

    // Process visual_data if it exists
    if (story.visual_data) {
      const visualCharts = story.visual_data.map((dataset, index) => {
        const data = dataset.data_sample;
        const keys = data.length > 0 ? Object.keys(data[0]) : [];

        const xAxisKey =
          keys.find(
            (key) =>
              key.toLowerCase().includes("quarter") ||
              key.toLowerCase().includes("period") ||
              key.toLowerCase().includes("year") ||
              key.toLowerCase().includes("decile") ||
              key.toLowerCase().includes("income") ||
              key.toLowerCase().includes("scenario")
          ) || keys[0];

        const yAxisKeys = keys.filter(
          (key) =>
            key !== xAxisKey &&
            data.some(
              (row) => typeof row[key] === "number" && row[key] !== null
            )
        );

        return {
          id: `visual-chart-${index}`,
          title: generateChartTitle(dataset.source_file),
          description: dataset.description,
          chartType: dataset.chart_type || inferChartType(data, yAxisKeys),
          timePeriod: dataset.time_period || "present",
          data,
          xAxisKey,
          yAxisKeys,
        };
      });
      allCharts.push(...visualCharts);
    }

    // Process indicators if they exist
    if (story.indicators) {
      const indicatorCharts = story.indicators.map((indicator, index) => {
        const data = indicator.data;
        const keys = data.length > 0 ? Object.keys(data[0]) : [];

        const xAxisKey =
          keys.find(
            (key) =>
              key.toLowerCase().includes("region") ||
              key.toLowerCase().includes("model") ||
              key.toLowerCase().includes("decile") ||
              key.toLowerCase().includes("scenario") ||
              key.toLowerCase().includes("employment")
          ) || keys[0];

        const yAxisKeys = keys.filter(
          (key) =>
            key !== xAxisKey &&
            data.some(
              (row) => typeof row[key] === "number" && row[key] !== null
            )
        );

        return {
          id: `indicator-chart-${index}`,
          title: indicator.name,
          description: `${indicator.name} (${indicator.unit})`,
          chartType: inferChartType(data, yAxisKeys),
          timePeriod: "present",
          data,
          xAxisKey,
          yAxisKeys,
        };
      });
      allCharts.push(...indicatorCharts);
    }

    // Process sections with charts if they exist
    if (story.sections) {
      story.sections.forEach((section, sectionIndex) => {
        if (section.charts) {
          const sectionCharts = section.charts.map((chart, chartIndex) => {
            const data = chart.data;
            const keys = data.length > 0 ? Object.keys(data[0]) : [];

            const xAxisKey =
              keys.find(
                (key) =>
                  key.toLowerCase().includes("scenario") ||
                  key.toLowerCase().includes("decile") ||
                  key.toLowerCase().includes("income") ||
                  key.toLowerCase().includes("model")
              ) || keys[0];

            const yAxisKeys = keys.filter(
              (key) =>
                key !== xAxisKey &&
                data.some(
                  (row) => typeof row[key] === "number" && row[key] !== null
                )
            );

            return {
              id: `section-chart-${sectionIndex}-${chartIndex}`,
              title: chart.title,
              description: `Chart from: ${
                section.heading || section.title || "Section"
              }`,
              chartType: chart.type || inferChartType(data, yAxisKeys),
              timePeriod: determineTimePeriod(
                section.heading || section.title || ""
              ),
              data,
              xAxisKey,
              yAxisKeys,
            };
          });
          allCharts.push(...sectionCharts);
        }

        // Process sections with embedded data if they exist
        if (section.data) {
          const data = section.data.values;
          const keys = data.length > 0 ? Object.keys(data[0]) : [];

          const xAxisKey =
            keys.find(
              (key) =>
                key.toLowerCase().includes("year") ||
                key.toLowerCase().includes("quarter") ||
                key.toLowerCase().includes("period")
            ) || keys[0];

          const yAxisKeys = keys.filter(
            (key) =>
              key !== xAxisKey &&
              data.some(
                (row) => typeof row[key] === "number" && row[key] !== null
              )
          );

          if (yAxisKeys.length > 0) {
            allCharts.push({
              id: `section-data-${sectionIndex}`,
              title: section.heading || "Section Data",
              description: `Data from: ${section.heading || "Section"}`,
              chartType: inferChartType(data, yAxisKeys),
              timePeriod: determineTimePeriod(section.heading || ""),
              data,
              xAxisKey,
              yAxisKeys,
            });
          }
        }
      });
    }

    return allCharts;
  };

  const determineTimePeriod = (heading: string): string => {
    const lowerHeading = heading.toLowerCase();
    if (lowerHeading.includes("past") || lowerHeading.includes("before"))
      return "past";
    if (
      lowerHeading.includes("future") ||
      lowerHeading.includes("ahead") ||
      lowerHeading.includes("projected")
    )
      return "future";
    return "present";
  };

  const generateChartTitle = (sourceFile: string): string => {
    return sourceFile
      .replace(/^fig_?\d*_?/, "")
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
    if (!story.sections) return null;

    const periodMap: Record<string, string[]> = {
      past: ["past", "before", "I. The Past"],
      present: ["present", "current", "II. The Present"],
      future: ["future", "ahead", "projected", "III. The Future"],
    };

    return story.sections.find((section) => {
      const heading = section.heading || section.title || "";
      return periodMap[period].some((keyword) =>
        heading.toLowerCase().includes(keyword.toLowerCase())
      );
    });
  };

  const getActorIcon = (actorName: string): React.ReactNode => {
    const iconMap: Record<string, React.ReactNode> = {
      "Low-income households": <Home className="w-6 h-6" />,
      "Low-income families": <Home className="w-6 h-6" />,
      "Energy policymakers": <Briefcase className="w-6 h-6" />,
      "Policy makers": <Briefcase className="w-6 h-6" />,
      "Policy Makers": <Briefcase className="w-6 h-6" />,
      "German government": <Building2 className="w-6 h-6" />,
      "French government": <Shield className="w-6 h-6" />,
      "EU institutions": <Globe className="w-6 h-6" />,
      "EU households": <Globe className="w-6 h-6" />,
      "Energy companies": <Factory className="w-6 h-6" />,
      "Women in executive roles": <Heart className="w-6 h-6" />,
      "Women in Europe": <Heart className="w-6 h-6" />,
      "Corporate boards": <Building2 className="w-6 h-6" />,
      Employers: <Briefcase className="w-6 h-6" />,
      "Young Parents": <Baby className="w-6 h-6" />,
      "Federal Family Ministry": <Building2 className="w-6 h-6" />,
      "Childcare Providers": <Users className="w-6 h-6" />,
    };

    return iconMap[actorName] || <Users className="w-6 h-6" />;
  };

  const getActorColor = (index: number): { color: string; bgColor: string } => {
    const colors = [
      { color: "text-red-700", bgColor: "bg-red-50 border-red-200" },
      { color: "text-blue-700", bgColor: "bg-blue-50 border-blue-200" },
      { color: "text-purple-700", bgColor: "bg-purple-50 border-purple-200" },
      { color: "text-green-700", bgColor: "bg-green-50 border-green-200" },
      { color: "text-indigo-700", bgColor: "bg-indigo-50 border-indigo-200" },
      { color: "text-orange-700", bgColor: "bg-orange-50 border-orange-200" },
    ];

    return colors[index % colors.length];
  };

  const getKeyInsights = (story: Story) => {
    if (story.id === "germany-france-energy-puzzle") {
      return [
        {
          type: "warning",
          icon: <AlertTriangle className="w-5 h-5" />,
          title: "Energy Burden Inequality",
          description:
            "Lowest income households spend up to 11% of income on heating costs, while highest earners spend only 4.6%",
          color: "red",
        },
        {
          type: "trend",
          icon: <TrendingDown className="w-5 h-5" />,
          title: "Consumption Decline",
          description:
            "German private consumption dropped significantly in 2022-2023, indicating eroded household confidence",
          color: "orange",
        },
        {
          type: "insight",
          icon: <Home className="w-5 h-5" />,
          title: "Housing Inequality",
          description:
            "Low-income tenants disproportionately live in energy-inefficient buildings (16% in very inefficient housing)",
          color: "purple",
        },
        {
          type: "recovery",
          icon: <Euro className="w-5 h-5" />,
          title: "Economic Recovery",
          description:
            "German GDP expected to recover gradually with output gap closing by 2026, but consumption remains divided",
          color: "green",
        },
      ];
    }

    if (story.id === "unequal-burdens-gender-gaps") {
      return [
        {
          type: "warning",
          icon: <Heart className="w-5 h-5" />,
          title: "Gender Income Gap",
          description:
            "Women face persistent income disparities and reduced access to energy-efficient housing",
          color: "red",
        },
        {
          type: "insight",
          icon: <Home className="w-5 h-5" />,
          title: "Housing Vulnerability",
          description:
            "Single mothers and elderly women have reduced access to energy-efficient homes",
          color: "purple",
        },
      ];
    }

    if (story.title?.includes("Educational Inequity")) {
      return [
        {
          type: "warning",
          icon: <GraduationCap className="w-5 h-5" />,
          title: "Educational Scars",
          description:
            "COVID-19 pandemic has left lasting impacts on skill development and educational inequality",
          color: "red",
        },
        {
          type: "insight",
          icon: <Users className="w-5 h-5" />,
          title: "Childcare Burden",
          description:
            "Parents, especially women, work fewer hours due to ongoing childcare responsibilities",
          color: "orange",
        },
      ];
    }

    if (story.id === "carbon-costs-compensation-germany") {
      return [
        {
          type: "warning",
          icon: <Leaf className="w-5 h-5" />,
          title: "Carbon Pricing Impact",
          description:
            "Lower-income households face disproportionate burden from carbon pricing policies",
          color: "red",
        },
        {
          type: "insight",
          icon: <Euro className="w-5 h-5" />,
          title: "Climate Dividend Relief",
          description:
            "Climate dividend transfers help offset carbon costs but reduced support increases inequality",
          color: "green",
        },
      ];
    }

    if (story.id === "toddler-gap-family-policy") {
      return [
        {
          type: "warning",
          icon: <Baby className="w-5 h-5" />,
          title: "Childcare Access Gap",
          description:
            "Parents with children report significantly lower satisfaction with institutional support",
          color: "red",
        },
        {
          type: "insight",
          icon: <Users className="w-5 h-5" />,
          title: "Staffing Crisis",
          description:
            "Chronic under-staffing in early childhood facilities leads to group closures and lower quality",
          color: "orange",
        },
        {
          type: "trend",
          icon: <TrendingDown className="w-5 h-5" />,
          title: "Parental Leave Underuse",
          description:
            "Despite reforms, uptake remains low especially among fathers and low-income households",
          color: "purple",
        },
      ];
    }

    return [
      {
        type: "insight",
        icon: <Lightbulb className="w-5 h-5" />,
        title: "Key Finding",
        description:
          "This story reveals important trends in the data that require attention",
        color: "blue",
      },
    ];
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
                {section.heading || section.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{section.content || section.text}</p>
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

  const renderAllChartsSection = () => {
    if (chartData.length === 0) return null;

    return (
      <div className="mt-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-teal-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <TrendingUp className="w-4 h-4" />
            Data Visualizations
          </div>
          <h3 className="text-3xl font-bold text-slate-900 mb-4">
            Key Data Insights
          </h3>
          <p className="text-slate-600 text-lg">
            Explore the data that tells this story
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {chartData.map((chart) => (
            <Card
              key={chart.id}
              className="shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
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
      </div>
    );
  };

  // Check if this story should use direct visualization
  const shouldUseDirectVisualization =
    story.id && DIRECT_VISUALIZATION_STORIES.includes(story.id);

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
            {story.category && (
              <Badge
                variant="secondary"
                className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 border-0 font-medium"
              >
                {story.category}
              </Badge>
            )}
            <div className="flex items-center text-sm text-slate-500 gap-4">
              {story.author && (
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  <span>{story.author}</span>
                </div>
              )}
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
            {story.title}
          </h1>

          {story.subtitle && (
            <h2 className="text-xl md:text-2xl text-slate-600 mb-8 font-medium leading-relaxed">
              {story.subtitle}
            </h2>
          )}
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

        {/* Key Actors */}
        {story.actors && story.actors.length > 0 && (
          <div className="mb-12">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <Users className="w-4 h-4" />
                Key Stakeholders
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Who's Involved
              </h3>
              <p className="text-slate-600">
                The main actors shaping this story and driving change
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {story.actors.map((actor, index) => {
                const actorIcon = getActorIcon(actor);
                const { color, bgColor } = getActorColor(index);

                return (
                  <Card
                    key={index}
                    className={`border-2 ${bgColor} shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center text-center space-y-4">
                        <div
                          className={`p-4 rounded-full ${bgColor
                            .replace("bg-", "bg-")
                            .replace("-50", "-100")} ${color}`}
                        >
                          {actorIcon}
                        </div>
                        <div>
                          <h4 className={`font-bold text-lg mb-2 ${color}`}>
                            {actor}
                          </h4>
                          <p className="text-sm text-slate-600 leading-relaxed">
                            Key stakeholder in this policy area
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className="border-slate-300 text-slate-700 bg-slate-50"
                        >
                          STAKEHOLDER
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Actor Network Visualization */}
            <div className="mt-8">
              <Card className="border-0 shadow-lg bg-gradient-to-r from-slate-50 to-purple-50">
                <CardContent className="p-8">
                  <div className="text-center">
                    <h4 className="text-lg font-semibold text-slate-900 mb-4">
                      Stakeholder Network
                    </h4>
                    <div className="flex flex-wrap justify-center items-center gap-4">
                      {story.actors.map((actor, index) => {
                        const actorIcon = getActorIcon(actor);
                        const { color, bgColor } = getActorColor(index);

                        return (
                          <div key={index} className="flex items-center">
                            <div
                              className={`p-2 rounded-full ${bgColor
                                .replace("bg-", "bg-")
                                .replace("-50", "-100")} ${color}`}
                            >
                              {React.cloneElement(
                                actorIcon as React.ReactElement,
                                { className: "w-4 h-4" }
                              )}
                            </div>
                            {index < story.actors.length - 1 && (
                              <div className="w-8 h-0.5 bg-gradient-to-r from-purple-300 to-pink-300 mx-2"></div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <p className="text-sm text-slate-500 mt-4">
                      Interconnected stakeholders driving policy and social
                      outcomes
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Key Insights */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Lightbulb className="w-4 h-4" />
              Key Insights
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              What the Data Reveals
            </h3>
            <p className="text-slate-600">
              Critical findings and implications from our analysis
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {getKeyInsights(story).map((insight, index) => {
              const colorClasses = {
                red: "bg-red-50 border-red-200 text-red-800",
                orange: "bg-orange-50 border-orange-200 text-orange-800",
                purple: "bg-purple-50 border-purple-200 text-purple-800",
                green: "bg-green-50 border-green-200 text-green-800",
                blue: "bg-blue-50 border-blue-200 text-blue-800",
              };

              return (
                <Card
                  key={index}
                  className={`border-2 ${
                    colorClasses[insight.color as keyof typeof colorClasses]
                  } shadow-lg`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div
                        className={`p-3 rounded-full ${
                          insight.color === "red"
                            ? "bg-red-100"
                            : insight.color === "orange"
                            ? "bg-orange-100"
                            : insight.color === "purple"
                            ? "bg-purple-100"
                            : insight.color === "green"
                            ? "bg-green-100"
                            : "bg-blue-100"
                        }`}
                      >
                        {insight.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg mb-2">
                          {insight.title}
                        </h4>
                        <p className="text-sm leading-relaxed">
                          {insight.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Timeline Analysis or All Charts - Conditional Rendering */}
        {shouldUseDirectVisualization ? (
          renderAllChartsSection()
        ) : story.visual_data && story.sections ? (
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
        ) : (
          renderAllChartsSection()
        )}

        {/* Story Sections */}
        {story.sections && story.sections.length > 0 && (
          <div className="mt-16 space-y-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Story Analysis
              </h3>
            </div>

            {story.sections.map((section, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl text-slate-900">
                    {section.heading || section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700 leading-relaxed">
                    {section.content || section.text}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-500">
              {story.author && story.publishDate && (
                <>
                  Published by {story.author} •{" "}
                  {new Date(story.publishDate).toLocaleDateString()}
                </>
              )}
              {!story.author && !story.publishDate && "Data Story Analysis"}
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
