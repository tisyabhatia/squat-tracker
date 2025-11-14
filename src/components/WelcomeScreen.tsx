import { Button } from './ui/button';
import { TrendingUp, PlayCircle, Zap, Target, Activity } from 'lucide-react';

interface WelcomeScreenProps {
  onStartFresh: () => void;
  onTryDemo: () => void;
}

export function WelcomeScreen({ onStartFresh, onTryDemo }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)`
        }} />
      </div>

      <div className="relative z-10 w-full max-w-4xl">
        {/* Main Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 rounded-full px-4 py-2 mb-6">
            <Zap className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-blue-300">Bodybuilding-Focused Training</span>
          </div>

          <h1 className="text-6xl md:text-7xl font-black text-white mb-6 leading-tight">
            Build Your<br />
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Best Self
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-4 max-w-2xl mx-auto leading-relaxed">
            Track every rep and <span className="text-white font-semibold">see your evolution.</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button
              onClick={onStartFresh}
              className="group relative px-8 py-5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold text-lg shadow-2xl hover:shadow-blue-500/50 transition-all hover:scale-105 w-full sm:w-auto"
            >
              <div className="flex items-center justify-center gap-3">
                <TrendingUp className="w-6 h-6 group-hover:translate-y-[-2px] transition-transform" />
                <span>Start Building</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity blur-xl" />
            </button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
          <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center hover:bg-gray-800/60 transition-all">
            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Activity className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-white font-semibold mb-2">Progressive Overload</h3>
            <p className="text-gray-400 text-sm">Track every set with intelligent suggestions for continuous gains</p>
          </div>

          <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center hover:bg-gray-800/60 transition-all">
            <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Target className="w-6 h-6 text-cyan-400" />
            </div>
            <h3 className="text-white font-semibold mb-2">Volume Tracking</h3>
            <p className="text-gray-400 text-sm">Optimize muscle growth with science-backed volume ranges</p>
          </div>

          <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center hover:bg-gray-800/60 transition-all">
            <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-white font-semibold mb-2">Physique Monitoring</h3>
            <p className="text-gray-400 text-sm">Track measurements and photos to visualize your transformation</p>
          </div>
        </div>
      </div>
    </div>
  );
}
