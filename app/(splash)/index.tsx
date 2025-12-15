import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import { useAuthStore } from "@/store/auth.store";
import { Colors, Spacing, FontSizes } from "@/constants/theme";

const { width } = Dimensions.get("window");

const ONBOARDING_SCREENS = [
  {
    id: 1,
    emoji: "🍎",
    title: "Fresh Fruits",
    description: "Get fresh, organic fruits delivered to your door daily",
    gradient: ["#FFB366", "#FFA500"],
  },
  {
    id: 2,
    emoji: "🛒",
    title: "Easy Ordering",
    description: "Browse and order your favorite fruits with just a few taps",
    gradient: ["#9B59B6", "#E74C3C"],
  },
  {
    id: 3,
    emoji: "🚚",
    title: "Fast Delivery",
    description: "Quick and reliable delivery with expert guidance and support community",
    gradient: ["#17A2B8", "#20C997"],
  },
];

export default function SplashScreen() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const [currentScreen, setCurrentScreen] = useState(0);

  const handleNext = () => {
    if (currentScreen < ONBOARDING_SCREENS.length - 1) {
      setCurrentScreen(currentScreen + 1);
    } else {
      // Last screen - go to login
      router.replace("/(auth)/login");
    }
  };

  const handleSkip = () => {
    router.replace("/(auth)/login");
  };

  const screen = ONBOARDING_SCREENS[currentScreen];
  const isLastScreen = currentScreen === ONBOARDING_SCREENS.length - 1;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: screen.gradient[0] }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipButton}>SKIP</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.emojiContainer}>
          <Text style={styles.emoji}>{screen.emoji}</Text>
        </View>

        <Text style={styles.title}>{screen.title}</Text>
        <Text style={styles.description}>{screen.description}</Text>
      </View>

      <View style={styles.footer}>
        {/* Dots Indicator */}
        <View style={styles.dotsContainer}>
          {ONBOARDING_SCREENS.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentScreen && styles.activeDot,
              ]}
            />
          ))}
        </View>

        {/* Next Button */}
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>
            {isLastScreen ? "FINISH" : "NEXT"}
          </Text>
          <ChevronRight
            size={24}
            color={Colors.white}
            strokeWidth={2}
            style={styles.buttonIcon}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  skipButton: {
    color: Colors.white,
    fontSize: FontSizes.md,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
  },
  emojiContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  emoji: {
    fontSize: 80,
  },
  title: {
    fontSize: FontSizes.xxxl,
    fontWeight: "700",
    color: Colors.white,
    marginBottom: Spacing.md,
    textAlign: "center",
  },
  description: {
    fontSize: FontSizes.md,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    gap: Spacing.lg,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: Spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  activeDot: {
    backgroundColor: Colors.white,
    width: 24,
  },
  nextButton: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 50,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.white,
    gap: Spacing.sm,
  },
  nextButtonText: {
    color: Colors.white,
    fontSize: FontSizes.lg,
    fontWeight: "700",
  },
  buttonIcon: {
    marginLeft: Spacing.sm,
  },
});
