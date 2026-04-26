import { useState, useEffect } from 'react';
import { getTimeRemaining } from '../../lib/utils';

interface CountdownTimerProps {
  endDate: string | Date;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
}

export function CountdownTimer({ endDate, className = '', size = 'md', showLabels = true }: CountdownTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(getTimeRemaining(endDate));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(getTimeRemaining(endDate));
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [endDate]);

  if (timeRemaining.isEnded) {
    return (
      <div className={`text-center ${className}`}>
        <span className="text-xl font-medium text-secondary-light dark:text-secondary-dark">
          Collection Ended
        </span>
      </div>
    );
  }

  const sizes = {
    sm: 'text-sm px-2 py-1',
    md: 'text-base px-3 py-2',
    lg: 'text-lg px-4 py-3',
  };

  const numberSizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  const labelSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className={`inline-flex items-center gap-1 bg-black/80 dark:bg-white/10 rounded-lg backdrop-blur-sm ${sizes[size]} ${className}`}>
      {timeRemaining.days > 0 && (
        <div className="flex items-center">
          <span className={`font-bold text-white dark:text-primary-dark ${numberSizes[size]}`}>
            {timeRemaining.days}
          </span>
          {showLabels && <span className={`ml-1 text-white/70 dark:text-primary-dark/70 ${labelSizes[size]}`}>d</span>}
          <span className="mx-1 text-white/30 dark:text-primary-dark/30">:</span>
        </div>
      )}
      <div className="flex items-center">
        <span className={`font-bold text-white dark:text-primary-dark ${numberSizes[size]}`}>
          {String(timeRemaining.hours).padStart(2, '0')}
        </span>
        {showLabels && <span className={`ml-1 text-white/70 dark:text-primary-dark/70 ${labelSizes[size]}`}>h</span>}
        <span className="mx-1 text-white/30 dark:text-primary-dark/30">:</span>
      </div>
      <div className="flex items-center">
        <span className={`font-bold text-white dark:text-primary-dark ${numberSizes[size]}`}>
          {String(timeRemaining.minutes).padStart(2, '0')}
        </span>
        {showLabels && <span className={`ml-1 text-white/70 dark:text-primary-dark/70 ${labelSizes[size]}`}>m</span>}
      </div>
    </div>
  );
}