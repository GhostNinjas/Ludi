import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';
import { Colors } from '@/constants/Colors';
import { MINI_GAMES } from '@/constants/Games';
import { GameHeader } from '@/components/GameHeader';
import { VictoryScreen } from '@/components/VictoryScreen';
import { GameButton } from '@/components/GameButton';

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
  const gameInfo = MINI_GAMES.find(g => g.id === 'sequence-memory');
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

  const handlePlayAgain = () => {
    startGame();
  };

  const handleHome = () => {
    router.push('/(tabs)');
  };

  const calculateStars = (): 1 | 2 | 3 => {
    if (score >= MAX_ROUNDS) return 3; // Perfect - completed all rounds
    if (score >= 7) return 2; // Good
    return 1; // Try again
  };

  const celebrationScale = celebration.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.2],
  });

  // Start screen
  if (!gameStarted) {
    return (
      <View style={styles.container}>
        <GameHeader
          title={gameInfo?.title || t('games.sequenceMemory.title')}
          emoji={gameInfo?.emoji || '🧠'}
          gradient={gameInfo?.gradient || Colors.gradients.ocean}
        />

        <LinearGradient
          colors={[Colors.background, Colors.surfaceElevated]}
          style={styles.content}
        >
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

            <GameButton
              variant="gradient"
              gradient={gameInfo?.gradient || Colors.gradients.ocean}
              size="large"
              onPress={startGame}
            >
              {t('games.sequenceMemory.start')}
            </GameButton>
          </View>
        </LinearGradient>
      </View>
    );
  }

  // Game screen
  return (
    <View style={styles.container}>
      <GameHeader
        title={gameInfo?.title || t('games.sequenceMemory.title')}
        emoji={gameInfo?.emoji || '🧠'}
        gradient={gameInfo?.gradient || Colors.gradients.ocean}
        score={score}
      />

      <LinearGradient
        colors={[Colors.background, Colors.surfaceElevated]}
        style={styles.content}
      >

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
      </LinearGradient>

      <VictoryScreen
        visible={showVictory || gameOver}
        score={score}
        stars={calculateStars()}
        message={showVictory ? t('games.sequenceMemory.amazing') : t('games.sequenceMemory.almostThere')}
        onPlayAgain={handlePlayAgain}
        onHome={handleHome}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
  },
  statusContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  statusText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.vibrant.electricBlue,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: Colors.textSecondary,
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
  startContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  startEmoji: {
    fontSize: 80,
    marginBottom: 24,
  },
  startTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  startDescription: {
    fontSize: 18,
    color: Colors.textSecondary,
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
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.vibrant.electricBlue + '20',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  instructionNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.vibrant.electricBlue,
    marginRight: 16,
    width: 32,
    textAlign: 'center',
  },
  instructionText: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    fontWeight: '600',
  },
});
