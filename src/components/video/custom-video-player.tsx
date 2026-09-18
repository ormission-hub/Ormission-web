"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  Volume1,
  VolumeX,
  Maximize,
  Minimize,
  Check,
  Sliders,
} from "lucide-react";

interface CustomVideoPlayerProps {
  videoUrlOrId: string;
  title?: string;
  thumbnailUrl?: string;
  autoPlay?: boolean;
  onEnded?: () => void;
  onProgress?: (progressPercent: number) => void;
  className?: string;
}

// Helper: Extract YouTube Video ID from any URL format or raw ID
export function extractYouTubeId(urlOrId: string): string {
  if (!urlOrId) return "M7lc1UVf-VE";
  const trimmed = urlOrId.trim();

  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  const shortMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch) return shortMatch[1];

  const watchMatch = trimmed.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watchMatch) return watchMatch[1];

  const embedMatch = trimmed.match(/\/embed\/([a-zA-Z0-9_-]{11})/);
  if (embedMatch) return embedMatch[1];

  const liveMatch = trimmed.match(/\/(?:live|v)\/([a-zA-Z0-9_-]{11})/);
  if (liveMatch) return liveMatch[1];

  return trimmed || "M7lc1UVf-VE";
}

// Helper: Format seconds to MM:SS or HH:MM:SS
function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return "00:00";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

  if (h > 0) {
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
  }
  return `${pad(m)}:${pad(s)}`;
}

// Quality Options
const QUALITY_LIST = [
  { id: "auto", label: "Auto (অটো)", badge: "Auto" },
  { id: "hd1080", label: "1080p FHD", badge: "1080p" },
  { id: "hd720", label: "720p HD", badge: "720p" },
  { id: "large", label: "480p SD", badge: "480p" },
  { id: "medium", label: "360p", badge: "360p" },
];

