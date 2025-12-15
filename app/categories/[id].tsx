import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Header } from "@/components/Header";
import { ProductCard } from "@/components/ProductCard";
import { categoryService } from "@/services/category.service";
import { productService, Product } from "@/services/product.service";
import { useCartStore } from "@/store/cart.store";
import { useWatchlistStore } from "@/store/watchlist.store";
import { Colors, Spacing } from "@/constants/theme";

export default function CategoryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [categoryName, setCategoryName] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const addToCart = useCartStore((state) => state.addToCart);
  const addToWatchlist = useWatchlistStore((state) => state.addToWatchlist);
  const removeFromWatchlist = useWatchlistStore(
    (state) => state.removeFromWatchlist
  );
  const isInWatchlist = useWatchlistStore((state) => state.isInWatchlist);

  useEffect(() => {
    loadCategoryProducts();
  }, [id]);

  const loadCategoryProducts = async () => {
    try {
      setIsLoading(true);
      if (id) {
        const [categoryData, productsData] = await Promise.all([
          categoryService.getById(id),
          productService.getAll({ categoryId: id }),
        ]);
        setCategoryName(categoryData.name);
        setProducts(productsData);
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to load category");
    } finally {
      setIsLoading(false);
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

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Category" showBackButton />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title={categoryName} showBackButton />

      {products.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No products in this category</Text>
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <ProductCard
              id={item._id}
              name={item.name}
              price={item.price}
              image={
                item.image || "https://via.placeholder.com/200?text=No+Image"
              }
              stock={item.stock}
              onPress={() => {}}
              onAddToCart={() => handleAddToCart(item._id)}
              onToggleWatchlist={() => handleToggleWatchlist(item._id)}
              isInWatchlist={isInWatchlist(item._id)}
            />
          )}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
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
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    color: Colors.gray,
  },
  columnWrapper: {
    justifyContent: "space-between",
    paddingHorizontal: Spacing.xs,
  },
  listContent: {
    paddingBottom: Spacing.xl,
  },
});
