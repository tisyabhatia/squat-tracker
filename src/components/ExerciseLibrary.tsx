import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Search, Dumbbell, Info, Play } from 'lucide-react';

export function ExerciseLibrary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'chest', 'back', 'legs', 'shoulders', 'arms', 'core', 'cardio'];

  const exercises = [
    {
      id: 1,
      name: 'Barbell Squat',
      category: 'legs',
      difficulty: 'Intermediate',
      muscleGroups: ['Quadriceps', 'Glutes', 'Hamstrings'],
      equipment: ['Barbell', 'Rack'],
      description: 'A compound exercise targeting the lower body with emphasis on quadriceps and glutes.',
      instructions: [
        'Position the bar on your upper back',
        'Stand with feet shoulder-width apart',
        'Descend by bending knees and hips',
        'Keep chest up and core tight',
        'Drive through heels to return to standing'
      ]
    },
    {
      id: 2,
      name: 'Bench Press',
      category: 'chest',
      difficulty: 'Intermediate',
      muscleGroups: ['Chest', 'Triceps', 'Shoulders'],
      equipment: ['Barbell', 'Bench'],
      description: 'Classic upper body compound movement targeting the chest.',
      instructions: [
        'Lie flat on bench with feet on floor',
        'Grip bar slightly wider than shoulders',
        'Lower bar to mid-chest',
        'Press bar up until arms are extended',
        'Keep shoulder blades retracted'
      ]
    },
    {
      id: 3,
      name: 'Deadlift',
      category: 'back',
      difficulty: 'Advanced',
      muscleGroups: ['Back', 'Glutes', 'Hamstrings', 'Traps'],
      equipment: ['Barbell'],
      description: 'Full body compound exercise with emphasis on posterior chain.',
      instructions: [
        'Stand with feet hip-width apart',
        'Grip bar just outside legs',
        'Keep back straight and chest up',
        'Drive through heels to stand',
        'Lower bar with control'
      ]
    },
    {
      id: 4,
      name: 'Pull-ups',
      category: 'back',
      difficulty: 'Intermediate',
      muscleGroups: ['Lats', 'Biceps', 'Upper Back'],
      equipment: ['Pull-up Bar'],
      description: 'Bodyweight exercise for upper back and arm development.',
      instructions: [
        'Hang from bar with hands shoulder-width',
        'Pull body up until chin over bar',
        'Lower with control',
        'Keep core engaged',
        'Avoid swinging'
      ]
    },
    {
      id: 5,
      name: 'Overhead Press',
      category: 'shoulders',
      difficulty: 'Intermediate',
      muscleGroups: ['Shoulders', 'Triceps', 'Core'],
      equipment: ['Barbell'],
      description: 'Compound movement for shoulder strength and stability.',
      instructions: [
        'Start with bar at shoulder height',
        'Press bar overhead',
        'Lock out arms at top',
        'Lower with control',
        'Keep core tight throughout'
      ]
    },
    {
      id: 6,
      name: 'Plank',
      category: 'core',
      difficulty: 'Beginner',
      muscleGroups: ['Core', 'Shoulders', 'Glutes'],
      equipment: ['None'],
      description: 'Isometric core strengthening exercise.',
      instructions: [
        'Start in push-up position on forearms',
        'Keep body in straight line',
        'Engage core and glutes',
        'Hold position',
        'Breathe normally'
      ]
    },
    {
      id: 7,
      name: 'Running',
      category: 'cardio',
      difficulty: 'Beginner',
      muscleGroups: ['Legs', 'Cardiovascular'],
      equipment: ['None'],
      description: 'Cardiovascular exercise for endurance and fat loss.',
      instructions: [
        'Start with warm-up walk',
        'Maintain steady pace',
        'Land on midfoot',
        'Keep posture upright',
        'Control breathing'
      ]
    },
    {
      id: 8,
      name: 'Bicep Curls',
      category: 'arms',
      difficulty: 'Beginner',
      muscleGroups: ['Biceps'],
      equipment: ['Dumbbells'],
      description: 'Isolation exercise for bicep development.',
      instructions: [
        'Stand with dumbbells at sides',
        'Curl weights up',
        'Keep elbows stationary',
        'Squeeze at top',
        'Lower with control'
      ]
    }
  ];

  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exercise.muscleGroups.some(m => m.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || exercise.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2">Exercise Library</h1>
        <p className="text-gray-600">
          Browse our comprehensive database of exercises with detailed instructions
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search exercises..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(category)}
                  className="capitalize whitespace-nowrap"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExercises.map(exercise => (
          <Card key={exercise.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    <Dumbbell className="w-5 h-5 text-blue-600" />
                    {exercise.name}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    {exercise.category.charAt(0).toUpperCase() + exercise.category.slice(1)}
                  </CardDescription>
                </div>
                <Badge variant="secondary">{exercise.difficulty}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm mb-2">Target Muscles</h4>
                <div className="flex flex-wrap gap-1">
                  {exercise.muscleGroups.map(muscle => (
                    <Badge key={muscle} variant="outline" className="text-xs">
                      {muscle}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm mb-2">Equipment</h4>
                <p className="text-sm text-gray-600">
                  {exercise.equipment.join(', ') || 'None'}
                </p>
              </div>

              <p className="text-sm text-gray-600">{exercise.description}</p>

              <div className="pt-2 border-t">
                <details className="group">
                  <summary className="flex items-center gap-2 cursor-pointer text-sm text-blue-600 hover:text-blue-700">
                    <Info className="w-4 h-4" />
                    <span>View Instructions</span>
                  </summary>
                  <ol className="mt-3 space-y-2 text-sm text-gray-600 list-decimal list-inside">
                    {exercise.instructions.map((instruction, index) => (
                      <li key={index}>{instruction}</li>
                    ))}
                  </ol>
                </details>
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1" size="sm">
                  <Play className="w-4 h-4 mr-2" />
                  Watch Video
                </Button>
                <Button className="flex-1" size="sm">
                  Add to Workout
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredExercises.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Dumbbell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="mb-2 text-gray-600">No exercises found</h3>
            <p className="text-gray-500">Try adjusting your search or filter</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
