import React, { useState, useEffect } from 'react';
import { 
  X, Printer, Download, CreditCard, Check, 
  Building2, User, Phone, Mail, MapPin, 
  FileText, ShieldCheck, Calendar, ArrowRight,
  AlertCircle, Edit3, CheckCircle2
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { thaiBahtText } from '../../data/equipmentProducts';

export default function QuotationModal() {
  const { 
    cartItems, 
    isQuotationModalOpen, 
    setIsQuotationModalOpen, 
    activeQuotationData, 
    setActiveQuotationData, 
    createQuotation,
    setIsCheckoutModalOpen,
    setCheckoutInitialData
  } = useCart();

  // Mode: 'form' (if creating new) or 'preview' (displaying quotation document)
  const [viewMode, setViewMode] = useState('preview');

  // Customer Form State
  const [clientType, setClientType] = useState('corporate'); // 'corporate' | 'individual'
  const [companyName, setCompanyName] = useState('');
  const [taxId, setTaxId] = useState('');
  const [branch, setBranch] = useState('สำนักงานใหญ่ (Head Office)');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('ชำระเต็มจำนวนก่อนส่งมอบสินค้า (Full Payment)');
  const [notes, setNotes] = useState('');

  // When modal opens, initialize with current active quotation or generate one from cart
  useEffect(() => {
    if (isQuotationModalOpen) {
      if (activeQuotationData) {
        setViewMode('preview');
        // prefill form with existing client info
        if (activeQuotationData.clientInfo) {
          const c = activeQuotationData.clientInfo;
          setClientType(c.clientType || 'corporate');
          setCompanyName(c.companyName || '');
          setTaxId(c.taxId || '');
          setBranch(c.branch || 'สำนักงานใหญ่');
          setContactName(c.contactName || '');
          setPhone(c.phone || '');
          setEmail(c.email || '');
          setAddress(c.address || '');
          setPaymentTerms(c.paymentTerms || '');
          setNotes(c.notes || '');
        }
      } else if (cartItems.length > 0) {
        // Create initial default quotation
        const defaultClient = {
          clientType: 'corporate',
          companyName: 'บริษัท / องค์กร ผู้สั่งซื้อ (Sample Corporate Ltd.)',
          taxId: '0105567000123',
          branch: 'สำนักงานใหญ่',
          contactName: 'คุณสมชาย จัดซื้อ (Purchasing Manager)',
          phone: '081-234-5678',
          email: 'purchasing@example.com',
          address: '123 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพมหานคร 10110',
          paymentTerms: 'ชำระเต็มจำนวนก่อนส่งมอบสินค้า',
          notes: 'ขอใบเสนอราคาพร้อมใบกำกับภาษีเต็มรูปแบบ จัดส่งพร้อมประกอบติดตั้ง'
        };
        const newQ = createQuotation(defaultClient, cartItems);
        setActiveQuotationData(newQ);
        setViewMode('preview');
      } else {
        setViewMode('form');
      }
    }
  }, [isQuotationModalOpen]);

  if (!isQuotationModalOpen) return null;

  const quote = activeQuotationData;

  const handleSaveAndGenerate = (e) => {
    e.preventDefault();
    const clientPayload = {
      clientType,
      companyName: companyName || (clientType === 'corporate' ? 'บริษัท ผู้สั่งซื้อ (ยังไม่ระบุชื่อ)' : 'ลูกค้าบุคคลทั่วไป'),
      taxId: taxId || '-',
      branch,
      contactName,
      phone,
      email,
      address,
      paymentTerms,
      notes
    };

    const newQ = createQuotation(clientPayload, cartItems.length > 0 ? cartItems : null);
    setActiveQuotationData(newQ);
    setViewMode('preview');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleProceedToPayment = () => {
    setIsQuotationModalOpen(false);
    setCheckoutInitialData({
      fromQuotationNo: quote?.quoteNo,
      items: quote?.items,
      subtotal: quote?.subtotal,
      discount: quote?.discount,
      vat: quote?.vat,
      grandTotal: quote?.grandTotal,
      clientInfo: quote?.clientInfo
    });
    window.history.pushState(null, '', '/checkout');
    window.dispatchEvent(new PopStateEvent('popstate'));
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  const formattedDate = quote 
    ? new Date(quote.createdAt).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })
    : '';

  const formattedValidDate = quote 
    ? new Date(quote.validUntil).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })
    : '';

  return (
    <div className="quotation-modal-backdrop" onClick={() => setIsQuotationModalOpen(false)}>
      <div 
        className="quotation-modal-window"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar (Hidden in Print) */}
        <div className="quotation-top-controls no-print">
          <div className="controls-left">
            <span className="doc-type-badge">
              <FileText size={15} />
              <span>เอกสารใบเสนอราคา (Official Quotation)</span>
            </span>
            {quote && (
              <span className="doc-num-tag">{quote.quoteNo}</span>
            )}
          </div>

          <div className="controls-right">
            {viewMode === 'preview' && (
              <>
                <button 
                  className="ctrl-btn-edit"
                  onClick={() => setViewMode('form')}
                  title="แก้ไขข้อมูลลูกค้าหรือที่อยู่ออกบิล"
                >
                  <Edit3 size={15} />
                  <span>แก้ไขข้อมูลลูกค้า</span>
                </button>

                <button 
                  id="btn-print-quotation"
                  className="ctrl-btn-print"
                  onClick={handlePrint}
                  title="พิมพ์เอกสาร หรือ บันทึกเป็น PDF"
                >
                  <Printer size={15} />
                  <span>พิมพ์ / บันทึก PDF</span>
                </button>

                <button 
                  id="btn-quote-proceed-pay"
                  className="ctrl-btn-pay"
                  onClick={handleProceedToPayment}
                  title="ชำระเงินตามใบเสนอราคานี้ทันที"
                >
                  <CreditCard size={15} />
                  <span>ชำระเงินทันที</span>
                </button>
              </>
            )}

            {viewMode === 'form' && (
              <button 
                className="ctrl-btn-view"
                onClick={() => setViewMode('preview')}
              >
                ดูตัวอย่างเอกสาร
              </button>
            )}

            <button 
              className="ctrl-btn-close"
              onClick={() => setIsQuotationModalOpen(false)}
              aria-label="ปิดหน้าต่าง"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="quotation-modal-content-area">
          {viewMode === 'form' ? (
            /* CLIENT INFORMATION FORM */
            <div className="quotation-form-wrapper">
              <div className="form-intro-banner">
                <Building2 size={24} className="text-blue" />
                <div>
                  <h3>กรอกข้อมูลผู้ออกใบเสนอราคา (Customer & Billing Info)</h3>
                  <p>ข้อมูลนี้จะปรากฏบนหัวเอกสารใบเสนอราคาอย่างเป็นทางการ สามารถนำไปใช้เบิกงบ อนุมัติจัดซื้อ หรือยื่นหักภาษีได้</p>
                </div>
              </div>

              <form onSubmit={handleSaveAndGenerate} className="quote-client-form">
                {/* Client Type Toggle */}
                <div className="form-group-type">
                  <label className="type-toggle-btn">
                    <input 
                      type="radio" 
                      name="clientType" 
                      checked={clientType === 'corporate'}
                      onChange={() => setClientType('corporate')} 
                    />
                    <Building2 size={16} />
                    <span>นิติบุคคล / บริษัท / องค์กร (Corporate)</span>
                  </label>
                  <label className="type-toggle-btn">
                    <input 
                      type="radio" 
                      name="clientType" 
                      checked={clientType === 'individual'}
                      onChange={() => setClientType('individual')} 
                    />
                    <User size={16} />
                    <span>บุคคลธรรมดา (Individual)</span>
                  </label>
                </div>

                <div className="form-grid-2col">
                  <div className="form-field">
                    <label>
                      {clientType === 'corporate' ? 'ชื่อบริษัท / นิติบุคคล / โรงเรียน / หน่วยงาน *' : 'ชื่อ-นามสกุล ลูกค้า *'}
                    </label>
                    <input 
                      type="text" 
                      required 
                      placeholder={clientType === 'corporate' ? 'บจก. เอ็กแซมเปิล เทรดดิ้ง' : 'นาย สมชาย ใจดี'}
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                    />
                  </div>

                  <div className="form-field">
                    <label>เลขประจำตัวผู้เสียภาษีอากร 13 หลัก</label>
                    <input 
                      type="text" 
                      placeholder="01055xxxxxxxx"
                      maxLength={13}
                      value={taxId}
                      onChange={(e) => setTaxId(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-grid-2col">
                  <div className="form-field">
                    <label>สำนักงาน / สาขา</label>
                    <input 
                      type="text" 
                      placeholder="สำนักงานใหญ่ หรือ สาขาที่..."
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                    />
                  </div>

                  <div className="form-field">
                    <label>ชื่อผู้ติดต่อ / ฝ่ายจัดซื้อ *</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="ชื่อผู้ประสานงาน"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-grid-2col">
                  <div className="form-field">
                    <label>เบอร์โทรศัพท์ติดต่อ *</label>
                    <input 
                      type="tel" 
                      required 
                      placeholder="08x-xxx-xxxx"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                  <div className="form-field">
                    <label>อีเมลสำหรับส่งเอกสาร *</label>
                    <input 
                      type="email" 
                      required 
                      placeholder="purchasing@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label>ที่อยู่จดทะเบียน / ที่อยู่จัดส่งและติดตั้ง *</label>
                  <textarea 
                    rows={3} 
                    required 
                    placeholder="เลขที่, อาคาร, ถนน, แขวง/ตำบล, เขต/อำเภอ, จังหวัด, รหัสไปรษณีย์"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>

                <div className="form-grid-2col">
                  <div className="form-field">
                    <label>เงื่อนไขการชำระเงิน (Payment Terms)</label>
                    <select 
                      value={paymentTerms} 
                      onChange={(e) => setPaymentTerms(e.target.value)}
                    >
                      <option value="ชำระเต็มจำนวนก่อนส่งมอบสินค้า (Full Payment)">ชำระเต็มจำนวนก่อนส่งมอบสินค้า (Full Payment)</option>
                      <option value="มัดจำ 30% วันสั่งซื้อ / ส่วนที่เหลือ 70% วันส่งมอบ">มัดจำ 30% วันสั่งซื้อ / ส่วนที่เหลือ 70% วันส่งมอบ</option>
                      <option value="มัดจำ 50% วันสั่งซื้อ / ส่วนที่เหลือ 50% วันส่งมอบ">มัดจำ 50% วันสั่งซื้อ / ส่วนที่เหลือ 50% วันส่งมอบ</option>
                      <option value="เครดิตเทอม 30 วัน (สำหรับลูกค้านิติบุคคลที่ผ่านการอนุมัติ)">เครดิตเทอม 30 วัน (นิติบุคคลสัญญาองค์กร)</option>
                    </select>
                  </div>

                  <div className="form-field">
                    <label>หมายเหตุเพิ่มเติม (ถ้ามี)</label>
                    <input 
                      type="text" 
                      placeholder="เช่น ต้องการให้เข้าประกอบวันเสาร์-อาทิตย์"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-actions-bar">
                  <button type="submit" className="btn-generate-quote">
                    <CheckCircle2 size={18} />
                    <span>สร้างใบเสนอราคา (Generate Quotation)</span>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* OFFICIAL THAI QUOTATION DOCUMENT PREVIEW */
            <div className="official-quotation-paper" id="printable-quotation-sheet">
              {/* Quotation Header */}
              <div className="quotation-header-grid">
                {/* Company Issuer Info */}
                <div className="issuer-column">
                  <div className="issuer-brand-line">
                    <img 
                      src="/glp-logo-badge.png" 
                      alt="Gspeed Living Plus Logo" 
                      className="issuer-logo" 
                    />
                    <div>
                      <h2 className="issuer-company-th">บริษัท จีสปีด ลิฟวิ่ง พลัส จำกัด</h2>
                      <h4 className="issuer-company-en">GSPEED LIVING PLUS CO., LTD.</h4>
                    </div>
                  </div>

                  <div className="issuer-address-block">
                    <p>79 ซอยรามคำแหง 53 แขวงพลับพลา เขตวังทองหลาง กรุงเทพมหานคร 10310</p>
                    <p>เลขประจำตัวผู้เสียภาษีอากร: <strong>0105563048912</strong> (สำนักงานใหญ่)</p>
                    <p>โทรศัพท์: 063-793-7704 | อีเมล: gspeedlivingplus35@gmail.com</p>
                    <p>เว็บไซต์: www.gspeedlivingplus.com</p>
                  </div>
                </div>

                {/* Document Metadata Column */}
                <div className="doc-meta-column">
                  <div className="doc-title-box">
                    <h1 className="doc-main-title">ใบเสนอราคา</h1>
                    <span className="doc-main-subtitle">QUOTATION</span>
                  </div>

                  <table className="doc-meta-table">
                    <tbody>
                      <tr>
                        <th>เลขที่ใบเสนอราคา:</th>
                        <td><strong>{quote?.quoteNo}</strong></td>
                      </tr>
                      <tr>
                        <th>วันที่ออกเอกสาร:</th>
                        <td>{formattedDate}</td>
                      </tr>
                      <tr>
                        <th>กำหนดยืนราคาถึง:</th>
                        <td><strong className="text-blue">{formattedValidDate}</strong></td>
                      </tr>
                      <tr>
                        <th>พนักงานขาย / โครงการ:</th>
                        <td>ฝ่ายขายและโครงการ Gspeed</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="quotation-divider"></div>

              {/* Customer / Client Info Box */}
              <div className="client-info-container">
                <div className="client-info-left">
                  <div className="info-row">
                    <span className="info-lbl">ชื่อลูกค้า / บริษัท:</span>
                    <strong className="info-txt client-name">{quote?.clientInfo?.companyName}</strong>
                  </div>
                  <div className="info-row">
                    <span className="info-lbl">ที่อยู่จดทะเบียน / จัดส่ง:</span>
                    <span className="info-txt">{quote?.clientInfo?.address}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-lbl">เลขประจำตัวผู้เสียภาษี:</span>
                    <span className="info-txt">{quote?.clientInfo?.taxId || '-'} ({quote?.clientInfo?.branch || 'สำนักงานใหญ่'})</span>
                  </div>
                </div>

                <div className="client-info-right">
                  <div className="info-row">
                    <span className="info-lbl">ผู้ติดต่อ:</span>
                    <span className="info-txt"><strong>{quote?.clientInfo?.contactName}</strong></span>
                  </div>
                  <div className="info-row">
                    <span className="info-lbl">เบอร์โทรศัพท์:</span>
                    <span className="info-txt">{quote?.clientInfo?.phone}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-lbl">อีเมล:</span>
                    <span className="info-txt">{quote?.clientInfo?.email}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-lbl">เงื่อนไขการชำระ:</span>
                    <span className="info-txt">{quote?.clientInfo?.paymentTerms}</span>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="items-table-wrapper">
                <table className="quotation-items-table">
                  <thead>
                    <tr>
                      <th className="th-center" style={{ width: '6%' }}>ลำดับ</th>
                      <th className="th-left" style={{ width: '15%' }}>รหัสสินค้า</th>
                      <th className="th-left">รายการสินค้า / สเปก / ออปชัน</th>
                      <th className="th-center" style={{ width: '8%' }}>จำนวน</th>
                      <th className="th-right" style={{ width: '15%' }}>ราคา/หน่วย (฿)</th>
                      <th className="th-right" style={{ width: '16%' }}>จำนวนเงิน (฿)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quote?.items && quote.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="td-center">{idx + 1}</td>
                        <td className="td-sku">{item.sku}</td>
                        <td className="td-desc">
                          <div className="item-name-bold">{item.name}</div>
                          <div className="item-options-sub">
                            {item.color && <span>สี: {item.color}</span>}
                            {item.size && <span> • ขนาด: {item.size}</span>}
                          </div>
                        </td>
                        <td className="td-center">{item.quantity}</td>
                        <td className="td-right">{item.unitPrice?.toLocaleString()}</td>
                        <td className="td-right"><strong>{item.totalPrice?.toLocaleString()}</strong></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Financial Calculation & Thai Text Baht */}
              <div className="quotation-financial-grid">
                <div className="financial-left-baht-text">
                  <div className="baht-text-card">
                    <span className="baht-lbl">จำนวนเงินรวมทั้งสิ้น (ตัวอักษร):</span>
                    <div className="baht-val-thai">({quote?.totalTextTh || thaiBahtText(quote?.grandTotal)})</div>
                  </div>

                  {/* Terms and Payment Info */}
                  <div className="quotation-terms-box">
                    <div className="terms-header">เงื่อนไขและข้อตกลงการสั่งซื้อ:</div>
                    <ol className="terms-list">
                      <li>กำหนดยืนราคา 30 วัน นับจากวันที่ออกใบเสนอราคา</li>
                      <li>สินค้ารับประกันโครงสร้าง 3 - 5 ปี ตามประเภทอุปกรณ์ โดยศูนย์ Gspeed Living Plus</li>
                      <li>บริการจัดส่งและประกอบติดตั้งฟรีในเขตกรุงเทพฯ และปริมณฑล สำหรับยอด ฿15,000 ขึ้นไป</li>
                      <li>การชำระเงินโอนเข้าบัญชี: <strong>บจก. จีสปีด ลิฟวิ่ง พลัส</strong> ธนาคารกสิกรไทย เลขที่ <strong>095-2-88741-2</strong></li>
                    </ol>
                  </div>
                </div>

                <div className="financial-right-totals">
                  <table className="totals-table">
                    <tbody>
                      <tr>
                        <th>รวมเป็นเงิน (Subtotal):</th>
                        <td>฿{quote?.subtotal?.toLocaleString()}</td>
                      </tr>
                      {quote?.discount > 0 && (
                        <tr className="discount-tr">
                          <th>ส่วนลดการค้า (Trade Discount):</th>
                          <td>-฿{quote?.discount?.toLocaleString()}</td>
                        </tr>
                      )}
                      <tr>
                        <th>มูลค่าหลังหักส่วนลด (Net Total):</th>
                        <td>฿{quote?.netTotal?.toLocaleString()}</td>
                      </tr>
                      <tr>
                        <th>ภาษีมูลค่าเพิ่ม 7% (VAT):</th>
                        <td>฿{quote?.vat?.toLocaleString()}</td>
                      </tr>
                      <tr className="grand-total-tr">
                        <th>ยอดเงินสุทธิทั้งสิ้น (Grand Total):</th>
                        <td><strong className="grand-price-text">฿{quote?.grandTotal?.toLocaleString()}</strong></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Signatures & Seal Box */}
              <div className="quotation-signatures-grid">
                <div className="signature-box">
                  <div className="sig-space">
                    {/* Simulated Authorized Stamp & Signature */}
                    <div className="digital-stamp-badge">
                      <div className="stamp-circle">
                        <span>GSPEED</span>
                        <span>OFFICIAL</span>
                        <span>CERTIFIED</span>
                      </div>
                    </div>
                    <div className="simulated-signature-line">
                      <em>Kittisak Promwaree</em>
                    </div>
                  </div>
                  <div className="sig-name">นายกิตติศักดิ์ พรหมวารี</div>
                  <div className="sig-title">กรรมการผู้จัดการ / ผู้มีอำนาจลงนาม</div>
                  <div className="sig-corp">บริษัท จีสปีด ลิฟวิ่ง พลัส จำกัด</div>
                </div>

                <div className="signature-box customer-accept">
                  <div className="sig-space">
                    <div className="sig-placeholder-dots">....................................................................</div>
                  </div>
                  <div className="sig-name">({quote?.clientInfo?.contactName || 'ลงชื่อผู้สั่งซื้อ / ผู้มีอำนาจอนุมัติ'})</div>
                  <div className="sig-title">ตำแหน่ง: ..............................................................</div>
                  <div className="sig-corp">วันที่อนุมัติสั่งซื้อ: ......... / ......... / 2569</div>
                </div>
              </div>

              {/* Print Footer Note */}
              <div className="quotation-print-footer">
                <span>เอกสารนี้ออกโดยระบบอัตโนมัติ Gspeed Living Plus Store • โทร 063-793-7704</span>
                <span>หน้าที่ 1/1</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
