import { useState, useRef, useEffect } from 'react';
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
import Svg, { Path, Circle } from 'react-native-svg';
import { useFonts, Caveat_700Bold } from '@expo-google-fonts/caveat';
import { useTranslation } from 'react-i18next';

const { width, height } = Dimensions.get('window');
const CANVAS_SIZE = Math.min(width - 48, 400);

// Import generated letter data
import letterStrokesData from '@/app/data/letter-strokes.json';

// Alphabet - usando letras simples do A ao J
const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

// Define cada traço de cada letra como uma etapa separada
type LetterStroke = {
  path: string; // SVG path para o tracejado
  points: Array<{x: number, y: number}>; // Pontos de referência para validação
  startPoint: {x: number, y: number}; // Onde começar o traço
};

type LetterStrokes = {
  type: 'uppercase' | 'lowercase';
  strokes: LetterStroke[];
};

// Use the imported letter strokes data
const LETTER_STROKES: Record<string, LetterStrokes> = letterStrokesData as Record<string, LetterStrokes>;

// OLD HARDCODED DATA - REMOVED
/*
const LETTER_STROKES_OLD: Record<string, LetterStrokes> = {
  'A': {
    strokes: [
      // === LETRA BASTÃO ===
      // Traço 1: Diagonal esquerda (baixo para cima)
      {
        startPoint: { x: CANVAS_SIZE * 0.3, y: CANVAS_SIZE * 0.8 },
        path: `M ${CANVAS_SIZE * 0.3} ${CANVAS_SIZE * 0.8} L ${CANVAS_SIZE * 0.5} ${CANVAS_SIZE * 0.2}`,
        points: [
          { x: CANVAS_SIZE * 0.3, y: CANVAS_SIZE * 0.8 },
          { x: CANVAS_SIZE * 0.35, y: CANVAS_SIZE * 0.7 },
          { x: CANVAS_SIZE * 0.4, y: CANVAS_SIZE * 0.5 },
          { x: CANVAS_SIZE * 0.45, y: CANVAS_SIZE * 0.35 },
          { x: CANVAS_SIZE * 0.5, y: CANVAS_SIZE * 0.2 },
        ],
      },
      // Traço 2: Diagonal direita (cima para baixo)
      {
        startPoint: { x: CANVAS_SIZE * 0.5, y: CANVAS_SIZE * 0.2 },
        path: `M ${CANVAS_SIZE * 0.5} ${CANVAS_SIZE * 0.2} L ${CANVAS_SIZE * 0.7} ${CANVAS_SIZE * 0.8}`,
        points: [
          { x: CANVAS_SIZE * 0.5, y: CANVAS_SIZE * 0.2 },
          { x: CANVAS_SIZE * 0.55, y: CANVAS_SIZE * 0.35 },
          { x: CANVAS_SIZE * 0.6, y: CANVAS_SIZE * 0.5 },
          { x: CANVAS_SIZE * 0.65, y: CANVAS_SIZE * 0.7 },
          { x: CANVAS_SIZE * 0.7, y: CANVAS_SIZE * 0.8 },
        ],
      },
      // Traço 3: Linha horizontal do meio
      {
        startPoint: { x: CANVAS_SIZE * 0.35, y: CANVAS_SIZE * 0.6 },
        path: `M ${CANVAS_SIZE * 0.35} ${CANVAS_SIZE * 0.6} L ${CANVAS_SIZE * 0.65} ${CANVAS_SIZE * 0.6}`,
        points: [
          { x: CANVAS_SIZE * 0.35, y: CANVAS_SIZE * 0.6 },
          { x: CANVAS_SIZE * 0.4, y: CANVAS_SIZE * 0.6 },
          { x: CANVAS_SIZE * 0.5, y: CANVAS_SIZE * 0.6 },
          { x: CANVAS_SIZE * 0.6, y: CANVAS_SIZE * 0.6 },
          { x: CANVAS_SIZE * 0.65, y: CANVAS_SIZE * 0.6 },
        ],
      },
      // === LETRA CURSIVA (manuscrita) ===
      // Letra 'a' cursiva em um único traço contínuo
      {
        startPoint: { x: CANVAS_SIZE * 0.55, y: CANVAS_SIZE * 0.35 },
        path: `M ${CANVAS_SIZE * 0.55} ${CANVAS_SIZE * 0.35}
               C ${CANVAS_SIZE * 0.48} ${CANVAS_SIZE * 0.32} ${CANVAS_SIZE * 0.38} ${CANVAS_SIZE * 0.35} ${CANVAS_SIZE * 0.33} ${CANVAS_SIZE * 0.43}
               C ${CANVAS_SIZE * 0.3} ${CANVAS_SIZE * 0.48} ${CANVAS_SIZE * 0.3} ${CANVAS_SIZE * 0.56} ${CANVAS_SIZE * 0.33} ${CANVAS_SIZE * 0.62}
               C ${CANVAS_SIZE * 0.38} ${CANVAS_SIZE * 0.7} ${CANVAS_SIZE * 0.48} ${CANVAS_SIZE * 0.72} ${CANVAS_SIZE * 0.55} ${CANVAS_SIZE * 0.69}
               C ${CANVAS_SIZE * 0.58} ${CANVAS_SIZE * 0.67} ${CANVAS_SIZE * 0.6} ${CANVAS_SIZE * 0.62} ${CANVAS_SIZE * 0.6} ${CANVAS_SIZE * 0.56}
               C ${CANVAS_SIZE * 0.6} ${CANVAS_SIZE * 0.48} ${CANVAS_SIZE * 0.58} ${CANVAS_SIZE * 0.4} ${CANVAS_SIZE * 0.55} ${CANVAS_SIZE * 0.35}
               M ${CANVAS_SIZE * 0.6} ${CANVAS_SIZE * 0.35}
               L ${CANVAS_SIZE * 0.6} ${CANVAS_SIZE * 0.75}`,
        points: [
          // Começa no topo direito
          { x: CANVAS_SIZE * 0.55, y: CANVAS_SIZE * 0.35 },
          // Curva para a esquerda (topo do círculo)
          { x: CANVAS_SIZE * 0.5, y: CANVAS_SIZE * 0.33 },
          { x: CANVAS_SIZE * 0.43, y: CANVAS_SIZE * 0.35 },
          { x: CANVAS_SIZE * 0.38, y: CANVAS_SIZE * 0.38 },
          // Lado esquerdo do círculo
          { x: CANVAS_SIZE * 0.33, y: CANVAS_SIZE * 0.43 },
          { x: CANVAS_SIZE * 0.31, y: CANVAS_SIZE * 0.48 },
          { x: CANVAS_SIZE * 0.3, y: CANVAS_SIZE * 0.52 },
          { x: CANVAS_SIZE * 0.31, y: CANVAS_SIZE * 0.56 },
          // Base do círculo
          { x: CANVAS_SIZE * 0.33, y: CANVAS_SIZE * 0.62 },
          { x: CANVAS_SIZE * 0.38, y: CANVAS_SIZE * 0.68 },
          { x: CANVAS_SIZE * 0.43, y: CANVAS_SIZE * 0.71 },
          { x: CANVAS_SIZE * 0.48, y: CANVAS_SIZE * 0.72 },
          // Curva para a direita
          { x: CANVAS_SIZE * 0.52, y: CANVAS_SIZE * 0.71 },
          { x: CANVAS_SIZE * 0.55, y: CANVAS_SIZE * 0.69 },
          { x: CANVAS_SIZE * 0.57, y: CANVAS_SIZE * 0.66 },
          { x: CANVAS_SIZE * 0.59, y: CANVAS_SIZE * 0.62 },
          // Lado direito subindo
          { x: CANVAS_SIZE * 0.6, y: CANVAS_SIZE * 0.56 },
          { x: CANVAS_SIZE * 0.6, y: CANVAS_SIZE * 0.48 },
          { x: CANVAS_SIZE * 0.59, y: CANVAS_SIZE * 0.42 },
          { x: CANVAS_SIZE * 0.57, y: CANVAS_SIZE * 0.38 },
          { x: CANVAS_SIZE * 0.55, y: CANVAS_SIZE * 0.35 },
          // Haste direita descendo
          { x: CANVAS_SIZE * 0.6, y: CANVAS_SIZE * 0.35 },
          { x: CANVAS_SIZE * 0.6, y: CANVAS_SIZE * 0.45 },
          { x: CANVAS_SIZE * 0.6, y: CANVAS_SIZE * 0.55 },
          { x: CANVAS_SIZE * 0.6, y: CANVAS_SIZE * 0.65 },
          { x: CANVAS_SIZE * 0.6, y: CANVAS_SIZE * 0.75 },
        ],
      },
    ],
  },
};
*/

