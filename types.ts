
export interface MorningEssence {
  greeting: string;
  quote: string;
  wordOfDay: {
    word: string;
    meaning: string;
  };
  tip: string;
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export interface MoodData {
  day: string;
  level: number;
}
