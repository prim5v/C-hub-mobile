// import React, { useEffect, useRef, useState } from 'react';
// import { StatusBar, ScrollView, KeyboardAvoidingView, Platform, Animated, Easing } from 'react-native';

// // import { C } from '../lib/theme';
// import { C } from '../lib/theme';
// import Hero from '../components/Hero';
// import CampusScene from '../scene/CampusScene';
// import AuthCard from '../components/AuthCard';
// import { SafeAreaView } from "react-native-safe-area-context";

// export default function CHubAuth() {
//   const [mode, setMode] = useState('signup');
//   const isLogin = mode === 'login';
//   const verb    = isLogin ? 'Log in' : 'Sign up';

//   // Entrance animations
//   const heroOpacity  = useRef(new Animated.Value(0)).current;
//   const heroY        = useRef(new Animated.Value(-14)).current;
//   const cardOpacity  = useRef(new Animated.Value(0)).current;
//   const cardY        = useRef(new Animated.Value(28)).current;
//   const curtain = useRef(new Animated.Value(0)).current;

//   const [showMore, setShowMore] = useState(false);
//   const [email, setEmail] = useState('');


//     useEffect(() => {
//     Animated.parallel([
//       Animated.timing(heroOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
//       Animated.timing(heroY,       { toValue: 0, duration: 500, easing: Easing.out(Easing.ease), useNativeDriver: true }),
//       Animated.timing(cardOpacity, { toValue: 1, duration: 600, delay: 150, useNativeDriver: true }),
//       Animated.timing(cardY,       { toValue: 0, duration: 600, delay: 150, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
//     ]).start();
//   }, []);

//   // const handleAuth = (provider) => {
//   //   console.log(`${verb} with ${provider}`);
//   //   // TODO: wire up your OAuth / Supabase / Firebase logic here
//   // };

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: C.greenMist }}>
//       <StatusBar barStyle="dark-content" backgroundColor={C.greenMist} />

//       <KeyboardAvoidingView
//         style={{ flex: 1 }}
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//       >
//         <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
          
//           <Hero />

//           <CampusScene />

//           <AuthCard mode={mode} setMode={setMode} />

//         </ScrollView>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// }



/**
 * CHubAuth.jsx — React Native / Expo
 *
 * Dependencies (all included in a default Expo project):
 *   react-native, react (useState, useEffect, useRef)
 *
 * Optional (for the SVG campus scene):
 *   expo install react-native-svg
 *
 * Drop this file anywhere in your project and import:
 *   import CHubAuth from './CHubAuth';
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  ActivityIndicator,
  Platform,
} from 'react-native';
// import { KeyboardAvoidingView, Platform } from "react-native";
import Svg, {
  Ellipse,
  Rect,
  Polygon,
  Path,
  Circle,
  G,
} from 'react-native-svg';
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { C } from '../../lib/theme';
import useSocialAuth from '@/hooks/useSocialAuth';
import { useAuth, useSignUp, useSignIn } from '@clerk/clerk-expo'
import { router } from "expo-router";


const { width: SW } = Dimensions.get('window');
const SCENE_H = 150;
const SCENE_W = SW;


// ─── colours ─────────────────────────────────────────────────────────────────


// ─── Animated cloud component ─────────────────────────────────────────────────
/**
 * Scrolls children from left-edge (startX) to right-edge continuously.
 * duration  – ms for one full pass
 * delay     – ms initial delay
 */
function ScrollingCloud({ children, duration, delay = 0, y }) {
  const x = useRef(new Animated.Value(-120)).current;

   // ✅ stable random multiplier (runs once)
  const randomFactor = useRef(0.8 + Math.random() * 0.4).current;

  useEffect(() => {
    const run = () => {
      x.setValue(-120);
      Animated.timing(x, {
        toValue: SW + 60,
        duration: duration * randomFactor, // add some natural variation to cloud speeds
        delay,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          run(); // loop
        }
      });
    };
    run();
  }, []);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: y,
        transform: [{ translateX: x }],
      }}
    >
      {children}
    </Animated.View>
  );
}

