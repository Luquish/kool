import { useEffect, useState } from 'react';

export const TypingIndicator = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % 3);
    }, 400);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2">
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className={`
            h-3 w-3 rounded-full bg-primary/60
            transition-all duration-300 ease-in-out
            ${activeIndex === index ? 'scale-125 opacity-100' : 'scale-100 opacity-50'}
          `}
        />
      ))}
    </div>
  );
}; 