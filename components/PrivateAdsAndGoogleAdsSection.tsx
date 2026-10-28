'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  ExternalLink,
  ImagePlus,
  Megaphone,
  PhoneCall,
  PlusCircle,
  Youtube,
} from 'lucide-react';
import { GoogleAdsConfig, Language, PrivateAdItem } from '@/lib/types';
import { SVG_ASSETS } from '@/lib/svg-assets';

interface PrivateAdsAndGoogleAdsSectionProps {
  language: Language;
  privateAds: PrivateAdItem[];
  googleAds: GoogleAdsConfig;
  isAdmin: boolean;
  onSubmitPrivateAd: (input: {
    title: string;
    advertiserName: string;
    contactPhone: string;
    description: string;
    youtubeUrl?: string;
    imageUrl: string;
    autoApprove?: boolean;
  }) => void;
  onOpenAdminAds: () => void;
}

export default function PrivateAdsAndGoogleAdsSection({
  language,
  privateAds,
  googleAds,
  isAdmin,
  onSubmitPrivateAd,
  onOpenAdminAds,
}: PrivateAdsAndGoogleAdsSectionProps) {
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [title, setTitle] = useState('');
  const [advertiserName, setAdvertiserName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [description, setDescription] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploadFileName, setUploadFileName] = useState('');
  const [submitNotice, setSubmitNotice] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const approvedAds = privateAds.filter((ad) => ad.status === 'approved');
  const pendingCount = privateAds.filter((ad) => ad.status === 'pending').length;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImageUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !advertiserName.trim() || !contactPhone.trim() || !description.trim()) {
      setFormError(
        language === 'te'
          ? 'దయచేసి యాడ్ టైటిల్, పేరు, ఫోన్ నంబర్ మరియు పూర్తి వివరాలు నమోదు చేయండి.'
          : 'Please fill in Ad Title, Advertiser Name, Contact Phone, and Full Description.'
      );
      return;
    }

    onSubmitPrivateAd({
      title,
      advertiserName,
      contactPhone,
      description,
      youtubeUrl: youtubeUrl.trim() || undefined,
      imageUrl: imageUrl || SVG_ASSETS.pujaSamagriKit,
      autoApprove: isAdmin,
    });

    setTitle('');
    setAdvertiserName('');
    setContactPhone('');
    setDescription('');
    setYoutubeUrl('');
    setImageUrl('');
    setUploadFileName('');
    setFormError(null);
    setShowSubmitForm(false);

    setSubmitNotice(
      isAdmin
        ? language === 'te'
          ? 'ప్రైవేట్ యాడ్ విజయవంతంగా ప్రచురించబడింది (Admin Approved)!'
          : 'Private Ad published directly (Admin Approved)!'
        : language === 'te'
        ? 'మీ ప్రైవేట్ యాడ్ అడ్మిన్ అనుమతి (Admin Approval) కోసం పంపబడింది! అడ్మిన్ ఆమోదించిన వెంటనే వెబ్‌సైట్‌లో కనిపిస్తుంది.'
        : 'Your Private Ad has been submitted for Admin Approval! Once approved by Admin, it will appear live.'
    );
  };

  return (
    <section
      id="private-ads"
      className="py-16 md:py-24 border-b border-[#E5DEC9] bg-[#F5EFE4]"
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 space-y-14">
        {/* Part 1: Configurable Google Ads Placement */}
        {googleAds.enabled && (
          <div className="bg-white rounded-xl border border-[#D6CEB8] p-6 sm:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-3xl">
                <div className="flex items-center gap-2 text-xs text-[#786B5E] font-medium">
                  <span>Google Ads · Sponsored Placement</span>
                  {isAdmin && (
                    <>
                      <span aria-hidden="true">·</span>
                      <button
                        type="button"
                        onClick={onOpenAdminAds}
                        className="text-[#991B1B] font-semibold hover:underline"
                      >
                        {language === 'te' ? 'Google Ads లింక్ ఎడిట్ చేయండి' : 'Edit Google Ads Link'}
                      </button>
                    </>
                  )}
                </div>

                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1C1613]">
                  {googleAds.headline[language]}
                </h3>

                <p className="text-sm text-[#574B42] leading-relaxed">
                  {googleAds.subtext[language]}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                <a
                  href={googleAds.adLinkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#991B1B] hover:bg-[#7F1D1D] text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap"
                >
                  <span>{googleAds.ctaLabel[language]}</span>
                  <ExternalLink className="w-4 h-4" />
                </a>

                {!isAdmin && (
                  <button
                    type="button"
                    onClick={onOpenAdminAds}
                    className="px-3.5 py-3 text-xs font-medium text-[#574B42] hover:text-[#1C1613] bg-[#FAF7F2] border border-[#D6CEB8] rounded-lg transition-colors whitespace-nowrap"
                  >
                    {language === 'te' ? 'Google Ads అడ్మిన్' : 'Edit in Admin'}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Part 2: Private Ads Showcase & Submission */}
        <div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div className="max-w-2xl">
              <p className="text-xs font-medium tracking-wider text-[#991B1B] mb-2">
                {language === 'te'
                  ? 'ప్రైవేట్ ప్రకటనల విభాగం (అడ్మిన్ అనుమతితో)'
                  : 'PRIVATE ADVERTISEMENTS SHOWCASE (ADMIN APPROVED)'}
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1613]">
                {language === 'te'
                  ? 'ప్రైవేట్ యాడ్స్ — ఫోటో, యూట్యూబ్ లింక్ & పూర్తి వివరాలతో'
                  : 'Community & Partner Private Ads with Photo & YouTube Link'}
              </h2>
              <p className="mt-2 text-sm text-[#574B42]">
                {language === 'te'
                  ? 'మీ వ్యాపారం లేదా సేవల గురించి ప్రైవేట్ యాడ్ వేసుకోవడానికి క్రింది బటన్ ద్వారా ఫోటో (Desktop/Mobile గ్యాలరీ నుండి), యూట్యూబ్ లింక్ మరియు పూర్తి వివరాలు అప్‌లోడ్ చేయండి. అడ్మిన్ అనుమతి తర్వాత ప్రచురించబడుతుంది.'
                  : 'Submit your Private Ad with photos uploaded from your Desktop or Mobile Gallery, a YouTube link, and full description. Published upon Admin approval.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setShowSubmitForm((prev) => !prev)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#991B1B] hover:bg-[#7F1D1D] text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0"
              >
                <PlusCircle className="w-4 h-4" />
                <span>
                  {language === 'te'
                    ? 'ప్రైవేట్ యాడ్ వేయండి (Post Private Ad)'
                    : 'Submit Private Ad'}
                </span>
              </button>

              <button
                type="button"
                onClick={onOpenAdminAds}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-[#FAF7F2] text-[#1C1613] border border-[#D6CEB8] text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0"
              >
                <Megaphone className="w-3.5 h-3.5 text-[#991B1B]" />
                <span>
                  {language === 'te'
                    ? `అడ్మిన్ యాడ్స్ ఆమోదం (${pendingCount} పెండింగ్)`
                    : `Admin Approval (${pendingCount} Pending)`}
                </span>
              </button>
            </div>
          </div>

          {submitNotice && (
            <div className="mb-8 p-4 bg-white rounded-xl border border-[#15803D] flex items-center gap-3 text-sm text-[#15803D] font-medium">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>{submitNotice}</span>
            </div>
          )}

          {/* Private Ad Submission Form (Desktop/Mobile Gallery Photo Upload + YouTube Link + Full Description) */}
          {showSubmitForm && (
            <form
              onSubmit={handleFormSubmit}
              className="mb-10 bg-white rounded-xl border border-[#D6CEB8] p-6 sm:p-8 space-y-5"
            >
              <div className="flex items-center justify-between border-b border-[#EFE8DA] pb-4">
                <h3 className="font-serif text-xl font-bold text-[#1C1613]">
                  {language === 'te'
                    ? 'కొత్త ప్రైవేట్ యాడ్ వివరాలు నమోదు చేయండి (Admin అనుమతితో)'
                    : 'Submit Private Ad with Gallery Photo, YouTube Link & Full Description'}
                </h3>
                <button
                  type="button"
                  onClick={() => setShowSubmitForm(false)}
                  className="text-xs font-semibold text-[#6E6053] hover:text-[#1C1613]"
                >
                  {language === 'te' ? 'మూసివేయి (Close)' : 'Close'}
                </button>
              </div>

              {formError && (
                <p className="text-xs font-semibold text-[#B91C1C] bg-[#FEF2F2] p-3 rounded-lg border border-[#FECACA]">
                  {formError}
                </p>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label
                    htmlFor="pvt-ad-title"
                    className="block text-xs font-semibold text-[#1C1613] mb-1.5"
                  >
                    {language === 'te' ? 'యాడ్ శీర్షిక (Ad Title) *' : 'Ad Title *'}
                  </label>
                  <input
                    id="pvt-ad-title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={
                      language === 'te'
                        ? 'ఉదా: ఆయుర్వేద మూలికా విక్రయ కేంద్రం'
                        : 'e.g. Traditional Puja & Herbal Store'
                    }
                    className="w-full px-3.5 py-2.5 text-sm bg-[#FAF7F2] border border-[#D6CEB8] rounded-lg text-[#1C1613]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="pvt-ad-name"
                    className="block text-xs font-semibold text-[#1C1613] mb-1.5"
                  >
                    {language === 'te' ? 'ప్రకటనదారు పేరు (Your Name) *' : 'Advertiser Name *'}
                  </label>
                  <input
                    id="pvt-ad-name"
                    type="text"
                    value={advertiserName}
                    onChange={(e) => setAdvertiserName(e.target.value)}
                    placeholder={language === 'te' ? 'మీ పేరు...' : 'Your full name...'}
                    className="w-full px-3.5 py-2.5 text-sm bg-[#FAF7F2] border border-[#D6CEB8] rounded-lg text-[#1C1613]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="pvt-ad-phone"
                    className="block text-xs font-semibold text-[#1C1613] mb-1.5"
                  >
                    {language === 'te' ? 'ఫోన్ నంబర్ (Contact Phone) *' : 'Contact Phone *'}
                  </label>
                  <input
                    id="pvt-ad-phone"
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="w-full px-3.5 py-2.5 text-sm bg-[#FAF7F2] border border-[#D6CEB8] rounded-lg text-[#1C1613]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="pvt-ad-youtube"
                    className="block text-xs font-semibold text-[#1C1613] mb-1.5"
                  >
                    {language === 'te'
                      ? 'యూట్యూబ్ వీడియో లింక్ (YouTube Link - ఐచ్ఛికం)'
                      : 'YouTube Video Link (Optional)'}
                  </label>
                  <input
                    id="pvt-ad-youtube"
                    type="text"
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full px-3.5 py-2.5 text-sm bg-[#FAF7F2] border border-[#D6CEB8] rounded-lg text-[#1C1613]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="pvt-ad-photo-upload"
                    className="block text-xs font-semibold text-[#1C1613] mb-1.5"
                  >
                    {language === 'te'
                      ? 'డెస్క్‌టాప్ / మొబైల్ గ్యాలరీ నుండి ఫోటో అప్‌లోడ్ చేయండి'
                      : 'Upload Photo from Desktop or Mobile Gallery'}
                  </label>
                  <div className="flex items-center gap-3">
                    <label
                      htmlFor="pvt-ad-photo-upload"
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#FAF7F2] hover:bg-[#EFE8DA] text-[#1C1613] border border-[#D6CEB8] text-xs font-semibold rounded-lg cursor-pointer transition-colors whitespace-nowrap"
                    >
                      <ImagePlus className="w-4 h-4 text-[#991B1B]" />
                      <span>
                        {uploadFileName
                          ? uploadFileName
                          : language === 'te'
                          ? 'ఫోటో ఎంచుకోండి (Choose Gallery Photo)'
                          : 'Choose Photo from Device'}
                      </span>
                    </label>
                    <input
                      id="pvt-ad-photo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="sr-only"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="pvt-ad-desc"
                  className="block text-xs font-semibold text-[#1C1613] mb-1.5"
                >
                  {language === 'te'
                    ? 'పూర్తి వివరాలు (Full Description) *'
                    : 'Full Description *'}
                </label>
                <textarea
                  id="pvt-ad-desc"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={
                    language === 'te'
                      ? 'మీ ప్రైవేట్ యాడ్ యొక్క పూర్తి వివరాలను ఇక్కడ రాయండి...'
                      : 'Write the complete details of your advertisement here...'
                  }
                  className="w-full px-3.5 py-2.5 text-sm bg-[#FAF7F2] border border-[#D6CEB8] rounded-lg text-[#1C1613]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSubmitForm(false)}
                  className="px-4 py-2.5 text-xs font-semibold text-[#574B42] hover:text-[#1C1613]"
                >
                  {language === 'te' ? 'రద్దు (Cancel)' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#991B1B] hover:bg-[#7F1D1D] text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap"
                >
                  {language === 'te'
                    ? 'అడ్మిన్ అనుమతి కోసం సబ్మిట్ చేయండి'
                    : 'Submit Private Ad for Approval'}
                </button>
              </div>
            </form>
          )}

          {/* Approved Private Ads Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {approvedAds.map((ad) => (
              <article
                key={ad.id}
                className="bg-white rounded-xl border border-[#E5DEC9] overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-[16/9] w-full bg-[#1C1613] overflow-hidden border-b border-[#E5DEC9]">
                    <img
                      src={ad.imageUrl || SVG_ASSETS.pujaSamagriKit}
                      alt={ad.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = SVG_ASSETS.pujaSamagriKit;
                      }}
                    />
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-2 text-xs text-[#991B1B] font-semibold mb-2">
                      <span>{ad.advertiserName}</span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">{ad.contactPhone}</span>
                    </div>

                    <h3 className="font-serif text-xl font-bold text-[#1C1613] mb-2.5">
                      {ad.title}
                    </h3>

                    <p className="text-sm text-[#574B42] leading-relaxed whitespace-pre-line">
                      {ad.description}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-3 border-t border-[#EFE8DA] flex flex-wrap items-center justify-between gap-3">
                  <a
                    href={`tel:${ad.contactPhone}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#991B1B] hover:bg-[#7F1D1D] text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap tabular-nums"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>{ad.contactPhone}</span>
                  </a>

                  {ad.youtubeUrl && (
                    <a
                      href={ad.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#FAF7F2] hover:bg-[#EFE8DA] text-[#1C1613] border border-[#D6CEB8] text-xs font-semibold rounded-lg transition-colors whitespace-nowrap"
                    >
                      <Youtube className="w-3.5 h-3.5 text-[#991B1B]" />
                      <span>
                        {language === 'te' ? 'యాడ్ యూట్యూబ్ వీడియో చూడండి' : 'Watch Ad Video'}
                      </span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
