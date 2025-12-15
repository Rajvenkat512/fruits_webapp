import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Trash2 } from "lucide-react-native";
import { Header } from "@/components/Header";
import { Button } from "@/components/Button";
import { useCartStore } from "@/store/cart.store";
import { Colors, Spacing, FontSizes, BorderRadius } from "@/constants/theme";

export default function CartScreen() {
  const items = useCartStore((state) => state.items);
  const fetchCart = useCartStore((state) => state.fetchCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const getTotalItems = useCartStore((state) => state.getTotalItems);

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

  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Shopping Cart" showBackButton={false} />

      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>
            Add some delicious fruits to get started!
          </Text>
        </View>
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View style={styles.cartItem}>
                <View style={styles.itemContent}>
                  <Text style={styles.itemName}>
                    {item.product?.name || "Product"}
                  </Text>
                  <Text style={styles.itemPrice}>
                    ${item.product?.price || 0} each
                  </Text>
                </View>

                <View style={styles.quantityControl}>
                  <TouchableOpacity
                    onPress={() =>
                      handleDecreaseQuantity(item._id, item.quantity)
                    }
                    style={styles.quantityButton}
                  >
                    <Text style={styles.quantityButtonText}>−</Text>
                  </TouchableOpacity>
                  <Text style={styles.quantity}>{item.quantity}</Text>
                  <TouchableOpacity
                    onPress={() =>
                      handleIncreaseQuantity(item._id, item.quantity)
                    }
                    style={styles.quantityButton}
                  >
                    <Text style={styles.quantityButtonText}>+</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.itemTotal}>
                  <Text style={styles.itemTotalPrice}>
                    ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => handleRemoveItem(item._id)}
                  style={styles.removeButton}
                >
                  {/* @ts-ignore */}
                  <Trash2 size={20} color={Colors.danger} strokeWidth={1.5} />
                </TouchableOpacity>
              </View>
            )}
            contentContainerStyle={styles.listContent}
          />

          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal:</Text>
              <Text style={styles.summaryValue}>
                ${totalPrice.toFixed(2)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Items:</Text>
              <Text style={styles.summaryValue}>{totalItems}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalValue}>
                ${totalPrice.toFixed(2)}
              </Text>
            </View>

            <Button
              title="Proceed to Checkout"
              onPress={() => Alert.alert("Info", "Checkout coming soon!")}
              fullWidth
              size="large"
              style={styles.checkoutButton}
            />
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: Spacing.lg,
  },
  emptyTitle: {
    fontSize: FontSizes.xl,
    fontWeight: "700",
    color: Colors.dark,
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
  cartItem: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  itemContent: {
    flex: 2,
  },
  itemName: {
    fontSize: FontSizes.md,
    fontWeight: "600",
    color: Colors.dark,
    marginBottom: Spacing.xs,
  },
  itemPrice: {
    fontSize: FontSizes.sm,
    color: Colors.gray,
  },
  quantityControl: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.bg,
    borderRadius: BorderRadius.md,
    marginHorizontal: Spacing.sm,
  },
  quantityButton: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityButtonText: {
    fontSize: FontSizes.lg,
    fontWeight: "700",
    color: Colors.primary,
  },
  quantity: {
    minWidth: 30,
    textAlign: "center",
    fontSize: FontSizes.md,
    fontWeight: "600",
    color: Colors.dark,
  },
  itemTotal: {
    minWidth: 70,
  },
  itemTotalPrice: {
    fontSize: FontSizes.md,
    fontWeight: "700",
    color: Colors.primary,
    textAlign: "right",
  },
  removeButton: {
    padding: Spacing.sm,
  },
  summary: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Spacing.md,
  },
  summaryLabel: {
    fontSize: FontSizes.md,
    color: Colors.gray,
    fontWeight: "500",
  },
  summaryValue: {
    fontSize: FontSizes.md,
    color: Colors.dark,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.md,
  },
  totalLabel: {
    fontSize: FontSizes.lg,
    color: Colors.dark,
    fontWeight: "700",
  },
  totalValue: {
    fontSize: FontSizes.lg,
    color: Colors.primary,
    fontWeight: "700",
  },
  checkoutButton: {
    marginTop: Spacing.lg,
  },
});
