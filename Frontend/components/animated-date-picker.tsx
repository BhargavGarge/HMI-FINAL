"use client";

import { useState, useRef, useEffect } from "react";
import { Calendar, ChevronRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface DateRange {
  start: number;
  end: number;
}

interface AnimatedDatePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  minYear?: number;
  maxYear?: number;
  className?: string;
}

export function AnimatedDatePicker({
  value,
  onChange,
  minYear = 2010,
  maxYear = 2024,
  className,
}: AnimatedDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredYear, setHoveredYear] = useState<number | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [tempStart, setTempStart] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const years = Array.from(
    { length: maxYear - minYear + 1 },
    (_, i) => minYear + i
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setIsSelecting(false);
        setTempStart(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleYearClick = (year: number) => {
    if (!isSelecting) {
      // Start selection
      setIsSelecting(true);
      setTempStart(year);
    } else {
      // Complete selection
      if (tempStart !== null) {
        const start = Math.min(tempStart, year);
        const end = Math.max(tempStart, year);
        onChange({ start, end });
      }
      setIsSelecting(false);
      setTempStart(null);
      setIsOpen(false);
    }
  };

  const getYearStatus = (year: number) => {
    if (year >= value.start && year <= value.end) return "selected";
    if (isSelecting && tempStart !== null) {
      const start = Math.min(tempStart, year);
      const end = Math.max(tempStart, year);
      if (year >= start && year <= end) return "preview";
    }
    if (hoveredYear === year) return "hovered";
    return "default";
  };

  const presetRanges = [
    { label: "Last 3 years", range: { start: maxYear - 2, end: maxYear } },
    { label: "Last 5 years", range: { start: maxYear - 4, end: maxYear } },
    { label: "Last decade", range: { start: maxYear - 9, end: maxYear } },
    { label: "All time", range: { start: minYear, end: maxYear } },
  ];

  return (
    <div ref={dropdownRef} className={cn("relative", className)}>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full justify-between h-auto min-h-[2.5rem] p-3",
          "bg-white/80 backdrop-blur-sm border-2 transition-all duration-300",
          "hover:bg-white hover:border-purple-300 hover:shadow-lg",
          isOpen && "border-purple-500 shadow-xl bg-white",
          "group"
        )}
      >
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-purple-600 group-hover:scale-110 transition-transform" />
          <span className="font-medium">
            {value.start === value.end
              ? value.start
              : `${value.start} - ${value.end}`}
          </span>
          <Badge
            variant="outline"
            className="bg-purple-50 text-purple-700 border-purple-200"
          >
            {value.end - value.start + 1} years
          </Badge>
        </div>
        <ChevronRight
          className={cn(
            "h-4 w-4 transition-transform duration-300 text-purple-600",
            isOpen && "rotate-90"
          )}
        />
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-2 animate-in slide-in-from-top-2 duration-300">
          <div className="bg-white/95 backdrop-blur-xl border-2 border-purple-200 rounded-xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b bg-gradient-to-r from-purple-50 to-pink-50">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="h-4 w-4 text-purple-600" />
                <span className="font-semibold text-purple-800">
                  {isSelecting ? "Select end year" : "Select date range"}
                </span>
              </div>

              {/* Preset Ranges */}
              <div className="grid grid-cols-2 gap-2">
                {presetRanges.map((preset) => (
                  <Button
                    key={preset.label}
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      onChange(preset.range);
                      setIsOpen(false);
                      setIsSelecting(false);
                      setTempStart(null);
                    }}
                    className="bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-700"
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Year Grid */}
            <div className="p-4">
              <div className="grid grid-cols-5 gap-2">
                {years.map((year) => {
                  const status = getYearStatus(year);

                  return (
                    <button
                      key={year}
                      onClick={() => handleYearClick(year)}
                      onMouseEnter={() => setHoveredYear(year)}
                      onMouseLeave={() => setHoveredYear(null)}
                      className={cn(
                        "p-3 rounded-lg font-medium transition-all duration-200 relative overflow-hidden",
                        "hover:scale-105 hover:shadow-md",
                        status === "selected" &&
                          "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg",
                        status === "preview" &&
                          "bg-gradient-to-r from-purple-200 to-pink-200 text-purple-800",
                        status === "hovered" &&
                          "bg-purple-100 text-purple-700 scale-105",
                        status === "default" &&
                          "bg-gray-50 text-gray-700 hover:bg-purple-50"
                      )}
                    >
                      <span className="relative z-10">{year}</span>
                      {status === "selected" && (
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-50 animate-pulse" />
                      )}
                    </button>
                  );
                })}
              </div>

              {isSelecting && (
                <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="text-sm text-purple-700 text-center animate-pulse">
                    Click another year to complete the range selection
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
