'use client';

import React, { useRef, useState, useEffect } from 'react';
import { toPng } from 'html-to-image';
import type { OrderWithFinancials, WorkshopSettings } from '@/lib/data-access/types';

interface StoryShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: OrderWithFinancials;
  settings: WorkshopSettings;
}

export default function StoryShareModal({ isOpen, onClose, order, settings }: StoryShareModalProps) {
  const storyRef = useRef<HTMLDivElement>(null);
  const isGeneratingRef = useRef(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => generateImage('preview'), 500);
    } else {
      document.body.style.overflow = 'auto';
      setPreviewUrl(null);
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  if (!isOpen) return null;

  const generateImage = async (action: 'preview' | 'download' | 'facebook' | 'whatsapp' = 'preview') => {
    const isPreview = action === 'preview';
    if (!storyRef.current || (!isPreview && isGeneratingRef.current)) return;
    
    try {
      if (!isPreview) {
        setIsGenerating(true);
        isGeneratingRef.current = true;
      }
      
      const dataUrl = await toPng(storyRef.current, {
        quality: 1.0,
        pixelRatio: 2,
        cacheBust: true,
      });

      if (isPreview) {
        setPreviewUrl(dataUrl);
      } else {
        downloadOrShare(dataUrl, action);
      }
    } catch (err) {
      console.error('Erreur lors de la génération de l\'image', err);
      if (!isPreview) alert("Une erreur est survenue lors de la génération de l'image.");
    } finally {
      if (!isPreview) {
        setIsGenerating(false);
        isGeneratingRef.current = false;
      }
    }
  };

  const downloadOrShare = async (dataUrl: string, action: 'download' | 'facebook' | 'whatsapp') => {
    const filename = `creation-${order.reference}.png`;

    try {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

      if (isMobile && action !== 'download' && navigator.share) {
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], filename, { type: 'image/png' });
        
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: `Création ${settings.workshopName}`,
            text: `Découvrez notre nouvelle création : ${order.garmentType}`,
            files: [file],
          });
          return;
        }
      }
      
      // Fallback for PC: Download the image
      const link = document.createElement('a');
      link.download = filename;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // After download on PC, open the requested social network
      if (action === 'facebook') {
        setTimeout(() => window.open('https://www.facebook.com/', '_blank'), 500);
      } else if (action === 'whatsapp') {
        setTimeout(() => window.open('https://web.whatsapp.com/', '_blank'), 500);
      }
    } catch (err) {
      console.error('Erreur de partage/téléchargement', err);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white z-10 shrink-0">
          <h3 className="text-lg font-bold text-gray-900">Partager en Story</h3>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
            <span aria-hidden="true" className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto bg-gray-50 flex-1 flex flex-col items-center relative">
          
          <div className="absolute top-[-9999px] left-[-9999px]">
            <div 
              ref={storyRef}
              className="w-[1080px] h-[1920px] bg-gradient-to-br from-brand/90 to-midnight flex flex-col justify-between p-16 overflow-hidden relative"
              style={{
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}
            >
              <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
              
              <div className="relative z-10 flex flex-col items-center pt-20">
                {settings.logoUrl && (
                  <img src={settings.logoUrl} alt="Logo" className="w-48 h-48 rounded-full object-cover border-8 border-white/20 mb-8 shadow-xl" crossOrigin="anonymous" />
                )}
                <h1 className="text-white text-7xl font-bold mb-4 tracking-tight text-center drop-shadow-md">
                  {settings.workshopName || "AZ-TAILOR"}
                </h1>
                <p className="text-white/80 text-4xl uppercase tracking-[0.3em] font-light mb-16">
                  {settings.slogan || "Création Sur-Mesure"}
                </p>
                
                <div className="bg-white/10 backdrop-blur-md rounded-3xl p-12 w-full max-w-3xl border border-white/20 shadow-2xl text-center">
                  <h2 className="text-white/70 text-3xl font-medium uppercase tracking-widest mb-4">Nouvelle Création</h2>
                  <p className="text-white text-6xl font-bold leading-tight drop-shadow-sm">
                    {order.garmentType}
                  </p>
                  <div className="mt-8 pt-8 border-t border-white/20 flex justify-center items-center gap-4 text-white/90">
                    <span aria-hidden="true" className="material-symbols-outlined text-4xl">check_circle</span>
                    <span className="text-3xl font-medium">Prêt pour {order.client.firstName} !</span>
                  </div>
                </div>
              </div>

              <div className="relative z-10 flex flex-col items-center pb-12">
                <div className="bg-black/40 backdrop-blur-md rounded-2xl px-10 py-6 flex items-center gap-6 border border-white/10">
                  <span aria-hidden="true" className="material-symbols-outlined text-white text-4xl">rocket_launch</span>
                  <div className="text-left">
                    <p className="text-white/60 text-xl font-medium uppercase tracking-widest mb-1">Géré avec l'application</p>
                    <p className="text-white text-3xl font-bold tracking-tight">AZ-TAILOR</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {previewUrl ? (
            <img src={previewUrl} alt="Aperçu Story" className="w-full max-w-[280px] sm:max-w-[320px] rounded-xl shadow-lg border border-gray-200" />
          ) : (
            <div className="w-full max-w-[280px] sm:max-w-[320px] aspect-[9/16] bg-gray-200 rounded-xl animate-pulse flex items-center justify-center">
              <span className="text-gray-400 font-medium">Génération de l'aperçu...</span>
            </div>
          )}

          <p className="text-sm text-center text-gray-500 mt-6 max-w-sm">
            Cette image est optimisée pour les formats Story (Instagram, WhatsApp, Facebook).
          </p>
        </div>

        <div className="p-4 border-t border-gray-100 bg-white grid grid-cols-2 gap-3 shrink-0">
          <button
            onClick={() => generateImage('facebook')}
            disabled={isGenerating || !previewUrl}
            className="py-3 px-4 bg-[#1877F2] hover:bg-[#1877F2]/90 text-white font-medium rounded-xl transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span aria-hidden="true" className="material-symbols-outlined text-[20px]">thumb_up</span>
            Facebook
          </button>
          <button
            onClick={() => generateImage('whatsapp')}
            disabled={isGenerating || !previewUrl}
            className="py-3 px-4 bg-[#25D366] hover:bg-[#25D366]/90 text-white font-medium rounded-xl transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span aria-hidden="true" className="material-symbols-outlined text-[20px]">chat</span>
            WhatsApp
          </button>
          <button
            onClick={() => generateImage('download')}
            disabled={isGenerating || !previewUrl}
            className="col-span-2 py-3 px-4 bg-brand hover:bg-[#a07c4c] text-white font-medium rounded-xl transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isGenerating ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <span aria-hidden="true" className="material-symbols-outlined text-[20px]">download</span>
            )}
            Télécharger l'image
          </button>
          <button
            onClick={onClose}
            className="col-span-2 py-2 px-4 text-gray-500 hover:text-gray-700 font-medium transition-colors text-sm"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