// Letter paths - simplified paths for each letter (centered in canvas)
// These are reference points that define the key areas of each letter
const LETTER_REFERENCE_POINTS: Record<string, Array<{x: number, y: number}>> = {
  'A': [
    // Left stroke (bottom to top)
    { x: CANVAS_SIZE * 0.3, y: CANVAS_SIZE * 0.8 },
    { x: CANVAS_SIZE * 0.4, y: CANVAS_SIZE * 0.5 },
    { x: CANVAS_SIZE * 0.5, y: CANVAS_SIZE * 0.2 },
    // Right stroke (top to bottom)
    { x: CANVAS_SIZE * 0.6, y: CANVAS_SIZE * 0.5 },
    { x: CANVAS_SIZE * 0.7, y: CANVAS_SIZE * 0.8 },
    // Middle horizontal line
    { x: CANVAS_SIZE * 0.35, y: CANVAS_SIZE * 0.6 },
    { x: CANVAS_SIZE * 0.5, y: CANVAS_SIZE * 0.6 },
    { x: CANVAS_SIZE * 0.65, y: CANVAS_SIZE * 0.6 },
  ],
  'B': [
    // Vertical line
    { x: CANVAS_SIZE * 0.3, y: CANVAS_SIZE * 0.2 },
    { x: CANVAS_SIZE * 0.3, y: CANVAS_SIZE * 0.5 },
    { x: CANVAS_SIZE * 0.3, y: CANVAS_SIZE * 0.8 },
    // Top curve
    { x: CANVAS_SIZE * 0.4, y: CANVAS_SIZE * 0.2 },
    { x: CANVAS_SIZE * 0.5, y: CANVAS_SIZE * 0.25 },
    { x: CANVAS_SIZE * 0.55, y: CANVAS_SIZE * 0.35 },
    { x: CANVAS_SIZE * 0.5, y: CANVAS_SIZE * 0.45 },
    { x: CANVAS_SIZE * 0.4, y: CANVAS_SIZE * 0.5 },
    // Bottom curve
    { x: CANVAS_SIZE * 0.45, y: CANVAS_SIZE * 0.5 },
    { x: CANVAS_SIZE * 0.6, y: CANVAS_SIZE * 0.55 },
    { x: CANVAS_SIZE * 0.65, y: CANVAS_SIZE * 0.65 },
    { x: CANVAS_SIZE * 0.6, y: CANVAS_SIZE * 0.75 },
    { x: CANVAS_SIZE * 0.4, y: CANVAS_SIZE * 0.8 },
  ],
  'C': [
    // Arc from top to bottom
    { x: CANVAS_SIZE * 0.65, y: CANVAS_SIZE * 0.25 },
    { x: CANVAS_SIZE * 0.5, y: CANVAS_SIZE * 0.2 },
    { x: CANVAS_SIZE * 0.35, y: CANVAS_SIZE * 0.3 },
    { x: CANVAS_SIZE * 0.3, y: CANVAS_SIZE * 0.5 },
    { x: CANVAS_SIZE * 0.35, y: CANVAS_SIZE * 0.7 },
    { x: CANVAS_SIZE * 0.5, y: CANVAS_SIZE * 0.8 },
    { x: CANVAS_SIZE * 0.65, y: CANVAS_SIZE * 0.75 },
  ],
  'D': [
    // Vertical line
    { x: CANVAS_SIZE * 0.3, y: CANVAS_SIZE * 0.2 },
    { x: CANVAS_SIZE * 0.3, y: CANVAS_SIZE * 0.5 },
    { x: CANVAS_SIZE * 0.3, y: CANVAS_SIZE * 0.8 },
    // Arc
    { x: CANVAS_SIZE * 0.4, y: CANVAS_SIZE * 0.2 },
    { x: CANVAS_SIZE * 0.55, y: CANVAS_SIZE * 0.25 },
    { x: CANVAS_SIZE * 0.65, y: CANVAS_SIZE * 0.35 },
    { x: CANVAS_SIZE * 0.7, y: CANVAS_SIZE * 0.5 },
    { x: CANVAS_SIZE * 0.65, y: CANVAS_SIZE * 0.65 },
    { x: CANVAS_SIZE * 0.55, y: CANVAS_SIZE * 0.75 },
    { x: CANVAS_SIZE * 0.4, y: CANVAS_SIZE * 0.8 },
  ],
  'E': [
    // Vertical line
    { x: CANVAS_SIZE * 0.3, y: CANVAS_SIZE * 0.2 },
    { x: CANVAS_SIZE * 0.3, y: CANVAS_SIZE * 0.5 },
    { x: CANVAS_SIZE * 0.3, y: CANVAS_SIZE * 0.8 },
    // Top horizontal
    { x: CANVAS_SIZE * 0.4, y: CANVAS_SIZE * 0.2 },
    { x: CANVAS_SIZE * 0.6, y: CANVAS_SIZE * 0.2 },
    // Middle horizontal
    { x: CANVAS_SIZE * 0.4, y: CANVAS_SIZE * 0.5 },
    { x: CANVAS_SIZE * 0.55, y: CANVAS_SIZE * 0.5 },
    // Bottom horizontal
    { x: CANVAS_SIZE * 0.4, y: CANVAS_SIZE * 0.8 },
    { x: CANVAS_SIZE * 0.6, y: CANVAS_SIZE * 0.8 },
  ],
  'F': [
    // Vertical line
    { x: CANVAS_SIZE * 0.35, y: CANVAS_SIZE * 0.2 },
    { x: CANVAS_SIZE * 0.35, y: CANVAS_SIZE * 0.5 },
    { x: CANVAS_SIZE * 0.35, y: CANVAS_SIZE * 0.8 },
    // Top horizontal
    { x: CANVAS_SIZE * 0.4, y: CANVAS_SIZE * 0.2 },
    { x: CANVAS_SIZE * 0.6, y: CANVAS_SIZE * 0.2 },
    // Middle horizontal
    { x: CANVAS_SIZE * 0.4, y: CANVAS_SIZE * 0.5 },
    { x: CANVAS_SIZE * 0.55, y: CANVAS_SIZE * 0.5 },
  ],
  'G': [
    // Arc (like C)
    { x: CANVAS_SIZE * 0.65, y: CANVAS_SIZE * 0.25 },
    { x: CANVAS_SIZE * 0.5, y: CANVAS_SIZE * 0.2 },
    { x: CANVAS_SIZE * 0.35, y: CANVAS_SIZE * 0.3 },
    { x: CANVAS_SIZE * 0.3, y: CANVAS_SIZE * 0.5 },
    { x: CANVAS_SIZE * 0.35, y: CANVAS_SIZE * 0.7 },
    { x: CANVAS_SIZE * 0.5, y: CANVAS_SIZE * 0.8 },
    { x: CANVAS_SIZE * 0.65, y: CANVAS_SIZE * 0.75 },
    // Horizontal bar
    { x: CANVAS_SIZE * 0.65, y: CANVAS_SIZE * 0.6 },
    { x: CANVAS_SIZE * 0.5, y: CANVAS_SIZE * 0.6 },
  ],
  'H': [
    // Left vertical
    { x: CANVAS_SIZE * 0.3, y: CANVAS_SIZE * 0.2 },
    { x: CANVAS_SIZE * 0.3, y: CANVAS_SIZE * 0.5 },
    { x: CANVAS_SIZE * 0.3, y: CANVAS_SIZE * 0.8 },
    // Middle horizontal
    { x: CANVAS_SIZE * 0.4, y: CANVAS_SIZE * 0.5 },
    { x: CANVAS_SIZE * 0.6, y: CANVAS_SIZE * 0.5 },
    // Right vertical
    { x: CANVAS_SIZE * 0.7, y: CANVAS_SIZE * 0.2 },
    { x: CANVAS_SIZE * 0.7, y: CANVAS_SIZE * 0.5 },
    { x: CANVAS_SIZE * 0.7, y: CANVAS_SIZE * 0.8 },
  ],
  'I': [
    // Top horizontal
    { x: CANVAS_SIZE * 0.4, y: CANVAS_SIZE * 0.2 },
    { x: CANVAS_SIZE * 0.5, y: CANVAS_SIZE * 0.2 },
    { x: CANVAS_SIZE * 0.6, y: CANVAS_SIZE * 0.2 },
    // Vertical line
    { x: CANVAS_SIZE * 0.5, y: CANVAS_SIZE * 0.3 },
    { x: CANVAS_SIZE * 0.5, y: CANVAS_SIZE * 0.5 },
    { x: CANVAS_SIZE * 0.5, y: CANVAS_SIZE * 0.7 },
    // Bottom horizontal
    { x: CANVAS_SIZE * 0.4, y: CANVAS_SIZE * 0.8 },
    { x: CANVAS_SIZE * 0.5, y: CANVAS_SIZE * 0.8 },
    { x: CANVAS_SIZE * 0.6, y: CANVAS_SIZE * 0.8 },
  ],
  'J': [
    // Top horizontal
    { x: CANVAS_SIZE * 0.35, y: CANVAS_SIZE * 0.2 },
    { x: CANVAS_SIZE * 0.5, y: CANVAS_SIZE * 0.2 },
    { x: CANVAS_SIZE * 0.65, y: CANVAS_SIZE * 0.2 },
    // Vertical line
    { x: CANVAS_SIZE * 0.5, y: CANVAS_SIZE * 0.3 },
    { x: CANVAS_SIZE * 0.5, y: CANVAS_SIZE * 0.5 },
    { x: CANVAS_SIZE * 0.5, y: CANVAS_SIZE * 0.7 },
    // Bottom curve
    { x: CANVAS_SIZE * 0.45, y: CANVAS_SIZE * 0.75 },
    { x: CANVAS_SIZE * 0.35, y: CANVAS_SIZE * 0.75 },
    { x: CANVAS_SIZE * 0.3, y: CANVAS_SIZE * 0.7 },
  ],
};

