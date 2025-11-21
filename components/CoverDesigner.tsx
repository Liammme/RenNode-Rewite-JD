import React, { useState, useRef, useEffect, useCallback } from 'react';
import { CoverConfig } from '../types';

const CoverDesigner: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [config, setConfig] = useState<CoverConfig>({
    title: '小众外企',
    subtitle: '正在招',
    highlight: '中国小伙伴(远程)',
    image: null,
  });

  // Pre-load a placeholder if no image is selected
  useEffect(() => {
    if (!config.image) {
        // No default image logic needed, canvas will just be colored background
    }
  }, [config.image]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setConfig((prev) => ({ ...prev, image: event.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // XHS Aspect Ratio 3:4 (e.g., 900x1200)
    const width = 900;
    const height = 1200;
    canvas.width = width;
    canvas.height = height;

    // 1. Background
    ctx.fillStyle = '#f3f4f6'; // light gray default
    ctx.fillRect(0, 0, width, height);

    // 2. Draw Image (if exists)
    if (config.image) {
      const img = new Image();
      img.src = config.image;
      img.onload = () => {
        // Draw image to cover text area or split
        // Style: Full height image with bottom gradient fade for text
        const imgRatio = img.width / img.height;
        const canvasRatio = width / height;
        
        let renderWidth, renderHeight, offsetX, offsetY;

        if (imgRatio > canvasRatio) {
            renderHeight = height;
            renderWidth = height * imgRatio;
            offsetY = 0;
            offsetX = (width - renderWidth) / 2; // Center horizontally
        } else {
            renderWidth = width;
            renderHeight = width / imgRatio;
            offsetX = 0;
            offsetY = (height - renderHeight) / 2; // Center vertically
        }

        ctx.drawImage(img, offsetX, offsetY, renderWidth, renderHeight);
        
        // Add gradient overlay at bottom to make text pop
        const gradient = ctx.createLinearGradient(0, height * 0.5, 0, height);
        gradient.addColorStop(0, 'rgba(255,255,255,0)');
        gradient.addColorStop(0.4, 'rgba(255,255,255,0.8)');
        gradient.addColorStop(1, 'rgba(255,255,255,1)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, height * 0.5, width, height * 0.5);

        drawText(ctx, width, height);
      };
    } else {
       // Fallback text drawing if no image yet
       drawText(ctx, width, height);
    }
  }, [config]);

  const drawText = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const textCenter = width / 2;
    const startY = height * 0.75; // Text area starts lower 1/3

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Line 1: Title (e.g., 小众外企)
    ctx.font = 'bold 100px "Noto Sans SC"';
    ctx.fillStyle = '#374151'; // Gray 700
    ctx.shadowColor = "rgba(255, 255, 255, 1)";
    ctx.shadowBlur = 0;
    ctx.fillText(config.title, textCenter, startY - 100);

    // Line 2: Subtitle (e.g., 正在招)
    ctx.font = 'bold 100px "Noto Sans SC"';
    ctx.fillStyle = '#374151';
    ctx.fillText(config.subtitle, textCenter, startY + 20);

    // Line 3: Highlight (e.g., 中国小伙伴(远程))
    ctx.font = 'bold 110px "Noto Sans SC"';
    ctx.fillStyle = '#ef4444'; // Red 500 (XHS Red-ish)
    ctx.fillText(config.highlight, textCenter, startY + 150);
  };

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'xhs-cover.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col h-full">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <span>🎨</span> 封面制作 (Cover Designer)
      </h2>

      <div className="flex-1 flex flex-col xl:flex-row gap-8">
        {/* Inputs */}
        <div className="flex-1 space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">背景图片</label>
                <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition cursor-pointer">
                    <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageUpload} 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="text-gray-500">
                        {config.image ? "点击更换图片" : "点击上传背景图 (推荐竖版)"}
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">第一行文案 (灰色)</label>
                <input 
                    type="text" 
                    value={config.title}
                    onChange={(e) => setConfig(p => ({...p, title: e.target.value}))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                    placeholder="例如：小众外企"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">第二行文案 (灰色)</label>
                <input 
                    type="text" 
                    value={config.subtitle}
                    onChange={(e) => setConfig(p => ({...p, subtitle: e.target.value}))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                    placeholder="例如：正在招"
                />
            </div>

             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">第三行强调 (红色)</label>
                <input 
                    type="text" 
                    value={config.highlight}
                    onChange={(e) => setConfig(p => ({...p, highlight: e.target.value}))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none text-red-500 font-medium"
                    placeholder="例如：中国小伙伴(远程)"
                />
            </div>

             <button 
                onClick={handleDownload}
                className="w-full bg-gray-900 hover:bg-black text-white font-bold py-3 rounded-lg transition mt-4 flex items-center justify-center gap-2"
             >
                <span>⬇️</span> 下载封面图
             </button>
        </div>

        {/* Preview */}
        <div className="flex-1 flex justify-center bg-gray-100 rounded-lg p-4 items-center">
             <div className="relative shadow-xl rounded-md overflow-hidden" style={{ width: '300px', height: '400px' }}>
                 <canvas 
                    ref={canvasRef} 
                    className="w-full h-full object-contain"
                    style={{ width: '100%', height: '100%' }}
                 />
             </div>
        </div>
      </div>
    </div>
  );
};

export default CoverDesigner;
