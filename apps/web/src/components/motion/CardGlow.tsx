'use client';

import { startCardGlowTracking } from '@/lib/motion/card-glow';
import { useEffect } from 'react';

/** Sıfır-DOM bileşen — yalnızca global imleç-parıltı dinleyicisini bağlar. */
export function CardGlow() {
  useEffect(() => startCardGlowTracking(), []);
  return null;
}
