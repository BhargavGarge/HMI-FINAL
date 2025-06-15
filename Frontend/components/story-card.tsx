"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Calendar, Target, ArrowRight } from "lucide-react";
import type { Story } from "@/types/story";

interface StoryCardProps {
  story: Story;
  onSelect: (story: Story) => void;
  domainColor: string;
}

export function StoryCard({ story, onSelect, domainColor }: StoryCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "Advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className="h-full hover:shadow-lg transition-all duration-300 bg-white border-l-4"
        style={{ borderLeftColor: `var(--${domainColor}-500)` }}
      >
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="text-lg leading-tight mb-2 line-clamp-2">
                {story.title}
              </CardTitle>
              <CardDescription className="line-clamp-2">
                {story.subtitle}
              </CardDescription>
            </div>
            <Badge className={getDifficultyColor(story.difficulty)}>
              {story.difficulty}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-4">
            <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
              {story.thesis}
            </p>

            <div className="flex flex-wrap gap-1">
              {story.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {story.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{story.tags.length - 3}
                </Badge>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{story.readTime}min</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>
                    {new Date(story.lastUpdated).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Target className="h-3 w-3" />
                  <span>{story.sections.length} sections</span>
                </div>
              </div>
              <Button
                size="sm"
                onClick={() => onSelect(story)}
                className="text-xs"
              >
                Read
                <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