// ─── Animated tree component ──────────────────────────────────────────────────
function SwayingTree({ x, baseY, trunkH = 24, crownR = 13, topR = 9, delay = 0, amplitude = 6 }) {
  const rot = useRef(new Animated.Value(0)).current;
  const randomFactor = useRef(0.8 + Math.random() * 0.5).current;
  const randomDelay = useRef(Math.random() * 800).current;

useEffect(() => {
  Animated.loop(
    Animated.sequence([
      Animated.timing(rot, {
        toValue: amplitude,
        duration: 1200 * randomFactor,
        delay: delay + randomDelay,
        easing: Easing.inOut(Easing.sin),
        useNativeDriver: true,
      }),
      Animated.timing(rot, {
        toValue: -amplitude,
        duration: 1600 * randomFactor,
        easing: Easing.inOut(Easing.sin),
        useNativeDriver: true,
      }),
      Animated.timing(rot, {
        toValue: 0,
        duration: 1000 * randomFactor,
        easing: Easing.inOut(Easing.sin),
        useNativeDriver: true,
      }),
    ])
  ).start();
}, []);

  const trunkW = 5;
  const crownY = baseY - trunkH - crownR * 0.6;
  const topY   = crownY - crownR * 0.7;

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: x - trunkW / 2,
        top: baseY - trunkH - crownR * 2,
        width: trunkW + crownR * 2,
        height: trunkH + crownR * 2 + topR,
        // transformOrigin: `${crownR + trunkW / 2}px ${trunkH + crownR * 2}px`,
        transform: [
          {
            rotate: rot.interpolate({
              inputRange: [-amplitude, amplitude],
              outputRange: [`-${amplitude}deg`, `${amplitude}deg`],
            }),
          },
        ],
      }}
    >
      <Svg width={trunkW + crownR * 2 + 4} height={trunkH + crownR * 2 + topR + 4}>
        {/* trunk */}
        <Rect
          x={crownR - trunkW / 2 + 2}
          y={crownR * 2 + topR}
          width={trunkW}
          height={trunkH}
          rx={2}
          fill={C.tree3}
          opacity={0.85}
        />
        {/* lower crown */}
        <Ellipse
          cx={crownR + 2}
          cy={crownR + topR + crownR * 0.4}
          rx={crownR}
          ry={crownR}
          fill={C.tree1}
          opacity={0.9}
        />
        {/* upper crown */}
        <Ellipse
          cx={crownR + 2}
          cy={topR + crownR * 0.1}
          rx={topR}
          ry={topR}
          fill={C.tree2}
          opacity={0.85}
        />
      </Svg>
    </Animated.View>
  );
}

// ─── Static building helper ───────────────────────────────────────────────────
function Building({ x, y, w, h, fill, opacity = 0.8, windows = [], spireH = 0 }) {
  return (
    <>
      {spireH > 0 && (
        <>
          <Rect x={x + w / 2 - 4} y={y - spireH} width={8} height={spireH} rx={2} fill={C.spire} />
          <Polygon
            points={`${x + w / 2 - 4},${y - spireH} ${x + w / 2 + 4},${y - spireH} ${x + w / 2},${y - spireH - 10}`}
            fill={C.spire2}
          />
        </>
      )}
      <Rect x={x} y={y} width={w} height={h} rx={3} fill={fill} opacity={opacity} />
      {windows.map((wr, i) => (
        <Rect key={i} x={wr.x} y={wr.y} width={wr.w || 8} height={wr.h || 10} rx={1} fill={C.green} opacity={0.35} />
      ))}
    </>
  );
}

// ─── Cloud shape helper ───────────────────────────────────────────────────────
function CloudShape({ cx, cy, rx, ry, fill, opacity }) {
  return <Ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={fill} opacity={opacity} />;
}

