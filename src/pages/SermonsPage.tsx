import React, { useEffect } from 'react';
import { sermonData } from '../data/sermonData';
import { SermonsHero } from '../components/sermons/SermonsHero';
import { FeaturedSermon } from '../components/sermons/FeaturedSermon';
import { SermonGrid } from '../components/sermons/SermonGrid';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import { Heart, Sparkles, BookOpen } from 'lucide-react';

export const SermonsPage: React.FC = () => {
  useEffect(() => {
    document.title = sermonData.seo.title || 'Sermons & Teachings | Church of God – Subic';
    window.scrollTo(0, 0);
  }, []);

  const featuredSermon = sermonData.sermons.find((s) => s.featured) || sermonData.sermons[0];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <SermonsHero
        title={sermonData.hero.title}
        goldSubtitle={sermonData.hero.goldSubtitle}
        subtitle={sermonData.hero.subtitle}
        bgImage={sermonData.hero.bgImage}
        imageAlt={sermonData.hero.imageAlt}
        scriptureQuote={sermonData.hero.scriptureQuote}
      />

      {/* Featured Sermon Banner */}
      {featuredSermon && (
        <FeaturedSermon sermon={featuredSermon} />
      )}

      {/* Main Sermon Search, Filter & Grid */}
      <SermonGrid
        sermons={sermonData.sermons}
        categories={sermonData.categories}
        seriesList={sermonData.seriesList}
        speakersList={sermonData.speakersList}
      />

      {/* Prayer & Discipleship CTA Section */}
      <section className="py-16 bg-navy text-white relative overflow-hidden border-t border-gold/20">
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy-light to-navy opacity-90 pointer-events-none" />

        <Container size="wide" className="relative z-10 text-center space-y-6">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-gold/15 border border-gold/40 text-gold text-xs font-black uppercase tracking-widest mx-auto">
            <Sparkles className="w-4 h-4 text-gold" />
            <span>GROW DEEPER IN GOD'S WORD</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white max-w-3xl mx-auto">
            Ready to Take Your Next Step in Discipleship?
          </h2>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Sermons are meant to spark transformation in daily life. Connect with a Life Group, join our weekly prayer gathering, or request personal prayer from our ministry team.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Button
              variant="primary"
              href="/ministries/discipleship-life-groups"
              icon={BookOpen}
              iconPosition="left"
            >
              JOIN A LIFE GROUP
            </Button>

            <Button
              variant="outline"
              href="/prayer"
              icon={Heart}
              iconPosition="left"
              className="text-white border-white/30 hover:bg-white/10"
            >
              REQUEST PRAYER
            </Button>
          </div>
        </Container>
      </section>
    </div>
  );
};
