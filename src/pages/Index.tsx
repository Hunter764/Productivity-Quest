import { useState } from "react";
import { useProductivityData } from "@/hooks/useProductivityData";
import { ResponsiveNavBar } from "@/components/ResponsiveNavBar";
import { DashboardStats } from "@/components/DashboardStats";
import { TechnologyCard } from "@/components/TechnologyCard";
import { ProgressChart } from "@/components/ProgressChart";
import { StreakTracker } from "@/components/StreakTracker";
import { HeatmapCalendar } from "@/components/HeatmapCalendar";
import { GoalsManager } from "@/components/GoalsManager";
import { TimeTracker } from "@/components/TimeTracker";
import { AddTechnologyModal } from "@/components/AddTechnologyModal";
import { GameCharacter } from "@/components/GameCharacter";
import { CollectionShowcase } from "@/components/CollectionShowcase";
import { AchievementSystem } from "@/components/AchievementSystem";
import { DailyQuests } from "@/components/DailyQuests";
import { SocialFeatures } from "@/components/SocialFeatures";
import { RewardSystem } from "@/components/RewardSystem";
import { AnimeCharacterGallery } from "@/components/AnimeCharacterGallery";
import { useCharacters } from "@/hooks/useCharacters";
import { Notes } from "@/pages/Notes";
import { QuoteOfTheDay } from "@/components/QuoteOfTheDay";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Crown } from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const {
    currentGoal,
    progressHistory,
    addTechnology,
    addTask,
    completeTask,
    getDashboardStats
  } = useProductivityData();

  const {
    characters,
    stats: characterStats,
    loading: charactersLoading,
    unlockCharacter,
    equipCharacter,
    checkAutoUnlocks
  } = useCharacters();

  const stats = getDashboardStats();
  const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

  const playerLevel = Math.floor(stats.totalPoints / 50) + 1;
  const playerExperience = stats.totalPoints;

  return (
    <div className="min-h-screen bg-background">
      <ResponsiveNavBar
        playerLevel={playerLevel}
        playerExperience={playerExperience}
        isCharacterActive={stats.tasksCompleted > 0}
        currentMonth={currentMonth}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Quote of the Day Widget */}
          <div className="fixed bottom-4 right-4 z-50 w-80 max-w-[calc(100vw-2rem)] md:relative md:bottom-auto md:right-auto md:w-full md:max-w-none">
            <QuoteOfTheDay />
          </div>
          
          {/* Removed Tabs wrapper since navigation is now in ResponsiveNavBar */}

          {activeTab === "dashboard" && (
            <div className="space-y-8">
            {/* Welcome Section */}
            <Card className="retro-card bg-gradient-to-r from-gaming-primary/10 to-gaming-accent/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-gaming-accent" />
                  Productivity Quest Dashboard - {currentMonth}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Welcome back, adventurer! Complete daily quests, unlock collectible characters, 
                  and climb the leaderboards as you master new technologies. Your journey to becoming 
                  a coding legend starts here! 🚀
                </p>
              </CardContent>
            </Card>

            {/* Dashboard Stats */}
            <DashboardStats stats={stats} />

            <div className="grid gap-8 lg:grid-cols-2">
              {/* Streak Tracker */}
              <StreakTracker progressHistory={progressHistory} />
              
              {/* Heatmap Calendar */}
              <HeatmapCalendar progressHistory={progressHistory} />
            </div>

            {/* Quick Progress Overview */}
            {currentGoal && currentGoal.technologies.length > 0 && (
              <ProgressChart 
                progressHistory={progressHistory} 
                technologies={currentGoal.technologies} 
              />
            )}
            </div>
          )}

          {activeTab === "quests" && (
            <div className="space-y-8">
            <DailyQuests 
              quests={[
                {
                  id: '1',
                  title: 'Complete 3 Tasks',
                  description: 'Finish any 3 learning tasks today',
                  icon: 'target',
                  difficulty: 'easy',
                  type: 'complete_tasks',
                  target: 3,
                  progress: Math.min(stats.tasksCompleted, 3),
                  reward: { xp: 50, coins: 25 },
                  isCompleted: stats.tasksCompleted >= 3,
                  expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
                },
                {
                  id: '2',
                  title: 'Study for 2 Hours',
                  description: 'Spend at least 2 hours on focused learning',
                  icon: 'timer',
                  difficulty: 'medium',
                  type: 'study_time',
                  target: 120,
                  progress: 0,
                  reward: { xp: 100, coins: 50, character: 'rare' },
                  isCompleted: false,
                  expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
                },
                {
                  id: '3',
                  title: 'Maintain Streak',
                  description: 'Keep your learning streak alive',
                  icon: 'trending-up',
                  difficulty: 'hard',
                  type: 'streak',
                  target: 1,
                  progress: stats.currentStreak > 0 ? 1 : 0,
                  reward: { xp: 200, coins: 100 },
                  isCompleted: stats.currentStreak > 0,
                  expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
                }
              ]}
              onCompleteQuest={(questId) => console.log('Complete quest:', questId)}
            />
            </div>
          )}

          {activeTab === "technologies" && (
            <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">🛠️ Your Technologies</h2>
              <AddTechnologyModal onAddTechnology={addTechnology} />
            </div>

            {currentGoal && currentGoal.technologies.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {currentGoal.technologies.map((tech) => (
                  <TechnologyCard
                    key={tech.id}
                    technology={tech}
                    onAddTask={(title, description, points) => 
                      addTask(tech.id, title, description, points)
                    }
                    onCompleteTask={(taskId) => completeTask(tech.id, taskId)}
                  />
                ))}
              </div>
            ) : (
              <Card className="retro-card text-center py-12">
                <CardContent>
                  <div className="text-6xl mb-4">🎯</div>
                  <h3 className="text-lg font-semibold mb-2">Start Your Quest!</h3>
                  <p className="text-muted-foreground mb-6">
                    Add your first technology to begin tracking your learning progress.
                  </p>
                  <AddTechnologyModal onAddTechnology={addTechnology} />
                </CardContent>
              </Card>
            )}
            </div>
          )}

          {activeTab === "collection" && (
            <div className="space-y-8">
            <AnimeCharacterGallery 
              characters={characters}
              stats={characterStats}
              loading={charactersLoading}
              onUnlock={unlockCharacter}
              onEquip={equipCharacter}
            />
            </div>
          )}

          {activeTab === "achievements" && (
            <div className="space-y-8">
            <AchievementSystem 
              achievements={[
                {
                  id: '1',
                  title: 'First Steps',
                  description: 'Complete your first task',
                  icon: 'trophy',
                  category: 'progress',
                  rarity: 'bronze',
                  condition: { type: 'tasks', target: 1 },
                  reward: { type: 'badge', value: 'first_task' },
                  isUnlocked: stats.tasksCompleted >= 1,
                  unlockedAt: stats.tasksCompleted >= 1 ? new Date() : undefined,
                  progress: Math.min(stats.tasksCompleted, 1)
                },
                {
                  id: '2',
                  title: 'Dedicated Learner',
                  description: 'Complete 10 tasks',
                  icon: 'medal',
                  category: 'progress',
                  rarity: 'silver',
                  condition: { type: 'tasks', target: 10 },
                  reward: { type: 'character', value: 'rare_character' },
                  isUnlocked: stats.tasksCompleted >= 10,
                  unlockedAt: stats.tasksCompleted >= 10 ? new Date() : undefined,
                  progress: Math.min(stats.tasksCompleted, 10)
                },
                {
                  id: '3',
                  title: 'Streak Master',
                  description: 'Maintain a 7-day streak',
                  icon: 'star',
                  category: 'streak',
                  rarity: 'gold',
                  condition: { type: 'streak', target: 7 },
                  reward: { type: 'title', value: 'Streak Master' },
                  isUnlocked: stats.longestStreak >= 7,
                  unlockedAt: stats.longestStreak >= 7 ? new Date() : undefined,
                  progress: Math.min(stats.longestStreak, 7)
                }
              ]}
            />
            </div>
          )}

          {activeTab === "social" && (
            <div className="space-y-8">
            <SocialFeatures 
              friends={[
                {
                  id: '1',
                  name: 'Alex Chen',
                  avatar: '/placeholder.svg',
                  level: 15,
                  totalXP: 2400,
                  currentStreak: 12,
                  lastActive: new Date(),
                  status: 'studying'
                },
                {
                  id: '2',
                  name: 'Sarah Johnson',
                  avatar: '/placeholder.svg',
                  level: 22,
                  totalXP: 4200,
                  currentStreak: 8,
                  lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
                  status: 'online'
                }
              ]}
              challenges={[
                {
                  id: '1',
                  title: 'Weekly Code Sprint',
                  description: 'Complete 25 coding tasks this week',
                  type: 'group',
                  category: 'tasks',
                  target: 25,
                  duration: 7,
                  participants: ['user', '1', '2'],
                  progress: { user: 8, '1': 12, '2': 15 },
                  reward: { xp: 500, character: 'epic_coder' },
                  isActive: true,
                  createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
                  endsAt: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000)
                }
              ]}
              currentUserXP={stats.totalPoints}
              onJoinChallenge={(id) => console.log('Join challenge:', id)}
              onCreateChallenge={() => console.log('Create challenge')}
            />
            </div>
          )}

          {activeTab === "rewards" && (
            <div className="space-y-8">
            <RewardSystem 
              rewardBoxes={[
                {
                  id: '1',
                  type: 'daily',
                  rarity: 'common',
                  contents: [
                    { type: 'coins', value: 50, rarity: 'common' },
                    { type: 'character', value: 'common_warrior', rarity: 'common' }
                  ],
                  isOpened: false,
                  earnedAt: new Date()
                },
                {
                  id: '2',
                  type: 'quest',
                  rarity: 'rare',
                  contents: [
                    { type: 'character', value: 'rare_mage', rarity: 'rare' },
                    { type: 'coins', value: 100, rarity: 'rare' }
                  ],
                  isOpened: true,
                  earnedAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
                }
              ]}
              userCoins={1250}
              onOpenBox={(id) => console.log('Open box:', id)}
              onPurchaseBox={(type) => console.log('Purchase box:', type)}
            />
            </div>
          )}


          {activeTab === "goals" && (
            <div className="space-y-8">
            <GoalsManager totalPoints={stats.totalPoints} />
            </div>
          )}

          {activeTab === "notes" && (
            <Notes />
          )}

          {activeTab === "timer" && (
            <div className="space-y-8">
            {currentGoal && currentGoal.technologies.length > 0 ? (
              <TimeTracker 
                technologies={currentGoal.technologies}
                onTimeLogged={(techId, seconds, description) => {
                  // Convert time to points (1 point per 15 minutes)
                  const points = Math.floor(seconds / 900);
                  if (points > 0) {
                    addTask(techId, `Timed session: ${description}`, `${Math.floor(seconds / 60)} minutes`, points);
                  }
                }}
              />
            ) : (
              <Card className="retro-card text-center py-12">
                <CardContent>
                  <div className="text-6xl mb-4">⏱️</div>
                  <h3 className="text-lg font-semibold mb-2">Timer Ready</h3>
                  <p className="text-muted-foreground mb-6">
                    Add technologies to start timing your learning sessions.
                  </p>
                  <AddTechnologyModal onAddTechnology={addTechnology} />
                </CardContent>
              </Card>
            )}
            </div>
          )}

          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground py-8">
            <p>🎮 Level up your skills, collect legendary characters, and become the ultimate learning champion! 🏆</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
