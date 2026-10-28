import {
  AppStoreData,
  AyurvedicHerbItem,
  GoogleAdsConfig,
  PreparationMethodItem,
  PrivateAdItem,
  SacredProductItem,
  ServiceItem,
  YouTubeVideoItem,
} from './types';
import { SVG_ASSETS } from './svg-assets';

const ADMIN_SECRET_CODE = '1977';
const LEGACY_NON_CHANNEL_VIDEO_IDS = new Set([
  'M7lc1UVf-VE',
  'ysz5S6PUM-U',
  'jNQXAC9IVRw',
]);

/**
 * Verifies the admin password without ever exposing the password in UI hints.
 */
export function verifyAdminPassword(input: string): boolean {
  return input.trim() === ADMIN_SECRET_CODE;
}

/**
 * Removes legacy sample non-channel videos so only videos from the user's channel or added by Admin remain.
 */
export function filterOutNonChannelDemoVideos(
  videos: YouTubeVideoItem[],
  fallbackVideos: YouTubeVideoItem[]
): YouTubeVideoItem[] {
  const cleaned = videos.filter(
    (v) => !LEGACY_NON_CHANNEL_VIDEO_IDS.has(v.videoId)
  );
  return cleaned.length > 0 ? sortVideosNewestFirst(cleaned) : sortVideosNewestFirst(fallbackVideos);
}

/**
 * Updates the website logo URL (from Desktop/Mobile gallery upload or URL).
 */
export function updateLogoInStore(
  store: AppStoreData,
  logoUrl: string
): AppStoreData {
  return {
    ...store,
    logoUrl: logoUrl.trim() || SVG_ASSETS.brandLogo,
  };
}

/**
 * Extracts an 11-character YouTube video ID from any standard YouTube link.
 */
export function extractYouTubeVideoId(urlOrId: string): string | null {
  const trimmed = urlOrId.trim();
  if (!trimmed) return null;

  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  try {
    const parsed = new URL(
      trimmed.startsWith('http') ? trimmed : `https://${trimmed}`
    );
    const host = parsed.hostname.replace(/^www\./, '').toLowerCase();

    if (host === 'youtu.be') {
      const id = parsed.pathname.split('/').filter(Boolean)[0];
      if (id && /^[a-zA-Z0-9_-]{11}$/.test(id)) return id;
    }

    if (host.includes('youtube.com') || host.includes('youtube-nocookie.com')) {
      const vParam = parsed.searchParams.get('v');
      if (vParam && /^[a-zA-Z0-9_-]{11}$/.test(vParam)) return vParam;

      const segments = parsed.pathname.split('/').filter(Boolean);
      const markerIdx = segments.findIndex((s) =>
        ['shorts', 'embed', 'live', 'v'].includes(s.toLowerCase())
      );
      if (markerIdx !== -1 && segments[markerIdx + 1]) {
        const candidate = segments[markerIdx + 1].slice(0, 11);
        if (/^[a-zA-Z0-9_-]{11}$/.test(candidate)) return candidate;
      }
    }
  } catch {
    // Fallback regex
  }

  const regexMatch = trimmed.match(
    /(?:v=|youtu\.be\/|embed\/|shorts\/|live\/)([a-zA-Z0-9_-]{11})/
  );
  if (regexMatch && regexMatch[1]) {
    return regexMatch[1];
  }

  return null;
}

/**
 * Sorts YouTube videos so the newest uploaded/added video ALWAYS appears 1st (index 0).
 */
export function sortVideosNewestFirst(
  videos: YouTubeVideoItem[]
): YouTubeVideoItem[] {
  return [...videos].sort((a, b) => b.addedAt - a.addedAt);
}

/**
 * Adds a new YouTube video to the store, ensuring it has the highest timestamp so it appears 1st.
 */
