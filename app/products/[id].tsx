import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Heart, ShoppingCart } from "lucide-react-native";
import { Header } from "@/components/Header";
import { Button } from "@/components/Button";
import { productService, Product } from "@/services/product.service";
import { useCartStore } from "@/store/cart.store";
import { useWatchlistStore } from "@/store/watchlist.store";
import { Colors, Spacing, FontSizes, BorderRadius } from "@/constants/theme";

export default function ProductDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  const addToCart = useCartStore((state) => state.addToCart);
  const addToWatchlist = useWatchlistStore((state) => state.addToWatchlist);
  const removeFromWatchlist = useWatchlistStore(
    (state) => state.removeFromWatchlist
  );
  const isInWatchlist = useWatchlistStore((state) => state.isInWatchlist);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setIsLoading(true);
      if (id) {
        const data = await productService.getById(id);
        setProduct(data);
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to load product");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      await addToCart(product._id, quantity);
      Alert.alert("Success", `Added ${quantity} item(s) to cart`, [
        { text: "Continue Shopping" },
        {
          text: "Go to Cart",
          onPress: () => router.push("/(tabs)/cart"),
        },
      ]);
      setQuantity(1);
    } catch (error) {
      Alert.alert("Error", "Failed to add to cart");
    }
  };

  const handleToggleWatchlist = async () => {
    if (!product) return;
    try {
      if (isInWatchlist(product._id)) {
        const item = useWatchlistStore.getState().items.find(
          (item) => item.productId === product._id
        );
        if (item) {
          await removeFromWatchlist(item._id);
          Alert.alert("Success", "Removed from wishlist");
        }
      } else {
        await addToWatchlist(product._id);
        Alert.alert("Success", "Added to wishlist");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to update wishlist");
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Product Details" showBackButton />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Product Details" showBackButton />
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>Product not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const isInStock = product.stock > 0;

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Product Details" showBackButton />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri:
                product.image ||
                "https://via.placeholder.com/400?text=No+Image",
            }}
            style={styles.image}
            onError={() => console.log("Image failed to load")}
          />
          {!isInStock && (
            <View style={styles.outOfStockOverlay}>
              <Text style={styles.outOfStockText}>Out of Stock</Text>
            </View>
          )}
        </View>

        {/* Product Details */}
        <View style={styles.detailsContainer}>
          <View style={styles.headerRow}>
            <View style={styles.nameSection}>
              <Text style={styles.name}>{product.name}</Text>
              {product.category && (
                <Text style={styles.category}>
                  {product.category.name}
                </Text>
              )}
            </View>
            <TouchableOpacity
              onPress={handleToggleWatchlist}
              style={[
                styles.wishlistButton,
                isInWatchlist(product._id) &&
                  styles.wishlistButtonActive,
              ]}
            >
              <Heart
                // @ts-ignore
                size={24}
                color={
                  isInWatchlist(product._id) ? Colors.danger : Colors.primary
                }
                fill={
                  isInWatchlist(product._id) ? Colors.danger : "none"
                }
                strokeWidth={1.5}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.price}>${product.price.toFixed(2)}</Text>
            <Text style={[styles.stock, !isInStock && styles.stockOff]}>
              {isInStock ? `${product.stock} in stock` : "Out of stock"}
            </Text>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>

          {/* Product Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Product Information</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Stock:</Text>
              <Text style={styles.infoValue}>{product.stock} units</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>SKU:</Text>
              <Text style={styles.infoValue}>{product.slug}</Text>
            </View>
          </View>

          {/* Quantity Selector */}
          {isInStock && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Quantity</Text>
              <View style={styles.quantityControl}>
                <TouchableOpacity
                  onPress={() => setQuantity(Math.max(1, quantity - 1))}
                  style={styles.quantityButton}
                >
                  <Text style={styles.quantityButtonText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.quantity}>{quantity}</Text>
                <TouchableOpacity
                  onPress={() => setQuantity(quantity + 1)}
                  style={styles.quantityButton}
                >
                  <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actions}>
            <Button
              title={isInStock ? "Add to Cart" : "Out of Stock"}
              onPress={handleAddToCart}
              disabled={!isInStock}
              fullWidth
              size="large"
            />
          </View>

          {/* Recommended Products */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Related Products</Text>
            <Text style={styles.relatedText}>
              Check out other delicious fruits!
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: FontSizes.lg,
    color: Colors.danger,
  },
  scrollContent: {
    paddingBottom: Spacing.xl,
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 300,
    backgroundColor: Colors.white,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  outOfStockOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  outOfStockText: {
    color: Colors.white,
    fontSize: FontSizes.xl,
    fontWeight: "700",
  },
  detailsContainer: {
    backgroundColor: Colors.white,
    marginTop: Spacing.md,
    marginHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing.lg,
  },
  nameSection: {
    flex: 1,
  },
  name: {
    fontSize: FontSizes.xxl,
    fontWeight: "700",
    color: Colors.dark,
    marginBottom: Spacing.xs,
  },
  category: {
    fontSize: FontSizes.sm,
    color: Colors.gray,
    fontWeight: "500",
  },
  wishlistButton: {
    padding: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.bg,
  },
  wishlistButtonActive: {
    backgroundColor: "#FFE5E5",
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.lg,
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  price: {
    fontSize: FontSizes.xxxl,
    fontWeight: "700",
    color: Colors.primary,
  },
  stock: {
    fontSize: FontSizes.md,
    color: Colors.success,
    fontWeight: "600",
  },
  stockOff: {
    color: Colors.danger,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: "700",
    color: Colors.dark,
    marginBottom: Spacing.md,
  },
  description: {
    fontSize: FontSizes.md,
    color: Colors.gray,
    lineHeight: 24,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  infoLabel: {
    fontSize: FontSizes.md,
    color: Colors.gray,
    fontWeight: "500",
  },
  infoValue: {
    fontSize: FontSizes.md,
    color: Colors.dark,
    fontWeight: "600",
  },
  quantityControl: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.bg,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    alignSelf: "flex-start",
  },
  quantityButton: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityButtonText: {
    fontSize: FontSizes.lg,
    fontWeight: "700",
    color: Colors.primary,
  },
  quantity: {
    minWidth: 40,
    textAlign: "center",
    fontSize: FontSizes.lg,
    fontWeight: "600",
    color: Colors.dark,
  },
  actions: {
    marginVertical: Spacing.lg,
  },
  relatedText: {
    fontSize: FontSizes.md,
    color: Colors.gray,
  },
});
