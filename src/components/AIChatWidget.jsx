import React, { useState, useRef, useEffect } from 'react';
import { 
  Headphones, MessageSquare, X, Send, Sparkles, 
  RotateCw, ExternalLink, HelpCircle, ChevronRight, User, Terminal, Shield,
  CheckCircle2, ArrowRight, Share2, PhoneCall, MapPin, Clock, Trophy, Wrench,
  Globe, Compass, Layers, ShoppingBag, CreditCard, FileText
} from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { useTranslation } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';

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
              style={isInternal ? { fontWeight: 700, textDecoration: 'underline', color: '#1d4ed8' } : {}}
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
  desks: {
    th: `🖥️ **โต๊ะเกมมิ่ง & โต๊ะทำงานปรับระดับไฟฟ้า Gspeed (Gaming & Ergonomic Desks):**

• **Gspeed Pro Battle Desk (120x60, 140x60, 160x70 ซม.):**
  - โครงสร้างเหล็กคาร์บอนรีดเย็น (Cold-Rolled Carbon Steel) หนาพิเศษ แข็งแกร่ง รองรับน้ำหนักได้ 150-200 กก.
  - หน้าท็อปเคลือบลายคาร์บอนไฟเบอร์เกรด E1 กันน้ำ กันรอยขีดข่วน ทำความสะอาดง่าย
  - ถาดจัดเก็บซ่อนสายไฟเคเบิลใต้โต๊ะ (Cable Management Tray) พร้อมที่แขวนหูฟังและที่วางแก้วน้ำในตัว

• **Gspeed Electric Dual-Motor Standing Desk (โต๊ะปรับระดับไฟฟ้า):**
  - ปรับความสูงได้ลื่นไหลตั้งแต่ 72 - 120 ซม. ด้วยมอเตอร์คู่ (Dual Motor) เงียบเป็นพิเศษ < 45dB
  - แผงควบคุมดิจิทัล พร้อมระบบบันทึกความจำระดับความสูง 4 ระดับ (Memory Presets)
  - ระบบเซ็นเซอร์กันหนีบกันกระแทกอัตโนมัติ (Anti-Collision Safety System)

👉 [**คลิกที่นี่เพื่อดูรายละเอียดโต๊ะเกมมิ่งและราคาโปรโมชัน**](/products)
📞 สั่งผลิตขนาดพิเศษหรือสอบถามสต็อก โทร [063 793 7704](tel:0637937704) ได้เลยครับ`,
    en: `🖥️ **Gspeed Gaming Desks & Electric Standing Desks:**

• **Gspeed Pro Battle Desk (120x60, 140x60, 160x70 cm):**
  - Heavy-duty cold-rolled carbon steel frame supporting up to 150-200 kg with zero wobble.
  - E1-grade waterproof, scratch-resistant carbon fiber textured desktop.
  - Concealed under-desk cable management tray, headphone hanger, and integrated cup holder.

• **Gspeed Dual-Motor Ergonomic Standing Desk:**
  - Ultra-smooth height adjustment from 72 to 120 cm with whisper-quiet dual motors (< 45dB).
  - Smart LED digital panel with 4 customizable memory height presets.
  - Anti-collision gyroscopic safety sensor for automatic bounce-back.

👉 [**Click here to browse Gaming Desks & Options**](/products)
📞 Custom dimensions or bulk inquiries: Call [063 793 7704](tel:0637937704)!`,
    zh: `🖥️ **Gspeed 专业对战电竞桌与智能双电机升降桌：**

• **Gspeed Pro Battle 对战电竞桌 (120x60, 140x60, 160x70 cm)：**
  - 加厚冷轧碳钢框架，经久耐用，安全承重达 150-200 公斤。
  - E1级环保碳纤维纹理桌面，防水耐磨防刮擦，易于清洁。
  - 标配桌面隐藏式理线收纳槽、专业电竞耳机挂钩及防泼水杯架。

• **Gspeed 双电机智能升降工学桌：**
  - 72 - 120 cm 平稳顺滑升降，双电机静音运行（< 45dB）。
  - 数显触控面板，支持 4 档常用高度智能记忆。
  - 遇阻回弹防夹安全保护系统。

👉 [**点击查看电竞桌系列详情与优惠**](/products)
📞 尺寸定制与大宗采购：请致电 [063 793 7704](tel:0637937704)！`
  },

  chairs: {
    th: `🪑 **เก้าอี้เกมมิ่ง & เก้าอี้สุขภาพ Ergonomic Gspeed (Chairs):**

• **Gspeed Pro Master Ergonomic Gaming Chair:**
  - ออกแบบตามหลักสรีรศาสตร์ (Ergonomic Fit) รองรับกระดูกสันหลังและช่วงเอว นั่งเล่นหรือทำงานต่อเนื่อง 10-14 ชม. ไม่เมื่อยล้า
  - หุ้มด้วยหนัง Hybrid PU เกรดพรีเมียม ระบายอากาศได้ดี ไม่สะสมความร้อน
  - ที่พักแขน 3D/4D ปรับระดับสูง-ต่ำ เลื่อนหน้า-หลัง และหมุนซ้าย-ขวาได้รอบทิศทาง
  - โช้คแก๊ส Class 4 ผ่านการรับรองมาตรฐานสากล SGS แข็งแกร่ง รับน้ำหนักได้ถึง 150-180 กก.
  - ปรับเอนนอนได้ 90° - 165° พร้อมระบบล็อกการเอน (Multi-tilt Mechanism)
  - หมอนรองคอและหมอนรองหลัง Memory Foam แท้ คืนตัวนุ่มสบาย

• **Gspeed Air-Flow Pro เก้าอี้สุขภาพตาข่าย Full Mesh:**
  - ตาข่ายเกาหลี High-Elastic Breathable Mesh ระบายอากาศรอบทิศทาง เย็นสบายไม่อับชื้น
  - ปรับความลึกเบาะนั่ง (Seat Depth) และระบบ Lumbar Support ซัพพอร์ตเอวอัตโนมัติตามสรีระ

👉 [**คลิกที่นี่เพื่อดูรายละเอียดเก้าอี้ทุกรุ่นและสั่งซื้อ**](/products)
📞 ทดลองนั่งตัวจริงได้ที่โชว์รูม หรือโทร [063 793 7704](tel:0637937704)`,
    en: `🪑 **Gspeed Ergonomic Gaming & Mesh Office Chairs:**

• **Gspeed Pro Master Ergonomic Gaming Chair:**
  - Full ergonomic spinal and lumbar support designed for 10-14+ hours of fatigue-free sitting.
  - Upholstered in premium breathable Hybrid PU leather, resisting wear and heat buildup.
  - 3D/4D multidirectional adjustable armrests and 90°-165° backrest reclining lock.
  - SGS-certified Class 4 heavy-duty gas cylinder supporting up to 150-180 kg safely.
  - High-density magnetic memory foam headrest and lumbar support pillows.

• **Gspeed Air-Flow Pro Full Mesh Ergonomic Chair:**
  - High-elastic imported Korean mesh providing 360° airflow and all-day cooling comfort.
  - Adjustable seat slide depth and dynamic adaptive lumbar support.

👉 [**Click here to browse Gaming & Ergonomic Chairs**](/products)
📞 Experience chairs at our showroom or call [063 793 7704](tel:0637937704)!`,
    zh: `🪑 **Gspeed 专业电竞椅与人体工学透气网椅：**

• **Gspeed Pro Master 人体工学专业电竞椅：**
  - 全贴合人体工学支撑曲线，强力护腰护颈，久坐对战 10-14 小时不酸痛。
  - 采用高耐磨透气混动皮革（Hybrid PU），触感细腻且散热迅速。
  - 3D/4D 多向灵活可调扶手，支持 90°-165° 靠背多档后仰与逍遥锁定。
  - SGS 国际认证 Class 4 防爆气压杆，安全承重高达 150-180 公斤。
  - 标配慢回弹记忆棉护颈头枕与人体工学腰靠。

• **Gspeed Air-Flow Pro 全特网人体工学椅：**
  - 进口高弹全透气特网，全方位通风透气，久坐清凉不闷热。
  - 支持座深前后滑动调节及自适应动态腰托。

👉 [**点击查看电竞椅全部型号与在线选购**](/products)
📞 展厅试坐或客服咨询：[063 793 7704](tel:0637937704)！`
  },

  accessories: {
    th: `🎧 **อุปกรณ์เสริมจัดโต๊ะคอม & เกมมิ่งเกียร์ Gspeed (Accessories):**

• **แขนจับจอคอมพิวเตอร์ Gas Spring Heavy-Duty Monitor Arm:**
  - รองรับจอขนาด 17 - 34 นิ้ว (VESA 75x75, 100x100 มม.) รับน้ำหนักได้ 2-9 กก. ต่อแขน
  - ระบบสปริงแก๊สปรับความหนืดได้อิสระ หมุนจอแนวตั้ง-นอน 360° ปรับก้ม-เงยได้สะดวก
• **แผ่นรองเมาส์ Speed & Control XXL (900x400 มม.):**
  - พื้นผิวผ้าทอละเอียดพิเศษ เคลือบสารกันน้ำ เย็บขอบไร้รอยต่อ ป้องกันการหลุดลุ่ย
• **รางปลั๊กไฟ & รางจัดเก็บสายเคเบิลมาตรฐาน มอก.:**
  - ซ่อนสายไฟเนียนตา ปลอดภัย ป้องกันไฟกระชาก
• **ล้อเก้าอี้ PU Roller Blade Caster Wheels:**
  - เคลื่อนที่ลื่นไหล ไร้เสียงรบกวน ไม่ขูดขีดพื้นไม้และกระเบื้อง

👉 [**คลิกที่นี่เพื่อดูอุปกรณ์เสริมทั้งหมด**](/products)
📞 สอบถามสินค้าเพิ่มเติม โทร [063 793 7704](tel:0637937704)`,
    en: `🎧 **Gspeed Setup Accessories & Gaming Gear:**

• **Gas Spring Heavy-Duty Monitor Arms:**
  - Compatible with 17"-34" monitors (VESA 75x75, 100x100 mm), supporting 2-9 kg per arm.
  - Smooth gas spring counterbalance, 360° rotation (landscape/portrait), and tilt/swivel adjustments.
• **XXL Speed & Control Desk Mousepad (900x400 mm):**
  - Precision micro-woven cloth surface with waterproof coating and anti-fray stitched edges.
  - Non-slip natural rubber base.
• **Heavy-Duty Cable Raceway & Surge Protector:**
  - Clean cable management ensuring workstation safety.
• **PU Rollerblade Silent Caster Wheels:**
  - Whisper-quiet glide that protects delicate hardwood and tiled floors.

👉 [**Click here to browse Accessories**](/products)
📞 Questions? Call [063 793 7704](tel:0637937704)!`,
    zh: `🎧 **Gspeed 桌面外设与电竞配件：**

• **气压式高承重显示器机械臂支架：**
  - 兼容 17-34 寸显示器 (VESA 75/100mm)，单臂承重 2-9 公斤。
  - 气压弹簧助力自由悬停，支持 360° 横竖屏旋转、俯仰与左右角度调节。
• **XXL 超大桌面电竞锁边鼠标垫 (900x400 mm)：**
  - 高密度微编织面料，疏水防泼溅涂层，精密锁边不脱线。
• **工业级桌面排插与下挂式理线槽：**
  - 彻底告别杂乱线缆，安全防浪涌。
• **PU 静音轮滑椅轮：**
  - 静音顺滑滚动，不伤实木地板与瓷砖。

👉 [**点击查看全部外设配件**](/products)
📞 选购咨询：请致电 [063 793 7704](tel:0637937704)！`
  },

  b2b_quotation: {
    th: `🏢 **การสั่งซื้อราคาส่ง B2B, งานโครงการ และการออกใบเสนอราคา (Quotation):**

สิทธิพิเศษสำหรับร้านอินเทอร์เน็ตคาเฟ่, สตูดิโออีสปอร์ต, ออฟฟิศสำนักงาน และโครงการสั่งซื้อจำนวนมาก:

💰 **ส่วนลดราคาส่งตามจำนวนชิ้น (Volume Discount):**
• ซื้อ **5 - 9 ชิ้น:** รับส่วนลดทันที **5%**
• ซื้อ **10 - 19 ชิ้น:** รับส่วนลดทันที **10%**
• ซื้อ **20 ชิ้นขึ้นไป:** รับส่วนลดสูงสุด **15%** ทันทีทั้งบิล

📄 **ระบบออกใบเสนอราคาทางการ (Quotation PDF) ทันทีบนเว็บ:**
• เพียงเลือกสินค้าลงตะกร้า แล้วกดปุ่ม **"📄 ออกใบเสนอราคา (Quotation PDF)"**
• ระบบจะสร้างเอกสารใบเสนอราคาทางการ (QT-xxxx) พร้อมหัวกระดาษบริษัท, รายละเอียดสินค้า, ส่วนลด B2B และภาษีมูลค่าเพิ่ม (VAT 7%) ดาวน์โหลดหรือพิมพ์ได้ทันทีใน 1 วินาที!
• ออกใบกำกับภาษีเต็มรูปแบบ (Full Tax Invoice) ได้ทุกคำสั่งซื้อ

👉 [**คลิกที่นี่เพื่อไปที่ตะกร้าสินค้า / ออกใบเสนอราคา**](/franchise)
📞 ปรึกษาโครงการหรือขอใบเสนอราคาด่วน โทร [063 793 7704](tel:0637937704) หรือแจ้งรายการในแชทนี้ได้เลยครับ`,
    en: `🏢 **B2B Bulk Orders, Corporate Projects & Official Quotations:**

Exclusive volume discounts for cyber cafes, esports academies, studios, and corporate offices:

💰 **B2B Volume Discount Tiers:**
• **5 - 9 units:** Instant **5% Discount**
• **10 - 19 units:** Instant **10% Discount**
• **20+ units:** Maximum **15% Discount** applied automatically!

📄 **Instant Official Quotation PDF Generation:**
• Add your desired desks, chairs, and accessories to the cart, then click **"📄 Quotation (PDF)"**.
• Instantly generates an official quotation document (QT-xxxx) with company header, volume discounts, and 7% VAT breakdown.
• Official Full Tax Invoices issued for all purchases.

👉 [**Click here to view Cart & Generate Quotation**](/franchise)
📞 Corporate inquiries & large tenders: Call [063 793 7704](tel:0637937704)!`,
    zh: `🏢 **B2B 网咖、电竞馆与企事业单位大宗采购批发方案：**

专为电竞网咖、赛事训练基地、直播工作室及企业办公室提供专属大宗批发特惠：

💰 **阶梯式批发采购折扣：**
• 采购 **5 - 9 件：** 立享 **5% 优惠折扣**
• 采购 **10 - 19 件：** 立享 **10% 优惠折扣**
• 采购 **20 件及以上：** 立享最高 **15% 批量批发折扣**

📄 **网站一键即时生成官方正规报价单 (Quotation PDF)：**
• 将所需桌椅及配件加入购物车，点击 **"📄 生成报价单 (Quotation PDF)"** 按钮。
• 系统即刻自动生成带 Gspeed 公司正规抬头的正式报价单 (QT-xxxx)，包含阶梯折扣与 7% 增值税计算，可直接打印或下载 PDF 报销请款！
• 所有采购均可开具正规全额增值税专用发票 (Full Tax Invoice)。

👉 [**点击前往购物车 / 申请正规报价单**](/franchise)
📞 大宗项目咨询专线：[063 793 7704](tel:0637937704)！`
  },

  shipping_installation: {
    th: `🚚 **บริการจัดส่งและประกอบติดตั้งหน้างาน (Delivery & Installation):**

• **ฟรีค่าจัดส่งทั่วประเทศ!** ไม่มีค่าใช้จ่ายแอบแฝง
• **เขตกรุงเทพฯ และปริมณฑล:**
  - มีบริการทีมช่างผู้เชี่ยวชาญจัดส่งและประกอบติดตั้งหน้างาน (On-site Assembly) ถึงที่
  - จัดวางโต๊ะ เก้าอี้ เซ็ตระดับความสูงให้พร้อมใช้งาน และเก็บกวาดขยะบรรจุภัณฑ์เรียบร้อย
• **ต่างจังหวัดทั่วไทย:**
  - จัดส่งผ่านขนส่งเอกชนแบบด่วนพิเศษ มีประกันคุ้มครองสินค้าเสียหายระหว่างขนส่ง 100%
  - บรรจุกล่องกันกระแทกอย่างหนา พร้อมคู่มือประกอบและวิดีโอแนะนำอย่างละเอียด
• **ระยะเวลาจัดส่ง:**
  - สินค้าพร้อมส่ง: จัดส่งถึงภายใน 1 - 3 วันทำการ
  - สินค้าสั่งผลิตตามแบบพิเศษ / งานโครงการจำนวนมาก: จัดส่งภายใน 7 - 14 วันทำการ

📞 นัดหมายวันจัดส่งหรือสอบถามคิวช่าง โทร [063 793 7704](tel:0637937704) ได้ตลอดครับ`,
    en: `🚚 **Nationwide Delivery & Professional Assembly Service:**

• **FREE Shipping Nationwide across Thailand!**
• **Bangkok & Greater Metropolitan Area:**
  - Delivery with full on-site professional assembly service by trained technicians.
  - Ergonomic positioning and packaging disposal included.
• **All Other Provinces:**
  - Shipped via insured express freight with 100% transit damage protection.
  - Reinforced shockproof packaging with clear step-by-step manuals and video tutorials.
• **Delivery Timeframe:**
  - In-stock inventory: Shipped within 1 - 3 business days.
  - Custom configurations / bulk project orders: Delivered in 7 - 14 business days.

📞 Schedule delivery or check logistics status: Call [063 793 7704](tel:0637937704)!`,
    zh: `🚚 **全泰物流配送与专业上门安装服务：**

• **全泰国境内包邮免费配送！**
• **曼谷及周边大都会区：**
  - 提供专业安装技师免费送货上门并现场组装调试，摆放到位并清理包装废料。
• **外府各府地区：**
  - 采用顺丰/大型品牌特快物流保价直达，享受 100% 运输破损全包保障。
  - 加厚蜂窝纸箱及高密度海绵防护包装，附赠详尽安装说明书与组装演示视频。
• **发货周期：**
  - 现货商品：下单后 1 - 3 个工作日送达。
  - 尺寸定制与批量工程订单：7 - 14 个工作日保质交付。

📞 物流与安装预约热线：[063 793 7704](tel:0637937704)！`
  },

  warranty: {
    th: `🛡️ **การรับประกันคุณภาพและการดูแลหลังการขาย (Warranty & Support):**

• **รับประกันโครงสร้างเหล็กโต๊ะและเก้าอี้นาน 3 - 5 ปี** (โครงสร้างเหล็กคาร์บอนและจุดเชื่อม)
• **รับประกันระบบมอเตอร์ไฟฟ้าและกล่องควบคุมโต๊ะปรับระดับ 3 ปี**
• **รับประกันโช้คแก๊ส Class 4 และกลไกปรับเอนเก้าอี้นาน 2 ปี**
• **บริการสต็อกอะไหล่แท้ (Genuine Spare Parts):** มีอะไหล่พร้อมเปลี่ยนตลอดอายุการใช้งาน ไม่ต้องรอนำเข้า
• บริการตรวจเช็กและซ่อมบำรุงถึงสถานที่สำหรับลูกค้าร้านเกมและโครงการ B2B

📞 ติดต่อฝ่ายบริการลูกค้าหรือแจ้งเคลมประกัน โทร [063 793 7704](tel:0637937704) ได้ทันทีครับ`,
    en: `🛡️ **Warranty & Comprehensive After-Sales Support:**

• **3 to 5-Year Structural Frame Warranty** on all carbon steel desks & chairs.
• **3-Year Warranty** on dual electric height-adjustment motors & digital control boxes.
• **2-Year Warranty** on SGS-certified Class 4 gas cylinders and multi-tilt mechanisms.
• **Genuine Spare Parts Guarantee:** Extensive local spare parts stock ensuring rapid replacement without long import waits.
• Dedicated on-site maintenance support for B2B venues and cyber cafes.

📞 Warranty claims & technical support: Call [063 793 7704](tel:0637937704)!`,
    zh: `🛡️ **产品质保与原厂售后服务承诺：**

• **电竞桌及电竞椅主体碳钢架构提供 3 - 5 年超长质保**。
• **升降桌双电机及数控电控系统提供 3 年质保**。
• **SGS认证防爆气压杆与底盘调角器提供 2 年质保**。
• **原厂常备配件库：** 常用配件现货储备，质保期内极速更换，终身享受原厂配件平价供应。
• 针对网咖与企业大宗客户提供专属定期巡检与上门维护保障。

📞 售后服务与保修专线：[063 793 7704](tel:0637937704)！`
  },

  payment: {
    th: `💳 **ช่องทางการชำระเงิน (Payment Methods):**

• **ชำระเต็มจำนวน 100% (Full Payment):** ปลอดภัย จัดส่งสินค้าพร้อมประกัน On-site Service ทันที
• **ช่องทางที่รองรับ:**
  1. **พร้อมเพย์ Thai QR Code:** สแกนจ่ายได้ทุกแอปพลิเคชันธนาคาร สะดวก รวดเร็ว
  2. **โอนเงินผ่านบัญชีธนาคาร:** ธนาคารกสิกรไทย (KBANK) หรือ ธนาคารไทยพาณิชย์ (SCB) ในนามบัญชีทางการ บจก. จี สปีด ลิฟวิ่ง พลัส
  3. **บัตรเครดิต / บัตรเดบิต**
• ออกใบเสร็จรับเงินและใบกำกับภาษีเต็มรูปแบบ (Full Tax Invoice) ทุกยอดการสั่งซื้อ

👉 [**คลิกที่นี่เพื่อไปหน้าสั่งซื้อและชำระเงิน**](/checkout)
📞 แจ้งหลักฐานการโอนหรือสอบถามการชำระเงิน โทร [063 793 7704](tel:0637937704)`,
    en: `💳 **Payment Methods & Flexible Deposit Plans:**

• **Full Payment (100%):** Processed immediately for in-stock orders.
• **Flexible Deposit Plans for Custom & B2B Orders:**
  - **30% Deposit:** Remaining 70% payable upon on-site delivery and assembly.
  - **50% Deposit:** Remaining 50% payable upon delivery.
• **Supported Methods:**
  1. **Thai QR PromptPay:** Instant scan & pay via any mobile banking app.
  2. **Direct Bank Wire Transfer:** KBank / SCB to official corporate account (G Speed Living Plus Co., Ltd.).
  3. **Credit / Debit Cards**
• Full Tax Invoices and official receipts issued with all orders.

👉 [**Click here to proceed to Checkout**](/checkout)
📞 Payment support & slip confirmation: Call [063 793 7704](tel:0637937704)!`,
    zh: `💳 **付款结算方式与灵活定金方案：**

• **全款支付 (100%)：** 现货订单即刻安排打包出库。
• **大宗及定制订单灵活定金方案：**
  - **预付 30% 定金：** 尾款 70% 在现场送货安装验收合格后支付。
  - **预付 50% 定金：** 尾款 50% 在送达交付验收当日支付。
• **支持的结算渠道：**
  1. **PromptPay 二维码：** 泰国任意手机银行即扫即付，秒级到账。
  2. **对公账户电汇转账：** 开泰银行 (KBank) 或 汇商银行 (SCB) G Speed Living Plus 公司官方账号。
  3. **信用卡 / 借记卡**
• 随单开具正规增值税专用发票及盖章收据。

👉 [**点击前往收银台结账付款**](/checkout)
📞 财务与查账咨询：[063 793 7704](tel:0637937704)！`
  },

  showroom: {
    th: `📍 **โชว์รูมและทดลองสัมผัสสินค้าจริง (Gspeed Showroom):**

สามารถเดินทางเข้ามาทดลองนั่งเก้าอี้และสัมผัสโต๊ะตัวจริงได้ที่:
🏢 **G-Speed Living Plus Showroom:**
79 ซอยรามคำแหง 53 แขวงพลับพลา เขตวังทองหลาง กรุงเทพมหานคร 10310

🗺️ **Google Maps:** [คลิกเปิดแผนที่นำทาง Google Maps](https://share.google/Fj1DmZjpx1cBNBVTf) (https://share.google/Fj1DmZjpx1cBNBVTf)
📞 **โทรศัพท์นัดหมาย:** [063 793 7704](tel:0637937704)
🚗 มีที่จอดรถสะดวกสบาย เปิดให้เข้าชมทุกวันครับ`,
    en: `📍 **Gspeed Experience Showroom & Store Location:**

You are welcome to visit our showroom to test all chairs and desks in person:
🏢 **G-Speed Living Plus Showroom:**
79 Soi Ramkhamhaeng 53, Phlabphla, Wang Thonglang, Bangkok 10310, Thailand

🗺️ **Google Maps:** [Open in Google Maps](https://share.google/Fj1DmZjpx1cBNBVTf) (https://share.google/Fj1DmZjpx1cBNBVTf)
📞 **Phone / Appointment:** [063 793 7704](tel:0637937704)
🚗 Dedicated parking available. Open daily!`,
    zh: `📍 **Gspeed 线下实体体验展厅地址：**

欢迎亲临展厅实地试坐与体验全系电竞桌椅与人体工学配件：
🏢 **G-Speed Living Plus 展厅：**
曼谷市汪通郎区普拉帕拉街道蓝甘杏53巷79号 (79 Soi Ramkhamhaeng 53, Phlabphla, Wang Thonglang, Bangkok 10310)

🗺️ **谷歌地图导航：** [点击打开 Google Maps](https://share.google/Fj1DmZjpx1cBNBVTf) (https://share.google/Fj1DmZjpx1cBNBVTf)
📞 **预约与联系电话：** [063 793 7704](tel:0637937704)
🚗 专属停车场车位充裕，每日均开放参观！`
  },

  franchiseRedirect: {
    th: `💡 **แจ้งข้อมูลเรื่องการเปิดร้าน / แฟรนไชส์:**
ปัจจุบันทาง **G-Speed Living Plus** ได้มุ่งเน้นการให้บริการเป็น **ศูนย์จำหน่ายโต๊ะ เก้าอี้เกมมิ่ง และอุปกรณ์ครบวงจร** พร้อมบริการจัดส่งและประกอบติดตั้งหน้างานแทนระบบแฟรนไชส์เดิมครับ

หากท่านเป็นเจ้าของร้านเกม อินเทอร์เน็ตคาเฟ่ หรือออฟฟิศ ที่ต้องการสั่งซื้อโต๊ะ เก้าอี้ หรืออุปกรณ์จัดร้าน:
• สั่งซื้อ 5-9 ชิ้น ลด 5% | 10-19 ชิ้น ลด 10% | 20+ ชิ้น ลด 15%
• ออกใบเสนอราคาทางการ (Quotation PDF) ได้เองบนเว็บทันที
• มีทีมช่างจัดส่งและประกอบติดตั้งหน้างานฟรีทั่วประเทศ

👉 [**คลิกที่นี่เพื่อเลือกชมโต๊ะ เก้าอี้ และอุปกรณ์ราคาส่ง B2B**](/products)
📞 สอบถามโปรโมชันร้านเกม โทร [063 793 7704](tel:0637937704) ได้เลยครับ`,
    en: `💡 **Update Regarding Franchise & Store Opening:**
**G-Speed Living Plus** currently specializes in **Direct Supply of Gaming Desks, Ergonomic Chairs, and Setup Equipment** with nationwide delivery and on-site assembly, replacing the traditional franchise model.

If you are opening or upgrading a cyber cafe, esports center, or corporate office:
• Volume discounts: 5-9 pcs (5% off), 10-19 pcs (10% off), 20+ pcs (15% off).
• Generate official Quotation PDFs instantly online.
• Professional nationwide logistics & on-site assembly included.

👉 [**Click here to browse B2B Equipment & Wholesale Pricing**](/products)
📞 Project inquiries: Call [063 793 7704](tel:0637937704)!`,
    zh: `💡 **关于加盟开店模式调整的特别说明：**
目前 **G-Speed Living Plus** 已全面升级聚焦为 **专业电竞桌椅与高端外设硬件一站式直供中心**，提供全泰物流配送与上门安装服务，不再沿用传统加盟店模式。

如果您正筹备开设或升级电竞网咖、赛事馆或企业办公室：
• 阶梯式批发折扣：5-9件（95折）、10-19件（9折）、20件以上（85折）。
• 网站支持即刻一键生成正式官方报价单 (Quotation PDF)。
• 曼谷及周边享专业师傅免费上门拼装，全泰保价物流直达。

👉 [**点击查看B2B大宗采购桌椅与配件目录**](/products)
📞 网咖大宗项目咨询：[063 793 7704](tel:0637937704)！`
  },

  greetings: {
    th: `สวัสดีครับ ยินดีต้อนรับสู่ **G-Speed Living Plus** ครับ! 😊
สามารถสอบถามสเปกโต๊ะเกมมิ่ง, เก้าอี้สุขภาพ Ergonomic, อุปกรณ์เสริม, การขอใบเสนอราคา หรือส่วนลดราคาส่ง B2B ได้เลยครับ เจ้าหน้าที่พร้อมให้คำแนะนำทันทีครับ!`,
    en: `Hello! Welcome to **G-Speed Living Plus**! 😊
Ask us about gaming desks, ergonomic mesh chairs, accessories, instant quotations, or B2B bulk purchase discounts. How can we help you today?`,
    zh: `您好！欢迎光临 **G-Speed Living Plus** 电竞装备专营！😊
您可以随时咨询电竞桌、人体工学椅、周边配件规格、官方报价单或大宗采购优惠。请问有什么可以为您效劳？`
  },

  outOfScope: {
    th: `ขออภัยด้วยครับ ทางเจ้าหน้าที่สามารถให้ข้อมูลเกี่ยวกับสินค้าของ G-Speed Living Plus ได้แก่: สเปกโต๊ะเกมมิ่ง, เก้าอี้สุขภาพ Ergonomic, อุปกรณ์จัดโต๊ะคอม, การออกใบเสนอราคา (Quotation), ส่วนลดราคาส่ง B2B, การจัดส่งติดตั้ง และการรับประกันสินค้าครับ หากมีข้อสงสัยสอบถามได้ทันที หรือโทร [063 793 7704](tel:0637937704) ครับ`,
    en: `Sorry, our support team specializes in G-Speed Living Plus equipment: gaming desks, ergonomic chairs, accessories, quotation PDFs, B2B wholesale discounts, shipping & assembly, and product warranties. Feel free to ask or call us at [063 793 7704](tel:0637937704).`,
    zh: `抱歉，客服专员可为您提供关于 G-Speed Living Plus 各项专业装备资讯：电竞桌、人体工学椅、外设配件规格、官方报价单 (Quotation)、B2B大宗批发优惠、全泰配送安装及质保服务。如有疑问欢迎随时咨询，或拨打电话 [063 793 7704](tel:0637937704)。`
  }
};

