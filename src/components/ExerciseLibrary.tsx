import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Search, Dumbbell, Info, Star, Zap } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { ExerciseCategory } from '../types';
import { WorkoutGeneration } from './WorkoutGeneration';

export function ExerciseLibrary() {
  const { exercises } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showGenerate, setShowGenerate] = useState(false);

  if (showGenerate) {
    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          onClick={() => setShowGenerate(false)}
          className="text-foreground"
        >
          ← Back to Exercises
        </Button>
        <WorkoutGeneration onStartWorkout={() => setShowGenerate(false)} />
      </div>
    );
  }

  const categories: { value: string; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'strength', label: 'Strength' },
    { value: 'core', label: 'Core' },
  ];

  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exercise.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exercise.primaryMuscles.some(m => m.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || exercise.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'intermediate':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'advanced':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="mb-2 text-foreground">Exercise Library</h1>
          <p className="text-muted-foreground">
            Browse {exercises.length}+ exercises with detailed instructions
          </p>
        </div>
        <Button
          onClick={() => setShowGenerate(true)}
          className="flex items-center gap-2"
        >
          <Zap className="w-4 h-4" />
          Generate Workout
        </Button>
      </div>

      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Search exercises..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-input text-foreground"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {categories.map(category => (
                <Button
                  key={category.value}
                  variant={selectedCategory === category.value ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(category.value)}
                  className="capitalize whitespace-nowrap"
                  size="sm"
                >
                  {category.label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExercises.map(exercise => (
          <Card key={exercise.id} className="hover:shadow-lg transition-shadow bg-card border-border">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <Dumbbell className="w-5 h-5 text-primary" />
                    {exercise.name}
                  </CardTitle>
                  <CardDescription className="mt-2 text-muted-foreground">
                    {exercise.category.charAt(0).toUpperCase() + exercise.category.slice(1)}
                  </CardDescription>
                </div>
                <Badge className={getDifficultyColor(exercise.difficulty)}>
                  {exercise.difficulty}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm mb-2 text-foreground">Target Muscles</h4>
                <div className="flex flex-wrap gap-1">
                  {exercise.primaryMuscles.map(muscle => (
                    <Badge key={muscle} variant="outline" className="text-xs capitalize">
                      {muscle}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm mb-2 text-foreground">Equipment</h4>
                <p className="text-sm text-muted-foreground capitalize">
                  {exercise.equipment.join(', ') || 'None'}
                </p>
              </div>

              <p className="text-sm text-muted-foreground">{exercise.description}</p>

              <div className="pt-2 border-t border-border">
                <details className="group">
                  <summary className="flex items-center gap-2 cursor-pointer text-sm text-primary hover:text-primary/80">
                    <Info className="w-4 h-4" />
                    <span>View Instructions</span>
                  </summary>
                  <div className="mt-3 space-y-4">
                    <div>
                      <h5 className="text-sm font-semibold mb-2 text-foreground">Instructions</h5>
                      <ol className="space-y-1 text-sm text-muted-foreground list-decimal list-inside">
                        {exercise.instructions.map((instruction, index) => (
                          <li key={index}>{instruction}</li>
                        ))}
                      </ol>
                    </div>

                    {exercise.formTips && exercise.formTips.length > 0 && (
                      <div>
                        <h5 className="text-sm font-semibold mb-2 text-foreground">Form Tips</h5>
                        <ul className="space-y-1 text-muted-foreground list-disc list-inside">
                          {exercise.formTips.map((tip, index) => (
                            <li key={index}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {exercise.commonMistakes && exercise.commonMistakes.length > 0 && (
                      <div>
                        <h5 className="text-sm font-semibold mb-2 text-foreground">Common Mistakes</h5>
                        <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
                          {exercise.commonMistakes.map((mistake, index) => (
                            <li key={index}>{mistake}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </details>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredExercises.length === 0 && (
        <Card className="bg-card border-border">
          <CardContent className="p-12 text-center">
            <Dumbbell className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-30" />
            <h3 className="mb-2 text-foreground">No exercises found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filter</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
