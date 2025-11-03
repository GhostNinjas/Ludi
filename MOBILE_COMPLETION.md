# Mobile App Completion Guide

This document provides the structure and implementation guidance for completing the React Native mobile app.

## Project Status

### ✅ Completed
- Project structure & configuration
- Package.json with all dependencies
- TypeScript configuration
- API client with auth interceptors
- Authentication store (Zustand)
- i18n setup (pt-BR, en, es)
- Storage utilities (SecureStore + AsyncStorage)
- Constants (Colors, Config)
- Root layout and navigation setup

### ⏳ To Complete

## Screens to Implement

### 1. Authentication Screens

**app/(auth)/login.tsx**
```tsx
// Login screen with email/password form
- Email input
- Password input
- Login button
- "Forgot password" link
- "Don't have account? Register" link
- Form validation with react-hook-form + zod
- Error handling
- Loading state
```

**app/(auth)/register.tsx**
```tsx
// Registration screen
- Email input
- Password input
- Confirm password input
- Language selector (pt-BR, en, es)
- Register button
- "Already have account? Login" link
- Form validation
- Terms & privacy checkbox
```

### 2. Profile/Onboarding Screens

**app/(auth)/onboarding.tsx**
```tsx
// Multi-step onboarding wizard
- Welcome screen
- Create child profile (name, age, avatar)
- Select interests (colors, numbers, animals, etc.)
- Quick tutorial (swipe gestures, navigation)
- Completion screen
- Save profile to API
```

**app/(tabs)/(home)/create-profile.tsx**
```tsx
// Create/edit child profile
- Name input
- Age range selector (1-2, 3-4, 5-6)
- Avatar picker (grid of avatars)
- Interests selection (multi-select chips)
- Save button
- Delete button (if editing)
- Premium check for multiple profiles
```

### 3. Home/Kids Area

**app/(tabs)/(home)/index.tsx**
```tsx
// Kids home screen
- Profile selector (if multiple profiles)
- Welcome message with child's name
- "Continue where you left off" card
- Category grid:
  - ABC & Letters
  - Numbers & Counting
  - Colors & Shapes
  - Puzzles
  - Guided Drawing
  - Interactive Stories
  - Memory Game
  - Pattern Recognition
  - Sorting Game
  - Music & Rhythm
- Streak indicator
- Total stars
- Colorful, kid-friendly UI
- Large touch targets (min 60x60)
```

**app/(tabs)/(home)/game/[slug].tsx**
```tsx
// Dynamic game screen
- Load game component based on slug
- Game header (progress, stars, timer)
- Exit button (with confirmation)
- Pause button
- Game completion modal
- Progress tracking (POST to /api/progress)
- Sound effects & TTS
```

### 4. Game Components

All game components in `components/games/`:

**ABCTracing.tsx**
```tsx
// Letter tracing game
- Display letter (large)
- Tracing guide with dots
- Touch tracking with PanGestureHandler
- Checkpoint validation
- TTS pronunciation
- Completion feedback (stars, animation)
- Next letter button
- Difficulty: uppercase → lowercase → words
```

**NumberCounting.tsx**
```tsx
// Counting game
- Display objects to count (1-10)
- Number options (buttons or drag targets)
- Drag and drop interaction
- Audio reinforcement ("one", "two", etc.)
- Success animation
- Progressive difficulty
```

**ColorMatching.tsx**
```tsx
// Color identification
- Display color name or object
- Color options (swatches)
- Match game (drag colored items to correct bins)
- Audio feedback
- Real-world object association
```

**ShapeMatching.tsx**
```tsx
// Shape recognition
- Show shape
- Multiple choice or drag-drop
- Shape sorting (by type, size)
- Combination puzzles (fit shapes in holes)
```

**Puzzles.tsx**
```tsx
// Jigsaw puzzles
- 4-12 pieces (based on age/difficulty)
- Drag pieces with gesture handler
- Snap to grid when close
- Visual hints (outline)
- Completion celebration
- Progressive unlocking
```

**GuidedDrawing.tsx**
```tsx
// Step-by-step drawing
- Canvas component (react-native-svg)
- Guide overlay
- Drawing tools (pencil, eraser, colors)
- Step-by-step instructions
- Save artwork to gallery
- Share functionality
```

**InteractiveStory.tsx**
```tsx
// Animated stories
- Lottie animations or image sequences
- Audio narration (TTS or pre-recorded)
- Choice points (tap to choose)
- Simple educational themes
- Replay option
```

