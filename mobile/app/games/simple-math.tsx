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

type Operation = '+' | '-';

interface Question {
  num1: number;
  num2: number;
  operation: Operation;
  correctAnswer: number;
  options: number[];
}

/**
 * Simple Math Game
 * Practice basic addition and subtraction
 */
export default function SimpleMathGame() {
  const router = useRouter();
  const { t } = useTranslation();
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showVictory, setShowVictory] = useState(false);
  const [celebration] = useState(new Animated.Value(0));

  const TOTAL_QUESTIONS = 10;
  const MAX_NUMBER = 10; // Maximum number for operations

  // Generate a new question
  const generateQuestion = (): Question => {
    const operation: Operation = Math.random() > 0.5 ? '+' : '-';
    let num1: number;
    let num2: number;
    let correctAnswer: number;

    if (operation === '+') {
      num1 = Math.floor(Math.random() * MAX_NUMBER) + 1;
      num2 = Math.floor(Math.random() * MAX_NUMBER) + 1;
      correctAnswer = num1 + num2;
    } else {
      // For subtraction, ensure result is positive
      num1 = Math.floor(Math.random() * MAX_NUMBER) + 5;
      num2 = Math.floor(Math.random() * num1) + 1;
      correctAnswer = num1 - num2;
    }

    // Generate wrong options
    const options: number[] = [correctAnswer];
    while (options.length < 4) {
      const wrongAnswer = correctAnswer + Math.floor(Math.random() * 6) - 3;
      if (wrongAnswer >= 0 && wrongAnswer !== correctAnswer && !options.includes(wrongAnswer)) {
        options.push(wrongAnswer);
      }
    }

    // Shuffle options
    options.sort(() => Math.random() - 0.5);

    return {
      num1,
      num2,
      operation,
      correctAnswer,
      options,
    };
  };

  // Initialize game and audio
  useEffect(() => {
    // Configure audio mode for playback
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
    });
    setCurrentQuestion(generateQuestion());
  }, []);

  // Play sound feedback
  const playSound = async (correct: boolean) => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        correct
          ? require('@/assets/sounds/correct.mp3')
          : require('@/assets/sounds/wrong.mp3'),
        { volume: 1.0 } // Full volume
      );
      await sound.playAsync();
      // Unload sound after playing
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
        }
      });
    } catch (error) {
      // Sound files not found - game will work without audio
      console.log('Error loading sound:', error);
    }
  };

  // Handle answer selection
  const handleAnswerSelect = async (answer: number) => {
    if (selectedAnswer !== null) return; // Already answered

    setSelectedAnswer(answer);
    const correct = answer === currentQuestion?.correctAnswer;
    setIsCorrect(correct);

    // Play sound feedback
    await playSound(correct);

    if (correct) {
      setScore(score + 1);
      triggerCelebration();
    }

    // Move to next question after delay
    setTimeout(() => {
      const nextQuestionCount = questionsAnswered + 1;
      setQuestionsAnswered(nextQuestionCount);

      if (nextQuestionCount >= TOTAL_QUESTIONS) {
        setShowVictory(true);
      } else {
        setCurrentQuestion(generateQuestion());
        setSelectedAnswer(null);
        setIsCorrect(null);
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
    setQuestionsAnswered(0);
    setCurrentQuestion(generateQuestion());
    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowVictory(false);
  };

  const handleBack = () => {
    router.push('/(tabs)');
  };

  const celebrationScale = celebration.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.2],
  });

  if (showVictory) {
    return (
      <LinearGradient
        colors={Colors.gradients.success}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.victoryContainer}>
            <Text style={styles.victoryEmoji}>🎉</Text>
            <Text style={styles.victoryTitle}>{t('games.common.congratulations')}</Text>
            <Text style={styles.victoryMessage}>
              {t('games.simpleMath.victoryMessage', { score, total: TOTAL_QUESTIONS })}
            </Text>
            <Text style={styles.victoryPercentage}>
              {t('games.simpleMath.victoryPercentage', { percentage: Math.round((score / TOTAL_QUESTIONS) * 100) })}
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

  if (!currentQuestion) {
    return null;
  }

  return (
    <LinearGradient
      colors={Colors.gradients.success}
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
              {questionsAnswered + 1}/{TOTAL_QUESTIONS}
            </Text>
            <Text style={styles.pointsText}>⭐ {score}</Text>
          </View>
        </View>

        {/* Question */}
        <View style={styles.questionContainer}>
          <Text style={styles.questionTitle}>{t('games.simpleMath.instruction')}</Text>
          <View style={styles.equationContainer}>
            <Animated.Text
              style={[
                styles.equationText,
                isCorrect && { transform: [{ scale: celebrationScale }] },
              ]}
            >
              {currentQuestion.num1} {currentQuestion.operation} {currentQuestion.num2} = ?
            </Animated.Text>
          </View>
        </View>

        {/* Answer Options */}
        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const isCorrectAnswer = option === currentQuestion.correctAnswer;
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
                onPress={() => handleAnswerSelect(option)}
                disabled={selectedAnswer !== null}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.optionText,
                    (showCorrect || showWrong) && styles.optionTextSelected,
                  ]}
                >
                  {option}
                </Text>
                {showCorrect && <Text style={styles.checkMark}>✓</Text>}
                {showWrong && <Text style={styles.crossMark}>✗</Text>}
              </TouchableOpacity>
            );
          })}
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
  questionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  questionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.textInverse,
    marginBottom: 32,
    opacity: 0.9,
  },
  equationContainer: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 48,
    paddingVertical: 32,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  equationText: {
    fontSize: 56,
    fontWeight: 'bold',
    color: Colors.textInverse,
    textAlign: 'center',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  optionButton: {
    width: '45%',
    aspectRatio: 1.5,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
    position: 'relative',
  },
  optionButtonCorrect: {
    backgroundColor: Colors.success,
    borderColor: Colors.successDark,
  },
  optionButtonWrong: {
    backgroundColor: Colors.error,
    borderColor: '#FF4444',
  },
  optionText: {
    fontSize: 42,
    fontWeight: 'bold',
    color: Colors.textInverse,
  },
  optionTextSelected: {
    color: Colors.textInverse,
  },
  checkMark: {
    position: 'absolute',
    top: 8,
    right: 12,
    fontSize: 24,
    color: Colors.textInverse,
  },
  crossMark: {
    position: 'absolute',
    top: 8,
    right: 12,
    fontSize: 24,
    color: Colors.textInverse,
  },
  feedbackContainer: {
    position: 'absolute',
    bottom: 180,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  feedbackText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.textInverse,
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
