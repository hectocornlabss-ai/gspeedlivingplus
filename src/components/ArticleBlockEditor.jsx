import React, { useState } from 'react';
import { 
  Type, Heading2, Heading3, Image as ImageIcon, Columns, 
  List, MessageSquare, AlertCircle, ExternalLink, Plus, Trash2, 
  ChevronUp, ChevronDown, Copy, Upload, RefreshCw, LayoutTemplate, 
  Sparkles, AlignLeft, AlignCenter, Minus, Split
} from 'lucide-react';
import { compressAndConvertToWebP } from '../utils/imageOptimizer';

// Helper: Generate unique block ID
const generateId = () => 'block_' + Math.random().toString(36).substring(2, 9);

// PRESET BLOCK PATTERNS (เทมเพลตบทความสำเร็จรูป)
export const ARTICLE_BLOCK_PATTERNS = [
  {
    id: 'pattern-tournament',
    name: '🏆 สรุปผลการแข่งขัน (Tournament Recap & Winners)',
    description: 'เหมาะสำหรับข่าวการแข่งขัน สรุปผลแชมป์ ตารางคะแนน สถิติแมตช์ และรูปรับรางวัล',
    blocks: [
      {
        id: generateId(),
        type: 'heading',
        level: 2,
        text: 'สรุปผลการแข่งขันรอบชิงชนะเลิศสุดเดือด'
      },
      {
        id: generateId(),
        type: 'media-text',
        mediaPosition: 'left',
        imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'บรรยากาศทีมแชมป์ชูถ้วยรางวัลบนเวทีหลัก',
        caption: 'ภาพประวัติศาสตร์ช่วงเวลาชูถ้วยเกียรติยศ GLP Master Cup',
        title: 'วินาทีประวัติศาสตร์แห่งชัยชนะ',
        text: 'การแข่งขันรอบ Grand Final ดำเนินไปอย่างเข้มข้นตลอด 5 แผนที่ ท่ามกลางเสียงเชียร์กึกก้องจากแฟนคลับในอารีนา ทีมผู้ชนะสามารถโชว์ฟอร์มการเล่นอันเหนือชั้น พลิกกลับมาเฉือนเอาชนะไปได้อย่างสมศักดิ์ศรี'
      },
      {
        id: generateId(),
        type: 'columns-2',
        ratio: '50-50',
        leftTitle: '📊 สรุปอันดับและเงินรางวัล',
        leftText: '• รางวัลชนะเลิศอันดับ 1: ฿150,000 + ถ้วยรางวัลเกียรติยศ\n• รองชนะเลิศอันดับ 1: ฿60,000 + เหรียญเงิน\n• รองชนะเลิศอันดับ 2 ร่วม: ฿25,000 (2 รางวัล)\n• รางวัล MVP ผู้เล่นยอดเยี่ยม: ฿15,000 + การ์ดจอ GeForce RTX 4080 Super',
        rightTitle: '🔥 สถิติไฮไลต์ประจำทัวร์นาเมนต์',
        rightText: '• จำนวนทีมเข้าแข่งขันรอบคัดเลือก: 128 ทีมทั่วประเทศ\n• ยอดผู้ชมถ่ายทอดสดพร้อมกันสูงสุด (Peak CCU): 42,500 คน\n• ช็อตการเล่นยอดเยี่ยม (Aces): 18 ครั้งตลอดทัวร์นาเมนต์\n• เวลาการแข่งขันเฉลี่ยต่อแมตช์: 46 นาที'
      },
      {
        id: generateId(),
        type: 'quote',
        text: 'ชัยชนะในครั้งนี้เกิดขึ้นจากการฝึกซ้อมอย่างหนักของทุกคนในทีม และอุปกรณ์คอมพิวเตอร์หน้าจอ 360Hz ในสนาม G-Speed ตอบสนองไวมาก ช่วยให้การยิงมีความแม่นยำสูงสุดในทุกจังหวะชี้ชะตา',
        author: 'กัปตันทีมผู้ชนะเลิศการแข่งขัน GLP Esports Championship'
      },
      {
        id: generateId(),
        type: 'callout',
        style: 'gold',
        title: 'ขอขอบคุณสปอนเซอร์และพันธมิตรทุกฝ่าย',
        text: 'ทางคณะผู้จัดงานขอขอบคุณ ASUS ROG, NVIDIA GeForce, และผู้สนับสนุนทุกท่านที่ร่วมสร้างปรากฏการณ์การแข่งขันระดับประเทศ แล้วพบกันใหม่ในซีซั่นหน้า!'
      }
    ]
  },
  {
    id: 'pattern-hardware',
    name: '⚡ รีวิวสเปก & สปอนเซอร์ฮาร์ดแวร์ (Hardware & Partner Showcase)',
    description: 'เน้นแนะนำอุปกรณ์เกมมิ่งเกียร์ สเปกคอมพิวเตอร์ และนวัตกรรมเทคโนโลยีของร้าน',
    blocks: [
      {
        id: generateId(),
        type: 'heading',
        level: 2,
        text: 'ยกระดับสนามแข่งด้วยเทคโนโลยีฮาร์ดแวร์ระดับ Next-Gen'
      },
      {
        id: generateId(),
        type: 'paragraph',
        text: 'G-Speed Esport Arena ร่วมมือกับผู้ผลิตฮาร์ดแวร์ชั้นนำของโลก อัปเกรดเครื่องคอมพิวเตอร์ในโซนแข่งขัน Pro Arena สู่สเปกระดับสูงสุด เพื่อมอบความได้เปรียบให้นักกีฬาแข่งขันแบบไร้ข้อจำกัด'
      },
      {
        id: generateId(),
        type: 'media-text',
        mediaPosition: 'right',
        imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'หน้าจอ Fast-IPS 360Hz และการ์ดจอ GeForce RTX 40 Series',
        caption: 'ขุมพลังเกมมิ่งเกียร์ระดับทัวร์นาเมนต์สากล',
        title: 'อัตราการตอบสนอง 0.5ms ลื่นไหลทุกเฟรม',
        text: 'ขับเคลื่อนด้วยการ์ดจอ NVIDIA GeForce RTX 40 Series สถาปัตยกรรม Ada Lovelace พร้อมเทคโนโลยี DLSS 3 และ Reflex ช่วยลด System Latency ให้ต่ำที่สุด เพื่อการเล็งเป้าที่เฉียบคมและแม่นยำที่สุด'
      },
      {
        id: generateId(),
        type: 'columns-3',
        col1Title: '🚀 CPU & RAM',
        col1Text: 'Intel Core i7 14th Gen\n32GB DDR5 6000MHz\nระบายความร้อนระบบน้ำปิด 360mm',
        col2Title: '🎮 หน้าจอแสดงผล',
        col2Text: '24.5 นิ้ว Fast-IPS 360Hz\nความละเอียด Full HD eSports\nรองรับ NVIDIA G-SYNC',
        col3Title: '🌐 ระบบเน็ตเวิร์ก',
        col3Text: 'Dual 10Gbps Dedicated Fiber\nสายเคเบิล Cat6A ชิลด์ป้องกันสัญญาณ\nPing ต่ำเฉลี่ยเพียง 2-5ms'
      },
      {
        id: generateId(),
        type: 'button',
        label: 'ดูรายละเอียดแพ็กเกจและอัตราค่าบริการ',
        url: '#/franchise',
        style: 'primary',
        align: 'center'
      }
    ]
  },
  {
    id: 'pattern-event',
    name: '🎉 ข่าวประชาสัมพันธ์ & กิจกรรมแจกของ (Community & Giveaways)',
    description: 'เหมาะสำหรับข่าวเชิญชวนแฟนคลับ มิตติ้งค่ายเกม และโปรโมชันพิเศษหน้าร้าน',
    blocks: [
      {
        id: generateId(),
        type: 'heading',
        level: 2,
        text: 'ฉลองครบรอบพิเศษ ร่วมสนุกรับเกมมิ่งเกียร์และชั่วโมงเล่นฟรี'
      },
      {
        id: generateId(),
        type: 'callout',
        style: 'emerald',
        title: 'กำหนดการและสถานที่จัดงาน',
        text: '📅 วันเสาร์ที่ 25 ตุลาคม 2026 | เวลา 13:00 - 19:00 น.\n📍 ณ G-Speed Esport Arena ชั้น 2 โซน Main Stage (เข้าร่วมฟรี ไม่มีค่าใช้จ่าย)'
      },
      {
        id: generateId(),
        type: 'columns-2',
        ratio: '60-40',
        leftTitle: 'กิจกรรมไฮไลต์ภายในงาน',
        leftText: '1. มินิทัวร์นาเมนต์ 1v1 ชิงของรางวัลลิขสิทธิ์แท้\n2. ร่วมทดสอบอุปกรณ์เกมมิ่งรุ่นใหม่ล่าสุดก่อนวางจำหน่ายจริง\n3. มีทแอนด์กรี๊ดกับสตรีมเมอร์ชื่อดังขวัญใจคอมมูนิตี้\n4. ซุ้มอาหารและเครื่องดื่มบริการฟรีตลอดทั้งงาน',
        rightTitle: '🎁 ของรางวัลแจกในงาน',
        rightText: '• คีย์บอร์ด Mechanical RGB 5 รางวัล\n• หูฟังเกมมิ่งไร้สาย 3 รางวัล\n• การ์ดเติมชั่วโมงเล่น 100 ชั่วโมง (20 รางวัล)\n• เสื้อยืดที่ระลึก GLP Limited Edition'
      },
      {
        id: generateId(),
        type: 'button',
        label: 'ลงทะเบียนสำรองที่นั่งล่วงหน้า (รับสิทธิ์ลุ้น Lucky Draw)',
        url: 'https://line.me/R/ti/p/@gspeedarena',
        style: 'primary',
        align: 'center'
      }
    ]
  }
];

