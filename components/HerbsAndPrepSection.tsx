'use client';

import React, { useState } from 'react';
import {
  BookOpen,
  Edit3,
  FlaskConical,
  Leaf,
  PlusCircle,
} from 'lucide-react';
import {
  AyurvedicHerbItem,
  Language,
  PreparationMethodItem,
} from '@/lib/types';
import { SVG_ASSETS } from '@/lib/svg-assets';

interface HerbsAndPrepSectionProps {
  language: Language;
  herbs: AyurvedicHerbItem[];
  preparations: PreparationMethodItem[];
  isAdmin: boolean;
  onConsultHerbOrPrep: (topic: string) => void;
  onOpenAdminHerbs: (
    editHerb?: AyurvedicHerbItem,
    editPrep?: PreparationMethodItem
  ) => void;
}

export default function HerbsAndPrepSection({
  language,
  herbs,
  preparations,
  isAdmin,
  onConsultHerbOrPrep,
  onOpenAdminHerbs,
}: HerbsAndPrepSectionProps) {
  const [activeTab, setActiveTab] = useState<'herbs' | 'preparation'>('herbs');

  return (
    <section
      id="herbs"
      className="py-16 md:py-24 border-b border-[#E5DEC9] bg-[#FAF7F2]"
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="max-w-3xl">
            <p className="text-xs font-medium tracking-wider text-[#991B1B] mb-2">
              {language === 'te'
                ? 'సద్గురు నాటు వైద్య విజ్ఞాన సర్వస్వం — మూలికలు & తయారీ విధానం'
                : 'SADGURU NATU VAIDYAM COMPENDIUM — HERBS & FORMULATION METHODS'}
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#1C1613] leading-tight">
              {language === 'te'
                ? 'ఆయుర్వేద మూలికల సమగ్ర సమాచారం & మందుల తయారీ విధానం పూర్తి వివరాలు'
                : 'Comprehensive Ayurvedic Herbs Guide & Traditional Medicine Preparation'}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#574B42] leading-relaxed">
              {language === 'te'
                ? 'అంగస్తంభన, శీఘ్రస్కలనం, స్త్రీల వక్షోజాల పరిమాణం పెరుగుదల, మర్ల మందు తొలగింపు, మద్యపాన వ్యసన విముక్తి మరియు తాంత్రిక రక్షణకు అవసరమైన అరుదైన మూలికలు మరియు వాటి శాస్త్రీయ తయారీ విధానం.'
                : 'Detailed botanical profiles, Shodhana (purification) protocols, Churna, Lehyam, Taila Paka (medicated oils), and Vishahara decoction preparation methods.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onOpenAdminHerbs()}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1C1613] text-white text-xs font-semibold rounded-lg hover:bg-[#332924] transition-colors whitespace-nowrap shrink-0"
            >
              <PlusCircle className="w-4 h-4 text-[#FDE68A]" />
              <span>
                {isAdmin
                  ? language === 'te'
                    ? '+ మూలికలు & తయారీ జోడించు / ఎడిట్'
                    : '+ Add / Edit Herbs & Prep'
                  : language === 'te'
                  ? 'మూలికలు & తయారీ అడ్మిన్ కంట్రోల్'
                  : 'Admin: Manage Herbs & Prep'}
              </span>
            </button>
          </div>
        </div>

        {/* Interactive View Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-1.5 p-1.5 bg-[#EFE8DA] rounded-xl border border-[#D6CEB8] shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('herbs')}
              className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'herbs'
                  ? 'bg-[#991B1B] text-white'
                  : 'text-[#4A3F37] hover:text-[#1C1613]'
              }`}
            >
              <Leaf className="w-3.5 h-3.5" />
              <span>
                {language === 'te'
                  ? '1. ఆయుర్వేద మూలికల సమాచారం'
                  : '1. Ayurvedic Herbs Guide'}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preparation')}
              className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'preparation'
                  ? 'bg-[#991B1B] text-white'
                  : 'text-[#4A3F37] hover:text-[#1C1613]'
              }`}
            >
              <FlaskConical className="w-3.5 h-3.5" />
              <span>
                {language === 'te'
                  ? '2. మందుల తయారీ విధానం'
                  : '2. Medicine Preparation Methods'}
              </span>
            </button>
          </div>
        </div>

        {/* View 1: Comprehensive Ayurvedic Herbs */}
        {activeTab === 'herbs' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {herbs.map((herb, index) => (
                <article
                  key={herb.id}
                  className="bg-white rounded-xl border border-[#E5DEC9] overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    {/* Herb Image with Direct Admin Image/Detail Edit */}
                    <div className="aspect-[16/9] w-full bg-[#1C1613] relative overflow-hidden border-b border-[#E5DEC9]">
                      <img
                        src={herb.imageUrl || SVG_ASSETS.herbalVitalityKit}
                        alt={herb.name[language]}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = SVG_ASSETS.herbalVitalityKit;
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => onOpenAdminHerbs(herb, undefined)}
                        className="absolute top-2.5 right-2.5 inline-flex items-center gap-1 px-2.5 py-1 bg-black/75 hover:bg-black text-white text-xs font-medium rounded-lg"
                      >
                        <Edit3 className="w-3 h-3 text-[#FDE68A]" />
                        <span>
                          {language === 'te'
                            ? 'ఫోటో / వివరాలు మార్చు'
                            : 'Edit Herb / Photo'}
                        </span>
                      </button>
                    </div>

                    <div className="p-6 pb-4">
                      <div className="flex items-center justify-between gap-2 text-xs text-[#991B1B] font-semibold mb-2">
                        <span className="font-mono tabular-nums">
                          {String(index + 1).padStart(2, '0')} ·{' '}
                          {herb.sanskritName}
                        </span>
                      </div>

                      <h3 className="font-serif text-xl font-bold text-[#1C1613] mb-3">
                        {herb.name[language]}
                      </h3>

                      <div className="space-y-2.5 text-sm text-[#574B42] mb-2">
                        <p>
                          <strong className="text-[#1C1613]">
                            {language === 'te' ? 'వాడే భాగం: ' : 'Part Used: '}
                          </strong>
                          {herb.partUsed[language]}
                        </p>
                        <p>
                          <strong className="text-[#1C1613]">
                            {language === 'te'
                              ? 'ఆయుర్వేద గుణములు: '
                              : 'Properties: '}
                          </strong>
                          {herb.properties[language]}
                        </p>
                        <p className="leading-relaxed">
                          <strong className="text-[#1C1613]">
                            {language === 'te'
                              ? 'ప్రయోజనాలు: '
                              : 'Therapeutic Benefits: '}
                          </strong>
                          {herb.benefits[language]}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-4 border-t border-[#EFE8DA]">
                    <p className="text-xs text-[#6E6053] leading-relaxed mb-3">
                      <strong className="text-[#1C1613]">
                        {language === 'te'
                          ? 'సేవించే విధానం: '
                          : 'Administration Method: '}
                      </strong>
                      {herb.usageMethod[language]}
                    </p>
                    <button
                      type="button"
                      onClick={() => onConsultHerbOrPrep(herb.name[language])}
                      className="w-full px-3.5 py-2 bg-[#FAF7F2] hover:bg-[#EFE8DA] text-[#1C1613] border border-[#D6CEB8] text-xs font-semibold rounded-lg transition-colors whitespace-nowrap"
                    >
                      {language === 'te'
                        ? 'ఈ మూలికా వైద్యం కొరకు సంప్రదించండి'
                        : 'Inquire About This Herbal Remedy'}
                    </button>
                  </div>
                </article>
              ))}
            </div>

            {/* Callout to switch to Preparation Methods */}
            <div className="p-6 bg-[#F3EDE2] rounded-xl border border-[#D6CEB8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-serif text-lg font-bold text-[#1C1613]">
                  {language === 'te'
                    ? 'ఈ మూలికలతో మందులు తయారు చేసే పూర్తి విధానం చూడాలనుకుంటున్నారా?'
                    : 'Want to see the step-by-step preparation methods for these herbs?'}
                </h4>
                <p className="text-xs sm:text-sm text-[#574B42]">
                  {language === 'te'
                    ? 'శోధన ప్రక్రియ, చూర్ణం, లేహ్యం, తైల పాకం మరియు కషాయ తయారీ విధానం క్రింద ఇవ్వబడింది.'
                    : 'Explore Shodhana purification, Churna, Lehyam, Taila Paka oil, and antidote decoction instructions.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('preparation')}
                className="px-5 py-2.5 bg-[#991B1B] text-white text-xs sm:text-sm font-semibold rounded-lg hover:bg-[#7F1D1D] transition-colors whitespace-nowrap shrink-0"
              >
                {language === 'te'
                  ? 'మందుల తయారీ విధానం చూడండి →'
                  : 'View Preparation Methods →'}
              </button>
            </div>
          </div>
        )}

        {/* View 2: Complete Medicine Preparation Methods */}
        {activeTab === 'preparation' && (
          <div className="space-y-8">
            {preparations.map((prep) => (
              <article
                key={prep.id}
                className="bg-white rounded-xl border border-[#E5DEC9] p-6 sm:p-8"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-5 mb-6 border-b border-[#EFE8DA]">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#991B1B] mb-1">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span className="font-mono tabular-nums">
                        {language === 'te'
                          ? `తయారీ పద్ధతి ${prep.stepNumber}`
                          : `FORMULATION PROTOCOL ${prep.stepNumber}`}
                      </span>
                    </div>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1C1613]">
                      {prep.title[language]}
                    </h3>
                    <p className="text-sm text-[#6E6053] mt-1">
                      {prep.subtitle[language]}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 self-start md:self-center shrink-0">
                    <button
                      type="button"
                      onClick={() => onOpenAdminHerbs(undefined, prep)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#FAF7F2] hover:bg-[#EFE8DA] text-[#1C1613] border border-[#D6CEB8] text-xs font-semibold rounded-lg transition-colors whitespace-nowrap"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-[#991B1B]" />
                      <span>
                        {language === 'te'
                          ? 'తయారీ విధానం ఎడిట్'
                          : 'Edit Protocol'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onConsultHerbOrPrep(prep.title[language])}
                      className="px-4 py-2 bg-[#991B1B] hover:bg-[#7F1D1D] text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap"
                    >
                      {language === 'te'
                        ? 'తయారు చేసిన మందు ఆర్డర్ చేయండి'
                        : 'Order Prepared Formulation'}
                    </button>
                  </div>
                </div>

                {prep.imageUrl && (
                  <div className="mb-6 aspect-[21/9] w-full rounded-xl overflow-hidden bg-[#1C1613] border border-[#E5DEC9]">
                    <img
                      src={prep.imageUrl}
                      alt={prep.title[language]}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left: Ingredients & Dosage */}
                  <div className="lg:col-span-5 space-y-4">
                    <div className="p-4 bg-[#FAF7F2] rounded-lg border border-[#E5DEC9]">
                      <h4 className="text-xs font-bold tracking-wider text-[#991B1B] mb-2">
                        {language === 'te'
                          ? 'కావలసిన మూలికలు & దినుసులు (INGREDIENTS)'
                          : 'REQUIRED HERBS & INGREDIENTS'}
                      </h4>
                      <p className="text-sm text-[#1C1613] leading-relaxed">
                        {prep.ingredients[language]}
                      </p>
                    </div>

                    <div className="p-4 bg-[#F5EFE4] rounded-lg border border-[#D6CEB8]">
                      <h4 className="text-xs font-bold tracking-wider text-[#1C1613] mb-2">
                        {language === 'te'
                          ? 'వాడే మోతాదు & పథ్యం (DOSAGE & PRECAUTIONS)'
                          : 'DOSAGE, DIET & PRECAUTIONS'}
                      </h4>
                      <p className="text-xs sm:text-sm text-[#4A3F37] leading-relaxed">
                        {prep.dosageAndPrecautions[language]}
                      </p>
                    </div>
                  </div>

                  {/* Right: Step-by-Step Preparation Process */}
                  <div className="lg:col-span-7">
                    <h4 className="text-xs font-bold tracking-wider text-[#1C1613] mb-3">
                      {language === 'te'
                        ? 'శాస్త్రీయ తయారీ విధానం — దశలవారీగా (STEP-BY-STEP PREPARATION)'
                        : 'TRADITIONAL PREPARATION PROCEDURE (STEP-BY-STEP)'}
                    </h4>
                    <ol className="space-y-3">
                      {prep.processSteps[language].map((stepText, idx) => (
                        <li
                          key={idx}
                          className="p-3.5 bg-[#FAF7F2] rounded-lg border border-[#EFE8DA] flex items-start gap-3 text-sm text-[#1C1613] leading-relaxed"
                        >
                          <span className="font-mono tabular-nums font-bold text-[#991B1B] shrink-0">
                            0{idx + 1}.
                          </span>
                          <span>{stepText}</span>
                        </li>
                      ))}
                    </ol>
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
