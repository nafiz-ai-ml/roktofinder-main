import { useState, useRef, useEffect, useCallback } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  RotateCcw,
  Sparkles,
} from "lucide-react";

interface HeroVideoPlayerProps {
  src?: string;
  poster?: string;
  title?: string;
  className?: string;
}

function formatTime(seconds: number): string {
  if (isNaN(seconds) || !isFinite(seconds)) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export function HeroVideoPlayer({
  src = "/videos/hero.mp4",
  poster,
  title = "RoktoFinder — প্ল্যাটফর্ম ভিডিও পরিচিতি",
  className = "",
}: HeroVideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressTrackRef = useRef<HTMLDivElement>(null);
  const hideControlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Auto-hide controls during playback after 2.5s of no interaction
  const triggerShowControls = useCallback(() => {
    setShowControls(true);
    if (hideControlsTimeoutRef.current) {
      clearTimeout(hideControlsTimeoutRef.current);
    }
    if (isPlaying && !isScrubbing) {
      hideControlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 2500);
    }
  }, [isPlaying, isScrubbing]);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused || video.ended) {
      video.play().catch(() => {});
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
    triggerShowControls();
  }, [triggerShowControls]);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    const nextMuted = !video.muted;
    video.muted = nextMuted;
    setIsMuted(nextMuted);
    triggerShowControls();
  }, [triggerShowControls]);

  const toggleFullscreen = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
    triggerShowControls();
  }, [triggerShowControls]);

  const restartVideo = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = 0;
    video.play().catch(() => {});
    setIsPlaying(true);
    triggerShowControls();
  }, [triggerShowControls]);

  // Handle Fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Update time and progress as video plays
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || isScrubbing) return;
    setCurrentTime(video.currentTime);
  };

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (!video) return;
    setDuration(video.duration || 0);
    setIsLoaded(true);
  };

  // Timeline Scrubbing calculations
  const seekToPosition = (clientX: number) => {
    const track = progressTrackRef.current;
    const video = videoRef.current;
    if (!track || !video || !duration) return;

    const rect = track.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const newTime = pos * duration;
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleScrubberMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsScrubbing(true);
    seekToPosition(e.clientX);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      seekToPosition(moveEvent.clientX);
    };

    const handleMouseUp = () => {
      setIsScrubbing(false);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleScrubberTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setIsScrubbing(true);
    if (e.touches[0]) {
      seekToPosition(e.touches[0].clientX);
    }

    const handleTouchMove = (moveEvent: TouchEvent) => {
      if (moveEvent.touches[0]) {
        seekToPosition(moveEvent.touches[0].clientX);
      }
    };

    const handleTouchEnd = () => {
      setIsScrubbing(false);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };

    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);
  };

  // IntersectionObserver: Pause when out of screen to conserve resources
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            if (!video.paused) {
              video.pause();
              setIsPlaying(false);
            }
          }
        });
      },
      { threshold: 0.25 },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  // Keyboard controls
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === " " || e.key === "k") {
      e.preventDefault();
      togglePlay();
    } else if (e.key === "m") {
      e.preventDefault();
      toggleMute();
    } else if (e.key === "f") {
      e.preventDefault();
      toggleFullscreen();
    }
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      onMouseEnter={() => {
        setIsHovered(true);
        triggerShowControls();
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        if (isPlaying && !isScrubbing) {
          setShowControls(false);
        }
      }}
      onMouseMove={triggerShowControls}
      className={`group relative mx-auto w-full max-w-4xl focus:outline-hidden ${className}`}
    >
      {/* Ambient background glow */}
      <div className="absolute -inset-1 -z-10 rounded-3xl bg-gradient-to-r from-primary/30 via-destructive/20 to-primary/30 opacity-70 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />

      {/* Frame Container */}
      <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card/90 shadow-2xl backdrop-blur-md transition-all duration-300 sm:rounded-3xl">
        {/* Modern Window Title Bar */}
        <div className="flex h-11 items-center justify-between border-b border-border/70 bg-muted/40 px-4 select-none sm:px-5">
          {/* Mac-style Window Controls */}
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-rose-500/80 transition-transform group-hover:scale-105" />
            <span className="h-3 w-3 rounded-full bg-amber-500/80 transition-transform group-hover:scale-105" />
            <span className="h-3 w-3 rounded-full bg-emerald-500/80 transition-transform group-hover:scale-105" />
          </div>

          {/* Title & Live Status */}
          <div className="flex items-center gap-2 text-xs font-medium text-foreground/90">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            <span className="truncate max-w-[200px] sm:max-w-none">{title}</span>
          </div>

          {/* Quality badge */}
          <div className="hidden items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold text-primary sm:flex">
            <Sparkles className="h-3 w-3" />
            <span>HD 1080p</span>
          </div>
        </div>

        {/* Video Canvas Area */}
        <div
          onClick={togglePlay}
          className="relative aspect-video w-full cursor-pointer overflow-hidden bg-black"
        >
          <video
            ref={videoRef}
            src={src}
            poster={poster}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            className="h-full w-full object-cover"
          />

          {/* Quick Unmute Floating Banner (visible when muted during playback) */}
          {isMuted && isPlaying && (
            <div
              onClick={(e) => {
                e.stopPropagation();
                toggleMute();
              }}
              className="absolute top-4 right-4 z-20 flex items-center gap-2 rounded-full border border-white/20 bg-black/75 px-3.5 py-1.5 text-xs font-medium text-white shadow-lg backdrop-blur-md transition-all hover:scale-105 hover:bg-black/90"
            >
              <VolumeX className="h-3.5 w-3.5 text-primary animate-pulse" />
              <span>সাউন্ড অন করুন</span>
            </div>
          )}

          {/* Center Play/Pause Overlay Icon (visible when paused or on hover) */}
          {(!isPlaying || isHovered) && (
            <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-black/25 backdrop-blur-[1px] transition-opacity duration-300">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/30 bg-primary/90 text-white shadow-2xl transition-transform duration-300 hover:scale-110 sm:h-20 sm:w-20">
                {isPlaying ? (
                  <Pause className="h-7 w-7 sm:h-9 sm:w-9" />
                ) : (
                  <Play className="ml-1 h-7 w-7 sm:h-9 sm:w-9 fill-white" />
                )}
              </div>
            </div>
          )}

          {/* Interactive Modern Bottom Controls Bar */}
          <div
            onClick={(e) => e.stopPropagation()}
            className={`absolute inset-x-0 bottom-0 z-20 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3 pt-8 transition-all duration-300 sm:p-4 ${
              showControls || !isPlaying
                ? "opacity-100 translate-y-0"
                : "pointer-events-none opacity-0 translate-y-2"
            }`}
          >
            {/* Scrubber / Progress Bar */}
            <div
              ref={progressTrackRef}
              onMouseDown={handleScrubberMouseDown}
              onTouchStart={handleScrubberTouchStart}
              className="group/scrub relative flex h-4 w-full cursor-pointer items-center py-1"
            >
              {/* Background Track */}
              <div className="relative h-1.5 w-full rounded-full bg-white/25 transition-all group-hover/scrub:h-2">
                {/* Active Progress */}
                <div
                  className="relative h-full rounded-full bg-gradient-to-r from-primary to-destructive transition-[width] duration-75"
                  style={{ width: `${progressPercent}%` }}
                >
                  {/* Scrubber thumb knob */}
                  <span className="absolute top-1/2 right-0 h-3.5 w-3.5 -translate-y-1/2 translate-x-1/2 scale-0 rounded-full border-2 border-primary bg-white shadow-md transition-transform group-hover/scrub:scale-100" />
                </div>
              </div>
            </div>

            {/* Bottom Actions Row */}
            <div className="mt-1 flex items-center justify-between text-white select-none">
              {/* Left Controls: Play, Restart, Time */}
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={togglePlay}
                  aria-label={isPlaying ? "বিরতি দিন" : "চালু করুন"}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white transition-colors hover:bg-white/20"
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="ml-0.5 h-4 w-4 fill-white" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={restartVideo}
                  aria-label="শুরু থেকে দেখুন"
                  title="শুরু থেকে দেখুন"
                  className="hidden h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white transition-colors hover:bg-white/20 sm:flex"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>

                {/* Time Display */}
                <div className="text-xs font-medium tabular-nums text-white/90">
                  <span>{formatTime(currentTime)}</span>
                  <span className="mx-1 text-white/50">/</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Right Controls: Volume / Fullscreen */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleMute}
                  aria-label={isMuted ? "সাউন্ড অন করুন" : "মিউট করুন"}
                  title={isMuted ? "সাউন্ড অন করুন" : "মিউট করুন"}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white transition-colors hover:bg-white/20"
                >
                  {isMuted ? (
                    <VolumeX className="h-4 w-4 text-white/70" />
                  ) : (
                    <Volume2 className="h-4 w-4 text-primary" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={toggleFullscreen}
                  aria-label={isFullscreen ? "ফুলস্ক্রিন থেকে প্রস্থান" : "ফুলস্ক্রিন করুন"}
                  title={isFullscreen ? "ফুলস্ক্রিন থেকে প্রস্থান" : "ফুলস্ক্রিন করুন"}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white transition-colors hover:bg-white/20"
                >
                  {isFullscreen ? (
                    <Minimize className="h-4 w-4" />
                  ) : (
                    <Maximize className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
