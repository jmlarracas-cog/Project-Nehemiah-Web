import React from 'react';
import { ValueItem } from '../../types/about';
import { SectionHeader } from '../ui/SectionHeader';
import {
  Compass,
  Eye,
  Crown,
  BookOpen,
  Users,
  HeartHandshake,
  Globe,
  Sparkles,
  ShieldCheck,
  Heart,
} from 'lucide-react';

interface MissionVisionValuesProps {
  mission: {
    title: string;
    description: string;
    scripture: string;
  };
  vision: {
    title: string;
    description: string;
    scripture: string;
  };
  values: ValueItem[];
}

const iconMap: Record<string, React.ReactNode> = {
  Compass: <Compass className="w-6 h-6 text-gold" />,
  Eye: <Eye className="w-6 h-6 text-gold" />,
  Crown: <Crown className="w-6 h-6 text-gold" />,
  BookOpen: <BookOpen className="w-6 h-6 text-gold" />,
  Users: <Users className="w-6 h-6 text-gold" />,
  HeartHandshake: <HeartHandshake className="w-6 h-6 text-gold" />,
  Globe: <Globe className="w-6 h-6 text-gold" />,
  Sparkles: <Sparkles className="w-6 h-6 text-gold" />,
  ShieldCheck: <ShieldCheck className="w-6 h-6 text-gold" />,
  Heart: <Heart className="w-6 h-6 text-gold" />,
};

export const MissionVisionValues: React.FC<MissionVisionValuesProps> = ({
  mission,
  vision,
  values,
}) => {
  return (
    <section className="py-20 bg-navy text-white relative overflow-hidden">
      {/* Subtle radial background atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold/10 via-transparent to-transparent opacity-50 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader
          eyebrow="FOUNDATIONAL PILLARS"
          title="MISSION, VISION & CORE VALUES"
          subtitle="Guided by the Holy Scriptures and aligned for eternal kingdom impact."
          light
          centered
        />

        {/* Mission & Vision Twin Cards */}
        <div className="grid md:grid-cols-2 gap-8 my-12">
          {/* Mission Card */}
          <div className="bg-navy-dark/90 border border-gold/30 hover:border-gold/70 p-8 rounded-xl shadow-2xl transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-full bg-gold/15 border border-gold/40 flex items-center justify-center mb-6 group-hover:bg-gold/25 transition-all">
                <Compass className="w-6 h-6 text-gold" />
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-gold block mb-2">
                OUR SACRED MANDATE
              </span>
              <h3 className="text-2xl font-black uppercase text-white mb-4 tracking-tight">
                {mission.title}
              </h3>
              <p className="text-base text-slate-200 leading-relaxed font-normal">
                {mission.description}
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-gold/20 text-xs sm:text-sm font-extrabold text-gold uppercase tracking-wider">
              {mission.scripture}
            </div>
          </div>

          {/* Vision Card */}
          <div className="bg-navy-dark/90 border border-gold/30 hover:border-gold/70 p-8 rounded-xl shadow-2xl transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-full bg-gold/15 border border-gold/40 flex items-center justify-center mb-6 group-hover:bg-gold/25 transition-all">
                <Eye className="w-6 h-6 text-gold" />
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-gold block mb-2">
                OUR ETERNAL HOPE
              </span>
              <h3 className="text-2xl font-black uppercase text-white mb-4 tracking-tight">
                {vision.title}
              </h3>
              <p className="text-base text-slate-200 leading-relaxed font-normal">
                {vision.description}
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-gold/20 text-xs sm:text-sm font-extrabold text-gold uppercase tracking-wider">
              {vision.scripture}
            </div>
          </div>
        </div>

        {/* Dynamic Values Grid */}
        <div className="mt-16">
          <div className="text-center mb-10">
            <span className="text-xs font-black uppercase text-gold tracking-widest block mb-2">
              OUR CORE VALUES
            </span>
            <h3 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
              WHAT DRIVES OUR COMMUNITY
            </h3>
            <div className="h-1 w-16 bg-gold mx-auto mt-3 rounded-full" />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((val) => (
              <div
                key={val.id}
                className="bg-navy-dark/70 border border-gold/20 hover:border-gold/50 p-6 rounded-lg transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="w-10 h-10 rounded-lg bg-gold/10 border border-gold/30 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  {iconMap[val.iconName] || <Sparkles className="w-5 h-5 text-gold" />}
                </div>
                <h4 className="text-base font-bold uppercase text-white tracking-tight mb-2 group-hover:text-gold transition-colors">
                  {val.title}
                </h4>
                <p className="text-sm text-slate-200 leading-relaxed mb-4 font-normal">
                  {val.description}
                </p>
                {val.scripture && (
                  <span className="inline-block text-xs font-bold uppercase tracking-wider text-gold bg-gold/10 px-2.5 py-1 rounded border border-gold/20">
                    {val.scripture}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
