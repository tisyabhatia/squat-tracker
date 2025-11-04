import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Trophy, Clock, Dumbbell, TrendingUp, Target,
  CheckCircle2, Flame
} from 'lucide-react';
import { WorkoutSession } from '../types';
import { format } from 'date-fns';

interface WorkoutSummaryProps {
  session: WorkoutSession;
  personalRecordsAchieved?: number;
  volumeComparison?: number;
  onClose: () => void;
}

export function WorkoutSummary({
  session,
  personalRecordsAchieved = 0,
  volumeComparison = 0,
  onClose
}: WorkoutSummaryProps) {
  // Calculate statistics
  const totalSets = session.exercises.reduce((sum, ex) => sum + ex.sets.length, 0);
  const totalReps = session.exercises.reduce(
    (sum, ex) => sum + ex.sets.reduce((s, set) => s + (set.reps || 0), 0),
    0
  );
  const averageRestTime = session.exercises.reduce(
    (sum, ex) => {
      const restTimes = ex.sets.map(s => s.restTime || 0).filter(r => r > 0);
      return sum + (restTimes.length > 0 ? restTimes.reduce((a, b) => a + b, 0) / restTimes.length : 0);
    },
    0
  ) / session.exercises.length;

  const durationMinutes = Math.floor(session.duration / 60);
  const durationSeconds = session.duration % 60;

  return (
    <div className="min-h-screen bg-background p-4 flex items-center justify-center">
      <div className="w-full max-w-2xl space-y-6">
        {/* Header with celebration */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-accent/20 rounded-full mb-4">
            <Trophy className="w-10 h-10 text-accent" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Workout Complete!</h1>
          <p className="text-muted-foreground">
            {session.name} • {format(new Date(session.startTime), 'MMM d, yyyy')}
          </p>
        </div>

        {/* Key Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="p-4 text-center">
              <Clock className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">
                {durationMinutes}:{durationSeconds.toString().padStart(2, '0')}
              </div>
              <div className="text-sm text-muted-foreground">Duration</div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-4 text-center">
              <Dumbbell className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">{totalSets}</div>
              <div className="text-sm text-muted-foreground">Total Sets</div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">{totalReps}</div>
              <div className="text-sm text-muted-foreground">Total Reps</div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-4 text-center">
              <Flame className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">
                {session.totalVolume?.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Volume (lbs)</div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Highlights */}
        {(personalRecordsAchieved > 0 || volumeComparison !== 0) && (
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Performance Highlights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {personalRecordsAchieved > 0 && (
                <div className="flex items-center gap-3 p-3 bg-accent/10 rounded-lg">
                  <Trophy className="w-5 h-5 text-accent" />
                  <div>
                    <p className="font-semibold text-foreground">
                      {personalRecordsAchieved} Personal Record{personalRecordsAchieved > 1 ? 's' : ''}!
                    </p>
                    <p className="text-sm text-muted-foreground">New PRs achieved this workout</p>
                  </div>
                </div>
              )}

              {volumeComparison > 0 && (
                <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-semibold text-foreground">
                      +{volumeComparison}% Volume Increase
                    </p>
                    <p className="text-sm text-muted-foreground">Compared to your last {session.type} workout</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 p-3 bg-green-500/10 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <div>
                  <p className="font-semibold text-foreground">Consistency Building</p>
                  <p className="text-sm text-muted-foreground">Keep up the great work!</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Exercise Breakdown */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Exercise Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {session.exercises.map((exercise, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-accent/5 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-foreground">{exercise.exerciseName}</p>
                  <p className="text-sm text-muted-foreground">
                    {exercise.sets.length} sets completed
                  </p>
                </div>
                <div className="text-right">
                  {exercise.sets.map((set, setIdx) => (
                    <span key={setIdx} className="text-sm text-muted-foreground mr-2">
                      {set.weight ? `${set.weight}×${set.reps}` : `${set.reps} reps`}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            View History
          </Button>
          <Button className="flex-1" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
