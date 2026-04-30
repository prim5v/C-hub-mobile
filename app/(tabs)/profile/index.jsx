// app/(tabs)/profile.jsx
//
// Glovo-style profile layout:
//   • Fixed green gradient HERO at the top (name, avatar, subtitle)
//   • White rounded SHEET that scrolls over the hero
//   • Settings list inside the sheet on a clean white surface
//
import React, { useCallback, useRef, version } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
  Platform,
  StatusBar,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import {
  Clock,
  User,
  Tag,
  Globe,
  HelpCircle,
  Bell,
  Trash2,
  LogOut,
  Settings,
  ShieldCheck,
} from 'lucide-react-native';

import SettingsRow from '@/components/profile/SettingsRow';
import { T, HERO_HEIGHT, SHEET_RADIUS } from '@/components/profile/tokens';
import { useAuthContext } from '@/contexts/AuthContext';


// import SettingsRow from '@/components/profile/SettingsRow'
// import { C, R, S } from '@/components/profile/theme'

const { width: SW } = Dimensions.get('window');
const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);


// ── Mock user ─────────────────────────────────────────────────────────────────
const USER = {
  name: 'Alex Mwangi',
  subtitle: 'Connect with friends',
  initials: 'AM',
  email: 'alex.mwangi@uni.ac.ke',
};



// ── Avatar ────────────────────────────────────────────────────────────────────


function Avatar({ size = 76, name, imageUrl }) {
  // generate initials safely
  const getInitials = () => {
    if (!name) return "?";

    const parts = name.trim().split(" ");

    if (parts.length === 1) {
      return parts[0][0].toUpperCase();
    }

    return (
      parts[0][0] + parts[parts.length - 1][0]
    ).toUpperCase();
  };

  const initials = getInitials();

  return (
    <View
      style={[
        avatarStyles.ring,
        {
          width: size + 6,
          height: size + 6,
          borderRadius: (size + 6) / 2,
        },
      ]}
    >
      <View
        style={[
          avatarStyles.avatar,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            overflow: "hidden",
          },
        ]}
      >
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />
        ) : (
          <LinearGradient
            colors={['#FFFFFF', '#E8F9EE']}
            style={StyleSheet.absoluteFillObject}
          >
            <View style={avatarStyles.fallbackCenter}>
              <Text
                style={[
                  avatarStyles.initials,
                  { fontSize: size * 0.29 },
                ]}
              >
                {initials}
              </Text>
            </View>
          </LinearGradient>
        )}
      </View>
    </View>
  );
}
const avatarStyles = StyleSheet.create({
  ring: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontWeight: '800',
    color: T.heroMid,
    letterSpacing: 0.5,
  },
});

// ── Section label ─────────────────────────────────────────────────────────────
function SectionLabel({ text }) {
  return <Text style={sectionStyles.label}>{text}</Text>;
}

const sectionStyles = StyleSheet.create({
  label: {
    fontSize: 11.5,
    fontWeight: '700',
    color: T.textSoft,
    letterSpacing: 0.9,
    textTransform: 'uppercase',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 8,
  },
});

// ── Card wrapper ──────────────────────────────────────────────────────────────
function Card({ children }) {
  return <View style={cardStyles.card}>{children}</View>;
}

const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: T.rowBg,
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
    // Subtle elevation
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
});

