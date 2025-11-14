import React, { useState } from 'react';
import { OnboardingData, Gender, BodybuildingGoal } from '../types';
import { ArrowLeft, ArrowRight, User, Target, CheckCircle, AlertCircle } from 'lucide-react';

interface ComprehensiveOnboardingProps {
  email: string;
  userId: string;
  onComplete: (data: OnboardingData) => void;
}

const ComprehensiveOnboarding: React.FC<ComprehensiveOnboardingProps> = ({
  email,
  userId,
  onComplete
}) => {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form state
  const [formData, setFormData] = useState<Partial<OnboardingData>>({
    email,
    name: '',
    age: undefined,
    height: undefined,
    weight: undefined,
    gender: undefined,
    fitnessLevel: undefined,
    primaryGoal: undefined,
    targetWeight: undefined,
    targetBodyFat: undefined,
  });

  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name || formData.name.trim().length === 0) {
      newErrors.name = 'Name is required';
    }

    if (!formData.age) {
      newErrors.age = 'Age is required';
    } else if (formData.age < 13 || formData.age > 120) {
      newErrors.age = 'Age must be between 13 and 120';
    }

    if (!formData.height) {
      newErrors.height = 'Height is required';
    } else if (formData.height < 36 || formData.height > 96) {
      newErrors.height = 'Height must be between 36 and 96 inches';
    }

    if (!formData.weight) {
      newErrors.weight = 'Weight is required';
    } else if (formData.weight < 50 || formData.weight > 400) {
      newErrors.weight = 'Weight must be between 50 and 400 lbs';
    }

    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }

    if (!formData.fitnessLevel) {
      newErrors.fitnessLevel = 'Experience level is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.primaryGoal) {
      newErrors.primaryGoal = 'Please select a primary goal';
    }

    if (formData.targetWeight && (formData.targetWeight < 50 || formData.targetWeight > 400)) {
      newErrors.targetWeight = 'Target weight must be between 50 and 400 lbs';
    }

    if (formData.targetBodyFat && (formData.targetBodyFat < 3 || formData.targetBodyFat > 50)) {
      newErrors.targetBodyFat = 'Target body fat must be between 3% and 50%';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setErrors({});
    }
  };

  const handleComplete = () => {
    if (validateStep2()) {
      onComplete(formData as OnboardingData);
    }
  };

  const getGoalDescription = (goal: BodybuildingGoal): string => {
    switch (goal) {
      case 'recomp':
        return 'Simultaneously lose fat and build muscle. Best for beginners or those returning to training.';
      case 'lean-bulk':
        return 'Build muscle with minimal fat gain. Ideal for those looking to grow while staying lean.';
      case 'cut':
        return 'Lose fat while maintaining muscle mass. Perfect for revealing definition.';
      case 'strength-focus':
        return 'Maximize strength gains. Optimize for lifting heavier weights.';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Step {step} of 3</span>
            <span className="text-sm text-gray-500">{Math.round((step / 3) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Personal Stats */}
        {step === 1 && (
          <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 space-y-6 animate-in fade-in slide-in-from-right duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
                <p className="text-gray-600">Tell us about yourself</p>
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-500 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="John Doe"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Age, Height, Weight Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.age || ''}
                  onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || undefined })}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-500 ${
                    errors.age ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="25"
                />
                {errors.age && (
                  <p className="mt-1 text-xs text-red-600">{errors.age}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Height (in) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.height || ''}
                  onChange={(e) => setFormData({ ...formData, height: parseFloat(e.target.value) || undefined })}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-500 ${
                    errors.height ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="70"
                />
                {errors.height && (
                  <p className="mt-1 text-xs text-red-600">{errors.height}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight (lbs) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.weight || ''}
                  onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) || undefined })}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-500 ${
                    errors.weight ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="180"
                />
                {errors.weight && (
                  <p className="mt-1 text-xs text-red-600">{errors.weight}</p>
                )}
              </div>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { value: 'male' as Gender, label: 'Male' },
                  { value: 'female' as Gender, label: 'Female' },
                  { value: 'other' as Gender, label: 'Other' },
                  { value: 'prefer-not-to-say' as Gender, label: 'Prefer not to say' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFormData({ ...formData, gender: option.value })}
                    className={`px-4 py-3 rounded-lg border-2 transition-all ${
                      formData.gender === option.value
                        ? 'border-blue-600 bg-blue-50 text-blue-600'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              {errors.gender && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.gender}
                </p>
              )}
            </div>

            {/* Experience Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Experience Level <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { value: 'beginner', label: 'Beginner', desc: '0-1 years' },
                  { value: 'intermediate', label: 'Intermediate', desc: '1-3 years' },
                  { value: 'advanced', label: 'Advanced', desc: '3+ years' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFormData({ ...formData, fitnessLevel: option.value as any })}
                    className={`px-4 py-4 rounded-lg border-2 transition-all text-left ${
                      formData.fitnessLevel === option.value
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="font-medium text-gray-900">{option.label}</div>
                    <div className="text-sm text-gray-600">{option.desc}</div>
                  </button>
                ))}
              </div>
              {errors.fitnessLevel && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.fitnessLevel}
                </p>
              )}
            </div>

            {/* Navigation */}
            <div className="flex justify-end pt-4">
              <button
                onClick={handleNext}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all hover:scale-105 flex items-center gap-2 font-medium shadow-lg hover:shadow-xl"
              >
                Next Step
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Goal Selection */}
        {step === 2 && (
          <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 space-y-6 animate-in fade-in slide-in-from-right duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Your Goal</h2>
                <p className="text-gray-600">What do you want to achieve?</p>
              </div>
            </div>

            {/* Primary Goal */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Primary Goal <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { value: 'recomp' as BodybuildingGoal, label: '⚖️ Recomp', icon: '⚖️' },
                  { value: 'lean-bulk' as BodybuildingGoal, label: '💪 Lean Bulk', icon: '💪' },
                  { value: 'cut' as BodybuildingGoal, label: '🔥 Cut', icon: '🔥' },
                  { value: 'strength-focus' as BodybuildingGoal, label: '💥 Strength Focus', icon: '💥' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFormData({ ...formData, primaryGoal: option.value })}
                    className={`px-5 py-4 rounded-lg border-2 transition-all text-left ${
                      formData.primaryGoal === option.value
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="text-2xl mb-2">{option.icon}</div>
                    <div className="font-semibold text-gray-900 mb-1">
                      {option.label.replace(option.icon + ' ', '')}
                    </div>
                    <div className="text-sm text-gray-600">
                      {getGoalDescription(option.value)}
                    </div>
                  </button>
                ))}
              </div>
              {errors.primaryGoal && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.primaryGoal}
                </p>
              )}
            </div>

            {/* Optional Targets */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Optional Targets</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Weight (lbs)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.targetWeight || ''}
                    onChange={(e) => setFormData({ ...formData, targetWeight: parseFloat(e.target.value) || undefined })}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-500 ${
                      errors.targetWeight ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Optional"
                  />
                  {errors.targetWeight && (
                    <p className="mt-1 text-xs text-red-600">{errors.targetWeight}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Body Fat (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.targetBodyFat || ''}
                    onChange={(e) => setFormData({ ...formData, targetBodyFat: parseFloat(e.target.value) || undefined })}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-500 ${
                      errors.targetBodyFat ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Optional"
                  />
                  {errors.targetBodyFat && (
                    <p className="mt-1 text-xs text-red-600">{errors.targetBodyFat}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-4">
              <button
                onClick={handleBack}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all hover:scale-105 flex items-center gap-2 font-medium"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </button>
              <button
                onClick={handleNext}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all hover:scale-105 flex items-center gap-2 font-medium shadow-lg hover:shadow-xl"
              >
                Next Step
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && (
          <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 space-y-6 animate-in fade-in slide-in-from-right duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">You're All Set!</h2>
                <p className="text-gray-600">Review your information</p>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium text-gray-900">{formData.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Age</p>
                  <p className="font-medium text-gray-900">{formData.age} years</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Height</p>
                  <p className="font-medium text-gray-900">{formData.height}" ({(formData.height! / 12).toFixed(1)}' {formData.height! % 12}")</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Weight</p>
                  <p className="font-medium text-gray-900">{formData.weight} lbs</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Experience</p>
                  <p className="font-medium text-gray-900 capitalize">{formData.fitnessLevel}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Primary Goal</p>
                  <p className="font-medium text-gray-900">
                    {formData.primaryGoal?.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </p>
                </div>
              </div>
            </div>

            {/* Ready to Start Prompt */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Ready to start tracking your first workout?
              </h3>
              <p className="text-gray-600 mb-6">
                Let's begin your transformation journey. You can log a workout or record your starting measurements.
              </p>
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-4">
              <button
                onClick={handleBack}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all hover:scale-105 flex items-center gap-2 font-medium"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </button>
              <button
                onClick={handleComplete}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all hover:scale-105 flex items-center gap-2 font-medium shadow-lg hover:shadow-xl"
              >
                Complete Setup
                <CheckCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComprehensiveOnboarding;
