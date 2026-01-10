import React, { useEffect, useState } from "react";
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
  Image,
  TextInput,
} from "react-native";
import {
  Trash2,
  MoreVertical,
  Clock,
  Star,
  Minus,
  Plus,
  TicketPercent,
} from "lucide-react-native";
import { Header } from "@/components/Header";
import { useCartStore } from "@/store/cart.store";
import { Colors, Spacing, FontSizes, BorderRadius } from "@/constants/theme";
import { useRouter } from "expo-router";

export default function CartScreen() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const fetchCart = useCartStore((state) => state.fetchCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  // const getTotalItems = useCartStore((state) => state.getTotalItems);

  const [promoCode, setPromoCode] = useState("3H4-KU70");
  const [isPromoApplied, setIsPromoApplied] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  const handleIncreaseQuantity = async (itemId: string, currentQty: number) => {
    try {
      await updateQuantity(itemId, currentQty + 1);
    } catch (error) {
      Alert.alert("Error", "Failed to update quantity");
    }
  };

  const handleDecreaseQuantity = async (itemId: string, currentQty: number) => {
    if (currentQty === 1) {
      handleRemoveItem(itemId);
    } else {
      try {
        await updateQuantity(itemId, currentQty - 1);
      } catch (error) {
        Alert.alert("Error", "Failed to update quantity");
      }
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    Alert.alert("Remove Item", "Remove this item from cart?", [
      { text: "Cancel" },
      {
        text: "Remove",
        onPress: async () => {
          try {
            await removeFromCart(itemId);
          } catch (error) {
            Alert.alert("Error", "Failed to remove item");
          }
        },
      },
    ]);
  };

  const subtotal = getTotalPrice();
  const deliveryFee = 6.0;
  const tax = 2.0;
  const discount = isPromoApplied ? 2.2 : 0;
  const total = subtotal + deliveryFee + tax - discount;

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.cartItem}>
      {/* Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.product?.image || "https://via.placeholder.com/150" }}
          style={styles.itemImage}
        />
      </View>

      {/* Content */}
      <View style={styles.itemContent}>
        <Text style={styles.itemName} numberOfLines={1}>
          {item.product?.name || "Unknown Product"}
        </Text>

        <View style={styles.metaRow}>
          <Clock size={12} color={Colors.gray} />
          <Text style={styles.metaText}>15-20 min</Text>
          <View style={styles.metaDivider} />
          <Star size={12} color="#F59E0B" fill="#F59E0B" />
          <Text style={styles.metaText}>4.9 (1285)</Text>
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.itemPrice}>
            <Text style={styles.currency}>$</Text> {item.product?.price?.toFixed(2) || "0.00"}
          </Text>

          {/* Quantity Selector */}
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              onPress={() => handleDecreaseQuantity(item._id, item.quantity)}
              style={styles.qtyButtonMinus}
            >
              <Minus size={16} color={Colors.dark} />
            </TouchableOpacity>

            <Text style={styles.qtyText}>
              {item.quantity.toString().padStart(2, '0')}
            </Text>

            <TouchableOpacity
              onPress={() => handleIncreaseQuantity(item._id, item.quantity)}
              style={styles.qtyButtonPlus}
            >
              <Plus size={16} color={Colors.white} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.bg} />
      <Header
        title="My Cart List"
        showBackButton
        rightIcon={<MoreVertical size={24} color={Colors.dark} />}
        rightAction={() => { }}
      />

      <FlatList
        data={items}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          items.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>🛒</Text>
              <Text style={styles.emptyTitle}>Your cart is empty</Text>
              <Text style={styles.emptySubtitle}>
                Add some tasty items to proceed!
              </Text>
            </View>
          ) : null
        }
        ListFooterComponent={
          items.length > 0 ? (
            <View style={styles.footer}>
              {/* Promo Code */}
              <View style={styles.promoContainer}>
                <TextInput
                  style={styles.promoInput}
                  value={promoCode}
                  onChangeText={setPromoCode}
                  placeholder="Promo Code"
                />
                <TouchableOpacity style={styles.promoButton}>
                  <Text style={styles.promoButtonText}>
                    {isPromoApplied ? "Promo-code Confirmed" : "Apply"}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Summary */}
              <View style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>Order Summary</Text>

                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Order Amount</Text>
                  <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
                </View>

                {isPromoApplied && (
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Promo-code</Text>
                    <Text style={styles.summaryValue}>-${discount.toFixed(2)}</Text>
                  </View>
                )}

                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Delivery</Text>
                  <Text style={styles.summaryValue}>${deliveryFee.toFixed(2)}</Text>
                </View>

                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Tax</Text>
                  <Text style={styles.summaryValue}>${tax.toFixed(2)}</Text>
                </View>

                <View style={[styles.divider, { marginVertical: 15 }]} />

                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryLabel, styles.totalLabel]}>Total Amount</Text>
                  <Text style={[styles.summaryValue, styles.totalValue]}>
                    <Text style={{ fontSize: 16, color: "#FF7D56" }}>$ </Text>
                    {total.toFixed(2)}
                  </Text>
                </View>

                {/* Checkout Button */}
                <TouchableOpacity
                  style={styles.checkoutButton}
                  onPress={() => router.push("/checkout")}
                >
                  <Text style={styles.checkoutButtonText}>Proceed Transactions</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg, // Light grey bg like mockup
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  listContent: {
    padding: Spacing.lg,
    paddingBottom: 100,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 100,
  },
  emptyIcon: { fontSize: 60, marginBottom: 20 },
  emptyTitle: { fontSize: 20, fontWeight: "bold", color: Colors.dark },
  emptySubtitle: { color: Colors.gray, marginTop: 5 },
  cartItem: {
    backgroundColor: Colors.white,
    padding: 12,
    borderRadius: 20,
    flexDirection: "row",
    marginBottom: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 50, // Circular mask if needed or just rounded
    overflow: 'hidden',
    marginRight: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemImage: {
    width: "100%",
    height: "100%",
    resizeMode: 'contain',
  },
  itemContent: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.dark,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  metaText: {
    fontSize: 12,
    color: Colors.gray,
    marginLeft: 4,
    fontWeight: "500",
  },
  metaDivider: {
    width: 4,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.dark,
  },
  currency: {
    fontSize: 14,
    color: "#FF7D56", // Orange accent for currency symbol
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F8F8",
    borderRadius: 20,
    padding: 4,
  },
  qtyButtonMinus: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  qtyButtonPlus: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#1A1A1A", // Dark bg for plus
    alignItems: "center",
    justifyContent: "center",
  },
  qtyText: {
    marginHorizontal: 10,
    fontWeight: "600",
    fontSize: 14,
    color: Colors.dark,
  },
  footer: {
    marginTop: 10,
  },
  promoContainer: {
    flexDirection: "row",
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 6,
    paddingLeft: 20,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
  },
  promoInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.dark,
    fontWeight: "500",
  },
  promoButton: {
    backgroundColor: "#FF7D56", // Orange accent
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  promoButtonText: {
    color: Colors.white,
    fontWeight: "600",
    fontSize: 14,
  },
  summaryCard: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.dark,
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 15,
    color: "#888",
    fontWeight: "500",
  },
  summaryValue: {
    fontSize: 15,
    color: Colors.dark,
    fontWeight: "700",
  },
  totalLabel: {
    fontSize: 16,
    color: Colors.dark,
  },
  totalValue: {
    fontSize: 22,
    color: Colors.dark,
  },
  divider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    width: "100%",
    borderStyle: 'dashed', // Dashed border doesn't work well on View height 1, but let's try or just solid
  },
  checkoutButton: {
    backgroundColor: "#1A1A1A", // Dark button
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 20,
  },
  checkoutButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
});
