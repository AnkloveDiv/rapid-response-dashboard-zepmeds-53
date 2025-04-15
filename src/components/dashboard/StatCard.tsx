
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  Icon: LucideIcon;
  bgColor: string;
  textColor: string;
  progressValue?: number;
  progressBgColor?: string;
}

const StatCard = ({
  title,
  value,
  Icon,
  bgColor,
  textColor,
  progressValue = 100,
  progressBgColor = 'bg-gray-100'
}: StatCardProps) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
        </div>
        <div className={`h-12 w-12 ${bgColor} rounded-full flex items-center justify-center`}>
          <Icon className={`h-6 w-6 ${textColor}`} />
        </div>
      </div>
      <Progress value={progressValue} className={`h-1 mt-3 ${progressBgColor}`} />
    </CardContent>
  </Card>
);

export default StatCard;
