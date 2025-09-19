import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Plus, Target, Calendar, CheckCircle2, Circle } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Goal {
  id: string;
  title: string;
  description: string;
  targetPoints: number;
  currentPoints: number;
  deadline: string;
  priority: 'low' | 'medium' | 'high';
  status: 'active' | 'completed' | 'paused';
  createdAt: Date;
}

interface GoalsManagerProps {
  totalPoints: number;
}

export const GoalsManager = ({ totalPoints }: GoalsManagerProps) => {
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      title: 'Master React Fundamentals',
      description: 'Complete comprehensive React learning path with hooks, state management, and best practices',
      targetPoints: 100,
      currentPoints: totalPoints,
      deadline: '2025-02-28',
      priority: 'high',
      status: 'active',
      createdAt: new Date()
    },
    {
      id: '2',
      title: 'Docker Containerization',
      description: 'Learn Docker basics, compose, and deployment strategies',
      targetPoints: 75,
      currentPoints: 0,
      deadline: '2025-03-15',
      priority: 'medium',
      status: 'active',
      createdAt: new Date()
    }
  ]);

  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    targetPoints: 50,
    deadline: '',
    priority: 'medium' as Goal['priority']
  });

  const addGoal = () => {
    if (newGoal.title.trim()) {
      const goal: Goal = {
        id: crypto.randomUUID(),
        title: newGoal.title,
        description: newGoal.description,
        targetPoints: newGoal.targetPoints,
        currentPoints: 0,
        deadline: newGoal.deadline,
        priority: newGoal.priority,
        status: 'active',
        createdAt: new Date()
      };

      setGoals(prev => [...prev, goal]);
      setNewGoal({
        title: '',
        description: '',
        targetPoints: 50,
        deadline: '',
        priority: 'medium'
      });
      setShowAddGoal(false);
    }
  };

  const toggleGoalStatus = (goalId: string) => {
    setGoals(prev => prev.map(goal => 
      goal.id === goalId
        ? { ...goal, status: goal.status === 'completed' ? 'active' : 'completed' as Goal['status'] }
        : goal
    ));
  };

  const getPriorityColor = (priority: Goal['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500';
    }
  };

  const getStatusColor = (status: Goal['status']) => {
    switch (status) {
      case 'completed': return 'bg-game-exp/20 text-game-exp border-game-exp';
      case 'active': return 'bg-primary/20 text-primary border-primary';
      case 'paused': return 'bg-muted text-muted-foreground border-muted';
    }
  };

  const getDaysUntilDeadline = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const activeGoals = goals.filter(goal => goal.status === 'active');
  const completedGoals = goals.filter(goal => goal.status === 'completed');

  return (
    <Card className="retro-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            🎯 Learning Goals
          </div>
          <Dialog open={showAddGoal} onOpenChange={setShowAddGoal}>
            <DialogTrigger asChild>
              <Button size="sm" className="pixel-border">
                <Plus className="h-4 w-4 mr-1" />
                Add Goal
              </Button>
            </DialogTrigger>
            <DialogContent className="retro-card">
              <DialogHeader>
                <DialogTitle>Create New Goal</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Goal title..."
                  value={newGoal.title}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                />
                <Textarea
                  placeholder="Goal description..."
                  value={newGoal.description}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                />
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Target Points</label>
                    <Input
                      type="number"
                      min="1"
                      value={newGoal.targetPoints}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, targetPoints: Number(e.target.value) }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Deadline</label>
                    <Input
                      type="date"
                      value={newGoal.deadline}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, deadline: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Priority</label>
                  <div className="flex gap-2">
                    {(['low', 'medium', 'high'] as const).map(priority => (
                      <Button
                        key={priority}
                        variant={newGoal.priority === priority ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setNewGoal(prev => ({ ...prev, priority }))}
                        className="capitalize"
                      >
                        {priority}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={addGoal} className="flex-1">Create Goal</Button>
                  <Button variant="outline" onClick={() => setShowAddGoal(false)}>Cancel</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-1">
            <div className="text-xl font-bold text-primary">{activeGoals.length}</div>
            <div className="text-xs text-muted-foreground">Active</div>
          </div>
          <div className="space-y-1">
            <div className="text-xl font-bold text-game-exp">{completedGoals.length}</div>
            <div className="text-xs text-muted-foreground">Completed</div>
          </div>
          <div className="space-y-1">
            <div className="text-xl font-bold text-accent">
              {activeGoals.length > 0 ? Math.round((completedGoals.length / (activeGoals.length + completedGoals.length)) * 100) : 0}%
            </div>
            <div className="text-xs text-muted-foreground">Success Rate</div>
          </div>
        </div>

        {/* Active Goals */}
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {goals.map(goal => {
            const progress = Math.min((goal.currentPoints / goal.targetPoints) * 100, 100);
            const daysLeft = getDaysUntilDeadline(goal.deadline);
            
            return (
              <div
                key={goal.id}
                className={`p-3 rounded pixel-border transition-all ${
                  goal.status === 'completed' 
                    ? 'bg-game-exp/10 border-game-exp' 
                    : 'bg-muted/30 border-muted hover:border-primary'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <button
                        onClick={() => toggleGoalStatus(goal.id)}
                        className="flex-shrink-0"
                      >
                        {goal.status === 'completed' ? (
                          <CheckCircle2 className="h-5 w-5 text-game-exp" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground hover:text-primary" />
                        )}
                      </button>
                      <h4 className={`font-medium ${goal.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>
                        {goal.title}
                      </h4>
                    </div>
                    {goal.description && (
                      <p className="text-xs text-muted-foreground mb-2">{goal.description}</p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge className={getPriorityColor(goal.priority)}>
                      {goal.priority}
                    </Badge>
                    <Badge className={getStatusColor(goal.status)}>
                      {goal.status}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Progress: {goal.currentPoints}/{goal.targetPoints} points</span>
                    <span className="font-mono">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  
                  {goal.deadline && goal.status !== 'completed' && (
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {new Date(goal.deadline).toLocaleDateString()}
                      </div>
                      <span className={`font-medium ${
                        daysLeft < 0 ? 'text-red-400' :
                        daysLeft < 7 ? 'text-yellow-400' : 'text-green-400'
                      }`}>
                        {daysLeft < 0 ? `${Math.abs(daysLeft)} days overdue` :
                         daysLeft === 0 ? 'Due today!' :
                         `${daysLeft} days left`}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {goals.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Target className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No goals set yet. Create your first learning goal!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};