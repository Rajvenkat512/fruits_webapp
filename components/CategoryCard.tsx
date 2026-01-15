import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Colors, Spacing, BorderRadius, FontSizes } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";

interface CategoryCardProps {
  id: string;
  name: string;
  icon?: string;
  onPress: () => void;
  backgroundColor?: string;
  textColor?: string;
  small?: boolean;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  id,
  name,
  icon,
  onPress,
  backgroundColor,
  textColor,
  small = false,
}) => {
  const { colors, isDark } = useTheme();

  const defaultColors = [
    Colors.primary,
    Colors.secondary,
    Colors.success,
    Colors.warning,
  ];
  const randomBgColor = backgroundColor || defaultColors[Math.floor(Math.random() * defaultColors.length)];

  if (small) {
    // Determine textColor properly if not provided
    const labelColor = textColor || colors.dark;

    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        <View style={styles.smallWrap}>
          <View style={[styles.smallContainer, { backgroundColor: randomBgColor }]}>
            <Text style={styles.smallIcon}>{icon || "🍓"}</Text>
          </View>
          <Text style={[styles.smallLabel, { color: labelColor }]}>{name}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: randomBgColor }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.icon}>{icon || "🍎"}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginHorizontal: Spacing.sm,
    marginVertical: Spacing.sm,
    minHeight: 120,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  content: {
    alignItems: "center",
  },
  name: {
    fontSize: FontSizes.lg,
    fontWeight: "700",
    color: Colors.white,
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  icon: {
    fontSize: 40,
  },
  smallWrap: {
    width: 72,
    alignItems: "center",
    marginRight: Spacing.md,
  },
  smallContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  smallIcon: {
    fontSize: 28,
  },
  smallLabel: {
    marginTop: Spacing.xs,
    fontSize: FontSizes.sm,
    textAlign: "center",
  },
});