const WELCOME_MESSAGES = {
  th: 'สวัสดีครับ ยินดีต้อนรับสู่ **G-Speed Living Plus (GLP Store)** ครับ! 😊\n\nสามารถสอบถามสเปกโต๊ะเกมมิ่ง, เก้าอี้สุขภาพ Ergonomic, อุปกรณ์จัดโต๊ะคอม, การขอใบเสนอราคาทางการ หรือการสั่งซื้อราคาส่ง B2B ได้เลยครับ เจ้าหน้าที่พร้อมให้ข้อมูลครับ\n*(We support Thai, English, and Chinese / 支持泰语、英语和中文咨询)*',
  en: 'Hello! Welcome to **G-Speed Living Plus (GLP Store)**! 😊\n\nFeel free to ask about our gaming desks, ergonomic mesh chairs, setup accessories, official quotation PDFs, or B2B bulk purchase discounts. Our specialists are ready to assist you!\n*(We support Thai, English, and Chinese / 支持泰语、英语和中文咨询)*',
  zh: '您好！欢迎光临 **G-Speed Living Plus (GLP 官方装备商城)**！😊\n\n您可以随时咨询专业电竞桌、人体工学网椅、外设配件、申请官方正式报价单或网咖与企业大宗采购批发折扣。客服人员随时为您解答！\n*(We support Thai, English, and Chinese / 支持泰语、英语和中文咨询)*'
};

