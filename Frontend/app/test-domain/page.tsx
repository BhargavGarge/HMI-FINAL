"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Clock,
  User,
  TrendingUp,
  BarChart3,
  Search,
  Filter,
  Calendar,
  Users,
  BookOpen,
  Sparkles,
  ArrowRight,
  Grid3X3,
  List,
} from "lucide-react";
import { stories, type Story } from "@/story-card-data/card-data";
import { StoryDetailView } from "@/components/story-detail-view";

type ViewMode = "grid" | "list";
type SortOption = "newest" | "oldest" | "title" | "readTime";

export default function HomePage() {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedAuthor, setSelectedAuthor] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  // Get unique categories and authors for filters
  const categories = useMemo(() => {
    const cats = stories.map((story) => story.category).filter(Boolean);
    return [...new Set(cats)] as string[];
  }, []);

  const authors = useMemo(() => {
    const auths = stories.map((story) => story.author).filter(Boolean);
    return [...new Set(auths)] as string[];
  }, []);

  // Filter and sort stories
  const filteredAndSortedStories = useMemo(() => {
    const filtered = stories.filter((story) => {
      const matchesSearch =
        story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        story.subtitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        story.intro.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || story.category === selectedCategory;
      const matchesAuthor =
        selectedAuthor === "all" || story.author === selectedAuthor;

      return matchesSearch && matchesCategory && matchesAuthor;
    });

    // Sort stories
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.publishDate || "2024-01-01").getTime() -
            new Date(a.publishDate || "2024-01-01").getTime()
          );
        case "oldest":
          return (
            new Date(a.publishDate || "2024-01-01").getTime() -
            new Date(b.publishDate || "2024-01-01").getTime()
          );
        case "title":
          return a.title.localeCompare(b.title);
        // case "readTime":
        //   const aTime = Number.parseInt(a.readTime?.replace(/\D/g, "") || "0");
        //   const bTime = Number.parseInt(b.readTime?.replace(/\D/g, "") || "0");
        //   return aTime - bTime;
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchQuery, selectedCategory, selectedAuthor, sortBy]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedAuthor("all");
    setSortBy("newest");
  };

  if (selectedStory) {
    return (
      <StoryDetailView
        story={selectedStory}
        onBack={() => setSelectedStory(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Enhanced Header Section */}
        <div className="mb-16 text-center relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 rounded-3xl blur-3xl"></div>
          <div className="relative">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-6 py-3 rounded-full text-sm font-medium mb-6 shadow-lg">
              <Sparkles className="w-4 h-4" />
              Data-Driven Insights
            </div>
            <h1 className="text-6xl md:text-7xl font-bold text-slate-900 mb-6 bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 bg-clip-text text-transparent leading-tight">
              Research Stories
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Explore in-depth analysis and insights with interactive data
              visualizations that tell compelling stories
            </p>
            <div className="flex items-center justify-center gap-8 mt-8 text-slate-500">
              <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                <BarChart3 className="w-4 h-4 text-blue-600" />
                <span className="font-medium">{stories.length} Stories</span>
              </div>
              <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="font-medium">Interactive Charts</span>
              </div>
              <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                <Users className="w-4 h-4 text-purple-600" />
                <span className="font-medium">
                  {categories.length} Categories
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Filters Section */}
        <div className="mb-12">
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-blue-600" />
                <CardTitle className="text-lg">
                  Filter & Search Stories
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search stories by title, subtitle, or content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 text-base border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>

              {/* Filter Controls */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Category
                  </label>
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Author
                  </label>
                  <Select
                    value={selectedAuthor}
                    onValueChange={setSelectedAuthor}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="All Authors" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Authors</SelectItem>
                      {authors.map((author) => (
                        <SelectItem key={author} value={author}>
                          {author}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Sort By
                  </label>
                  <Select
                    value={sortBy}
                    onValueChange={(value: SortOption) => setSortBy(value)}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="title">Title A-Z</SelectItem>
                      <SelectItem value="readTime">Reading Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    View
                  </label>
                  <div className="flex gap-2">
                    <Button
                      variant={viewMode === "grid" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className="flex-1 h-11"
                    >
                      <Grid3X3 className="w-4 h-4 mr-2" />
                      Grid
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className="flex-1 h-11"
                    >
                      <List className="w-4 h-4 mr-2" />
                      List
                    </Button>
                  </div>
                </div>
              </div>

              {/* Active Filters & Clear */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <span>
                    Showing {filteredAndSortedStories.length} of{" "}
                    {stories.length} stories
                  </span>
                  {(searchQuery ||
                    selectedCategory !== "all" ||
                    selectedAuthor !== "all") && (
                    <Badge variant="secondary" className="ml-2">
                      Filtered
                    </Badge>
                  )}
                </div>
                {(searchQuery ||
                  selectedCategory !== "all" ||
                  selectedAuthor !== "all") && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stories Display */}
        {filteredAndSortedStories.length === 0 ? (
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="text-center py-16">
              <BookOpen className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-700 mb-2">
                No stories found
              </h3>
              <p className="text-slate-500 mb-4">
                Try adjusting your search or filter criteria
              </p>
              <Button onClick={clearFilters} variant="outline">
                Clear All Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                : "space-y-6"
            }
          >
            {filteredAndSortedStories.map((story) => (
              <StoryCard
                key={story.id || story.title}
                story={story}
                onClick={() => setSelectedStory(story)}
                viewMode={viewMode}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StoryCard({
  story,
  onClick,
  viewMode,
}: {
  story: Story;
  onClick: () => void;
  viewMode: ViewMode;
}) {
  if (viewMode === "list") {
    return (
      <Card className="group cursor-pointer transition-all duration-300 hover:shadow-xl bg-white/90 backdrop-blur-sm border-0 shadow-lg overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                {story.category && (
                  <Badge
                    variant="secondary"
                    className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 border-0 font-medium"
                  >
                    {story.category}
                  </Badge>
                )}
                <div className="flex items-center text-sm text-slate-500 gap-4">
                  {story.author && (
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span>{story.author}</span>
                    </div>
                  )}
                  {story.publishDate && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {new Date(story.publishDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-2 line-clamp-2">
                {story.title}
              </h3>

              {story.subtitle && (
                <p className="text-slate-600 mb-3 line-clamp-2">
                  {story.subtitle}
                </p>
              )}

              <p className="text-slate-500 text-sm line-clamp-2 mb-4">
                {story.intro}
              </p>

              {story.actors && story.actors.length > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-4 h-4 text-slate-400" />
                  <div className="flex flex-wrap gap-1">
                    {story.actors.slice(0, 3).map((actor, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {actor}
                      </Badge>
                    ))}
                    {story.actors.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{story.actors.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>

            <Button
              onClick={onClick}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105"
            >
              Explore
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 bg-white/90 backdrop-blur-sm border-0 shadow-lg overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />

      <CardHeader className="pb-4 relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {story.category && (
              <Badge
                variant="secondary"
                className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 border-0 font-medium"
              >
                {story.category}
              </Badge>
            )}
          </div>
        </div>

        <CardTitle
          className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors cursor-pointer line-clamp-3 leading-tight mb-3"
          onClick={onClick}
        >
          {story.title}
        </CardTitle>

        {story.subtitle && (
          <p className="text-slate-600 text-sm line-clamp-2 leading-relaxed">
            {story.subtitle}
          </p>
        )}
      </CardHeader>

      <CardContent className="relative">
        <p className="text-slate-500 text-sm line-clamp-3 mb-6 leading-relaxed">
          {story.intro}
        </p>

        {story.actors && story.actors.length > 0 && (
          <div className="flex items-center gap-2 mb-6">
            <Users className="w-4 h-4 text-slate-400" />
            <div className="flex flex-wrap gap-1">
              {story.actors.slice(0, 2).map((actor, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {actor}
                </Badge>
              ))}
              {story.actors.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{story.actors.length - 2}
                </Badge>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <User className="w-3 h-3" />
            <span>{story.author}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClick}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-medium group-hover:translate-x-1 transition-all duration-300 bg-blue-50/50"
          >
            Explore
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
