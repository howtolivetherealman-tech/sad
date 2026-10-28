import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { INITIAL_STORE_DATA } from '@/lib/initial-data';
import { AppStoreData } from '@/lib/types';
import {
  filterOutNonChannelDemoVideos,
  sortVideosNewestFirst,
} from '@/lib/store-logic';

const DATA_DIR = path.join(process.cwd(), '.data');
const DATA_FILE = path.join(DATA_DIR, 'sadguru-store.json');

function readStoreFromDisk(): AppStoreData {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(raw) as AppStoreData;
      const sanitizedVideos = filterOutNonChannelDemoVideos(
        parsed.videos || [],
        INITIAL_STORE_DATA.videos
      );
      return {
        ...INITIAL_STORE_DATA,
        ...parsed,
        logoUrl: parsed.logoUrl || INITIAL_STORE_DATA.logoUrl,
        channelUrl: 'https://www.youtube.com/channel/UCrcgWWGv5nrSeP2y79nt3GQ',
        contactPhone: '7093586539',
        videos: sanitizedVideos,
        googleAds: {
          ...INITIAL_STORE_DATA.googleAds,
          ...(parsed.googleAds || {}),
          adsenseClientId:
            parsed.googleAds?.adsenseClientId || 'ca-pub-6709151112965859',
          adsenseMetaTag:
            parsed.googleAds?.adsenseMetaTag ||
            '<meta name="google-adsense-account" content="ca-pub-6709151112965859">',
          adScriptOrCode:
            parsed.googleAds?.adScriptOrCode &&
            parsed.googleAds.adScriptOrCode.includes('adsbygoogle')
              ? parsed.googleAds.adScriptOrCode
              : INITIAL_STORE_DATA.googleAds.adScriptOrCode,
        },
      };
    }
  } catch (err) {
    console.error('Error reading store from disk:', err);
  }
  return INITIAL_STORE_DATA;
}

function writeStoreToDisk(data: AppStoreData): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const normalized: AppStoreData = {
      ...data,
      videos: sortVideosNewestFirst(
        filterOutNonChannelDemoVideos(data.videos || [], INITIAL_STORE_DATA.videos)
      ),
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(normalized, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing store to disk:', err);
  }
}

export async function GET() {
  const store = readStoreFromDisk();
  return NextResponse.json(store);
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as AppStoreData;
    if (!body || !Array.isArray(body.services) || !Array.isArray(body.videos)) {
      return NextResponse.json(
        { error: 'Invalid store payload' },
        { status: 400 }
      );
    }
    writeStoreToDisk(body);
    return NextResponse.json({ ok: true, store: readStoreFromDisk() });
  } catch (err) {
    console.error('Error in POST /api/store:', err);
    return NextResponse.json(
      { error: 'Failed to save store' },
      { status: 500 }
    );
  }
}
