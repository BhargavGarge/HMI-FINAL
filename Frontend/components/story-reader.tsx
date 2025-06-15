// This is the existing file, ensure it matches the one you have.
// If it was provided in a previous message and is correct, no changes needed here.
// Using the version from attachment: story-reader-N0dwrHKvBKXfVJnOJPboS2xlygKcfB.tsx
"use client";

import { useState, useEffect, useMemo } from "react"; // Added useMemo
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  Lightbulb,
  CheckCircle,
  BarChart3,
  Sparkles,
  TrendingUp,
  Database,
  Zap,
  Users,
  Layers,
} from "lucide-react";
import type { Story, StoryData } from "@/types/story"; // Assuming StoryData is also in types/story.ts
import { FantasticDataVisualization } from "@/components/fantastic-data-visualization";

// Color mappings for proper Tailwind classes
const colorClasses = {
  blue: {
    bg50: "bg-blue-50",
    bg100: "bg-blue-100",
    text600: "text-blue-600",
    text700: "text-blue-700",
    text900: "text-blue-900",
    border500: "border-blue-500",
    bg500: "bg-blue-500",
  },
  green: {
    bg50: "bg-green-50",
    bg100: "bg-green-100",
    text600: "text-green-600",
    text700: "text-green-700",
    text900: "text-green-900",
    border500: "border-green-500",
    bg500: "bg-green-500",
  },
  purple: {
    bg50: "bg-purple-50",
    bg100: "bg-purple-100",
    text600: "text-purple-600",
    text700: "text-purple-700",
    text900: "text-purple-900",
    border500: "border-purple-500",
    bg500: "bg-purple-500",
  },
  yellow: {
    bg50: "bg-yellow-50",
    bg100: "bg-yellow-100",
    text600: "text-yellow-600",
    text700: "text-yellow-700",
    text900: "text-yellow-900",
    border500: "border-yellow-500",
    bg500: "bg-yellow-500",
  },
  indigo: {
    bg50: "bg-indigo-50",
    bg100: "bg-indigo-100",
    text600: "text-indigo-600",
    text700: "text-indigo-700",
    text900: "text-indigo-900",
    border500: "border-indigo-500",
    bg500: "bg-indigo-500",
  },
  pink: {
    // Added pink as it's used in a gradient in domains.ts
    bg50: "bg-pink-50",
    bg100: "bg-pink-100",
    text600: "text-pink-600",
    text700: "text-pink-700",
    text900: "text-pink-900",
    border500: "border-pink-500",
    bg500: "bg-pink-500",
  },
  cyan: {
    // Added cyan as it's used in a gradient in domains.ts
    bg50: "bg-cyan-50",
    bg100: "bg-cyan-100",
    text600: "text-cyan-600",
    text700: "text-cyan-700",
    text900: "text-cyan-900",
    border500: "border-cyan-500",
    bg500: "bg-cyan-500",
  },
  orange: {
    // Added orange for FantasticDataVisualization stats
    bg50: "bg-orange-50",
    bg100: "bg-orange-100",
    text600: "text-orange-600",
    text700: "text-orange-700",
    text900: "text-orange-900",
    border500: "border-orange-500",
    bg500: "bg-orange-500",
  },
  default: {
    // Fallback colors
    bg50: "bg-gray-50",
    bg100: "bg-gray-100",
    text600: "text-gray-600",
    text700: "text-gray-700",
    text900: "text-gray-900",
    border500: "border-gray-500",
    bg500: "bg-gray-500",
  },
};

// Updated hasRelevantData to check domainData
const hasRelevantData = (domainData?: StoryData): boolean => {
  if (!domainData) return false;
  return Object.keys(domainData).length > 0;
};

// Get domain icon
const getDomainIcon = (domainId?: string) => {
  switch (domainId) {
    case "macroeconomics":
      return TrendingUp;
    case "Energy": // Ensure exact match with domainId in domains.ts
      return Zap;
    case "gender-equality":
      return Users;
    default:
      return Layers; // Default icon
  }
};

interface StoryReaderProps {
  story: Story;
  onBack: () => void;
  domainColor: string;
  domainId?: string;
  domainData?: StoryData; // Changed to StoryData for more specific typing
}

