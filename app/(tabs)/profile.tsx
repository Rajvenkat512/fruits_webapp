import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  StatusBar,
  Platform,
} from "react-native";
import {
  LogOut,
  ChevronRight,
  ClipboardList,
  MapPin,
  Heart,
  MessageSquare,
  User,
  Bell,
  HelpCircle,
  Settings,
} from "lucide-react-native";
import { Header } from "@/components/Header";
import { useAuthStore } from "@/store/auth.store";
import { useUserStore } from "@/store/user.store";
import { useTheme } from "@/hooks/useTheme";
import { Colors, Spacing, FontSizes, BorderRadius } from "@/constants/theme";
import { useRouter } from "expo-router";

export default function ProfileScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const profile = useUserStore((state) => state.profile);
  const fetchProfile = useUserStore((state) => state.fetchProfile);

  useEffect(() => {
    fetchProfile();
  }, []);

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

  const displayName = profile?.name || user?.name || "Muhammad Ali";
  const displayEmail = profile?.email || user?.email || "muhammad04@gmail.com";

  // Menu items config
  const menuItems = [
    {
      id: "orders",
      title: "Orders",
      subtitle: "Review history",
      icon: <ClipboardList size={22} color={colors.primary} />,
      onPress: () => router.push("/orders"),
      fullWidth: false,
    },
    {
      id: "wishlist",
      title: "Wishlist",
      subtitle: "Saved items",
      icon: <Heart size={22} color="#E91E63" />,
      onPress: () => router.push("/(tabs)/watchlist"),
      fullWidth: false,
    },
    {
      id: "address",
      title: "Delivery Address",
      subtitle: "Shipping details",
      icon: <MapPin size={22} color="#FF9800" />,
      onPress: () => router.push("/address"),
      fullWidth: true,
    },
    {
      id: "notifications",
      title: "Notifications",
      subtitle: "Offers & updates",
      icon: <Bell size={22} color="#673AB7" />,
      onPress: () => Alert.alert("Info", "Notifications coming soon"),
      fullWidth: false,
    },
    {
      id: "faq",
      title: "FAQ",
      subtitle: "Questions & Help",
      icon: <HelpCircle size={22} color="#00BCD4" />,
      onPress: () => Alert.alert("Info", "FAQ coming soon"),
      fullWidth: false,
    },
    {
      id: "settings",
      title: "Settings",
      subtitle: "App preferences",
      icon: <Settings size={22} color="#607D8B" />,
      onPress: () => router.push("/settings"),
      fullWidth: true,
    },
    {
      id: "logout",
      title: "Log Out",
      subtitle: "Sign out",
      icon: <LogOut size={22} color="#FF4B4B" />,
      onPress: handleLogout,
      fullWidth: true,
      isDestructive: true,
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      {/* Normalized Header for Profile */}
      <View style={[styles.headerContainer, { backgroundColor: colors.bg }]}>
        <Header
          title="Profile"
          showBackButton={false}
          rightAction={handleLogout}
          rightIcon={<LogOut size={24} color={Colors.white} />}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={[styles.profileCard, { backgroundColor: colors.white }]}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4jTt2IcW5cm2-X4hpL_aTQ_cLqBOBj2RyAg&s" }}
              style={[styles.avatar, { borderColor: isDark ? '#333' : '#F0F0F0' }]}
            />
            <TouchableOpacity style={[styles.editIconBtn, { backgroundColor: colors.primary }]}>
              <Text style={styles.editIconText}>✎</Text>
            </TouchableOpacity>
          </View>
          <Text style={[styles.name, { color: colors.dark }]}>{displayName}</Text>
          <Text style={[styles.email, { color: colors.gray }]}>{displayEmail}</Text>
        </View>

        {/* Grid Menu */}
        <View style={styles.gridContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.gridItem,
                item.fullWidth ? styles.fullWidthItem : styles.halfWidthItem,
                item.isDestructive ? styles.destructiveItem : null,
                { backgroundColor: colors.white }
              ]}
              onPress={item.onPress}
            >
              <View style={[
                styles.iconContainer,
                { backgroundColor: item.isDestructive ? '#FFEBEE' : (isDark ? '#333' : '#F5F6FA') },
                !item.fullWidth && { marginBottom: 12 }
              ]}>
                {item.icon}
              </View>
              <View style={styles.itemTextContainer}>
                <Text style={[styles.itemTitle, { color: item.isDestructive ? '#D32F2F' : colors.dark }]}>{item.title}</Text>
                <Text style={[styles.itemSubtitle, { color: colors.gray }]}>{item.subtitle}</Text>
              </View>
              <ChevronRight size={18} color={isDark ? "#555" : "#DDD"} style={styles.chevron} />
            </TouchableOpacity>
          ))}
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
  headerContainer: {
    // marginBottom: 0,
  },
  // header: { ... } removed old header styles
  unusedHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  logoutIconBtn: {
    position: 'absolute',
    right: 20,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  profileCard: {
    alignItems: "center",
    paddingVertical: 30,
    marginBottom: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
    position: 'relative',
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
    borderWidth: 3,
  },
  editIconBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#007AFF', // Assuming a default primary color for the edit button
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  editIconText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: -2,
  },
  name: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 5,
  },
  email: {
    fontSize: 14,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 15,
    justifyContent: 'space-between',
  },
  gridItem: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  halfWidthItem: {
    width: '48%', // Approx half
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingVertical: 20,
  },
  fullWidthItem: {
    width: '100%',
  },
  destructiveItem: {
    borderWidth: 1,
    borderColor: '#FFEBEE',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 0, // Reset for full width
  },
  // Adjust icon margin for half-width items
  halfWidthItemIcon: {
    marginBottom: 12,
  },
  itemTextContainer: {
    flex: 1,
    marginLeft: 12, // For full width
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 2,
  },
  itemSubtitle: {
    fontSize: 12,
  },
  destructiveText: {
    color: '#D32F2F',
  },
  chevron: {
    marginLeft: 'auto',
  }
});
