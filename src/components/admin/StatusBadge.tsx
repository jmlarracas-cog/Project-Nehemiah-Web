import React from 'react';
import { ContentStatus } from '../../types/about';
import { PrayerSubmissionStatus, ContactInquiryStatus } from '../../types/admin';
import { CheckCircle2, Clock, FileEdit, Archive, AlertCircle, MessageSquare } from 'lucide-react';

interface StatusBadgeProps {
  status: ContentStatus | PrayerSubmissionStatus | ContactInquiryStatus | string;
  className?: string;
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className = '',
  showIcon = true,
}) => {
  switch (status) {
    case 'published':
      return (
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 ${className}`}
        >
          {showIcon && <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />}
          Published
        </span>
      );

    case 'pending_verification':
      return (
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200/80 ${className}`}
        >
          {showIcon && <Clock className="w-3.5 h-3.5 mr-1 text-amber-600" />}
          Pending Verification
        </span>
      );

    case 'draft':
      return (
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 ${className}`}
        >
          {showIcon && <FileEdit className="w-3.5 h-3.5 mr-1 text-slate-500" />}
          Draft
        </span>
      );

    case 'archived':
      return (
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-500 border border-gray-200 ${className}`}
        >
          {showIcon && <Archive className="w-3.5 h-3.5 mr-1 text-gray-400" />}
          Archived
        </span>
      );

    // Prayer / Contact Specific Statuses
    case 'new':
      return (
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200/80 uppercase tracking-wider ${className}`}
        >
          {showIcon && <AlertCircle className="w-3.5 h-3.5 mr-1 text-rose-600" />}
          New Submission
        </span>
      );

    case 'praying':
      return (
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200/80 ${className}`}
        >
          {showIcon && <Clock className="w-3.5 h-3.5 mr-1 text-purple-600" />}
          In Prayer
        </span>
      );

    case 'followed_up':
    case 'responded':
      return (
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200/80 ${className}`}
        >
          {showIcon && <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-sky-600" />}
          Responded
        </span>
      );

    case 'in_progress':
      return (
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/80 ${className}`}
        >
          {showIcon && <MessageSquare className="w-3.5 h-3.5 mr-1 text-indigo-600" />}
          In Progress
        </span>
      );

    default:
      return (
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200 ${className}`}
        >
          {status}
        </span>
      );
  }
};
