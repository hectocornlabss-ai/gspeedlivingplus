import React, { useState } from 'react';
import { 
  MessagesSquare, Kanban, Receipt, HardDrive, 
  Send, Bot, UserCheck, ShieldAlert, CheckCircle2, 
  Phone, MapPin, DollarSign, 
  Plus, Edit3, Trash2, 
  ExternalLink, MessageCircle, 
  Wrench, Shield, Check, Search, Terminal
} from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';

export default function OmnichannelLeadsCMS() {
  const { 
    siteData, 
    addLead, 
    updateLead, 
    deleteLead, 
    moveLeadStage,
    addExpense,
    deleteExpense,
    assignAgentToChat,
    toggleAIMute,
    sendChatMessage,
    updateStationStatus,
    addRMAClaim,
    updateRMAClaim
  } = useSiteData();

  // Sub-tabs: 'inbox' | 'pipeline' | 'cashflow' | 'hardware'
  const [activeSubTab, setActiveSubTab] = useState('inbox');

  // =========================================================================
  // TAB 1: OMNICHANNEL INBOX STATE
  // =========================================================================
  const chats = siteData.omnichannelChats || [];
  const [selectedChatId, setSelectedChatId] = useState(chats[0]?.id || 'chat-line-1');
  const [messageInput, setMessageInput] = useState('');
  const [activeAgentName, setActiveAgentName] = useState('แอดมิน กอล์ฟ (ฝ่ายบริการลูกค้า)');
  const [channelFilter, setChannelFilter] = useState('all'); // 'all', 'line', 'web', 'facebook'
  const [quickToast, setQuickToast] = useState(null);

  const showToast = (msg) => {
    setQuickToast(msg);
    setTimeout(() => setQuickToast(null), 3000);
  };

  const selectedChat = chats.find(c => c.id === selectedChatId) || chats[0];

  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (!messageInput.trim() || !selectedChat) return;
    sendChatMessage(selectedChat.id, messageInput, 'agent', activeAgentName);
    setMessageInput('');
    showToast('ส่งข้อความสำเร็จ!');
  };

  const handleQuickCanned = (text) => {
    if (!selectedChat) return;
    sendChatMessage(selectedChat.id, text, 'agent', activeAgentName);
    showToast('ส่งข้อความด่วนสำเร็จ!');
  };

  const handleTakeover = (chatId) => {
    assignAgentToChat(chatId, activeAgentName);
    showToast(`👤 ${activeAgentName} รับเคสดูแลต่อแล้ว (AI ระงับชั่วคราว 60 นาที)`);
  };

  const handleReturnToAI = (chatId) => {
    toggleAIMute(chatId, false);
    showToast('🤖 คืนการควบคุมให้ AI ตอบอัตโนมัติตามปกติแล้ว');
  };

  // =========================================================================
  // TAB 2: LEAD PIPELINE STATE
  // =========================================================================
  const leads = siteData.leads || [];
  const [leadFilterType, setLeadFilterType] = useState('all'); // 'all', 'franchise', 'tournament', 'diskless'
  const [leadSearchQuery, setLeadSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban', 'table'
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [editingLeadId, setEditingLeadId] = useState(null);
  const [leadFormData, setLeadFormData] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    location: '',
    type: 'franchise_m',
    typeName: 'แฟรนไชส์ Size M (60 เครื่อง)',
    budget: 3800000,
    stage: 'new',
    assignedStaff: 'คุณนัท (ฝ่ายขายแฟรนไชส์)',
    channel: 'web_3d_planner',
    floorArea: '200 ตร.ม.',
    expectedOpening: 'พฤศจิกายน 2026',
    notes: ''
  });

  const openNewLeadModal = () => {
    setEditingLeadId(null);
    setLeadFormData({
      name: '',
      company: '',
      phone: '',
      email: '',
      location: '',
      type: 'franchise_m',
      typeName: 'แฟรนไชส์ Size M (60 เครื่อง)',
      budget: 3800000,
      stage: 'new',
      assignedStaff: 'คุณนัท (ฝ่ายขายแฟรนไชส์)',
      channel: 'web_3d_planner',
      floorArea: '200 ตร.ม.',
      expectedOpening: 'พฤศจิกายน 2026',
      notes: ''
    });
    setIsLeadModalOpen(true);
  };

  const openEditLeadModal = (lead) => {
    setEditingLeadId(lead.id);
    setLeadFormData({ ...lead });
    setIsLeadModalOpen(true);
  };

  const handleSaveLead = (e) => {
    e.preventDefault();
    if (!leadFormData.name.trim() || !leadFormData.phone.trim()) {
      alert('กรุณากรอกชื่อและเบอร์โทรศัพท์');
      return;
    }

    if (editingLeadId) {
      updateLead(editingLeadId, leadFormData);
      showToast('อัปเดตข้อมูล Lead สำเร็จ!');
    } else {
      addLead(leadFormData);
      showToast('เพิ่ม Lead ใหม่และส่ง Webhook เข้า LINE กลุ่มฝ่ายขายแล้ว!');
    }
    setIsLeadModalOpen(false);
  };

  const stages = [
    { id: 'new', label: '1. Lead ใหม่ (New Lead)', color: '#3b82f6', badgeBg: 'rgba(59, 130, 246, 0.15)' },
    { id: 'contacted', label: '2. ติดต่อแล้ว (Contacted)', color: '#f59e0b', badgeBg: 'rgba(245, 158, 11, 0.15)' },
    { id: 'proposal', label: '3. ส่งแปลน 3D & ใบเสนอราคา', color: '#8b5cf6', badgeBg: 'rgba(139, 92, 246, 0.15)' },
    { id: 'won', label: '4. ปิดการขายสำเร็จ (Closed Won)', color: '#10b981', badgeBg: 'rgba(16, 185, 129, 0.15)' }
  ];

  const filteredLeads = leads.filter(l => {
    const matchesFilter = leadFilterType === 'all' 
      ? true 
      : leadFilterType === 'franchise' ? l.type.includes('franchise')
      : leadFilterType === 'tournament' ? l.type.includes('tournament')
      : leadFilterType === 'diskless' ? l.type.includes('diskless')
      : true;
    
    const matchesSearch = !leadSearchQuery.trim()
      ? true
      : (l.name?.toLowerCase().includes(leadSearchQuery.toLowerCase()) ||
         l.company?.toLowerCase().includes(leadSearchQuery.toLowerCase()) ||
         l.phone?.includes(leadSearchQuery));

    return matchesFilter && matchesSearch;
  });

  // =========================================================================
  // TAB 3: DAILY CASHFLOW & PETTY CASH STATE
  // =========================================================================
  const pettyCash = siteData.pettyCashExpenses || [];
  const [quickPayCommand, setQuickPayCommand] = useState('');
  const [isLineSummaryModalOpen, setIsLineSummaryModalOpen] = useState(false);
  const [manualExpense, setManualExpense] = useState({
    amount: '',
    category: 'fnb',
    desc: '',
    recordedBy: 'แอดมิน กอล์ฟ (LINE)'
  });

  // Financial Computations
  const grossRevenue = siteData.erpData?.dailyRevenue?.total || 48650;
  const gamingRev = siteData.erpData?.dailyRevenue?.gamingStations || 37900;
  const fnbRev = siteData.erpData?.dailyRevenue?.fnb || 10750;
  const pettyCashTotal = pettyCash.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const fixedDailyCosts = (siteData.erpData?.costs?.electricity || 7200) + 
                          (siteData.erpData?.costs?.fiberInternet || 1200) + 
                          (siteData.erpData?.costs?.staffSalary || 6000); // 14,400 THB
  const netDailyProfit = grossRevenue - fixedDailyCosts - pettyCashTotal;
  const profitMarginPercent = ((netDailyProfit / grossRevenue) * 100).toFixed(1);

  const handleExecuteQuickPay = (e) => {
    e?.preventDefault();
    if (!quickPayCommand.trim()) return;

    // Pattern: /pay [amount] [description]
    const cmd = quickPayCommand.trim();
    if (!cmd.toLowerCase().startsWith('/pay')) {
      alert('รูปแบบคำสั่งด่วนต้องขึ้นต้นด้วย /pay เช่น: /pay 450 ค่าล้างแอร์ โซน VIP');
      return;
    }

    const parts = cmd.split(/\s+/);
    if (parts.length < 3) {
      alert('กรุณาระบุจำนวนเงินและคำอธิบาย เช่น: /pay 350 ค่าน้ำแข็ง 3 กระสอบ');
      return;
    }

    const amount = parseFloat(parts[1].replace(/,/g, ''));
    if (isNaN(amount) || amount <= 0) {
      alert('จำนวนเงินไม่ถูกต้อง กรุณากรอกตัวเลข เช่น: /pay 1200 ซื้อวัตถุดิบ');
      return;
    }

    const desc = parts.slice(2).join(' ');
    let cat = 'general';
    let catName = 'ค่าใช้จ่ายทั่วไป';
    if (desc.includes('แอร์') || desc.includes('ซ่อม') || desc.includes('ไฟ')) {
      cat = 'maintenance';
      catName = 'ซ่อมบำรุง / แอร์';
    } else if (desc.includes('ไก่') || desc.includes('น้ำแข็ง') || desc.includes('ข้าว') || desc.includes('กาแฟ') || desc.includes('เฟรนช์ฟรายส์')) {
      cat = 'fnb';
      catName = 'วัตถุดิบอาหาร & คาเฟ่';
    } else if (desc.includes('แลน') || desc.includes('สาย') || desc.includes('เมาส์') || desc.includes('คอม') || desc.includes('RJ45')) {
      cat = 'it_hardware';
      catName = 'อุปกรณ์ไอที / สายไฟ';
    }

    addExpense({
      amount,
      desc,
      category: cat,
      categoryName: catName,
      recordedBy: 'พนักงานผ่าน LINE Bot',
      rawCommand: cmd
    });

    setQuickPayCommand('');
    showToast(`✅ บันทึกรายจ่ายสดย่อย ฿${amount.toLocaleString()} เรียบร้อยแล้ว!`);
  };

  const handleManualAddExpense = (e) => {
    e.preventDefault();
    const amount = parseFloat(manualExpense.amount);
    if (!amount || isNaN(amount) || !manualExpense.desc.trim()) {
      alert('กรุณาระบุจำนวนเงินและรายละเอียด');
      return;
    }

    let catName = 'ค่าใช้จ่ายทั่วไป';
    if (manualExpense.category === 'maintenance') catName = 'ซ่อมบำรุง / แอร์';
    if (manualExpense.category === 'fnb') catName = 'วัตถุดิบอาหาร & คาเฟ่';
    if (manualExpense.category === 'it_hardware') catName = 'อุปกรณ์ไอที / สายไฟ';

    addExpense({
      amount,
      desc: manualExpense.desc.trim(),
      category: manualExpense.category,
      categoryName: catName,
      recordedBy: manualExpense.recordedBy,
      rawCommand: `/pay ${amount} ${manualExpense.desc.trim()}`
    });

    setManualExpense({
      amount: '',
      category: 'fnb',
      desc: '',
      recordedBy: 'แอดมิน กอล์ฟ (LINE)'
    });
    showToast(`✅ บันทึกรายจ่าย ฿${amount.toLocaleString()} เรียบร้อยแล้ว!`);
  };

  // =========================================================================
  // TAB 4: HARDWARE & RMA CLAIM STATE
  // =========================================================================
  const stations = siteData.hardwareStations || [];
  const rmaClaims = siteData.rmaClaims || [];
  const [stationFilter, setStationFilter] = useState('all'); // 'all', 'gaming', 'available', 'maintenance'
  const [isRmaModalOpen, setIsRmaModalOpen] = useState(false);
  const [rmaFormData, setRmaFormData] = useState({
    stationId: 'PC-01',
    item: 'หน้าจอ BenQ ZOWIE XL2566K 360Hz',
    sn: '',
    distributor: 'Synnex Thailand',
    issue: '',
    estimatedReturn: ''
  });

  const handleSaveRMA = (e) => {
    e.preventDefault();
    if (!rmaFormData.sn.trim() || !rmaFormData.issue.trim()) {
      alert('กรุณาระบุ Serial Number และอาการเสีย');
      return;
    }
    addRMAClaim(rmaFormData);
    updateStationStatus(rmaFormData.stationId, 'maintenance');
    setIsRmaModalOpen(false);
    showToast(`เปิดเคสเคลมอุปกรณ์ ${rmaFormData.item} (${rmaFormData.sn}) เรียบร้อยแล้ว!`);
  };

  return (
    <div className="omnichannel-cms-container">
      {/* Toast Notification */}
      {quickToast && (
        <div className="omni-toast">
          <CheckCircle2 size={16} className="text-emerald" />
          <span>{quickToast}</span>
        </div>
      )}

      {/* Main Omnichannel Navigation Header */}
      <div className="omni-top-navbar">
        <div className="omni-nav-brand">
          <div className="brand-badge-circle">
            <MessagesSquare size={20} className="text-blue" />
          </div>
          <div>
            <h2 className="omni-brand-title">Omnichannel Hub & Operations Management</h2>
            <p className="omni-brand-sub">ศูนย์รวมแชท AI First, ติดตาม Leads แฟรนไชส์, งบดุลรายรับ-รายจ่ายสด และระบบตรวจเช็กเครื่อง</p>
          </div>
        </div>

        {/* Sub-tab Pills */}
        <div className="omni-subtabs-pill">
          <button 
            id="subtab-inbox"
            className={`omni-subtab-btn ${activeSubTab === 'inbox' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('inbox')}
          >
            <MessageCircle size={16} />
            <span>รวมศูนย์แชท & Takeover</span>
            <span className="omni-tab-badge">3</span>
          </button>

          <button 
            id="subtab-pipeline"
            className={`omni-subtab-btn ${activeSubTab === 'pipeline' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('pipeline')}
          >
            <Kanban size={16} />
            <span>กระดาน Leads แฟรนไชส์</span>
            <span className="omni-tab-badge">{leads.length}</span>
          </button>

          <button 
            id="subtab-cashflow"
            className={`omni-subtab-btn ${activeSubTab === 'cashflow' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('cashflow')}
          >
            <Receipt size={16} />
            <span>รายรับ-รายจ่ายสดย่อย (/pay)</span>
            <span className="omni-tab-badge text-emerald">฿{netDailyProfit.toLocaleString()}</span>
          </button>

          <button 
            id="subtab-hardware"
            className={`omni-subtab-btn ${activeSubTab === 'hardware' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('hardware')}
          >
            <HardDrive size={16} />
            <span>สถานะเครื่อง & เคลม RMA</span>
            <span className="omni-tab-badge">{stations.length}</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          VIEW 1: OMNICHANNEL INBOX & HUMAN TAKEOVER
          ========================================================================= */}
      {activeSubTab === 'inbox' && (
        <div className="omni-inbox-wrapper">
          {/* Top Channel Connectivity Ribbon */}
          <div className="channel-status-ribbon">
            <div className="channel-pill active">
              <span className="channel-dot green"></span>
              <strong>LINE OA:</strong> @gspeedarena
              <span className="channel-sub">Webhook Active (n8n)</span>
            </div>
            <div className="channel-pill active">
              <span className="channel-dot green"></span>
              <strong>Facebook:</strong> gspeedesport
              <span className="channel-sub">Messenger Active</span>
            </div>
            <div className="channel-pill active">
              <span className="channel-dot green"></span>
              <strong>Web Widget:</strong> glp-live-chat
              <span className="channel-sub">24/7 Socket Active</span>
            </div>
            <a 
              href="https://chatwoot.gspeedarena.com" 
              target="_blank" 
              rel="noreferrer"
              className="btn-chatwoot-external"
            >
              <ExternalLink size={14} />
              <span>เปิด Chatwoot Dashboard เต็มจอ</span>
            </a>
          </div>

          {/* Inbox Split Pane */}
          <div className="inbox-split-pane">
            {/* Left: Chat Conversation List */}
            <div className="inbox-chat-list">
              <div className="chat-list-header">
                <div className="search-box-mini">
                  <Search size={14} />
                  <input 
                    type="text" 
                    placeholder="ค้นหาชื่อลูกค้าหรือข้อความ..." 
                  />
                </div>
                <div className="filter-channel-tags">
                  <button 
                    className={`tag-btn ${channelFilter === 'all' ? 'active' : ''}`}
                    onClick={() => setChannelFilter('all')}
                  >ทั้งหมด</button>
                  <button 
                    className={`tag-btn ${channelFilter === 'line' ? 'active' : ''}`}
                    onClick={() => setChannelFilter('line')}
                  >LINE</button>
                  <button 
                    className={`tag-btn ${channelFilter === 'web' ? 'active' : ''}`}
                    onClick={() => setChannelFilter('web')}
                  >Web</button>
                  <button 
                    className={`tag-btn ${channelFilter === 'facebook' ? 'active' : ''}`}
                    onClick={() => setChannelFilter('facebook')}
                  >Facebook</button>
                </div>
              </div>

              <div className="chat-items-scroll">
                {chats
                  .filter(c => channelFilter === 'all' || c.channel === channelFilter)
                  .map(chat => {
                    const isSelected = chat.id === selectedChat?.id;
                    const isMuted = chat.status === 'assigned';
                    return (
                      <div 
                        key={chat.id}
                        className={`chat-list-item ${isSelected ? 'selected' : ''}`}
                        onClick={() => setSelectedChatId(chat.id)}
                      >
                        <div className="chat-avatar-wrapper">
                          <img src={chat.avatar} alt={chat.customerName} className="chat-avatar" />
                          <span className={`channel-badge-icon ${chat.channel}`}>
                            {chat.channel === 'line' ? 'LINE' : chat.channel === 'web' ? 'WEB' : 'FB'}
                          </span>
                        </div>
                        <div className="chat-info-block">
                          <div className="chat-info-top">
                            <h4 className="chat-customer-name">{chat.customerName}</h4>
                            <span className="chat-time">{chat.timestamp}</span>
                          </div>
                          <p className="chat-last-msg">{chat.lastMessage}</p>
                          <div className="chat-badges-row">
                            {isMuted ? (
                              <span className="status-pill status-assigned">
                                <UserCheck size={11} />
                                <span>{chat.assignedAgent?.split(' ')[0] || 'แอดมินรับแล้ว'} (AI Muted)</span>
                              </span>
                            ) : (
                              <span className="status-pill status-bot">
                                <Bot size={11} />
                                <span>AI First กำลังดูแล</span>
                              </span>
                            )}
                            <span className="dept-pill">{chat.department === 'franchise_sales' ? 'ฝ่ายขายแฟรนไชส์' : chat.department === 'tournament' ? 'จัดแข่ง' : 'บริการทั่วไป'}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Right: Active Conversation Thread */}
            {selectedChat ? (
              <div className="inbox-chat-thread">
                {/* Thread Header */}
                <div className="thread-header">
                  <div className="thread-user-info">
                    <img src={selectedChat.avatar} alt={selectedChat.customerName} className="thread-avatar" />
                    <div>
                      <div className="thread-title-row">
                        <h3>{selectedChat.customerName}</h3>
                        <span className={`channel-tag-pill ${selectedChat.channel}`}>
                          {selectedChat.channelName}
                        </span>
                      </div>
                      <p className="thread-sub-meta">
                        แผนก: <strong>{selectedChat.department === 'franchise_sales' ? 'ฝ่ายขายแฟรนไชส์' : selectedChat.department === 'tournament' ? 'จัดแข่งขันทัวร์นาเมนต์' : 'บริการลูกค้าและสอบถามข้อมูลร้าน'}</strong>
                      </p>
                    </div>
                  </div>

                  {/* Takeover Actions */}
                  <div className="thread-actions">
                    {selectedChat.status === 'assigned' ? (
                      <div className="assigned-control-group">
                        <div className="ai-muted-alert-pill">
                          <ShieldAlert size={14} className="text-amber" />
                          <span>AI ถูกระงับชั่วคราว (ผู้ดูแล: {selectedChat.assignedAgent})</span>
                        </div>
                        <button 
                          className="btn-revert-ai"
                          onClick={() => handleReturnToAI(selectedChat.id)}
                          title="คืนการควบคุมให้ AI ตอบอัตโนมัติ"
                        >
                          <Bot size={14} />
                          <span>คืนให้ AI ตอบ</span>
                        </button>
                      </div>
                    ) : (
                      <button 
                        id="btn-takeover-chat"
                        className="btn-takeover"
                        onClick={() => handleTakeover(selectedChat.id)}
                      >
                        <UserCheck size={16} />
                        <span>🙋‍♂️ แอดมินกดรับเคส (Takeover & Mute AI)</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Messages Stream */}
                <div className="thread-messages-body">
                  {selectedChat.messages.map(msg => {
                    if (msg.sender === 'system') {
                      return (
                        <div key={msg.id} className="chat-msg-system">
                          <span>{msg.text}</span>
                        </div>
                      );
                    }

                    const isCustomer = msg.sender === 'customer';
                    const isBot = msg.sender === 'bot';

                    return (
                      <div 
                        key={msg.id} 
                        className={`chat-msg-wrapper ${isCustomer ? 'incoming' : 'outgoing'} ${isBot ? 'bot-reply' : ''}`}
                      >
                        {!isCustomer && (
                          <div className="msg-sender-label">
                            {isBot ? (
                              <span className="bot-label"><Bot size={12} /> AI Esports Assistant</span>
                            ) : (
                              <span className="agent-label"><UserCheck size={12} /> {msg.agentName || 'แอดมิน กอล์ฟ'}</span>
                            )}
                          </div>
                        )}
                        <div className="chat-bubble">
                          <p>{msg.text}</p>
                          <span className="bubble-time">{msg.time}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Quick Canned Responses Bar */}
                <div className="quick-canned-bar">
                  <span className="canned-label">คำตอบด่วน:</span>
                  <button 
                    className="canned-btn"
                    onClick={() => handleQuickCanned('G-Speed Esport Arena เปิด 24 ชม. ทุกวันครับ พิกัด: 79 ซ.รามคำแหง 53 มีที่จอดรถสะดวกสบายครับ โทร: 063 793 7704')}
                  >
                    📍 พิกัด & เวลาเปิด 24 ชม.
                  </button>
                  <button 
                    className="canned-btn"
                    onClick={() => handleQuickCanned('เครื่องสเปกไฮเอนด์ทุกตัวครับ ขับเคลื่อนด้วย NVIDIA GeForce RTX 4070 SUPER / 4080 SUPER, จอ BenQ ZOWIE 360Hz และ 240Hz Fast-IPS')}
                  >
                    🎮 สเปกคอม & จอ 360Hz
                  </button>
                  <button 
                    className="canned-btn"
                    onClick={() => handleQuickCanned('แฟรนไชส์ G-Speed มี 3 โมเดลครับ: Size S (30-40 เครื่อง), Size M (50-70 เครื่อง), Size L (80-120 เครื่อง) คืนทุนเฉลี่ย 18-24 เดือน สนใจให้เจ้าหน้าที่โทรแนะนำไหมครับ?')}
                  >
                    📑 ข้อมูลแฟรนไชส์ Size S/M/L
                  </button>
                  <button 
                    className="canned-btn"
                    onClick={() => handleQuickCanned('เวที 5v5 พร้อมจอ LED Wall มีโต๊ะพากย์และระบบสตรีมมิ่งครบวงจร รองรับจัดแข่ง LAN Tournament ครับ')}
                  >
                    🏆 เช่าจัดแข่งเวที 5v5
                  </button>
                </div>

                {/* Message Input Box */}
                <form className="thread-input-bar" onSubmit={handleSendMessage}>
                  <div className="agent-select-wrapper">
                    <UserCheck size={14} className="text-blue" />
                    <select 
                      value={activeAgentName} 
                      onChange={e => setActiveAgentName(e.target.value)}
                      className="agent-picker-dropdown"
                    >
                      <option value="แอดมิน กอล์ฟ (ฝ่ายบริการลูกค้า)">แอดมิน กอล์ฟ (ฝ่ายบริการ)</option>
                      <option value="แอดมิน นัท (ฝ่ายขายแฟรนไชส์)">แอดมิน นัท (ฝ่ายขายแฟรนไชส์)</option>
                      <option value="ช่างเอก (วิศวกรระบบ Diskless)">ช่างเอก (วิศวกรระบบ)</option>
                      <option value="ผู้จัดการ บอย (Operation Manager)">ผู้จัดการ บอย (ผู้จัดการร้าน)</option>
                    </select>
                  </div>
                  <input 
                    type="text" 
                    placeholder={`พิมพ์ข้อความตอบกลับในนาม ${activeAgentName}...`}
                    value={messageInput}
                    onChange={e => setMessageInput(e.target.value)}
                    className="thread-text-input"
                  />
                  <button type="submit" className="btn-send-msg" disabled={!messageInput.trim()}>
                    <Send size={16} />
                    <span>ส่งข้อความ</span>
                  </button>
                </form>
              </div>
            ) : (
              <div className="inbox-no-selected">
                <MessageCircle size={40} className="text-muted" />
                <p>เลือกการสนทนาจากรายการทางด้านซ้ายเพื่อดูข้อความ</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 2: FRANCHISE & TOURNAMENT LEAD PIPELINE (KANBAN & LIST)
          ========================================================================= */}
      {activeSubTab === 'pipeline' && (
        <div className="omni-pipeline-wrapper">
          {/* Controls & Filter Bar */}
          <div className="pipeline-controls-bar">
            <div className="controls-left">
              <div className="search-box-medium">
                <Search size={16} />
                <input 
                  type="text" 
                  placeholder="ค้นหาชื่อลูกค้า, บริษัท, เบอร์โทร..."
                  value={leadSearchQuery}
                  onChange={e => setLeadSearchQuery(e.target.value)}
                />
              </div>

              <div className="filter-pill-group">
                <button 
                  className={`filter-btn ${leadFilterType === 'all' ? 'active' : ''}`}
                  onClick={() => setLeadFilterType('all')}
                >ทั้งหมด ({leads.length})</button>
                <button 
                  className={`filter-btn ${leadFilterType === 'franchise' ? 'active' : ''}`}
                  onClick={() => setLeadFilterType('franchise')}
                >แฟรนไชส์เปิดร้าน</button>
                <button 
                  className={`filter-btn ${leadFilterType === 'tournament' ? 'active' : ''}`}
                  onClick={() => setLeadFilterType('tournament')}
                >เช่าจัดแข่ง</button>
                <button 
                  className={`filter-btn ${leadFilterType === 'diskless' ? 'active' : ''}`}
                  onClick={() => setLeadFilterType('diskless')}
                >ติดตั้ง Diskless</button>
              </div>
            </div>

            <div className="controls-right">
              <div className="view-toggle-btns">
                <button 
                  className={`view-btn ${viewMode === 'kanban' ? 'active' : ''}`}
                  onClick={() => setViewMode('kanban')}
                >
                  <Kanban size={15} />
                  <span>Kanban</span>
                </button>
                <button 
                  className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
                  onClick={() => setViewMode('table')}
                >
                  <span>ตาราง List</span>
                </button>
              </div>

              <button 
                id="btn-add-lead-dialog"
                className="btn-add-lead-primary"
                onClick={openNewLeadModal}
              >
                <Plus size={16} />
                <span>+ เพิ่ม Lead ใหม่</span>
              </button>
            </div>
          </div>

          {/* Kanban Board View */}
          {viewMode === 'kanban' ? (
            <div className="kanban-board-grid">
              {stages.map(stage => {
                const stageLeads = filteredLeads.filter(l => l.stage === stage.id);
                const stageTotalBudget = stageLeads.reduce((sum, l) => sum + (Number(l.budget) || 0), 0);

                return (
                  <div key={stage.id} className="kanban-column glass-panel">
                    <div className="column-header" style={{ borderTop: `3px solid ${stage.color}` }}>
                      <div className="column-title-group">
                        <h4 className="column-title">{stage.label}</h4>
                        <span className="stage-count-badge" style={{ background: stage.badgeBg, color: stage.color }}>
                          {stageLeads.length}
                        </span>
                      </div>
                      <div className="column-budget-sum">
                        งบรวม: ฿{stageTotalBudget.toLocaleString()}
                      </div>
                    </div>

                    <div className="column-cards-container">
                      {stageLeads.map(lead => (
                        <div key={lead.id} className="kanban-lead-card">
                          <div className="lead-card-header">
                            <span className="lead-type-tag">{lead.typeName}</span>
                            <div className="lead-actions-tiny">
                              <button 
                                onClick={() => openEditLeadModal(lead)} 
                                className="btn-tiny-icon"
                                title="แก้ไขข้อมูล"
                              >
                                <Edit3 size={13} />
                              </button>
                              <button 
                                onClick={() => {
                                  if (confirm(`ยืนยันการลบ Lead: ${lead.name}?`)) {
                                    deleteLead(lead.id);
                                    showToast('ลบข้อมูลเรียบร้อย');
                                  }
                                }} 
                                className="btn-tiny-icon text-red"
                                title="ลบ Lead"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>

                          <h4 className="lead-card-name">{lead.name}</h4>
                          {lead.company && <p className="lead-card-company">{lead.company}</p>}

                          <div className="lead-card-budget">
                            <DollarSign size={14} className="text-emerald" />
                            <strong>งบประมาณ: ฿{Number(lead.budget).toLocaleString()}</strong>
                          </div>

                          <div className="lead-contact-details">
                            <div className="contact-line">
                              <Phone size={12} className="text-blue" />
                              <a href={`tel:${lead.phone}`}>{lead.phone}</a>
                            </div>
                            {lead.location && (
                              <div className="contact-line">
                                <MapPin size={12} className="text-muted" />
                                <span>{lead.location}</span>
                              </div>
                            )}
                          </div>

                          {lead.notes && (
                            <div className="lead-card-notes">
                              <p>"{lead.notes}"</p>
                            </div>
                          )}

                          <div className="lead-card-footer">
                            <div className="assigned-staff-badge">
                              <UserCheck size={12} />
                              <span>{lead.assignedStaff?.split(' ')[0] || 'ยังไม่มอบหมาย'}</span>
                            </div>

                            {/* Stage Shifter Dropdown */}
                            <div className="stage-shifter">
                              <select 
                                value={lead.stage}
                                onChange={(e) => {
                                  moveLeadStage(lead.id, e.target.value);
                                  showToast(`ย้ายสถานะเป็น: ${stages.find(s => s.id === e.target.value)?.label}`);
                                }}
                                className="stage-select-compact"
                              >
                                <option value="new">1. ใหม่</option>
                                <option value="contacted">2. ติดต่อแล้ว</option>
                                <option value="proposal">3. ส่งแปลน 3D</option>
                                <option value="won">4. ชนะดีล (Won)</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      ))}

                      {stageLeads.length === 0 && (
                        <div className="kanban-empty-slot">
                          <span>ไม่มี Lead ในขั้นตอนนี้</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Table List View */
            <div className="leads-table-container glass-panel">
              <table className="leads-datatable">
                <thead>
                  <tr>
                    <th>ชื่อผู้ติดต่อ & โครงการ</th>
                    <th>ประเภทความสนใจ</th>
                    <th>งบประมาณ</th>
                    <th>ขั้นตอน (Stage)</th>
                    <th>ผู้รับผิดชอบ</th>
                    <th>วันที่สร้าง</th>
                    <th>จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map(lead => (
                    <tr key={lead.id}>
                      <td>
                        <strong>{lead.name}</strong>
                        <div className="table-subtext">{lead.company} • {lead.phone}</div>
                      </td>
                      <td>
                        <span className="lead-type-tag">{lead.typeName}</span>
                      </td>
                      <td>
                        <strong className="text-emerald">฿{Number(lead.budget).toLocaleString()}</strong>
                      </td>
                      <td>
                        <select 
                          value={lead.stage}
                          onChange={(e) => moveLeadStage(lead.id, e.target.value)}
                          className="stage-select-compact"
                        >
                          <option value="new">1. Lead ใหม่</option>
                          <option value="contacted">2. ติดต่อแล้ว</option>
                          <option value="proposal">3. ส่งแปลน 3D</option>
                          <option value="won">4. ชนะดีล (Won)</option>
                        </select>
                      </td>
                      <td>{lead.assignedStaff}</td>
                      <td>{lead.createdAt}</td>
                      <td>
                        <div className="table-row-actions">
                          <button onClick={() => openEditLeadModal(lead)} className="btn-tiny-icon">
                            <Edit3 size={14} />
                          </button>
                          <button onClick={() => deleteLead(lead.id)} className="btn-tiny-icon text-red">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          VIEW 3: DAILY CASHFLOW & PETTY CASH MANAGER (/pay)
          ========================================================================= */}
      {activeSubTab === 'cashflow' && (
        <div className="omni-cashflow-wrapper">
          {/* Top 4 Financial KPI Cards */}
          <div className="cashflow-kpi-grid">
            <div className="cashflow-kpi-card glass-panel">
              <span className="kpi-tag-label">รายรับสด POS วันนี้ (Gross)</span>
              <div className="kpi-amount text-blue">฿{grossRevenue.toLocaleString()}</div>
              <div className="kpi-breakdown-sub">
                <span>ชั่วโมง: ฿{gamingRev.toLocaleString()}</span>
                <span>•</span>
                <span>F&B: ฿{fnbRev.toLocaleString()}</span>
              </div>
            </div>

            <div className="cashflow-kpi-card glass-panel">
              <span className="kpi-tag-label">รายจ่ายสดย่อยประจำวัน (Petty Cash)</span>
              <div className="kpi-amount text-amber">฿{pettyCashTotal.toLocaleString()}</div>
              <div className="kpi-breakdown-sub">
                <span>บันทึกผ่านคำสั่ง /pay แล้ว {pettyCash.length} รายการ</span>
              </div>
            </div>

            <div className="cashflow-kpi-card glass-panel">
              <span className="kpi-tag-label">ต้นทุนคงที่เฉลี่ย/วัน (Fixed Cost)</span>
              <div className="kpi-amount text-muted">฿{fixedDailyCosts.toLocaleString()}</div>
              <div className="kpi-breakdown-sub">
                <span>ค่าไฟ ฿7,200 • เน็ต ฿1,200 • เงินเดือน ฿6,000</span>
              </div>
            </div>

            <div className="cashflow-kpi-card glass-panel highlight-profit">
              <span className="kpi-tag-label">กำไรสุทธิสดประจำวัน (Net Profit)</span>
              <div className="kpi-amount text-emerald">฿{netDailyProfit.toLocaleString()}</div>
              <div className="kpi-breakdown-sub">
                <span className="margin-pill">Profit Margin: {profitMarginPercent}%</span>
              </div>
            </div>
          </div>

          {/* Quick Pay Terminal Banner & Line Push Action */}
          <div className="cashflow-terminal-section glass-panel">
            <div className="terminal-header-bar">
              <div className="terminal-title">
                <Terminal size={18} className="text-blue" />
                <strong>ช่องบันทึกรายจ่ายด่วนประจำวัน (Quick Expense Terminal)</strong>
                <span className="terminal-hint">รองรับคำสั่ง /pay เช่นเดียวกับ LINE กลุ่มพนักงาน</span>
              </div>
              <button 
                id="btn-push-line-summary"
                className="btn-push-line-summary"
                onClick={() => setIsLineSummaryModalOpen(true)}
              >
                <Send size={15} />
                <span>ส่งสรุปงบดุลประจำวันเข้า LINE ผู้บริหาร (Push Summary)</span>
              </button>
            </div>

            {/* Terminal Input Box */}
            <form onSubmit={handleExecuteQuickPay} className="terminal-form">
              <div className="terminal-input-wrapper">
                <span className="terminal-prompt">&gt;</span>
                <input 
                  type="text" 
                  id="terminal-input-pay"
                  placeholder="พิมพ์คำสั่ง เช่น: /pay 450 ค่าล้างแอร์ โซน VIP หรือ /pay 1200 สั่งไก่ป๊อปเข้าร้าน"
                  value={quickPayCommand}
                  onChange={e => setQuickPayCommand(e.target.value)}
                  className="terminal-text-input"
                />
                <button type="submit" id="btn-submit-quick-pay" className="btn-terminal-run">
                  <span>บันทึกด่วน [Enter]</span>
                </button>
              </div>
            </form>

            {/* Quick Sample Command Pills */}
            <div className="quick-command-suggestions">
              <span className="sugg-label">ตัวอย่างคลิกสั่งทันที:</span>
              <button 
                type="button" 
                className="sugg-chip"
                onClick={() => setQuickPayCommand('/pay 450 ค่าล้างแอร์ โซน VIP Suite')}
              >
                /pay 450 ค่าล้างแอร์
              </button>
              <button 
                type="button" 
                className="sugg-chip"
                onClick={() => setQuickPayCommand('/pay 350 ค่าน้ำแข็งหลอดยูนิต 3 กระสอบ')}
              >
                /pay 350 ค่าน้ำแข็งหลอด
              </button>
              <button 
                type="button" 
                className="sugg-chip"
                onClick={() => setQuickPayCommand('/pay 1200 สั่งไก่ป๊อปและเฟรนช์ฟรายส์เข้าร้าน')}
              >
                /pay 1200 สั่งไก่ป๊อป F&B
              </button>
              <button 
                type="button" 
                className="sugg-chip"
                onClick={() => setQuickPayCommand('/pay 680 ซื้อหัวแลน RJ45 CAT6A สำรอง')}
              >
                /pay 680 ซื้อหัวแลน RJ45
              </button>
            </div>
          </div>

          {/* Expenses History Table */}
          <div className="expenses-history-card glass-panel">
            <div className="card-header-row">
              <h3 className="section-title">
                <Receipt size={18} className="text-blue" />
                <span>ประวัติการเบิกจ่ายสดย่อยวันนี้ ({pettyCash.length} รายการ)</span>
              </h3>
              <span className="total-badge-amount">ยอดเบิกรวม: ฿{pettyCashTotal.toLocaleString()}</span>
            </div>

            <table className="expenses-table">
              <thead>
                <tr>
                  <th>เวลา</th>
                  <th>รายละเอียดรายการ</th>
                  <th>หมวดหมู่</th>
                  <th>ผู้บันทึก</th>
                  <th>จำนวนเงิน (บาท)</th>
                  <th>ลบ</th>
                </tr>
              </thead>
              <tbody>
                {pettyCash.map(item => (
                  <tr key={item.id}>
                    <td className="expense-time">{item.time || '12:00'} น.</td>
                    <td className="expense-desc">
                      <strong>{item.desc}</strong>
                      {item.rawCommand && <code className="cmd-tag">{item.rawCommand}</code>}
                    </td>
                    <td>
                      <span className={`cat-pill ${item.category}`}>
                        {item.categoryName || item.category}
                      </span>
                    </td>
                    <td>{item.recordedBy}</td>
                    <td className="expense-amount text-amber">
                      -฿{Number(item.amount).toLocaleString()}
                    </td>
                    <td>
                      <button 
                        onClick={() => {
                          if (confirm(`ลบรายการ ${item.desc}?`)) {
                            deleteExpense(item.id);
                            showToast('ลบรายการเบิกจ่ายเรียบร้อย');
                          }
                        }}
                        className="btn-tiny-icon text-red"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 4: HARDWARE ASSET & RMA CLAIM TRACKER
          ========================================================================= */}
      {activeSubTab === 'hardware' && (
        <div className="omni-hardware-wrapper">
          {/* Station Status Summary Ribbon */}
          <div className="hardware-summary-ribbon glass-panel">
            <div className="stat-box">
              <span className="stat-label">เครื่องทั้งหมด</span>
              <strong className="stat-num">{stations.length}</strong>
            </div>
            <div className="stat-box">
              <span className="stat-label text-emerald">กำลังเล่นเกม (In-Game)</span>
              <strong className="stat-num text-emerald">
                {stations.filter(s => s.status === 'gaming').length}
              </strong>
            </div>
            <div className="stat-box">
              <span className="stat-label text-blue">ว่างพร้อมใช้ (Available)</span>
              <strong className="stat-num text-blue">
                {stations.filter(s => s.status === 'available').length}
              </strong>
            </div>
            <div className="stat-box">
              <span className="stat-label text-purple">สแตนด์บายเวที (Stage)</span>
              <strong className="stat-num text-purple">
                {stations.filter(s => s.status === 'standby').length}
              </strong>
            </div>
            <div className="stat-box">
              <span className="stat-label text-amber">ซ่อมบำรุง / เคลม (RMA)</span>
              <strong className="stat-num text-amber">
                {stations.filter(s => s.status === 'maintenance').length}
              </strong>
            </div>
            <button 
              id="btn-open-rma-dialog"
              className="btn-open-rma"
              onClick={() => setIsRmaModalOpen(true)}
            >
              <Wrench size={15} />
              <span>+ เปิดเคสส่งเคลมใหม่ (New RMA)</span>
            </button>
          </div>

          {/* Station Grid */}
          <div className="station-grid-container glass-panel">
            <div className="station-grid-header">
              <h3>สถานะเครื่องสดประจำร้าน (Live Station Matrix)</h3>
              <div className="filter-station-buttons">
                <button 
                  className={`filter-btn ${stationFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setStationFilter('all')}
                >ทั้งหมด</button>
                <button 
                  className={`filter-btn ${stationFilter === 'gaming' ? 'active' : ''}`}
                  onClick={() => setStationFilter('gaming')}
                >เล่นเกมอยู่</button>
                <button 
                  className={`filter-btn ${stationFilter === 'available' ? 'active' : ''}`}
                  onClick={() => setStationFilter('available')}
                >ว่าง</button>
                <button 
                  className={`filter-btn ${stationFilter === 'maintenance' ? 'active' : ''}`}
                  onClick={() => setStationFilter('maintenance')}
                >ส่งซ่อม/เคลม</button>
              </div>
            </div>

            <div className="stations-matrix">
              {stations
                .filter(s => stationFilter === 'all' || s.status === stationFilter)
                .map(station => (
                  <div key={station.id} className={`station-matrix-card ${station.status}`}>
                    <div className="st-header">
                      <strong className="st-id">{station.id}</strong>
                      <span className={`st-status-dot ${station.status}`}></span>
                    </div>
                    <p className="st-zone">{station.zone}</p>
                    <div className="st-specs">
                      <span>{station.gpu}</span>
                      <span>{station.monitor}</span>
                    </div>
                    <div className="st-footer">
                      <span className="st-user">{station.user}</span>
                      <select 
                        value={station.status}
                        onChange={(e) => updateStationStatus(station.id, e.target.value)}
                        className="st-quick-status"
                      >
                        <option value="gaming">Gaming</option>
                        <option value="available">ว่าง</option>
                        <option value="standby">Standby</option>
                        <option value="maintenance">ซ่อมบำรุง</option>
                      </select>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* RMA Claims Table */}
          <div className="rma-claims-card glass-panel">
            <div className="card-header-row">
              <h3 className="section-title">
                <Shield size={18} className="text-blue" />
                <span>ประวัติและสถานะการส่งเคลมประกัน (RMA & Warranty Tracker)</span>
              </h3>
              <span className="rma-count-badge">รายการเคลม {rmaClaims.length} ชิ้น</span>
            </div>

            <table className="rma-table">
              <thead>
                <tr>
                  <th>Station ID</th>
                  <th>รายการอุปกรณ์</th>
                  <th>Serial Number (S/N)</th>
                  <th>บริษัทประกัน / ตัวแทน</th>
                  <th>อาการเสีย</th>
                  <th>วันที่ส่งเคลม</th>
                  <th>สถานะเคส</th>
                  <th>เลขพัสดุ / Tracking</th>
                </tr>
              </thead>
              <tbody>
                {rmaClaims.map(claim => (
                  <tr key={claim.id}>
                    <td><strong>{claim.stationId}</strong></td>
                    <td>{claim.item}</td>
                    <td><code className="sn-tag">{claim.sn}</code></td>
                    <td>{claim.distributor}</td>
                    <td>{claim.issue}</td>
                    <td>{claim.sentDate}</td>
                    <td>
                      <select 
                        value={claim.status}
                        onChange={(e) => {
                          const val = e.target.value;
                          let name = 'ส่งศูนย์บริการแล้ว รอการตรวจสอบ';
                          if (val === 'repairing') name = 'กำลังอยู่ระหว่างซ่อม/เปลี่ยนชิ้นส่วน';
                          if (val === 'returned') name = 'ซ่อมเสร็จ ส่งของกลับถึงร้านแล้ว';
                          updateRMAClaim(claim.id, { status: val, statusName: name });
                          showToast('อัปเดตสถานะเคลมเรียบร้อย');
                        }}
                        className={`rma-status-select ${claim.status}`}
                      >
                        <option value="sent">1. ส่งศูนย์แล้ว</option>
                        <option value="repairing">2. กำลังซ่อม</option>
                        <option value="returned">3. รับของคืนแล้ว</option>
                      </select>
                    </td>
                    <td><code>{claim.trackingNo || '-'}</code></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 1: ADD / EDIT LEAD MODAL
          ========================================================================= */}
      {isLeadModalOpen && (
        <div className="omni-modal-backdrop" onClick={() => setIsLeadModalOpen(false)}>
          <div className="omni-modal-dialog glass-panel" onClick={e => e.stopPropagation()}>
            <div className="omni-modal-header">
              <h3>{editingLeadId ? 'แก้ไขข้อมูล Lead' : '+ เพิ่ม Lead แฟรนไชส์ / ลูกค้าจัดแข่งใหม่'}</h3>
              <button className="btn-close-modal" onClick={() => setIsLeadModalOpen(false)}>×</button>
            </div>

            <form onSubmit={handleSaveLead} className="lead-modal-form">
              <div className="form-row-2">
                <div className="form-group">
                  <label>ชื่อผู้ติดต่อ *</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="เช่น คุณอนุรักษ์ รัตนวิเชียร"
                    value={leadFormData.name}
                    onChange={e => setLeadFormData({ ...leadFormData, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>ชื่อบริษัท / อาคาร / องค์กร</label>
                  <input 
                    type="text" 
                    placeholder="เช่น Chiang Mai Esports Hub Co., Ltd."
                    value={leadFormData.company}
                    onChange={e => setLeadFormData({ ...leadFormData, company: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>เบอร์โทรศัพท์ติดต่อ *</label>
                  <input 
                    type="tel" 
                    required
                    placeholder="081-456-7890"
                    value={leadFormData.phone}
                    onChange={e => setLeadFormData({ ...leadFormData, phone: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>อีเมล</label>
                  <input 
                    type="email" 
                    placeholder="client@example.com"
                    value={leadFormData.email}
                    onChange={e => setLeadFormData({ ...leadFormData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>ประเภทความสนใจ</label>
                  <select 
                    value={leadFormData.type}
                    onChange={e => {
                      const val = e.target.value;
                      let name = 'แฟรนไชส์ Size M (60 เครื่อง)';
                      let defBudget = 3800000;
                      if (val === 'franchise_s') { name = 'แฟรนไชส์ Size S (35 เครื่อง)'; defBudget = 2200000; }
                      if (val === 'franchise_l') { name = 'แฟรนไชส์ Size L Mega Arena (100 เครื่อง)'; defBudget = 6800000; }
                      if (val === 'tournament_venue') { name = 'เช่าสถานที่จัดแข่ง (Main Stage)'; defBudget = 85000; }
                      if (val === 'diskless_setup') { name = 'วางระบบ Diskless & Multi-WAN'; defBudget = 450000; }
                      setLeadFormData({ ...leadFormData, type: val, typeName: name, budget: defBudget });
                    }}
                  >
                    <option value="franchise_s">แฟรนไชส์ Size S (30-40 เครื่อง)</option>
                    <option value="franchise_m">แฟรนไชส์ Size M (50-70 เครื่อง)</option>
                    <option value="franchise_l">แฟรนไชส์ Size L Mega Arena (80-120 เครื่อง)</option>
                    <option value="tournament_venue">เช่าสถานที่จัดแข่งอีสปอร์ต (Main Stage)</option>
                    <option value="diskless_setup">ติดตั้งระบบ Diskless Server & 10G Multi-WAN</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>งบประมาณประเมิน (บาท)</label>
                  <input 
                    type="number" 
                    value={leadFormData.budget}
                    onChange={e => setLeadFormData({ ...leadFormData, budget: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>สถานที่ / ทำเลที่ตั้ง</label>
                  <input 
                    type="text" 
                    placeholder="เช่น ถ.นิมมานเหมินท์ อ.เมือง เชียงใหม่"
                    value={leadFormData.location}
                    onChange={e => setLeadFormData({ ...leadFormData, location: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>ผู้รับผิดชอบดูแลเคส</label>
                  <select 
                    value={leadFormData.assignedStaff}
                    onChange={e => setLeadFormData({ ...leadFormData, assignedStaff: e.target.value })}
                  >
                    <option value="คุณนัท (ฝ่ายขายแฟรนไชส์)">คุณนัท (ฝ่ายขายแฟรนไชส์)</option>
                    <option value="คุณกอล์ฟ (ฝ่ายกิจกรรม & ทัวร์นาเมนต์)">คุณกอล์ฟ (ฝ่ายจัดแข่ง)</option>
                    <option value="ช่างเอก (วิศวกรระบบเน็ตเวิร์ก)">ช่างเอก (วิศวกรระบบ)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>บันทึกความคืบหน้า / รายละเอียดความต้องการ</label>
                <textarea 
                  rows={3}
                  placeholder="เช่น ลูกค้ามีตึกพาณิชย์ 3 ชั้น สนใจระบบไฟ 3 เฟส นัดส่งแปลน 3D วันศุกร์นี้"
                  value={leadFormData.notes}
                  onChange={e => setLeadFormData({ ...leadFormData, notes: e.target.value })}
                ></textarea>
              </div>

              <div className="omni-modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setIsLeadModalOpen(false)}>
                  ยกเลิก
                </button>
                <button type="submit" className="btn-submit-lead">
                  <Check size={16} />
                  <span>{editingLeadId ? 'บันทึกการแก้ไข' : 'สร้าง Lead และแจ้งเตือน LINE'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: PUSH TO LINE EXECUTIVE SUMMARY MODAL
          ========================================================================= */}
      {isLineSummaryModalOpen && (
        <div className="omni-modal-backdrop" onClick={() => setIsLineSummaryModalOpen(false)}>
          <div className="omni-modal-dialog line-preview-dialog glass-panel" onClick={e => e.stopPropagation()}>
            <div className="omni-modal-header">
              <div className="line-header-title">
                <Send size={18} className="text-emerald" />
                <h3>พรีวิวรายงานงบดุลประจำวัน (LINE Flex Message ผู้บริหาร)</h3>
              </div>
              <button className="btn-close-modal" onClick={() => setIsLineSummaryModalOpen(false)}>×</button>
            </div>

            {/* Simulated LINE Bubble */}
            <div className="line-mock-container">
              <div className="line-flex-card">
                <div className="flex-card-top">
                  <div className="flex-brand-tag">G-SPEED ESPORTS ARENA</div>
                  <h4>📊 รายงานผลประกอบการประจำวัน</h4>
                  <span className="flex-date">วันพุธที่ 16 กันยายน 2026 • เวลา 23:59 น.</span>
                </div>

                <div className="flex-body-metrics">
                  <div className="flex-metric-row">
                    <span>💵 ยอดขายรวม (Gross Revenue)</span>
                    <strong>฿{grossRevenue.toLocaleString()}</strong>
                  </div>
                  <div className="flex-sub-row">
                    <span>• ค่าชั่วโมงเกมมิ่ง (Stations)</span>
                    <span>฿{gamingRev.toLocaleString()}</span>
                  </div>
                  <div className="flex-sub-row">
                    <span>• แผนกอาหาร & คาเฟ่ (F&B)</span>
                    <span>฿{fnbRev.toLocaleString()}</span>
                  </div>

                  <hr className="flex-divider" />

                  <div className="flex-metric-row text-red">
                    <span>🔻 หัก: รายจ่ายสดย่อย (Petty Cash)</span>
                    <strong>-฿{pettyCashTotal.toLocaleString()}</strong>
                  </div>
                  <div className="flex-metric-row text-muted">
                    <span>🏢 หัก: ต้นทุนคงที่เฉลี่ย (Fixed Costs)</span>
                    <strong>-฿{fixedDailyCosts.toLocaleString()}</strong>
                  </div>

                  <hr className="flex-divider" />

                  <div className="flex-net-profit-box">
                    <span className="net-label">🏆 กำไรสุทธิประจำวัน (Net Profit)</span>
                    <strong className="net-val text-emerald">฿{netDailyProfit.toLocaleString()}</strong>
                    <span className="net-margin">Margin: {profitMarginPercent}% (เหนือเป้าหมาย 14.2%)</span>
                  </div>

                  <div className="flex-notes-box">
                    <strong>📌 บันทึกสำคัญประจำวัน:</strong>
                    <p>เครื่องเต็ม 100% ช่วง 18:00 - 23:00 น. มี Lead สนใจแฟรนไชส์ใหม่ 2 ราย (เชียงใหม่ & ลาดพร้าว) ติดตามผลเรียบร้อย</p>
                  </div>
                </div>

                <div className="flex-footer-info">
                  <span>ส่งอัตโนมัติผ่าน n8n Daily Cron Engine • SmartCafé ERP Bridge</span>
                </div>
              </div>
            </div>

            <div className="omni-modal-actions">
              <button type="button" className="btn-cancel" onClick={() => setIsLineSummaryModalOpen(false)}>
                ปิดหน้าต่าง
              </button>
              <button 
                type="button" 
                id="btn-confirm-line-send"
                className="btn-line-send-confirm"
                onClick={() => {
                  showToast('🚀 ส่งรายงานงบดุลประจำวันเข้า LINE กลุ่มผู้บริหารเรียบร้อยแล้ว!');
                  setIsLineSummaryModalOpen(false);
                }}
              >
                <Send size={16} />
                <span>ยืนยันส่งข้อความเข้า LINE ผู้บริหารทันที</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: ADD NEW RMA CLAIM MODAL
          ========================================================================= */}
      {isRmaModalOpen && (
        <div className="omni-modal-backdrop" onClick={() => setIsRmaModalOpen(false)}>
          <div className="omni-modal-dialog glass-panel" onClick={e => e.stopPropagation()}>
            <div className="omni-modal-header">
              <h3>+ เปิดเคสส่งเคลมประกันอุปกรณ์ใหม่ (New RMA)</h3>
              <button className="btn-close-modal" onClick={() => setIsRmaModalOpen(false)}>×</button>
            </div>

            <form onSubmit={handleSaveRMA} className="lead-modal-form">
              <div className="form-row-2">
                <div className="form-group">
                  <label>รหัสเครื่อง (Station ID) *</label>
                  <select 
                    value={rmaFormData.stationId}
                    onChange={e => setRmaFormData({ ...rmaFormData, stationId: e.target.value })}
                  >
                    {stations.map(st => (
                      <option key={st.id} value={st.id}>{st.id} ({st.zone})</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>ชื่อชิ้นส่วน / อุปกรณ์ *</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="เช่น จอ BenQ ZOWIE XL2566K 360Hz"
                    value={rmaFormData.item}
                    onChange={e => setRmaFormData({ ...rmaFormData, item: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Serial Number (S/N) *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="เช่น SN4080SP8812 หรือ ETL890281923"
                    value={rmaFormData.sn}
                    onChange={e => setRmaFormData({ ...rmaFormData, sn: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>บริษัทประกัน / ผู้แทนจำหน่าย</label>
                  <select 
                    value={rmaFormData.distributor}
                    onChange={e => setRmaFormData({ ...rmaFormData, distributor: e.target.value })}
                  >
                    <option value="Synnex Thailand">Synnex Thailand (SYNNEX)</option>
                    <option value="Ascenti Resources (ARC)">Ascenti Resources (ARC)</option>
                    <option value="Ingram Micro (Thailand)">Ingram Micro (Thailand)</option>
                    <option value="JIB Computer Group">JIB Commercial Services</option>
                    <option value="Advice IT Infinite">Advice IT Infinite</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>อาการเสียโดยละเอียด *</label>
                <textarea 
                  rows={3} 
                  required
                  placeholder="เช่น พัดลมตัวที่ 2 หมุนมีเสียงดัง หรือหน้าจอมีเส้นสีฟ้าพาดกลางจอ 1 เส้น"
                  value={rmaFormData.issue}
                  onChange={e => setRmaFormData({ ...rmaFormData, issue: e.target.value })}
                ></textarea>
              </div>

              <div className="omni-modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setIsRmaModalOpen(false)}>
                  ยกเลิก
                </button>
                <button type="submit" className="btn-submit-lead">
                  <Check size={16} />
                  <span>เปิดเคสส่งเคลมและปรับสถานะเครื่องเป็นซ่อมบำรุง</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
