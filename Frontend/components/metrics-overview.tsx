"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Database, FileText, BarChart3, Globe } from "lucide-react";

interface DashboardSummary {
  total_indicators: { count: number };
  total_documents: { count: number };
  total_observations: { count: number };
  total_visuals: { count: number };
  domains: Array<{ domain: string; count: number }>;
  visual_types: Array<{ type: string; count: number }>;
}

interface MetricsOverviewProps {
  dashboardSummary: DashboardSummary | null;
}

export function MetricsOverview({ dashboardSummary }: MetricsOverviewProps) {
  if (!dashboardSummary) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card
            key={i}
            className="bg-white/60 backdrop-blur-sm border-0 shadow-lg"
          >
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const metrics = [
    {
      title: "Economic Indicators",
      value: dashboardSummary.total_indicators.count.toLocaleString(),
      description: "Available for analysis",
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      change: "+12% this quarter",
    },
    {
      title: "Research Documents",
      value: dashboardSummary.total_documents.count.toLocaleString(),
      description: "Academic publications",
      icon: FileText,
      color: "text-green-600",
      bgColor: "bg-green-50",
      change: "+8 new studies",
    },
    {
      title: "Data Observations",
      value: dashboardSummary.total_observations.count.toLocaleString(),
      description: "Total data points",
      icon: Database,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      change: "99.2% accuracy",
    },
    {
      title: "Visual Analytics",
      value: dashboardSummary.total_visuals.count.toLocaleString(),
      description: "Charts and graphs",
      icon: BarChart3,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      change: "Interactive",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Main Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <Card
            key={index}
            className="bg-white/60 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {metric.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {metric.value}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {metric.description}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 ${metric.bgColor} rounded-xl flex items-center justify-center`}
                >
                  <metric.icon className={`h-6 w-6 ${metric.color}`} />
                </div>
              </div>
              <div className="mt-4">
                <Badge variant="secondary" className="text-xs">
                  {metric.change}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Research Domains */}
      <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-blue-600" />
            Research Domains Coverage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {dashboardSummary.domains.map((domain, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-sm text-gray-800">
                    {domain.domain}
                  </p>
                  <p className="text-xs text-gray-500">Research Area</p>
                </div>
                <Badge variant="outline" className="bg-white">
                  {domain.count}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
