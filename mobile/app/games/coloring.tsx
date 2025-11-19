import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import {
  Canvas,
  Image,
  useImage,
  SkImage,
  Skia,
} from '@shopify/react-native-skia';
import { useTranslation } from 'react-i18next';
import { Colors } from '@/constants/Colors';

const { width } = Dimensions.get('window');

// Paleta de cores vibrantes
const COLOR_PALETTE = [
  { name: 'Vermelho', color: '#FF0000' },
  { name: 'Azul', color: '#0000FF' },
  { name: 'Amarelo', color: '#FFFF00' },
  { name: 'Verde', color: '#00FF00' },
  { name: 'Laranja', color: '#FF9800' },
  { name: 'Roxo', color: '#9C27B0' },
  { name: 'Rosa', color: '#FF69B4' },
  { name: 'Marrom', color: '#8B4513' },
  { name: 'Preto', color: '#000000' },
  { name: 'Branco', color: '#FFFFFF' },
];

// Imagens para colorir
const COLORING_IMAGES = [
  {
    id: 'owl',
    name: '🦉 Coruja',
    image: require('@/assets/coloring/owl.png'),
  },
  {
    id: 'panda',
    name: '🐼 Panda',
    image: require('@/assets/coloring/panda.png'),
  },
  {
    id: 'cat',
    name: '🐱 Gato',
    image: require('@/assets/coloring/cat.png'),
  },
  {
    id: 'cat_food',
    name: '🍽️ Gato Comendo',
    image: require('@/assets/coloring/cat_food.png'),
  },
  {
    id: 'two_cats',
    name: '🐱🐱 Dois Gatos',
    image: require('@/assets/coloring/two_cats.png'),
  },
];

// Função flood fill com proteção de bordas
function floodFill(
  imageData: Uint8Array | Float32Array,
  x: number,
  y: number,
  width: number,
  height: number,
  fillColor: { r: number; g: number; b: number; a: number },
  tolerance: number = 10,
  originalImage?: Uint8Array | Float32Array
): Uint8Array {
  const newData = new Uint8Array(imageData);

  // Obter cor do pixel clicado
  const index = (y * width + x) * 4;
  const targetColor = {
    r: imageData[index],
    g: imageData[index + 1],
    b: imageData[index + 2],
    a: imageData[index + 3],
  };

  // Se já é a cor que queremos, não fazer nada
  if (
    Math.abs(targetColor.r - fillColor.r) <= tolerance &&
    Math.abs(targetColor.g - fillColor.g) <= tolerance &&
    Math.abs(targetColor.b - fillColor.b) <= tolerance &&
    Math.abs(targetColor.a - fillColor.a) <= tolerance
  ) {
    return newData;
  }

  // Função para verificar se um pixel é uma borda preta na imagem original
  const isOriginalBorder = (px: number, py: number): boolean => {
    if (!originalImage) return false;
    const idx = (py * width + px) * 4;
    const r = originalImage[idx];
    const g = originalImage[idx + 1];
    const b = originalImage[idx + 2];
    // Considera borda se for muito escuro (preto ou quase preto)
    return r < 50 && g < 50 && b < 50;
  };

  // Pilha para flood fill (evita recursão)
  const stack: Array<{ x: number; y: number }> = [{ x, y }];
  const visited = new Set<number>();

  const matchesTarget = (px: number, py: number): boolean => {
    if (px < 0 || px >= width || py < 0 || py >= height) return false;

    const idx = (py * width + px) * 4;
    if (visited.has(idx)) return false;

    // Não pintar sobre bordas originais
    if (isOriginalBorder(px, py)) return false;

    return (
      Math.abs(newData[idx] - targetColor.r) <= tolerance &&
      Math.abs(newData[idx + 1] - targetColor.g) <= tolerance &&
      Math.abs(newData[idx + 2] - targetColor.b) <= tolerance &&
      Math.abs(newData[idx + 3] - targetColor.a) <= tolerance
    );
  };

  while (stack.length > 0) {
    const point = stack.pop()!;
    const px = Math.floor(point.x);
    const py = Math.floor(point.y);

    if (!matchesTarget(px, py)) continue;

    const idx = (py * width + px) * 4;
    visited.add(idx);

    // Pintar o pixel
    newData[idx] = fillColor.r;
    newData[idx + 1] = fillColor.g;
    newData[idx + 2] = fillColor.b;
    newData[idx + 3] = fillColor.a;

    // Adicionar vizinhos
    stack.push({ x: px + 1, y: py });
    stack.push({ x: px - 1, y: py });
    stack.push({ x: px, y: py + 1 });
    stack.push({ x: px, y: py - 1 });
  }

  return newData;
}

