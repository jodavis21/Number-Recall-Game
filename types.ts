
export enum GameState {
  SETUP,
  COUNTDOWN,
  SHOWING_NUMBER,
  RECALL_DELAY,
  AWAITING_INPUT,
  SHOWING_RESULT,
  GAME_OVER,
}

export interface GameSettings {
  digits: number;
  displayTime: number;
  rounds: number;
  recallDelay: number;
}

export interface RoundResult {
  correctNumber: string;
  userInput: string;
  isCorrect: boolean;
}