const translateQueryToThai = (query, lang) => {
  if (!query || lang === 'th') return null;
  const q = query.toLowerCase().trim();

  if (['chair', 'ergonomic', 'mesh', 'seat', 'recline', 'armrest', '椅子', '电竞椅', '人体工学椅', '工学椅', '网椅', '扶手', '靠背'].some(k => q.includes(k))) {
    return 'ลูกค้าสอบถาม: สเปก ฟังก์ชัน และราคาเก้าอี้เกมมิ่ง / เก้าอี้สุขภาพ Ergonomic';
  }
  if (['desk', 'table', 'standing', 'electric', 'motor', 'carbon', 'height', '桌', '升降桌', '电竞桌', '双电机', '碳纤维'].some(k => q.includes(k))) {
    return 'ลูกค้าสอบถาม: สเปก ขนาด และราคาโต๊ะเกมมิ่ง / โต๊ะปรับระดับไฟฟ้า';
  }
  if (['quote', 'quotation', 'pdf', 'estimate', 'invoice', 'tax', 'vat', '报价', '发票', '税', '报价单'].some(k => q.includes(k))) {
    return 'ลูกค้าสอบถาม: การขอใบเสนอราคาทางการ (Quotation PDF) หรือใบกำกับภาษีเต็มรูปแบบ';
  }
  if (['wholesale', 'b2b', 'bulk', 'volume', 'discount', 'cyber cafe', 'office', '批发', '大宗', '折扣', '网咖', '批量'].some(k => q.includes(k))) {
    return 'ลูกค้าสอบถาม: ส่วนลดราคาส่ง B2B และการสั่งซื้อจำนวนมากสำหรับร้านเกมหรือออฟฟิศ';
  }
  if (['deliver', 'shipping', 'install', 'assembly', 'setup', 'onsite', '配送', '安装', '组装', '包邮', '上门'].some(k => q.includes(k))) {
    return 'ลูกค้าสอบถาม: บริการจัดส่งฟรี และทีมช่างประกอบติดตั้งหน้างาน';
  }
  if (['warranty', 'guarantee', 'repair', 'broken', 'spare', '质保', '保修', '损坏', '配件', '换件'].some(k => q.includes(k))) {
    return 'ลูกค้าสอบถาม: ระยะเวลาการรับประกันสินค้า (3-5 ปี) และบริการอะไหล่ซ่อมบำรุง';
  }
  if (['pay', 'payment', 'deposit', 'promptpay', 'card', 'transfer', '支付', '付款', '定金', '转账', '信用卡'].some(k => q.includes(k))) {
    return 'ลูกค้าสอบถาม: ช่องทางชำระเงิน (พร้อมเพย์/โอน/บัตร) และตัวเลือกมัดจำ 30%-50%';
  }
  if (['showroom', 'visit', 'try', 'address', 'location', 'map', 'where', '展厅', '试坐', '地址', '位置', '体验'].some(k => q.includes(k))) {
    return 'ลูกค้าสอบถาม: ที่ตั้งโชว์รูมทดลองสินค้าจริง (ซอยรามคำแหง 53) และแผนที่';
  }
  if (['accessory', 'monitor arm', 'mousepad', 'wheel', 'cable', '配件', '支架', '鼠标垫', '轮子'].some(k => q.includes(k))) {
    return 'ลูกค้าสอบถาม: อุปกรณ์เสริม ขาตั้งจอ แผ่นรองเมาส์ หรืออุปกรณ์จัดสายไฟ';
  }
  if (['franchise', 'open shop', 'open cafe', 'invest', '加盟', '开网吧', '开店'].some(k => q.includes(k))) {
    return 'ลูกค้าสอบถามเรื่องแฟรนไชส์เดิม (ระบบแนะนำการสั่งซื้อโต๊ะเก้าอี้อุปกรณ์ราคาส่งแทน)';
  }
  if (['hello', 'hi', 'hey', '你好', '您好', '在吗'].some(k => q.includes(k))) {
    return 'ลูกค้าส่งข้อความทักทาย (สวัสดี / มีใครอยู่ไหม)';
  }

  return `ลูกค้าสอบถาม (${lang === 'en' ? 'ภาษาอังกฤษ' : 'ภาษาจีน'}): "${query}"`;
};

