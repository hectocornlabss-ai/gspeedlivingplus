import React, { createContext, useContext, useState, useEffect } from 'react';

// Translation dictionaries for Thai (th), English (en), and Chinese (zh)
export const translations = {
  th: {
    langName: 'ไทย',
    langCode: 'th',
    flag: '🇹🇭',
    nav: {
      home: 'หน้าแรก',
      tournaments: 'ทัวร์นาเมนต์',
      activities: 'ภาพกิจกรรม',
      company: 'เกี่ยวกับเรา',
      contact: 'ติดต่อเรา',
      franchise: 'แฟรนไชส์ 3D',
      cta: 'สนใจเปิดร้าน',
      menu: 'เมนู',
      close: 'ปิด',
      admin: 'ระบบจัดการ CMS'
    },
    hero: {
      tag: 'GLP ESPORTS • ความสนุกสุดมันส์ ตลอด 24 ชม.',
      title: 'GLP ESPORT STADIUM MEETING\nศูนย์รวมกิจกรรม & ทัวร์นาเมนต์ระดับประเทศ',
      subtitle: 'สมรภูมิประลองเกมอันดับ 1 ของเกมเมอร์ชาวไทย เวทีแข่งขันมาตรฐานสากล รองรับทัวร์นาเมนต์ LAN ทุกเกม พร้อมโซนซ้อมสตรีมเมอร์ และบริการจัดกิจกรรมสำหรับค่ายเกมชั้นนำ',
      btn1: 'สนใจจัดงาน',
      btn2: 'ดูกิจกรรม',
      btn3: 'ทัวร์นาเมนต์',
      btn4: 'ติดต่อเปิดร้านเกม',
      metrics: [
        { number: '750+', label: 'Battle Stations ทั่วประเทศ' },
        { number: '360Hz', label: 'Fast-IPS & OLED Displays' },
        { number: '10Gbps', label: 'Dedicated Multi-WAN Ping < 3ms' },
        { number: '24/7', label: 'เปิดบริการตลอด 24 ชั่วโมง' }
      ]
    },
    common: {
      viewDetails: 'ดูรายละเอียด',
      readMore: 'อ่านต่อ',
      back: 'ย้อนกลับ',
      share: 'แชร์',
      copyLink: 'คัดลอกลิงก์',
      copied: 'คัดลอกแล้ว!',
      prizePool: 'รางวัลรวม',
      date: 'วันที่',
      location: 'สถานที่',
      game: 'เกม',
      status: 'สถานะ',
      open: 'เปิดรับสมัคร',
      ongoing: 'กำลังแข่งขัน',
      completed: 'เสร็จสิ้น',
      all: 'ทั้งหมด',
      search: 'ค้นหา...',
      category: 'หมวดหมู่',
      tags: 'แท็กที่เกี่ยวข้อง',
      rules: 'กติกาการแข่งขัน',
      schedule: 'กำหนดการ',
      bracket: 'สายการแข่งขัน',
      teams: 'ทีมที่เข้าร่วม',
      gallery: 'ภาพบรรยากาศ',
      registerTeam: 'สมัครแข่งขัน',
      hotline: 'สายด่วนเปิดแฟรนไชส์',
      callNow: 'โทรเลย',
      photosCount: 'รูปภาพ',
      teamsCount: 'ทีม',
      readTime: 'เวลาอ่าน',
      partner: 'พาร์ตเนอร์',
      organizer: 'ผู้จัดงาน',
      overview: 'ภาพรวม',
      loading: 'กำลังโหลดข้อมูลระบบ...',
      offline: 'ออฟไลน์',
      online: 'ออนไลน์',
      viewAll: 'ดูทั้งหมด'
    },
    home: {
      searchPlaceholder: 'ค้นหากิจกรรม, ทัวร์นาเมนต์, เกม หรือรางวัล...',
      hotlineLabel: 'สายด่วนติดต่อขอจัดงานแข่ง Esport:',
      featureEvents: {
        badge: 'GLP OUR EVENTS',
        title: 'รวมภาพกิจกรรม & บรรยากาศสด',
        desc: 'ภาพงานแข่ง LAN, งานเปิดตัวเกม, มีตติ้ง และพิธีมอบรางวัลชนะเลิศตลอดทั้งปี',
        link: 'เข้าสู่หน้ารวมภาพกิจกรรม & แกลเลอรี'
      },
      featureTournaments: {
        badge: 'GLP TOURNAMENTS',
        title: 'ปฏิทินแข่ง & ชิงรางวัล LAN',
        desc: 'เกาะติดผลการแข่งขัน สายแข่งสด (Brackets) และลงทะเบียนประลองฝีมือระดับประเทศ',
        link: 'เข้าสู่ปฏิทินการแข่งขันทั้งหมด'
      },
      zones: {
        badge: 'VENUE ATMOSPHERE & ZONES',
        title: 'บรรยากาศร้านและโซนที่เปิดให้บริการ',
        subtitle: 'สำรวจพื้นที่และสิ่งอำนวยความสะดวกระดับพรีเมียม ตอบโจทย์ทั้งการแข่งขันและการพักผ่อน',
        rateLabel: 'อัตราค่าบริการ:',
        specsLabel: 'สเปกอุปกรณ์:',
        galleryCounter: 'รูปภาพ'
      },
      latestTournaments: {
        badge: 'GLP ESPORTS CALENDAR',
        title: 'ปฏิทินการแข่งขัน อีสปอร์ตประจำเดือน',
        viewAllBtn: 'ดูทั้งหมด'
      },
      latestActivities: {
        badge: 'PHOTO & COMMUNITY HIGHLIGHTS',
        title: 'ภาพกิจกรรม & บรรยากาศความมันส์',
        viewAllBtn: 'ดูทั้งหมด'
      },
      partners: {
        badge: 'ECOSYSTEM & SPONSORS',
        title: 'ผู้สนับสนุนและพันธมิตรระดับโลก'
      }
    },
    chat: {
      triggerSubtitle: 'G-SPEED ARENA',
      triggerLabel: 'สอบถามข้อมูล / แชทกับเจ้าหน้าที่',
      cardTitle: 'ศูนย์บริการข้อมูลลูกค้า • G-SPEED ARENA',
      statusOnline: 'Online • สอบถามข้อมูล & บริการร้าน 24 ชม.',
      inputPlaceholder: 'สอบถามเวลาทำการ, ที่ตั้งร้าน, จัดแข่ง, หรือติดตั้งระบบ...',
      sendBtn: 'ส่งข้อความ'
    },
    tournamentsPage: {
      badge: 'GLP ESPORTS TOURNAMENTS',
      title: 'ทัวร์นาเมนต์ & การแข่งขันอีสปอร์ต',
      subtitle: 'ปฏิทินการแข่งขันระดับประเทศ ชิงเงินรางวัลรวมกว่าหลายแสนบาท ถ่ายทอดสดบนเวที Main Stage 4K',
      searchPlaceholder: 'ค้นหาชื่อทัวร์นาเมนต์, เกม หรือรางวัล...',
      filterGame: 'กรองตามเกม',
      allGames: 'ทุกเกม',
      registeredTeams: 'ทีมที่ลงทะเบียน',
      rulesTitle: 'ระเบียบและกติกาการแข่งขัน',
      bracketTitle: 'ตารางสายการแข่งขัน (Tournament Bracket)',
      prizesTitle: 'โครงสร้างการแบ่งเงินรางวัล (Prize Distribution)',
      scheduleTitle: 'กำหนดการแข่งขัน (Timetable)'
    },
    activitiesPage: {
      badge: 'GLP PHOTO & COMMUNITY GALLERY',
      title: 'ภาพกิจกรรม & ข่าวสารบทความ',
      subtitle: 'ประมวลภาพบรรยากาศการแข่งขัน อีเวนต์ค่ายเกม และคอมมูนิตี้เกมเมอร์ ณ GLP Arena',
      searchPlaceholder: 'ค้นหาชื่อกิจกรรม, พาร์ตเนอร์ หรือแฮชแท็ก...',
      filterCategory: 'หมวดหมู่กิจกรรม',
      filterTag: 'แท็กยอดนิยม',
      allCategories: 'ทุกหมวดหมู่',
      allTags: 'ทุกแท็ก'
    },
    franchisePage: {
      badge: '3D INTERIOR PLANNER & STUDIO',
      title: 'จำลองผังร้านและประเมินราคาแฟรนไชส์',
      subtitle: 'จัดวางโต๊ะคอมพิวเตอร์ เวทีแข่งขัน เคาน์เตอร์ และระบบตกแต่ง พร้อมคำนวณงบประมาณและสเปกเครื่องอัตโนมัติ',
      step1: '1. กำหนดขนาดร้าน',
      step2: '2. จัดวางผัง 2D/3D',
      step3: '3. เลือกสเปกคอม',
      step4: '4. สรุปงบและขอใบเสนอราคา'
    },
    contactPage: {
      badge: 'GET IN TOUCH WITH GLP',
      title: 'ติดต่อศูนย์ GLP : G Speed Living Plus',
      subtitle: 'รามคำแหง 53 แขวงพลับพลา เขตวังทองหลาง กรุงเทพฯ เปิดบริการตลอด 24 ชั่วโมง',
      formTitle: 'ส่งข้อความติดต่อสอบถาม',
      formName: 'ชื่อ-นามสกุล',
      formPhone: 'เบอร์โทรศัพท์ติดต่อ',
      formEmail: 'อีเมล (ถ้ามี)',
      formSubject: 'หัวข้อการติดต่อ',
      formMessage: 'รายละเอียดข้อความ',
      sendBtn: 'ส่งข้อความติดต่อ',
      hours: 'เวลาทำการ',
      hours24: 'เปิดให้บริการตลอด 24 ชั่วโมง ทุกวัน',
      address: 'ที่อยู่ศูนย์บริการ'
    },
    footer: {
      tagline: 'ศูนย์กีฬาอีสปอร์ตและร้านอินเทอร์เน็ตคาเฟ่มาตรฐานสากล บริหารงานโดย GLP Living Plus Group พร้อมระบบโซลูชันแฟรนไชส์อัจฉริยะ',
      quickLinks: 'ลิงก์ด่วน',
      services: 'บริการหลัก',
      contactInfo: 'ข้อมูลติดต่อ',
      rights: 'GLP : G Speed Living Plus. สงวนลิขสิทธิ์ทั้งหมด.'
    },
    companyPage: {
      badge: 'LEADERSHIP & CORPORATE PROFILE',
      title: 'วิสัยทัศน์ผู้บริหาร & ประวัติองค์กร G-SPEED',
      subtitle: 'มุ่งมั่นขับเคลื่อนอุตสาหกรรมอีสปอร์ตไทยสู่มาตรฐานสากล ด้วยเทคโนโลยีระดับมืออาชีพ และระบบการจัดการที่โปร่งใส มั่นคง ยั่งยืน',
      founderTag: 'FOUNDER & CEO',
      founderName: 'กิตติศักดิ์ พรหมวารี (คุณกฤต)',
      founderTitle: 'ประธานเจ้าหน้าที่บริหารและผู้ก่อตั้ง G-SPEED Group',
      experienceLabel: 'ประสบการณ์ในอุตสาหกรรม',
      branchesLabel: 'อารีนาที่บริหารจัดการ',
      quote: '"เราไม่ได้มองว่าร้านเกมเป็นแค่ที่เล่นเกม แต่คือสนามกีฬาของคนรุ่นใหม่ เป็นพื้นที่สานฝันและสร้างนักกีฬาอีสปอร์ตไทยสู่ระดับโลก"',
      coreVisionTitle: 'วิสัยทัศน์และการขับเคลื่อน (Core Vision)',
      coreVisionDesc: 'ยกระดับมาตรฐานร้านอินเทอร์เน็ตคาเฟ่ในไทยให้เทียบเท่าสนามแข่งระดับโลก ด้วยระบบฮาร์ดแวร์ที่ดีที่สุด บรรยากาศที่ปลอดภัย สะอาด และระบบการบริหารจัดการที่สร้างผลตอบแทนยั่งยืนแก่ผู้ร่วมลงทุน',
      pillar1Title: 'เทคโนโลยีต้องดีที่สุด',
      pillar1Desc: 'ลงทุนในฮาร์ดแวร์ระดับทัวร์นาเมนต์ จอ 360Hz และระบบเน็ตเวิร์กที่แข่งขันได้จริง',
      pillar2Title: 'สิ่งแวดล้อมที่สะอาด ปลอดภัย และได้มาตรฐาน',
      pillar2Desc: 'พื้นที่โปร่ง โซนแยกเป็นสัดส่วน ระบบระบายอากาศมาตรฐาน และไม่มีสิ่งอบายมุข',
      pillar3Title: 'ผลตอบแทนที่คุ้มค่าและการเติบโตอย่างยั่งยืนของพาร์ตเนอร์',
      pillar3Desc: 'ระบบบริหารจัดการร้านและโมเดลแฟรนไชส์ที่คืนทุนได้จริงใน 14-24 เดือน',
      milestonesBadge: 'OUR JOURNEY & MILESTONES',
      milestonesTitle: 'ไทม์ไลน์ความสำเร็จ & ก้าวสำคัญของ G-SPEED',
      milestonesSubtitle: 'เส้นทางการเติบโตจากร้านเกมระดับพรีเมียม สู่การเป็นผู้นำด้านสนามประลองอีสปอร์ตครบวงจรของประเทศไทย',
      partnersBadge: 'ECOSYSTEM & PARTNERS',
      partnersTitle: 'พันธมิตรทางธุรกิจและแบรนด์ระดับโลกที่ไว้วางใจ',
      partnersSubtitle: 'ร่วมมือกับค่ายเกม ผู้ผลิตฮาร์ดแวร์ และองค์กรชั้นนำ เพื่อส่งมอบประสบการณ์อีสปอร์ตที่ดีที่สุด',
      calculatorCta: 'สนใจร่วมเป็นพาร์ตเนอร์เปิดร้านเกมแฟรนไชส์ GLP?',
      calculatorBtn: 'คำนวณงบประมาณและจำลองผังร้าน 3D'
    },
    singleActivity: {
      back: 'ย้อนกลับไปหน้ารวมกิจกรรม',
      readTime: 'เวลาอ่านประมาณ',
      minutes: 'นาที',
      partner: 'พาร์ตเนอร์ผู้ร่วมจัด',
      share: 'แชร์บทความ',
      galleryTitle: 'ประมวลภาพบรรยากาศเต็ม (Photo Gallery)',
      relatedTitle: 'ข่าวกิจกรรม & บทความที่เกี่ยวข้อง',
      hotlineText: 'สนใจจัดกิจกรรมหรือขอเช่าสถานที่จัดแข่งขันที่ GLP Arena?',
      hotlineBtn: 'โทรติดต่อฝ่ายกิจกรรม'
    },
    singleTournament: {
      back: 'ย้อนกลับไปปฏิทินแข่ง',
      overview: 'ภาพรวมการแข่งขัน',
      schedule: 'กำหนดการแข่ง',
      bracket: 'สายการแข่งขันสด',
      teams: 'รายชื่อทีม',
      register: 'สมัครเข้าแข่งขัน',
      prizePool: 'เงินรางวัลรวม',
      slots: 'จำนวนรับสมัคร',
      format: 'รูปแบบการแข่ง',
      rules: 'กติกาการแข่งขัน',
      regClosed: 'ปิดรับสมัครแล้ว',
      regOpen: 'เปิดรับสมัครด่วน'
    }
  },

  en: {
    langName: 'English',
    langCode: 'en',
    flag: '🇬🇧',
    nav: {
      home: 'Home',
      tournaments: 'Tournaments',
      activities: 'Activities',
      company: 'About Us',
      contact: 'Contact Us',
      franchise: '3D Franchise',
      cta: 'Franchise Inquiry',
      menu: 'Menu',
      close: 'Close',
      admin: 'Admin CMS'
    },
    hero: {
      tag: 'GLP ESPORTS • 24/7 Gaming & Tournament Hub',
      title: 'GLP ESPORT STADIUM MEETING\nNational Tournaments & Gaming Activities Hub',
      subtitle: "Thailand's premier esports battleground with international tournament standards. Hosting LAN competitions, VIP streamer suites, and brand activations for major game publishers.",
      btn1: 'Host Esports Event',
      btn2: 'View Activities',
      btn3: 'Tournaments',
      btn4: 'Franchise Store Planner',
      metrics: [
        { number: '750+', label: 'Battle Stations Nationwide' },
        { number: '360Hz', label: 'Fast-IPS & OLED Displays' },
        { number: '10Gbps', label: 'Dedicated Multi-WAN Ping < 3ms' },
        { number: '24/7', label: 'Open 24 Hours / 7 Days' }
      ]
    },
    common: {
      viewDetails: 'View Details',
      readMore: 'Read More',
      back: 'Back',
      share: 'Share',
      copyLink: 'Copy Link',
      copied: 'Copied!',
      prizePool: 'Prize Pool',
      date: 'Date',
      location: 'Location',
      game: 'Game',
      status: 'Status',
      open: 'Registration Open',
      ongoing: 'In Progress',
      completed: 'Finished',
      all: 'All',
      search: 'Search...',
      category: 'Category',
      tags: 'Related Tags',
      rules: 'Rules & Regulations',
      schedule: 'Schedule',
      bracket: 'Tournament Brackets',
      teams: 'Registered Teams',
      gallery: 'Photo Gallery',
      registerTeam: 'Register Team',
      hotline: 'Franchise Hotline',
      callNow: 'Call Now',
      photosCount: 'Photos',
      teamsCount: 'Teams',
      readTime: 'Read Time',
      partner: 'Partner',
      organizer: 'Organizer',
      overview: 'Overview',
      loading: 'Loading system data...',
      offline: 'Offline',
      online: 'Online',
      viewAll: 'View All'
    },
    home: {
      searchPlaceholder: 'Search activities, tournaments, games, or prize pools...',
      hotlineLabel: 'Esports Event Booking Hotline:',
      featureEvents: {
        badge: 'GLP OUR EVENTS',
        title: 'Activities & Live Atmosphere',
        desc: 'Photos from LAN championships, game launch events, community meetups, and victory ceremonies.',
        link: 'Enter Photo & Community Gallery'
      },
      featureTournaments: {
        badge: 'GLP TOURNAMENTS',
        title: 'Tournament Calendar & Prize Pools',
        desc: 'Track tournament brackets, live match results, and register your team for national esports leagues.',
        link: 'View All Esports Tournaments'
      },
      zones: {
        badge: 'VENUE ATMOSPHERE & ZONES',
        title: 'Arena Atmosphere & Available Zones',
        subtitle: 'Explore premium spaces and pro facilities designed for championship competition and ultimate entertainment.',
        rateLabel: 'Hourly Rate:',
        specsLabel: 'Hardware Specs:',
        galleryCounter: 'Photos'
      },
      latestTournaments: {
        badge: 'GLP ESPORTS CALENDAR',
        title: 'Monthly Esports Tournament Calendar',
        viewAllBtn: 'View All'
      },
      latestActivities: {
        badge: 'PHOTO & COMMUNITY HIGHLIGHTS',
        title: 'Activities & Vibrant Atmosphere',
        viewAllBtn: 'View All'
      },
      partners: {
        badge: 'ECOSYSTEM & SPONSORS',
        title: 'Global Partners & Esports Sponsors'
      }
    },
    chat: {
      triggerSubtitle: 'G-SPEED ARENA',
      triggerLabel: 'Customer Support / Live Chat',
      cardTitle: 'Customer Concierge • G-SPEED ARENA',
      statusOnline: 'Online • 24/7 Information & Assistance',
      inputPlaceholder: 'Inquire about hours, location, tournament booking, or systems...',
      sendBtn: 'Send'
    },
    tournamentsPage: {
      badge: 'GLP ESPORTS TOURNAMENTS',
      title: 'Esports Tournaments & Competitions',
      subtitle: 'National tournament calendar with major prize pools, streamed live on 4K Main Stage',
      searchPlaceholder: 'Search tournament, game, or prize...',
      filterGame: 'Filter by Game',
      allGames: 'All Games',
      registeredTeams: 'Registered Teams',
      rulesTitle: 'Rules & Guidelines',
      bracketTitle: 'Tournament Bracket',
      prizesTitle: 'Prize Distribution Structure',
      scheduleTitle: 'Tournament Timetable'
    },
    activitiesPage: {
      badge: 'GLP PHOTO & COMMUNITY GALLERY',
      title: 'Activities & Community Gallery',
      subtitle: 'Recap photos from championship LAN parties, publisher showcases, and gamer meetups at GLP Arena',
      searchPlaceholder: 'Search events, partners, or tags...',
      filterCategory: 'Event Category',
      filterTag: 'Popular Tags',
      allCategories: 'All Categories',
      allTags: 'All Tags'
    },
    franchisePage: {
      badge: '3D INTERIOR PLANNER & STUDIO',
      title: '3D Franchise Store Configurator',
      subtitle: 'Design your layout, customize interior themes, and get instant investment budgets and PC specs',
      step1: '1. Room Size',
      step2: '2. 2D/3D Studio',
      step3: '3. Hardware Specs',
      step4: '4. Summary & Quote'
    },
    contactPage: {
      badge: 'GET IN TOUCH WITH GLP',
      title: 'Contact GLP : G Speed Living Plus',
      subtitle: 'Ramkhamhaeng 53, Phlabphla, Wang Thonglang, Bangkok. Open 24/7 every day',
      formTitle: 'Send Us a Message',
      formName: 'Full Name',
      formPhone: 'Phone Number',
      formEmail: 'Email Address (Optional)',
      formSubject: 'Subject',
      formMessage: 'Your Message',
      sendBtn: 'Send Message',
      hours: 'Operating Hours',
      hours24: 'Open 24 Hours / 7 Days a Week',
      address: 'Arena Location'
    },
    footer: {
      tagline: 'World-class esports arena and gaming lounge, powered by GLP Living Plus Group with smart franchise solutions.',
      quickLinks: 'Quick Links',
      services: 'Our Services',
      contactInfo: 'Contact Info',
      rights: 'GLP : G Speed Living Plus. All Rights Reserved.'
    },
    companyPage: {
      badge: 'LEADERSHIP & CORPORATE PROFILE',
      title: 'Executive Vision & Corporate Profile',
      subtitle: "Dedicated to driving Thailand's esports industry toward international standards through professional technology and transparent, sustainable management.",
      founderTag: 'FOUNDER & CEO',
      founderName: 'Kittisak Promwaree (Krit)',
      founderTitle: 'Chief Executive Officer & Founder, G-SPEED Group',
      experienceLabel: 'Industry Experience',
      branchesLabel: 'Managed Arenas',
      quote: '"We do not view cyber cafes merely as places to play games, but as modern sports stadiums for the next generation—empowering dreams and cultivating Thai esports athletes for the global stage."',
      coreVisionTitle: 'Core Vision & Driving Principles',
      coreVisionDesc: 'Elevating internet cafes in Thailand to world-class competition standards with cutting-edge hardware, safe environments, and sustainable returns for partners.',
      pillar1Title: 'Best-in-Class Technology',
      pillar1Desc: 'Investing in tournament-grade hardware, 360Hz displays, and pro low-latency networks.',
      pillar2Title: 'Clean, Safe & Certified Environment',
      pillar2Desc: 'Spacious zoning, acoustic insulation, clean air circulation, and a zero-vice atmosphere.',
      pillar3Title: 'Sustainable Returns & Partner Growth',
      pillar3Desc: 'Proven franchise operations and store management that delivers ROI within 14-24 months.',
      milestonesBadge: 'OUR JOURNEY & MILESTONES',
      milestonesTitle: 'Milestones & History of G-SPEED',
      milestonesSubtitle: "Our journey from a premier gaming lounge to Thailand's leading turnkey esports arena network.",
      partnersBadge: 'ECOSYSTEM & PARTNERS',
      partnersTitle: 'Trusted Global Partners & Ecosystem Sponsors',
      partnersSubtitle: 'Partnering with premier game publishers, hardware manufacturers, and industry leaders to deliver the ultimate esports experience.',
      calculatorCta: 'Interested in opening a GLP Franchise Store?',
      calculatorBtn: 'Calculate Budget & 3D Floor Planner'
    },
    singleActivity: {
      back: 'Back to Activities',
      readTime: 'Read time approx.',
      minutes: 'mins',
      partner: 'Co-Host Partner',
      share: 'Share Article',
      galleryTitle: 'Full Photo Gallery',
      relatedTitle: 'Related Activities & News',
      hotlineText: 'Interested in hosting an event or renting GLP Arena?',
      hotlineBtn: 'Call Event Team'
    },
    singleTournament: {
      back: 'Back to Tournaments',
      overview: 'Tournament Overview',
      schedule: 'Schedule',
      bracket: 'Live Bracket',
      teams: 'Teams',
      register: 'Register Now',
      prizePool: 'Total Prize Pool',
      slots: 'Slots',
      format: 'Format',
      rules: 'Rules & Regulations',
      regClosed: 'Registration Closed',
      regOpen: 'Register Now'
    }
  },

  zh: {
    langName: '中文',
    langCode: 'zh',
    flag: '🇨🇳',
    nav: {
      home: '首页',
      tournaments: '电竞赛事',
      activities: '精彩活动',
      company: '关于我们',
      contact: '联系我们',
      franchise: '3D加盟设计',
      cta: '加盟咨询',
      menu: '菜单',
      close: '关闭',
      admin: '管理后台'
    },
    hero: {
      tag: 'GLP ESPORTS • 24小时电竞狂欢中心',
      title: 'GLP 电竞体育竞技馆\n国家级电竞赛事与游戏嘉年华中心',
      subtitle: '泰国顶尖专业电竞对决胜地，具备国际级赛事舞台，全方位承接各类LAN线下电竞赛事、专业战队集训营及知名游戏厂商发布会。',
      btn1: '承办赛事活动',
      btn2: '精彩活动',
      btn3: '电竞赛事',
      btn4: '加盟开店规划',
      metrics: [
        { number: '750+', label: '全国电竞对战席位' },
        { number: '360Hz', label: 'Fast-IPS & OLED 电竞屏' },
        { number: '10Gbps', label: '专用多线光纤 延迟 < 3ms' },
        { number: '24/7', label: '24小时全年无休' }
      ]
    },
    common: {
      viewDetails: '查看详情',
      readMore: '阅读全文',
      back: '返回',
      share: '分享',
      copyLink: '复制链接',
      copied: '已复制！',
      prizePool: '总奖金池',
      date: '比赛日期',
      location: '比赛地点',
      game: '比赛项目',
      status: '赛事状态',
      open: '火热报名中',
      ongoing: '比赛进行中',
      completed: '已完赛',
      all: '全部',
      search: '搜索关键词...',
      category: '项目分类',
      tags: '相关标签',
      rules: '比赛规程与规则',
      schedule: '赛程安排',
      bracket: '对阵淘汰赛程表',
      teams: '已报名参赛战队',
      gallery: '精彩现场图集',
      registerTeam: '战队报名',
      hotline: '加盟咨询热线',
      callNow: '立即拨打',
      photosCount: '张照片',
      teamsCount: '支战队',
      readTime: '阅读时间',
      partner: '合作伙伴',
      organizer: '主办方',
      overview: '赛事概览',
      loading: '系统数据加载中...',
      offline: '离线',
      online: '在线',
      viewAll: '查看全部'
    },
    home: {
      searchPlaceholder: '搜索活动、赛事、游戏项目或奖金...',
      hotlineLabel: '电竞赛事活动预订热线:',
      featureEvents: {
        badge: 'GLP 精彩活动',
        title: '活动图集与现场实况',
        desc: '汇集全年度线下LAN锦标赛、游戏新作发布会、玩家见面会及颁奖典礼精彩瞬间。',
        link: '进入活动图集与玩家社区'
      },
      featureTournaments: {
        badge: 'GLP 电竞赛事',
        title: '赛事日程与奖金争夺',
        desc: '实时掌握赛事晋级表（Bracket）、战队比分，并直接报名参加全国性专业电竞锦标赛。',
        link: '查看全部赛事日程'
      },
      zones: {
        badge: '场馆环境与功能分区',
        title: '场馆环境与专业功能分区',
        subtitle: '探索顶级电竞设施与休闲空间，兼顾专业竞赛与高品质娱乐体验。',
        rateLabel: '收费标准:',
        specsLabel: '硬件配置:',
        galleryCounter: '张照片'
      },
      latestTournaments: {
        badge: 'GLP 赛事日程',
        title: '本月专业电竞赛事日程表',
        viewAllBtn: '查看全部'
      },
      latestActivities: {
        badge: '精彩活动与玩家社区',
        title: '赛事活动与现场火热氛围',
        viewAllBtn: '查看全部'
      },
      partners: {
        badge: '赞助商与生态伙伴',
        title: '全球合作伙伴与赛事赞助商'
      }
    },
    chat: {
      triggerSubtitle: 'G-SPEED ARENA',
      triggerLabel: '客服咨询 / 在线聊天',
      cardTitle: '客户服务中心 • G-SPEED ARENA',
      statusOnline: '在线 • 24小时咨询与服务',
      inputPlaceholder: '咨询营业时间、场馆地址、赛事承办或系统配置...',
      sendBtn: '发送'
    },
    tournamentsPage: {
      badge: 'GLP ESPORTS TOURNAMENTS',
      title: '电竞赛事与竞技对决',
      subtitle: '全国大型电竞锦标赛赛程，丰厚奖金池，4K主舞台全程高清直播',
      searchPlaceholder: '搜索赛事名称、游戏项目或奖金...',
      filterGame: '按游戏筛选',
      allGames: '全部游戏',
      registeredTeams: '已参赛队伍',
      rulesTitle: '比赛规则与竞赛指南',
      bracketTitle: '淘汰赛晋级图 (Tournament Bracket)',
      prizesTitle: '奖金分配明细 (Prize Pool)',
      scheduleTitle: '比赛时间表 (Timetable)'
    },
    activitiesPage: {
      badge: 'GLP PHOTO & COMMUNITY GALLERY',
      title: '活动图集与电竞资讯',
      subtitle: '记录线下狂欢赛、游戏发布会与玩家社区精彩瞬间',
      searchPlaceholder: '搜索活动、合作伙伴或标签...',
      filterCategory: '活动分类',
      filterTag: '热门标签',
      allCategories: '全部分类',
      allTags: '全部标签'
    },
    franchisePage: {
      badge: '3D INTERIOR PLANNER & STUDIO',
      title: '3D 智能电竞馆加盟规划系统',
      subtitle: '自主规划电脑对战席、主舞台、吧台与灯光风格，即时生成投资预算及电脑配置方案',
      step1: '1. 设定场地面积',
      step2: '2. 2D/3D平面布局',
      step3: '3. 选择硬件配置',
      step4: '4. 报价清单与咨询'
    },
    contactPage: {
      badge: 'GET IN TOUCH WITH GLP',
      title: '联系 GLP : G Speed Living Plus',
      subtitle: '曼谷兰甘杏53巷，全年无休24小时营业，随时欢迎您的光临与垂询',
      formTitle: '在线留言与咨询',
      formName: '您的姓名',
      formPhone: '联系电话',
      formEmail: '电子邮箱 (选填)',
      formSubject: '咨询主题',
      formMessage: '留言详情',
      sendBtn: '提交信息',
      hours: '营业时间',
      hours24: '24小时全年无休营业',
      address: '场馆地址'
    },
    footer: {
      tagline: '国际标准专业电竞场馆与数字娱乐社区，由 GLP Living Plus Group 倾力打造，提供智能加盟解决方案。',
      quickLinks: '快速链接',
      services: '核心服务',
      contactInfo: '联系方式',
      rights: 'GLP : G Speed Living Plus. 版权所有.'
    },
    companyPage: {
      badge: '领导团队与企业概况',
      title: '企业愿景与 G-SPEED 发展历程',
      subtitle: '致力于以专业电竞科技与透明稳健的管理体系，推动泰国电竞产业迈向国际化标准。',
      founderTag: '创始人兼首席执行官',
      founderName: 'Kittisak Promwaree (Krit)',
      founderTitle: 'G-SPEED 集团首席执行官兼创始人',
      experienceLabel: '行业深耕经验',
      branchesLabel: '运营管理电竞馆',
      quote: '“在我们眼中，网吧不仅仅是玩游戏的地方，更是属于新一代年轻人的竞技运动场，是孵化梦想、助推泰国电竞选手走向世界舞台的摇篮。”',
      coreVisionTitle: '核心愿景与驱动理念 (Core Vision)',
      coreVisionDesc: '以顶级电竞硬件、安全舒适的环境及可持续的投资回报，将泰国网吧标准提升至国际赛事级别。',
      pillar1Title: '顶级前沿科技',
      pillar1Desc: '持续投资专业级电竞赛事硬件、360Hz高刷电竞屏与职业比赛网络。',
      pillar2Title: '洁净安全高标准环境',
      pillar2Desc: '明亮通透的专业分区，隔音隔烟，营造健康绿色的电竞环境。',
      pillar3Title: '合作伙伴可持续投资回报',
      pillar3Desc: '经过严密验证的电竞馆运营体系与加盟模型，助力投资人在14-24个月内实现稳健回本。',
      milestonesBadge: '发展历程与里程碑',
      milestonesTitle: 'G-SPEED 发展里程碑与辉煌历程',
      milestonesSubtitle: '从高端精品电竞馆成长为泰国领先的一站式电竞体育场馆与赛事中心的非凡历程。',
      partnersBadge: '生态体系与合作伙伴',
      partnersTitle: '深受全球顶尖品牌与生态伙伴信赖',
      partnersSubtitle: '携手知名游戏厂商、一线硬件品牌与行业巨头，共同打造极致电竞体验。',
      calculatorCta: '有意加盟 GLP 电竞馆开启您的电竞事业？',
      calculatorBtn: '测算投资预算并体验3D空间规划'
    },
    singleActivity: {
      back: '返回活动列表',
      readTime: '预计阅读时间',
      minutes: '分钟',
      partner: '合作方',
      share: '分享文章',
      galleryTitle: '高清活动相册',
      relatedTitle: '相关活动与资讯',
      hotlineText: '有意在 GLP Arena 举办赛事或租用场地？',
      hotlineBtn: '致电活动团队'
    },
    singleTournament: {
      back: '返回赛事日历',
      overview: '赛事概览',
      schedule: '赛程安排',
      bracket: '实时对阵表',
      teams: '参赛战队',
      register: '立即报名',
      prizePool: '赛事总奖金',
      slots: '名额',
      format: '比赛赛制',
      rules: '比赛规则',
      regClosed: '报名已截止',
      regOpen: '火热报名中'
    }
  }
};

