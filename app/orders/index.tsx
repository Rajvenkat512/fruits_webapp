import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, ActivityIndicator, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { orderService, OrderResponse } from '@/services/order.service';
import { Header } from '@/components/Header';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import { ChevronRight, Package } from 'lucide-react-native';

import { useTheme } from '@/hooks/useTheme';

export default function OrderHistoryScreen() {
    const router = useRouter();
    const { colors, isDark } = useTheme();
    const [orders, setOrders] = useState<OrderResponse[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const data = await orderService.getOrders();
            // Sort by date desc
            const sorted = data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            setOrders(sorted);
        } catch (error) {
            console.error(error);
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

    const renderItem = ({ item }: { item: OrderResponse }) => (
        <TouchableOpacity
            style={[styles.orderCard, { backgroundColor: colors.white }]}
            onPress={() => router.push(`/orders/${item.id}`)}
        >
            <View style={[styles.iconContainer, { backgroundColor: isDark ? '#333' : '#FFF0E6' }]}>
                <Package size={24} color={Colors.primary} />
            </View>
            <View style={styles.orderInfo}>
                <View style={styles.row}>
                    <Text style={[styles.orderId, { color: colors.dark }]}>Order #{item.id.substring(0, 8)}</Text>
                    <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>{item.status}</Text>
                </View>
                <Text style={[styles.orderDate, { color: colors.gray }]}>{new Date(item.createdAt).toLocaleDateString()} • {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                <Text style={styles.orderTotal}>Total: ${item.total}</Text>
            </View>
            <ChevronRight size={20} color={isDark ? "#555" : "#CCC"} />
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.bg }]}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
            <View style={[styles.headerContainer, { backgroundColor: colors.bg }]}>
                <Header title="My Orders" showBackButton />
            </View>

            {loading ? (
                <View style={styles.center}><ActivityIndicator size="large" color={Colors.primary} /></View>
            ) : (
                <FlatList
                    data={orders}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Package size={64} color="#DDD" />
                            <Text style={[styles.emptyText, { color: colors.gray }]}>No orders yet</Text>
                            <TouchableOpacity style={styles.shopButton} onPress={() => router.replace("/(tabs)")}>
                                <Text style={styles.shopButtonText}>Start Shopping</Text>
                            </TouchableOpacity>
                        </View>
                    }
                />
            )}
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
        // marginBottom: Spacing.sm,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        padding: Spacing.lg,
    },
    orderCard: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#FFF0E6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    orderInfo: {
        flex: 1,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
        paddingRight: 10,
    },
    orderId: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.dark,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    orderDate: {
        fontSize: 13,
        color: Colors.gray,
        marginBottom: 4,
    },
    orderTotal: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.primary,
    },
    emptyContainer: {
        paddingTop: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        marginTop: 20,
        fontSize: 18,
        color: Colors.gray,
        fontWeight: '500',
    },
    shopButton: {
        marginTop: 30,
        backgroundColor: Colors.primary,
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 30,
    },
    shopButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    }
});
