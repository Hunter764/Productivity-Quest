import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ProgressEntry, Technology } from '@/types/productivity';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface ProgressChartProps {
  progressHistory: ProgressEntry[];
  technologies: Technology[];
}

export const ProgressChart = ({ progressHistory, technologies }: ProgressChartProps) => {
  const [viewMode, setViewMode] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [selectedTechs, setSelectedTechs] = useState<string[]>(
    technologies.map(tech => tech.id)
  );

  // Group progress data by date and technology
  const processChartData = () => {
    const dataMap = new Map();
    
    // Get last 30 days
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 29);
    
    // Initialize all dates with 0 values
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      const dayData: any = { date: dateStr, formattedDate: d.toLocaleDateString() };
      
      technologies.forEach(tech => {
        if (selectedTechs.includes(tech.id)) {
          dayData[tech.name] = 0;
        }
      });
      
      dataMap.set(dateStr, dayData);
    }
    
    // Fill in actual progress data
    progressHistory.forEach(entry => {
      if (dataMap.has(entry.date)) {
        const tech = technologies.find(t => t.id === entry.technologyId);
        if (tech && selectedTechs.includes(tech.id)) {
          const dayData = dataMap.get(entry.date);
          dayData[tech.name] = (dayData[tech.name] || 0) + entry.points;
        }
      }
    });
    
    // Convert to cumulative data
    const sortedData = Array.from(dataMap.values()).sort((a, b) => a.date.localeCompare(b.date));
    let cumulativeData: any = {};
    
    return sortedData.map(dayData => {
      const result = { ...dayData };
      technologies.forEach(tech => {
        if (selectedTechs.includes(tech.id)) {
          cumulativeData[tech.name] = (cumulativeData[tech.name] || 0) + (dayData[tech.name] || 0);
          result[tech.name] = cumulativeData[tech.name];
        }
      });
      return result;
    });
  };

  const chartData = processChartData();
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  const toggleTechnology = (techId: string) => {
    setSelectedTechs(prev => 
      prev.includes(techId) 
        ? prev.filter(id => id !== techId)
        : [...prev, techId]
    );
  };

  return (
    <Card className="retro-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>📈 Progress Analytics</span>
          <div className="flex gap-2">
            {['daily', 'weekly', 'monthly'].map((mode) => (
              <Button
                key={mode}
                variant={viewMode === mode ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode(mode as any)}
                className="pixel-border text-xs"
              >
                {mode}
              </Button>
            ))}
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Technology Toggles */}
        <div className="flex flex-wrap gap-2">
          {technologies.map((tech, index) => (
            <button
              key={tech.id}
              onClick={() => toggleTechnology(tech.id)}
              className={`stat-badge transition-all ${
                selectedTechs.includes(tech.id)
                  ? 'opacity-100'
                  : 'opacity-50'
              }`}
              style={{
                backgroundColor: selectedTechs.includes(tech.id) ? colors[index % colors.length] : undefined,
                color: selectedTechs.includes(tech.id) ? 'white' : undefined
              }}
            >
              <span className="mr-1">{tech.icon}</span>
              {tech.name}
            </button>
          ))}
        </div>

        {/* Chart */}
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="formattedDate" 
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '2px solid hsl(var(--primary))',
                  borderRadius: '0.25rem',
                  fontSize: '12px'
                }}
              />
              <Legend />
              {technologies.map((tech, index) => 
                selectedTechs.includes(tech.id) && (
                  <Line
                    key={tech.id}
                    type="monotone"
                    dataKey={tech.name}
                    stroke={colors[index % colors.length]}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                )
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-1">
            <div className="text-2xl font-bold text-primary">
              {technologies.reduce((sum, tech) => sum + tech.totalPoints, 0)}
            </div>
            <div className="text-xs text-muted-foreground">Total Points</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-accent">
              {technologies.length}
            </div>
            <div className="text-xs text-muted-foreground">Technologies</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-game-gold">
              {Math.round(technologies.reduce((sum, tech) => sum + tech.level, 0) / technologies.length) || 0}
            </div>
            <div className="text-xs text-muted-foreground">Avg Level</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};