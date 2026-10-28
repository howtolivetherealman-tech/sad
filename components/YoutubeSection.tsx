'use client';

import React, { useState, useEffect } from 'react';
import {
  ExternalLink,
  Play,
  Youtube,
  RefreshCw,
} from 'lucide-react';
import { Language, YouTubeVideoItem } from '@/lib/types';
import { sortVideosNewestFirst } from '@/lib/store-logic';

interface YoutubeSectionProps {
  language: Language;
  channelUrl: string;
  videos: YouTubeVideoItem[];
  isAdmin?: boolean;
  onAddVideo?: (input: {
    url: string;
    titleTe: string;
    titleEn?: string;
    descriptionTe?: string;
  }) => string | null;
  onSyncChannelVideos: () => Promise<void>;
  onOpenAdmin?: () => void;
}

export default function YoutubeSection({
  language,
  channelUrl,
  videos,
  onSyncChannelVideos,
}: YoutubeSectionProps) {
  const sortedVideos = sortVideosNewestFirst(videos);
  const [activeVideoId, setActiveVideoId] = useState<string>(
    sortedVideos[0]?.videoId || 'Vn_y9SOt3OU'
  );
  const [showInlineIframe, setShowInlineIframe] = useState<boolean>(false);
  const [syncing, setSyncing] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: 'ok' | 'err';
    msg: string;
  } | null>(null);

  useEffect(() => {
    if (
      sortedVideos.length > 0 &&
      !sortedVideos.some((v) => v.videoId === activeVideoId)
    ) {
      setActiveVideoId(sortedVideos[0].videoId);
      setShowInlineIframe(false);
    }
  }, [sortedVideos, activeVideoId]);

  const featuredVideo =
    sortedVideos.find((v) => v.videoId === activeVideoId) || sortedVideos[0];

  const handleSyncClick = async () => {
    setSyncing(true);
    try {
      await onSyncChannelVideos();
      setFeedback({
        type: 'ok',
        msg:
          language === 'te'
            ? 'సద్గురు నాటు వైద్యం యూట్యూబ్ ఛానెల్ నుండి తాజా వీడియోలు అప్‌డేట్ చేయబడ్డాయి!'
            : 'Synced latest videos from Sadguru Naatu Vaidyam YouTube channel!',
      });
    } finally {
      setSyncing(false);
    }
  };

  return (
    <section
      id="videos"
      className="py-16 md:py-20 border-b border-[#E5DEC9] bg-[#F5EFE4]"
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-xs font-medium tracking-wider text-[#991B1B] mb-2">
              {language === 'te'
                ? 'సద్గురు నాటు వైద్యం అధికారిక యూట్యూబ్ ఛానెల్ (UCrcgWWGv5nrSeP2y79nt3GQ)'
                : 'SADGURU NAATU VAIDYAM OFFICIAL YOUTUBE CHANNEL'}
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#1C1613] leading-tight">
              {language === 'te'
                ? 'సద్గురు నాటు వైద్యం ఛానెల్ వీడియోలు (కొత్తవి 1st)'
                : 'Sadguru Naatu Vaidyam Channel Videos (Newest 1st)'}
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#574B42] max-w-2xl">
              {language === 'te'
                ? 'మా అధికారిక యూట్యూబ్ ఛానెల్ వీడియోలు మాత్రమే ఇక్కడ ప్రదర్శించబడతాయి. కొత్తగా అప్‌లోడ్ చేసిన ప్రతి వీడియో 1వ స్థానంలో కనిపిస్తుంది.'
                : 'Showing official videos exclusively from Sadguru Naatu Vaidyam YouTube channel, ordered newest-first (#1).'}
            </p>
            {feedback && (
              <p
                className={`mt-2 text-xs font-medium ${
                  feedback.type === 'ok' ? 'text-[#15803D]' : 'text-[#B91C1C]'
                }`}
              >
                {feedback.msg}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleSyncClick}
              disabled={syncing}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-[#FAF7F2] text-[#1C1613] border border-[#D6CEB8] text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 text-[#991B1B] ${
                  syncing ? 'animate-spin' : ''
                }`}
              />
              <span>
                {language === 'te'
                  ? 'ఛానెల్ తాజా వీడియోలు సింక్ చేయి'
                  : 'Sync Channel Videos'}
              </span>
            </button>

            <a
              href={channelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#991B1B] text-white text-sm font-semibold rounded-lg hover:bg-[#7F1D1D] transition-colors whitespace-nowrap shrink-0"
            >
              <Youtube className="w-4 h-4" />
              <span>
                {language === 'te'
                  ? 'యూట్యూబ్ ఛానెల్‌కు వెళ్ళండి'
                  : 'Go to YouTube Channel'}
              </span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Featured #1 Video Showcase + Ordered Channel Video List */}
        {featuredVideo && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Main Channel Video Card with High-Res Thumbnail & Direct Watch / Inline Player */}
            <div className="lg:col-span-7 bg-white rounded-xl border border-[#E5DEC9] overflow-hidden">
              <div className="aspect-video w-full bg-[#1C1613] relative overflow-hidden group">
                {showInlineIframe ? (
                  <iframe
                    key={featuredVideo.videoId}
                    src={`https://www.youtube.com/embed/${featuredVideo.videoId}?autoplay=1&rel=0`}
                    title={featuredVideo.title[language]}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : (
                  <>
                    <img
                      src={`https://i.ytimg.com/vi/${featuredVideo.videoId}/hqdefault.jpg`}
                      alt={featuredVideo.title[language]}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10 flex flex-col items-center justify-center p-6 text-center">
                      <a
                        href={featuredVideo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-16 h-16 rounded-full bg-[#991B1B] hover:bg-[#7F1D1D] text-white flex items-center justify-center shadow-xl transition-transform group-hover:scale-105 mb-3"
                        aria-label={`Watch ${featuredVideo.title[language]} on YouTube`}
                      >
                        <Play className="w-7 h-7 fill-white ml-0.5" />
                      </a>
                      <span className="px-4 py-1.5 bg-black/75 text-[#FDE68A] text-xs font-semibold rounded-lg border border-white/15">
                        {language === 'te'
                          ? 'వీడియో చూడటానికి క్లిక్ చేయండి (Watch on YouTube)'
                          : 'Click to Watch Official Video'}
                      </span>
                    </div>
                  </>
                )}
              </div>

              <div className="p-5 sm:p-6">
                <div className="flex items-center justify-between gap-2 text-xs text-[#991B1B] font-medium mb-2">
                  <div className="flex items-center gap-2">
                    <span>
                      {sortedVideos[0]?.id === featuredVideo.id
                        ? language === 'te'
                          ? '1వ స్థానం · తాజా ఛానెల్ వీడియో (Latest #1 Upload)'
                          : '#1 Position · Latest Channel Upload'
                        : language === 'te'
                        ? 'సద్గురు నాటు వైద్యం వీడియో'
                        : 'Sadguru Naatu Vaidyam Video'}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>Sadguru Naatu Vaidyam</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowInlineIframe((prev) => !prev)}
                    className="text-xs text-[#574B42] hover:text-[#991B1B] underline"
                  >
                    {showInlineIframe
                      ? language === 'te'
                        ? 'థంబ్‌నెయిల్ చూపించు'
                        : 'Show Thumbnail'
                      : language === 'te'
                      ? 'ఇన్‌లైన్ ప్లేయర్'
                      : 'Embed Player'}
                  </button>
                </div>

                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1C1613]">
                  {featuredVideo.title[language]}
                </h3>
                <p className="mt-2 text-sm text-[#574B42] leading-relaxed">
                  {featuredVideo.description[language]}
                </p>
                <div className="mt-4 pt-4 border-t border-[#E5DEC9] flex flex-wrap items-center justify-between gap-4">
                  <a
                    href={featuredVideo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#991B1B] hover:bg-[#7F1D1D] text-white text-xs font-semibold rounded-lg transition-colors"
                  >
                    <Youtube className="w-4 h-4" />
                    <span>
                      {language === 'te'
                        ? 'యూట్యూబ్‌లో వీడియో ప్లే చేయండి'
                        : 'Play Video on YouTube'}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <span className="text-xs text-[#786B5E] tabular-nums">
                    ID: {featuredVideo.videoId}
                  </span>
                </div>
              </div>
            </div>

            {/* All Channel Videos Ordered Newest First (1st, 2nd, 3rd...) */}
            <div className="lg:col-span-5 flex flex-col gap-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#D6CEB8]">
                <span className="text-xs font-semibold text-[#574B42]">
                  {language === 'te'
                    ? `సద్గురు నాటు వైద్యం వీడియోలు (${sortedVideos.length}) — కొత్తవి మొదట`
                    : `Sadguru Naatu Vaidyam Videos (${sortedVideos.length}) — Newest First`}
                </span>
              </div>

              <div className="flex flex-col gap-3 max-h-[430px] overflow-y-auto pr-1">
                {sortedVideos.map((vid, idx) => {
                  const isSelected = vid.videoId === featuredVideo.videoId;
                  return (
                    <button
                      key={vid.id}
                      type="button"
                      onClick={() => {
                        setActiveVideoId(vid.videoId);
                        setShowInlineIframe(false);
                      }}
                      className={`w-full text-left p-3.5 rounded-xl border transition-colors flex items-start gap-3.5 ${
                        isSelected
                          ? 'bg-white border-[#991B1B]'
                          : 'bg-white/70 border-[#E5DEC9] hover:bg-white'
                      }`}
                    >
                      <div className="w-28 aspect-video rounded-lg bg-[#2A1E19] shrink-0 relative overflow-hidden flex items-center justify-center border border-[#D6CEB8]">
                        <img
                          src={`https://i.ytimg.com/vi/${vid.videoId}/hqdefault.jpg`}
                          alt={vid.title[language]}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                        <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
                          <Play className="w-5 h-5 text-white fill-white" />
                        </div>
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 text-xs text-[#991B1B] font-semibold mb-1">
                          <span className="tabular-nums">#{idx + 1}</span>
                          <span aria-hidden="true">·</span>
                          <span>
                            {idx === 0
                              ? language === 'te'
                                ? 'కొత్త వీడియో (Newest 1st)'
                                : 'Newest 1st'
                              : language === 'te'
                              ? 'వీడియో ఎంచుకోండి'
                              : 'Select Video'}
                          </span>
                        </div>
                        <h4 className="text-sm font-semibold text-[#1C1613] line-clamp-2">
                          {vid.title[language]}
                        </h4>
                        <p className="mt-1 text-xs text-[#6E6053] line-clamp-1">
                          {vid.description[language]}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Mandatory "More Videos / Go to Channel" CTA below videos */}
              <div className="mt-2 p-4 bg-white rounded-xl border border-[#D6CEB8] flex flex-col gap-3">
                <div>
                  <p className="text-sm font-semibold text-[#1C1613]">
                    {language === 'te'
                      ? 'మరిన్ని వీడియోల కోసం మా ఛానెల్‌ను సందర్శించండి'
                      : 'Watch All Videos on Our Official Channel'}
                  </p>
                  <p className="text-xs text-[#6E6053]">
                    {language === 'te'
                      ? 'సద్గురు నాటు వైద్యం యూట్యూబ్ ఛానెల్ (Sadguru Naatu Vaidyam)'
                      : 'Sadguru Naatu Vaidyam Official YouTube Channel'}
                  </p>
                </div>
                <a
                  href={channelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#991B1B] text-white text-xs sm:text-sm font-semibold rounded-lg hover:bg-[#7F1D1D] transition-colors whitespace-nowrap"
                >
                  <Youtube className="w-4 h-4" />
                  <span>
                    {language === 'te'
                      ? 'More Videos / Go to Channel (ఛానెల్‌కు వెళ్ళండి)'
                      : 'More Videos / Go to Channel'}
                  </span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
