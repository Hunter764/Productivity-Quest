import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ThemeToggle } from "@/components/ThemeToggle";
import { GameCharacter } from "@/components/GameCharacter";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  Calendar, 
  User, 
  LogOut, 
  Menu, 
  X,
  Home,
  Star,
  Rocket,
  Gamepad2,
  Trophy,
  Users,
  Gift,
  Target,
  Timer,
  BookOpen
} from "lucide-react";

interface ResponsiveNavBarProps {
  playerLevel: number;
  playerExperience: number;
  isCharacterActive: boolean;
  currentMonth: string;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const navigationItems = [
  { id: "dashboard", label: "Dashboard", icon: Home, emoji: "📊" },
  { id: "quests", label: "Quests", icon: Star, emoji: "⭐" },
  { id: "technologies", label: "Technologies", icon: Rocket, emoji: "🚀" },
  { id: "notes", label: "Notes", icon: BookOpen, emoji: "📝" },
  { id: "collection", label: "Collection", icon: Gamepad2, emoji: "👾" },
  { id: "achievements", label: "Achievements", icon: Trophy, emoji: "🏆" },
  { id: "social", label: "Social", icon: Users, emoji: "👥" },
  { id: "rewards", label: "Rewards", icon: Gift, emoji: "🎁" },
  { id: "goals", label: "Goals", icon: Target, emoji: "🎯" },
  { id: "timer", label: "Timer", icon: Timer, emoji: "⏱️" },
];

export const ResponsiveNavBar = ({
  playerLevel,
  playerExperience,
  isCharacterActive,
  currentMonth,
  activeTab = "dashboard",
  onTabChange
}: ResponsiveNavBarProps) => {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: 'Sign out failed',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Signed out successfully',
        description: 'See you next time!',
      });
    }
  };

  const handleTabClick = (tabId: string) => {
    onTabChange?.(tabId);
    setIsMobileMenuOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold glow-effect">
                🎮 Productivity Quest
              </h1>
              <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {currentMonth}
              </div>
            </div>
            
            {/* Desktop Navigation Actions */}
            <div className="hidden md:flex items-center gap-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate("/profile")}
                className="transition-all duration-200 hover:scale-105"
              >
                <User className="w-4 h-4 mr-2" />
                Profile
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleSignOut}
                className="transition-all duration-200 hover:scale-105"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
              <GameCharacter 
                level={playerLevel} 
                experience={playerExperience}
                isActive={isCharacterActive}
              />
              <ThemeToggle />
            </div>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMobileMenu}
                onKeyDown={(e) => handleKeyDown(e, toggleMobileMenu)}
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
                aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                className="p-2 transition-all duration-200"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <Collapsible 
          open={isMobileMenuOpen} 
          onOpenChange={setIsMobileMenuOpen}
          className="md:hidden"
        >
          <CollapsibleContent
            id="mobile-menu"
            className="border-t border-border bg-card/95 backdrop-blur-sm"
          >
            <div className="container mx-auto px-4 py-4">
              {/* Mobile User Actions */}
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <GameCharacter 
                    level={playerLevel} 
                    experience={playerExperience}
                    isActive={isCharacterActive}
                  />
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {currentMonth}
                  </div>
                </div>
                <ThemeToggle />
              </div>

              {/* Mobile Navigation Items */}
              <nav role="navigation" aria-label="Main navigation">
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {navigationItems.map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleTabClick(item.id)}
                        onKeyDown={(e) => handleKeyDown(e, () => handleTabClick(item.id))}
                        role="menuitem"
                        aria-current={isActive ? "page" : undefined}
                        className={`
                          flex items-center gap-2 p-3 rounded-md text-left text-sm font-medium
                          transition-all duration-200 hover:scale-105
                          ${isActive 
                            ? 'bg-primary text-primary-foreground shadow-md' 
                            : 'bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground'
                          }
                        `}
                      >
                        <span className="text-base">{item.emoji}</span>
                        <span className="truncate">{item.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Mobile Action Buttons */}
                <div className="flex flex-col gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      navigate("/profile");
                      setIsMobileMenuOpen(false);
                    }}
                    className="justify-start transition-all duration-200"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      handleSignOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className="justify-start transition-all duration-200"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </nav>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </header>

      {/* Desktop Navigation Tabs */}
      {!isMobile && (
        <div className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-[73px] z-40">
          <div className="container mx-auto px-4">
            <nav role="navigation" aria-label="Main navigation">
              <div className="flex overflow-x-auto scrollbar-hide">
                {navigationItems.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleTabClick(item.id)}
                      onKeyDown={(e) => handleKeyDown(e, () => handleTabClick(item.id))}
                      role="menuitem"
                      aria-current={isActive ? "page" : undefined}
                      className={`
                        flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap
                        transition-all duration-200 hover:scale-105 border-b-2
                        ${isActive 
                          ? 'border-primary text-primary bg-primary/5' 
                          : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
                        }
                      `}
                    >
                      <span>{item.emoji}</span>
                      <span className="hidden lg:inline">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setIsMobileMenuOpen(false);
            }
          }}
          tabIndex={-1}
          aria-hidden="true"
        />
      )}
    </>
  );
};