import React, { useState } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  BookOpen,
  FileText,
  Copy,
  Check,
  Download,
  RotateCcw,
  AlertCircle,
  HelpCircle,
  Award,
  Layers,
  Flame,
  CheckSquare,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AIChatMessage } from '../../types';

interface AiToolPreset {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  promptTemplate: string;
}

const AI_TOOLS: AiToolPreset[] = [
  {
    id: 'soan_giao_an',
    name: '01. Soạn giáo án Ngữ văn',
    description: 'Thiết kế giáo án chuẩn công văn 5512 theo 4 bước bài dạy',
    icon: FileText,
    promptTemplate:
      'Hãy soạn một giáo án chuẩn công văn 5512/BGDĐT cho môn Ngữ văn lớp 9, bài học "Truyện ngắn Làng (Kim Lân)", thời lượng 2 tiết. Gồm Mục tiêu (năng lực, phẩm chất), Thiết bị dạy học, và 4 Hoạt động: Khởi động, Hình thành kiến thức, Luyện tập, Vận dụng.',
  },
  {
    id: 'tao_cau_hoi',
    name: '02. Tạo câu hỏi đọc hiểu',
    description: 'Hệ thống câu hỏi theo 4 mức độ: Nhận biết, Thông hiểu, Vận dụng, Vận dụng cao',
    icon: HelpCircle,
    promptTemplate:
      'Hãy tạo 4 câu hỏi đọc hiểu ngữ liệu văn xuôi cho học sinh lớp 8 theo 4 mức độ: 1 câu Nhận biết (trắc nghiệm), 1 câu Thông hiểu, 1 câu Vận dụng và 1 câu Vận dụng cao viết đoạn văn ngắn.',
  },
  {
    id: 'tao_de_thi',
    name: '03. Tạo đề kiểm tra & Ma trận',
    description: 'Đề kiểm tra giữa kỳ / cuối kỳ kèm ma trận và biểu điểm',
    icon: Award,
    promptTemplate:
      'Thiết kế đề kiểm tra giữa kỳ 1 môn Ngữ văn lớp 9 (thời gian 90 phút) gồm: Phần 1 Đọc hiểu (4.0 điểm), Phần 2 Viết (6.0 điểm) nghị luận văn học kèm bảng đặc tả ma trận đề thi.',
  },
  {
    id: 'nhan_xet',
    name: '04. Gợi ý nhận xét bài viết',
    description: 'Nhận xét theo Rubric: Điểm mạnh, Cần hoàn thiện, Gợi ý sửa câu',
    icon: CheckSquare,
    promptTemplate:
      'Hãy viết lời nhận xét sư phạm chi tiết và khích lệ cho một học sinh lớp 9 có bài văn nghị luận xã hội về "Ý chí và nghị lực sống": nêu rõ 2 điểm sáng, 1 điểm cần hoàn thiện và gợi ý viết lại 1 câu văn cho truyền cảm.',
  },
  {
    id: 'phan_tich_tac_pham',
    name: '05. Phân tích tác phẩm văn học',
    description: 'Khái quát chủ đề, diễn biến tâm lý nhân vật và chi tiết đắt giá',
    icon: BookOpen,
    promptTemplate:
      'Phân tích chiều sâu tâm lí và vẻ đẹp tình yêu làng gắn liền với lòng yêu nước của nhân vật ông Hai trong truyện ngắn "Làng" của Kim Lân, đặc biệt chú ý chi tiết khi nghe tin làng chợ Dầu theo giặc.',
  },
  {
    id: 'khoi_dong',
    name: '06. Hoạt động khởi động',
    description: 'Trò chơi, video tình huống hoặc câu đố tạo hứng thú đầu tiết',
    icon: Flame,
    promptTemplate:
      'Gợi ý 3 trò chơi khởi động sinh động (3-5 phút) đầu tiết dạy bài thơ "Đồng chí" của Chính Hữu nhằm gợi nhắc tình đồng chí, đồng đội thời kháng chiến chống Pháp.',
  },
  {
    id: 'phieu_hoc_tap',
    name: '07. Thiết kế phiếu học tập',
    description: 'Phiếu KWL, bảng so sánh và sơ đồ tư duy nhiệm vụ',
    icon: Layers,
    promptTemplate:
      'Thiết kế một phiếu học tập cho học sinh lớp 7 tìm hiểu văn bản biểu cảm: gồm cột nội dung, cảm xúc của tác giả, từ ngữ hình ảnh đặc sắc và cảm nhận của bản thân.',
  },
  {
    id: 'hoat_dong_nhom',
    name: '08. Đề xuất hoạt động nhóm',
    description: 'Kỹ thuật Khăn trải bàn, Phòng tranh, Mảnh ghép trong môn Văn',
    icon: Sparkles,
    promptTemplate:
      'Hướng dẫn tổ chức hoạt động nhóm theo kĩ thuật "Khăn trải bàn" trong tiết học phân tích các chi tiết nghệ thuật của bài thơ "Bếp lửa" (Bằng Việt).',
  },
  {
    id: 'luyen_tap_phan_hoa',
    name: '09. Bài luyện tập phân hóa',
    description: 'Hệ thống bài tập dành riêng cho học sinh đại trà và học sinh giỏi',
    icon: Award,
    promptTemplate:
      'Gợi ý hệ thống bài tập phân hóa 3 mức độ (Đạt yêu cầu - Khá - Bồi dưỡng HSG) cho chủ đề viết đoạn văn cảm thụ thơ lục bát lớp 6.',
  },
  {
    id: 'phan_tich_hoc_tap',
    name: '10. Phân tích kết quả học tập',
    description: 'Tư vấn giải pháp nâng cao điểm số và hứng thú học văn',
    icon: Bot,
    promptTemplate:
      'Điểm kiểm tra giữa kỳ của lớp 8A2 có nhiều học sinh bị trừ điểm ở phần lập luận đoạn văn nghị luận. Thầy cần chiến lược dạy học nào trong 4 tuần tới để khắc phục điểm yếu này?',
  },
];

