import React, { useState } from 'react';
import { SectionHeader } from '../../../components/ui/SectionHeader';
import { Container } from '../../../components/ui/Container';
import { SermonCard } from '../../../components/church/SermonCard';
import { sermonsData } from '../../../data/churchData';
import { Sermon } from '../../../types';
import { Button } from '../../../components/ui/Button';
import { X } from 'lucide-react';

export const FeaturedSermon: React.FC = () => {
  const featured = sermonsData.find((s) => s.featured) || sermonsData[0];
  const [activeSermonModal, setActiveSermonModal] = useState<Sermon | null>(null);

  return (
    <section className="py-20 bg-background border-y border-slate-200">
      <Container size="wide">
        <SectionHeader
          eyebrow="TRUTH THAT TRANSFORMS"
          title="FEATURED SERMON"
          subtitle="Listen to inspiring, Bible-centered messages delivered live from our Subic sanctuary."
        />

        <div className="mt-8">
          <SermonCard
            sermon={featured}
            featured
            onWatch={(sermon) => setActiveSermonModal(sermon)}
          />
        </div>

        <div className="mt-12 text-center">
          <Button variant="secondary" size="lg" href="/sermons">
            BROWSE SERMON ARCHIVE & SERIES →
          </Button>
        </div>
      </Container>

      {/* Video Modal Overlay */}
      {activeSermonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl bg-navy rounded-lg overflow-hidden shadow-2xl border border-gold/30">
            <div className="flex items-center justify-between p-4 bg-navy-dark border-b border-white/10">
              <h3 className="text-base font-bold text-white uppercase tracking-tight truncate pr-4">
                {activeSermonModal.title} — {activeSermonModal.speaker}
              </h3>
              <button
                onClick={() => setActiveSermonModal(null)}
                className="p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close video"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative aspect-video w-full bg-black">
              <iframe
                src={activeSermonModal.videoUrl}
                title={activeSermonModal.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="p-4 bg-navy text-xs text-gray-300 flex justify-between items-center">
              <span>Scripture: <strong className="text-gold">{activeSermonModal.scripture}</strong></span>
              <span>Series: <strong className="text-white">{activeSermonModal.series}</strong></span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
