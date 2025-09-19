import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CharacterWithUnlockStatus, CharacterStats } from "@/types/characters";
import { Lock, Unlock, Star, Crown, Shield, Zap, CheckCircle, Info } from "lucide-react";

interface AnimeCharacterGalleryProps {
  characters: CharacterWithUnlockStatus[];
  stats: CharacterStats;
  onUnlock: (characterId: string) => Promise<boolean>;
  onEquip: (characterId: string) => Promise<boolean>;
  loading?: boolean;
}

export const AnimeCharacterGallery = ({ 
  characters, 
  stats, 
  onUnlock, 
  onEquip, 
  loading = false 
}: AnimeCharacterGalleryProps) => {
  const [selectedTier, setSelectedTier] = useState<string>("all");
  const [unlockingCharacter, setUnlockingCharacter] = useState<string | null>(null);
  const [equipingCharacter, setEquipingCharacter] = useState<string | null>(null);

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'starter': return <Shield className="w-4 h-4" />;
      case 'rare': return <Star className="w-4 h-4" />;
      case 'epic': return <Zap className="w-4 h-4" />;
      case 'legendary': return <Crown className="w-4 h-4" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'starter': return 'bg-secondary text-secondary-foreground';
      case 'rare': return 'bg-blue-500/20 text-blue-400 border-blue-400';
      case 'epic': return 'bg-purple-500/20 text-purple-400 border-purple-400';
      case 'legendary': return 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-400';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const filteredCharacters = selectedTier === "all" 
    ? characters 
    : characters.filter(char => char.tier === selectedTier);

  const handleUnlock = async (characterId: string) => {
    setUnlockingCharacter(characterId);
    await onUnlock(characterId);
    setUnlockingCharacter(null);
  };

  const handleEquip = async (characterId: string) => {
    setEquipingCharacter(characterId);
    await onEquip(characterId);
    setEquipingCharacter(null);
  };

  const completionPercentage = (stats.unlockedCharacters / stats.totalCharacters) * 100;

  if (loading) {
    return (
      <Card className="retro-card">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading characters...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Collection Stats */}
      <Card className="retro-card bg-gradient-to-r from-primary/5 to-accent/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-accent" />
            Anime Character Collection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Collection Progress</span>
            <span className="font-bold">{stats.unlockedCharacters}/{stats.totalCharacters}</span>
          </div>
          <Progress value={completionPercentage} className="h-3" />
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="text-center p-3 bg-secondary/30 rounded-lg">
              <div className="text-lg font-bold text-secondary-foreground">{stats.starterUnlocked}</div>
              <div className="text-xs text-muted-foreground">Starter</div>
            </div>
            <div className="text-center p-3 bg-blue-500/10 rounded-lg">
              <div className="text-lg font-bold text-blue-400">{stats.rareUnlocked}</div>
              <div className="text-xs text-muted-foreground">Rare</div>
            </div>
            <div className="text-center p-3 bg-purple-500/10 rounded-lg">
              <div className="text-lg font-bold text-purple-400">{stats.epicUnlocked}</div>
              <div className="text-xs text-muted-foreground">Epic</div>
            </div>
            <div className="text-center p-3 bg-amber-500/10 rounded-lg">
              <div className="text-lg font-bold text-amber-400">{stats.legendaryUnlocked}</div>
              <div className="text-xs text-muted-foreground">Legendary</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filter Tabs */}
      <Tabs value={selectedTier} onValueChange={setSelectedTier}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="starter">Starter</TabsTrigger>
          <TabsTrigger value="rare">Rare</TabsTrigger>
          <TabsTrigger value="epic">Epic</TabsTrigger>
          <TabsTrigger value="legendary">Legendary</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTier} className="mt-6">
          <TooltipProvider>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredCharacters.map((character) => (
                <Tooltip key={character.id}>
                  <TooltipTrigger asChild>
                    <Card 
                      className={`retro-card transition-all duration-300 hover:scale-105 ${
                        character.isUnlocked 
                          ? 'border-accent bg-accent/5' 
                          : character.canUnlock 
                            ? 'border-primary bg-primary/5 ready-unlock' 
                            : 'border-muted-foreground/20'
                      }`}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <Badge 
                            variant="outline" 
                            className={`${getTierColor(character.tier)} pixel-border`}
                          >
                            {getTierIcon(character.tier)}
                            {character.tier}
                          </Badge>
                          <div className="flex gap-1">
                            {character.equipped && (
                              <Badge variant="outline" className="bg-accent/20 text-accent border-accent">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Equipped
                              </Badge>
                            )}
                            {character.canUnlock && !character.isUnlocked && (
                              <Badge variant="outline" className="bg-primary/20 text-primary border-primary animate-pulse">
                                <Info className="w-3 h-3 mr-1" />
                                Ready!
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-3">
                        {/* Character Image with Clear Visibility */}
                        <div className="aspect-square relative bg-muted rounded-lg overflow-hidden group">
                          <div className="relative w-full h-full">
                            <img 
                              src={character.isUnlocked 
                                ? (character.image_url || character.preview_image_url || '/placeholder.svg')
                                : (character.preview_image_url || '/placeholder.svg')
                              } 
                              alt={character.name}
                              className="w-full h-full object-cover pixelated transition-all duration-300"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/placeholder.svg';
                              }}
                            />
                            
                            {/* Simple Lock Overlay for Locked Characters */}
                            {!character.isUnlocked && (
                              <div className="absolute top-2 left-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg ${
                                  character.canUnlock 
                                    ? 'bg-primary text-primary-foreground animate-pulse' 
                                    : 'bg-black/70 text-white'
                                }`}>
                                  <Lock className="w-4 h-4" />
                                </div>
                                {character.canUnlock && (
                                  <div className="absolute -bottom-8 -left-2 text-xs font-bold text-primary animate-pulse px-2 py-1 bg-primary/90 text-primary-foreground rounded whitespace-nowrap">
                                    Ready to Unlock!
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Unlocked Success Indicator */}
                            {character.isUnlocked && (
                              <div className="absolute top-2 right-2">
                                <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center shadow-lg">
                                  <CheckCircle className="w-5 h-5 text-white" />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Character Info */}
                        <div className="space-y-1">
                          <h3 className="font-bold text-sm">{character.name}</h3>
                          <p className="text-xs text-muted-foreground">{character.series}</p>
                          {character.description && (
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {character.description}
                            </p>
                          )}
                          {character.art_style && (
                            <div className="text-xs">
                              <Badge variant="secondary" className="text-xs">
                                {character.art_style}
                              </Badge>
                            </div>
                          )}
                        </div>

                        {/* Enhanced Unlock Condition */}
                        <div className={`text-xs p-2 rounded transition-all duration-300 ${
                          character.canUnlock 
                            ? 'bg-primary/10 border border-primary/20 text-primary animate-pulse' 
                            : character.isUnlocked
                              ? 'bg-accent/10 border border-accent/20 text-accent'
                              : 'bg-muted/50 text-muted-foreground'
                        }`}>
                          <div className="flex items-center gap-1">
                            {character.isUnlocked ? (
                              <CheckCircle className="w-3 h-3" />
                            ) : character.canUnlock ? (
                              <Unlock className="w-3 h-3 animate-bounce" />
                            ) : (
                              <Lock className="w-3 h-3" />
                            )}
                            <span className="font-medium">
                              {character.isUnlocked 
                                ? "Unlocked and ready!" 
                                : character.unlock_condition_description
                              }
                            </span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-2">
                          {character.isUnlocked ? (
                            <div className="space-y-2">
                              {!character.equipped && (
                                <Button 
                                  size="sm" 
                                  className="w-full"
                                  onClick={() => handleEquip(character.id)}
                                  disabled={equipingCharacter === character.id}
                                >
                                  {equipingCharacter === character.id ? (
                                    <div className="flex items-center gap-2">
                                      <div className="animate-spin rounded-full h-3 w-3 border-b border-current"></div>
                                      Equipping...
                                    </div>
                                  ) : (
                                    <>
                                      <CheckCircle className="w-3 h-3 mr-2" />
                                      Equip Character
                                    </>
                                  )}
                                </Button>
                              )}
                              <Badge variant="outline" className="w-full justify-center bg-accent/10 border-accent">
                                <Unlock className="w-3 h-3 mr-1" />
                                Unlocked
                              </Badge>
                            </div>
                          ) : character.canUnlock ? (
                            <Button 
                              size="sm" 
                              className="w-full animate-pulse"
                              onClick={() => handleUnlock(character.id)}
                              disabled={unlockingCharacter === character.id}
                            >
                              {unlockingCharacter === character.id ? (
                                <div className="flex items-center gap-2">
                                  <div className="animate-spin rounded-full h-3 w-3 border-b border-current"></div>
                                  Unlocking...
                                </div>
                              ) : (
                                <>
                                  <Unlock className="w-3 h-3 mr-2" />
                                  Unlock Now!
                                </>
                              )}
                            </Button>
                          ) : (
                            <Badge variant="outline" className="w-full justify-center opacity-50">
                              <Lock className="w-3 h-3 mr-1" />
                              Locked
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="text-center max-w-48">
                      <p className="font-bold">{character.name}</p>
                      <p className="text-xs text-muted-foreground">{character.series}</p>
                      <p className="text-xs mt-1">
                        {character.isUnlocked 
                          ? "✅ Unlocked and ready to use!" 
                          : character.canUnlock 
                            ? "🔓 Ready to unlock! Click the card!" 
                            : `🔒 ${character.unlock_condition_description}`
                        }
                      </p>
                      {character.art_style && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Art Style: {character.art_style}
                        </p>
                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </TooltipProvider>

          {filteredCharacters.length === 0 && (
            <Card className="retro-card">
              <CardContent className="text-center py-12">
                <Crown className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Characters Found</h3>
                <p className="text-muted-foreground">
                  No characters match the selected filter.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};