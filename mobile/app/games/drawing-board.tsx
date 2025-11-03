import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Modal,
  ScrollView,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Canvas, Path, Skia, SkPath } from '@shopify/react-native-skia';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useTranslation } from 'react-i18next';
import { Colors } from '@/constants/Colors';

const { width, height } = Dimensions.get('window');
const CANVAS_WIDTH = width - 40;
const CANVAS_HEIGHT = height - 180;

interface DrawPath {
  path: SkPath;
  color: string;
  width: number;
}

// Paleta de cores vibrantes para crianças
const COLOR_PALETTE = [
  { name: 'Vermelho', color: '#FF0000', emoji: '🔴' },
  { name: 'Azul', color: '#0000FF', emoji: '🔵' },
  { name: 'Amarelo', color: '#FFFF00', emoji: '🟡' },
  { name: 'Verde', color: '#00FF00', emoji: '🟢' },
  { name: 'Laranja', color: '#FF9800', emoji: '🟠' },
  { name: 'Roxo', color: '#9C27B0', emoji: '🟣' },
  { name: 'Rosa', color: '#FF69B4', emoji: '🩷' },
  { name: 'Marrom', color: '#8B4513', emoji: '🟤' },
  { name: 'Preto', color: '#000000', emoji: '⚫' },
  { name: 'Branco', color: '#FFFFFF', emoji: '⚪' },
];

// Espessuras de pincel
const BRUSH_SIZES = [
  { name: 'Fino', size: 2, emoji: '✏️' },
  { name: 'Médio', size: 5, emoji: '🖊️' },
  { name: 'Grosso', size: 10, emoji: '🖍️' },
  { name: 'Muito Grosso', size: 20, emoji: '🖌️' },
];

