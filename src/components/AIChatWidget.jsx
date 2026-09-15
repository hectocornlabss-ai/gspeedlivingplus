import React, { useState, useRef, useEffect } from 'react';
import { 
  Headphones, MessageSquare, X, Send, Sparkles, 
  RotateCw, ExternalLink, HelpCircle, ChevronRight, User, Terminal, Shield,
  CheckCircle2, ArrowRight, Share2, PhoneCall, MapPin, Clock, Trophy, Wrench,
  Globe, Compass, Layers
} from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';

// Clean Mini SVG Flag Components (Render crisp and vibrant on all OS)
const ThaiFlag = () => (
  <svg width="16" height="11" viewBox="0 0 18 12" className="flag-icon" title="ภาษาไทย">
    <rect width="18" height="12" fill="#ED1C24" />
    <rect y="2" width="18" height="8" fill="#FFFFFF" />
    <rect y="4" width="18" height="4" fill="#241D4F" />
  </svg>
);

const UKFlag = () => (
  <svg width="16" height="11" viewBox="0 0 60 30" className="flag-icon" title="English">
    <clipPath id="uk-flag-clip">
      <path d="M0,0 v30 h60 v-30 z"/>
    </clipPath>
    <g clipPath="url(#uk-flag-clip)">
      <path d="M0,0 v30 h60 v-30 z" fill="#012169"/>
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="3"/>
      <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10"/>
      <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6"/>
    </g>
  </svg>
);

const ChinaFlag = () => (
  <svg width="16" height="11" viewBox="0 0 30 20" className="flag-icon" title="中文">
    <rect width="30" height="20" fill="#DE2910" />
    <polygon points="5,2 6.18,5.62 2.05,3.38 7.95,3.38 3.82,5.62" fill="#FFDE00" />
    <circle cx="10" cy="3" r="0.9" fill="#FFDE00" />
    <circle cx="12" cy="5" r="0.9" fill="#FFDE00" />
    <circle cx="12" cy="8" r="0.9" fill="#FFDE00" />
    <circle cx="10" cy="10" r="0.9" fill="#FFDE00" />
  </svg>
);

// Safe rich text renderer for chat bubbles supporting bold and clickable markdown links / phone links / internal routing
const FormattedChatMessage = ({ text, onNavigate }) => {
  if (!text) return null;

  const lines = text.split('\n');

  return (
    <div className="bubble-text">
      {lines.map((line, lIdx) => {
        // Parse markdown link: [label](url)
        const parts = [];
        const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+|tel:[^\s)]+|\/[^\s)]+|#[^\s)]+)\)/g;
        let match;
        let lastIndex = 0;

        while ((match = linkRegex.exec(line)) !== null) {
          const matchStart = match.index;
          const matchEnd = linkRegex.lastIndex;
          if (matchStart > lastIndex) {
            parts.push(line.slice(lastIndex, matchStart));
          }
          const targetUrl = match[2];
          const isInternal = targetUrl.startsWith('/') || targetUrl.startsWith('#');
          parts.push(
            <a 
              key={`link-${lIdx}-${matchStart}`} 
              href={targetUrl} 
              onClick={(e) => {
                if (isInternal) {
                  e.preventDefault();
                  const clean = targetUrl.startsWith('#') ? (targetUrl.replace(/^#\/?/, '/') || '/') : targetUrl;
                  window.history.pushState(null, '', clean);
                  window.dispatchEvent(new Event('popstate'));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  if (onNavigate) onNavigate();
                }
              }}
              target={targetUrl.startsWith('tel:') || isInternal ? '_self' : '_blank'} 
              rel="noopener noreferrer"
              className="chat-bubble-link"
              style={isInternal ? { fontWeight: 700, textDecoration: 'underline', color: '#38bdf8' } : {}}
            >
              {match[1]}
            </a>
          );
          lastIndex = matchEnd;
        }

        if (lastIndex < line.length) {
          parts.push(line.slice(lastIndex));
        }

        // Parse **bold** in string parts
        const renderedParts = parts.map((part, pIdx) => {
          if (typeof part !== 'string') return part;
          const boldParts = part.split(/(\*\*[^*]+\*\*)/g);
          return boldParts.map((bp, bIdx) => {
            if (bp.startsWith('**') && bp.endsWith('**')) {
              return <strong key={`b-${lIdx}-${pIdx}-${bIdx}`}>{bp.slice(2, -2)}</strong>;
            }
            return bp;
          });
        });

        return (
          <React.Fragment key={lIdx}>
            {renderedParts}
            {lIdx < lines.length - 1 && <br />}
          </React.Fragment>
        );
      })}
    </div>
  );
};

// Language detector: 'zh' for Chinese, 'en' for English/Latin, default 'th' for Thai
const detectLanguage = (text) => {
  if (!text) return 'th';
  const lower = text.toLowerCase();
  // Check for Chinese characters or explicit mention of Chinese
  if (/[\u4e00-\u9fa5]/.test(text) || lower.includes('chinese') || lower.includes('中文') || lower.includes('zhongwen')) return 'zh';
  // Check for Thai characters
  if (/[\u0e00-\u0e7f]/.test(text)) return 'th';
  // Check for Latin/English letters
  if (/[a-zA-Z]/.test(text)) return 'en';
  return 'th';
};

