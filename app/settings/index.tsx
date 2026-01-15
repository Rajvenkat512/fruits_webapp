
import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Switch, TouchableOpacity, StatusBar, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Header } from '@/components/Header';
import { useTheme } from '@/hooks/useTheme';
import { useThemeStore } from '@/store/theme.store';
import { ChevronRight, Moon, Bell, Shield, Info, LogOut } from 'lucide-react-native';
import { Spacing, BorderRadius, FontSizes, Colors } from '@/constants/theme';
import { useAuthStore } from '@/store/auth.store';

export default function SettingsScreen() {
    const router = useRouter();
    const { colors, isDark } = useTheme();
    const toggleTheme = useThemeStore((state) => state.toggleTheme);
    const logout = useAuthStore((state) => state.logout);

    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

    const handleLogout = () => {
        Alert.alert("Logout", "Are you sure you want to logout?", [
            { text: "Cancel" },
            {
                text: "Logout",
                onPress: async () => {
                    await logout();
                    router.replace("/(auth)/login");
                },
            },
        ]);
    };

    const SettingItem = ({ icon, title, subtitle, rightElement, onPress, isDestructive = false }: any) => (
        <TouchableOpacity
            style={[styles.item, { backgroundColor: colors.white }]}
            onPress={onPress}
            disabled={!onPress}
        >
            <View style={styles.itemLeft}>
                <View style={[styles.iconContainer, { backgroundColor: isDestructive ? '#FFEBEE' : (isDark ? '#333' : '#F5F6FA') }]}>
                    {icon}
                </View>
                <View style={styles.textContainer}>
                    <Text style={[styles.itemTitle, { color: isDestructive ? '#D32F2F' : colors.dark }]}>{title}</Text>
                    {subtitle && <Text style={[styles.itemSubtitle, { color: colors.gray }]}>{subtitle}</Text>}
                </View>
            </View>
            {rightElement || <ChevronRight size={20} color={colors.gray} />}
        </TouchableOpacity>
    );

    const SectionHeader = ({ title }: { title: string }) => (
        <Text style={[styles.sectionHeader, { color: colors.gray }]}>{title}</Text>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
            <View style={[styles.headerContainer, { backgroundColor: colors.bg }]}>
                <Header
                    title="Settings"
                    showBackButton
                    rightAction={handleLogout}
                    rightIcon={<LogOut size={24} color={Colors.white} />}
                />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>

                <SectionHeader title="Preferences" />
                <View style={styles.section}>
                    <SettingItem
                        icon={<Moon size={22} color={colors.primary} />}
                        title="Dark Mode"
                        subtitle="Easier on the eyes"
                        rightElement={
                            <Switch
                                value={isDark}
                                onValueChange={toggleTheme}
                                trackColor={{ false: "#767577", true: colors.primary }}
                                thumbColor={"#f4f3f4"}
                            />
                        }
                    />
                    <SettingItem
                        icon={<Bell size={22} color="#673AB7" />}
                        title="Notifications"
                        subtitle="Push notifications"
                        rightElement={
                            <Switch
                                value={notificationsEnabled}
                                onValueChange={setNotificationsEnabled}
                                trackColor={{ false: "#767577", true: colors.primary }}
                                thumbColor={"#f4f3f4"}
                            />
                        }
                    />
                </View>

                <SectionHeader title="General" />
                <View style={styles.section}>
                    <SettingItem
                        icon={<Shield size={22} color="#2ECC71" />}
                        title="Privacy & Security"
                        onPress={() => Alert.alert("Coming Soon", "Privacy settings are under development.")}
                    />
                    <SettingItem
                        icon={<Info size={22} color="#3498DB" />}
                        title="About"
                        subtitle="Version 1.0.0"
                        onPress={() => Alert.alert("About", "Fruits App v1.0.0\nBuilt with Expo Router")}
                    />
                </View>

                <SectionHeader title="Account" />
                <View style={styles.section}>
                    <SettingItem
                        icon={<LogOut size={22} color="#FF4B4B" />}
                        title="Log Out"
                        isDestructive
                        onPress={handleLogout}
                    />
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
    scrollContent: {
        padding: Spacing.lg,
    },
    section: {
        marginBottom: 24,
        borderRadius: BorderRadius.lg,
        overflow: 'hidden',
    },
    sectionHeader: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
        marginLeft: 4,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    headerContainer: {
        marginBottom: 0,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        marginBottom: 2, // Separator effect
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    textContainer: {
        justifyContent: 'center',
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    itemSubtitle: {
        fontSize: 12,
        marginTop: 2,
    },
});
