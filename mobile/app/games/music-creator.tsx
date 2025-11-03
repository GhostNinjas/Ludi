import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Animated,
  Modal,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';
import { Colors } from '@/constants/Colors';

const { width, height } = Dimensions.get('window');

// Definição de instrumentos e sons
interface Instrument {
  id: string;
  name: string;
  emoji: string;
  color: string;
  notes: Note[];
}

interface Note {
  id: string;
  name: string;
  frequency: number;
  emoji?: string;
}

interface RecordedNote {
  instrumentId: string;
  noteId: string;
  timestamp: number;
  color: string;
  emoji: string;
}

// Instrumentos disponíveis
const INSTRUMENTS: Instrument[] = [
  {
    id: 'piano',
    name: 'Piano',
    emoji: '🎹',
    color: '#FF6B9D',
    notes: [
      { id: 'c', name: 'Dó', frequency: 261.63 },
      { id: 'd', name: 'Ré', frequency: 293.66 },
      { id: 'e', name: 'Mi', frequency: 329.63 },
      { id: 'f', name: 'Fá', frequency: 349.23 },
      { id: 'g', name: 'Sol', frequency: 392.00 },
      { id: 'a', name: 'Lá', frequency: 440.00 },
      { id: 'b', name: 'Si', frequency: 493.88 },
      { id: 'c2', name: 'Dó', frequency: 523.25 },
    ],
  },
  {
    id: 'drums',
    name: 'Bateria',
    emoji: '🥁',
    color: '#4ECDC4',
    notes: [
      { id: 'kick', name: 'Bumbo', frequency: 80, emoji: '💥' },
      { id: 'snare', name: 'Caixa', frequency: 200, emoji: '🎯' },
      { id: 'hihat', name: 'Chimbal', frequency: 400, emoji: '✨' },
      { id: 'tom', name: 'Tom', frequency: 150, emoji: '🔵' },
    ],
  },
  {
    id: 'animals',
    name: 'Animais',
    emoji: '🐶',
    color: '#95E1D3',
    notes: [
      { id: 'dog', name: 'Cachorro', frequency: 300, emoji: '🐶' },
      { id: 'cat', name: 'Gato', frequency: 500, emoji: '🐱' },
      { id: 'cow', name: 'Vaca', frequency: 150, emoji: '🐮' },
      { id: 'bird', name: 'Pássaro', frequency: 700, emoji: '🐦' },
    ],
  },
  {
    id: 'xylophone',
    name: 'Xilofone',
    emoji: '🎵',
    color: '#FFA500',
    notes: [
      { id: 'x1', name: '', frequency: 523.25, emoji: '🔴' },
      { id: 'x2', name: '', frequency: 587.33, emoji: '🟠' },
      { id: 'x3', name: '', frequency: 659.25, emoji: '🟡' },
      { id: 'x4', name: '', frequency: 698.46, emoji: '🟢' },
      { id: 'x5', name: '', frequency: 783.99, emoji: '🔵' },
      { id: 'x6', name: '', frequency: 880.00, emoji: '🟣' },
    ],
  },
];