// Core Store Knowledge Base in 3 Languages (Thai, English, Chinese)
const CORE_KNOWLEDGE = {
  hours: {
    th: `ร้าน **G-Speed Esport Arena** เปิดให้บริการ **ตลอด 24 ชั่วโมง ทุกวัน ตลอดทั้งปี ไม่มีวันหยุด (24/7)** ครับ!

คอมพิวเตอร์สเปกแข่งขันอีสปอร์ตพร้อมเล่นตลอดทั้งวันทั้งคืน แอร์เย็นฉ่ำ 24 ชม. พร้อมบริการอาหารและเครื่องดื่มเสิร์ฟถึงโต๊ะครับ`,
    en: `**G-Speed Esport Arena** is open **24 hours a day, 7 days a week (24/7)** with no holidays!

All tournament-ready high-spec PCs are ready around the clock, with full climate control and 24/7 food & beverages delivered right to your station.`,
    zh: `**G-Speed Esport Arena** **24小时全天候营业，全年无休（24/7）**！

店内配备顶级电竞赛事电脑与舒适冷气环境，并提供24小时餐饮送至座位服务，随时欢迎您的光临。`
  },

  location: {
    th: `📍 **ที่ตั้งร้าน G-Speed Esport Arena:**
79 ซ. รามคำแหง 53 แขวงพลับพลา เขตวังทองหลาง กรุงเทพมหานคร 10310

🗺️ **Google Maps:** [คลิกเปิดแผนที่นำทาง Google Maps](https://share.google/Fj1DmZjpx1cBNBVTf) (https://share.google/Fj1DmZjpx1cBNBVTf)
📞 **โทรศัพท์:** [063 793 7704](tel:0637937704)

🚗 มีที่จอดรถสะดวกสบายรองรับทั้งรถยนต์และมอเตอร์ไซค์ เดินทางสะดวกครับ`,
    en: `📍 **G-Speed Esport Arena Location:**
79 Soi Ramkhamhaeng 53, Phlabphla, Wang Thonglang, Bangkok 10310, Thailand

🗺️ **Google Maps:** [Open in Google Maps](https://share.google/Fj1DmZjpx1cBNBVTf) (https://share.google/Fj1DmZjpx1cBNBVTf)
📞 **Phone:** [063 793 7704](tel:0637937704)

🚗 Convenient parking is available for both cars and motorcycles.`,
    zh: `📍 **G-Speed Esport Arena 门店地址与联系方式：**
曼谷市汪通郎区普拉帕拉街道蓝甘杏53巷79号 (79 Soi Ramkhamhaeng 53, Phlabphla, Wang Thonglang, Bangkok 10310)

🗺️ **谷歌地图导航：** [点击打开 Google Maps](https://share.google/Fj1DmZjpx1cBNBVTf) (https://share.google/Fj1DmZjpx1cBNBVTf)
📞 **联系电话：** [063 793 7704](tel:0637937704)

🚗 店内配有专属停车场，汽车与摩托车均可方便停放。`
  },

  tournament: {
    th: `🏆 **บริการเปิดให้เช่าร้านจัดแข่งอีสปอร์ต (Tournament & Event Venue)**
ทางร้านมีเวทีแข่งขัน 5v5 Tournament Stage พร้อมจอ LED Wall ขนาดยักษ์, ระบบ Live Streaming Broadcast และโต๊ะพากย์ Caster Desk ครบวงจรครับ

📋 **เงื่อนไขและข้อมูลที่ต้องแจ้งสำหรับการขอเช่าจัดแข่ง:**
1. **วันและเวลาจัดงาน:** วันที่และช่วงเวลาที่ต้องการจัดงาน (เริ่ม - สิ้นสุด)
2. **เกมที่ใช้แข่งขัน:** เช่น VALORANT, ROV, PUBG, CS2, FC24 หรือเกมอื่นๆ
3. **ชื่องาน / กิจกรรม:** ชื่อการแข่งขันหรือธีมของงาน
4. **ชื่อบริษัท / ผู้จัด / สถาบัน:** องค์กร สโมสร หรือกลุ่มผู้จัดงาน
5. **จำนวนคนและทีม:** จำนวนผู้เข้าแข่งขัน, จำนวนทีม และผู้ชมโดยประมาณ
6. **ข้อมูลติดต่อกลับ:** ชื่อผู้ประสานงาน, เบอร์โทรศัพท์ และ LINE ID / อีเมล

📞 สนใจจัดงานหรือติดต่อสอบถามคิววันว่าง: โทร [063 793 7704](tel:0637937704) หรือแจ้งข้อมูลผ่านแชทนี้ได้เลยครับ เจ้าหน้าที่จะติดต่อกลับโดยเร็วที่สุดครับ`,
    en: `🏆 **Esports Tournament Venue & Event Rental Service**
We offer an international-standard 5v5 Tournament Stage, giant LED Wall, full live streaming broadcast infrastructure, and caster desks.

📋 **Requirements & Information Needed to Book a Tournament:**
1. **Date & Time:** Target event date and time schedule (start - finish)
2. **Game Title:** e.g., VALORANT, ROV, PUBG, CS2, FC24, etc.
3. **Event Name:** Title of the tournament or event theme
4. **Company / Organizer Name:** Hosting organization or coordinator name
5. **Participants & Teams:** Estimated number of players, teams, and attendees
6. **Contact Information:** Coordinator name, phone number, and LINE / Email

📞 To check available dates or discuss packages: Call [063 793 7704](tel:0637937704) or leave your details here!`,
    zh: `🏆 **电竞赛事场地租赁与比赛承办服务**
我们提供国际标准的 5v5 专业电竞赛事舞台、超大 LED 巨幕、全套专业赛事直播导播系统及解说台。

📋 **申请举办赛事所需提交的信息与条件：**
1. **举办日期与时间：** 预定活动日期及具体时间段（开始至结束）
2. **比赛游戏项目：** 如 无畏契约(VALORANT)、王者荣耀/ROV、绝地求生(PUBG)、CS2 等
3. **赛事/活动名称：** 比赛全称或活动主题
4. **主办方/公司/机构名称：** 主办单位或组织者名称
5. **参赛人数与战队数：** 预计参赛战队数量、选手及现场观众人数
6. **负责人联系方式：** 负责人姓名、联系电话、微信/LINE或邮箱

📞 预订档期与商务咨询：请拨打电话 [063 793 7704](tel:0637937704) 或直接在此留言，工作人员将第一时间为您跟进！`
  },

  installation: {
    th: `🛠️ **บริการรับติดตั้งระบบร้านเกมครบวงจร (Turnkey Cyber Cafe Solutions)**
ทาง G-Speed ให้บริการติดตั้งและวางระบบร้านเกมมาตรฐานระดับมืออาชีพ:
• **ระบบ Diskless Server:** บูตเร็ว NVMe RAID อัปเดตเกมที่เซิร์ฟเวอร์แม่จุดเดียว (รองรับ iCafeCloud & CCBoot) พร้อมระบบ Auto-Failover สำรอง
• **ระบบ Network 10Gbps Multi-WAN:** รวมเน็ต 2-3 ผู้ให้บริการ สลับสายอัตโนมัติ Ping ในประเทศ < 3ms
• **ระบบคิดเงิน POS & Member Billing:** จัดการสมาชิก บัญชีคลาวด์ และคลังสินค้า
• **ออกแบบผังร้าน 2D/3D & เฟอร์นิเจอร์:** โต๊ะ-เก้าอี้เกมมิ่ง สเปกแข่งขัน

📞 ปรึกษาและประเมินงบประมาณฟรี โทร [063 793 7704](tel:0637937704) ได้ตลอด 24 ชั่วโมงครับ`,
    en: `🛠️ **Turnkey Cyber Cafe & Esports Venue System Installation**
G-Speed provides professional cyber cafe engineering solutions:
• **Diskless Boot Server:** NVMe RAID high-speed boot, centralized game updates (iCafeCloud & CCBoot), and auto-failover redundancy.
• **10Gbps Multi-WAN Network:** Dual ISP line aggregation, intelligent QoS, ultra-low ping (< 3ms).
• **POS Billing & Member Management:** Cloud accounting, member tiering, and inventory control.
• **2D/3D Interior Layout & Gaming Furniture:** Ergonomic tables and esports chairs.

📞 Free consultation & quotation: Call [063 793 7704](tel:0637937704) anytime!`,
    zh: `🛠️ **专业网吧与电竞馆一站式系统搭建服务**
G-Speed 提供专业级电竞馆软硬件综合工程：
• **高速无盘服务器 (Diskless Server)：** 纯固态阵列极速启动，全自动游戏更新（支持 iCafeCloud、CCBoot），双机热备容灾。
• **万兆多线网络 (10Gbps Multi-WAN)：** 多宽带聚合与智能分流，电竞极低延迟 < 3ms。
• **计费与收银 POS 系统：** 会员充值、在线点餐及云端财务管理。
• **2D/3D 空间规划与电竞家具：** 专业对战席与人体工学电竞椅。

📞 免费方案评估与报价：请拨打 [063 793 7704](tel:0637937704) 咨询！`
  },

  services: {
    th: `🎮 **บริการหลักของ G-Speed Esport Arena:**
1. **ร้านเกมคอมพิวเตอร์สเปกแข่งขันอีสปอร์ต:** เปิดบริการตลอด 24 ชม. การ์ดจอ RTX 40 Series จอ 360Hz/240Hz โซนทั่วไปและห้อง VIP
2. **เปิดให้เช่าร้านจัดแข่งอีสปอร์ต:** เวที 5v5 Stage จอ LED Wall ขนาดยักษ์ โต๊ะพากย์ และระบบ Live Stream
3. **รับติดตั้งระบบร้านเกมครบวงจร:** ติดตั้งระบบ Diskless Server, เน็ตเวิร์ก 10Gbps, ระบบคิดเงิน POS และออกแบบผังร้าน 2D/3D

📍 **ที่ตั้ง:** 79 ซ. รามคำแหง 53 แขวงพลับพลา เขตวังทองหลาง กทม.
🗺️ **แผนที่:** [Google Maps](https://share.google/Fj1DmZjpx1cBNBVTf) | 📞 **โทร:** [063 793 7704](tel:0637937704)`,
    en: `🎮 **Core Services at G-Speed Esport Arena:**
1. **24/7 Esports Gaming PC Lounge:** RTX 40 Series GPUs, 360Hz/240Hz monitors, casual & VIP suites.
2. **Esports Tournament & Venue Rental:** 5v5 Stage, giant LED screen, live stream equipment, and caster desk.
3. **Turnkey Cyber Cafe System Setup:** Diskless boot servers, 10Gbps network wiring, POS systems, and 2D/3D interior planning.

📍 **Address:** 79 Soi Ramkhamhaeng 53, Phlabphla, Wang Thonglang, Bangkok
🗺️ **Map:** [Google Maps](https://share.google/Fj1DmZjpx1cBNBVTf) | 📞 **Phone:** [063 793 7704](tel:0637937704)`,
    zh: `🎮 **G-Speed Esport Arena 核心业务与服务：**
1. **24小时顶级电竞网咖：** RTX 40系列显卡、360Hz/240Hz电竞屏，大众区与VIP包间。
2. **电竞赛事场地租赁与承办：** 5v5专业赛事舞台、LED巨幕、直播推流设备及专业解说席。
3. **专业网吧系统工程安装：** 高速无盘服务器、万兆网络工程、计费收银POS及2D/3D空间设计。

📍 **地址：** 曼谷市蓝甘杏53巷79号
🗺️ **谷歌地图：** [Google Maps](https://share.google/Fj1DmZjpx1cBNBVTf) | 📞 **电话：** [063 793 7704](tel:0637937704)`
  },

  franchise: {
    th: `🏢 **ข้อมูลการลงทุนและงบประมาณเปิดร้านเกมแฟรนไชส์ G-Speed Esport Arena:**

โมเดลการลงทุนมีให้เลือก 3 ขนาด:
• **Size S (30-40 เครื่อง):** งบประมาณประมาณ 1.8 - 2.5 ล้านบาท (เหมาะกับอาคารพาณิชย์ 2 คูหา คืนทุนเฉลี่ย 14-18 เดือน)
• **Size M (50-70 เครื่อง):** งบประมาณประมาณ 3.2 - 4.5 ล้านบาท (โมเดลยอดนิยม คืนทุนเฉลี่ย 18-24 เดือน)
• **Size L Mega Arena (80-120 เครื่อง):** งบประมาณ 5.5 - 8.0 ล้านบาท (พร้อมเวทีแข่งขัน 5v5 และห้อง VIP Bootcamp)

📦 **สิ่งที่ได้รับในแพ็กเกจ Turnkey ครบวงจร:**
1. คอมพิวเตอร์สเปกแข่งขันครบชุด (RTX 40 Series + จอ 360Hz/240Hz)
2. ระบบแม่ข่าย Diskless Server NVMe RAID อ่านเขียน 14,000 MB/s ไม่ง้อฮาร์ดดิสก์รายเครื่อง
3. ระบบ Network 10Gbps Multi-WAN รวมเน็ต 2-3 ค่าย Ping ต่ำ < 3ms
4. ระบบคิดเงิน POS & Member Cloud Billing จัดการสต็อกและบัญชีแบบ Real-time
5. ออกแบบแปลนร้าน 2D/3D และตกแต่งตามมาตรฐานแบรนด์ G-Speed
6. อบรมบุคลากรและทีมวิศวกรดูแลระบบตลอดอายุสัญญา

📐 **ระบบจำลองผังร้าน 3D & คำนวณงบประมาณเบื้องต้น:**
คุณสามารถเข้าไปจำลองขนาดห้อง กว้าง x ยาว จัดวางเครื่อง และคำนวณงบลงทุน ROI ได้ทันทีที่:
👉 [**คลิกที่นี่เพื่อไปหน้าระบบออกแบบแปลนร้าน 3D/2D**](/franchise)

📞 **ปรึกษาคำนวณงบประมาณและสำรวจหน้างานฟรี:** โทร [063 793 7704](tel:0637937704) หรือพิมพ์แจ้งขนาดพื้นที่และเบอร์ติดต่อไว้ในแชทนี้ได้เลยครับ เจ้าหน้าที่จะติดต่อกลับทันทีครับ!`,
    en: `🏢 **G-Speed Esport Arena Franchise & Store Opening Investment:**

We offer 3 turnkey investment models:
• **Size S (30-40 PCs):** Approx. 1.8 - 2.5 Million THB (Estimated ROI 14-18 months)
• **Size M (50-70 PCs):** Approx. 3.2 - 4.5 Million THB (Flagship model, ROI 18-24 months)
• **Size L Mega Arena (80-120 PCs):** Approx. 5.5 - 8.0 Million THB (Includes 5v5 stage & VIP suites)

📦 **Turnkey Package Includes:** Tournament-grade PCs (RTX 40 series), NVMe Diskless Server, 10Gbps Multi-WAN low-latency network, Cloud POS, 2D/3D layout design, and operational staff training.

📐 **Try our 3D/2D Store Planner & ROI Calculator:**
You can simulate your venue size, arrange gaming stations, and estimate your budget right now:
👉 [**Click here to open the 3D/2D Floor Planner**](/franchise)

📞 **For customized ROI calculation & site survey:** Call [063 793 7704](tel:0637937704) or leave your phone number here!`,
    zh: `🏢 **G-Speed Esport Arena 电竞馆加盟与开店投资方案：**

我们提供 3 种全案交钥匙加盟投资模型：
• **Size S 社区精选店 (30-40台机器)：** 投资预算约 180 - 250 万泰铢 (预计 14-18 个月回本)
• **Size M 主力标准店 (50-70台机器)：** 投资预算约 320 - 450 万泰铢 (主力旗舰店，平均 18-24 个月回本)
• **Size L 大型电竞超级馆 (80-120台)：** 投资预算约 550 - 800 万泰铢 (配备 5v5 比赛舞台与 VIP 战队包间)

📦 **全案交付清单：** 顶级电竞整机（RTX 40系列 + 360Hz显示器）、高速纯固态无盘服务器、万兆多线低延迟网络工程、云端POS收银计费、2D/3D空间设计与施工指导。

📐 **3D/2D 空间规划与投资回报测算系统：**
您可以直接输入场地尺寸，进行设备布局并测算投资预算：
👉 [**点击此处进入 3D/2D 空间规划与预算测算系统**](/franchise)

📞 **方案评估与场地勘测：** 请致电 [063 793 7704](tel:0637937704) 或在此留下您的联系方式！`
  },

  pricing: {
    th: `💳 **อัตราค่าบริการและโปรโมชัน:**
• **สมาชิก:** 25 - 30 บาท / ชั่วโมง
• **บุคคลทั่วไป:** 35 บาท / ชั่วโมง
• **โปรเหมาข้ามคืน (Night Owl 23:00 - 08:00 น.):** เพียง 150 บาท
• **โปรเติมเงิน:** เติม 500 ฟรี 100 บาท | เติม 1,000 ฟรี 300 บาท
• **ห้อง VIP Bootcamp:** 250 บาท/ชม. หรือ 2,000 บาท/วัน (เหมา 5-6 เครื่อง)`,
    en: `💳 **Rates & Promotions:**
• **Members:** 25 - 30 THB / hour
• **Non-members:** 35 THB / hour
• **Night Owl Promo (23:00 - 08:00):** 150 THB
• **Top-up bonuses:** Top up 500 get 100 THB bonus | Top up 1,000 get 300 THB bonus
• **VIP Bootcamp Suite:** 250 THB/hr or 2,000 THB/day (5-6 high-spec stations)`,
    zh: `💳 **网费价格与充值优惠：**
• **会员价：** 25 - 30 泰铢 / 小时
• **非会员：** 35 泰铢 / 小时
• **通宵包夜特惠 (23:00 - 08:00)：** 仅需 150 泰铢
• **充值返赠：** 充 500 赠 100 泰铢 | 充 1,000 赠 300 泰铢
• **VIP 战队包间：** 250 泰铢/小时 或 2,000 泰铢/天（5-6台高配电脑）`
  },

  specs: {
    th: `💻 **สเปกคอมพิวเตอร์และอุปกรณ์เกมมิ่ง:**
• **การ์ดจอ:** NVIDIA GeForce RTX 4070 SUPER / RTX 4080 SUPER
• **ซีพียู:** Intel Core i7-14700K / Core i9
• **แรม:** 32GB DDR5 6000MHz
• **หน้าจอ:** BenQ ZOWIE 360Hz Fast-IPS / 240Hz (0.5ms Response Time)
• **เก้าอี้และอุปกรณ์:** Secretlab TITAN Evo, เมาส์ ZOWIE/Logitech G PRO, Mechanical Keyboard`,
    en: `💻 **Hardware & Gaming Specs:**
• **GPU:** NVIDIA GeForce RTX 4070 SUPER / RTX 4080 SUPER
• **CPU:** Intel Core i7-14700K / Core i9
• **RAM:** 32GB DDR5 6000MHz
• **Monitors:** BenQ ZOWIE 360Hz Fast-IPS / 240Hz (0.5ms response time)
• **Gear:** Secretlab TITAN Evo, ZOWIE / Logitech G PRO mice, Mechanical Keyboards`,
    zh: `💻 **电脑硬件与外设配置：**
• **显卡：** NVIDIA GeForce RTX 4070 SUPER / RTX 4080 SUPER
• **CPU：** Intel 酷睿 i7-14700K / Core i9
• **内存：** 32GB DDR5 6000MHz
• **显示器：** BenQ ZOWIE 360Hz Fast-IPS / 240Hz (0.5ms 极速响应)
• **外设与电竞椅：** Secretlab TITAN Evo 电竞椅、ZOWIE / 罗技 G PRO 鼠标、全机械键盘`
  },

  greetings: {
    th: `สวัสดีครับ ยินดีต้อนรับสู่ **G-Speed Esport Arena** ครับ! 😊
สามารถสอบถามเวลาทำการ, พิกัดร้าน, อัตราค่าบริการ, การเช่าจัดแข่งอีสปอร์ต หรือการรับติดตั้งระบบร้านเกมได้เลยครับ เจ้าหน้าที่ยินดีให้บริการครับ!`,
    en: `Hello! Welcome to **G-Speed Esport Arena**! 😊
Feel free to ask about our opening hours, location, rates, tournament rental, or cyber cafe system installation. How may I assist you today?`,
    zh: `您好！欢迎来到 **G-Speed Esport Arena**！😊
您可以随时咨询我们的营业时间、门店地址、网费价格、赛事场地租赁或网吧系统安装服务。请问有什么可以帮您？`
  },

  outOfScope: {
    th: `ขออภัยด้วยครับ ทางเจ้าหน้าที่สามารถให้ข้อมูลเกี่ยวกับศูนย์ G-Speed Esport Arena ได้แก่: เวลาเปิดทำการ (24 ชม.), ที่ตั้งร้าน ซ.รามคำแหง 53, อัตราค่าบริการ, การขอเช่าจัดแข่งอีสปอร์ต และการรับติดตั้งระบบร้านเกมครับ หากมีข้อสงสัยเกี่ยวกับบริการของทางร้าน สอบถามได้ทันที หรือโทร [063 793 7704](tel:0637937704) ครับ`,
    en: `Sorry, our support team can assist you with G-Speed Esport Arena information including: 24/7 opening hours, Ramkhamhaeng 53 location, gaming rates, tournament rental, and cyber cafe system setup. Feel free to ask or call us at [063 793 7704](tel:0637937704).`,
    zh: `抱歉，工作人员可为您提供关于 G-Speed Esport Arena 的各项信息：24小时营业时间、蓝甘杏53巷门店地址、网费收费、电竞赛事场地租赁及网吧系统安装。如有相关问题欢迎随时咨询，或拨打电话 [063 793 7704](tel:0637937704)。`
  }
};

