import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RewardBox } from "@/types/productivity";
import { 
  Gift, 
  Sparkles, 
  Star, 
  Crown, 
  Gem, 
  Coins,
  Package,
  Lock,
  Zap
} from "lucide-react";

interface RewardSystemProps {
  rewardBoxes: RewardBox[];
  userCoins: number;
  onOpenBox: (boxId: string) => void;
  onPurchaseBox: (type: string) => void;
}

export const RewardSystem = ({ 
  rewardBoxes, 
  userCoins, 
  onOpenBox, 
  onPurchaseBox 
}: RewardSystemProps) => {
  const [openingBox, setOpeningBox] = useState<string | null>(null);

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'common': return <Star className="w-4 h-4" />;
      case 'rare': return <Sparkles className="w-4 h-4" />;
      case 'epic': return <Crown className="w-4 h-4" />;
      case 'legendary': return <Gem className="w-4 h-4" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  const getRarityGradient = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-gray-400 to-gray-600';
      case 'rare': return 'from-blue-400 to-blue-600';
      case 'epic': return 'from-purple-400 to-purple-600';
      case 'legendary': return 'from-yellow-400 to-yellow-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getBoxPrice = (type: string) => {
    switch (type) {
      case 'common': return 50;
      case 'rare': return 150;
      case 'epic': return 400;
      case 'legendary': return 1000;
      default: return 50;
    }
  };

  const unclaimedBoxes = rewardBoxes.filter(box => !box.isOpened);
  const claimedBoxes = rewardBoxes.filter(box => box.isOpened);

  const handleOpenBox = async (boxId: string) => {
    setOpeningBox(boxId);
    // Simulate opening animation
    setTimeout(() => {
      onOpenBox(boxId);
      setOpeningBox(null);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* User Coins */}
      <Card className="retro-card bg-gradient-to-r from-gaming-primary/10 to-gaming-accent/10">
        <CardContent className="flex items-center justify-center py-6">
          <div className="flex items-center gap-2 text-2xl font-bold">
            <Coins className="w-8 h-8 text-gaming-primary" />
            <span className="text-gaming-text">{userCoins.toLocaleString()}</span>
            <span className="text-lg text-muted-foreground">coins</span>
          </div>
        </CardContent>
      </Card>

      {/* Unclaimed Rewards */}
      {unclaimedBoxes.length > 0 && (
        <Card className="retro-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-gaming-accent" />
              Reward Boxes ({unclaimedBoxes.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {unclaimedBoxes.map((box) => (
                <div 
                  key={box.id} 
                  className={`relative aspect-square rounded-lg border-2 overflow-hidden transition-all duration-300 hover:scale-105 cursor-pointer bg-gradient-to-br ${getRarityGradient(box.rarity)}`}
                  onClick={() => handleOpenBox(box.id)}
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                    {openingBox === box.id ? (
                      <div className="animate-spin">
                        <Sparkles className="w-12 h-12" />
                      </div>
                    ) : (
                      <>
                        <Package className="w-16 h-16 mb-2" />
                        <div className="text-center">
                          <div className="font-bold capitalize">{box.rarity}</div>
                          <div className="text-sm opacity-80">{box.type} Box</div>
                        </div>
                      </>
                    )}
                  </div>
                  
                  <div className="absolute top-2 right-2">
                    {getRarityIcon(box.rarity)}
                  </div>

                  <div className="absolute bottom-2 left-2 right-2">
                    <Button 
                      size="sm" 
                      className="w-full text-xs"
                      disabled={openingBox === box.id}
                    >
                      {openingBox === box.id ? 'Opening...' : 'Open Box'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Shop */}
      <Card className="retro-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-gaming-primary" />
            Reward Shop
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {['common', 'rare', 'epic', 'legendary'].map((rarity) => {
              const price = getBoxPrice(rarity);
              const canAfford = userCoins >= price;
              
              return (
                <div 
                  key={rarity}
                  className={`relative aspect-square rounded-lg border-2 overflow-hidden transition-all duration-300 hover:scale-105 ${
                    canAfford ? `bg-gradient-to-br ${getRarityGradient(rarity)} cursor-pointer` : 'bg-muted border-muted-foreground/20'
                  }`}
                >
                  <div className={`absolute inset-0 flex flex-col items-center justify-center ${canAfford ? 'text-white' : 'text-muted-foreground'}`}>
                    {canAfford ? (
                      <Package className="w-12 h-12 mb-2" />
                    ) : (
                      <Lock className="w-12 h-12 mb-2" />
                    )}
                    <div className="text-center">
                      <div className="font-bold capitalize">{rarity}</div>
                      <div className="text-sm opacity-80">Box</div>
                    </div>
                  </div>
                  
                  <div className="absolute top-2 right-2">
                    {getRarityIcon(rarity)}
                  </div>

                  <div className="absolute bottom-2 left-2 right-2">
                    <Button 
                      size="sm" 
                      className="w-full text-xs"
                      disabled={!canAfford}
                      onClick={() => canAfford && onPurchaseBox(rarity)}
                    >
                      <Coins className="w-3 h-3 mr-1" />
                      {price}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-6 p-4 bg-secondary/30 rounded-lg">
            <h4 className="font-semibold mb-2">Box Contents:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <div>
                <span className="font-semibold">Common:</span> Characters, 10-50 coins
              </div>
              <div>
                <span className="font-semibold">Rare:</span> Rare characters, 50-100 coins
              </div>
              <div>
                <span className="font-semibold">Epic:</span> Epic characters, cosmetics
              </div>
              <div>
                <span className="font-semibold">Legendary:</span> Legendary characters, titles
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recently Opened */}
      {claimedBoxes.length > 0 && (
        <Card className="retro-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-gaming-accent" />
              Recently Opened
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {claimedBoxes
                .sort((a, b) => new Date(b.earnedAt).getTime() - new Date(a.earnedAt).getTime())
                .slice(0, 5)
                .map((box) => (
                <div key={box.id} className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getRarityGradient(box.rarity)} flex items-center justify-center`}>
                    {getRarityIcon(box.rarity)}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold capitalize">{box.rarity} Box</div>
                    <div className="text-sm text-muted-foreground">
                      Opened {box.earnedAt.toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    {box.contents.map((item, index) => (
                      <Badge key={index} variant="outline" className="text-xs ml-1">
                        {typeof item.value === 'number' ? `${item.value} coins` : item.value}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};