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
} from "lucide-react-native";
import { Header } from "@/components/Header";
import { useAuthStore } from "@/store/auth.store";
import { useUserStore } from "@/store/user.store";
import { Colors, Spacing, FontSizes, BorderRadius } from "@/constants/theme";
import { useRouter } from "expo-router";

export default function ProfileScreen() {
  const router = useRouter();
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
      title: "Order History",
      subtitle: "Order information",
      icon: <ClipboardList size={22} color={Colors.dark} />,
      onPress: () => router.push("/orders"),
    },
    {
      id: "address",
      title: "Delivery Addresses",
      subtitle: "Your delivery location",
      icon: <MapPin size={22} color={Colors.dark} />,
      onPress: () => Alert.alert("Info", "Address management coming soon"),
    },
    {
      id: "wishlist",
      title: "My Wishlist",
      subtitle: "Your saved items",
      icon: <Heart size={22} color={Colors.dark} />,
      onPress: () => router.push("/(tabs)/watchlist"),
    },
    {
      id: "feedback",
      title: "Feedback",
      subtitle: "Give us your feedback",
      icon: <MessageSquare size={22} color={Colors.dark} />,
      onPress: () => Alert.alert("Info", "Feedback form coming soon"),
    },
    {
      id: "logout",
      title: "Log Out",
      subtitle: "Sign out of your account",
      icon: <LogOut size={22} color="#FF4B4B" />,
      onPress: handleLogout,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
      <Header
        title="Profile"
        showBackButton={false}
        rightIcon={<LogOut size={24} color={Colors.dark} />}
        rightAction={handleLogout}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Header */}
        <View style={styles.headerSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: "https://i.pravatar.cc/300?img=12" }}
              style={styles.avatar}
            />
          </View>
          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.email}>{displayEmail}</Text>

          <TouchableOpacity
            style={styles.editButton}
            onPress={() => Alert.alert("Info", "Edit profile coming soon")}
          >
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <View style={styles.iconContainer}>{item.icon}</View>
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>
              <ChevronRight size={20} color="#CCC" />
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
    backgroundColor: Colors.white,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  headerSection: {
    alignItems: "center",
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#F0F0F0",
    marginBottom: 15,
    overflow: "hidden",
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.dark,
    marginBottom: 5,
  },
  email: {
    fontSize: 14,
    color: Colors.gray,
    marginBottom: 20,
  },
  editButton: {
    backgroundColor: "#FACC15", // Yellow color from mockup
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    shadowColor: "#FACC15",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  editButtonText: {
    fontWeight: "700",
    color: Colors.dark,
    fontSize: 14,
  },
  menuSection: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB", // Light gray card bg
    borderRadius: 16,
    padding: 16,
    marginBottom: 15,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FEF9C3", // Light yellow icon bg
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.dark,
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 12,
    color: Colors.gray,
  },
});