export const AIAssistantModule: React.FC = () => {
  const { teacherInfo } = useApp();

  const [activeTab, setActiveTab] = useState<'chat' | 'lesson_planner'>('chat');
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: 'msg-01',
      sender: 'assistant',
      text: 'Xin chào Thầy Dương Thành Tín! Em là trợ lý AI môn Ngữ văn. Hôm nay Thầy muốn em hỗ trợ công việc gì?',
      timestamp: '08:00',
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Lesson planner specialized form
  const [planGrade, setPlanGrade] = useState('9');
  const [planBook, setPlanBook] = useState('Kết nối tri thức với cuộc sống');
  const [planLesson, setPlanLesson] = useState('Làng (Kim Lân)');
  const [planDuration, setPlanDuration] = useState('2 tiết (90 phút)');
  const [planObjective, setPlanObjective] = useState('Phát triển năng lực đọc hiểu truyện ngắn hiện đại và bồi dưỡng lòng yêu nước.');

  const handleSendMessage = async (customPrompt?: string, toolId?: string) => {
    const textToSend = customPrompt || inputPrompt;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: AIChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      toolType: toolId,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend,
          toolType: toolId,
          contextData: { teacher: teacherInfo.name, school: teacherInfo.school },
        }),
      });

      const data = await res.json();
      const botMsg: AIChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: data.reply || 'Dạ thưa Thầy, nội dung yêu cầu đã được xử lý thành công.',
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        toolType: toolId,
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now() + 1}`,
          sender: 'assistant',
          text: 'Thưa Thầy, đã có lỗi kết nối tạm thời tới máy chủ. Thầy vui lòng thử lại sau giây lát.',
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportText = (text: string, title = 'Giao_An_Ngu_Van') => {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title}_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleGenerateCustomPlan = () => {
    const prompt = `Soạn Kế hoạch bài dạy (Giáo án) chuẩn Công văn 5512/BGDĐT:
