
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { BadgeInfo, CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { HealthAnalysis } from '@/services/aiAnalysisService';
import { getScoreColorClass } from '@/lib/utils';

interface DataHealthDisplayProps {
  analysis: HealthAnalysis | null;
  loading: boolean;
}

const DataHealthDisplay: React.FC<DataHealthDisplayProps> = ({ analysis, loading }) => {
  if (loading) {
    return <DataHealthSkeleton />;
  }

  if (!analysis) {
    return (
      <Card className="border-dashed">
        <CardHeader className="pb-2">
          <CardTitle>Data Health Analysis</CardTitle>
          <CardDescription>Upload a file to see data quality metrics</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center space-y-4 py-8">
          <BadgeInfo className="h-12 w-12 text-muted-foreground" />
          <p className="text-center text-muted-foreground">
            Your data health analysis will appear here after uploading a file
          </p>
        </CardContent>
      </Card>
    );
  }

  const issuesByCategory = [
    { name: 'Missing Data', value: analysis.missingDataPercentage },
    { name: 'Data Types', value: 100 - analysis.consistentDataTypesScore },
    { name: 'Duplicates', value: analysis.duplicateRowsPercentage },
    { name: 'Outliers', value: analysis.outliersPercentage },
  ];

  return (
    <div id="data-health-content">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Overall Data Health</CardTitle>
            <CardDescription>Composite score based on multiple quality factors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center p-4">
              <div className="relative flex h-40 w-40 items-center justify-center rounded-full border-8 border-muted">
                <div className="flex flex-col items-center">
                  <span className={`text-4xl font-bold ${getScoreColorClass(analysis.overallScore)}`}>
                    {analysis.overallScore}
                  </span>
                  <span className="text-sm text-muted-foreground">out of 100</span>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-2 gap-4 text-center">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Rows</p>
                  <p className="text-xl font-bold">{analysis.rowCount.toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Columns</p>
                  <p className="text-xl font-bold">{analysis.columnCount}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Data Quality Issues</CardTitle>
            <CardDescription>Potential problems identified in your data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={issuesByCategory}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis type="number" domain={[0, 100]} unit="%" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                  <Bar dataKey="value" fill="#ef4444">
                    {issuesByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} 
                        fill={entry.value > 20 ? '#ef4444' : 
                             (entry.value > 5 ? '#f97316' : '#22c55e')} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <DataQualityCard 
          title="Data Completeness" 
          score={100 - analysis.missingDataPercentage}
          issue={`${analysis.missingDataPercentage}% missing values`}
          recommendation={analysis.missingDataRecommendation}
          icon={analysis.missingDataPercentage < 5 ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : 
                analysis.missingDataPercentage < 20 ? <AlertCircle className="h-5 w-5 text-amber-500" /> :
                <XCircle className="h-5 w-5 text-red-500" />}
        />
        
        <DataQualityCard 
          title="Data Consistency" 
          score={analysis.consistentDataTypesScore}
          issue={`${100 - analysis.consistentDataTypesScore}% inconsistent data types`}
          recommendation={analysis.dataTypeRecommendation}
          icon={analysis.consistentDataTypesScore > 95 ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : 
                analysis.consistentDataTypesScore > 80 ? <AlertCircle className="h-5 w-5 text-amber-500" /> :
                <XCircle className="h-5 w-5 text-red-500" />}
        />
        
        <DataQualityCard 
          title="Data Uniqueness" 
          score={100 - analysis.duplicateRowsPercentage}
          issue={`${analysis.duplicateRowsPercentage}% duplicate rows`}
          recommendation={analysis.duplicateRowsRecommendation}
          icon={analysis.duplicateRowsPercentage < 1 ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : 
                analysis.duplicateRowsPercentage < 5 ? <AlertCircle className="h-5 w-5 text-amber-500" /> :
                <XCircle className="h-5 w-5 text-red-500" />}
        />
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Column Quality</CardTitle>
            <CardDescription>Quality assessment for each column in your dataset</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analysis.columnMetrics.map((column) => (
                <div key={column.name} className="grid grid-cols-6 gap-4 items-center">
                  <div className="col-span-2">
                    <p className="text-sm font-medium truncate" title={column.name}>
                      {column.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{column.dataType}</p>
                  </div>
                  <div className="col-span-3">
                    <Progress value={column.qualityScore} className="h-2" />
                  </div>
                  <div className="text-right">
                    <span className={getScoreColorClass(column.qualityScore)}>
                      {column.qualityScore}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const DataQualityCard = ({ 
  title, 
  score, 
  issue, 
  recommendation, 
  icon 
}: { 
  title: string; 
  score: number; 
  issue: string; 
  recommendation: string;
  icon: React.ReactNode;
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <div>
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription>
          <span className={getScoreColorClass(score)}>{score.toFixed(1)}%</span>
        </CardDescription>
      </div>
      {icon}
    </CardHeader>
    <CardContent className="space-y-2">
      <p className="text-sm">{issue}</p>
      <p className="text-xs text-muted-foreground">{recommendation}</p>
    </CardContent>
  </Card>
);

const DataHealthSkeleton = () => (
  <div className="space-y-6">
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader className="pb-2">
          <Skeleton className="h-6 w-[180px]" />
          <Skeleton className="h-4 w-[250px]" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center p-4">
            <Skeleton className="h-40 w-40 rounded-full" />
            <div className="mt-6 grid grid-cols-2 gap-4 w-full">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
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
    
    <div className="grid gap-6 lg:grid-cols-3">
      {[...Array(3)].map((_, i) => (
        <Card key={i}>
          <CardHeader className="pb-2">
            <Skeleton className="h-6 w-[150px]" />
            <Skeleton className="h-4 w-[100px]" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export default DataHealthDisplay;
