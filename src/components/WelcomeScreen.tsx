import { TrendingUp, Zap, Target, Activity, Dumbbell } from 'lucide-react';

interface WelcomeScreenProps {
  onStartFresh: () => void;
}

export function WelcomeScreen({ onStartFresh }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)`
        }} />
      </div>

      <div className="relative z-10 w-full max-w-4xl">
        {/* Main Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/30 rounded-full px-4 py-2 mb-6">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Bodybuilding-Focused Training</span>
          </div>

          <h1 className="text-6xl md:text-7xl font-black text-foreground mb-6 leading-tight">
            Build Your<br />
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Best Self
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-4 max-w-2xl mx-auto leading-relaxed">
            Track every rep and <span className="text-foreground font-semibold">see your evolution.</span>
          </p>

          {/* CTA Button */}
          <div className="flex justify-center items-center mb-12">
            <button
              onClick={onStartFresh}
              className="group relative px-12 py-6 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-xl font-bold text-xl shadow-2xl hover:shadow-primary/50 transition-all hover:scale-105"
            >
              <div className="flex items-center justify-center gap-3">
                <TrendingUp className="w-7 h-7 group-hover:translate-y-[-2px] transition-transform" />
                <span>Start Your Journey</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-xl opacity-0 group-hover:opacity-20 transition-opacity blur-xl" />
            </button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
          <div className="bg-card/40 backdrop-blur-sm border border-border rounded-xl p-6 text-center hover:bg-card/60 transition-all">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Activity className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-foreground font-semibold mb-2">Progressive Overload</h3>
            <p className="text-muted-foreground text-sm">Track every set with intelligent suggestions for continuous gains</p>
          </div>

          <div className="bg-card/40 backdrop-blur-sm border border-border rounded-xl p-6 text-center hover:bg-card/60 transition-all">
            <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Dumbbell className="w-6 h-6 text-secondary" />
            </div>
            <h3 className="text-foreground font-semibold mb-2">200+ Exercises</h3>
            <p className="text-muted-foreground text-sm">Comprehensive exercise library with form tips and muscle targeting</p>
          </div>

          <div className="bg-card/40 backdrop-blur-sm border border-border rounded-xl p-6 text-center hover:bg-card/60 transition-all">
            <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-accent-foreground" />
            </div>
            <h3 className="text-foreground font-semibold mb-2">Performance Tracking</h3>
            <p className="text-muted-foreground text-sm">Visualize your progress with detailed history and analytics</p>
          </div>
        </div>
      </div>
    </div>
  );
}