export function CustomVideoPlayer({
  videoUrlOrId,
  title,
  thumbnailUrl,
  autoPlay = false,
  onEnded,
  onProgress,
  className = "",
}: CustomVideoPlayerProps) {
  const videoId = extractYouTubeId(videoUrlOrId);

  const [mounted, setMounted] = useState(false);
  const [origin, setOrigin] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const hideControlsTimer = useRef<NodeJS.Timeout | null>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Player state
  const [hasStarted, setHasStarted] = useState(autoPlay);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loadedFraction, setLoadedFraction] = useState(0);
  const [volume, setVolume] = useState(90);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [currentQuality, setCurrentQuality] = useState<string>("auto");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showQualityMenu, setShowQualityMenu] = useState(false);

  // Center feedback ripple
  const [actionFeedback, setActionFeedback] = useState<
    "play" | "pause" | "fwd" | "rew" | null
  >(null);

  // Scrubber hover preview
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverX, setHoverX] = useState<number>(0);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  // PostMessage command sender to YouTube iframe
  const sendCommand = useCallback((func: string, args: any = []) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      try {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({
            event: "command",
            func,
            args: Array.isArray(args) ? args : [args],
          }),
          "*"
        );
      } catch {
        // ignore
      }
    }
  }, []);

  // Register listener for YouTube iframe state changes via window postMessage
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      let payload = e.data;
      if (typeof payload === "string") {
        try {
          payload = JSON.parse(payload);
        } catch {
          return;
        }
      }

      if (!payload || typeof payload !== "object") return;

      // YouTube onReady event
      if (payload.event === "onReady") {
        sendCommand("setVolume", [volume]);
      }

      // YouTube State Change
      // -1: unstarted, 0: ended, 1: playing, 2: paused, 3: buffering, 5: cued
      if (payload.event === "onStateChange") {
        if (payload.info === 1) {
          setIsPlaying(true);
          setIsBuffering(false);
          setHasStarted(true);
        } else if (payload.info === 2) {
          setIsPlaying(false);
          setIsBuffering(false);
        } else if (payload.info === 3) {
          setIsBuffering(true);
        } else if (payload.info === 0) {
          setIsPlaying(false);
          setIsBuffering(false);
          onEnded?.();
        }
      }

      // YouTube Info delivery (time, duration, quality)
      if (payload.event === "infoDelivery" && payload.info) {
        const info = payload.info;
        if (typeof info.currentTime === "number") {
          setCurrentTime(info.currentTime);
        }
        if (typeof info.duration === "number" && info.duration > 0) {
          setDuration(info.duration);
        }
        if (typeof info.videoLoadedFraction === "number") {
          setLoadedFraction(info.videoLoadedFraction);
        }
        if (typeof info.playbackQuality === "string") {
          setCurrentQuality(info.playbackQuality);
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onEnded, sendCommand, volume]);

  // When iframe loads, initiate handshake and set volume
  const handleIframeLoad = () => {
    setIsIframeLoaded(true);
    if (iframeRef.current?.contentWindow) {
      try {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({
            event: "listening",
            id: 1,
            channel: "widget",
          }),
          "*"
        );
      } catch {
        // ignore
      }
    }
    sendCommand("setVolume", [volume]);
  };

  // Local progress ticker for ultra-smooth scrubber tracking
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        const next = prev + 0.5 * playbackRate;
        if (duration > 0) {
          if (next >= duration) return duration;
          if (onProgress) {
            onProgress(Math.round((next / duration) * 100));
          }
        }
        return next;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [isPlaying, playbackRate, duration, onProgress]);

  // Auto-hide controls timer
  const handleMouseMove = useCallback(() => {
    setShowControls(true);
    if (hideControlsTimer.current) {
      clearTimeout(hideControlsTimer.current);
    }
    if (isPlaying) {
      hideControlsTimer.current = setTimeout(() => {
        setShowControls(false);
        setShowSpeedMenu(false);
        setShowQualityMenu(false);
      }, 2500);
    }
  }, [isPlaying]);

  const handleMouseLeave = () => {
    if (isPlaying) {
      setShowControls(false);
      setShowSpeedMenu(false);
      setShowQualityMenu(false);
    }
  };

  const triggerActionFeedback = (type: "play" | "pause" | "fwd" | "rew") => {
    setActionFeedback(type);
    setTimeout(() => setActionFeedback(null), 550);
  };

  // Play / Pause Toggle
  const togglePlay = () => {
    if (!hasStarted) {
      setHasStarted(true);
    }

    if (isPlaying) {
      sendCommand("pauseVideo");
      setIsPlaying(false);
      triggerActionFeedback("pause");
    } else {
      sendCommand("playVideo");
      setIsPlaying(true);
      triggerActionFeedback("play");
    }
  };

  // Seek relative (-10s / +10s)
  const seekRelative = (seconds: number) => {
    const target = Math.max(0, Math.min(duration || 9999, currentTime + seconds));
    sendCommand("seekTo", [target, true]);
    setCurrentTime(target);
    triggerActionFeedback(seconds > 0 ? "fwd" : "rew");
  };

  // Volume slider
  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    sendCommand("setVolume", [newVol]);
    if (newVol === 0) {
      sendCommand("mute");
      setIsMuted(true);
    } else if (isMuted) {
      sendCommand("unMute");
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      sendCommand("unMute");
      sendCommand("setVolume", [volume || 50]);
      setIsMuted(false);
    } else {
      sendCommand("mute");
      setIsMuted(true);
    }
  };

  // Playback speed
  const changeSpeed = (rate: number) => {
    setPlaybackRate(rate);
    setShowSpeedMenu(false);
    sendCommand("setPlaybackRate", [rate]);
  };

  // Playback quality
  const changeQuality = (qLevel: string) => {
    setCurrentQuality(qLevel);
    setShowQualityMenu(false);
    sendCommand("setPlaybackQuality", [qLevel]);
    sendCommand("setPlaybackQualityRange", [qLevel, qLevel]);
  };

  // Scrubber drag / click
  const handleScrubberClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || duration <= 0) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    const targetTime = ratio * duration;
    sendCommand("seekTo", [targetTime, true]);
    setCurrentTime(targetTime);
  };

  const handleScrubberHover = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || duration <= 0) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, x / rect.width));
    setHoverTime(ratio * duration);
    setHoverX(x);
  };

  // Fullscreen
  const toggleFullscreen = async () => {
    if (!containerRef.current) return;
    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (e) {
      console.warn("Fullscreen note:", e);
    }
  };

  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable
      ) {
        return;
      }

      if (e.key === " " || e.key === "k" || e.key === "K") {
        e.preventDefault();
        togglePlay();
      } else if (e.key === "ArrowLeft" || e.key === "j" || e.key === "J") {
        e.preventDefault();
        seekRelative(-10);
      } else if (e.key === "ArrowRight" || e.key === "l" || e.key === "L") {
        e.preventDefault();
        seekRelative(10);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        handleVolumeChange(Math.min(100, volume + 10));
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        handleVolumeChange(Math.max(0, volume - 10));
      } else if (e.key === "m" || e.key === "M") {
        e.preventDefault();
        toggleMute();
      } else if (e.key === "f" || e.key === "F") {
        e.preventDefault();
        toggleFullscreen();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying, volume, isMuted, duration, currentTime, hasStarted]);

  // Screen click: 1 click = play/pause, 2 clicks = rewind/forward
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const handleScreenClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = clickX / rect.width;

    if (e.detail === 1) {
      clickTimeoutRef.current = setTimeout(() => {
        togglePlay();
      }, 220);
    } else if (e.detail === 2) {
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
      if (ratio < 0.35) {
        seekRelative(-10);
      } else if (ratio > 0.65) {
        seekRelative(10);
      } else {
        toggleFullscreen();
      }
    }
  };

  // Block right click context menu
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const bufferPercent = Math.min(100, loadedFraction * 100);
  const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

  const activeQualityObj =
    QUALITY_LIST.find((q) => q.id === currentQuality) || {
      id: "auto",
      label: "Auto",
      badge: "Auto",
    };

  // Build clean YouTube embed URL with exact origin matching
  const originParam = origin ? `&origin=${encodeURIComponent(origin)}&widget_referrer=${encodeURIComponent(origin)}` : "";
  const iframeSrc = `https://www.youtube.com/embed/${videoId}?enablejsapi=1${originParam}&controls=0&rel=0&modestbranding=1&disablekb=1&iv_load_policy=3&playsinline=1&fs=0`;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onContextMenu={handleContextMenu}
      className={`relative aspect-video w-full bg-black overflow-hidden select-none group font-sans ${className}`}
    >
      {/* ========================================================================= */}
      {/* 1. NATIVE YOUTUBE EMBED (Exact 16:9 Pristine Ratio - 0% Distortion)       */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        {mounted && (
          <iframe
            ref={iframeRef}
            src={iframeSrc}
            onLoad={handleIframeLoad}
            title={title || "Video Lecture"}
            className="w-full h-full border-0 pointer-events-none"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2. INITIAL POSTER COVER (Until First Play Click - ZERO FLOATING TEXT)     */}
      {/* ========================================================================= */}
      {!hasStarted && (
        <div
          onClick={togglePlay}
          className="absolute inset-0 z-20 cursor-pointer flex items-center justify-center bg-black"
        >
          {thumbnailUrl && (
            <Image
              src={thumbnailUrl}
              alt={title || "Lecture"}
              fill
              className="object-cover opacity-75"
              priority
            />
          )}
          <div className="absolute inset-0 bg-black/40" />

          {/* Central Glowing Play Icon (Clean, no text) */}
          <div className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-primary to-orange-500 text-white flex items-center justify-center shadow-2xl transition-transform hover:scale-110 border-2 border-white/40">
            <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-white text-white ml-1" />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. PERMANENT TOP SHIELD (Physically Blocks YouTube Title & Copy Link Bar) */}
      {/* ========================================================================= */}
      <div
        onClick={handleScreenClick}
        className="absolute top-0 inset-x-0 h-14 sm:h-16 z-20 bg-gradient-to-b from-slate-950 via-slate-950/85 to-transparent pointer-events-auto cursor-pointer"
        title="প্লে অথবা পজ করতে ক্লিক করুন"
      />

      {/* ========================================================================= */}
      {/* 4. INTERACTIVE CLICK SHIELD (Screen Click to Play / Pause)                */}
      {/* ========================================================================= */}
      <div
        onClick={handleScreenClick}
        className="absolute inset-0 z-10 cursor-pointer"
      />

      {/* Center Action Feedback Ripple */}
      {actionFeedback && (
        <div className="absolute inset-0 z-25 flex items-center justify-center pointer-events-none">
          <div className="w-14 h-14 sm:w-18 sm:h-18 rounded-full bg-black/80 backdrop-blur-md text-white flex items-center justify-center shadow-2xl animate-ping border border-white/20">
            {actionFeedback === "play" && <Play className="w-7 h-7 fill-white ml-1" />}
            {actionFeedback === "pause" && <Pause className="w-7 h-7 fill-white" />}
            {actionFeedback === "rew" && (
              <div className="flex flex-col items-center">
                <RotateCcw className="w-5 h-5" />
                <span className="text-[10px] font-bold">-10s</span>
              </div>
            )}
            {actionFeedback === "fwd" && (
              <div className="flex flex-col items-center">
                <RotateCw className="w-5 h-5" />
                <span className="text-[10px] font-bold">+10s</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Subtle Buffering Spinner */}
      {isBuffering && isPlaying && (
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-3 border-white/20 border-t-primary animate-spin" />
        </div>
      )}

      {/* Center Play Button When Paused (ZERO FLOATING TEXT) */}
      {hasStarted && !isPlaying && (
        <div
          onClick={togglePlay}
          className="absolute inset-0 z-20 flex items-center justify-center cursor-pointer bg-black/50 backdrop-blur-[1px] transition-all"
        >
          <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-gradient-to-tr from-primary to-orange-500 text-white flex items-center justify-center shadow-2xl transition-transform hover:scale-110 border-2 border-white/30">
            <Play className="w-8 h-8 sm:w-9 sm:h-9 fill-white text-white ml-1" />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. BOTTOM CONTROLS BAR (Physically Covers YouTube Watermark Logo)         */}
      {/* ========================================================================= */}
      <div
        className={`absolute bottom-0 inset-x-0 z-30 px-3 py-2.5 sm:px-4 sm:py-3.5 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent transition-all duration-300 ${
          showControls || !isPlaying
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-2 pointer-events-none"
        }`}
      >
        {/* Scrubber Timeline */}
        <div
          ref={progressBarRef}
          onClick={handleScrubberClick}
          onMouseMove={handleScrubberHover}
          onMouseLeave={() => setHoverTime(null)}
          className="relative h-1.5 sm:h-2 w-full bg-white/20 rounded-full cursor-pointer mb-2 sm:mb-2.5 group/progress transition-all hover:h-2.5"
        >
          {/* Buffered */}
          <div
            className="absolute top-0 left-0 h-full bg-white/30 rounded-full transition-all duration-150"
            style={{ width: `${bufferPercent}%` }}
          />

          {/* Played */}
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary via-orange-500 to-amber-400 rounded-full"
            style={{ width: `${progressPercent}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-white shadow-lg border-2 border-primary scale-0 group-hover/progress:scale-100 transition-transform" />
          </div>

          {/* Hover Time Tooltip */}
          {hoverTime !== null && (
            <div
              className="absolute -top-7 px-2 py-0.5 rounded bg-slate-900/95 border border-white/20 text-[10px] font-mono font-bold text-white shadow-lg pointer-events-none -translate-x-1/2"
              style={{ left: `${hoverX}px` }}
            >
              {formatTime(hoverTime)}
            </div>
          )}
        </div>

        {/* Controls Row */}
        <div className="flex items-center justify-between text-white text-xs">
          {/* Left: Play, Time, Volume */}
          <div className="flex items-center gap-1 sm:gap-2.5">
            <button
              type="button"
              onClick={togglePlay}
              className="p-1 rounded-lg hover:bg-white/15 transition-colors cursor-pointer text-white"
              title={isPlaying ? "পজ করুন (Space)" : "প্লে করুন (Space)"}
            >
              {isPlaying ? (
                <Pause className="w-4.5 h-4.5 sm:w-5 sm:h-5 fill-white text-white" />
              ) : (
                <Play className="w-4.5 h-4.5 sm:w-5 sm:h-5 fill-white text-white" />
              )}
            </button>

            {/* Desktop -10s */}
            <button
              type="button"
              onClick={() => seekRelative(-10)}
              className="p-1 rounded-lg hover:bg-white/15 transition-colors cursor-pointer text-white/90 hover:text-white hidden sm:block"
              title="১০ সেকেন্ড পিছিয়ে যান (Left Arrow)"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Desktop +10s */}
            <button
              type="button"
              onClick={() => seekRelative(10)}
              className="p-1 rounded-lg hover:bg-white/15 transition-colors cursor-pointer text-white/90 hover:text-white hidden sm:block"
              title="১০ সেকেন্ড এগিয়ে যান (Right Arrow)"
            >
              <RotateCw className="w-4 h-4" />
            </button>

            {/* Volume */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={toggleMute}
                className="p-1 rounded-lg hover:bg-white/15 transition-colors cursor-pointer text-white/90 hover:text-white"
                title={isMuted ? "আনমিউট করুন (M)" : "মিউট করুন (M)"}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-rose-400" />
                ) : volume < 50 ? (
                  <Volume1 className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                ) : (
                  <Volume2 className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                )}
              </button>

              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : volume}
                onChange={(e) => handleVolumeChange(Number(e.target.value))}
                className="w-12 sm:w-16 h-1 bg-white/25 accent-primary rounded-lg cursor-pointer transition-all hidden sm:block"
                title="ভলিউম নিয়ন্ত্রণ"
              />
            </div>

            {/* Time */}
            <div className="text-[10px] sm:text-xs font-mono font-bold text-white/90 tracking-tight ml-0.5">
              <span>{formatTime(currentTime)}</span>
              <span className="text-white/40 mx-1">/</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Right: Quality, Speed, Fullscreen */}
          <div className="flex items-center gap-1 sm:gap-2 relative">
            {/* Quality Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowQualityMenu(!showQualityMenu);
                  setShowSpeedMenu(false);
                }}
                className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-[10px] sm:text-xs font-bold font-mono transition-colors flex items-center gap-1 cursor-pointer"
                title="ভিডিও রেজোলিউশন / কোয়ালিটি"
              >
                <Sliders className="w-3 h-3 text-amber-400" />
                <span>{activeQualityObj.badge}</span>
              </button>

              {/* Quality Dropdown */}
              {showQualityMenu && (
                <div className="absolute bottom-full right-0 mb-2 w-36 rounded-xl bg-slate-900/98 backdrop-blur-md border border-slate-700 shadow-2xl p-1.5 space-y-0.5 z-40">
                  <div className="text-[10px] font-bold uppercase text-slate-400 px-2 py-1 border-b border-slate-800">
                    রেজোলিউশন নির্বাচন
                  </div>
                  {QUALITY_LIST.map((q) => (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => changeQuality(q.id)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center justify-between cursor-pointer transition-colors ${
                        currentQuality === q.id
                          ? "bg-primary text-white"
                          : "text-slate-300 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <span>{q.label}</span>
                      {currentQuality === q.id && <Check className="w-3 h-3" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Speed Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowSpeedMenu(!showSpeedMenu);
                  setShowQualityMenu(false);
                }}
                className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-[10px] sm:text-xs font-bold font-mono transition-colors flex items-center gap-1 cursor-pointer"
                title="প্লেব্যাক স্পিড"
              >
                <span>{playbackRate}x</span>
              </button>

              {/* Speed Menu Dropdown */}
              {showSpeedMenu && (
                <div className="absolute bottom-full right-0 mb-2 w-28 rounded-xl bg-slate-900/98 backdrop-blur-md border border-slate-700 shadow-2xl p-1.5 space-y-0.5 z-40">
                  <div className="text-[10px] font-bold uppercase text-slate-400 px-2 py-1 border-b border-slate-800">
                    গতি নির্ধারণ
                  </div>
                  {speedOptions.map((rate) => (
                    <button
                      key={rate}
                      type="button"
                      onClick={() => changeSpeed(rate)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center justify-between cursor-pointer transition-colors ${
                        playbackRate === rate
                          ? "bg-primary text-white"
                          : "text-slate-300 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <span>{rate}x</span>
                      {playbackRate === rate && <Check className="w-3 h-3" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Fullscreen Button */}
            <button
              type="button"
              onClick={toggleFullscreen}
              className="p-1 rounded-lg hover:bg-white/15 transition-colors cursor-pointer text-white/90 hover:text-white"
              title={isFullscreen ? "ফুলস্ক্রিন থেকে বের হন (F)" : "ফুলস্ক্রিন করুন (F)"}
            >
              {isFullscreen ? (
                <Minimize className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              ) : (
                <Maximize className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
