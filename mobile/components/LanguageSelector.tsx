import { View, Text, StyleSheet, Modal, TouchableOpacity, Pressable } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LanguageSelectorProps {
  visible: boolean;
  onClose: () => void;
}

const LANGUAGES = [
  { code: 'pt-BR', label: 'Português', flag: '🇧🇷' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
];

export function LanguageSelector({ visible, onClose }: LanguageSelectorProps) {
  const { i18n } = useTranslation();

  const handleLanguageSelect = async (languageCode: string) => {
    try {
      // Save preference to AsyncStorage
      await AsyncStorage.setItem('userLanguage', languageCode);

      // Change i18n language
      await i18n.changeLanguage(languageCode);

      // Close modal
      onClose();
    } catch (error) {
      console.error('Error saving language preference:', error);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.modalContainer} onStartShouldSetResponder={() => true}>
          <View style={styles.header}>
            <Text style={styles.title}>{i18n.t('parents.language')}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.languageList}>
            {LANGUAGES.map((language) => {
              const isSelected = i18n.language === language.code ||
                                 i18n.language.startsWith(language.code);

              return (
                <TouchableOpacity
                  key={language.code}
                  style={[
                    styles.languageOption,
                    isSelected && styles.languageOptionSelected,
                  ]}
                  onPress={() => handleLanguageSelect(language.code)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.flag}>{language.flag}</Text>
                  <Text
                    style={[
                      styles.languageLabel,
                      isSelected && styles.languageLabelSelected,
                    ]}
                  >
                    {language.label}
                  </Text>
                  {isSelected && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    width: '100%',
    maxWidth: 400,
    paddingVertical: 24,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.text,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  languageList: {
    gap: 12,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    backgroundColor: Colors.backgroundSecondary,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  languageOptionSelected: {
    backgroundColor: Colors.ctaLight,
    borderColor: Colors.cta,
  },
  flag: {
    fontSize: 28,
    marginRight: 12,
  },
  languageLabel: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  languageLabelSelected: {
    color: Colors.ctaDark,
    fontWeight: '700',
  },
  checkmark: {
    fontSize: 22,
    color: Colors.cta,
    fontWeight: 'bold',
  },
});
