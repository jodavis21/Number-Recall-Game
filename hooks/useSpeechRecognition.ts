import { useState, useEffect, useRef, useCallback } from 'react';

// FIX: Add minimal type definitions for the Web Speech API to address missing types.
// This ensures type safety without needing to modify tsconfig.json.
interface SpeechRecognition {
  continuous: boolean;
  lang: string;
  interimResults: boolean;
  onstart: () => void;
  onend: () => void;
  onerror: (event: any) => void;
  onresult: (event: any) => void;
  abort: () => void;
  start: () => void;
}

type SpeechRecognitionConstructor = new () => SpeechRecognition;

declare global {
  interface Window {
    SpeechRecognition: SpeechRecognitionConstructor;
    webkitSpeechRecognition: SpeechRecognitionConstructor;
  }
}

// FIX: Rename the constant to avoid shadowing the `SpeechRecognition` type.
// This resolves the error: "'SpeechRecognition' refers to a value, but is being used as a type here."
const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;

export const useSpeechRecognition = (onResult: (transcript: string) => void) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  // FIX: Use the now-available `SpeechRecognition` interface for strong typing.
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  
  const onResultRef = useRef(onResult);
  onResultRef.current = onResult;

  useEffect(() => {
    // FIX: Use the renamed constant.
    if (typeof SpeechRecognitionAPI === 'undefined') {
      setIsSupported(false);
      return;
    }
    
    setIsSupported(true);
    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      const numbersOnly = transcript.replace(/\D/g, '');
      if (onResultRef.current) {
        onResultRef.current(numbersOnly);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      recognitionRef.current?.abort();
    };
  }, []);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error("Could not start speech recognition:", error);
      }
    }
  }, [isListening]);
  
  return { isListening, isSupported, startListening };
};
