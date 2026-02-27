# Converting Amanah to iPhone App

## ✅ Setup Complete!

I've created a React Native Expo project in the `amanah-mobile` folder with all necessary dependencies installed.

## 📱 What You Have Now

### Project Structure
```
amanah-mobile/
├── App.tsx              # Main app entry point
├── app.json             # App configuration
├── package.json         # Dependencies
├── assets/              # Images, icons, splash screen
└── node_modules/        # Installed packages
```

### Installed Dependencies
- ✅ React Native (via Expo)
- ✅ React Navigation (for screen navigation)
- ✅ AsyncStorage (for data persistence - replaces localStorage)
- ✅ Expo Linear Gradient (for beautiful gradients)
- ✅ Safe Area Context (for iPhone notch/safe areas)

## 🚀 Running the App

### Option 1: Test on Your iPhone (Easiest)
1. Install "Expo Go" app from App Store on your iPhone
2. In terminal, navigate to the mobile folder:
   ```bash
   cd amanah-mobile
   npm start
   ```
3. Scan the QR code with your iPhone camera
4. App opens in Expo Go!

### Option 2: iOS Simulator (Requires Mac)
```bash
cd amanah-mobile
npm run ios
```

### Option 3: Web Browser (For Testing)
```bash
cd amanah-mobile
npm run web
```

## 📋 Next Steps to Complete the Conversion

### 1. Copy Your Business Logic
The following files can be reused with minimal changes:

**From web app → mobile app:**
- `src/lib/mockData.ts` → `lib/mockData.ts` (change localStorage to AsyncStorage)
- `src/lib/i18n.ts` → `lib/i18n.ts` (change localStorage to AsyncStorage)
- `src/lib/auth.ts` → `lib/auth.ts` (change localStorage to AsyncStorage)

### 2. Convert Web Pages to Mobile Screens

**Web (Next.js)** → **Mobile (React Native)**

| Web Component | Mobile Equivalent |
|---------------|-------------------|
| `<div>` | `<View>` |
| `<p>`, `<span>`, `<h1>` | `<Text>` |
| `<button>` | `<TouchableOpacity>` or `<Pressable>` |
| `<input>` | `<TextInput>` |
| `<Link>` | `navigation.navigate()` |
| CSS classes | StyleSheet.create() |

### 3. Key Differences

#### Storage
```typescript
// Web (localStorage)
localStorage.setItem('key', 'value')
const value = localStorage.getItem('key')

// Mobile (AsyncStorage)
await AsyncStorage.setItem('key', 'value')
const value = await AsyncStorage.getItem('key')
```

#### Navigation
```typescript
// Web (Next.js)
import Link from 'next/link'
<Link href="/dashboard">Dashboard</Link>

// Mobile (React Navigation)
import { useNavigation } from '@react-navigation/native'
const navigation = useNavigation()
navigation.navigate('Dashboard')
```

#### Styling
```typescript
// Web (Tailwind CSS)
<div className="bg-blue-600 p-4 rounded-lg">

// Mobile (StyleSheet)
import { StyleSheet } from 'react-native'
<View style={styles.container}>

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 8,
  }
})
```

## 📁 Recommended Mobile App Structure

```
amanah-mobile/
├── App.tsx
├── app.json
├── package.json
│
├── src/
│   ├── screens/           # All app screens
│   │   ├── LandingScreen.tsx
│   │   ├── LoginScreen.tsx
│   │   ├── RegisterScreen.tsx
│   │   ├── DashboardScreen.tsx
│   │   ├── CampaignDetailScreen.tsx
│   │   ├── CreateCampaignScreen.tsx
│   │   ├── GroupDetailScreen.tsx
│   │   ├── CreateGroupScreen.tsx
│   │   └── ContributeScreen.tsx
│   │
│   ├── components/        # Reusable components
│   │   ├── CampaignCard.tsx
│   │   ├── GroupCard.tsx
│   │   ├── ActivityItem.tsx
│   │   ├── LanguageSwitcher.tsx
│   │   └── Button.tsx
│   │
│   ├── navigation/        # Navigation setup
│   │   └── AppNavigator.tsx
│   │
│   ├── lib/              # Business logic (from web app)
│   │   ├── mockData.ts
│   │   ├── i18n.ts
│   │   └── auth.ts
│   │
│   ├── types/            # TypeScript types
│   │   └── index.ts
│   │
│   └── styles/           # Shared styles
│       └── colors.ts
│
└── assets/               # Images, fonts, icons
    ├── icon.png
    ├── splash.png
    └── logo.svg
```

## 🎨 Example: Converting Dashboard Page

### Web Version (Next.js)
```tsx
// src/app/dashboard/page.tsx
export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <h1 className="text-2xl font-bold">Amanah</h1>
      </header>
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-900">Total Contributed</p>
          <p className="text-3xl font-bold text-green-600">$5,000</p>
        </div>
      </div>
    </div>
  )
}
```

### Mobile Version (React Native)
```tsx
// src/screens/DashboardScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DashboardScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Amanah</Text>
      </View>
      <ScrollView style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Total Contributed</Text>
          <Text style={styles.cardValue}>$5,000</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#ffffff',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 24,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#059669',
  },
});
```

## 🔄 AsyncStorage Migration

