import React, { useState, useEffect } from 'react';

const InstallPWAButton: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    // Captura o evento 'beforeinstallprompt'
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('Usuário aceitou a instalação do PWA');
      } else {
        console.log('Usuário recusou a instalação do PWA');
      }
      setDeferredPrompt(null);
      setIsVisible(false);
    }
  };

  return (
    isVisible && (
      <button onClick={handleInstallClick}  className="bg-[#334155] text-white px-4 py-2 rounded-md hover:bg-[#9ca3af] hover:text-[#0f172a] transition-colors">
        Instalar App
      </button>
    )
  );
};

export default InstallPWAButton;
