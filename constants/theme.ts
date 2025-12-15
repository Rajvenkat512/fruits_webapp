export const Colors = {
  primary: "#FF6B6B",
  secondary: "#4ECDC4",
  success: "#2ECC71",
  warning: "#F39C12",
  danger: "#E74C3C",
  dark: "#2C3E50",
  light: "#ECF0F1",
  bg: "#F8F9FA",
  white: "#FFFFFF",
  gray: "#95A5A6",
  lightGray: "#BDC3C7",
  darkGray: "#34495E",
  border: "#E0E0E0",
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const FontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const FontWeights = {
  normal: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
} as const;

export const Theme = {
  colors: Colors,
  spacing: Spacing,
  borderRadius: BorderRadius,
  fontSizes: FontSizes,
  fontWeights: FontWeights,
};

export default Theme;
