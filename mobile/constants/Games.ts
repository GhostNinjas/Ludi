import i18n from '@/lib/i18n';

export interface MiniGame {
  id: string;
  titleKey: string; // Changed to store translation key
  emoji: string;
  descriptionKey: string; // Changed to store translation key
  category: string;
  minAge: number;
  maxAge: number;
  difficulty: 'easy' | 'medium' | 'hard';
  color: string;
  gradient: string[];
  // Computed properties
  get title(): string;
  get description(): string;
}

interface GameCategory {
  titleKey: string;
  emoji: string;
  color: string;
  get title(): string;
}

export const GAME_CATEGORIES: Record<string, GameCategory> = {
  numbers: {
    titleKey: 'categories.numbers',
    emoji: '🔤',
    color: '#FFD700',
    get title() {
      return i18n.t(this.titleKey);
    },
  },
  letters: {
    titleKey: 'categories.letters',
    emoji: '🔢',
    color: '#FF6B9D',
    get title() {
      return i18n.t(this.titleKey);
    },
  },
  colors: {
    titleKey: 'categories.colors',
    emoji: '🎨',
    color: '#A855F7',
    get title() {
      return i18n.t(this.titleKey);
    },
  },
  memory: {
    titleKey: 'categories.memory',
    emoji: '🧠',
    color: '#3B82F6',
    get title() {
      return i18n.t(this.titleKey);
    },
  },
  logic: {
    titleKey: 'categories.logic',
    emoji: '🧩',
    color: '#10B981',
    get title() {
      return i18n.t(this.titleKey);
    },
  },
  creativity: {
    titleKey: 'categories.creativity',
    emoji: '✨',
    color: '#F59E0B',
    get title() {
      return i18n.t(this.titleKey);
    },
  },
};

