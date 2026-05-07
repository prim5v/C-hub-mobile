// import { createContext, useContext, useEffect, useState } from "react";
// import { useAuth, useUser } from "@clerk/clerk-expo";
// import { useApi } from "./ApiContext";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { router } from "expo-router";

// const AuthContext = createContext();

// const DB_USER_KEY = "db_user_cache";

// export const AuthProvider = ({ children }) => {
//   const { isSignedIn, signOut } = useAuth();
//   const { user } = useUser();
//   const { api } = useApi();

//   const [dbUser, setDbUser] = useState(null);
//   const [syncStatus, setSyncStatus] = useState("idle");
//   const [error, setError] = useState(null);
//   const [loadingCache, setLoadingCache] = useState(true);

//   // =========================
//   // LOAD CACHE ON START
//   // =========================
//   const loadCachedUser = async () => {
//     try {
//       const cached = await AsyncStorage.getItem(DB_USER_KEY);

//       if (cached) {
//         setDbUser(JSON.parse(cached));
//       }
//     } catch (e) {
//       console.log("Cache load error:", e);
//     } finally {
//       setLoadingCache(false);
//     }
//   };

//   // =========================
//   // SYNC WITH BACKEND
//   // =========================
//   const authSync = async () => {
//     if (!isSignedIn || !user) return;

//     try {
//       setSyncStatus("loading");

//       const res = await api.post("/auth/clerk/sync", {
//         clerk_id: user.id,
//         email: user?.primaryEmailAddress?.emailAddress,
//       });

//       const freshUser = res.data.user;

//       setDbUser(freshUser);
//       setSyncStatus("success");

//       await AsyncStorage.setItem(
//         DB_USER_KEY,
//         JSON.stringify(freshUser)
//       );

//     } catch (err) {
//       setSyncStatus("error");
//       setError(err);
//     }
//   };

//   // =========================
//   // LOGOUT (CLEAN + SAFE)
//   // =========================
//   const logout = async () => {
//     try {
//       // 1. Clear cache
//       await AsyncStorage.removeItem(DB_USER_KEY);

//       // 2. Reset local state
//       setDbUser(null);
//       setSyncStatus("idle");
//       setError(null);

//       // 3. Sign out from Clerk
//       await signOut();

//       // 4. Navigate to auth
//       router.replace("/(auth)");

//     } catch (err) {
//       console.log("Logout error:", err);
//     }
//   };

//   const clearCache = async () => {
//     await AsyncStorage.removeItem(DB_USER_KEY);
//     setDbUser(null);
//   };

//   // =========================
//   // INITIAL LOAD
//   // =========================
//   useEffect(() => {
//     loadCachedUser();
//   }, []);

//   useEffect(() => {
//     if (isSignedIn && user) {
//       authSync();
//     }
//   }, [isSignedIn, user]);

//   return (
//     <AuthContext.Provider
//       value={{
//         clerkUser: user,
//         dbUser,
//         syncStatus,
//         error,
//         loadingCache,
//         authSync,
//         clearCache,
//         logout, // 🔥 IMPORTANT
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuthContext = () => useContext(AuthContext);


import { createContext, useContext, useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { useApi } from "./ApiContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import * as Sentry from "@sentry/react-native";

// helpers
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";


const AuthContext = createContext();

const DB_USER_KEY = "db_user_cache";

/* =========================
   HELPERS
========================= */

// LOCATION
async function getUserLocation() {
  const { status } = await Location.requestForegroundPermissionsAsync();

  if (status !== "granted") {
    return null; // don’t crash auth flow
  }

  const loc = await Location.getCurrentPositionAsync({});
  return {
    lat: loc.coords.latitude,
    lng: loc.coords.longitude,
  };
}

// PUSH TOKEN
export async function getPushToken() {
  if (!Device.isDevice) return null;

  const { status: existingStatus } =
    await Notifications.getPermissionsAsync();

  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } =
      await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    return null;
  }

  const projectId =
    Constants?.expoConfig?.extra?.eas?.projectId;

  if (!projectId) {
    throw new Error("Missing Expo projectId");
  }

  const token = await Notifications.getExpoPushTokenAsync({
    projectId,
  });

  return token.data;
}

