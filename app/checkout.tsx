import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Image,
    Alert,
    StatusBar,
    Platform,
    Modal,
} from "react-native";
import {
    CreditCard,
    Smartphone, // Apple placeholder
    Plus,
    MapPin,
    ChevronRight,
    CheckCircle,
    Circle,
    MoreVertical,
} from "lucide-react-native";
import { Header } from "@/components/Header";
import { Colors, Spacing } from "@/constants/theme";
import { useRouter } from "expo-router";
import { useCartStore } from "@/store/cart.store";
import { orderService, ShippingAddress } from "@/services/order.service";

// Mock Data
const PAYMENT_METHODS = [
    { id: "CASH_ON_DELIVERY", type: "Cash on Delivery", icon: "cash" },
    { id: "CARD", type: "Master Card", number: "**** **** **** 8463", icon: "mastercard" },
    { id: "PAYPAL", type: "Paypal", email: "orb*****@gmail.com", icon: "paypal" },
];

export default function CheckoutScreen() {
    const router = useRouter();
    const [selectedPayment, setSelectedPayment] = useState("CASH_ON_DELIVERY");
    const [isProcessing, setIsProcessing] = useState(false);

    const { getTotalPrice, items: cartItems } = useCartStore();

    // Default shipping address from requirement
    const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
        name: "raj",
        street: "Ramalayam street",
        city: "Diwancheruvu",
        state: "AP",
        zip: "533296",
        country: "india",
        phone: "1234567890"
    });

    const [isAddressModalVisible, setIsAddressModalVisible] = useState(false);
    const [tempAddress, setTempAddress] = useState<ShippingAddress>(shippingAddress);

    const subtotal = getTotalPrice();
    const delivery = 6.00;
    const tax = 2.00;
    const promo = 2.20; // Hardcoded for "SUMMER50" example
    const total = subtotal + delivery + tax - promo;

    const handlePay = async () => {
        if (cartItems.length === 0) {
            Alert.alert("Error", "Your cart is empty");
            return;
        }

        try {
            setIsProcessing(true);
            const orderItems = cartItems.map(item => ({
                productId: item.productId,
                quantity: item.quantity
            }));

            const payload = {
                items: orderItems,
                shippingAddress,
                paymentMethod: selectedPayment,
                code: "SUMMER50"
            };

            console.log("Creating order with payload:", JSON.stringify(payload, null, 2));

            const response = await orderService.createOrder(payload);
            console.log("Order created:", response);

            Alert.alert(
                "Success",
                `Order Placed Successfully!`,
                [
                    {
                        text: "View Order",
                        onPress: () => {
                            useCartStore.getState().fetchCart(); // Refresh cart (should be empty now on backend)
                            router.replace(`/orders/${response.id}`);
                        }
                    }
                ]
            );

        } catch (error: any) {
            console.error("Order creation failed:", error);
            const errorMessage = error.response?.data?.message || error.response?.data?.error || "Failed to place order";
            Alert.alert("Error", errorMessage);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleSaveAddress = () => {
        setShippingAddress(tempAddress);
        setIsAddressModalVisible(false);
    };

    const renderPaymentIcon = (type: string) => {
        switch (type) {
            case "mastercard":
                return (
                    <View style={[styles.iconContainer, { backgroundColor: "#FFF5E5" }]}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: '#EB001B' }} />
                            <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: '#F79E1B', marginLeft: -4 }} />
                        </View>
                    </View>
                );
            case "paypal":
                return (
                    <View style={[styles.iconContainer, { backgroundColor: "#E5F1FF" }]}>
                        <Text style={{ fontWeight: '900', color: '#003087', fontSize: 12 }}>P</Text>
                    </View>
                );
            case "cash":
                return (
                    <View style={[styles.iconContainer, { backgroundColor: "#E5FFEA" }]}>
                        <Text style={{ fontWeight: '900', color: '#008730', fontSize: 12 }}>$</Text>
                    </View>
                );
            case "apple":
                return (
                    <View style={[styles.iconContainer, { backgroundColor: "#F5F5F5" }]}>
                        <Smartphone size={16} color="black" />
                    </View>
                );
            default:
                return <CreditCard size={20} color={Colors.dark} />;
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.bg} />
            <Header
                title="Checkout"
                showBackButton
                rightIcon={<MoreVertical size={24} color={Colors.dark} />}
                rightAction={() => { }}
            />

            <ScrollView contentContainerStyle={styles.scrollContent}>

                {/* Payment Methods */}
                <View style={styles.sectionCard}>
                    {PAYMENT_METHODS.map((method) => (
                        <TouchableOpacity
                            key={method.id}
                            style={styles.paymentRow}
                            onPress={() => setSelectedPayment(method.id)}
                        >
                            <View style={styles.paymentLeft}>
                                {renderPaymentIcon(method.icon)}
                                <View style={styles.paymentInfo}>
                                    <Text style={styles.paymentType}>{method.type}</Text>
                                    {method.number && <Text style={styles.paymentDetail}>{method.number}</Text>}
                                    {method.email && <Text style={styles.paymentDetail}>{method.email}</Text>}
                                </View>
                            </View>

                            {selectedPayment === method.id ? (
                                <CheckCircle size={22} color="white" fill={Colors.primary} />
                            ) : (
                                <Circle size={22} color="#E0E0E0" />
                            )}
                        </TouchableOpacity>
                    ))}

                    <TouchableOpacity style={styles.addPaymentButton}>
                        <Plus size={18} color={Colors.dark} />
                        <Text style={styles.addPaymentText}>Add Payment Method</Text>
                    </TouchableOpacity>
                </View>

                {/* Delivery Address */}
                <View style={styles.sectionHeaderRow}>
                    <Text style={styles.sectionTitle}>Delivery Address</Text>
                    <TouchableOpacity onPress={() => {
                        setTempAddress(shippingAddress);
                        setIsAddressModalVisible(true);
                    }}>
                        <Text style={styles.changeText}>Change</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.addressCard}>
                    <View style={styles.addressLeft}>
                        <View style={styles.mapIconContainer}>
                            <MapPin size={20} color={Colors.dark} />
                        </View>
                        <View>
                            <Text style={styles.addressLine1}>{shippingAddress.street}, {shippingAddress.city}</Text>
                            <Text style={styles.addressLine2}>{shippingAddress.state}, {shippingAddress.country} - {shippingAddress.zip}</Text>
                        </View>
                    </View>
                </TouchableOpacity>

                {/* Order Summary */}
                <Text style={styles.sectionTitle}>Order Summary</Text>
                <View style={styles.summaryCard}>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Order Amount</Text>
                        <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Promo-code</Text>
                        <Text style={styles.summaryValue}>-${promo.toFixed(2)}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Delivery</Text>
                        <Text style={styles.summaryValue}>${delivery.toFixed(2)}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Tax</Text>
                        <Text style={styles.summaryValue}>${tax.toFixed(2)}</Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.summaryRow}>
                        <Text style={styles.totalLabel}>Total Amount</Text>
                        <Text style={styles.totalValue}>
                            <Text style={{ color: '#FF7D56', fontSize: 16 }}>$ </Text>
                            {total.toFixed(2)}
                        </Text>
                    </View>
                </View>

            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.payButton, isProcessing && { opacity: 0.7 }]}
                    onPress={handlePay}
                    disabled={isProcessing}
                >
                    <Text style={styles.payButtonText}>
                        {isProcessing ? "Processing..." : selectedPayment === "CASH_ON_DELIVERY" ? "Place Order - Cash on Delivery" : "Pay Now"}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Address Edit Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isAddressModalVisible}
                onRequestClose={() => setIsAddressModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Edit Delivery Address</Text>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <TextInput
                                style={styles.input}
                                placeholder="Full Name"
                                value={tempAddress.name}
                                onChangeText={(text) => setTempAddress({ ...tempAddress, name: text })}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Street Address"
                                value={tempAddress.street}
                                onChangeText={(text) => setTempAddress({ ...tempAddress, street: text })}
                            />
                            <View style={styles.row}>
                                <TextInput
                                    style={[styles.input, { flex: 1, marginRight: 10 }]}
                                    placeholder="City"
                                    value={tempAddress.city}
                                    onChangeText={(text) => setTempAddress({ ...tempAddress, city: text })}
                                />
                                <TextInput
                                    style={[styles.input, { flex: 1 }]}
                                    placeholder="State"
                                    value={tempAddress.state}
                                    onChangeText={(text) => setTempAddress({ ...tempAddress, state: text })}
                                />
                            </View>
                            <View style={styles.row}>
                                <TextInput
                                    style={[styles.input, { flex: 1, marginRight: 10 }]}
                                    placeholder="Zip Code"
                                    value={tempAddress.zip}
                                    onChangeText={(text) => setTempAddress({ ...tempAddress, zip: text })}
                                    keyboardType="numeric"
                                />
                                <TextInput
                                    style={[styles.input, { flex: 1 }]}
                                    placeholder="Country"
                                    value={tempAddress.country}
                                    onChangeText={(text) => setTempAddress({ ...tempAddress, country: text })}
                                />
                            </View>
                            <TextInput
                                style={styles.input}
                                placeholder="Phone Number"
                                value={tempAddress.phone}
                                onChangeText={(text) => setTempAddress({ ...tempAddress, phone: text })}
                                keyboardType="phone-pad"
                            />

                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.cancelButton]}
                                    onPress={() => setIsAddressModalVisible(false)}
                                >
                                    <Text style={styles.cancelButtonText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.saveButton]}
                                    onPress={handleSaveAddress}
                                >
                                    <Text style={styles.saveButtonText}>Save Address</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F6FA",
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
    scrollContent: {
        padding: Spacing.lg,
        paddingBottom: 100,
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 10,
        paddingRight: 4,
    },
    changeText: {
        color: '#FF7D56',
        fontWeight: '600',
        fontSize: 14,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: Colors.dark,
        marginLeft: 4,
    },
    sectionCard: {
        backgroundColor: Colors.white,
        borderRadius: 20,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    paymentRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    paymentLeft: {
        flexDirection: "row",
        alignItems: "center",
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 15,
    },
    paymentInfo: {
        justifyContent: "center",
    },
    paymentType: {
        fontSize: 14,
        fontWeight: "600",
        color: Colors.dark,
    },
    paymentDetail: {
        fontSize: 12,
        color: Colors.gray,
        marginTop: 2,
    },
    addPaymentButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F8F9FA",
        paddingVertical: 15,
        borderRadius: 12,
        marginTop: 5,
    },
    addPaymentText: {
        marginLeft: 8,
        fontWeight: "600",
        color: Colors.dark,
        fontSize: 14,
    },
    addressCard: {
        backgroundColor: Colors.white,
        borderRadius: 20,
        padding: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    addressLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    mapIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#FAFAFA',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
        borderWidth: 1,
        borderColor: '#EEE',
    },
    addressLine1: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.dark,
    },
    addressLine2: {
        fontSize: 12,
        color: Colors.gray,
        marginTop: 2,
    },
    summaryCard: {
        backgroundColor: Colors.white,
        borderRadius: 24,
        padding: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
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
    divider: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginVertical: 15,
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: '#F0F0F0',
        borderRadius: 1,
    },
    totalLabel: {
        fontSize: 16,
        color: Colors.dark,
        fontWeight: '600',
    },
    totalValue: {
        fontSize: 22,
        color: Colors.dark,
        fontWeight: '700',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'transparent',
        padding: Spacing.lg,
    },
    payButton: {
        backgroundColor: '#1A1A1A',
        borderRadius: 16,
        paddingVertical: 18,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5,
    },
    payButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
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
    input: {
        backgroundColor: '#F5F6FA',
        padding: 15,
        borderRadius: 12,
        marginBottom: 15,
        fontSize: 14,
        color: Colors.dark,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 0,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        marginBottom: 20,
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
});
