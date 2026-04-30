// app/profile/faq.jsx
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ChevronDown, ChevronUp, MessageCircle, Mail } from 'lucide-react-native';

import ScreenHeader from '@/components/profile/ScreenHeader';
import { C, R, S } from '@/components/profile/theme';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FAQS = [
  {
    id: '1',
    q: 'How do I find rooms near my campus?',
    a: 'Use the Explore tab to search by campus name or location. Filter by distance, price range, and room type. All listed rooms show estimated travel time to nearby campuses.',
  },
  {
    id: '2',
    q: 'Are all listings verified?',
    a: 'Yes. Every listing on C-Hub goes through a manual verification process. We check property ownership, photos, and pricing before a listing goes live. Look for the green "Verified" badge.',
  },
  {
    id: '3',
    q: 'How do I book a room?',
    a: 'Tap on any listing, review the details, and press "Request Viewing" or "Book Now". The landlord will receive your request and confirm within 24 hours.',
  },
  {
    id: '4',
    q: 'Can I save rooms to view later?',
    a: 'Yes — tap the bookmark icon on any listing to save it. Access your saved rooms from the My History section in your Profile.',
  },
  {
    id: '5',
    q: 'How do I use a promo code?',
    a: 'Go to Profile → Promo Codes and enter your code in the input field. Valid codes are automatically applied to your next booking.',
  },
  {
    id: '6',
    q: 'What if I have a dispute with a landlord?',
    a: 'Contact our support team via the chat icon below or email support@chub.app. We mediate disputes within 48 business hours and maintain escrow protection on all transactions.',
  },
  {
    id: '7',
    q: 'How do I delete my account?',
    a: 'Go to Profile → Delete My Account & Data. You\'ll be asked to confirm. Once deleted, all your data is permanently removed from our servers within 30 days.',
  },
];

function FAQItem({ item, index }) {
  const [open, setOpen] = useState(false);

  const toggle = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen((v) => !v);
  }, []);

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 50 + 60).duration(360).springify()}
      style={styles.faqItem}
    >
      <TouchableOpacity onPress={toggle} activeOpacity={0.8} style={styles.faqHeader}>
        <Text style={[styles.faqQ, open && styles.faqQOpen]}>{item.q}</Text>
        {open
          ? <ChevronUp size={16} color={C.green} strokeWidth={2.2} />
          : <ChevronDown size={16} color={C.textMuted} strokeWidth={2.2} />
        }
      </TouchableOpacity>

      {open && (
        <View style={styles.faqBody}>
          <View style={styles.faqBodyDivider} />
          <Text style={styles.faqA}>{item.a}</Text>
        </View>
      )}
    </Animated.View>
  );
}

export default function FAQScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['rgba(45,186,96,0.07)', C.bg]}
        locations={[0, 0.4]}
        style={StyleSheet.absoluteFillObject}
        pointerEvents="none"
      />

      <ScreenHeader title="FAQ & Help" />

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 40 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Search prompt card */}
        <Animated.View
          entering={FadeInDown.delay(40).duration(420).springify()}
          style={styles.heroCard}
        >
          <Text style={styles.heroTitle}>How can we help? 👋</Text>
          <Text style={styles.heroSub}>Browse common questions below or reach our team directly.</Text>
        </Animated.View>

        <Text style={styles.sectionTitle}>Common Questions</Text>

        <View style={styles.faqList}>
          {FAQS.map((item, index) => (
            <FAQItem key={item.id} item={item} index={index} />
          ))}
        </View>

        {/* Contact support */}
        <Text style={styles.sectionTitle}>Still need help?</Text>

        <Animated.View
          entering={FadeInDown.delay(200).duration(380).springify()}
          style={styles.supportRow}
        >
          <TouchableOpacity style={styles.supportBtn} activeOpacity={0.78}>
            <View style={styles.supportIcon}>
              <MessageCircle size={18} color={C.green} strokeWidth={2} />
            </View>
            <Text style={styles.supportLabel}>Live Chat</Text>
            <Text style={styles.supportSub}>Usually replies in minutes</Text>
          </TouchableOpacity>

          <View style={styles.supportSeparator} />

          <TouchableOpacity style={styles.supportBtn} activeOpacity={0.78}>
            <View style={styles.supportIcon}>
              <Mail size={18} color={C.green} strokeWidth={2} />
            </View>
            <Text style={styles.supportLabel}>Email Us</Text>
            <Text style={styles.supportSub}>support@chub.app</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  content: { paddingHorizontal: S.md, gap: 10 },
  heroCard: {
    backgroundColor: C.bgCard,
    borderRadius: R.cardLg,
    borderWidth: 1,
    borderColor: C.greenBorder,
    padding: S.lg,
    gap: 6,
    marginTop: 4,
    marginBottom: 6,
  },
  heroTitle: { fontSize: 18, fontWeight: '700', color: C.textPrimary, letterSpacing: -0.2 },
  heroSub: { fontSize: 13.5, color: C.textSecondary, lineHeight: 20 },
  sectionTitle: {
    fontSize: 11.5,
    fontWeight: '600',
    color: C.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginLeft: 4,
    marginBottom: 8,
    marginTop: 6,
  },
  faqList: {
    backgroundColor: C.bgCard,
    borderRadius: R.card,
    borderWidth: 1,
    borderColor: C.border,
    overflow: 'hidden',
    marginBottom: 6,
  },
  faqItem: {
    borderBottomWidth: 1,
    borderBottomColor: C.divider,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: S.md,
    gap: 12,
  },
  faqQ: {
    flex: 1,
    fontSize: 14.5,
    fontWeight: '500',
    color: C.textPrimary,
    lineHeight: 21,
  },
  faqQOpen: { color: C.green, fontWeight: '600' },
  faqBody: {
    paddingHorizontal: S.md,
    paddingBottom: 15,
    gap: 10,
  },
  faqBodyDivider: {
    height: 1.5,
    backgroundColor: C.greenFaint,
    borderRadius: 1,
    marginBottom: 2,
  },
  faqA: {
    fontSize: 13.5,
    color: C.textSecondary,
    lineHeight: 21,
  },
  supportRow: {
    flexDirection: 'row',
    backgroundColor: C.bgCard,
    borderRadius: R.card,
    borderWidth: 1,
    borderColor: C.border,
    overflow: 'hidden',
  },
  supportBtn: {
    flex: 1,
    alignItems: 'center',
    padding: S.lg,
    gap: 6,
  },
  supportSeparator: {
    width: 1,
    backgroundColor: C.divider,
    marginVertical: S.sm,
  },
  supportIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: C.greenFaint,
    borderWidth: 1,
    borderColor: C.greenBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  supportLabel: { fontSize: 14, fontWeight: '600', color: C.textPrimary },
  supportSub: { fontSize: 11.5, color: C.textMuted, textAlign: 'center' },
});
