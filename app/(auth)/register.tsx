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
//   TouchableOpacity,
// } from "react-native";
// import { useRouter } from "expo-router";
// import { ChevronLeft } from "lucide-react-native";
// import { Button } from "@/components/Button";
// import { useAuthStore } from "@/store/auth.store";
// import { Colors, Spacing, FontSizes, BorderRadius } from "@/constants/theme";

// export default function RegisterScreen() {
//   const router = useRouter();
//   const register = useAuthStore((state) => state.register);
//   const isLoading = useAuthStore((state) => state.isLoading);
//   const error = useAuthStore((state) => state.error);

//   const [name, setName] = useState("John Doe");
//   const [email, setEmail] = useState("user@example.com");
//   const [password, setPassword] = useState("password123");
//   const [confirmPassword, setConfirmPassword] = useState("password123");
//   const [role, setRole] = useState("USER");

//   const handleRegister = async () => {
//     if (!name || !email || !password || !confirmPassword) {
//       Alert.alert("Error", "Please fill in all fields");
//       return;
//     }

//     if (password !== confirmPassword) {
//       Alert.alert("Error", "Passwords do not match");
//       return;
//     }

//     if (password.length < 6) {
//       Alert.alert("Error", "Password must be at least 6 characters");
//       return;
//     }

//     try {
//       await register(email, password, name, role);
//       router.replace("/(tabs)");
//     } catch (err: any) {
//       Alert.alert("Registration Failed", error || "An error occurred");
//     }
//   };

//   const handleBack = () => {
//     router.back();
//   };

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//       style={styles.container}
//     >
//       <SafeAreaView style={styles.safeArea}>
//         <ScrollView
//           contentContainerStyle={styles.scrollContent}
//           showsVerticalScrollIndicator={false}
//         >
//           <TouchableOpacity
//             onPress={handleBack}
//             style={styles.backButton}
//           >
//             {/* @ts-ignore */}
//             <ChevronLeft size={28} color={Colors.dark} strokeWidth={1.5} />
//           </TouchableOpacity>

//           <View style={styles.header}>
//             <Text style={styles.logo}>🍎</Text>
//             <Text style={styles.title}>Create Account</Text>
//             <Text style={styles.subtitle}>
//               Join us for fresh fruits
//             </Text>
//           </View>

//           <View style={styles.form}>
//             <View style={styles.inputGroup}>
//               <Text style={styles.label}>Full Name</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="Enter your full name"
//                 placeholderTextColor={Colors.lightGray}
//                 value={name}
//                 onChangeText={setName}
//                 editable={!isLoading}
//               />
//             </View>

//             <View style={styles.inputGroup}>
//               <Text style={styles.label}>Email Address</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="Enter your email"
//                 placeholderTextColor={Colors.lightGray}
//                 value={email}
//                 onChangeText={setEmail}
//                 editable={!isLoading}
//                 keyboardType="email-address"
//                 autoCapitalize="none"
//               />
//             </View>

//             <View style={styles.inputGroup}>
//               <Text style={styles.label}>Password</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="Enter your password"
//                 placeholderTextColor={Colors.lightGray}
//                 value={password}
//                 onChangeText={setPassword}
//                 editable={!isLoading}
//                 secureTextEntry
//               />
//             </View>

//             <View style={styles.inputGroup}>
//               <Text style={styles.label}>Confirm Password</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="Confirm your password"
//                 placeholderTextColor={Colors.lightGray}
//                 value={confirmPassword}
//                 onChangeText={setConfirmPassword}
//                 editable={!isLoading}
//                 secureTextEntry
//               />
//             </View>

//             {error && (
//               <View style={styles.errorContainer}>
//                 <Text style={styles.errorText}>{error}</Text>
//               </View>
//             )}

