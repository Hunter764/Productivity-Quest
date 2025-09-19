import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { DailyQuest } from "@/types/productivity";
import { 
  CheckCircle, 
  Clock, 
  Coins, 
  Star, 
  Target, 
  Timer, 
  TrendingUp,
  Zap,
  Gift
} from "lucide-react";

interface DailyQuestsProps {
  quests: DailyQuest[];
  onCompleteQuest: (questId: string) => void;
}

export const DailyQuests = ({ quests, onCompleteQuest }: DailyQuestsProps) => {
  const getQuestIcon = (type: string) => {
    switch (type) {
      case 'complete_tasks': return <Target className="w-4 h-4" />;
      case 'study_time': return <Timer className="w-4 h-4" />;
      case 'streak': return <TrendingUp className="w-4 h-4" />;
      case 'technology_focus': return <Zap className="w-4 h-4" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const completedQuests = quests.filter(q => q.isCompleted);
  const activeQuests = quests.filter(q => !q.isCompleted);
  
  const totalRewards = completedQuests.reduce((sum, quest) => sum + quest.reward.xp + quest.reward.coins, 0);

  return (
    <div className="space-y-6">
      {/* Daily Progress Overview */}
      <Card className="retro-card bg-gradient-to-r from-gaming-primary/10 to-gaming-accent/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-gaming-accent" />
            Daily Quest Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gaming-primary">{completedQuests.length}</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gaming-accent">{activeQuests.length}</div>
              <div className="text-sm text-muted-foreground">Remaining</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gaming-text">{totalRewards}</div>
              <div className="text-sm text-muted-foreground">Rewards Earned</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gaming-text">
                {((completedQuests.length / quests.length) * 100).toFixed(0)}%
              </div>
              <div className="text-sm text-muted-foreground">Daily Goal</div>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Daily Progress</span>
              <span>{completedQuests.length}/{quests.length}</span>
            </div>
            <Progress 
              value={(completedQuests.length / quests.length) * 100} 
              className="h-3"
            />
          </div>
        </CardContent>
      </Card>

      {/* Active Quests */}
      {activeQuests.length > 0 && (
        <Card className="retro-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-gaming-primary" />
              Active Quests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {activeQuests.map((quest) => (
                <div key={quest.id} className="p-4 border rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full ${getDifficultyColor(quest.difficulty)} flex items-center justify-center text-white`}>
                        {getQuestIcon(quest.type)}
                      </div>
                      <div>
                        <h4 className="font-semibold">{quest.title}</h4>
                        <p className="text-sm text-muted-foreground">{quest.description}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {quest.difficulty}
                    </Badge>
                  </div>

                  {/* Progress */}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{quest.progress}/{quest.target}</span>
                    </div>
                    <Progress 
                      value={(quest.progress / quest.target) * 100} 
                      className="h-2"
                    />
                  </div>

                  {/* Rewards */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1 text-gaming-accent">
                        <Star className="w-3 h-3" />
                        {quest.reward.xp} XP
                      </div>
                      <div className="flex items-center gap-1 text-gaming-primary">
                        <Coins className="w-3 h-3" />
                        {quest.reward.coins}
                      </div>
                      {quest.reward.character && (
                        <div className="flex items-center gap-1 text-purple-500">
                          <Gift className="w-3 h-3" />
                          Character
                        </div>
                      )}
                    </div>
                    
                    {quest.progress >= quest.target && (
                      <Button 
                        size="sm" 
                        onClick={() => onCompleteQuest(quest.id)}
                        className="animate-pulse"
                      >
                        Claim Reward
                      </Button>
                    )}
                  </div>

                  {/* Time Remaining */}
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                    <Clock className="w-3 h-3" />
                    Expires: {new Date(quest.expiresAt).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Completed Quests */}
      {completedQuests.length > 0 && (
        <Card className="retro-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Completed Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {completedQuests.map((quest) => (
                <div key={quest.id} className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-green-700 dark:text-green-300">{quest.title}</h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        +{quest.reward.xp} XP
                      </span>
                      <span className="flex items-center gap-1">
                        <Coins className="w-3 h-3" />
                        +{quest.reward.coins}
                      </span>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-green-500/20 text-green-700 dark:text-green-300">
                    Complete
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {quests.length === 0 && (
        <Card className="retro-card text-center py-12">
          <CardContent>
            <Star className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No Quests Available</h3>
            <p className="text-muted-foreground">
              Check back tomorrow for new daily challenges!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};