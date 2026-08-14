import React from 'react';
import { ContactChannel } from '../../types/contact';
import { Container } from '../ui/Container';
import { ContentVerificationBadge } from '../ui/ContentVerificationBadge';
import { MapPin, Phone, Mail, Clock, HelpCircle } from 'lucide-react';

interface ContactOptionsProps {
  channels: ContactChannel[];
}

export const ContactOptions: React.FC<ContactOptionsProps> = ({ channels }) => {
  const getChannelIcon = (type: string) => {
    switch (type) {
      case 'address':
        return <MapPin className="w-5 h-5 text-gold" />;
      case 'phone':
        return <Phone className="w-5 h-5 text-gold" />;
      case 'email':
        return <Mail className="w-5 h-5 text-gold" />;
      case 'office_hours':
        return <Clock className="w-5 h-5 text-gold" />;
      default:
        return <HelpCircle className="w-5 h-5 text-gold" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <span className="text-xs font-black uppercase tracking-widest text-gold block">
          OFFICIAL CHANNELS
        </span>
        <h3 className="text-xl font-black text-navy uppercase tracking-tight">
          Contact Channels
        </h3>
        <p className="text-slate-600 text-xs sm:text-sm">
          Communication pathways for Church of God – Subic.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {channels.map((channel) => (
          <div
            key={channel.id}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="w-9 h-9 rounded-xl bg-navy/10 flex items-center justify-center">
                  {getChannelIcon(channel.type)}
                </div>
                <ContentVerificationBadge
                  status={channel.status}
                  className="text-[10px]"
                />
              </div>

              <div>
                <h4 className="font-bold text-navy text-xs uppercase tracking-wider">
                  {channel.label}
                </h4>
                <p className="text-slate-700 text-xs sm:text-sm font-semibold pt-0.5">
                  {channel.value}
                </p>
                {channel.hours && (
                  <p className="text-[11px] text-slate-500 pt-1 font-medium">
                    {channel.hours}
                  </p>
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-400">
              {channel.meta?.notes || 'Pending administrative publication.'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
