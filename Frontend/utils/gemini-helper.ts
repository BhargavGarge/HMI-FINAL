import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini API client
let genAI: GoogleGenerativeAI | null = null;

export function initGeminiAPI(apiKey?: string) {
  // Use provided key or fallback to environment variable
  const key = "AIzaSyDfTGFptPR0qMdHA25b41JNX7JX1WpdiiA";

  if (!key) {
    console.error(
      "Gemini API key not found. Please set NEXT_PUBLIC_GEMINI_API_KEY environment variable or provide a key."
    );
    return false;
  }

  genAI = new GoogleGenerativeAI(key);
  return true;
}

export async function generateEnhancedDescription(
  visualData: any,
  indicatorData: any
) {
  if (!genAI) {
    console.error("Gemini API not initialized. Call initGeminiAPI first.");
    return null;
  }

  try {
    // Create a model instance
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Prepare the prompt with visualization and indicator data
    const prompt = `
      Generate a detailed, informative description for a data visualization with the following information:
      
      Title: ${visualData.title}
      Type: ${visualData.type}
      Brief Description: ${visualData.description}
      Tags: ${
        Array.isArray(visualData.tags)
          ? visualData.tags.join(", ")
          : visualData.tags
      }
      Domain: ${visualData.domain}
      Document: ${visualData.document_title} (${visualData.document_year})
      Data Points: ${visualData.observation_count}
      
      Related Indicator: ${indicatorData.name}
      Indicator Category: ${indicatorData.category}
      Indicator Unit: ${indicatorData.unit || "N/A"}
      
      Please provide:
      1. A clear explanation of what this visualization shows (2-3 sentences)
      2. The significance of this data in the context of ${
        visualData.domain
      } (1-2 sentences)
      3. Key insights that might be derived from this visualization (1-2 sentences)
      
      Format the response as a cohesive paragraph without numbered points or headers.
    `;

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text;
  } catch (error) {
    console.error("Error generating enhanced description:", error);
    return null;
  }
}

export async function generateChartDescription(
  chartType: string,
  chartData: any[],
  indicatorData: any,
  rawData: any
) {
  if (!genAI) {
    console.error("Gemini API not initialized. Call initGeminiAPI first.");
    return null;
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Analyze the data to provide context
    const dataPoints = chartData.length;
    const countries = rawData?.countries || [];
    const years = rawData?.years || [];
    const latestYear = years.length > 0 ? Math.max(...years) : 2024;

    // Create data summary for context
    let dataSummary = "";
    if (chartType === "pie" || chartType === "radial") {
      const topValues = chartData
        .sort((a, b) => b.value - a.value)
        .slice(0, 3)
        .map((item) => `${item.name}: ${item.value}`)
        .join(", ");
      dataSummary = `Top values: ${topValues}`;
    } else if (chartType === "bar") {
      const topCountries = chartData
        .sort((a, b) => b.value - a.value)
        .slice(0, 3)
        .map((item) => `${item.country}: ${item.value}`)
        .join(", ");
      dataSummary = `Highest values: ${topCountries}`;
    } else if (chartType === "line" || chartType === "area") {
      const avgValue =
        chartData.reduce((sum, item) => sum + item.value, 0) / chartData.length;
      dataSummary = `Average value: ${avgValue.toFixed(
        2
      )}, covering ${dataPoints} data points`;
    }

    const prompt = `
      Generate a clear, informative description for a ${chartType} chart displaying data about "${
      indicatorData.name
    }".
      
      Chart Details:
      - Chart Type: ${
        chartType.charAt(0).toUpperCase() + chartType.slice(1)
      } chart
      - Indicator: ${indicatorData.name}
      - Category: ${indicatorData.category}
      - Unit: ${indicatorData.unit || "N/A"}
      - Data Points: ${dataPoints}
      - Countries Covered: ${countries.length}
      - Time Period: ${
        years.length > 1 ? `${Math.min(...years)}-${latestYear}` : latestYear
      }
      - Data Summary: ${dataSummary}
      
      Please provide a description that:
      1. Explains what this ${chartType} chart visualizes in simple terms
      2. Highlights the key patterns or insights visible in the data
      3. Explains the significance of this indicator in the context of ${
        indicatorData.category
      }
      4. Mentions any notable trends or outliers if relevant
      
      Keep the description informative but accessible to non-experts. Write in a professional yet engaging tone.
      Format as a single cohesive paragraph without bullet points or numbered lists.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text;
  } catch (error) {
    console.error("Error generating chart description:", error);
    return null;
  }
}
