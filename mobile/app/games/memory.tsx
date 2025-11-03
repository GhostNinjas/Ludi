import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/Colors';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');
const CARD_SIZE = Math.min((width - 80) / 4, 80);

// Emojis de animais para as cartas
const ANIMALS = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];

// Função para tocar som de animal usando Web Audio API
const playAnimalSound = (emoji: string) => {
  if (typeof window === 'undefined' || !window.AudioContext) return;

  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  // Configurar sons diferentes para cada animal
  const soundConfig: Record<string, { freq: number; duration: number; type: OscillatorType }> = {
    '🐶': { freq: 300, duration: 0.15, type: 'square' },      // Cachorro - latido grave
    '🐱': { freq: 600, duration: 0.12, type: 'sine' },        // Gato - miado agudo
    '🐭': { freq: 800, duration: 0.08, type: 'sine' },        // Rato - som agudo
    '🐹': { freq: 700, duration: 0.1, type: 'sine' },         // Hamster - chiado
    '🐰': { freq: 500, duration: 0.1, type: 'triangle' },     // Coelho - som suave
    '🦊': { freq: 400, duration: 0.13, type: 'sawtooth' },    // Raposa - som médio
    '🐻': { freq: 200, duration: 0.2, type: 'sawtooth' },     // Urso - rugido grave
    '🐼': { freq: 350, duration: 0.15, type: 'triangle' },    // Panda - som médio-grave
  };

  const config = soundConfig[emoji] || { freq: 440, duration: 0.1, type: 'sine' as OscillatorType };

  oscillator.type = config.type;
  oscillator.frequency.setValueAtTime(config.freq, audioContext.currentTime);

  // Envelope de volume para som mais natural
  gainNode.gain.setValueAtTime(0, audioContext.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + config.duration);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + config.duration);
};

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
  flipAnim: Animated.Value;
}

// Calcula tempo de preview baseado na idade
const getPreviewTimeByAge = (age: number): number => {
  // 2 anos: 4000ms, 3 anos: 3200ms, 4 anos: 2400ms, 5 anos: 1600ms, 6+: 1000ms
  return Math.max(1000, 5000 - (age * 800));
};

