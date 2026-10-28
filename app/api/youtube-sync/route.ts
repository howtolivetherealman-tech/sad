import { NextResponse } from 'next/server';
import { YouTubeVideoItem } from '@/lib/types';

const CHANNEL_ID = 'UCrcgWWGv5nrSeP2y79nt3GQ';
const RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

function decodeXmlEntities(str: string): string {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();
}

export async function GET() {
  try {
    const res = await fetch(RSS_URL, { next: { revalidate: 60 } });
    if (!res.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch YouTube RSS feed' },
        { status: 502 }
      );
    }
    const xml = await res.text();
    const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)];

    const videos: YouTubeVideoItem[] = entries
      .slice(0, 12)
      .map((match, idx) => {
        const block = match[1];
        const videoId =
          block.match(/<yt:videoId>(.*?)<\/yt:videoId>/)?.[1]?.trim() || '';
        const rawTitle =
          block.match(/<title>([\s\S]*?)<\/title>/)?.[1] ||
          'Sadguru Naatu Vaidyam Video';
        const rawDesc =
          block.match(/<media:description>([\s\S]*?)<\/media:description>/)?.[1] ||
          'సద్గురు నాటు వైద్యం — శ్రీనివాస్ మహారాజ్ (7093586539)';
        const publishedStr =
          block.match(/<published>(.*?)<\/published>/)?.[1] || '';

        const titleClean = decodeXmlEntities(rawTitle);
        const descClean = decodeXmlEntities(rawDesc).slice(0, 260);
        const pubTime = publishedStr
          ? new Date(publishedStr).getTime()
          : Date.now() - idx * 1000;

        return {
          id: `yt-${videoId}`,
          videoId,
          url: `https://www.youtube.com/watch?v=${videoId}`,
          title: {
            te: titleClean,
            en: titleClean,
          },
          description: {
            te: descClean,
            en: descClean,
          },
          addedAt: pubTime,
        };
      })
      .filter((v) => v.videoId.length === 11);

    return NextResponse.json({
      channelUrl: `https://www.youtube.com/channel/${CHANNEL_ID}`,
      videos,
    });
  } catch (err) {
    console.error('Error syncing YouTube RSS:', err);
    return NextResponse.json(
      { error: 'Unable to sync YouTube channel feed' },
      { status: 500 }
    );
  }
}
