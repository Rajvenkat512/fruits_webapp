import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Alert,
  StatusBar,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { Heart } from "lucide-react-native";
import { Header } from "@/components/Header";
import { useWatchlistStore } from "@/store/watchlist.store";
import { Colors, Spacing, FontSizes, BorderRadius } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";

export default function WatchlistScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const items = useWatchlistStore((state) => state.items);
  const fetchWatchlist = useWatchlistStore((state) => state.fetchWatchlist);
  const removeFromWatchlist = useWatchlistStore(
    (state) => state.removeFromWatchlist
  );

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const handleRemoveItem = async (itemId: string) => {
    Alert.alert("Remove Item", "Remove from wishlist?", [
      { text: "Cancel" },
      {
        text: "Remove",
        onPress: async () => {
          try {
            await removeFromWatchlist(itemId);
          } catch (error) {
            Alert.alert("Error", "Failed to remove item");
          }
        },
      },
    ]);
  };

  const handleProductPress = (productId: string) => {
    router.push(`/products/${productId}`);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <View style={[styles.headerContainer, { backgroundColor: colors.bg }]}>
        <Header title="My Wishlist" showBackButton={false} showCart />
      </View>

      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          {/* @ts-ignore */}
          <Heart size={80} color={colors.primary} strokeWidth={1.5} />
          <Text style={[styles.emptyTitle, { color: colors.dark }]}>No items in wishlist</Text>
          <Text style={[styles.emptySubtitle, { color: colors.gray }]}>
            Add fruits to your wishlist to save them!
          </Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.wishlistItem, { backgroundColor: colors.white }]}
              onPress={() => handleProductPress(item.productId)}
              activeOpacity={0.7}
            >
              <View style={styles.itemContent}>
                <Text style={[styles.itemName, { color: colors.dark }]}>
                  {item.product?.name || "Product"}
                </Text>
                <Text style={[styles.itemPrice, { color: colors.primary }]}>
                  ${item.product?.price?.toFixed(2) || "0.00"}
                </Text>
                <Text style={[styles.savedDate, { color: colors.gray }]}>
                  Saved {new Date(item.createdAt || "").toLocaleDateString()}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => handleRemoveItem(item._id)}
                style={styles.removeButton}
              >
                {/* @ts-ignore */}
                <Heart size={24} color={Colors.danger} fill={Colors.danger} strokeWidth={1.5} />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    // paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  headerContainer: {
    // Optional formatting
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
  },
  emptyTitle: {
    fontSize: FontSizes.xl,
    fontWeight: "700",
    color: Colors.dark,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    fontSize: FontSizes.md,
    color: Colors.gray,
    textAlign: "center",
  },
  listContent: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  wishlistItem: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  itemContent: {
    flex: 1,
  },
  itemName: {
    fontSize: FontSizes.md,
    fontWeight: "600",
    color: Colors.dark,
    marginBottom: Spacing.xs,
  },
  itemPrice: {
    fontSize: FontSizes.lg,
    fontWeight: "700",
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  savedDate: {
    fontSize: FontSizes.xs,
    color: Colors.gray,
  },
  removeButton: {
    padding: Spacing.sm,
  },
});
