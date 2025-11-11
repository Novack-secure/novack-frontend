import ReactDOMServer from 'react-dom/server';
import { MapPin } from 'lucide-react';

export const createMapPinElement = (userName: string, primaryColor: string = '#0386d9'): HTMLElement => {
  const container = document.createElement('div');
  container.style.position = 'relative';
  container.style.cursor = 'pointer';
  container.style.display = 'flex';
  container.style.alignItems = 'center';
  container.style.justifyContent = 'center';
  const foregroundColor = '#ffffff'; // --sidebar-foreground
  const glowColor = primaryColor; // --sidebar-ring

  const iconHtml = ReactDOMServer.renderToString(
    <MapPin
      size={48}
      fill={primaryColor}
      stroke={foregroundColor}
      strokeWidth={1.5}
      style={{
        filter: `drop-shadow(0 0 10px ${glowColor})`, // Efecto de brillo futurista
        transform: 'translate(-50%, -100%)', // Centra el pin en su punta
        position: 'absolute',
        top: '50%',
        left: '50%',
      }}
    />
  );

  container.innerHTML = iconHtml;

  const label = document.createElement('div');
  label.textContent = userName;
  label.style.position = 'absolute';
  label.style.bottom = '-10px'; 
  label.style.left = '50%';
  label.style.transform = 'translateX(-50%)';
  label.style.backgroundColor = 'rgba(0, 0, 0, 0.75)';
  label.style.color = foregroundColor;
  label.style.padding = '4px 8px';
  label.style.borderRadius = '4px';
  label.style.fontSize = '12px';
  label.style.whiteSpace = 'nowrap';
  label.style.border = `1px solid ${primaryColor}`;

  container.appendChild(label);

  const style = document.createElement('style');
  style.textContent = `
    @keyframes pulse-glow {
      0% { filter: drop-shadow(0 0 10px ${glowColor}); }
      50% { filter: drop-shadow(0 0 20px ${glowColor}); }
      100% { filter: drop-shadow(0 0 10px ${glowColor}); }
    }
    .futuristic-marker svg {
      animation: pulse-glow 2s infinite;
    }
  `;
  if (!document.head.querySelector('style[data-futuristic-marker]')) {
    style.setAttribute('data-futuristic-marker', 'true');
    document.head.appendChild(style);
  }
  container.classList.add('futuristic-marker');

  return container;
};