// ─── Campus Scene ─────────────────────────────────────────────────────────────
function CampusScene() {
  const VW = 400; // internal SVG viewBox width

  return (
    <SafeAreaView className="flex-1 bg-background"> 
    <View style={{ width: '100%', height: SCENE_H, overflow: 'hidden' }}>
      {/* Static SVG layer — hills, buildings */}
      <Svg
        width="100%"
        height={SCENE_H}
        viewBox={`0 0 ${VW} ${SCENE_H}`}
        preserveAspectRatio="xMidYMid slice"
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        {/* Hills */}
        <Ellipse cx={120} cy={SCENE_H} rx={210} ry={70}  fill={C.hill1} opacity={0.65} />
        <Ellipse cx={320} cy={SCENE_H} rx={170} ry={58}  fill={C.hill2} opacity={0.55} />

        {/* Left building */}
        <Building x={58}  y={52}  w={38} h={98} fill={C.bld1} spireH={20}
          windows={[
            {x:65,y:60},{x:79,y:60},
            {x:65,y:76},{x:79,y:76},
            {x:65,y:93},{x:79,y:93},
          ]}
        />

        {/* Middle building */}
        <Building x={148} y={68}  w={30} h={82} fill={C.bld2} opacity={0.75}
          windows={[
            {x:154,y:75,w:7,h:9},{x:165,y:75,w:7,h:9},
            {x:154,y:90,w:7,h:9},{x:165,y:90,w:7,h:9},
          ]}
        />

        {/* Right building */}
        <Building x={272} y={58}  w={42} h={92} fill={C.bld1} opacity={0.75} spireH={22}
          windows={[
            {x:279,y:66,w:9,h:11},{x:295,y:66,w:9,h:11},
            {x:279,y:83,w:9,h:11},{x:295,y:83,w:9,h:11},
            {x:279,y:100,w:9,h:11},{x:295,y:100,w:9,h:11},
          ]}
        />

        {/* Far-right small building */}
        <Building x={346} y={76}  w={28} h={74} fill={C.bld3} opacity={0.65}
          windows={[
            {x:352,y:83,w:6,h:8},{x:362,y:83,w:6,h:8},
            {x:352,y:97,w:6,h:8},{x:362,y:97,w:6,h:8},
          ]}
        />

        {/* Ground strip */}
        <Rect x={0} y={SCENE_H - 4} width={VW} height={6} fill="#C0DEC0" opacity={0.5} rx={2} />
      </Svg>

      {/* ── Animated clouds — 3 layers, 2 instances each ── */}

      {/* Layer 1 — fast, small, high */}
      <ScrollingCloud duration={18000} delay={0} y={8}>
        <Svg width={80} height={36}>
          <CloudShape cx={30} cy={18} rx={18} ry={8}  fill={C.cloud1} opacity={0.9}  />
          <CloudShape cx={47} cy={13} rx={13} ry={7}  fill={C.cloud1} opacity={0.9}  />
          <CloudShape cx={18} cy={22} rx={10} ry={6}  fill={C.cloud1} opacity={0.7}  />
        </Svg>
      </ScrollingCloud>
      <ScrollingCloud duration={18000} delay={3000} y={14}>
        <Svg width={80} height={36}>
          <CloudShape cx={30} cy={16} rx={20} ry={9}  fill={C.cloud1} opacity={0.85} />
          <CloudShape cx={50} cy={10} rx={14} ry={7}  fill={C.cloud1} opacity={0.85} />
          <CloudShape cx={16} cy={21} rx={11} ry={6}  fill={C.cloud1} opacity={0.65} />
        </Svg>
      </ScrollingCloud>

      {/* Layer 2 — medium speed */}
      <ScrollingCloud duration={26000} delay={0} y={22}>
        <Svg width={100} height={46}>
          <CloudShape cx={42} cy={26} rx={26} ry={12} fill={C.cloud2} opacity={0.8}  />
          <CloudShape cx={64} cy={18} rx={18} ry={10} fill={C.cloud2} opacity={0.8}  />
          <CloudShape cx={24} cy={30} rx={14} ry={8}  fill={C.cloud2} opacity={0.6}  />
        </Svg>
      </ScrollingCloud>
      <ScrollingCloud duration={26000} delay={4500} y={18}>
        <Svg width={100} height={46}>
          <CloudShape cx={40} cy={24} rx={24} ry={11} fill={C.cloud2} opacity={0.75} />
          <CloudShape cx={61} cy={17} rx={16} ry={9}  fill={C.cloud2} opacity={0.75} />
          <CloudShape cx={22} cy={29} rx={12} ry={7}  fill={C.cloud2} opacity={0.55} />
        </Svg>
      </ScrollingCloud>

      {/* Layer 3 — slow, large, low */}
      <ScrollingCloud duration={36000} delay={0} y={32}>
        <Svg width={120} height={56}>
          <CloudShape cx={50} cy={38} rx={30} ry={14} fill={C.cloud3} opacity={0.7}  />
          <CloudShape cx={76} cy={28} rx={22} ry={12} fill={C.cloud3} opacity={0.7}  />
          <CloudShape cx={28} cy={44} rx={16} ry={9}  fill={C.cloud3} opacity={0.5}  />
        </Svg>
      </ScrollingCloud>
      <ScrollingCloud duration={36000} delay={6500} y={28}>
        <Svg width={120} height={56}>
          <CloudShape cx={50} cy={36} rx={28} ry={13} fill={C.cloud3} opacity={0.65} />
          <CloudShape cx={74} cy={26} rx={20} ry={11} fill={C.cloud3} opacity={0.65} />
          <CloudShape cx={26} cy={42} rx={14} ry={8}  fill={C.cloud3} opacity={0.45} />
        </Svg>
      </ScrollingCloud>

      {/* ── Animated trees ── */}
      <SwayingTree x={95}  baseY={SCENE_H - 6} trunkH={25} crownR={13} topR={9}  delay={0}    amplitude={6} />
      <SwayingTree x={120} baseY={SCENE_H - 6} trunkH={22} crownR={10} topR={7}  delay={400}  amplitude={7} />
      <SwayingTree x={190} baseY={SCENE_H - 6} trunkH={24} crownR={14} topR={10} delay={900}  amplitude={6} />
      <SwayingTree x={215} baseY={SCENE_H - 6} trunkH={20} crownR={9}  topR={6}  delay={200}  amplitude={8} />
      <SwayingTree x={328} baseY={SCENE_H - 6} trunkH={26} crownR={13} topR={9}  delay={700}  amplitude={6} />
    </View>
    </SafeAreaView>
  );
}

