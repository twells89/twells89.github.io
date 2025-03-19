
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getScoreColorClass } from '@/lib/utils';
import { ColumnInfo } from '@/services/aiAnalysisService';

interface ColumnQualityCardProps {
  columns: ColumnInfo[];
}

const ColumnQualityCard: React.FC<ColumnQualityCardProps> = ({ columns }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Column Quality</CardTitle>
        <CardDescription>Quality assessment for each column in your dataset</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {columns.map((column) => (
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
  );
};

export default ColumnQualityCard;
