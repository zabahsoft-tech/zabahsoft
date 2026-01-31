
import React, { useState, useEffect, useRef } from 'react';

const CustomCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  
  const mousePos = useRef({ x: 0, y: 0 });
  const delayedPos = useRef({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    // Disable on touch devices
    const canHover = window.matchMedia('(hover: hover)').matches;
    if (!canHover) return;

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);
      
      const target = e.target as HTMLElement;
      const isLink = target.tagName === 'A' || 
                     target.tagName === 'BUTTON' || 
                     target.closest('button') !== null || 
                     target.closest('a') !== null ||
                     target.getAttribute('role') === 'button' ||
                     target.tagName === 'INPUT' ||
                     target.tagName === 'TEXTAREA' ||
                     target.tagName === 'SELECT';
      
      setIsHovering(isLink);
    };

    const onMouseDown = () => setIsClicked(true);
    const onMouseUp = () => setIsClicked(false);
    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    const animate = () => {
      // Linear Interpolation (LERP) for weighted movement
      const lerpFactor = 0.15; 
      
      delayedPos.current.x += (mousePos.current.x - delayedPos.current.x) * lerpFactor;
      delayedPos.current.y += (mousePos.current.y - delayedPos.current.y) * lerpFactor;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0)`;
      }
      
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${delayedPos.current.x}px, ${delayedPos.current.y}px, 0)`;
      }

      requestRef.current = requestAnimationFrame(animate);
    };
    
    requestRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="hidden lg:block pointer-events-none fixed inset-0 z-[999999]">
      {/* Outer Magnetic Ring */}
      <div 
        ref={ringRef}
        className={`absolute top-0 left-0 w-10 h-10 -ml-5 -mt-5 border-2 rounded-full transition-all duration-300 ease-out will-change-transform flex items-center justify-center ${
          isHovering ? 'scale-[2.4] border-blue-400 bg-blue-400/10 backdrop-blur-[1px]' : 'scale-100 border-blue-500/40'
        } ${isClicked ? 'scale-[0.8] opacity-50' : ''}`}
      />
      
      {/* Inner Precision Dot */}
      <div 
        ref={dotRef}
        className={`absolute top-0 left-0 w-2 h-2 -ml-1 -mt-1 rounded-full transition-colors duration-300 will-change-transform ${
          isHovering ? 'bg-white' : 'bg-blue-600'
        }`}
      />
    </div>
  );
};

export default CustomCursor;
