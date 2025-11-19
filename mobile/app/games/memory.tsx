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
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/Colors';
import { MINI_GAMES } from '@/constants/Games';
import { useTranslation } from 'react-i18next';
import { GameHeader } from '@/components/GameHeader';
import { VictoryScreen } from '@/components/VictoryScreen';
import { GameButton } from '@/components/GameButton';

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
  const gameInfo = MINI_GAMES.find(g => g.id === 'memory');
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const [showVictory, setShowVictory] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(true);
  const [gameKey, setGameKey] = useState(0); // Key to force re-initialization

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
  }, [cards.length, gameKey]); // Re-run when cards are initialized or gameKey changes

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

  const handlePlayAgain = () => {
    initializeGame();
    setGameKey(prev => prev + 1); // Increment to trigger preview effect
  };

  const handleHome = () => {
    router.push('/(tabs)');
  };

  const calculateStars = (): 1 | 2 | 3 => {
    // Calculate stars based on moves
    const perfectMoves = ANIMALS.length; // 8 pairs = 8 moves
    if (moves <= perfectMoves) return 3;
    if (moves <= perfectMoves * 1.5) return 2;
    return 1;
  };

  return (
    <View style={styles.container}>
      <GameHeader
        title={gameInfo?.title || t('games.memory.title')}
        emoji={gameInfo?.emoji || '🃏'}
        gradient={gameInfo?.gradient || Colors.gradients.memory}
      />

      <LinearGradient
        colors={[Colors.background, Colors.surfaceElevated]}
        style={styles.content}
      >

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

        {/* Stats Display */}
        <View style={styles.statsContainer}>
          <View style={styles.statBadge}>
            <Text style={styles.statLabel}>{t('games.memory.moves', { moves })}</Text>
          </View>
          <View style={styles.statBadge}>
            <Text style={styles.statLabel}>
              {t('games.memory.pairs', { matched: matchedPairs, total: ANIMALS.length })}
            </Text>
          </View>
        </View>
      </LinearGradient>

      <VictoryScreen
        visible={showVictory}
        score={moves}
        stars={calculateStars()}
        message={t('games.common.congratulations')}
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
    paddingTop: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  statBadge: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.vibrant.electricBlue + '30',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 20,
    gap: 12,
    marginTop: 8,
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
    backgroundColor: Colors.vibrant.happyGreen + '40',
    opacity: 0.9,
  },
  cardBackText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: Colors.vibrant.purplePower,
  },
  cardEmoji: {
    fontSize: 48,
  },
});