//             <Button
//               title={isLoading ? "Creating Account..." : "Create Account"}
//               onPress={handleRegister}
//               disabled={isLoading}
//               fullWidth
//               size="large"
//             />
//           </View>
//         </ScrollView>
//       </SafeAreaView>
//     </KeyboardAvoidingView>
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
//   scrollContent: {
//     flexGrow: 1,
//     paddingHorizontal: Spacing.lg,
//   },
//   backButton: {
//     paddingVertical: Spacing.md,
//   },
//   header: {
//     alignItems: "center",
//     marginTop: Spacing.lg,
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
} from "react-native";
import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { useAuthStore } from "@/store/auth.store";
import { Colors, Spacing, FontSizes, BorderRadius } from "@/constants/theme";

const BLUE = "#0057FF";
const CARD_BG = "#FFFFFF";

export default function RegisterScreen() {
  const router = useRouter();
  const register = useAuthStore((state) => state.register);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);

  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("user@example.com");
  const [password, setPassword] = useState("password123");
  const [confirmPassword, setConfirmPassword] = useState("password123");
  const [role] = useState("USER");

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    try {
      await register(email, password, name, role);
      router.replace("/(tabs)");
    } catch (err: any) {
      Alert.alert("Registration Failed", error || "An error occurred");
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Back button on top of blue header */}
            <View style={styles.topBar}>
              <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                {/* @ts-ignore */}
                <ChevronLeft size={28} color={CARD_BG} strokeWidth={1.5} />
              </TouchableOpacity>
            </View>

            {/* Blue header */}
            <View style={styles.header}>
              <View style={styles.logoCircle}>
                <Text style={styles.logoText}>🍎</Text>
              </View>
              <Text style={styles.headerTitle}>Create Account</Text>
              <Text style={styles.headerSubtitle}>
                Join us for fresh fruits
              </Text>
            </View>

            {/* White card centered */}
            <View style={styles.content}>
              <View style={styles.card}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Full Name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your full name"
                    placeholderTextColor={Colors.lightGray}
                    value={name}
                    onChangeText={setName}
                    editable={!isLoading}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Email Address</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    placeholderTextColor={Colors.lightGray}
                    value={email}
                    onChangeText={setEmail}
                    editable={!isLoading}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Password</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your password"
                    placeholderTextColor={Colors.lightGray}
                    value={password}
                    onChangeText={setPassword}
                    editable={!isLoading}
                    secureTextEntry
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Confirm Password</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Confirm your password"
                    placeholderTextColor={Colors.lightGray}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    editable={!isLoading}
                    secureTextEntry
                  />
                </View>

                {error && (
                  <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
                )}

                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={handleRegister}
                  disabled={isLoading}
                  activeOpacity={0.8}
                >
                  <Text style={styles.primaryButtonText}>
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Text>
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
    paddingBottom: Spacing.xl,
  },

  topBar: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
  },
  backButton: {
    paddingVertical: Spacing.xs,
    paddingRight: Spacing.sm,
  },

  header: {
    paddingTop: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    alignItems: "center",
    backgroundColor: BLUE,
  },
  logoCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#ffffff33",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  logoText: {
    fontSize: 32,
  },
  headerTitle: {
    fontSize: FontSizes.xxl,
    color: CARD_BG,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: Spacing.xs,
  },
  headerSubtitle: {
    fontSize: FontSizes.sm,
    color: "#E3ECFF",
    textAlign: "center",
  },

  // wrapper that centers the card
  content: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: Spacing.lg,
    marginTop: -Spacing.lg * 1.5, // pull card into blue area
  },

  card: {
    backgroundColor: CARD_BG,
    borderRadius: 24,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },

  inputGroup: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: FontSizes.sm,
    fontWeight: "600",
    color: Colors.dark,
    marginBottom: Spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: FontSizes.md,
    color: Colors.dark,
    backgroundColor: Colors.bg,
  },

  errorContainer: {
    backgroundColor: "#FFE5E5",
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  errorText: {
    color: Colors.danger,
    fontSize: FontSizes.sm,
    fontWeight: "500",
  },

  primaryButton: {
    backgroundColor: "#9BFF00",
    borderRadius: 14,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
  },
});
