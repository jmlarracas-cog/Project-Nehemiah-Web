import React from 'react';
import { LeadershipMember } from '../../types/about';
import { Leader } from '../../types';
import { Mail, Facebook, Youtube, Instagram, Linkedin } from 'lucide-react';
import { ContentVerificationBadge } from '../ui/ContentVerificationBadge';

interface LeaderCardProps {
  leader: LeadershipMember | Leader;
}

export const LeaderCard: React.FC<LeaderCardProps> = ({ leader }) => {
  const socialLinks = 'socialLinks' in leader ? leader.socialLinks : undefined;
  const status = 'status' in leader ? leader.status : undefined;

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-slate-200 flex flex-col items-center text-center p-6 group hover:-translate-y-1 relative">
      {/* Photo with frame */}
      <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden mb-4 border-4 border-gold/30 group-hover:border-gold transition-colors shadow-lg">
        <img
          src={leader.imageUrl}
          alt={leader.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>

      {status === 'pending_verification' && (
        <div className="mb-3">
          <ContentVerificationBadge
            status="pending_verification"
            compact
            label="DEMO PROFILE"
          />
        </div>
      )}

      <span className="text-xs font-extrabold uppercase tracking-widest text-gold bg-navy px-3.5 py-1 rounded-full mb-2 shadow-xs">
        {leader.title}
      </span>

      <h3 className="text-xl font-black text-navy uppercase tracking-tight mb-1">
        {leader.name}
      </h3>

      <p className="text-sm font-semibold text-slate-600 mb-3">{leader.role}</p>

      <p className="text-sm text-slate-700 leading-relaxed mb-6 max-w-sm font-normal">
        {leader.bio}
      </p>

      <div className="mt-auto w-full pt-4 border-t border-slate-100 flex flex-col items-center gap-2">
        {leader.email && (
          <a
            href={`mailto:${leader.email}`}
            className="inline-flex items-center text-xs sm:text-sm font-bold text-navy hover:text-gold transition-colors"
          >
            <Mail className="w-4 h-4 mr-1.5 text-gold" /> {leader.email}
          </a>
        )}

        {socialLinks && (
          <div className="flex items-center space-x-3 mt-1">
            {socialLinks.facebook && (
              <a
                href={socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-navy hover:bg-gold hover:text-navy transition-colors"
                aria-label={`${leader.name} Facebook`}
              >
                <Facebook className="w-4 h-4" />
              </a>
            )}
            {socialLinks.youtube && (
              <a
                href={socialLinks.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-navy hover:bg-gold hover:text-navy transition-colors"
                aria-label={`${leader.name} YouTube`}
              >
                <Youtube className="w-4 h-4" />
              </a>
            )}
            {socialLinks.instagram && (
              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-navy hover:bg-gold hover:text-navy transition-colors"
                aria-label={`${leader.name} Instagram`}
              >
                <Instagram className="w-4 h-4" />
              </a>
            )}
            {socialLinks.linkedin && (
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-navy hover:bg-gold hover:text-navy transition-colors"
                aria-label={`${leader.name} LinkedIn`}
              >
                <Linkedin className="w-4 h-4" />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
