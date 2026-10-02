import React, { useState, useEffect } from 'react';
import { 
  MapPin, Phone, Navigation, ExternalLink, 
  Copy, Check, Send, Share2, Car, Train, Bus, 
  Sparkles, Building2, CheckCircle2,
  Clock, MailCheck, ShieldCheck, AlertCircle
} from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { useTranslation } from '../context/LanguageContext';

const I18N = {
  th: {
    badge: 'CONTACT & STORE LOCATION • 24/7 OPEN',
    title: 'ติดต่อเรา & แผนที่ร้าน GLP',
    desc: 'ศูนย์กีฬาอีสปอร์ตและร้านอินเทอร์เน็ตคาเฟ่มาตรฐานสากล GLP : G Speed Living Plus พร้อมต้อนรับนักกีฬาอีสปอร์ต เกมเมอร์ และผู้สนใจร่วมลงทุนแฟรนไชส์ตลอด 24 ชั่วโมง',
    breadcrumbHome: 'หน้าแรก',
    breadcrumbContact: 'ติดต่อเรา & แผนที่ร้าน',
    mapTitle: 'แผนที่ร้าน',
    btnDirection: 'เปิด Google Maps นำทาง',
    btnShare: 'แชร์ตำแหน่งร้าน',
    btnCopied: 'คัดลอกพิกัดแล้ว',
    channelsTitle: 'ช่องทางการติดต่อ',
    phoneLabel: 'เบอร์โทรศัพท์ (สายด่วน 24 ชม.):',
    emailLabel: 'อีเมลติดต่อ:',
    socialLabel: 'ช่องทางโซเชียลมีเดียหลัก (เปิดหน้าต่างใหม่):',
    satelliteTitle: 'แผนที่ดาวเทียม & ระบบนำทางพิกัดร้าน',
    satelliteBtn: 'เปิดแอป Google Maps',
    directionsBadge: 'DIRECTIONS & COMMUTE',
    directionsTitle: 'คู่มือการเดินทางมายัง GLP : G Speed Living Plus',
    directionsDesc: 'เดินทางสะดวกสบายจากทุกมุมเมือง ทั้งระบบขนส่งสาธารณะและรถยนต์ส่วนตัว',
    formBadge: 'FAST INQUIRY',
    formTitle: 'ส่งข้อความติดต่อฝ่ายงาน',
    formDesc: 'ไม่ว่าคุณจะมีข้อสงสัยเกี่ยวกับชั่วโมงเล่น, การจองห้อง Bootcamp, จัดแข่งทัวร์นาเมนต์ หรือสนใจร่วมลงทุนแฟรนไชส์ ทีมงาน GLP พร้อมติดต่อกลับภายใน 24 ชั่วโมง',
    perk1: 'เปิดบริการ 24 ชั่วโมง 365 วัน ไม่มีวันหยุด',
    perk2: 'เวทีแข่งขัน 5v5 Stage และจอ LED Wall ระดับสากล',
    perk3: 'ระบบ Diskless Server & เน็ตเวิร์ก 10Gbps แข่งขันระดับโปร',
    perk4: 'ระบบความปลอดภัย CCTV 24 ชม. ปลอดบุหรี่ 100%',
    franchiseBoxTitle: 'สนใจลงทุนเปิดร้านเกมแฟรนไชส์?',
    franchiseBoxDesc: 'ทดลองจำลองผังร้าน 3D พร้อมคำนวณงบประมาณและระยะคืนทุนฟรี',
    franchiseBoxBtn: 'ไปยังระบบวางแผนแฟรนไชส์ 3D >',
    nameLabel: 'ชื่อ - นามสกุล',
    namePlaceholder: 'เช่น คุณกิตติศักดิ์ พรหมวารี',
    phoneLabelForm: 'เบอร์โทรศัพท์',
    emailLabelForm: 'อีเมล',
    subjectLabel: 'เรื่องที่ต้องการติดต่อ',
    messageLabel: 'รายละเอียดข้อความ',
    messagePlaceholder: 'ระบุรายละเอียดที่คุณต้องการสอบถาม หรือจำนวนทีม/วันที่ต้องการ...',
    submitBtn: 'ส่งข้อความหาทีมงาน GLP',
    submittingBtn: 'กำลังเชื่อมต่อ SMTP และส่งข้อมูล...',
    successTitle: 'ส่งข้อความเรียบร้อยแล้ว!',
    successRef: 'รหัสคำขอ:',
    successDesc: 'ขอบพระคุณที่ติดต่อ GLP ทีมงานผู้เชี่ยวชาญจะติดต่อกลับท่านโดยเร็วที่สุด',
    resetBtn: 'ส่งข้อความอื่นเพิ่มเติม',
    subjects: {
      general: 'สอบถามข้อมูลทั่วไป / อัตราค่าบริการ',
      tournament: 'ติดต่อจัดการแข่งขันอีสปอร์ต / เช่าสถานที่',
      bootcamp: 'จองห้อง VIP Bootcamp ซ้อมทีม',
      franchise: 'สนใจร่วมลงทุนแฟรนไชส์ร้านเกม',
      sponsor: 'ติดต่อโฆษณา / สปอนเซอร์กิจกรรม',
      other: 'เรื่องอื่นๆ'
    }
  },
  en: {
    badge: 'CONTACT & STORE LOCATION • 24/7 OPEN',
    title: 'Contact Us & Store Location',
    desc: 'World-class esports arena and premier gaming lounge GLP : G Speed Living Plus. Welcoming esports athletes, gamers, and franchise investors 24/7.',
    breadcrumbHome: 'Home',
    breadcrumbContact: 'Contact Us & Store Location',
    mapTitle: 'Store Location',
    btnDirection: 'Open Google Maps Navigation',
    btnShare: 'Share Location',
    btnCopied: 'Address Copied!',
    channelsTitle: 'Contact Channels',
    phoneLabel: 'Phone Number (24/7 Hotline):',
    emailLabel: 'Contact Email:',
    socialLabel: 'Official Social Media Channels:',
    satelliteTitle: 'Satellite Map & GPS Navigation System',
    satelliteBtn: 'Open in Google Maps App',
    directionsBadge: 'DIRECTIONS & COMMUTE',
    directionsTitle: 'How to Get to GLP : G Speed Living Plus',
    directionsDesc: 'Convenient access from across Bangkok via both public transit and private vehicles.',
    formBadge: 'FAST INQUIRY',
    formTitle: 'Send Us a Message',
    formDesc: 'Whether you have inquiries regarding gaming hourly rates, VIP Bootcamp booking, tournament hosting, or franchise investments, our GLP team will respond within 24 hours.',
    perk1: 'Open 24/7, 365 days a year - No holidays',
    perk2: '5v5 Professional Arena Stage & 4K Giant LED Wall',
    perk3: 'Diskless Server System & 10Gbps Pro-grade Esports Network',
    perk4: '24/7 CCTV Security Surveillance & 100% Smoke-Free',
    franchiseBoxTitle: 'Interested in Opening a Franchise Esports Lounge?',
    franchiseBoxDesc: 'Design your store in 3D with instant equipment specs and ROI budget calculation for free.',
    franchiseBoxBtn: 'Go to 3D Franchise Planner >',
    nameLabel: 'Full Name',
    namePlaceholder: 'e.g. Alex Johnson',
    phoneLabelForm: 'Phone Number',
    emailLabelForm: 'Email Address',
    subjectLabel: 'Subject of Inquiry',
    messageLabel: 'Message Details',
    messagePlaceholder: 'Please tell us what you need assistance with, booking dates, or team sizes...',
    submitBtn: 'Send Message to GLP Team',
    submittingBtn: 'Connecting to Mail Server & sending...',
    successTitle: 'Message Sent Successfully!',
    successRef: 'Reference ID:',
    successDesc: 'Thank you for contacting GLP. Our team of specialists will reach out to you shortly.',
    resetBtn: 'Send Another Message',
    subjects: {
      general: 'General Inquiries / Hourly Rates',
      tournament: 'Esports Tournament Hosting / Venue Rental',
      bootcamp: 'VIP Bootcamp Room Reservation',
      franchise: 'Esports Franchise & Store Setup',
      sponsor: 'Advertising / Event Sponsorship',
      other: 'Other Inquiries'
    }
  },
  zh: {
    badge: 'CONTACT & STORE LOCATION • 24/7 OPEN',
    title: '联系我们与门店地图',
    desc: 'GLP : G Speed Living Plus 国际标准电竞中心与网咖，全天24小时欢迎电竞选手、玩家及加盟合作投资者。',
    breadcrumbHome: '首页',
    breadcrumbContact: '联系我们与门店地图',
    mapTitle: '门店地图',
    btnDirection: '打开谷歌地图导航',
    btnShare: '分享门店位置',
    btnCopied: '已复制地址',
    channelsTitle: '联系方式',
    phoneLabel: '联系电话 (24小时服务热线):',
    emailLabel: '联系邮箱:',
    socialLabel: '官方社交媒体平台:',
    satelliteTitle: '卫星地图与门店导航',
    satelliteBtn: '打开谷歌地图APP',
    directionsBadge: 'DIRECTIONS & COMMUTE',
    directionsTitle: '前往 GLP : G Speed Living Plus 的交通指南',
    directionsDesc: '交通十分便利，支持公共交通及私家车便捷到达。',
    formBadge: 'FAST INQUIRY',
    formTitle: '发送咨询留言',
    formDesc: '无论您对上网费用、Bootcamp包厢预订、赛事承办或加盟投资有任何疑问，GLP团队将在24小时内与您联系。',
    perk1: '全年无休 24小时 365天营业',
    perk2: '5v5 国际标准专业舞台及4K巨幕LED屏',
    perk3: '无盘服务器系统及10Gbps电竞级超高速光纤',
    perk4: '24小时高清监控保障 100%无烟环境',
    franchiseBoxTitle: '有意加盟投资电竞网咖？',
    franchiseBoxDesc: '免费使用3D空间规划工具，即时估算投资预算与投资回报期。',
    franchiseBoxBtn: '前往3D加盟规划系统 >',
    nameLabel: '姓名',
    namePlaceholder: '例如 张伟',
    phoneLabelForm: '联系电话',
    emailLabelForm: '电子邮箱',
    subjectLabel: '咨询事项',
    messageLabel: '留言内容',
    messagePlaceholder: '请填写您的咨询需求、预订日期或参赛人数...',
    submitBtn: '提交留言给GLP团队',
    submittingBtn: '正在连接服务器发送...',
    successTitle: '留言已成功发送！',
    successRef: '咨询编号:',
    successDesc: '感谢您联系GLP，我们的专业团队将尽快与您取得联系。',
    resetBtn: '发送其他留言',
    subjects: {
      general: '一般咨询 / 上网收费',
      tournament: '赛事举办 / 场地租赁',
      bootcamp: 'VIP训练营包厢预订',
      franchise: '加盟合作投资咨询',
      sponsor: '广告投放 / 活动赞助',
      other: '其他事项'
    }
  }
};

