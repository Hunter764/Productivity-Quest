import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

interface AddTechnologyModalProps {
  onAddTechnology: (name: string, color: string, icon: string) => void;
}

const techOptions = [
  { name: "React", icon: "⚛️", color: "#61dafb" },
  { name: "JavaScript", icon: "🟨", color: "#f7df1e" },
  { name: "TypeScript", icon: "🔷", color: "#3178c6" },
  { name: "Python", icon: "🐍", color: "#3776ab" },
  { name: "Node.js", icon: "🟢", color: "#339933" },
  { name: "Docker", icon: "🐳", color: "#2496ed" },
  { name: "AWS", icon: "☁️", color: "#ff9900" },
  { name: "MongoDB", icon: "🍃", color: "#47a248" },
  { name: "PostgreSQL", icon: "🐘", color: "#336791" },
  { name: "GraphQL", icon: "🚀", color: "#e10098" },
  { name: "Vue.js", icon: "💚", color: "#4fc08d" },
  { name: "Angular", icon: "🅰️", color: "#dd0031" },
  { name: "Rust", icon: "🦀", color: "#000000" },
  { name: "Go", icon: "🐹", color: "#00add8" },
  { name: "Swift", icon: "🦉", color: "#fa7343" },
  { name: "Kotlin", icon: "🎯", color: "#7f52ff" },
  { name: "Java", icon: "☕", color: "#ed8b00" },
  { name: "C++", icon: "⚡", color: "#00599c" },
  { name: "Machine Learning", icon: "🤖", color: "#ff6f00" },
  { name: "Design", icon: "🎨", color: "#ff4081" }
];

export const AddTechnologyModal = ({ onAddTechnology }: AddTechnologyModalProps) => {
  const [open, setOpen] = useState(false);
  const [customMode, setCustomMode] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customIcon, setCustomIcon] = useState("");

  const handleAddTech = (name: string, icon: string, color: string) => {
    onAddTechnology(name, color, icon);
    setOpen(false);
    setCustomMode(false);
    setCustomName("");
    setCustomIcon("");
  };

  const handleCustomAdd = () => {
    if (customName.trim() && customIcon.trim()) {
      handleAddTech(customName, customIcon, "#3b82f6");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="pixel-border glow-effect">
          <Plus className="h-4 w-4 mr-2" />
          Add Technology
        </Button>
      </DialogTrigger>
      <DialogContent className="retro-card max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            🎯 Add New Technology
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {!customMode ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {techOptions.map((tech) => (
                  <button
                    key={tech.name}
                    onClick={() => handleAddTech(tech.name, tech.icon, tech.color)}
                    className="flex flex-col items-center gap-2 p-3 rounded pixel-border bg-card hover:bg-muted transition-all hover:scale-105 hover:glow-effect"
                    style={{ borderColor: tech.color }}
                  >
                    <span className="text-2xl">{tech.icon}</span>
                    <span className="text-xs font-medium text-center">{tech.name}</span>
                  </button>
                ))}
              </div>
              
              <div className="flex justify-center">
                <Button 
                  variant="outline" 
                  onClick={() => setCustomMode(true)}
                  className="pixel-border"
                >
                  Create Custom Technology
                </Button>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tech-name">Technology Name</Label>
                <Input
                  id="tech-name"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g., Redis, Kubernetes, etc."
                  className="pixel-border"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tech-icon">Icon (Emoji)</Label>
                <Input
                  id="tech-icon"
                  value={customIcon}
                  onChange={(e) => setCustomIcon(e.target.value)}
                  placeholder="e.g., 🔥, 💎, 🚀, etc."
                  className="pixel-border"
                  maxLength={2}
                />
              </div>
              
              {customName && customIcon && (
                <div className="p-3 bg-muted rounded pixel-border text-center">
                  <div className="text-2xl mb-1">{customIcon}</div>
                  <div className="text-sm font-medium">{customName}</div>
                </div>
              )}
              
              <div className="flex gap-2">
                <Button 
                  onClick={handleCustomAdd}
                  disabled={!customName.trim() || !customIcon.trim()}
                  className="flex-1"
                >
                  Add Technology
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setCustomMode(false)}
                  className="pixel-border"
                >
                  Back
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};