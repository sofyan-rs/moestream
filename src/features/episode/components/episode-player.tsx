import * as ScreenOrientation from "expo-screen-orientation";
import { Button } from "heroui-native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Dimensions,
  Modal,
  PanResponder,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Pause, Play, RewindBack, RewindForward } from "react-native-solar-icons/icons/bold";
import {
  ArrowLeft,
  FullScreen,
  LockKeyhole,
  LockKeyholeUnlocked,
  QuitFullScreen,
  SmartphoneRotate2,
} from "react-native-solar-icons/icons/outline";
import Video, { VideoRef } from "react-native-video";

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const VIDEO_HEIGHT = Math.round((SCREEN_WIDTH * 9) / 16);

const clampRatio = (v: number) => Math.max(0, Math.min(1, v));

// ── Shared controls overlay ──────────────────────────────────────────────────

type ControlsOverlayProps = {
  paused: boolean;
  currentTime: number;
  duration: number;
  quality: string;
  title?: string;
  subtitle?: string;
  isFullscreen: boolean;
  isLandscape: boolean;
  safeAreaTop: number;
  safeAreaBottom?: number;
  safeAreaLeft?: number;
  safeAreaRight?: number;
  accent: string;
  onBack: () => void;
  onTogglePlay: () => void;
  onToggleFullscreen: () => void;
  onToggleOrientation: () => void;
  controlsLocked: boolean;
  onToggleLock: () => void;
  onSeekRelative: (deltaSeconds: number) => void;
  onSeekStart: (ratio: number) => void;
  onSeekMove: (ratio: number) => void;
  onSeekEnd: (ratio: number) => void;
};