// ─── Logo ─────────────────────────────────────────────────────────────────────
function LogoIcon() {
  return (
    <Svg width={66} height={66} viewBox="0 0 80 80" fill="none">
      <Path
        d="M68 28C62 14 46 6 30 10C14 14 4 28 6 44C8 60 22 70 38 70C50 70 60 64 66 54"
        stroke={C.green} strokeWidth={10} strokeLinecap="round"
      />
      <Path d="M66 54 L74 46 L60 44 Z" fill={C.green} />
      <Path d="M27 50V38L40 28L53 38V50H44V43H36V50H27Z" fill={C.green} />
      <Rect x={37} y={44} width={6} height={6} rx={1} fill="white" opacity={0.8} />
      <Path d="M23 40L40 27L57 40" stroke={C.green} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// ─── Provider icons ───────────────────────────────────────────────────────────
function GoogleIcon() {
  return (
    <View style={styles.googleBg}>
      <Svg width={17} height={17} viewBox="0 0 18 18">
        <Path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
        <Path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
        <Path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
        <Path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
      </Svg>
    </View>
  );
}

function AppleIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill={C.dark}>
      <Path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
    </Svg>
  );
}

function EmailIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Rect x={2} y={4} width={20} height={16} rx={3} stroke={C.green} strokeWidth={2}/>
      <Path d="M2 7l10 7 10-7" stroke={C.green} strokeWidth={2} strokeLinecap="round"/>
    </Svg>
  );
}

function GitHubIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill={C.dark}>
      <Path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
    </Svg>
  );
}

// ─── Providers list ───────────────────────────────────────────────────────────
const PROVIDERS = [
  { id: 'google', label: 'Google', icon: <GoogleIcon />, primary: true },
  { id: 'apple',  label: 'Apple',  icon: <AppleIcon />,  primary: false },
  { id: 'email',  label: 'Email',  icon: <EmailIcon />,  primary: false },
  { id: 'github', label: 'GitHub', icon: <GitHubIcon />, primary: false },
];

