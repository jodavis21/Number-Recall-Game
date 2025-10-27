import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameState } from './types';
import type { GameSettings, RoundResult } from './types';
import { useSound } from './hooks/useSound';
import { SetupScreen } from './components/SetupScreen';
import { ResultFeedback } from './components/ResultFeedback';
import { GameOverScreen } from './components/GameOverScreen';
import { InputForm } from './components/InputForm';

const generateRandomNumber = (digits: number): string => {
  if (digits <= 0) return '';
  let num = '';
  for (let i = 0; i < digits; i++) {
    num += Math.floor(Math.random() * 10);
  }
  return num;
};

const Countdown: React.FC<{ count: number }> = ({ count }) => (
  <div className="flex items-center justify-center min-h-screen">
    <span className="text-9xl font-bold animate-ping-once">{count}</span>
  </div>
);

const NumberDisplay: React.FC<{ number: string }> = ({ number }) => (
  <div className="flex items-center justify-center min-h-screen">
    <span className="text-9xl font-mono tracking-widest animate-fade-in">{number}</span>
  </div>
);

const RecallDelayScreen: React.FC = () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-4 h-4 bg-slate-500 rounded-full animate-pulse"></div>
    </div>
);

const SoundToggle: React.FC<{ isEnabled: boolean; onToggle: () => void }> = ({ isEnabled, onToggle }) => (
    <button onClick={onToggle} className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors z-10">
        {isEnabled ? 
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg> :
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" /></svg>
        }
    </button>
);


const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.SETUP);
  const [settings, setSettings] = useState<GameSettings>({ digits: 7, displayTime: 3, rounds: 10, recallDelay: 0 });
  const [currentRound, setCurrentRound] = useState(1);
  const [currentNumber, setCurrentNumber] = useState('');
  const [results, setResults] = useState<RoundResult[]>([]);
  const [countdown, setCountdown] = useState(3);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const { playSound } = useSound();

  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window && isSoundEnabled) {
      const utterance = new SpeechSynthesisUtterance(text.split('').join(' '));
      utterance.rate = 0.7;
      utterance.pitch = 1.1;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
  }, [isSoundEnabled]);

  const startGame = (newSettings: GameSettings) => {
    setSettings(newSettings);
    setCurrentRound(1);
    setResults([]);
    setCountdown(3);
    setCurrentNumber(generateRandomNumber(newSettings.digits));
    setGameState(GameState.COUNTDOWN);
  };

  const handleInputSubmit = (userInput: string) => {
    const isCorrect = userInput === currentNumber;
    if (isSoundEnabled) {
        playSound(isCorrect ? 'correct' : 'incorrect');
    }
    setResults(prev => [...prev, { correctNumber: currentNumber, userInput, isCorrect }]);
    setGameState(GameState.SHOWING_RESULT);
  };

  const advanceRound = useCallback(() => {
    if (currentRound >= settings.rounds) {
      setGameState(GameState.GAME_OVER);
    } else {
      setCurrentRound(prev => prev + 1);
      setCurrentNumber(generateRandomNumber(settings.digits));
      setCountdown(3);
      setGameState(GameState.COUNTDOWN);
    }
  }, [currentRound, settings]);

  const resetGame = () => {
    setGameState(GameState.SETUP);
  };

  useEffect(() => {
    let timer: number;
    if (gameState === GameState.COUNTDOWN) {
      if (countdown > 0) {
        timer = window.setTimeout(() => setCountdown(c => c - 1), 1000);
      } else {
        setGameState(GameState.SHOWING_NUMBER);
      }
    } else if (gameState === GameState.SHOWING_NUMBER) {
      speak(currentNumber);
      timer = window.setTimeout(() => setGameState(GameState.RECALL_DELAY), settings.displayTime * 1000);
    } else if (gameState === GameState.RECALL_DELAY) {
      timer = window.setTimeout(() => setGameState(GameState.AWAITING_INPUT), settings.recallDelay * 1000);
    } else if (gameState === GameState.SHOWING_RESULT) {
      timer = window.setTimeout(advanceRound, 2500);
    }
    return () => {
        clearTimeout(timer);
        if (gameState === GameState.SHOWING_NUMBER) {
          window.speechSynthesis.cancel();
        }
    };
  }, [gameState, countdown, settings, advanceRound, currentNumber, speak]);
  
  const renderContent = () => {
    switch (gameState) {
      case GameState.SETUP:
        return <SetupScreen onStart={startGame} />;
      case GameState.COUNTDOWN:
        return <Countdown count={countdown} />;
      case GameState.SHOWING_NUMBER:
        return <NumberDisplay number={currentNumber} />;
      case GameState.RECALL_DELAY:
        return <RecallDelayScreen />;
      case GameState.AWAITING_INPUT:
        return <InputForm onSubmit={handleInputSubmit} digits={settings.digits} />;
      case GameState.SHOWING_RESULT:
        return <ResultFeedback result={results[results.length - 1]} />;
      case GameState.GAME_OVER:
        return <GameOverScreen results={results} onPlayAgain={resetGame} />;
      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center">
      <style>{`
        @keyframes fade-in { 0% { opacity: 0; transform: scale(0.95); } 100% { opacity: 1; transform: scale(1); } }
        .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
        @keyframes ping-once { 0% { transform: scale(0.8); opacity: 0.8; } 100% { transform: scale(1.5); opacity: 0; } }
        .animate-ping-once { animation: ping-once 1s cubic-bezier(0, 0, 0.2, 1) forwards; }
      `}</style>
       {gameState !== GameState.SETUP && <SoundToggle isEnabled={isSoundEnabled} onToggle={() => setIsSoundEnabled(p => !p)} />}
      {renderContent()}
    </main>
  );
};

export default App;