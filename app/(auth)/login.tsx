
// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   SafeAreaView,
//   TextInput,
//   ScrollView,
//   Alert,
//   KeyboardAvoidingView,
//   Platform,
// } from "react-native";
// import { useRouter } from "expo-router";
// import { Button } from "@/components/Button";
// import { useAuthStore } from "@/store/auth.store";
// import { Colors, Spacing, FontSizes, BorderRadius } from "@/constants/theme";

// export default function LoginScreen() {
//   const router = useRouter();
//   const login = useAuthStore((state) => state.login);
//   const isLoading = useAuthStore((state) => state.isLoading);
//   const error = useAuthStore((state) => state.error);

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleLogin = async () => {
//     if (!email || !password) {
//       Alert.alert("Error", "Please fill in all fields");
//       return;
//     }

//     try {
//       await login(email, password);
//       router.replace("/(tabs)");
//     } catch (err: any) {
//       Alert.alert("Login Failed", error || "An error occurred");
//     }
//   };

//   const handleRegister = () => {
//     router.push("/(auth)/register");
//   };

//   return (
//     <View style={styles.container}>
//       <SafeAreaView style={styles.safeArea}>
//         <KeyboardAvoidingView
//           behavior={Platform.OS === "ios" ? "padding" : "height"}
//           keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
//           style={styles.keyboardView}
//         >
//           <ScrollView
//             contentContainerStyle={styles.scrollContent}
//             showsVerticalScrollIndicator={false}
//             keyboardShouldPersistTaps="handled"
//           >
//             <View style={styles.header}>
//               <Text style={styles.logo}>🍎</Text>
//               <Text style={styles.title}>Welcome Back</Text>
//               <Text style={styles.subtitle}>
//                 Sign in to continue shopping
//               </Text>
//             </View>

//             <View style={styles.form}>
//               <View style={styles.inputGroup}>
//                 <Text style={styles.label}>Email Address</Text>
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Enter your email"
//                   placeholderTextColor={Colors.lightGray}
//                   value={email}
//                   onChangeText={setEmail}
//                   editable={!isLoading}
//                   keyboardType="email-address"
//                   autoCapitalize="none"
//                 />
//               </View>

//               <View style={styles.inputGroup}>
//                 <Text style={styles.label}>Password</Text>
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Enter your password"
//                   placeholderTextColor={Colors.lightGray}
//                   value={password}
//                   onChangeText={setPassword}
//                   editable={!isLoading}
//                   secureTextEntry
//                 />
//               </View>

//               {error && (
//                 <View style={styles.errorContainer}>
//                   <Text style={styles.errorText}>{error}</Text>
//                 </View>
//               )}

//               <Button
//                 title={isLoading ? "Signing in..." : "Sign In"}
//                 onPress={handleLogin}
//                 disabled={isLoading}
//                 fullWidth
//                 size="large"
//               />

//               <View style={styles.divider}>
//                 <View style={styles.dividerLine} />
//                 <Text style={styles.dividerText}>Don't have an account?</Text>
//                 <View style={styles.dividerLine} />
//               </View>

//               <Button
//                 title="Create Account"
//                 onPress={handleRegister}
//                 variant="outline"
//                 fullWidth
//                 size="large"
//               />
//             </View>

//             <View style={styles.footer}>
//               <Text style={styles.footerText}>
//                 Demo: user@example.com / password123
//               </Text>
//             </View>
//           </ScrollView>
//         </KeyboardAvoidingView>
//       </SafeAreaView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: Colors.white,
//   },
//   safeArea: {
//     flex: 1,
//   },
//   keyboardView: {
//     flex: 1,
//   },
//   scrollContent: {
//     flexGrow: 1,
//     paddingHorizontal: Spacing.lg,
//     paddingBottom: Platform.OS === "ios" ? Spacing.xxl : Spacing.xl,
//   },
//   header: {
//     alignItems: "center",
//     marginTop: Spacing.xl,
//     marginBottom: Spacing.xxl,
//   },
//   logo: {
//     fontSize: 60,
//     marginBottom: Spacing.md,
//   },
//   title: {
//     fontSize: FontSizes.xxl,
//     fontWeight: "700",
//     color: Colors.dark,
//     marginBottom: Spacing.sm,
//   },
//   subtitle: {
//     fontSize: FontSizes.md,
//     color: Colors.gray,
//     textAlign: "center",
//   },
//   form: {
//     marginVertical: Spacing.lg,
//   },
//   inputGroup: {
//     marginBottom: Spacing.lg,
//   },
//   label: {
//     fontSize: FontSizes.md,
//     fontWeight: "600",
//     color: Colors.dark,
//     marginBottom: Spacing.sm,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: Colors.border,
//     borderRadius: BorderRadius.md,
//     paddingHorizontal: Spacing.md,
//     paddingVertical: Spacing.md,
//     fontSize: FontSizes.md,
//     color: Colors.dark,
//     backgroundColor: Colors.bg,
//   },
//   errorContainer: {
//     backgroundColor: "#FFE5E5",
//     borderRadius: BorderRadius.md,
//     paddingHorizontal: Spacing.md,
//     paddingVertical: Spacing.sm,
//     marginBottom: Spacing.lg,
//   },
//   errorText: {
//     color: Colors.danger,
//     fontSize: FontSizes.sm,
//     fontWeight: "500",
//   },
//   divider: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginVertical: Spacing.xl,
//   },
//   dividerLine: {
//     flex: 1,
//     height: 1,
//     backgroundColor: Colors.border,
//   },
//   dividerText: {
//     marginHorizontal: Spacing.md,
//     color: Colors.gray,
//     fontSize: FontSizes.sm,
//   },
//   footer: {
//     alignItems: "center",
//     marginBottom: Spacing.lg,
//   },
//   footerText: {
//     color: Colors.lightGray,
//     fontSize: FontSizes.xs,
//     textAlign: "center",
//   },
// });



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
} from "react-native";
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
    } catch (err: any) {
      Alert.alert("Login Failed", error || "An error occurred");
    }
  };

  const handleRegister = () => {
    router.push("/(auth)/register");
  };

  const handleForgotPassword = () => {
    // route to forgot password if you have it
    Alert.alert("Forgot Password", "Implement forgot password flow here.");
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Blue header background */}
            <View style={styles.header}>
              {/* Shield / logo placeholder */}
              {/* If you want to use a real header image, add an image at
                  /assets/images/fruit-header.png and uncomment the Image
                  tag below (path is relative to this file). Otherwise emoji
                  fallback will be used. */}
              {/*
              <Image
                source={require('../../assets/images/fruit-header.png')}
                style={styles.headerImage}
                resizeMode="cover"
              />
              */}
              <View style={styles.logoCircle}>
                <Text style={styles.logoText}>🍓</Text>
              </View>
              <Text style={styles.headerTitle}>Sign In to Your Account</Text>
              <Text style={styles.headerSubtitle}>
                Enter your Email & password to sign in
              </Text>
            </View>

            {/* White card */}
            <View style={styles.card}>
              {/* Phone input */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputIcon}>📧</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="you@example.com"
                    placeholderTextColor={Colors.lightGray}
                    value={email}
                    onChangeText={setEmail}
                    editable={!isLoading}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </View>

              {/* Password input */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Password</Text>
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputIcon}>🔒</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor={Colors.lightGray}
                    value={password}
                    onChangeText={setPassword}
                    editable={!isLoading}
                    secureTextEntry
                  />
                  {/* Right eye icon placeholder */}
                  <Text style={styles.inputRightIcon}>👁️</Text>
                </View>
              </View>

              {/* Forgot password row */}
              <View style={styles.forgotRow}>
                <TouchableOpacity onPress={handleForgotPassword}>
                  <Text style={styles.forgotText}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>

              {/* Terms & Conditions checkbox */}
              <TouchableOpacity
                style={styles.termsRow}
                onPress={() => setAgree((prev) => !prev)}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.checkbox,
                    agree && styles.checkboxChecked,
                  ]}
                >
                  {agree && <Text style={styles.checkboxTick}>✓</Text>}
                </View>
                <Text style={styles.termsText}>
                  I agree to all{" "}
                  <Text style={styles.termsLink}>Terms & Conditions</Text>
                </Text>
              </TouchableOpacity>

              {/* Error message */}
              {error && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              {/* Sign In button */}
              <TouchableOpacity
                style={[
                  styles.signInButton,
                  (!agree || isLoading) && styles.signInButtonDisabled,
                ]}
                disabled={!agree || isLoading}
                onPress={handleLogin}
                activeOpacity={0.8}
              >
                <Text style={styles.signInButtonText}>
                  {isLoading ? "Signing in..." : "Sign In"}
                </Text>
              </TouchableOpacity>

              {/* Bottom Sign Up link */}
              <View style={styles.signupRow}>
                <Text style={styles.signupText}>Don’t have an account? </Text>
                <TouchableOpacity onPress={handleRegister}>
                  <Text style={styles.signupLink}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const BLUE = "#0057FF";
const CARD_BG = "#FFFFFF";
const GREEN = "#9BFF00";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BLUE,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: Platform.OS === "ios" ? Spacing.xxl : Spacing.xl,
    justifyContent:"center"
  },

  // Header (blue area)
  header: {
    paddingTop: Spacing.xxl,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
    alignItems: "center",
    backgroundColor: BLUE,
  },
  logoCircle: {
    width: 70,
    height: 70,
    borderRadius: 32,
    backgroundColor: "#ffffff33",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  logoText: {
    fontSize: 32,
  },
  headerTitle: {
    fontSize: 22,
    color: CARD_BG,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#E3ECFF",
    textAlign: "center",
  },

  // Card
  card: {
    backgroundColor: CARD_BG,
    marginHorizontal: Spacing.lg,
    borderRadius: 24,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
    marginTop: -Spacing.xl * 1.5, // pulls card up into blue
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },

  inputGroup: {
    marginBottom: Spacing.lg,
  },
  inputLabel: {
    fontSize: 12,
    color: "#777",
    marginBottom: Spacing.xs,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#EEF1F6",
    backgroundColor: "#F7F8FB",
    paddingHorizontal: Spacing.md,
    height: 52,
  },
  inputIcon: {
    fontSize: 18,
    marginRight: Spacing.sm,
  },
  inputRightIcon: {
    fontSize: 16,
    marginLeft: Spacing.sm,
    color: "#999",
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: Colors.dark,
  },

  forgotRow: {
    alignItems: "flex-end",
    marginBottom: Spacing.md,
  },
  forgotText: {
    fontSize: 12,
    color: "#333",
  },

  termsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#C4C4C4",
    marginRight: Spacing.sm,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  checkboxChecked: {
    backgroundColor: GREEN,
    borderColor: GREEN,
  },
  checkboxTick: {
    fontSize: 12,
    color: "#000",
  },
  termsText: {
    fontSize: 12,
    color: "#777",
  },
  termsLink: {
    color: BLUE,
    fontWeight: "600",
  },

  errorContainer: {
    backgroundColor: "#FFE5E5",
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.md,
  },
  errorText: {
    color: Colors.danger,
    fontSize: 12,
    fontWeight: "500",
  },

  signInButton: {
    backgroundColor: GREEN,
    borderRadius: 14,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.lg,
  },
  signInButtonDisabled: {
    opacity: 0.6,
  },
  signInButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
  },

  signupRow: {
    flexDirection: "row",
    justifyContent: "center",
  },
  signupText: {
    fontSize: 12,
    color: "#777",
  },
  signupLink: {
    fontSize: 12,
    color: BLUE,
    fontWeight: "600",
  },
});
