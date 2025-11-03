import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Audio } from 'expo-av';
import { useTranslation } from 'react-i18next';
import { Colors } from '@/constants/Colors';

interface PatternItem {
  emoji: string;
  id: string;
}

interface Pattern {
  sequence: PatternItem[];
  missing: number; // Index where item is missing
  correctAnswer: PatternItem;
  answerOptions: PatternItem[]; // Fixed answer options
}

// Available pattern items
const PATTERN_ITEMS: PatternItem[] = [
  { emoji: '🔴', id: 'red' },
  { emoji: '🔵', id: 'blue' },
  { emoji: '🟢', id: 'green' },
  { emoji: '🟡', id: 'yellow' },
  { emoji: '⭐', id: 'star' },
  { emoji: '❤️', id: 'heart' },
  { emoji: '🔶', id: 'diamond' },
  { emoji: '🔷', id: 'square' },
];

/**
 * Pattern Match Game
 * Complete the pattern sequence
 */
export default function PatternMatchGame() {
  const { t } = useTranslation();
  const router = useRouter();
  const [currentPattern, setCurrentPattern] = useState<Pattern | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<PatternItem | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [patternsCompleted, setPatternsCompleted] = useState(0);
  const [showVictory, setShowVictory] = useState(false);
  const [celebration] = useState(new Animated.Value(0));
  const [difficulty, setDifficulty] = useState(1); // Increases as player progresses

  const TOTAL_PATTERNS = 10;

  // Initialize audio
  useEffect(() => {
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
    });
    generatePattern();
  }, []);

  // Generate a new pattern based on difficulty
  const generatePattern = () => {
    // Pattern length: minimum 4, maximum 10
    // Start with 4 items in level 1, gradually increase to 10
    const patternLength = Math.min(3 + difficulty, 10); // 4-10 items (difficulty starts at 1, so 3+1=4 minimum)

    // Number of different items in the pattern (2-4 types)
    // Start with 2 types, increase as difficulty grows
    const itemsToUse = Math.min(2 + Math.floor(difficulty / 3), 4);

    // Pick random items for this pattern
    const selectedItems = [...PATTERN_ITEMS]
      .sort(() => Math.random() - 0.5)
      .slice(0, itemsToUse);

    // Generate repeating pattern
    const sequence: PatternItem[] = [];
    for (let i = 0; i < patternLength; i++) {
      sequence.push(selectedItems[i % selectedItems.length]);
    }

    // Pick random position for missing item
    // Ensure at least one complete pattern cycle is visible before the missing item
    // This makes the pattern identifiable
    const safeStartIndex = itemsToUse; // First complete cycle must be visible
    const safeEndIndex = patternLength - 1; // Don't remove last item

    // Calculate missing index
    let missingIndex: number;
    if (safeEndIndex <= safeStartIndex) {
      // If pattern is too short, just pick a middle position
      missingIndex = Math.floor(patternLength / 2);
    } else {
      missingIndex = Math.floor(Math.random() * (safeEndIndex - safeStartIndex)) + safeStartIndex;
    }

    const correctAnswer = sequence[missingIndex];

    // Generate answer options (fixed order)
    const uniqueItems = Array.from(
      new Set(sequence.map(item => item.id))
    ).map(id => sequence.find(item => item.id === id)!);

    // Add some random wrong options if we have less than 4 options
    const wrongOptions = PATTERN_ITEMS.filter(
      item => !uniqueItems.find(ui => ui.id === item.id)
    );
    const answerOptions = [
      ...uniqueItems,
      ...wrongOptions.slice(0, Math.max(0, 4 - uniqueItems.length)),
    ].sort(() => Math.random() - 0.5); // Shuffle once and fix

    setCurrentPattern({
      sequence,
      missing: missingIndex,
      correctAnswer,
      answerOptions,
    });
    setSelectedAnswer(null);
    setIsCorrect(null);
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

  // Handle answer selection
  const handleAnswerSelect = async (item: PatternItem) => {
    if (selectedAnswer !== null) return; // Already answered

    setSelectedAnswer(item);
    const correct = item.id === currentPattern?.correctAnswer.id;
    setIsCorrect(correct);

    await playSound(correct);

    if (correct) {
      setScore(score + 1);
      triggerCelebration();
    }

    // Move to next pattern after delay
    setTimeout(() => {
      const nextPatternCount = patternsCompleted + 1;
      setPatternsCompleted(nextPatternCount);

      if (nextPatternCount >= TOTAL_PATTERNS) {
        setShowVictory(true);
      } else {
        // Increase difficulty every 2 patterns
        if (nextPatternCount % 2 === 0) {
          setDifficulty(difficulty + 1);
        }
        generatePattern();
      }
    }, 1500);
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
    setPatternsCompleted(0);
    setDifficulty(1);
    setShowVictory(false);
    generatePattern();
  };

  const handleBack = () => {
    router.push('/(tabs)');
  };

  const celebrationScale = celebration.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.3],
  });

  // Victory screen
  if (showVictory) {
    return (
      <LinearGradient
        colors={['#10B981', '#059669']}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.victoryContainer}>
            <Text style={styles.victoryEmoji}>🎉</Text>
            <Text style={styles.victoryTitle}>{t('games.patternMatch.amazing')}</Text>
            <Text style={styles.victoryMessage}>
              {t('games.patternMatch.completed', { matched: score, total: TOTAL_PATTERNS })}
            </Text>
            <Text style={styles.victoryPercentage}>
              {t('games.patternMatch.accuracy', { percentage: Math.round((score / TOTAL_PATTERNS) * 100) })}
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

  if (!currentPattern) {
    return null;
  }

  // Use the fixed answer options from state (no regeneration on render)
  const answerOptions = currentPattern.answerOptions;

  return (
    <LinearGradient
      colors={['#10B981', '#059669']}
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
              {patternsCompleted + 1}/{TOTAL_PATTERNS}
            </Text>
            <Text style={styles.pointsText}>⭐ {score}</Text>
          </View>
        </View>

        {/* Instructions */}
        <View style={styles.instructionContainer}>
          <Text style={styles.instructionText}>
            {t('games.patternMatch.instruction')}
          </Text>
        </View>

        {/* Pattern Display */}
        <View style={styles.patternWrapper}>
          {currentPattern.sequence.length <= 5 ? (
            // Single row for 5 or fewer items
            <View style={styles.patternRow}>
              {currentPattern.sequence.map((item, index) => (
                <Animated.View
                  key={index}
                  style={[
                    styles.patternItem,
                    index === currentPattern.missing && styles.patternItemMissing,
                    index === currentPattern.missing && isCorrect && {
                      transform: [{ scale: celebrationScale }],
                    },
                  ]}
                >
                  {index === currentPattern.missing ? (
                    selectedAnswer ? (
                      <Text style={styles.patternEmoji}>{selectedAnswer.emoji}</Text>
                    ) : (
                      <Text style={styles.questionMark}>?</Text>
                    )
                  ) : (
                    <Text style={styles.patternEmoji}>{item.emoji}</Text>
                  )}
                </Animated.View>
              ))}
            </View>
          ) : (
            // Two rows for 6+ items
            <>
              {/* First row */}
              <View style={styles.patternRow}>
                {currentPattern.sequence
                  .slice(0, Math.ceil(currentPattern.sequence.length / 2))
                  .map((item, index) => (
                    <Animated.View
                      key={index}
                      style={[
                        styles.patternItem,
                        index === currentPattern.missing && styles.patternItemMissing,
                        index === currentPattern.missing && isCorrect && {
                          transform: [{ scale: celebrationScale }],
                        },
                      ]}
                    >
                      {index === currentPattern.missing ? (
                        selectedAnswer ? (
                          <Text style={styles.patternEmoji}>{selectedAnswer.emoji}</Text>
                        ) : (
                          <Text style={styles.questionMark}>?</Text>
                        )
                      ) : (
                        <Text style={styles.patternEmoji}>{item.emoji}</Text>
                      )}
                    </Animated.View>
                  ))}
              </View>

              {/* Second row */}
              <View style={styles.patternRow}>
                {currentPattern.sequence
                  .slice(Math.ceil(currentPattern.sequence.length / 2))
                  .map((item, index) => {
                    const actualIndex = Math.ceil(currentPattern.sequence.length / 2) + index;
                    return (
                      <Animated.View
                        key={actualIndex}
                        style={[
                          styles.patternItem,
                          actualIndex === currentPattern.missing && styles.patternItemMissing,
                          actualIndex === currentPattern.missing && isCorrect && {
                            transform: [{ scale: celebrationScale }],
                          },
                        ]}
                      >
                        {actualIndex === currentPattern.missing ? (
                          selectedAnswer ? (
                            <Text style={styles.patternEmoji}>{selectedAnswer.emoji}</Text>
                          ) : (
                            <Text style={styles.questionMark}>?</Text>
                          )
                        ) : (
                          <Text style={styles.patternEmoji}>{item.emoji}</Text>
                        )}
                      </Animated.View>
                    );
                  })}
              </View>
            </>
          )}
        </View>

        {/* Answer Options */}
        <View style={styles.optionsContainer}>
          <Text style={styles.optionsTitle}>{t('games.patternMatch.chooseMissing')}</Text>
          <View style={styles.optionsGrid}>
            {answerOptions.map((item, index) => {
              const isSelected = selectedAnswer?.id === item.id;
              const isCorrectAnswer = item.id === currentPattern.correctAnswer.id;
              const showCorrect = selectedAnswer !== null && isCorrectAnswer;
              const showWrong = isSelected && !isCorrectAnswer;

              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionButton,
                    showCorrect && styles.optionButtonCorrect,
                    showWrong && styles.optionButtonWrong,
                  ]}
                  onPress={() => handleAnswerSelect(item)}
                  disabled={selectedAnswer !== null}
                  activeOpacity={0.7}
                >
                  <Text style={styles.optionEmoji}>{item.emoji}</Text>
                  {showCorrect && <Text style={styles.checkMark}>✓</Text>}
                  {showWrong && <Text style={styles.crossMark}>✗</Text>}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
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
  instructionContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: 'center',
  },
  instructionText: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.textInverse,
    textAlign: 'center',
  },
  patternWrapper: {
    paddingVertical: 32,
    paddingHorizontal: 20,
    alignItems: 'center',
    gap: 12,
  },
  patternRow: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
    flexWrap: 'nowrap',
  },
  patternItem: {
    width: 70,
    height: 70,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
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
  patternItemMissing: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderStyle: 'dashed',
    borderColor: 'rgba(255,255,255,0.6)',
  },
  patternEmoji: {
    fontSize: 40,
  },
  questionMark: {
    fontSize: 48,
    fontWeight: 'bold',
    color: Colors.textInverse,
    opacity: 0.7,
  },
  optionsContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  optionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textInverse,
    textAlign: 'center',
    marginBottom: 20,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
  },
  optionButton: {
    width: 80,
    height: 80,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,1)',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
  optionButtonCorrect: {
    backgroundColor: Colors.success,
    borderColor: Colors.successDark,
  },
  optionButtonWrong: {
    backgroundColor: Colors.error,
    borderColor: '#FF4444',
  },
  optionEmoji: {
    fontSize: 44,
  },
  checkMark: {
    position: 'absolute',
    top: 4,
    right: 8,
    fontSize: 24,
    color: Colors.textInverse,
    fontWeight: 'bold',
  },
  crossMark: {
    position: 'absolute',
    top: 4,
    right: 8,
    fontSize: 24,
    color: Colors.textInverse,
    fontWeight: 'bold',
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
    marginBottom: 12,
    opacity: 0.95,
  },
  victoryPercentage: {
    fontSize: 36,
    fontWeight: 'bold',
    color: Colors.textInverse,
    marginBottom: 48,
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
