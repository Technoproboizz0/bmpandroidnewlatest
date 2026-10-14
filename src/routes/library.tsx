import { createFileRoute } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { usePlayer } from "@/lib/player";
import { TrackRow } from "@/components/app-shell";

export const Route = createFileRoute("/library")({
  head: () => ({
    meta: [
      { title: "Your Library — Bytes Music" },
      { name: "description", content: "Your liked songs on Bytes Music." },
      { property: "og:title", content: "Your Library — Bytes Music" },
      { property: "og:description", content: "All the songs you've liked, in one place." },
    ],
  }),
  component: LibraryPage,
});

function LibraryPage() {
  const { liked } = usePlayer();
  return (
    <>
      <h1 className="font-display text-3xl font-bold">Library</h1>
      <div className="mt-4 flex items-center gap-4 rounded-2xl bg-card p-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Heart className="h-7 w-7 fill-current" />
        </div>
        <div>
          <p className="font-display text-lg font-bold">Liked songs</p>
          <p className="font-mono text-xs text-muted-foreground">{liked.length} tracks</p>
        </div>
      </div>
      <div className="mt-4">
        {liked.length ? liked.map((t, i) => <TrackRow key={t.id} list={liked} i={i} />) : (
          <p className="text-sm text-muted-foreground">Tap the heart in the player to save songs here.</p>
        )}
      </div>
    </>
  );
}
