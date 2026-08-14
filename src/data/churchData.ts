import { Sermon, EventItem, Ministry, ImpactStatistic, Leader, PrayerRequest } from '../types';
import { ChurchLocation, ChurchPageData } from '../types/church';
import { assetMap } from '../config/assets';

export const churchLocationsData: ChurchLocation[] = [
  {
    id: 'cog-subic',
    slug: 'church-of-god-subic',
    name: 'Church of God – Subic',
    shortName: 'COG Subic',
    city: 'Subic',
    municipality: 'Subic',
    province: 'Zambales',
    churchType: 'Established Church Location',
    shortDescription: 'Confirmed church location serving Subic, Zambales and surrounding communities.',
    description: [
      'Church of God – Subic serves as our established ministry center and sanctuary for families across Subic, Zambales. Rooted in passionate worship, biblical preaching, discipleship, and intentional community outreach, our local ministry seeks to exalt Jesus Christ and make disciples throughout Zambales.',
      'We welcome you to join our corporate worship celebrations, youth gatherings, and prayer fellowships at our Subic sanctuary.'
    ],
    address: {
      street: 'AYC Compound Rd',
      city: 'Subic',
      municipality: 'Subic',
      province: 'Zambales',
      landmark: 'At the back of Jollibee Sto. Tomas, Subic',
      locationNote: 'V723+GFH, AYC Compound Rd, Subic, Zambales',
      formattedAddress: 'V723+GFH, AYC Compound Rd, Subic, Zambales (At the back of Jollibee Sto. Tomas)',
      status: 'published',
      meta: {
        status: 'published',
        verifiedAt: '2026-08',
        notes: 'Confirmed location with Google Plus Code V723+GFH.'
      }
    },
    contact: {
      phone: '0966 266 7012',
      email: 'cogsubic@gmail.com',
      officeHours: 'Tuesday to Sunday: 9:00 AM – 5:00 PM',
      status: 'published',
      meta: {
        status: 'published',
        verifiedAt: '2026-08'
      }
    },
    leadership: {
      name: 'Pastoral Office',
      role: 'Senior Pastoral Leadership',
      title: 'Church of God Subic Ministry',
      bio: 'Leading the Church of God Subic family in spiritual renewal, biblical integrity, and disciple-making across Zambales.',
      imageUrl: assetMap.pastor?.url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600',
      status: 'published'
    },
    services: [
      {
        id: 'srv-subic-1',
        day: 'Sunday',
        time: '9:30 AM • 4:00 PM • 6:00 PM',
        name: 'Sunday Worship Celebration',
        language: 'Tagalog / English',
        description: 'Confirmed Sunday worship services celebrating Christ with vibrant praise and biblical preaching.',
        status: 'published',
        meta: {
          status: 'published',
          verifiedAt: '2026-08',
          notes: 'Confirmed Sunday service times: 9:30 AM, 4:00 PM, and 6:00 PM.'
        }
      },
      {
        id: 'srv-subic-2',
        day: 'Wednesday',
        time: '6:30 PM',
        name: 'Wednesday Midweek Service',
        language: 'Tagalog / English',
        description: 'Confirmed corporate prayer, worship, and Bible study.',
        status: 'published',
        meta: {
          status: 'published',
          verifiedAt: '2026-08',
          notes: 'Confirmed Midweek service at 6:30 PM.'
        }
      }
    ],
    ministries: [
      {
        id: 'min-subic-1',
        name: 'Worship & Creative Arts',
        summary: 'Exalting Jesus through music, audio/visual media, and creative arts.',
        status: 'published'
      },
      {
        id: 'min-subic-2',
        name: 'NextGen Youth & Campus Ministry',
        summary: 'Equipping students and young adults for Christian leadership.',
        status: 'published'
      },
      {
        id: 'min-subic-3',
        name: 'Children’s Church & Discipleship',
        summary: 'Nurturing children in God’s Word with love and joy.',
        status: 'published'
      },
      {
        id: 'min-subic-4',
        name: 'Community & Missions Outreach',
        summary: 'Serving vulnerable families across Subic through relief and evangelism.',
        status: 'published'
      }
    ],
    socialLinks: {
      facebook: 'https://www.facebook.com/COGSUBIC',
      youtube: 'https://www.youtube.com/@COGWMPSubic',
      youtubeTitle: 'Church of God World Missions Subic',
      instagram: 'https://www.instagram.com/__cogsubic',
      status: 'published'
    },
    location: {
      lat: 14.8876,
      lng: 120.2319,
      addressText: 'AYC Compound Rd, Subic, Zambales (Behind Jollibee Sto. Tomas)',
      googleMapsUrl: 'https://maps.app.goo.gl/PcfTBRQX8tkZzFkQ7',
      directionsUrl: 'https://maps.app.goo.gl/PcfTBRQX8tkZzFkQ7',
      status: 'published'
    },
    canonicalMapUrl: 'https://maps.app.goo.gl/PcfTBRQX8tkZzFkQ7',
    images: {
      heroImage: {
        url: assetMap.churchSubic?.url || 'https://images.unsplash.com/photo-1438032005730-c779502df39b?auto=format&fit=crop&q=80&w=1200',
        alt: 'Church of God Subic Sanctuary',
        caption: 'Church of God Subic Sanctuary',
        status: 'published'
      },
      thumbnailImage: {
        url: assetMap.churchSubic?.url || 'https://images.unsplash.com/photo-1438032005730-c779502df39b?auto=format&fit=crop&q=80&w=800',
        alt: 'Church of God Subic thumbnail',
        status: 'published'
      }
    },
    featured: true,
    isMainBranch: true,
    displayOrder: 1,
    status: 'published'
  },
  {
    id: 'cog-olongapo',
    slug: 'church-of-god-olongapo',
    name: 'Church of God – Olongapo',
    shortName: 'COG Olongapo',
    city: 'Olongapo City',
    municipality: 'Olongapo',
    province: 'Zambales',
    churchType: 'Established Church Location',
    shortDescription: 'Confirmed church location serving families and residents of Olongapo City.',
    description: [
      'Church of God – Olongapo is a confirmed church location dedicated to preaching the gospel and providing a spiritual family for believers across Olongapo City.',
      'Located on Magsaysay Drive in the heart of Olongapo, this congregation brings lively worship, community outreach, and compassionate ministry to the city.'
    ],
    address: {
      street: '#13 Magsaysay Drive',
      city: 'Olongapo City',
      municipality: 'Olongapo',
      province: 'Zambales',
      postalCode: '2200',
      formattedAddress: '#13 Magsaysay Drive, Olongapo, Philippines, 2200',
      status: 'published',
      meta: {
        status: 'published',
        verifiedAt: '2026-08',
        notes: 'Confirmed location on Magsaysay Drive.'
      }
    },
    contact: {
      email: 'churchofgodolongapo@gmail.com',
      status: 'published',
      meta: {
        status: 'published',
        verifiedAt: '2026-08'
      }
    },
    leadership: {
      name: 'Pastoral Office',
      role: 'Pastoral Leadership',
      title: 'Church of God Olongapo',
      bio: 'Shepherding the Church of God Olongapo congregation in faithful discipleship and worship.',
      imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600',
      status: 'published'
    },
    services: [
      {
        id: 'srv-olongapo-1',
        day: 'Sunday',
        time: 'Schedule Pending Verification',
        name: 'Sunday Worship Service',
        language: 'Tagalog / English',
        description: 'Corporate worship gathering and biblical exposition.',
        status: 'pending_verification'
      }
    ],
    ministries: [
      {
        id: 'min-olongapo-1',
        name: 'Family & Life Groups',
        summary: 'Small group home fellowships across Olongapo City.',
        status: 'published'
      }
    ],
    socialLinks: {
      facebook: 'https://www.facebook.com/cogolongapoofficial/',
      youtube: 'https://www.youtube.com/@coggapotv',
      instagram: 'https://www.instagram.com/cogolongapo',
      status: 'published'
    },
    location: {
      lat: 14.8315,
      lng: 120.2828,
      addressText: '#13 Magsaysay Drive, Olongapo, Philippines, 2200',
      googleMapsUrl: 'https://maps.app.goo.gl/bsUheAgNfXtvSd2b7',
      directionsUrl: 'https://maps.app.goo.gl/bsUheAgNfXtvSd2b7',
      status: 'published'
    },
    canonicalMapUrl: 'https://maps.app.goo.gl/bsUheAgNfXtvSd2b7',
    images: {
      heroImage: {
        url: assetMap.churchOlongapo?.url || 'https://images.unsplash.com/photo-1548625361-18080f531303?auto=format&fit=crop&q=80&w=1200',
        alt: 'Church of God Olongapo location banner',
        caption: 'Church of God Olongapo',
        status: 'published'
      },
      thumbnailImage: {
        url: assetMap.churchOlongapo?.url || 'https://images.unsplash.com/photo-1548625361-18080f531303?auto=format&fit=crop&q=80&w=800',
        alt: 'Church of God Olongapo thumbnail',
        status: 'published'
      }
    },
    featured: true,
    isMainBranch: false,
    displayOrder: 2,
    status: 'published'
  },
  {
    id: 'cog-castillejos',
    slug: 'church-of-god-castillejos',
    name: 'Church of God – Castillejos',
    shortName: 'COG Castillejos',
    city: 'Castillejos',
    municipality: 'Castillejos',
    province: 'Zambales',
    churchType: 'Established Church Location',
    shortDescription: 'Confirmed church location located along National Road, Barangay San Juan in Castillejos.',
    description: [
      'Church of God – Castillejos is a confirmed church location serving the municipality of Castillejos, Zambales with biblical preaching, warm fellowship, and active prayer ministry.',
      'Located on the 3rd Floor of the Barbadillo Building along National Road in Brgy. San Juan (directly in front of the CASTILLEJOS AKO sign), this church is a beacon of hope for local families.'
    ],
    address: {
      street: 'Barbadillo Building, 3rd Floor, National Road, Barangay San Juan',
      city: 'Castillejos',
      municipality: 'Castillejos',
      province: 'Zambales',
      postalCode: '2208',
      landmark: 'In front of the "CASTILLEJOS AKO" sign',
      locationNote: 'Barbadillo Building, 3rd Floor, National Road, Brgy. San Juan (In front of CASTILLEJOS AKO sign)',
      formattedAddress: 'Barbadillo Building, 3rd Floor, National Road, Barangay San Juan, Castillejos, Zambales 2208 (In front of CASTILLEJOS AKO sign)',
      status: 'published',
      meta: {
        status: 'published',
        verifiedAt: '2026-08',
        notes: 'Confirmed location at Barbadillo Building 3rd Floor, Brgy. San Juan.'
      }
    },
    contact: {
      phone: '0930 444 6359',
      email: 'castillejoscog@gmail.com',
      status: 'published',
      meta: {
        status: 'published',
        verifiedAt: '2026-08'
      }
    },
    leadership: {
      name: 'Pastoral Office',
      role: 'Resident Pastor / Ministry Leader',
      title: 'Church of God Castillejos',
      bio: 'Leading the Castillejos congregation in discipleship, evangelism, and community prayer.',
      imageUrl: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&q=80&w=600',
      status: 'published'
    },
    services: [
      {
        id: 'srv-castillejos-1',
        day: 'Sunday',
        time: 'Schedule Pending Verification',
        name: 'Sunday Worship Service',
        language: 'Tagalog / English',
        description: 'Sunday morning worship and preaching service.',
        status: 'pending_verification'
      }
    ],
    ministries: [
      {
        id: 'min-castillejos-1',
        name: 'Castillejos Outreach & Fellowship',
        summary: 'Bible studies, life groups, and community blessing projects.',
        status: 'published'
      }
    ],
    socialLinks: {
      facebook: 'https://www.facebook.com/profile.php?id=61589932525655',
      status: 'published'
    },
    location: {
      lat: 14.9312,
      lng: 120.1989,
      addressText: 'Barbadillo Building, 3rd Floor, National Road, Barangay San Juan, Castillejos, Zambales 2208',
      googleMapsUrl: 'https://maps.app.goo.gl/AHjvn1vF8gdhJwVF9',
      directionsUrl: 'https://maps.app.goo.gl/AHjvn1vF8gdhJwVF9',
      status: 'published'
    },
    canonicalMapUrl: 'https://maps.app.goo.gl/AHjvn1vF8gdhJwVF9',
    images: {
      heroImage: {
        url: assetMap.churchCastillejos?.url || 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&q=80&w=1200',
        alt: 'Church of God Castillejos location banner',
        caption: 'Church of God Castillejos',
        status: 'published'
      },
      thumbnailImage: {
        url: assetMap.churchCastillejos?.url || 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&q=80&w=800',
        alt: 'Church of God Castillejos thumbnail',
        status: 'published'
      }
    },
    featured: true,
    isMainBranch: false,
    displayOrder: 3,
    status: 'published'
  },
  {
    id: 'cog-san-marcelino',
    slug: 'church-of-god-san-marcelino-vision',
    name: 'San Marcelino (Born Again Zambales Vision Area)',
    shortName: 'San Marcelino Vision',
    city: 'San Marcelino',
    municipality: 'San Marcelino',
    province: 'Zambales',
    churchType: 'Vision Area',
    isVisionArea: true,
    shortDescription: 'Target municipality for church planting and gospel mobilization under the Born Again Zambales vision.',
    description: [
      'San Marcelino is a designated focus municipality under the Church of God – Born Again Zambales vision to bring the transformative message of Jesus Christ to every town in the province.',
      'No established physical church building exists at this location yet. Outreaches, bible studies, and prayer networks are in planning stages.'
    ],
    address: {
      city: 'San Marcelino',
      municipality: 'San Marcelino',
      province: 'Zambales',
      formattedAddress: 'San Marcelino, Zambales (Target Vision Area — No Physical Church Building Yet)',
      status: 'pending_verification',
      meta: {
        status: 'pending_verification',
        notes: 'Target vision area for church planting. No physical address has been established.'
      }
    },
    contact: {
      email: 'cogsubic@gmail.com',
      officeHours: 'Coordination via Subic Church Office',
      status: 'pending_verification',
      meta: {
        status: 'pending_verification',
        notes: 'Outreach inquiries coordinated through Church of God Subic.'
      }
    },
    leadership: {
      name: 'Missions & Church Planting Committee',
      role: 'Outreach & Vision Coordination',
      status: 'pending_verification'
    },
    services: [],
    ministries: [],
    socialLinks: {
      status: 'pending_verification'
    },
    location: null,
    images: {
      heroImage: {
        url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=1200',
        alt: 'San Marcelino Vision Area scenery',
        caption: 'Born Again Zambales — San Marcelino Mission Field',
        status: 'pending_verification'
      },
      thumbnailImage: {
        url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=800',
        alt: 'San Marcelino thumbnail',
        status: 'pending_verification'
      }
    },
    featured: false,
    isMainBranch: false,
    displayOrder: 4,
    status: 'pending_verification',
    meta: {
      status: 'pending_verification',
      notes: 'Born Again Zambales Vision Area. Future church plant initiative.'
    }
  },
  {
    id: 'cog-iba',
    slug: 'church-of-god-iba-vision',
    name: 'Iba (Born Again Zambales Vision Area)',
    shortName: 'Iba Vision',
    city: 'Iba',
    municipality: 'Iba',
    province: 'Zambales',
    churchType: 'Vision Area',
    isVisionArea: true,
    shortDescription: 'Provincial capital vision area targeted for future church plant and apostolic outreach.',
    description: [
      'Iba, the provincial capital of Zambales, is a strategic vision area in our prayers and expansion vision to see every municipality touched by the gospel of Jesus Christ.',
      'No established physical church building exists at this location yet. Ministry initiatives and community connections are being actively explored.'
    ],
    address: {
      city: 'Iba',
      municipality: 'Iba',
      province: 'Zambales',
      formattedAddress: 'Iba, Zambales (Target Vision Area — No Physical Church Building Yet)',
      status: 'pending_verification',
      meta: {
        status: 'pending_verification',
        notes: 'Target vision area for future church plant.'
      }
    },
    contact: {
      email: 'cogsubic@gmail.com',
      officeHours: 'Coordination via Subic Church Office',
      status: 'pending_verification'
    },
    leadership: {
      name: 'Missions & Church Planting Committee',
      role: 'Outreach & Vision Coordination',
      status: 'pending_verification'
    },
    services: [],
    ministries: [],
    socialLinks: {
      status: 'pending_verification'
    },
    location: null,
    images: {
      heroImage: {
        url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200',
        alt: 'Iba Zambales scenery',
        caption: 'Born Again Zambales — Iba Mission Field',
        status: 'pending_verification'
      },
      thumbnailImage: {
        url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800',
        alt: 'Iba thumbnail',
        status: 'pending_verification'
      }
    },
    featured: false,
    isMainBranch: false,
    displayOrder: 5,
    status: 'pending_verification',
    meta: {
      status: 'pending_verification',
      notes: 'Born Again Zambales Vision Area. Future church plant initiative.'
    }
  }
];