export const MINI_GAMES: MiniGame[] = [
  // ABC e leitura
  {
    id: 'trace-letters',
    titleKey: 'miniGames.traceLetters.title',
    emoji: '✏️',
    descriptionKey: 'miniGames.traceLetters.description',
    category: 'numbers',
    minAge: 3,
    maxAge: 6,
    difficulty: 'easy',
    color: '#FFD700',
    gradient: ['#FFD700', '#FFA500'],
    get title() {
      return i18n.t(this.titleKey);
    },
    get description() {
      return i18n.t(this.descriptionKey);
    },
  },
  {
    id: 'letter-sounds',
    titleKey: 'miniGames.letterSounds.title',
    emoji: '🔊',
    descriptionKey: 'miniGames.letterSounds.description',
    category: 'numbers',
    minAge: 3,
    maxAge: 5,
    difficulty: 'easy',
    color: '#FFD700',
    gradient: ['#FFD700', '#FFA500'],
    get title() {
      return i18n.t(this.titleKey);
    },
    get description() {
      return i18n.t(this.descriptionKey);
    },
  },
  {
    id: 'word-builder',
    titleKey: 'miniGames.wordBuilder.title',
    emoji: '🏗️',
    descriptionKey: 'miniGames.wordBuilder.description',
    category: 'numbers',
    minAge: 4,
    maxAge: 6,
    difficulty: 'medium',
    color: '#FFD700',
    gradient: ['#FFD700', '#FFA500'],
    get title() {
      return i18n.t(this.titleKey);
    },
    get description() {
      return i18n.t(this.descriptionKey);
    },
  },

  // Números e Matemática
  {
    id: 'trace-numbers',
    titleKey: 'miniGames.traceNumbers.title',
    emoji: '🔢',
    descriptionKey: 'miniGames.traceNumbers.description',
    category: 'letters',
    minAge: 2,
    maxAge: 5,
    difficulty: 'easy',
    color: '#FF6B9D',
    gradient: ['#FF6B9D', '#C084FC'],
    get title() {
      return i18n.t(this.titleKey);
    },
    get description() {
      return i18n.t(this.descriptionKey);
    },
  },
  {
    id: 'count-objects',
    titleKey: 'miniGames.countObjects.title',
    emoji: '🧮',
    descriptionKey: 'miniGames.countObjects.description',
    category: 'letters',
    minAge: 2,
    maxAge: 4,
    difficulty: 'easy',
    color: '#FF6B9D',
    gradient: ['#FF6B9D', '#C084FC'],
    get title() {
      return i18n.t(this.titleKey);
    },
    get description() {
      return i18n.t(this.descriptionKey);
    },
  },
  {
    id: 'simple-math',
    titleKey: 'miniGames.simpleMath.title',
    emoji: '➕',
    descriptionKey: 'miniGames.simpleMath.description',
    category: 'letters',
    minAge: 4,
    maxAge: 6,
    difficulty: 'medium',
    color: '#FF6B9D',
    gradient: ['#FF6B9D', '#C084FC'],
    get title() {
      return i18n.t(this.titleKey);
    },
    get description() {
      return i18n.t(this.descriptionKey);
    },
  },

  // Cores e Formas
  {
    id: 'color-match',
    titleKey: 'miniGames.colorMatch.title',
    emoji: '🎨',
    descriptionKey: 'miniGames.colorMatch.description',
    category: 'colors',
    minAge: 1,
    maxAge: 3,
    difficulty: 'easy',
    color: '#A855F7',
    gradient: ['#A855F7', '#EC4899'],
    get title() {
      return i18n.t(this.titleKey);
    },
    get description() {
      return i18n.t(this.descriptionKey);
    },
  },
  {
    id: 'shape-sorter',
    titleKey: 'miniGames.shapeSorter.title',
    emoji: '🔷',
    descriptionKey: 'miniGames.shapeSorter.description',
    category: 'colors',
    minAge: 2,
    maxAge: 4,
    difficulty: 'easy',
    color: '#A855F7',
    gradient: ['#A855F7', '#EC4899'],
    get title() {
      return i18n.t(this.titleKey);
    },
    get description() {
      return i18n.t(this.descriptionKey);
    },
  },
  {
    id: 'color-mixer',
    titleKey: 'miniGames.colorMixer.title',
    emoji: '🌈',
    descriptionKey: 'miniGames.colorMixer.description',
    category: 'colors',
    minAge: 3,
    maxAge: 6,
    difficulty: 'medium',
    color: '#A855F7',
    gradient: ['#A855F7', '#EC4899'],
    get title() {
      return i18n.t(this.titleKey);
    },
    get description() {
      return i18n.t(this.descriptionKey);
    },
  },

  // Memória
  {
    id: 'memory',
    titleKey: 'miniGames.memory.title',
    emoji: '🃏',
    descriptionKey: 'miniGames.memory.description',
    category: 'memory',
    minAge: 3,
    maxAge: 6,
    difficulty: 'medium',
    color: '#667eea',
    gradient: ['#667eea', '#764ba2'],
    get title() {
      return i18n.t(this.titleKey);
    },
    get description() {
      return i18n.t(this.descriptionKey);
    },
  },
  {
    id: 'sequence-memory',
    titleKey: 'miniGames.sequenceMemory.title',
    emoji: '🧠',
    descriptionKey: 'miniGames.sequenceMemory.description',
    category: 'memory',
    minAge: 4,
    maxAge: 6,
    difficulty: 'medium',
    color: '#3B82F6',
    gradient: ['#3B82F6', '#8B5CF6'],
    get title() {
      return i18n.t(this.titleKey);
    },
    get description() {
      return i18n.t(this.descriptionKey);
    },
  },

  // Lógica
  {
    id: 'puzzle-simple',
    titleKey: 'miniGames.puzzleSimple.title',
    emoji: '🧩',
    descriptionKey: 'miniGames.puzzleSimple.description',
    category: 'logic',
    minAge: 2,
    maxAge: 4,
    difficulty: 'easy',
    color: '#10B981',
    gradient: ['#10B981', '#059669'],
    get title() {
      return i18n.t(this.titleKey);
    },
    get description() {
      return i18n.t(this.descriptionKey);
    },
  },
  {
    id: 'pattern-match',
    titleKey: 'miniGames.patternMatch.title',
    emoji: '🔄',
    descriptionKey: 'miniGames.patternMatch.description',
    category: 'logic',
    minAge: 4,
    maxAge: 6,
    difficulty: 'medium',
    color: '#10B981',
    gradient: ['#10B981', '#059669'],
    get title() {
      return i18n.t(this.titleKey);
    },
    get description() {
      return i18n.t(this.descriptionKey);
    },
  },
  {
    id: 'hide-seek',
    titleKey: 'miniGames.hideSeek.title',
    emoji: '🔍',
    descriptionKey: 'miniGames.hideSeek.description',
    category: 'logic',
    minAge: 2,
    maxAge: 5,
    difficulty: 'easy',
    color: '#10B981',
    gradient: ['#10B981', '#059669'],
    get title() {
      return i18n.t(this.titleKey);
    },
    get description() {
      return i18n.t(this.descriptionKey);
    },
  },

  // Criatividade
  {
    id: 'drawing-board',
    titleKey: 'miniGames.drawingBoard.title',
    emoji: '🖌️',
    descriptionKey: 'miniGames.drawingBoard.description',
    category: 'creativity',
    minAge: 2,
    maxAge: 6,
    difficulty: 'easy',
    color: '#F59E0B',
    gradient: ['#F59E0B', '#EF4444'],
    get title() {
      return i18n.t(this.titleKey);
    },
    get description() {
      return i18n.t(this.descriptionKey);
    },
  },
  {
    id: 'coloring',
    titleKey: 'miniGames.coloring.title',
    emoji: '🎨',
    descriptionKey: 'miniGames.coloring.description',
    category: 'creativity',
    minAge: 2,
    maxAge: 6,
    difficulty: 'easy',
    color: '#A855F7',
    gradient: ['#A855F7', '#EC4899'],
    get title() {
      return i18n.t(this.titleKey);
    },
    get description() {
      return i18n.t(this.descriptionKey);
    },
  },
  {
    id: 'music-creator',
    titleKey: 'miniGames.musicCreator.title',
    emoji: '🎵',
    descriptionKey: 'miniGames.musicCreator.description',
    category: 'creativity',
    minAge: 2,
    maxAge: 6,
    difficulty: 'easy',
    color: '#667eea',
    gradient: ['#667eea', '#764ba2', '#f093fb'],
    get title() {
      return i18n.t(this.titleKey);
    },
    get description() {
      return i18n.t(this.descriptionKey);
    },
  },
  {
    id: 'story-builder',
    titleKey: 'miniGames.storyBuilder.title',
    emoji: '📖',
    descriptionKey: 'miniGames.storyBuilder.description',
    category: 'creativity',
    minAge: 4,
    maxAge: 6,
    difficulty: 'medium',
    color: '#F59E0B',
    gradient: ['#F59E0B', '#EF4444'],
    get title() {
      return i18n.t(this.titleKey);
    },
    get description() {
      return i18n.t(this.descriptionKey);
    },
  },
];