export default function MemoryGame() {
  const router = useRouter();
  const { t } = useTranslation();
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const [showVictory, setShowVictory] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(true);
  const [gameKey, setGameKey] = useState(0); // Key to force re-initialization

  const victoryAnim = useRef(new Animated.Value(0)).current;

  // Inicializar o jogo
  useEffect(() => {
    initializeGame();
  }, []);

  // Preview inicial dos cards baseado na idade
  useEffect(() => {
    if (cards.length === 0) return;

    // Ativar modo preview
    setIsPreviewMode(true);

    // Virar todos os cards para mostrar
    cards.forEach((card) => {
      Animated.spring(card.flipAnim, {
        toValue: 1,
        friction: 8,
        tension: 10,
        useNativeDriver: true,
      }).start();
    });

    // Calcular tempo baseado na idade da criança
    const age = 4; // Default 4 anos (TODO: integrar com childStore quando disponível)
    const previewTime = getPreviewTimeByAge(age);

    // Após o tempo de preview, virar os cards de volta
    const timer = setTimeout(() => {
      cards.forEach((card) => {
        Animated.spring(card.flipAnim, {
          toValue: 0,
          friction: 8,
          tension: 10,
          useNativeDriver: true,
        }).start();
      });

      // Desativar modo preview após animação terminar
      setTimeout(() => {
        setIsPreviewMode(false);
      }, 500);
    }, previewTime);

    return () => clearTimeout(timer);
  }, [gameKey]); // Re-run when gameKey changes (on restart)

  const initializeGame = () => {
    // Criar pares de cartas com animação
    const pairs = ANIMALS.flatMap((emoji, index) => [
      { id: index * 2, emoji, isFlipped: false, isMatched: false, flipAnim: new Animated.Value(0) },
      { id: index * 2 + 1, emoji, isFlipped: false, isMatched: false, flipAnim: new Animated.Value(0) },
    ]);

    // Embaralhar
    const shuffled = pairs.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlippedCards([]);
    setMoves(0);
    setMatchedPairs(0);
    setShowVictory(false);
    setIsPreviewMode(true);
    victoryAnim.setValue(0);
  };

  const handleCardPress = (cardIndex: number) => {
    if (isPreviewMode) return;
    if (isChecking) return;
    if (flippedCards.includes(cardIndex)) return;
    if (cards[cardIndex]?.isMatched) return;
    if (flippedCards.length >= 2) return;

    const newFlipped = [...flippedCards, cardIndex];
    setFlippedCards(newFlipped);

    // Animar virada da carta
    const newCards = [...cards];
    newCards[cardIndex].isFlipped = true;
    setCards(newCards);

    // Tocar som do animal
    playAnimalSound(newCards[cardIndex].emoji);

    Animated.spring(newCards[cardIndex].flipAnim, {
      toValue: 1,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();

    // Verificar par quando duas cartas estão viradas
    if (newFlipped.length === 2) {
      setIsChecking(true);
      setMoves(moves + 1);

      const [firstIndex, secondIndex] = newFlipped;
      const firstCard = cards[firstIndex];
      const secondCard = cards[secondIndex];

      if (firstCard.emoji === secondCard.emoji) {
        // PAR ENCONTRADO!
        setTimeout(() => {
          const updatedCards = [...cards];
          updatedCards[firstIndex].isMatched = true;
          updatedCards[secondIndex].isMatched = true;
          setCards(updatedCards);
          setFlippedCards([]);
          setIsChecking(false);

          const newMatchedPairs = matchedPairs + 1;
          setMatchedPairs(newMatchedPairs);

          // Verificar vitória
          if (newMatchedPairs === ANIMALS.length) {
            setTimeout(() => {
              setShowVictory(true);
              Animated.spring(victoryAnim, {
                toValue: 1,
                useNativeDriver: true,
              }).start();
            }, 500);
          }
        }, 600);
      } else {
        // NÃO É PAR - desvirar
        setTimeout(() => {
          const updatedCards = [...cards];

          // Animar desvirada
          Animated.spring(updatedCards[firstIndex].flipAnim, {
            toValue: 0,
            friction: 8,
            tension: 10,
            useNativeDriver: true,
          }).start();

          Animated.spring(updatedCards[secondIndex].flipAnim, {
            toValue: 0,
            friction: 8,
            tension: 10,
            useNativeDriver: true,
          }).start();

          updatedCards[firstIndex].isFlipped = false;
          updatedCards[secondIndex].isFlipped = false;
          setCards(updatedCards);
          setFlippedCards([]);
          setIsChecking(false);
        }, 1000);
      }
    }
  };

  const handleBack = () => {
    router.push('/(tabs)');
  };

  const handleRestart = () => {
    initializeGame();
    setGameKey(prev => prev + 1); // Increment to trigger preview effect
  };

  return (
    <LinearGradient
      colors={Colors.gradients.primary}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>{t('games.common.back')}</Text>
          </TouchableOpacity>

          <View style={styles.stats}>
            <Text style={styles.statsText}>{t('games.memory.moves', { moves })}</Text>
            <Text style={styles.statsText}>{t('games.memory.pairs', { matched: matchedPairs, total: ANIMALS.length })}</Text>
          </View>

          <TouchableOpacity style={styles.restartButton} onPress={handleRestart}>
            <Text style={styles.restartButtonText}>🔄</Text>
          </TouchableOpacity>
        </View>

        {/* Título */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{t('games.memory.title')}</Text>
          <Text style={styles.subtitle}>{t('games.memory.instruction')}</Text>
        </View>

        {/* Grade de Cartas */}
        <View style={styles.grid}>
          {cards.map((card, index) => {
            // Interpolação para rotação 3D (0deg → 180deg)
            const frontRotateY = card.flipAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['0deg', '180deg'],
            });

            const backRotateY = card.flipAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['180deg', '360deg'],
            });

            // Interpolação para escala (efeito de "pulso")
            const scale = card.flipAnim.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [1, 1.05, 1],
            });

            // Opacidade da frente
            const frontOpacity = card.flipAnim.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [1, 0, 0],
            });

            // Opacidade do verso
            const backOpacity = card.flipAnim.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0, 0, 1],
            });

            return (
              <TouchableOpacity
                key={card.id}
                testID={`memory-card-${index}`}
                onPress={() => handleCardPress(index)}
                activeOpacity={0.8}
                disabled={card.isFlipped || card.isMatched || isChecking}
                style={styles.cardContainer}
              >
                {/* Frente do card (?) */}
                <Animated.View
                  style={[
                    styles.card,
                    styles.cardFront,
                    {
                      opacity: frontOpacity,
                      transform: [{ rotateY: frontRotateY }, { scale }],
                    },
                  ]}
                >
                  <Text style={styles.cardBackText}>?</Text>
                </Animated.View>

                {/* Verso do card (emoji) */}
                <Animated.View
                  style={[
                    styles.card,
                    styles.cardBack,
                    card.isMatched && styles.cardMatched,
                    {
                      opacity: backOpacity,
                      transform: [{ rotateY: backRotateY }, { scale }],
                    },
                  ]}
                >
                  <Text style={styles.cardEmoji}>{card.emoji}</Text>
                </Animated.View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Tela de Vitória */}
        {showVictory && (
          <Animated.View
            style={[
              styles.victoryOverlay,
              {
                opacity: victoryAnim,
                transform: [
                  {
                    scale: victoryAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.5, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={styles.victoryCard}>
              <Text style={styles.victoryEmoji}>🎉</Text>
              <Text style={styles.victoryTitle}>{t('games.common.congratulations')}</Text>
              <Text style={styles.victoryText}>
                {t('games.memory.victory', { moves })}
              </Text>

              <TouchableOpacity
                style={styles.playAgainButton}
                onPress={handleRestart}
              >
                <Text style={styles.playAgainText}>{t('games.common.playAgain')}</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  stats: {
    alignItems: 'center',
  },
  statsText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  restartButton: {
    padding: 8,
  },
  restartButtonText: {
    fontSize: 28,
  },
  titleContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
  } as any,
  subtitle: {
    fontSize: 18,
    color: '#FFFFFF',
    opacity: 0.9,
    marginTop: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 20,
    gap: 12,
  },
  cardContainer: {
    width: CARD_SIZE,
    height: CARD_SIZE,
  },
  card: {
    position: 'absolute',
    width: CARD_SIZE,
    height: CARD_SIZE,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    backfaceVisibility: 'hidden',
  },
  cardFront: {
    backgroundColor: '#FFFFFF',
  },
  cardBack: {
    backgroundColor: '#E3F2FD',
  },
  cardMatched: {
    backgroundColor: '#C8E6C9',
    opacity: 0.85,
  },
  cardBackText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#667eea',
  },
  cardEmoji: {
    fontSize: 48,
  },
  victoryOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  victoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    maxWidth: '85%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
  },
  victoryEmoji: {
    fontSize: 80,
    marginBottom: 16,
  },
  victoryTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: 8,
  },
  victoryText: {
    fontSize: 20,
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  victoryStats: {
    fontSize: 18,
    color: '#666',
    marginBottom: 24,
  },
  playAgainButton: {
    backgroundColor: Colors.cta,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 24,
    shadowColor: Colors.ctaDark,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  playAgainText: {
    color: Colors.textInverse,
    fontSize: 20,
    fontWeight: 'bold',
  },
});