### Create a Storage Utility
```typescript
// src/lib/storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export const storage = {
  async setItem(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  },

  async getItem(key: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error('Error loading data:', error);
      return null;
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing data:', error);
    }
  },
};
```

### Update mockData.ts
```typescript
// Before (Web)
export function getCampaigns(): Campaign[] {
  const stored = localStorage.getItem('amanah_campaigns');
  return stored ? JSON.parse(stored) : defaultCampaigns;
}

// After (Mobile)
export async function getCampaigns(): Promise<Campaign[]> {
  const stored = await storage.getItem('amanah_campaigns');
  return stored ? JSON.parse(stored) : defaultCampaigns;
}
```

## 🎯 Navigation Setup

### Create AppNavigator.tsx
```typescript
// src/navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import LandingScreen from '../screens/LandingScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import DashboardScreen from '../screens/DashboardScreen';
import CampaignDetailScreen from '../screens/CampaignDetailScreen';
// ... import other screens

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function DashboardTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={DashboardScreen} />
      <Tab.Screen name="Campaigns" component={CampaignsScreen} />
      <Tab.Screen name="Groups" component={GroupsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Landing">
        <Stack.Screen 
          name="Landing" 
          component={LandingScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen 
          name="Dashboard" 
          component={DashboardTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="CampaignDetail" component={CampaignDetailScreen} />
        {/* Add more screens */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

### Update App.tsx
```typescript
// App.tsx
import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return <AppNavigator />;
}
```

## 🌍 RTL Support for Arabic

```typescript
// App.tsx
import { I18nManager } from 'react-native';
import { getLanguage } from './src/lib/i18n';

export default function App() {
  const lang = getLanguage();
  const isRTL = lang === 'ar';
  
  // Force RTL if Arabic
  if (isRTL !== I18nManager.isRTL) {
    I18nManager.forceRTL(isRTL);
    // Requires app restart
  }

  return <AppNavigator />;
}
```

## 📱 App Configuration

### Update app.json
```json
{
  "expo": {
    "name": "Amanah",
    "slug": "amanah",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#1E40AF"
    },
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.yourcompany.amanah",
      "buildNumber": "1.0.0"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#1E40AF"
      },
      "package": "com.yourcompany.amanah"
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      "expo-router"
    ]
  }
}
```

## 🎨 Styling Tips

### Create a Colors File
```typescript
// src/styles/colors.ts
export const colors = {
  primary: '#1E40AF',      // Blue
  secondary: '#F59E0B',    // Amber
  success: '#10B981',      // Green
  danger: '#EF4444',       // Red
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  white: '#ffffff',
  black: '#000000',
};
```

### Use Consistent Spacing
```typescript
// src/styles/spacing.ts
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};
```

## 📦 Building for App Store

### 1. Create Expo Account
```bash
npx expo login
```

### 2. Build iOS App
```bash
cd amanah-mobile
eas build --platform ios
```

### 3. Submit to App Store
```bash
eas submit --platform ios
```

## 🔧 Development Workflow

### 1. Start Development Server
```bash
cd amanah-mobile
npm start
```

### 2. Test on Device
- Open Expo Go app on iPhone
- Scan QR code
- App reloads automatically when you save changes

### 3. Debug
- Shake device to open developer menu
- Enable "Debug Remote JS" for Chrome DevTools
- Use React Native Debugger for better experience

## 📚 Resources

### Official Documentation
- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [Expo Docs](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/docs/getting-started)

### Tutorials
- [React Native Tutorial](https://reactnative.dev/docs/tutorial)
- [Expo Tutorial](https://docs.expo.dev/tutorial/introduction/)

### UI Libraries (Optional)
- [React Native Paper](https://reactnativepaper.com/) - Material Design
- [React Native Elements](https://reactnativeelements.com/) - Cross-platform UI
- [NativeBase](https://nativebase.io/) - Accessible components

## ✅ Conversion Checklist

- [ ] Set up mobile project structure
- [ ] Convert mockData.ts to use AsyncStorage
- [ ] Convert i18n.ts to use AsyncStorage
- [ ] Convert auth.ts to use AsyncStorage
- [ ] Create navigation structure
- [ ] Convert Landing page to LandingScreen
- [ ] Convert Login page to LoginScreen
- [ ] Convert Register page to RegisterScreen
- [ ] Convert Dashboard page to DashboardScreen
- [ ] Convert Campaign pages to screens
- [ ] Convert Group pages to screens
- [ ] Convert Contribute page to ContributeScreen
- [ ] Add RTL support for Arabic
- [ ] Test on iPhone with Expo Go
- [ ] Add app icon and splash screen
- [ ] Build and test production version
- [ ] Submit to App Store

## 🎉 Benefits of Mobile App

- ✅ Native iOS experience
- ✅ Push notifications (can be added)
- ✅ Offline support
- ✅ Better performance
- ✅ Access to device features (camera, contacts, etc.)
- ✅ App Store distribution
- ✅ Home screen icon
- ✅ Face ID / Touch ID integration (can be added)

## 💡 Next Steps

1. **Start with one screen**: Convert the Landing page first
2. **Test frequently**: Use Expo Go to test on your iPhone
3. **Reuse logic**: Your business logic (mockData, i18n, auth) can be reused with minimal changes
4. **Style incrementally**: Convert one component at a time
5. **Ask for help**: React Native community is very helpful!

---

**Your mobile app foundation is ready! Start converting screens one by one.** 🚀
