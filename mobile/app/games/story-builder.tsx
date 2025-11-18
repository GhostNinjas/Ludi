import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';
import { Colors } from '@/constants/Colors';

interface StoryElement {
  id: string;
  emoji: string;
  label: string;
}

interface StoryPart {
  type: 'character' | 'place' | 'action' | 'object';
  element: StoryElement | null;
}

// Personagens
const CHARACTERS: StoryElement[] = [
  { id: 'prince', emoji: '🤴', label: 'Príncipe' },
  { id: 'princess', emoji: '👸', label: 'Princesa' },
  { id: 'dinosaur', emoji: '🦖', label: 'Dinossauro' },
  { id: 'cat', emoji: '🐱', label: 'Gatinho' },
  { id: 'dog', emoji: '🐶', label: 'Cachorrinho' },
  { id: 'astronaut', emoji: '👨‍🚀', label: 'Astronauta' },
  { id: 'fairy', emoji: '🧚', label: 'Fada' },
  { id: 'robot', emoji: '🤖', label: 'Robô' },
];

// Lugares
const PLACES: StoryElement[] = [
  { id: 'castle', emoji: '🏰', label: 'Castelo' },
  { id: 'forest', emoji: '🌲', label: 'Floresta' },
  { id: 'beach', emoji: '🏖️', label: 'Praia' },
  { id: 'space', emoji: '🚀', label: 'Espaço' },
  { id: 'city', emoji: '🏙️', label: 'Cidade' },
  { id: 'farm', emoji: '🚜', label: 'Fazenda' },
  { id: 'mountain', emoji: '⛰️', label: 'Montanha' },
  { id: 'underwater', emoji: '🌊', label: 'Fundo do mar' },
];

// Ações
const ACTIONS: StoryElement[] = [
  { id: 'dance', emoji: '💃', label: 'Dançar' },
  { id: 'sing', emoji: '🎤', label: 'Cantar' },
  { id: 'fly', emoji: '✈️', label: 'Voar' },
  { id: 'swim', emoji: '🏊', label: 'Nadar' },
  { id: 'run', emoji: '🏃', label: 'Correr' },
  { id: 'jump', emoji: '🦘', label: 'Pular' },
  { id: 'explore', emoji: '🔍', label: 'Explorar' },
  { id: 'sleep', emoji: '😴', label: 'Dormir' },
];

// Objetos
const OBJECTS: StoryElement[] = [
  { id: 'crown', emoji: '👑', label: 'Coroa' },
  { id: 'wand', emoji: '🪄', label: 'Varinha' },
  { id: 'ball', emoji: '⚽', label: 'Bola' },
  { id: 'book', emoji: '📚', label: 'Livro' },
  { id: 'flower', emoji: '🌸', label: 'Flor' },
  { id: 'treasure', emoji: '💎', label: 'Tesouro' },
  { id: 'cake', emoji: '🎂', label: 'Bolo' },
  { id: 'star', emoji: '⭐', label: 'Estrela' },
];

const STORY_TEMPLATES = [
  {
    id: 1,
    text: (parts: StoryPart[]) => {
      const character = parts[0]?.element?.label || '____';
      const place = parts[1]?.element?.label || '____';
      const action = parts[2]?.element?.label || '____';
      const object = parts[3]?.element?.label || '____';

      return `Era uma vez ${character} que morava em ${place}. Um dia, decidiu ${action} e encontrou ${object}. Foi uma aventura incrível! 🎉`;
    },
  },
  {
    id: 2,
    text: (parts: StoryPart[]) => {
      const character = parts[0]?.element?.label || '____';
      const place = parts[1]?.element?.label || '____';
      const action = parts[2]?.element?.label || '____';
      const object = parts[3]?.element?.label || '____';

      return `${character} estava em ${place} quando viu ${object}. Então começou a ${action} de alegria! Que dia maravilhoso! ✨`;
    },
  },
];