export const churchesPageData: ChurchPageData = {
  hero: {
    title: 'OUR CHURCHES',
    goldSubtitle: 'A HOUSE OF PRAYER FOR ALL NATIONS',
    subtitle: 'One church family. Multiple places. One mission.',
    bgImage: assetMap.churchSubic?.url || 'https://images.unsplash.com/photo-1438032005730-c779502df39b?auto=format&fit=crop&q=80&w=2000',
    imageAlt: 'Church of God Subic family gathering',
    status: 'pending_verification',
    meta: {
      status: 'pending_verification',
      notes: 'Church directory records awaiting final verification from church administration.'
    }
  },
  churches: churchLocationsData,
  seo: {
    title: 'Our Churches | Church of God – Subic',
    description: 'Explore Church of God worship locations across Subic, Olongapo, Castillejos, San Marcelino, and Iba, Zambales.'
  }
};

export const sermonsData: Sermon[] = [
  {
    id: 'sermon-1',
    title: 'The Unshakable Kingdom',
    slug: 'the-unshakable-kingdom',
    speaker: 'Bishop Mark Anthony',
    speakerRole: 'Senior Pastor',
    date: 'August 3, 2026',
    videoUrl: 'https://www.youtube.com/embed/I7vProFJi7o',
    thumbnailUrl: assetMap.sermonFeatured.url,
    scripture: { reference: 'Hebrews 12:28-29' },
    series: 'Kingdom First',
    description: 'In times of worldly shaking, God invites us to receive a kingdom that cannot be moved. Discover how anchoring your heart in divine promise brings courage and clarity in every season.',
    duration: '48 mins',
    featured: true,
  },
  {
    id: 'sermon-2',
    title: 'Walking in Abundant Grace',
    slug: 'walking-in-abundant-grace',
    speaker: 'Pastor Joseph Santos',
    speakerRole: 'Executive Pastor',
    date: 'July 27, 2026',
    videoUrl: 'https://www.youtube.com/embed/I7vProFJi7o',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&q=80&w=800',
    scripture: { reference: 'Ephesians 2:8-10' },
    series: 'Grace Unlocked',
    description: 'Grace is not just a pardon for past mistakes—it is the living power of God enabling us to live a rich, purpose-filled life today.',
    duration: '42 mins',
  },
  {
    id: 'sermon-3',
    title: 'The Power of United Prayer',
    slug: 'the-power-of-united-prayer',
    speaker: 'Pastor Sarah Reyes',
    speakerRole: 'Discipleship Pastor',
    date: 'July 20, 2026',
    videoUrl: 'https://www.youtube.com/embed/I7vProFJi7o',
    thumbnailUrl: 'https://images.unsplash.com/photo-1445445290350-18a3b86e0b5b?auto=format&fit=crop&q=80&w=800',
    scripture: { reference: 'Acts 4:31' },
    series: 'Atmosphere of Faith',
    description: 'When believers unite with one voice in fervent prayer, room-shaking breakthroughs happen and the Holy Spirit empowers bold witness.',
    duration: '51 mins',
  },
  {
    id: 'sermon-4',
    title: 'Stewarding Your God-Given Assignment',
    slug: 'stewarding-your-assignment',
    speaker: 'Bishop Mark Anthony',
    speakerRole: 'Senior Pastor',
    date: 'July 13, 2026',
    videoUrl: 'https://www.youtube.com/embed/I7vProFJi7o',
    thumbnailUrl: 'https://images.unsplash.com/photo-1455849318743-b2233052fcff?auto=format&fit=crop&q=80&w=800',
    scripture: { reference: 'Matthew 25:14-30' },
    series: 'Kingdom First',
    description: 'Every gift, moment, and opportunity is a trust given by the Master. Learn how faithful stewardship unlocks unexpected kingdom multiplication.',
    duration: '45 mins',
  },
];

