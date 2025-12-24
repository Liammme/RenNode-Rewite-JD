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
              src="https://cdn-fusion.imgcdn.store/i/2025/50a8d72082a7f411.png" 
              alt="Talentverse X" 
              className="h-8 w-auto object-contain"
              referrerPolicy="no-referrer"
            />
            
            <div className="h-5 w-px bg-gray-300 hidden sm:block"></div>
            
            <h1 className="font-bold text-xl text-gray-900 tracking-tight">
              Talentvere X-工作助手
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
              <p className="text-gray-500 mt-2">爆款标题/文案转写/自动提取流量Tag</p>
           </div>
           <JobGenerator />
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 bg-[#f8fafc] mt-auto border-t border-gray-100/50">
        <div className="max-w-3xl mx-auto px-4 text-center space-y-2">
           <p className="text-xs text-gray-400 leading-relaxed">
             🚀一家由AI驱动的前沿Web3 / AI 量化领域的猎头公司
           </p>
           <p className="text-xs text-gray-400 leading-relaxed">
             💥小红书招聘文案爆款改写
           </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
