# 🎮 Ludi - Educational App for Kids

Educational mobile app for children aged 1-6 with interactive games, activities, and parental controls.

## 🎯 What It Does

- **Educational Games**: ABC tracing, numbers, colors, shapes, puzzles, drawing, music, coloring
- **Multi-language**: Portuguese (BR), English, Spanish
- **Parent Dashboard**: Track progress and manage settings
- **Offline Mode**: Play without internet

## 🚀 Run Locally

### Requirements
- Node.js 18+
- iOS Simulator (Mac) or Android Emulator

### Start

```bash
cd mobile
npm install
npm start
```

Press `i` for iOS, `a` for Android, or scan QR code with Expo Go app.

## 📱 Publish to App Stores

### 1. Create Developer Accounts
- **Apple Developer**: $99/year at https://developer.apple.com
- **Google Play**: $25 one-time at https://play.google.com/console

### 2. Configure EAS Build

```bash
npm install -g eas-cli
cd mobile
eas login
eas init
```

### 3. Build

```bash
# iOS
eas build --platform ios --profile production

# Android
eas build --platform android --profile production

# Both
eas build --platform all --profile production
```

### 4. Submit

```bash
# iOS
eas submit --platform ios

# Android
eas submit --platform android
```

## 🛠️ Tech Stack

- **Mobile**: React Native + Expo SDK 54 + TypeScript
- **Navigation**: expo-router
- **State**: Zustand
- **Animations**: Lottie + Reanimated
- **i18n**: i18next

## 📂 Project Structure

```
mobile/
├── app/               # Screens (expo-router)
│   ├── (tabs)/       # Main app tabs
│   └── games/        # Game screens
├── components/       # Reusable components
├── lib/             # API, stores, utils
├── constants/       # Colors, Config
└── assets/          # Images, sounds, fonts
```

## 🎨 Development

### Add Sounds
See `mobile/assets/sounds/README.md` for download instructions.

### Add Coloring Pages
See `mobile/assets/coloring/README.md` for SVG processing guide.

### Design System
See `mobile/DESIGN_SYSTEM.md` for colors, gradients, and UI guidelines.

### Generate Letters
Use prompt in `mobile/AI_LETTER_GENERATION_PROMPT.md` with Claude/ChatGPT.

## ✅ Current Status

**Production Ready** - All technical requirements met:
- ✅ Expo SDK 54 (Xcode 26+ compatible)
- ✅ EAS Build configured
- ✅ iOS & Android native projects (managed)
- ✅ App icons (1024x1024px)
- ✅ Permissions configured
- ✅ 17/17 expo-doctor checks passed

## 📊 App Store Requirements

### Before Submitting
- [ ] Screenshots (multiple sizes)
- [ ] App description
- [ ] Privacy policy URL
- [ ] Keywords & category
- [ ] Content rating questionnaire

### Bundle Info
- **Bundle ID**: com.ludi.app
- **Version**: 1.0.0
- **Languages**: pt-BR, en, es

## 🔗 Links

- **Expo Docs**: https://docs.expo.dev
- **EAS Build**: https://docs.expo.dev/build/introduction/
- **App Store Connect**: https://appstoreconnect.apple.com
- **Google Play Console**: https://play.google.com/console

---

**Ready to publish!** 🚀
