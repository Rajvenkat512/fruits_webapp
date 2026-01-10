import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { ChevronLeft, ShoppingCart, Heart, Share2, LogOut } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useCartStore } from "@/store/cart.store";
import { useWatchlistStore } from "@/store/watchlist.store";
import { Colors, Spacing, FontSizes } from "@/constants/theme";

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
    <View style={styles.container}>
      <View style={styles.header}>
        {/* Left Section - Profile or Back */}
        <View style={styles.leftSection}>
          {showBackButton ? (
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              {/* @ts-ignore */}
              <ChevronLeft size={24} color={Colors.dark} />
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
        <Text style={styles.title} numberOfLines={1}>{title}</Text>

        {/* Right Section */}
        <View style={styles.rightSection}>
          {showShare && (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={rightAction} // Assuming share is the right action if showShare is true, or strictly separate?
            // Actually typically share is a specific action. I'll make it use rightAction if provided, or a specific prop.
            // For now, if showShare is true, I'll just render the icon. The 'rightAction' might be for something else.
            // But usually the rightmost button is 'rightAction'.
            // Let's assume rightAction is properly passed for the specific button needed.
            // But wait, the user wants 'share' on product page.
            >
              {/* @ts-ignore */}
              <Share2 size={24} color={Colors.dark} strokeWidth={1.5} />
            </TouchableOpacity>
          )}

          {showWishlist && (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => router.push("/(tabs)/watchlist")}
            >
              {/* @ts-ignore */}
              <Heart size={24} color={Colors.dark} strokeWidth={1.5} />
              {watchlistCount > 0 && (
                <View style={styles.badge}>
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
              <ShoppingCart size={24} color={Colors.dark} strokeWidth={1.5} />
              {cartCount > 0 && (
                <View style={styles.badge}>
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
              {rightIcon ? rightIcon : <LogOut size={24} color={Colors.dark} strokeWidth={1.5} />}
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
    // Removed top padding as requested
    paddingBottom: Spacing.sm,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.md,
    height: 40, // Slightly reduced height
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
  },
  profileButton: {
    padding: 0,
    borderRadius: 20,
    overflow: "hidden",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  title: {
    flex: 2,
    fontSize: FontSizes.lg,
    fontWeight: "700",
    color: Colors.dark,
    textAlign: "center",
  },
  iconButton: {
    position: "relative",
    padding: Spacing.xs,
  },
  badge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: Colors.danger,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: Colors.white,
    fontSize: FontSizes.xs,
    fontWeight: "700",
  },
  actionButton: {
    padding: Spacing.xs,
  },
});
