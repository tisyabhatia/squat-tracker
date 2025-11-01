import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Apple, Plus, TrendingUp, Target, Flame } from 'lucide-react';

export function NutritionTracking() {
  const [calories, setCalories] = useState(1650);
  const [protein, setProtein] = useState(125);
  const [carbs, setCarbs] = useState(180);
  const [fats, setFats] = useState(55);

  const goals = {
    calories: 2200,
    protein: 165,
    carbs: 220,
    fats: 73
  };

  const meals = [
    {
      id: 1,
      name: 'Breakfast',
      time: '8:00 AM',
      items: ['Oatmeal with berries', 'Protein shake', 'Banana'],
      calories: 450,
      protein: 35,
      carbs: 60,
      fats: 10
    },
    {
      id: 2,
      name: 'Lunch',
      time: '12:30 PM',
      items: ['Grilled chicken breast', 'Brown rice', 'Mixed vegetables'],
      calories: 550,
      protein: 45,
      carbs: 65,
      fats: 12
    },
    {
      id: 3,
      name: 'Snack',
      time: '3:00 PM',
      items: ['Greek yogurt', 'Almonds'],
      calories: 250,
      protein: 20,
      carbs: 15,
      fats: 15
    },
    {
      id: 4,
      name: 'Dinner',
      time: '7:00 PM',
      items: ['Salmon', 'Sweet potato', 'Broccoli'],
      calories: 400,
      protein: 25,
      carbs: 40,
      fats: 18
    }
  ];

  const getPercentage = (current: number, goal: number) => {
    return Math.min(Math.round((current / goal) * 100), 100);
  };

  const remaining = {
    calories: goals.calories - calories,
    protein: goals.protein - protein,
    carbs: goals.carbs - carbs,
    fats: goals.fats - fats
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2">Nutrition Tracking</h1>
        <p className="text-gray-600">
          Track your daily macros and meet your nutrition goals
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Today's Macros
              </CardTitle>
              <CardDescription>Your nutritional intake for today</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-orange-600" />
                    <span>Calories</span>
                  </div>
                  <span className="text-sm">
                    {calories} / {goals.calories} kcal
                  </span>
                </div>
                <Progress value={getPercentage(calories, goals.calories)} className="h-3" />
                <p className="text-sm text-gray-600 mt-1">
                  {remaining.calories > 0 ? `${remaining.calories} kcal remaining` : 'Goal reached!'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Protein</span>
                    <span className="text-sm">{protein}g / {goals.protein}g</span>
                  </div>
                  <Progress value={getPercentage(protein, goals.protein)} className="h-2" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Carbs</span>
                    <span className="text-sm">{carbs}g / {goals.carbs}g</span>
                  </div>
                  <Progress value={getPercentage(carbs, goals.carbs)} className="h-2" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Fats</span>
                    <span className="text-sm">{fats}g / {goals.fats}g</span>
                  </div>
                  <Progress value={getPercentage(fats, goals.fats)} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Apple className="w-5 h-5" />
                  Meals
                </CardTitle>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Meal
                </Button>
              </div>
              <CardDescription>Track what you've eaten today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {meals.map(meal => (
                  <div key={meal.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="mb-1">{meal.name}</h3>
                        <p className="text-sm text-gray-600">{meal.time}</p>
                      </div>
                      <Badge variant="secondary">{meal.calories} kcal</Badge>
                    </div>

                    <ul className="text-sm text-gray-600 mb-3 space-y-1">
                      {meal.items.map((item, index) => (
                        <li key={index}>• {item}</li>
                      ))}
                    </ul>

                    <div className="flex gap-4 text-sm text-gray-600">
                      <span>P: {meal.protein}g</span>
                      <span>C: {meal.carbs}g</span>
                      <span>F: {meal.fats}g</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Add</CardTitle>
              <CardDescription>Log a quick meal or snack</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block mb-2 text-sm">Food Name</label>
                <Input placeholder="e.g., Grilled Chicken" />
              </div>

              <div>
                <label className="block mb-2 text-sm">Calories (kcal)</label>
                <Input type="number" placeholder="0" />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block mb-2 text-sm">Protein (g)</label>
                  <Input type="number" placeholder="0" />
                </div>
                <div>
                  <label className="block mb-2 text-sm">Carbs (g)</label>
                  <Input type="number" placeholder="0" />
                </div>
                <div>
                  <label className="block mb-2 text-sm">Fats (g)</label>
                  <Input type="number" placeholder="0" />
                </div>
              </div>

              <Button className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Food
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Weekly Average</CardTitle>
              <CardDescription>Your average intake this week</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Calories</span>
                <span className="text-sm font-semibold">2,150 kcal</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Protein</span>
                <span className="text-sm font-semibold">158g</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Carbs</span>
                <span className="text-sm font-semibold">210g</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Fats</span>
                <span className="text-sm font-semibold">68g</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-10 h-10" />
                <div>
                  <h3 className="mb-1">Great Progress!</h3>
                  <p className="text-green-100 text-sm">
                    You're 75% towards your daily calorie goal
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
