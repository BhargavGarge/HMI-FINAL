"use client";

import type { Story } from "@/types/story";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface StoryListProps {
  stories: Story[];
  onStoryClick: (story: Story) => void;
}

export function StoryList({ stories, onStoryClick }: StoryListProps) {
  if (!stories || stories.length === 0) {
    return (
      <p className="text-gray-500">No stories available in this domain.</p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stories.map((story) => (
        <Card
          key={story.id}
          className="flex flex-col hover:shadow-lg transition-shadow"
        >
          <CardHeader>
            <CardTitle className="text-xl">{story.title}</CardTitle>
            <CardDescription className="text-sm line-clamp-2">
              {story.subtitle}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="space-y-2 mb-4">
              <Badge variant="outline">{story.difficulty}</Badge>
              <Badge variant="secondary">{story.readTime} min read</Badge>
            </div>
            <p className="text-xs text-gray-500 mb-4">
              Last updated: {new Date(story.lastUpdated).toLocaleDateString()}
            </p>
            <div className="flex flex-wrap gap-1 mb-4">
              {story.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
          <div className="p-6 pt-0">
            <Button onClick={() => onStoryClick(story)} className="w-full">
              Read Story
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
