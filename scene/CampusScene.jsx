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
import { C } from '../lib/theme';


const { width: SW } = Dimensions.get('window');
const SCENE_H = 150;
const SCENE_W = SW;


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
        transformOrigin: `${crownR + trunkW / 2}px ${trunkH + crownR * 2}px`,
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
export default function CampusScene() {
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
