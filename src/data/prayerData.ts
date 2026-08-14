import { PrayerPageData } from '../types/prayer';
import { assetMap } from '../config/assets';

export const prayerData: PrayerPageData = {
  hero: {
    title: 'WE WOULD LOVE TO PRAY WITH YOU',
    goldSubtitle: 'A HOUSE OF PRAYER FOR ALL NATIONS',
    subtitle:
      'No burden is too heavy, and no request is too small. Join us as we bring our prayers, petitions, and thanksgiving before our Heavenly Father.',
    bgImage:
      assetMap.prayerBg?.url ||
      'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&q=80&w=2000',
    imageAlt: 'Hands folded in prayer at Church of God Subic',
    status: 'pending_verification',
  },

  intro: {
    title: 'The Power & Privilege of Prayer',
    description: [
      'At Church of God – Subic, prayer is not simply a routine activity—it is the heartbeat of our spiritual life and ministry. We believe in a living God who hears our cries, cares deeply for our daily lives, and answers prayer according to His perfect wisdom and grace.',
      'Whether you are walking through a season of difficulty, seeking direction, celebrating a milestone of thanksgiving, or carrying a heavy burden for a loved one, our pastoral and intercessory prayer ministry is honored to stand with you in faith.',
      'You are never alone. Every submitted request is held in utmost respect and brought before God with reverence and care.',
    ],
    status: 'pending_verification',
  },

  scriptures: [
    {
      reference: 'Jeremiah 33:3',
      text: 'Call to me and I will answer you and tell you great and unsearchable things you do not know.',
      theme: 'God’s Invitation',
    },
    {
      reference: 'Philippians 4:6-7',
      text: 'Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.',
      theme: 'Peace in Petition',
    },
    {
      reference: '1 Peter 5:7',
      text: 'Cast all your anxiety on him because he cares for you.',
      theme: 'Casting Care',
    },
    {
      reference: 'James 5:16',
      text: 'Therefore confess your sins to each other and pray for each other so that you may be healed. The prayer of a righteous person is powerful and effective.',
      theme: 'Community Intercession',
    },
  ],

  faqs: [
    {
      question: 'Can I submit a prayer request anonymously?',
      answer:
        'Yes. You are welcome to submit your request anonymously without providing your name or email address.',
      status: 'pending_verification',
    },
    {
      question: 'Who will review my prayer request?',
      answer:
        'Submitted requests are intended for review by authorized members of the Church of God Subic pastoral and prayer team. Requests are not publicly displayed on the website.',
      status: 'pending_verification',
    },
    {
      question: 'Can I request someone from the church to contact me?',
      answer:
        'If you request follow-up and provide contact details, a pastoral team member may reach out when available. Contact details are used solely for requested follow-up.',
      status: 'pending_verification',
    },
    {
      question: 'Can I submit a prayer request for a family member or friend?',
      answer:
        'Yes. We encourage interceding for others. Please respect the privacy of individuals by withholding sensitive private or medical details if submitting on their behalf.',
      status: 'pending_verification',
    },
    {
      question: 'What happens after I submit my prayer request?',
      answer:
        'Your request is logged into our prayer submission queue where authorized intercessors may review and lift your petition to the Lord during designated gatherings.',
      status: 'pending_verification',
    },
  ],

  privacyNotice: {
    title: 'How We Handle Prayer Requests',
    points: [
      'Prayer requests are submitted for authorized church ministry review.',
      'We do not sell, rent, or publicly display submitted contact information.',
      'Public sharing of testimonies or answered prayers requires explicit opt-in consent.',
      'Anonymous submissions do not capture or require any personally identifiable information.',
    ],
  },

  seo: {
    title: 'Prayer & Prayer Requests | Church of God – Subic',
    description:
      'Submit a prayer request to Church of God Subic. Our pastoral and intercessory prayer team stands with you in faith, prayer, and thanksgiving.',
  },
};
