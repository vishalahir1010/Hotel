import React, { useEffect, useState } from 'react';
import { Compass } from 'lucide-react';

export const PremiumLoader = ({ onFinished }) => {
  const [visible, setVisible] = useState(true);
  const [textStage, setTextStage] = useState(0);

  useEffect(() => {
    // Stage text animations
    const t1 = setTimeout(() => setTextStage(1), 500); // "AURELIA"
    const t2 = setTimeout(() => setTextStage(2), 1400); // "AMALFI COAST SANCTUARY"
    const t3 = setTimeout(() => {
      setVisible(false);
      if (onFinished) onFinished();
    }, 2800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onFinished]);

  if (!visible) return null;

  return (
    <div 
      className="loader-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#09090b', // Deep rich luxury dark theme
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '24px',
        animation: 'fadeOutSimple 0.4s ease 2.5s forwards'
      }}
    >
      <div 
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '15px'
        }}
      >
        {/* Shimmering Compass Icon */}
        <Compass 
          size={50} 
          style={{ 
            color: 'var(--gold-primary)', 
            animation: 'loaderSpin 3s infinite cubic-bezier(0.4, 0, 0.2, 1)' 
          }} 
        />
        
        {/* Progressive brand loader */}
        <div style={{ overflow: 'hidden', height: '40px', position: 'relative', width: '300px', display: 'flex', justifyContent: 'center' }}>
          <h2 
            style={{ 
              fontFamily: 'var(--font-serif)',
              fontSize: '1.8rem',
              letterSpacing: '0.15em',
              color: 'var(--text-primary)',
              transform: textStage >= 1 ? 'translateY(0)' : 'translateY(40px)',
              transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            AURELIA
          </h2>
        </div>

        <div style={{ overflow: 'hidden', height: '20px', position: 'relative', width: '300px', display: 'flex', justifyContent: 'center' }}>
          <span 
            style={{ 
              fontSize: '0.65rem',
              letterSpacing: '0.3em',
              color: 'var(--gold-primary)',
              textTransform: 'uppercase',
              transform: textStage >= 2 ? 'translateY(0)' : 'translateY(20px)',
              transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            Amalfi Coast Sanctuary
          </span>
        </div>
      </div>

      {/* Thin Gold Loading Line */}
      <div 
        style={{ 
          width: '120px', 
          height: '1px', 
          backgroundColor: 'rgba(212, 175, 55, 0.1)', 
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '1px',
          marginTop: '10px'
        }}
      >
        <div 
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: '100%',
            width: '40%',
            background: 'linear-gradient(90deg, transparent, var(--gold-primary), transparent)',
            animation: 'loaderBarProgress 1.6s infinite ease-in-out'
          }}
        />
      </div>
    </div>
  );
};
export default PremiumLoader;