export default function DrawingBoardGame() {
  const { t } = useTranslation();
  const router = useRouter();
  const [paths, setPaths] = useState<DrawPath[]>([]);
  const [selectedColor, setSelectedColor] = useState(COLOR_PALETTE[8].color); // Preto
  const [selectedBrushSize, setSelectedBrushSize] = useState(BRUSH_SIZES[1].size); // Médio
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleClear = () => {
    setPaths([]);
  };

  const handleUndo = () => {
    if (paths.length > 0) {
      setPaths(prev => prev.slice(0, -1));
    }
  };

  const handleBack = () => {
    router.push('/(tabs)');
  };

  // Gesture handler para desenho
  const pan = Gesture.Pan()
    .onStart((event) => {
      const newPath = Skia.Path.Make();
      newPath.moveTo(event.x, event.y);
      setPaths(prev => [...prev, {
        path: newPath,
        color: selectedColor,
        width: selectedBrushSize,
      }]);
    })
    .onUpdate((event) => {
      setPaths(prev => {
        const updatedPaths = [...prev];
        const currentPath = updatedPaths[updatedPaths.length - 1];
        if (currentPath) {
          currentPath.path.lineTo(event.x, event.y);
        }
        return updatedPaths;
      });
    })
    .runOnJS(true);

  return (
    <LinearGradient
      colors={['#F59E0B', '#EF4444']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>{t('games.common.back')}</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>{t('games.drawingBoard.title')}</Text>

          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => setIsDrawerOpen(true)}
          >
            <Text style={styles.menuButtonText}>☰</Text>
          </TouchableOpacity>
        </View>

        {/* Canvas de Desenho */}
        <View style={styles.canvasContainer}>
          <GestureDetector gesture={pan}>
            <View style={styles.canvas}>
              <Canvas style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}>
                {/* Fundo branco */}
                <Path
                  path={Skia.Path.Make().addRect(Skia.XYWHRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT))}
                  color="#FFFFFF"
                />

                {/* Caminhos desenhados */}
                {paths.map((drawPath, index) => (
                  <Path
                    key={`path-${index}`}
                    path={drawPath.path}
                    color={drawPath.color}
                    style="stroke"
                    strokeWidth={drawPath.width}
                    strokeCap="round"
                    strokeJoin="round"
                  />
                ))}
              </Canvas>
            </View>
          </GestureDetector>
        </View>

        {/* Menu Lateral (Drawer) */}
        <Modal
          visible={isDrawerOpen}
          transparent
          animationType="fade"
          onRequestClose={() => setIsDrawerOpen(false)}
        >
          <TouchableOpacity
            style={styles.drawerOverlay}
            activeOpacity={1}
            onPress={() => setIsDrawerOpen(false)}
          >
            <TouchableOpacity
              style={styles.drawerContent}
              activeOpacity={1}
              onPress={(e) => e.stopPropagation()}
            >
              <ScrollView style={styles.drawerScroll}>
                {/* Header do Drawer */}
                <View style={styles.drawerHeader}>
                  <Text style={styles.drawerTitle}>{t('games.drawingBoard.tools')}</Text>
                  <TouchableOpacity onPress={() => setIsDrawerOpen(false)}>
                    <Text style={styles.drawerClose}>✕</Text>
                  </TouchableOpacity>
                </View>

                {/* Botões de Ação */}
                <View style={styles.drawerSection}>
                  <Text style={styles.drawerSectionTitle}>{t('games.drawingBoard.actions')}</Text>
                  <TouchableOpacity
                    style={[styles.drawerActionButton, paths.length === 0 && styles.actionButtonDisabled]}
                    onPress={() => {
                      handleUndo();
                    }}
                    disabled={paths.length === 0}
                  >
                    <Text style={styles.actionButtonEmoji}>↩️</Text>
                    <Text style={styles.drawerActionText}>{t('games.drawingBoard.undo')}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.drawerActionButton}
                    onPress={() => {
                      handleClear();
                    }}
                  >
                    <Text style={styles.actionButtonEmoji}>🗑️</Text>
                    <Text style={styles.drawerActionText}>{t('games.drawingBoard.clearAll')}</Text>
                  </TouchableOpacity>
                </View>

                {/* Espessura do Pincel */}
                <View style={styles.drawerSection}>
                  <Text style={styles.drawerSectionTitle}>{t('games.drawingBoard.brushThickness')}</Text>
                  <View style={styles.brushSizesRow}>
                    {BRUSH_SIZES.map((brush) => (
                      <View key={brush.size} style={styles.brushSizeContainer}>
                        <TouchableOpacity
                          style={[
                            styles.brushSizeButton,
                            selectedBrushSize === brush.size && styles.brushSizeButtonSelected,
                          ]}
                          onPress={() => setSelectedBrushSize(brush.size)}
                        >
                          <Text style={styles.brushSizeEmoji}>{brush.emoji}</Text>
                        </TouchableOpacity>
                        <Text style={styles.brushSizeName}>{brush.name}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Paleta de Cores */}
                <View style={styles.drawerSection}>
                  <Text style={styles.drawerSectionTitle}>{t('games.drawingBoard.colors')}</Text>
                  <View style={styles.colorsGrid}>
                    {COLOR_PALETTE.map((colorItem) => (
                      <TouchableOpacity
                        key={colorItem.color}
                        style={[
                          styles.colorButtonLarge,
                          { backgroundColor: colorItem.color },
                          selectedColor === colorItem.color && styles.colorButtonSelected,
                          colorItem.color === '#FFFFFF' && styles.colorButtonWhite,
                        ]}
                        onPress={() => setSelectedColor(colorItem.color)}
                      >
                        {selectedColor === colorItem.color && (
                          <Text style={styles.colorButtonCheck}>✓</Text>
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
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
  canvasContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  canvas: {
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    overflow: 'hidden',
  },
  toolsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: Colors.cta,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  actionButtonDisabled: {
    backgroundColor: '#CCCCCC',
    opacity: 0.5,
  },
  actionButtonEmoji: {
    fontSize: 20,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  toolSection: {
    marginBottom: 12,
  },
  toolSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  brushSizesRow: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-around',
  },
  brushSizeContainer: {
    alignItems: 'center',
    gap: 8,
  },
  brushSizeButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#DDD',
  },
  brushSizeButtonSelected: {
    backgroundColor: '#E8F5E9',
    borderColor: '#4CAF50',
    borderWidth: 3,
  },
  brushSizeEmoji: {
    fontSize: 28,
  },
  colorsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  colorButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#DDD',
  },
  colorButtonWhite: {
    borderColor: '#999',
  },
  colorButtonSelected: {
    borderWidth: 4,
    borderColor: '#FFD700',
  },
  colorButtonCheck: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  // Drawer styles
  drawerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  drawerContent: {
    width: '80%',
    height: '100%',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  drawerScroll: {
    flex: 1,
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    backgroundColor: '#F59E0B',
  },
  drawerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  drawerClose: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  drawerSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  drawerSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  drawerActionButton: {
    backgroundColor: Colors.cta,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 12,
  },
  drawerActionText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  brushSizeName: {
    fontSize: 11,
    color: '#666',
    fontWeight: '600',
    textAlign: 'center',
  },
  colorsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  colorButtonLarge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#DDD',
  },
});