export const eventsData: EventItem[] = [
  {
    id: 'event-1',
    title: 'Harvest Night Worship & Prayer Rally',
    slug: 'harvest-night-worship',
    date: 'August 15, 2026',
    time: '6:30 PM - 9:00 PM',
    location: { name: 'Subic Main Sanctuary' },
    description: 'An evening of passionate worship, prophetic intercession, and personal ministry for spiritual empowerment.',
    category: 'Worship',
    imageUrl: assetMap.worshipMinistry.url,
    registrationOpen: true,
    featured: true,
  },
  {
    id: 'event-2',
    title: 'Youth Ignition Conference 2026',
    slug: 'youth-ignition-2026',
    date: 'August 22-23, 2026',
    time: '9:00 AM - 5:00 PM',
    location: { name: 'Subic Civic Center & COG Campus' },
    description: 'Empowering the next generation to stand bold in faith, build Godly friendships, and discover their divine calling.',
    category: 'Youth',
    imageUrl: assetMap.youthMinistry.url,
    registrationOpen: true,
    featured: true,
  },
  {
    id: 'event-3',
    title: 'Medical & Dental Compassion Mission',
    slug: 'medical-dental-mission',
    date: 'September 5, 2026',
    time: '7:30 AM - 2:00 PM',
    location: { name: 'Barangay Calapacuan Covered Court' },
    description: 'Serving over 500 local families with free medical consultation, dental care, medicines, and gospel love.',
    category: 'Outreach',
    imageUrl: assetMap.outreachMinistry.url,
    registrationOpen: true,
    featured: true,
  },
  {
    id: 'event-4',
    title: 'Kingdom Couples Weekend Retreat',
    slug: 'kingdom-couples-retreat',
    date: 'September 18-19, 2026',
    time: 'All Day Event',
    location: { name: 'Anvaya Cove Resort Subic' },
    description: 'Strengthening marital intimacy, spiritual unity, and practical communication in a beautiful, restful setting.',
    category: 'Family',
    imageUrl: assetMap.couplesMinistry.url,
    registrationOpen: true,
  },
];