- Môn: Ngữ văn THCS
- Khối lớp: ${planGrade}
- Bộ sách: ${planBook}
- Bài học: ${planLesson}
- Thời lượng: ${planDuration}
- Mục tiêu cần đạt: ${planObjective}
Yêu cầu trình bày đầy đủ: Mục tiêu (năng lực đặc thù, phẩm chất), Thiết bị học liệu, và 4 Hoạt động chi tiết (Khởi động, Hình thành kiến thức, Luyện tập, Vận dụng).`;

    handleSendMessage(prompt, 'soan_giao_an');
    setActiveTab('chat');
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-blue-100 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#7C3AED] to-[#258BFF] text-white flex items-center justify-center shadow-md">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#0B2545] flex items-center gap-2">
              TRỢ LÝ AI NGỮ VĂN 4.0
              <span className="px-2 py-0.5 rounded text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                Gemini 3.8 Flash
              </span>
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Chuyên gia công nghệ giáo dục đồng hành cùng Thầy {teacherInfo.name} • THCS Phan Bội Châu
            </p>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-700">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-2 rounded-lg transition ${
              activeTab === 'chat' ? 'bg-[#1565D8] text-white shadow' : 'hover:text-blue-700'
            }`}
          >
            Hội thoại tương tác ({messages.length})
          </button>
          <button
            onClick={() => setActiveTab('lesson_planner')}
            className={`px-4 py-2 rounded-lg transition ${
              activeTab === 'lesson_planner' ? 'bg-[#1565D8] text-white shadow' : 'hover:text-blue-700'
            }`}
          >
            Biểu mẫu Soạn giáo án 5512
          </button>
        </div>
      </div>

      {activeTab === 'chat' ? (
        /* ======================================================== */
        /* TAB 1: CHATBOT WORKSPACE & 10 PEDAGOGY TOOLS            */
        /* ======================================================== */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column: 10 Preset Pedagogical Tools (col-span-4) */}
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-[#0B2545] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-600" />
                10 Công cụ AI chuyên biệt
              </h3>
              <span className="text-[11px] text-slate-400">Bấm để tạo ngay</span>
            </div>

            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {AI_TOOLS.map((tool) => {
                const Icon = tool.icon;
                return (
                  <button
                    key={tool.id}
                    onClick={() => handleSendMessage(tool.promptTemplate, tool.id)}
                    disabled={isLoading}
                    className="w-full p-3 rounded-xl border border-slate-200 bg-white hover:bg-blue-50/70 hover:border-blue-300 transition text-left group flex items-start gap-3 shadow-2xs"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-50 group-hover:bg-[#1565D8] text-blue-700 group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-[#0B2545] group-hover:text-blue-900 leading-snug">
                        {tool.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                        {tool.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Chat Conversation Stream & Composer (col-span-8) */}
          <div className="lg:col-span-8 bg-white rounded-2xl shadow-sm border border-blue-100 flex flex-col h-[650px] overflow-hidden">
            {/* Header info */}
            <div className="p-4 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-bold text-xs text-slate-700">Trợ lý AI Ngữ văn trực tuyến</span>
              </div>
              <button
                onClick={() =>
                  setMessages([
                    {
                      id: 'msg-reset',
                      sender: 'assistant',
                      text: 'Xin chào Thầy Dương Thành Tín! Em đã làm mới cuộc hội thoại. Hôm nay Thầy muốn em hỗ trợ nhiệm vụ gì?',
                      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
                    },
                  ])
                }
                className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-semibold"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Làm mới hội thoại</span>
              </button>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4">
              {messages.map((msg) => {
                const isAssistant = msg.sender === 'assistant';
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 ${isAssistant ? '' : 'flex-row-reverse'}`}
                  >
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                        isAssistant
                          ? 'bg-purple-100 text-purple-700 ring-2 ring-purple-200'
                          : 'bg-[#1565D8] text-white ring-2 ring-blue-200'
                      }`}
                    >
                      {isAssistant ? <Bot className="w-5 h-5" /> : <span className="font-bold text-xs">Thầy</span>}
                    </div>

                    <div
                      className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed space-y-2 ${
                        isAssistant
                          ? 'bg-[#F3F7FF] text-[#132B50] border border-blue-100 shadow-2xs rounded-tl-sm'
                          : 'bg-gradient-to-r from-[#1565D8] to-[#258BFF] text-white shadow-md rounded-tr-sm'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{msg.text}</div>

                      {/* Tool bar for bot replies */}
                      {isAssistant && (
                        <div className="pt-2 border-t border-blue-200/50 flex items-center justify-between text-[11px] text-slate-400">
                          <span>{msg.timestamp}</span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleCopy(msg.text, msg.id)}
                              className="hover:text-blue-700 flex items-center gap-1 transition"
                              title="Sao chép câu trả lời"
                            >
                              {copiedId === msg.id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                              <span>{copiedId === msg.id ? 'Đã sao chép' : 'Sao chép'}</span>
                            </button>
                            <button
                              onClick={() => handleExportText(msg.text, 'Tro_Ly_AI_Ngu_Van')}
                              className="hover:text-blue-700 flex items-center gap-1 transition"
                              title="Tải về tệp văn bản"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>Tải tệp</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center animate-bounce">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div className="p-3 bg-purple-50 text-purple-900 rounded-2xl rounded-tl-sm text-xs font-semibold flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-600 animate-spin" />
                    <span>Trợ lý AI đang tư duy và soạn phản hồi sư phạm...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Input Composer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200">
              <div className="relative flex items-center">
                <textarea
                  rows={2}
                  placeholder="Thầy hãy nhập câu hỏi, yêu cầu soạn giáo án, câu hỏi đọc hiểu hoặc hướng dẫn sửa bài..."
                  value={inputPrompt}
                  onChange={(e) => setInputPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  className="w-full p-3 pr-24 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner resize-none"
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={isLoading || !inputPrompt.trim()}
                  className="absolute right-3 px-4 py-2 rounded-xl bg-[#1565D8] hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md disabled:opacity-40 transition"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Gửi</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5 text-center">
                Trợ lý AI tuân thủ chuẩn GDPT 2018 môn Ngữ văn và Công văn 5512/BGDĐT.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* ======================================================== */
        /* TAB 2: BIỂU MẪU SOẠN GIÁO ÁN CHUẨN 5512                 */
        /* ======================================================== */
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-blue-100 max-w-3xl mx-auto space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-base text-[#0B2545]">
              Biểu mẫu Soạn Kế hoạch bài dạy theo Công văn 5512/BGDĐT
            </h3>
            <p className="text-xs text-slate-500">
              Nhập các thông số chuyên môn, AI sẽ sinh kế hoạch bài dạy chi tiết với các hoạt động tương tác.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs text-[#132B50]">
            <div>
              <label className="font-bold block mb-1">Khối lớp THCS:</label>
              <select
                value={planGrade}
                onChange={(e) => setPlanGrade(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-lg font-bold"
              >
                <option value="6">Khối 6</option>
                <option value="7">Khối 7</option>
                <option value="8">Khối 8</option>
                <option value="9">Khối 9</option>
              </select>
            </div>

            <div>
              <label className="font-bold block mb-1">Bộ sách giáo khoa:</label>
              <select
                value={planBook}
                onChange={(e) => setPlanBook(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-lg font-bold"
              >
                <option value="Kết nối tri thức với cuộc sống">Kết nối tri thức với cuộc sống</option>
                <option value="Cánh diều">Cánh diều</option>
                <option value="Chân trời sáng tạo">Chân trời sáng tạo</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="font-bold block mb-1">Tên bài học / Tác phẩm:</label>
              <input
                type="text"
                value={planLesson}
                onChange={(e) => setPlanLesson(e.target.value)}
                placeholder="Ví dụ: Ánh trăng (Nguyễn Duy) hoặc Chuyên đề văn nghị luận..."
                className="w-full p-2.5 border border-slate-200 rounded-lg font-semibold"
              />
            </div>

            <div>
              <label className="font-bold block mb-1">Thời lượng giảng dạy:</label>
              <input
                type="text"
                value={planDuration}
                onChange={(e) => setPlanDuration(e.target.value)}
                placeholder="2 tiết (90 phút)"
                className="w-full p-2 border border-slate-200 rounded-lg"
              />
            </div>

            <div>
              <label className="font-bold block mb-1">Giáo viên phụ trách:</label>
              <input
                type="text"
                disabled
                value={`${teacherInfo.name} - ${teacherInfo.school}`}
                className="w-full p-2 bg-slate-100 border border-slate-200 rounded-lg font-semibold"
              />
            </div>

            <div className="col-span-2">
              <label className="font-bold block mb-1">Mục tiêu cần đạt trọng tâm:</label>
              <textarea
                rows={3}
                value={planObjective}
                onChange={(e) => setPlanObjective(e.target.value)}
                placeholder="Năng lực đặc thù cần phát triển, phẩm chất bồi dưỡng..."
                className="w-full p-2.5 border border-slate-200 rounded-lg"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end">
            <button
              onClick={handleGenerateCustomPlan}
              className="px-6 py-2.5 rounded-xl bg-[#1565D8] hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-md transition"
            >
              <Sparkles className="w-4 h-4" />
              <span>Sinh giáo án chi tiết với Gemini AI</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
