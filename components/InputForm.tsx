import React, { useState, useEffect, useRef } from 'react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

interface InputFormProps {
    onSubmit: (input: string) => void;
    digits: number;
}

export const InputForm: React.FC<InputFormProps> = ({ onSubmit, digits }) => {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleRecognitionResult = (transcript: string) => {
    setInput(transcript);
    if (transcript) {
      // Automatically submit when speech recognition provides a final result.
      // A small delay lets the user see the transcribed number before transitioning.
      setTimeout(() => onSubmit(transcript), 300);
    }
  };

  const { isListening, isSupported, startListening } = useSpeechRecognition(handleRecognitionResult);

  useEffect(() => {
    inputRef.current?.focus();
    if (isSupported) {
      // Automatically start listening when the component is ready
      startListening();
    }
  }, [isSupported, startListening]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(input);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 animate-fade-in">
      <h2 className="text-4xl font-semibold mb-8">What was the number?</h2>
      <form onSubmit={handleSubmit} className="relative flex flex-col items-center">
        <div className="relative w-80 md:w-96">
            <input
              ref={inputRef}
              type="tel"
              pattern="[0-9]*"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={digits}
              className="w-full p-4 text-5xl bg-slate-800 border-2 border-slate-600 rounded-lg text-center font-mono tracking-widest focus:border-cyan-500 focus:ring-cyan-500 outline-none transition pr-16"
              aria-label="Enter the number"
            />
            {isSupported && (
                <div
                    className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
                    aria-hidden="true"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 transition-colors duration-300 ${isListening ? 'text-red-500 animate-pulse' : 'text-slate-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-14 0m7 10v4m0 0l-3-3m3 3l3-3M5 11a7 7 0 0114 0" />
                    </svg>
                </div>
            )}
            <button type="submit" className="hidden">Submit</button>
        </div>
        {isSupported && (
            <p className="mt-4 text-slate-400 text-lg transition-opacity duration-300 h-6" style={{ opacity: isListening ? 1 : 0 }}>
                Listening...
            </p>
        )}
      </form>
    </div>
  );
};