/**
 * Trace Letters Game
 * Educational game where children trace letters with their finger
 */
export default function TraceLettersGame() {
  const router = useRouter();
  const { t } = useTranslation();
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [currentStrokeIndex, setCurrentStrokeIndex] = useState(0);
  const [completedStrokes, setCompletedStrokes] = useState<string[]>([]);
  const [rocketPosition, setRocketPosition] = useState<{x: number, y: number} | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [currentPathProgress, setCurrentPathProgress] = useState(0);
  const [score, setScore] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const successAnim = useRef(new Animated.Value(0)).current;
  const rocketAnim = useRef(new Animated.Value(1)).current;

  const currentLetter = LETTERS[currentLetterIndex];

  // Usar apenas letras maiúsculas (bastão)
  const letterKey = currentLetter;
  const letterStrokes = LETTER_STROKES[letterKey];
  const currentStroke = letterStrokes?.strokes[currentStrokeIndex];
  const totalStrokes = letterStrokes?.strokes.length || 0;

  // Carregar fonte cursiva
  const [fontsLoaded] = useFonts({
    Caveat_700Bold,
  });

  // Inicializar posição do foguete no início do traço
  useEffect(() => {
    if (currentStroke && !isDragging) {
      setRocketPosition(currentStroke.startPoint);
      setCurrentPathProgress(0);
    }
  }, [currentStrokeIndex, currentLetterIndex]);

  // Animar o foguete (pulsar levemente)
  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(rocketAnim, {
          toValue: 1.15,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(rocketAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  const getCoordinates = (event: any) => {
    const rect = event.currentTarget.getBoundingClientRect();

    // Para touch events nativos (mobile)
    if (event.nativeEvent.locationX !== undefined) {
      return {
        x: event.nativeEvent.locationX,
        y: event.nativeEvent.locationY
      };
    }

    // Para touch events no navegador (trackpad/touchscreen)
    if (event.nativeEvent.touches && event.nativeEvent.touches.length > 0) {
      const touch = event.nativeEvent.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      };
    }

    // Para mouse events (web)
    const clientX = event.clientX ?? event.nativeEvent?.clientX ?? event.pageX ?? event.nativeEvent?.pageX;
    const clientY = event.clientY ?? event.nativeEvent?.clientY ?? event.pageY ?? event.nativeEvent?.pageY;

    if (clientX !== undefined && clientY !== undefined) {
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    }

    console.error('Could not get coordinates from event:', {
      type: event.type,
      nativeEventType: event.nativeEvent?.type,
      hasLocationX: event.nativeEvent?.locationX !== undefined,
      hasTouches: !!event.nativeEvent?.touches,
      hasClientX: clientX !== undefined
    });

    return { x: 0, y: 0 };
  };

  // Encontrar o ponto mais próximo no caminho (traço)
  const findClosestPointOnPath = (touchPoint: {x: number, y: number}): {point: {x: number, y: number}, progress: number} | null => {
    if (!currentStroke) return null;

    let closestPoint = currentStroke.points[0];
    let minDistance = Infinity;
    let closestIndex = 0;

    // Encontrar o ponto mais próximo no caminho
    for (let i = 0; i < currentStroke.points.length; i++) {
      const point = currentStroke.points[i];
      const dx = touchPoint.x - point.x;
      const dy = touchPoint.y - point.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < minDistance) {
        minDistance = distance;
        closestPoint = point;
        closestIndex = i;
      }
    }

    // Só permite se estiver próximo o suficiente (raio de tolerância)
    const MAX_DISTANCE = 80;
    if (minDistance > MAX_DISTANCE) {
      return null;
    }

    // Calcular progresso no caminho (0 a 1)
    const progress = closestIndex / (currentStroke.points.length - 1);

    return { point: closestPoint, progress };
  };

  const handleRocketStart = (event: any) => {
    const { x, y } = getCoordinates(event);

    // Verificar se tocou próximo ao foguete
    if (rocketPosition) {
      const dx = x - rocketPosition.x;
      const dy = y - rocketPosition.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Área de toque do foguete
      if (distance < 50) {
        setIsDragging(true);
      }
    }
  };

  const handleRocketMove = (event: any) => {
    if (!isDragging || !currentStroke) return;

    const { x, y } = getCoordinates(event);
    const result = findClosestPointOnPath({ x, y });

    if (result) {
      // Só permite avançar no caminho, não voltar
      if (result.progress >= currentPathProgress) {
        setRocketPosition(result.point);
        setCurrentPathProgress(result.progress);
      }
    }
  };

  const handleRocketEnd = () => {
    if (!isDragging) return;

    setIsDragging(false);

    // Verificar se completou o traço (chegou ao final)
    if (currentPathProgress >= 0.95) {
      handleStrokeComplete();
    }
  };

  const handleStrokeComplete = () => {
    // Salvar o traço completado
    if (currentStroke) {
      setCompletedStrokes(prev => [...prev, currentStroke.path]);
    }

    // Verificar se completou todos os traços da letra
    if (currentStrokeIndex + 1 >= totalStrokes) {
      // Completou a letra! Mostrar "Muito Bem!" e avançar para próxima letra
      setShowSuccess(true);
      setScore(score + 1);

      Animated.sequence([
        Animated.spring(successAnim, {
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.timing(successAnim, {
          toValue: 0,
          duration: 300,
          delay: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShowSuccess(false);
        setTimeout(() => {
          handleNextLetter();
        }, 300);
      });
    } else {
      // Avançar para o próximo traço
      setTimeout(() => {
        handleNextStroke();
      }, 300);
    }
  };

  const handleNextStroke = () => {
    setCurrentStrokeIndex(currentStrokeIndex + 1);
    setCurrentPathProgress(0);
  };

  const handleNextLetter = () => {
    setCurrentStrokeIndex(0);
    setCompletedStrokes([]);
    setCurrentPathProgress(0);

    if (currentLetterIndex < LETTERS.length - 1) {
      setCurrentLetterIndex(currentLetterIndex + 1);
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Game complete
      setCurrentLetterIndex(0);
      setScore(0);
    }
  };

  const handleSkip = () => {
    handleNextLetter();
  };

  const handleReset = () => {
    setCurrentPathProgress(0);
    if (currentStroke) {
      setRocketPosition(currentStroke.startPoint);
    }
  };

  const handleBack = () => {
    router.push('/(tabs)');
  };

  return (
    <LinearGradient
      colors={Colors.gradients.warm}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>{t('games.common.back')}</Text>
          </TouchableOpacity>
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreLabel}>{t('games.stars')}</Text>
            <Text style={styles.scoreText}>{score}</Text>
          </View>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          {/* Instructions */}
          <Text style={styles.instructions}>
            {t('games.traceLetters.instruction')} {currentLetter} - {t('games.level')} {currentStrokeIndex + 1}/{totalStrokes}
          </Text>

          {/* Drawing Canvas */}
          <View style={styles.canvasContainer}>
            <View
              style={styles.canvas}
              onTouchStart={handleRocketStart}
              onTouchMove={handleRocketMove}
              onTouchEnd={handleRocketEnd}
              {...({
                onMouseDown: handleRocketStart,
                onMouseMove: handleRocketMove,
                onMouseUp: handleRocketEnd,
                onMouseLeave: handleRocketEnd,
              } as any)}
            >
              {/* SVG for drawing */}
              {currentStroke && letterStrokes && (
                <Svg
                  width={CANVAS_SIZE}
                  height={CANVAS_SIZE}
                  viewBox="0 0 400 400"
                  style={styles.svg}
                >
                  {/* Letter background - apenas o stroke ATUAL como guia semi-transparente */}
                  <Path
                    d={currentStroke.path}
                    stroke="rgba(255, 255, 255, 0.15)"
                    strokeWidth="50"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Tracejado do traço atual (bolinhas brancas ao longo do caminho) */}
                  {currentStroke.points.map((point, idx) => {
                    // Mostrar bolinhas a cada 3 pontos para densidade ideal
                    if (idx % 3 !== 0) return null;

                    return (
                      <Circle
                        key={`dot-${idx}`}
                        cx={point.x}
                        cy={point.y}
                        r="4"
                        fill="rgba(255, 255, 255, 0.6)"
                      />
                    );
                  })}

                  {/* Círculo de início (verde, maior e pulsante) */}
                  {currentStroke.points.length > 0 && (
                    <>
                      <Circle
                        cx={currentStroke.points[0].x}
                        cy={currentStroke.points[0].y}
                        r="16"
                        fill="rgba(76, 175, 80, 0.3)"
                      />
                      <Circle
                        cx={currentStroke.points[0].x}
                        cy={currentStroke.points[0].y}
                        r="10"
                        fill="rgba(76, 175, 80, 0.8)"
                      />
                    </>
                  )}

                  {/* Círculo de fim (vermelho, menor) */}
                  {currentStroke.points.length > 0 && (
                    <Circle
                      cx={currentStroke.points[currentStroke.points.length - 1].x}
                      cy={currentStroke.points[currentStroke.points.length - 1].y}
                      r="8"
                      fill="rgba(244, 67, 54, 0.6)"
                    />
                  )}

                  {/* Traços completados anteriormente (sólidos verdes) */}
                  {completedStrokes.map((strokePath, index) => (
                    <Path
                      key={index}
                      d={strokePath}
                      stroke="rgba(76, 175, 80, 0.9)"
                      strokeWidth="16"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  ))}

                  {/* Traço percorrido pelo foguete (progresso gradual) */}
                  {currentPathProgress > 0 && (() => {
                    // Criar um path apenas com os pontos já percorridos
                    const pointsToShow = Math.ceil(currentStroke.points.length * currentPathProgress);
                    const visitedPoints = currentStroke.points.slice(0, pointsToShow);

                    if (visitedPoints.length < 2) return null;

                    // Construir o path SVG com os pontos visitados
                    let progressPath = `M ${visitedPoints[0].x} ${visitedPoints[0].y}`;
                    for (let i = 1; i < visitedPoints.length; i++) {
                      progressPath += ` L ${visitedPoints[i].x} ${visitedPoints[i].y}`;
                    }

                    return (
                      <Path
                        d={progressPath}
                        stroke="rgba(76, 175, 80, 0.9)"
                        strokeWidth="16"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    );
                  })()}
                </Svg>
              )}

              {/* Foguete - draggable only on the path */}
              {rocketPosition && (
                <Animated.View
                  style={[
                    styles.rocket,
                    {
                      left: rocketPosition.x - 30,
                      top: rocketPosition.y - 30,
                      transform: [
                        { scale: rocketAnim },
                        { scale: isDragging ? 1.2 : 1 },
                      ],
                    },
                  ]}
                  pointerEvents="none"
                >
                  <Text style={styles.rocketEmoji}>🚀</Text>
                </Animated.View>
              )}
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.resetButton]}
              onPress={handleReset}
            >
              <Text style={styles.actionButtonText}>🔄 Recomeçar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.skipButton]}
              onPress={handleSkip}
            >
              <Text style={styles.actionButtonText}>⏭️ Pular</Text>
            </TouchableOpacity>
          </View>

          {/* Progress */}
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>
              Letra {currentLetterIndex + 1} de {LETTERS.length}
            </Text>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${((currentLetterIndex + 1) / LETTERS.length) * 100}%`,
                  },
                ]}
              />
            </View>
          </View>
        </View>

        {/* Success Overlay */}
        {showSuccess && (
          <Animated.View
            style={[
              styles.successOverlay,
              {
                opacity: successAnim,
                transform: [
                  {
                    scale: successAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.5, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={styles.successEmoji}>🎉</Text>
            <Text style={styles.successText}>{t('games.traceLetters.wellDone')}</Text>
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
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  scoreContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  scoreText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 40,
  },
  instructions: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginVertical: 16,
  },
  canvasContainer: {
    width: CANVAS_SIZE,
    alignItems: 'center',
  },
  canvas: {
    width: CANVAS_SIZE,
    height: CANVAS_SIZE,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.4)',
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    // Prevent page scrolling during touch interactions on mobile
    touchAction: 'none',
  } as any,
  letterOverlay: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  letterToTrace: {
    fontSize: 280,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'System',
  },
  cursiveLetter: {
    fontSize: 320,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Caveat_700Bold',
  },
  rocket: {
    position: 'absolute',
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  rocketEmoji: {
    fontSize: 50,
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
  } as any,
  svg: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  actionButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 120,
  },
  resetButton: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  skipButton: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  continueButton: {
    backgroundColor: 'rgba(255,255,255,0.5)',
    minWidth: 200,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  progressContainer: {
    width: '100%',
    marginTop: 20,
  },
  progressText: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
  },
  successOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  successEmoji: {
    fontSize: 100,
    marginBottom: 16,
  },
  successText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
  } as any,
});
