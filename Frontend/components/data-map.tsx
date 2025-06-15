"use client";

import { ComposableMap, Marker } from "react-simple-maps";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

type MapDataPoint = {
  region: string;
  value: number;
  coordinates: [number, number];
};

type DataMapProps = {
  data?: MapDataPoint[];
  onRegionClick?: (region: string) => void;
};

export function DataMap({ data = [], onRegionClick }: DataMapProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-[300px] items-center justify-center rounded-md border border-dashed p-8 text-center">
        <p className="text-sm text-muted-foreground">Loading map...</p>
      </div>
    );
  }

  return (
    <div className="h-[400px] w-full rounded-md border">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          center: [10, 51],
          scale: 1000,
        }}
      >
        {data.map(({ region, value, coordinates }) => (
          <Marker key={region} coordinates={coordinates}>
            <circle
              r={10}
              fill={getColorForValue(value)}
              stroke={theme === "dark" ? "#FFFFFF" : "#000000"}
              strokeWidth={1}
              onClick={() => onRegionClick?.(region)}
              style={{ cursor: "pointer" }}
            />
            <text
              textAnchor="middle"
              y={-15}
              fill={theme === "dark" ? "#FFFFFF" : "#000000"}
              fontSize={12}
            >
              {region}
            </text>
          </Marker>
        ))}
      </ComposableMap>
    </div>
  );
}

function getColorForValue(value: number): string {
  if (value > 75) return "#10B981";
  if (value > 50) return "#3B82F6";
  if (value > 25) return "#F59E0B";
  return "#EF4444";
}
