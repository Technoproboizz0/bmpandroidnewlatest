import { createFileRoute } from "@tanstack/react-router";
import { usePlayer } from "@/lib/player";
import { CLASSICS, TRENDING, thumb, type Track } from "@/lib/tracks";
import { TrackRow } from "@/components/app-shell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bytes Music — Stream your favorite songs" },
      { name: "description", content: "Bytes Music: a fast, ad-light music player for trending hits and classics." },
      { property: "og:title", content: "Bytes Music" },
      { property: "og:description", content: "A fast music player for trending hits and classics." },
    ],
  }),
  component: Home,
});

function Shelf({ title, list }: { title: string; list: Track[] }) {
  const p = usePlayer();
  return (
    <section className="mt-8">
      <h2 className="mb-3 font-display text-xl font-bold">{title}</h2>
      <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 no-scrollbar">
        {list.map((t, i) => (
          <button key={t.id} onClick={() => p.playList(list, i)} className="w-36 shrink-0 text-left">
            <img src={thumb(t.id)} alt="" className="aspect-square w-36 rounded-xl object-cover" loading="lazy" />
            <p className="mt-2 truncate text-sm font-medium">{t.title}</p>
            <p className="truncate text-xs text-muted-foreground">{t.artist}</p>
          </button>
        ))}
      </div>
    </section>
  );
}

function Home() {
  const hour = new Date().getHours();
  return (
    <>
      <header className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold tracking-tight">
          bytes<span className="text-primary">.</span>music
        </h1>
        <span className="rounded-full border border-border px-3 py-1 font-mono text-xs text-muted-foreground">
          {hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening"}
        </span>
      </header>
      <Shelf title="Trending now" list={TRENDING} />
      <Shelf title="All-time classics" list={CLASSICS} />
      <section className="mt-8">
        <h2 className="mb-2 font-display text-xl font-bold">Quick picks</h2>
        {[...TRENDING.slice(0, 3), ...CLASSICS.slice(0, 3)].map((_, i, arr) => (
          <TrackRow key={arr[i]!.id} list={arr} i={i} />
        ))}
      </section>
    </>
  );
}
