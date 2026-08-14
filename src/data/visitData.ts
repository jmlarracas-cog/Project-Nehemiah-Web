import { VisitPageData } from '../types/contact';
import { assetMap } from '../config/assets';

export const visitPageData: VisitPageData = {
  hero: {
    title: 'PLAN YOUR VISIT',
    goldSubtitle: 'WE WOULD LOVE TO WELCOME YOU',
    subtitle: 'Whether you are seeking a church home, local fellowship, or spiritual guidance, we invite you to experience Christ-centered worship with us.',
    bgImage: assetMap.hero?.url || 'https://images.unsplash.com/photo-1438032005730-c779502df39b?auto=format&fit=crop&q=80&w=2000',
    status: 'pending_verification',
    meta: {
      status: 'pending_verification',
      notes: 'Worship schedules and campus visitor procedures awaiting final pastoral confirmation.'
    }
  },
  services: [
    {
      id: 'srv-visit-1',
      name: 'Sunday Worship Services',
      day: 'Sunday',
      time: '9:30 AM • 4:00 PM • 6:00 PM',
      location: 'Subic Church Sanctuary',
      duration: '75–90 Minutes',
      category: 'Corporate Worship',
      status: 'published',
      meta: {
        status: 'published',
        verifiedAt: '2026-08',
        notes: 'Confirmed Sunday service times: 9:30 AM, 4:00 PM, and 6:00 PM.'
      }
    },
    {
      id: 'srv-visit-2',
      name: 'Wednesday Midweek Service',
      day: 'Wednesday',
      time: '6:30 PM',
      location: 'Subic Church Sanctuary',
      duration: '60–75 Minutes',
      category: 'Midweek Discipleship & Prayer',
      status: 'published',
      meta: {
        status: 'published',
        verifiedAt: '2026-08',
        notes: 'Confirmed Wednesday midweek service at 6:30 PM.'
      }
    }
  ],
  expectationBlocks: [
    {
      id: 'exp-1',
      title: 'Before You Arrive',
      description: 'Check service times and location directions. Feel free to reach out via our contact form if you have specific accessibility or visitor questions.',
      iconName: 'Compass',
      status: 'pending_verification'
    },
    {
      id: 'exp-2',
      title: 'When You Arrive',
      description: 'You will be greeted by our hospitality team at the sanctuary entrance. They are available to guide you to seating and assist with children’s check-in.',
      iconName: 'HeartHandshake',
      status: 'pending_verification'
    },
    {
      id: 'exp-3',
      title: 'During Worship',
      description: 'Our services feature vibrant congregational praise, biblically grounded preaching, and dedicated time for prayer and intercession.',
      iconName: 'Clock',
      status: 'pending_verification'
    },
    {
      id: 'exp-4',
      title: 'After the Service',
      description: 'Join us for post-service fellowship! Our pastoral team and ministry leaders look forward to meeting first-time guests and answering questions.',
      iconName: 'Users',
      status: 'pending_verification'
    }
  ],
  guideItems: [
    {
      id: 'guide-1',
      question: 'Where do I go when I arrive?',
      answer: 'Our main worship sanctuary entrance is clearly signed. Hospitality greeters at the doors will welcome you and assist you in finding comfortable seating.',
      category: 'arrival',
      status: 'pending_verification'
    },
    {
      id: 'guide-2',
      question: 'What should I wear?',
      answer: 'There is no formal dress code. Worshipers attend in modest casual to smart-casual clothing. Please come as you are comfortable.',
      category: 'apparel',
      status: 'pending_verification'
    },
    {
      id: 'guide-3',
      question: 'What time should I arrive?',
      answer: 'We recommend arriving 10 to 15 minutes prior to the worship service start time to park, find seating, and settle in comfortably.',
      category: 'schedule',
      status: 'pending_verification'
    },
    {
      id: 'guide-4',
      question: 'Where do I park my vehicle?',
      answer: 'Dedicated parking areas are available on campus grounds. Greeters will assist with parking directions during Sunday services.',
      category: 'parking',
      status: 'pending_verification'
    },
    {
      id: 'guide-5',
      question: 'Is there a program for children during the service?',
      answer: 'Yes, our Kingdom Kids ministry provides age-appropriate, safe, and engaging Bible instruction during corporate worship times upon official program activation.',
      category: 'children',
      status: 'pending_verification'
    },
    {
      id: 'guide-6',
      question: 'Are there activities for youth and young adults?',
      answer: 'Our youth ministry meets for fellowship, biblical discipleship, and worship. Check our weekly announcements for specific gathering times.',
      category: 'youth',
      status: 'pending_verification'
    },
    {
      id: 'guide-7',
      question: 'Who can I talk to if I have questions?',
      answer: 'Our ushering team, hospitality greeters, and pastoral team are readily available before and after every service to assist you.',
      category: 'hospitality',
      status: 'pending_verification'
    },
    {
      id: 'guide-8',
      question: 'What happens after the service ends?',
      answer: 'You are invited to stay for fellowship, meet church leaders, or visit our welcoming team to receive guest information and prayer.',
      category: 'next_steps',
      status: 'pending_verification'
    }
  ],
  seo: {
    title: 'Plan Your Visit | Church of God – Subic',
    description: 'Plan your visit to Church of God – Subic. Learn what to expect, service schedules, parking, children’s ministry, and visitor guidelines.'
  }
};
