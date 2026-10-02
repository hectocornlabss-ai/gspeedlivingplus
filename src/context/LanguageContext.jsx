import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { translateDynamic as autoTranslateDynamic } from '../utils/autoTranslator';

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
        title: 'รวมภาพกิจกรรม',
        desc: 'ภาพงานแข่ง LAN, งานเปิดตัวเกม, มีตติ้ง และพิธีมอบรางวัลชนะเลิศตลอดทั้งปี',
        link: 'สำรวจอัลบั้มภาพกิจกรรม'
      },
      featureTournaments: {
        badge: 'GLP TOURNAMENTS',
        title: 'ทัวร์นาเมนต์การแข่งขัน',
        desc: 'เกาะติดผลการแข่งขัน สายแข่งสด (Brackets) และลงทะเบียนประลองฝีมือระดับประเทศ',
        link: 'สำรวจทัวร์นาเมนต์ทั้งหมด'
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
    },
    tournamentModal: {
      tabOverview: 'ภาพรวม & กติกา & รางวัล',
      tabSchedule: 'กำหนดการ & วันที่',
      tabBracket: 'สายแข่ง & ผลสด',
      tabRoster: 'รายชื่อทีม',
      tabRegister: 'ลงทะเบียนแข่งขัน',
      prizePool: 'เงินรางวัลรวม',
      date: 'วันที่แข่งขัน',
      venue: 'สถานที่แข่งขัน',
      venueDefault: 'GLP : G Speed Living Plus รามคำแหง 53',
      regFormTitle: 'แบบฟอร์มลงทะเบียนทีมแข่งขัน',
      regSubtitle: 'กรอกข้อมูลทีมและผู้เล่นเพื่อสมัครเข้าร่วมการแข่งขันอย่างเป็นทางการ',
      teamName: 'ชื่อทีม',
      teamTag: 'ตัวย่อทีม (Tag)',
      captainName: 'ชื่อกัปตันทีม',
      captainPhone: 'เบอร์โทรศัพท์กัปตัน',
      captainEmail: 'อีเมล',
      captainDiscord: 'Discord / Line ID',
      submitRegister: 'ส่งข้อมูลสมัครแข่งขัน',
      successTitle: 'ลงทะเบียนแข่งขันสำเร็จ!',
      successDesc: 'ทีมงานฝ่ายประสานงานทัวร์นาเมนต์ GLP ได้รับข้อมูลเรียบร้อยแล้ว และจะติดต่อกลับเพื่อยืนยันสิทธิ์',
      copiedLink: 'คัดลอกลิงก์ทัวร์นาเมนต์แล้ว!',
      shareTournament: 'แชร์ทัวร์นาเมนต์'
    },
    seatBookingModal: {
      title: 'จองเครื่องเล่นเกม & VIP Pod ล่วงหน้า',
      subtitle: 'เลือกโซน ที่นั่ง วันเวลา และสั่งเซ็ตอาหารเครื่องดื่มล่วงหน้าได้ทันที',
      step1: '1. โซน & ที่นั่ง',
      step2: '2. วันและเวลา',
      step3: '3. ผู้จอง & เมนู',
      step4: '4. ตั๋วการจอง',
      selectZone: 'เลือกโซนที่ต้องการ',
      selectSeatTip: 'คลิกเพื่อเลือกหรือยกเลิกที่นั่ง (เลือกได้หลายที่นั่งพร้อมกัน)',
      available: 'ว่าง',
      selected: 'กำลังเลือก',
      occupied: 'ไม่ว่าง',
      ratePerHour: 'อัตราค่าบริการ:',
      memberPrice: 'ราคาสมาชิก:',
      bahtHour: 'บาท/ชม.',
      selectedSeatsCount: 'ที่นั่งที่เลือก:',
      dateLabel: 'วันที่ต้องการใช้บริการ:',
      timeSlotLabel: 'ช่วงเวลาที่เริ่มใช้บริการ:',
      durationLabel: 'แพ็กเกจระยะเวลาชั่วโมง:',
      package2hr: '2 ชั่วโมง (ชิวๆ สบายๆ)',
      package4hr: '4 ชั่วโมง (ยอดนิยม - กำลังดี)',
      package6hr: '6 ชั่วโมง (สายลุย แบกแรงค์)',
      packageNight: 'Night Owl เหมาคืน 23:00 - 08:00 (150 บาท)',
      custName: 'ชื่อ - นามสกุล ผู้จอง:',
      custPhone: 'เบอร์โทรศัพท์ติดต่อ (จำเป็น):',
      custEmail: 'อีเมลติดต่อ (ถ้ามี):',
      memberCheck: 'เป็นสมาชิก GLP หรือไม่?',
      isMemberLabel: 'ฉันเป็นสมาชิก GLP (รับส่วนลดชั่วโมงละ 10 บาท)',
      memberId: 'รหัสสมาชิก GLP:',
      foodLabel: 'เลือกแพ็กเกจอาหารและเครื่องดื่ม (เสิร์ฟถึงโต๊ะ):',
      foodNone: 'ไม่รับอาหารและเครื่องดื่ม (0 บาท)',
      foodEnergy: 'Energy Boost Combo (Red Bull + ข้าวไข่ข้นแฮม) (+89 บ./ที่)',
      foodFeast: 'Gamer Feast Combo (ชานม + ข้าวผัดกะเพรา + เฟรนช์ฟรายส์) (+149 บ./ที่)',
      foodCoffee: 'Specialty Coffee Combo (กาแฟคั่วสด + ครัวซองต์เนย) (+65 บ./ที่)',
      notes: 'หมายเหตุเพิ่มเติม (ถ้ามี):',
      totalEstimated: 'ยอดรวมประมาณการ:',
      btnNext: 'ถัดไป',
      btnBack: 'ย้อนกลับ',
      btnConfirm: 'ยืนยันการจองที่นั่ง',
      ticketSuccess: 'จองที่นั่งสำเร็จแล้ว!',
      ticketSubtitle: 'ขอบคุณที่ใช้บริการ G-SPEED ARENA กรุณาบันทึกตั๋วหรือถ่ายรูปไว้แสดงหน้าเคาน์เตอร์',
      ticketCode: 'รหัสการจอง (Booking Code):',
      stageFront: '─── เวที / ด้านหน้าสนามแข่ง ARENA MAIN STAGE DISPLAY ───',
      hardwareSpecs: 'สเปกฮาร์ดแวร์ประจำโซน',
      btnCopyCode: 'คัดลอกรหัส',
      btnPrintTicket: 'พิมพ์ใบจอง / ตั๋ว',
      btnClose: 'เสร็จสิ้น / ปิดหน้าต่าง'
    },
    organizerModal: {
      title: 'ติดต่อขอจัดงานแข่ง Esport & เช่าสถานที่',
      subtitle: 'พื้นที่ประลองเกมมาตรฐาน Pro Circuit พร้อมเวที Main Stage, จอถ่ายทอดสด LED Wall 4K, สเปก 360Hz และระบบเน็ตเวิร์ก 10Gbps',
      chipStage: 'เวที 5v5 Soundproof Stage',
      chipScreen: 'จอ LED Wall 4K สตูดิโอ',
      chipGear: 'RTX 40 Series 360Hz',
      chipCaster: 'โต๊ะแคสเตอร์พากย์สด',
      section1: 'เลือกเกมที่ต้องการจัดการแข่งขัน',
      section2: 'ข้อมูลผู้ติดต่อ & องค์กร',
      section3: 'กำหนดการ & ความต้องการเพิ่มเติม',
      nameLabel: 'ชื่อผู้ติดต่อ / ตัวแทนองค์กร *',
      orgLabel: 'ชื่อบริษัท / สถาบัน / สังกัดผู้จัด (ถ้ามี)',
      phoneLabel: 'เบอร์โทรศัพท์ติดต่อ (สายด่วน) *',
      emailLabel: 'อีเมลติดต่อ',
      lineLabel: 'LINE ID สำหรับติดต่อกลับสะดวก',
      gameLabel: 'เกมที่ต้องการจัดแข่งขัน',
      expectedDateLabel: 'ช่วงวันที่คาดว่าจะจัด',
      attendeesLabel: 'จำนวนผู้เข้าร่วมแข่งขันโดยประมาณ',
      budgetLabel: 'งบประมาณโดยประมาณ',
      addonsLabel: 'อุปกรณ์และบริการเสริมที่ต้องการ:',
      notesLabel: 'รายละเอียดหรือความต้องการเพิ่มเติม (เช่น จำนวนจอ, โต๊ะแคสเตอร์, ถ่ายทอดสด)',
      submitBtn: 'ส่งข้อมูลขอจัดงานแข่ง',
      submitFull: 'ส่งข้อมูลขอจัดงาน & รับใบเสนอราคาฟรี',
      fastHelpTitle: 'ต้องการสอบถามคิวว่าง หรือปรึกษาทีมงานด่วนทันที:',
      callHotline: 'โทรสายด่วน',
      chatLine: 'แชท LINE ทางการ',
      chatLineSuccess: 'ทักแชต LINE OA เพื่อส่งรายละเอียดเพิ่ม',
      successTitle: 'ส่งข้อมูลขอจัดงานแข่งสำเร็จแล้ว!',
      successDesc: 'เจ้าหน้าที่ฝ่ายประสานงานทัวร์นาเมนต์ GLP ได้รับข้อมูลของคุณเรียบร้อยแล้ว และจะติดต่อกลับผ่านเบอร์โทรศัพท์และ LINE เพื่อเสนอแพ็กเกจสถานที่ภายใน 24 ชม.'
    },
    franchisePlanner: {
      walkModeActive: "กำลังอยู่ในโหมดเดินชมร้านระดับสายตา",
      walkModeBtn: "เดินชมร้าน",
      storefrontViewTooltip: "มุมมองหน้าร้าน",
      storefrontViewBtn: "หน้าร้าน",
      switchTo3DTooltip: "สลับเป็นมุมมอง 3D",
      switchTo2DTooltip: "สลับเป็นมุมมองแปลนด้านบน",
      exitWalkModeTooltip: "ออกจากโหมดเดินชมร้าน (กด ESC ได้)",
      exitWalkModeBtn: "ออกจากโหมดเดิน (ESC)",
      orText: "หรือ",
      walkThroughVenue: "เดินชมในร้าน",
      mouse360: "เมาส์ 360°",
      clickMouse: "คลิกเมาส์",
      mouseLookLocked: "ขยับเมาส์หันมองรอบทิศ (FPS Lock)",
      mouseLookUnlocked: "คลิกเพื่อล็อคเมาส์หันมอง 360°",
      sprintKey: "วิ่งเร็ว",
      exitWalkOrUnlock: "ออกจากโหมดเดิน / ปลดล็อค",
      eyeLevel: "สายตา 1.65ม.",
      forwardTitle: "เดินหน้า (Forward)",
      strafeLeftTitle: "สเต็ปซ้าย (Strafe Left)",
      strafeRightTitle: "สเต็ปขวา (Strafe Right)",
      backwardTitle: "ถอยหลัง (Backward)",
      sprintToggleTitle: "สลับวิ่งเร็ว / เดิน",
      sprintOn: "วิ่งเร็ว (เปิด)",
      turnLeftTitle: "หมุนมุมมองซ้าย",
      turnLeftBtn: "หันซ้าย",
      turnRightTitle: "หมุนมุมมองขวา",
      turnRightBtn: "หันขวา",
      hintDesktop3D: "คลิกซ้ายค้างเพื่อหมุนรอบห้อง • คลิกขวาเพื่อเลื่อน • กดปุ่มลูกศรเพื่อย้ายโต๊ะ",
      hintMobile3D: "แตะเลื่อนเพื่อหมุน 360° • สองนิ้วเพื่อซูม",
      nudge3DGroupTitle: "เลื่อนตำแหน่งวัตถุใน 3D (หรือกดปุ่มลูกศรบนคีย์บอร์ด)",
      moveLabel: "ย้าย:",
      nudgeLeft3DTooltip: "เลื่อนซ้าย (-0.5ม.) หรือกดปุ่ม ←",
      nudgeRight3DTooltip: "เลื่อนขวา (+0.5ม.) หรือกดปุ่ม →",
      nudgeUp3DTooltip: "เลื่อนขึ้น/ลึก (-0.5ม.) หรือกดปุ่ม ↑",
      nudgeDown3DTooltip: "เลื่อนลง/หน้า (+0.5ม.) หรือกดปุ่ม ↓",
      rotate90Btn: "หมุน 90°",
      duplicateBtn: "คัดลอก",
      deleteBtnShort: "ลบ",
      mainEntranceCanvas: "ทางเข้าร้าน",
      pullDoorSign: "ดึง • PULL",

      toggleBlueprintHint: "เปิด/ปิดการแสดงผังแปลนที่แนบ",
      adjustDoorHeaderHint: "คลิกเพื่อปรับตำแหน่งประตูทางเข้าร้านและป้ายชื่อร้าน (ในแถบซ้าย)",
      adjustMaterialsHeaderHint: "คลิกเพื่อเปลี่ยนวอลเปเปอร์ผนังและวัสดุพื้น",
      addItemsHeaderHint: "คลิกเพื่อเปิดแท็บเพิ่มอุปกรณ์ (ในแถบซ้าย)",
      tabItemsTooltip: "ดูรายละเอียดอุปกรณ์ที่เลือก และรายการอุปกรณ์ในร้าน",
      tabDoorTooltip: "ปรับแต่งตำแหน่งประตูทางเข้าร้าน รูปแบบประตู และป้ายชื่อร้าน",
      tabMaterialsTooltip: "ปรับแต่งวอลเปเปอร์ผนังและวัสดุปูพื้นห้อง",
      tabCatalogTooltip: "เลือกและเพิ่มอุปกรณ์/โต๊ะคอมลงในผัง",
      closeDoorConfigTooltip: "ปิดหน้าต่างปรับประตู",
      storeNamePlaceholder: "เช่น GLP : G SPEED LIVING PLUS...",
      presetSiamSquare: "สาขา สยามสแควร์",
      closeSelectionTooltip: "ปิดการเลือก",
      viewSpecsAndZoomTooltip: "คลิกเพื่อดูสเปกเต็มและภาพสินค้าขยาย",
      duplicateModuleTooltip: "คัดลอกโมดูลนี้ (Duplicate)",
      deleteModuleTooltip: "ลบโมดูลนี้ออกจากผัง (กด Delete)",
      goToAddTabTooltip: "ไปที่แท็บเพิ่มอุปกรณ์",
      selectDoorTooltip: "คลิกเพื่อเลือกและปรับตำแหน่งประตูทางเข้าร้าน",
      expandDetailsTooltip: "คลิกเพื่อย่อข้อมูล",
      collapseDetailsTooltip: "คลิกเพื่อดูขนาด ราคา และจัดการอุปกรณ์",
      selectAndNudgeIn3DTooltip: "เลือกและปรับตำแหน่งในมุมมอง 3D",
      rotate90Tooltip: "หมุน 90 องศา",
      removeItemFromLayoutTooltip: "นำอุปกรณ์ชิ้นนี้ออกจากผังร้าน",
      changeWallpaperInTab2Tooltip: "คลิกเพื่อเปลี่ยนวอลเปเปอร์ในแท็บ 2",
      changeFloorInTab2Tooltip: "คลิกเพื่อเปลี่ยนวัสดุปูพื้นในแท็บ 2",
      adjustDoorWallTooltip: "คลิกเพื่อปรับตำแหน่งประตู",
      wallFront: "ด้านหน้า",
      wallLeft: "ผนังซ้าย",
      wallBack: "ผนังหลัง",
      wallRight: "ผนังขวา",
      activeInUse: "ใช้งานอยู่",
      viewFullSpecsCardHint: "คลิกเพื่อดูสเปกเต็มและภาพสินค้า",
      swatchesCardHint: "โทนสีวัสดุและไฟ",
      swatchDeskColor: "สีท็อปโต๊ะ",
      swatchAccentColor: "สีไฟตกแต่ง",
      swatchChairColor: "สีเก้าอี้",
      dimensionsLabel: "ขนาด:",
      heightLabel: "สูง",
      addDirectlyTo3DTooltip: "เพิ่มลงในผัง 3D ทันที",
      totalWithColon: "รวม",
      deskItemPrefix: "โต๊ะ",
      chairItemPrefix: "เก้าอี้",
      unitsPcs: "ตัว",
      clearEntireLayoutTooltip: "ล้างผังทั้งหมด",
      zoomOutBlueprintTooltip: "ซูมย่อแปลน (-)",
      zoomResetBlueprintTooltip: "คลิกเพื่อรีเซ็ต 100%",
      zoomInBlueprintTooltip: "ซูมขยายแปลน (+)",
      zoomFitBlueprintTooltip: "รีเซ็ตพอดีหน้าจอ (Fit to Screen 100%)",
      loungeSofa: "โซฟาเลานจ์",
      dragHandleTooltip: "คลิกเลือก หรือลากเพื่อย้ายตำแหน่ง",
      nudgeClusterTooltip: "กดเพื่อเลื่อนตำแหน่ง (หรือใช้ปุ่มลูกศร ↑ ↓ ← → บนคีย์บอร์ด)",
      nudgeLeftTooltip: "เลื่อนซ้าย 0.2ม. (กด ←)",
      nudgeUpTooltip: "เลื่อนขึ้น 0.2ม. (กด ↑)",
      nudgeDownTooltip: "เลื่อนลง 0.2ม. (กด ↓)",
      nudgeRightTooltip: "เลื่อนขวา 0.2ม. (กด →)",
      step3_stationsDesc: "สามารถเลือก Tier สเปกที่เหมาะสมกับกลุ่มลูกค้าและงบประมาณลงทุน (เก้าอี้เกมมิ่งรวมอยู่ในชุดโต๊ะแล้ว)",
      downloadBlueprintForContractorTooltip: "ดาวน์โหลดภาพแปลนสำหรับช่างและผู้รับเหมา (PNG)",
      companyNameLegal: "บริษัท จี-สปีด ลิฟวิ่ง พลัส จำกัด (สำนักงานใหญ่)",
      companyAddress: "เลขที่ 88/9 อาคารจี-สปีด ทาวเวอร์ ถนนพหลโยธิน แขวงลาดยาว เขตจตุจักร กรุงเทพฯ 10900",
      companyTaxIdContact: "เลขประจำตัวผู้เสียภาษีอากร: 0105566012345 | โทร: 02-888-9999 | เว็บไซต์: www.gspeed-esport.com",
      blueprintReceivedNoticePrefix: "ระบบได้บันทึกไฟล์พิมพ์เขียวและสัดส่วนพื้นที่",
      blueprintReceivedNoticeSuffix: "เรียบร้อยแล้ว สถาปนิก G-Speed จะนำผังนี้ไปขึ้นแบบโครงสร้าง 3D Interior เสมือนจริงความละเอียดสูง (Photo-realistic Render) และจัดเตรียมใบเสนอราคาทางการส่งกลับให้ท่านภายใน 24 ชม.",
      leadNamePlaceholder: "คุณสมเกียรติ มั่นคง",
      budgetCalculatedAuto: "คำนวณตามผังร้านและสเปค",
      budgetAutoOptionDesc: "คำนวณอัตโนมัติตามผัง",
      budget1to2m: "1,000,000 - 2,000,000 บาท",
      budget2to35m: "2,000,000 - 3,500,000 บาท",
      budget35to5m: "3,500,000 - 5,000,000 บาท",
      budget5mPlus: "5,000,000 บาทขึ้นไป (Flagship Arena)",
      budgetSummaryLabel: "งบประเมินรวมฮาร์ดแวร์และโครงสร้างพื้นฐาน:",
      leadNotesPlaceholder: "เช่น มีอาคารพาณิชย์ 2 คูหา ย่าน ม.เกษตรศาสตร์ ติดถนนใหญ่...",
      downloadBlueprintHint: "ดาวน์โหลดแปลนสำหรับช่าง (PNG)",
      closeModalAria: "ปิดหน้าต่าง",
      unzoomTooltip: "คลิกเพื่อย่อมุมมองปกติ",
      zoomTooltip: "คลิกเพื่อขยายดูตัวอักษรและรายละเอียดขนาดใหญ่ (100% Zoom)",

      step3_stationsBanner: "จำนวนเครื่องในผังของคุณปัจจุบันคือ",
      quoteModalHeaderTitle: "ใบเสนอราคาประเมินเบื้องต้น: แฟรนไชส์ GLP : G Speed Living Plus",
      quoteSuccessToastTitle: "บันทึกข้อมูลและส่งแปลนร้านเรียบร้อย!",
      quoteSuccessToastDesc: "ทีมวิศวกรและผู้เชี่ยวชาญแฟรนไชส์ของ GLP : G Speed Living Plus จะตรวจสอบผังที่คุณออกแบบ และติดต่อกลับเพื่อเสนอนัดสำรวจสถานที่จริงภายใน 24 ชม.",
      companyNameFull: "บริษัท จี-สปีด ลิฟวิ่ง พลัส จำกัด (สำนักงานใหญ่)",
      leadDefaultInvestor: "ผู้สนใจลงทุนแฟรนไชส์ (Franchise Investor)",
      blackObsidianVal: "Black Obsidian (ดำด้าน)",
      esportBlueVal: "Esport Blue (น้ำเงิน)",
      cyberCyanVal: "Cyber Cyan (ฟ้าสว่าง)",
      auraPurpleVal: "Aura Purple (ม่วง)",
      bahtShort: "บ.",
      thankYouFeasibilityBody: "เรากำลังนำข้อมูลขนาดพื้นที่",
      andCount: "และจำนวน",
      toPrepareFeasibility: "ไปจัดทำ รายงานวิเคราะห์ความเป็นไปได้ของโครงการ (Feasibility Study) พร้อมประมาณการผลตอบแทนรายเดือน โดยทีมงานผู้เชี่ยวชาญจะติดต่อกลับไปยังเบอร์",
      orEmail: "หรืออีเมล",
      within24Hours: "ภายใน 24 ชั่วโมง เพื่อส่งมอบเอกสารสรุปโครงการและนัดหมายให้คำปรึกษาแบบ 1-on-1 โดยไม่มีค่าใช้จ่าย",
      refBlueprint: "แปลนอ้างอิง:",
      stateOn: "เปิดอยู่",
      stateOff: "ปิด",
      opacityLabel: "ความชัด:",
      wallColor: "สีผนัง",
      floorColor: "สีพื้น",
      realProductPhotoBadge: "ภาพสินค้าจริงจากโรงงานผลิต G-Speed",
      colorAndFinishTitle: "โทนสีและวัสดุตกแต่งจริง (Color & Finish)",
      deskTopLegColor: "สีท็อป & ขาโต๊ะ",
      neonAccentColor: "สีไฟนีออน / ขอบตกแต่ง",
      chairLeatherColor: "สีหนังเก้าอี้เกมมิ่ง",
      racingBlackVal: "Racing Black (หนัง PU ดำเดินด้ายคู่)",
      specHplTop: "หน้าท็อปโต๊ะ:",
      specHplTopDesc: "ไม้สังเคราะห์ HPL (High Pressure Laminate) ความหนา 25 มม. เกรดทนความร้อน กันน้ำ 100% และกันรอยขูดขีด",
      specErgoEdge: "ขอบโต๊ะ Ergonomic:",
      specErgoEdgeDesc: "เจียรลบมุมลาดเอียง 45 องศา (Bevel Edge) ตามหลักสรีรศาสตร์ รองรับข้อมือผู้เล่นเกมได้สบายตลอดวัน",
      specSteelFrame: "โครงขาและคานรับแรง:",
      specSteelFrameDesc: "เหล็กกล้าคาร์บอน (Carbon Steel Box) หนา 1.5 - 2.0 มม. พ่นสีพาวเดอร์โค้ตกันสนิม รองรับน้ำหนักได้มากกว่า 250 กก.",
      chairModelLabel: "รุ่นเก้าอี้:",
      chairCountPrefix: "จำนวน",
      perStationSuffix: "ประจำสถานี",
      specCushion: "เบาะรองนั่ง:",
      specCushionDesc: "โฟมขึ้นรูปเย็นความหนาแน่นสูง (High-Density Cold-Cure Foam) ไม่ยุบตัว รับประกันการใช้งานต่อเนื่อง",
      specRecline: "ฟังก์ชันการปรับระดับ:",
      specReclineDesc: "ปรับเอนหลังได้ 160 องศา พร้อมระบบล็อกมัลติฟังก์ชัน + ที่พักแขน 3D/4D ปรับระดับความสูงและองศาได้",
      specGasLift: "ระบบรองรับน้ำหนัก:",
      specGasLiftDesc: "โช้กแก๊ส Class 4 ผ่านการทดสอบความปลอดภัยระดับสากล BIFMA รองรับน้ำหนักสูงสุด 150 กก./ตัว",
      specRaceway: "รางร้อยสายไฟใต้โต๊ะ (Dual Cable Raceway):",
      specRacewayDesc: "รางเหล็กซ่อนสายไฟ 2 ช่องอิสระ แยกท่อไฟฟ้ากำลัง 220V และสายแลน LAN ป้องกันสัญญาณรบกวน (Zero Interference)",
      specSocket: "จุดเต้ารับไฟฟ้าต่อสถานี:",
      specSocketDesc: "เต้ารับคู่ 3 ขา มีกราวด์ (Universal Socket 220V 16A) พร้อมเบรกเกอร์กันไฟกระชาก (Surge Protection) 1:1",
      specLan: "การเชื่อมต่อเน็ตเวิร์ก:",
      specLanDesc: "เต้ารับ LAN RJ-45 CAT6A Shielded ความเร็ว 10Gbps Ready พร้อมท่อร้อยสายเชื่อมตรงสู่ตู้ Rack เซิร์ฟเวอร์",
      standardDeskPrefix: "โต๊ะมาตรฐาน",
      racewayIncluded: "รางสายไฟครบชุด",
      zooming100: "กำลังซูม 100% (คลิกเพื่อย่อภาพรวม)",
      clickToZoom100: "คลิกภาพเพื่อซูมดูตัวหนังสือและอุปกรณ์ 100%",
      hintLabel: "คำแนะนำ:",
      zoomedHint: "คลิกที่ภาพเพื่อย่อมุมมองปกติ | เลื่อนลูกกลิ้งเมาส์เพื่อดูส่วนต่างๆ",
      unzoomedHint: "คลิกที่ภาพ หรือกดปุ่ม \"ขยายดูอุปกรณ์ 100%\" เพื่ออ่านตัวหนังสือชัดเจน",
      saveFilePng: "บันทึกไฟล์ (PNG)",
      zoomFit: "ย่อมุมมอง",
      zoom100: "ซูม 100%",
      openNewTab: "เปิดแท็บใหม่",
      boqItem1_title: "ชุดเครื่องคอมพิวเตอร์เกมมิ่งสเปก",
      monitor: "จอ",
      gamingGear: "เกมมิ่งเกียร์",
      boqItem1_note: "(ไม่รวมเก้าอี้ - รวมในชุดโต๊ะ)",
      boqItem2_title: "ชุดโต๊ะคอมพิวเตอร์เกมมิ่งพร้อมเก้าอี้ Ergonomic และโซนพิเศษในผัง",
      boqItem2_desc: "จัดวางตามผังร้าน",
      modulesUnit: "โมดูล",
      unitSet: "ชุด",
      unitSystem: "ระบบ",
      unitBranch: "สาขา",
      boqItem2_note: "(รวมเก้าอี้ Ergonomic ครบตามจำนวนที่นั่ง, รางร้อยสายไฟ, และกล่องเต้ารับคู่ 3 ขา)",
      boqItem3_title: "งานตกแต่งภายใน ระบบฝ้า ผนังกันเสียง & ไฟ Linear Modern",
      boqItem3_desc: "งานผนัง Acoustic ซับเสียง, งานพื้น Epoxy/กระเบื้องยาง Heavy-Duty, ป้ายไฟอะคริลิกเรืองแสงโลโก้แบรนด์",
      boqItem4_title: "งานระบบปรับอากาศ Inverter Cassette Type ประหยัดพลังงาน",
      boqItem4_desc: "เครื่องปรับอากาศฝังฝ้า 4 ทิศทาง พร้อมระบบระบายอากาศ Fresh Air Circulation สำหรับบริการ 24 ชม.",
      boqItem5_title: "ระบบแม่ข่าย Diskless Server 10Gbps NVMe High-Availability",
      boqItem5_desc: "เซิร์ฟเวอร์สำรอง Dual-Host ระบบอัปเดตเกมอัตโนมัติความเร็วสูง รองรับการบูตพร้อมกันโดยไม่มีสะดุด",
      boqItem6_title: "ระบบโครงข่ายเน็ตเวิร์ก Enterprise Dual-WAN & Cisco 10G Switch",
      boqItem6_desc: "สายสัญญาณ LAN CAT6A Shielded + ตู้ Rack 42U Server + ระบบ UPS สำรองไฟขนาด 10kVA",
      boqItem7_title: "ระบบบริหารจัดการร้าน Billing & Cloud Member POS System",
      boqItem7_desc: "โปรแกรมคิดเงิน ลิ้นชักเก็บเงิน เครื่องสแกนบาร์โค้ด และระบบสมาชิกระดับคลาวด์เชื่อมต่อส่วนกลาง",
      boqItem8_title: "ค่าสิทธิ์แฟรนไชส์ G-SPEED & บริการ Turnkey Onboarding ครบวงจร",
      boqItem8_desc: "สิทธิ์การใช้แบรนด์, แปลนก่อสร้าง 3D, จัดฝึกอบรมผู้จัดการและพนักงาน, การตลาดและโปรโมทเปิดร้าน",
      subtotalPreTax: "ยอดรวมประมาณการลงทุนก่อนภาษี (Subtotal):",
      vat7Label: "ภาษีมูลค่าเพิ่ม 7% (VAT 7%):",
      term1_title: "เงื่อนไขการชำระเงินแบ่ง 3 งวด:",
      term1_desc: "งวดที่ 1 (มัดจำลงนามสัญญา) 30% | งวดที่ 2 (จัดส่งและติดตั้งอุปกรณ์) 50% | งวดที่ 3 (ตรวจรับงานและเปิดร้าน) 20%",
      term2_title: "การรับประกัน (Warranty):",
      term2_desc: "อุปกรณ์คอมพิวเตอร์และเซิร์ฟเวอร์รับประกัน On-site Service 3 ปีเต็ม, ระบบ Network ดูแลตลอด 24 ชม. ผ่าน Cloud Monitoring",
      term3_title: "ระยะเวลาก่อสร้างและส่งมอบ:",
      term3_desc: "ดำเนินการแล้วเสร็จภายใน 4 - 6 สัปดาห์ พร้อมเปิดให้บริการเชิงพาณิชย์",
      term4_title: "ราคารวมงานแบบเบ็ดเสร็จ (Turnkey):",
      term4_desc: "รวมค่าขนส่ง, การติดตั้งสายระบบไฟฟ้า, สายแลน, การคอนฟิกระบบ Diskless และการอบรมบุคลากร",
      signNeonLed: "นีออน LED",
      signGoldAcrylic: "อะคริลิกทอง",
      signMinimalCyber: "มินิมอลไซเบอร์",
      signGrandArch: "ซุ้มแกรนด์",
      wallpaperKey: "วอลเปเปอร์:",
      floorKey: "วัสดุปูพื้น:",
      doorEntranceKey: "ประตูทางเข้า:",
      fitScreen: "พอดีจอ",
      entrance: "ทางเข้า",
      selectedPill: "เลือกอยู่",
      newItemDragPrompt: "ชิ้นใหม่! ลากจัดผังได้เลย",
      dragFreely: "คลิกลาก",
      moveFree: "ย้ายอิสระ",
      arrowKeysLabel: "ลูกศร",
      onKeyboard: "บนคีย์บอร์ด",
      controlsGuideTitle: "การควบคุม:",
      controlsGuideDesc: "หมุนมุมมองอิสระ 360° ด้วยเมาส์ซ้าย • ซูมเข้า-ออกด้วยลูกกลิ้ง • คลิกเลือกวัตถุเพื่อดูราคาโต๊ะและเก้าอี้",
      quoteDocBadge: "ใบเสนอราคา / ESTIMATED QUOTATION",
      quoteRefNo: "เลขที่ใบเสนอราคา:",
      quoteIssueDate: "วันที่ออกเอกสาร:",
      quoteValidity: "กำหนดยืนราคา:",
      quoteValidityVal: "30 วันนับจากวันที่ระบุ",
      customerInfoTitle: "ข้อมูลลูกค้า / ผู้ขอรับสิทธิ์แฟรนไชส์ (CUSTOMER INFO)",
      customerNameLabel: "ชื่อลูกค้า / นิติบุคคล:",
      customerPhoneLabel: "เบอร์โทรศัพท์ติดต่อ:",
      customerEmailLabel: "อีเมลติดต่อ:",
      customerBudgetLabel: "งบประมาณที่เตรียมไว้:",
      projectSpecsTitle: "ข้อมูลโครงการสาขา (PROJECT SPECIFICATIONS)",
      storeLocationLabel: "ทำเลที่ตั้งสาขา:",
      roomDimensionsLabel: "ขนาดพื้นที่ร้าน:",
      pcSpecsLabel: "สเปกคอมพิวเตอร์:",
      areaSizeLabel: "ขนาดพื้นที่:",
      stationsCountLabel: "จำนวนเครื่อง:",
      installDurationLabel: "ระยะเวลาติดตั้ง:",
      installDurationVal: "4-6 สัปดาห์",
      paybackEstLabel: "จุดคุ้มทุนประเมิน:",
      attachedBlueprintLabel: "แนบแปลนอาคาร:",
      customBpAttachedTitle: "แบบแปลนอาคารแนบพิเศษ (Custom Blueprint Attached)",
      boqColNo: "ลำดับ",
      boqColDesc: "รายการรายละเอียดอุปกรณ์และงานระบบ (BOQ ITEM DESCRIPTION)",
      boqColQty: "จำนวน",
      boqColUnit: "ราคาต่อหน่วย",
      boqColTotal: "รวมเงิน (บาท)",
      boqSubtotal: "รวมราคาสินค้าและบริการ (SUBTOTAL):",
      boqVat: "ภาษีมูลค่าเพิ่ม (VAT 7%):",
      boqGrandTotal: "ยอดรวมสุทธิทั้งสิ้น (GRAND TOTAL):",
      commercialTermsTitle: "เงื่อนไขและข้อตกลงทางการค้า (COMMERCIAL TERMS & WARRANTY)",
      authorizedSignatureTitle: "ผู้อนุมัติเสนอราคา (Authorized Signature)",
      franchiseDeptTitle: "ฝ่ายพัฒนาธุรกิจแฟรนไชส์ / G-Speed Living Plus Co., Ltd.",
      franchiseeAcceptanceTitle: "ผู้ขอรับสิทธิ์แฟรนไชส์ / ลูกค้า (Franchisee Acceptance)",
      agreementTitle: "ผู้ตกลงยินยอมตามใบเสนอราคา",
      datePrefix: "วันที่:",
      calcByLayout: "คำนวณอัตโนมัติตามผัง",
      customBudgetConsult: "มีงบประมาณเฉพาะ / ปรึกษาผู้เชี่ยวชาญ",
      thankYouRefSaved: "บันทึกแปลนร้านสำเร็จ • REF ID:",
      thankYouTitle: "ขอขอบพระคุณที่ให้ความไว้วางใจ",
      thankYouSubtitle: "ทีมวิศวกรออกแบบระบบและที่ปรึกษาการลงทุนแฟรนไชส์ GLP ได้รับข้อมูลพิมพ์เขียวผังร้านของคุณเรียบร้อยแล้ว",
      slaTitle: "การประสานงานติดต่อกลับภายใน 24 ชั่วโมง",
      placedLayoutLabel: "ผังร้านที่จัดวาง",
      estBudgetLabel: "งบประมาณประเมิน",
      emailStatusLabel: "สถานะอีเมลตอบกลับ",
      autoCopySent: "ส่งสำเนาอัตโนมัติแล้ว",
      autoRedirectCountdownPrefix: "ระบบกำลังพาท่านกลับสู่หน้าแรกอัตโนมัติในอีก",
      secondsUnit: "วินาที",
      goToHomeBtn: "กลับสู่หน้าหลักทันที (Go to Home)",
      stayOnPlannerBtn: "ดูแปลนจำลองต่อ",
      step1_presetsLabel: "เลือกโมเดลขนาดสำเร็จรูป (Preset Models):",
      step1_widthMetersLabel: "ความกว้างห้อง (Width):",
      step1_lengthMetersLabel: "ความลึก/ความยาวห้อง (Length):",
      totalAreaLabel: "พื้นที่ใช้สอยรวม:",
      supportsApprox: "รองรับได้ประมาณ",
      comfortableSeating: "แบบไม่อึดอัด",
      haveBlueprintPrompt: "มีแบบแปลนพิมพ์เขียวอาคารจริงของคุณอยู่แล้ว?",
      switchToBlueprint: "สลับไปอัปโหลดแปลน (ตัวเลือกเสริม)",
      dragBlueprintHint: "ลากไฟล์แปลนอาคารมาวางที่นี่ หรือคลิกเพื่อเลือกไฟล์ (ตัวเลือกเสริม)",
      blueprintFormatsHint: "รองรับไฟล์ภาพแบบแปลนพิมพ์เขียว, ภาพวาดผังร้าน, สเก็ตช์ 2D, ไฟล์สแกน (PNG, JPG, WEBP)",
      selectBlueprintFile: "เลือกไฟล์แปลนจากเครื่อง",
      useSampleBlueprint: "ทดลองใช้แปลนตัวอย่างอาคารพาณิชย์",
      aiScanningBlueprint: "AI กำลังสแกนแปลนอาคาร วัดสเกลพื้นที่ และคำนวณการจัดสรรโซนร้านเกม...",
      blueprintAttached: "แนบแปลนสำเร็จ:",
      deleteBlueprint: "ลบแปลนนี้",
      changeBlueprint: "เปลี่ยนไฟล์ใหม่",
      actualBuildingWidth: "ความกว้างอาคารจริง (Width):",
      actualBuildingLength: "ความลึก/ความยาวอาคารจริง (Length):",
      recommendedCapacity: "ความจุเครื่องที่แนะนำ:",
      estimatedCapex: "งบลงทุนประมาณการ:",
      estimatedMonthlyProfit: "กำไรสุทธิคาดการณ์:",
      roiPaybackPeriod: "จุดคุ้มทุน (ROI):",
      calculatedZoneAllocation: "การจัดสรรสัดส่วนโซนที่คำนวณได้:",
      smartLayoutAdviceTitle: "คำแนะนำเชิงกลยุทธ์การจัดวางผังร้าน (Smart Layout Advice)",
      autoLayoutBtn: "จัดวางผังร้านอัตโนมัติ",
      manualLayoutBtn: "จัดวางผังด้วยตนเอง",
      wantStandardPreset: "ต้องการใช้ขนาดห้องและโมเดลสำเร็จรูปมาตรฐาน?",
      switchToStandardPreset: "สลับไปใช้โมเดลสำเร็จรูป (ค่าเริ่มต้น)",
      usingBlueprint: "ใช้แปลนอาคาร:",
      simulatedSpaceSize: "ขนาดพื้นที่จำลอง:",
      loc_bkk: "กรุงเทพฯ และปริมณฑล (ย่านมหาวิทยาลัย/ชุมชน)",
      loc_cm: "เชียงใหม่ / ภาคเหนือ",
      loc_esan: "ขอนแก่น / โคราช / ภาคอีสาน",
      loc_east: "ชลบุรี / พัทยา / ภาคตะวันออก",
      loc_south: "ภูเก็ต / สงขลา / ภาคใต้",
      type_shophouse: "อาคารพาณิชย์ 2-3 คูหา (Commercial Shophouse)",
      type_mall: "พื้นที่เช่าในศูนย์การค้า / ไลฟ์สไตล์มอลล์ (Shopping Mall)",
      type_standalone: "อาคารเดี่ยว Standalone หรือโกดัง Renovate",
      type_campus: "ใกล้มหาวิทยาลัย / หอพักนักศึกษา",
      initialCostSummary: "สรุปงบลงทุนเบื้องต้น",
      hardwareCostRow: "ฮาร์ดแวร์",
      furnitureCostRow: "โต๊ะ เก้าอี้ และห้อง VIP:",
      interiorCostRow: "งานตกแต่ง Interior",
      airconCostRow: "ระบบแอร์ & ระบายอากาศ:",
      franchiseFeeRow: "ค่าแฟรนไชส์ & สิทธิ์การใช้แบรนด์:",
      totalInvestmentEstimateLabel: "งบประมาณลงทุนรวมโดยประมาณ:",
      turnkeyIncludedNote: "* รวมฮาร์ดแวร์ ตกแต่ง และเปิดร้านพร้อมใช้งาน",
      nextChooseSpecsWithCount: "ถัดไป: เลือกสเปก",
      viewFullSpecs: "ดูสเปกเต็ม",
      dimSizePrefix: "ขนาด:",
      totalPricePrefix: "รวม",
      viewSpecsShort: "ดูสเปก",
      deskPrefix: "โต๊ะ",
      chairsPrefix: "เก้าอี้",
      presetLayoutModels: "โมเดลผังร้านสำเร็จรูป:",
      clearLayoutAll: "ล้างผังทั้งหมด",
      addEquipmentTitle: "เพิ่มอุปกรณ์และโซนในร้าน",
      addEquipmentSubtitle: "กดปุ่ม + ด้านขวา เพื่อเพิ่มโต๊ะ/อุปกรณ์ลงในห้องทันที",
      cat_stations_short: "โต๊ะคอม",
      cat_service_short: "บริการ/เคาน์เตอร์",
      cat_doors_short: "ประตู/หน้าต่าง",
      adminLabel: "ผู้ดูแลระบบ:",
      adminDesc: "สามารถเข้าไปปรับแต่งรายละเอียดสเปก เพิ่มโมเดล หรือแก้ไขราคาต่อเครื่องและงานระบบได้ทุกจุด",
      adminCmsBtn: "เปิดแผงจัดการสเปก & ราคา (Admin CMS)",
      perStationFullSet: "เครื่อง (ครบชุด)",
      totalForStations: "รวม",
      gamingChairLabel: "เก้าอี้เกมมิ่ง:",
      gamingChairIncludedNote: "รวมอยู่ในชุดโต๊ะเกมมิ่งแล้ว",
      selectedThisTier: "เลือกสเปกนี้แล้ว",
      selectThisTier: "เลือกใช้สเปกนี้",
      includedInfraTitle: "ระบบเซิร์ฟเวอร์แม่ข่าย & เครือข่าย (Included Infrastructure)",
      disklessServerDesc: "แม่ข่าย NVMe Enterprise 2 เครื่อง รันเกม 200+ เกม ไม่ต้องลงเกมทีละเครื่อง อัปเดตแพทช์อัตโนมัติ 24 ชม.",
      dualWanDesc: "ระบบสำรองเน็ต 2 เส้น อัตโนมัติ ป้องกันเน็ตหลุด ปิงนิ่งระดับ 1-3ms พร้อม Cisco Managed Switch 10G",
      billingPosDesc: "ระบบบริหารจัดการสมาชิก คิดเงิน คุมเวลาหน้าจอ และสั่งเครื่องดื่มผ่านโต๊ะคอมพิวเตอร์ มีแดชบอร์ดดูยอดขายบนมือถือ",
      nextBudgetRoi: "ถัดไป: สรุปงบ",
      turnkeyBreakdownTitle: "แจกแจงรายการต้นทุน (Turnkey Breakdown)",
      workCategoryHeader: "หมวดหมู่งาน",
      detailsHeader: "รายละเอียด",
      budgetHeader: "งบประมาณ",
      costItem1_title: "1. เครื่องคอมพิวเตอร์ & เกมมิ่งเกียร์ (ไม่รวมเก้าอี้)",
      costItem2_title: "2. ชุดโต๊ะคอมเกมมิ่ง & เก้าอี้ Ergonomic ในผัง",
      costItem2_desc: "โต๊ะเกมมิ่งพร้อมเก้าอี้ตามจำนวนที่นั่ง, ห้อง VIP, เวที 5v5",
      costItem3_title: "3. ตกแต่งภายใน & ไฟ Linear Modern",
      costItem3_desc: "พื้น, ผนังกันเสียง, ไฟ Linear",
      costItem4_title: "4. งานระบบแอร์ Inverter",
      costItem4_desc: "แอร์ Cassette 4 ทิศทาง",
      costItem5_title: "5. แม่ข่าย Diskless Server 10G",
      costItem5_desc: "Server แม่ข่าย NVMe 2 ชุด + คลังเกม 200+ เกม อัปเดตอัตโนมัติ",
      costItem6_title: "6. เน็ตเวิร์ก Enterprise Dual-WAN",
      costItem6_desc: "Cisco 10G Switches, Mikrotik Router, สายแลน Shielded, ตู้ Rack",
      costItem7_title: "7. ซอฟต์แวร์ Billing & เครื่อง POS",
      costItem7_desc: "ระบบคุมเครื่อง, ลิ้นชักเก็บเงิน, สแกนเนอร์, ระบบสั่งอาหาร",
      costItem8_title: "8. ค่าแฟรนไชส์ & การอบรมเปิดร้าน",
      costItem8_desc: "สิทธิ์ใช้แบรนด์ G-Speed, แบบ 3D ก่อสร้าง, อบรมพนักงาน, การตลาดวันเปิดร้าน",
      costTotal_title: "รวมงบประมาณลงทุนทั้งสิ้น (Turnkey Package):",
      costTotal_status: "พร้อมเปิดให้บริการ",
      interactiveRoiTitle: "จำลองรายได้ & ระยะเวลาคืนทุน (Interactive ROI)",
      hourlyRateLabel: "อัตราค่าบริการ (บาท / ชั่วโมง):",
      bahtPerHour: "บาท/ชม.",
      occupancyRateLabel: "อัตราการใช้งานเฉลี่ย (Occupancy Rate):",
      occLow: "น้อย",
      occStandard: "มาตรฐาน",
      occPrime: "ทำเลทอง",
      monthlyRevenueKpi: "รายรับต่อเดือน",
      averagePerDay: "เฉลี่ย",
      dayUnit: "วัน",
      monthlyNetProfitKpi: "กำไรสุทธิต่อเดือน",
      annualRoiKpi: "ผลตอบแทนต่อปี (ROI)",
      paybackInMonths: "คืนทุนใน",
      gamingHourRevenue: "รายได้ค่าชั่วโมงเล่นเกม",
      fnbRevenue: "รายได้จำหน่ายเครื่องดื่ม & อาหารว่าง:",
      grossMonthlyRevenue: "รายรับรวมต่อเดือน (Gross Revenue):",
      electricityCostEst: "ค่าไฟ & แอร์ประมาณการ:",
      staffSalariesEst: "เงินเดือนพนักงาน (2-3 กะ):",
      internetMiscEst: "ค่าอินเทอร์เน็ต & เบ็ดเตล็ด:",
      netProfitTitle: "กำไรสุทธิโดยประมาณ (Net Profit):",
      paybackEstTitle: "คาดว่าจะคืนทุนใน:",
      timelineTitle: "ระยะเวลาในการก่อสร้างและติดตั้ง (ประมาณ 6 สัปดาห์)",
      timelineDesc: "ขั้นตอนการดำเนินงานแบบ Turnkey ตั้งแต่สำรวจพื้นที่จนถึงวัน Grand Opening พร้อมเปิดให้บริการ",
      requestQuoteBtn: "ขอใบเสนอราคา",
      dimSizeWidth: "ความกว้าง (Width)",
      dimSizeDepth: "ความลึก (Depth)",
      dimSizeHeight: "ความสูง (Height)",
      seatsInSet: "จำนวนที่นั่งในเซ็ต",
      servicePoint: "จุดบริการ",
      setPriceWithInstall: "ราคารวมเซ็ตพร้อมติดตั้ง:",
      vatAndInstallIncluded: "(รวมภาษีและค่าติดตั้ง)",
      customDesk: "โต๊ะสั่งผลิต:",
      gamingChairsCount: "เก้าอี้เกมมิ่ง",
      specSection1_title: "1. สเปกวัสดุและโครงสร้างทางวิศวกรรม (Material & Construction)",
      specSection2_title: "2. สเปกเก้าอี้เกมมิ่งและอุปกรณ์ที่มาในเซ็ต (Included Furniture)",
      specSection3_title: "3. ระบบท่อร้อยสายไฟและโครงข่ายเน็ตเวิร์ก (Electrical & LAN Raceway)",
      specSection4_title: "4. การรับประกันและระยะเวลาผลิต (Warranty & Delivery)",
      warrantyLabel: "การรับประกัน:",
      leadTimeLabel: "ระยะเวลาสั่งผลิต:",
      modelIncludes: "โมเดลนี้ประกอบด้วย:",
      closeWindow: "ปิดหน้าต่าง",
      addTo3dPlan: "เพิ่มลงในผัง 3D (Add to Plan)",
      delModalTitle: "ยืนยันนำอุปกรณ์ออกจากผัง?",
      delModalDesc: "คุณต้องการนำอุปกรณ์ชิ้นนี้ออกจากแบบจำลองผังร้าน 3D ใช่หรือไม่?",
      delModalSubtext: "ท่านสามารถเลือกเพิ่มอุปกรณ์ชิ้นนี้กลับเข้ามาใหม่ได้ตลอดเวลาจากแท็บ",
      confirmRemove: "ยืนยันนำอุปกรณ์ออก",
      cancel: "ยกเลิก",
      leadFormTitle: "ต้องการให้ทีมงาน G-Speed ติดต่อกลับพร้อมส่งแปลนร้านนี้",
      fullName: "ชื่อ - นามสกุล",
      phone: "เบอร์โทรศัพท์ (ติดต่อกลับ)",
      email: "อีเมล (รับใบเสนอราคา)",
      budgetLabel: "งบประมาณลงทุนที่เตรียมไว้",
      locationLabel: "ทำเลหรือจังหวัดที่สนใจเปิดสาขา",
      submittingLead: "กำลังส่งข้อมูล...",
      submitLeadBtn: "ส่งแปลนขอคำปรึกษา",
      downloadBlueprintPng: "ดาวน์โหลดแปลน (PNG)",
      printQuotationBtn: "พิมพ์ใบเสนอราคา",
      prevStep: "ย้อนกลับ",
      badge: '3D SMART FRANCHISE PLANNER',
      title: 'ระบบจำลองผังร้านและคำนวณงบประมาณแฟรนไชส์ 3D',
      subtitle: 'จัดวางโต๊ะคอมพิวเตอร์ เวทีแข่งขัน เคาน์เตอร์ และระบบตกแต่ง พร้อมคำนวณงบประมาณและสเปกเครื่องอัตโนมัติ',
      tabStoreSize: '1. กำหนดขนาดร้าน',
      tabLayout: '2. จัดวางผัง 2D/3D',
      tabHardware: '3. เลือกสเปกคอม',
      tabQuote: '4. สรุปงบ & ขอใบเสนอราคา',
      view2D: 'มุมมองผัง 2D',
      view3D: 'มุมมอง 3D Studio',
      totalArea: 'พื้นที่รวม',
      recommendedStations: 'จำนวนเครื่องที่แนะนำ',
      estimatedCapex: 'งบลงทุนเบื้องต้น (CAPEX)',
      monthlyProfit: 'กำไรสุทธิคาดการณ์/เดือน',
      paybackPeriod: 'ระยะเวลาคืนทุนประมาณ',
      months: 'เดือน',
      exportPdf: 'พิมพ์ / บันทึก PDF',
      requestQuote: 'ขอใบเสนอราคาอย่างเป็นทางการ',
      step1Title: 'กำหนดขนาดพื้นที่ร้านของคุณ',
      step1Desc: 'ระบุความกว้างและความยาวของห้องเพื่อสร้างโมเดล 3D แบบเรียลไทม์ หรือเลือกผังห้องตัวอย่างสำเร็จรูปเพื่อเริ่มต้นทันที',
      roomWidth: 'ความกว้าง (เมตร)',
      roomLength: 'ความยาว (เมตร)',
      presetsTitle: 'ผังห้องตัวอย่างสำเร็จรูป',
      uploadBlueprint: 'แนบไฟล์แปลนช่าง / ผังโครงสร้างอาคาร',
      nextStep: 'ไปยังขั้นตอนถัดไป',
      prevStep: 'ย้อนกลับ',
      step2Title: 'ออกแบบผังร้าน 3D & แปลน 2 มิติ',
      mode3D: '3D Studio',
      mode2D: '2D Blueprint (แปลน 2 มิติ)',
      autoLayout: 'จัดผังอัตโนมัติ',
      fullscreen: 'ขยายเต็มจอ',
      exitFullscreen: 'ออกจากเต็มจอ (ESC)',
      exitWalk: 'ออกจากโหมดเดิน (ESC)',
      walkMode: 'เดินชมร้าน',
      storefront: 'หน้าร้าน',
      topDown: 'แปลน 2D',
      doorEntrance: 'ประตูทางเข้า',
      wallFront: 'ด้านหน้า',
      wallRight: 'ผนังขวา',
      wallLeft: 'ผนังซ้าย',
      wallBack: 'ผนังหลัง',
      tabDetails: 'รายละเอียด',
      tabDoor: 'ประตูร้าน',
      tabMaterials: 'ผนัง/พื้น',
      tabCatalog: '+ เพิ่มอุปกรณ์',
      roomSize: 'ขนาดห้อง:',
      placedStations: 'คอมพิวเตอร์ที่วางแล้ว:',
      placedItemsCount: 'ชิ้นส่วนในผัง:',
      aisleStatus: 'สถานะระยะทางเดิน:',
      aisleSafe: 'ได้มาตรฐาน ปลอดภัย',
      aisleCrowded: 'หนาแน่นเกินไป',
      blueprintExport: 'แปลนช่าง (PNG)',
      step3Title: 'เลือกระดับสเปกคอมพิวเตอร์ สำหรับทั้งร้าน',
      step3Desc: 'จำนวนเครื่องในผังของคุณปัจจุบันคือ',
      unitStation: 'เครื่อง (ครบชุด)',
      totalFor: 'รวม',
      step4Title: 'สรุปประมาณการงบประมาณลงทุนรวม',
      requestQuoteTitle: 'ขอใบเสนอราคาอย่างเป็นทางการ',
      submitQuoteBtn: 'ส่งข้อมูลขอรับใบเสนอราคา',
      fullName: 'ชื่อ - นามสกุล',
      phone: 'เบอร์โทรศัพท์ (ติดต่อกลับ)',
      email: 'อีเมล (รับใบเสนอราคา)',
      budgetLabel: 'งบประมาณลงทุนที่เตรียมไว้',
      locationLabel: 'ทำเลหรือจังหวัดที่สนใจเปิดสาขา',
      noteLabel: 'ข้อความเพิ่มเติม / ความต้องการพิเศษ',
      step1_setupTitle: 'กำหนดขนาดห้องและแปลนอาคาร',
      step1_setupDesc: 'เลือกโมเดลขนาดห้องสำเร็จรูป (Preset) เป็นค่าพื้นฐานเพื่อเริ่มคำนวณและวางผังได้ทันที หรือเลือกตัวเลือกเสริมอัปโหลดแปลนพิมพ์เขียวอาคารจริง',
      step1_presetTab: 'กำหนดค่า',
      step1_blueprintTab: 'อัปโหลดแปลนอาคาร',
      step1_defaultBadge: 'ค่าเริ่มต้น',
      step1_optionalBadge: 'ตัวเลือกเสริม AI',
      step1_roomPresets: 'เลือกขนาดห้องสำเร็จรูป (Preset Room Models):',
      step1_manualSliders: 'ปรับขนาดห้องตามต้องการ (Custom Dimensions):',
      step1_widthM: 'ความกว้าง (Width):',
      step1_lengthM: 'ความยาว (Length):',
      step1_sqm: 'ตร.ม.',
      step1_meters: 'เมตร',
      step1_locationCardTitle: 'ข้อมูลทำเล & ธีมการตกแต่ง',
      step1_provinceLabel: 'จังหวัด / โซนที่ตั้งร้าน',
      step1_storeTypeLabel: 'ประเภทอาคาร / สถานที่',
      step1_themeLabel: 'ธีมการตกแต่งร้าน (Interior Style)',
      step1_nextBtn: 'ถัดไป: จัดผังร้าน',
      step2_aisleStandard: 'ได้มาตรฐาน ปลอดภัย',
      step2_aisleDense: 'หนาแน่นเกินไป',
      step2_nextBtn: 'ถัดไป: เลือกสเปกคอม',
      step2_prevBtn: 'ย้อนกลับ',
      step2_rotateLandscape: 'สลับหมุนจอ 90°',
      step2_restoreLandscape: 'คืนค่ามุมมองปกติ',
      step2_landscapeHint: 'โหมดเต็มจอ: แนะนำหมุน iPad / แท็บเล็ต เป็นแนวนอนเพื่อมุมมองที่ดีที่สุด',
      step3_nextBtn: 'ถัดไป: ดูงบ & ROI',
      step3_hardwareTotal: 'งบประมาณฮาร์ดแวร์คอมพิวเตอร์รวม:',
      step3_hardwareTier: 'เลือกระดับสเปกคอมพิวเตอร์ (Hardware Tier)',
      step4_capexBreakdown: 'โครงสร้างงบประมาณลงทุนรวม (CAPEX Breakdown)',
      step4_roiSimulator: 'แบบจำลองผลตอบแทนการลงทุน (ROI Simulator)',
      step4_printQuote: 'พิมพ์ใบเสนอราคา (A4)',
      step4_officialQuoteBtn: 'ขอใบเสนอราคาอย่างเป็นทางการ',
      step4_hourlyRate: 'ราคาชั่วโมงเฉลี่ย',
      step4_occupancy: 'อัตราครองเครื่องเฉลี่ย',
      step4_operatingHours: 'ชั่วโมงเปิดบริการ/วัน',
      step4_monthlyRevenue: 'รายได้คาดการณ์/เดือน',
      step4_monthlyOpex: 'ค่าใช้จ่ายดำเนินงาน/เดือน (OPEX)',
      step4_monthlyProfit: 'กำไรสุทธิคาดการณ์/เดือน',
      step4_payback: 'ระยะเวลาคืนทุนโดยประมาณ',
      step4_paybackMonths: 'เดือน',
      touchWalkHint: '👆 ลากนิ้วบนหน้าจอเพื่อเดินชม หรือกดปุ่มควบคุมด้านล่าง',
      lockMouseHint: 'คลิกบนหน้าจอเพื่อล็อคเมาส์หันมองแบบเกม FPS',
      exitWalkModeTitle: 'กดเพื่อออกจากโหมดเดินชมร้าน (ESC)',
      exitFullscreenTitle: 'กดเพื่อออกจากโหมดเต็มจอ (ESC)',
      doorConfigTitle: 'กำหนดประตูทางเข้าร้าน (Store Entrance)',
      doorSelectWall: 'เลือกผนังติดตั้งประตูร้าน:',
      wallFrontFull: 'ด้านหน้า (Front)',
      wallRightFull: 'ผนังขวา (Right)',
      wallLeftFull: 'ผนังซ้าย (Left)',
      wallBackFull: 'ผนังหลัง (Back)',
      doorStyle: 'รูปแบบประตู:',
      doorSingle: 'แบบ 1 บาน (ฟิล์มดำ)',
      doorDouble: 'แบบ 2 บาน (ฟิล์มดำ)',
      storeNameLabel: 'ชื่อร้าน / สติ๊กเกอร์หน้าร้าน:',
      signStyleLabel: 'รูปแบบป้าย & สติ๊กเกอร์หน้าร้าน:',
      signNeon: 'นีออน LED',
      signGold: 'อะคริลิกทอง',
      signMinimal: 'มินิมอลไซเบอร์',
      signArch: 'ซุ้มแกรนด์',
      // Breadcrumbs & Stepper
      step1_crumb: 'ขนาด',
      step2_crumb: 'จัดผัง 3D Studio',
      step3_crumb: 'สเปกคอม',
      step4_crumb: 'งบ & ROI',
      metricCapacity: 'ความจุ:',
      metricArea: 'พื้นที่:',
      metricInvestment: 'งบลงทุน:',
      metricPayback: 'คืนทุน:',
      chooseSpecsBtn: 'เลือกสเปก →',
      quoteSummaryBtn: 'สรุปใบเสนอราคา',

      // Quick Bar
      quickDoor: 'ประตู: ',
      quickTheme: 'โทนสี',
      quickAdd: '+ เพิ่มอุปกรณ์',

      // Left Sidebar Tabs
      tabDetails: 'รายละเอียด',
      tabDoor: 'ประตูร้าน',
      tabMaterials: 'ผนัง/พื้น',
      tabCatalog: '+ เพิ่มอุปกรณ์',
      tabCatalogShort: 'เพิ่มอุปกรณ์',

      // Units
      metersUnit: 'ม.',
      sqmUnit: 'ตร.ม.',
      stationsCountUnit: 'เครื่อง',
      itemsCountUnit: 'ชิ้น',
      seatsCountUnit: 'ที่นั่ง',
      unitsChairs: 'ตัว',
      unitsPerChair: '/ตัว',

      // Details Installed Items List
      installedItemsTitle: 'อุปกรณ์ที่ติดตั้งในร้าน',
      mainEntranceDoor: 'ประตูทางเข้าร้านหลัก',
      glassDoubleTint: 'กระจก 2 บาน (ฟิล์มดำ)',
      glassSingleTint: 'กระจก 1 บาน (ฟิล์มดำ)',
      autoSlidingTint: 'บานเลื่อนออโต้ (ฟิล์มดำ)',
      settingsBtn: 'ตั้งค่า',
      noItemsInLayout: 'ยังไม่มีอุปกรณ์ในผังร้าน คลิกปุ่ม "+ เพิ่มอุปกรณ์" ด้านบนเพื่อเริ่มจัดวาง',
      itemActionInspect: 'คลิกเพื่อดูขนาด ราคา & จัดการ',
      itemActionCollapse: 'คลิกเพื่อย่อรายละเอียด',
      moduleSize: 'ขนาดโมดูล',
      estimatedPrice: 'ราคาประเมิน',
      focusIn3D: 'ปรับใน 3D',
      rotateAction: 'หมุน',
      removeAction: 'นำออก',

      // Categories
      cat_stations: 'โซนเกมมิ่ง',
      cat_facilities: 'งานบริการ/ระบบ',
      cat_stage: 'เวทีแข่งขัน',
      cat_architectural: 'โครงสร้าง & ทางเข้า',
      cat_amenities: 'โซนพักผ่อน & ตกแต่ง',
      cat_vip: 'ห้อง VIP & สตรีมเมอร์',
      cat_all: 'ทั้งหมด',
      cat_equipment: 'อุปกรณ์',

      // Selected Item Inspector Card
      selectedModuleBadge: 'โมดูลที่เลือก',
      clickFullSpecs: 'คลิกดูภาพขยาย & สเปกเต็ม',
      modulePriceBreakdown: 'รายละเอียดราคาอุปกรณ์ในโมดูล',
      deskAndStructure: 'โต๊ะและโครงสร้าง',
      gamingChairsSeats: 'เก้าอี้เกมมิ่ง / ที่นั่ง',
      noChairs: 'ไม่มี',
      dimensionsWxDxH: 'มิติขนาด (กว้าง x ลึก x สูง)',
      dimWidth: 'กว้าง',
      dimDepth: 'ลึก',
      dimHeight: 'สูง',
      totalModulePrice: 'ราคารวมโมดูลนี้:',
      positionOrientation: 'ตำแหน่ง & ทิศทางในห้อง',
      axisX: 'แกน X (แนวนอน):',
      axisY: 'แกน Y (แนวลึก):',
      angle: 'มุม:',
      rotate90: 'หมุน 90°',
      duplicate: 'คัดลอก',
      delete: 'ลบออก',
      dragHint: 'คลิกลากย้ายอิสระ หรือกดปุ่มลูกศร [↑][↓][←][→] บนคีย์บอร์ด',

      // Door Configuration Panel
      archStructureBadge: 'โครงสร้างสถาปัตยกรรม',
      storeEntranceDesc: 'Store Entrance • ปรับผนัง สัดส่วนระยะ และรูปแบบประตูหน้าร้าน',
      selectDoorWall: 'เลือกผนังติดตั้งประตู:',
      positionAlongWall: 'ตำแหน่งตามแนวผนัง:',
      presetLeft25: 'ซ้าย 25%',
      presetCenter50: 'ตรงกลาง 50%',
      presetRight75: 'ขวา 75%',
      presetBack25: 'หลัง 25%',
      presetFront75: 'หน้า 75%',
      doorStyleLabel: 'รูปแบบประตู:',
      doorSingleOption: 'แบบ 1 บาน (ฟิล์มดำ)',
      doorDoubleOption: 'แบบ 2 บาน (ฟิล์มดำ)',
      storeNameInputLabel: 'ชื่อร้าน / ป้ายกล่องไฟ 3D หน้าร้าน:',
      signStyleInputLabel: 'สไตล์ป้ายไฟ & สติ๊กเกอร์:',
      saveDoorPosition: 'เสร็จสิ้น / บันทึกตำแหน่งประตู',

      // Materials Tab
      materialsHeaderTitle: 'วอลเปเปอร์ผนัง & วัสดุพื้น',
      materialsHeaderSubtitle: 'คลิกเพื่อเปลี่ยนโทนสี แสดงผล 3D จำลองแสงทันที',
      wallFinishesTitle: '1. วอลเปเปอร์ผนังร้าน (Wall Finishes):',
      currentlyActive: 'ใช้งานอยู่',
      floorFinishesTitle: '2. วัสดุปูพื้นห้อง (Floor Finishes):',
      materialsTip: '💡 ผนังและพื้นจะคำนวณในหมวด "งานตกแต่ง Interior" ในงบลงทุนโดยอัตโนมัติ',
      backToDetailsTab: '← กลับไปดูรายละเอียดผังร้าน',

      // Bottom Navigation Bar
      bottomNavRoomSize: 'ขนาดร้าน:',
      bottomNavRecommended: 'แนะนำ',
      bottomNavStoreLayout: 'ผังร้าน:',
      bottomNavSpecs: 'สเปก:',
      bottomNavBudget: 'งบรวม:',
      bottomNavPayback: 'คืนทุน',

      // Catalog Items (14 items)
      'item_pc-row-2': 'โต๊ะคอมพิวเตอร์ 2 ที่นั่ง (Double Station)',
      'desc_pc-row-2': 'โต๊ะเกมมิ่ง 2 ที่นั่ง ออกแบบระยะห่างมาตรฐานนักกีฬา ลากเมาส์ได้กว้าง',
      'item_pc-row-4': 'แถวคอมพิวเตอร์ 4 ที่นั่ง (Quad Station)',
      'desc_pc-row-4': 'แถวโต๊ะมาตรฐาน 4 ที่นั่งแบบเรียงหน้ากระดาน เหมาะกับแนวผนังร้าน',
      'item_pc-island-6': 'เกาะคอมพิวเตอร์ 6 ที่นั่ง (Island 6)',
      'desc_pc-island-6': 'เกาะกลาง 6 ที่นั่ง ประหยัดพื้นที่ เดินท่อสายไฟและท่อแอร์ลงตรงกลาง',
      'item_vip-room-5': 'ห้อง VIP Private Suite (5 ที่นั่ง)',
      'desc_vip-room-5': 'ห้องกระจกเก็บเสียงส่วนตัว สำหรับทีมซ้อม Bootcamp และสตรีมเมอร์',
      'item_stage-5v5': 'เวทีแข่งขัน 5v5 Tournament Stage',
      'desc_stage-5v5': 'เวทีประลอง 10 ที่นั่ง (5v5) พร้อมโครงสร้างถ่ายทอดสดและโต๊ะแคสเตอร์',
      'item_cashier-counter': 'เคาน์เตอร์แคชเชียร์ & ต้อนรับ (Reception)',
      'desc_cashier-counter': 'จุดต้อนรับลูกค้า เช็กอินสมาชิก คิดเงิน และเติมเงินหน้าเคาน์เตอร์',
      'item_server-room': 'ห้องเซิร์ฟเวอร์ & Rack (Diskless Master)',
      'desc_server-room': 'ห้องศูนย์รวมเครื่องแม่ข่าย Diskless และระบบเครือข่าย 10Gbps',
      'item_cafe-bar': 'สแน็กบาร์ & จุดเครื่องดื่ม (Cafe Bar)',
      'desc_cafe-bar': 'บาร์กาแฟสด เครื่องดื่มชูกำลัง และของว่างพร้อมเสิร์ฟถึงโต๊ะ',
      'item_lounge-sofa': 'โซฟาพักผ่อน & กองเชียร์ (Spectator Lounge)',
      'desc_lounge-sofa': 'โซฟาพักผ่อนสำหรับผู้ติดตามและกองเชียร์นั่งชมการแข่งขันผ่านจอยักษ์',
      'item_door-entrance': 'ประตูทางเข้าหลัก (Main Glass/Wood Door)',
      'desc_door-entrance': 'ประตูทางเข้าหลักของร้าน ออกแบบกว้างขวางเข้า-ออกสะดวก',
      'item_window-panoramic': 'หน้าต่างกระจกบานใหญ่ (Panoramic Glass Window)',
      'desc_window-panoramic': 'หน้าต่างกระจกชมวิวด้านหน้าอาคาร รับแสงธรรมชาติและโชว์บรรยากาศในร้าน',
      'item_vip-lounge-sofa': 'โซฟา VIP เลานจ์ & จอโค้ง 65 นิ้ว (VIP Console Lounge)',
      'desc_vip-lounge-sofa': 'ชุดโซฟาพักผ่อนระดับพรีเมียมพร้อมจอโค้งยักษ์ เหมาะสำหรับห้อง VIP และโซนเล่นเกมคอนโซล PS5 / Nintendo Switch',
      'item_smart-kiosk': 'ตู้คีออสก์บริการตนเองอัจฉริยะ (Smart Self-Order Kiosk)',
      'desc_smart-kiosk': 'ตู้คีออสก์บริการตนเอง ลูกค้าสามารถสั่งอาหาร เติมเงินสมาชิก และชำระเงินผ่าน PromptPay ได้ตลอด 24 ชั่วโมง ลดภาระพนักงานเคาน์เตอร์',
      'item_neon-brand-sign': 'ป้ายไฟนีออนโลโก้ GLP อะคริลิก 3D (3D Glowing Brand Sign)',
      'desc_neon-brand-sign': 'ป้ายไฟนีออนเรืองแสงโลโก้ G-Speed Living Plus สำหรับติดตั้งบริเวณผนังไฮไลต์ จุดเช็กอินถ่ายรูป และทางเข้าร้าน'
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
        title: 'Event Photo Gallery',
        desc: 'Photos from LAN championships, game launch events, community meetups, and victory ceremonies.',
        link: 'Explore Photo Gallery'
      },
      featureTournaments: {
        badge: 'GLP TOURNAMENTS',
        title: 'Esports Tournaments',
        desc: 'Track tournament brackets, live match results, and register your team for national esports leagues.',
        link: 'Explore All Tournaments'
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
    },
    tournamentModal: {
      tabOverview: 'Overview & Rules',
      tabSchedule: 'Schedule & Dates',
      tabBracket: 'Bracket & Live',
      tabRoster: 'Teams & Roster',
      tabRegister: 'Register Team',
      prizePool: 'Total Prize Pool',
      date: 'Tournament Date',
      venue: 'Tournament Venue',
      venueDefault: 'GLP : G Speed Living Plus Ramkhamhaeng 53',
      regFormTitle: 'Team Registration Form',
      regSubtitle: 'Enter team and roster details for official tournament entry.',
      teamName: 'Team Name',
      teamTag: 'Team Tag',
      captainName: 'Captain Name',
      captainPhone: 'Captain Phone',
      captainEmail: 'Captain Email',
      captainDiscord: 'Discord / Line ID',
      submitRegister: 'Submit Registration',
      successTitle: 'Registration Submitted!',
      successDesc: 'GLP Tournament Committee has received your submission and will contact you shortly.',
      copiedLink: 'Tournament link copied!',
      shareTournament: 'Share Tournament'
    },
    seatBookingModal: {
      title: 'Reserve Gaming Stations & VIP Pods',
      subtitle: 'Pre-book your preferred zone, stations, date, and gaming meals in advance.',
      step1: '1. Zone & Seats',
      step2: '2. Date & Time',
      step3: '3. Details & F&B',
      step4: '4. Confirmation',
      selectZone: 'Select Zone',
      selectSeatTip: 'Click to select or deselect stations (multiple selection supported)',
      available: 'Available',
      selected: 'Selected',
      occupied: 'Occupied',
      ratePerHour: 'Hourly Rate:',
      memberPrice: 'Member Price:',
      bahtHour: 'THB/hr',
      selectedSeatsCount: 'Selected Stations:',
      dateLabel: 'Date of Visit:',
      timeSlotLabel: 'Start Time Slot:',
      durationLabel: 'Duration Package:',
      package2hr: '2 Hours (Casual Play)',
      package4hr: '4 Hours (Most Popular)',
      package6hr: '6 Hours (Rank Grind)',
      packageNight: 'Night Owl Pass 23:00 - 08:00 (150 THB flat)',
      custName: 'Full Name:',
      custPhone: 'Phone Number (Required):',
      custEmail: 'Email Address (Optional):',
      memberCheck: 'Are you a GLP Member?',
      isMemberLabel: 'I am a GLP Member (Get 10 THB/hr discount)',
      memberId: 'GLP Member ID:',
      foodLabel: 'Select F&B Package (Delivered to Station):',
      foodNone: 'No food or drinks (0 THB)',
      foodEnergy: 'Energy Boost Combo (Red Bull + Scrambled Egg Rice) (+89 THB/person)',
      foodFeast: 'Gamer Feast Combo (Boba Tea + Basil Pork Rice + Fries) (+149 THB/person)',
      foodCoffee: 'Specialty Coffee Combo (Fresh Roasted Coffee + Croissant) (+65 THB/person)',
      notes: 'Special Requests / Notes (Optional):',
      totalEstimated: 'Total Estimated Cost:',
      btnNext: 'Next Step',
      btnBack: 'Previous Step',
      btnConfirm: 'Confirm Booking',
      ticketSuccess: 'Booking Confirmed!',
      ticketSubtitle: 'Thank you for choosing G-SPEED ARENA. Please present this ticket at the counter upon arrival.',
      ticketCode: 'Booking Reference Code:',
      stageFront: '─── ARENA MAIN STAGE DISPLAY ───',
      hardwareSpecs: 'Zone Hardware Specs',
      btnCopyCode: 'Copy Code',
      btnPrintTicket: 'Print Ticket',
      btnClose: 'Done / Close'
    },
    organizerModal: {
      title: 'Host Esports Events & Venue Rental',
      subtitle: 'Professional esports tournament arena with soundproof main stage, 4K LED broadcast wall, 360Hz gear, and 10Gbps dedicated fiber.',
      chipStage: '5v5 Soundproof Stage',
      chipScreen: '4K LED Studio Wall',
      chipGear: 'RTX 40 Series 360Hz',
      chipCaster: 'Pro Caster Desk',
      section1: 'Select Tournament Game',
      section2: 'Contact & Organization Info',
      section3: 'Schedule & Additional Requirements',
      nameLabel: 'Contact Name / Representative *',
      orgLabel: 'Company / Organization / Club (Optional)',
      phoneLabel: 'Phone Number (Hotline) *',
      emailLabel: 'Email Address',
      lineLabel: 'LINE ID for fast response',
      gameLabel: 'Tournament Game Title',
      expectedDateLabel: 'Expected Date Range',
      attendeesLabel: 'Estimated Number of Attendees',
      budgetLabel: 'Estimated Budget',
      addonsLabel: 'Required Equipment & Add-ons:',
      notesLabel: 'Additional Requirements / Notes (e.g. caster desk, LED broadcast)',
      submitBtn: 'Submit Event Inquiry',
      submitFull: 'Submit Inquiry & Get Free Quotation',
      fastHelpTitle: 'Need immediate assistance or check venue availability:',
      callHotline: 'Call Hotline',
      chatLine: 'Official LINE Chat',
      chatLineSuccess: 'Chat on LINE OA for Instant Inquiry',
      successTitle: 'Inquiry Submitted Successfully!',
      successDesc: 'GLP Tournament Operations Team has received your inquiry and will reach out within 24 hours.'
    },
    franchisePlanner: {
      walkModeActive: "First-person walk-through mode active",
      walkModeBtn: "Walk Mode",
      storefrontViewTooltip: "Storefront View",
      storefrontViewBtn: "Front View",
      switchTo3DTooltip: "Switch to 3D perspective",
      switchTo2DTooltip: "Switch to 2D top-down plan",
      exitWalkModeTooltip: "Exit walk mode (or press ESC)",
      exitWalkModeBtn: "Exit Walk (ESC)",
      orText: "or",
      walkThroughVenue: "Walk around venue",
      mouse360: "Mouse 360°",
      clickMouse: "Click Mouse",
      mouseLookLocked: "Look around 360° (FPS Lock)",
      mouseLookUnlocked: "Click to lock mouse and look 360°",
      sprintKey: "Sprint",
      exitWalkOrUnlock: "Exit walk / Unlock mouse",
      eyeLevel: "Eye Level 1.65m",
      forwardTitle: "Forward",
      strafeLeftTitle: "Strafe Left",
      strafeRightTitle: "Strafe Right",
      backwardTitle: "Backward",
      sprintToggleTitle: "Toggle Sprint / Walk",
      sprintOn: "Sprint (ON)",
      turnLeftTitle: "Turn view left",
      turnLeftBtn: "Look Left",
      turnRightTitle: "Turn view right",
      turnRightBtn: "Look Right",
      hintDesktop3D: "Left-click & drag to rotate • Right-click to pan • Arrow keys to nudge items",
      hintMobile3D: "Swipe to rotate 360° • Pinch with two fingers to zoom",
      nudge3DGroupTitle: "Nudge object in 3D (or use arrow keys)",
      moveLabel: "Move:",
      nudgeLeft3DTooltip: "Move left (-0.5m) or press ←",
      nudgeRight3DTooltip: "Move right (+0.5m) or press →",
      nudgeUp3DTooltip: "Move up/inward (-0.5m) or press ↑",
      nudgeDown3DTooltip: "Move down/outward (+0.5m) or press ↓",
      rotate90Btn: "Rotate 90°",
      duplicateBtn: "Copy",
      deleteBtnShort: "Delete",
      mainEntranceCanvas: "ENTRANCE",
      pullDoorSign: "PULL",

      toggleBlueprintHint: "Toggle attached blueprint overlay",
      adjustDoorHeaderHint: "Click to adjust entrance door & store signage (in left panel)",
      adjustMaterialsHeaderHint: "Click to change wall & flooring materials",
      addItemsHeaderHint: "Click to open Add Equipment tab (in left panel)",
      tabItemsTooltip: "View selected item details & venue inventory",
      tabDoorTooltip: "Configure entrance door, door style & store signage",
      tabMaterialsTooltip: "Configure wall wallpaper & room flooring finishes",
      tabCatalogTooltip: "Browse & place gaming modules/stations into layout",
      closeDoorConfigTooltip: "Close door settings",
      storeNamePlaceholder: "e.g. GLP : G SPEED LIVING PLUS...",
      presetSiamSquare: "Siam Square Branch",
      closeSelectionTooltip: "Deselect item",
      viewSpecsAndZoomTooltip: "Click to inspect full specs & HD photo",
      duplicateModuleTooltip: "Duplicate this module (Duplicate)",
      deleteModuleTooltip: "Delete module from layout (Press Delete)",
      goToAddTabTooltip: "Go to Add Equipment tab",
      selectDoorTooltip: "Click to select and adjust entrance door position",
      expandDetailsTooltip: "Click to collapse info",
      collapseDetailsTooltip: "Click to view dimensions, price & manage equipment",
      selectAndNudgeIn3DTooltip: "Select and fine-tune position in 3D",
      rotate90Tooltip: "Rotate 90 degrees",
      removeItemFromLayoutTooltip: "Remove this item from layout",
      changeWallpaperInTab2Tooltip: "Click to change wallpaper in Tab 2",
      changeFloorInTab2Tooltip: "Click to change flooring in Tab 2",
      adjustDoorWallTooltip: "Click to adjust door position",
      wallFront: "Front",
      wallLeft: "Left Wall",
      wallBack: "Back Wall",
      wallRight: "Right Wall",
      activeInUse: "In Use",
      viewFullSpecsCardHint: "Click to inspect full specs & photo",
      swatchesCardHint: "Material finishes & RGB accents",
      swatchDeskColor: "Desktop finish",
      swatchAccentColor: "Lighting accent",
      swatchChairColor: "Chair color",
      dimensionsLabel: "Size:",
      heightLabel: "Height",
      addDirectlyTo3DTooltip: "Add directly to 3D layout",
      totalWithColon: "Total",
      deskItemPrefix: "Desk",
      chairItemPrefix: "Chair",
      unitsPcs: "pcs",
      clearEntireLayoutTooltip: "Clear entire layout",
      zoomOutBlueprintTooltip: "Zoom out (-)",
      zoomResetBlueprintTooltip: "Click to reset 100%",
      zoomInBlueprintTooltip: "Zoom in (+)",
      zoomFitBlueprintTooltip: "Fit to screen (100%)",
      loungeSofa: "Lounge Sofa",
      dragHandleTooltip: "Click to select or drag to move position",
      nudgeClusterTooltip: "Nudge position (or use arrow keys ↑ ↓ ← →)",
      nudgeLeftTooltip: "Nudge left 0.2m (Press ←)",
      nudgeUpTooltip: "Nudge up 0.2m (Press ↑)",
      nudgeDownTooltip: "Nudge down 0.2m (Press ↓)",
      nudgeRightTooltip: "Nudge right 0.2m (Press →)",
      step3_stationsDesc: "Select the hardware tier best suited to your target demographic and capital investment budget (gaming chairs already bundled with desks).",
      downloadBlueprintForContractorTooltip: "Download architectural floorplan for contractors (PNG)",
      companyNameLegal: "G-Speed Living Plus Co., Ltd. (Headquarters)",
      companyAddress: "88/9 G-Speed Tower, Phahonyothin Rd, Lat Yao, Chatuchak, Bangkok 10900, Thailand",
      companyTaxIdContact: "Tax ID: 0105566012345 | Tel: +66 2 888 9999 | Web: www.gspeed-esport.com",
      blueprintReceivedNoticePrefix: "System has recorded blueprint dimensions",
      blueprintReceivedNoticeSuffix: "successfully. G-Speed architects will generate photorealistic 3D interior renderings and prepare an official turnkey quotation within 24 hours.",
      leadNamePlaceholder: "e.g. John Doe / Somkiat M.",
      budgetCalculatedAuto: "Calculated from layout & specs",
      budgetAutoOptionDesc: "Auto-calculated based on layout of",
      budget1to2m: "1,000,000 - 2,000,000 THB",
      budget2to35m: "2,000,000 - 3,500,000 THB",
      budget35to5m: "3,500,000 - 5,000,000 THB",
      budget5mPlus: "5,000,000+ THB (Flagship Arena)",
      budgetSummaryLabel: "Estimated capex (hardware & turnkey infrastructure):",
      leadNotesPlaceholder: "e.g. 2 commercial shophouses near university, roadside location...",
      downloadBlueprintHint: "Download contractor blueprint (PNG)",
      closeModalAria: "Close dialog",
      unzoomTooltip: "Click to reset normal view",
      zoomTooltip: "Click to zoom in for 100% full detail & readable text",

      step3_stationsBanner: "Current stations in your layout:",
      quoteModalHeaderTitle: "Preliminary Investment Quotation: GLP G-Speed Living Plus Franchise",
      quoteSuccessToastTitle: "Store Plan & Inquiry Successfully Submitted!",
      quoteSuccessToastDesc: "GLP engineering & franchise experts will review your custom layout and contact you for an on-site survey within 24 hours.",
      companyNameFull: "G-Speed Living Plus Co., Ltd. (Headquarters)",
      leadDefaultInvestor: "Franchise Investor",
      blackObsidianVal: "Black Obsidian (Matte Black)",
      esportBlueVal: "Esport Blue (Pro Blue)",
      cyberCyanVal: "Cyber Cyan (Electric Cyan)",
      auraPurpleVal: "Aura Purple (Neon Violet)",
      bahtShort: "THB",
      thankYouFeasibilityBody: "We are processing your space dimensions of",
      andCount: "and capacity of",
      toPrepareFeasibility: "to generate your customized Feasibility Study and monthly ROI projection. Our advisory team will reach out to",
      orEmail: "or email",
      within24Hours: "within 24 hours to deliver the summary documentation and arrange a free 1-on-1 investment consultation.",
      refBlueprint: "Reference Plan:",
      stateOn: "ON",
      stateOff: "OFF",
      opacityLabel: "Opacity:",
      wallColor: "Wall Color",
      floorColor: "Floor Color",
      realProductPhotoBadge: "Real Factory Manufactured Photo - G-Speed",
      colorAndFinishTitle: "Actual Colors & Finishes (Color & Finish)",
      deskTopLegColor: "Desktop & Leg Color",
      neonAccentColor: "Neon & Trim Color",
      chairLeatherColor: "Gaming Chair Leather",
      racingBlackVal: "Racing Black (Dual-stitched PU Leather)",
      specHplTop: "Desktop Panel:",
      specHplTopDesc: "25mm High-Pressure Laminate (HPL) engineering core: heat-resistant, 100% waterproof, anti-scratch coating",
      specErgoEdge: "Ergonomic Bevel Edge:",
      specErgoEdgeDesc: "45-degree ergonomic bevel slope providing optimal wrist support for prolonged gaming marathons",
      specSteelFrame: "Steel Leg & Load Beams:",
      specSteelFrameDesc: "1.5-2.0mm high-tensile carbon steel box tubing with anti-corrosion powder coating, supports 250+ kg",
      chairModelLabel: "Chair Model:",
      chairCountPrefix: "Qty:",
      perStationSuffix: "per station",
      specCushion: "Seat Cushion:",
      specCushionDesc: "High-density cold-cure molded foam cushion ensuring zero sag under continuous esports use",
      specRecline: "Recline & Armrests:",
      specReclineDesc: "160° stepless recline with multi-tilt locking + 3D/4D multi-directional adjustable armrests",
      specGasLift: "Gas Lift Mechanism:",
      specGasLiftDesc: "Class-4 explosion-proof gas lift certified to international BIFMA standards, rated for 150 kg",
      specRaceway: "Under-Desk Dual Cable Raceway:",
      specRacewayDesc: "Independent dual steel cable ducts separating 220V power and CAT6A LAN for zero EMI signal interference",
      specSocket: "Individual Power Sockets:",
      specSocketDesc: "Universal 3-prong grounded 16A 220V sockets with 1:1 integrated surge protection circuitry",
      specLan: "Network Terminations:",
      specLanDesc: "Shielded CAT6A RJ-45 LAN port 10Gbps-ready, routed directly into central server rack",
      standardDeskPrefix: "Standard Desk",
      racewayIncluded: "complete raceway & cabling included",
      zooming100: "Zoomed 100% (Click to fit view)",
      clickToZoom100: "Click image to zoom 100% and inspect equipment text",
      hintLabel: "Tip:",
      zoomedHint: "Click image to reset to fit view | Use mouse wheel to scroll around",
      unzoomedHint: "Click image or press \"100% Zoom\" button to view blueprint text clearly",
      saveFilePng: "Save File (PNG)",
      zoomFit: "Fit View",
      zoom100: "100% Zoom",
      openNewTab: "Open in New Tab",
      boqItem1_title: "Gaming Battle Station Hardware Package:",
      monitor: "Display:",
      gamingGear: "Gaming Gear:",
      boqItem1_note: "(Excl. Chairs - included in desk modules)",
      boqItem2_title: "Gaming Desks with Ergonomic Chairs & Specialized Zones in Layout",
      boqItem2_desc: "Configured per store plan:",
      modulesUnit: "modules",
      unitSet: "set",
      unitSystem: "system",
      unitBranch: "branch",
      boqItem2_note: "(Includes Ergonomic chairs for all stations, cable raceway, dual-socket 3-prong electrical box)",
      boqItem3_title: "Interior Decoration, Acoustic Ceiling/Walls & Linear Lighting",
      boqItem3_desc: "Acoustic sound absorption walls, heavy-duty commercial flooring, glowing brand logo sign",
      boqItem4_title: "Energy-Saving Commercial Inverter Cassette HVAC System",
      boqItem4_desc: "4-Way ceiling cassette inverter AC with fresh air circulation engineered for 24/7 operation",
      boqItem5_title: "10Gbps NVMe Enterprise Diskless Master Server Cluster",
      boqItem5_desc: "Dual-Host failover server with automated high-speed game patching, instant concurrent boot with zero lag",
      boqItem6_title: "Enterprise Dual-WAN Network Infrastructure & Cisco 10G Managed Switches",
      boqItem6_desc: "CAT6A Shielded cabling + 42U Server Rack + 10kVA Central UPS battery backup system",
      boqItem7_title: "Billing Management & Cloud Member POS Cashier System",
      boqItem7_desc: "Billing software, electronic cash drawer, QR barcode scanner, cloud member integration & mobile dashboard",
      boqItem8_title: "G-Speed Franchise License & Full Turnkey Onboarding Package",
      boqItem8_desc: "Brand license, 3D architectural blueprint, manager & staff SOP training, opening marketing campaign",
      subtotalPreTax: "Pre-Tax Estimated Subtotal:",
      vat7Label: "Value Added Tax (VAT 7%):",
      term1_title: "3-Stage Payment Terms:",
      term1_desc: "Stage 1 (Contract Deposit) 30% | Stage 2 (Delivery & Fit-Out) 50% | Stage 3 (Final Inspection & Handover) 20%",
      term2_title: "Turnkey Warranty:",
      term2_desc: "PCs and servers include 3-Year full On-site Service warranty; network supervised 24/7 via cloud NOC monitoring",
      term3_title: "Delivery Timeline:",
      term3_desc: "Fully delivered and ready for commercial operation within 4 to 6 weeks",
      term4_title: "Turnkey Scope:",
      term4_desc: "Includes freight, electrical installation, LAN cabling, diskless server deployment, and staff SOP training",
      signNeonLed: "Neon LED",
      signGoldAcrylic: "Gold Acrylic",
      signMinimalCyber: "Cyber Minimal",
      signGrandArch: "Grand Arch",
      wallpaperKey: "Wallpaper:",
      floorKey: "Flooring:",
      doorEntranceKey: "Store Entrance:",
      fitScreen: "Fit Screen",
      entrance: "Entrance",
      selectedPill: "Selected",
      newItemDragPrompt: "New item! Drag to position",
      dragFreely: "Click & Drag",
      moveFree: "Freely",
      arrowKeysLabel: "Arrow Keys",
      onKeyboard: "on keyboard",
      controlsGuideTitle: "Navigation Controls:",
      controlsGuideDesc: "360° Free orbit with Left Mouse • Zoom with scroll wheel • Click objects to view desk & chair pricing",
      quoteDocBadge: "ESTIMATED QUOTATION",
      quoteRefNo: "Quotation Ref:",
      quoteIssueDate: "Date Issued:",
      quoteValidity: "Price Validity:",
      quoteValidityVal: "30 Days from Issue Date",
      customerInfoTitle: "Customer & Franchisee Info",
      customerNameLabel: "Client / Company Name:",
      customerPhoneLabel: "Phone Number:",
      customerEmailLabel: "Email Address:",
      customerBudgetLabel: "Planned Budget:",
      projectSpecsTitle: "Project Specifications",
      storeLocationLabel: "Target Location:",
      roomDimensionsLabel: "Store Dimensions:",
      pcSpecsLabel: "Hardware Tier:",
      areaSizeLabel: "Total Area:",
      stationsCountLabel: "Stations:",
      installDurationLabel: "Installation Timeline:",
      installDurationVal: "4-6 Weeks",
      paybackEstLabel: "Est. Payback:",
      attachedBlueprintLabel: "Blueprint Attached:",
      customBpAttachedTitle: "Custom Blueprint Attached",
      boqColNo: "No.",
      boqColDesc: "Item Description & Scope of Work (BOQ)",
      boqColQty: "Qty",
      boqColUnit: "Unit Price",
      boqColTotal: "Total (THB)",
      boqSubtotal: "SUBTOTAL:",
      boqVat: "VAT (7%):",
      boqGrandTotal: "GRAND TOTAL:",
      commercialTermsTitle: "Commercial Terms & Warranty",
      authorizedSignatureTitle: "Authorized Signature",
      franchiseDeptTitle: "Franchise Business Development / G-Speed Living Plus Co., Ltd.",
      franchiseeAcceptanceTitle: "Franchisee Acceptance / Client",
      agreementTitle: "Agreement of Quotation",
      datePrefix: "Date:",
      calcByLayout: "Calculated from layout",
      customBudgetConsult: "Custom Budget / Consult Expert",
      thankYouRefSaved: "Store Plan Saved • REF ID:",
      thankYouTitle: "Thank You for Your Trust",
      thankYouSubtitle: "The GLP engineering and franchise advisory team has received your 3D floor plan layout.",
      slaTitle: "Direct 24-Hour Follow-Up Promise",
      placedLayoutLabel: "Planned Stations",
      estBudgetLabel: "Estimated Budget",
      emailStatusLabel: "Email Dispatch",
      autoCopySent: "Auto Copy Sent",
      autoRedirectCountdownPrefix: "Redirecting to homepage in",
      secondsUnit: "seconds",
      goToHomeBtn: "Go to Home Now",
      stayOnPlannerBtn: "Continue Exploring Plan",
      step1_presetsLabel: "Select Preset Models:",
      step1_widthMetersLabel: "Room Width (Width):",
      step1_lengthMetersLabel: "Room Length (Length):",
      totalAreaLabel: "Total Usable Area:",
      supportsApprox: "Supports approx.",
      comfortableSeating: "comfortably spaced",
      haveBlueprintPrompt: "Already have an architectural blueprint of your building?",
      switchToBlueprint: "Switch to Blueprint Upload (Optional)",
      dragBlueprintHint: "Drag & drop blueprint file here or click to select (Optional)",
      blueprintFormatsHint: "Supports architectural blueprints, floor plan drawings, 2D sketches, scans (PNG, JPG, WEBP)",
      selectBlueprintFile: "Choose Blueprint File",
      useSampleBlueprint: "Try Commercial Shophouse Sample",
      aiScanningBlueprint: "AI is scanning blueprint, measuring area scale, and calculating esports zone layout...",
      blueprintAttached: "Blueprint Attached:",
      deleteBlueprint: "Remove Blueprint",
      changeBlueprint: "Change File",
      actualBuildingWidth: "Actual Building Width (Width):",
      actualBuildingLength: "Actual Building Length (Length):",
      recommendedCapacity: "Recommended Capacity:",
      estimatedCapex: "Estimated Investment:",
      estimatedMonthlyProfit: "Estimated Monthly Net Profit:",
      roiPaybackPeriod: "Payback Period (ROI):",
      calculatedZoneAllocation: "Calculated Zone Allocation:",
      smartLayoutAdviceTitle: "Smart Layout Strategic Advice",
      autoLayoutBtn: "Auto-Generate Layout",
      manualLayoutBtn: "Design Layout Manually",
      wantStandardPreset: "Want to use standard room dimensions and presets?",
      switchToStandardPreset: "Switch to Presets (Default)",
      usingBlueprint: "Using Blueprint:",
      simulatedSpaceSize: "Simulated Space:",
      loc_bkk: "Bangkok & Vicinity (University/Residential)",
      loc_cm: "Chiang Mai / Northern Thailand",
      loc_esan: "Khon Kaen / Korat / Isan",
      loc_east: "Chonburi / Pattaya / Eastern EEC",
      loc_south: "Phuket / Songkhla / Southern Thailand",
      type_shophouse: "2-3 Unit Commercial Shophouse",
      type_mall: "Shopping Mall / Lifestyle Center Unit",
      type_standalone: "Standalone Building / Renovated Warehouse",
      type_campus: "Near University / Student Dormitories",
      initialCostSummary: "Initial Investment Summary",
      hardwareCostRow: "Hardware",
      furnitureCostRow: "Desks, Chairs & VIP Rooms:",
      interiorCostRow: "Interior Decoration",
      airconCostRow: "HVAC & Ventilation:",
      franchiseFeeRow: "Franchise License & Brand Rights:",
      totalInvestmentEstimateLabel: "Estimated Total Turnkey Investment:",
      turnkeyIncludedNote: "* Turnkey package: includes hardware, interior fit-out, and grand opening readiness",
      nextChooseSpecsWithCount: "Next: Hardware Specs",
      viewFullSpecs: "View Full Specs",
      dimSizePrefix: "Size:",
      totalPricePrefix: "Total",
      viewSpecsShort: "Specs",
      deskPrefix: "Desk",
      chairsPrefix: "Chairs",
      presetLayoutModels: "Preset Layout Models:",
      clearLayoutAll: "Clear All Layout",
      addEquipmentTitle: "Add Equipment & Zones",
      addEquipmentSubtitle: "Click the + button on the right to place items into layout instantly",
      cat_stations_short: "Gaming Desks",
      cat_service_short: "Service/Counter",
      cat_doors_short: "Doors/Windows",
      adminLabel: "Administrator:",
      adminDesc: "Customize hardware specs, add components, or edit pricing at any time",
      adminCmsBtn: "Open Hardware & Pricing CMS",
      perStationFullSet: "station (complete set)",
      totalForStations: "Total for",
      gamingChairLabel: "Gaming Chair:",
      gamingChairIncludedNote: "Included in desk module set",
      selectedThisTier: "Selected This Tier",
      selectThisTier: "Select This Tier",
      includedInfraTitle: "Included Infrastructure: Master Server & Network",
      disklessServerDesc: "Dual Enterprise NVMe Master servers supporting 200+ games with zero local installation and 24/7 automated patching",
      dualWanDesc: "Automated dual-line fiber failover, ultra-low ping (< 3ms), and Cisco 10G managed switches",
      billingPosDesc: "Member management, screen time billing, desktop food/beverage ordering, and real-time mobile revenue dashboard",
      nextBudgetRoi: "Next: Budget & ROI",
      turnkeyBreakdownTitle: "Turnkey Cost Breakdown",
      workCategoryHeader: "Work Category",
      detailsHeader: "Details",
      budgetHeader: "Budget",
      costItem1_title: "1. Battle Stations & Gaming Gear (Excl. Chairs)",
      costItem2_title: "2. Gaming Desks & Ergonomic Chairs in Layout",
      costItem2_desc: "Gaming desks with chairs matching seats, VIP suites, 5v5 stage",
      costItem3_title: "3. Interior Fit-Out & Modern Linear Lighting",
      costItem3_desc: "Flooring, acoustic walls, architectural linear lights",
      costItem4_title: "4. Commercial Inverter HVAC System",
      costItem4_desc: "4-Way Cassette Inverter Air Conditioning",
      costItem5_title: "5. 10G Diskless Master Server System",
      costItem5_desc: "Dual NVMe Master Servers + 200+ Game Library with auto-updates",
      costItem6_title: "6. Enterprise Dual-WAN Network Infrastructure",
      costItem6_desc: "Cisco 10G switches, Mikrotik router, Shielded CAT6A, 42U rack",
      costItem7_title: "7. Billing Software & POS Cashier Terminal",
      costItem7_desc: "Client management, cash drawer, QR barcode scanner, in-desk food ordering",
      costItem8_title: "8. Franchise License & Opening Training",
      costItem8_desc: "G-Speed brand license, 3D architectural drawings, staff SOP training, opening marketing",
      costTotal_title: "Total Turnkey Investment Package:",
      costTotal_status: "Turnkey & Ready to Open",
      interactiveRoiTitle: "Revenue & Payback Simulator (Interactive ROI)",
      hourlyRateLabel: "Service Rate (THB / Hour):",
      bahtPerHour: "THB/hr",
      occupancyRateLabel: "Average Daily Occupancy Rate:",
      occLow: "Low",
      occStandard: "Standard",
      occPrime: "Prime Location",
      monthlyRevenueKpi: "Monthly Revenue",
      averagePerDay: "Avg",
      dayUnit: "day",
      monthlyNetProfitKpi: "Net Monthly Profit",
      annualRoiKpi: "Annual Return (ROI)",
      paybackInMonths: "Payback in",
      gamingHourRevenue: "Gaming Hours Revenue",
      fnbRevenue: "F&B and Snack Bar Revenue:",
      grossMonthlyRevenue: "Gross Monthly Revenue:",
      electricityCostEst: "Estimated Electricity & AC:",
      staffSalariesEst: "Staff Salaries (2-3 Shifts):",
      internetMiscEst: "Fiber Internet & Misc:",
      netProfitTitle: "Estimated Monthly Net Profit:",
      paybackEstTitle: "Estimated Payback:",
      timelineTitle: "Construction & Installation Timeline (~6 Weeks)",
      timelineDesc: "Turnkey process from site survey through Grand Opening day ready to operate",
      requestQuoteBtn: "Request Official Quote",
      dimSizeWidth: "Width (Width)",
      dimSizeDepth: "Depth (Depth)",
      dimSizeHeight: "Height (Height)",
      seatsInSet: "Seats in set",
      servicePoint: "Service Point",
      setPriceWithInstall: "Set Price (Installed):",
      vatAndInstallIncluded: "(Incl. VAT and installation)",
      customDesk: "Custom Desk:",
      gamingChairsCount: "Gaming Chairs",
      specSection1_title: "1. Engineering Materials & Construction",
      specSection2_title: "2. Ergonomic Gaming Chairs & Furniture",
      specSection3_title: "3. Electrical & 10G LAN Raceway Infrastructure",
      specSection4_title: "4. Warranty & Production Lead Time",
      warrantyLabel: "Warranty:",
      leadTimeLabel: "Production Lead Time:",
      modelIncludes: "This model includes:",
      closeWindow: "Close",
      addTo3dPlan: "Add to 3D Plan",
      delModalTitle: "Confirm Remove Equipment?",
      delModalDesc: "Are you sure you want to remove this equipment from the 3D layout?",
      delModalSubtext: "You can re-add this equipment at any time from the tab:",
      confirmRemove: "Confirm Removal",
      cancel: "Cancel",
      leadFormTitle: "Request G-Speed Team Contact & Send Store Plan",
      fullName: "Full Name",
      phone: "Phone Number",
      email: "Email Address (Receive Quote)",
      budgetLabel: "Planned Investment Budget",
      locationLabel: "Target Location / Province",
      submittingLead: "Sending Request...",
      submitLeadBtn: "Submit Plan & Get Consultation",
      downloadBlueprintPng: "Download Blueprint (PNG)",
      printQuotationBtn: "Print Quotation",
      prevStep: "Back",
      badge: '3D SMART FRANCHISE PLANNER',
      title: '3D Store Layout Planner & Franchise ROI Simulator',
      subtitle: 'Design your custom floor plan, workstations, main stage, and calculate equipment budget automatically.',
      tabStoreSize: '1. Store Dimensions',
      tabLayout: '2. 2D/3D Layout',
      tabHardware: '3. Hardware Tier',
      tabQuote: '4. Budget & Quote',
      view2D: '2D Blueprint View',
      view3D: '3D Studio Walkthrough',
      totalArea: 'Total Area',
      recommendedStations: 'Recommended Stations',
      estimatedCapex: 'Estimated Investment (CAPEX)',
      monthlyProfit: 'Est. Monthly Profit',
      paybackPeriod: 'Est. Payback Period',
      months: 'Months',
      exportPdf: 'Print / Export PDF',
      requestQuote: 'Request Official Quote',
      step1Title: 'Define Your Store Dimensions',
      step1Desc: 'Enter room width and length to generate a real-time 3D model, or select a pre-configured template to start immediately.',
      roomWidth: 'Width (Meters)',
      roomLength: 'Length (Meters)',
      presetsTitle: 'Pre-configured Room Templates',
      uploadBlueprint: 'Upload Architectural Blueprint / Floor Plan',
      nextStep: 'Proceed to Next Step',
      prevStep: 'Back',
      step2Title: '3D Interior Studio & 2D Floor Plan',
      mode3D: '3D Studio',
      mode2D: '2D Blueprint',
      autoLayout: 'Auto Layout',
      fullscreen: 'Fullscreen',
      exitFullscreen: 'Exit Fullscreen (ESC)',
      exitWalk: 'Exit Walk Mode (ESC)',
      walkMode: 'Walk Mode',
      storefront: 'Storefront',
      topDown: 'Top-Down 2D',
      doorEntrance: 'Store Entrance',
      wallFront: 'Front Wall',
      wallRight: 'Right Wall',
      wallLeft: 'Left Wall',
      wallBack: 'Back Wall',
      tabDetails: 'Details',
      tabDoor: 'Entrance',
      tabMaterials: 'Wall/Floor',
      tabCatalog: '+ Add Items',
      roomSize: 'Room Size:',
      placedStations: 'PCs Placed:',
      placedItemsCount: 'Placed Items:',
      aisleStatus: 'Aisle Clearance:',
      aisleSafe: 'Standard & Safe',
      aisleCrowded: 'Overcrowded',
      blueprintExport: 'Blueprint (PNG)',
      step3Title: 'Select Hardware Specs for Entire Arena',
      step3Desc: 'Total stations currently in your floor plan:',
      unitStation: 'per station (Full Set)',
      totalFor: 'Total for',
      step4Title: 'Estimated Total Capital Investment Summary',
      requestQuoteTitle: 'Request Official Quotation',
      submitQuoteBtn: 'Submit Quotation Request',
      fullName: 'Full Name',
      phone: 'Phone Number',
      email: 'Email (for Quotation)',
      budgetLabel: 'Investment Budget Range',
      locationLabel: 'Target Location / City',
      noteLabel: 'Additional Notes / Custom Requirements',
      step1_setupTitle: 'Define Room Dimensions & Floor Plan',
      step1_setupDesc: 'Select a pre-configured template (Preset) to calculate and arrange immediately, or upload an architectural blueprint.',
      step1_presetTab: 'Custom Dimensions',
      step1_blueprintTab: 'Upload Blueprint',
      step1_defaultBadge: 'Default',
      step1_optionalBadge: 'AI Blueprint',
      step1_roomPresets: 'Select Pre-configured Room Preset:',
      step1_manualSliders: 'Customize Room Dimensions:',
      step1_widthM: 'Width:',
      step1_lengthM: 'Length:',
      step1_sqm: 'sq.m.',
      step1_meters: 'meters',
      step1_locationCardTitle: 'Location & Interior Theme',
      step1_provinceLabel: 'Province / Target Zone',
      step1_storeTypeLabel: 'Building / Property Type',
      step1_themeLabel: 'Interior Decoration Theme',
      step1_nextBtn: 'Next: 3D Layout',
      step2_aisleStandard: 'Standard Compliant',
      step2_aisleDense: 'Overcrowded',
      step2_nextBtn: 'Next: Hardware Tier',
      step2_prevBtn: 'Back',
      step2_rotateLandscape: 'Force Rotate 90°',
      step2_restoreLandscape: 'Restore View',
      step2_landscapeHint: 'Fullscreen: Recommended to rotate iPad / Tablet to landscape mode',
      step3_nextBtn: 'Next: Budget & ROI',
      step3_hardwareTotal: 'Total PC Hardware Investment:',
      step3_hardwareTier: 'Select Hardware Tier',
      step4_capexBreakdown: 'Capital Expenditure Breakdown (CAPEX)',
      step4_roiSimulator: 'ROI & Payback Simulator',
      step4_printQuote: 'Print Quote (A4)',
      step4_officialQuoteBtn: 'Request Official Quotation',
      step4_hourlyRate: 'Avg. Hourly Rate',
      step4_occupancy: 'Avg. Occupancy Rate',
      step4_operatingHours: 'Operating Hours / Day',
      step4_monthlyRevenue: 'Est. Monthly Revenue',
      step4_monthlyOpex: 'Est. Monthly OPEX',
      step4_monthlyProfit: 'Est. Monthly Net Profit',
      step4_payback: 'Estimated Payback Period',
      step4_paybackMonths: 'months',
      touchWalkHint: '👆 Drag on screen to walk, or use virtual gamepad below',
      lockMouseHint: 'Click screen to Lock FPS Mouse (360°)',
      exitWalkModeTitle: 'Exit Walk Mode (ESC)',
      exitFullscreenTitle: 'Exit Fullscreen (ESC)',
      doorConfigTitle: 'Configure Store Entrance (Door)',
      doorSelectWall: 'Select Entrance Wall:',
      wallFrontFull: 'Front Wall',
      wallRightFull: 'Right Wall',
      wallLeftFull: 'Left Wall',
      wallBackFull: 'Back Wall',
      doorStyle: 'Door Style:',
      doorSingle: 'Single Leaf (Tinted)',
      doorDouble: 'Double Leaf (Tinted)',
      storeNameLabel: 'Store Name / Front Signboard:',
      signStyleLabel: 'Signboard & Decal Style:',
      signNeon: 'Neon LED',
      signGold: 'Acrylic Gold',
      signMinimal: 'Cyber Minimal',
      signArch: 'Grand Arch',
      // Breadcrumbs & Stepper
      step1_crumb: 'Size',
      step2_crumb: '3D Studio Layout',
      step3_crumb: 'Hardware Specs',
      step4_crumb: 'Budget & ROI',
      metricCapacity: 'Capacity:',
      metricArea: 'Area:',
      metricInvestment: 'Investment Budget:',
      metricPayback: 'Payback:',
      chooseSpecsBtn: 'Choose Specs →',
      quoteSummaryBtn: 'Summary of Quotation',

      // Quick Bar
      quickDoor: 'Door: ',
      quickTheme: 'Theme',
      quickAdd: '+ Add Equipment',

      // Left Sidebar Tabs
      tabDetails: 'Details',
      tabDoor: 'Store Door',
      tabMaterials: 'Wall/Floor',
      tabCatalog: '+ Add Equipment',
      tabCatalogShort: 'Add Equipment',

      // Units
      metersUnit: 'm.',
      sqmUnit: 'sqm',
      stationsCountUnit: 'stations',
      itemsCountUnit: 'items',
      seatsCountUnit: 'seats',
      unitsChairs: 'units',
      unitsPerChair: '/unit',

      // Details Installed Items List
      installedItemsTitle: 'Installed Store Equipment',
      mainEntranceDoor: 'Main Store Entrance Door',
      glassDoubleTint: 'Double Glass (Tinted)',
      glassSingleTint: 'Single Glass (Tinted)',
      autoSlidingTint: 'Auto-Sliding Glass (Tinted)',
      settingsBtn: 'Settings',
      noItemsInLayout: 'No equipment placed yet. Click "+ Add Equipment" above to start designing.',
      itemActionInspect: 'Click to inspect size, price & controls',
      itemActionCollapse: 'Click to collapse details',
      moduleSize: 'Module Size',
      estimatedPrice: 'Est. Price',
      focusIn3D: 'Focus in 3D',
      rotateAction: 'Rotate',
      removeAction: 'Remove',

      // Categories
      cat_stations: 'Gaming Zone',
      cat_facilities: 'Service & System',
      cat_stage: 'Tournament Stage',
      cat_architectural: 'Architecture & Entry',
      cat_amenities: 'Lounge & Amenities',
      cat_vip: 'VIP & Streamer Rooms',
      cat_all: 'All',
      cat_equipment: 'Equipment',

      // Selected Item Inspector Card
      selectedModuleBadge: 'Selected Module',
      clickFullSpecs: 'Click for Full Specs & Gallery',
      modulePriceBreakdown: 'Module Price Breakdown',
      deskAndStructure: 'Desk & Frame Structure',
      gamingChairsSeats: 'Gaming Chairs / Seats',
      noChairs: 'None',
      dimensionsWxDxH: 'Dimensions (W x D x H)',
      dimWidth: 'Width',
      dimDepth: 'Depth',
      dimHeight: 'Height',
      totalModulePrice: 'Total Module Price:',
      positionOrientation: 'Position & Orientation in Room',
      axisX: 'Axis X (Horizontal):',
      axisY: 'Axis Y (Depth):',
      angle: 'Angle:',
      rotate90: 'Rotate 90°',
      duplicate: 'Duplicate',
      delete: 'Delete',
      dragHint: 'Drag freely or use arrow keys [↑][↓][←][→] on keyboard',

      // Door Configuration Panel
      archStructureBadge: 'Architectural Structure',
      storeEntranceDesc: 'Store Entrance • Adjust wall, offset ratio, and entrance door styles',
      selectDoorWall: 'Select Entrance Wall:',
      positionAlongWall: 'Position Along Wall:',
      presetLeft25: 'Left 25%',
      presetCenter50: 'Center 50%',
      presetRight75: 'Right 75%',
      presetBack25: 'Back 25%',
      presetFront75: 'Front 75%',
      doorStyleLabel: 'Door Style:',
      doorSingleOption: 'Single Leaf (Tinted)',
      doorDoubleOption: 'Double Leaf (Tinted)',
      storeNameInputLabel: 'Store Name / 3D Lightbox Signboard:',
      signStyleInputLabel: 'Signboard & Decal Style:',
      saveDoorPosition: 'Done / Save Door Position',

      // Materials Tab
      materialsHeaderTitle: 'Wallpapers & Floor Finishes',
      materialsHeaderSubtitle: 'Click to switch themes and preview instant 3D lighting',
      wallFinishesTitle: '1. Store Wallpapers (Wall Finishes):',
      currentlyActive: 'Active',
      floorFinishesTitle: '2. Store Flooring (Floor Finishes):',
      materialsTip: '💡 Walls and floors are automatically calculated under "Interior Decoration" in the investment budget',
      backToDetailsTab: '← Back to Store Layout Details',

      // Bottom Navigation Bar
      bottomNavRoomSize: 'Store Size:',
      bottomNavRecommended: 'Recommended',
      bottomNavStoreLayout: 'Store Layout:',
      bottomNavSpecs: 'Hardware Specs:',
      bottomNavBudget: 'Total Investment:',
      bottomNavPayback: 'Payback',

      // Catalog Items (14 items)
      'item_pc-row-2': '2-Player Gaming Desk (Double Station)',
      'desc_pc-row-2': '2-station esports desk designed with tournament-grade spacing for wide mouse sweeps',
      'item_pc-row-4': '4-Player Station Row (Quad Station)',
      'desc_pc-row-4': 'Standard 4-station row configuration, ideal for wall placement and high density',
      'item_pc-island-6': '6-Station Gaming Island (Island 6)',
      'desc_pc-island-6': '6-station center island with integrated central cable spine and air duct management',
      'item_vip-room-5': 'VIP Private Suite (5 Seats)',
      'desc_vip-room-5': 'Soundproof private glass room for bootcamp practice, tournaments, and streamers',
      'item_stage-5v5': '5v5 Tournament Stage',
      'desc_stage-5v5': '10-seat (5v5) tournament stage with live broadcast lighting truss and caster desks',
      'item_cashier-counter': 'Cashier & Reception Counter',
      'desc_cashier-counter': 'Customer reception, member check-in, POS billing, and account top-up counter',
      'item_server-room': 'Server Room & 42U Rack (Diskless Master)',
      'desc_server-room': 'Central hub for Diskless server master and 10Gbps enterprise network infrastructure',
      'item_cafe-bar': 'Snack Bar & Beverage Station (Cafe Bar)',
      'desc_cafe-bar': 'Fresh coffee, energy drinks, and quick snacks ready for in-seat delivery',
      'item_lounge-sofa': 'Spectator Lounge & Sofa',
      'desc_lounge-sofa': 'Lounge sofa for spectators and companions to enjoy matches on giant screens',
      'item_door-entrance': 'Main Glass/Wood Entrance Door',
      'desc_door-entrance': 'Main store entrance door, wide clearance for effortless foot traffic',
      'item_window-panoramic': 'Panoramic Glass Window',
      'desc_window-panoramic': 'Panoramic front-facing windows showcasing internal esports atmosphere to passersby',
      'item_vip-lounge-sofa': 'VIP Console Lounge & 65" Curved Display',
      'desc_vip-lounge-sofa': 'Ultra-premium sofa suite with 65" curved display for VIP lounges and console gaming (PS5/Switch)',
      'item_smart-kiosk': 'Smart Self-Order Kiosk (32" Touch)',
      'desc_smart-kiosk': '24/7 Smart Self-Service Kiosk: Order food, top up balance, and pay via PromptPay/QR without waiting',
      'item_neon-brand-sign': '3D Glowing GLP Brand Neon Sign',
      'desc_neon-brand-sign': 'GLP 3D Glowing Brand Sign for highlight walls, entrance facade, and viral photo check-ins'
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
        title: '精彩活动相册',
        desc: '汇集全年度线下LAN锦标赛、游戏新作发布会、玩家见面会及颁奖典礼精彩瞬间。',
        link: '浏览活动相册'
      },
      featureTournaments: {
        badge: 'GLP 电竞赛事',
        title: '电竞赛事与锦标赛',
        desc: '实时掌握赛事晋级表（Bracket）、战队比分，并直接报名参加全国性专业电竞锦标赛。',
        link: '浏览所有电竞赛事'
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
    },
    tournamentModal: {
      tabOverview: '赛事概览与规则',
      tabSchedule: '赛程与时间表',
      tabBracket: '对阵与实时战况',
      tabRoster: '参赛战队',
      tabRegister: '报名参赛',
      prizePool: '赛事总奖金',
      date: '比赛日期',
      venue: '比赛地点',
      venueDefault: 'GLP : G Speed Living Plus 曼谷兰甘杏53巷',
      regFormTitle: '战队报名登记表',
      regSubtitle: '填写战队与选手完整资料以获得官方赛事正式席位。',
      teamName: '战队名称',
      teamTag: '战队缩写 (Tag)',
      captainName: '队长姓名',
      captainPhone: '队长联系电话',
      captainEmail: '电子邮箱',
      captainDiscord: 'Discord / Line ID',
      submitRegister: '提交战队报名',
      successTitle: '报名提交成功！',
      successDesc: 'GLP 赛事组委会已收到您的信息，将尽快与您联系确认席位。',
      copiedLink: '已复制赛事链接！',
      shareTournament: '分享赛事'
    },
    seatBookingModal: {
      title: '提前预订电竞机位与VIP包间',
      subtitle: '自主挑选对战专区、专属座席、预订时段并享受现做餐饮直接送到桌。',
      step1: '1. 区域与机位',
      step2: '2. 日期与时长',
      step3: '3. 顾客信息与餐饮',
      step4: '4. 预订确认凭证',
      selectZone: '选择心仪专区',
      selectSeatTip: '点击机位图标选择或取消（支持多人连座同时预订）',
      available: '空闲',
      selected: '已选择',
      occupied: '使用中',
      ratePerHour: '标准收费:',
      memberPrice: '会员尊享价:',
      bahtHour: '泰铢/小时',
      selectedSeatsCount: '已选机位数量:',
      dateLabel: '预约到店日期:',
      timeSlotLabel: '开始使用时段:',
      durationLabel: '时长计费套餐:',
      package2hr: '2 小时 (轻松体验)',
      package4hr: '4 小时 (热门推荐 - 绝佳时长)',
      package6hr: '6 小时 (冲分畅玩)',
      packageNight: 'Night Owl 通宵通玩包 23:00 - 08:00 (特惠 150 泰铢)',
      custName: '预订人姓名:',
      custPhone: '联系电话 (必填):',
      custEmail: '电子邮箱 (选填):',
      memberCheck: '是否为 GLP 会员？',
      isMemberLabel: '我是 GLP 会员 (享每小时优惠 10 泰铢)',
      memberId: 'GLP 会员卡号:',
      foodLabel: '精选餐饮套餐 (现点现做 直接送达机位):',
      foodNone: '不需要餐饮 (0 泰铢)',
      foodEnergy: '能量补给套餐 (红牛 + 嫩蛋火腿盖饭) (+89 泰铢/位)',
      foodFeast: '电竞狂欢盛宴 (黑糖波霸奶茶 + 打抛猪肉饭 + 薯条) (+149 泰铢/位)',
      foodCoffee: '精品现磨咖啡特惠 (鲜烘意式冰咖啡 + 牛角包) (+65 泰铢/位)',
      notes: '其他补充需求 (选填):',
      totalEstimated: '预估总费用:',
      btnNext: '下一步',
      btnBack: '上一步',
      btnConfirm: '确认预订机位',
      ticketSuccess: '机位预订成功！',
      ticketSubtitle: '感谢您选择 G-SPEED ARENA。请保存您的预订凭证，到店向前台出示即可上机。',
      ticketCode: '预订编号 (Booking Code):',
      stageFront: '─── 赛事舞台与主转播巨幕 ───',
      hardwareSpecs: '区域硬件配置',
      btnCopyCode: '复制预订码',
      btnPrintTicket: '打印预订凭证',
      btnClose: '完成并关闭'
    },
    organizerModal: {
      title: '承办电竞赛事与场地租赁',
      subtitle: '国际职业标准电竞赛事场馆，配备隔音主舞台、4K巨幕LED转播屏、360Hz职业电竞设备与10Gbps专用专线。',
      chipStage: '5v5 专业隔音主舞台',
      chipScreen: '4K 巨幕LED影音演播屏',
      chipGear: 'RTX 40 系列 360Hz',
      chipCaster: '现场解说与转播席位',
      section1: '选择比赛项目',
      section2: '联系人与主办机构信息',
      section3: '档期与特殊需求',
      nameLabel: '联系人姓名 / 机构代表 *',
      orgLabel: '公司 / 院校 / 战队名称 (选填)',
      phoneLabel: '联系电话 (热线) *',
      emailLabel: '电子邮箱',
      lineLabel: 'LINE ID / 微信 (方便快速对接)',
      gameLabel: '比赛项目',
      expectedDateLabel: '预定举办日期',
      attendeesLabel: '预估参赛及到场人数',
      budgetLabel: '预估预算',
      addonsLabel: '所需设备与配套服务:',
      notesLabel: '补充说明或特殊需求 (如解说台、LED大屏转播等)',
      submitBtn: '提交赛事预订申请',
      submitFull: '提交赛事申请并获取免费报价',
      fastHelpTitle: '查询即时档期或紧急咨询:',
      callHotline: '拨打热线',
      chatLine: '官方 LINE 咨询',
      chatLineSuccess: '通过 LINE OA 咨询与沟通细节',
      successTitle: '赛事预订申请已成功提交！',
      successDesc: 'GLP 赛事运营团队已收到您的申请，将在24小时内与您取得联系并提供定制化场地方案。'
    },
    franchisePlanner: {
      walkModeActive: "第一人称漫游模式已启用",
      walkModeBtn: "漫游视角",
      storefrontViewTooltip: "门头视角",
      storefrontViewBtn: "门头",
      switchTo3DTooltip: "切换到3D全景",
      switchTo2DTooltip: "切换到2D俯视图",
      exitWalkModeTooltip: "退出漫游模式 (可按ESC)",
      exitWalkModeBtn: "退出漫游 (ESC)",
      orText: "或",
      walkThroughVenue: "店内漫游",
      mouse360: "鼠标 360°",
      clickMouse: "点击鼠标",
      mouseLookLocked: "移动鼠标环视四周 (锁定准星)",
      mouseLookUnlocked: "点击锁定鼠标进行360°环视",
      sprintKey: "加速奔跑",
      exitWalkOrUnlock: "退出漫游 / 解锁鼠标",
      eyeLevel: "视线高 1.65米",
      forwardTitle: "前进",
      strafeLeftTitle: "向左平移",
      strafeRightTitle: "向右平移",
      backwardTitle: "后退",
      sprintToggleTitle: "切换疾跑 / 步行",
      sprintOn: "加速 (开启)",
      turnLeftTitle: "向左转头",
      turnLeftBtn: "向左看",
      turnRightTitle: "向右转头",
      turnRightBtn: "向右看",
      hintDesktop3D: "左键拖拽旋转视角 • 右键平移 • 方向键微调设备位置",
      hintMobile3D: "单指滑动旋转360° • 双指捏合缩放",
      nudge3DGroupTitle: "在3D中微调物品位置（或使用键盘方向键）",
      moveLabel: "移动:",
      nudgeLeft3DTooltip: "向左移动 (-0.5米) 或按 ←",
      nudgeRight3DTooltip: "向右移动 (+0.5米) 或按 →",
      nudgeUp3DTooltip: "向前移入 (-0.5米) 或按 ↑",
      nudgeDown3DTooltip: "向后移出 (+0.5米) 或按 ↓",
      rotate90Btn: "旋转 90°",
      duplicateBtn: "复制",
      deleteBtnShort: "删除",
      mainEntranceCanvas: "入口",
      pullDoorSign: "拉 • PULL",

      toggleBlueprintHint: "显示/隐藏附加蓝图",
      adjustDoorHeaderHint: "点击调整大门位置及招牌（左侧面板）",
      adjustMaterialsHeaderHint: "点击更换墙纸与地面材质",
      addItemsHeaderHint: "点击打开添加设备面板（左侧面板）",
      tabItemsTooltip: "查看选中设备详情及店内设备清单",
      tabDoorTooltip: "配置店铺大门位置、款式及招牌",
      tabMaterialsTooltip: "配置墙面壁纸与室内地坪材质",
      tabCatalogTooltip: "浏览并添加电竞工作站/设施到平面图",
      closeDoorConfigTooltip: "关闭大门设置",
      storeNamePlaceholder: "例如 GLP : G SPEED LIVING PLUS...",
      presetSiamSquare: "暹罗广场店",
      closeSelectionTooltip: "取消选中",
      viewSpecsAndZoomTooltip: "点击查看完整规格及高清图",
      duplicateModuleTooltip: "复制此模块 (Duplicate)",
      deleteModuleTooltip: "从平面图中删除模块 (按 Delete)",
      goToAddTabTooltip: "前往添加设备标签",
      selectDoorTooltip: "点击选择并调整大门位置",
      expandDetailsTooltip: "点击折叠信息",
      collapseDetailsTooltip: "点击查看尺寸、价格及管理模块",
      selectAndNudgeIn3DTooltip: "在3D视图中选中并调整位置",
      rotate90Tooltip: "旋转 90 度",
      removeItemFromLayoutTooltip: "从店面平面图中移除此项",
      changeWallpaperInTab2Tooltip: "点击在标签2中更换壁纸",
      changeFloorInTab2Tooltip: "点击在标签2中更换地板材质",
      adjustDoorWallTooltip: "点击调整大门位置",
      wallFront: "正门",
      wallLeft: "左墙",
      wallBack: "后墙",
      wallRight: "右墙",
      activeInUse: "使用中",
      viewFullSpecsCardHint: "点击查看完整规格及实物照片",
      swatchesCardHint: "材质配色与氛围灯",
      swatchDeskColor: "桌面颜色",
      swatchAccentColor: "装饰灯光颜色",
      swatchChairColor: "电竞椅颜色",
      dimensionsLabel: "尺寸:",
      heightLabel: "高",
      addDirectlyTo3DTooltip: "立即添加到3D平面图",
      totalWithColon: "总计",
      deskItemPrefix: "桌",
      chairItemPrefix: "椅",
      unitsPcs: "把",
      clearEntireLayoutTooltip: "清空全部布局",
      zoomOutBlueprintTooltip: "缩小平面图 (-)",
      zoomResetBlueprintTooltip: "点击重置 100%",
      zoomInBlueprintTooltip: "放大平面图 (+)",
      zoomFitBlueprintTooltip: "适应屏幕 (100%)",
      loungeSofa: "休息室沙发",
      dragHandleTooltip: "点击选中或拖拽移动位置",
      nudgeClusterTooltip: "微调位置（或使用键盘方向键 ↑ ↓ ← →）",
      nudgeLeftTooltip: "向左微调 0.2米 (按 ←)",
      nudgeUpTooltip: "向上微调 0.2米 (按 ↑)",
      nudgeDownTooltip: "向下微调 0.2米 (按 ↓)",
      nudgeRightTooltip: "向右微调 0.2米 (按 →)",
      step3_stationsDesc: "可根据目标客群与预算选择硬件规格层级（电竞椅已整合于工作站组合中）。",
      downloadBlueprintForContractorTooltip: "下载承包商施工蓝图 (PNG)",
      companyNameLegal: "G-Speed Living Plus 有限公司（总部）",
      companyAddress: "泰国曼谷乍都节区帕凤裕庭路 G-Speed 大厦 88/9 号 10900",
      companyTaxIdContact: "纳税人识别号: 0105566012345 | 电话: +66 2 888 9999 | 网站: www.gspeed-esport.com",
      blueprintReceivedNoticePrefix: "系统已成功登记蓝图及场地尺寸",
      blueprintReceivedNoticeSuffix: "已归档。G-Speed 建筑设计团队将以此深化超高清3D实景渲染图，并在24小时内向您发送官方总承包报价单。",
      leadNamePlaceholder: "例如 张先生 / Somkiat M.",
      budgetCalculatedAuto: "根据店面布局及硬件规格自动测算",
      budgetAutoOptionDesc: "按平面图自动测算",
      budget1to2m: "100万 - 200万 泰铢",
      budget2to35m: "200万 - 350万 泰铢",
      budget35to5m: "350万 - 500万 泰铢",
      budget5mPlus: "500万 泰铢以上 (旗舰电竞馆)",
      budgetSummaryLabel: "预估总投资（含硬件及总包基础设施）:",
      leadNotesPlaceholder: "例如 大学城主干道旁两间商铺，临街位置...",
      downloadBlueprintHint: "下载施工蓝图 (PNG)",
      closeModalAria: "关闭窗口",
      unzoomTooltip: "点击还原正常视图",
      zoomTooltip: "点击放大查看100%细节及文字",

      step3_stationsBanner: "您当前场地布局的电脑总数为",
      quoteModalHeaderTitle: "初审投资预算报价单: GLP G-Speed Living Plus 电竞馆加盟",
      quoteSuccessToastTitle: "开店方案及意向信息已成功提交！",
      quoteSuccessToastDesc: "GLP 专属工程师与投资顾问将审核您的场地设计，并在24小时内与您致电预约实地勘测。",
      companyNameFull: "G-Speed Living Plus 有限公司 (总部)",
      leadDefaultInvestor: "意向加盟投资人 (Franchise Investor)",
      blackObsidianVal: "曜石黑 (质感哑光黑)",
      esportBlueVal: "电竞深蓝 (Esport Blue)",
      cyberCyanVal: "赛博青蓝 (Cyber Cyan)",
      auraPurpleVal: "极光幻紫 (Aura Purple)",
      bahtShort: "泰铢",
      thankYouFeasibilityBody: "我们正在根据您的场地实用面积",
      andCount: "及规划电脑席位数",
      toPrepareFeasibility: "测算专属可行性分析报告 (Feasibility Study) 与月度回报测算。官方专家将致电",
      orEmail: "或发送邮件至",
      within24Hours: "在24小时内与您联系，交付正式项目方案并预约免费一对一开店咨询。",
      refBlueprint: "参照底图:",
      stateOn: "已开启",
      stateOff: "已关闭",
      opacityLabel: "透明度:",
      wallColor: "墙面颜色",
      floorColor: "地面颜色",
      realProductPhotoBadge: "G-Speed 专属工厂实体产品实拍",
      colorAndFinishTitle: "实体色彩与质感用料 (Color & Finish)",
      deskTopLegColor: "台面及桌腿颜色",
      neonAccentColor: "霓虹灯光及装饰边",
      chairLeatherColor: "电竞椅皮质配色",
      racingBlackVal: "竞速黑 (双线精工缝制PU环保皮革)",
      specHplTop: "台面面板:",
      specHplTopDesc: "25mm 高压层压复合耐磨板 (HPL)：耐热防刮痕，100%防水且经久耐磨",
      specErgoEdge: "人体工学前沿微弧:",
      specErgoEdgeDesc: "45度人体工学斜切圆滑倒边，贴合手臂手腕，长久对战不累",
      specSteelFrame: "钢架支撑梁与桌腿:",
      specSteelFrameDesc: "1.5 - 2.0mm 高强度碳钢管结构，环保静电防锈喷塑，承重能力超 250kg",
      chairModelLabel: "电竞椅型号:",
      chairCountPrefix: "配备",
      perStationSuffix: "把/席位",
      specCushion: "座椅坐垫:",
      specCushionDesc: "高密度一体发泡冷发泡海绵，久坐不塌陷，保障连续商业高频使用",
      specRecline: "调节系统:",
      specReclineDesc: "160度大角度后仰逍遥锁定，配置3D/4D多向可调电竞扶手",
      specGasLift: "气压防爆升降:",
      specGasLiftDesc: "国际 BIFMA 认证 Class 4 防爆加厚气压棒，单把承重达 150kg",
      specRaceway: "桌底强弱电双分离线槽:",
      specRacewayDesc: "独立双金属理线槽，220V强电与CAT6A弱电网线物理隔离，确保零电磁干扰",
      specSocket: "独立防浪涌插座:",
      specSocketDesc: "双联国标/通用三孔带接地电源插座 (220V 16A)，配备独立防浪涌保护",
      specLan: "高速千兆网络端口:",
      specLanDesc: "六类屏蔽 CAT6A RJ-45 工业级网口，支持万兆速率直连中心机柜",
      standardDeskPrefix: "标准对战桌",
      racewayIncluded: "全套内置走线槽管线",
      zooming100: "100% 放大中 (点击还原整体视图)",
      clickToZoom100: "点击图片可 100% 放大查看所有文字标注与设备细节",
      hintLabel: "操作提示:",
      zoomedHint: "再次点击图片可还原全图 | 滚动鼠标滚轮浏览各分区",
      unzoomedHint: "点击图片或“100%放大”按钮，即可清晰阅读所有施工图纸标注",
      saveFilePng: "保存施工图 (PNG)",
      zoomFit: "适应窗口",
      zoom100: "100% 原大",
      openNewTab: "在新标签页打开",
      boqItem1_title: "电竞专业电脑机台配置套组:",
      monitor: "显示器:",
      gamingGear: "电竞外设:",
      boqItem1_note: "(不含椅 - 已在桌组中配备)",
      boqItem2_title: "电竞对战桌椅与VIP包厢工程 (全套人体工学座椅及专用桌)",
      boqItem2_desc: "按场地规划排布:",
      modulesUnit: "个模块",
      unitSet: "套",
      unitSystem: "套系统",
      unitBranch: "家分店",
      boqItem2_note: "(配齐所有席位人体工学椅、双槽走线管及防浪涌双三孔电源插座)",
      boqItem3_title: "室内硬装、吸音隔音墙面及线性矩阵赛博灯带",
      boqItem3_desc: "专业吸音阻尼墙面、重载商用防静电地板/地毯、3D发光品牌门头灯箱",
      boqItem4_title: "商用节能变频多联机吸顶空调及新风系统",
      boqItem4_desc: "四面出风嵌入式变频吸顶机，配备独立新风排气系统，满足24小时连续高负荷运行",
      boqItem5_title: "万兆企业级无盘主控服务器集群 (双机热备)",
      boqItem5_desc: "双机热备服务器，配备200+款游戏库全自动极速更新，支撑全场瞬间无延迟并发启动",
      boqItem6_title: "企业级双线光纤智能分流极速网络与思科万兆交换机",
      boqItem6_desc: "CAT6A六类双屏蔽双绞线工程、42U标准服务器机柜、10kVA中央不间断电源UPS",
      boqItem7_title: "专业电竞上机计费与云端会员收银POS一体化系统",
      boqItem7_desc: "机台控制计费系统、智能防盗钱箱、扫码盒子及云端会员积分联网系统",
      boqItem8_title: "G-Speed 品牌特许加盟授权及全套交钥匙带店开业服务",
      boqItem8_desc: "品牌使用权、3D施工深化图纸、店长与店员全套SOP培训、盛大开业企划宣传",
      subtotalPreTax: "税前预估投资小计 (Subtotal):",
      vat7Label: "增值税 7% (VAT 7%):",
      term1_title: "分三期支付节点:",
      term1_desc: "第一期 (签约首付定金) 30% | 第二期 (设备进场与装修) 50% | 第三期 (整店交付验收) 20%",
      term2_title: "质保承诺 (Warranty):",
      term2_desc: "电脑硬件与服务器享受3年原厂上门保修，网络系统通过云端网管中心24小时不间断监控",
      term3_title: "工期交付时间:",
      term3_desc: "自签约进场起 4 - 6 周内全部完工交付，达到盛大营业标准",
      term4_title: "交钥匙总包说明:",
      term4_desc: "包含物流运输、强电配电安装、六类网线敷设、无盘系统搭建及全员实操培训",
      signNeonLed: "发光霓虹",
      signGoldAcrylic: "镜面金亚克力",
      signMinimalCyber: "极简赛博",
      signGrandArch: "宏伟门头",
      wallpaperKey: "壁纸风格:",
      floorKey: "地面材质:",
      doorEntranceKey: "入户大门:",
      fitScreen: "适应屏幕",
      entrance: "入口",
      selectedPill: "已选中",
      newItemDragPrompt: "新设备！点击拖动排布",
      dragFreely: "鼠标拖动",
      moveFree: "自由移动",
      arrowKeysLabel: "方向键",
      onKeyboard: "键盘微调",
      controlsGuideTitle: "视角与操作说明:",
      controlsGuideDesc: "鼠标左键360度旋转视角 • 滚轮缩放 • 点击设备查看桌椅详情及造价",
      quoteDocBadge: "正式工程报价单 / ESTIMATED QUOTATION",
      quoteRefNo: "报价单编号:",
      quoteIssueDate: "出单日期:",
      quoteValidity: "报价有效期:",
      quoteValidityVal: "出单日起 30 天内有效",
      customerInfoTitle: "客户及加盟申请人信息 (CUSTOMER INFO)",
      customerNameLabel: "客户名称 / 企业法人:",
      customerPhoneLabel: "联系电话:",
      customerEmailLabel: "电子邮箱:",
      customerBudgetLabel: "拟定投资预算:",
      projectSpecsTitle: "分店项目规格明细 (PROJECT SPECIFICATIONS)",
      storeLocationLabel: "选址意向地段:",
      roomDimensionsLabel: "场地实用面积:",
      pcSpecsLabel: "选用硬件档次:",
      areaSizeLabel: "场地面积:",
      stationsCountLabel: "电脑台数:",
      installDurationLabel: "施工周期:",
      installDurationVal: "4-6 周",
      paybackEstLabel: "预估回本期:",
      attachedBlueprintLabel: "附带图纸:",
      customBpAttachedTitle: "客户附带专属建筑图纸 (Custom Blueprint Attached)",
      boqColNo: "序号",
      boqColDesc: "工程及设备明细项目说明 (BOQ DESCRIPTION)",
      boqColQty: "数量",
      boqColUnit: "单价",
      boqColTotal: "合价 (泰铢)",
      boqSubtotal: "合计总额 (SUBTOTAL):",
      boqVat: "增值税 (VAT 7%):",
      boqGrandTotal: "最终结算法定总价 (GRAND TOTAL):",
      commercialTermsTitle: "商业条款及售后保证 (COMMERCIAL TERMS & WARRANTY)",
      authorizedSignatureTitle: "报价审批授权人 (Authorized Signature)",
      franchiseDeptTitle: "特许加盟业务拓展部 / G-Speed Living Plus Co., Ltd.",
      franchiseeAcceptanceTitle: "加盟申请人确认签字 / 客户 (Franchisee Acceptance)",
      agreementTitle: "同意本报价单全部条款并确认",
      datePrefix: "日期:",
      calcByLayout: "根据当前排布自动测算",
      customBudgetConsult: "有特定投资预算 / 专属专家咨询",
      thankYouRefSaved: "方案保存成功 • 参考编号:",
      thankYouTitle: "感谢您对 GLP 的信赖与支持",
      thankYouSubtitle: "GLP 专业系统工程师及加盟投资顾问已成功接收您的3D场地规划方案。",
      slaTitle: "24小时内专属专家致电跟进承诺",
      placedLayoutLabel: "规划电脑机位",
      estBudgetLabel: "预估投资额",
      emailStatusLabel: "邮件送达状态",
      autoCopySent: "自动确认函已发送",
      autoRedirectCountdownPrefix: "系统将在",
      secondsUnit: "秒后返回首页",
      goToHomeBtn: "立即返回网站首页",
      stayOnPlannerBtn: "继续查看3D设计",
      step1_presetsLabel: "选择标准预设户型:",
      step1_widthMetersLabel: "场地宽度 (Width):",
      step1_lengthMetersLabel: "场地进深/长度 (Length):",
      totalAreaLabel: "总使用面积:",
      supportsApprox: "约可容纳",
      comfortableSeating: "舒适不拥挤",
      haveBlueprintPrompt: "已有实体场地的建筑施工蓝图？",
      switchToBlueprint: "切换至蓝图上传 (AI可选)",
      dragBlueprintHint: "拖拽建筑图纸至此处，或点击选择文件 (可选)",
      blueprintFormatsHint: "支持建筑蓝图、平面布置图、2D手绘草图、扫描件 (PNG, JPG, WEBP)",
      selectBlueprintFile: "从本地选择蓝图",
      useSampleBlueprint: "体验商用排屋示例蓝图",
      aiScanningBlueprint: "AI 正在扫描图纸、测算空间比例并规划电竞分区...",
      blueprintAttached: "已成功载入图纸:",
      deleteBlueprint: "移除图纸",
      changeBlueprint: "更换文件",
      actualBuildingWidth: "实际建筑宽度 (Width):",
      actualBuildingLength: "实际建筑进深 (Length):",
      recommendedCapacity: "建议电脑台数:",
      estimatedCapex: "预估投资总额:",
      estimatedMonthlyProfit: "预计月净利润:",
      roiPaybackPeriod: "投资回报期 (ROI):",
      calculatedZoneAllocation: "智能测算分区规划比例:",
      smartLayoutAdviceTitle: "专业场地布局规划建议 (Smart Layout Advice)",
      autoLayoutBtn: "智能一键自动排布",
      manualLayoutBtn: "手动自定义排布",
      wantStandardPreset: "需要使用标准房间尺寸与预设模型？",
      switchToStandardPreset: "切换至预设户型 (默认)",
      usingBlueprint: "使用图纸:",
      simulatedSpaceSize: "模拟场地尺寸:",
      loc_bkk: "曼谷及周边都会区 (大学城/核心商圈)",
      loc_cm: "清迈 / 泰国北部地区",
      loc_esan: "孔敬 / 呵叻 / 东北部地区",
      loc_east: "春武里 / 芭提雅 / 泰国东部",
      loc_south: "普吉岛 / 宋卡 / 泰国南部",
      type_shophouse: "2-3 联排商业排屋 (Shophouse)",
      type_mall: "大型商场 / 购物生活广场租赁铺位",
      type_standalone: "独立单体建筑 / 仓储改建空间",
      type_campus: "大学校园周边 / 学生公寓生活区",
      initialCostSummary: "初期投资预算汇总",
      hardwareCostRow: "电脑硬件",
      furnitureCostRow: "桌椅与VIP包厢工程:",
      interiorCostRow: "室内装饰工程",
      airconCostRow: "空调及新风排气系统:",
      franchiseFeeRow: "加盟品牌授权及开业指导费:",
      totalInvestmentEstimateLabel: "全套整店投资预算预估:",
      turnkeyIncludedNote: "* 包含全套电脑硬件、装修工程及开业即营运标准",
      nextChooseSpecsWithCount: "下一步: 选择配置",
      viewFullSpecs: "查看详细规格",
      dimSizePrefix: "尺寸:",
      totalPricePrefix: "合计",
      viewSpecsShort: "规格",
      deskPrefix: "桌子",
      chairsPrefix: "椅子",
      presetLayoutModels: "预设户型排布:",
      clearLayoutAll: "清空所有布局",
      addEquipmentTitle: "添加设备与功能分区",
      addEquipmentSubtitle: "点击右侧 + 按钮，即可将设备直接加入到场地中",
      cat_stations_short: "电竞桌",
      cat_service_short: "服务台/前台",
      cat_doors_short: "门窗结构",
      adminLabel: "管理员权限:",
      adminDesc: "可随时在后台调整硬件规格、新增机型或修改各项目单价",
      adminCmsBtn: "进入硬件配置与价格管理后台",
      perStationFullSet: "台 (完整全套)",
      totalForStations: "共",
      gamingChairLabel: "专业电竞椅:",
      gamingChairIncludedNote: "已标配包含在电竞桌组中",
      selectedThisTier: "已选用该配置",
      selectThisTier: "选用该档次配置",
      includedInfraTitle: "核心主控机房与极速网络工程 (标配包含)",
      disklessServerDesc: "双台企业级NVMe高可用母机，承载200+款主流游戏，免单机安装，24小时自动更新游戏补丁",
      dualWanDesc: "双ISP多线自动灾备与智能分流，确保比赛极低Ping (1-3ms)，配备思科万兆管理型交换机",
      billingPosDesc: "集会员管理、上机计费、桌面扫码点餐点饮品于一体，支持手机端实时查看营收数据",
      nextBudgetRoi: "下一步: 预算与回报",
      turnkeyBreakdownTitle: "全套整店投资清单明细 (Turnkey Package)",
      workCategoryHeader: "工程与采购大类",
      detailsHeader: "规格及明细说明",
      budgetHeader: "预算金额",
      costItem1_title: "1. 电竞电脑工作站与竞技外设 (不含椅)",
      costItem2_title: "2. 场内电竞对战桌椅与VIP包厢工程",
      costItem2_desc: "含按座位配齐的电竞桌、人体工学椅、VIP私享包厢与5v5主舞台",
      costItem3_title: "3. 室内硬装、吸音墙面与极光线性灯带",
      costItem3_desc: "地胶地毯、声学阻尼隔音墙、矩阵赛博灯光",
      costItem4_title: "4. 商用变频多联机空调及新风系统",
      costItem4_desc: "商用4面出风嵌入式变频吸顶空调",
      costItem5_title: "5. 万兆无盘主控服务器集群",
      costItem5_desc: "双NVMe企业级主母机 + 200+款游戏库24小时全自动更新",
      costItem6_title: "6. 企业级双线极速网络与布线工程",
      costItem6_desc: "思科万兆交换机、Mikrotik核心路由、六类双屏蔽网线、42U机柜",
      costItem7_title: "7. 专业电竞计费系统与触控收银POS台",
      costItem7_desc: "机台控制客户端、智能钱箱、扫码盒、桌面扫码点餐点单系统",
      costItem8_title: "8. 品牌加盟特许授权与开业带店指导",
      costItem8_desc: "G-Speed品牌使用权、3D施工图纸、全套SOP员工培训、开业营销企划",
      costTotal_title: "整店交付总投资额 (Turnkey Package):",
      costTotal_status: "交钥匙工程 • 达到开业营业标准",
      interactiveRoiTitle: "财务收益测算与投资回本期 (Interactive ROI)",
      hourlyRateLabel: "机时收费标准 (泰铢 / 小时):",
      bahtPerHour: "泰铢/时",
      occupancyRateLabel: "平均每日上座率 (Occupancy Rate):",
      occLow: "偏低",
      occStandard: "标准",
      occPrime: "黄金商圈",
      monthlyRevenueKpi: "月总营业额",
      averagePerDay: "平均",
      dayUnit: "天",
      monthlyNetProfitKpi: "每月净利润",
      annualRoiKpi: "年投资回报率 (ROI)",
      paybackInMonths: "预计回本期",
      gamingHourRevenue: "电竞上机机时费收入",
      fnbRevenue: "水吧饮品及轻食零售收入:",
      grossMonthlyRevenue: "每月总营业收入 (Gross):",
      electricityCostEst: "预估电费与空调能耗支出:",
      staffSalariesEst: "员工薪酬支出 (2-3班制):",
      internetMiscEst: "专用光纤专线费及杂项开销:",
      netProfitTitle: "预估月度净利润 (Net Profit):",
      paybackEstTitle: "预计回本周期:",
      timelineTitle: "施工与交付进度计划 (约6周)",
      timelineDesc: "全套交钥匙流程：从实地勘测、硬装装修直至盛大开业正式营业",
      requestQuoteBtn: "获取正式报价单",
      dimSizeWidth: "宽度 (Width)",
      dimSizeDepth: "进深 (Depth)",
      dimSizeHeight: "高度 (Height)",
      seatsInSet: "套组席位数",
      servicePoint: "服务台",
      setPriceWithInstall: "整套总价 (含专业安装):",
      vatAndInstallIncluded: "(已含税金及上门调试安装费)",
      customDesk: "定制电竞工作桌:",
      gamingChairsCount: "专业电竞椅",
      specSection1_title: "1. 结构与工程材料规格 (Material & Construction)",
      specSection2_title: "2. 配套电竞座椅与家具规格 (Included Furniture)",
      specSection3_title: "3. 强弱电双分离线槽与万兆网管系统",
      specSection4_title: "4. 售后质保与生产交付周期",
      warrantyLabel: "售后质保:",
      leadTimeLabel: "生产交期:",
      modelIncludes: "该模型套组包含:",
      closeWindow: "关闭窗口",
      addTo3dPlan: "添加至 3D 布局 (Add to Plan)",
      delModalTitle: "确认从场地中移除此设备？",
      delModalDesc: "您确定要将该设备从 3D 场地布局模型中移除吗？",
      delModalSubtext: "您可以随时在以下标签页重新添加该设备:",
      confirmRemove: "确认移除",
      cancel: "取消",
      leadFormTitle: "提交开店意向，获取3D图纸及官方顾问致电",
      fullName: "您的姓名",
      phone: "联系电话",
      email: "电子邮箱 (接收正式报价单)",
      budgetLabel: "预期准备的投资预算",
      locationLabel: "计划开店的城市或意向地段",
      submittingLead: "正在提交中...",
      submitLeadBtn: "提交方案免费获取咨询",
      downloadBlueprintPng: "下载施工蓝图 (PNG)",
      printQuotationBtn: "打印正式报价单",
      prevStep: "上一步",
      badge: '3D 智能电竞馆加盟规划系统',
      title: '3D 空间布局规划与加盟投资回报测算系统',
      subtitle: '自主规划电脑对战席、主舞台、吧台与灯光风格，即时生成投资预算及电脑配置方案',
      tabStoreSize: '1. 场地尺寸',
      tabLayout: '2. 2D/3D 布局',
      tabHardware: '3. 硬件配置',
      tabQuote: '4. 预算与报价',
      view2D: '2D 平面蓝图',
      view3D: '3D 漫游实景',
      totalArea: '总面积',
      recommendedStations: '推荐机位数',
      estimatedCapex: '预估初始投资 (CAPEX)',
      monthlyProfit: '预估月净利润',
      paybackPeriod: '预估回本周期',
      months: '个月',
      exportPdf: '打印 / 导出PDF',
      requestQuote: '申请官方正式报价单',
      step1Title: '设定电竞馆场地空间尺寸',
      step1Desc: '输入房间宽度与长度以实时生成3D空间模型，或直接选用标准预设模板开始设计。',
      roomWidth: '宽度 (米)',
      roomLength: '长度 (米)',
      presetsTitle: '预设标准户型模板',
      uploadBlueprint: '上传建筑结构图 / 施工蓝图',
      nextStep: '下一步',
      prevStep: '上一步',
      step2Title: '3D 空间设计与 2D 平面蓝图',
      mode3D: '3D 实景',
      mode2D: '2D 平面图',
      autoLayout: '智能自动排布',
      fullscreen: '全屏模式',
      exitFullscreen: '退出全屏 (ESC)',
      exitWalk: '退出漫游 (ESC)',
      walkMode: '身临其境漫游',
      storefront: '门头视角',
      topDown: '俯视平面',
      doorEntrance: '进店大门',
      wallFront: '前墙',
      wallRight: '右墙',
      wallLeft: '左墙',
      wallBack: '后墙',
      tabDetails: '设备详情',
      tabDoor: '大门设置',
      tabMaterials: '墙面/地面',
      tabCatalog: '+ 添加设备',
      roomSize: '场地尺寸:',
      placedStations: '已排布机位:',
      placedItemsCount: '放置物件:',
      aisleStatus: '过道消防状态:',
      aisleSafe: '达标合规·安全畅通',
      aisleCrowded: '机位过密·需调整',
      blueprintExport: '导出施工图 (PNG)',
      step3Title: '全场电脑电竞硬件配置方案',
      step3Desc: '当前平面图规划机位总数：',
      unitStation: '套 (全套含外设)',
      totalFor: '共',
      step4Title: '电竞馆全案投资预算测算总览',
      requestQuoteTitle: '索取官方定制报价方案',
      submitQuoteBtn: '提交报价申请',
      fullName: '姓名',
      phone: '联系电话',
      email: '电子邮箱',
      budgetLabel: '预计投资预算区间',
      locationLabel: '意向开店城市/商圈',
      noteLabel: '补充需求 / 备注说明',
      step1_setupTitle: '设定场地尺寸与建筑蓝图',
      step1_setupDesc: '选择标准预设户型模板快速开始测算与布局，或上传真实建筑结构/施工图。',
      step1_presetTab: '自定义尺寸',
      step1_blueprintTab: '上传建筑蓝图',
      step1_defaultBadge: '默认推荐',
      step1_optionalBadge: 'AI智能解析',
      step1_roomPresets: '选择标准预设户型模板：',
      step1_manualSliders: '微调场地长宽尺寸：',
      step1_widthM: '宽度：',
      step1_lengthM: '长度：',
      step1_sqm: '平方米',
      step1_meters: '米',
      step1_locationCardTitle: '商圈区位与空间风格',
      step1_provinceLabel: '省份 / 开店区域',
      step1_storeTypeLabel: '建筑类型 / 物业形态',
      step1_themeLabel: '电竞馆装修设计风格',
      step1_nextBtn: '下一步：排布空间',
      step2_aisleStandard: '达标合规·安全畅通',
      step2_aisleDense: '机位过密·需调整',
      step2_nextBtn: '下一步：选配硬件',
      step2_prevBtn: '返回',
      step2_rotateLandscape: '切换旋转 90°',
      step2_restoreLandscape: '恢复正常视角',
      step2_landscapeHint: '全屏提示：建议将 iPad / 平板转为横屏以获得最佳视野',
      step3_nextBtn: '下一步：查看预算与ROI',
      step3_hardwareTotal: '全场电脑硬件总投资：',
      step3_hardwareTier: '选择电竞电脑硬件配置档次',
      step4_capexBreakdown: '总投资成本构成明细 (CAPEX)',
      step4_roiSimulator: '投资回报与回本测算模型 (ROI)',
      step4_printQuote: '打印报价单 (A4)',
      step4_officialQuoteBtn: '索取官方定制报价方案',
      step4_hourlyRate: '平均每小时上网费',
      step4_occupancy: '平均上座率',
      step4_operatingHours: '每日营业时长',
      step4_monthlyRevenue: '预计月营业总收入',
      step4_monthlyOpex: '预计月运营支出 (OPEX)',
      step4_monthlyProfit: '预计月净利润',
      step4_payback: '预计投资回本周期',
      step4_paybackMonths: '个月',
      touchWalkHint: '👆 滑动屏幕漫游，或使用下方虚拟摇杆控制',
      lockMouseHint: '点击画面锁定鼠标开启 360° FPS 视角',
      exitWalkModeTitle: '退出漫游模式 (ESC)',
      exitFullscreenTitle: '退出全屏模式 (ESC)',
      doorConfigTitle: '设置进店大门位置 (Store Entrance)',
      doorSelectWall: '选择安装大门的墙面：',
      wallFrontFull: '正前方 (Front)',
      wallRightFull: '右侧墙 (Right)',
      wallLeftFull: '左侧墙 (Left)',
      wallBackFull: '后方墙 (Back)',
      doorStyle: '大门样式：',
      doorSingle: '单开玻璃门 (黑膜)',
      doorDouble: '双开玻璃门 (黑膜)',
      storeNameLabel: '门头店名 / 招牌文字：',
      signStyleLabel: '招牌与标牌风格：',
      signNeon: '霓虹 LED 灯箱',
      signGold: '轻奢黑金亚克力',
      signMinimal: '极简赛博暗黑',
      signArch: '气派拱形门头',
      // Breadcrumbs & Stepper
      step1_crumb: '尺寸',
      step2_crumb: '3D 布局规划',
      step3_crumb: '硬件配置',
      step4_crumb: '预算与回报',
      metricCapacity: '容纳容量:',
      metricArea: '总面积:',
      metricInvestment: '投资预算:',
      metricPayback: '回本周期:',
      chooseSpecsBtn: '选择配置 →',
      quoteSummaryBtn: '报价汇总',

      // Quick Bar
      quickDoor: '大门: ',
      quickTheme: '色彩风格',
      quickAdd: '+ 添加设备',

      // Left Sidebar Tabs
      tabDetails: '详情',
      tabDoor: '大门设置',
      tabMaterials: '墙面/地面',
      tabCatalog: '+ 添加设备',
      tabCatalogShort: '添加设备',

      // Units
      metersUnit: '米',
      sqmUnit: '平方米',
      stationsCountUnit: '台',
      itemsCountUnit: '件',
      seatsCountUnit: '座',
      unitsChairs: '把',
      unitsPerChair: '/把',

      // Details Installed Items List
      installedItemsTitle: '已安装店内设备',
      mainEntranceDoor: '进店主大门',
      glassDoubleTint: '双开钢化玻璃 (黑膜)',
      glassSingleTint: '单开钢化玻璃 (黑膜)',
      autoSlidingTint: '自动感应移门 (黑膜)',
      settingsBtn: '设置',
      noItemsInLayout: '场地中暂无设备，点击上方“+ 添加设备”开始布局。',
      itemActionInspect: '点击查看尺寸、价格及操作',
      itemActionCollapse: '点击收起详情',
      moduleSize: '模块尺寸',
      estimatedPrice: '预估价格',
      focusIn3D: '3D 聚焦',
      rotateAction: '旋转',
      removeAction: '移除',

      // Categories
      cat_stations: '电竞对战区',
      cat_facilities: '服务与系统',
      cat_stage: '赛事主舞台',
      cat_architectural: '建筑与门窗',
      cat_amenities: '休闲与氛围',
      cat_vip: 'VIP包厢与直播',
      cat_all: '全部',
      cat_equipment: '配套设施',

      // Selected Item Inspector Card
      selectedModuleBadge: '已选模块',
      clickFullSpecs: '点击查看大图与完整规格',
      modulePriceBreakdown: '模块价格明细',
      deskAndStructure: '对战桌与骨架结构',
      gamingChairsSeats: '电竞椅 / 座位',
      noChairs: '无',
      dimensionsWxDxH: '空间尺寸 (宽 x 深 x 高)',
      dimWidth: '宽',
      dimDepth: '深',
      dimHeight: '高',
      totalModulePrice: '该模块总价:',
      positionOrientation: '房间内位置与朝向',
      axisX: 'X轴 (水平):',
      axisY: 'Y轴 (纵深):',
      angle: '角度:',
      rotate90: '旋转 90°',
      duplicate: '复制',
      delete: '删除',
      dragHint: '可自由拖拽或使用键盘方向键 [↑][↓][←][→] 微调',

      // Door Configuration Panel
      archStructureBadge: '建筑结构组件',
      storeEntranceDesc: '进店大门 • 调整墙体朝向、位置比例与门头样式',
      selectDoorWall: '选择安装大门的墙体:',
      positionAlongWall: '沿墙安装位置:',
      presetLeft25: '左侧 25%',
      presetCenter50: '居中 50%',
      presetRight75: '右侧 75%',
      presetBack25: '后侧 25%',
      presetFront75: '前侧 75%',
      doorStyleLabel: '大门款式:',
      doorSingleOption: '单开门 (黑膜)',
      doorDoubleOption: '双开门 (黑膜)',
      storeNameInputLabel: '店名 / 3D发光门头招牌:',
      signStyleInputLabel: '招牌与贴纸风格:',
      saveDoorPosition: '完成 / 保存大门设置',

      // Materials Tab
      materialsHeaderTitle: '墙面材质与地材风格',
      materialsHeaderSubtitle: '点击即可切换风格并实时预览 3D 光影效果',
      wallFinishesTitle: '1. 场地墙面造型 (Wall Finishes):',
      currentlyActive: '使用中',
      floorFinishesTitle: '2. 场馆地面材质 (Floor Finishes):',
      materialsTip: '💡 墙面与地面费用将自动计入投资预算中的“室内装修”项',
      backToDetailsTab: '← 返回查看场地规划详情',

      // Bottom Navigation Bar
      bottomNavRoomSize: '场地尺寸:',
      bottomNavRecommended: '推荐',
      bottomNavStoreLayout: '场地规划:',
      bottomNavSpecs: '配置方案:',
      bottomNavBudget: '总预算:',
      bottomNavPayback: '预计回本',

      // Catalog Items (14 items)
      'item_pc-row-2': '双人对战电竞桌 (Double Station)',
      'desc_pc-row-2': '双人标准电竞桌，符合职业赛间距标准，提供超宽鼠标滑动操控空间',
      'item_pc-row-4': '4人联排对战工作站 (Quad Station)',
      'desc_pc-row-4': '标准4联排直列工作站，贴墙布局首选，大幅提升场地坪效',
      'item_pc-island-6': '6人中央对战岛 (Island 6)',
      'desc_pc-island-6': '6座中央对战岛，中置线槽与走管立柱，节省空间且走线整洁',
      'item_vip-room-5': 'VIP 私享隔音包厢 (5座)',
      'desc_vip-room-5': '隔音私密玻璃包厢，专为战队集训拉练、直播及私密对战打造',
      'item_stage-5v5': '5v5 职业电竞赛事主舞台',
      'desc_stage-5v5': '10席(5v5)顶级赛事舞台，配备专业灯光桁架、LED大屏背景与解说台',
      'item_cashier-counter': '收银服务台与前台接待处',
      'desc_cashier-counter': '前台接待、会员登记、收银结算及即时充值一站式服务柜台',
      'item_server-room': '机房服务器机柜 (无盘主控系统)',
      'desc_server-room': '电竞馆核心数据中枢，集成无盘母机服务器与万兆极速局域网络',
      'item_cafe-bar': '水吧饮品站与轻食吧台 (Cafe Bar)',
      'desc_cafe-bar': '现磨咖啡、功能能量饮品及热食点心吧，支持扫码点单送至座位',
      'item_lounge-sofa': '观赛休息区与多人沙发',
      'desc_lounge-sofa': '舒适休息大沙发，专为观众、同行好友及亲友团观看赛事巨幕设计',
      'item_door-entrance': '主入户钢化玻璃/木质大门',
      'desc_door-entrance': '电竞馆主出入大门，大通透设计，方便高峰客流顺畅出入',
      'item_window-panoramic': '全景采光落地玻璃大窗',
      'desc_window-panoramic': '沿街全景大落地窗，采光通透，全方位展现馆内酷炫电竞氛围与人气',
      'item_vip-lounge-sofa': 'VIP 沙发休闲区 (配备65寸超宽曲面屏)',
      'desc_vip-lounge-sofa': '奢华皮革休闲沙发配65寸曲面巨幕，极佳适配VIP包厢及PS5/Switch主机游戏区',
      'item_smart-kiosk': '智能自助服务终端机 (32寸触控点单)',
      'desc_smart-kiosk': '24小时智能自助终端机：自主扫码充值、点餐点饮品与在线支付，释放前台人力',
      'item_neon-brand-sign': 'GLP 品牌3D发光亚克力霓虹灯牌',
      'desc_neon-brand-sign': 'GLP 品牌3D发光霓虹招牌，专用于门头外立面、焦点主题墙与网红打卡拍照点'
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
    if (typeof window !== 'undefined') {
      window.__GLP_CURRENT_LANG__ = language;
    }
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

  // Listen for translation cache updates to trigger reactive re-render (debounced)
  const [, setCacheRevision] = useState(0);
  useEffect(() => {
    let debounceTimer = null;
    const handleCacheUpdate = () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        setCacheRevision(prev => prev + 1);
      }, 150);
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('glp_translation_cache_updated', handleCacheUpdate);
      return () => {
        if (debounceTimer) clearTimeout(debounceTimer);
        window.removeEventListener('glp_translation_cache_updated', handleCacheUpdate);
      };
    }
  }, []);

  // Helper to translate mock, CMS, and dynamic user content
  const translateDynamic = useCallback((text, forcedLang) => {
    const targetLang = forcedLang || language;
    if (!text || targetLang === 'th') return text;
    const str = typeof text === 'string' ? text.trim() : '';
    if (str && CONTENT_TRANSLATIONS[str] && CONTENT_TRANSLATIONS[str][targetLang]) {
      const res = CONTENT_TRANSLATIONS[str][targetLang];
      // STRICT SAFEGUARD: Never return Thai characters as English or Chinese!
      if (!/[\u0E00-\u0E7F]/.test(res)) {
        return res;
      }
    }
    return autoTranslateDynamic(text, targetLang);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, supportedLanguages, translateDynamic }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const CONTENT_TRANSLATIONS = {
  "กัปตันทีม": {
    en: "Team Captain",
    zh: "战队队长"
  },
  "(กัปตันทีม)": {
    en: "(Captain)",
    zh: "(队长)"
  },
  "SScary (กัปตันทีม)": {
    en: "SScary (Captain)",
    zh: "SScary (战队队长)"
  },
  "JohnOlsen (กัปตันทีม)": {
    en: "JohnOlsen (Captain)",
    zh: "JohnOlsen (战队队长)"
  },
  "Surf (กัปตันทีม)": {
    en: "Surf (Captain)",
    zh: "Surf (战队队长)"
  },
  "Kadoom (กัปตันทีม)": {
    en: "Kadoom (Captain)",
    zh: "Kadoom (战队队长)"
  },
  "SpeedyKnight (กัปตันทีม)": {
    en: "SpeedyKnight (Captain)",
    zh: "SpeedyKnight (战队队长)"
  },
  "ผู้เข้าแข่งขันทุกท่านต้องนำบัตรประชาชนหรือบัตรนักเรียน/นักศึกษามาแสดงตน ณ จุดลงทะเบียน": {
    en: "All competitors must present their National ID or Student ID card at the registration desk.",
    zh: "所有参赛选手必须在现场报到处出示身份证或学生证。"
  },
  "อนุญาตให้นำเมาส์ คีย์บอร์ด และหูฟังส่วนตัวมาใช้ได้ โดยต้องผ่านการตรวจจากเจ้าหน้าที่เทคนิคก่อนเริ่มแข่ง": {
    en: "Personal gaming gear (mouse, keyboard, headset) is permitted after inspection by technical staff.",
    zh: "允许使用个人电竞外设（鼠标、键盘、耳机），但须在赛前通过技术人员检验。"
  },
  "เครื่องคอมพิวเตอร์ที่ใช้แข่งขับเคลื่อนด้วย Intel Core i9 + NVIDIA GeForce RTX 4080 และจอ BenQ ZOWIE 360Hz": {
    en: "Tournament PCs powered by Intel Core i9 + NVIDIA GeForce RTX 4080 and BenQ ZOWIE 360Hz displays.",
    zh: "比赛用机配备 Intel Core i9 + NVIDIA GeForce RTX 4080 显卡与 BenQ ZOWIE 360Hz 电竞屏。"
  },
  "ห้ามใช้โปรแกรมโกง สคริปต์ช่วยเล่น หรือฉวยโอกาสจากข้อผิดพลาดของเกม (Bug Exploitation) หากตรวจพบปรับแพ้ทันที": {
    en: "Cheats, assistance scripts, or bug exploitation are strictly forbidden. Violators forfeit immediately.",
    zh: "严禁使用外挂、辅助脚本或利用游戏BUG，违者立即判负并取消资格。"
  },
  "คำตัดสินของหัวหน้าผู้ตัดสิน (Head Referee) ถือเป็นที่สิ้นสุดในทุกกรณี": {
    en: "The Head Referee decision is final and binding in all cases.",
    zh: "赛事主裁判的裁决为最终裁定，不接受申诉。"
  },
  "ลงทะเบียนหน้างาน & ตรวจสอบอุปกรณ์นักกีฬา (Player Check-in & Gear Check)": {
    en: "On-site Check-in & Player Gear Inspection",
    zh: "现场签到与选手外设检查 (Check-in & Gear Check)"
  },
  "รอบคัดเลือกแบ่งกลุ่ม Group Stage (Best of 1 - LAN Setup)": {
    en: "Group Stage Qualifiers (Best of 1 - LAN Setup)",
    zh: "小组循环资格赛 (BO1 局域网线下对战)"
  },
  "รอบ 8 ทีม และ 4 ทีมสุดท้าย (Quarter & Semi-Finals - Best of 3)": {
    en: "Quarter-Finals & Semi-Finals (Best of 3)",
    zh: "八强赛与半决赛 (BO3 三局两胜)"
  },
  "รอบชิงชนะเลิศ Grand Final บนเวที Main Stage (Best of 5 ถ่ายทอดสด)": {
    en: "Grand Final on Main Stage (Best of 5 Live Broadcast)",
    zh: "主舞台巅峰总决赛 (BO5 五局三胜高清直播)"
  },
  "32 ทีม (เหลือ 6 ทีมสุดท้าย)": {
    en: "32 Teams (Final 6 Slots Remaining)",
    zh: "32 支战队 (仅剩最后6个席位)"
  },
  "16:00 - 20:00 น.": {
    en: "16:00 - 20:00",
    zh: "16:00 - 20:00"
  },
  "11:00 - 20:00 น.": {
    en: "11:00 - 20:00",
    zh: "11:00 - 20:00"
  },
  "10:00 - 11:00 น.": {
    en: "10:00 - 11:00",
    zh: "10:00 - 11:00"
  },
  "11:15 - 14:00 น.": {
    en: "11:15 - 14:00",
    zh: "11:15 - 14:00"
  },
  "14:30 - 17:30 น.": {
    en: "14:30 - 17:30",
    zh: "14:30 - 17:30"
  },
  "18:00 - 20:30 น.": {
    en: "18:00 - 20:30",
    zh: "18:00 - 20:30"
  },
  "ดูตารางแข่ง": {
    en: "Match Schedule",
    zh: "查看赛程表"
  },
  "รายละเอียดงานแข่ง": {
    en: "Tournament Details",
    zh: "赛事详情"
  },
  "ฟีเจอร์ใหม่ 3D": {
    en: "New 3D Feature",
    zh: "全新3D功能"
  },
  "เปิดรับสมัคร GLP VALORANT CHAMPIONSHIP 2026 ชิง 100,000 บาท | ระบบจำลองผังร้าน 3D เปิดให้ทดลองใช้งานแล้ววันนี้!": {
    en: "Open Registration for GLP VALORANT CHAMPIONSHIP 2026 (100,000 THB Prize) | 3D Store Planner is now live!",
    zh: "GLP 无畏契约全国锦标赛 2026 火热报名中 (总奖金10万泰铢) | 3D门店布局系统现已正式上线！"
  },
  "ICAFE ATTACK LAN TOURNAMENT 2026 ระเบิดความมันส์ เสาร์-อาทิตย์นี้ ณ GLP Main Stage ลุ้นรับแรร์ไอเทมและเงินรางวัลสด": {
    en: "ICAFE ATTACK LAN TOURNAMENT 2026 this weekend at GLP Main Stage! Win rare items and cash prizes.",
    zh: "ICAFE ATTACK 线下电竞锦标赛 2026 本周末狂欢引爆！GLP 主舞台震撼开战，现场赢取稀有道具与现金大奖。"
  },
  "เปิดตัวแพ็กเกจแฟรนไชส์ GLP Living Plus 2026 พร้อมระบบจำลองผัง 3D คำนวณงบประมาณและผลตอบแทน ROI แบบเรียลไทม์": {
    en: "Launching GLP Living Plus 2026 Franchise Package with real-time 3D store simulator and ROI payback calculator.",
    zh: "GLP Living Plus 2026 电竞网咖加盟新模式重磅发布，搭载实时3D门店空间设计与投资回报率(ROI)预算系统。"
  },
  "เวทีแข่งขันหลัก 5v5 Soundproof Glass Booths": {
    en: "Main Tournament 5v5 Soundproof Glass Booths",
    zh: "主赛事 5v5 隔音玻璃对战舱"
  },
  "ห้องกระจกส่วนตัว 4K Broadcast Streamer Room": {
    en: "Private 4K Broadcast Streamer Room",
    zh: "独立隔音 4K 直播推流主播房"
  },
  "โซนหลักความจุกว่า 80 ที่นั่ง สเปกแข่ง 240Hz Fast-IPS": {
    en: "Main Arena 80+ Seats with 240Hz Fast-IPS Displays",
    zh: "主对战区 80+ 机位 240Hz Fast-IPS 竞技屏"
  },
  "โซน PS5 Pro จอยักษ์ 4K และซิมมูเลเตอร์พวงมาลัยแข่งรถ F1": {
    en: "PS5 Pro Zone with Giant 4K Display & F1 Racing Simulators",
    zh: "PS5 Pro 巨幕4K区与 F1 专业赛车力反馈模拟舱"
  },
  "โซนเครื่องเล่นเกมหลัก (Main Esports Arena)": {
    en: "Main Esports Arena Zone",
    zh: "核心电竞对战主区 (Main Esports Arena)"
  },
  "ห้องซ้อม VIP / Bootcamp Suite (กระจกเก็บเสียง)": {
    en: "VIP Bootcamp Suite (Soundproof Glass)",
    zh: "VIP 职业集训房 / Bootcamp (隔音玻璃)"
  },
  "เคาน์เตอร์แคชเชียร์ & จุดต้อนรับ (Reception)": {
    en: "Cashier & Reception Counter",
    zh: "收银服务台与迎宾接待处 (Reception)"
  },
  "ห้องควบคุมระบบ MDB & Diskless Server": {
    en: "MDB Electrical & Diskless Server Control Room",
    zh: "强电控制机房与无盘服务器中心 (MDB & Server)"
  },
  "Cafe Prep, Food & Dining Lounge": {
    en: "Cafe Prep, Food & Dining Lounge",
    zh: "水吧饮品餐饮休息区 (Cafe Prep & Lounge)"
  },
  "ทางสัญจร & ช่องทางหนีไฟ (Circulation & Safety)": {
    en: "Circulation & Safety Aisles",
    zh: "消防通道与公共动线 (Circulation & Safety)"
  },
  "โซนเครื่องเล่นเกมหลัก": {
    en: "Main Gaming Arena",
    zh: "电竞主对战区"
  },
  "ห้องซ้อม VIP / Bootcamp Suite": {
    en: "VIP Bootcamp Suite",
    zh: "VIP 职业训练室"
  },
  "เคาน์เตอร์แคชเชียร์ & จุดต้อนรับ": {
    en: "Cashier & Reception Counter",
    zh: "收银与接待柜台"
  },
  "ห้องควบคุมระบบ MDB & Diskless": {
    en: "MDB & Diskless Server Room",
    zh: "无盘服务器控制机房"
  },
  "ทางสัญจร & ช่องทางหนีไฟ": {
    en: "Circulation & Fire Exit Corridor",
    zh: "消防疏散安全通道"
  },
  "อุปกรณ์เกมมิ่งเกียร์และบรรยากาศการแข่งขัน": {
    en: "Gaming Gear & Tournament Highlights",
    zh: "电竞外设装备与激战实况"
  },
  "พิธีมอบรางวัลและเงินรางวัลชนะเลิศ": {
    en: "Award Ceremony & Championship Trophy Presentation",
    zh: "颁奖盛典与冠军奖金授予"
  },
  "แฟนคลับและผู้เข้าชมร่วมสนุกในกิจกรรม": {
    en: "Fans & Attendees Community Highlights",
    zh: "广大玩家与到场观众狂欢互动"
  },
  "ผู้ดูแลระบบสูงสุด (Master Owner)": {
    en: "Master Owner",
    zh: "主所有者"
  },
  "กิตติศักดิ์ (Head of Esports)": {
    en: "Kittisak (Head of Esports)",
    zh: "Kittisak （电子竞技主管）"
  },
  "ผู้จัดการงานแข่ง & สายการแข่งขัน": {
    en: "Tournament & Bracket Manager",
    zh: "锦标赛和组别经理"
  },
  "GLP : G Speed Living Plus เป็นศูนย์กีฬาอีสปอร์ตระดับ World Class และคอมมูนิตี้ครบวงจร 24 ชั่วโมง ตั้งอยู่ ณ ซอยรามคำแหง 53 กรุงเทพมหานคร\\n\\nจุดเด่นและสิ่งอำนวยความสะดวก:\\n- เครื่องคอมพิวเตอร์สเปกทัวร์นาเมนต์ Intel Core i9 + NVIDIA GeForce RTX 40/50 Series\\n- จอ BenQ ZOWIE Fast-IPS 360Hz และ 280Hz คุณภาพสูงสำหรับนักกีฬาโปรลีก\\n- เวทีแข่งขัน 5v5 Soundproof Glass Arena พร้อมระบบโปรดักชันถ่ายทอดสด 4K\\n- อินเทอร์เน็ต Dedicated Multi-WAN 10Gbps แบนด์วิดท์เสถียร Ping ต่ำกว่า 3ms\\n- บริการให้คำปรึกษาและวางระบบแฟรนไชส์ร้านเกม 3D แบบครบวงจร คืนทุนไวใน 12-18 เดือน\\n\\nติดต่อสอบถาม:\\n- สายด่วน: 063-793-7704\\n- LINE Official: @gspeed\\n- ที่อยู่: 23/1 ซอยรามคำแหง 53 แขวงพลับพลา เขตวังทองหลาง กรุงเทพฯ 10310": {
    en: "GLP: G Speed Living Plus is a world class esports centre and 24 hour comprehensive community located in Soi Ramkhamhaeng 53, Bangkok.\\n\\nHighlights & Amenities:\\n- Intel Core i9 + NVIDIA GeForce RTX 40/50 Series tournament specs PC\\n- High quality BenQ ZOWIE Fast-IPS 360Hz and 280Hz screen for Pro League athletes\\n- 5v5 Soundproof Glass Arena with 4K live production system\\n- Dedicated Multi-WAN Internet 10Gbps Stable Ping Bandwidth under 3ms\\n- Fully integrated 3D game store franchise consulting and implementation service, payback in 12-18 months.\\n\\nInquiries:\\n- Hotline: 063-793-7704\\n- line Official: @ gspeed\\n- Address: 23/1 Soi Ramkhamhaeng 53, Plubpla Sub-district, Wangthonglang District, Bangkok 10310",
    zh: "GLP ： G Speed Living Plus是世界一流的电子竞技中心和24小时综合社区，位于曼谷Soi Ramkhamhaeng 53。\\n\\n亮点和便利设施：\\n-英特尔酷睿i9 +英伟达GeForce RTX 40/50系列锦标赛规格PC\\n-适用于职业联赛运动员的高品质明基ZOWIE Fast-IPS 360Hz和280Hz屏幕\\n-配备4K现场制作系统的5v5隔音玻璃竞技场\\n-专用多WAN互联网10Gbps稳定Ping带宽低于3毫秒\\n-完全集成的3D游戏商店特许经营咨询和实施服务，在12-18个月内回报。\\n\\n咨询：\\n-热线： 063-793-7704\\n- LINE官方账号： @ gspeed\\n-地址： 23/1 Soi Ramkhamhaeng 53, Plubpla Sub-district, Wangthonglang District, Bangkok 10310"
  },
  "ชลธิชา (Franchise Sales Manager)": {
    en: "Chonthicha (Franchise Sales Manager)",
    zh: "Chonthicha （特许经营销售经理）"
  },
  "ช่างเทคนิค & จัดการสเปกคอม 3D": {
    en: "Technician & 3D Spectroscope Manager",
    zh: "技术员和3D光谱仪经理"
  },
  "ผู้ดูแลยอดขาย & แฟรนไชส์ Leads": {
    en: "Sales Administrator & Franchise Leads",
    zh: "销售管理员和特许经营负责人"
  },
  "วิศรุต (Lead Hardware Specialist)": {
    en: "Visarut (Lead Hardware Specialist)",
    zh: "Visarut （首席硬件专家）"
  },
  "ธนาภา (Digital Marketing & SEO)": {
    en: "Thanapa (Digital Marketing & SEO)",
    zh: "Thanapa （数字营销和SEO ）"
  },
  "การตลาด, SEO & คอนเทนต์": {
    en: "Marketing, SEO & Content",
    zh: "营销、搜索引擎优化和内容"
  },
  "คุณอาร์ม (Arm Gamer)": {
    en: "Mr. Arm Gamer",
    zh: "Mr. Arm Gamer"
  },
  "ขอกล้อง 4K สำหรับสตรีมแข่ง Valorant": {
    en: "Request 4K Camera for Valorant Racing Stream",
    zh: "为Valorant Racing Stream申请4K摄像头"
  },
  "18:00 - 22:00 น.": {
    en: "6:00 PM - 10:00 PM",
    zh: "下午6:00 -晚上10:00"
  },
  "คุณกิตติศักดิ์ (Talon Fan)": {
    en: "Khun Kittisak (Talon Fan)",
    zh: "Khun Kittisak （ Talon Fan ）"
  },
  "14:00 - 18:00 น.": {
    en: "2:00 PM - 6:00 PM",
    zh: "下午2:00 -下午6:00"
  },
  "ซ้อมคู่ Duo ก่อนเริ่มแมตช์ทัวร์นาเมนต์": {
    en: "Practice duo before the start of the tournament",
    zh: "比赛开始前练习二人组"
  },
  "23:00 - 08:00 น. (Night Owl เหมาค่ำ)": {
    en: "23:00 - 08:00 (Night Owl)",
    zh: "23:00 - 08:00 （夜猫子）"
  },
  "Gamer Feast Combo (ชานมพ่นไฟ + กะเพราหมูกรอบ)": {
    en: "Gamer Feast Combo (Flaming Milk Tea + Crispy Pork Basil)",
    zh: "玩家盛宴组合（火焰奶茶+酥脆猪肉罗勒）"
  },
  "ทีม 5 คน ซ้อมข้ามคืน": {
    en: "A team of five drills overnight.",
    zh: "一支由五人组成的团队在一夜之间进行了演习。"
  },
  "คุณภานุวัฒน์": {
    en: "Mr. Panuwat",
    zh: "Panuwat先生"
  },
  "ประกาศสำคัญ": {
    en: "Important Notice",
    zh: "重要提示"
  },
  "ระบบ 3D Interior Planner ใหม่! ออกแบบผังร้านเกม คำนวณขนาดโต๊ะเก้าอี้และงบลงทุนแฟรนไชส์ได้เรียลไทม์ 24 ชม.": {
    en: "New 3D Interior Planner System! Design game store layout, calculate table size, chairs and franchise investment budget in 24 hours.",
    zh: "全新3D室内规划器系统！设计游戏商店布局，在24小时内计算桌面尺寸、椅子和特许经营投资预算。"
  },
  "จัดแข่ง Esport": {
    en: "Host an Esport Match",
    zh: "举办电子竞技比赛"
  },
  "เปิดรับสมัคร GLP VALORANT CHAMPIONSHIP 2026 ชิง 100,000 บาท | ระบบจำลองผังร้าน 3D Interior Planner พร้อมใช้งานแล้ว": {
    en: "Application for GLP valorant Championship 2026 for 100,000 THB | 3D Interior Planner is now available",
    zh: "10万泰铢的2026年GLP Valorant锦标赛申请| 3D室内规划师现已推出"
  },
  "เปิดระบบจัดผัง 3D": {
    en: "Turn on 3D mapping",
    zh: "开启3D映射"
  },
  "เปิดรับจองพื้นที่ Main Stage 5v5 Soundproof Glass Arena พร้อมทีมงานสตรีมมิ่ง 4K และระบบ Tournament Manager": {
    en: "Main Stage 5v5 Soundproof Glass Arena with 4K Streaming Team and Tournament Manager",
    zh: "4K流媒体团队和锦标赛经理的主舞台5v5隔音玻璃竞技场"
  },
  "ติดต่อจองเวที": {
    en: "Contact to book the stage",
    zh: "联系以预订舞台"
  },
  "GLP : G Speed Living Plus | ศูนย์อีสปอร์ตครบวงจร & ระบบแฟรนไชส์จัดผังร้านอัจฉริยะ": {
    en: "GLP: G Speed Living Plus | Fully Integrated Esports Center & Smart Store Layout Franchise System",
    zh: "GLP ： G Speed Living Plus |完全集成的电子竞技中心和智能商店布局特许经营系统"
  },
  "ศูนย์รวมอีสปอร์ตครบวงจร สเปกคอมไฮเอนด์ RTX 40 Series จอ 360Hz เวทีแข่งมาตรฐานสากล พร้อมระบบจำลองผังร้านแฟรนไชส์ 3D": {
    en: "Fully integrated esports hub, high end specs, RTX 40 Series, 360Hz screen, international standard arena with 3D franchise store layout simulation.",
    zh: "完全集成的电子竞技中心，高端规格， RTX 40系列， 360Hz屏幕，具有3D特许经营店布局模拟的国际标准竞技场。"
  },
  "ร้านเกม, อีสปอร์ต, แฟรนไชส์ร้านเกม, GLP, G Speed Living Plus, จัดผังร้านเกม 3D, RTX 4090, BenQ 360Hz": {
    en: "Game Store, Esports, Game Store Franchise, GLP, G Speed Living Plus, 3D Game Store Layout, RTX 4090, BenQ 360Hz",
    zh: "游戏商店，电子竞技，游戏商店特许经营， GLP ， G Speed Living Plus ， 3D游戏商店布局， RTX 4090 ，明基360Hz"
  },
  "สำรวจกิจกรรม & ทัวร์นาเมนต์": {
    en: "Explore events & tournaments",
    zh: "探索赛事和锦标赛"
  },
  "ศูนย์รวมอีสปอร์ตครบวงจร & พื้นที่ประลองเกมมาตรฐานสากล": {
    en: "One-stop esports hub & international standard gaming arena",
    zh: "一站式电子竞技中心和国际标准游戏竞技场"
  },
  "ติดต่อเปิดร้านเกมของคุณ": {
    en: "Contact to open your game store.",
    zh: "请联系以打开您的游戏商店。"
  },
  "สัมผัสประสบการณ์เกมมิ่งระดับเวิลด์คลาสด้วยเครื่องสเปกไฮเอนด์ RTX 40 Series จอ 360Hz และเวทีแข่งขันมาตรฐาน Pro Circuit พร้อมระบบคำนวณและจำลองผังร้านแฟรนไชส์อัจฉริยะ": {
    en: "Experience world-class gaming with the high-end RTX 40 Series 360Hz spectroscope and Pro Circuit standard arena with intelligent franchise store layout calculations and simulations.",
    zh: "借助高端RTX 40系列360Hz光谱仪和Pro Circuit标准竞技场，通过智能特许经营店布局计算和模拟，体验世界一流的游戏。"
  },
  "เปิดระบบ 3D": {
    en: "Turn on 3D",
    zh: "开启3D"
  },
  "รวมภาพกิจกรรม & บรรยากาศสด": {
    en: "Overview & Live Atmosphere",
    zh: "概述和现场氛围"
  },
  "เกาะติดผลการแข่งขัน ทริกการเล่น สเปกอุปกรณ์ใหม่ และประกาศจากทางร้าน": {
    en: "Stick to match results, playing tricks, specs, new equipment, and shop announcements.",
    zh: "坚持匹配结果、耍花招、规格、新设备和商店公告。"
  },
  "ภาพบรรยากาศการแข่งขันเกมและกองเชียร์อีสปอร์ต ณ GLP Arena": {
    en: "Images of games and esports cheerleading at the GLP Arena.",
    zh: "GLP竞技场的游戏和电子竞技啦啦队图片。"
  },
  "บทความ ข่าวสาร & ไฮไลต์เกม": {
    en: "News Articles & Game Highlights",
    zh: "新闻文章和游戏亮点"
  },
  "ศูนย์รวมอีสปอร์ตครบวงจร GLP G-Speed Living Plus แฟรนไชส์ร้านเกม 3D": {
    en: "One-stop esports hub GLP G-Speed Living Plus 3D Game Store Franchise",
    zh: "一站式电竞中心GLP G-Speed Living Plus 3D游戏商店特许经营"
  },
  "อ่านบทความล่าสุด": {
    en: "Read the latest article",
    zh: "阅读最新文章"
  },
  "บรรยากาศและโซนการให้บริการ GLP ESPORTS": {
    en: "GLP Esports Service Atmosphere and Zone",
    zh: "GLP电子竞技服务氛围和区域"
  },
  "เริ่มออกแบบผังร้าน & ประเมินงบประมาณทันที": {
    en: "Start Designing Store Layout & Budget Assessment Immediately",
    zh: "立即开始设计商店布局和预算评估"
  },
  "บทความ ข่าวสารวงการเกม และอัปเดตสเปกฮาร์ดแวร์ GLP Esports": {
    en: "Articles, gaming news and GLP Esports hardware specs update",
    zh: "文章、游戏新闻和GLP Esports硬件规格更新"
  },
  "สัมผัสความพรีเมียมที่ออกแบบมาสำหรับเกมเมอร์ทุกสไตล์ ตั้งแต่ผู้เล่นทั่วไป สตรีมเมอร์ ไปจนถึงการประลองระดับแชมป์เปียนชิป": {
    en: "Experience a premium designed for every style of gamer, from regular streamers to chip championships.",
    zh: "体验专为各种风格的游戏玩家设计的高级版，从常规主播到芯片锦标赛。"
  },
  "เวทีประลองระดับมืออาชีพ": {
    en: "Professional Arena",
    zh: "专业竞技场"
  },
  "ทัศนียภาพมุมสูงของอารีน่าความจุผู้ชมกว่า 200 ที่นั่งพร้อมจอด้านข้าง": {
    en: "High angle view of the 200 + seat arena with side screen.",
    zh: "带侧屏的200多个座位竞技场的高角度视野。"
  },
  "ระบบแสงเวที Dynamic Light Sync เปลี่ยนสีตามสถานะการแข่งขัน": {
    en: "The Dynamic Light Sync stage lighting system changes color according to the match status.",
    zh: "动态光同步舞台照明系统根据匹配状态更改颜色。"
  },
  "เวทีแข่งขัน Main Stage ระบบแสงสีเสียงและจอ LED Wall 4K ขนาดยักษ์": {
    en: "Main Stage Light & Sound System & Giant 4K LED Wall Screen",
    zh: "主舞台灯光音响系统和巨型4K LED墙面屏幕"
  },
  "เวทีแข่งขันแยก 2 ฝั่งพร้อมระบบกระจกกันเสียงระดับสตูดิโอ จอ LED Wall ขนาดยักษ์ 4K และโต๊ะแคสเตอร์สำหรับถ่ายทอดสด Live Streaming รองรับการจัดแข่ง Official ทุกเกม": {
    en: "Two separate arenas with studio soundproofing, a giant 4K LED Wall screen, and a caster table for live streaming support all official games.",
    zh: "两个带有工作室隔音功能的独立竞技场、一个巨大的4K LED墙面屏幕和一个用于直播的脚轮桌，支持所有官方游戏。"
  },
  "ห้องส่วนตัว Private Gaming Suite": {
    en: "Private room Private Gaming Suite",
    zh: "独立房间独立游戏套房"
  },
  "สเปกคอมพิวเตอร์ระดับสตรีมเมอร์ พร้อมไฟสตูดิโอ Elgato Key Light": {
    en: "Streamer Computer Specs with Elgato Key Light Studio Lights",
    zh: "Streamer电脑规格带Elgato钥匙灯工作室灯"
  },
  "ไมโครโฟนระดับสตูดิโอบรอดแคสต์ Shure SM7B + RodeCaster Pro": {
    en: "Shure SM7B + RodeCaster Pro Broadcast Studio Level Microphone",
    zh: "舒尔SM7B + RodeCaster专业广播工作室级麦克风"
  },
  "ห้องส่วนตัว VIP Suite ผนังซับเสียง Acoustic เก็บเสียงเงียบสนิท": {
    en: "Private Room VIP Suite Acoustic Sound Absorption Wall Keep the sound quiet.",
    zh: "独立房间VIP套房吸音墙保持安静。"
  },
  "โซนส่วนตัว 5-6 ที่นั่ง เหมาะสำหรับทีมฝึกซ้อม (Bootcamp) หรือแก๊งเพื่อน พร้อมอุปกรณ์สตรีมมิ่งครบเซ็ต กล้อง 4K ไมโครโฟนระดับบอร์ดแคสต์ และไฟสตูดิโอ Key Light": {
    en: "The 5-6 seat private zone is perfect for a practice team (bootcamp) or a gang of friends, complete with full streaming equipment, 4K camera, microphone, casting board, and Key Light studio lights.",
    zh: "5-6个座位的私人区域非常适合练习团队（训练营）或一群朋友，配备全流媒体设备、4K摄像头、麦克风、浇铸板和Key Light工作室灯光。"
  },
  "หูฟังเกมมิ่ง Pro Wireless ตัดเสียงรบกวนภายนอก 100%": {
    en: "100% external noise-cancelling Pro Wireless gaming headphones",
    zh: "100%外部降噪Pro无线游戏耳机"
  },
  "บรรยากาศทีมบูตแคมป์ 5 คน นั่งซ้อมกลยุทธ์ส่วนตัวไม่มีเสียงรบกวน": {
    en: "Atmosphere 5 person boot camp team sitting in private strategy practice, no noise.",
    zh: "Atmosphere 5人新兵训练营团队坐在私人战略练习场，无噪音。"
  },
  "เก้าอี้ Secretlab TITAN Evo พรีเมียมรองรับหลัง นั่งสบายยาวนาน": {
    en: "Premium Titan Evo Secretlab Chair supports long-lasting comfort",
    zh: "高级Titan Evo Secretlab椅子支持持久的舒适性"
  },
  "แสงไฟนีออน Cyberpunk ปรับแต่งโปรไฟล์สีได้ตามความชอบของทีม": {
    en: "Cyberpunk neon lights customize the color profile according to the team's preferences.",
    zh: "赛博朋克霓虹灯根据团队的喜好定制颜色配置文件。"
  },
  "หน้าจอคู่ Dual-Monitor: จอหลัก OLED 360Hz + จอรอง 4K มอนิเตอร์แชท": {
    en: "Dual-Monitor Screen: 360Hz OLED Home Screen + 4K Secondary Monitor Chat",
    zh: "双显示器屏幕： 360Hz OLED主屏幕+ 4K辅助显示器聊天"
  },
  "ระบบระบายความร้อน Custom Water Cooling เงียบสนิท ไร้เสียงพัดลมรบกวน": {
    en: "Custom Water Cooling system is completely silent, no noise fan.",
    zh: "定制水冷系统完全静音，无噪音风扇。"
  },
  "คีย์บอร์ดกลไก Rapid Trigger ตอบสนองเร็วระดับมิลลิวินาที": {
    en: "Keyboard, Rapid Trigger mechanism, millisecond response",
    zh: "键盘，快速触发机制，毫秒响应"
  },
  "มุมวิเคราะห์แผนการเล่นหน้าจอสมาร์ททีวี 65 นิ้วสำหรับโค้ช": {
    en: "Game plan analysis corner 65 inch smart TV screen for coaches",
    zh: "游戏计划分析角65寸智能电视教练屏"
  },
  "โค้ชและนักกีฬาบรีฟแผนการเล่นก่อนการแข่งขันแมตช์สำคัญ": {
    en: "Coach and athlete brethren, pre-match game plan",
    zh: "教练和运动员兄弟，赛前比赛计划"
  },
  "มุมพักผ่อนและโต๊ะทำงานส่วนตัวสำหรับครีเอเตอร์และผู้จัดการทีม": {
    en: "Dedicated lounge corner and desk for creators and team managers",
    zh: "专为创作者和团队经理打造的休息室角落和办公桌"
  },
  "สาย LAN 10Gbps แยก Dedicated Bandwidth ไม่แชร์ความเร็วกับภายนอก": {
    en: "10Gbps LAN cable separates Dedicated Bandwidth and does not share speed with external",
    zh: "10Gbps局域网电缆分离专用带宽，不与外部共享速度"
  },
  "เมาส์เกมมิ่ง Pro Wireless น้ำหนักเบาพร้อมแผ่นรองเมาส์ Speed/Control": {
    en: "Lightweight Pro Wireless Gaming Mouse with Speed/Control Mouse Pad",
    zh: "轻量级专业无线游戏鼠标带速度/控制鼠标垫"
  },
  "มินิบาร์และตู้แช่เครื่องดื่มบริการเสิร์ฟถึงห้องพักส่วนตัว": {
    en: "Minibar and beverage cooler served in private room",
    zh: "独立房间提供迷你吧和饮料冷藏柜"
  },
  "มีจุดเชื่อมต่อกล้อง DSLR / Capture Card 4K พร้อมสตรีมทันที": {
    en: "There is a 4K DSLR/Capture Card access point with instant stream.",
    zh: "有一个带即时流的4K数码单反相机/采集卡接入点。"
  },
  "บรรยากาศการซ้อมทีมที่เต็มไปด้วยสมาธิและการประสานงานที่ยอดเยี่ยม": {
    en: "Team rehearsal atmosphere with great focus and coordination.",
    zh: "团队排练氛围，高度专注和协调。"
  },
  "โซนเครื่องมาตรฐานระดับแข่งขัน": {
    en: "Competitive Standard Machine Zone",
    zh: "有竞争力的标准机器区域"
  },
  "แถวที่นั่งเล่นเกมมาตรฐานความจุกว่า 80+ ที่นั่ง แสงไฟนีออนสบายตา": {
    en: "80 + standard gaming seats with comfortable neon lighting",
    zh: "80多个标准游戏座椅，配备舒适的霓虹灯照明"
  },
  "โซนหลักความจุกว่า 80+ ที่นั่ง ออกแบบระยะห่างตามหลักสรีรศาสตร์ เก้าอี้เกมมิ่งระบายอากาศ โต๊ะกว้าง 120 ซม. ลากเมาส์สะใจ พร้อมระบบเน็ตเวิร์ก 10Gbps Ping ต่ำกว่า 5ms": {
    en: "Main zone 80 + seats, Ergonomic spacing design, Ventilated gaming chair, 120cm wide table Drag your mouse with 10Gbps network ping below 5ms.",
    zh: "主区域80 +座位，符合人体工程学的间距设计，通风游戏椅， 120厘米宽的桌子使用低于5毫秒的10Gbps网络ping拖动鼠标。"
  },
  "ความสะดวกสบายและความเป็นส่วนตัวระดับ First-Class Gaming Lounge": {
    en: "First-Class Gaming Lounge Comfort and Privacy",
    zh: "一流的游戏休息室舒适和隐私"
  },
  "ระบบปรับอากาศแยกส่วน Daikin Inverter เย็นสบายและเงียบเป็นพิเศษ": {
    en: "Daikin Inverter split air conditioning system is cool and ultra quiet.",
    zh: "大金逆变器分体式空调系统凉爽安静。"
  },
  "โต๊ะเกมมิ่งกว้างพิเศษ 120 ซม. ออกแบบมาเพื่อลากเมาส์ได้เต็มวงกว้าง": {
    en: "Extra Wide 120cm Gaming Table Designed to drag the mouse in full width.",
    zh: "超宽120厘米游戏桌设计用于全宽拖动鼠标。"
  },
  "คีย์บอร์ดกลไก Blue/Red Switch กดมันส์ เสียงแน่น ทนทาน": {
    en: "Blue/Red Switch mechanical keyboard with strong and durable sound.",
    zh: "蓝色/红色开关机械键盘，声音强劲耐用。"
  },
  "บรรยากาศความสนุกสนานและคอมมูนิตี้คนรักเกมทุกวัยตลอด 24 ชม.": {
    en: "Fun atmosphere and community, game lovers of all ages, 24 hours a day.",
    zh: "有趣的氛围和社区，所有年龄段的游戏爱好者，一天24小时。"
  },
  "เมาส์เกมมิ่ง Ergonomic DPI สูง พร้อมปุ่ม Macro สำหรับเกม FPS และ MOBA": {
    en: "High dpi Ergonomic Gaming Mouse with Macro Button for FPS and MOBA Games",
    zh: "高DPI符合人体工程学的游戏鼠标，带用于FPS和MOBA游戏的宏按钮"
  },
  "หน้าจอ Fast-IPS 240Hz สีสันสดใส คมชัด มองสบายตาแม้เล่นนาน": {
    en: "240Hz Fast-IPS screen, bright and clear, comfortable to look at even when playing for a long time.",
    zh: "240Hz快速IPS屏幕，明亮清晰，即使在长时间玩游戏时也能舒适地观看。"
  },
  "ระบบอินเทอร์เน็ต Dual Fiber 10Gbps Ping ต่ำกว่า 3ms เล่นไม่กระตุก": {
    en: "Dual Fiber 10Gbps Internet System, Ping less than 3ms, play no jog",
    zh: "双光纤10Gbps互联网系统， ping小于3ms ，不慢跑播放"
  },
  "การเดินสายแลนแบบ Cat6A ชีลด์กันสัญญาณรบกวนใต้รางพื้นเรียบร้อย": {
    en: "Cat6A S.H.I.E.L.D. wiring prevents noise under floor tracks.",
    zh: "Cat6A S.H.I.E.L.D.布线可防止地板轨道下的噪音。"
  },
  "ระบบสำรองไฟระดับองค์กร UPS ไฟดับเล่นต่อได้ไม่มีเซฟหลุด": {
    en: "Enterprise-grade uninterruptible power supply, UPS, power outages, playback, no safeguards",
    zh: "企业级不间断电源， UPS ，停电，回放，无保障"
  },
  "หูฟังครอบหูบุนวมหนานุ่ม เบสแน่น ไมโครโฟนตัดเสียงคุยในดิสคอร์ดชัดเจน": {
    en: "Padded earbuds, thick and soft, tight bass, microphone, clear chatter in the discord.",
    zh: "带衬垫的耳机，厚实柔软，低音结实，麦克风，清晰的喋喋不休。"
  },
  "เคสคอมพิวเตอร์การ์ดจอ RTX 4070 SUPER ปรับกราฟิก Ultra ทุกเกม": {
    en: "Computer case RTX 4070 super graphics card Ultra adapt all games",
    zh: "电脑外壳RTX 4070超级显卡超适合所有游戏"
  },
  "เคาน์เตอร์แคชเชียร์และระบบสมาชิกเติมเงินออนไลน์ สะดวก รวดเร็ว": {
    en: "The cashier counter and online top-up membership system are convenient and fast.",
    zh: "收银台和在线充值会员系统方便快捷。"
  },
  "ระบบ Diskless และ Auto-Update เกม อัปเดตแพตช์ทันทีพร้อมเล่น": {
    en: "Diskless and Auto-Update system, instant patch update game, ready to play",
    zh: "无盘和自动更新系统，即时补丁更新游戏，随时可玩"
  },
  "บรรยากาศการรวมตัวเพื่อนฝูงจัดตี้เล่นเกมวันหยุดสุดสัปดาห์": {
    en: "The atmosphere of gathering friends, playing weekend games",
    zh: "聚友、玩周末游戏的气氛"
  },
  "เก้าอี้เกมมิ่งหุ้มหนัง PU ระบายความร้อน มีหมอนรองคอและหลัง": {
    en: "A heated PU leather upholstered gaming chair with a neck pillow and back.",
    zh: "带颈枕和背部的加热聚氨酯合成革软垫游戏椅。"
  },
  "ความสะอาดของอุปกรณ์ มีการฆ่าเชื้อด้วยแอลกอฮอล์ทุกรอบการใช้งาน": {
    en: "The cleanliness of the equipment is disinfected with alcohol every use cycle.",
    zh: "每次使用周期都用酒精对设备的清洁度进行消毒。"
  },
  "ทางเดินกว้างขวาง ปลอดโปร่ง แอร์เย็นฉ่ำ 24 องศาตลอดวัน": {
    en: "The corridor is spacious, clear, air-cooled, 24 degrees all day.",
    zh: "走廊宽敞、干净、风冷，全天24度。"
  },
  "ไฟส่องสว่างนวลตา ลดการเมื่อยล้าของสายตาเมื่อเล่นเกมนาน": {
    en: "Soft illumination reduces eye fatigue when playing long games.",
    zh: "柔和的照明可以减少长时间玩游戏时的眼睛疲劳。"
  },
  "จุดเติมพลังและคอมมูนิตี้บาร์": {
    en: "Refueling Spots and Community Bars",
    zh: "加油点和社区酒吧"
  },
  "พื้นที่พบปะสังสรรค์ของชาวเกมเมอร์ที่ใหญ่และทันสมัยที่สุด": {
    en: "The largest and most modern gamer meeting space.",
    zh: "最大、最现代化的游戏玩家会议空间。"
  },
  "โมเมนต์คว้าแชมป์ในเกมพร้อมเสียงเฮลั่นจากเพื่อนร่วมทีม": {
    en: "Moment of championship in the game with hissing from his teammates.",
    zh: "比赛中的冠军时刻，队友发出嘶嘶声。"
  },
  "เคาน์เตอร์บาร์เครื่องดื่ม Specialty Coffee สดใหม่พร้อมเสิร์ฟ": {
    en: "A specialty coffee bar counter is fresh to serve.",
    zh: "特色咖啡吧台很新鲜。"
  },
  "บาร์เครื่องดื่ม Energy Drinks นำเข้าเย็นเจี๊ยบเติมความสดชื่น": {
    en: "Energy Drinks Bar, Imported, Cool, Refreshing Chick",
    zh: "能量饮料酒吧，进口，清凉，清爽的小鸡"
  },
  "มุมที่นั่งพักผ่อนสไตล์โมเดิร์นคาเฟ่ แอร์เย็น บรรยากาศผ่อนคลาย": {
    en: "Modern lounge seating corner, cool air-conditioned cafe, relaxing atmosphere.",
    zh: "现代化的休息室座位角落、凉爽的空调咖啡馆、轻松的氛围。"
  },
  "บาร์เครื่องดื่มและอาหารปรุงสด พร้อมเสิร์ฟถึงโต๊ะผ่านระบบสั่งอาหารบนหน้าจอคอมพิวเตอร์ กาแฟสด ชานมไข่มุก เบอร์เกอร์ และมุมโซฟาชมการแข่งขันผ่านจอยักษ์": {
    en: "Bars, drinks, and freshly prepared food are served to the table via a computer screen ordering system, fresh coffee, tea, pearl milk, burgers, and a giant screen competition sofa corner.",
    zh: "酒吧、饮料和新鲜烹制的食物通过电脑屏幕订购系统、新鲜咖啡、茶、珍珠奶、汉堡和巨大的屏幕比赛沙发角落供应。"
  },
  "เมนูอาหารปรุงสด เบอร์เกอร์เนื้อพรีเมียม และเฟรนช์ฟรายส์กรอบ": {
    en: "Freshly cooked dishes, premium meat burgers and crispy French fries",
    zh: "新鲜烹饪的菜肴、优质肉汉堡和脆薯条"
  },
  "ขนมขบเคี้ยวและของหวาน ไอศกรีมหลากหลายรสชาติ": {
    en: "Snacks and desserts, ice cream in a variety of flavors",
    zh: "各种口味的小吃和甜点、冰淇淋"
  },
  "พื้นที่นั่งรอและจุดนัดพบสำหรับเพื่อนๆ ระหว่างรอโต๊ะว่าง": {
    en: "Waiting area and meeting point for friends while waiting for an empty table",
    zh: "等待空桌时等待好友的区域和集合点"
  },
  "โซฟาเลานจ์ขนาดใหญ่พร้อมจอยักษ์ ถ่ายทอดสดทัวร์นาเมนต์ระดับโลก": {
    en: "A large lounge sofa with a giant screen broadcasting live world tournaments.",
    zh: "一张大型休息室沙发，配有巨型屏幕，可直播世界锦标赛。"
  },
  "กาแฟอาราบิก้าแท้ คั่วบดหอมกรุ่นโดยบาริสต้าประจำร้าน": {
    en: "Authentic Arabica coffee, roasted, ground, fragrant by the in-house barista",
    zh: "正宗的阿拉比卡咖啡，由内部咖啡师烘焙、研磨、芳香"
  },
  "บริการส่งอาหารและเครื่องดื่มตรงถึงโต๊ะคอม ไม่ต้องลุกไปสั่ง": {
    en: "Food and beverage delivery directly to the computer table, no need to get up and order.",
    zh: "餐饮直接送到电脑桌，无需起床点餐。"
  },
  "บรรยากาศยามค่ำคืนกับแสงไฟ Warm Light ให้ความรู้สึกอบอุ่น": {
    en: "The night time atmosphere with the warm light gives a warm feeling.",
    zh: "夜晚的氛围和温暖的灯光给人一种温暖的感觉。"
  },
  "ตู้แช่เครื่องดื่มอัตโนมัติ ชำระเงินผ่านสแกน QR Code ทันใจ": {
    en: "Automatic beverage cooler, instant payment via QR code scan",
    zh: "自动饮料冷却器，通过二维码扫描即时付款"
  },
  "มุมฉลองความสำเร็จและปาร์ตี้วันเกิดร่วมกับเพื่อนในทีม": {
    en: "Achievement corner and birthday party with teammates",
    zh: "与队友一起体验成就角落和生日派对"
  },
  "คอมมูนิตี้พบปะแลกเปลี่ยนประสบการณ์ของชาวเกมเมอร์": {
    en: "Community Encounters Gamer Experiences",
    zh: "社区邂逅游戏玩家体验"
  },
  "เมนูเซ็ตโปรโมชันคู่คอมพิวเตอร์ สั่งเป็นชุดสุดคุ้ม": {
    en: "Computer pair promotion set menu, ordered as a set of great value",
    zh: "电脑对促销套餐，以超值套餐订购"
  },
  "พื้นที่นั่งทำงาน Co-working Space ทำงานไปพลาง จิบกาแฟไปพลาง": {
    en: "Co-working space to work while sipping coffee",
    zh: "共享办公空间，边喝咖啡边工作"
  },
  "พนักงานบริการด้วยรอยยิ้มและพร้อมให้คำแนะนำตลอด 24 ชม.": {
    en: "Service staff with smiles and ready to give advice 24 hours a day.",
    zh: "服务人员面带微笑， 24小时随时为您提供建议。"
  },
  "มีจุดชาร์จโทรศัพท์มือถือไร้สายและปลั๊กไฟบริการฟรีทุกโต๊ะ": {
    en: "There are wireless mobile phone charging points and free power outlets at all tables.",
    zh: "所有桌子上都有无线手机充电点和免费电源插座。"
  },
  "ระบบเสียงเพลงเบาๆ ช่วยผ่อนคลายความเหนื่อยล้าหลังเล่นเกม": {
    en: "The soft music system soothes post-game fatigue.",
    zh: "柔和的音乐系统可以缓解赛后的疲劳。"
  },
  "มาตรฐานความสะอาดระดับพรีเมียม ภาชนะผ่านการฆ่าเชื้อทุกชิ้น": {
    en: "Premium cleanliness standards. All containers are sterilized.",
    zh: "优质清洁标准。所有容器均已灭菌。"
  },
  "เร็วๆนี้": {
    en: "Coming soon",
    zh: "很快就会"
  },
  "1 กันยายน 2026": {
    en: "September 1, 2026",
    zh: "2026年9月1日"
  },
  "จุดเช็กอินถ่ายรูปสวยพร้อมมุมถ่ายภาพชิคๆ โพสต์ลงโซเชียล": {
    en: "Check-in point, take a good photo with a photo corner. Chic posted on social media.",
    zh: "入住点，拍一张好照片，照片角落。别致发布在社交媒体上。"
  },
  "ทัวร์นาเมนต์อีสปอร์ตสุดยิ่งใหญ่แห่งปี 2026 ชิงเงินรางวัลรวมกว่า ฿100,000 รวบรวม 32 ยอดทีมทั่วประเทศมาดวลความแม่นยำบนเวที LAN Final ณ G-Speed Arena รามคำแหง 53 พร้อมระบบคอมพิวเตอร์สเปกทัวร์นาเมนต์ Intel Core i9 + RTX 4080 และหน้าจอ BenQ ZOWIE 360Hz ถ่ายทอดสดด้วยทีมงานแคสเตอร์ระดับมืออาชีพ": {
    en: "The biggest esports tournament of 2026 for a total prize pool of more than 100,000, gathering 32 teams across the country for precision duels on the LAN Final stage at G-Speed Arena Ramkhamhaeng 53 with computer systems, Intel Core i9 + RTX 4080 tournament specs, and a BenQ ZOWIE 360Hz screen live with a team of professional casters.",
    zh: "2026年最大的电子竞技锦标赛，总奖池超过100,000个，汇集了全国32支球队，在G-Speed Arena Ramkhamhaeng 53的局域网决赛阶段进行精确决斗，配备计算机系统、英特尔酷睿i9 + RTX 4080锦标赛规格和明基ZOWIE 360Hz屏幕，由专业脚轮团队直播。"
  },
  "25 กันยายน 2026": {
    en: "September 25, 2026",
    zh: "2026年9月25日"
  },
  "฿25,000 + เหรียญเงิน": {
    en: "25,000 + Silver",
    zh: "25,000 +银币"
  },
  "฿10,000 ต่อทีม + เหรียญทองแดง": {
    en: "10,000 per team + Bronze",
    zh: "每队10,000 +铜牌"
  },
  "รองชนะเลิศอันดับ 2 ร่วม (2 ทีม)": {
    en: "Joint 2nd Runner-up (2 teams)",
    zh: "并列亚军（ 2支球队）"
  },
  "฿5,000 + หูฟัง ROG Delta S Wireless": {
    en: "5,000 + Rog Delta S Wireless Headphones",
    zh: "5,000 + ROG Delta S无线耳机"
  },
  "฿50,000 + ถ้วยเกียรติยศ + เหรียญทอง + ROG Gaming Gear Set": {
    en: "50,000 + Honor Cup + Gold Medal + Rog Gaming Gear Set",
    zh: "50,000 +荣誉杯+金牌+ ROG游戏装备套装"
  },
  "28 ก.ย. 2026 • 11:00 น.": {
    en: "Sep 28, 2026 • 11:00 AM",
    zh: "2026年9月28日•上午11:00"
  },
  "RoninZero (กัปตันทีม)": {
    en: "RoninZero (Team Captain)",
    zh: "RoninZero （队长）"
  },
  "BangkokBlade (กัปตันทีม)": {
    en: "BangkokBlade (Team Captain)",
    zh: "BangkokBlade （队长）"
  },
  "รอบ 8 ทีมสุดท้าย (QF 1)": {
    en: "Final 8 (QF 1)",
    zh: "决赛8 （ QF 1 ）"
  },
  "PredatorAim (กัปตันทีม)": {
    en: "PredatorAim (Team Captain)",
    zh: "PredatorAim （队长）"
  },
  "28 ก.ย. 2026 • 13:30 น.": {
    en: "Sep 28, 2026 • 1:30 PM",
    zh: "2026年9月28日•下午1:30"
  },
  "28 ก.ย. 2026 • 16:00 น.": {
    en: "Sep 28, 2026 • 4:00 PM",
    zh: "2026年9月28日•下午4:00"
  },
  "รอบ 8 ทีมสุดท้าย (QF 4)": {
    en: "Final 8 (QF 4)",
    zh: "决赛8 （ QF 4 ）"
  },
  "รอบ 8 ทีมสุดท้าย (QF 3)": {
    en: "Final 8 (QF3)",
    zh: "决赛8 （ QF3 ）"
  },
  "รอบ 8 ทีมสุดท้าย (QF 2)": {
    en: "Final 8 (QF2)",
    zh: "决赛8 （ QF2 ）"
  },
  "ผู้ชนะ QF 1": {
    en: "QF Winner 1",
    zh: "QF优胜者1"
  },
  "ผู้ชนะ QF 2": {
    en: "QF Winner 2",
    zh: "QF优胜者2"
  },
  "รอบ 4 ทีมสุดท้าย (Semi-Final 1)": {
    en: "Semi-Final 1",
    zh: "半决赛1"
  },
  "29 ก.ย. 2026 • 14:00 น.": {
    en: "Sep 29, 2026 • 2:00 PM",
    zh: "2026年9月29日•下午2:00"
  },
  "28 ก.ย. 2026 • 18:30 น.": {
    en: "Sep 28, 2026 • 6:30 PM",
    zh: "2026年9月28日•下午6:30"
  },
  "รอบ 4 ทีมสุดท้าย (Semi-Final 2)": {
    en: "Semi-Final 2",
    zh: "半决赛2"
  },
  "29 ก.ย. 2026 • 17:00 น.": {
    en: "Sep 29, 2026 • 5:00 PM",
    zh: "2026年9月29日•下午5:00"
  },
  "ผู้ชนะ QF 3": {
    en: "QF Winner 3",
    zh: "QF优胜者3"
  },
  "ผู้ชนะ QF 4": {
    en: "QF Winner 4",
    zh: "QF优胜者4"
  },
  "รอบชิงชนะเลิศ (Grand Final ชิงแชมป์ ฿50,000)": {
    en: "Final (Grand Final Championship 50,000)",
    zh: "决赛（总决赛冠军50,000 ）"
  },
  "ผู้ชนะ Semi-Final 1": {
    en: "Semi-Final 1 winner",
    zh: "半决赛1冠军"
  },
  "ผู้ชนะ Semi-Final 2": {
    en: "Semi-Final 2 winners",
    zh: "半决赛2获胜者"
  },
  "30 ก.ย. 2026 • 18:00 น.": {
    en: "Sep 30, 2026 • 6:00 PM",
    zh: "2026年9月30日•下午6:00"
  },
  "เครื่องคอมพิวเตอร์สเปก Intel i9 + RTX 4080 SUPER พร้อมจอ 360Hz": {
    en: "Intel i9 + RTX 4080 super spec pc with 360Hz monitor",
    zh: "英特尔i9 + RTX 4080超级规格PC ，带360Hz显示器"
  },
  "บรรยากาศนักกีฬาประจำที่นั่ง Battle Stations ซ้อมมือก่อนเริ่มแข่ง": {
    en: "The atmosphere of the athletes in the Battle Stations seats practicing their hands before the start of the game",
    zh: "战站座位上运动员在比赛开始前练手的气氛"
  },
  "การแข่งขันรอบ 16 ทีมสุดท้าย แข่งพร้อมกันแบบ Full LAN Setup": {
    en: "The last 16 matches were played at the same time as the Full LAN Setup.",
    zh: "最后16场比赛与全局局域网设置同时进行。"
  },
  "มุมมองกว้างของอารีน่า แสงไฟธีมน้ำเงิน-ส้ม สื่อถึงการปะทะสุดเข้มข้น": {
    en: "Wide views of the arena, blue-orange themed lights convey intense clashes.",
    zh: "广阔的竞技场景观，蓝橙色主题灯光传递出激烈的冲突。"
  },
  "ระบบเน็ตเวิร์กแลนแบบแยกวง 10Gbps Latency ต่ำกว่า 1ms": {
    en: "Isolated Network LAN 10Gbps Latency under 1ms",
    zh: "1毫秒以下的隔离网络局域网10Gbps延迟"
  },
  "หูฟังตัดเสียงรบกวนเกรดการแข่งขัน Pro Studio Noise-Cancelling": {
    en: "Pro Studio Noise-Cancelling Competition Grade Noise Cancelling Headphones",
    zh: "专业工作室降噪比赛级降噪耳机"
  },
  "การอุ่นเครื่องทดสอบความพร้อมปุ่มกดและอัตราตอบสนองอุปกรณ์": {
    en: "Appliance readiness and response test preheating",
    zh: "电器准备和响应测试预热"
  },
  "โต๊ะแข่งขันแบบ Ergonomic ปรับระดับความสูงและพื้นที่ลากเมาส์พิเศษ": {
    en: "Ergonomic race table with adjustable height and special drag area",
    zh: "具有可调节高度和特殊阻力区域的人体工学比赛桌"
  },
  "เอฟเฟกต์ไฟสเตจเปลี่ยนสีอัตโนมัติตามสถานะการวาง Spike ในเกม": {
    en: "Stage lighting effects automatically change color based on Spike placement status in the game.",
    zh: "舞台照明效果会根据游戏中的尖峰位置状态自动更改颜色。"
  },
  "คีย์บอร์ดกลไกสวิตช์ Hall Effect Rapid Trigger แม่นยำทุกเสี้ยววินาที": {
    en: "Keyboard, mechanism, switch, Hall Effect Rapid Trigger, precise every second.",
    zh: "键盘、机构、开关、霍尔效应快速触发器，每秒精确。"
  },
  "สมาธิและความมุ่งมั่นของกัปตันทีมระหว่างสั่งการแผนการบุก": {
    en: "Concentration and determination of the team captain during command of the plan of attack.",
    zh: "指挥进攻计划期间队长的专注和决心。"
  },
  "กองเชียร์แน่นขนัดส่งเสียงเชียร์จังหวะ Clutch 1v3 สุดระทึก": {
    en: "Crowded cheerleaders cheered at the thrilling Clutch 1v3.",
    zh: "拥挤的啦啦队员在惊心动魄的离合器1V3中欢呼雀跃。"
  },
  "ทางเดินเปิดตัวน����กกีฬา (Player Tunnel) พร้อมไฟสปอตไลต์อลังการ": {
    en: "Player Tunnel launch corridor with spectacular spotlights",
    zh: "带有壮观聚光灯的玩家隧道发射走廊"
  },
  "โต๊ะนักพากย์ (Caster Desk) พร้อมจอวิเคราะห์สถิติสดแบบเร��������ไทม์": {
    en: "Caster Desk with live statistical analysis screen",
    zh: "带实时统计分析屏幕的脚轮桌"
  },
  "โซนวอร์มอัพห้องกระจกกันเสียงส่วนตัวสำหรับทีมที่รอขึ้นเวที": {
    en: "A private soundproofed glass room warm-up zone for teams waiting to take the stage.",
    zh: "私人隔音玻璃房热身区，适合等待登台的团队。"
  },
  "เคสคอมพิวเตอร์ชุดน้ำเปิด Custom RGB โลโก้ G-SPEED ประจำเวที": {
    en: "Computer case, open water set, Custom RGB, stage G-SPEED logo",
    zh: "电脑外壳，开放水域套装，定制RGB ，舞台G-SPEED徽标"
  },
  "ถ้วยรางวัลเกียรติยศและเหรียญรางวัลชนะเลิศบนโพเดียม": {
    en: "Trophies of honour and medals of the first place on the podium",
    zh: "领奖台第一名的荣誉奖杯和奖牌"
  },
  "ทีมงานบรอดแคสต์และสวิตเชอร์ควบคุมการถ่ายทอดสดแบบ Multi-View": {
    en: "The Broadcast and Switcher teams control the Multi-View live broadcast.",
    zh: "广播和切换器团队控制多视图直播。"
  },
  "เมาส์เกมมิ่งน้ำหนักเบา���ิเศษ 49g สำหรับการเล็งเป้าหมายที่เฉียบคม": {
    en: "Lightweight gaming mouse 49g for sharp aiming",
    zh: "轻巧的游戏鼠标49克，瞄准清晰"
  },
  "หน้าจอ Replay Slow Motion จังหวะช็อตเด็ด Headshot มหัศจรรย์": {
    en: "Replay Slow Motion Screen Magic Headshot Rhythm",
    zh: "重播慢动作屏幕魔术头像节奏"
  },
  "อุปกรณ์ควบคุมเสียงและไมโครโฟนสำหรับการบรรยายภาษาไทยและอังกฤษ": {
    en: "Audio controls and microphones for Thai and English lectures",
    zh: "泰语和英语讲座的音频控制和麦克风"
  },
  "ทัศนียภาพมุมสูงของอารีน่าระหว่างเปิดการแข่งขันอย่างเป็นทางการ": {
    en: "High view of the arena during the official opening of the tournament.",
    zh: "锦标赛正式开幕期间的竞技场高景观。"
  },
  "โค้ชและผู้เล่นร่วมวิเคราะห์แผนที่และตัวละครระหว่างช่วงพักครึ่ง": {
    en: "Co-coaches and players analyze maps and characters during halftime.",
    zh: "教练和玩家在半场结束时分析地图和角色。"
  },
  "พิธีมอบเช็คเงินรางวัล ฿100,000 แก่ทีมแชมป์เปียนประจำทัวร์นาเมนต์": {
    en: "A cheque for 100,000 won was presented to the tournament's champion team.",
    zh: "向锦标赛冠军球队赠送了一张10万韩元的支票。"
  },
  "แฟนคลับถ่ายรูปเซลฟี่ร่วมกับนักแข่งคนโปรดหลังจบงาน": {
    en: "Fans take selfies with their favorite racers after the event.",
    zh: "活动结束后，粉丝们将与他们最喜爱的赛车手进行自拍。"
  },
  "การจับมือแสดงสปิริตนักกีฬาระหว่างสองทีมหลังจบการแข่งขัน": {
    en: "The handshake showed the athlete's spirit between the two teams after the match.",
    zh: "比赛结束后，握手显示了两支球队之间的运动员精神。"
  },
  "ช่วงเวลาดีใจสุดขีดเมื่อยิงปิดเกมคว้า Match Point สุดระทึก": {
    en: "The moment of extreme joy when the shot closes the game, grabbing the thrilling Match Point.",
    zh: "当投篮结束比赛，抓住激动人心的比赛点时，极度欢乐的时刻。"
  },
  "แสงเลเซอร์และไพโรเทคนิคเปิดตัวคู่ชิงชนะเลิศ Grand Final": {
    en: "Laser light and pyrotechnics launch Grand Final duo",
    zh: "激光灯和烟火推出Grand Final duo"
  },
  "บรรยากาศผู้ร่วมงานเข้าคิวลุ้นรับของรางวัล Lucky Draw เกมมิ่งเกียร์": {
    en: "The atmosphere of the participants joined the queue to win Lucky Draw Gaming Gear prizes.",
    zh: "参与者的气氛加入队列，赢得幸运抽奖游戏装备奖品。"
  },
  "ป้ายไฟเชียร์และแบนเนอร์ของเหล่าแฟนคลับที่มาร่วมให้กำลังใจ": {
    en: "Cheerleading fan signs and banners",
    zh: "啦啦队球迷标志和横幅"
  },
  "การแสดงดนตรีสดเปิดงานทัวร์นาเมนต์สร้างความตื่นเต้นให้แฟนๆ": {
    en: "Live music at the opening of the tournament excites fans.",
    zh: "比赛开幕式上的现场音乐让球迷们兴奋不已。"
  },
  "จุดลงทะเบียนนักกีฬาและการแจกไอดีการ์ดประจำตัวการแข่งขัน": {
    en: "Athlete Registration Point and Tournament ID Card Distribution",
    zh: "运动员注册积分和锦标赛身份证发放"
  },
  "การตรวจสอบความสมบูรณ์ของสายสัญญาณ Fiber Optic ก่อนเริ่มแข่ง": {
    en: "Checking the integrity of the fiber optic cable before the start of the race",
    zh: "在比赛开始前检查光纤电缆的完整性"
  },
  "คณะผู้จัดงานและตัวแทนสปอนเซอร์ร่วมถ่ายภาพเปิดทัวร์นาเมนต์": {
    en: "Organizers and sponsoring representatives took the opening photos of the tournament.",
    zh: "组织者和赞助商代表拍摄了比赛的开幕照片。"
  },
  "สัมภาษณ์สดผู้เล่นยอดเยี่ยม MVP บนเวทีพร้อมล่ามแปลภาษา": {
    en: "Live interviews with top players, MVPs on stage, and interpreters.",
    zh: "现场采访顶级球员、舞台上的MVP和口译员。"
  },
  "ทีมช่างเทคนิคดูแลความสมบูรณ์ของระบบไฟฟ้าสำรอง UPS ตลอด 24 ชม.": {
    en: "The technician team takes care of the integrity of the UPS backup power system 24 hours a day.",
    zh: "技术人员团队全天候负责UPS备用电源系统的完整性。"
  },
  "ห้องประชุมลับสำหรับกรรมการผู้ตัดสินเพื่อพิจารณาเทปย้อนหลัง": {
    en: "Secret meeting room for judges to consider the tape back.",
    zh: "供评委考虑录音带的秘密会议室。"
  },
  "ภาพความประทับใจรวมเหล่านักแข่งทั้ง 32 ทีมบนเวทีใหญ่": {
    en: "Impressions include 32 racers on the main stage.",
    zh: "印象包括主舞台上的32名赛车手。"
  },
  "บรรยากาศบาร์ Cyber Cafe บริการเมนูสดใหม่ตลอดคืนแข่งขัน": {
    en: "The Cyber Cafe bar atmosphere offers fresh menus throughout the night of the competition.",
    zh: "Cyber Cafe酒吧的氛围在比赛当晚提供新鲜的菜单。"
  },
  "ช่วงเวลาชูถ้วยรางวัลฉลองชัยชนะท่ามกลางสายฝนริบบิ้นทอง": {
    en: "A moment to raise the trophy to celebrate victory in the rain of gold ribbons.",
    zh: "在金丝带雨中举起奖杯庆祝胜利的时刻。"
  },
  "เหรียญรางวัลเกียรติยศเคลือบทองคำแท้สำหรับแชมป์รายการนี้": {
    en: "A real gold-plated Medal of Honor for this champion.",
    zh: "为这位冠军颁发一枚真正的镀金荣誉勋章。"
  },
  "มุมอาหารว่างและเครื่องดื่มเกลือแร่ฟรีสำหรับนักกีฬาทุกทีม": {
    en: "Free snack and mineral beverage corner for all teams of athletes.",
    zh: "为所有运动员提供免费小吃和矿物质饮料角。"
  },
  "การจับสลากแบ่งสายการแข่งขัน Group Draw ถ่ายทอดสดทั่วประเทศ": {
    en: "The Group Draw is live nationwide.",
    zh: "团体抽奖在全国范围内直播。"
  },
  "กราฟิก 3D Hologram แสดงสายการแข่งขันและผลคะแนนสด": {
    en: "3D Hologram graphics show bracket and live scores.",
    zh: "3D全息图形显示括号和实时分数。"
  },
  "โค้ชให้คำแนะนำด้านจิตวิทยาและสมาธิระหว่างเวลานอก (Tactical Timeout)": {
    en: "The coach provides psychological guidance and concentration during time-out (Tactical Timeout).",
    zh: "教练在超时（战术超时）期间提供心理指导和专注力。"
  },
  "ระบบคอมพิวเตอร์เซิร์ฟเวอร์ควบคุมผลคะแนนการแข่งขันแบบอัตโนมัติ": {
    en: "The server computer system automatically controls the results of the match scores.",
    zh: "服务器计算机系统自动控制比赛分数的结果。"
  },
  "รอยยิ้มและมิตรภาพระหว่างผู้เล่นหลังจบแมตช์สุดดุเดือด": {
    en: "Smiles and friendships between players after a fierce match.",
    zh: "激烈的比赛后，玩家之间的微笑和友谊。"
  },
  "ผู้บริหาร G-Speed ขึ้นกล่าวปิดงานและประกาศทัวร์นาเมนต์ซีซันถัดไป": {
    en: "G-Speed executives gave closing remarks and announced the next season tournament.",
    zh: "G-Speed高管发表了闭幕词，并宣布了下赛季的比赛。"
  },
  "G-SPEED VALORANT CHAMPIONSHIP 2026 | ทัวร์นาเมนต์ชิงเงินรางวัล ฿100,000": {
    en: "G-SPEED valorant Championship 2026 | 100,000 cash prize tournament",
    zh: "2026年G-SPEED VALORANT锦标赛| 100,000现金奖金锦标赛"
  },
  "แฟนเกมร่วมสนุกกับมินิเกมและตอบคำถามแจกของรางวัลช็อปปิ้งมอลล์": {
    en: "Game fans enjoy mini-games and answer questions, giveaways, shopping malls",
    zh: "游戏爱好者喜欢迷你游戏，解答问题、赠品、购物中心"
  },
  "โน้ตบุ๊กเกมมิ่งระดับท็อปสำหรับการสตรีมมุมมองบุคคลที่หนึ่ง (POV)": {
    en: "A top-rated gaming notebook for first-person streaming (pov).",
    zh: "适用于第一人称流媒体（ POV ）的顶级游戏笔记本。"
  },
  "ภาพความทรงจำส่งท้ายงาน แฟนคลับและนักกีฬาร่วมบันทึกประวัติศาสตร์": {
    en: "Images of memories at the end of the event, fans and athletes recording history.",
    zh: "赛事结束时的回忆、球迷和运动员记录历史的图像。"
  },
  "฿25,000 + silver coins": {
    en: "25,000 + silver coins",
    zh: "25,000 +枚银币"
  },
  "฿50,000 + Trophy + Gold Medal + ROG Gaming Gear Set": {
    en: "$10,000 + Trophy + Gold Medal + Rog Gaming Gear Set",
    zh: "$ 10,000 +奖杯+金牌+ ROG游戏装备套装"
  },
  "VALORANT, GSpeed, ทัวร์นาเมนต์, แข่งเกม, อีสปอร์ต, รามคำแหง 53, LAN Final, 360Hz, ร้านเกม": {
    en: "VALORANT, GSpeed, Tournament, Game Race, Esports, Ramkhamhaeng 53, LAN Final, 360Hz, Game Store",
    zh: "VALORANT、GSpeed、锦标赛、比赛、电子竞技、Ramkhamhaeng 53、LAN Final、360Hz、游戏商店"
  },
  "การแข่งขัน VALORANT LAN Tournament สุดยิ่งใหญ่ ณ G-Speed Arena รามคำแหง 53 เงินรางวัลรวม 100,000 บาท แข่งขันบนเวที Main Stage จอ 360Hz": {
    en: "The great valorant LAN Tournament at G-Speed Arena, Ramkhamhaeng 53 with a prize pool of 100,000 baht, competed on the 360Hz Main Stage.",
    zh: "在G-Speed竞技场Ramkhamhaeng 53举行的伟大勇敢的局域网锦标赛，奖金为10万泰铢，在360Hz主舞台上比赛。"
  },
  "The biggest esports tournament of 2026, competing for a total prize money of over ฿100,000, gathering 32 top teams across the country to duel with precision on the LAN Final stage at G-Speed ​​Arena, Ramkhamhaeng 53, with a tournament spec computer system Intel Core i9 + RTX 4080 and a BenQ ZOWIE 360Hz screen, broadcast live by a professional caster team.": {
    en: "The biggest esports tournament of 2026, competing for a total prize money of over 100,000, gathering 32 top teams across the country to duel with precision on the LAN Final stage at G-Speed Arena, Ramkhamhaeng 53, with a tournament spec computer system Intel Core i9 + RTX 4080 and a BenQ ZOWIE 360Hz screen, broadcast live by a professional caster team.",
    zh: "2026年最大的电子竞技锦标赛，总奖金超过10万，汇集了全国32支顶级球队，在G-Speed Arena的Ramkhamhaeng 53局域网决赛阶段精准对决，配备锦标赛规格计算机系统Intel Core i9 + RTX 4080和BenQ ZOWIE 360Hz屏幕，由专业脚轮团队现场直播。"
  },
  "฿25,000 + 银币": {
    en: "25,000 + 银币",
    zh: "25,000 + 银币"
  },
  "฿10,000 per team + bronze medal": {
    en: "10,000 per team + bronze medal",
    zh: "每队10,000 +铜牌"
  },
  "฿5,000 + ROG Delta S Wireless headphones": {
    en: "5,000 + Rog Delta S Wireless headphones",
    zh: "5,000 + ROG Delta S无线耳机"
  },
  "฿5,000 + ROG Delta S 无线耳机": {
    en: "5,000 + Rog Delta S 无线耳机",
    zh: "5,000 + ROG Delta S 无线耳机"
  },
  "฿50,000 + 奖杯 + 金牌 + ROG 游戏装备套装": {
    en: "50,000 + 奖杯 + 金牌 + Rog 游戏装备套装",
    zh: "50,000 + 奖杯 + 金牌 + ROG 游戏装备套装"
  },
  "2026 年 G-SPEED VALORANT 锦标赛 |锦标赛奖金 ฿100,000": {
    en: "2026 年 G-SPEED valorant 锦标赛 |锦标赛奖金 100,000",
    zh: "2026 年 G-SPEED VALORANT 锦标赛 |锦标赛奖金 100,000"
  },
  "Ceremony to present prize money checks of ฿100,000 to the tournament champion teams.": {
    en: "Ceremony to present prize money checks of 100,000 to the tournament champion teams.",
    zh: "向锦标赛冠军球队颁发10万张奖金支票的仪式。"
  },
  "G-SPEED VALORANT CHAMPIONSHIP 2026 | Tournament for prize money ฿100,000": {
    en: "G-SPEED valorant Championship 2026 | Tournament for prize money 100,000",
    zh: "2026年G-SPEED VALORANT锦标赛| 10万奖金锦标赛"
  },
  "24-25 ตุลาคม 2026": {
    en: "October 24-25, 2026",
    zh: "2026年10月24-25日"
  },
  "10:00 - 22:00 น.": {
    en: "10:00 AM - 10:00 PM",
    zh: "上午10:00 -晚上10:00"
  },
  "฿80,000 + โควตาทัวร์ระดับนานาชาติ": {
    en: "80,000 + International Tour Quota",
    zh: "80,000 +国际旅游名额"
  },
  "1 ตุลาคม 2026": {
    en: "October 1, 2026",
    zh: "2026年10月1日"
  },
  "G-Speed Esport Arena รามคำแหง 53 (Main Stage Soundproof Booths)": {
    en: "G-Speed Esport Arena Ramkhamhaeng 53 (Main Stage Soundproof Booths)",
    zh: "G-Speed Esport Arena Ramkhamhaeng 53 （主舞台隔音摊位）"
  },
  "20 ตุลาคม 2026": {
    en: "October 20, 2026.",
    zh: "2026年10月20日。"
  },
  "฿40,000": {
    en: "<g id=\\\"1\\\">40,000</g>",
    zh: "40,000"
  },
  "฿15,000 ต่อทีม": {
    en: "15,000 per team",
    zh: "每队15,000人"
  },
  "อันดับ 3-4": {
    en: "3rd-4th",
    zh: "第3-4名"
  },
  "ใช้การตั้งค่า Official Valve CS2 Tournament Ruleset (MR12 + Overtime MR3)": {
    en: "Use the Official Valve CS2 Tournament Ruleset (MR12 + Overtime MR3) setting.",
    zh: "使用官方阀门CS2锦标赛规则集（ MR12 +加班MR3 ）设置。"
  },
  "การแข่งขันรันบนเซิร์ฟเวอร์ LAN ในเครื่องแม่ข่ายของ G-Speed ความหน่วงต่ำกว่า 1ms": {
    en: "The competition runs on LAN servers on G-Speed servers with a latency of less than 1ms.",
    zh: "比赛在G-Speed服务器上的局域网服务器上进行，延迟小于1毫秒。"
  },
  "ห้ามใช้คำสั่ง Console ที่ไม่ได้รับอนุญาตหรือ Custom Aliases": {
    en: "Do not use unauthorized console commands or custom aliases.",
    zh: "请勿使用未经授权的控制台命令或自定义别名。"
  },
  "รอบ Quarter-Finals (Bo3)": {
    en: "Quarter-Finals (Bo3)",
    zh: "四分之一决赛(Bo3)"
  },
  "10:00 น.": {
    en: "10:00 AM",
    zh: "上午10:00"
  },
  "พิธีเปิดและการคัดเลือกแผนที่ Map Veto": {
    en: "Map Veto Opening and Selection Ceremony",
    zh: "MAP否决权开盘和选拔仪式"
  },
  "11:00 - 15:00 น.": {
    en: "11:00 AM - 3:00 PM",
    zh: "上午11:00 -下午3:00"
  },
  "16:00 - 19:00 น.": {
    en: "4:00 PM - 7:00 PM",
    zh: "下午4:00 -晚上7:00"
  },
  "รอบ Semi-Finals (Bo3)": {
    en: "Semi-Finals (Bo3)",
    zh: "半决赛（ Bo3 ）"
  },
  "รอบชิงชนะเลิศ Grand Final (Bo5)": {
    en: "Grand Final (Bo5)",
    zh: "总决赛（ Bo5 ）"
  },
  "19:30 - 22:00 น.": {
    en: "7:30 PM - 10:00 PM",
    zh: "晚上7:30 -晚上10:00"
  },
  "BnTeT (กัปตันทีม)": {
    en: "BnTeT (Team Captain)",
    zh: "BnTeT （队长）"
  },
  "bLitz (กัปตันทีม)": {
    en: "bLitz (Team Captain)",
    zh: "bLitz （队长）"
  },
  "โต๊ะนักพากย์ (Caster Desk) พร้อมจอวิเคราะห์สถิติสดแบบเรียลไทม์": {
    en: "Caster Desk with real-time live statistical analysis screen",
    zh: "带实时统计分析屏幕的脚轮桌"
  },
  "CS2 BANGKOK SHOWDOWN INVITATIONAL 2026 | ชิง ฿150,000": {
    en: "CS2 Bangkok showdown Invitational 2026 | win 150,000",
    zh: "CS2曼谷摊牌邀请赛2026 |赢得150,000"
  },
  "เมาส์เกมมิ่งน้ำหนักเบาพิเศษ 49g สำหรับการเล็งเป้าหมายที่เฉียบคม": {
    en: "49g ultra-light gaming mouse for sharp aiming.",
    zh: "49克超轻游戏鼠标，瞄准清晰。"
  },
  "ทางเดินเปิดตัวนักกีฬา (Player Tunnel) พร้อมไฟสปอตไลต์อลังการ": {
    en: "Player Tunnel launch corridor with spectacular spotlights",
    zh: "带有壮观聚光灯的玩家隧道发射走廊"
  },
  "การแข่งขัน Counter-Strike 2 ระดับนานาชาติ ชิงเงินรางวัล 150,000 บาท ณ G-Speed Arena รามคำแหง 53 Dedicated LAN Server": {
    en: "International Counter-Strike 2 competition for 150,000 baht prize money at G-Speed Arena Ramkhamhaeng 53 Dedicated LAN Server",
    zh: "在G-Speed Arena Ramkhamhaeng 53专用局域网服务器举行的国际反恐精英2比赛，奖金为15万泰铢"
  },
  "รองชนะเลิศอันดับ 2 ร่วม": {
    en: "Joint 2nd Runner-up",
    zh: "联合亚军"
  },
  "CS2, Counter-Strike 2, G-Speed, ทัวร์นาเมนต์, แข่ง LAN, รามคำแหง 53, HLTV, Bangkok Showdown": {
    en: "CS2, Counter-Strike 2, G-Speed, Tournament, LAN Race, Ramkhamhaeng 53, HLTV, Bangkok Showdown",
    zh: "CS2、反恐精英2、G-Speed、锦标赛、局域网竞赛、Ramkhamhaeng 53、HLTV、曼谷摊牌"
  },
  "ห้ามใช้โปรแกรมโกง สคริปต์ช่วยเล่น หรือฉวยโอกาสจากข้อผิดพลาดของเกม หากตรวจพบปรับแพ้ทันที": {
    en: "Do not use cheaters, help scripts, or take advantage of game errors if it detects an immediate loss.",
    zh: "如果检测到直接损失，请勿使用作弊者、帮助脚本或利用游戏错误。"
  },
  "฿5,000 + หูฟังเกมมิ่ง ROG Delta S": {
    en: "5,000 + Rog Delta S Gaming Headset",
    zh: "5,000 + ROG Delta S游戏耳机"
  },
  "การแข่งขันอีสปอร์ตระดับประเทศ ชิงเงินรางวัลรวมกว่า ฿100,000 รวบรวมยอดฝีมือทั่วประเทศมาดวลความแม่นยำบนเวที LAN Final ณ G-Speed Arena รามคำแหง 53": {
    en: "The national esports competition for a total prize fund of more than 100,000 gathered experts across the country to duel with precision on the LAN Final stage at G-Speed Arena, Ramkhamhaeng 53.",
    zh: "全国电子竞技比赛总奖金超过10万人，全国各地的专家齐聚一堂，在G-Speed Arena （ Ramkhamhaeng 53 ）的局域网决赛阶段精确对决。"
  },
  "ลงทะเบียนหน้างาน & ตรวจสอบอุปกรณ์นักกีฬา (Player Check-in)": {
    en: "On-site registration & Player Check-in",
    zh: "现场注册和球员签到"
  },
  "รอบชิงชนะเลิศ Grand Final บนเวที Main Stage (Best of 5)": {
    en: "Grand Final on Main Stage (Best of 5)",
    zh: "主舞台总决赛（五强）"
  },
  "รอบคัดเลือกแบ่งกลุ่ม Group Stage (Best of 1)": {
    en: "Group Stage Qualifier (Best of 1)",
    zh: "小组赛阶段预选赛（满分1分）"
  },
  "G-SPEED VALORANT TOURNAMENT 2026 | ชิงเงินรางวัล ฿100,000": {
    en: "G-SPEED valorant tournament 2026 | $100,000 prize pool",
    zh: "2026年G-SPEED Valorant锦标赛| $ 100,000奖金池"
  },
  "รอบ 8 ทีม และ 4 ทีมสุดท้าย (Quarter & Semi-Finals)": {
    en: "Quarter & Semi-Finals",
    zh: "四分之一决赛和半决赛"
  },
  "VALORANT, GSpeed, ทัวร์นาเมนต์, แข่งเกม, อีสปอร์ต, รามคำแหง 53, LAN Final, 360Hz": {
    en: "Valorant, GSpeed, Tournament, Game Race, Esports, Ramkhamhaeng 53, LAN Final, 360Hz",
    zh: "Valorant ， GSpeed ，锦标赛，比赛，电子竞技， Ramkhamhaeng 53 ，局域网决赛， 360Hz"
  },
  "ภาพบรรยากาศการแข่งขัน Pan-Pacific Warfare Cup 2026 จัดขึ้นที่ ร้าน Gspeed Living Plus ดูภาพบรรกาศได้ที่นี่": {
    en: "Photo courtesy of the Pan-Pacific Warfare Cup 2026 held at Gspeed Living Plus. View photos here.",
    zh: "照片由Gspeed Living Plus举办的2026年泛太平洋战争杯提供。在此处查看照片。"
  },
  "4 นาทีในการอ่าน": {
    en: "4 minutes to read",
    zh: "4分钟阅读"
  },
  "การแข่งขัน VALORANT LAN Tournament สุดยิ่งใหญ่ ณ G-Speed Arena รามคำแหง 53 เงินรางวัลรวม 100,000 บาท สมัครด่วน 32 ทีมเท่านั้น": {
    en: "The great VALORANT LAN Tournament at G-Speed Arena Ramkhamhaeng 53 with a prize pool of 100,000 baht. Join now. 32 teams only.",
    zh: "G-Speed Arena Ramkhamhaeng 53的精彩VALORANT局域网锦标赛，奖金为10万泰铢。立即加入。仅限32支队伍。"
  },
  "เมษายน 2026": {
    en: "April 2026",
    zh: "2026年4月"
  },
  "฿50,000 พร้อมอุปกรณ์เกมมิ่งเกียร์ ROG": {
    en: "50,000 with Rog gaming gear",
    zh: "配备ROG游戏装备的50,000"
  },
  "บรรยากาศการแข่งขัน Pan-Pacific Warfare Cup 2026": {
    en: "Pan-Pacific Warfare Cup 2026 atmosphere",
    zh: "2026年泛太平洋战杯气氛"
  },
  "G-Speed ร่วมกับ ASUS ROG และ NVIDIA Thailand": {
    en: "G-Speed joins Asus Rog and NVIDIA Thailand",
    zh: "G-Speed加入华硕ROG和NVIDIA泰国"
  },
  "320+ คน (32 ทีมทั่วประเทศ)": {
    en: "320 + people (32 teams nationwide)",
    zh: "320多人（全国32个团队）"
  },
  "การได้ลงแข่งในสภาพแวดล้อมที่เครื่องสเปกแรง จอ 360Hz และเน็ตไม่กระตุกเลย ทำให้ผู้เล่นสามารถปลดปล่อยศักยภาพได้ 100% สมกับเป็นสนามแข่งระดับเวิลด์คลาส": {
    en: "Being able to compete in an environment where the 360Hz spectroscope and the net are not twitching at all, allowing players to unleash their potential 100% of the time, as if they were a world class race track.",
    zh: "能够在360Hz光谱仪和网络完全不抽搐的环境中竞争，让玩家能够100 ％释放他们的潜力，就好像他们是世界级的赛道一样。"
  },
  "฿80,000 พร้อมสิทธิ์แข่งรอบเอเชียแปซิฟิก": {
    en: "80,000 with Asia-Pacific rights",
    zh: "80,000人拥有亚太权利"
  },
  "Predator Gaming Thailand ร่วมกับ Krafton Inc.": {
    en: "Predator Gaming Thailand in partnership with Krafton Inc.",
    zh: "与Krafton Inc.合作的Predator Gaming Thailand"
  },
  "฿50,000 including ROG gaming gear": {
    en: "50,000 including Rog gaming gear",
    zh: "50,000 ，包括ROG游戏装备"
  },
  "G-Speed Esport Arena (เวทีกลางและบูทกิจกรรมค่ายเกม)": {
    en: "G-Speed Esport Arena (Center Stage & Game Camp Activity Boot)",
    zh: "G-Speed电子竞技场（中心舞台和比赛训练营活动靴）"
  },
  "กรกฎาคม 2026": {
    en: "July 2026",
    zh: "2026年7月"
  },
  "450+ คน (แฟนเกมและทีมสตรีมเมอร์)": {
    en: "450 + people (game fans and team streamers)",
    zh: "450多人（游戏粉丝和团队主播）"
  },
  "บรรยากาศในงานคึกคักตั้งแต่ช่วงเช้าด้วยกิจกรรม Fan Meeting พบปะคอสเพลย์เยอร์ในชุดตัวละครแอร์ดรอปสุดเท่ พร้อมจุดถ่าย���ูปโฟโต้บูธสามมิติ และแจกไอเทมโค้ดลิขสิทธิ์แท้ให้กับผู้เข้าร่วมงานทุกคน": {
    en: "The atmosphere at the event is lively from the morning with Fan Meeting activities, cosplayers in cool airdrop character costumes with three-dimensional photobooth photo spots, and give out authentic code items to all attendees.",
    zh: "活动的气氛从早上开始就充满活力，有粉丝会活动，穿着凉爽的空投人物服装和三维照相亭拍照点的角色扮演者，并向所有与会者分发正宗的代码项目。"
  },
  "การแข่งขันรอบออฟไลน์ไฟนอลดำเนินไปอย่างตื่นเต้นเร้าใจ มีการใช้ระบบ Observer บรอดแคสต์มืออาชีพพร้อมแคสเตอร์ชื่อดังมาพากย์สดในสตูดิโอบาร์ของร้าน ผู้ชนะเลิศได้รับสิทธิ์เป็นตัวแทนประเทศไทยไปลุยต่อในเวทีระดับนานาชาติ": {
    en: "The Offline Finals went on excitedly, using the professional Broadcast Observer system with the famous caster to be dubbed live in the shop's studio bar. The winner was entitled to represent Thailand on the international stage.",
    zh: "线下总决赛兴奋地继续进行，使用专业的广播观察者系统与著名的脚轮在商店的工作室酒吧现场配音。获胜者有权在国际舞台上代表泰国。"
  },
  "G-Speed เป็นพาร์ตเนอ���์ร้านเกมที่มีความพร้อมด้านระบบและสถานที่สูงมาก สามารถรองรับการบรอดแคสต์ระดับออฟฟิเชียลได้อย่างไร้ที่ติ": {
    en: "G-Speed is a game shop partner with very high system and location availability that can support office-level broadcasting flawlessly.",
    zh: "G-Speed是一家游戏商店合作伙伴，拥有非常高的系统和位置可用性，可以完美支持办公室级广播。"
  },
  "ค่ายเกมยักษ์ใหญ่ Krafton จับมือกับ Acer Predator Gaming เลือกใช้ศูนย์ G-Speed Esport Arena เป็นสถานที่จัดศึกใหญ่ THAILAND PREDATOR LEAGUE - PUBG BATTLEGROUNDS ประจำปี โดยมีนักล่าไก่ทั่วฟ้าเมืองไทยลงทะเบียนเข้าร่วมกว่า 64 สควอด": {
    en: "The gaming giant Krafton teamed up with Acer Predator Gaming to use the G-Speed Esport Arena as a venue for the annual Thailand Predator League - PUBG Battlegrounds, with over 64 squads of chicken hunters registered across the Thai sky.",
    zh: "游戏巨头卡夫顿与宏碁捕食者游戏公司合作，将G-Speed电子竞技场用作一年一度的泰国捕食者联盟-《绝地求生》战场（ PUBG Battlegrounds ）的场地，在泰国天空中注册了超过64支猎鸡队。"
  },
  "เวทีหลักกับการแข่งขันรอบตัดสินชิงตั๋วสู่เอเชีย": {
    en: "The main stage and the finals of the ticket to Asia",
    zh: "亚洲之旅门票的主舞台和决赛"
  },
  "G-Speed Esport Arena (โซนคาเฟ่และเวท��กลาง)": {
    en: "G-Speed Esport Arena (Cafe & Magic Zone)",
    zh: "G-Speed电子竞技场（咖啡馆和魔术区）"
  },
  "พิธีมอบถ้วยแชมป์และเงินรางวัลสนับสนุนจาก Predator": {
    en: "Champion's Cup Ceremony and Predator's Prize Money",
    zh: "冠军杯颁奖典礼和掠夺者奖金"
  },
  "ผู้เข้าแข่งขันสวมหูฟังตัดเสียงรบกวน วางแผนเอาตัวรอด": {
    en: "Contestants wear noise-cancelling headphones and plan to survive.",
    zh: "参赛者佩戴降噪耳机并计划生存。"
  },
  "มิถุนายน 2026": {
    en: "June 2026",
    zh: "2026年6月"
  },
  "ไอเทมแรร์มูลค่ารวมกว่า ฿120,000": {
    en: "Rare items worth a total of over 120,000",
    zh: "总价值超过12万的稀有道具"
  },
  "ความอบอุ่นของแฟนเกม Zone4 ที่มารวมตัวกันที่นี่ ทำให้เรารู้ว่าคอมมูนิตี้เกมไทยยังเหนียวแน่นและพร้อมสนับสนุนกันเสมอ": {
    en: "The warmth of Zone4 fans gathered here lets us know that the Thai gaming community is strong and supportive.",
    zh: "聚集在这里的Zone4粉丝的热情让我们知道，泰国游戏社区是强大而支持的。"
  },
  "280+ คน": {
    en: "280 + people",
    zh: "280人以上"
  },
  "ผู้ร่วมงานได้ร่วมประลองฝีมือในมินิทัวร์นาเมนต์ 1v1 และ 3v3 แบบกระชับมิตร พร้อมลุ้นรับแรร์ไอเทมและฟิกเกอร์ลิมิเต็ดที่มีเฉพาะในงานนี้เท่านั้น": {
    en: "Participants participated in friendly 1v1 and 3v3 mini tournaments with a chance to win exclusive rare items and limited figurines.",
    zh: "参与者参加了友好的1v1和3v3迷你锦标赛，有机会赢得专属稀有物品和限量小雕像。"
  },
  "งานรวมพลสาวกเกมต่อสู้ในตำนาน Zone4 โดยค่าย Electronics Extreme เนรมิตพื้นที่ G-Speed ให้กลายเป็นสถานที่จัดแฟนมีตติ้งสุดเอ็กซ์คลูซีฟ มีการเปิดเผยแผนการอัปเดตเซิร์ฟเวอร์และระบบคลาสใหม่อย่างเป็นทางการ": {
    en: "Zone4 legendary fighting game discipleship gathering by Electronics Extreme Camp has created the G-Speed area to become an exclusive fan meeting place. The new server and class system update plans have been officially revealed.",
    zh: "Electronics Extreme Camp的Zone4传奇格斗游戏门徒聚会打造了G-Speed专区，成为粉丝专属聚会场所，全新服务器和职业系统更新方案已正式揭晓。"
  },
  "G-Speed Esport Arena (โซน Standard Gaming Arena)": {
    en: "G-Speed Esport Arena (Standard Gaming Arena Zone)",
    zh: "G-Speed电子竞技场（标准游戏竞技场区）"
  },
  "฿25,000 พร้อมมงกุฎและไอเทมปีกถาวร": {
    en: "25,000 with crown and wing items",
    zh: "25,000件带表冠和机翼的物品"
  },
  "แฟนเกม Zone4 ร่วมทดลองเล่นแพตช์ใหม่ในโซนเครื่อง VIP": {
    en: "Zone4 fans try out the new patches in the VIP zone.",
    zh: "Zone4粉丝在VIP区试用新补丁。"
  },
  "การแจกของรางวัลสุดพิเศษและของที่ระลึกจากผู้บริหารค่าย": {
    en: "Exclusive giveaways and souvenirs from camp administrators",
    zh: "营地管理员提供的独家赠品和纪念品"
  },
  "พฤษภาคม 2026": {
    en: "May 2026",
    zh: "2026年5月"
  },
  "งานแข่งขันที่เต็มไปด้วยรอยยิ้ม เสียงเพลง และมิตรภาพของเหล่านักเต้นทั่วประเทศที่มารวมตัวกัน": {
    en: "A competition filled with smiles, music, and the friendship of dancers all over the country.",
    zh: "这场比赛充满了微笑、音乐和全国舞者的友谊。"
  },
  "ศึกประชันความเร็วของนิ้วมือและจังหวะดนตรีกับ AUDITION LADY TOURNAMENT ครั้งที่ 7 รายการแข่งขันที่เปิดโอกาสให้นักเต้นสาวสวยทั่วประเทศมาชิงตำแหน่งราชินีฟลอร์เต้น": {
    en: "Finger speed and rhythm battle with the 7th audition lady tournament, a competition that allows beautiful dancers all over the country to win the title of Floor Queen.",
    zh: "第7届试镜女子锦标赛的手指速度和节奏比赛，让全国各地的美丽舞者赢得地板女王的称号。"
  },
  "ร้านเกม G-Speed ได้จัดเตรียมคีย์บอร์ดกลไกสวิตช์ความเร็วสูงและหูฟังตัดเสียง เพื่อให้นักกีฬาได้ยินบีตดนตรีและกดปุ่ม Perfect ได้อย่างแม่นยำที่สุด": {
    en: "G-Speed Game Store has provided keyboards, mechanics, high-speed switches, and mute headphones to enable athletes to hear music beats and press the Perfect key as accurately as possible.",
    zh: "G-Speed Game Store提供键盘、机械、高速开关和静音耳机，使运动员能够尽可能准确地听到音乐节拍并按下Perfect键。"
  },
  "ความเร็วในการรัวปุ่มคีย์บอร์ดระดับเสี้ยววินาที": {
    en: "Crash speed, millisecond level keyboard keys",
    zh: "崩溃速度，毫秒级键盘键"
  },
  "ผู้ได้รับรางวัลชนะเลิศรับมอบมงกุฎและเงินรางวัล": {
    en: "The Grand Prize Winner receives the crown and the prize money.",
    zh: "大奖得主将获得王冠和奖金。"
  },
  "กิจกรรม เปิดตัวเกม ZONE4": {
    en: "ZONE4 Game Launch Event",
    zh: "ZONE4游戏发布活动"
  },
  "เมษายน 2013": {
    en: "April 2013",
    zh: "2013年4月"
  },
  "150+ คน": {
    en: "150 + people",
    zh: "150人以上"
  },
  "บรรยากาศงานเปิดตัวเกม ZONE4 ที่ร้าน GSpeed Living Plus 2013": {
    en: "Atmosphere of the launch of ZONE4 at GSpeed Living Plus 2013",
    zh: "在GSpeed Living Plus 2013上推出ZONE4的氛围"
  },
  "2 นาทีในการอ่าน": {
    en: "2 minutes to read",
    zh: "2分钟阅读"
  },
  "บรรยากาศ งานแข่ง Pubg Chicken Dinner by zowie": {
    en: "Pubg Chicken Dinner by zowie",
    zh: "Zowie的Pubg鸡肉晚餐"
  },
  "การแข่งขันกระชับมิตรประจำเดือนของชุมชนร้านเกม G-Speed ชิงเงินรางวัลและชั่วโมงเล่นเกมฟรี บรรยากาศสนุกสนานและเป็นกันเองตลอดวันหยุดสุดสัปดาห์": {
    en: "Monthly friendly tournaments of the G-Speed gaming community, prize money and free game hours, fun and friendly atmosphere throughout the weekend.",
    zh: "G-Speed游戏社区的每月友好锦标赛、奖金和免费游戏时间、整个周末的乐趣和友好的氛围。"
  },
  "กิจกรรม เปิดตัวเกม ZONE4 - zone4 08": {
    en: "ZONE4-zone4 game launch event 08",
    zh: "ZONE4-zone4游戏发布活动08"
  },
  "มีนาคม 2013": {
    en: "March 2013",
    zh: "2013年3月"
  },
  "กิจกรรมคอมมูนิตี้รายเดือนที่เปิดให้ลูกค้าประจำและแฟนคลับได้มาพบปะและประลองฝีมือกันอย่างเป็นกันเอง": {
    en: "A monthly community event open to regular customers and fans to meet and compete in a friendly manner.",
    zh: "每月一次的社区活动，向常客和粉丝开放，以友好的方式见面和比赛。"
  },
  "ลูกค้าหมุนเวียน 800+ คน/วัน": {
    en: "800 + active customers/day",
    zh: "每天有超过800个活跃客户"
  },
  "งานแข่ง Pubg Chicken Dinner by zowie": {
    en: "Pubg Chicken Dinner by zowie",
    zh: "Zowie的Pubg鸡肉晚餐"
  },
  "G-Speed Esport Arena ทุกโซนบริการ": {
    en: "G-Speed Esport Arena All Service Zones",
    zh: "G-Speed电子竞技场所有服务区"
  },
  "เราใส่ใจในทุกรายละเอียด ทั้งเก้าอี้ที่นั่งสบายตลอดคืน ระบบแอร์ฟอกอากาศ PM2.5 และเมนูอาหารปรุงสดที่ส่งตรงถึงโต๊ะ": {
    en: "We pay attention to every detail, including comfortable chairs throughout the night, PM2.5 air purification system, and fresh-cooked dishes delivered directly to the table.",
    zh: "我们注重每一个细节，包括整晚舒适的椅子、PM2.5空气净化系统，以及直接送到餐桌上的新鲜烹饪的菜肴。"
  },
  "เก็บบรรยากาศยามค่ำคืนของ G-Speed Esport Arena ศูนย์รวมเกมเมอร์ที่เปิดให้บริการตลอด 24 ชั่วโมง ไฮไลต์คือช่วงสุดสัปดาห์ที่มีปาร์ตี้เล่นเกมกับกลุ่มเพื่อน เครื่องเต็ม 100% พร้อมบริการสั่งอาหาร เครื่องดื่มร้อน-เย็นจากบาร์เสิร์ฟถึงโต๊ะอย่างรวดเร็ว": {
    en: "Capture the nightlife of the G-Speed Esport Arena, a 24-hour gamer hub. Highlights include a weekend of parties, games with a group of friends, 100% full machines, and fast food, hot and cold drinks from the bar to the table.",
    zh: "捕捉24小时游戏中心G-Speed Esport Arena的夜生活。亮点包括周末派对、与一群朋友的游戏、100%全功能机器，以及从酒吧到餐桌的快餐、冷热饮料。"
  },
  "฿80,000 พร้อมตั๋วตัวแทนเอเชีย": {
    en: "80,000 with Asia agent ticket",
    zh: "80,000与亚洲代理工单"
  },
  "ทีมข่าวกิจกรรม G-Speed": {
    en: "G-Speed Activity News Team",
    zh: "G-Speed活动新闻团队"
  },
  "รวมภาพความมันส์งานแข่ง PUBG Predator League 2026 | G-Speed Arena": {
    en: "PUBG Predator League 2026 Overview | G-Speed Arena",
    zh: "PUBG Predator League 2026概览| G-Speed竞技场"
  },
  "การจัดแข่งบนฮาร์ดแวร์มาตรฐาน Pro Circuit ช่วยดึงศักยภาพนักกีฬาอีสปอร์ตไทยได้อย่างเต็มที่": {
    en: "Organizing the race on Pro Circuit standard hardware helps to capture the full potential of Thai esports athletes.",
    zh: "在Pro Circuit标准硬件上组织比赛有助于充分发挥泰国电子竞技运动员的潜力。"
  },
  "450+ คน": {
    en: "450 + people",
    zh: "450人以上"
  },
  "PUBG, Predator League, แข่งเกม, G-Speed, Esports Arena, ทัวร์นาเมนต์": {
    en: "PUBG, Predator League, Gaming, G-Speed, Esports Arena, Tournaments",
    zh: "《绝地求生》、捕食者联盟、游戏、G-Speed、电子竞技场、锦标赛"
  },
  "เกาะติดภาพบรรยากาศการแข่งขัน PUBG Predator League ศึกชิงแชมป์เงินรางวัล 80,000 บาท ณ ศูนย์ G-Speed Esport Arena": {
    en: "Attached to the image of the PUBG Predator League tournament, the 80,000 baht championship battle at the G-Speed Esport Arena center.",
    zh: "在G-Speed Esport Arena中心举行的80,000泰铢冠军争夺战附在PUBG Predator League锦标赛的形象上。"
  },
  "สิ้นสุดลงอย่างยิ่งใหญ่สำหรับศึกใหญ่แห่งปี THAILAND PREDATOR LEAGUE 2026 ณ ศูนย์ G-Speed Esport Arena โดยมีทีมระดับหัวแถวของประเทศกว่า 32 ทีมตบเท้าประลองฝีมือชิงเงินรางวัลรวมกว่า ฿80,000 บาท": {
    en: "Great end for the big battle of the year, Thailand predator league 2026 at the G-Speed Esport Arena center, with more than 32 country's top teams slapping a total prize pool of more than 80,000 baht.",
    zh: "在G-Speed Esport Arena中心举办的泰国捕食者联赛2026是年度大战的最佳结局，超过32支国家顶级球队总奖金超过8万泰铢。"
  },
  "ตลอดการขับเคี่ยว 2 วันเต็ม โซนเวที Main Stage เต็มไปด้วยเสียงเชียร์ดังกึกก้อง แฟนคลับมาร่วมชมทั้งติดขอบเวทีและผ่านจอถ่ายทอดสด LED 4K ขนาดยักษ์ใจกลางร้าน": {
    en: "Over the course of two full days, the Main Stage zone was filled with loud cheers. Fans came to watch both on the edge of the stage and through the giant 4K led live screen in the center of the store.",
    zh: "在整整两天的时间里，主舞台区充满了欢呼声，粉丝们来到舞台边缘，通过商店中心的巨型4K LED直播屏幕观看。"
  },
  "การแข่งขันรอบสุดท้ายเป็นไปอย่างระทึกใจ โดยทีมแชมป์สามารถเอาชีวิตรอดและเก็บคะแนนคิลสูงสุดในวงสุดท้าย คว้าถ้วยแชมป์และสิทธิ์เข้าร่วมแข่งขันระดับภูมิภาคเอเชียแปซิฟิกต่อไป": {
    en: "The final round was thrilling, with the championship team able to survive and collect the highest kill points in the final band, winning the championship trophy and continuing to participate in the Asia-Pacific region.",
    zh: "最后一轮是激动人心的，冠军球队能够生存下来，并在决赛乐队中获得最高的击杀点，赢得冠军奖杯，并继续参加亚太地区的比赛。"
  },
  "5 กันยายน 2026": {
    en: "September 5, 2026",
    zh: "2026年9月5日"
  },
  "บรรยากาศผู้เข้าแข่งขันและหน้าจอคอม 360Hz บนเวที": {
    en: "Participant atmosphere and 360Hz computer screen on stage",
    zh: "舞台上的参与者氛围和360Hz电脑屏幕"
  },
  "แฟนคลับส่งเสียงเชียร์รอบชิงชนะเลิศ": {
    en: "The fans cheered on the final.",
    zh: "球迷们在决赛中欢呼雀跃。"
  },
  "พิธีมอบเงินรางวัลและของที่ระลึกจาก Predator": {
    en: "Prize Ceremony and Predator Souvenirs",
    zh: "颁奖典礼和捕食者纪念品"
  },
  "กองบรรณาธิการ GLP": {
    en: "GLP Editorial Board",
    zh: "GLP编辑委员会"
  },
  "ไอเทมแรร์มูลค่า ฿50,000": {
    en: "Rare item worth 50,000",
    zh: "价值5万的稀有道具"
  },
  "GLP จับมือ Electronics Extreme จัดงาน Zone4 แจกไอเทมแท้ | G-Speed": {
    en: "GLP joins hands with Electronics Extreme to host Zone4 giveaway | G-Speed",
    zh: "GLP携手Electronics Extreme推出Zone4赠品| G-Speed"
  },
  "ภาพบรรยากาศงาน Electronics Extreme - Zone4 Fan Meeting กิจกรรมแจกไอเทมโค้ดและการแข่งขันมินิแมตช์ ณ G-Speed": {
    en: "Photos of Electronics Extreme - Zone4 Fan Meeting, Item Code Giveaway and Mini-Match at G-Speed",
    zh: "Electronics Extreme - Zone4粉丝会议、商品代码赠送和G-Speed迷你比赛的照片"
  },
  "Zone4, Electronics Extreme, แฟนมีตติ้ง, แจกไอเทม, ร้านเกม, G-Speed": {
    en: "Zone4, Electronics Extreme, Fan Meeting, Item Giveaway, Game Store, G-Speed",
    zh: "Zone4, Electronics Extreme,粉丝会议,物品赠送,游戏商店, G-Speed"
  },
  "ความอบอุ่นของแฟนเกม Zone4 ยังคงเหนียวแน่น และพื้นที่ของ G-Speed ตอบโจทย์งานมีตติ้งได้อย่างสมบูรณ์แบบ": {
    en: "Zone4 fans' warmth remains tight, and the G-Speed space perfectly meets their meeting needs.",
    zh: "Zone4风扇的温暖仍然紧凑， G-Speed空间完美满足了他们的需求。"
  },
  "ผู้เข้าร่วมงานทุกคนได้รับแพ็กเกจไอเทมโค้ดระดับ Exclusive พร้อมลุ้นรับเสื้อแจ็กเก็ตและของสะสมลิขสิทธิ์แท้จากเกาหลี": {
    en: "All attendees received an Exclusive coded item package with a chance to win authentic Korean jackets and collectibles.",
    zh: "所有与会者都获得了独家编码物品套餐，有机会赢取正宗的韩国夹克和收藏品。"
  },
  "งานนี้นับเป็นอีกหนึ่งเครื่องยืนยันว่า G-Speed ไม่ได้เป็นเพียงร้านเกม แต่เป็นฮับจัดอีเวนต์และศูนย์รวมคอมมูนิตี้เกมเมอร์ที่พร้อมที่สุดของกรุงเทพฯ": {
    en: "This event confirms that G-Speed is not just a game store, but an event hub and Bangkok's most equipped community gamer hub.",
    zh: "此次活动证实了G-Speed不仅仅是一家游戏商店，而是一个活动中心和曼谷设备最齐全的社区游戏玩家中心。"
  },
  "Electronics Extreme ร่วมกับ G-Speed Arena จัดกิจกรรมสุดพิเศษเพื่อเอาใจแฟนเกมไฟท์ติ้งระดับตำนาน Zone4 ภายในงานมีการประกวดคอมมูนิตี้และมินิทัวร์นาเมนต์กระชับมิตร": {
    en: "Electronics Extreme and G-Speed Arena organized a special event to please fans of the legendary fighting game Zone4. The event featured a community contest and a friendly mini tournament.",
    zh: "Electronics Extreme和G-Speed Arena组织了一场特别活动，以取悦传奇格斗游戏Zone4的粉丝。该活动以社区比赛和友谊迷你锦标赛为特色。"
  },
  "การประลองฝีมือแมตช์พิเศษบนเวที": {
    en: "Special Match Skill Stages",
    zh: "特殊比赛技能阶段"
  },
  "ผู้ร่วมงานลงทะเบียนรับถุงของขวัญและไอเทมโค้ด": {
    en: "Participants sign up for gift bags and item codes.",
    zh: "参与者注册礼品袋和商品代码。"
  },
  "28 สิงหาคม 2026": {
    en: "August 28, 2026.",
    zh: "2026年8月28日。"
  },
  "ทีมเทคนิคและวิศวกรรมไอที": {
    en: "Technical and Engineering IT Team",
    zh: "技术和工程IT团队"
  },
  "เราไม่เคยหยุดพัฒนามาตรฐาน เพื่อมอบประสบการณ์เกมมิ่งที่ดีที่สุดและลื่นที่สุดให้แก่ลูกค้าทุกคน": {
    en: "We never stop developing standards to deliver the best and smoothest gaming experience for all our customers.",
    zh: "我们从不停止制定标准，为所有客户提供最佳、最流畅的游戏体验。"
  },
  "อัปเกรดมูลค่ากว่า 5 ล้านบาท": {
    en: "Upgrades worth over 5 million baht",
    zh: "价值超过500万泰铢的升级"
  },
  "เปิดบริการแล้วทุกที่นั่ง": {
    en: "Open to all seats",
    zh: "向所有座位开放"
  },
  "อัปเกรดสเปกใหม่ RTX 40 Series จอ 360Hz ทุกล็อต | G-Speed Esport": {
    en: "Upgrade New Specs RTX 40 Series 360Hz Display All Lots | G-Speed Esport",
    zh: "升级全新规格RTX 40系列360Hz显示器所有批次| G-Speed Esport"
  },
  "สเปกคอมร้านเกม, RTX 4080, จอ 360Hz, ร้านเกมสเปกแรง, G-Speed Arena": {
    en: "Gaming Shop Specs, RTX 4080, 360Hz Screen, Gaming Shop Specs, G-Speed Arena",
    zh: "游戏商店规格， RTX 4080 ， 360Hz屏幕，游戏商店规格， G-Speed Arena"
  },
  "G-Speed Arena ยกเครื่องสเปกคอมใหม่ยกแผง ขุมพลัง GeForce RTX 40 Series พร้อมจอ BenQ 360Hz Fast-IPS เน็ต 10Gbps": {
    en: "G-Speed Arena revamped the GeForce RTX 40 Series with BenQ 360Hz Fast-IPS Net 10Gbps display.",
    zh: "G-Speed Arena使用明基360Hz Fast-IPS Net 10Gbps显示屏改进了GeForce RTX 40系列。"
  },
  "จับคู่กับซีพียู Intel Core i7 / i9 เจนเนอเรชันใหม่ แรม 32GB DDR5 ความเร็วสูง 6000MHz และหน้าจออีสปอร์ต BenQ ZOWIE 360Hz Fast-IPS ที่ให้การตอบสนอง 0.5ms คมชัดทุกการเคลื่อนไหว": {
    en: "Paired with a new generation Intel Core i7/i9 CPU, high-speed 32GB DDR5 6000MHz RAM, and a BenQ ZOWIE 360Hz Fast-IPS e-sports screen that delivers a crisp 0.5ms response every move.",
    zh: "搭配新一代英特尔酷睿i7/i9处理器、高速32GB DDR5 6000MHz RAM和明基ZOWIE 360Hz Fast-IPS电子竞技屏幕，每次移动都能提供清晰的0.5毫秒响应。"
  },
  "เพื่อตอกย้ำความเป็นผู้นำศูนย์กีฬาอีสปอร์ตระด��บเวิลด์คลาส G-Speed Esport Arena ทุ่มงบประมาณกว่า 5 ล้านบาท ปรับปรุงเครื่องคอมพิวเตอร์ทุกล็อตให้เป็นขุมพลังล่าสุด NVIDIA GeForce RTX 40 Series": {
    en: "To reinforce its leadership, Esports Center World Class G-Speed Esport Arena has invested more than 5 million baht, improving all PC lots to be the latest powerhouse, the NVIDIA GeForce RTX 40 Series.",
    zh: "为了巩固其领导地位， Esports Center World Class G-Speed Esport Arena已投资超过500万泰铢，改进了所有PC批次，使其成为NVIDIA GeForce RTX 40系列的最新动力源泉。"
  },
  "หน้าจอ 360Hz ที่ผ่านการปรับแต่งค่าสีสำหรับโปรเพลเยอร์": {
    en: "360Hz color-optimized display for Pro Player",
    zh: "适用于专业播放器的360Hz彩色优化显示屏"
  },
  "เกมอื่นๆ": {
    en: "More games",
    zh: "更多游戏"
  },
  "เคสคอมพิวเตอร์และระบบระบายความร้อนด้วยน้ำสุดเท่": {
    en: "Cool computer case and water-cooling system",
    zh: "冷却电脑机箱和水冷系统"
  },
  "16+ ปี": {
    en: "16 years old",
    zh: "- 十六年"
  },
  "นอกจากนี้ ระบบ Diskless Server ยังได้รับการอัปเกรดเป็น NVMe Gen5 Multi-tier Caching ร่วมกับระบบเน็ตเวิร์ก Dual 10Gbps Fiber Optic ช่วยให้การโหลดเกมและการเปิดเครื่องเร็วขึ้นกว่าเดิม 300%": {
    en: "The Diskless Server system has also been upgraded to NVMe Gen5 Multi-tier Caching in conjunction with the Dual 10Gbps Fiber Optic network, enabling 300% faster game loading and power-on times.",
    zh: "无盘服务器系统还与双10Gbps光纤网络一起升级到NVMe Gen5多层缓存，使游戏加载和开机时间加快300%。"
  },
  "มาตรฐานความถูกต้อง โปร่งใ�� และปลอดภัย": {
    en: "Standards for accuracy, transparency and safety",
    zh: "准确性、透明度和安全性标准"
  },
  "ยึดหลักร้านเกมสีขาว ได้รับใบอนุญาตถูกต้อง 100% ปลอดบุหรี่และโปร่งใส": {
    en: "Based on the principle, the white game shop is 100% licensed, non-smoking and transparent.",
    zh: "基于这一原则，白色游戏商店是100%许可、禁烟和透明的。"
  },
  "สิ่งแวดล้อมปลอดภัยและได้มาตรฐาน": {
    en: "Environmentally safe and up to standard",
    zh: "环保安全且符合标准"
  },
  "ระบบแฟรนไชส์ออกแบบโดยคำนึงถึงผลตอบแทนของผู้ลงทุน ควบคุมต้นทุนได้จริง": {
    en: "The franchise system is designed with the return of investors in mind, controlling the actual cost.",
    zh: "特许经营系统的设计考虑了投资者的回报，控制了实际成本。"
  },
  "คืนทุนไว พาร์ตเนอร์เติบโตยั่งยืน": {
    en: "Return capital for sustainable growth with viPartners",
    zh: "通过viPartners实现可持续增长的回报资本"
  },
  "ร้านเกมสีขาว ปลอดภัยสำหรับเยาวชน": {
    en: "The White Shop is safe for teens.",
    zh: "白色商店对青少年来说是安全的。"
  },
  "ระบบกล้องวงจรปิด CCTV Full HD บันทึก 30 วัน": {
    en: "CCTV Surveillance System Full HD 30-day recording",
    zh: "闭路电视监控系统全高清30天录制"
  },
  "G-Speed ทุกสาขาผ่านการรับรองและตรวจสอบตามพระราชบัญญัติภาพยนตร์และวีดิทัศน์ ได้รับใบอนุญาตประกอบกิจการร้านเกมอย่างถูกต้องจากกระทรวงวัฒนธรรม ใช้ระบบปฏิบัติการ Windows และลิขสิทธิ์เกมแท้ 100% หมดกังวลเรื่องปัญหาลิขสิทธิ์": {
    en: "All G-Speed branches are certified and audited in accordance with the Film and Video Act, have a valid gaming store license from the Ministry of Culture, use the Windows operating system and copyright 100% genuine games, no worries about copyright issues.",
    zh: "所有G-Speed分支机构均根据“电影和视频法”进行认证和审计，拥有文化部颁发的有效游戏商店许可证，使用Windows操作系统和版权100 ％正版游戏，无需担心版权问题。"
  },
  "ใบอนุญาตสถานประกอบการถูกต้องตามกฎหมาย": {
    en: "Legal Establishment Permit",
    zh: "合法营业执照"
  },
  "คำนวณงบลงทุน & วางระบบร้าน": {
    en: "Calculate investment budget & set up store system",
    zh: "计算投资预算并建立门店系统"
  },
  "ร่วมเป็นพาร์ตเนอร์แฟรนไชส์กับเรา": {
    en: "Become a Franchise Partner",
    zh: "成为特许经营合作伙伴"
  },
  "ขยายธุรกิจสู่ Esport Arena เต็มรูปแบบ รองรับการจัดแข่งขันระดับประเทศร่วมกับค่ายเกมใ����ญ่": {
    en: "Expand into a full-fledged Esport Arena, supporting national tournaments in conjunction with gaming camps.",
    zh: "扩展成为一个成熟的电子竞技场，与游戏营地一起支持全国锦标赛。"
  },
  "พิธีเปิดตัว GLP Flagship Arena รามคำแหง 53": {
    en: "Launch Ceremony of GLP Flagship Arena Ramkhamhaeng 53",
    zh: "GLP旗舰竞技场Ramkhamhaeng 53启动仪式"
  },
  "8 ���าขา": {
    en: "8. Legs",
    zh: "8.腿"
  },
  "ศูนย์กีฬาอีสปอร์ตสาขาเรือธงมาตรฐานสากล รองรับเวทีแข่งขัน 5v5 สเปก RTX 4080 SUPER และจอ 360Hz": {
    en: "The international flagship e-sports center supports 5v5 arena, RTX 4080 super specs and 360Hz screen.",
    zh: "国际旗舰电子竞技中心支持5v5竞技场、RTX 4080超级规格和360Hz屏幕。"
  },
  "เปิดตัวระบบ Cloud Diskless & Franchise Model": {
    en: "Cloud Diskless & Franchise Model Launched",
    zh: "推出云无盘和特许经营模式"
  },
  "บุกเบิกระบบเซิร์ฟเวอร์แบบไร้ฮาร์ดดิสก์ความเร็ว 10Gbps พร้อมระบบควบคุมบัญชีและสต๊อกคลาวด์": {
    en: "Pioneering 10Gbps hard diskless server system with account control and stock cloud",
    zh: "具有帐户控制和股票云的先锋10Gbps无盘服务器系统"
  },
  "พัฒนาการสู่ Full Esport Arena มาตรฐานทัวร์นาเมนต์": {
    en: "Improvement to Full Esport Arena Tournament Standard",
    zh: "完整电子竞技场锦标赛标准的改进"
  },
  "การขยายตัวสู่เครือข่าย 8 สาขา และสมาชิกกว่า 52,000 คน": {
    en: "Expansion into a network of 8 branches and over 52,000 members",
    zh: "扩展到拥有8个分支机构和超过52,000名会员的网络"
  },
  "ปรับเปลี่ยนโครงสร้างร้านอินเทอร์เน็ตคาเฟ่เดิมสู่สนามประลองเกมพร้อมโซนสตรีมเมอร์และเวทีแข่งขัน": {
    en: "Transform your old internet cafe into a gaming arena with a streamer zone and arena.",
    zh: "将您的旧网吧改造成带有流媒体区和竞技场的游戏竞技场。"
  },
  "เชื่อมต่อโครงข่ายเคเบิลใยแก้วนำแสงความเร็วสูง 10Gbps พร้อมระบบเราเตอร์สำรอง Ping ต่ำกว่า 2ms": {
    en: "Connect 10Gbps high speed fiber optic cable network with ping backup router system under 2ms.",
    zh: "将10Gbps高速光缆网络连接到2ms以下的ping备用路由器系统。"
  },
  "ร่วมมือกับ NVIDIA Thailand ในการติดตั้งการ์ดจอ GeForce RTX 40 Series สำหรับสนามแข่งมาตรฐาน": {
    en: "Collaborate with NVIDIA Thailand to install GeForce RTX 40 Series graphics cards for standard racetracks.",
    zh: "与NVIDIA泰国合作，为标准赛道安装GeForce RTX 40系列显卡。"
  },
  "ชุดอุปกรณ์เมนบอร์ดและการ์ดจอ ASUS ROG มอบความเสถียรสูงสุดตลอดการแข่งขันยาวนาน 24 ชม.": {
    en: "The Asus Rog motherboard kit and graphics card provide maximum stability throughout the 24-hour race.",
    zh: "华硕ROG主板套件和显卡在24小时比赛中提供了最大的稳定性。"
  },
  "ติดตั้งเก้าอี้เกมมิ่งสรีรศาสตร์ Secretlab Titan Evo รองรับสรีระนักกีฬาอีสปอร์ตทุกตำแหน่งที่นั่ง": {
    en: "Equipped with a Secretlab Titan Evo ergonomic gaming chair to support esports athletes in all seating positions.",
    zh: "配备Secretlab Titan Evo符合人体工程学的游戏椅，为所有座位位置的电子竞技运动员提供支持。"
  },
  "ขยายสาขาครอบคลุมย่านสถาบันการศึกษาและศูนย์การค้า พร้อมให้บริการเกมเมอร์ตลอด 24 ชั่วโมง": {
    en: "Expand branches to cover neighborhoods, educational institutions, and shopping centers. Available for gamers 24 hours a day.",
    zh: "扩展分支机构，覆盖街区、教育机构和购物中心。全天候为游戏玩家提供服务。"
  },
  "ศูนย์ควบคุมกล้องวงจรปิด CCTV Full HD 24 ชม.": {
    en: "CCTV CCTV Full HD 24hrs Control Centre",
    zh: "闭路电视闭路电视全高清24小时控制中心"
  },
  "โซนปลอดบุหรี่ & ระบบอากาศ Clean Air Circulation": {
    en: "Non-Smoking Zone & Clean Air Circulation",
    zh: "禁烟区和清洁空气循环"
  },
  "ผ่านการตรวจเยี่ยมและรับรองมาตรฐานสถานประกอบกิจการตาม พ.ร.บ. ภาพยนตร์และวีดิทัศน์": {
    en: "Has passed the inspection and certification of the workplace according to the Film and Video Act.",
    zh: "已通过《电影和视频法》规定的工作场所检查和认证。"
  },
  "ระบบกล้องวงจรปิดครอบคลุมทุกจุดภายในและภายนอกร้าน จัดเก็บข้อมูลย้อนหลัง 30 วันเพื่อความปลอดภัยสูงสุด": {
    en: "CCTV systems cover all points inside and outside the data store for the past 30 days for maximum security.",
    zh: "闭路电视系统在过去30天内覆盖了数据存储区内外的所有点，以实现最大的安全性。"
  },
  "ตรวจรับรองมาตรฐานร้านเกมสีขาวจากหน่วยงานภาครัฐ": {
    en: "Certification of white game shop standards from government agencies",
    zh: "政府机构白色游戏店标准认证"
  },
  "แยกส่วน 3 ชิ้น ขนส่งสะดวก ประกอบหน้างานภายใน 20 นาที": {
    en: "Disassemble 3 parts, convenient transportation, assemble on site within 20 minutes.",
    zh: "拆卸3个零件，运输方便， 20分钟内现场组装。"
  },
  "ร้านเกมปลอดบุหรี่ 100% พร้อมระบบฟอกอากาศและระบายอากาศหมุนเวียนมาตรฐานสากล": {
    en: "100% smoke-free game shop with international standard air purification and ventilation system",
    zh: "100%无烟游戏店，配备国际标准的空气净化和通风系统"
  },
  "โต๊ะคอมพิวเตอร์เกมมิ่ง 2 ที่นั่ง GLP Double Station โครงเหล็กคาร์บอน": {
    en: "GLP Double Station 2 Seater Gaming Computer Table Carbon Steel Frame",
    zh: "GLP双工位2座博彩电脑桌碳钢框架"
  },
  "ระบบแคชเชียร์และพนักงานคัดกรองเวลาให้บริการเยาวชนอย่างเคร่งครัดตามกรอบกฎหมาย": {
    en: "The cashier system and staff screen youth service hours strictly according to the legal framework.",
    zh: "收银系统和工作人员严格按照法律框架筛选青少年服务时间。"
  },
  "การคัดกรองเวลาและดูแลเยาวชนตามกฎหมาย": {
    en: "Time screening and legal supervision of juveniles",
    zh: "对未成年人的时间筛选和法律监督"
  },
  "โต๊ะเกมมิ่งเหล็กคาร์บอนยาว 2.4 ม. พร้อมรางร้อยสายไฟและฉากกั้นกลาง": {
    en: "2.4m long carbon steel gaming table with wiring rails and a central partition",
    zh: "2.4米长碳钢游戏桌配有配线栏杆和中央隔断"
  },
  "7 - 10 วันทำการ": {
    en: "7 - 10 business days",
    zh: "7 - 10个工作日"
  },
  "G-Speed Pro Racing PU Leather (ปรับเอน 160°)": {
    en: "G-Speed Pro Racing PU Leather (160° lean)",
    zh: "G-Speed Pro Racing PU皮革（ 160°倾斜）"
  },
  "รับประกันโครงสร้าง 5 ปี และระบบไฟ 3 ปี On-site Service": {
    en: "5 year structure warranty and 3 year lighting system On-site Service",
    zh: "5年结构保修和3年照明系统上门服务"
  },
  "โครงเหล็กกล้าคาร์บอนพ่นสี Powder Coat + หน้าท็อป HPL กันน้ำและรอยขีดข่วน + รางร้อยสายไฟแยก High/Low Voltage": {
    en: "Carbon steel frame with powder coat paint + Water and scratch resistant HPL top + High/Low Voltage isolation trunking",
    zh: "碳钢框架，带粉末涂料+防水和防刮HPL顶部+高/低压隔离线槽"
  },
  "โต๊ะแถวยาว 4.8 ม. โครงสร้างเสาคานรับน้ำหนักพิเศษ ช่องเก็บสายไฟเมน": {
    en: "4.8m row table Column structure, extra load beam, main cable compartment",
    zh: "4.8米行表柱结构、额外载荷梁、主电缆舱"
  },
  "7 - 12 วันทำการ": {
    en: "7 - 12 business days",
    zh: "7 - 12个工作日"
  },
  "G-Speed Pro Racing PU Leather (พนักพิงปรับสรีระ)": {
    en: "G-Speed Pro Racing PU Leather",
    zh: "G-Speed Pro Racing PU皮革"
  },
  "โครงสร้างเสาคานคู่รับน้ำหนักพิเศษ แยกส่วนขนย้าย 4 แพ็กเกจ": {
    en: "Column structure, double beam, special load bearing, separated, transported in 4 packages",
    zh: "立柱结构，双梁，特殊承重，分离， 4包运输"
  },
  "แถวคอมพิวเตอร์เกมมิ่ง 4 ที่นั่ง GLP Quad Station แถวยาวมาตรฐาน": {
    en: "4 Seater Computer Gaming Row GLP Quad Station Standard Long Row",
    zh: "4座电脑Gaming Row GLP四站标准长排"
  },
  "เกาะคอมพิวเตอร์ 6 ที่นั่ง GLP Island 6 พร้อมเสาเดินสายไฟกลาง": {
    en: "6 seater computer island GLP Island 6 with central wiring pole",
    zh: "6座电脑岛GLP岛6带中央接线柱"
  },
  "G-Speed Pro Racing PU Leather (เก้าอี้เกมมิ่ง 6 ตัว)": {
    en: "G-Speed Pro Racing PU Leather (6 Gaming Chairs)",
    zh: "G-Speed Pro Racing PU皮革（ 6把游戏椅）"
  },
  "โครงสร้างเสาคานเหล็กรับน้ำหนักพิเศษ + หน้าท็อปโมดูลาร์ 4 ช่วงต่อไร้รอยสะดุด + ถาดซ่อนเราเตอร์ Gigabit LAN": {
    en: "Column structure, special load-bearing steel beam + modular top 4 seamless splices + Gigabit LAN router hidden tray",
    zh: "立柱结构，特殊承重钢梁+模块化顶部4个无缝接头+千兆局域网路由器隐藏托盘"
  },
  "โต๊ะเกาะกลาง 3x3 หันหลังชนกัน พร้อมกระดูกงูร้อยสายไฟและปลั๊กไฟ 6 จุด": {
    en: "3x3 center island table with back to back collision with keel and 6 power outlets",
    zh: "3x3中心岛桌，与龙骨和6个电源插座背靠背碰撞"
  },
  "เกาะกลาง 6 ที่นั่ง โครงสร้างสามเหลี่ยมค้ำยัน รองรับ 1,100 กก.": {
    en: "6-seater central island, triangular structure, support support 1,100 kg",
    zh: "6座中央岛，三角形结构，支撑1100公斤"
  },
  "10 - 14 วันทำการ": {
    en: "10 - 14 business days",
    zh: "10 - 14个工作日"
  },
  "ท็อปคู่หันหลังชนกันพร้อมเสากลางเดินท่อไฟและลมแอร์ + โครงเหล็กชุบกัลวาไนซ์ + แผงกั้นอะคริลิกตัดแสง RGB": {
    en: "Double rear-facing, colliding central pillars, light ducts and air-conditioning + galvanized steel frame + RGB cut-out acrylic partition",
    zh: "双后置、碰撞中心柱、灯管、空调+镀锌钢架+ RGB剪裁亚克力隔断"
  },
  "Size S: ชุมชนสปีด (64 ตร.ม.)": {
    en: "Size S: Speed Community (64 sq.m.)",
    zh: "Size S: 速度社区 (64平方米)"
  },
  "ขนาด 8x8 ม. เหมาะกับพื้นที่อาคารพาณิชย์ 2 คูหา รองรับ 20-26 เครื่อง คืนทุนเร็ว": {
    en: "Size 8x8 m. Suitable for 2-unit commercial shophouse, accommodates 20-26 PCs, fast ROI.",
    zh: "尺寸 8x8 米，适用于商业建筑空间，2台，可容纳20-26台机器，投资回报快。"
  },
  "Size M: มาตรฐานอารีนา (120 ตร.ม.)": {
    en: "Size M: Arena Standard (120 sq.m.)",
    zh: "Size M: 竞技场标准 (120 平方米)"
  },
  "ขนาด 12x10 ม. เหมาะกับอาคารเดี่ยวหรือในห้าง รองรับ 40-52 เครื่อง พร้อมห้อง VIP 1 ห้อง": {
    en: "Size 12x10 m. Suitable for standalone building or mall, supports 40-52 PCs with 1 VIP room.",
    zh: "尺寸 12x10 米。适合单体建筑或购物中心，支持40-52台机器，1个VIP室。"
  },
  "Size L: แฟลกชิปอีสปอร์ตเซ็นเตอร์ (216 ตร.ม.)": {
    en: "Size L: Flagship Esports Center (216 sq.m.)",
    zh: "Size L: 旗舰电竞中心 (216 平方米)"
  },
  "ขนาด 18x12 ม. อารีนาเต็มรูปแบบ รองรับ 70-90+ เครื่อง พร้อมเวทีแข่งขัน 5v5 และ 2 VIP Rooms": {
    en: "Size 18x12 m. Full-scale arena, accommodates 70-90+ PCs with 5v5 battle stage and 2 VIP Rooms.",
    zh: "尺寸 18x12 米。完整的竞技场，可容纳 70-90 台以上机器，设有 5v5 比赛舞台和 2 个 VIP 室。"
  },
  "โทนขาว-น้ำเงิน มาตรฐานแบรนด์ GLP สว่าง สบายตา ทันสมัย": {
    en: "White-blue GLP signature brand palette, bright, comfortable and modern",
    zh: "白蓝 GLP 经典品牌色调，明亮舒适、科技现代"
  },
  "โทนขาว-เทาอ่อน ไฟ Warm White สะอาดตา หรูหรา เรียบหรู": {
    en: "White and soft grey tones with warm white lighting, pristine and understated luxury",
    zh: "白浅灰暖白光，清爽雅致，高端轻奢"
  },
  "ดำ-กราไฟต์ ดุดัน ไฟ Linear สีเดียว สไตล์นักกีฬา Pro Circuit": {
    en: "Black graphite aggressive aesthetic, monochromatic linear accent lights, built for pro esports athletes",
    zh: "黑石墨色调硬核冷峻，单色线性氛围灯，专为职业电竞打造"
  },
  "50,000 บาท + ถ้วยรางวัลเกียรติยศ": {
    en: "50,000 THB + Trophy of Honor",
    zh: "50,000 泰铢 + 荣誉奖杯"
  },
  "ถ้วยรางวัลเกียรติยศ": {
    en: "Trophy of Honor",
    zh: "荣誉奖杯"
  },
  "64 ทีม (เต็มแล้ว)": {
    en: "64 Teams (Full)",
    zh: "64 支战队 (名额已满)"
  },
  "(เต็มแล้ว)": {
    en: "(Full)",
    zh: "(名额已满)"
  },
  "เต็มแล้ว": {
    en: "Full",
    zh: "名额已满"
  },
  "กำลังโหลดข้อมูลระบบ...": {
    en: "Loading system data...",
    zh: "正在加载系统数据..."
  },
  "G-Speed Esport Arena System": {
    en: "G-Speed Esport Arena System",
    zh: "G-Speed 电竞馆智能管理系统"
  },
  "10-12 ตุลาคม 2026": {
    en: "October 10-12, 2026",
    zh: "2026年10月10-12日"
  },
  "13:00 - 19:00 น.": {
    en: "13:00 - 19:00",
    zh: "13:00 - 19:00"
  },
  "10-12 ตุลาคม 2026 (13:00 - 19:00 น.)": {
    en: "October 10-12, 2026 (13:00 - 19:00)",
    zh: "2026年10月10-12日 (13:00 - 19:00)"
  },
  "28-30 กันยายน 2026": {
    en: "September 28-30, 2026",
    zh: "2026年9月28-30日"
  },
  "100,000 บาท": {
    en: "100,000 THB",
    zh: "100,000 泰铢"
  },
  "150,000 บาท": {
    en: "150,000 THB",
    zh: "150,000 泰铢"
  },
  "ห้องวีไอพีส่วนตัว 5 ที่นั่ง VIP Private Suite กระจกเก็บเสียง": {
    en: "5-Seat Private VIP Suite with Soundproof Glass",
    zh: "5座私人VIP独立套房（双层隔音玻璃）"
  },
  "เวทีแข่งขันอีสปอร์ต 5v5 Tournament Stage 10 ที่นั่ง": {
    en: "5v5 Esports Tournament Stage (10 Seats)",
    zh: "5v5 职业电竞对战舞台（10座）"
  },
  "เคาน์เตอร์แคชเชียร์และต้อนรับ GLP Reception Counter": {
    en: "GLP Reception & Cashier Counter",
    zh: "GLP 品牌前台收银与接待柜台"
  },
};

export function useTranslation() {
  return useContext(LanguageContext);
}
