'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

export interface TypewriterTextProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  words: string[];
  typeSpeed?: number;
  deleteSpeed?: number;
  delayBetweenWords?: number;
  loop?: boolean;
  cursor?: boolean;
  cursorChar?: string;
}

const TypewriterText = React.forwardRef<HTMLSpanElement, TypewriterTextProps>(
  (
    {
      words,
      typeSpeed = 150,
      deleteSpeed = 100,
      delayBetweenWords = 2000,
      loop = true,
      cursor = true,
      cursorChar = '|',
      className,
      ...props
    },
    ref
  ) => {
    const [currentWordIndex, setCurrentWordIndex] = React.useState(0);
    const [displayText, setDisplayText] = React.useState('');
    const [isDeleting, setIsDeleting] = React.useState(false);
    const [showCursor, setShowCursor] = React.useState(true);

    React.useEffect(() => {
      if (words.length === 0) return;

      const currentWord = words[currentWordIndex];
      let timeoutId: NodeJS.Timeout;

      if (isDeleting) {
        if (displayText.length > 0) {
          timeoutId = setTimeout(() => {
            setDisplayText(currentWord.substring(0, displayText.length - 1));
          }, deleteSpeed);
        } else {
          setIsDeleting(false);
          setCurrentWordIndex(prevIndex =>
            loop
              ? (prevIndex + 1) % words.length
              : Math.min(prevIndex + 1, words.length - 1)
          );
        }
      } else {
        if (displayText.length < currentWord.length) {
          timeoutId = setTimeout(() => {
            setDisplayText(currentWord.substring(0, displayText.length + 1));
          }, typeSpeed);
        } else if (loop || currentWordIndex < words.length - 1) {
          timeoutId = setTimeout(() => {
            setIsDeleting(true);
          }, delayBetweenWords);
        }
      }

      return () => {
        if (timeoutId) clearTimeout(timeoutId);
      };
    }, [
      currentWordIndex,
      displayText,
      isDeleting,
      words,
      typeSpeed,
      deleteSpeed,
      delayBetweenWords,
      loop,
    ]);

    React.useEffect(() => {
      if (!cursor) return;

      const cursorInterval = setInterval(() => {
        setShowCursor(prev => !prev);
      }, 530);

      return () => clearInterval(cursorInterval);
    }, [cursor]);

    return (
      <span ref={ref} className={cn('inline-block', className)} {...props}>
        {displayText}
        {cursor && (
          <span
            className={cn(
              'ml-0.5 inline-block transition-opacity duration-100',
              showCursor ? 'opacity-100' : 'opacity-0'
            )}
          >
            {cursorChar}
          </span>
        )}
      </span>
    );
  }
);

TypewriterText.displayName = 'TypewriterText';

export { TypewriterText };
