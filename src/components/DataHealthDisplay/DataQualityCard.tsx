
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getScoreColorClass } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";

interface DataQualityCardProps {
  title: string;
  score: number;
  issue: string;
  recommendation: string;
  icon: React.ReactNode;
}

const DataQualityCard: React.FC<DataQualityCardProps> = ({ 
  title, 
  score, 
  issue, 
  recommendation, 
  icon 
}) => {
  const { toast } = useToast();
  
  // Format the score to ensure it's a number before attempting to format it
  const formattedScore = typeof score === 'number' ? score.toFixed(1) : '0.0';
  
  // Show a toast for very low scores (under 40) to alert the user of critical issues
  React.useEffect(() => {
    if (typeof score === 'number' && score < 40) {
      toast({
        title: `Low ${title} Score`,
        description: `Your data has issues: ${issue}`,
        variant: "destructive",
      });
    }
  }, [score, title, issue, toast]);
  
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-base">{title}</CardTitle>
          <CardDescription>
            <span className={getScoreColorClass(Number(score))}>{formattedScore}%</span>
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
};

export default DataQualityCard;
