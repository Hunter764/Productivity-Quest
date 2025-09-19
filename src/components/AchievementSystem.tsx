import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Achievement } from "@/types/productivity";
import { Trophy, Medal, Award, Star, Lock, CheckCircle } from "lucide-react";

interface AchievementSystemProps {
  achievements: Achievement[];
}

export const AchievementSystem = ({ achievements }: AchievementSystemProps) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'progress': return <Trophy className="w-4 h-4" />;
      case 'streak': return <Medal className="w-4 h-4" />;
      case 'social': return <Star className="w-4 h-4" />;
      case 'special': return <Award className="w-4 h-4" />;
      default: return <Trophy className="w-4 h-4" />;
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'bronze': return 'from-amber-600 to-amber-400';
      case 'silver': return 'from-gray-500 to-gray-300';
      case 'gold': return 'from-yellow-500 to-yellow-300';
      case 'platinum': return 'from-purple-500 to-purple-300';
      default: return 'from-gray-500 to-gray-300';
    }
  };

  const unlockedAchievements = achievements.filter(a => a.isUnlocked);
  const inProgressAchievements = achievements.filter(a => !a.isUnlocked && a.progress > 0);
  const lockedAchievements = achievements.filter(a => !a.isUnlocked && a.progress === 0);

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <Card className="retro-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-gaming-accent" />
            Achievement Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gaming-primary">{unlockedAchievements.length}</div>
              <div className="text-sm text-muted-foreground">Unlocked</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gaming-accent">{inProgressAchievements.length}</div>
              <div className="text-sm text-muted-foreground">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-muted-foreground">{lockedAchievements.length}</div>
              <div className="text-sm text-muted-foreground">Locked</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gaming-text">
                {((unlockedAchievements.length / achievements.length) * 100).toFixed(0)}%
              </div>
              <div className="text-sm text-muted-foreground">Complete</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recently Unlocked */}
      {unlockedAchievements.length > 0 && (
        <Card className="retro-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Recently Unlocked
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {unlockedAchievements
                .sort((a, b) => new Date(b.unlockedAt!).getTime() - new Date(a.unlockedAt!).getTime())
                .slice(0, 3)
                .map((achievement) => (
                <div key={achievement.id} className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getRarityColor(achievement.rarity)} flex items-center justify-center`}>
                    {getCategoryIcon(achievement.category)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{achievement.title}</h4>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {achievement.rarity}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* In Progress */}
      {inProgressAchievements.length > 0 && (
        <Card className="retro-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Medal className="w-5 h-5 text-gaming-accent" />
              In Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {inProgressAchievements.map((achievement) => (
                <div key={achievement.id} className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getRarityColor(achievement.rarity)} flex items-center justify-center`}>
                      {getCategoryIcon(achievement.category)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{achievement.title}</h4>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {achievement.rarity}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{achievement.progress}/{achievement.condition.target}</span>
                    </div>
                    <Progress 
                      value={(achievement.progress / achievement.condition.target) * 100} 
                      className="h-2"
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Achievements */}
      <Card className="retro-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-gaming-primary" />
            All Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {achievements.map((achievement) => (
              <div 
                key={achievement.id} 
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-300 ${
                  achievement.isUnlocked 
                    ? 'bg-secondary/50 border-gaming-accent/50' 
                    : 'bg-muted/30 border-muted-foreground/20'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  achievement.isUnlocked 
                    ? `bg-gradient-to-br ${getRarityColor(achievement.rarity)}` 
                    : 'bg-muted'
                }`}>
                  {achievement.isUnlocked ? getCategoryIcon(achievement.category) : <Lock className="w-4 h-4" />}
                </div>
                <div className="flex-1">
                  <h4 className={`font-semibold ${achievement.isUnlocked ? '' : 'text-muted-foreground'}`}>
                    {achievement.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                  {!achievement.isUnlocked && achievement.progress > 0 && (
                    <div className="mt-2">
                      <Progress 
                        value={(achievement.progress / achievement.condition.target) * 100} 
                        className="h-1"
                      />
                    </div>
                  )}
                </div>
                <Badge 
                  variant={achievement.isUnlocked ? "default" : "outline"} 
                  className="capitalize"
                >
                  {achievement.rarity}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};