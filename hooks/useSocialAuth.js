import { useSSO } from "@clerk/clerk-expo";
import { useState } from "react";
import { Alert } from "react-native";
import * as AuthSession from "expo-auth-session";

const useSocialAuth = () => {
  const [loadingStrategy, setLoadingStrategy] = useState(null);
  const { startSSOFlow } = useSSO();

  const handleSocialAuth = async (strategy) => {
    if (loadingStrategy) return;

    setLoadingStrategy(strategy);

    try {
      // 🔥 IMPORTANT: explicit redirect URL
      const redirectUrl = AuthSession.makeRedirectUri({
        scheme: "chub", // MUST match app.json
      });

      const { createdSessionId, setActive } = await startSSOFlow({
        strategy,
        redirectUrl,
      });

      if (!createdSessionId || !setActive) {
            const provider =
            strategy === "oauth_google"
                ? "Google"
                : strategy === "oauth_apple"
                ? "Apple"
                : "GitHub";

        Alert.alert(
          "Sign-in incomplete",
          `${provider} sign-in did not complete. Please try again.`
        );
        return;
      }

      await setActive({ session: createdSessionId });

      // ❌ DO NOT manually navigate here
      // let auth state + layout handle it
    } catch (error) {
      console.log("💥 Social auth error:", error);

      Alert.alert("Error", `Failed to sign in with ${provider}. Please try again.`);
    } finally {
      setLoadingStrategy(null);
    }
  };

  return { handleSocialAuth, loadingStrategy };
};

export default useSocialAuth;