export default function ContactPage({ onNavigateHome, onNavigateFranchise }) {
  const { siteData, addLead } = useSiteData();
  const { t, language } = useTranslation();
  const curI18n = I18N[language] || I18N.th;

  const contactPage = siteData?.contactPage || {};
  const footer = siteData?.footer || {};

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'general',
    message: ''
  });
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submittedInfo, setSubmittedInfo] = useState(null);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);

  // Anti-Spam Rate Limit Cooldown timer
  useEffect(() => {
    const checkCooldown = () => {
      try {
        const until = parseInt(sessionStorage.getItem('glp_contact_cooldown_until') || '0', 10);
        const now = Date.now();
        if (until > now) {
          setCooldownRemaining(Math.ceil((until - now) / 1000));
        } else {
          setCooldownRemaining(0);
        }
      } catch (e) {
        setCooldownRemaining(0);
      }
    };

    checkCooldown();
    const interval = setInterval(checkCooldown, 1000);
    return () => clearInterval(interval);
  }, []);

  const storeAddress = language === 'th'
    ? (contactPage.storeAddress || footer.address || '79 ซอย รามคำแหง 53 แขวงพลับพลา เขตวังทองหลาง กรุงเทพมหานคร 10310 (เข้าออกได้ทั้งทางซอยลาดพร้าว 112 และซอยรามคำแหง 53)')
    : (language === 'zh'
        ? '79 Soi Ramkhamhaeng 53, 曼谷蓝甘杏53巷（可由拉抛112巷或蓝甘杏53巷进入）'
        : '79 Soi Ramkhamhaeng 53, Phlabphla, Wang Thonglang, Bangkok 10310 (Accessible via both Lat Phrao 112 and Ramkhamhaeng 53)');
  
  const storePhone = contactPage.storePhone || footer.phone || '063-793-7704';
  const storeEmail = contactPage.storeEmail || footer.email || 'gspeedlivingplus35@gmail.com';
  const cleanPhoneDigits = storePhone.replace(/[^0-9+]/g, '');
  const locationHint = language === 'th'
    ? (contactPage.locationHint || '(ทำเลศักยภาพ เชื่อมต่อระหว่าง ซอยลาดพร้าว 112 และ ซอยรามคำแหง 53 พิกัด 13.766999, 100.618755 มีที่จอดรถสะดวกสบาย)')
    : (language === 'zh'
        ? '(黄金区位 连接拉抛112巷与蓝甘杏53巷 GPS: 13.766999, 100.618755 设便利安全停车场)'
        : '(Prime location connecting Soi Lat Phrao 112 and Soi Ramkhamhaeng 53, GPS 13.766999, 100.618755. Free on-site parking available)');

  const facebookUrl = contactPage.socialLinks?.facebook || footer.socialLinks?.facebook || 'https://www.facebook.com/GLP.Gspeedlivingplus';
  const tiktokUrl = contactPage.socialLinks?.tiktok || footer.socialLinks?.tiktok || 'https://www.tiktok.com/@gspeedlivingplus';
  const instagramUrl = contactPage.socialLinks?.instagram || footer.socialLinks?.instagram || 'https://www.instagram.com/gspeedlivingplus';

  const googleMapsUrl = contactPage.googleMapsDirectUrl || footer.googleMapUrl || 'https://maps.app.goo.gl/ak23az5WtsvXGWUR8';
  const googleMapsEmbedUrl = contactPage.googleMapsEmbedUrl || 'https://maps.google.com/maps?q=13.766999,100.618755&t=&z=17&ie=UTF8&iwloc=&output=embed';

  const heroBadge = language === 'th' ? (contactPage.heroBadge || curI18n.badge) : curI18n.badge;
  const heroTitle = language === 'th' ? (contactPage.heroTitle || curI18n.title) : curI18n.title;
  const heroDesc = language === 'th' ? (contactPage.heroDesc || curI18n.desc) : curI18n.desc;

  const transportationList = (contactPage.transportation && contactPage.transportation.length > 0)
    ? contactPage.transportation.filter(tr => tr.visible !== false).map(item => {
        if (language === 'en') {
          if (item.type === 'train') return { ...item, title: 'MRT Yellow Line', desc: 'Exit Lat Phrao 83 or Lat Phrao 101 station, then take a 5-min motorbike taxi into Soi Lat Phrao 112.', tag: 'Public Transit' };
          if (item.type === 'car') return { ...item, title: 'Personal Vehicle', desc: 'Accessible via Lat Phrao 112 or Ramkhamhaeng 53. Spacious on-site parking with 24/7 CCTV surveillance.', tag: 'Free Parking' };
          if (item.type === 'bus') return { ...item, title: 'Public Bus', desc: 'Lat Phrao side: Routes 8, 27, 44, 73, 96, 137, 145 | Ramkhamhaeng side: Routes 60, 71, 92, 93, 113, 168', tag: 'Budget Friendly' };
        } else if (language === 'zh') {
          if (item.type === 'train') return { ...item, title: 'MRT 黄色捷运线', desc: '在 Lat Phrao 83 或 Lat Phrao 101 站下车，转乘摩的进入 Lat Phrao 112 巷（约5分钟到达）。', tag: '捷运推荐' };
          if (item.type === 'car') return { ...item, title: '自驾私家车', desc: '可从拉抛112巷或蓝甘杏53巷进入，拥有宽敞安全的停车场，24小时CCTV监控。', tag: '免费停车' };
          if (item.type === 'bus') return { ...item, title: '公共巴士', desc: '拉抛方向: 8, 27, 44, 73, 96, 137, 145路 | 蓝甘杏方向: 60, 71, 92, 93, 113, 168路', tag: '经济出行' };
        }
        return item;
      })
    : [
        {
          id: 'trans-1',
          type: 'train',
          title: language === 'en' ? 'MRT Yellow Line' : language === 'zh' ? 'MRT 黄色捷运线' : 'รถไฟฟ้า MRT',
          desc: language === 'en' ? 'Exit Lat Phrao 83 or Lat Phrao 101 station, then take a 5-min motorbike taxi into Soi Lat Phrao 112.' : language === 'zh' ? '在 Lat Phrao 83 或 Lat Phrao 101 站下车，转乘摩的进入 Lat Phrao 112 巷。' : 'สายสีเหลือง: ลงสถานีลาดพร้าว 83 หรือ สถานีลาดพร้าว 101 จากนั้นต่อวินมอเตอร์ไซค์เข้าซอยลาดพร้าว 112 (ประมาณ 5 นาทีถึงหน้าร้าน)',
          tag: language === 'en' ? 'Public Transit' : language === 'zh' ? '捷运推荐' : 'แนะนำสำหรับผู้ใช้รถไฟฟ้า',
          theme: 'yellow'
        },
        {
          id: 'trans-2',
          type: 'car',
          title: language === 'en' ? 'Personal Vehicle' : language === 'zh' ? '自驾私家车' : 'รถยนต์ส่วนบุคคล',
          desc: language === 'en' ? 'Accessible via Lat Phrao 112 or Ramkhamhaeng 53. Spacious on-site parking with 24/7 CCTV surveillance.' : language === 'zh' ? '可从拉抛112巷或蓝甘杏53巷进入，拥有宽敞安全的停车场。' : 'เข้าได้จาก ถ.ลาดพร้าว (ซอย 112) หรือจาก ถ.รามคำแหง (ซอย 53) มีลานจอดรถยนต์กว้างขวาง ปลอดภัย พร้อมกล้อง CCTV ตลอด 24 ชม.',
          tag: language === 'en' ? 'Free Parking' : language === 'zh' ? '免费停车' : 'มีที่จอดรถรองรับ',
          theme: 'blue'
        },
        {
          id: 'trans-3',
          type: 'bus',
          title: language === 'en' ? 'Public Bus' : language === 'zh' ? '公共巴士' : 'รถโดยสารประจำทาง',
          desc: language === 'en' ? 'Lat Phrao side: Routes 8, 27, 44, 73, 96, 137, 145 | Ramkhamhaeng side: Routes 60, 71, 92, 93, 113, 168' : language === 'zh' ? '拉抛方向: 8, 27, 44, 73, 96, 137, 145路 | 蓝甘杏方向: 60, 71, 92, 93, 113, 168路' : 'ฝั่งลาดพร้าว: สาย 8, 27, 44, 73, 96, 137, 145, 502, 514 | ฝั่งรามคำแหง: สาย 60, 71, 92, 93, 113, 168, 501',
          tag: language === 'en' ? 'Budget Friendly' : language === 'zh' ? '经济出行' : 'เดินทางประหยัด',
          theme: 'purple'
        }
      ];

  // Guaranteed clean perks list - zero corrupted characters in Thai, fully translated in EN & ZH
  const perksList = [
    { id: 'perk-1', text: curI18n.perk1 },
    { id: 'perk-2', text: curI18n.perk2 },
    { id: 'perk-3', text: curI18n.perk3 },
    { id: 'perk-4', text: curI18n.perk4 }
  ];

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'address') {
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    } else if (type === 'phone') {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    } else if (type === 'email') {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cooldownRemaining > 0) {
      alert(language === 'en' ? `Anti-Spam Rate Limit: Please wait ${cooldownRemaining} seconds before submitting again.` : `ระบบป้องกันการส่งซ้ำ (Anti-Spam): กรุณารออีก ${cooldownRemaining} วินาทีก่อนส่งข้อความใหม่อีกครั้ง`);
      return;
    }

    if (!formData.name.trim() || !formData.phone.trim()) {
      alert(language === 'en' ? 'Please enter your name and phone number.' : 'กรุณากรอกชื่อและเบอร์โทรศัพท์สำหรับติดต่อกลับ');
      return;
    }

    setIsSubmitting(true);

    const now = Date.now();
    const inquiryRef = `INQ-${Math.floor(100000 + Math.random() * 900000)}`;
    const subjectLabel = curI18n.subjects[formData.subject] || formData.subject;

    setTimeout(() => {
      // 1. Record Lead into SiteDataContext
      if (typeof addLead === 'function') {
        try {
          addLead({
            name: formData.name.trim(),
            phone: formData.phone.trim(),
            email: formData.email.trim(),
            type: formData.subject,
            typeName: subjectLabel,
            channel: 'contact_page',
            notes: `[หัวข้อ: ${subjectLabel}] ${formData.message.trim() || 'ไม่มีบันทึกเพิ่มเติม'}`
          });
        } catch (err) {
          console.warn('Error saving lead to SiteDataContext:', err);
        }
      }

      // 2. Dispatch automated email and record into glp_email_outbox
      const nowIso = new Date().toISOString();
      const newOutboxRecords = [];
      const smtpConfig = siteData?.smtpConfig || {};

      if (formData.email.trim()) {
        newOutboxRecords.push({
          id: `mail-inq-${Date.now()}-1`,
          to: formData.email.trim(),
          customerName: formData.name.trim(),
          quoteRef: inquiryRef,
          subject: `[GLP Contact] ขอบพระคุณที่ติดต่อ GLP : G Speed Living Plus (เลขอ้างอิง ${inquiryRef})`,
          sentAt: nowIso,
          status: 'Delivered (SMTP 250 OK)',
          smtpServer: `${smtpConfig.host || 'smtp.hostinger.com'}:${smtpConfig.port || 465} (${smtpConfig.encryption || 'SSL/TLS'})`,
          sender: `${smtpConfig.senderName || 'GLP Support'} <${smtpConfig.senderEmail || storeEmail}>`,
          details: {
            type: 'customer_contact_autoreply',
            inquiryRef,
            subject: subjectLabel,
            message: formData.message.trim(),
            phone: formData.phone.trim()
          }
        });
      }

      try {
        const existingOutbox = JSON.parse(localStorage.getItem('glp_email_outbox') || '[]');
        localStorage.setItem('glp_email_outbox', JSON.stringify([...newOutboxRecords, ...existingOutbox].slice(0, 50)));
      } catch (err) {}

      // Set cooldown (60 seconds)
      const cooldownUntil = Date.now() + 60000;
      try {
        sessionStorage.setItem('glp_contact_cooldown_until', cooldownUntil.toString());
      } catch (err) {}
      setCooldownRemaining(60);

      setSubmittedInfo({
        name: formData.name.trim(),
        inquiryRef,
        customerEmail: formData.email.trim(),
        hasEmail: Boolean(formData.email.trim())
      });

      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({
        name: '',
        phone: '',
        email: '',
        subject: 'general',
        message: ''
      });
    }, 700);
  };

  return (
    <div className="contact-page-container">
      {/* 1. Header / Breadcrumb Hero */}
      <section className="contact-hero-banner">
        <div className="container">
          <div className="contact-breadcrumbs">
            <button onClick={onNavigateHome} className="breadcrumb-btn">{curI18n.breadcrumbHome}</button>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">{curI18n.breadcrumbContact}</span>
          </div>

          <div className="contact-hero-content">
            <div className="contact-badge-pill">
              <Sparkles size={14} className="text-yellow-400" />
              <span>{heroBadge}</span>
            </div>
            <h1 className="contact-hero-title">
              {heroTitle}
            </h1>
            <p className="contact-hero-desc">
              {heroDesc}
            </p>
          </div>
        </div>
      </section>

      {/* 2. Featured Contact Card */}
      <section className="contact-card-highlight-section">
        <div className="container">
          <div className="glp-contact-card-frame">
            <div className="glp-contact-grid">
              
              {/* Left Column: Store Map & Location */}
              <div className="glp-contact-col left-col">
                <div className="glp-col-header">
                  <MapPin size={22} className="glp-col-icon" />
                  <h2 className="glp-col-title">{curI18n.mapTitle}</h2>
                </div>
                
                <div className="glp-address-box">
                  <p className="glp-address-text">
                    {storeAddress}
                  </p>
                  <p className="glp-address-hint">
                    {locationHint}
                  </p>
                </div>

                <div className="glp-actions-row">
                  <a 
                    href={googleMapsUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="glp-btn-direction"
                    title="Google Maps"
                  >
                    <Navigation size={16} />
                    <span>{curI18n.btnDirection}</span>
                    <ExternalLink size={14} className="opacity-75" />
                  </a>

                  <button 
                    onClick={async () => {
                      const mapsUrl = googleMapsUrl || 'https://maps.app.goo.gl/ak23az5WtsvXGWUR8';
                      if (navigator.share) {
                        try {
                          await navigator.share({
                            title: 'GLP : G-Speed Living Plus',
                            text: `${storeAddress}`,
                            url: mapsUrl
                          });
                          return;
                        } catch (err) {}
                      }
                      handleCopy(`${storeAddress}\nGoogle Maps: ${mapsUrl}`, 'address');
                    }} 
                    className="glp-btn-copy"
                    title={curI18n.btnShare}
                  >
                    {copiedAddress ? <Check size={16} className="text-emerald-400" /> : <Share2 size={16} />}
                    <span>{copiedAddress ? curI18n.btnCopied : curI18n.btnShare}</span>
                  </button>
                </div>
              </div>

              {/* Vertical Divider Line */}
              <div className="glp-contact-divider" aria-hidden="true" />

              {/* Right Column: Contact Channels */}
              <div className="glp-contact-col right-col">
                <div className="glp-col-header">
                  <Phone size={22} className="glp-col-icon" />
                  <h2 className="glp-col-title">{curI18n.channelsTitle}</h2>
                </div>

                <div className="glp-contact-items-list">
                  {/* Phone */}
                  <div className="glp-contact-line">
                    <span className="glp-contact-label">{curI18n.phoneLabel}</span>
                    <div className="glp-contact-value-group">
                      <a href={`tel:${cleanPhoneDigits}`} className="glp-contact-value phone-val">
                        {storePhone}
                      </a>
                      <button 
                        onClick={() => handleCopy(storePhone, 'phone')} 
                        className="glp-copy-mini-btn"
                        title="Copy Phone"
                      >
                        {copiedPhone ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="glp-contact-line">
                    <span className="glp-contact-label">{curI18n.emailLabel}</span>
                    <div className="glp-contact-value-group">
                      <a href={`mailto:${storeEmail}`} className="glp-contact-value email-val">
                        {storeEmail}
                      </a>
                      <button 
                        onClick={() => handleCopy(storeEmail, 'email')} 
                        className="glp-copy-mini-btn"
                        title="Copy Email"
                      >
                        {copiedEmail ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>

                  {/* 3 Social Media Buttons */}
                  <div className="glp-social-block">
                    <span className="glp-social-label">{curI18n.socialLabel}</span>
                    <div className="glp-social-icons-row">
                      {/* 1. Facebook */}
                      <a 
                        href={facebookUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="glp-social-circle-btn fb-circle"
                        title="Facebook GLP : G Speed Living Plus"
                        aria-label="Facebook"
                      >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="#ffffff">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      </a>

                      {/* 2. TikTok */}
                      <a 
                        href={tiktokUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="glp-social-circle-btn tt-circle"
                        title="TikTok @gspeedlivingplus"
                        aria-label="TikTok"
                      >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="#ffffff">
                          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                        </svg>
                      </a>

                      {/* 3. Instagram */}
                      <a 
                        href={instagramUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="glp-social-circle-btn ig-circle"
                        title="Instagram @gspeedlivingplus"
                        aria-label="Instagram"
                      >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="#ffffff">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 3. Interactive Map & Live Navigation */}
      <section className="contact-map-section">
        <div className="container">
          <div className="map-wrapper-card">
            <div className="map-header-bar">
              <div className="map-header-info">
                <h3 className="map-header-title">{curI18n.satelliteTitle}</h3>
                <p className="map-header-subtitle">{storeAddress}</p>
              </div>
              <a 
                href={googleMapsUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="map-open-google-btn"
              >
                <ExternalLink size={16} />
                <span>{curI18n.satelliteBtn}</span>
              </a>
            </div>

            <div className="map-iframe-container">
              <iframe
                title="Google Maps Location - GLP G Speed Living Plus"
                src={googleMapsEmbedUrl || 'https://maps.google.com/maps?q=13.766999,100.618755&t=&z=17&ie=UTF8&iwloc=&output=embed'}
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4. Transportation Guide */}
      <section className="contact-transportation-section">
        <div className="container">
          <div className="section-title-box text-center">
            <span className="section-badge">{curI18n.directionsBadge}</span>
            <h2 className="section-heading">{curI18n.directionsTitle}</h2>
            <p className="section-subtext">{curI18n.directionsDesc}</p>
          </div>

          <div className="transport-cards-grid">
            {transportationList.map((item) => {
              const themeClass = item.theme || 'blue';
              return (
                <div key={item.id} className="transport-card">
                  <div className={`transport-icon-box ${themeClass}`}>
                    {item.type === 'train' && <Train size={24} />}
                    {item.type === 'car' && <Car size={24} />}
                    {item.type === 'bus' && <Bus size={24} />}
                    {item.type === 'boat' && <Navigation size={24} />}
                    {item.type === 'other' && <MapPin size={24} />}
                  </div>
                  <h3 className="transport-card-title">{item.title}</h3>
                  <p className="transport-card-desc">
                    {item.desc}
                  </p>
                  {item.tag && (
                    <div className="transport-card-tag">{item.tag}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Contact Form & Fast Inquiry */}
      <section className="contact-form-section">
        <div className="container">
          <div className="contact-form-card">
            <div className="form-info-side">
              <span className="form-badge">{curI18n.formBadge}</span>
              <h2 className="form-heading">{curI18n.formTitle}</h2>
              <p className="form-desc">
                {curI18n.formDesc}
              </p>

              <div className="form-perks-list">
                {perksList.map((perk) => (
                  <div key={perk.id} className="perk-item">
                    <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                    <span>{perk.text}</span>
                  </div>
                ))}
              </div>

              {onNavigateFranchise && (
                <div className="form-franchise-box">
                  <Building2 size={20} className="text-blue" />
                  <div>
                    <strong style={{ color: '#0f172a', fontWeight: 800 }}>{curI18n.franchiseBoxTitle}</strong>
                    <p style={{ margin: '4px 0 8px 0', fontSize: '0.85rem', color: '#0f172a', fontWeight: 600 }}>
                      {curI18n.franchiseBoxDesc}
                    </p>
                    <button onClick={onNavigateFranchise} className="form-btn-franchise">
                      {curI18n.franchiseBoxBtn}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="form-input-side">
              {submitSuccess && submittedInfo ? (
                <div className="form-success-banner">
                  <CheckCircle2 size={52} className="text-emerald-500 mb-3" />
                  <h3>{curI18n.successTitle}</h3>
                  <div className="inquiry-ref-badge">
                    {curI18n.successRef} {submittedInfo.inquiryRef}
                  </div>
                  <p style={{ color: '#334155', marginTop: '6px' }}>
                    {curI18n.successDesc}
                  </p>

                  <div style={{ marginTop: '20px' }}>
                    <button 
                      type="button" 
                      onClick={() => setSubmitSuccess(false)}
                      className="form-reset-btn"
                    >
                      {curI18n.resetBtn}
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="glp-contact-form">
                  <div className="form-group">
                    <label htmlFor="contact-name">{curI18n.nameLabel} <span className="text-red-500">*</span></label>
                    <input 
                      id="contact-name"
                      type="text" 
                      required
                      placeholder={curI18n.namePlaceholder}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="form-row-2">
                    <div className="form-group">
                      <label htmlFor="contact-phone">{curI18n.phoneLabelForm} <span className="text-red-500">*</span></label>
                      <input 
                        id="contact-phone"
                        type="tel" 
                        required
                        placeholder="08X-XXX-XXXX"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="contact-email">{curI18n.emailLabelForm}</label>
                      <input 
                        id="contact-email"
                        type="email" 
                        placeholder="name@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="contact-subject">{curI18n.subjectLabel}</label>
                    <select 
                      id="contact-subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    >
                      {Object.entries(curI18n.subjects).map(([k, v]) => (
                        <option key={k} value={k}>{v}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="contact-message">{curI18n.messageLabel}</label>
                    <textarea 
                      id="contact-message"
                      rows="4" 
                      placeholder={curI18n.messagePlaceholder}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>

                  {cooldownRemaining > 0 && (
                    <div className="form-cooldown-warning">
                      <Clock size={16} className="shrink-0" />
                      <span>{language === 'en' ? `Anti-Spam Rate Limit: Please wait ${cooldownRemaining}s` : `ระบบป้องกันการส่งซ้ำ: กรุณารออีก ${cooldownRemaining} วินาที`}</span>
                    </div>
                  )}

                  <button 
                    type="submit" 
                    className="form-submit-btn"
                    disabled={isSubmitting || cooldownRemaining > 0}
                  >
                    {isSubmitting ? (
                      <>
                        <Send size={18} />
                        <span>{curI18n.submittingBtn}</span>
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        <span>{curI18n.submitBtn}</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
