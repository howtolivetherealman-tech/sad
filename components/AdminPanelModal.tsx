'use client';

import React, { useState, useEffect } from 'react';
import {
  Check,
  Edit3,
  ImagePlus,
  Lock,
  LogOut,
  Plus,
  RefreshCw,
  Trash2,
  X,
} from 'lucide-react';
import {
  AppStoreData,
  AyurvedicHerbItem,
  GoogleAdsConfig,
  Language,
  PreparationMethodItem,
  SacredProductItem,
  ServiceItem,
} from '@/lib/types';
import { verifyAdminPassword } from '@/lib/store-logic';
import { SVG_ASSETS } from '@/lib/svg-assets';

export type AdminTab =
  | 'videos'
  | 'services'
  | 'products'
  | 'herbs'
  | 'privateAds'
  | 'googleAds';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  store: AppStoreData;
  isAdmin: boolean;
  onSetAdmin: (val: boolean) => void;
  initialTab?: AdminTab;
  initialEditService?: ServiceItem | null;
  initialEditProduct?: SacredProductItem | null;
  initialEditHerb?: AyurvedicHerbItem | null;
  initialEditPrep?: PreparationMethodItem | null;
  onUpdateLogo: (logoUrl: string) => void;
  onAddVideo: (input: {
    url: string;
    titleTe: string;
    titleEn?: string;
    descriptionTe?: string;
  }) => string | null;
  onRemoveVideo: (id: string) => void;
  onSyncChannelVideos: () => Promise<void>;
  onUpdateChannelUrl: (url: string) => void;
  onAddService: (input: {
    category: ServiceItem['category'];
    titleTe: string;
    titleEn?: string;
    descriptionTe: string;
    descriptionEn?: string;
    remedyNoteTe?: string;
    imageUrl?: string;
  }) => void;
  onUpdateService: (srv: ServiceItem) => void;
  onRemoveService: (id: string) => void;
  onAddProduct: (input: {
    category: SacredProductItem['category'];
    nameTe: string;
    nameEn?: string;
    subtitleTe?: string;
    descriptionTe: string;
    benefitsTe?: string;
    price: number;
    imageUrl: string;
  }) => void;
  onUpdateProduct: (prod: SacredProductItem) => void;
  onRemoveProduct: (id: string) => void;
  onAddHerb: (input: {
    sanskritName?: string;
    nameTe: string;
    nameEn?: string;
    partUsedTe?: string;
    propertiesTe?: string;
    benefitsTe: string;
    usageMethodTe?: string;
    imageUrl?: string;
  }) => void;
  onUpdateHerb: (herb: AyurvedicHerbItem) => void;
  onRemoveHerb: (id: string) => void;
  onAddPreparation: (input: {
    titleTe: string;
    titleEn?: string;
    subtitleTe?: string;
    ingredientsTe: string;
    stepsTe: string[];
    dosageTe?: string;
    imageUrl?: string;
  }) => void;
  onUpdatePreparation: (prep: PreparationMethodItem) => void;
  onRemovePreparation: (id: string) => void;
  onApprovePrivateAd: (id: string) => void;
  onRemovePrivateAd: (id: string) => void;
  onUpdateGoogleAds: (cfg: GoogleAdsConfig) => void;
}

