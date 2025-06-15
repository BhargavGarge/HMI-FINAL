"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  Filter,
  BookOpen,
  Star,
  Sparkles,
  Grid3X3,
  List,
  ArrowLeft,
} from "lucide-react";
import { domains as initialDomainsData } from "@/data/domains"; // Use alias for clarity
import { DomainCard } from "@/components/domain-card"; // Assuming this component exists
import { StoryCard } from "@/components/story-card"; // Assuming this component exists
import { StoryReader } from "@/components/story-reader";
import type { Domain, Story } from "@/types/story";

type ViewMode = "domains" | "stories" | "reader";

export default function HomePage() {
  const [viewMode, setViewMode] = useState<ViewMode>("domains");
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [layoutMode, setLayoutMode] = useState<"grid" | "list">("grid");

  const domains: Domain[] = initialDomainsData; // Use the imported data directly

  const handleDomainSelect = (domain: Domain) => {
    setSelectedDomain(domain);
    setSelectedStory(null); // Reset story when domain changes
    setViewMode("stories");
    setSearchQuery(""); // Clear search query when changing domain
  };

  const handleStorySelect = (story: Story) => {
    setSelectedStory(story);
    // Ensure selectedDomain is set if a story is selected (e.g., if navigating directly)
    if (!selectedDomain && story.domainId) {
      const parentDomain = domains.find((d) => d.id === story.domainId);
      if (parentDomain) setSelectedDomain(parentDomain);
    }
    setViewMode("reader");
  };

  const handleBackToDomains = () => {
    setSelectedDomain(null);
    setSelectedStory(null);
    setViewMode("domains");
    setSearchQuery(""); // Clear search query
  };

  const handleBackToStories = () => {
    setSelectedStory(null);
    setViewMode("stories"); // Stay in the context of the currently selectedDomain
    // Optionally, you might want to clear story-specific search query here or preserve it
  };

  const filteredDomains = domains.filter(
    (domain) =>
      domain.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      domain.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredStories =
    selectedDomain?.stories.filter(
      (story) =>
        story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (story.subtitle &&
          story.subtitle.toLowerCase().includes(searchQuery.toLowerCase())) || // Check if subtitle exists
        story.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        )
    ) || [];

  const totalStories = domains.reduce(
    (acc, domain) => acc + domain.totalStories,
    0
  );
  const totalReadTime = domains.reduce(
    (acc, domain) => acc + domain.totalReadTime,
    0
  );

  // Key change: Pass domainData to StoryReader
  if (viewMode === "reader" && selectedStory && selectedDomain) {
    return (
      <StoryReader
        story={selectedStory}
        onBack={handleBackToStories}
        domainColor={selectedDomain.color}
        domainId={selectedDomain.id}
        domainData={selectedDomain.data} // Crucial: Pass domain-specific data
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 sm:gap-4">
              {viewMode !== "domains" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={
                    viewMode === "stories"
                      ? handleBackToDomains
                      : handleBackToStories
                  }
                  className="mr-1 sm:mr-2" // Adjusted margin for responsiveness
                >
                  <ArrowLeft className="h-4 w-4 mr-1 sm:mr-2" />
                  Back
                </Button>
              )}
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg sm:rounded-xl">
                  {" "}
                  {/* Adjusted padding/rounding */}
                  <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight">
                    {viewMode === "domains"
                      ? "Story Domains"
                      : viewMode === "stories"
                      ? selectedDomain?.name
                      : selectedStory?.title}
                  </h1>
                  {(viewMode === "domains" ||
                    (viewMode === "stories" && selectedDomain) ||
                    (viewMode === "reader" && selectedStory)) && (
                    <p className="text-xs sm:text-sm text-gray-500 sm:text-gray-600 mt-0.5 line-clamp-1">
                      {" "}
                      {/* Line clamp for long subtitles */}
                      {viewMode === "domains"
                        ? "Explore stories across different domains"
                        : viewMode === "stories"
                        ? selectedDomain?.description
                        : selectedStory?.subtitle}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Stats - hidden on small screens, flex on md+ */}
            <div className="hidden md:flex items-center gap-4 sm:gap-6 self-start sm:self-center mt-2 sm:mt-0">
              {" "}
              {/* Adjusted alignment for consistency */}
              <div className="text-center">
                <div className="text-lg sm:text-2xl font-bold text-blue-600">
                  {totalStories}
                </div>
                <div className="text-xs sm:text-sm text-gray-500 sm:text-gray-600">
                  Total Stories
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg sm:text-2xl font-bold text-purple-600">
                  {domains.length}
                </div>
                <div className="text-xs sm:text-sm text-gray-500 sm:text-gray-600">
                  Domains
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg sm:text-2xl font-bold text-green-600">
                  {totalReadTime}
                </div>
                <div className="text-xs sm:text-sm text-gray-500 sm:text-gray-600">
                  Minutes
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
            {" "}
            {/* Adjusted for responsiveness */}
            <div className="relative flex-grow sm:flex-1 max-w-full sm:max-w-md">
              {" "}
              {/* Ensure input takes available space */}
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder={
                  viewMode === "domains"
                    ? "Search domains..."
                    : "Search stories..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full" // Ensure full width within its container
              />
            </div>
            <div className="flex items-center gap-2 self-start sm:self-center">
              {" "}
              {/* Align buttons */}
              {viewMode === "stories" && (
                <>
                  <Button
                    variant={layoutMode === "grid" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setLayoutMode("grid")}
                    aria-label="Grid view"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={layoutMode === "list" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setLayoutMode("list")}
                    aria-label="List view"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </>
              )}
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-1 sm:mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <AnimatePresence mode="wait">
          {viewMode === "domains" && (
            <motion.div
              key="domains-view" // Unique key for AnimatePresence
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Featured Section - ensure domains[0] exists */}
              {domains.length > 0 && (
                <div className="mb-10 sm:mb-12">
                  <div className="flex items-center gap-2 mb-4 sm:mb-6">
                    <Star className="h-5 w-5 text-yellow-500" />
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                      {" "}
                      {/* Darker text for better contrast */}
                      Featured Domain
                    </h2>
                  </div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <DomainCard // Assuming DomainCard can handle isSelected prop or it's not strictly needed
                      domain={domains[0]}
                      onSelect={handleDomainSelect}
                      // isSelected={false} // This might not be necessary if DomainCard doesn't use it
                    />
                  </motion.div>
                </div>
              )}

              {/* All Domains */}
              <div>
                <div className="flex items-center gap-2 mb-4 sm:mb-6">
                  <BookOpen className="h-5 w-5 text-blue-500" />
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                    All Domains
                  </h2>
                  <Badge variant="secondary">{filteredDomains.length}</Badge>
                </div>
                {filteredDomains.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {filteredDomains.map((domain, index) => (
                      <motion.div
                        key={domain.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.2 }} // Faster stagger
                      >
                        <DomainCard
                          domain={domain}
                          onSelect={handleDomainSelect}
                        />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">No domains match your search.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {viewMode === "stories" && selectedDomain && (
            <motion.div
              key="stories-view" // Unique key
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {filteredStories.length > 0 ? (
                <div
                  className={`grid gap-4 sm:gap-6 ${
                    layoutMode === "grid"
                      ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                      : "grid-cols-1"
                  }`}
                >
                  {filteredStories.map((story, index) => (
                    <motion.div
                      key={story.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.2 }} // Faster stagger
                    >
                      <StoryCard
                        story={story}
                        onSelect={handleStorySelect}
                        domainColor={selectedDomain.color}
                        layoutMode={layoutMode} // Pass layoutMode to StoryCard if it needs it
                      />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <BookOpen className="h-16 w-16 mx-auto opacity-70" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    {searchQuery
                      ? "No Stories Match Your Search"
                      : "No Stories Yet"}
                  </h3>
                  <p className="text-gray-500 mb-6">
                    {searchQuery
                      ? "Try a different search term."
                      : `This domain is ready for stories. Add your first story to get started!`}
                  </p>
                  {!searchQuery && <Button variant="outline">Add Story</Button>}
                </div>
              )}
            </motion.div>
          )}

          {/* Reader view is handled by the conditional rendering at the top */}
        </AnimatePresence>
      </div>
    </div>
  );
}