export function addYouTubeVideoToStore(
  store: AppStoreData,
  input: {
    url: string;
    titleTe: string;
    titleEn?: string;
    descriptionTe?: string;
    descriptionEn?: string;
    now?: number;
  }
): { store: AppStoreData; error?: string; addedVideo?: YouTubeVideoItem } {
  const videoId = extractYouTubeVideoId(input.url);
  if (!videoId) {
    return {
      store,
      error:
        'చెల్లుబాటు అయ్యే యూట్యూబ్ వీడియో లింక్‌ను పేస్ట్ చేయండి (Invalid YouTube video link).',
    };
  }

  const maxExistingTimestamp = store.videos.reduce(
    (max, v) => (v.addedAt > max ? v.addedAt : max),
    0
  );
  const currentTime = input.now ?? Date.now();
  const guaranteedNewestTimestamp = Math.max(
    currentTime,
    maxExistingTimestamp + 1000
  );

  const cleanTitleTe =
    input.titleTe.trim() || 'సద్గురు నాటు వైద్యం ప్రత్యేక వీడియో';
  const cleanTitleEn = input.titleEn?.trim() || cleanTitleTe;
  const cleanDescTe =
    input.descriptionTe?.trim() ||
    'శ్రీనివాస్ మహారాజ్ గారి సద్గురు నాటు వైద్యం మరియు తాంత్రిక జ్యోతిష్య పరిష్కార వీడియో.';
  const cleanDescEn = input.descriptionEn?.trim() || cleanDescTe;

  const newVideo: YouTubeVideoItem = {
    id: `vid-${guaranteedNewestTimestamp}`,
    videoId,
    url: `https://www.youtube.com/watch?v=${videoId}`,
    title: {
      te: cleanTitleTe,
      en: cleanTitleEn,
    },
    description: {
      te: cleanDescTe,
      en: cleanDescEn,
    },
    addedAt: guaranteedNewestTimestamp,
  };

  const updatedVideos = sortVideosNewestFirst([
    newVideo,
    ...store.videos.filter((v) => v.videoId !== videoId),
  ]);
  return {
    store: {
      ...store,
      videos: updatedVideos,
    },
    addedVideo: newVideo,
  };
}

export function removeYouTubeVideoFromStore(
  store: AppStoreData,
  id: string
): AppStoreData {
  return {
    ...store,
    videos: sortVideosNewestFirst(store.videos.filter((v) => v.id !== id)),
  };
}

/**
 * 1. సమస్యలు & పరిష్కారాలు (Services CRUD + Image Upload Support)
 */
export function addServiceToStore(
  store: AppStoreData,
  input: {
    category: ServiceItem['category'];
    titleTe: string;
    titleEn?: string;
    descriptionTe: string;
    descriptionEn?: string;
    remedyNoteTe?: string;
    remedyNoteEn?: string;
    imageUrl?: string;
  }
): AppStoreData {
  const nextNumber = String(store.services.length + 1).padStart(2, '0');
  const titleTe = input.titleTe.trim();
  const titleEn = input.titleEn?.trim() || titleTe;
  const descTe = input.descriptionTe.trim();
  const descEn = input.descriptionEn?.trim() || descTe;
  const remedyTe =
    input.remedyNoteTe?.trim() || 'ప్రత్యేక తాంత్రిక & నాటు వైద్య పరిహారం';
  const remedyEn = input.remedyNoteEn?.trim() || remedyTe;

  const newService: ServiceItem = {
    id: `srv-${Date.now()}-${store.services.length + 1}`,
    number: nextNumber,
    category: input.category,
    title: { te: titleTe, en: titleEn },
    description: { te: descTe, en: descEn },
    remedyNote: { te: remedyTe, en: remedyEn },
    imageUrl: input.imageUrl?.trim() || undefined,
  };

  return {
    ...store,
    services: [...store.services, newService],
  };
}

export function updateServiceInStore(
  store: AppStoreData,
  updated: ServiceItem
): AppStoreData {
  return {
    ...store,
    services: store.services.map((s) => (s.id === updated.id ? updated : s)),
  };
}

export function removeServiceFromStore(
  store: AppStoreData,
  serviceId: string
): AppStoreData {
  const filtered = store.services
    .filter((s) => s.id !== serviceId)
    .map((s, idx) => ({
      ...s,
      number: String(idx + 1).padStart(2, '0'),
    }));

  return {
    ...store,
    services: filtered,
  };
}

/**
 * 2. యంత్రములు & పూజ (Sacred Yantras & Puja Products CRUD + Image Upload)
 */