export default function StoryBuilderGame() {
  const { t } = useTranslation();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [storyParts, setStoryParts] = useState<StoryPart[]>([
    { type: 'character', element: null },
    { type: 'place', element: null },
    { type: 'action', element: null },
    { type: 'object', element: null },
  ]);
  const [showStory, setShowStory] = useState(false);
  const [selectedTemplate] = useState(STORY_TEMPLATES[0]);

  const getCurrentElements = (): StoryElement[] => {
    switch (storyParts[currentStep]?.type) {
      case 'character':
        return CHARACTERS;
      case 'place':
        return PLACES;
      case 'action':
        return ACTIONS;
      case 'object':
        return OBJECTS;
      default:
        return [];
    }
  };

  const getStepTitle = (): string => {
    switch (storyParts[currentStep]?.type) {
      case 'character':
        return 'Escolha um personagem';
      case 'place':
        return 'Escolha um lugar';
      case 'action':
        return 'Escolha uma ação';
      case 'object':
        return 'Escolha um objeto';
      default:
        return '';
    }
  };

  const getStepEmoji = (): string => {
    switch (storyParts[currentStep]?.type) {
      case 'character':
        return '👤';
      case 'place':
        return '📍';
      case 'action':
        return '⚡';
      case 'object':
        return '🎁';
      default:
        return '';
    }
  };

  const handleElementSelect = async (element: StoryElement) => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (error) {
      console.log('Error with haptics:', error);
    }

    const newParts = [...storyParts];
    newParts[currentStep] = {
      ...newParts[currentStep],
      element,
    };
    setStoryParts(newParts);

    // Move to next step or show story
    setTimeout(() => {
      if (currentStep < storyParts.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        setShowStory(true);
      }
    }, 300);
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setStoryParts([
      { type: 'character', element: null },
      { type: 'place', element: null },
      { type: 'action', element: null },
      { type: 'object', element: null },
    ]);
    setShowStory(false);
  };

  const handleBack = () => {
    router.push('/(tabs)');
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Story completion screen
  if (showStory) {
    const storyText = selectedTemplate.text(storyParts);

    return (
      <LinearGradient
        colors={['#F59E0B', '#EF4444']}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.storyContainer}>
            <Text style={styles.storyTitle}>Sua História! 📖</Text>

            {/* Story elements preview */}
            <View style={styles.storyElements}>
              {storyParts.map((part, index) => (
                <View key={index} style={styles.storyElement}>
                  <Text style={styles.storyElementEmoji}>
                    {part.element?.emoji || '❓'}
                  </Text>
                  <Text style={styles.storyElementLabel}>
                    {part.element?.label || '____'}
                  </Text>
                </View>
              ))}
            </View>

            {/* Story text */}
            <View style={styles.storyTextContainer}>
              <ScrollView
                style={styles.storyScroll}
                contentContainerStyle={styles.storyScrollContent}
              >
                <Text style={styles.storyText}>{storyText}</Text>
              </ScrollView>
            </View>

            {/* Action buttons */}
            <View style={styles.storyActions}>
              <TouchableOpacity
                style={styles.restartButton}
                onPress={handleRestart}
                activeOpacity={0.8}
              >
                <Text style={styles.restartButtonText}>🔄 Nova História</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.backButton}
                onPress={handleBack}
                activeOpacity={0.8}
              >
                <Text style={styles.backButtonText}>🏠 Voltar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  // Story building screen
  return (
    <LinearGradient
      colors={['#F59E0B', '#EF4444']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerButton} onPress={handleBack}>
            <Text style={styles.headerButtonText}>{t('games.common.back')}</Text>
          </TouchableOpacity>

          <View style={styles.titleContainer}>
            <Text style={styles.title}>Construtor de Histórias</Text>
          </View>

          <View style={styles.headerButton} />
        </View>

        {/* Progress indicator */}
        <View style={styles.progressContainer}>
          {storyParts.map((part, index) => (
            <View
              key={index}
              style={[
                styles.progressDot,
                index <= currentStep && styles.progressDotActive,
                index < currentStep && styles.progressDotCompleted,
              ]}
            >
              {index < currentStep ? (
                <Text style={styles.progressDotEmoji}>{part.element?.emoji}</Text>
              ) : (
                <Text style={styles.progressDotText}>{index + 1}</Text>
              )}
            </View>
          ))}
        </View>

        {/* Step title */}
        <View style={styles.stepHeader}>
          <Text style={styles.stepEmoji}>{getStepEmoji()}</Text>
          <Text style={styles.stepTitle}>{getStepTitle()}</Text>
        </View>

        {/* Elements grid */}
        <ScrollView
          style={styles.elementsScroll}
          contentContainerStyle={styles.elementsContainer}
        >
          {getCurrentElements().map((element) => (
            <TouchableOpacity
              key={element.id}
              style={[
                styles.elementCard,
                storyParts[currentStep]?.element?.id === element.id &&
                  styles.elementCardSelected,
              ]}
              onPress={() => handleElementSelect(element)}
              activeOpacity={0.7}
            >
              <Text style={styles.elementEmoji}>{element.emoji}</Text>
              <Text style={styles.elementLabel}>{element.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Navigation buttons */}
        {currentStep > 0 && (
          <View style={styles.navigationContainer}>
            <TouchableOpacity
              style={styles.previousButton}
              onPress={handlePreviousStep}
              activeOpacity={0.8}
            >
              <Text style={styles.previousButtonText}>← Voltar</Text>
            </TouchableOpacity>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerButton: {
    padding: 8,
    minWidth: 60,
  },
  headerButtonText: {
    color: Colors.textInverse,
    fontSize: 16,
    fontWeight: '600',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textInverse,
    textAlign: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  progressDot: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  progressDotActive: {
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderColor: Colors.textInverse,
    transform: [{ scale: 1.1 }],
  },
  progressDotCompleted: {
    backgroundColor: Colors.textInverse,
  },
  progressDotText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textInverse,
  },
  progressDotEmoji: {
    fontSize: 24,
  },
  stepHeader: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  stepEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textInverse,
    textAlign: 'center',
  },
  elementsScroll: {
    flex: 1,
  },
  elementsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    paddingBottom: 20,
    justifyContent: 'center',
    gap: 12,
  },
  elementCard: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    borderWidth: 3,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  elementCardSelected: {
    borderColor: '#FFD700',
    backgroundColor: Colors.textInverse,
    transform: [{ scale: 1.05 }],
  },
  elementEmoji: {
    fontSize: 40,
    marginBottom: 4,
  },
  elementLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
  },
  navigationContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  previousButton: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  previousButtonText: {
    color: Colors.textInverse,
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Story screen styles
  storyContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
    justifyContent: 'space-between',
  },
  storyTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.textInverse,
    textAlign: 'center',
    marginBottom: 24,
  },
  storyElements: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
    flexWrap: 'wrap',
    gap: 12,
  },
  storyElement: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 12,
    borderRadius: 12,
    minWidth: 70,
  },
  storyElementEmoji: {
    fontSize: 36,
    marginBottom: 4,
  },
  storyElementLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textInverse,
    textAlign: 'center',
  },
  storyTextContainer: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  storyScroll: {
    flex: 1,
  },
  storyScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  storyText: {
    fontSize: 20,
    lineHeight: 32,
    color: Colors.text,
    fontWeight: '500',
    textAlign: 'center',
  },
  storyActions: {
    gap: 12,
  },
  restartButton: {
    backgroundColor: Colors.cta,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: Colors.ctaDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  restartButtonText: {
    color: Colors.textInverse,
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  backButtonText: {
    color: Colors.textInverse,
    fontSize: 16,
    fontWeight: '600',
  },
});
