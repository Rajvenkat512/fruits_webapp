import React, { useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    FlatList,
    ImageBackground,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    NativeSyntheticEvent,
    NativeScrollEvent,
} from "react-native";
import { Colors, Spacing, BorderRadius, FontSizes } from "@/constants/theme";
import { Banner } from "@/services/banner.service";

interface BannerCarouselProps {
    banners: Banner[];
}

const screenWidth = Dimensions.get("window").width;
const GAP = Spacing.md;
const CAROUSEL_WIDTH = screenWidth - Spacing.md * 2;
const SNAP_INTERVAL = CAROUSEL_WIDTH + GAP;
const AUTO_SCROLL_INTERVAL = 4000;

export const BannerCarousel: React.FC<BannerCarouselProps> = ({ banners }) => {
    const [carouselIndex, setCarouselIndex] = useState(0);
    const carouselRef = useRef<FlatList>(null);
    const isInteracting = useRef(false);
    const currentIndexRef = useRef(0);

    useEffect(() => {
        if (!banners || banners.length === 0) return;

        const interval = setInterval(() => {
            if (isInteracting.current) return;

            let nextIndex = currentIndexRef.current + 1;
            if (nextIndex >= banners.length) nextIndex = 0;

            // Use scrollToIndex with explicit view positioning
            try {
                carouselRef.current?.scrollToIndex({
                    index: nextIndex,
                    animated: true,
                    viewPosition: 0,
                });
            } catch (e) {
                // Fallback to offset if scrollToIndex fails
                carouselRef.current?.scrollToOffset({
                    offset: nextIndex * SNAP_INTERVAL,
                    animated: true,
                });
            }

            currentIndexRef.current = nextIndex;
            setCarouselIndex(nextIndex);
        }, AUTO_SCROLL_INTERVAL);

        return () => clearInterval(interval);
    }, [banners]);

    const handleScrollEnd = (ev: NativeSyntheticEvent<NativeScrollEvent>) => {
        const idx = Math.round(
            ev.nativeEvent.contentOffset.x / SNAP_INTERVAL
        );
        // Only update if index changed, prevents flicker
        if (idx !== currentIndexRef.current) {
            setCarouselIndex(idx);
            currentIndexRef.current = idx;
        }
        isInteracting.current = false;
    };

    if (!banners || banners.length === 0) return null;

    return (
        <View style={styles.carouselContainer}>
            <FlatList
                ref={carouselRef}
                data={banners}
                horizontal
                keyExtractor={(item, index) => item._id || index.toString()}
                showsHorizontalScrollIndicator={false}
                pagingEnabled={false}
                snapToInterval={SNAP_INTERVAL}
                decelerationRate="fast"
                snapToAlignment="start" // Align to start of list container
                contentContainerStyle={{
                    paddingHorizontal: Spacing.sm,
                    paddingRight: GAP // Ensure last item has space
                }}
                getItemLayout={(data, index) => ({
                    length: SNAP_INTERVAL,
                    offset: SNAP_INTERVAL * index,
                    index,
                })}
                onScrollToIndexFailed={(info) => {
                    const wait = new Promise((resolve) => setTimeout(resolve, 500));
                    wait.then(() => {
                        carouselRef.current?.scrollToOffset({
                            offset: info.index * SNAP_INTERVAL,
                            animated: true,
                        });
                    });
                }}
                onScrollBeginDrag={() => {
                    isInteracting.current = true;
                }}
                onScrollEndDrag={() => {
                    isInteracting.current = false;
                }}
                onMomentumScrollEnd={handleScrollEnd}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        activeOpacity={0.95}
                        style={[
                            styles.bannerCard,
                            { width: CAROUSEL_WIDTH, marginRight: GAP },
                        ]}
                    >
                        <ImageBackground
                            source={{ uri: item.image || "https://via.placeholder.com/600" }}
                            style={styles.bannerImage}
                            imageStyle={{ borderRadius: BorderRadius.lg }}
                        >
                            <View style={styles.bannerOverlay}>
                                <View style={styles.bannerTextWrap}>
                                    <Text style={styles.bannerTitle} numberOfLines={1}>
                                        {item.title}
                                    </Text>
                                    {item.description && (
                                        <Text style={styles.bannerSubtitle} numberOfLines={1}>
                                            {item.description}
                                        </Text>
                                    )}
                                </View>
                            </View>
                        </ImageBackground>
                    </TouchableOpacity>
                )}
            />

            {/* Indicators */}
            <View style={styles.indicatorContainer}>
                {banners.map((_, i) => (
                    <View
                        key={i}
                        style={[
                            styles.indicatorDot,
                            i === carouselIndex && styles.indicatorDotActive,
                        ]}
                    />
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    carouselContainer: {
        marginTop: Spacing.md,
        alignItems: "center",
    },
    bannerCard: {
        height: 190,
        borderRadius: BorderRadius.md,
        overflow: "hidden",
        backgroundColor: Colors.lightGray,
    },
    bannerImage: {
        width: "100%",
        height: "100%",
        justifyContent: "flex-end",
    },
    bannerOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.35)",
        justifyContent: "flex-end",
    },
    bannerTextWrap: {
        padding: Spacing.md,
    },
    bannerTitle: {
        color: Colors.white,
        fontSize: FontSizes.lg,
        fontWeight: "700",
    },
    bannerSubtitle: {
        color: Colors.white,
        fontSize: FontSizes.md,
        marginTop: Spacing.xs,
    },
    indicatorContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: Spacing.sm,
        marginBottom: Spacing.md,
    },
    indicatorDot: {
        width: 6,
        height: 6,
        backgroundColor: Colors.lightGray,
        borderRadius: 3,
        marginHorizontal: 4,
    },
    indicatorDotActive: {
        backgroundColor: Colors.primary,
        width: 20,
        borderRadius: 3,
    },
});

