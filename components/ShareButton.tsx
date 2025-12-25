
import React from 'react';

const ShareButton: React.FC<{ variant?: 'icon' | 'full' }> = ({ variant = 'icon' }) => {
  const handleShare = async () => {
    let url = window.location.href;
    const isPotentiallyInvalid = !url.startsWith('http') || url.includes('srcdoc');

    const shareData: ShareData = {
      title: 'CVI.CHE 105 Training Academy',
      text: '¡Hola! Entra aquí para estudiar los manuales de CVI.CHE 105 con nuestro Manager IA.',
    };

    if (!isPotentiallyInvalid) {
      shareData.url = url;
    }

    const fallbackCopyToClipboard = async () => {
      try {
        await navigator.clipboard.writeText(url);
        alert('Enlace copiado al portapapeles. ¡Ya puedes pegarlo en WhatsApp!');
      } catch (clipErr) {
        console.error('Clipboard copy failed:', clipErr);
        alert('No se pudo compartir. Por favor, copia la URL de tu navegador manualmente.');
      }
    };

    try {
      if (navigator.share && (!navigator.canShare || navigator.canShare(shareData))) {
        await navigator.share(shareData);
      } else {
        await fallbackCopyToClipboard();
      }
    } catch (err) {
      console.warn('Native share failed or was cancelled:', err);
      if (err instanceof Error && err.name !== 'AbortError') {
        await fallbackCopyToClipboard();
      }
    }
  };

  // Fix: Completed the missing return statement and added the default export
  if (variant === 'full') {
    return (
      <button
        onClick={handleShare}
        className="flex items-center justify-center gap-2 bg-white text-slate-900 border border-slate-200 py-3 px-6 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all shadow-sm"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        Compartir
      </button>
    );
  }

  return (
    <button
      onClick={handleShare}
      className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
      </svg>
    </button>
  );
};

export default ShareButton;
