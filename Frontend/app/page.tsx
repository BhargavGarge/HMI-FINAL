"use client";
// You'll need to install recharts: npm install recharts
import {
  ArrowDown,
  ArrowUp,
  TrendingUp,
  Play,
  Pause,
  Volume2,
  Download,
  Loader2,
  FileText,
  X,
  BarChart3,
  MessageSquare,
  Headphones,
  BookOpen,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import load from "../styles/load.gif";
import { TrendCard } from "@/components/trend-card";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StoryGenerator } from "@/components/story-generator";
import { StoryTemplates } from "@/components/story-template";
import { ChatBox } from "@/components/chat-box";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [trendData, setTrendData] = useState<string | null>(null);
  const [indicator, setIndicator] = useState("all");
  const [isPodcastGenerating, setIsPodcastGenerating] = useState(false);
  const [podcastAudio, setPodcastAudio] = useState<string | null>(null);
  const [podcastTranscript, setPodcastTranscript] = useState<string | null>(
    null
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  type Trend = {
    title: string;
    value: string;
    description: string;
    trend: "up" | "down" | "flat";
  };

  const [trendList, setTrendList] = useState<Trend[]>([]);

  const prompts: Record<string, string> = {
    "gender equality": `List the top 3 indicators related to gender equality from the dataset. Respond as a JSON array with keys: "title", "value", "description", and "trend" ("up", "down", or "flat"). Return valid JSON only.`,

    labour: `Identify the top 3 indicators reflecting labor market trends. Respond with a JSON array containing "title", "value", "description", and "trend" ("up", "down", or "flat"). Return valid JSON only.`,

    marcoeconomy: `From the macroeconomic dataset, extract the top 3 key indicators for Germany. Format your response as a JSON array with "title", "value", "description", and "trend" ("up", "down", or "flat"). JSON only.`,

    health: `List the top 3 health indicators for Germany based on the data. Provide them in a clean JSON array with "title", "value", "description", and "trend" ("up", "down", or "flat"). Do not include markdown.`,

    finance: `Identify the top 3 financial indicators for Germany from the dataset. Return a JSON array with "title", "value", "description", and "trend" ("up", "down", or "flat"). No extra formatting.`,

    "subjective wellbeing": `Extract the top 3 indicators of subjective wellbeing. Return only a JSON array with "title", "value", "description", and "trend" ("up", "down", or "flat"). Avoid any extra content.`,

    "emission trading": `List 3 major indicators or metrics related to emission trading schemes. Output a JSON array with "title", "value", "description", and "trend" ("up", "down", or "flat"). Return only valid JSON.`,

    transport: `From the transport data, extract 3 main transport indicators. Format as a JSON array with "title", "value", "description", and "trend" ("up", "down", or "flat"). Only return valid JSON.`,

    "refugees & migration": `Identify the top 3 current indicators related to refugees and migration in Germany. Format your response as a JSON array with "title", "value", "description", and "trend" ("up", "down", or "flat"). JSON only.`,

    energy_climate: `Extract the 3 most significant indicators related to energy consumption, energy policy, or climate impacts. Return a JSON array with "title", "value", "description", and "trend" ("up", "down", or "flat"). Respond with JSON only.`,

    construction_housing: `List the top 3 indicators related to construction activity or housing in Germany. Format your response as a JSON array with "title", "value", "description", and "trend" ("up", "down", or "flat"). Return only valid JSON.`,
  };

  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current;

      const updateTime = () => setCurrentTime(audio.currentTime);
      const handleLoadedMetadata = () => setDuration(audio.duration);
      const handleEnded = () => setIsPlaying(false);

      audio.addEventListener("timeupdate", updateTime);
      audio.addEventListener("loadedmetadata", handleLoadedMetadata);
      audio.addEventListener("ended", handleEnded);

      return () => {
        audio.removeEventListener("timeupdate", updateTime);
        audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
        audio.removeEventListener("ended", handleEnded);
      };
    }
  }, [podcastAudio]);

  const handleIndicatorChange = async (value: string) => {
    setIndicator(value);
    setLoading(true);
    setTrendData(null);
    setTrendList([]);
    setPodcastAudio(null);
    setPodcastTranscript(null);
    setShowTranscript(false);

    try {
      const indicatorRes = await fetch("http://127.0.0.1:5000/indicator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ indicator: value }),
      });

      const indicatorData = await indicatorRes.json();
      if (indicatorData.error) {
        console.error("Backend error:", indicatorData.error);
        return;
      }

      const query =
        prompts[value] ||
        "List the top 3 economic indicators in JSON format with title, value, description, and trend as 'up', 'down', or 'flat'. Only return the JSON array.";

      const searchRes = await fetch("http://127.0.0.1:5000/search_response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          domain_type: value,
          query,
        }),
      });

      const searchData = await searchRes.json();
      if (searchData.error) {
        console.error("Search error:", searchData.error);
        return;
      }

      setTrendData(searchData.response);

      try {
        const cleanedResponse = searchData.response
          .replace(/^```json\n/, "")
          .replace(/```$/, "")
          .trim();

        const parsed = JSON.parse(cleanedResponse);

        const extractedTrends = Array.isArray(parsed)
          ? parsed
          : Object.values(parsed).find((val) => Array.isArray(val)) || [];

        setTrendList(extractedTrends);
        console.log("Extracted trends:", extractedTrends);
      } catch (jsonErr) {
        console.error("Failed to parse trend data:", jsonErr);
      }
    } catch (err) {
      console.error("Fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const generatePodcast = async () => {
    if (!indicator || indicator === "all") return;

    setIsPodcastGenerating(true);
    setPodcastAudio(null);
    setPodcastTranscript(null);

    try {
      const response = await fetch("http://127.0.0.1:5000/generate_podcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          indicator: indicator,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate podcast");
      }

      const data = await response.json();
      setPodcastAudio(data.audio_url);
      setPodcastTranscript(data.transcript);
    } catch (error) {
      console.error("Error generating podcast:", error);
    } finally {
      setIsPodcastGenerating(false);
    }
  };

  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }

    setIsPlaying(!isPlaying);
  };

  const handleSliderChange = (value: number[]) => {
    if (!audioRef.current) return;

    const newTime = value[0];
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const toggleTranscript = () => {
    setShowTranscript(!showTranscript);
  };

  const getIndicatorTitle = (ind: string) => {
    if (ind === "all") return "All Indicators";
    return ind.charAt(0).toUpperCase() + ind.slice(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              German Economic Insights
            </h1>
            <p className="text-xl opacity-90 mb-8">
              Explore key economic indicators and trends across Germany's
              regions through interactive data, AI-powered chat, and audio
              summaries.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Select
                defaultValue={indicator}
                onValueChange={handleIndicatorChange}
              >
                <SelectTrigger className="w-full sm:w-64 bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Select Indicator" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Indicators</SelectItem>
                  <SelectItem value="gender equality">
                    Gender Equality
                  </SelectItem>
                  <SelectItem value="labour">Labour</SelectItem>
                  <SelectItem value="marcoeconomy">MacroEconomy</SelectItem>
                  <SelectItem value="health">Health</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="subjective wellbeing">
                    Subjective WellBeing
                  </SelectItem>
                  <SelectItem value="emission trading">
                    Emission Trading
                  </SelectItem>
                  <SelectItem value="transport">Transport</SelectItem>
                  <SelectItem value="refugees & migration">
                    Refugees And Migration
                  </SelectItem>
                  <SelectItem value="energy_climate">
                    Energy & Climate
                  </SelectItem>
                  <SelectItem value="construction_housing">
                    Construction & Housing
                  </SelectItem>
                </SelectContent>
              </Select>

              {indicator !== "all" && !isPodcastGenerating && !podcastAudio && (
                <Button
                  onClick={generatePodcast}
                  className="bg-white text-purple-700 hover:bg-white/90"
                >
                  <Headphones className="h-4 w-4 mr-2" />
                  Generate Podcast
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="trends" className="mb-8">
          <TabsList
            className="grid w-full grid-cols-3  
           mb-8"
          >
            <TabsTrigger
              value="trends"
              className="flex items-center justify-center"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Data Trends
            </TabsTrigger>
            <TabsTrigger
              value="chat"
              className="flex items-center justify-center"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Ask AI Assistant
            </TabsTrigger>
            <TabsTrigger
              value="stories"
              className="flex items-center justify-center"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Data Stories
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trends" className="space-y-8">
            {/* Trends Section */}
            <section>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                  {indicator === "all"
                    ? "Featured Economic Trends"
                    : `${getIndicatorTitle(indicator)} Insights`}
                </h2>
                {indicator !== "all" && (
                  <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    Selected: {getIndicatorTitle(indicator)}
                  </div>
                )}
              </div>

              {loading ? (
                <div className="p-8 rounded-xl shadow bg-white text-center">
                  <img
                    src={load.src || "/placeholder.svg"}
                    alt="Loading..."
                    className="mx-auto w-20 h-20"
                  />
                  <p className="mt-4 text-gray-600">
                    Analyzing economic data...
                  </p>
                </div>
              ) : trendList.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-3">
                  {trendList.map((trend, index) => (
                    <TrendCard
                      key={index}
                      title={trend.title}
                      value={trend.value}
                      trend={trend.trend === "flat" ? "neutral" : trend.trend}
                      icon={
                        trend.trend === "up" ? (
                          <ArrowUp className="h-4 w-4 text-red-500" />
                        ) : trend.trend === "down" ? (
                          <ArrowDown className="h-4 w-4 text-green-500" />
                        ) : (
                          <TrendingUp className="h-4 w-4 text-gray-500" />
                        )
                      }
                      description={trend.description}
                    />
                  ))}
                </div>
              ) : indicator === "all" ? (
                <div className="grid gap-6 md:grid-cols-3">
                  <TrendCard
                    title="Current Inflation"
                    value="4.2%"
                    trend="up"
                    icon={<ArrowUp className="h-4 w-4 text-red-500" />}
                    description="Increased by 0.3% from previous quarter"
                  />
                  <TrendCard
                    title="Unemployment Rate"
                    value="6.1%"
                    trend="down"
                    icon={<ArrowDown className="h-4 w-4 text-green-500" />}
                    description="Decreased by 0.2% from previous quarter"
                  />
                  <TrendCard
                    title="GDP Growth"
                    value="+0.9%"
                    trend="up"
                    icon={<TrendingUp className="h-4 w-4 text-green-500" />}
                    description="Increased by 0.4% from previous quarter"
                  />
                </div>
              ) : trendData ? (
                <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {trendData}
                  </p>
                </div>
              ) : (
                <div className="bg-white p-8 rounded-xl shadow text-center border border-gray-100">
                  <p className="text-gray-600">
                    Select an indicator to view economic trends.
                  </p>
                </div>
              )}
            </section>
          </TabsContent>

          <TabsContent value="chat" className="space-y-8">
            {/* Chat Section */}
            <section>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                  Ask About the Data
                </h2>
                {indicator !== "all" && (
                  <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    Context: {getIndicatorTitle(indicator)}
                  </div>
                )}
              </div>
              <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
                <ChatBox indicator={indicator} />
              </div>
            </section>
          </TabsContent>

          <TabsContent value="stories" className="space-y-8">
            {/* Stories Section */}
            <section>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                  Data Stories
                </h2>
                {indicator !== "all" && (
                  <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    Context: {getIndicatorTitle(indicator)}
                  </div>
                )}
              </div>
              <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
                <div className="p-6">
                  <StoryTemplates
                    onSelectTemplate={(template) =>
                      console.log("Selected template:", template)
                    }
                  />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden mt-6">
                <div className="p-6">
                  <StoryGenerator indicator={indicator} />
                </div>
              </div>
            </section>
          </TabsContent>
        </Tabs>

        {/* Podcast Section - Now below the chat box */}
        <section className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <Headphones className="h-6 w-6 text-purple-600 mr-3" />
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                Audio Insights
              </h2>
            </div>
          </div>

          {isPodcastGenerating ? (
            <div className="bg-white p-8 rounded-xl shadow border border-gray-100 flex flex-col items-center justify-center">
              <Loader2 className="h-10 w-10 animate-spin text-purple-600 mb-4" />
              <p className="text-gray-600">
                Generating audio insights for {getIndicatorTitle(indicator)}...
              </p>
            </div>
          ) : podcastAudio ? (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 p-6 rounded-xl shadow border border-purple-100">
                <audio ref={audioRef} src={podcastAudio} className="hidden" />

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                  <div className="flex items-center">
                    <Button
                      onClick={togglePlayPause}
                      size="icon"
                      variant="ghost"
                      className="h-14 w-14 rounded-full bg-purple-600 text-white hover:bg-purple-700 mr-4 shadow-md"
                    >
                      {isPlaying ? (
                        <Pause className="h-6 w-6" />
                      ) : (
                        <Play className="h-6 w-6 ml-1" />
                      )}
                    </Button>
                    <div>
                      <h3 className="font-medium text-lg text-gray-900">
                        {getIndicatorTitle(indicator)} Audio Summary
                      </h3>
                      <p className="text-sm text-gray-600">
                        Economic insights podcast • {formatTime(duration)}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={toggleTranscript}
                      title="View transcript"
                      className="flex items-center gap-1 border-purple-200 text-purple-700 hover:bg-purple-50"
                    >
                      <FileText className="h-4 w-4" />
                      <span>{showTranscript ? "Hide" : "Show"} Transcript</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(podcastAudio, "_blank")}
                      title="Download podcast"
                      className="flex items-center gap-1 border-purple-200 text-purple-700 hover:bg-purple-50"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download</span>
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Volume2 className="h-4 w-4 text-purple-600 flex-shrink-0" />
                    <Slider
                      value={[currentTime]}
                      max={duration || 100}
                      step={0.1}
                      onValueChange={handleSliderChange}
                      className="flex-1"
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>
              </div>

              {showTranscript && podcastTranscript && (
                <Card className="bg-white border border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium text-gray-900 flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-purple-600" />
                        Transcript
                      </h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowTranscript(false)}
                        className="h-6 w-6 text-gray-500 hover:text-gray-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="prose prose-sm max-w-none">
                      <p className="whitespace-pre-line text-gray-700 leading-relaxed">
                        {podcastTranscript}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-xl shadow border border-gray-100 text-center">
              <Volume2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Audio Available
              </h3>
              <p className="text-gray-600 max-w-md mx-auto mb-6">
                {indicator !== "all"
                  ? "Generate an audio summary to hear insights about the selected economic indicator."
                  : "Select a specific indicator and generate an audio summary to hear insights."}
              </p>
              {indicator !== "all" && (
                <Button
                  onClick={generatePodcast}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Headphones className="h-4 w-4 mr-2" />
                  Generate Audio Summary
                </Button>
              )}
            </div>
          )}
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-16 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-500 text-sm">
            <p>
              © 2025 German Economic Insights. All data is for demonstration
              purposes.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
