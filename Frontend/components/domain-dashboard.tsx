"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Search,
  TrendingUp,
  Clock,
  BookOpen,
  BarChart3,
  Sparkles,
  Database,
  Users,
  Heart,
  DollarSign,
  Truck,
  Plus,
} from "lucide-react";
import type { Domain, Story } from "@/types/story";

const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case "TrendingUp":
      return TrendingUp;
    case "Heart":
      return Heart;
    case "Users":
      return Users;
    case "DollarSign":
      return DollarSign;
    case "Truck":
      return Truck;
    default:
      return BarChart3; // fallback icon
  }
};

interface DomainDashboardProps {
  domains: Domain[];
  selectedDomain: Domain | null;
  onDomainSelect: (domain: Domain) => void;
  onStorySelect: (story: Story) => void;
  onBack: () => void;
}

export function DomainDashboard({
  domains,
  selectedDomain,
  onDomainSelect,
  onStorySelect,
  onBack,
}: DomainDashboardProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDomains = domains.filter(
    (domain) =>
      domain.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      domain.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredStories = selectedDomain
    ? selectedDomain.stories.filter(
        (story) =>
          story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          story.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          story.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          )
      )
    : [];

  if (selectedDomain) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b shadow-sm"
        >
          <div className="container mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onBack}
                  className="hover:bg-gray-100"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  All Domains
                </Button>
                <div className="flex items-center gap-3">
                  <div
                    className={`p-3 rounded-xl bg-gradient-to-r ${selectedDomain.gradient} text-white shadow-lg`}
                  >
                    {(() => {
                      const IconComponent = getIconComponent(
                        selectedDomain.icon
                      );
                      return <IconComponent className="h-6 w-6" />;
                    })()}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      {selectedDomain.name}
                    </h1>
                    <p className="text-gray-600">
                      {selectedDomain.description}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Badge
                  variant="outline"
                  className="bg-blue-50 text-blue-700 border-blue-200"
                >
                  {selectedDomain.totalStories} Stories
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200"
                >
                  {selectedDomain.totalReadTime}min Total
                </Badge>
              </div>
            </div>

            {/* Search */}
            <div className="mt-6 relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search stories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/80 backdrop-blur-sm"
              />
            </div>
          </div>
        </motion.div>

        {/* Stories Grid */}
        <div className="container mx-auto px-6 py-8">
          {selectedDomain.stories.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="max-w-md mx-auto">
                <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Plus className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Stories Yet
                </h3>
                <p className="text-gray-600 mb-6">
                  This domain is ready for content. Stories will appear here
                  once added.
                </p>
                <Button variant="outline" className="bg-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Story
                </Button>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredStories.map((story, index) => (
                  <motion.div
                    key={story.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="cursor-pointer"
                    onClick={() => onStorySelect(story)}
                  >
                    <Card className="h-full bg-gradient-to-br from-white to-gray-50 shadow-lg hover:shadow-xl transition-all duration-300 border-0">
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between mb-3">
                          <Badge
                            variant="outline"
                            className={`bg-${selectedDomain.color}-50 text-${selectedDomain.color}-700 border-${selectedDomain.color}-200`}
                          >
                            {story.difficulty}
                          </Badge>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className="bg-blue-50 text-blue-700 border-blue-200"
                            >
                              <Clock className="h-3 w-3 mr-1" />
                              {story.readTime}min
                            </Badge>
                            {story.data && (
                              <Badge
                                variant="outline"
                                className="bg-orange-50 text-orange-700 border-orange-200"
                              >
                                <Database className="h-3 w-3 mr-1" />
                                Data
                              </Badge>
                            )}
                          </div>
                        </div>
                        <CardTitle className="text-lg leading-tight mb-2">
                          {story.title}
                        </CardTitle>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {story.subtitle}
                        </p>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <p className="text-sm text-gray-700 line-clamp-3 leading-relaxed">
                            {story.thesis}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {story.tags.slice(0, 3).map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="text-xs bg-gray-100 text-gray-700"
                              >
                                {tag}
                              </Badge>
                            ))}
                            {story.tags.length > 3 && (
                              <Badge
                                variant="secondary"
                                className="text-xs bg-gray-100 text-gray-700"
                              >
                                +{story.tags.length - 3}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <BookOpen className="h-3 w-3" />
                              {story.sections.length} sections
                            </div>
                            <div className="text-xs text-gray-500">
                              Updated{" "}
                              {new Date(story.lastUpdated).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Domain Overview
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white/95 backdrop-blur-sm border-b shadow-sm"
      >
        <div className="container mx-auto px-6 py-8">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-center gap-3 mb-4"
            >
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl shadow-lg">
                <BarChart3 className="h-8 w-8" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900">
                Story Analytics Platform
              </h1>
            </motion.div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore data-driven stories across multiple domains with rich
              visualizations and insights
            </p>
          </div>

          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search domains and stories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/80 backdrop-blur-sm"
            />
          </div>
        </div>
      </motion.div>

      {/* Domains Grid */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredDomains.map((domain, index) => {
              const IconComponent = getIconComponent(domain.icon);
              return (
                <motion.div
                  key={domain.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="cursor-pointer"
                  onClick={() => onDomainSelect(domain)}
                >
                  <Card className="h-full bg-gradient-to-br from-white to-gray-50 shadow-lg hover:shadow-xl transition-all duration-300 border-0 overflow-hidden">
                    <div
                      className={`h-2 bg-gradient-to-r ${domain.gradient}`}
                    />
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-4 mb-4">
                        <div
                          className={`p-3 rounded-xl bg-gradient-to-r ${domain.gradient} text-white shadow-lg`}
                        >
                          {IconComponent && (
                            <IconComponent className="h-6 w-6" />
                          )}
                        </div>
                        <div>
                          <CardTitle className="text-xl">
                            {domain.name}
                          </CardTitle>
                          <p className="text-sm text-gray-600 mt-1">
                            {domain.description}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-3 bg-blue-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">
                              {domain.totalStories}
                            </div>
                            <div className="text-xs text-blue-700">Stories</div>
                          </div>
                          <div className="text-center p-3 bg-green-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">
                              {domain.totalReadTime}
                            </div>
                            <div className="text-xs text-green-700">
                              Min Read
                            </div>
                          </div>
                        </div>

                        {domain.totalStories > 0 ? (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                              <Sparkles className="h-4 w-4" />
                              Recent Stories
                            </div>
                            {domain.stories.slice(0, 2).map((story) => (
                              <div
                                key={story.id}
                                className="p-2 bg-gray-50 rounded text-xs"
                              >
                                <div className="font-medium text-gray-800 line-clamp-1">
                                  {story.title}
                                </div>
                                <div className="text-gray-600 mt-1 flex items-center gap-2">
                                  <Clock className="h-3 w-3" />
                                  {story.readTime}min
                                  {story.data && (
                                    <>
                                      <Database className="h-3 w-3" />
                                      Data
                                    </>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-4">
                            <div className="text-gray-400 mb-2">
                              <Plus className="h-8 w-8 mx-auto" />
                            </div>
                            <div className="text-sm text-gray-600">
                              Ready for content
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
