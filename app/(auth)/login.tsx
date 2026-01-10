import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Image,
  StatusBar,
} from "react-native";
import { Check } from "lucide-react-native";

import { useRouter } from "expo-router";
import { useAuthStore } from "@/store/auth.store";
import { Colors, Spacing, FontSizes, BorderRadius } from "@/constants/theme";

export default function LoginScreen() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    if (!agree) {
      Alert.alert("Error", "Please agree to the Terms & Conditions");
      return;
    }

    try {
      await login(email, password);
      router.replace("/(tabs)");
    } catch {
      Alert.alert("Login Failed", error || "Something went wrong");
    }
  };

  const handleRegister = () => {
    router.push("/(auth)/register");
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#0057FF" barStyle="light-content" />
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Header Content */}
            <View style={styles.headerContent}>
              <View style={styles.logoCircle}>
                <Image
                  source={require("../../assets/images/icon.png")}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>
                Sign in to continue shopping fresh
              </Text>
            </View>

            {/* Card */}
            <View style={styles.card}>
              {/* Email */}
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputBox}>
                <TextInput
                  placeholder="Email address"
                  placeholderTextColor="#999"
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!isLoading}
                />
              </View>

              {/* Password */}
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputBox}>
                <TextInput
                  placeholder="Password"
                  placeholderTextColor="#999"
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  editable={!isLoading}
                />
              </View>

              {/* Forgot */}
              <TouchableOpacity
                style={styles.forgot}
                onPress={() => Alert.alert("Forgot Password")}
              >
                <Text style={styles.forgotText}>Forgot password?</Text>
              </TouchableOpacity>

              {/* Terms */}
              <TouchableOpacity
                style={styles.termsRow}
                onPress={() => setAgree(!agree)}
              >
                <View style={[styles.checkbox, agree && styles.checkboxActive]}>
                  {agree && <Check size={14} color="#000" strokeWidth={3} />}
                </View>
                <Text style={styles.termsText}>
                  I agree to the <Text style={styles.link}>Terms & Conditions</Text>
                </Text>
              </TouchableOpacity>

              {/* Error */}
              {error && <Text style={styles.error}>{error}</Text>}

              {/* Button */}
              <TouchableOpacity
                style={[
                  styles.button,
                  (!agree || isLoading) && styles.buttonDisabled,
                ]}
                disabled={!agree || isLoading}
                onPress={handleLogin}
              >
                <Text style={styles.buttonText}>
                  {isLoading ? "Signing in..." : "Sign In"}
                </Text>
              </TouchableOpacity>

              {/* Signup */}
              <View style={styles.signupRow}>
                <Text style={styles.signupText}>Don't have an account? </Text>
                <TouchableOpacity onPress={handleRegister}>
                  <Text style={styles.link}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  safe: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
  },
  headerContent: {
    alignItems: "center",
    paddingTop: 140, // Approximate Spacing.xl * 4
    paddingBottom: 40,
    backgroundColor: "#0057FF",
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    paddingHorizontal: 20,
  },
  logoCircle: {
    width: 70,
    height: 70,
    borderRadius: 40,
    backgroundColor: "#ffffff33",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 110,
    height: 110,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: "#E3ECFF",
  },
  label: {
    fontSize: FontSizes.sm,
    fontWeight: "600",
    color: Colors.dark,
    marginBottom: 4,
  },
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 24,
    marginTop: -30,
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  inputBox: {
    backgroundColor: "#F6F7FB",
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 52,
    justifyContent: "center",
    marginBottom: 14,
    borderColor: Colors.border,
    borderWidth: 1,
  },
  input: {
    fontSize: 15,
    color: "#111",
  },
  forgot: {
    alignItems: "flex-end",
    marginBottom: 16,
  },
  forgotText: {
    fontSize: 13,
    color: "#555",
  },
  termsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ccc",
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxActive: {
    backgroundColor: "#a1e43eff",
    borderColor: "#9BFF00",
  },
  termsText: {
    fontSize: 13,
    color: "#777",
  },
  link: {
    color: "#0057FF",
    fontWeight: "600",
  },
  error: {
    color: "#D32F2F",
    fontSize: 12,
    marginBottom: 10,
    textAlign: "center",
  },
  button: {
    height: 52,
    borderRadius: 14,
    backgroundColor: "#9BFF00",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#000",
  },
  signupRow: {
    flexDirection: "row",
    justifyContent: "center",
  },
  signupText: {
    fontSize: 13,
    color: "#777",
  },
});
