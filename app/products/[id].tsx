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
  Dimensions,
  StatusBar,
  Platform,
  Modal,
  TextInput,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Heart, Minus, Plus, Star } from "lucide-react-native";
import { Header } from "@/components/Header";
import { productService, Product } from "@/services/product.service";
import { reviewService, ReviewResponse } from "@/services/review.service";
import { useCartStore } from "@/store/cart.store";
import { useWatchlistStore } from "@/store/watchlist.store";
import { Colors, Spacing, FontSizes, BorderRadius } from "@/constants/theme";


const { width, height } = Dimensions.get("window");

export default function ProductDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const addToCart = useCartStore((state) => state.addToCart);
  const addToWatchlist = useWatchlistStore((state) => state.addToWatchlist);
  const removeFromWatchlist = useWatchlistStore((state) => state.removeFromWatchlist);
  const isInWatchlist = useWatchlistStore((state) => state.isInWatchlist);

  // Review State
  const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Reviews List State
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  const handleOpenReview = () => {
    setReviewRating(5);
    setReviewComment("");
    setIsReviewModalVisible(true);
  };

  const handleSubmitReview = async () => {
    if (!product) return;
    if (!reviewComment.trim()) {
      Alert.alert("Error", "Please write a comment.");
      return;
    }

    try {
      setIsSubmittingReview(true);
      await reviewService.createReview({
        productId: id,
        rating: reviewRating,
        comment: reviewComment
      });
      setIsReviewModalVisible(false);
      Alert.alert("Success", "Review submitted successfully!");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to submit review");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  useEffect(() => {
    loadProduct();
    loadReviews();
  }, [id]);

  const loadReviews = async () => {
    try {
      if (!id) return;
      setLoadingReviews(true);
      const data = await reviewService.getReviews(id);
      const sorted = data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setReviews(sorted);
    } catch (error) {
      console.log("Error loading reviews", error);
    } finally {
      setLoadingReviews(false);
    }
  };

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
      Alert.alert("Success", "Added to cart", [
        { text: "Continue Shopping" },
        { text: "Go to Cart", onPress: () => router.push("/(tabs)/cart") },
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to add to cart");
    }
  };

  const handleToggleWatchlist = async () => {
    if (!product) return;
    try {
      if (isInWatchlist(product._id)) {
        const item = useWatchlistStore.getState().items.find((i) => i.productId === product._id);
        if (item) await removeFromWatchlist(item._id);
      } else {
        await addToWatchlist(product._id);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to update watchlist");
    }
  };

  const handleShare = () => {
    Alert.alert("Share", "Sharing functionality coming soon!");
  };

  if (isLoading || !product) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const isFavorite = isInWatchlist(product._id);
  const isInStock = product.stock > 0;
  const discount = 30; // Mock discount

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
      <Header
        title="Product Details"
        showBackButton
        showCart
        showShare
        rightAction={handleShare}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Image Section */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product.image || "https://via.placeholder.com/600" }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.title}>{product.name}</Text>

          <View style={styles.ratingRow}>
            <Text style={styles.price}>${product.price.toFixed(2)}</Text>
            <Text style={styles.discount}> Save Up to {discount}%</Text>
            <Text style={styles.rating}> ⭐ {isLoading ? "..." : "5 (2k+)"}</Text>
          </View>

          <TouchableOpacity onPress={handleOpenReview} style={styles.writeReviewButton}>
            <Text style={styles.writeReviewText}>Write a Review</Text>
          </TouchableOpacity>

          {/* Product Details */}
          <Text style={styles.sectionTitle}>Product Details</Text>
          <Text style={styles.description}>
            {product.description || "Beauty products enhance personal care and self-expression. Mobile apps now make discovering trying inclusive features..."}
          </Text>

          {/* Reviews List */}
          <View style={styles.reviewsListContainer}>
            <Text style={styles.sectionTitle}>Reviews ({reviews.length})</Text>
            {loadingReviews ? (
              <ActivityIndicator color={Colors.primary} />
            ) : reviews.length === 0 ? (
              <Text style={styles.noReviewsText}>No reviews yet. Be the first to review!</Text>
            ) : (
              reviews.map((r) => (
                <View key={r.id} style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    <View style={{ flexDirection: 'row' }}>
                      {[1, 2, 3, 4, 5].map(s => (
                        <Star key={s} size={14} color={s <= r.rating ? "#FFD700" : "#EEE"} fill={s <= r.rating ? "#FFD700" : "none"} />
                      ))}
                    </View>
                    <Text style={styles.reviewDate}>{new Date(r.createdAt).toLocaleDateString()}</Text>
                  </View>
                  <Text style={styles.reviewComment}>{r.comment}</Text>
                </View>
              ))
            )}
          </View>

          {/* Quantity Selector */}
          <Text style={styles.sectionTitle}>Quantity</Text>
          <View style={styles.quantityRow}>
            <TouchableOpacity onPress={decrementQuantity} style={styles.quantityButton}>
              <Minus size={22} color={Colors.dark} />
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity onPress={incrementQuantity} style={styles.quantityButton}>
              <Plus size={22} color={Colors.dark} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.wishlist}
          onPress={handleToggleWatchlist}
        >
          <Heart
            size={22}
            color={isFavorite ? Colors.danger : Colors.primary}
            fill={isFavorite ? Colors.danger : "none"}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={handleAddToCart}
          disabled={!isInStock}
        >
          <LinearGradient
            colors={isInStock ? ["#9FE870", "#7ED957"] : ["#CCCCCC", "#AAAAAA"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.orderButton}
          >
            <Text style={styles.orderText}>
              {isInStock ? "Order Now" : "Out of Stock"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Review Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isReviewModalVisible}
        onRequestClose={() => setIsReviewModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Write a Review</Text>

            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setReviewRating(star)}>
                  <Star
                    size={32}
                    color={star <= reviewRating ? "#FFD700" : "#E0E0E0"}
                    fill={star <= reviewRating ? "#FFD700" : "none"}
                  />
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={styles.commentInput}
              placeholder="Share your thoughts about this product..."
              value={reviewComment}
              onChangeText={setReviewComment}
              multiline
              numberOfLines={4}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setIsReviewModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSubmitReview}
                disabled={isSubmittingReview}
              >
                <Text style={styles.saveButtonText}>
                  {isSubmittingReview ? "Submitting..." : "Submit Review"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.white,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  imageContainer: {
    position: "relative",
    height: 360,
    width: width,
  },
  image: {
    width: "100%",
    height: "100%",
    borderBottomLeftRadius: BorderRadius.xl,
    borderBottomRightRadius: BorderRadius.xl,
  },
  content: {
    padding: Spacing.lg,
  },
  title: {
    fontSize: FontSizes.xl,
    fontWeight: "700",
    color: Colors.dark,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.sm,
  },
  price: {
    fontSize: FontSizes.lg,
    fontWeight: "700",
    color: Colors.dark,
  },
  discount: {
    color: Colors.success,
    marginLeft: 6,
  },
  rating: {
    marginLeft: "auto",
    color: Colors.gray,
  },
  sectionTitle: {
    fontWeight: "700",
    color: Colors.dark,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  description: {
    color: Colors.gray,
    lineHeight: 20,
    fontSize: FontSizes.sm,
  },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  quantityButton: {
    width: 45,
    height: 45,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    justifyContent: "center",
    alignItems: "center",
  },
  quantityText: {
    fontSize: FontSizes.xl,
    fontWeight: "600",
    color: Colors.dark,
    minWidth: 30,
    textAlign: "center",
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    padding: Spacing.lg,
    backgroundColor: Colors.white,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  wishlist: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#ECFDF5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  orderButton: {
    height: 50,
    borderRadius: BorderRadius.xl,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  orderText: {
    color: Colors.dark,
    fontSize: FontSizes.md,
  },
  writeReviewButton: {
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  writeReviewText: {
    color: Colors.primary,
    fontWeight: '600',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.dark,
    marginBottom: 20,
    textAlign: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 10,
  },
  commentInput: {
    backgroundColor: '#F5F6FA',
    padding: 15,
    borderRadius: 12,
    height: 100,
    textAlignVertical: 'top',
    marginBottom: 20,
    fontSize: 14,
    color: Colors.dark,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F5F6FA',
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    marginLeft: 10,
  },
  cancelButtonText: {
    color: Colors.gray,
    fontWeight: '600',
  },
  saveButtonText: {
    color: Colors.white,
    fontWeight: '600',
  },
  reviewsListContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  noReviewsText: {
    color: Colors.gray,
    fontStyle: 'italic',
    marginTop: 10,
  },
  reviewCard: {
    backgroundColor: '#F9F9F9',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  reviewDate: {
    color: Colors.gray,
    fontSize: 12,
  },
  reviewComment: {
    color: Colors.dark,
    fontSize: 14,
    lineHeight: 20,
  },
});