// ── Main screen ───────────────────────────────────────────────────────────────
export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const scrollY = useSharedValue(0);
  const { logout, dbUser, user } = useAuthContext();

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => { scrollY.value = e.contentOffset.y; },
  });

  // Hero fades + scales subtly as sheet scrolls over it
  const heroAnimStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [0, HERO_HEIGHT * 0.55], [1, 0.35], Extrapolation.CLAMP);
    const scale = interpolate(scrollY.value, [0, HERO_HEIGHT * 0.55], [1, 0.96], Extrapolation.CLAMP);
    return { opacity, transform: [{ scale }] };
  });

  const handleLogout = useCallback(() => {
    Alert.alert(
      'Oops 😬',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: () => {
            // TODO: replace with your auth context signOut()
            // e.g. await signOut(); router.replace('/(auth)');
            logout();
          },
        },
      ],
      { cancelable: true }
    );
  }, []);

  const handleDelete = useCallback(() => {
    Alert.alert(
      'Delete Account & Data',
      'This permanently deletes your account and all data. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete Forever', style: 'destructive', onPress: () => console.log('[C-Hub] delete account') },
      ],
      { cancelable: true }
    );
  }, []);

  const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight ?? 24 : 0;
  const heroTopPad = insets.top + (Platform.OS === 'android' ? 0 : 0);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <Animated.View
        style={[
          styles.hero,
          { height: HERO_HEIGHT + insets.top, paddingTop: heroTopPad },
          heroAnimStyle,
        ]}
        pointerEvents="none"
      >
        <LinearGradient
          colors={['#1FA854', '#2DBA60', '#43CF74']}
          start={{ x: 0.15, y: 0 }}
          end={{ x: 0.85, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />

        {/* Soft circle decoration */}
        <View style={styles.heroDeco1} />
        <View style={styles.heroDeco2} />

        <View style={styles.heroContent}>
          {/* <Avatar size={78} name={user.username} imageUrl={user.avatarUrl} /> */}
          <Avatar
            size={78}
            name={
              user?.fullName ||
              user?.username ||
              "User"
            }
            imageUrl={user?.imageUrl}
          />
          <View style={styles.heroText}>
            {/* <Text style={styles.heroName}>{user.username}</Text> */}
            <Text style={styles.heroName}>
              {user?.fullName || user?.username || "User"}
            </Text>
            <Text style={styles.heroSub}>{USER.subtitle}</Text>
          </View>
        </View>
      </Animated.View>

      {/* Settings gear — top-right, sits above hero */}
      <TouchableOpacity
        style={[styles.settingsBtn, { top: insets.top + 12 }]}
        onPress={() => router.push('/profile/account')}
        activeOpacity={0.75}
        hitSlop={10}
      >
        <Settings size={18} color="rgba(255,255,255,0.9)" strokeWidth={2} />
      </TouchableOpacity>

      {/* ── SCROLLABLE SHEET ──────────────────────────────────────── */}
      <AnimatedScrollView
        style={StyleSheet.absoluteFill}
        contentContainerStyle={[
          styles.sheetContent,
          {
            paddingTop: HERO_HEIGHT + insets.top - SHEET_RADIUS,
            paddingBottom: insets.bottom + 40,
          },
        ]}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        bounces
      >
        {/* White sheet with rounded top corners */}
        <View style={styles.sheet}>

          {/* Sheet handle */}
          <View style={styles.handle} />

          {/* "Profile" heading */}
          {/* <Text style={styles.sheetTitle}>Profile</Text> */}

          {/* ── SECTION: Activity ──────────────────────────── */}
          <SectionLabel text="Profile" style={styles.sheetTitle}/>
          {/* <Card> */}
          <View tyle={styles.sectionLabel}>
            <SettingsRow
              icon={<Clock size={18} color={T.textGreen} strokeWidth={2} />}
              label="History"
              onPress={() => router.push('/profile/history')}
            />
            <SettingsRow
              icon={<Tag size={18} color={T.textGreen} strokeWidth={2} />}
              label="Promo Codes"
              onPress={() => router.push('/profile/promocodes')}
              // showDivider={false}
            />
            <SettingsRow
              icon={<User size={18} color={T.textGreen} strokeWidth={2} />}
              label="Account"
              onPress={() => router.push('/profile/account')}
            />
            <SettingsRow
              icon={<Globe size={18} color={T.textGreen} strokeWidth={2} />}
              label="Language"
              onPress={() => router.push('/profile/language')}
              rightElement={
                <Text style={styles.rightLabel}>English</Text>
              }
            />
            <SettingsRow
              icon={<Bell size={18} color={T.textGreen} strokeWidth={2} />}
              label="Notification Settings"
              onPress={() => router.push('/profile/notifications')}
            />
            <SettingsRow
              icon={<HelpCircle size={18} color={T.textGreen} strokeWidth={2} />}
              label="FAQ"
              onPress={() => router.push('/profile/faq')}
              // showDivider={false}
            />
            <SettingsRow
              icon={<LogOut size={18} color={T.textMid} strokeWidth={2} />}
              label="Log Out"
              onPress={handleLogout}
            />
            <SettingsRow
              icon={<Trash2 size={18} color={T.textRed} strokeWidth={2} />}
              label="Delete Account"
              onPress={handleDelete}
              destructive
              showDivider={false}
            />
            </View>
          {/* </Card> */}

          {/* ── SECTION: Settings ──────────────────────────── */}
          {/* <SectionLabel text="Settings" />
          <Card>
            
            
          </Card> */}

          {/* ── SECTION: Account Actions ───────────────────── */}
          {/* <SectionLabel text="Account" />
          <Card>
            
          </Card> */}

          {/* Footer */}
          <View style={styles.footer}>
            <View style={styles.footerDot} />
            <Text style={styles.footerText}>Version 2026.01.0 b3a0edb</Text>
          </View>
        </View>
      </AnimatedScrollView>
    </View>
  );
}
// C-Hub · Version 2026.01.0 017d987

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: T.appBg,
  },

  // ── Hero ──────────────────────────────────────────────────────
  hero: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: SHEET_RADIUS + 16,
    overflow: 'hidden',
  },
  sectionLabel:{
    // paddingTop:54,
    // marginBottom:-56,
    marginTop:16,
  },
  heroDeco1: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(255,255,255,0.07)',
    top: -60,
    right: -50,
  },
  heroDeco2: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.05)',
    bottom: 10,
    left: -30,
  },
  heroContent: {
    alignItems: 'center',
    gap: 12,
  },
  heroText: {
    alignItems: 'center',
    gap: 4,
  },
  heroName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.4,
  },
  heroSub: {
    fontSize: 13.5,
    color: 'rgba(255,255,255,0.75)',
    fontWeight: '400',
  },

  settingsBtn: {
    position: 'absolute',
    right: 18,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
  },

  // ── Sheet ─────────────────────────────────────────────────────
  sheetContent: {
    // paddingTop set dynamically in component
  },
  sheet: {
    flex: 1,
    backgroundColor: T.sheetBg,
    borderTopLeftRadius: SHEET_RADIUS,
    borderTopRightRadius: SHEET_RADIUS,
    minHeight: Dimensions.get('window').height,   // ensures sheet always fills screen
    // Crisp shadow on sheet lip
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 10,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D8DDD9',
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 2,
  },
  sheetTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: T.textDark,
    letterSpacing: -0.5,
    paddingHorizontal: 20,
    paddingTop: 14,
  },

  rightLabel: {
    fontSize: 13.5,
    color: T.textSoft,
    fontWeight: '400',
    marginRight: 2,
  },

  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    marginTop: 28,
    paddingBottom: 8,
    marginLeft:180,
  },
  footerDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: T.textGreen,
  },
  footerText: {
    fontSize: 12,
    color: T.textSoft,
    // paddingLeft: 4,
    // marginLeft:150,
  },
  fallbackCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
},
  
});