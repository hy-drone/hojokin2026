import { useState } from 'react';
import { motion } from 'motion/react';
import { Sun, Battery, Zap, ShieldCheck, TrendingDown, AlertTriangle, ArrowRight, CheckCircle2, Calculator, Phone, Mail, ChevronDown, ChevronLeft, ChevronRight, HelpCircle, MapPin, FileText, Wrench, Clock, Info, Share2, Camera, MessageCircle, X, Check, Upload } from 'lucide-react';

const FadeIn = ({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.6, delay }}
    className={className}
  >
    {children}
  </motion.div>
);

const Carousel = ({ items }: { items: { src: string; title: string; description: string; tag: string; tagColor: string }[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => setCurrentIndex((prev) => (prev + 1) % items.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);

  return (
    <>
      {/* Web View Carousel */}
      <div className="print-hidden relative w-full max-w-3xl mx-auto overflow-hidden rounded-2xl bg-slate-50 border border-slate-200 shadow-sm group">
        <div className="aspect-[16/9] bg-slate-200 relative overflow-hidden">
          <motion.img
            key={currentIndex}
            src={items[currentIndex].src}
            alt={items[currentIndex].title}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className={`absolute top-4 left-4 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md ${items[currentIndex].tagColor}`}>
            {items[currentIndex].tag}
          </div>
          
          {/* Controls */}
          <button onClick={prev} className="absolute top-1/2 -translate-y-1/2 left-4 bg-white/80 hover:bg-white text-slate-800 p-2 rounded-full shadow-md transition-colors z-10">
            <ChevronLeft size={24} />
          </button>
          <button onClick={next} className="absolute top-1/2 -translate-y-1/2 right-4 bg-white/80 hover:bg-white text-slate-800 p-2 rounded-full shadow-md transition-colors z-10">
            <ChevronRight size={24} />
          </button>

          {/* Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {items.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${idx === currentIndex ? 'bg-blue-600' : 'bg-white/50 hover:bg-white/80 shadow-sm'}`}
              />
            ))}
          </div>
        </div>
        <div className="p-6 md:p-8">
          <h3 className="font-bold text-slate-800 mb-2 text-xl">{items[currentIndex].title}</h3>
          <p className="text-slate-600">{items[currentIndex].description}</p>
        </div>
      </div>

      {/* Print View Grid */}
      <div className="hidden print:grid grid-cols-3 gap-4">
        {items.map((item, idx) => (
          <div key={idx} className="bg-slate-50 rounded-xl overflow-hidden border border-slate-200">
            <div className="aspect-[4/3] relative">
              <img src={item.src} alt={item.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              <div className={`absolute top-2 left-2 text-white text-[10px] font-bold px-2 py-0.5 rounded-full ${item.tagColor}`}>
                {item.tag}
              </div>
            </div>
            <div className="p-3">
              <h3 className="font-bold text-slate-800 mb-1 text-sm">{item.title}</h3>
              <p className="text-xs text-slate-600">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default function App() {
  const [showShareToast, setShowShareToast] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    company: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const endpoint = "https://script.google.com/macros/s/AKfycbwyzH4h4bX_K8r7lRqw-8L3yoh0k9HK5pwfgw8issc_ox9Or5-oQNxnNqG2K-P-j0M/exec";
    
    try {
      // GASのCORSエラー（Preflightリクエストの失敗）を防ぐため、text/plainで送信します
      await fetch(endpoint, { 
        method: 'POST', 
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify(formData) 
      });
      setIsFormSubmitted(true);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('送信に失敗しました。通信環境をご確認の上、再度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: '太陽光＋蓄電池 導入シミュレーション',
      text: '初期費用実質150万円で導入できる太陽光＋蓄電池のシミュレーション結果です。',
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        setShowShareToast(true);
        setTimeout(() => setShowShareToast(false), 3000);
      } catch (err) {
        console.error('Failed to copy: ', err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-amber-200">
      
      {/* ヘッダー（ブランド名） */}
      <header className="print-hidden fixed top-0 left-0 right-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sun className="text-amber-400" size={24} />
          <span className="text-white font-bold text-lg tracking-wider">奈良県補助金活用太陽光</span>
        </div>
        <div className="hidden md:block text-slate-300 text-sm">
          個人事業主・小規模事業者様向け 特別プラン
        </div>
      </header>

      {/* 共有完了トースト */}
      {showShareToast && (
        <div className="fixed bottom-20 right-6 z-50 bg-slate-800 text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-4">
          <Check size={18} className="text-green-400" />
          <span className="text-sm font-medium">URLをコピーしました</span>
        </div>
      )}

      {/* 共有ボタン (画面右下に固定) */}
      <button 
        onClick={handleShare}
        className="print-hidden fixed bottom-6 right-6 z-50 bg-slate-800/90 backdrop-blur-sm hover:bg-slate-700 text-white rounded-full p-3 shadow-xl flex items-center gap-2 border border-slate-600 transition-all hover:scale-105 group"
        title="このページを共有する"
      >
        <Share2 size={20} className="group-hover:text-amber-400 transition-colors" />
        <span className="text-sm font-medium hidden md:inline group-hover:text-amber-400 transition-colors">共有する</span>
      </button>

      {/* ① 表紙 */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-400 via-transparent to-transparent"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="inline-block mb-6 px-4 py-1.5 rounded-full bg-amber-500/20 text-amber-300 font-medium text-sm tracking-wider border border-amber-500/30"
          >
            個人事業主・小規模事業者様向け
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-bold leading-tight mb-8 flex flex-col gap-3 md:gap-4"
          >
            <span className="text-lg md:text-3xl lg:text-4xl text-white/90">電気代高騰の根本対策！</span>
            <span className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl text-transparent print:text-amber-500 bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-200 whitespace-nowrap">
              「太陽光＋大容量蓄電池」
            </span>
            <span className="text-xl md:text-4xl lg:text-5xl">導入のご提案</span>
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white/10 backdrop-blur-md print:backdrop-blur-none print:bg-slate-800/80 border border-white/20 rounded-2xl p-6 md:p-8 mb-12 shadow-2xl"
          >
            <div className="text-base sm:text-lg md:text-2xl font-medium mb-4 leading-relaxed">
              <span className="inline-block">補助金</span>
              <span className="text-amber-400 font-bold text-2xl sm:text-3xl md:text-4xl mx-1 inline-block">最大220万円</span>
              <span className="inline-block">を活用して、</span>
              <div className="h-2 md:hidden"></div>
              <span className="inline-block">設備費用の負担を</span>
              <span className="text-amber-400 font-bold text-2xl sm:text-3xl md:text-4xl mx-1 inline-block">約60%カット！</span>
            </div>
            <p className="text-sm md:text-base text-slate-300">
              <span className="inline-block">事務所や店舗、ご自宅を</span>
              <span className="inline-block">「電気を買わない・停電しない」</span>
              <span className="inline-block">安心空間へ。</span>
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="flex justify-center gap-8 text-amber-400"
          >
            <div className="flex flex-col items-center">
              <Sun size={48} className="mb-2" />
              <span className="text-sm font-medium">太陽光パネル</span>
            </div>
            <div className="flex flex-col items-center">
              <Battery size={48} className="mb-2" />
              <span className="text-sm font-medium">大容量蓄電池</span>
            </div>
            <div className="flex flex-col items-center">
              <TrendingDown size={48} className="mb-2" />
              <span className="text-sm font-medium">電気代削減</span>
            </div>
          </motion.div>
        </div>
        
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="print-hidden absolute bottom-10 text-white/50"
        >
          <ChevronDown size={32} />
        </motion.div>
      </section>

      {/* ② 費用と補助金 */}
      <section className="py-16 md:py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <div className="text-center mb-10 md:mb-16">
              <h2 className="text-xl md:text-4xl font-bold text-slate-900 mb-4 md:mb-6 leading-tight">
                <span className="text-base md:text-2xl text-blue-600 block mb-2">驚きの補助金活用術！</span>
                <span className="inline-block">初期費用は</span>
                <span className="inline-block">実質約<span className="text-blue-600 text-2xl md:text-4xl mx-1">「3分の1」</span>に</span>
              </h2>
              <p className="text-sm md:text-lg text-slate-600 leading-relaxed">
                <span className="inline-block">国や自治体の<strong className="text-slate-900">「補助金」</strong>を</span>
                <span className="inline-block">最大限に活用する特別プランのご案内です。</span>
                <br className="hidden md:block" />
                <span className="inline-block">高性能な設備を導入しても、</span>
                <span className="inline-block">実際の持ち出し額は大幅に抑えられます。</span>
              </p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <FadeIn delay={0.2}>
              <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 h-full">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <CheckCircle2 className="text-blue-600" /> 導入設備のスペック
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg text-blue-600 mt-1"><Sun size={20} /></div>
                    <div>
                      <div className="font-bold flex items-center flex-wrap gap-2">
                        太陽光パネル：12kW
                        <span className="text-xs font-normal bg-amber-100 text-amber-800 px-2 py-0.5 rounded border border-amber-200">両面受光タイプ</span>
                      </div>
                      <div className="text-sm text-slate-600 mb-1">Maxar (WS-435M-182G108)</div>
                      <p className="text-xs text-slate-500 mb-2 leading-relaxed">
                        ※表記の12kWは表面出力のみ。裏面からの反射光でさらに＋αの発電量が見込めます。
                      </p>
                      <a href="https://wwwb.jp/wpapp/wp-content/uploads/2024/07/%E3%83%87%E3%83%BC%E3%82%BF%E3%82%B7%E3%83%BC%E3%83%88_WS-435M-182G108_compressed.pdf" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-md border border-blue-200 transition-colors">
                        <FileText size={12} /> 製品カタログ（PDF）
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg text-blue-600 mt-1"><Zap size={20} /></div>
                    <div>
                      <div className="font-bold">遠隔監視対応パワーコンディショナ：9.9kW</div>
                      <div className="text-sm text-slate-600 mb-1.5">Huawei (SUN2000-4.95K-LB0-NH)</div>
                      <p className="text-xs text-slate-500 mb-2 leading-relaxed">
                        ※余剰売電FIT制度を利用する前提のシステムです。
                      </p>
                      <a href="https://solar.huawei.com/download?p=%2f-%2fmedia%2fSolarV4%2fsolar-version2%2fasia-pacific%2fjp%2fprofessionals%2fall-products%2futility-smart-pv%2fdatasheet%2fSUN2000-4_95KTL-JPL1.pdf" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-md border border-blue-200 transition-colors">
                        <FileText size={12} /> システム全体・活用イメージ（PDF）
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg text-blue-600 mt-1"><Battery size={20} /></div>
                    <div>
                      <div className="font-bold">蓄電池：10kWh（事務所・電灯用）</div>
                      <div className="text-sm text-slate-600 mb-1.5">Huawei (LUNA2000-10-NHS0)</div>
                      <p className="text-xs text-slate-500 mb-2 leading-relaxed">
                        ※単相（従量電灯）接続用です。三相低圧（動力）機器には使用できません。工場等の場合は事務所や照明のバックアップとして利用します。
                      </p>
                      <a href="https://solar.huawei.com/download?p=%2f-%2fmedia%2fSolarV4%2fsolar-version2%2fasia-pacific%2fjp%2fsolutions%2fresidential%2fpdf%2fLUNA2000-51015-NHS0.pdf" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-md border border-blue-200 transition-colors">
                        <FileText size={12} /> 製品カタログ（PDF）
                      </a>
                    </div>
                  </li>
                </ul>
              </div>
            </FadeIn>

            <FadeIn delay={0.4}>
              <div className="bg-blue-600 text-white rounded-2xl p-8 shadow-xl relative overflow-hidden h-full">
                <div className="print-hidden absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                <h3 className="text-xl font-bold mb-6">費用と補助金の内訳</h3>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center border-b border-blue-500/50 pb-2">
                    <span>設備・工事費用合計（税込）</span>
                    <span className="font-bold text-xl">370万円</span>
                  </div>
                  <div className="flex justify-between items-center text-blue-200">
                    <span>🔽 補助金（太陽光）</span>
                    <span className="font-bold">▲ 60万円</span>
                  </div>
                  <div className="flex justify-between items-center text-blue-200 border-b border-blue-500/50 pb-4">
                    <span>🔽 補助金（蓄電池）</span>
                    <span className="font-bold">▲ 160万円</span>
                  </div>
                </div>
                <div className="bg-white text-blue-900 rounded-xl p-4 text-center shadow-inner">
                  <div className="text-sm font-bold mb-1">✨ お客様の実質負担額 ✨</div>
                  <div className="text-4xl font-black">150<span className="text-2xl">万円</span></div>
                  <div className="text-xs mt-2 text-blue-700">総額から約60%も県が負担！</div>
                </div>
              </div>
            </FadeIn>
          </div>
          
          <FadeIn delay={0.6}>
            <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-xl mb-6 shadow-sm">
              <h4 className="text-red-700 font-bold text-lg flex items-center gap-2 mb-2">
                <Clock size={20} /> 【警告】補助金は「早い者勝ち」です！
              </h4>
              <p className="text-red-600/90 font-medium text-sm md:text-base">
                <span className="inline-block">令和7年度の補助金は、5月に募集開始し、</span>
                <span className="inline-block"><strong className="text-red-700 text-lg md:text-xl border-b-2 border-red-300 mx-1">わずか1ヶ月（6月）で予算上限に達し終了</strong>しました。</span>
                <div className="h-2"></div>
                <span className="inline-block">本年度も早期の予算消化が確実視されています。</span>
                <span className="inline-block">申請準備には時間がかかるため、今すぐ動く必要があります。</span>
              </p>
            </div>
            <p className="text-center text-sm text-slate-500">
              ※補助金入金までのつなぎ資金や、導入に関するローン等のご相談も承ります。
            </p>
          </FadeIn>
        </div>
      </section>

      {/* 補助金詳細（SEO対策セクション） */}
      <section className="py-16 md:py-24 px-6 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <div className="text-center mb-10 md:mb-16">
              <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-blue-500/20 text-blue-300 font-medium text-sm tracking-wider border border-blue-500/30">
                令和7年度（2025年度）対策
              </div>
              <h2 className="text-xl md:text-3xl font-bold mb-4 leading-tight">
                <span className="inline-block">奈良県</span>
                <span className="inline-block text-amber-400">「事業所エネルギー効率的利用推進事業補助金」</span>
                <span className="inline-block">の活用について</span>
              </h2>
              <p className="text-sm md:text-base text-slate-300 leading-relaxed">
                本プランは、奈良県が実施する正式な補助金制度を活用したご提案です。対象となる事業者様は、非常に有利な条件で設備導入が可能です。
              </p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-6">
            <FadeIn delay={0.2}>
              <div className="bg-slate-800 rounded-2xl p-6 md:p-8 border border-slate-700 h-full">
                <h3 className="text-lg font-bold text-amber-400 mb-4 flex items-center gap-2 border-b border-slate-700 pb-3">
                  <CheckCircle2 size={20} /> 主な対象要件
                </h3>
                <p className="text-sm text-slate-300 mb-4">以下のいずれかの法人・事業主であり、<strong className="text-white">奈良県内に事業所を有し、県税の滞納がないこと</strong>が条件となります。</p>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0"></div>中小企業者（個人事業主含む）</li>
                  <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0"></div>医療法人</li>
                  <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0"></div>社会福祉法人</li>
                  <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0"></div>特定非営利活動法人（NPO）</li>
                  <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0"></div>学校法人</li>
                  <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0"></div>一般社団・財団法人 / 公益社団・財団法人</li>
                </ul>
              </div>
            </FadeIn>

            <FadeIn delay={0.4}>
              <div className="bg-slate-800 rounded-2xl p-6 md:p-8 border border-slate-700 h-full">
                <h3 className="text-lg font-bold text-amber-400 mb-4 flex items-center gap-2 border-b border-slate-700 pb-3">
                  <Calculator size={20} /> 補助額の詳細（太陽光＋蓄電池）
                </h3>
                <div className="space-y-5">
                  <div>
                    <div className="font-bold text-white mb-1 flex items-center gap-2"><Sun size={16} className="text-amber-400"/> 太陽光発電設備</div>
                    <div className="text-sm text-slate-300 bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
                      <span className="text-blue-300 font-bold">1kWにつき5万円</span><br/>
                      本プラン（12kW）の場合：<strong className="text-white text-base">最大60万円</strong>
                    </div>
                  </div>
                  <div>
                    <div className="font-bold text-white mb-1 flex items-center gap-2"><Battery size={16} className="text-emerald-400"/> 定置用蓄電池導入事業</div>
                    <div className="text-sm text-slate-300 bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
                      <ul className="list-disc pl-4 mb-2 space-y-1 text-xs opacity-90">
                        <li>据置型（定置型）であること</li>
                        <li>太陽光発電設備によって発電した電気を優先的に蓄電すること</li>
                        <li>SII（環境共創イニシアチブ）登録製品であること</li>
                      </ul>
                      <span className="text-emerald-300 font-bold">補助対象経費の2/3</span><br/>
                      本プラン（10kWh）の場合：<strong className="text-white text-base">最大160万円</strong>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ③ 年間どれくらい得するか */}
      <section className="py-16 md:py-24 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <div className="text-center mb-10 md:mb-16">
              <h2 className="text-xl md:text-4xl font-bold text-slate-900 mb-4 md:mb-6 leading-tight">
                <span className="text-base md:text-2xl text-blue-600 block mb-2">あえて“厳しめ”の条件で試算しても、</span>
                <span className="inline-block">年間約<span className="text-amber-600 text-2xl md:text-4xl mx-1">29.7万円</span>の</span>
                <span className="inline-block">経費削減！</span>
              </h2>
              <p className="text-sm md:text-lg text-slate-600 leading-relaxed">
                <span className="inline-block">営業トークでよくある</span>
                <span className="inline-block">「都合の良いシミュレーション」はいたしません。</span>
                <br className="hidden md:block" />
                <span className="inline-block">今回は<strong>「雨が多い年」「電気代が今より安い」</strong>という</span>
                <span className="inline-block">“最悪のケース”を想定して計算しています。</span>
              </p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-5 gap-6 mb-12">
            <FadeIn delay={0.2} className="md:col-span-2">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm h-full">
                <h3 className="font-bold text-slate-800 mb-4 border-b pb-2">手堅い（保守的な）試算条件</h3>
                <ul className="space-y-4 text-sm">
                  <li>
                    <div className="text-slate-500 mb-1">年間発電量</div>
                    <div className="font-bold text-lg">12,000<span className="text-sm font-normal"> kWh</span></div>
                    <div className="text-xs text-slate-400">※12kWパネル搭載時の保守的な見積もりです</div>
                  </li>
                  <li>
                    <div className="text-slate-500 mb-1">電気料金単価</div>
                    <div className="font-bold text-lg">25<span className="text-sm font-normal"> 円/kWh</span></div>
                    <div className="text-xs text-slate-400">※現在は再エネ賦課金等を含めると30〜40円になることが多いですが、あえて低く設定しています</div>
                  </li>
                </ul>
              </div>
            </FadeIn>

            <FadeIn delay={0.4} className="md:col-span-3">
              <div className="bg-white rounded-2xl p-6 border border-amber-200 shadow-md h-full relative overflow-hidden">
                <div className="absolute top-0 right-0 w-2 h-full bg-amber-400"></div>
                <h3 className="font-bold text-slate-800 mb-4">1年間のメリット額（1〜4年目）</h3>
                <p className="text-sm text-slate-600 mb-4">電気で作った分、買う電気が減り、余った電気は売れます！</p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg">
                    <div>
                      <div className="font-bold text-slate-800">① 電気代が浮く額</div>
                      <div className="text-xs text-slate-500">自家消費75% (9,000kWh×25円)</div>
                    </div>
                    <div className="font-bold text-lg">225,000円</div>
                  </div>
                  <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg">
                    <div>
                      <div className="font-bold text-slate-800">② 電気を売る収入</div>
                      <div className="text-xs text-slate-500">売電25% (3,000kWh×24円)</div>
                    </div>
                    <div className="font-bold text-lg">72,000円</div>
                  </div>
                </div>
                
                <div className="border-t-2 border-dashed border-slate-200 pt-4 flex justify-between items-end">
                  <div className="font-bold text-slate-800">✨ 年間のおトク額合計</div>
                  <div className="text-3xl font-black text-amber-600">297,000<span className="text-lg">円/年</span></div>
                </div>
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={0.6}>
            <div className="bg-gradient-to-r from-amber-100 to-yellow-50 rounded-2xl p-6 border border-amber-200">
              <div className="flex items-start gap-4">
                <div className="bg-amber-400 text-white p-2 rounded-full shrink-0">
                  <Zap size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-amber-900 mb-2">【重要】もし今の実際の電気代（例：35円/kWh）で計算すると…？</h4>
                  <p className="text-amber-800 flex flex-col gap-1">
                    <span>電気代の削減額が大きくなるため、<strong>年間【 約38.7万円 】</strong>もおトクになります！</span>
                    <span className="text-sm opacity-80">電気代が上がれば上がるほど、あなたのメリットは増え続けます。</span>
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ④ 回収シミュレーション */}
      <section className="py-24 px-6 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-xl md:text-4xl font-bold mb-4 md:mb-6 leading-tight">
                <span className="text-base md:text-2xl text-blue-400 block mb-2">実質150万円の初期投資は、</span>
                <span className="inline-block">わずか<span className="text-amber-400 text-2xl md:text-4xl mx-1">「3〜5年」</span>で</span>
                <span className="inline-block">回収可能です！</span>
              </h2>
              <p className="text-sm md:text-lg text-slate-300 leading-relaxed">
                <span className="inline-block">導入にかかる実質負担150万円は、</span>
                <span className="inline-block">日々の電気代削減と売電収入で</span>
                <span className="inline-block">あっという間に回収可能です。</span>
              </p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <FadeIn delay={0.2}>
              <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 h-full flex flex-col justify-center">
                <div className="text-slate-400 text-sm font-bold mb-2">あえて厳しい試算（電気代25円）の場合</div>
                <div className="text-xl mb-4">年間約29.7万円のメリット</div>
                <div className="flex items-center gap-4">
                  <ArrowRight className="text-slate-500" />
                  <div className="text-3xl font-bold text-white">約<span className="text-5xl mx-1">5.0</span>年で回収</div>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.4}>
              <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-8 shadow-xl h-full flex flex-col justify-center relative overflow-hidden">
                <div className="print-hidden absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                <div className="text-amber-100 text-sm font-bold mb-2">現在のリアルな電気代（電気代35円）の場合</div>
                <div className="text-xl mb-4 font-medium">年間約38.7万円のメリット</div>
                <div className="flex items-center gap-4">
                  <ArrowRight className="text-amber-200" />
                  <div className="text-3xl font-bold text-white">約<span className="text-6xl mx-1">3.8</span>年で回収！</div>
                </div>
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={0.6}>
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
              <h4 className="font-bold text-lg text-amber-400 mb-3 flex items-center gap-2">
                <ShieldCheck /> ここが安心・誠実ポイント
              </h4>
              <p className="text-slate-300 leading-relaxed flex flex-col gap-1 md:gap-2">
                <span>5年目以降は、国の制度により売電単価が下がります（24円→8.3円）。</span>
                <span>当社のシミュレーションは、<strong>「この単価下落（5年目以降のメリット減）」もすべて織り込み済み</strong>です。それでもこれだけ早く回収でき、回収完了後（5年目以降〜数十年間）は<strong className="text-white border-b border-amber-400">「浮いた電気代がまるまる利益（プラス）」</strong>になり続けます！</span>
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ⑤ 太陽光＋蓄電池の仕組み */}
      <section className="py-16 md:py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <div className="text-center mb-10 md:mb-16">
              <h2 className="text-xl md:text-4xl font-bold text-slate-900 mb-4 md:mb-6 leading-tight">
                <span className="text-base md:text-2xl text-blue-600 block mb-2">なぜこれほどの削減効果が？</span>
                <span className="inline-block">秘密は<span className="text-blue-600">「大容量・蓄電池」</span>との</span>
                <span className="inline-block">セット導入にあります</span>
              </h2>
              <p className="text-sm md:text-lg text-slate-600 leading-relaxed">
                <span className="inline-block">「昼間は事務所（家）に人が少ないから、</span>
                <span className="inline-block">あまり電気を使わないんだけど…」</span>
                <br className="hidden md:block" />
                <span className="inline-block font-bold mt-2">そんな心配は一切不要です！</span>
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="bg-slate-50 rounded-3xl p-8 md:p-12 border border-slate-200 mb-12">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0 mb-12">
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mb-3 shadow-sm">
                    <Sun size={40} />
                  </div>
                  <div className="font-bold text-slate-800">太陽光で作る</div>
                </div>
                <ArrowRight className="text-slate-300 hidden md:block" size={32} />
                <ArrowRight className="text-slate-300 md:hidden rotate-90" size={24} />
                
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center mb-3 shadow-sm">
                    <Zap size={40} />
                  </div>
                  <div className="font-bold text-slate-800">昼間使う</div>
                </div>
                <ArrowRight className="text-slate-300 hidden md:block" size={32} />
                <ArrowRight className="text-slate-300 md:hidden rotate-90" size={24} />
                
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-3 shadow-sm relative">
                    <Battery size={40} />
                    <div className="absolute -top-2 -right-2 bg-amber-400 text-xs font-bold px-2 py-1 rounded-full text-white">余り</div>
                  </div>
                  <div className="font-bold text-slate-800">蓄電池に貯める</div>
                </div>
                <ArrowRight className="text-slate-300 hidden md:block" size={32} />
                <ArrowRight className="text-slate-300 md:hidden rotate-90" size={24} />
                
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-indigo-100 text-indigo-500 rounded-full flex items-center justify-center mb-3 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
                  </div>
                  <div className="font-bold text-slate-800">夜に使う</div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h3 className="font-bold text-xl text-slate-800 mb-4 flex items-center gap-2">
                  <Battery className="text-emerald-500" /> 蓄電池（10kWh）がある最大のメリット
                </h3>
                <ul className="space-y-3 text-slate-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={20} />
                    <span><strong>昼間に余った電気を捨てずに「貯金」できる</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={20} />
                    <span>夕方以降、パソコンや照明、エアコン等で使う電気を<strong>蓄電池からまかなえる</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={20} />
                    <span>だからこそ、発電した電気の<strong>「75%」を無駄なく使い切る（高い自家消費率）</strong>ことが可能になり、電力会社から買う電気を極限まで減らせます。</span>
                  </li>
                </ul>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ⑥ 導入メリットまとめ */}
      <section className="py-16 md:py-24 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-xl md:text-4xl font-bold text-slate-900 mb-4 md:mb-6 leading-tight">
                <span className="text-base md:text-2xl text-blue-600 block mb-2">太陽光＋蓄電池の導入は、</span>
                <span className="inline-block">企業と家計を守る</span>
                <span className="inline-block"><span className="text-blue-600">「究極の防衛策」</span>です</span>
              </h2>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-6">
            <FadeIn delay={0.2}>
              <div className="bg-white rounded-2xl p-8 border-t-4 border-amber-400 shadow-md h-full">
                <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-6">
                  <TrendingDown size={24} />
                </div>
                <h3 className="font-bold text-xl text-slate-800 mb-4">圧倒的なコスト削減</h3>
                <p className="text-slate-600 leading-relaxed">
                  補助金で初期費用を極限まで下げ、毎月の固定費（電気代）をガツンと減らします。電気代高騰のニュースに怯える必要がなくなります。
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.4}>
              <div className="bg-white rounded-2xl p-8 border-t-4 border-blue-500 shadow-md h-full">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6">
                  <ShieldCheck size={24} />
                </div>
                <h3 className="font-bold text-xl text-slate-800 mb-4">停電対策（BCP）</h3>
                <p className="text-slate-600 leading-relaxed mb-4">
                  台風や地震で大規模停電が起きても、太陽光と蓄電池があれば電気が使えます。
                </p>
                <ul className="text-sm text-slate-500 space-y-2">
                  <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-blue-500"/> パソコンやスマホの充電</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-blue-500"/> 冷蔵庫・照明の稼働</li>
                </ul>
              </div>
            </FadeIn>

            <FadeIn delay={0.6}>
              <div className="bg-white rounded-2xl p-8 border-t-4 border-emerald-500 shadow-md h-full">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                  <TrendingDown size={24} className="rotate-180" />
                </div>
                <h3 className="font-bold text-xl text-slate-800 mb-4">企業価値・ブランド向上</h3>
                <p className="text-slate-600 leading-relaxed">
                  環境に配慮したクリーンエネルギーの活用は、取引先や顧客に対する強力なアピール（SDGs貢献など）に繋がります。単なる経費削減以上の価値を生み出します。
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* 施工事例・実績 */}
      <section className="py-24 px-6 bg-white border-t border-slate-100">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-2xl md:text-4xl font-bold text-slate-900 mb-4 flex items-center justify-center gap-3">
                <Camera className="text-blue-600" size={32} /> 豊富な施工実績
              </h2>
              <p className="text-sm md:text-lg text-slate-600 leading-relaxed">
                <strong className="text-amber-600 text-lg md:text-xl">奈良県内での補助金活用実績、4年以上！</strong><br />
                多数の事業者様へ、太陽光パネルと蓄電池の導入をサポートしてまいりました。<br className="hidden md:block" />
                実際の設置イメージをご覧ください。
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <Carousel items={[
              {
                src: "/images/solar.jpg",
                title: "〇〇製作所様（大和郡山市）",
                description: "工場折板屋根への太陽光パネル設置事例。自家消費による大幅な電気代削減を実現しました。",
                tag: "太陽光パネル（屋根上）",
                tagColor: "bg-blue-600"
              },
              {
                src: "/images/battery.jpg",
                title: "〇〇病院様（天理市）",
                description: "BCP（事業継続計画）対策としてHUAWEI製の大型蓄電池を導入。停電時でも重要設備を稼働できます。",
                tag: "定置用蓄電池（屋外）",
                tagColor: "bg-emerald-600"
              },
              {
                src: "/images/monitor.jpg",
                title: "〇〇物流センター様（桜井市）",
                description: "HUAWEI製パワーコンディショナと遠隔監視システムの設置事例。発電状況をリアルタイムで把握可能です。",
                tag: "パワコン・遠隔監視",
                tagColor: "bg-amber-500"
              }
            ]} />
          </FadeIn>
          
          <FadeIn delay={0.4} className="mt-10 text-center">
            <p className="text-sm text-slate-500 bg-slate-50 inline-block px-4 py-2 rounded-lg border border-slate-200">
              ※写真は一例です。お客様の建物構造やご要望に合わせて最適な設置プランをご提案いたします。
            </p>
          </FadeIn>
        </div>
      </section>

      {/* 導入後のサポート */}
      <section className="py-24 px-6 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-xl md:text-4xl font-bold mb-4 md:mb-6 leading-tight">
                <span className="inline-block">導入後も安心の</span>
                <span className="inline-block text-amber-400">長期的サポート体制</span>
              </h2>
              <p className="text-sm md:text-lg text-slate-300 leading-relaxed">
                <span className="inline-block">設置して終わりではありません。</span>
                <span className="inline-block">長期間安心してご利用いただける体制を整えています。</span>
              </p>
            </div>
          </FadeIn>
          
          <FadeIn delay={0.2}>
            <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 flex flex-col md:flex-row items-center gap-8">
              <div className="w-20 h-20 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center shrink-0">
                <Info size={40} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-3 text-white">遠隔監視システムでいつでも状況確認</h3>
                <p className="text-slate-300 leading-relaxed">
                  お客様ご自身のスマートフォンやパソコンから、いつでも発電量や蓄電状況をモニタリング可能です。万が一、システムに「アラーム（異常通知）」が表示された際は、すぐにご連絡ください。迅速に状況を確認し、的確にサポートいたします。
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* よくあるご質問 (FAQ) */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-2xl md:text-4xl font-bold text-slate-900 mb-4 flex items-center justify-center gap-3">
                <HelpCircle className="text-blue-600" size={32} /> よくあるご質問
              </h2>
            </div>
          </FadeIn>

          <div className="space-y-6">
            <FadeIn delay={0.1}>
              <div className="bg-slate-50 rounded-2xl p-6 md:p-8 border border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-start gap-3">
                  <span className="text-blue-600 font-black text-2xl leading-none">Q.</span>
                  機器の寿命や保証はどうなっていますか？すぐダメになりませんか？
                </h3>
                <div className="flex items-start gap-3 pl-1">
                  <span className="text-amber-500 font-black text-2xl leading-none">A.</span>
                  <div className="text-slate-600 leading-relaxed pt-1 w-full">
                    <p className="mb-3">長期間安心してお使いいただけるよう、各機器に充実したメーカー保証が付帯しています。</p>
                    <ul className="space-y-3 bg-white p-4 rounded-xl border border-slate-200 text-sm">
                      <li>
                        <span className="font-bold text-blue-700 block mb-1">太陽光パネル</span>
                        <strong>15年間の製品保証</strong>に加え、<strong>30年間のリニア出力保証</strong>（初年度99.0%保証、以降の経年劣化を年-0.4%に抑える保証）が付帯します。
                      </li>
                      <hr className="border-slate-100" />
                      <li>
                        <span className="font-bold text-blue-700 block mb-1">パワーコンディショナ</span>
                        <strong>最長20年間</strong>（有料オプション込み）
                      </li>
                      <hr className="border-slate-100" />
                      <li>
                        <span className="font-bold text-blue-700 block mb-1">蓄電池</span>
                        <strong>基本保証10年</strong>（最長15年までの有償延長保証あり）
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="bg-slate-50 rounded-2xl p-6 md:p-8 border border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-start gap-3">
                  <span className="text-blue-600 font-black text-2xl leading-none">Q.</span>
                  万が一、故障した場合はどうなりますか？すべて交換になって高額な費用がかかりますか？
                </h3>
                <div className="flex items-start gap-3 pl-1">
                  <span className="text-amber-500 font-black text-2xl leading-none">A.</span>
                  <p className="text-slate-600 leading-relaxed pt-1">
                    HUAWEI製の蓄電池は「5kWhの電池ユニット」を組み合わせる設計（例：5kWh×2台＝10kWh）になっています。そのため、万が一故障した場合でも<strong>「不具合のある5kWhユニットのみ」を交換することが可能</strong>で、安価かつスピーディーに復旧できます。また、1つのユニットが停止しても、もう1つのユニットは稼働し続けるため、完全にシステムがダウンするリスクを軽減できます。
                  </p>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.25}>
              <div className="bg-slate-50 rounded-2xl p-6 md:p-8 border border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-start gap-3">
                  <span className="text-blue-600 font-black text-2xl leading-none">Q.</span>
                  10kWhの蓄電池で、停電時にどれくらいの電気が使えますか？
                </h3>
                <div className="flex items-start gap-3 pl-1">
                  <span className="text-amber-500 font-black text-2xl leading-none">A.</span>
                  <p className="text-slate-600 leading-relaxed pt-1">
                    10kWhは、事務所の必要最低限のインフラを維持するのに十分な容量です。例えば、停電時でも<strong>「事務所のLED照明」「ノートパソコン数台」「Wi-Fiルーター等の通信機器」「小型冷蔵庫」などを同時に半日〜1日程度稼働</strong>させることが可能です。（※接続する機器の消費電力によって変動します。詳細はシステム構成のPDFをご覧ください）
                  </p>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="bg-slate-50 rounded-2xl p-6 md:p-8 border border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-start gap-3">
                  <span className="text-blue-600 font-black text-2xl leading-none">Q.</span>
                  手出し150万円とありますが、最初から150万円だけ払えばいいのですか？
                </h3>
                <div className="flex items-start gap-3 pl-1">
                  <span className="text-amber-500 font-black text-2xl leading-none">A.</span>
                  <p className="text-slate-600 leading-relaxed pt-1">
                    いいえ、補助金の性質上、<strong>まずは工事費用の全額（370万円）を一度お支払いいただく必要があります。</strong>工事完了後に県から補助金（約220万円）が振り込まれ、最終的な実質負担が150万円となる仕組みです。補助金入金までのつなぎ融資等のご相談も承ります。
                  </p>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.4}>
              <div className="bg-slate-50 rounded-2xl p-6 md:p-8 border border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-start gap-3">
                  <span className="text-blue-600 font-black text-2xl leading-none">Q.</span>
                  補助金を活用した購入と、リース契約ではどちらがお得ですか？
                </h3>
                <div className="flex items-start gap-3 pl-1">
                  <span className="text-amber-500 font-black text-2xl leading-none">A.</span>
                  <p className="text-slate-600 leading-relaxed pt-1">
                    リース契約が補助金対象となるかは条件によりますが、補助金を活用して実質150万円で導入できた場合、<strong>投資回収が3〜5年と非常に早いため、長期的なトータルコストを考慮すると「購入」の方が圧倒的に有利</strong>となります。
                  </p>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.5}>
              <div className="bg-slate-50 rounded-2xl p-6 md:p-8 border border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-start gap-3">
                  <span className="text-blue-600 font-black text-2xl leading-none">Q.</span>
                  今回の提案（パワコン9.9kW）より屋根がはるかに大きいのですが？
                </h3>
                <div className="flex items-start gap-3 pl-1">
                  <span className="text-amber-500 font-black text-2xl leading-none">A.</span>
                  <p className="text-slate-600 leading-relaxed pt-1">
                    本パッケージは「余剰売電FIT制度」を利用する前提（パワコン9.9kWまで）のご提案となります。屋根が非常に大きい場合は今回のシミュレーションには該当せず、別途「完全自家消費型」など、御社に最適なプランを設計・ご提案させていただきます。
                  </p>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.6}>
              <div className="bg-slate-50 rounded-2xl p-6 md:p-8 border border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-start gap-3">
                  <span className="text-blue-600 font-black text-2xl leading-none">Q.</span>
                  面倒な補助金申請はすべてお任せできますか？
                </h3>
                <div className="flex items-start gap-3 pl-1">
                  <span className="text-amber-500 font-black text-2xl leading-none">A.</span>
                  <p className="text-slate-600 leading-relaxed pt-1">
                    はい、基本的な申請手続きは弊社でサポート・代行いたします。ただし、御社名義での申請となるため、県税の納税証明書など「お客様側でしか取得できない添付書類」のご用意だけはお願いしております。
                  </p>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.7}>
              <div className="bg-slate-50 rounded-2xl p-6 md:p-8 border border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-start gap-3">
                  <span className="text-blue-600 font-black text-2xl leading-none">Q.</span>
                  古い屋根でも設置できますか？雨漏りなどが心配です。
                </h3>
                <div className="flex items-start gap-3 pl-1">
                  <span className="text-amber-500 font-black text-2xl leading-none">A.</span>
                  <p className="text-slate-600 leading-relaxed pt-1">
                    事前に屋根の状態をしっかりと確認し、状態に合わせた設計を行います。必要であれば補修作業のご提案などもきちんと行い、安全を確保した上で設置いたします。
                  </p>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.8}>
              <div className="bg-slate-50 rounded-2xl p-6 md:p-8 border border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-start gap-3">
                  <span className="text-blue-600 font-black text-2xl leading-none">Q.</span>
                  工事期間はどれくらいですか？また、停電は発生しますか？
                </h3>
                <div className="flex items-start gap-3 pl-1">
                  <span className="text-amber-500 font-black text-2xl leading-none">A.</span>
                  <p className="text-slate-600 leading-relaxed pt-1">
                    目安として、太陽光パネル設置に2〜3日、蓄電池設置に1日、電気工事に1日、その他設定作業等がかかります。また、分電盤工事の際に一時的な停電作業が必要となりますので、業務への影響が最小限になるよう日程調整いたします。
                  </p>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.9}>
              <div className="bg-slate-50 rounded-2xl p-6 md:p-8 border border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-start gap-3">
                  <span className="text-blue-600 font-black text-2xl leading-none">Q.</span>
                  屋根ではなく、駐車場（カーポート）への設置は可能ですか？
                </h3>
                <div className="flex items-start gap-3 pl-1">
                  <span className="text-amber-500 font-black text-2xl leading-none">A.</span>
                  <p className="text-slate-600 leading-relaxed pt-1">
                    はい、ソーラーカーポートとしての設置も対応可能です。お気軽にご相談ください。
                  </p>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={1.0}>
              <div className="bg-slate-50 rounded-2xl p-6 md:p-8 border border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-start gap-3">
                  <span className="text-blue-600 font-black text-2xl leading-none">Q.</span>
                  建設中の新築物件にも導入できますか？
                </h3>
                <div className="flex items-start gap-3 pl-1">
                  <span className="text-amber-500 font-black text-2xl leading-none">A.</span>
                  <p className="text-slate-600 leading-relaxed pt-1">
                    新築でも対応可能です。ただし、本補助金を利用する場合、例年通りですと完了報告が「2027年2月」となるため、太陽光・蓄電池の設置完了が2027年2月までに間に合うスケジュールである必要があります。
                  </p>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={1.1}>
              <div className="bg-slate-50 rounded-2xl p-6 md:p-8 border border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-start gap-3">
                  <span className="text-blue-600 font-black text-2xl leading-none">Q.</span>
                  奈良県外の店舗・工場でもお願いできますか？
                </h3>
                <div className="flex items-start gap-3 pl-1">
                  <span className="text-amber-500 font-black text-2xl leading-none">A.</span>
                  <p className="text-slate-600 leading-relaxed pt-1">
                    工事自体は他府県でも対応可能です。ただし、他府県に関しては補助金の有無や条件が異なるため、補助金活用については別途お調べする必要があります。
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ⑦ 注意点 */}
      <section className="py-16 md:py-24 px-6 bg-slate-100">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200">
              <div className="text-center mb-10">
                <h2 className="text-xl md:text-3xl font-bold text-slate-900 mb-4 leading-tight">
                  <span className="text-base md:text-xl text-red-500 block mb-2">ご契約前に必ずお伝えしたい</span>
                  <span className="inline-block">「重要な注意点」</span>
                </h2>
                <p className="text-sm md:text-base text-slate-600">
                  <span className="inline-block">当社では、お客様に後悔してほしくないからこそ、</span>
                  <span className="inline-block">以下の点をご理解いただくようお願いしております。</span>
                </p>
              </div>

              <div className="space-y-8">
                <div>
                  <h3 className="font-bold text-lg text-slate-800 mb-3 flex items-center gap-2">
                    <AlertTriangle className="text-amber-500" size={20} /> 本資料のシミュレーションについて
                  </h3>
                  <ul className="list-disc pl-6 space-y-2 text-slate-600 text-sm md:text-base">
                    <li>本シミュレーションはあくまで過去の気象データ等に基づいた「試算」です。</li>
                    <li>実際の発電量は、設置場所の条件（屋根の形状、方位、周囲の建物の影など）によって変動します。</li>
                    <li>計算に使用した電気料金単価（25円/kWh）は仮定の数値です。実際はお使いの電力プランや燃料費調整額によって、これより高くなる（お客様のメリットが増える）場合がほとんどです。</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-lg text-slate-800 mb-3 flex items-center gap-2">
                    <AlertTriangle className="text-amber-500" size={20} /> 補助金について
                  </h3>
                  <ul className="list-disc pl-6 space-y-2 text-slate-600 text-sm md:text-base">
                    <li>補助金には予算枠があり、<strong>採択・交付を100%保証するものではありません</strong>。</li>
                    <li>予算の上限に達し次第、受付終了となるため、<strong>お早めの申請準備をおすすめしております</strong>。当社が申請サポートを全力で行います！</li>
                  </ul>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ⑧ クロージング CTA */}
      <section className="py-16 md:py-24 px-6 bg-slate-900 text-white text-center">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <h2 className="text-xl md:text-4xl font-bold mb-6 leading-tight">
              <span className="inline-block">「うちの屋根だと、</span>
              <span className="inline-block">具体的にいくら下がるの？」</span>
            </h2>
            <p className="text-base md:text-xl text-slate-300 mb-10">
              <span className="inline-block">まずは無料の</span>
              <span className="inline-block text-amber-400 font-bold">【個別シミュレーション】</span>
              <span className="inline-block">をお試しください！</span>
            </p>

            <div className="bg-slate-800 rounded-2xl p-6 md:p-8 text-left mb-12 border border-slate-700 shadow-xl">
              <h3 className="text-xl font-bold text-amber-400 mb-4 flex items-center gap-2">
                <CheckCircle2 /> シミュレーションに必要な情報（ご準備できる範囲でOK！）
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700">
                  <div className="text-amber-500 font-bold mb-2 flex items-center gap-2"><MapPin size={18}/> 概算で知りたい</div>
                  <p className="text-sm text-slate-300 flex flex-col"><strong>ご住所のみ</strong><span className="text-xs opacity-80">（航空写真で屋根を確認します）</span></p>
                </div>
                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700">
                  <div className="text-amber-500 font-bold mb-2 flex items-center gap-2"><FileText size={18}/> より正確に知りたい</div>
                  <p className="text-sm text-slate-300 flex flex-col"><strong>建物の図面</strong><span className="text-xs opacity-80">（屋根の材質や傾斜、足場の要否を確認します）</span></p>
                </div>
                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700">
                  <div className="text-amber-500 font-bold mb-2 flex items-center gap-2"><Zap size={18}/> 完璧な試算を出したい</div>
                  <p className="text-sm text-slate-300 flex flex-col"><strong>年間の電気代明細</strong><span className="text-xs opacity-80">（おおよその月額でも計算可能です）</span></p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-center justify-center">
              <p className="text-amber-400 font-bold mb-3 text-sm md:text-base">
                ＼ スマホから簡単！ご質問やご相談だけでも大歓迎です ／
              </p>
              <a 
                href="https://line.me/R/ti/p/%40236mmgnp"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto bg-[#06C755] hover:bg-[#05b34c] text-white font-bold py-4 px-6 md:px-12 rounded-full flex items-center justify-center gap-2 transition-colors text-base md:text-xl shadow-lg shadow-[#06C755]/20 hover:scale-105 mb-8"
              >
                <MessageCircle size={24} />
                LINEで気軽に相談・シミュレーション
              </a>

              {/* PC向け / その他の連絡方法 */}
              <div className="w-full max-w-2xl bg-slate-800/50 rounded-2xl p-6 md:p-8 border border-slate-700">
                <h4 className="text-center font-bold text-slate-300 mb-6 border-b border-slate-700 pb-4">
                  PCからのご相談・その他の連絡方法
                </h4>
                
                <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-6">
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="w-full md:w-auto bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-8 rounded-full flex items-center justify-center gap-2 transition-colors text-sm md:text-base border border-slate-600"
                  >
                    <FileText size={20} />
                    Webフォームからのお問い合わせ
                  </button>
                  {/* 電話番号がある場合はこちらのコメントアウトを外してご利用ください */}
                  {/* <a 
                    href="tel:000-000-0000"
                    className="w-full md:w-auto bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-8 rounded-full flex items-center justify-center gap-2 transition-colors text-sm md:text-base border border-slate-600"
                  >
                    <Phone size={20} />
                    000-000-0000
                  </a> */}
                </div>
              </div>
            </div>
            
            <p className="mt-8 text-sm text-slate-400 leading-relaxed">
              ※「うちの屋根には付く？」「とりあえず話だけ聞きたい」といったご相談も大歓迎です。<br className="hidden md:block" />
              ※無理な営業やしつこい勧誘は一切いたしません。お気軽にご連絡ください。
            </p>
          </FadeIn>
        </div>
      </section>
      
      {/* お問い合わせモーダル（ポップアップ） */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] overflow-y-auto bg-slate-900/80 backdrop-blur-sm">
          <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
            <div className="bg-slate-800 rounded-2xl w-full max-w-lg p-6 md:p-8 relative border border-slate-700 shadow-2xl my-8">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
              >
              <X size={24} />
            </button>
            
            {!isFormSubmitted ? (
              <>
                <h3 className="text-2xl font-bold text-white mb-6 text-center">お問い合わせフォーム</h3>
                <form 
                  onSubmit={handleSubmit} 
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">貴社名・屋号 <span className="text-slate-500 text-xs ml-1">任意</span></label>
                    <input type="text" name="company" value={formData.company} onChange={handleInputChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500" placeholder="例：株式会社〇〇 / 〇〇商店" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">ご担当者名 <span className="text-red-400 text-xs ml-1">必須</span></label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500" placeholder="例：山田 太郎" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">メールアドレス <span className="text-red-400 text-xs ml-1">必須</span></label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} required className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500" placeholder="例：info@example.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">電話番号 <span className="text-slate-500 text-xs ml-1">任意</span></label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500" placeholder="例：03-0000-0000" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">設置予定場所のGoogleマップURL（またはご住所） <span className="text-slate-500 text-xs ml-1">任意</span></label>
                    <input type="text" name="address" value={formData.address} onChange={handleInputChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500" placeholder="例：https://maps.app.goo.gl/..." />
                    <p className="text-xs text-amber-400/80 mt-1.5 flex items-start gap-1">
                      <MapPin size={14} className="shrink-0 mt-0.5" />
                      建物の場所がわかるURLを貼っていただけると、航空写真からスピーディーに概算シミュレーションが可能です。
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">お問い合わせ内容 <span className="text-red-400 text-xs ml-1">必須</span></label>
                    <textarea name="message" value={formData.message} onChange={handleInputChange} required rows={4} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500" placeholder="ご相談内容やご質問をご記入ください"></textarea>
                    <p className="text-xs text-slate-500 mt-1.5 flex items-start gap-1">
                      <Info size={14} className="shrink-0 mt-0.5" />
                      ※図面や電気代明細などのデータは、後ほどメールにてお送りいただきます。
                    </p>
                  </div>
                  <button type="submit" disabled={isSubmitting} className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-amber-500/50 disabled:cursor-not-allowed text-slate-900 font-bold py-3 px-4 rounded-lg transition-colors mt-6 flex justify-center items-center gap-2">
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin"></div>
                        送信中...
                      </>
                    ) : (
                      '送信する'
                    )}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check size={32} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">送信完了しました</h3>
                <p className="text-slate-400 mb-6 text-sm leading-relaxed">
                  お問い合わせありがとうございます。<br />
                  内容を確認次第、担当者よりご連絡いたします。
                </p>
                <button
                  onClick={() => { 
                    setIsModalOpen(false); 
                    setTimeout(() => setIsFormSubmitted(false), 300); 
                  }}
                  className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                >
                  閉じる
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    )}
      
    </div>
  );
}