export default function AIChatWidget() {
  const { siteData, addPendingQuestion } = useSiteData();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'msg-1',
      role: 'assistant',
      text: 'สวัสดีครับ ยินดีต้อนรับสู่ **G-Speed Esport Arena** ครับ! 😊\n\nสามารถสอบถามเวลาทำการ, พิกัดร้าน, อัตราค่าบริการ, การขอเช่าจัดแข่งอีสปอร์ต หรือการรับติดตั้งระบบร้านเกม ได้เลยครับ เจ้าหน้าที่พร้อมให้ข้อมูลครับ\n*(We support Thai, English, and Chinese / 支持泰语、英语和中文咨询)*'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Quick Prompt Suggestions with Multi-language chips
  const quickPrompts = [
    { label: '🏢 สนใจเปิดร้าน / แฟรนไชส์', query: 'สนใจเปิดร้าน ราคาเท่าไหร่' },
    { label: '🕒 ร้านเปิดกี่โมง?', query: 'ร้านเปิดกี่โมง' },
    { label: '📍 ร้านอยู่ที่ไหน & แผนที่', query: 'ร้านอยู่ที่ไหน' },
    { label: '🏆 ขอเช่าจัดแข่งอีสปอร์ต', query: 'ขอเช่าจัดแข่งอีสปอร์ต' },
    { label: '🛠️ รับติดตั้งระบบร้านเกม', query: 'บริการรับติดตั้งระบบร้านเกม' },
    { label: '🌐 English: Hours & Map', query: 'What are your opening hours and location?' },
    { label: '🇨🇳 中文咨询 (营业时间/地址)', query: '请问营业时间和地址在哪里？' }
  ];

  // Match Core Intents
  const matchCoreIntent = (query, lang) => {
    const q = query.toLowerCase();

    // 0. Franchise / New Store Investment (Check this FIRST to avoid collision with 'เปิด' in opening hours)
    const franchiseKeywords = [
      'เปิดร้าน', 'สนใจเปิด', 'สใจเปิด', 'อยากเปิด', 'เปิดสาขา', 'ลงทุน', 'แฟรนไชส์', 'franchise', 
      'งบเปิด', 'ค่าเปิดร้าน', 'เปิดร้านราคา', 'ทำร้านเกม', 'เปิดร้านใหม่', 'เปิดร้านเท่าไหร่',
      'open shop', 'open a shop', 'open cafe', 'invest', 'investment', 'open cyber cafe', 'cost to open',
      '加盟', '开网吧', '开店', '投资', '加盟费', '开电竞馆', '开店成本'
    ];
    if (franchiseKeywords.some(k => q.includes(k))) {
      return CORE_KNOWLEDGE.franchise[lang] || CORE_KNOWLEDGE.franchise.th;
    }

    // 1. Opening Hours (Strictly about operating hours / 24 hours schedule)
    const isFranchiseQuery = ['เปิดร้าน', 'สนใจเปิด', 'สใจเปิด', 'อยากเปิด', 'เปิดสาขา', 'ลงทุน', 'แฟรนไชส์'].some(k => q.includes(k));
    const hoursKeywords = [
      'เปิดกี่โมง', 'เวลาเปิด', 'เปิดปิด', 'เวลาทำ', 'เปิดบริการ', 'เปิดถึง', 'ปิดกี่โมง', '24ชม', '24 ชม', 'วันหยุด', 'ปิดวันไหน', 'เปิดวันไหน', 'กี่โมง',
      'hours', 'hour', 'opening hours', 'close time', 'open time', 'timing', 'schedule', '24/7', 'holiday',
      '营业时间', '几点', '开门', '关门', '营业', '放假', '节假日', '开到几点'
    ];
    if (!isFranchiseQuery && (hoursKeywords.some(k => q.includes(k)) || q === 'เปิด' || q === 'ร้านเปิด' || q === 'เวลา' || q === 'เวลาทำการ')) {
      return CORE_KNOWLEDGE.hours[lang] || CORE_KNOWLEDGE.hours.th;
    }

    // 2. Location / Address / Map / Phone / Directions
    const locKeywords = [
      'อยู่ไหน', 'ที่ไหน', 'ที่ตั้ง', 'พิกัด', 'แผนที่', 'ซอย', 'รามคำแหง', 'เบอร์', 'โทร', 'ติดต่อ', 
      'map', 'ทางไป', 'การเดินทาง', 'จอดรถ', 'สาขา', 'เบอร์โทร', 'ไปยังไง',
      'where', 'location', 'address', 'map', 'phone', 'call', 'contact', 'locate', 'directions', 'parking', 'branch',
      '在哪', '地址', '位置', '怎么走', '地图', '电话', '联系', '停车', '交通', '分店'
    ];
    if (locKeywords.some(k => q.includes(k))) {
      return CORE_KNOWLEDGE.location[lang] || CORE_KNOWLEDGE.location.th;
    }

    // 3. Tournament Rental & 6 conditions
    const tournamentKeywords = [
      'จัดแข่ง', 'เช่าร้าน', 'เช่าสถานที่', 'ทัวร์นาเมนต์', 'แข่งเกม', 'เวที', 'เงื่อนไขจัดแข่ง', 'จัดงาน', 'ขอจัดแข่ง', 'แข่ง', 'เวทีแข่ง',
      'tournament', 'rent', 'rental', 'venue', 'competition', 'stage', 'host', 'event', 'compete',
      '比赛', '举办比赛', '租场地', '包场', '赛事', '租用', '电竞赛事', '舞台', '活动', '承办'
    ];
    if (tournamentKeywords.some(k => q.includes(k))) {
      return CORE_KNOWLEDGE.tournament[lang] || CORE_KNOWLEDGE.tournament.th;
    }

    // 4. System Installation / Diskless / Network / POS
    const installKeywords = [
      'ติดตั้ง', 'รับติดตั้ง', 'diskless', 'ดิสเลส', 'เซิร์ฟเวอร์', 'ระบบร้าน', 'วางระบบ', 'เดินสายแลน', 'network', '10gbps', 'icafecloud', 'ccboot',
      'install', 'setup', 'system', 'diskless', 'server', 'network', 'lan', 'cyber cafe setup', 'icafe',
      '安装', '搭建', '网吧系统', '无盘系统', '服务器', '布线', '局域网', '网络系统', '装机', '机房'
    ];
    if (installKeywords.some(k => q.includes(k))) {
      return CORE_KNOWLEDGE.installation[lang] || CORE_KNOWLEDGE.installation.th;
    }

    // 5. Services Overview
    const servicesKeywords = [
      'บริการ', 'มีอะไรบ้าง', 'ทำอะไรได้บ้าง', 'บริการของร้าน', 'service', 'บริการเรา',
      'service', 'what do you do', 'features', 'offer', 'services',
      '服务', '业务', '有什么服务', '经营项目', '介绍', '服务项目'
    ];
    if (servicesKeywords.some(k => q.includes(k))) {
      return CORE_KNOWLEDGE.services[lang] || CORE_KNOWLEDGE.services.th;
    }

    // 6. Pricing / Rates
    const priceKeywords = [
      'ราคา', 'ชั่วโมง', 'ค่าบริการ', 'โปรโมชัน', 'โปร', 'เติมเงิน', 'night owl', 'ค่าเล่น',
      'price', 'rate', 'cost', 'fee', 'promotion', 'night owl',
      '价格', '收费', '多少钱', '一小时', '网费', '充值', '优惠', '包夜'
    ];
    if (priceKeywords.some(k => q.includes(k))) {
      return CORE_KNOWLEDGE.pricing[lang] || CORE_KNOWLEDGE.pricing.th;
    }

    // 7. Computer Specs
    const specsKeywords = [
      'สเปก', 'สเปค', 'การ์ดจอ', 'cpu', 'ram', 'จอ', 'hz', '360hz', '240hz', 'rtx', 'คอม',
      'spec', 'specs', 'hardware', 'gpu', 'cpu', 'monitor', 'screen', '360hz', 'rtx',
      '配置', '硬件', '显卡', '屏幕', '显示器', '电脑配置', '刷新率', 'rtx'
    ];
    if (specsKeywords.some(k => q.includes(k))) {
      return CORE_KNOWLEDGE.specs[lang] || CORE_KNOWLEDGE.specs.th;
    }

    // 8. Greetings
    const greetingKeywords = [
      'สวัสดี', 'ดีครับ', 'ดีค่ะ', 'หวัดดี', 'มีใครอยู่ไหม',
      'hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening',
      '你好', '您好', '在吗', '有人吗', '早上好', '晚上好'
    ];
    if (greetingKeywords.some(k => q.includes(k))) {
      return CORE_KNOWLEDGE.greetings[lang] || CORE_KNOWLEDGE.greetings.th;
    }

    return null;
  };

  // RAG Retriever for extra knowledge chunks in CMS
  const retrieveRelevantKnowledge = (query) => {
    const q = query.toLowerCase();
    const knowledgeList = siteData.ragKnowledge || [];

    const scored = knowledgeList.map(item => {
      let score = 0;
      if (item.tags) {
        item.tags.forEach(tag => {
          if (q.includes(tag.toLowerCase())) score += 4;
        });
      }
      const titleWords = item.title.toLowerCase().split(' ');
      titleWords.forEach(w => {
        if (w.length > 2 && q.includes(w)) score += 3;
      });
      return { item, score };
    });

    scored.sort((a, b) => b.score - a.score);
    const relevant = scored.filter(s => s.score > 0).slice(0, 3).map(s => s.item);
    return relevant.length > 0 ? relevant : knowledgeList.slice(0, 2);
  };

  // Handle Send Message
  const handleSendMessage = async (textToSend) => {
    const query = (textToSend || inputText).trim();
    if (!query || isLoading) return;

    setInputText('');

    // Add User Message
    const userMsg = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: query
    };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    const lang = detectLanguage(query);

    // 1. First check if query matches Core Knowledge directly (instant high-accuracy matching in 3 languages)
    const matchedCoreAnswer = matchCoreIntent(query, lang);

    // 2. OpenRouter API Mode (if configured with API key)
    const apiKey = siteData.openRouterSettings?.apiKey;
    const model = siteData.openRouterSettings?.model || 'google/gemini-flash-3.8';

    if (apiKey && apiKey.trim().startsWith('sk-')) {
      try {
        const matchedDocs = retrieveRelevantKnowledge(query);
        const contextText = matchedDocs.map(d => `[${d.title}]: ${d.content}`).join('\n\n');

        const systemPrompt = `คุณคือ "เจ้าหน้าที่บริการลูกค้า / เจ้าหน้าที่ฝ่ายดูแลลูกค้า" ประจำศูนย์ G-Speed Esport Arena (GLP Living Plus).
คุณมีหน้าที่ตอบคำถาม ให้คำปรึกษา และดูแลลูกค้าเกี่ยวกับบริการของทางร้านอย่างสุภาพ เป็นมิตร และเป็นมืออาชีพ เสมือนคุยกับเจ้าหน้าที่จริง (ห้ามบอกว่าเป็นบอทหรือ AI)

ข้อมูลสำคัญของทางร้าน:
1. เวลาเปิดทำการ: เปิดให้บริการตลอด 24 ชั่วโมง ทุกวัน ตลอดทั้งปี ไม่มีวันหยุด (24/7)
2. ที่ตั้งร้าน: 79 ซ. รามคำแหง 53 แขวงพลับพลา เขตวังทองหลาง กรุงเทพมหานคร 10310 | Google Maps: https://share.google/Fj1DmZjpx1cBNBVTf | เบอร์โทรศัพท์: 063 793 7704 (มีที่จอดรถสะดวกสบาย)
3. บริการหลักของทางร้าน:
   - ร้านเกมคอมพิวเตอร์สเปกแข่งขันอีสปอร์ต 24 ชม. (RTX 40 Series, จอ 360Hz/240Hz, โซนทั่วไปและ VIP Bootcamp)
   - เปิดให้เช่าร้านจัดแข่งอีสปอร์ต (เวที 5v5 Tournament Stage, จอ LED Wall ขนาดยักษ์, ระบบ Live Streaming Broadcast, โต๊ะพากย์ Caster Desk)
     เงื่อนไขและข้อมูลที่ลูกค้าต้องแจ้งในการขอจัดแข่ง:
     (1) วันและเวลาจัดงาน
     (2) เกมที่ใช้แข่งขัน
     (3) ชื่องาน / กิจกรรม
     (4) ชื่อบริษัท / ผู้จัด / สถาบัน
     (5) จำนวนคนและทีมโดยประมาณ
     (6) ข้อมูลติดต่อกลับ
   - รับติดตั้งและวางระบบร้านเกมครบวงจร (Diskless Server iCafeCloud/CCBoot, เน็ตเวิร์ก 10Gbps Multi-WAN Ping < 3ms, ระบบคิดเงิน POS บัญชีคลาวด์, จัดผังร้าน 2D/3D)
4. อัตราค่าบริการ: สมาชิก 25-30 บาท/ชม., บุคคลทั่วไป 35 บาท/ชม., โปรเหมาข้ามคืน Night Owl 150 บาท

*** กฎสำคัญ ***
1. ให้ตอบกลับเป็นภาษาเดียวกับที่ลูกค้าถาม (หากถามเป็นภาษาไทยตอบภาษาไทย, หากถามภาษาอังกฤษตอบภาษาอังกฤษ, หากถามภาษาจีนตอบภาษาจีน)
2. สุภาพ ชัดเจน และเป็นมิตร
3. หากลูกค้าต้องการติดต่อเจ้าหน้าที่โดยตรง ให้แจ้งเบอร์โทรศัพท์: 063 793 7704
4. หากลูกค้าสอบถามเกี่ยวกับการลงทุนเปิดร้าน, แฟรนไชส์, งบประมาณ, หรือการจัดผังร้าน ให้แนะนำให้ลูกค้าทดลองจัดผังร้าน 2D/3D และคำนวณงบประมาณได้ด้วยตนเอง พร้อมแนบลิงก์ [📐 ออกแบบแปลนร้านและประเมินงบประมาณ](/franchise) เพื่อให้ลูกค้ากดเข้าไปใส่รายละเอียดได้ทันที
5. อ้างอิงข้อมูลเพิ่มเติมจาก:
-------------------------
${contextText}
-------------------------`;

        const apiMessages = [
          { role: 'system', content: systemPrompt },
          ...messages.slice(-4).map(m => ({ role: m.role, content: m.text })),
          { role: 'user', content: query }
        ];

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey.trim()}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'http://localhost:5173/',
            'X-Title': 'G-Speed Esport Arena'
          },
          body: JSON.stringify({
            model: model,
            messages: apiMessages,
            temperature: 0.7
          })
        });

        if (response.ok) {
          const data = await response.json();
          const reply = data.choices?.[0]?.message?.content;
          if (reply) {
            setMessages(prev => [
              ...prev,
              {
                id: `rep-${Date.now()}`,
                role: 'assistant',
                text: reply,
                userQuery: query
              }
            ]);
            setIsLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn('OpenRouter API call error, falling back to smart core knowledge', err);
      }
    }

    // 2. n8n Omnichannel Webhook Mode (If configured in Admin CMS)
    const n8nWebhookUrl = siteData.omnichannelConfig?.webWidgetWebhookUrl || siteData.openRouterSettings?.proxyUrl;
    if (n8nWebhookUrl && n8nWebhookUrl.startsWith('http') && !n8nWebhookUrl.includes('placeholder')) {
      try {
        const response = await fetch(n8nWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: query,
            language: lang,
            history: messages.slice(-6).map(m => ({ role: m.role, content: m.text })),
            source: 'gspeed-web-widget',
            timestamp: new Date().toISOString()
          })
        });

        if (response.ok) {
          const data = await response.json();
          const reply = data.reply || data.message || data.text || data.output || data.choices?.[0]?.message?.content;
          if (reply) {
            setMessages(prev => [
              ...prev,
              {
                id: `rep-${Date.now()}`,
                role: 'assistant',
                text: reply,
                userQuery: query
              }
            ]);
            setIsLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn('n8n Webhook call error, falling back to smart core knowledge', err);
      }
    }

    // 3. Fallback Smart Response
    setTimeout(() => {
      let finalAnswer = matchedCoreAnswer;

      if (!finalAnswer) {
        // Try RAG chunks
        const matchedDocs = retrieveRelevantKnowledge(query);
        if (matchedDocs.length > 0 && matchedDocs.some(d => d.score > 0)) {
          finalAnswer = matchedDocs.map(d => d.content).join('\n\n');
        } else {
          finalAnswer = CORE_KNOWLEDGE.outOfScope[lang] || CORE_KNOWLEDGE.outOfScope.th;
          addPendingQuestion(query);
        }
      }

      setMessages(prev => [
        ...prev,
        {
          id: `rep-${Date.now()}`,
          role: 'assistant',
          text: finalAnswer,
          userQuery: query
        }
      ]);
      setIsLoading(false);
    }, 400);
  };

  return (
    <div className="ai-chat-widget-container">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button 
          id="btn-open-ai-chat"
          className="btn-ai-chat-trigger"
          onClick={() => setIsOpen(true)}
          title="สอบถามข้อมูล / แชทกับเจ้าหน้าที่ - G-Speed Arena"
        >
          <div className="trigger-pulse-ring"></div>
          <div className="trigger-avatar-circle">
            <Headphones size={20} className="trigger-icon" />
          </div>
          <div className="trigger-text-badge">
            <span className="badge-subtitle">G-SPEED ARENA</span>
            <span className="trigger-label">สอบถามข้อมูล / แชทกับเจ้าหน้าที่</span>
          </div>
        </button>
      )}

      {/* Expanded Chat Box */}
      {isOpen && (
        <div className="ai-chat-card glass-panel">
          {/* Header */}
          <div className="chat-card-header">
            <div className="chat-brand-info">
              <div className="ai-avatar-badge">
                <Headphones size={18} />
              </div>
              <div>
                <strong className="chat-title">ศูนย์บริการข้อมูลลูกค้า • G-SPEED ARENA</strong>
                <div className="chat-status-pill">
                  <span className="status-dot-green"></span>
                  <span>Online • สอบถามข้อมูล & บริการร้าน 24 ชม.</span>
                  <span className="chat-lang-pill" title="บริการ 3 ภาษา: ไทย 🇹🇭 • English 🇬🇧 • 中文 🇨🇳">
                    <ThaiFlag />
                    <UKFlag />
                    <ChinaFlag />
                  </span>
                </div>
              </div>
            </div>

            <div className="chat-header-actions">
              <button 
                className="btn-chat-action" 
                onClick={() => setIsOpen(false)}
                title="ปิดหน้าต่าง"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="chat-messages-container">
            {messages.map((msg) => (
              <div key={msg.id} className={`chat-bubble-row ${msg.role === 'user' ? 'user-side' : 'bot-side'}`}>
                {msg.role === 'assistant' && (
                  <div className="bubble-avatar">
                    <Headphones size={14} />
                  </div>
                )}
                <div className={`chat-bubble-content ${msg.role === 'user' ? 'bubble-user' : 'bubble-bot'} ${msg.isOutOfScopeNotice ? 'bubble-warning' : ''}`}>
                  <FormattedChatMessage text={msg.text} onNavigate={() => setIsOpen(false)} />
                  
                  {/* Interactive Store Planner CTA Button */}
                  {msg.role === 'assistant' && (
                    msg.text.includes('/franchise') || 
                    msg.text.includes('ออกแบบแปลน') || 
                    msg.text.includes('แพ็กเกจ Turnkey') || 
                    msg.text.includes('เปิดร้านเกม') ||
                    msg.text.includes('จำลองผังร้าน') ||
                    msg.text.includes('วางผังร้าน')
                  ) && (
                    <div style={{
                      marginTop: '12px',
                      padding: '12px 14px',
                      background: 'rgba(30, 58, 138, 0.25)',
                      border: '1px solid rgba(59, 130, 246, 0.4)',
                      borderRadius: '10px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#60a5fa', fontSize: '0.84rem', fontWeight: 700, marginBottom: '4px' }}>
                        <Compass size={15} />
                        <span>ระบบจำลองผังร้าน 3D & คำนวณงบประมาณ</span>
                      </div>
                      <p style={{ fontSize: '0.78rem', color: '#cbd5e1', margin: '0 0 10px 0', lineHeight: 1.45 }}>
                        ทดลองใส่ขนาดพื้นที่ห้อง กว้าง x ยาว จัดวางเครื่อง สเปกคอม และคำนวณงบลงทุน ROI ได้ทันที
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          window.history.pushState(null, '', '/franchise');
                          window.dispatchEvent(new Event('popstate'));
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                          setIsOpen(false);
                        }}
                        style={{
                          width: '100%',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          padding: '8px 14px',
                          background: '#2563eb',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '8px',
                          fontWeight: 700,
                          fontSize: '0.84rem',
                          cursor: 'pointer',
                          boxShadow: '0 4px 12px rgba(37, 99, 235, 0.35)',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <Compass size={15} />
                        <span>เปิดระบบออกแบบแปลนร้าน & ใส่รายละเอียด</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  )}

                  {msg.isOutOfScopeNotice && (
                    <div className="out-of-scope-badge">
                      <Shield size={11} />
                      <span>ขอบเขตข้อมูลเจ้าหน้าที่ร้าน</span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="chat-bubble-row bot-side">
                <div className="bubble-avatar">
                  <Headphones size={14} />
                </div>
                <div className="chat-bubble-content bubble-bot typing-indicator">
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Carousel */}
          <div className="quick-prompts-bar">
            {quickPrompts.map((item, idx) => (
              <button 
                key={idx} 
                className="quick-prompt-chip"
                onClick={() => handleSendMessage(item.query)}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Chat Input Bar */}
          <form 
            className="chat-input-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
          >
            <input 
              type="text" 
              className="chat-input-field"
              placeholder="สอบถามเวลาทำการ, ที่ตั้งร้าน, จัดแข่ง, หรือติดตั้งระบบ..."
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              disabled={isLoading}
            />
            <button 
              type="submit" 
              className="btn-chat-send"
              disabled={!inputText.trim() || isLoading}
              title="ส่งข้อความ"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
