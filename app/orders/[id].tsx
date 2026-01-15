
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, ActivityIndicator, Image, StatusBar, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { orderService, OrderDetail } from '@/services/order.service';
import { Header } from '@/components/Header';
import { Colors, Spacing, BorderRadius, FontSizes } from '@/constants/theme';
import { MapPin, Calendar, CreditCard, Package, Truck, CheckCircle, Clock, XCircle } from 'lucide-react-native';

import { useTheme } from '@/hooks/useTheme';

export default function OrderDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { colors, isDark } = useTheme();
    const [order, setOrder] = useState<OrderDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            fetchOrderDetails();
        }
    }, [id]);

    const fetchOrderDetails = async () => {
        try {
            setLoading(true);
            const data = await orderService.getOrder(id);
            setOrder(data);
        } catch (err) {
            console.error(err);
            setError("Failed to load order details");
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status?.toUpperCase()) {
            case 'DELIVERED': return '#4CAF50';
            case 'PENDING': return '#FF9800';
            case 'PROCESSING': return '#2196F3';
            case 'CANCELLED': return '#F44336';
            default: return colors.gray;
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status?.toUpperCase()) {
            case 'DELIVERED': return <CheckCircle size={20} color="#4CAF50" />;
            case 'PENDING': return <Clock size={20} color="#FF9800" />;
            case 'PROCESSING': return <Package size={20} color="#2196F3" />;
            case 'CANCELLED': return <XCircle size={20} color="#F44336" />;
            default: return <Package size={20} color={colors.gray} />;
        }
    };

    if (loading) {
        return (
            <View style={[styles.container, { backgroundColor: colors.bg }]}>
                <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
                <View style={[styles.headerContainer, { backgroundColor: colors.bg }]}>
                    <Header title="Order Details" showBackButton />
                </View>
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                </View>
            </View>
        );
    }

    if (error || !order) {
        return (
            <View style={[styles.container, { backgroundColor: colors.bg }]}>
                <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
                <View style={[styles.headerContainer, { backgroundColor: colors.bg }]}>
                    <Header title="Order Details" showBackButton />
                </View>
                <View style={styles.center}>
                    <Text style={[styles.errorText, { color: colors.danger }]}>{error || "Order not found"}</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.bg }]}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
            <View style={[styles.headerContainer, { backgroundColor: colors.bg }]}>
                <Header title={`Order #${order.id.substring(0, 8)}`} showBackButton />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Status Card */}
                <View style={[styles.card, { backgroundColor: colors.white }]}>
                    <View style={styles.statusHeader}>
                        <Text style={[styles.statusLabel, { color: colors.dark }]}>Status</Text>
                        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) + '20' }]}>
                            {getStatusIcon(order.status)}
                            <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>{order.status}</Text>
                        </View>
                    </View>
                    <View style={styles.dateRow}>
                        <Calendar size={16} color={colors.gray} />
                        <Text style={[styles.dateText, { color: colors.gray }]}>
                            Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                    </View>
                </View>

                {/* Shipping Address */}
                <View style={[styles.card, { backgroundColor: colors.white }]}>
                    <View style={[styles.cardHeader, { borderBottomColor: isDark ? '#333' : '#F0F0F0' }]}>
                        <MapPin size={20} color={Colors.primary} />
                        <Text style={[styles.cardTitle, { color: colors.dark }]}>Shipping Address</Text>
                    </View>
                    {order.shippingAddress && order.shippingAddress.length > 0 ? (
                        <View style={styles.addressContainer}>
                            <Text style={[styles.addressName, { color: colors.dark }]}>{order.shippingAddress[0].name}</Text>
                            <Text style={[styles.addressText, { color: colors.gray }]}>{order.shippingAddress[0].street}</Text>
                            <Text style={[styles.addressText, { color: colors.gray }]}>
                                {order.shippingAddress[0].city}, {order.shippingAddress[0].state} {order.shippingAddress[0].zip}
                            </Text>
                            <Text style={[styles.addressText, { color: colors.gray }]}>{order.shippingAddress[0].country}</Text>
                            <Text style={[styles.addressText, { color: colors.gray }]}>{order.shippingAddress[0].phone}</Text>
                        </View>
                    ) : (
                        <Text style={[styles.emptyText, { color: colors.gray }]}>No shipping address</Text>
                    )}
                </View>

                {/* Order Items */}
                <View style={[styles.card, { backgroundColor: colors.white }]}>
                    <View style={[styles.cardHeader, { borderBottomColor: isDark ? '#333' : '#F0F0F0' }]}>
                        <Package size={20} color={Colors.primary} />
                        <Text style={[styles.cardTitle, { color: colors.dark }]}>Items ({order.items.length})</Text>
                    </View>
                    {order.items.map((item, index) => (
                        <View key={item.id} style={[styles.itemRow, index === order.items.length - 1 && styles.lastItem]}>
                            <Image source={{ uri: item.product.image }} style={styles.itemImage} />
                            <View style={styles.itemInfo}>
                                <Text style={[styles.itemName, { color: colors.dark }]} numberOfLines={2}>{item.product.name}</Text>
                                <Text style={[styles.itemQuantity, { color: colors.gray }]}>Qty: {item.quantity}</Text>
                            </View>
                            <Text style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
                        </View>
                    ))}
                </View>

                {/* Order Summary */}
                <View style={[styles.card, { backgroundColor: colors.white }]}>
                    <View style={[styles.cardHeader, { borderBottomColor: isDark ? '#333' : '#F0F0F0' }]}>
                        <CreditCard size={20} color={Colors.primary} />
                        <Text style={[styles.cardTitle, { color: colors.dark }]}>Payment Summary</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={[styles.summaryLabel, { color: colors.gray }]}>Subtotal</Text>
                        <Text style={[styles.summaryValue, { color: colors.dark }]}>${order.total.toFixed(2)}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={[styles.summaryLabel, { color: colors.gray }]}>Shipping</Text>
                        <Text style={[styles.summaryValue, { color: colors.dark }]}>Free</Text>
                    </View>
                    <View style={[styles.summaryRow, styles.totalRow, { borderTopColor: isDark ? '#333' : '#F0F0F0' }]}>
                        <Text style={[styles.totalLabel, { color: colors.dark }]}>Total</Text>
                        <Text style={styles.totalValue}>${order.total.toFixed(2)}</Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F6FA",
        // paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
    headerContainer: {
        // 
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        padding: Spacing.lg,
        paddingBottom: 40,
    },
    card: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    statusHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    statusLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.dark,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
    },
    statusText: {
        marginLeft: 6,
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateText: {
        marginLeft: 8,
        color: Colors.gray,
        fontSize: 14,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        paddingBottom: 12,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.dark,
        marginLeft: 10,
    },
    addressContainer: {
        marginLeft: 30,
    },
    addressName: {
        fontSize: 15,
        fontWeight: '600',
        color: Colors.dark,
        marginBottom: 4,
    },
    addressText: {
        fontSize: 14,
        color: Colors.gray,
        lineHeight: 20,
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    lastItem: {
        marginBottom: 0,
    },
    itemImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
        backgroundColor: '#F5F5F5',
    },
    itemInfo: {
        flex: 1,
        marginLeft: 12,
    },
    itemName: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.dark,
        marginBottom: 4,
    },
    itemQuantity: {
        fontSize: 13,
        color: Colors.gray,
    },
    itemPrice: {
        fontSize: 15,
        fontWeight: 'bold',
        color: Colors.primary,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    summaryLabel: {
        fontSize: 14,
        color: Colors.gray,
    },
    summaryValue: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.dark,
    },
    totalRow: {
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        marginBottom: 0,
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.dark,
    },
    totalValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.primary,
    },
    errorText: {
        fontSize: 16,
        color: '#F44336',
    },
    emptyText: {
        marginLeft: 30,
        color: Colors.gray,
        fontStyle: 'italic',
    }
});
