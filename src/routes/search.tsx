import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Search as SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { searchTracks } from "@/lib/search.functions";
import { TrackRow } from "@/components/app-shell";

export const Route = createFileRoute("/search")({
  head: () => ({
    meta: [
      { title: "Search — Bytes Music" },
      { name: "description", content: "Search songs and artists on Bytes Music." },
      { property: "og:title", content: "Search — Bytes Music" },
      { property: "og:description", content: "Find any song or artist on Bytes Music." },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const [q, setQ] = useState("");
  const [debounced, setDebounced] = useState("");
  useEffect(() => {
    const t = setTimeout(() => setDebounced(q), 400);
    return () => clearTimeout(t);
  }, [q]);
  const { data, isFetching } = useQuery({
    queryKey: ["search", debounced],
    queryFn: () => searchTracks({ data: debounced }),
    enabled: debounced.trim().length > 0,
  });
  return (
    <>
      <h1 className="font-display text-3xl font-bold">Search</h1>
      <label className="mt-4 flex items-center gap-2 rounded-xl bg-secondary px-4 py-3">
        <SearchIcon className="h-5 w-5 text-muted-foreground" />
        <input autoFocus value={q} onChange={(e) => setQ(e.target.value)}
          placeholder="Songs, artists…" className="w-full bg-transparent outline-none placeholder:text-muted-foreground" />
      </label>
      <div className="mt-4">
        {isFetching && <p className="font-mono text-sm text-muted-foreground">searching…</p>}
        {data?.tracks.map((t, i) => <TrackRow key={t.id + i} list={data.tracks} i={i} />)}
        {data && !data.tracks.length && !isFetching && (
          <p className="text-sm text-muted-foreground">No results.</p>
        )}
      </div>
    </>
  );
}