**MemoryGame.tsx**
```tsx
// Card matching game
- Grid of face-down cards (6-20)
- Flip animation
- Match detection
- Score tracking (moves, time)
- Themed card sets
```

**PatternRecognition.tsx**
```tsx
// Complete the pattern
- Display sequence (visual/audio)
- User completes missing element
- Progressive complexity
```

**SortingGame.tsx**
```tsx
// Sorting activity
- Items to sort (by color, size, shape, category)
- Bins/categories
- Drag and drop
- Timed and untimed modes
```

**MusicRhythm.tsx**
```tsx
// Music game
- Simple instrument (xylophone, piano)
- Rhythm matching
- Nursery rhyme learning
- Sound recognition
```

### 5. Worksheets Section

**app/(tabs)/(worksheets)/index.tsx**
```tsx
// Worksheets gallery
- Filter by age range
- Filter by category (tracing, coloring, counting)
- Grid of worksheet cards with thumbnails
- Premium badge on locked items
- Download button
- Offline indicator (already downloaded)
```

**app/(tabs)/(worksheets)/[id].tsx**
```tsx
// Worksheet detail
- Large preview image
- Title and description
- Age range indicator
- Download button
- Share button (via Sharing API)
- Print instructions
- Check premium access
- Download to device (expo-file-system)
- Mark as downloaded for offline
```

**components/worksheets/WorksheetCard.tsx**
```tsx
// Reusable worksheet card component
- Thumbnail image
- Title
- Age range badge
- Premium lock icon
- Download icon/status
- OnPress handler
```

### 6. Parent Dashboard

**app/(tabs)/(parents)/_layout.tsx**
```tsx
// Parental gate before entering parent area
- Math challenge: "What is 7 + 5?"
- Or long-press button (3 seconds)
- Block access if failed
- Navigate to dashboard on success
```

**app/(tabs)/(parents)/index.tsx**
```tsx
// Parent dashboard home
- Profile selector (view stats per child)
- Summary cards:
  - Total sessions this week
  - Total time spent
  - Average accuracy
  - Streak days
  - Stars earned
- Recent activity list
- Quick actions:
  - View detailed reports
  - Manage profiles
  - Settings
  - Subscription
```

**app/(tabs)/(parents)/progress/[profileId].tsx**
```tsx
// Detailed progress for a child
- Time range selector (7, 30, 90 days)
- Charts:
  - Sessions per day (bar chart)
  - Accuracy trend (line chart)
  - Time by category (pie chart)
- Module breakdown (list with stats)
- Export report (PDF/CSV)
- Recommendations section
```

**app/(tabs)/(parents)/settings.tsx**
```tsx
// Parent settings
- Language selection
- Difficulty override per profile
- Content filtering (block specific modules)
- Accessibility settings:
  - High contrast mode
  - Large text
  - Mute sounds
  - Enable/disable TTS
- Privacy settings
- Account management (email, password)
- Logout
```

### 7. Subscription/Paywall

**app/subscription/paywall.tsx**
```tsx
// Paywall modal/screen
- Hero section (benefits of Premium)
- Features list:
  - All games unlocked
  - Unlimited worksheets
  - Up to 5 profiles
  - Detailed reports
  - Offline mode
- Pricing cards:
  - Monthly ($9.99)
  - Annual ($79.99) - save 33%
- 7-day free trial badge
- Subscribe button
- Restore purchases link
- Terms & privacy links
- Close button (if modal)
```

**app/subscription/manage.tsx**
```tsx
// Manage subscription
- Current plan status
- Renewal date
- Cancel subscription button
- Change plan
- Billing history
- Contact support
```

## Key Components Library

### components/common/

**Button.tsx**
```tsx
// Reusable button with variants
- Primary, secondary, outline
- Sizes: small, medium, large
- Loading state
- Disabled state
- Haptic feedback on press
- Accessible (role, label)
```

**Card.tsx**
```tsx
// Card container component
- Shadow/elevation
- Border radius
- Padding variants
- Touchable variant
```

**ProgressBar.tsx**
```tsx
// Progress indicator
- Animated progress
- Color variants
- Stars overlay (for games)
```

**ParentalGate.tsx**
```tsx
// Reusable parental verification
- Math challenge or long-press
- Configurable difficulty
- Success/failure callbacks
- Prevent accidental access by kids
```

