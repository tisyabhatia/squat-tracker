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
    weight: 150, // Default value since it's still required by type but not shown
    gender: 'prefer-not-to-say' as Gender, // Default since not shown
    fitnessLevel: undefined,
    primaryGoal: undefined,
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
      newErrors.height = 'Height must be between 3ft and 8ft';
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
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">Step {step} of 3</span>
            <span className="text-sm text-muted-foreground">{Math.round((step / 3) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Personal Stats */}
        {step === 1 && (
          <div className="bg-card rounded-xl shadow-sm p-6 md:p-8 space-y-6 animate-in fade-in slide-in-from-right duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Personal Information</h2>
                <p className="text-muted-foreground">Tell us about yourself</p>
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Full Name <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full px-4 py-3 border rounded-lg bg-input-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.name ? 'border-destructive' : 'border-border'
                }`}
                placeholder="John Doe"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Age and Height Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Age <span className="text-destructive">*</span>
                </label>
                <input
                  type="number"
                  value={formData.age || ''}
                  onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || undefined })}
                  className={`w-full px-4 py-3 border rounded-lg bg-input-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.age ? 'border-destructive' : 'border-border'
                  }`}
                  placeholder="25"
                />
                {errors.age && (
                  <p className="mt-1 text-xs text-destructive">{errors.age}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Height <span className="text-destructive">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={Math.floor((formData.height || 0) / 12) || ''}
                    onChange={(e) => {
                      const feet = parseInt(e.target.value) || 0;
                      const inches = (formData.height || 0) % 12;
                      setFormData({ ...formData, height: feet * 12 + inches });
                    }}
                    className={`w-1/2 px-4 py-3 border rounded-lg bg-input-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent ${
                      errors.height ? 'border-destructive' : 'border-border'
                    }`}
                    placeholder="5"
                  />
                  <span className="flex items-center text-foreground">ft</span>
                  <input
                    type="number"
                    value={(formData.height || 0) % 12 || ''}
                    onChange={(e) => {
                      const feet = Math.floor((formData.height || 0) / 12);
                      const inches = parseInt(e.target.value) || 0;
                      setFormData({ ...formData, height: feet * 12 + inches });
                    }}
                    className={`w-1/2 px-4 py-3 border rounded-lg bg-input-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent ${
                      errors.height ? 'border-destructive' : 'border-border'
                    }`}
                    placeholder="10"
                  />
                  <span className="flex items-center text-foreground">in</span>
                </div>
                {errors.height && (
                  <p className="mt-1 text-xs text-destructive">{errors.height}</p>
                )}
              </div>
            </div>

            {/* Experience Level */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Experience Level <span className="text-destructive">*</span>
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
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="font-medium text-foreground">{option.label}</div>
                    <div className="text-sm text-muted-foreground">{option.desc}</div>
                  </button>
                ))}
              </div>
              {errors.fitnessLevel && (
                <p className="mt-1 text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.fitnessLevel}
                </p>
              )}
            </div>

            {/* Navigation */}
            <div className="flex justify-end pt-4">
              <button
                onClick={handleNext}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all hover:scale-105 flex items-center gap-2 font-medium shadow-lg hover:shadow-xl"
              >
                Next Step
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Goal Selection */}
        {step === 2 && (
          <div className="bg-card rounded-xl shadow-sm p-6 md:p-8 space-y-6 animate-in fade-in slide-in-from-right duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Your Goal</h2>
                <p className="text-muted-foreground">What do you want to achieve?</p>
              </div>
            </div>

            {/* Primary Goal */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Primary Goal <span className="text-destructive">*</span>
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
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="text-2xl mb-2">{option.icon}</div>
                    <div className="font-semibold text-foreground mb-1">
                      {option.label.replace(option.icon + ' ', '')}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {getGoalDescription(option.value)}
                    </div>
                  </button>
                ))}
              </div>
              {errors.primaryGoal && (
                <p className="mt-2 text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.primaryGoal}
                </p>
              )}
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-4">
              <button
                onClick={handleBack}
                className="px-6 py-3 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-all hover:scale-105 flex items-center gap-2 font-medium"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </button>
              <button
                onClick={handleNext}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all hover:scale-105 flex items-center gap-2 font-medium shadow-lg hover:shadow-xl"
              >
                Next Step
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && (
          <div className="bg-card rounded-xl shadow-sm p-6 md:p-8 space-y-6 animate-in fade-in slide-in-from-right duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">You're All Set!</h2>
                <p className="text-muted-foreground">Review your information</p>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-muted rounded-lg p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium text-foreground">{formData.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Age</p>
                  <p className="font-medium text-foreground">{formData.age} years</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Height</p>
                  <p className="font-medium text-foreground">{Math.floor((formData.height || 0) / 12)}' {(formData.height || 0) % 12}"</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Weight</p>
                  <p className="font-medium text-foreground">{formData.weight} lbs</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Experience</p>
                  <p className="font-medium text-foreground capitalize">{formData.fitnessLevel}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Primary Goal</p>
                  <p className="font-medium text-foreground">
                    {formData.primaryGoal?.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </p>
                </div>
              </div>
            </div>

            {/* Ready to Start Prompt */}
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 text-center">
              <h3 className="text-xl font-bold text-foreground mb-2">
                Ready to start tracking your first workout?
              </h3>
              <p className="text-muted-foreground mb-6">
                Let's begin your transformation journey. You can log a workout or record your starting measurements.
              </p>
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-4">
              <button
                onClick={handleBack}
                className="px-6 py-3 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-all hover:scale-105 flex items-center gap-2 font-medium"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </button>
              <button
                onClick={handleComplete}
                className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all hover:scale-105 flex items-center gap-2 font-medium shadow-lg hover:shadow-xl"
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
