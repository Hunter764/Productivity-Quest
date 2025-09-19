import { Technology, Task } from "@/types/productivity";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Plus, CheckCircle, Circle } from "lucide-react";
import { useState } from "react";
import { GameCharacter } from "./GameCharacter";

interface TechnologyCardProps {
  technology: Technology;
  onAddTask: (title: string, description?: string, points?: number) => void;
  onCompleteTask: (taskId: string) => void;
}

export const TechnologyCard = ({ technology, onAddTask, onCompleteTask }: TechnologyCardProps) => {
  const [showAddTask, setShowAddTask] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskPoints, setTaskPoints] = useState(1);

  const completedTasks = technology.tasks.filter(task => task.completed).length;
  const totalTasks = technology.tasks.length;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  
  const experienceToNextLevel = ((technology.level) * 10) - technology.experience;

  const handleAddTask = () => {
    if (taskTitle.trim()) {
      onAddTask(taskTitle, taskDescription, taskPoints);
      setTaskTitle("");
      setTaskDescription("");
      setTaskPoints(1);
      setShowAddTask(false);
    }
  };

  return (
    <Card className="retro-card animate-slide-in">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{technology.icon}</span>
            <div>
              <div className="font-bold text-lg">{technology.name}</div>
              <div className="text-xs text-muted-foreground">
                {experienceToNextLevel} XP to Level {technology.level + 1}
              </div>
            </div>
          </div>
          <GameCharacter 
            level={technology.level} 
            experience={technology.experience}
            isActive={completedTasks > 0}
          />
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span className="font-mono">{completedTasks}/{totalTasks}</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{Math.round(progressPercentage)}% Complete</span>
            <span className="exp-badge">{technology.totalPoints} PTS</span>
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {technology.tasks.map((task) => (
            <div
              key={task.id}
              className={`flex items-center gap-3 p-2 rounded pixel-border transition-all ${
                task.completed 
                  ? 'bg-game-exp/20 border-game-exp' 
                  : 'bg-muted/50 border-muted hover:border-primary'
              }`}
            >
              <button
                onClick={() => !task.completed && onCompleteTask(task.id)}
                className="flex-shrink-0"
                disabled={task.completed}
              >
                {task.completed ? (
                  <CheckCircle className="h-5 w-5 text-game-exp" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground hover:text-primary" />
                )}
              </button>
              <div className="flex-1 min-w-0">
                <div className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                  {task.title}
                </div>
                {task.description && (
                  <div className="text-xs text-muted-foreground">{task.description}</div>
                )}
              </div>
              <div className="text-xs font-mono text-game-gold">
                +{task.points}
              </div>
            </div>
          ))}
        </div>

        {/* Add Task Form */}
        {showAddTask ? (
          <div className="space-y-3 p-3 bg-muted/30 rounded pixel-border">
            <input
              type="text"
              placeholder="Task title..."
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
              autoFocus
            />
            <input
              type="text"
              placeholder="Description (optional)..."
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="flex items-center gap-2">
              <label className="text-sm">Points:</label>
              <input
                type="number"
                min="1"
                max="10"
                value={taskPoints}
                onChange={(e) => setTaskPoints(Number(e.target.value))}
                className="w-16 px-2 py-1 bg-background border border-border rounded text-sm text-center focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleAddTask} className="flex-1">
                Add Task
              </Button>
              <Button size="sm" variant="outline" onClick={() => setShowAddTask(false)}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAddTask(true)}
            className="w-full pixel-border"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        )}
      </CardContent>
    </Card>
  );
};