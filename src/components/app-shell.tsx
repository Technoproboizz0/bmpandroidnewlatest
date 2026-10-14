import { Link } from "@tanstack/react-router";
import { ChevronDown, Heart, Home, Library, Pause, Play, Search, SkipBack, SkipForward } from "lucide-react";
import type { ReactNode } from "react";
import { fmt, usePlayer } from "@/lib/player";
import { thumb, type Track } from "@/lib/tracks";

export function TrackRow({ list, i }: { list: Track[]; i: number }) {
  const p = usePlayer();
  const t = list[i]!;
  const active = p.current?.id === t.id;
  return (
    <button
      onClick={() => p.playList(list, i)}
      className="flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-secondary"
    >
      <img src={thumb(t.id, "mq")} alt="" className="h-12 w-12 rounded-md object-cover" loading="lazy" />
      <div className="min-w-0 flex-1">
        <p className={`truncate font-medium ${active ? "text-primary" : "text-foreground"}`}>{t.title}</p>
        <p className="truncate text-sm text-muted-foreground">{t.artist}</p>
      </div>
      {active && p.playing && <span className="eq" aria-label="Playing"><i /><i /><i /></span>}
    </button>
  );
}

function MiniPlayer() {
  const p = usePlayer();
  if (!p.current) return null;
  const pct = p.duration ? (p.progress / p.duration) * 100 : 0;
  return (
    <div className="mx-2 mb-2 overflow-hidden rounded-xl bg-card shadow-glow">
      <div className="flex items-center gap-3 p-2" onClick={() => p.setExpanded(true)}>
        <img src={thumb(p.current.id, "mq")} alt="" className="h-11 w-11 rounded-md object-cover" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{p.current.title}</p>
          <p className="truncate text-xs text-muted-foreground">{p.current.artist}</p>
        </div>
        <button onClick={(e) => { e.stopPropagation(); p.toggle(); }} className="p-2" aria-label="Play or pause">
          {p.playing ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
        </button>
        <button onClick={(e) => { e.stopPropagation(); p.next(); }} className="p-2" aria-label="Next">
          <SkipForward className="h-5 w-5" />
        </button>
      </div>
      <div className="h-0.5 bg-secondary"><div className="h-full bg-primary" style={{ width: `${pct}%` }} /></div>
    </div>
  );
}

function FullPlayer() {
  const p = usePlayer();
  if (!p.expanded || !p.current) return null;
  const t = p.current;
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-player px-6 pb-10 pt-4 animate-in slide-in-from-bottom duration-300">
      <button onClick={() => p.setExpanded(false)} className="self-start p-2" aria-label="Close player">
        <ChevronDown className="h-7 w-7" />
      </button>
      <div className="flex flex-1 items-center justify-center">
        <img src={thumb(t.id)} alt="" className="aspect-square w-full max-w-sm rounded-2xl object-cover shadow-glow" />
      </div>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="truncate font-display text-2xl font-bold">{t.title}</h2>
          <p className="truncate text-muted-foreground">{t.artist}</p>
        </div>
        <button onClick={() => p.toggleLike(t)} aria-label="Like" className="p-2">
          <Heart className={`h-7 w-7 ${p.isLiked(t.id) ? "fill-primary text-primary" : ""}`} />
        </button>
      </div>
      <input
        type="range" min={0} max={p.duration || 1} step={1} value={p.progress}
        onChange={(e) => p.seek(Number(e.target.value))}
        className="mt-6 w-full accent-primary"
        aria-label="Seek"
      />
      <div className="flex justify-between font-mono text-xs text-muted-foreground">
        <span>{fmt(p.progress)}</span><span>{fmt(p.duration)}</span>
      </div>
      <div className="mt-4 flex items-center justify-center gap-10">
        <button onClick={p.prev} aria-label="Previous"><SkipBack className="h-8 w-8" /></button>
        <button onClick={p.toggle} aria-label="Play or pause" className="flex h-18 w-18 items-center justify-center rounded-full bg-primary p-5 text-primary-foreground shadow-glow">
          {p.playing ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
        </button>
        <button onClick={p.next} aria-label="Next"><SkipForward className="h-8 w-8" /></button>
      </div>
    </div>
  );
}

const tabs = [
  { to: "/", label: "Home", icon: Home },
  { to: "/search", label: "Search", icon: Search },
  { to: "/library", label: "Library", icon: Library },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto min-h-screen max-w-md bg-background">
      <main className="px-4 pb-44 pt-6">{children}</main>
      <div className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-md bg-gradient-to-t from-background via-background to-transparent pt-6">
        <MiniPlayer />
        <nav className="flex border-t border-border bg-background">
          {tabs.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} activeOptions={{ exact: true }}
              className="flex flex-1 flex-col items-center gap-1 py-3 text-xs text-muted-foreground"
              activeProps={{ className: "text-primary" }}>
              <Icon className="h-5 w-5" />{label}
            </Link>
          ))}
        </nav>
      </div>
      <FullPlayer />
    </div>
  );
}
