import { View, Text, TouchableOpacity, StyleSheet, Modal, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useRef, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/Colors';
import { useTranslation } from 'react-i18next';

interface MenuItem {
  id: string;
  title: string;
  icon: string;
  route?: string;
  action?: () => void;
}

export function HamburgerMenu() {
  const [visible, setVisible] = useState(false);
  const [languageSelectorVisible, setLanguageSelectorVisible] = useState(false);
  const router = useRouter();
  const { t } = useTranslation();
  const slideAnim = useRef(new Animated.Value(300)).current;

  const menuItems: MenuItem[] = [
    { id: 'home', title: t('menu.home'), icon: '🏠', route: '/(tabs)' },
    { id: 'worksheets', title: t('menu.worksheets'), icon: '📝', route: '/(tabs)/worksheets' },
    { id: 'parents', title: t('menu.parents'), icon: '👨‍👩‍👧', route: '/(tabs)/parents' },
    { id: 'language', title: t('menu.language'), icon: '🌐', action: () => setLanguageSelectorVisible(true) },
  ];

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handleMenuItemPress = async (item: MenuItem) => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      // Haptic not available
    }

    setVisible(false);

    if (item.action) {
      setTimeout(() => item.action!(), 300);
    } else if (item.route) {
      setTimeout(() => router.push(item.route as any), 300);
    }
  };

  const toggleMenu = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (error) {
      // Haptic not available
    }
    setVisible(!visible);
  };

  return (
    <>
      {/* Hamburger Button */}
      <TouchableOpacity
        style={styles.hamburgerButton}
        onPress={toggleMenu}
        activeOpacity={0.7}
      >
        <View style={styles.hamburgerIcon}>
          <View style={styles.hamburgerLine} />
          <View style={styles.hamburgerLine} />
          <View style={styles.hamburgerLine} />
        </View>
      </TouchableOpacity>

      {/* Menu Modal */}
      <Modal
        visible={visible}
        transparent
        animationType="none"
        onRequestClose={() => setVisible(false)}
      >
        {/* Backdrop */}
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={() => setVisible(false)}
        >
          {/* Menu Panel */}
          <Animated.View
            style={[
              styles.menuPanel,
              {
                transform: [{ translateX: slideAnim }],
              },
            ]}
          >
            <LinearGradient
              colors={['rgba(255, 248, 241, 0.98)', 'rgba(255, 248, 241, 0.95)']}
              style={styles.menuGradient}
            >
              {/* Menu Header */}
              <View style={styles.menuHeader}>
                <Text style={styles.menuTitle}>{t('menu.title')}</Text>
                <TouchableOpacity onPress={() => setVisible(false)} style={styles.closeButton}>
                  <Text style={styles.closeIcon}>✕</Text>
                </TouchableOpacity>
              </View>

              {/* Menu Items */}
              <View style={styles.menuItems}>
                {menuItems.map((item, index) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.menuItem}
                    onPress={() => handleMenuItemPress(item)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.menuItemContent}>
                      <Text style={styles.menuItemIcon}>{item.icon}</Text>
                      <Text style={styles.menuItemText}>{item.title}</Text>
                    </View>
                    <Text style={styles.menuItemArrow}>›</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </LinearGradient>
          </Animated.View>
        </TouchableOpacity>
      </Modal>

      {/* Language Selector - Import and use your existing LanguageSelector component */}
      {languageSelectorVisible && (
        <Modal
          visible={languageSelectorVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setLanguageSelectorVisible(false)}
        >
          <TouchableOpacity
            style={styles.backdrop}
            activeOpacity={1}
            onPress={() => setLanguageSelectorVisible(false)}
          >
            {/* Language selector content will go here */}
          </TouchableOpacity>
        </Modal>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  hamburgerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hamburgerIcon: {
    width: 20,
    height: 14,
    justifyContent: 'space-between',
  },
  hamburgerLine: {
    width: '100%',
    height: 2,
    backgroundColor: Colors.textInverse,
    borderRadius: 1,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  menuPanel: {
    width: 280,
    height: '100%',
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  menuGradient: {
    flex: 1,
    paddingTop: 60,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  menuTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    fontSize: 18,
    color: Colors.textSecondary,
    fontWeight: 'bold',
  },
  menuItems: {
    paddingTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border + '40',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  menuItemIcon: {
    fontSize: 24,
  },
  menuItemText: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.text,
  },
  menuItemArrow: {
    fontSize: 24,
    color: Colors.textSecondary,
    fontWeight: '300',
  },
});
