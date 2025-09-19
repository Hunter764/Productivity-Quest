import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressEntry } from "@/types/productivity";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeatmapCalendarProps {
  progressHistory: ProgressEntry[];
}

export const HeatmapCalendar = ({ progressHistory }: HeatmapCalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getMonthData = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startCalendar = new Date(firstDay);
    startCalendar.setDate(firstDay.getDate() - firstDay.getDay());
    
    const days = [];
    const current = new Date(startCalendar);
    
    // Generate 6 weeks of calendar
    for (let week = 0; week < 6; week++) {
      for (let day = 0; day < 7; day++) {
        const dateStr = current.toISOString().split('T')[0];
        const dayProgress = progressHistory.filter(entry => entry.date === dateStr);
        const totalPoints = dayProgress.reduce((sum, entry) => sum + entry.points, 0);
        
        days.push({
          date: new Date(current),
          dateStr,
          totalPoints,
          isCurrentMonth: current.getMonth() === month,
          isToday: dateStr === new Date().toISOString().split('T')[0]
        });
        
        current.setDate(current.getDate() + 1);
      }
    }
    
    return days;
  };

  const getIntensityLevel = (points: number) => {
    if (points === 0) return 0;
    if (points <= 2) return 1;
    if (points <= 5) return 2;
    if (points <= 8) return 3;
    return 4;
  };

  const getIntensityColor = (level: number) => {
    const colors = [
      'bg-muted/30', // 0 points
      'bg-game-exp/25', // 1-2 points
      'bg-game-exp/50', // 3-5 points
      'bg-game-exp/75', // 6-8 points
      'bg-game-exp' // 9+ points
    ];
    return colors[level];
  };

  const monthData = getMonthData(currentDate);
  const monthName = currentDate.toLocaleDateString('en', { month: 'long', year: 'numeric' });

  const previousMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const nextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  const totalMonthPoints = monthData
    .filter(day => day.isCurrentMonth)
    .reduce((sum, day) => sum + day.totalPoints, 0);

  const activeDays = monthData
    .filter(day => day.isCurrentMonth && day.totalPoints > 0).length;

  return (
    <Card className="retro-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span>📅 Activity Heatmap</span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={previousMonth}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium min-w-[120px] text-center">
              {monthName}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={nextMonth}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Month Stats */}
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="space-y-1">
            <div className="text-2xl font-bold text-primary">{totalMonthPoints}</div>
            <div className="text-xs text-muted-foreground">Points This Month</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-accent">{activeDays}</div>
            <div className="text-xs text-muted-foreground">Active Days</div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="space-y-2">
          {/* Day labels */}
          <div className="grid grid-cols-7 gap-1 text-xs text-muted-foreground text-center">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="py-1">{day}</div>
            ))}
          </div>
          
          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-1">
            {monthData.map((day, index) => {
              const intensityLevel = getIntensityLevel(day.totalPoints);
              const colorClass = getIntensityColor(intensityLevel);
              
              return (
                <div
                  key={index}
                  className={`
                    aspect-square flex items-center justify-center text-xs font-medium rounded pixel-border transition-all cursor-pointer
                    ${colorClass}
                    ${day.isCurrentMonth ? 'opacity-100' : 'opacity-30'}
                    ${day.isToday ? 'ring-2 ring-primary' : ''}
                    hover:scale-110 hover:z-10 relative
                  `}
                  title={`${day.date.toLocaleDateString()}: ${day.totalPoints} points`}
                >
                  {day.date.getDate()}
                  {day.totalPoints > 0 && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-game-gold rounded-full border border-background"></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Less</span>
          <div className="flex items-center gap-1">
            {[0, 1, 2, 3, 4].map(level => (
              <div
                key={level}
                className={`w-3 h-3 rounded ${getIntensityColor(level)} pixel-border`}
              />
            ))}
          </div>
          <span className="text-muted-foreground">More</span>
        </div>
      </CardContent>
    </Card>
  );
};