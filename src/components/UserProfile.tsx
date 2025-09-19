import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { UserProfile as UserProfileType } from "@/types/notes";
import luffyAvatar from "@/assets/luffy-avatar.png";
import { Settings, User, Trophy, Star } from "lucide-react";

interface UserProfileProps {
  profile: UserProfileType;
  onEditProfile?: () => void;
}

export const UserProfile = ({ profile, onEditProfile }: UserProfileProps) => {
  const getXPForNextLevel = () => {
    return (profile.level * 100) - (profile.totalXP % (profile.level * 100));
  };

  const getCurrentLevelProgress = () => {
    const currentLevelXP = profile.totalXP % (profile.level * 100);
    const totalLevelXP = profile.level * 100;
    return (currentLevelXP / totalLevelXP) * 100;
  };

  const getRankTitle = () => {
    if (profile.level >= 50) return "Pirate King";
    if (profile.level >= 30) return "Captain";
    if (profile.level >= 20) return "First Mate";
    if (profile.level >= 10) return "Crew Member";
    return "Rookie Pirate";
  };

  return (
    <Card className="profile-card">
      <CardHeader className="text-center pb-2">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <Avatar className="w-24 h-24 pixel-border">
              <AvatarImage 
                src={luffyAvatar} 
                alt={profile.name}
                className="pixelated"
              />
              <AvatarFallback className="text-2xl">
                <User className="w-12 h-12" />
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-2 -right-2 level-badge">
              LVL {profile.level}
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gaming-text">{profile.name}</h2>
          <Badge variant="outline" className="pixel-border">
            <Trophy className="w-3 h-3 mr-1" />
            {getRankTitle()}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* XP Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Experience</span>
            <span className="font-mono">{profile.totalXP} XP</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-3 pixel-border">
            <div 
              className="h-full bg-gradient-to-r from-gaming-accent to-gaming-primary rounded-full transition-all duration-500"
              style={{ width: `${getCurrentLevelProgress()}%` }}
            />
          </div>
          <div className="text-xs text-center text-muted-foreground">
            {getXPForNextLevel()} XP to next level
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-secondary/50 rounded-lg pixel-border">
            <div className="text-2xl font-bold text-gaming-primary">{profile.totalXP}</div>
            <div className="text-xs text-muted-foreground">Total XP</div>
          </div>
          <div className="text-center p-3 bg-secondary/50 rounded-lg pixel-border">
            <div className="text-2xl font-bold text-gaming-accent">{profile.level}</div>
            <div className="text-xs text-muted-foreground">Level</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={onEditProfile}
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="flex-1"
          >
            <Star className="w-4 h-4 mr-2" />
            Achievements
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};