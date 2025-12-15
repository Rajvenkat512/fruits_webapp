import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Heart } from "lucide-react-native";
import { Colors, Spacing, BorderRadius, FontSizes } from "@/constants/theme";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  stock: number;
  onPress: () => void;
  onAddToCart: () => void;
  onToggleWatchlist?: () => void;
  isInWatchlist?: boolean;
  compact?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  image,
  stock,
  onPress,
  onAddToCart,
  onToggleWatchlist,
  isInWatchlist = false,
  compact = false,
}) => {
  const inStock = stock > 0;

  return (
    <TouchableOpacity
      style={[styles.container, compact && styles.containerCompact]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Image Container */}
      <View style={[styles.imageContainer, compact && styles.imageContainerCompact]}>
        <Image
          source={{ uri: image }}
          style={styles.image}
          onError={() => console.log("Image failed to load")}
        />
        {!inStock && (
          <View style={styles.outOfStockBadge}>
            <Text style={styles.outOfStockText}>Out of Stock</Text>
          </View>
        )}
        {inStock && stock < 10 && (
          <View style={styles.lowStockBadge}>
            <Text style={styles.lowStockText}>Low Stock</Text>
          </View>
        )}

        {/* Wishlist Button */}
        {onToggleWatchlist && (
          <TouchableOpacity
            style={[
              styles.wishlistButton,
              isInWatchlist && styles.wishlistButtonActive,
            ]}
            onPress={onToggleWatchlist}
          >
            <Heart
              // @ts-ignore
              size={20}
              color={isInWatchlist ? Colors.danger : Colors.white}
              fill={isInWatchlist ? Colors.danger : "none"}
              strokeWidth={1.5}
            />
          </TouchableOpacity>
        )}
      </View>

      <View style={[styles.content, compact && styles.contentCompact]}>
        <Text style={[styles.name, compact && styles.nameCompact]} numberOfLines={2}>
          {name}
        </Text>
        <Text style={[styles.price, compact && styles.priceCompact]}>${price.toFixed(2)}</Text>
      </View>

      {!compact && (
        <TouchableOpacity
          style={[styles.addButton, !inStock && styles.disabledButton]}
          onPress={onAddToCart}
          disabled={!inStock}
          activeOpacity={0.8}
        >
          <Text style={styles.addButtonText}>Add to Cart</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    marginHorizontal: Spacing.sm,
    marginVertical: Spacing.sm,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  containerCompact: {
    width: 180,
    marginRight: Spacing.md,
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 160,
    backgroundColor: Colors.bg,
  },
  imageContainerCompact: {
    height: 120,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  outOfStockBadge: {
    position: "absolute",
    top: Spacing.sm,
    right: Spacing.sm,
    backgroundColor: Colors.danger,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  outOfStockText: {
    color: Colors.white,
    fontSize: FontSizes.xs,
    fontWeight: "600",
  },
  lowStockBadge: {
    position: "absolute",
    top: Spacing.sm,
    right: Spacing.sm,
    backgroundColor: Colors.warning,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  lowStockText: {
    color: Colors.white,
    fontSize: FontSizes.xs,
    fontWeight: "600",
  },
  wishlistButton: {
    position: "absolute",
    bottom: Spacing.sm,
    right: Spacing.sm,
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  wishlistButtonActive: {
    backgroundColor: Colors.white,
  },
  content: {
    padding: Spacing.md,
  },
  contentCompact: {
    padding: Spacing.sm,
  },
  name: {
    fontSize: FontSizes.md,
    fontWeight: "600",
    color: Colors.dark,
    marginBottom: Spacing.xs,
  },
  nameCompact: {
    fontSize: FontSizes.sm,
  },
  price: {
    fontSize: FontSizes.lg,
    fontWeight: "700",
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  priceCompact: {
    fontSize: FontSizes.md,
  },
  stock: {
    fontSize: FontSizes.xs,
    color: Colors.success,
    fontWeight: "500",
  },
  outOfStock: {
    color: Colors.danger,
  },
  addButton: {
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: Colors.gray,
    opacity: 0.6,
  },
  addButtonText: {
    color: Colors.white,
    fontWeight: "600",
    fontSize: FontSizes.md,
  },
});
