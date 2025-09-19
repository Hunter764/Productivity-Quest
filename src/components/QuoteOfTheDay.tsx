import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useProductivityData } from "@/hooks/useProductivityData";
import { Quote, Heart, Share2, Bookmark, Sparkles } from "lucide-react";

interface DailyQuote {
  text: string;
  author: string;
  category: string;
  id: string;
}

const QUOTES_STORAGE_KEY = "daily_quotes_data";
const QUOTE_INTERACTION_XP = 10;

const inspirationalQuotes: DailyQuote[] = [
  {
    id: "1",
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    category: "motivation"
  },
  {
    id: "2", 
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
    category: "perseverance"
  },
  {
    id: "3",
    text: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt",
    category: "dreams"
  },
  {
    id: "4",
    text: "It is during our darkest moments that we must focus to see the light.",
    author: "Aristotle",
    category: "resilience"
  },
  {
    id: "5",
    text: "Innovation distinguishes between a leader and a follower.",
    author: "Steve Jobs",
    category: "innovation"
  },
  {
    id: "6",
    text: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney",
    category: "action"
  },
  {
    id: "7",
    text: "Life is what happens to you while you're busy making other plans.",
    author: "John Lennon",
    category: "life"
  },
  {
    id: "8",
    text: "The best time to plant a tree was 20 years ago. The second best time is now.",
    author: "Chinese Proverb",
    category: "timing"
  },
  {
    id: "9",
    text: "Your limitation—it's only your imagination.",
    author: "Unknown",
    category: "mindset"
  },
  {
    id: "10",
    text: "Push yourself, because no one else is going to do it for you.",
    author: "Unknown",
    category: "self-motivation"
  }
];

export const QuoteOfTheDay = () => {
  const [showModal, setShowModal] = useState(false);
  const [currentQuote, setCurrentQuote] = useState<DailyQuote | null>(null);
  const [favoriteQuotes, setFavoriteQuotes] = useState<string[]>([]);
  const [hasSeenToday, setHasSeenToday] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  
  const { toast } = useToast();
  const { addTask } = useProductivityData();

  // Load saved data on component mount
  useEffect(() => {
    const saved = localStorage.getItem(QUOTES_STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      setFavoriteQuotes(data.favoriteQuotes || []);
      
      const today = new Date().toDateString();
      if (data.lastSeen === today) {
        setHasSeenToday(true);
        setCurrentQuote(data.todayQuote);
      }
    }
  }, []);

  // Generate or show daily quote
  useEffect(() => {
    if (!hasSeenToday) {
      const today = new Date().toDateString();
      const quoteIndex = new Date().getDate() % inspirationalQuotes.length;
      const todayQuote = inspirationalQuotes[quoteIndex];
      
      setCurrentQuote(todayQuote);
      setShowModal(true);
      
      // Save that we've seen today's quote
      const saved = localStorage.getItem(QUOTES_STORAGE_KEY);
      const data = saved ? JSON.parse(saved) : {};
      data.lastSeen = today;
      data.todayQuote = todayQuote;
      localStorage.setItem(QUOTES_STORAGE_KEY, JSON.stringify(data));
      
      setHasSeenToday(true);
    }
  }, [hasSeenToday]);

  const handleQuoteInteraction = (action: string) => {
    if (!currentQuote) return;
    
    const xpGained = QUOTE_INTERACTION_XP;
    setXpEarned(prev => prev + xpGained);
    
    // Add to productivity system
    addTask(
      "inspiration-daily", 
      `Daily Inspiration: ${action}`, 
      `Engaged with quote by ${currentQuote.author}`, 
      xpGained
    );
    
    toast({
      title: "Inspiration Boost! ✨",
      description: `Earned ${xpGained} XP for staying motivated!`,
    });
  };

  const handleFavoriteQuote = () => {
    if (!currentQuote) return;
    
    const newFavorites = favoriteQuotes.includes(currentQuote.id)
      ? favoriteQuotes.filter(id => id !== currentQuote.id)
      : [...favoriteQuotes, currentQuote.id];
    
    setFavoriteQuotes(newFavorites);
    
    // Save to localStorage
    const saved = localStorage.getItem(QUOTES_STORAGE_KEY);
    const data = saved ? JSON.parse(saved) : {};
    data.favoriteQuotes = newFavorites;
    localStorage.setItem(QUOTES_STORAGE_KEY, JSON.stringify(data));
    
    handleQuoteInteraction(favoriteQuotes.includes(currentQuote.id) ? "unfavorited" : "favorited");
  };

  const handleShareQuote = () => {
    if (!currentQuote) return;
    
    if (navigator.share) {
      navigator.share({
        title: 'Daily Inspiration',
        text: `"${currentQuote.text}" - ${currentQuote.author}`,
      });
    } else {
      navigator.clipboard.writeText(`"${currentQuote.text}" - ${currentQuote.author}`);
      toast({
        title: "Copied to clipboard!",
        description: "Quote copied and ready to share",
      });
    }
    
    handleQuoteInteraction("shared");
  };

  if (!currentQuote) return null;

  return (
    <>
      {/* Quote Modal - Shows on first daily visit */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-gaming-accent" />
              Daily Inspiration
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="text-center space-y-3">
              <Quote className="h-12 w-12 text-gaming-primary mx-auto opacity-60" />
              <blockquote className="text-lg font-medium italic">
                "{currentQuote.text}"
              </blockquote>
              <p className="text-muted-foreground">
                — {currentQuote.author}
              </p>
              <Badge variant="secondary" className="capitalize">
                {currentQuote.category}
              </Badge>
            </div>
            
            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleFavoriteQuote}
                className="flex items-center gap-1"
              >
                <Heart className={`h-4 w-4 ${favoriteQuotes.includes(currentQuote.id) ? 'fill-current text-red-500' : ''}`} />
                {favoriteQuotes.includes(currentQuote.id) ? 'Favorited' : 'Favorite'}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleShareQuote}
                className="flex items-center gap-1"
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
            
            <Button 
              onClick={() => setShowModal(false)}
              className="w-full"
            >
              Start Your Day! 🚀
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Quote Widget - Always accessible */}
      <Card className="retro-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-gaming-accent" />
            Today's Inspiration
            {xpEarned > 0 && (
              <Badge variant="default" className="ml-auto animate-pulse">
                +{xpEarned} XP
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <blockquote className="text-sm italic border-l-2 border-gaming-primary pl-3">
            "{currentQuote.text}"
          </blockquote>
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              — {currentQuote.author}
            </p>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleFavoriteQuote}
                className="h-8 w-8 p-0"
              >
                <Heart className={`h-3 w-3 ${favoriteQuotes.includes(currentQuote.id) ? 'fill-current text-red-500' : ''}`} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShareQuote}
                className="h-8 w-8 p-0"
              >
                <Share2 className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowModal(true)}
                className="h-8 w-8 p-0"
              >
                <Quote className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};