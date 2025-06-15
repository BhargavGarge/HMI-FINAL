"use client";

import type { Domain } from "@/types/story";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
// Assuming you have a way to map icon strings to actual Lucide components
// For simplicity, we'll just display the icon name as text or use a generic icon.
import { Layers } from "lucide-react";

interface DomainSelectorProps {
  domains: Domain[];
  onSelect: (domain: Domain) => void;
}

export function DomainSelector({ domains, onSelect }: DomainSelectorProps) {
  if (!domains || domains.length === 0) {
    return <p className="text-gray-500">No domains available.</p>;
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {domains.map((domain) => (
        <Card
          key={domain.id}
          className={`flex flex-col hover:shadow-lg transition-shadow border-t-4 border-${domain.color}-500`}
        >
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              {/* Basic icon display, replace with actual icon mapping if available */}
              <div
                className={`p-2 rounded-md bg-${domain.color}-100 text-${domain.color}-600`}
              >
                <Layers className="h-6 w-6" />
              </div>
              <CardTitle className={`text-2xl text-${domain.color}-700`}>
                {domain.name}
              </CardTitle>
            </div>
            <CardDescription className="text-sm line-clamp-3 h-[3.75rem]">
              {domain.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
              <span>
                <Badge variant="secondary">{domain.totalStories} stories</Badge>
              </span>
              <span>
                <Badge variant="outline">
                  {domain.totalReadTime} min total
                </Badge>
              </span>
            </div>
          </CardContent>
          <div className="p-6 pt-0">
            <Button
              onClick={() => onSelect(domain)}
              className={`w-full bg-${domain.color}-500 hover:bg-${domain.color}-600 text-white`}
            >
              Explore {domain.name}
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
