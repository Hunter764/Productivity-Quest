import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Friend, Challenge } from "@/types/productivity";
import { 
  Users, 
  Trophy, 
  Crown, 
  Swords, 
  Clock, 
  Star,
  UserPlus,
  Medal,
  Target,
  Calendar
} from "lucide-react";

interface SocialFeaturesProps {
  friends: Friend[];
  challenges: Challenge[];
  currentUserXP: number;
  onJoinChallenge: (challengeId: string) => void;
  onCreateChallenge: () => void;
}

export const SocialFeatures = ({ 
  friends, 
  challenges, 
  currentUserXP,
  onJoinChallenge,
  onCreateChallenge 
}: SocialFeaturesProps) => {
  const [selectedTab, setSelectedTab] = useState("leaderboard");

  const sortedFriends = [...friends].sort((a, b) => b.totalXP - a.totalXP);
  const activeChallenges = challenges.filter(c => c.isActive);
  const completedChallenges = challenges.filter(c => !c.isActive);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'studying': return 'bg-blue-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'studying': return '📚';
      case 'online': return '🟢';
      case 'offline': return '⚫';
      default: return '⚫';
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 retro-card">
          <TabsTrigger value="leaderboard">🏆 Leaderboard</TabsTrigger>
          <TabsTrigger value="friends">👥 Friends</TabsTrigger>
          <TabsTrigger value="challenges">⚔️ Challenges</TabsTrigger>
        </TabsList>

        <TabsContent value="leaderboard" className="space-y-4">
          <Card className="retro-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-gaming-accent" />
                Weekly Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sortedFriends.slice(0, 10).map((friend, index) => (
                  <div key={friend.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
                    <div className="flex items-center gap-3 flex-1">
                      {/* Rank */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        index === 0 ? 'bg-yellow-500 text-black' :
                        index === 1 ? 'bg-gray-400 text-black' :
                        index === 2 ? 'bg-amber-600 text-white' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {index < 3 ? (
                          index === 0 ? <Crown className="w-4 h-4" /> : index + 1
                        ) : (
                          index + 1
                        )}
                      </div>

                      {/* Avatar & Info */}
                      <div className="relative">
                        <img 
                          src={friend.avatar} 
                          alt={friend.name}
                          className="w-10 h-10 rounded-full pixelated"
                        />
                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border border-background ${getStatusColor(friend.status)}`} />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{friend.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {getStatusIcon(friend.status)}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Level {friend.level}</span>
                          <span>{friend.currentStreak} day streak</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-lg font-bold text-gaming-primary">
                          {friend.totalXP.toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground">XP</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="friends" className="space-y-4">
          <Card className="retro-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-gaming-primary" />
                  Friends ({friends.length})
                </CardTitle>
                <Button size="sm" variant="outline">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Friend
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {friends.length > 0 ? (
                <div className="space-y-3">
                  {friends.map((friend) => (
                    <div key={friend.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
                      <div className="relative">
                        <img 
                          src={friend.avatar} 
                          alt={friend.name}
                          className="w-12 h-12 rounded-full pixelated"
                        />
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background ${getStatusColor(friend.status)}`} />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold">{friend.name}</span>
                          <Badge variant="outline" className="text-xs">
                            Level {friend.level}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            {friend.totalXP.toLocaleString()} XP
                          </span>
                          <span className="flex items-center gap-1">
                            <Medal className="w-3 h-3" />
                            {friend.currentStreak} day streak
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Last active: {friend.lastActive.toLocaleDateString()}
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <Button size="sm" variant="outline" className="text-xs">
                          Challenge
                        </Button>
                        <Button size="sm" variant="outline" className="text-xs">
                          Message
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">No Friends Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Add friends to compete on the leaderboard and join challenges together!
                  </p>
                  <Button>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Find Friends
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="challenges" className="space-y-4">
          <Card className="retro-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Swords className="w-5 h-5 text-gaming-accent" />
                  Active Challenges ({activeChallenges.length})
                </CardTitle>
                <Button size="sm" onClick={onCreateChallenge}>
                  <Target className="w-4 h-4 mr-2" />
                  Create Challenge
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {activeChallenges.length > 0 ? (
                <div className="space-y-4">
                  {activeChallenges.map((challenge) => {
                    const daysLeft = Math.ceil((challenge.endsAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                    const participantCount = challenge.participants.length;
                    
                    return (
                      <div key={challenge.id} className="p-4 border rounded-lg bg-secondary/30">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold">{challenge.title}</h4>
                            <p className="text-sm text-muted-foreground">{challenge.description}</p>
                          </div>
                          <Badge variant="outline" className="capitalize">
                            {challenge.type}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="text-center">
                            <div className="text-lg font-bold text-gaming-primary">{participantCount}</div>
                            <div className="text-xs text-muted-foreground">Participants</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-gaming-accent">{daysLeft}</div>
                            <div className="text-xs text-muted-foreground">Days Left</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-gaming-text">{challenge.target}</div>
                            <div className="text-xs text-muted-foreground">Target</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-purple-500">{challenge.reward.xp}</div>
                            <div className="text-xs text-muted-foreground">XP Reward</div>
                          </div>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-sm">
                            <span>Your Progress</span>
                            <span>0/{challenge.target}</span>
                          </div>
                          <Progress value={0} className="h-2" />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            Ends {challenge.endsAt.toLocaleDateString()}
                          </div>
                          <Button 
                            size="sm" 
                            onClick={() => onJoinChallenge(challenge.id)}
                          >
                            Join Challenge
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Swords className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">No Active Challenges</h3>
                  <p className="text-muted-foreground mb-4">
                    Create or join challenges to compete with friends and earn rewards!
                  </p>
                  <Button onClick={onCreateChallenge}>
                    <Target className="w-4 h-4 mr-2" />
                    Create Challenge
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {completedChallenges.length > 0 && (
            <Card className="retro-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-green-500" />
                  Completed Challenges
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {completedChallenges.slice(0, 5).map((challenge) => (
                    <div key={challenge.id} className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white">
                        <Trophy className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-green-700 dark:text-green-300">{challenge.title}</h4>
                        <div className="text-sm text-muted-foreground">
                          Completed {challenge.endsAt.toLocaleDateString()}
                        </div>
                      </div>
                      <Badge className="bg-green-500/20 text-green-700 dark:text-green-300">
                        +{challenge.reward.xp} XP
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};