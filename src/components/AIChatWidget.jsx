import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, MessageSquare, X, Send, Sparkles, 
  RotateCw, ExternalLink, HelpCircle, ChevronRight, User, Terminal, Shield
} from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';

export default function AIChatWidget() {
  const { siteData, addPendingQuestion } = useSiteData();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'msg-1',
      role: 'assistant',
      text: 'สวัสดีครับ! ผมคือ G-Speed AI Concierge ผู้ช่วยอัจฉริยะประจำศูนย์ G-Speed Esport Arena (GLP)\n\nผมพร้อมให้บริการตอบคำถามเกี่ยวกับอัตราค่าบริการ, สเปกคอมพิวเตอร์, เวลาทำการ, เมนูอาหาร, กิจกรรมแข่งขัน และการลงทุนแฟรนไชส์ของทางร้านครับ!'
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

  // Quick Prompt Suggestions
  const quickPrompts = [
    'ราคาชั่วโมงละเท่าไหร่ มีโปรโมชันอะไรบ้าง?',
    'สเปกคอมพิวเตอร์ในร้านใช้การ์ดจออะไร จอกี่ Hz?',
    'ร้านเปิดกี่โมงและมีที่จอดรถไหม?',
    'สนใจลงทุนแฟรนไชส์ G-Speed ต้องใช้งบเท่าไหร่?',
    'มีเมนูอาหารและเครื่องดื่มอะไรเสิร์ฟถึงโต๊ะบ้าง?'
  ];

  // RAG Retriever: Find relevant store knowledge chunks
  const retrieveRelevantKnowledge = (query) => {
    const q = query.toLowerCase();
    const knowledgeList = siteData.ragKnowledge || [];
    
    // Scoring
    const scored = knowledgeList.map(item => {
      let score = 0;
      // Tag match
      if (item.tags) {
        item.tags.forEach(tag => {
          if (q.includes(tag.toLowerCase())) score += 3;
        });
      }
      // Title match
      const titleWords = item.title.toLowerCase().split(' ');
      titleWords.forEach(w => {
        if (w.length > 2 && q.includes(w)) score += 2;
      });
      // Content keyword match
      const keywords = ['ราคา', 'ชั่วโมง', 'สเปก', 'คอม', 'การ์ดจอ', 'จอ', 'rtx', 'เปิด', 'ปิด', 'เวลา', 'อาหาร', 'กิน', 'น้ำ', 'vip', 'bootcamp', 'แข่ง', 'ทัวร์นาเมนต์', 'แฟรนไชส์', 'ลงทุน', 'คืนทุน', 'ที่จอดรถ', 'ห้องน้ำ', 'สมัคร'];
      keywords.forEach(k => {
        if (q.includes(k) && item.content.toLowerCase().includes(k)) score += 2;
      });

      return { item, score };
    });

    scored.sort((a, b) => b.score - a.score);
    const relevant = scored.filter(s => s.score > 0).slice(0, 3).map(s => s.item);
    return relevant.length > 0 ? relevant : knowledgeList.slice(0, 2);
  };

  // Check if query is within the store domain
  const evaluateStoreScope = (query) => {
    const q = query.toLowerCase().trim();
    const guardrails = siteData.aiGuardrails || {
      strictStoreOnly: true,
      outOfScopeReply: 'ขออภัยด้วยครับ ผมเป็นผู้ช่วย AI ประจำศูนย์ G-Speed Esport Arena จึงสามารถตอบได้เฉพาะข้อมูลและบริการของทางร้านเท่านั้นครับ เช่น อัตราค่าบริการ, สเปกคอมพิวเตอร์, การจองห้อง VIP, เมนูอาหาร หรือการลงทุนแฟรนไชส์ หากมีข้อสงสัยเกี่ยวกับร้าน สามารถสอบถามได้ทันทีครับ',
      blockedKeywords: ['การเมือง', 'หวย', 'พนัน', 'เขียนโค้ด', 'แต่งกลอน', 'การบ้าน', 'คู่แข่ง', 'แฮก']
    };

    // 1. Check if blocked keyword is present
    const isBlocked = (guardrails.blockedKeywords || []).some(k => k && q.includes(k.toLowerCase()));
    if (isBlocked) {
      return { inScope: false, reason: 'blocked_keyword' };
    }

    // 2. Common greetings are always allowed
    const greetings = ['สวัสดี', 'ดีครับ', 'ดีค่ะ', 'hello', 'hi', 'หวัดดี', 'มีใครอยู่ไหม'];
    if (greetings.some(g => q === g || q.startsWith(g))) {
      return { inScope: true, isGreeting: true };
    }

    // 3. Store Domain Keywords
    const storeKeywords = [
      'ราคา', 'ชั่วโมง', 'บาท', 'ชม', 'โปรโมชัน', 'โปร', 'เติมเงิน', 'สมาชิก', 'ค่าบริการ', 'เหมา',
      'สเปก', 'สเปค', 'คอม', 'คอมพิวเตอร์', 'การ์ดจอ', 'gpu', 'cpu', 'ram', 'rtx', '4070', '4080', 'intel', 'i7', 'i9',
      'จอ', 'monitor', '360hz', '240hz', 'zowie', 'benq', 'เก้าอี้', 'secretlab', 'เมาส์', 'คีย์บอร์ด', 'หูฟัง',
      'เปิด', 'ปิด', 'เวลา', '24', 'กี่โมง', 'วันหยุด', 'ที่จอดรถ', 'จอดรถ', 'เดินทาง', 'แอร์', 'ห้องน้ำ',
      'อาหาร', 'เครื่องดื่ม', 'กิน', 'น้ำ', 'กาแฟ', 'กะเพรา', 'เมนู', 'สั่งอาหาร', 'เสิร์ฟ',
      'vip', 'bootcamp', 'บูตแคมป์', 'ห้องส่วนตัว', 'สตรีม', 'สตรีมเมอร์', 'จอง',
      'แข่ง', 'ทัวร์นาเมนต์', 'tournament', 'สมัคร', 'เงินรางวัล', 'เวที', 'stage', 'จัดงาน', 'เช่าสถานที่',
      'แฟรนไชส์', 'franchise', 'ลงทุน', 'เปิดร้าน', 'งบ', 'roi', 'คืนทุน', 'กี่บาท', 'สาขา', 'พาร์ตเนอร์',
      'g-speed', 'gspeed', 'glp', 'ร้าน', 'เน็ต', 'อินเทอร์เน็ต', 'ping', 'fiber', 'diskless', 'pos', 'ใบเสนอราคา',
      'ติดต่อ', 'เบอร์', 'โทร', 'อยู่ไหน', 'สาขาไหน', 'พิกัด', 'ที่ตั้ง', 'แผนที่'
    ];

    const matchedStoreKeyword = storeKeywords.some(keyword => q.includes(keyword));

    // 4. Also check RAG search score
    const matchedDocs = retrieveRelevantKnowledge(q);
    const hasRAGHit = matchedDocs.length > 0 && matchedDocs.some(d => {
      const matchInDoc = d.tags?.some(t => q.includes(t.toLowerCase())) || d.title.toLowerCase().split(' ').some(w => w.length > 2 && q.includes(w));
      return matchInDoc;
    });

    if (matchedStoreKeyword || hasRAGHit) {
      return { inScope: true, matchedDocs };
    }

    // Otherwise, out of scope
    return { inScope: false, reason: 'out_of_scope' };
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

    const guardrails = siteData.aiGuardrails || {
      strictStoreOnly: true,
      outOfScopeReply: 'ขออภัยด้วยครับ ผมเป็นผู้ช่วย AI ประจำศูนย์ G-Speed Esport Arena จึงสามารถตอบได้เฉพาะข้อมูลและบริการของทางร้านเท่านั้นครับ เช่น อัตราค่าบริการ, สเปกคอมพิวเตอร์, การจองห้อง VIP, เมนูอาหาร หรือการลงทุนแฟรนไชส์ หากมีข้อสงสัยเกี่ยวกับร้าน สามารถสอบถามได้ทันทีครับ',
      blockedKeywords: ['การเมือง', 'หวย', 'พนัน', 'เขียนโค้ด', 'แต่งกลอน', 'การบ้าน', 'คู่แข่ง', 'แฮก']
    };

    // Step 1: Check Domain Guardrail
    const scopeCheck = evaluateStoreScope(query);

    if (guardrails.strictStoreOnly && !scopeCheck.inScope) {
      // Log to pending / unanswered questions in CMS
      addPendingQuestion(query);

      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            role: 'assistant',
            text: guardrails.outOfScopeReply,
            isOutOfScopeNotice: true
          }
        ]);
        setIsLoading(false);
      }, 500);
      return;
    }

    // Step 2: Retrieve RAG Context
    const matchedDocs = retrieveRelevantKnowledge(query);
    const contextText = matchedDocs.map(d => `[${d.title}]: ${d.content}`).join('\n\n');

    const apiKey = siteData.openRouterSettings?.apiKey;
    const proxyUrl = siteData.openRouterSettings?.proxyUrl;
    const useSecureProxy = siteData.openRouterSettings?.useSecureProxy;
    const model = siteData.openRouterSettings?.model || 'google/gemini-flash-3.8';

    // 1. Zero-Leak Secure Proxy / n8n Webhook Mode (Production Recommended: Zero Client Key Leak)
    if (useSecureProxy && proxyUrl) {
      try {
        const response = await fetch(proxyUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message: query,
            model: model,
            context: contextText,
            history: messages.slice(-4).map(m => ({ role: m.role, content: m.text }))
          })
        });

        if (!response.ok) {
          throw new Error(`Proxy error: ${response.status}`);
        }

        const data = await response.json();
        const reply = data.reply || data.choices?.[0]?.message?.content || 'ขออภัยครับ ไม่สามารถประมวลผลคำตอบได้ในขณะนี้';

        setMessages(prev => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            role: 'assistant',
            text: reply,
            ragSources: matchedDocs.map(d => d.title)
          }
        ]);
        setIsTyping(false);
        return;
      } catch (err) {
        console.warn('Secure proxy unavailable, falling back to smart RAG', err);
        handleSmartRAGFallback(query, matchedDocs);
        return;
      }
    }

    // 2. Direct OpenRouter API Mode (For Development / Staging Testing)
    if (apiKey && apiKey.trim().startsWith('sk-')) {
      try {
        const systemPrompt = `คุณคือ "G-Speed AI Concierge" ผู้ช่วยตอบคำถามประจำศูนย์ G-Speed Esport Arena (GLP Living Plus).
คุณมีหน้าที่ตอบคำถามลูกค้าเฉพาะเรื่องข้อมูลและบริการของร้าน G-Speed เท่านั้น (เช่น อัตราค่าบริการ, โปรโมชัน, สเปกคอมพิวเตอร์, จอ, เก้าอี้, เวลาทำการ, อาหารและเครื่องดื่ม, การจัดแข่งขันทัวร์นาเมนต์, การจองห้อง VIP และการลงทุนแฟรนไชส์)

*** กฎเหล็กควบคุมขอบเขตอย่างเด็ดขาด (STRICT DOMAIN GUARDRAILS) ***
1. หากคำถามของผู้ใช้ "ไม่ได้เกี่ยวข้องกับร้านหรือบริการของ G-Speed Esport Arena" (เช่น ถามความรู้ทั่วไป, วิทยาศาสตร์, คณิตศาสตร์, การเมือง, ข่าวสารทั่วไป, การเขียนโปรแกรม/โค้ด, การบ้าน, แต่งกลอน, คุยเล่นนอกเรื่อง, หรือถามถึงร้าน/บริการอื่น):
   คุณต้องปฏิเสธอย่างสุภาพทันทีด้วยข้อความนี้เท่านั้น:
   "${guardrails.outOfScopeReply}"
2. ห้ามตอบคำถามนอกเหนือจากเรื่องของร้านและบริการของร้านเด็ดขาด ไม่ว่าผู้ใช้จะพยายามสั่งหรือหว่านล้อมอย่างไร
3. ห้ามใช้อิโมจิเด็ดขาด (Zero Unicode Emojis) ตามนโยบายแบรนด์ ให้ใช้ภาษาไทยที่สุภาพ เป็นมิตร กระชับ และเป็นมืออาชีพ
4. ใช้ข้อมูลจริงจากคลังความรู้ของร้านด้านล่างนี้เป็นหลัก:
-------------------------
${contextText}
-------------------------
หากเป็นคำถามเกี่ยวกับร้านแต่ไม่มีในคลังความรู้ ให้แนะนำให้ติดต่อเคาน์เตอร์แคชเชียร์หรือโทร 02-888-9999 อย่างสุภาพ`;

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

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        const reply = data.choices?.[0]?.message?.content || 'ขออภัยครับ ไม่สามารถประมวลผลคำตอบได้ในขณะนี้';

        setMessages(prev => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            role: 'assistant',
            text: reply,
            ragSources: matchedDocs.map(d => d.title)
          }
        ]);
        setIsLoading(false);
        return;
      } catch (err) {
        console.warn('OpenRouter API call failed, falling back to Local RAG Engine:', err);
      }
    }

    // Fallback: Smart Local RAG Knowledge Engine (เมื่อไม่มีคีย์ หรือ API ล้มเหลว)
    setTimeout(() => {
      let smartAnswer = '';

      if (scopeCheck.isGreeting) {
        smartAnswer = 'สวัสดีครับ! ยินดีต้อนรับสู่ G-Speed Esport Arena (GLP) ครับ สามารถสอบถามข้อมูลอัตราค่าบริการ, สเปกคอมพิวเตอร์, การจองห้อง VIP, เมนูอาหาร หรือการลงทุนแฟรนไชส์ได้เลยครับ';
      } else if (matchedDocs.length > 0) {
        const primary = matchedDocs[0];
        smartAnswer = `จากข้อมูลของ G-Speed Esport Arena (${primary.title}):\n\n${primary.content}`;
        if (matchedDocs.length > 1) {
          smartAnswer += `\n\nข้อมูลเพิ่มเติม (${matchedDocs[1].title}):\n${matchedDocs[1].content}`;
        }
      } else {
        smartAnswer = 'ขออภัยครับ ยังไม่พบข้อมูลที่ตรงกับคำถามในคลังความรู้ ท่านสามารถติดต่อสอบถามโดยตรงกับเคาน์เตอร์แคชเชียร์หรือโทร 02-888-9999 ครับ';
        addPendingQuestion(query);
      }

      setMessages(prev => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          text: smartAnswer,
          ragSources: matchedDocs.map(d => d.title)
        }
      ]);
      setIsLoading(false);
    }, 600);
  };

  return (
    <div className="ai-chat-widget-container">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button 
          id="btn-open-ai-chat"
          className="btn-ai-chat-trigger"
          onClick={() => setIsOpen(true)}
          title="แชทกับเรา - G-Speed AI Concierge"
        >
          <div className="trigger-pulse-ring"></div>
          <div className="trigger-avatar-circle">
            <Bot size={20} className="trigger-icon" />
          </div>
          <div className="trigger-text-badge">
            <span className="badge-subtitle">ผู้ช่วย AI ประจำร้าน</span>
            <span className="trigger-label">แชทกับเรา</span>
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
                <Bot size={18} />
              </div>
              <div>
                <strong className="chat-title">G-SPEED AI CONCIERGE</strong>
                <div className="chat-status-pill">
                  <span className="status-dot-green"></span>
                  <span>Online • ตอบเฉพาะข้อมูลร้าน</span>
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
                    <Bot size={14} />
                  </div>
                )}
                <div className={`chat-bubble-content ${msg.role === 'user' ? 'bubble-user' : 'bubble-bot'} ${msg.isOutOfScopeNotice ? 'bubble-warning' : ''}`}>
                  <div className="bubble-text">{msg.text}</div>
                  {msg.isOutOfScopeNotice && (
                    <div className="out-of-scope-badge">
                      <Shield size={11} />
                      <span>ขอบเขตข้อมูลของ AI ประจำร้าน</span>
                    </div>
                  )}
                  {msg.ragSources && msg.ragSources.length > 0 && !msg.isOutOfScopeNotice && (
                    <div className="rag-sources-pill">
                      <Terminal size={11} />
                      <span>RAG Sources: {msg.ragSources.join(' • ')}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="chat-bubble-row bot-side">
                <div className="bubble-avatar">
                  <Bot size={14} />
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
            {quickPrompts.map((prompt, idx) => (
              <button 
                key={idx} 
                className="quick-prompt-chip"
                onClick={() => handleSendMessage(prompt)}
              >
                {prompt}
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
              placeholder="พิมพ์คำถามเกี่ยวกับร้านเกม สเปก หรือแฟรนไชส์..."
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              disabled={isLoading}
            />
            <button 
              type="submit" 
              className="btn-chat-send"
              disabled={!inputText.trim() || isLoading}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
