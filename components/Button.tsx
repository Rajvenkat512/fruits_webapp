import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from "react-native";
import { Colors, Spacing, BorderRadius, FontSizes } from "@/constants/theme";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "success" | "danger" | "outline";
  size?: "small" | "medium" | "large";
  isLoading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  isLoading = false,
  disabled = false,
  icon,
  fullWidth = false,
  style,
  textStyle,
}) => {
  const variantStyles = {
    primary: {
      backgroundColor: Colors.primary,
      borderColor: Colors.primary,
    },
    secondary: {
      backgroundColor: Colors.secondary,
      borderColor: Colors.secondary,
    },
    success: {
      backgroundColor: Colors.success,
      borderColor: Colors.success,
    },
    danger: {
      backgroundColor: Colors.danger,
      borderColor: Colors.danger,
    },
    outline: {
      backgroundColor: "transparent",
      borderColor: Colors.primary,
      borderWidth: 2,
    },
  };

  const sizeStyles = {
    small: {
      paddingVertical: Spacing.sm,
      paddingHorizontal: Spacing.md,
    },
    medium: {
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.lg,
    },
    large: {
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.xl,
    },
  };

  const fontSizes = {
    small: FontSizes.sm,
    medium: FontSizes.md,
    large: FontSizes.lg,
  };

  const isOutline = variant === "outline";
  const textColor = isOutline ? Colors.primary : Colors.white;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        sizeStyles[size],
        variantStyles[variant],
        { opacity: disabled || isLoading ? 0.6 : 1 },
        fullWidth && styles.fullWidth,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.8}
    >
      {isLoading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <>
          {icon && icon}
          <Text
            style={[
              styles.text,
              { color: textColor, fontSize: fontSizes[size] },
              textStyle,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    borderRadius: BorderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.sm,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  fullWidth: {
    width: "100%",
  },
  text: {
    fontWeight: "600",
    textAlign: "center",
  },
});
