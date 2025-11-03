import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Audio } from 'expo-av';
import { Colors } from '@/constants/Colors';
import { useTranslation } from 'react-i18next';

interface Word {
  word: string;
  image: string; // emoji representing the word
  hint: string;
}

// Lista de palavras simples para crianças
const WORDS: Word[] = [
  { word: 'GATO', image: '🐱', hint: 'Um animal que faz miau' },
  { word: 'SOL', image: '☀️', hint: 'Brilha no céu durante o dia' },
  { word: 'FLOR', image: '🌸', hint: 'Colorida e cheirosa' },
  { word: 'CASA', image: '🏠', hint: 'Onde você mora' },
  { word: 'BOLA', image: '⚽', hint: 'Usada para jogar' },
  { word: 'PATO', image: '🦆', hint: 'Ave que nada' },
  { word: 'SAPO', image: '🐸', hint: 'Pula e faz coaxar' },
  { word: 'LEAO', image: '🦁', hint: 'Rei da selva' },
  { word: 'URSO', image: '🐻', hint: 'Grande e peludo' },
  { word: 'LOBO', image: '🐺', hint: 'Parente do cachorro' },
];

/**
 * Word Builder Game
 * Build words by selecting letters in order
 */
export default function WordBuilderGame() {
  const router = useRouter();
  const { t } = useTranslation();
  const [wordSequence, setWordSequence] = useState<Word[]>([]); // Randomized sequence
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [selectedLetters, setSelectedLetters] = useState<string[]>([]);
  const [availableLetters, setAvailableLetters] = useState<string[]>([]);
  const [usedLetterIndices, setUsedLetterIndices] = useState<number[]>([]); // Track which letters are used
  const [score, setScore] = useState(0);
  const [wordsCompleted, setWordsCompleted] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showVictory, setShowVictory] = useState(false);
  const [celebration] = useState(new Animated.Value(0));

  const TOTAL_WORDS = 10;
  const currentWord = wordSequence[currentWordIndex];

  // Initialize audio and word sequence
  useEffect(() => {
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
    });

    // Create randomized sequence of words
    initializeWordSequence();
  }, []);

  // Initialize letters for current word
  useEffect(() => {
    if (currentWord) {
      generateLetters();
    }
  }, [currentWordIndex, wordSequence]);

  const initializeWordSequence = () => {
    // Shuffle the WORDS array to create random sequence
    const shuffled = [...WORDS].sort(() => Math.random() - 0.5);
    setWordSequence(shuffled);
  };

  const generateLetters = () => {
    // Get letters from the word
    const wordLetters = currentWord.word.split('');

    // Add some random extra letters to make it challenging
    const extraLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      .split('')
      .filter(letter => !wordLetters.includes(letter))
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);

    // Combine and shuffle
    const allLetters = [...wordLetters, ...extraLetters].sort(() => Math.random() - 0.5);

    setAvailableLetters(allLetters);
    setSelectedLetters([]);
    setUsedLetterIndices([]);
    setShowSuccess(false);
  };

  // Play sound feedback
  const playSound = async (correct: boolean) => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        correct
          ? require('@/assets/sounds/correct.mp3')
          : require('@/assets/sounds/wrong.mp3'),
        { volume: 1.0 }
      );
      await sound.playAsync();
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
        }
      });
    } catch (error) {
      console.log('Error playing sound:', error);
    }
  };

  const handleLetterSelect = async (letter: string, index: number) => {
    if (showSuccess) return;
    if (usedLetterIndices.includes(index)) return; // Letter already used

    const newSelected = [...selectedLetters, letter];
    setSelectedLetters(newSelected);

    // Mark letter as used (don't remove it)
    const newUsedIndices = [...usedLetterIndices, index];
    setUsedLetterIndices(newUsedIndices);

    // Check if word is complete
    if (newSelected.length === currentWord.word.length) {
      const builtWord = newSelected.join('');

      if (builtWord === currentWord.word) {
        // CORRECT!
        await playSound(true);
        setShowSuccess(true);
        setScore(score + 1);
        triggerCelebration();

        setTimeout(() => {
          const nextWordCount = wordsCompleted + 1;
          setWordsCompleted(nextWordCount);

          if (nextWordCount >= TOTAL_WORDS) {
            setShowVictory(true);
          } else {
            // Next word
            setCurrentWordIndex((currentWordIndex + 1) % WORDS.length);
          }
        }, 2000);
      } else {
        // WRONG - reset
        await playSound(false);
        setTimeout(() => {
          // Reset selection but keep letters in place
          setSelectedLetters([]);
          setUsedLetterIndices([]);
        }, 1000);
      }
    }
  };

  const handleLetterRemove = (index: number) => {
    if (showSuccess) return;

    const letter = selectedLetters[index];
    const newSelected = selectedLetters.filter((_, i) => i !== index);
    setSelectedLetters(newSelected);

    // Find the letter in availableLetters and restore its index
    const letterIndex = availableLetters.findIndex((l, i) =>
      l === letter && usedLetterIndices.includes(i) &&
      !newSelected.includes(l) // Make sure it's not still selected elsewhere
    );

    if (letterIndex !== -1) {
      // Remove from used indices
      const newUsedIndices = usedLetterIndices.filter(i => i !== letterIndex);
      setUsedLetterIndices(newUsedIndices);
    }
  };

  const triggerCelebration = () => {
    celebration.setValue(0);
    Animated.spring(celebration, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handleRestart = () => {
    setScore(0);
    setWordsCompleted(0);
    setCurrentWordIndex(0);
    setShowVictory(false);
    initializeWordSequence(); // Create new random sequence
  };

  const handleBack = () => {
    router.push('/(tabs)');
  };

  const celebrationScale = celebration.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.2],
  });

  // Victory screen
  if (showVictory) {
    return (
      <LinearGradient
        colors={['#FFD700', '#FFA500']}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.victoryContainer}>
            <Text style={styles.victoryEmoji}>🎉</Text>
            <Text style={styles.victoryTitle}>{t('games.common.congratulations')}</Text>
            <Text style={styles.victoryMessage}>
              {t('games.wordBuilder.victoryMessage', { score })}
            </Text>

            <TouchableOpacity
              style={styles.restartButton}
              onPress={handleRestart}
              activeOpacity={0.8}
            >
              <Text style={styles.restartButtonText}>{t('games.common.playAgain')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBack}
              activeOpacity={0.8}
            >
              <Text style={styles.backButtonText}>{t('games.common.backToHome')}</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  // Show loading while word sequence is being initialized
  if (!currentWord) {
    return null;
  }

  return (
    <LinearGradient
      colors={['#FFD700', '#FFA500']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerButton} onPress={handleBack}>
            <Text style={styles.headerButtonText}>{t('games.common.back')}</Text>
          </TouchableOpacity>

          <View style={styles.scoreContainer}>
            <Text style={styles.scoreText}>
              Palavra {wordsCompleted + 1}/{TOTAL_WORDS}
            </Text>
            <Text style={styles.pointsText}>⭐ {score}</Text>
          </View>
        </View>

        {/* Word Image and Hint */}
        <View style={styles.wordContainer}>
          <Animated.Text
            style={[
              styles.wordImage,
              showSuccess && { transform: [{ scale: celebrationScale }] }
            ]}
          >
            {currentWord.image}
          </Animated.Text>
          <Text style={styles.hint}>{currentWord.hint}</Text>
        </View>

        {/* Selected Letters Area */}
        <View style={styles.selectedArea}>
          <Text style={styles.selectedTitle}>{t('games.wordBuilder.instruction')}</Text>
          <View style={styles.selectedLetters}>
            {Array.from({ length: currentWord.word.length }).map((_, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.letterSlot,
                  selectedLetters[index] && styles.letterSlotFilled,
                  showSuccess && styles.letterSlotSuccess,
                ]}
                onPress={() => selectedLetters[index] && handleLetterRemove(index)}
                disabled={!selectedLetters[index] || showSuccess}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.letterSlotText,
                  selectedLetters[index] && styles.letterSlotTextFilled,
                ]}>
                  {selectedLetters[index] || ''}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Available Letters */}
        <View style={styles.availableArea}>
          <Text style={styles.availableTitle}>Escolha as letras:</Text>
          <View style={styles.availableLetters}>
            {availableLetters.map((letter, index) => {
              const isUsed = usedLetterIndices.includes(index);
              return (
                <TouchableOpacity
                  key={`${letter}-${index}`}
                  style={[
                    styles.letterButton,
                    isUsed && styles.letterButtonUsed,
                  ]}
                  onPress={() => handleLetterSelect(letter, index)}
                  disabled={showSuccess || isUsed}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.letterButtonText,
                    isUsed && styles.letterButtonTextUsed,
                  ]}>
                    {letter}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Success Message */}
        {showSuccess && (
          <View style={styles.successContainer}>
            <Text style={styles.successText}>Muito bem! ✓</Text>
          </View>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  headerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textInverse,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  scoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textInverse,
  },
  pointsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textInverse,
  },
  wordContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  wordImage: {
    fontSize: 80,
    marginBottom: 12,
  },
  hint: {
    fontSize: 18,
    color: Colors.textInverse,
    textAlign: 'center',
    opacity: 0.9,
    paddingHorizontal: 40,
  },
  selectedArea: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: 'center',
  },
  selectedTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.textInverse,
    marginBottom: 16,
  },
  selectedLetters: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  letterSlot: {
    width: 60,
    height: 70,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 12,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.5)',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  letterSlotFilled: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderStyle: 'solid',
    borderColor: 'rgba(255,255,255,1)',
  },
  letterSlotSuccess: {
    backgroundColor: Colors.success,
    borderColor: Colors.successDark,
  },
  letterSlotText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'rgba(255,255,255,0.5)',
  },
  letterSlotTextFilled: {
    color: '#FF8C00',
  },
  availableArea: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  availableTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textInverse,
    marginBottom: 16,
    textAlign: 'center',
  },
  availableLetters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  letterButton: {
    width: 60,
    height: 60,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,1)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  letterButtonUsed: {
    opacity: 0.4,
    borderStyle: 'dashed',
    borderColor: 'rgba(255,255,255,0.6)',
  },
  letterButtonText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF8C00',
  },
  letterButtonTextUsed: {
    opacity: 0.6,
  },
  successContainer: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  successText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.textInverse,
    backgroundColor: Colors.success,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 24,
  },
  victoryContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  victoryEmoji: {
    fontSize: 100,
    marginBottom: 24,
  },
  victoryTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: Colors.textInverse,
    marginBottom: 16,
  },
  victoryMessage: {
    fontSize: 24,
    color: Colors.textInverse,
    textAlign: 'center',
    marginBottom: 48,
    opacity: 0.95,
  },
  restartButton: {
    backgroundColor: Colors.cta,
    paddingHorizontal: 40,
    paddingVertical: 18,
    borderRadius: 30,
    marginBottom: 16,
    shadowColor: Colors.ctaDark,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  restartButtonText: {
    color: Colors.textInverse,
    fontSize: 20,
    fontWeight: 'bold',
  },
  backButton: {
    paddingHorizontal: 32,
    paddingVertical: 14,
  },
  backButtonText: {
    color: Colors.textInverse,
    fontSize: 18,
    fontWeight: '600',
    opacity: 0.9,
  },
});
