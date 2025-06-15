"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Play,
  Pause,
  RotateCcw,
} from "lucide-react";

type StoryData = {
  indicator: string;
  metrics: Array<{ name: string; value: number }>;
  trends: Array<{ year: number; value: number }>;
  distributions: Array<{ name: string; value: number }>;
};

type StorySection = {
  title: string;
  content: string;
  type:
    | "introduction"
    | "trend_analysis"
    | "key_insights"
    | "implications"
    | "conclusion";
  data?: any;
  visualization?: string;
};

type GeneratedStory = {
  title: string;
  summary: string;
  sections: StorySection[];
  keyTakeaways: string[];
  readingTime: number;
};

export function StoryGenerator({ indicator }: { indicator: string }) {
  const [storyData, setStoryData] = useState<StoryData | null>(null);
  const [generatedStory, setGeneratedStory] = useState<GeneratedStory | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Fetch data for story generation
  const fetchStoryData = async () => {
    if (indicator === "all") return;

    try {
      const response = await fetch(
        `http://127.0.0.1:5000/visualization_data?indicator=${indicator}`
      );
      if (response.ok) {
        const data = await response.json();
        setStoryData({
          indicator,
          metrics: data.bar || [],
          trends: data.line || [],
          distributions: data.pie || [],
        });
      }
    } catch (error) {
      console.error("Error fetching story data:", error);
    }
  };

  useEffect(() => {
    fetchStoryData();
  }, [indicator]);

  // Generate story from data
  const generateStory = () => {
    // Use existing storyData or generate sample data if not available
    const dataToUse = storyData || {
      indicator,
      metrics: getSampleData().bar || [],
      trends: getSampleData().line || [],
      distributions: getSampleData().pie || [],
    };

    setLoading(true);

    // Continue with the rest of the function using dataToUse instead of storyData
    const trendAnalysis = analyzeTrends(dataToUse.trends);
    const keyMetrics = analyzeMetrics(dataToUse.metrics);
    const distributionInsights = analyzeDistributions(dataToUse.distributions);

    const story: GeneratedStory = {
      title: createStoryTitle(indicator, trendAnalysis),
      summary: createStorySummary(indicator, trendAnalysis, keyMetrics),
      sections: [
        createIntroductionSection(indicator, keyMetrics),
        createTrendAnalysisSection(trendAnalysis, dataToUse.trends),
        createKeyInsightsSection(keyMetrics, distributionInsights),
        createImplicationsSection(indicator, trendAnalysis),
        createConclusionSection(indicator, trendAnalysis, keyMetrics),
      ],
      keyTakeaways: generateKeyTakeaways(indicator, trendAnalysis, keyMetrics),
      readingTime: 5,
    };

    setGeneratedStory(story);
    setLoading(false);
  };

  // Story generation helper functions
  const analyzeTrends = (trends: Array<{ year: number; value: number }>) => {
    if (trends.length < 2)
      return { direction: "stable", change: 0, pattern: "insufficient_data" };

    const sortedTrends = [...trends].sort((a, b) => a.year - b.year);
    const firstValue = sortedTrends[0].value;
    const lastValue = sortedTrends[sortedTrends.length - 1].value;
    const change = ((lastValue - firstValue) / firstValue) * 100;

    let direction: "increasing" | "decreasing" | "stable" = "stable";
    if (Math.abs(change) > 5) {
      direction = change > 0 ? "increasing" : "decreasing";
    }

    // Detect patterns
    let pattern = "steady";
    const values = sortedTrends.map((t) => t.value);
    const volatility = calculateVolatility(values);

    if (volatility > 20) pattern = "volatile";
    else if (volatility < 5) pattern = "stable";

    return { direction, change: Math.abs(change), pattern, volatility };
  };

  const analyzeMetrics = (metrics: Array<{ name: string; value: number }>) => {
    if (metrics.length === 0)
      return { highest: null, lowest: null, average: 0 };

    const sorted = [...metrics].sort((a, b) => b.value - a.value);
    const average =
      metrics.reduce((sum, m) => sum + m.value, 0) / metrics.length;

    return {
      highest: sorted[0],
      lowest: sorted[sorted.length - 1],
      average: Math.round(average * 100) / 100,
    };
  };

  const analyzeDistributions = (
    distributions: Array<{ name: string; value: number }>
  ) => {
    if (distributions.length === 0) return { dominant: null, balanced: false };

    const sorted = [...distributions].sort((a, b) => b.value - a.value);
    const dominant = sorted[0];
    const balanced = sorted[0].value - sorted[sorted.length - 1].value < 30;

    return { dominant, balanced };
  };

  const calculateVolatility = (values: number[]) => {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance =
      values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
      values.length;
    return Math.sqrt(variance);
  };

  const createStoryTitle = (indicator: string, trendAnalysis: any) => {
    const indicatorName =
      indicator.charAt(0).toUpperCase() + indicator.slice(1);

    if (trendAnalysis.direction === "increasing") {
      return `${indicatorName}: A Story of Growth and Progress`;
    } else if (trendAnalysis.direction === "decreasing") {
      return `${indicatorName}: Navigating Challenges and Changes`;
    } else {
      return `${indicatorName}: Stability in Uncertain Times`;
    }
  };

  const createStorySummary = (
    indicator: string,
    trendAnalysis: any,
    keyMetrics: any
  ) => {
    const indicatorName =
      indicator.charAt(0).toUpperCase() + indicator.slice(1);

    return `This story explores the current state of ${indicatorName.toLowerCase()} in Germany, revealing ${
      trendAnalysis.direction === "increasing"
        ? "positive developments"
        : trendAnalysis.direction === "decreasing"
        ? "concerning trends"
        : "stable conditions"
    } over recent years. Through data analysis, we uncover key insights that shape our understanding of this critical economic indicator.`;
  };

  const createIntroductionSection = (
    indicator: string,
    keyMetrics: any
  ): StorySection => {
    const indicatorName =
      indicator.charAt(0).toUpperCase() + indicator.slice(1);

    return {
      title: "Setting the Scene",
      type: "introduction",
      content: `${indicatorName} plays a crucial role in Germany's economic landscape. ${getIndicatorContext(
        indicator
      )} 
      
      Currently, our analysis reveals ${
        keyMetrics.highest
          ? `the highest metric is ${keyMetrics.highest.name} at ${keyMetrics.highest.value}`
          : "various important metrics"
      } that paint a comprehensive picture of the current situation.`,
    };
  };

  const createTrendAnalysisSection = (
    trendAnalysis: any,
    trends: any[]
  ): StorySection => {
    return {
      title: "The Trend Story",
      type: "trend_analysis",
      content: `Over the past ${trends.length} years, we observe a ${
        trendAnalysis.direction
      } trend with a ${trendAnalysis.change.toFixed(1)}% change. 
      
      ${
        trendAnalysis.pattern === "volatile"
          ? "The data shows significant volatility, indicating periods of rapid change and adjustment."
          : trendAnalysis.pattern === "stable"
          ? "The trend demonstrates remarkable stability, suggesting consistent underlying conditions."
          : "The progression follows a steady pattern, reflecting gradual but persistent change."
      }`,
      data: trends,
      visualization: "line",
    };
  };

  const createKeyInsightsSection = (
    keyMetrics: any,
    distributionInsights: any
  ): StorySection => {
    return {
      title: "Key Insights",
      type: "key_insights",
      content: `Our analysis reveals several critical insights:
      
      ${
        keyMetrics.highest
          ? `• **Leading Factor**: ${keyMetrics.highest.name} stands out with a value of ${keyMetrics.highest.value}, representing the strongest performance in this category.`
          : ""
      }
      
      ${
        keyMetrics.lowest
          ? `• **Area for Attention**: ${keyMetrics.lowest.name} shows the lowest value at ${keyMetrics.lowest.value}, highlighting potential areas for improvement.`
          : ""
      }
      
      ${
        distributionInsights.balanced
          ? "• **Balanced Distribution**: The data shows a relatively balanced distribution across categories, indicating healthy diversity."
          : distributionInsights.dominant
          ? `• **Dominant Category**: ${distributionInsights.dominant.name} represents ${distributionInsights.dominant.value}% of the total, showing clear dominance in this area.`
          : ""
      }`,
    };
  };

  const createImplicationsSection = (
    indicator: string,
    trendAnalysis: any
  ): StorySection => {
    return {
      title: "What This Means",
      type: "implications",
      content: `${getImplicationsText(indicator, trendAnalysis)}`,
    };
  };

  const createConclusionSection = (
    indicator: string,
    trendAnalysis: any,
    keyMetrics: any
  ): StorySection => {
    return {
      title: "Looking Forward",
      type: "conclusion",
      content: `${getConclusionText(indicator, trendAnalysis, keyMetrics)}`,
    };
  };

  const generateKeyTakeaways = (
    indicator: string,
    trendAnalysis: any,
    keyMetrics: any
  ) => {
    const takeaways = [];

    if (trendAnalysis.direction === "increasing") {
      takeaways.push(
        `${
          indicator.charAt(0).toUpperCase() + indicator.slice(1)
        } shows positive growth trends`
      );
    } else if (trendAnalysis.direction === "decreasing") {
      takeaways.push(
        `${
          indicator.charAt(0).toUpperCase() + indicator.slice(1)
        } faces declining trends requiring attention`
      );
    } else {
      takeaways.push(
        `${
          indicator.charAt(0).toUpperCase() + indicator.slice(1)
        } maintains stable conditions`
      );
    }

    if (keyMetrics.highest) {
      takeaways.push(
        `${keyMetrics.highest.name} is the strongest performing metric`
      );
    }

    if (trendAnalysis.pattern === "volatile") {
      takeaways.push("High volatility suggests need for careful monitoring");
    }

    takeaways.push("Data-driven insights enable better policy decisions");

    return takeaways;
  };

  // Helper functions for context-specific content
  const getIndicatorContext = (indicator: string) => {
    const contexts = {
      "gender equality":
        "Gender equality is fundamental to social progress and economic development, affecting workforce participation, leadership representation, and social cohesion.",
      labour:
        "The labor market serves as a key indicator of economic health, reflecting employment opportunities, job security, and workforce dynamics.",
      macroeconomy:
        "Macroeconomic indicators provide insights into the overall economic performance, including growth, inflation, and trade balance.",
      health:
        "Health system performance directly impacts quality of life, economic productivity, and social well-being across the population.",
      finance:
        "Financial indicators reflect the stability and growth potential of the economic system, affecting investment and development opportunities.",
      "subjective wellbeing":
        "Subjective wellbeing measures capture the human dimension of progress, reflecting life satisfaction and social cohesion.",
      "emission trading":
        "Emission trading mechanisms are crucial for environmental policy and the transition to a sustainable economy.",
      transport:
        "Transportation systems are vital infrastructure that enables economic activity and affects environmental sustainability.",
      "refugees & migration":
        "Migration patterns reflect global dynamics and have significant impacts on demographics, labor markets, and social integration.",
    };
    return (
      contexts[indicator as keyof typeof contexts] ||
      "This indicator provides important insights into Germany's socio-economic development."
    );
  };

  const getImplicationsText = (indicator: string, trendAnalysis: any) => {
    const direction = trendAnalysis.direction;

    if (direction === "increasing") {
      return `The positive trend in ${indicator} suggests successful policies and favorable conditions. This growth creates opportunities for further development and may serve as a model for other regions. However, it's important to ensure this growth is sustainable and inclusive.`;
    } else if (direction === "decreasing") {
      return `The declining trend in ${indicator} signals challenges that require immediate attention. Policymakers should investigate underlying causes and develop targeted interventions. This trend may have broader implications for related economic and social indicators.`;
    } else {
      return `The stable trend in ${indicator} indicates consistent conditions, which can be positive for planning and predictability. However, stability should not lead to complacency, and continuous monitoring remains important to identify emerging changes.`;
    }
  };

  const getConclusionText = (
    indicator: string,
    trendAnalysis: any,
    keyMetrics: any
  ) => {
    return `As we look to the future, ${indicator} will continue to be a critical area for monitoring and policy development. The current ${trendAnalysis.direction} trend provides valuable insights for decision-makers.

    Moving forward, it will be important to:
    • Continue monitoring key metrics and trends
    • Develop evidence-based policies
    • Ensure inclusive and sustainable development
    • Learn from both successes and challenges

    This data story demonstrates the power of evidence-based analysis in understanding complex socio-economic phenomena and informing better decisions for Germany's future.`;
  };

  // Auto-play functionality
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && generatedStory) {
      interval = setInterval(() => {
        setCurrentSection((prev) => {
          if (prev < generatedStory.sections.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, 8000); // 8 seconds per section
    }
    return () => clearInterval(interval);
  }, [isPlaying, generatedStory]);

  if (indicator === "all") {
    return (
      <Card className="mb-4">
        <CardContent className="p-6 text-center">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">
            Select a specific indicator to generate data stories
          </p>
        </CardContent>
      </Card>
    );
  }

  function getSampleData() {
    return {
      bar: [
        {
          name: "Metric A",
          value: 50,
        },
        {
          name: "Metric B",
          value: 75,
        },
        {
          name: "Metric C",
          value: 100,
        },
      ],
      line: [
        {
          year: 2020,
          value: 60,
        },
        {
          year: 2021,
          value: 80,
        },
        {
          year: 2022,
          value: 70,
        },
      ],
      pie: [
        {
          name: "Category X",
          value: 30,
        },
        {
          name: "Category Y",
          value: 45,
        },
        {
          name: "Category Z",
          value: 25,
        },
      ],
    };
  }

  return (
    <div className="space-y-6">
      {/* Story Generation Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
              Data Story Generator
            </div>
            <Button
              onClick={generateStory}
              disabled={loading || indicator === "all"}
            >
              {loading ? "Generating..." : "Generate Story"}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Transform your economic data into compelling narratives that reveal
            insights and trends.
          </p>
          {storyData && (
            <div className="flex gap-2 text-sm text-gray-500">
              <Badge variant="outline">
                {storyData.metrics.length} metrics
              </Badge>
              <Badge variant="outline">
                {storyData.trends.length} trend points
              </Badge>
              <Badge variant="outline">
                {storyData.distributions.length} distributions
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Generated Story */}
      {generatedStory && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl mb-2">
                  {generatedStory.title}
                </CardTitle>
                <p className="text-gray-600 mb-4">{generatedStory.summary}</p>
                <div className="flex gap-2 text-sm text-gray-500">
                  <Badge variant="outline">
                    📖 {generatedStory.readingTime} min read
                  </Badge>
                  <Badge variant="outline">
                    📊 {generatedStory.sections.length} sections
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                  {isPlaying ? "Pause" : "Auto-play"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setCurrentSection(0);
                    setIsPlaying(false);
                  }}
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs
              value={`section-${currentSection}`}
              onValueChange={(value) => {
                const sectionIndex = Number.parseInt(value.split("-")[1]);
                setCurrentSection(sectionIndex);
                setIsPlaying(false);
              }}
            >
              <TabsList className="grid w-full grid-cols-5 mb-6">
                {generatedStory.sections.map((section, index) => (
                  <TabsTrigger
                    key={index}
                    value={`section-${index}`}
                    className="text-xs"
                  >
                    {section.title}
                  </TabsTrigger>
                ))}
              </TabsList>

              {generatedStory.sections.map((section, index) => (
                <TabsContent
                  key={index}
                  value={`section-${index}`}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-2 mb-4">
                    {section.type === "introduction" && (
                      <BookOpen className="h-5 w-5 text-blue-600" />
                    )}
                    {section.type === "trend_analysis" && (
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    )}
                    {section.type === "key_insights" && (
                      <AlertCircle className="h-5 w-5 text-orange-600" />
                    )}
                    {section.type === "implications" && (
                      <CheckCircle className="h-5 w-5 text-purple-600" />
                    )}
                    {section.type === "conclusion" && (
                      <ArrowRight className="h-5 w-5 text-gray-600" />
                    )}
                    <h3 className="text-xl font-semibold">{section.title}</h3>
                  </div>

                  <div className="prose prose-gray max-w-none">
                    {section.content.split("\n").map((paragraph, pIndex) => (
                      <p key={pIndex} className="mb-4 leading-relaxed">
                        {paragraph.trim()}
                      </p>
                    ))}
                  </div>

                  {index < generatedStory.sections.length - 1 && (
                    <div className="flex justify-end mt-6">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentSection(index + 1)}
                        className="flex items-center gap-2"
                      >
                        Next Section
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>

            {/* Key Takeaways */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold mb-3 flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-blue-600" />
                Key Takeaways
              </h4>
              <ul className="space-y-2">
                {generatedStory.keyTakeaways.map((takeaway, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span className="text-gray-700">{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
