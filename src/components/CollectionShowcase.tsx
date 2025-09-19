import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CollectibleCharacter } from "@/types/productivity";
import { Sparkles, Star, Crown, Gem, Lock } from "lucide-react";

interface CollectionShowcaseProps {
  characters: CollectibleCharacter[];
  totalCharacters: number;
}

export const CollectionShowcase = ({ characters, totalCharacters }: CollectionShowcaseProps) => {
  const [selectedRarity, setSelectedRarity] = useState<string>("all");
  
  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'common': return <Star className="w-3 h-3" />;
      case 'rare': return <Sparkles className="w-3 h-3" />;
      case 'epic': return <Crown className="w-3 h-3" />;
      case 'legendary': return <Gem className="w-3 h-3" />;
      default: return <Star className="w-3 h-3" />;
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-500';
      case 'rare': return 'bg-blue-500';
      case 'epic': return 'bg-purple-500';
      case 'legendary': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredCharacters = selectedRarity === "all" 
    ? characters 
    : characters.filter(char => char.rarity === selectedRarity);

  const unlockedCount = characters.filter(char => char.isUnlocked).length;
  const completionPercentage = (unlockedCount / totalCharacters) * 100;

  return (
    <Card className="retro-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-gaming-accent" />
            Character Collection
          </CardTitle>
          <Badge variant="outline" className="pixel-border">
            {unlockedCount}/{totalCharacters} ({completionPercentage.toFixed(0)}%)
          </Badge>
        </div>
        
        {/* Rarity Filters */}
        <div className="flex gap-2 flex-wrap">
          <Button 
            size="sm" 
            variant={selectedRarity === "all" ? "default" : "outline"}
            onClick={() => setSelectedRarity("all")}
            className="text-xs"
          >
            All
          </Button>
          {['common', 'rare', 'epic', 'legendary'].map(rarity => (
            <Button 
              key={rarity}
              size="sm" 
              variant={selectedRarity === rarity ? "default" : "outline"}
              onClick={() => setSelectedRarity(rarity)}
              className="text-xs capitalize"
            >
              {getRarityIcon(rarity)}
              <span className="ml-1">{rarity}</span>
            </Button>
          ))}
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredCharacters.map((character) => (
            <div 
              key={character.id} 
              className={`relative aspect-square rounded-lg border-2 overflow-hidden transition-all duration-300 hover:scale-105 ${
                character.isUnlocked 
                  ? `${getRarityColor(character.rarity)} border-current` 
                  : 'bg-muted border-muted-foreground/20'
              }`}
            >
              {character.isUnlocked ? (
                <>
                  <img 
                    src={character.imageUrl} 
                    alt={character.name}
                    className="w-full h-full object-cover pixelated"
                  />
                  <div className="absolute top-1 right-1">
                    {getRarityIcon(character.rarity)}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-white text-xs p-1 text-center">
                    {character.name}
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                  <Lock className="w-6 h-6 mb-1" />
                  <span className="text-xs text-center">Locked</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredCharacters.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No characters found for this rarity.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};