// Real-Time Order Tracking Resolver for AI Chat Widget
const checkOrderStatusQuery = (query, lang = 'th', savedOrders = []) => {
  if (!query) return null;
  const q = query.trim().toLowerCase();

  // 1. General tracking inquiry indicators
  const isGeneralTrackingQuery = [
    'ติดตามออเดอร์', 'เช็คสถานะ', 'ตามของ', 'พัสดุถึงไหน', 'ของถึงไหน', 'เช็คพัสดุ', 
    'ตามสินค้า', 'ตามเลขคำสั่งซื้อ', 'เช็คเลขออเดอร์', 'ติดตามคำสั่งซื้อ', 'เช็คคำสั่งซื้อ',
    'track order', 'order status', 'check order', 'where is my order', 'tracking',
    '查订单', '订单状态', '物流查询', '包裹到哪了', '查件'
  ].some(k => q.includes(k));

  // 2. Extract potential Order Number (e.g. GS-ORD-20261003-5587 or 20261003-5587)
  const orderRegex = /(GS-ORD-[0-9A-Za-z-]+|[0-9]{8,14}|[0-9]{4}-[0-9]{4})/i;
  const matchOrder = query.match(orderRegex);
  const candidateNumber = matchOrder ? matchOrder[0].toLowerCase().trim() : null;

  // 3. Extract potential 10-digit Phone Number (e.g. 0812345678, 0909762587)
  const phoneDigits = query.replace(/[^0-9]/g, '');
  const candidatePhone = (phoneDigits.length === 10 && phoneDigits.startsWith('0')) ? phoneDigits : null;

  // Look up in savedOrders
  let found = null;
  if (candidateNumber) {
    found = savedOrders.find(o => 
      o.orderNo?.toLowerCase() === candidateNumber ||
      o.orderNo?.toLowerCase().includes(candidateNumber) ||
      candidateNumber.includes(o.orderNo?.toLowerCase())
    );
  }
  if (!found && candidatePhone) {
    found = savedOrders.find(o => 
      (o.shipping?.phone || '').replace(/[^0-9]/g, '') === candidatePhone
    );
  }
  if (!found) {
    found = savedOrders.find(o => 
      (o.orderNo && q.includes(o.orderNo.toLowerCase())) ||
      (o.shipping?.phone && q.includes(o.shipping.phone.replace(/[^0-9]/g, '')))
    );
  }

  // Fallback to localStorage directly if needed
  if (!found && typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem('gspeed_saved_orders_v2');
      if (raw) {
        const localList = JSON.parse(raw);
        if (Array.isArray(localList)) {
          if (candidateNumber) {
            found = localList.find(o => 
              o.orderNo?.toLowerCase() === candidateNumber ||
              o.orderNo?.toLowerCase().includes(candidateNumber) ||
              candidateNumber.includes(o.orderNo?.toLowerCase())
            );
          }
          if (!found && candidatePhone) {
            found = localList.find(o => 
              (o.shipping?.phone || '').replace(/[^0-9]/g, '') === candidatePhone
            );
          }
        }
      }
    } catch (e) {
      // ignore
    }
  }

  const getStatusInfo = (status) => {
    switch (status) {
      case 'order_received':
        return {
          title: 'รับคำสั่งซื้อแล้ว (รอการชำระเงินหรือแนบสลิป)',
          desc: 'ระบบบันทึกคำสั่งซื้อเรียบร้อยแล้ว กำลังรอการชำระเงินและแนบหลักฐาน',
          step: '1/5'
        };
      case 'verifying_payment':
        return {
          title: 'กำลังตรวจสอบสลิปหลักฐานการชำระเงิน (รอการตรวจสอบ)',
          desc: 'เจ้าหน้าที่ฝ่ายการเงินกำลังดำเนินการตรวจสอบยอดเงินในบัญชี (ใช้เวลาประมาณ 5 - 15 นาที)',
          step: '2/5'
        };
      case 'payment_verified':
        return {
          title: 'ตรวจสอบยอดเงินเรียบร้อยแล้ว (Payment Verified)',
          desc: 'ยอดเงินถูกต้อง ส่งต่อไปยังฝ่ายคลังสินค้าเพื่อจัดเตรียมอุปกรณ์แล้ว',
          step: '2/5 (เสร็จสมบูรณ์)'
        };
      case 'payment_issue':
        return {
          title: 'แจ้งเตือน: พบปัญหาเรื่องสลิปหรือยอดเงินไม่ตรง',
          desc: 'กรุณาตรวจสอบสลิปหลักฐาน หรืออัปโหลดใหม่อีกครั้งผ่านหน้าติดตามสถานะ',
          step: 'ต้องแก้ไขสลิป'
        };
      case 'preparing_items':
        return {
          title: 'กำลังจัดเตรียมอุปกรณ์ & ตรวจสอบคุณภาพ (QC)',
          desc: 'ฝ่ายคลังสินค้ากำลังจัดของ ประกอบ ตรวจสอบสภาพ และจองคิวรถขนส่ง',
          step: '3/5'
        };
      case 'shipping':
        return {
          title: 'กำลังจัดส่งสินค้า (On Delivery)',
          desc: 'สินค้าอยู่ระหว่างการจัดส่งไปยังที่อยู่ของท่าน ทีมช่างจะโทรนัดหมายล่วงหน้าก่อนเข้าส่ง',
          step: '4/5'
        };
      case 'delivered':
      case 'completed':
        return {
          title: 'จัดส่งและประกอบติดตั้งสำเร็จเรียบร้อย (Delivered)',
          desc: 'ตรวจรับมอบงานเรียบร้อย ขอบพระคุณที่ไว้วางใจ Gspeed Living Plus!',
          step: '5/5'
        };
      default:
        return {
          title: 'กำลังดำเนินการในระบบ',
          desc: 'เจ้าหน้าที่กำลังดูแลคำสั่งซื้อของท่านอย่างใกล้ชิด',
          step: '-'
        };
    }
  };

  // Case 1: Order Found
  if (found) {
    const st = getStatusInfo(found.status);
    const dateStr = new Date(found.createdAt).toLocaleDateString('th-TH', { 
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
    });
    const itemsList = (found.items || []).map(i => `• **${i.name}** x${i.quantity || 1}`).join('\n');
    const carrierInfo = found.trackingNo ? `\n🚚 **บริษัทขนส่ง:** ${found.carrier || 'KEX / Flash Express'} | **เลขพัสดุ:** \`${found.trackingNo}\`` : '';

    if (lang === 'zh') {
      return `📦 **查询到您的订单信息 - 订单号: ${found.orderNo}**

👤 **收件人:** ${found.shipping?.receiverName || '-'} (电话: ${found.shipping?.phone || '-'})
📅 **下单时间:** ${dateStr}
💰 **订单实付:** ฿${(found.pricing?.grandTotal || 0).toLocaleString()}.- (${found.hasSlipUploaded ? '已上传付款凭证' : '待付款'})

📍 **当前物流状态: ${st.title}**
• **进度:** ขั้นตอน ${st.step}
• **详情:** ${st.desc}${carrierInfo}

🛍️ **所购商品清单:**
${itemsList}

👉 [**点击查看完整订单详情与电子发票**](/orders/${found.orderNo})
💡 *(提示：不需要注册会员，保存此订单号随时可查)*`;
    }

    if (lang === 'en') {
      return `📦 **Found Your Order: ${found.orderNo}**

👤 **Customer:** ${found.shipping?.receiverName || '-'} (Phone: ${found.shipping?.phone || '-'})
📅 **Order Date:** ${dateStr}
💰 **Grand Total:** ฿${(found.pricing?.grandTotal || 0).toLocaleString()}.- (${found.hasSlipUploaded ? 'Slip Attached' : 'Awaiting Payment'})

📍 **Current Status: ${st.title}**
• **Progress:** Step ${st.step}
• **Details:** ${st.desc}${carrierInfo}

🛍️ **Items in Order:**
${itemsList}

👉 [**Click here to view Full Order Details & Invoice**](/orders/${found.orderNo})
💡 *(Note: Membership is not required. Keep your Order No. to track anytime)*`;
    }

    return `📦 **พบข้อมูลคำสั่งซื้อเลขที่: ${found.orderNo}**

👤 **ผู้สั่งซื้อ:** ${found.shipping?.receiverName || '-'} (เบอร์ติดต่อ: ${found.shipping?.phone || '-'})
📅 **วันที่สั่งซื้อ:** ${dateStr} น.
💰 **ยอดชำระสุทธิ:** ฿${(found.pricing?.grandTotal || 0).toLocaleString()} บาท (${found.hasSlipUploaded ? '✓ แนบสลิปเรียบร้อย' : 'รอการชำระเงิน'})

📍 **สถานะปัจจุบัน: ${st.title}**
• **ความคืบหน้า:** ขั้นตอนที่ ${st.step}
• **รายละเอียด:** ${st.desc}${carrierInfo}

🛍️ **รายการสินค้าในคำสั่งซื้อ:**
${itemsList}

👉 [**คลิกที่นี่เพื่อเปิดดูใบสั่งซื้อ / รายละเอียดเต็ม**](/orders/${found.orderNo})
💡 *(หมายเหตุ: สมาชิกไม่จำเป็นต้องสมัครครับ มีเพียงเลขคำสั่งซื้อก็ติดตามสถานะได้ตลอด 24 ชม.)*`;
  }

  // Case 2: Mentioned Order Number or Phone that wasn't found
  if (candidateNumber || candidatePhone) {
    if (lang === 'zh') {
      return `🔍 **系统中未查询到该订单号 (${candidateNumber || candidatePhone})**

请确认您的订单编号是否正确（示例: **GS-ORD-20261003-5587**）或提供下单时填写的10位手机号。
*(提示：无需注册会员即可查单)*

📞 客服人工热线：[063 793 7704](tel:0637937704)`;
    }
    if (lang === 'en') {
      return `🔍 **Order not found for "${candidateNumber || candidatePhone}"**

Please check your Order Number format (e.g., **GS-ORD-20261003-5587**) or your 10-digit phone number.
*(Note: No membership registration needed)*

📞 Support hotline: [063 793 7704](tel:0637937704)`;
    }
    return `🔍 **ไม่พบข้อมูลคำสั่งซื้อที่ตรงกับ "${candidateNumber || candidatePhone}" ในระบบ**

รบกวนตรวจสอบหมายเลขคำสั่งซื้ออีกครั้งครับ (ตัวอย่างเช่น **GS-ORD-20261003-5587**) หรือพิมพ์เบอร์โทรศัพท์ 10 หลักที่ใช้สั่งซื้อเข้ามาได้เลยครับ

💡 *(สมาชิกไม่จำเป็นต้องสมัครครับ มีแค่เลขคำสั่งซื้อก็เช็คได้ตลอดเวลา)*
📞 หรือสอบถามเจ้าหน้าที่โดยตรง โทร [063 793 7704](tel:0637937704) ได้ตลอดครับ`;
  }

  // Case 3: General tracking question without numbers
  if (isGeneralTrackingQuery) {
    if (lang === 'zh') {
      return `📦 **订单与物流追踪服务 (Order Tracking):**

您只需在聊天框直接输入您的 **订单号 (如 GS-ORD-20261003-5587)** 或 **下单电话号码**，机器人将立即为您查询实时物流进度！🚀

💡 *(会员无需注册，凭订单号即可全天24小时查询)*
👉 或 [**点击前往订单搜索页面**](/checkout?step=tracking)`;
    }
    if (lang === 'en') {
      return `📦 **Order Tracking Service:**

Simply type your **Order Number (e.g., GS-ORD-20261003-5587)** or **Phone Number** into this chat, and we will track your package status in real time! 🚀

💡 *(No registration required. Track anytime with your Order No.)*
👉 Or [**Click here to go to Order Search Page**](/checkout?step=tracking)`;
    }
    return `📦 **ระบบติดตามสถานะคำสั่งซื้อ (Order Tracking):**

เพียงพิมพ์ **หมายเลขคำสั่งซื้อ (เช่น GS-ORD-20261003-5587)** หรือ **เบอร์โทรศัพท์** ที่ใช้สั่งซื้อเข้ามาในช่องแชทนี้ได้เลยครับ! ทางเราจะตรวจสอบและรายงานสถานะพัสดุให้ทันทีครับ 🚀

💡 *(สมาชิกไม่จำเป็นต้องสมัครครับ มีแค่เลขคำสั่งซื้อก็ติดตามสถานะได้ตลอด 24 ชม.)*
👉 หรือ [**คลิกที่นี่เพื่อไปหน้าค้นหาคำสั่งซื้อ**](/checkout?step=tracking)`;
  }

  return null;
};

