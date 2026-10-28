'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  CheckCircle2,
  ExternalLink,
  Globe,
  ImagePlus,
  Lock,
  MessageCircle,
  PhoneCall,
  Youtube,
} from 'lucide-react';
import { INITIAL_STORE_DATA } from '@/lib/initial-data';
import { SVG_ASSETS } from '@/lib/svg-assets';
import {
  AppStoreData,
  AyurvedicHerbItem,
  GoogleAdsConfig,
  Language,
  PreparationMethodItem,
  SacredProductItem,
  ServiceItem,
} from '@/lib/types';
import {
  addHerbToStore,
  addPreparationToStore,
  addProductToStore,
  addServiceToStore,
  addYouTubeVideoToStore,
  filterOutNonChannelDemoVideos,
  removeHerbFromStore,
  removePreparationFromStore,
  removePrivateAdFromStore,
  removeProductFromStore,
  removeServiceFromStore,
  removeYouTubeVideoFromStore,
  sortVideosNewestFirst,
  submitPrivateAdToStore,
  updateGoogleAdsInStore,
  updateHerbInStore,
  updateLogoInStore,
  updatePreparationInStore,
  updatePrivateAdStatusInStore,
  updateProductInStore,
  updateServiceInStore,
} from '@/lib/store-logic';
import YoutubeSection from '@/components/YoutubeSection';
import ServicesSection from '@/components/ServicesSection';
import SacredYantrasSection from '@/components/SacredYantrasSection';
import HerbsAndPrepSection from '@/components/HerbsAndPrepSection';
import PrivateAdsAndGoogleAdsSection from '@/components/PrivateAdsAndGoogleAdsSection';
import AdminPanelModal, { AdminTab } from '@/components/AdminPanelModal';

