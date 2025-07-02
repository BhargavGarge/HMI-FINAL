"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, User, TrendingUp, BarChart3 } from "lucide-react";
import { stories, type Story } from "@/story-card-data/card-data";
import { StoryDetailView } from "@/components/story-detail-view";

export default function HomePage() {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);

  if (selectedStory) {
    return (
      <StoryDetailView
        story={selectedStory}
        onBack={() => setSelectedStory(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <TrendingUp className="w-4 h-4" />
            Data-Driven Insights
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-4 bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
            Research Stories
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Explore in-depth analysis and insights with interactive data
            visualizations
          </p>
          <div className="flex items-center justify-center gap-6 mt-6 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span>{stories.length} Stories</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span>Interactive Charts</span>
            </div>
          </div>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stories.map((story) => (
            <StoryCard
              key={story.id}
              story={story}
              onClick={() => setSelectedStory(story)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function StoryCard({ story, onClick }: { story: Story; onClick: () => void }) {
  return (
    <Card className="group cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 bg-white/80 backdrop-blur-sm border-0 shadow-lg overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <CardHeader className="pb-4 relative">
        <div className="flex items-center gap-2 mb-4">
          <Badge
            variant="secondary"
            className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 border-0 font-medium"
          >
            {story.category}
          </Badge>
          <div className="flex items-center text-sm text-slate-500 gap-1">
            <Clock className="w-3 h-3" />
            <span>{story.readTime}</span>
          </div>
        </div>

        <CardTitle
          className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors cursor-pointer line-clamp-3 leading-tight"
          onClick={onClick}
        >
          {story.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="relative">
        <p className="text-slate-600 text-sm line-clamp-3 mb-6 leading-relaxed">
          {story.subtitle}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <User className="w-3 h-3" />
            <span>{story.author}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClick}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-medium group-hover:translate-x-1 transition-transform"
          >
            Explore →
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
