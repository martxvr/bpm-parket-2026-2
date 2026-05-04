import { cn } from '@/lib/cn';
import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  className?: string;
  size?: 'narrow' | 'default' | 'wide';
};

const SIZE = { narrow: 'max-w-2xl', default: 'max-w-6xl', wide: 'max-w-7xl' };

export function Container({ children, className, size = 'default' }: Props) {
  return (
    <div className={cn('mx-auto px-6', SIZE[size], className)}>{children}</div>
  );
}
