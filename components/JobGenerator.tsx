import React, { useState } from 'react';

// 1. 定义数据接口
interface GeneratedContent {
  titles: string[];
  content: string;
  tags: string[];
}

// 2. 定义语气风格
const TONE_STYLES = [
  { label: '幽默风', instruction: '使用幽默、调侃的语气，多用梗，像个段子手' },
  { label: '专业风', instruction: '保持专业、干练、精英感，使用行业术语' },
  { label: '亲切风', instruction: '像邻家大姐姐一样亲切，温暖，真诚，拉近距离' },
  { label: '激情风', instruction: '充满热血、激情，强调梦想、搞钱和未来' },
  { label: '极简风', instruction: '话少、高冷、直接列重点，不废话' },
];

const JobGenerator: React.FC = () => {
  const [inputJD, setInputJD] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [result, setResult] = useState<GeneratedContent | null>(null);
  const [error, setError] = useState<string | null>(null);

  // --- 核心：调用云雾 API 的函数 ---
  const callCloudMistAI = async (jdText: string, styleInstruction: string = '标准小红书风格'): Promise<GeneratedContent> => {
    
    // 获取 Vercel 里的环境变量
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    
    if (!apiKey) {
      throw new Error("未检测到 API Key，请在 Vercel 环境变量中配置 VITE_OPENAI_API_KEY");
    }

    // 提示词 System Prompt
    const systemPrompt = `你是一位资深小红书爆款文案专家。
请根据用户提供的 JD（职位描述）和指定的【${styleInstruction}】，创作招聘笔记。

必须严格按照以下 JSON 格式返回数据（不要包含 markdown 标记，只返回纯 JSON）：
{
  "titles": ["标题1", "标题2", "标题3"],
  "content": "这里是正文内容...",
  "tags": ["#标签1", "#标签2"]
}

要求：
1. 标题要极具吸引力，包含薪资或福利亮点，吸引点击。
2. 正文多用emoji，排版美观，分段清晰。
3. 即使 JD 很枯燥，也要挖掘出亮点（如团队氛围、成长空间）。`;

    // 🌟 重点：这里已经填好了云雾的准确地址
    const API_URL = 'https://yunwu.ai/v1/chat/completions';

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}` // 你的云雾 sk- 密钥会自动填在这里
      },
      body: JSON.stringify({
        // 模型：文档推荐 gpt-3.5-turbo，如果你买的令牌支持 gpt-4o，也可以改
        model: "gpt-4o", 
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: jdText }
        ],
        temperature: 0.7,
        // 强制让 AI 返回 JSON 格式（如果云雾不支持 json_object 模式报错，可以删掉下面这行）
        response_format: { type: "json_object" } 
      })
    });

    if (!response.ok) {
      // 尝试读取错误信息
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error?.message || `请求失败 (状态码: ${response.status})`);
    }

    const data = await response.json();
    const jsonString = data.choices[0]?.message?.content;
    
    // 解析返回的 JSON
    try {
      return JSON.parse(jsonString);
    } catch (e) {
      console.error("JSON解析失败", jsonString);
      // 如果 AI 返回的不是标准 JSON，做一个容错处理
      return {
        titles: ["生成成功（请手动检查格式）"],
        content: jsonString,
        tags: ["#招聘", "#小红书"]
      };
    }
  };

  // --- 点击生成按钮 ---
  const handleGenerate = async () => {
    if (!inputJD.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await callCloudMistAI(inputJD);
      setResult(data);
    } catch (err: any) {
      setError(err.message || '生成失败，请检查API Key或额度。');
    } finally {
      setLoading(false);
    }
  };

  // --- 点击换个语气 ---
  const handleChangeTone = async () => {
    if (!inputJD.trim()) return;
    setIsRegenerating(true);
    setError(null);

    const randomTone = TONE_STYLES[Math.floor(Math.random() * TONE_STYLES.length)];
    
    try {
      const data = await callCloudMistAI(inputJD, randomTone.instruction);
      setResult(data);
    } catch (err: any) {
      setError('换语气失败：' + err.message);
    } finally {
      setIsRegenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("复制成功！"); 
  };

  return (
    <div className="space-y-6">
      {/* 输入框区域 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span>📝</span> 岗位描述 (JD) 输入
        </h2>
        <textarea
          className="w-full h-48 p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none resize-none text-sm"
          placeholder="请粘贴原始 JD 内容，例如：&#10;招聘前端工程师...&#10;薪资范围：20k-40k...&#10;福利：远程办公..."
          value={inputJD}
          onChange={(e) => setInputJD(e.target.value)}
        />
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleGenerate}
            disabled={loading || isRegenerating || !inputJD.trim()}
            className={`px-6 py-2.5 rounded-full font-bold text-white transition flex items-center gap-2 ${
              loading || isRegenerating || !inputJD.trim()
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-200'
            }`}
          >
            {loading ? '生成中...' : '✨ 生成小红书文案'}
          </button>
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>

      {/* 结果展示区域 */}
      {result && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <span>📮</span> 生成结果
            </h2>
            
            <div className="flex items-center gap-3">
                <button
                    onClick={handleChangeTone}
                    disabled={isRegenerating}
                    className="px-4 py-1.5 text-sm rounded-lg font-bold transition flex items-center gap-2 border bg-white text-red-500 border-red-500 hover:bg-red-50 disabled:opacity-50"
                >
                    {isRegenerating ? '优化中...' : '🎲 换个语气'}
                </button>

                <button 
                    onClick={() => copyToClipboard(`${result.titles[0]}\n\n${result.content}\n\n${result.tags.join(' ')}`)}
                    className="text-sm text-gray-500 hover:text-red-500 underline whitespace-nowrap"
                >
                    一键复制全部
                </button>
            </div>
          </div>
          
          <div className={`grid gap-6 ${isRegenerating ? 'opacity-50' : 'opacity-100'}`}>
            {/* 标题 */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">备选标题</label>
              <div className="flex flex-wrap gap-2">
                {result.titles.map((title, idx) => (
                  <button
                    key={idx}
                    onClick={() => copyToClipboard(title)}
                    className="bg-red-50 text-red-600 px-3 py-1.5 rounded-lg text-sm font-medium border border-red-100 hover:bg-red-100 transition text-left"
                  >
                    {title}
                  </button>
                ))}
              </div>
            </div>

            {/* 正文 */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">正文内容</label>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed text-sm">
                  {result.content}
                </pre>
              </div>
            </div>

            {/* 标签 */}
            <div className="space-y-2">
               <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">标签</label>
               <div className="text-blue-600 text-sm leading-6">
                  {result.tags.join(' ')}
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobGenerator;