function ControlsOverlay({
  paused,
  currentTime,
  duration,
  quality,
  title,
  subtitle,
  isFullscreen,
  isLandscape,
  safeAreaTop,
  safeAreaBottom = 0,
  safeAreaLeft = 0,
  safeAreaRight = 0,
  accent,
  onBack,
  onTogglePlay,
  onToggleFullscreen,
  onToggleOrientation,
  controlsLocked,
  onToggleLock,
  onSeekRelative,
  onSeekStart,
  onSeekMove,
  onSeekEnd,
}: ControlsOverlayProps) {
  const seekBarRef = useRef<View>(null);
  const seekBarWidthRef = useRef(SCREEN_WIDTH - 24);
  const seekBarPageXRef = useRef(0);
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Keep latest callbacks in refs so PanResponder (created once) always calls fresh handlers
  const onSeekStartRef = useRef(onSeekStart);
  const onSeekMoveRef = useRef(onSeekMove);
  const onSeekEndRef = useRef(onSeekEnd);
  useEffect(() => {
    onSeekStartRef.current = onSeekStart;
    onSeekMoveRef.current = onSeekMove;
    onSeekEndRef.current = onSeekEnd;
  });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        // locationX is reliable on grant (touch start)
        onSeekStartRef.current(
          clampRatio(evt.nativeEvent.locationX / seekBarWidthRef.current),
        );
      },
      onPanResponderMove: (_evt, gestureState) => {
        // During drag, locationX is unreliable on some Android builds — use absolute X.
        onSeekMoveRef.current(
          clampRatio(
            (gestureState.moveX - seekBarPageXRef.current) /
            seekBarWidthRef.current,
          ),
        );
      },
      onPanResponderRelease: (evt) => {
        // On a tap (no move), moveX can be wrong; locationX matches grant and is correct for seek end.
        const ratio = clampRatio(
          evt.nativeEvent.locationX / seekBarWidthRef.current,
        );
        onSeekEndRef.current(ratio);
      },
      onPanResponderTerminate: (evt) => {
        const ratio = clampRatio(
          evt.nativeEvent.locationX / seekBarWidthRef.current,
        );
        onSeekEndRef.current(ratio);
      },
    }),
  ).current;
  const isLockedFullscreen = isFullscreen && controlsLocked;

  if (isLockedFullscreen) {
    return (
      <View
        pointerEvents="box-none"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          padding: 12,
        }}
      >
        <View
          className="flex-row items-center"
          style={{
            marginTop: "auto",
            paddingLeft: Math.max(12, safeAreaLeft + 8),
            paddingBottom: Math.max(20, safeAreaBottom + 10),
          }}
        >
          <Button
            onPress={onToggleLock}
            className="w-10 h-10 shrink-0 rounded-full items-center justify-center border-0"
            variant="outline"
            style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
            hitSlop={8}
          >
            <LockKeyholeUnlocked size={18} color="white" />
          </Button>
        </View>
      </View>
    );
  }

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        padding: isFullscreen ? 12 : 0,
      }}
    >
      {/* Top row */}
      {isFullscreen ? (
        <View
          style={{
            paddingLeft: Math.max(12, safeAreaLeft + 8),
            paddingRight: Math.max(12, safeAreaRight + 8),
            paddingTop: safeAreaTop + 8,
          }}
          className="flex-row items-center justify-between"
        >
          <View className="flex-row items-center min-w-0 flex-1">
            <Button
              onPress={onBack}
              className="w-10 h-10 rounded-full items-center justify-center border-0"
              variant="outline"
              style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
              hitSlop={8}
            >
              <ArrowLeft size={24} color="white" />
            </Button>
            <View className="ml-2 min-w-0 flex-1">
              <Text
                className="text-white text-base font-semibold"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {title || "Now Playing"}
              </Text>
              <Text
                className="text-white text-xs"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {subtitle || "Episode"}
              </Text>
            </View>
          </View>
          <View
            style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
            className="ml-2 rounded-lg px-2 py-1"
          >
            <Text className="text-white text-xs font-semibold">{quality}</Text>
          </View>
        </View>
      ) : (
        <View
          style={{ paddingHorizontal: 12, paddingTop: 8 }}
          className="flex-row items-center justify-between"
        >
          <Button
            onPress={onBack}
            className="w-10 h-10 rounded-full items-center justify-center border-0"
            variant="outline"
            style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
            hitSlop={8}
          >
            <ArrowLeft size={24} color="white" />
          </Button>
          <View
            style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
            className="rounded-lg px-2 py-1"
          >
            <Text className="text-white text-xs font-semibold">{quality}</Text>
          </View>
        </View>
      )}

      {/* Center play / pause */}
      <View
        className="flex-1 flex-row items-center justify-center"
        style={{ gap: isFullscreen ? 24 : 0 }}
      >
        {isFullscreen && (
          <Button
            onPress={() => onSeekRelative(-10)}
            className="size-12 rounded-full items-center justify-center border-0"
            variant="outline"
            style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
            hitSlop={8}
          >
            <RewindBack size={28} color="white" />
          </Button>
        )}
        <Button
          onPress={onTogglePlay}
          className="size-16 rounded-full items-center justify-center border-0"
          variant="outline"
          style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
          hitSlop={8}
        >
          {paused ? (
            <Play size={28} color="white" />
          ) : (
            <Pause size={28} color="white" />
          )}
        </Button>
        {isFullscreen && (
          <Button
            onPress={() => onSeekRelative(10)}
            className="size-12 rounded-full items-center justify-center border-0"
            variant="outline"
            style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
            hitSlop={8}
          >
            <RewindForward size={28} color="white" />
          </Button>
        )}
      </View>

      {/* Bottom: one row — current | seek | duration | fullscreen */}
      <View
        className="flex-row items-center gap-2"
        style={{
          paddingLeft: isFullscreen ? Math.max(12, safeAreaLeft + 8) : 12,
          paddingRight: isFullscreen ? Math.max(12, safeAreaRight + 8) : 12,
          paddingBottom: isFullscreen ? Math.max(20, safeAreaBottom + 10) : 12,
        }}
      >
        {isFullscreen && (
          <View className="flex-row items-center gap-2" style={{ marginRight: 5 }}>
            <Button
              onPress={onToggleOrientation}
              className="w-10 h-10 shrink-0 rounded-full items-center justify-center border-0"
              variant="outline"
              style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
              hitSlop={8}
            >
              <SmartphoneRotate2 size={18} color="white" />
            </Button>
            <Button
              onPress={onToggleLock}
              className="w-10 h-10 shrink-0 rounded-full items-center justify-center border-0"
              variant="outline"
              style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
              hitSlop={8}
            >
              <LockKeyhole size={18} color="white" />
            </Button>
          </View>
        )}

        <Text
          className="text-white text-xs font-semibold tabular-nums shrink-0"
          style={{ minWidth: 40 }}
        >
          {formatTime(currentTime)}
        </Text>

        <View
          ref={seekBarRef}
          className="min-w-0 flex-1"
          style={{ height: 28, justifyContent: "center" }}
          onLayout={() => {
            seekBarRef.current?.measure((_x, _y, width, _h, pageX) => {
              seekBarWidthRef.current = width;
              seekBarPageXRef.current = pageX;
            });
          }}
          {...panResponder.panHandlers}
        >
          <View
            style={{
              height: 3,
              borderRadius: 2,
              backgroundColor: "rgba(255,255,255,0.25)",
            }}
          >
            <View
              style={{
                height: 3,
                borderRadius: 2,
                backgroundColor: accent,
                width: `${progressPercent}%`,
              }}
            />
            <View
              style={{
                position: "absolute",
                top: -5,
                width: 13,
                height: 13,
                borderRadius: 7,
                backgroundColor: accent,
                left: `${progressPercent}%`,
                marginLeft: -6,
              }}
            />
          </View>
        </View>

        <Text className="text-white text-xs font-semibold tabular-nums shrink-0">
          {formatTime(duration)}
        </Text>

        <Button
          onPress={onToggleFullscreen}
          className="w-10 h-10 shrink-0 rounded-full items-center justify-center border-0"
          variant="outline"
          style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
          hitSlop={8}
        >
          {isFullscreen ? (
            <QuitFullScreen size={18} color="white" />
          ) : (
            <FullScreen size={18} color="white" />
          )}
        </Button>

      </View>
    </View>
  );
}

