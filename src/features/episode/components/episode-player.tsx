import * as ScreenOrientation from 'expo-screen-orientation';
import { Button } from 'heroui-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, Modal, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { Pause, Play } from 'react-native-solar-icons/icons/bold';
import { ArrowLeft, FullScreen, QuitFullScreen, SmartphoneRotate2 } from 'react-native-solar-icons/icons/outline';
import Video, { VideoRef } from 'react-native-video';
import { formatTime } from '../data/episode-constants';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const VIDEO_HEIGHT = Math.round((SCREEN_WIDTH * 9) / 16);

// ── Shared controls overlay ──────────────────────────────────────────────────

type ControlsOverlayProps = {
    paused: boolean;
    currentTime: number;
    duration: number;
    quality: string;
    isFullscreen: boolean;
    isLandscape: boolean;
    safeAreaTop: number;
    accent: string;
    onBack: () => void;
    onTogglePlay: () => void;
    onToggleFullscreen: () => void;
    onToggleOrientation: () => void;
    onSeek: (ratio: number) => void;
};

function ControlsOverlay({
    paused, currentTime, duration, quality, isFullscreen, isLandscape, safeAreaTop, accent,
    onBack, onTogglePlay, onToggleFullscreen, onToggleOrientation, onSeek,
}: ControlsOverlayProps) {
    const [seekBarWidth, setSeekBarWidth] = useState(SCREEN_WIDTH - 24);
    const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

    return (
        <View
            pointerEvents="box-none"
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, padding: isFullscreen ? 12 : 0 }}
        >
            {/* Top row: back | quality + fullscreen toggle */}
            <View
                style={{ paddingHorizontal: 12, paddingTop: safeAreaTop + 8 }}
                className="flex-row items-center justify-between"
            >
                <Button
                    onPress={onBack}
                    className="w-10 h-10 rounded-full items-center justify-center border-0"
                    variant="outline"
                    style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
                    hitSlop={8}
                >
                    <ArrowLeft size={24} color="white" />
                </Button>

                <View className="flex-row items-center gap-2">
                    <View
                        style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
                        className="rounded-lg px-2 py-1"
                    >
                        <Text className="text-white text-xs font-semibold">{quality}</Text>
                    </View>

                    <Button
                        onPress={onToggleFullscreen}
                        className="w-10 h-10 rounded-full items-center justify-center border-0"
                        variant="outline"
                        style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
                        hitSlop={8}
                    >
                        {isFullscreen ? <QuitFullScreen size={18} color="white" /> : <FullScreen size={18} color="white" />}
                    </Button>

                    {/* Orientation toggle — fullscreen only */}
                    {isFullscreen && (
                        <Button
                            onPress={onToggleOrientation}
                            className="w-10 h-10 rounded-full items-center justify-center border-0"
                            variant="outline"
                            style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
                            hitSlop={8}
                        >
                            <SmartphoneRotate2 size={18} color="white" />
                        </Button>
                    )}
                </View>
            </View>

            {/* Center play / pause */}
            <View className="flex-1 items-center justify-center">
                <Button
                    onPress={onTogglePlay}
                    className="size-16 rounded-full items-center justify-center border-0"
                    variant="outline"
                    style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
                    hitSlop={8}
                >
                    {paused ? <Play size={28} color="white" /> : <Pause size={28} color="white" />}
                </Button>
            </View>

            {/* Bottom: times + seek bar */}
            <View style={{ paddingHorizontal: 12, paddingBottom: isFullscreen ? 28 : 12 }}>
                <View className="flex-row justify-between mb-1.5">
                    <Text className="text-white text-xs font-semibold">{formatTime(currentTime)}</Text>
                    <Text className="text-white text-xs font-semibold">{formatTime(duration)}</Text>
                </View>
                <TouchableOpacity
                    activeOpacity={1}
                    style={{ height: 20, justifyContent: 'center' }}
                    onLayout={e => setSeekBarWidth(e.nativeEvent.layout.width)}
                    onPress={e =>
                        onSeek(Math.max(0, Math.min(1, e.nativeEvent.locationX / seekBarWidth)))
                    }
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
    );
}

// ── EpisodePlayer ────────────────────────────────────────────────────────────

type Props = {
    sourceUrl: string;
    selectedQuality: string;
    safeAreaTop: number;
    accent: string;
    onBack: () => void;
};