export function addProductToStore(
  store: AppStoreData,
  input: {
    category: SacredProductItem['category'];
    nameTe: string;
    nameEn?: string;
    subtitleTe?: string;
    subtitleEn?: string;
    descriptionTe: string;
    descriptionEn?: string;
    benefitsTe?: string;
    benefitsEn?: string;
    price: number;
    imageUrl: string;
  }
): AppStoreData {
  const nameTe = input.nameTe.trim();
  const nameEn = input.nameEn?.trim() || nameTe;
  const subTe = input.subtitleTe?.trim() || 'అభిమంత్రించిన పవిత్ర వస్తువు';
  const subEn = input.subtitleEn?.trim() || subTe;
  const descTe = input.descriptionTe.trim();
  const descEn = input.descriptionEn?.trim() || descTe;
  const benTe = input.benefitsTe?.trim() || 'సంపూర్ణ రక్షణ · శుభ ఫలితాలు';
  const benEn = input.benefitsEn?.trim() || benTe;

  const newProd: SacredProductItem = {
    id: `prod-${Date.now()}-${store.products.length + 1}`,
    category: input.category,
    name: { te: nameTe, en: nameEn },
    subtitle: { te: subTe, en: subEn },
    description: { te: descTe, en: descEn },
    benefits: { te: benTe, en: benEn },
    price: Number(input.price) || 1500,
    imageUrl: input.imageUrl || SVG_ASSETS.sriYantra,
    inStock: true,
  };

  return {
    ...store,
    products: [newProd, ...store.products],
  };
}

export function updateProductInStore(
  store: AppStoreData,
  updated: SacredProductItem
): AppStoreData {
  return {
    ...store,
    products: store.products.map((p) => (p.id === updated.id ? updated : p)),
  };
}

export function removeProductFromStore(
  store: AppStoreData,
  productId: string
): AppStoreData {
  return {
    ...store,
    products: store.products.filter((p) => p.id !== productId),
  };
}

/**
 * 3. మూలికలు & తయారీ (Ayurvedic Herbs & Medicine Preparation CRUD + Image Upload)
 */
export function addHerbToStore(
  store: AppStoreData,
  input: {
    sanskritName?: string;
    nameTe: string;
    nameEn?: string;
    partUsedTe?: string;
    propertiesTe?: string;
    benefitsTe: string;
    usageMethodTe?: string;
    imageUrl?: string;
  }
): AppStoreData {
  const nameTe = input.nameTe.trim();
  const nameEn = input.nameEn?.trim() || nameTe;
  const partTe = input.partUsedTe?.trim() || 'వేర్లు, ఆకులు మరియు సమూలం';
  const propTe = input.propertiesTe?.trim() || 'రసాయన, బలవర్ధక ఆయుర్వేద గుణములు';
  const benTe = input.benefitsTe.trim();
  const useTe =
    input.usageMethodTe?.trim() ||
    'శ్రీనివాస్ మహారాజ్ గారి సలహా మేరకు తేనె లేదా ఆవు పాలతో సేవించాలి.';

  const newHerb: AyurvedicHerbItem = {
    id: `herb-${Date.now()}-${store.herbs.length + 1}`,
    sanskritName: input.sanskritName?.trim() || 'Ayurvedic Moolika',
    name: { te: nameTe, en: nameEn },
    partUsed: { te: partTe, en: partTe },
    properties: { te: propTe, en: propTe },
    benefits: { te: benTe, en: benTe },
    usageMethod: { te: useTe, en: useTe },
    imageUrl: input.imageUrl?.trim() || SVG_ASSETS.herbalVitalityKit,
  };

  return {
    ...store,
    herbs: [newHerb, ...store.herbs],
  };
}

export function updateHerbInStore(
  store: AppStoreData,
  updated: AyurvedicHerbItem
): AppStoreData {
  return {
    ...store,
    herbs: store.herbs.map((h) => (h.id === updated.id ? updated : h)),
  };
}

export function removeHerbFromStore(
  store: AppStoreData,
  herbId: string
): AppStoreData {
  return {
    ...store,
    herbs: store.herbs.filter((h) => h.id !== herbId),
  };
}

