'use client';

import { useState, useEffect, useCallback } from 'react';

export function usePictureInPicture() {
  const [pipWindow, setPipWindow] = useState<Window | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported(!!window.documentPictureInPicture);
  }, []);

  // Mantém a classe de tema (dark/light) sincronizada com a janela principal
  useEffect(() => {
    if (!pipWindow) return;

    const syncTheme = () => {
      pipWindow.document.documentElement.className =
        document.documentElement.className;
    };

    syncTheme();
    const observer = new MutationObserver(syncTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, [pipWindow]);

  const openPip = useCallback(async (width = 340, height = 460) => {
    if (!window.documentPictureInPicture) return;

    const pip = await window.documentPictureInPicture.requestWindow({ width, height });

    // Copia todos os estilos para a janela PiP
    [...document.styleSheets].forEach((sheet) => {
      try {
        const css = [...sheet.cssRules].map((r) => r.cssText).join('');
        const style = pip.document.createElement('style');
        style.textContent = css;
        pip.document.head.appendChild(style);
      } catch {
        if (sheet.href) {
          const link = pip.document.createElement('link');
          link.rel = 'stylesheet';
          link.href = sheet.href;
          pip.document.head.appendChild(link);
        }
      }
    });

    // Copia variáveis CSS do tema
    const themeStyle = pip.document.createElement('style');
    themeStyle.textContent = `
      * { box-sizing: border-box; }
      html, body { margin: 0; min-height: 100%; background: var(--background); font-family: var(--font-inter, ui-sans-serif, system-ui, sans-serif); }
    `;
    pip.document.head.appendChild(themeStyle);

    pip.document.documentElement.className = document.documentElement.className;

    pip.addEventListener('pagehide', () => setPipWindow(null));
    setPipWindow(pip);
  }, []);

  const closePip = useCallback(() => {
    pipWindow?.close();
    setPipWindow(null);
  }, [pipWindow]);

  return { pipWindow, isSupported, isOpen: !!pipWindow, openPip, closePip };
}