export default function AdminPanelModal({
  isOpen,
  onClose,
  language,
  store,
  isAdmin,
  onSetAdmin,
  initialTab = 'videos',
  initialEditService = null,
  initialEditProduct = null,
  initialEditHerb = null,
  initialEditPrep = null,
  onUpdateLogo,
  onAddVideo,
  onRemoveVideo,
  onSyncChannelVideos,
  onUpdateChannelUrl,
  onAddService,
  onUpdateService,
  onRemoveService,
  onAddProduct,
  onUpdateProduct,
  onRemoveProduct,
  onAddHerb,
  onUpdateHerb,
  onRemoveHerb,
  onAddPreparation,
  onUpdatePreparation,
  onRemovePreparation,
  onApprovePrivateAd,
  onRemovePrivateAd,
  onUpdateGoogleAds,
}: AdminPanelModalProps) {
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>(initialTab);
  const [statusToast, setStatusToast] = useState<string | null>(null);

  // Website Logo state
  const [logoInputUrl, setLogoInputUrl] = useState(store.logoUrl);

  // Video form state
  const [vidUrl, setVidUrl] = useState('');
  const [vidTitleTe, setVidTitleTe] = useState('');
  const [vidDescTe, setVidDescTe] = useState('');
  const [channelInput, setChannelInput] = useState(store.channelUrl);
  const [syncingChannel, setSyncingChannel] = useState(false);

  // 1. సమస్యలు & పరిష్కారాలు (Services form state)
  const [editingSrvId, setEditingSrvId] = useState<string | null>(null);
  const [srvCategory, setSrvCategory] =
    useState<ServiceItem['category']>('tantra');
  const [srvTitleTe, setSrvTitleTe] = useState('');
  const [srvTitleEn, setSrvTitleEn] = useState('');
  const [srvDescTe, setSrvDescTe] = useState('');
  const [srvRemedyTe, setSrvRemedyTe] = useState('');
  const [srvImageUrl, setSrvImageUrl] = useState('');

  // 2. యంత్రములు & పూజ (Products form state)
  const [editingProdId, setEditingProdId] = useState<string | null>(null);
  const [prodCategory, setProdCategory] =
    useState<SacredProductItem['category']>('yantra');
  const [prodNameTe, setProdNameTe] = useState('');
  const [prodNameEn, setProdNameEn] = useState('');
  const [prodDescTe, setProdDescTe] = useState('');
  const [prodBenefitsTe, setProdBenefitsTe] = useState('');
  const [prodPrice, setProdPrice] = useState('2100');
  const [prodImageUrl, setProdImageUrl] = useState(SVG_ASSETS.sriYantra);

  // 3. మూలికలు & తయారీ (Herbs & Medicine Preparation form state)
  const [herbSubTab, setHerbSubTab] = useState<'herbs' | 'prep'>('herbs');
  const [editingHerbId, setEditingHerbId] = useState<string | null>(null);
  const [herbSanskrit, setHerbSanskrit] = useState('');
  const [herbNameTe, setHerbNameTe] = useState('');
  const [herbPartTe, setHerbPartTe] = useState('');
  const [herbPropTe, setHerbPropTe] = useState('');
  const [herbBenefitsTe, setHerbBenefitsTe] = useState('');
  const [herbUsageTe, setHerbUsageTe] = useState('');
  const [herbImageUrl, setHerbImageUrl] = useState(
    SVG_ASSETS.herbalVitalityKit
  );

  const [editingPrepId, setEditingPrepId] = useState<string | null>(null);
  const [prepTitleTe, setPrepTitleTe] = useState('');
  const [prepSubtitleTe, setPrepSubtitleTe] = useState('');
  const [prepIngredientsTe, setPrepIngredientsTe] = useState('');
  const [prepStepsText, setPrepStepsText] = useState('');
  const [prepDosageTe, setPrepDosageTe] = useState('');
  const [prepImageUrl, setPrepImageUrl] = useState('');

  // Google AdSense state
  const [gEnabled, setGEnabled] = useState(store.googleAds.enabled);
  const [gLinkUrl, setGLinkUrl] = useState(store.googleAds.adLinkUrl);
  const [gClientId, setGClientId] = useState(
    store.googleAds.adsenseClientId || 'ca-pub-6709151112965859'
  );
  const [gMetaTag, setGMetaTag] = useState(
    store.googleAds.adsenseMetaTag ||
      '<meta name="google-adsense-account" content="ca-pub-6709151112965859">'
  );
  const [gScript, setGScript] = useState(store.googleAds.adScriptOrCode);
  const [gHeadlineTe, setGHeadlineTe] = useState(store.googleAds.headline.te);
  const [gHeadlineEn, setGHeadlineEn] = useState(store.googleAds.headline.en);
  const [gSubtextTe, setGSubtextTe] = useState(store.googleAds.subtext.te);

  useEffect(() => {
    setActiveTab(initialTab);
    setLogoInputUrl(store.logoUrl);
  }, [initialTab, isOpen, store.logoUrl]);

  useEffect(() => {
    if (initialEditService) {
      setActiveTab('services');
      setEditingSrvId(initialEditService.id);
      setSrvCategory(initialEditService.category);
      setSrvTitleTe(initialEditService.title.te);
      setSrvTitleEn(initialEditService.title.en);
      setSrvDescTe(initialEditService.description.te);
      setSrvRemedyTe(initialEditService.remedyNote.te);
      setSrvImageUrl(initialEditService.imageUrl || '');
    }
  }, [initialEditService]);

  useEffect(() => {
    if (initialEditProduct) {
      setActiveTab('products');
      setEditingProdId(initialEditProduct.id);
      setProdCategory(initialEditProduct.category);
      setProdNameTe(initialEditProduct.name.te);
      setProdNameEn(initialEditProduct.name.en);
      setProdDescTe(initialEditProduct.description.te);
      setProdBenefitsTe(initialEditProduct.benefits.te);
      setProdPrice(String(initialEditProduct.price));
      setProdImageUrl(initialEditProduct.imageUrl);
    }
  }, [initialEditProduct]);

  useEffect(() => {
    if (initialEditHerb) {
      setActiveTab('herbs');
      setHerbSubTab('herbs');
      setEditingHerbId(initialEditHerb.id);
      setHerbSanskrit(initialEditHerb.sanskritName);
      setHerbNameTe(initialEditHerb.name.te);
      setHerbPartTe(initialEditHerb.partUsed.te);
      setHerbPropTe(initialEditHerb.properties.te);
      setHerbBenefitsTe(initialEditHerb.benefits.te);
      setHerbUsageTe(initialEditHerb.usageMethod.te);
      setHerbImageUrl(initialEditHerb.imageUrl);
    }
  }, [initialEditHerb]);

  useEffect(() => {
    if (initialEditPrep) {
      setActiveTab('herbs');
      setHerbSubTab('prep');
      setEditingPrepId(initialEditPrep.id);
      setPrepTitleTe(initialEditPrep.title.te);
      setPrepSubtitleTe(initialEditPrep.subtitle.te);
      setPrepIngredientsTe(initialEditPrep.ingredients.te);
      setPrepStepsText(initialEditPrep.processSteps.te.join('\n'));
      setPrepDosageTe(initialEditPrep.dosageAndPrecautions.te);
      setPrepImageUrl(initialEditPrep.imageUrl || '');
    }
  }, [initialEditPrep]);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setStatusToast(msg);
    setTimeout(() => setStatusToast(null), 3500);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyAdminPassword(passwordInput)) {
      onSetAdmin(true);
      setPasswordInput('');
      setLoginError(null);
    } else {
      setLoginError(
        language === 'te'
          ? 'తప్పు పాస్‌వర్డ్. దయచేసి సరైన అడ్మిన్ పాస్‌వర్డ్ నమోదు చేయండి.'
          : 'Invalid admin password. Please enter the authorized password.'
      );
    }
  };

  const readFileIntoState = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (dataUrl: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setter(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!srvTitleTe.trim() || !srvDescTe.trim()) return;

    if (editingSrvId) {
      const existing = store.services.find((s) => s.id === editingSrvId);
      if (existing) {
        onUpdateService({
          ...existing,
          category: srvCategory,
          title: {
            te: srvTitleTe.trim(),
            en: srvTitleEn.trim() || srvTitleTe.trim(),
          },
          description: {
            te: srvDescTe.trim(),
            en: srvDescTe.trim(),
          },
          remedyNote: {
            te: srvRemedyTe.trim() || existing.remedyNote.te,
            en: srvRemedyTe.trim() || existing.remedyNote.en,
          },
          imageUrl: srvImageUrl.trim() || undefined,
        });
        showToast(
          language === 'te'
            ? 'సమస్య & పరిష్కార సేవ అప్‌డేట్ చేయబడింది!'
            : 'Service & upload updated successfully!'
        );
      }
    } else {
      onAddService({
        category: srvCategory,
        titleTe: srvTitleTe,
        titleEn: srvTitleEn || srvTitleTe,
        descriptionTe: srvDescTe,
        remedyNoteTe: srvRemedyTe,
        imageUrl: srvImageUrl,
      });
      showToast(
        language === 'te'
          ? 'కొత్త సేవ విజయవంతంగా జోడించబడింది!'
          : 'New service added successfully!'
      );
    }

    setEditingSrvId(null);
    setSrvTitleTe('');
    setSrvTitleEn('');
    setSrvDescTe('');
    setSrvRemedyTe('');
    setSrvImageUrl('');
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodNameTe.trim() || !prodDescTe.trim()) return;

    if (editingProdId) {
      const existing = store.products.find((p) => p.id === editingProdId);
      if (existing) {
        onUpdateProduct({
          ...existing,
          category: prodCategory,
          name: {
            te: prodNameTe.trim(),
            en: prodNameEn.trim() || prodNameTe.trim(),
          },
          description: {
            te: prodDescTe.trim(),
            en: prodDescTe.trim(),
          },
          benefits: {
            te: prodBenefitsTe.trim() || existing.benefits.te,
            en: prodBenefitsTe.trim() || existing.benefits.en,
          },
          price: Number(prodPrice) || existing.price,
          imageUrl: prodImageUrl,
        });
        showToast(
          language === 'te'
            ? 'యంత్రం / పూజా వస్తువు & ఇమేజ్ అప్‌డేట్ చేయబడ్డాయి!'
            : 'Sacred Yantra / Puja item updated!'
        );
      }
    } else {
      onAddProduct({
        category: prodCategory,
        nameTe: prodNameTe,
        nameEn: prodNameEn || prodNameTe,
        descriptionTe: prodDescTe,
        benefitsTe: prodBenefitsTe,
        price: Number(prodPrice) || 1800,
        imageUrl: prodImageUrl,
      });
      showToast(
        language === 'te'
          ? 'కొత్త యంత్రం / పూజా వస్తువు జోడించబడింది!'
          : 'New Sacred Yantra / Puja item added!'
      );
    }

    setEditingProdId(null);
    setProdNameTe('');
    setProdNameEn('');
    setProdDescTe('');
    setProdBenefitsTe('');
    setProdPrice('2100');
    setProdImageUrl(SVG_ASSETS.sriYantra);
  };

  const handleSaveHerb = (e: React.FormEvent) => {
    e.preventDefault();
    if (!herbNameTe.trim() || !herbBenefitsTe.trim()) return;

    if (editingHerbId) {
      const existing = store.herbs.find((h) => h.id === editingHerbId);
      if (existing) {
        onUpdateHerb({
          ...existing,
          sanskritName: herbSanskrit.trim() || existing.sanskritName,
          name: { te: herbNameTe.trim(), en: herbNameTe.trim() },
          partUsed: {
            te: herbPartTe.trim() || existing.partUsed.te,
            en: herbPartTe.trim() || existing.partUsed.en,
          },
          properties: {
            te: herbPropTe.trim() || existing.properties.te,
            en: herbPropTe.trim() || existing.properties.en,
          },
          benefits: { te: herbBenefitsTe.trim(), en: herbBenefitsTe.trim() },
          usageMethod: {
            te: herbUsageTe.trim() || existing.usageMethod.te,
            en: herbUsageTe.trim() || existing.usageMethod.en,
          },
          imageUrl: herbImageUrl || SVG_ASSETS.herbalVitalityKit,
        });
        showToast(
          language === 'te'
            ? 'ఆయుర్వేద మూలిక & ఫోటో అప్‌డేట్ చేయబడింది!'
            : 'Ayurvedic herb & photo updated!'
        );
      }
    } else {
      onAddHerb({
        sanskritName: herbSanskrit,
        nameTe: herbNameTe,
        partUsedTe: herbPartTe,
        propertiesTe: herbPropTe,
        benefitsTe: herbBenefitsTe,
        usageMethodTe: herbUsageTe,
        imageUrl: herbImageUrl,
      });
      showToast(
        language === 'te'
          ? 'కొత్త ఆయుర్వేద మూలిక జోడించబడింది!'
          : 'New Ayurvedic herb added!'
      );
    }

    setEditingHerbId(null);
    setHerbSanskrit('');
    setHerbNameTe('');
    setHerbPartTe('');
    setHerbPropTe('');
    setHerbBenefitsTe('');
    setHerbUsageTe('');
    setHerbImageUrl(SVG_ASSETS.herbalVitalityKit);
  };

  const handleSavePrep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prepTitleTe.trim() || !prepIngredientsTe.trim()) return;
    const stepsArray = prepStepsText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    if (editingPrepId) {
      const existing = store.preparations.find((p) => p.id === editingPrepId);
      if (existing) {
        onUpdatePreparation({
          ...existing,
          title: { te: prepTitleTe.trim(), en: prepTitleTe.trim() },
          subtitle: {
            te: prepSubtitleTe.trim() || existing.subtitle.te,
            en: prepSubtitleTe.trim() || existing.subtitle.en,
          },
          ingredients: {
            te: prepIngredientsTe.trim(),
            en: prepIngredientsTe.trim(),
          },
          processSteps: {
            te: stepsArray.length > 0 ? stepsArray : existing.processSteps.te,
            en: stepsArray.length > 0 ? stepsArray : existing.processSteps.en,
          },
          dosageAndPrecautions: {
            te: prepDosageTe.trim() || existing.dosageAndPrecautions.te,
            en: prepDosageTe.trim() || existing.dosageAndPrecautions.en,
          },
          imageUrl: prepImageUrl.trim() || undefined,
        });
        showToast(
          language === 'te'
            ? 'మందుల తయారీ విధానం అప్‌డేట్ చేయబడింది!'
            : 'Medicine preparation protocol updated!'
        );
      }
    } else {
      onAddPreparation({
        titleTe: prepTitleTe,
        subtitleTe: prepSubtitleTe,
        ingredientsTe: prepIngredientsTe,
        stepsTe: stepsArray,
        dosageTe: prepDosageTe,
        imageUrl: prepImageUrl,
      });
      showToast(
        language === 'te'
          ? 'కొత్త మందు తయారీ విధానం జోడించబడింది!'
          : 'New medicine preparation method added!'
      );
    }

    setEditingPrepId(null);
    setPrepTitleTe('');
    setPrepSubtitleTe('');
    setPrepIngredientsTe('');
    setPrepStepsText('');
    setPrepDosageTe('');
    setPrepImageUrl('');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-modal-title"
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 overflow-y-auto"
    >
      <div className="bg-[#FAF7F2] border border-[#D6CEB8] rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#1C1613] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Lock className="w-4 h-4 text-[#FDE68A]" />
            <h2 id="admin-modal-title" className="font-serif text-lg font-bold">
              {language === 'te'
                ? 'సద్గురు నాటు వైద్యం — అడ్మిన్ కంట్రోల్ పానెల్ (లోగో, వీడియోలు, సేవలు, యంత్రములు, మూలికలు & యాడ్స్)'
                : 'Sadguru Natu Vaidyam — Full Admin Control Panel'}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {isAdmin && (
              <button
                type="button"
                onClick={() => onSetAdmin(false)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-xs font-medium rounded-lg transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{language === 'te' ? 'లాగ్ అవుట్' : 'Logout'}</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close Admin Panel"
              className="p-1.5 text-white/80 hover:text-white rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        {!isAdmin ? (
          <div className="p-8 sm:p-12 max-w-md mx-auto w-full">
            <h3 className="font-serif text-2xl font-bold text-[#1C1613] mb-2">
              {language === 'te'
                ? 'అడ్మిన్ లాగిన్ (Admin Login)'
                : 'Admin Authentication'}
            </h3>
            <p className="text-sm text-[#574B42] mb-6">
              {language === 'te'
                ? 'వెబ్‌సైట్ లోగో, యూట్యూబ్ వీడియోలు, సమస్యలు & పరిష్కారాలు, యంత్రములు & పూజ, మూలికలు & తయారీ, ప్రైవేట్ యాడ్స్ మరియు Google AdSense ఎడిట్ చేయడానికి మీ పాస్‌వర్డ్ నమోదు చేయండి.'
                : 'Enter your administrator password to control Website Logo, YouTube Videos, Services, Sacred Yantras, Herbs & Preparation, Private Ads, and Google AdSense.'}
            </p>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="admin-secret-password-input"
                  className="block text-xs font-semibold text-[#1C1613] mb-1.5"
                >
                  {language === 'te' ? 'అడ్మిన్ పాస్‌వర్డ్' : 'Admin Password'}
                </label>
                <input
                  id="admin-secret-password-input"
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  autoFocus
                  className="w-full px-4 py-3 text-sm bg-white border border-[#D6CEB8] rounded-lg text-[#1C1613] focus:outline-none focus:border-[#991B1B]"
                />
              </div>

              {loginError && (
                <p className="text-xs font-semibold text-[#B91C1C]">
                  {loginError}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-[#991B1B] hover:bg-[#7F1D1D] text-white text-sm font-semibold rounded-lg transition-colors"
              >
                {language === 'te' ? 'లాగిన్ చేయండి' : 'Unlock Admin Panel'}
              </button>
            </form>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Admin Navigation Tabs */}
            <div className="flex flex-wrap items-center gap-1 p-1.5 bg-[#EFE8DA] rounded-xl border border-[#D6CEB8]">
              {[
                {
                  id: 'videos' as AdminTab,
                  te: '1. లోగో & యూట్యూబ్',
                  en: '1. Logo & YouTube',
                },
                {
                  id: 'services' as AdminTab,
                  te: '2. సమస్యలు & పరిష్కారాలు',
                  en: '2. Services & Uploads',
                },
                {
                  id: 'products' as AdminTab,
                  te: '3. యంత్రములు & పూజ',
                  en: '3. Yantras & Puja',
                },
                {
                  id: 'herbs' as AdminTab,
                  te: '4. మూలికలు & తయారీ',
                  en: '4. Herbs & Prep',
                },
                {
                  id: 'privateAds' as AdminTab,
                  te: `5. ప్రైవేట్ యాడ్స్ (${
                    store.privateAds.filter((a) => a.status === 'pending')
                      .length
                  })`,
                  en: `5. Private Ads (${
                    store.privateAds.filter((a) => a.status === 'pending')
                      .length
                  })`,
                },
                {
                  id: 'googleAds' as AdminTab,
                  te: '6. Google AdSense',
                  en: '6. Google AdSense',
                },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveTab(t.id)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                    activeTab === t.id
                      ? 'bg-[#991B1B] text-white'
                      : 'text-[#4A3F37] hover:text-[#1C1613]'
                  }`}
                >
                  {language === 'te' ? t.te : t.en}
                </button>
              ))}
            </div>

            {statusToast && (
              <div className="p-3.5 bg-[#DCFCE7] border border-[#15803D] text-[#15803D] text-xs font-semibold rounded-lg">
                {statusToast}
              </div>
            )}

            {/* TAB 1: WEBSITE LOGO & YOUTUBE VIDEOS */}
            {activeTab === 'videos' && (
              <div className="space-y-6">
                {/* Website Logo Upload & Edit Card */}
                <div className="bg-white p-5 rounded-xl border border-[#E5DEC9] space-y-4">
                  <h3 className="font-serif text-lg font-bold text-[#1C1613]">
                    {language === 'te'
                      ? 'వెబ్‌సైట్ లోగో జోడించండి / మార్చండి (Website Logo Upload)'
                      : 'Upload or Edit Website Brand Logo'}
                  </h3>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-[#1C1613] border-2 border-[#D97706] shrink-0 flex items-center justify-center">
                      <img
                        src={logoInputUrl || SVG_ASSETS.brandLogo}
                        alt="Website Logo Preview"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-2.5 w-full">
                      <div className="flex flex-wrap items-center gap-3">
                        <label
                          htmlFor="admin-logo-file-upload"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-[#FAF7F2] hover:bg-[#EFE8DA] text-[#1C1613] border border-[#D6CEB8] text-xs font-semibold rounded-lg cursor-pointer"
                        >
                          <ImagePlus className="w-4 h-4 text-[#991B1B]" />
                          <span>
                            {language === 'te'
                              ? 'గ్యాలరీ నుండి లోగో ఫోటో అప్‌లోడ్ చేయండి'
                              : 'Upload Logo from Desktop/Mobile Gallery'}
                          </span>
                        </label>
                        <input
                          id="admin-logo-file-upload"
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            readFileIntoState(e, (dataUrl) => {
                              setLogoInputUrl(dataUrl);
                              onUpdateLogo(dataUrl);
                              showToast(
                                language === 'te'
                                  ? 'కొత్త వెబ్‌సైట్ లోగో అప్‌డేట్ చేయబడింది!'
                                  : 'Website Logo updated!'
                              );
                            });
                          }}
                          className="sr-only"
                        />
                        <input
                          type="text"
                          value={logoInputUrl}
                          onChange={(e) => setLogoInputUrl(e.target.value)}
                          placeholder="Or paste Logo Image URL..."
                          className="flex-1 min-w-[200px] px-3 py-2 text-xs bg-[#FAF7F2] border border-[#D6CEB8] rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            onUpdateLogo(logoInputUrl);
                            showToast(
                              language === 'te'
                                ? 'వెబ్‌సైట్ లోగో సేవ్ చేయబడింది!'
                                : 'Website Logo saved!'
                            );
                          }}
                          className="px-4 py-2 bg-[#991B1B] text-white text-xs font-semibold rounded-lg"
                        >
                          {language === 'te' ? 'లోగో సేవ్ చేయి' : 'Save Logo'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Add New YouTube Video */}
                <div className="bg-white p-5 rounded-xl border border-[#E5DEC9] space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-serif text-lg font-bold text-[#1C1613]">
                      {language === 'te'
                        ? 'కొత్త యూట్యూబ్ వీడియో లింక్ పేస్ట్ చేయండి (1st కనిపిస్తుంది)'
                        : 'Add New YouTube Video (Appears 1st Automatically)'}
                    </h3>
                    <button
                      type="button"
                      disabled={syncingChannel}
                      onClick={async () => {
                        setSyncingChannel(true);
                        await onSyncChannelVideos();
                        setSyncingChannel(false);
                        showToast(
                          language === 'te'
                            ? 'సద్గురు నాటు వైద్యం ఛానెల్ నుండి తాజా వీడియోలు సింక్ చేయబడ్డాయి!'
                            : 'Synced latest videos from Sadguru Naatu Vaidyam channel!'
                        );
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF7F2] hover:bg-[#EFE8DA] text-[#1C1613] border border-[#D6CEB8] text-xs font-semibold rounded-lg"
                    >
                      <RefreshCw
                        className={`w-3.5 h-3.5 text-[#991B1B] ${
                          syncingChannel ? 'animate-spin' : ''
                        }`}
                      />
                      <span>
                        {language === 'te'
                          ? 'ఛానెల్ నుండి తాజా వీడియోలు సింక్ చేయి'
                          : 'Sync from My YouTube Channel'}
                      </span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={vidUrl}
                      onChange={(e) => setVidUrl(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="px-3.5 py-2.5 text-sm bg-[#FAF7F2] border border-[#D6CEB8] rounded-lg"
                    />
                    <input
                      type="text"
                      value={vidTitleTe}
                      onChange={(e) => setVidTitleTe(e.target.value)}
                      placeholder={
                        language === 'te' ? 'వీడియో టైటిల్...' : 'Video Title...'
                      }
                      className="px-3.5 py-2.5 text-sm bg-[#FAF7F2] border border-[#D6CEB8] rounded-lg"
                    />
                  </div>
                  <input
                    type="text"
                    value={vidDescTe}
                    onChange={(e) => setVidDescTe(e.target.value)}
                    placeholder={
                      language === 'te'
                        ? 'వీడియో వివరణ (Description)...'
                        : 'Short Video Description...'
                    }
                    className="w-full px-3.5 py-2.5 text-sm bg-[#FAF7F2] border border-[#D6CEB8] rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const err = onAddVideo({
                        url: vidUrl,
                        titleTe: vidTitleTe,
                        descriptionTe: vidDescTe,
                      });
                      if (!err) {
                        setVidUrl('');
                        setVidTitleTe('');
                        setVidDescTe('');
                        showToast(
                          language === 'te'
                            ? 'వీడియో 1వ స్థానంలో చేర్చబడింది!'
                            : 'Video added at #1 position!'
                        );
                      } else {
                        showToast(err);
                      }
                    }}
                    className="px-5 py-2.5 bg-[#991B1B] text-white text-xs font-semibold rounded-lg"
                  >
                    {language === 'te'
                      ? '+ కొత్త వీడియోను 1st స్థానంలో చేర్చు'
                      : '+ Add Video at #1 Position'}
                  </button>
                </div>

                {/* Channel Link Update */}
                <div className="bg-white p-5 rounded-xl border border-[#E5DEC9] flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <input
                    type="text"
                    value={channelInput}
                    onChange={(e) => setChannelInput(e.target.value)}
                    className="flex-1 px-3.5 py-2 text-sm bg-[#FAF7F2] border border-[#D6CEB8] rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      onUpdateChannelUrl(channelInput);
                      showToast('YouTube Channel Link Updated!');
                    }}
                    className="px-4 py-2 bg-[#1C1613] text-white text-xs font-semibold rounded-lg whitespace-nowrap"
                  >
                    {language === 'te'
                      ? 'ఛానెల్ లింక్ సేవ్ చేయి'
                      : 'Update Channel Link'}
                  </button>
                </div>

                {/* Existing Videos List */}
                <div className="space-y-2">
                  {store.videos.map((v, i) => (
                    <div
                      key={v.id}
                      className="p-3.5 bg-white rounded-lg border border-[#E5DEC9] flex items-center justify-between gap-4"
                    >
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-[#991B1B] mr-2">
                          #{i + 1}
                        </span>
                        <span className="text-sm font-semibold text-[#1C1613]">
                          {v.title[language]}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemoveVideo(v.id)}
                        className="p-1.5 text-[#B91C1C] hover:bg-[#FEF2F2] rounded-lg shrink-0"
                        aria-label={`Delete video ${v.title[language]}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: సమస్యలు & పరిష్కారాలు (SERVICES ADD / EDIT / UPLOAD PHOTO / REMOVE) */}
            {activeTab === 'services' && (
              <div className="space-y-6">
                <form
                  onSubmit={handleSaveService}
                  className="bg-white p-5 rounded-xl border border-[#E5DEC9] space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-lg font-bold text-[#1C1613]">
                      {editingSrvId
                        ? language === 'te'
                          ? 'సమస్య / పరిష్కార సేవ & ఫోటో ఎడిట్ చేయండి'
                          : 'Edit Service & Photo Upload'
                        : language === 'te'
                        ? 'కొత్త సమస్య / పరిష్కార సేవను జోడించండి (ఫోటో అప్‌లోడ్ ఆప్షన్‌తో)'
                        : 'Add New Service / Remedy (with Optional Photo Upload)'}
                    </h3>
                    {editingSrvId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingSrvId(null);
                          setSrvTitleTe('');
                          setSrvDescTe('');
                          setSrvRemedyTe('');
                          setSrvImageUrl('');
                        }}
                        className="text-xs font-semibold text-[#991B1B]"
                      >
                        {language === 'te'
                          ? '+ కొత్త సేవ జోడింపు మోడ్'
                          : '+ Switch to Add New'}
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <select
                      value={srvCategory}
                      onChange={(e) =>
                        setSrvCategory(
                          e.target.value as ServiceItem['category']
                        )
                      }
                      className="px-3.5 py-2.5 text-sm bg-[#FAF7F2] border border-[#D6CEB8] rounded-lg"
                    >
                      <option value="tantra">వశీకరణ & తాంత్రిక (Tantra)</option>
                      <option value="relationship">
                        దాంపత్యం & ప్రేమ (Relationship)
                      </option>
                      <option value="vitality">
                        పురుష & స్త్రీ ఆరోగ్యం (Vitality)
                      </option>
                      <option value="prosperity">
                        ఆర్థిక & ఉద్యోగ (Prosperity)
                      </option>
                    </select>
                    <input
                      type="text"
                      value={srvTitleTe}
                      onChange={(e) => setSrvTitleTe(e.target.value)}
                      placeholder="సేవ పేరు (తెలుగు / ఇంగ్లీష్) *"
                      className="px-3.5 py-2.5 text-sm bg-[#FAF7F2] border border-[#D6CEB8] rounded-lg"
                    />
                    <input
                      type="text"
                      value={srvRemedyTe}
                      onChange={(e) => setSrvRemedyTe(e.target.value)}
                      placeholder="పరిహార విధానం (ఉదా: శ్రీ చక్ర పూజ)"
                      className="px-3.5 py-2.5 text-sm bg-[#FAF7F2] border border-[#D6CEB8] rounded-lg"
                    />
                  </div>

                  {/* Optional Service Photo Upload from Gallery */}
                  <div className="flex flex-wrap items-center gap-3 p-3.5 bg-[#FAF7F2] rounded-lg border border-[#D6CEB8]">
                    {srvImageUrl && (
                      <img
                        src={srvImageUrl}
                        alt="Service Upload Preview"
                        referrerPolicy="no-referrer"
                        className="w-16 h-12 object-cover rounded border border-[#D6CEB8]"
                      />
                    )}
                    <label
                      htmlFor="admin-srv-img-upload"
                      className="inline-flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-[#EFE8DA] text-[#1C1613] border border-[#D6CEB8] text-xs font-semibold rounded-lg cursor-pointer"
                    >
                      <ImagePlus className="w-4 h-4 text-[#991B1B]" />
                      <span>
                        {language === 'te'
                          ? 'సేవకు ఫోటో అప్‌లోడ్ చేయండి (గ్యాలరీ నుండి)'
                          : 'Upload Photo for Service'}
                      </span>
                    </label>
                    <input
                      id="admin-srv-img-upload"
                      type="file"
                      accept="image/*"
                      onChange={(e) => readFileIntoState(e, setSrvImageUrl)}
                      className="sr-only"
                    />
                    <input
                      type="text"
                      value={srvImageUrl}
                      onChange={(e) => setSrvImageUrl(e.target.value)}
                      placeholder="లేదా ఫోటో లింక్ పేస్ట్ చేయండి (Optional)..."
                      className="flex-1 min-w-[180px] px-3 py-2 text-xs bg-white border border-[#D6CEB8] rounded-lg"
                    />
                  </div>

                  <textarea
                    rows={2}
                    value={srvDescTe}
                    onChange={(e) => setSrvDescTe(e.target.value)}
                    placeholder="సమస్య మరియు పరిష్కార వివరణ *"
                    className="w-full px-3.5 py-2.5 text-sm bg-[#FAF7F2] border border-[#D6CEB8] rounded-lg"
                  />

                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#991B1B] text-white text-xs font-semibold rounded-lg"
                  >
                    <Plus className="w-4 h-4" />
                    <span>
                      {editingSrvId
                        ? language === 'te'
                          ? 'మార్పులు సేవ్ చేయి (Update Service)'
                          : 'Save Service Changes'
                        : language === 'te'
                        ? 'సేవను జోడించు (Add Service)'
                        : 'Add Service'}
                    </span>
                  </button>
                </form>

                <div className="space-y-2">
                  {store.services.map((srv) => (
                    <div
                      key={srv.id}
                      className="p-3.5 bg-white rounded-lg border border-[#E5DEC9] flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {srv.imageUrl && (
                          <img
                            src={srv.imageUrl}
                            alt={srv.title[language]}
                            referrerPolicy="no-referrer"
                            className="w-12 h-10 rounded object-cover shrink-0"
                          />
                        )}
                        <div className="min-w-0">
                          <span className="font-mono text-xs font-bold text-[#991B1B] mr-2">
                            {srv.number}.
                          </span>
                          <span className="text-sm font-semibold text-[#1C1613]">
                            {srv.title[language]}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingSrvId(srv.id);
                            setSrvCategory(srv.category);
                            setSrvTitleTe(srv.title.te);
                            setSrvTitleEn(srv.title.en);
                            setSrvDescTe(srv.description.te);
                            setSrvRemedyTe(srv.remedyNote.te);
                            setSrvImageUrl(srv.imageUrl || '');
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold bg-[#FAF7F2] hover:bg-[#EFE8DA] text-[#1C1613] border border-[#D6CEB8] rounded-lg"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>{language === 'te' ? 'ఎడిట్' : 'Edit'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            onRemoveService(srv.id);
                            showToast('Service removed!');
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-[#B91C1C] bg-[#FEF2F2] hover:bg-[#FEE2E2] rounded-lg"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>{language === 'te' ? 'తొలగించు' : 'Remove'}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: యంత్రములు & పూజ (SACRED YANTRAS & PUJA PRODUCTS) */}
            {activeTab === 'products' && (
              <div className="space-y-6">
                <form
                  onSubmit={handleSaveProduct}
                  className="bg-white p-5 rounded-xl border border-[#E5DEC9] space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-lg font-bold text-[#1C1613]">
                      {editingProdId
                        ? language === 'te'
                          ? 'యంత్రం / పూజా వస్తువు ఇమేజ్ & వివరాలు మార్చండి'
                          : 'Edit Sacred Yantra / Puja Product & Image'
                        : language === 'te'
                        ? 'కొత్త యంత్రం / పూజా వస్తువు జోడించండి'
                        : 'Add New Sacred Yantra / Puja Product'}
                    </h3>
                    {editingProdId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingProdId(null);
                          setProdNameTe('');
                          setProdDescTe('');
                        }}
                        className="text-xs font-semibold text-[#991B1B]"
                      >
                        {language === 'te'
                          ? '+ కొత్త వస్తువు మోడ్'
                          : '+ Switch to Add New'}
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <select
                      value={prodCategory}
                      onChange={(e) =>
                        setProdCategory(
                          e.target.value as SacredProductItem['category']
                        )
                      }
                      className="px-3.5 py-2.5 text-sm bg-[#FAF7F2] border border-[#D6CEB8] rounded-lg"
                    >
                      <option value="yantra">
                        పవిత్ర యంత్రం (Sacred Yantra)
                      </option>
                      <option value="puja">పూజా సామాగ్రి (Puja Samagri)</option>
                      <option value="herbal_kit">
                        మూలికా కిట్ (Herbal Vitality Kit)
                      </option>
                    </select>
                    <input
                      type="text"
                      value={prodNameTe}
                      onChange={(e) => setProdNameTe(e.target.value)}
                      placeholder="వస్తువు పేరు (Product Name) *"
                      className="px-3.5 py-2.5 text-sm bg-[#FAF7F2] border border-[#D6CEB8] rounded-lg"
                    />
                    <input
                      type="number"
                      value={prodPrice}
                      onChange={(e) => setProdPrice(e.target.value)}
                      placeholder="ధర (Price ₹)"
                      className="px-3.5 py-2.5 text-sm bg-[#FAF7F2] border border-[#D6CEB8] rounded-lg"
                    />
                  </div>

                  {/* Image Edit / Upload from Desktop or Mobile Gallery */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-4 bg-[#FAF7F2] rounded-lg border border-[#D6CEB8]">
                    <div className="md:col-span-3">
                      <div className="aspect-[4/3] w-full rounded-lg overflow-hidden bg-[#1C1613] border border-[#D6CEB8]">
                        <img
                          src={prodImageUrl}
                          alt="Product preview"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="md:col-span-9 space-y-2">
                      <label className="block text-xs font-semibold text-[#1C1613]">
                        {language === 'te'
                          ? 'వస్తువు ఫోటో అప్‌లోడ్ చేయండి (Desktop / Mobile గ్యాలరీ నుండి) లేదా ఇమేజ్ లింక్ పేస్ట్ చేయండి'
                          : 'Upload Product Image from Desktop/Mobile Gallery or Paste Image URL'}
                      </label>
                      <div className="flex flex-wrap items-center gap-3">
                        <label
                          htmlFor="admin-prod-img-upload"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-[#EFE8DA] text-[#1C1613] border border-[#D6CEB8] text-xs font-semibold rounded-lg cursor-pointer"
                        >
                          <ImagePlus className="w-4 h-4 text-[#991B1B]" />
                          <span>
                            {language === 'te'
                              ? 'గ్యాలరీ నుండి ఫోటో ఎంచుకోండి'
                              : 'Upload Photo from Gallery'}
                          </span>
                        </label>
                        <input
                          id="admin-prod-img-upload"
                          type="file"
                          accept="image/*"
                          onChange={(e) => readFileIntoState(e, setProdImageUrl)}
                          className="sr-only"
                        />
                        <input
                          type="text"
                          value={prodImageUrl}
                          onChange={(e) => setProdImageUrl(e.target.value)}
                          placeholder="Or paste image URL..."
                          className="flex-1 min-w-[180px] px-3 py-2 text-xs bg-white border border-[#D6CEB8] rounded-lg"
                        />
                      </div>
                    </div>
                  </div>

                  <textarea
                    rows={2}
                    value={prodDescTe}
                    onChange={(e) => setProdDescTe(e.target.value)}
                    placeholder="పూర్తి వివరణ (Full Product Description) *"
                    className="w-full px-3.5 py-2.5 text-sm bg-[#FAF7F2] border border-[#D6CEB8] rounded-lg"
                  />

                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#991B1B] text-white text-xs font-semibold rounded-lg"
                  >
                    {editingProdId
                      ? language === 'te'
                        ? 'మార్పులు సేవ్ చేయండి (Update Product & Image)'
                        : 'Save Product & Image Changes'
                      : language === 'te'
                      ? '+ కొత్త వస్తువును జోడించు (Add Product)'
                      : '+ Add New Sacred Product'}
                  </button>
                </form>

                {/* Existing Products List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {store.products.map((p) => (
                    <div
                      key={p.id}
                      className="p-3.5 bg-white rounded-xl border border-[#E5DEC9] flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={p.imageUrl}
                          alt={p.name[language]}
                          referrerPolicy="no-referrer"
                          className="w-14 h-12 rounded-lg object-cover shrink-0 bg-[#1C1613]"
                        />
                        <div className="min-w-0">
                          <h4 className="text-sm font-semibold text-[#1C1613] truncate">
                            {p.name[language]}
                          </h4>
                          <p className="text-xs font-mono text-[#991B1B] tabular-nums">
                            ₹{p.price}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingProdId(p.id);
                            setProdCategory(p.category);
                            setProdNameTe(p.name.te);
                            setProdNameEn(p.name.en);
                            setProdDescTe(p.description.te);
                            setProdBenefitsTe(p.benefits.te);
                            setProdPrice(String(p.price));
                            setProdImageUrl(p.imageUrl);
                          }}
                          className="px-2.5 py-1.5 text-xs font-semibold bg-[#FAF7F2] hover:bg-[#EFE8DA] text-[#1C1613] border border-[#D6CEB8] rounded-lg inline-flex items-center gap-1"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>{language === 'te' ? 'ఎడిట్' : 'Edit'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onRemoveProduct(p.id)}
                          className="p-1.5 text-[#B91C1C] hover:bg-[#FEF2F2] rounded-lg"
                          aria-label={`Delete ${p.name[language]}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: మూలికలు & తయారీ (AYURVEDIC HERBS & MEDICINE PREPARATION MANAGEMENT) */}
            {activeTab === 'herbs' && (
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setHerbSubTab('herbs')}
                    className={`px-4 py-2 text-xs font-semibold rounded-lg ${
                      herbSubTab === 'herbs'
                        ? 'bg-[#1C1613] text-white'
                        : 'bg-white border border-[#D6CEB8] text-[#1C1613]'
                    }`}
                  >
                    {language === 'te'
                      ? `1. ఆయుర్వేద మూలికలు (${store.herbs.length})`
                      : `1. Ayurvedic Herbs (${store.herbs.length})`}
                  </button>
                  <button
                    type="button"
                    onClick={() => setHerbSubTab('prep')}
                    className={`px-4 py-2 text-xs font-semibold rounded-lg ${
                      herbSubTab === 'prep'
                        ? 'bg-[#1C1613] text-white'
                        : 'bg-white border border-[#D6CEB8] text-[#1C1613]'
                    }`}
                  >
                    {language === 'te'
                      ? `2. మందుల తయారీ విధానం (${store.preparations.length})`
                      : `2. Medicine Preparation Methods (${store.preparations.length})`}
                  </button>
                </div>

                {herbSubTab === 'herbs' ? (
                  <div className="space-y-6">
                    <form
                      onSubmit={handleSaveHerb}
                      className="bg-white p-5 rounded-xl border border-[#E5DEC9] space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="font-serif text-lg font-bold text-[#1C1613]">
                          {editingHerbId
                            ? language === 'te'
                              ? 'ఆయుర్వేద మూలిక & ఫోటో మార్చండి'
                              : 'Edit Ayurvedic Herb & Photo'
                            : language === 'te'
                            ? 'కొత్త ఆయుర్వేద మూలిక జోడించండి (ఫోటో అప్‌లోడ్‌తో)'
                            : 'Add New Ayurvedic Herb (with Photo Upload)'}
                        </h3>
                        {editingHerbId && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingHerbId(null);
                              setHerbNameTe('');
                              setHerbBenefitsTe('');
                            }}
                            className="text-xs font-semibold text-[#991B1B]"
                          >
                            + Add New Herb
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={herbNameTe}
                          onChange={(e) => setHerbNameTe(e.target.value)}
                          placeholder="మూలిక పేరు (ఉదా: అశ్వగంధ / నల్ల పసుపు) *"
                          className="px-3.5 py-2.5 text-sm bg-[#FAF7F2] border border-[#D6CEB8] rounded-lg"
                        />
                        <input
                          type="text"
                          value={herbSanskrit}
                          onChange={(e) => setHerbSanskrit(e.target.value)}
                          placeholder="సంస్కృత / శాస్త్రీయ నామం (Sanskrit Name)"
                          className="px-3.5 py-2.5 text-sm bg-[#FAF7F2] border border-[#D6CEB8] rounded-lg"
                        />
                        <input
                          type="text"
                          value={herbPartTe}
                          onChange={(e) => setHerbPartTe(e.target.value)}
                          placeholder="వాడే భాగం (ఉదా: వేర్లు, ఆకులు)"
                          className="px-3.5 py-2.5 text-sm bg-[#FAF7F2] border border-[#D6CEB8] rounded-lg"
                        />
                        <input
                          type="text"
                          value={herbPropTe}
                          onChange={(e) => setHerbPropTe(e.target.value)}
                          placeholder="ఆయుర్వేద గుణములు (Properties)"
                          className="px-3.5 py-2.5 text-sm bg-[#FAF7F2] border border-[#D6CEB8] rounded-lg"
                        />
                      </div>

                      <div className="flex flex-wrap items-center gap-3 p-3.5 bg-[#FAF7F2] rounded-lg border border-[#D6CEB8]">
                        <img
                          src={herbImageUrl}
                          alt="Herb preview"
                          referrerPolicy="no-referrer"
                          className="w-16 h-12 object-cover rounded bg-[#1C1613]"
                        />
                        <label
                          htmlFor="admin-herb-img-upload"
                          className="inline-flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-[#EFE8DA] text-[#1C1613] border border-[#D6CEB8] text-xs font-semibold rounded-lg cursor-pointer"
                        >
                          <ImagePlus className="w-4 h-4 text-[#991B1B]" />
                          <span>
                            {language === 'te'
                              ? 'మూలిక ఫోటో అప్‌లోడ్ చేయండి (గ్యాలరీ నుండి)'
                              : 'Upload Herb Photo from Gallery'}
                          </span>
                        </label>
                        <input
                          id="admin-herb-img-upload"
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            readFileIntoState(e, setHerbImageUrl)
                          }
                          className="sr-only"
                        />
                        <input
                          type="text"
                          value={herbImageUrl}
                          onChange={(e) => setHerbImageUrl(e.target.value)}
                          placeholder="Or paste Herb Image URL..."
                          className="flex-1 min-w-[180px] px-3 py-2 text-xs bg-white border border-[#D6CEB8] rounded-lg"
                        />
                      </div>

                      <textarea
                        rows={2}
                        value={herbBenefitsTe}
                        onChange={(e) => setHerbBenefitsTe(e.target.value)}
                        placeholder="ప్రయోజనాలు (Therapeutic Benefits) *"
                        className="w-full px-3.5 py-2 text-sm bg-[#FAF7F2] border border-[#D6CEB8] rounded-lg"
                      />
                      <input
                        type="text"
                        value={herbUsageTe}
                        onChange={(e) => setHerbUsageTe(e.target.value)}
                        placeholder="సేవించే విధానం (Usage & Dosage Method)"
                        className="w-full px-3.5 py-2 text-sm bg-[#FAF7F2] border border-[#D6CEB8] rounded-lg"
                      />

                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-[#991B1B] text-white text-xs font-semibold rounded-lg"
                      >
                        {editingHerbId
                          ? language === 'te'
                            ? 'మూలిక మార్పులు సేవ్ చేయి'
                            : 'Save Herb Changes'
                          : language === 'te'
                          ? '+ కొత్త మూలిక జోడించు'
                          : '+ Add Herb'}
                      </button>
                    </form>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {store.herbs.map((h) => (
                        <div
                          key={h.id}
                          className="p-3.5 bg-white rounded-xl border border-[#E5DEC9] flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={h.imageUrl}
                              alt={h.name[language]}
                              referrerPolicy="no-referrer"
                              className="w-12 h-10 rounded object-cover shrink-0 bg-[#1C1613]"
                            />
                            <div className="min-w-0">
                              <h4 className="text-sm font-semibold text-[#1C1613] truncate">
                                {h.name[language]}
                              </h4>
                              <p className="text-xs text-[#6E6053] truncate">
                                {h.sanskritName}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingHerbId(h.id);
                                setHerbSanskrit(h.sanskritName);
                                setHerbNameTe(h.name.te);
                                setHerbPartTe(h.partUsed.te);
                                setHerbPropTe(h.properties.te);
                                setHerbBenefitsTe(h.benefits.te);
                                setHerbUsageTe(h.usageMethod.te);
                                setHerbImageUrl(h.imageUrl);
                              }}
                              className="px-2.5 py-1.5 text-xs font-semibold bg-[#FAF7F2] border border-[#D6CEB8] rounded-lg"
                            >
                              {language === 'te' ? 'ఎడిట్' : 'Edit'}
                            </button>
                            <button
                              type="button"
                              onClick={() => onRemoveHerb(h.id)}
                              className="p-1.5 text-[#B91C1C] hover:bg-[#FEF2F2] rounded-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <form
                      onSubmit={handleSavePrep}
                      className="bg-white p-5 rounded-xl border border-[#E5DEC9] space-y-4"
                    >
                      <h3 className="font-serif text-lg font-bold text-[#1C1613]">
                        {editingPrepId
                          ? language === 'te'
                            ? 'మందుల తయారీ విధానం ఎడిట్ చేయండి'
                            : 'Edit Medicine Preparation Method'
                          : language === 'te'
                          ? 'కొత్త మందుల తయారీ విధానం జోడించండి'
                          : 'Add New Medicine Preparation Method'}
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={prepTitleTe}
                          onChange={(e) => setPrepTitleTe(e.target.value)}
                          placeholder="తయారీ విధానం పేరు (Title) *"
                          className="px-3.5 py-2.5 text-sm bg-[#FAF7F2] border border-[#D6CEB8] rounded-lg"
                        />
                        <input
                          type="text"
                          value={prepSubtitleTe}
                          onChange={(e) => setPrepSubtitleTe(e.target.value)}
                          placeholder="ఉప శీర్షిక (Subtitle)"
                          className="px-3.5 py-2.5 text-sm bg-[#FAF7F2] border border-[#D6CEB8] rounded-lg"
                        />
                      </div>

                      <div className="flex flex-wrap items-center gap-3 p-3.5 bg-[#FAF7F2] rounded-lg border border-[#D6CEB8]">
                        <label
                          htmlFor="admin-prep-img-upload"
                          className="inline-flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-[#EFE8DA] text-[#1C1613] border border-[#D6CEB8] text-xs font-semibold rounded-lg cursor-pointer"
                        >
                          <ImagePlus className="w-4 h-4 text-[#991B1B]" />
                          <span>
                            {language === 'te'
                              ? 'తయారీ ఫోటో అప్‌లోడ్ (Optional)'
                              : 'Upload Preparation Photo'}
                          </span>
                        </label>
                        <input
                          id="admin-prep-img-upload"
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            readFileIntoState(e, setPrepImageUrl)
                          }
                          className="sr-only"
                        />
                        <input
                          type="text"
                          value={prepImageUrl}
                          onChange={(e) => setPrepImageUrl(e.target.value)}
                          placeholder="Or paste Preparation Image URL..."
                          className="flex-1 min-w-[180px] px-3 py-2 text-xs bg-white border border-[#D6CEB8] rounded-lg"
                        />
                      </div>

                      <textarea
                        rows={2}
                        value={prepIngredientsTe}
                        onChange={(e) => setPrepIngredientsTe(e.target.value)}
                        placeholder="కావలసిన మూలికలు & దినుసులు (Ingredients) *"
                        className="w-full px-3.5 py-2 text-sm bg-[#FAF7F2] border border-[#D6CEB8] rounded-lg"
                      />
                      <textarea
                        rows={3}
                        value={prepStepsText}
                        onChange={(e) => setPrepStepsText(e.target.value)}
                        placeholder="తయారీ దశలు (ప్రతి లైన్‌లో ఒక దశ రాయండి - One step per line) *"
                        className="w-full px-3.5 py-2 text-sm bg-[#FAF7F2] border border-[#D6CEB8] rounded-lg"
                      />
                      <input
                        type="text"
                        value={prepDosageTe}
                        onChange={(e) => setPrepDosageTe(e.target.value)}
                        placeholder="వాడే మోతాదు & పథ్యం (Dosage & Precautions)"
                        className="w-full px-3.5 py-2 text-sm bg-[#FAF7F2] border border-[#D6CEB8] rounded-lg"
                      />

                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-[#991B1B] text-white text-xs font-semibold rounded-lg"
                      >
                        {editingPrepId
                          ? language === 'te'
                            ? 'తయారీ విధానం సేవ్ చేయి'
                            : 'Save Preparation Changes'
                          : language === 'te'
                          ? '+ కొత్త తయారీ విధానం జోడించు'
                          : '+ Add Preparation Method'}
                      </button>
                    </form>

                    <div className="space-y-2">
                      {store.preparations.map((pr) => (
                        <div
                          key={pr.id}
                          className="p-3.5 bg-white rounded-xl border border-[#E5DEC9] flex items-center justify-between gap-3"
                        >
                          <div>
                            <span className="font-mono text-xs font-bold text-[#991B1B] mr-2">
                              {pr.stepNumber}.
                            </span>
                            <span className="text-sm font-semibold text-[#1C1613]">
                              {pr.title[language]}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingPrepId(pr.id);
                                setPrepTitleTe(pr.title.te);
                                setPrepSubtitleTe(pr.subtitle.te);
                                setPrepIngredientsTe(pr.ingredients.te);
                                setPrepStepsText(
                                  pr.processSteps.te.join('\n')
                                );
                                setPrepDosageTe(pr.dosageAndPrecautions.te);
                                setPrepImageUrl(pr.imageUrl || '');
                              }}
                              className="px-2.5 py-1.5 text-xs font-semibold bg-[#FAF7F2] border border-[#D6CEB8] rounded-lg"
                            >
                              {language === 'te' ? 'ఎడిట్' : 'Edit'}
                            </button>
                            <button
                              type="button"
                              onClick={() => onRemovePreparation(pr.id)}
                              className="p-1.5 text-[#B91C1C] hover:bg-[#FEF2F2] rounded-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 5: PRIVATE ADS APPROVAL */}
            {activeTab === 'privateAds' && (
              <div className="space-y-4">
                <h3 className="font-serif text-lg font-bold text-[#1C1613]">
                  {language === 'te'
                    ? 'ప్రైవేట్ యాడ్స్ ఆమోదం & నిర్వహణ (Approve / Remove Private Ads)'
                    : 'Approve or Remove Submitted Private Ads'}
                </h3>

                {store.privateAds.map((ad) => (
                  <div
                    key={ad.id}
                    className="p-4 bg-white rounded-xl border border-[#E5DEC9] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4 min-w-0">
                      <img
                        src={ad.imageUrl}
                        alt={ad.title}
                        referrerPolicy="no-referrer"
                        className="w-20 h-16 rounded-lg object-cover bg-[#1C1613] shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 text-xs font-semibold mb-1">
                          <span
                            className={
                              ad.status === 'approved'
                                ? 'text-[#15803D]'
                                : 'text-[#B45309]'
                            }
                          >
                            {ad.status === 'approved'
                              ? 'APPROVED (ప్రచురించబడింది)'
                              : 'PENDING APPROVAL (అనుమతి పెండింగ్)'}
                          </span>
                          <span>·</span>
                          <span>{ad.advertiserName}</span>
                          <span>·</span>
                          <span>{ad.contactPhone}</span>
                        </div>
                        <h4 className="text-sm font-bold text-[#1C1613]">
                          {ad.title}
                        </h4>
                        <p className="text-xs text-[#574B42] line-clamp-2 mt-1">
                          {ad.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {ad.status !== 'approved' && (
                        <button
                          type="button"
                          onClick={() => {
                            onApprovePrivateAd(ad.id);
                            showToast('Private Ad Approved & Published!');
                          }}
                          className="inline-flex items-center gap-1 px-3.5 py-2 bg-[#15803D] text-white text-xs font-semibold rounded-lg"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>
                            {language === 'te'
                              ? 'అనుమతించు (Approve)'
                              : 'Approve'}
                          </span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => onRemovePrivateAd(ad.id)}
                        className="inline-flex items-center gap-1 px-3 py-2 bg-[#FEF2F2] text-[#B91C1C] text-xs font-semibold rounded-lg"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>{language === 'te' ? 'తొలగించు' : 'Delete'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 6: GOOGLE ADSENSE SETTINGS */}
            {activeTab === 'googleAds' && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  onUpdateGoogleAds({
                    ...store.googleAds,
                    enabled: gEnabled,
                    adLinkUrl: gLinkUrl,
                    adsenseClientId: gClientId,
                    adsenseMetaTag: gMetaTag,
                    adScriptOrCode: gScript,
                    headline: {
                      te: gHeadlineTe,
                      en: gHeadlineEn || gHeadlineTe,
                    },
                    subtext: {
                      te: gSubtextTe,
                      en: store.googleAds.subtext.en,
                    },
                  });
                  showToast(
                    language === 'te'
                      ? 'Google AdSense కోడ్ & లింక్ సేవ్ చేయబడ్డాయి!'
                      : 'Google AdSense code & settings saved!'
                  );
                }}
                className="bg-white p-6 rounded-xl border border-[#E5DEC9] space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg font-bold text-[#1C1613]">
                    {language === 'te'
                      ? 'Google AdSense (ca-pub-6709151112965859) & లింక్ సెట్టింగ్స్'
                      : 'Google AdSense Snippet, Meta Tag & Link Configuration'}
                  </h3>
                  <label className="inline-flex items-center gap-2 text-xs font-semibold text-[#1C1613] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={gEnabled}
                      onChange={(e) => setGEnabled(e.target.checked)}
                      className="rounded border-[#D6CEB8]"
                    />
                    <span>
                      {language === 'te'
                        ? 'Google Ads చూపించు'
                        : 'Enable Google Ads'}
                    </span>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#1C1613] mb-1">
                      AdSense Publisher Client ID
                    </label>
                    <input
                      type="text"
                      value={gClientId}
                      onChange={(e) => setGClientId(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs font-mono bg-[#FAF7F2] border border-[#D6CEB8] rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1C1613] mb-1">
                      {language === 'te'
                        ? 'Google Ads టార్గెట్ లింక్'
                        : 'Google Ads Destination URL'}
                    </label>
                    <input
                      type="text"
                      value={gLinkUrl}
                      onChange={(e) => setGLinkUrl(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#D6CEB8] rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1C1613] mb-1">
                    AdSense Meta Tag Code
                  </label>
                  <input
                    type="text"
                    value={gMetaTag}
                    onChange={(e) => setGMetaTag(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs font-mono bg-[#FAF7F2] border border-[#D6CEB8] rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1C1613] mb-1">
                    AdSense Code Snippet (&lt;script async ...&gt;)
                  </label>
                  <textarea
                    rows={3}
                    value={gScript}
                    onChange={(e) => setGScript(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs font-mono bg-[#FAF7F2] border border-[#D6CEB8] rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#1C1613] mb-1">
                      {language === 'te'
                        ? 'యాడ్ శీర్షిక (తెలుగు)'
                        : 'Ad Headline (Telugu)'}
                    </label>
                    <input
                      type="text"
                      value={gHeadlineTe}
                      onChange={(e) => setGHeadlineTe(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm bg-[#FAF7F2] border border-[#D6CEB8] rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1C1613] mb-1">
                      {language === 'te'
                        ? 'యాడ్ శీర్షిక (English)'
                        : 'Ad Headline (English)'}
                    </label>
                    <input
                      type="text"
                      value={gHeadlineEn}
                      onChange={(e) => setGHeadlineEn(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm bg-[#FAF7F2] border border-[#D6CEB8] rounded-lg"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#991B1B] text-white text-xs font-semibold rounded-lg"
                >
                  {language === 'te'
                    ? 'Google AdSense సేవ్ చేయండి'
                    : 'Save Google AdSense Settings'}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
