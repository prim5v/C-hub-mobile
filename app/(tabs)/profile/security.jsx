import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useUser } from "@clerk/clerk-expo";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { KeyboardAvoidingView, Platform } from "react-native";


const PasswordInput = React.memo(
  ({ label, value, setValue, visible, setVisible }) => {
    return (
      <View style={{ marginBottom: 12 }}>
        <Text style={styles.label}>{label}</Text>

        <View style={styles.inputWrapper}>
          <TextInput
            secureTextEntry={!visible}
            value={value}
            onChangeText={setValue}
            style={styles.input}
            autoCorrect={false}
            autoCapitalize="none"
          />

          <TouchableOpacity onPress={() => setVisible(!visible)}>
            <Ionicons
              name={visible ? "eye-off" : "eye"}
              size={22}
              color="#666"
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
);


export default function ChangePasswordScreen() {
  const { user } = useUser();
  const router = useRouter();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);

  const updatePassword = async () => {
    try {
      setLoading(true);

      if (!currentPassword || !newPassword || !confirmPassword) {
        return Alert.alert("Error", "Fill all fields");
      }

      if (newPassword !== confirmPassword) {
        return Alert.alert("Error", "New passwords do not match");
      }

      if (newPassword.length < 8) {
        return Alert.alert("Error", "Password must be at least 8 characters");
      }

      await user.reauthenticate({
        password: currentPassword,
      });

      await user.updatePassword({
        newPassword,
      });

      Alert.alert("Success", "Password updated successfully");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.log("❌ PASSWORD ERROR:", err);
      Alert.alert("Error", err?.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  // const PasswordInput = ({
  //   label,
  //   value,
  //   setValue,
  //   visible,
  //   setVisible,
  // }) => (
  //   <View style={{ marginBottom: 12 }}>
  //     <Text style={styles.label}>{label}</Text>

  //     <View style={styles.inputWrapper}>
  //       <TextInput
  //         secureTextEntry={!visible}
  //         value={value}
  //         onChangeText={setValue}
  //         style={styles.input}
  //       />

  //       <TouchableOpacity onPress={() => setVisible(!visible)}>
  //         <Ionicons
  //           name={visible ? "eye-off" : "eye"}
  //           size={22}
  //           color="#666"
  //         />
  //       </TouchableOpacity>
  //     </View>
  //   </View>
  // );

  return (
        <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>

        <Text style={styles.title}>Change Password</Text>

        <View style={{ width: 24 }} />
      </View>

      {/* FORM */}
      <View style={{ marginTop: 20 }}>
        <PasswordInput
          label="Current Password"
          value={currentPassword}
          setValue={setCurrentPassword}
          visible={showCurrent}
          setVisible={setShowCurrent}
        />

        <PasswordInput
          label="New Password"
          value={newPassword}
          setValue={setNewPassword}
          visible={showNew}
          setVisible={setShowNew}
        />

        <PasswordInput
          label="Confirm New Password"
          value={confirmPassword}
          setValue={setConfirmPassword}
          visible={showConfirm}
          setVisible={setShowConfirm}
        />

        <TouchableOpacity
          onPress={updatePassword}
          disabled={loading}
          style={styles.button}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Update Password</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  label: {
    marginBottom: 6,
    fontSize: 14,
    color: "#333",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
  },
  button: {
    backgroundColor: "green",
    padding: 14,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});