export function EpisodePlayer({ sourceUrl, selectedQuality, safeAreaTop, accent, onBack }: Props) {
    const inlineVideoRef = useRef<VideoRef>(null);
    const fullscreenVideoRef = useRef<VideoRef>(null);
    const controlsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    // Remembers the inline playhead position so fullscreen video can seek to it on load
    const seekOnLoad = useRef(0);

    const [paused, setPaused] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isLandscape, setIsLandscape] = useState(false);
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

    const handleSeek = useCallback((ratio: number) => {
        const time = ratio * duration;
        if (isFullscreen) {
            fullscreenVideoRef.current?.seek(time);
        } else {
            inlineVideoRef.current?.seek(time);
        }
    }, [duration, isFullscreen]);

    const enterFullscreen = useCallback(() => {
        seekOnLoad.current = currentTime;
        setIsFullscreen(true);
        showControlsTemporarily();
    }, [currentTime, showControlsTemporarily]);

    const exitFullscreen = useCallback(async () => {
        // Restore portrait before closing the modal
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
        setIsLandscape(false);
        inlineVideoRef.current?.seek(currentTime);
        setIsFullscreen(false);
        showControlsTemporarily();
    }, [currentTime, showControlsTemporarily]);

    const toggleOrientation = useCallback(async () => {
        if (isLandscape) {
            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
            setIsLandscape(false);
        } else {
            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
            setIsLandscape(true);
        }
    }, [isLandscape]);

    const sharedControls = {
        paused,
        currentTime,
        duration,
        quality: selectedQuality,
        isLandscape,
        accent,
        onTogglePlay: () => setPaused(p => !p),
        onToggleOrientation: toggleOrientation,
        onSeek: handleSeek,
    };

    return (
        <>
            {/* ── Inline player ── */}
            <View style={{ width: SCREEN_WIDTH, height: VIDEO_HEIGHT, backgroundColor: '#000' }}>
                <Video
                    ref={inlineVideoRef}
                    source={{ uri: sourceUrl }}
                    style={{ width: SCREEN_WIDTH, height: VIDEO_HEIGHT }}
                    paused={paused || isFullscreen}
                    resizeMode="contain"
                    onProgress={({ currentTime: ct }) => {
                        if (!isFullscreen) setCurrentTime(ct);
                    }}
                    onLoad={({ duration: d }) => setDuration(d)}
                    onEnd={() => setPaused(true)}
                />

                <TouchableOpacity
                    activeOpacity={1}
                    style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                    onPress={handleVideoTap}
                />

                {showControls && (
                    <ControlsOverlay
                        {...sharedControls}
                        isFullscreen={false}
                        safeAreaTop={safeAreaTop}
                        onBack={onBack}
                        onToggleFullscreen={enterFullscreen}
                    />
                )}
            </View>

            {/* ── Fullscreen modal ── */}
            <Modal
                visible={isFullscreen}
                transparent={false}
                statusBarTranslucent
                presentationStyle="fullScreen"
                animationType="fade"
                supportedOrientations={['portrait', 'landscape', 'landscape-left', 'landscape-right']}
                onRequestClose={exitFullscreen}
            >
                <View style={{ flex: 1, backgroundColor: '#000' }}>
                    <StatusBar hidden />

                    <Video
                        ref={fullscreenVideoRef}
                        source={{ uri: sourceUrl }}
                        style={{ flex: 1 }}
                        paused={paused}
                        resizeMode="contain"
                        onProgress={({ currentTime: ct }) => setCurrentTime(ct)}
                        onLoad={({ duration: d }) => {
                            setDuration(d);
                            if (seekOnLoad.current > 0) {
                                fullscreenVideoRef.current?.seek(seekOnLoad.current);
                                seekOnLoad.current = 0;
                            }
                        }}
                        onEnd={() => setPaused(true)}
                    />

                    <TouchableOpacity
                        activeOpacity={1}
                        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                        onPress={handleVideoTap}
                    />

                    {showControls && (
                        <ControlsOverlay
                            {...sharedControls}
                            isFullscreen={true}
                            safeAreaTop={0}
                            onBack={exitFullscreen}
                            onToggleFullscreen={exitFullscreen}
                        />
                    )}
                </View>
            </Modal>
        </>
    );
}
