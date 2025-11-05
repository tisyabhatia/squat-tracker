import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { MuscleGroupVolume, WeeklyVolumeData, MuscleGroup } from '../types';
import { ArrowLeft, TrendingUp, TrendingDown, Activity, Calendar, Award, AlertCircle } from 'lucide-react';
import { format, startOfWeek, endOfWeek, subWeeks, isWithinInterval } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';

interface VolumeTrackingProps {
  onBack: () => void;
}

const VolumeTracking: React.FC<VolumeTrackingProps> = ({ onBack }) => {
  const { exercises, userProfile } = useApp();
  const [selectedWeek, setSelectedWeek] = useState(0); // 0 = current week, 1 = last week, etc.
  const [viewMode, setViewMode] = useState<'sets' | 'volume'>('sets');

  // Recommended weekly set ranges per muscle group (Schoenfeld & colleagues research)
  const recommendedSets: Record<string, { min: number; max: number }> = {
    'chest': { min: 10, max: 20 },
    'back': { min: 10, max: 20 },
    'shoulders': { min: 10, max: 20 },
    'biceps': { min: 8, max: 15 },
    'triceps': { min: 8, max: 15 },
    'quadriceps': { min: 10, max: 20 },
    'hamstrings': { min: 8, max: 15 },
    'glutes': { min: 8, max: 15 },
    'calves': { min: 10, max: 20 },
    'abs': { min: 6, max: 15 },
  };

  const calculateMuscleGroupVolume = (weekOffset: number = 0): MuscleGroupVolume[] => {
    try {
      const history = JSON.parse(localStorage.getItem('workoutHistory') || '[]');
      const now = new Date();
      const weekStart = startOfWeek(subWeeks(now, weekOffset), { weekStartsOn: 1 }); // Monday
      const weekEnd = endOfWeek(subWeeks(now, weekOffset), { weekStartsOn: 1 }); // Sunday

      const volumeMap = new Map<MuscleGroup, MuscleGroupVolume>();

      // Initialize all muscle groups
      const muscleGroups: MuscleGroup[] = [
        'chest', 'back', 'shoulders', 'biceps', 'triceps',
        'quadriceps', 'hamstrings', 'glutes', 'calves', 'abs'
      ];

      muscleGroups.forEach(mg => {
        volumeMap.set(mg, {
          muscleGroup: mg,
          totalSets: 0,
          totalReps: 0,
          totalVolume: 0,
          workoutCount: 0,
        });
      });

      // Process workout history
      history.forEach((workout: any) => {
        if (!workout.completedAt || !workout.exercises) return;

        const workoutDate = new Date(workout.completedAt);
        if (!isWithinInterval(workoutDate, { start: weekStart, end: weekEnd })) return;

        workout.exercises.forEach((exerciseLog: any) => {
          const exercise = exercises.find(e => e.name === exerciseLog.name);
          if (!exercise) return;

          // Count sets for each muscle group targeted
          const allMuscles = [...exercise.primaryMuscles, ...exercise.secondaryMuscles];
          const completedSets = exerciseLog.completedSets || [];

          allMuscles.forEach((muscle: MuscleGroup) => {
            const current = volumeMap.get(muscle);
            if (!current) return;

            const isPrimary = exercise.primaryMuscles.includes(muscle);
            const setWeight = isPrimary ? 1 : 0.5; // Count secondary muscles as 0.5 sets

            completedSets.forEach((set: any) => {
              const volume = (set.weight || 0) * (set.reps || 0);
              current.totalSets += setWeight;
              current.totalReps += set.reps || 0;
              current.totalVolume += volume;
            });

            current.workoutCount += 1;
          });
        });
      });

      return Array.from(volumeMap.values())
        .filter(v => v.totalSets > 0)
        .sort((a, b) => b.totalSets - a.totalSets);
    } catch (error) {
      console.error('Error calculating muscle group volume:', error);
      return [];
    }
  };

  const currentWeekVolume = calculateMuscleGroupVolume(selectedWeek);
  const lastWeekVolume = calculateMuscleGroupVolume(selectedWeek + 1);

  const getVolumeStatus = (muscleGroup: MuscleGroup, sets: number) => {
    const recommended = recommendedSets[muscleGroup];
    if (!recommended) return { status: 'unknown', message: 'No data' };

    if (sets < recommended.min) {
      return {
        status: 'low',
        message: `Below optimal (${recommended.min}-${recommended.max} sets)`,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50 dark:bg-yellow-950/30',
        borderColor: 'border-yellow-200 dark:border-yellow-800'
      };
    } else if (sets > recommended.max) {
      return {
        status: 'high',
        message: `Above optimal (${recommended.min}-${recommended.max} sets)`,
        color: 'text-orange-600',
        bgColor: 'bg-orange-50 dark:bg-orange-950/30',
        borderColor: 'border-orange-200 dark:border-orange-800'
      };
    } else {
      return {
        status: 'optimal',
        message: `Optimal range (${recommended.min}-${recommended.max} sets)`,
        color: 'text-green-600',
        bgColor: 'bg-green-50 dark:bg-green-950/30',
        borderColor: 'border-green-200 dark:border-green-800'
      };
    }
  };

  const getWeekLabel = (offset: number) => {
    const date = subWeeks(new Date(), offset);
    const start = startOfWeek(date, { weekStartsOn: 1 });
    const end = endOfWeek(date, { weekStartsOn: 1 });

    if (offset === 0) {
      return `This Week (${format(start, 'MMM d')} - ${format(end, 'd')})`;
    } else if (offset === 1) {
      return `Last Week (${format(start, 'MMM d')} - ${format(end, 'd')})`;
    } else {
      return `${offset} Weeks Ago (${format(start, 'MMM d')} - ${format(end, 'd')})`;
    }
  };

  // Chart data for the last 8 weeks
  const chartData = Array.from({ length: 8 }, (_, i) => {
    const weekOffset = 7 - i;
    const volume = calculateMuscleGroupVolume(weekOffset);
    const date = subWeeks(new Date(), weekOffset);
    const start = startOfWeek(date, { weekStartsOn: 1 });

    return {
      week: format(start, 'MMM d'),
      totalSets: volume.reduce((sum, v) => sum + v.totalSets, 0),
      totalVolume: volume.reduce((sum, v) => sum + v.totalVolume, 0),
      ...volume.reduce((acc, v) => {
        acc[v.muscleGroup] = v.totalSets;
        return acc;
      }, {} as Record<string, number>)
    };
  });

  const formatMuscleGroupName = (mg: MuscleGroup) => {
    return mg.charAt(0).toUpperCase() + mg.slice(1).replace('-', ' ');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Volume Tracking</h1>
                <p className="text-sm text-gray-600">Monitor training volume per muscle group</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('sets')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  viewMode === 'sets'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Sets
              </button>
              <button
                onClick={() => setViewMode('volume')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  viewMode === 'volume'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Volume (lbs)
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Week Selector */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSelectedWeek(selectedWeek + 1)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              ← Previous Week
            </button>
            <div className="flex items-center gap-2 text-gray-900 font-medium">
              <Calendar className="w-5 h-5" />
              {getWeekLabel(selectedWeek)}
            </div>
            <button
              onClick={() => setSelectedWeek(Math.max(0, selectedWeek - 1))}
              disabled={selectedWeek === 0}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedWeek === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Next Week →
            </button>
          </div>
        </div>

        {/* Volume Trend Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">8-Week Volume Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey={viewMode === 'sets' ? 'totalSets' : 'totalVolume'}
                stroke="#3b82f6"
                strokeWidth={2}
                name={viewMode === 'sets' ? 'Total Sets' : 'Total Volume (lbs)'}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Current Week Summary */}
        {currentWeekVolume.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentWeekVolume.map((volume) => {
              const status = getVolumeStatus(volume.muscleGroup, volume.totalSets);
              const lastWeek = lastWeekVolume.find(v => v.muscleGroup === volume.muscleGroup);
              const setChange = lastWeek ? volume.totalSets - lastWeek.totalSets : 0;

              return (
                <div
                  key={volume.muscleGroup}
                  className={`bg-white rounded-xl shadow-sm p-5 border ${
                    status.status === 'optimal' ? 'border-green-200' :
                    status.status === 'low' ? 'border-yellow-200' :
                    'border-orange-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {formatMuscleGroupName(volume.muscleGroup)}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-2xl font-bold text-gray-900">
                          {Math.round(volume.totalSets)}
                        </span>
                        <span className="text-sm text-gray-600">sets</span>
                      </div>
                    </div>
                    <div className={`p-2 rounded-lg ${
                      status.status === 'optimal' ? 'bg-green-100' :
                      status.status === 'low' ? 'bg-yellow-100' :
                      'bg-orange-100'
                    }`}>
                      {status.status === 'optimal' ? (
                        <Award className={`w-5 h-5 ${status.color}`} />
                      ) : (
                        <AlertCircle className={`w-5 h-5 ${status.color}`} />
                      )}
                    </div>
                  </div>

                  <div className={`p-2 rounded-lg ${status.bgColor} border ${status.borderColor} mb-3`}>
                    <p className={`text-xs font-medium ${status.color}`}>
                      {status.message}
                    </p>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Total Reps</span>
                      <span className="font-semibold text-gray-900">{volume.totalReps}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Total Volume</span>
                      <span className="font-semibold text-gray-900">
                        {(volume.totalVolume / 1000).toFixed(1)}k lbs
                      </span>
                    </div>
                    {lastWeek && setChange !== 0 && (
                      <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                        <span className="text-gray-600">vs Last Week</span>
                        <span className={`font-semibold flex items-center gap-1 ${
                          setChange > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {setChange > 0 ? (
                            <TrendingUp className="w-4 h-4" />
                          ) : (
                            <TrendingDown className="w-4 h-4" />
                          )}
                          {setChange > 0 ? '+' : ''}{setChange.toFixed(1)} sets
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Volume Data</h3>
              <p className="text-gray-600">
                Complete some workouts to start tracking your training volume per muscle group.
              </p>
            </div>
          </div>
        )}

        {/* Guidelines */}
        <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Volume Guidelines for Hypertrophy
          </h3>
          <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
            <li>• <strong>Optimal range:</strong> 10-20 sets per muscle group per week for most muscles</li>
            <li>• <strong>Smaller muscles:</strong> 8-15 sets per week (biceps, triceps, calves)</li>
            <li>• <strong>Progressive overload:</strong> Gradually increase volume over time to continue making gains</li>
            <li>• <strong>Recovery:</strong> More volume isn't always better - ensure adequate recovery between sessions</li>
            <li>• <strong>Deload weeks:</strong> Every 4-6 weeks, reduce volume by 40-50% to allow recovery</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VolumeTracking;
