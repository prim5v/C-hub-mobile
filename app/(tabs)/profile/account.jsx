// app/profile/account.jsx
import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import {
  Lock,
  Phone,
  CreditCard,
  ShieldCheck,
  Pencil,
  Check,
  X,
} from 'lucide-react-native';

import SubScreenHeader from '@/components/profile/SubScreenHeader';
import SettingsRow from '@/components/profile/SettingsRow';
import { T } from '@/components/profile/tokens';
import { useAuthContext } from '@/contexts/AuthContext';
import * as ImagePicker from 'expo-image-picker';
import { useSignIn, useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";


// Editable field row
function EditableField({ label, value, keyboardType = 'default', onSave, delay = 0 }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  const save = () => { if (draft.trim()) { setEditing(false); onSave?.(draft.trim()); } };
  const cancel = () => { setDraft(value); setEditing(false); };
  



useEffect(() => {
  setDraft(value);
}, [value]);


  return (
    <Animated.View entering={FadeInDown.delay(delay).duration(360).springify()} style={styles.fieldCard}>
      <View style={styles.fieldTop}>
        <Text style={styles.fieldLabel}>{label}</Text>
        {!editing && (
          <TouchableOpacity onPress={() => setEditing(true)} hitSlop={10} activeOpacity={0.7}>
            <Pencil size={14} color={T.textGreen} strokeWidth={2} />
          </TouchableOpacity>
        )}
      </View>
      {editing ? (
        <View style={styles.editRow}>
          <TextInput
            style={styles.input}
            value={draft}
            onChangeText={setDraft}
            autoFocus
            keyboardType={keyboardType}
            selectionColor={T.heroMid}
            returnKeyType="done"
            onSubmitEditing={save}
          />
          <TouchableOpacity onPress={save} style={styles.actionBtn} activeOpacity={0.8}>
            <LinearGradient colors={[T.heroMid, T.heroTop]} style={styles.actionBtnGrad}>
              <Check size={14} color="#fff" strokeWidth={2.5} />
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity onPress={cancel} style={[styles.actionBtn, styles.cancelBtn]} activeOpacity={0.8}>
            <X size={14} color={T.textMid} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={styles.fieldValue}>{draft}</Text>
      )}
    </Animated.View>
  );
}

function Card({ children, style }) {
  return <View style={[cardStyle.card, style]}>{children}</View>;
}
const cardStyle = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
});

export default function AccountScreen() {
  const insets = useSafeAreaInsets();
  const {dbUser, user} = useAuthContext();
  const hasPassword = user?.passwordEnabled;
  const router = useRouter();
  const { signIn } = useSignIn();


  const fullName =
  dbUser?.full_name ??
  user?.fullName ??
  user?.username ??
  "User";

const email =
  dbUser?.email ??
  user?.primaryEmailAddress?.emailAddress ??
  "";

const phone =
  dbUser?.phone ??
  user?.phoneNumbers?.[0]?.phoneNumber ??
  "";

const initials = fullName
  .split(" ")
  .map(n => n[0])
  .join("")
  .slice(0, 2)
  .toUpperCase();

const imageUrl =
  dbUser?.image_url ??
  user?.imageUrl ??
  null;


  const handleChangePhoto = async () => {
  try {
    // request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Permission required", "We need access to your photos.");
      return;
    }

    // pick image
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (result.canceled) return;

    const uri = result.assets[0].uri;

    // upload to Clerk
    // await user?.setProfileImage({ file: { uri } });
    // const file = {
    //   uri,
    //   name: "avatar.jpg",
    //   type: "image/jpeg",
    // };
    const asset = result.assets[0];

    const file = {
      uri: asset.uri,
      name: asset.fileName || "avatar.jpg",
      type: asset.mimeType || "image/jpeg",
    };

    await user?.setProfileImage({ file });
    await user?.reload();

    Alert.alert("Success", "Profile photo updated");

  } catch (err) {
    console.log("❌ IMAGE UPDATE ERROR:", err);
    Alert.alert("Error", "Failed to update photo");
  }
};


// const { user } = useUser();

