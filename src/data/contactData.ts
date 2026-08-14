import { ContactPageData } from '../types/contact';
import { assetMap } from '../config/assets';

export const contactPageData: ContactPageData = {
  hero: {
    title: 'CONTACT US',
    goldSubtitle: 'REACH OUT & CONNECT',
    subtitle: 'We are here to serve you with pastoral care, prayer support, and information about Church of God – Subic.',
    bgImage: assetMap.welcome?.url || 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&q=80&w=2000',
    status: 'pending_verification',
    meta: {
      status: 'pending_verification',
      notes: 'Official contact channels and administrative office hours awaiting leadership verification.'
    }
  },
  channels: [
    {
      id: 'channel-address',
      type: 'address',
      label: 'Subic Church Address',
      value: 'V723+GFH, AYC Compound Rd, Subic, Zambales (At the back of Jollibee Sto. Tomas)',
      status: 'published',
      meta: {
        status: 'published',
        verifiedAt: '2026-08',
        notes: 'Confirmed location with Google Plus Code V723+GFH.'
      }
    },
    {
      id: 'channel-phone',
      type: 'phone',
      label: 'Church Phone',
      value: '0966 266 7012',
      hours: 'Tuesday – Sunday: 9:00 AM – 5:00 PM',
      status: 'published',
      meta: {
        status: 'published',
        verifiedAt: '2026-08'
      }
    },
    {
      id: 'channel-email',
      type: 'email',
      label: 'Church Email',
      value: 'cogsubic@gmail.com',
      status: 'published',
      meta: {
        status: 'published',
        verifiedAt: '2026-08'
      }
    },
    {
      id: 'channel-hours',
      type: 'office_hours',
      label: 'Administrative Office Hours',
      value: 'Tuesday to Sunday: 9:00 AM – 5:00 PM',
      hours: 'Tuesday to Sunday: 9:00 AM – 5:00 PM',
      status: 'published',
      meta: {
        status: 'published',
        verifiedAt: '2026-08'
      }
    }
  ],
  topics: [
    {
      id: 'topic-general',
      name: 'General Inquiry',
      description: 'Questions regarding Church of God Subic, worship gatherings, or general information.',
      category: 'General'
    },
    {
      id: 'topic-pastoral',
      name: 'Pastoral Care & Counseling',
      description: 'Request spiritual guidance, pastoral conversation, or biblical counseling.',
      category: 'Pastoral'
    },
    {
      id: 'topic-prayer',
      name: 'Prayer Request Support',
      description: 'Inquire about intercessory prayer, prayer meetings, or specific prayer support.',
      category: 'Prayer'
    },
    {
      id: 'topic-visit',
      name: 'Plan Your Visit Inquiry',
      description: 'First-time visitor questions, arrival directions, or hospitality inquiries.',
      category: 'Visitor'
    },
    {
      id: 'topic-ministry',
      name: 'Ministry & Serving Opportunities',
      description: 'Get involved in worship, youth, children’s, or community outreach ministries.',
      category: 'Ministry'
    },
    {
      id: 'topic-sacraments',
      name: 'Water Baptism & Child Dedication',
      description: 'Inquire about upcoming baptismal services or infant/child dedication ceremonies.',
      category: 'Sacraments'
    }
  ],
  seo: {
    title: 'Contact Us | Church of God – Subic',
    description: 'Get in touch with Church of God – Subic for general inquiries, pastoral care, prayer requests, and visitor information.'
  }
};
