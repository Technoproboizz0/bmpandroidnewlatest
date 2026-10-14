import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import type { Track } from "./tracks";

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

type Ctx = {
  current: Track | null;
  queue: Track[];
  playing: boolean;
  progress: number;
  duration: number;
  liked: Track[];
  playList: (list: Track[], index: number) => void;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  seek: (s: number) => void;
  toggleLike: (t: Track) => void;
  isLiked: (id: string) => boolean;
  expanded: boolean;
  setExpanded: (v: boolean) => void;
};

const PlayerCtx = createContext<Ctx | null>(null);
export const usePlayer = () => {
  const c = useContext(PlayerCtx);
  if (!c) throw new Error("usePlayer outside provider");
  return c;
};

export function PlayerProvider({ children }: { children: ReactNode }) {
  const yt = useRef<any>(null);
  const ready = useRef(false);
  const [queue, setQueue] = useState<Track[]>([]);
  const [index, setIndex] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [liked, setLiked] = useState<Track[]>([]);
  const [expanded, setExpanded] = useState(false);
  const nextRef = useRef<() => void>(() => {});

  useEffect(() => {
    try {
      setLiked(JSON.parse(localStorage.getItem("bytes-liked") || "[]"));
    } catch {
      /* ignore */
    }
    const init = () => {
      yt.current = new window.YT.Player("yt-host", {
        height: "1",
        width: "1",
        playerVars: { playsinline: 1, controls: 0 },
        events: {
          onReady: () => (ready.current = true),
          onStateChange: (e: any) => {
            if (e.data === 1) setPlaying(true);
            if (e.data === 2) setPlaying(false);
            if (e.data === 0) nextRef.current();
          },
        },
      });
    };
    if (window.YT?.Player) init();
    else {
      window.onYouTubeIframeAPIReady = init;
      const s = document.createElement("script");
      s.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(s);
    }
    const t = setInterval(() => {
      const p = yt.current;
      if (ready.current && p?.getCurrentTime) {
        setProgress(p.getCurrentTime() || 0);
        setDuration(p.getDuration() || 0);
      }
    }, 500);
    return () => clearInterval(t);
  }, []);

  const load = useCallback((t: Track) => {
    if (ready.current) yt.current.loadVideoById(t.id);
    setProgress(0);
    setPlaying(true);
  }, []);

  const playList = useCallback(
    (list: Track[], i: number) => {
      setQueue(list);
      setIndex(i);
      load(list[i]!);
    },
    [load],
  );

  const next = useCallback(() => {
    if (!queue.length) return;
    const i = (index + 1) % queue.length;
    setIndex(i);
    load(queue[i]!);
  }, [queue, index, load]);
  nextRef.current = next;

  const prev = useCallback(() => {
    if (!queue.length) return;
    if (progress > 3) return yt.current?.seekTo(0, true);
    const i = (index - 1 + queue.length) % queue.length;
    setIndex(i);
    load(queue[i]!);
  }, [queue, index, progress, load]);

  const toggle = () => {
    if (!ready.current || index < 0) return;
    if (playing) yt.current.pauseVideo();
    else yt.current.playVideo();
  };

  const seek = (s: number) => {
    yt.current?.seekTo(s, true);
    setProgress(s);
  };

  const toggleLike = (t: Track) => {
    setLiked((prev) => {
      const n = prev.some((x) => x.id === t.id) ? prev.filter((x) => x.id !== t.id) : [t, ...prev];
      localStorage.setItem("bytes-liked", JSON.stringify(n));
      return n;
    });
  };

  return (
    <PlayerCtx.Provider
      value={{
        current: queue[index] ?? null,
        queue,
        playing,
        progress,
        duration,
        liked,
        playList,
        toggle,
        next,
        prev,
        seek,
        toggleLike,
        isLiked: (id) => liked.some((x) => x.id === id),
        expanded,
        setExpanded,
      }}
    >
      {children}
      <div className="pointer-events-none fixed -left-[9999px] top-0 h-px w-px overflow-hidden" aria-hidden>
        <div id="yt-host" />
      </div>
    </PlayerCtx.Provider>
  );
}

export const fmt = (s: number) => {
  if (!isFinite(s) || s <= 0) return "0:00";
  const m = Math.floor(s / 60);
  return `${m}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
};
