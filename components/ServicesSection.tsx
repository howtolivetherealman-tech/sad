'use client';

import React, { useState } from 'react';
import { Edit3, PhoneCall, PlusCircle, Search } from 'lucide-react';
import { Language, ServiceCategory, ServiceItem } from '@/lib/types';

interface ServicesSectionProps {
  language: Language;
  services: ServiceItem[];
  contactPhone: string;
  isAdmin: boolean;
  onSelectServiceForConsultation: (serviceTitle: string) => void;
  onOpenAdminServices: (editService?: ServiceItem) => void;
}

const CATEGORY_LABELS: Record<ServiceCategory, { te: string; en: string }> = {
  all: { te: 'అన్ని పరిష్కారాలు', en: 'All Services' },
  relationship: { te: 'దాంపత్యం & ప్రేమ సమస్యలు', en: 'Love & Family Harmony' },
  tantra: { te: 'వశీకరణ, చేతబడి & మర్ల మందు', en: 'Tantra, Vashikaran & Detox' },
  vitality: { te: 'పురుష & స్త్రీ ఆరోగ్య వైద్యం', en: 'Male & Female Vitality' },
  prosperity: { te: 'ఆర్థిక, ఉద్యోగ & వివాహ', en: 'Wealth, Job & Marriage' },
};