// ── EpisodePlayer ────────────────────────────────────────────────────────────

export type WatchProgressPayload = {
  currentTime: number;
  duration: number;
};

type Props = {
  sourceUrl: string;
  /** Stream `Referer` header (provider embed URL, e.g. kwik.cx player page) */
  referer: string;
  title?: string;
  subtitle?: string;
  selectedQuality: string;
  safeAreaTop: number;
  accent: string;
  onBack: () => void;
  /** Throttled while playing; also invoked when the stream changes or this player unmounts. */
  onWatchProgress?: (payload: WatchProgressPayload) => void;
  watchProgressIntervalMs?: number;
};

export function EpisodePlayer({
  sourceUrl,
  referer,
  title,
  subtitle,
  selectedQuality,
  safeAreaTop,
  accent,
  onBack,
  onWatchProgress,
  watchProgressIntervalMs = 5000,
}: Props) {
  const insets = useSafeAreaInsets();
  const inlineVideoRef = useRef<VideoRef>(null);
  const fullscreenVideoRef = useRef<VideoRef>(null);
  const controlsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Remembers the inline playhead position so fullscreen video can seek to it on load
  const seekOnLoad = useRef(0);

  // Refs that stay fresh without recreating seek callbacks
  const isSeekingRef = useRef(false);
  const durationRef = useRef(0);
  const isFullscreenRef = useRef(false);
  const seekFallbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressSnap = useRef({ currentTime: 0, duration: 0 });
  const lastWatchEmitAt = useRef(0);
  const onWatchProgressRef = useRef(onWatchProgress);
  onWatchProgressRef.current = onWatchProgress;

  const [paused, setPaused] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);
  const [controlsLocked, setControlsLocked] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Keep refs in sync
  isFullscreenRef.current = isFullscreen;

  const setDurationSynced = useCallback((d: number) => {
    durationRef.current = d;
    setDuration(d);
    progressSnap.current = {
      currentTime: progressSnap.current.currentTime,
      duration: d,
    };
  }, []);

  const flushWatchProgress = useCallback(() => {
    const cb = onWatchProgressRef.current;
    if (!cb) return;
    const { currentTime, duration } = progressSnap.current;
    if (duration <= 0) return;
    cb({ currentTime, duration });
  }, []);

  const maybeEmitWatchProgress = useCallback(() => {
    const cb = onWatchProgressRef.current;
    if (!cb) return;
    const { currentTime, duration } = progressSnap.current;
    if (duration <= 0) return;
    const now = Date.now();
    if (now - lastWatchEmitAt.current < watchProgressIntervalMs) return;
    lastWatchEmitAt.current = now;
    cb({ currentTime, duration });
  }, [watchProgressIntervalMs]);

  useEffect(() => {
    progressSnap.current = { currentTime: 0, duration: 0 };
    lastWatchEmitAt.current = 0;
    return () => {
      flushWatchProgress();
    };
  }, [sourceUrl, flushWatchProgress]);

  useEffect(() => {
    const timer = setTimeout(() => setShowControls(false), 3500);
    return () => {
      clearTimeout(timer);
      if (controlsTimer.current) clearTimeout(controlsTimer.current);
      if (seekFallbackTimer.current) clearTimeout(seekFallbackTimer.current);
    };
  }, []);

  const showControlsTemporarily = useCallback(() => {
    setShowControls(true);
    if (controlsTimer.current) clearTimeout(controlsTimer.current);
    controlsTimer.current = setTimeout(() => setShowControls(false), 3000);
  }, []);

  const handleVideoTap = useCallback(() => {
    // Ignore taps that are really the seek bar PanResponder firing alongside this handler
    if (isSeekingRef.current) return;
    if (showControls) {
      setShowControls(false);
      if (controlsTimer.current) clearTimeout(controlsTimer.current);
    } else {
      showControlsTemporarily();
    }
  }, [showControls, showControlsTemporarily]);

  // ── Seek handlers ────────────────────────────────────────────────────────

  const handleSeekStart = useCallback((ratio: number) => {
    isSeekingRef.current = true;
    // Stop auto-hide while the user is dragging
    if (controlsTimer.current) clearTimeout(controlsTimer.current);
    setCurrentTime(ratio * durationRef.current);
  }, []);

  const handleSeekMove = useCallback((ratio: number) => {
    setCurrentTime(ratio * durationRef.current);
  }, []);

  const handleSeekEnd = useCallback(
    (ratio: number) => {
      const dur = durationRef.current;
      if (dur <= 0) {
        isSeekingRef.current = false;
        return;
      }
      const time = ratio * dur;
      setCurrentTime(time);
      if (isFullscreenRef.current) {
        fullscreenVideoRef.current?.seek(time);
      } else {
        inlineVideoRef.current?.seek(time);
      }
      // Don't reset isSeekingRef here — wait for onSeek to fire so onProgress
      // doesn't overwrite currentTime before the seek actually completes.
      // Fallback in case onSeek never fires (some Android/HLS edge cases).
      if (seekFallbackTimer.current) clearTimeout(seekFallbackTimer.current);
      seekFallbackTimer.current = setTimeout(() => {
        isSeekingRef.current = false;
      }, 1500);
      showControlsTemporarily();
    },
    [showControlsTemporarily],
  );

  const seekRelative = useCallback((deltaSeconds: number) => {
    const dur = durationRef.current;
    if (dur <= 0) return;
    const target = Math.max(0, Math.min(currentTime + deltaSeconds, dur));
    setCurrentTime(target);
    if (isFullscreenRef.current) {
      fullscreenVideoRef.current?.seek(target);
    } else {
      inlineVideoRef.current?.seek(target);
    }
    progressSnap.current = {
      currentTime: target,
      duration: dur,
    };
  }, [currentTime]);

  // Called by react-native-video when the seek operation actually completes.
  const handleSeekComplete = useCallback(() => {
    if (seekFallbackTimer.current) clearTimeout(seekFallbackTimer.current);
    isSeekingRef.current = false;
  }, []);

  // ── Fullscreen ───────────────────────────────────────────────────────────

  const enterFullscreen = useCallback(() => {
    seekOnLoad.current = currentTime;
    setControlsLocked(false);
    setIsFullscreen(true);
    showControlsTemporarily();
  }, [currentTime, showControlsTemporarily]);

  const exitFullscreen = useCallback(async () => {
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.PORTRAIT_UP,
    );
    setIsLandscape(false);
    setControlsLocked(false);
    inlineVideoRef.current?.seek(currentTime);
    setIsFullscreen(false);
    showControlsTemporarily();
  }, [currentTime, showControlsTemporarily]);

  const toggleOrientation = useCallback(async () => {
    if (isLandscape) {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP,
      );
      setIsLandscape(false);
    } else {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE,
      );
      setIsLandscape(true);
    }
  }, [isLandscape]);

  const videoSource = useMemo(
    () => ({
      uri: sourceUrl,
      headers: { referer },
    }),
    [sourceUrl, referer],
  );

  const sharedControls = {
    paused,
    currentTime,
    duration,
    quality: selectedQuality,
    title,
    subtitle,
    isLandscape,
    accent,
    onTogglePlay: () => setPaused((p) => !p),
    onToggleOrientation: toggleOrientation,
    controlsLocked,
    onToggleLock: () => {
      setControlsLocked((locked) => {
        const next = !locked;
        if (!next) showControlsTemporarily();
        return next;
      });
    },
    onSeekRelative: seekRelative,
    onSeekStart: handleSeekStart,
    onSeekMove: handleSeekMove,
    onSeekEnd: handleSeekEnd,
  };

  return (
    <>
      {/* ── Inline player ── */}
      <View
        style={{
          width: SCREEN_WIDTH,
          height: VIDEO_HEIGHT,
          backgroundColor: "#000",
        }}
      >
        <Video
          ref={inlineVideoRef}
          source={videoSource}
          style={{ width: SCREEN_WIDTH, height: VIDEO_HEIGHT }}
          paused={paused || isFullscreen}
          resizeMode="contain"
          progressUpdateInterval={200}
          onProgress={({ currentTime: ct }) => {
            if (!isFullscreen && !isSeekingRef.current) {
              setCurrentTime(ct);
              progressSnap.current = {
                currentTime: ct,
                duration: durationRef.current,
              };
              maybeEmitWatchProgress();
            }
          }}
          onLoad={({ duration: d }) => setDurationSynced(d)}
          onSeek={handleSeekComplete}
          onEnd={() => setPaused(true)}
        />

        <TouchableOpacity
          activeOpacity={1}
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
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
        supportedOrientations={[
          "portrait",
          "landscape",
          "landscape-left",
          "landscape-right",
        ]}
        onRequestClose={exitFullscreen}
      >
        <View style={{ flex: 1, backgroundColor: "#000" }}>
          <StatusBar hidden />

          <Video
            ref={fullscreenVideoRef}
            source={videoSource}
            style={{ flex: 1 }}
            paused={paused}
            resizeMode="contain"
            progressUpdateInterval={200}
            onProgress={({ currentTime: ct }) => {
              if (!isSeekingRef.current) {
                setCurrentTime(ct);
                progressSnap.current = {
                  currentTime: ct,
                  duration: durationRef.current,
                };
                maybeEmitWatchProgress();
              }
            }}
            onLoad={({ duration: d }) => {
              setDurationSynced(d);
              if (seekOnLoad.current > 0) {
                fullscreenVideoRef.current?.seek(seekOnLoad.current);
                seekOnLoad.current = 0;
              }
            }}
            onSeek={handleSeekComplete}
            onEnd={() => setPaused(true)}
          />

          <TouchableOpacity
            activeOpacity={1}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
            onPress={handleVideoTap}
          />

          {(showControls || controlsLocked) && (
            <ControlsOverlay
              {...sharedControls}
              isFullscreen={true}
              safeAreaTop={Math.max(safeAreaTop, insets.top)}
              safeAreaBottom={insets.bottom}
              safeAreaLeft={insets.left}
              safeAreaRight={insets.right}
              onBack={exitFullscreen}
              onToggleFullscreen={exitFullscreen}
            />
          )}
        </View>
      </Modal>
    </>
  );
}
