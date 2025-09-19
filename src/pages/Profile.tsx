import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, User, Mail, Trophy, Zap, Coins, Calendar, Star, RefreshCw, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import luffyAvatar from "@/assets/luffy-avatar.png";
import { useProductivityData } from "@/hooks/useProductivityData";

interface UserProfile {
  id: string;
  user_id: string;
  username: string;
  avatar_url?: string;
  level: number;
  total_xp: number;
  current_streak: number;
  longest_streak: number;
  coins: number;
  rank: string;
  created_at: string;
  updated_at: string;
}

export const Profile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { getDashboardStats } = useProductivityData();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  
  const stats = getDashboardStats();

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      setProfile(data);
      setUsername(data?.username || '');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    if (!user || !profile) return;

    try {
      setSaving(true);
      const { error } = await supabase
        .from('profiles')
        .update({ username })
        .eq('user_id', user.id);

      if (error) {
        toast({
          title: 'Error saving profile',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }

      setProfile({ ...profile, username });
      setIsEditing(false);
      toast({
        title: 'Profile updated',
        description: 'Your profile has been successfully updated.',
      });
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setSaving(false);
    }
  };

  const syncFromLocalData = async () => {
    if (!user) return;

    try {
      setSyncing(true);
      const { error } = await supabase
        .from('profiles')
        .update({ 
          total_xp: stats.totalPoints,
          level: Math.floor(stats.totalPoints / 50) + 1 
        })
        .eq('user_id', user.id);

      if (error) {
        toast({
          title: 'Error syncing data',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }

      await fetchProfile();
      toast({
        title: 'Data synced',
        description: 'Your local progress has been synced to your profile.',
      });
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-2xl font-bold">User Profile</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Data Sync Warning */}
          {profile && stats.totalPoints > (profile.total_xp || 0) && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Your local XP ({stats.totalPoints}) is higher than your profile XP ({profile.total_xp || 0}). 
                Click "Sync Local Data" to update your profile with the latest progress.
              </AlertDescription>
            </Alert>
          )}
          {/* Profile Card */}
          <Card className="retro-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start gap-6">
                {/* Avatar */}
                <div className="flex flex-col items-center space-y-4">
                   <Avatar className="h-24 w-24 pixel-border">
                     <AvatarImage 
                       src={luffyAvatar} 
                       alt={username || 'User'}
                       className="pixelated"
                     />
                     <AvatarFallback className="text-xl">
                       <User className="w-12 h-12" />
                     </AvatarFallback>
                   </Avatar>
                  <Badge variant="secondary" className="text-xs">
                    Level {profile?.level || 1}
                  </Badge>
                </div>

                {/* Profile Details */}
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      {isEditing ? (
                        <Input
                          id="username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="Enter username"
                        />
                      ) : (
                        <p className="text-sm p-2 bg-muted rounded">{username || 'Not set'}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <div className="flex items-center gap-2 text-sm p-2 bg-muted rounded">
                        <Mail className="h-4 w-4" />
                        {user?.email}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {isEditing ? (
                      <>
                        <Button onClick={saveProfile} disabled={saving}>
                          {saving ? 'Saving...' : 'Save Changes'}
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setIsEditing(false);
                            setUsername(profile?.username || '');
                          }}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button onClick={() => setIsEditing(true)}>
                          Edit Profile
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={syncFromLocalData}
                          disabled={syncing}
                        >
                          <RefreshCw className={`w-4 h-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
                          {syncing ? 'Syncing...' : 'Sync Local Data'}
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="retro-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Trophy className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total XP</p>
                    <p className="text-2xl font-bold">{profile?.total_xp || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="retro-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-500/10 rounded-lg">
                    <Zap className="h-6 w-6 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Current Streak</p>
                    <p className="text-2xl font-bold">{profile?.current_streak || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="retro-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-500/10 rounded-lg">
                    <Coins className="h-6 w-6 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Coins</p>
                    <p className="text-2xl font-bold">{profile?.coins || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="retro-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <Star className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Rank</p>
                    <p className="text-xl font-bold">{profile?.rank || 'Novice'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Account Info */}
          <Card className="retro-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-muted-foreground">Member Since</Label>
                  <p>{profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Last Updated</Label>
                  <p>{profile?.updated_at ? new Date(profile.updated_at).toLocaleDateString() : 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Longest Streak</Label>
                  <p>{profile?.longest_streak || 0} days</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">User ID</Label>
                  <p className="font-mono text-xs">{user?.id}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};