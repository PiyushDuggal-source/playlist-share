import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function inferItemType(url?: string) {
  if (!url) return "note" as const;
  try {
    const u = new URL(url);
    const host = u.hostname.toLowerCase();

    if (host.includes("youtube.com") || host.includes("youtu.be"))
      return "video" as const;
    if (host.includes("github.com")) return "document" as const; // treat repos as documents by default
    if (u.pathname.toLowerCase().endsWith(".pdf")) return "document" as const;
    // default to link for all other web URLs
    return "link" as const;
  } catch (e) {
    return "note" as const;
  }
}

export type InferredItemType = ReturnType<typeof inferItemType>;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function parseYouTubeTimestamp(input?: string | null) {
  if (!input) return undefined;
  if (/^\d+$/.test(input)) return Number(input);
  const match = input.match(/(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?/i);
  if (!match) return undefined;
  const [, hours, minutes, seconds] = match;
  const total =
    (hours ? Number(hours) * 3600 : 0) +
    (minutes ? Number(minutes) * 60 : 0) +
    (seconds ? Number(seconds) : 0);
  return total > 0 ? total : undefined;
}

export function getYouTubeEmbedUrl(url?: string) {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "").toLowerCase();

    let videoId = "";
    const params = new URLSearchParams();

    const appendStart = (value?: string | null) => {
      const seconds = parseYouTubeTimestamp(value);
      if (typeof seconds === "number") {
        params.set("start", seconds.toString());
      }
    };

    if (host.includes("youtube.com")) {
      const segments = parsed.pathname.split("/").filter(Boolean);
      if (parsed.pathname.startsWith("/watch")) {
        videoId = parsed.searchParams.get("v") ?? "";
        appendStart(
          parsed.searchParams.get("t") || parsed.searchParams.get("start")
        );
        const list = parsed.searchParams.get("list");
        if (list) params.set("list", list);
      } else if (segments[0] === "embed" && segments[1]) {
        videoId = segments[1];
        appendStart(parsed.searchParams.get("start"));
      } else if (segments[0] === "shorts" && segments[1]) {
        videoId = segments[1];
      } else if (segments[0] === "live" && segments[1]) {
        videoId = segments[1];
      }
    } else if (host.includes("youtu.be")) {
      const segments = parsed.pathname.split("/").filter(Boolean);
      if (segments[0]) {
        videoId = segments[0];
        appendStart(
          parsed.searchParams.get("t") || parsed.searchParams.get("start")
        );
      }
      const list = parsed.searchParams.get("list");
      if (list) params.set("list", list);
    }

    if (!videoId) return null;

    const paramString = params.toString();
    return `https://www.youtube.com/embed/${videoId}${
      paramString ? `?${paramString}` : ""
    }`;
  } catch (error) {
    return null;
  }
}