export function StoryReader({
  story,
  onBack,
  domainColor,
  domainId,
  domainData,
}: StoryReaderProps) {
  const [currentSection, setCurrentSection] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);

  const colors =
    colorClasses[domainColor as keyof typeof colorClasses] ||
    colorClasses.default;
  const DomainIcon = getDomainIcon(domainId);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoPlay && currentSection < story.sections.length - 1) {
      interval = setInterval(() => {
        setCurrentSection((prev) => {
          const nextSection = prev + 1;
          setReadingProgress((nextSection / story.sections.length) * 100);
          return nextSection;
        });
      }, 15000); // 15 seconds per section for data analysis
    }
    return () => clearInterval(interval);
  }, [isAutoPlay, currentSection, story.sections.length]);

  useEffect(() => {
    const currentContent = story.sections[currentSection]?.content || "";
    const words = currentContent.split(/\s+/).filter(Boolean).length;
    setWordCount(words);
    setReadingTime(Math.ceil(words / 200)); // Average reading speed: 200 words per minute
    setReadingProgress(((currentSection + 1) / story.sections.length) * 100);
  }, [currentSection, story.sections]);

  const resetReading = () => {
    setCurrentSection(0);
    setReadingProgress((1 / story.sections.length) * 100);
    setIsAutoPlay(false);
  };

  const currentSectionData = story.sections[currentSection];

  const getSectionIcon = (index: number) => {
    if (index < currentSection)
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (index === currentSection)
      return <Sparkles className={`h-4 w-4 ${colors.text600}`} />;
    return <div className="w-4 h-4 rounded-full border-2 border-gray-300" />;
  };

  const sectionHasDataForViz = useMemo(
    () => hasRelevantData(domainData),
    [domainData]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Enhanced Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b shadow-sm"
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="hover:bg-gray-100"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <DomainIcon className={`h-5 w-5 ${colors.text600}`} />
                  {story.title}
                </h1>
                <p className="text-sm text-gray-600">{story.subtitle}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 border-green-200"
              >
                {story.difficulty}
              </Badge>
              <Badge
                variant="outline"
                className={`${colors.bg50} ${colors.text700} border-${domainColor}-200`}
              >
                {story.readTime}min read
              </Badge>
              <Badge
                variant="outline"
                className="bg-purple-50 text-purple-700 border-purple-200"
              >
                {readingTime}min section
              </Badge>
              {domainData && Object.keys(domainData).length > 0 && (
                <Badge
                  variant="outline"
                  className="bg-orange-50 text-orange-700 border-orange-200"
                >
                  <Database className="h-3 w-3 mr-1" />
                  Real Data
                </Badge>
              )}
            </div>
          </div>

          {/* Enhanced Progress */}
          <div className="mt-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Reading Progress</span>
              <span className="text-gray-600">
                {Math.round(readingProgress)}% • {wordCount} words
              </span>
            </div>
            <Progress
              value={readingProgress}
              className={`h-3 ${colors.bg100} [&>*]:bg-${domainColor}-500`}
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>
                Section {currentSection + 1} of {story.sections.length}
              </span>
              <span>
                ~{Math.round((story.readTime * (100 - readingProgress)) / 100)}
                min remaining
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Enhanced Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 space-y-6">
              {/* Reading Controls */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="bg-gradient-to-br from-white to-gray-50 shadow-lg">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Play className={`h-5 w-5 ${colors.text600}`} />
                      Reading Controls
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={isAutoPlay ? "default" : "outline"}
                        onClick={() => setIsAutoPlay(!isAutoPlay)}
                        className={`flex-1 ${
                          isAutoPlay
                            ? `${colors.bg500} hover:${colors.bg500}/90 text-white`
                            : ""
                        }`}
                      >
                        {isAutoPlay ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                        {isAutoPlay ? "Pause" : "Auto-play"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={resetReading}
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                      <div className="flex justify-between mb-1">
                        <span>Current:</span>
                        <span className="font-medium">
                          Section {currentSection + 1}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Remaining:</span>
                        <span className="font-medium">
                          {story.sections.length - currentSection - 1} sections
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Enhanced Table of Contents */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="bg-gradient-to-br from-white to-gray-50 shadow-lg">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BarChart3 className={`h-5 w-5 ${colors.text600}`} />
                      Contents
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {story.sections.map((section, index) => {
                        return (
                          <motion.button
                            key={index}
                            onClick={() => setCurrentSection(index)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`w-full text-left p-3 rounded-lg text-sm transition-all ${
                              index === currentSection
                                ? `${colors.bg50} ${colors.text700} border-l-4 ${colors.border500} shadow-sm`
                                : index < currentSection
                                ? "bg-green-50 text-green-700 border-l-4 border-green-500"
                                : "hover:bg-gray-50 border-l-4 border-transparent"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              {getSectionIcon(index)}
                              <div className="flex-1 min-w-0">
                                <span className="line-clamp-2 font-medium">
                                  {section.heading}
                                </span>
                                <div className="flex items-center gap-2 mt-1">
                                  <div className="text-xs text-gray-500">
                                    {
                                      section.content
                                        .split(/\s+/)
                                        .filter(Boolean).length
                                    }{" "}
                                    words
                                  </div>
                                  {sectionHasDataForViz && ( // Check if domain has data, not specific section
                                    <div
                                      className={`text-xs ${colors.bg100} ${colors.text700} px-1 rounded`}
                                    >
                                      📊 Data
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Story Stats */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="bg-gradient-to-br from-white to-gray-50 shadow-lg">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg">Story Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div
                        className={`text-center p-3 ${colors.bg50} rounded-lg`}
                      >
                        <div className={`text-lg font-bold ${colors.text600}`}>
                          {story.sections.length}
                        </div>
                        <div className={`text-xs ${colors.text700}`}>
                          Sections
                        </div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-lg font-bold text-green-600">
                          {story.tags.length}
                        </div>
                        <div className="text-xs text-green-700">Tags</div>
                      </div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-lg font-bold text-purple-600">
                        {new Date(story.lastUpdated).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-purple-700">
                        Last Updated
                      </div>
                    </div>
                    {domainData && Object.keys(domainData).length > 0 && (
                      <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <div className="text-lg font-bold text-orange-600">
                          {Object.keys(domainData).length}
                        </div>
                        <div className="text-xs text-orange-700">
                          Data Categories
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>

          {/* Enhanced Main Content */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSection}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="mb-8 bg-gradient-to-br from-white to-gray-50 shadow-xl border-0">
                  <CardHeader
                    className={`bg-gradient-to-r ${colors.bg50} to-gray-50 border-b`}
                  >
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-2xl flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${colors.bg500} text-white`}
                        >
                          {currentSection + 1}
                        </div>
                        {currentSectionData.heading}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-white/80">
                          {currentSection + 1} / {story.sections.length}
                        </Badge>
                        {sectionHasDataForViz && (
                          <Badge
                            variant="outline"
                            className={`${colors.bg100} ${colors.text700}`}
                          >
                            <Database className="h-3 w-3 mr-1" />
                            Data Available
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-8">
                    {/* Thesis (only for first section) */}
                    {currentSection === 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className={`mb-8 p-6 bg-gradient-to-r ${colors.bg50} ${colors.bg100} rounded-xl border-l-4 ${colors.border500} shadow-sm`}
                      >
                        <div className="flex items-start gap-3">
                          <Lightbulb
                            className={`h-6 w-6 ${colors.text600} mt-1 flex-shrink-0`}
                          />
                          <div>
                            <h4
                              className={`font-bold ${colors.text900} mb-3 text-lg`}
                            >
                              Central Thesis
                            </h4>
                            <p className="text-gray-700 leading-relaxed text-base">
                              {story.thesis}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Content with enhanced typography */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="prose prose-lg max-w-none"
                    >
                      {currentSectionData.content
                        .split("\n\n")
                        .map((paragraph, index) => (
                          <motion.p
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * index }}
                            className="mb-6 leading-relaxed text-gray-700 text-base"
                          >
                            {paragraph}
                          </motion.p>
                        ))}
                    </motion.div>

                    {/* Fantastic Data Visualization */}
                    {sectionHasDataForViz && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mt-8"
                      >
                        <div className="flex items-center gap-2 text-gray-700 mb-4">
                          <BarChart3 className={`h-6 w-6 ${colors.text600}`} />
                          <span className="font-bold text-lg">
                            Data Analysis & Insights
                          </span>
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700 border-green-200"
                          >
                            Fantastic System
                          </Badge>
                        </div>
                        <FantasticDataVisualization
                          story={story}
                          sectionIndex={currentSection}
                          domain={domainId}
                          domainData={domainData}
                          className="my-8"
                        />
                      </motion.div>
                    )}

                    {/* Enhanced Navigation */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="flex justify-between items-center mt-12 pt-8 border-t border-gray-200"
                    >
                      <Button
                        variant="outline"
                        onClick={() =>
                          setCurrentSection(Math.max(0, currentSection - 1))
                        }
                        disabled={currentSection === 0}
                        className="flex items-center gap-2 px-6 py-3"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </Button>

                      <div className="flex gap-2">
                        {story.sections.map((_, index) => (
                          <motion.button
                            key={index}
                            onClick={() => setCurrentSection(index)}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            className={`w-4 h-4 rounded-full transition-all ${
                              index === currentSection
                                ? colors.bg500
                                : index < currentSection
                                ? "bg-green-400"
                                : "bg-gray-300"
                            }`}
                          />
                        ))}
                      </div>

                      <Button
                        variant="outline"
                        onClick={() =>
                          setCurrentSection(
                            Math.min(
                              story.sections.length - 1,
                              currentSection + 1
                            )
                          )
                        }
                        disabled={currentSection === story.sections.length - 1}
                        className="flex items-center gap-2 px-6 py-3"
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