function OtpScreen({
  otp,
  setOtp,
  inputs,
  handleOtpChange,
  verifyOtp,
  resendOtp,
  verifying,
  error,
  setError,
  otpSuccess,
//   animateOtpPulse,
}) {
  // const otpAnim = useRef(new Animated.Value(1)).current;
  const otpAnim = useRef(
  Array.from({ length: 6 }, () => new Animated.Value(1))
).current;
  const swayAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const isComplete = otp.every((v) => v !== "");

  // ── Pulse (input feedback)
const animateOtpPulse = () => {
  const animations = otpAnim.map((anim) =>
    Animated.sequence([
      Animated.timing(anim, {
        toValue: 1.08,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(anim, {
        toValue: 0.98,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(anim, {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
      }),
    ])
  );

  Animated.parallel(animations).start();
};
  // ── Sway (auto verify feel)
//  const swayAnim = useRef(new Animated.Value(0)).current;

const animateSway = () => {
  swayAnim.setValue(0);

  Animated.sequence([
    Animated.timing(swayAnim, {
      toValue: 8,
      duration: 120,
      useNativeDriver: true,
    }),
    Animated.timing(swayAnim, {
      toValue: -8,
      duration: 120,
      useNativeDriver: true,
    }),
    Animated.timing(swayAnim, {
      toValue: 6,
      duration: 120,
      useNativeDriver: true,
    }),
    Animated.timing(swayAnim, {
      toValue: 0,
      duration: 120,
      useNativeDriver: true,
    }),
  ]).start();
};


  // ── Shake (error)
const animateShake = () => {
  shakeAnim.stopAnimation();
  shakeAnim.setValue(0);

  Animated.sequence([
    Animated.timing(shakeAnim, { toValue: 8, duration: 50, useNativeDriver: true }),
    Animated.timing(shakeAnim, { toValue: -8, duration: 50, useNativeDriver: true }),
    Animated.timing(shakeAnim, { toValue: 6, duration: 50, useNativeDriver: true }),
    Animated.timing(shakeAnim, { toValue: -6, duration: 50, useNativeDriver: true }),
    Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
  ]).start();
};

  useEffect(() => {
  let interval;

  if (!canResend) {
    interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  return () => clearInterval(interval);
}, [canResend]);


const hasVerifiedRef = useRef(false);


useEffect(() => {
  const code = otp.join("");

  if (code.length !== 6) return;
  if (verifying) return;
  if (otpSuccess) return;
  if (hasVerifiedRef.current) return;

  hasVerifiedRef.current = true;

  requestAnimationFrame(() => {
    animateOtpPulse();
    animateSway();
    verifyOtp(code);
  });

}, [otp.join("")]);


useEffect(() => {
  hasVerifiedRef.current = false;
}, [otp.join("")]);

  // ── Error trigger animation
  useEffect(() => {
    if (error) {
      animateShake();
    }
  }, [error]);

  const containerAnimStyle = {
    transform: [
      {
        translateX: shakeAnim,
      },
      {
        translateY: swayAnim.interpolate({
          inputRange: [-1, 1],
          outputRange: [6, -6],
        }),
      },
    ],
  };

  const handleResend = async () => {
  if (!canResend) return;

  setResendTimer(60);
  setCanResend(false);

  try {
    await resendOtp();
  } catch (e) {
    console.log("Resend failed", e);
  }
};

  return (
    
    <View style={styles.otpFull}>
      {/* <Text style={styles.title}>Verify Email</Text> */}
      {!otpSuccess && !verifying && (
  <Text style={styles.title}>Verify Email</Text>
)}


      {!otpSuccess && (
  <>
    {error ? (
      <Text style={styles.errorText}>{error}</Text>
    ) : (
      <Text style={styles.subText}>
        Enter the 6-digit code sent to your email
      </Text>
    )}
  </>
)}

      


      {otpSuccess && (
  <Animated.View
    style={{
      marginBottom: 20,
      transform: [{ scale: swayAnim.interpolate({
        inputRange: [-8, 0, 8],
        outputRange: [0.9, 1, 1.1]
      })}]
    }}
  >
    <Ionicons
      name="checkmark-circle"
      size={72}
      color="#2E8B3A"
    />
  </Animated.View>
)}

      {/* OTP BOXES */}
      {/* <Animated.View style={[styles.otpRow, containerAnimStyle]}> */}
      {!otpSuccess && (
  <Animated.View style={[styles.otpRow, containerAnimStyle]}>
        {otp.map((digit, index) => (
          <Animated.View
            key={index}
            style={{
              // transform: [{ scale: otpAnim }],
              transform: [{ scale: otpAnim[index] }],
            }}
          >
            <TextInput
              ref={(ref) => (inputs.current[index] = ref)}
              style={[
                styles.otpBox,
                error && { borderColor: "red" },
              ]}
              keyboardType="number-pad"
              maxLength={1}
              editable={!verifying}
              value={digit || ""}
              onChangeText={(text) => handleOtpChange(text, index)}
            />
          </Animated.View>
        ))}
      </Animated.View> )}

      {/* VERIFYING STATE */}
      {verifying && (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="small" color="#2E8B3A" />
          <Text style={styles.verifyingText}>Verifying code...</Text>
        </View>
      )}

      {/* BUTTON (optional fallback manual verify) */}
      { !otpSuccess && !verifying && (
        <TouchableOpacity
          style={styles.primaryBtn}
          // onPress={() => verifyOtp(otp.join(""))}
          onPress={() => {
            const code = otp.join("").replace(/\s/g, "");

            if (code.length !== 6) {
              setError("Enter full code");
              return;
            }

            verifyOtp(code);
          }}
        >
          <Text style={styles.primaryBtnText}>Verify</Text>
        </TouchableOpacity>
      )}

      {/* RESEND */}
      {!otpSuccess && !verifying && (
        <TouchableOpacity onPress={handleResend} disabled={!canResend}>
          <Text style={[
            styles.resendText,
            !canResend && { opacity: 0.4 }
          ]}>
        {canResend ? "Resend code" : `Resend in ${resendTimer}s`}
      </Text>
    </TouchableOpacity> )}
    </View>
  );
}
// ─── Main screen ──────────────────────────────────────────────────────────────
export default function CHubAuth() {
  const [mode, setMode] = useState('signup'); // 'signup' | 'login'
  const isLogin = mode === 'login';
  const verb    = isLogin ? 'Log in' : 'Sign up';

  // Entrance animations
  const heroOpacity  = useRef(new Animated.Value(0)).current;
  const heroY        = useRef(new Animated.Value(-14)).current;
  const cardOpacity  = useRef(new Animated.Value(0)).current;
  const cardY        = useRef(new Animated.Value(28)).current;
  const curtain = useRef(new Animated.Value(0)).current;

  const [showMore, setShowMore] = useState(false);
  const [email, setEmail] = useState('');
  // const [pwd, setPwd] = useState('')
  const { handleSocialAuth, loadingStrategy } = useSocialAuth();
  const isLoading = loadingStrategy !== null;
  const [loading, setLoading ]= useState();
  const showLoading = isLoading || loading;
  const [c, setC ] =useState(false)
  const [showPwd, setShowPwd] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState("email"); 
// "email" | "password"

  const { signUp, errors, fetchStatus, setActive:setActiveSignUp, } = useSignUp()
  const { signIn, setActive:setActiveSignIn, } = useSignIn();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputs = useRef([]);
  const otpAnim = useRef(otp.map(() => new Animated.Value(1))).current;
  const [verifying, setVerifying] = useState(false);
  const [otpSuccess, setOtpSuccess] = useState(false);
  const hasVerifiedRef = useRef(false);
  const { isSignedIn } = useAuth();


const handleAuth = async () => {
  if (step==="email"){
    const validEmail = /\S+@\S+\.\S+/.test(email);

    if (!validEmail) {
      setError("Enter email");
      return;
    }
    
    setStep("password");
    return;
  }

  if (!password || password.length < 6) {
    setError("Password too short");
    return;
  }

  setError("");

  try {
    // 1. TRY LOGIN FIRST

    setLoading(true)
    const signInAttempt = await signIn.create({
      identifier: email,
      password,
    });

    if (signInAttempt.status === "complete") {
      await setActiveSignIn({
        session: signInAttempt.createdSessionId,
      });
    
    //   router.replace("/(tabs)");
    }

    // 2. IF LOGIN FAILS → GO SIGNUP
    const signUpAttempt = await signUp.create({
      emailAddress: email,
      password,
    });

    // trigger OTP

    await signUpAttempt.prepareEmailAddressVerification({
      strategy: "email_code",
    });

    setStep("otp"); // move to OTP screen
    setLoading(false)
  } catch (err) {
    console.log(err);
    setLoading(false)

    // fallback: assume user doesn't exist → force signup
    try {
      const signUpAttempt = await signUp.create({
        emailAddress: email,
        password,
      });

      await signUpAttempt.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      setStep("otp");
      setLoading(false)
    } catch (e) {
      setError("Auth failed completely");
      setLoading(false)
    }
  }
};


const handleOtpChange = (text, index) => {
  hasVerifiedRef.current = false;

  const newOtp = [...otp];
  newOtp[index] = text;
  setOtp(newOtp);

  // auto move forward
  if (text && index < 5) {
    inputs.current[index + 1].focus();
  }

  
};

const verifyOtp = async (code) => {
  if (verifying || otpSuccess) return;
  try {
    console.log("Verifying OTP:", code);

    setVerifying(true);
    setError("");

    // animateOtpPulse();

    // 🔥 HARD GUARD (important)
    if (!signUp) {
      throw new Error("No signup session found");
    }

    const result = await signUp.attemptEmailAddressVerification({
      code: code.trim(),
    });

    // 🔥 PLACE IT HERE
    console.log("RESULT:", result);
    console.log("SESSION ID:", result.createdSessionId);


    console.log("OTP result:", result);

    if (result.status === "complete") {
        setVerifying(false);

        setOtpSuccess(true);
        // animateOtpPulse();

        await setActiveSignUp({
            session: result.createdSessionId,
        });


        return;
} else {
    setError("Verification incomplete");
}
  } catch (e) {
  console.log("OTP ERROR:", e);

  // show readable error
  setError(
    e?.errors?.[0]?.message ||
    "Invalid OTP or session expired"
  );

  // clear all OTP inputs
  setOtp(["", "", "", "", "", ""]);

  hasVerifiedRef.current = false;

  // focus first box again
  setTimeout(() => {
    inputs.current[0]?.focus();
  }, 100);

} finally {
  setVerifying(false);
}
};

const resendOtp = async () => {
  try {
    await signUp.prepareEmailAddressVerification({
      strategy: "email_code",
    });
  } catch (e) {
    setError("Failed to resend code");
  }
};
  

  useEffect(() => {
    Animated.parallel([
      Animated.timing(heroOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(heroY,       { toValue: 0, duration: 500, easing: Easing.out(Easing.ease), useNativeDriver: true }),
      Animated.timing(cardOpacity, { toValue: 1, duration: 600, delay: 150, useNativeDriver: true }),
      Animated.timing(cardY,       { toValue: 0, duration: 600, delay: 150, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, []);



  if (step === "otp") {
  return (
    <SafeAreaView style={styles.safe}>
      {/* <OtpScreen /> */}
      <OtpScreen
        otp={otp}
        setOtp={setOtp}
        inputs={inputs}
        handleOtpChange={handleOtpChange}
        verifyOtp={verifyOtp}
        resendOtp={resendOtp}
        verifying={verifying}
        error={error}
        otpSuccess={otpSuccess}
        setError={setError}
        // animateOtpPulse={animateOtpPulse}
        // animateOtpPulse
      />
    </SafeAreaView>
  );
}


  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={C.greenMist} />
          <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Hero ── */}
        <Animated.View style={[styles.hero, { opacity: heroOpacity, transform: [{ translateY: heroY }] }]}>
          <View style={styles.logoWrap}>
            <LogoIcon />
          </View>
          <Text style={styles.brandName}>C-Hub</Text>
          <Text style={styles.taglineMain}>Find your perfect{'\n'}campus home</Text>
          <Text style={styles.taglineSub}> Smart. Fast. Reliable. Trusted.</Text>
        </Animated.View>

        {/* ── Animated campus scene ── */}
        <CampusScene />

        {/* ── Card ── */}
        <Animated.View style={[styles.card, { opacity: cardOpacity, transform: [{ translateY: cardY }] }]}>

          {/* Tab switcher */}
          <Text style={styles.welcomeTitle}>
            Welcome 
          </Text>

          <Text style={styles.welcomeSub}>
          Let’s start with your email
        </Text>

<View style={styles.inputBox}>
  <Text style={styles.inputLabel}>Email</Text>
<TextInput
  value={email}
  onChangeText={(text) => {
    setEmail(text);
    setError(""); // clear error when typing
  }}
  placeholder="you@example.com"
  style={styles.input}
/>

{error !== "" && (
  <Text style={{ color: "red", marginBottom: 10 }}>
    {error}
  </Text>
)}
</View>

{step === "password" && (
  <View style={styles.inputBox}>
    <Text style={styles.inputLabel}>Password</Text>

    <View style={styles.passwordRow}>
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="******"
        secureTextEntry={!showPwd}
        style={styles.input}
      />

      <TouchableOpacity onPress={() => setShowPwd(!showPwd)}>
        <Text style={styles.toggleText}>
          {showPwd ? "Hide" : "Show"}
        </Text>
      </TouchableOpacity>
    </View>
  </View>
)}

<TouchableOpacity
  style={styles.primaryBtn}
  onPress={handleAuth}
>
  <Text style={styles.primaryBtnText}>
    {step === "email" ? "Continue" : "Sign in"}
  </Text>
</TouchableOpacity>

{/* divider */}
<View style={styles.divider}>
  <View style={styles.divLine} />
  <Text style={styles.divText}>or continue with</Text>
  <View style={styles.divLine} />
</View>

{/* Google ONLY */}
<TouchableOpacity
  disabled={isLoading}
  style={[styles.btn, styles.btnOutline]}
  onPress={() => !isLoading && handleSocialAuth("oauth_google") }
>
  <View style={styles.btnIcon}>
    <GoogleIcon />
  </View>
  <Text style={styles.btnLabelStrong}>Google</Text>
</TouchableOpacity>

{/* expand arrow */}
{!showMore && (
  <TouchableOpacity
    onPress={() => setShowMore(true)}
    style={styles.expandRow}
  >
    <Text style={styles.expandText}>
      Other methods
    </Text>

    {/* <Text style={styles.arrowDown}>⌄</Text> */}
    <Ionicons name="chevron-down" size={20} color={C.green} />
  </TouchableOpacity>
)}

{/* hidden providers */}
{showMore && (
  <>
<TouchableOpacity style={[styles.btn, styles.btnOutline]}
disabled={isLoading}
onPress={() => !isLoading && handleSocialAuth("oauth_apple") }
>
  <View style={styles.btnIcon}>
    <AppleIcon />
  </View>
  <Text style={styles.btnLabelStrong}>Apple</Text>
</TouchableOpacity>

    <TouchableOpacity onPress={() => !isLoading && handleSocialAuth("oauth_github")} style={[styles.btn, styles.btnOutline]}>
      <View style={styles.btnIcon}>
        <GitHubIcon />
      </View>
      <Text style={styles.btnLabelStrong}>GitHub</Text>
    </TouchableOpacity>
  </>
)}

               {/* Terms */}
          <Text style={styles.terms}>
            By continuing, you agree to our{' '}
            <Text style={styles.termsLink}>Terms & Conditions</Text>
            {' '},{' '}
            <Text style={styles.termsLink}>Privacy Policy</Text>
            {' '}and{' '}
            <Text style={styles.termsLink}>Cookies Policy</Text>
            {'.'}
          </Text>


          {/* Home indicator bar */}
          <View style={styles.homeBar} />
        </Animated.View>
      </ScrollView>

{showLoading && (
  <View style={styles.loadingOverlay}>
    <ActivityIndicator size="large" color={C.green} />
    <Text style={styles.loadingText}>Signing you in...</Text>
  </View>
)}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: C.greenMist,
  },
  scroll: {
    flex: 1,
    backgroundColor: C.greenMist,
  },
  scrollContent: {
    flexGrow: 1,
  },

  // Hero
  hero: {
    paddingHorizontal: 20,
    paddingTop: 20,
    alignItems: 'center',
  },
  logoWrap: {
    marginBottom: 8,
  },
  brandName: {
    fontSize: 30,
    fontWeight: '900',
    color: C.green,
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  taglineMain: {
    fontSize: 19,
    fontWeight: '800',
    color: C.dark,
    lineHeight: 26,
    textAlign: 'center',
    marginBottom: 3,
  },
  taglineSub: {
    fontSize: 12,
    color: C.soft,
    letterSpacing: 0.5,
    marginBottom: 10,
  },

  // Google icon bg
  googleBg: {
    backgroundColor: C.white,
    borderRadius: 7,
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Card
  card: {
    backgroundColor: C.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 22,
    paddingTop: 28,
    paddingBottom: 28,
    flex: 1,
    marginTop: -14,
    shadowColor: C.green,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.07,
    shadowRadius: 20,
    elevation: 8,
  },

  // Tabs
  tabRow: {
    flexDirection: 'row',
    backgroundColor: C.greenPale,
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
    gap: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 9,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: C.white,
    shadowColor: C.green,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: C.soft,
  },
  tabTextActive: {
    color: C.green,
  },

  // Subtitle
  cardSub: {
    fontSize: 13,
    color: C.soft,
    textAlign: 'center',
    marginBottom: 20,
  },

  // Buttons
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderRadius: 14,
    paddingVertical: 13,
    paddingHorizontal: 16,
    marginBottom: 10,
    gap: 10,
  },
  btnPrimary: {
    backgroundColor: C.green,
  },
  btnOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: C.border,
  },
  btnIcon: {
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14.5,
    fontWeight: '600',
  },
  btnLabelPrimary: {
    color: C.white,
  },
  btnLabelOutline: {
    color: C.dark,
  },

  // Divider
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 8,
  },
  divLine: {
    flex: 1,
    height: 1,
    backgroundColor: C.border,
  },
  divText: {
    fontSize: 10.5,
    color: C.soft,
  },

  // Terms
  terms: {
    textAlign: 'center',
    fontSize: 11,
    color: C.soft,
    lineHeight: 18,
    paddingHorizontal: 4,
    marginTop: 14,
  },
  termsLink: {
    color: C.green,
    fontWeight: '600',
  },

  // Home indicator
  homeBar: {
    width: 120,
    height: 4,
    backgroundColor: C.dark,
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: 18,
    opacity: 0.15,
  },
  welcomeTitle: {
  fontSize: 32,
  fontWeight: '900',
  color: C.dark,
  textAlign: 'center',
  marginBottom: 6,
},

welcomeSub: {
  fontSize: 15,
  fontWeight: '500',
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
  backgroundColor: '#fff',
},

primaryBtn: {
  backgroundColor: C.green,
  paddingVertical: 12,
  borderRadius: 12,
  alignItems: 'center',
  marginBottom: 12,
},

primaryBtnText: {
  color: 'white',
  fontWeight: '700',
},

expandRow: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  paddingVertical: 10,
},

expandText: {
  fontSize: 12,
  color: C.green,
  fontWeight: '600',
},

btnLabelStrong: {
  flex: 1,
  textAlign: 'center',
  fontSize: 15,
  fontWeight: '800',
  color: C.dark,
},
arrowDown: {
  fontSize: 18,
  color: C.green,
  fontWeight: '900',
  marginLeft: 6,
  transform: [{ scaleX: 1.3 }],
},
passwordRow: {
  flexDirection: "row",
  alignItems: "center",
  borderWidth: 1,
  borderColor: C.border,
  borderRadius: 10,
  paddingHorizontal: 10,
},

toggleText: {
  color: C.green,
  fontWeight: "700",
  marginLeft: 10,
},
loadingOverlay: {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(255,255,255,0.85)",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 999,
},

loadingText: {
  marginTop: 10,
  fontSize: 14,
  fontWeight: "600",
  color: C.dark,
},
otpContainer: {
  marginTop: 20,
  alignItems: "center",
  gap: 20,
},

otpRow: {
  flexDirection: "row",
  justifyContent: "center",
  gap: 10,
},

otpBox: {
  width: 45,
  height: 50,
  borderWidth: 1,
  borderColor: C.border,
  borderRadius: 10,
  textAlign: "center",
  fontSize: 18,
  fontWeight: "700",
  backgroundColor: "#fff",
},

resendText: {
  color: C.green,
  fontWeight: "600",
  marginTop: 10,
},
otpFull: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: C.white,
},

otpBoxWrap: {
  marginHorizontal: 4,
},

otpBoxActive: {
  borderColor: C.green,
  shadowColor: C.green,
  shadowOpacity: 0.3,
  shadowRadius: 8,
},
});