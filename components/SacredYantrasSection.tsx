'use client';

import React, { useState } from 'react';
import { Edit3, PhoneCall, PlusCircle, ShoppingBag } from 'lucide-react';
import { Language, SacredProductItem } from '@/lib/types';
import { SVG_ASSETS } from '@/lib/svg-assets';

interface SacredYantrasSectionProps {
  language: Language;
  products: SacredProductItem[];
  contactPhone: string;
  isAdmin: boolean;
  onInquireProduct: (productName: string) => void;
  onOpenAdminProducts: (editProduct?: SacredProductItem) => void;
}

type ProductFilter = 'all' | 'yantra' | 'puja' | 'herbal_kit';

export default function SacredYantrasSection({
  language,
  products,
  contactPhone,
  isAdmin,
  onInquireProduct,
  onOpenAdminProducts,
}: SacredYantrasSectionProps) {
  const [filter, setFilter] = useState<ProductFilter>('all');

  const filteredProducts = products.filter((p) =>
    filter === 'all' ? true : p.category === filter
  );

  const getCategoryText = (cat: SacredProductItem['category']) => {
    if (cat === 'yantra') {
      return language === 'te' ? 'అభిమంత్రించిన యంత్రం' : 'Consecrated Yantra';
    }
    if (cat === 'puja') {
      return language === 'te' ? 'పూజా సామాగ్రి' : 'Sacred Puja Samagri';
    }
    return language === 'te' ? 'నాటు వైద్య మూలికా కిట్' : 'Natu Vaidyam Herbal Kit';
  };

  return (
    <section
      id="yantras"
      className="py-16 md:py-24 border-b border-[#E5DEC9] bg-[#F5EFE4]"
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="max-w-3xl">
            <p className="text-xs font-medium tracking-wider text-[#991B1B] mb-2">
              {language === 'te'
                ? 'పవిత్ర యంత్రములు & సంపూర్ణ పూజా సామాగ్రి కేంద్రం'
                : 'SACRED YANTRAS & COMPLETE PUJA SAMAGRI STORE'}
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#1C1613] leading-tight">
              {language === 'te'
                ? 'అభిమంత్రించిన రాగి యంత్రములు & పూజకు సంబంధించిన ప్రతి వస్తువు లభించును'
                : 'Energized Copper Yantras & Every Authentic Item Needed for Puja'}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#574B42] leading-relaxed">
              {language === 'te'
                ? 'శ్రీనివాస్ మహారాజ్ గారి వద్ద మంత్ర జపంతో ప్రాణప్రతిష్ఠ చేయబడిన శ్రీ చక్రం, వశీకరణ యంత్రం, కుబేర యంత్రం, బగళాముఖి యంత్రం మరియు పూజకు కావలసిన ప్రతి అరుదైన తాంత్రిక, వైదిక వస్తువు లభించును.'
                : 'Obtain Prana-Pratishtha energized copper Yantras, rare Tantric roots, Gomati Chakras, Rudraksha malas, and complete Vedic Puja kits directly from Srinivas Maharaj.'}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onOpenAdminProducts()}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1C1613] text-white text-xs font-semibold rounded-lg hover:bg-[#332924] transition-colors whitespace-nowrap shrink-0"
            >
              <PlusCircle className="w-4 h-4 text-[#FDE68A]" />
              <span>
                {isAdmin
                  ? language === 'te'
                    ? '+ కొత్త యంత్రం / పూజా వస్తువు జోడించు'
                    : '+ Add Product / Edit Images'
                  : language === 'te'
                  ? 'యంత్రములు & పూజా వస్తువుల అడ్మిన్'
                  : 'Admin: Edit Images & Add Products'}
              </span>
            </button>
          </div>
        </div>

        {/* Category Segmented Filter */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-[#EAE1D0] rounded-xl border border-[#D6CEB8]">
            {[
              {
                id: 'all' as ProductFilter,
                te: 'అన్ని వస్తువులు',
                en: 'All Items',
              },
              {
                id: 'yantra' as ProductFilter,
                te: 'పవిత్ర యంత్రములు',
                en: 'Sacred Yantras',
              },
              {
                id: 'puja' as ProductFilter,
                te: 'పూజా సామాగ్రి',
                en: 'Puja Samagri',
              },
              {
                id: 'herbal_kit' as ProductFilter,
                te: 'నాటు వైద్య మూలికా కిట్లు',
                en: 'Herbal Vitality Kits',
              },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id)}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  filter === tab.id
                    ? 'bg-[#991B1B] text-white'
                    : 'text-[#4A3F37] hover:text-[#1C1613] hover:bg-white/60'
                }`}
              >
                {language === 'te' ? tab.te : tab.en}
              </button>
            ))}
          </div>

          <p className="text-xs text-[#6E6053]">
            {language === 'te'
              ? 'దేశవ్యాప్తంగా పోస్టల్ / కొరియర్ ద్వారా గోప్యంగా డెలివరీ చేయబడును'
              : 'Confidential nationwide courier & postal delivery available'}
          </p>
        </div>

        {/* 3-Column Storefront Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredProducts.map((prod) => (
            <article
              key={prod.id}
              className="bg-white rounded-xl border border-[#E5DEC9] overflow-hidden flex flex-col justify-between transition-transform duration-150 hover:-translate-y-0.5"
            >
              <div>
                {/* 4:3 Product Image Container */}
                <div className="aspect-[4/3] w-full bg-[#1C1613] relative overflow-hidden border-b border-[#E5DEC9]">
                  <img
                    src={prod.imageUrl || SVG_ASSETS.sriYantra}
                    alt={prod.name[language]}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = SVG_ASSETS.sriYantra;
                    }}
                  />
                  {/* Admin Direct Edit Image Button */}
                  <button
                    type="button"
                    onClick={() => onOpenAdminProducts(prod)}
                    className="absolute top-3 right-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-black/75 hover:bg-black text-white text-xs font-medium rounded-lg backdrop-blur-xs transition-colors whitespace-nowrap"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#FDE68A]" />
                    <span>
                      {language === 'te' ? 'ఇమేజ్ / వివరాలు మార్చు' : 'Edit Image / Item'}
                    </span>
                  </button>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  {/* Unboxed Metadata */}
                  <div className="flex items-center justify-between gap-2 text-xs text-[#991B1B] font-semibold mb-2">
                    <span>{getCategoryText(prod.category)}</span>
                    <span className="font-mono tabular-nums text-base font-bold text-[#1C1613]">
                      ₹{prod.price.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-[#1C1613] leading-snug mb-1.5">
                    {prod.name[language]}
                  </h3>

                  <p className="text-xs font-medium text-[#786B5E] mb-3">
                    {prod.subtitle[language]}
                  </p>

                  <p className="text-sm text-[#574B42] leading-relaxed mb-4">
                    {prod.description[language]}
                  </p>

                  <p className="text-xs text-[#6E6053] pt-3 border-t border-[#EFE8DA]">
                    {prod.benefits[language]}
                  </p>
                </div>
              </div>

              {/* Purchase / Inquiry Action Bar */}
              <div className="px-6 pb-6 pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => onInquireProduct(prod.name[language])}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#991B1B] hover:bg-[#7F1D1D] text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>
                    {language === 'te' ? 'ఆర్డర్ / బుక్ చేయండి' : 'Order / Inquire Now'}
                  </span>
                </button>

                <a
                  href={`tel:${contactPhone}`}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-[#FAF7F2] hover:bg-[#EFE8DA] text-[#1C1613] border border-[#D6CEB8] text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 tabular-nums"
                  aria-label={`Call ${contactPhone} for ${prod.name[language]}`}
                >
                  <PhoneCall className="w-3.5 h-3.5 text-[#991B1B]" />
                  <span>{contactPhone}</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
