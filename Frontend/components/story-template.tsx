"use client";
import { useState } from "react";
import type React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  TrendingUp,
  Users,
  Lightbulb,
  Target,
  BarChart3,
  PieChart,
} from "lucide-react";

type StoryTemplate = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  sections: string[];
  useCase: string;
  estimatedTime: number;
};

export function StoryTemplates({
  onSelectTemplate,
}: {
  onSelectTemplate: (template: StoryTemplate) => void;
}) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const templates: StoryTemplate[] = [
    {
      id: "trend-analysis",
      title: "Trend Analysis Story",
      description:
        "Deep dive into data trends over time, identifying patterns and inflection points",
      icon: <TrendingUp className="h-6 w-6" />,
      sections: [
        "Historical Context",
        "Trend Identification",
        "Pattern Analysis",
        "Future Implications",
      ],
      useCase: "Perfect for showing how indicators have evolved over time",
      estimatedTime: 6,
    },
    {
      id: "comparative-analysis",
      title: "Comparative Analysis",
      description:
        "Compare different metrics or categories to identify leaders and laggards",
      icon: <BarChart3 className="h-6 w-6" />,
      sections: [
        "Baseline Comparison",
        "Performance Rankings",
        "Gap Analysis",
        "Recommendations",
      ],
      useCase: "Ideal for understanding relative performance across categories",
      estimatedTime: 5,
    },
    {
      id: "impact-story",
      title: "Impact & Implications",
      description:
        "Focus on the real-world impact and policy implications of the data",
      icon: <Target className="h-6 w-6" />,
      sections: [
        "Current Situation",
        "Impact Assessment",
        "Stakeholder Effects",
        "Policy Recommendations",
      ],
      useCase: "Best for connecting data to real-world outcomes",
      estimatedTime: 7,
    },
    {
      id: "distribution-story",
      title: "Distribution Analysis",
      description:
        "Explore how values are distributed across different categories or segments",
      icon: <PieChart className="h-6 w-6" />,
      sections: [
        "Distribution Overview",
        "Dominant Categories",
        "Outlier Analysis",
        "Balance Assessment",
      ],
      useCase: "Great for understanding composition and balance",
      estimatedTime: 4,
    },
    {
      id: "problem-solution",
      title: "Problem-Solution Narrative",
      description:
        "Identify challenges in the data and propose evidence-based solutions",
      icon: <Lightbulb className="h-6 w-6" />,
      sections: [
        "Problem Identification",
        "Root Cause Analysis",
        "Solution Framework",
        "Implementation Path",
      ],
      useCase: "Perfect for actionable insights and recommendations",
      estimatedTime: 8,
    },
    {
      id: "stakeholder-perspective",
      title: "Stakeholder Perspective",
      description: "Tell the story from different stakeholder viewpoints",
      icon: <Users className="h-6 w-6" />,
      sections: [
        "Citizen Impact",
        "Business Implications",
        "Government Perspective",
        "International Context",
      ],
      useCase: "Ideal for understanding multi-faceted impacts",
      estimatedTime: 6,
    },
  ];

  const handleSelectTemplate = (template: StoryTemplate) => {
    setSelectedTemplate(template.id);
    onSelectTemplate(template);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2 text-blue-600" />
            Story Templates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-6">
            Choose a story template to structure your data narrative. Each
            template provides a different perspective and framework for
            presenting your insights.
          </p>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {templates.map((template) => (
              <Card
                key={template.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedTemplate === template.id
                    ? "ring-2 ring-blue-500 bg-blue-50"
                    : ""
                }`}
                onClick={() => handleSelectTemplate(template)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-blue-600">{template.icon}</div>
                    <Badge variant="outline" className="text-xs">
                      {template.estimatedTime} min
                    </Badge>
                  </div>

                  <h3 className="font-semibold mb-2">{template.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {template.description}
                  </p>

                  <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-500">
                      Story Structure:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {template.sections.map((section, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs"
                        >
                          {section}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t">
                    <p className="text-xs text-gray-500">{template.useCase}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {selectedTemplate && (
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <p className="text-green-800 font-medium">
                ✓ Template selected! Generate your story using the "
                {templates.find((t) => t.id === selectedTemplate)?.title}"
                framework.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Template Preview */}
      {selectedTemplate && (
        <Card>
          <CardHeader>
            <CardTitle>Template Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="structure" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="structure">Structure</TabsTrigger>
                <TabsTrigger value="guidelines">Guidelines</TabsTrigger>
                <TabsTrigger value="examples">Examples</TabsTrigger>
              </TabsList>

              <TabsContent value="structure" className="space-y-4">
                <h4 className="font-semibold">Story Structure</h4>
                {templates
                  .find((t) => t.id === selectedTemplate)
                  ?.sections.map((section, index) => (
                    <div
                      key={index}
                      className="flex items-center p-3 border rounded-lg"
                    >
                      <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                        {index + 1}
                      </div>
                      <div>
                        <h5 className="font-medium">{section}</h5>
                        <p className="text-sm text-gray-600">
                          {getSectionDescription(selectedTemplate, section)}
                        </p>
                      </div>
                    </div>
                  ))}
              </TabsContent>

              <TabsContent value="guidelines" className="space-y-4">
                <h4 className="font-semibold">Writing Guidelines</h4>
                <div className="space-y-3">
                  {getTemplateGuidelines(selectedTemplate).map(
                    (guideline, index) => (
                      <div key={index} className="flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        <span className="text-gray-700">{guideline}</span>
                      </div>
                    )
                  )}
                </div>
              </TabsContent>

              <TabsContent value="examples" className="space-y-4">
                <h4 className="font-semibold">Example Applications</h4>
                <div className="space-y-3">
                  {getTemplateExamples(selectedTemplate).map(
                    (example, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <h5 className="font-medium text-sm">{example.title}</h5>
                        <p className="text-sm text-gray-600 mt-1">
                          {example.description}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Helper functions for template details
function getSectionDescription(templateId: string, section: string): string {
  const descriptions: Record<string, Record<string, string>> = {
    "trend-analysis": {
      "Historical Context":
        "Set the stage with background information and baseline data",
      "Trend Identification":
        "Identify and describe the main trends in the data",
      "Pattern Analysis": "Analyze patterns, cycles, and anomalies",
      "Future Implications": "Discuss what trends might mean for the future",
    },
    "comparative-analysis": {
      "Baseline Comparison":
        "Establish comparison criteria and baseline metrics",
      "Performance Rankings":
        "Rank and compare different categories or metrics",
      "Gap Analysis": "Identify and quantify performance gaps",
      Recommendations:
        "Provide actionable recommendations based on comparisons",
    },
    "impact-story": {
      "Current Situation": "Describe the current state and key metrics",
      "Impact Assessment": "Analyze the real-world impact of the data",
      "Stakeholder Effects": "Examine how different groups are affected",
      "Policy Recommendations": "Suggest policy interventions and solutions",
    },
    "distribution-story": {
      "Distribution Overview": "Present the overall distribution of values",
      "Dominant Categories": "Identify and analyze dominant categories",
      "Outlier Analysis": "Examine outliers and unusual distributions",
      "Balance Assessment":
        "Assess whether the distribution is balanced or skewed",
    },
    "problem-solution": {
      "Problem Identification":
        "Clearly define the problem revealed by the data",
      "Root Cause Analysis": "Investigate underlying causes of the problem",
      "Solution Framework": "Propose evidence-based solutions",
      "Implementation Path": "Outline steps for implementing solutions",
    },
    "stakeholder-perspective": {
      "Citizen Impact": "How the data affects everyday citizens",
      "Business Implications": "Impact on businesses and economic actors",
      "Government Perspective": "Policy and governance implications",
      "International Context": "How this compares internationally",
    },
  };

  return descriptions[templateId]?.[section] || "Section description";
}

function getTemplateGuidelines(templateId: string): string[] {
  const guidelines: Record<string, string[]> = {
    "trend-analysis": [
      "Focus on temporal changes and evolution over time",
      "Use specific data points to support trend observations",
      "Identify turning points and significant changes",
      "Connect trends to external factors when possible",
    ],
    "comparative-analysis": [
      "Ensure fair and meaningful comparisons",
      "Use consistent metrics across comparisons",
      "Highlight both leaders and areas needing improvement",
      "Provide context for performance differences",
    ],
    "impact-story": [
      "Connect data to real-world consequences",
      "Consider multiple stakeholder perspectives",
      "Use concrete examples and case studies",
      "Focus on actionable insights",
    ],
    "distribution-story": [
      "Describe the shape and characteristics of distributions",
      "Identify patterns and anomalies",
      "Explain what distributions reveal about the underlying system",
      "Consider equity and fairness implications",
    ],
    "problem-solution": [
      "Clearly articulate the problem using data evidence",
      "Investigate root causes systematically",
      "Propose realistic and evidence-based solutions",
      "Consider implementation challenges and opportunities",
    ],
    "stakeholder-perspective": [
      "Consider multiple viewpoints and interests",
      "Use empathy to understand different impacts",
      "Balance competing perspectives fairly",
      "Identify common ground and shared interests",
    ],
  };

  return guidelines[templateId] || [];
}

function getTemplateExamples(
  templateId: string
): Array<{ title: string; description: string }> {
  const examples: Record<
    string,
    Array<{ title: string; description: string }>
  > = {
    "trend-analysis": [
      {
        title: "Gender Pay Gap Evolution",
        description:
          "Analyzing how the gender pay gap has changed over the past decade, identifying progress and remaining challenges",
      },
      {
        title: "Unemployment Rate Trends",
        description:
          "Tracking unemployment patterns through economic cycles and policy changes",
      },
    ],
    "comparative-analysis": [
      {
        title: "Regional Health System Performance",
        description:
          "Comparing health outcomes across different German states to identify best practices",
      },
      {
        title: "Transport Mode Efficiency",
        description:
          "Comparing the efficiency and usage of different transportation modes",
      },
    ],
    "impact-story": [
      {
        title: "Climate Policy Economic Impact",
        description:
          "Examining how emission trading policies affect businesses and consumers",
      },
      {
        title: "Migration Integration Success",
        description:
          "Analyzing the economic and social impact of migration integration programs",
      },
    ],
  };

  return examples[templateId] || [];
}