export default function HomePage() {
  const [language, setLanguage] = useState<Language>('te');
  const [store, setStore] = useState<AppStoreData>(INITIAL_STORE_DATA);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [adminModalOpen, setAdminModalOpen] = useState<boolean>(false);
  const [adminInitialTab, setAdminInitialTab] = useState<AdminTab>('videos');
  const [adminEditService, setAdminEditService] =
    useState<ServiceItem | null>(null);
  const [adminEditProduct, setAdminEditProduct] =
    useState<SacredProductItem | null>(null);
  const [adminEditHerb, setAdminEditHerb] =
    useState<AyurvedicHerbItem | null>(null);
  const [adminEditPrep, setAdminEditPrep] =
    useState<PreparationMethodItem | null>(null);

  // Consultation / Order Booking Form State
  const [bookingName, setBookingName] = useState('');
  const [bookingPhone, setBookingPhone] = useState('');
  const [bookingTopic, setBookingTopic] = useState('');
  const [bookingMessage, setBookingMessage] = useState('');
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingConfirmed, setBookingConfirmed] = useState<string | null>(null);

  // Load persisted store from server API on mount
  useEffect(() => {
    let active = true;
    fetch('/api/store')
      .then((res) => (res.ok ? res.json() : null))
      .then((data: AppStoreData | null) => {
        if (active && data && Array.isArray(data.services)) {
          setStore({
            ...data,
            logoUrl: data.logoUrl || INITIAL_STORE_DATA.logoUrl,
            channelUrl:
              'https://www.youtube.com/channel/UCrcgWWGv5nrSeP2y79nt3GQ',
            videos: filterOutNonChannelDemoVideos(
              data.videos || [],
              INITIAL_STORE_DATA.videos
            ),
          });
        }
      })
      .catch(() => {
        // Fallback to initial store
      });
    return () => {
      active = false;
    };
  }, []);

  const persistStore = useCallback((nextStore: AppStoreData) => {
    setStore(nextStore);
    fetch('/api/store', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nextStore),
    }).catch(() => {
      // Ignore network error in offline mode
    });
  }, []);

  const handleSyncChannelVideos = useCallback(async () => {
    try {
      const res = await fetch('/api/youtube-sync');
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data.videos) && data.videos.length > 0) {
        const mergedMap = new Map<string, AppStoreData['videos'][number]>();
        for (const v of data.videos) {
          mergedMap.set(v.videoId, v);
        }
        for (const existing of store.videos) {
          if (!mergedMap.has(existing.videoId)) {
            mergedMap.set(existing.videoId, existing);
          }
        }
        const cleaned = filterOutNonChannelDemoVideos(
          Array.from(mergedMap.values()),
          INITIAL_STORE_DATA.videos
        );
        const nextStore: AppStoreData = {
          ...store,
          channelUrl:
            'https://www.youtube.com/channel/UCrcgWWGv5nrSeP2y79nt3GQ',
          videos: sortVideosNewestFirst(cleaned),
        };
        persistStore(nextStore);
      }
    } catch {
      // Ignore network error
    }
  }, [store, persistStore]);

  const handleOpenAdmin = (
    tab: AdminTab = 'videos',
    opts?: {
      service?: ServiceItem | null;
      product?: SacredProductItem | null;
      herb?: AyurvedicHerbItem | null;
      prep?: PreparationMethodItem | null;
    }
  ) => {
    setAdminInitialTab(tab);
    setAdminEditService(opts?.service || null);
    setAdminEditProduct(opts?.product || null);
    setAdminEditHerb(opts?.herb || null);
    setAdminEditPrep(opts?.prep || null);
    setAdminModalOpen(true);
  };

  const handleSelectTopicForConsultation = (topic: string) => {
    setBookingTopic(topic);
    const el = document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingName.trim() || !bookingPhone.trim()) {
      setBookingError(
        language === 'te'
          ? 'దయచేసి మీ పేరు మరియు ఫోన్ నంబర్ నమోదు చేయండి.'
          : 'Please enter your Name and Phone Number.'
      );
      return;
    }

    const nextStore: AppStoreData = {
      ...store,
      bookings: [
        {
          id: `bk-${Date.now()}`,
          name: bookingName.trim(),
          phone: bookingPhone.trim(),
          problemCategory:
            bookingTopic.trim() ||
            (language === 'te' ? 'సాధారణ సంప్రదింపు' : 'General Consultation'),
          message: bookingMessage.trim(),
          createdAt: Date.now(),
        },
        ...store.bookings,
      ],
    };

    persistStore(nextStore);
    setBookingError(null);
    setBookingConfirmed(
      language === 'te'
        ? `నమస్కారం ${bookingName}! మీ వివరాలు శ్రీనివాస్ మహారాజ్ గారి సద్గురు నాటు వైద్యం సెంటర్‌కు నమోదు చేయబడ్డాయి. తక్షణ పరిష్కారం కోసం 7093586539 కు నేరుగా కాల్ చేయండి.`
        : `Thank you ${bookingName}! Your request has been recorded for Srinivas Maharaj. For immediate consultation, call 7093586539 directly.`
    );
    setBookingName('');
    setBookingPhone('');
    setBookingMessage('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1C1613]">
      {/* Strict 3-Zone Top Navigation Bar Contract with Logo & Direct YouTube Channel Link */}
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-xs border-b border-[#E5DEC9]">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3.5">
          {/* Zone 1: Brand Logo + Wordmark */}
          <a
            href="#"
            className="inline-flex items-center gap-2.5 font-serif text-lg sm:text-xl font-bold tracking-tight text-[#1C1613] whitespace-nowrap shrink-0"
          >
            <img
              src={store.logoUrl || SVG_ASSETS.brandLogo}
              alt="Sadguru Natu Vaidyam Logo"
              referrerPolicy="no-referrer"
              className="w-9 h-9 rounded-full object-cover border border-[#D97706] shrink-0 bg-[#1C1613]"
              onError={(e) => {
                e.currentTarget.src = SVG_ASSETS.brandLogo;
              }}
            />
            <span>
              {language === 'te'
                ? 'సద్గురు నాటు వైద్యం'
                : 'Sadguru Natu Vaidyam'}
            </span>
          </a>

          {/* Zone 2: 5 concise single-line text navigation links (including Official YouTube Channel in Title Bar) */}
          <nav
            aria-label="Primary Navigation"
            className="hidden lg:flex items-center gap-6 text-sm font-medium text-[#4A3F37]"
          >
            <a
              href={store.channelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#991B1B] font-semibold hover:underline transition-colors whitespace-nowrap shrink-0"
            >
              {language === 'te' ? 'యూట్యూబ్ ఛానెల్' : 'YouTube Channel'}
            </a>
            <a
              href="#services"
              className="hover:text-[#991B1B] transition-colors whitespace-nowrap shrink-0"
            >
              {language === 'te' ? 'సమస్యలు & పరిష్కారాలు' : 'Services'}
            </a>
            <a
              href="#yantras"
              className="hover:text-[#991B1B] transition-colors whitespace-nowrap shrink-0"
            >
              {language === 'te' ? 'యంత్రములు & పూజ' : 'Yantras & Puja'}
            </a>
            <a
              href="#herbs"
              className="hover:text-[#991B1B] transition-colors whitespace-nowrap shrink-0"
            >
              {language === 'te' ? 'మూలికలు & తయారీ' : 'Herbs & Prep'}
            </a>
            <a
              href="#private-ads"
              className="hover:text-[#991B1B] transition-colors whitespace-nowrap shrink-0"
            >
              {language === 'te' ? 'ప్రైవేట్ యాడ్స్' : 'Private Ads'}
            </a>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center shrink-0">
            <a
              href={`tel:${store.contactPhone}`}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#991B1B] rounded-lg hover:bg-[#7F1D1D] transition-colors whitespace-nowrap shrink-0 tabular-nums"
            >
              {language === 'te'
                ? `కాల్: ${store.contactPhone}`
                : `Call: ${store.contactPhone}`}
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero & Practitioner Sanctuary Section */}
        <section className="py-10 md:py-16 border-b border-[#E5DEC9] bg-[#FAF7F2]">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
            {/* Workspace Utility Strip (Bilingual Language Switcher + Direct YouTube Link + Logo & Admin Access) */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-6 mb-8 border-b border-[#E5DEC9]">
              {/* Language Switcher (Telugu / English) */}
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#991B1B]" />
                <div
                  role="group"
                  aria-label="Language Switcher"
                  className="inline-flex items-center gap-1 p-1 bg-[#EFE8DA] rounded-lg border border-[#D6CEB8]"
                >
                  <button
                    type="button"
                    onClick={() => setLanguage('te')}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                      language === 'te'
                        ? 'bg-[#991B1B] text-white'
                        : 'text-[#4A3F37] hover:text-[#1C1613]'
                    }`}
                  >
                    తెలుగు (Telugu)
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage('en')}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                      language === 'en'
                        ? 'bg-[#991B1B] text-white'
                        : 'text-[#4A3F37] hover:text-[#1C1613]'
                    }`}
                  >
                    English (ఇంగ్లీష్)
                  </button>
                </div>
              </div>

              {/* Official YouTube Channel + Logo Upload & Admin Login */}
              <div className="flex flex-wrap items-center gap-2.5">
                <a
                  href={store.channelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-[#F3EDE2] text-[#991B1B] border border-[#D6CEB8] text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0"
                >
                  <Youtube className="w-3.5 h-3.5 text-[#991B1B]" />
                  <span>
                    {language === 'te'
                      ? 'సద్గురు నాటు వైద్యం YouTube ఛానెల్'
                      : 'Sadguru Naatu Vaidyam YouTube'}
                  </span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <button
                  type="button"
                  onClick={() => handleOpenAdmin('videos')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#F3EDE2] text-[#1C1613] border border-[#D6CEB8] text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0"
                >
                  <ImagePlus className="w-3.5 h-3.5 text-[#991B1B]" />
                  <span>
                    {language === 'te' ? 'లోగో మార్చు (Logo)' : 'Upload Logo'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenAdmin('videos')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#1C1613] hover:bg-[#332924] text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0"
                >
                  <Lock className="w-3.5 h-3.5 text-[#FDE68A]" />
                  <span>
                    {isAdmin
                      ? language === 'te'
                        ? 'అడ్మిన్ డ్యాష్‌బోర్డ్ (Admin Active)'
                        : 'Admin Dashboard (Unlocked)'
                      : language === 'te'
                      ? 'అడ్మిన్ లాగిన్ (Admin Panel)'
                      : 'Admin Login'}
                  </span>
                </button>
              </div>
            </div>

            {/* 2-Column Balanced Hero Split */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
              {/* Left Column: Practitioner Identity, Value Proposition & Primary Action */}
              <div className="lg:col-span-7 flex flex-col justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-semibold tracking-wider text-[#991B1B] mb-3">
                    {language === 'te'
                      ? 'తంత్ర వైద్యుడు & జ్యోతిష్య నిపుణుడు — శ్రీనివాస్ మహారాజ్'
                      : 'TANTRA VAIDYA & VEDIC ASTROLOGY EXPERT — SRINIVAS MAHARAJ'}
                  </p>

                  <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1C1613] leading-[1.15] tracking-tight mb-5 max-w-2xl">
                    {language === 'te'
                      ? 'సద్గురు నాటు వైద్యం & తాంత్రిక జ్యోతిష్య పరిష్కార కేంద్రం'
                      : 'Sadguru Natu Vaidyam & Sacred Tantric Astrology Sanctuary'}
                  </h1>

                  <p className="text-base sm:text-lg text-[#4A3F37] leading-relaxed mb-6 max-w-2xl">
                    {language === 'te'
                      ? 'నా పేరు శ్రీనివాస్ మహారాజ్. నేను ఒక తంత్ర వైద్యుడిని మరియు జ్యోతిష్య నిపుణుడను. వశీకరణ, భార్యాభర్తల సమస్యలు, ప్రేమికుల సమస్యలు, స్వయం సంపర్కుల ప్రేమ వ్యవహారం, హిజ్రాలను ప్రేమ పేరుతో మోసం చేసే మగవారిని దారికి తీసుకురావడం, మరుగు మందు, మర్ల మందు తొలగింపు, చేతబడి నిర్మూలన, అంగస్తంభన, శీఘ్రస్కలనం, స్త్రీలలో వక్షోజాల పరిమాణం పెరుగుదల మరియు అన్ని దాంపత్య ఆరోగ్య సమస్యలకు శీఘ్ర పరిష్కారం చూపబడును.'
                      : 'I am Srinivas Maharaj, a traditional Tantra Vaidya and Vedic Astrologer. We provide time-tested solutions for Vashikaran, marital disputes, lovers reunion, same-sex relationship harmony, justice for deceived transgender partners, Marugu Mandu, Marla Mandu detoxification, black magic removal, erectile strength, premature ejaculation, natural female bust enhancement, and complete conjugal wellness.'}
                  </p>

                  {/* Unboxed Trust & Capability Summary */}
                  <div className="py-4 border-y border-[#E5DEC9] mb-6 text-xs sm:text-sm text-[#574B42] flex flex-wrap items-center gap-x-3 gap-y-1.5">
                    <span className="font-semibold text-[#1C1613]">
                      {language === 'te'
                        ? 'అభిమంత్రించిన యంత్రములు లభించును'
                        : 'Consecrated Copper Yantras'}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="font-semibold text-[#1C1613]">
                      {language === 'te'
                        ? 'పూజకు సంబంధించిన ప్రతి వస్తువు దొరుకును'
                        : 'Every Sacred Puja Item Available'}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="font-semibold text-[#1C1613]">
                      {language === 'te'
                        ? '100% సహజ ఆయుర్వేద నాటు వైద్యం'
                        : '100% Pure Herbal Natu Vaidyam'}
                    </span>
                  </div>
                </div>

                {/* Primary Conversion CTA Cluster */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <a
                    href={`tel:${store.contactPhone}`}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#991B1B] hover:bg-[#7F1D1D] text-white text-sm font-bold rounded-xl transition-colors whitespace-nowrap shrink-0 tabular-nums"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>
                      {language === 'te'
                        ? `నేరుగా సంప్రదించండి: ${store.contactPhone}`
                        : `Call Srinivas Maharaj: ${store.contactPhone}`}
                    </span>
                  </a>

                  <a
                    href={`https://wa.me/91${store.contactPhone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#15803D] hover:bg-[#166534] text-white text-sm font-semibold rounded-xl transition-colors whitespace-nowrap shrink-0"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>
                      {language === 'te'
                        ? 'వాట్సాప్ సంప్రదింపు'
                        : 'WhatsApp Consultation'}
                    </span>
                  </a>

                  <a
                    href="#contact"
                    className="inline-flex items-center justify-center px-4 py-3 bg-white hover:bg-[#F3EDE2] text-[#1C1613] border border-[#D6CEB8] text-sm font-semibold rounded-xl transition-colors whitespace-nowrap shrink-0"
                  >
                    {language === 'te'
                      ? 'ఆన్‌లైన్ అపాయింట్‌మెంట్'
                      : 'Book Online'}
                  </a>
                </div>
              </div>

              {/* Right Column: Consecrated Sri Maha Meru Yantra & Practitioner Visual Card */}
              <div className="lg:col-span-5">
                <div className="h-full bg-[#1C1613] rounded-2xl border border-[#D6CEB8] overflow-hidden flex flex-col justify-between">
                  <div className="aspect-[16/10] lg:aspect-auto lg:flex-1 relative overflow-hidden">
                    <img
                      src={SVG_ASSETS.sriYantra}
                      alt="Sadguru Natu Vaidyam Sri Yantra Sanctuary"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6 bg-gradient-to-t from-[#120B07] to-[#1C1613] text-white border-t border-white/10">
                    <p className="text-xs text-[#FDE68A] font-medium mb-1">
                      {language === 'te'
                        ? 'సద్గురు నాటు వైద్యం సెంటర్ — సంప్రదింపు నంబర్'
                        : 'SADGURU NATU VAIDYAM CENTER — DIRECT HELPLINE'}
                    </p>
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h2 className="font-serif text-xl font-bold text-white">
                          {store.practitionerName[language]}
                        </h2>
                        <p className="text-xs text-white/75">
                          {language === 'te'
                            ? 'అన్ని సమస్యలకు పూర్తి గోప్యతతో శీఘ్ర పరిష్కారం'
                            : '100% Confidential Tantric, Astrological & Herbal Care'}
                        </p>
                      </div>
                      <span className="font-mono text-lg sm:text-xl font-bold text-[#FDE68A] tabular-nums">
                        {store.contactPhone}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Full-Width 4-Column Key Pillars Row Below Hero Split */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  numTe: '21+',
                  numEn: '21+',
                  labelTe: 'సమస్యలు & పరిష్కారాలు',
                  labelEn: 'Specialized Tantric & Astrological Remedies',
                  subTe: 'వశీకరణ, చేతబడి, కోర్టు కేసులు & కుటుంబ శాంతి',
                  subEn: 'Vashikaran, Black Magic Removal & Family Harmony',
                },
                {
                  numTe: '100%',
                  numEn: '100%',
                  labelTe: 'మూలికలు & తయారీ విధానం',
                  labelEn: 'Authentic Forest & Ayurvedic Herbs',
                  subTe: 'అంగస్తంభన, శీఘ్రస్కలనం & వక్షోజ వృద్ధి పరిహారాలు',
                  subEn: 'Vitality, Stamina & Natural Bust Toning Remedies',
                },
                {
                  numTe: '41 రోజులు',
                  numEn: '41 Days',
                  labelTe: 'యంత్రములు & పూజా సామాగ్రి',
                  labelEn: '41-Day Energized Copper Yantras',
                  subTe: 'పూజకు సంబంధించిన ప్రతి వస్తువు మనదగ్గర లభించును',
                  subEn: 'Every Sacred Yantra & Puja Samagri Item in Stock',
                },
                {
                  numTe: '7093586539',
                  numEn: '7093586539',
                  labelTe: 'ప్రత్యక్ష ఫోన్ & కొరియర్ సేవ',
                  labelEn: 'Direct Consultation & Courier',
                  subTe: 'దేశవ్యాప్తంగా గోప్యమైన పార్శిల్ సదుపాయం కలదు',
                  subEn: 'Discreet Doorstep Delivery Across India',
                },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="p-5 bg-white rounded-xl border border-[#E5DEC9]"
                >
                  <p className="font-mono text-xl font-bold text-[#991B1B] tabular-nums mb-1">
                    {language === 'te' ? stat.numTe : stat.numEn}
                  </p>
                  <h3 className="text-sm font-bold text-[#1C1613]">
                    {language === 'te' ? stat.labelTe : stat.labelEn}
                  </h3>
                  <p className="text-xs text-[#6E6053] mt-1">
                    {language === 'te' ? stat.subTe : stat.subEn}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 1: YOUTUBE CHANNEL VIDEOS (ONLY USER CHANNEL VIDEOS, NEWEST 1ST) */}
        <YoutubeSection
          language={language}
          channelUrl={store.channelUrl}
          videos={store.videos}
          isAdmin={isAdmin}
          onAddVideo={(input) => {
            const res = addYouTubeVideoToStore(store, input);
            if (res.error) return res.error;
            persistStore(res.store);
            return null;
          }}
          onSyncChannelVideos={handleSyncChannelVideos}
          onOpenAdmin={() => handleOpenAdmin('videos')}
        />

        {/* SECTION 2: సమస్యలు & పరిష్కారాలు (COMPLETE 21+ SERVICES & REMEDIES) */}
        <ServicesSection
          language={language}
          services={store.services}
          contactPhone={store.contactPhone}
          isAdmin={isAdmin}
          onSelectServiceForConsultation={handleSelectTopicForConsultation}
          onOpenAdminServices={(editSrv) =>
            handleOpenAdmin('services', { service: editSrv || null })
          }
        />

        {/* SECTION 3: యంత్రములు & పూజ (SACRED YANTRAS & COMPLETE PUJA SAMAGRI) */}
        <SacredYantrasSection
          language={language}
          products={store.products}
          contactPhone={store.contactPhone}
          isAdmin={isAdmin}
          onInquireProduct={handleSelectTopicForConsultation}
          onOpenAdminProducts={(editProduct) =>
            handleOpenAdmin('products', { product: editProduct || null })
          }
        />

        {/* SECTION 4: మూలికలు & తయారీ (COMPREHENSIVE AYURVEDIC HERBS & MEDICINE PREPARATION) */}
        <HerbsAndPrepSection
          language={language}
          herbs={store.herbs}
          preparations={store.preparations}
          isAdmin={isAdmin}
          onConsultHerbOrPrep={handleSelectTopicForConsultation}
          onOpenAdminHerbs={(editHerb, editPrep) =>
            handleOpenAdmin('herbs', {
              herb: editHerb || null,
              prep: editPrep || null,
            })
          }
        />

        {/* SECTION 5: GOOGLE ADSENSE & PRIVATE ADS */}
        <PrivateAdsAndGoogleAdsSection
          language={language}
          privateAds={store.privateAds}
          googleAds={store.googleAds}
          isAdmin={isAdmin}
          onSubmitPrivateAd={(input) => {
            const next = submitPrivateAdToStore(store, input);
            persistStore(next);
          }}
          onOpenAdminAds={() => handleOpenAdmin('privateAds')}
        />

        {/* SECTION 6: DIRECT CONSULTATION & ORDER FORM */}
        <section
          id="contact"
          className="py-16 md:py-24 bg-[#FAF7F2] border-b border-[#E5DEC9]"
        >
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              <div className="lg:col-span-5 space-y-5">
                <p className="text-xs font-medium tracking-wider text-[#991B1B]">
                  {language === 'te'
                    ? 'సద్గురు నాటు వైద్యం సెంటర్‌ను సంప్రదించండి'
                    : 'CONTACT SADGURU NATU VAIDYAM CENTER'}
                </p>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1613]">
                  {language === 'te'
                    ? 'శ్రీనివాస్ మహారాజ్ గారితో ప్రత్యక్ష సంప్రదింపు & యంత్ర / మందుల ఆర్డర్'
                    : 'Consult Srinivas Maharaj or Order Sacred Yantras & Herbal Medicines'}
                </h2>
                <p className="text-sm sm:text-base text-[#574B42] leading-relaxed">
                  {language === 'te'
                    ? 'మీ వ్యక్తిగత, కుటుంబ, దాంపత్య, ఆర్థిక లేదా ఆరోగ్య సమస్య ఏదైనా సరే పూర్తి గోప్యతతో పరిష్కరించబడుతుంది. పూజకు సంబంధించిన ప్రతి వస్తువు మరియు అభిమంత్రించిన యంత్రములు కొరియర్ ద్వారా పంపబడును.'
                    : 'Every personal, marital, financial, or vitality concern is handled with strict confidentiality. Energized Yantras, Puja items, and herbal remedies are shipped nationwide.'}
                </p>

                <div className="p-6 bg-white rounded-xl border border-[#E5DEC9] space-y-4">
                  <div>
                    <p className="text-xs text-[#786B5E]">
                      {language === 'te'
                        ? 'ప్రత్యక్ష ఫోన్ & వాట్సాప్ నంబర్'
                        : 'Direct Phone & WhatsApp Number'}
                    </p>
                    <a
                      href={`tel:${store.contactPhone}`}
                      className="font-mono text-2xl font-bold text-[#991B1B] tabular-nums hover:underline"
                    >
                      +91 {store.contactPhone}
                    </a>
                  </div>

                  <div>
                    <p className="text-xs text-[#786B5E]">
                      {language === 'te' ? 'నిపుణులు' : 'Chief Practitioner'}
                    </p>
                    <p className="text-base font-bold text-[#1C1613]">
                      {store.practitionerName[language]} (
                      {language === 'te'
                        ? 'తంత్ర వైద్యుడు & జ్యోతిష్య నిపుణుడు'
                        : 'Tantra Vaidya & Vedic Astrologer'}
                      )
                    </p>
                  </div>

                  <div className="pt-2 flex flex-wrap gap-3">
                    <a
                      href={`tel:${store.contactPhone}`}
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#991B1B] text-white text-xs font-semibold rounded-lg"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>
                        {language === 'te' ? 'ఇప్పుడే కాల్ చేయండి' : 'Call Now'}
                      </span>
                    </a>
                    <a
                      href={store.channelUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#FAF7F2] text-[#1C1613] border border-[#D6CEB8] text-xs font-semibold rounded-lg"
                    >
                      <Youtube className="w-3.5 h-3.5 text-[#991B1B]" />
                      <span>
                        {language === 'te'
                          ? 'యూట్యూబ్ ఛానెల్'
                          : 'YouTube Channel'}
                      </span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Right Column: Validated Consultation Form */}
              <div className="lg:col-span-7 bg-white rounded-xl border border-[#E5DEC9] p-6 sm:p-8">
                <h3 className="font-serif text-xl font-bold text-[#1C1613] mb-4">
                  {language === 'te'
                    ? 'మీ సమస్య లేదా కావలసిన యంత్రం / మందు వివరాలు పంపండి'
                    : 'Send Your Consultation or Product Order Inquiry'}
                </h3>

                {bookingConfirmed && (
                  <div className="mb-6 p-4 bg-[#DCFCE7] border border-[#15803D] rounded-xl flex items-start gap-3 text-sm text-[#15803D] font-medium">
                    <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                    <span>{bookingConfirmed}</span>
                  </div>
                )}

                {bookingError && (
                  <div className="mb-4 p-3 bg-[#FEF2F2] border border-[#FECACA] text-[#B91C1C] text-xs font-semibold rounded-lg">
                    {bookingError}
                  </div>
                )}

                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="booking-name"
                        className="block text-xs font-semibold text-[#1C1613] mb-1.5"
                      >
                        {language === 'te'
                          ? 'మీ పూర్తి పేరు (Your Name) *'
                          : 'Your Full Name *'}
                      </label>
                      <input
                        id="booking-name"
                        type="text"
                        value={bookingName}
                        onChange={(e) => setBookingName(e.target.value)}
                        placeholder={
                          language === 'te'
                            ? 'మీ పేరు నమోదు చేయండి...'
                            : 'Enter your name...'
                        }
                        className="w-full px-3.5 py-2.5 text-sm bg-[#FAF7F2] border border-[#D6CEB8] rounded-lg text-[#1C1613]"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="booking-phone"
                        className="block text-xs font-semibold text-[#1C1613] mb-1.5"
                      >
                        {language === 'te'
                          ? 'ఫోన్ / వాట్సాప్ నంబర్ (Phone Number) *'
                          : 'Phone / WhatsApp Number *'}
                      </label>
                      <input
                        id="booking-phone"
                        type="tel"
                        value={bookingPhone}
                        onChange={(e) => setBookingPhone(e.target.value)}
                        placeholder="e.g. 9876543210"
                        className="w-full px-3.5 py-2.5 text-sm bg-[#FAF7F2] border border-[#D6CEB8] rounded-lg text-[#1C1613]"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="booking-topic"
                      className="block text-xs font-semibold text-[#1C1613] mb-1.5"
                    >
                      {language === 'te'
                        ? 'సమస్య రకం / కావలసిన యంత్రం లేదా పూజా వస్తువు'
                        : 'Selected Service / Sacred Yantra / Herbal Remedy'}
                    </label>
                    <input
                      id="booking-topic"
                      type="text"
                      value={bookingTopic}
                      onChange={(e) => setBookingTopic(e.target.value)}
                      placeholder={
                        language === 'te'
                          ? 'ఉదా: వశీకరణ, మర్ల మందు తొలగింపు, శ్రీ చక్ర యంత్రం, అంగస్తంభన వైద్యం...'
                          : 'e.g. Vashikaran, Marla Mandu Detox, Sri Chakra Yantra, Vitality Kit...'
                      }
                      className="w-full px-3.5 py-2.5 text-sm bg-[#FAF7F2] border border-[#D6CEB8] rounded-lg text-[#1C1613]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="booking-msg"
                      className="block text-xs font-semibold text-[#1C1613] mb-1.5"
                    >
                      {language === 'te'
                        ? 'మీ సమస్య పూర్తి వివరాలు (Message)'
                        : 'Additional Details'}
                    </label>
                    <textarea
                      id="booking-msg"
                      rows={3}
                      value={bookingMessage}
                      onChange={(e) => setBookingMessage(e.target.value)}
                      placeholder={
                        language === 'te'
                          ? 'మీ సమస్య లేదా చిరునామా వివరాలను గోప్యంగా ఇక్కడ రాయండి...'
                          : 'Describe your situation confidentially...'
                      }
                      className="w-full px-3.5 py-2.5 text-sm bg-[#FAF7F2] border border-[#D6CEB8] rounded-lg text-[#1C1613]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#991B1B] hover:bg-[#7F1D1D] text-white text-sm font-bold rounded-xl transition-colors"
                  >
                    {language === 'te'
                      ? 'వివరాలు నమోదు చేయండి (Submit Consultation Request)'
                      : 'Submit Consultation / Order Request'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Quiet Editorial Footer */}
      <footer className="bg-[#1C1613] text-white/80 py-12">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img
              src={store.logoUrl || SVG_ASSETS.brandLogo}
              alt="Sadguru Natu Vaidyam Logo"
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-full object-cover border border-[#D97706] shrink-0"
            />
            <div>
              <p className="font-serif text-xl font-bold text-white">
                {store.centerName[language]} —{' '}
                {store.practitionerName[language]}
              </p>
              <p className="text-xs text-white/60 mt-1">
                {language === 'te'
                  ? 'తంత్ర వైద్యం · జ్యోతిష్యం · ఆయుర్వేద నాటు వైద్యం · అభిమంత్రించిన యంత్రములు & పూజా సామాగ్రి · సంప్రదించండి: 7093586539'
                  : 'Tantra Vaidyam · Vedic Astrology · Ayurvedic Natu Vaidyam · Sacred Yantras & Puja Samagri · Contact: 7093586539'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs">
            <a
              href={store.channelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white underline"
            >
              YouTube Channel
            </a>
            <a
              href={`tel:${store.contactPhone}`}
              className="hover:text-white tabular-nums"
            >
              +91 {store.contactPhone}
            </a>
            <button
              type="button"
              onClick={() => handleOpenAdmin('videos')}
              className="text-[#FDE68A] hover:underline"
            >
              {language === 'te' ? 'అడ్మిన్ లాగిన్' : 'Admin Panel'}
            </button>
          </div>
        </div>
      </footer>

      {/* Admin Control Panel Modal */}
      <AdminPanelModal
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
        language={language}
        store={store}
        isAdmin={isAdmin}
        onSetAdmin={setIsAdmin}
        initialTab={adminInitialTab}
        initialEditService={adminEditService}
        initialEditProduct={adminEditProduct}
        initialEditHerb={adminEditHerb}
        initialEditPrep={adminEditPrep}
        onUpdateLogo={(logoUrl) => {
          persistStore(updateLogoInStore(store, logoUrl));
        }}
        onAddVideo={(input) => {
          const res = addYouTubeVideoToStore(store, input);
          if (res.error) return res.error;
          persistStore(res.store);
          return null;
        }}
        onRemoveVideo={(id) => {
          persistStore(removeYouTubeVideoFromStore(store, id));
        }}
        onSyncChannelVideos={handleSyncChannelVideos}
        onUpdateChannelUrl={(url) => {
          persistStore({
            ...store,
            channelUrl: url.trim() || store.channelUrl,
          });
        }}
        onAddService={(input) => {
          persistStore(addServiceToStore(store, input));
        }}
        onUpdateService={(srv) => {
          persistStore(updateServiceInStore(store, srv));
        }}
        onRemoveService={(id) => {
          persistStore(removeServiceFromStore(store, id));
        }}
        onAddProduct={(input) => {
          persistStore(addProductToStore(store, input));
        }}
        onUpdateProduct={(prod) => {
          persistStore(updateProductInStore(store, prod));
        }}
        onRemoveProduct={(id) => {
          persistStore(removeProductFromStore(store, id));
        }}
        onAddHerb={(input) => {
          persistStore(addHerbToStore(store, input));
        }}
        onUpdateHerb={(herb) => {
          persistStore(updateHerbInStore(store, herb));
        }}
        onRemoveHerb={(id) => {
          persistStore(removeHerbFromStore(store, id));
        }}
        onAddPreparation={(input) => {
          persistStore(addPreparationToStore(store, input));
        }}
        onUpdatePreparation={(prep) => {
          persistStore(updatePreparationInStore(store, prep));
        }}
        onRemovePreparation={(id) => {
          persistStore(removePreparationFromStore(store, id));
        }}
        onApprovePrivateAd={(id) => {
          persistStore(updatePrivateAdStatusInStore(store, id, 'approved'));
        }}
        onRemovePrivateAd={(id) => {
          persistStore(removePrivateAdFromStore(store, id));
        }}
        onUpdateGoogleAds={(cfg: GoogleAdsConfig) => {
          persistStore(updateGoogleAdsInStore(store, cfg));
        }}
      />
    </div>
  );
}
