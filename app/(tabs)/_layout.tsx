import React from "react";
import { Tabs } from "expo-router";
import {
  Home,
  ShoppingCart,
  Heart,
  User,
} from "lucide-react-native";
import { Colors } from "@/constants/theme";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.gray,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
        },
        headerShown: false,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <>
              {/* @ts-ignore */}
              <Home color={color} size={size} strokeWidth={1.5} />
            </>
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ color, size }) => (
            <>
              {/* @ts-ignore */}
              <ShoppingCart color={color} size={size} strokeWidth={1.5} />
            </>
          ),
        }}
      />
      <Tabs.Screen
        name="watchlist"
        options={{
          title: "Wishlist",
          tabBarIcon: ({ color, size }) => (
            <>
              {/* @ts-ignore */}
              <Heart color={color} size={size} strokeWidth={1.5} />
            </>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <>
              {/* @ts-ignore */}
              <User color={color} size={size} strokeWidth={1.5} />
            </>
          ),
        }}
      />
    </Tabs>
  );
}
