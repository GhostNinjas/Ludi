import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { Colors } from '@/constants/Colors';

// Helper para haptics que funciona em todas as plataformas
const triggerHaptic = async (style: 'light' | 'medium' | 'heavy' | 'success' | 'error' = 'medium') => {
  try {
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      const Haptics = await import('expo-haptics');
      if (style === 'success' || style === 'error') {
        await Haptics.notificationAsync(
          style === 'success'
            ? Haptics.NotificationFeedbackType.Success
            : Haptics.NotificationFeedbackType.Error
        );
      } else {
        const feedbackStyle =
          style === 'light' ? Haptics.ImpactFeedbackStyle.Light :
          style === 'heavy' ? Haptics.ImpactFeedbackStyle.Heavy :
          Haptics.ImpactFeedbackStyle.Medium;
        await Haptics.impactAsync(feedbackStyle);
      }
    }
  } catch (error) {
    // Silently fail on web or if haptics not available
  }
};

// Função para converter hex para RGB
const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
};

// Função para converter RGB para hex
const rgbToHex = (r: number, g: number, b: number): string => {
  return '#' + [r, g, b].map(x => {
    const hex = Math.round(x).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
};

// Função para misturar cores usando média ponderada RGB
const mixColors = (colors: ColorData[]): ColorData => {
  if (colors.length === 0) {
    return { name: 'Nenhuma', color: '#CCCCCC', emoji: '⚪' };
  }

  if (colors.length === 1) {
    return colors[0];
  }

  // Converter todas as cores para RGB
  const rgbColors = colors.map(c => hexToRgb(c.color));

  // Calcular média dos componentes RGB
  const avgR = rgbColors.reduce((sum, c) => sum + c.r, 0) / rgbColors.length;
  const avgG = rgbColors.reduce((sum, c) => sum + c.g, 0) / rgbColors.length;
  const avgB = rgbColors.reduce((sum, c) => sum + c.b, 0) / rgbColors.length;

  const mixedHex = rgbToHex(avgR, avgG, avgB);

  // Tentar encontrar um nome para a cor misturada
  const colorNames = colors.map(c => c.name).join(' + ');
  const shortName = getColorName(mixedHex, colors);

  return {
    name: shortName || colorNames,
    color: mixedHex,
    emoji: '🎨',
  };
};

// Função para dar nome às cores baseado no resultado
const getColorName = (hex: string, sourceColors: ColorData[]): string => {
  const rgb = hexToRgb(hex);
  const { r, g, b } = rgb;

  // Detectar tons de cinza
  const isGrayish = Math.abs(r - g) < 30 && Math.abs(g - b) < 30 && Math.abs(r - b) < 30;
  if (isGrayish) {
    if (r < 50) return 'Preto';
    if (r > 200) return 'Branco';
    if (r < 120) return 'Cinza Escuro';
    return 'Cinza';
  }

  // Detectar marrom (baixa saturação com vermelho/amarelo)
  if (r > 100 && g > 50 && b < 100 && r > b && g > b) {
    if (r > 150) return 'Marrom Claro';
    return 'Marrom';
  }

  // Detectar cores por dominância
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const saturation = max - min;

  // Baixa saturação = tons pastel
  const isPastel = max > 180 && saturation < 100;

  // Vermelho dominante
  if (r === max && r > 100) {
    if (g > 150 && b < 100) return isPastel ? 'Laranja Claro' : 'Laranja';
    if (b > 150) return isPastel ? 'Rosa' : 'Magenta';
    if (g > 100 && b > 100) return 'Rosa Claro';
    return isPastel ? 'Rosa' : 'Vermelho';
  }

  // Verde dominante
  if (g === max && g > 100) {
    if (b > 150 && r < 100) return isPastel ? 'Ciano' : 'Azul Esverdeado';
    if (r > 150) return isPastel ? 'Amarelo Claro' : 'Amarelo';
    return isPastel ? 'Verde Claro' : 'Verde';
  }

  // Azul dominante
  if (b === max && b > 100) {
    if (r > 150 && g < 100) return isPastel ? 'Lavanda' : 'Roxo';
    if (r > 100 && g > 100) return 'Azul Claro';
    return isPastel ? 'Azul Claro' : 'Azul';
  }

  // Amarelo
  if (r > 200 && g > 200 && b < 100) {
    return 'Amarelo';
  }

  return 'Cor Mista';
};

const { width } = Dimensions.get('window');
const COLOR_BOTTLE_SIZE = Math.min((width - 140) / 5, 65);

// Cores primárias e suas misturas
interface ColorData {
  name: string;
  color: string;
  emoji: string;
}

// Cores primárias + preto e branco (usadas no modo desafio)
const PRIMARY_COLORS: ColorData[] = [
  { name: 'Vermelho', color: '#FF0000', emoji: '🔴' },
  { name: 'Azul', color: '#0000FF', emoji: '🔵' },
  { name: 'Amarelo', color: '#FFFF00', emoji: '🟡' },
  { name: 'Branco', color: '#FFFFFF', emoji: '⚪' },
  { name: 'Preto', color: '#000000', emoji: '⚫' },
];

// Todas as cores disponíveis (usadas no modo livre)
const ALL_COLORS: ColorData[] = [
  // Cores primárias
  { name: 'Vermelho', color: '#FF0000', emoji: '🔴' },
  { name: 'Azul', color: '#0000FF', emoji: '🔵' },
  { name: 'Amarelo', color: '#FFFF00', emoji: '🟡' },
  // Cores secundárias
  { name: 'Roxo', color: '#9C27B0', emoji: '🟣' },
  { name: 'Laranja', color: '#FF9800', emoji: '🟠' },
  { name: 'Verde', color: '#4CAF50', emoji: '🟢' },
  // Cores adicionais
  { name: 'Rosa', color: '#FF69B4', emoji: '🌸' },
  { name: 'Marrom', color: '#8B4513', emoji: '🟤' },
  { name: 'Preto', color: '#000000', emoji: '⚫' },
  { name: 'Branco', color: '#FFFFFF', emoji: '⚪' },
];

// Mapa completo de misturas de cores
const COLOR_MIXTURES: Record<string, ColorData> = {
  // Misturas primárias -> secundárias
  'Vermelho+Azul': { name: 'Roxo', color: '#9C27B0', emoji: '🟣' },
  'Azul+Vermelho': { name: 'Roxo', color: '#9C27B0', emoji: '🟣' },
  'Vermelho+Amarelo': { name: 'Laranja', color: '#FF9800', emoji: '🟠' },
  'Amarelo+Vermelho': { name: 'Laranja', color: '#FF9800', emoji: '🟠' },
  'Azul+Amarelo': { name: 'Verde', color: '#4CAF50', emoji: '🟢' },
  'Amarelo+Azul': { name: 'Verde', color: '#4CAF50', emoji: '🟢' },

  // Misturas com branco (tons claros)
  'Vermelho+Branco': { name: 'Rosa', color: '#FF69B4', emoji: '🌸' },
  'Branco+Vermelho': { name: 'Rosa', color: '#FF69B4', emoji: '🌸' },
  'Azul+Branco': { name: 'Azul Claro', color: '#87CEEB', emoji: '💙' },
  'Branco+Azul': { name: 'Azul Claro', color: '#87CEEB', emoji: '💙' },
  'Amarelo+Branco': { name: 'Amarelo Claro', color: '#FFFFE0', emoji: '💛' },
  'Branco+Amarelo': { name: 'Amarelo Claro', color: '#FFFFE0', emoji: '💛' },

  // Misturas com preto (tons escuros)
  'Vermelho+Preto': { name: 'Vermelho Escuro', color: '#8B0000', emoji: '❤️' },
  'Preto+Vermelho': { name: 'Vermelho Escuro', color: '#8B0000', emoji: '❤️' },
  'Azul+Preto': { name: 'Azul Escuro', color: '#00008B', emoji: '💙' },
  'Preto+Azul': { name: 'Azul Escuro', color: '#00008B', emoji: '💙' },
  'Verde+Preto': { name: 'Verde Escuro', color: '#006400', emoji: '💚' },
  'Preto+Verde': { name: 'Verde Escuro', color: '#006400', emoji: '💚' },

  // Misturas secundárias
  'Roxo+Amarelo': { name: 'Marrom', color: '#8B4513', emoji: '🟤' },
  'Amarelo+Roxo': { name: 'Marrom', color: '#8B4513', emoji: '🟤' },
  'Laranja+Azul': { name: 'Marrom', color: '#8B4513', emoji: '🟤' },
  'Azul+Laranja': { name: 'Marrom', color: '#8B4513', emoji: '🟤' },
  'Verde+Vermelho': { name: 'Marrom', color: '#8B4513', emoji: '🟤' },
  'Vermelho+Verde': { name: 'Marrom', color: '#8B4513', emoji: '🟤' },

  // Misturas criativas
  'Roxo+Branco': { name: 'Lavanda', color: '#E6E6FA', emoji: '💜' },
  'Branco+Roxo': { name: 'Lavanda', color: '#E6E6FA', emoji: '💜' },
  'Rosa+Branco': { name: 'Rosa Claro', color: '#FFB6C1', emoji: '🌸' },
  'Branco+Rosa': { name: 'Rosa Claro', color: '#FFB6C1', emoji: '🌸' },
  'Verde+Branco': { name: 'Verde Claro', color: '#90EE90', emoji: '💚' },
  'Branco+Verde': { name: 'Verde Claro', color: '#90EE90', emoji: '💚' },
  'Laranja+Branco': { name: 'Pêssego', color: '#FFDAB9', emoji: '🍑' },
  'Branco+Laranja': { name: 'Pêssego', color: '#FFDAB9', emoji: '🍑' },

  // Mistura de cinza
  'Branco+Preto': { name: 'Cinza', color: '#808080', emoji: '🩶' },
  'Preto+Branco': { name: 'Cinza', color: '#808080', emoji: '🩶' },
};

// Desafios: adivinhar a mistura correta
interface Challenge {
  targetColor: ColorData;
  colors: [string, string]; // nomes das cores que devem ser misturadas
}

const CHALLENGES: Challenge[] = [
  // Desafios básicos - cores secundárias
  { targetColor: { name: 'Roxo', color: '#9C27B0', emoji: '🟣' }, colors: ['Vermelho', 'Azul'] },
  { targetColor: { name: 'Laranja', color: '#FF9800', emoji: '🟠' }, colors: ['Vermelho', 'Amarelo'] },
  { targetColor: { name: 'Verde', color: '#4CAF50', emoji: '🟢' }, colors: ['Azul', 'Amarelo'] },
  // Desafios intermediários - tons claros
  { targetColor: { name: 'Rosa', color: '#FF69B4', emoji: '🌸' }, colors: ['Vermelho', 'Branco'] },
  { targetColor: { name: 'Azul Claro', color: '#87CEEB', emoji: '💙' }, colors: ['Azul', 'Branco'] },
];

export default function ColorMixerGame() {
  const { t } = useTranslation();
  const router = useRouter();
  const [selectedColors, setSelectedColors] = useState<ColorData[]>([]);
  const [mixedColor, setMixedColor] = useState<ColorData | null>(null);
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [gameMode, setGameMode] = useState<'free' | 'challenge'>('free');
  const [showVictory, setShowVictory] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const mixAnim = useRef(new Animated.Value(0)).current;
  const feedbackAnim = useRef(new Animated.Value(0)).current;
  const victoryAnim = useRef(new Animated.Value(0)).current;

  // Determinar quais cores mostrar baseado no modo
  const displayColors = gameMode === 'challenge' ? PRIMARY_COLORS : ALL_COLORS;

  // Criar animações para todas as cores
  const bottleAnimsRef = useRef<Animated.Value[]>([]);
  if (bottleAnimsRef.current.length !== displayColors.length) {
    bottleAnimsRef.current = displayColors.map(() => new Animated.Value(0));
  }

  useEffect(() => {
    // Resetar e animar frascos quando mudar de modo
    bottleAnimsRef.current.forEach(anim => anim.setValue(0));

    Animated.stagger(
      50,
      bottleAnimsRef.current.map(anim =>
        Animated.spring(anim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        })
      )
    ).start();
  }, [gameMode]);

  useEffect(() => {
    if (gameMode === 'challenge' && !currentChallenge) {
      setCurrentChallenge(CHALLENGES[challengeIndex]);
    }
  }, [gameMode, challengeIndex]);

  const handleColorSelect = async (color: ColorData) => {
    await triggerHaptic('medium');

    // Verificar se a cor já está selecionada
    const alreadySelected = selectedColors.some(c => c.name === color.name);
    if (alreadySelected) {
      // Remover a cor se já estiver selecionada
      setSelectedColors(selectedColors.filter(c => c.name !== color.name));
      setMixedColor(null);
      mixAnim.setValue(0);
      return;
    }

    if (selectedColors.length >= 3) {
      // Já tem 3 cores, não adicionar mais
      await triggerHaptic('error');
      return;
    }

    const newSelectedColors = [...selectedColors, color];
    setSelectedColors(newSelectedColors);
  };

  const handleMixColors = async () => {
    if (selectedColors.length < 2) {
      await triggerHaptic('error');
      return;
    }

    await triggerHaptic('medium');

    // Tentar primeiro encontrar no mapa de misturas conhecidas
    if (selectedColors.length === 2) {
      const key = `${selectedColors[0].name}+${selectedColors[1].name}`;
      const knownMixture = COLOR_MIXTURES[key];

      if (knownMixture) {
        // Animar mistura
        Animated.sequence([
          Animated.timing(mixAnim, {
            toValue: 0.5,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(mixAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
        ]).start(() => {
          setMixedColor(knownMixture);
          triggerHaptic('success');

          // Verificar desafio se estiver no modo desafio
          if (gameMode === 'challenge' && currentChallenge) {
            checkChallenge(knownMixture);
          }
        });
        return;
      }
    }

    // Se não encontrou ou tem 3 cores, usar mistura RGB
    Animated.sequence([
      Animated.timing(mixAnim, {
        toValue: 0.5,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(mixAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => {
      const mixture = mixColors(selectedColors);
      setMixedColor(mixture);
      triggerHaptic('success');
    });
  };

  const checkChallenge = (resultColor: ColorData) => {
    if (!currentChallenge) return;

    const correct = resultColor.name === currentChallenge.targetColor.name;
    setIsCorrect(correct);
    setShowFeedback(true);

    Animated.spring(feedbackAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();

    if (correct) {
      setScore(score + 1);
      triggerHaptic('success');
      setShowHint(false); // Resetar dica ao acertar
    } else {
      triggerHaptic('error');
      setShowHint(true); // Mostrar dica ao errar
    }

    // Próximo desafio após 2 segundos
    setTimeout(() => {
      Animated.timing(feedbackAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setShowFeedback(false);
        if (correct) {
          if (challengeIndex < CHALLENGES.length - 1) {
            setChallengeIndex(challengeIndex + 1);
            setCurrentChallenge(CHALLENGES[challengeIndex + 1]);
            setShowHint(false); // Resetar dica ao mudar de desafio
            handleReset();
          } else {
            // Completou todos os desafios! 🎉
            setShowVictory(true);
            Animated.spring(victoryAnim, {
              toValue: 1,
              useNativeDriver: true,
            }).start();
          }
        } else {
          handleReset();
        }
      });
    }, 2000);
  };

  const handleReset = () => {
    setSelectedColors([]);
    setMixedColor(null);
    mixAnim.setValue(0);
  };

  const handleRestartChallenges = () => {
    setShowVictory(false);
    setScore(0);
    setChallengeIndex(0);
    setCurrentChallenge(CHALLENGES[0]);
    handleReset();
    victoryAnim.setValue(0);
  };

  const handleBack = () => {
    router.push('/(tabs)');
  };

  const toggleGameMode = () => {
    const newMode = gameMode === 'free' ? 'challenge' : 'free';
    setGameMode(newMode);
    handleReset();
    if (newMode === 'challenge') {
      setChallengeIndex(0);
      setCurrentChallenge(CHALLENGES[0]);
      setScore(0);
    } else {
      setCurrentChallenge(null);
    }
  };

  const mixOpacity = mixAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const mixScale = mixAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.5, 1.2, 1],
  });

  return (
    <LinearGradient
      colors={['#A855F7', '#EC4899']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>{t('games.common.back')}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.modeButton} onPress={toggleGameMode}>
            <Text style={styles.modeButtonText}>
              {gameMode === 'free' ? t('games.colorMixer.modes.free') : t('games.colorMixer.modes.challenge')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Título */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{t('games.colorMixer.title')}</Text>
          <Text style={styles.subtitle}>
            {gameMode === 'free'
              ? t('games.colorMixer.instructions.free')
              : t('games.colorMixer.instructions.challenge')}
          </Text>
        </View>

        {/* Desafio */}
        {gameMode === 'challenge' && currentChallenge && (
          <View style={styles.challengeContainer}>
            <Text style={styles.challengeText}>{t('games.colorMixer.challenge', { current: challengeIndex + 1, total: CHALLENGES.length })}</Text>
            <View style={[styles.targetColorBox, { backgroundColor: currentChallenge.targetColor.color }]}>
              <Text style={styles.targetColorEmoji}>{currentChallenge.targetColor.emoji}</Text>
              <Text style={styles.targetColorName}>{currentChallenge.targetColor.name}</Text>
            </View>

            {/* Dica de cores - só aparece após erro */}
            {showHint && (
              <View style={styles.hintContainer}>
                <Text style={styles.hintText}>{t('games.colorMixer.hint')}</Text>
                <View style={styles.hintColorsRow}>
                  {currentChallenge.colors.map((colorName, index) => {
                    const colorData = PRIMARY_COLORS.find(c => c.name === colorName);
                    return (
                      <View key={index} style={styles.hintColorItem}>
                        <View
                          style={[
                            styles.hintColorCircle,
                            { backgroundColor: colorData?.color || '#CCC' },
                          ]}
                        >
                          <Text style={styles.hintColorEmoji}>{colorData?.emoji}</Text>
                        </View>
                        {index < currentChallenge.colors.length - 1 && (
                          <Text style={styles.hintPlus}>+</Text>
                        )}
                      </View>
                    );
                  })}
                </View>
              </View>
            )}

            <Text style={styles.scoreText}>{t('games.colorMixer.points', { score, total: CHALLENGES.length })}</Text>
          </View>
        )}

        {/* Paleta de Cores */}
        <View style={styles.colorsContainer}>
          <Text style={styles.sectionTitle}>
            {gameMode === 'challenge' ? t('games.colorMixer.primaryColors') : t('games.colorMixer.colorPalette')}
          </Text>
          <ScrollView
            horizontal={gameMode === 'challenge'}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.colorsScrollContent,
              gameMode === 'challenge' && styles.colorsScrollContentChallenge,
            ]}
          >
            <View style={styles.colorsRow}>
              {displayColors.map((color, index) => {
              const isSelected = selectedColors.some(c => c.name === color.name);
              const bottleScale = bottleAnimsRef.current[index]?.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1],
              }) || new Animated.Value(1);

              return (
                <Animated.View
                  key={color.name}
                  style={[
                    styles.colorBottleContainer,
                    { transform: [{ scale: bottleScale }] },
                  ]}
                >
                  <TouchableOpacity
                    style={[
                      styles.colorBottle,
                      { backgroundColor: color.color },
                      isSelected && styles.colorBottleSelected,
                    ]}
                    onPress={() => handleColorSelect(color)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.colorEmoji}>{color.emoji}</Text>
                  </TouchableOpacity>
                  <Text style={styles.colorName}>{color.name}</Text>
                  {isSelected && (
                    <View style={styles.selectionBadge}>
                      <Text style={styles.selectionBadgeText}>
                        {selectedColors.findIndex(c => c.name === color.name) + 1}
                      </Text>
                    </View>
                  )}
                </Animated.View>
              );
            })}
            </View>
          </ScrollView>
        </View>

        {/* Área de Mistura */}
        <View style={styles.mixingArea}>
          <Text style={styles.sectionTitle}>{t('games.colorMixer.mixing')}</Text>

          {selectedColors.length === 0 && (
            <View style={styles.emptyMix}>
              <Text style={styles.emptyMixText}>
                {t('games.colorMixer.selectColors')}
              </Text>
              <Text style={styles.emptyMixSubtext}>
                {t('games.colorMixer.thenMix')}
              </Text>
            </View>
          )}

          {selectedColors.length > 0 && !mixedColor && (
            <View style={styles.selectedColorsRow}>
              {selectedColors.map((color, index) => (
                <View key={index} style={styles.selectedColorBox}>
                  <View
                    style={[
                      styles.selectedColorCircle,
                      { backgroundColor: color.color },
                    ]}
                  >
                    <Text style={styles.selectedColorEmoji}>{color.emoji}</Text>
                  </View>
                  <Text style={styles.selectedColorName}>{color.name}</Text>
                </View>
              ))}
            </View>
          )}

          {selectedColors.length >= 2 && !mixedColor && (
            <TouchableOpacity
              style={styles.mixButton}
              onPress={handleMixColors}
              activeOpacity={0.8}
            >
              <Text style={styles.mixButtonIcon}>🌈</Text>
              <Text style={styles.mixButtonText}>{t('games.colorMixer.mixColors')}</Text>
            </TouchableOpacity>
          )}

          {mixedColor && (
            <Animated.View
              style={[
                styles.resultContainer,
                {
                  opacity: mixOpacity,
                  transform: [{ scale: mixScale }],
                },
              ]}
            >
              <Text style={styles.resultLabel}>{t('games.colorMixer.result')}</Text>
              <View
                style={[
                  styles.resultColorBox,
                  { backgroundColor: mixedColor.color },
                ]}
              >
                <Text style={styles.resultEmoji}>{mixedColor.emoji}</Text>
                <Text style={styles.resultName}>{mixedColor.name}</Text>
              </View>
            </Animated.View>
          )}

          {selectedColors.length > 0 && (
            <TouchableOpacity
              style={styles.resetButton}
              onPress={handleReset}
            >
              <Text style={styles.resetButtonText}>{t('games.common.reset')}</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Feedback de Desafio */}
        {showFeedback && (
          <Animated.View
            style={[
              styles.feedbackOverlay,
              {
                opacity: feedbackAnim,
                transform: [
                  {
                    scale: feedbackAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.5, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            <View
              style={[
                styles.feedbackCard,
                isCorrect ? styles.feedbackCorrect : styles.feedbackIncorrect,
              ]}
            >
              <Text style={styles.feedbackEmoji}>
                {isCorrect ? '🎉' : '😅'}
              </Text>
              <Text style={styles.feedbackText}>
                {isCorrect ? t('games.colorMixer.wellDone') : t('games.tryAgain')}
              </Text>
            </View>
          </Animated.View>
        )}

        {/* Tela de Vitória */}
        {showVictory && (
          <Animated.View
            style={[
              styles.feedbackOverlay,
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
              <Text style={styles.victoryEmoji}>🎨🌈🎉</Text>
              <Text style={styles.victoryTitle}>{t('games.common.congratulations')}</Text>
              <Text style={styles.victoryText}>
                {t('games.colorMixer.completedAll', { total: CHALLENGES.length })}
              </Text>
              <Text style={styles.victoryScore}>
                {t('games.colorMixer.finalScore', { score, total: CHALLENGES.length })}
              </Text>

              <View style={styles.victoryButtons}>
                <TouchableOpacity
                  style={styles.victoryButton}
                  onPress={handleRestartChallenges}
                >
                  <Text style={styles.victoryButtonText}>{t('games.common.playAgain')}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.victoryButton, styles.victoryButtonSecondary]}
                  onPress={handleBack}
                >
                  <Text style={styles.victoryButtonTextSecondary}>{t('games.common.backToHome')}</Text>
                </TouchableOpacity>
              </View>
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
  modeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  modeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
  } as any,
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    marginTop: 4,
  },
  challengeContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  challengeText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 8,
  },
  targetColorBox: {
    width: 100,
    height: 100,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  targetColorEmoji: {
    fontSize: 40,
  },
  targetColorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)',
    marginTop: 4,
  } as any,
  hintContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  hintText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 8,
  },
  hintColorsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  hintColorItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hintColorCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  hintColorEmoji: {
    fontSize: 20,
  },
  hintPlus: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginHorizontal: 4,
  },
  scoreText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
    marginTop: 12,
  },
  colorsContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  colorsScrollContent: {
    flexGrow: 1,
    paddingVertical: 8,
  },
  colorsScrollContentChallenge: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  colorBottleContainer: {
    alignItems: 'center',
  },
  colorBottle: {
    width: COLOR_BOTTLE_SIZE,
    height: COLOR_BOTTLE_SIZE,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  colorBottleSelected: {
    borderWidth: 5,
    borderColor: '#FFD700',
    transform: [{ scale: 1.05 }],
  },
  colorEmoji: {
    fontSize: 32,
  },
  colorName: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 8,
    textAlign: 'center',
  },
  selectionBadge: {
    position: 'absolute',
    top: -8,
    right: 8,
    backgroundColor: '#FFD700',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  selectionBadgeText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  mixingArea: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  emptyMix: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyMixText: {
    fontSize: 18,
    color: '#999',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyMixSubtext: {
    fontSize: 14,
    color: '#BBB',
    textAlign: 'center',
  },
  selectedColorsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  selectedColorBox: {
    marginHorizontal: 8,
    alignItems: 'center',
  },
  selectedColorCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#333',
  },
  selectedColorEmoji: {
    fontSize: 32,
  },
  selectedColorName: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  mixButton: {
    backgroundColor: Colors.cta,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 24,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: Colors.ctaDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  mixButtonIcon: {
    fontSize: 24,
  },
  mixButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  resultContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  resultLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  resultColorBox: {
    minWidth: 140,
    maxWidth: 200,
    minHeight: 140,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  resultEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  resultName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)',
    textAlign: 'center',
    lineHeight: 22,
  } as any,
  resetButton: {
    backgroundColor: Colors.cta,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
    marginTop: 20,
    alignSelf: 'center',
    shadowColor: Colors.ctaDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  feedbackOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  feedbackCard: {
    padding: 32,
    borderRadius: 24,
    alignItems: 'center',
    minWidth: 200,
  },
  feedbackCorrect: {
    backgroundColor: '#4CAF50',
  },
  feedbackIncorrect: {
    backgroundColor: '#FF9800',
  },
  feedbackEmoji: {
    fontSize: 60,
    marginBottom: 12,
  },
  feedbackText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  victoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    maxWidth: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
  },
  victoryEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  victoryTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: Colors.secondary,
    marginBottom: 8,
  },
  victoryText: {
    fontSize: 20,
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  victoryScore: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.cta,
    marginBottom: 24,
  },
  victoryButtons: {
    width: '100%',
    gap: 12,
  },
  victoryButton: {
    backgroundColor: Colors.cta,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: Colors.ctaDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  victoryButtonSecondary: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  victoryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  victoryButtonTextSecondary: {
    color: Colors.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
