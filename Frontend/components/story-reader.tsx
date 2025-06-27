"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Clock,
  BookOpen,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Eye,
  EyeOff,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import type { Story } from "@/types/story";
import FantasticDataVisualization from "./fantastic-data-visualization";

interface StoryReaderProps {
  story: Story;
  onBack: () => void;
  domainColor: string;
  domainId: string;
  domainData: any;
}

export default function StoryReader({
  story,
  onBack,
  domainColor,
  domainId,
  domainData,
}: StoryReaderProps) {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [showVisualization, setShowVisualization] = useState(true);

  const currentSection = story.sections[currentSectionIndex];
  const isFirstSection = currentSectionIndex === 0;
  const isLastSection = currentSectionIndex === story.sections.length - 1;
  const progressPercentage =
    ((currentSectionIndex + 1) / story.sections.length) * 100;

  const nextSection = () => {
    if (!isLastSection) {
      setCurrentSectionIndex(currentSectionIndex + 1);
    }
  };

  const prevSection = () => {
    if (!isFirstSection) {
      setCurrentSectionIndex(currentSectionIndex - 1);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm";
      case "intermediate":
        return "bg-amber-50 text-amber-700 border-amber-200 shadow-sm";
      case "advanced":
        return "bg-rose-50 text-rose-700 border-rose-200 shadow-sm";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200 shadow-sm";
    }
  };

  const getDomainGradient = (color: string) => {
    switch (color) {
      case "blue":
        return "from-blue-500 to-cyan-500";
      case "purple":
        return "from-purple-500 to-pink-500";
      case "indigo":
        return "from-indigo-500 to-blue-500";
      default:
        return "from-blue-500 to-purple-500";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 max-w-5xl">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={onBack}
              className="hover:bg-slate-100"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Stories
            </Button>

            <div className="flex items-center gap-4">
              <div className="text-sm text-slate-600">
                Section {currentSectionIndex + 1} of {story.sections.length}
              </div>
              <Progress value={progressPercentage} className="w-32" />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="space-y-6">
            <div className="relative">
              <div
                className={`absolute inset-0 bg-gradient-to-r ${getDomainGradient(
                  domainColor
                )} opacity-5 rounded-2xl`}
              />
              <div className="relative p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div
                    className={`p-3 rounded-xl bg-gradient-to-r ${getDomainGradient(
                      domainColor
                    )} text-white shadow-lg`}
                  >
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h1 className="text-4xl font-bold tracking-tight mb-3 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                      {story.title}
                    </h1>
                    <p className="text-xl text-slate-600 leading-relaxed">
                      {story.subtitle}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-6 text-sm">
                  <div className="flex items-center gap-2 px-3 py-2 bg-white/80 rounded-lg shadow-sm">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">
                      {story.readTime} min read
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 bg-white/80 rounded-lg shadow-sm">
                    <BookOpen className="h-4 w-4 text-green-500" />
                    <span className="font-medium">
                      {story.sections.length} sections
                    </span>
                  </div>
                  <Badge className={getDifficultyColor(story.difficulty)}>
                    {story.difficulty}
                  </Badge>
                  <span className="text-slate-500">
                    Updated {story.lastUpdated}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {story.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="bg-slate-100 text-slate-700 hover:bg-slate-200"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Thesis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="mb-10 shadow-lg border-0 bg-gradient-to-br from-white to-slate-50">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                Central Thesis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg leading-relaxed text-slate-700 font-medium">
                {story.thesis}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Enhanced Section Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">
                    Section {currentSectionIndex + 1}: {currentSection.heading}
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    {currentSectionIndex + 1} of {story.sections.length}{" "}
                    sections
                  </p>
                </div>
                <Button
                  variant={showVisualization ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowVisualization(!showVisualization)}
                  className="gap-2"
                >
                  {showVisualization ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                  {showVisualization ? "Hide" : "Show"} Data
                </Button>
              </div>

              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={prevSection}
                  disabled={isFirstSection}
                  className="gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                <div className="flex-1">
                  <Progress value={progressPercentage} className="h-3" />
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={nextSection}
                  disabled={isLastSection}
                  className="gap-2"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Enhanced Current Section */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSectionIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="mb-10"
          >
            <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-slate-50">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl font-bold text-slate-800">
                  {currentSection.heading}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-slate prose-lg max-w-none">
                  {currentSection.content
                    .split("\n\n")
                    .map((paragraph, index) => (
                      <motion.p
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="mb-6 leading-relaxed text-slate-700"
                      >
                        {paragraph}
                      </motion.p>
                    ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Enhanced Data Visualization */}
        <AnimatePresence>
          {showVisualization && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-10"
            >
              <Card className="shadow-xl border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500 rounded-lg">
                      <BarChart3 className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-slate-800">
                        Section Data Analysis
                      </CardTitle>
                      <p className="text-sm text-slate-600 mt-1">
                        Interactive visualizations based on the data and themes
                        discussed in this section
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <FantasticDataVisualization
                    domainId={domainId}
                    storyId={story.id}
                    sectionIndex={currentSectionIndex}
                  />
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <Separator className="my-10" />

        {/* Enhanced Navigation Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg"
        >
          <Button
            variant="outline"
            onClick={prevSection}
            disabled={isFirstSection}
            className="gap-2 px-6 py-3"
            size="lg"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous Section
          </Button>

          <div className="text-center">
            <div className="text-sm text-slate-500 mb-1">Progress</div>
            <div className="text-lg font-bold text-slate-800">
              {currentSectionIndex + 1} / {story.sections.length}
            </div>
          </div>

          <Button
            onClick={nextSection}
            disabled={isLastSection}
            className="gap-2 px-6 py-3"
            size="lg"
          >
            Next Section
            <ChevronRight className="h-4 w-4" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