**LockBadge.tsx**
```tsx
// Premium lock indicator
- Lock icon
- "Premium" text
- Touchable to show upgrade modal
```

## Stores (Zustand)

### lib/store/profileStore.ts
```tsx
// Profile management store
- profiles: Profile[]
- currentProfile: Profile | null
- fetchProfiles()
- createProfile(data)
- updateProfile(id, data)
- deleteProfile(id)
- selectProfile(id)
```

### lib/store/progressStore.ts
```tsx
// Progress tracking store
- progress: Progress[]
- submitProgress(data)
- getProgressForProfile(profileId)
- getSummary(profileId, days)
- syncOfflineProgress() // Sync queued progress when online
```

### lib/store/settingsStore.ts
```tsx
// App settings store
- locale: string
- highContrast: boolean
- soundEnabled: boolean
- ttsEnabled: boolean
- volume: number
- updateSettings(settings)
- loadSettings() // From AsyncStorage
```

### lib/store/subscriptionStore.ts
```tsx
// Subscription state
- isPremium: boolean
- plan: 'free' | 'premium'
- trialEndsAt: Date | null
- renewalAt: Date | null
- checkSubscription()
- subscribe(plan)
- restore()
```

## API Modules

### lib/api/profiles.ts
```tsx
export const profilesApi = {
  getAll: () => apiClient.get('/profiles'),
  getById: (id: number) => apiClient.get(`/profiles/${id}`),
  create: (data: CreateProfileData) => apiClient.post('/profiles', data),
  update: (id: number, data: UpdateProfileData) => apiClient.put(`/profiles/${id}`, data),
  delete: (id: number) => apiClient.delete(`/profiles/${id}`),
};
```

### lib/api/modules.ts
```tsx
export const modulesApi = {
  getAll: (params?: FilterParams) => apiClient.get('/catalog/modules', params),
  getBySlug: (slug: string) => apiClient.get(`/catalog/modules/${slug}`),
};
```

### lib/api/worksheets.ts
```tsx
export const worksheetsApi = {
  getAll: (params?: FilterParams) => apiClient.get('/catalog/worksheets', params),
  getById: (id: number) => apiClient.get(`/catalog/worksheets/${id}`),
  getDownloadUrl: (id: number) => apiClient.get(`/catalog/worksheets/${id}/download`),
};
```

### lib/api/progress.ts
```tsx
export const progressApi = {
  submit: (data: ProgressData) => apiClient.post('/progress', data),
  getByProfile: (profileId: number) => apiClient.get(`/progress/profile/${profileId}`),
  getSummary: (profileId: number, days: number) =>
    apiClient.get(`/progress/profile/${profileId}/summary`, { days }),
};
```

### lib/api/subscriptions.ts
```tsx
export const subscriptionsApi = {
  getStatus: () => apiClient.get('/subscriptions/status'),
  verifyReceipt: (receipt: string, provider: 'apple' | 'google') =>
    apiClient.post('/subscriptions/verify-receipt', { receipt, provider }),
  restore: () => apiClient.post('/subscriptions/restore'),
};
```

## Utilities

### lib/utils/analytics.ts
```tsx
// Analytics tracking
export const trackEvent = (event: string, properties?: object) => {
  // Firebase Analytics
  // Segment
  // Internal API
};

// Events:
// - app_opened
// - profile_created
// - game_started
// - game_completed
// - worksheet_downloaded
// - paywall_shown
// - subscription_started
```

### lib/utils/tts.ts
```tsx
// Text-to-speech utility
import * as Speech from 'expo-speech';

export const speak = async (text: string, options?: SpeechOptions) => {
  if (!settingsStore.getState().ttsEnabled) return;

  await Speech.speak(text, {
    language: getCurrentLocale(),
    rate: Config.TTS_RATE,
    ...options,
  });
};
```

### lib/utils/sound.ts
```tsx
// Sound effects utility
import { Audio } from 'expo-av';

export const playSound = async (soundFile: string) => {
  if (!settingsStore.getState().soundEnabled) return;

  const { sound } = await Audio.Sound.createAsync(soundFile);
  await sound.setVolumeAsync(settingsStore.getState().volume);
  await sound.playAsync();
};

// Preload common sounds
export const preloadSounds = async () => {
  // success.mp3, error.mp3, click.mp3, etc.
};
```

