import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardStats as Stats } from "@/types/productivity";
import { Trophy, Target, Zap, TrendingUp } from "lucide-react";

interface DashboardStatsProps {
  stats: Stats;
}

export const DashboardStats = ({ stats }: DashboardStatsProps) => {
  const statCards = [
    {
      title: "Total Points",
      value: stats.totalPoints,
      icon: Trophy,
      color: "text-game-gold",
      bg: "bg-game-gold/20",
      border: "border-game-gold"
    },
    {
      title: "Technologies",
      value: stats.technologiesCovered,
      icon: Target,
      color: "text-primary",
      bg: "bg-primary/20",
      border: "border-primary"
    },
    {
      title: "Completion",
      value: `${Math.round(stats.completionPercentage)}%`,
      icon: TrendingUp,
      color: "text-accent",
      bg: "bg-accent/20",
      border: "border-accent"
    },
    {
      title: "Avg Level",
      value: Math.round(stats.averageLevel * 10) / 10,
      icon: Zap,
      color: "text-game-mana",
      bg: "bg-game-mana/20",
      border: "border-game-mana"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card 
            key={stat.title} 
            className={`retro-card ${stat.bg} ${stat.border} animate-slide-in`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stat.color} animate-glow`}>
                {stat.value}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.title === "Total Points" && "XP earned this month"}
                {stat.title === "Technologies" && "Skills being developed"}
                {stat.title === "Completion" && "Tasks completed"}
                {stat.title === "Avg Level" && "Across all technologies"}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};