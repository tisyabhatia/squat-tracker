import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Dumbbell, PlayCircle, Sparkles } from 'lucide-react';

interface WelcomeScreenProps {
  onStartFresh: () => void;
  onTryDemo: () => void;
}

export function WelcomeScreen({ onStartFresh, onTryDemo }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-card border-border">
        <CardContent className="p-8 space-y-6">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-4">
              <Dumbbell className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">Checkpoint</h1>
            <p className="text-lg text-muted-foreground">
              Your comprehensive fitness tracking companion
            </p>
          </div>

          <div className="space-y-3 pt-4">
            <Button
              className="w-full h-auto py-4"
              size="lg"
              onClick={onStartFresh}
            >
              <Sparkles className="w-5 h-5 mr-2" />
              <div className="text-left">
                <div className="font-semibold">Start Fresh</div>
                <div className="text-xs opacity-90">Create your personalized profile</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="w-full h-auto py-4"
              size="lg"
              onClick={onTryDemo}
            >
              <PlayCircle className="w-5 h-5 mr-2" />
              <div className="text-left">
                <div className="font-semibold">Try Demo Mode</div>
                <div className="text-xs text-muted-foreground">Explore with pre-loaded data</div>
              </div>
            </Button>
          </div>

          <div className="pt-4 border-t border-border">
            <p className="text-sm text-center text-muted-foreground">
              Track workouts • Set goals • Monitor progress • Achieve your fitness goals
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