export default function AIChatWidget() {
  const { siteData, addPendingQuestion } = useSiteData();
  const { t, language } = useTranslation();
  const { savedOrders = [] } = useCart() || {};

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome-msg',
      role: 'assistant',
      text: WELCOME_MESSAGES[language] || WELCOME_MESSAGES.th
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const widgetRef = useRef(null);

  // Sync initial welcome message when customer changes language
  useEffect(() => {
    setMessages(prev => {
      if (prev.length === 1 && prev[0].role === 'assistant') {
        return [{
          id: 'welcome-msg',
          role: 'assistant',
          text: WELCOME_MESSAGES[language] || WELCOME_MESSAGES.th
        }];
      }
      return prev;
    });
  }, [language]);

  // Auto collapse / minimize when clicking outside the widget
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      if (widgetRef.current && !widgetRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  // Auto scroll to bottom
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Quick Prompt Suggestions with Dynamic Language adaptation
  const quickPrompts = (language === 'en') ? [
    { label: '📦 Track My Order', query: 'Track order status' },
    { label: '🪑 Ergonomic & Gaming Chairs', query: 'Recommend ergonomic chairs and gaming chairs' },
    { label: '🖥️ Battle Desks & Standing Desks', query: 'Specs for gaming desks and electric standing desks' },
    { label: '🏢 B2B Wholesale Discounts', query: 'B2B wholesale pricing and volume discount tiers' },
    { label: '📄 Official Quotation (PDF)', query: 'How to request an official quotation PDF' },
    { label: '🚚 Delivery & On-Site Assembly', query: 'Delivery timeframe and on-site assembly service' },
    { label: '🛡️ 3-5 Year Warranty', query: 'Product warranty details and after-sales support' },
    { label: '💳 Payment & Deposit Plans', query: 'Payment methods and deposit options' }
  ] : (language === 'zh') ? [
    { label: '📦 查询订单物流', query: '查询订单状态' },
    { label: '🪑 人体工学椅与电竞椅', query: '推荐热销电竞椅与人体工学网椅' },
    { label: '🖥️ 电竞桌与升降桌', query: '电竞桌与智能双电机升降桌规格及尺寸' },
    { label: '🏢 B2B 批发与批量采购', query: '网咖与企业大宗采购批发折扣方案' },
    { label: '📄 获取官方报价单 PDF', query: '如何申请正规官方报价单' },
    { label: '🚚 配送与上门安装', query: '配送方式与上门安装服务说明' },
    { label: '🛡️ 3-5年原厂质保', query: '产品质保几年？售后如何保障？' },
    { label: '💳 支付方式与定金方案', query: '付款方式与定金分期方案' }
  ] : [
    { label: '📦 ติดตามเลขออเดอร์', query: 'ติดตามสถานะคำสั่งซื้อ' },
    { label: '🪑 เก้าอี้เกมมิ่ง & สุขภาพ', query: 'แนะนำเก้าอี้เกมมิ่งและเก้าอี้สุขภาพหน่อย' },
    { label: '🖥️ โต๊ะเกมมิ่ง & โต๊ะไฟฟ้า', query: 'สเปกโต๊ะเกมมิ่งและโต๊ะปรับระดับไฟฟ้า' },
    { label: '🏢 สั่งซื้อราคาส่ง B2B / ร้านเกม', query: 'สั่งซื้อจำนวนมากราคาส่ง B2B มีส่วนลดยังไง' },
    { label: '📄 ขอใบเสนอราคา (Quotation)', query: 'วิธีขอใบเสนอราคาทางการ' },
    { label: '🚚 การจัดส่ง & บริการติดตั้ง', query: 'การจัดส่งและบริการประกอบติดตั้ง' },
    { label: '🛡️ การรับประกันสินค้า 3-5 ปี', query: 'การรับประกันสินค้ากี่ปี มีอะไรบ้าง' },
    { label: '💳 ช่องทางชำระเงิน', query: 'ช่องทางการชำระเงิน' }
  ];

  // Match Core Intents for Equipment, Furniture, Quotation & Setup
  const matchCoreIntent = (query, lang) => {
    const q = query.toLowerCase();

    // 0. Franchise Redirection (Politely guide to Equipment & B2B Wholesale)
    const franchiseKeywords = [
      'เปิดร้าน', 'สนใจเปิด', 'สใจเปิด', 'อยากเปิด', 'เปิดสาขา', 'ลงทุน', 'แฟรนไชส์', 'franchise', 
      'งบเปิด', 'ค่าเปิดร้าน', 'เปิดร้านราคา', 'ทำร้านเกม', 'เปิดร้านใหม่', 'เปิดร้านเท่าไหร่',
      'open shop', 'open a shop', 'open cafe', 'invest', 'investment', 'open cyber cafe', 'cost to open',
      '加盟', '开网吧', '开店', '投资', '加盟费', '开电竞馆', '开店成本'
    ];
    if (franchiseKeywords.some(k => q.includes(k))) {
      return CORE_KNOWLEDGE.franchiseRedirect[lang] || CORE_KNOWLEDGE.franchiseRedirect.th;
    }

    // 1. Chairs (Gaming & Ergonomic Mesh)
    const chairKeywords = [
      'เก้าอี้', 'gaming chair', 'ergonomic', 'mesh', 'ตาข่าย', 'ปวดหลัง', 'เบาะ', 'พนักพิง', 'ที่พักแขน', 'โช้ค',
      'chair', 'chairs', 'seat', 'recline', 'armrest', 'lumbar', 'backrest',
      '椅', '椅子', '电竞椅', '人体工学椅', '工学椅', '透气网椅', '扶手', '靠背', '腰靠', '坐垫'
    ];
    if (chairKeywords.some(k => q.includes(k))) {
      return CORE_KNOWLEDGE.chairs[lang] || CORE_KNOWLEDGE.chairs.th;
    }

    // 2. Desks (Gaming Desks & Electric Standing Desks)
    const deskKeywords = [
      'โต๊ะ', 'โต๊ะเกม', 'โต๊ะคอม', 'โต๊ะปรับระดับ', 'โต๊ะไฟฟ้า', 'ปรับระดับ', 'dual motor', 'คาร์บอน', 'รางสายไฟ',
      'desk', 'desks', 'table', 'tables', 'standing desk', 'sit stand', 'electric desk', 'motorized', 'carbon fiber',
      '桌', '桌子', '电竞桌', '升降桌', '智能升降', '双电机', '碳纤维桌面', '电脑桌', '对战桌'
    ];
    if (deskKeywords.some(k => q.includes(k))) {
      return CORE_KNOWLEDGE.desks[lang] || CORE_KNOWLEDGE.desks.th;
    }

    // 3. Accessories (Monitor Arm, Mousepad, Wheels, Cable Management)
    const accessoryKeywords = [
      'อุปกรณ์เสริม', 'ขาตั้งจอ', 'แขนจับจอ', 'แผ่นรองเมาส์', 'เมาส์แพด', 'ล้อเก้าอี้', 'รางปลั๊ก', 'ปลั๊กไฟ',
      'accessory', 'accessories', 'monitor arm', 'monitor mount', 'mousepad', 'desk pad', 'caster', 'wheels',
      '配件', '外设', '支架', '显示器支架', '机械臂', '鼠标垫', '桌垫', '排插', '轮子'
    ];
    if (accessoryKeywords.some(k => q.includes(k))) {
      return CORE_KNOWLEDGE.accessories[lang] || CORE_KNOWLEDGE.accessories.th;
    }

    // 4. B2B Wholesale & Quotation (Volume discounts, QT-xxxx, Full Tax Invoice)
    const b2bKeywords = [
      'ราคาส่ง', 'b2b', 'ขายส่ง', 'สั่งเยอะ', 'จำนวนมาก', 'ใบเสนอราคา', 'ขอใบเสนอราคา', 'quotation', 'qt-', 'ใบกำกับภาษี', 'vat', 'ลดกี่เปอร์เซ็นต์', 'ส่วนลด', 'โครงการ',
      'quote', 'quotation', 'estimate', 'bulk', 'wholesale', 'b2b', 'volume discount', 'tax invoice', 'vat', 'discount',
      '批发', '大宗', '报价', '报价单', '发票', '增值税', '批量', '折扣', '优惠', '采购'
    ];
    if (b2bKeywords.some(k => q.includes(k))) {
      return CORE_KNOWLEDGE.b2b_quotation[lang] || CORE_KNOWLEDGE.b2b_quotation.th;
    }

    // 5. Shipping & On-Site Installation (Nationwide free shipping, on-site assembly)
    const shippingKeywords = [
      'ส่ง', 'จัดส่ง', 'ค่าส่ง', 'ติดตั้ง', 'ประกอบ', 'ประกอบให้ไหม', 'ช่าง', 'กี่วันถึง', 'ส่งต่างจังหวัด', 'ส่งกทม', 'ขนส่ง',
      'ship', 'shipping', 'delivery', 'deliver', 'freight', 'install', 'installation', 'assemble', 'assembly', 'how many days',
      '配送', '运费', '发货', '快递', '安装', '组装', '上门安装', '几天到', '送货'
    ];
    if (shippingKeywords.some(k => q.includes(k))) {
      return CORE_KNOWLEDGE.shipping_installation[lang] || CORE_KNOWLEDGE.shipping_installation.th;
    }

    // 6. Warranty & After-Sales (3-5 years, motors, gas lift, repairs)
    const warrantyKeywords = [
      'ประกัน', 'การรับประกัน', 'เคลม', 'ซ่อม', 'เสีย', 'พัง', 'กี่ปี', 'อะไหล่',
      'warranty', 'guarantee', 'claim', 'repair', 'broken', 'spare parts', 'support',
      '质保', '保修', '售后', '维修', '保几年', '坏了', '配件', '换货'
    ];
    if (warrantyKeywords.some(k => q.includes(k))) {
      return CORE_KNOWLEDGE.warranty[lang] || CORE_KNOWLEDGE.warranty.th;
    }

    // 7. Payment & Deposit (PromptPay, Transfer, Card, 30%/50% deposit)
    const paymentKeywords = [
      'ชำระ', 'จ่ายเงิน', 'โอน', 'มัดจำ', 'พร้อมเพย์', 'บัตรเครดิต', 'เลขบัญชี', 'ผ่อน',
      'pay', 'payment', 'deposit', 'promptpay', 'transfer', 'credit card', 'bank account', 'installments',
      '支付', '付款', '定金', '转账', '信用卡', '扫码', '银行卡'
    ];
    if (paymentKeywords.some(k => q.includes(k))) {
      return CORE_KNOWLEDGE.payment[lang] || CORE_KNOWLEDGE.payment.th;
    }

    // 8. Showroom & Location (Testing products in person, Ramkhamhaeng 53)
    const showroomKeywords = [
      'โชว์รูม', 'หน้าร้าน', 'ลองนั่ง', 'ดูตัวจริง', 'ดูของจริง', 'ที่อยู่', 'ที่ตั้ง', 'แผนที่', 'รามคำแหง', 'อยู่แถวไหน', 'ไปยังไง',
      'showroom', 'visit', 'try', 'test', 'location', 'address', 'map', 'where', 'directions',
      '展厅', '门店', '实体店', '试坐', '看实物', '地址', '位置', '怎么走', '地图', '体验店'
    ];
    if (showroomKeywords.some(k => q.includes(k))) {
      return CORE_KNOWLEDGE.showroom[lang] || CORE_KNOWLEDGE.showroom.th;
    }

    // 9. Greetings
    const greetingKeywords = [
      'สวัสดี', 'ดีครับ', 'ดีค่ะ', 'หวัดดี', 'มีใครอยู่ไหม', 'สอบถาม',
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

    const lang = detectLanguage(query) || (language === 'zh' ? 'zh' : (language === 'en' ? 'en' : 'th'));
    const thaiTranslation = (lang !== 'th') ? translateQueryToThai(query, lang) : null;

    // Add User Message with translation
    const userMsg = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: query,
      lang: lang,
      translationTh: thaiTranslation
    };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    if (lang !== 'th' && thaiTranslation) {
      addPendingQuestion(query, thaiTranslation, lang);
    }

    // 0. Order Tracking Real-Time Resolver (Instant order lookup by Order No or Phone)
    const orderTrackingAnswer = checkOrderStatusQuery(query, lang, savedOrders);
    if (orderTrackingAnswer) {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          text: orderTrackingAnswer
        }]);
        setIsLoading(false);
      }, 350);
      return;
    }

    // 1. First check if query matches Core Knowledge directly (instant high-accuracy matching in 3 languages)
    const matchedCoreAnswer = matchCoreIntent(query, lang);

    // 2. OpenRouter API Mode (if configured with API key)
    const apiKey = siteData.openRouterSettings?.apiKey;
    const model = siteData.openRouterSettings?.model || 'google/gemini-flash-3.8';

    if (apiKey && apiKey.trim().startsWith('sk-')) {
      try {
        const matchedDocs = retrieveRelevantKnowledge(query);
        const contextText = matchedDocs.map(d => `[${d.title}]: ${d.content}`).join('\n\n');

        const systemPrompt = `คุณคือ "ผู้เชี่ยวชาญด้านอุปกรณ์และฝ่ายบริการลูกค้า" ประจำศูนย์ G-Speed Living Plus (GLP Store).
คุณมีหน้าที่ตอบคำถาม ให้คำปรึกษา และแนะนำเกี่ยวกับสินค้าโต๊ะเกมมิ่ง, เก้าอี้สุขภาพ Ergonomic, อุปกรณ์จัดโต๊ะคอม, การขอใบเสนอราคา (Quotation), ส่วนลดราคาส่ง B2B สำหรับร้านเกม/ออฟฟิศ, การจัดส่ง และการประกอบติดตั้งอย่างสุภาพ เป็นมิตร และเป็นมืออาชีพ (ห้ามบอกว่าเป็น AI)

ข้อมูลสำคัญของทางร้าน:
1. ผลิตภัณฑ์หลัก:
   - โต๊ะเกมมิ่ง Gspeed Pro Battle Desk (โครงเหล็กคาร์บอนหนาพิเศษ รับน้ำหนัก 150-200 กก. ท็อปคาร์บอนไฟเบอร์ E1 ถาดซ่อนสายไฟ)
   - โต๊ะปรับระดับไฟฟ้า Dual-Motor Standing Desk (ปรับ 72-120 ซม. บันทึกความจำ 4 ระดับ มอเตอร์คู่เงียบ <45dB พร้อม Anti-Collision)
   - เก้าอี้เกมมิ่ง Gspeed Pro Master Ergonomic (ปรับเอน 90°-165° หนัง Hybrid PU แขน 3D/4D โช้ค Class 4 SGS รับน้ำหนัก 150-180 กก.)
   - เก้าอี้สุขภาพ Air-Flow Pro Full Mesh (ตาข่ายเกาหลีระบายอากาศ 360° ปรับความลึกเบาะ ซัพพอร์ตเอว)
   - อุปกรณ์เสริม: แขนจับจอ Gas Spring, แผ่นรองเมาส์ XXL, รางปลั๊กไฟ, ล้อเก้าอี้ PU
2. สิทธิพิเศษราคาส่ง B2B:
   - ซื้อ 5-9 ชิ้น ลด 5% | 10-19 ชิ้น ลด 10% | 20 ชิ้นขึ้นไป ลด 15%
   - ออกใบเสนอราคาทางการ (Quotation PDF) เลขที่ QT-xxxx ได้เองบนเว็บทันที พร้อมคำนวณ VAT 7%
   - ออกใบกำกับภาษีเต็มรูปแบบได้ทุกยอด
3. การจัดส่ง & ประกอบติดตั้ง:
   - จัดส่งฟรีทั่วประเทศ!
   - กรุงเทพฯ-ปริมณฑล มีทีมช่างจัดส่งและประกอบติดตั้งหน้างานฟรี
   - ต่างจังหวัด จัดส่งด่วนพิเศษพร้อมประกันสินค้า 100%
4. การรับประกัน:
   - โครงสร้างเหล็กโต๊ะและเก้าอี้ 3-5 ปี
   - มอเตอร์โต๊ะไฟฟ้า 3 ปี
   - โช้คแก๊ส Class 4 นาน 2 ปี มีสต็อกอะไหล่แท้พร้อมเปลี่ยนตลอดอายุการใช้งาน
5. ที่ตั้งโชว์รูม: 79 ซ.รามคำแหง 53 แขวงพลับพลา เขตวังทองหลาง กทม. (โทร 063 793 7704)
6. ช่องทางชำระเงิน: พร้อมเพย์ Thai QR, โอนผ่านธนาคาร, บัตรเครดิต, แผนมัดจำ 30% หรือ 50% ได้

*** กฎสำคัญ ***
1. ตอบกลับเป็นภาษาเดียวกับที่ลูกค้าถาม (ไทย / อังกฤษ / จีน)
2. สุภาพ ชัดเจน ให้ข้อมูลสเปกที่ถูกต้อง
3. หากลูกค้าถามเกี่ยวกับการเปิดร้านแฟรนไชส์เดิม ให้แจ้งว่าเราปรับเป็นศูนย์จัดจำหน่ายโต๊ะ เก้าอี้ และอุปกรณ์ราคาส่ง B2B พร้อมบริการติดตั้งแทน และแนะนำให้ลูกค้าเลือกชมสินค้าหรือขอใบเสนอราคา
4. ติดต่อเจ้าหน้าที่โดยตรง: โทร 063 793 7704
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
          addPendingQuestion(query, thaiTranslation, lang);
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
    <div ref={widgetRef} className="ai-chat-widget-container">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button 
          id="btn-open-ai-chat"
          className="btn-ai-chat-trigger"
          onClick={() => setIsOpen(true)}
          title={language === 'zh' ? '咨询信息 / 在线客服 - G-Speed Arena' : language === 'en' ? 'Inquire Information / Live Concierge - G-Speed Arena' : 'สอบถามข้อมูล / แชทกับเจ้าหน้าที่ - G-Speed Arena'}
        >
          <div className="trigger-pulse-ring"></div>
          <div className="trigger-avatar-circle">
            <Headphones size={20} className="trigger-icon" />
          </div>
          <div className="trigger-text-badge">
            <span className="badge-subtitle">{t('chat.triggerSubtitle')}</span>
            <span className="trigger-label">{t('chat.triggerLabel')}</span>
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
                <strong className="chat-title">{t('chat.cardTitle')}</strong>
                <div className="chat-status-pill">
                  <span className="status-dot-green"></span>
                  <span>{t('chat.statusOnline')}</span>
                  <span className="chat-lang-pill" title={language === 'zh' ? '支持3种语言服务：泰语 🇹🇭 • 英语 🇬🇧 • 中文 🇨🇳' : language === 'en' ? '3 Languages Supported: Thai 🇹🇭 • English 🇬🇧 • Chinese 🇨🇳' : 'บริการ 3 ภาษา: ไทย 🇹🇭 • English 🇬🇧 • 中文 🇨🇳'}>
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
                title={language === 'zh' ? '关闭窗口' : language === 'en' ? 'Close Window' : 'ปิดหน้าต่าง'}
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
                  
                  {/* Real-time Thai Translation for Admin */}
                  {msg.role === 'user' && msg.translationTh && (
                    <div style={{
                      marginTop: '6px',
                      padding: '4px 8px',
                      background: 'rgba(255, 255, 255, 0.95)',
                      borderRadius: '6px',
                      color: '#1e3a8a',
                      fontSize: '0.74rem',
                      fontWeight: 500,
                      border: '1px solid rgba(191, 219, 254, 0.8)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <span>{language === 'zh' ? '🇨🇳 中文翻译 (Admin):' : language === 'en' ? '🇬🇧 Translation (Admin):' : '🇹🇭 แปลไทย (Admin):'} {msg.translationTh}</span>
                    </div>
                  )}
                  
                  {/* Interactive Equipment Store & Quotation CTA Card */}
                  {msg.role === 'assistant' && (
                    msg.text.includes('/products') || 
                    msg.text.includes('/checkout') || 
                    msg.text.includes('/franchise') || 
                    msg.text.includes('โต๊ะ') || 
                    msg.text.includes('เก้าอี้') || 
                    msg.text.includes('อุปกรณ์') ||
                    msg.text.includes('ใบเสนอราคา') ||
                    msg.text.includes('ราคาส่ง') ||
                    msg.text.includes('desk') ||
                    msg.text.includes('chair') ||
                    msg.text.includes('quotation') ||
                    msg.text.includes('wholesale') ||
                    msg.text.includes('桌') ||
                    msg.text.includes('椅') ||
                    msg.text.includes('报价') ||
                    msg.text.includes('批发')
                  ) && (
                    <div style={{
                      marginTop: '12px',
                      padding: '14px 16px',
                      background: 'linear-gradient(135deg, #f0f7ff 0%, #e0f2fe 100%)',
                      border: '1px solid #bfdbfe',
                      borderRadius: '12px',
                      boxShadow: '0 2px 8px rgba(37, 99, 235, 0.08)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#1d4ed8', fontSize: '0.86rem', fontWeight: 700, marginBottom: '6px' }}>
                        <ShoppingBag size={16} color="#1d4ed8" />
                        <span>
                          {language === 'zh' 
                            ? '🛍️ G-Speed 官方电竞装备商城与报价系统' 
                            : language === 'en' 
                              ? '🛍️ G-Speed Equipment Store & Instant Quotation' 
                              : '🛍️ แคตตาล็อกอุปกรณ์ & ระบบออกใบเสนอราคา'}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.82rem', color: '#0f172a', margin: '0 0 12px 0', lineHeight: 1.5, fontWeight: 500 }}>
                        {language === 'zh'
                          ? '浏览全系电竞桌、人体工学椅与外设配件，一键加入购物车生成正式报价单 (QT-xxxx) 或在线下单全泰配送安装。'
                          : language === 'en'
                            ? 'Explore gaming desks, ergonomic chairs, request official quotation PDFs (QT-xxxx), or order with nationwide delivery & assembly.'
                            : 'เลือกชมโต๊ะ เก้าอี้ อุปกรณ์เกมมิ่ง สั่งซื้อราคาส่ง B2B หรือกดออกใบเสนอราคาทางการ (Quotation PDF) ได้ทันทีบนเว็บ'}
                      </p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
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
                            background: '#1d4ed8',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: 700,
                            fontSize: '0.84rem',
                            cursor: 'pointer',
                            boxShadow: '0 4px 12px rgba(29, 78, 216, 0.35)',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <ShoppingBag size={15} />
                          <span>
                            {language === 'zh'
                              ? '进入装备商城选购商品'
                              : language === 'en'
                                ? 'Browse Equipment Catalog'
                                : 'เลือกชมสินค้าและโต๊ะเก้าอี้ทั้งหมด'}
                          </span>
                          <ArrowRight size={14} />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            window.history.pushState(null, '', '/checkout');
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
                            padding: '7px 14px',
                            background: '#ffffff',
                            color: '#1d4ed8',
                            border: '1.5px solid #bfdbfe',
                            borderRadius: '8px',
                            fontWeight: 700,
                            fontSize: '0.82rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <CreditCard size={14} />
                          <span>
                            {language === 'zh'
                              ? '查看购物车与在线收银台'
                              : language === 'en'
                                ? 'Go to Cart & Checkout'
                                : 'ดูตะกร้า & หน้าชำระเงิน (/checkout)'}
                          </span>
                        </button>
                      </div>
                    </div>
                  )}

                  {msg.isOutOfScopeNotice && (
                    <div className="out-of-scope-badge">
                      <Shield size={11} />
                      <span>
                        {language === 'zh' 
                          ? '工作人员专业服务范围' 
                          : language === 'en' 
                            ? 'Staff Official Scope' 
                            : 'ขอบเขตข้อมูลเจ้าหน้าที่ร้าน'}
                      </span>
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
              placeholder={t('chat.inputPlaceholder')}
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              disabled={isLoading}
            />
            <button 
              type="submit" 
              className="btn-chat-send"
              disabled={!inputText.trim() || isLoading}
              title={t('chat.sendBtn')}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
