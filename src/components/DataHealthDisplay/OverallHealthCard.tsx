
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getScoreColorClass } from '@/lib/utils';

interface OverallHealthCardProps {
  score: number;
  rowCount: number;
  columnCount: number;
}

const OverallHealthCard: React.FC<OverallHealthCardProps> = ({ 
  score, 
  rowCount, 
  columnCount 
}) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Overall Data Health</CardTitle>
        <CardDescription>Composite score based on multiple quality factors</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center p-4">
          <div className="relative flex h-40 w-40 items-center justify-center rounded-full border-8 border-muted">
            <div className="flex flex-col items-center">
              <span className={`text-4xl font-bold ${getScoreColorClass(score)}`}>
                {score}
              </span>
              <span className="text-sm text-muted-foreground">out of 100</span>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-2 gap-4 text-center">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Rows</p>
              <p className="text-xl font-bold">{rowCount.toLocaleString()}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Columns</p>
              <p className="text-xl font-bold">{columnCount}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OverallHealthCard;
