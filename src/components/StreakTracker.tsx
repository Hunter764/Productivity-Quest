import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Flame, Target, TrendingUp } from "lucide-react";
import { ProgressEntry } from "@/types/productivity";

interface StreakTrackerProps {
  progressHistory: ProgressEntry[];
}

export const StreakTracker = ({ progressHistory }: StreakTrackerProps) => {
  const calculateStreak = () => {
    if (progressHistory.length === 0) return { current: 0, longest: 0 };
    
    const sortedDates = [...new Set(progressHistory.map(entry => entry.date))].sort();
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    
    // Check if today or yesterday has progress
    const todayStr = today.toISOString().split('T')[0];
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    let streakBroken = false;
    
    for (let i = sortedDates.length - 1; i >= 0; i--) {
      const currentDate = new Date(sortedDates[i]);
      
      if (i === sortedDates.length - 1) {
        // Most recent date
        if (sortedDates[i] === todayStr || sortedDates[i] === yesterdayStr) {
          tempStreak = 1;
        } else {
          streakBroken = true;
        }
      } else {
        const nextDate = new Date(sortedDates[i + 1]);
        const dayDiff = Math.floor((nextDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (dayDiff === 1) {
          tempStreak++;
        } else {
          if (!streakBroken) {
            currentStreak = tempStreak;
            streakBroken = true;
          }
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
        }
      }
    }
    
    if (!streakBroken) {
      currentStreak = tempStreak;
    }
    longestStreak = Math.max(longestStreak, tempStreak);
    
    return { current: currentStreak, longest: longestStreak };
  };

  const getWeeklyProgress = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      weekDays.push(day.toISOString().split('T')[0]);
    }
    
    const weekProgress = weekDays.map(date => ({
      date,
      hasProgress: progressHistory.some(entry => entry.date === date),
      dayName: new Date(date).toLocaleDateString('en', { weekday: 'short' })
    }));
    
    return weekProgress;
  };

  const streaks = calculateStreak();
  const weekProgress = getWeeklyProgress();
  const completedDaysThisWeek = weekProgress.filter(day => day.hasProgress).length;

  return (
    <Card className="retro-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-game-fire" />
          🔥 Streak Tracker
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Current Streak */}
        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-game-fire/10 to-game-gold/10 rounded pixel-border">
          <div className="flex items-center gap-2">
            <div className="text-2xl">🔥</div>
            <div>
              <div className="font-bold text-lg">{streaks.current} days</div>
              <div className="text-xs text-muted-foreground">Current Streak</div>
            </div>
          </div>
          <Badge variant="secondary" className="bg-game-fire/20 text-game-fire border-game-fire">
            {streaks.current > 0 ? 'ON FIRE!' : 'START TODAY'}
          </Badge>
        </div>

        {/* Weekly Progress Grid */}
        <div className="space-y-2">
          <div className="text-sm font-medium flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            This Week ({completedDaysThisWeek}/7)
          </div>
          <div className="grid grid-cols-7 gap-1">
            {weekProgress.map((day, index) => (
              <div
                key={day.date}
                className={`aspect-square flex items-center justify-center text-xs font-bold rounded pixel-border transition-all ${
                  day.hasProgress
                    ? 'bg-game-exp text-white border-game-exp'
                    : 'bg-muted/50 text-muted-foreground border-muted'
                }`}
              >
                {day.dayName[0]}
              </div>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center space-y-1 p-2 bg-muted/30 rounded">
            <div className="text-xl font-bold text-primary flex items-center justify-center gap-1">
              <Target className="h-4 w-4" />
              {streaks.longest}
            </div>
            <div className="text-xs text-muted-foreground">Best Streak</div>
          </div>
          <div className="text-center space-y-1 p-2 bg-muted/30 rounded">
            <div className="text-xl font-bold text-accent flex items-center justify-center gap-1">
              <TrendingUp className="h-4 w-4" />
              {Math.round((completedDaysThisWeek / 7) * 100)}%
            </div>
            <div className="text-xs text-muted-foreground">Week Rate</div>
          </div>
        </div>

        {/* Motivational Message */}
        <div className="text-center p-2 bg-gradient-to-r from-primary/10 to-accent/10 rounded pixel-border">
          <div className="text-sm font-medium">
            {streaks.current === 0 && "🌱 Start your journey today!"}
            {streaks.current > 0 && streaks.current < 7 && "🚀 Building momentum!"}
            {streaks.current >= 7 && streaks.current < 30 && "⭐ You're on a roll!"}
            {streaks.current >= 30 && "🏆 Legendary consistency!"}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};