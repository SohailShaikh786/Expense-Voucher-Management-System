import React, { useRef, useState, useEffect } from 'react';
import { PenTool, Upload, X, RotateCcw, Check } from 'lucide-react';

export default function SignatureModal({ isOpen, onClose, onSave, title = "Sign Voucher" }) {
  const [activeTab, setActiveTab] = useState('draw'); // 'draw' | 'upload'
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (isOpen && activeTab === 'draw' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }
  }, [isOpen, activeTab]);

  if (!isOpen) return null;

  // Drawing pad handlers
  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => setFilePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleConfirm = () => {
    if (activeTab === 'draw') {
      if (!hasDrawn) {
        alert('Please draw your signature before saving.');
        return;
      }
      const canvas = canvasRef.current;
      const base64 = canvas.toDataURL('image/png');
      onSave({ type: 'base64', data: base64 });
      onClose();
    } else {
      if (!selectedFile) {
        alert('Please select a signature image file.');
        return;
      }
      onSave({ type: 'file', file: selectedFile, preview: filePreview });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <PenTool className="w-5 h-5 text-brand-600" />
            <h3 className="font-semibold text-slate-800">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-sm font-medium">
          <button
            onClick={() => setActiveTab('draw')}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 border-b-2 transition-colors ${
              activeTab === 'draw'
                ? 'border-brand-600 text-brand-700 bg-white font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <PenTool className="w-4 h-4" />
            Draw Signature
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 border-b-2 transition-colors ${
              activeTab === 'upload'
                ? 'border-brand-600 text-brand-700 bg-white font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Upload className="w-4 h-4" />
            Upload File
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {activeTab === 'draw' ? (
            <div>
              <div className="border-2 border-dashed border-slate-300 rounded-xl bg-slate-50/60 overflow-hidden relative cursor-crosshair">
                <canvas
                  ref={canvasRef}
                  width={460}
                  height={180}
                  className="w-full h-44 touch-none"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                />
                {!hasDrawn && (
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-slate-400 text-sm">
                    Draw your signature here with mouse or touch
                  </div>
                )}
              </div>
              <div className="flex justify-between items-center mt-3">
                <span className="text-xs text-slate-400">Digital hand-drawn signature</span>
                <button
                  type="button"
                  onClick={clearCanvas}
                  className="text-xs font-medium text-slate-600 hover:text-rose-600 flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-200 hover:border-rose-200 hover:bg-rose-50 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Clear Pad
                </button>
              </div>
            </div>
          ) : (
            <div>
              <label className="border-2 border-dashed border-slate-300 rounded-xl bg-slate-50/60 p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-100/60 transition-colors block">
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp, image/svg+xml"
                  onChange={handleFileChange}
                  className="hidden"
                />
                {filePreview ? (
                  <div className="flex flex-col items-center">
                    <img src={filePreview} alt="Signature Preview" className="h-28 object-contain mb-2" />
                    <span className="text-xs text-brand-600 font-medium">Click to choose a different image</span>
                  </div>
                ) : (
                  <>
                    <Upload className="w-10 h-10 text-slate-400 mb-2" />
                    <span className="text-sm font-semibold text-slate-700">Click to upload signature image</span>
                    <span className="text-xs text-slate-400 mt-1">PNG, JPG, WEBP, or SVG up to 5MB</span>
                  </>
                )}
              </label>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-5 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-sm flex items-center gap-2 transition-colors"
          >
            <Check className="w-4 h-4" />
            Attach Signature
          </button>
        </div>
      </div>
    </div>
  );
}
