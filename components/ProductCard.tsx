
import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Heart } from "lucide-react-native";
import { Colors, Spacing, BorderRadius, FontSizes } from "@/constants/theme";

interface ProductCardProps {
  id: string;
  name: string;
  description?: string;
  price: number;
  image: string;
  stock: number;
  onPress: () => void;
  onAddToCart: () => void;
  onToggleWatchlist?: () => void;
  isInWatchlist?: boolean;
  compact?: boolean;
  style?: object; // Added for custom height/width from parent
}

export const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  description,
  price,
  image,
  stock,
  onPress,
  onAddToCart,
  onToggleWatchlist,
  isInWatchlist = false,
  compact = false,
  style,
}) => {
  const inStock = stock > 0;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        compact && styles.containerCompact,
        style // Apply custom style from parent (height/width)
      ]}
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
        <Text style={[styles.name, compact && styles.nameCompact]} numberOfLines={1}>
          {name}
        </Text>
        {description && (
          <Text style={[styles.description, compact && styles.descriptionCompact]} numberOfLines={2}>
            {description}
          </Text>
        )}
        <View style={styles.footerRow}>
          <Text style={[styles.price, compact && styles.priceCompact]}>
            ${price.toFixed(2)}
          </Text>

          <TouchableOpacity
            style={[styles.addToCartButton, !inStock && styles.disabledButton]}
            onPress={onAddToCart}
            disabled={!inStock}
            activeOpacity={0.8}
          >
            <Text style={styles.addToCartText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity >
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // NO margins - parent handles spacing
  },
  containerCompact: {
    // NO fixed width - uses 100% of parent container
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 160,
    backgroundColor: Colors.bg,
  },
  imageContainerCompact: {
    height: 120, // Increased for better proportions in grid
  },
  image: {
    width: "100%",
    height: "100%",
    borderTopLeftRadius: BorderRadius.lg,
    borderTopRightRadius: BorderRadius.lg,
  },
  outOfStockBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: Colors.danger,
    paddingHorizontal: 8,
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
    top: 8,
    left: 8,
    backgroundColor: Colors.warning,
    paddingHorizontal: 8,
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
    top: 8,
    right: 8,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  wishlistButtonActive: {
    backgroundColor: Colors.white,
  },
  content: {
    padding: Spacing.md,
    flex: 1,
  },
  contentCompact: {
    padding: Spacing.sm,
  },
  name: {
    fontSize: FontSizes.md,
    fontWeight: "600",
    color: Colors.dark,
    marginBottom: Spacing.xs,
    lineHeight: 20,
  },
  nameCompact: {
    fontSize: FontSizes.sm,
  },
  price: {
    fontSize: FontSizes.lg,
    fontWeight: "600",
    color: Colors.dark,
  },
  priceCompact: {
    fontSize: FontSizes.md,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 1,
  },
  addToCartButton: {
    backgroundColor: Colors.dark,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
  },
  addToCartText: {
    color: Colors.white,
    fontWeight: "500",
    fontSize: 10,
  },
  disabledButton: {
    backgroundColor: Colors.gray,
    opacity: 0.6,
  },
  description: {
    fontSize: FontSizes.sm,
    color: Colors.gray,
    marginBottom: Spacing.xs,
  },
  descriptionCompact: {
    fontSize: FontSizes.xs,
    marginBottom: 4,
  },
});
