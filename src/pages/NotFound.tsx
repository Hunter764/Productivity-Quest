import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center retro-card p-8 max-w-md">
        <div className="text-6xl mb-4">🎮</div>
        <h1 className="text-4xl font-bold mb-4 text-primary">404</h1>
        <p className="text-xl text-muted-foreground mb-4">Quest not found!</p>
        <p className="text-sm text-muted-foreground mb-6">
          This page seems to have leveled up and moved to a new location.
        </p>
        <a 
          href="/" 
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-sm pixel-border glow-effect hover:bg-primary/90 transition-colors"
        >
          🏠 Return to Dashboard
        </a>
      </div>
    </div>
  );
};

export default NotFound;
