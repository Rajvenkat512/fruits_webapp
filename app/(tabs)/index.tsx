
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
  StatusBar,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { Search } from "lucide-react-native";
import { Header } from "@/components/Header";
import { CategoryCard } from "@/components/CategoryCard";
import { ProductCard } from "@/components/ProductCard";
import { useAuthStore } from "@/store/auth.store";
import { useCartStore } from "@/store/cart.store";
import { useWatchlistStore } from "@/store/watchlist.store";
import { categoryService, Category } from "@/services/category.service";
import { bannerService, Banner } from "@/services/banner.service";
import { productService, Product } from "@/services/product.service";
import { Colors, Spacing, FontSizes, BorderRadius } from "@/constants/theme";
import { BannerCarousel } from "@/components/BannerCarousel";
import { useTheme } from "@/hooks/useTheme";

export default function HomeScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const logout = useAuthStore((state) => state.logout);
  const addToCart = useCartStore((state) => state.addToCart);
  const addToWatchlist = useWatchlistStore((state) => state.addToWatchlist);
  const removeFromWatchlist = useWatchlistStore((state) => state.removeFromWatchlist);
  const isInWatchlist = useWatchlistStore((state) => state.isInWatchlist);

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);


  const screenWidth = Dimensions.get("window").width;
  const ITEM_MARGIN = Spacing.sm;

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [selectedCategoryId]);



  const loadData = async () => {
    try {
      setIsLoading(true);
      const [categoriesData, bannersData] = await Promise.all([
        categoryService.getAll(),
        bannerService.getAll(),
      ]);
      setCategories(categoriesData);
      setBanners(bannersData);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to load data");
    } finally {
      setIsLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const params = selectedCategoryId
        ? { categoryId: selectedCategoryId, limit: 50 }
        : { limit: 50 };
      const productsData = await productService.getAll(params);

      // Deduplicate products based on _id or id
      const uniqueProducts = Array.from(new Map(productsData.map(item => {
        // Handle API using 'id' instead of '_id'
        const uniqueId = item.id || item._id;
        // Ensure standard _id usage throughout the component
        const normalizedItem = { ...item, _id: uniqueId };
        return [uniqueId, normalizedItem];
      })).values());
      setProducts(uniqueProducts);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to load products");
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([loadData(), loadProducts()]);
    setIsRefreshing(false);
  };

  const handleProductPress = (productId: string) => router.push(`/products/${productId}`);
  const handleCategoryPress = (categoryId: string) => {
    if (selectedCategoryId === categoryId) setSelectedCategoryId(null);
    else setSelectedCategoryId(categoryId);
  };

  const handleAddToCart = async (productId: string) => {
    try {
      await addToCart(productId, 1);
      // Navigate to cart page
      router.push("/(tabs)/cart");
    } catch {
      Alert.alert("Error", "Failed to add to cart");
    }
  };

  const handleToggleWatchlist = async (productId: string) => {
    try {
      if (isInWatchlist(productId)) {
        const item = useWatchlistStore.getState().items.find(i => i.productId === productId);
        if (item) await removeFromWatchlist(item._id);
      } else {
        await addToWatchlist(productId);
      }
    } catch {
      Alert.alert("Error", "Failed to update watchlist");
    }
  };

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </SafeAreaView>
    );
  }

  const numColumns = 2;
  const ITEM_WIDTH = (screenWidth - Spacing.md * 2 - ITEM_MARGIN) / numColumns;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Custom Header Area */}
      <View style={[styles.headerContainer, { backgroundColor: colors.bg }]}>
        <Header title="Fruits App" showCart showWishlist rightAction={handleLogout} />
      </View>

      <FlatList
        data={products}
        keyExtractor={(item, index) => item._id || index.toString()}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} tintColor={colors.primary} />}
        contentContainerStyle={styles.listContent}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        ListHeaderComponent={() => (
          <View style={styles.headerComponent}>
            {/* Carousel */}
            <BannerCarousel banners={banners} />

            {/* Categories */}
            <View style={styles.sectionContainer}>
              <Text style={[styles.sectionTitle, { color: colors.dark }]}>Categories</Text>
              <FlatList
                data={categories}
                horizontal
                keyExtractor={(c, index) => c._id || index.toString()}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoriesList}
                renderItem={({ item: category }) => (
                  <CategoryCard
                    id={category._id}
                    name={category.name}
                    onPress={() => handleCategoryPress(category._id)}
                    backgroundColor={selectedCategoryId === category._id ? colors.primary : colors.white}
                    textColor={selectedCategoryId === category._id ? colors.white : colors.dark}
                    small
                  />
                )}
              />
            </View>

            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: colors.dark }]}>
                  {selectedCategoryId ? "Filtered Products" : "All Products"}
                </Text>
                {!selectedCategoryId && (
                  <TouchableOpacity onPress={() => loadProducts()}>
                    <Text style={[styles.seeAllText, { color: colors.primary }]}>See All</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        )}
        renderItem={({ item: product }) => (
          <View style={{ width: ITEM_WIDTH, marginBottom: Spacing.lg }}>
            <ProductCard
              id={product._id}
              name={product.name}
              description={product.description}
              price={product.price}
              image={product.image || "https://via.placeholder.com/200"}
              stock={product.stock}
              onPress={() => handleProductPress(product._id)}
              onAddToCart={() => handleAddToCart(product._id)}
              onToggleWatchlist={() => handleToggleWatchlist(product._id)}
              isInWatchlist={isInWatchlist(product._id)}
              compact
              style={[styles.productCard, { backgroundColor: colors.white }]}
            />
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    // paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0, // Removed to allow Header to fill top
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.bg,
    justifyContent: "center",
    alignItems: "center",
  },
  headerContainer: {
    backgroundColor: Colors.bg,
    paddingBottom: Spacing.sm,
  },
  searchContainer: {
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.xs,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    height: 48,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: FontSizes.md,
    color: Colors.dark,
    height: "100%",
  },
  listContent: {
    paddingBottom: Spacing.xl,
  },
  headerComponent: {
    marginBottom: Spacing.sm,
  },
  carouselContainer: {
    marginTop: Spacing.md,
    alignItems: 'center',
  },
  bannerCard: {
    height: 190,
    borderRadius: BorderRadius.md,
    overflow: "hidden",
    backgroundColor: Colors.lightGray,
  },

  bannerImage: {
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
  },

  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },

  bannerTextWrap: {
    padding: Spacing.md,
  },

  bannerTitle: {
    color: Colors.white,
    fontSize: FontSizes.lg,
    fontWeight: "700",
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
    marginBottom: Spacing.md,
  },
  indicatorDot: {
    width: 6,
    height: 6,
    backgroundColor: Colors.lightGray,
    borderRadius: 3,
    marginHorizontal: 4,
  },
  indicatorDotActive: {
    backgroundColor: Colors.primary,
    width: 20,
    borderRadius: 3,
  },
  sectionContainer: {
    marginBottom: Spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: "700",
    color: Colors.dark,
    paddingHorizontal: Spacing.md,
  },
  seeAllText: {
    fontSize: FontSizes.sm,
    color: Colors.primary,
    fontWeight: "600",
  },
  categoriesList: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    gap: Spacing.sm, // Works in newer React Native
  },
  columnWrapper: {
    justifyContent: "space-between",
    paddingHorizontal: Spacing.md,
  },
  productCard: {
    width: "100%",
    marginHorizontal: 0,
    marginVertical: 0,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
  },
});


