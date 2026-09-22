import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import splashArtwork from '../../assets/cmiclt-splash-new.png';

export function Splash() {
  const nav = useNavigate();
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    // Hold, then fade the splash out smoothly before routing to Sign In.
    const fade = setTimeout(() => setLeaving(true), 4500);
    const go = setTimeout(() => nav('/signin', { replace: true }), 5100);
    return () => {
      clearTimeout(fade);
      clearTimeout(go);
    };
  }, [nav]);

  return (
    <div
      className="relative min-h-dvh w-full overflow-hidden transition-opacity duration-500 ease-out"
      style={{ background: '#0b5c37', opacity: leaving ? 0 : 1 }}
    >
      <img
        src={splashArtwork}
        alt="CMI St. Thomas Province Kozhikode"
        className="anim-splash-in absolute inset-0 h-full w-full object-cover object-center"
      />
    </div>
  );
}
