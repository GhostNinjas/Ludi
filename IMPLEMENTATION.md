# Ludi - Implementation Overview

## Project Overview

Ludi is an educational mobile application for children aged 1-6 years with interactive games, worksheets, and parental controls.

## Technology Stack

### Mobile App
- **Framework**: React Native + Expo SDK 54
- **Language**: TypeScript 5.3
- **Navigation**: expo-router (file-based routing)
- **State Management**: Zustand
- **API Client**: Axios with interceptors
- **Animations**: Lottie, React Native Reanimated
- **Audio**: Expo AV for TTS and sound effects
- **Forms**: React Hook Form + Zod validation
- **i18n**: i18next (pt-BR, en, es)

### Backend API (Future)
- **Framework**: Laravel 11 + PHP 8.3
- **Database**: MySQL 8 with Redis caching
- **Authentication**: Laravel Sanctum
- **Queue**: Laravel Horizon
- **Documentation**: OpenAPI/Swagger

## Core Features

### 1. Educational Games
- **ABC Tracing**: Letter tracing with stroke tracking
- **Number Counting**: Interactive counting activities
- **Color Matching**: Color identification and matching
- **Shape Recognition**: Shape sorting and puzzles
- **Memory Games**: Card matching games
- **Drawing Activities**: Guided step-by-step drawing
- **Music Creator**: Interactive musical instruments
- **Coloring Pages**: Digital coloring activities

### 2. Multi-Child Profiles
- Create profiles for different children
- Age-based content filtering (1-2, 3-4, 5-6)
- Individual progress tracking
- Custom avatar selection
- Interest preferences

### 3. Progress Tracking
- Stars earned per activity
- Time spent tracking
- Accuracy metrics
- Streak days
- Detailed analytics for parents

### 4. Parent Dashboard
- View progress per child
- Performance charts
- Activity history
- Settings and controls
- Parental gate protection

### 5. Internationalization
- Portuguese (Brazil)
- English
- Spanish
- Easy to add more languages

### 6. Offline Mode
- Download content for offline use
- Queue progress sync when online
- Offline-first architecture

## Project Structure

```
mobile/
├── app/                    # Screens (expo-router)
│   ├── (auth)/            # Authentication screens
│   ├── (tabs)/            # Main app tabs
│   │   ├── (home)/        # Kids area
│   │   ├── (worksheets)/  # Worksheets section
│   │   └── (parents)/     # Parent dashboard
│   └── games/             # Game screens
├── components/            # Reusable components
│   ├── common/           # Common UI components
│   └── games/            # Game components
├── lib/                  # Utilities and services
│   ├── api/             # API client
│   ├── store/           # Zustand stores
│   ├── i18n/            # Translations
│   └── utils/           # Helper functions
├── constants/           # Colors, Config
└── assets/             # Images, sounds, fonts
```

## API Architecture (Future)

### Authentication Endpoints
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

### Profile Endpoints
```
GET    /api/profiles
POST   /api/profiles
GET    /api/profiles/{id}
PUT    /api/profiles/{id}
DELETE /api/profiles/{id}
```

### Progress Endpoints
```
POST /api/progress
GET  /api/progress/profile/{id}
GET  /api/progress/profile/{id}/summary
```

### Catalog Endpoints
```
GET /api/catalog/modules
GET /api/catalog/worksheets
```

## Database Schema (Future)

### Users
- id, email, password, locale
- plan (free/premium), premium_until
- timestamps

### Profiles (Children)
- id, user_id, name, age_range
- interests[], avatar, settings{}
- streak_days, total_stars
- timestamps

### Progress
- id, profile_id, module_id
- stars, time_spent_sec, accuracy
- level, errors_count, meta{}
- timestamp

### Modules
- id, slug, title{}, description{}
- age_min, age_max, category
- premium, active, order

## Key Implementation Details

### State Management (Zustand)

```typescript
// Auth Store
interface AuthState {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

// Profile Store
interface ProfileState {
  profiles: Profile[];
  currentProfile: Profile | null;
  fetchProfiles: () => Promise<void>;
  selectProfile: (id: number) => void;
}

// Settings Store
interface SettingsState {
  locale: string;
  soundEnabled: boolean;
  ttsEnabled: boolean;
  updateSettings: (settings: Partial<SettingsState>) => void;
}
```

