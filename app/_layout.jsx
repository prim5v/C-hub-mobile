// import "@/lib/sentry";
// import * as WebBrowser from "expo-web-browser";
// import { ClerkProvider } from "@clerk/clerk-expo";
// import { tokenCache } from "@clerk/clerk-expo/token-cache";
// import { Slot } from "expo-router";

// import { ApiProvider } from "@/contexts/ApiContext";
// import { AuthProvider } from "@/contexts/AuthContext";

// WebBrowser.maybeCompleteAuthSession();

// const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

// if (!publishableKey) {
//   throw new Error("Add your Clerk Publishable Key to the .env file");
// }

// export default function RootLayout() {
//   return (
//     <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
//       <ApiProvider>
//         <AuthProvider>
//           <Slot />
//         </AuthProvider>
//       </ApiProvider>
//     </ClerkProvider>
//   );
// }
import "@/lib/sentry";
import * as WebBrowser from "expo-web-browser";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { Slot } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";

import { ApiProvider } from "@/contexts/ApiContext";
import { AuthProvider } from "@/contexts/AuthContext";

WebBrowser.maybeCompleteAuthSession();

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
  throw new Error("Add your Clerk Publishable Key to the .env file");
}

export default function RootLayout() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // small delay ensures router + native + clerk boot correctly
    const t = setTimeout(() => {
      setReady(true);
    }, 50);

    return () => clearTimeout(t);
  }, []);

  if (!ready) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000A04" }}>
        <ActivityIndicator color="#2E7D32" />
      </View>
    );
  }

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ApiProvider>
        <AuthProvider>
          <Slot />
        </AuthProvider>
      </ApiProvider>
    </ClerkProvider>
  );
}