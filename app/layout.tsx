import type { Metadata } from 'next';
import {
  Cormorant_Garamond,
  Plus_Jakarta_Sans,
  Noto_Serif_Telugu,
} from 'next/font/google';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-serif-display',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans-body',
});

const notoTelugu = Noto_Serif_Telugu({
  subsets: ['telugu'],
  weight: ['400', '600', '700'],
  variable: '--font-telugu',
});

export const metadata: Metadata = {
  title: 'సద్గురు నాటు వైద్యం | Sadguru Natu Vaidyam & Vedic Astrology — Srinivas Maharaj',
  description:
    'Srinivas Maharaj (శ్రీనివాస్ మహారాజ్) — Tantra Vaidya & Vedic Astrology Expert. Vashikaran, Marital Harmony, Marugu Mandu, Marla Mandu Detox, Black Magic Removal, Sacred Copper Yantras, Puja Samagri, and Ayurvedic Herbal Formulations. Contact: 7093586539.',
  other: {
    'google-adsense-account': 'ca-pub-6709151112965859',
  },
  openGraph: {
    title: 'సద్గురు నాటు వైద్యం | Sadguru Natu Vaidyam — Srinivas Maharaj',
    description:
      'Traditional Tantra Vaidyam, Vedic Astrology, Sacred Yantras, Puja Samagri, and Ayurvedic Herbal Remedies by Srinivas Maharaj. Contact: 7093586539.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'సద్గురు నాటు వైద్యం | Sadguru Natu Vaidyam — Srinivas Maharaj',
    description:
      'Traditional Tantra Vaidyam, Vedic Astrology, Sacred Yantras, Puja Samagri, and Ayurvedic Herbal Remedies by Srinivas Maharaj. Contact: 7093586539.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="te"
      className={`${cormorant.variable} ${jakarta.variable} ${notoTelugu.variable}`}
    >
      <head>
        <meta
          name="google-adsense-account"
          content="ca-pub-6709151112965859"
        />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6709151112965859"
          crossOrigin="anonymous"
        />
      </head>
      <body
        suppressHydrationWarning
        className="bg-[#FAF7F2] text-[#1C1613] antialiased font-sans selection:bg-[#991B1B] selection:text-white"
      >
        {children}
      </body>
    </html>
  );
}