export default function ColoringGame() {
  const { t } = useTranslation();
  const router = useRouter();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(COLOR_PALETTE[0].color);
  const [modifiedImage, setModifiedImage] = useState<SkImage | null>(null);
  const [originalPixels, setOriginalPixels] = useState<Uint8Array | Float32Array | null>(null);
  const [currentImageKey, setCurrentImageKey] = useState(0);

  const currentImage = COLORING_IMAGES[selectedImageIndex];

  // Carregar todas as imagens
  const images = [
    useImage(COLORING_IMAGES[0].image), // owl
    useImage(COLORING_IMAGES[1].image), // panda
    useImage(COLORING_IMAGES[2].image), // cat
    useImage(COLORING_IMAGES[3].image), // cat_food
    useImage(COLORING_IMAGES[4].image), // two_cats
  ];

  const canvasSize = 400;

  // Selecionar a imagem correta baseado no índice
  const sourceImage = images[selectedImageIndex];

  // Resetar pixels originais quando a imagem muda
  useEffect(() => {
    setOriginalPixels(null);
    setModifiedImage(null);
    setCurrentImageKey(selectedImageIndex);
  }, [selectedImageIndex]);

  const handleTouchEnd = (x: number, y: number) => {
    if (!sourceImage) return;

    try {
      // Carregar pixels originais na primeira vez
      if (!originalPixels) {
        try {
          const imageInfo = sourceImage.getImageInfo();
          const origPixels = sourceImage.readPixels(0, 0, imageInfo);
          if (origPixels) {
            setOriginalPixels(origPixels);
          }
        } catch (err) {
          console.error('Erro ao carregar pixels originais:', err);
        }
      }

      // Usar a imagem modificada ou a original
      const workingImage = modifiedImage || sourceImage;

      // Ler pixels da imagem
      const imageInfo = workingImage.getImageInfo();
      const pixels = workingImage.readPixels(0, 0, imageInfo);

      if (!pixels) {
        Alert.alert('Erro', 'Não foi possível ler os pixels da imagem');
        return;
      }

      // Converter coordenadas de tela para coordenadas da imagem
      const scaleX = imageInfo.width / canvasSize;
      const scaleY = imageInfo.height / canvasSize;
      const imgX = Math.floor(x * scaleX);
      const imgY = Math.floor(y * scaleY);

      // Converter cor hex para RGB
      const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result
          ? {
              r: parseInt(result[1], 16),
              g: parseInt(result[2], 16),
              b: parseInt(result[3], 16),
              a: 255,
            }
          : { r: 0, g: 0, b: 0, a: 255 };
      };

      const fillColor = hexToRgb(selectedColor);

      // Aplicar flood fill com proteção de bordas originais
      const newPixels = floodFill(
        pixels,
        imgX,
        imgY,
        imageInfo.width,
        imageInfo.height,
        fillColor,
        5, // tolerância - baixa para respeitar bordas pretas
        originalPixels || undefined // passar pixels originais para proteger bordas
      );

      if (!newPixels) {
        return;
      }

      // Criar nova imagem com os pixels modificados
      const data = Skia.Data.fromBytes(newPixels);
      const newImage = Skia.Image.MakeImage(
        {
          width: imageInfo.width,
          height: imageInfo.height,
          colorType: imageInfo.colorType,
          alphaType: imageInfo.alphaType,
        },
        data,
        imageInfo.width * 4
      );

      if (newImage) {
        setModifiedImage(newImage);
        setCurrentImageKey(selectedImageIndex);
      }
    } catch (error) {
      console.error('Erro ao aplicar flood fill:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao colorir a imagem');
    }
  };

  const tap = Gesture.Tap()
    .onEnd((event) => {
      runOnJS(handleTouchEnd)(event.x, event.y);
    });

  const handleClear = () => {
    setModifiedImage(null);
    setOriginalPixels(null);
  };

  const handleBack = () => {
    router.push('/(tabs)');
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % COLORING_IMAGES.length);
    setModifiedImage(null);
    setOriginalPixels(null);
  };

  const handlePreviousImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + COLORING_IMAGES.length) % COLORING_IMAGES.length);
    setModifiedImage(null);
    setOriginalPixels(null);
  };

  // Usar imagem modificada se existir, senão usar a original
  // Mas garantir que a imagem modificada pertence à imagem atual
  const displayImage = (modifiedImage && currentImageKey === selectedImageIndex)
    ? modifiedImage
    : sourceImage;

  return (
    <LinearGradient colors={['#A855F7', '#EC4899']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>{t('games.common.back')}</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>{t('games.coloring.title')}</Text>

          <View style={styles.headerSpacer} />
        </View>

        {/* Navegação de Desenhos */}
        <View style={styles.imageNav}>
          <TouchableOpacity style={styles.navButton} onPress={handlePreviousImage}>
            <Text style={styles.navButtonText}>←</Text>
          </TouchableOpacity>

          <Text style={styles.imageTitle}>{currentImage.name}</Text>

          <TouchableOpacity style={styles.navButton} onPress={handleNextImage}>
            <Text style={styles.navButtonText}>→</Text>
          </TouchableOpacity>
        </View>

        {/* Canvas de Colorir */}
        <View style={styles.canvasContainer}>
          <View style={styles.canvasWrapper}>
            <GestureDetector gesture={tap} key={`gesture-${selectedImageIndex}`}>
              <Canvas
                style={{ width: canvasSize, height: canvasSize }}
                key={`canvas-${selectedImageIndex}`}
              >
                {displayImage && (
                  <Image
                    image={displayImage}
                    x={0}
                    y={0}
                    width={canvasSize}
                    height={canvasSize}
                    fit="contain"
                  />
                )}
              </Canvas>
            </GestureDetector>
          </View>
        </View>

        {/* Ferramentas */}
        <View style={styles.toolsContainer}>
          {/* Botões de Ação */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton} onPress={handleClear}>
              <Text style={styles.actionButtonEmoji}>🗑️</Text>
              <Text style={styles.actionButtonText}>{t('games.common.clear')}</Text>
            </TouchableOpacity>
          </View>

          {/* Paleta de Cores */}
          <View style={styles.colorsSection}>
            <Text style={styles.colorsSectionTitle}>{t('games.coloring.chooseColor')}</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.colorsScrollContent}
            >
              {COLOR_PALETTE.map((colorItem) => (
                <TouchableOpacity
                  key={colorItem.color}
                  style={[
                    styles.colorButton,
                    { backgroundColor: colorItem.color },
                    selectedColor === colorItem.color && styles.colorButtonSelected,
                  ]}
                  onPress={() => setSelectedColor(colorItem.color)}
                >
                  {selectedColor === colorItem.color && (
                    <Text style={styles.colorButtonCheck}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
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
  headerSpacer: {
    width: 80,
  },
  imageNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  navButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navButtonText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
  },
  imageTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  canvasContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  canvasWrapper: {
    width: 400,
    height: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
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
    marginBottom: 20,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  actionButtons: {
    marginBottom: 12,
  },
  actionButton: {
    backgroundColor: Colors.cta,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  actionButtonEmoji: {
    fontSize: 20,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  colorsSection: {
    marginTop: 12,
  },
  colorsSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  colorsScrollContent: {
    gap: 12,
    paddingHorizontal: 4,
  },
  colorButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#DDD',
  },
  colorButtonSelected: {
    borderWidth: 4,
    borderColor: '#FFD700',
  },
  colorButtonCheck: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
