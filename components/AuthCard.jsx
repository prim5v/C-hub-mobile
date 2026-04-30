import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { C } from '../lib/theme';

import GoogleIcon from './icons/GoogleIcon';
import AppleIcon from './icons/AppleIcon';
import GitHubIcon from './icons/GitHubIcon';

export default function AuthCard({ handleAuth }) {
  const [email, setEmail] = useState('');
  const [showMore, setShowMore] = useState(false);

  return (
    <View style={styles.card}>

      {/* Title */}
      <Text style={styles.welcomeTitle}>Welcome</Text>

      <Text style={styles.welcomeSub}>
        Let’s start with your email
      </Text>

      {/* Email input */}
      <View style={styles.inputBox}>
        <Text style={styles.inputLabel}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          placeholderTextColor="#aaa"
          style={styles.input}
        />
      </View>

      {/* Continue */}
      <TouchableOpacity style={styles.primaryBtn}>
        <Text style={styles.primaryBtnText}>Continue</Text>
      </TouchableOpacity>

      {/* Divider */}
      <View style={styles.divider}>
        <View style={styles.divLine} />
        <Text style={styles.divText}>or continue with</Text>
        <View style={styles.divLine} />
      </View>

      {/* Google */}
      <TouchableOpacity
        style={styles.btn}
        onPress={() => handleAuth?.('Google')}
      >
        <View style={styles.iconBox}>
          <GoogleIcon />
        </View>
        <Text style={styles.btnTextStrong}>Google</Text>
      </TouchableOpacity>

      {/* Expand */}
      {!showMore && (
        <TouchableOpacity
          style={styles.expandRow}
          onPress={() => setShowMore(true)}
        >
          <Text style={styles.expandText}>Other methods</Text>
          <Ionicons name="chevron-down" size={18} color={C.green} />
        </TouchableOpacity>
      )}

      {/* Hidden auth */}
      {showMore && (
        <>
          <TouchableOpacity style={styles.btn}>
            <View style={styles.iconBox}>
              <AppleIcon />
            </View>
            <Text style={styles.btnTextStrong}>Apple</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btn}
            onPress={() => handleAuth?.('GitHub')}
          >
            <View style={styles.iconBox}>
              <GitHubIcon />
            </View>
            <Text style={styles.btnTextStrong}>GitHub</Text>
          </TouchableOpacity>
        </>
      )}

      {/* Terms */}
      <Text style={styles.terms}>
        By continuing, you agree to our{' '}
        <Text style={styles.link}>Terms & Conditions</Text>,{' '}
        <Text style={styles.link}>Privacy Policy</Text> and{' '}
        <Text style={styles.link}>Cookies Policy</Text>.
      </Text>

      {/* Home bar */}
      <View style={styles.homeBar} />
    </View>
  );
}

const styles = {
  card: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 22,
    paddingTop: 28,
    paddingBottom: 28,
  },

  welcomeTitle: {
    fontSize: 30,
    fontWeight: '900',
    color: C.dark,
    textAlign: 'center',
  },

  welcomeSub: {
    fontSize: 14,
    color: C.soft,
    textAlign: 'center',
    marginBottom: 18,
  },

  inputBox: {
    marginBottom: 14,
  },

  inputLabel: {
    fontSize: 12,
    color: C.soft,
    marginBottom: 6,
  },

  input: {
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },

  primaryBtn: {
    backgroundColor: C.green,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 14,
  },

  primaryBtnText: {
    color: '#fff',
    fontWeight: '700',
  },

  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },

  divLine: {
    flex: 1,
    height: 1,
    backgroundColor: C.border,
  },

  divText: {
    marginHorizontal: 8,
    fontSize: 11,
    color: C.soft,
  },

  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: C.border,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 10,
  },

  iconBox: {
    width: 26,
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },

  btnTextStrong: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '700',
    color: C.dark,
  },

  expandRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 6,
  },

  expandText: {
    fontSize: 12,
    color: C.green,
    fontWeight: '600',
  },

  terms: {
    fontSize: 11,
    color: C.soft,
    textAlign: 'center',
    marginTop: 14,
    lineHeight: 16,
  },

  link: {
    color: C.green,
    fontWeight: '600',
  },

  homeBar: {
    width: 120,
    height: 4,
    backgroundColor: C.dark,
    opacity: 0.15,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 18,
  },
};