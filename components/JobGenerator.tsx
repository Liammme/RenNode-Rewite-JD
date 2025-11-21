import React, { useState } from 'react';

// 1. 定义数据接口
interface GeneratedContent {
  titles: string[];
  content: string;
  tags: string[];
}

// 2. 定义场景风格 (对应你的10个场景，我简化了按钮上的文字，但保留了完整的提示词)
const SCENARIO_STYLES = [
  { 
    label: '🔥 必须分享', 
    instruction: '请以「发现神仙远程公司、忍不住立刻来分享」为主题写开头。语气要兴奋、冲动一点，像刷到宝藏公司后马上打开小红书编辑器。关键词：一刻不能等、神仙公司、小而美。风格示例：“今天一刻不能等！我真的必须马上来写一下这家神仙远程公司…”' 
  },
  { 
    label: '💎 刷到宝藏', 
    instruction: '请以「刷到一份宝藏远程机会→立刻来分享」为主题写开头。语气日常、轻松，像翻手机刷到惊喜内容。关键词：刷到、越挖越多、想赶紧告诉大家。风格示例：“发现Sales/AE方向的外企远程机会真的越挖越多，我今天又刷到一家宝藏小众外企…”' 
  },
  { 
    label: '🦄 准独角兽', 
    instruction: '请以「最近刚关注到 / 观察已久 → 终于来分享一家潜力巨大的公司」为主题写开头。风格要更“行业观察者”一点，带点洞察感。关键词：最近关注到、准独角兽、趁热赶紧分享。风格示例：“今天分享的这家是我前两天重点关注到的『准独角兽』级公司…”' 
  },
  { 
    label: '⛏️ 日常挖宝', 
    instruction: '请以「远程岗挖掘者的日常观察 → 又发现一家宝藏远程公司」为主题写开头。风格像“远程行业 UP 主”，充满日常随手分享感。关键词：Remote岗位永远写不完、刷着刷着又遇到新的。风格示例：“每天钻研远程办公已经成了我的日常，真的远程公司越看越多…”' 
  },
  { 
    label: '📨 粉丝催更', 
    instruction: '请以「被粉丝催更后，来交作业」为主题写开头。风格示例：“太多人私信我问有没有新的远程机会了，我赶紧来交作业…”' 
  },
  { 
    label: '☕️ 摸鱼发现', 
    instruction: '请以「工作间隙刷到好岗 → 顺手分享」为主题写开头。风格示例：“我本来在喝咖啡摸鱼，结果刷到一家公司太优质…”' 
  },
  { 
    label: '🤝 朋友内推', 
    instruction: '请以「朋友内部推荐 → 我立刻来分享」为主题写开头。风格示例：“朋友今天突然给我丢了个超优质的远程岗位，我必须分享出来…”' 
  },
  { 
    label: '📈 趋势观察', 
    instruction: '请以「行业观察者发现趋势岗位」为主题写开头。风格示例：“最近观察到一个明显趋势：越来越多外企开始开放远程岗位…”' 
  },
  { 
    label: '😲 被吓一跳', 
    instruction: '请以「被岗位惊到 → 感叹一句：怎么这么好？」为主题写开头。风格示例：“这个岗位我真的看到吓一跳，这福利也太好了吧…”' 
  },
  { 
    label: '🌙 深夜碎碎念', 
    instruction: '请以「深夜分享/深夜碎碎念」为主题写开头。风格示例：“深夜刷到这个岗位瞬间睡不着了…必须马上告诉你们…”' 
  },
];