export const ministriesData: Ministry[] = [
  {
    id: 'min-1',
    name: 'Worship & Creative Arts',
    slug: 'worship-creative-arts',
    tagline: 'Exalting Jesus through authentic praise, music, and media.',
    description: 'Our Worship & Creative Arts team cultivates a reverent, joyful atmosphere where congregation members encounter God’s presence through music, vocals, lighting, sound, and visual arts.',
    leader: { name: 'Bro. David Ramos', position: 'Worship Director' },
    leaderRole: 'Worship Director',
    meetingTime: 'Thursdays at 6:30 PM',
    iconName: 'Music',
    imageUrl: assetMap.worshipMinistry.url,
    highlights: ['Band & Vocal Rehearsals', 'Audio/Visual Engineering', 'Creative Stage Design', 'Songwriting Workshops'],
    featured: true,
  },
  {
    id: 'min-2',
    name: 'Ignite Youth & Campus',
    slug: 'ignite-youth',
    tagline: 'Raising a vibrant, unashamed generation for Christ.',
    description: 'Ignite Youth equips high school and college students to navigate youth culture with biblical conviction, authentic fellowship, and high-impact campus outreach.',
    leader: { name: 'Pastor Jonathan Cruz', position: 'Youth Pastor' },
    leaderRole: 'Youth Pastor',
    meetingTime: 'Fridays at 6:30 PM',
    iconName: 'Flame',
    imageUrl: assetMap.youthMinistry.url,
    highlights: ['Weekly Youth Services', 'Campus Life Clubs', 'Summer Camps', 'Peer Mentorship'],
    featured: true,
  },
  {
    id: 'min-3',
    name: 'Kingdom Kids Ministry',
    slug: 'kingdom-kids',
    tagline: 'Nurturing young hearts to know, love, and follow Jesus.',
    description: 'Kingdom Kids provides a safe, fun, and age-appropriate environment where children from toddlers to age 12 experience Bible lessons, interactive games, and memorable worship.',
    leader: { name: 'Sis. Elena Morales', position: 'Children’s Ministry Lead' },
    leaderRole: 'Children’s Ministry Lead',
    meetingTime: 'Sundays during Service Times',
    iconName: 'HeartHandshake',
    imageUrl: assetMap.childrenMinistry.url,
    highlights: ['Nursery & Toddler Care', 'Interactive Sunday School', 'Vacation Bible School', 'Kid Worship Team'],
    featured: true,
  },
  {
    id: 'min-4',
    name: 'Harvest Community Outreach',
    slug: 'community-outreach',
    tagline: 'Demonstrating Christ’s love through hands-on service.',
    description: 'We go beyond church walls to feed the hungry, support local families in need, conduct disaster relief, and host medical mission clinics across Zambales.',
    leader: { name: 'Bro. Robert Dela Cruz', position: 'Outreach Coordinator' },
    leaderRole: 'Outreach Coordinator',
    meetingTime: 'Saturdays at 8:00 AM',
    iconName: 'Globe',
    imageUrl: assetMap.outreachMinistry.url,
    highlights: ['Weekly Feeding Program', 'Disaster Relief Response', 'Prison Ministry', 'Medical Missions'],
    featured: true,
  },
  {
    id: 'min-5',
    name: 'Life Groups & Discipleship',
    slug: 'life-groups',
    tagline: 'Doing life together in authentic Christian community.',
    description: 'Life Groups are small home gatherings across Subic and neighboring towns where believers study the Word, pray for one another, and build lifelong friendships.',
    leader: { name: 'Pastor Sarah Reyes', position: 'Discipleship Pastor' },
    leaderRole: 'Discipleship Pastor',
    meetingTime: 'Various Days & Homes',
    iconName: 'Users',
    imageUrl: assetMap.discipleshipMinistry.url,
    highlights: ['Home Bible Studies', 'Men’s & Women’s Fellowships', 'Discipleship Pathways', 'New Believers Class'],
    featured: true,
  },
  {
    id: 'min-6',
    name: 'Couples & Family Life',
    slug: 'couples-family',
    tagline: 'Building strong Christ-centered homes and marriages.',
    description: 'Helping husbands, wives, and parents establish Godly foundations in their homes through seminars, romantic date nights, and parenting workshops.',
    leader: { name: 'Deacon Mark & Maria Garcia', position: 'Family Ministry Directors' },
    leaderRole: 'Family Ministry Directors',
    meetingTime: 'Monthly 3rd Saturday',
    iconName: 'Heart',
    imageUrl: assetMap.couplesMinistry.url,
    highlights: ['Marriage Seminars', 'Parenting Classes', 'Couples Date Nights', 'Family Counseling Support'],
    featured: true,
  },
];