### API Client

```typescript
// Axios instance with interceptors
const apiClient = axios.create({
  baseURL: Config.API_URL,
  timeout: 10000,
});

// Auto-attach auth token
apiClient.interceptors.request.use((config) => {
  const token = authStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      authStore.getState().logout();
    }
    return Promise.reject(error);
  }
);
```

### Navigation Structure

```
app/
├── _layout.tsx              # Root layout
├── index.tsx                # Splash/redirect
├── (auth)/
│   ├── _layout.tsx
│   ├── login.tsx
│   └── register.tsx
└── (tabs)/
    ├── _layout.tsx          # Bottom tabs
    ├── (home)/
    │   ├── index.tsx        # Kids home
    │   └── games/[slug].tsx # Dynamic game routes
    ├── (worksheets)/
    │   └── index.tsx
    └── (parents)/
        ├── _layout.tsx      # Parental gate
        ├── index.tsx        # Dashboard
        └── settings.tsx
```

### Internationalization

```typescript
// i18n configuration
i18n.use(initReactI18next).init({
  resources: {
    'pt-BR': { translation: ptBR },
    en: { translation: en },
    es: { translation: es },
  },
  lng: 'pt-BR',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

// Usage
import { useTranslation } from 'react-i18next';

const { t } = useTranslation();
<Text>{t('welcome')}</Text>
```

## Security Considerations

### Authentication
- Token stored in SecureStore (encrypted)
- Auto-refresh mechanism
- Secure HTTPS only

### Parental Controls
- Math challenge or long-press gate
- Protected parent area
- Content filtering by age

### Privacy
- COPPA compliant architecture
- No personal data collection from children
- Parent-controlled accounts

### Data Protection
- Encrypted storage for sensitive data
- Secure API communication
- No third-party trackers by default

## Performance Optimization

### Bundle Size
- Tree-shaking enabled
- Lazy loading for game components
- Optimized assets

### Runtime Performance
- React.memo for expensive components
- useMemo/useCallback where appropriate
- FlatList with getItemLayout
- Image caching with expo-image

### Network
- API response caching
- Optimistic updates
- Offline queue for progress sync

## Accessibility

### WCAG AA Compliance
- Color contrast ratio 4.5:1 minimum
- Touch targets 44x44pt minimum
- Screen reader support
- Alternative text for images

### Settings
- Adjustable text size
- High contrast mode
- Sound on/off toggle
- TTS enable/disable

## Testing Strategy

### Unit Tests (Jest)
- Store logic
- Utility functions
- API clients
- Components

### E2E Tests (Detox)
- Authentication flow
- Profile creation
- Game completion
- Navigation

## Deployment

### Build Process
```bash
# Development build
eas build --profile development

# Preview build
eas build --profile preview

# Production build
eas build --profile production
```

### Store Submission
```bash
# Submit to App Store
eas submit --platform ios

# Submit to Google Play
eas submit --platform android
```

## Environment Variables

```bash
# mobile/.env
API_URL=http://localhost:8000/api
ANALYTICS_ENABLED=true
FEATURE_FLAGS_ENABLED=true
```

## Future Enhancements

### Phase 2
- Backend API implementation
- User authentication
- Progress sync with server
- Premium subscription

### Phase 3
- More game modules
- Worksheet download system
- Parent dashboard analytics
- Social features (optional)

### Phase 4
- AI-powered recommendations
- Advanced analytics
- Multi-device sync
- Web version

## Documentation

- **START_HERE.md** - Quick start guide
- **PROJECT_SUMMARY.md** - Current project status
- **README.md** - Project overview
- **mobile/DESIGN_SYSTEM.md** - Design guidelines

## Support & Resources

- **Expo Docs**: https://docs.expo.dev
- **React Native**: https://reactnative.dev
- **TypeScript**: https://typescriptlang.org
- **Zustand**: https://zustand-demo.pmnd.rs

---

**Note**: This is a high-level implementation overview. Specific implementation details can be found in the codebase and inline documentation.
