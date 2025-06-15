"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Brain, Map, Layers, Zap, RefreshCw, Download } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

interface KohonenData {
  som_analysis: {
    distance_map: number[][];
    hit_map: number[][];
    map_size: [number, number];
    training_iterations: number;
    quantization_error: number;
    topographic_error: number;
  };
  regional_data: Array<{
    country: string;
    som_position: [number, number];
    cluster_id: number;
    indicators: Record<string, number>;
  }>;
  clusters: Record<
    string,
    Array<{
      country: string;
      position: [number, number];
      indicators: Record<string, number>;
    }>
  >;
  indicators: string[];
  summary: {
    total_countries: number;
    total_indicators: number;
    data_coverage: number;
    training_quality: string;
  };
}

interface KohonenMapViewerProps {
  className?: string;
}

const KOHONEN_API_BASE = "http://127.0.0.1:5000/api/kohonen";

export function KohonenMapViewer({ className }: KohonenMapViewerProps) {
  const [kohonenData, setKohonenData] = useState<KohonenData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMapType, setSelectedMapType] = useState<"distance" | "hit">(
    "distance"
  );
  const [mapImage, setMapImage] = useState<string | null>(null);
  const [selectedCluster, setSelectedCluster] = useState<string | null>(null);
  const [mapSize, setMapSize] = useState<[number, number]>([8, 8]);
  const [iterations, setIterations] = useState(1000);
  const [isRetraining, setIsRetraining] = useState(false);
  const [activeTab, setActiveTab] = useState("visualization");

  // Fetch Kohonen data
  useEffect(() => {
    const fetchKohonenData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`${KOHONEN_API_BASE}/analysis`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.status === "success") {
          // Transform the backend response to match frontend expectations
          const transformedData = {
            som_analysis: {
              distance_map: result.data.distance_map,
              hit_map: result.data.hit_map,
              map_size: result.data.map_size,
              training_iterations: 1000, // Default value
              quantization_error: 0, // Default value
              topographic_error: 0, // Default value
            },
            regional_data: Object.values(result.data.clusters)
              .flat()
              .map((item) => {
                const region = item as {
                  country: string;
                  position: [number, number];
                  indicators: Record<string, number>;
                };
                return {
                  country: region.country,
                  som_position: region.position,
                  cluster_id: region.position[0] * 1000 + region.position[1], // Unique number
                  indicators: region.indicators ?? {}, // Use actual indicators if available
                };
              }),
            clusters: result.data.clusters,
            indicators: result.data.indicators || [],
            summary: {
              total_countries: result.data.summary_stats?.total_countries || 0,
              total_indicators: result.data.indicators?.length || 0,
              data_coverage: 0, // Calculate if needed
              training_quality: "unknown",
            },
          };
          setKohonenData(transformedData);
        } else {
          throw new Error(result.message || "Failed to fetch Kohonen data");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load Kohonen maps"
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchKohonenData();
  }, []);

  // Fetch map image when map type changes
  useEffect(() => {
    // In kohonen-map-viewer.tsx
    const fetchMapImage = async () => {
      if (!kohonenData) return;

      try {
        const response = await fetch(
          `${KOHONEN_API_BASE}/visualization/${selectedMapType}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Check if response is JSON
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const text = await response.text();
          if (text.startsWith("<!doctype html>")) {
            throw new Error(
              "Received HTML instead of JSON - endpoint may not exist"
            );
          }
          throw new Error(`Unexpected content type: ${contentType}`);
        }

        const result = await response.json();

        if (result.status === "success") {
          setMapImage(result.image);
        } else {
          throw new Error(result.message || "Failed to fetch map image");
        }
      } catch (err) {
        console.error("Failed to fetch map image:", err);
        // Optionally set some error state here
      }
    };
    fetchMapImage();
  }, [selectedMapType, kohonenData]);

  const handleRetrain = async () => {
    try {
      setIsRetraining(true);

      const response = await fetch(`${KOHONEN_API_BASE}/retrain`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          map_size: mapSize,
          iterations: iterations,
        }),
      });

      const result = await response.json();

      if (result.status === "success") {
        window.location.reload();
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to retrain SOM");
    } finally {
      setIsRetraining(false);
    }
  };

  const renderHeatmap = (
    data: number[][],
    title: string,
    colorScheme: string
  ) => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return (
        <div className="space-y-4">
          <h4 className="font-medium text-sm">{title}</h4>
          <div className="text-center py-8 text-gray-500">
            No heatmap data available
          </div>
        </div>
      );
    }

    const maxValue = Math.max(...data.flat());
    const minValue = Math.min(...data.flat());

    return (
      <div className="space-y-4">
        <h4 className="font-medium text-sm">{title}</h4>
        <div
          className="grid gap-1"
          style={{
            gridTemplateColumns: `repeat(${data[0]?.length || 0}, 1fr)`,
          }}
        >
          {data.map((row, i) =>
            row.map((value, j) => {
              const intensity = (value - minValue) / (maxValue - minValue);
              const opacity = Math.max(0.1, intensity);

              return (
                <div
                  key={`${i}-${j}`}
                  className={`aspect-square border border-gray-200 rounded-sm flex items-center justify-center text-xs font-mono ${colorScheme}`}
                  style={{ opacity }}
                  title={`Position (${i}, ${j}): ${value.toFixed(2)}`}
                >
                  {value.toFixed(1)}
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  };

  const renderRegionalMap = () => {
    if (!kohonenData || !kohonenData.som_analysis || !kohonenData.regional_data)
      return null;

    const [width, height] = kohonenData.som_analysis?.map_size ?? [8, 8];

    return (
      <div className="space-y-4">
        <h4 className="font-medium text-sm">Regional Clustering</h4>
        <div
          className="relative border border-gray-200 rounded-lg p-4 bg-gray-50"
          style={{ aspectRatio: `${width}/${height}` }}
        >
          <div
            className="grid gap-1 h-full"
            style={{ gridTemplateColumns: `repeat(${width}, 1fr)` }}
          >
            {Array.from({ length: height }, (_, i) =>
              Array.from({ length: width }, (_, j) => (
                <div
                  key={`${i}-${j}`}
                  className="border border-gray-300 rounded-sm bg-white relative"
                />
              ))
            )}
          </div>

          {kohonenData.regional_data.map((region, index) => (
            <div
              key={region.country}
              className="absolute w-3 h-3 rounded-full bg-blue-500 border-2 border-white shadow-lg cursor-pointer hover:scale-125 transition-transform"
              style={{
                left: `${(region.som_position[0] / width) * 100}%`,
                top: `${(region.som_position[1] / height) * 100}%`,
                transform: "translate(-50%, -50%)",
              }}
              title={region.country}
            />
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {kohonenData.regional_data.slice(0, 8).map((region, index) => (
            <Badge key={region.country} variant="outline" className="text-xs">
              {region.country}
            </Badge>
          ))}
          {kohonenData.regional_data.length > 8 && (
            <Badge variant="secondary" className="text-xs">
              +{kohonenData.regional_data.length - 8} more
            </Badge>
          )}
        </div>
      </div>
    );
  };

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-red-500" />
            Kohonen Maps Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-600" />
          Kohonen Self-Organizing Maps
        </CardTitle>
        <CardDescription>
          Interactive visualization of economic data patterns using
          Self-Organizing Maps
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-[200px]" />
            <Skeleton className="h-[400px] w-full" />
            <div className="grid grid-cols-3 gap-4">
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
            </div>
          </div>
        ) : kohonenData ? (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="visualization">Visualization</TabsTrigger>
              <TabsTrigger value="clusters">Clusters</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="visualization" className="space-y-6">
              <div className="flex items-center gap-4 mb-4">
                <Select
                  value={selectedMapType}
                  onValueChange={(value: "distance" | "hit") =>
                    setSelectedMapType(value)
                  }
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="distance">
                      Distance Map (U-Matrix)
                    </SelectItem>
                    <SelectItem value="hit">Hit Frequency Map</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium flex items-center gap-2">
                    <Map className="h-4 w-4" />
                    {selectedMapType === "distance"
                      ? "Distance Map"
                      : "Hit Frequency Map"}
                  </h3>
                  {mapImage ? (
                    <img
                      src={mapImage || "/placeholder.svg"}
                      alt={`Kohonen ${selectedMapType} map`}
                      className="w-full rounded-lg border shadow-sm"
                    />
                  ) : (
                    <Skeleton className="w-full h-[300px] rounded-lg" />
                  )}
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium flex items-center gap-2">
                    <Layers className="h-4 w-4" />
                    Interactive Grid
                  </h3>

                  {kohonenData.som_analysis &&
                    (selectedMapType === "distance"
                      ? renderHeatmap(
                          kohonenData.som_analysis.distance_map,
                          "Distance Values",
                          "bg-red-100"
                        )
                      : renderHeatmap(
                          kohonenData.som_analysis.hit_map,
                          "Hit Frequencies",
                          "bg-blue-100"
                        ))}
                </div>
              </div>

              <div className="mt-8">{renderRegionalMap()}</div>
            </TabsContent>

            <TabsContent value="clusters" className="space-y-6">
              {kohonenData.clusters &&
              Object.keys(kohonenData.clusters).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(kohonenData.clusters).map(
                    ([clusterId, regions]) => (
                      <Card
                        key={clusterId}
                        className="cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => setSelectedCluster(clusterId)}
                      >
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm">
                            Cluster {clusterId}
                          </CardTitle>
                          <CardDescription>
                            {regions.length} regions
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {regions.slice(0, 3).map((region) => (
                              <Badge
                                key={region.country}
                                variant="outline"
                                className="text-xs"
                              >
                                {region.country}
                              </Badge>
                            ))}
                            {regions.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{regions.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    )
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No cluster data available
                </div>
              )}

              {selectedCluster && kohonenData.clusters[selectedCluster] && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Cluster {selectedCluster} Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-3">Regions</h4>
                        <div className="space-y-2">
                          {kohonenData.clusters[selectedCluster].map(
                            (region) => (
                              <div
                                key={region.country}
                                className="flex justify-between items-center p-2 bg-gray-50 rounded"
                              >
                                <span className="font-medium">
                                  {region.country}
                                </span>
                                <Badge variant="outline">
                                  ({region.position[0]}, {region.position[1]})
                                </Badge>
                              </div>
                            )
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-3">Average Indicators</h4>
                        <div className="space-y-2">
                          {kohonenData.indicators
                            .slice(0, 6)
                            .map((indicator) => {
                              const avgValue =
                                kohonenData.clusters[selectedCluster].reduce(
                                  (sum, region) =>
                                    sum + (region.indicators[indicator] || 0),
                                  0
                                ) /
                                kohonenData.clusters[selectedCluster].length;

                              return (
                                <div
                                  key={indicator}
                                  className="flex justify-between items-center"
                                >
                                  <span className="text-sm">{indicator}</span>
                                  <span className="font-mono text-sm">
                                    {avgValue.toFixed(1)}
                                  </span>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    SOM Parameters
                  </CardTitle>
                  <CardDescription>
                    Adjust parameters and retrain the Self-Organizing Map
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Map Size: {mapSize[0]} × {mapSize[1]}
                    </label>
                    <div className="space-y-2">
                      <Slider
                        value={[mapSize[0]]}
                        onValueChange={(value) =>
                          setMapSize([value[0], mapSize[1]])
                        }
                        min={4}
                        max={12}
                        step={1}
                        className="w-full"
                      />
                      <Slider
                        value={[mapSize[1]]}
                        onValueChange={(value) =>
                          setMapSize([mapSize[0], value[0]])
                        }
                        min={4}
                        max={12}
                        step={1}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Training Iterations: {iterations}
                    </label>
                    <Slider
                      value={[iterations]}
                      onValueChange={(value) => setIterations(value[0])}
                      min={100}
                      max={5000}
                      step={100}
                      className="w-full"
                    />
                  </div>

                  <Button
                    onClick={handleRetrain}
                    disabled={isRetraining}
                    className="w-full"
                  >
                    {isRetraining ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Retraining SOM...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Retrain SOM
                      </>
                    )}
                  </Button>

                  {isRetraining && <Progress value={66} className="w-full" />}
                </CardContent>
              </Card>

              {kohonenData.som_analysis && kohonenData.summary && (
                <Card>
                  <CardHeader>
                    <CardTitle>Current Configuration</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Map Size:</span>
                        <span className="ml-2">
                          {kohonenData.som_analysis.map_size?.join(" × ")}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Countries:</span>
                        <span className="ml-2">
                          {kohonenData.summary.total_countries}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Indicators:</span>
                        <span className="ml-2">
                          {kohonenData.summary.total_indicators}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Clusters:</span>
                        <span className="ml-2">
                          {Object.keys(kohonenData.clusters).length}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No Kohonen data available
          </div>
        )}
      </CardContent>
    </Card>
  );
}
