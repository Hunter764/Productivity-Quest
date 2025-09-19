import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Technology } from "@/types/productivity";
import { Play, Pause, Square, Clock, BarChart3 } from "lucide-react";
import { useState, useEffect } from "react";

interface TimeSession {
  id: string;
  technologyId: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // in seconds
  description: string;
}

interface TimeTrackerProps {
  technologies: Technology[];
  onTimeLogged: (technologyId: string, seconds: number, description: string) => void;
}

export const TimeTracker = ({ technologies, onTimeLogged }: TimeTrackerProps) => {
  const [activeSession, setActiveSession] = useState<TimeSession | null>(null);
  const [sessions, setSessions] = useState<TimeSession[]>([]);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [description, setDescription] = useState("");

  // Update elapsed time every second when session is active
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (activeSession) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - activeSession.startTime.getTime()) / 1000));
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeSession]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = (technologyId: string) => {
    if (activeSession) {
      stopTimer(); // Stop any existing session
    }

    const newSession: TimeSession = {
      id: crypto.randomUUID(),
      technologyId,
      startTime: new Date(),
      duration: 0,
      description: description || `Learning session`
    };

    setActiveSession(newSession);
    setElapsedTime(0);
  };

  const pauseTimer = () => {
    if (activeSession) {
      const duration = Math.floor((Date.now() - activeSession.startTime.getTime()) / 1000);
      setActiveSession(null);
      
      // Save as a paused session that can be resumed
      setSessions(prev => [...prev, {
        ...activeSession,
        endTime: new Date(),
        duration
      }]);
    }
  };

  const stopTimer = () => {
    if (activeSession) {
      const duration = Math.floor((Date.now() - activeSession.startTime.getTime()) / 1000);
      const finalSession = {
        ...activeSession,
        endTime: new Date(),
        duration
      };

      setSessions(prev => [...prev, finalSession]);
      onTimeLogged(activeSession.technologyId, duration, activeSession.description);
      
      setActiveSession(null);
      setElapsedTime(0);
      setDescription("");
    }
  };

  const getTodaySessions = () => {
    const today = new Date().toDateString();
    return sessions.filter(session => 
      session.endTime && session.endTime.toDateString() === today
    );
  };

  const getTodayTotalTime = () => {
    return getTodaySessions().reduce((total, session) => total + session.duration, 0);
  };

  const getSessionsByTechnology = () => {
    const techSessions: Record<string, number> = {};
    getTodaySessions().forEach(session => {
      techSessions[session.technologyId] = (techSessions[session.technologyId] || 0) + session.duration;
    });
    return techSessions;
  };

  const todayTotalTime = getTodayTotalTime();
  const sessionsByTech = getSessionsByTechnology();

  return (
    <Card className="retro-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          ⏱️ Time Tracker
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Active Timer Display */}
        <div className="text-center p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded pixel-border">
          <div className="text-3xl font-mono font-bold text-primary mb-2">
            {formatTime(elapsedTime)}
          </div>
          {activeSession && (
            <div className="text-sm text-muted-foreground mb-3">
              Learning: {technologies.find(t => t.id === activeSession.technologyId)?.name}
            </div>
          )}
          
          <div className="flex justify-center gap-2">
            {!activeSession ? (
              <div className="text-xs text-muted-foreground">Select a technology to start timing</div>
            ) : (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={pauseTimer}
                  className="pixel-border"
                >
                  <Pause className="h-4 w-4 mr-1" />
                  Pause
                </Button>
                <Button
                  size="sm"
                  onClick={stopTimer}
                  className="pixel-border bg-game-fire/20 hover:bg-game-fire/30"
                >
                  <Square className="h-4 w-4 mr-1" />
                  Stop
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Session Description Input */}
        {!activeSession && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Session Description</label>
            <input
              type="text"
              placeholder="What are you working on?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        )}

        {/* Technology Buttons */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Start Timer For:</h4>
          <div className="grid grid-cols-2 gap-2">
            {technologies.map(tech => (
              <Button
                key={tech.id}
                variant="outline"
                size="sm"
                onClick={() => startTimer(tech.id)}
                disabled={!!activeSession}
                className="pixel-border justify-start"
              >
                <Play className="h-3 w-3 mr-2" />
                <span className="mr-1">{tech.icon}</span>
                {tech.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Today's Stats */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <h4 className="text-sm font-medium">Today's Progress</h4>
          </div>
          
          <div className="text-center p-3 bg-muted/30 rounded pixel-border">
            <div className="text-xl font-bold text-accent">{formatTime(todayTotalTime)}</div>
            <div className="text-xs text-muted-foreground">Total Time Today</div>
          </div>

          {Object.keys(sessionsByTech).length > 0 && (
            <div className="space-y-2">
              {Object.entries(sessionsByTech).map(([techId, duration]) => {
                const tech = technologies.find(t => t.id === techId);
                if (!tech) return null;
                
                const percentage = todayTotalTime > 0 ? (duration / todayTotalTime) * 100 : 0;
                
                return (
                  <div key={techId} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span>{tech.icon}</span>
                      <span>{tech.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {Math.round(percentage)}%
                      </Badge>
                      <span className="font-mono text-xs">{formatTime(duration)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {getTodaySessions().length === 0 && todayTotalTime === 0 && (
          <div className="text-center py-4 text-muted-foreground">
            <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No sessions today. Start tracking your learning time!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};