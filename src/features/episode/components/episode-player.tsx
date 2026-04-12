import { Button } from 'heroui-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, Text, TouchableOpacity, View } from 'react-native';
import { Pause, Play } from 'react-native-solar-icons/icons/bold';
import { ArrowLeft } from 'react-native-solar-icons/icons/outline';
import Video, { VideoRef } from 'react-native-video';
import { formatTime } from '../episode-constants';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const VIDEO_HEIGHT = Math.round((SCREEN_WIDTH * 9) / 16);

type Props = {
    sourceUrl: string;
    selectedQuality: string;
    safeAreaTop: number;
    accent: string;
    onBack: () => void;
};

export function EpisodePlayer({ sourceUrl, selectedQuality, safeAreaTop, accent, onBack }: Props) {
    const videoRef = useRef<VideoRef>(null);
    const controlsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const [paused, setPaused] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => setShowControls(false), 3500);
        return () => {
            clearTimeout(timer);
            if (controlsTimer.current) clearTimeout(controlsTimer.current);
        };
    }, []);

    const showControlsTemporarily = useCallback(() => {
        setShowControls(true);
        if (controlsTimer.current) clearTimeout(controlsTimer.current);
        controlsTimer.current = setTimeout(() => setShowControls(false), 3000);
    }, []);

    const handleVideoTap = useCallback(() => {
        if (showControls) {
            setShowControls(false);
            if (controlsTimer.current) clearTimeout(controlsTimer.current);
        } else {
            showControlsTemporarily();
        }
    }, [showControls, showControlsTemporarily]);

    const handleSeek = (locationX: number) => {
        const ratio = Math.max(0, Math.min(1, locationX / (SCREEN_WIDTH - 24)));
        videoRef.current?.seek(ratio * duration);
    };

    const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

    return (
        <View style={{ width: SCREEN_WIDTH, height: VIDEO_HEIGHT, backgroundColor: '#000' }}>
            <Video
                ref={videoRef}
                source={{ uri: sourceUrl }}
                style={{ width: SCREEN_WIDTH, height: VIDEO_HEIGHT }}
                paused={paused}
                resizeMode="contain"
                onProgress={({ currentTime: ct }) => setCurrentTime(ct)}
                onLoad={({ duration: d }) => setDuration(d)}
                onEnd={() => setPaused(true)}
            />

            {/* Tap-to-toggle controls */}
            <TouchableOpacity
                activeOpacity={1}
                style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                onPress={handleVideoTap}
            />

            {/* Controls overlay */}
            {showControls && (
                <View
                    pointerEvents="box-none"
                    style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                >
                    {/* Top row */}
                    <View
                        style={{
                            paddingHorizontal: 12,
                            paddingTop: safeAreaTop + 8,
                        }}
                        className="flex-row items-center justify-between"
                    >
                        <Button onPress={onBack}
                            className="w-10 h-10 rounded-full items-center justify-center border-0"
                            variant='outline'
                            style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
                            hitSlop={8}>
                            <ArrowLeft size={24} color="white" />
                        </Button>

                        <View
                            style={{
                                backgroundColor: 'rgba(0,0,0,0.55)',
                            }}
                            className="rounded-lg px-2 py-1"
                        >
                            <Text className="text-white text-xs font-semibold">
                                {selectedQuality}
                            </Text>
                        </View>
                    </View>

                    {/* Center play / pause */}
                    <View className="flex-1 items-center justify-center">
                        <Button onPress={() => setPaused(p => !p)}
                            className="size-16 rounded-full items-center justify-center border-0"
                            variant='outline'
                            style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
                            hitSlop={8}>
                            {paused
                                ? <Play size={28} color="white" />
                                : <Pause size={28} color="white" />
                            }
                        </Button>
                    </View>

                    {/* Bottom: time + seek bar */}
                    <View style={{ paddingHorizontal: 12, paddingBottom: 12 }}>
                        <View className="flex-row justify-between mb-1.5">
                            <Text className="text-white text-xs font-semibold">
                                {formatTime(currentTime)}
                            </Text>
                            <Text className="text-white text-xs font-semibold">
                                {formatTime(duration)}
                            </Text>
                        </View>
                        <TouchableOpacity
                            activeOpacity={1}
                            style={{ height: 20, justifyContent: 'center' }}
                            onPress={e => handleSeek(e.nativeEvent.locationX)}
                        >
                            <View style={{ height: 3, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.25)' }}>
                                <View
                                    style={{
                                        height: 3, borderRadius: 2,
                                        backgroundColor: accent,
                                        width: `${progressPercent}%`,
                                    }}
                                />
                                <View
                                    style={{
                                        position: 'absolute',
                                        top: -4, width: 11, height: 11, borderRadius: 6,
                                        backgroundColor: accent,
                                        left: `${progressPercent}%`,
                                        marginLeft: -5,
                                    }}
                                />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
}
