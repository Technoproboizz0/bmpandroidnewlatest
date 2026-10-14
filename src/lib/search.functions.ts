import { createServerFn } from "@tanstack/react-start";
import { ALL_TRACKS, type Track } from "./tracks";

const decode = (s: string) =>
  s.replace(/&amp;/g, "&").replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">");

export const searchTracks = createServerFn({ method: "GET" })
  .inputValidator((q: string) => String(q ?? "").slice(0, 120))
  .handler(async ({ data: q }): Promise<{ tracks: Track[]; live: boolean }> => {
    const query = q.trim();
    const local = () =>
      ALL_TRACKS.filter((t) =>
        `${t.title} ${t.artist}`.toLowerCase().includes(query.toLowerCase()),
      );
    const key = process.env["YOUTUBE_API_KEY"];
    if (!query) return { tracks: [], live: false };
    if (!key) return { tracks: local(), live: false };
    try {
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoCategoryId=10&maxResults=20&q=${encodeURIComponent(query)}&key=${key}`;
      const res = await fetch(url);
      if (!res.ok) return { tracks: local(), live: false };
      const json = (await res.json()) as {
        items: { id: { videoId: string }; snippet: { title: string; channelTitle: string } }[];
      };
      return {
        live: true,
        tracks: json.items.map((i) => ({
          id: i.id.videoId,
          title: decode(i.snippet.title),
          artist: i.snippet.channelTitle.replace(/ - Topic$/, ""),
        })),
      };
    } catch {
      return { tracks: local(), live: false };
    }
  });
