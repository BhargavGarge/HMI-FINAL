"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Clock,
  BookOpen,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  BarChart3,
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
        return "bg-green-100 text-green-800 border-green-200";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "advanced":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Stories
        </Button>

        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              {story.title}
            </h1>
            <p className="text-xl text-muted-foreground">{story.subtitle}</p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {story.readTime} min read
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              {story.sections.length} sections
            </div>
            <Badge className={getDifficultyColor(story.difficulty)}>
              {story.difficulty}
            </Badge>
            <span>Updated {story.lastUpdated}</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {story.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Thesis */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Thesis</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg leading-relaxed">{story.thesis}</p>
        </CardContent>
      </Card>

      {/* Section Navigation */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">
            Section {currentSectionIndex + 1} of {story.sections.length}
          </h2>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowVisualization(!showVisualization)}
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              {showVisualization ? "Hide" : "Show"} Data
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={prevSection}
            disabled={isFirstSection}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          <div className="flex-1 bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{
                width: `${
                  ((currentSectionIndex + 1) / story.sections.length) * 100
                }%`,
              }}
            />
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={nextSection}
            disabled={isLastSection}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Current Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{currentSection.heading}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-gray max-w-none">
            {currentSection.content.split("\n\n").map((paragraph, index) => (
              <p key={index} className="mb-4 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Section-Specific Data Visualization */}
      {showVisualization && (
        <div className="mb-8">
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">
              Section Data Analysis
            </h3>
            <p className="text-sm text-muted-foreground">
              Interactive visualizations based on the data and themes discussed
              in this section.
            </p>
          </div>
          <FantasticDataVisualization
            domainId={domainId}
            storyId={story.id}
            sectionIndex={currentSectionIndex}
          />
        </div>
      )}

      <Separator className="my-8" />

      {/* Navigation Footer */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={prevSection}
          disabled={isFirstSection}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous Section
        </Button>

        <span className="text-sm text-muted-foreground">
          {currentSectionIndex + 1} / {story.sections.length}
        </span>

        <Button onClick={nextSection} disabled={isLastSection}>
          Next Section
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