### lib/utils/offline.ts
```tsx
// Offline mode utilities
import NetInfo from '@react-native-community/netinfo';

export const isOnline = async (): Promise<boolean> => {
  const state = await NetInfo.fetch();
  return state.isConnected ?? false;
};

export const queueProgressForSync = async (progress: ProgressData) => {
  const queue = await getData<ProgressData[]>('progress_queue') || [];
  queue.push(progress);
  await saveData('progress_queue', queue);
};

export const syncQueuedProgress = async () => {
  if (!(await isOnline())) return;

  const queue = await getData<ProgressData[]>('progress_queue') || [];

  for (const progress of queue) {
    try {
      await progressApi.submit(progress);
    } catch (error) {
      console.error('Failed to sync progress:', error);
    }
  }

  await saveData('progress_queue', []);
};
```

## Testing

### Unit Tests (Jest)

**lib/store/authStore.test.ts**
```tsx
describe('AuthStore', () => {
  it('should login successfully', async () => {
    // Mock API response
    // Test login action
    // Assert state changes
  });

  it('should handle login error', async () => {
    // Mock API error
    // Test error handling
  });
});
```

### E2E Tests (Detox)

**e2e/onboarding.test.js**
```js
describe('Onboarding Flow', () => {
  it('should complete onboarding and create profile', async () => {
    await device.launchApp();
    await element(by.id('get-started-button')).tap();
    await element(by.id('child-name-input')).typeText('Test Child');
    await element(by.id('age-range-selector')).tap();
    await element(by.text('3-4 years')).tap();
    await element(by.id('save-profile-button')).tap();
    await expect(element(by.id('home-screen'))).toBeVisible();
  });
});
```

## Installation & Setup

```bash
cd mobile
npm install

# Set up environment
cp .env.example .env
# Edit .env with your API_URL

# Start development
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run tests
npm test
npm run test:e2e
```

## Build & Deploy

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure project
eas build:configure

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android

# Submit to App Store
eas submit --platform ios

# Submit to Play Store
eas submit --platform android
```

## Assets Needed

Create placeholder/sample assets:

### Images
- `/assets/images/avatars/` - 10+ kid-friendly avatars
- `/assets/images/categories/` - Icons for each game category
- `/assets/images/worksheets/` - Sample worksheet thumbnails
- `/assets/images/onboarding/` - Onboarding illustrations

### Sounds
- `/assets/sounds/success.mp3` - Success sound
- `/assets/sounds/error.mp3` - Error sound
- `/assets/sounds/click.mp3` - Button click
- `/assets/sounds/star.mp3` - Star earned
- `/assets/sounds/complete.mp3` - Game completion

### Lottie Animations
- `/assets/lottie/confetti.json` - Celebration animation
- `/assets/lottie/star.json` - Star animation
- `/assets/lottie/loading.json` - Loading spinner

## Performance Optimization

1. **Lazy Loading**: Load game components only when needed
2. **Image Optimization**: Use expo-image with caching
3. **Memoization**: Use React.memo for expensive components
4. **FlatList Optimization**: Use getItemLayout, keyExtractor
5. **Bundle Size**: Analyze with `npx expo-doctor`
6. **Hermes**: Enable Hermes engine for Android

## Accessibility Checklist

- ✅ All interactive elements have accessibility labels
- ✅ Minimum touch target size: 44x44pt
- ✅ Color contrast ratio: 4.5:1 minimum
- ✅ Support for screen readers
- ✅ No flashing content (seizure risk)
- ✅ Adjustable text size
- ✅ Alternative text for images
- ✅ Keyboard navigation (if applicable)

## Security Checklist

- ✅ API tokens stored in SecureStore
- ✅ No sensitive data in logs
- ✅ Certificate pinning (optional)
- ✅ Parental gate implemented
- ✅ App Transport Security enabled (iOS)
- ✅ ProGuard enabled (Android)
- ✅ No hardcoded secrets in code

## Next Implementation Steps

1. Create authentication screens (login, register)
2. Implement onboarding flow
3. Build kids home screen with category grid
4. Create game components (start with ABC Tracing)
5. Implement progress tracking
6. Build worksheets gallery
7. Create parent dashboard
8. Add subscription/paywall
9. Test all flows
10. Polish UI/UX
11. Add analytics
12. Submit to stores

---

**Remember**: All code comments in English, user-facing text via i18n, no third-party copyrighted content.
