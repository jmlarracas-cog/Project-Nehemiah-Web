import React, { useEffect } from 'react';
import { sermonData } from '../data/sermonData';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { ContentVerificationBadge } from '../components/ui/ContentVerificationBadge';
import { Button } from '../components/ui/Button';
import { Container } from '../components/ui/Container';
import { RelatedSermons } from '../components/sermons/RelatedSermons';
import { classifyVideoLink } from '../utils/urlValidation';
import {
  Calendar,
  Clock,
  BookOpen,
  User,
  Volume2,
  FileText,
  Share2,
  ArrowLeft,
  Tv,
  CheckCircle2,
  HelpCircle,
  Lightbulb,
  ExternalLink,
} from 'lucide-react';

interface SermonDetailPageProps {
  slug: string;
}

export const SermonDetailPage: React.FC<SermonDetailPageProps> = ({ slug }) => {
  const sermon = sermonData.sermons.find((s) => s.slug === slug);

  useEffect(() => {
    if (sermon) {
      document.title = `${sermon.title} | Church of God – Subic Sermons`;
    } else {
      document.title = 'Sermon Not Found | Church of God – Subic';
    }
    window.scrollTo(0, 0);
  }, [sermon]);

  if (!sermon) {
    return (
      <div className="min-h-screen bg-slate-50 py-20">
        <Container size="narrow" className="text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center mx-auto">
            <Tv className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black uppercase text-navy">Sermon Not Found</h1>
          <p className="text-slate-600 text-sm">
            The sermon you are looking for may have been moved or is undergoing content verification.
          </p>
          <Button variant="primary" href="/sermons" icon={ArrowLeft} iconPosition="left">
            RETURN TO SERMONS
          </Button>
        </Container>
      </div>
    );
  }

  const speakerName = typeof sermon.speaker === 'string' ? sermon.speaker : sermon.speaker.name;
  const speakerTitle = typeof sermon.speaker === 'string' ? '' : sermon.speaker.title;
  const seriesTitle = typeof sermon.series === 'string' ? sermon.series : sermon.series.title;

  // Video classification and governance
  const videoInfo = classifyVideoLink(sermon.videoUrl, sermon.videoProvider);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: sermon.title,
        text: sermon.description,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Sermon link copied to clipboard!');
    }
  };

  return (
    <article className="min-h-screen bg-slate-50">
      {/* Header Banner */}
      <header className="bg-navy text-white pt-8 pb-12 border-b border-gold/20">
        <Container size="wide">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Breadcrumb
              items={[
                { label: 'Home', href: '/' },
                { label: 'Sermons', href: '/sermons' },
                { label: sermon.title },
              ]}
            />
          </div>

          <div className="max-w-4xl space-y-4">
            {/* Top Badges */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="bg-gold/20 border border-gold/40 text-gold text-xs font-black uppercase tracking-widest px-3 py-1 rounded-md">
                {seriesTitle}
              </span>
              <span className="bg-white/10 text-slate-200 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-md">
                {sermon.category}
              </span>

              <ContentVerificationBadge
                status={sermon.status}
                verifiedAt={sermon.meta?.verifiedAt}
                verifiedBy={sermon.meta?.verifiedBy}
                notes={sermon.meta?.notes}
              />
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white leading-tight font-sans">
              {sermon.title}
            </h1>

            {sermon.subtitle && (
              <p className="text-lg text-gold font-serif italic">
                {sermon.subtitle}
              </p>
            )}

            {/* Metadata Bar */}
            <div className="pt-2 flex flex-wrap items-center gap-6 text-xs sm:text-sm text-slate-300 font-medium">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gold shrink-0" />
                <span>
                  <strong className="text-white">{speakerName}</strong> {speakerTitle && `(${speakerTitle})`}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-gold shrink-0" />
                <span className="text-gold font-bold">{sermon.scripture.reference}</span>
              </div>

              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gold shrink-0" />
                <span>{sermon.date}</span>
              </div>

              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gold shrink-0" />
                <span>{sermon.duration}</span>
              </div>
            </div>
          </div>
        </Container>
      </header>

      {/* Main Content Area */}
      <Container size="wide" className="py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Main Column: Media & Notes */}
          <main className="lg:col-span-8 space-y-8">
            {/* Video Player Container */}
            <div className="bg-black rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
              {videoInfo.isEmbeddable && videoInfo.embedUrl ? (
                <div className="relative aspect-video w-full">
                  <iframe
                    src={videoInfo.embedUrl}
                    title={sermon.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full border-0"
                  />
                </div>
              ) : videoInfo.externalUrl ? (
                /* External Provider Video Fallback */
                <div className="relative aspect-video w-full bg-slate-900 flex flex-col items-center justify-center p-8 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-navy/80 border border-gold/40 text-gold flex items-center justify-center shadow-lg">
                    <Tv className="w-8 h-8" />
                  </div>
                  <div className="space-y-2 max-w-md mx-auto">
                    <h3 className="text-xl font-black uppercase text-white tracking-tight">
                      Watch On {videoInfo.providerLabel}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {videoInfo.noticeMessage || 'This video stream is hosted on an external platform and must be opened directly at the provider source.'}
                    </p>
                    <div className="pt-2">
                      <a
                        href={videoInfo.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 px-5 py-2.5 bg-gold hover:bg-gold/90 text-navy font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md"
                      >
                        <span>Open Video On {videoInfo.providerLabel}</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                /* Video Coming Soon Placeholder */
                <div className="relative aspect-video w-full bg-slate-900 flex flex-col items-center justify-center p-8 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-navy/80 border border-gold/40 text-gold flex items-center justify-center shadow-lg">
                    <Tv className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black uppercase text-white tracking-tight">
                      Video Recording Coming Soon
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto mt-1">
                      The video recording for this message is currently being processed by the Church of God Subic media team. Check back shortly!
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions Bar */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  variant="secondary"
                  size="sm"
                  icon={Volume2}
                  iconPosition="left"
                  onClick={() => alert('Audio recording playback initializing.')}
                >
                  LISTEN AUDIO
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  icon={FileText}
                  iconPosition="left"
                  onClick={() => window.print()}
                >
                  PRINT NOTES
                </Button>
              </div>

              <button
                onClick={handleShare}
                className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-navy hover:text-gold transition-colors p-2 cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>SHARE MESSAGE</span>
              </button>
            </div>

            {/* Overview / Message Description */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-xl font-black uppercase text-navy tracking-tight pb-2 border-b border-slate-100">
                Message Overview
              </h2>
              <p className="text-slate-700 text-sm sm:text-base leading-relaxed font-normal">
                {sermon.description}
              </p>
            </div>

            {/* Scripture Highlight Box */}
            {sermon.scripture.text && (
              <div className="bg-navy text-white p-6 sm:p-8 rounded-2xl border-l-4 border-gold shadow-lg space-y-3">
                <div className="flex items-center space-x-2 text-gold text-xs font-extrabold uppercase tracking-widest">
                  <BookOpen className="w-4 h-4 text-gold" />
                  <span>KEY SCRIPTURE PASSAGE</span>
                </div>
                <blockquote className="text-base sm:text-lg italic font-serif leading-relaxed text-slate-100">
                  "{sermon.scripture.text}"
                </blockquote>
                <div className="text-xs font-bold text-gold tracking-widest text-right">
                  — {sermon.scripture.reference}
                </div>
              </div>
            )}

            {/* Sermon Outline & Notes Section */}
            {sermon.notesContent && (
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
                <h2 className="text-xl font-black uppercase text-navy tracking-tight pb-2 border-b border-slate-100 flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-gold-dark" />
                  <span>Sermon Notes & Study Guide</span>
                </h2>

                {/* Outline Points */}
                {sermon.notesContent.outline.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                      Message Outline
                    </h3>
                    <ul className="space-y-2">
                      {sermon.notesContent.outline.map((point, i) => (
                        <li key={i} className="flex items-start space-x-3 text-xs sm:text-sm text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-gold-dark shrink-0 mt-0.5" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Key Takeaways */}
                {sermon.notesContent.keyTakeaways.length > 0 && (
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-navy flex items-center space-x-1.5">
                      <Lightbulb className="w-4 h-4 text-gold-dark" />
                      <span>Key Takeaways</span>
                    </h3>
                    <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-slate-700">
                      {sermon.notesContent.keyTakeaways.map((takeaway, i) => (
                        <li key={i}>{takeaway}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Reflection Questions */}
                {sermon.notesContent.reflectionQuestions.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center space-x-1.5">
                      <HelpCircle className="w-4 h-4 text-gold-dark" />
                      <span>Life Group & Personal Reflection</span>
                    </h3>
                    <ol className="list-decimal list-inside space-y-2 text-xs sm:text-sm text-slate-700 pl-1">
                      {sermon.notesContent.reflectionQuestions.map((q, i) => (
                        <li key={i} className="leading-relaxed">{q}</li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            )}

            {/* Tags */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-2">
                Topic Tags:
              </span>
              {sermon.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-slate-200 text-slate-700 font-semibold px-3 py-1 rounded-full hover:bg-gold/20 hover:text-navy transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </main>

          {/* Right Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Series Information Box */}
            {typeof sermon.series !== 'string' && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <span className="text-[10px] font-extrabold text-gold-dark uppercase tracking-widest block">
                  CURRENT SERMON SERIES
                </span>
                <h3 className="text-lg font-black uppercase text-navy tracking-tight">
                  {sermon.series.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {sermon.series.description}
                </p>
              </div>
            )}

            {/* Speaker Info Card */}
            {typeof sermon.speaker !== 'string' && sermon.speaker.avatarUrl && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 flex items-center space-x-4">
                <img
                  src={sermon.speaker.avatarUrl}
                  alt={sermon.speaker.name}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-full object-cover border-2 border-gold shadow-md shrink-0"
                />
                <div>
                  <h4 className="text-sm font-black uppercase text-navy">
                    {sermon.speaker.name}
                  </h4>
                  <p className="text-xs font-semibold text-gold-dark">
                    {sermon.speaker.title}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {sermon.speaker.role}
                  </p>
                </div>
              </div>
            )}

            {/* Sunday Service Invitation CTA */}
            <div className="bg-navy text-white p-6 rounded-2xl border border-gold/30 shadow-xl space-y-4 text-center">
              <h3 className="text-lg font-black uppercase text-gold tracking-tight">
                JOIN US THIS SUNDAY
              </h3>
              <p className="text-xs text-slate-200 leading-relaxed">
                Experience spirit-filled worship, vibrant community, and inspiring messages at Church of God Subic.
              </p>
              <div className="space-y-2 text-xs font-medium text-slate-300">
                <p>📍 Church Sanctuary — Subic, Zambales</p>
                <p>⏰ Worship Schedule: Pending Verification</p>
              </div>
              <Button
                variant="primary"
                size="sm"
                href="/visit"
                className="w-full"
              >
                PLAN YOUR VISIT
              </Button>
            </div>
          </aside>
        </div>
      </Container>

      {/* Related Sermons */}
      <RelatedSermons
        currentSermon={sermon}
        allSermons={sermonData.sermons}
      />
    </article>
  );
};
