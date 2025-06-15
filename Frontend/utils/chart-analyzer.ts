export function generateChartSummary(
  chartType: string,
  chartData: any[],
  indicatorData: any,
  rawData: any
): string {
  if (!chartData || chartData.length === 0 || !indicatorData) {
    return "No data available for analysis.";
  }

  const dataPoints = chartData.length;
  const indicatorName = indicatorData.name;
  const category = indicatorData.category;
  const unit = indicatorData.unit || "units";

  switch (chartType) {
    case "bar":
      return generateBarChartSummary(
        chartData,
        indicatorName,
        category,
        unit,
        rawData
      );
    case "pie":
    case "radial":
      return generatePieChartSummary(chartData, indicatorName, category, unit);
    case "line":
    case "area":
      return generateLineChartSummary(
        chartData,
        indicatorName,
        category,
        unit,
        rawData
      );
    default:
      return `This ${chartType} chart displays ${dataPoints} data points for ${indicatorName}, showing the distribution across different ${category.toLowerCase()} metrics.`;
  }
}

function generateBarChartSummary(
  chartData: any[],
  indicatorName: string,
  category: string,
  unit: string,
  rawData: any
): string {
  const sortedData = [...chartData].sort((a, b) => b.value - a.value);
  const topCountry = sortedData[0];
  const lowestCountry = sortedData[sortedData.length - 1];
  const averageValue =
    chartData.reduce((sum, item) => sum + item.value, 0) / chartData.length;

  const countries = rawData?.countries || [];
  const years = rawData?.years || [];
  const timeContext =
    years.length > 1
      ? `from ${Math.min(...years)} to ${Math.max(...years)}`
      : `for ${years[0] || 2024}`;

  let summary = `This bar chart compares ${indicatorName} across ${
    chartData.length
  } ${chartData.length === 1 ? "region" : "regions"} ${timeContext}. `;

  if (
    topCountry &&
    lowestCountry &&
    topCountry.country !== lowestCountry.country
  ) {
    summary += `${
      topCountry.country
    } shows the highest value at ${topCountry.value.toFixed(
      2
    )} ${unit}, while ${
      lowestCountry.country
    } has the lowest at ${lowestCountry.value.toFixed(2)} ${unit}. `;
  }

  summary += `The average ${indicatorName.toLowerCase()} across all regions is ${averageValue.toFixed(
    2
  )} ${unit}. `;

  // Add category-specific insights
  if (category.toLowerCase().includes("economic")) {
    summary += `This economic indicator reveals significant regional disparities that may reflect differences in development levels, policy effectiveness, or market conditions.`;
  } else if (category.toLowerCase().includes("social")) {
    summary += `This social indicator highlights variations in living standards and social outcomes across different regions.`;
  } else if (category.toLowerCase().includes("environment")) {
    summary += `This environmental metric shows regional differences in sustainability practices and environmental conditions.`;
  } else {
    summary += `These variations in ${category.toLowerCase()} metrics provide insights into regional performance and development patterns.`;
  }

  return summary;
}

function generatePieChartSummary(
  chartData: any[],
  indicatorName: string,
  category: string,
  unit: string
): string {
  const totalValue = chartData.reduce((sum, item) => sum + item.value, 0);
  const sortedData = [...chartData].sort((a, b) => b.value - a.value);
  const topSegment = sortedData[0];
  const topPercentage = ((topSegment.value / totalValue) * 100).toFixed(1);

  let summary = `This pie chart shows the distribution of ${indicatorName} across ${chartData.length} regions. `;

  if (topSegment) {
    summary += `${
      topSegment.name
    } represents the largest share at ${topPercentage}% of the total (${topSegment.value.toFixed(
      2
    )} ${unit}). `;
  }

  // Analyze distribution pattern
  const topThree = sortedData.slice(0, 3);
  const topThreePercentage = (
    (topThree.reduce((sum, item) => sum + item.value, 0) / totalValue) *
    100
  ).toFixed(1);

  if (Number.parseFloat(topThreePercentage) > 75) {
    summary += `The top three regions account for ${topThreePercentage}% of the total, indicating a highly concentrated distribution. `;
  } else if (Number.parseFloat(topThreePercentage) > 50) {
    summary += `The top three regions represent ${topThreePercentage}% of the total, showing moderate concentration. `;
  } else {
    summary += `The distribution is relatively balanced across regions, with the top three accounting for ${topThreePercentage}% of the total. `;
  }

  // Add category-specific context
  if (
    category.toLowerCase().includes("welfare") ||
    category.toLowerCase().includes("loss")
  ) {
    summary += `This distribution pattern reveals which regions are most affected by welfare losses, providing crucial insights for policy intervention and resource allocation.`;
  } else if (category.toLowerCase().includes("economic")) {
    summary += `This economic distribution highlights regional economic contributions and potential areas for development focus.`;
  } else {
    summary += `Understanding this distribution helps identify regional patterns and inform targeted policy decisions.`;
  }

  return summary;
}