export default function ArticleBlockEditor({ blocks = [], onChange = () => {} }) {
  const [activeCategory, setActiveCategory] = useState('text'); // 'text', 'media', 'layout', 'patterns'
  const [compressingBlockId, setCompressingBlockId] = useState(null);

  // Helper to update specific block by index
  const updateBlock = (index, updatedFields) => {
    const nextBlocks = [...blocks];
    nextBlocks[index] = { ...nextBlocks[index], ...updatedFields };
    onChange(nextBlocks);
  };

  // Delete block
  const deleteBlock = (index) => {
    const nextBlocks = blocks.filter((_, idx) => idx !== index);
    onChange(nextBlocks);
  };

  // Move block up/down
  const moveBlock = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= blocks.length) return;
    const nextBlocks = [...blocks];
    const temp = nextBlocks[index];
    nextBlocks[index] = nextBlocks[targetIndex];
    nextBlocks[targetIndex] = temp;
    onChange(nextBlocks);
  };

  // Duplicate block
  const duplicateBlock = (index) => {
    const blockToCopy = blocks[index];
    const newBlock = {
      ...JSON.parse(JSON.stringify(blockToCopy)),
      id: generateId()
    };
    const nextBlocks = [...blocks];
    nextBlocks.splice(index + 1, 0, newBlock);
    onChange(nextBlocks);
  };

  // Add block
  const addBlock = (type, customDefaults = {}, insertIndex = null) => {
    let newBlock = {
      id: generateId(),
      type
    };

    switch (type) {
      case 'paragraph':
        newBlock.text = '';
        newBlock.align = 'left';
        break;
      case 'heading':
        newBlock.level = 2;
        newBlock.text = '';
        break;
      case 'media-text':
        newBlock.mediaPosition = 'left';
        newBlock.imageUrl = '';
        newBlock.imageAlt = '';
        newBlock.caption = '';
        newBlock.title = '';
        newBlock.text = '';
        break;
      case 'image':
        newBlock.url = '';
        newBlock.caption = '';
        newBlock.alt = '';
        newBlock.align = 'center'; // 'center', 'wide', 'full'
        break;
      case 'columns-2':
        newBlock.ratio = '50-50'; // '50-50', '60-40', '40-60'
        newBlock.leftTitle = '';
        newBlock.leftText = '';
        newBlock.rightTitle = '';
        newBlock.rightText = '';
        break;
      case 'columns-3':
        newBlock.col1Title = '';
        newBlock.col1Text = '';
        newBlock.col2Title = '';
        newBlock.col2Text = '';
        newBlock.col3Title = '';
        newBlock.col3Text = '';
        break;
      case 'list':
        newBlock.style = 'bullet'; // 'bullet', 'numbered'
        newBlock.items = [''];
        break;
      case 'quote':
        newBlock.text = '';
        newBlock.author = '';
        break;
      case 'callout':
        newBlock.style = 'info'; // 'info', 'gold', 'emerald', 'purple'
        newBlock.title = '';
        newBlock.text = '';
        break;
      case 'button':
        newBlock.label = 'คลิกที่นี่';
        newBlock.url = '';
        newBlock.style = 'primary'; // 'primary', 'outline'
        newBlock.align = 'center';
        break;
      case 'divider':
        newBlock.style = 'solid';
        break;
      default:
        break;
    }

    newBlock = { ...newBlock, ...customDefaults };

    const nextBlocks = [...blocks];
    if (insertIndex !== null && insertIndex >= 0) {
      nextBlocks.splice(insertIndex + 1, 0, newBlock);
    } else {
      nextBlocks.push(newBlock);
    }
    onChange(nextBlocks);
  };

  // Apply Pre-built Pattern
  const applyPattern = (pattern) => {
    if (blocks.length > 0) {
      const confirmReplace = window.confirm(`คุณต้องการแทนที่เนื้อหาเดิมด้วยเทมเพลต "${pattern.name}" ใช่หรือไม่?`);
      if (!confirmReplace) return;
    }
    // Deep clone blocks with new fresh IDs
    const clonedBlocks = pattern.blocks.map(b => ({
      ...JSON.parse(JSON.stringify(b)),
      id: generateId()
    }));
    onChange(clonedBlocks);
  };

  // Image Upload Handler with WebP Auto-Compression
  const handleBlockImageUpload = async (file, blockIndex, field = 'url') => {
    if (!file) return;
    const blockId = blocks[blockIndex]?.id;
    setCompressingBlockId(blockId);
    try {
      const result = await compressAndConvertToWebP(file, { maxWidth: 1200, maxHeight: 1200, quality: 0.85 });
      updateBlock(blockIndex, { [field]: result.dataUrl });
    } catch (err) {
      console.error('Error compressing block image:', err);
      alert('เกิดข้อผิดพลาดในการแปลงรูปภาพ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setCompressingBlockId(null);
    }
  };

  return (
    <div className="article-block-editor-container">
      {/* Top Gutenberg Block Inserter Bar */}
      <div className="gutenberg-toolbar">
        <div className="toolbar-header">
          <div className="toolbar-title-group">
            <LayoutTemplate size={18} className="text-blue" />
            <strong className="toolbar-title">WordPress Gutenberg Visual Block Editor</strong>
            <span className="block-counter-badge">{blocks.length} บล็อก</span>
          </div>
          <span className="text-xs text-muted">
            จัดวางคอลัมน์ สื่อประกบข้อความ และหัวข้อได้อิสระ แสดงผลสวยงาม Responsive 100%
          </span>
        </div>

        {/* Category Tabs */}
        <div className="inserter-tabs-row">
          <button 
            type="button" 
            className={`inserter-tab ${activeCategory === 'text' ? 'active' : ''}`}
            onClick={() => setActiveCategory('text')}
          >
            <Type size={14} />
            <span>ข้อความ (Text)</span>
          </button>
          <button 
            type="button" 
            className={`inserter-tab ${activeCategory === 'media' ? 'active' : ''}`}
            onClick={() => setActiveCategory('media')}
          >
            <ImageIcon size={14} />
            <span>สื่อ & รูปภาพ (Media)</span>
          </button>
          <button 
            type="button" 
            className={`inserter-tab ${activeCategory === 'layout' ? 'active' : ''}`}
            onClick={() => setActiveCategory('layout')}
          >
            <Columns size={14} />
            <span>เลย์เอาท์ & คอลัมน์ (Design)</span>
          </button>
          <button 
            type="button" 
            className={`inserter-tab patterns ${activeCategory === 'patterns' ? 'active' : ''}`}
            onClick={() => setActiveCategory('patterns')}
          >
            <Sparkles size={14} />
            <span>เทมเพลตสำเร็จรูป (Patterns)</span>
          </button>
        </div>

        {/* Inserter Action Buttons by Category */}
        <div className="inserter-chips-tray">
          {activeCategory === 'text' && (
            <>
              <button type="button" className="btn-insert-chip" onClick={() => addBlock('paragraph')}>
                <Type size={13} />
                <span>+ ย่อหน้า (Paragraph)</span>
              </button>
              <button type="button" className="btn-insert-chip" onClick={() => addBlock('heading', { level: 2 })}>
                <Heading2 size={13} />
                <span>+ หัวข้อหลัก (H2)</span>
              </button>
              <button type="button" className="btn-insert-chip" onClick={() => addBlock('heading', { level: 3 })}>
                <Heading3 size={13} />
                <span>+ หัวข้อย่อย (H3)</span>
              </button>
              <button type="button" className="btn-insert-chip" onClick={() => addBlock('list')}>
                <List size={13} />
                <span>+ รายการ (List)</span>
              </button>
              <button type="button" className="btn-insert-chip" onClick={() => addBlock('quote')}>
                <MessageSquare size={13} />
                <span>+ คำคม / ไฮไลต์ (Quote)</span>
              </button>
              <button type="button" className="btn-insert-chip" onClick={() => addBlock('callout')}>
                <AlertCircle size={13} />
                <span>+ กล่องข้อความเด่น (Callout)</span>
              </button>
            </>
          )}

          {activeCategory === 'media' && (
            <>
              <button type="button" className="btn-insert-chip highlight" onClick={() => addBlock('media-text')}>
                <Split size={13} />
                <span>+ สื่อประกบข้อความ (Media & Text)</span>
              </button>
              <button type="button" className="btn-insert-chip" onClick={() => addBlock('image')}>
                <ImageIcon size={13} />
                <span>+ รูปภาพเดี่ยว (Image)</span>
              </button>
            </>
          )}

          {activeCategory === 'layout' && (
            <>
              <button type="button" className="btn-insert-chip highlight" onClick={() => addBlock('columns-2')}>
                <Columns size={13} />
                <span>+ 2 คอลัมน์ (50/50 หรือ 60/40)</span>
              </button>
              <button type="button" className="btn-insert-chip" onClick={() => addBlock('columns-3')}>
                <Columns size={13} />
                <span>+ 3 คอลัมน์ (Features)</span>
              </button>
              <button type="button" className="btn-insert-chip" onClick={() => addBlock('button')}>
                <ExternalLink size={13} />
                <span>+ ปุ่มลิงก์ (Button)</span>
              </button>
              <button type="button" className="btn-insert-chip" onClick={() => addBlock('divider')}>
                <Minus size={13} />
                <span>+ เส้นคั่น (Divider)</span>
              </button>
            </>
          )}

          {activeCategory === 'patterns' && (
            <div className="patterns-dropdown-list">
              {ARTICLE_BLOCK_PATTERNS.map((pat) => (
                <button
                  key={pat.id}
                  type="button"
                  className="btn-pattern-select"
                  onClick={() => applyPattern(pat)}
                >
                  <div className="pattern-meta">
                    <strong>{pat.name}</strong>
                    <span>{pat.description}</span>
                  </div>
                  <Plus size={15} className="pattern-add-icon" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Blocks List Canvas */}
      <div className="blocks-canvas">
        {blocks.length === 0 ? (
          <div className="empty-blocks-placeholder">
            <LayoutTemplate size={36} className="text-muted" />
            <h5>ยังไม่มีบล็อกเนื้อหา</h5>
            <p>
              คลิกเลือกเครื่องมือด้านบน เช่น <strong>"สื่อประกบข้อความ (Media & Text)"</strong>, <strong>"2 คอลัมน์"</strong> หรือเลือก <strong>"เทมเพลตสำเร็จรูป"</strong> เพื่อเริ่มสร้างเนื้อหาที่สวยงามได้ทันที
            </p>
            <div className="empty-quick-actions">
              <button type="button" className="btn-secondary btn-sm" onClick={() => addBlock('heading', { level: 2, text: 'หัวข้อกิจกรรม' })}>
                + ใส่หัวข้อ H2
              </button>
              <button type="button" className="btn-secondary btn-sm" onClick={() => addBlock('media-text')}>
                + สื่อประกบข้อความ
              </button>
              <button type="button" className="btn-primary btn-sm" onClick={() => applyPattern(ARTICLE_BLOCK_PATTERNS[0])}>
                <Sparkles size={13} /> ใช้เทมเพลตสรุปผลการแข่ง
              </button>
            </div>
          </div>
        ) : (
          blocks.map((block, idx) => (
            <div key={block.id || idx} className={`block-card-wrapper block-type-${block.type}`}>
              {/* Block Header Toolbar */}
              <div className="block-card-header">
                <div className="block-type-badge">
                  <span className="block-num">{idx + 1}</span>
                  {block.type === 'paragraph' && <><Type size={12} /> ย่อหน้า (Paragraph)</>}
                  {block.type === 'heading' && <><Heading2 size={12} /> หัวข้อ (H{block.level || 2})</>}
                  {block.type === 'media-text' && <><Split size={12} /> สื่อประกบข้อความ (Media & Text)</>}
                  {block.type === 'image' && <><ImageIcon size={12} /> รูปภาพ (Image)</>}
                  {block.type === 'columns-2' && <><Columns size={12} /> 2 คอลัมน์ ({block.ratio || '50-50'})</>}
                  {block.type === 'columns-3' && <><Columns size={12} /> 3 คอลัมน์ (Features)</>}
                  {block.type === 'list' && <><List size={12} /> รายการ ({block.style === 'numbered' ? 'ตัวเลข' : 'จุด'})</>}
                  {block.type === 'quote' && <><MessageSquare size={12} /> คำคม / ไฮไลต์ (Quote)</>}
                  {block.type === 'callout' && <><AlertCircle size={12} /> กล่องไฮไลต์ (Callout)</>}
                  {block.type === 'button' && <><ExternalLink size={12} /> ปุ่มแอ็กชัน (Button)</>}
                  {block.type === 'divider' && <><Minus size={12} /> เส้นแบ่ง (Divider)</>}
                </div>

                <div className="block-actions-controls">
                  <button
                    type="button"
                    className="btn-block-ctrl"
                    disabled={idx === 0}
                    onClick={() => moveBlock(idx, -1)}
                    title="เลื่อนบล็อกขึ้น"
                  >
                    <ChevronUp size={14} />
                  </button>
                  <button
                    type="button"
                    className="btn-block-ctrl"
                    disabled={idx === blocks.length - 1}
                    onClick={() => moveBlock(idx, 1)}
                    title="เลื่อนบล็อกลง"
                  >
                    <ChevronDown size={14} />
                  </button>
                  <button
                    type="button"
                    className="btn-block-ctrl"
                    onClick={() => duplicateBlock(idx)}
                    title="ทำซ้ำบล็อกนี้ (Duplicate)"
                  >
                    <Copy size={13} />
                  </button>
                  <button
                    type="button"
                    className="btn-block-ctrl delete"
                    onClick={() => deleteBlock(idx)}
                    title="ลบบล็อกนี้"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              {/* Block Content Editor Body */}
              <div className="block-card-body">
                {/* 1. PARAGRAPH BLOCK */}
                {block.type === 'paragraph' && (
                  <div className="field-group">
                    <textarea
                      className="form-input form-textarea"
                      rows="3"
                      placeholder="พิมพ์ข้อความเนื้อหาย่อหน้าตรงนี้..."
                      value={block.text || ''}
                      onChange={(e) => updateBlock(idx, { text: e.target.value })}
                    />
                    <div className="block-mini-options">
                      <button
                        type="button"
                        className={`btn-toggle-opt ${block.align === 'left' || !block.align ? 'active' : ''}`}
                        onClick={() => updateBlock(idx, { align: 'left' })}
                      >
                        <AlignLeft size={12} /> ชิดซ้าย
                      </button>
                      <button
                        type="button"
                        className={`btn-toggle-opt ${block.align === 'center' ? 'active' : ''}`}
                        onClick={() => updateBlock(idx, { align: 'center' })}
                      >
                        <AlignCenter size={12} /> กึ่งกลาง
                      </button>
                    </div>
                  </div>
                )}

                {/* 2. HEADING BLOCK */}
                {block.type === 'heading' && (
                  <div className="field-group">
                    <div className="heading-input-row">
                      <select
                        className="form-input form-select-level"
                        value={block.level || 2}
                        onChange={(e) => updateBlock(idx, { level: parseInt(e.target.value, 10) })}
                      >
                        <option value={2}>H2 (หัวข้อหลัก)</option>
                        <option value={3}>H3 (หัวข้อย่อย)</option>
                      </select>
                      <input
                        type="text"
                        className={`form-input font-bold ${block.level === 3 ? 'text-base' : 'text-lg'}`}
                        placeholder="พิมพ์หัวข้อบทความ..."
                        value={block.text || ''}
                        onChange={(e) => updateBlock(idx, { text: e.target.value })}
                      />
                    </div>
                  </div>
                )}

                {/* 3. MEDIA & TEXT BLOCK (WordPress Popular Feature) */}
                {block.type === 'media-text' && (
                  <div className="media-text-editor-grid">
                    <div className="media-side-col">
                      <label className="field-lbl-xs">
                        <ImageIcon size={12} /> รูปภาพประกบเนื้อหา:
                      </label>
                      {block.imageUrl ? (
                        <div className="media-thumb-preview">
                          <img src={block.imageUrl} alt={block.imageAlt || 'Media'} />
                          <button
                            type="button"
                            className="btn-remove-thumb"
                            onClick={() => updateBlock(idx, { imageUrl: '' })}
                            title="เปลี่ยนรูปภาพ"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div className="media-upload-dropzone">
                          <label className="btn-upload-dropzone-lbl">
                            {compressingBlockId === block.id ? (
                              <>
                                <RefreshCw size={16} className="spin-icon text-blue" />
                                <span>กำลังแปลง WebP...</span>
                              </>
                            ) : (
                              <>
                                <Upload size={16} className="text-blue" />
                                <span>อัปโหลดภาพ (WebP อัตโนมัติ)</span>
                              </>
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              style={{ display: 'none' }}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleBlockImageUpload(file, idx, 'imageUrl');
                              }}
                            />
                          </label>
                          <input
                            type="url"
                            className="form-input form-input-sm"
                            placeholder="หรือวาง URL รูปภาพ..."
                            value={block.imageUrl || ''}
                            onChange={(e) => updateBlock(idx, { imageUrl: e.target.value })}
                          />
                        </div>
                      )}

                      <input
                        type="text"
                        className="form-input form-input-xs"
                        placeholder="คำบรรยายใต้ภาพ (Caption)"
                        value={block.caption || ''}
                        onChange={(e) => updateBlock(idx, { caption: e.target.value })}
                      />
                      <input
                        type="text"
                        className="form-input form-input-xs"
                        placeholder="ALT Text สำหรับ SEO"
                        value={block.imageAlt || ''}
                        onChange={(e) => updateBlock(idx, { imageAlt: e.target.value })}
                      />
                    </div>

                    <div className="text-side-col">
                      <div className="media-side-toggle-row">
                        <label className="field-lbl-xs">ตำแหน่งภาพ:</label>
                        <div className="toggle-btn-group">
                          <button
                            type="button"
                            className={`btn-toggle-opt ${block.mediaPosition === 'left' ? 'active' : ''}`}
                            onClick={() => updateBlock(idx, { mediaPosition: 'left' })}
                          >
                            ภาพอยู่ซ้าย
                          </button>
                          <button
                            type="button"
                            className={`btn-toggle-opt ${block.mediaPosition === 'right' ? 'active' : ''}`}
                            onClick={() => updateBlock(idx, { mediaPosition: 'right' })}
                          >
                            ภาพอยู่ขวา
                          </button>
                        </div>
                      </div>

                      <input
                        type="text"
                        className="form-input font-bold"
                        placeholder="หัวข้อประกบคู่ภาพ (Heading)..."
                        value={block.title || ''}
                        onChange={(e) => updateBlock(idx, { title: e.target.value })}
                      />
                      <textarea
                        className="form-input form-textarea"
                        rows="4"
                        placeholder="พิมพ์เนื้อหาที่ประกบคู่กับภาพตรงนี้..."
                        value={block.text || ''}
                        onChange={(e) => updateBlock(idx, { text: e.target.value })}
                      />
                    </div>
                  </div>
                )}

                {/* 4. SINGLE IMAGE BLOCK */}
                {block.type === 'image' && (
                  <div className="single-image-editor">
                    {block.url ? (
                      <div className="image-preview-center">
                        <img src={block.url} alt={block.alt || 'Content Image'} />
                        <button
                          type="button"
                          className="btn-remove-thumb"
                          onClick={() => updateBlock(idx, { url: '' })}
                          title="เปลี่ยนรูปภาพ"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div className="media-upload-dropzone">
                        <label className="btn-upload-dropzone-lbl">
                          {compressingBlockId === block.id ? (
                            <>
                              <RefreshCw size={16} className="spin-icon text-blue" />
                              <span>กำลังแปลง WebP...</span>
                            </>
                          ) : (
                            <>
                              <Upload size={16} className="text-blue" />
                              <span>อัปโหลดภาพประกอบ (WebP อัตโนมัติ)</span>
                            </>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleBlockImageUpload(file, idx, 'url');
                            }}
                          />
                        </label>
                        <input
                          type="url"
                          className="form-input form-input-sm"
                          placeholder="หรือวาง URL รูปภาพ..."
                          value={block.url || ''}
                          onChange={(e) => updateBlock(idx, { url: e.target.value })}
                        />
                      </div>
                    )}

                    <div className="image-meta-inputs-row">
                      <input
                        type="text"
                        className="form-input form-input-sm"
                        placeholder="คำบรรยายใต้ภาพ (Caption)"
                        value={block.caption || ''}
                        onChange={(e) => updateBlock(idx, { caption: e.target.value })}
                      />
                      <input
                        type="text"
                        className="form-input form-input-sm"
                        placeholder="คำอธิบายภาพ SEO (Image ALT Text)"
                        value={block.alt || ''}
                        onChange={(e) => updateBlock(idx, { alt: e.target.value })}
                      />
                    </div>
                  </div>
                )}

                {/* 5. TWO COLUMNS BLOCK */}
                {block.type === 'columns-2' && (
                  <div className="columns-editor-wrapper">
                    <div className="columns-ratio-header">
                      <span className="field-lbl-xs">สัดส่วนคอลัมน์:</span>
                      <div className="toggle-btn-group">
                        <button
                          type="button"
                          className={`btn-toggle-opt ${block.ratio === '50-50' || !block.ratio ? 'active' : ''}`}
                          onClick={() => updateBlock(idx, { ratio: '50-50' })}
                        >
                          50 : 50 (เท่ากัน)
                        </button>
                        <button
                          type="button"
                          className={`btn-toggle-opt ${block.ratio === '60-40' ? 'active' : ''}`}
                          onClick={() => updateBlock(idx, { ratio: '60-40' })}
                        >
                          60 : 40 (ซ้ายกว้าง)
                        </button>
                        <button
                          type="button"
                          className={`btn-toggle-opt ${block.ratio === '40-60' ? 'active' : ''}`}
                          onClick={() => updateBlock(idx, { ratio: '40-60' })}
                        >
                          40 : 60 (ขวากว้าง)
                        </button>
                      </div>
                    </div>

                    <div className={`columns-2-grid-editor ratio-${block.ratio || '50-50'}`}>
                      {/* Left Col */}
                      <div className="col-subcard">
                        <span className="col-tag">คอลัมน์ซ้าย</span>
                        <input
                          type="text"
                          className="form-input font-semibold form-input-sm"
                          placeholder="หัวข้อคอลัมน์ซ้าย..."
                          value={block.leftTitle || ''}
                          onChange={(e) => updateBlock(idx, { leftTitle: e.target.value })}
                        />
                        <textarea
                          className="form-input form-textarea"
                          rows="4"
                          placeholder="เนื้อหาคอลัมน์ซ้าย (ใส่ข้อความหรือ • bullet ได้)..."
                          value={block.leftText || ''}
                          onChange={(e) => updateBlock(idx, { leftText: e.target.value })}
                        />
                      </div>

                      {/* Right Col */}
                      <div className="col-subcard">
                        <span className="col-tag">คอลัมน์ขวา</span>
                        <input
                          type="text"
                          className="form-input font-semibold form-input-sm"
                          placeholder="หัวข้อคอลัมน์ขวา..."
                          value={block.rightTitle || ''}
                          onChange={(e) => updateBlock(idx, { rightTitle: e.target.value })}
                        />
                        <textarea
                          className="form-input form-textarea"
                          rows="4"
                          placeholder="เนื้อหาคอลัมน์ขวา (ใส่ข้อความหรือ • bullet ได้)..."
                          value={block.rightText || ''}
                          onChange={(e) => updateBlock(idx, { rightText: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 6. THREE COLUMNS BLOCK */}
                {block.type === 'columns-3' && (
                  <div className="columns-3-grid-editor">
                    <div className="col-subcard">
                      <span className="col-tag">คอลัมน์ 1</span>
                      <input
                        type="text"
                        className="form-input font-semibold form-input-sm"
                        placeholder="หัวข้อ 1..."
                        value={block.col1Title || ''}
                        onChange={(e) => updateBlock(idx, { col1Title: e.target.value })}
                      />
                      <textarea
                        className="form-input form-textarea"
                        rows="3"
                        placeholder="เนื้อหา..."
                        value={block.col1Text || ''}
                        onChange={(e) => updateBlock(idx, { col1Text: e.target.value })}
                      />
                    </div>
                    <div className="col-subcard">
                      <span className="col-tag">คอลัมน์ 2</span>
                      <input
                        type="text"
                        className="form-input font-semibold form-input-sm"
                        placeholder="หัวข้อ 2..."
                        value={block.col2Title || ''}
                        onChange={(e) => updateBlock(idx, { col2Title: e.target.value })}
                      />
                      <textarea
                        className="form-input form-textarea"
                        rows="3"
                        placeholder="เนื้อหา..."
                        value={block.col2Text || ''}
                        onChange={(e) => updateBlock(idx, { col2Text: e.target.value })}
                      />
                    </div>
                    <div className="col-subcard">
                      <span className="col-tag">คอลัมน์ 3</span>
                      <input
                        type="text"
                        className="form-input font-semibold form-input-sm"
                        placeholder="หัวข้อ 3..."
                        value={block.col3Title || ''}
                        onChange={(e) => updateBlock(idx, { col3Title: e.target.value })}
                      />
                      <textarea
                        className="form-input form-textarea"
                        rows="3"
                        placeholder="เนื้อหา..."
                        value={block.col3Text || ''}
                        onChange={(e) => updateBlock(idx, { col3Text: e.target.value })}
                      />
                    </div>
                  </div>
                )}

                {/* 7. LIST BLOCK */}
                {block.type === 'list' && (
                  <div className="list-editor-wrapper">
                    <div className="list-header-options">
                      <span className="field-lbl-xs">ประเภทรายการ:</span>
                      <div className="toggle-btn-group">
                        <button
                          type="button"
                          className={`btn-toggle-opt ${block.style === 'bullet' || !block.style ? 'active' : ''}`}
                          onClick={() => updateBlock(idx, { style: 'bullet' })}
                        >
                          • จุดกลม (Bullets)
                        </button>
                        <button
                          type="button"
                          className={`btn-toggle-opt ${block.style === 'numbered' ? 'active' : ''}`}
                          onClick={() => updateBlock(idx, { style: 'numbered' })}
                        >
                          1. 2. 3. ลำดับตัวเลข
                        </button>
                      </div>
                    </div>

                    <div className="list-items-inputs">
                      {(block.items || ['']).map((item, itemIdx) => (
                        <div key={itemIdx} className="list-item-row">
                          <span className="list-bullet-prefix">
                            {block.style === 'numbered' ? `${itemIdx + 1}.` : '•'}
                          </span>
                          <input
                            type="text"
                            className="form-input form-input-sm"
                            placeholder={`รายการที่ ${itemIdx + 1}...`}
                            value={item}
                            onChange={(e) => {
                              const newItems = [...(block.items || [''])];
                              newItems[itemIdx] = e.target.value;
                              updateBlock(idx, { items: newItems });
                            }}
                          />
                          <button
                            type="button"
                            className="btn-remove-list-item"
                            onClick={() => {
                              const newItems = (block.items || ['']).filter((_, i) => i !== itemIdx);
                              updateBlock(idx, { items: newItems.length ? newItems : [''] });
                            }}
                            title="ลบรายการนี้"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="btn-add-list-item"
                        onClick={() => {
                          const newItems = [...(block.items || ['']), ''];
                          updateBlock(idx, { items: newItems });
                        }}
                      >
                        + เพิ่มข้อใหม่
                      </button>
                    </div>
                  </div>
                )}

                {/* 8. QUOTE BLOCK */}
                {block.type === 'quote' && (
                  <div className="quote-editor-wrapper">
                    <textarea
                      className="form-input form-textarea font-serif italic"
                      rows="2"
                      placeholder="ข้อความคำคม หรือบทสัมภาษณ์ไฮไลต์..."
                      value={block.text || ''}
                      onChange={(e) => updateBlock(idx, { text: e.target.value })}
                    />
                    <input
                      type="text"
                      className="form-input form-input-sm"
                      placeholder="— ชื่อและตำแหน่งผู้ให้สัมภาษณ์ (Author / Source)"
                      value={block.author || ''}
                      onChange={(e) => updateBlock(idx, { author: e.target.value })}
                    />
                  </div>
                )}

                {/* 9. CALLOUT BOX */}
                {block.type === 'callout' && (
                  <div className={`callout-editor-wrapper theme-${block.style || 'info'}`}>
                    <div className="callout-style-row">
                      <span className="field-lbl-xs">โทนสีกล่อง:</span>
                      <div className="toggle-btn-group">
                        {['info', 'gold', 'emerald', 'purple'].map((theme) => (
                          <button
                            key={theme}
                            type="button"
                            className={`btn-toggle-opt ${block.style === theme ? 'active' : ''}`}
                            onClick={() => updateBlock(idx, { style: theme })}
                          >
                            {theme === 'info' && '🔵 น้ำเงิน Info'}
                            {theme === 'gold' && '🟡 ทอง รางวัล'}
                            {theme === 'emerald' && '🟢 เขียว ไฮไลต์'}
                            {theme === 'purple' && '🟣 ม่วง อีสปอร์ต'}
                          </button>
                        ))}
                      </div>
                    </div>
                    <input
                      type="text"
                      className="form-input font-bold form-input-sm"
                      placeholder="หัวข้อกล่องเด่น..."
                      value={block.title || ''}
                      onChange={(e) => updateBlock(idx, { title: e.target.value })}
                    />
                    <textarea
                      className="form-input form-textarea"
                      rows="2"
                      placeholder="ข้อความเน้นพิเศษ กำหนดการ หรือสรุป..."
                      value={block.text || ''}
                      onChange={(e) => updateBlock(idx, { text: e.target.value })}
                    />
                  </div>
                )}

                {/* 10. BUTTON BLOCK */}
                {block.type === 'button' && (
                  <div className="button-editor-wrapper">
                    <div className="form-row-2">
                      <input
                        type="text"
                        className="form-input font-semibold"
                        placeholder="ข้อความบนปุ่ม (Label)..."
                        value={block.label || ''}
                        onChange={(e) => updateBlock(idx, { label: e.target.value })}
                      />
                      <input
                        type="url"
                        className="form-input font-mono form-input-sm"
                        placeholder="ลิงก์ปลายทาง (URL หรือ #/path)..."
                        value={block.url || ''}
                        onChange={(e) => updateBlock(idx, { url: e.target.value })}
                      />
                    </div>
                    <div className="button-options-row">
                      <div className="toggle-btn-group">
                        <button
                          type="button"
                          className={`btn-toggle-opt ${block.style === 'primary' || !block.style ? 'active' : ''}`}
                          onClick={() => updateBlock(idx, { style: 'primary' })}
                        >
                          ปุ่มสีทึบ (Primary)
                        </button>
                        <button
                          type="button"
                          className={`btn-toggle-opt ${block.style === 'outline' ? 'active' : ''}`}
                          onClick={() => updateBlock(idx, { style: 'outline' })}
                        >
                          ปุ่มเส้นกรอบ (Outline)
                        </button>
                      </div>
                      <div className="toggle-btn-group">
                        <button
                          type="button"
                          className={`btn-toggle-opt ${block.align === 'center' || !block.align ? 'active' : ''}`}
                          onClick={() => updateBlock(idx, { align: 'center' })}
                        >
                          กึ่งกลาง
                        </button>
                        <button
                          type="button"
                          className={`btn-toggle-opt ${block.align === 'left' ? 'active' : ''}`}
                          onClick={() => updateBlock(idx, { align: 'left' })}
                        >
                          ชิดซ้าย
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 11. DIVIDER BLOCK */}
                {block.type === 'divider' && (
                  <div className="divider-editor-wrapper">
                    <hr className="divider-line-preview" />
                    <span className="text-xs text-muted">เส้นคั่นแบ่งส่วนเนื้อหา</span>
                  </div>
                )}
              </div>

              {/* Quick Add In-Between Blocks */}
              <div className="in-between-inserter">
                <button
                  type="button"
                  className="btn-quick-insert-dot"
                  onClick={() => addBlock('paragraph', {}, idx)}
                  title="แทรกบล็อกใหม่ตรงนี้"
                >
                  <Plus size={11} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
