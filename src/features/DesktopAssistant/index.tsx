'use client';

import { useEffect, useRef, useState } from 'react';

export const DesktopAssistant = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const objectRef = useRef<HTMLObjectElement>(null);
  const [currentSvg, setCurrentSvg] = useState('clawd-idle-follow.svg');
  const [isReacting, setIsReacting] = useState(false);
  const clickCount = useRef(0);
  const clickTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isReacting || !objectRef.current) return;
      const svgDoc = objectRef.current.contentDocument;
      if (!svgDoc) return;

      const eyeTarget = svgDoc.getElementById('eyes-js');
      const bodyTarget = svgDoc.getElementById('body-js');
      const shadowTarget = svgDoc.getElementById('shadow-js');

      // Calculate relative pointing
      const rect = objectRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;

      // Dampen movement
      const distance = Math.min(Math.sqrt(dx * dx + dy * dy), 300);
      const angle = Math.atan2(dy, dx);

      const moveX = Math.cos(angle) * (distance / 30);
      const moveY = Math.sin(angle) * (distance / 30);

      if (eyeTarget) {
        eyeTarget.style.transform = `translate(${moveX}px, ${moveY}px)`;
      }
      if (bodyTarget || shadowTarget) {
        const bdx = Math.round(moveX * 0.33 * 2) / 2;
        const bdy = Math.round(moveY * 0.33 * 2) / 2;
        if (bodyTarget) bodyTarget.style.transform = `translate(${bdx}px, ${bdy}px)`;
        if (shadowTarget) {
          const absDx = Math.abs(bdx);
          const scaleX = 1 + absDx * 0.15;
          const shiftX = Math.round(bdx * 0.3 * 2) / 2;
          shadowTarget.style.transform = `translate(${shiftX}px, 0) scaleX(${scaleX})`;
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isReacting]);

  const handleClick = (e: React.MouseEvent) => {
    if (isReacting) return;

    clickCount.current += 1;
    if (clickTimer.current) clearTimeout(clickTimer.current);

    const rect = e.currentTarget.getBoundingClientRect();
    const isLeft = e.clientX < rect.left + rect.width / 2;

    if (clickCount.current >= 4) {
      triggerReaction('clawd-react-double.svg', 3500);
    } else if (clickCount.current >= 2) {
      clickTimer.current = setTimeout(() => {
        triggerReaction(isLeft ? 'clawd-react-left.svg' : 'clawd-react-right.svg', 2500);
      }, 400);
    } else {
      clickTimer.current = setTimeout(() => {
        clickCount.current = 0;
      }, 400);
    }
  };

  const triggerReaction = (svgName: string, duration: number) => {
    setIsReacting(true);
    clickCount.current = 0;
    setCurrentSvg(svgName);

    // Reset eye targets to default so they don't get stuck
    if (objectRef.current?.contentDocument) {
      const eyeTarget = objectRef.current.contentDocument.getElementById('eyes-js');
      if (eyeTarget) eyeTarget.style.transform = 'translate(0px, 0px)';
    }

    setTimeout(() => {
      setCurrentSvg('clawd-idle-follow.svg');
      setIsReacting(false);
    }, duration);
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 9999,
        cursor: 'pointer',
        width: 140,
        height: 140,
        transition: 'transform 0.2s ease',
      }}
      onClick={handleClick}
      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
    >
      <object
        data={`/assets/clawd/${currentSvg}`}
        id="clawd"
        ref={objectRef}
        type="image/svg+xml"
        style={{
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};

export default DesktopAssistant;
