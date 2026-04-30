import React from "react";
import { View } from "react-native";
import Svg, { Path, Rect } from "react-native-svg";
import { C } from "../../lib/theme";

export default function LogoIcon() {
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