/* =========================
   PROVIDER
========================= */

export const AuthProvider = ({ children }) => {
  const { isSignedIn, signOut } = useAuth();
  const { user } = useUser();
  const { api } = useApi();

  const [dbUser, setDbUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [syncStatus, setSyncStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [loadingCache, setLoadingCache] = useState(true);

  /* =========================
     LOAD CACHE
  ========================= */
  const loadCachedUser = async () => {
    try {
      const cached = await AsyncStorage.getItem(DB_USER_KEY);

      if (cached) {
        setDbUser(JSON.parse(cached));
        
      }
    } catch (e) {
      Sentry.captureException(e, {
        tags: { layer: "cache.load" },
      });
    } finally {
      setLoadingCache(false);
      setAuthReady(true);
    }
  };

  /* =========================
     AUTH SYNC (CORE LOGIC)
  ========================= */
 const authSync = async () => {
  if (!isSignedIn || !user) {
    console.log("❌ AUTHSYNC BLOCKED: not signed in or no user");
    return;
  }

  try {
    console.log("🚀 AUTHSYNC STARTED");
    setSyncStatus("loading");

    // =========================
    // LOCATION
    // =========================
    console.log("📍 REQUESTING LOCATION...");

    const location = await getUserLocation();

    console.log("📍 LOCATION RESULT:", location);

    // =========================
    // PUSH TOKEN
    // =========================
    console.log("🔔 REQUESTING PUSH TOKEN...");

    const pushToken = await getPushToken();

    console.log("🔔 PUSH TOKEN RESULT:", pushToken);

    // =========================
    // USER DATA
    // =========================
    const email = user?.primaryEmailAddress?.emailAddress;

    const name =
      user.fullName ||
      user.username ||
      `${user.firstName || ""} ${user.lastName || ""}`;

    console.log("👤 USER DATA:", {
      email,
      name,
      clerk_id: user.id,
    });

    // =========================
    // FINAL PAYLOAD
    // =========================
    const payload = {
      email,
      name,
      pushToken,
      location,
    };

    console.log("📤 FINAL SYNC PAYLOAD:", JSON.stringify(payload, null, 2));

    // =========================
    // API CALL
    // =========================
    console.log("🌐 SENDING TO BACKEND...");

    const res = await api.post("/auth/clerk/sync", payload);

    console.log("📥 BACKEND RESPONSE:", res.data);

    const freshUser = res.data.user;

    setDbUser(freshUser);
    setSyncStatus("success");

    await AsyncStorage.setItem(DB_USER_KEY, JSON.stringify(freshUser));

    console.log("✅ AUTHSYNC SUCCESS COMPLETED");

  } catch (err) {
    console.log("❌ AUTHSYNC FAILED:", err?.message || err);

    setSyncStatus("error");
    setError(err);

    Sentry.captureException(err, {
      tags: { layer: "auth.sync" },
      extra: {
        clerk_id: user?.id,
      },
    });
  }
};

  /* =========================
     LOGOUT
  ========================= */
  const logout = async () => {
    try {
      await AsyncStorage.removeItem(DB_USER_KEY);

      setDbUser(null);
      setSyncStatus("idle");
      setError(null);

      await signOut();

      router.replace("/(auth)");
    } catch (err) {
      Sentry.captureException(err, {
        tags: { layer: "logout" },
      });
    }
  };

  const clearCache = async () => {
    await AsyncStorage.removeItem(DB_USER_KEY);
    setDbUser(null);
  };

  /* =========================
     INIT
  ========================= */
  useEffect(() => {
    loadCachedUser();
  }, []);

  useEffect(() => {
    console.log("🔥 AUTH STATE:", { isSignedIn, user });

    if (isSignedIn && user) {
      console.log("🚀 TRIGGERING AUTHSYNC");
      authSync();
    }
  }, [isSignedIn, user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        dbUser,
        authReady,
        syncStatus,
        error,
        loadingCache,
        authSync,
        clearCache,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);