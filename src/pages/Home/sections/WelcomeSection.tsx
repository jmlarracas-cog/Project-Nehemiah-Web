import React from 'react';
import { SectionHeader } from '../../../components/ui/SectionHeader';
import { Button } from '../../../components/ui/Button';
import { Container } from '../../../components/ui/Container';
import { assetMap } from '../../../config/assets';
import { Heart, Sparkles, CheckCircle } from 'lucide-react';

export const WelcomeSection: React.FC = () => {
  return (
    <section className="py-20 sm:py-28 bg-background overflow-hidden">
      <Container size="wide">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Text Content */}
          <div className="lg:col-span-7 space-y-6">
            <SectionHeader
              eyebrow="YOU BELONG HERE"
              title="WELCOME HOME TO CHURCH OF GOD SUBIC"
              subtitle="Whether you are taking your first steps toward God or searching for a spirit-filled church family, you are warmly embraced here."
            />

            <p className="text-slate-700 text-base leading-relaxed">
              We are a Bible-believing, Christ-exalting, and community-focused church located in Subic, Zambales. Our heart is to gather the harvest of souls, nurture growing disciples, and impact our city through radical love, authentic fellowship, and practical gospel service.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 py-2">
              <div className="flex items-start space-x-3 bg-white p-4 rounded-md shadow-xs border border-slate-100">
                <CheckCircle className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-black text-navy text-sm uppercase">Praise & Worship</h4>
                  <p className="text-xs text-slate-600">Vibrant, Spirit-led worship lifting up the name of Jesus.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 bg-white p-4 rounded-md shadow-xs border border-slate-100">
                <CheckCircle className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-black text-navy text-sm uppercase">Biblical Preaching</h4>
                  <p className="text-xs text-slate-600">Expository, life-transforming truth grounded in Scripture.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 bg-white p-4 rounded-md shadow-xs border border-slate-100">
                <CheckCircle className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-black text-navy text-sm uppercase">Generational Care</h4>
                  <p className="text-xs text-slate-600">Dedicated ministries for toddlers, kids, youth, and families.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 bg-white p-4 rounded-md shadow-xs border border-slate-100">
                <CheckCircle className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-black text-navy text-sm uppercase">Warm Fellowship</h4>
                  <p className="text-xs text-slate-600">Life groups that foster genuine accountability and friendship.</p>
                </div>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap gap-4 items-center">
              <Button variant="secondary" size="md" href="/about">
                LEARN MORE ABOUT OUR STORY
              </Button>
              <Button variant="ghost" size="md" href="/visit">
                PLAN YOUR VISIT THIS SUNDAY →
              </Button>
            </div>
          </div>

          {/* Image Composition */}
          <div className="lg:col-span-5 relative">
            <div className="relative z-10 rounded-lg overflow-hidden shadow-2xl border-4 border-white">
              <img
                src={assetMap.welcome.url}
                alt={assetMap.welcome.alt}
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>

            {/* Decorative Gold Backdrop Box */}
            <div className="absolute -bottom-6 -right-6 w-full h-full bg-gold/20 rounded-lg -z-0 border border-gold/30" />

            {/* Floating Quote Badge */}
            <div className="absolute -top-6 -left-6 bg-navy text-white p-5 rounded-md shadow-xl border border-gold/40 z-20 max-w-xs hidden sm:block">
              <div className="flex items-center text-gold mb-1">
                <Sparkles className="w-4 h-4 mr-1.5" />
                <span className="text-[10px] font-black uppercase tracking-widest">GATHER THE HARVEST</span>
              </div>
              <p className="text-xs italic text-gray-200">
                "The harvest is plentiful, but the workers are few. Ask the Lord of the harvest..."
              </p>
              <span className="text-[10px] text-gold font-bold block mt-1">— Matthew 9:37-38</span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