export function addPreparationToStore(
  store: AppStoreData,
  input: {
    titleTe: string;
    titleEn?: string;
    subtitleTe?: string;
    ingredientsTe: string;
    stepsTe: string[];
    dosageTe?: string;
    imageUrl?: string;
  }
): AppStoreData {
  const nextStepNum = String(store.preparations.length + 1).padStart(2, '0');
  const titleTe = input.titleTe.trim();
  const titleEn = input.titleEn?.trim() || titleTe;
  const subTe = input.subtitleTe?.trim() || 'సాంప్రదాయ నాటు వైద్య తయారీ విధానం';
  const ingTe = input.ingredientsTe.trim();
  const cleanSteps =
    input.stepsTe.filter((s) => s.trim().length > 0).length > 0
      ? input.stepsTe.filter((s) => s.trim().length > 0)
      : [ingTe];
  const dosTe =
    input.dosageTe?.trim() ||
    'శ్రీనివాస్ మహారాజ్ గారి సూచనల మేరకు మోతాదు మరియు పథ్యం పాటించాలి.';

  const newPrep: PreparationMethodItem = {
    id: `prep-${Date.now()}-${store.preparations.length + 1}`,
    stepNumber: nextStepNum,
    title: { te: titleTe, en: titleEn },
    subtitle: { te: subTe, en: subTe },
    ingredients: { te: ingTe, en: ingTe },
    processSteps: { te: cleanSteps, en: cleanSteps },
    dosageAndPrecautions: { te: dosTe, en: dosTe },
    imageUrl: input.imageUrl?.trim() || undefined,
  };

  return {
    ...store,
    preparations: [...store.preparations, newPrep],
  };
}

export function updatePreparationInStore(
  store: AppStoreData,
  updated: PreparationMethodItem
): AppStoreData {
  return {
    ...store,
    preparations: store.preparations.map((p) =>
      p.id === updated.id ? updated : p
    ),
  };
}

export function removePreparationFromStore(
  store: AppStoreData,
  prepId: string
): AppStoreData {
  const filtered = store.preparations
    .filter((p) => p.id !== prepId)
    .map((p, idx) => ({
      ...p,
      stepNumber: String(idx + 1).padStart(2, '0'),
    }));
  return {
    ...store,
    preparations: filtered,
  };
}

/**
 * Private Ads submission & Admin Approval workflow
 */
export function submitPrivateAdToStore(
  store: AppStoreData,
  input: {
    title: string;
    advertiserName: string;
    contactPhone: string;
    description: string;
    youtubeUrl?: string;
    imageUrl: string;
    autoApprove?: boolean;
  }
): AppStoreData {
  const videoId = input.youtubeUrl
    ? extractYouTubeVideoId(input.youtubeUrl)
    : null;
  const newAd: PrivateAdItem = {
    id: `ad-${Date.now()}-${store.privateAds.length + 1}`,
    title: input.title.trim(),
    advertiserName: input.advertiserName.trim(),
    contactPhone: input.contactPhone.trim(),
    description: input.description.trim(),
    youtubeUrl: input.youtubeUrl?.trim() || undefined,
    youtubeVideoId: videoId || undefined,
    imageUrl: input.imageUrl,
    status: input.autoApprove ? 'approved' : 'pending',
    createdAt: Date.now(),
  };

  return {
    ...store,
    privateAds: [newAd, ...store.privateAds],
  };
}

export function updatePrivateAdStatusInStore(
  store: AppStoreData,
  adId: string,
  status: PrivateAdItem['status']
): AppStoreData {
  return {
    ...store,
    privateAds: store.privateAds.map((ad) =>
      ad.id === adId ? { ...ad, status } : ad
    ),
  };
}

export function removePrivateAdFromStore(
  store: AppStoreData,
  adId: string
): AppStoreData {
  return {
    ...store,
    privateAds: store.privateAds.filter((ad) => ad.id !== adId),
  };
}

export function updateGoogleAdsInStore(
  store: AppStoreData,
  config: GoogleAdsConfig
): AppStoreData {
  return {
    ...store,
    googleAds: config,
  };
}
