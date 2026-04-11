import { appTheme } from '@/constants/app-theme'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import { Button, Chip } from 'heroui-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Dimensions, NativeScrollEvent, NativeSyntheticEvent, Pressable, ScrollView, Text, View } from 'react-native'
import { Bookmark, ClapperboardPlay, Play } from 'react-native-solar-icons/icons/bold'
import { useUniwind } from 'uniwind'
import { type FeaturedAnime } from '../data/home-dummy-data'

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const SLIDE_MARGIN = 0
const SLIDE_WIDTH = SCREEN_WIDTH - SLIDE_MARGIN * 2

type Props = {
    items: FeaturedAnime[]
}

export function HeroBanner({ items }: Props) {
    const router = useRouter();
    const { theme } = useUniwind();
    const isDark = theme === 'dark';
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollRef = useRef<ScrollView>(null);

    const accentColor = isDark ? appTheme.colors.dark.primary : appTheme.colors.light.primary;
    const isUserScrolling = useRef(false);
    const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const scrollToIndex = useCallback((index: number) => {
        scrollRef.current?.scrollTo({ x: index * SLIDE_WIDTH, animated: true });
        setActiveIndex(index);
    }, []);

    const startAutoPlay = useCallback(() => {
        if (autoPlayRef.current) clearInterval(autoPlayRef.current);
        autoPlayRef.current = setInterval(() => {
            if (!isUserScrolling.current) {
                setActiveIndex(prev => {
                    const next = (prev + 1) % items.length;
                    scrollRef.current?.scrollTo({ x: next * SLIDE_WIDTH, animated: true });
                    return next;
                });
            }
        }, 3500);
    }, [items.length]);

    useEffect(() => {
        startAutoPlay();
        return () => {
            if (autoPlayRef.current) clearInterval(autoPlayRef.current);
        };
    }, [startAutoPlay]);

    const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const x = e.nativeEvent.contentOffset.x;
        const index = Math.round(x / SLIDE_WIDTH);
        setActiveIndex(index);
    };

    const handleScrollBegin = () => {
        isUserScrolling.current = true;
        if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };

    const handleScrollEnd = () => {
        isUserScrolling.current = false;
        startAutoPlay();
    };

    return (
        <View className="">
            <ScrollView
                ref={scrollRef}
                horizontal
                pagingEnabled
                snapToInterval={SLIDE_WIDTH}
                decelerationRate="fast"
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: SLIDE_MARGIN }}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                onScrollBeginDrag={handleScrollBegin}
                onMomentumScrollEnd={handleScrollEnd}
            >
                {items.map((anime, index) => (
                    <View
                        key={anime.id}
                        style={{
                            width: SLIDE_WIDTH,
                            marginRight: index < items.length - 1 ? 0 : 0,
                        }}
                    >
                        <Pressable
                            className="overflow-hidden"
                            onPress={() => router.push(`/anime/${anime.id}`)}
                            style={{ height: 300 }}
                        >
                            <Image
                                source={{ uri: anime.cover }}
                                style={{ width: '100%', height: '100%' }}
                                contentFit="cover"
                            />

                            {/* Gradient scrim fading from transparent to solid at bottom */}
                            <LinearGradient
                                colors={['transparent', 'rgba(0,0,0,0.15)', 'rgba(0,0,0,0.72)', 'rgba(0,0,0,0.92)']}
                                locations={[0, 0.35, 0.7, 1]}
                                style={{
                                    position: 'absolute',
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    top: '20%',
                                }}
                            />

                            {/* Content overlay */}
                            <View className="absolute bottom-0 left-0 right-0 p-4">

                                {/* Title */}
                                <Text className='text-2xl font-semibold text-white' numberOfLines={2}>
                                    {anime.title}
                                </Text>

                                {/* Episodes */}
                                <View className="flex-row items-center mb-3 mt-1.5">
                                    <View className="flex-row items-center gap-1">
                                        <ClapperboardPlay size={13} color={accentColor} />
                                        <Text className='text-xs text-white font-normal'>
                                            {anime.episodeCount} Episodes
                                        </Text>
                                    </View>
                                </View>


                                {/* Genre chips */}
                                <View className="flex-row flex-wrap gap-1.5 mb-4">
                                    {anime.genres.map(g => (
                                        <Chip
                                            key={g}
                                            variant='tertiary'
                                            className="px-2 py-0.5"
                                            style={{ borderWidth: 1, borderColor: 'rgba(255,255,255,0.6)', borderRadius: 4 }}
                                        >
                                            <Text className='text-xs font-medium text-white'>
                                                {g}
                                            </Text>
                                        </Chip>
                                    ))}
                                </View>

                                {/* CTA buttons inside cover */}
                                <View className="flex-row gap-2.5">
                                    <Button
                                        className="flex-1"
                                        onPress={() => router.push(`/anime/${anime.id}`)}
                                    >
                                        <Play size={15} color="white" />
                                        <Text className='text-white font-bold text-sm'>
                                            Play Now
                                        </Text>
                                    </Button>
                                    <Button
                                        className="flex-1"
                                        variant='outline'
                                        style={{ borderColor: 'rgba(255,255,255,0.4)', backgroundColor: 'rgba(255,255,255,0.1)' }}
                                    >
                                        <Bookmark size={15} color="white" />
                                        <Text className='text-sm font-semibold text-white'>
                                            Watchlist
                                        </Text>
                                    </Button>
                                </View>
                            </View>
                        </Pressable>
                    </View>
                ))}
            </ScrollView>

            {/* Pagination dots */}
            <View className="flex-row justify-center items-center gap-1.5 mt-3 p-5">
                {items.map((_, index) => (
                    <Pressable
                        key={index}
                        onPress={() => scrollToIndex(index)}
                        hitSlop={8}
                    >
                        <View
                            style={{
                                width: activeIndex === index ? 18 : 6,
                                height: 6,
                                borderRadius: 3,
                                backgroundColor: activeIndex === index ? '#FF2D55' : (isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)'),
                            }}
                        />
                    </Pressable>
                ))}
            </View>
        </View>
    )
}
