import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { ChevronLeft, ShoppingCart, Heart } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useCartStore } from "@/store/cart.store";
import { useWatchlistStore } from "@/store/watchlist.store";
import { Colors, Spacing, FontSizes } from "@/constants/theme";

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  showCart?: boolean;
  showWishlist?: boolean;
  rightAction?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title = "Fruits App",
  showBackButton = false,
  showCart = false,
  showWishlist = false,
  rightAction,
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
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {/* Left Section */}
        <View style={styles.leftSection}>
          {showBackButton ? (
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              {/* @ts-ignore */}
              <ChevronLeft size={24} color={Colors.dark} />
            </TouchableOpacity>
          ) : (
            <View style={styles.spacer} />
          )}
        </View>

        {/* Center Section */}
        <Text style={styles.title}>{title}</Text>

        {/* Right Section */}
        <View style={styles.rightSection}>
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

          {rightAction && (
            <TouchableOpacity
              onPress={rightAction}
              style={styles.actionButton}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
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
    gap: Spacing.md,
  },
  backButton: {
    padding: Spacing.xs,
  },
  spacer: {
    width: 36,
  },
  title: {
    flex: 2,
    fontSize: FontSizes.xl,
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