export default function MusicCreatorGame() {
  const { t } = useTranslation();
  const router = useRouter();
  const [selectedInstrument, setSelectedInstrument] = useState<Instrument>(INSTRUMENTS[0]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedNotes, setRecordedNotes] = useState<RecordedNote[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [activeNotes, setActiveNotes] = useState<Set<string>>(new Set());
  const recordingStartTime = useRef<number | null>(null);
  const playbackTimeout = useRef<NodeJS.Timeout | null>(null);
  const animatedValues = useRef<{ [key: string]: Animated.Value }>({});
  const audioContext = useRef<any>(null);

  // Configurar áudio
  useEffect(() => {
    const setupAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
          shouldDuckAndroid: true,
        });
      } catch (error) {
        console.error('Error setting up audio:', error);
      }
    };
    setupAudio();
  }, []);

  // Limpar timeouts ao desmontar
  useEffect(() => {
    return () => {
      if (playbackTimeout.current) {
        clearTimeout(playbackTimeout.current);
      }
    };
  }, []);

  // Obter ou criar valor animado para uma nota
  const getAnimatedValue = (noteId: string) => {
    if (!animatedValues.current[noteId]) {
      animatedValues.current[noteId] = new Animated.Value(1);
    }
    return animatedValues.current[noteId];
  };

  // Criar contexto de áudio Web (para navegador)
  const getAudioContext = () => {
    if (!audioContext.current && typeof window !== 'undefined') {
      // @ts-ignore - Web Audio API
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioContext.current = new AudioContextClass();
      }
    }
    return audioContext.current;
  };

  // Mapear sons para arquivos de áudio
  const getSoundFile = (instrumentId: string, noteId: string) => {
    // Mapeamento de arquivos de áudio
    const soundFiles: { [key: string]: { [key: string]: any } } = {
      piano: {
        c: require('@/assets/sounds/piano/C4.mp3'),
        d: require('@/assets/sounds/piano/D4.mp3'),
        e: require('@/assets/sounds/piano/E4.mp3'),
        f: require('@/assets/sounds/piano/F4.mp3'),
        g: require('@/assets/sounds/piano/G4.mp3'),
        a: require('@/assets/sounds/piano/A4.mp3'),
        b: require('@/assets/sounds/piano/B4.mp3'),
        c2: require('@/assets/sounds/piano/C5.mp3'),
      },
      // drums: {
      //   kick: require('@/assets/sounds/drums/kick.mp3'),
      //   snare: require('@/assets/sounds/drums/snare.mp3'),
      //   hihat: require('@/assets/sounds/drums/hihat.mp3'),
      //   tom: require('@/assets/sounds/drums/tom.mp3'),
      // },
      // animals: {
      //   dog: require('@/assets/sounds/animals/dog.mp3'),
      //   cat: require('@/assets/sounds/animals/cat.mp3'),
      //   cow: require('@/assets/sounds/animals/cow.mp3'),
      //   bird: require('@/assets/sounds/animals/bird.mp3'),
      // },
      // xylophone: {
      //   x1: require('@/assets/sounds/xylophone/x1.mp3'),
      //   x2: require('@/assets/sounds/xylophone/x2.mp3'),
      //   x3: require('@/assets/sounds/xylophone/x3.mp3'),
      //   x4: require('@/assets/sounds/xylophone/x4.mp3'),
      //   x5: require('@/assets/sounds/xylophone/x5.mp3'),
      //   x6: require('@/assets/sounds/xylophone/x6.mp3'),
      // },
    };

    try {
      return soundFiles[instrumentId]?.[noteId];
    } catch (error) {
      return null;
    }
  };

  // Tocar som usando Web Audio API (fallback quando não há arquivo de áudio)
  const playWebAudioTone = (frequency: number, duration: number = 200) => {
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      // Configurar onda
      oscillator.type = 'sine';
      oscillator.frequency.value = frequency;

      // Envelope de volume (fade in/out)
      const now = ctx.currentTime;
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.3, now + 0.01);
      gainNode.gain.linearRampToValueAtTime(0.2, now + duration / 1000 - 0.05);
      gainNode.gain.linearRampToValueAtTime(0, now + duration / 1000);

      // Tocar
      oscillator.start(now);
      oscillator.stop(now + duration / 1000);
    } catch (error) {
      console.error('Error playing web audio tone:', error);
    }
  };

  // Tocar arquivo de áudio (funciona no mobile e web)
  const playAudioFile = async (instrumentId: string, noteId: string, frequency: number) => {
    try {
      const soundFile = getSoundFile(instrumentId, noteId);

      if (soundFile) {
        // Usar arquivo de áudio real
        const { sound } = await Audio.Sound.createAsync(soundFile, {
          shouldPlay: true,
        });

        // Descarregar após tocar
        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.didJustFinish) {
            sound.unloadAsync();
          }
        });
      } else {
        // Fallback para Web Audio API (sons sintetizados)
        playWebAudioTone(frequency, 200);
      }
    } catch (error) {
      // Se falhar ao carregar o arquivo, usar Web Audio API
      console.log('Using synthesized sound (audio file not found)');
      playWebAudioTone(frequency, 200);
    }
  };

  // Tocar nota com feedback visual, tátil e sonoro
  const playNote = async (noteId: string, frequency: number, instrumentId: string, duration: number = 200) => {
    try {
      // Feedback tátil
      if (Platform.OS === 'ios') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } else if (Platform.OS === 'android') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }

      // Tocar som (arquivo de áudio real ou sintetizado)
      await playAudioFile(instrumentId, noteId, frequency);

      // Adicionar à lista de notas ativas
      setActiveNotes(prev => new Set(prev).add(noteId));

      // Animação de escala
      const animValue = getAnimatedValue(noteId);
      Animated.sequence([
        Animated.timing(animValue, {
          toValue: 0.85,
          duration: 100,
          useNativeDriver: false,
        }),
        Animated.timing(animValue, {
          toValue: 1,
          duration: 100,
          useNativeDriver: false,
        }),
      ]).start();

      // Remover da lista após a duração
      setTimeout(() => {
        setActiveNotes(prev => {
          const next = new Set(prev);
          next.delete(noteId);
          return next;
        });
      }, duration);

    } catch (error) {
      console.error('Error playing note:', error);
    }
  };

  const handleNotePress = (note: Note) => {
    // Tocar o som com feedback visual e tátil
    playNote(note.id, note.frequency, selectedInstrument.id);

    // Se estiver gravando, adicionar à sequência
    if (isRecording && recordingStartTime.current !== null) {
      const timestamp = Date.now() - recordingStartTime.current;
      const newNote: RecordedNote = {
        instrumentId: selectedInstrument.id,
        noteId: note.id,
        timestamp,
        color: selectedInstrument.color,
        emoji: note.emoji || selectedInstrument.emoji,
      };
      setRecordedNotes(prev => [...prev, newNote]);
    }
  };

  const startRecording = () => {
    setRecordedNotes([]);
    setIsRecording(true);
    recordingStartTime.current = Date.now();
  };

  const stopRecording = () => {
    setIsRecording(false);
    recordingStartTime.current = null;
  };

  const playRecording = async () => {
    if (recordedNotes.length === 0 || isPlaying) return;

    setIsPlaying(true);

    // Reproduzir notas com o timing correto
    let lastTimestamp = 0;
    for (const note of recordedNotes) {
      const instrument = INSTRUMENTS.find(i => i.id === note.instrumentId);
      const noteData = instrument?.notes.find(n => n.id === note.noteId);

      if (noteData && instrument) {
        // Aguardar a diferença de tempo desde a última nota
        const delay = note.timestamp - lastTimestamp;
        await new Promise(resolve => setTimeout(resolve, delay));
        await playNote(noteData.id, noteData.frequency, instrument.id);
        lastTimestamp = note.timestamp;
      }
    }

    // Aguardar um pouco antes de resetar o estado
    setTimeout(() => {
      setIsPlaying(false);
    }, 500);
  };

  const clearRecording = () => {
    setRecordedNotes([]);
    if (isRecording) {
      stopRecording();
    }
  };

  const handleBack = () => {
    router.push('/(tabs)');
  };

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2', '#f093fb']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>{t('games.common.back')}</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>{t('games.musicCreator.title')}</Text>

          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => setShowMenu(true)}
          >
            <Text style={styles.menuButtonText}>☰</Text>
          </TouchableOpacity>
        </View>

        {/* Seletor de Instrumentos */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.instrumentSelector}
          contentContainerStyle={styles.instrumentSelectorContent}
        >
          {INSTRUMENTS.map((instrument) => (
            <TouchableOpacity
              key={instrument.id}
              style={[
                styles.instrumentButton,
                { backgroundColor: instrument.color },
                selectedInstrument.id === instrument.id && styles.instrumentButtonSelected,
              ]}
              onPress={() => setSelectedInstrument(instrument)}
            >
              <Text style={styles.instrumentEmoji}>{instrument.emoji}</Text>
              <Text style={styles.instrumentName}>{instrument.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Área de Notas */}
        <View style={styles.notesContainer}>
          <View style={styles.notesGrid}>
            {selectedInstrument.notes.map((note) => {
              const animValue = getAnimatedValue(note.id);
              const isActive = activeNotes.has(note.id);

              return (
                <Animated.View
                  key={note.id}
                  style={{
                    transform: [{ scale: animValue }],
                  }}
                >
                  <TouchableOpacity
                    style={[
                      styles.noteButton,
                      { backgroundColor: selectedInstrument.color },
                      isActive && styles.noteButtonActive,
                    ]}
                    onPress={() => handleNotePress(note)}
                    activeOpacity={0.6}
                  >
                    {note.emoji ? (
                      <Text style={styles.noteEmoji}>{note.emoji}</Text>
                    ) : null}
                    <Text style={styles.noteName}>{note.name}</Text>
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>
        </View>

        {/* Indicador de Gravação */}
        {recordedNotes.length > 0 && (
          <View style={styles.recordingIndicator}>
            <Text style={styles.recordingText}>
              {isRecording ? t('games.musicCreator.recording') : t('games.musicCreator.notesRecorded', { count: recordedNotes.length })}
            </Text>
          </View>
        )}

        {/* Controles */}
        <View style={styles.controlsContainer}>
          <View style={styles.controlsRow}>
            <TouchableOpacity
              style={[
                styles.controlButton,
                isRecording ? styles.stopButton : styles.recordButton,
              ]}
              onPress={isRecording ? stopRecording : startRecording}
            >
              <Text style={styles.controlEmoji}>{isRecording ? '⏹️' : '⏺️'}</Text>
              <Text style={styles.controlText}>
                {isRecording ? t('games.musicCreator.stop') : t('games.musicCreator.record')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.controlButton,
                styles.playButton,
                (recordedNotes.length === 0 || isPlaying) && styles.controlButtonDisabled,
              ]}
              onPress={playRecording}
              disabled={recordedNotes.length === 0 || isPlaying}
            >
              <Text style={styles.controlEmoji}>{isPlaying ? '⏸️' : '▶️'}</Text>
              <Text style={styles.controlText}>
                {isPlaying ? t('games.musicCreator.playing') : t('games.musicCreator.play')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.controlButton,
                styles.clearButton,
                recordedNotes.length === 0 && styles.controlButtonDisabled,
              ]}
              onPress={clearRecording}
              disabled={recordedNotes.length === 0}
            >
              <Text style={styles.controlEmoji}>🗑️</Text>
              <Text style={styles.controlText}>{t('games.musicCreator.clear')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Menu Lateral */}
        <Modal
          visible={showMenu}
          transparent
          animationType="fade"
          onRequestClose={() => setShowMenu(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowMenu(false)}
          >
            <TouchableOpacity
              style={styles.menuContent}
              activeOpacity={1}
              onPress={(e) => e.stopPropagation()}
            >
              <View style={styles.menuHeader}>
                <Text style={styles.menuTitle}>{t('games.musicCreator.help')}</Text>
                <TouchableOpacity onPress={() => setShowMenu(false)}>
                  <Text style={styles.menuClose}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.menuScroll}>
                <View style={styles.menuSection}>
                  <Text style={styles.menuSectionTitle}>💡 Sobre os sons:</Text>
                  <View style={styles.audioNotice}>
                    <Text style={styles.audioNoticeText}>
                      🔊 Para ativar sons reais no mobile, você precisa baixar arquivos de áudio.
                      {'\n\n'}
                      Veja o arquivo README.md na pasta assets/sounds/ para instruções detalhadas de download gratuito.
                      {'\n\n'}
                      Enquanto isso, você tem feedback tátil (vibração) e animações visuais!
                    </Text>
                  </View>
                </View>

                <View style={styles.menuSection}>
                  <Text style={styles.menuSectionTitle}>Como usar:</Text>

                  <View style={styles.menuItem}>
                    <Text style={styles.menuItemEmoji}>1️⃣</Text>
                    <Text style={styles.menuItemText}>
                      Escolha um instrumento na parte superior
                    </Text>
                  </View>

                  <View style={styles.menuItem}>
                    <Text style={styles.menuItemEmoji}>2️⃣</Text>
                    <Text style={styles.menuItemText}>
                      Toque nas notas para fazer sons
                    </Text>
                  </View>

                  <View style={styles.menuItem}>
                    <Text style={styles.menuItemEmoji}>3️⃣</Text>
                    <Text style={styles.menuItemText}>
                      Pressione GRAVAR para salvar sua música
                    </Text>
                  </View>

                  <View style={styles.menuItem}>
                    <Text style={styles.menuItemEmoji}>4️⃣</Text>
                    <Text style={styles.menuItemText}>
                      Pressione TOCAR para ouvir sua criação
                    </Text>
                  </View>
                </View>

                <View style={styles.menuSection}>
                  <Text style={styles.menuSectionTitle}>{t('games.musicCreator.instruments')}</Text>
                  {INSTRUMENTS.map(instrument => (
                    <View key={instrument.id} style={styles.menuItem}>
                      <Text style={styles.menuItemEmoji}>{instrument.emoji}</Text>
                      <Text style={styles.menuItemText}>{instrument.name}</Text>
                    </View>
                  ))}
                </View>
              </ScrollView>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
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
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  menuButton: {
    padding: 8,
  },
  menuButtonText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '600',
  },
  instrumentSelector: {
    maxHeight: 120,
    marginVertical: 16,
  },
  instrumentSelectorContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  instrumentButton: {
    width: 100,
    height: 100,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  instrumentButtonSelected: {
    borderColor: '#FFD700',
    transform: [{ scale: 1.05 }],
  },
  instrumentEmoji: {
    fontSize: 40,
    marginBottom: 4,
  },
  instrumentName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  notesContainer: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  notesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  noteButton: {
    width: (width - 64) / 4,
    height: (width - 64) / 4,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  noteButtonActive: {
    borderColor: '#FFD700',
    borderWidth: 4,
    shadowOpacity: 0.5,
    shadowRadius: 12,
  },
  noteEmoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  noteName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  recordingIndicator: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  recordingText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  controlsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  controlsRow: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },
  controlButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    minHeight: 80,
  },
  recordButton: {
    backgroundColor: '#FF4444',
  },
  stopButton: {
    backgroundColor: '#666666',
  },
  playButton: {
    backgroundColor: '#4CAF50',
  },
  clearButton: {
    backgroundColor: '#FF9800',
  },
  controlButtonDisabled: {
    opacity: 0.4,
  },
  controlEmoji: {
    fontSize: 28,
    marginBottom: 4,
  },
  controlText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  menuContent: {
    width: '80%',
    height: '100%',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    backgroundColor: '#667eea',
  },
  menuTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  menuClose: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  menuScroll: {
    flex: 1,
  },
  menuSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  menuSectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  menuItemEmoji: {
    fontSize: 24,
  },
  menuItemText: {
    fontSize: 16,
    color: '#666',
    flex: 1,
  },
  audioNotice: {
    backgroundColor: '#FFF3CD',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  audioNoticeText: {
    fontSize: 14,
    color: '#856404',
    lineHeight: 20,
  },
});