export default function ServicesSection({
  language,
  services,
  contactPhone,
  isAdmin,
  onSelectServiceForConsultation,
  onOpenAdminServices,
}: ServicesSectionProps) {
  const [selectedCategory, setSelectedCategory] =
    useState<ServiceCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredServices = services.filter((srv) => {
    const matchesCat =
      selectedCategory === 'all' || srv.category === selectedCategory;
    if (!matchesCat) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      srv.title.te.toLowerCase().includes(q) ||
      srv.title.en.toLowerCase().includes(q) ||
      srv.description.te.toLowerCase().includes(q) ||
      srv.description.en.toLowerCase().includes(q)
    );
  });

  return (
    <section
      id="services"
      className="py-16 md:py-24 border-b border-[#E5DEC9] bg-[#FAF7F2]"
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="max-w-3xl">
            <p className="text-xs font-medium tracking-wider text-[#991B1B] mb-2">
              {language === 'te'
                ? 'శ్రీనివాస్ మహారాజ్ — తంత్ర వైద్యుడు & జ్యోతిష్య నిపుణుడు'
                : 'SRINIVAS MAHARAJ — TANTRA VAIDYA & ASTROLOGY SPECIALIST'}
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#1C1613] leading-tight">
              {language === 'te'
                ? 'సమస్యలు & పరిష్కారాలు — తాంత్రిక, జ్యోతిష్య & నాటు వైద్య సేవలు'
                : 'Problems & Solutions — Tantric, Astrological & Natu Vaidyam Services'}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#574B42] leading-relaxed">
              {language === 'te'
                ? 'వశీకరణ, భార్యాభర్తల కలహాలు, ప్రేమికుల సమస్యలు, స్వయం సంపర్కుల ప్రేమ వ్యవహారాలు, హిజ్రాలను మోసం చేసే వారిని దారికి తేవడం, మరుగు మందు, మర్ల మందు తొలగింపు, చేతబడి నిర్మూలన మరియు దాంపత్య ఆరోగ్య సమస్యలకు పూర్తి గోప్యతతో శాశ్వత పరిష్కారం చూపబడును.'
                : 'Confidential, authentic solutions for Vashikaran, marital harmony, same-sex relationship guidance, justice for deceived transgender partners, Marugu Mandu, Marla Mandu removal, black magic eradication, and complete conjugal health.'}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onOpenAdminServices()}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-[#1C1613] rounded-lg hover:bg-[#332924] transition-colors whitespace-nowrap shrink-0"
            >
              <PlusCircle className="w-3.5 h-3.5 text-[#FDE68A]" />
              <span>
                {isAdmin
                  ? language === 'te'
                    ? '+ కొత్త సేవ / ఫోటో అప్‌లోడ్ (Admin)'
                    : '+ Add / Edit Services & Uploads'
                  : language === 'te'
                  ? 'సమస్యలు & పరిష్కారాలు అడ్మిన్ కంట్రోల్'
                  : 'Admin: Manage Services & Uploads'}
              </span>
            </button>
          </div>
        </div>

        {/* Interactive Filter Controls + Search */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-10">
          <div
            role="tablist"
            aria-label="Service Categories"
            className="flex flex-wrap items-center gap-1.5 p-1.5 bg-[#EFE8DA] rounded-xl border border-[#E5DEC9]"
          >
            {(Object.keys(CATEGORY_LABELS) as ServiceCategory[]).map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                    active
                      ? 'bg-[#991B1B] text-white'
                      : 'text-[#4A3F37] hover:text-[#1C1613] hover:bg-white/60'
                  }`}
                >
                  {CATEGORY_LABELS[cat][language]}
                </button>
              );
            })}
          </div>

          <div className="relative w-full lg:w-72">
            <label htmlFor="service-search-input" className="sr-only">
              {language === 'te' ? 'సమస్యను వెతకండి' : 'Search services'}
            </label>
            <Search className="w-4 h-4 text-[#786B5E] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="service-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                language === 'te'
                  ? 'సమస్యను వెతకండి (ఉదా: వశీకరణ, మర్ల మందు)...'
                  : 'Search problem (e.g. Vashikaran, Court, Vitality)...'
              }
              className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-[#D6CEB8] rounded-lg text-[#1C1613] focus:outline-none focus:border-[#991B1B]"
            />
          </div>
        </div>

        {/* Editorial Numbered Service Grid */}
        {filteredServices.length === 0 ? (
          <div className="p-10 text-center bg-white rounded-xl border border-[#E5DEC9]">
            <p className="text-base font-medium text-[#574B42]">
              {language === 'te'
                ? 'మీరు వెతికిన సమస్య కనిపించలేదు. నేరుగా శ్రీనివాస్ మహారాజ్ గారికి కాల్ చేయండి: 7093586539'
                : 'No matching service found. Call Srinivas Maharaj directly at 7093586539.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((srv) => (
              <article
                key={srv.id}
                className="bg-white rounded-xl border border-[#E5DEC9] overflow-hidden flex flex-col justify-between hover:border-[#B45309] transition-colors"
              >
                <div>
                  {srv.imageUrl && (
                    <div className="aspect-[16/9] w-full bg-[#1C1613] border-b border-[#E5DEC9] overflow-hidden">
                      <img
                        src={srv.imageUrl}
                        alt={srv.title[language]}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="p-6 pb-4">
                    {/* Unboxed quiet metadata line + Admin quick edit */}
                    <div className="flex items-center justify-between gap-2 text-xs text-[#991B1B] font-semibold mb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono tabular-nums">
                          {srv.number}.
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{CATEGORY_LABELS[srv.category][language]}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => onOpenAdminServices(srv)}
                        className="inline-flex items-center gap-1 text-xs text-[#574B42] hover:text-[#991B1B]"
                        aria-label={`Edit ${srv.title[language]}`}
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>{language === 'te' ? 'ఎడిట్' : 'Edit'}</span>
                      </button>
                    </div>

                    <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1C1613] leading-snug mb-2.5">
                      {srv.title[language]}
                    </h3>

                    <p className="text-sm text-[#574B42] leading-relaxed">
                      {srv.description[language]}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-4 border-t border-[#EFE8DA]">
                  <p className="text-xs text-[#6E6053] mb-3">
                    <span className="font-semibold text-[#1C1613]">
                      {language === 'te' ? 'పరిహార విధానం: ' : 'Remedy Method: '}
                    </span>
                    {srv.remedyNote[language]}
                  </p>

                  <div className="flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        onSelectServiceForConsultation(srv.title[language])
                      }
                      className="px-3.5 py-2 bg-[#FAF7F2] hover:bg-[#EFE8DA] text-[#1C1613] border border-[#D6CEB8] text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0"
                    >
                      {language === 'te'
                        ? 'సంప్రదించండి'
                        : 'Book Consultation'}
                    </button>

                    <a
                      href={`tel:${contactPhone}`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#991B1B] hover:bg-[#7F1D1D] text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 tabular-nums"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>{contactPhone}</span>
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
