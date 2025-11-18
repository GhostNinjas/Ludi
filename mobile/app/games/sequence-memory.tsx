import { useState, useEffect, useRef } from 'react';
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
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';
import { Colors } from '@/constants/Colors';

type ColorId = 'red' | 'blue' | 'green' | 'yellow';

interface ColorButton {
  id: ColorId;
  color: string;
  darkColor: string;
  sound: number; // Frequency for beep sound
}

const colorButtons: ColorButton[] = [
  { id: 'red', color: '#FF3B3B', darkColor: '#CC0000', sound: 329.63 }, // E4 - Vermelho vivo
  { id: 'blue', color: '#3B82F6', darkColor: '#1E40AF', sound: 392.00 }, // G4 - Azul vivo
  { id: 'green', color: '#10B981', darkColor: '#047857', sound: 440.00 }, // A4 - Verde vivo
  { id: 'yellow', color: '#FBBF24', darkColor: '#D97706', sound: 493.88 }, // B4 - Amarelo vivo
];

/**
 * Sequence Memory Game (Simon Game)
 * Watch the sequence and repeat it!
 */
export default function SequenceMemoryGame() {
  const { t } = useTranslation();
  const router = useRouter();
  const [sequence, setSequence] = useState<ColorId[]>([]);
  const [playerSequence, setPlayerSequence] = useState<ColorId[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayerTurn, setIsPlayerTurn] = useState(false);
  const [activeButton, setActiveButton] = useState<ColorId | null>(null);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [showVictory, setShowVictory] = useState(false);
  const [celebration] = useState(new Animated.Value(0));

  const MAX_ROUNDS = 10; // Win after 10 successful rounds

  // Initialize audio
  useEffect(() => {
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
    });
  }, []);

  // Start new game
  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setShowVictory(false);
    setScore(0);
    setSequence([]);
    setPlayerSequence([]);
    addToSequence([]);
  };

  // Add new color to sequence
  const addToSequence = (currentSequence: ColorId[]) => {
    const colors: ColorId[] = ['red', 'blue', 'green', 'yellow'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const newSequence = [...currentSequence, randomColor];
    setSequence(newSequence);
    setPlayerSequence([]);
    playSequence(newSequence);
  };

  // Play the sequence
  const playSequence = async (seq: ColorId[]) => {
    setIsPlaying(true);
    setIsPlayerTurn(false);

    for (let i = 0; i < seq.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      await playButton(seq[i]);
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setIsPlaying(false);
    setIsPlayerTurn(true);
  };

  // Play button animation and sound
  const playButton = async (colorId: ColorId) => {
    setActiveButton(colorId);

    // Haptic feedback
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (error) {
      console.log('Error with haptics:', error);
    }

    const button = colorButtons.find(b => b.id === colorId);
    if (button) {
      await playTone(button.sound, 300);
    }
    await new Promise(resolve => setTimeout(resolve, 300));
    setActiveButton(null);
  };

  // Play a tone using expo-av
  const playTone = async (frequency: number, duration: number) => {
    try {
      // Map frequency to pre-recorded sound files (we'll use color-specific sounds)
      // For now, we'll use a simple beep sound that's more reliable than synthesizing
      // In production, you could add tone-{frequency}.mp3 files for each frequency

      // Since we don't have frequency-specific sounds, we'll use haptic feedback
      // and a simple sound to provide feedback
      const { sound } = await Audio.Sound.createAsync(
        require('@/assets/sounds/correct.mp3'),
        {
          volume: 0.3,
          shouldPlay: true,
        }
      );

      // Clean up after duration
      setTimeout(async () => {
        try {
          await sound.unloadAsync();
        } catch (e) {
          console.log('Error unloading sound:', e);
        }
      }, duration);

    } catch (error) {
      console.log('Error playing tone:', error);
    }
  };

  // Play feedback sound
  const playFeedbackSound = async (correct: boolean) => {
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

  // Handle player button press
  const handleButtonPress = async (colorId: ColorId) => {
    if (!isPlayerTurn || isPlaying) return;

    await playButton(colorId);

    const newPlayerSequence = [...playerSequence, colorId];
    setPlayerSequence(newPlayerSequence);

    // Check if correct
    const currentIndex = newPlayerSequence.length - 1;
    if (newPlayerSequence[currentIndex] !== sequence[currentIndex]) {
      // Wrong! Game over
      await playFeedbackSound(false);
      setGameOver(true);
      setIsPlayerTurn(false);
      return;
    }

    // Check if sequence completed
    if (newPlayerSequence.length === sequence.length) {
      setIsPlayerTurn(false);
      const newScore = score + 1;
      setScore(newScore);
      triggerCelebration();

      // Check if won
      if (newScore >= MAX_ROUNDS) {
        setTimeout(() => {
          setShowVictory(true);
        }, 1000);
      } else {
        // Add next color after delay
        setTimeout(() => {
          addToSequence(sequence);
        }, 1500);
      }
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
    startGame();
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
        colors={Colors.gradients.primary}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.victoryContainer}>
            <Text style={styles.victoryEmoji}>🎉</Text>
            <Text style={styles.victoryTitle}>{t('games.sequenceMemory.amazing')}</Text>
            <Text style={styles.victoryMessage}>
              {t('games.sequenceMemory.completed', { score })}
            </Text>
            <Text style={styles.victorySubtitle}>
              {t('games.sequenceMemory.exceptionalMemory')}
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

  // Game over screen
  if (gameOver) {
    return (
      <LinearGradient
        colors={Colors.gradients.primary}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.victoryContainer}>
            <Text style={styles.victoryEmoji}>💪</Text>
            <Text style={styles.victoryTitle}>{t('games.sequenceMemory.almostThere')}</Text>
            <Text style={styles.victoryMessage}>
              {t('games.sequenceMemory.completed', { score })}
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

  // Start screen
  if (!gameStarted) {
    return (
      <LinearGradient
        colors={Colors.gradients.primary}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.startContainer}>
            <TouchableOpacity style={styles.headerButton} onPress={handleBack}>
              <Text style={styles.headerButtonText}>{t('games.common.back')}</Text>
            </TouchableOpacity>

            <View style={styles.startContent}>
              <Text style={styles.startEmoji}>🧠</Text>
              <Text style={styles.startTitle}>{t('games.sequenceMemory.title')}</Text>
              <Text style={styles.startDescription}>
                {t('games.sequenceMemory.instruction')}
              </Text>

              <View style={styles.instructionsContainer}>
                <View style={styles.instruction}>
                  <Text style={styles.instructionNumber}>1</Text>
                  <Text style={styles.instructionText}>Observe a sequência</Text>
                </View>
                <View style={styles.instruction}>
                  <Text style={styles.instructionNumber}>2</Text>
                  <Text style={styles.instructionText}>Repita tocando as cores</Text>
                </View>
                <View style={styles.instruction}>
                  <Text style={styles.instructionNumber}>3</Text>
                  <Text style={styles.instructionText}>A cada rodada fica mais difícil!</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.startButton}
                onPress={startGame}
                activeOpacity={0.8}
              >
                <Text style={styles.startButtonText}>{t('games.sequenceMemory.start')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  // Game screen
  return (
    <LinearGradient
      colors={Colors.gradients.primary}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerButton} onPress={handleBack}>
            <Text style={styles.headerButtonText}>{t('games.common.back')}</Text>
          </TouchableOpacity>

          <Animated.View style={[styles.scoreContainer, { transform: [{ scale: celebrationScale }] }]}>
            <Text style={styles.scoreText}>{t('games.sequenceMemory.level', { level: score + 1 })}</Text>
          </Animated.View>
        </View>

        {/* Status */}
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>
            {isPlaying ? t('games.sequenceMemory.status.watch') : isPlayerTurn ? t('games.sequenceMemory.status.yourTurn') : t('games.sequenceMemory.status.prepare')}
          </Text>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${(playerSequence.length / sequence.length) * 100}%` }
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {t('games.sequenceMemory.progress', { current: playerSequence.length, total: sequence.length })}
            </Text>
          </View>
        </View>

        {/* Color buttons */}
        <View style={styles.gameContainer}>
          <View style={styles.buttonGrid}>
            {colorButtons.map((button) => (
              <TouchableOpacity
                key={button.id}
                style={[
                  styles.colorButton,
                  {
                    backgroundColor: activeButton === button.id ? button.darkColor : button.color,
                    opacity: activeButton === button.id ? 1 : 0.7,
                  },
                ]}
                onPress={() => handleButtonPress(button.id)}
                disabled={!isPlayerTurn || isPlaying}
                activeOpacity={0.9}
              />
            ))}
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
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  scoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textInverse,
  },
  statusContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  statusText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textInverse,
    marginBottom: 16,
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.textInverse,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: Colors.textInverse,
    opacity: 0.8,
  },
  gameContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  buttonGrid: {
    width: '100%',
    maxWidth: 400,
    aspectRatio: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignContent: 'space-between',
  },
  colorButton: {
    width: '48%',
    height: '48%',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  startContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  startContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startEmoji: {
    fontSize: 80,
    marginBottom: 24,
  },
  startTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.textInverse,
    marginBottom: 16,
    textAlign: 'center',
  },
  startDescription: {
    fontSize: 18,
    color: Colors.textInverse,
    opacity: 0.9,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 26,
  },
  instructionsContainer: {
    width: '100%',
    marginBottom: 40,
  },
  instruction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: 'rgba(255,255,255,0.15)',
    padding: 16,
    borderRadius: 12,
  },
  instructionNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textInverse,
    marginRight: 16,
    width: 32,
    textAlign: 'center',
  },
  instructionText: {
    flex: 1,
    fontSize: 16,
    color: Colors.textInverse,
    fontWeight: '600',
  },
  startButton: {
    backgroundColor: Colors.cta,
    paddingVertical: 18,
    paddingHorizontal: 60,
    borderRadius: 30,
    shadowColor: Colors.ctaDark,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  startButtonText: {
    fontSize: 20,
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
  victorySubtitle: {
    fontSize: 18,
    color: Colors.textInverse,
    textAlign: 'center',
    marginBottom: 48,
    opacity: 0.9,
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