const JobGenerator: React.FC = () => {
  const [inputJD, setInputJD] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [result, setResult] = useState<GeneratedContent | null>(null);
  const [error, setError] = useState<string | null>(null);

  // --- 核心：调用云雾 API 的函数 ---
  const callCloudMistAI = async (jdText: string, scenarioInstruction: string = '默认使用“刷到宝藏岗位”的语气') => {
    
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (!apiKey) throw new Error("未检测到 API Key，请在 Vercel 环境变量中配置 VITE_OPENAI_API_KEY");

    // 🔥🔥🔥 核心 Prompt：融合了你的基础定位 + 敏感词过滤 + 场景语气 🔥🔥🔥
    const systemPrompt = `你是「链岛」官方合作的内容创作者助手，负责为远程岗位撰写小红书风格的岗位推广文案。
    
请严格按照以下规则生成内容：

📌 一、基础定位（必须遵守）
1. 文案风格 = 小红书真实分享风，不要官方，不要广告味，不要机械。
2. 开头必须以：“今天寻觅远程工作的岛岛🏝️给大家带来一家…” 开场（除非【当前场景要求】另有指示，则优先遵循场景要求）。
3. 文案语气自然、有网感、有亲和力，像博主在分享一个“宝藏远程岗位”。
4. 不写虚假数据，不夸张宣传，不要写任何明显营销话术。
5. 不要出现 * 符号。

📌 二、敏感词过滤（绝对禁止，必须替换）
文案 **绝对禁止** 出现以下词语：
- 交易所、币圈、区块链、加密资产、Web3、Crypto、Token、币
**必须全部替换为**：
- “外企 / 小众行业外企 / 国际化团队 / 技术公司 / 数字科技平台”

📌 三、内容结构（AI必须严格按此逻辑撰写）
1）开头介绍：根据【当前场景要求】进行开场，如果无特殊要求，则使用标准开场：“今天寻觅远程工作的岛岛🏝️给大家带来一家宝藏外企～XXX！”
2）公司介绍：不要太官方，介绍团队氛围、技术实力。描述为“宝藏外企 / 小众外企 / 国际化团队”。
3）在招岗位：用1–3句话概括岗位职责大方向（不要抄完整JD）。
4）岗位要求（简版）：写 4–6 条，不要太专业，不要吓退人。关键词：自驱力、语言/工具等。
5）待遇说明：完全远程、国际团队、成长空间大等。
6）结尾引导（固定模板）：想投递的可以戳我，我可以帮你匿名投递 / 简历建议～

📌 四、标题规范（非常重要）
- 15～20 字以内
- 必须包含关键词：远程 / 外企 / 招人 / 小众 / 可申请 / 可内推
- 风格参考：小众外企招远程运营👋国内可申 / 宝藏外企招远程全栈⚡可内推

📌 五、当前场景要求（Tone/Scenario）
${scenarioInstruction}

📌 六、强制返回格式
你必须严格按照以下 JSON 格式返回数据（不要包含 markdown 代码块标记，只返回纯 JSON 字符串）：
{
  "titles": ["标题1", "标题2", "标题3"],
  "content": "这里是正文内容...",
  "tags": ["#远程工作", "#找工作", "#remote", "#猎头", "#留学生实习", "#海归求职", "#remote工作", "#远程办公", "#内推"]
}`;

    // 🌟 云雾地址
    const API_URL = 'https://yunwu.ai/v1/chat/completions';

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o", // 使用最聪明的模型
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `请根据以下JD内容生成文案：\n\n${jdText}` }
        ],
        temperature: 0.8,
        response_format: { type: "json_object" } 
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error?.message || `请求失败 (状态码: ${response.status})`);
    }

    const data = await response.json();
    try {
      return JSON.parse(data.choices[0]?.message?.content);
    } catch (e) {
      console.error("JSON解析失败", data.choices[0]?.message?.content);
      return {
        titles: ["生成成功（请检查格式）"],
        content: data.choices[0]?.message?.content,
        tags: ["#远程工作"]
      };
    }
  };

  // --- 事件处理 ---
  const handleGenerate = async () => {
    if (!inputJD.trim()) return;
    setLoading(true);
    setError(null);
    try {
      // 默认使用第一个场景
      const data = await callCloudMistAI(inputJD, SCENARIO_STYLES[1].instruction);
      setResult(data);
    } catch (err: any) {
      setError(err.message || '生成失败');
    } finally {
      setLoading(false);
    }
  };

  const handleScenarioClick = async (scenario: typeof SCENARIO_STYLES[0]) => {
    if (!inputJD.trim()) return;
    setIsRegenerating(true);
    setError(null);
    try {
      const data = await callCloudMistAI(inputJD, scenario.instruction);
      setResult(data);
    } catch (err: any) {
      setError('切换场景失败：' + err.message);
    } finally {
      setIsRegenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("已复制到剪贴板！"); 
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span>📝</span> 岗位描述 (JD) 输入
        </h2>
        <textarea
          className="w-full h-48 p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none resize-none text-sm"
          placeholder="请粘贴原始 JD 内容..."
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
            {loading ? 'AI 正在创作中...' : '✨ 一键生成小红书文案'}
          </button>
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>

      {result && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <span>📮</span> 生成结果
            </h2>
            
            <div className="flex items-center gap-3">
                <button 
                    onClick={() => copyToClipboard(`${result.titles[0]}\n\n${result.content}\n\n${result.tags.join(' ')}`)}
                    className="text-sm text-gray-500 hover:text-red-500 underline whitespace-nowrap"
                >
                    一键复制全部
                </button>
            </div>
          </div>

          {/* 场景选择按钮区 */}
          <div className="mb-6">
             <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">🎭 切换开场场景 (点击即重新生成)</label>
             <div className="flex flex-wrap gap-2">
               {SCENARIO_STYLES.map((scenario, idx) => (
                 <button
                   key={idx}
                   onClick={() => handleScenarioClick(scenario)}
                   disabled={isRegenerating}
                   className={`px-3 py-1.5 text-xs rounded-lg font-medium border transition ${
                     isRegenerating
                       ? 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed'
                       : 'bg-white text-gray-600 border-gray-200 hover:border-red-500 hover:text-red-500 hover:bg-red-50'
                   }`}
                 >
                   {scenario.label}
                 </button>
               ))}
             </div>
          </div>
          
          <div className={`grid gap-6 ${isRegenerating ? 'opacity-50' : 'opacity-100'}`}>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">🔥 爆款标题预测</label>
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

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">📝 种草笔记正文</label>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed text-sm">
                  {result.content}
                </pre>
              </div>
            </div>

            <div className="space-y-2">
               <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">🏷️ 流量标签</label>
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