const LanguageContext = createContext({
  language: 'th',
  setLanguage: () => {},
  t: (key, fallback) => fallback || key,
  supportedLanguages: []
});

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    try {
      const saved = localStorage.getItem('glp_language');
      if (saved && (saved === 'th' || saved === 'en' || saved === 'zh')) {
        return saved;
      }
    } catch (e) {}
    return 'th';
  });

  const setLanguage = (lang) => {
    if (lang !== 'th' && lang !== 'en' && lang !== 'zh') return;
    setLanguageState(lang);
    try {
      localStorage.setItem('glp_language', lang);
      document.documentElement.lang = lang;
      // Dispatch storage event so all components react immediately
      window.dispatchEvent(new Event('languagechange'));
    } catch (e) {}
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  // Deep key lookup helper: t('nav.home') or t('home.zones.title')
  const t = (keyPath, fallback = '') => {
    if (!keyPath) return fallback;
    const langDict = translations[language] || translations.th;
    const parts = keyPath.split('.');
    let curr = langDict;
    for (const part of parts) {
      if (curr && typeof curr === 'object' && part in curr) {
        curr = curr[part];
      } else {
        // Fallback to Thai then to fallback string
        let thaiCurr = translations.th;
        for (const p of parts) {
          if (thaiCurr && typeof thaiCurr === 'object' && p in thaiCurr) {
            thaiCurr = thaiCurr[p];
          } else {
            return fallback || keyPath;
          }
        }
        return thaiCurr;
      }
    }
    return curr !== undefined ? curr : (fallback || keyPath);
  };

  const supportedLanguages = [
    { code: 'th', label: 'ไทย', flag: '🇹🇭', short: 'TH' },
    { code: 'en', label: 'English', flag: '🇬🇧', short: 'EN' },
    { code: 'zh', label: '中文', flag: '🇨🇳', short: 'CN' }
  ];

  // Helper to translate mock and user content dynamically
  const translateDynamic = (text) => {
    if (!text || language === 'th') return text;
    const str = typeof text === 'string' ? text.trim() : '';
    if (CONTENT_TRANSLATIONS[str] && CONTENT_TRANSLATIONS[str][language]) {
      return CONTENT_TRANSLATIONS[str][language];
    }
    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, supportedLanguages, translateDynamic }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const CONTENT_TRANSLATIONS = {
  // Tournaments
  'GLP VALORANT CHAMPIONSHIP 2026': {
    en: 'GLP VALORANT CHAMPIONSHIP 2026',
    zh: 'GLP 无畏契约全国锦标赛 2026'
  },
  'การแข่งขัน LAN ทัวร์นาเมนต์เกม VALORANT ชิงเงินรางวัล 100,000 บาท แข่งขัน ณ GLP Main Stage พร้อมถ่ายทอดสด 4K': {
    en: 'VALORANT LAN Championship with 100,000 THB prize pool, hosted live on GLP Main Stage with 4K broadcast.',
    zh: '无畏契约 (VALORANT) 线下大型锦标赛，总奖金 100,000 泰铢，GLP 主舞台 4K 全程高清直播。'
  },
  'ICAFE ATTACK LAN TOURNAMENT 2026': {
    en: 'ICAFE ATTACK LAN TOURNAMENT 2026',
    zh: 'ICAFE ATTACK 线下电竞锦标赛 2026'
  },
  'ระเบิดความมันส์ เสาร์-อาทิตย์นี้ ณ GLP Main Stage ลุ้นรับแรร์ไอเทมและเงินรางวัลสด': {
    en: 'Epic LAN tournament this weekend at GLP Main Stage! Win rare items and cash prizes.',
    zh: '本周末狂欢引爆！GLP 主舞台震撼开战，现场赢取稀有游戏道具与现金大奖。'
  },
  'ROV PRO LEAGUE COMMUNITY CUP': {
    en: 'ROV PRO LEAGUE COMMUNITY CUP',
    zh: '王者荣耀/ROV 职业社区杯'
  },
  'ศึกประลอง ROV 5v5 ระดับคอมมูนิตี้ ชิงทุนการศึกษาและเงินรางวัลรวม 50,000 บาท': {
    en: 'ROV 5v5 Community Cup competing for 50,000 THB in scholarships and prize money.',
    zh: '王者荣耀 / ROV 5v5 社区争霸赛，争夺 50,000 泰铢奖学金与丰厚奖金。'
  },
  'PUBG MOBILE SQUAD SURVIVOR': {
    en: 'PUBG MOBILE SQUAD SURVIVOR',
    zh: '绝地求生手游四排生存突围赛'
  },
  'การแข่งขันเอาชีวิตรอด 16 ทีมบนสมรภูมิ Erangel & Miramar ชิงเงินรางวัล 30,000 บาท': {
    en: '16-team Squad Survivor tournament on Erangel & Miramar for 30,000 THB prize pool.',
    zh: '16支战队海岛与沙漠绝地求生，角逐 30,000 泰铢吃鸡奖金。'
  },
  // Activities / Articles
  'VALORANT LAN TOURNAMENT 2026': {
    en: 'VALORANT LAN TOURNAMENT 2026',
    zh: '无畏契约 2026 线下总决赛现场'
  },
  'ภาพบรรยากาศการแข่งขันรอบชิงชนะเลิศ เสียงเชียร์กึกก้องและการประลองฝีมือสุดเข้มข้น': {
    en: 'Championship finals highlights, roaring crowd cheers, and intense tactical plays.',
    zh: '总决赛高能瞬间回顾，现场欢呼雷动，职业级精彩操作层出不穷。'
  },
  'ROV COMMUNITY CUP FINALS': {
    en: 'ROV COMMUNITY CUP FINALS',
    zh: 'ROV 社区杯巅峰总决赛'
  },
  'รวมภาพแฟนคลับและนักกีฬาที่มาร่วมสนุกในกิจกรรมแจกของรางวัลและมีตติ้ง': {
    en: 'Fans and players gather for giveaways, community meetups, and victory celebrations.',
    zh: '广大玩家与参赛战队齐聚一堂，参与狂欢互动、福利抽奖与粉丝见面会。'
  },
  'NVIDIA RTX 40 SERIES EXPERIENCE DAY': {
    en: 'NVIDIA RTX 40 SERIES EXPERIENCE DAY',
    zh: '英伟达 RTX 40 系列显卡超级体验日'
  },
  'งานเปิดตัวและทดสอบพลังการ์ดจอ GeForce RTX 40 Series ร่วมกับพาร์ตเนอร์ชั้นนำ': {
    en: 'GeForce RTX 40 Series launch & hands-on testing day with leading hardware partners.',
    zh: '英伟达 GeForce RTX 40 系列显卡深度体验会，携手一线硬件品牌震撼呈现。'
  },
  // Categories & labels
  'ทั้งหมด': { en: 'All', zh: '全部' },
  'ทัวร์นาเมนต์': { en: 'Tournaments', zh: '电竞赛事' },
  'อีเวนต์ค่ายเกม': { en: 'Game Publishers', zh: '游戏厂商活动' },
  'คอมมูนิตี้มีตติ้ง': { en: 'Community Meetup', zh: '玩家社群聚会' },
  'บรรยากาศร้าน': { en: 'Arena Atmosphere', zh: '场馆实景' },
  'ทั่วไป': { en: 'General', zh: '综合' }
};

export function useTranslation() {
  return useContext(LanguageContext);
}
