
import { useThemeStore } from '@/store/theme.store';
import { Colors as LightColors } from '@/constants/theme';

const DarkColors = {
    ...LightColors,
    primary: "#FF6B6B", // Keep primary branding
    secondary: "#4ECDC4",
    bg: "#121212",
    white: "#1E1E1E", // Card background in dark mode
    dark: "#ECF0F1", // Text color in dark mode (swapped)
    gray: "#BDC3C7",
    lightGray: "#34495E",
    darkGray: "#95A5A6",
    border: "#333333",
};

export const useTheme = () => {
    const mode = useThemeStore((state) => state.mode);

    return {
        mode,
        colors: mode === 'dark' ? DarkColors : LightColors,
        isDark: mode === 'dark',
    };
};
