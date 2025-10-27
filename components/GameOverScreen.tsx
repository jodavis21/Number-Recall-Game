
import React, { useMemo } from 'react';
import type { RoundResult } from '../types';

interface GameOverScreenProps {
  results: RoundResult[];
  onPlayAgain: () => void;
}

const StatCard: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div className="bg-slate-800 p-6 rounded-lg text-center shadow-lg">
    <p className="text-lg text-slate-400 mb-1">{label}</p>
    <p className="text-5xl font-bold text-cyan-400">{value}</p>
  </div>
);

export const GameOverScreen: React.FC<GameOverScreenProps> = ({ results, onPlayAgain }) => {
  const stats = useMemo(() => {
    const totalRounds = results.length;
    const correctAnswers = results.filter(r => r.isCorrect).length;
    const percentage = totalRounds > 0 ? ((correctAnswers / totalRounds) * 100).toFixed(0) : 0;
    
    let longestStreak = 0;
    let currentStreak = 0;
    for (const result of results) {
      if (result.isCorrect) {
        currentStreak++;
      } else {
        longestStreak = Math.max(longestStreak, currentStreak);
        currentStreak = 0;
      }
    }
    longestStreak = Math.max(longestStreak, currentStreak);

    return { totalRounds, correctAnswers, percentage, longestStreak };
  }, [results]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center animate-fade-in">
      <h1 className="text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Session Complete</h1>
      <p className="text-2xl text-slate-400 mb-12">Here's how you did.</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 w-full max-w-4xl mb-12">
        <StatCard label="Total Rounds" value={stats.totalRounds} />
        <StatCard label="Correct" value={stats.correctAnswers} />
        <StatCard label="Accuracy" value={`${stats.percentage}%`} />
        <StatCard label="Best Streak" value={stats.longestStreak} />
      </div>

      <button
        onClick={onPlayAgain}
        className="px-12 py-4 bg-cyan-600 text-white font-bold text-2xl rounded-lg shadow-lg hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-cyan-500/50 transform hover:scale-105 transition-all duration-200"
      >
        Play Again
      </button>
    </div>
  );
};
