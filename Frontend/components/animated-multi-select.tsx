"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Check, ChevronDown, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Option {
  value: string;
  label: string;
  count?: number;
  flag?: string;
}

interface AnimatedMultiSelectProps {
  options: Option[];
  selected: string[];
  onSelectionChange: (selected: string[]) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  maxDisplay?: number;
  className?: string;
}

export function AnimatedMultiSelect({
  options,
  selected,
  onSelectionChange,
  placeholder = "Select items...",
  icon,
  maxDisplay = 3,
  className,
}: AnimatedMultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
        setHoveredIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleToggle = (value: string) => {
    const newSelected = selected.includes(value)
      ? selected.filter((item) => item !== value)
      : [...selected, value];
    onSelectionChange(newSelected);
  };

  const handleSelectAll = () => {
    if (selected.length === filteredOptions.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(filteredOptions.map((option) => option.value));
    }
  };

  const handleClearAll = () => {
    onSelectionChange([]);
  };

  const displayedSelected = selected.slice(0, maxDisplay);
  const remainingCount = selected.length - maxDisplay;

  return (
    <div ref={dropdownRef} className={cn("relative", className)}>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full justify-between h-auto min-h-[2.5rem] p-3",
          "bg-white/80 backdrop-blur-sm border-2 transition-all duration-300",
          "hover:bg-white hover:border-blue-300 hover:shadow-lg",
          isOpen && "border-blue-500 shadow-xl bg-white",
          "group"
        )}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {icon && (
            <div className="text-blue-600 group-hover:scale-110 transition-transform">
              {icon}
            </div>
          )}
          <div className="flex flex-wrap gap-1 flex-1 min-w-0">
            {selected.length === 0 ? (
              <span className="text-muted-foreground">{placeholder}</span>
            ) : (
              <>
                {displayedSelected.map((value) => {
                  const option = options.find((opt) => opt.value === value);
                  return (
                    <Badge
                      key={value}
                      variant="secondary"
                      className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 hover:from-blue-200 hover:to-purple-200 transition-all duration-200 animate-in slide-in-from-left-2"
                    >
                      {option?.flag && (
                        <span className="mr-1">{option.flag}</span>
                      )}
                      {option?.label || value}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggle(value);
                        }}
                        className="ml-1 hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  );
                })}
                {remainingCount > 0 && (
                  <Badge
                    variant="outline"
                    className="bg-gradient-to-r from-gray-100 to-gray-200"
                  >
                    +{remainingCount} more
                  </Badge>
                )}
              </>
            )}
          </div>
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform duration-300 text-blue-600",
            isOpen && "rotate-180"
          )}
        />
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-2 animate-in slide-in-from-top-2 duration-300">
          <div className="bg-white/95 backdrop-blur-xl border-2 border-blue-200 rounded-xl shadow-2xl overflow-hidden">
            {/* Search Header */}
            <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-500" />
                <Input
                  ref={inputRef}
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-blue-200 focus:border-blue-500 bg-white/80"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleSelectAll}
                  className="flex-1 bg-blue-50 hover:bg-blue-100 border-blue-200"
                >
                  {selected.length === filteredOptions.length
                    ? "Deselect All"
                    : "Select All"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleClearAll}
                  className="flex-1 bg-red-50 hover:bg-red-100 border-red-200"
                  disabled={selected.length === 0}
                >
                  Clear All
                </Button>
              </div>
            </div>

            {/* Options List */}
            <div className="max-h-64 overflow-y-auto">
              {filteredOptions.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  No options found
                </div>
              ) : (
                filteredOptions.map((option, index) => {
                  const isSelected = selected.includes(option.value);
                  const isHovered = hoveredIndex === index;

                  return (
                    <div
                      key={option.value}
                      className={cn(
                        "flex items-center justify-between p-3 cursor-pointer transition-all duration-200",
                        "hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50",
                        isSelected &&
                          "bg-gradient-to-r from-blue-100 to-purple-100",
                        isHovered && "scale-[1.02] shadow-md"
                      )}
                      onClick={() => handleToggle(option.value)}
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(-1)}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div
                          className={cn(
                            "w-5 h-5 border-2 rounded-md flex items-center justify-center transition-all duration-200",
                            isSelected
                              ? "bg-gradient-to-r from-blue-500 to-purple-500 border-blue-500"
                              : "border-gray-300 hover:border-blue-400"
                          )}
                        >
                          {isSelected && (
                            <Check className="h-3 w-3 text-white animate-in zoom-in-50 duration-200" />
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {option.flag && (
                            <span className="text-lg animate-pulse">
                              {option.flag}
                            </span>
                          )}
                          <span
                            className={cn(
                              "font-medium transition-colors",
                              isSelected ? "text-blue-800" : "text-gray-700"
                            )}
                          >
                            {option.label}
                          </span>
                        </div>
                      </div>

                      {option.count && (
                        <Badge
                          variant="outline"
                          className={cn(
                            "transition-all duration-200",
                            isSelected
                              ? "bg-blue-200 text-blue-800 border-blue-300"
                              : "bg-gray-100 text-gray-600"
                          )}
                        >
                          {option.count}
                        </Badge>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
