import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Alert,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { Header } from "@/components/Header";
import { CategoryCard } from "@/components/CategoryCard";
import { ProductCard } from "@/components/ProductCard";
import { useAuthStore } from "@/store/auth.store";
import { useCartStore } from "@/store/cart.store";
import { useWatchlistStore } from "@/store/watchlist.store";
import { categoryService, Category } from "@/services/category.service";
import { productService, Product } from "@/services/product.service";
import { Colors, Spacing, FontSizes } from "@/constants/theme";

export default function HomeScreen() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const addToCart = useCartStore((state) => state.addToCart);
  const addToWatchlist = useWatchlistStore((state) => state.addToWatchlist);
  const removeFromWatchlist = useWatchlistStore((state) => state.removeFromWatchlist);
  const isInWatchlist = useWatchlistStore((state) => state.isInWatchlist);

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [carouselIndex, setCarouselIndex] = useState(0);

  const screenWidth = Dimensions.get("window").width;

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [selectedCategoryId]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [categoriesData, productsData] = await Promise.all([
        categoryService.getAll(),
        productService.getAll(),
      ]);
      setCategories(categoriesData);
      setProducts(productsData);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to load data");
    } finally {
      setIsLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const params = selectedCategoryId
        ? { categoryId: selectedCategoryId }
        : {};
      const productsData = await productService.getAll(params);
      setProducts(productsData);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to load products");
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadData();
    setIsRefreshing(false);
  };

  const handleProductPress = (productId: string) => {
    router.push(`/products/${productId}`);
  };

  const handleCategoryPress = (categoryId: string) => {
    if (selectedCategoryId === categoryId) {
      setSelectedCategoryId(null);
    } else {
      setSelectedCategoryId(categoryId);
    }
  };

  const handleAddToCart = async (productId: string) => {
    try {
      await addToCart(productId, 1);
      Alert.alert("Success", "Added to cart");
    } catch (error) {
      Alert.alert("Error", "Failed to add to cart");
    }
  };

  const handleToggleWatchlist = async (productId: string) => {
    try {
      if (isInWatchlist(productId)) {
        const item = useWatchlistStore.getState().items.find(
          (item) => item.productId === productId
        );
        if (item) {
          await removeFromWatchlist(item._id);
        }
      } else {
        await addToWatchlist(productId);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to update watchlist");
    }
  };

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", onPress: () => {} },
      {
        text: "Logout",
        onPress: async () => {
          await logout();
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Fruits App" showCart showWishlist />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Fruits App"
        showCart
        showWishlist
        rightAction={handleLogout}
      />
      <FlatList
        data={[]}
        ListHeaderComponent={() => (
          <View>
            {/* Search Bar */}
            <View style={styles.searchContainer}>
              <TextInput
                placeholder="Search fresh fruits..."
                placeholderTextColor={Colors.gray}
                style={styles.searchInput}
              />
            </View>

            {/* Carousel */}
            <FlatList
              data={products.slice(0, 4)}
              horizontal
              keyExtractor={(item) => item._id}
              showsHorizontalScrollIndicator={false}
              pagingEnabled
              onMomentumScrollEnd={(ev) => {
                const idx = Math.round(ev.nativeEvent.contentOffset.x / screenWidth);
                setCarouselIndex(idx);
              }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => handleProductPress(item._id)}
                  style={[styles.bannerCard, { width: screenWidth * 0.8 }]}
                >
                  <ImageBackground
                    source={{ uri: item.image || "https://via.placeholder.com/600" }}
                    style={styles.bannerImage}
                    imageStyle={{ borderRadius: 14 }}
                  >
                    <View style={styles.bannerOverlay} />
                    <View style={styles.bannerTextWrap}>
                      <Text style={styles.bannerTitle}>{item.name}</Text>
                      <Text style={styles.bannerSubtitle}>{item.price ? `$${item.price.toFixed(2)}` : ""}</Text>
                    </View>
                  </ImageBackground>
                </TouchableOpacity>
              )}
            />

            {/* Page Indicator */}
            <View style={styles.indicatorContainer}>
              {products.slice(0, 4).map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.indicatorDot,
                    i === carouselIndex && styles.indicatorDotActive,
                  ]}
                />
              ))}
            </View>

            {/* Categories Row */}
            <View style={styles.categoriesRow}>
              <FlatList
                data={categories}
                horizontal
                keyExtractor={(c) => c._id}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item: category }) => (
                  <CategoryCard
                    id={category._id}
                    name={category.name}
                    onPress={() => handleCategoryPress(category._id)}
                    backgroundColor={Colors.bg}
                    small
                  />
                )}
                contentContainerStyle={{ paddingHorizontal: 16 }}
              />
            </View>

            {/* Section Title */}
            <View style={styles.productsSection}>
              <Text style={styles.sectionTitle}>{selectedCategoryId ? "Filtered Products" : "Recommended"}</Text>
            </View>
          </View>
        )}
        renderItem={null}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.primary}
          />
        }
      />

      {/* Horizontal products carousel */}
      <View style={styles.horizontalProductsWrap}>
        <FlatList
          data={products}
          horizontal
          keyExtractor={(p) => p._id}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item: product }) => (
            <ProductCard
              id={product._id}
              name={product.name}
              price={product.price}
              image={product.image || "https://via.placeholder.com/200"}
              stock={product.stock}
              onPress={() => handleProductPress(product._id)}
              onAddToCart={() => handleAddToCart(product._id)}
              onToggleWatchlist={() => handleToggleWatchlist(product._id)}
              isInWatchlist={isInWatchlist(product._id)}
              compact
            />
          )}
          contentContainerStyle={{ paddingHorizontal: 12 }}
        />
      </View>
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
  categoriesSection: {
    paddingVertical: Spacing.md,
  },
  productsSection: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: "700",
    color: Colors.dark,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  columnWrapper: {
    justifyContent: "space-between",
    paddingHorizontal: Spacing.xs,
  },
  listContent: {
    paddingBottom: Spacing.xl,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: Spacing.xxl,
  },
  emptyText: {
    fontSize: FontSizes.md,
    color: Colors.gray,
  },
  searchContainer: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  searchInput: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: FontSizes.md,
    elevation: 2,
  },
  bannerCard: {
    marginHorizontal: 12,
    borderRadius: 14,
    overflow: "hidden",
    height: 180,
    marginTop: Spacing.md,
  },
  bannerImage: {
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.18)",
  },
  bannerTextWrap: {
    padding: Spacing.md,
  },
  bannerTitle: {
    color: Colors.white,
    fontSize: FontSizes.lg,
    fontWeight: "800",
  },
  bannerSubtitle: {
    color: Colors.white,
    fontSize: FontSizes.md,
    marginTop: Spacing.xs,
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: Spacing.sm,
  },
  indicatorDot: {
    width: 8,
    height: 8,
    backgroundColor: Colors.gray,
    borderRadius: 8,
    marginHorizontal: 6,
  },
  indicatorDotActive: {
    backgroundColor: Colors.primary,
    width: 28,
    borderRadius: 6,
  },
  categoriesRow: {
    marginTop: Spacing.md,
  },
  horizontalProductsWrap: {
    marginTop: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
});
