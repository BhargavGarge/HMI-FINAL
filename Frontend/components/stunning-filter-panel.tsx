"use client";

import { useState } from "react";
import {
  Filter,
  Sparkles,
  Globe,
  Calendar,
  TrendingUp,
  Zap,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnimatedMultiSelect } from "./animated-multi-select";
import { AnimatedDatePicker } from "./animated-date-picker";
import { cn } from "@/lib/utils";

interface FilterState {
  countries: string[];
  dateRange: { start: number; end: number };
  categories: string[];
}

interface StunningFilterPanelProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  availableCountries: Array<{
    value: string;
    label: string;
    count?: number;
    flag?: string;
  }>;
  availableCategories: Array<{ value: string; label: string; count?: number }>;
  isLoading?: boolean;
  className?: string;
}

export function StunningFilterPanel({
  filters,
  onFiltersChange,
  availableCountries,
  availableCategories,
  isLoading = false,
  className,
}: StunningFilterPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [animationKey, setAnimationKey] = useState(0);

  const handleCountriesChange = (countries: string[]) => {
    onFiltersChange({ ...filters, countries });
    triggerAnimation();
  };

  const handleDateRangeChange = (dateRange: { start: number; end: number }) => {
    onFiltersChange({ ...filters, dateRange });
    triggerAnimation();
  };

  const handleCategoriesChange = (categories: string[]) => {
    onFiltersChange({ ...filters, categories });
    triggerAnimation();
  };

  const triggerAnimation = () => {
    setAnimationKey((prev) => prev + 1);
  };

  const handleReset = () => {
    onFiltersChange({
      countries: [],
      dateRange: { start: 2020, end: 2024 },
      categories: [],
    });
    triggerAnimation();
  };

  const getActiveFiltersCount = () => {
    return (
      filters.countries.length +
      filters.categories.length +
      (filters.dateRange.start !== 2020 || filters.dateRange.end !== 2024
        ? 1
        : 0)
    );
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <Card
      className={cn(
        "overflow-hidden transition-all duration-500 border-0 shadow-2xl",
        "bg-gradient-to-br from-white via-blue-50/50 to-purple-50/50 backdrop-blur-xl",
        isExpanded ? "max-h-[800px]" : "max-h-[80px]",
        className
      )}
    >
      <CardHeader
        className="cursor-pointer bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white relative overflow-hidden"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 animate-pulse" />
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Filter className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                Advanced Filters
                <Sparkles className="h-4 w-4 animate-spin" />
              </CardTitle>
              <p className="text-sm opacity-90 mt-1">
                {activeFiltersCount > 0
                  ? `${activeFiltersCount} active filter${
                      activeFiltersCount > 1 ? "s" : ""
                    }`
                  : "Click to customize your data view"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activeFiltersCount > 0 && (
              <Badge className="bg-white/20 text-white border-white/30 animate-bounce">
                {activeFiltersCount}
              </Badge>
            )}
            <Button
              size="sm"
              variant="ghost"
              className="text-white hover:bg-white/20 transition-all duration-200"
            >
              {isExpanded ? "Collapse" : "Expand"}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent
        className={cn(
          "transition-all duration-500 overflow-hidden",
          isExpanded ? "p-6 opacity-100" : "p-0 opacity-0"
        )}
      >
        <div
          key={animationKey}
          className="space-y-6 animate-in slide-in-from-top-4 duration-500"
        >
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
              <Globe className="h-6 w-6 mx-auto text-blue-600 mb-2" />
              <div className="text-2xl font-bold text-blue-800">
                {availableCountries.length}
              </div>
              <div className="text-xs text-blue-600">Countries Available</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200">
              <Calendar className="h-6 w-6 mx-auto text-purple-600 mb-2" />
              <div className="text-2xl font-bold text-purple-800">15</div>
              <div className="text-xs text-purple-600">Years of Data</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200">
              <TrendingUp className="h-6 w-6 mx-auto text-green-600 mb-2" />
              <div className="text-2xl font-bold text-green-800">
                {availableCategories.length}
              </div>
              <div className="text-xs text-green-600">Categories</div>
            </div>
          </div>

          {/* Country Filter */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-600" />
              <label className="text-sm font-semibold text-gray-700">
                Countries & Regions
              </label>
              {filters.countries.length > 0 && (
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-800 animate-pulse"
                >
                  {filters.countries.length} selected
                </Badge>
              )}
            </div>
            <AnimatedMultiSelect
              options={availableCountries}
              selected={filters.countries}
              onSelectionChange={handleCountriesChange}
              placeholder="Select countries to analyze..."
              icon={<Globe className="h-4 w-4" />}
              maxDisplay={4}
            />
          </div>

          {/* Date Range Filter */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              <label className="text-sm font-semibold text-gray-700">
                Time Period
              </label>
              <Badge
                variant="secondary"
                className="bg-purple-100 text-purple-800"
              >
                {filters.dateRange.end - filters.dateRange.start + 1} years
              </Badge>
            </div>
            <AnimatedDatePicker
              value={filters.dateRange}
              onChange={handleDateRangeChange}
              minYear={2010}
              maxYear={2024}
            />
          </div>

          {/* Category Filter */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <label className="text-sm font-semibold text-gray-700">
                Data Categories
              </label>
              {filters.categories.length > 0 && (
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800 animate-pulse"
                >
                  {filters.categories.length} selected
                </Badge>
              )}
            </div>
            <AnimatedMultiSelect
              options={availableCategories}
              selected={filters.categories}
              onSelectionChange={handleCategoriesChange}
              placeholder="Select data categories..."
              icon={<TrendingUp className="h-4 w-4" />}
              maxDisplay={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <Button
              onClick={handleReset}
              variant="outline"
              className="flex-1 bg-gradient-to-r from-red-50 to-pink-50 hover:from-red-100 hover:to-pink-100 border-red-200 text-red-700"
              disabled={activeFiltersCount === 0}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset Filters
            </Button>
            <Button
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
              disabled={isLoading}
            >
              <Zap className="h-4 w-4 mr-2" />
              {isLoading ? "Applying..." : "Apply Filters"}
            </Button>
          </div>

          {/* Active Filters Summary */}
          {activeFiltersCount > 0 && (
            <div className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-blue-200 animate-in slide-in-from-bottom-2">
              <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-blue-600" />
                Active Filters
              </h4>
              <div className="flex flex-wrap gap-2">
                {filters.countries.length > 0 && (
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                    {filters.countries.length} countries
                  </Badge>
                )}
                {filters.categories.length > 0 && (
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    {filters.categories.length} categories
                  </Badge>
                )}
                {(filters.dateRange.start !== 2020 ||
                  filters.dateRange.end !== 2024) && (
                  <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                    {filters.dateRange.start}-{filters.dateRange.end}
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
