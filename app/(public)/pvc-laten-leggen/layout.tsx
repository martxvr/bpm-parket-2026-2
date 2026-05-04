// Override public chrome — pure ad-landing intent.
import type { ReactNode } from 'react';

export default function LandingLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-white">{children}</div>;
}