export const statisticsData: ImpactStatistic[] = [
  {
    id: 'stat-1',
    value: '1,250+',
    label: 'ACTIVE WORSHIPPERS',
    description: 'Gathering weekly across our worship services in Zambales',
    iconName: 'Users',
  },
  {
    id: 'stat-2',
    value: '20+',
    label: 'MINISTRY TEAMS',
    description: 'Empowering believers to serve according to their spiritual gifts',
    iconName: 'HeartHandshake',
  },
  {
    id: 'stat-3',
    value: '25+',
    label: 'YEARS OF FAITHFULNESS',
    description: 'Proclaiming the gospel and transforming communities in Subic',
    iconName: 'Award',
  },
  {
    id: 'stat-4',
    value: '5',
    label: 'CHURCH LOCATIONS',
    description: 'Expanding kingdom reach across Zambales province',
    iconName: 'MapPin',
  },
];

export const leadersData: Leader[] = [
  {
    id: 'leader-1',
    name: 'Bishop Mark Anthony',
    title: 'Senior Pastor',
    role: 'Primary Preacher & Visionary Leader',
    bio: 'Serving in ministry for over 25 years with a passion for expository preaching, pastoral care, and kingdom expansion across Luzon.',
    imageUrl: assetMap.pastor.url,
    email: 'bishop.mark@cogsubic.org',
  },
  {
    id: 'leader-2',
    name: 'Pastor Joseph Santos',
    title: 'Executive Pastor',
    role: 'Operations & Ministries Overseer',
    bio: 'Dedicated to organizational excellence, discipleship structure, and equipping local campus ministry leaders.',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800',
    email: 'pastor.joseph@cogsubic.org',
  },
  {
    id: 'leader-3',
    name: 'Pastor Sarah Reyes',
    title: 'Discipleship Pastor',
    role: 'Life Groups & Prayer Coordinator',
    bio: 'Passionate about intercessory prayer, women’s ministry, and developing structured discipleship pathways for new believers.',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800',
    email: 'pastor.sarah@cogsubic.org',
  },
];

export const initialPrayerRequests: PrayerRequest[] = [
  {
    id: 'pr-1',
    name: 'Maria Theresa',
    request: 'Praying for complete physical healing for my mother undergoing surgery this Friday, and for peace for our family.',
    date: '2 hours ago',
    isAnonymous: false,
    prayerCount: 14,
  },
  {
    id: 'pr-2',
    name: 'Anonymous Brother',
    request: 'Asking for God’s wisdom and open doors regarding my job search and financial provision for my household.',
    date: '5 hours ago',
    isAnonymous: true,
    prayerCount: 28,
  },
  {
    id: 'pr-3',
    name: 'Grace Family',
    request: 'Praising God for restoration in our marriage! Thank you church family for standing with us in prayer.',
    date: '1 day ago',
    isAnonymous: false,
    prayerCount: 42,
  },
];
