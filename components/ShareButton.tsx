
import React from 'react';

const ShareButton: React.FC<{ variant?: 'icon' | 'full' }> = ({ variant = 'icon' }) => {
  const handleShare = async () => {
    // Some sandbox environments provide URLs that the Share API considers "Invalid"
    // (e.g., blob:, about:srcdoc, or local paths).
    let url = window.location.href;
    const isPotentiallyInvalid = !url.startsWith('http') || url.includes('srcdoc');

    const shareData: ShareData = {
      title: 'CVI.CHE 105 Training Academy',
      text: '¡Hola! Entra aquí para estudiar los manuales de CVI.CHE 105 con nuestro Manager IA.',
    };

    // Only attach the URL to shareData if it looks like a standard web URL
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
      // Check if the browser supports sharing and if the specific data is shareable
      if (navigator.share && (!navigator.canShare || navigator.canShare(shareData))) {
        await navigator.share(shareData);
      } else {
        await fallbackCopyToClipboard();
      }
    } catch (err) {
      // If sharing fails for any reason (like "Invalid URL"), fall back to clipboard
      console.warn('Native share failed or was cancelled:', err);
      // We only fall back if it wasn't a user cancellation
      if (err instanceof Error && err.name !== 'AbortError') {
        await fallbackCopyToClipboard();
      }
    }
  };

  if (variant === 'full') {
    return (
      <button
        onClick={handleShare}
        className="flex items-center justify-center gap-2 bg-white text-slate-900 border border-slate-200 py-3 px-6 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all shadow-sm"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        Compartir con el Equipo
      </button>
    );
  }

  return (
    <button
      onClick={handleShare}
      className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
      title="Compartir App"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
      </svg>
    </button>
  );
};

export default ShareButton;