const updatePhoneNumber = async (newPhone) => {
  try {
    console.log("📱 RAW INPUT:", newPhone);

    // 🔥 ensure E.164 format
    const formattedPhone = newPhone.startsWith("+")
      ? newPhone
      : `+${newPhone}`;

    console.log("📱 FORMATTED:", formattedPhone);

    // 1. create phone number in Clerk
    const phoneObj = await user.createPhoneNumber({
      phoneNumber: formattedPhone,
    });

    console.log("📨 OTP sent");

    const code = prompt("Enter OTP sent to phone:");

    await phoneObj.attemptVerification({
      code,
    });

    console.log("✅ VERIFIED");

    await user.reload();
  } catch (err) {
    console.log("❌ PHONE ERROR:", err);
  }
};



  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <SubScreenHeader title="Account" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Avatar card */}
        <Animated.View entering={FadeInDown.delay(40).duration(400).springify()}>
          <LinearGradient colors={['#F0FAF5', '#FFFFFF']} style={styles.avatarCard}>
            <LinearGradient colors={[T.heroMid, T.heroTop]} style={styles.avatar}>
              {imageUrl ? (
                <Image
                  source={{ uri: imageUrl }}
                  style={styles.avatarImage}
                />
              ) : (
                <Text style={styles.avatarText}>{initials}</Text>
              )}
            </LinearGradient>
            <View>
              <Text style={styles.userName}>{fullName}</Text>
              <TouchableOpacity activeOpacity={0.7} onPress={handleChangePhoto}>
                <Text style={styles.changePhoto}>Change photo</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </Animated.View>

        <Text style={styles.sectionLabel}>PERSONAL INFO</Text>

        <Card style={{ gap: 0 }}>
          <View style={{ padding: 16, gap: 16 }}>
            <EditableField
              label="Email Address"
              value={email}
              keyboardType="email-address"
              delay={80}
              onSave={(v) => console.log('email:', v)}
            />
            <View style={styles.fieldDivider} />
            <EditableField
              label="Phone Number"
              value={phone}
              keyboardType="phone-pad"
              delay={140}
              onSave={updatePhoneNumber}
            />
          </View>
        </Card>

        <Text style={styles.sectionLabel}>SECURITY & PAYMENTS</Text>
        <Card>
          <SettingsRow
            icon={<Lock size={17} color={T.textGreen} strokeWidth={2} />}
            label={hasPassword ? "Change Password" : "Password managed by Google"}
           onPress={() => router.push("/profile/security")}
          />
          <SettingsRow
            icon={<Phone size={17} color={T.textGreen} strokeWidth={2} />}
            label="Change Phone Number"
            onPress={() => Alert.alert('Phone', 'Phone update coming soon.')}
          />
          <SettingsRow
            icon={<CreditCard size={17} color={T.textGreen} strokeWidth={2} />}
            label="Payment Methods"
            onPress={() => Alert.alert('Payments', 'Payment methods coming soon.')}
          />
          <SettingsRow
            icon={<ShieldCheck size={17} color={T.textGreen} strokeWidth={2} />}
            label="Manage Privacy"
            onPress={() => Alert.alert('Privacy', 'Control how your data is used within C-Hub.')}
            showDivider={false}
          />
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: T.sheetBg },
  scroll: { flex: 1 },
  content: { gap: 0, paddingTop: 16 },
  avatarCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 18,
    marginBottom: 4,
  },
  avatar: {
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 22, fontWeight: '800', color: '#fff' },
  userName: { fontSize: 17, fontWeight: '700', color: T.textDark },
  changePhoto: { fontSize: 13, color: T.textGreen, marginTop: 2, fontWeight: '500' },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: T.textSoft,
    letterSpacing: 0.9,
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 8,
  },
  fieldCard: { gap: 6 },
  fieldTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  fieldLabel: { fontSize: 11.5, color: T.textSoft, textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: '600' },
  fieldValue: { fontSize: 15.5, color: T.textDark, fontWeight: '500' },
  editRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  input: {
    flex: 1,
    fontSize: 15.5,
    color: T.textDark,
    borderBottomWidth: 1.5,
    borderBottomColor: T.heroMid,
    paddingVertical: 3,
  },
  actionBtn: { width: 30, height: 30, borderRadius: 15, overflow: 'hidden' },
  actionBtnGrad: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  cancelBtn: { backgroundColor: '#F0F1F0', alignItems: 'center', justifyContent: 'center' },
  fieldDivider: { height: 1, backgroundColor: T.divider },
  avatarImage: {
  width: '100%',
  height: '100%',
  borderRadius: 31,
},
});