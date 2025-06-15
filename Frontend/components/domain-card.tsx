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
import {
  TrendingUp,
  Heart,
  Users,
  DollarSign,
  Truck,
  Clock,
  BookOpen,
  Zap,
  ArrowRight,
} from "lucide-react";
import type { Domain } from "@/types/story";

const iconMap = {
  TrendingUp,
  Heart,
  Users,
  DollarSign,
  Zap,
  Truck,
};

// Color mappings for proper Tailwind classes
const colorClasses = {
  blue: {
    ring: "ring-blue-500",
    gradient: "from-blue-500 to-cyan-500",
    bg: "bg-blue-500",
  },
  green: {
    ring: "ring-green-500",
    gradient: "from-green-500 to-emerald-500",
    bg: "bg-green-500",
  },
  purple: {
    ring: "ring-purple-500",
    gradient: "from-purple-500 to-pink-500",
    bg: "bg-purple-500",
  },
  yellow: {
    ring: "ring-yellow-500",
    gradient: "from-yellow-500 to-orange-500",
    bg: "bg-yellow-500",
  },
  indigo: {
    ring: "ring-indigo-500",
    gradient: "from-indigo-500 to-blue-500",
    bg: "bg-indigo-500",
  },
};

interface DomainCardProps {
  domain: Domain;
  onSelect: (domain: Domain) => void;
  isSelected?: boolean;
}

export function DomainCard({
  domain,
  onSelect,
  isSelected = false,
}: DomainCardProps) {
  const IconComponent =
    iconMap[domain.icon as keyof typeof iconMap] || BookOpen;
  const colors =
    colorClasses[domain.color as keyof typeof colorClasses] ||
    colorClasses.blue;

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={`cursor-pointer transition-all duration-300 hover:shadow-xl ${
          isSelected
            ? `ring-2 ${colors.ring} bg-gradient-to-br ${colors.gradient} text-white`
            : "hover:shadow-lg bg-white"
        }`}
        onClick={() => onSelect(domain)}
      >
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div
              className={`p-3 rounded-xl ${
                isSelected
                  ? "bg-white/20"
                  : `bg-gradient-to-br ${colors.gradient}`
              }`}
            >
              <IconComponent className="h-6 w-6 text-white" />
            </div>
            <Badge
              variant={isSelected ? "secondary" : "outline"}
              className={
                isSelected ? "bg-white/20 text-white border-white/30" : ""
              }
            >
              {domain.totalStories} stories
            </Badge>
          </div>
          <CardTitle
            className={`text-xl ${isSelected ? "text-white" : "text-gray-900"}`}
          >
            {domain.name}
          </CardTitle>
          <CardDescription
            className={isSelected ? "text-white/80" : "text-gray-600"}
          >
            {domain.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{domain.totalReadTime}min</span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                <span>{domain.totalStories}</span>
              </div>
            </div>
            <Button
              size="sm"
              variant={isSelected ? "secondary" : "ghost"}
              className={
                isSelected ? "bg-white/20 text-white hover:bg-white/30" : ""
              }
            >
              Explore
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
