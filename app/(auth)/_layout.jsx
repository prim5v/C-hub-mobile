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
import { useAuthContext } from "@/contexts/AuthContext";



export default function AuthRoutesLayout() {
  const { dbUser, authReady } = useAuthContext();
  const { isSignedIn, isLoaded } = useAuth();

  const SignedIn = isSignedIn || dbUser; // consider user signed in if either Clerk or DB has user data, this will work if app is online or offline (cached user)

  // if (!isLoaded || !authReady) return null; 

  if (SignedIn) {
    return <Redirect href="/(tabs)" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}