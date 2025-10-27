
import React from 'react';
import type { RoundResult } from '../types';

interface ResultFeedbackProps {
  result: RoundResult;
}

const DigitSpan: React.FC<{ char: string; isCorrect: boolean }> = ({ char, isCorrect }) => {
  const baseClasses = 'inline-block px-1 rounded';
  const correctClasses = 'text-green-400 bg-green-900/50 underline decoration-green-500 decoration-2 underline-offset-4';
  const incorrectClasses = 'text-red-400 bg-red-900/50 line-through decoration-red-500 decoration-2';

  return (
    <span className={`${baseClasses} ${isCorrect ? correctClasses : incorrectClasses}`}>
      {char}
    </span>
  );
};


export const ResultFeedback: React.FC<ResultFeedbackProps> = ({ result }) => {
  if (result.isCorrect) {
    return (
      <div className="flex flex-col items-center justify-center p-4 text-center animate-fade-in" aria-live="polite">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-green-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 className="text-7xl font-bold text-green-400">Correct!</h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 text-center animate-fade-in" aria-live="polite">
       <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h2 className="text-5xl font-bold text-red-400 mb-8">Incorrect</h2>
      <div className="space-y-4 text-3xl font-mono tracking-widest">
        <div className="flex items-center gap-4">
          <span className="w-32 text-slate-400 text-right">Correct:</span>
          <p>{result.correctNumber.split('').map((char, index) => <span key={index}>{char}</span>)}</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="w-32 text-slate-400 text-right">Your input:</span>
          <p>
            {result.userInput.padEnd(result.correctNumber.length, ' ').split('').map((char, index) => (
               <DigitSpan key={index} char={char === ' ' ? '␣' : char} isCorrect={char === result.correctNumber[index]} />
            ))}
          </p>
        </div>
      </div>
    </div>
  );
};
