
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

interface DataQualityIssuesChartProps {
  issuesByCategory: Array<{
    name: string;
    value: number;
  }>;
}

const DataQualityIssuesChart: React.FC<DataQualityIssuesChartProps> = ({ issuesByCategory }) => {
  return (
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
  );
};

export default DataQualityIssuesChart;
