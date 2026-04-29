"use client";

import React, { useState, useRef, useEffect } from "react";
import { Upload, FileImage, X, Download, Loader2, AlertCircle } from "lucide-react";
import { GlassCard } from "@/shared/components/ui/GlassCard";
import { cn } from "@/shared/lib/utils";
import { apiFetch } from "@/shared/lib/api";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FORMATS = ["JPG", "PNG"];

export function ImageConverterTool() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [format, setFormat] = useState("JPG");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    };
  }, [previewUrl, downloadUrl]);

  const handleFileChange = (selectedFile: File) => {
    setError(null);
    setDownloadUrl(null);

    if (selectedFile.size > MAX_FILE_SIZE) {
      setError("El archivo es demasiado grande. Máximo 5MB.");
      return;
    }

    if (!selectedFile.type.startsWith("image/")) {
      setError("Por favor, selecciona un archivo de imagen válido.");
      return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    
    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFileChange(droppedFile);
  };

  const handleConvert = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("format", format);

    try {
      const blob = await apiFetch<Blob>('/api/v1/tools/convert-image', {
        method: "POST",
        body: formData,
        responseType: 'blob'
      });

      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
    } catch (err) {
      setError("No se pudo convertir la imagen. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!downloadUrl) return;
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = `navajagt-convertida.${format.toLowerCase()}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    // La limpieza se maneja en el useEffect o al resetear
  };

  const reset = () => {
    setFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setPreviewUrl(null);
    setDownloadUrl(null);
    setError(null);
  };

  return (
    <div className="mx-auto w-full max-w-xl">
      <GlassCard 
        className={cn(
          "relative overflow-hidden transition-all duration-300 border-2 border-dashed",
          isDragging ? "border-brand-turquoise bg-brand-turquoise/5 scale-[1.02]" : "border-slate-200 bg-white",
          !file && "cursor-pointer hover:border-brand-turquoise/50"
        )}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        onClick={() => !file && fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*"
          onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
        />

        {!file ? (
          <div className="py-12 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 text-slate-400">
              <Upload size={32} />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Arrastra tu imagen aquí</h4>
            <p className="text-sm text-slate-500 mt-2">o haz clic para seleccionar (Máx. 5MB)</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl relative">
              <button 
                onClick={(e) => { e.stopPropagation(); reset(); }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 shadow-sm transition-colors"
              >
                <X size={14} />
              </button>
              
              {previewUrl && (
                <div className="w-20 h-20 rounded-xl overflow-hidden border border-slate-200 bg-white flex-shrink-0">
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">{file.name}</p>
                <p className="text-xs text-slate-500 mt-1">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-700">Convertir a:</span>
                <select 
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-brand-turquoise/20"
                >
                  {ALLOWED_FORMATS.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>

              {!downloadUrl ? (
                <button
                  onClick={(e) => { e.stopPropagation(); handleConvert(); }}
                  disabled={loading}
                  className="w-full h-14 bg-brand-turquoise text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <FileImage size={20} />}
                  {loading ? "Procesando..." : "Convertir ahora"}
                </button>
              ) : (
                <button
                  onClick={(e) => { e.stopPropagation(); handleDownload(); }}
                  className="w-full h-14 bg-emerald-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-emerald-500/20"
                >
                  <Download size={20} />
                  Descargar {format}
                </button>
              )}
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-sm font-medium animate-in fade-in slide-in-from-top-2">
            <AlertCircle size={18} />
            {error}
          </div>
        )}
      </GlassCard>
    </div>
  );
}
