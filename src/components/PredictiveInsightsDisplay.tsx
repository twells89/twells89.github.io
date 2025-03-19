
// src/components/PredictiveInsightsDisplay.tsx
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BadgeInfo } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { getScoreColorClass } from '@/lib/utils';

export interface PredictiveInsight {
  topPredictionTarget: string;
  featureImportance: {
    name: string;
    importance: number;
  }[];
  modelPerformance: {
    name: string;
    score: number;
  }[];
  correlations: {
    feature1: string;
    feature2: string;
    strength: number;
    direction: string;
  }[];
}

interface PredictiveInsightsDisplayProps {
  insights: PredictiveInsight | null;
  loading: boolean;
}

const PredictiveInsightsDisplay: React.FC<PredictiveInsightsDisplayProps> = ({ insights, loading }) => {
  console.log('PredictiveInsightsDisplay received insights:', insights);
  
  if (loading) {
    return <PredictiveInsightsSkeleton />;
  }

  if (!insights) {
    return (
      <Card className="border-dashed">
        <CardHeader className="pb-2">
          <CardTitle>Predictive Insights</CardTitle>
          <CardDescription>Generate predictions to see insights</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center space-y-4 py-8">
          <BadgeInfo className="h-12 w-12 text-muted-foreground" />
          <p className="text-center text-muted-foreground">
            Your predictive insights will appear here after analysis
          </p>
        </CardContent>
      </Card>
    );
  }

  // Format feature importance data for the chart
  const featureImportanceData = insights.featureImportance.map(item => ({
    name: item.name,
    importance: Math.round(item.importance * 100) // Convert to percentage
  }));

  return (
    <div id="predictive-insights-content">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Prediction Target</CardTitle>
            <CardDescription>Recommended column to predict based on your data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center p-4">
              <div className="flex h-32 w-32 items-center justify-center rounded-full bg-primary/10">
                <span className="text-xl font-medium text-primary">{insights.topPredictionTarget}</span>
              </div>
              <p className="mt-4 text-center text-sm text-muted-foreground">
                This column shows strong potential to be predicted based on the relationships with other data points.
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Feature Importance</CardTitle>
            <CardDescription>Most influential variables for predictions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="horizontal"
                  data={featureImportanceData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis type="number" domain={[0, 100]} unit="%" />
                  <YAxis dataKey="name" type="category" width={150} />
                  <Tooltip 
                    formatter={(value: number | string) => {
                      return typeof value === 'number' ? 
                        [`${value.toFixed(1)}%`, 'Importance'] : 
                        [value, 'Importance'];
                    }} 
                  />
                  <Bar dataKey="importance" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Strong Correlations</CardTitle>
            <CardDescription>Key relationships between variables</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {insights.correlations.map((correlation, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {correlation.feature1} ↔ {correlation.feature2}
                    </span>
                    <span className={`text-sm font-medium ${
                      correlation.direction === 'positive' ? 'text-emerald-500' : 'text-red-500'
                    }`}>
                      {correlation.strength.toFixed(2)} 
                      ({correlation.direction === 'positive' ? '+' : '-'})
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div 
                      className={`h-2 rounded-full ${
                        correlation.direction === 'positive' ? 'bg-emerald-500' : 'bg-red-500'
                      }`} 
                      style={{ width: `${Math.abs(correlation.strength) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Model Performance</CardTitle>
            <CardDescription>Estimated prediction quality for different models</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <div className="h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={insights.modelPerformance}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="name" />
                    <PolarRadiusAxis domain={[0, 100]} />
                    <Radar
                      name="Fit Score"
                      dataKey="score"
                      stroke="#3B82F6"
                      fill="#3B82F6"
                      fillOpacity={0.6}
                    />
                    <Tooltip 
                      formatter={(value: number | string) => {
                        return typeof value === 'number' ? 
                          [`${value.toFixed(1)}%`, 'Fit Score'] : 
                          [value, 'Fit Score'];
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const PredictiveInsightsSkeleton = () => (
  <div className="space-y-6">
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader className="pb-2">
          <Skeleton className="h-6 w-[180px]" />
          <Skeleton className="h-4 w-[250px]" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center p-4">
            <Skeleton className="h-32 w-32 rounded-full" />
            <Skeleton className="mt-4 h-12 w-3/4" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <Skeleton className="h-6 w-[180px]" />
          <Skeleton className="h-4 w-[250px]" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[250px] w-full" />
        </CardContent>
      </Card>
    </div>
    
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader className="pb-2">
          <Skeleton className="h-6 w-[180px]" />
          <Skeleton className="h-4 w-[250px]" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[60px]" />
                </div>
                <Skeleton className="h-2 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <Skeleton className="h-6 w-[180px]" />
          <Skeleton className="h-4 w-[250px]" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[250px] w-full" />
        </CardContent>
      </Card>
    </div>
  </div>
);

export default PredictiveInsightsDisplay;
