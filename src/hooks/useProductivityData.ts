import { useState, useEffect } from "react";
import { MonthlyGoal, Technology, Task, DashboardStats, ProgressEntry } from "@/types/productivity";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const STORAGE_KEY = "productivity_dashboard";

export const useProductivityData = () => {
  const { user } = useAuth();
  const [monthlyGoals, setMonthlyGoals] = useState<MonthlyGoal[]>([]);
  const [currentGoal, setCurrentGoal] = useState<MonthlyGoal | null>(null);
  const [progressHistory, setProgressHistory] = useState<ProgressEntry[]>([]);

  // Load data from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      setMonthlyGoals(data.monthlyGoals || []);
      setProgressHistory(data.progressHistory || []);
    }
    
    // Initialize current month goal if doesn't exist
    const now = new Date();
    const currentMonth = now.toLocaleString('default', { month: 'long' });
    const currentYear = now.getFullYear();
    
    const existing = (JSON.parse(stored || "{}").monthlyGoals || [])
      .find((goal: MonthlyGoal) => goal.month === currentMonth && goal.year === currentYear);
    
    if (!existing) {
      const newGoal = createNewMonthlyGoal(currentMonth, currentYear);
      setCurrentGoal(newGoal);
    } else {
      setCurrentGoal(existing);
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    const data = {
      monthlyGoals,
      progressHistory
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [monthlyGoals, progressHistory]);

  const createNewMonthlyGoal = (month: string, year: number): MonthlyGoal => {
    return {
      id: `${month}-${year}`,
      month,
      year,
      technologies: [],
      totalPoints: 0,
      completionPercentage: 0,
      createdAt: new Date()
    };
  };

  const addTechnology = (name: string, color: string, icon: string) => {
    if (!currentGoal) return;

    const newTech: Technology = {
      id: crypto.randomUUID(),
      name,
      color,
      icon,
      tasks: [],
      totalPoints: 0,
      level: 1,
      experience: 0
    };

    const updatedGoal = {
      ...currentGoal,
      technologies: [...currentGoal.technologies, newTech]
    };

    setCurrentGoal(updatedGoal);
    updateMonthlyGoals(updatedGoal);
  };

  const addTask = (technologyId: string, title: string, description?: string, points: number = 1) => {
    if (!currentGoal) return;

    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      description,
      completed: false,
      createdAt: new Date(),
      points
    };

    const updatedTechnologies = currentGoal.technologies.map(tech => 
      tech.id === technologyId 
        ? { ...tech, tasks: [...tech.tasks, newTask] }
        : tech
    );

    const updatedGoal = {
      ...currentGoal,
      technologies: updatedTechnologies
    };

    setCurrentGoal(updatedGoal);
    updateMonthlyGoals(updatedGoal);
  };

  const completeTask = (technologyId: string, taskId: string) => {
    if (!currentGoal) return;

    const updatedTechnologies = currentGoal.technologies.map(tech => {
      if (tech.id === technologyId) {
        const updatedTasks = tech.tasks.map(task => 
          task.id === taskId 
            ? { ...task, completed: true, completedAt: new Date() }
            : task
        );
        
        const completedTask = tech.tasks.find(task => task.id === taskId);
        if (completedTask && !completedTask.completed) {
          const newExperience = tech.experience + completedTask.points;
          const newLevel = Math.floor(newExperience / 10) + 1;
          const newTotalPoints = tech.totalPoints + completedTask.points;

          // Add progress entry
          const today = new Date().toISOString().split('T')[0];
          const newProgressEntry: ProgressEntry = {
            date: today,
            technologyId,
            points: completedTask.points,
            cumulativePoints: newTotalPoints
          };
          
          setProgressHistory(prev => [...prev, newProgressEntry]);

          return {
            ...tech,
            tasks: updatedTasks,
            totalPoints: newTotalPoints,
            level: newLevel,
            experience: newExperience
          };
        }
        
        return { ...tech, tasks: updatedTasks };
      }
      return tech;
    });

    const totalPoints = updatedTechnologies.reduce((sum, tech) => sum + tech.totalPoints, 0);
    const updatedGoal = {
      ...currentGoal,
      technologies: updatedTechnologies,
      totalPoints
    };

    setCurrentGoal(updatedGoal);
    updateMonthlyGoals(updatedGoal);
    
    // Sync to Supabase profile
    const allTasksCompleted = updatedTechnologies.reduce(
      (sum, tech) => sum + tech.tasks.filter(task => task.completed).length, 0
    );
    syncXPToProfile(totalPoints, allTasksCompleted);
  };

  const updateMonthlyGoals = (updatedGoal: MonthlyGoal) => {
    setMonthlyGoals(prev => {
      const index = prev.findIndex(goal => goal.id === updatedGoal.id);
      if (index >= 0) {
        const updated = [...prev];
        updated[index] = updatedGoal;
        return updated;
      }
      return [...prev, updatedGoal];
    });
  };

  // Sync XP to Supabase profile
  const syncXPToProfile = async (totalXP: number, tasksCompleted: number) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          total_xp: totalXP,
          level: Math.floor(totalXP / 50) + 1 
        })
        .eq('user_id', user.id);
      
      if (error) {
        console.error('Error syncing XP to profile:', error);
      }
    } catch (error) {
      console.error('Error syncing XP:', error);
    }
  };

  const getDashboardStats = (): DashboardStats => {
    if (!currentGoal) {
      return {
        totalPoints: 0,
        technologiesCovered: 0,
        completionPercentage: 0,
        currentStreak: 0,
        longestStreak: 0,
        tasksCompleted: 0,
        averageLevel: 0
      };
    }

    const tasksCompleted = currentGoal.technologies.reduce(
      (sum, tech) => sum + tech.tasks.filter(task => task.completed).length, 0
    );
    
    const totalTasks = currentGoal.technologies.reduce(
      (sum, tech) => sum + tech.tasks.length, 0
    );

    const averageLevel = currentGoal.technologies.length > 0
      ? currentGoal.technologies.reduce((sum, tech) => sum + tech.level, 0) / currentGoal.technologies.length
      : 0;

    return {
      totalPoints: currentGoal.totalPoints,
      technologiesCovered: currentGoal.technologies.length,
      completionPercentage: totalTasks > 0 ? (tasksCompleted / totalTasks) * 100 : 0,
      currentStreak: 0, // TODO: Calculate streak
      longestStreak: 0, // TODO: Calculate streak
      tasksCompleted,
      averageLevel
    };
  };

  return {
    monthlyGoals,
    currentGoal,
    progressHistory,
    addTechnology,
    addTask,
    completeTask,
    getDashboardStats
  };
};