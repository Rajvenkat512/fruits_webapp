import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
  StatusBar,
} from "react-native";
import { ChevronLeft, ShoppingCart, Heart, Share2, LogOut } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useCartStore } from "@/store/cart.store";
import { useWatchlistStore } from "@/store/watchlist.store";
import { Colors, Spacing, FontSizes } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  showCart?: boolean;
  showWishlist?: boolean;
  showShare?: boolean;
  rightAction?: () => void;
  rightIcon?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  title = "Fruits App",
  showBackButton = false,
  showCart = false,
  showWishlist = false,
  showShare = false,
  rightAction,
  rightIcon,
}) => {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const cartItems = useCartStore((state) => state.items);
  const watchlistItems = useWatchlistStore((state) => state.items);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const watchlistCount = watchlistItems.length;

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#1E1E1E' : colors.primary, borderBottomWidth: 0 }]}>
      <View style={styles.header}>
        {/* Left Section - Profile or Back */}
        <View style={styles.leftSection}>
          {showBackButton ? (
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              {/* @ts-ignore */}
              <ChevronLeft size={24} color={Colors.white} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => router.push("/(tabs)/profile")} style={styles.profileButton}>
              {/* Placeholder Avatar */}
              <Image
                source={{ uri: "https://i.pravatar.cc/150?img=12" }}
                style={styles.avatar}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Center Section */}
        <Text style={[styles.title, { color: Colors.white }]} numberOfLines={1}>{title}</Text>

        {/* Right Section */}
        <View style={styles.rightSection}>
          {showShare && (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={rightAction}
            >
              {/* @ts-ignore */}
              <Share2 size={20} color={Colors.white} strokeWidth={2} />
            </TouchableOpacity>
          )}

          {showWishlist && (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => router.push("/(tabs)/watchlist")}
            >
              {/* @ts-ignore */}
              <Heart size={20} color={Colors.white} strokeWidth={2} />
              {watchlistCount > 0 && (
                <View style={[styles.badge, { backgroundColor: colors.danger }]}>
                  <Text style={styles.badgeText}>
                    {watchlistCount > 99 ? "99+" : watchlistCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          )}

          {showCart && (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => router.push("/(tabs)/cart")}
            >
              {/* @ts-ignore */}
              <ShoppingCart size={20} color={Colors.white} strokeWidth={2} />
              {cartCount > 0 && (
                <View style={[styles.badge, { backgroundColor: colors.danger }]}>
                  <Text style={styles.badgeText}>
                    {cartCount > 99 ? "99+" : cartCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          )}

          {rightAction && !showShare && (
            // If showShare is false but rightAction exists (like Logout on Home), render it.
            <TouchableOpacity
              onPress={rightAction}
              style={styles.actionButton}
            >
              {rightIcon ? rightIcon : <LogOut size={20} color={Colors.white} strokeWidth={2} />}
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // backgroundColor handled dynamically
    // borderBottomWidth: 0.5,
    // borderBottomColor handled dynamically
    paddingBottom: Spacing.sm,
    paddingTop: Platform.OS === "android" ? (StatusBar.currentHeight || 24) + 10 : 50, // Add status bar height + padding
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.md,
    height: 40,
  },
  leftSection: {
    flex: 1,
    alignItems: "flex-start",
  },
  rightSection: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: Spacing.xs,
  },
  backButton: {
    padding: Spacing.xs,
    backgroundColor: 'rgba(255,255,255,0.2)', // Light translucent background for icons on colored header
    borderRadius: 20,
  },
  profileButton: {
    padding: 0,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: Colors.white,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  title: {
    flex: 2,
    fontSize: FontSizes.xl, // Larger title like "Inbox"
    fontWeight: "800",
    // color handled dynamically
    textAlign: "center",
    // textTransform: "uppercase", // "Inbox" isn't uppercase usually, but checking previous preference. User said "same" as image. "Inbox" image is Title Case.
    // However, previous request was specifically for uppercase. I'll stick to the "Inbox" image style: Title Case, Bold.
  },
  iconButton: {
    position: "relative",
    padding: Spacing.xs,
    backgroundColor: 'rgba(255,255,255,0.2)', // Light translucent background for icons on colored header
    borderRadius: 20,
    marginLeft: 4,
  },
  badge: {
    position: "absolute",
    top: -5,
    right: -5,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.white,
  },
  badgeText: {
    color: Colors.white,
    fontSize: FontSizes.xs,
    fontWeight: "700",
  },
  actionButton: {
    padding: Spacing.xs,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
  },
});
