import React from 'react';
import JobGenerator from './components/JobGenerator';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm shrink-0">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Logo */}
            <img 
              src="https://cdn-fusion.imgcdn.store/i/2025/157f6c4ce88e2edc.png" 
              alt="Web3Pass" 
              className="h-8 w-auto object-contain"
              referrerPolicy="no-referrer"
            />
            
            <div className="h-5 w-px bg-gray-300 hidden sm:block"></div>
            
            <h1 className="font-bold text-xl text-gray-900 tracking-tight">
              链岛Jobs-工作助手
            </h1>
          </div>
          <div className="text-xs font-medium text-gray-400 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
             Powered by @Xiki
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow w-full">
        <div className="space-y-8">
           <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">小红书风格招聘文案生成</h2>
              <p className="text-gray-500 mt-2">一键将 JD 转换为小红书爆款文案，支持自动排版与标签生成</p>
           </div>
           <JobGenerator />
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 bg-[#f8fafc] mt-auto border-t border-gray-100/50">
        <div className="max-w-3xl mx-auto px-4 text-center space-y-2">
           <p className="text-xs text-gray-400 leading-relaxed">
             🚀Web3Pass帮助Web2-Web3的成功转型，安全抓住区块链新机会，只做离钱最近的技能赋能！
           </p>
           <p className="text-xs text-gray-400 leading-relaxed">
             💥每周大咖开讲 | 万字转型资料 | 求职内推，带你玩转Web3未来 V：Web3Pass
           </p>
        </div>
      </footer>
    </div>
  );
};

export default App;