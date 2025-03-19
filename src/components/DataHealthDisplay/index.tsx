
import React from 'react';
import { BadgeInfo, CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import { HealthAnalysis } from '@/services/aiAnalysisService';
import OverallHealthCard from './OverallHealthCard';
import DataQualityIssuesChart from './DataQualityIssuesChart';
import DataQualityCard from './DataQualityCard';
import ColumnQualityCard from './ColumnQualityCard';
import DataHealthSkeleton from './DataHealthSkeleton';

interface DataHealthDisplayProps {
  analysis: HealthAnalysis | null;
  loading: boolean;
}

const DataHealthDisplay: React.FC<DataHealthDisplayProps> = ({ analysis, loading }) => {
  console.log('DataHealthDisplay received analysis:', analysis);
  
  if (loading) {
    return <DataHealthSkeleton />;
  }

  if (!analysis) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-8">
        <BadgeInfo className="h-12 w-12 text-muted-foreground" />
        <p className="text-center text-muted-foreground">
          Your data health analysis will appear here after uploading a file
        </p>
      </div>
    );
  }

  // Ensure we're using the actual percentage values from the analysis
  const issuesByCategory = [
    { name: 'Missing Data', value: analysis.missingDataPercentage },
    { name: 'Data Types', value: 100 - analysis.consistentDataTypesScore },
    { name: 'Duplicates', value: analysis.duplicateRowsPercentage },
    { name: 'Outliers', value: analysis.outliersPercentage },
  ];

  console.log('DataHealthDisplay rendering with issues:', issuesByCategory);

  return (
    <div id="data-health-content">
      <div className="grid gap-6 lg:grid-cols-2">
        <OverallHealthCard 
          score={analysis.overallScore}
          rowCount={analysis.rowCount}
          columnCount={analysis.columnCount}
        />
        
        <DataQualityIssuesChart issuesByCategory={issuesByCategory} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <DataQualityCard 
          title="Data Completeness" 
          score={100 - analysis.missingDataPercentage}
          issue={`${analysis.missingDataPercentage.toFixed(1)}% missing values`}
          recommendation={analysis.missingDataRecommendation}
          icon={analysis.missingDataPercentage < 5 ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : 
                analysis.missingDataPercentage < 20 ? <AlertCircle className="h-5 w-5 text-amber-500" /> :
                <XCircle className="h-5 w-5 text-red-500" />}
        />
        
        <DataQualityCard 
          title="Data Consistency" 
          score={analysis.consistentDataTypesScore}
          issue={`${(100 - analysis.consistentDataTypesScore).toFixed(1)}% inconsistent data types`}
          recommendation={analysis.dataTypeRecommendation}
          icon={analysis.consistentDataTypesScore > 95 ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : 
                analysis.consistentDataTypesScore > 80 ? <AlertCircle className="h-5 w-5 text-amber-500" /> :
                <XCircle className="h-5 w-5 text-red-500" />}
        />
        
        <DataQualityCard 
          title="Data Uniqueness" 
          score={100 - analysis.duplicateRowsPercentage}
          issue={`${analysis.duplicateRowsPercentage.toFixed(1)}% duplicate rows`}
          recommendation={analysis.duplicateRowsRecommendation}
          icon={analysis.duplicateRowsPercentage < 1 ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : 
                analysis.duplicateRowsPercentage < 5 ? <AlertCircle className="h-5 w-5 text-amber-500" /> :
                <XCircle className="h-5 w-5 text-red-500" />}
        />
      </div>

      <div className="mt-6">
        <ColumnQualityCard columns={analysis.columnMetrics} />
      </div>
    </div>
  );
};

export default DataHealthDisplay;
