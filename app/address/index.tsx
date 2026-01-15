import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator, Alert, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Header } from '@/components/Header';
import { useUserStore } from '@/store/user.store';
import { styles } from './styles';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';

export default function AddressScreen() {
    const router = useRouter();
    const { colors, isDark } = useTheme();
    const { profile, updateProfile, isLoading, error } = useUserStore();

    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipCode, setZipCode] = useState('');

    useEffect(() => {
        if (profile) {
            setAddress(profile.address || '');
            setCity(profile.city || '');
            setState(profile.state || '');
            setZipCode(profile.zipCode || '');
        }
    }, [profile]);

    const handleSave = async () => {
        if (!address || !city || !state || !zipCode) {
            Alert.alert('Missing Fields', 'Please fill in all address fields');
            return;
        }

        try {
            await updateProfile({
                address,
                city,
                state,
                zipCode
            });

            Alert.alert('Success', 'Your delivery details have been saved.', [
                { text: 'OK', onPress: () => router.back() }
            ]);

        } catch (err) {
            console.error("Failed to update address", err);
            Alert.alert('Error', 'Could not save address details.');
        }
    };

    const inputStyle = [styles.input, {
        backgroundColor: isDark ? '#333' : '#F5F6FA',
        color: colors.dark,
        borderColor: isDark ? '#444' : 'transparent',
    }];
    const placeholderColor = isDark ? '#888' : '#999';

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.bg} />
            <Header title="Delivery Address" showBackButton />
            <ScrollView contentContainerStyle={styles.scrollContent}>

                <View style={styles.formGroup}>
                    <Text style={[styles.label, { color: colors.dark }]}>Street Address</Text>
                    <TextInput
                        style={inputStyle}
                        value={address}
                        onChangeText={setAddress}
                        placeholder="123 Main St"
                        placeholderTextColor={placeholderColor}
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={[styles.label, { color: colors.dark }]}>City</Text>
                    <TextInput
                        style={inputStyle}
                        value={city}
                        onChangeText={setCity}
                        placeholder="New York"
                        placeholderTextColor={placeholderColor}
                    />
                </View>

                <View style={styles.row}>
                    <View style={[styles.formGroup, styles.halfInput]}>
                        <Text style={[styles.label, { color: colors.dark }]}>State</Text>
                        <TextInput
                            style={inputStyle}
                            value={state}
                            onChangeText={setState}
                            placeholder="NY"
                            placeholderTextColor={placeholderColor}
                        />
                    </View>

                    <View style={[styles.formGroup, styles.halfInput]}>
                        <Text style={[styles.label, { color: colors.dark }]}>Zip Code</Text>
                        <TextInput
                            style={inputStyle}
                            value={zipCode}
                            onChangeText={setZipCode}
                            placeholder="10001"
                            keyboardType="numeric"
                            placeholderTextColor={placeholderColor}
                        />
                    </View>
                </View>

                <TouchableOpacity
                    style={[styles.saveButton, isLoading && styles.disabledButton]}
                    onPress={handleSave}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={styles.saveButtonText}>Save Address</Text>
                    )}
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
}
