"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Hls from "hls.js";
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
  Settings,
} from "lucide-react";
import { DevToolsDetector } from "@/components/video/devtools-detector";

export interface HlsVideoPlayerProps {
  src: string;
  title?: string;
  thumbnailUrl?: string;
  autoPlay?: boolean;
  initialDuration?: string | number;
  onEnded?: () => void;
  onProgress?: (progressPercent: number) => void;
  className?: string;
  token?: string;
  enableDevToolsProtection?: boolean;
}

interface QualityLevel {
  id: number; // -1 for Auto
  label: string;
  height: number;
  bitrate?: number;
}

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return "00:00";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  if (h > 0) return `${pad(h)}:${pad(m)}:${pad(s)}`;
  return `${pad(m)}:${pad(s)}`;
}

export function HlsVideoPlayer({
  src,
  title,
  thumbnailUrl,
  autoPlay = false,
  initialDuration,
  onEnded,
  onProgress,
  className = "",
  token,
  enableDevToolsProtection = true,
}: HlsVideoPlayerProps) {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const shadowHostRef = useRef<HTMLDivElement>(null);
  const shadowRootRef = useRef<ShadowRoot | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const hideControlsTimer = useRef<NodeJS.Timeout | null>(null);

  const CONTROLS_AUTOHIDE_MS = 6000;

  // Playback states
  const [hasStarted, setHasStarted] = useState(autoPlay);
  const [isPlaying, setIsPlaying] = useState(false);
  const isPlayingRef = useRef(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [bufferedPercent, setBufferedPercent] = useState(0);
  const [volume, setVolume] = useState(90);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [isDomPurged, setIsDomPurged] = useState(false);

  // Quality levels
  const [qualities, setQualities] = useState<QualityLevel[]>([
    { id: -1, label: "Auto (অটো)", height: 0 },
  ]);
  const [currentQualityId, setCurrentQualityId] = useState<number>(-1);

  // Scrubber drag & hover
  const isDraggingScrubber = useRef(false);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverX, setHoverX] = useState<number>(0);
  const [actionFeedback, setActionFeedback] = useState<"play" | "pause" | "fwd" | "rew" | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Centralized auto-hide scheduler
  const scheduleHide = useCallback((delay: number = CONTROLS_AUTOHIDE_MS) => {
    if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
    hideControlsTimer.current = setTimeout(() => {
      setShowControls(false);
      setShowSpeedMenu(false);
      setShowQualityMenu(false);
    }, delay);
  }, []);

  const showAndScheduleHide = useCallback(() => {
    setShowControls(true);
    if (isPlayingRef.current) {
      scheduleHide(CONTROLS_AUTOHIDE_MS);
    }
  }, [scheduleHide]);

  // Imperative Closed Shadow DOM & HLS Engine Mounting
  useEffect(() => {
    if (!mounted || !hasStarted || isDomPurged) {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      if (shadowRootRef.current) {
        shadowRootRef.current.replaceChildren();
      }
      videoRef.current = null;
      return;
    }

    const host = shadowHostRef.current;
    if (!host) return;

    if (!shadowRootRef.current) {
      try {
        shadowRootRef.current = host.attachShadow({ mode: "closed" });
      } catch {}
    }

    const shadow = shadowRootRef.current;
    if (!shadow) return;

    shadow.replaceChildren();

    // Create native video element inside Closed Shadow Root
    const video = document.createElement("video");
    video.className = "w-full h-full object-contain absolute inset-0 bg-black";
    video.playsInline = true;
    video.crossOrigin = "anonymous";
    video.controls = false;
    video.disablePictureInPicture = true;
    video.setAttribute("controlsList", "nodownload nofullscreen noremoteplayback");

    shadow.appendChild(video);
    videoRef.current = video;

    // Apply volume
    video.volume = isMuted ? 0 : volume / 100;
    video.playbackRate = playbackRate;

    // Video event listeners
    video.onplay = () => {
      isPlayingRef.current = true;
      setIsPlaying(true);
      setIsBuffering(false);
      scheduleHide(CONTROLS_AUTOHIDE_MS);
    };

    video.onpause = () => {
      isPlayingRef.current = false;
      setIsPlaying(false);
      setIsBuffering(false);
      setShowControls(true);
      if (hideControlsTimer.current) {
        clearTimeout(hideControlsTimer.current);
        hideControlsTimer.current = null;
      }
    };

    video.onwaiting = () => setIsBuffering(true);
    video.onplaying = () => setIsBuffering(false);

    video.ontimeupdate = () => {
      if (!isDraggingScrubber.current) {
        setCurrentTime(video.currentTime);
        if (video.duration > 0 && onProgress) {
          onProgress(Math.round((video.currentTime / video.duration) * 100));
        }
      }
      // Calculate buffer
      if (video.buffered.length > 0 && video.duration > 0) {
        try {
          const bufferedEnd = video.buffered.end(video.buffered.length - 1);
          setBufferedPercent(Math.min(100, (bufferedEnd / video.duration) * 100));
        } catch {}
      }
    };

    video.ondurationchange = () => {
      if (video.duration > 0) setDuration(video.duration);
    };

    video.onended = () => {
      isPlayingRef.current = false;
      setIsPlaying(false);
      onEnded?.();
    };

    // Determine HLS Stream source (with proxy if needed)
    let streamUrl = src;
    if (token && !src.includes("token=")) {
      const sep = src.includes("?") ? "&" : "?";
      streamUrl = `${src}${sep}token=${encodeURIComponent(token)}`;
    }

    // Initialize HLS.js (MediaSource + Blob Streaming)
    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        xhrSetup: (xhr) => {
          if (token) {
            xhr.setRequestHeader("Authorization", `Bearer ${token}`);
          }
        },
      });

      hls.attachMedia(video);
      hls.on(Hls.Events.MEDIA_ATTACHED, () => {
        hls.loadSource(streamUrl);
      });

      hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
        const parsedQualities: QualityLevel[] = [
          { id: -1, label: "Auto (অটো)", height: 0 },
        ];
        data.levels.forEach((lvl, idx) => {
          const label = lvl.height ? `${lvl.height}p` : `Bitrate: ${Math.round(lvl.bitrate / 1000)}k`;
          parsedQualities.push({
            id: idx,
            label,
            height: lvl.height || 0,
            bitrate: lvl.bitrate,
          });
        });
        setQualities(parsedQualities);
        video.play().catch(() => {});
      });

      hls.on(Hls.Events.LEVEL_SWITCHED, (_, data) => {
        setCurrentQualityId(data.level);
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              hls.destroy();
              break;
          }
        }
      });

      hlsRef.current = hls;
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // Native Apple HLS (Safari/iOS)
      video.src = streamUrl;
      video.addEventListener("loadedmetadata", () => {
        video.play().catch(() => {});
      });
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      if (shadowRootRef.current) {
        shadowRootRef.current.replaceChildren();
      }
      videoRef.current = null;
    };
  }, [mounted, hasStarted, isDomPurged, src, token, onEnded, onProgress, scheduleHide]);

  // Controls logic
  const triggerActionFeedback = (type: "play" | "pause" | "fwd" | "rew") => {
    setActionFeedback(type);
    setTimeout(() => setActionFeedback(null), 550);
  };

  const togglePlay = () => {
    if (!hasStarted) {
      setHasStarted(true);
      return;
    }
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => {});
      triggerActionFeedback("play");
    } else {
      video.pause();
      triggerActionFeedback("pause");
    }
  };

  const seekRelative = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.max(0, Math.min(video.duration || 0, video.currentTime + seconds));
    triggerActionFeedback(seconds > 0 ? "fwd" : "rew");
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    if (videoRef.current) {
      videoRef.current.volume = newVolume / 100;
      videoRef.current.muted = newVolume === 0;
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      if (videoRef.current) {
        videoRef.current.muted = false;
        videoRef.current.volume = volume / 100;
      }
    } else {
      setIsMuted(true);
      if (videoRef.current) {
        videoRef.current.muted = true;
      }
    }
  };

  const handlePlaybackRateChange = (rate: number) => {
    setPlaybackRate(rate);
    setShowSpeedMenu(false);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
  };

  const handleQualityChange = (levelId: number) => {
    setCurrentQualityId(levelId);
    setShowQualityMenu(false);
    if (hlsRef.current) {
      hlsRef.current.currentLevel = levelId;
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Scrubber dragging
  const handleScrubberPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !videoRef.current || duration <= 0) return;
    isDraggingScrubber.current = true;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);

    const rect = progressBarRef.current.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const targetTime = pos * duration;
    setCurrentTime(targetTime);
    videoRef.current.currentTime = targetTime;
  };

  const handleScrubberPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || duration <= 0) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setHoverX(e.clientX - rect.left);
    setHoverTime(pos * duration);

    if (isDraggingScrubber.current && videoRef.current) {
      const targetTime = pos * duration;
      setCurrentTime(targetTime);
      videoRef.current.currentTime = targetTime;
    }
  };

  const handleScrubberPointerUp = () => {
    isDraggingScrubber.current = false;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

  return (
    <DevToolsDetector
      enabled={enableDevToolsProtection}
      onDevToolsChange={(isOpen) => {
        if (isOpen) {
          setIsDomPurged(true);
          if (hlsRef.current) {
            hlsRef.current.destroy();
            hlsRef.current = null;
          }
          if (shadowRootRef.current) {
            shadowRootRef.current.replaceChildren();
          }
          videoRef.current = null;
        } else {
          setIsDomPurged(false);
        }
      }}
    >
      <div
        ref={containerRef}
        onMouseMove={showAndScheduleHide}
        onMouseLeave={() => isPlaying && scheduleHide(CONTROLS_AUTOHIDE_MS)}
        onTouchStart={showAndScheduleHide}
        onContextMenu={(e) => e.preventDefault()}
        className={`relative aspect-video w-full bg-black overflow-hidden select-none group font-sans ${className}`}
      >
        {/* Decoy Injections */}
        <div className="sr-only hidden" aria-hidden="true" tabIndex={-1}>
          <iframe
            src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?controls=0"
            className="hidden w-0 h-0 pointer-events-none"
            tabIndex={-1}
            title="Manifest Decoy"
          />
        </div>

        {/* Closed Shadow DOM Host — contains native <video> with blob: buffer */}
        <div
          ref={shadowHostRef}
          className="absolute inset-0 overflow-hidden pointer-events-none select-none"
          id="hls-secure-host"
        />

        {/* Initial Poster Cover */}
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
            <div className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-primary to-orange-500 text-white flex items-center justify-center shadow-2xl transition-transform hover:scale-110 border-2 border-white/40">
              <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-white text-white ml-1" />
            </div>
          </div>
        )}

        {/* Click Shield to Play/Pause */}
        <div onClick={togglePlay} className="absolute inset-0 z-10 cursor-pointer" />

        {/* Action Feedback Ripple */}
        {actionFeedback && (
          <div className="absolute inset-0 z-25 flex items-center justify-center pointer-events-none">
            <div className="w-16 h-16 rounded-full bg-black/80 backdrop-blur-md text-white flex items-center justify-center shadow-2xl animate-ping border border-white/20">
              {actionFeedback === "play" && <Play className="w-8 h-8 fill-white ml-1" />}
              {actionFeedback === "pause" && <Pause className="w-8 h-8 fill-white" />}
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

        {/* Buffering Spinner */}
        {isBuffering && isPlaying && (
          <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
            <div className="w-12 h-12 rounded-full border-3 border-white/20 border-t-primary animate-spin" />
          </div>
        )}

        {/* Top Header Bar */}
        <div
          className={`absolute top-0 inset-x-0 z-30 h-16 px-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent transition-opacity duration-300 pointer-events-none flex items-center justify-between ${
            showControls || !isPlaying ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              HLS ENCRYPTED BLOB
            </span>
            {title && (
              <span className="text-white text-xs sm:text-sm font-semibold truncate max-w-md">
                {title}
              </span>
            )}
          </div>
        </div>

        {/* Bottom Control Bar */}
        <div
          className={`absolute bottom-0 inset-x-0 z-30 bg-gradient-to-t from-black/95 via-black/75 to-transparent px-3 sm:px-5 pb-3 pt-8 transition-opacity duration-300 ${
            showControls || !isPlaying ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Scrubber Bar */}
          <div
            ref={progressBarRef}
            onPointerDown={handleScrubberPointerDown}
            onPointerMove={handleScrubberPointerMove}
            onPointerUp={handleScrubberPointerUp}
            onPointerLeave={() => setHoverTime(null)}
            className="group/scrubber relative h-2.5 hover:h-4 w-full cursor-pointer flex items-center transition-all mb-3"
          >
            {/* Hover Tooltip */}
            {hoverTime !== null && (
              <div
                style={{ left: `${hoverX}px` }}
                className="absolute -top-7 -translate-x-1/2 bg-black/90 text-white text-[11px] font-mono px-2 py-0.5 rounded border border-white/10 pointer-events-none z-40 shadow-lg"
              >
                {formatTime(hoverTime)}
              </div>
            )}

            {/* Track Background */}
            <div className="w-full h-1 group-hover/scrubber:h-2 bg-white/20 rounded-full overflow-hidden relative transition-all">
              {/* Buffered Progress */}
              <div
                style={{ width: `${bufferedPercent}%` }}
                className="absolute top-0 bottom-0 left-0 bg-white/30 transition-all duration-200"
              />
              {/* Played Progress */}
              <div
                style={{ width: `${progressPercent}%` }}
                className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-primary to-orange-500 rounded-full"
              />
            </div>

            {/* Thumb */}
            <div
              style={{ left: `${progressPercent}%` }}
              className="absolute -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-white shadow-md border border-primary scale-0 group-hover/scrubber:scale-100 transition-transform pointer-events-none"
            />
          </div>

          {/* Controls Bottom Row */}
          <div className="flex items-center justify-between gap-2 text-white">
            {/* Left Section: Play/Pause, Rewind, Forward, Time */}
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                type="button"
                onClick={togglePlay}
                className="p-1.5 rounded-lg hover:bg-white/10 active:scale-95 transition-all text-white"
                title={isPlaying ? "Pause (K)" : "Play (K)"}
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white" />}
              </button>

              <button
                type="button"
                onClick={() => seekRelative(-10)}
                className="p-1.5 rounded-lg hover:bg-white/10 active:scale-95 transition-all text-white/90 hover:text-white"
                title="10s Rewind (J)"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => seekRelative(10)}
                className="p-1.5 rounded-lg hover:bg-white/10 active:scale-95 transition-all text-white/90 hover:text-white"
                title="10s Forward (L)"
              >
                <RotateCw className="w-4 h-4" />
              </button>

              {/* Volume */}
              <div className="flex items-center gap-1.5 group/vol">
                <button
                  type="button"
                  onClick={toggleMute}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-white/90 hover:text-white"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-4 h-4 text-red-400" />
                  ) : volume < 50 ? (
                    <Volume1 className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => handleVolumeChange(Number(e.target.value))}
                  className="w-14 sm:w-20 h-1 accent-primary bg-white/20 rounded-full cursor-pointer opacity-80 hover:opacity-100"
                />
              </div>

              {/* Time display */}
              <div className="text-[11px] sm:text-xs font-mono text-white/80">
                <span>{formatTime(currentTime)}</span>
                <span className="mx-1 text-white/40">/</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Right Section: Quality, Speed, Fullscreen */}
            <div className="flex items-center gap-2 sm:gap-3 relative">
              {/* Quality Selector */}
              {qualities.length > 1 && (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setShowQualityMenu(!showQualityMenu);
                      setShowSpeedMenu(false);
                    }}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-all"
                  >
                    <Sliders className="w-3.5 h-3.5 text-primary" />
                    <span>
                      {qualities.find((q) => q.id === currentQualityId)?.label || "Auto"}
                    </span>
                  </button>

                  {showQualityMenu && (
                    <div className="absolute bottom-10 right-0 w-36 bg-slate-900/95 backdrop-blur-md rounded-xl border border-white/10 shadow-2xl p-1.5 z-50 flex flex-col gap-0.5">
                      <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase">
                        কোয়ালিটি
                      </div>
                      {qualities.map((q) => (
                        <button
                          key={q.id}
                          type="button"
                          onClick={() => handleQualityChange(q.id)}
                          className={`flex items-center justify-between px-2 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            currentQualityId === q.id
                              ? "bg-primary/20 text-primary font-bold"
                              : "text-slate-300 hover:bg-white/10 hover:text-white"
                          }`}
                        >
                          <span>{q.label}</span>
                          {currentQualityId === q.id && <Check className="w-3.5 h-3.5 text-primary" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Playback Speed */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setShowSpeedMenu(!showSpeedMenu);
                    setShowQualityMenu(false);
                  }}
                  className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-all"
                >
                  {playbackRate}x
                </button>

                {showSpeedMenu && (
                  <div className="absolute bottom-10 right-0 w-28 bg-slate-900/95 backdrop-blur-md rounded-xl border border-white/10 shadow-2xl p-1.5 z-50 flex flex-col gap-0.5">
                    <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase">
                      স্পিড
                    </div>
                    {speedOptions.map((rate) => (
                      <button
                        key={rate}
                        type="button"
                        onClick={() => handlePlaybackRateChange(rate)}
                        className={`flex items-center justify-between px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
                          playbackRate === rate
                            ? "bg-primary/20 text-primary font-bold"
                            : "text-slate-300 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        <span>{rate}x</span>
                        {playbackRate === rate && <Check className="w-3.5 h-3.5 text-primary" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Fullscreen */}
              <button
                type="button"
                onClick={toggleFullscreen}
                className="p-1.5 rounded-lg hover:bg-white/10 active:scale-95 transition-all text-white"
                title="Fullscreen (F)"
              >
                {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </DevToolsDetector>
  );
}
