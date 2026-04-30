// import { useEffect } from "react";
// import { useAuth } from "@clerk/clerk-expo";
// import { router, Stack } from "expo-router";

// export default function AuthRoutesLayout() {
//   const { isSignedIn, isLoaded } = useAuth();

//   useEffect(() => {
//     if (isLoaded && isSignedIn) {
//       router.replace("/(tabs)");
//     }
//   }, [isLoaded, isSignedIn]);

//   if (!isLoaded) {
//     return null;
//   }

//   return (
//     <Stack screenOptions={{ headerShown: false }} />
//   );
// }

import { useAuth } from "@clerk/clerk-expo";
import { Redirect, Stack } from "expo-router";

export default function AuthRoutesLayout() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return null;

  if (isSignedIn) {
    return <Redirect href="/(tabs)" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}