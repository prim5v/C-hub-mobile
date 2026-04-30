import React from "react";
import { View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { C } from "../../lib/theme";

export default function EmailIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Rect x={2} y={4} width={20} height={16} rx={3} stroke={C.green} strokeWidth={2}/>
      <Path d="M2 7l10 7 10-7" stroke={C.green} strokeWidth={2} strokeLinecap="round"/>
    </Svg>
  );
}