function generateLineChartSummary(
  chartData: any[],
  indicatorName: string,
  category: string,
  unit: string,
  rawData: any
): string {
  const years = rawData?.years || [];
  const countries = rawData?.countries || [];

  if (years.length <= 1) {
    return `This line chart displays ${indicatorName} values across ${
      chartData.length
    } regions for ${
      years[0] || 2024
    }. The data shows regional variations in ${category.toLowerCase()} performance.`;
  }

  // For time series data
  const sortedData = [...chartData].sort((a, b) => a.year - b.year);
  const firstValue = sortedData[0]?.value || 0;
  const lastValue = sortedData[sortedData.length - 1]?.value || 0;
  const trend =
    lastValue > firstValue
      ? "increasing"
      : lastValue < firstValue
      ? "decreasing"
      : "stable";
  const changePercent =
    firstValue !== 0
      ? (((lastValue - firstValue) / firstValue) * 100).toFixed(1)
      : "0";

  let summary = `This line chart tracks ${indicatorName} over time from ${Math.min(
    ...years
  )} to ${Math.max(...years)}. `;

  if (trend !== "stable") {
    summary += `The data shows an overall ${trend} trend, with values ${
      trend === "increasing" ? "rising" : "falling"
    } by approximately ${Math.abs(
      Number.parseFloat(changePercent)
    )}% over the period. `;
  } else {
    summary += `The values have remained relatively stable over the time period. `;
  }

  // Add category-specific insights
  if (category.toLowerCase().includes("economic")) {
    summary += `This ${trend} economic trend ${
      trend === "increasing"
        ? "suggests positive economic development"
        : trend === "decreasing"
        ? "may indicate economic challenges"
        : "shows economic stability"
    } across the analyzed regions.`;
  } else if (category.toLowerCase().includes("social")) {
    summary += `The ${trend} pattern in this social indicator ${
      trend === "increasing"
        ? "reflects improving social conditions"
        : trend === "decreasing"
        ? "may signal declining social outcomes"
        : "indicates consistent social conditions"
    }.`;
  } else {
    summary += `This temporal pattern provides valuable insights into how ${category.toLowerCase()} conditions have evolved over time.`;
  }

  return summary;
}

export function getChartInsights(
  chartType: string,
  chartData: any[],
  indicatorData: any
): string[] {
  const insights: string[] = [];

  if (!chartData || chartData.length === 0) return insights;

  switch (chartType) {
    case "bar":
      const barSorted = [...chartData].sort((a, b) => b.value - a.value);
      if (barSorted.length >= 2) {
        const ratio =
          barSorted[0].value / barSorted[barSorted.length - 1].value;
        if (ratio > 5) {
          insights.push(
            `High variation: The highest value is ${ratio.toFixed(
              1
            )}x greater than the lowest`
          );
        }
      }
      break;

    case "pie":
    case "radial":
      const total = chartData.reduce((sum, item) => sum + item.value, 0);
      const pieSorted = [...chartData].sort((a, b) => b.value - a.value);
      const topShare = (pieSorted[0].value / total) * 100;
      if (topShare > 50) {
        insights.push(
          `Dominant region: ${
            pieSorted[0].name
          } accounts for ${topShare.toFixed(1)}% of the total`
        );
      }
      break;

    case "line":
    case "area":
      if (chartData.length > 2) {
        const values = chartData.map((d) => d.value);
        const variance =
          values.reduce(
            (acc, val) =>
              acc +
              Math.pow(
                val - values.reduce((a, b) => a + b, 0) / values.length,
                2
              ),
            0
          ) / values.length;
        if (variance > 1000) {
          insights.push("High volatility detected in the time series data");
        }
      }
      break;
  }

  return insights;
}
