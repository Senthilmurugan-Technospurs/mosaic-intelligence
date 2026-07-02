'use client';

import React, { createContext, useCallback, useContext, useState } from 'react';

type Toast = { id: number; text: string; type: 'success' | 'error' | 'info' };

const ToastCtx = createContext<(text: string, type?: Toast['type']) => void>(() => {});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Toast[]>([]);
  const push = useCallback((text: string, type: Toast['type'] = 'info') => {
    const id = Date.now();
    setItems((prev) => [...prev, { id, text, type }]);
    setTimeout(() => setItems((prev) => prev.filter((t) => t.id !== id)), 2800);
  }, []);
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
        {items.map((t) => (
          <div
            key={t.id}
            className={`rounded-xl px-4 py-2.5 text-sm font-medium shadow-lg text-white pointer-events-auto ${
              t.type === 'success' ? 'bg-emerald-600' : t.type === 'error' ? 'bg-red-600' : 'bg-slate-700'
            }`}
          >
            {t.text}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export function useToast() {
  return useContext(ToastCtx);
}
